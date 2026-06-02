# [v2] "S/W 시험현황(기타)" 신설 & 검색범위 확장 — 분석보고서

> 작성일: 2026-06-02 · 대상: KOIST(한국정보보안기술원) 홈페이지
> 상태: **분석 전용 (코딩 미실시)** — 사용자 지시 "아직 코딩은 하지마" 준수
> 검증 환경: 로컬 D1 `koist-website-db`, 소스 브랜치 `main`

---

## 0. 사용자 요구사항 정리

| # | 요구사항 | 구현 가능성 |
|---|---------|:---:|
| **A** | 사업분야 **"시험성적서"**의 하위 메뉴에 **"S/W 시험현황"**을 새로 만들기 | ✅ 가능 |
| **B** | 그 카드를 **기타카드**로 만들고, **성능평가 평가현황 표와 똑같은 표** 구조로 표시 | ✅ 가능 |
| **C** | 데이터가 0건이어도 **"기타 0건" 카드를 항상 표시** | ✅ 가능 |
| **D** | **검색 대상에 회사명(company) 포함** (제품명 + 회사명) | ✅ 가능 |

**결론: 4가지 모두 구현 가능합니다.** 아래에 각 항목의 구현 근거·방법·영향 파일을 상세히 정리합니다.

---

## 1. 현재 구조 실측 (이번 분석에서 새로 확인)

### 1-1. "시험성적서" 부서 & 하위메뉴

`departments.slug = 'certificate'`, `name = '시험성적서'`, `is_main_progress = 0`

현재 하위메뉴(`dep_pages`):
| pid | slug | title |
|----|------|------|
| 14 | `overview` | 시험성적서 개요 |
| 15 | `rnd` | R&D 과제검증 |
| 16 | `ai` | AI 성능시험 |
| 17 | `network` | NW 성능시험 |

→ **"S/W 시험현황"은 현재 없음.** 신규 추가 필요. (예: slug `sw-test`)

### 1-2. 하위메뉴 → 화면 렌더링 메커니즘 (중요)

사이드바 메뉴는 `dep_pages`에서 **자동 생성**됨 (`pages.tsx` `servicePage()` L120–126).
→ dep_pages에 행만 추가하면 메뉴는 자동 노출됨.

하지만 **현황 표(동적 데이터)** 는 일반 콘텐츠가 아니라 **라우트에서 특수 주입**됨:
`src/index.tsx` L262 `if (pageSlug === 'progress') { ... serviceProgressContent(...) }`
→ 즉 **`progress`라는 slug일 때만** 동적 표가 그려지고, 그 외 slug는 `dep_pages.content`(정적 HTML)를 보여줌.

**핵심 함의**: "S/W 시험현황"을 동적 표로 만들려면, 라우트에서 이 신규 페이지도 **progress와 동일하게 동적 처리**되도록 분기를 확장해야 함.

### 1-3. 성능평가 평가현황 표 구조 (= 복제 대상)

성능평가(`performance`, `is_main_progress=1`) 하위에 `progress`(pid 13, 평가현황)가 있음.
표는 `pages.tsx` `serviceProgressContent()` L776–820 에서 렌더되며, 컬럼 구성은:

| 표 헤더 | 데이터 컬럼 | 성능평가 예시값 |
|--------|-----------|---------------|
| 번호 | (자동 카운트) | 6, 5, 4… |
| 제품명 | `product_name` | Fortify Enterprise v3.1 (Linux) |
| 제품유형(col2) | `assurance_level` | 소스코드 보안약점 분석도구 |
| 운영체제(col3) | `cert_type` | U3000S / - |
| 개발사(col4) | `eval_type` | (주)하로스 |
| 진행상태 | `status` | 발급완료 |

> col2/col3/col4 헤더 라벨은 `departments.progress_meta` JSON에서 가져옴.
> 성능평가 meta: `{col2:"제품유형", col3:"운영체제", col4:"개발사", ...}`

→ "S/W 시험현황"도 **이 동일한 6열 표**를 그대로 사용하면 요구사항 B 충족.

### 1-4. progress_items 스키마 (현황 데이터 저장소)

```
id, category, product_name, company, status,
start_date, end_date, note, sort_order, created_at,
assurance_level, cert_type, eval_type
```
- 사업 연결 키: `category` (텍스트) ↔ `departments.name`
- 검색 대상으로 쓸 수 있는 텍스트 컬럼: `product_name`, `company` (요구 D 관련)

### 1-5. "기타" 그룹의 정의 (4+1 중 +1)

- 주요 4개 = `is_main_progress=1` (CC평가/보안기능시험/암호모듈검증/성능평가)
- **기타 = 주요 4개에 속하지 않는 모든 항목** → `mainCategories.indexOf(category) < 0`
- 관리자 JS(`admin-progress.js` L70,83,118)에 이미 검증된 로직 존재.

---

## 2. 요구사항별 구현 방법 (제안 — 승인 후 코딩)

### ✅ A + B + C — "S/W 시험현황(기타)" 신설 & 성능평가 표 복제 & 0건도 표시

**연결 키 설계**: "S/W 시험현황"에 들어갈 현황 데이터는 `progress_items.category = '기타시험평가'`(또는 신규 카테고리명) 로 저장.
→ 이 category는 어떤 `is_main_progress=1` 부서명과도 일치하지 않으므로 자동으로 **"기타" 그룹**에 속함. (요구 "기타카드" 충족)

> 참고: `pages.tsx` `CATEGORY_META`(L527–538)에는 이미 `'기타시험평가'` 메타가 정의돼 있음
> (`icon: fa-flask, color:#78716C, col2:등급, col3:유형, col4:기준`).
> 다만 성능평가 표와 "똑같이" 하려면 col2/col3/col4 라벨을 **제품유형/운영체제/개발사**로 맞추는 게 자연스러움 — 정책 확인 필요(아래 §4).

**구현 단계 (제안):**

1. **마이그레이션 (신규, 예: `0058_sw_test_status.sql`)**
   - `dep_pages`에 시험성적서(certificate) 하위로 `S/W 시험현황`(slug 예: `sw-test`) 행 INSERT
   - (선택) progress_items 샘플/초기 데이터가 있으면 `category='기타시험평가'`로 삽입. 없으면 0건 유지.

2. **라우트 확장 (`src/index.tsx` L262 분기)**
   - 현재: `if (pageSlug === 'progress')` 일 때만 동적 표
   - 변경: `if (pageSlug === 'progress' || pageSlug === 'sw-test')` 로 확장하고,
     - `sw-test`일 때는 `category = '기타시험평가'`로 스코프(요구 B의 "기타" 데이터만)
     - 표는 동일한 `serviceProgressContent()` 재사용 (성능평가와 똑같은 표)
   - **0건이어도 표시**: `serviceProgressContent()`는 이미 0건일 때 "등록된 현황이 없습니다" 빈 표를 렌더(L814–817). 카드/헤더는 항상 출력되므로 요구 C 자동 충족.

3. **(선택) 홈/현황 카드의 기타 노출**
   - 만약 홈 평가현황 카드(home.tsx)에도 "기타" 카드를 5번째로 항상 표시하려면, 이전 보고서(§3-2)의 4+1 이식이 추가로 필요. **이번 요구는 "시험성적서 하위 페이지"에 한정**되므로, 홈 카드 변경은 별도 결정 사항(§4).

**요구 C 보장 방식**: "S/W 시험현황" 페이지는 dep_pages에 항상 존재하므로 메뉴/페이지/표 헤더가 데이터 0건이어도 항상 노출됨 → "기타 0건"이 항상 표시됨.

### ✅ D — 검색범위에 회사명 포함

현재 검색 쿼리 (`src/index.tsx` L272, 그리고 `/support/progress` L348~):
```ts
if (search) { whereClause += ' AND product_name LIKE ?'; binds.push(`%${search}%`); }
```
→ **제품명만** 검색.

**변경 제안**:
```ts
if (search) {
  whereClause += ' AND (product_name LIKE ? OR company LIKE ?)';
  binds.push(`%${search}%`, `%${search}%`);
}
```
- 적용 위치: ① `/services/:slug/progress` (사업별), ② `/services/:slug/sw-test` (신규), ③ `/support/progress` (전역) — 일관되게 3곳 모두 적용 권장.
- placeholder 텍스트도 "제품명 검색…" → "제품명·회사명 검색…"으로 변경 (`pages.tsx` L766).

---

## 3. 영향 파일·라인 요약

| 파일 | 라인 | 변경 성격 | 내용 |
|------|------|----------|------|
| `migrations/0058_*.sql` | 신규 | **신규 생성** | 시험성적서 하위 `S/W 시험현황`(sw-test) dep_pages INSERT |
| `src/index.tsx` | 262 | 수정 | progress 분기에 `sw-test` 추가, `category='기타시험평가'` 스코프 |
| `src/index.tsx` | 272 / 359 부근 | 수정 | 검색에 `OR company LIKE ?` 추가 (3곳) |
| `src/templates/pages.tsx` | 708–841 | 재사용/소폭 | `serviceProgressContent()` 그대로 재사용 (성능평가 표 동일) |
| `src/templates/pages.tsx` | 766 | 수정 | 검색 placeholder "제품명·회사명 검색…" |
| `src/templates/pages.tsx` | 527–538 | (선택) | `기타시험평가` 메타 col2/3/4 라벨 조정 (성능평가와 동일하게 할지) |
| `public/static/js/admin-progress.js` | 17,42–124 | 참조 | 기타 그룹 로직 모델 (관리자엔 이미 반영) |

---

## 4. 코딩 전 확인 필요 사항 (사용자 결정 요청)

1. **"S/W 시험현황"의 표 컬럼 라벨**
   - 성능평가 표와 "똑같이" → col2/col3/col4 = **제품유형 / 운영체제 / 개발사** 로 맞출까요?
   - 아니면 기존 `기타시험평가` 메타의 **등급/유형/기준** 라벨을 쓸까요?
   → (권장: 사용자가 "성능평가와 똑같이"라고 하셨으므로 **제품유형/운영체제/개발사** 권장)

2. **현황 데이터의 category 값**
   - "S/W 시험현황"에 들어갈 항목을 `category='기타시험평가'`로 저장할까요, 아니면 `'S/W시험'` 같은 새 카테고리명을 쓸까요?
   → 어떤 값이든 4개 주요에 없으면 자동으로 "기타"에 묶입니다. 명칭만 정해주시면 됩니다.

3. **하위메뉴 slug**
   - URL은 `/services/certificate/sw-test` 형태가 됩니다. slug를 `sw-test`로 할지(권장), 다른 값으로 할지 확인.

4. **홈 화면 "기타" 카드 노출 여부 (별도)**
   - 이번 작업은 "시험성적서 하위 페이지"에 집중됩니다.
   - 홈(`/`)의 평가현황 4개 카드 옆에도 "기타" 카드를 5번째로 항상 띄울지(이전 보고서 P1 4+1 이식)는 **별도 결정**입니다. 원하시면 함께 진행합니다.

5. **검색범위 확장 적용 페이지**
   - 회사명 검색을 **전역(/support/progress) + 사업별 + S/W시험현황** 모두에 적용할까요? (권장: 모두 일관 적용)

---

## 5. 종합 평가 — "잘 해줄 수 있는가?"

**예, 4가지 요구사항 모두 안정적으로 구현 가능합니다.** 이유:

1. **A(신규 메뉴)** — dep_pages 기반 메뉴 자동생성 구조라 마이그레이션 1줄로 메뉴 추가됨.
2. **B(성능평가 표 복제)** — 동일 `serviceProgressContent()` 함수를 재사용하므로 표가 100% 동일.
3. **C(0건도 표시)** — 페이지/표는 데이터와 무관하게 항상 렌더되며, 빈 상태 UI도 이미 구현돼 있음.
4. **D(회사명 검색)** — 검색 WHERE절에 `OR company LIKE ?` 한 줄 추가로 해결, company 컬럼 이미 존재.

리스크는 낮으며, 주요 변경은 ①마이그레이션 1개 ②라우트 분기 확장 ③검색절 수정으로 국소적입니다.

---

## 6. 검증 로그 (재현 가능)

```bash
# 시험성적서/성능평가 하위메뉴
npx wrangler d1 execute koist-website-db --local --command="SELECT d.slug,d.name,p.slug pslug,p.title FROM departments d LEFT JOIN dep_pages p ON p.dept_id=d.id WHERE d.slug IN ('certificate','performance') ORDER BY d.slug,p.sort_order"

# 성능평가 데이터 컬럼 매핑 확인
npx wrangler d1 execute koist-website-db --local --command="SELECT product_name,company,assurance_level,cert_type,eval_type,status FROM progress_items WHERE category='성능평가' LIMIT 6"

# progress_items 스키마 (company 컬럼 존재 확인)
npx wrangler d1 execute koist-website-db --local --command="PRAGMA table_info(progress_items)"
```

---

*본 보고서는 분석 전용이며, 어떠한 소스 코드도 변경하지 않았습니다. 위 §4 결정사항 확정 후 코딩을 시작하겠습니다.*

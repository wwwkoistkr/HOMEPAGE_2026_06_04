# [v3·최종] "기타시험평가(etc-test)" 신설 · 4+1 · 검색확장 · 관리자/자료실 연계 — 종합 분석보고서

> 작성일: 2026-06-02 · 대상: KOIST(한국정보보안기술원) 홈페이지
> 상태: **분석 전용 (코딩 미실시)** — 사용자 지시 "아직 코딩은 하지마" 준수
> 검증 환경: 로컬 D1 `koist-website-db`, 소스 브랜치 `main`

---

## 0. 확정된 사용자 결정사항 (이번 작업 사양)

| # | 항목 | 확정값 |
|---|------|-------|
| 1 | 표 컬럼 라벨 | 성능평가와 동일 → **제품유형 / 운영체제 / 개발사** |
| 2 | 현황 category 값 | **`기타시험평가`** 로 저장 |
| 3 | 메뉴 URL slug | **`/services/certificate/etc-test`** |
| 4 | 홈 "기타" 카드 | 홈(`/`) 평가현황에 **5번째 "기타" 카드** 추가 (4+1 완성) |
| 5 | 회사명 검색 | **전역 + 사업별 + S/W(기타)시험현황 모두** 일관 적용 |
| 6 | **관리자 관리 + 자료실 연계** (신규) | 위 모든 내용을 **관리자모드에서 관리**, **자료실과 연계** |

**종합 결론: 1~5번은 전부 안정 구현 가능. 6번(자료실 연계)은 "연계 방식"에 대한 설계 선택이 필요** — 본 보고서 §5에서 3가지 옵션 제시 후 권장안 명시.

---

## 1. 시스템 구조 실측 정리 (이번 분석 확인분)

### 1-1. 부서/하위메뉴 (`departments` / `dep_pages`)

- **시험성적서** = `departments.slug='certificate'`, `name='시험성적서'`, `is_main_progress=0`
- 현재 하위메뉴: `overview`/`rnd`/`ai`/`network` → **`etc-test` 없음(신설 대상)**
- 사이드바 메뉴는 `dep_pages` 기반 **자동 생성** (`pages.tsx` servicePage L120–126)
- 동적 현황 표는 라우트에서 **`pageSlug==='progress'`일 때만** 주입 (`src/index.tsx` L262)

### 1-2. 현황 표 컬럼 매핑 (성능평가 = 복제 기준)

| 표 헤더(성능평가) | DB 컬럼 | 비고 |
|---|---|---|
| 제품명 | `product_name` | |
| 제품유형(col2) | `assurance_level` | 헤더 라벨은 progress_meta.col2 |
| 운영체제(col3) | `cert_type` | 헤더 라벨은 progress_meta.col3 |
| 개발사(col4) | `eval_type` | 헤더 라벨은 progress_meta.col4 |
| 진행상태 | `status` | |

→ `기타시험평가` 부서의 progress_meta에 **col2=제품유형, col3=운영체제, col4=개발사**를 넣으면 성능평가 표와 100% 동일.

### 1-3. progress_items 스키마

```
id, category, product_name, company, status, start_date, end_date,
note, sort_order, created_at, assurance_level, cert_type, eval_type
```
- 사업 연결 키: `category`(텍스트) ↔ `departments.name`
- 검색 가능 텍스트: `product_name`, `company`

### 1-4. "기타" 그룹 정의 (4+1의 +1)

- 주요 4 = `is_main_progress=1` (CC평가/보안기능시험/암호모듈검증/성능평가)
- 기타 = `mainCategories.indexOf(category) < 0` (즉 `기타시험평가`는 자동으로 기타)
- 관리자 JS(admin-progress.js L70,83,118)에 이미 검증된 로직 존재.

### 1-5. 관리자(Admin) 인프라 — 이미 완비됨

**관리자 메뉴** (`src/templates/admin/index.tsx` L189–193):
- `사업분야 관리`(/admin/departments), `평가현황`(/admin/progress), `자료실`(/admin/downloads)

**관리자 API** (`src/routes/admin.ts`) — 전부 존재:
| 기능 | 엔드포인트 |
|------|-----------|
| 부서 CRUD | GET/POST `/departments`, PUT/DELETE `/departments/:id` |
| **하위페이지 CRUD** | GET `/departments/:id/pages`, POST `/departments/:id/pages`, PUT/DELETE `/dep-pages/:id` |
| **현황 CRUD** | GET/POST `/progress`, PUT/DELETE `/progress/:id` (category 자유 입력) |
| **자료실 CRUD** | GET/POST `/downloads`, PUT/DELETE `/downloads/:id` (category 필드 보유) |

→ progress POST는 `category`를 자유 텍스트로 받으므로(admin.ts L391–392) **`기타시험평가` 데이터를 관리자에서 추가/수정/삭제 가능**. 별도 API 신설 불필요.

**관리자 JS** (`public/static/js/`): `admin-progress.js`, `admin-downloads.js`, `admin-departments.js` 모두 존재.

### 1-6. 자료실(downloads) 구조

```
id, title, description, file_url, file_name, file_size, category, download_count, created_at
```
- `category`로 분류(form/education 등), 자체 관리 UI(`admin-downloads.js`) 보유
- **progress_items ↔ downloads 간 직접 연결 컬럼은 없음** → 연계하려면 설계 필요(§5)

---

## 2. 4+1 구조 — 최종 정의

```
[ 전체 ] [ CC평가 ] [ 보안기능시험 ] [ 암호모듈검증 ] [ 성능평가 ] [ 기타 ]
            └────────────── 주요 4 (is_main_progress=1) ──────────┘   └ +1 ┘
                                                                  (기타시험평가 포함)
```
- 홈(`/`): 현재 4개 카드만 → **기타 카드 1개 추가**해 4+1 완성 (요구 4)
- 사업별 페이지: `etc-test`(기타시험평가)는 시험성적서 하위에서 단독 표로 표시

---

## 3. 요구사항별 구현 방법 (제안 — 승인 후 코딩)

### ① 마이그레이션 (신규 `0058_etc_test_status.sql`)

```sql
-- (a) 기타시험평가 부서 메타: 성능평가와 동일 라벨
--     방법 A: 시험성적서 dept의 progress_meta를 쓰지 않고,
--     별도 "기타시험평가" 매핑을 위해 dep_pages + 라우트 스코프로 처리 (권장)
-- (b) 시험성적서(certificate) 하위에 'S/W 시험현황' 페이지 추가
INSERT INTO dep_pages (dept_id, title, slug, content, sort_order, is_active)
SELECT id, 'S/W 시험현황', 'etc-test', '', 50, 1 FROM departments WHERE slug='certificate';

-- (c) 표 헤더 라벨(제품유형/운영체제/개발사)을 위한 메타는
--     pages.tsx의 CATEGORY_META['기타시험평가'] 를 제품유형/운영체제/개발사로 조정 (코드측)
--     또는 별도 settings 키로 관리 (자료실/관리자 연계와 함께 §5 참조)
```

> 참고: `pages.tsx` CATEGORY_META에 `기타시험평가`가 이미 있으나 라벨이 등급/유형/기준 →
> **제품유형/운영체제/개발사로 변경**해야 요구 1 충족.

### ② 라우트 확장 (`src/index.tsx` L262 분기)

```ts
// 현재
if (pageSlug === 'progress') { ... whereClause = '1=1'; ... }

// 변경 (P2 부서스코프 + etc-test 신설 통합)
if (pageSlug === 'progress' || pageSlug === 'etc-test') {
  // 사업별 스코프: progress=해당 부서명, etc-test=기타시험평가
  const scopeCategory = pageSlug === 'etc-test' ? '기타시험평가' : dept.name;
  let whereClause = 'category = ?';
  const binds: any[] = [scopeCategory];
  // 검색: 제품명 + 회사명 (요구 5)
  if (search) { whereClause += ' AND (product_name LIKE ? OR company LIKE ?)'; binds.push(`%${search}%`,`%${search}%`); }
  if (statusFilter) { whereClause += ' AND status = ?'; binds.push(statusFilter); }
  // categoryCounts도 해당 스코프로 한정 (또는 단일 사업이므로 탭 생략)
  ...
}
```

→ 이 한 번의 변경으로 **(P2)사업별 검색 분리 + (신규)etc-test 표 + (요구5)회사명 검색**을 동시 해결.
→ 0건이어도 표/헤더는 항상 렌더(L814–817 빈 상태 UI) → 요구 "기타 0건 항상 표시" 충족.

### ③ 검색 확장 — 3곳 일관 적용 (요구 5)

| 위치 | 파일·라인 | 변경 |
|------|-----------|------|
| 사업별/etc-test | `src/index.tsx` L272 부근 | `product_name LIKE ?` → `(product_name LIKE ? OR company LIKE ?)` |
| 전역(/support/progress) | `src/index.tsx` L348~ 검색절 | 동일 변경 |
| placeholder | `src/templates/pages.tsx` L766 | "제품명 검색…" → "제품명·회사명 검색…" |

### ④ 홈 4+1 카드 (요구 4)

`src/templates/home.tsx` L1880–1901:
- 현재 `catCounts.slice(0,4)` + `slice(4)` pill
- 변경: **주요 4개 카드 + "기타" 카드(5번째)** 로 재구성.
  - 기타 건수 = 주요 4개에 없는 category 합산 (admin-progress.js L70 로직 이식)
  - 0건이어도 항상 표시(요구). 기타 카드 클릭 시 `/support/progress?category=기타` 또는 etc-test로 이동(정책 §6).

---

## 4. 관리자모드 관리 (요구 6-1)

**좋은 소식: 신규 관리 API/화면 대부분 불필요.** 기존 인프라로 관리됩니다.

| 관리 대상 | 관리 방법 (기존 화면) | 추가 작업 |
|-----------|---------------------|----------|
| `기타시험평가` 현황 데이터(추가/수정/삭제) | **관리자 > 평가현황**(`/admin/progress`) — category에 `기타시험평가` 선택 | admin-progress.js의 category 선택 옵션에 `기타시험평가` 노출 확인/추가 |
| `S/W 시험현황` 메뉴(노출/제목/순서) | **관리자 > 사업분야 관리**(`/admin/departments`) → 시험성적서 하위페이지 | 마이그레이션으로 페이지 행 생성 후 자동 노출 |
| 표 헤더 라벨(제품유형/운영체제/개발사) | (선택) settings 키 또는 departments.progress_meta | §5 옵션 결정 |

**핵심 보완 포인트**:
- admin-progress.js는 category 목록을 departments에서 가져옴(L33–45). `기타시험평가`는 부서가 아니라 "가상 카테고리"이므로, **관리자 현황 추가 폼의 category 드롭다운에 `기타시험평가`가 보이도록** 별도 항목으로 넣어줘야 함 (소폭 JS 수정).

---

## 5. 자료실 연계 (요구 6-2) — 설계 옵션 ⚠️ **결정 필요**

현재 `progress_items` ↔ `downloads` 사이에 **직접 연결 컬럼이 없습니다.** "연계"의 의미를 아래 3옵션 중 선택해 주세요.

### 옵션 A — 카테고리 기반 느슨한 연계 (가장 가벼움, 권장)
- 자료실에 `category='기타시험평가'`(또는 `etc-test`) 자료를 등록 → S/W 시험현황 페이지 하단에 **"관련 자료실" 섹션** 자동 표시(같은 category 자료 목록).
- 변경: 라우트에서 `SELECT * FROM downloads WHERE category=? ` 추가 + 템플릿에 섹션 추가.
- 장점: 스키마 변경 없음, 관리자 자료실 화면 그대로 사용. 단점: 항목 단위가 아닌 카테고리 단위 연계.

### 옵션 B — 현황 항목별 첨부 파일 연계 (정밀, 중간 작업량)
- `progress_items`에 `download_id`(또는 `file_url`) 컬럼 추가 → 각 현황 행에 성적서/시험결과 파일 1개 연결.
- 변경: 마이그레이션(컬럼 추가) + progress CRUD API에 필드 추가 + 표에 다운로드 버튼.
- 장점: 행별 정밀 연계. 단점: 스키마/관리화면/표 모두 수정.

### 옵션 C — A+B 혼합
- 페이지 단위 "관련 자료실"(A) + 행 단위 첨부(B) 모두 제공. 작업량 최대.

> **권장: 옵션 A** (요구 "자료실과 연계해서 관리"를 가장 적은 리스크로 충족, 관리자는 기존 자료실 화면에서 category만 맞추면 됨).
> 정밀 첨부가 꼭 필요하면 옵션 B로 진행.

---

## 6. 영향 파일·작업 요약

| 파일 | 변경 | 요구 |
|------|------|------|
| `migrations/0058_etc_test_status.sql` (신규) | dep_pages에 etc-test 추가 (+옵션B면 컬럼 추가) | A,6 |
| `src/index.tsx` L262 | progress\|etc-test 분기 + 부서스코프 + 회사명검색 | 1,2,3,5,P2 |
| `src/index.tsx` L348~ | 전역 검색에 company 추가 | 5 |
| `src/templates/pages.tsx` L527–538 | CATEGORY_META['기타시험평가'] 라벨 제품유형/운영체제/개발사 | 1 |
| `src/templates/pages.tsx` L766 | placeholder 문구 | 5 |
| `src/templates/pages.tsx` L708~ | serviceProgressContent 재사용(필요시 기타탭 처리) | 2,4 |
| `src/templates/home.tsx` L1880–1901 | 4+1 기타 카드 추가 | 4 |
| `public/static/js/admin-progress.js` | category 드롭다운에 `기타시험평가` 노출 | 6 |
| (옵션 A) `src/index.tsx` + `pages.tsx` | etc-test 페이지에 "관련 자료실" 섹션 | 6 |
| (옵션 B) `migrations` + `admin.ts` + `admin-progress.js` + 표 | 행별 첨부 | 6 |

---

## 7. 코딩 전 최종 확인 사항 (사용자 결정 요청)

1. **자료실 연계 방식**: 옵션 **A**(페이지 단위 관련자료, 권장) / **B**(행별 첨부파일) / **C**(둘 다) 중 무엇으로 할까요?
2. **자료실 연계 카테고리명**: 자료실에서 어떤 category로 묶을까요? (예: `기타시험평가` 또는 `etc-test` 또는 `S/W시험`)
3. **홈 "기타" 카드 클릭 시 이동 경로**: `/services/certificate/etc-test`(S/W시험현황 페이지) / `/support/progress?category=기타`(전역) 중 어디로?
4. **사업별 페이지 카테고리 탭**: 단일 사업이므로 카테고리 탭을 제거하고 검색·상태 필터만 둘까요? (권장)

---

## 8. 종합 평가 — "잘 해줄 수 있는가?"

**예. 6개 요구 모두 구현 가능하며, 대부분 기존 인프라를 재사용합니다.**

- 1~5번: 마이그레이션 1개 + 라우트 분기 확장 + 검색절/홈카드 수정으로 국소적·저위험.
- 6번(관리자): **신규 관리 API 거의 불필요** — 기존 평가현황/사업분야/자료실 화면으로 관리. admin-progress.js의 category 드롭다운에 `기타시험평가` 노출만 보완.
- 6번(자료실 연계): 옵션 A면 스키마 변경 없이 즉시 가능, 옵션 B면 컬럼 1개 추가로 정밀 연계.

**유일하게 결정이 필요한 부분은 §7의 자료실 연계 방식(옵션 A/B/C)입니다.** 이것만 정해주시면 전체 코딩을 일괄 진행하겠습니다.

---

## 9. 검증 로그 (재현 가능)

```bash
# 시험성적서 하위메뉴 (etc-test 없음 확인)
npx wrangler d1 execute koist-website-db --local --command="SELECT d.slug,p.slug pslug,p.title FROM departments d LEFT JOIN dep_pages p ON p.dept_id=d.id WHERE d.slug='certificate'"
# 성능평가 표 데이터 매핑
npx wrangler d1 execute koist-website-db --local --command="SELECT product_name,company,assurance_level,cert_type,eval_type,status FROM progress_items WHERE category='성능평가' LIMIT 6"
# 자료실 스키마/데이터 (category 필드)
npx wrangler d1 execute koist-website-db --local --command="PRAGMA table_info(downloads)"
# 관리자 API 목록
grep -nE "\.(get|post|put|delete)\(" src/routes/admin.ts
```

---

*본 보고서는 분석 전용이며, 어떠한 소스 코드도 변경하지 않았습니다. §7 결정 후 코딩을 시작하겠습니다.*

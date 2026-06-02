# 평가현황 4+1 구조 & 검색 분리 — 분석보고서

> 작성일: 2026-06-02 · 대상: KOIST(한국정보보안기술원) 홈페이지
> 상태: **분석 전용 (코딩 미실시)** — 사용자 지시 "코딩은 아직 하지 마" 준수
> 검증 환경: 로컬 D1 `koist-website-db`, 소스 브랜치 `main` (commit e8e2a77)

---

## 0. 요약 (TL;DR)

사용자가 보고한 두 가지 문제는 모두 **사실로 확인**되었습니다.

| # | 보고된 문제 | 확인 결과 | 근본 원인 |
|---|------------|----------|----------|
| **1** | 사업별 평가현황이 4+1이어야 하는데 **"+1(기타현황)"이 없음** | ✅ 사실 | ① 데이터에 기타 카테고리 자체가 없음 ② **공개(프론트) 템플릿에 "기타 그룹핑" 로직이 이식되지 않음** (해당 로직은 관리자 JS에만 존재) |
| **2** | 각 사업 페이지에서 평가/시험현황을 검색하면 **모든 사업 결과가 섞여서 나옴** | ✅ 사실 | `/services/:slug/progress` 라우트가 부서(사업)별 필터를 전혀 적용하지 않음 (`whereClause = '1=1'`) |

> ⚠️ 분석 중 **이전 가정의 오류 1건을 정정**했습니다. (아래 §2 참조)
> 이전에는 "departments 테이블의 `category` 컬럼으로 연결"이라 추정했으나,
> 실제로 departments에는 `category` 컬럼이 **존재하지 않으며**,
> 사업↔현황의 연결 키는 **`departments.name` ↔ `progress_items.category`** 입니다.

---

## 1. "4+1" 구조의 정확한 정의

### 1-1. 데이터 구조 (실측)

**`departments` 테이블 실제 컬럼** (PRAGMA table_info 확인):
```
id, name, slug, description, icon, color, sort_order, is_active, created_at,
header_bg_url, image_url, contact_dept, contact_name, contact_phone,
use_legacy_theme, english_subtitle, progress_meta, is_main_progress
```
→ `category` 컬럼은 **없음**. `dept_id` FK도 없음.

**주요 사업(부서) 4개 — `is_main_progress = 1`:**

| slug | name(=category) | is_main_progress | progress_meta col2/col3/col4 |
|------|------|:---:|------|
| `cc` | **CC평가** | 1 | 보증등급 / 인증구분 / 신청구분 |
| `security-test` | **보안기능시험** | 1 | 제품유형 / 발급유형 / 신청구분 |
| `kcmvp` | **암호모듈검증** | 1 | 보안수준 / 모듈형태 / - |
| `performance` | **성능평가** | 1 | 제품유형 / 운영체제 / 개발사 |

**기타 사업(부서) — `is_main_progress = 0`:**
`test-dept`(테스트부서), `certificate`(시험성적서), `diagnosis`(정보보안진단), `consulting`(컨설팅), `enterprise-security`(산업(기업)보안 컨설팅), `readiness`(정보보호준비도 평가)

### 1-2. "4+1"의 의미

- **4 (주요)** = `is_main_progress = 1`인 4개 카테고리 카드 (CC평가, 보안기능시험, 암호모듈검증, 성능평가)
- **+1 (기타)** = 4개 주요에 속하지 않는 모든 항목을 **"기타"라는 단일 그룹**으로 묶은 카드

즉 집계 규칙은:
```
group = mainCategories.includes(item.category) ? item.category : '기타'
```

이 규칙은 **관리자 화면(admin-progress.js)에는 이미 정확히 구현**되어 있습니다.

---

## 2. 사업 ↔ 현황 연결 키 (정정된 사실)

```
┌─────────────────────────┐         ┌──────────────────────────┐
│ departments             │         │ progress_items           │
│  - name  ('CC평가')      │◀───────▶│  - category ('CC평가')    │
│  - slug  ('cc')          │  매핑   │  - product_name          │
│  - is_main_progress (1)  │  키     │  - status                │
│  - progress_meta (JSON)  │         │  (dept_id / category FK   │
└─────────────────────────┘         │   컬럼 없음)              │
                                     └──────────────────────────┘
```

- 연결 키: **`departments.name` === `progress_items.category`** (텍스트 동일성)
- 예: 부서 slug `cc` → name `CC평가` → `progress_items.category = 'CC평가'`인 항목만이 해당 사업의 현황
- **현재 코드에는 이 매핑이 어디에도 적용되어 있지 않음** → 이것이 Problem 2의 본질

### 2-1. 현황 데이터 실측 (로컬 D1)

```sql
SELECT category, COUNT(*) FROM progress_items GROUP BY category;
```
| category | 건수 |
|----------|---:|
| CC평가 | 142 |
| 보안기능시험 | 69 |
| 성능평가 | 6 |
| 암호모듈검증 | 1 |
| **합계** | **218** |

→ 데이터에는 **4개 주요 카테고리만 존재**하며, 기타로 분류될 데이터는 **0건**.

---

## 3. Problem 1 — "+1(기타현황)"이 없음

### 3-1. 두 가지 복합 원인

**원인 A — 데이터 부재**
현재 progress_items에는 기타로 분류될 항목이 0건이라, 설령 기타 그룹핑 로직이 있어도 "0건 기타 카드"만 표시됨.

**원인 B — 공개 템플릿에 기타 그룹핑 로직 미이식 (핵심)**
"4 + 기타" 그룹핑 로직은 **관리자 JS에만 존재**하고, 사용자에게 보이는 공개 페이지 템플릿에는 **전혀 이식되지 않음**.

### 3-2. 코드 근거

**✅ 기타 그룹핑이 있는 곳 (관리자 전용):**
`public/static/js/admin-progress.js`
- L17 `let mainCategories = []`
- L42–48 `dept.is_main_progress === 1` → mainCategories 채움 (fallback 4개)
- L66–67 `counts['기타'] = 0`
- L70 `const group = mainCategories.indexOf(p.category) >= 0 ? p.category : '기타'`
- L83–84 기타 필터: `progList.filter(p => mainCategories.indexOf(p.category) < 0)`
- L95–124 카드 렌더: 전체 + 주요 4개 + **기타** = 6칸

**❌ 기타 그룹핑이 없는 곳 (공개 페이지):**

1) `src/templates/home.tsx` L1880–1901 (홈 평가현황 카드)
```ts
catCounts.slice(0, 4).map(...)   // 앞 4개만 카드
catCounts.slice(4).map(...)      // 5번째 이후를 pill로 (단순 slice, 기타 그룹핑 아님)
```
→ `slice`는 카테고리가 5개 이상일 때 잘라내는 것일 뿐, "주요 4개 외 = 기타로 묶기" 개념이 없음. 데이터가 4개뿐이라 +1은 절대 나타나지 않음.

2) `src/templates/pages.tsx` `serviceProgressContent()` L708~ (사업별 현황 탭)
```ts
// L738-750: categoryCounts를 그대로 탭으로 나열
categoryCounts.map(cc => `<a href="?category=${cc.category}">...`)
```
→ 전역 categoryCounts(4개)를 그대로 보여줄 뿐, 기타 그룹 탭 없음.

3) `src/templates/pages.tsx` `progressPage()` L547–707 (전역 현황 페이지) — 동일하게 기타 그룹 없음.

### 3-3. 결론
사업별 평가현황 화면이 **4개 카드만** 표시하고 **5번째 "기타" 카드가 영구히 누락**되는 이유는,
관리자 JS의 검증된 4+1 그룹핑 로직이 **공개 템플릿(home.tsx / pages.tsx)에 이식되지 않았기 때문**.

---

## 4. Problem 2 — 사업별 검색 결과가 섞임

### 4-1. 근본 원인 (단일·명확)

`src/index.tsx` 의 `/services/:slug/:pageSlug` 라우트(progress 분기)가
**부서(사업)별 필터를 전혀 적용하지 않음.**

### 4-2. 코드 근거 — `src/index.tsx` L249–292

```ts
app.get('/services/:slug/:pageSlug', async (c) => {
  ...
  // L255: 부서를 가져오긴 함
  const dept = await db.prepare('SELECT * FROM departments WHERE slug = ?')
                       .bind(slug).first<Department>();
  if (!dept) return c.redirect('/');

  if (pageSlug === 'progress') {
    ...
    // L269: ❌ 부서 필터 없음! 모든 사업의 항목을 대상으로 함
    let whereClause = '1=1';
    const binds: string[] = [];
    if (categoryFilter) { whereClause += ' AND category = ?'; binds.push(categoryFilter); }
    if (search)         { whereClause += ' AND product_name LIKE ?'; binds.push(`%${search}%`); }
    if (statusFilter)   { whereClause += ' AND status = ?'; binds.push(statusFilter); }
    ...
    // L284: ❌ categoryCounts도 전역 집계 (부서 무관)
    const categoryCounts = (await db.prepare(
      `SELECT category, COUNT(*) as cnt FROM progress_items GROUP BY category ORDER BY category`
    )...).results || [];
    ...
  }
});
```

**핵심 결함:**
- L255에서 `dept`를 로드하지만, `dept.name` 을 progress 쿼리에 **단 한 번도 사용하지 않음**.
- `whereClause`의 시작이 `'1=1'`(=전체) 이라, `/services/cc/progress`든 `/services/performance/progress`든 **218건 전부**가 대상이 됨.
- 검색어(`q`)·상태(`status`) 필터는 동작하지만, 그 검색이 **전체 218건을 대상**으로 하므로 다른 사업 제품이 섞여 나옴.

### 4-3. 비교 — 전역 페이지(`/support/progress`)는 정상

`src/index.tsx` L348–388 의 `/support/progress` 는 **전역 현황 페이지**이므로 `whereClause = '1=1'`(전체)이 **올바름**. 즉 이 패턴 자체가 잘못된 게 아니라, **사업별 페이지에 잘못 재사용된 것**이 문제.

### 4-4. 결론
`/services/:slug/progress`는 본래 "이 사업(부서)의 현황만" 보여야 하나,
부서 스코프 조건(`category = dept.name`)이 빠져 **모든 사업의 현황을 무차별 노출**.
검색 시에도 동일 이유로 타 사업 제품이 섞임.

---

## 5. 영향 파일·라인 요약

| 파일 | 라인 | 역할 | 문제 |
|------|------|------|------|
| `src/index.tsx` | 249–296 | `/services/:slug/:pageSlug` 라우트 | **P2**: progress 분기(262–292)에 부서 필터 없음(`1=1`) |
| `src/index.tsx` | 284 | 사업별 categoryCounts 집계 | **P2**: 전역 집계 (부서 무관) |
| `src/index.tsx` | 348–388 | `/support/progress` 전역 | 정상 (전역이라 `1=1` OK) |
| `src/templates/pages.tsx` | 708–750 | `serviceProgressContent()` 탭 | **P1**: 기타 그룹 탭 없음, **P2**: 전역 categoryCounts 사용 |
| `src/templates/pages.tsx` | 527–542 | `CATEGORY_META`/`getCatMeta` | 기타(`기타시험평가` 등) 메타는 있으나 "기타 그룹" 개념 없음 |
| `src/templates/home.tsx` | 1880–1901 | 홈 4+1 카드 | **P1**: `slice(0,4)`/`slice(4)` — 기타 그룹핑 없음 |
| `public/static/js/admin-progress.js` | 17,42–48,59–124 | 관리자 4+1 | ✅ **참조 모델** (정상 동작하는 4+1 로직) |
| `migrations/0001_initial_schema.sql` | 85–96 | progress_items 스키마 | dept_id 없음, category 텍스트만 |
| `migrations/0055_v40_unify_categories.sql` | — | departments에 is_main_progress/progress_meta 추가 | 4+1 분류 기준 정의됨 |

---

## 6. 권장 수정 방향 (사용자 승인 후 코딩 예정)

> 아래는 **제안일 뿐, 아직 코드 변경 없음.** 승인 시 진행합니다.

### P2 수정 — 사업별 검색 분리 (필수, 명확)
`src/index.tsx` `/services/:slug/progress` 쿼리에 **부서 스코프** 추가:
```ts
let whereClause = 'category = ?';      // ← '1=1' 대신
const binds: string[] = [dept.name];   // ← 부서명으로 스코프
// 이후 search/status 필터는 이 스코프 안에서만 동작
```
- categoryCounts(L284)도 해당 부서 범위로 한정하거나, 사업별 페이지에서는 카테고리 탭 자체를 단일(해당 사업)로 단순화.
- 효과: `/services/cc/progress`는 CC평가 142건만, 검색도 그 안에서만.

### P1 수정 — 공개 페이지 4+1(기타) 이식
검증된 `admin-progress.js`의 그룹핑 규칙(`group = main.includes(cat) ? cat : '기타'`)을
공개 템플릿에 이식:
- `home.tsx` L1880–1901: `slice(0,4)`/`slice(4)` → **주요 4개 카드 + 기타 그룹 1개 카드(5번째)** 로 재구성. 기타 = 주요 4개 외 합산.
- `pages.tsx` `serviceProgressContent()`: 전역 현황 페이지에서 기타 탭 노출 (사업별 페이지는 P2로 단일 사업만 보이므로 탭 불필요).
- 데이터 측면: 기타 카드를 항상 노출할지(0건이어도) / 0건이면 숨길지 정책 결정 필요.

### 정책 결정 필요 사항 (사용자 확인 요청)
1. **기타 카드 표시 정책**: 데이터가 0건이어도 "기타 0건" 카드를 항상 보여줄까요, 아니면 1건 이상일 때만 보여줄까요?
2. **사업별 페이지 카테고리 탭**: 사업별 페이지(`/services/cc/progress`)는 단일 사업이므로 카테고리 탭을 제거하는 게 맞을까요? (검색·상태 필터만 유지)
3. **검색 범위**: 검색 대상을 제품명(`product_name`)만으로 유지할까요, 회사명(`company`) 등도 포함할까요?

---

## 7. 검증 로그 (재현 가능)

```bash
# 부서 스키마 — category 컬럼 없음 확인
npx wrangler d1 execute koist-website-db --local --command="PRAGMA table_info(departments)"

# 부서별 is_main_progress / name
npx wrangler d1 execute koist-website-db --local \
  --command="SELECT slug,name,is_main_progress FROM departments ORDER BY is_main_progress DESC, sort_order"

# 현황 카테고리별 건수 (4개, 기타 0건)
npx wrangler d1 execute koist-website-db --local \
  --command="SELECT category, COUNT(*) cnt FROM progress_items GROUP BY category ORDER BY cnt DESC"
```

---

*본 보고서는 분석 전용이며, 어떠한 소스 코드도 변경하지 않았습니다. (브랜치 main, 작업트리 clean)*

# v40.2 평가현황/시험현황 컬럼 폭 최종 분석 보고서

> **버전**: v40.1 → v40.2 (예정)
> **분석일**: 2026-06-02
> **상태**: 🔍 분석 완료 / 🚫 **코딩 미실시** (사용자 지시)
> **이전 보고서**: `V40_2_GRADE_COLUMN_WIDTH_ANALYSIS_20260602.md` 의 확장판

---

## 0. 사용자 최종 결정 사항 (이 보고서 기준)

| 항목 | 결정 |
|---|---|
| **Q1. 수정 대상 화면** | ✅ **A안**: `/cc-eval/progress` 등 좌측 메뉴 "평가현황/시험현황" (부서별 페이지) |
| **Q2. 폭 조정 강도** | ✅ **Option B**: 등급 **220px** / 구분 **140px** (더 시원하게) |
| **Q3. 긴 텍스트 처리** | ✅ **별칭 매핑**: "소스코드 보안약점 분석도구" 같은 긴 텍스트를 짧은 별칭으로 |
| **Q4. 신규 추가 (이번 보고서)** | ✅ **보안기능시험 → 시험현황** 도 동일 처리 (자동 포함) |

---

## 1. 🎉 중요한 발견: 한 곳만 고치면 두 화면 모두 해결!

### 1.1 두 화면의 코드 구조 분석

사용자가 캡처해주신 두 화면은 **물리적으로 다른 URL이지만 동일 함수로 렌더링**됩니다:

```
화면 1: CC평가 → 평가현황
URL: /cc-eval/progress  또는  /cc/progress
좌측 메뉴: CC평가 / 평가개요 / 신청방법 / 평가자문 / 【평가현황】★
타이틀: "평가현황"

화면 2: 보안기능시험 → 시험현황   ⬅️ 새로 추가
URL: /security-test/progress
좌측 메뉴: 보안기능시험 / 시험개요 / 신청방법 / 【시험현황】★
타이틀: "SECURITY FUNCTIONAL TEST / 시험현황"
```

**렌더링 흐름**:
```
브라우저 요청
    ↓
src/index.tsx (line 262): if (pageSlug === 'progress')
    ↓
serviceProgressContent() ← ⭐ 두 화면 모두 이 함수 1개로 처리!
    ↓
src/templates/pages.tsx (line 673~786)
```

### 1.2 결론

✅ **`serviceProgressContent()` 한 군데만 수정하면**:
- CC평가 → 평가현황 ✅
- 보안기능시험 → 시험현황 ✅
- 성능평가 → 평가현황 ✅
- 암호모듈검증 → 평가현황 ✅
- 나머지 6개 부서의 progress 페이지도 모두 ✅

**한 번에 10개 부서 영향. 매우 효율적!**

---

## 2. 데이터 측 실태 조사 (실제 DB 조회)

### 2.1 카테고리별 데이터 분포

| 카테고리 | 건수 | 좌측 메뉴 위치 |
|---|---|---|
| **CC평가** | 142건 | CC평가 → 평가현황 |
| **보안기능시험** | 72건 | 보안기능시험 → 시험현황 |
| 성능평가 | 6건 | 성능평가 → 평가현황 |
| 암호모듈검증 | 2건 | 암호모듈검증 → 평가현황 |
| **합계** | **222건** | |

### 2.2 ⭐ **등급(assurance_level) 실제 텍스트 길이 분포**

| 텍스트 | 글자수 | 건수 | 주 카테고리 | 220px 표시 가능? |
|---|---|---|---|---|
| **안티바이러스 제품 (Mobile)** | **18자** | 1 | (확인 필요) | ⚠️ 220px도 빠듯 |
| **안티바이러스제품(Linux)** | **15자** | 1 | (확인 필요) | ⚠️ 220px 한계 |
| **소스코드 보안약점 분석도구** | **14자** | 2 | (확인 필요) | ⚠️ 220px 한계 |
| **모듈형 안티바이러스 제품** | **13자** | 1 | (확인 필요) | ⚠️ 가능하나 빠듯 |
| **정보보호시스템** | **7자** | **35** | **보안기능시험** | ✅ 220px OK |
| **네트워크장비** | **6자** | **37** | **보안기능시험** | ✅ 220px OK |
| SSL VPN | 7자 | 1 | (확인 필요) | ✅ |
| EAL 1+ / EAL1+ | 5~6자 | 2 | CC평가 | ✅ |
| EAL2 | 4자 | **68** | **CC평가** | ✅ |
| EAL4 | 4자 | **47** | **CC평가** | ✅ |
| EAL3 | 4자 | **25** | **CC평가** | ✅ |
| 1 | 1자 | 2 | 암호모듈검증? | ✅ |

### 2.3 🔍 **핵심 발견**

**CC평가 vs 보안기능시험의 본질적 차이**:

| 카테고리 | 등급에 들어가는 데이터 패턴 | 220px 만으로 충분? |
|---|---|---|
| **CC평가** (142건) | EAL2 / EAL3 / EAL4 등 **짧은 코드** (4~6자) | ✅ **충분** (사실 90px도 OK) |
| **보안기능시험** (72건) | "정보보호시스템", "네트워크장비" 등 **긴 한글** (6~7자) | ✅ **220px이면 OK** |
| **(상위 4건)** | "안티바이러스 제품 (Mobile)" 등 **매우 긴 텍스트** (13~18자) | ⚠️ **220px도 한계** → **별칭 매핑 필요** |

➡️ **사용자가 본 화면이 정확히 "보안기능시험"인 이유**: 보안기능시험의 등급에 7자짜리 한글이 많아서 잘림이 두드러진 것입니다.

### 2.4 구분(cert_type) 텍스트 길이 분포

| 텍스트 | 글자수 | 건수 | 140px 표시 가능? |
|---|---|---|---|
| 간소화 발급 | 6자 | 64 | ✅ |
| U3000S | 6자 | 1 | ✅ |
| 소프트웨어 | 5자 | 2 | ✅ |
| **최초평가** | **4자** | **135** | ✅ |
| **기본시험** | **4자** | **8** | ✅ |
| 재평가 | 3자 | 7 | ✅ |
| - | 1자 | 5 | ✅ |

➡️ **구분 컬럼은 6자가 최대. 140px이면 충분히 안전.**

---

## 3. 별칭 매핑 설계 (Q3 응답)

### 3.1 매핑 대상 (220px도 부족한 4개 텍스트)

| 원본 등급명 (DB 그대로) | 표시용 별칭 | 길이 변화 | 비고 |
|---|---|---|---|
| 안티바이러스 제품 (Mobile) | **AV (Mobile)** | 18자 → 11자 | "안티바이러스" → "AV" |
| 안티바이러스제품(Linux) | **AV (Linux)** | 15자 → 10자 | 동일 |
| 소스코드 보안약점 분석도구 | **소스코드 분석도구** | 14자 → 9자 | "보안약점" 생략 |
| 모듈형 안티바이러스 제품 | **모듈형 AV** | 13자 → 7자 | 동일 |

### 3.2 구현 방식 옵션 ⭐ **결정 필요**

**옵션 1: SQL UPDATE로 DB 데이터를 직접 변경** ❌ **비추천**
- 빠르고 간단하지만, 원본 정보 손실
- 향후 "왜 이렇게 줄였지?" 추적 어려움
- 다른 시스템에서 동일 데이터 참조 시 불일치

**옵션 2: 코드 측 별칭 매핑 함수 추가** ⭐ **추천**
- DB에는 원본 그대로 보존
- 화면 표시 시점에만 매핑 적용
- `title` 속성에 원본 표시 (마우스 호버 시 전체 명칭 확인)

```typescript
// src/utils/aliases.ts (신규 파일, 아직 코딩 안 함)
const GRADE_ALIASES: Record<string, string> = {
  '안티바이러스 제품 (Mobile)': 'AV (Mobile)',
  '안티바이러스제품(Linux)': 'AV (Linux)',
  '소스코드 보안약점 분석도구': '소스코드 분석도구',
  '모듈형 안티바이러스 제품': '모듈형 AV',
};

export function getGradeDisplay(raw: string | null | undefined): string {
  if (!raw) return '-';
  return GRADE_ALIASES[raw] || raw;
}
```

**옵션 3: DB에 `display_name` 컬럼 추가** ⚪ 과한 접근
- 마이그레이션 필요, 관리자 UI 수정 필요
- 향후 별칭이 100개+ 늘어날 때 적합. 지금은 4개라 오버엔지니어링.

➡️ **권장: 옵션 2** (코드 측 매핑 함수, DB 무변경)

---

## 4. 변경 전후 비교 시뮬레이션

### 4.1 현재 (v40.1) 코드 vs 변경 후 (v40.2)

```diff
// src/templates/pages.tsx의 serviceProgressContent (line 743~751)
  <table class="w-full" style="table-layout:fixed; min-width:680px;">
    <colgroup>
      <col style="width:52px">                                     <!-- 번호 -->
-     <col style="width:auto">                                     <!-- 제품명 -->
+     <col style="width:auto">                                     <!-- 제품명 (auto, 자동 축소) -->
-     <col style="width:90px">                                     <!-- 등급 -->
+     <col style="width:220px">                                    <!-- 등급 ★ +130px -->
-     <col style="width:88px" class="hidden sm:table-column">      <!-- 구분 -->
+     <col style="width:140px" class="hidden sm:table-column">     <!-- 구분 ★ +52px -->
      <col style="width:88px" class="hidden md:table-column">      <!-- 유형 -->
      <col style="width:96px">                                     <!-- 진행상태 -->
    </colgroup>
```

### 4.2 동일 변경을 `progressPage()` 에도 적용 필요 (line 602~611)

```diff
// src/templates/pages.tsx의 progressPage (line 602~611)
    <colgroup>
      <col style="width:52px">                                     <!-- 번호 -->
      ${!categoryFilter ? '<col style="width:100px">' : ''}        <!-- 사업분류 (조건부) -->
      <col style="width:auto">                                     <!-- 제품명 -->
-     <col style="width:90px">
+     <col style="width:220px">                                    <!-- 등급 ★ -->
-     <col style="width:88px" class="hidden sm:table-column">
+     <col style="width:140px" class="hidden sm:table-column">     <!-- 구분 ★ -->
      <col style="width:88px" class="hidden md:table-column">
      <col style="width:96px">
    </colgroup>
```

### 4.3 minimum 가로폭 재계산

| 항목 | v40.1 (현재) | v40.2 (변경 후) |
|---|---|---|
| 고정 컬럼 합계 (제품명 제외) | 52+90+88+88+96 = **414px** | 52+220+140+88+96 = **596px** |
| 제품명 최소 확보 (auto) | 약 266px (680-414) | 약 84px (680-596) ⚠️ |
| `min-width` (현재 680px) | 적정 | **부족!** |

**⚠️ 주의**: `min-width:680px`은 제품명을 84px(약 5글자)밖에 못 표시하게 됨.
→ **`min-width:820px`로 함께 조정 필요!**

### 4.4 모바일/태블릿 영향

| 화면 폭 | v40.1 동작 | v40.2 동작 (Option B 적용) |
|---|---|---|
| ~640px (모바일) | 구분/유형 숨김 → 가로 232px 사용 | 구분/유형 숨김 → **가로 368px 사용** ⚠️ |
| 640~768px (태블릿) | 구분 표시, 유형 숨김 → 320px | **508px 사용** ⚠️ 약간 답답 |
| 768px~ (데스크탑) | 전체 표시 → 414px | **596px 사용** ✅ 정상 |

**⚠️ 모바일에서도 등급은 표시됨**. 220px이라 등급이 화면의 1/3 이상 차지하게 됨.
→ **대응책**: 모바일에서 등급도 약간 줄이는 반응형 CSS 추가 검토 필요.

```jsx
<!-- 권장 추가 -->
<col style="width:140px" class="sm:hidden">               <!-- 모바일 등급 (좁게) -->
<col style="width:220px" class="hidden sm:table-column">  <!-- 데스크탑 등급 (넓게) -->
```

이건 좀 복잡해지니, 우선은 220px 단일로 시작하고 모바일 확인 후 결정해도 됩니다.

---

## 5. 영향 범위 매트릭스

### 5.1 수정 대상 파일 & 함수

| 파일 | 함수 | 라인 | 영향 화면 | 우선순위 |
|---|---|---|---|---|
| `src/templates/pages.tsx` | `serviceProgressContent` | 743~751 | **10개 부서 progress 페이지** (사용자가 본 화면) | ⭐⭐⭐ |
| `src/templates/pages.tsx` | `progressPage` | 602~611 | `/support/progress` 전체 평가현황 | ⭐⭐ |
| `src/utils/aliases.ts` | (신규) | - | 별칭 매핑 (Q3) | ⭐⭐ |
| `src/index.tsx` | 캐시 버스터 | 648~649 | `?v=40.1` → `?v=40.2` | ⭐⭐⭐ |

### 5.2 영향 받는 부서 페이지 목록 (전부 자동 적용됨)

| 부서 | slug | URL | 좌측 메뉴 라벨 | 데이터 |
|---|---|---|---|---|
| CC평가 | cc | /cc/progress | "평가현황" | 142건 |
| **보안기능시험** | **security-test** | **/security-test/progress** | **"시험현황"** ⭐ | **72건** |
| 암호모듈검증 | kcmvp | /kcmvp/progress | "평가현황" | 2건 |
| 성능평가 | performance | /performance/progress | "평가현황" | 6건 |
| 시험성적서 | certificate | /certificate/progress | (있다면) | 0건 |
| 정보보안진단 | diagnosis | /diagnosis/progress | (있다면) | 0건 |
| 컨설팅 | consulting | /consulting/progress | (있다면) | 0건 |
| 산업(기업)보안 | enterprise-security | /enterprise-security/progress | (있다면) | 0건 |
| 정보보호준비도 | readiness | /readiness/progress | (있다면) | 0건 |
| 모의평가 | mock-test | /mock-test/progress | (있다면) | 0건 |

### 5.3 admin 화면은 영향 없음

✅ `public/static/js/admin-progress.js`는 별도. 관리자 화면은 v40.1 그대로 유지.

---

## 6. 위험 분석

### 6.1 잠재적 위험

| 위험 | 가능성 | 영향도 | 대응 |
|---|---|---|---|
| `min-width:680px`이 부족해 제품명 너무 좁음 | 🔴 높음 | 중 | `min-width:820px`로 조정 |
| 모바일에서 등급(220px)이 화면을 압도 | 🟡 중간 | 중 | 모바일은 별도 폭 적용 검토 |
| 별칭 매핑 시 원본 정보 손실 | 🟢 낮음 | 낮 | `title` 속성으로 원본 보존 |
| 캐시 미갱신으로 사용자가 변경 못 봄 | 🟡 중간 | 중 | `?v=40.2`로 캐시 버스터 |
| 다른 부서 progress 페이지에 의도치 않은 영향 | 🟢 낮음 | 낮 | 데이터가 같은 컬럼 구조라 OK |

### 6.2 회귀 테스트 체크리스트

배포 후 확인 항목:

- [ ] `/cc-eval/progress` 화면: 등급 컬럼에 "EAL2/EAL3/EAL4" 정상 표시
- [ ] `/security-test/progress` 화면: ⭐ "정보보호시스템" 잘림 없이 표시
- [ ] `/security-test/progress` 화면: "네트워크장비" 잘림 없이 표시
- [ ] 별칭 4건: "안티바이러스 제품 (Mobile)" → "AV (Mobile)" 표시
- [ ] 마우스 호버 시 `title`에 원본 명칭 표시
- [ ] 모바일 (~640px): 가로 스크롤 정상 작동
- [ ] 태블릿 (768px): 구분 표시, 제품명 너무 좁지 않은지
- [ ] 데스크탑: 사용자 만족도 (모니터 기준 등급 6cm 정도 되는지)

---

## 7. 권장 최종 변경안 ⭐

### 7.1 컬럼 폭 (Option B 채택)

| 컬럼 | v40.1 | v40.2 | 변화 |
|---|---|---|---|
| 번호 | 52px | 52px | (유지) |
| 제품명 | auto | auto | 자동 축소 |
| **등급** | **90px** | **220px** ★ | **+130px** |
| **구분** | **88px** | **140px** ★ | **+52px** |
| 유형 | 88px | 88px | (유지) |
| 진행상태 | 96px | 96px | (유지) |
| **min-width** | **680px** | **820px** ★ | **+140px** |

### 7.2 별칭 매핑 (옵션 2 채택)

신규 파일 `src/utils/aliases.ts` 추가:
```typescript
const GRADE_ALIASES: Record<string, string> = {
  '안티바이러스 제품 (Mobile)': 'AV (Mobile)',
  '안티바이러스제품(Linux)': 'AV (Linux)',
  '소스코드 보안약점 분석도구': '소스코드 분석도구',
  '모듈형 안티바이러스 제품': '모듈형 AV',
};
export function getGradeDisplay(raw: string | null | undefined): string {
  if (!raw) return '-';
  return GRADE_ALIASES[raw] || raw;
}
```

### 7.3 표시 시 `title` 속성으로 원본 보존

```diff
- <span ...>${escapeHtml(p.assurance_level || '-')}</span>
+ <span ... title="${escapeAttr(p.assurance_level || '')}">${escapeHtml(getGradeDisplay(p.assurance_level))}</span>
```

### 7.4 캐시 버스터

```diff
- <script src="/static/js/${jsFile}.js?v=40.1"></script>
+ <script src="/static/js/${jsFile}.js?v=40.2"></script>
```

---

## 8. 작업 시간 추정 (실제 코딩 시)

| Phase | 작업 내용 | 시간 |
|---|---|---|
| 1 | `serviceProgressContent` 컬럼 폭 수정 (2줄) | 3분 |
| 2 | `progressPage` 컬럼 폭 수정 (2줄) | 3분 |
| 3 | `min-width: 680→820px` 조정 (2군데) | 3분 |
| 4 | `src/utils/aliases.ts` 신규 작성 | 5분 |
| 5 | `getGradeDisplay()` 호출 위치 4군데 수정 | 7분 |
| 6 | `src/index.tsx` 캐시 버스터 갱신 | 2분 |
| 7 | `npm run build` | 2분 |
| 8 | PM2 재시작 + 로컬 검증 | 5분 |
| 9 | 프로덕션 배포 (`wrangler pages deploy`) | 5분 |
| 10 | 도메인 3개 (www/koist.ai.kr/pages.dev) 검증 | 5분 |
| 11 | 모바일/태블릿 시각 확인 | 5분 |
| 12 | git 커밋 + 태그 v40.2 + GitHub 푸시 | 5분 |
| **합계** | **약 50분** | |

---

## 9. 최종 결정 확인 사항

코딩 시작 전 사용자 확인 부탁드립니다:

### ✅ 확정된 사항 (이미 결정됨)
- 등급 220px / 구분 140px
- 부서별 progress 페이지 우선 (CC평가 + 보안기능시험 + 자동으로 8개 부서 더)
- 긴 텍스트 별칭 매핑

### ❓ 추가 결정 필요 사항

**Q1. `min-width` 조정?**
- 680px → **820px** (권장, 데스크탑 위주 안정)
- 680px 유지 (모바일 친화, 제품명이 매우 좁아짐)

**Q2. 별칭 4건 확인** (DB 원본 → 표시명)
- "안티바이러스 제품 (Mobile)" → **"AV (Mobile)"** ← 사용자 동의?
- "안티바이러스제품(Linux)" → **"AV (Linux)"** ← 사용자 동의?
- "소스코드 보안약점 분석도구" → **"소스코드 분석도구"** ← 사용자 동의?
- "모듈형 안티바이러스 제품" → **"모듈형 AV"** ← 사용자 동의?

**Q3. `progressPage()` (전체 평가현황 `/support/progress`)도 함께 수정?**
- ⭐ **함께 수정** (권장, 일관성)
- 부서별 페이지만 수정

**Q4. 변경 시점**
- 지금 바로 진행
- 사무실에서 본인 모니터 보면서 미세 조정 후 진행

---

## 10. 부록: 두 화면 동일 코드 증명

`src/index.tsx` 의 부서별 라우트 (line 262):

```typescript
// pageSlug === 'progress' 일 때 (좌측 메뉴 "평가현황/시험현황" 클릭 시)
if (pageSlug === 'progress') {
  // ... DB에서 데이터 조회 ...
  const dynamicContent = serviceProgressContent(items, page, total, perPage,
                                                 search, statusFilter,
                                                 categoryFilter, categoryCounts);
  // ⭐ 모든 부서가 이 함수 하나로 처리됨
}
```

**증명 끝**: CC평가/보안기능시험/암호모듈검증/성능평가 모두 동일 함수 사용 → **한 번에 모두 해결!**

---

**작성일**: 2026-06-02 12:00 KST
**작성자**: KOIST AI Assistant
**관련 파일**:
- `src/templates/pages.tsx:512` `progressPage()`
- `src/templates/pages.tsx:673` `serviceProgressContent()` ⭐ **최우선 수정 대상**
- `src/index.tsx:262, 648` 부서별 라우트 + 캐시 버스터
- (신규) `src/utils/aliases.ts`

**버전 표기**: v40.1 → **v40.2** (`?v=40.2` 캐시 버스터)

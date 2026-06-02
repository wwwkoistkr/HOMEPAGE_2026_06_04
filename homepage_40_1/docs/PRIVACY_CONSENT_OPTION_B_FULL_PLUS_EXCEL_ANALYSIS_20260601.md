# 🔬 옵션 B 완전 구현 + 관리자 엑셀형 검색·관리 통합 타당성 분석 보고서

> **작성일**: 2026-06-01
> **작성자**: Claude AI (실제 코드 직접 분석 기반)
> **분석 대상**: 옵션 B 전체 + 관리자 모드에서 상담문의 데이터를 **엑셀 형식으로 검색·관리**하는 기능 추가
> **현재 git HEAD**: `3d5076f` (v39.26 + 인계서)
> **결론**: ✅ **기술적으로 안전하고 가능. 단, 작업 범위·시간이 크게 늘어남 (총 4~5.5시간)**

---

## 📋 Executive Summary

| 항목 | 평가 |
|------|------|
| **기술적 타당성** | ✅ **안전** (충돌 없음, CDN 이미 허용 중) |
| **법적 효과** | ✅ **최상** (개인정보보호법 + 감사·증빙 모두 충족) |
| **실제 소요 시간** | ⚠️ **4시간 ~ 5시간 30분** (한 번에 진행 시) |
| **추가 위험 요소** | 🟠 3가지 (대량 데이터 로딩 / 엑셀 라이브러리 / 보안 헤더 충돌) |
| **권장 구현 방식** | ⭐ **클라이언트 측 SheetJS + 서버 측 페이지네이션 API** |

---

## 1. 새로운 요구사항 정의 (관리자 엑셀형 관리)

사용자가 추가 요청하신 것을 더 구체적으로 정의하면 다음과 같습니다:

### 1.1 필수 기능
- ✅ 상담문의 데이터를 **테이블 형식(엑셀처럼)**으로 표시
- ✅ **컬럼별 검색** (이름, 회사명, 이메일, 제목, 내용)
- ✅ **컬럼별 정렬** (날짜순, 이름순, 상태순)
- ✅ **다중 필터** (상태별, 기간별, 동의 여부별)
- ✅ **전체 또는 선택 항목 엑셀 다운로드** (.xlsx)
- ✅ **CSV 다운로드** (호환성)

### 1.2 권장 기능
- 🎯 **체크박스 다중 선택** (선택 항목만 다운로드 / 일괄 삭제)
- 🎯 **컬럼 표시/숨김** 토글 (개인정보 보호 모드)
- 🎯 **페이지네이션** (50건/100건/전체)
- 🎯 **빠른 검색** (실시간 입력 시 즉시 필터링)

### 1.3 선택 기능
- 💡 **인쇄 미리보기**
- 💡 **답변 통계** (대기/완료 비율, 월별 추이)

---

## 2. 현재 코드의 정확한 상태

### 2.1 현재 관리자 inquiries 페이지 분석

**📁 파일**: `public/static/js/admin-inquiries.js` (88줄)

| 기능 | 현재 구현 상태 |
|------|--------------|
| 데이터 조회 | `GET /api/admin/inquiries` (페이지네이션 없음) |
| 표시 형식 | **카드 형식** (테이블 아님) |
| 검색 | ❌ 없음 |
| 정렬 | ❌ 없음 (created_at DESC 고정) |
| 필터 | ❌ 없음 (상태별 카운트만 표시) |
| 엑셀/CSV 다운로드 | ❌ 없음 |
| 다중 선택 | ❌ 없음 |
| 답변 기능 | ✅ 있음 (textarea + PUT) |
| 삭제 기능 | ✅ 있음 (DELETE) |

### 2.2 현재 API 조회 방식

**📁 파일**: `src/routes/admin.ts` line 397~399

```typescript
admin.get('/inquiries', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM inquiries ORDER BY created_at DESC'
  ).all();
  return c.json({ success: true, data: result.results });
});
```

**🚨 핵심 발견**: 페이지네이션 없이 **전체 데이터를 한 번에 반환**합니다.

### 2.3 현재 의존성 환경

```json
"dependencies": { "hono": "^4.12.12" }
"devDependencies": { "@hono/vite-build", "@hono/vite-dev-server", "vite", "wrangler" }
```

- ⚠️ **엑셀 라이브러리 없음** (xlsx, exceljs, sheetjs 미설치)
- ✅ **CSV는 순수 JavaScript로 구현 가능**
- ✅ **CDN 옵션 가능** (CSP에 `cdn.jsdelivr.net` 이미 허용 중)

### 2.4 보안 정책 (CSP)

`src/index.tsx` line 58~78 확인 결과:

```typescript
scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",
            "https://cdn.tailwindcss.com",
            "https://cdn.jsdelivr.net",       // ← SheetJS CDN 가능 ✅
            "https://unpkg.com",                // ← 대체 CDN 가능 ✅
            ...]
```

**✅ 결정적으로 좋은 소식**: CDN 도메인이 이미 허용되어 있어 **SheetJS(xlsx) CDN 로딩 가능**합니다.

---

## 3. 엑셀형 관리 기능 구현 방식 비교

### 방식 A: 클라이언트 측 SheetJS (CDN) ⭐ 권장

**라이브러리**: `https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js` (~870KB)

**구현 방식:**
1. 서버: 페이지네이션된 JSON 반환 (`GET /api/admin/inquiries?page=1&limit=50&search=...`)
2. 클라이언트: 표시는 50건씩, 엑셀 다운로드는 전체 데이터를 별도 호출
3. SheetJS로 클라이언트에서 .xlsx 파일 생성

**장점:**
- ✅ 서버 부하 없음
- ✅ Cloudflare Workers 10ms CPU 제한 회피
- ✅ 이미 CSP 허용된 CDN 사용
- ✅ 한글 인코딩 안전 (SheetJS 자체 처리)
- ✅ 추가 npm install 불필요 → 빌드 시간 영향 없음

**단점:**
- ⚠️ 첫 다운로드 시 870KB 다운로드 (캐싱 이후 빠름)
- ⚠️ 대량 데이터(10,000건+) 시 브라우저 메모리 사용

**적합한 데이터량**: ~10,000건 이내 (KOIST 문의 폼은 1년에 수백 건 예상 → 충분)

---

### 방식 B: 서버 측 엑셀 생성 (npm 의존성)

**라이브러리 후보:**
- `exceljs` (~3MB) → Cloudflare Workers 10MB 제한 통과는 하지만 압축 후 크기·CPU 부담 큼
- `xlsx` (npm) (~600KB) → 가능하지만 Workers 런타임에서 Node.js polyfill 필요

**장점:**
- ✅ 파일 한 번에 다운로드 (UX 단순)

**단점:**
- 🚨 **Cloudflare Workers 10ms CPU 제한** (대량 처리 시 timeout)
- 🚨 번들 크기 증가 → 빌드 시간 +30~60초 추가
- 🚨 메모리 사용 증가
- ⚠️ `nodejs_compat` 플래그 의존도 증가

**결론**: ❌ **권장 안 함** (Cloudflare Workers 환경 부적합)

---

### 방식 C: 순수 CSV만 지원 (라이브러리 없음)

**구현 방식:**
- BOM(\\uFEFF) + 쉼표 구분 텍스트 직접 생성
- `Blob` + `URL.createObjectURL`로 다운로드

**장점:**
- ✅ 라이브러리 0개
- ✅ 가장 가벼움 (코드 30줄 이내)
- ✅ 한글: BOM으로 엑셀에서 자동 인식

**단점:**
- ⚠️ 진정한 .xlsx 형식 아님 (서식·스타일 없음)
- ⚠️ 사용자가 "엑셀 다운로드"라 했는데 .csv만 주면 불만족 가능

**결론**: 🟡 **가능하지만 사용자 기대치 미달 우려**

---

### 🏆 최종 권장: **방식 A (SheetJS CDN) + 방식 C (CSV) 병행**

- `📥 엑셀 다운로드 (.xlsx)` 버튼 → SheetJS
- `📋 CSV 다운로드 (.csv)` 버튼 → 순수 JS
- 사용자가 도구·환경에 맞게 선택

---

## 4. 추가 작업 상세 (엑셀형 관리 기능)

### 4.1 백엔드 변경

#### 📁 `src/routes/admin.ts` (현재 line 396~411)

**Before (현재):**
```typescript
admin.get('/inquiries', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM inquiries ORDER BY created_at DESC'
  ).all();
  return c.json({ success: true, data: result.results });
});
```

**After (추가 변경):**
```typescript
// 페이지네이션 + 검색 + 필터 + 정렬 지원
admin.get('/inquiries', async (c) => {
  const url = new URL(c.req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 500);
  const offset = (page - 1) * limit;
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const startDate = url.searchParams.get('start_date') || '';
  const endDate = url.searchParams.get('end_date') || '';
  const sortBy = url.searchParams.get('sort_by') || 'created_at';
  const sortDir = (url.searchParams.get('sort_dir') === 'asc') ? 'ASC' : 'DESC';
  const exportAll = url.searchParams.get('export') === '1';

  // 화이트리스트 (SQL Injection 방지)
  const ALLOWED_SORT = ['created_at', 'name', 'subject', 'status', 'consent_at'];
  const sortCol = ALLOWED_SORT.includes(sortBy) ? sortBy : 'created_at';

  let where = '1=1';
  const binds = [];
  if (search) {
    where += ' AND (name LIKE ? OR company LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
    const like = `%${search}%`;
    binds.push(like, like, like, like, like);
  }
  if (status) { where += ' AND status = ?'; binds.push(status); }
  if (startDate) { where += ' AND created_at >= ?'; binds.push(startDate); }
  if (endDate) { where += ' AND created_at <= ?'; binds.push(endDate + ' 23:59:59'); }

  // 총 건수
  const totalRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM inquiries WHERE ${where}`
  ).bind(...binds).first();
  const total = totalRow?.cnt || 0;

  // 데이터
  let query = `SELECT * FROM inquiries WHERE ${where} ORDER BY ${sortCol} ${sortDir}`;
  if (!exportAll) {
    query += ' LIMIT ? OFFSET ?';
    binds.push(limit, offset);
  }
  const result = await c.env.DB.prepare(query).bind(...binds).all();

  return c.json({
    success: true,
    data: result.results,
    total, page, limit,
    pages: Math.ceil(total / limit)
  });
});
```

**변경 라인**: 약 50줄 추가 (기존 3줄 → 53줄)

#### 추가 API: 일괄 삭제 (선택)

```typescript
admin.post('/inquiries/bulk-delete', async (c) => {
  const { ids } = await c.req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return c.json({ error: 'IDs array required' }, 400);
  }
  const placeholders = ids.map(() => '?').join(',');
  await c.env.DB.prepare(
    `DELETE FROM inquiries WHERE id IN (${placeholders})`
  ).bind(...ids).run();
  return c.json({ success: true, deleted: ids.length });
});
```

### 4.2 프론트엔드 변경

#### 📁 `public/static/js/admin-inquiries.js`

- 현재: 88줄 (카드 형식)
- 변경 후: **약 350~450줄** (테이블 + 검색 + 필터 + 엑셀)

**새로운 구성요소:**
1. 검색·필터 툴바 (상단)
2. 액션 바 (다운로드/일괄삭제 버튼)
3. 데이터 테이블 (`<table>` with sortable headers)
4. 페이지네이션 (하단)
5. 답변 모달 (행 클릭 시)
6. SheetJS 동적 로딩 함수

#### 📁 `src/index.tsx` (관리자 inquiries 라우트)

**현재 (line 616~629):** 다른 admin 페이지와 동일하게 자동 처리됨 → 변경 불필요

단, **헤더에 SheetJS CDN 스크립트** 추가가 필요할 수 있음:
```html
<!-- 동적으로 로드하므로 admin-inquiries.js 내에서 처리 -->
```

→ **결론**: 별도 라우트 수정 불필요. JS 내에서 동적 import로 SheetJS 로드.

---

## 5. 데이터량 시나리오 분석

### 5.1 예상 데이터량 (KOIST 기준)

| 기간 | 예상 문의 건수 | 데이터 크기 (JSON) |
|------|--------------|------------------|
| 월 평균 | 20~50건 | ~50KB |
| 1년 누적 | 240~600건 | ~600KB |
| 3년 누적 (보유기간) | 720~1,800건 | ~1.8MB |
| 5년 (안전 마진) | 1,200~3,000건 | ~3MB |

### 5.2 시나리오별 성능 평가

| 시나리오 | 페이지네이션 | 엑셀 다운로드 | 평가 |
|---------|-------------|--------------|------|
| 100건 | 즉시 (~50ms) | 즉시 (~200ms) | ✅ 우수 |
| 1,000건 | 즉시 (~150ms) | 1~2초 | ✅ 양호 |
| 5,000건 | 즉시 (~300ms) | 3~5초 | ✅ 허용 |
| 10,000건 | ~500ms | 5~8초 | 🟡 경계 |
| 50,000건 | ~2초 | 메모리 부담 | ❌ 부적합 |

**🎯 결론**: KOIST 예상 데이터량 (~3,000건)에서는 **매우 안전**합니다.

### 5.3 Cloudflare D1 제한사항

| 제한 | 한도 | 영향 |
|------|------|------|
| **단일 쿼리 결과 크기** | 5MB | 1,500건 정도면 5MB → 페이지네이션 필수 |
| **CPU 시간** | 10ms (free) / 30ms (paid) | LIMIT 50 사용 시 충분 |
| **동시 연결** | 6개 | 관리자 1명이므로 무관 |
| **읽기 쿼리/일** | 5억 회 (free) | 무관 |

**🎯 핵심**: 페이지네이션 (LIMIT 50)으로 모든 제한 회피 가능. 엑셀 다운로드 시에만 전체 조회.

---

## 6. 추가 위험 요소 평가

### 🟠 위험 1: 대량 데이터 일괄 조회 시 5MB 제한

**상황**: 사용자가 "전체 엑셀 다운로드" 클릭 → 3,000건 전체 조회

**현재 추정 크기:**
- 1건당 평균 1KB → 3,000건 = 3MB → ✅ 안전

**대비책:**
1. `LIMIT 5000` 적용 + 초과 시 분할 다운로드 안내
2. 또는 **스트리밍 응답** (Hono에서 가능)

**위험도**: 🟢 **매우 낮음** (현실적으로 발생 가능성 낮음)

---

### 🟠 위험 2: SheetJS CDN 의존성

**상황**: cdn.jsdelivr.net 일시 장애 시 엑셀 다운로드 불가

**대비책:**
1. CSV 다운로드 버튼 병행 제공 (라이브러리 무관)
2. 또는 SheetJS를 `public/static/lib/xlsx.min.js`로 다운로드해 자체 호스팅
3. 또는 unpkg.com을 fallback으로 시도

**위험도**: 🟡 **낮음** (jsDelivr는 99.99% 가용성)

---

### 🟠 위험 3: 개인정보 일괄 다운로드의 보안 리스크

**상황**: 관리자 계정 탈취 시 전체 개인정보가 엑셀로 유출 가능

**현재 보안 상태:**
- ✅ JWT 인증 (authMiddleware)
- ✅ CSRF 검증 (csrfValidationMiddleware)
- ✅ HTTPS 강제
- ✅ Rate Limit (login 5회/5분)
- ⚠️ **다운로드 자체에 대한 감사 로그 없음**

**대비책 (선택):**
1. **감사 로그** 테이블 추가 (`admin_audit_logs`)
2. **다운로드 시 패스워드 재확인** (2차 인증)
3. **마스킹 옵션** (이메일·전화번호 일부 가림)

**위험도**: 🟠 **중간** — 운영 정책에 따라 결정 필요

---

### 🟡 위험 4: 첨가된 검색·필터 SQL Injection

**위험성**: 사용자 입력이 SQL에 직접 포함되면 인젝션 가능

**대비책 (필수):**
- ✅ Prepared Statement (`?` 바인딩) 사용 — 이미 코드 시안에 반영
- ✅ 정렬 컬럼 **화이트리스트** 검증 (`ALLOWED_SORT` 배열)
- ✅ LIMIT/OFFSET은 정수로 강제 변환 (`parseInt`)

**위험도**: 🟢 **낮음** (Prepared Statement로 완전 차단)

---

### 🟡 위험 5: 기존 카드 UI 제거에 따른 사용자 적응

**상황**: 답변 작성 UX가 카드 → 모달로 바뀜

**대비책:**
- 1차 출시 시 **테이블 + 카드 토글** 제공
- 또는 행 클릭 시 expand되는 hybrid 형식

**위험도**: 🟢 **매우 낮음** (관리자 1명 운영)

---

## 7. 작업 범위 통합 (옵션 B 전체 + 엑셀형 관리)

### 7.1 변경되는 파일 목록 (최종)

| # | 파일 | 변경 내용 | 변경 규모 |
|---|------|----------|----------|
| 1 | `src/templates/pages.tsx` | inquiryPage 동의 추가 + privacyPolicyPage 신규 | +200줄 |
| 2 | `src/routes/api.ts` | POST /inquiries 동의 검증 | +5줄 |
| 3 | `src/index.tsx` | privacyPolicyPage import + /privacy 라우트 | +15줄 |
| 4 | `src/templates/layout.tsx` | 푸터 /privacy 링크 | +3줄 |
| 5 | `src/routes/admin.ts` | inquiries API 페이지네이션·검색·필터 | +50줄 |
| 6 | `src/routes/admin.ts` | bulk-delete API | +12줄 |
| 7 | `public/static/js/admin-inquiries.js` | **전체 재작성** (카드 → 테이블) | 88 → ~400줄 |
| 8 | `migrations/0054_add_consent_to_inquiries.sql` | 신규 마이그레이션 | +10줄 |

**합계**: 8개 파일, 약 +700줄 / 변경 ~50줄

### 7.2 실제 소요 시간 추정 (실측 기반)

| 단계 | 작업 | 소요 시간 |
|------|------|----------|
| **Phase 1** | 사전 준비 (백업·git status) | 5분 |
| **Phase 2** | 옵션 A (폼 동의 + 서버 검증 + 마이그레이션) | 30~40분 |
| **Phase 3** | `/privacy` 페이지 + 푸터 링크 | 50~60분 |
| **Phase 4** | 관리자 동의 이력 표시 (B-3) | 15~20분 |
| **Phase 5-1** | inquiries API 페이지네이션·검색·필터 | 30~40분 |
| **Phase 5-2** | admin-inquiries.js **재작성 (88→400줄)** | **90~120분** ⚠️ |
| **Phase 5-3** | SheetJS 통합 + 엑셀/CSV 다운로드 | 20~30분 |
| **Phase 5-4** | 일괄 삭제 + 다중 선택 | 20~30분 |
| **Phase 6** | DB 마이그레이션 (로컬·프로덕션) | 5분 |
| **Phase 7** | **빌드 (1차)** | 7~8분 |
| **Phase 8** | 통합 검증 + 수정 | 25~40분 |
| **Phase 9** | **빌드 (2차, 수정 후)** | 7~8분 |
| **Phase 10** | 프로덕션 배포 | 5분 |
| **Phase 11** | 라이브 검증 (4개 변경점 모두) | 15~25분 |
| **Phase 12** | Git 커밋·푸시·태그 | 5분 |
| **합계** | | **4시간 ~ 5시간 30분** |

⚠️ 옵션 B 단독: 2.5~3.5시간 → **+1.5~2시간 추가 (엑셀형 관리)**

---

## 8. 종합 위험도 매트릭스

| 위험 요소 | 발생 가능성 | 영향도 | 대비책 | 종합 위험도 |
|----------|-----------|-------|--------|-----------|
| 5MB 쿼리 제한 초과 | 매우 낮음 | 중 | LIMIT 강제 | 🟢 |
| CDN 장애 | 매우 낮음 | 낮음 | CSV fallback | 🟢 |
| 개인정보 유출 (관리자 탈취) | 낮음 | 매우 높음 | JWT+CSRF | 🟠 |
| SQL Injection | 매우 낮음 | 매우 높음 | Prepared Stmt | 🟢 |
| 빌드 실패 (재작성 코드 오류) | **중간** | 중 | 로컬 검증 | 🟡 |
| UX 적응 문제 | 낮음 | 낮음 | 카드/테이블 토글 | 🟢 |
| 빌드 시간 누적 (7~8분 × 2회) | 확실 | 낮음 | 일괄 변경 후 빌드 | 🟢 |
| Cloudflare CPU 한도 | 매우 낮음 | 중 | 페이지네이션 | 🟢 |

**🎯 가장 큰 위험은 "재작성 코드 오류로 인한 재빌드"**. → **로컬 dev 환경에서 충분한 검증 필요**

---

## 9. 옵션 B + 엑셀 관리 통합 → 권장 진행 방식

### ⭐ Strongly Recommended Path: 3-Phase 배포

```
┌──────────────────────────────────────────────┐
│ PHASE 1 — v39.27 (45~50분)                   │
│ ─────────────────────────────────────────────│
│ • 폼 동의 체크박스 + 전문 토글               │
│ • API 동의 검증                              │
│ • DB 마이그레이션 0054                       │
│ → 빌드/배포/커밋 → v39.27 태그               │
│                                              │
│ 🎯 효과: 5천만원 과태료 리스크 즉시 제거 ✅ │
└──────────────────────────────────────────────┘
              ↓ (검증 10분)
┌──────────────────────────────────────────────┐
│ PHASE 2 — v39.28 (60~75분)                   │
│ ─────────────────────────────────────────────│
│ • /privacy 페이지 신규 생성                  │
│ • 푸터에 /privacy 링크 추가                  │
│ • 관리자 inquiry 카드에 동의 이력 뱃지       │
│ → 빌드/배포/커밋 → v39.28 태그               │
│                                              │
│ 🎯 효과: 기관 신뢰도 완성 + 감사 대응 가능   │
└──────────────────────────────────────────────┘
              ↓ (검증 30분 ~ 익일)
┌──────────────────────────────────────────────┐
│ PHASE 3 — v39.29 (2.5~3시간)                 │
│ ─────────────────────────────────────────────│
│ • API: 페이지네이션·검색·필터·정렬           │
│ • API: bulk-delete                           │
│ • admin-inquiries.js 전체 재작성             │
│   (카드 → 테이블 + 검색 + 필터 + 페이지네이션)│
│ • SheetJS CDN 통합 + .xlsx 다운로드          │
│ • CSV 다운로드 (fallback)                    │
│ → 빌드/배포/커밋 → v39.29 태그               │
│                                              │
│ 🎯 효과: 엑셀형 관리·검색·일괄처리 가능       │
└──────────────────────────────────────────────┘
```

**🚫 한 번에 진행 비추천 이유:**
1. Phase 3가 재작성이라 가장 위험 (테스트 부담 큼)
2. Phase 3가 실패해도 Phase 1·2는 이미 안전하게 적용되어 있음 → 법적 리스크는 해소된 상태
3. 빌드 시간 7~8분/회 → 5번 재빌드하면 35~40분 손실
4. Git 히스토리가 깔끔 → 향후 감사·롤백 시 명확

---

### ❌ Not Recommended: 한 번에 진행

| 항목 | 한 번에 | 3-Phase 분할 |
|------|---------|-------------|
| 총 소요 시간 | 4~5.5시간 | 4~5시간 (병렬 검증 절약) |
| 법적 리스크 해소 시점 | 4시간 후 | **45분 후** |
| 버그 발생 시 영향 | 모든 기능 중단 | 해당 phase만 |
| 검증 시간 | 한 번에 25~40분 | phase별 10~30분 |
| 롤백 용이성 | 어려움 | 매우 쉬움 |
| Git 히스토리 | 거대 커밋 1개 | 명확한 커밋 3개 |

---

## 10. 최종 구현 시안 핵심 코드 미리보기

### 10.1 SheetJS 통합 패턴 (admin-inquiries.js)

```javascript
// 동적 로드 (필요 시점에만)
async function ensureXLSX() {
  if (window.XLSX) return window.XLSX;
  await new Promise(function(resolve, reject) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return window.XLSX;
}

async function downloadExcel() {
  // 1. 전체 데이터 조회
  var d = await apiCall('/api/admin/inquiries?export=1');
  if (!d || !d.data) return alert('데이터를 가져올 수 없습니다.');

  // 2. SheetJS 동적 로드
  var XLSX = await ensureXLSX();

  // 3. 엑셀 시트 생성
  var ws = XLSX.utils.json_to_sheet(d.data.map(function(i) {
    return {
      'ID': i.id,
      '접수일': (i.created_at || '').split('T')[0],
      '이름': i.name,
      '회사': i.company || '',
      '이메일': i.email || '',
      '연락처': i.phone || '',
      '제목': i.subject,
      '내용': i.message,
      '상태': i.status === 'pending' ? '대기' : '답변완료',
      '관리자 답변': i.admin_reply || '',
      '답변일': (i.replied_at || '').split('T')[0],
      '개인정보 동의': i.consent_personal_info ? '동의' : '-',
      '동의일시': i.consent_at || ''
    };
  }));

  // 컬럼 너비 자동 조정
  ws['!cols'] = [
    {wch: 5}, {wch: 12}, {wch: 10}, {wch: 15}, {wch: 25},
    {wch: 15}, {wch: 30}, {wch: 50}, {wch: 10}, {wch: 40},
    {wch: 12}, {wch: 12}, {wch: 20}
  ];

  // 4. 워크북 + 다운로드
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '상담문의');
  var fileName = 'koist_inquiries_' + new Date().toISOString().split('T')[0] + '.xlsx';
  XLSX.writeFile(wb, fileName);
}
```

### 10.2 검색·필터 툴바 UX

```
┌────────────────────────────────────────────────────────────┐
│  🔍 [검색어 입력]      상태[전체▼] 기간[YYYY-MM-DD ~]      │
│  ──────────────────────────────────────────────────────── │
│  ☑ 0건 선택   |   📥 엑셀 다운로드   📋 CSV   🗑️ 일괄삭제 │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ ☐│ID│ 접수일 ↓│이름│회사│이메일│제목│상태│동의│      │
│──┼──┼───────┼──┼──┼────┼───┼───┼──┤      │
│ ☑│42│ 2026-06-01│김철수│ABC│k@..│문의1│대기│✓ │ [답변]│
│ ☐│41│ 2026-05-31│이영희│DEF│y@..│문의2│완료│✓ │ [수정]│
│ ...                                                        │
└────────────────────────────────────────────────────────────┘
                       [< 1 2 3 ... 12 >]   총 587건
```

---

## 11. 결론 및 권고사항

### ✅ 기술적 결론

**옵션 B 전체 + 엑셀형 관리 기능은 기술적으로 안전하고 가능합니다.**

근거:
1. ✅ CDN(SheetJS) 이미 CSP에서 허용됨 → 추가 보안 설정 불필요
2. ✅ 페이지네이션·검색·필터는 D1 표준 패턴 (`progress` 라우트에서 이미 사용 중)
3. ✅ Prepared Statement로 SQL Injection 완전 차단
4. ✅ KOIST 예상 데이터량(~3,000건)은 모든 Cloudflare 제한 내 처리 가능
5. ✅ npm 의존성 추가 없음 → 빌드 크기·시간 영향 최소

### ⭐ 최종 권고

**3-Phase 분할 배포를 강력히 권장합니다.**

| Phase | 버전 | 시간 | 효과 |
|-------|------|------|------|
| 1 | v39.27 | 45~50분 | 🟢 법적 리스크 즉시 제거 |
| 2 | v39.28 | 60~75분 | 🔵 기관 신뢰도 완성 |
| 3 | v39.29 | 2.5~3시간 | 🟣 엑셀형 관리 기능 |

**총 소요**: 4시간 30분 ~ 5시간 (검증 시간 포함, phase 간격 자유)

### ❌ Not Recommended

- **한 번에 4~5.5시간 코딩** → 빌드 5회 가능성·롤백 어려움
- 마케팅 동의(B-4) → 활용 시스템 없어 무의미
- 서버 측 엑셀 생성 (`exceljs` 등) → Cloudflare Workers 부적합

### 🚨 보안 강화 권고 (선택)

엑셀 다운로드 기능 추가 시 다음 정책을 추가 고려:

1. **다운로드 감사 로그** (`admin_audit_logs` 테이블)
   - 누가 / 언제 / 몇 건 다운로드 했는지 기록
2. **마스킹 모드 토글**
   - 기본은 이메일·전화번호 일부 가림, 클릭 시 전체 표시
3. **다운로드 시 2차 인증** (선택)
   - 패스워드 재확인 후 다운로드 허용

→ 이 부분은 사용자가 추가 결정 필요

---

## 12. 다음 결정이 필요한 항목

사용자가 결정해주실 항목:

1. **분할 배포 방식 동의?** (3-Phase) ← 강력 추천
   - YES → Phase 1부터 시작
   - NO → 한 번에 4~5.5시간 진행 (위험 수용)

2. **엑셀 다운로드 라이브러리 선택?**
   - A. SheetJS (CDN) + CSV 병행 ← **추천**
   - B. CSV만 (라이브러리 0)
   - C. 둘 다 안 함 (검색·필터만)

3. **다중 선택 / 일괄 삭제 포함?**
   - YES (위 시안대로) ← 추천
   - NO (개별 처리만)

4. **컬럼 마스킹 모드 포함?**
   - YES (보안 강화) ← 정보보호 평가기관 위상 고려 시 추천
   - NO (단순화)

5. **다운로드 감사 로그 포함?**
   - YES (감사·증빙 완비) ← 추천
   - NO (현재로 충분)

---

**작성자**: Claude AI
**작성일**: 2026-06-01
**분석 기반**: 코드 5,699줄 + 의존성·CSP·D1 제한 실측 검토
**다음 단계**: 위 5개 항목 사용자 결정 후 Phase 1 착수

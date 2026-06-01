# 🏢 사무실 작업 인수인계 — v40.1 안정 상태에서 이어가기

**작성일**: 2026-06-01
**현재 위치**: v40.1 (안정 배포 완료)
**다음 작업 장소**: 사무실
**작성자**: AI Developer → 사무실 본인

---

## ⚡ 1분 요약 (TL;DR)

| 항목 | 상태 |
|------|------|
| 📦 **마지막 배포 버전** | v40.1 (안정) |
| 🌐 **운영 도메인** | 3개 모두 정상 (HTTP 200) |
| 📊 **DB 상태** | 정합성 100%, orphan 0 |
| 🔀 **Git** | main 브랜치, working tree clean |
| 🏷️ **최신 태그** | `v40.1` |
| 📝 **미커밋 변경** | **없음** (모두 push 완료) |

➡️ **사무실에서 git clone 또는 git pull만 하면 즉시 이어 작업 가능**

---

## 📍 1. 사무실에서 환경 복구 (Quick Start)

### 1.1 처음 시작 (저장소 클론)

```bash
# GitHub에서 최신 코드 가져오기
git clone https://github.com/wwwkoistkr/HOMEPAGE.git webapp
cd webapp

# 의존성 설치 (~3분)
npm install

# 빌드 확인
npm run build
```

### 1.2 기존 환경이 있는 경우 (이미 클론한 적 있음)

```bash
cd webapp
git checkout main
git pull origin main

# 새 마이그레이션이나 의존성 변경이 있을 수 있으니
npm install
npm run build
```

### 1.3 로컬 개발 서버 실행

```bash
# 포트 정리
fuser -k 3000/tcp 2>/dev/null || true

# PM2로 백그라운드 실행 (pm2 설치 필요시: npm i -g pm2)
pm2 start ecosystem.config.cjs

# 동작 확인
curl http://localhost:3000
```

브라우저: http://localhost:3000

### 1.4 로컬 D1 데이터베이스 마이그레이션 적용

```bash
# 로컬 D1에 모든 마이그레이션 적용 (0055 포함)
npx wrangler d1 migrations apply koist-website-db --local
```

### 1.5 Cloudflare 인증 (운영 배포 시)

```bash
# 사무실 컴퓨터에서 처음이라면 Cloudflare API 토큰 필요
# 운영 배포는 다음 명령으로:
npx wrangler pages deploy dist --project-name koist-website \
  --branch main --commit-dirty=true --commit-message="vXX.X deploy"
```

**중요**: API 토큰은 Genspark Deploy 패널에서 받거나, 사무실 환경에서 별도 등록.

---

## 🗺️ 2. 현재 시스템 구조 한눈에 보기

### 2.1 디렉토리 맵

```
webapp/
├── src/
│   ├── index.tsx                      # Hono 메인 + 라우트 (admin layout, ?v=40.1)
│   ├── routes/
│   │   ├── admin.ts                   # v40.0 progress_meta API
│   │   └── api.ts
│   └── templates/
│       ├── home.tsx                   # 메인 페이지
│       └── pages.tsx                  # 서브 페이지
├── public/static/js/
│   ├── admin-progress.js              # ⭐ v40.1 평가현황 (29KB)
│   ├── admin-departments.js           # ⭐ v40.0 사업분야 + meta 편집
│   ├── admin-fetch.js                 # API 호출 헬퍼
│   └── ... (other admin pages)
├── migrations/
│   ├── 0055_v40_unify_categories.sql  # ⭐ v40.0 신규
│   └── ... (0001~0054)
├── docs/                              # 📚 분석보고서 모음
│   ├── V40_1_PROGRESS_UI_ANALYSIS_REPORT_20260601.md   # 문제·해결
│   ├── V40_1_FINAL_VERIFICATION_REPORT_20260601.md     # 검증 결과
│   └── HANDOFF_OFFICE_20260601.md                      # 이 문서
├── wrangler.jsonc                     # Cloudflare 설정
├── ecosystem.config.cjs               # PM2 설정
├── package.json
├── README.md                          # v40.0 섹션 포함
└── .git/
```

### 2.2 핵심 데이터 흐름 (v40.0 이후)

```
[관리자]
   ↓ 카테고리 추가/수정
[/admin/departments]
   ↓ POST/PUT /api/admin/departments (progress_meta JSON)
[D1: departments 테이블]
   ↓ is_main_progress=1 마킹
   ↓ progress_meta JSON 저장
[/admin/progress 로딩]
   ↓ GET /api/admin/departments
[admin-progress.js]
   ↓ loadDepartments() → categoriesMeta + mainCategories
   ↓ 4+1 카드 + 매트릭스 렌더링
[브라우저 화면]
```

---

## 🔑 3. 핵심 파일 빠른 참조

### 3.1 v40.1 변경 파일 (4개)

| 파일 | 핵심 역할 | 라인 |
|------|----------|------|
| `migrations/0055_v40_unify_categories.sql` | DB: progress_meta + is_main_progress 컬럼 + 카테고리 이름 통일 | 10 SQL |
| `src/routes/admin.ts` | API: PUT/POST /departments에 progress_meta JSON 검증 추가 | ~273-309 |
| `public/static/js/admin-departments.js` | UI: 사업분야 편집에 meta 편집 섹션 (체크박스 + CSV) | ~111-200 |
| `public/static/js/admin-progress.js` | UI: 4+1 카드 + 매트릭스 + table-fixed + 1.5× 강조 | 전체 재작성 (29KB) |
| `src/index.tsx` | 캐시 무효화: admin JS에 `?v=40.1` 쿼리스트링 | line 648-649 |

### 3.2 자주 보게 될 코드 위치

**A) 카테고리 카드 렌더링 로직**
- 파일: `public/static/js/admin-progress.js`
- 라인: 91 (`grid-cols-2 sm:grid-cols-3 md:grid-cols-6`)
- 4+1 = 전체 + main 4개 + 기타 = 6 카드

**B) 제품명·업체 한 줄 표시**
- 파일: `public/static/js/admin-progress.js`
- 라인: 238-245
- 핵심 CSS: `text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis`

**C) 컬럼 폭 30% 강제**
- 파일: `public/static/js/admin-progress.js`
- 라인: 213-225 (colgroup 정의)
- `<col style="width:30%">` ← 제품명·업체

**D) 관리자 메타 편집 폼**
- 파일: `public/static/js/admin-departments.js`
- 라인: 약 111-200
- v40.0 평가현황 메타 섹션

**E) 캐시 무효화 쿼리스트링**
- 파일: `src/index.tsx`
- 라인: 648-649
- **다음 JS 변경 시 v=40.2로 증가시켜야 함!**

---

## ⚠️ 4. 사무실에서 작업 시 반드시 지켜야 할 체크리스트

### 4.1 JS/CSS 변경 시 ⭐ 캐시 함정 주의

```diff
# src/index.tsx (line 648-649)
- <script src="/static/js/admin-progress.js?v=40.1"></script>
+ <script src="/static/js/admin-progress.js?v=40.2"></script>
```

**잊으면** → 사용자 브라우저가 캐시된 구버전 JS 실행 → "왜 안 바뀌었지?" 문제 재발

### 4.2 DB 변경 시

```bash
# 1) 새 마이그레이션 파일 생성
# 파일명 규칙: 0056_vXX_설명.sql (4자리 번호, 순차 증가)
nano migrations/0056_v40X_xxx.sql

# 2) 로컬 적용
npx wrangler d1 migrations apply koist-website-db --local

# 3) 로컬 테스트 (PM2 재시작)
fuser -k 3000/tcp 2>/dev/null
pm2 restart koist-website

# 4) 운영 적용 (확인 후!)
npx wrangler d1 migrations apply koist-website-db --remote

# 5) 운영 검증
npx wrangler d1 execute koist-website-db --remote --command "..."
```

### 4.3 배포 전 체크리스트

- [ ] `npm run build` 성공
- [ ] 로컬 PM2에서 `curl http://localhost:3000` 응답 정상
- [ ] DB 마이그레이션 적용 (운영도)
- [ ] **`?v=40.X` 쿼리스트링 증가** (JS/CSS 수정 시)
- [ ] `git status --short` 깨끗하게 정리
- [ ] 의미 있는 커밋 메시지

### 4.4 배포 명령 (외워두기)

```bash
# 운영 배포 (한 줄)
npx wrangler pages deploy dist --project-name koist-website \
  --branch main --commit-dirty=true --commit-message="vXX.X deploy"

# 3개 도메인 검증 (한 줄)
for d in "www.koist.ai.kr" "koist.ai.kr" "koist-website.pages.dev"; do
  printf "%-32s" "$d"
  curl -s "https://$d/static/js/admin-progress.js?cb=$(date +%s)" \
    -o /tmp/p.js -w "HTTP:%{http_code} size:%{size_download}\n"
done
```

---

## 🚨 5. 자주 발생하는 함정과 해결책

### 5.1 "코드는 맞는데 화면이 안 바뀐다"

**원인**: Cloudflare CDN 캐시 (max-age=14400, 4시간)
**해결**:
1. `src/index.tsx`에서 `?v=40.X` 증가시켰는지 확인
2. 안 했다면 즉시 증가 + 빌드 + 배포
3. 사용자에게 Ctrl+Shift+R 안내 (예외적인 경우)

### 5.2 "마이그레이션 적용 안 됨"

**원인**: wrangler가 마이그레이션 추적 테이블에 이미 기록됨
**해결**:
```bash
# 로컬 초기화 (주의: 로컬 데이터 사라짐)
rm -rf .wrangler/state/v3/d1
npx wrangler d1 migrations apply koist-website-db --local
```

운영은 절대 초기화하지 말 것! 새 마이그레이션 파일로 작성.

### 5.3 "PM2 포트 충돌"

```bash
fuser -k 3000/tcp 2>/dev/null  # 강제 해제
pm2 delete all
pm2 start ecosystem.config.cjs
```

### 5.4 "Cloudflare 배포 시 commit message 오류"

**오류**: `Invalid commit message, it must be a valid UTF-8 string`
**원인**: git working tree dirty + 자동 메시지가 한글 포함 시 인코딩 이슈
**해결**: `--commit-dirty=true --commit-message="ASCII text"` 강제

---

## 📚 6. 참고 문서 (사무실에서 읽으면 좋은 순서)

| 순서 | 문서 | 목적 | 소요 시간 |
|------|------|------|----------|
| 1 | `docs/HANDOFF_OFFICE_20260601.md` | **이 문서** — 환경 복구 + 빠른 참조 | 5분 |
| 2 | `docs/V40_1_FINAL_VERIFICATION_REPORT_20260601.md` | 현재 안정 상태 검증 결과 | 5분 |
| 3 | `docs/V40_1_PROGRESS_UI_ANALYSIS_REPORT_20260601.md` | v40.0→v40.1 변경 배경·해결 방법 | 10분 |
| 4 | `README.md` (v40.0 섹션) | 시스템 구조 + URL 목록 | 5분 |
| 5 | `migrations/0055_v40_unify_categories.sql` | DB 변경 내역 | 3분 |

➡️ **총 30분이면 완전 복귀 가능**

---

## 🎯 7. 사무실에서 진행할 수 있는 후속 작업 (선택)

v40.1까지 안정화는 끝났습니다. 추가로 가능한 작업들:

### 7.1 우선순위 ★★★ (높음)

- [ ] **실제 운영 화면 시각적 확인**: /admin/progress 진입해서 4+1 카드 + 한 줄 표시 + 글자 크기 모두 의도대로인지 확인
- [ ] **카테고리 메타 편집 테스트**: /admin/departments에서 CC평가 클릭 → 평가현황 메타 편집 → 저장 → /admin/progress에서 변경 반영 확인

### 7.2 우선순위 ★★ (중간)

- [ ] **admin-about.js 카테고리 이름 갱신** (선택)
  - 위치: `public/static/js/admin-about.js` line 111-112
  - 현재: 회사소개 페이지 텍스트에 `보안기능 시험`, `암호모듈 검증시험` (옛 이름)
  - 변경: `보안기능시험`, `암호모듈검증` (새 이름)
  - 영향: 단순 텍스트 — 운영 동작 무관, 일관성용

- [ ] **input UX 개선 (CSV → tag-input)**:
  - 위치: `public/static/js/admin-departments.js`
  - 현재: `EAL1,EAL2,EAL3` 같은 CSV 입력
  - 개선: "옵션 추가" 버튼으로 동적 input 행 생성
  - 영향: 메타 편집 사용성 향상

### 7.3 우선순위 ★ (낮음, 장기)

- [ ] **자동 캐시 버스팅**: 파일명 해시(`admin-progress.[hash].js`) 도입 (Vite 플러그인)
- [ ] **정합성 cron 검증**: 매주 월요일 09:00 KST에 orphan 카테고리 자동 점검 + 알림

---

## 🔐 8. 환경 변수 / 시크릿 (메모)

### 8.1 로컬 개발 (.dev.vars)

현재 로컬에서는 별도 .dev.vars 불필요 (D1만 사용).

### 8.2 운영 시크릿 (Cloudflare)

- `CRON_TOKEN`: 외부 백업 cron 인증 (v39.31)
- `ADMIN_PASSWORD`: 관리자 비밀번호 (기존 운영)
- 추가 시크릿 등록 시: `npx wrangler pages secret put VAR_NAME --project-name koist-website`

---

## 📞 9. 비상시 빠른 복구 (Rollback)

만약 사무실에서 작업하다가 사이트가 망가지면:

### 9.1 즉시 이전 버전으로 복귀

```bash
# 옵션 A: Cloudflare Pages 대시보드에서 이전 배포 클릭하여 "Rollback"
# (가장 빠름, 1분 이내)

# 옵션 B: 이전 태그로 강제 배포
git checkout v40.1
npm run build
npx wrangler pages deploy dist --project-name koist-website \
  --branch main --commit-dirty=true --commit-message="rollback to v40.1"
```

### 9.2 응급 백업/복원 활용 (v39.32 기능)

- URL: https://www.koist.ai.kr/admin/backups
- 모든 admin 페이지 우측 상단 🛡️ 빨간 버튼 (응급 백업)
- 1시간 이내 백업은 ⚡ 응급 복원 버튼 (1단계 확인)

---

## 🌐 10. 운영 도메인 즐겨찾기

### 10.1 사용자 화면
- 메인: https://www.koist.ai.kr/
- 평가현황: https://www.koist.ai.kr/support/progress
- 개인정보처리방침: https://www.koist.ai.kr/privacy

### 10.2 관리자 화면
- 대시보드: https://www.koist.ai.kr/admin
- **평가현황 관리**: https://www.koist.ai.kr/admin/progress ← v40.1 결과 확인!
- **사업분야 관리**: https://www.koist.ai.kr/admin/departments ← 메타 편집!
- 상담문의: https://www.koist.ai.kr/admin/inquiries
- 백업 관리: https://www.koist.ai.kr/admin/backups

### 10.3 모니터링
- Cloudflare 대시보드: https://dash.cloudflare.com/ (Pages → koist-website)
- GitHub: https://github.com/wwwkoistkr/HOMEPAGE
- 최신 배포 미리보기: https://4c2ab4a0.koist-website.pages.dev (v40.1 직후)

---

## ✅ 11. 사무실 도착 후 첫 3분 안에 할 일

```bash
# 1. 코드 가져오기
cd ~/projects/webapp  # 또는 클론할 위치
git pull origin main
git log --oneline -5    # 9431c05 docs(v40.1)... 가 최신인지 확인

# 2. 빌드 + 실행
npm install            # node_modules 없으면
npm run build
fuser -k 3000/tcp 2>/dev/null
pm2 start ecosystem.config.cjs

# 3. 로컬 동작 확인
curl http://localhost:3000  # HTML 응답 OK?

# 4. 운영 동작 확인
curl -s https://www.koist.ai.kr/static/js/admin-progress.js | head -1
# 출력: // Admin - Progress Management v40.1 ...  ← 이 줄 보이면 OK
```

위 4단계가 모두 OK면 → **즉시 새 작업 시작 가능** 🚀

---

## 📋 12. 최종 상태 카드 (출력해서 모니터에 붙여두기 권장)

```
┌────────────────────────────────────────────────────┐
│  KOIST Website — v40.1 인수인계 카드              │
├────────────────────────────────────────────────────┤
│  최신 커밋:  9431c05 docs(v40.1) FINAL_VERIFICATION │
│  최신 태그:  v40.1                                 │
│  브랜치:     main                                  │
│  미커밋:     없음 (clean)                          │
│  운영 상태:  3/3 도메인 HTTP 200                   │
│  DB 상태:    정합성 100%, orphan 0건               │
│                                                    │
│  ⭐ 다음 변경 시 잊지 말 것:                       │
│  src/index.tsx의 ?v=40.1 → ?v=40.2로 증가!         │
│                                                    │
│  배포 한 줄:                                       │
│  npx wrangler pages deploy dist                    │
│    --project-name koist-website                    │
│    --branch main                                   │
│    --commit-dirty=true                             │
│    --commit-message="vXX.X deploy"                 │
└────────────────────────────────────────────────────┘
```

---

**작성 완료 시각**: 2026-06-01
**상태**: ✅ 완전 안정화, 사무실 인수 준비 완료
**다음 작업자**: 사무실에서 작업할 본인
**문의 시**: 이 폴더의 `docs/` 디렉토리 안 3개 보고서 참조

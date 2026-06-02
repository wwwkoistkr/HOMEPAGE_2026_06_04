# homepage_40_1 — v40.1 코드 스냅샷

> 이 폴더는 **2026-06-01 시점의 v40.1 프로덕션 소스 박제본**입니다.
> KOIST 홈페이지(www.koist.ai.kr) v40.1 출시 직후 동결된 사본.

---

## 📌 무엇인가요?

`HOMEPAGE` 저장소의 **루트(`/`)는 항상 최신 개발본**이고,
이 `homepage_40_1/` 폴더는 **v40.1이 프로덕션 배포된 직후 시점의 코드 스냅샷**입니다.

| 항목 | 값 |
|---|---|
| 동결 일자 | 2026-06-01 |
| Git 태그 | `v40.1` |
| 프로덕션 배포 시점 commit | 약 `82f3d8e` 이전 시점 |
| 파일 수 | 208개 |
| 용량 | 약 16 MB (소스만) |
| 빌드 산출물 | **제외** (node_modules, dist, .wrangler) |

---

## 🎯 v40.1의 핵심 변경

1. **`table-fixed` + `<colgroup>`** — 컬럼 폭을 명시적으로 고정
2. **제품명/업체 컬럼 30%** — 너무 넓던 컬럼 축소
3. **`text-lg font-bold`** — 제품명·업체 글자 1.5배 강조
4. **`whitespace-nowrap overflow-hidden text-ellipsis`** — 한 줄로 강제
5. **사업분야별 카테고리 그룹화** — 4+1 카드 + 동적 부서 로딩
6. **`?v=40.1` 캐시 버스터** — Cloudflare CDN 14400초 캐시 무효화

핵심 파일:
- `public/static/js/admin-progress.js` (table-fixed 레이아웃)
- `src/index.tsx` 648-649줄 (캐시 버스터)
- `migrations/0055_v40_unify_categories.sql` (카테고리 통합)

---

## 🚀 사무실에서 이 폴더로 작업하려면

### 옵션 1: 이 폴더만 작업 디렉토리로 사용

```bash
cd HOMEPAGE/homepage_40_1
npm install
npm run build
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000
```

> ⚠️ Cloudflare Pages 배포는 저장소 루트 기준이므로, 이 폴더에서 작업한 결과를 배포하려면
> 변경분을 **루트로 다시 복사 후 배포**해야 합니다.

### 옵션 2: 단순 참조용 (추천)

이 폴더는 **"v40.1 시점 기록 보존"**이 주 목적입니다.
일반 작업은 **저장소 루트**에서 진행하고, 비교가 필요할 때만 이 폴더를 참조하세요:

```bash
# 예: v40.1 시점과 현재 차이 확인
diff -r homepage_40_1/src ./src
diff homepage_40_1/public/static/js/admin-progress.js ./public/static/js/admin-progress.js
```

---

## 📂 폴더 구조

```
homepage_40_1/
├── SNAPSHOT_INFO.md           ← 이 파일
├── README.md                   ← 원본 프로젝트 README (v40.1 시점)
├── .gitignore
├── package.json / package-lock.json
├── tsconfig.json / vite.config.ts / wrangler.jsonc
├── ecosystem.config.cjs
│
├── src/                        ← Hono SSR 소스
│   ├── index.tsx              ← 메인 엔트리 (v=40.1 캐시버스터 포함)
│   ├── routes/                ← API 라우트
│   └── ...
│
├── public/                     ← 정적 자산
│   └── static/
│       ├── js/admin-progress.js  ← ★ v40.1 핵심 변경 파일
│       └── ...
│
├── migrations/                 ← D1 마이그레이션 (0055까지 포함)
├── docs/                       ← v40.1 분석/검증 문서 4종
│   ├── V40_1_PROGRESS_UI_ANALYSIS_REPORT_20260601.md
│   ├── V40_1_FINAL_VERIFICATION_REPORT_20260601.md
│   ├── HANDOFF_OFFICE_20260601.md
│   └── PRODUCTION_SNAPSHOT_DOWNLOAD_20260601.md
└── scripts/                    ← 유틸 스크립트
```

> ⚠️ **제외된 항목** (재현 필요 시 `npm install` / `npm run build`):
> `node_modules/`, `dist/`, `.wrangler/`, `production-snapshot/`, `.dev.vars`

---

## 🔐 보안 메모

- `.dev.vars` (로컬 시크릿)는 의도적으로 제외됨 — 새 환경에서 직접 생성 필요
- Cloudflare Pages Secrets (`CRON_SECRET`, `JWT_SECRET`)는 코드에 없음 — `wrangler pages secret put`으로 별도 주입
- 프로덕션 DB 덤프는 별도 `production-snapshot-v40.1-20260601.tar.gz` 패키지 참조

---

## 🔗 관련 자료

- 프로덕션 DB/R2 스냅샷: https://www.genspark.ai/api/files/s/nsUBCIhx
- v40.1 검증 보고서: `docs/V40_1_FINAL_VERIFICATION_REPORT_20260601.md`
- 사무실 인수인계: `docs/HANDOFF_OFFICE_20260601.md`
- Git 태그: `git checkout v40.1` (저장소 루트에서)

---

**생성일**: 2026-06-01
**저장소**: https://github.com/wwwkoistkr/HOMEPAGE

# homepage_40_2 — v40.2 코드 스냅샷

> 이 폴더는 **2026-06-02 시점의 v40.2 프로덕션 소스 박제본**입니다.
> 평가현황/시험현황 컬럼 폭 확대 + 별칭 매핑 적용 직후 동결된 사본.

---

## 📌 무엇인가요?

`HOMEPAGE` 저장소의 **루트(`/`)는 항상 최신 개발본**이고,
이 `homepage_40_2/` 폴더는 **v40.2가 프로덕션 배포된 직후 시점의 코드 스냅샷**입니다.

| 항목 | 값 |
|---|---|
| 동결 일자 | 2026-06-02 |
| Git 태그 | `v40.2` |
| 파일 수 | 211개 |
| 용량 | 약 16 MB (소스만) |
| 빌드 산출물 | **제외** (node_modules, dist, .wrangler) |

---

## 🎯 v40.2의 핵심 변경 (v40.1 → v40.2)

### 1. 컬럼 폭 확대
- **등급 컬럼**: 90px → **220px** (Option B, 사용자 결정)
- **구분 컬럼**: 88px → **140px**
- **min-width**: 680px → **820px** (제품명 보호)

### 2. 별칭 매핑 4건 (`src/utils/aliases.ts` 신규)
- "안티바이러스 제품 (Mobile)" → "안티바이 제품 (Mobile)"
- "안티바이러스제품(Linux)" → "안티바이 제품 (Linux)"
- "소스코드 보안약점 분석도구" → "소스코드 보안약점도구"
- "모듈형 안티바이러스 제품" → "모듈형 안티바이 제품"

> DB 원본 보존, `title` 속성으로 마우스 호버 시 원본명 표시

### 3. 캐시 버스터
- `src/index.tsx`: `?v=40.1` → `?v=40.2`

### 4. 영향 페이지 (총 10개 부서 + 전체)
- `/services/cc/progress` (CC평가 평가현황) — EAL 코드 위주
- `/services/security-test/progress` (보안기능시험 시험현황) ⭐ — 정보보호시스템/네트워크장비 등
- `/services/kcmvp/progress` (암호모듈검증 평가현황)
- `/services/performance/progress` (성능평가 평가현황)
- `/support/progress` (전체 평가현황)
- 외 6개 부서

핵심 파일:
- `src/templates/pages.tsx` (progressPage + serviceProgressContent 양쪽)
- `src/utils/aliases.ts` (신규)
- `src/index.tsx` (캐시 버스터)

---

## 🚀 사무실에서 이 폴더로 작업하려면

```bash
cd HOMEPAGE/homepage_40_2
npm install
npm run build
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000
```

> ⚠️ Cloudflare Pages 배포는 저장소 루트 기준이므로, 이 폴더에서 작업한 결과를 배포하려면
> 변경분을 **루트로 다시 복사 후 배포**해야 합니다.

또는 v40.1과 비교만 하려면:
```bash
diff -r homepage_40_1/src homepage_40_2/src   # v40.1 → v40.2 변경 확인
```

---

## 📂 폴더 구조

```
homepage_40_2/
├── SNAPSHOT_INFO.md                ← 이 파일
├── README.md                        ← v40.2 시점 원본
├── .gitignore
├── package.json / package-lock.json
├── tsconfig.json / vite.config.ts / wrangler.jsonc / ecosystem.config.cjs
│
├── src/                             ← Hono SSR 소스
│   ├── index.tsx                    ← 캐시 버스터 v=40.2
│   ├── templates/pages.tsx          ← ★ v40.2 핵심 변경 (컬럼 폭)
│   ├── utils/aliases.ts             ← ★ v40.2 신규 (별칭 매핑)
│   └── ...
│
├── public/                          ← 정적 자산
│   └── static/js/admin-progress.js  ← v40.1과 동일 (관리자는 변경 없음)
│
├── migrations/                      ← D1 마이그레이션 (0055까지)
├── docs/                            ← v40.1 + v40.2 분석/검증 문서
│   ├── V40_2_COLUMN_WIDTH_FINAL_ANALYSIS_20260602.md  ⭐ v40.2
│   ├── V40_2_GRADE_COLUMN_WIDTH_ANALYSIS_20260602.md  ⭐ v40.2
│   ├── V40_1_*.md                                      (v40.1 기록)
│   ├── HANDOFF_OFFICE_20260601.md
│   └── PRODUCTION_SNAPSHOT_DOWNLOAD_20260601.md
└── scripts/                         ← 유틸 스크립트
```

> ⚠️ **제외된 항목** (재현 필요 시 `npm install` / `npm run build`):
> `node_modules/`, `dist/`, `.wrangler/`, `production-snapshot/`, `.dev.vars`

---

## 🔗 관련 자료

- 프로덕션 DB/R2 스냅샷 (v40.2): 별도 tar.gz 패키지 (이번 작업으로 생성)
- v40.2 분석 보고서: `docs/V40_2_COLUMN_WIDTH_FINAL_ANALYSIS_20260602.md`
- v40.1 코드 스냅샷: `../homepage_40_1/` (이전 시점)
- Git 태그: `git checkout v40.2` (저장소 루트에서)

---

**생성일**: 2026-06-02
**저장소**: https://github.com/wwwkoistkr/HOMEPAGE

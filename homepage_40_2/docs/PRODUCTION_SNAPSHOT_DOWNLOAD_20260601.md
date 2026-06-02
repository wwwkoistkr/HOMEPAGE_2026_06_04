# 프로덕션 스냅샷 다운로드 가이드 (v40.1 / 2026-06-01)

> 사용자 요청: **"프로덕션도 가져와 줘"**
> 사무실에서 즉시 받아갈 수 있도록 패키징 + 영구 URL 발급 완료

---

## 📦 다운로드 정보

| 항목 | 값 |
|---|---|
| 파일명 | `production-snapshot-v40.1-20260601.tar.gz` |
| 크기 | **400.18 KB** (압축 후) / 1.1 MB (압축 전) |
| 포맷 | tar.gz (gzip 압축) |
| MD5 | `69c603da85019f380cdaa8a80390e75b` |
| SHA-256 | `04da12104461dd81b3aeb6e01077306724059785831c124f2de2fe1581045983` |
| 생성일 | 2026-06-01 02:26 UTC |
| 영구 다운로드 URL | **https://www.genspark.ai/api/files/s/nsUBCIhx** |

> 🔒 **보안 주의**: 이 패키지에는 D1 DB 전체 덤프(admin_users 테이블 포함)와 R2 백업본이 들어 있습니다.
> Git에 커밋하지 말고, 사무실 PC에서도 외부에 공유하지 마세요.

---

## 🚀 사무실에서 사용하기 (3단계)

### Step 1. 다운로드

브라우저로 위 URL 접속 또는 터미널에서:

```bash
curl -L -o production-snapshot-v40.1-20260601.tar.gz \
  https://www.genspark.ai/api/files/s/nsUBCIhx
```

### Step 2. 체크섬 검증 (선택, 권장)

```bash
# Mac/Linux
sha256sum production-snapshot-v40.1-20260601.tar.gz
# 출력값이 위의 SHA-256과 같아야 함

# Windows (PowerShell)
Get-FileHash production-snapshot-v40.1-20260601.tar.gz -Algorithm SHA256
```

### Step 3. 압축 해제

```bash
tar -xzf production-snapshot-v40.1-20260601.tar.gz
ls production-snapshot/
```

---

## 📂 패키지 내용 (총 19개 파일)

```
production-snapshot/
├── README.md                           ← 복구 시나리오 A~D + 재해복구 절차
│
├── db/                                 ← Cloudflare D1 프로덕션 덤프
│   ├── koist-website-db-full-20260601.sql        (367 KB, 16개 테이블 + 615 INSERT)
│   ├── koist-website-db-schema-only-20260601.sql (8.5 KB, 스키마만)
│   ├── koist-website-db-data-only-20260601.sql   (358 KB, 데이터만)
│   └── table-stats-20260601.txt                  (15개 테이블, 537 rows)
│
├── r2/                                 ← R2 백업 오브젝트 (가장 최근 3개)
│   ├── 2026-06-01_180022_c484b06b.json.gz  (Daily, 99 KB)
│   ├── 2026-06-01_153407_13816af2.json.gz  (Manual, 97 KB)
│   ├── 2026-06-01_144641_4cd87849.json.gz  (Weekly, 97 KB)
│   └── backup-history-metadata-20260601.json (11개 백업 이력)
│
└── deployment/                         ← Cloudflare 배포 정보
    ├── cloudflare-account.txt          (Account ID: 40b506ea...)
    ├── pages-deployments.txt           (Pages 배포 이력)
    ├── pages-secrets.txt               (CRON_SECRET, JWT_SECRET 이름만)
    ├── kv-namespaces.txt               (RATE_LIMIT_KV, SOURCES_KV ID)
    ├── production-js-version.txt       (v40.1 확인)
    └── production-cache-headers.txt    (캐시 헤더 스냅샷)
```

---

## 🔄 자주 쓰는 복구 시나리오

### A. 로컬 D1에 프로덕션 데이터 복사

```bash
cd webapp
# 로컬 D1 초기화
rm -rf .wrangler/state/v3/d1
# 스키마 + 데이터 일괄 복원
npx wrangler d1 execute koist-website-db --local \
  --file=./production-snapshot/db/koist-website-db-full-20260601.sql
```

### B. 프로덕션 D1 재해복구 (⚠️ 위험)

```bash
# 신규 DB로 복원할 때만 사용 (기존 데이터 덮어쓰기 X)
npx wrangler d1 execute koist-website-db --remote \
  --file=./production-snapshot/db/koist-website-db-schema-only-20260601.sql
npx wrangler d1 execute koist-website-db --remote \
  --file=./production-snapshot/db/koist-website-db-data-only-20260601.sql
```

### C. R2 백업 데이터 검사

```bash
cd production-snapshot/r2
gunzip -c 2026-06-01_180022_c484b06b.json.gz | jq . | less
```

### D. Cloudflare 설정 재현

`deployment/` 폴더의 텍스트 파일들을 보고 wrangler.jsonc / Secrets / KV를 동일하게 재구성.

자세한 절차는 패키지 안의 `production-snapshot/README.md` 참고.

---

## 🎯 핵심 메타데이터 요약

| 항목 | 값 |
|---|---|
| Cloudflare Account ID | `40b506ea69bd735f6e9f61255b527333` |
| Pages 프로젝트명 | `koist-website` |
| D1 DB 이름 | `koist-website-db` |
| D1 DB ID | `91f1eb2f-e9fa-45e8-8bea-4958ce74727a` |
| R2 버킷 | `koist-images` |
| KV Namespaces | `RATE_LIMIT_KV`, `SOURCES_KV` |
| Pages Secrets | `CRON_SECRET`, `JWT_SECRET` (값은 미포함, 이름만) |
| 프로덕션 도메인 | www.koist.ai.kr / koist.ai.kr / koist-website.pages.dev |
| 프로덕션 버전 | v40.1 (table-fixed + colgroup + 1.5× 강조 + 30% 컬럼 축소) |
| DB 총 행 수 | 537 rows (progress_items=222) |

---

## ⚠️ 주의사항

1. **Secrets 값은 포함되지 않음**: `pages-secrets.txt`에는 이름만 들어 있음 (Cloudflare API가 암호화 값 노출 X). 새 환경에 배포할 땐 `npx wrangler pages secret put CRON_SECRET` 등으로 수동 재설정 필요.
2. **R2 풀 백업이 아님**: 가장 최근 3개 오브젝트만 포함. 전체 R2 버킷이 필요하면 별도 `wrangler r2 object get`을 추가로 수행.
3. **`backup_history` 테이블 확인**: 11개 백업 이력 중 일부는 R2에서 이미 삭제됐을 수 있음 (GFS 정책).
4. **Git 커밋 금지**: `/home/user/webapp/production-snapshot/`은 `.gitignore`에 추가 권장 (이미 sensitive 데이터 포함).

---

**마지막 갱신**: 2026-06-01
**작성**: KOIST 프로덕션 인수인계 자동화

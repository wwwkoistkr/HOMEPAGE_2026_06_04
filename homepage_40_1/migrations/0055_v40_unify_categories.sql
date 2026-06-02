-- v40.0: 평가현황 카테고리 통합 + 컬럼옵션 메타데이터
-- 목적: 
--   1) departments.name을 progress_items.category와 일치시킴 (공백 제거)
--   2) departments에 progress_meta 컬럼 추가 (컬럼옵션 JSON 저장)
--   3) departments에 is_main_progress 컬럼 추가 (4개 주요 카테고리 표시)
--   4) 4개 주요 카테고리에 컬럼옵션 메타데이터 채우기

-- ──────────────────────────────────────────────────
-- Step 1: 새 컬럼 추가
-- ──────────────────────────────────────────────────
ALTER TABLE departments ADD COLUMN progress_meta TEXT DEFAULT '{}';
ALTER TABLE departments ADD COLUMN is_main_progress INTEGER DEFAULT 0;

-- ──────────────────────────────────────────────────
-- Step 2: 카테고리명 통일 (progress_items와 일치)
-- ──────────────────────────────────────────────────
-- "보안기능 시험" → "보안기능시험" (공백 제거)
UPDATE departments SET name = '보안기능시험' WHERE name = '보안기능 시험';

-- "암호모듈 검증시험" → "암호모듈검증" (공백 제거 + "시험" 제거)
UPDATE departments SET name = '암호모듈검증' WHERE name = '암호모듈 검증시험';

-- ──────────────────────────────────────────────────
-- Step 3: 4개 주요 카테고리 표시 (is_main_progress = 1)
-- ──────────────────────────────────────────────────
UPDATE departments SET is_main_progress = 1 
WHERE name IN ('CC평가', '보안기능시험', '성능평가', '암호모듈검증');

-- ──────────────────────────────────────────────────
-- Step 4: 4개 주요 카테고리에 컬럼옵션 메타데이터 채우기
-- ──────────────────────────────────────────────────

-- CC평가
UPDATE departments 
SET progress_meta = '{"col2":"보증등급","col3":"인증구분","col4":"신청구분","col2Opts":["EAL1","EAL1+","EAL2","EAL3","EAL4","EAL5","EAL6","EAL7"],"col3Opts":["최초평가","재평가"],"col4Opts":["국내평가","국제평가"],"statusOpts":["평가접수","평가진행","평가완료"]}'
WHERE name = 'CC평가';

-- 보안기능시험
UPDATE departments 
SET progress_meta = '{"col2":"제품유형","col3":"발급유형","col4":"신청구분","col2Opts":["정보보호시스템","네트워크장비"],"col3Opts":["기본시험","간소화 발급"],"col4Opts":["최초신청","변경·재승인","갱신신청"],"statusOpts":["시험접수","시험진행","발급완료"]}'
WHERE name = '보안기능시험';

-- 암호모듈검증
UPDATE departments 
SET progress_meta = '{"col2":"보안수준","col3":"모듈형태","col4":"-","col2Opts":["1","2","3"],"col3Opts":["소프트웨어","하드웨어","펌웨어"],"col4Opts":["-"],"statusOpts":["시험접수","시험진행","발급완료"]}'
WHERE name = '암호모듈검증';

-- 성능평가
UPDATE departments 
SET progress_meta = '{"col2":"제품유형","col3":"운영체제","col4":"개발사","col2Opts":["안티바이러스 제품","안티바이러스제품(Linux)","안티바이러스 제품 (Mobile)","모듈형 안티바이러스 제품","SSL VPN","소스코드 보안약점 분석도구","방화벽","IPS","WAF","DLP"],"col3Opts":["-","Windows","Linux","Android","iOS","U3000S"],"col4Opts":[],"col4FreeText":true,"statusOpts":["평가접수","평가진행","발급완료"]}'
WHERE name = '성능평가';

-- ──────────────────────────────────────────────────
-- 검증용 쿼리 (참고)
-- SELECT id, name, slug, icon, color, is_main_progress, 
--        substr(progress_meta, 1, 60) as meta_preview 
-- FROM departments ORDER BY sort_order;
-- ──────────────────────────────────────────────────

-- 보완 마이그레이션: popups 테이블 누락 컬럼 추가
-- 배경: v35.x 시절 popups 카드 크기/배경색 컬럼을 추가하던 마이그레이션이
--       migrations/archive/ 로 이동되면서, 메인 마이그레이션 흐름에서 누락됨.
--       이로 인해 0036(bg_color UPDATE) 등 이후 마이그레이션이 로컬에서 실패함.
-- 본 파일은 이후 마이그레이션이 참조하는 컬럼을 idempotent 하게 보장한다.
-- (프로덕션 DB에는 이미 존재하므로, 존재 시 무시되도록 안전하게 처리)

-- SQLite는 "ADD COLUMN IF NOT EXISTS"를 지원하지 않으므로,
-- 컬럼이 이미 있으면 에러가 나지만 --local 신규 DB에서는 정상 추가된다.
-- 프로덕션에는 이 마이그레이션을 적용하지 않거나(이미 적용됨) 수동 관리한다.

ALTER TABLE popups ADD COLUMN card_width_cm REAL DEFAULT NULL;
ALTER TABLE popups ADD COLUMN card_height_cm REAL DEFAULT NULL;
ALTER TABLE popups ADD COLUMN bg_color TEXT DEFAULT NULL;

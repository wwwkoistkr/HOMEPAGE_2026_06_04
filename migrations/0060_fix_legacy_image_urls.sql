-- v41.0: 깨진 legacy 이미지 URL 복구
-- 문제: /api/images/legacy/sh_page/img/* 프록시가 www.koist.kr → koist.ai.kr 301 → 404
-- 해결: 동일 파일이 /static/images/legacy/{filename} (flat)에 존재하므로 경로 치환
-- dep_pages.content 의 모든 legacy 이미지 경로를 정적 경로로 일괄 변경
UPDATE dep_pages
SET content = REPLACE(content, '/api/images/legacy/sh_page/img/', '/static/images/legacy/')
WHERE content LIKE '%/api/images/legacy/sh_page/img/%';

-- 안전망: about_pages / popups 에도 동일 패턴이 있을 경우 함께 복구
UPDATE about_pages
SET content = REPLACE(content, '/api/images/legacy/sh_page/img/', '/static/images/legacy/')
WHERE content LIKE '%/api/images/legacy/sh_page/img/%';

UPDATE popups
SET content = REPLACE(content, '/api/images/legacy/sh_page/img/', '/static/images/legacy/')
WHERE content LIKE '%/api/images/legacy/sh_page/img/%';

UPDATE popups
SET image_url = REPLACE(image_url, '/api/images/legacy/sh_page/img/', '/static/images/legacy/')
WHERE image_url LIKE '%/api/images/legacy/sh_page/img/%';

-- ── legacy-icons 패턴 복구 ──
-- 1) kolas.png 는 /static/images/kolas.png 에 별도 존재 → 먼저 개별 치환
UPDATE dep_pages
SET content = REPLACE(content, '/api/images/legacy-icons/kolas.png', '/static/images/kolas.png')
WHERE content LIKE '%/api/images/legacy-icons/kolas.png%';

-- 2) 나머지 legacy-icons/* → /static/images/legacy/* (flat 폴더에 존재)
UPDATE dep_pages
SET content = REPLACE(content, '/api/images/legacy-icons/', '/static/images/legacy/')
WHERE content LIKE '%/api/images/legacy-icons/%';

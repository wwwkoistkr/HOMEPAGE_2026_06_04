-- v41.0: 테스트부서 완전 삭제 (모든 홈페이지에서 제거)
-- 테스트부서(id=11, slug=test-dept)는 실제 부서가 아닌 테스트용이므로
-- departments 및 연결된 dep_pages를 모두 삭제한다.

-- 1) 테스트부서에 연결된 하위 페이지 삭제 (FK 안전)
DELETE FROM dep_pages WHERE dept_id IN (SELECT id FROM departments WHERE slug = 'test-dept');

-- 2) 테스트부서 자체 삭제
DELETE FROM departments WHERE slug = 'test-dept';

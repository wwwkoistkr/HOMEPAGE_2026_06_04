-- 0058: "S/W 시험현황"(기타시험평가) 신설 + 자료실 연계
-- 사용자 확정 사양:
--   - 시험성적서(certificate, dept_id=5) 하위에 'S/W 시험현황' 메뉴 신설 (slug=etc-test)
--   - 현황 데이터 category = '기타시험평가' (4+1 중 +1 "기타" 그룹에 자동 소속)
--   - 표 컬럼 라벨 = 성능평가와 동일 (제품유형/운영체제/개발사) → 코드측 CATEGORY_META에서 처리
--   - 자료실 연계 카테고리명 = '기타시험현황' (옵션 A: 페이지 단위 관련자료)
--   - 데이터 0건이어도 "기타 0건" 카드/표 항상 표시

-- (1) 시험성적서 하위에 'S/W 시험현황' 페이지 추가 (etc-test)
--     중복 방지: 같은 dept_id + slug 가 이미 있으면 추가하지 않음
INSERT INTO dep_pages (dept_id, title, slug, content, meta_description, sort_order, is_active)
SELECT 5, 'S/W 시험현황', 'etc-test',
       '<p>기타 소프트웨어 시험·평가 현황입니다.</p>',
       '기타 소프트웨어 시험 및 평가 현황',
       50, 1
WHERE NOT EXISTS (
  SELECT 1 FROM dep_pages WHERE dept_id = 5 AND slug = 'etc-test'
);

-- (2) 자료실 연계용 카테고리 안내 (실제 자료는 관리자 자료실 화면에서 category='기타시험현황'로 등록)
--     별도 스키마 변경 불필요 (downloads.category 기존 컬럼 활용 = 옵션 A)

-- (3) 기타시험평가 현황 샘플 데이터 1건 (관리자에서 수정/삭제 가능, 0건 정책과 무관한 데모용)
--     ※ 샘플이 불필요하면 이 INSERT 는 무시 가능. 중복 방지 처리.
INSERT INTO progress_items (category, product_name, company, status, assurance_level, cert_type, eval_type, sort_order)
SELECT '기타시험평가', '샘플 S/W 시험 제품 v1.0', '(주)예시소프트', '시험접수', '소프트웨어 검증', '-', '(주)예시소프트', 9000
WHERE NOT EXISTS (
  SELECT 1 FROM progress_items WHERE category = '기타시험평가' AND product_name = '샘플 S/W 시험 제품 v1.0'
);

-- 보완 마이그레이션: 0058 이전에 departments 기본 레코드 보장
-- 배경: 0058_etc_test_status.sql 이 dep_pages(dept_id=5)를 참조하는데,
--       로컬 신규 DB에서는 departments 데이터가 seed로만 채워져
--       마이그레이션 단독 적용 시 FOREIGN KEY 제약 위반이 발생함.
-- 본 파일은 0058이 참조하는 departments 행을 idempotent 하게 보장한다.
-- (이미 존재하면 INSERT OR IGNORE 로 무시됨)

INSERT OR IGNORE INTO departments (id, name, slug, description, icon, color, sort_order, is_active) VALUES
(1, 'CC평가', 'cc', 'IT 보안제품의 보안성을 국제 표준인 CC(Common Criteria)에 따라 평가하는 서비스', 'fa-shield-halved', '#3B82F6', 1, 1),
(2, '보안기능 시험', 'security-test', '정보보호제품의 보안기능에 대한 시험 및 인증을 수행하는 서비스', 'fa-flask-vial', '#8B5CF6', 2, 1),
(3, '암호모듈 검증시험', 'kcmvp', '국가정보원 지정 암호모듈 검증시험(KCMVP) 민간시험 기관', 'fa-lock', '#EC4899', 3, 1),
(4, '성능평가', 'performance', '정보보호제품의 성능을 객관적으로 평가하는 서비스', 'fa-chart-line', '#F59E0B', 4, 1),
(5, '시험성적서', 'certificate', 'R&D 과제검증, AI 성능시험, NW 성능시험 등 시험성적서 발급', 'fa-file-lines', '#10B981', 5, 1),
(6, '정보보안진단', 'diagnosis', '정보보호준비도 평가, DDoS 모의훈련, 취약점 분석 등 종합 보안진단', 'fa-magnifying-glass-chart', '#EF4444', 6, 1),
(7, '컨설팅', 'consulting', 'CC컨설팅, 검증필 암호모듈 컨설팅, ISMS-P 보안 컨설팅', 'fa-handshake', '#6366F1', 7, 1),
(8, '산업(기업)보안 컨설팅', 'enterprise-security', '기업 맞춤형 종합 보안 컨설팅 서비스', 'fa-building-shield', '#0EA5E9', 8, 1),
(9, '정보보호준비도 평가', 'readiness', '정보보호 수준을 체계적으로 진단하고 개선 방향을 제시하는 평가 서비스', 'fa-clipboard-check', '#14B8A6', 9, 1),
(10, '모의평가', 'mock-test', '본 평가 전 사전 점검을 통해 성공적인 인증 획득을 지원하는 서비스', 'fa-vial-virus', '#F97316', 10, 1);

-- ============================================================
-- 0061: 운영사이트(koist.ai.kr) v42.3.2 데이터 복원
-- 팝업 3개 + 부서 담당자(부서/직책/전화) + 핵심 설정(KOIST 심볼/로고) 보존
-- 생성일: 2026-06-10
-- ============================================================

-- [0] popups 스타일 컬럼 보강 (운영 v42.3.2 호환)
-- (별도 선적용 필요) ALTER TABLE popups ADD COLUMN font_size INTEGER DEFAULT 17;
-- (별도 선적용 필요) ALTER TABLE popups ADD COLUMN title_font_size INTEGER DEFAULT 17;
-- (별도 선적용 필요) ALTER TABLE popups ADD COLUMN title_bg_color TEXT DEFAULT '';
-- (별도 선적용 필요) ALTER TABLE popups ADD COLUMN text_color TEXT DEFAULT '#374151';
-- (별도 선적용 필요) ALTER TABLE popups ADD COLUMN title_color TEXT DEFAULT '#1f2937';
-- (별도 선적용 필요) ALTER TABLE popups ADD COLUMN line_height REAL DEFAULT 1.7;
-- (별도 선적용 필요) ALTER TABLE popups ADD COLUMN padding INTEGER DEFAULT 20;

-- [1] 사업부별 담당부서/직책/전화번호 복원
UPDATE departments SET contact_dept='평가사업부', contact_name='부장', contact_phone='070-7733-9606' WHERE slug='cc';
UPDATE departments SET contact_dept='평가사업부', contact_name='팀장', contact_phone='070-4265-0886' WHERE slug='security-test';
UPDATE departments SET contact_dept='암호시험', contact_name='팀장', contact_phone='070-4923-7622' WHERE slug='kcmvp';
UPDATE departments SET contact_dept='연구팀', contact_name='선임연구원', contact_phone='070-4120-7452' WHERE slug='performance';
UPDATE departments SET contact_dept='연구팀', contact_name='선임연구원', contact_phone='070-4120-7452' WHERE slug='certificate';
UPDATE departments SET contact_dept='연구팀', contact_name='선임연구원', contact_phone='070-4236-9200' WHERE slug='diagnosis';
UPDATE departments SET contact_dept='연구팀', contact_name='선임연구원', contact_phone='070-4236-9200' WHERE slug='consulting';
UPDATE departments SET contact_dept='연구팀', contact_name='선임연구원', contact_phone='070-4236-9200' WHERE slug='enterprise-security';
UPDATE departments SET contact_dept='연구팀', contact_name='선임연구원', contact_phone='070-4120-7448' WHERE slug='readiness';
UPDATE departments SET contact_dept='연구팀', contact_name='선임연구원', contact_phone='070-4236-9200' WHERE slug='mock-test';

-- [2] 핵심 설정(KOIST 심볼/로고/헤더) 복원
INSERT INTO site_settings (key,value,category) VALUES ('logo_url','/static/images/logo-horizontal.png','theme') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('hero_badge_logo_url','/static/images/koist-circle-logo.png','content') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('phone','02-586-1230','contact') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('phone_display','02-586-1230','contact') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('email','koist@koist.kr','contact') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('page_header_color1','#1E3A8A','general') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('page_header_color2','#2563EB','general') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('page_header_color3','#3B82F6','general') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('page_header_height_scale','0.3','general') ON CONFLICT(key) DO UPDATE SET value=excluded.value;
INSERT INTO site_settings (key,value,category) VALUES ('hero_badge_text','국가 공인 정보보안 시험·평가 전문기관','content') ON CONFLICT(key) DO UPDATE SET value=excluded.value;

-- [3] 운영 팝업 3개 복원
DELETE FROM popups;
INSERT INTO popups (id, title, content, image_url, popup_type, width, height, position_top, position_left, is_active, sort_order, font_size, title_font_size, bg_color, title_bg_color, text_color, title_color, line_height, padding, card_width_cm, card_height_cm) VALUES (3, '국가 공인 민간 영상정보처리기기(CCTV,IPTV) 시험기관', '<div style="background:linear-gradient(135deg,#0a1628 0%,#132845 50%,#0d2137 100%); color:#e0e6ed; border-radius:22px; padding:40px 44px;">
<div style="display:inline-block; background:rgba(0,200,180,0.15); border:1px solid rgba(0,200,180,0.4); border-radius:31px; padding:9px 26px; margin-bottom:26px;">
<span style="color:#00d4aa; font-size:20px; font-weight:500;">● 국가 공인 시험기관 지정</span>
</div>
<div style="margin-bottom:31px;">
<p style="font-size:20px; font-weight:bold; color:#ffffff; line-height:1.7;">KOIST(한국정보보안기술원)은 <span style="color:#f0c040;">2026. 3. 16일</span> 부로 <span style="color:#00d4aa;">CCTV, IPTV</span> 분야의 국가 공인 시험기관으로 지정되었습니다.</p>
</div>
<div style="border-top:1px solid rgba(255,255,255,0.12); padding-top:26px;">
<p style="font-size:18px; color:#8899aa; margin-bottom:22px; letter-spacing:0.5px;">담당부서 연락처</p>
<div style="display:flex; align-items:center; gap:18px; margin-bottom:18px;">
<div style="width:44px; height:44px; background:rgba(0,200,180,0.2); border-radius:13px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-phone" style="color:#00d4aa; font-size:18px;"></i></div>
<div><p style="font-size:18px; color:#8899aa; margin-bottom:1px;">평가팀 (직통)</p><p style="font-size:23px; font-weight:bold; color:#00d4aa;">070-4265-0886</p></div>
</div>
<div style="display:flex; align-items:center; gap:18px; margin-bottom:18px;">
<div style="width:44px; height:44px; background:rgba(100,200,140,0.2); border-radius:13px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-envelope" style="color:#64c88c; font-size:18px;"></i></div>
<div><p style="font-size:18px; color:#8899aa; margin-bottom:1px;">E-MAIL</p><p style="font-size:23px; font-weight:600; color:#e0e6ed;">jhchoi@koist.kr</p></div>
</div>
<div style="display:flex; align-items:center; gap:18px;">
<div style="width:44px; height:44px; background:rgba(80,160,220,0.2); border-radius:13px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-home" style="color:#50a0dc; font-size:18px;"></i></div>
<div><p style="font-size:18px; color:#8899aa; margin-bottom:1px;">KOIST 대표</p><p style="font-size:23px; font-weight:600; color:#e0e6ed;">02-586-1230</p></div>
</div>
</div>
</div>', '/static/images/popup-contact.png', 'html', 600, 358, 80, 0, 1, 1, 17, 23, '#0a1628', '#0d1b2e', '#e0e6ed', '#ffffff', 1.7, 25, NULL, NULL);
INSERT INTO popups (id, title, content, image_url, popup_type, width, height, position_top, position_left, is_active, sort_order, font_size, title_font_size, bg_color, title_bg_color, text_color, title_color, line_height, padding, card_width_cm, card_height_cm) VALUES (2, 'KCMVP 민간시험 기관 지정', '', '/static/images/kcmvp-certificate.jpg', 'image', 600, 500, 80, 480, 1, 2, 17, 17, '#ffffff', '', '#374151', '#1f2937', 1.7, 20, 13, 12);
INSERT INTO popups (id, title, content, image_url, popup_type, width, height, position_top, position_left, is_active, sort_order, font_size, title_font_size, bg_color, title_bg_color, text_color, title_color, line_height, padding, card_width_cm, card_height_cm) VALUES (1, 'CC평가 대기기간 안내', '', '/static/images/popup-cc-evaluation.png', 'image', 470, 150, 180, 30, 1, 3, 17, 17, '#ffffff', '', '#374151', '#1f2937', 1.7, 20, 13, 6);

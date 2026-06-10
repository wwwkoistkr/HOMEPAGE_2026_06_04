PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" VALUES(1,'0001_initial_schema.sql','2026-06-05 02:22:48');
INSERT INTO "d1_migrations" VALUES(2,'0002_about_pages.sql','2026-06-05 02:22:48');
INSERT INTO "d1_migrations" VALUES(3,'0003_progress_schema_upgrade.sql','2026-06-05 02:22:49');
INSERT INTO "d1_migrations" VALUES(4,'0004_images_and_bg_settings.sql','2026-06-05 02:22:49');
INSERT INTO "d1_migrations" VALUES(5,'0005_eval_readiness_levels.sql','2026-06-05 02:22:50');
INSERT INTO "d1_migrations" VALUES(6,'0006_simulator_cert_types.sql','2026-06-05 02:22:50');
INSERT INTO "d1_migrations" VALUES(7,'0007_hero_compact_settings.sql','2026-06-05 02:22:51');
INSERT INTO "d1_migrations" VALUES(8,'0008_gnb_menu_settings.sql','2026-06-05 02:22:51');
INSERT INTO "d1_migrations" VALUES(9,'0010_unified_layout_settings.sql','2026-06-05 02:22:51');
INSERT INTO "d1_migrations" VALUES(10,'0011_dept_image_url.sql','2026-06-05 02:22:52');
INSERT INTO "d1_migrations" VALUES(11,'0012_about_initial_data.sql','2026-06-05 02:22:52');
INSERT INTO "d1_migrations" VALUES(12,'0013_location_map_upgrade.sql','2026-06-05 02:22:53');
INSERT INTO "d1_migrations" VALUES(13,'0014_import_old_notices.sql','2026-06-05 02:22:53');
INSERT INTO "d1_migrations" VALUES(14,'0015_import_old_downloads.sql','2026-06-05 02:22:54');
INSERT INTO "d1_migrations" VALUES(15,'0016_footer_hero_contact_settings.sql','2026-06-05 02:22:54');
INSERT INTO "d1_migrations" VALUES(16,'0017_hardcoded_text_to_settings.sql','2026-06-05 02:22:55');
INSERT INTO "d1_migrations" VALUES(17,'0018_mega_menu_and_missing_downloads.sql','2026-06-05 02:22:55');
INSERT INTO "d1_migrations" VALUES(18,'0019_v35_3_hero_slider_admin_keys.sql','2026-06-05 02:22:56');
INSERT INTO "d1_migrations" VALUES(19,'0020_ccra_label_update.sql','2026-06-05 02:22:56');
INSERT INTO "d1_migrations" VALUES(20,'0021_hero_gradient_colors.sql','2026-06-05 02:22:56');
INSERT INTO "d1_migrations" VALUES(21,'0022_dept_contacts_and_page_bg.sql','2026-06-05 02:22:57');
INSERT INTO "d1_migrations" VALUES(22,'0023_hero_video_url.sql','2026-06-05 02:22:57');
INSERT INTO "d1_migrations" VALUES(23,'0024_admin_seed_guard.sql','2026-06-05 02:22:57');
INSERT INTO "d1_migrations" VALUES(24,'0025_normalize_defaults.sql','2026-06-05 02:22:58');
INSERT INTO "d1_migrations" VALUES(25,'0026_responsive_poster_settings.sql','2026-06-05 02:22:58');
INSERT INTO "d1_migrations" VALUES(26,'0027_hero_line2_update.sql','2026-06-05 02:22:59');
INSERT INTO "d1_migrations" VALUES(27,'0028_complete_admin_settings.sql','2026-06-05 02:22:59');
INSERT INTO "d1_migrations" VALUES(28,'0029_slider_admin_settings.sql','2026-06-05 02:23:00');
INSERT INTO "d1_migrations" VALUES(29,'0030_content_migration_original.sql','2026-06-05 02:23:01');
INSERT INTO "d1_migrations" VALUES(30,'0031_legacy_theme_flag.sql','2026-06-05 02:23:01');
INSERT INTO "d1_migrations" VALUES(31,'0032_certificate_overview_hotfix.sql','2026-06-05 02:23:02');
INSERT INTO "d1_migrations" VALUES(32,'0033_cc_apply_original_replica.sql','2026-06-05 02:23:02');
INSERT INTO "d1_migrations" VALUES(33,'0034_v398_10pages_original_replica.sql','2026-06-05 02:23:03');
INSERT INTO "d1_migrations" VALUES(34,'0035_about_history_original_replica.sql','2026-06-05 02:23:03');
INSERT INTO "d1_migrations" VALUES(35,'0035a_popups_missing_columns.sql','2026-06-05 02:23:04');
INSERT INTO "d1_migrations" VALUES(36,'0036_popup_bg_and_fit.sql','2026-06-05 02:23:04');
INSERT INTO "d1_migrations" VALUES(37,'0037_rollback_popup_v3910.sql','2026-06-05 02:23:05');
INSERT INTO "d1_migrations" VALUES(38,'0038_popup_bg_dark_redo.sql','2026-06-05 02:23:05');
INSERT INTO "d1_migrations" VALUES(39,'0039_rollback_popup_v3911.sql','2026-06-05 02:23:05');
INSERT INTO "d1_migrations" VALUES(40,'0040_popup_card_height_null.sql','2026-06-05 02:23:06');
INSERT INTO "d1_migrations" VALUES(41,'0041_popup_card_height_12_6.sql','2026-06-05 02:23:06');
INSERT INTO "d1_migrations" VALUES(42,'0042_hero_video_from_koist_original.sql','2026-06-05 02:23:07');
INSERT INTO "d1_migrations" VALUES(43,'0043_hero_video_url_2.sql','2026-06-05 02:23:07');
INSERT INTO "d1_migrations" VALUES(44,'0044_floor23_bg_admin.sql','2026-06-05 02:23:08');
INSERT INTO "d1_migrations" VALUES(45,'0046_rollback_system_docs_seed.sql','2026-06-05 02:23:08');
INSERT INTO "d1_migrations" VALUES(46,'0048_restore_v3916_settings.sql','2026-06-05 02:23:09');
INSERT INTO "d1_migrations" VALUES(47,'0049_v3920_layout_swap_sim_opacity.sql','2026-06-05 02:23:09');
INSERT INTO "d1_migrations" VALUES(48,'0050_v3921_hero_sim_offsets.sql','2026-06-05 02:23:09');
INSERT INTO "d1_migrations" VALUES(49,'0051_v3922_fix_legacy_image_paths.sql','2026-06-05 02:23:10');
INSERT INTO "d1_migrations" VALUES(50,'0051_v3922_legacy_images.sql','2026-06-05 02:23:10');
INSERT INTO "d1_migrations" VALUES(51,'0052_v3923_fix_p40_broken_images.sql','2026-06-05 02:23:11');
INSERT INTO "d1_migrations" VALUES(52,'0053_v3924_fix_p37_p33_to_p48.sql','2026-06-05 02:23:12');
INSERT INTO "d1_migrations" VALUES(53,'0054_privacy_consent_and_audit.sql','2026-06-05 02:23:12');
INSERT INTO "d1_migrations" VALUES(54,'0055_v40_unify_categories.sql','2026-06-05 02:23:12');
INSERT INTO "d1_migrations" VALUES(55,'0056_v403_lightblue_theme_settings.sql','2026-06-05 02:23:13');
INSERT INTO "d1_migrations" VALUES(56,'0057_v4031_footer_light_text.sql','2026-06-05 02:23:14');
INSERT INTO "d1_migrations" VALUES(57,'0057a_ensure_departments_seed.sql','2026-06-05 02:23:14');
INSERT INTO "d1_migrations" VALUES(58,'0058_etc_test_status.sql','2026-06-05 02:23:14');
INSERT INTO "d1_migrations" VALUES(59,'0059_remove_test_department.sql','2026-06-05 02:23:15');
INSERT INTO "d1_migrations" VALUES(60,'0060_fix_legacy_image_urls.sql','2026-06-05 02:23:15');
INSERT INTO "d1_migrations" VALUES(61,'0061_restore_live_v4232_data.sql','2026-06-10 06:48:52');
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    must_change_password INTEGER DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "site_settings" VALUES(1,'hero_bg_url','','background','히어로 배경 이미지 URL','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(2,'hero_overlay_opacity','0.85','background','히어로 오버레이 투명도 (0~1)','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(3,'services_bg_url','','background','사업분야 섹션 배경 이미지','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(4,'notice_progress_bg_url','','background','공지/현황 섹션 배경 이미지','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(5,'cta_bg_url','','background','CTA 섹션 배경 이미지','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(6,'footer_bg_url','','background','푸터 배경 이미지','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(7,'page_header_bg_url','','background','서브페이지 헤더 배경 이미지','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(8,'gnb_bg_url','','background','내비게이션 배경 이미지','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(9,'dept_bg_default','','background','사업분야 기본 헤더 배경 이미지','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(10,'hero_badge_text','국가 공인 정보보안 시험·평가 전문기관','content','히어로 배지 텍스트','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(11,'hero_btn_primary','온라인 상담','content','히어로 메인 버튼 텍스트','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(12,'hero_btn_secondary','사업분야 보기','content','히어로 보조 버튼 텍스트','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(13,'hero_quick_badge','CC평가 신청 즉시 착수 가능','content','히어로 빠른 배지 텍스트','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(14,'services_title','핵심 사업분야','content','사업분야 섹션 제목','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(15,'services_subtitle','KOIST의 전문 시험·평가 서비스를 한눈에 확인하세요','content','사업분야 섹션 부제목','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(16,'cta_subtitle','전문 상담 안내','content','CTA 섹션 소제목','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(17,'cta_title','정보보안 시험·인증이 필요하신가요?','content','CTA 섹션 제목','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(18,'cta_description','전문 상담원이 빠르고 정확하게 안내해 드립니다','content','CTA 섹션 설명','2026-06-05 02:22:49');
INSERT INTO "site_settings" VALUES(19,'eval_overall_koist_prep_high','4','evaluation','전체평균 KOIST 준비기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(20,'eval_overall_koist_eval_high','7','evaluation','전체평균 KOIST 평가기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(21,'eval_overall_koist_prep_mid','6','evaluation','전체평균 KOIST 준비기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(22,'eval_overall_koist_eval_mid','9','evaluation','전체평균 KOIST 평가기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(23,'eval_overall_koist_prep_low','9','evaluation','전체평균 KOIST 준비기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(24,'eval_overall_koist_eval_low','11','evaluation','전체평균 KOIST 평가기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(25,'eval_eal2_koist_prep_high','2','evaluation','EAL2 KOIST 준비기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(26,'eval_eal2_koist_eval_high','3','evaluation','EAL2 KOIST 평가기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(27,'eval_eal2_koist_prep_mid','4','evaluation','EAL2 KOIST 준비기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(28,'eval_eal2_koist_eval_mid','4','evaluation','EAL2 KOIST 평가기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(29,'eval_eal2_koist_prep_low','6','evaluation','EAL2 KOIST 준비기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(30,'eval_eal2_koist_eval_low','5','evaluation','EAL2 KOIST 평가기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(31,'eval_eal3_koist_prep_high','4','evaluation','EAL3 KOIST 준비기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(32,'eval_eal3_koist_eval_high','4','evaluation','EAL3 KOIST 평가기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(33,'eval_eal3_koist_prep_mid','6','evaluation','EAL3 KOIST 준비기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(34,'eval_eal3_koist_eval_mid','5','evaluation','EAL3 KOIST 평가기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(35,'eval_eal3_koist_prep_low','8','evaluation','EAL3 KOIST 준비기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(36,'eval_eal3_koist_eval_low','7','evaluation','EAL3 KOIST 평가기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(37,'eval_eal4_koist_prep_high','5','evaluation','EAL4 KOIST 준비기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(38,'eval_eal4_koist_eval_high','5','evaluation','EAL4 KOIST 평가기간 - 준비도 상(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(39,'eval_eal4_koist_prep_mid','8','evaluation','EAL4 KOIST 준비기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(40,'eval_eal4_koist_eval_mid','7','evaluation','EAL4 KOIST 평가기간 - 준비도 중(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(41,'eval_eal4_koist_prep_low','11','evaluation','EAL4 KOIST 준비기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(42,'eval_eal4_koist_eval_low','10','evaluation','EAL4 KOIST 평가기간 - 준비도 하(개월)','2026-06-05 02:22:50');
INSERT INTO "site_settings" VALUES(43,'hero_line1','정보보안 시험·인증 전문기관','content','히어로 첫번째 줄 (컴팩트 2줄 버전)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(44,'hero_line2','IT제품 보안성 평가·인증의 원스톱 서비스','content','히어로 두번째 줄 (컴팩트 2줄 버전, HTML 허용)','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(45,'services_tag_font_scale','1','content','사업분야 태그 글자 크기 배율 (기본 2배)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(46,'services_tag_gap_scale','0.35','content','사업분야 태그 간격 비율 (기본 0.7 = 30% 축소)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(47,'services_grid_cols','5','content','사업분야 그리드 열 수 (데스크탑, 기본 5)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(48,'gnb_font_scale','1.4','content','GNB 사업분야 메뉴 글자 크기 배율 (기본 1.4배)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(49,'gnb_gap_scale','0.5','content','GNB 사업분야 메뉴 간격 비율 (기본 0.5 = 50% 축소)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(50,'gnb_font_weight','600','content','GNB 메뉴 글자 두께 (300~900)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(51,'gnb_text_color','rgba(220,228,240,0.92)','content','GNB 메뉴 글자 색상','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(52,'gnb_hover_color','#FFFFFF','content','GNB 메뉴 hover 글자 색상','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(53,'unified_panel_title','KOIST와 함께라면 평가기간을 <span class="text-cyan-300">대폭 단축</span>합니다','content','통합패널 헤더 타이틀','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(54,'unified_panel_subtitle','사전준비 수준에 따라 실시간으로 기간을 산출합니다','content','통합패널 헤더 부제','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(55,'unified_reduction_default','35','content','헤더 기본 단축률(%)','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(56,'unified_reduction_label','평균 단축','content','단축률 라벨','2026-06-05 02:22:51');
INSERT INTO "site_settings" VALUES(57,'hero_contact_label','국가 시험·인증 전문기관 정보보안 기술을 완성','content','히어로 연락처 카드 상단 라벨','2026-06-05 02:22:54');
INSERT INTO "site_settings" VALUES(58,'services_icon_scale','0.65','theme','사업분야 아이콘 크기 배율 (0.3~2.0)','2026-06-05 02:22:54');
INSERT INTO "site_settings" VALUES(59,'sim_tab_overall','전체평균','simulator','EAL Tab: 전체평균 버튼 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(60,'sim_tab_eal2','EAL2','simulator','EAL Tab: EAL2 버튼 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(61,'sim_tab_eal3','EAL3','simulator','EAL Tab: EAL3 버튼 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(62,'sim_tab_eal4','EAL4','simulator','EAL Tab: EAL4 버튼 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(63,'sim_label_prep','사전준비','simulator','시뮬레이터 사전준비 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(64,'sim_label_traditional','CCRA평가일수','simulator','시뮬레이터 전통 프로세스 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(65,'sim_label_koist','KOIST 평가 프로세스','simulator','시뮬레이터 KOIST 프로세스 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(66,'accordion_title','공지사항 / 자료실 / 시스템문서 / 오시는길','content','아코디언 섹션 트리거 제목','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(67,'accordion_expand_label','펼쳐보기','content','아코디언 펼쳐보기 버튼 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(68,'company_name','(주)한국정보보안기술원','general','회사 공식 명칭','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(69,'progress_title','평가현황','content','평가현황 섹션 제목','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(70,'progress_total_label','총 시험·평가 실적','content','평가현황 총 실적 라벨','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(71,'services_badge','KOIST 사업분야','content','사업분야 섹션 배지 텍스트','2026-06-05 02:22:55');
INSERT INTO "site_settings" VALUES(76,'sim_slider_level1','미흡','simulator','슬라이더 레벨1 라벨 (빨강)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(77,'sim_slider_level2','보통','simulator','슬라이더 레벨2 라벨 (노랑)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(78,'sim_slider_level3','양호','simulator','슬라이더 레벨3 라벨 (초록)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(79,'sim_slider_level4','우수','simulator','슬라이더 레벨4 라벨 (파랑)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(83,'hero_gradient_color1','#070B14','background','히어로 그라데이션 색상 1 (0%)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(84,'hero_gradient_color2','#0A1128','background','히어로 그라데이션 색상 2 (25%)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(85,'hero_gradient_color3','#0F1E3D','background','히어로 그라데이션 색상 3 (45%)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(86,'hero_gradient_color4','#162D5A','background','히어로 그라데이션 색상 4 (70%)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(87,'hero_gradient_color5','#1A3A6E','background','히어로 그라데이션 색상 5 (100%)','2026-06-05 02:22:56');
INSERT INTO "site_settings" VALUES(88,'hero_video_url','/static/videos/main_mov1.mp4','hero','히어로 배경 비디오 URL (R2 Storage MP4). 비어있으면 기존 그라디언트/이미지 배경 사용','2026-06-05 02:23:07');
INSERT INTO "site_settings" VALUES(89,'hero_video_poster','','hero','히어로 비디오 포스터 이미지 URL (비디오 로딩 전 표시)','2026-06-05 02:22:57');
INSERT INTO "site_settings" VALUES(90,'hero_video_opacity','0.45','hero','히어로 비디오 오버레이 불투명도 (0.0~1.0)','2026-06-05 02:23:07');
INSERT INTO "site_settings" VALUES(91,'hero_video_poster_4k','','hero','히어로 포스터 4K (3840x2160 WebP, 데스크탑 HiDPI용)','2026-06-05 02:22:58');
INSERT INTO "site_settings" VALUES(92,'hero_video_poster_fhd','','hero','히어로 포스터 FHD (1920x1080 WebP, 데스크탑 표준용)','2026-06-05 02:22:58');
INSERT INTO "site_settings" VALUES(93,'hero_video_poster_mobile','','hero','히어로 포스터 모바일 (1080p WebP, 모바일/태블릿용)','2026-06-05 02:22:58');
INSERT INTO "site_settings" VALUES(99,'kolas_image_url','/static/images/kolas.png','content','KOLAS 마크 이미지 URL','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(100,'hero_badge_logo_url','/static/images/koist-circle-logo.png','content','히어로 배지 로고 이미지 URL','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(101,'hero_btn_primary_url','/support/inquiry','content','CTA 버튼 1 링크 URL','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(102,'hero_btn_secondary_url','#services','content','CTA 버튼 2 링크 URL','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(103,'hero_btn_primary_icon','fa-paper-plane','content','CTA 버튼 1 아이콘 (FontAwesome 클래스)','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(104,'hero_btn_secondary_icon','fa-th-large','content','CTA 버튼 2 아이콘 (FontAwesome 클래스)','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(105,'site_name','한국정보보안기술원','general','사이트 공식 명칭','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(106,'site_slogan','KOIST','general','사이트 슬로건/약자','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(107,'topbar_bg_color','','theme','탑바 배경 색상 (빈값=기본 그라디언트)','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(108,'gnb_bar_bg_color','','theme','GNB 바 배경 색상 (빈값=기본 그라디언트)','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(116,'logo_url','/static/images/logo-horizontal.png','general','사이트 로고 이미지 URL (빈값=텍스트 로고 fallback)','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(117,'meta_description','IT제품 보안성 평가·인증의 원스톱 서비스, 한국정보보안기술원','seo','SEO 메타 설명','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(118,'meta_keywords','정보보안, CC평가, 보안인증, KOIST, 한국정보보안기술원','seo','SEO 메타 키워드','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(119,'google_analytics_id','','analytics','Google Analytics ID','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(120,'google_conversion_id','','analytics','Google Conversion ID','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(121,'naver_verification','','seo','네이버 사이트 인증 코드','2026-06-05 02:22:59');
INSERT INTO "site_settings" VALUES(122,'slider_total_mode','sum','slider','총합 표시 모드: sum=준비+평가의 합(Option C, 권장) / round=round(total) / decimal=소수1자리','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(123,'slider_round_mode','round','slider','반올림 모드: round / ceil / floor','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(124,'slider_decimal_places','0','slider','표시 소수 자리 수 (0=정수, 1=소수1자리)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(125,'slider_number_unit','개월','slider','숫자 단위 문자열 (예: 개월, 월, months)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(126,'slider_total_format','약 {N}개월','slider','바 위 총합 포맷 (예: "약 {N}개월")','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(127,'slider_prep_format','준비 {N}개월','slider','준비 개월 포맷','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(128,'slider_eval_format','평가 {N}개월','slider','평가 개월 포맷','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(129,'slider_reduction_format','{N}%','slider','단축률 뱃지 포맷','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(130,'slider_saving_format','약 {N}개월 절감','slider','절감 개월 포맷','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(131,'slider_prep_label','준비','slider','준비 결과 라벨','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(132,'slider_eval_label','평가','slider','평가 결과 라벨','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(133,'slider_gen_prep_color','#F59E0B','slider','CCRA 바 준비 구간 색상 (왼쪽)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(134,'slider_gen_eval_color','#94A3B8','slider','CCRA 바 평가 구간 색상 (오른쪽)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(135,'slider_gen_min_width','15','slider','CCRA 바 최소 너비 % (시각적 가독성 보장)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(136,'slider_gen_transition','0.7','slider','CCRA 바 애니메이션 지속 시간(초)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(137,'slider_koist_prep_color','#F59E0B','slider','KOIST 바 준비 구간 색상','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(138,'slider_koist_eval_color','#3B82F6','slider','KOIST 바 평가 구간 색상','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(139,'slider_koist_min_width','8','slider','KOIST 바 최소 너비 %','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(140,'slider_koist_transition','0.5','slider','KOIST 바 애니메이션 지속 시간(초)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(141,'slider_track_color_1','#EF4444','slider','사전준비 1단계 색상 (0~25%, 빨강: 저조)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(142,'slider_track_color_2','#F59E0B','slider','사전준비 2단계 색상 (26~50%, 주황: 보통)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(143,'slider_track_color_3','#10B981','slider','사전준비 3단계 색상 (51~75%, 초록: 양호)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(144,'slider_track_color_4','#3B82F6','slider','사전준비 4단계 색상 (76~100%, 파랑: 우수)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(145,'slider_track_opacity','0.20','slider','사전준비 트랙 배경 투명도 (0.0~1.0)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(146,'slider_badge_grad_start','#10B981','slider','단축률 뱃지 그라데이션 시작 색상 (왼쪽)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(147,'slider_badge_grad_end','#059669','slider','단축률 뱃지 그라데이션 끝 색상 (오른쪽)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(148,'slider_badge_text_color','#FFFFFF','slider','단축률 뱃지 글자 색상','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(149,'slider_gen_prep_ratio','55','slider','CCRA 준비 비율(%) (예: 55 → 준비 55% / 평가 45%)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(150,'slider_gen_eval_ratio','45','slider','CCRA 평가 비율(%)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(151,'slider_koist_prep_ratio','40','slider','KOIST 준비 비율(%) (예: 40 → 준비 40% / 평가 60%)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(152,'slider_koist_eval_ratio','60','slider','KOIST 평가 비율(%)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(153,'slider_weeks_per_month','4.345','slider','주(week) → 개월(month) 변환 계수 (기본 4.345 = 52주/12개월)','2026-06-05 02:23:00');
INSERT INTO "site_settings" VALUES(154,'hero_video_url_2','/static/videos/main_mov2.mp4','background','1층 Hero 두 번째 영상 URL (비어있으면 단일 영상 재생, 있으면 두 영상 번갈아 재생)','2026-06-05 02:23:07');
INSERT INTO "site_settings" VALUES(156,'services_bg_color','#FFFFFF','background','2층(Services) 배경 색상 (배경 URL이 비어있을 때 사용)','2026-06-05 02:23:08');
INSERT INTO "site_settings" VALUES(157,'services_bg_opacity','0.85','background','2층(Services) 배경 이미지 오버레이 투명도 (0~1)','2026-06-05 02:23:08');
INSERT INTO "site_settings" VALUES(158,'accordion_bg_url','','background','3층(Accordion) 배경 이미지/비디오 URL - 비어있으면 accordion_bg_color 사용','2026-06-05 02:23:08');
INSERT INTO "site_settings" VALUES(159,'accordion_bg_color','#FFFFFF','background','3층(Accordion) 배경 색상 (배경 URL이 비어있을 때 사용)','2026-06-05 02:23:08');
INSERT INTO "site_settings" VALUES(160,'accordion_bg_opacity','0.85','background','3층(Accordion) 배경 이미지 오버레이 투명도 (0~1)','2026-06-05 02:23:08');
INSERT INTO "site_settings" VALUES(161,'accordion_video_url','','background','3층(Accordion) 배경 MP4 비디오 URL - 설정 시 이미지/색상 대신 비디오 재생','2026-06-05 02:23:08');
INSERT INTO "site_settings" VALUES(162,'accordion_video_opacity','0.75','background','3층(Accordion) 배경 비디오 오버레이 투명도 (0~1)','2026-06-05 02:23:08');
INSERT INTO "site_settings" VALUES(171,'hero_layout_swap','1','layout','1층 HERO/SIMULATOR 좌우 교체 (1=교체, 0=원래대로). v39.20 기본 1','2026-06-05 02:23:09');
INSERT INTO "site_settings" VALUES(172,'sim_panel_opacity','0.03','design','시뮬레이터 패널 본문(흰색 영역) 불투명도 (0.0~1.0). 1=완전 불투명, 0.7=30% 반투명. v39.20 추가','2026-06-05 02:23:09');
INSERT INTO "site_settings" VALUES(173,'sim_header_opacity','0.85','design','시뮬레이터 패널 헤더(검정 그라디언트) 불투명도 (0.0~1.0). v39.20 추가','2026-06-05 02:23:09');
INSERT INTO "site_settings" VALUES(174,'sim_panel_blur','16','design','시뮬레이터 패널 backdrop-filter blur 강도 (px). 0=블러 없음. v39.20 추가','2026-06-05 02:23:09');
INSERT INTO "site_settings" VALUES(175,'sim_offset_left_cm','-1.5','layout','시뮬레이터 패널 좌측 시프트 (cm). 음수=좌측 이동. v39.21 추가','2026-06-05 02:23:09');
INSERT INTO "site_settings" VALUES(176,'sim_offset_top_cm','-1.0','layout','시뮬레이터 패널 상단 시프트 (cm). 음수=위로 이동. v39.21 추가','2026-06-05 02:23:09');
INSERT INTO "site_settings" VALUES(177,'hero_offset_right_cm','3.0','layout','HERO 텍스트 우측 시프트 (cm). 양수=우측 이동. v39.21 추가','2026-06-05 02:23:09');
INSERT INTO "site_settings" VALUES(178,'legacy_images_v3922_status','applied','general',NULL,'2026-06-05 02:23:10');
INSERT INTO "site_settings" VALUES(179,'theme_primary','#2563EB','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(180,'theme_cyan','#06B6D4','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(181,'page_header_color1','#1E3A8A','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(182,'page_header_color2','#2563EB','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(183,'page_header_color3','#3B82F6','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(184,'page_header_height_scale','0.3','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(185,'footer_color1','#E8F2FF','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(186,'footer_color2','#D6E9FF','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(187,'gnb_bar_color1','#2563EB','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(188,'gnb_bar_color2','#3B82F6','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(189,'input_bg_color','#F0F7FF','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(190,'input_border_color','#BFDBFE','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(191,'input_focus_color','#3B82F6','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(192,'inquiry_section_pad_scale','0.7','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(193,'inquiry_max_width','1200','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(194,'accent_color','#3B82F6','general',NULL,'2026-06-05 02:23:13');
INSERT INTO "site_settings" VALUES(197,'footer_text_color','#1E3A8A','general',NULL,'2026-06-05 02:23:14');
INSERT INTO "site_settings" VALUES(198,'footer_heading_color','#0F172A','general',NULL,'2026-06-05 02:23:14');
INSERT INTO "site_settings" VALUES(199,'footer_muted_color','#475569','general',NULL,'2026-06-05 02:23:14');
INSERT INTO "site_settings" VALUES(200,'footer_hover_color','#1D4ED8','general',NULL,'2026-06-05 02:23:14');
INSERT INTO "site_settings" VALUES(202,'site_name_en','KOIST - Korean Information Security Technology','general','영문 사이트명','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(204,'site_sub_slogan','정보보안 기술은 IT제품으로 구현되고 시험·인증 서비스를 통해 완성됩니다.','general','서브 슬로건','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(205,'phone','02-586-1230','contact','대표 전화번호','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(206,'phone_display','02-586-1230','contact','화면 표시용 전화번호','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(207,'fax','02-586-1238','contact','팩스 번호','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(208,'email','koist@koist.kr','contact','대표 이메일','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(209,'address','서울특별시 서초구 효령로 336 윤일빌딩 4층 한국정보보안기술원','contact','주소','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(210,'contact_person','담당자','contact','담당자명','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(212,'main_bg_url','','theme','메인 배경 이미지','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(213,'primary_color','#1E3A5F','theme','주요 색상','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(220,'eval_overall_general_prep','12','evaluation','전체평균 일반 준비기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(221,'eval_overall_general_eval','12','evaluation','전체평균 일반 평가기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(222,'eval_eal2_general_prep','8','evaluation','EAL2 일반 준비기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(223,'eval_eal2_general_eval','6','evaluation','EAL2 일반 평가기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(224,'eval_eal3_general_prep','10','evaluation','EAL3 일반 준비기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(225,'eval_eal3_general_eval','8','evaluation','EAL3 일반 평가기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(226,'eval_eal4_general_prep','14','evaluation','EAL4 일반 준비기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(227,'eval_eal4_general_eval','12','evaluation','EAL4 일반 평가기간(개월)','2026-06-05 02:23:28');
INSERT INTO "site_settings" VALUES(254,'eval_overall_koist_prep','6','evaluation','전체평균 KOIST 준비기간(개월)','2026-06-05 02:23:47');
INSERT INTO "site_settings" VALUES(255,'eval_overall_koist_eval','9','evaluation','전체평균 KOIST 평가기간(개월)','2026-06-05 02:23:47');
INSERT INTO "site_settings" VALUES(258,'eval_eal2_koist_prep','4','evaluation','EAL2 KOIST 준비기간(개월)','2026-06-05 02:23:47');
INSERT INTO "site_settings" VALUES(259,'eval_eal2_koist_eval','4','evaluation','EAL2 KOIST 평가기간(개월)','2026-06-05 02:23:47');
INSERT INTO "site_settings" VALUES(262,'eval_eal3_koist_prep','6','evaluation','EAL3 KOIST 준비기간(개월)','2026-06-05 02:23:47');
INSERT INTO "site_settings" VALUES(263,'eval_eal3_koist_eval','5','evaluation','EAL3 KOIST 평가기간(개월)','2026-06-05 02:23:47');
INSERT INTO "site_settings" VALUES(266,'eval_eal4_koist_prep','8','evaluation','EAL4 KOIST 준비기간(개월)','2026-06-05 02:23:47');
INSERT INTO "site_settings" VALUES(267,'eval_eal4_koist_eval','7','evaluation','EAL4 KOIST 평가기간(개월)','2026-06-05 02:23:47');
CREATE TABLE popups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    popup_type TEXT DEFAULT 'html',
    width INTEGER DEFAULT 420,
    height INTEGER DEFAULT 300,
    position_top INTEGER DEFAULT 100,
    position_left INTEGER DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
, card_width_cm REAL DEFAULT NULL, card_height_cm REAL DEFAULT NULL, bg_color TEXT DEFAULT NULL, font_size INTEGER DEFAULT 17, title_font_size INTEGER DEFAULT 17, title_bg_color TEXT DEFAULT '', text_color TEXT DEFAULT '#374151', title_color TEXT DEFAULT '#1f2937', line_height REAL DEFAULT 1.7, padding INTEGER DEFAULT 20);
INSERT INTO "popups" VALUES(1,'CC평가 대기기간 안내','','/static/images/popup-cc-evaluation.png','image',470,150,180,30,NULL,NULL,1,3,'2026-06-10 06:48:52','2026-06-10 06:48:52',13,6,'#ffffff',17,17,'','#374151','#1f2937',1.7,20);
INSERT INTO "popups" VALUES(2,'KCMVP 민간시험 기관 지정','','/static/images/kcmvp-certificate.jpg','image',600,500,80,480,NULL,NULL,1,2,'2026-06-10 06:48:52','2026-06-10 06:48:52',13,12,'#ffffff',17,17,'','#374151','#1f2937',1.7,20);
INSERT INTO "popups" VALUES(3,'국가 공인 민간 영상정보처리기기(CCTV,IPTV) 시험기관',replace('<div style="background:linear-gradient(135deg,#0a1628 0%,#132845 50%,#0d2137 100%); color:#e0e6ed; border-radius:22px; padding:40px 44px;">\n<div style="display:inline-block; background:rgba(0,200,180,0.15); border:1px solid rgba(0,200,180,0.4); border-radius:31px; padding:9px 26px; margin-bottom:26px;">\n<span style="color:#00d4aa; font-size:20px; font-weight:500;">● 국가 공인 시험기관 지정</span>\n</div>\n<div style="margin-bottom:31px;">\n<p style="font-size:20px; font-weight:bold; color:#ffffff; line-height:1.7;">KOIST(한국정보보안기술원)은 <span style="color:#f0c040;">2026. 3. 16일</span> 부로 <span style="color:#00d4aa;">CCTV, IPTV</span> 분야의 국가 공인 시험기관으로 지정되었습니다.</p>\n</div>\n<div style="border-top:1px solid rgba(255,255,255,0.12); padding-top:26px;">\n<p style="font-size:18px; color:#8899aa; margin-bottom:22px; letter-spacing:0.5px;">담당부서 연락처</p>\n<div style="display:flex; align-items:center; gap:18px; margin-bottom:18px;">\n<div style="width:44px; height:44px; background:rgba(0,200,180,0.2); border-radius:13px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-phone" style="color:#00d4aa; font-size:18px;"></i></div>\n<div><p style="font-size:18px; color:#8899aa; margin-bottom:1px;">평가팀 (직통)</p><p style="font-size:23px; font-weight:bold; color:#00d4aa;">070-4265-0886</p></div>\n</div>\n<div style="display:flex; align-items:center; gap:18px; margin-bottom:18px;">\n<div style="width:44px; height:44px; background:rgba(100,200,140,0.2); border-radius:13px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-envelope" style="color:#64c88c; font-size:18px;"></i></div>\n<div><p style="font-size:18px; color:#8899aa; margin-bottom:1px;">E-MAIL</p><p style="font-size:23px; font-weight:600; color:#e0e6ed;">jhchoi@koist.kr</p></div>\n</div>\n<div style="display:flex; align-items:center; gap:18px;">\n<div style="width:44px; height:44px; background:rgba(80,160,220,0.2); border-radius:13px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-home" style="color:#50a0dc; font-size:18px;"></i></div>\n<div><p style="font-size:18px; color:#8899aa; margin-bottom:1px;">KOIST 대표</p><p style="font-size:23px; font-weight:600; color:#e0e6ed;">02-586-1230</p></div>\n</div>\n</div>\n</div>','\n',char(10)),'/static/images/popup-contact.png','html',600,358,80,0,NULL,NULL,1,1,'2026-06-10 06:48:52','2026-06-10 06:48:52',NULL,NULL,'#0a1628',17,23,'#0d1b2e','#e0e6ed','#ffffff',1.7,25);
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'fa-shield-halved',
    color TEXT DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
, header_bg_url TEXT DEFAULT '', image_url TEXT DEFAULT '', contact_dept TEXT DEFAULT '', contact_name TEXT DEFAULT '', contact_phone TEXT DEFAULT '', use_legacy_theme INTEGER NOT NULL DEFAULT 1, english_subtitle TEXT DEFAULT NULL, progress_meta TEXT DEFAULT '{}', is_main_progress INTEGER DEFAULT 0);
INSERT INTO "departments" VALUES(1,'CC평가','cc','IT 보안제품의 보안성을 국제 표준인 CC(Common Criteria)에 따라 평가하는 서비스','fa-shield-halved','#3B82F6',1,1,'2026-06-05 02:23:14','','','평가사업부','부장','070-7733-9606',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(2,'보안기능 시험','security-test','정보보호제품의 보안기능에 대한 시험 및 인증을 수행하는 서비스','fa-flask-vial','#8B5CF6',2,1,'2026-06-05 02:23:14','','','평가사업부','팀장','070-4265-0886',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(3,'암호모듈 검증시험','kcmvp','국가정보원 지정 암호모듈 검증시험(KCMVP) 민간시험 기관','fa-lock','#EC4899',3,1,'2026-06-05 02:23:14','','','암호시험','팀장','070-4923-7622',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(4,'성능평가','performance','정보보호제품의 성능을 객관적으로 평가하는 서비스','fa-chart-line','#F59E0B',4,1,'2026-06-05 02:23:14','','','연구팀','선임연구원','070-4120-7452',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(5,'시험성적서','certificate','R&D 과제검증, AI 성능시험, NW 성능시험 등 시험성적서 발급','fa-file-lines','#10B981',5,1,'2026-06-05 02:23:14','','','연구팀','선임연구원','070-4120-7452',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(6,'정보보안진단','diagnosis','정보보호준비도 평가, DDoS 모의훈련, 취약점 분석 등 종합 보안진단','fa-magnifying-glass-chart','#EF4444',6,1,'2026-06-05 02:23:14','','','연구팀','선임연구원','070-4236-9200',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(7,'컨설팅','consulting','CC컨설팅, 검증필 암호모듈 컨설팅, ISMS-P 보안 컨설팅','fa-handshake','#6366F1',7,1,'2026-06-05 02:23:14','','','연구팀','선임연구원','070-4236-9200',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(8,'산업(기업)보안 컨설팅','enterprise-security','기업 맞춤형 종합 보안 컨설팅 서비스','fa-building-shield','#0EA5E9',8,1,'2026-06-05 02:23:14','','','연구팀','선임연구원','070-4236-9200',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(9,'정보보호준비도 평가','readiness','정보보호 수준을 체계적으로 진단하고 개선 방향을 제시하는 평가 서비스','fa-clipboard-check','#14B8A6',9,1,'2026-06-05 02:23:14','','','연구팀','선임연구원','070-4120-7448',1,NULL,'{}',0);
INSERT INTO "departments" VALUES(10,'모의평가','mock-test','본 평가 전 사전 점검을 통해 성공적인 인증 획득을 지원하는 서비스','fa-vial-virus','#F97316',10,1,'2026-06-05 02:23:14','','','연구팀','선임연구원','070-4236-9200',1,NULL,'{}',0);
CREATE TABLE dep_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dept_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    meta_description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, header_bg_url TEXT DEFAULT '',
    FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
);
INSERT INTO "dep_pages" VALUES(1,5,'S/W 시험현황','etc-test','<p>기타 소프트웨어 시험·평가 현황입니다.</p>','기타 소프트웨어 시험 및 평가 현황',50,1,'2026-06-05 02:23:14','2026-06-05 02:23:14','');
INSERT INTO "dep_pages" VALUES(2,1,'평가개요','overview','<h2>CC평가 개요</h2><p>CC(Common Criteria) 인증평가는 IT 보안제품(시스템)의 보안기능과 이에 대한 보증수단이 사전에 정의된 보안기능요구사항과 보증요구사항을 만족하는지를 제3의 독립된 평가기관이 평가하여 그 결과를 인증기관이 인증하는 제도입니다.</p><p>KOIST는 과학기술정보통신부로부터 지정받은 CC평가기관으로서, 국내외 최고의 평가 전문인력과 최신 평가 환경을 갖추고 있습니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(3,1,'신청방법','apply','<h2>CC평가 신청 방법</h2><p>CC평가 신청은 전화 또는 이메일로 사전 상담 후 진행됩니다.</p><h3>신청 절차</h3><ol><li>사전 상담 (전화/이메일)</li><li>평가 신청서 접수</li><li>평가 계약 체결</li><li>평가 수행</li><li>인증서 발급</li></ol>',NULL,2,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(4,1,'평가자문','consulting','<h2>CC평가 자문</h2><p>CC평가를 처음 준비하시는 업체를 위한 전문 자문 서비스를 제공합니다.</p>',NULL,3,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(5,1,'평가현황','progress','<h2>CC평가 현황</h2><p>현재 진행 중인 CC평가 현황입니다. 상세한 내용은 평가현황 게시판을 참조해주세요.</p>',NULL,4,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(6,2,'시험개요','overview','<h2>보안기능 시험 개요</h2><p>정보보호제품의 보안기능에 대한 시험을 수행하여 보안적합성을 검증하는 서비스입니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(7,2,'신청방법','apply','<h2>보안기능 시험 신청</h2><p>보안기능 시험 신청 절차를 안내합니다.</p>',NULL,2,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(8,2,'시험현황','progress','<h2>보안기능 시험 현황</h2><p>현재 진행 중인 시험 현황입니다.</p>',NULL,3,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(9,3,'시험개요','overview','<h2>암호모듈 검증시험(KCMVP) 개요</h2><p>국가정보원 지정 암호모듈 검증시험 민간시험 기관으로서, 암호모듈의 안전성과 구현 적합성을 검증합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(10,3,'신청방법','apply','<h2>KCMVP 시험 신청</h2><p>암호모듈 검증시험 신청 절차를 안내합니다.</p>',NULL,2,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(11,3,'시험현황','progress','<h2>KCMVP 시험 현황</h2><p>현재 진행 중인 암호모듈 검증시험 현황입니다.</p>',NULL,3,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(12,4,'평가개요','overview','<h2>성능평가 개요</h2><p>정보보호제품의 성능을 객관적이고 과학적인 방법으로 평가합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(13,4,'평가절차','procedure','<h2>성능평가 절차</h2><p>성능평가 진행 절차를 안내합니다.</p>',NULL,2,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(14,4,'평가현황','progress','<h2>성능평가 현황</h2><p>현재 진행 중인 성능평가 현황입니다.</p>',NULL,3,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(15,5,'시험성적서 개요','overview','<h2>시험성적서 발급</h2><p>R&D 과제검증, AI 성능시험, NW 성능시험 등 다양한 시험성적서를 발급합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(16,5,'R&D 과제검증','rnd','<h2>R&D 과제검증</h2><p>국가 R&D 과제의 연구개발 결과물에 대한 시험 및 검증 서비스를 제공합니다.</p>',NULL,2,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(17,5,'AI 성능시험','ai','<h2>AI 성능시험</h2><p>인공지능(AI) 기반 보안 솔루션의 성능을 시험하고 평가합니다.</p>',NULL,3,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(18,5,'NW 성능시험','network','<h2>NW 성능시험</h2><p>네트워크 보안 장비의 처리 성능을 객관적으로 시험합니다.</p>',NULL,4,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(19,6,'준비도평가','readiness','<h2>정보보호준비도 평가</h2><p>조직의 정보보호 수준을 체계적으로 진단하고 개선 방향을 제시합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(20,6,'DDoS 모의훈련','ddos','<h2>DDoS 모의훈련</h2><p>실제 DDoS 공격 시나리오를 기반으로 모의훈련을 실시합니다.</p>',NULL,2,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(21,6,'보안성능','security-perf','<h2>보안성능 평가</h2><p>보안 시스템의 성능을 종합적으로 평가합니다.</p>',NULL,3,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(22,6,'취약점분석','vulnerability','<h2>취약점 분석</h2><p>시스템 및 네트워크의 보안 취약점을 분석하고 대응방안을 제시합니다.</p>',NULL,4,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(23,6,'보안약점진단','weakness','<h2>보안약점 진단</h2><p>소프트웨어의 보안약점을 진단하고 개선방안을 제시합니다.</p>',NULL,5,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(24,7,'CC컨설팅','cc','<h2>CC컨설팅</h2><p>CC인증 획득을 위한 전문 컨설팅 서비스를 제공합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(25,7,'검증필 암호모듈 컨설팅','kcmvp','<h2>검증필 암호모듈 컨설팅</h2><p>KCMVP 인증 획득을 위한 전문 컨설팅을 지원합니다.</p>',NULL,2,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(26,7,'ISMS-P 보안 컨설팅','isms-p','<h2>ISMS-P 보안 컨설팅</h2><p>정보보호 및 개인정보보호 관리체계 인증(ISMS-P) 획득을 지원합니다.</p>',NULL,3,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(27,8,'산업(기업)보안 컨설팅','info','<h2>산업(기업)보안 컨설팅</h2><p>기업 환경에 최적화된 종합 보안 컨설팅 서비스를 제공합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(28,9,'정보보호준비도 평가','overview','<h2>정보보호준비도 평가</h2><p>조직의 정보보호 수준을 체계적으로 진단하여 보안 강화 방향을 제시합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
INSERT INTO "dep_pages" VALUES(29,10,'모의평가','overview','<h2>모의평가</h2><p>본 평가 전 사전 점검을 통해 성공적인 인증 획득을 지원합니다.</p>',NULL,1,1,'2026-06-05 02:23:28','2026-06-05 02:23:28','');
CREATE TABLE notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "notices" VALUES(1,'[보도자료] 6번째 민간 CC평가기관 탄생...인증 적체 풀리나',replace('<div class="notice-content">\n<p>여섯 번째 정보보호제품 민간 평가기관이 업무를 시작했다.</p>\n<p>국가보안기술연구소 IT보안인증사무국은 24일 한국정보보안기술원(KOIST·대표 김인숙)을 공통평가기준(CC) 평가기관으로 승인했다고 밝혔다.</p>\n<p>최근 정보보호 기업은 최소 6개월에서 최대 1년 넘게 걸리는 CC평가 인증 적체에 몸살을 앓고 있다. 한국정보보안기술원이 평가 업무를 시작해 인증 적체가 조금이나마 해소될 전망이다.</p>\n<p>KOIST는 선임평가자 3명, 주임평가자 2명, 수습평가자 1명 등 2개 팀으로 구성됐다. 지난해 2월부터 평가기관 설립 준비에 들어가 1년 만에 승인을 받았다. KOIST는 지난 2월 기술표준원에서 정보보호분야 국제공인시험기관(KOLAS) 인정서를 획득했다.</p>\n<p>KOIST는 방화벽과 침입방지시스템(IPS) 등 네트워크 보안 장비는 물론이고 시스템, 서버, PC 보안 솔루션 평가 업무를 시작했다.</p>\n<p>KOIST 승인으로 한국시스템보증(KOSYAS), 한국산업기술시험원(KTL), 한국아이티평가원(KSEL), 한국정보통신기술협회(TTA), 한국인터넷진흥원(KISA) 등 평가기관은 6곳으로 늘어났다.</p>\n<p>황창한 KOIST 관리이사는 "네트워크 보안제품 평가에 능숙한 선임평가자가 업무를 시작했다"며 "빠르고 품질 높은 평가로 정보보호 제품 수준 향상에 앞장설 것"이라고 말했다.</p>\n<p class="text-sm text-gray-400 mt-4">김인순기자 (insoon@etnews.com) [출처: 전자신문]</p>\n</div>','\n',char(10)),0,5602,'2014-05-29 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(2,'[보도자료] 하반기 CC인증 적체 풀린다',replace('<div class="notice-content">\n<p>최근 극심한 적체를 보였던 정보보호 제품 공통평가기준(CC)인증이 하반기 해소될 전망이다.</p>\n<p>15일 CC 평가기관에 따르면 올해 초까지 1년가량 소요될 것으로 예상됐던 CC인증 평균 대기시간이 최근 6개월 이하로 줄어들며 하반기 중 적체가 완전히 풀릴 것으로 기대했다. 새로 평가를 시작한 한국정보보안기술원(KOIST)은 대기 없이 바로 평가에 들어간다.</p>\n<p>CC평가 적체는 제도 변경과 한국인터넷진흥원(KISA) 및 한국산업기술시험원(KTL) 등 일부 평가기관이 업무를 줄이며 시작됐다. 국가보안기술연구소 IT보안인증사무국은 지난 2월 CC인증을 3년마다 갱신하도록 제도를 바꿨다.</p>\n<p>지난 4월 여섯 번째 민간 CC평가기관이 된 한국정보보안기술원(KOIST)은 대기 없이 바로 평가를 시작한다. KOIST는 선임평가자 3명, 주임평가자 3명, 수습평가자 1명 등 2개 팀으로 구성됐다.</p>\n<p>황창환 KOIST 관리이사는 "모든 정보보호 제품 평가가 가능하다"며 "대기 없이 바로 평가에 들어갈 수 있다"고 말했다.</p>\n<p class="text-sm text-gray-400 mt-4">김인순기자 (insoon@etnews.com) [출처: 전자신문]</p>\n</div>','\n',char(10)),0,5352,'2014-06-20 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(3,'(보도자료) 국제수준의 정보보호제품 평가·인증 교육실시',replace('<div class="notice-content">\n<p>한국CC평가협회(이하 CCEA)는 정보보호제품 평가·인증 제도에 대한 이해를 증진시키고 정보보호제품 평가(CC평가)관련 전문인력 양성을 위해 12월 8일(월)부터 19일(금)까지 ''2014년 정보보호제품 평가·인증 교육''을 실시할 예정이다.</p>\n<p>정보보호제품 평가·인증제도는 민간기업이 개발한 정보보호시스템에 구현된 보안기능의 안전성과 신뢰성을 보증하여 사용자들이 안심하고 제품을 사용할 수 있도록 지원하는 제도로 국가정보화 기본법 제38조에 근거하고 있다.</p>\n<p>CCEA는 ''CC 수습평가자'' 자격증 취득은 물론 국제수준의 평가업무능력 배양을 위해 평가·인증 교육을 10일간 실시할 예정이다.</p>\n<p>교육공고, 수강신청 등 상세한 내용은 한국정보보안기술원(www.koist.kr)에서 확인할 수 있다.</p>\n</div>','\n',char(10)),0,5382,'2014-11-25 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(4,'[보도자료] 한국CC평가협회 출범',replace('<div class="notice-content">\n<p>국제공통평가기준(CC) 인증 평가기관들이 하나로 뭉쳤다.</p>\n<p>한국정보보안기술원(KOIST), 한국아이티평가원(KSEL), 한국산업기술시험원(KTL), 한국시스템보증(KOSYAS) 등 4개 CC인증 평가기관들은 평가 업무의 발전과 CC인증 시장 저변확대를 위해 평가기관 협의체인 ''한국CC평가협회(협회장 황창환)''을 설립했다.</p>\n<p>협회는 CC인증 평가자 양성, 보안업체 의견수렴, CC인증 제도 개선 건의 등과 같은 업무를 추진할 예정이다.</p>\n<p>황창환 협회장은 "CC인증 업무가 미래창조과학부로 넘어가는 과정에서 평가기관의 목소리를 정부와 심사기관에 전달할 수 있는 창구가 될 것"이라며 "적극적인 활동으로 국가 정보보호 육성에 보탬이 되겠다"고 말했다.</p>\n<p class="text-sm text-gray-400 mt-4">이민형 기자 (kiku@ddaily.co.kr) [출처: 디지털데일리]</p>\n</div>','\n',char(10)),0,4868,'2015-01-14 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(5,'(보도자료) 국제수준의 정보보호제품 평가·인증 교육실시 (2015)',replace('<div class="notice-content">\n<p>사단법인 한국CC평가협회(이하 협회)는 정보보호제품 평가·인증 제도에 대한 이해를 증진시키고 국내 일자리 창출에 기여하고자 정보보호제품 평가(CC평가)관련 전문인력 양성을 위해 5월 11일(월)부터 22일(금)까지 ''정보보호제품 평가·인증 교육''을 실시할 예정이다.</p>\n<p>한국은 2006년 5월 국제상호인정협정(CCRA)에 인증서 발행국(CAP)으로 가입하여, 국제공통평가기준(Common Criteria)에 따라 평가·인증제도를 운영하고 있다.</p>\n<p>협회는 향후에도 지속적으로 교육의 품질을 강화하여 현장에 바로 투입할 수 있도록 실무에 강한 전문인력을 양성함으로써, 평가기관 또는 개발업체가 원하는 인재를 공급하는데 기여할 수 있을 것으로 기대된다.</p>\n</div>','\n',char(10)),0,11844,'2015-04-10 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(6,'[보도자료] 한국CC평가협회, 정보보호제품 평가 인증교육 실시',replace('<div class="notice-content">\n<p>한국CC평가협회는 ''CC 수습평가자'' 자격증 취득은 물론 실무에 바로 투입 될 수 있는 역량을 갖추도록 1월 18일부터 29일까지 10일간 ''2016년 정보보호제품 평가인증 교육''을 실시한다.</p>\n<p>교육은 CC 선임평가자가 국제수준(EAL 4)의 국제공통평가기준, 공통평가방법론, 평가실무를 교육할 계획이다. IT 보안인증사무국(인증기관) 주관의 수습평가자 시험을 실시해 합격하는 교육수강생에게 수습평가자 자격이 부여된다.</p>\n<p class="text-sm text-gray-400 mt-4">김인순기자 (insoon@etnews.com) [출처: 전자신문]</p>\n</div>','\n',char(10)),0,10975,'2016-01-05 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(7,'㈜한국정보보안기술원 고경력 연구인력 채용 공고',replace('<div class="notice-content">\n<h4 class="font-bold text-gray-800 mb-3">㈜한국정보보안기술원 평가자 채용 공고</h4>\n<p>㈜한국정보보안기술원은 CC평가 및 컨설팅 서비스와 소프트웨어 시험을 수행하는 기관으로 정보 보안 분야를 선도하고자 설립되었습니다. 정보 보안 분야를 선도하는데 동참할 이공계 석·박사급 우수 연구인력 및 경력 연구인력을 채용하고자 합니다.</p>\n<ul class="list-disc pl-6 space-y-1 text-sm mt-3">\n  <li><strong>채용분야:</strong> 정보보안</li>\n  <li><strong>채용직급:</strong> 이공계 석·박사급 우수 연구인력</li>\n  <li><strong>담당직무:</strong> 정보보안 분야 연구 및 소프트웨어 시험</li>\n  <li><strong>채용형태:</strong> 정규직</li>\n  <li><strong>접수:</strong> koist@koist.kr (☎ 02-586-1230)</li>\n</ul>\n</div>','\n',char(10)),0,11230,'2016-03-18 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(8,'㈜한국정보보안기술원 평가자 채용 공고',replace('<div class="notice-content">\n<h4 class="font-bold text-gray-800 mb-3">㈜한국정보보안기술원 평가자 채용 공고</h4>\n<p>㈜한국정보보안기술원은 CC평가 및 컨설팅 서비스와 소프트웨어 시험을 수행하는 기관으로 정보 보안 분야를 선도하고자 설립되었습니다. 정보 보안 분야를 선도하는데 동참할 창의력과 패기 넘치는 평가자를 채용하고자 합니다.</p>\n<ul class="list-disc pl-6 space-y-1 text-sm mt-3">\n  <li><strong>채용분야:</strong> 평가자</li>\n  <li><strong>채용직급:</strong> 수습평가자 (정보보호제품)</li>\n  <li><strong>담당직무:</strong> 보안성 평가 (CC인증)</li>\n  <li><strong>채용형태:</strong> 정규직</li>\n  <li><strong>자격:</strong> IT보안인증사무국장이 인정한 정보보호제품 수습평가자 이상 자격 보유자</li>\n  <li><strong>접수:</strong> koist@koist.kr (☎ 02-586-1230, 팀장 남희재)</li>\n</ul>\n</div>','\n',char(10)),0,13776,'2016-03-18 10:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(9,'정보보호제품 "성능평가기관" 지정',replace('<div class="notice-content">\n<h4 class="font-bold text-gray-800 mb-3">한국정보보안기술원 KOIST, 정보보호제품 성능평가기관 지정</h4>\n<p>한국정보보안기술원 KOIST는 아래의 법적근거에 의해 정보보호제품 성능평가기관으로 지정되었습니다.</p>\n<ul class="list-disc pl-6 space-y-1 text-sm mt-3">\n  <li>[정보보호산업의 진흥에 관한 법률] 제17조(성능평가 지원)</li>\n  <li>[정보보호산업의 진흥에 관한 법률 시행령] 제10조(성능평가의 방법 및 성능평가기관의 지정)</li>\n</ul>\n<p class="mt-4 font-semibold text-blue-600">성능평가 문의 : 02-586-1230</p>\n</div>','\n',char(10)),0,4849,'2018-05-16 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(10,'[CC평가] 평가신청접수증 발급 후 대기기간',replace('<div class="notice-content">\n<p>ㅇ 현 시점 기준 평가신청접수증 발급 후 대기기간 : <strong class="text-blue-600">3개월</strong></p>\n<p class="text-sm text-gray-500 mt-2">* 국내용/EAL2 기준, 대기기간은 평가진행 상황에 따라 변동될 수 있음</p>\n</div>','\n',char(10)),0,3516,'2021-01-26 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(11,'2021년도 정보보호제품 성능평가·컨설팅 신청·접수 안내',replace('<div class="notice-content">\n<p>안녕하세요, 한국인터넷진흥원은 정보보호제품의 성능향상과 성능평가제도 활성화를 위해 대상제품군에 대한 성능평가 및 컨설팅을 아래와 같이 실시하오니 관심있는 기업들의 많은 참여 부탁드립니다.</p>\n<h4 class="font-bold mt-4 mb-2">주요 사항</h4>\n<ul class="list-disc pl-6 space-y-1 text-sm">\n  <li><strong>지원내용:</strong> 정보보호제품 성능평가 및 컨설팅</li>\n  <li><strong>신청·접수기간:</strong> 2021.5.25 ~ 6.14 (3주간)</li>\n  <li><strong>신청방법:</strong> 구비서류(신청서, 서약서)를 작성 후 메일(spec@kosyas.com)로 신청</li>\n  <li><strong>신청자격:</strong> 대한민국에 본사를 둔 국내 정보보호제품 개발 기업</li>\n  <li><strong>신청대상 제품군:</strong> 11종 (안티바이러스, DDoS 대응장비, 방화벽, IPS, 웹방화벽, APT 대응장비, VPN, NDLP 등)</li>\n  <li><strong>선정기업 혜택:</strong> 비용 무료(성능평가 및 컨설팅)</li>\n</ul>\n<h4 class="font-bold mt-4 mb-2">수행기관</h4>\n<ul class="list-disc pl-6 space-y-1 text-sm">\n  <li>대표기관: ㈜한국시스템보증</li>\n  <li>참여기관: ㈜한국아이티평가원, <strong>㈜한국정보보안기술원</strong>, (재)한국기계전기전자시험연구원</li>\n</ul>\n<p class="text-sm text-gray-500 mt-4">접수 및 문의: ㈜한국시스템보증 Tel: 02-2097-9717, Email: spec@kosyas.com</p>\n</div>','\n',char(10)),0,3838,'2021-05-26 09:00:00','2026-06-05 02:22:53');
INSERT INTO "notices" VALUES(12,'[보도자료] 한국정보보안기술원(KOIST) 암호모듈 검증시험(KCMVP) 민간시험기관 지정',replace('<div class="notice-content">\n<h4 class="font-bold text-gray-800 mb-3">KOIST, 암호모듈 검증시험(KCMVP) 민간시험기관 지정</h4>\n<p>한국정보보안기술원(KOIST)이 국가정보원이 시행하는 암호모듈 검증제도(KCMVP)에 따라 암호모듈의 안전성과 구현 적합성을 시험하는 민간 시험기관으로 지정되었습니다.</p>\n<p class="mt-3">이로써 KOIST는 CC평가, 보안기능 시험, 성능평가에 이어 KCMVP 시험까지 정보보호 분야의 핵심 시험·평가 업무를 종합적으로 수행하는 기관으로 자리매김하였습니다.</p>\n<p class="mt-4 font-semibold text-blue-600">문의: 02-586-1230 | koist@koist.kr</p>\n</div>','\n',char(10)),1,0,'2025-03-18 09:00:00','2026-06-05 02:22:53');
CREATE TABLE progress_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    product_name TEXT NOT NULL,
    company TEXT,
    status TEXT DEFAULT 'in_progress',
    start_date TEXT,
    end_date TEXT,
    note TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
, assurance_level TEXT DEFAULT '', cert_type TEXT DEFAULT '최초평가', eval_type TEXT DEFAULT '국내평가');
INSERT INTO "progress_items" VALUES(6,'CC평가','NetSpliter V4.0','','평가진행',NULL,NULL,NULL,1,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(7,'CC평가','Chakra Max SAC v4.5','','평가완료',NULL,NULL,NULL,2,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(8,'CC평가','TESS TMS Plus V1.0','','평가완료',NULL,NULL,NULL,3,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(9,'CC평가','Alpha DBGuard V2.1','','평가완료',NULL,NULL,NULL,4,'2026-06-05 02:23:44','EAL1+','최초평가','국제평가');
INSERT INTO "progress_items" VALUES(10,'CC평가','Chakra Max v4.5','','평가완료',NULL,NULL,NULL,5,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(11,'CC평가','TESS AIRTMS V5.0','','평가완료',NULL,NULL,NULL,6,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(12,'CC평가','TA-PRS(Top Aegis Patch and Remediation System) V6.1','','평가완료',NULL,NULL,NULL,7,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(13,'CC평가','AxioVPN V2.0','','평가완료',NULL,NULL,NULL,8,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(14,'CC평가','LANKeeper V4.0','','평가완료',NULL,NULL,NULL,9,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(15,'CC평가','DBSAFER AM V7.0','','평가완료',NULL,NULL,NULL,10,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(16,'CC평가','ACRA Point V3','','평가완료',NULL,NULL,NULL,11,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(17,'CC평가','SpamSniper V6.2','','평가완료',NULL,NULL,NULL,12,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(18,'CC평가','DBSAFER Enterprise V5.0 R2','','평가완료',NULL,NULL,NULL,13,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(19,'CC평가','DBSAFER AM V5.0','','평가완료',NULL,NULL,NULL,14,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(20,'CC평가','WeGuardia™ ITM V1.0','','평가완료',NULL,NULL,NULL,15,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(21,'CC평가','PRIBIT Connect 2.0','','평가완료',NULL,NULL,NULL,16,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(22,'CC평가','ReceiveGUARD V1.1','','평가완료',NULL,NULL,NULL,17,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(23,'CC평가','Smart NAC V5.1.5','','평가완료',NULL,NULL,NULL,18,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(24,'CC평가','eWalker WAF V10','','평가완료',NULL,NULL,NULL,19,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(25,'CC평가','Zenius SIEM V2.0','','평가완료',NULL,NULL,NULL,20,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(26,'CC평가','TESS AIRTMS V4.0','','평가완료',NULL,NULL,NULL,21,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(27,'CC평가','TESS TAS V7.5','','평가완료',NULL,NULL,NULL,22,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(28,'CC평가','SKbroadhand SODA NGF v3.0','','평가완료',NULL,NULL,NULL,23,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(29,'CC평가','SECUI MF2 V4.7','','평가완료',NULL,NULL,NULL,24,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(30,'CC평가','DB-i V6.1','','평가완료',NULL,NULL,NULL,25,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(31,'CC평가','SNIPER TMS-Plus V4.1','','평가완료',NULL,NULL,NULL,26,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(32,'CC평가','SPiDER ExD V1.0','','평가완료',NULL,NULL,NULL,27,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(33,'CC평가','SNIPER NGFW V2.1','','평가완료',NULL,NULL,NULL,28,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(34,'CC평가','Chakra Max v4.0','','평가완료',NULL,NULL,NULL,29,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(35,'CC평가','Top Aegis Patch and Remediation System V5.1','','평가완료',NULL,NULL,NULL,30,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(36,'CC평가','Privacy-i V7.0','','평가완료',NULL,NULL,NULL,31,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(37,'CC평가','SECUI MA V1.6','','평가완료',NULL,NULL,NULL,32,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(38,'CC평가','ASM 5.0','','평가완료',NULL,NULL,NULL,33,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(39,'CC평가','NetSpliter V3.0','','평가완료',NULL,NULL,NULL,34,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(40,'CC평가','SNIPER APTX-T V5.1','','평가완료',NULL,NULL,NULL,35,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(41,'CC평가','ssBridge V5.0','','평가완료',NULL,NULL,NULL,36,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(42,'CC평가','SERVERFILTER V2.1','','평가완료',NULL,NULL,NULL,37,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(43,'CC평가','OfficeKeeper V4.1','','평가완료',NULL,NULL,NULL,38,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(44,'CC평가','TESS CTMX V2.0','','평가완료',NULL,NULL,NULL,39,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(45,'CC평가','DBSAFER OS V7.0 for AIX 7.2','','평가완료',NULL,NULL,NULL,40,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(46,'CC평가','DBSAFER Enterprise V7.0','','평가완료',NULL,NULL,NULL,41,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(47,'CC평가','DBSAFER OS V7.0 for Windows Server 2019','','평가완료',NULL,NULL,NULL,42,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(48,'CC평가','NexG ESM V1.2','','평가완료',NULL,NULL,NULL,43,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(49,'CC평가','LOG CATCH V2.0','','평가완료',NULL,NULL,NULL,44,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(50,'CC평가','TESS TAS V7.0','','평가완료',NULL,NULL,NULL,45,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(51,'CC평가','DBSAFER OS V7.0 for RHEL 7','','평가완료',NULL,NULL,NULL,46,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(52,'CC평가','BLUEMAX LMS V1.0','','평가완료',NULL,NULL,NULL,47,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(53,'CC평가','CODEMIND v3.6','','평가완료',NULL,NULL,NULL,48,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(54,'CC평가','SG-6000 FW V5.5','','평가접수',NULL,NULL,NULL,49,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(55,'CC평가','PCFILTER V3.0','','평가완료',NULL,NULL,NULL,50,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(56,'CC평가','알약 패치관리(PMS) 2.0','','평가완료',NULL,NULL,NULL,51,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(57,'CC평가','DB-i V6.0','','평가완료',NULL,NULL,NULL,52,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(58,'CC평가','WatchLog V12.0','','평가완료',NULL,NULL,NULL,53,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(59,'CC평가','AhnLab V3 Net for Windows Server 9.0 SP1','','평가완료',NULL,NULL,NULL,54,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(60,'CC평가','AhnLab EPP Patch Management 5.0','','평가완료',NULL,NULL,NULL,55,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(61,'CC평가','SecuwaySSL U V2.0','','평가완료',NULL,NULL,NULL,56,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(62,'CC평가','SNIPER ONE-i V3.1','','평가완료',NULL,NULL,NULL,57,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(63,'CC평가','IEUM V1.0','','평가완료',NULL,NULL,NULL,58,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(64,'CC평가','Smart NAC V5.5','','평가완료',NULL,NULL,NULL,59,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(65,'CC평가','Hancom xDB V2.8','','평가완료',NULL,NULL,NULL,60,'2026-06-05 02:23:44','EAL 1+','최초평가','국제평가');
INSERT INTO "progress_items" VALUES(66,'CC평가','TESS TAS V6.0','','평가완료',NULL,NULL,NULL,61,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(67,'CC평가','NEPYX NetworkBridge Suite V4','','평가완료',NULL,NULL,NULL,62,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(68,'CC평가','Cloud X V1.0','','평가완료',NULL,NULL,NULL,63,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(69,'CC평가','KT Wizbox v1.0','','평가완료',NULL,NULL,NULL,64,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(70,'CC평가','SNIPER TMS-Plus V4.0','','평가완료',NULL,NULL,NULL,65,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(71,'CC평가','GuardCom V1.1','','평가완료',NULL,NULL,NULL,66,'2026-06-05 02:23:44','EAL2','재평가','국내평가');
INSERT INTO "progress_items" VALUES(72,'CC평가','Blue X-ray DLP V2.0','','평가완료',NULL,NULL,NULL,67,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(73,'CC평가','VForce V4.6 R1','','평가완료',NULL,NULL,NULL,68,'2026-06-05 02:23:44','EAL4','재평가','국내평가');
INSERT INTO "progress_items" VALUES(74,'CC평가','SABER-VS V1.0','','평가완료',NULL,NULL,NULL,69,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(75,'CC평가','SecureGuard VPN V2.0','','평가완료',NULL,NULL,NULL,70,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(76,'CC평가','INFOSAFER V1.1','','평가완료',NULL,NULL,NULL,71,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(77,'CC평가','SecureGuard AM V8.0','','평가완료',NULL,NULL,NULL,72,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(78,'CC평가','SNIPER TMS-Plus V2.1','','평가완료',NULL,NULL,NULL,73,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(79,'CC평가','OfficeGuard V4.0','','평가완료',NULL,NULL,NULL,74,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(80,'CC평가','TESS TMS V6.0','','평가완료',NULL,NULL,NULL,75,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(81,'CC평가','SNIPER NGFW V2.0','','평가완료',NULL,NULL,NULL,76,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(82,'CC평가','SafePC Enterprise V5.1','','평가완료',NULL,NULL,NULL,77,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(83,'CC평가','BigEye V1.0','','평가완료',NULL,NULL,NULL,78,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(84,'CC평가','UTMP V3.0','','평가완료',NULL,NULL,NULL,79,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(85,'CC평가','ReceiveGUARD V1.0','','평가완료',NULL,NULL,NULL,80,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(86,'CC평가','SpamSniper V5.3.1','','평가완료',NULL,NULL,NULL,81,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(87,'CC평가','LOG-MON V1.0','','평가완료',NULL,NULL,NULL,82,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(88,'CC평가','SECUI SCAN V3.1','','평가완료',NULL,NULL,NULL,83,'2026-06-05 02:23:44','EAL2','재평가','국내평가');
INSERT INTO "progress_items" VALUES(89,'CC평가','BitSentry V1.0','','평가완료',NULL,NULL,NULL,84,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(90,'CC평가','ssBridge v4.1','','평가완료',NULL,NULL,NULL,85,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(91,'CC평가','Chakra Max V3.0','','평가완료',NULL,NULL,NULL,86,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(92,'CC평가','ASM 4.0','','평가완료',NULL,NULL,NULL,87,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(93,'CC평가','SafePC Enterprise V4.1','','평가완료',NULL,NULL,NULL,88,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(94,'CC평가','SPiDER TM V5.0 for AIX','','평가완료',NULL,NULL,NULL,89,'2026-06-05 02:23:44','EAL2','재평가','국내평가');
INSERT INTO "progress_items" VALUES(95,'CC평가','SNIPER TMS-Plus V3.0','','평가완료',NULL,NULL,NULL,90,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(96,'CC평가','NetSpliter V2.0','','평가완료',NULL,NULL,NULL,91,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(97,'CC평가','NexG ESM V1.1','','평가완료',NULL,NULL,NULL,92,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(98,'CC평가','알약 4.0 서버','','평가완료',NULL,NULL,NULL,93,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(99,'CC평가','알약 4.0','','평가완료',NULL,NULL,NULL,94,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(100,'CC평가','Server-i V3.0','','평가완료',NULL,NULL,NULL,95,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(101,'CC평가','WebKeeper V10.1','','평가완료',NULL,NULL,NULL,96,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(102,'CC평가','ACRA Point V2.4','','평가완료',NULL,NULL,NULL,97,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(103,'CC평가','SecuwaySSL U V1.0','','평가완료',NULL,NULL,NULL,98,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(104,'CC평가','Privacy-i V6.0','','평가완료',NULL,NULL,NULL,99,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(105,'CC평가','SPAMOUT V8.2','','평가완료',NULL,NULL,NULL,100,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(106,'CC평가','SNIPER ONE-d V3.0','','평가완료',NULL,NULL,NULL,101,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(107,'CC평가','netcruz Security Information Event Management nSIEM V1.0','','평가완료',NULL,NULL,NULL,102,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(108,'CC평가','알약3.5 and ALYac Security Manager 3.5','','평가완료',NULL,NULL,NULL,103,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(109,'CC평가','SNIPER ONE-i V3.0','','평가완료',NULL,NULL,NULL,104,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(110,'CC평가','eNMS V1.0','','평가완료',NULL,NULL,NULL,105,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(111,'CC평가','ssbridge V3.5','','평가완료',NULL,NULL,NULL,106,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(112,'CC평가','WeGuardia™ T-Mover V2.0','','평가완료',NULL,NULL,NULL,107,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(113,'CC평가','AhnLab TSM V2.2','','평가완료',NULL,NULL,NULL,108,'2026-06-05 02:23:44','EAL4','재평가','국내평가');
INSERT INTO "progress_items" VALUES(114,'CC평가','NexG FW V1.2','','평가완료',NULL,NULL,NULL,109,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(115,'CC평가','알약 3.5 Server','','평가완료',NULL,NULL,NULL,110,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(116,'CC평가','NEPYX FileBridge 3.0.0','','평가완료',NULL,NULL,NULL,111,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(117,'CC평가','SECUI MF2 V4.3','','평가완료',NULL,NULL,NULL,112,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(118,'CC평가','SEEKurity SIEM V1.0','','평가완료',NULL,NULL,NULL,113,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(119,'CC평가','nTreeV V1.0','','평가완료',NULL,NULL,NULL,114,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(120,'CC평가','Z-BLOCK V3.0.0','','평가완료',NULL,NULL,NULL,115,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(121,'CC평가','SNIPER APTX-T V4.0','','평가완료',NULL,NULL,NULL,116,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(122,'CC평가','APPLICATION INSIGHT SWG V2.0','','평가완료',NULL,NULL,NULL,117,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(123,'CC평가','AhnLab TSM V2.1','','평가완료',NULL,NULL,NULL,118,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(124,'CC평가','SPiDER TM V5.0','','평가완료',NULL,NULL,NULL,119,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(125,'CC평가','nProtect Enterprise V3.5','','평가완료',NULL,NULL,NULL,120,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(126,'CC평가','Mail-i V8.0 HyBoost','','평가완료',NULL,NULL,NULL,121,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(127,'CC평가','GuardCom V1.0','','평가완료',NULL,NULL,NULL,122,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(128,'CC평가','NexG ESM V1.0','','평가완료',NULL,NULL,NULL,123,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(129,'CC평가','Server-i V2.0 Hyboost','','평가완료',NULL,NULL,NULL,124,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(130,'CC평가','DB-i V3.3 HyBoost','','평가완료',NULL,NULL,NULL,125,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(131,'CC평가','ComVoy 2.2','','평가완료',NULL,NULL,NULL,126,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(132,'CC평가','VForce V4.6 R0','','평가완료',NULL,NULL,NULL,127,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(133,'CC평가','nProtect Anti-Virus/Spyware V4.0','','평가완료',NULL,NULL,NULL,128,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(134,'CC평가','EDGENAC V1.0','','평가완료',NULL,NULL,NULL,129,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(135,'CC평가','SpamSniper V5.1.0','','평가완료',NULL,NULL,NULL,130,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(136,'CC평가','SECUI SCAN V3.0','','평가완료',NULL,NULL,NULL,131,'2026-06-05 02:23:44','EAL2','재평가','국내평가');
INSERT INTO "progress_items" VALUES(137,'CC평가','SECUI MF2 V4.0','','평가완료',NULL,NULL,NULL,132,'2026-06-05 02:23:44','EAL4','재평가','국내평가');
INSERT INTO "progress_items" VALUES(138,'CC평가','FireGUARD™ Switch V1.0','','평가완료',NULL,NULL,NULL,133,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(139,'CC평가','VIPER-S V2.0','','평가완료',NULL,NULL,NULL,134,'2026-06-05 02:23:44','EAL3','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(140,'CC평가','NoAD V3.0','','평가완료',NULL,NULL,NULL,135,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(141,'CC평가','netcruz Log Manager LogSee V3.0','','평가완료',NULL,NULL,NULL,136,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(142,'CC평가','NetSpliter V1.0','','평가완료',NULL,NULL,NULL,137,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(143,'CC평가','DB-i V3.2','','평가완료',NULL,NULL,NULL,138,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(144,'CC평가','Privacy-i V5.0 HyBoost','','평가완료',NULL,NULL,NULL,139,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(145,'CC평가','AhnLab TSM V2.0','','평가완료',NULL,NULL,NULL,140,'2026-06-05 02:23:44','EAL2','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(146,'CC평가','Vforce V4.6','','평가완료',NULL,NULL,NULL,141,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(147,'CC평가','SECUI MFD V1.0','','평가완료',NULL,NULL,NULL,142,'2026-06-05 02:23:44','EAL4','최초평가','국내평가');
INSERT INTO "progress_items" VALUES(148,'보안기능시험','SubGATE V5.2 N','','시험접수',NULL,NULL,NULL,1,'2026-06-05 02:23:44','네트워크장비','기본시험','최초신청');
INSERT INTO "progress_items" VALUES(149,'보안기능시험','OS6870 Series_8.10.112.R02','','발급완료',NULL,NULL,NULL,2,'2026-06-05 02:23:44','네트워크장비','기본시험','최초신청');
INSERT INTO "progress_items" VALUES(150,'보안기능시험','OS6560/6560E Series_8.10.105.R02','','발급완료',NULL,NULL,NULL,3,'2026-06-05 02:23:44','네트워크장비','기본시험','최초신청');
INSERT INTO "progress_items" VALUES(151,'보안기능시험','OS9900 Series_8.10.106.R02','','발급완료',NULL,NULL,NULL,4,'2026-06-05 02:23:44','네트워크장비','기본시험','최초신청');
INSERT INTO "progress_items" VALUES(152,'보안기능시험','OS6900 Series_8.10.105.R02','','발급완료',NULL,NULL,NULL,5,'2026-06-05 02:23:44','네트워크장비','기본시험','최초신청');
INSERT INTO "progress_items" VALUES(153,'보안기능시험','SecureDesk v3.5','','발급완료',NULL,NULL,NULL,6,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(154,'보안기능시험','Privacy-i V8.0','','발급완료',NULL,NULL,NULL,7,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(155,'보안기능시험','TA-FDM V2.2','','발급완료',NULL,NULL,NULL,8,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(156,'보안기능시험','지오티_보안스위치_시리즈_V7.0.3','','발급완료',NULL,NULL,NULL,9,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(157,'보안기능시험','ETK-5000 Series (v2.dev-250928.23.2257)','','발급완료',NULL,NULL,NULL,10,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(158,'보안기능시험','NUC92B_Series_V100R006B07D002-r111','','발급완료',NULL,NULL,NULL,11,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(159,'보안기능시험','UBI SAFER-PSM V3.0','','발급완료',NULL,NULL,NULL,12,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(160,'보안기능시험','Red Hat OpenShift Virtualization Engine 4','','발급완료',NULL,NULL,NULL,13,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(161,'보안기능시험','Logsaver v4.0','','발급완료',NULL,NULL,NULL,14,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(162,'보안기능시험','NUC90A_Series_V1.6.7.3-r112','','발급완료',NULL,NULL,NULL,15,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(163,'보안기능시험','RUCKUS ICX 7850 Series Switch 10.0.10g_cd2_kcc','','발급완료',NULL,NULL,NULL,16,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(164,'보안기능시험','ARAD2000-48T (ANOS 2.1.6.2)','','발급완료',NULL,NULL,NULL,17,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(165,'보안기능시험','ARA1000-48T (ANOS 2.1.6.2)','','발급완료',NULL,NULL,NULL,18,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(166,'보안기능시험','RUCKUS ICX 8200 Series Switch 10.0.10g_cd2_kcc','','발급완료',NULL,NULL,NULL,19,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(167,'보안기능시험','CloudiA / SynergiA v1.0','','발급완료',NULL,NULL,NULL,20,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(168,'보안기능시험','SCP nuri stack Ver 1.0','','발급완료',NULL,NULL,NULL,21,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(169,'보안기능시험','RUCKUS ICX 7550 Series Switch 10.0.10g_cd1_kcc','','발급완료',NULL,NULL,NULL,22,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(170,'보안기능시험','VES-MG24B V1.0','','발급완료',NULL,NULL,NULL,23,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(171,'보안기능시험','FALCON AUTOMATION PLATFORM v2.16','','발급완료',NULL,NULL,NULL,24,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(172,'보안기능시험','SHIELDGate V2.0','','발급완료',NULL,NULL,NULL,25,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(173,'보안기능시험','실시간 암호화 보안제품 V1.1','','발급완료',NULL,NULL,NULL,26,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(174,'보안기능시험','SR Linux 24.10.1 for 7000 Series','','발급완료',NULL,NULL,NULL,27,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(175,'보안기능시험','TA-STR V2.1','','발급완료',NULL,NULL,NULL,28,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(176,'보안기능시험','OS6870 Series_8.10.112.R02 (2)','','발급완료',NULL,NULL,NULL,29,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(177,'보안기능시험','PacketGo ZTNA 3.0','','발급완료',NULL,NULL,NULL,30,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(178,'보안기능시험','F5 BIG-IP r5000 & r10000 제품군','','발급완료',NULL,NULL,NULL,31,'2026-06-05 02:23:44','네트워크장비','간소화 발급','변경·재승인');
INSERT INTO "progress_items" VALUES(179,'보안기능시험','TgateSDP V2.0','','발급완료',NULL,NULL,NULL,32,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(180,'보안기능시험','zenIE V2.0','','발급완료',NULL,NULL,NULL,33,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(181,'보안기능시험','ETK-4000B Series (v2.dev-241211.25.1980)','','발급완료',NULL,NULL,NULL,34,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(182,'보안기능시험','SaferZone USB V10','','발급완료',NULL,NULL,NULL,35,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','변경·재승인');
INSERT INTO "progress_items" VALUES(183,'보안기능시험','OS9900 Series_8.10.106.R02 (2)','','발급완료',NULL,NULL,NULL,36,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(184,'보안기능시험','Summit_arm-33.1.100.133 for Edge Series','','발급완료',NULL,NULL,NULL,37,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(185,'보안기능시험','onie-33.1.100.133 for Core Series','','발급완료',NULL,NULL,NULL,38,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(186,'보안기능시험','XGS2220 시리즈 ZyNOS V4.90 20240916-KR','','발급완료',NULL,NULL,NULL,39,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(187,'보안기능시험','OS6570M Series_8.10.102.R01','','발급완료',NULL,NULL,NULL,40,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(188,'보안기능시험','Privacy-i V7.0','','발급완료',NULL,NULL,NULL,41,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','변경·재승인');
INSERT INTO "progress_items" VALUES(189,'보안기능시험','UQ-KDS-100-A01','','발급완료',NULL,NULL,NULL,42,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(190,'보안기능시험','이노스마트플랫폼 v11 랜섬웨어탐지/차단보안솔루션','','발급완료',NULL,NULL,NULL,43,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(191,'보안기능시험','ATTO ACCESS v2.0','','발급완료',NULL,NULL,NULL,44,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(192,'보안기능시험','NetMarshal EPL1000 v1.0','','발급완료',NULL,NULL,NULL,45,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(193,'보안기능시험','INFOSAFER V5.0','','발급완료',NULL,NULL,NULL,46,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(194,'보안기능시험','NHM-2408 Series for 3.14.1.1-S','','발급완료',NULL,NULL,NULL,47,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(195,'보안기능시험','Alteon U22 series (standalone) - 34.0.4.0','','발급완료',NULL,NULL,NULL,48,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(196,'보안기능시험','ETK-5000B Series (v2.dev-240422.23.1696)','','발급완료',NULL,NULL,NULL,49,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(197,'보안기능시험','TnD-MIBS v2.0','','발급완료',NULL,NULL,NULL,50,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(198,'보안기능시험','Q Care Connect-N N1000 v1.0.0','','발급완료',NULL,NULL,NULL,51,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(199,'보안기능시험','TiMOS-24.3.R1 for 7x50 Series','','발급완료',NULL,NULL,NULL,52,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(200,'보안기능시험','OS9900 Series_8.9.91.R04','','발급완료',NULL,NULL,NULL,53,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(201,'보안기능시험','U-PRIVACY SAFER V4.0','','발급완료',NULL,NULL,NULL,54,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(202,'보안기능시험','Hancome xDB V2.8','','발급완료',NULL,NULL,NULL,55,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(203,'보안기능시험','SecureGate CDS V1.0','','발급완료',NULL,NULL,NULL,56,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(204,'보안기능시험','Alteon DPDK series (standalone) - 34.0.3.0','','발급완료',NULL,NULL,NULL,57,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(205,'보안기능시험','CLOUD& v2.5','','발급완료',NULL,NULL,NULL,58,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(206,'보안기능시험','VDeX for Virtualization V1.0','','발급완료',NULL,NULL,NULL,59,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(207,'보안기능시험','OS6560 Series','','발급완료',NULL,NULL,NULL,60,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(208,'보안기능시험','SafeCon V3.0','','발급완료',NULL,NULL,NULL,61,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(209,'보안기능시험','F5 BIGIP r5000 & r10000 제품군','','발급완료',NULL,NULL,NULL,62,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(210,'보안기능시험','F5 BIGIP r2000 & r4000 제품군','','발급완료',NULL,NULL,NULL,63,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(211,'보안기능시험','nNetTrust V2.0','','발급완료',NULL,NULL,NULL,64,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(212,'보안기능시험','OS9900 Series','','발급완료',NULL,NULL,NULL,65,'2026-06-05 02:23:44','네트워크장비','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(213,'보안기능시험','ssBridge V5.0','','발급완료',NULL,NULL,NULL,66,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(214,'보안기능시험','SafePC Enterprise V7.0','','발급완료',NULL,NULL,NULL,67,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(215,'보안기능시험','TgateSDP V2.0 (2)','','발급완료',NULL,NULL,NULL,68,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(216,'보안기능시험','IEUM V2.0','','발급완료',NULL,NULL,NULL,69,'2026-06-05 02:23:44','정보보호시스템','간소화 발급','최초신청');
INSERT INTO "progress_items" VALUES(217,'암호모듈검증','AlphaCrypto V1.0','(주)알파비트','발급완료',NULL,NULL,NULL,1,'2026-06-05 02:23:44','1','소프트웨어','');
INSERT INTO "progress_items" VALUES(218,'성능평가','Fortify Enterprise v3.1 (Linux)','(주)하로스','발급완료','2022-12-22',NULL,NULL,1,'2026-06-05 02:23:44','소스코드 보안약점 분석도구','-','(주)하로스');
INSERT INTO "progress_items" VALUES(219,'성능평가','Fortify Enterprise v3.1 (Windows)','(주)하로스','발급완료','2022-12-22',NULL,NULL,2,'2026-06-05 02:23:44','소스코드 보안약점 분석도구','-','(주)하로스');
INSERT INTO "progress_items" VALUES(220,'성능평가','AhnLab V3 Net for Linux Server 3.6 (Linux)','(주)안랩','발급완료','2022-12-16',NULL,NULL,3,'2026-06-05 02:23:44','안티바이러스제품(Linux)','-','(주)안랩');
INSERT INTO "progress_items" VALUES(221,'성능평가','OnAV v1.0 (Andriod)','(주)시큐리온','발급완료','2022-12-12',NULL,NULL,4,'2026-06-05 02:23:44','안티바이러스 제품 (Mobile)','-','(주)시큐리온');
INSERT INTO "progress_items" VALUES(222,'성능평가','SecuwaySSL U V2.0','(주)시큐위즈','발급완료','2021-05-26',NULL,NULL,5,'2026-06-05 02:23:44','SSL VPN','U3000S','(주)시큐위즈');
INSERT INTO "progress_items" VALUES(223,'성능평가','ViRobot SDK 1.5 (Windows)','(주)하우리','발급완료','2021-08-25',NULL,NULL,6,'2026-06-05 02:23:44','모듈형 안티바이러스 제품','-','(주)하우리');
CREATE TABLE downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size INTEGER DEFAULT 0,
    category TEXT DEFAULT 'general',
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "downloads" VALUES(1,'정보보호 준비도 평가 신청서','정보보호 준비도 평가를 위한 신청서 양식입니다.','#','준비도평가_신청서.hwp',0,'form',0,'2016-04-12 09:00:00');
INSERT INTO "downloads" VALUES(2,'정보보호 준비도 평가, 자가진단 점검표','정보보호 준비도 평가를 위한 자가진단 점검표입니다.','#','준비도평가_자가진단점검표.hwp',0,'form',0,'2016-04-12 09:00:00');
INSERT INTO "downloads" VALUES(3,'(CCEA) 수습평가자 자격시험 공고문 (2016.01)','CC평가 수습평가자 자격시험 관련 공고문입니다.','#','CCEA_수습평가자시험_공고문_201601.hwp',0,'education',0,'2016-01-05 09:00:00');
INSERT INTO "downloads" VALUES(4,'(CCEA) 수습평가자 자격시험 공고문 (2015.05)','CC평가 수습평가자 자격시험 관련 공고문입니다.','#','CCEA_수습평가자시험_공고문_201505.hwp',0,'education',0,'2015-05-12 09:00:00');
INSERT INTO "downloads" VALUES(5,'(CCEA) 정보보호제품 평가인증교육 공고문 (2016년 1차)','정보보호제품 평가·인증 교육공고(2016년 1차)입니다. 공고문 및 교육장약도 포함.','#','CCEA_평가인증교육_16년_1차_공고문.hwp',39500,'education',0,'2015-11-30 09:00:00');
INSERT INTO "downloads" VALUES(6,'소프트웨어 검증시험 신청서, 신청자 제시 규격 및 기준확인서','소프트웨어 검증시험 신청 시, 신청서 작성과 함께 규격 및 기준확인서를 준비하여 주시기 바랍니다. 시험이 필요한 시험항목(정량적 지표)에 대한 정의(목적, 방법, 시험 방향, 기준 등)를 포함합니다.','#','QP-10-01_소프트웨어시험_신청서.hwp',14000,'form',0,'2016-04-15 09:00:00');
INSERT INTO "downloads" VALUES(7,'정보보호 준비도 평가, 자가진단 점검표 (상세)','정보보호 준비도 평가를 위한 자가진단 점검표 상세 버전입니다.','#','준비도평가_자가진단점검표_상세.hwp',0,'form',0,'2016-04-12 10:00:00');
INSERT INTO "downloads" VALUES(8,'(CCEA) 2016년 제2회 정보보호제품 평가인증교육 공고문','CC평가 수습평가자 양성을 위한 2016년 제2회 정보보호제품 평가인증교육 공고문입니다.','#','CCEA_평가인증교육_16년_2차_공고문.hwp',0,'education',0,'2016-06-13 09:00:00');
INSERT INTO "downloads" VALUES(9,'(CCEA) 2017년 제1회 정보보호제품 평가인증교육 취소 안내','예정되어 있던 2017년 제1회 정보보호제품 평가인증교육이 신청자 미달로 인해 불가피하게 취소 되었습니다.','#','',0,'education',0,'2016-12-06 09:00:00');
INSERT INTO "downloads" VALUES(10,'(CCEA) 2017년 제2회 정보보호제품 평가인증교육 공고문','2017년 제2회 정보보호제품 평가인증교육 공고문입니다. 공고문 및 교육장약도 포함.','#','CCEA_평가인증교육_17년_2차_공고문.hwp',18500,'education',0,'2017-06-19 09:00:00');
INSERT INTO "downloads" VALUES(11,'평가 서비스 고객 만족도 설문조사 서식','한국정보보안기술원의 평가 서비스에 대한 고객 만족도 설문조사 양식입니다.','#','고객만족도_설문조사서식.hwp',0,'form',0,'2019-02-22 09:00:00');
INSERT INTO "downloads" VALUES(12,'개인정보 수집이용 및 제3자 제공 동의서','평가 서비스 신청 시 필요한 개인정보 수집·이용 및 제3자 제공 동의서 양식입니다.','#','개인정보_수집이용_동의서.hwp',0,'form',0,'2019-02-22 10:00:00');
INSERT INTO "downloads" VALUES(13,'정보보호제품 성능평가 신청서','정보보호제품 성능평가 신청 시, 신청서 작성과 함께 다음의 제출물을 준비하여 주시길 바랍니다: 1. 성능평가 신청서 2. 제품설명서 3. 사용자 취급설명서 4. 성능평가 신청 제품. 평가 준비 및 성능평가와 관련하여 문의사항이 있으시면 언제든지 편하게 연락주시길 바랍니다.','#','성능평가_신청서.hwp',0,'form',0,'2019-02-13 09:00:00');
INSERT INTO "downloads" VALUES(14,'[CC평가] 공통평가기준 (CC v3.1 R2) - 한글','공통평가기준(CC V3.1 R2) 한글판입니다. 1부, 2부, 3부 및 공통평가방법론(CEM V3.1 R2) 한글판이 포함되어 있습니다.','#','공통평가기준_CC_v3.1_R2_한글.zip',4300000,'cc-standard',0,'2021-06-11 09:00:00');
INSERT INTO "downloads" VALUES(15,'[CC평가] 공통평가기준 (CC v3.1 R5) - 한글','공통평가기준(CC V3.1 R5) 한글판입니다. 1부, 2부, 3부 및 공통평가방법론(CEM V3.1 R5) 한글판이 포함되어 있습니다.','#','CC_CEM_V3.1_R5_한글.zip',4600000,'cc-standard',0,'2021-06-11 10:00:00');
INSERT INTO "downloads" VALUES(16,'(주)한국정보보안기술원 이력서 양식','한국정보보안기술원 채용 지원을 위한 이력서 양식입니다.','#','한국정보보안기술원_이력서양식.hwp',96000,'form',0,'2022-12-16 09:00:00');
INSERT INTO "downloads" VALUES(17,'(CCEA) 정보보호제품 평가인증교육 공고문 (2015년 1차)','한국CC평가협회(CCEA) 주관 2015년도 제1차 정보보호제품 평가인증교육 공고문','#','ccea_education_2015_1.hwp',0,'education',0,'2015-11-30');
INSERT INTO "downloads" VALUES(18,'(CCEA) 수습평가자 자격시험 공고문 (2015.05 1차)','한국CC평가협회(CCEA) 주관 2015년 5월 수습평가자 자격시험 공고 (제1차)','#','ccea_exam_2015_05.hwp',0,'education',0,'2015-05-12');
INSERT INTO "downloads" VALUES(19,'(CCEA) 정보보호제품 평가인증교육 공고문 (2014년)','한국CC평가협회(CCEA) 주관 2014년도 정보보호제품 평가인증교육 공고문','#','ccea_education_2014.hwp',0,'education',0,'2014-11-25');
CREATE TABLE faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "faqs" VALUES(1,'CC평가란 무엇인가요?','<p>CC(Common Criteria) 인증평가는 IT 보안제품의 보안기능과 보증수단이 정의된 요구사항을 만족하는지 제3의 독립 평가기관이 평가하고, 인증기관이 인증하는 국제 표준(ISO/IEC 15408) 기반 제도입니다.</p>','general',1,1,'2026-06-05 02:23:28');
INSERT INTO "faqs" VALUES(2,'CC평가 비용은 얼마인가요?','<p>CC평가 비용은 제품의 보안등급(EAL), 제품 유형, 평가 범위 등에 따라 달라집니다. 정확한 비용은 사전 상담을 통해 안내받으실 수 있습니다. 문의: 02-586-1230</p>','general',2,1,'2026-06-05 02:23:28');
INSERT INTO "faqs" VALUES(3,'CC평가 기간은 얼마나 걸리나요?','<p>일반적으로 CC평가는 EAL2 기준 약 6~12개월이 소요됩니다. 제품의 준비 상태와 평가 등급에 따라 기간이 달라질 수 있습니다.</p>','general',3,1,'2026-06-05 02:23:28');
INSERT INTO "faqs" VALUES(4,'KCMVP 검증시험이란 무엇인가요?','<p>KCMVP(Korea Cryptographic Module Validation Program)는 국가·공공기관 정보통신망에서 소통되는 자료 중 비밀로 분류되지 않은 중요 정보를 보호하기 위해 사용되는 암호모듈의 안전성과 구현 적합성을 검증하는 제도입니다.</p>','general',4,1,'2026-06-05 02:23:28');
INSERT INTO "faqs" VALUES(5,'평가 신청은 어떻게 하나요?','<p>전화(02-586-1230) 또는 이메일(koist@koist.kr)로 사전 상담을 받으신 후, 평가 신청서를 작성하여 제출하시면 됩니다.</p>','general',5,1,'2026-06-05 02:23:28');
CREATE TABLE inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    admin_reply TEXT,
    replied_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
, consent_personal_info INTEGER DEFAULT 0, consent_at TEXT, deleted_at DATETIME, deleted_by TEXT);
CREATE TABLE about_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "about_pages" VALUES(1,'인사말','greeting',replace('<div class="about-greeting">\n    <div class="flex flex-col md:flex-row gap-8 items-start mb-8">\n      <div class="flex-1">\n        <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">\n          <i class="fas fa-handshake"></i> CEO 인사말\n        </div>\n        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6" style="line-height:1.4;">\n          정보보안의 <span class="text-blue-600">신뢰할 수 있는 파트너</span>,<br>\n          한국정보보안기술원입니다.\n        </h2>\n        <div class="space-y-4 text-gray-600 leading-relaxed">\n          <p>한국정보보안기술원(KOIST)을 방문해 주셔서 진심으로 감사드립니다.</p>\n          <p>저희 KOIST는 <strong class="text-gray-800">정보보호 제품의 시험·평가·인증 전문기관</strong>으로서, 국내 최고 수준의 평가 인력과 시험 환경을 갖추고 국가 정보보호 역량 강화에 기여하고 있습니다.</p>\n          <p>IT 보안제품의 보안성과 성능을 <strong class="text-gray-800">객관적이고 공정하게</strong> 평가하여 국내 정보보호 산업 발전에 기여하고 있으며, CC평가, 보안기능 시험, 암호모듈 검증(KCMVP), 성능평가 등 다양한 분야에서 전문 서비스를 제공합니다.</p>\n          <p>앞으로도 <strong class="text-gray-800">최상의 시험·인증 서비스</strong>를 제공하여 고객 여러분의 성공적인 인증 획득을 지원하겠습니다.</p>\n          <p>감사합니다.</p>\n        </div>\n        <div class="mt-8 pt-6 border-t border-gray-200">\n          <p class="text-lg font-bold text-gray-900">(주)한국정보보안기술원</p>\n          <p class="text-gray-500 text-sm mt-1">임직원 일동</p>\n        </div>\n      </div>\n    </div>\n\n    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">\n      <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">\n        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">\n          <i class="fas fa-shield-halved text-blue-600"></i>\n        </div>\n        <h4 class="font-bold text-gray-800 mb-1">공정한 평가</h4>\n        <p class="text-sm text-gray-500">국제 표준에 부합하는 객관적이고 공정한 시험·평가 서비스</p>\n      </div>\n      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">\n        <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">\n          <i class="fas fa-users text-purple-600"></i>\n        </div>\n        <h4 class="font-bold text-gray-800 mb-1">전문 인력</h4>\n        <p class="text-sm text-gray-500">최고 수준의 보안 평가 전문 인력과 시험 인프라 보유</p>\n      </div>\n      <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">\n        <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">\n          <i class="fas fa-rocket text-emerald-600"></i>\n        </div>\n        <h4 class="font-bold text-gray-800 mb-1">원스톱 서비스</h4>\n        <p class="text-sm text-gray-500">사전 컨설팅부터 인증 취득까지 원스톱 지원 체계</p>\n      </div>\n    </div>\n  </div>','\n',char(10)),1,'2026-06-05 02:22:52','2026-06-05 02:22:52');
INSERT INTO "about_pages" VALUES(2,'연혁','history',replace('<div class="about-history">\n    <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">\n      <i class="fas fa-clock-rotate-left"></i> KOIST 연혁\n    </div>\n    <h2 class="text-2xl font-bold text-gray-900 mb-3">한국정보보안기술원의 <span class="text-blue-600">발자취</span></h2>\n    <p class="text-gray-500 text-sm mb-8">최고의 서비스를 위한 도전, 한국정보보안기술원이 걸어온 길</p>\n\n    <div class="relative pl-8 border-l-2 border-blue-200 space-y-8">\n      <!-- 2025 (기존 유지) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100"></div>\n        <div class="bg-blue-50 rounded-xl p-5 border border-blue-100">\n          <span class="text-blue-600 font-black text-lg">2025</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-blue-500 text-xs"></i> 암호모듈 검증시험(KCMVP) 민간 시험기관 지정</li>\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-blue-500 text-xs"></i> 정보보호 컨설팅 사업 확대</li>\n          </ul>\n        </div>\n      </div>\n\n      <!-- 2022 (원본 추가) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-indigo-500 border-4 border-indigo-100"></div>\n        <div class="bg-indigo-50 rounded-xl p-5 border border-indigo-100">\n          <span class="text-indigo-600 font-black text-lg">2022</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-indigo-500 text-xs"></i> 벤처기업인증</li>\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-indigo-500 text-xs"></i> 신속확인제 발급 기관 지정</li>\n          </ul>\n        </div>\n      </div>\n\n      <!-- 2021 (원본 추가) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-sky-500 border-4 border-sky-100"></div>\n        <div class="bg-sky-50 rounded-xl p-5 border border-sky-100">\n          <span class="text-sky-600 font-black text-lg">2021</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-sky-500 text-xs"></i> 보안기능 시험 간소화 기관 지정</li>\n          </ul>\n        </div>\n      </div>\n\n      <!-- 2020 (기존 유지) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-cyan-500 border-4 border-cyan-100"></div>\n        <div class="bg-cyan-50 rounded-xl p-5 border border-cyan-100">\n          <span class="text-cyan-600 font-black text-lg">2020</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-cyan-500 text-xs"></i> 보안기능 시험 업무 개시</li>\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-cyan-500 text-xs"></i> 성능평가 시험 업무 확대</li>\n          </ul>\n        </div>\n      </div>\n\n      <!-- 2018 (원본 추가) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-teal-500 border-4 border-teal-100"></div>\n        <div class="bg-teal-50 rounded-xl p-5 border border-teal-100">\n          <span class="text-teal-600 font-black text-lg">2018</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-teal-500 text-xs"></i> 정보보호제품 성능평가기관 승인</li>\n          </ul>\n        </div>\n      </div>\n\n      <!-- 2016 (원본 추가) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-purple-500 border-4 border-purple-100"></div>\n        <div class="bg-purple-50 rounded-xl p-5 border border-purple-100">\n          <span class="text-purple-600 font-black text-lg">2016</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-purple-500 text-xs"></i> 정보보호 준비도 평가기관 승인</li>\n          </ul>\n        </div>\n      </div>\n\n      <!-- 2014 (원본 추가) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-amber-500 border-4 border-amber-100"></div>\n        <div class="bg-amber-50 rounded-xl p-5 border border-amber-100">\n          <span class="text-amber-600 font-black text-lg">2014</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-500 text-xs"></i> 국제공인시험기관 인정(KOLAS)</li>\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-amber-500 text-xs"></i> 정보보호제품 평가기관 승인</li>\n          </ul>\n        </div>\n      </div>\n\n      <!-- 2013 (원본 추가) -->\n      <div class="relative">\n        <div class="absolute -left-[2.55rem] w-5 h-5 rounded-full bg-emerald-500 border-4 border-emerald-100"></div>\n        <div class="bg-emerald-50 rounded-xl p-5 border border-emerald-100">\n          <span class="text-emerald-600 font-black text-lg">2013</span>\n          <ul class="mt-2 space-y-1 text-gray-700 text-sm font-semibold">\n            <li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-500 text-xs"></i> <strong>㈜한국정보보안기술원 설립</strong></li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  </div>','\n',char(10)),2,'2026-06-05 02:22:52','2026-06-05 02:22:52');
INSERT INTO "about_pages" VALUES(3,'사업소개','business',replace('<div class="about-business">\n    <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">\n      <i class="fas fa-briefcase"></i> 사업소개\n    </div>\n    <h2 class="text-2xl font-bold text-gray-900 mb-4">정보보호 분야의 <span class="text-blue-600">종합 시험·평가·인증</span> 서비스</h2>\n    <p class="text-gray-500 mb-8 max-w-2xl">KOIST는 정보보안 시험·인증의 모든 분야를 전문적으로 수행하는 종합 평가기관입니다.</p>\n\n    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">\n      <div class="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-xl border border-blue-200/50 hover:shadow-md transition-shadow">\n        <div class="flex items-center gap-3 mb-3">\n          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><i class="fas fa-shield-halved text-blue-600"></i></div>\n          <h3 class="font-bold text-gray-800 text-lg">CC평가</h3>\n        </div>\n        <p class="text-sm text-gray-600">국제공통평가기준(CC)에 따른 IT 보안제품의 보안성을 평가하여 국제적으로 인정받는 인증을 취득하는 서비스입니다. EAL2~EAL4 등급의 평가를 수행합니다.</p>\n      </div>\n      <div class="bg-gradient-to-br from-purple-50 to-purple-100/30 p-6 rounded-xl border border-purple-200/50 hover:shadow-md transition-shadow">\n        <div class="flex items-center gap-3 mb-3">\n          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><i class="fas fa-file-shield text-purple-600"></i></div>\n          <h3 class="font-bold text-gray-800 text-lg">보안기능 시험</h3>\n        </div>\n        <p class="text-sm text-gray-600">정보보호제품의 보안기능을 시험하여 공공기관 도입을 위한 객관적인 제품 검증을 제공합니다. 국가정보원 보안적합성 검증 지원 시험을 수행합니다.</p>\n      </div>\n      <div class="bg-gradient-to-br from-pink-50 to-pink-100/30 p-6 rounded-xl border border-pink-200/50 hover:shadow-md transition-shadow">\n        <div class="flex items-center gap-3 mb-3">\n          <div class="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center"><i class="fas fa-lock text-pink-600"></i></div>\n          <h3 class="font-bold text-gray-800 text-lg">암호모듈 검증(KCMVP)</h3>\n        </div>\n        <p class="text-sm text-gray-600">국가정보원이 시행하는 암호모듈 검증제도(KCMVP)에 따라 암호모듈의 안전성과 구현 적합성을 시험하는 민간 시험기관 서비스입니다.</p>\n      </div>\n      <div class="bg-gradient-to-br from-amber-50 to-amber-100/30 p-6 rounded-xl border border-amber-200/50 hover:shadow-md transition-shadow">\n        <div class="flex items-center gap-3 mb-3">\n          <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><i class="fas fa-gauge-high text-amber-600"></i></div>\n          <h3 class="font-bold text-gray-800 text-lg">성능평가</h3>\n        </div>\n        <p class="text-sm text-gray-600">기준에 따른 정보보호제품의 성능을 객관적으로 검증하는 평가 서비스입니다. R&D 지원시험, AI 성능시험, 대외 성능시험 등을 수행합니다.</p>\n      </div>\n    </div>\n\n    <div class="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">\n      <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-list-check text-blue-500"></i> 추가 서비스</h3>\n      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">\n        <div class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-file-signature text-teal-500"></i> 시험성적서 발급</div>\n        <div class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-search text-red-500"></i> 정보보안진단</div>\n        <div class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-comments text-indigo-500"></i> 보안 컨설팅</div>\n        <div class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-building text-emerald-500"></i> 산업(기업)보안 컨설팅</div>\n        <div class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-clipboard-check text-cyan-500"></i> 정보보호준비도 평가</div>\n        <div class="flex items-center gap-2 text-sm text-gray-600"><i class="fas fa-bullseye text-orange-500"></i> 모의평가</div>\n      </div>\n    </div>\n  </div>','\n',char(10)),3,'2026-06-05 02:22:52','2026-06-05 02:22:52');
INSERT INTO "about_pages" VALUES(4,'오시는길','location',replace('<div class="about-location">\n    <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">\n      <i class="fas fa-location-dot"></i> 오시는길\n    </div>\n    <h2 class="text-2xl font-bold text-gray-900 mb-8">한국정보보안기술원 <span class="text-blue-600">찾아오시는길</span></h2>\n\n    <!-- 지도 영역 (Google Maps Embed - 무료, API 키 불필요) -->\n    <div class="rounded-xl overflow-hidden border border-gray-200 mb-4" style="box-shadow: 0 4px 20px rgba(0,0,0,0.08);">\n      <iframe\n        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1583.0!2d127.0163!3d37.4844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca159a78efb13%3A0x0!2z7ISc7Jq47Yq567OE7IucIOyEnOy0iOq1rCDtmKjroLnroZwgMzM2!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr"\n        width="100%"\n        height="420"\n        style="border:0;"\n        allowfullscreen=""\n        loading="lazy"\n        referrerpolicy="no-referrer-when-downgrade">\n      </iframe>\n    </div>\n\n    <!-- 네비게이션 버튼 -->\n    <div class="flex flex-wrap gap-2 mb-8">\n      <a href="https://map.kakao.com/link/to/한국정보보안기술원,37.4844,127.0163" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors shadow-sm">\n        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.5 3 2 6.58 2 11c0 2.83 1.82 5.32 4.56 6.73l-.96 3.57c-.05.19.02.4.18.51.09.07.2.11.31.11.08 0 .17-.02.24-.07L10.44 19c.51.06 1.03.1 1.56.1 5.5 0 10-3.58 10-8S17.5 3 12 3z"/></svg>\n        카카오맵 길찾기\n      </a>\n      <a href="https://map.naver.com/v5/search/서울특별시 서초구 효령로 336" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors shadow-sm">\n        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>\n        네이버지도\n      </a>\n      <a href="https://www.google.com/maps/search/서울특별시+서초구+효령로+336" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors shadow-sm border border-gray-200">\n        <i class="fab fa-google text-blue-500"></i>\n        Google Maps\n      </a>\n    </div>\n\n    <!-- 연락처 정보 카드 -->\n    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\n      <!-- 주소 정보 -->\n      <div class="bg-white rounded-xl p-6 border border-gray-100" style="box-shadow: 0 2px 12px rgba(0,0,0,0.04);">\n        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">\n          <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><i class="fas fa-building text-blue-600 text-sm"></i></div>\n          회사 정보\n        </h3>\n        <div class="space-y-4">\n          <div class="flex items-start gap-3">\n            <i class="fas fa-location-dot text-blue-500 mt-1 w-4 text-center"></i>\n            <div>\n              <div class="text-sm font-medium text-gray-800">주소</div>\n              <div class="text-sm text-gray-500">서울특별시 서초구 효령로 336 윤일빌딩 4층<br>한국정보보안기술원(KOIST)</div>\n              <div class="text-xs text-gray-400 mt-1">(우) 06720</div>\n            </div>\n          </div>\n          <div class="flex items-start gap-3">\n            <i class="fas fa-phone text-emerald-500 mt-1 w-4 text-center"></i>\n            <div>\n              <div class="text-sm font-medium text-gray-800">대표전화</div>\n              <a href="tel:02-586-1230" class="text-sm text-blue-600 hover:underline">02-586-1230</a>\n            </div>\n          </div>\n          <div class="flex items-start gap-3">\n            <i class="fas fa-fax text-purple-500 mt-1 w-4 text-center"></i>\n            <div>\n              <div class="text-sm font-medium text-gray-800">팩스</div>\n              <div class="text-sm text-gray-500">02-586-1238</div>\n            </div>\n          </div>\n          <div class="flex items-start gap-3">\n            <i class="fas fa-envelope text-cyan-500 mt-1 w-4 text-center"></i>\n            <div>\n              <div class="text-sm font-medium text-gray-800">이메일</div>\n              <a href="mailto:koist@koist.kr" class="text-sm text-blue-600 hover:underline">koist@koist.kr</a>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- 교통편 안내 -->\n      <div class="bg-white rounded-xl p-6 border border-gray-100" style="box-shadow: 0 2px 12px rgba(0,0,0,0.04);">\n        <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">\n          <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><i class="fas fa-route text-emerald-600 text-sm"></i></div>\n          교통편 안내\n        </h3>\n        <div class="space-y-4">\n          <div class="flex items-start gap-3">\n            <div class="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>\n            <div>\n              <div class="text-sm font-medium text-gray-800">지하철 3호선</div>\n              <div class="text-sm text-gray-500"><strong>남부터미널역</strong> 3번 출구<br>도보 약 5분</div>\n            </div>\n          </div>\n          <div class="flex items-start gap-3">\n            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>\n            <div>\n              <div class="text-sm font-medium text-gray-800">지하철 2호선·3호선</div>\n              <div class="text-sm text-gray-500"><strong>교대역</strong> 14번 출구<br>도보 약 10분</div>\n            </div>\n          </div>\n          <div class="flex items-start gap-3">\n            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"><i class="fas fa-bus text-xs"></i></div>\n            <div>\n              <div class="text-sm font-medium text-gray-800">버스</div>\n              <div class="text-sm text-gray-500">남부터미널역 3번 출구에서 버스로 2분<br>정류장: 국제전자센터 ↔ 서일초등학교<br><span class="text-xs text-blue-500">지선 4319, 지선 서초08 외</span></div>\n            </div>\n          </div>\n          <div class="flex items-start gap-3">\n            <div class="w-6 h-6 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"><i class="fas fa-car text-xs"></i></div>\n            <div>\n              <div class="text-sm font-medium text-gray-800">자가용</div>\n              <div class="text-sm text-gray-500">윤일빌딩 지하 주차장 이용 가능<br>방문 시 사전 연락 부탁드립니다</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <!-- 운영시간 안내 -->\n    <div class="mt-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-200">\n      <div class="flex flex-wrap items-center justify-between gap-4">\n        <div class="flex items-center gap-3">\n          <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><i class="fas fa-clock text-blue-600 text-sm"></i></div>\n          <div>\n            <div class="text-sm font-bold text-gray-800">업무시간</div>\n            <div class="text-sm text-gray-500">평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)</div>\n          </div>\n        </div>\n        <div class="flex items-center gap-2 text-sm text-red-500 font-medium">\n          <i class="fas fa-calendar-xmark"></i> 주말·공휴일 휴무\n        </div>\n      </div>\n    </div>\n  </div>','\n',char(10)),4,'2026-06-05 02:22:52','2026-06-05 02:22:52');
CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    r2_key TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    width INTEGER DEFAULT 0,
    height INTEGER DEFAULT 0,
    category TEXT DEFAULT 'general',
    alt_text TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sim_cert_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,                    
    slug TEXT UNIQUE NOT NULL,             
    icon TEXT DEFAULT 'fa-shield-halved',  
    color TEXT DEFAULT '#3B82F6',          
    
    traditional_min_weeks INTEGER DEFAULT 12,  
    traditional_max_weeks INTEGER DEFAULT 28,  
    
    koist_min_weeks INTEGER DEFAULT 7,         
    koist_max_weeks INTEGER DEFAULT 20,        
    
    description TEXT,                      
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "sim_cert_types" VALUES(1,'CC평가 (EAL2)','cc-eal2','fa-shield-halved','#3B82F6',20,36,10,22,'IT 보안제품 국제표준 CC 인증 (보증등급 EAL2)',1,1,'2026-06-05 02:22:50','2026-06-05 02:22:50');
INSERT INTO "sim_cert_types" VALUES(2,'CC평가 (EAL3)','cc-eal3','fa-shield-halved','#6366F1',28,48,14,30,'IT 보안제품 국제표준 CC 인증 (보증등급 EAL3)',2,1,'2026-06-05 02:22:50','2026-06-05 02:22:50');
INSERT INTO "sim_cert_types" VALUES(3,'CC평가 (EAL4)','cc-eal4','fa-shield-halved','#8B5CF6',36,64,18,40,'IT 보안제품 국제표준 CC 인증 (보증등급 EAL4)',3,1,'2026-06-05 02:22:50','2026-06-05 02:22:50');
INSERT INTO "sim_cert_types" VALUES(4,'KCMVP','kcmvp','fa-lock','#EC4899',14,28,8,16,'암호모듈 검증시험 (KCMVP)',4,1,'2026-06-05 02:22:50','2026-06-05 02:22:50');
INSERT INTO "sim_cert_types" VALUES(5,'보안기능확인서','security-cert','fa-file-shield','#10B981',8,16,4,10,'보안기능 확인서 발급 시험',5,1,'2026-06-05 02:22:50','2026-06-05 02:22:50');
INSERT INTO "sim_cert_types" VALUES(6,'성능평가','performance','fa-gauge-high','#F59E0B',8,20,4,12,'정보보호제품 성능 평가',6,1,'2026-06-05 02:22:50','2026-06-05 02:22:50');
CREATE TABLE admin_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_username TEXT NOT NULL,
  action TEXT NOT NULL,           
  resource TEXT NOT NULL,         
  ip_address TEXT,
  user_agent TEXT,
  details TEXT,                   
  status TEXT DEFAULT 'success',  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE backup_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  backup_type TEXT NOT NULL,           
  file_key TEXT NOT NULL,              
  file_size INTEGER NOT NULL,
  file_sha256 TEXT,                    
  row_counts TEXT,                     
  table_count INTEGER DEFAULT 0,
  total_rows INTEGER DEFAULT 0,
  triggered_by TEXT NOT NULL,          
  status TEXT DEFAULT 'success',       
  error_message TEXT,
  duration_ms INTEGER,                 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('d1_migrations',61);
INSERT INTO "sqlite_sequence" VALUES('site_settings',277);
INSERT INTO "sqlite_sequence" VALUES('sim_cert_types',6);
INSERT INTO "sqlite_sequence" VALUES('about_pages',4);
INSERT INTO "sqlite_sequence" VALUES('notices',12);
INSERT INTO "sqlite_sequence" VALUES('downloads',19);
INSERT INTO "sqlite_sequence" VALUES('departments',10);
INSERT INTO "sqlite_sequence" VALUES('dep_pages',29);
INSERT INTO "sqlite_sequence" VALUES('progress_items',223);
INSERT INTO "sqlite_sequence" VALUES('popups',3);
INSERT INTO "sqlite_sequence" VALUES('faqs',5);
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_category ON site_settings(category);
CREATE INDEX idx_departments_slug ON departments(slug);
CREATE INDEX idx_departments_sort ON departments(sort_order);
CREATE INDEX idx_dep_pages_dept ON dep_pages(dept_id);
CREATE INDEX idx_dep_pages_slug ON dep_pages(slug);
CREATE INDEX idx_notices_pinned ON notices(is_pinned, created_at);
CREATE INDEX idx_progress_category ON progress_items(category);
CREATE INDEX idx_downloads_category ON downloads(category);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_popups_active ON popups(is_active, start_date, end_date);
CREATE INDEX idx_about_pages_slug ON about_pages(slug);
CREATE INDEX idx_progress_status ON progress_items(status);
CREATE INDEX idx_progress_product ON progress_items(product_name);
CREATE INDEX idx_images_category ON images(category);
CREATE INDEX idx_images_r2_key ON images(r2_key);
CREATE INDEX idx_sim_cert_types_slug ON sim_cert_types(slug);
CREATE INDEX idx_sim_cert_types_active ON sim_cert_types(is_active, sort_order);
CREATE UNIQUE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_site_settings_slider ON site_settings(category) WHERE category = 'slider';
CREATE INDEX idx_inquiries_consent ON inquiries(consent_personal_info);
CREATE INDEX idx_inquiries_deleted ON inquiries(deleted_at);
CREATE INDEX idx_inquiries_created ON inquiries(created_at);
CREATE INDEX idx_audit_admin ON admin_audit_logs(admin_username);
CREATE INDEX idx_audit_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_resource ON admin_audit_logs(resource);
CREATE INDEX idx_audit_created ON admin_audit_logs(created_at);
CREATE INDEX idx_backup_type ON backup_history(backup_type);
CREATE INDEX idx_backup_status ON backup_history(status);
CREATE INDEX idx_backup_created ON backup_history(created_at);
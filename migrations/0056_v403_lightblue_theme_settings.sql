-- ════════════════════════════════════════════════════════════════
-- v40.3: 연청(Light Blue) 디자인 테마 설정 + 문의 폼 레이아웃 설정
-- 목적: 하드코딩되어 있던 디자인 컬러를 site_settings 기반으로 전환하여
--       관리자 모드에서 저장·수정 가능하게 하고, 기본값을 연청 팔레트로 설정.
-- INSERT OR IGNORE: 이미 존재하면 건드리지 않음(관리자가 바꾼 값 보존).
-- ════════════════════════════════════════════════════════════════

-- ── 전역 테마 컬러 ──
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('theme_primary', '#2563EB');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('theme_cyan', '#06B6D4');

-- ── 페이지 헤더 배너 그라데이션 (연청 3색) ──
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('page_header_color1', '#1E3A8A');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('page_header_color2', '#2563EB');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('page_header_color3', '#3B82F6');
-- 페이지 헤더 높이 배율 (1.0 = 기본 / 0.3 = 30%로 축소)
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('page_header_height_scale', '0.3');

-- ── 푸터 그라데이션 (연청 2색) ──
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_color1', '#1E3A8A');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_color2', '#1E40AF');

-- ── GNB 메뉴바 그라데이션 (연청 2색) ──
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('gnb_bar_color1', '#2563EB');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('gnb_bar_color2', '#3B82F6');

-- ── 입력창(폼) 컬러 ──
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('input_bg_color', '#F0F7FF');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('input_border_color', '#BFDBFE');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('input_focus_color', '#3B82F6');

-- ── 온라인 상담문의 섹션 레이아웃 ──
-- 위아래 패딩 배율 (1.0 = 기본 / 0.7 = 30% 축소)
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('inquiry_section_pad_scale', '0.7');
-- 폼 최대 폭(px) — 기존 820 → 1200 (좌우 약 50% 확대)
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('inquiry_max_width', '1200');

-- ── accent_color가 비어있으면 연청 기본값 보강 (기존 값 있으면 유지) ──
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('accent_color', '#3B82F6');

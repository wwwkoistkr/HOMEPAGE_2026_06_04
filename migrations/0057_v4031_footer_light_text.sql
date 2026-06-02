-- ════════════════════════════════════════════════════════════════
-- v40.3.1: 푸터 가독성 개선 (A안) — 밝은 연청 배경 + 진한 남색 글자
-- 배경: 다크네이비 → 연청 라이트로 변경 (기존 값 강제 갱신)
-- 글자색: 진한 남색 계열 신규 키 추가 (관리자 편집 가능)
-- ════════════════════════════════════════════════════════════════

-- ── 푸터 배경을 연청 라이트로 갱신 (A안) ──
-- 기존 다크네이비 값(#1E3A8A/#1E40AF)을 밝은 연청으로 교체.
-- 관리자가 이미 다른 값으로 바꿨더라도 A안 적용을 위해 강제 갱신.
UPDATE site_settings SET value = '#E8F2FF' WHERE key = 'footer_color1';
UPDATE site_settings SET value = '#D6E9FF' WHERE key = 'footer_color2';
-- 혹시 키가 없을 경우 대비 (사전 생성)
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_color1', '#E8F2FF');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_color2', '#D6E9FF');

-- ── 푸터 글자색 (밝은 배경용, 관리자 편집 가능) ──
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_text_color',    '#1E3A8A'); -- 본문 진한 네이비
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_heading_color', '#0F172A'); -- 소제목 거의 검정 네이비
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_muted_color',   '#475569'); -- 보조/카피라이트 슬레이트
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('footer_hover_color',   '#1D4ED8'); -- hover 강조 블루

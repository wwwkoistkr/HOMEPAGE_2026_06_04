-- ═══════════════════════════════════════════════════════════════════
-- Migration 0054: Privacy Consent + Soft Delete + Audit Logs (v39.27)
-- ═══════════════════════════════════════════════════════════════════
-- 작성일: 2026-06-01
-- 목적:
--   1. 개인정보 수집·이용 동의 컬럼 추가 (Phase 1)
--   2. Soft Delete 컬럼 추가 (Phase 3에서 활성화)
--   3. 관리자 감사 로그 테이블 신규 생성 (Phase 3에서 활성화)
--   4. 백업 이력 테이블 신규 생성 (Phase 2에서 활성화)
--
-- 법적 근거:
--   - 「개인정보 보호법」제15조 (개인정보의 수집·이용)
--   - 「개인정보 보호법」제29조 (안전조치 의무)
--   - 「개인정보의 안전성 확보조치 기준」제8조 (접속기록 1년 이상 보관)
-- ═══════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────
-- 1. inquiries 테이블 확장: 동의 정보 + Soft Delete
-- ────────────────────────────────────────────────────────────────
ALTER TABLE inquiries ADD COLUMN consent_personal_info INTEGER DEFAULT 0;
ALTER TABLE inquiries ADD COLUMN consent_at TEXT;
ALTER TABLE inquiries ADD COLUMN deleted_at DATETIME;
ALTER TABLE inquiries ADD COLUMN deleted_by TEXT;

-- 인덱스 추가 (조회 성능)
CREATE INDEX IF NOT EXISTS idx_inquiries_consent ON inquiries(consent_personal_info);
CREATE INDEX IF NOT EXISTS idx_inquiries_deleted ON inquiries(deleted_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at);

-- ────────────────────────────────────────────────────────────────
-- 2. 관리자 감사 로그 테이블 (개인정보보호법 제29조 대응)
-- ────────────────────────────────────────────────────────────────
-- 보관 기간: 1년 이상 (법적 의무)
-- 기록 대상: 관리자의 개인정보 처리 작업 일체
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_username TEXT NOT NULL,
  action TEXT NOT NULL,           -- 'login', 'view', 'create', 'update', 'delete', 'export', 'restore', 'backup'
  resource TEXT NOT NULL,         -- 'inquiries', 'inquiry:42', 'progress_items', 'backup:xxx' 등
  ip_address TEXT,
  user_agent TEXT,
  details TEXT,                   -- JSON: 추가 컨텍스트 (다운로드 건수, 변경 컬럼 등)
  status TEXT DEFAULT 'success',  -- 'success', 'failed', 'denied'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_logs(admin_username);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON admin_audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_logs(created_at);

-- ────────────────────────────────────────────────────────────────
-- 3. 백업 이력 테이블 (Phase 2 백업 시스템 인프라)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS backup_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  backup_type TEXT NOT NULL,           -- 'daily', 'weekly', 'monthly', 'manual', 'pre-migration'
  file_key TEXT NOT NULL,              -- R2 object key
  file_size INTEGER NOT NULL,
  file_sha256 TEXT,                    -- 무결성 검증용
  row_counts TEXT,                     -- JSON: {progress_items: 5234, inquiries: 432, ...}
  table_count INTEGER DEFAULT 0,
  total_rows INTEGER DEFAULT 0,
  triggered_by TEXT NOT NULL,          -- 'cron-daily', 'cron-weekly', 'cron-monthly', or admin username
  status TEXT DEFAULT 'success',       -- 'success', 'failed', 'partial', 'restoring'
  error_message TEXT,
  duration_ms INTEGER,                 -- 백업 소요 시간 (밀리초)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_backup_type ON backup_history(backup_type);
CREATE INDEX IF NOT EXISTS idx_backup_status ON backup_history(status);
CREATE INDEX IF NOT EXISTS idx_backup_created ON backup_history(created_at);

-- ────────────────────────────────────────────────────────────────
-- 검증 쿼리 (마이그레이션 후 수동 실행 권장)
-- ────────────────────────────────────────────────────────────────
-- SELECT name FROM pragma_table_info('inquiries') WHERE name IN
--   ('consent_personal_info', 'consent_at', 'deleted_at', 'deleted_by');
-- SELECT name FROM sqlite_master WHERE type='table' AND name IN
--   ('admin_audit_logs', 'backup_history');

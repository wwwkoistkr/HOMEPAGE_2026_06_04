/**
 * ═══════════════════════════════════════════════════════════════════
 * KOIST - External Cron Endpoints (v39.31)
 * ═══════════════════════════════════════════════════════════════════
 *
 * Cloudflare Pages는 wrangler.jsonc `triggers.crons`를 지원하지 않는다.
 * 따라서 외부 cron 서비스(cron-job.org 등)에서 본 엔드포인트를 호출하여
 * 정기 백업을 트리거한다.
 *
 * 보안 모델:
 *   - 토큰 인증: ?token=...  또는  X-Cron-Token: ...  (둘 중 하나)
 *   - 토큰은 Cloudflare Pages 환경변수 `CRON_SECRET`로 주입
 *   - 상수시간 비교(timingSafeEqual)로 타이밍 공격 방지
 *   - 타입 화이트리스트: daily | weekly | monthly 만 허용
 *   - Rate Limit: 분당 2회 (DDoS 방어 + 중복 호출 차단)
 *   - 실패 시 응답 본문 최소화 (정보 노출 방지)
 *   - 모든 호출은 admin_audit_logs에 기록 (admin_username = 'cron-system')
 *
 * 호출 예시 (cron-job.org):
 *   POST https://koist-website.pages.dev/api/cron/backup?token=XXXX&type=daily
 *   또는
 *   POST https://koist-website.pages.dev/api/cron/backup?type=daily
 *     Header: X-Cron-Token: XXXX
 *
 * 응답:
 *   200 { ok: true, type, fileKey, fileSize, durationMs }
 *   401 { error: 'unauthorized' }
 *   400 { error: 'invalid type' }
 *   429 { error: '...' }
 *   500 { error: 'backup failed' }
 * ═══════════════════════════════════════════════════════════════════
 */
import { Hono } from 'hono';
import type { Bindings, Variables } from '../types';
import { createBackup, applyAllRetentionPolicies, type BackupType } from '../utils/backup';
import { rateLimiter } from '../middleware/rate-limit';

const cron = new Hono<{ Bindings: Bindings; Variables: Variables }>();

/**
 * 상수시간 문자열 비교 (타이밍 공격 방지).
 * 길이가 달라도 항상 max(a,b) 만큼 순회 → 길이 차이로 인한 타이밍 누출도 차단.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let mismatch = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0;
    const cb = i < b.length ? b.charCodeAt(i) : 0;
    mismatch |= ca ^ cb;
  }
  return mismatch === 0;
}

/**
 * Cron 전용 감사 로그 — admin_username = 'cron-system' 으로 기록.
 * (logAudit은 c.get('admin')에 의존하므로 cron context에서는 직접 INSERT)
 */
async function logCronAudit(
  c: any,
  action: string,
  resource: string,
  details: Record<string, any> | null,
  status: 'success' | 'failed' | 'denied' = 'success'
): Promise<void> {
  try {
    const ip =
      c.req.header('CF-Connecting-IP') ||
      c.req.header('X-Forwarded-For') ||
      c.req.header('X-Real-IP') ||
      '';
    const ua = c.req.header('User-Agent') || '';
    await c.env.DB.prepare(
      `INSERT INTO admin_audit_logs
         (admin_username, action, resource, ip_address, user_agent, details, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        'cron-system',
        action,
        resource,
        ip.slice(0, 100),
        ua.slice(0, 500),
        details ? JSON.stringify(details) : null,
        status
      )
      .run();
  } catch (e) {
    console.error('[cron audit] log failed:', e);
  }
}

// Rate limit: 분당 2회 (정상 cron은 분 단위 호출 없음 → 충분히 여유)
const cronRateLimiter = rateLimiter({
  max: 2,
  windowSec: 60,
  prefix: 'rl:cron',
});

/**
 * GET /api/cron/ping
 * cron-job.org에서 등록 시 연결 확인용. 토큰 불필요. 비밀 정보 노출 없음.
 */
cron.get('/ping', (c) => {
  return c.json({
    ok: true,
    service: 'koist-cron',
    time: new Date().toISOString(),
  });
});

/**
 * POST /api/cron/backup?type=daily|weekly|monthly
 * Header: X-Cron-Token: <CRON_SECRET>  (또는 ?token=...)
 *
 * GET도 허용 (cron-job.org 일부 플랜은 GET만 지원) — 멱등성 우려가 있지만
 * 백업은 새 파일 생성이므로 GET도 안전. 다만 권장은 POST.
 */
const backupHandler = async (c: any) => {
  // 1) CRON_SECRET 설정 여부 확인 (미설정 → 500이 아닌 503으로 명확히)
  const secret = c.env.CRON_SECRET;
  if (!secret || secret.length < 16) {
    await logCronAudit(c, 'backup', 'cron:backup:misconfig', { reason: 'CRON_SECRET missing or too short' }, 'failed');
    return c.json({ error: 'cron not configured' }, 503);
  }

  // 2) 토큰 추출 (쿼리 또는 헤더)
  const providedToken =
    c.req.query('token') ||
    c.req.header('X-Cron-Token') ||
    c.req.header('Authorization')?.replace(/^Bearer\s+/i, '') ||
    '';

  if (!providedToken || !timingSafeEqual(providedToken, secret)) {
    await logCronAudit(c, 'backup', 'cron:backup:unauthorized', { hasToken: !!providedToken }, 'denied');
    return c.json({ error: 'unauthorized' }, 401);
  }

  // 3) 타입 화이트리스트
  const typeRaw = (c.req.query('type') || 'daily').toLowerCase();
  const ALLOWED: BackupType[] = ['daily', 'weekly', 'monthly'];
  if (!ALLOWED.includes(typeRaw as BackupType)) {
    await logCronAudit(c, 'backup', 'cron:backup:invalid-type', { typeRaw }, 'failed');
    return c.json({ error: 'invalid type', allowed: ALLOWED }, 400);
  }
  const type = typeRaw as BackupType;

  // 4) 백업 실행
  try {
    const result = await createBackup(c.env, type, 'cron-system');

    if (result.success) {
      await logCronAudit(c, 'backup', `backup:${result.fileKey}`, {
        type,
        fileSize: result.fileSize,
        tableCount: result.tableCount,
        totalRows: result.totalRows,
        durationMs: result.durationMs,
        trigger: 'cron',
      });
      return c.json({
        ok: true,
        type,
        fileKey: result.fileKey,
        fileSize: result.fileSize,
        tableCount: result.tableCount,
        totalRows: result.totalRows,
        durationMs: result.durationMs,
      });
    } else {
      await logCronAudit(c, 'backup', `backup:failed`, { type, error: result.error }, 'failed');
      return c.json({ ok: false, error: result.error || 'backup failed' }, 500);
    }
  } catch (e: any) {
    const msg = e?.message || String(e);
    await logCronAudit(c, 'backup', `backup:exception`, { type, error: msg }, 'failed');
    return c.json({ ok: false, error: 'backup exception' }, 500);
  }
};

cron.post('/backup', cronRateLimiter, backupHandler);
cron.get('/backup', cronRateLimiter, backupHandler);

/**
 * v39.32: POST/GET /api/cron/cleanup
 * GFS 보존 정책 일괄 적용 — daily/weekly/monthly/pre-restore 초과분 삭제.
 * Manual은 보호 (자동 삭제 금지).
 *
 * 권장 cron: 매주 일요일 새벽 5시 (주간 백업 4시 직후)
 * cron-job.org Crontab: 0 5 * * 0
 *
 * 응답:
 *   200 { ok: true, totalDeleted, byType: { daily: {deleted, kept}, ... }, durationMs }
 *   401 { error: 'unauthorized' }
 *   503 { error: 'cron not configured' }
 */
const cleanupHandler = async (c: any) => {
  // 1) CRON_SECRET 검증 (backup endpoint와 동일 로직)
  const secret = c.env.CRON_SECRET;
  if (!secret || secret.length < 16) {
    await logCronAudit(c, 'cleanup', 'cron:cleanup:misconfig', { reason: 'CRON_SECRET missing or too short' }, 'failed');
    return c.json({ error: 'cron not configured' }, 503);
  }

  const providedToken =
    c.req.query('token') ||
    c.req.header('X-Cron-Token') ||
    c.req.header('Authorization')?.replace(/^Bearer\s+/i, '') ||
    '';

  if (!providedToken || !timingSafeEqual(providedToken, secret)) {
    await logCronAudit(c, 'cleanup', 'cron:cleanup:unauthorized', { hasToken: !!providedToken }, 'denied');
    return c.json({ error: 'unauthorized' }, 401);
  }

  // 2) 전체 보존 정책 적용
  try {
    const result = await applyAllRetentionPolicies(c.env);
    if (result.success) {
      await logCronAudit(c, 'cleanup', 'cron:cleanup:success', {
        totalDeleted: result.totalDeleted,
        byType: result.byType,
        durationMs: result.durationMs,
        trigger: 'cron',
      });
      return c.json({
        ok: true,
        totalDeleted: result.totalDeleted,
        byType: result.byType,
        durationMs: result.durationMs,
      });
    } else {
      await logCronAudit(c, 'cleanup', 'cron:cleanup:failed', { error: result.error }, 'failed');
      return c.json({ ok: false, error: result.error }, 500);
    }
  } catch (e: any) {
    const msg = e?.message || String(e);
    await logCronAudit(c, 'cleanup', 'cron:cleanup:exception', { error: msg }, 'failed');
    return c.json({ ok: false, error: 'cleanup exception' }, 500);
  }
};

cron.post('/cleanup', cronRateLimiter, cleanupHandler);
cron.get('/cleanup', cronRateLimiter, cleanupHandler);

export default cron;

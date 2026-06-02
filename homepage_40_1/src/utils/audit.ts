// ═══════════════════════════════════════════════════════════════════
// KOIST Audit Log Helper (v39.29 Phase 3)
// ═══════════════════════════════════════════════════════════════════
// 관리자 작업의 감사 로그를 admin_audit_logs 테이블에 기록한다.
//
// 근거 법령:
//   - 「개인정보 보호법」 제29조 (안전조치 의무)
//   - 「개인정보의 안전성 확보조치 기준」 제8조 (접속기록 1년 이상 보관)
//
// 사용 예:
//   import { logAudit } from '../utils/audit';
//   await logAudit(c, 'delete', `inquiry:${id}`, { soft: true });
// ═══════════════════════════════════════════════════════════════════
import type { Context } from 'hono';

export type AuditAction =
  | 'login'
  | 'logout'
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'soft-delete'
  | 'restore'      // 복원 (백업 또는 soft-delete 복구)
  | 'export'       // 다운로드 / Excel 내보내기
  | 'backup'
  | 'reply'        // 문의 답변
  | 'password-change';

export type AuditStatus = 'success' | 'failed' | 'denied';

export async function logAudit(
  c: Context<any>,
  action: AuditAction | string,
  resource: string,
  details?: Record<string, any> | null,
  status: AuditStatus = 'success'
): Promise<void> {
  try {
    const adminUser = c.get('admin') as { id: number; username: string } | undefined;
    const username = adminUser?.username || 'unknown';
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
        username,
        action,
        resource,
        ip.slice(0, 100), // 길이 제한
        ua.slice(0, 500),
        details ? JSON.stringify(details) : null,
        status
      )
      .run();
  } catch (e) {
    // 감사 로그 실패가 비즈니스 로직을 차단해서는 안됨
    console.error('[audit] log failed:', e);
  }
}

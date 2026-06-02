// KOIST - Admin API Routes
import { Hono } from 'hono';
import type { Bindings, Variables, ImageRecord } from '../types';
import { hashPassword, verifyPassword, generateSalt, createJWT } from '../utils/crypto';
import { getJwtSecret } from '../middleware/auth';
import {
  createBackup,
  listBackups,
  getBackupFile,
  verifyBackupIntegrity,
  restoreFromBackup,
  deleteBackup,
  getBackupStats,
  applyAllRetentionPolicies,
  isWithinEmergencyWindow,
  RETENTION_POLICY,
  EMERGENCY_RESTORE_WINDOW_MS,
  type BackupType,
} from '../utils/backup';
import { logAudit } from '../utils/audit';

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// NOTE: Login is handled in index.tsx before authMiddleware
// POST /api/admin/change-password (requires auth via token in header)
admin.post('/change-password', async (c) => {
  const db = c.env.DB;
  const adminUser = c.get('admin');
  if (!adminUser) return c.json({ error: 'Unauthorized' }, 401);

  const { current_password, new_password } = await c.req.json();
  if (!new_password || new_password.length < 6) {
    return c.json({ error: '새 비밀번호는 6자 이상이어야 합니다.' }, 400);
  }

  const user = await db.prepare('SELECT * FROM admin_users WHERE id = ?').bind(adminUser.id).first<{
    id: number; password_hash: string; salt: string;
  }>();
  if (!user) return c.json({ error: 'User not found' }, 404);

  const valid = await verifyPassword(current_password, user.salt, user.password_hash);
  if (!valid) return c.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, 400);

  const newSalt = await generateSalt();
  const newHash = await hashPassword(new_password, newSalt);

  await db.prepare(
    'UPDATE admin_users SET password_hash = ?, salt = ?, must_change_password = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(newHash, newSalt, user.id).run();

  const secret = (() => { try { return getJwtSecret(c.env); } catch { return null; } })();
  if (!secret) return c.json({ error: 'Server misconfigured' }, 500);
  const token = await createJWT({ id: adminUser.id, username: adminUser.username }, secret);

  // Refresh HttpOnly cookie with new token
  const isSecure = c.req.url.startsWith('https');
  const cookieFlags = `Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${isSecure ? '; Secure' : ''}`;
  c.header('Set-Cookie', `koist_token=${token}; ${cookieFlags}`);

  return c.json({ success: true, message: '비밀번호가 변경되었습니다.' });
});

// ---- Site Settings ----
admin.get('/settings', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM site_settings ORDER BY category, key').all();
  return c.json({ success: true, data: result.results });
});

admin.put('/settings/:key', async (c) => {
  const key = c.req.param('key');
  const { value } = await c.req.json();
  await c.env.DB.prepare('UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?').bind(value, key).run();
  return c.json({ success: true });
});

// ──────────────────────────────────────────────────────────────────────────
// v39.4: AI 시뮬레이터 슬라이더 전용 설정 (category='slider') CRUD
// ──────────────────────────────────────────────────────────────────────────
// GET  /api/admin/slider-settings          → 전체 조회 (카테고리='slider')
// PUT  /api/admin/slider-settings          → 여러 키 일괄 저장 {key:value, ...}
// POST /api/admin/slider-settings/reset    → 기본값으로 리셋
// POST /api/admin/slider-settings/preset/:name → 사전 정의 프리셋 적용
// ──────────────────────────────────────────────────────────────────────────

admin.get('/slider-settings', async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT key, value, description FROM site_settings WHERE category = 'slider' ORDER BY key"
  ).all();
  return c.json({ success: true, data: result.results });
});

admin.put('/slider-settings', async (c) => {
  const body = await c.req.json<Record<string, string>>();
  if (!body || typeof body !== 'object') {
    return c.json({ error: 'Request body must be a key-value object' }, 400);
  }
  const db = c.env.DB;
  const stmts: any[] = [];
  let updated = 0;
  for (const [key, val] of Object.entries(body)) {
    if (typeof key !== 'string' || !key.startsWith('slider_')) continue; // 안전장치
    const value = val == null ? '' : String(val);
    stmts.push(
      db.prepare(
        "UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ? AND category = 'slider'"
      ).bind(value, key)
    );
    updated++;
  }
  if (stmts.length > 0) {
    await db.batch(stmts);
  }
  return c.json({ success: true, updated });
});

// 슬라이더 기본값 (마이그레이션 0029와 동일)
const SLIDER_DEFAULTS: Record<string, string> = {
  slider_total_mode: 'sum',
  slider_round_mode: 'round',
  slider_decimal_places: '0',
  slider_number_unit: '개월',
  slider_total_format: '약 {N}개월',
  slider_prep_format: '준비 {N}개월',
  slider_eval_format: '평가 {N}개월',
  slider_reduction_format: '{N}%',
  slider_saving_format: '약 {N}개월 절감',
  slider_prep_label: '준비',
  slider_eval_label: '평가',
  slider_gen_prep_color: '#F59E0B',
  slider_gen_eval_color: '#94A3B8',
  slider_gen_min_width: '15',
  slider_gen_transition: '0.7',
  slider_koist_prep_color: '#F59E0B',
  slider_koist_eval_color: '#3B82F6',
  slider_koist_min_width: '8',
  slider_koist_transition: '0.5',
  slider_track_color_1: '#EF4444',
  slider_track_color_2: '#F59E0B',
  slider_track_color_3: '#10B981',
  slider_track_color_4: '#3B82F6',
  slider_track_opacity: '0.20',
  slider_badge_grad_start: '#10B981',
  slider_badge_grad_end: '#059669',
  slider_badge_text_color: '#FFFFFF',
  slider_gen_prep_ratio: '55',
  slider_gen_eval_ratio: '45',
  slider_koist_prep_ratio: '40',
  slider_koist_eval_ratio: '60',
  slider_weeks_per_month: '4.345',
};

admin.post('/slider-settings/reset', async (c) => {
  const db = c.env.DB;
  const stmts = Object.entries(SLIDER_DEFAULTS).map(([k, v]) =>
    db.prepare(
      "UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ? AND category = 'slider'"
    ).bind(v, k)
  );
  await db.batch(stmts);
  return c.json({ success: true, reset: stmts.length });
});

// 색상 프리셋: 기본/모노톤/다크/파스텔
const SLIDER_PRESETS: Record<string, Record<string, string>> = {
  default: {
    slider_gen_prep_color: '#F59E0B',
    slider_gen_eval_color: '#94A3B8',
    slider_koist_prep_color: '#F59E0B',
    slider_koist_eval_color: '#3B82F6',
    slider_track_color_1: '#EF4444',
    slider_track_color_2: '#F59E0B',
    slider_track_color_3: '#10B981',
    slider_track_color_4: '#3B82F6',
    slider_badge_grad_start: '#10B981',
    slider_badge_grad_end: '#059669',
  },
  monotone: {
    slider_gen_prep_color: '#64748B',
    slider_gen_eval_color: '#CBD5E1',
    slider_koist_prep_color: '#475569',
    slider_koist_eval_color: '#94A3B8',
    slider_track_color_1: '#334155',
    slider_track_color_2: '#64748B',
    slider_track_color_3: '#94A3B8',
    slider_track_color_4: '#CBD5E1',
    slider_badge_grad_start: '#334155',
    slider_badge_grad_end: '#1E293B',
  },
  dark: {
    slider_gen_prep_color: '#DC2626',
    slider_gen_eval_color: '#1F2937',
    slider_koist_prep_color: '#DC2626',
    slider_koist_eval_color: '#1D4ED8',
    slider_track_color_1: '#991B1B',
    slider_track_color_2: '#B91C1C',
    slider_track_color_3: '#15803D',
    slider_track_color_4: '#1D4ED8',
    slider_badge_grad_start: '#065F46',
    slider_badge_grad_end: '#064E3B',
  },
  pastel: {
    slider_gen_prep_color: '#FCD34D',
    slider_gen_eval_color: '#E5E7EB',
    slider_koist_prep_color: '#FCD34D',
    slider_koist_eval_color: '#93C5FD',
    slider_track_color_1: '#FCA5A5',
    slider_track_color_2: '#FCD34D',
    slider_track_color_3: '#6EE7B7',
    slider_track_color_4: '#93C5FD',
    slider_badge_grad_start: '#6EE7B7',
    slider_badge_grad_end: '#34D399',
  },
};

admin.post('/slider-settings/preset/:name', async (c) => {
  const name = c.req.param('name');
  const preset = SLIDER_PRESETS[name];
  if (!preset) return c.json({ error: `Unknown preset: ${name}` }, 400);
  const db = c.env.DB;
  const stmts = Object.entries(preset).map(([k, v]) =>
    db.prepare(
      "UPDATE site_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ? AND category = 'slider'"
    ).bind(v, k)
  );
  await db.batch(stmts);
  return c.json({ success: true, preset: name, applied: stmts.length });
});

// ---- Popups CRUD ----
admin.get('/popups', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM popups ORDER BY sort_order').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/popups', async (c) => {
  const body = await c.req.json();
  // v39.16 Phase 2-E: card_width_cm, card_height_cm 추가
  const { title, content, image_url, popup_type, width, height, position_top, position_left, start_date, end_date, is_active, sort_order, font_size, title_font_size, bg_color, title_bg_color, text_color, title_color, line_height, padding, card_width_cm, card_height_cm } = body;
  await c.env.DB.prepare(
    'INSERT INTO popups (title, content, image_url, popup_type, width, height, position_top, position_left, start_date, end_date, is_active, sort_order, font_size, title_font_size, bg_color, title_bg_color, text_color, title_color, line_height, padding, card_width_cm, card_height_cm) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  ).bind(title, content || '', image_url || '', popup_type || 'html', width || 420, height || 300, position_top || 100, position_left || 0, start_date || null, end_date || null, is_active ?? 1, sort_order || 0, font_size || 17, title_font_size || 17, bg_color || '#ffffff', title_bg_color || '', text_color || '#374151', title_color || '#1f2937', line_height || 1.7, padding || 20, card_width_cm ?? null, card_height_cm ?? null).run();
  return c.json({ success: true });
});

admin.put('/popups/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  // v39.16 Phase 2-E: card_width_cm, card_height_cm 추가
  const fields = ['title', 'content', 'image_url', 'popup_type', 'width', 'height', 'position_top', 'position_left', 'start_date', 'end_date', 'is_active', 'sort_order', 'font_size', 'title_font_size', 'bg_color', 'title_bg_color', 'text_color', 'title_color', 'line_height', 'padding', 'card_width_cm', 'card_height_cm'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) {
    if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); }
  }
  if (updates.length === 0) return c.json({ error: 'No fields to update' }, 400);
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  await c.env.DB.prepare(`UPDATE popups SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/popups/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM popups WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- Departments CRUD ----
admin.get('/departments', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM departments ORDER BY sort_order').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/departments', async (c) => {
  // v40.0: progress_meta, is_main_progress 필드 추가
  const body = await c.req.json();
  const { name, slug, description, icon, color, sort_order, image_url, header_bg_url, contact_dept, contact_name, contact_phone, progress_meta, is_main_progress } = body;
  // progress_meta JSON 검증
  let metaStr = '{}';
  if (progress_meta !== undefined && progress_meta !== null) {
    try {
      metaStr = typeof progress_meta === 'string' ? progress_meta : JSON.stringify(progress_meta);
      JSON.parse(metaStr);
    } catch (e) {
      return c.json({ error: 'Invalid progress_meta JSON' }, 400);
    }
  }
  await c.env.DB.prepare('INSERT INTO departments (name, slug, description, icon, color, sort_order, image_url, header_bg_url, contact_dept, contact_name, contact_phone, progress_meta, is_main_progress) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(name, slug, description || '', icon || 'fa-shield-halved', color || '#3B82F6', sort_order || 0, image_url || '', header_bg_url || '', contact_dept || '', contact_name || '', contact_phone || '', metaStr, is_main_progress ? 1 : 0).run();
  return c.json({ success: true });
});

admin.put('/departments/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  // v40.0: progress_meta, is_main_progress 필드 추가 (평가현황 카테고리 통합 관리)
  const fields = ['name', 'slug', 'description', 'icon', 'color', 'sort_order', 'is_active', 'image_url', 'header_bg_url', 'contact_dept', 'contact_name', 'contact_phone', 'use_legacy_theme', 'english_subtitle', 'progress_meta', 'is_main_progress'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) {
    if (body[f] !== undefined) {
      // v40.0: progress_meta는 JSON 유효성 검증
      if (f === 'progress_meta' && body[f]) {
        try {
          // 객체로 들어오면 stringify, 문자열로 들어오면 파싱 검증
          const meta = typeof body[f] === 'string' ? body[f] : JSON.stringify(body[f]);
          JSON.parse(meta); // 유효성 검증
          updates.push(`${f} = ?`);
          values.push(meta);
        } catch (e) {
          return c.json({ error: 'Invalid progress_meta JSON' }, 400);
        }
      } else {
        updates.push(`${f} = ?`);
        values.push(body[f]);
      }
    }
  }
  if (updates.length === 0) return c.json({ error: 'No fields' }, 400);
  values.push(id);
  await c.env.DB.prepare(`UPDATE departments SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/departments/:id', async (c) => {
  // Also delete sub-pages
  await c.env.DB.prepare('DELETE FROM dep_pages WHERE dept_id = ?').bind(c.req.param('id')).run();
  await c.env.DB.prepare('DELETE FROM departments WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- Dep Pages CRUD ----
admin.get('/departments/:id/pages', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM dep_pages WHERE dept_id = ? ORDER BY sort_order').bind(c.req.param('id')).all();
  return c.json({ success: true, data: result.results });
});

admin.post('/departments/:id/pages', async (c) => {
  const deptId = c.req.param('id');
  const { title, slug, content, sort_order } = await c.req.json();
  await c.env.DB.prepare('INSERT INTO dep_pages (dept_id, title, slug, content, sort_order) VALUES (?,?,?,?,?)').bind(deptId, title, slug, content || '', sort_order || 0).run();
  return c.json({ success: true });
});

admin.put('/dep-pages/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const fields = ['title', 'slug', 'content', 'sort_order', 'is_active', 'meta_description', 'header_bg_url'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) { if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); } }
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  await c.env.DB.prepare(`UPDATE dep_pages SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/dep-pages/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM dep_pages WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- Notices CRUD ----
admin.get('/notices', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/notices', async (c) => {
  const { title, content, is_pinned } = await c.req.json();
  await c.env.DB.prepare('INSERT INTO notices (title, content, is_pinned) VALUES (?,?,?)').bind(title, content, is_pinned || 0).run();
  return c.json({ success: true });
});

admin.put('/notices/:id', async (c) => {
  const { title, content, is_pinned } = await c.req.json();
  await c.env.DB.prepare('UPDATE notices SET title=?, content=?, is_pinned=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(title, content, is_pinned || 0, c.req.param('id')).run();
  return c.json({ success: true });
});

admin.delete('/notices/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM notices WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- Progress CRUD ----
admin.get('/progress', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM progress_items ORDER BY sort_order ASC').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/progress', async (c) => {
  const { category, product_name, company, status, assurance_level, cert_type, eval_type, start_date, end_date, note } = await c.req.json();
  await c.env.DB.prepare('INSERT INTO progress_items (category, product_name, company, status, assurance_level, cert_type, eval_type, start_date, end_date, note) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(category, product_name, company||'', status||'평가접수', assurance_level||'', cert_type||'최초평가', eval_type||'국내평가', start_date||null, end_date||null, note||'').run();
  return c.json({ success: true });
});

admin.put('/progress/:id', async (c) => {
  const body = await c.req.json();
  const fields = ['category', 'product_name', 'company', 'status', 'assurance_level', 'cert_type', 'eval_type', 'start_date', 'end_date', 'note'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) { if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); } }
  if (updates.length === 0) return c.json({ error: 'No fields' }, 400);
  values.push(c.req.param('id'));
  await c.env.DB.prepare(`UPDATE progress_items SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/progress/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM progress_items WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- FAQ CRUD ----
admin.get('/faqs', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM faqs ORDER BY sort_order').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/faqs', async (c) => {
  const { question, answer, category, sort_order } = await c.req.json();
  await c.env.DB.prepare('INSERT INTO faqs (question, answer, category, sort_order) VALUES (?,?,?,?)').bind(question, answer, category||'general', sort_order||0).run();
  return c.json({ success: true });
});

admin.put('/faqs/:id', async (c) => {
  const body = await c.req.json();
  const fields = ['question', 'answer', 'category', 'sort_order', 'is_active'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) { if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); } }
  if (updates.length === 0) return c.json({ error: 'No fields' }, 400);
  values.push(c.req.param('id'));
  await c.env.DB.prepare(`UPDATE faqs SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/faqs/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM faqs WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ──────────────────────────────────────────────────────────────────
// Inquiries Management (v39.30 - 엑셀 스타일 페이지네이션/검색/필터/정렬)
// ──────────────────────────────────────────────────────────────────
// Query Parameters:
//   - page          : 페이지 번호 (1부터, 기본 1)
//   - per_page      : 페이지당 행 수 (기본 20, 최대 200)
//   - search        : 통합 검색어 (name/email/phone/company/subject/message LIKE)
//   - status        : 'pending' | 'replied' | '' (전체)
//   - consent       : '1' | '0' | '' (동의 여부)
//   - date_from     : YYYY-MM-DD 시작일
//   - date_to       : YYYY-MM-DD 종료일
//   - include_deleted : 'true' 면 휴지통 포함
//   - deleted_only  : 'true' 면 휴지통만
//   - sort_by       : id|created_at|name|status|subject (기본 created_at)
//   - sort_dir      : asc|desc (기본 desc)
//   - export        : 'true' 면 페이지네이션 없이 전체 반환 (감사 로그 기록)
admin.get('/inquiries', async (c) => {
  const q = c.req.query.bind(c.req);

  // 페이지네이션
  const page = Math.max(1, parseInt(q('page') || '1') || 1);
  const perPage = Math.min(200, Math.max(1, parseInt(q('per_page') || '20') || 20));
  const isExport = q('export') === 'true';

  // 검색/필터
  const search = (q('search') || '').trim();
  const status = (q('status') || '').trim();
  const consent = (q('consent') || '').trim();
  const dateFrom = (q('date_from') || '').trim();
  const dateTo = (q('date_to') || '').trim();
  const includeDeleted = q('include_deleted') === 'true';
  const deletedOnly = q('deleted_only') === 'true';

  // 정렬
  const SORT_WHITELIST = new Set(['id', 'created_at', 'name', 'status', 'subject']);
  let sortBy = q('sort_by') || 'created_at';
  if (!SORT_WHITELIST.has(sortBy)) sortBy = 'created_at';
  const sortDir = (q('sort_dir') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  // WHERE 조건 구성
  const conds: string[] = [];
  const binds: any[] = [];

  if (deletedOnly) {
    conds.push('deleted_at IS NOT NULL');
  } else if (!includeDeleted) {
    conds.push('deleted_at IS NULL');
  }

  if (status === 'pending' || status === 'replied') {
    conds.push('status = ?');
    binds.push(status);
  }

  if (consent === '1' || consent === '0') {
    conds.push('consent_personal_info = ?');
    binds.push(parseInt(consent));
  }

  if (dateFrom) {
    conds.push('created_at >= ?');
    binds.push(dateFrom + ' 00:00:00');
  }
  if (dateTo) {
    conds.push('created_at <= ?');
    binds.push(dateTo + ' 23:59:59');
  }

  if (search) {
    conds.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR subject LIKE ? OR message LIKE ?)');
    const like = '%' + search + '%';
    binds.push(like, like, like, like, like, like);
  }

  const whereClause = conds.length > 0 ? 'WHERE ' + conds.join(' AND ') : '';

  // 전체 개수
  const countRow = await c.env.DB.prepare(`SELECT COUNT(*) as cnt FROM inquiries ${whereClause}`)
    .bind(...binds)
    .first<{ cnt: number }>();
  const total = countRow?.cnt || 0;

  // 데이터 조회
  let dataQuery = `SELECT * FROM inquiries ${whereClause} ORDER BY ${sortBy} ${sortDir}`;
  const dataBinds = [...binds];
  if (!isExport) {
    const offset = (page - 1) * perPage;
    dataQuery += ' LIMIT ? OFFSET ?';
    dataBinds.push(perPage, offset);
  }
  const result = await c.env.DB.prepare(dataQuery).bind(...dataBinds).all();
  const rows = result.results || [];

  // export=true 인 경우 감사 로그 기록 (개인정보 대량 열람)
  if (isExport) {
    await logAudit(c, 'export', 'inquiries:list', {
      count: rows.length,
      filters: { search, status, consent, dateFrom, dateTo, includeDeleted, deletedOnly },
    });
  }

  return c.json({
    success: true,
    data: rows,
    pagination: {
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
    },
    filters: { search, status, consent, dateFrom, dateTo, includeDeleted, deletedOnly, sortBy, sortDir },
  });
});

// 일괄 Soft Delete
admin.post('/inquiries/bulk-delete', async (c) => {
  const body = await c.req.json<{ ids?: number[]; permanent?: boolean }>().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids.filter((n) => Number.isFinite(n) && n > 0) : [];
  if (ids.length === 0) {
    return c.json({ error: '삭제할 ID 배열이 필요합니다.' }, 400);
  }
  if (ids.length > 500) {
    return c.json({ error: '한 번에 최대 500개까지 삭제할 수 있습니다.' }, 400);
  }

  const adminUser = c.get('admin');
  const username = adminUser?.username || 'unknown';
  const permanent = body.permanent === true;
  const placeholders = ids.map(() => '?').join(',');

  if (permanent) {
    // 영구 삭제: soft-deleted 상태에서만 가능
    const eligible = await c.env.DB.prepare(
      `SELECT id FROM inquiries WHERE id IN (${placeholders}) AND deleted_at IS NOT NULL`
    )
      .bind(...ids)
      .all<{ id: number }>();
    const eligibleIds = (eligible.results || []).map((r) => r.id);
    if (eligibleIds.length === 0) {
      return c.json(
        { error: '영구 삭제 가능한 항목이 없습니다. 먼저 휴지통으로 이동(soft delete)해야 합니다.' },
        400
      );
    }
    const ePlaceholders = eligibleIds.map(() => '?').join(',');
    await c.env.DB.prepare(`DELETE FROM inquiries WHERE id IN (${ePlaceholders})`)
      .bind(...eligibleIds)
      .run();
    await logAudit(c, 'delete', `inquiries:bulk-permanent`, {
      ids: eligibleIds,
      count: eligibleIds.length,
    });
    return c.json({ success: true, deleted_count: eligibleIds.length, ids: eligibleIds });
  } else {
    // Soft Delete
    await c.env.DB.prepare(
      `UPDATE inquiries SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ?
       WHERE id IN (${placeholders}) AND deleted_at IS NULL`
    )
      .bind(username, ...ids)
      .run();
    await logAudit(c, 'soft-delete', `inquiries:bulk`, {
      ids,
      count: ids.length,
    });
    return c.json({ success: true, deleted_count: ids.length, ids });
  }
});

// 일괄 복구
admin.post('/inquiries/bulk-restore', async (c) => {
  const body = await c.req.json<{ ids?: number[] }>().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? body.ids.filter((n) => Number.isFinite(n) && n > 0) : [];
  if (ids.length === 0) return c.json({ error: '복구할 ID 배열이 필요합니다.' }, 400);

  const placeholders = ids.map(() => '?').join(',');
  await c.env.DB.prepare(
    `UPDATE inquiries SET deleted_at = NULL, deleted_by = NULL WHERE id IN (${placeholders})`
  )
    .bind(...ids)
    .run();
  await logAudit(c, 'restore', `inquiries:bulk-restore`, { ids, count: ids.length });
  return c.json({ success: true, restored_count: ids.length });
});

// v39.30: 마스킹 해제 감사로그 (개인정보 열람 기록)
// 클라이언트에서 마스킹된 필드를 클릭해 일시 해제할 때 호출됨.
// 「개인정보 보호법」 제29조 (안전조치 의무) 의 접근 기록 요구사항 대응.
admin.post('/inquiries/:id/reveal', async (c) => {
  const id = c.req.param('id');
  let body: any = {};
  try { body = await c.req.json(); } catch (_) {}
  const field = String(body.field || 'unknown').substring(0, 32);
  await logAudit(c, 'view', `inquiry:${id}:reveal`, { field });
  return c.json({ success: true });
});

admin.put('/inquiries/:id', async (c) => {
  const id = c.req.param('id');
  const { admin_reply, status } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE inquiries SET admin_reply=?, status=?, replied_at=CURRENT_TIMESTAMP WHERE id=?'
  )
    .bind(admin_reply, status || 'replied', id)
    .run();
  await logAudit(c, 'reply', `inquiry:${id}`, {
    status: status || 'replied',
    reply_length: (admin_reply || '').length,
  });
  return c.json({ success: true });
});

// Soft Delete: deleted_at + deleted_by 만 채워 데이터 보존
// 「개인정보 보호법」 제21조 (파기) 의무 대응을 위해 실제 파기는 별도 절차로 처리
admin.delete('/inquiries/:id', async (c) => {
  const id = c.req.param('id');
  const adminUser = c.get('admin');
  const username = adminUser?.username || 'unknown';
  await c.env.DB.prepare(
    `UPDATE inquiries SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? 
     WHERE id = ? AND deleted_at IS NULL`
  )
    .bind(username, id)
    .run();
  await logAudit(c, 'soft-delete', `inquiry:${id}`, { method: 'soft', deleted_by: username });
  return c.json({ success: true, message: '문의가 휴지통으로 이동되었습니다.' });
});

// 휴지통에서 복구
admin.post('/inquiries/:id/restore', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare(
    `UPDATE inquiries SET deleted_at = NULL, deleted_by = NULL WHERE id = ?`
  )
    .bind(id)
    .run();
  await logAudit(c, 'restore', `inquiry:${id}`, { method: 'soft-undelete' });
  return c.json({ success: true, message: '문의가 복구되었습니다.' });
});

// 영구 삭제 (개인정보 파기) — soft-deleted 상태에서만 가능
admin.delete('/inquiries/:id/permanent', async (c) => {
  const id = c.req.param('id');
  const row = await c.env.DB.prepare(
    'SELECT id, deleted_at FROM inquiries WHERE id = ?'
  )
    .bind(id)
    .first<{ id: number; deleted_at: string | null }>();
  if (!row) return c.json({ error: '문의를 찾을 수 없습니다.' }, 404);
  if (!row.deleted_at) {
    return c.json({ error: '먼저 휴지통으로 이동(soft delete)한 뒤 영구 삭제할 수 있습니다.' }, 400);
  }
  await c.env.DB.prepare('DELETE FROM inquiries WHERE id = ?').bind(id).run();
  await logAudit(c, 'delete', `inquiry:${id}`, { method: 'permanent' });
  return c.json({ success: true, message: '문의가 영구 삭제되었습니다.' });
});

// ---- Downloads CRUD ----
admin.get('/downloads', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM downloads ORDER BY created_at DESC').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/downloads', async (c) => {
  const { title, description, file_url, file_name, file_size, category } = await c.req.json();
  await c.env.DB.prepare('INSERT INTO downloads (title, description, file_url, file_name, file_size, category) VALUES (?,?,?,?,?,?)').bind(title, description||'', file_url, file_name||'', file_size||0, category||'general').run();
  return c.json({ success: true });
});

admin.put('/downloads/:id', async (c) => {
  const body = await c.req.json();
  const fields = ['title', 'description', 'file_url', 'file_name', 'file_size', 'category'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) { if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); } }
  if (updates.length === 0) return c.json({ error: 'No fields' }, 400);
  values.push(c.req.param('id'));
  await c.env.DB.prepare(`UPDATE downloads SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/downloads/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM downloads WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- About Pages CRUD ----
admin.get('/about-pages', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM about_pages ORDER BY sort_order').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/about-pages', async (c) => {
  const { title, slug, content, sort_order } = await c.req.json();
  if (!title || !slug || !content) return c.json({ error: '제목, 슬러그, 내용은 필수입니다.' }, 400);
  await c.env.DB.prepare('INSERT INTO about_pages (title, slug, content, sort_order) VALUES (?,?,?,?)').bind(title, slug, content, sort_order||0).run();
  return c.json({ success: true });
});

admin.put('/about-pages/:id', async (c) => {
  const body = await c.req.json();
  const fields = ['title', 'content', 'sort_order'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) { if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); } }
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(c.req.param('id'));
  await c.env.DB.prepare(`UPDATE about_pages SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/about-pages/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM about_pages WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- Images Management (R2) ----

// ---- Sim Cert Types CRUD (AI 시뮬레이터) ----
admin.get('/sim-cert-types', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM sim_cert_types ORDER BY sort_order').all();
  return c.json({ success: true, data: result.results });
});

admin.post('/sim-cert-types', async (c) => {
  const { name, slug, icon, color, traditional_min_weeks, traditional_max_weeks, koist_min_weeks, koist_max_weeks, description, sort_order } = await c.req.json();
  await c.env.DB.prepare(
    'INSERT INTO sim_cert_types (name, slug, icon, color, traditional_min_weeks, traditional_max_weeks, koist_min_weeks, koist_max_weeks, description, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).bind(name, slug, icon || 'fa-shield-halved', color || '#3B82F6', traditional_min_weeks || 12, traditional_max_weeks || 28, koist_min_weeks || 7, koist_max_weeks || 20, description || '', sort_order || 0).run();
  return c.json({ success: true });
});

admin.put('/sim-cert-types/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const fields = ['name', 'slug', 'icon', 'color', 'traditional_min_weeks', 'traditional_max_weeks', 'koist_min_weeks', 'koist_max_weeks', 'description', 'sort_order', 'is_active'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) { if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); } }
  if (updates.length === 0) return c.json({ error: 'No fields' }, 400);
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  await c.env.DB.prepare(`UPDATE sim_cert_types SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return c.json({ success: true });
});

admin.delete('/sim-cert-types/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM sim_cert_types WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ---- Images Management (R2) (continued) ----
admin.get('/images', async (c) => {
  const category = c.req.query('category') || '';
  let sql = 'SELECT * FROM images ORDER BY created_at DESC';
  const binds: string[] = [];
  if (category) {
    sql = 'SELECT * FROM images WHERE category = ? ORDER BY created_at DESC';
    binds.push(category);
  }
  const stmt = c.env.DB.prepare(sql);
  const result = await (binds.length > 0 ? stmt.bind(...binds) : stmt).all<ImageRecord>();
  return c.json({ success: true, data: result.results || [] });
});

// Check if R2 is available
function hasR2(env: Bindings): boolean {
  return !!(env as any).R2;
}

// GET /api/admin/images/r2-status - Check R2 availability
admin.get('/images/r2-status', async (c) => {
  return c.json({ success: true, r2_available: hasR2(c.env) });
});

admin.post('/images', async (c) => {
  try {
    const contentType = c.req.header('content-type') || '';
    const maxBytes = parseInt(c.env.IMAGE_MAX_BYTES || '5242880', 10); // Default 5 MB
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.formData();
      const file = formData.get('file') as File | null;
      const category = (formData.get('category') as string) || 'general';
      const altText = (formData.get('alt_text') as string) || '';

      if (!file) return c.json({ error: '파일을 선택해주세요.' }, 400);

      // Disallow SVG by default (XSS vector)
      if (file.type === 'image/svg+xml') {
        return c.json({ error: 'SVG 파일은 보안상 업로드할 수 없습니다.' }, 400);
      }

      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const allowedVideoTypes = ['video/mp4', 'video/webm'];
      const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
      const isVideo = allowedVideoTypes.includes(file.type);
      if (!allowedTypes.includes(file.type)) {
        return c.json({ error: '지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP, MP4, WebM 가능)' }, 400);
      }

      // Video files allow up to 20 MB; images use default maxBytes
      const effectiveMaxBytes = isVideo ? Math.max(maxBytes, 20 * 1024 * 1024) : maxBytes;
      if (file.size > effectiveMaxBytes) {
        return c.json({ error: `파일 크기는 ${Math.round(effectiveMaxBytes / 1024 / 1024)}MB 이하만 가능합니다.` }, 400);
      }

      // Validate magic bytes
      const arrayBuffer = await file.arrayBuffer();
      const header = new Uint8Array(arrayBuffer.slice(0, 32));
      const magicValid = validateMagicBytes(header, file.type);
      if (!magicValid) {
        return c.json({ error: '파일 내용이 확장자와 일치하지 않습니다.' }, 400);
      }

      // Video files use 'videos/' prefix in R2
      const uploadCategory = isVideo ? 'videos' : category;

      const timestamp = Date.now();
      const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
      const safeName = `${uploadCategory}/${timestamp}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      
      if (hasR2(c.env)) {
        await c.env.R2.put(safeName, arrayBuffer, {
          httpMetadata: { contentType: file.type },
        });
      }

      await c.env.DB.prepare(
        'INSERT INTO images (file_name, original_name, r2_key, mime_type, file_size, category, alt_text) VALUES (?,?,?,?,?,?,?)'
      ).bind(safeName, file.name, safeName, file.type, file.size, category, altText).run();

      const image = await c.env.DB.prepare('SELECT * FROM images WHERE r2_key = ?').bind(safeName).first<ImageRecord>();

      return c.json({ 
        success: true, 
        data: image,
        url: `/api/images/${safeName}` 
      });
    } else if (contentType.includes('application/json')) {
      // URL-based image registration (no R2 needed)
      const { url, category, alt_text } = await c.req.json();
      if (!url) return c.json({ error: 'URL을 입력해주세요.' }, 400);

      // Validate external URL
      if (!isValidExternalUrl(url)) {
        return c.json({ error: '유효하지 않은 URL입니다. HTTPS URL만 허용됩니다.' }, 400);
      }

      const safeName = url;
      await c.env.DB.prepare(
        'INSERT INTO images (file_name, original_name, r2_key, mime_type, file_size, category, alt_text) VALUES (?,?,?,?,?,?,?)'
      ).bind(safeName, url.split('/').pop() || 'image', safeName, 'image/external', 0, category || 'general', alt_text || '').run();

      const image = await c.env.DB.prepare('SELECT * FROM images WHERE r2_key = ?').bind(safeName).first<ImageRecord>();
      return c.json({ success: true, data: image, url });
    } else {
      return c.json({ error: 'Content-Type must be multipart/form-data or application/json' }, 400);
    }
  } catch (err: any) {
    return c.json({ error: '업로드 실패: ' + (err.message || '알 수 없는 오류') }, 500);
  }
});

admin.delete('/images/:id', async (c) => {
  const id = c.req.param('id');
  const image = await c.env.DB.prepare('SELECT * FROM images WHERE id = ?').bind(id).first<ImageRecord>();
  if (!image) return c.json({ error: '이미지를 찾을 수 없습니다.' }, 404);

  // Delete from R2 (only if R2 is available and it's not an external URL)
  if (hasR2(c.env) && image.mime_type !== 'image/external') {
    try {
      await c.env.R2.delete(image.r2_key);
    } catch {
      // R2 delete failure is non-critical
    }
  }

  await c.env.DB.prepare('DELETE FROM images WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ── Upload Validation Helpers ──

/** Validate file magic bytes against claimed MIME type */
function validateMagicBytes(header: Uint8Array, mimeType: string): boolean {
  const signatures: Record<string, number[][]> = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
    'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]], // GIF87a, GIF89a
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF (then WEBP at offset 8)
    // Video formats — ftyp box at offset 4 (ISO Base Media File Format)
    'video/mp4': [[0x66, 0x74, 0x79, 0x70]], // "ftyp" at offset 4
    'video/webm': [[0x1A, 0x45, 0xDF, 0xA3]], // EBML header
  };

  const sigs = signatures[mimeType];
  if (!sigs) return false;

  // MP4: ftyp box starts at byte 4, not byte 0
  if (mimeType === 'video/mp4') {
    return sigs.some(sig => sig.every((byte, i) => header[i + 4] === byte));
  }

  return sigs.some(sig => sig.every((byte, i) => header[i] === byte));
}

/** Validate external image URL: must be HTTPS, no loopback/private IPs */
function isValidExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();

    // Block loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]') return false;

    // Block private IP ranges
    if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.)/.test(hostname)) return false;

    // Block link-local
    if (hostname.startsWith('fe80:')) return false;

    // Block internal hostnames
    if (hostname.endsWith('.local') || hostname.endsWith('.internal') || hostname.endsWith('.corp')) return false;

    // Whitelist file extensions (optional — image URLs may not always have extensions)
    const path = parsed.pathname.toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.bmp'];
    const hasExt = allowedExts.some(ext => path.endsWith(ext));
    // Allow if extension matches or if it's a CDN/API URL without extension
    if (path.includes('.') && !hasExt) {
      const ext = path.split('.').pop();
      if (ext && ext.length <= 5 && !allowedExts.some(e => e.slice(1) === ext)) return false;
    }

    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Backup Management API (v39.28 Phase 2)
// ═══════════════════════════════════════════════════════════════════
// 모든 라우트는 상위 미들웨어(authMiddleware + csrfValidationMiddleware)로 보호됨
// 감사 로그(admin_audit_logs)에 모든 작업 기록
// ═══════════════════════════════════════════════════════════════════

// logAudit는 '../utils/audit'에서 import (Phase 3에서 모듈로 분리)

// ──────────────────────────────────────────────────────────────────
// GET /api/admin/backups  → 백업 목록 + 통계
// ──────────────────────────────────────────────────────────────────
admin.get('/backups', async (c) => {
  const type = c.req.query('type') as BackupType | undefined;
  const limit = Math.min(parseInt(c.req.query('limit') || '100') || 100, 500);

  try {
    const [backups, stats] = await Promise.all([
      listBackups(c.env, type, limit),
      getBackupStats(c.env),
    ]);
    return c.json({ success: true, data: backups, stats });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return c.json({ error: `백업 목록 조회 실패: ${msg}` }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// POST /api/admin/backups  → 수동 백업 생성
// ──────────────────────────────────────────────────────────────────
admin.post('/backups', async (c) => {
  const adminUser = c.get('admin');
  const username = adminUser?.username || 'unknown';

  let body: { type?: string; note?: string } = {};
  try {
    body = await c.req.json();
  } catch {
    // body 없으면 manual 기본
  }
  const type: BackupType = (body.type === 'daily' || body.type === 'weekly' || body.type === 'monthly')
    ? (body.type as BackupType)
    : 'manual';

  try {
    const result = await createBackup(c.env, type, username);
    if (result.success) {
      await logAudit(c, 'backup', `backup:${result.fileKey}`, {
        type,
        size: result.fileSize,
        tables: result.tableCount,
        rows: result.totalRows,
        duration_ms: result.durationMs,
      });
      return c.json({
        success: true,
        message: '백업이 성공적으로 생성되었습니다.',
        backup: result,
      });
    } else {
      await logAudit(c, 'backup', `backup:failed`, { error: result.error }, 'failed');
      return c.json({ error: `백업 실패: ${result.error}` }, 500);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await logAudit(c, 'backup', `backup:exception`, { error: msg }, 'failed');
    return c.json({ error: msg }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// GET /api/admin/backups/:id/download  → 백업 파일 다운로드
// ──────────────────────────────────────────────────────────────────
admin.get('/backups/:id/download', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (!Number.isFinite(id) || id <= 0) {
    return c.json({ error: '잘못된 백업 ID' }, 400);
  }

  try {
    const row = await c.env.DB.prepare(
      'SELECT file_key, file_size, file_sha256, backup_type, created_at FROM backup_history WHERE id = ?'
    )
      .bind(id)
      .first<{ file_key: string; file_size: number; file_sha256: string; backup_type: string; created_at: string }>();

    if (!row || !row.file_key) {
      return c.json({ error: '백업 기록을 찾을 수 없습니다.' }, 404);
    }

    const obj = await getBackupFile(c.env, row.file_key);
    if (!obj) {
      return c.json({ error: '백업 파일을 R2에서 찾을 수 없습니다.' }, 404);
    }

    await logAudit(c, 'export', `backup:${row.file_key}`, {
      id,
      type: row.backup_type,
      size: row.file_size,
    });

    // 파일명: koist-backup-{type}-{date}.json.gz
    const safeName = `koist-backup-${row.backup_type}-${row.created_at.slice(0, 10)}.json.gz`;
    const headers = new Headers();
    headers.set('Content-Type', 'application/gzip');
    headers.set('Content-Length', String(row.file_size));
    headers.set('Content-Disposition', `attachment; filename="${safeName}"`);
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Backup-SHA256', row.file_sha256 || '');
    return new Response(obj.body, { headers });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return c.json({ error: msg }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// GET /api/admin/backups/:id/verify  → 무결성 검증
// ──────────────────────────────────────────────────────────────────
admin.get('/backups/:id/verify', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (!Number.isFinite(id) || id <= 0) {
    return c.json({ error: '잘못된 백업 ID' }, 400);
  }

  try {
    const row = await c.env.DB.prepare(
      'SELECT file_key, file_sha256 FROM backup_history WHERE id = ?'
    )
      .bind(id)
      .first<{ file_key: string; file_sha256: string }>();

    if (!row) return c.json({ error: '백업 기록을 찾을 수 없습니다.' }, 404);

    const result = await verifyBackupIntegrity(c.env, row.file_key, row.file_sha256);
    await logAudit(c, 'view', `backup:verify:${row.file_key}`, {
      valid: result.valid,
    });
    return c.json({
      success: true,
      valid: result.valid,
      expected_hash: row.file_sha256,
      actual_hash: result.actualHash,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return c.json({ error: msg }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// POST /api/admin/backups/:id/restore  → 백업으로 복원 (위험)  [v39.32 강화]
// ──────────────────────────────────────────────────────────────────
// 비대칭 보호 모델 (백업=빠름 / 복원=신중):
//
//   [표준 복원] 1시간 이상 지난 백업 → 3단계 안전장치 모두 필수
//     1) confirm 필드에 정확히 "RESTORE-{YYYY-MM-DD}" 입력 (날짜 매칭 검증)
//     2) password 필드에 관리자 비밀번호 재입력 (재인증)
//     3) 자동 pre-restore 백업 생성
//
//   [응급 복원] 1시간 이내 생성 백업 → 단순화 (방금 실수 즉시 되돌리기)
//     1) emergency=true 플래그 + confirm: "EMERGENCY-RESTORE" (1단계 확인만)
//     2) 자동 pre-restore 백업 생성 (이건 절대 생략 안함)
//
//   공통:
//     - backup_history / admin_audit_logs 테이블은 복원 대상에서 제외
//     - 모든 시도는 감사 로그에 기록
// ──────────────────────────────────────────────────────────────────
admin.post('/backups/:id/restore', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (!Number.isFinite(id) || id <= 0) {
    return c.json({ error: '잘못된 백업 ID' }, 400);
  }

  let body: { confirm?: string; password?: string; emergency?: boolean } = {};
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: '잘못된 요청 본문' }, 400);
  }

  const adminUser = c.get('admin');
  if (!adminUser) return c.json({ error: 'Unauthorized' }, 401);
  const username = adminUser.username || 'unknown';

  try {
    // ─── 백업 기록 조회 (created_at 포함) ───
    const row = await c.env.DB.prepare(
      'SELECT file_key, created_at, backup_type FROM backup_history WHERE id = ?'
    )
      .bind(id)
      .first<{ file_key: string; created_at: string; backup_type: string }>();

    if (!row || !row.file_key) {
      return c.json({ error: '백업 기록을 찾을 수 없습니다.' }, 404);
    }

    // ─── 응급 복원 vs 표준 복원 분기 ───
    const isEmergencyEligible = isWithinEmergencyWindow(row.created_at);
    const requestedEmergency = body.emergency === true;

    if (requestedEmergency) {
      // 응급 복원 요청: 1시간 윈도우 검증
      if (!isEmergencyEligible) {
        await logAudit(c, 'restore', `backup:${id}`, {
          reason: 'emergency window expired',
          backup_age_min: Math.round((Date.now() - new Date(row.created_at.replace(' ', 'T') + 'Z').getTime()) / 60000),
        }, 'denied');
        return c.json(
          { error: '응급 복원은 생성된 지 1시간 이내 백업만 가능합니다. 표준 복원 절차(텍스트확인+비밀번호)를 사용하세요.' },
          400
        );
      }
      // 응급 복원: 1단계 확인만
      if (body.confirm !== 'EMERGENCY-RESTORE') {
        await logAudit(c, 'restore', `backup:${id}`, { reason: 'emergency: missing confirmation' }, 'denied');
        return c.json(
          { error: '응급 복원을 진행하려면 confirm 필드에 정확히 "EMERGENCY-RESTORE" 값을 입력해야 합니다.' },
          400
        );
      }
    } else {
      // ─── 표준 복원: 3단계 안전장치 ───

      // STEP 1: 날짜 포함 확인 토큰 검증
      const datePart = row.created_at.slice(0, 10); // "YYYY-MM-DD"
      const expectedConfirm = `RESTORE-${datePart}`;
      if (body.confirm !== expectedConfirm) {
        await logAudit(c, 'restore', `backup:${id}`, {
          reason: 'missing or wrong confirmation',
          expected_pattern: 'RESTORE-YYYY-MM-DD',
        }, 'denied');
        return c.json(
          { error: `복원을 진행하려면 confirm 필드에 정확히 "${expectedConfirm}" 값을 입력해야 합니다.` },
          400
        );
      }

      // STEP 2: 관리자 비밀번호 재인증
      if (!body.password || typeof body.password !== 'string') {
        await logAudit(c, 'restore', `backup:${id}`, { reason: 'missing password' }, 'denied');
        return c.json({ error: '복원을 진행하려면 관리자 비밀번호 재입력이 필요합니다.' }, 400);
      }

      const user = await c.env.DB.prepare(
        'SELECT password_hash, salt FROM admin_users WHERE id = ?'
      )
        .bind(adminUser.id)
        .first<{ password_hash: string; salt: string }>();

      if (!user) {
        return c.json({ error: '관리자 계정을 찾을 수 없습니다.' }, 404);
      }

      const validPwd = await verifyPassword(body.password, user.salt, user.password_hash);
      if (!validPwd) {
        await logAudit(c, 'restore', `backup:${id}`, { reason: 'wrong password' }, 'denied');
        return c.json({ error: '관리자 비밀번호가 올바르지 않습니다.' }, 401);
      }
    }

    // ─── STEP 3 (공통): 복원 실행 (내부에서 자동 pre-restore 생성) ───
    const triggerLabel = requestedEmergency ? `emergency:${username}` : username;
    const result = await restoreFromBackup(c.env, row.file_key, triggerLabel);

    if (result.success) {
      await logAudit(c, 'restore', `backup:${row.file_key}`, {
        mode: requestedEmergency ? 'emergency' : 'standard',
        pre_restore_backup: result.preRestoreBackupKey,
        restored_tables: result.restoredTables,
        restored_rows: result.restoredRows,
        duration_ms: result.durationMs,
        backup_type: row.backup_type,
      });
      return c.json({
        success: true,
        mode: requestedEmergency ? 'emergency' : 'standard',
        message: `복원 성공: ${result.restoredTables}개 테이블, ${result.restoredRows}개 행`,
        result,
      });
    } else {
      await logAudit(c, 'restore', `backup:${row.file_key}`, { error: result.error }, 'failed');
      return c.json({ error: `복원 실패: ${result.error}`, result }, 500);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await logAudit(c, 'restore', `backup:exception`, { error: msg }, 'failed');
    return c.json({ error: msg }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// v39.32: POST /api/admin/backups/emergency  → 응급 백업 (원클릭)
// ──────────────────────────────────────────────────────────────────
// "지금 큰 작업 하기 전인데 일단 백업해두고 싶어" 시나리오용.
// - 인증된 관리자라면 누구나 호출 가능 (확인 모달 없이 즉시 실행)
// - 항상 'manual' 타입으로 생성 (무기한 보존)
// - 부담 없이 자주 누르도록 설계 — Rate limit만 있음 (1분 1회)
// ──────────────────────────────────────────────────────────────────
admin.post('/backups/emergency', async (c) => {
  const adminUser = c.get('admin');
  if (!adminUser) return c.json({ error: 'Unauthorized' }, 401);
  const username = adminUser.username || 'unknown';

  // 간단한 rate limit (KV 기반, 같은 user가 1분에 1회만)
  if (c.env.RATE_LIMIT_KV) {
    const key = `rl:emergency-backup:${adminUser.id}`;
    const existing = await c.env.RATE_LIMIT_KV.get(key);
    if (existing) {
      return c.json(
        { error: '응급 백업은 1분에 1회만 가능합니다. 잠시 후 다시 시도하세요.' },
        429
      );
    }
    await c.env.RATE_LIMIT_KV.put(key, '1', { expirationTtl: 60 });
  }

  try {
    const result = await createBackup(c.env, 'manual', `emergency:${username}`);
    if (result.success) {
      await logAudit(c, 'backup', `backup:${result.fileKey}`, {
        type: 'manual',
        trigger: 'emergency',
        fileSize: result.fileSize,
        tableCount: result.tableCount,
        totalRows: result.totalRows,
        durationMs: result.durationMs,
      });
      return c.json({ success: true, backup: result });
    } else {
      await logAudit(c, 'backup', `backup:emergency:failed`, { error: result.error }, 'failed');
      return c.json({ error: result.error || '응급 백업 실패' }, 500);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await logAudit(c, 'backup', `backup:emergency:exception`, { error: msg }, 'failed');
    return c.json({ error: msg }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// v39.32: POST /api/admin/backups/cleanup  → GFS 보존 정책 수동 실행
// ──────────────────────────────────────────────────────────────────
// 관리자가 admin UI에서 즉시 정리를 트리거하고 싶을 때 사용.
// (자동 cleanup은 매주 일요일 새벽 5시 cron-job.org가 호출)
// ──────────────────────────────────────────────────────────────────
admin.post('/backups/cleanup', async (c) => {
  const adminUser = c.get('admin');
  if (!adminUser) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const result = await applyAllRetentionPolicies(c.env);
    await logAudit(c, 'delete', 'backup:cleanup:manual', {
      totalDeleted: result.totalDeleted,
      byType: result.byType,
      durationMs: result.durationMs,
    }, result.success ? 'success' : 'failed');

    return c.json({
      success: result.success,
      totalDeleted: result.totalDeleted,
      byType: result.byType,
      durationMs: result.durationMs,
      error: result.error,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return c.json({ error: msg }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// v39.32: GET /api/admin/backups/retention-policy
// ──────────────────────────────────────────────────────────────────
// UI에서 현재 보존 정책을 표시하기 위한 read-only 엔드포인트
// ──────────────────────────────────────────────────────────────────
admin.get('/backups/retention-policy', async (c) => {
  return c.json({
    success: true,
    policy: RETENTION_POLICY,
    emergency_window_minutes: EMERGENCY_RESTORE_WINDOW_MS / 60000,
  });
});

// ──────────────────────────────────────────────────────────────────
// DELETE /api/admin/backups/:id  → 백업 삭제 (R2 + DB)
// ──────────────────────────────────────────────────────────────────
admin.delete('/backups/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (!Number.isFinite(id) || id <= 0) {
    return c.json({ error: '잘못된 백업 ID' }, 400);
  }

  try {
    const row = await c.env.DB.prepare(
      'SELECT file_key FROM backup_history WHERE id = ?'
    )
      .bind(id)
      .first<{ file_key: string }>();

    const result = await deleteBackup(c.env, id);
    if (result.success) {
      await logAudit(c, 'delete', `backup:${row?.file_key || id}`, { id });
      return c.json({ success: true });
    } else {
      return c.json({ error: result.error || '삭제 실패' }, 500);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return c.json({ error: msg }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────
// GET /api/admin/audit-logs  → 감사 로그 조회 (Phase 3 인프라)
// ──────────────────────────────────────────────────────────────────
admin.get('/audit-logs', async (c) => {
  const limit = Math.min(parseInt(c.req.query('limit') || '100') || 100, 500);
  const action = c.req.query('action') || '';
  const username = c.req.query('username') || '';

  let query = 'SELECT * FROM admin_audit_logs WHERE 1=1';
  const binds: any[] = [];
  if (action) {
    query += ' AND action = ?';
    binds.push(action);
  }
  if (username) {
    query += ' AND admin_username = ?';
    binds.push(username);
  }
  query += ' ORDER BY created_at DESC LIMIT ?';
  binds.push(limit);

  try {
    const result = await c.env.DB.prepare(query).bind(...binds).all();
    return c.json({ success: true, data: result.results });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return c.json({ error: msg }, 500);
  }
});

export default admin;

// ═══════════════════════════════════════════════════════════════════
// KOIST Backup Utility (Phase 2 - v39.28)
// ═══════════════════════════════════════════════════════════════════
// 목적: D1 데이터베이스 전체 백업 → gzip 압축 → SHA-256 무결성 검증
//       → R2 업로드 → backup_history 기록 → 보존 정책 적용
//
// 전략: 3-2-1 백업 (3개 사본 / 2개 저장소 / 1개 오프사이트)
//   - 원본: Cloudflare D1 (koist-website-db)
//   - 사본 1: R2 (koist-images / backups/)
//   - 사본 2: 관리자 다운로드 (오프사이트)
//
// 보존 정책:
//   - daily   : 7일  (매일 03:00 KST)
//   - weekly  : 4주  (매주 일요일 04:00 KST)
//   - monthly : 12개월 (매월 1일 05:00 KST)
//   - manual  : 무기한 (관리자 명시적 삭제 시까지)
//   - pre-restore : 30일 (복원 전 자동 백업)
// ═══════════════════════════════════════════════════════════════════

import type { Bindings } from '../types';

// ───────────────────────────────────────────────────────────────────
// 타입 정의
// ───────────────────────────────────────────────────────────────────
export type BackupType = 'daily' | 'weekly' | 'monthly' | 'manual' | 'pre-restore';

export interface BackupResult {
  success: boolean;
  fileKey: string;
  fileSize: number;
  fileSha256: string;
  tableCount: number;
  totalRows: number;
  rowCounts: Record<string, number>;
  durationMs: number;
  error?: string;
}

export interface BackupRecord {
  id: number;
  backup_type: string;
  file_key: string;
  file_size: number;
  file_sha256: string;
  row_counts: string;
  table_count: number;
  total_rows: number;
  triggered_by: string;
  status: string;
  error_message: string | null;
  duration_ms: number;
  created_at: string;
}

// ───────────────────────────────────────────────────────────────────
// 백업에서 제외할 시스템/임시 테이블
// ───────────────────────────────────────────────────────────────────
const EXCLUDED_TABLES = new Set<string>([
  'sqlite_sequence',
  'sqlite_stat1',
  'sqlite_stat4',
  '_cf_KV',
  'd1_migrations',
  // 백업 자체 메타데이터는 백업하지 않음 (복원 시 순환 참조 회피)
  // 단, backup_history 는 백업하되 복원 시는 별도 처리
]);

// ───────────────────────────────────────────────────────────────────
// 유틸: SHA-256 해시 계산 (Web Crypto API)
// ───────────────────────────────────────────────────────────────────
async function sha256(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ───────────────────────────────────────────────────────────────────
// 유틸: gzip 압축 (Web Streams API - Cloudflare Workers 지원)
// ───────────────────────────────────────────────────────────────────
async function gzipCompress(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(data);
  writer.close();
  const reader = cs.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLen = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLen += value.length;
  }
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

// ───────────────────────────────────────────────────────────────────
// 유틸: gzip 압축 해제 (복원 시 사용)
// ───────────────────────────────────────────────────────────────────
export async function gzipDecompress(data: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(data);
  writer.close();
  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLen = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLen += value.length;
  }
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

// ───────────────────────────────────────────────────────────────────
// 유틸: SQL 리터럴 이스케이프
// ───────────────────────────────────────────────────────────────────
function sqlEscape(value: any): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') {
    if (!isFinite(value)) return 'NULL';
    return String(value);
  }
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    // BLOB → hex
    const bytes = value instanceof ArrayBuffer ? new Uint8Array(value) : new Uint8Array((value as ArrayBufferView).buffer);
    let hex = '';
    for (const b of bytes) hex += b.toString(16).padStart(2, '0');
    return `X'${hex}'`;
  }
  const s = String(value).replace(/'/g, "''");
  return `'${s}'`;
}

// ───────────────────────────────────────────────────────────────────
// 핵심: D1 테이블 목록 조회
// ───────────────────────────────────────────────────────────────────
async function listUserTables(db: D1Database): Promise<string[]> {
  const result = await db
    .prepare(
      `SELECT name FROM sqlite_master 
       WHERE type='table' 
         AND name NOT LIKE 'sqlite_%' 
         AND name NOT LIKE '_cf_%'
         AND name NOT LIKE 'd1_%'
       ORDER BY name`
    )
    .all<{ name: string }>();
  return (result.results || [])
    .map((r) => r.name)
    .filter((n) => !EXCLUDED_TABLES.has(n));
}

// ───────────────────────────────────────────────────────────────────
// 핵심: 테이블 스키마 조회
// ───────────────────────────────────────────────────────────────────
async function getTableSchema(db: D1Database, table: string): Promise<string> {
  const result = await db
    .prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`)
    .bind(table)
    .first<{ sql: string }>();
  return result?.sql || '';
}

// ───────────────────────────────────────────────────────────────────
// 핵심: 인덱스 스키마 조회 (CREATE INDEX 문 복원용)
// ───────────────────────────────────────────────────────────────────
async function getTableIndexes(db: D1Database, table: string): Promise<string[]> {
  const result = await db
    .prepare(
      `SELECT sql FROM sqlite_master 
       WHERE type='index' AND tbl_name=? AND sql IS NOT NULL`
    )
    .bind(table)
    .all<{ sql: string }>();
  return (result.results || []).map((r) => r.sql).filter(Boolean);
}

// ───────────────────────────────────────────────────────────────────
// 핵심: 백업 페이로드 생성 (JSON + SQL 하이브리드)
// ───────────────────────────────────────────────────────────────────
// 포맷 v1:
// {
//   "format": "koist-backup-v1",
//   "created_at": "ISO",
//   "database": "koist-website-db",
//   "tables": [{ name, schema, indexes[], columns[], rows[][] }],
//   "row_counts": { table: count },
//   "sql_restore": "-- SQL 복원 스크립트 (전체)"
// }
// ───────────────────────────────────────────────────────────────────
interface BackupPayload {
  format: string;
  version: string;
  created_at: string;
  database: string;
  table_count: number;
  total_rows: number;
  row_counts: Record<string, number>;
  tables: Array<{
    name: string;
    schema: string;
    indexes: string[];
    columns: string[];
    rows: any[][];
  }>;
  sql_restore: string;
}

async function buildBackupPayload(db: D1Database): Promise<BackupPayload> {
  const tables = await listUserTables(db);
  const payload: BackupPayload = {
    format: 'koist-backup-v1',
    version: 'v39.28',
    created_at: new Date().toISOString(),
    database: 'koist-website-db',
    table_count: 0,
    total_rows: 0,
    row_counts: {},
    tables: [],
    sql_restore: '',
  };

  const sqlLines: string[] = [
    '-- ═══════════════════════════════════════════════════════════════',
    `-- KOIST D1 Backup - ${payload.created_at}`,
    `-- Database: ${payload.database}`,
    `-- Format: ${payload.format} (${payload.version})`,
    '-- ═══════════════════════════════════════════════════════════════',
    '-- ⚠️ WARNING: 이 스크립트는 모든 데이터를 덮어씁니다!',
    '-- 복원 전 반드시 pre-restore 백업이 자동 생성됩니다.',
    '-- ═══════════════════════════════════════════════════════════════',
    'PRAGMA foreign_keys = OFF;',
    'BEGIN TRANSACTION;',
    '',
  ];

  for (const table of tables) {
    const schema = await getTableSchema(db, table);
    const indexes = await getTableIndexes(db, table);

    // 전체 행 조회 (D1 free tier 한도 고려: 테이블당 ~50K rows 권장)
    const rowsResult = await db.prepare(`SELECT * FROM "${table}"`).all<Record<string, any>>();
    const rows = rowsResult.results || [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    payload.row_counts[table] = rows.length;
    payload.total_rows += rows.length;
    payload.tables.push({
      name: table,
      schema,
      indexes,
      columns,
      rows: rows.map((r) => columns.map((c) => r[c])),
    });

    // SQL 복원 스크립트 생성
    sqlLines.push(`-- ─── Table: ${table} (${rows.length} rows) ───`);
    sqlLines.push(`DROP TABLE IF EXISTS "${table}";`);
    if (schema) sqlLines.push(`${schema};`);
    if (rows.length > 0 && columns.length > 0) {
      const colList = columns.map((c) => `"${c}"`).join(', ');
      // 배치 INSERT (50 rows씩)
      const BATCH = 50;
      for (let i = 0; i < rows.length; i += BATCH) {
        const batch = rows.slice(i, i + BATCH);
        const valuesList = batch
          .map((r) => `(${columns.map((c) => sqlEscape(r[c])).join(', ')})`)
          .join(',\n  ');
        sqlLines.push(`INSERT INTO "${table}" (${colList}) VALUES\n  ${valuesList};`);
      }
    }
    for (const idx of indexes) sqlLines.push(`${idx};`);
    sqlLines.push('');
  }

  sqlLines.push('COMMIT;');
  sqlLines.push('PRAGMA foreign_keys = ON;');
  sqlLines.push('-- ═══ End of Backup ═══');

  payload.table_count = tables.length;
  payload.sql_restore = sqlLines.join('\n');

  return payload;
}

// ───────────────────────────────────────────────────────────────────
// 메인: 백업 생성 (D1 → JSON+SQL → gzip → R2 → DB 기록)
// ───────────────────────────────────────────────────────────────────
export async function createBackup(
  env: Bindings,
  type: BackupType,
  triggeredBy: string
): Promise<BackupResult> {
  const startTime = Date.now();
  const db = env.DB;
  const r2 = env.R2;

  if (!r2) {
    return {
      success: false,
      fileKey: '',
      fileSize: 0,
      fileSha256: '',
      tableCount: 0,
      totalRows: 0,
      rowCounts: {},
      durationMs: Date.now() - startTime,
      error: 'R2 bucket not configured',
    };
  }

  try {
    // 1) 페이로드 생성
    const payload = await buildBackupPayload(db);
    const jsonStr = JSON.stringify(payload, null, 0); // minified
    const jsonBytes = new TextEncoder().encode(jsonStr);

    // 2) gzip 압축
    const gzipped = await gzipCompress(jsonBytes);

    // 3) SHA-256 무결성 해시
    const hash = await sha256(gzipped);

    // 4) R2 키 생성: backups/{type}/{YYYY-MM-DD_HHmmss}_{hash8}.json.gz
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}`;
    const timeStr = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
    const hash8 = hash.slice(0, 8);
    const fileKey = `backups/${type}/${dateStr}_${timeStr}_${hash8}.json.gz`;

    // 5) R2 업로드
    await r2.put(fileKey, gzipped, {
      httpMetadata: {
        contentType: 'application/gzip',
        contentDisposition: `attachment; filename="koist-backup-${dateStr}.json.gz"`,
      },
      customMetadata: {
        format: payload.format,
        version: payload.version,
        sha256: hash,
        tableCount: String(payload.table_count),
        totalRows: String(payload.total_rows),
        triggeredBy,
        backupType: type,
      },
    });

    const durationMs = Date.now() - startTime;

    // 6) backup_history 기록
    await db
      .prepare(
        `INSERT INTO backup_history 
         (backup_type, file_key, file_size, file_sha256, row_counts, 
          table_count, total_rows, triggered_by, status, duration_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        type,
        fileKey,
        gzipped.length,
        hash,
        JSON.stringify(payload.row_counts),
        payload.table_count,
        payload.total_rows,
        triggeredBy,
        'success',
        durationMs
      )
      .run();

    // 7) 보존 정책 적용 (실패해도 백업 자체는 성공으로 처리)
    try {
      await applyRetentionPolicy(env, type);
    } catch (e) {
      console.error('[backup] retention policy failed:', e);
    }

    return {
      success: true,
      fileKey,
      fileSize: gzipped.length,
      fileSha256: hash,
      tableCount: payload.table_count,
      totalRows: payload.total_rows,
      rowCounts: payload.row_counts,
      durationMs,
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errMsg = error instanceof Error ? error.message : String(error);
    // 실패 기록
    try {
      await db
        .prepare(
          `INSERT INTO backup_history 
           (backup_type, file_key, file_size, file_sha256, row_counts, 
            table_count, total_rows, triggered_by, status, error_message, duration_ms)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(type, '', 0, '', '{}', 0, 0, triggeredBy, 'failed', errMsg, durationMs)
        .run();
    } catch (logErr) {
      console.error('[backup] failed to log failure:', logErr);
    }
    return {
      success: false,
      fileKey: '',
      fileSize: 0,
      fileSha256: '',
      tableCount: 0,
      totalRows: 0,
      rowCounts: {},
      durationMs,
      error: errMsg,
    };
  }
}

// ───────────────────────────────────────────────────────────────────
// 보존 정책 적용 (R2 + backup_history 동시 정리)
// ───────────────────────────────────────────────────────────────────
const RETENTION_DAYS: Record<BackupType, number> = {
  daily: 7,
  weekly: 28,
  monthly: 365,
  manual: 0, // 0 = 무기한 (자동 삭제 안함)
  'pre-restore': 30,
};

async function applyRetentionPolicy(env: Bindings, type: BackupType): Promise<void> {
  const days = RETENTION_DAYS[type];
  if (days <= 0) return; // manual은 자동 삭제 안함

  const db = env.DB;
  const r2 = env.R2;
  if (!r2) return;

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const oldBackups = await db
    .prepare(
      `SELECT id, file_key FROM backup_history 
       WHERE backup_type = ? AND created_at < ? AND status = 'success'`
    )
    .bind(type, cutoff)
    .all<{ id: number; file_key: string }>();

  for (const row of oldBackups.results || []) {
    try {
      if (row.file_key) await r2.delete(row.file_key);
      await db.prepare(`DELETE FROM backup_history WHERE id = ?`).bind(row.id).run();
    } catch (e) {
      console.error('[backup] retention cleanup failed for', row.file_key, e);
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 백업 목록 조회 (관리자 UI용)
// ───────────────────────────────────────────────────────────────────
export async function listBackups(
  env: Bindings,
  filterType?: BackupType,
  limit = 100
): Promise<BackupRecord[]> {
  const db = env.DB;
  let query = 'SELECT * FROM backup_history';
  const binds: any[] = [];
  if (filterType) {
    query += ' WHERE backup_type = ?';
    binds.push(filterType);
  }
  query += ' ORDER BY created_at DESC LIMIT ?';
  binds.push(limit);
  const result = await db.prepare(query).bind(...binds).all<BackupRecord>();
  return result.results || [];
}

// ───────────────────────────────────────────────────────────────────
// 백업 파일 다운로드 (R2 → Response)
// ───────────────────────────────────────────────────────────────────
export async function getBackupFile(env: Bindings, fileKey: string): Promise<R2ObjectBody | null> {
  if (!env.R2) return null;
  return await env.R2.get(fileKey);
}

// ───────────────────────────────────────────────────────────────────
// 백업 무결성 검증 (SHA-256 재계산)
// ───────────────────────────────────────────────────────────────────
export async function verifyBackupIntegrity(
  env: Bindings,
  fileKey: string,
  expectedHash: string
): Promise<{ valid: boolean; actualHash: string }> {
  if (!env.R2) return { valid: false, actualHash: '' };
  const obj = await env.R2.get(fileKey);
  if (!obj) return { valid: false, actualHash: '' };
  const buf = new Uint8Array(await obj.arrayBuffer());
  const actualHash = await sha256(buf);
  return { valid: actualHash === expectedHash, actualHash };
}

// ───────────────────────────────────────────────────────────────────
// 백업으로부터 복원 (위험! 반드시 pre-restore 백업 자동 생성 후 실행)
// ───────────────────────────────────────────────────────────────────
export interface RestoreResult {
  success: boolean;
  preRestoreBackupKey?: string;
  restoredTables: number;
  restoredRows: number;
  durationMs: number;
  error?: string;
}

export async function restoreFromBackup(
  env: Bindings,
  fileKey: string,
  triggeredBy: string
): Promise<RestoreResult> {
  const startTime = Date.now();
  const db = env.DB;

  try {
    // ─── STEP 1: 복원 전 자동 안전 백업 (pre-restore) ───
    const safetyBackup = await createBackup(env, 'pre-restore', `auto-pre-restore:${triggeredBy}`);
    if (!safetyBackup.success) {
      return {
        success: false,
        restoredTables: 0,
        restoredRows: 0,
        durationMs: Date.now() - startTime,
        error: `안전 백업 실패로 복원 중단: ${safetyBackup.error}`,
      };
    }

    // ─── STEP 2: R2에서 백업 파일 가져오기 ───
    const obj = await env.R2!.get(fileKey);
    if (!obj) {
      return {
        success: false,
        preRestoreBackupKey: safetyBackup.fileKey,
        restoredTables: 0,
        restoredRows: 0,
        durationMs: Date.now() - startTime,
        error: '백업 파일을 R2에서 찾을 수 없습니다.',
      };
    }

    // ─── STEP 3: 무결성 검증 ───
    const buf = new Uint8Array(await obj.arrayBuffer());
    const actualHash = await sha256(buf);
    const expectedHash = obj.customMetadata?.sha256 || '';
    if (expectedHash && actualHash !== expectedHash) {
      return {
        success: false,
        preRestoreBackupKey: safetyBackup.fileKey,
        restoredTables: 0,
        restoredRows: 0,
        durationMs: Date.now() - startTime,
        error: `무결성 검증 실패! expected=${expectedHash}, actual=${actualHash}`,
      };
    }

    // ─── STEP 4: 압축 해제 + JSON 파싱 ───
    const decompressed = await gzipDecompress(buf);
    const jsonStr = new TextDecoder().decode(decompressed);
    const payload = JSON.parse(jsonStr) as BackupPayload;

    if (payload.format !== 'koist-backup-v1') {
      return {
        success: false,
        preRestoreBackupKey: safetyBackup.fileKey,
        restoredTables: 0,
        restoredRows: 0,
        durationMs: Date.now() - startTime,
        error: `지원하지 않는 백업 포맷: ${payload.format}`,
      };
    }

    // ─── STEP 5: 복원 실행 (테이블별 DROP + CREATE + INSERT) ───
    // ⚠️ D1은 BEGIN TRANSACTION 멀티스테이트먼트 미지원 → batch() API 사용
    let restoredRows = 0;
    let restoredTables = 0;

    for (const table of payload.tables) {
      // backup_history 자체는 복원하지 않음 (현재 진행 중인 작업 보존)
      if (table.name === 'backup_history' || table.name === 'admin_audit_logs') {
        continue;
      }

      const stmts: D1PreparedStatement[] = [];
      stmts.push(db.prepare(`DROP TABLE IF EXISTS "${table.name}"`));
      if (table.schema) stmts.push(db.prepare(table.schema));

      if (table.rows.length > 0 && table.columns.length > 0) {
        const colList = table.columns.map((c) => `"${c}"`).join(', ');
        const placeholders = table.columns.map(() => '?').join(', ');
        const insertSql = `INSERT INTO "${table.name}" (${colList}) VALUES (${placeholders})`;
        for (const row of table.rows) {
          stmts.push(db.prepare(insertSql).bind(...row));
        }
      }

      for (const idx of table.indexes) {
        stmts.push(db.prepare(idx));
      }

      // D1 batch (최대 1000 statements 권장)
      const BATCH = 100;
      for (let i = 0; i < stmts.length; i += BATCH) {
        await db.batch(stmts.slice(i, i + BATCH));
      }

      restoredTables++;
      restoredRows += table.rows.length;
    }

    return {
      success: true,
      preRestoreBackupKey: safetyBackup.fileKey,
      restoredTables,
      restoredRows,
      durationMs: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      restoredTables: 0,
      restoredRows: 0,
      durationMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ───────────────────────────────────────────────────────────────────
// 백업 삭제 (R2 + DB 동시)
// ───────────────────────────────────────────────────────────────────
export async function deleteBackup(env: Bindings, id: number): Promise<{ success: boolean; error?: string }> {
  const db = env.DB;
  try {
    const row = await db
      .prepare('SELECT file_key FROM backup_history WHERE id = ?')
      .bind(id)
      .first<{ file_key: string }>();
    if (!row) return { success: false, error: '백업 기록을 찾을 수 없습니다.' };

    if (row.file_key && env.R2) {
      try {
        await env.R2.delete(row.file_key);
      } catch (e) {
        // R2 삭제 실패해도 DB 기록은 삭제 (R2 객체가 이미 없을 수 있음)
        console.error('[backup] R2 delete failed:', e);
      }
    }
    await db.prepare('DELETE FROM backup_history WHERE id = ?').bind(id).run();
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// ───────────────────────────────────────────────────────────────────
// 백업 통계 (대시보드용)
// ───────────────────────────────────────────────────────────────────
export async function getBackupStats(env: Bindings): Promise<{
  total: number;
  totalSize: number;
  byType: Record<string, { count: number; size: number }>;
  latest: BackupRecord | null;
}> {
  const db = env.DB;
  const all = await db
    .prepare(
      `SELECT backup_type, COUNT(*) as cnt, COALESCE(SUM(file_size),0) as total_size 
       FROM backup_history WHERE status = 'success' GROUP BY backup_type`
    )
    .all<{ backup_type: string; cnt: number; total_size: number }>();

  const byType: Record<string, { count: number; size: number }> = {};
  let total = 0;
  let totalSize = 0;
  for (const row of all.results || []) {
    byType[row.backup_type] = { count: row.cnt, size: row.total_size };
    total += row.cnt;
    totalSize += row.total_size;
  }

  const latest = await db
    .prepare(`SELECT * FROM backup_history WHERE status = 'success' ORDER BY created_at DESC LIMIT 1`)
    .first<BackupRecord>();

  return { total, totalSize, byType, latest };
}

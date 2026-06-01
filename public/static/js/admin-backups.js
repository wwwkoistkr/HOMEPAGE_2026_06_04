// ═══════════════════════════════════════════════════════════════════
// KOIST Admin - Backup Management UI (v39.32 - Asymmetric Safety)
// ═══════════════════════════════════════════════════════════════════
// v39.32 변경사항:
//   - GFS 보존 정책 안내 (Daily 14 / Weekly 8 / Monthly 12 / Manual ∞)
//   - 수동 cleanup 버튼 추가
//   - 복원 3단계 안전장치:
//       1) "RESTORE-YYYY-MM-DD" 정확 입력
//       2) 관리자 비밀번호 재입력
//       3) 자동 pre-restore 백업 (서버측)
//   - 응급 복원 ⚡: 1시간 이내 백업 한정 1단계 확인
// ═══════════════════════════════════════════════════════════════════
(async function () {
  'use strict';
  const container = document.getElementById('admin-content');

  // 1시간 (응급 복원 윈도우) — 서버측과 동일
  const EMERGENCY_WINDOW_MS = 60 * 60 * 1000;

  // ──────────────────────────────────────────────────────────────
  // 유틸: 바이트를 사람이 읽기 쉬운 단위로
  // ──────────────────────────────────────────────────────────────
  function formatBytes(bytes) {
    if (!bytes || bytes < 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return n.toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
  }

  // ISO/SQLite timestamp → Date (UTC 가정)
  function parseTs(iso) {
    if (!iso) return null;
    const normalized = iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z';
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }

  function formatDate(iso) {
    const d = parseTs(iso);
    if (!d) return iso || '-';
    // KST 변환
    const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    return (
      kst.getUTCFullYear() +
      '-' +
      pad(kst.getUTCMonth() + 1) +
      '-' +
      pad(kst.getUTCDate()) +
      ' ' +
      pad(kst.getUTCHours()) +
      ':' +
      pad(kst.getUTCMinutes())
    );
  }

  // YYYY-MM-DD (UTC 기준 — 서버 confirm 토큰과 일치시키기 위함)
  function dateOnlyUtc(iso) {
    if (!iso) return '';
    return String(iso).slice(0, 10);
  }

  // 1시간 이내 생성된 백업인지
  function isEmergencyEligible(iso) {
    const d = parseTs(iso);
    if (!d) return false;
    return Date.now() - d.getTime() <= EMERGENCY_WINDOW_MS;
  }

  function typeBadge(type) {
    const map = {
      daily: { bg: 'bg-blue-50', text: 'text-blue-600', label: '일일' },
      weekly: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: '주간' },
      monthly: { bg: 'bg-purple-50', text: 'text-purple-600', label: '월간' },
      manual: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: '수동' },
      'pre-restore': { bg: 'bg-orange-50', text: 'text-orange-600', label: '복원전' },
    };
    const m = map[type] || { bg: 'bg-gray-50', text: 'text-gray-600', label: type };
    return (
      '<span class="px-2 py-0.5 rounded text-xs font-medium ' +
      m.bg +
      ' ' +
      m.text +
      '">' +
      m.label +
      '</span>'
    );
  }

  function statusBadge(status) {
    const map = {
      success: { bg: 'bg-green-50', text: 'text-green-600', label: '성공', icon: 'fa-check-circle' },
      failed: { bg: 'bg-red-50', text: 'text-red-600', label: '실패', icon: 'fa-times-circle' },
      partial: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: '부분', icon: 'fa-exclamation-circle' },
      restoring: { bg: 'bg-blue-50', text: 'text-blue-600', label: '복원중', icon: 'fa-spinner fa-spin' },
    };
    const m = map[status] || { bg: 'bg-gray-50', text: 'text-gray-600', label: status, icon: 'fa-question' };
    return (
      '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ' +
      m.bg +
      ' ' +
      m.text +
      '"><i class="fas ' +
      m.icon +
      '"></i>' +
      m.label +
      '</span>'
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 메인 렌더링
  // ──────────────────────────────────────────────────────────────
  await load();

  // 전역에 노출: 응급 백업 버튼이 백업 페이지에 있을 때 목록 자동 새로고침
  window.reloadBackupsList = function() {
    load().catch(function(e) { console.error('reload failed:', e); });
  };

  async function load() {
    container.innerHTML =
      '<p class="text-gray-400 text-center py-12"><i class="fas fa-spinner fa-spin mr-2"></i> 백업 목록을 불러오는 중...</p>';

    const d = await apiCall('/api/admin/backups');
    if (!d || !d.success) {
      container.innerHTML =
        '<div class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg"><i class="fas fa-exclamation-triangle mr-2"></i>백업 목록을 불러올 수 없습니다. ' +
        (d && d.error ? d.error : '') +
        '</div>';
      return;
    }

    const list = d.data || [];
    const stats = d.stats || { total: 0, totalSize: 0, byType: {}, latest: null };

    // ─── 상단: 통계 카드 + 액션 버튼 ───
    let h = '';
    h += '<div class="mb-6">';
    h += '  <div class="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-xl p-5 mb-4">';
    h += '    <div class="flex items-start justify-between flex-wrap gap-3">';
    h += '      <div class="flex items-start gap-3">';
    h += '        <div class="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">';
    h += '          <i class="fas fa-shield-alt text-emerald-600 text-xl"></i>';
    h += '        </div>';
    h += '        <div>';
    h += '          <h3 class="font-bold text-gray-800 text-base">3-2-1 백업 전략 활성화 · GFS 보존 정책</h3>';
    h += '          <p class="text-sm text-gray-600 mt-1">D1(원본) + R2(자동백업) + 관리자 다운로드(오프사이트)</p>';
    h += '          <p class="text-xs text-gray-500 mt-1.5"><i class="fas fa-clock mr-1"></i>자동 백업: 매일 03:00 · 매주 일요일 04:00 · 매월 1일 05:00 (KST)</p>';
    h += '          <p class="text-xs text-gray-500 mt-1"><i class="fas fa-broom mr-1"></i>자동 정리: 매주 일요일 05:00 · 보존: Daily 14개 · Weekly 8개 · Monthly 12개 · Manual <strong>무제한</strong></p>';
    h += '        </div>';
    h += '      </div>';
    h += '      <div class="flex flex-col sm:flex-row gap-2">';
    h += '        <button id="btn-cleanup" class="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium shadow-sm transition flex items-center gap-2 text-sm" title="GFS 보존 정책에 따라 오래된 백업 즉시 정리">';
    h += '          <i class="fas fa-broom"></i> 지금 정리';
    h += '        </button>';
    h += '        <button id="btn-create-backup" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition flex items-center gap-2">';
    h += '          <i class="fas fa-plus"></i> 수동 백업 생성';
    h += '        </button>';
    h += '      </div>';
    h += '    </div>';
    h += '  </div>';

    // ─── 통계 그리드 ───
    h += '  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">';
    h += statCard('총 백업', stats.total + '건', 'fa-database', 'text-blue-500', formatBytes(stats.totalSize));
    h += statCard('일일 (최대 14)', (stats.byType.daily ? stats.byType.daily.count : 0) + '건', 'fa-calendar-day', 'text-blue-500', stats.byType.daily ? formatBytes(stats.byType.daily.size) : '');
    h += statCard('주간 (최대 8)', (stats.byType.weekly ? stats.byType.weekly.count : 0) + '건', 'fa-calendar-week', 'text-indigo-500', stats.byType.weekly ? formatBytes(stats.byType.weekly.size) : '');
    h += statCard('월간 (최대 12)', (stats.byType.monthly ? stats.byType.monthly.count : 0) + '건', 'fa-calendar', 'text-purple-500', stats.byType.monthly ? formatBytes(stats.byType.monthly.size) : '');
    h += '  </div>';
    h += '</div>';

    // ─── 응급 복원 안내 (1시간 이내 백업이 있을 때만) ───
    const recentBackups = list.filter(function(b) {
      return b.status === 'success' && b.file_key && isEmergencyEligible(b.created_at);
    });
    if (recentBackups.length > 0) {
      h += '<div class="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">';
      h += '  <i class="fas fa-bolt text-amber-500 text-lg mt-0.5"></i>';
      h += '  <div class="flex-1 text-sm">';
      h += '    <p class="font-semibold text-amber-800">⚡ 응급 복원 모드 활성</p>';
      h += '    <p class="text-amber-700 mt-0.5">최근 1시간 이내 생성된 백업 ' + recentBackups.length + '건은 ⚡ 버튼으로 빠르게 복원할 수 있습니다 (1단계 확인). 1시간 이상 지난 백업은 표준 절차(비밀번호 재입력 포함)를 거칩니다.</p>';
      h += '  </div>';
      h += '</div>';
    }

    // ─── 필터 + 새로고침 ───
    h += '<div class="flex items-center justify-between mb-3 flex-wrap gap-2">';
    h += '  <div class="flex items-center gap-2">';
    h += '    <select id="filter-type" class="px-3 py-2 border border-gray-200 rounded-lg text-sm">';
    h += '      <option value="">전체 유형</option>';
    h += '      <option value="daily">일일</option>';
    h += '      <option value="weekly">주간</option>';
    h += '      <option value="monthly">월간</option>';
    h += '      <option value="manual">수동</option>';
    h += '      <option value="pre-restore">복원전 자동</option>';
    h += '    </select>';
    h += '    <span class="text-xs text-gray-500">총 ' + list.length + '건</span>';
    h += '  </div>';
    h += '  <button id="btn-refresh" class="text-sm text-gray-600 hover:text-blue-600"><i class="fas fa-sync mr-1"></i>새로고침</button>';
    h += '</div>';

    // ─── 테이블 ───
    h += '<div class="bg-white rounded-xl border border-gray-100 overflow-hidden">';
    h += '<div class="overflow-x-auto">';
    h += '<table class="w-full text-sm">';
    h += '<thead class="bg-gray-50 border-b border-gray-100">';
    h += '<tr>';
    h += '  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">유형</th>';
    h += '  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">생성일시 (KST)</th>';
    h += '  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">크기</th>';
    h += '  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">테이블</th>';
    h += '  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">행 수</th>';
    h += '  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">트리거</th>';
    h += '  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">상태</th>';
    h += '  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">작업</th>';
    h += '</tr>';
    h += '</thead>';
    h += '<tbody>';

    if (list.length === 0) {
      h += '<tr><td colspan="8" class="px-4 py-12 text-center text-gray-400">';
      h += '<i class="fas fa-inbox text-2xl mb-2 block opacity-50"></i>';
      h += '아직 백업 기록이 없습니다. 우측 상단의 "수동 백업 생성" 버튼을 눌러 첫 백업을 만들어 보세요.';
      h += '</td></tr>';
    } else {
      list.forEach(function (b) {
        const duration = b.duration_ms ? (b.duration_ms / 1000).toFixed(1) + 's' : '-';
        const emergencyEligible = b.status === 'success' && b.file_key && isEmergencyEligible(b.created_at);
        h += '<tr class="border-b border-gray-50 hover:bg-gray-50/50 transition">';
        h += '<td class="px-4 py-3">' + typeBadge(b.backup_type);
        if (emergencyEligible) {
          h += ' <span class="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700" title="1시간 이내 생성 - 응급 복원 가능">⚡ 응급</span>';
        }
        h += '</td>';
        h += '<td class="px-4 py-3 text-gray-700 whitespace-nowrap">' + formatDate(b.created_at) + '</td>';
        h += '<td class="px-4 py-3 text-right text-gray-700 whitespace-nowrap">' + formatBytes(b.file_size) + '</td>';
        h += '<td class="px-4 py-3 text-right text-gray-600">' + (b.table_count || 0) + '</td>';
        h += '<td class="px-4 py-3 text-right text-gray-600">' + (b.total_rows || 0).toLocaleString() + '</td>';
        h += '<td class="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">' + escapeHtml(b.triggered_by || '-') + '<br><span class="text-gray-400">' + duration + '</span></td>';
        h += '<td class="px-4 py-3 text-center">' + statusBadge(b.status) + '</td>';
        h += '<td class="px-4 py-3 text-right whitespace-nowrap">';
        if (b.status === 'success' && b.file_key) {
          h += '<button onclick="downloadBackup(' + b.id + ')" class="text-xs px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 mr-1" title="다운로드"><i class="fas fa-download"></i></button>';
          h += '<button onclick="verifyBackup(' + b.id + ')" class="text-xs px-2 py-1 rounded border border-purple-200 text-purple-600 hover:bg-purple-50 mr-1" title="무결성 검증"><i class="fas fa-check-double"></i></button>';
          if (emergencyEligible) {
            h += '<button onclick="emergencyRestore(' + b.id + ', \'' + escapeAttr(b.backup_type) + '\', \'' + escapeAttr(formatDate(b.created_at)) + '\')" class="text-xs px-2 py-1 rounded border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 mr-1 font-semibold" title="⚡ 응급 복원 (1시간 이내 백업)"><i class="fas fa-bolt"></i></button>';
          }
          h += '<button onclick="restoreBackup(' + b.id + ', \'' + escapeAttr(b.backup_type) + '\', \'' + escapeAttr(formatDate(b.created_at)) + '\', \'' + escapeAttr(dateOnlyUtc(b.created_at)) + '\')" class="text-xs px-2 py-1 rounded border border-orange-200 text-orange-600 hover:bg-orange-50 mr-1" title="표준 복원 (3단계 확인)"><i class="fas fa-undo"></i></button>';
        }
        h += '<button onclick="deleteBackup(' + b.id + ')" class="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50" title="삭제"><i class="fas fa-trash"></i></button>';
        h += '</td>';
        h += '</tr>';

        // 오류 행 (있을 경우)
        if (b.status !== 'success' && b.error_message) {
          h += '<tr class="bg-red-50/30"><td colspan="8" class="px-4 py-2 text-xs text-red-600"><i class="fas fa-exclamation-triangle mr-1"></i>' + escapeHtml(b.error_message) + '</td></tr>';
        }
      });
    }

    h += '</tbody></table></div></div>';
    container.innerHTML = h;

    // 이벤트 바인딩
    document.getElementById('btn-create-backup').addEventListener('click', openCreateModal);
    document.getElementById('btn-cleanup').addEventListener('click', openCleanupModal);
    document.getElementById('btn-refresh').addEventListener('click', load);
    document.getElementById('filter-type').addEventListener('change', function (e) {
      loadFiltered(e.target.value);
    });
  }

  // ──────────────────────────────────────────────────────────────
  function statCard(label, value, icon, color, sub) {
    let s = '<div class="bg-white rounded-lg border border-gray-100 p-3">';
    s += '<div class="flex items-center justify-between mb-1">';
    s += '<span class="text-xs text-gray-500">' + label + '</span>';
    s += '<i class="fas ' + icon + ' ' + color + '"></i>';
    s += '</div>';
    s += '<div class="text-lg font-bold text-gray-800">' + value + '</div>';
    if (sub) s += '<div class="text-xs text-gray-400 mt-0.5">' + sub + '</div>';
    s += '</div>';
    return s;
  }

  async function loadFiltered(type) {
    const url = type ? '/api/admin/backups?type=' + encodeURIComponent(type) : '/api/admin/backups';
    const d = await apiCall(url);
    if (!d || !d.success) return;
    // 간단하게 전체 다시 로드
    await load();
    if (type) document.getElementById('filter-type').value = type;
  }

  // ──────────────────────────────────────────────────────────────
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/`/g, '&#96;');
  }

  // ──────────────────────────────────────────────────────────────
  // 모달: 백업 생성
  // ──────────────────────────────────────────────────────────────
  function openCreateModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    modal.innerHTML =
      '<div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">' +
      '  <h3 class="text-lg font-bold text-gray-800 mb-2"><i class="fas fa-database text-emerald-500 mr-2"></i>수동 백업 생성</h3>' +
      '  <p class="text-sm text-gray-500 mb-4">현재 데이터베이스 전체를 즉시 백업합니다. 보통 1~3초 소요됩니다.</p>' +
      '  <label class="block text-sm font-medium text-gray-700 mb-1.5">백업 유형</label>' +
      '  <select id="mb-type" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4">' +
      '    <option value="manual" selected>수동 (무제한 보존)</option>' +
      '    <option value="daily">일일 (최근 14개 보존)</option>' +
      '    <option value="weekly">주간 (최근 8개 보존)</option>' +
      '    <option value="monthly">월간 (최근 12개 보존)</option>' +
      '  </select>' +
      '  <div id="mb-status" class="hidden text-sm mb-3"></div>' +
      '  <div class="flex justify-end gap-2">' +
      '    <button id="mb-cancel" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>' +
      '    <button id="mb-submit" class="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"><i class="fas fa-save mr-1"></i>백업 시작</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#mb-cancel').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    modal.querySelector('#mb-submit').addEventListener('click', async () => {
      const type = modal.querySelector('#mb-type').value;
      const status = modal.querySelector('#mb-status');
      const btn = modal.querySelector('#mb-submit');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>백업 중...';
      status.className = 'text-sm mb-3 text-blue-600';
      status.classList.remove('hidden');
      status.innerHTML = '<i class="fas fa-cog fa-spin mr-1"></i>D1 → JSON+SQL → gzip → SHA-256 → R2 업로드 진행 중...';

      const result = await apiCall('/api/admin/backups', 'POST', { type });

      if (result && result.success) {
        status.className = 'text-sm mb-3 text-green-600';
        status.innerHTML =
          '<i class="fas fa-check-circle mr-1"></i>백업 성공! ' +
          result.backup.tableCount + '개 테이블, ' +
          result.backup.totalRows.toLocaleString() + '개 행, ' +
          formatBytes(result.backup.fileSize) + ', ' +
          (result.backup.durationMs / 1000).toFixed(1) + '초 소요';
        setTimeout(() => { close(); load(); }, 2000);
      } else {
        status.className = 'text-sm mb-3 text-red-600';
        status.innerHTML = '<i class="fas fa-times-circle mr-1"></i>' + ((result && result.error) || '백업 실패');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save mr-1"></i>다시 시도';
      }
    });
  }

  // ──────────────────────────────────────────────────────────────
  // v39.32: 모달 — 보존 정책 수동 실행 (cleanup)
  // ──────────────────────────────────────────────────────────────
  function openCleanupModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    modal.innerHTML =
      '<div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">' +
      '  <h3 class="text-lg font-bold text-gray-800 mb-2"><i class="fas fa-broom text-gray-500 mr-2"></i>보존 정책 즉시 적용</h3>' +
      '  <p class="text-sm text-gray-600 mb-3">GFS 보존 정책에 따라 초과분 백업을 삭제합니다.</p>' +
      '  <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 space-y-1 mb-4">' +
      '    <div>📅 <strong>Daily</strong>: 최근 14개 유지 (초과분 삭제)</div>' +
      '    <div>📊 <strong>Weekly</strong>: 최근 8개 유지</div>' +
      '    <div>📆 <strong>Monthly</strong>: 최근 12개 유지</div>' +
      '    <div>🔒 <strong>Manual</strong>: <span class="text-emerald-600 font-semibold">절대 자동 삭제 안함</span></div>' +
      '    <div>🛡️ <strong>pre-restore</strong>: 30일 후 자동 삭제</div>' +
      '  </div>' +
      '  <div id="cu-status" class="hidden text-sm mb-3"></div>' +
      '  <div class="flex justify-end gap-2">' +
      '    <button id="cu-cancel" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>' +
      '    <button id="cu-submit" class="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800"><i class="fas fa-broom mr-1"></i>정리 실행</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#cu-cancel').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    modal.querySelector('#cu-submit').addEventListener('click', async () => {
      const status = modal.querySelector('#cu-status');
      const btn = modal.querySelector('#cu-submit');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>정리 중...';
      status.className = 'text-sm mb-3 text-blue-600';
      status.classList.remove('hidden');
      status.innerHTML = '<i class="fas fa-cog fa-spin mr-1"></i>보존 정책에 따라 초과 백업 식별 및 삭제 중...';

      const result = await apiCall('/api/admin/backups/cleanup', 'POST', {});

      if (result && result.success) {
        const byType = result.byType || {};
        let detail = '';
        ['daily','weekly','monthly','pre-restore','manual'].forEach(function(t) {
          if (!byType[t]) return;
          const b = byType[t];
          const protMark = b.protected ? ' 🔒' : '';
          detail += '<div>' + t + ': 삭제 ' + (b.deleted || 0) + '개 / 보관 ' + (b.kept || 0) + '개' + protMark + '</div>';
        });
        status.className = 'text-sm mb-3 text-green-700 bg-green-50 p-2 rounded';
        status.innerHTML =
          '<div class="font-semibold mb-1"><i class="fas fa-check-circle mr-1"></i>정리 완료 · 총 ' + result.totalDeleted + '개 삭제 · ' + ((result.durationMs || 0) / 1000).toFixed(1) + '초</div>' +
          '<div class="text-xs text-green-600 mt-1">' + detail + '</div>';
        setTimeout(() => { close(); load(); }, 3500);
      } else {
        status.className = 'text-sm mb-3 text-red-600';
        status.innerHTML = '<i class="fas fa-times-circle mr-1"></i>' + ((result && result.error) || '정리 실패');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-broom mr-1"></i>다시 시도';
      }
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 다운로드
  // ──────────────────────────────────────────────────────────────
  window.downloadBackup = function (id) {
    const url = '/api/admin/backups/' + id + '/download';
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ──────────────────────────────────────────────────────────────
  // 무결성 검증
  // ──────────────────────────────────────────────────────────────
  window.verifyBackup = async function (id) {
    const result = await apiCall('/api/admin/backups/' + id + '/verify');
    if (!result) {
      alert('검증 요청 실패');
      return;
    }
    if (result.valid) {
      alert(
        '✅ 무결성 검증 성공\n\n' +
        'SHA-256 해시가 일치합니다.\n' +
        '백업 파일이 손상되지 않았습니다.\n\n' +
        'Hash: ' + (result.actual_hash || '').slice(0, 32) + '...'
      );
    } else {
      alert(
        '❌ 무결성 검증 실패\n\n' +
        '백업 파일이 손상되었거나 변조되었을 수 있습니다.\n\n' +
        '예상 해시: ' + (result.expected_hash || '(없음)').slice(0, 32) + '...\n' +
        '실제 해시: ' + (result.actual_hash || '(없음)').slice(0, 32) + '...'
      );
    }
  };

  // ──────────────────────────────────────────────────────────────
  // v39.32: 표준 복원 — 3단계 안전장치
  //   1) RESTORE-YYYY-MM-DD 정확 입력 (날짜 매칭)
  //   2) 관리자 비밀번호 재입력
  //   3) 자동 pre-restore 백업 (서버측)
  // ──────────────────────────────────────────────────────────────
  window.restoreBackup = function (id, type, dateStrKst, dateOnlyForToken) {
    const expectedToken = 'RESTORE-' + dateOnlyForToken;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto';
    modal.innerHTML =
      '<div class="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl my-8">' +
      // ─── 헤더 ───
      '  <h3 class="text-lg font-bold text-red-600 mb-2"><i class="fas fa-exclamation-triangle mr-2"></i>⚠️ 위험: 표준 데이터베이스 복원</h3>' +
      // ─── 경고 박스 ───
      '  <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">' +
      '    <p class="text-sm text-red-700 font-medium mb-2">이 작업은 현재 데이터베이스를 다음 백업으로 완전히 덮어씁니다:</p>' +
      '    <ul class="text-sm text-red-600 space-y-1 list-disc list-inside">' +
      '      <li>유형: <strong>' + escapeHtml(type) + '</strong></li>' +
      '      <li>생성: <strong>' + escapeHtml(dateStrKst) + ' (KST)</strong></li>' +
      '      <li>백업 ID: <strong>#' + id + '</strong></li>' +
      '    </ul>' +
      '    <p class="text-xs text-red-500 mt-2">✓ 복원 직전, 자동으로 <strong>pre-restore 백업</strong>이 생성되어 30일간 보관됩니다.<br>✓ 감사 로그(audit_logs)와 백업 이력은 보존됩니다.</p>' +
      '  </div>' +
      // ─── 진행 단계 표시 ───
      '  <div class="flex items-center justify-between text-xs font-medium mb-4">' +
      '    <div id="rb-step-1-ind" class="flex items-center gap-1 text-red-600"><span class="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">1</span> 확인 토큰</div>' +
      '    <div class="flex-1 h-px bg-gray-200 mx-2"></div>' +
      '    <div id="rb-step-2-ind" class="flex items-center gap-1 text-gray-400"><span class="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center">2</span> 비밀번호</div>' +
      '    <div class="flex-1 h-px bg-gray-200 mx-2"></div>' +
      '    <div id="rb-step-3-ind" class="flex items-center gap-1 text-gray-400"><span class="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center">3</span> 실행</div>' +
      '  </div>' +
      // ─── STEP 1: 텍스트 확인 ───
      '  <label class="block text-sm font-medium text-gray-700 mb-1.5">① 계속하시려면 아래 텍스트를 <strong>정확히</strong> 입력하세요:</label>' +
      '  <div class="mb-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-red-600 select-all">' + escapeHtml(expectedToken) + '</div>' +
      '  <input id="rb-confirm" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 font-mono" placeholder="위 텍스트를 그대로 입력" autocomplete="off">' +
      // ─── STEP 2: 비밀번호 (처음에는 숨김, STEP 1 통과 후 노출) ───
      '  <div id="rb-pwd-section" class="hidden">' +
      '    <label class="block text-sm font-medium text-gray-700 mb-1.5">② 관리자 비밀번호를 재입력하세요:</label>' +
      '    <input id="rb-password" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4" placeholder="비밀번호" autocomplete="current-password">' +
      '  </div>' +
      // ─── 상태 + 버튼 ───
      '  <div id="rb-status" class="hidden text-sm mb-3"></div>' +
      '  <div class="flex justify-end gap-2">' +
      '    <button id="rb-cancel" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>' +
      '    <button id="rb-submit" class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300" disabled><i class="fas fa-undo mr-1"></i>복원 실행</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#rb-cancel').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    const tokenInput = modal.querySelector('#rb-confirm');
    const pwdSection = modal.querySelector('#rb-pwd-section');
    const pwdInput = modal.querySelector('#rb-password');
    const submit = modal.querySelector('#rb-submit');
    const step1Ind = modal.querySelector('#rb-step-1-ind');
    const step2Ind = modal.querySelector('#rb-step-2-ind');
    const step3Ind = modal.querySelector('#rb-step-3-ind');

    function refreshUi() {
      const tokenOk = tokenInput.value === expectedToken;
      const pwdOk = pwdInput.value.length >= 1;

      if (tokenOk) {
        step1Ind.classList.remove('text-red-600');
        step1Ind.classList.add('text-emerald-600');
        step1Ind.querySelector('span').classList.remove('bg-red-500');
        step1Ind.querySelector('span').classList.add('bg-emerald-500');
        pwdSection.classList.remove('hidden');
        step2Ind.classList.remove('text-gray-400');
        step2Ind.classList.add('text-red-600');
        step2Ind.querySelector('span').classList.remove('bg-gray-300');
        step2Ind.querySelector('span').classList.add('bg-red-500');
      } else {
        step1Ind.classList.remove('text-emerald-600');
        step1Ind.classList.add('text-red-600');
        step1Ind.querySelector('span').classList.remove('bg-emerald-500');
        step1Ind.querySelector('span').classList.add('bg-red-500');
        pwdSection.classList.add('hidden');
        step2Ind.classList.remove('text-red-600');
        step2Ind.classList.add('text-gray-400');
        step2Ind.querySelector('span').classList.remove('bg-red-500');
        step2Ind.querySelector('span').classList.add('bg-gray-300');
      }

      if (tokenOk && pwdOk) {
        step2Ind.classList.remove('text-red-600');
        step2Ind.classList.add('text-emerald-600');
        step2Ind.querySelector('span').classList.remove('bg-red-500');
        step2Ind.querySelector('span').classList.add('bg-emerald-500');
        submit.disabled = false;
      } else {
        submit.disabled = true;
      }
    }

    tokenInput.addEventListener('input', refreshUi);
    pwdInput.addEventListener('input', refreshUi);
    tokenInput.focus();

    submit.addEventListener('click', async () => {
      const status = modal.querySelector('#rb-status');
      submit.disabled = true;
      submit.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>복원 중...';
      step3Ind.classList.remove('text-gray-400');
      step3Ind.classList.add('text-red-600');
      step3Ind.querySelector('span').classList.remove('bg-gray-300');
      step3Ind.querySelector('span').classList.add('bg-red-500');

      status.className = 'text-sm mb-3 text-blue-600';
      status.classList.remove('hidden');
      status.innerHTML =
        '<i class="fas fa-cog fa-spin mr-1"></i>1) pre-restore 백업 생성 → 2) 무결성 검증 → 3) 테이블 복원 중... (약 10~30초)';

      const result = await apiCall('/api/admin/backups/' + id + '/restore', 'POST', {
        confirm: expectedToken,
        password: pwdInput.value,
      });

      if (result && result.success) {
        step3Ind.classList.remove('text-red-600');
        step3Ind.classList.add('text-emerald-600');
        step3Ind.querySelector('span').classList.remove('bg-red-500');
        step3Ind.querySelector('span').classList.add('bg-emerald-500');
        status.className = 'text-sm mb-3 text-green-700 bg-green-50 p-2 rounded';
        status.innerHTML =
          '<i class="fas fa-check-circle mr-1"></i><strong>복원 완료!</strong> ' +
          result.result.restoredTables + '개 테이블, ' +
          result.result.restoredRows.toLocaleString() + '개 행 (' + (result.result.durationMs / 1000).toFixed(1) + '초)' +
          '<br><span class="text-xs text-gray-500">pre-restore 백업: ' + (result.result.preRestoreBackupKey || '-') + '</span>';
        setTimeout(() => {
          close();
          alert('✅ 복원이 완료되었습니다.\n페이지를 새로고침합니다.');
          window.location.reload();
        }, 3500);
      } else {
        status.className = 'text-sm mb-3 text-red-600';
        status.innerHTML = '<i class="fas fa-times-circle mr-1"></i>' + ((result && result.error) || '복원 실패');
        submit.disabled = false;
        submit.innerHTML = '<i class="fas fa-undo mr-1"></i>다시 시도';
        // 비밀번호 오류시 비밀번호 필드 초기화
        if (result && result.error && result.error.indexOf('비밀번호') !== -1) {
          pwdInput.value = '';
          pwdInput.focus();
          refreshUi();
        }
      }
    });
  };

  // ──────────────────────────────────────────────────────────────
  // v39.32: 응급 복원 — 1시간 이내 백업 한정, 1단계 확인만
  //
  // 사용 시나리오:
  //   "방금 큰 실수했다 → 1시간 전 시점으로 즉시 되돌리기"
  //   (서버는 1시간 윈도우를 별도 검증함)
  // ──────────────────────────────────────────────────────────────
  window.emergencyRestore = function (id, type, dateStrKst) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
    modal.innerHTML =
      '<div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">' +
      '  <h3 class="text-lg font-bold text-amber-600 mb-2"><i class="fas fa-bolt mr-2"></i>⚡ 응급 복원</h3>' +
      '  <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">' +
      '    <p class="text-sm text-amber-800 font-medium mb-2">최근 1시간 이내 생성된 백업으로 즉시 복원합니다:</p>' +
      '    <ul class="text-sm text-amber-700 space-y-1 list-disc list-inside">' +
      '      <li>유형: <strong>' + escapeHtml(type) + '</strong></li>' +
      '      <li>생성: <strong>' + escapeHtml(dateStrKst) + ' (KST)</strong></li>' +
      '    </ul>' +
      '    <p class="text-xs text-amber-600 mt-2">✓ 복원 직전 <strong>pre-restore 자동 백업</strong>이 생성됩니다 (안전망 보장).<br>✓ 1시간 이상 지난 백업은 응급 복원이 불가능합니다 (표준 절차 사용).</p>' +
      '  </div>' +
      '  <label class="block text-sm font-medium text-gray-700 mb-1.5">계속하시려면 아래 텍스트를 정확히 입력하세요:</label>' +
      '  <div class="mb-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-amber-700 select-all">EMERGENCY-RESTORE</div>' +
      '  <input id="er-confirm" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 font-mono" placeholder="EMERGENCY-RESTORE" autocomplete="off">' +
      '  <div id="er-status" class="hidden text-sm mb-3"></div>' +
      '  <div class="flex justify-end gap-2">' +
      '    <button id="er-cancel" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>' +
      '    <button id="er-submit" class="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-300" disabled><i class="fas fa-bolt mr-1"></i>응급 복원 실행</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#er-cancel').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    const input = modal.querySelector('#er-confirm');
    const submit = modal.querySelector('#er-submit');
    input.addEventListener('input', () => {
      submit.disabled = input.value !== 'EMERGENCY-RESTORE';
    });
    input.focus();

    submit.addEventListener('click', async () => {
      const status = modal.querySelector('#er-status');
      submit.disabled = true;
      submit.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>응급 복원 중...';
      status.className = 'text-sm mb-3 text-blue-600';
      status.classList.remove('hidden');
      status.innerHTML = '<i class="fas fa-cog fa-spin mr-1"></i>pre-restore 백업 → 테이블 복원 중...';

      const result = await apiCall('/api/admin/backups/' + id + '/restore', 'POST', {
        confirm: 'EMERGENCY-RESTORE',
        emergency: true,
      });

      if (result && result.success) {
        status.className = 'text-sm mb-3 text-green-700 bg-green-50 p-2 rounded';
        status.innerHTML =
          '<i class="fas fa-check-circle mr-1"></i><strong>응급 복원 완료!</strong> ' +
          result.result.restoredTables + '개 테이블, ' +
          result.result.restoredRows.toLocaleString() + '개 행 (' + (result.result.durationMs / 1000).toFixed(1) + '초)' +
          '<br><span class="text-xs text-gray-500">pre-restore 백업: ' + (result.result.preRestoreBackupKey || '-') + '</span>';
        setTimeout(() => {
          close();
          alert('✅ 응급 복원 완료. 페이지를 새로고침합니다.');
          window.location.reload();
        }, 3000);
      } else {
        status.className = 'text-sm mb-3 text-red-600';
        status.innerHTML = '<i class="fas fa-times-circle mr-1"></i>' + ((result && result.error) || '응급 복원 실패');
        submit.disabled = false;
        submit.innerHTML = '<i class="fas fa-bolt mr-1"></i>다시 시도';
      }
    });
  };

  // ──────────────────────────────────────────────────────────────
  // 백업 삭제
  // ──────────────────────────────────────────────────────────────
  window.deleteBackup = async function (id) {
    if (!confirm('이 백업을 삭제하시겠습니까?\n\nR2의 파일과 백업 이력 기록이 모두 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.')) return;
    const result = await apiCall('/api/admin/backups/' + id, 'DELETE');
    if (result && result.success) {
      await load();
    } else {
      alert('삭제 실패: ' + ((result && result.error) || '알 수 없는 오류'));
    }
  };
})();

// ═══════════════════════════════════════════════════════════════════
// KOIST Admin - Backup Management UI (v39.28 Phase 2)
// ═══════════════════════════════════════════════════════════════════
// 기능:
//   - 백업 목록 + 통계 카드
//   - 수동 백업 생성 (manual/daily/weekly/monthly 선택)
//   - 백업 파일 다운로드 (.json.gz)
//   - 무결성 검증 (SHA-256 재계산)
//   - 복원 (2단계 확인 + 자동 pre-restore 백업)
//   - 백업 삭제
// ═══════════════════════════════════════════════════════════════════
(async function () {
  'use strict';
  const container = document.getElementById('admin-content');

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

  function formatDate(iso) {
    if (!iso) return '-';
    // SQLite CURRENT_TIMESTAMP → "YYYY-MM-DD HH:MM:SS" (UTC)
    // ISO 8601: "YYYY-MM-DDTHH:MM:SS.sssZ"
    const d = new Date(iso.replace(' ', 'T') + (iso.endsWith('Z') || iso.includes('T') ? '' : 'Z'));
    if (isNaN(d.getTime())) return iso;
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
    h += '          <h3 class="font-bold text-gray-800 text-base">3-2-1 백업 전략 활성화</h3>';
    h += '          <p class="text-sm text-gray-600 mt-1">D1(원본) + R2(자동백업) + 관리자 다운로드(오프사이트)</p>';
    h += '          <p class="text-xs text-gray-500 mt-1.5"><i class="fas fa-clock mr-1"></i>자동: 매일 03:00, 매주 일요일 04:00, 매월 2일 05:00 (KST)</p>';
    h += '        </div>';
    h += '      </div>';
    h += '      <button id="btn-create-backup" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition flex items-center gap-2">';
    h += '        <i class="fas fa-plus"></i> 수동 백업 생성';
    h += '      </button>';
    h += '    </div>';
    h += '  </div>';

    // ─── 통계 그리드 ───
    h += '  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">';
    h += statCard('총 백업', stats.total + '건', 'fa-database', 'text-blue-500', formatBytes(stats.totalSize));
    h += statCard('일일', (stats.byType.daily ? stats.byType.daily.count : 0) + '건', 'fa-calendar-day', 'text-blue-500', stats.byType.daily ? formatBytes(stats.byType.daily.size) : '');
    h += statCard('주간', (stats.byType.weekly ? stats.byType.weekly.count : 0) + '건', 'fa-calendar-week', 'text-indigo-500', stats.byType.weekly ? formatBytes(stats.byType.weekly.size) : '');
    h += statCard('월간', (stats.byType.monthly ? stats.byType.monthly.count : 0) + '건', 'fa-calendar', 'text-purple-500', stats.byType.monthly ? formatBytes(stats.byType.monthly.size) : '');
    h += '  </div>';
    h += '</div>';

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
        h += '<tr class="border-b border-gray-50 hover:bg-gray-50/50 transition">';
        h += '<td class="px-4 py-3">' + typeBadge(b.backup_type) + '</td>';
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
          h += '<button onclick="restoreBackup(' + b.id + ', \'' + escapeAttr(b.backup_type) + '\', \'' + escapeAttr(formatDate(b.created_at)) + '\')" class="text-xs px-2 py-1 rounded border border-orange-200 text-orange-600 hover:bg-orange-50 mr-1" title="복원"><i class="fas fa-undo"></i></button>';
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
      '    <option value="manual" selected>수동 (무기한 보존)</option>' +
      '    <option value="daily">일일 (7일 보존)</option>' +
      '    <option value="weekly">주간 (4주 보존)</option>' +
      '    <option value="monthly">월간 (12개월 보존)</option>' +
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
  // 다운로드 (CSRF 헤더가 GET 요청에서 필요 없으므로 직접 navigate)
  // ──────────────────────────────────────────────────────────────
  window.downloadBackup = function (id) {
    // GET 요청은 CSRF 검증 우회 (csrfValidationMiddleware는 mutating 메서드만 검증)
    // 새 탭으로 열어서 다운로드
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
  // 복원 (2단계 확인 + 자동 pre-restore 백업)
  // ──────────────────────────────────────────────────────────────
  window.restoreBackup = function (id, type, dateStr) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
    modal.innerHTML =
      '<div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">' +
      '  <h3 class="text-lg font-bold text-red-600 mb-2"><i class="fas fa-exclamation-triangle mr-2"></i>⚠️ 위험: 데이터베이스 복원</h3>' +
      '  <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">' +
      '    <p class="text-sm text-red-700 font-medium mb-2">이 작업은 현재 데이터베이스를 다음 백업으로 완전히 덮어씁니다:</p>' +
      '    <ul class="text-sm text-red-600 space-y-1 list-disc list-inside">' +
      '      <li>유형: <strong>' + escapeHtml(type) + '</strong></li>' +
      '      <li>생성: <strong>' + escapeHtml(dateStr) + ' (KST)</strong></li>' +
      '    </ul>' +
      '    <p class="text-xs text-red-500 mt-2">✓ 복원 직전, 자동으로 <strong>pre-restore 백업</strong>이 생성되어 30일간 보관됩니다.<br>✓ 감사 로그(audit_logs)와 백업 이력은 보존됩니다.</p>' +
      '  </div>' +
      '  <label class="block text-sm font-medium text-gray-700 mb-1.5">계속하시려면 아래에 <code class="bg-gray-100 px-1.5 py-0.5 rounded text-red-600 font-mono">RESTORE</code> 를 정확히 입력하세요:</label>' +
      '  <input id="rb-confirm" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 font-mono" placeholder="RESTORE" autocomplete="off">' +
      '  <div id="rb-status" class="hidden text-sm mb-3"></div>' +
      '  <div class="flex justify-end gap-2">' +
      '    <button id="rb-cancel" class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>' +
      '    <button id="rb-submit" class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600" disabled><i class="fas fa-undo mr-1"></i>복원 실행</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#rb-cancel').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    const input = modal.querySelector('#rb-confirm');
    const submit = modal.querySelector('#rb-submit');
    input.addEventListener('input', () => {
      submit.disabled = input.value !== 'RESTORE';
    });
    input.focus();

    submit.addEventListener('click', async () => {
      const status = modal.querySelector('#rb-status');
      submit.disabled = true;
      submit.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>복원 중...';
      status.className = 'text-sm mb-3 text-blue-600';
      status.classList.remove('hidden');
      status.innerHTML =
        '<i class="fas fa-cog fa-spin mr-1"></i>1) pre-restore 백업 생성 → 2) 무결성 검증 → 3) 테이블 복원 중...';

      const result = await apiCall('/api/admin/backups/' + id + '/restore', 'POST', { confirm: 'RESTORE' });

      if (result && result.success) {
        status.className = 'text-sm mb-3 text-green-600';
        status.innerHTML =
          '<i class="fas fa-check-circle mr-1"></i>복원 완료! ' +
          result.result.restoredTables + '개 테이블, ' +
          result.result.restoredRows.toLocaleString() + '개 행 복원됨. ' +
          '(' + (result.result.durationMs / 1000).toFixed(1) + '초)' +
          '<br><span class="text-xs text-gray-500">pre-restore 백업: ' + (result.result.preRestoreBackupKey || '-') + '</span>';
        setTimeout(() => {
          close();
          load();
          alert('✅ 복원이 완료되었습니다. 페이지를 새로고침합니다.');
          window.location.reload();
        }, 3500);
      } else {
        status.className = 'text-sm mb-3 text-red-600';
        status.innerHTML = '<i class="fas fa-times-circle mr-1"></i>' + ((result && result.error) || '복원 실패');
        submit.disabled = false;
        submit.innerHTML = '<i class="fas fa-undo mr-1"></i>다시 시도';
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

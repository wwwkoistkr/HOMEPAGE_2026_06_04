// ═══════════════════════════════════════════════════════════════════
// KOIST Admin - Inquiries Management (v39.30 Phase 4 - 엑셀 스타일)
// ═══════════════════════════════════════════════════════════════════
// 주요 기능:
//   - 엑셀 스타일 테이블 (정렬 가능 컬럼)
//   - 검색 / 상태 / 동의 / 날짜 필터
//   - 서버 사이드 페이지네이션 (per_page 최대 200)
//   - 벌크 선택 (체크박스) + 일괄 삭제/복구
//   - 개인정보 마스킹 (기본 ON, 클릭 시 5초 자동 재마스킹 + 감사로그)
//   - Excel(.xlsx) / CSV 내보내기 (SheetJS 자체 호스팅)
//   - 휴지통 토글, 복구, 영구삭제
//   - 답변 작성/수정 (모달)
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';

  const c = document.getElementById('admin-content');

  // ───── 상태 ─────
  const state = {
    page: 1,
    per_page: 25,
    search: '',
    status: '',
    consent: '',
    date_from: '',
    date_to: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    include_deleted: false,
    deleted_only: false,
    data: [],
    pagination: { page: 1, per_page: 25, total: 0, total_pages: 0 },
    selected: new Set(),
    masking: true, // 기본 마스킹 ON
    revealed: new Map(), // id+field → timeoutId
  };

  // ───── 유틸 ─────
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function maskEmail(email) {
    if (!email) return '';
    const at = email.indexOf('@');
    if (at < 1) return '***';
    const u = email.substring(0, at);
    const d = email.substring(at);
    const head = u.length <= 1 ? u : u.charAt(0);
    return head + '***' + d;
  }

  function maskPhone(phone) {
    if (!phone) return '';
    const s = String(phone).replace(/[^0-9]/g, '');
    if (s.length >= 8) {
      // 010-1234-5678 → 010-****-5678
      const last = s.slice(-4);
      const first = s.slice(0, s.length - 8);
      return (first ? first + '-' : '') + '****-' + last;
    }
    return '****';
  }

  function maskName(name) {
    if (!name) return '';
    const n = String(name).trim();
    if (n.length <= 1) return n;
    if (n.length === 2) return n.charAt(0) + '*';
    return n.charAt(0) + '*'.repeat(n.length - 2) + n.charAt(n.length - 1);
  }

  function fmtDate(s) {
    if (!s) return '';
    return String(s).replace('T', ' ').substring(0, 16);
  }

  // ───── 데이터 로드 ─────
  async function load() {
    const params = new URLSearchParams();
    params.set('page', state.page);
    params.set('per_page', state.per_page);
    if (state.search) params.set('search', state.search);
    if (state.status) params.set('status', state.status);
    if (state.consent !== '') params.set('consent', state.consent);
    if (state.date_from) params.set('date_from', state.date_from);
    if (state.date_to) params.set('date_to', state.date_to);
    params.set('sort_by', state.sort_by);
    params.set('sort_dir', state.sort_dir);
    if (state.deleted_only) params.set('deleted_only', 'true');
    else if (state.include_deleted) params.set('include_deleted', 'true');

    const d = await apiCall('/api/admin/inquiries?' + params.toString());
    if (!d || !d.success) return;
    state.data = d.data || [];
    state.pagination = d.pagination || state.pagination;
    state.selected.clear();
    render();
  }

  // ───── 렌더 ─────
  function render() {
    const p = state.pagination;
    const inDeletedView = state.deleted_only;

    let h = '';

    // 툴바
    h += '<div class="space-y-3 mb-4">';
    // 1열: 검색 + 필터
    h += '  <div class="flex flex-wrap items-center gap-2">';
    h += '    <div class="relative flex-1 min-w-[200px] max-w-sm">';
    h += '      <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>';
    h += '      <input id="inq-search" type="text" placeholder="이름·이메일·제목·내용 검색" value="' + escapeHtml(state.search) + '" class="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-blue-400">';
    h += '    </div>';
    h += '    <select id="inq-status" class="text-sm border rounded-lg px-2 py-2">';
    h += '      <option value="">전체 상태</option>';
    h += '      <option value="pending"' + (state.status === 'pending' ? ' selected' : '') + '>대기</option>';
    h += '      <option value="replied"' + (state.status === 'replied' ? ' selected' : '') + '>답변완료</option>';
    h += '    </select>';
    h += '    <select id="inq-consent" class="text-sm border rounded-lg px-2 py-2">';
    h += '      <option value="">전체 동의</option>';
    h += '      <option value="1"' + (state.consent === '1' ? ' selected' : '') + '>동의</option>';
    h += '      <option value="0"' + (state.consent === '0' ? ' selected' : '') + '>미동의/레거시</option>';
    h += '    </select>';
    h += '    <input id="inq-from" type="date" value="' + escapeHtml(state.date_from) + '" class="text-sm border rounded-lg px-2 py-2">';
    h += '    <span class="text-gray-400 text-xs">~</span>';
    h += '    <input id="inq-to" type="date" value="' + escapeHtml(state.date_to) + '" class="text-sm border rounded-lg px-2 py-2">';
    h += '    <button id="inq-filter-btn" class="text-sm px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"><i class="fas fa-filter mr-1"></i>적용</button>';
    h += '    <button id="inq-reset-btn" class="text-sm px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><i class="fas fa-rotate-left mr-1"></i>초기화</button>';
    h += '  </div>';

    // 2열: 마스킹/내보내기/휴지통
    h += '  <div class="flex flex-wrap items-center justify-between gap-2">';
    h += '    <div class="flex items-center gap-2 flex-wrap">';
    h += '      <span class="text-sm text-gray-600">총 <b class="text-gray-800">' + p.total + '</b>건</span>';
    h += '      <span class="text-xs text-gray-400">|</span>';
    h += '      <label class="text-xs text-gray-600">표시:';
    h += '        <select id="inq-perpage" class="ml-1 border rounded px-1 py-0.5">';
    [25, 50, 100, 200].forEach(function (n) {
      h += '<option value="' + n + '"' + (state.per_page === n ? ' selected' : '') + '>' + n + '</option>';
    });
    h += '        </select>';
    h += '      </label>';
    h += '      <button id="inq-mask-toggle" class="text-xs px-2 py-1 rounded border ' +
      (state.masking ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-orange-200 bg-orange-50 text-orange-700') +
      ' hover:opacity-80">' +
      '<i class="fas ' + (state.masking ? 'fa-eye-slash' : 'fa-eye') + ' mr-1"></i>' +
      (state.masking ? '마스킹 ON' : '마스킹 OFF') + '</button>';
    h += '    </div>';
    h += '    <div class="flex items-center gap-2 flex-wrap">';
    h += '      <button id="inq-export-csv" class="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"><i class="fas fa-file-csv mr-1 text-green-600"></i>CSV</button>';
    h += '      <button id="inq-export-xlsx" class="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"><i class="fas fa-file-excel mr-1 text-green-700"></i>Excel</button>';
    h += '      <button id="inq-trash-toggle" class="text-xs px-3 py-1.5 rounded border ' +
      (inDeletedView ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600') +
      ' hover:bg-orange-50"><i class="fas ' + (inDeletedView ? 'fa-arrow-left' : 'fa-trash-can') + ' mr-1"></i>' +
      (inDeletedView ? '목록으로' : '휴지통') + '</button>';
    h += '    </div>';
    h += '  </div>';

    // 3열: 벌크 액션 (선택 시만 표시)
    h += '  <div id="inq-bulk-bar" class="hidden flex flex-wrap items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">';
    h += '    <span class="text-sm text-blue-700"><i class="fas fa-check-square mr-1"></i><span id="inq-bulk-count">0</span>건 선택됨</span>';
    if (inDeletedView) {
      h += '    <button id="inq-bulk-restore" class="text-xs px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"><i class="fas fa-undo mr-1"></i>일괄 복구</button>';
      h += '    <button id="inq-bulk-permanent" class="text-xs px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"><i class="fas fa-skull-crossbones mr-1"></i>영구 삭제</button>';
    } else {
      h += '    <button id="inq-bulk-delete" class="text-xs px-3 py-1.5 rounded bg-orange-500 text-white hover:bg-orange-600"><i class="fas fa-trash-can mr-1"></i>휴지통으로</button>';
    }
    h += '    <button id="inq-bulk-clear" class="text-xs px-2 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-white">선택 해제</button>';
    h += '  </div>';
    h += '</div>';

    // 테이블
    h += '<div class="overflow-x-auto border rounded-lg">';
    h += '<table class="w-full text-sm">';
    h += '  <thead class="bg-gray-50 text-gray-700 text-xs uppercase">';
    h += '    <tr>';
    h += '      <th class="px-2 py-2 text-center w-8"><input type="checkbox" id="inq-check-all"></th>';
    h += sortableTh('id', '#', 'w-12 text-center');
    h += sortableTh('created_at', '접수일시', 'w-32');
    h += sortableTh('name', '이름', 'w-24');
    h += '      <th class="px-2 py-2 text-left">연락처</th>';
    h += sortableTh('subject', '제목', '');
    h += sortableTh('status', '상태', 'w-20 text-center');
    h += '      <th class="px-2 py-2 text-center w-16">동의</th>';
    h += '      <th class="px-2 py-2 text-center w-28">액션</th>';
    h += '    </tr>';
    h += '  </thead>';
    h += '  <tbody>';

    if (state.data.length === 0) {
      h += '<tr><td colspan="9" class="text-center text-gray-400 py-12">' +
        (inDeletedView ? '휴지통이 비어 있습니다.' : '조건에 맞는 문의가 없습니다.') + '</td></tr>';
    } else {
      state.data.forEach(function (inq) {
        const isDeleted = !!inq.deleted_at;
        const consent = (inq.consent_personal_info === 1 || inq.consent_personal_info === true);
        const isLegacy = !consent && inq.created_at && new Date(inq.created_at) < new Date('2026-06-01');

        h += '<tr class="border-t ' + (isDeleted ? 'bg-orange-50/40' : 'hover:bg-gray-50') + '">';
        h += '  <td class="px-2 py-2 text-center"><input type="checkbox" class="inq-row-check" data-id="' + inq.id + '"></td>';
        h += '  <td class="px-2 py-2 text-center text-gray-500">' + inq.id + '</td>';
        h += '  <td class="px-2 py-2 text-gray-600 text-xs">' + escapeHtml(fmtDate(inq.created_at)) + '</td>';

        // 이름 (마스킹 가능)
        h += '  <td class="px-2 py-2">' + maskField(inq.id, 'name', inq.name, maskName) + '</td>';

        // 연락처 (이메일 + 전화)
        h += '  <td class="px-2 py-2 text-xs">';
        if (inq.email) h += '<div>' + maskField(inq.id, 'email', inq.email, maskEmail) + '</div>';
        if (inq.phone) h += '<div class="text-gray-500">' + maskField(inq.id, 'phone', inq.phone, maskPhone) + '</div>';
        if (inq.company) h += '<div class="text-gray-400">' + escapeHtml(inq.company) + '</div>';
        h += '  </td>';

        // 제목 (클릭 시 상세 모달)
        h += '  <td class="px-2 py-2"><button class="text-left hover:text-blue-600 hover:underline" onclick="window.inqDetail(' + inq.id + ')">' + escapeHtml(inq.subject || '') + '</button></td>';

        // 상태
        h += '  <td class="px-2 py-2 text-center">';
        if (isDeleted) {
          h += '<span class="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">삭제됨</span>';
        } else if (inq.status === 'pending') {
          h += '<span class="px-2 py-0.5 rounded text-xs bg-yellow-50 text-yellow-600">대기</span>';
        } else {
          h += '<span class="px-2 py-0.5 rounded text-xs bg-green-50 text-green-600">완료</span>';
        }
        h += '  </td>';

        // 동의
        h += '  <td class="px-2 py-2 text-center">';
        if (consent) {
          h += '<i class="fas fa-check-circle text-emerald-500" title="동의 (' + escapeHtml(inq.consent_at || '') + ')"></i>';
        } else if (isLegacy) {
          h += '<span class="text-gray-400 text-xs" title="v39.27 이전 데이터">레거시</span>';
        } else {
          h += '<i class="fas fa-exclamation-triangle text-red-500" title="미동의"></i>';
        }
        h += '  </td>';

        // 액션
        h += '  <td class="px-2 py-2 text-center whitespace-nowrap">';
        if (isDeleted) {
          h += '<button onclick="window.inqRestore(' + inq.id + ')" class="text-xs px-2 py-1 rounded border border-blue-200 text-blue-500 hover:bg-blue-50 mr-1" title="복구"><i class="fas fa-undo"></i></button>';
          h += '<button onclick="window.inqPermanent(' + inq.id + ')" class="text-xs px-2 py-1 rounded border border-red-300 bg-red-50 text-red-600 hover:bg-red-100" title="영구삭제"><i class="fas fa-skull-crossbones"></i></button>';
        } else {
          h += '<button onclick="window.inqDetail(' + inq.id + ')" class="text-xs px-2 py-1 rounded border border-blue-200 text-blue-500 hover:bg-blue-50 mr-1" title="상세/답변"><i class="fas fa-reply"></i></button>';
          h += '<button onclick="window.inqDelete(' + inq.id + ')" class="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50" title="삭제"><i class="fas fa-trash-can"></i></button>';
        }
        h += '  </td>';
        h += '</tr>';
      });
    }

    h += '  </tbody>';
    h += '</table>';
    h += '</div>';

    // 페이지네이션
    if (p.total_pages > 1) {
      h += renderPagination(p);
    }

    // 상세 모달 컨테이너
    h += '<div id="inq-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4"><div id="inq-modal-body" class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"></div></div>';

    c.innerHTML = h;
    bindEvents();
  }

  function sortableTh(key, label, extra) {
    const isActive = state.sort_by === key;
    const arrow = isActive ? (state.sort_dir === 'asc' ? '▲' : '▼') : '';
    return '<th class="px-2 py-2 text-left cursor-pointer hover:bg-gray-100 ' + (extra || '') + '" data-sort="' + key + '">' +
      escapeHtml(label) + ' <span class="text-[10px] text-blue-500">' + arrow + '</span></th>';
  }

  function maskField(id, field, value, maskFn) {
    if (!value) return '';
    const key = id + ':' + field;
    const escVal = escapeHtml(value);
    const masked = escapeHtml(maskFn(value));
    if (!state.masking || state.revealed.has(key)) {
      return '<span class="font-mono text-xs cursor-pointer hover:bg-yellow-50" onclick="window.inqReveal(' + id + ',\'' + field + '\')" title="클릭하여 마스킹 토글">' + escVal + '</span>';
    }
    return '<span class="font-mono text-xs cursor-pointer hover:bg-yellow-50 text-gray-700" onclick="window.inqReveal(' + id + ',\'' + field + '\')" title="클릭하여 5초간 표시 (감사로그 기록)">' + masked + '</span>';
  }

  function renderPagination(p) {
    let h = '<div class="flex items-center justify-center gap-1 mt-4 text-sm">';
    const cur = p.page;
    const total = p.total_pages;
    const btn = function (n, label, disabled, active) {
      if (disabled) return '<span class="px-3 py-1.5 text-gray-300">' + label + '</span>';
      return '<button class="inq-page-btn px-3 py-1.5 rounded ' +
        (active ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700') +
        '" data-page="' + n + '">' + label + '</button>';
    };
    h += btn(1, '«', cur === 1);
    h += btn(cur - 1, '‹', cur === 1);
    const start = Math.max(1, cur - 2);
    const end = Math.min(total, cur + 2);
    for (let i = start; i <= end; i++) h += btn(i, String(i), false, i === cur);
    h += btn(cur + 1, '›', cur === total);
    h += btn(total, '»', cur === total);
    h += '<span class="ml-2 text-xs text-gray-500">' + cur + ' / ' + total + ' 페이지</span>';
    h += '</div>';
    return h;
  }

  // ───── 이벤트 바인딩 ─────
  function bindEvents() {
    // 필터 적용
    const apply = function () {
      state.search = document.getElementById('inq-search').value.trim();
      state.status = document.getElementById('inq-status').value;
      state.consent = document.getElementById('inq-consent').value;
      state.date_from = document.getElementById('inq-from').value;
      state.date_to = document.getElementById('inq-to').value;
      state.page = 1;
      load();
    };
    document.getElementById('inq-filter-btn').addEventListener('click', apply);
    document.getElementById('inq-search').addEventListener('keydown', function (e) { if (e.key === 'Enter') apply(); });
    document.getElementById('inq-reset-btn').addEventListener('click', function () {
      state.search = ''; state.status = ''; state.consent = '';
      state.date_from = ''; state.date_to = ''; state.page = 1;
      load();
    });
    document.getElementById('inq-perpage').addEventListener('change', function (e) {
      state.per_page = parseInt(e.target.value, 10) || 25;
      state.page = 1;
      load();
    });

    // 마스킹 토글
    document.getElementById('inq-mask-toggle').addEventListener('click', function () {
      state.masking = !state.masking;
      state.revealed.forEach(function (t) { clearTimeout(t); });
      state.revealed.clear();
      render();
    });

    // 휴지통 토글
    document.getElementById('inq-trash-toggle').addEventListener('click', function () {
      state.deleted_only = !state.deleted_only;
      state.include_deleted = false;
      state.page = 1;
      load();
    });

    // 정렬
    document.querySelectorAll('[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        const key = th.getAttribute('data-sort');
        if (state.sort_by === key) {
          state.sort_dir = state.sort_dir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sort_by = key;
          state.sort_dir = 'desc';
        }
        load();
      });
    });

    // 페이지네이션
    document.querySelectorAll('.inq-page-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        state.page = parseInt(b.getAttribute('data-page'), 10);
        load();
      });
    });

    // 체크박스
    const checkAll = document.getElementById('inq-check-all');
    if (checkAll) {
      checkAll.addEventListener('change', function () {
        document.querySelectorAll('.inq-row-check').forEach(function (cb) {
          cb.checked = checkAll.checked;
          const id = parseInt(cb.getAttribute('data-id'), 10);
          if (checkAll.checked) state.selected.add(id);
          else state.selected.delete(id);
        });
        updateBulkBar();
      });
    }
    document.querySelectorAll('.inq-row-check').forEach(function (cb) {
      cb.addEventListener('change', function () {
        const id = parseInt(cb.getAttribute('data-id'), 10);
        if (cb.checked) state.selected.add(id);
        else state.selected.delete(id);
        updateBulkBar();
      });
    });

    // 벌크 액션
    const bd = document.getElementById('inq-bulk-delete');
    if (bd) bd.addEventListener('click', bulkDelete);
    const br = document.getElementById('inq-bulk-restore');
    if (br) br.addEventListener('click', bulkRestore);
    const bp = document.getElementById('inq-bulk-permanent');
    if (bp) bp.addEventListener('click', bulkPermanent);
    const bc = document.getElementById('inq-bulk-clear');
    if (bc) bc.addEventListener('click', function () {
      state.selected.clear();
      document.querySelectorAll('.inq-row-check').forEach(function (cb) { cb.checked = false; });
      const ca = document.getElementById('inq-check-all'); if (ca) ca.checked = false;
      updateBulkBar();
    });

    // 내보내기
    document.getElementById('inq-export-csv').addEventListener('click', function () { exportData('csv'); });
    document.getElementById('inq-export-xlsx').addEventListener('click', function () { exportData('xlsx'); });
  }

  function updateBulkBar() {
    const bar = document.getElementById('inq-bulk-bar');
    const cnt = document.getElementById('inq-bulk-count');
    if (!bar) return;
    if (state.selected.size > 0) {
      bar.classList.remove('hidden');
      bar.classList.add('flex');
      if (cnt) cnt.textContent = state.selected.size;
    } else {
      bar.classList.add('hidden');
      bar.classList.remove('flex');
    }
  }

  // ───── 벌크 액션 ─────
  async function bulkDelete() {
    if (state.selected.size === 0) return;
    if (!confirm(state.selected.size + '건을 휴지통으로 이동하시겠습니까?')) return;
    const ids = Array.from(state.selected);
    await apiCall('/api/admin/inquiries/bulk-delete', 'POST', { ids: ids });
    await load();
  }

  async function bulkRestore() {
    if (state.selected.size === 0) return;
    if (!confirm(state.selected.size + '건을 복구하시겠습니까?')) return;
    const ids = Array.from(state.selected);
    await apiCall('/api/admin/inquiries/bulk-restore', 'POST', { ids: ids });
    await load();
  }

  async function bulkPermanent() {
    if (state.selected.size === 0) return;
    if (!confirm('⚠️ ' + state.selected.size + '건을 영구 삭제하시겠습니까?\n\n개인정보가 완전히 파기되며 되돌릴 수 없습니다.\n「개인정보 보호법」 제21조에 따른 파기 절차로 기록됩니다.')) return;
    const ids = Array.from(state.selected);
    await apiCall('/api/admin/inquiries/bulk-delete', 'POST', { ids: ids, permanent: true });
    await load();
  }

  // ───── 마스킹 해제 (5초 후 재마스킹) ─────
  window.inqReveal = function (id, field) {
    const key = id + ':' + field;
    if (state.revealed.has(key)) {
      // 즉시 재마스킹
      clearTimeout(state.revealed.get(key));
      state.revealed.delete(key);
      render();
      return;
    }
    // 감사로그 기록 (fire-and-forget)
    if (state.masking) {
      apiCall('/api/admin/inquiries/' + id + '/reveal', 'POST', { field: field }).catch(function () {});
    }
    const timeoutId = setTimeout(function () {
      state.revealed.delete(key);
      render();
    }, 5000);
    state.revealed.set(key, timeoutId);
    render();
  };

  // ───── 상세/답변 모달 ─────
  window.inqDetail = function (id) {
    const inq = state.data.find(function (x) { return x.id === id; });
    if (!inq) return;
    const modal = document.getElementById('inq-modal');
    const body = document.getElementById('inq-modal-body');
    let h = '<div class="p-6">';
    h += '<div class="flex justify-between items-start mb-4">';
    h += '  <h3 class="text-xl font-bold text-gray-800">' + escapeHtml(inq.subject || '') + '</h3>';
    h += '  <button onclick="window.inqCloseModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>';
    h += '</div>';
    h += '<div class="grid grid-cols-2 gap-3 text-sm mb-4 p-3 bg-gray-50 rounded-lg">';
    h += '  <div><span class="text-gray-500">이름:</span> ' + escapeHtml(inq.name || '') + '</div>';
    h += '  <div><span class="text-gray-500">접수:</span> ' + escapeHtml(fmtDate(inq.created_at)) + '</div>';
    if (inq.email) h += '  <div><span class="text-gray-500">이메일:</span> ' + escapeHtml(inq.email) + '</div>';
    if (inq.phone) h += '  <div><span class="text-gray-500">전화:</span> ' + escapeHtml(inq.phone) + '</div>';
    if (inq.company) h += '  <div class="col-span-2"><span class="text-gray-500">회사:</span> ' + escapeHtml(inq.company) + '</div>';
    h += '</div>';
    h += '<div class="mb-4"><div class="text-xs text-gray-500 mb-1">문의 내용</div><div class="p-3 border rounded-lg whitespace-pre-wrap text-sm">' + escapeHtml(inq.message || '') + '</div></div>';
    h += '<div class="mb-4"><div class="text-xs text-gray-500 mb-1">관리자 답변</div>';
    h += '<textarea id="inq-modal-reply" rows="5" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="답변을 입력하세요...">' + escapeHtml(inq.admin_reply || '') + '</textarea></div>';
    h += '<div class="flex justify-end gap-2">';
    h += '  <button onclick="window.inqCloseModal()" class="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50">취소</button>';
    h += '  <button onclick="window.inqSaveReply(' + id + ')" class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"><i class="fas fa-paper-plane mr-1"></i>답변 저장</button>';
    h += '</div>';
    h += '</div>';
    body.innerHTML = h;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.inqCloseModal = function () {
    const modal = document.getElementById('inq-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
  };

  window.inqSaveReply = async function (id) {
    const v = document.getElementById('inq-modal-reply').value;
    if (!v.trim()) { alert('답변 내용을 입력해주세요.'); return; }
    await apiCall('/api/admin/inquiries/' + id, 'PUT', { admin_reply: v, status: 'replied' });
    window.inqCloseModal();
    await load();
  };

  window.inqDelete = async function (id) {
    if (!confirm('이 문의를 휴지통으로 이동하시겠습니까?')) return;
    await apiCall('/api/admin/inquiries/' + id, 'DELETE');
    await load();
  };

  window.inqRestore = async function (id) {
    if (!confirm('이 문의를 복구하시겠습니까?')) return;
    await apiCall('/api/admin/inquiries/' + id + '/restore', 'POST', {});
    await load();
  };

  window.inqPermanent = async function (id) {
    if (!confirm('⚠️ 이 문의를 영구 삭제하시겠습니까?\n\n개인정보가 완전히 파기되며 되돌릴 수 없습니다.\n「개인정보 보호법」 제21조에 따른 파기 절차로 기록됩니다.')) return;
    await apiCall('/api/admin/inquiries/' + id + '/permanent', 'DELETE');
    await load();
  };

  // ───── 내보내기 (CSV / Excel) ─────
  async function exportData(format) {
    // 현재 필터 조건 그대로 + export=true (서버에 감사로그 기록)
    const params = new URLSearchParams();
    params.set('export', 'true');
    if (state.search) params.set('search', state.search);
    if (state.status) params.set('status', state.status);
    if (state.consent !== '') params.set('consent', state.consent);
    if (state.date_from) params.set('date_from', state.date_from);
    if (state.date_to) params.set('date_to', state.date_to);
    params.set('sort_by', state.sort_by);
    params.set('sort_dir', state.sort_dir);
    if (state.deleted_only) params.set('deleted_only', 'true');
    else if (state.include_deleted) params.set('include_deleted', 'true');

    const d = await apiCall('/api/admin/inquiries?' + params.toString());
    if (!d || !d.success) { alert('내보내기 실패'); return; }

    const rows = (d.data || []).map(function (inq) {
      return {
        'ID': inq.id,
        '접수일시': fmtDate(inq.created_at),
        '이름': inq.name || '',
        '이메일': inq.email || '',
        '전화': inq.phone || '',
        '회사': inq.company || '',
        '제목': inq.subject || '',
        '내용': inq.message || '',
        '상태': inq.status === 'pending' ? '대기' : '답변완료',
        '답변': inq.admin_reply || '',
        '답변일시': fmtDate(inq.replied_at),
        '개인정보 동의': (inq.consent_personal_info === 1 || inq.consent_personal_info === true) ? 'O' : 'X',
        '동의 일시': inq.consent_at || '',
        '삭제일시': inq.deleted_at || '',
        '삭제자': inq.deleted_by || '',
      };
    });

    const dateStr = new Date().toISOString().substring(0, 10);
    const fname = 'koist-inquiries-' + dateStr;

    if (format === 'csv') {
      downloadCSV(rows, fname + '.csv');
    } else {
      downloadXLSX(rows, fname + '.xlsx');
    }
  }

  function downloadCSV(rows, filename) {
    if (rows.length === 0) { alert('내보낼 데이터가 없습니다.'); return; }
    const headers = Object.keys(rows[0]);
    const esc = function (v) {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return '"' + s + '"';
    };
    let csv = headers.map(esc).join(',') + '\n';
    rows.forEach(function (r) {
      csv += headers.map(function (h) { return esc(r[h]); }).join(',') + '\n';
    });
    // UTF-8 BOM (Excel 한글 호환)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, filename);
  }

  function downloadXLSX(rows, filename) {
    if (typeof XLSX === 'undefined') { alert('SheetJS 로드 실패 — CSV로 내보냅니다.'); downloadCSV(rows, filename.replace('.xlsx', '.csv')); return; }
    if (rows.length === 0) { alert('내보낼 데이터가 없습니다.'); return; }
    const ws = XLSX.utils.json_to_sheet(rows);
    // 컬럼 너비 자동
    const cols = Object.keys(rows[0]).map(function (k) {
      const maxLen = Math.max(k.length, ...rows.map(function (r) { return String(r[k] || '').length; }));
      return { wch: Math.min(Math.max(maxLen + 2, 8), 50) };
    });
    ws['!cols'] = cols;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '상담문의');
    XLSX.writeFile(wb, filename);
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ───── 시작 ─────
  load();
})();

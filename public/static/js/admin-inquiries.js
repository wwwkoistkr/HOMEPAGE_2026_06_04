// ═══════════════════════════════════════════════════════════════════
// KOIST Admin - Inquiries Management (v39.29 Phase 3 임시 버전)
// ═══════════════════════════════════════════════════════════════════
// Phase 3 변경사항:
//   - 동의 배지 (consent_personal_info) 표시
//   - 휴지통 토글 (include_deleted)
//   - 휴지통에서 복구 / 영구 삭제 버튼
//   - 삭제는 Soft Delete (UPDATE deleted_at)
//
// 주의: Phase 4 (v39.30)에서 엑셀 스타일 테이블로 완전히 재작성됨
// ═══════════════════════════════════════════════════════════════════
(async function () {
  'use strict';
  const c = document.getElementById('admin-content');
  let showDeleted = false;

  await load();

  async function load() {
    const url = '/api/admin/inquiries' + (showDeleted ? '?include_deleted=true' : '');
    const d = await apiCall(url);
    if (!d) return;
    const list = (d.data || []).filter(function (i) {
      return showDeleted ? true : !i.deleted_at;
    });
    const trashCount = (d.data || []).filter(function (i) { return i.deleted_at; }).length;

    let h = '<div class="flex justify-between items-center mb-4 flex-wrap gap-2">';
    h += '  <div class="flex items-center gap-2">';
    h += '    <span class="text-gray-500 text-sm">총 ' + list.length + '건</span>';
    h += '    <span class="text-xs px-2 py-1 rounded bg-yellow-50 text-yellow-600">';
    h += '대기: ' + list.filter(function (i) { return i.status === 'pending'; }).length + '건';
    h += '    </span>';
    h += '    <span class="text-xs px-2 py-1 rounded bg-green-50 text-green-600">';
    h += '답변완료: ' + list.filter(function (i) { return i.status !== 'pending'; }).length + '건';
    h += '    </span>';
    h += '  </div>';
    h += '  <div class="flex items-center gap-2">';
    h += '    <button onclick="toggleTrash()" class="text-xs px-3 py-1.5 rounded border ' +
      (showDeleted
        ? 'border-orange-300 bg-orange-50 text-orange-700'
        : 'border-gray-200 bg-white text-gray-600') +
      ' hover:bg-orange-50 transition">' +
      '<i class="fas ' + (showDeleted ? 'fa-arrow-left' : 'fa-trash-can') + ' mr-1"></i>' +
      (showDeleted ? '목록으로' : '휴지통' + (trashCount > 0 ? ' (' + trashCount + ')' : '')) +
      '</button>';
    h += '  </div>';
    h += '</div>';
    h += '<div class="space-y-3">';

    list.forEach(function (inq) {
      const isDeleted = !!inq.deleted_at;
      h += '<div class="border rounded-lg p-4 ' + (isDeleted ? 'border-orange-200 bg-orange-50/30' : '') + '">';
      h += '  <div class="flex justify-between items-start mb-2 flex-wrap gap-2">';
      h += '    <div class="flex items-center gap-2 flex-wrap">';
      h += '      <span class="font-medium text-gray-800">' + escapeHtml(inq.subject) + '</span>';
      h += '      <span class="px-2 py-0.5 rounded text-xs ' +
        (inq.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600') +
        '">' + (inq.status === 'pending' ? '대기' : '답변완료') + '</span>';
      // 동의 배지 (v39.29 추가)
      if (inq.consent_personal_info === 1 || inq.consent_personal_info === true) {
        h += '      <span class="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-600" title="개인정보 수집·이용 동의 완료 (' + escapeHtml(inq.consent_at || '') + ')"><i class="fas fa-check-circle mr-0.5"></i>동의</span>';
      } else if (inq.created_at && new Date(inq.created_at) >= new Date('2026-06-01')) {
        h += '      <span class="px-2 py-0.5 rounded text-xs bg-red-50 text-red-600" title="동의 없음"><i class="fas fa-exclamation-triangle mr-0.5"></i>미동의</span>';
      } else {
        h += '      <span class="px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-500" title="v39.27 이전 데이터">레거시</span>';
      }
      if (isDeleted) {
        h += '      <span class="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700"><i class="fas fa-trash-can mr-0.5"></i>삭제됨</span>';
      }
      h += '    </div>';
      h += '    <div class="flex items-center gap-2">';
      h += '      <span class="text-xs text-gray-400">' + (inq.created_at || '').split('T')[0] + '</span>';
      if (isDeleted) {
        h += '      <button onclick="restoreInq(' + inq.id + ')" class="text-xs px-2 py-1 rounded border border-blue-200 text-blue-500 hover:bg-blue-50"><i class="fas fa-undo mr-0.5"></i>복구</button>';
        h += '      <button onclick="permanentDeleteInq(' + inq.id + ')" class="text-xs px-2 py-1 rounded border border-red-300 bg-red-50 text-red-600 hover:bg-red-100"><i class="fas fa-skull-crossbones mr-0.5"></i>영구삭제</button>';
      } else {
        h += '      <button onclick="deleteInq(' + inq.id + ')" class="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50">삭제</button>';
      }
      h += '    </div>';
      h += '  </div>';
      h += '  <div class="text-sm text-gray-600 mb-2">' + escapeHtml((inq.message || '').substring(0, 300)) + (inq.message && inq.message.length > 300 ? '...' : '') + '</div>';
      h += '  <div class="text-xs text-gray-400 mb-3">';
      h += '    <i class="fas fa-user mr-1"></i>' + escapeHtml(inq.name || '');
      if (inq.company) h += ' | <i class="fas fa-building mr-1"></i>' + escapeHtml(inq.company);
      if (inq.email) h += ' | <i class="fas fa-envelope mr-1"></i>' + escapeHtml(inq.email);
      if (inq.phone) h += ' | <i class="fas fa-phone mr-1"></i>' + escapeHtml(inq.phone);
      if (inq.deleted_at) h += '<br><i class="fas fa-clock mr-1 text-orange-500"></i>삭제됨: ' + escapeHtml(inq.deleted_at) + ' by ' + escapeHtml(inq.deleted_by || '-');
      h += '  </div>';

      if (!isDeleted) {
        if (inq.admin_reply) {
          h += '  <div class="mt-3 p-3 bg-blue-50 rounded-lg">';
          h += '    <div class="flex justify-between items-center mb-1">';
          h += '      <span class="text-xs font-medium text-blue-700"><i class="fas fa-reply mr-1"></i>관리자 답변</span>';
          h += '      <button onclick="editReply(' + inq.id + ')" class="text-xs text-blue-500 hover:underline">수정</button>';
          h += '    </div>';
          h += '    <div id="reply-view-' + inq.id + '" class="text-sm text-blue-700">' + escapeHtml(inq.admin_reply) + '</div>';
          h += '    <div id="reply-edit-' + inq.id + '" class="hidden">';
          h += '      <textarea id="reply-text-' + inq.id + '" rows="3" class="w-full px-3 py-2 border rounded-lg text-sm mb-2">' + escapeHtml(inq.admin_reply) + '</textarea>';
          h += '      <div class="flex gap-2">';
          h += '        <button onclick="replyInq(' + inq.id + ')" class="bg-blue-500 text-white px-3 py-1.5 rounded text-xs">저장</button>';
          h += '        <button onclick="cancelEditReply(' + inq.id + ')" class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs">취소</button>';
          h += '      </div></div>';
          h += '  </div>';
        } else {
          h += '  <div class="mt-3 border-t pt-3">';
          h += '    <textarea id="reply-text-' + inq.id + '" rows="2" placeholder="답변을 입력하세요..." class="w-full px-3 py-2 border rounded-lg text-sm mb-2"></textarea>';
          h += '    <button onclick="replyInq(' + inq.id + ')" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"><i class="fas fa-reply mr-1"></i>답변</button>';
          h += '  </div>';
        }
      }
      h += '</div>';
    });
    h += '</div>';
    if (list.length === 0) {
      h += '<p class="text-gray-400 text-center py-12">';
      h += showDeleted ? '휴지통이 비어있습니다.' : '접수된 문의가 없습니다.';
      h += '</p>';
    }
    c.innerHTML = h;
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.toggleTrash = function () {
    showDeleted = !showDeleted;
    load();
  };

  window.replyInq = async function (id) {
    var reply = document.getElementById('reply-text-' + id).value;
    if (!reply) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    await apiCall('/api/admin/inquiries/' + id, 'PUT', { admin_reply: reply, status: 'replied' });
    await load();
  };

  window.editReply = function (id) {
    document.getElementById('reply-view-' + id).classList.add('hidden');
    document.getElementById('reply-edit-' + id).classList.remove('hidden');
  };

  window.cancelEditReply = function (id) {
    document.getElementById('reply-view-' + id).classList.remove('hidden');
    document.getElementById('reply-edit-' + id).classList.add('hidden');
  };

  // Soft Delete (휴지통으로 이동)
  window.deleteInq = async function (id) {
    if (!confirm('이 문의를 휴지통으로 이동하시겠습니까?\n\n휴지통에서 복구하거나 영구 삭제할 수 있습니다.')) return;
    await apiCall('/api/admin/inquiries/' + id, 'DELETE');
    await load();
  };

  // 복구
  window.restoreInq = async function (id) {
    if (!confirm('이 문의를 휴지통에서 복구하시겠습니까?')) return;
    await apiCall('/api/admin/inquiries/' + id + '/restore', 'POST', {});
    await load();
  };

  // 영구 삭제 (개인정보 파기)
  window.permanentDeleteInq = async function (id) {
    if (!confirm('⚠️ 이 문의를 영구 삭제하시겠습니까?\n\n개인정보가 완전히 파기되며 되돌릴 수 없습니다.\n「개인정보 보호법」 제21조에 따른 파기 절차로 기록됩니다.')) return;
    await apiCall('/api/admin/inquiries/' + id + '/permanent', 'DELETE');
    await load();
  };
})();

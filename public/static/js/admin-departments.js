// Admin - Departments Management (Full CRUD + Sub-pages)
(async function(){
  const c = document.getElementById('admin-content');
  let deptList = [];
  await load();

  async function load(){
    const d = await apiCall('/api/admin/departments');
    if(!d) return;
    deptList = d.data || [];
    let h = '<div class="flex justify-between items-center mb-4">';
    h += '<span class="text-gray-500 text-sm">총 '+deptList.length+'개</span>';
    h += '<button onclick="showDeptForm()" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"><i class="fas fa-plus mr-1"></i>추가</button>';
    h += '</div><div id="deptFormArea" class="hidden mb-4"></div><div class="space-y-2" id="deptList">';
    deptList.forEach(dept => {
      h += '<div class="border rounded-lg p-4">';
      h += '<div class="flex items-center justify-between gap-4">';
      h += '<div class="flex items-center gap-3 min-w-0">';
      h += dept.image_url ? '<img src="'+dept.image_url+'" alt="'+dept.name+'" class="w-10 h-10 rounded-lg object-cover shrink-0" style="border:1px solid '+dept.color+'30">' : '<div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style="background:'+dept.color+'15"><i class="fas '+dept.icon+'" style="color:'+dept.color+'"></i></div>';
      h += '<div class="min-w-0"><div class="font-medium flex items-center gap-2">'+dept.name;
      // v40.0: 주요 평가현황 카테고리 뱃지
      if (dept.is_main_progress === 1) {
        h += '<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 border border-green-300" title="평가현황 주요 카테고리"><i class="fas fa-star" style="font-size:9px"></i>평가현황</span>';
      }
      h += '</div>';
      h += '<div class="text-xs text-gray-400">/'+dept.slug+' | 순서:'+dept.sort_order+' | '+(dept.is_active?'<span class="text-green-600">활성</span>':'<span class="text-red-500">비활성</span>')+'</div></div></div>';
      h += '<div class="flex gap-2 shrink-0">';
      h += '<button onclick="showSubPages('+dept.id+',\''+dept.name.replace(/'/g,"\\'")+'\')" class="text-xs px-3 py-1.5 rounded-lg border bg-blue-50 text-blue-600 hover:bg-blue-100"><i class="fas fa-file-lines mr-1"></i>하위페이지</button>';
      h += '<button onclick="editDept('+dept.id+')" class="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50">수정</button>';
      h += '<button onclick="toggleDept('+dept.id+','+(dept.is_active?0:1)+')" class="text-xs px-3 py-1.5 rounded-lg border">'+(dept.is_active?'비활성화':'활성화')+'</button>';
      h += '<button onclick="deleteDept('+dept.id+')" class="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">삭제</button>';
      h += '</div></div>';
      h += '<div id="subpages-'+dept.id+'" class="hidden mt-3 pt-3 border-t"></div>';
      h += '</div>';
    });
    h += '</div>';
    c.innerHTML = h;
  }

  function deptFormHtml(dept){
    const isEdit = !!dept;
    // v40.0: progress_meta 파싱 (안전한 JSON 처리)
    let pm = { col2:'', col3:'', col4:'', col2Opts:[], col3Opts:[], col4Opts:[], statusOpts:[], col4FreeText:false };
    if (dept && dept.progress_meta) {
      try { pm = Object.assign(pm, JSON.parse(dept.progress_meta)); } catch (e) { /* ignore */ }
    }
    const isMain = dept?.is_main_progress === 1;
    return '<div class="border rounded-lg p-4 bg-gray-50"><h4 class="font-medium mb-3">'+(isEdit?'사업분야 수정':'사업분야 추가')+'</h4>'
      +'<div class="grid grid-cols-2 gap-3 mb-3">'
      +'<input id="dName" value="'+(dept?.name||'')+'" placeholder="이름" class="px-3 py-2 border rounded-lg text-sm">'
      +'<input id="dSlug" value="'+(dept?.slug||'')+'" placeholder="슬러그(영문)" class="px-3 py-2 border rounded-lg text-sm">'
      +'<input id="dIcon" value="'+(dept?.icon||'fa-shield-halved')+'" placeholder="아이콘 (fa-xxx)" class="px-3 py-2 border rounded-lg text-sm">'
      +'<input id="dColor" value="'+(dept?.color||'#3B82F6')+'" type="color" class="px-3 py-2 border rounded-lg h-[42px]">'
      +'<input id="dOrder" type="number" value="'+(dept?.sort_order||0)+'" placeholder="순서" class="px-3 py-2 border rounded-lg text-sm">'
      +'</div>'
      +'<textarea id="dDesc" rows="2" placeholder="설명" class="w-full px-3 py-2 border rounded-lg text-sm mb-3">'+(dept?.description||'')+'</textarea>'
      +'<div class="mb-3"><label class="block text-xs font-medium text-gray-500 mb-1"><i class="fas fa-image mr-1"></i>사업분야 아이콘 이미지 URL</label>'
      +'<div class="flex gap-2 items-center">'
      +'<input id="dImageUrl" value="'+(dept?.image_url||'')+'" placeholder="/static/images/dept-icons/... 또는 /api/images/..." class="flex-1 px-3 py-2 border rounded-lg text-sm">'
      +(dept?.image_url ? '<img src="'+dept.image_url+'" class="w-10 h-10 rounded-lg object-cover border">' : '')+'</div></div>'
      +'<div class="mb-3"><label class="block text-xs font-medium text-gray-500 mb-1"><i class="fas fa-panorama mr-1"></i>헤더 배경 이미지 URL (비워두면 기본 그라데이션 사용)</label>'
      +'<input id="dHeaderBg" value="'+(dept?.header_bg_url||'')+'" placeholder="/api/images/background/... 또는 외부 URL" class="w-full px-3 py-2 border rounded-lg text-sm"></div>'
      +'<div class="mb-3 border-t pt-3 mt-3"><label class="block text-xs font-semibold text-blue-600 mb-2"><i class="fas fa-phone-volume mr-1"></i>담당자 연락처 (비워두면 대표번호 표시)</label>'
      +'<div class="grid grid-cols-3 gap-3">'
      +'<div><label class="block text-xs text-gray-400 mb-1">담당부서</label><input id="dContactDept" value="'+(dept?.contact_dept||'')+'" placeholder="예: 평가1팀" class="w-full px-3 py-2 border rounded-lg text-sm"></div>'
      +'<div><label class="block text-xs text-gray-400 mb-1">담당자명</label><input id="dContactName" value="'+(dept?.contact_name||'')+'" placeholder="예: 홍길동 팀장" class="w-full px-3 py-2 border rounded-lg text-sm"></div>'
      +'<div><label class="block text-xs text-gray-400 mb-1">전화번호</label><input id="dContactPhone" value="'+(dept?.contact_phone||'')+'" placeholder="예: 02-1234-5678" class="w-full px-3 py-2 border rounded-lg text-sm"></div>'
      +'</div></div>'
      +'<div class="mb-3 border-t pt-3 mt-3"><label class="block text-xs font-semibold text-indigo-600 mb-2"><i class="fas fa-palette mr-1"></i>v39.7: 원본 koist.kr 디자인 테마 (서비스 페이지)</label>'
      +'<div class="grid grid-cols-2 gap-3">'
      +'<div><label class="block text-xs text-gray-400 mb-1">원본 디자인 사용 여부</label>'
      +'<select id="dUseLegacyTheme" class="w-full px-3 py-2 border rounded-lg text-sm">'
      +'<option value="1"'+((dept?.use_legacy_theme===1||dept?.use_legacy_theme===undefined)?' selected':'')+'>✓ ON — koist.kr 원본 디자인 적용 (권장)</option>'
      +'<option value="0"'+(dept?.use_legacy_theme===0?' selected':'')+'>✗ OFF — 기존 prose 디자인 사용</option>'
      +'</select></div>'
      +'<div><label class="block text-xs text-gray-400 mb-1">영문 서브타이틀 (tit_cm span)</label>'
      +'<input id="dEnglishSubtitle" value="'+(dept?.english_subtitle||'')+'" placeholder="예: CC EVALUATION, KCMVP" class="w-full px-3 py-2 border rounded-lg text-sm uppercase" style="font-family:\'Play\',sans-serif"></div>'
      +'</div>'
      +'<p class="text-xs text-gray-400 mt-2"><i class="fas fa-info-circle mr-1"></i>ON: 네이비 #005f9b 기반 200px 컬럼 레이아웃, 60px 섹션 간격 — 원본과 동일 / OFF: 기존 파란색 카드 스타일</p></div>'
      // ───────────────────────────────────────────────────
      // v40.0: 평가현황 통합 관리 (progress_meta + is_main_progress)
      // ───────────────────────────────────────────────────
      +'<div class="mb-3 border-t pt-3 mt-3"><label class="block text-xs font-semibold text-green-700 mb-2"><i class="fas fa-chart-line mr-1"></i>v40.0: 평가현황 통합 관리</label>'
      +'<div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">'
      +'<label class="flex items-center gap-2 text-sm font-medium cursor-pointer">'
      +'<input type="checkbox" id="dIsMainProgress"'+(isMain?' checked':'')+' class="w-4 h-4">'
      +'<span><i class="fas fa-star text-yellow-500 mr-1"></i>이 사업분야를 <b>평가현황 주요 카테고리</b>로 표시 (관리자 → 평가현황 카드에 노출)</span>'
      +'</label>'
      +'<p class="text-xs text-gray-500 mt-1 ml-6">체크 해제 시: "기타" 그룹으로 묶임. 4개 주요 카테고리만 체크 권장 (CC평가, 보안기능시험, 성능평가, 암호모듈검증)</p>'
      +'</div>'
      +'<div class="bg-white border rounded-lg p-3">'
      +'<div class="text-xs font-semibold text-gray-600 mb-2"><i class="fas fa-columns mr-1"></i>평가현황 표 컬럼 옵션 (이 사업분야의 평가 항목 추가 시 사용)</div>'
      +'<div class="grid grid-cols-3 gap-3 mb-3">'
      +'<div><label class="block text-xs text-gray-400 mb-1">컬럼2 제목 (예: 보증등급)</label>'
      +'<input id="dPmCol2" value="'+esc(pm.col2)+'" placeholder="보증등급" class="w-full px-2 py-1.5 border rounded text-sm"></div>'
      +'<div><label class="block text-xs text-gray-400 mb-1">컬럼3 제목 (예: 인증구분)</label>'
      +'<input id="dPmCol3" value="'+esc(pm.col3)+'" placeholder="인증구분" class="w-full px-2 py-1.5 border rounded text-sm"></div>'
      +'<div><label class="block text-xs text-gray-400 mb-1">컬럼4 제목 (예: 신청구분, 없으면 -)</label>'
      +'<input id="dPmCol4" value="'+esc(pm.col4)+'" placeholder="신청구분" class="w-full px-2 py-1.5 border rounded text-sm"></div>'
      +'</div>'
      +'<div class="grid grid-cols-3 gap-3 mb-3">'
      +'<div><label class="block text-xs text-gray-400 mb-1">컬럼2 옵션 (쉼표 구분)</label>'
      +'<textarea id="dPmCol2Opts" rows="2" placeholder="EAL1,EAL2,EAL3,EAL4" class="w-full px-2 py-1.5 border rounded text-sm font-mono">'+esc((pm.col2Opts||[]).join(','))+'</textarea></div>'
      +'<div><label class="block text-xs text-gray-400 mb-1">컬럼3 옵션 (쉼표 구분)</label>'
      +'<textarea id="dPmCol3Opts" rows="2" placeholder="최초평가,재평가" class="w-full px-2 py-1.5 border rounded text-sm font-mono">'+esc((pm.col3Opts||[]).join(','))+'</textarea></div>'
      +'<div><label class="block text-xs text-gray-400 mb-1">컬럼4 옵션 (쉼표 구분)</label>'
      +'<textarea id="dPmCol4Opts" rows="2" placeholder="국내평가,국제평가" class="w-full px-2 py-1.5 border rounded text-sm font-mono">'+esc((pm.col4Opts||[]).join(','))+'</textarea></div>'
      +'</div>'
      +'<div class="grid grid-cols-2 gap-3">'
      +'<div><label class="block text-xs text-gray-400 mb-1">진행상태 옵션 (쉼표 구분)</label>'
      +'<input id="dPmStatusOpts" value="'+esc((pm.statusOpts||[]).join(','))+'" placeholder="평가접수,평가진행,평가완료" class="w-full px-2 py-1.5 border rounded text-sm font-mono"></div>'
      +'<div class="flex items-end"><label class="flex items-center gap-2 text-xs cursor-pointer">'
      +'<input type="checkbox" id="dPmCol4FreeText"'+(pm.col4FreeText?' checked':'')+' class="w-4 h-4">'
      +'<span>컬럼4를 자유 텍스트 입력으로 (옵션 무시)</span>'
      +'</label></div>'
      +'</div>'
      +'<p class="text-xs text-gray-400 mt-2"><i class="fas fa-lightbulb mr-1 text-yellow-500"></i>여기서 설정한 컬럼 제목/옵션은 <b>관리자 → 평가현황</b> 화면에서 이 사업분야의 데이터 추가/수정 시 자동 사용됩니다.</p>'
      +'</div></div>'
      +'<div class="flex gap-2">'
      +'<button onclick="saveDept('+(dept?.id||'null')+')" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">저장</button>'
      +'<button onclick="document.getElementById(\'deptFormArea\').classList.add(\'hidden\')" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">취소</button>'
      +'</div></div>';
  }

  // v40.0: HTML escape helper for textarea/input values
  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  window.showDeptForm = function(){ 
    const a = document.getElementById('deptFormArea'); 
    a.classList.remove('hidden'); 
    a.innerHTML = deptFormHtml(null); 
  };

  window.editDept = function(id){
    const dept = deptList.find(d => d.id === id);
    if(!dept) return;
    const a = document.getElementById('deptFormArea');
    a.classList.remove('hidden');
    a.innerHTML = deptFormHtml(dept);
    a.scrollIntoView({behavior:'smooth'});
  };

  window.saveDept = async function(id){
    // v40.0: progress_meta 객체 구성 (쉼표 구분 → 배열 변환)
    function parseList(s) {
      if (!s) return [];
      return String(s).split(',').map(function(v){ return v.trim(); }).filter(function(v){ return v.length > 0; });
    }
    const pmCol2 = (document.getElementById('dPmCol2')?.value || '').trim();
    const pmCol3 = (document.getElementById('dPmCol3')?.value || '').trim();
    const pmCol4 = (document.getElementById('dPmCol4')?.value || '').trim();
    const pmCol2Opts = parseList(document.getElementById('dPmCol2Opts')?.value);
    const pmCol3Opts = parseList(document.getElementById('dPmCol3Opts')?.value);
    const pmCol4Opts = parseList(document.getElementById('dPmCol4Opts')?.value);
    const pmStatusOpts = parseList(document.getElementById('dPmStatusOpts')?.value);
    const pmCol4FreeText = !!document.getElementById('dPmCol4FreeText')?.checked;
    const isMainProgress = document.getElementById('dIsMainProgress')?.checked ? 1 : 0;
    
    // 빈 메타가 아닐 때만 progress_meta 구성, 빈 경우 '{}'
    const hasMeta = pmCol2 || pmCol3 || pmCol4 || pmCol2Opts.length || pmCol3Opts.length || pmCol4Opts.length || pmStatusOpts.length;
    const progressMeta = hasMeta ? JSON.stringify({
      col2: pmCol2, col3: pmCol3, col4: pmCol4,
      col2Opts: pmCol2Opts, col3Opts: pmCol3Opts, col4Opts: pmCol4Opts,
      statusOpts: pmStatusOpts,
      col4FreeText: pmCol4FreeText
    }) : '{}';
    
    const body = {
      name: document.getElementById('dName').value,
      slug: document.getElementById('dSlug').value,
      description: document.getElementById('dDesc').value,
      icon: document.getElementById('dIcon').value,
      color: document.getElementById('dColor').value,
      sort_order: parseInt(document.getElementById('dOrder').value)||0,
      image_url: document.getElementById('dImageUrl').value,
      header_bg_url: document.getElementById('dHeaderBg').value,
      contact_dept: (document.getElementById('dContactDept').value||'').trim(),
      contact_name: (document.getElementById('dContactName').value||'').trim(),
      contact_phone: (document.getElementById('dContactPhone').value||'').trim(),
      use_legacy_theme: parseInt(document.getElementById('dUseLegacyTheme')?.value || '1'),
      english_subtitle: (document.getElementById('dEnglishSubtitle')?.value||'').trim().toUpperCase(),
      // v40.0: 평가현황 통합 관리 필드
      progress_meta: progressMeta,
      is_main_progress: isMainProgress
    };
    if(id) await apiCall('/api/admin/departments/'+id, 'PUT', body);
    else await apiCall('/api/admin/departments', 'POST', body);
    document.getElementById('deptFormArea').classList.add('hidden');
    await load();
  };

  window.toggleDept = async function(id,v){ await apiCall('/api/admin/departments/'+id,'PUT',{is_active:v}); await load(); };
  window.deleteDept = async function(id){ if(!confirm('이 사업분야와 하위 페이지가 모두 삭제됩니다. 삭제하시겠습니까?')) return; await apiCall('/api/admin/departments/'+id,'DELETE'); await load(); };

  // ========== Sub-pages Management ==========
  window.showSubPages = async function(deptId, deptName){
    const container = document.getElementById('subpages-'+deptId);
    if(!container.classList.contains('hidden')){
      container.classList.add('hidden');
      return;
    }
    container.classList.remove('hidden');
    container.innerHTML = '<p class="text-gray-400 text-sm"><i class="fas fa-spinner fa-spin mr-1"></i>로딩...</p>';

    const d = await apiCall('/api/admin/departments/'+deptId+'/pages');
    if(!d) return;
    const pages = d.data || [];

    let h = '<div class="flex justify-between items-center mb-3">';
    h += '<span class="text-sm font-medium text-gray-600"><i class="fas fa-file-lines mr-1"></i>'+deptName+' 하위 페이지 ('+pages.length+'개)</span>';
    h += '<button onclick="showPageForm('+deptId+',null)" class="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-green-600"><i class="fas fa-plus mr-1"></i>페이지 추가</button>';
    h += '</div>';
    h += '<div id="pageForm-'+deptId+'" class="hidden mb-3"></div>';

    if(pages.length === 0){
      h += '<p class="text-gray-400 text-sm py-2">등록된 하위 페이지가 없습니다.</p>';
    } else {
      pages.forEach(p => {
        h += '<div class="bg-white border rounded-lg p-3 mb-2 flex items-center justify-between gap-3">';
        h += '<div class="min-w-0"><div class="text-sm font-medium">'+p.title+'</div>';
        h += '<div class="text-xs text-gray-400">/'+p.slug+' | 순서:'+p.sort_order+' | '+(p.is_active?'활성':'비활성')+'</div></div>';
        h += '<div class="flex gap-2 shrink-0">';
        h += '<button onclick="editPage('+deptId+','+p.id+')" class="text-xs px-2 py-1 rounded border hover:bg-gray-50">수정</button>';
        h += '<button onclick="deletePage('+p.id+','+deptId+')" class="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50">삭제</button>';
        h += '</div></div>';
      });
    }
    container.innerHTML = h;
    container._pages = pages;
  };

  window.showPageForm = function(deptId, page){
    const f = document.getElementById('pageForm-'+deptId);
    f.classList.remove('hidden');
    const isEdit = !!page;
    const escapedContent = (page?.content||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    f.innerHTML = '<div class="bg-green-50 border border-green-200 rounded-lg p-3">'
      +'<h5 class="text-sm font-medium mb-2">'+(isEdit?'페이지 수정':'새 페이지 추가')+'</h5>'
      +'<div class="grid grid-cols-3 gap-2 mb-2">'
      +'<input id="pTitle-'+deptId+'" value="'+(page?.title||'')+'" placeholder="제목" class="px-2 py-1.5 border rounded text-sm">'
      +'<input id="pSlug-'+deptId+'" value="'+(page?.slug||'')+'" placeholder="슬러그(영문)" class="px-2 py-1.5 border rounded text-sm">'
      +'<input id="pOrder-'+deptId+'" type="number" value="'+(page?.sort_order||0)+'" placeholder="순서" class="px-2 py-1.5 border rounded text-sm">'
      +'</div>'
      // Rich text toolbar
      +'<div class="border rounded-t bg-white px-2 py-1.5 flex flex-wrap items-center gap-1" style="border-bottom:none;">'
      +'<button type="button" onclick="editorCmd(\'bold\')" class="px-2 py-1 rounded text-xs font-bold hover:bg-gray-100 border" title="굵게"><i class="fas fa-bold"></i></button>'
      +'<button type="button" onclick="editorCmd(\'italic\')" class="px-2 py-1 rounded text-xs hover:bg-gray-100 border" title="기울임"><i class="fas fa-italic"></i></button>'
      +'<button type="button" onclick="editorCmd(\'underline\')" class="px-2 py-1 rounded text-xs hover:bg-gray-100 border" title="밑줄"><i class="fas fa-underline"></i></button>'
      +'<span class="w-px h-5 bg-gray-200 mx-1"></span>'
      +'<select onchange="editorFontSize(this.value,'+deptId+')" class="px-1 py-1 border rounded text-xs" title="글자 크기">'
      +'<option value="">크기</option>'
      +'<option value="0.8em">작게</option>'
      +'<option value="1em">보통</option>'
      +'<option value="1.3em">크게</option>'
      +'<option value="1.6em">아주크게</option>'
      +'<option value="2em">특대</option>'
      +'</select>'
      +'<span class="w-px h-5 bg-gray-200 mx-1"></span>'
      +'<label class="flex items-center gap-1 px-1 py-1 rounded hover:bg-gray-100 border cursor-pointer text-xs" title="글자색">'
      +'<i class="fas fa-palette" style="color:#EF4444;font-size:11px"></i>'
      +'<input type="color" value="#EF4444" onchange="editorColor(this.value,'+deptId+')" class="w-0 h-0 opacity-0 absolute">'
      +'</label>'
      +'<label class="flex items-center gap-1 px-1 py-1 rounded hover:bg-gray-100 border cursor-pointer text-xs" title="배경색">'
      +'<i class="fas fa-fill-drip" style="color:#FEF08A;font-size:11px"></i>'
      +'<input type="color" value="#FEF08A" onchange="editorBgColor(this.value,'+deptId+')" class="w-0 h-0 opacity-0 absolute">'
      +'</label>'
      +'<span class="w-px h-5 bg-gray-200 mx-1"></span>'
      +'<button type="button" onclick="editorCmd(\'insertUnorderedList\')" class="px-2 py-1 rounded text-xs hover:bg-gray-100 border" title="목록"><i class="fas fa-list-ul"></i></button>'
      +'<button type="button" onclick="editorCmd(\'justifyLeft\')" class="px-2 py-1 rounded text-xs hover:bg-gray-100 border" title="왼쪽 정렬"><i class="fas fa-align-left"></i></button>'
      +'<button type="button" onclick="editorCmd(\'justifyCenter\')" class="px-2 py-1 rounded text-xs hover:bg-gray-100 border" title="가운데 정렬"><i class="fas fa-align-center"></i></button>'
      +'<span class="w-px h-5 bg-gray-200 mx-1"></span>'
      +'<button type="button" onclick="editorCmd(\'removeFormat\')" class="px-2 py-1 rounded text-xs hover:bg-gray-100 border text-red-400" title="서식 제거"><i class="fas fa-eraser"></i></button>'
      +'<button type="button" onclick="toggleSourceView('+deptId+')" class="px-2 py-1 rounded text-xs hover:bg-gray-100 border text-gray-400 ml-auto" title="HTML 소스보기"><i class="fas fa-code"></i></button>'
      +'</div>'
      // Rich editor area
      +'<div id="pEditor-'+deptId+'" contenteditable="true" class="w-full px-3 py-2 border rounded-b text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30" style="min-height:150px; max-height:400px; overflow-y:auto; line-height:1.7;">'+(page?.content||'')+'</div>'
      // Hidden textarea for source view toggle
      +'<textarea id="pContent-'+deptId+'" rows="6" class="w-full px-2 py-1.5 border rounded text-sm mb-2 font-mono hidden" style="min-height:150px;">'+(page?.content||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</textarea>'
      +'<div class="mt-2 mb-2"><label class="block text-xs font-medium text-gray-500 mb-1"><i class="fas fa-panorama mr-1"></i>페이지 배경 이미지 URL (비워두면 상위 사업분야 배경 사용)</label>'
      +'<input id="pHeaderBg-'+deptId+'" value="'+(page?.header_bg_url||'')+'" placeholder="/api/images/background/... 또는 외부 URL" class="w-full px-2 py-1.5 border rounded text-sm"></div>'
      +'<div class="flex gap-2 mt-2">'
      +'<button onclick="savePage('+deptId+','+(page?.id||'null')+')" class="bg-green-500 text-white px-3 py-1.5 rounded text-xs">저장</button>'
      +'<button onclick="document.getElementById(\'pageForm-'+deptId+'\').classList.add(\'hidden\')" class="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs">취소</button>'
      +'</div></div>';
  };

  window.editPage = function(deptId, pageId){
    const container = document.getElementById('subpages-'+deptId);
    const pages = container._pages || [];
    const page = pages.find(p => p.id === pageId);
    if(page) window.showPageForm(deptId, page);
  };

  window.savePage = async function(deptId, pageId){
    // Get content from rich editor or source textarea
    var editor = document.getElementById('pEditor-'+deptId);
    var textarea = document.getElementById('pContent-'+deptId);
    var content = '';
    if (editor && !editor.classList.contains('hidden')) {
      content = editor.innerHTML;
    } else if (textarea) {
      content = textarea.value;
    }
    const body = {
      title: document.getElementById('pTitle-'+deptId).value,
      slug: document.getElementById('pSlug-'+deptId).value,
      content: content,
      sort_order: parseInt(document.getElementById('pOrder-'+deptId).value)||0,
      header_bg_url: (document.getElementById('pHeaderBg-'+deptId).value||'').trim()
    };
    if(pageId) await apiCall('/api/admin/dep-pages/'+pageId, 'PUT', body);
    else await apiCall('/api/admin/departments/'+deptId+'/pages', 'POST', body);
    const dept = deptList.find(d => d.id === deptId);
    await window.showSubPages(deptId, dept?.name||'');
  };

  window.deletePage = async function(pageId, deptId){
    if(!confirm('이 페이지를 삭제하시겠습니까?')) return;
    await apiCall('/api/admin/dep-pages/'+pageId, 'DELETE');
    const dept = deptList.find(d => d.id === deptId);
    await window.showSubPages(deptId, dept?.name||'');
  };

  // ========== Rich Text Editor Helpers ==========
  window.editorCmd = function(cmd) {
    document.execCommand(cmd, false, null);
  };

  window.editorFontSize = function(size, deptId) {
    if (!size) return;
    var sel = window.getSelection();
    if (!sel.rangeCount) return;
    var range = sel.getRangeAt(0);
    if (range.collapsed) return;
    var span = document.createElement('span');
    span.style.fontSize = size;
    range.surroundContents(span);
    sel.removeAllRanges();
  };

  window.editorColor = function(color, deptId) {
    document.execCommand('foreColor', false, color);
  };

  window.editorBgColor = function(color, deptId) {
    document.execCommand('hiliteColor', false, color);
  };

  window.toggleSourceView = function(deptId) {
    var editor = document.getElementById('pEditor-'+deptId);
    var textarea = document.getElementById('pContent-'+deptId);
    if (!editor || !textarea) return;
    if (editor.classList.contains('hidden')) {
      // Switch back to rich editor
      editor.innerHTML = textarea.value;
      editor.classList.remove('hidden');
      textarea.classList.add('hidden');
    } else {
      // Switch to source view
      textarea.value = editor.innerHTML;
      textarea.classList.remove('hidden');
      editor.classList.add('hidden');
    }
  };
})();

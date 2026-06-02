// Admin - Progress Management v40.1 (table-fixed + colgroup + 1.5× 강조 + 30% 컬럼 축소)
// v40.1 핵심 변경 (사용자 피드백 반영):
//   - table-fixed + colgroup으로 컬럼 폭 명시 (브라우저 자동 분배 차단)
//   - 제품명·업체 컬럼: 30% (기존 45~50%에서 축소)
//   - 글자 크기: text-lg (1.5×) + font-bold (강조 강화)
//   - whitespace-nowrap + overflow-hidden + text-ellipsis (한 줄 강제)
// v40.0 변경 (그대로 유지):
//   - JS 하드코딩 CATEGORIES 폐기 → departments 테이블에서 동적 로딩
//   - is_main_progress=1 카테고리만 카드로 표시 (나머지는 "기타" 그룹)
//   - 카드 안 미니 매트릭스 (접수·진행·완료)
//   - 별도 섹션 상세 매트릭스 표 (비율 포함)
(async function() {
  const c = document.getElementById('admin-content');
  let progList = [];
  let deptList = [];   // v40.0: departments 테이블에서 로드
  let categoriesMeta = {};  // v40.0: 동적 카테고리 메타 (icon/color/progress_meta)
  let mainCategories = [];  // v40.0: is_main_progress=1 카테고리 이름 배열
  let currentCategory = '';

  // ── 기본 fallback (API 실패 시 안전망) ──
  const FALLBACK_META = { icon: 'fa-circle', color: '#999', col2: '등급', col3: '구분', col4: '유형',
                          col2Opts: [], col3Opts: [], col4Opts: [],
                          statusOpts: ['평가접수','평가진행','평가완료'] };

  await load();

  async function loadDepartments() {
    const d = await apiCall('/api/admin/departments');
    if (!d) return;
    deptList = (d.data || []).filter(function(x){ return x.is_active !== 0; });
    categoriesMeta = {};
    mainCategories = [];
    deptList.forEach(function(dept) {
      let pm = {};
      if (dept.progress_meta) {
        try { pm = JSON.parse(dept.progress_meta); } catch (e) { pm = {}; }
      }
      categoriesMeta[dept.name] = Object.assign({}, FALLBACK_META, {
        icon: dept.icon || FALLBACK_META.icon,
        color: dept.color || FALLBACK_META.color
      }, pm);
      if (dept.is_main_progress === 1) {
        mainCategories.push(dept.name);
      }
    });
    // mainCategories가 비어있을 경우 (마이그레이션 미적용), 데이터에서 추론
    if (mainCategories.length === 0) {
      mainCategories = ['CC평가', '보안기능시험', '성능평가', '암호모듈검증'];
    }
    // v40.4: 가상 카테고리 '기타시험평가'(S/W 시험현황) 메타 — 성능평가와 동일 라벨(제품유형/운영체제/개발사)
    if (!categoriesMeta['기타시험평가']) {
      categoriesMeta['기타시험평가'] = Object.assign({}, FALLBACK_META, {
        icon: 'fa-flask', color: '#78716C',
        col2: '제품유형', col3: '운영체제', col4: '개발사',
        col2Opts: [], col3Opts: [], col4Opts: [], col4FreeText: true,
        statusOpts: ['시험접수', '시험진행', '발급완료']
      });
    }
  }

  async function load() {
    // v40.0: 두 API를 병렬 로드
    await loadDepartments();
    const d = await apiCall('/api/admin/progress');
    if (!d) return;
    progList = d.data || [];

    // ── 카테고리별 집계 (주요 4개 + 기타) ──
    const counts = {};
    const statusCounts = {};  // { catName: { 접수: n, 진행: n, 완료: n } }
    mainCategories.forEach(function(k) {
      counts[k] = 0;
      statusCounts[k] = { '접수': 0, '진행': 0, '완료': 0 };
    });
    counts['기타'] = 0;
    statusCounts['기타'] = { '접수': 0, '진행': 0, '완료': 0 };

    progList.forEach(function(p) {
      const group = mainCategories.indexOf(p.category) >= 0 ? p.category : '기타';
      counts[group] = (counts[group] || 0) + 1;
      // 상태 정규화 (평가접수/시험접수 → 접수, 평가진행/시험진행 → 진행, 평가완료/발급완료 → 완료)
      const st = (p.status || '').includes('완료') ? '완료'
               : (p.status || '').includes('진행') ? '진행'
               : '접수';
      statusCounts[group][st] = (statusCounts[group][st] || 0) + 1;
    });

    // 필터링
    let filtered;
    if (!currentCategory) {
      filtered = progList;
    } else if (currentCategory === '기타') {
      filtered = progList.filter(function(p) { return mainCategories.indexOf(p.category) < 0; });
    } else {
      filtered = progList.filter(function(p) { return p.category === currentCategory; });
    }
    const meta = currentCategory && currentCategory !== '기타' ? categoriesMeta[currentCategory] : null;

    let h = '';

    // ────────────────────────────────────────────────
    // 1) 상단 카드: 전체 + 4개 주요 + 기타 (6열)
    // ────────────────────────────────────────────────
    h += '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">';
    // 전체 카드
    h += '<button onclick="filterCat(\'\')" class="p-3 rounded-lg border text-left transition-all hover:shadow ' + (!currentCategory ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-300' : 'border-gray-200 hover:border-gray-300') + '">';
    h += '<div class="text-xs text-gray-500 mb-1"><i class="fas fa-layer-group mr-1"></i>전체</div>';
    h += '<div class="text-xl font-bold text-gray-800">' + progList.length + '</div>';
    h += '<div class="text-[10px] text-gray-400 mt-1 truncate">모든 사업분류</div>';
    h += '</button>';

    // 주요 4개 카드
    mainCategories.forEach(function(k) {
      const m = categoriesMeta[k] || FALLBACK_META;
      const cnt = counts[k] || 0;
      const sc = statusCounts[k];
      const active = currentCategory === k;
      h += '<button onclick="filterCat(\'' + escAttr(k) + '\')" class="p-3 rounded-lg border text-left transition-all hover:shadow ' + (active ? 'ring-1' : 'border-gray-200 hover:border-gray-300') + '" style="' + (active ? 'border-color:' + m.color + '; background:' + m.color + '08; --tw-ring-color:' + m.color + '40;' : '') + '">';
      h += '<div class="text-xs text-gray-500 mb-1 truncate"><i class="fas ' + m.icon + ' mr-1" style="color:' + m.color + '"></i>' + esc(k) + '</div>';
      h += '<div class="text-xl font-bold" style="color:' + (cnt > 0 ? m.color : '#ccc') + '">' + cnt + '</div>';
      // v40.0: 카드 안 미니 매트릭스
      h += '<div class="text-[10px] text-gray-400 mt-1 truncate">접수' + sc['접수'] + '·진행' + sc['진행'] + '·완료' + sc['완료'] + '</div>';
      h += '</button>';
    });

    // 기타 카드
    const etcActive = currentCategory === '기타';
    const etcCnt = counts['기타'] || 0;
    const etcSc = statusCounts['기타'];
    h += '<button onclick="filterCat(\'기타\')" class="p-3 rounded-lg border text-left transition-all hover:shadow ' + (etcActive ? 'border-gray-500 bg-gray-50 ring-1 ring-gray-300' : 'border-gray-200 hover:border-gray-300') + '">';
    h += '<div class="text-xs text-gray-500 mb-1 truncate"><i class="fas fa-ellipsis-h mr-1 text-gray-500"></i>기타</div>';
    h += '<div class="text-xl font-bold" style="color:' + (etcCnt > 0 ? '#6B7280' : '#ccc') + '">' + etcCnt + '</div>';
    h += '<div class="text-[10px] text-gray-400 mt-1 truncate">접수' + etcSc['접수'] + '·진행' + etcSc['진행'] + '·완료' + etcSc['완료'] + '</div>';
    h += '</button>';
    h += '</div>';

    // ────────────────────────────────────────────────
    // 2) 상태별 매트릭스 표 (필터 없을 때만 표시)
    // ────────────────────────────────────────────────
    if (!currentCategory) {
      h += '<div class="bg-white border rounded-lg p-4 mb-4">';
      h += '<div class="flex items-center justify-between mb-3">';
      h += '<h3 class="text-sm font-semibold text-gray-700"><i class="fas fa-chart-bar mr-2 text-blue-500"></i>사업분류별 상태 분포 매트릭스</h3>';
      h += '<span class="text-xs text-gray-400">총 ' + progList.length + '건</span>';
      h += '</div>';
      h += '<div class="overflow-x-auto"><table class="w-full text-sm">';
      h += '<thead><tr class="bg-gray-50 border-b">';
      h += '<th class="py-2 px-3 text-left text-xs font-semibold text-gray-500">사업 분류</th>';
      h += '<th class="py-2 px-3 text-center text-xs font-semibold text-gray-500">접수</th>';
      h += '<th class="py-2 px-3 text-center text-xs font-semibold text-gray-500">진행</th>';
      h += '<th class="py-2 px-3 text-center text-xs font-semibold text-gray-500">완료</th>';
      h += '<th class="py-2 px-3 text-center text-xs font-semibold text-gray-500">합계</th>';
      h += '<th class="py-2 px-3 text-center text-xs font-semibold text-gray-500">비율</th>';
      h += '</tr></thead><tbody>';

      const totalAll = progList.length || 1;
      let totRecv = 0, totProg = 0, totDone = 0;
      
      mainCategories.forEach(function(k) {
        const m = categoriesMeta[k] || FALLBACK_META;
        const sc = statusCounts[k];
        const sum = (sc['접수'] || 0) + (sc['진행'] || 0) + (sc['완료'] || 0);
        const pct = Math.round((sum / totalAll) * 1000) / 10;
        totRecv += sc['접수']; totProg += sc['진행']; totDone += sc['완료'];
        h += '<tr class="border-b hover:bg-gray-50/50">';
        h += '<td class="py-2 px-3"><span class="inline-flex items-center gap-1.5 text-sm font-medium" style="color:' + m.color + '"><i class="fas ' + m.icon + '" style="font-size:11px"></i>' + esc(k) + '</span></td>';
        h += '<td class="py-2 px-3 text-center"><span class="' + (sc['접수'] > 0 ? 'text-yellow-600 font-semibold' : 'text-gray-300') + '">' + sc['접수'] + '</span></td>';
        h += '<td class="py-2 px-3 text-center"><span class="' + (sc['진행'] > 0 ? 'text-blue-600 font-semibold' : 'text-gray-300') + '">' + sc['진행'] + '</span></td>';
        h += '<td class="py-2 px-3 text-center"><span class="' + (sc['완료'] > 0 ? 'text-green-600 font-semibold' : 'text-gray-300') + '">' + sc['완료'] + '</span></td>';
        h += '<td class="py-2 px-3 text-center font-semibold">' + sum + '</td>';
        h += '<td class="py-2 px-3 text-center">';
        h += '<div class="flex items-center justify-center gap-2">';
        h += '<div class="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden"><div class="h-full rounded-full" style="width:' + pct + '%; background:' + m.color + '"></div></div>';
        h += '<span class="text-xs text-gray-500 w-10 text-right">' + pct + '%</span>';
        h += '</div>';
        h += '</td>';
        h += '</tr>';
      });
      
      // 기타 행
      const etcSum = (etcSc['접수'] || 0) + (etcSc['진행'] || 0) + (etcSc['완료'] || 0);
      const etcPct = Math.round((etcSum / totalAll) * 1000) / 10;
      totRecv += etcSc['접수']; totProg += etcSc['진행']; totDone += etcSc['완료'];
      h += '<tr class="border-b hover:bg-gray-50/50">';
      h += '<td class="py-2 px-3"><span class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500"><i class="fas fa-ellipsis-h" style="font-size:11px"></i>기타</span></td>';
      h += '<td class="py-2 px-3 text-center"><span class="' + (etcSc['접수'] > 0 ? 'text-yellow-600 font-semibold' : 'text-gray-300') + '">' + etcSc['접수'] + '</span></td>';
      h += '<td class="py-2 px-3 text-center"><span class="' + (etcSc['진행'] > 0 ? 'text-blue-600 font-semibold' : 'text-gray-300') + '">' + etcSc['진행'] + '</span></td>';
      h += '<td class="py-2 px-3 text-center"><span class="' + (etcSc['완료'] > 0 ? 'text-green-600 font-semibold' : 'text-gray-300') + '">' + etcSc['완료'] + '</span></td>';
      h += '<td class="py-2 px-3 text-center font-semibold">' + etcSum + '</td>';
      h += '<td class="py-2 px-3 text-center"><div class="flex items-center justify-center gap-2"><div class="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden"><div class="h-full rounded-full bg-gray-400" style="width:' + etcPct + '%"></div></div><span class="text-xs text-gray-500 w-10 text-right">' + etcPct + '%</span></div></td>';
      h += '</tr>';

      // 합계 행
      h += '<tr class="bg-gray-50 font-semibold">';
      h += '<td class="py-2 px-3 text-sm text-gray-700">합계</td>';
      h += '<td class="py-2 px-3 text-center text-yellow-700">' + totRecv + '</td>';
      h += '<td class="py-2 px-3 text-center text-blue-700">' + totProg + '</td>';
      h += '<td class="py-2 px-3 text-center text-green-700">' + totDone + '</td>';
      h += '<td class="py-2 px-3 text-center">' + progList.length + '</td>';
      h += '<td class="py-2 px-3 text-center text-gray-500 text-xs">100%</td>';
      h += '</tr>';
      h += '</tbody></table></div>';
      h += '<p class="text-[11px] text-gray-400 mt-2"><i class="fas fa-info-circle mr-1"></i>주요 카테고리는 <b>관리자 → 사업분야 관리</b>에서 "평가현황 주요 카테고리" 체크박스로 지정합니다.</p>';
      h += '</div>';
    }

    // ────────────────────────────────────────────────
    // 3) 액션 바
    // ────────────────────────────────────────────────
    h += '<div class="flex flex-wrap justify-between items-center mb-4 gap-2">';
    if (currentCategory && meta) {
      h += '<span class="text-gray-500 text-sm"><span class="font-semibold" style="color:' + meta.color + '"><i class="fas ' + meta.icon + ' mr-1"></i>' + esc(currentCategory) + '</span> · 총 <b>' + filtered.length + '</b>건</span>';
    } else if (currentCategory === '기타') {
      h += '<span class="text-gray-500 text-sm"><span class="font-semibold text-gray-600"><i class="fas fa-ellipsis-h mr-1"></i>기타</span> · 총 <b>' + filtered.length + '</b>건</span>';
    } else {
      h += '<span class="text-gray-500 text-sm">총 <b>' + filtered.length + '</b>건</span>';
    }
    h += '<button onclick="showProgForm()" class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 shadow-sm"><i class="fas fa-plus mr-1"></i>추가</button>';
    h += '</div>';
    h += '<div id="progFormArea" class="hidden mb-4"></div>';

    // ────────────────────────────────────────────────
    // 4) 테이블 (v40.1: 제품명·업체 한 줄 + 1.5배 강조 + 컬럼 폭 30% 축소)
    //   - colgroup으로 폭 명시 → 브라우저 자동 분배 차단
    //   - 제품명·업체 컬럼: ~30% (기존 45~50%에서 축소)
    //   - 등급/구분/유형/상태에 추가 공간 분배
    //   - whitespace-nowrap + overflow-hidden + text-ellipsis로 한 줄 강제
    // ────────────────────────────────────────────────
    const showCatCol = (!currentCategory || currentCategory === '기타');
    h += '<div class="overflow-x-auto border rounded-lg">';
    h += '<table class="w-full text-sm table-fixed">';
    // colgroup으로 컬럼 폭 명시 (table-fixed와 함께 사용 → 강제 적용)
    h += '<colgroup>';
    h += '<col style="width:3.5rem">';                  // No
    if (showCatCol) {
      h += '<col style="width:11%">';                   // 사업분류
    }
    h += '<col style="width:30%">';                     // 제품명·업체 (★ 30%)
    h += '<col style="width:13%">';                     // 등급
    h += '<col style="width:12%" class="hidden md:table-column">'; // 구분
    h += '<col style="width:12%" class="hidden lg:table-column">'; // 유형
    h += '<col style="width:11%">';                     // 상태
    h += '<col style="width:7rem">';                    // 작업
    h += '</colgroup>';

    h += '<thead><tr class="bg-gray-50 border-b">';
    h += '<th class="py-2.5 px-3 text-left text-xs font-semibold text-gray-500">No</th>';
    if (showCatCol) {
      h += '<th class="py-2.5 px-3 text-left text-xs font-semibold text-gray-500">사업분류</th>';
    }
    h += '<th class="py-2.5 px-3 text-left text-xs font-semibold text-gray-500">제품명 · 업체</th>';
    h += '<th class="py-2.5 px-3 text-center text-xs font-semibold text-gray-500">' + (meta ? esc(meta.col2 || '등급') : '등급') + '</th>';
    h += '<th class="py-2.5 px-3 text-center text-xs font-semibold text-gray-500 hidden md:table-cell">' + (meta ? esc(meta.col3 || '구분') : '구분') + '</th>';
    h += '<th class="py-2.5 px-3 text-center text-xs font-semibold text-gray-500 hidden lg:table-cell">' + (meta ? esc(meta.col4 || '유형') : '유형') + '</th>';
    h += '<th class="py-2.5 px-3 text-center text-xs font-semibold text-gray-500">상태</th>';
    h += '<th class="py-2.5 px-3 text-center text-xs font-semibold text-gray-500">작업</th>';
    h += '</tr></thead><tbody>';

    filtered.forEach(function(p, i) {
      const isComplete = (p.status || '').includes('완료');
      const isProgress = (p.status || '').includes('진행');
      const statusCls = isComplete ? 'bg-green-50 text-green-600 border-green-200' : isProgress ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200';
      const cm = categoriesMeta[p.category] || FALLBACK_META;
      h += '<tr class="border-t hover:bg-gray-50/50">';
      h += '<td class="py-2 px-3 text-gray-400 text-xs align-middle">' + (i + 1) + '</td>';
      if (showCatCol) {
        h += '<td class="py-2 px-3 align-middle overflow-hidden"><span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap" style="background:' + cm.color + '10; color:' + cm.color + '"><i class="fas ' + cm.icon + '" style="font-size:9px"></i>' + esc(p.category) + '</span></td>';
      }
      // ★ v40.1: 제품명 · 업체 한 줄, text-lg (1.5배), 강조 + 한줄 강제 + 잘림 표시
      h += '<td class="py-2 px-3 align-middle">';
      h += '<div class="text-lg font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis" title="' + esc(p.product_name) + (p.company ? ' · ' + esc(p.company) : '') + '">';
      h += esc(p.product_name);
      if (p.company) {
        h += '<span class="text-gray-500 font-normal"> · ' + esc(p.company) + '</span>';
      }
      h += '</div>';
      h += '</td>';
      h += '<td class="py-2 px-3 text-center align-middle"><span class="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">' + esc(p.assurance_level || '-') + '</span></td>';
      h += '<td class="py-2 px-3 text-center text-xs text-gray-600 hidden md:table-cell align-middle overflow-hidden text-ellipsis whitespace-nowrap">' + esc(p.cert_type || '-') + '</td>';
      h += '<td class="py-2 px-3 text-center text-xs text-gray-600 hidden lg:table-cell align-middle overflow-hidden text-ellipsis whitespace-nowrap">' + esc(p.eval_type || '-') + '</td>';
      h += '<td class="py-2 px-3 text-center align-middle"><span class="px-2 py-0.5 rounded text-xs border whitespace-nowrap ' + statusCls + '">' + esc(p.status) + '</span></td>';
      h += '<td class="py-2 px-3 text-center whitespace-nowrap align-middle">';
      h += '<button onclick="editProg(' + p.id + ')" class="text-blue-500 text-xs hover:underline mr-2"><i class="fas fa-edit"></i> 수정</button>';
      h += '<button onclick="deleteProg(' + p.id + ')" class="text-red-500 text-xs hover:underline"><i class="fas fa-trash"></i></button>';
      h += '</td></tr>';
    });

    if (filtered.length === 0) {
      const colspan = (!currentCategory || currentCategory === '기타') ? 8 : 7;
      h += '<tr><td colspan="' + colspan + '" class="py-8 text-center text-gray-400"><i class="fas fa-inbox text-gray-300 text-2xl block mb-2"></i>등록된 현황이 없습니다.<br><span class="text-xs">위의 [추가] 버튼으로 새 항목을 등록할 수 있습니다.</span></td></tr>';
    }
    h += '</tbody></table></div>';
    c.innerHTML = h;
  }

  // ── 공용 helper ──
  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, '&quot;');
  }
  function escAttr(s) {
    return esc(s).replace(/'/g, '&#39;');
  }

  function optionsHtml(opts, selected) {
    return (opts || []).map(function(v) {
      return '<option' + (selected === v ? ' selected' : '') + '>' + esc(v) + '</option>';
    }).join('');
  }

  function progFormHtml(prog) {
    const isEdit = !!prog;
    // v40.0: deptList 기반 카테고리 선택 (활성 사업분야 전체)
    // v40.4: 가상 카테고리 '기타시험평가'(S/W 시험현황) 추가 — 부서가 아니므로 별도로 노출
    const availableCats = deptList.map(function(d){ return d.name; });
    if (availableCats.indexOf('기타시험평가') < 0) { availableCats.push('기타시험평가'); }
    const selCat = (prog && prog.category) || (currentCategory && currentCategory !== '기타' ? currentCategory : (availableCats[0] || 'CC평가'));
    const meta = categoriesMeta[selCat] || FALLBACK_META;

    let h = '<div class="border rounded-xl p-5 bg-gradient-to-b from-gray-50 to-white shadow-sm">';
    h += '<h4 class="font-semibold mb-4 flex items-center gap-2"><i class="fas fa-' + (isEdit ? 'edit text-blue-500' : 'plus text-green-500') + '"></i>' + (isEdit ? '평가현황 수정' : '평가현황 추가') + '</h4>';
    h += '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">';

    // 카테고리 선택
    h += '<div><label class="block text-xs font-semibold text-gray-600 mb-1">사업 분류 *</label>';
    h += '<select id="prCat" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400" onchange="onCatChange()">';
    availableCats.forEach(function(k) {
      h += '<option value="' + esc(k) + '"' + (selCat === k ? ' selected' : '') + '>' + esc(k) + '</option>';
    });
    h += '</select></div>';

    // 제품명
    h += '<div class="col-span-2 md:col-span-1"><label class="block text-xs font-semibold text-gray-600 mb-1">제품명 *</label>';
    h += '<input id="prName" value="' + esc(prog && prog.product_name) + '" placeholder="제품/서비스명" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"></div>';

    // 업체
    h += '<div><label class="block text-xs font-semibold text-gray-600 mb-1">업체/개발사</label>';
    h += '<input id="prComp" value="' + esc(prog && prog.company) + '" placeholder="업체명 (선택)" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"></div>';

    // 동적 필드
    h += '<div id="dynFields">' + dynFieldsHtml(selCat, prog) + '</div>';

    // 진행상태
    h += '<div><label class="block text-xs font-semibold text-gray-600 mb-1">진행상태</label>';
    h += '<select id="prStatus" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400">';
    const statusOpts = (meta.statusOpts && meta.statusOpts.length) ? meta.statusOpts : ['평가접수','평가진행','평가완료'];
    statusOpts.forEach(function(s) {
      h += '<option' + (prog && prog.status === s ? ' selected' : '') + '>' + esc(s) + '</option>';
    });
    h += '</select></div>';

    // 날짜
    h += '<div><label class="block text-xs font-semibold text-gray-600 mb-1">시작일/발급일</label>';
    h += '<input id="prDate" type="date" value="' + (prog ? (prog.start_date || '') : '') + '" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"></div>';
    h += '<div><label class="block text-xs font-semibold text-gray-600 mb-1">종료일</label>';
    h += '<input id="prEndDate" type="date" value="' + (prog ? (prog.end_date || '') : '') + '" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"></div>';

    h += '</div>';

    h += '<textarea id="prNote" rows="2" placeholder="비고 / 메모" class="w-full px-3 py-2 border rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-400">' + esc(prog ? (prog.note || '') : '') + '</textarea>';

    h += '<div class="flex gap-2">';
    h += '<button onclick="saveProg(' + (prog ? prog.id : 'null') + ')" class="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600 shadow-sm"><i class="fas fa-save mr-1"></i>저장</button>';
    h += '<button onclick="document.getElementById(\'progFormArea\').classList.add(\'hidden\')" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">취소</button>';
    h += '</div></div>';
    return h;
  }

  function dynFieldsHtml(cat, prog) {
    const meta = categoriesMeta[cat] || FALLBACK_META;
    let h = '';
    // Col2
    h += '<label class="block text-xs font-semibold text-gray-600 mb-1">' + esc(meta.col2 || '등급') + '</label>';
    if (meta.col2Opts && meta.col2Opts.length > 0) {
      h += '<select id="prLevel" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 mb-3">';
      h += optionsHtml(meta.col2Opts, prog && prog.assurance_level);
      h += '</select>';
    } else {
      h += '<input id="prLevel" value="' + esc(prog && prog.assurance_level) + '" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 mb-3">';
    }
    // Col3
    h += '<label class="block text-xs font-semibold text-gray-600 mb-1">' + esc(meta.col3 || '구분') + '</label>';
    if (meta.col3Opts && meta.col3Opts.length > 0) {
      h += '<select id="prCert" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 mb-3">';
      h += optionsHtml(meta.col3Opts, prog && prog.cert_type);
      h += '</select>';
    } else {
      h += '<input id="prCert" value="' + esc(prog && prog.cert_type) + '" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 mb-3">';
    }
    // Col4
    if (meta.col4 && meta.col4 !== '-') {
      h += '<label class="block text-xs font-semibold text-gray-600 mb-1">' + esc(meta.col4) + '</label>';
      if (meta.col4FreeText) {
        h += '<input id="prEval" value="' + esc(prog && prog.eval_type) + '" placeholder="직접 입력" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400">';
      } else if (meta.col4Opts && meta.col4Opts.length > 0) {
        h += '<select id="prEval" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400">';
        h += optionsHtml(meta.col4Opts, prog && prog.eval_type);
        h += '</select>';
      } else {
        h += '<input id="prEval" value="' + esc(prog && prog.eval_type) + '" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400">';
      }
    } else {
      h += '<input type="hidden" id="prEval" value="-">';
    }
    return h;
  }

  // ── 글로벌 함수 ──
  window.filterCat = function(cat) {
    currentCategory = cat;
    load();
  };

  window.onCatChange = function() {
    const cat = document.getElementById('prCat').value;
    const dynEl = document.getElementById('dynFields');
    if (dynEl) dynEl.innerHTML = dynFieldsHtml(cat, null);
    const meta = categoriesMeta[cat];
    if (meta && meta.statusOpts && meta.statusOpts.length) {
      const statusEl = document.getElementById('prStatus');
      if (statusEl) {
        statusEl.innerHTML = meta.statusOpts.map(function(s) {
          return '<option>' + esc(s) + '</option>';
        }).join('');
      }
    }
  };

  window.showProgForm = function() {
    const a = document.getElementById('progFormArea');
    a.classList.remove('hidden');
    a.innerHTML = progFormHtml(null);
    a.scrollIntoView({ behavior: 'smooth' });
  };

  window.editProg = function(id) {
    const prog = progList.find(function(p) { return p.id === id; });
    if (!prog) return;
    const a = document.getElementById('progFormArea');
    a.classList.remove('hidden');
    a.innerHTML = progFormHtml(prog);
    a.scrollIntoView({ behavior: 'smooth' });
  };

  window.saveProg = async function(id) {
    const name = document.getElementById('prName').value.trim();
    if (!name) { alert('제품명을 입력해주세요.'); return; }
    const body = {
      category: document.getElementById('prCat').value,
      product_name: name,
      company: document.getElementById('prComp').value,
      status: document.getElementById('prStatus').value,
      assurance_level: document.getElementById('prLevel').value,
      cert_type: document.getElementById('prCert').value,
      eval_type: document.getElementById('prEval') ? document.getElementById('prEval').value : '',
      start_date: document.getElementById('prDate').value || null,
      end_date: document.getElementById('prEndDate').value || null,
      note: document.getElementById('prNote').value
    };
    let res;
    if (id) res = await apiCall('/api/admin/progress/' + id, 'PUT', body);
    else res = await apiCall('/api/admin/progress', 'POST', body);
    if (res && res.success) {
      document.getElementById('progFormArea').classList.add('hidden');
      await load();
    } else {
      alert('저장에 실패했습니다.');
    }
  };

  window.deleteProg = async function(id) {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return;
    await apiCall('/api/admin/progress/' + id, 'DELETE');
    await load();
  };
})();

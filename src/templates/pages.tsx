// KOIST - Service & Content Page Templates (v7.0 - Ultra Premium 4K/8K HiDPI)
import type { SettingsMap, Department, DepPage, Notice, FAQ, ProgressItem } from '../types';
import { sanitizeHtml, escapeHtml, escapeAttr, safeUrl, safeColor, safeFaIcon } from '../utils/sanitize';
import { getGradeDisplay, isAliased } from '../utils/aliases';

/* ══════════════════════════════════════════════════════════
   SHARED: Premium Page Header Component
   ══════════════════════════════════════════════════════════ */
function pageHeader(opts: {
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  breadcrumbs?: { label: string; href?: string }[];
  settings: SettingsMap;
  bgUrl?: string;
  contactInfo?: { dept?: string; name?: string; phone?: string };
}) {
  const s = opts.settings;
  const bg = opts.bgUrl || s.page_header_bg_url || '';
  // v40.3: 헤더 높이 배율 (관리자 가변, 기본 0.3 = 30%) + 연청 그라데이션(설정값/CSS변수 사용)
  const hScale = (() => {
    const v = parseFloat(String(s.page_header_height_scale ?? '1'));
    return isNaN(v) || v <= 0 ? 1 : Math.min(v, 1);
  })();
  const padTop = (2.5 * hScale).toFixed(2);
  const padVw = (4 * hScale).toFixed(2);
  const padMax = (4.5 * hScale).toFixed(2);
  return `
  <section class="page-header relative overflow-hidden" style="padding: clamp(${padTop}rem,${padVw}vw,${padMax}rem) 0; ${bg ? `background-image: linear-gradient(135deg, rgba(30,58,138,0.86), rgba(37,99,235,0.90)), url('${bg}'); background-size:cover; background-position:center;` : 'background: linear-gradient(135deg, var(--page-header-c1) 0%, var(--page-header-c2) 50%, var(--page-header-c3) 100%);'}">
    <!-- Decorative particles -->
    <div class="absolute top-4 right-[10%] w-32 h-32 rounded-full blur-3xl pointer-events-none" style="background: radial-gradient(circle, rgba(59,130,246,0.06), transparent);"></div>
    <div class="absolute bottom-2 left-[15%] w-24 h-24 rounded-full blur-3xl pointer-events-none" style="background: radial-gradient(circle, rgba(6,182,212,0.05), transparent);"></div>
    <!-- Dot pattern overlay -->
    <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 24px 24px;"></div>

    <div class="relative fluid-container">
      ${opts.breadcrumbs ? `
      <nav class="flex items-center flex-wrap text-slate-400 f-text-xs" style="gap:6px; margin-bottom:var(--space-sm)">
        ${opts.breadcrumbs.map((b, i) => `
          ${i > 0 ? '<i class="fas fa-chevron-right text-[7px] text-slate-600/60"></i>' : ''}
          ${b.href ? `<a href="${escapeAttr(b.href)}" class="hover:text-white/90 transition-colors">${b.label}</a>` : `<span class="text-white/90 font-medium">${b.label}</span>`}
        `).join('')}
      </nav>` : ''}
      <div class="flex items-center justify-between flex-wrap" style="gap:var(--space-sm)">
        <div class="flex items-center" style="gap:var(--space-sm)">
          <div class="rounded-lg flex items-center justify-center shrink-0" style="width:clamp(38px,3.2vw,46px); height:clamp(38px,3.2vw,46px); background: linear-gradient(135deg, ${opts.iconColor}20, ${opts.iconColor}10); border: 1px solid ${opts.iconColor}15;">
            <i class="fas ${opts.icon}" style="color:${opts.iconColor}; font-size:var(--text-lg)"></i>
          </div>
          <div>
            <h1 class="text-white font-bold f-text-xl tracking-tight">${opts.title}</h1>
            ${opts.subtitle ? `<p class="text-slate-400/80 f-text-xs" style="margin-top:3px">${opts.subtitle}</p>` : ''}
          </div>
        </div>
        ${opts.contactInfo && (opts.contactInfo.dept || opts.contactInfo.name || opts.contactInfo.phone) ? `
        <div class="hidden sm:flex items-center shrink-0 rounded-xl" style="gap:clamp(14px,1.8vw,24px); padding:clamp(12px,1.2vw,20px) clamp(20px,2.4vw,36px); background:rgba(255,255,255,0.07); backdrop-filter:blur(12px); border:1.5px solid rgba(255,255,255,0.12); box-shadow:0 4px 24px rgba(0,0,0,0.15); -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;">
          <div class="rounded-lg flex items-center justify-center shrink-0" style="width:clamp(48px,5vw,60px);height:clamp(48px,5vw,60px);background:linear-gradient(135deg,rgba(59,130,246,0.25),rgba(6,182,212,0.20));">
            <i class="fas fa-headset text-blue-400" style="font-size:clamp(22px,2.4vw,28px)"></i>
          </div>
          <div style="line-height:1.5">
            <div class="text-slate-200 font-bold" style="white-space:nowrap; font-size:clamp(0.85rem,0.9vw,1.05rem); letter-spacing:0.02em;">
              ${opts.contactInfo.dept ? `<span>${opts.contactInfo.dept}</span>` : ''}${opts.contactInfo.dept && opts.contactInfo.name ? '<span class="text-slate-500 mx-2">|</span>' : ''}${opts.contactInfo.name ? `<span>${opts.contactInfo.name}</span>` : ''}
            </div>
            ${opts.contactInfo.phone ? `<a href="tel:${opts.contactInfo.phone}" class="text-blue-400 font-extrabold hover:text-blue-300 transition-colors" style="white-space:nowrap; font-size:clamp(1.05rem,1.2vw,1.35rem); letter-spacing:0.03em;"><i class="fas fa-phone" style="font-size:clamp(13px,1.1vw,16px);margin-right:6px"></i>${opts.contactInfo.phone}</a>` : ''}
          </div>
        </div>` : ''}
      </div>
    </div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════
   SHARED: Premium Status Badge
   ══════════════════════════════════════════════════════════ */
function statusBadge(status: string) {
  // 원본 koist.kr 사이트 상태값 반영: 평가완료/발급완료(완료), 평가진행/시험진행(진행), 평가접수/시험접수(접수)
  const isComplete = status === '평가완료' || status === '발급완료';
  const isProgress = status === '평가진행' || status === '시험진행';
  const cls = isComplete ? 'badge-complete' : isProgress ? 'badge-progress' : 'badge-received';
  return `<span class="badge-status ${cls}"><span class="badge-dot"></span>${status}</span>`;
}


/* ────────────── Service Detail Page ────────────── */
// v40.4: 동적 현황 페이지(progress/etc-test)는 서버가 생성한 신뢰된 HTML(검색폼·표 포함)이므로
//        sanitizeHtml을 건너뛴다. 그 외 관리자 입력 콘텐츠는 항상 sanitize.
const DYNAMIC_PAGE_SLUGS = new Set(['progress', 'etc-test']);
function renderPageContent(currentPage: DepPage | null, pages: DepPage[]): string {
  const target = currentPage || (pages.length > 0 ? pages[0] : null);
  if (!target) return '<p style="text-align:center;color:#aaa">콘텐츠가 준비 중입니다.</p>';
  if (DYNAMIC_PAGE_SLUGS.has(target.slug)) {
    return target.content; // 신뢰된 동적 콘텐츠 (검색 폼/입력/표 유지)
  }
  return sanitizeHtml(target.content);
}

export function servicePage(dept: Department, pages: DepPage[], currentPage: DepPage | null, settings: SettingsMap) {
  const s = settings;
  const headerBg = (currentPage as any)?.header_bg_url || dept.header_bg_url || s.page_header_bg_url || '';

  return `
  ${pageHeader({
    title: escapeHtml(currentPage ? currentPage.title : dept.name),
    subtitle: escapeHtml(dept.description || ''),
    icon: safeFaIcon(dept.icon) || 'fa-folder',
    iconColor: safeColor(dept.color) || '#3B82F6',
    breadcrumbs: [
      { label: '홈', href: '/' },
      { label: escapeHtml(dept.name), href: '/services/' + encodeURIComponent(dept.slug) },
      ...(currentPage ? [{ label: escapeHtml(currentPage.title) }] : [])
    ],
    settings: s,
    bgUrl: headerBg,
    contactInfo: {
      dept: escapeHtml((dept as any).contact_dept || ''),
      name: escapeHtml((dept as any).contact_name || ''),
      phone: escapeHtml((dept as any).contact_phone || ''),
    },
  })}

  <!-- Content -->
  <section style="padding:var(--space-xl) 0; background: var(--grad-surface);">
    <div class="fluid-container">
      <div class="flex flex-col lg:flex-row" style="gap:clamp(1rem, 2vw, 1.5rem)">

        <!-- Sidebar -->
        ${pages.length > 1 ? `
        <aside class="shrink-0" style="width:clamp(180px, 15vw, 224px)">
          <div class="bg-white rounded-xl border border-slate-200/60 overflow-hidden sticky" style="top:calc(var(--gnb-h) + var(--space-sm)); box-shadow: var(--shadow-sm);">
            <div class="font-semibold text-white f-text-sm" style="padding:var(--space-sm) var(--space-md); background: linear-gradient(135deg, #0F172A, #1E293B);">${escapeHtml(dept.name)}</div>
            <nav style="padding:var(--space-xs)">
              ${pages.filter(p => p.is_active).map(p => `
              <a href="/services/${encodeURIComponent(dept.slug)}/${encodeURIComponent(p.slug)}" 
                 class="block rounded-lg transition-all f-text-sm ${currentPage?.id === p.id ? 'font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
                 style="padding:var(--space-sm) var(--space-md); ${currentPage?.id === p.id ? `background: rgba(59,130,246,0.06); color: #2563EB; border-left: 3px solid #2563EB; padding-left: calc(var(--space-md) - 3px);` : ''}">
                ${escapeHtml(p.title)}
              </a>
              `).join('')}
            </nav>
          </div>
        </aside>
        ` : ''}

        <!-- Main -->
        <div class="flex-1 min-w-0">
          <div class="bg-white rounded-xl border border-slate-200/60" style="padding:clamp(1.25rem, 2.5vw, 2.25rem); box-shadow: var(--shadow-sm);">
            ${((dept as any).use_legacy_theme === undefined || (dept as any).use_legacy_theme === 1) ? `
            <!-- v39.7: KOIST 원본 디자인 (koist.kr) 적용 -->
            <div class="koist-legacy-theme">
              <div class="tit_cm">
                <span>${escapeHtml((dept as any).english_subtitle || (dept.slug || 'SERVICE').toUpperCase().replace(/-/g, ' '))}</span>
                <p>${escapeHtml(currentPage?.title || (pages[0]?.title) || dept.name)}</p>
              </div>
              <div class="pagecommon-content">
                ${renderPageContent(currentPage, pages)}
              </div>
            </div>
            ` : `
            <!-- Legacy prose theme (use_legacy_theme=0) -->
            <div class="prose prose-slate max-w-none prose-headings:text-primary prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-accent" style="font-size:var(--text-sm)">
              ${renderPageContent(currentPage, pages)}
            </div>
            `}
          </div>

          <!-- CTA -->
          <div class="rounded-xl relative overflow-hidden" style="margin-top:var(--space-md); padding:var(--space-md); background: linear-gradient(135deg, #0F172A, #1A2E4A);">
            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 20px 20px;"></div>
            <div class="relative flex flex-col sm:flex-row items-center justify-between" style="gap:var(--space-md)">
              <div>
                <h3 class="font-bold text-white f-text-sm">${escapeHtml(dept.name)}에 대해 궁금하신 점이 있으신가요?</h3>
                <p class="text-slate-400/80 f-text-xs" style="margin-top:3px">${(dept as any).contact_dept || (dept as any).contact_name ? `${(dept as any).contact_dept ? `담당부서: ${escapeHtml((dept as any).contact_dept)}` : ''}${(dept as any).contact_dept && (dept as any).contact_name ? ' | ' : ''}${(dept as any).contact_name ? `담당자: ${escapeHtml((dept as any).contact_name)}` : ''}` : '전문 상담원이 친절하게 안내해 드립니다.'}</p>
              </div>
              <div class="flex shrink-0" style="gap:var(--space-sm)">
                <a href="tel:${(dept as any).contact_phone || s.phone || '02-586-1230'}" class="btn-primary f-text-xs ripple-btn" style="padding:var(--space-sm) var(--space-md)">
                  <i class="fas fa-phone" style="font-size:10px"></i> ${(dept as any).contact_phone || s.phone || '02-586-1230'}
                </a>
                <a href="/support/inquiry" class="btn-ghost f-text-xs" style="padding:var(--space-sm) var(--space-md)">
                  <i class="fas fa-envelope" style="font-size:10px"></i> 상담문의
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}


/* ────────────── Notice List (Premium Table) ────────────── */
export function noticeListPage(notices: Notice[], page: number, total: number, perPage: number, settings: SettingsMap = {}) {
  const s = settings;
  const totalPages = Math.ceil(total / perPage);
  return `
  ${pageHeader({
    title: '공지사항',
    icon: 'fa-bullhorn',
    iconColor: '#60A5FA',
    settings: s,
  })}

  <section style="padding:var(--space-xl) 0; background: var(--grad-surface);">
    <div class="fluid-container" style="max-width:min(1100px, 100% - var(--container-pad) * 2)">
      <div class="bg-white rounded-xl border border-slate-200/60 overflow-hidden" style="box-shadow: var(--shadow-sm);">
        <table class="w-full table-compact">
          <thead>
            <tr style="background: linear-gradient(135deg, #0F172A, #1E293B);">
              <th class="text-left text-slate-300 f-text-xs" style="padding:var(--space-sm) var(--space-md); width:50px">번호</th>
              <th class="text-left text-slate-300 f-text-xs" style="padding:var(--space-sm) var(--space-md)">제목</th>
              <th class="text-center text-slate-300 f-text-xs hidden sm:table-cell" style="padding:var(--space-sm) var(--space-md); width:70px">조회수</th>
              <th class="text-center text-slate-300 f-text-xs" style="padding:var(--space-sm) var(--space-md); width:90px">작성일</th>
            </tr>
          </thead>
          <tbody>
            ${notices.map((n, i) => `
            <tr class="border-t border-slate-100/70 hover:bg-blue-50/30 transition-colors">
              <td class="text-slate-400 f-text-xs" style="padding:var(--space-sm) var(--space-md)">${n.is_pinned ? '<span class="inline-flex items-center justify-center bg-red-500 text-white rounded font-bold" style="width:18px;height:18px;font-size:9px">N</span>' : (total - (page - 1) * perPage - i)}</td>
              <td style="padding:var(--space-sm) var(--space-md)"><a href="/support/notice/${parseInt(String(n.id), 10) || 0}" class="text-slate-800 hover:text-accent transition-colors font-medium f-text-sm">${escapeHtml(n.title)}</a></td>
              <td class="text-center text-slate-400 hidden sm:table-cell f-text-xs" style="padding:var(--space-sm) var(--space-md)">${escapeHtml(String(n.views ?? 0))}</td>
              <td class="text-center text-slate-400 f-text-xs" style="padding:var(--space-sm) var(--space-md)">${escapeHtml((n.created_at || '').split('T')[0] || '')}</td>
            </tr>
            `).join('')}
            ${notices.length === 0 ? '<tr><td colspan="4" class="text-center text-slate-400 f-text-sm" style="padding:var(--space-2xl) 0"><i class="fas fa-inbox text-slate-300 block" style="font-size:1.5rem;margin-bottom:var(--space-sm)"></i>등록된 공지사항이 없습니다.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
      ${totalPages > 1 ? `
      <div class="flex justify-center" style="gap:var(--space-xs); margin-top:var(--space-lg)">
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
        <a href="/support/notice?page=${p}" class="flex items-center justify-center rounded-lg font-medium f-text-xs transition-all ${p === page ? 'text-white' : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50 hover:border-slate-300'}" style="width:clamp(30px,2.5vw,34px); height:clamp(30px,2.5vw,34px); ${p === page ? 'background: linear-gradient(135deg, #2563EB, #3B82F6); box-shadow: 0 2px 8px rgba(37,99,235,0.25);' : ''}">${p}</a>
        `).join('')}
      </div>` : ''}
    </div>
  </section>`;
}


/* ────────────── Notice Detail ────────────── */
export function noticeDetailPage(notice: Notice, settings: SettingsMap = {}) {
  const s = settings;
  return `
  ${pageHeader({
    title: escapeHtml(notice.title),
    subtitle: escapeHtml((notice.created_at?.split('T')[0] || '') + ' · 조회수 ' + (notice.views ?? 0)),
    icon: 'fa-bullhorn',
    iconColor: '#60A5FA',
    breadcrumbs: [
      { label: '홈', href: '/' },
      { label: '공지사항', href: '/support/notice' },
      { label: '상세' }
    ],
    settings: s,
  })}

  <section style="padding:var(--space-xl) 0; background: var(--grad-surface);">
    <div class="fluid-container" style="max-width:min(900px, 100% - var(--container-pad) * 2)">
      <div class="bg-white rounded-xl border border-slate-200/60" style="padding:clamp(1.25rem, 2.5vw, 2.25rem); box-shadow: var(--shadow-sm);">
        <div class="prose prose-slate max-w-none prose-headings:text-primary" style="font-size:var(--text-sm)">${sanitizeHtml(notice.content)}</div>
      </div>
      <div class="text-center" style="margin-top:var(--space-md)">
        <a href="/support/notice" class="btn-primary f-text-sm ripple-btn" style="padding:var(--space-sm) var(--space-lg)"><i class="fas fa-list f-text-xs"></i> 목록</a>
      </div>
    </div>
  </section>`;
}


/* ────────────── FAQ (Accordion) ────────────── */
export function faqPage(faqs: FAQ[], settings: SettingsMap = {}) {
  const s = settings;
  return `
  ${pageHeader({
    title: '자주 묻는 질문',
    icon: 'fa-circle-question',
    iconColor: '#22D3EE',
    settings: s,
  })}

  <section style="padding:var(--space-xl) 0; background: var(--grad-surface);">
    <div class="fluid-container" style="max-width:min(900px, 100% - var(--container-pad) * 2); display:flex; flex-direction:column; gap:var(--space-sm)">
      ${faqs.map((f, i) => `
      <div class="bg-white rounded-xl border border-slate-200/60 overflow-hidden transition-all hover:border-slate-300/70" style="box-shadow: var(--shadow-xs);">
        <button onclick="toggleFaq(${i})" class="w-full flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors" style="padding:clamp(0.85rem, 1.5vw, 1.3rem)">
          <span class="font-medium text-slate-800 flex items-center f-text-sm" style="gap:var(--space-sm)">
            <span class="rounded-full flex items-center justify-center shrink-0 font-bold f-text-xs" style="width:clamp(22px,2vw,26px); height:clamp(22px,2vw,26px); background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(6,182,212,0.08)); color: #2563EB;">Q</span>
            ${escapeHtml(f.question)}
          </span>
          <i class="fas fa-chevron-down text-slate-400 transition-transform duration-300 ml-3 shrink-0 f-text-xs" id="faq-icon-${i}"></i>
        </button>
        <div id="faq-body-${i}" class="hidden" style="padding:0 clamp(0.85rem, 1.5vw, 1.3rem) clamp(0.85rem, 1.5vw, 1.3rem)">
          <div class="text-slate-600 leading-relaxed f-text-sm" style="padding-left:calc(clamp(22px,2vw,26px) + var(--space-sm)); border-left: 2px solid rgba(59,130,246,0.12); padding-top: 2px; padding-bottom: 2px; margin-left: 0;">${sanitizeHtml(f.answer)}</div>
        </div>
      </div>
      `).join('')}
      ${faqs.length === 0 ? '<p class="text-center text-slate-400 f-text-sm" style="padding:var(--space-2xl) 0"><i class="fas fa-comment-slash text-slate-300 block" style="font-size:1.5rem;margin-bottom:var(--space-sm)"></i>등록된 FAQ가 없습니다.</p>' : ''}
    </div>
  </section>
  <script>
    function toggleFaq(i) {
      var body = document.getElementById('faq-body-' + i);
      var icon = document.getElementById('faq-icon-' + i);
      body.classList.toggle('hidden');
      icon.style.transform = body.classList.contains('hidden') ? '' : 'rotate(180deg)';
    }
  </script>`;
}


/* ────────────── Inquiry Form (Premium) ────────────── */
export function inquiryPage(settings: SettingsMap) {
  const s = settings || {};
  // v40.3: 섹션 위아래 패딩 배율(기본 0.7=30%축소) + 폼 최대폭(기본 1200px) — 관리자 가변
  const padScale = (() => {
    const v = parseFloat(String(s.inquiry_section_pad_scale ?? '1'));
    return isNaN(v) || v <= 0 ? 1 : v;
  })();
  const secPadMin = (2 * padScale).toFixed(2);
  const secPadVw = (1.5 * padScale).toFixed(2);
  const secPadMax = (3.5 * padScale).toFixed(2);
  const maxW = (() => {
    const v = parseInt(String(s.inquiry_max_width ?? '1200'), 10);
    return isNaN(v) || v < 320 ? 1200 : v;
  })();
  return `
  ${pageHeader({
    title: '온라인 상담문의',
    icon: 'fa-envelope',
    iconColor: '#F59E0B',
    settings: s,
  })}

  <section style="padding:clamp(${secPadMin}rem, ${secPadVw}vw, ${secPadMax}rem) 0; background: var(--grad-surface);">
    <div class="fluid-container" style="max-width:min(${maxW}px, 100% - var(--container-pad) * 2)">
      <!-- Info banner -->
      <div class="rounded-xl flex items-center" style="padding:var(--space-md); margin-bottom:var(--space-md); gap:var(--space-sm); background: linear-gradient(135deg, rgba(59,130,246,0.04), rgba(6,182,212,0.03)); border: 1px solid rgba(59,130,246,0.10);">
        <div class="shrink-0 rounded-lg flex items-center justify-center" style="width:36px; height:36px; background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(6,182,212,0.08));">
          <i class="fas fa-info-circle text-accent f-text-sm"></i>
        </div>
        <p class="text-slate-600 f-text-sm">빠른 상담은 <strong class="text-accent">${escapeHtml(s.phone || '02-586-1230')}</strong>으로 연락주시면 더욱 빠르게 안내받으실 수 있습니다.</p>
      </div>

      <form id="inquiryForm" class="bg-white rounded-xl border border-slate-200/60" style="padding:clamp(1.75rem, 3vw, 3rem); box-shadow: var(--shadow-sm);">
        <!-- v40.3: 폼 카드 상단 제목 통합 (페이지 헤더 배너 축소 대체) -->
        <div class="flex items-center" style="gap:var(--space-md); margin-bottom:var(--space-lg); padding-bottom:var(--space-md); border-bottom:1px solid rgba(226,232,240,0.7);">
          <div class="shrink-0 rounded-xl flex items-center justify-center" style="width:clamp(44px,3.6vw,56px); height:clamp(44px,3.6vw,56px); background: linear-gradient(135deg, var(--theme-primary), var(--theme-cyan));">
            <i class="fas fa-envelope text-white" style="font-size:clamp(18px,1.6vw,24px)"></i>
          </div>
          <div>
            <h2 class="font-bold text-slate-800 f-text-xl tracking-tight">온라인 상담문의</h2>
            <p class="text-slate-500 f-text-sm" style="margin-top:2px">궁금하신 점을 남겨주시면 신속하게 답변드리겠습니다.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2" style="gap:var(--space-lg); margin-bottom:var(--space-lg)">
          <div>
            <label class="block font-semibold text-slate-700 f-text-sm" style="margin-bottom:var(--space-sm)">이름 <span class="text-red-500">*</span></label>
            <input type="text" name="name" required class="input-premium">
          </div>
          <div>
            <label class="block font-semibold text-slate-700 f-text-sm" style="margin-bottom:var(--space-sm)">회사명</label>
            <input type="text" name="company" class="input-premium">
          </div>
          <div>
            <label class="block font-semibold text-slate-700 f-text-sm" style="margin-bottom:var(--space-sm)">이메일</label>
            <input type="email" name="email" class="input-premium">
          </div>
          <div>
            <label class="block font-semibold text-slate-700 f-text-sm" style="margin-bottom:var(--space-sm)">연락처</label>
            <input type="tel" name="phone" class="input-premium">
          </div>
        </div>
        <div style="margin-bottom:var(--space-lg)">
          <label class="block font-semibold text-slate-700 f-text-sm" style="margin-bottom:var(--space-sm)">제목 <span class="text-red-500">*</span></label>
          <input type="text" name="subject" required class="input-premium">
        </div>
        <div style="margin-bottom:var(--space-lg)">
          <label class="block font-semibold text-slate-700 f-text-sm" style="margin-bottom:var(--space-sm)">문의 내용 <span class="text-red-500">*</span></label>
          <textarea name="message" rows="6" required class="input-premium" style="resize:vertical;"></textarea>
        </div>

        <!-- ═══ 개인정보 수집·이용 동의 (v39.27) ═══ -->
        <!-- 「개인정보 보호법」제15조 준수 — 정보주체의 동의 필수 -->
        <div style="margin-bottom:var(--space-lg); padding:var(--space-md);
                    background: rgba(59,130,246,0.04);
                    border: 1px solid rgba(59,130,246,0.18);
                    border-radius: var(--radius-md);">
          <div class="flex items-center flex-wrap" style="gap:var(--space-sm) var(--space-md); row-gap:var(--space-sm);">
            <label class="flex items-center cursor-pointer shrink-0" style="gap:var(--space-sm)">
              <input type="checkbox" name="consent_personal_info" id="consentPI" required checked
                     class="shrink-0 cursor-pointer"
                     style="width:18px; height:18px; accent-color:#2563EB;">
              <span class="f-text-sm text-slate-700" style="line-height:1.6; white-space:nowrap;">
                <strong class="text-red-500">(필수)</strong>
                <strong>개인정보 수집·이용에 동의합니다.</strong>
              </span>
            </label>
            <span class="flex items-center f-text-xs" style="gap:var(--space-md); white-space:nowrap;">
              <button type="button" id="togglePrivacyDetail"
                      class="text-blue-600 hover:underline"
                      style="background:none; border:none; padding:0; cursor:pointer; white-space:nowrap;">
                [전문 보기 ▼]
              </button>
              <a href="/privacy" target="_blank" rel="noopener"
                 class="text-blue-600 hover:underline" style="white-space:nowrap;">
                <i class="fas fa-external-link-alt"></i> 처리방침 전문
              </a>
            </span>
          </div>

          <!-- 동의 전문 (기본 숨김, 토글로 펼침) -->
          <div id="privacyDetail" class="hidden"
               style="margin-top:var(--space-md); padding:var(--space-md);
                      background: white; border-radius: var(--radius-sm);
                      border: 1px solid rgba(0,0,0,0.08);">
            <table class="w-full f-text-xs text-slate-600" style="border-collapse: collapse;">
              <thead>
                <tr style="background:#F8FAFC;">
                  <th class="text-left p-2 border-b" style="width:35%;">항목</th>
                  <th class="text-left p-2 border-b">내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-2 border-b font-semibold">수집·이용 목적</td>
                  <td class="p-2 border-b">상담 문의 응대 및 회신</td>
                </tr>
                <tr>
                  <td class="p-2 border-b font-semibold">수집 항목</td>
                  <td class="p-2 border-b">이름, 회사명, 이메일, 연락처, 제목, 문의내용</td>
                </tr>
                <tr>
                  <td class="p-2 border-b font-semibold">보유·이용 기간</td>
                  <td class="p-2 border-b">문의 처리 완료 후 <strong>3년</strong><br><span class="text-slate-400">(전자상거래 등에서의 소비자보호에 관한 법률)</span></td>
                </tr>
                <tr>
                  <td class="p-2 font-semibold">동의 거부 권리</td>
                  <td class="p-2">동의를 거부할 권리가 있으며, 거부 시 상담 접수가 제한될 수 있습니다.</td>
                </tr>
              </tbody>
            </table>
            <p class="f-text-xs text-slate-500 mt-2">
              <i class="fas fa-info-circle mr-1"></i>
              자세한 내용은 <a href="/privacy" target="_blank" rel="noopener" class="text-blue-600 hover:underline">개인정보처리방침</a>을 참고하세요.
            </p>
          </div>
        </div>
        <!-- ═══ 개인정보 수집·이용 동의 끝 ═══ -->

        <button type="submit" id="inquiryBtn" class="w-full btn-primary justify-center f-text-sm ripple-btn" style="padding:var(--space-sm) 0; border-radius: var(--radius-md);">
          <i class="fas fa-paper-plane f-text-xs"></i> 문의하기
        </button>
        <div id="inquiryMsg" class="hidden rounded-lg f-text-sm" style="margin-top:var(--space-md); padding:var(--space-sm) var(--space-md)"></div>
      </form>
    </div>
  </section>
  <script>
    /* ═══ 개인정보 동의 전문 토글 (v39.27) ═══ */
    (function() {
      var btnToggle = document.getElementById('togglePrivacyDetail');
      if (btnToggle) {
        btnToggle.addEventListener('click', function() {
          var detail = document.getElementById('privacyDetail');
          var hidden = detail.classList.contains('hidden');
          if (hidden) {
            detail.classList.remove('hidden');
            this.textContent = '[전문 닫기 ▲]';
          } else {
            detail.classList.add('hidden');
            this.textContent = '[전문 보기 ▼]';
          }
        });
      }
    })();

    /* ═══ 폼 제출 핸들러 (v39.27 — 동의 검증 포함) ═══ */
    document.getElementById('inquiryForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = document.getElementById('inquiryBtn');
      var msg = document.getElementById('inquiryMsg');
      var form = e.target;

      /* ─── 클라이언트 측 동의 검증 ─── */
      var consentBox = document.getElementById('consentPI');
      if (!consentBox || !consentBox.checked) {
        msg.className = 'rounded-lg f-text-sm bg-red-50 text-red-700 border border-red-200';
        msg.style.cssText = 'margin-top:var(--space-md); padding:var(--space-sm) var(--space-md)';
        msg.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i> 개인정보 수집·이용에 동의해주세요.';
        msg.classList.remove('hidden');
        if (consentBox) consentBox.focus();
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> 전송 중...';
      try {
        var body = {};
        new FormData(form).forEach(function(v, k) { body[k] = v; });
        /* 체크박스는 FormData에 'on'으로 들어오므로 boolean으로 명시 + 동의 시각 기록 */
        body.consent_personal_info = true;
        body.consent_at = new Date().toISOString();

        var res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(body)
        });
        var data = await res.json();
        if (data.success) {
          msg.className = 'rounded-lg f-text-sm bg-green-50 text-green-700 border border-green-200';
          msg.style.cssText = 'margin-top:var(--space-md); padding:var(--space-sm) var(--space-md)';
          msg.innerHTML = '<i class="fas fa-check-circle mr-1"></i> 문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.';
          form.reset();
        } else {
          msg.className = 'rounded-lg f-text-sm bg-red-50 text-red-700 border border-red-200';
          msg.style.cssText = 'margin-top:var(--space-md); padding:var(--space-sm) var(--space-md)';
          msg.textContent = data.error || '전송에 실패했습니다.';
        }
      } catch(err) {
        msg.className = 'rounded-lg f-text-sm bg-red-50 text-red-700 border border-red-200';
        msg.style.cssText = 'margin-top:var(--space-md); padding:var(--space-sm) var(--space-md)';
        msg.textContent = '서버 연결 실패';
      }
      msg.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane mr-1"></i> 문의하기';
    });
  </script>`;
}


/* ══════════════════════════════════════════════════════════
   Category Definitions (10 Business Types)
   ══════════════════════════════════════════════════════════ */
// 원본 koist.kr 실제 카테고리 구조 (4개 핵심 + 6개 확장)
// CC평가 → /cc_progress: 제품명, 보증등급, 인증구분, 신청구분, 진행상태
// 보안기능시험 → /test1_progress: 제품명, 제품유형, 발급유형, 신청구분, 진행상태
// 암호모듈검증 → /test3_progress: 암호모듈, 개발사, 모듈형태, 보안수준, 진행현황
// 성능평가 → /test2_progress: 제품유형, 제품명, 운영체제, 개발사, 발급일
const CATEGORY_META: Record<string, { icon: string; color: string; col2: string; col3: string; col4: string }> = {
  'CC평가':       { icon: 'fa-shield-halved', color: '#3B82F6', col2: '보증등급', col3: '인증구분', col4: '신청구분' },
  '보안기능시험':   { icon: 'fa-file-shield', color: '#8B5CF6', col2: '제품유형', col3: '발급유형', col4: '신청구분' },
  '암호모듈검증':   { icon: 'fa-lock', color: '#EC4899', col2: '보안수준', col3: '모듈형태', col4: '-' },
  '성능평가':      { icon: 'fa-gauge-high', color: '#F59E0B', col2: '제품유형', col3: '운영체제', col4: '개발사' },
  '보안적합성검증':  { icon: 'fa-clipboard-check', color: '#10B981', col2: '적합등급', col3: '검증구분', col4: '검증기준' },
  '취약점분석평가':  { icon: 'fa-bug', color: '#EF4444', col2: '위험등급', col3: '분석유형', col4: '평가범위' },
  '정보보호제품평가': { icon: 'fa-box-archive', color: '#06B6D4', col2: '평가등급', col3: '제품유형', col4: '평가기준' },
  '클라우드보안인증': { icon: 'fa-cloud-arrow-up', color: '#6366F1', col2: '인증등급', col3: '서비스유형', col4: '인증기준' },
  'IoT보안인증':   { icon: 'fa-microchip', color: '#14B8A6', col2: '인증등급', col3: '기기유형', col4: '인증기준' },
  '기타시험평가':   { icon: 'fa-flask', color: '#78716C', col2: '제품유형', col3: '운영체제', col4: '개발사' },
};

function getCatMeta(cat: string) {
  return CATEGORY_META[cat] || { icon: 'fa-chart-bar', color: '#64748B', col2: '등급', col3: '구분', col4: '유형' };
}

/* ══════════════════════════════════════════════════════════
   Progress Page (Full-featured with Category Tabs)
   ══════════════════════════════════════════════════════════ */
export function progressPage(items: ProgressItem[], page: number = 1, total: number = 0, perPage: number = 15, search: string = '', statusFilter: string = '', categoryFilter: string = '', categoryCounts: {category:string;cnt:number}[] = [], settings: SettingsMap = {}) {
  const s = settings;
  const totalPages = Math.ceil(total / perPage);
  const startNum = total - (page - 1) * perPage;
  const meta = getCatMeta(categoryFilter);
  const grandTotal = categoryCounts.reduce((sum, c) => sum + c.cnt, 0);

  // v39.0: Reflected XSS 방어 - 사용자 입력값 HTML/Attr 이스케이프
  const searchEsc = escapeHtml(search);
  const searchAttr = escapeAttr(search);
  const categoryFilterEsc = escapeHtml(categoryFilter);
  const categoryFilterAttr = escapeAttr(categoryFilter);
  const statusFilterEsc = escapeHtml(statusFilter);
  // meta는 코드에서 정의된 객체이므로 color/icon도 이중 검증
  const metaIconSafe = safeFaIcon(meta.icon) || 'fa-circle';
  const metaColorSafe = safeColor(meta.color) || '#34D399';

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (categoryFilter) params.set('category', categoryFilter);
    if (search) params.set('q', search);
    if (statusFilter) params.set('status', statusFilter);
    return '/support/progress?' + params.toString();
  }

  function catUrl(cat: string) {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    return '/support/progress' + (params.toString() ? '?' + params.toString() : '');
  }

  return `
  ${pageHeader({
    title: categoryFilter ? categoryFilterEsc + ' 현황' : '평가·시험·인증 현황',
    subtitle: '총 ' + total + '건의 현황' + (categoryFilter ? '' : ' (전체 사업)'),
    icon: categoryFilter ? metaIconSafe : 'fa-chart-bar',
    iconColor: categoryFilter ? metaColorSafe : '#34D399',
    settings: s,
  })}

  <section style="padding:var(--space-xl) 0; background: var(--grad-surface);">
    <div class="fluid-container">

      <!-- Category Tabs -->
      <div class="bg-white rounded-xl border border-slate-200/60 overflow-hidden" style="margin-bottom:var(--space-md); box-shadow: var(--shadow-xs);">
        <div class="flex items-center overflow-x-auto" style="gap:0; -webkit-overflow-scrolling:touch; scrollbar-width:none;">
          <a href="${escapeAttr(catUrl(''))}" class="shrink-0 flex items-center transition-all f-text-xs font-medium border-b-2 ${!categoryFilter ? 'text-blue-600 border-blue-500 bg-blue-50/60' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}" style="padding:12px 16px; gap:6px; white-space:nowrap;">
            <i class="fas fa-layer-group" style="font-size:11px"></i> 전체 <span class="text-slate-400 font-normal">${grandTotal}</span>
          </a>
          ${categoryCounts.map(cc => {
            const m = getCatMeta(cc.category);
            const active = categoryFilter === cc.category;
            const mColor = safeColor(m.color) || '#3B82F6';
            const mIcon = safeFaIcon(m.icon) || 'fa-circle';
            const ccCategoryEsc = escapeHtml(cc.category);
            const ccCntEsc = escapeHtml(String(cc.cnt ?? 0));
            return `<a href="${escapeAttr(catUrl(cc.category))}" class="shrink-0 flex items-center transition-all f-text-xs font-medium border-b-2 ${active ? 'border-blue-500 bg-blue-50/60' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'}" style="padding:12px 16px; gap:6px; white-space:nowrap; ${active ? `color:${mColor};` : ''}">
              <i class="fas ${mIcon}" style="font-size:11px; ${active ? `color:${mColor}` : ''}"></i> ${ccCategoryEsc} <span class="text-slate-400 font-normal">${ccCntEsc}</span>
            </a>`;
          }).join('')}
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <form method="GET" action="/support/progress" class="bg-white rounded-xl border border-slate-200/60" style="padding:var(--space-md); margin-bottom:var(--space-md); box-shadow: var(--shadow-xs);">
        ${categoryFilter ? `<input type="hidden" name="category" value="${categoryFilterAttr}">` : ''}
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap:var(--space-sm)">
          <select name="status" class="input-premium" style="width:auto; min-width:140px; padding-right:2rem;" onchange="this.form.submit()">
            <option value="">전체 상태</option>
            <option value="평가완료" ${statusFilter === '평가완료' ? 'selected' : ''}>평가완료</option>
            <option value="발급완료" ${statusFilter === '발급완료' ? 'selected' : ''}>발급완료</option>
            <option value="평가진행" ${statusFilter === '평가진행' ? 'selected' : ''}>평가진행</option>
            <option value="시험진행" ${statusFilter === '시험진행' ? 'selected' : ''}>시험진행</option>
            <option value="평가접수" ${statusFilter === '평가접수' ? 'selected' : ''}>평가접수</option>
            <option value="시험접수" ${statusFilter === '시험접수' ? 'selected' : ''}>시험접수</option>
          </select>
          <div class="flex-1 relative">
            <input type="text" name="q" value="${searchAttr}" placeholder="제품명·회사명 검색..." class="input-premium" style="padding-right:2.5rem">
            <button type="submit" class="absolute right-0 top-0 bottom-0 text-slate-400 hover:text-accent transition-colors" style="padding:0 var(--space-md)">
              <i class="fas fa-search f-text-sm"></i>
            </button>
          </div>
          ${search || statusFilter ? `<a href="${escapeAttr(catUrl(categoryFilter))}" class="shrink-0 text-slate-500 hover:text-red-500 transition-colors f-text-xs flex items-center" style="padding:var(--space-sm)"><i class="fas fa-times mr-1"></i>필터 초기화</a>` : ''}
        </div>
      </form>

      <!-- Data Table -->
      <div class="bg-white rounded-xl border border-slate-200/60 overflow-hidden" style="box-shadow: var(--shadow-sm);">
        <div class="overflow-x-auto">
          <table class="w-full" style="table-layout:fixed; min-width:820px;">
            <colgroup>
              <col style="width:52px">
              ${!categoryFilter ? '<col style="width:100px">' : ''}
              <col style="width:auto">
              <col style="width:220px">
              <col style="width:140px" class="hidden sm:table-column">
              <col style="width:88px" class="hidden md:table-column">
              <col style="width:96px">
            </colgroup>
            <thead>
              <tr style="background: linear-gradient(135deg, #0F172A, #1E293B);">
                <th class="text-center text-slate-300 f-text-xs font-semibold" style="padding:11px 10px">번호</th>
                ${!categoryFilter ? '<th class="text-left text-slate-300 f-text-xs font-semibold" style="padding:11px 10px">사업분류</th>' : ''}
                <th class="text-left text-slate-300 f-text-xs font-semibold pl-3 sm:pl-10 pr-3" style="padding-top:11px; padding-bottom:11px">제품명</th>
                <th class="text-center text-slate-300 f-text-xs font-semibold" style="padding:11px 10px">${categoryFilter ? escapeHtml(meta.col2) : '등급'}</th>
                <th class="text-center text-slate-300 f-text-xs font-semibold hidden sm:table-cell" style="padding:11px 10px">${categoryFilter ? escapeHtml(meta.col3) : '구분'}</th>
                <th class="text-center text-slate-300 f-text-xs font-semibold hidden md:table-cell" style="padding:11px 10px">${categoryFilter ? escapeHtml(meta.col4) : '유형'}</th>
                <th class="text-center text-slate-300 f-text-xs font-semibold" style="padding:11px 10px">진행상태</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((p, i) => {
                const cm = getCatMeta(p.category);
                const cmColor = safeColor(cm.color) || '#64748B';
                const cmIcon = safeFaIcon(cm.icon) || 'fa-circle';
                return `
              <tr class="border-t border-slate-100/70 hover:bg-blue-50/25 transition-colors" style="border-left:3px solid transparent;">
                <td class="text-center text-slate-400 f-text-xs" style="padding:10px 10px">${startNum - i}</td>
                ${!categoryFilter ? `<td class="text-left" style="padding:10px 10px"><span class="inline-flex items-center gap-1 rounded-full f-text-xs font-medium" style="padding:2px 8px; background:${cmColor}10; color:${cmColor}; white-space:nowrap;"><i class="fas ${cmIcon}" style="font-size:8px"></i>${escapeHtml(p.category)}</span></td>` : ''}
                <td class="pl-3 sm:pl-10 pr-3" style="padding-top:10px; padding-bottom:10px"><span class="font-medium text-slate-800 f-text-sm truncate block" style="max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(p.product_name)}</span></td>
                <td class="text-center" style="padding:10px 10px"><span class="inline-block bg-slate-100 text-slate-700 rounded font-mono font-medium f-text-xs" style="padding:2px 8px; white-space:nowrap"${isAliased(p.assurance_level) ? ` title="${escapeAttr(p.assurance_level || '')}"` : ''}>${escapeHtml(getGradeDisplay(p.assurance_level))}</span></td>
                <td class="text-center text-slate-600 hidden sm:table-cell f-text-xs" style="padding:10px 10px; white-space:nowrap">${escapeHtml(p.cert_type || '-')}</td>
                <td class="text-center text-slate-600 hidden md:table-cell f-text-xs" style="padding:10px 10px; white-space:nowrap">${escapeHtml(p.eval_type || '-')}</td>
                <td class="text-center" style="padding:10px 10px">${statusBadge(p.status)}</td>
              </tr>`;
              }).join('')}
              ${items.length === 0 ? `<tr><td colspan="${categoryFilter ? 6 : 7}" class="text-center text-slate-400 f-text-sm" style="padding:var(--space-2xl) 0">
                <i class="fas fa-search text-slate-300 block" style="font-size:1.8rem; margin-bottom:var(--space-sm)"></i>
                ${search ? '검색 결과가 없습니다.' : '등록된 현황이 없습니다.'}
              </td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      ${totalPages > 1 ? `
      <div class="flex flex-col sm:flex-row justify-between items-center" style="margin-top:var(--space-lg); gap:var(--space-md)">
        <p class="text-slate-500 f-text-xs">${total}건 중 ${(page - 1) * perPage + 1}~${Math.min(page * perPage, total)}건 표시 <span class="text-slate-400">(${page}/${totalPages})</span></p>
        <div class="flex items-center" style="gap:4px">
          ${page > 1 ? `<a href="${escapeAttr(pageUrl(1))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all f-text-xs" style="width:32px; height:32px" title="처음"><i class="fas fa-angles-left"></i></a>
          <a href="${escapeAttr(pageUrl(page - 1))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all f-text-xs" style="width:32px; height:32px" title="이전"><i class="fas fa-chevron-left"></i></a>` : ''}
          ${Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
            .map((p, idx, arr) => {
              let dots = idx > 0 && p - arr[idx - 1] > 1 ? '<span class="text-slate-400 f-text-xs" style="padding:0 3px">…</span>' : '';
              return dots + `<a href="${escapeAttr(pageUrl(p))}" class="flex items-center justify-center rounded-lg font-medium f-text-xs transition-all ${p === page ? 'text-white' : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50 hover:text-slate-700'}" style="width:32px; height:32px; ${p === page ? 'background: linear-gradient(135deg, #2563EB, #3B82F6); box-shadow: 0 2px 8px rgba(37,99,235,0.25);' : ''}">${p}</a>`;
            }).join('')}
          ${page < totalPages ? `<a href="${escapeAttr(pageUrl(page + 1))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all f-text-xs" style="width:32px; height:32px" title="다음"><i class="fas fa-chevron-right"></i></a>
          <a href="${escapeAttr(pageUrl(totalPages))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all f-text-xs" style="width:32px; height:32px" title="맨끝"><i class="fas fa-angles-right"></i></a>` : ''}
        </div>
      </div>` : ''}
    </div>
  </section>`;
}


/* ══════════════════════════════════════════════════════════
   Embedded Progress Table (for service sub-pages)
   ══════════════════════════════════════════════════════════ */
export function serviceProgressContent(items: ProgressItem[], page: number = 1, total: number = 0, perPage: number = 15, search: string = '', statusFilter: string = '', categoryFilter: string = '', categoryCounts: {category:string;cnt:number}[] = [], relatedDownloads: { id: number; title: string; file_name: string; created_at: string }[] = []) {
  const totalPages = Math.ceil(total / perPage);
  const startNum = total - (page - 1) * perPage;

  // v39.0: Reflected XSS 방어
  const searchAttr = escapeAttr(search);
  const categoryFilterEsc = escapeHtml(categoryFilter);
  const categoryFilterAttr = escapeAttr(categoryFilter);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (search) params.set('q', search);
    if (statusFilter) params.set('status', statusFilter);
    return '?' + params.toString();
  }

  const meta = getCatMeta(categoryFilter);
  const metaIconSafe = safeFaIcon(meta.icon) || 'fa-circle';
  const grandTotal = categoryCounts.reduce((sum, c) => sum + c.cnt, 0);

  return `
    <h2 class="font-bold text-primary f-text-lg flex items-center" style="margin-bottom:var(--space-md); gap: var(--space-sm)">
      <div class="rounded-lg flex items-center justify-center" style="width:28px;height:28px; background: linear-gradient(135deg, rgba(16,185,129,0.10), rgba(6,182,212,0.08));">
        <i class="fas ${categoryFilter ? metaIconSafe : 'fa-chart-bar'} text-emerald-500" style="font-size:12px"></i>
      </div>
      ${categoryFilter ? categoryFilterEsc + ' 현황' : '평가·시험·인증 현황'} <span class="text-slate-400 font-normal f-text-sm">(총 ${total}건)</span>
    </h2>

    <!-- Category Tabs (inline) -->
    ${categoryCounts.length > 1 ? `
    <div class="flex items-center flex-wrap mb-3" style="gap:6px">
      <a href="?" class="inline-flex items-center gap-1 rounded-full f-text-xs font-medium transition-all ${!categoryFilter ? 'text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}" style="padding:4px 12px; ${!categoryFilter ? 'background:linear-gradient(135deg,#2563EB,#3B82F6);' : ''}">전체 ${grandTotal}</a>
      ${categoryCounts.map(cc => {
        const m = getCatMeta(cc.category);
        const active = categoryFilter === cc.category;
        const mColor = safeColor(m.color) || '#3B82F6';
        const mIcon = safeFaIcon(m.icon) || 'fa-circle';
        const ccCategoryEsc = escapeHtml(cc.category);
        const ccCntEsc = escapeHtml(String(cc.cnt ?? 0));
        return `<a href="?category=${encodeURIComponent(cc.category)}" class="inline-flex items-center gap-1 rounded-full f-text-xs font-medium transition-all ${active ? 'text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}" style="padding:4px 12px; ${active ? `background:${mColor};` : ''}"><i class="fas ${mIcon}" style="font-size:8px"></i>${ccCategoryEsc} ${ccCntEsc}</a>`;
      }).join('')}
    </div>` : ''}

    <!-- Search & Filter -->
    <form method="GET" class="rounded-lg border border-slate-200/70" style="padding:var(--space-md); margin-bottom:var(--space-md); background: rgba(248,250,252,0.80);">
      ${categoryFilter ? `<input type="hidden" name="category" value="${categoryFilterAttr}">` : ''}
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap:var(--space-sm)">
        <select name="status" class="input-premium" style="width:auto; min-width:140px;" onchange="this.form.submit()">
          <option value="">전체 상태</option>
          <option value="평가완료" ${statusFilter === '평가완료' ? 'selected' : ''}>평가완료</option>
          <option value="발급완료" ${statusFilter === '발급완료' ? 'selected' : ''}>발급완료</option>
          <option value="평가진행" ${statusFilter === '평가진행' ? 'selected' : ''}>평가진행</option>
          <option value="시험진행" ${statusFilter === '시험진행' ? 'selected' : ''}>시험진행</option>
          <option value="평가접수" ${statusFilter === '평가접수' ? 'selected' : ''}>평가접수</option>
          <option value="시험접수" ${statusFilter === '시험접수' ? 'selected' : ''}>시험접수</option>
        </select>
        <div class="flex-1 relative">
          <input type="text" name="q" value="${searchAttr}" placeholder="제품명·회사명 검색..." class="input-premium" style="padding-right:2.5rem">
          <button type="submit" class="absolute right-0 top-0 bottom-0 text-slate-400 hover:text-accent transition-colors" style="padding:0 var(--space-md)">
            <i class="fas fa-search f-text-sm"></i>
          </button>
        </div>
        ${search || statusFilter ? `<a href="?${categoryFilter ? 'category=' + encodeURIComponent(categoryFilter) : ''}" class="shrink-0 text-slate-500 hover:text-red-500 transition-colors f-text-xs flex items-center" style="padding:var(--space-sm)"><i class="fas fa-times mr-1"></i>초기화</a>` : ''}
      </div>
    </form>

    <!-- Table -->
    <div class="rounded-lg border border-slate-200/60 overflow-hidden" style="box-shadow: var(--shadow-xs);">
      <div class="overflow-x-auto">
        <table class="w-full" style="table-layout:fixed; min-width:820px;">
          <colgroup>
            <col style="width:52px">
            <col style="width:auto">
            <col style="width:220px">
            <col style="width:140px" class="hidden sm:table-column">
            <col style="width:88px" class="hidden md:table-column">
            <col style="width:96px">
          </colgroup>
          <thead>
            <tr style="background: linear-gradient(135deg, #0F172A, #1E293B);">
              <th class="text-center text-slate-300 f-text-xs font-semibold" style="padding:11px 10px">번호</th>
              <th class="text-left text-slate-300 f-text-xs font-semibold pl-3 sm:pl-10 pr-3" style="padding-top:11px; padding-bottom:11px">제품명</th>
              <th class="text-center text-slate-300 f-text-xs font-semibold" style="padding:11px 10px">${categoryFilter ? escapeHtml(meta.col2) : '등급'}</th>
              <th class="text-center text-slate-300 f-text-xs font-semibold hidden sm:table-cell" style="padding:11px 10px">${categoryFilter ? escapeHtml(meta.col3) : '구분'}</th>
              <th class="text-center text-slate-300 f-text-xs font-semibold hidden md:table-cell" style="padding:11px 10px">${categoryFilter ? escapeHtml(meta.col4) : '유형'}</th>
              <th class="text-center text-slate-300 f-text-xs font-semibold" style="padding:11px 10px">진행상태</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((p, i) => `
            <tr class="border-t border-slate-100/70 hover:bg-blue-50/25 transition-colors">
              <td class="text-center text-slate-400 f-text-xs" style="padding:10px 10px">${startNum - i}</td>
              <td class="pl-3 sm:pl-10 pr-3" style="padding-top:10px; padding-bottom:10px">
                <span class="font-medium text-slate-800 f-text-sm truncate block" style="max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(p.product_name)}</span>
              </td>
              <td class="text-center" style="padding:10px 10px">
                <span class="inline-block bg-slate-100 text-slate-700 rounded font-mono font-medium f-text-xs" style="padding:2px 8px; white-space:nowrap"${isAliased(p.assurance_level) ? ` title="${escapeAttr(p.assurance_level || '')}"` : ''}>${escapeHtml(getGradeDisplay(p.assurance_level))}</span>
              </td>
              <td class="text-center text-slate-600 hidden sm:table-cell f-text-xs" style="padding:10px 10px; white-space:nowrap">${escapeHtml(p.cert_type || '-')}</td>
              <td class="text-center text-slate-600 hidden md:table-cell f-text-xs" style="padding:10px 10px; white-space:nowrap">${escapeHtml(p.eval_type || '-')}</td>
              <td class="text-center" style="padding:10px 10px">
                ${statusBadge(p.status)}
              </td>
            </tr>
            `).join('')}
            ${items.length === 0 ? `<tr><td colspan="6" class="text-center text-slate-400 f-text-sm" style="padding:var(--space-2xl) 0">
              <i class="fas fa-search text-slate-300 block" style="font-size:1.8rem; margin-bottom:var(--space-sm)"></i>
              ${search ? '검색 결과가 없습니다.' : '등록된 현황이 없습니다.'}
            </td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    ${totalPages > 1 ? `
    <div class="flex flex-col sm:flex-row justify-between items-center" style="margin-top:var(--space-lg); gap:var(--space-md)">
      <p class="text-slate-500 f-text-xs">${total}건 중 ${(page - 1) * perPage + 1}~${Math.min(page * perPage, total)}건 표시 <span class="text-slate-400">(${page}/${totalPages})</span></p>
      <div class="flex items-center" style="gap:4px">
        ${page > 1 ? `<a href="${escapeAttr(pageUrl(1))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 transition-all f-text-xs" style="width:32px; height:32px"><i class="fas fa-angles-left"></i></a>
        <a href="${escapeAttr(pageUrl(page - 1))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 transition-all f-text-xs" style="width:32px; height:32px"><i class="fas fa-chevron-left"></i></a>` : ''}
        ${Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
          .map((p, idx, arr) => {
            let dots = idx > 0 && p - arr[idx - 1] > 1 ? '<span class="text-slate-400 f-text-xs" style="padding:0 3px">…</span>' : '';
            return dots + `<a href="${escapeAttr(pageUrl(p))}" class="flex items-center justify-center rounded-lg font-medium f-text-xs transition-all ${p === page ? 'text-white' : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50'}" style="width:32px; height:32px; ${p === page ? 'background: linear-gradient(135deg, #2563EB, #3B82F6); box-shadow: 0 2px 8px rgba(37,99,235,0.25);' : ''}">${p}</a>`;
          }).join('')}
        ${page < totalPages ? `<a href="${escapeAttr(pageUrl(page + 1))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 transition-all f-text-xs" style="width:32px; height:32px"><i class="fas fa-chevron-right"></i></a>
        <a href="${escapeAttr(pageUrl(totalPages))}" class="flex items-center justify-center rounded-lg bg-white border border-slate-200/70 text-slate-500 hover:bg-slate-50 transition-all f-text-xs" style="width:32px; height:32px"><i class="fas fa-angles-right"></i></a>` : ''}
      </div>
    </div>` : ''}

    <!-- v40.4: 관련 자료실 (옵션 A — category 기반 연계) -->
    ${relatedDownloads.length > 0 ? `
    <div class="rounded-lg border border-slate-200/60" style="margin-top:var(--space-lg); padding:var(--space-md); background: rgba(248,250,252,0.60);">
      <h3 class="font-bold text-primary f-text-sm flex items-center" style="margin-bottom:var(--space-sm); gap:var(--space-xs)">
        <i class="fas fa-folder-open text-purple-500" style="font-size:12px"></i> 관련 자료실
      </h3>
      <div class="flex flex-col" style="gap:6px">
        ${relatedDownloads.map(d => `
        <a href="/api/downloads/${parseInt(String(d.id), 10) || 0}/file" class="flex items-center justify-between rounded-lg bg-white border border-slate-200/60 hover:border-slate-300 transition-all group" style="padding:var(--space-sm) var(--space-md); gap:var(--space-sm)">
          <span class="flex items-center min-w-0" style="gap:var(--space-sm)">
            <i class="fas fa-file-lines text-purple-400 shrink-0" style="font-size:12px"></i>
            <span class="font-medium text-slate-700 truncate f-text-xs group-hover:text-accent transition-colors">${escapeHtml(d.title)}</span>
          </span>
          <span class="shrink-0 text-slate-400 f-text-xs"><i class="fas fa-download mr-1"></i>${escapeHtml((d.file_name || '').split('.').pop() || '')}</span>
        </a>`).join('')}
      </div>
    </div>` : ''}
  `;
}


/* ────────────── Downloads (Premium Cards) ────────────── */
export function downloadsPage(downloads: { id: number; title: string; description: string; file_name: string; category: string; download_count: number; created_at: string }[], settings: SettingsMap = {}) {
  const s = settings;
  return `
  ${pageHeader({
    title: '자료실',
    icon: 'fa-download',
    iconColor: '#A78BFA',
    settings: s,
  })}

  <section style="padding:var(--space-xl) 0; background: var(--grad-surface);">
    <div class="fluid-container" style="max-width:min(1100px, 100% - var(--container-pad) * 2); display:flex; flex-direction:column; gap:var(--space-sm)">
      ${downloads.map(d => `
      <div class="bg-white rounded-xl border border-slate-200/60 flex items-center justify-between transition-all hover:border-slate-300/70 group" style="padding:var(--space-md); gap:var(--space-md); box-shadow: var(--shadow-xs);">
        <div class="flex items-center min-w-0" style="gap:var(--space-sm)">
          <div class="rounded-lg flex items-center justify-center shrink-0" style="width:clamp(34px,2.8vw,40px); height:clamp(34px,2.8vw,40px); background: linear-gradient(135deg, rgba(167,139,250,0.10), rgba(139,92,246,0.06));">
            <i class="fas fa-file-lines text-purple-500 f-text-sm"></i>
          </div>
          <div class="min-w-0">
            <h3 class="font-medium text-slate-800 truncate f-text-sm group-hover:text-accent transition-colors">${escapeHtml(d.title)}</h3>
            <p class="text-slate-400 f-text-xs" style="margin-top:2px">${escapeHtml(d.file_name || '')} · ${escapeHtml((d.created_at || '').split('T')[0] || '')} · 다운로드 ${escapeHtml(String(d.download_count ?? 0))}회</p>
          </div>
        </div>
        <a href="/api/downloads/${parseInt(String(d.id), 10) || 0}/file" class="shrink-0 btn-primary f-text-xs ripple-btn" style="padding:var(--space-xs) var(--space-md); border-radius: var(--radius-sm);">
          <i class="fas fa-download" style="font-size:10px"></i> 다운로드
        </a>
      </div>
      `).join('')}
      ${downloads.length === 0 ? '<div class="text-center text-slate-400 f-text-sm" style="padding:var(--space-2xl) 0"><i class="fas fa-folder-open text-slate-300 block" style="font-size:1.8rem;margin-bottom:var(--space-sm)"></i>등록된 자료가 없습니다.</div>' : ''}
    </div>
  </section>`;
}

// ═══════════════════════════════════════════════════════════════════
// Privacy Policy Page (v39.29 Phase 3 - 개인정보처리방침)
// ═══════════════════════════════════════════════════════════════════
// 근거 법령:
//   - 「개인정보 보호법」제30조 (개인정보 처리방침의 수립 및 공개)
//   - 「개인정보 보호법 시행령」제31조
// 필수 기재 항목 (제30조 제1항):
//   1. 개인정보의 처리 목적
//   2. 처리 항목
//   3. 처리 및 보유 기간
//   4. 제3자 제공
//   5. 처리 위탁
//   6. 정보주체의 권리·의무 및 행사 방법
//   7. 개인정보 안전성 확보 조치
//   8. 개인정보 보호책임자
//   9. 처리방침 변경
// ═══════════════════════════════════════════════════════════════════
export function privacyPolicyPage(settings: SettingsMap = {}) {
  const s = settings;
  const orgName = s.site_name || '한국정보보호기술원(KOIST)';
  const today = new Date().toISOString().slice(0, 10);

  return `
  ${pageHeader({
    title: '개인정보처리방침',
    icon: 'fa-user-shield',
    iconColor: '#10B981',
    subtitle: `${orgName}의 개인정보 수집·이용·보관·파기에 관한 사항을 안내합니다.`,
    settings: s,
  })}

  <section style="padding:var(--space-xl) 0; background: var(--grad-surface);">
    <div class="fluid-container" style="max-width:min(960px, 100% - var(--container-pad) * 2);">

      <!-- 요약 카드 -->
      <div class="bg-white rounded-2xl border border-emerald-100 p-6 mb-6" style="box-shadow: 0 2px 16px rgba(16,185,129,0.06);">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <i class="fas fa-shield-check text-emerald-600"></i>
          </div>
          <div>
            <h2 class="font-bold text-slate-800 text-base">한눈에 보는 개인정보 처리방침</h2>
            <p class="text-sm text-slate-500 mt-1">${orgName}은 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.</p>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <div class="bg-slate-50 rounded-lg p-3 text-center">
            <i class="fas fa-bullseye text-blue-500 text-xl block mb-1"></i>
            <div class="text-xs font-semibold text-slate-700">처리 목적</div>
            <div class="text-[11px] text-slate-500 mt-0.5">상담문의 응대</div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3 text-center">
            <i class="fas fa-list text-purple-500 text-xl block mb-1"></i>
            <div class="text-xs font-semibold text-slate-700">처리 항목</div>
            <div class="text-[11px] text-slate-500 mt-0.5">이름·연락처 등</div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3 text-center">
            <i class="fas fa-clock text-orange-500 text-xl block mb-1"></i>
            <div class="text-xs font-semibold text-slate-700">보관 기간</div>
            <div class="text-[11px] text-slate-500 mt-0.5">3년</div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3 text-center">
            <i class="fas fa-users-slash text-red-500 text-xl block mb-1"></i>
            <div class="text-xs font-semibold text-slate-700">제3자 제공</div>
            <div class="text-[11px] text-slate-500 mt-0.5">없음</div>
          </div>
        </div>
      </div>

      <!-- 본문 -->
      <article class="bg-white rounded-2xl border border-slate-200/60 p-[clamp(1.5rem,3vw,2.5rem)]" style="box-shadow: var(--shadow-sm);">
        <style>
          .privacy-section h3 { font-size: 1.05rem; font-weight: 700; color: #1F2937; margin: 1.5rem 0 0.6rem; padding-left: 0.6rem; border-left: 3px solid #10B981; }
          .privacy-section h4 { font-size: 0.95rem; font-weight: 600; color: #374151; margin: 1rem 0 0.4rem; }
          .privacy-section p, .privacy-section li { font-size: 0.9rem; color: #4B5563; line-height: 1.75; }
          .privacy-section ul, .privacy-section ol { padding-left: 1.4rem; margin: 0.4rem 0; }
          .privacy-section ul { list-style: disc; }
          .privacy-section ol { list-style: decimal; }
          .privacy-section table { width: 100%; border-collapse: collapse; margin: 0.6rem 0; font-size: 0.85rem; }
          .privacy-section th, .privacy-section td { border: 1px solid #E5E7EB; padding: 0.55rem 0.7rem; text-align: left; }
          .privacy-section th { background: #F9FAFB; font-weight: 600; color: #374151; }
          .privacy-section .note { background: #FEF3C7; border-left: 3px solid #F59E0B; padding: 0.6rem 0.9rem; border-radius: 0.4rem; margin: 0.6rem 0; font-size: 0.85rem; }
        </style>

        <div class="privacy-section">
          <p class="text-sm text-slate-600 leading-relaxed">
            ${escapeHtml(orgName)}(이하 "기관")은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고
            이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 개인정보 처리방침을 수립·공개합니다.
          </p>

          <h3>제1조 (개인정보의 처리 목적)</h3>
          <p>기관은 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul>
            <li><strong>온라인 상담문의 응대</strong>: 문의 내용 확인, 답변 회신, 본인 식별 및 인증</li>
            <li><strong>서비스 품질 개선</strong>: 통계 분석 및 평가현황 안내</li>
            <li><strong>법적 의무 이행</strong>: 관련 법령에 따른 보관 및 감사 대응</li>
          </ul>

          <h3>제2조 (처리하는 개인정보의 항목)</h3>
          <p>기관은 다음의 개인정보 항목을 처리하고 있습니다.</p>
          <table>
            <thead>
              <tr><th>수집 시점</th><th>수집 항목</th><th>수집 방법</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>온라인 상담문의 신청 시</td>
                <td><strong>[필수]</strong> 이름, 문의 내용<br><strong>[선택]</strong> 이메일, 휴대전화번호, 회사명</td>
                <td>홈페이지 입력</td>
              </tr>
              <tr>
                <td>서비스 이용 과정</td>
                <td>접속 IP, 쿠키, 접속일시, 서비스 이용기록</td>
                <td>자동 수집</td>
              </tr>
            </tbody>
          </table>
          <div class="note"><i class="fas fa-info-circle mr-1"></i>
            <strong>민감정보 및 고유식별정보는 일체 수집하지 않습니다.</strong>
            (사상·신념, 노조 가입, 정치적 견해, 건강, 성생활, 주민등록번호 등 미수집)
          </div>

          <h3>제3조 (개인정보의 처리 및 보유 기간)</h3>
          <ol>
            <li>기관은 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
            <li>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
              <table style="margin-top:0.5rem;">
                <thead><tr><th>처리 업무</th><th>보유 기간</th><th>근거</th></tr></thead>
                <tbody>
                  <tr><td>온라인 상담문의 기록</td><td><strong>3년</strong></td><td>「전자상거래법」 제6조 (계약·청약철회 등 기록)</td></tr>
                  <tr><td>관리자 접속 기록 (감사 로그)</td><td><strong>1년 이상</strong></td><td>「개인정보의 안전성 확보조치 기준」 제8조</td></tr>
                  <tr><td>자동 수집 (쿠키, 접속 IP)</td><td>세션 종료 시 또는 최대 1년</td><td>분석 및 보안</td></tr>
                </tbody>
              </table>
            </li>
            <li>보유 기간 경과 시 지체 없이(5일 이내) 복구·재생할 수 없는 방법으로 파기합니다.</li>
          </ol>

          <h3>제4조 (개인정보의 제3자 제공)</h3>
          <p>기관은 정보주체의 개인정보를 제1조에서 명시한 목적 범위 내에서만 처리하며, 정보주체의 동의·법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
          <p class="note"><i class="fas fa-shield-alt mr-1"></i><strong>현재 기관은 정보주체의 개인정보를 제3자에게 제공하고 있지 않습니다.</strong></p>

          <h3>제5조 (개인정보 처리 위탁)</h3>
          <p>기관은 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
          <table>
            <thead><tr><th>수탁 업체</th><th>위탁 업무</th><th>처리 위치</th></tr></thead>
            <tbody>
              <tr><td>Cloudflare, Inc.</td><td>웹사이트 호스팅, 데이터 저장(D1·R2), CDN</td><td>미국 (글로벌 엣지)</td></tr>
            </tbody>
          </table>
          <p style="margin-top:0.5rem;">위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>

          <h3>제6조 (정보주체의 권리·의무 및 행사방법)</h3>
          <ol>
            <li>정보주체는 기관에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
              <ul>
                <li>개인정보 <strong>열람 요구</strong></li>
                <li>오류 등이 있을 경우 <strong>정정 요구</strong></li>
                <li><strong>삭제 요구</strong> (법령에서 보존 의무가 있는 경우는 제외)</li>
                <li>개인정보 <strong>처리정지 요구</strong></li>
                <li><strong>동의 철회</strong></li>
              </ul>
            </li>
            <li>권리 행사는 본 처리방침 제9조 개인정보 보호책임자에게 서면, 전화, 전자우편 등을 통하여 할 수 있으며, 기관은 이에 대해 지체 없이 조치하겠습니다.</li>
            <li>대리인을 통한 권리 행사 시 「개인정보 처리방법에 관한 고시」(제2020-7호) 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</li>
          </ol>

          <h3>제7조 (개인정보의 파기 절차 및 방법)</h3>
          <p>기관은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
          <ul>
            <li><strong>파기 절차</strong>: 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
            <li><strong>파기 방법</strong>:
              <ul>
                <li>전자적 파일: 복구 및 재생이 불가능한 방법으로 영구 삭제 (논리적 삭제 + 물리적 덮어쓰기)</li>
                <li>인쇄물·서면: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </li>
          </ul>

          <h3>제8조 (개인정보의 안전성 확보 조치)</h3>
          <p>기관은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ul>
            <li><strong>관리적 조치</strong>: 내부관리계획 수립·시행, 개인정보 취급자 정기 교육</li>
            <li><strong>기술적 조치</strong>:
              <ul>
                <li>개인정보처리시스템 등의 <strong>접근 권한 관리</strong> (관리자 ID/PW + JWT 인증)</li>
                <li><strong>접근 통제 시스템</strong> 설치 (Cloudflare WAF, 비율 제한)</li>
                <li>고유식별정보 등의 <strong>암호화</strong> (HTTPS/TLS 1.3 강제)</li>
                <li>접속 기록 보관 및 위·변조 방지 (감사 로그 1년 이상)</li>
                <li>보안프로그램 설치 (CSP, XSS·CSRF 방어)</li>
                <li><strong>자동 백업</strong> (일/주/월 단위, SHA-256 무결성 검증)</li>
              </ul>
            </li>
            <li><strong>물리적 조치</strong>: Cloudflare 데이터센터의 물리적 보안 및 출입 통제</li>
          </ul>

          <h3>제9조 (개인정보 보호책임자)</h3>
          <p>기관은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <table>
            <tbody>
              <tr><th style="width:30%;">개인정보 보호책임자</th><td>${escapeHtml(s.privacy_officer_name || '개인정보보호 담당자')}</td></tr>
              <tr><th>소속·직위</th><td>${escapeHtml(s.privacy_officer_position || orgName + ' / 개인정보보호 담당')}</td></tr>
              <tr><th>연락처</th><td>${escapeHtml(s.privacy_officer_phone || s.contact_phone || '-')}</td></tr>
              <tr><th>이메일</th><td>${escapeHtml(s.privacy_officer_email || s.contact_email || '-')}</td></tr>
            </tbody>
          </table>

          <h3>제10조 (개인정보의 열람청구 및 권익침해 구제방법)</h3>
          <p>정보주체는 「개인정보 보호법」 제35조에 따른 개인정보 열람 청구를 본 처리방침 제9조의 개인정보 보호책임자에게 할 수 있습니다.</p>
          <p>기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.</p>
          <table>
            <thead><tr><th>기관명</th><th>전화</th><th>홈페이지</th></tr></thead>
            <tbody>
              <tr><td>개인정보분쟁조정위원회</td><td>1833-6972 (국번없이)</td><td>www.kopico.go.kr</td></tr>
              <tr><td>개인정보침해신고센터</td><td>118 (국번없이)</td><td>privacy.kisa.or.kr</td></tr>
              <tr><td>대검찰청 사이버수사과</td><td>1301 (국번없이)</td><td>www.spo.go.kr</td></tr>
              <tr><td>경찰청 사이버수사국</td><td>182 (국번없이)</td><td>ecrm.police.go.kr</td></tr>
            </tbody>
          </table>

          <h3>제11조 (개인정보 처리방침의 변경)</h3>
          <ol>
            <li>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</li>
            <li>이 개인정보처리방침은 <strong>${today}</strong>부터 적용됩니다.</li>
          </ol>

          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #E5E7EB; text-align:center;">
            <p class="text-xs text-slate-400">
              본 개인정보처리방침은 「개인정보 보호법」 제30조 및 관계 법령에 따라 작성되었습니다.<br>
              최종 개정일: ${today} | 버전: v39.29
            </p>
            <a href="/support/inquiry" class="inline-block mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition">
              <i class="fas fa-envelope mr-1"></i> 개인정보 관련 문의하기
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>`;
}

# KOIST Website v42.4.3

> ## 🆕 v42.4.3 변경 사항 (2026-06-04) — 시뮬레이터 바 내부 글자색 개별 지정 (가독성 충돌 해소)
>
> **사용자 지시**: CCRA평가일수 바 안 글자는 모두 진한 검정으로, KOIST 평가 프로세스 바 안 글자는 "대폭단축" 색으로 진하게.
>
> **변경 내역:**
> - **CCRA평가일수 바 안 글자(준비/평가 N개월)** → 진한 검정 `#0F172A`, text-shadow 흰색 계열로 주황·회색 배경 위 가독성 확보.
> - **KOIST 평가 프로세스 바 안 글자(준비/평가 N개월)** → "대폭 단축" 금색 `#FBBF24`, text-shadow 강화(rgba(0,0,0,0.75))로 주황·파랑 배경 위 선명하게.
> - v42.4.2의 "주황 바 위 오렌지 글자 묻힘" 가독성 충돌 해소됨.
> - **캐시 `v42.4.2→v42.4.3`**.
> - JS 동적 업데이트(L2212~2235)는 `.textContent`만 갱신하므로 인라인 color 스타일 유지됨(오버라이드 없음).

> ## v42.4.2 변경 사항 (2026-06-04) — 시뮬레이터 패널 글자색 재지정 (검정→초록, 흰/회색→오렌지)
>
> **사용자 지시**: 검정 글자는 모두 "양호"의 색(초록 #10B981)으로, 흰색/회색 글자는 오렌지(#F59E0B)로 변경.
>
> **변경 내역:**
> - **검정→초록(#10B981)**: 사전준비, CCRA평가일수, 약N개월 총계(CCRA·KOIST), 회색바 "평가 N개월", "평가기간 약N% 단축", "약N개월 절감·원스톱", "223건 평가실적".
> - **흰/회색→오렌지(#F59E0B)**: 패널 제목(+강조 #FBBF24), 부제목, 평균단축 %·라벨, 탭(전체평균/EAL2~4 — 비활성·활성·hover), 슬라이더 1/100 눈금, 주황·파랑 바 안 "준비/평가 N개월".
> - **캐시 `v42.4.1→v42.4.2`**.
>
> ⚠️ **알려진 가독성 충돌**: 주황 바(#F59E0B) 위 "준비 N개월" 글자도 오렌지로 바뀌어 동일색으로 묻힘(준비5개월·준비2개월). 사용자 지시 그대로 반영한 상태이며, 화면 확인 후 추가 조정 예정.
>
> ---

> ## v42.4.1 변경 사항 (2026-06-04) — 시뮬레이터 패널 글자색 보색·고대비 적용 (황금비 명도대비)
>
> **문제**: v42.4.0에서 폰트는 키웠으나, 일부 글자가 배경 대비 약했음. ① 회색 평가바(#94A3B8) 위 흰 글자 "평가 N개월"이 흐림 ② 흰 배경 위 CCRA평가일수/약N개월/절감/평가실적이 연회색(slate-500/600, #64748B)이라 약함 ③ 어두운 헤더 위 부제목 흐림.
>
> **해법 (배경별 보색 + 황금비 명도대비 φ≈1.618):**
> 1. **회색 평가바 위 "평가 N개월"**: 흰색 → **#0F172A(진남색)** = 회색의 보색 방향 고대비 + 흰 그림자. (주황·파랑 바 위 글자는 흰색 유지 + 그림자 0.45→0.55 강화, font-bold→extrabold)
> 2. **흰 배경 흐린 글자 진하게**: CCRA평가일수 `slate-600→#1E293B`, 약N개월 총계 `slate-500→#334155 extrabold`, 약N개월절감 `slate-600→#334155 semibold`, 223건 평가실적 `#64748B→#334155 semibold`, 사전준비 `slate-800→#1E293B`.
> 3. **어두운 헤더 부제목**: `slate-300→#A5D8F3(밝은 청록)` = 네이비 배경 보색계로 또렷.
> 4. **캐시 `v42.4.0→v42.4.1`**.
>
> **검증(Playwright 1920px)**: 회색바 "평가 4개월" 진남색 전환 확인, 흰배경 글자 #334155/#1E293B 3+개소 적용 확인, 레이아웃 정상. ⚠️ 모바일 추가 확인 후 미세조정 가능.
>
> ---

> ## v42.4.0 변경 사항 (2026-06-04) — 시뮬레이터 패널 가독성 개선 (황금비 폰트 스케일 + 단계 컬러)
>
> **문제**: 히어로 우측 "KOIST와 함께라면 평가기간을 대폭 단축합니다" 시뮬레이터 패널의 텍스트 16개 중 9개가 12px 미만(최악 8px)으로 가독성 붕괴. 특히 ① 미흡/보통/양호/우수(8px) ② 평균단축·약N개월절감·원스톱(9px) ③ 슬라이더 1/100 눈금(9px) ④ 사전준비 라벨(11px)이 너무 작아 안 보임. (참고: "사전준비" 라벨은 삭제된 게 아니라 너무 작아 안 보였던 것 — 소스·프로덕션 모두 정상 존재 확인)
>
> **해법 (home.tsx 시뮬레이터 패널 L822~921, 황금비 φ≈1.618 타이포 스케일):**
> 1. **미흡/보통/양호/우수**: 8px→13px, 글자에 **단계 컬러 적용**(미흡=#EF4444 / 보통=#F59E0B / 양호=#10B981 / 우수=#3B82F6) + `font-semibold`. 점 크기 4→6px.
> 2. **사전준비 라벨**: `0.7→0.98rem`, `slate-700→slate-800`, 아이콘 10→14px.
> 3. **약 N개월 절감·원스톱**: `0.58→0.8rem`, `slate-500→slate-600 font-medium` (가장 안 보이던 텍스트 대비 강화).
> 4. **슬라이더 1/100 눈금**: 9→12px, `slate-400→slate-500`, weight 600→700.
> 5. **탭(전체평균/EAL2~4)**: `0.68→1.0rem`. **50% 뱃지**: `0.65→0.92rem`. **평균단축 라벨**: `0.58→0.78rem slate→blue-200`.
> 6. **패널 제목**: `0.95→1.18rem`(H1). **약N개월 총계**: `0.77→1.05rem`(H2). **CCRA·KOIST 라벨/바 안 준비·평가**: `0.68→0.95rem`. **부제목**: `0.72→0.86rem slate-400/80→slate-300`. **결과 strip(준비·평가·223건)**: `0.62→0.85rem` + 아이콘 7→11px.
> 7. **clamp 최대값(8K용)은 전부 유지** → 모바일·일반 화면만 커지고 8K 영향 없음.
> 8. **캐시 `v42.3.2→v42.4.0`**.
>
> **검증(Playwright)**: 1920px·390px 모두 패널 렌더 정상, 단계 컬러(#EF4444/#F59E0B/#10B981/#3B82F6) 적용 확인, 사전준비 라벨 또렷, 레이아웃 깨짐 없음. ⚠️ 모바일에서 "사전준비" 라벨이 슬라이더 트랙과 약간 근접(사용자 화면 확인 후 추가 조정 예정).
>
> ---

> ## v42.3.2 변경 사항 (2026-06-03) — GNB↔히어로 우측끝 정렬 (옵션 1, 2.5K+ 메뉴 오버플로 해소)
>
> **문제**: GNB 중심 좌측(KOIST소개↔시뮬레이터)은 모든 해상도 0px 정렬됐으나, **우측(고객지원↔히어로 텍스트영역)에 빈 공간** 발생. 측정 결과 1920px 68px, **2560px 310px, 3840px 588px**로 해상도가 커질수록 폭증. 원인 = `.gnb-nav-inner`(fluid-container, 컨테이너 폭 정상)와 hero `.fluid-container`는 **이미 동일**했으나, 2.5K+ `.gnb-link` 폰트 확대(1.28~2.24rem)로 **11개 메뉴 총폭이 컨테이너를 270~548px 초과** → 마지막 항목 '고객지원'이 컨테이너 우측 패딩 경계를 넘어 오버플로.
>
> **옵션 1 해법 (GNB↔hero grid 컨테이너 우측 경계 통일):**
> 1. **`.gnb-nav-inner`**: `flex-wrap:nowrap` 추가 + `width:100%` 금지 명시(컨테이너 폭 깨짐 방지). fluid-container의 `width:var(--container-max)` 그대로 유지.
> 2. **기본 `.gnb-link`**: 폰트 상한 `1.104rem→1.02rem`, padding `clamp(0.16,0.4vw,0.56)→clamp(0.1,0.28vw,0.44)rem` 축소 → 1920px 28px 오버플로 제거.
> 3. **`.gnb-sep`**: 간격 `clamp(2,0.3vw,6)→clamp(1,0.2vw,4)px` 축소.
> 4. **2.5K/4K/8K `.gnb-link` 폰트 대폭 완화** (컨테이너 폭 대비 안전 vw 비례 clamp): 2.5K `1.28~1.68→1.04~1.18rem`, 4K `1.68~2.24→1.18~1.42rem`, 8K `2.56~3.6→1.42~2.0rem`. padding/sep도 각 구간 비례 축소.
> 5. **캐시 `v42.3.1→v42.3.2`**.
>
> **검증(Playwright 단일뷰포트, 트래커/이미지 차단)**: GNB '고객지원' 우 = 히어로 grid 우 갭 → **1440/1920/2560/3840px 모두 0px**(좌측도 0px 유지). 8K(7680px)는 GNB↔grid 0px(2480/5200) 정렬 — hero 카드 내부 요소의 ±100px overflow는 8K clamp 상한 보존 정책상 의도된 동작(옵션1 범위 밖). 모바일 390px: 가로 오버플로 0, 1열 스택 정상, 데스크탑 GNB 메뉴 숨김(모바일 무영향). **8K 기준 + cm 고정값 없는 반응형(clamp/%/vw/fr)** 유지.
>
> ---

> ## v42.3-C 변경 사항 (2026-06-03) — 연락처 카드 우측 정렬 (빈 공간 제거, 옵션 A)
>
> **문제**: v42.3-B에서 배지·H1·버튼은 GNB '고객지원' 끝선(1371px@1440)에 정렬됐으나, **연락처 카드만 `max-width:480px` 고정**이라 부모(텍스트영역 570px)를 못 채우고 우측에 빈 공간 발생(1440px=90px, 1920px=114px). 화면이 넓을수록 공백 증가.
>
> 1. **연락처 카드 `max-width:480px → width:100%`** (L1095): 부모 폭 100% 채움 → 카드 우측끝을 GNB '고객지원'에 정렬.
> 2. **2.5K 오버라이드 `max-width:794px → width:100%; max-width:none`** (L1195): 일관성.
> 3. **모바일(`max-width:94%`)은 유지**: 1열 스택 시 중앙 정렬 보존.
> 4. **캐시 `v42.3 → v42.3.1`**.
>
> **검증(데스크탑 1280/1440/1920 + 모바일 390)**: 카드 우측 빈공간 1440px **90px→0px**, 1920px **114px→0px**. 카드 폭 480px→570px(@1440, 부모 100%). 라벨 여전히 1줄. 모바일 1열 스택 정상, 가로 오버플로 0. 연락처 4종(FAX/주소 등) 카드가 넓어져 가독성↑.
>
> ---

> ## v42.3-B 변경 사항 (2026-06-03) — 히어로 "황금비 균형안"
>
> **디자인 의도**: 우측 텍스트/연락처 영역 강화 + 좌측 시뮬레이터 슬림화 + 평가바 글자 겹침 해소. 사용자 요청 8건을 디자이너 관점에서 시각 위계·반응형을 지키도록 절충(B안).
>
> 1. **그리드 비율** `62fr 38fr → 55fr 45fr`: 시뮬레이터 785px→697px(−2.3cm), 텍스트 481px→570px(+2.4cm). ①+3cm·②−2cm 중간값 채택. 우측끝 1371px(=GNB 고객지원) 유지.
> 2. **배지(로고+텍스트) ×1.25**: 로고 `clamp(20,1.47vw,56)→clamp(25,1.84vw,70)px`, 텍스트 `clamp(0.68,0.73vw,3.5)→clamp(0.85,0.91vw,4.375)rem`. (요청 ×1.5 → H1 위계 보호 위해 ×1.25 절충)
> 3. **H1 제목 ×0.85**: `clamp(1.38,1.32vw,6.3)→clamp(1.17,1.12vw,5.36)rem`. (요청 ×0.8 → 주인공 지위 유지 위해 ×0.85 절충)
> 4. **평가바 글자 ×0.75 + nowrap**: 바 내부 준비/평가개월 `clamp(0.9,1.02vw,4.875)→clamp(0.68,0.77vw,3.66)rem`, 총개월 `clamp(1.02,1.095vw,5.25)→clamp(0.77,0.82vw,3.94)rem`. 겹침 완전 해소(gap 399px).
> 5. **연락처 카드 폭 ×1.26**: `max-width 380→480px`. 라벨 한줄 수용.
> 6. **연락처 라벨 ×1.2 + 한줄**: `clamp(0.68,0.73vw,3.5)→clamp(0.82,0.88vw,4.2)rem` + `white-space:nowrap`(데스크탑 1줄, 모바일은 줄바꿈 허용).
> 7. **연락처 4종 ×1.1 + 아이콘 비례**: item `clamp(0.62,0.78vw,0.81)→clamp(0.68,0.86vw,0.89)rem`, 아이콘 `clamp(19,1.86vw,27)→clamp(21,2.05vw,30)px`.
> 8. **반응형 동반**: 모바일/태블릿/2.5K 미디어쿼리 전부 비례 동기화. 캐시 `v42.2→v42.3`.
>
> **검증(데스크탑 1440 + 모바일 390)**: 시뮬레이터 좌69/우765/697px, 텍스트 우1371px=고객지원 1371px(차이 0px), 밑단 609px 일치. 연락처 카드 480px(부모 570px 내 안전), 라벨 1줄(nowrap). 평가바 prep우145/eval좌544(gap 399px, 겹침0). 모바일 1열 스택 정상(텍스트→연락처→시뮬레이터), 가로 오버플로 없음, 라벨 넘침 없음. **8K clamp 상한 + cm 고정값 없는 반응형(fr/clamp/vw)** 유지.
>
> ---

> ## v42.2 변경 사항 (2026-06-03)
>
> **히어로 좌우 카드 교체(권장안)**: 원스톱(시뮬레이터) 카드를 **좌측**으로, 텍스트 카드를 **우측**으로 교체. 히어로 전체 우측 끝선(1371px="원"자)은 그대로 유지하여 GNB 폭과의 균형 보존.
>
> 1. **그리드 비율 교체**: `.unified-hero-grid` `grid-template-columns: 38fr 62fr → 62fr 38fr` (1열=원스톱 62fr 좌측 / 2열=텍스트 38fr 우측).
> 2. **order 교체**: 원스톱(`.unified-hero-right`) `order:2→1`(좌측, 시작선 69px), 텍스트(`.unified-hero-left`) `order:1→2`(우측, 끝선 1371px). CSS Grid+order 상호작용으로 order 낮은 항목이 첫 트랙(62fr) 점유.
> 3. **AOS 방향 교체**: 원스톱 `fade-left→fade-right`(좌측 진입), 텍스트 `fade-right→fade-left`(우측 진입).
> 4. **캐시 버전** `v42.1 → v42.2`.
>
> **검증(데스크탑 1440 + 모바일 390)**: 원스톱 좌측 시작=69px, 텍스트 우측 끝=1371px = 고객지원 우측 끝 1371px → **차이 0px**. 두 카드 밑단 621px 일치(차이 0px). 모바일 1열 스택(텍스트 위→원스톱 아래, 동일폭 326px) 정상. **8K clamp 상한 유지 + cm 고정값 없는 반응형(fr/clamp/vw)** 유지.
>
> ---

> ## v42.1 변경 사항 (2026-06-03)
>
> **디자인 보정(시나리오 A)**: 원스톱(시뮬레이터) 카드를 화면 **우측**으로 이동시켜 그 우측 끝선을 `fluid-container` 우측 끝(=GNB "고객지원"의 "원"자 끝선, **1371px @1440**)에 정확히 정렬 → 히어로 좌우 균형 확보.
>
> 1. **좌우 배치 고정(원스톱 카드 우측 이동)**: `.unified-hero-grid`의 `grid-template-columns: 62fr 38fr → 38fr 62fr`. CSS `order`를 조건부 로직 없이 **하드코딩**(`.unified-hero-left{order:1}` = 텍스트 좌측 38fr / `.unified-hero-right{order:2}` = 원스톱 우측 62fr).
> 2. **`hero_layout_swap` 설정 의존 제거**: DB `site_settings.hero_layout_swap` 값이 더 이상 히어로 레이아웃에 영향을 주지 않도록 `heroLayoutSwap` 변수와 `order` 조건부 분기를 전부 제거(레이아웃 결정성 확보).
> 3. **AOS 애니메이션 고정**: 텍스트 카드 `fade-right`, 원스톱 카드 `fade-left`로 고정.
>
> **검증**: 원스톱 카드 우측 끝 = 1371px, GNB "고객지원"("원"자) 우측 끝 = 1371px → **차이 0px(완벽 정렬)**. 데스크탑(1440)·모바일(390) Playwright 스크린샷 검증 완료. 8K 화질·반응형 제약 유지.
>
> ---

> ## v42.0 변경 사항 (2026-06-03)
>
> **사용자 요청 4건 + 슬라이드 축소**: 히어로 카드 균형/정렬 미세 조정.
>
> 1. **슬라이드 섹션 세로 10% 축소**: 시뮬레이터 카드 내 준비도 슬라이더 박스의 상하 패딩(`0.5rem→0.45rem`)·하단 마진(`0.6rem→0.54rem`)·트랙 높이(`30px→27px`)·레벨 dot 상단 마진 ×0.9. 좌우 폭은 유지.
> 2. **우측 텍스트 카드 하단 정렬**: `.unified-hero-grid { align-items: start → stretch }` + 연락처 카드 `margin-top:auto` → 짧은 텍스트 카드가 시뮬레이터 카드 하단까지 늘어남. **두 카드 밑단 621px 정확히 일치**(@1440).
> 3. **보조 텍스트 크기 통일(h1 제외)**: 배지(`1.242rem→0.68rem`)·CTA 버튼 2개(`0.966rem→0.68rem`)·연락처 라벨을 모두 "전체평균" 탭 크기 `clamp(0.68rem,0.73vw,3.5rem)`로 통일. **h1 "IT제품 보안성…"은 그대로 유지**.
> 4. **원스톱(시뮬레이터) 카드 우측 끝선 확장**: `grid-template-columns: 55fr 45fr → 62fr 38fr`. 히어로 전체 우측 끝선(1371px @1440)이 GNB "고객지원" 끝선과 정확히 일치.
> 5. **푸터 전화 카드 한 줄 표시**: 카드 폭 `col-span-2→3`(회사정보 5→4로 양보, 12컬럼 총합 유지) + 전화번호 폰트 50% 축소(`--text-2xl`~26px → `clamp(0.775rem,…,1.075rem)`~13px) + `white-space:nowrap` → "02-586-1230" 한 줄 표시.
>
> **공통 제약 유지**: 8K 화질(clamp 상한 유지) + 윈도우/모바일 반응형(cm 고정값 없음). 데스크탑(1440)·모바일(390) Playwright 검증 완료.
>
> ---

> ## v41.0 변경 사항 (2026-06-03)
>
> **사용자 요청 4건**: ①테스트부서 완전 삭제 ②GNB 글자 20% 축소 ③히어로 슬라이드·원스톱 카드를 GNB 폭에 균형 배치 ④카드 아이콘 옵션②(투명 배경) + 이미지 전체 복구. **공통 제약**: 8K 화질 유지 + 윈도우 리사이즈/모바일 반응형 연동.
>
> **변경 내용 (8단계)**:
> 1. **테스트부서 완전 삭제** (`migrations/0059`): `departments`·`dep_pages`에서 `test-dept` 삭제 → DB 기반(`is_active=1`)이라 GNB·카드 등 전 페이지에서 자동 소멸. 9개 부서 잔존.
> 2. **GNB 글자 20% 축소**: 모든 `.gnb-link` clamp 값 ×0.8 (전 구간 + 2560/3840/7680px 4K/8K 브레이크포인트). 1440px=17.088px, 클리핑 없음.
> 3. **헤더 정렬**: KOLAS/전화 cm 고정값 제거, TOP BAR·GNB를 `fluid-container`로 통일. `.gnb-nav-inner`의 `width:100%` 제거 → KOLAS·KOIST소개 좌측 기준선 **완전 일치**(69px @1440).
> 4. **히어로 GNB폭 정렬**: 히어로 cm 오프셋 전면 제거(`+7cm`/`+2.5cm`/`-1.5cm`/CTA `1.2cm`/contact-card `+1cm` → clamp·%·fr 반응형). `grid-template-columns: 55fr 45fr`. 히어로 그리드 좌우 끝(69~1371)이 GNB 전체 폭과 일치.
> 5. **이미지 전체 복구** (`migrations/0060`): 깨진 `/api/images/legacy/sh_page/img/*`(23) + `/api/images/legacy-icons/*`(11) → `/static/images/legacy/*` (kolas는 별도 경로). 남은 깨진 URL 0개, 전부 HTTP 200. (모든 원본 파일 존재 → AI 재생성 불필요)
> 6. **카드 아이콘 옵션②**: 9개 `dept-icon`(1024² 8K급)의 흰 배경을 flood-fill로 투명화(가장자리 연결 흰색만 제거, 내부 디테일 보존) + 통일된 라이트톤 박스(`.card-icon-box`)로 일관화. `object-cover`→`object-contain`.
> 7. **하단 섹션 정렬선 통일**: services/공지사항/평가현황/CTA가 모두 `fluid-container` 사용 → 히어로와 동일한 좌우 기준선(L=32, R=1408 @1440 / L=16,R=374 @390) 자동 통일. (STEP4의 결과로 자동 달성)
> 8. **반응형·8K 검증**: 데스크탑(1280/1440/1920) + 모바일(390) Playwright 측정·스크린샷 검증 완료.
>
> ---

> ## 🆕 v40.5 변경 사항 (2026-06-02 배포 완료, deploy `6d9285d6`)
>
> **사용자 피드백**: 전체 평가현황(`/support/progress`)에서 사업분류 배지와 제품명이 붙어 보여 구분이 어려움
>
> **변경 내용** (B안 — 반응형 비대칭 padding):
> - **사업분류 배지**: 가운데 정렬 → **왼쪽 정렬**(`text-left`)로 모음
> - **제품명 컬럼**: 반응형 비대칭 padding `pl-3 sm:pl-10 pr-3`
>   - 모바일(<640px): 왼쪽 **12px** (제품명 표시 공간 보존)
>   - 데스크톱(≥640px): 왼쪽 **40px** (사업분류와 명확히 분리) / 오른쪽 12px
> - **모바일 대응**: 좁은 화면에서 과한 여백 자동 축소 → 제품명 잘림 방지
> - **적용 범위**: 전체 평가현황 + 사업별 progress 페이지 일관 적용
>
> ---


**(주)한국정보보안기술원** 공식 웹사이트 — **koist.kr 원본 디자인 완전 복제** (Scoped Legacy Theme) + **개인정보보호법 완전 준수 4-Phase 업그레이드** + **평가현황 카테고리 통합 관리** + **연청(라이트블루) 동적 테마 & 관리자 디자인 관리** + **S/W 시험현황(기타시험평가) 신설 & 4+1 홈카드**

---

> ## 🆕 v40.4 변경 사항 (2026-06-02 배포 완료, deploy `9e335924`)
>
> **사용자 요청**: 시험성적서 사업 아래 "S/W 시험현황" 페이지 신설(`기타시험평가` 카테고리), 홈 평가현황을 4+1 구조로 완성, 회사명 검색 추가, 사업별 검색 분리, 자료실 연계
>
> **변경 내용**:
> - **신규 페이지**: `/services/certificate/etc-test` — **S/W 시험현황** (컬럼: 제품유형/운영체제/개발사, 성능평가와 동일)
> - **상태 데이터 카테고리**: `기타시험평가` (자유 텍스트 카테고리로 admin progress CRUD 그대로 사용)
> - **홈 4+1 카드**: 4개 메인(CC평가·보안기능시험·암호모듈검증·성능평가) + **기타** 카드(항상 노출, 0건이어도 표시) → 클릭 시 `/services/certificate/etc-test`
> - **회사명 검색**: 전역(`/support/progress`) + 사업별(`/services/:slug/progress`) + S/W시험현황 모두 `product_name OR company` LIKE 검색 (플레이스홀더 "제품명·회사명 검색...")
> - **사업별 검색 분리(버그 수정)**: 기존 `whereClause='1=1'`로 전 사업 데이터가 섞이던 문제를 `category = dept.name` 스코핑으로 해결
> - **자료실 연계(Option A)**: 카테고리 기반 느슨한 연결 — `downloads.category = '기타시험현황'` 자료가 S/W 시험현황 페이지 하단 "관련 자료실"에 자동 노출
> - **sanitizeHtml 우회(핵심 수정)**: `renderPageContent()` 헬퍼 추가 — `progress`/`etc-test` 동적 슬러그는 검색 폼(form/input/select)이 strip되지 않도록 신뢰된 원본 그대로 렌더
> - **관리자**: `admin-progress.js`에 `기타시험평가` 카테고리 드롭다운 + 메타(제품유형/운영체제/개발사) 추가
>
> **DB 마이그레이션**: [`migrations/0058_etc_test_status.sql`](migrations/0058_etc_test_status.sql) — etc-test dep_pages(시험성적서 dept_id=5) + 샘플 progress_item
>
> **상세 분석 보고서**:
> - [`docs/ANALYSIS_progress_4plus1_and_search.md`](docs/ANALYSIS_progress_4plus1_and_search.md)
> - [`docs/ANALYSIS_v2_sw_test_status_and_search.md`](docs/ANALYSIS_v2_sw_test_status_and_search.md)
> - [`docs/ANALYSIS_v3_FINAL_etc_test_and_admin.md`](docs/ANALYSIS_v3_FINAL_etc_test_and_admin.md)

---

> ## 🆕 v40.2 변경 사항 (2026-06-02 배포)
>
> **사용자 피드백**: 보안기능시험 시험현황 페이지에서 "정보보호시스템" 같은 긴 등급명이 좁은 컬럼에 잘려서 옆 구분 컬럼과 겹쳐 보이는 문제
>
> **변경 내용**:
> - **등급 컬럼**: 90px → **220px** (사용자 결정 Option B)
> - **구분 컬럼**: 88px → **140px**
> - **min-width**: 680px → **820px** (제품명 영역 보호)
> - **별칭 매핑** 4건 적용 (DB 원본 보존, `title` 호버 시 원본 표시):
>   - 안티바이러스 제품 (Mobile) → **안티바이 제품 (Mobile)**
>   - 안티바이러스제품(Linux) → **안티바이 제품 (Linux)**
>   - 소스코드 보안약점 분석도구 → **소스코드 보안약점도구**
>   - 모듈형 안티바이러스 제품 → **모듈형 안티바이 제품**
>
> **영향 범위**: 10개 부서 progress 페이지 + `/support/progress` 전체 평가현황 (총 222건 데이터)
>
> **상세 분석 보고서**: [`docs/V40_2_COLUMN_WIDTH_FINAL_ANALYSIS_20260602.md`](docs/V40_2_COLUMN_WIDTH_FINAL_ANALYSIS_20260602.md)

---

> ## 🏢 사무실에서 작업 이어가기 (Quick Start)
>
> **현재 상태**: v40.4 — S/W 시험현황(기타시험평가) 신설 + 4+1 홈카드 + 회사명 검색 + 사업별 검색 분리 + 자료실 연계 ✅ **Cloudflare Pages 배포 완료 (2026-06-02, deploy `9e335924`)** / `main` 푸시(`39e6325`) / 원격 D1 마이그레이션 0058 적용 / 운영 도메인 koist.ai.kr 적용 확인
> **직전 배포**: v40.3 — 연청 테마 + 관리자 디자인 관리 + 푸터 가독성(A안) ✅ Cloudflare Pages 배포 완료 (2026-06-02, deploy `a16cfc35`) / 운영 도메인 koist.ai.kr·www.koist.kr 적용 확인
>
> ```bash
> git pull origin main       # 최신 코드 가져오기
> npm install                # 의존성
> npm run build              # 빌드
> pm2 start ecosystem.config.cjs   # 로컬 실행 (port 3000)
> ```
>
> **반드시 읽을 문서** (총 30분):
> 1. 🆕 [`docs/V40_2_COLUMN_WIDTH_FINAL_ANALYSIS_20260602.md`](docs/V40_2_COLUMN_WIDTH_FINAL_ANALYSIS_20260602.md) — **v40.2 컬럼 폭 분석** ⭐
> 2. 📌 [`docs/HANDOFF_OFFICE_20260601.md`](docs/HANDOFF_OFFICE_20260601.md) — 사무실 인수인계
> 3. ✅ [`docs/V40_1_FINAL_VERIFICATION_REPORT_20260601.md`](docs/V40_1_FINAL_VERIFICATION_REPORT_20260601.md) — v40.1 정리 완료 검증
>
> **⚠️ 다음 JS/CSS 변경 시 반드시**: `src/index.tsx`의 `?v=40.4` → 다음 버전으로 증가시킬 것!
> (캐시 무효화, 잊으면 사용자 화면에 변경사항 안 보임)

---

## URLs
- **Production**: https://koist-website.pages.dev (메인)
- **로컬 개발**: https://3000-i0chksvz2v05lxmcn60fh-3c7ff1b5.sandbox.novita.ai (port 3000, PM2)
- **v40.4 (Latest)**: S/W 시험현황(`기타시험평가`) 신설 `/services/certificate/etc-test` + 홈 4+1 카드(기타 항상 표시) + 회사명 검색 + 사업별 검색 분리 + 자료실 연계(Option A, 카테고리 `기타시험현황`)
- **v40.3**: 연청(라이트블루) 동적 테마 + 관리자 디자인 관리 + 상담문의 5가지 디자인 개선
- **v40.2**: 평가현황/시험현황 등급·구분 컬럼 폭 확대 + 별칭 매핑 + 상담문의 폼 개선(동의 기본체크/링크 한줄/입력창 가독성)
- **v40.1**: 평가현황 UI 미세조정 (table-fixed + colgroup 30% + text-lg 1.5배 + 캐시 무효화)
- **v40.0**: 평가현황 카테고리 통합 + departments 동적 로딩 + 4+1 카드 UI + 하이브리드 매트릭스
- **v39.32**: 응급 백업/복원 + GFS 보존 정책 (비대칭 안전 UX)
- **v39.31**: 외부 cron 백업 자동화 (`/api/cron/backup` 토큰 인증 엔드포인트)
- **v39.30**: 엑셀 스타일 문의 관리 + 마스킹 + Excel/CSV 내보내기 + SheetJS
- **v39.29**: 개인정보처리방침(/privacy) + Soft Delete + 감사 로그
- **v39.28**: 자동 백업 시스템 (Cron + R2 + 관리자 UI)
- **v39.27**: 개인정보 수집·이용 동의 체크박스 + API 검증
- **v39.23**: /services/readiness 깨진 p40 이미지 6개 처리 (FontAwesome 대체)
- **v39.22**: 레거시 이미지 12종 → 10개 서비스 페이지 삽입
- **v39.21**: HERO/SIM 위치 미세조정 + SIM 반투명도 HERO 동기화
- **v39.20**: HERO↔SIMULATOR 좌우 교체 + 시뮬레이터 패널 70% 불투명 (Glassmorphism)
- **Latest Deploy**: https://1c8cd969.koist-website.pages.dev (v39.7 — 원본 디자인)
- **Previous (v39.6)**: https://4666afa7.koist-website.pages.dev (콘텐츠 마이그레이션)
- **Previous (v39.5)**: https://dab84020.koist-website.pages.dev (슬라이더 폰트)
- **GitHub**: https://github.com/wwwkoistkr/HOMEPAGE
- **관리자**: /admin
- **사업분야 관리**: /admin/departments (v39.7에서 **원본 디자인 토글** + 영문 서브타이틀 + WYSIWYG)
- **슬라이더 UI 설정**: /admin/slider-settings (v39.4)
- **백업 관리**: /admin/backups (v39.28 — 수동 백업, 복원, 검증)
- **외부 Cron 엔드포인트**: `/api/cron/backup?type=daily|weekly|monthly` (v39.31 — 토큰 인증, cron-job.org 연동)
- **Cron Ping**: /api/cron/ping (인증 불필요, 연결 확인용)
- **상담문의 관리**: /admin/inquiries (v39.30 — 엑셀 스타일, 마스킹, 내보내기)
- **개인정보처리방침**: /privacy (v39.29)
- **응급 백업 버튼**: 모든 /admin 페이지 우측 상단 (v39.32 — 1클릭 즉시 백업)
- **자동 정리 엔드포인트**: `/api/cron/cleanup?token=...` (v39.32 — GFS 보존 정책)
- **디자인 테마 관리**: /admin/background-media → "디자인 테마 (연청 컬러)" 섹션 (v40.3 — 전역/GNB/헤더/푸터/입력창/상담문의 레이아웃 컬러·치수 편집)
- **상담문의 폼**: /support/inquiry (v40.3 — 헤더 배너 30% 축소 + 타이틀 폼카드 통합 + 연청 입력창)

---

## 🎨 v40.3 — 연청(라이트블루) 동적 테마 + 관리자 디자인 관리 (2026-06-02)

### 핵심 철학: **하드코딩 컬러 제거 → 단일 진실 공급원(site_settings) 기반 동적 테마**
> 이전(v40.2): 관리자 색상 UI는 있으나 CSS에 색상이 **하드코딩**되어 저장해도 화면 미반영 (두 세계 단절)
> v40.3: `layoutCSS(settings)` → `themeVars()`가 `:root`에 **CSS 변수 주입** → 관리자가 저장한 색상이 즉시 전역 반영

### ① 동적 테마 엔진 (`src/templates/partials/layout-css.ts`)
- `themeVars(settings)` 헬퍼 신규: site_settings 값을 검증 후 CSS 변수로 변환
- **CSS 인젝션 방지**: 색상값을 `#hex` / `rgb(a)` / 영문 컬러명 화이트리스트 정규식으로 검증, 미통과 시 연청 기본값 폴백
- `layoutCSS()` → `layoutCSS(settings?)` 시그니처 변경, `:root`에 `${themeVars(settings)}` 주입
- `.gnb-nav-bar`, `.input-premium` 모두 하드코딩 → CSS 변수(연청) 사용

### ② DB 마이그레이션 (`migrations/0056_v403_lightblue_theme_settings.sql`)
- **`INSERT OR IGNORE`로 신규 키 사전 생성** (관리자 PUT API가 `UPDATE`-only이므로 키가 미리 존재해야 저장 가능)
- 연청 팔레트 기본값:
  | 키 | 기본값 | 용도 |
  |---|---|---|
  | `theme_primary` / `accent_color` / `theme_cyan` | `#2563EB` / `#3B82F6` / `#06B6D4` | 전역 포인트 컬러 |
  | `gnb_bar_color1/2` | `#2563EB` / `#3B82F6` | GNB 메뉴바 그라데이션 |
  | `page_header_color1/2/3` | `#1E3A8A` / `#2563EB` / `#3B82F6` | 페이지 헤더 배너 |
  | `page_header_height_scale` | `0.3` | 헤더 배너 높이 비율(30%) |
  | `footer_color1/2` | `#1E3A8A` / `#1E40AF` | 푸터 그라데이션 |
  | `input_bg/border/focus_color` | `#F0F7FF` / `#BFDBFE` / `#3B82F6` | 입력창 연청 톤 |
  | `inquiry_section_pad_scale` | `0.7` | 상담문의 섹션 상하 패딩(70%) |
  | `inquiry_max_width` | `1200` | 상담문의 좌우 폭(px) |

### ③ 5가지 디자인 개선
1. **페이지 헤더 배너**: 높이 30% 축소(`page_header_height_scale`) + 타이틀을 폼 카드(흰 카드) 내부로 통합 (모던 레이아웃, 아이콘 그라데이션)
2. **`main` padding-top**: `var(--gnb-h)` **의도적 미변경** (레이아웃 깨짐 방지)
3. **상담문의 섹션**: 상하 패딩 ~30% 축소 + 좌우 `max-width 1200px`로 ~50% 확장
4. **푸터**: 하단 밀착(`margin-top:0`) + 다크네이비 → 연청 그라데이션 (전역 톤 변경)
5. **입력창**: 연청 틴트(`#F0F7FF`) + `color-mix` 기반 focus glow 강화

### ④ 관리자 디자인 관리 UI (`src/templates/admin/background-media.tsx`)
- 기존 배경/미디어 페이지에 **"디자인 테마 (연청 컬러)"** 섹션 추가
- 6개 하위 그룹: 전역 포인트 / GNB 메뉴바 / 페이지 헤더 배너(+높이) / 푸터 / 입력창 / 상담문의 레이아웃(패딩·폭)
- 기존 `setting-input` / `data-key` / `data-color-for` 패턴 재사용 → 기존 로드/저장/컬러피커 동기화 로직 그대로 작동

### 변경 파일 (5)
| 파일 | 변경 |
|---|---|
| `src/templates/partials/layout-css.ts` | `themeVars()` 추가 + `layoutCSS(settings)` + 연청 CSS 변수 |
| `src/templates/layout.tsx` | `layoutCSS(s)` 호출 + 푸터 변수화/하단밀착 (main padding 미변경) |
| `src/templates/pages.tsx` | `pageHeader()` 높이 스케일 + `inquiryPage()` 패딩/폭/타이틀 통합 |
| `src/templates/admin/background-media.tsx` | "디자인 테마" 관리 섹션 |
| `migrations/0056_v403_lightblue_theme_settings.sql` | 신규 테마 키 INSERT OR IGNORE |

### 검증 결과
- `npm run build` SUCCESS (`dist/_worker.js 506.38 kB`)
- migration 0056 적용 완료 (로컬 17 commands)
- 렌더 HTML에 DB 테마 변수 주입 확인: `--page-header-c1: #1E3A8A`, `--gnb-bar-c1: #2563EB`, `--input-bg: #F0F7FF`
- `/support/inquiry`, `/` HTTP 200 (콘솔 에러는 Google Ads CSP 차단 무관)

---

## 📊 v40.0 — 평가현황 카테고리 통합 + 동적 관리 (2026-06-01)

### 핵심 철학: **단일 진실 공급원 (Single Source of Truth)**
> **"departments 테이블이 평가현황의 모든 카테고리·UI·옵션을 정의한다"**
>
> 기존: JS 하드코딩 `CATEGORIES` 상수 ⨯ DB `departments` 테이블 → **Two Worlds 문제**  
> v40.0: DB `departments` 단일 소스 → **JS는 fetch 후 렌더링만 담당**

### ① DB 마이그레이션 (`0055_v40_unify_categories.sql`)
- `departments`에 두 컬럼 추가:
  - `progress_meta TEXT DEFAULT '{}'` — 카테고리별 UI 메타 (컬럼명/옵션) JSON
  - `is_main_progress INTEGER DEFAULT 0` — 4대 주요 카테고리 표시 플래그
- **이름 통일**: `보안기능 시험` → `보안기능시험`, `암호모듈 검증시험` → `암호모듈검증`
- **4대 주요 카테고리** (`is_main_progress=1`): CC평가 · 보안기능시험 · 성능평가 · 암호모듈검증
- 각 카테고리에 컬럼명/옵션 메타 JSON 저장 (예: CC평가 → `{col2:"보증등급", col2Opts:[...], statusOpts:[...]}`)

### ② 평가현황 UI: 4+1 카드 + 하이브리드 매트릭스
**카드 그리드** (`grid-cols-2 sm:grid-cols-3 md:grid-cols-6`):
- 전체 + 4대 카테고리 카드 + **기타 그룹** (= 6장)
- 각 카드에 미니 매트릭스 표시: `접수 N · 진행 N · 완료 N`
- 클릭 시 해당 카테고리 필터링

**상세 매트릭스 표** (별도 섹션):
- 카테고리별 접수/진행/완료 + **비율 진행바**
- 상태 정규화: `'완료'` 포함 → 완료 / `'진행'` 포함 → 진행 / 그 외 → 접수

### ③ Q1: 제품명·업체 정보 강조 (1.33배)
- 제품명 · 업체를 **한 줄로 통합** (`text-base font-semibold`)
- 등급/구분/유형은 기존 크기 유지 → **자연스러운 시각 위계**
- 업체명은 회색(`text-gray-500 font-normal`) 처리하여 제품명 강조

### ④ 관리자 모드 통합 편집 (admin-departments.js)
사업분야 편집 시 **평가현황 메타까지 한 화면에서 관리**:
- ✅ `is_main_progress` 체크박스 — 4대 카테고리 여부
- 📝 `col2/col3/col4` 컬럼명 입력
- 📝 `col2Opts/col3Opts/col4Opts` CSV 입력 (저장 시 자동 배열 변환)
- 📝 `statusOpts` 상태 옵션 CSV
- ✅ `col4FreeText` 체크박스 (자유 텍스트 입력 허용)
- **JSON 안전성**: 서버측 `JSON.parse` 검증 + 클라이언트측 try-catch

### ⑤ Two Worlds 문제 해결
| Before (v39.x) | After (v40.0) |
|----------------|---------------|
| JS `CATEGORIES = {...}` 하드코딩 | `loadDepartments()` API fetch |
| 카테고리 추가 시 코드 수정 | DB UPDATE 1회로 즉시 반영 |
| `보안기능 시험` ≠ `보안기능시험` (오류) | 단일 정규화된 이름 |
| 진행상태 옵션 4종 분산 | `progress_meta.statusOpts` 단일 소스 |

### ⑥ "기타" 그룹 처리
- `mainCategories.indexOf(p.category) < 0` 필터로 4대 외 모든 카테고리 자동 그룹핑
- 데이터 누락 0%, 향후 카테고리 추가 시 자동 흡수

### 변경 파일 (4)
| 파일 | 변경 |
|------|------|
| `migrations/0055_v40_unify_categories.sql` | **신규** — 컬럼 추가 + 이름 통일 + 4대 메타 시드 |
| `src/routes/admin.ts` | PUT/POST `/departments`에 `progress_meta`, `is_main_progress` 필드 추가 + JSON 검증 |
| `public/static/js/admin-departments.js` | v40.0 평가현황 메타 편집 섹션 + `esc()` + CSV→배열 변환 |
| `public/static/js/admin-progress.js` | **완전 재작성** (25KB) — 동적 로딩 + 4+1 카드 + 하이브리드 매트릭스 |

### 검증 결과
- ✅ 로컬 D1 마이그레이션: 10 commands 적용
- ✅ 운영 D1 마이그레이션: 10 commands in 2.99ms
- ✅ 4대 카테고리 모두 `is_main_progress=1`, `progress_meta` JSON 정상
- ✅ `progress_items.category` ↔ `departments.name` LEFT JOIN: NULL 0건 (100% 매칭)
- ✅ 4개 도메인 모두 HTTP 200 (www.koist.ai.kr / koist.ai.kr / koist-website.pages.dev / 541726eb.koist-website.pages.dev)

---

## 🛡️ v39.32 — 응급 백업/복원 시스템 + GFS 보존 정책 (2026-06-01)

### 핵심 철학: **비대칭 UX (Asymmetric Safety)**
> **"백업 버튼은 크고 빨갛게, 복원 버튼은 작고 6번 확인하게"**
>
> 백업은 안전한 작업(읽기 전용) → 자주, 빠르게  
> 복원은 위험한 작업(비가역) → 신중하게, 단계적으로

### ① 응급 백업 (Emergency Backup)
- **위치**: 모든 admin 페이지 우측 상단 헤더 (🛡️ 빨간 버튼, 전역 노출)
- **동작**: 1클릭 → 즉시 `manual` 타입 백업 생성 → 토스트 알림
- **API**: `POST /api/admin/backups/emergency`
- **Rate Limit**: 사용자별 1분 1회 (실수 연타 방지)
- **백업 유형**: 항상 `manual` (무제한 보존, 자동 삭제 안됨)

### ② 표준 복원 (3단계 안전장치)
1시간 이상 지난 백업의 복원에는 다음 3단계 모두 필수:

| 단계 | 확인 방법 | 목적 |
|------|----------|------|
| **STEP 1** | `RESTORE-YYYY-MM-DD` 정확 입력 (날짜 매칭) | 의도성 검증 |
| **STEP 2** | 관리자 비밀번호 재입력 | 신원 재인증 |
| **STEP 3** | 자동 `pre-restore` 백업 생성 (서버측) | 복구 안전망 |

- **API**: `POST /api/admin/backups/:id/restore` (body: `{confirm, password}`)
- **UI**: 진행 단계 인디케이터 (1→2→3) + 색상 변화 피드백
- **잘못된 비밀번호**: 즉시 거부 + 감사 로그 기록 (`status='denied'`)

### ③ 응급 복원 모드 ⚡
- **조건**: 생성된 지 **1시간 이내**인 백업만 가능
- **시나리오**: "방금 큰 실수했다 → 1시간 전 시점으로 즉시 되돌리기"
- **UI**: 1시간 이내 백업에는 ⚡ 응급 복원 버튼 추가 표시
- **안전장치**: 1단계 확인만 (`EMERGENCY-RESTORE` 입력), 하지만 pre-restore 자동 백업은 **절대 생략 안함**
- **API**: 같은 endpoint에 `emergency: true` 플래그 → 서버측 1시간 윈도우 별도 검증

### ④ GFS 보존 정책 (Grandfather-Father-Son)
**개수 기반** 보존으로 일관성 보장:

| 유형 | 보존 개수 | 의미 |
|------|----------|------|
| `daily` | **최근 14개** | 2주 매일 시점 복귀 가능 |
| `weekly` | **최근 8개** | 2개월 주별 시점 |
| `monthly` | **최근 12개** | 1년 월별 시점 |
| `manual` | **무제한** | 사용자 의도 백업 → 절대 자동 삭제 안함 🔒 |
| `pre-restore` | **30일** | 복원 직전 스냅샷 → 1달 후 자동 정리 |

**예상 R2 사용량**: ~3 MB (Manual 제외, 거의 0에 수렴)

### ⑤ 자동 정리 (Cleanup Cron)
- **신규 엔드포인트**: `POST/GET /api/cron/cleanup?token=<CRON_SECRET>`
- **수동 트리거**: admin UI "🧹 지금 정리" 버튼 → `POST /api/admin/backups/cleanup`
- **권장 cron**: 매주 일요일 새벽 5시 (`0 5 * * 0`) — 주간 백업 4시 직후
- **응답 예시**:
```json
{
  "ok": true,
  "totalDeleted": 0,
  "byType": {
    "daily": {"deleted": 0, "kept": 6},
    "manual": {"deleted": 0, "kept": 1, "protected": 1}
  },
  "durationMs": 47
}
```

### 🧪 프로덕션 검증
| 테스트 | 결과 |
|--------|------|
| `GET /api/cron/ping` | ✅ 200 OK |
| `POST /api/cron/cleanup` (no token) | ✅ 401 |
| `POST /api/cron/cleanup` (wrong token) | ✅ 401 |
| `POST /api/admin/backups/emergency` (no auth) | ✅ 401 |
| 로컬 cleanup (실제 실행) | ✅ 200, 47ms, Manual 보호 확인 |

### 📝 신규/변경 API 엔드포인트
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| POST | `/api/admin/backups/emergency` | admin | 응급 백업 (1클릭) |
| POST | `/api/admin/backups/:id/restore` | admin | 복원 (3단계 또는 응급) |
| POST | `/api/admin/backups/cleanup` | admin | 보존 정책 즉시 적용 |
| GET | `/api/admin/backups/retention-policy` | admin | 정책 조회 |
| POST/GET | `/api/cron/cleanup` | token | 자동 정리 (cron-job.org용) |

### 📂 변경 파일
- `src/utils/backup.ts` — GFS 정책 (`RETENTION_POLICY`, `applyAllRetentionPolicies`), 응급 윈도우 헬퍼
- `src/routes/cron.ts` — `/api/cron/cleanup` 엔드포인트 추가
- `src/routes/admin.ts` — 복원 API 강화 (비밀번호 + 응급 분기), 신규 응급 백업/cleanup API
- `src/templates/admin/index.tsx` — 헤더 응급 백업 버튼 (전역), 인라인 핸들러
- `public/static/js/admin-backups.js` — 3단계 복원 모달, 응급 복원, cleanup 모달, ⚡ 표시

---

## 🕒 v39.31 — 외부 Cron 백업 자동화 엔드포인트 (2026-06-01)

### 배경
Cloudflare **Pages**는 `wrangler.jsonc`의 `triggers.crons`를 지원하지 않는다 (Workers 전용).
따라서 외부 cron 서비스(예: **cron-job.org**)에서 호출 가능한 토큰 인증 엔드포인트를 추가하여 자동 백업을 구현.

### 신규 엔드포인트
- **`GET  /api/cron/ping`** — 연결 확인용 (인증 불필요)
- **`POST/GET /api/cron/backup?type=daily|weekly|monthly`** — 토큰 인증 백업 트리거
  - 인증: `X-Cron-Token: <CRON_SECRET>` 헤더 **또는** `?token=...` 쿼리
  - 둘 다 지원하므로 어떤 cron 서비스든 호환

### 보안 모델
| 항목 | 구현 |
|------|------|
| 토큰 강도 | 256-bit (32-byte hex) 랜덤 |
| 비교 방식 | **상수시간 비교** (타이밍 공격 방지) |
| 시크릿 저장 | Cloudflare Pages Secret (`CRON_SECRET`) — 빌드/배포 환경변수에 절대 노출 안 됨 |
| 타입 화이트리스트 | `daily`, `weekly`, `monthly`만 허용 (manual/pre-restore 차단) |
| Rate Limit | **분당 2회** (KV 기반) — 무차별 대입 방어 |
| 감사 로그 | 성공·실패·denied 모두 `admin_audit_logs`에 IP/UA와 함께 기록 (`admin_username='cron-system'`) |
| 응답 본문 | 인증 실패 시 `{"error":"unauthorized"}`만 — 정보 노출 차단 |

### cron-job.org 등록 가이드
1. https://cron-job.org 가입/로그인 → **CREATE CRONJOB**
2. **3개 작업** 등록 (KST 기준):

| Title | URL | Schedule (UTC) | KST 환산 |
|-------|-----|-----------------|----------|
| KOIST Daily Backup | `https://koist-website.pages.dev/api/cron/backup?type=daily` | `0 18 * * *` | 매일 03:00 |
| KOIST Weekly Backup | `https://koist-website.pages.dev/api/cron/backup?type=weekly` | `0 19 * * 6` | 일요일 04:00 |
| KOIST Monthly Backup | `https://koist-website.pages.dev/api/cron/backup?type=monthly` | `0 20 1 * *` | 매월 1일 05:00 |

3. 각 작업 **Advanced** 탭:
   - Request method: **POST** (GET도 동작)
   - **Headers** 섹션에 추가:
     - Name: `X-Cron-Token`
     - Value: `<CRON_SECRET 토큰 값>` (별도 안전한 채널로 전달받은 값)
   - **Notifications** 탭에서 실패 시 이메일 알림 ON 권장
4. **Save** 후 "Test run" 버튼으로 즉시 한 번 호출하여 200 OK 확인

### 운영 확인 방법
- 관리자 페이지 `/admin/backups`에서 `triggered_by='cron-system'` 백업이 일/주/월 단위로 누적되는지 확인
- 실패 시 `admin_audit_logs`에서 `admin_username='cron-system' AND status='failed'` 조회

### 검증 결과 (2026-06-01)
| 시나리오 | 결과 |
|---------|------|
| 토큰 없이 호출 | ✅ 401 unauthorized |
| 잘못된 토큰 | ✅ 401 unauthorized |
| 잘못된 type | ✅ 400 invalid type |
| Rate limit 초과 (분당 3회+) | ✅ 429 |
| 정상 토큰 + daily | ✅ 200 + 백업 생성 (1.86초, 96.4KB, 15테이블/509행) |
| Audit log 기록 | ✅ success/denied 모두 IP·UA·resource·details 기록 |

### 파일 변경
- **신규**: `src/routes/cron.ts` (200줄)
- **수정**: `src/index.tsx` (cron 라우트 마운트, CSRF 적용 전 위치)
- **수정**: `src/types.ts` (Bindings에 `CRON_SECRET?` 추가)
- **수정**: `.dev.vars` (로컬 테스트용, gitignore됨)

---

## 🔐 v39.30 — 엑셀 스타일 문의 관리 + 마스킹 + Excel/CSV 내보내기 (2026-06-01)

### 핵심 변경
1. **엑셀 스타일 테이블**: 정렬 가능 컬럼 (id/created_at/name/status/subject), 서버 사이드 페이지네이션 (25/50/100/200건)
2. **고급 검색·필터**: 이름·이메일·제목·내용 통합 검색, 상태/동의/날짜 범위 필터
3. **개인정보 마스킹** (기본 ON):
   - 이메일: `a***@example.com`
   - 전화: `010-****-5678`
   - 이름: `김*수`
   - 클릭 시 5초간 표시 후 자동 재마스킹
   - 마스킹 해제 시 감사 로그(`view`) 자동 기록 — 「개인정보 보호법」 제29조 (안전조치 의무) 대응
4. **벌크 선택**: 체크박스 다중 선택 → 일괄 휴지통 이동 / 일괄 복구 / 일괄 영구삭제 (최대 500건/회)
5. **Excel/CSV 내보내기**:
   - SheetJS 0.18.5 자체 호스팅 (`/static/lib/xlsx.full.min.js`, 862KB) — 오프라인 작동
   - CSV는 UTF-8 BOM 포함 (Excel 한글 호환)
   - 컬럼 너비 자동 조정 (.xlsx)
   - `export=true` 호출 시 서버에 감사로그 자동 기록

### 신규 API
- `GET /api/admin/inquiries?page=&per_page=&search=&status=&consent=&date_from=&date_to=&sort_by=&sort_dir=&include_deleted=&deleted_only=&export=` — 완전한 쿼리 API (SORT_WHITELIST로 SQL 인젝션 방지)
- `POST /api/admin/inquiries/bulk-delete` — 일괄 soft/permanent 삭제
- `POST /api/admin/inquiries/bulk-restore` — 일괄 복구
- `POST /api/admin/inquiries/:id/reveal` — 마스킹 해제 감사로그

### 파일
- `public/static/js/admin-inquiries.js` (재작성, ~530줄)
- `public/static/lib/xlsx.full.min.js` (신규, 862KB)
- `src/routes/admin.ts` (페이지네이션 + bulk + reveal 라우트 추가)
- `src/index.tsx` (inquiries 페이지에만 SheetJS 조건부 로드)

---

## 📜 v39.29 — 개인정보처리방침 + Soft Delete + 감사 로그 (2026-06-01)

### 핵심 변경
1. **개인정보처리방침 페이지** (`/privacy`) — 11개 조항, 「개인정보 보호법」 제30조 (개인정보 처리방침의 수립·공개) 완전 대응
2. **푸터 링크** — 강조 표시 (`font-bold text-emerald-400`)
3. **Soft Delete 패턴** — 즉시 삭제 → `deleted_at` + `deleted_by` 마킹으로 변경, 휴지통에서 복구/영구삭제 가능
4. **감사 로그** (`src/utils/audit.ts`) — login/logout/view/create/update/delete/soft-delete/restore/export/backup/reply/password-change 12개 액션 기록

### 신규 모듈
- `src/utils/audit.ts` (62줄) — `logAudit(c, action, resource, details?, status?)` 헬퍼

---

## 💾 v39.28 — 자동 백업 시스템 (2026-06-01)

### 핵심 변경
1. **Cloudflare Cron Triggers** (무료 티어) — 3개 스케줄:
   - daily: 매일 03:00 KST (UTC 18:00)
   - weekly: 매주 일요일 04:00 KST
   - monthly: 매월 2일 05:00 KST
2. **R2 저장** (`koist-images` 버킷) — gzip 압축 + SHA-256 무결성 검증
3. **백업 형식**: `koist-backup-v1` JSON (테이블 schema + indexes + columns + rows + sql_restore 문자열)
4. **보존 정책**: daily 7일 / weekly 28일 / monthly 365일 / manual 영구 / pre-restore 30일
5. **5-레이어 안전 복원** — 복원 전 자동 pre-restore 백업 → 트랜잭션 → 검증 → 롤백 가능
6. **관리자 UI** (`/admin/backups`) — 통계 대시보드, 백업 생성/다운로드/검증/복원/삭제, 521줄

### 신규 모듈
- `src/utils/backup.ts` (478줄) — `createBackup`, `restoreFromBackup`, `verifyBackupIntegrity`, `listBackups`, `getBackupFile`, `deleteBackup`, `getBackupStats`, `gzipDecompress`

### 3-2-1 백업 전략 준수
- **3 copies**: D1 본체 + 자동 백업 + 수동 백업
- **2 locations**: D1 (Cloudflare 글로벌) + R2 (다른 서비스)
- **1 offsite**: 수동 다운로드한 JSON.gz를 외부 저장 가능

---

## ✅ v39.27 — 개인정보 수집·이용 동의 체크박스 (2026-06-01)

### 핵심 변경
1. **상담 문의 폼 체크박스** — 「개인정보 보호법」 제15조 (개인정보의 수집·이용) 대응
2. **서버 측 강제 검증** — `consent_personal_info: 1` 없으면 400 응답
3. **DB 마이그레이션 `0054`** — `consent_personal_info`, `consent_at`, `deleted_at`, `deleted_by` 컬럼 + `admin_audit_logs` / `backup_history` 테이블

---

## 🛠️ v39.23 — /services/readiness 깨진 p40 이미지 6개 처리 (2026-04-27)

### 배경
v39.22 작업 중 발견: `/services/readiness/overview`, `/services/diagnosis/readiness` 두 페이지에 v39.22 이전부터 누락된 이미지 6개(`p40_img.png`, `p40_select1~5.png`)가 깨진 링크로 존재. koist.kr 원본 사이트에서도 이미 404 (사이트 측 삭제) → R2 업로드 불가.

### 처리 전략
1. **`p40_img.png`** (figure '정보보호 준비도 등급 평가서') → **단순 제거**
2. **`p40_select1~5.png`** (icon cards) → **FontAwesome 아이콘으로 대체**
   | 분야 | 아이콘 | 색상 |
   |------|--------|------|
   | 개인정보 보호 | `fa-user-shield` | emerald `#10B981` |
   | 금융분야 | `fa-coins` | amber `#F59E0B` |
   | 의료분야 | `fa-heart-pulse` | red `#EF4444` |
   | 교육분야 | `fa-graduation-cap` | blue `#3B82F6` |
   | 기타 산업별 요구사항 | `fa-industry` | indigo `#6366F1` |

### 검증 결과 (Production)
- p40 깨진 링크: **6 → 0** (양 페이지)
- FontAwesome 아이콘: **5/5** 렌더링
- Playwright 콘솔 JS 에러: **10 → 5** (404 5건 모두 제거; 남은 5건은 Google Ads CSP — 별개 이슈)

### 마이그레이션
- `migrations/0052_v3923_fix_p40_broken_images.sql` (3 commands)
- 멱등 마커: `<!-- KOIST-P40-FIX-v39.23 -->`
- FontAwesome은 `layout.tsx`에 이미 로드되어 있어 추가 의존성 0

---

## 🖼️ v39.22 — KOIST 레거시 이미지 12종 → 10개 서비스 페이지 삽입 (2026-04-27)

### 목표
원본 koist.kr 의 핵심 시각자료(KOLAS 인정마크, 절차 step 아이콘, 등급/분야 다이어그램)를 신규 사이트의 서비스 페이지에 통합 — 사용자 신뢰성 + 정보전달력 향상.

### 작업 내용
1. **슬라이더 우측 1.5cm 이동** — `sim_offset_left_cm: -2.5 → -1.0` (DB만 수정, 즉시 반영)
2. **12개 PNG 이미지 R2 업로드** — `koist-images/legacy-icons/` prefix
3. **10개 서비스 페이지에 이미지 섹션 추가** — `dep_pages.content` UPDATE × 10
4. **멱등 마커**: `<!-- KOIST-LEGACY-IMAGES-v39.22 -->` (재실행 시 중복 방지)

### 페이지별 삽입 결과 (Production 검증 완료)
| 페이지 | 이미지 수 | 출처 |
|--------|----------|------|
| `/services/performance/overview` | 1 (p50_img) | test2/summary |
| `/services/certificate` | 1 (kolas) | test3/page01 |
| `/services/certificate/rnd` | 4 (p48_step1~4) | test3/page02 |
| `/services/certificate/ai` | 4 (p48_step1~4) | test3/page03 |
| `/services/certificate/network` | 4 (p48_step1~4) | test3/page04 |
| `/services/diagnosis/ddos` | 3 (p48_step2~4) | test4/page02 |
| `/services/consulting/cc` | 4 (p48_step1~4) | consulting/cc |
| `/services/consulting/kcmvp` | 4 (p48_step1~4) | consulting/vcm |
| `/services/consulting/isms-p` | 4 (p48_step1~4) | consulting/isms_p |
| `/services/readiness/overview` | 6 (p54_ctf + p55_icon1~5) | test4/page01 |

### 기술 세부사항
- **이미지 서빙**: `/api/images/legacy-icons/{filename}.png` → R2 → 200 OK (캐시 max-age=31536000 immutable)
- **CSS 재활용**: 기존 `.koist-legacy-theme ul.process` 클래스 (style.css 145행)
- **HTML 구조**: 마지막 "문의 및 상담" 섹션 **앞에** 신규 `<section class="service-section">` 삽입
- **Mixed Content 안전**: 모든 URL 같은 도메인 (HTTPS only)
- **DB 변경**: `migrations/0051_v3922_legacy_images.sql` (10 UPDATE문, 696 lines)

### 검증
- ✅ 10/10 페이지 이미지 렌더링 OK (총 35 인스턴스)
- ✅ 12/12 R2 이미지 HTTP 200 OK
- ✅ 멱등성 (마커 중복 방지)

### 백업 / 롤백
- **사전 백업 (v39.21+위치조정 기준)**: https://www.genspark.ai/api/files/s/1fJE1JDT (35.99 MB)
- **사후 백업 (v39.22 완료)**: https://www.genspark.ai/api/files/s/CadpDQkQ (36.02 MB)
- **롤백**: `git revert 69dd0e2` 또는 `migrations/0051_v3922_legacy_images.sql` 역산 SQL 실행

---

## 🎨 v39.7 — koist.kr 원본 디자인 완전 복제 (Scoped Legacy Theme, 2026-04-22)

### 목표
v39.6 에서 콘텐츠 마이그레이션은 완료했으나 "디자인이 원본과 다르다"는 사용자 피드백에 대응.
**원본 koist.kr 의 네이비(`#005f9b`) 기반 정의형 레이아웃** 을 서비스 페이지에 픽셀 단위로 복제.

### 핵심 결과
- **14/14 픽셀 속성 원본과 100% 일치** (section-title 200px, bullet 4×4px #005f9b, image-box 50px padding #f5f5f5 등)
- **Scoped**: `.koist-legacy-theme` 네임스페이스 → 홈/관리자/공지 영향 **0**
- **Feature Flag**: `departments.use_legacy_theme` → 부서별 ON/OFF + 즉시 롤백 가능
- **Admin 호환**: v39.6 HTML 에디터 편집 시 원본 디자인 자동 적용
- **테스트**: 로컬 8/8 + 프로덕션 6/6 + 슬라이더 회귀 6/6 = **20/20 통과**

### 신규/변경 파일 (8개)
- `public/static/style.css` (+594 LoC, `.koist-legacy-theme` 블록)
- `src/templates/layout.tsx` (+4 LoC, `/static/style.css` 링크 추가 + Play 폰트)
- `src/templates/pages.tsx` (±18 LoC, dual-theme 분기 렌더링)
- `src/types.ts`, `src/routes/admin.ts`, `public/static/js/admin-departments.js`
- `migrations/0031_legacy_theme_flag.sql` (use_legacy_theme + english_subtitle)
- `migrations/0032_certificate_overview_hotfix.sql` (고아 `</div>` 제거)

### 🐛 숨겨진 버그 수정
v39.6 이 `public/static/style.css` 에 추가한 `.service-*` CSS 규칙이 **`layout.tsx` 에 `<link>` 태그 부재로 실제 로드되지 않고 있었음** → v39.7에서 `<link href="/static/style.css">` 추가로 해결. **v39.6 의 콘텐츠 마이그레이션도 이제 비로소 시각적으로 반영됨**.

---


## 📄 v39.6 — 원본 koist.kr 25개 사업분야 하위페이지 1회 크롤링 마이그레이션 (2026-04-22)

### 목표
현재 `/services/:dept/:page` 페이지들이 원본 http://www.koist.kr 대비 구조/배열/섹션이 누락되어 단순 텍스트만 표시되던 문제를 해결하기 위해, **원본 사이트에서 25개 하위페이지를 1회 배치 크롤링**하여 DB에 자동 마이그레이션.

### 핵심 숫자
- **25개 페이지** 성공적 크롤링 & 마이그레이션 (27개 대상 중 2개는 원본에 URL 부재)
- **콘텐츠 증가**: 총 1,898 B → **114,176 B (60×)**, 평균 76 B → 4,567 B
- **신규 이미지**: 62개 이미지 모두 **HTTPS 프록시**로 재작성 (Mixed Content 0건)
- **변환 규칙 7종**: `dl.dl_cm`→`section`, `dl.num_dl_cm`→`ol.service-steps`, `ul.ul_dot_cm`→`ul.service-bullets`, `div.img_box`→`figure.service-image`, 기타

### HTTPS 이미지 프록시 라우트 (신규)
`GET /api/images/legacy/*`
- 서버→서버 fetch(`http://www.koist.kr/...`) + Cloudflare Edge Cache 1년
- Path traversal/절대 URL 인젝션 방어 (HTTP 400 반환)
- 예: `/api/images/legacy/sh_page/img/p38_img.png` → 32.6 KB PNG ✅

### 콘텐츠 구조 변환 예시
| 원본 (koist.kr) | v39.6 변환 결과 |
|-|-|
| `<dl class="dl_cm"><dt>개요</dt><dd>…</dd></dl>` | `<section class="service-section"><h3>개요</h3>…</section>` |
| `<ul class="ul_dot_cm">` | `<ul class="service-bullets">` + CSS `::before` 파란 점 |
| `<div class="img_box"><img src="/sh_page/img/x.png"/></div>` | `<figure class="service-image"><img src="/api/images/legacy/sh_page/img/x.png" loading="lazy"></figure>` |

### 관리자 편집 호환성
모든 변환된 HTML은 기존 `sanitizeHtml()` allowlist 내에 있으므로 관리자 WYSIWYG 에디터에서 **자유롭게 수정/저장** 가능.

### 검증 결과
- ✅ **Local Playwright**: 23/23 페이지 통과, Mixed Content 0건, 페이지 에러 0건
- ✅ **Production Playwright**: 5/5 샘플 페이지 통과, Mixed Content 0건
- ✅ **v39.5 슬라이더 회귀**: 6/6 통과 (1920px 폰트 크기 정확)
- ✅ **D1 마이그레이션**: local + production 모두 26 commands OK

## 🔤 v39.5 — AI 시뮬레이터 슬라이더 월수 글자 +50% 확대 (2026-04-21)

### 목표
사용자 요구: **CCRA / KOIST 슬라이더 바에 표시된 준비·평가·총 월수 6개 텍스트의 글자 크기를 50% 확대**하여 가독성을 WCAG 권장 16px 수준으로 개선.

### 변경 사항
| 대상 ID | 위치 | 이전 `clamp()` | 신규 `clamp()` | +50% |
|---------|------|--------------|--------------|:---:|
| `ealGeneralTotal` | CCRA 총월수 | `0.68rem, 0.73vw, 3.5rem` | `1.02rem, 1.095vw, 5.25rem` | ✅ |
| `ealGeneralPrep` | CCRA 준비월수 | `0.6rem, 0.68vw, 3.25rem` | `0.9rem, 1.02vw, 4.875rem` | ✅ |
| `ealGeneralEval` | CCRA 평가월수 | 동일 | 동일 | ✅ |
| `ealKoistTotal` | KOIST 총월수 | `0.68rem, 0.73vw, 3.5rem` | `1.02rem, 1.095vw, 5.25rem` | ✅ |
| `ealKoistPrep` | KOIST 준비월수 | `0.6rem, 0.68vw, 3.25rem` | `0.9rem, 1.02vw, 4.875rem` | ✅ |
| `ealKoistEval` | KOIST 평가월수 | 동일 | 동일 | ✅ |

### 모바일 오버플로우 Guard (신규)
폰트 +50% 확대 시 좁은 모바일(<480px)에서 Prep/Eval 텍스트가 바 폭을 초과 → **3단계 자동 축약**:
1. **1차 축약**: `준비 6개월` → `6개월` (바 폭 < P+E+36px일 때)
2. **2차 축약**: `6개월` → `6` (바 폭 < P+E+24px일 때)
3. **3차 축약**: Eval 숨김 (바 폭 < P+E+12px일 때)

모든 조치는 JS 런타임에서 동작하며, 데스크톱 해상도에서는 영향 없음.

### 검증 결과
- ✅ **폰트 크기**: 375/768/1440/1920px 모두 정확히 **1.500× 확대** 측정
- ✅ **v39.4 정합성 회귀**: 4레벨 × 10포지션 × 3항목 = **120/120 통과** (JS 오류 0)
- ✅ **프로덕션 오버랩 검증**: 3해상도 × 4레벨 × 10포지션 × 2바 = **240/240 통과**
- ✅ **WCAG 1.4.4**: 모바일 최소 폰트 9.6px → **14.4px**로 상승 (16px 근접)

## 🎨 v39.4 — 슬라이더 UI 관리자 제어 (2026-04-21)

### 목표
AI 시뮬레이터 히어로 배너에 표시되는 **모든 숫자 포맷·색상·반올림 정책**을 관리자 모드에서 실시간으로 제어할 수 있도록 통합.

### 신규 기능 (32개 설정 키, category='slider')
| 그룹 | 키 개수 | 대표 키 |
|---|:---:|---|
| 반올림·표시 정책 | 4 | `slider_total_mode` (sum/round/decimal), `slider_round_mode` |
| 텍스트 포맷 템플릿 | 7 | `slider_total_format` ("약 {N}개월") |
| CCRA 바 | 4 | `slider_gen_prep_color`, `slider_gen_eval_color` |
| KOIST 바 | 4 | `slider_koist_prep_color`, `slider_koist_eval_color` |
| 사전준비 트랙 4단계 | 5 | `slider_track_color_1` ~ `_4` |
| 단축률 뱃지 | 3 | `slider_badge_grad_start`/`_end` |
| 분배 비율 & 변환 | 5 | `slider_gen_prep_ratio`, `slider_weeks_per_month` |

### 관리자 UI (`/admin/slider-settings`)
- 🎨 **라이브 프리뷰**: 색상 변경 즉시 샘플 바에 반영
- 🔧 **컬러 피커 + HEX 동기화**: 양방향 입력
- 📦 **4종 프리셋**: 기본 / 모노톤 / 다크 / 파스텔 (1클릭 전체 적용)
- 🔄 **전체 기본값 복원** 버튼
- 💾 **전체 저장** (한 번의 PUT 요청으로 32개 키 일괄 처리)

### API 엔드포인트 (신규)
- `GET  /api/admin/slider-settings` — 전체 조회
- `PUT  /api/admin/slider-settings` — 일괄 저장 `{key: value, ...}`
- `POST /api/admin/slider-settings/reset` — 기본값 복원
- `POST /api/admin/slider-settings/preset/:name` — 프리셋 적용 (default/monotone/dark/pastel)

### 핵심 "합계 정합성" 옵션
- `slider_total_mode = 'sum'` (기본·권장): **round(준비) + round(평가) = 총합** — 108/108 정합
- `slider_total_mode = 'round'`: round(total) — v39.2 이전 방식, ±1개월 오차 허용
- `slider_total_mode = 'decimal'`: 소수 N자리 표시 ("8.3개월") — 정합성 100%

### 검증 결과 (Playwright, 프로덕션)
- CCRA 바 정합성: **36/36 (100%)**
- KOIST 바 정합성: **36/36 (100%)**
- 절감값 정합성: **36/36 (100%)**
- 합계 **108/108 포인트 PASS**, 0 에러
- SLIDER_CFG 주입: 27 keys 정상 로드 확인
- E2E: DB 색상 변경 → 홈페이지 즉시 반영 확인

### 변경 파일
- `migrations/0029_slider_admin_settings.sql` — 신규 32개 키 INSERT
- `src/routes/admin.ts` — slider-settings CRUD + preset + reset API
- `src/templates/admin/index.tsx` — 메뉴에 "슬라이더 UI 설정" 추가
- `src/index.tsx` — `/admin/slider-settings` 페이지 라우트
- `src/templates/home.tsx` — SLIDER_CFG 주입 + 모든 하드코딩 색상을 DB 값으로 대체
- `public/static/js/admin-slider-settings.js` — 관리자 UI (신규, ~500줄)

---

## 🎯 v39.3 — CCRA/KOIST 바 합계 = 준비+평가 정합성 (2026-04-21)

### 문제
EAL2·EAL4 설정 시 "바 위 N개월" ≠ "바 안의 준비 + 평가 개월 합" (±1개월 차이).

### 원인
`Math.round(a) + Math.round(b) ≠ Math.round(a+b)` — 각자 반올림 시 최대 1의 오차 발생.

### 해결 (Option C)
`displayTotal = round(prep) + round(eval)` 강제 → 108/108 포인트 100% 정합.

### 관련 문서
- `docs/FINAL_PRECISION_ANALYSIS_v39.3_EAL2_EAL4_20260421.md`
- `docs/BAR_TOTAL_MISMATCH_ANALYSIS_20260421.md`
- `docs/PRECISION_ANALYSIS_REPORT_v39.2.1_20260421.md`
- `docs/SLIDER_ADMIN_CONTROL_FEASIBILITY_20260421.md`

---

## 🎯 v39.1 AI 시뮬레이터 감도 개선 패치 (2026-04-21)

### 문제 요약
관리자 모드 `/admin/sim-cert-types`에서 CC평가 EAL2/EAL3/EAL4의 **CCRA 평가일수** 및 **KOIST 기간**을 수정해도 홈 Hero의 AI 시뮬레이터에 **반영되지 않는 문제**. 정밀 분석 결과 원인은 렌더링 파이프라인의 **3단계 정수 반올림으로 인한 감도 상실**로 판명.

### 패치 #1+#2 — `simTypeToEal` 전면 재설계 (`src/templates/home.tsx`)
- **W2M 표준화**: 4.33 → 4.345 (52주/12개월)
- **반올림 손실 제거**: 내부 계산은 소수점 1자리(`round1`) 유지, `Math.round()`는 최종 표시 단계(클라이언트 JS)에서만 1회 적용
- **`traditional_min_weeks` 활용**: 일반(CCRA) 기간도 슬라이더 값에 따라 `min ~ max`를 보간하도록 `general.prepMin/prepMax/evalMin/evalMax`를 ealData에 추가 (기존 "유령 필드" 해소)
- **분배 상수 명명**: `G_PREP_RATIO`, `G_EVAL_RATIO`, `K_PREP_RATIO`, `K_EVAL_RATIO` 상수화
- **개선 효과**: EAL2의 `koist_max_weeks`를 16→17주(1주)만 바꿔도 `prepMax`가 1.5→1.6, `evalMax`가 2.2→2.3으로 **즉시 반영** (v39.0은 모두 2/2로 동일)

### 패치 #3 — Hero Badge(%) 초기값 서버사이드 주입 (`src/templates/home.tsx`)
- 기존: `unified_reduction_default || '35'` 고정값 → 슬라이더 움직여야 실제값 표시
- 변경: `unified_reduction_default`가 비어있으면 서버가 `computeReductionAt(entryOverall, 50)`을 실행해 실제 계산값 주입
- **검증**: `unified_reduction_default=''`일 때 Badge에 `70%`(실제 계산값) 자동 표시 확인 ✅

### 패치 #4 — 관리자 UI 안내 강화 (`public/static/js/admin-sim-cert-types.js`)
- CC평가 EAL2/EAL3/EAL4만 홈에 반영됨을 명시
- "최소(사전준비 100%)" vs "최대(사전준비 1%)" 의미 상세 설명
- v39.1 배지 및 개선 사항 안내 박스 추가

### 감도 검증 결과 (EAL2 기준, 슬라이더=50)
| koist_min | koist_max | v39.0 reduction | v39.1 reduction | 비고 |
|---|---|---|---|---|
| 4주 | 16주 (현재) | 62% | 63% | 기준 |
| 4주 | 17주 (+1) | 62% (변화없음) | **62% (변화!)** | ✅ 1주 민감 |
| 5주 | 17주 (+1,+1) | 62% | **60%** | ✅ 즉시 반영 |
| 4주 | 20주 (+4) | 62% | **56%** | ✅ 크게 반영 |
| 20주 | (trad_min=15로) | 63% | **60% (slider=50)** | ✅ trad_min도 반영 |

**테스트 조합 54가지 중 52가지가 변화를 보임** (v39.0은 테스트 전체가 62% 고정).

### End-to-End 프로덕션 검증 (2026-04-21)
```
[EAL2 koist_max: 16 → 17 변경 직후]
Before: koist:{prepMin:0.4, prepMax:1.5, evalMin:0.6, evalMax:2.2}
After:  koist:{prepMin:0.4, prepMax:1.6, evalMin:0.6, evalMax:2.3}  ✅ 즉시 반영
```

### 관련 분석 보고서
- `docs/AI_SIMULATOR_ANALYSIS_REPORT_v2_20260421.md` - 정밀 원인 분석 (반올림 손실 규명)
- `docs/SLIDER_ANALYSIS_REPORT_20260421.md` - 초기 구조 분석

---

## 🔒 v39.0 XSS 긴급 보안 패치 (2026-04-20)

### 보안 점검 결과 대응 (KOIST v38.3 종합분석보고서 기준)

| # | 취약점 | 파일 | 위험도 | 조치 | 상태 |
|---|--------|------|--------|------|------|
| 1 | Stored XSS - site_settings | `layout.tsx` (24곳) | 🔴 Critical | `escapeHtml`/`escapeAttr`/`safeUrl` 적용 | ✅ |
| 2 | Stored XSS - site_settings/popup/notice | `home.tsx` (50+곳) | 🔴 Critical | 전체 이스케이프 + `safeColor`/`safeFaIcon`/`safeOpacity` 적용 | ✅ |
| 3 | Stored XSS - progress_items/dept/notice | `pages.tsx` (DB 필드 다수) | 🔴 Critical | `product_name`, `category`, `assurance_level`, `cert_type`, `eval_type` 등 모두 이스케이프 | ✅ |
| 4 | Reflected XSS - 검색/카테고리 필터 | `pages.tsx` (`q`, `category`, `status` 쿼리) | 🔴 Critical | `escapeHtml`/`escapeAttr` 입력값 이스케이프 | ✅ |
| 5 | HTML 인젝션 - `<source src>` 속성 | `home.tsx` hero_video_url | 🔴 Critical | 화이트리스트 정규식 검증 + `escapeAttr` | ✅ |
| 6 | CSS 인젝션 - `background-image` URL | `home.tsx` hero_bg_url | 🟠 High | `bgStyle()` 탈출문자 검증 + `safeOpacity` | ✅ |
| 7 | CSS 인젝션 - `color`/`background` hex | 모든 템플릿 | 🟠 High | `safeColor()`로 hex/rgb/hsl/named 색상만 허용 | ✅ |
| 8 | Attribute 인젝션 - `fa-` icon class | 모든 템플릿 | 🟠 High | `safeFaIcon()`로 `fa-[a-z0-9\-]+` 패턴만 허용 | ✅ |
| 9 | URL 인젝션 - `javascript:` 프로토콜 | 모든 링크 | 🟠 High | `safeUrl()`로 위험 프로토콜 차단 | ✅ |
| 10 | CSP `unsafe-eval` | `index.tsx` | 🟡 Medium | **연기** - Tailwind CDN JIT 필수 의존 (중기 과제로 분리) | ⏸️ |

### 새로 추가된 보안 유틸리티 (`src/utils/sanitize.ts`)

```typescript
escapeHtml(unknown) → string      // & < > " ' null/undefined 안전
escapeAttr(unknown) → string      // + 백틱(`) 추가 방어
safeUrl(unknown) → string         // javascript: / vbscript: / data:text/* 차단
safeCss(unknown) → string         // {}, /* */, expression(), url(), @import 제거
safeColor(unknown) → string       // #abc / rgb() / rgba() / hsl() / 색상명만 허용
safeFaIcon(unknown) → string      // /^fa-[a-z0-9\-]+$/i 패턴만 허용
safeOpacity(value, fallback)      // 0.0 ~ 1.0 숫자만 (home.tsx 로컬)
safeNum(value, fallback)          // 숫자/숫자문자열만 (home.tsx 로컬)
```

### XSS 방어 테스트 통과

```
Payload                                    → 결과
<script>alert(1)</script>                  → &lt;script&gt;alert(1)&lt;/script&gt;  ✅
"><img src=x onerror=alert(1)>             → &quot;&gt;&lt;img...&gt;               ✅
javascript:alert(1)                        → 링크에 삽입되지 않음 (safeUrl 차단)   ✅
'; alert(1);//                             → &#039;; alert(1);//                    ✅
```

### 수정 파일 (v39.0)
- `src/utils/sanitize.ts` — 보안 유틸리티 6종 추가/강화
- `src/utils/db.ts` — 이스케이프 함수 re-export
- `src/templates/layout.tsx` — 24개 site_settings 이스케이프
- `src/templates/home.tsx` — 50+곳 이스케이프 + hero video/bg URL 검증
- `src/templates/pages.tsx` — Reflected XSS + DB 필드 이스케이프 (progressPage, serviceProgressContent, servicePage, noticeListPage, noticeDetailPage, downloadsPage)

### 롤백 백업
- `/home/user/webapp-backup-20260420-100642/` — 패치 전 스냅샷

### 연기된 중기 과제
- **CSP `unsafe-eval` 제거**: Tailwind CDN(https://cdn.tailwindcss.com) 런타임 JIT 컴파일러가 eval()을 사용하므로, 제거하려면 Tailwind CLI로 CSS를 프리빌드하여 정적으로 서빙하는 리팩터링 필요 (예상 2-3일). 현재는 CSP 다른 레이어(`frame-src 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`)로 공격면 차단.

---

## v38.1 Hero UI 4가지 추가 변경 (2026-04-20)

| # | 항목 | Before | After | 상태 |
|---|------|--------|-------|------|
| 1 | 1층 로고 | 349×71px | 245×50px (30% 축소) | ✅ |
| 2 | 뱃지 텍스트 | 33.12px | 19.87px (60% 축소) | ✅ |
| 3 | CTA 버튼 글자 | 11.14px | 15.59px (40% 확대) | ✅ |
| 4 | 슬라이더 위치 | left 791, right 1772 | left 923 (GNB "시" 정렬), right 1678 (-2.5cm) | ✅ |

## v38.0 Hero UI 6가지 변경 (2026-04-20)

### 변경사항

| # | 항목 | Before | After | 상태 |
|---|------|--------|-------|------|
| 1 | KOLAS 인정마크 | 112×65px | 56×32px (2배 축소) | ✅ |
| 2 | 뱃지 (3층) | 초록점 + 11px 텍스트 | KOIST 로고 + 33px 텍스트 (3배) | ✅ |
| 3 | 히어로 제목/서브타이틀 | h1 88px 제목 + p 12.7px 서브 | 제목 삭제 → 서브타이틀 h1 승격 25.3px | ✅ |
| 4 | CTA 버튼 | 256×37px, 268×37px | 195×37px, 207×37px (가로 30% 축소) | ✅ |
| 5 | 연락처 카드 | 380px 폭, gap 9.4/17.3px | 418px (+1cm), gap 4.8/8.6px (50% 축소) | ✅ |
| 6 | 시뮬레이터 패널 | left 778px, width 1076px | left 891px (GNB "가" 정렬), width 981px (-2.5cm) | ✅ |

### 반응형 지원
- **8K (7680px)**: 전용 미디어쿼리 + 스케일링
- **4K (3840px)**: 전용 미디어쿼리
- **2.5K (2560px)**: 전용 미디어쿼리
- **Tablet (≤1023px)**: 1컬럼 스택
- **Mobile (≤639px)**: 모바일 최적화
- **Small Mobile (≤375px)**: 최소 글꼴 보장

### 수정 파일
- `src/templates/home.tsx` — 히어로 섹션 HTML + CSS
- `src/templates/layout.tsx` — KOLAS 마크 크기
- `public/static/images/koist-circle-logo.png` — 뱃지 로고 (신규)

---

## v37.0 보안 강화 (2026-04-18)

### Security Changes

| # | 항목 | 내용 |
|---|------|------|
| A-1 | Admin 자동생성 제거 | `GET /api/init-db` 삭제, 로그인 시 자동생성 제거. `scripts/init-admin.cjs`로만 생성 |
| A-2 | JWT Secret 강화 | `JWT_SECRET_DEFAULT` 삭제, 32자 미만 거부, 500 반환 |
| A-3 | XSS 차단 | `src/utils/sanitize.ts` 신설, 모든 DB-origin HTML에 sanitizeHtml/escapeHtml 적용, 31개 테스트 |
| A-4 | Cookie 기반 인증 | HttpOnly Set-Cookie, logout API (`POST /api/admin/logout`), 클라이언트 cookie 제거 |
| A-5 | Security Headers & CSRF | CSP, X-Frame-Options: DENY, HSTS, Referrer-Policy, Permissions-Policy. Double-submit CSRF cookie |
| A-6 | Rate Limiting | KV 기반 rate limiter: 로그인 5회/5분, 문의 3회/1시간 |
| A-7 | Upload 검증 | Magic bytes 검증 (JPEG/PNG/GIF/WebP), SVG 차단, SSRF 방지 (private IP 차단) |
| A-8 | Migration 정리 | `migrations/NOTES.md` 문서화, 중복번호/누락 기록 |
| A-9 | UI Migration 아카이브 | 팝업 크기조정 마이그레이션 6개 → `migrations/archive/` 이동 |
| A-10 | 데이터 일관성 | `0025_normalize_defaults.sql` - status 기본값 설정 |
| A-11 | 템플릿 리팩터 | layout.tsx CSS → `partials/layout-css.ts` 분리 (2111 → 986 LOC) |
| A-12 | Tailwind 빌드 | Deferred — Tailwind v4 CSS-first 방식, CDN 유지 |

### 관리자 계정 설정

하드코딩된 기본 관리자(`admin/admin1234`)가 **제거**되었습니다.

```bash
# 로컬 개발
ADMIN_USERNAME=myadmin ADMIN_PASSWORD='SecurePass123!' npm run db:init-admin:local

# 프로덕션
ADMIN_USERNAME=myadmin ADMIN_PASSWORD='SecurePass123!' npm run db:init-admin
```

첫 로그인 시 비밀번호 변경이 강제됩니다.

### JWT Secret 설정 (필수)

```bash
# 프로덕션 (Cloudflare Secret)
npx wrangler secret put JWT_SECRET --project-name koist-website
# 32자 이상 랜덤 문자열 입력

# 로컬 개발 (.dev.vars 파일)
echo 'JWT_SECRET=your-local-secret-at-least-32-characters-long' > .dev.vars
```

### KV Rate Limiter 설정

```bash
# KV namespace 생성
npx wrangler kv namespace create RATE_LIMIT_KV
# 출력된 ID를 wrangler.jsonc에 반영
```

## 주요 기능

### 10개 사업 평가현황 (각 사업별 독립 현황)
| # | 카테고리 | 동적 필드 |
|---|---------|----------|
| 1 | CC평가 | 보증등급 / 인증구분 / 신청구분 |
| 2 | 보안기능확인서 | 확인서등급 / 발급구분 / 시험유형 |
| 3 | KCMVP | 검증등급 / 모듈유형 / 알고리즘 |
| 4 | 성능평가 | 성능등급 / 평가구분 / 평가항목 |
| 5 | 보안적합성검증 | 적합등급 / 검증구분 / 검증기준 |
| 6 | 취약점분석평가 | 위험등급 / 분석유형 / 평가범위 |
| 7 | 정보보호제품평가 | 평가등급 / 제품유형 / 평가기준 |
| 8 | 클라우드보안인증 | 인증등급 / 서비스유형 / 인증기준 |
| 9 | IoT보안인증 | 인증등급 / 기기유형 / 인증기준 |
| 10 | 기타시험평가 | 등급 / 유형 / 기준 |

### 보안 아키텍처
- **인증**: HttpOnly Cookie + JWT (PBKDF2-SHA256, 100K iterations)
- **CSRF**: Double-submit cookie (`koist_csrf`)
- **XSS**: Allowlist-based HTML sanitiser (script/iframe/event handler 제거)
- **Headers**: CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy
- **Rate Limit**: Cloudflare KV 기반 (로그인 5/5min, 문의 3/1h)
- **Upload**: Magic bytes 검증, SVG 차단, SSRF 방지

## 기술 스택
- **Backend**: Hono 4.x + Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (이미지)
- **KV**: Cloudflare KV (rate limiting)
- **Frontend**: Tailwind CSS (CDN) + FontAwesome + AOS Animation
- **Build**: Vite 6 + @hono/vite-build/cloudflare-pages
- **Deploy**: Cloudflare Pages

## 개발 환경
```bash
npm install
npm run build
npm run dev:sandbox  # 로컬 개발 서버 (wrangler pages dev)
```

## 배포
```bash
npm run build
npx wrangler d1 migrations apply koist-website-db
npx wrangler pages deploy dist --project-name koist-website
```

## 데이터 아키텍처
- **progress_items**: 평가현황 (category, product_name, company, status, ...)
- **departments**: 사업분야
- **dep_pages**: 사업분야 하위 페이지
- **notices**: 공지사항
- **faqs**: FAQ
- **inquiries**: 상담문의
- **popups**: 팝업
- **site_settings**: 사이트 설정 (key-value)
- **admin_users**: 관리자 계정 (PBKDF2 해시)
- **images**: R2 이미지 메타데이터
- **about_pages**: 소개 페이지
- **sim_cert_types**: AI 시뮬레이터 인증유형

## 프로젝트 구조
```
src/
├── index.tsx                    # Hono 앱 엔트리, 라우팅, 미들웨어 체인
├── types.ts                     # TypeScript 타입 정의 (Bindings, Variables, 엔티티)
├── middleware/
│   ├── auth.ts                  # JWT 인증 미들웨어 (cookie + bearer)
│   ├── csrf.ts                  # CSRF double-submit cookie
│   └── rate-limit.ts            # KV 기반 rate limiter
├── routes/
│   ├── admin.ts                 # 관리자 CRUD API
│   └── api.ts                   # 공개 API
├── utils/
│   ├── crypto.ts                # PBKDF2 해시, JWT 생성/검증
│   ├── db.ts                    # DB 헬퍼 (settings, departments)
│   └── sanitize.ts              # XSS 방지 HTML sanitiser
├── templates/
│   ├── layout.tsx               # 메인 레이아웃 (986 LOC)
│   ├── home.tsx                 # 홈페이지 템플릿
│   ├── pages.tsx                # 서비스/공지/FAQ/문의/평가현황/다운로드
│   ├── admin/index.tsx          # 관리자 로그인/대시보드 템플릿
│   └── partials/
│       ├── layout-css.ts        # CSS 디자인 시스템 (1134 LOC)
│       └── index.ts             # 배럴 export
├── __tests__/
│   └── xss.test.ts              # XSS sanitiser 테스트 (31개)
scripts/
└── init-admin.cjs               # 관리자 계정 생성 스크립트
migrations/
├── 0001-0023                    # 스키마 마이그레이션
├── 0024_admin_seed_guard.sql    # admin_users UNIQUE index
├── 0025_normalize_defaults.sql  # 데이터 정합성
├── archive/                     # 아카이브된 UI 조정 마이그레이션
└── NOTES.md                     # 마이그레이션 문서
```

## 배포 상태
- **Platform**: Cloudflare Pages
- **Status**: Active
- **D1 DB**: koist-website-db (91f1eb2f-e9fa-45e8-8bea-4958ce74727a)
- **Version**: v37.0 (Security Hardening)
- **Last Updated**: 2026-04-18

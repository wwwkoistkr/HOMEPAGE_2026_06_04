# 🔒 개인정보 수집·이용 동의 추가 작업 인계서

> **작성일**: 2026-06-01
> **상태**: 📋 **TODO** (집에서 이어서 작업 예정)
> **현재 git HEAD**: `a9b6a47` (v39.26)
> **선택 옵션**: 미정 (옵션 A 추천)

---

## 📌 작업 배경 (왜 이걸 해야 하는가)

### 현재 문제점
- **URL**: https://www.koist.ai.kr/support/inquiry (온라인 상담)
- **수집 항목**: 이름(필수), 회사명, 이메일, 연락처, 제목(필수), 문의내용(필수)
- **🚨 문제**: 개인정보 수집·이용 동의 절차가 **전혀 없음**
- **코드 위치**: `src/templates/pages.tsx` line 290~377 (`inquiryPage` 함수)

### 라이브 페이지 확인 결과 (2026-06-01)
```bash
curl -s "https://www.koist.ai.kr/support/inquiry" | grep -oE "(개인정보|동의|privacy|consent|약관)"
# 결과: 0건 (전혀 없음)
```

---

## ⚖️ 법적 근거

### 대한민국 「개인정보 보호법」 제15조 (개인정보의 수집·이용)
> 개인정보처리자는 개인정보를 수집할 때 **반드시 정보주체의 동의**를 받아야 한다.

### 위반 시 제재
| 위반 사항 | 제재 |
|----------|------|
| 동의 없이 개인정보 수집 | **5천만원 이하 과태료** (법 제75조) |
| 수집 항목·목적·보유기간 미고지 | 1천만원 이하 과태료 |
| 개인정보 처리방침 미공개 | 1천만원 이하 과태료 |

### KOIST 특수성
- **국가 공인 정보보호 시험기관** (CC평가, KCMVP, ISMS-P 등)
- 정보보호 평가 기관이 자체 사이트에서 개인정보 동의 미수집 → **기관 신뢰도 치명적 손상**

---

## 🎯 작업 옵션

### ⭐ 옵션 A: 최소 필수 구현 (추천)
**소요 시간**: 약 30~45분
**효과**: 법적 최소 요건 충족, 즉시 안전

#### 작업 항목
1. ✅ 폼에 필수 동의 체크박스 1개 추가
2. ✅ "전문 보기" 토글로 4대 항목 표시
3. ✅ 클라이언트 + 서버 검증
4. ✅ DB에 `consent_at` 컬럼 추가
5. ✅ 빌드/배포/커밋

---

### 옵션 B: 완전 구현
**소요 시간**: 약 1.5~2시간
**효과**: 옵션 A + 종합적 개선

#### 추가 작업
- 별도 `/privacy` 개인정보처리방침 페이지 생성
- 푸터에 `/privacy` 링크 추가 (이미 layout.tsx에 푸터 존재)
- 관리자 페이지에서 동의 이력 확인 기능
- 마케팅 수신 선택 동의 항목 추가

---

## 📐 구현 사양 상세

### A. UI 시안 - 폼에 추가할 영역

`src/templates/pages.tsx`의 line 335 (문의 내용 textarea) 와 line 337 (submit button) 사이에 추가:

```html
<!-- 개인정보 수집·이용 동의 (필수) -->
<div style="margin-bottom:var(--space-lg); padding:var(--space-md);
            background: rgba(59,130,246,0.04);
            border: 1px solid rgba(59,130,246,0.15);
            border-radius: var(--radius-md);">

  <label class="flex items-start cursor-pointer" style="gap:var(--space-sm)">
    <input type="checkbox" name="consent_personal_info" id="consentPI" required
           class="mt-1 w-5 h-5 rounded border-2 border-slate-300
                  text-blue-600 focus:ring-blue-500 cursor-pointer">
    <span class="f-text-sm text-slate-700">
      <strong class="text-red-500">(필수)</strong>
      <strong>개인정보 수집·이용에 동의합니다.</strong>
      <button type="button" id="togglePrivacyDetail"
              class="text-blue-600 hover:underline ml-2 f-text-xs">
        [전문 보기 ▼]
      </button>
    </span>
  </label>

  <!-- 동의 전문 (기본 숨김) -->
  <div id="privacyDetail" class="hidden"
       style="margin-top:var(--space-md); padding:var(--space-md);
              background: white; border-radius: var(--radius-sm);
              border: 1px solid rgba(0,0,0,0.08);">
    <table class="w-full f-text-xs text-slate-600" style="border-collapse: collapse;">
      <thead>
        <tr style="background:#F8FAFC;">
          <th class="text-left p-2 border-b">항목</th>
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
          <td class="p-2 border-b">이름, 회사명, 이메일, 연락처, 문의내용</td>
        </tr>
        <tr>
          <td class="p-2 border-b font-semibold">보유·이용 기간</td>
          <td class="p-2 border-b">문의 처리 완료 후 <strong>3년</strong> (전자상거래 등에서의 소비자보호에 관한 법률)</td>
        </tr>
        <tr>
          <td class="p-2 font-semibold">동의 거부 권리</td>
          <td class="p-2">동의를 거부할 권리가 있으며, 거부 시 상담 접수가 제한될 수 있습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### B. JavaScript - 토글 기능

`pages.tsx`의 `<script>` 블록 (line 344~) 안에 추가:

```javascript
// 전문 보기 토글
document.getElementById('togglePrivacyDetail').addEventListener('click', function() {
  var detail = document.getElementById('privacyDetail');
  var btn = this;
  if (detail.classList.contains('hidden')) {
    detail.classList.remove('hidden');
    btn.textContent = '[전문 닫기 ▲]';
  } else {
    detail.classList.add('hidden');
    btn.textContent = '[전문 보기 ▼]';
  }
});

// submit 핸들러 안 fetch 전에 추가:
if (!document.getElementById('consentPI').checked) {
  msg.className = 'rounded-lg f-text-sm bg-red-50 text-red-700 border border-red-200';
  msg.style.cssText = 'margin-top:var(--space-md); padding:var(--space-sm) var(--space-md)';
  msg.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i> 개인정보 수집·이용에 동의해주세요.';
  msg.classList.remove('hidden');
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane mr-1"></i> 문의하기';
  return;
}
body.consent_personal_info = true;
body.consent_at = new Date().toISOString();
```

### C. 서버 검증

`src/routes/api.ts` line 104의 `api.post('/inquiries', ...)` 핸들러 안에 추가:

```typescript
// 개인정보 동의 검증
if (!body.consent_personal_info) {
  return c.json({ error: '개인정보 수집·이용 동의가 필요합니다.' }, 400);
}
// consent_at 기록 (DB에 저장)
const consentAt = body.consent_at || new Date().toISOString();
```

### D. DB 마이그레이션

`migrations/` 폴더에 새 파일 생성: `0NNN_add_consent_to_inquiries.sql`
(번호는 마지막 마이그레이션 번호 + 1)

```sql
-- 기존 inquiries 테이블에 동의 컬럼 추가
ALTER TABLE inquiries ADD COLUMN consent_personal_info INTEGER DEFAULT 0;
ALTER TABLE inquiries ADD COLUMN consent_at TEXT;

-- 기존 데이터는 NULL → 향후 신규 데이터만 동의 기록
-- (기존 데이터는 동의 없이 받은 것이므로 정책상 보관 기간 검토 필요)
```

마이그레이션 적용:
```bash
# 로컬
npx wrangler d1 migrations apply webapp-production --local

# 프로덕션
npx wrangler d1 migrations apply webapp-production
```

---

## 📋 작업 순서 (체크리스트)

집에 가셔서 다음 순서대로 진행하시면 됩니다:

### Phase 1: 사전 준비 (5분)
- [ ] 1. `cd /home/user/webapp`
- [ ] 2. `git status` (working tree clean 확인)
- [ ] 3. `git log --oneline -5` (HEAD가 `a9b6a47` 인지 확인)
- [ ] 4. 이 문서(`docs/PRIVACY_CONSENT_TODO_20260601.md`) 다시 읽기

### Phase 2: 옵션 결정 (1분)
- [ ] 5. 옵션 A vs 옵션 B 결정 (추천: **옵션 A**)

### Phase 3: 코드 수정 - 옵션 A (15~20분)
- [ ] 6. `src/templates/pages.tsx` 수정 - HTML 추가 (위 A 섹션)
- [ ] 7. `src/templates/pages.tsx` 수정 - JavaScript 추가 (위 B 섹션)
- [ ] 8. `src/routes/api.ts` 수정 - 서버 검증 추가 (위 C 섹션)
- [ ] 9. `migrations/0NNN_add_consent_to_inquiries.sql` 생성 (위 D 섹션)

### Phase 4: 빌드 & 배포 (10~15분)
- [ ] 10. `npx wrangler d1 migrations apply webapp-production --local` (로컬 마이그레이션)
- [ ] 11. `npx wrangler d1 migrations apply webapp-production` (프로덕션 마이그레이션)
- [ ] 12. `npm run build` (약 7~8분 소요)
- [ ] 13. `npx wrangler pages deploy dist --project-name koist-website --branch main`

### Phase 5: 검증 (5분)
- [ ] 14. 브라우저로 https://www.koist.ai.kr/support/inquiry 접속
- [ ] 15. 동의 체크박스 표시 확인
- [ ] 16. "전문 보기" 토글 작동 확인
- [ ] 17. 동의 안 한 채로 제출 → 에러 메시지 표시 확인
- [ ] 18. 동의 후 제출 → 정상 접수 확인

### Phase 6: Git 커밋 (3분)
- [ ] 19. `git add -A`
- [ ] 20. `git commit -m "feat(v39.27): 온라인 상담 폼에 개인정보 수집·이용 동의 추가"`
- [ ] 21. `git push origin main`
- [ ] 22. `git tag v39.27 && git push origin v39.27`

### Phase 7: (옵션 B 선택 시) 추가 작업
- [ ] 23. `/privacy` 페이지 라우트 추가 (`src/index.tsx`)
- [ ] 24. `src/templates/pages.tsx`에 `privacyPolicyPage()` 함수 추가
- [ ] 25. `src/templates/layout.tsx` 푸터에 `/privacy` 링크 추가
- [ ] 26. 관리자 페이지에서 동의 이력 표시 (선택)

---

## 🔗 관련 파일 위치 참조

| 파일 | 위치 | 수정 내용 |
|------|------|----------|
| 상담 폼 HTML | `src/templates/pages.tsx` line 290~377 | 동의 체크박스 + 전문 추가 |
| 상담 폼 JS | `src/templates/pages.tsx` line 344~376 | 토글 + 검증 로직 |
| API 핸들러 | `src/routes/api.ts` line 104~ | 서버 검증 |
| Rate Limit | `src/middleware/rate-limit.ts` line 69 | (참조용, 수정 불필요) |
| 메인 라우트 | `src/index.tsx` line 331 | (참조용, 수정 불필요) |
| 마이그레이션 | `migrations/` | 신규 SQL 파일 |
| Wrangler 설정 | `wrangler.jsonc` | (참조용, 수정 불필요) |

---

## 🔍 사전 검토 자료 (집에서 참고)

### 라이브 사이트 확인 명령
```bash
# 1. 현재 inquiry 페이지 다운로드
curl -s "https://www.koist.ai.kr/support/inquiry" -o /tmp/inquiry_current.html

# 2. 폼 구조 확인
grep -A 50 "inquiryForm" /tmp/inquiry_current.html | head -80

# 3. 동의 관련 단어 검색 (있으면 이미 누군가 추가한 것)
grep -E "(개인정보|동의|consent)" /tmp/inquiry_current.html
```

### 참고할 만한 공공기관 동의문 예시
- KISA: https://www.kisa.or.kr (푸터 → 개인정보처리방침)
- TTA: https://www.tta.or.kr
- NIS: https://www.nis.go.kr
- 정보보호산업협회: https://www.kisia.or.kr

### 개인정보보호위원회 표준 양식
- https://www.pipc.go.kr → 자료실 → 개인정보처리방침 표준 양식

---

## 📦 현재 시스템 상태 (인계 시점)

### Git
- **branch**: `main`
- **HEAD**: `a9b6a47` (v39.26)
- **GitHub**: `wwwkoistkr/HOMEPAGE.git` 푸시 완료
- **working tree**: clean

### Cloudflare Pages
- **프로젝트**: `koist-website`
- **계정 ID**: `40b506ea69bd735f6e9f61255b527333`
- **배포 상태**: 최신 (v39.26)

### 도메인 라우팅
| 도메인 | 상태 | 동작 |
|--------|------|------|
| `koist.ai.kr` | Active + Google CA SSL | 200 OK (메인 사이트) |
| `www.koist.ai.kr` | Active + Google CA SSL | 200 OK (메인 사이트) |
| `www.koist.kr` | Active + Google CA SSL | 301 → `koist.ai.kr` |
| `koist.kr` (apex) | Viaweb 옛 사이트 | 변경 안 함 (나중에 처리) |

### D1 데이터베이스
- **이름**: `webapp-production`
- **ID**: `91f1eb2f-e9fa-45e8-8bea-4958ce74727a`
- **바인딩**: `DB`
- **기존 테이블**: `inquiries` (id, name, company, email, phone, subject, message, created_at)

### 백업
- **v39.26 백업 URL**: https://www.genspark.ai/api/files/s/CT0pmXmi (36.1 MB)
- **다운로드**: `curl -L "https://www.genspark.ai/api/files/s/CT0pmXmi" -o webapp_v39.26.tar.gz`

### 이메일 (절대 건드리지 말 것)
- **도메인**: `@koist.kr`
- **MX**: ebizworks.co.kr (Viaweb DNS에서 그대로 유지)
- **상태**: 정상 송수신

---

## 💡 AI(클로드)에게 전달할 메시지 템플릿

집에서 작업 재개 시 새 세션에서 다음과 같이 말씀하시면 됩니다:

```
docs/PRIVACY_CONSENT_TODO_20260601.md 문서를 읽고,
온라인 상담 폼(/support/inquiry)에 개인정보 수집·이용 동의를
옵션 A로 추가해줘. 작업 순서대로 진행하면 돼.
```

또는:

```
v39.26에서 멈춘 작업 이어가자.
docs/PRIVACY_CONSENT_TODO_20260601.md 확인하고
개인정보 동의 추가 작업 시작해줘.
```

---

## ⚠️ 주의사항

1. **이메일 보호**: Viaweb DNS의 MX/TXT 레코드는 절대 건드리지 말 것
2. **빌드 시간**: `npm run build`는 약 7~8분 걸림 (transforming 단계 정상)
3. **마이그레이션 순서**: 로컬 먼저 → 프로덕션 (실수 방지)
4. **DB 변경 시**: 기존 inquiries 데이터의 `consent_personal_info`는 NULL/0 이므로 별도 정책 필요
5. **테스트 필수**: 배포 후 반드시 실제 폼에서 동의 체크 → 제출 테스트

---

## 🎯 옵션 A 완료 후 예상 효과

✅ **법적 리스크 제거**: 5천만원 과태료 회피
✅ **기관 신뢰도 회복**: 정보보호 평가 기관의 본보기
✅ **사용자 신뢰**: 투명한 개인정보 처리
✅ **DB 추적 가능**: 향후 동의 이력 증빙 가능
✅ **즉시 효과**: 배포 즉시 적용

---

**작성자**: Claude AI
**작성일**: 2026-06-01
**다음 작업 예정일**: 사용자가 집에서 작업 재개 시

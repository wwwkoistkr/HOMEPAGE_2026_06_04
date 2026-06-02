/**
 * v40.2 — 등급/구분 표시 별칭 매핑
 *
 * 목적: DB의 긴 텍스트를 화면 표시 시 짧은 별칭으로 변환
 * - DB 원본은 그대로 보존 (정보 손실 없음)
 * - 표시 시점에만 매핑 적용
 * - title 속성에 원본을 함께 출력해 마우스 호버 시 전체 명칭 확인 가능
 *
 * 사용자 결정 (2026-06-02):
 *   - "안티바이러스" → "안티바이"
 *   - "보안약점 분석도구" → "보안약점도구"
 */

const GRADE_ALIASES: Record<string, string> = {
  '안티바이러스 제품 (Mobile)': '안티바이 제품 (Mobile)',
  '안티바이러스제품(Linux)': '안티바이 제품 (Linux)',
  '소스코드 보안약점 분석도구': '소스코드 보안약점도구',
  '모듈형 안티바이러스 제품': '모듈형 안티바이 제품',
};

/**
 * 등급(assurance_level) 표시용 별칭 반환
 * 매핑이 없으면 원본 그대로 반환
 */
export function getGradeDisplay(raw: string | null | undefined): string {
  if (!raw) return '-';
  return GRADE_ALIASES[raw] || raw;
}

/**
 * 별칭이 적용되었는지 여부 (title 속성 사용 판단용)
 */
export function isAliased(raw: string | null | undefined): boolean {
  if (!raw) return false;
  return raw in GRADE_ALIASES;
}

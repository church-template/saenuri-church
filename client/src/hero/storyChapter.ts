// StoryHero 스크롤 위치 → 장 번호. 순수 함수라 DOM 없이 테스트한다.
// 장 0 = 스플릿(첫 화면), 1..count-1 = 과거 장, count = 마지막 "지금" 장.
export function chapterAt(
  scrollTop: number,
  sectionTop: number,
  viewport: number,
  count: number,
): number {
  const i = Math.round((scrollTop - sectionTop) / viewport);
  return Math.min(count, Math.max(0, i));
}

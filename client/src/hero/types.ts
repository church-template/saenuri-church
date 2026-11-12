// 히어로 미디어 — 영상/이미지를 동등하게 지원하는 판별 유니온.
// CrossHero(T8, 메인)·DeptHero(T9, 부서)가 공유한다. (가이드 13.3 / 14A·14B)
export type HeroMedia =
  | { type: "video"; src: string; poster?: string }
  | { type: "image"; src: string; alt?: string };

// 콜라주 타일 — HeroReveal 전용. 비율이 레이아웃의 **입력**이라 필수다: 컬럼 폭을 사진 비율에서
// 역산해 좌·우 컬럼과 중앙 카드의 높이를 맞추기 때문이다(크롭 0). HeroMedia에 aspect를 붙이지
// 않는 이유는 CrossHero·DeptHero가 그 타입을 공유하는데 비율을 알 필요가 없어서다.
export interface CollageTile {
  src: string;
  alt?: string;
  /** 가로 / 세로 */
  aspect: number;
}

// 메인 스토리 히어로(StoryHero) — 사진으로 교회 역사를 넘기는 스크롤 연출. 콘텐츠는 constants/storyHero.ts.
/** 과거로 갈수록 바래는 배경 톤 */
export type StoryTone = "none" | "fade1" | "fade2" | "mono";

export interface StoryCard {
  src: string;
  /** 카드 안쪽 하단 캡션이자 이미지 alt */
  caption: string;
}

export interface StoryChapter {
  id: string;
  /** 큰 연도 숫자(예: "1990") */
  year: string;
  /** 연도 옆 작은 표기(예: "7월 8일", "~ 2006년") */
  yearSuffix?: string;
  /** 제목 — 줄 단위 */
  title: string[];
  desc: string;
  verse?: { lines: string[]; cite: string };
  bg: { src: string; tone: StoryTone; credit?: string };
  /** 우하단에 기울여 겹치는 사진 0~3장 */
  cards: StoryCard[];
}

export interface StoryHeroContent {
  intro: { mark: string; sub: string; bg: string }; // 첫 화면 커튼 — bg 사진 위 문구
  split: {
    eyebrow: string;
    /** 제목 줄 — highlight와 같은 문자열 조각은 강조색 */
    title: string[];
    highlight: string;
    lead: string[];
    info: { label: string; value: string }[];
    bg: string;
    /** [뒤 왼쪽, 뒤 오른쪽, 앞(마지막 장의 풀스크린 사진)] */
    cards: [StoryCard, StoryCard, StoryCard];
  };
  chapters: StoryChapter[];
  /** 마지막 "지금" 장 — 풀스크린 사진 위 로고 + 교회 표어 */
  now: { logo: string; line: string };
  backLabel: string;
}

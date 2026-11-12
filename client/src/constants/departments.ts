// 공개 "사역(부서) 소개" 단일 출처 — 메인 페이지처럼 프론트 상수로 주입한다(하드코딩 금지, 가이드 12장).
// 백엔드 `department`(교인 정보관리·어드민)와 별개. 공개 인트로 페이지는 이 상수만으로 자립 동작한다.
// 히어로 미디어는 /public/dept/{slug}.webp 관례를 따른다 — 메인의 /hero.mp4와 동일.
import type { HeroMedia } from "@/hero/types";

export interface DeptFeature {
  icon: string; // 직렬화 키 — 컴포넌트에서 lucide 아이콘으로 매핑(상수는 직렬화 가능 값만)
  title: string;
  desc: string;
}

export interface DeptInfoItem {
  label: string;
  value: string;
}

export interface DeptProgram {
  name: string;
  desc: string;
}

export interface DeptPhoto {
  src: string;
  alt: string;
}

// 미션팀 색 — 팀 이름이 곧 색이라 작은 점으로만 쓴다(DESIGN.md `team-dot`, 단일 액센트 원칙의 제한적 예외).
export type TeamColor = "orange" | "skyblue" | "red" | "blue" | "green" | "purple";

// 기울인 사진 카드 한 장 — 캡션은 사진에 실제로 찍힌 것만 적는다(시기·행사를 추정해 붙이지 않는다).
export interface DeptSnap {
  src: string;
  alt: string;
  caption: string;
}

// 팀의 한 해 — 교회·블로그로 확인된 활동만 넣는다. 비어 있으면 구간째 미노출.
export interface DeptYearItem {
  when: string; // "5월"처럼 풀어 쓴 시기
  title: string;
  desc: string;
  photo?: DeptSnap;
}

export interface Department {
  slug: string; // URL 키(/departments/{slug}) — 백엔드 id와 무관, 프론트가 큐레이션
  name: string;
  leader?: string;
  description: string; // raw 마크다운 → MarkdownContent
  media: HeroMedia; // DeptHero placeholder
  caption: string[]; // 풀스크린 확장 후 등장 카피 — 줄 단위 배열
  children?: Department[]; // 하위부서(옵션)
  // 부서 상세 보강 섹션(모두 옵션 — 미기입 부서는 기존과 동일하게 렌더)
  intro?: { heading: string; lead: string };
  features?: DeptFeature[];
  info?: DeptInfoItem[];
  activities?: string[];
  programs?: DeptProgram[];
  gallery?: DeptPhoto[];
  invite?: { heading: string; body: string };
  // 미션팀 전용(모두 옵션 — 없으면 해당 표시·구간 미노출)
  team?: TeamColor; // 팀 색 점
  generation?: string; // 세대 라벨(목록의 "세대 한 줄"·상세 하단 내비)
  summary?: string; // 목록 한 줄 소개
  snaps?: DeptSnap[]; // 사진 더미(상세 최대 3장) — 첫 장이 목록 사진
  year?: DeptYearItem[]; // 한 해 구간
}

const FALLBACK_THUMB = "/dept/default.webp";

// 사진을 받으면 public/dept/{slug}.webp(히어로 2000px)·dept/{slug}/{n}.webp(갤러리 1600px)로 넣고 media를 바꾼다.

// 미션팀 — 새누리교회는 부서를 색깔 이름의 "미션팀"으로 부른다(블로그 2022년 글 기준 5개 + 예배·찬양 세션팀 퍼플).
// 메가메뉴 "미션팀" 카테고리와 동일 구성. 담당자·모임 장소는 교회 확인 전이라 비워 둔다
// (옵션 필드 생략 → 해당 섹션 미노출). 사진은 블로그에서 팀이 확인된 것만 쓴다(근거는 팀별 주석).
export const DEPARTMENTS: Department[] = [
  {
    slug: "orange",
    name: "오렌지 미션팀",
    description:
      "**어린이 주일학교**입니다.\n\n주일 오전 9시 30분 교회학교예배로 모여, 어린이들이 말씀 안에서 자라 갑니다. 여름에는 어린이 여름성경학교를 엽니다.",
    media: { type: "image", src: "/dept/orange.webp", alt: "강단 앞에 함께 선 오렌지 미션팀 아이들과 선생님" },
    caption: ["말씀 안에서 자라는", "어린이 주일학교"],
    team: "orange",
    generation: "어린이",
    summary: "어린이 주일학교입니다. 여름에는 여름성경학교를 엽니다.",
    // 사진 2~15는 교회가 준 오렌지 미션팀 사진(2026-11). 캡션·alt는 사진에 보이는 것만 적는다.
    snaps: [
      { src: "/dept/orange/2.webp", alt: "어버이주일 예배 강단 앞에 선 어린이들", caption: "어버이주일 예배에서" },
      { src: "/dept/orange/12.webp", alt: "카페에서 브이를 하는 아이들", caption: "카페에서 다 함께" },
      { src: "/dept/orange/9.webp", alt: "산타 모자를 쓰고 무대에 선 아이들", caption: "산타 모자를 쓰고 무대에서" },
    ],
    // 근거: 블로그 2024년 5월 결산 글(어린이주일 선물), 2025년 여름성경학교 후기 글.
    year: [
      {
        when: "5월",
        title: "어린이주일",
        desc: "어린이주일에는 집사님들이 준비한 선물을 받습니다.",
      },
      {
        when: "7월",
        title: "여름성경학교",
        desc: "찬양과 율동, 성경퀴즈, 요리 시간에 이어 선생님이 아이들의 발을 씻겨 주는 세족식으로 마칩니다.",
        photo: { src: "/dept/orange/1.webp", alt: "오렌지 미션팀 여름성경학교 포스터", caption: "여름성경학교 포스터" },
      },
    ],
    // 앞 8장은 장면이 겹치지 않게 골랐다(갤러리는 8장씩 연다).
    gallery: [
      { src: "/dept/orange/4.webp", alt: "매트에 앉아 보드를 들고 손을 든 아이들" },
      { src: "/dept/orange/13.webp", alt: "매트에 앉아 앞에 선 선생님의 말씀을 듣는 아이들" },
      { src: "/dept/orange/15.webp", alt: "VICTORY 현수막 아래 매트에 앉은 아이" },
      { src: "/dept/orange/6.webp", alt: "수첩을 들고 매트에 앉은 아이" },
      { src: "/dept/orange/11.webp", alt: "테이블에 둘러앉아 활동하는 아이들과 선생님" },
      { src: "/dept/orange/14.webp", alt: "강단 앞에 줄지어 선 아이들" },
      { src: "/dept/orange/7.webp", alt: "매트에 둘러앉은 아이들과 선생님" },
      { src: "/dept/orange/3.webp", alt: "추수감사예배 강단 앞에 선 아이들과 청소년들" },
      { src: "/dept/orange/5.webp", alt: "매트에 앉아 보드에 답을 적는 아이" },
      { src: "/dept/orange/8.webp", alt: "매트에 앉아 보드를 든 아이들" },
      { src: "/dept/orange/12.webp", alt: "카페에서 브이를 하는 아이들" },
      { src: "/dept/orange/9.webp", alt: "산타 모자를 쓰고 무대에 선 아이들" },
      { src: "/dept/orange/10.webp", alt: "강단 앞에 함께 선 아이들과 선생님" },
    ],
    intro: {
      heading: "오렌지 미션팀 소개",
      lead: "새누리교회의 다음 세대, 어린이 주일학교입니다.",
    },
    info: [
      { label: "대상", value: "어린이" },
      { label: "모임", value: "주일 오전 9:30 교회학교예배" },
    ],
    invite: {
      heading: "오렌지 미션팀에서 함께해요",
      body: "어린이 누구나 환영합니다. 주일 아침, 친구들과 함께 예배해요.",
    },
  },
  {
    slug: "skyblue",
    name: "스카이블루 미션팀",
    description:
      "**청년부**의 한 팀입니다.\n\n20대 청년과 대학생, 미혼 30대 청년이 함께 모여 예배하고 교제합니다.",
    media: { type: "image", src: "/dept/skyblue.webp", alt: "공원 바위 앞에 모인 스카이블루 미션팀" },
    caption: ["함께 예배하고", "함께 꿈꾸는 청년"],
    team: "skyblue",
    generation: "20대 · 대학생 · 미혼 30대",
    summary: "또래 청년들이 함께 예배하고 교제하는 청년부입니다.",
    // 근거: 블로그 2022년 6월 스카이블루 팀장 글 "새벽이슬 같은" — "새누리교회 스카이블루미션팀(2019~2022)" 묶음 사진.
    snaps: [
      { src: "/dept/skyblue.webp", alt: "공원 바위 앞에 모인 스카이블루 미션팀", caption: "스카이블루 미션팀" },
      { src: "/dept/skyblue/1.webp", alt: "둘러앉아 식사하는 스카이블루 미션팀", caption: "함께하는 식사" },
      { src: "/dept/skyblue/2.webp", alt: "카페에 모인 스카이블루 미션팀", caption: "카페에서" },
    ],
    info: [{ label: "대상", value: "20대 청년·대학생·미혼 30대" }],
    invite: {
      heading: "스카이블루 미션팀에서 함께해요",
      body: "처음 오셔도 괜찮아요. 또래 청년들과 함께 예배하고 교제해요.",
    },
  },
  {
    slug: "red",
    name: "레드 미션팀",
    description: "**청년부**의 한 팀입니다.\n\n결혼한 청년과 30대 후반~40대 청년이 함께합니다.",
    media: { type: "image", src: "/dept/red.webp", alt: "레드 미션팀과 블루 미션팀이 목사님, 사모님과 함께한 모임" },
    caption: ["가정을 세우며", "함께 걷는 청년"],
    team: "red",
    generation: "기혼 청년 · 30대 후반~40대",
    summary: "가정을 꾸린 청년들이 함께 걷는 청년부입니다.",
    // 근거: 블로그 2022년 6월 레드 미션팀 성도 글의 사진 설명 "목사님 사모님 그리고 레드미션, 블루미션팀과 함께".
    snaps: [
      {
        src: "/dept/red.webp",
        alt: "레드 미션팀과 블루 미션팀이 목사님, 사모님과 함께한 모임",
        caption: "목사님, 사모님, 블루 미션팀과 함께",
      },
    ],
    info: [{ label: "대상", value: "기혼 청년·30대 후반~40대" }],
    invite: {
      heading: "레드 미션팀에서 함께해요",
      body: "가정을 꾸린 청년이라면 누구나 환영합니다.",
    },
  },
  {
    slug: "blue",
    name: "블루 미션팀",
    description:
      "40대 가정이 자녀와 함께하는 미션팀입니다.\n\n보이지 않는 곳에서 교회를 섬기며, 부모와 자녀가 함께 신앙을 이어 갑니다.",
    media: { type: "image", src: "/dept/blue.webp", alt: "예배당 강단 앞에 선 블루 미션팀 세 가정과 자녀들" },
    caption: ["자녀와 함께", "교회를 섬기는 가정"],
    team: "blue",
    generation: "40대 가정과 자녀",
    summary: "부모와 자녀가 함께 교회를 섬기며 신앙을 이어 갑니다.",
    // 근거: 블로그 2022년 6월 "블루미션팀을 소개합니다" 글의 단체 사진 두 장.
    snaps: [
      { src: "/dept/blue.webp", alt: "예배당 강단 앞에 선 블루 미션팀 세 가정과 자녀들", caption: "세 가정과 자녀들" },
      { src: "/dept/blue/1.webp", alt: "예배당 강단 앞에 선 블루 미션팀", caption: "블루 미션팀" },
    ],
    info: [{ label: "대상", value: "40대 가정과 자녀" }],
    invite: {
      heading: "블루 미션팀에서 함께해요",
      body: "자녀를 둔 가정이라면 함께 모여 교제해요.",
    },
  },
  {
    slug: "green",
    name: "그린 미션팀",
    description: "**여선교회**입니다.\n\n기도와 섬김으로 교회와 가정을 세웁니다.",
    media: { type: "image", src: "/dept/green.webp", alt: "어버이주일 예배에서 특송하는 그린 미션팀" },
    caption: ["기도와 섬김으로", "교회를 세우는 여선교회"],
    team: "green",
    generation: "여성도",
    summary: "기도와 섬김으로 교회와 가정을 세우는 여선교회입니다.",
    // 근거: 블로그 2024년 5월 결산 글 "어버이주일에는 그린미션팀 성도님들께서 … 특송".
    snaps: [
      { src: "/dept/green.webp", alt: "어버이주일 예배에서 특송하는 그린 미션팀", caption: "어버이주일 특송" },
    ],
    info: [{ label: "대상", value: "여성도" }],
    invite: {
      heading: "그린 미션팀에서 함께해요",
      body: "여성도 누구나 환영합니다.",
    },
  },
  // 세대 팀이 아니라 예배·찬양 세션팀이라 세대 줄 끝에 둔다. 사진 미확보 → 기본 이미지·스냅 없음.
  {
    slug: "purple",
    name: "퍼플 미션팀",
    description: "**예배와 찬양**을 이끄는 세션팀입니다.",
    media: { type: "image", src: "/dept/default.webp", alt: "퍼플 미션팀" },
    caption: ["찬양으로", "예배를 이끄는 세션팀"],
    team: "purple",
    generation: "예배 · 찬양",
    summary: "예배와 찬양을 이끄는 세션팀입니다.",
    invite: {
      heading: "퍼플 미션팀에서 함께해요",
      body: "찬양으로 예배를 섬기고 싶은 분이라면 누구나 환영합니다.",
    },
  },
];

// 목록·상세 페이지 카피.
export const DEPT_PAGE = {
  eyebrow: "미션팀",
  title: "미션팀 안내",
  empty: "등록된 미션팀이 없습니다.",
  listEyebrow: "3대가 함께하는 새누리교회",
  headline: ["어린이부터 어른까지,", "여섯 색깔 미션팀"],
  lead: "새누리교회는 부서를 색깔 이름의 미션팀으로 부릅니다. 나이와 삶의 자리에 맞는 팀에서 함께 예배하고 교제해요.",
  more: "자세히 보기",
  leaderLabel: "인도",
  subHeading: "하위 부서",
} as const;

// 상세 보강 섹션 헤딩 — 하드코딩 금지(컴포넌트가 아닌 상수에서 주입).
export const DEPT_SECTIONS = {
  info: "알림 사항",
  activities: "주요 활동",
  programs: "특별 프로그램",
  gallery: "활동 사진",
  galleryMore: "사진 더 보기",
  year: "함께하는 한 해",
  teamNavEyebrow: "3대가 함께",
  teamNav: "여섯 미션팀",
} as const;

// 카드 16:9 썸네일 — 영상이면 poster, 없으면 기본 에셋. 순수 함수(테스트 용이).
export function thumbnailOf(media: HeroMedia): string {
  return media.type === "image" ? media.src : (media.poster ?? FALLBACK_THUMB);
}

// slug로 부서 조회(하위까지 깊이 탐색). 상세 페이지·정적 파라미터 생성에서 사용.
export function findDepartment(
  slug: string,
  list: Department[] = DEPARTMENTS,
): Department | undefined {
  for (const d of list) {
    if (d.slug === slug) {
      return d;
    }
    if (d.children) {
      const found = findDepartment(slug, d.children);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

// 모든 부서 slug(하위 포함) — generateStaticParams·검증에서 사용.
export function allDepartmentSlugs(list: Department[] = DEPARTMENTS): string[] {
  return list.flatMap((d) => [d.slug, ...allDepartmentSlugs(d.children ?? [])]);
}

// 공개 "사역(부서) 소개" 단일 출처 — 메인 페이지처럼 프론트 상수로 주입한다(하드코딩 금지, 가이드 12장).
// 미션팀 사진·소개 본문만 backendId로 백엔드 부서 API에서 덮어쓰고, API가 비거나 실패하면 이 상수만으로 자립 동작한다(#32).
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

// 한 팀 안의 부서(오렌지: 유·초·중·고) — 어린 순서로 넣는다. 설명은 교회가 준 것만(없으면 생략).
export interface DeptGroup {
  name: string;
  range: string; // "초등학교 1~6학년"처럼 대상 학년
  desc?: string;
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
  backendId?: number; // 백엔드 부서 id — 있으면 사진·소개를 API에서 읽는다(없거나 실패하면 이 상수로 폴백, #32)
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
  groups?: { heading: string; lead?: string; items: DeptGroup[]; together?: DeptInfoItem }; // 부서 구성
}

const FALLBACK_THUMB = "/dept/default.webp";

// 히어로 사진은 public/dept/{slug}.webp(2000px)로 넣고 media를 바꾼다. 활동 사진은 관리 화면에서 서버 앨범으로 올린다(#32).

// backendId = 운영 백엔드 부서 id(새누리: 1 오렌지 ~ 6 퍼플, church-backend#92).
// 미션팀 — 새누리교회는 부서를 색깔 이름의 "미션팀"으로 부른다(블로그 2022년 글 기준 5개 + 예배·찬양 세션팀 퍼플).
// 메가메뉴 "미션팀" 카테고리와 동일 구성. 담당자·모임 장소는 교회 확인 전이라 비워 둔다
// (옵션 필드 생략 → 해당 섹션 미노출). 사진은 블로그에서 팀이 확인된 것만 쓴다(근거는 팀별 주석).
export const DEPARTMENTS: Department[] = [
  {
    slug: "orange",
    backendId: 1,
    name: "오렌지 미션팀",
    description:
      "**유치부·초등부·중등부·고등부**가 함께하는 교회학교입니다.\n\n주일 오전 9시 30분 교회학교예배로 모여, 아이들과 학생들이 말씀 안에서 자라 갑니다. 여름에는 여름성경학교를 엽니다.",
    media: { type: "image", src: "/dept/orange.webp", alt: "강단 앞에 함께 선 오렌지 미션팀 아이들과 선생님" },
    caption: ["말씀 안에서 자라는", "다음 세대"],
    team: "orange",
    generation: "유·초·중·고",
    summary: "유치부부터 고등부까지 함께하는 주일학교입니다. 여름에는 여름성경학교를 엽니다.",
    // 활동 사진은 서버 앨범(albumId)으로 옮겼다 — 여기엔 목록 사진용 대표 사진만 둔다.
    snaps: [
      { src: "/dept/orange.webp", alt: "강단 앞에 함께 선 오렌지 미션팀 아이들과 선생님", caption: "" },
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
    groups: {
      heading: "유치부부터 고등부까지",
      lead: "오렌지 미션팀은 네 부서가 한 팀입니다.",
      items: [
        { name: "유치부", range: "미취학" },
        { name: "초등부", range: "초등학교 1~6학년" },
        { name: "중등부", range: "중학교 1~3학년" },
        { name: "고등부", range: "고등학교 1~3학년" },
      ],
      together: { label: "함께 모이는 때", value: "주일 오전 9:30 교회학교예배" },
    },
    intro: {
      heading: "오렌지 미션팀 소개",
      lead: "새누리교회의 다음 세대, 유치부·초등부·중등부·고등부가 함께하는 교회학교입니다.",
    },
    info: [
      { label: "대상", value: "유치부·초등부·중등부·고등부" },
      { label: "모임", value: "주일 오전 9:30 교회학교예배" },
    ],
    invite: {
      heading: "오렌지 미션팀에서 함께해요",
      body: "유치부부터 고등부까지 누구나 환영합니다. 주일 아침, 친구들과 함께 예배해요.",
    },
  },
  {
    slug: "skyblue",
    backendId: 2,
    name: "스카이블루 미션팀",
    description:
      "**청년부**의 한 팀입니다.\n\n20대 청년과 대학생, 미혼 30대 청년이 함께 모여 예배하고 교제합니다.",
    media: { type: "image", src: "/dept/skyblue.webp", alt: "카페 원탁에 둘러앉아 손을 펼쳐 보이는 청년들" },
    caption: ["함께 예배하고", "함께 꿈꾸는 청년"],
    team: "skyblue",
    generation: "20대 · 대학생 · 미혼 30대",
    summary: "또래 청년들이 함께 예배하고 교제하는 청년부입니다.",
    // skyblue.webp는 교회가 준 스카이블루 미션팀 사진(2026-11-15, 기존 블로그 사진 교체). 캡션·alt는 사진에 보이는 것만 적는다.
    snaps: [
      { src: "/dept/skyblue.webp", alt: "카페 원탁에 둘러앉아 손을 펼쳐 보이는 청년들", caption: "카페에서" },
    ],
    info: [{ label: "대상", value: "20대 청년·대학생·미혼 30대" }],
    invite: {
      heading: "스카이블루 미션팀에서 함께해요",
      body: "처음 오셔도 괜찮아요. 또래 청년들과 함께 예배하고 교제해요.",
    },
  },
  {
    slug: "red",
    backendId: 3,
    name: "레드 미션팀",
    description: "**여선교회**입니다.\n\n30대 이상 결혼한 여성도가 함께합니다.",
    media: { type: "image", src: "/dept/red.webp", alt: "레드 미션팀과 블루 미션팀이 목사님, 사모님과 함께한 모임" },
    caption: ["가정을 세우며", "함께 걷는 여선교회"],
    team: "red",
    generation: "30대 이상 기혼 여성도",
    summary: "30대 이상 결혼한 여성도가 함께하는 여선교회입니다.",
    // 근거: 블로그 2022년 6월 레드 미션팀 성도 글의 사진 설명 "목사님 사모님 그리고 레드미션, 블루미션팀과 함께".
    snaps: [
      {
        src: "/dept/red.webp",
        alt: "레드 미션팀과 블루 미션팀이 목사님, 사모님과 함께한 모임",
        caption: "목사님, 사모님, 블루 미션팀과 함께",
      },
    ],
    info: [{ label: "대상", value: "30대 이상 기혼 여성도" }],
    invite: {
      heading: "레드 미션팀에서 함께해요",
      body: "30대 이상 결혼한 여성도라면 누구나 환영합니다.",
    },
  },
  {
    slug: "blue",
    backendId: 4,
    name: "블루 미션팀",
    description:
      "**남선교회**입니다.\n\n30대 이상 결혼한 남성도가 함께하며, 보이지 않는 곳에서 교회를 섬깁니다.",
    media: { type: "image", src: "/dept/blue.webp", alt: "예배당 강단 앞에 선 블루 미션팀 세 가정과 자녀들" },
    caption: ["가정을 세우며", "교회를 섬기는 남선교회"],
    team: "blue",
    generation: "30대 이상 기혼 남성도",
    summary: "30대 이상 결혼한 남성도가 함께하는 남선교회입니다.",
    // 근거: 블로그 2022년 6월 "블루미션팀을 소개합니다" 글의 단체 사진 두 장.
    snaps: [
      { src: "/dept/blue.webp", alt: "예배당 강단 앞에 선 블루 미션팀 세 가정과 자녀들", caption: "세 가정과 자녀들" },
    ],
    info: [{ label: "대상", value: "30대 이상 기혼 남성도" }],
    invite: {
      heading: "블루 미션팀에서 함께해요",
      body: "30대 이상 결혼한 남성도라면 누구나 환영합니다.",
    },
  },
  {
    slug: "green",
    backendId: 5,
    name: "그린 미션팀",
    description: "**50대 이상 중장년층**이 함께합니다.\n\n기도와 섬김으로 교회와 가정을 세웁니다.",
    media: { type: "image", src: "/dept/green.webp", alt: "어버이주일 예배에서 특송하는 그린 미션팀" },
    caption: ["기도와 섬김으로", "교회를 세우는 중장년"],
    team: "green",
    generation: "50대 이상 중장년",
    summary: "기도와 섬김으로 교회와 가정을 세우는 50대 이상 중장년층입니다.",
    // 근거: 블로그 2024년 5월 결산 글 "어버이주일에는 그린미션팀 성도님들께서 … 특송".
    snaps: [
      { src: "/dept/green.webp", alt: "어버이주일 예배에서 특송하는 그린 미션팀", caption: "어버이주일 특송" },
    ],
    info: [{ label: "대상", value: "50대 이상 중장년" }],
    invite: {
      heading: "그린 미션팀에서 함께해요",
      body: "50대 이상 성도라면 누구나 환영합니다.",
    },
  },
  // 세대 팀이 아니라 예배·찬양 세션팀이라 세대 줄 끝에 둔다. 사진 미확보 → 기본 이미지·스냅 없음.
  {
    slug: "purple",
    backendId: 6,
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

// 백엔드 부서 번호로 공개 미션팀 상수 조회(하위까지). 관리 화면 미리보기가 공개 페이지와 같은 이름·기본 사진을 쓰게 한다.
export function findDepartmentByBackendId(
  id: number,
  list: Department[] = DEPARTMENTS,
): Department | undefined {
  for (const d of list) {
    if (d.backendId === id) return d;
    const found = findDepartmentByBackendId(id, d.children ?? []);
    if (found) return found;
  }
  return undefined;
}

// 모든 부서 slug(하위 포함) — generateStaticParams·검증에서 사용.
export function allDepartmentSlugs(list: Department[] = DEPARTMENTS): string[] {
  return list.flatMap((d) => [d.slug, ...allDepartmentSlugs(d.children ?? [])]);
}

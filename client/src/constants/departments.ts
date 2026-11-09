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
}

const FALLBACK_THUMB = "/dept/default.webp";

// 사진을 받으면 public/dept/{slug}.webp(히어로 2000px)·dept/{slug}/{n}.webp(갤러리 1600px)로 넣고 media를 바꾼다.

// 미션팀 — 새누리교회는 부서를 색깔 이름의 "미션팀"으로 부른다(블로그 2022년 글 기준 5개).
// 메가메뉴 "미션팀" 카테고리와 동일 구성. 담당자·모임 장소·활동 사진은 교회 확인 전이라 비워 둔다
// (옵션 필드 생략 → 해당 섹션 미노출). 대표 사진 미수령이라 기본 썸네일을 쓴다.
const teamMedia = (name: string): HeroMedia => ({ type: "image", src: FALLBACK_THUMB, alt: name });

export const DEPARTMENTS: Department[] = [
  {
    slug: "orange",
    name: "오렌지 미션팀",
    description:
      "**어린이 주일학교**입니다.\n\n주일 오전 9시 30분 교회학교예배로 모여, 어린이들이 말씀 안에서 자라 갑니다. 여름에는 어린이 여름성경학교를 엽니다.",
    media: teamMedia("오렌지 미션팀"),
    caption: ["말씀 안에서 자라는", "어린이 주일학교"],
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
    media: teamMedia("스카이블루 미션팀"),
    caption: ["함께 예배하고", "함께 꿈꾸는 청년"],
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
    media: teamMedia("레드 미션팀"),
    caption: ["가정을 세우며", "함께 걷는 청년"],
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
    media: teamMedia("블루 미션팀"),
    caption: ["자녀와 함께", "교회를 섬기는 가정"],
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
    media: teamMedia("그린 미션팀"),
    caption: ["기도와 섬김으로", "교회를 세우는 여선교회"],
    info: [{ label: "대상", value: "여성도" }],
    invite: {
      heading: "그린 미션팀에서 함께해요",
      body: "여성도 누구나 환영합니다.",
    },
  },
];

// 목록·상세 페이지 카피.
export const DEPT_PAGE = {
  eyebrow: "미션팀",
  title: "미션팀 안내",
  empty: "등록된 미션팀이 없습니다.",
  leaderLabel: "인도",
  subHeading: "하위 부서",
} as const;

// 상세 보강 섹션 헤딩 — 하드코딩 금지(컴포넌트가 아닌 상수에서 주입).
export const DEPT_SECTIONS = {
  info: "알림 사항",
  activities: "주요 활동",
  programs: "특별 프로그램",
  gallery: "활동 사진",
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

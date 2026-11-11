// 정적 페이지 콘텐츠·예배 시간·CTA 카피. 배포 시 이 파일만 교체(스펙 D4). 샘플 문구.
import type { HeroMedia } from "@/hero/types";
import type { TeamColor } from "@/constants/departments";

// 소망 본문 세그먼트 — 의미 구절 자체를 상징색 글자로(괄호 표기 없이). color 없는 조각은 평문.
export interface HopeSegment {
  text: string;
  color?: "blue" | "green" | "red" | "orange";
}

// 새누리교회 블로그 소개문(축복의 통로) 기반. 상징색 구절은 로고 의미 미수령이라 쓰지 않는다(평문 1세그먼트).
const HOPE_BODY: HopeSegment[] = [
  {
    text: "하나님이 기뻐하시는 사람들을 세우고, 하나님의 은혜와 축복을 함께 나누는 교회",
  },
];

export const ABOUT = {
  title: "소개 및 비전",
  statement: "가정을 세우는 교회",
  statementHighlight: "가정", // 대표문구에서 primary로 강조할 단어
  intro: [
    "새누리교회는 가정을 세우는 교회입니다.",
    "새누리교회는 3대가 함께 예배하는 교회입니다.",
  ],
  symbolismHeading: "로고에 담긴 의미",
  // 로고 = 다섯 미션팀 색 조각이 한 집을 이루고, 비운 자리가 십자가(docs/brand/logo.svg).
  // 의미 풀이는 블로그 비전·팀 소개 기반 초안 — 교회 확인 전. 순서는 세대(어린이→어른).
  symbolismLead:
    "다섯 미션팀의 색이 모여 한 집을 이루고, 그 가운데 비워진 자리가 십자가가 됩니다. 어린이부터 어른까지 모든 세대가 십자가에 맞닿아 하나의 가정을 이루는 교회입니다. “여호와께서 집을 세우지 아니하시면 세우는 자의 수고가 헛되며” (시 127:1)",
  symbolism: [
    {
      color: "오렌지",
      team: "orange",
      title: "어린이",
      lines: [
        "말씀 안에서 자라는 다음 세대입니다.",
        "“마땅히 행할 길을 아이에게 가르치라 그리하면 늙어도 그것을 떠나지 아니하리라” (잠 22:6)",
      ],
    },
    {
      color: "스카이블루",
      team: "skyblue",
      title: "청년",
      lines: [
        "함께 예배하고 교제하며 믿음의 길을 찾는 청년들입니다.",
        "“너는 청년의 때에 너의 창조주를 기억하라” (전 12:1)",
      ],
    },
    {
      color: "레드",
      team: "red",
      title: "가정을 꾸린 청년",
      lines: [
        "새 가정을 믿음 위에 세워 가는 젊은 부부들입니다.",
        "“오직 나와 내 집은 여호와를 섬기겠노라” (수 24:15)",
      ],
    },
    {
      color: "블루",
      team: "blue",
      title: "가정과 자녀",
      lines: [
        "부모와 자녀가 함께 교회를 섬기며 신앙을 이어 갑니다.",
        "“네 자녀에게 부지런히 가르치며” (신 6:7)",
      ],
    },
    {
      color: "그린",
      team: "green",
      title: "기도와 섬김의 바탕",
      lines: [
        "로고의 바닥처럼, 기도와 섬김으로 교회와 가정을 받칩니다.",
        "“쉬지 말고 기도하라” (살전 5:17)",
      ],
    },
  ] as { color: string; team: TeamColor; title: string; lines: string[] }[],
  hope: {
    heading: "새누리 교회 비전",
    body: HOPE_BODY,
  },
  story: {
    heading: "새누리 교회는",
    lead: [
      "하나님이 기뻐하시는 교회",
      "하나님의 은혜와 축복을 새롭게 누리는 교회",
      "한 영혼을 천하보다 귀하게 여기는 교회",
      "사랑과 행복이 있는 교회",
    ],
    paragraphs: [
      "기독교한국침례회 소속으로 복음주의를 지향하는 사랑의 공동체입니다.",
      "상한 영혼과 삶에 지친 이들에게 희망과 용기를 주며, 쉴 수 있는 안식처를 제공하는 교회입니다.",
      "따뜻한 마음으로 빛과 소금의 역할을 하는 미래 지향적 공동체입니다.",
      "하나님이 기뻐하시고 사람들에게 칭찬받는 아름답고 행복한 교회입니다.",
    ],
  },
};

export interface HistoryItem {
  id: string; // 앵커(#id)·aria-labelledby·React key 전용 — 표시엔 쓰지 않는다
  year: string; // 표시 연월 (예: "2011년 4월")
  text: string; // 헤드라인
  desc: string; // 한 줄 설명
  details: string[]; // 세부 항목
  significance: string; // 의의 풀쿼트
  media?: HeroMedia; // 배경 미디어(placeholder, /public/history/{id}.jpg). 후일 교체
}

export interface HistoryContent {
  title: string;
  intro: string; // 인트로 한 줄(placeholder 카피 — 후일 수정)
  items: HistoryItem[];
}

export const HISTORY = {
  title: "연혁",
  intro: "한 가정의 열두 명에서 시작된 새누리교회의 발자취입니다.",
  items: [
    {
      id: "1990-07",
      year: "1990년 7월",
      text: "첫 예배",
      desc: "한 가정에서 열두 명이 첫 예배를 드렸습니다.",
      details: [
        "1990년 7월 8일 전옥춘 권사님 가정에서 첫 예배",
        "열두 명이 함께 드린 예배",
        "황영기 목사님 1990년 6월 26일 목사 안수",
      ],
      significance: "새누리교회 이야기의 출발점",
    },
    {
      id: "1990-09",
      year: "1990년 9월",
      text: "거여동 지하 예배당",
      desc: "두 달을 기도로 준비해 첫 예배당을 얻었습니다.",
      details: [
        "송파구 거여동 4-3 지하로 이전",
        "두 달 동안 기도로 준비",
      ],
      significance: "처음으로 마련한 예배 처소",
      media: { type: "image", src: "/assets/history/1990-2006-geoyeo-4-3-now.webp", alt: "옛 거여동 예배당 자리의 현재 모습" },
    },
    {
      id: "1991",
      year: "1991년",
      text: "마천동 2층",
      desc: "마천동으로 예배 처소를 옮겼습니다.",
      details: [
        "송파구 마천동 128-38 2층으로 이전",
      ],
      significance: "공동체가 자라며 옮긴 두 번째 예배당",
      media: { type: "image", src: "/assets/history/1990-2006-macheon-now.webp", alt: "옛 마천동 예배당 자리의 현재 모습" },
    },
    {
      id: "1993",
      year: "1993년",
      text: "거여동 4층",
      desc: "거여동 202번지 4층에서 오랜 시간 예배했습니다.",
      details: [
        "거여동 202번지 4층으로 이전",
        "약 10년간 이곳에서 예배",
        "지금은 재개발로 흔적이 사라짐",
      ],
      significance: "가장 오래 머문 예배 처소",
      media: { type: "image", src: "/assets/history/1990-2006-geoyeo-202-now.webp", alt: "재개발로 사라진 거여동 예배당 일대" },
    },
    {
      id: "2006-07",
      year: "2006년 7월",
      text: "하남 전원교회",
      desc: "하남시 감이동으로 이전 감사예배를 드렸습니다.",
      details: [
        "창립 16주년 봄부터 이전 준비",
        "하남시 감이동 전원교회로 이전",
        "2006년 7월 이전 감사예배",
      ],
      significance: "전원교회를 꿈꾸며 내디딘 걸음",
      media: { type: "image", src: "/assets/history/2006-hanam-thanksgiving.webp", alt: "2006년 하남 이전 감사예배" },
    },
    {
      id: "2006-08",
      year: "2006년 8월",
      text: "화재, 천막의 예배",
      desc: "이전 한 달 만에 화재로 모든 것을 잃었습니다.",
      details: [
        "화재 후 천막과 컨테이너에서 예배",
        "매일 저녁 9시 온 성도가 모여 기도",
        "예레미야 29장 11절 말씀을 붙들고 나아감",
      ],
      significance: "모든 것을 잃은 자리에서 다시 시작한 믿음",
      media: { type: "image", src: "/assets/history/2006-tent-worship.webp", alt: "화재 후 천막 예배" },
    },
    {
      id: "2007-04",
      year: "2007년 4월",
      text: "보정동 이전",
      desc: "용인 보정동 누리에뜰로 이전했습니다.",
      details: [
        "용인시 기흥구 보정동 누리에뜰 321호로 이전",
        "빈 상가를 고쳐 예배당을 세움",
      ],
      significance: "지금의 새누리교회가 자리 잡은 곳",
      media: { type: "image", src: "/assets/history/2007-bojeong-first-worship.webp", alt: "보정동 예배당에서 드린 예배" },
    },
    {
      id: "2012",
      year: "2012년",
      text: "청년부 시작",
      desc: "청년부가 시작되었습니다.",
      details: [
        "청년 공동체의 출발",
      ],
      significance: "다음 세대가 교회의 기둥으로 자라기 시작",
    },
    {
      id: "2022-07",
      year: "2022년 7월",
      text: "창립 32주년 버스킹",
      desc: "탄천에서 이웃과 노래로 만났습니다.",
      details: [
        "죽전 탄천에서 버스킹 문화사역",
        "노란 단체 티셔츠를 맞춰 입고 지역 주민과 소통",
      ],
      significance: "교회 밖 이웃을 향한 섬김",
      media: { type: "image", src: "/assets/history/2022-busking.webp", alt: "2022년 탄천 버스킹" },
    },
    {
      id: "2023-07",
      year: "2023년 7월",
      text: "창립 33주년",
      desc: "창립 33주년 감사예배를 드렸습니다.",
      details: [
        "2023년 7월 9일 창립 33주년 감사예배",
        "지나온 은혜에 감사하며 다가올 비전을 꿈꿈",
      ],
      significance: "모든 것이 하나님의 은혜",
      media: { type: "image", src: "/assets/church/group-33rd-2023.webp", alt: "창립 33주년 감사예배 단체 사진" },
    },
  ],
} satisfies HistoryContent;

// 핵심가치 — 교회 소개 자료(새누리 교회 비전) 원문.
export const VISION = {
  title: "핵심가치",
  points: [
    "하나님의 임재와 축복을 경험하고 찬양하는 예배",
    "하나님의 은혜와 축복을 나누는 선교와 구제하는 교회",
    "하나님이 가장 기뻐하시는 잃은 영혼을 찾는 교회",
    "하나님의 말씀으로 훈련받고 순종하는 공동체",
  ],
};

// 목회자 인사말 페이지 — 소개·인사말·약력·목회 철학. 사진은 자산 준비 후 image에 주입.
export type PastorPhilosophyKey =
  | "worship"
  | "bible"
  | "fellowship"
  | "community"
  | "nextgen"
  | "mission";

// 인사말·학력·인용문은 교회에서 받기 전이라 비운다(지어내지 않음). 비어 있는 항목은 화면에서 생략된다.
export const PASTOR = {
  title: "목회자 인사말",
  name: "황영기",
  position: "담임목사",
  degree: "",
  image: { src: "/assets/pastor/navy.webp", alt: "황영기 담임목사", aspect: 1600 / 2400 },
  pullQuote: "",
  intro:
    "황영기 목사님은 1990년 6월 26일 목사 안수를 받고, 같은 해 7월 새누리교회를 개척해 지금까지 섬기고 있습니다.",
  greeting: [] as string[],
  credentials: {
    heading: "약력",
    items: ["1990년 목사 안수", "1990년 새누리교회 개척, 담임목사"],
  },
  philosophy: {
    heading: "목회 철학",
    items: [
      { key: "bible", text: "말씀과 성령의 능력으로 복음을 전하는 교회" },
      { key: "fellowship", text: "가정을 세우는 교회" },
      { key: "nextgen", text: "3대가 함께 예배하는 교회" },
    ] satisfies { key: PastorPhilosophyKey; text: string }[],
  },
};

// 교회 사진(정적 시설 사진) — public/photos/{interior,exterior} 정적 에셋을 그룹별로 주입.
// 분류·경로·alt는 상수에서만(하드코딩 금지). alt는 편집 쉬운 인덱스 기본값.
export type ChurchPhoto = { src: string; alt: string };
export type PhotoGroup = { key: string; title: string; photos: ChurchPhoto[] };

export const CHURCH_PHOTOS: {
  title: string;
  empty: string;
  groups: PhotoGroup[];
} = {
  title: "교회 사진",
  empty: "교회 사진을 준비 중입니다.",
  groups: [
    {
      key: "interior",
      title: "교회 내부",
      photos: [
        { src: "/assets/church/worship-2023.webp", alt: "주일예배" },
        { src: "/assets/church/altar-2023.webp", alt: "예배당 강단" },
      ],
    },
    // 외부 사진 미수령 — 받으면 assets/church/exterior-*.webp로 추가.
    { key: "exterior", title: "교회 외부", photos: [] },
  ],
};

export const LOCATION = {
  title: "오시는 길",
  lead: "새누리교회를 찾아오시는 길을 안내합니다.",
  // 약도 이미지 미수령 — null이면 외부 지도 버튼만 노출한다.
  map: null as { src: string; alt: string } | null,
  directionsHeading: "찾아오는 방법",
  directions: [
    {
      key: "transit",
      title: "대중교통",
      lines: [
        "수인분당선 죽전역 2번 출구에서 약 800m",
        "버스 660 · 720-3 · 1101 · 1101N · 7007-1 · 8100",
      ],
    },
    {
      key: "car",
      title: "자가용",
      lines: ["내비게이션: '새누리교회' 또는 '죽전로 20' 검색"],
    },
  ],
};

export const WORSHIP = {
  title: "예배 시간 안내",
  regularLead: "매주 드리는 정기 예배에 함께해 주세요.",
  sermonCta: "설교 말씀 보기", // 정기예배 섹션 하단 → 설교 목록 진입 CTA(#109)
  specialHeading: "특별 예배",
  specialLead: "절기마다 함께 드리는 특별 예배입니다.",
  placeHeading: "예배 장소 안내",
  placeLead: "예배는 누리에뜰 321호에서 드립니다.",
  placeLandmark: "누리에뜰 3층",
  attendHeading: "예배 참석 안내",
  attendLead: "처음 오시는 분도 편하게 오세요.",
  attendNotes: [
    "수인분당선 죽전역 2번 출구에서 걸어서 약 12분입니다.",
    "누리에뜰 3층 321호로 오시면 됩니다.",
  ],
  hero: { src: "/assets/church/worship-2023.webp", alt: "새누리교회 주일예배" },
  nextLabel: "다음 예배",
  // 처음 오는 분을 위한 주일 흐름 — WORSHIP_SERVICES의 주일 예배 셋을 시간순으로(같은 사실).
  flowEyebrow: "처음 오시는 분께",
  flowHeading: "주일은 이렇게 흘러갑니다",
  flow: [
    { time: "오전 9:30", title: "교회학교예배", desc: "오렌지 미션팀 어린이들이 먼저 예배합니다." },
    { time: "오전 11:00", title: "주일예배", desc: "온 성도가 함께 드리는 주일 예배입니다." },
    { time: "오후 1:40", title: "주일오후예배", desc: "주일 오후에 드리는 예배입니다." },
  ],
  weekdayHeading: "주중에도 모입니다",
};

export interface WorshipService {
  name: string;
  time: string;
  place: string; // 기존 유지 — 메인 ScheduleCard 소비
  praise?: string; // 찬양 시간 서브라인(없으면 생략)
  notes: string[]; // 예배별 설명 3줄
  // "다음 예배" 계산용 구조 데이터 — time(표시 문자열)과 같은 사실. 요일은 0=주일 … 6=토, 한국 시간.
  schedule: { days: number[]; hour: number; minute: number };
  primary?: boolean; // 예배 안내 히어로에 크게 세우는 대표 예배(주일예배)
}
export const WORSHIP_SERVICES: WorshipService[] = [
  {
    name: "교회학교예배",
    time: "주일 오전 9:30",
    place: "누리에뜰 321호",
    schedule: { days: [0], hour: 9, minute: 30 },
    notes: [
      "오렌지 미션팀(어린이 주일학교)",
      "주일예배 전에 드리는 어린이 예배",
    ],
  },
  {
    name: "주일예배",
    time: "주일 오전 11:00",
    place: "누리에뜰 321호",
    schedule: { days: [0], hour: 11, minute: 0 },
    primary: true,
    notes: [
      "온 성도가 함께 드리는 주일 예배",
    ],
  },
  {
    name: "주일오후예배",
    time: "주일 오후 1:40",
    place: "누리에뜰 321호",
    schedule: { days: [0], hour: 13, minute: 40 },
    notes: [
      "주일 오후에 드리는 예배",
    ],
  },
  {
    name: "금요기도회",
    time: "금요일 저녁 9:00",
    place: "누리에뜰 321호",
    schedule: { days: [5], hour: 21, minute: 0 },
    notes: [
      "한 주를 기도로 마무리하는 시간",
    ],
  },
  {
    name: "새벽예배",
    time: "월~금 오전 5:30",
    place: "누리에뜰 321호",
    schedule: { days: [1, 2, 3, 4, 5], hour: 5, minute: 30 },
    notes: [
      "하루를 말씀과 기도로 여는 시간",
    ],
  },
];

export interface SpecialService {
  name: string;
  date: string; // 배지 — "1월 1일", "부활절 주일" 등 서술형 혼용
  time: string;
  desc: string;
}
export const SPECIAL_SERVICES: SpecialService[] = [
  { name: "부활절 예배", date: "부활절 주일", time: "주일예배 시간", desc: "예수님의 부활을 기념하는 예배" },
  { name: "창립기념 감사예배", date: "7월", time: "주일예배 시간", desc: "1990년 7월 8일 창립을 기념하며 감사드리는 예배" },
  { name: "추수감사절 예배", date: "추수감사 주일", time: "주일예배 시간", desc: "한 해의 은혜에 감사드리는 예배" },
];

export const CTA_BAND = {
  heading: "처음 오셨나요?",
  primary: "새가족 안내",
  secondary: "오시는 길",
};

// 메인 사역 카드(스펙 2026-06-12 H4·H5) — VISION.points의 3축을 카드로 승격.
// 아이콘은 직렬화 가능한 키만 — lucide 컴포넌트 매핑은 MinistryCards가 담당.
export const MINISTRY = { title: "우리의 사역" };
export interface Ministry {
  key: "worship" | "nextgen" | "serving";
  title: string;
  desc: string;
}
export const MINISTRIES: Ministry[] = [
  { key: "worship", title: "말씀과 성령의 예배", desc: "말씀과 성령의 능력으로 예배하는 교회입니다." },
  { key: "nextgen", title: "3대가 함께", desc: "어린이부터 청년, 가정까지 미션팀으로 함께 자랍니다." },
  { key: "serving", title: "이웃을 향한 섬김", desc: "버스킹 문화사역과 선교로 이웃에게 다가갑니다." },
];

// 메인 데이터 섹션 타이틀·빈 상태 문구(가이드 13.2 빈 배열 처리) — 콘텐츠 하드코딩 금지(12장).
export const MAIN_SECTIONS = {
  sermons: { title: "최신 설교", empty: "등록된 설교가 없습니다" },
  notices: { title: "공지", empty: "등록된 공지가 없습니다" },
  events: { title: "다가오는 일정", empty: "등록된 일정이 없습니다" },
  // 소식 섹션(설교·공지·일정)만 불러오기 실패했을 때 그 자리에 표시하는 문구. 페이지 나머지는 정상.
  error: "지금은 교회 소식을 불러올 수 없어요. 잠시 후 다시 시도해 주세요.",
} as const;

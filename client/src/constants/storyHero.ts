// 메인 스토리 히어로 콘텐츠 — 사실 근거는 새누리교회 블로그 연혁 글(assets/SOURCES.md).
// 장 순서는 과거 → 현재. 마지막 "지금" 장은 split.cards[2](카페 단체 사진)가 덮개 없이 풀스크린으로 펼쳐진다.
import type { StoryHeroContent } from "@/hero/types";
import { CHURCH_LOGO, HERO_CAPTION } from "./church";

const H = "/assets/history";
const C = "/assets/church";

export const STORY_HERO: StoryHeroContent = {
  intro: { mark: "축복합니다", sub: "새누리교회", bg: `${C}/intro-sign.webp` },
  split: {
    eyebrow: "SINCE 1990 · 용인 보정동",
    title: ["열두 명의 가정예배가", "33년의 공동체가", "되었습니다"],
    highlight: "33년의 공동체",
    lead: ["하나님이 기뻐하시는 사람을 세우는, 3대가 함께하는 새누리교회입니다.", "처음 오셔도 괜찮아요."],
    info: [
      { label: "주일예배", value: "오전 11:00 · 오후 1:40" },
      { label: "금요기도회", value: "저녁 9:00" },
      { label: "오시는 길", value: "죽전로 20, 누리에뜰 321호" },
    ],
    bg: `${C}/group-33rd-2023.webp`,
    cards: [
      { src: `${C}/worship-2023.webp`, caption: "새누리교회 주일예배" },
      { src: `${C}/praise-worship.webp`, caption: "함께 드리는 찬양" },
      { src: `${C}/cafe-gathering.webp`, caption: "함께 모인 교회 가족" },
    ],
  },
  chapters: [
    {
      id: "1990-first",
      year: "1990",
      yearSuffix: "7월 8일",
      title: ["한 가정에서, 열두 명이", "첫 예배를 드렸습니다"],
      desc: "전옥춘 권사님 댁 거실. 그날의 사진은 남아 있지 않지만, 33년의 이야기는 거기서 시작됐습니다.",
      bg: {
        src: "/assets/stock/pray-bible-patrick-fore-unsplash.webp",
        tone: "none",
        credit: "Photo: Patrick Fore / Unsplash",
      },
      cards: [],
    },
    {
      id: "1990-2006",
      year: "1990",
      yearSuffix: "~ 2006년",
      title: ["지하에서 4층까지, 세 번의 이사"],
      desc: "거여동과 마천동을 오가며 16년. 그 자리들은 지금 재개발로 대부분 사라졌습니다.",
      bg: { src: `${H}/1990-2006-geoyeo-202-now.webp`, tone: "fade2" },
      cards: [
        { src: `${H}/1990-2006-geoyeo-4-3-now.webp`, caption: "거여동 4-3 지하 · 그 자리의 지금" },
        { src: `${H}/1990-2006-macheon-now.webp`, caption: "마천동 128-38 2층 · 그 자리의 지금" },
        { src: `${H}/1990-2006-geoyeo-202-now.webp`, caption: "거여동 202 · 재개발로 사라짐" },
      ],
    },
    {
      id: "2006-hanam",
      year: "2006",
      yearSuffix: "7월",
      title: ["하남 감이동, 전원교회를 꿈꾸며"],
      desc: "창립 16주년 봄부터 준비해 이전 감사예배를 드렸습니다.",
      bg: { src: `${H}/2006-hanam-outdoor.webp`, tone: "fade2" },
      cards: [
        { src: `${H}/2006-hanam-thanksgiving-sermon.webp`, caption: "2006년 7월 창립기념 및 이전감사예배" },
        { src: `${H}/2006-hanam-outdoor.webp`, caption: "하남 감이동 전원교회" },
      ],
    },
    {
      id: "2006-fire",
      year: "2006",
      yearSuffix: "8월",
      title: ["한 달 만의 화재,", "천막과 컨테이너의 예배"],
      desc: "모든 것을 잃은 자리에서 아이부터 어른까지 매일 저녁 모여 기도했습니다.",
      verse: {
        lines: ["너희를 향한 나의 생각은 평안이요 재앙이 아니니라", "너희에게 미래와 희망을 주는 것이니라"],
        cite: "렘 29:11",
      },
      bg: { src: `${H}/2006-tent-worship.webp`, tone: "mono" },
      cards: [
        { src: `${H}/2006-container-worship.webp`, caption: "남은 컨테이너에서, 매일 밤 9시" },
        { src: `${H}/2006-tent-worship.webp`, caption: "천막 예배" },
      ],
    },
    {
      id: "2007-bojeong",
      year: "2007",
      yearSuffix: "4월",
      title: ["용인 보정동, 누리에뜰 321호"],
      desc: "빈 상가를 손수 고쳐 지금의 예배당을 세웠습니다.",
      bg: { src: `${H}/2007-bojeong-empty.webp`, tone: "fade1" },
      cards: [
        { src: `${H}/2007-bojeong-build.webp`, caption: "빈 상가를 고치던 날들" },
        { src: `${H}/2007-bojeong-first-worship.webp`, caption: "보정동 예배당" },
      ],
    },
    {
      id: "2022-busking",
      year: "2022",
      title: ["교회 밖으로, 탄천 버스킹"],
      desc: "창립 32주년, 노란 티셔츠를 맞춰 입고 이웃에게 노래로 인사했습니다.",
      bg: { src: `${H}/2022-busking.webp`, tone: "fade1" },
      cards: [
        { src: `${H}/2022-busking-prep.webp`, caption: "버스킹 준비" },
        { src: `${H}/2022-team-tshirt.webp`, caption: "노란 단체 티셔츠" },
      ],
    },
    {
      id: "2023-33rd",
      year: "2023",
      yearSuffix: "33주년",
      title: ["그때의 꼬맹이들이", "이제 교회의 기둥입니다"],
      desc: "태아였던 아이들까지 자라 결혼하고, 3대가 함께 예배합니다.",
      bg: { src: `${C}/group-33rd-2023.webp`, tone: "fade1" },
      cards: [
        { src: `${H}/early-kids-outdoor.webp`, caption: "그때의 꼬맹이들" },
        { src: `${H}/2006-kids-door.webp`, caption: "문 앞에 모인 아이들" },
        { src: `${C}/youth-2023.webp`, caption: "지금의 청년들" },
      ],
    },
  ],
  now: { logo: CHURCH_LOGO.src, line: HERO_CAPTION[0] },
  backLabel: "처음으로",
};

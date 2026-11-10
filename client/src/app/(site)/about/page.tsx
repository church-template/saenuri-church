import type { Metadata } from "next";
import { VisionHero } from "@/components/about/VisionHero";
import { SymbolismList } from "@/components/about/SymbolismList";
import { HopeStatement } from "@/components/about/HopeStatement";
import { VisionGoals } from "@/components/about/VisionGoals";
import { ChurchStory } from "@/components/about/ChurchStory";
import { ABOUT } from "@/constants/content";

export const metadata: Metadata = {
  title: ABOUT.title,
  alternates: { canonical: "/about" },
};

// 소개 및 비전 — 상수 구동 서버 컴포넌트. 흰→회색→흰→회색→흰 밴드 리듬(빅타이포 에디토리얼).
export default function AboutPage() {
  return (
    <>
      <VisionHero />
      {/* 로고 상징 의미를 받기 전(빈 배열)에는 섹션을 그리지 않는다. */}
      {ABOUT.symbolism.length > 0 ? <SymbolismList /> : null}
      <HopeStatement />
      <VisionGoals />
      <ChurchStory />
    </>
  );
}

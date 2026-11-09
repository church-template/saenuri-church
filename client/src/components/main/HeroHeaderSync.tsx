"use client";

import { useState, type ReactNode } from "react";
import { SiteHeader } from "@/components/shell/SiteHeader";
import StoryHero from "@/hero/StoryHero";
import { STORY_HERO } from "@/constants/storyHero";
import { REDUCED_MQ, useMediaFlag } from "@/lib/hooks/useMediaFlag";

export interface HeroHeaderSyncProps {
  /** 히어로 뒤에 이어지는 본문 섹션들 — main 랜드마크 안에 함께 둔다. */
  children?: ReactNode;
}

// 메인 전용 합성 — SiteHeader 투명↔솔리드·인트로 숨김을 StoryHero 콜백에 배선.
// reduced는 정적 나열이라 on-dark 투명 헤더가 어울리지 않음 → 처음부터 solid 고정.
export function HeroHeaderSync({ children }: HeroHeaderSyncProps) {
  const reduced = useMediaFlag(REDUCED_MQ);
  const [solid, setSolid] = useState(false);
  // 첫 페인트부터 숨긴다 — 인트로 effect가 돌기 전 헤더가 한 프레임 보였다 사라지는 깜빡임 방지.
  const [concealed, setConcealed] = useState(true);

  return (
    <>
      <SiteHeader variant="transparent" solid={reduced || solid} concealed={!reduced && concealed} />
      <main className="flex-1">
        <StoryHero content={STORY_HERO} onSolid={setSolid} onConcealHeader={setConcealed} />
        {children}
      </main>
    </>
  );
}

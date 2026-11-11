import type { Metadata } from "next";
import { connection } from "next/server";
import { HeroHeaderSync } from "@/components/main/HeroHeaderSync";
import { WorshipSection } from "@/components/main/WorshipSection";
import { SermonSection } from "@/components/main/SermonSection";
import { NoticeSection } from "@/components/main/NoticeSection";
import { EventSection } from "@/components/main/EventSection";
import { MainFeedsError } from "@/components/main/MainFeedsError";
import { CtaBand } from "@/components/shell/CtaBand";
import { Container } from "@/components/shell/Container";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { getMain } from "@/lib/api/main";
import { MinistryCards } from "@/components/main/MinistryCards";

// 홈 정본 URL — 루트 layout에 canonical을 두면 전 페이지가 홈을 정본으로 가리키는 버그라
// 페이지별로 선언한다(layout.tsx 주석 참조). title·description은 루트 default 사용.
export const metadata: Metadata = { alternates: { canonical: "/" } };

// 메인(가이드 13.4) — 공개 콘텐츠 서버 fetch. SiteShell 대신 투명 헤더를 직접 합성(T07 §5.2).
export default async function Home() {
  // CI가 백엔드 없이 build하므로 prerender(= 빌드 시 /api/main 호출)를 요청 시점으로 미룬다(스펙 D8).
  // force-dynamic과 달리 fetch 데이터 캐시(revalidate 60)는 그대로 동작 — 백엔드 부하는 60s 캐시가 흡수.
  await connection();
  // 소식 fetch만 격리: 실패해도 여기서 null로 흡수해 Hero·연혁·사역·예배시간·CTA·푸터는 그대로 산다.
  const main = await getMain().catch((error: unknown) => {
    console.error(error); // 서버 로깅 지점, 화면 비노출(app/error.tsx 관례와 동일)
    return null;
  });

  return (
    <>
      {/* 연혁은 스토리 히어로가 대신한다 — HistoryBand(연혁 띠)는 메인에서 뺐다(이슈 #1 Q2). */}
      <HeroHeaderSync>
        <MinistryCards />
        <WorshipSection />
        {/* 소식(설교·공지·일정)만 장애 격리 — 로드 실패 시 이 자리에만 폴백 */}
        {main ? (
          <>
            <SermonSection sermons={main.sermons} />
            {/* 공지·일정은 한 소식 밴드에 나란히(좁은 폭은 세로) — 짧은 목록 둘을 따로 세우면 밴드만 늘어난다 */}
            <section className="bg-surface-soft py-section">
              <Container className="grid gap-xxl lg:grid-cols-2">
                <NoticeSection notices={main.notices} />
                <EventSection events={main.upcomingEvents} />
              </Container>
            </section>
          </>
        ) : (
          <MainFeedsError />
        )}
      </HeroHeaderSync>
      <CtaBand />
      <SiteFooter />
    </>
  );
}

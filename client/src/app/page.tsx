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
import { getVisibility, resolveVisibility } from "@/lib/api/visibility";
import { cn } from "@/lib/utils";
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
  // 설정 조회는 실패해도 null(폴백 = 지금 동작)이라 따로 격리하지 않는다.
  const [main, visibility] = await Promise.all([
    getMain().catch((error: unknown) => {
      console.error(error); // 서버 로깅 지점, 화면 비노출(app/error.tsx 관례와 동일)
      return null;
    }),
    getVisibility(),
  ]);
  // 교인만인 공지·일정은 홈 소식 밴드에서 그 칸째 뺀다(스펙 5.4). 둘 다 빠지면 빈 밴드를 남기지 않는다.
  // 설교 섹션은 그대로(글 단위 교인만은 백엔드가 뺀다).
  const levels = resolveVisibility(visibility);
  const showNotices = levels.notices === "PUBLIC";
  const showEvents = levels.events === "PUBLIC";

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
            {showNotices || showEvents ? (
              <section data-testid="main-news-band" className="bg-surface-soft py-section">
                <Container className={cn("grid gap-xxl", showNotices && showEvents && "lg:grid-cols-2")}>
                  {showNotices ? <NoticeSection notices={main.notices} /> : null}
                  {showEvents ? <EventSection events={main.upcomingEvents} /> : null}
                </Container>
              </section>
            ) : null}
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

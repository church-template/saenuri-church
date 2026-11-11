import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { TEAM_DOT } from "@/components/departments/teamColor";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { ABOUT } from "@/constants/content";

// 밴드2 — 회색. 로고의 다섯 미션팀 색을 넘버드 에디토리얼 리스트로(큰 색면 없이 작은 점·헤어라인만).
// 팀 색은 team-dot에만 쓴다 — 오렌지·스카이블루는 흰 바탕 글자 대비가 모자라 제목은 ink로 둔다(DESIGN.md).
export function SymbolismList() {
  return (
    <section className="break-keep bg-surface-soft py-section">
      <Container>
        <div className="grid gap-base lg:grid-cols-[1fr_1.4fr] lg:items-baseline lg:gap-xxl">
          <Reveal>
            <h2 className={cn(typo.displayMd, "text-ink")}>{ABOUT.symbolismHeading}</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className={cn(typo.bodyMd, "text-body")}>{ABOUT.symbolismLead}</p>
          </Reveal>
        </div>

        <ul className="mt-xxl border-t border-hairline">
          {ABOUT.symbolism.map((symbol, i) => (
            <li key={symbol.color} className="border-b border-hairline">
              <Reveal delay={i * 120}>
                <div className="py-xl">
                  <div className="flex items-center gap-sm">
                    <span
                      className={cn("size-3 shrink-0 rounded-full", TEAM_DOT[symbol.team])}
                      aria-hidden="true"
                    />
                    <h3 className={cn(typo.titleLg, "text-ink")}>
                      {`${symbol.color} · ${symbol.title}`}
                    </h3>
                  </div>
                  <div className={cn(typo.bodyLg, "mt-sm text-ink")}>
                    {symbol.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

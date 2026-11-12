import Link from "next/link";
import { Container } from "@/components/shell/Container";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { Department } from "@/constants/departments";
import { teamDot } from "./teamColor";

const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft";

// 여섯 팀 내비(team-nav) — 상세 하단에서 지금 팀이 세대 줄의 어디인지 보여 주고 옆 팀으로 건너가게 한다.
// 현재 팀은 색(점)만이 아니라 굵기·테두리로도 구분한다(색각·고령 대비).
export function TeamNav({
  eyebrow,
  heading,
  departments,
  current,
}: {
  eyebrow: string;
  heading: string;
  departments: Department[];
  current: string;
}) {
  return (
    <section className="bg-surface-soft py-section">
      <Container>
        <p className={cn(typo.caption, "text-primary")}>{eyebrow}</p>
        <h2 className={cn(typo.displayMd, "mt-xs text-ink")}>{heading}</h2>
        <nav aria-label={heading} className="mt-lg">
          <ol className="grid grid-cols-2 gap-xs sm:grid-cols-3 xl:grid-cols-6">
            {departments.map((d) => {
              const isCurrent = d.slug === current;
              return (
                <li key={d.slug}>
                  <Link
                    href={`/departments/${d.slug}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex h-full flex-col gap-xxs rounded-lg border p-base break-keep transition-colors",
                      isCurrent
                        ? "border-ink bg-canvas"
                        : "border-transparent hover:border-hairline hover:bg-canvas",
                      focusRing,
                    )}
                  >
                    <span aria-hidden className={cn("size-3 rounded-full", teamDot(d.team))} />
                    <span className={cn(isCurrent ? typo.bodyStrong : typo.bodyMd, "text-ink")}>
                      {d.name}
                    </span>
                    {d.generation ? (
                      <span className={cn(typo.caption, "text-muted")}>{d.generation}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </section>
  );
}

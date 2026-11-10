import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptYearItem } from "@/constants/departments";
import { SnapCard } from "./SnapCard";
import snap from "./Snap.module.css";

// 한 해 구간(dept-year) — 팀의 1년을 시기순으로. 확인된 활동이 있는 팀에만 노출된다(페이지가 조건부 렌더).
export function DeptYear({ heading, items }: { heading: string; items: DeptYearItem[] }) {
  return (
    <section className="bg-surface-soft py-section">
      <Container>
        <Reveal>
          <h2 className={cn(typo.displayMd, "text-ink")}>{heading}</h2>
        </Reveal>
        <ol className="mt-xl grid gap-xxl sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.title} className="break-keep border-t-2 border-ink pt-base">
              <Reveal delay={i * 120}>
                <p className={cn(typo.datetime, "text-muted")}>{it.when}</p>
                <h3 className={cn(typo.titleMd, "mt-xxs text-ink")}>{it.title}</h3>
                <p className={cn(typo.bodyMd, "mt-xs text-body")}>{it.desc}</p>
                {it.photo ? (
                  // 간격은 래퍼가 갖는다 — 모듈 CSS(.snap margin:0)가 유틸 margin을 이긴다.
                  <div className="mt-lg">
                    <SnapCard snap={it.photo} className={i % 2 === 0 ? snap.tiltB : snap.tiltA} />
                  </div>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

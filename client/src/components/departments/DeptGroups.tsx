import type { CSSProperties } from "react";
import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptGroup, DeptInfoItem, TeamColor } from "@/constants/departments";
import { teamDot } from "./teamColor";
import styles from "./Groups.module.css";

const SIZES = [styles.size0, styles.size1, styles.size2, styles.size3];

// 부서 구성(dept-groups) — 한 미션팀 안의 부서를 어린 순서로 잇는다(오렌지: 유·초·중·고).
// 소개 바로 아래 흰 섹션이라 소개와 한 덩어리로 읽히고, 다음 한 해(회색 밴드)와 교차가 유지된다.
export function DeptGroups({
  heading,
  lead,
  items,
  team,
  together,
}: {
  heading: string;
  lead?: string;
  items: DeptGroup[];
  team?: TeamColor;
  together?: DeptInfoItem;
}) {
  return (
    <Container as="section" className="break-keep py-section">
      <Reveal>
        <h2 className={cn(typo.displayMd, "text-ink")}>{heading}</h2>
        {lead ? <p className={cn(typo.bodyMd, "mt-base text-body")}>{lead}</p> : null}
      </Reveal>
      <div className={cn(styles.flow, "mt-xxl")} style={{ "--count": items.length } as CSSProperties}>
        {/* 선은 따로 등장한다 — Reveal이 남기는 data-revealed 신호로 왼쪽(모바일은 위)부터 그려진다. */}
        <Reveal className={styles.track}>
          <span aria-hidden className={styles.line} />
        </Reveal>
        <ol className={styles.list}>
          {items.map((g, i) => (
            <li key={g.name} className={styles.item}>
              <Reveal delay={150 + i * 120}>
                <span aria-hidden className={styles.dotRow}>
                  <span className={cn(styles.dot, SIZES[Math.min(i, SIZES.length - 1)], teamDot(team))} />
                </span>
                <p className={cn(typo.datetime, "text-muted")}>{g.range}</p>
                <h3 className={cn(typo.titleLg, "mt-xxs text-ink")}>{g.name}</h3>
                {g.desc ? <p className={cn(typo.bodySm, "mt-xs text-body")}>{g.desc}</p> : null}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      {together ? (
        <Reveal>
          <dl className="mt-xxl flex flex-wrap items-baseline gap-x-base gap-y-xxs border-t border-hairline pt-lg">
            <dt className={cn(typo.bodySm, "text-muted")}>{together.label}</dt>
            <dd className={cn(typo.titleMd, "tabular-nums text-ink")}>{together.value}</dd>
          </dl>
        </Reveal>
      ) : null}
    </Container>
  );
}

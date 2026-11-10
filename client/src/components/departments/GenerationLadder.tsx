import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { DEPT_PAGE, type Department } from "@/constants/departments";
import { SnapCard } from "./SnapCard";
import { teamDot } from "./teamColor";
import ladder from "./Ladder.module.css";
import snap from "./Snap.module.css";

const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-sm";

// 미션팀 목록(generation-ladder) — 카드 그리드 대신 세대 순서(어린이→어른)로 한 줄에 세운다.
// "3대가 함께"를 구조로 보여 주려는 것. 설명은 처음부터 다 보이고(고령·모바일), 사진은 확인된 팀에만 붙는다.
export function GenerationLadder({ departments }: { departments: Department[] }) {
  return (
    <ol className={cn(ladder.ladder, "mt-xxl")}>
      {departments.map((d, i) => {
        const photo = d.snaps?.[0];
        return (
          <li key={d.slug} className={ladder.row}>
            <span aria-hidden className={cn(ladder.dot, teamDot(d.team))} />
            <div className="break-keep">
              {d.generation ? (
                <p className={cn(typo.datetime, "text-muted")}>{d.generation}</p>
              ) : null}
              <h2 className={cn(typo.titleLg, "mt-xxs text-ink")}>{d.name}</h2>
              {d.summary ? <p className={cn(typo.bodyMd, "mt-xs text-body")}>{d.summary}</p> : null}
              <Link
                href={`/departments/${d.slug}`}
                aria-label={`${d.name} ${DEPT_PAGE.more}`}
                className={cn(
                  typo.button,
                  "mt-xs inline-flex h-12 items-center gap-xs text-primary hover:underline",
                  focusRing,
                )}
              >
                {DEPT_PAGE.more}
                <ArrowRight size={20} aria-hidden />
              </Link>
            </div>
            {photo ? (
              <SnapCard snap={photo} className={cn(ladder.photo, i % 2 === 0 ? snap.tiltA : snap.tiltB)} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

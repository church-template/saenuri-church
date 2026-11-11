import Link from "next/link";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHead } from "./SectionHead";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { formatEventTime } from "@/lib/date";
import { MAIN_SECTIONS } from "@/constants/content";
import type { EventCardResponse } from "@/lib/api/types";

const E = MAIN_SECTIONS.events;

// 13.4 ⑤ 다가오는 일정 — 소식 밴드(page)의 오른쪽 열. 행 = 월·일 블록 + 제목 + 시간·장소(event-row).
// 월·일은 서버 문자열에서 바로 읽는다(시간대 밀림 방지). 시간 엣지(endAt=null·allDay)는 formatEventTime 한 곳.
// 정렬은 서버 보장(startAt asc) — 프론트 재정렬 금지.
export function EventSection({ events }: { events: EventCardResponse[] }) {
  return (
    <div>
      <SectionHead title={E.title} more={{ label: E.more, href: E.moreHref }} />
      {events.length === 0 ? (
        <EmptyState message={E.empty} className="mt-lg" />
      ) : (
        <ul className="mt-base">
          {events.map((e) => {
            const meta = [formatEventTime(e.startAt, e.endAt, e.allDay), e.location].filter(Boolean).join(" · ");
            return (
              <li key={e.id}>
                <Link
                  href={`/events/${e.id}`}
                  className={cn(
                    "group flex items-center gap-base border-b border-hairline py-base",
                    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                  )}
                >
                  <span className="w-14 shrink-0 text-center">
                    <span className={cn(typo.caption, "block text-muted")}>{Number(e.startAt.slice(5, 7))}월</span>
                    <span className={cn(typo.datetimeLg, "block text-ink")}>{Number(e.startAt.slice(8, 10))}</span>
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        typo.titleSm,
                        "block truncate text-ink transition-colors duration-150 ease-out group-hover:text-primary",
                      )}
                    >
                      {e.title}
                    </span>
                    {meta ? <span className={cn(typo.datetime, "block text-muted")}>{meta}</span> : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

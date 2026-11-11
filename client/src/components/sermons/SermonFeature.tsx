import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { SERMON_LIST } from "@/constants/sermons";
import type { SermonCardResponse } from "@/lib/api/types";
import { formatLongDate, isWithinWeek } from "./sermonGroups";

const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

// 최신 말씀 띠(sermon-feature) — 교인이 목록에 오는 가장 흔한 이유(지난 주일 설교 다시 듣기)를 첫 화면에.
// 띠 전체가 상세 링크이고, "말씀 보기"는 링크 안의 표시용 버튼 모양이다(중첩 인터랙티브 금지).
// className: 배치 측이 높이를 맞출 때(메인 3:2 그리드에서 옆 카드 두 장 높이로 h-full) 넘긴다.
export function SermonFeature({ sermon, now, className }: { sermon: SermonCardResponse; now: Date; className?: string }) {
  const label = isWithinWeek(sermon.preachedAt, now) ? SERMON_LIST.featuredRecent : SERMON_LIST.featuredLatest;
  const meta = [formatLongDate(sermon.preachedAt), sermon.preacher, sermon.series].filter(Boolean).join(" · ");
  return (
    <Link
      href={`/sermons/${sermon.id}`}
      className={cn(
        "group flex flex-col gap-lg rounded-xl bg-surface-dark p-xl break-keep sm:p-xxl lg:flex-row lg:items-end lg:justify-between",
        focusRing,
        className,
      )}
    >
      <div>
        <p className={cn(typo.captionStrong, "text-primary-on-dark")}>{label}</p>
        {sermon.scripture ? (
          <p className={cn(typo.titleMd, "mt-base text-on-dark-soft")}>{sermon.scripture}</p>
        ) : null}
        <h2 className={cn(typo.displayLg, "mt-xs text-on-dark group-hover:underline")}>{sermon.title}</h2>
        <p className={cn(typo.datetime, "mt-base text-on-dark-soft")}>{meta}</p>
      </div>
      <span className={cn(buttonVariants("pillCta"), "self-start whitespace-nowrap lg:self-auto")}>
        {SERMON_LIST.featuredCta}
      </span>
    </Link>
  );
}

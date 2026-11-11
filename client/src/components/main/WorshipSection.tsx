import { MapPin } from "lucide-react";
import { Container } from "@/components/shell/Container";
import { SectionHead } from "./SectionHead";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { MAIN_WORSHIP, WORSHIP, WORSHIP_SERVICES, type WorshipService } from "@/constants/content";

const isSunday = (s: WorshipService) => s.schedule.days.length === 1 && s.schedule.days[0] === 0;
// 주일 묶음 안에서는 "주일 " 접두가 라벨과 겹치므로 뗀다(같은 사실을 두 번 읽히지 않게).
const sundayTime = (s: WorshipService) => s.time.replace(/^주일\s*/, "");

function ServiceRows({ label, services, time }: { label: string; services: WorshipService[]; time: (s: WorshipService) => string }) {
  return (
    <div>
      <p className={cn(typo.captionStrong, "text-muted")}>{label}</p>
      <ul className="mt-xs">
        {services.map((s) => (
          <li key={s.name} className="flex items-baseline justify-between gap-base border-b border-hairline py-base">
            <span className={cn(typo.titleSm, "text-ink")}>{s.name}</span>
            <span className={cn(typo.datetime, "text-body")}>{time(s)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 예배 시간 안내(main-worship) — 처음 오는 분이 가장 먼저 찾는 대표 예배를 크게(worship-hero와 같은 원칙),
// 나머지는 주일/주중 시간표로 묶는다. API 없음, 빌드 주입 상수.
export function WorshipSection() {
  const primary = WORSHIP_SERVICES.find((s) => s.primary) ?? WORSHIP_SERVICES[0];
  const others = WORSHIP_SERVICES.filter((s) => s !== primary);
  return (
    <section className="bg-surface-soft py-section">
      <Container>
        <SectionHead
          eyebrow={MAIN_WORSHIP.eyebrow}
          title={WORSHIP.title}
          more={{ label: MAIN_WORSHIP.more, href: MAIN_WORSHIP.moreHref }}
        />
        <div className="mt-lg grid gap-base lg:grid-cols-5">
          <div className="flex flex-col justify-between gap-xl rounded-xl bg-primary-soft p-xl lg:col-span-3">
            <div>
              <p className={cn(typo.captionStrong, "text-primary")}>{MAIN_WORSHIP.primaryLabel}</p>
              <p className={cn(typo.titleMd, "mt-xxs text-ink")}>{primary.name}</p>
              <p className={cn(typo.displayXl, "mt-sm tabular-nums text-ink")}>
                {isSunday(primary) ? sundayTime(primary) : primary.time}
              </p>
            </div>
            <p className={cn(typo.bodyMd, "flex items-center gap-xs text-body")}>
              <MapPin size={20} aria-hidden />
              {WORSHIP.placeLead}
            </p>
          </div>
          <div className="flex flex-col gap-lg rounded-xl border border-hairline bg-surface-card p-xl lg:col-span-2">
            <ServiceRows label={MAIN_WORSHIP.sundayLabel} services={others.filter(isSunday)} time={sundayTime} />
            <ServiceRows label={MAIN_WORSHIP.weekdayLabel} services={others.filter((s) => !isSunday(s))} time={(s) => s.time} />
          </div>
        </div>
      </Container>
    </section>
  );
}

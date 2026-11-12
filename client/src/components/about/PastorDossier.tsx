import {
  BookOpen,
  Church,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Send,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { PASTOR, type PastorPhilosophyKey } from "@/constants/content";

// 철학 키→아이콘 매핑(상수는 직렬화 키만, 색은 currentColor 상속 — MinistryCards 선례).
const PHILOSOPHY_ICONS: Record<PastorPhilosophyKey, LucideIcon> = {
  worship: Church,
  bible: BookOpen,
  fellowship: HeartHandshake,
  community: HandHeart,
  nextgen: GraduationCap,
  mission: Send,
};

type Credential = (typeof PASTOR.credentials.items)[number];

// 같은 해 항목을 한 묶음으로 — 상수 순서를 그대로 지킨다(연도순 정렬은 상수가 책임).
function byYear(items: Credential[]) {
  return items.reduce<{ year: string; items: Credential[] }[]>((groups, item) => {
    const last = groups.at(-1);
    return last?.year === item.year
      ? [...groups.slice(0, -1), { ...last, items: [...last.items, item] }]
      : [...groups, { year: item.year, items: [item] }];
  }, []);
}

// 밴드3 — 회색 밴드. 약력은 큰 연도 + 날짜별 행(연표), 목회 철학은 번호 붙은 큰 선언 행.
// 행 모양은 worship-weekday-rows 결(상단 2px ink 룰 + 1px 헤어라인).
export function PastorDossier() {
  const years = byYear(PASTOR.credentials.items);
  return (
    <section className="bg-surface-soft py-section">
      <Container>
        <h2 className={cn(typo.captionStrong, "text-primary")}>{PASTOR.credentials.heading}</h2>
        {years.map((group) => (
          <div key={group.year} className="mt-xs grid gap-lg lg:grid-cols-[4fr_8fr] lg:items-start">
            <p className={cn(typo.displayMega, "tabular-nums text-ink")}>{group.year}</p>
            <ul className="border-t-2 border-ink">
              {group.items.map((item, i) => (
                <li key={item.text} className="border-b border-hairline">
                  <Reveal delay={i * 120}>
                    <div className="grid grid-cols-[6rem_1fr] gap-base py-lg sm:grid-cols-[9rem_1fr] sm:gap-lg">
                      <span className={cn(typo.datetime, "text-muted")}>{item.date}</span>
                      <span className={cn(typo.titleMd, "break-keep text-ink")}>{item.text}</span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-section border-t-2 border-ink pt-lg">
          <h2 className={cn(typo.captionStrong, "text-primary")}>{PASTOR.philosophy.heading}</h2>
          <ol>
            {PASTOR.philosophy.items.map((item, i) => {
              const Icon = PHILOSOPHY_ICONS[item.key];
              return (
                <li key={item.key} className="border-b border-hairline">
                  <Reveal delay={i * 120}>
                    <div className="grid grid-cols-[3rem_1fr] items-center gap-lg py-xl sm:grid-cols-[5rem_1fr_auto]">
                      <span aria-hidden className={cn(typo.displayLg, "tabular-nums text-primary")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className={cn(typo.displayLg, "break-keep text-ink")}>{item.text}</p>
                      <Icon size={40} strokeWidth={1.5} aria-hidden className="hidden text-muted sm:block" />
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

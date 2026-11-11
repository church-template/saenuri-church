import { Container } from "@/components/shell/Container";
import { SermonCard } from "@/components/cards/SermonCard";
import { SermonFeature } from "@/components/sermons/SermonFeature";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHead } from "./SectionHead";
import { formatDate } from "@/lib/date";
import { MAIN_SECTIONS } from "@/constants/content";
import type { SermonCardResponse } from "@/lib/api/types";

const S = MAIN_SECTIONS.sermons;

// 13.4 ③ 최신 설교 — 가장 최근 설교를 /sermons와 같은 sermon-feature 띠로 크게, 나머지는 텍스트형 카드.
// 정렬은 서버 보장(preachedAt desc) — 프론트 재정렬 금지.
export function SermonSection({ sermons, now = new Date() }: { sermons: SermonCardResponse[]; now?: Date }) {
  const [latest, ...rest] = sermons;
  return (
    <section className="py-section">
      <Container>
        <SectionHead eyebrow={S.eyebrow} title={S.title} more={{ label: S.more, href: S.moreHref }} />
        {latest ? (
          <div className="mt-lg grid gap-base lg:grid-cols-5">
            <div className={rest.length > 0 ? "lg:col-span-3" : "lg:col-span-5"}>
              <SermonFeature sermon={latest} now={now} className="h-full" />
            </div>
            {rest.length > 0 ? (
              <div className="grid gap-base sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
                {rest.map((s) => (
                  <SermonCard
                    key={s.id}
                    title={s.title}
                    preacher={s.preacher}
                    date={formatDate(s.preachedAt)}
                    series={s.series}
                    scripture={s.scripture}
                    href={`/sermons/${s.id}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState message={S.empty} className="mt-lg" />
        )}
      </Container>
    </section>
  );
}

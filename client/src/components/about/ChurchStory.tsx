import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { ABOUT } from "@/constants/content";

// 밴드5 — 흰 캔버스. 좌측 소제목 / 우측 교회 소개(굵은 네 줄 + 본문 문단).
export function ChurchStory() {
  return (
    <Container as="section" className="break-keep py-section">
      <div className="grid gap-lg lg:grid-cols-[1fr_1.6fr] lg:gap-xxl">
        <Reveal>
          <h2 className={cn(typo.displayMd, "text-ink")}>{ABOUT.story.heading}</h2>
        </Reveal>
        <Reveal delay={80}>
          <div className={cn(typo.titleLg, "text-ink")}>
            {ABOUT.story.lead.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className={cn(typo.bodyLg, "mt-xl text-body")}>
            {ABOUT.story.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-lg first:mt-0">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </Container>
  );
}

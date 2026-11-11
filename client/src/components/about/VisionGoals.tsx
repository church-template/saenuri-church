import { BookOpen, Church, HeartHandshake, Search } from "lucide-react";
import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { VISION } from "@/constants/content";

// VISION.points 순서(예배·선교와 구제·잃은 영혼·말씀 훈련)에 대응하는 아이콘(표현용 매핑).
const ICONS = [Church, HeartHandshake, Search, BookOpen] as const;

// 밴드4 — 회색. 핵심가치 4항목을 lucide 아이콘 카드 그리드로(태블릿 이상 2x2·모바일 1-up).
export function VisionGoals() {
  return (
    <section className="break-keep bg-surface-soft py-section">
      <Container>
        <Reveal>
          <h2 className={cn(typo.displayMd, "text-ink")}>{VISION.title}</h2>
        </Reveal>
        <ul className="mt-xxl grid gap-base sm:grid-cols-2">
          {VISION.points.map((point, i) => {
            const Icon = ICONS[i] ?? Church;
            return (
              <li key={point} className="h-full">
                <Reveal delay={i * 100} className="h-full">
                  <div className="flex h-full flex-col gap-base rounded-xl border border-hairline bg-canvas p-xl">
                    <Icon size={32} className="text-primary" aria-hidden="true" />
                    <p className={cn(typo.titleMd, "text-ink")}>{point}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

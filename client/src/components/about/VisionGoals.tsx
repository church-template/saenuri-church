import { BookOpen, Church, HeartHandshake, Search } from "lucide-react";
import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { VISION } from "@/constants/content";

// VISION.points 순서(예배·선교와 구제·잃은 영혼·말씀 훈련)에 대응하는 아이콘(표현용 매핑).
const ICONS = [Church, HeartHandshake, Search, BookOpen] as const;

// 밴드4 — 회색. 핵심가치 4항목을 번호 매긴 문서형 목록으로(목회 철학 pastor-dossier와 같은 결).
// 카드 상자 없이 2px ink 룰 + 헤어라인으로 나눠, 적은 항목을 큰 글씨로 무게 있게 읽힌다(고령 가독).
export function VisionGoals() {
  return (
    <section className="break-keep bg-surface-soft py-section">
      <Container>
        <Reveal>
          <h2 className={cn(typo.displayMd, "text-ink")}>{VISION.title}</h2>
        </Reveal>
        <ol className="mt-xxl border-t-2 border-ink">
          {VISION.points.map((point, i) => {
            const Icon = ICONS[i] ?? Church;
            return (
              <li key={point} className="border-b border-hairline">
                <Reveal delay={i * 120}>
                  <div className="grid grid-cols-[3rem_1fr] items-center gap-lg py-xl sm:grid-cols-[5rem_1fr_auto]">
                    <span aria-hidden className={cn(typo.displayMd, "tabular-nums text-primary")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className={cn(typo.displaySm, "text-ink")}>{point}</p>
                    <Icon size={40} strokeWidth={1.5} aria-hidden="true" className="hidden text-muted sm:block" />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

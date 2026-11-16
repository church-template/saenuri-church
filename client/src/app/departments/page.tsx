import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/SiteShell";
import { Container } from "@/components/shell/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { GenerationLadder } from "@/components/departments/GenerationLadder";
import { DEPARTMENTS, DEPT_PAGE } from "@/constants/departments";
import { getDepartments, withApiCard } from "@/lib/api/departments";
import { CHURCH_NAME } from "@/constants/church";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: DEPT_PAGE.title,
  description: `${CHURCH_NAME}의 사역과 부서를 소개합니다.`,
  alternates: { canonical: "/departments" },
};

// 미션팀 목록 — 세대 한 줄(generation-ladder). 글은 상수, 목록 사진만 API 대표 사진(ISR 60s + "departments" 태그).
// API 실패·미배포면 빈 목록으로 보고 상수 사진 그대로(화면이 깨지지 않게, #32).
export default async function DepartmentsPage() {
  const cards = await getDepartments().catch(() => []);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const departments = DEPARTMENTS.map((d) =>
    d.backendId != null ? withApiCard(d, byId.get(d.backendId)) : d,
  );
  return (
    <SiteShell>
      <Container as="section" className="py-section">
        <p className={cn(typo.caption, "text-primary")}>{DEPT_PAGE.listEyebrow}</p>
        <h1 className={cn(typo.displayLg, "mt-xs break-keep text-ink")}>
          {DEPT_PAGE.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className={cn(typo.bodyMd, "mt-base max-w-[var(--container-narrow)] break-keep text-body")}>
          {DEPT_PAGE.lead}
        </p>
        {DEPARTMENTS.length === 0 ? (
          <EmptyState message={DEPT_PAGE.empty} className="mt-lg" />
        ) : (
          <GenerationLadder departments={departments} />
        )}
      </Container>
    </SiteShell>
  );
}

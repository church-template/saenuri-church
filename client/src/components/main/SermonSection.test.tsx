import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MAIN_SECTIONS } from "@/constants/content";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { SermonSection } from "./SermonSection";

const sermon = {
  id: 1,
  title: "부활의 증인",
  preacher: "김목사",
  series: "요한복음 시리즈",
  scripture: "요한복음 20:19-23",
  preachedAt: "2026-06-01",
  viewCount: 3,
  tags: [{ id: 1, name: "부활" }],
};

describe("SermonSection", () => {
  it("가장 최근 설교는 큰 띠(sermon-feature), 나머지는 카드 — 상세 링크", () => {
    const older = { ...sermon, id: 2, title: "믿음의 경주", preachedAt: "2026-05-25", tags: [] };
    render(<SermonSection sermons={[sermon, older]} now={new Date("2026-06-03T12:00:00+09:00")} />);
    expect(screen.getByText(MAIN_SECTIONS.sermons.title)).toBeDefined();
    expect(screen.getByText("이번 주 말씀")).toBeDefined();
    expect(screen.getByText("부활의 증인").closest("a")?.getAttribute("href")).toBe("/sermons/1");
    expect(screen.getByText("김목사 · 2026. 5. 25.")).toBeDefined();
    expect(screen.getByText("믿음의 경주").closest("a")?.getAttribute("href")).toBe("/sermons/2");
  });

  it("빈 배열이면 섹션 유지 + EmptyState", () => {
    render(<SermonSection sermons={[]} />);
    expect(screen.getByText(MAIN_SECTIONS.sermons.title)).toBeDefined();
    expect(screen.getByText(MAIN_SECTIONS.sermons.empty)).toBeDefined();
  });
});

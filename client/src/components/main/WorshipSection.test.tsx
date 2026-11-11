import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MAIN_WORSHIP, WORSHIP, WORSHIP_SERVICES } from "@/constants/content";
import { WorshipSection } from "./WorshipSection";

describe("WorshipSection", () => {
  it("타이틀과 모든 예배를 렌더하고, 대표 예배를 크게 세운다", () => {
    render(<WorshipSection />);
    expect(screen.getByText(WORSHIP.title)).toBeDefined();
    for (const s of WORSHIP_SERVICES) {
      expect(screen.getByText(s.name)).toBeDefined();
      // 주일 묶음 안에서는 "주일 " 접두를 뗀 시각만 보인다
      expect(screen.getByText(s.time.replace(/^주일\s*/, ""))).toBeDefined();
    }
    const primary = WORSHIP_SERVICES.find((s) => s.primary)!;
    expect(screen.getByText(MAIN_WORSHIP.primaryLabel).parentElement?.textContent).toContain(primary.name);
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PASTOR } from "@/constants/content";
import { PastorDossier } from "./PastorDossier";

afterEach(() => vi.unstubAllGlobals());

describe("PastorDossier", () => {
  it("약력·철학 헤딩과 전 항목을 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(<PastorDossier />);
    expect(screen.getByText(PASTOR.credentials.heading)).toBeDefined();
    for (const item of PASTOR.credentials.items) {
      expect(screen.getByText(item.text)).toBeDefined();
      expect(screen.getByText(item.date)).toBeDefined();
    }
    // 같은 해 항목은 큰 연도 하나로 묶인다
    const years = new Set(PASTOR.credentials.items.map((c) => c.year));
    for (const y of years) expect(screen.getAllByText(y)).toHaveLength(1);
    expect(screen.getByText(PASTOR.philosophy.heading)).toBeDefined();
    for (const item of PASTOR.philosophy.items) {
      expect(screen.getByText(item.text)).toBeDefined();
    }
  });

  it("철학 항목마다 장식 아이콘(svg)을 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const { container } = render(<PastorDossier />);
    expect(container.querySelectorAll("svg").length).toBe(PASTOR.philosophy.items.length);
  });
});

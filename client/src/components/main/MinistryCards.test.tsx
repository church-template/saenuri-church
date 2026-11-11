import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MINISTRY, MINISTRIES } from "@/constants/content";
import { MinistryCards } from "./MinistryCards";

afterEach(() => vi.unstubAllGlobals());

describe("MinistryCards", () => {
  it("섹션 헤딩과 사진 사역 카드 3장(카드 전체 링크)을 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(<MinistryCards />);
    expect(screen.getByRole("heading", { name: MINISTRY.title })).toBeDefined();
    for (const m of MINISTRIES) {
      expect(screen.getByText(m.desc)).toBeDefined();
      expect(screen.getByAltText(m.image.alt)).toBeDefined();
      expect(screen.getByText(m.title).closest("a")?.getAttribute("href")).toBe(m.href);
    }
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ABOUT } from "@/constants/content";
import { ChurchStory } from "./ChurchStory";

afterEach(() => vi.unstubAllGlobals());

describe("ChurchStory", () => {
  it("소개 소제목·네 줄 요약·모든 문단을 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(<ChurchStory />);
    expect(screen.getByText(ABOUT.story.heading)).toBeDefined();
    [...ABOUT.story.lead, ...ABOUT.story.paragraphs].forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeDefined();
    });
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PASTOR } from "@/constants/content";
import { PastorIntro } from "./PastorIntro";

afterEach(() => vi.unstubAllGlobals());

// 본문은 문장 span으로 쪼개 렌더되므로(리딩 스포트라이트) 텍스트는 블록 전체에서 확인한다.
const readingText = (container: HTMLElement) =>
  container.querySelector("[data-reading]")?.textContent?.replace(/\s+/g, " ") ?? "";

describe("PastorIntro", () => {
  it("키커·이름·직분·intro를 렌더하고, 비어 있는 학위는 생략한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const { container } = render(<PastorIntro />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain(PASTOR.name);
    expect(h1.textContent).toContain(PASTOR.position);
    expect(PASTOR.degree).toBe("");
    expect(container.querySelector("h1 + p")).toBeNull();

    const text = readingText(container);
    expect(text).toContain(PASTOR.intro);
  });

  it("본문을 문장 span으로 쪼개고 문단을 가로지르는 인덱스를 부여한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const { container } = render(<PastorIntro />);
    const sentences = [...container.querySelectorAll("[data-reading] span")];
    // 스크롤 구간을 문장 수로 등분하므로 인덱스는 0..n-1로 연속이어야 한다(중복·구멍 = 강조 건너뜀).
    const indexes = sentences.map((s) => (s as HTMLElement).style.getPropertyValue("--i"));
    expect(indexes).toEqual(sentences.map((_, i) => String(i)));

    const stage = container.querySelector("section");
    expect(stage?.style.getPropertyValue("--sentences")).toBe(String(sentences.length));
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SymbolismList } from "./SymbolismList";

// 로고 상징 의미는 교회 자료 수령 전이라 상수가 비어 있다 — 컴포넌트 동작은 픽스처로 검증한다.
const ABOUT = vi.hoisted(() => ({
  symbolismHeading: "로고에 담긴 의미",
  symbolismLead: "네 빛깔에 담은 고백입니다.",
  symbolism: [
    { color: "파랑색", title: "하나님", lines: ["전능하신 하나님의 사랑"] },
    { color: "초록색", title: "세상", lines: ["하나님이 지으신 세상"] },
  ],
}));
vi.mock("@/constants/content", () => ({ ABOUT }));

afterEach(() => vi.unstubAllGlobals());

describe("SymbolismList", () => {
  it("헤딩·리드와 색이름·제목·설명을 모두 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const { container } = render(<SymbolismList />);
    expect(screen.getByText(ABOUT.symbolismHeading)).toBeDefined();
    expect(screen.getByText(ABOUT.symbolismLead)).toBeDefined();
    for (const symbol of ABOUT.symbolism) {
      // 색이름은 상징색 span, " · 제목"은 텍스트 노드로 나뉘어 렌더된다 — 합친 텍스트로 확인.
      expect(container.textContent).toContain(`${symbol.color} · ${symbol.title}`);
      expect(screen.getByText(symbol.lines[0])).toBeDefined();
    }
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PastorQuote } from "./PastorQuote";

// 인용문은 교회 자료 수령 전이라 상수가 비어 있다 — 컴포넌트 동작은 픽스처로 검증한다.
const PASTOR = vi.hoisted(() => ({ pullQuote: "모든 것이 하나님의 은혜입니다.", position: "담임목사", name: "황영기" }));
vi.mock("@/constants/content", () => ({ PASTOR }));

afterEach(() => vi.unstubAllGlobals());

describe("PastorQuote", () => {
  it("핵심 인용문과 직분·이름 배지를 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    const { container } = render(<PastorQuote />);
    expect(screen.getByText(PASTOR.pullQuote)).toBeDefined();
    expect(screen.getByText(`${PASTOR.position} ${PASTOR.name}`)).toBeDefined();
    // 장식 인용 글리프(lucide) 존재
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

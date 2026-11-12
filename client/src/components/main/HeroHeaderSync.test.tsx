import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { HeroHeaderSync } from "./HeroHeaderSync";

function setup(reduced = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: reduced,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
  render(
    <HeroHeaderSync>
      <p>본문</p>
    </HeroHeaderSync>,
  );
}

const banner = () => screen.getByRole("banner").className;

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("HeroHeaderSync", () => {
  it("인트로 동안 투명 헤더가 위로 숨겨지고, 인트로가 끝나면 내려온다", () => {
    vi.useFakeTimers();
    setup();
    expect(banner()).toContain("bg-transparent");
    expect(banner()).toContain("-translate-y-full");
    act(() => vi.advanceTimersByTime(5300)); // 사진판 미로드 → 최대 대기 2.5s + 유지 2.8s
    expect(banner()).not.toContain("-translate-y-full");
  });

  it("히어로를 지나 스크롤하면 solid(라이트 스킨)로 전환한다", () => {
    setup();
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 5000, configurable: true });
      fireEvent.scroll(window);
    });
    expect(banner()).toContain("bg-canvas");
  });

  it("움직임 줄이기면 처음부터 solid이고 숨기지 않는다", () => {
    setup(true);
    expect(banner()).toContain("bg-canvas");
    expect(banner()).not.toContain("-translate-y-full");
  });

  it("본문 children은 main 랜드마크 안에 렌더된다", () => {
    setup();
    expect(screen.getByRole("main")).toBeDefined();
    expect(screen.getByText("본문")).toBeDefined();
  });
});

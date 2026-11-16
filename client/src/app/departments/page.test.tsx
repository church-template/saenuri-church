import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { DEPARTMENTS, DEPT_PAGE } from "@/constants/departments";

vi.mock("next/navigation", () => ({ usePathname: () => "/departments" }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import DepartmentsPage from "./page";

function stubBrowserApis() {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} })));
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
}
afterEach(() => vi.unstubAllGlobals());

const okJson = (body: unknown) => ({ ok: true, status: 200, json: async () => body }) as Response;

describe("DepartmentsPage (사역 목록)", () => {
  it("헤드라인과 세대 한 줄(팀 이름·상세 링크)을 렌더한다(API 실패 → 상수)", async () => {
    stubBrowserApis();
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network"); }));
    render(await DepartmentsPage());
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(DEPT_PAGE.headline.join(""));
    // 팀 이름은 h2 — 헤더 메가메뉴의 동명 nav 링크(<a>)와 충돌 방지
    const first = DEPARTMENTS[0];
    expect(screen.getByRole("heading", { name: first.name, level: 2 })).toBeDefined();
    expect(
      screen.getByRole("link", { name: `${first.name} ${DEPT_PAGE.more}` }).getAttribute("href"),
    ).toBe(`/departments/${first.slug}`);
  });

  it("API 대표 사진이 있는 팀만 목록 사진을 바꾸고, 나머지는 상수 사진을 쓴다", async () => {
    stubBrowserApis();
    vi.stubGlobal("fetch", vi.fn(async () => okJson([
      { id: 3, name: "레드", leader: "", parentId: null, sortOrder: 0, heroMediaId: 42 },
      { id: 4, name: "블루", leader: "", parentId: null, sortOrder: 0, heroMediaId: null },
    ])));
    render(await DepartmentsPage());
    expect(screen.getByAltText("레드 미션팀 대표 사진").getAttribute("src")).toBe("/api/media/42");
    const blue = DEPARTMENTS.find((d) => d.slug === "blue")!;
    expect(screen.getByAltText(blue.snaps![0].alt).getAttribute("src")).toBe(blue.snaps![0].src);
  });
});

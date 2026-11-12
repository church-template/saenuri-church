import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { DEPARTMENTS, DEPT_PAGE, DEPT_SECTIONS } from "@/constants/departments";

vi.mock("next/navigation", () => ({
  usePathname: () => "/departments/student",
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));
// 히어로는 스크롤 연출 분리 — 페이지 합성만 검증. 스크롤 동작은 DeptHero 단위 테스트가 커버.
vi.mock("@/hero/DeptHero", () => ({
  default: ({ title, caption }: { title: string; caption: ReactNode }) => (
    <div data-testid="hero"><h1>{title}</h1><div>{caption}</div></div>
  ),
}));

import DepartmentDetailPage, { generateStaticParams } from "./page";

function stubBrowserApis() {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} })));
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
}
afterEach(() => vi.unstubAllGlobals());

const orange = DEPARTMENTS.find((d) => d.slug === "orange")!;

describe("DepartmentDetailPage (상세)", () => {
  it("제목·본문을 합성한다(상수 구동)", async () => {
    stubBrowserApis();
    const { container } = render(
      await DepartmentDetailPage({ params: Promise.resolve({ slug: "orange" }) }),
    );
    expect(screen.getByRole("heading", { name: orange.name })).toBeDefined(); // 히어로 h1
    expect(container.querySelector(".prose-church")?.textContent).toContain("어린이");
    // 담당자·하위부서 미확보 → 인도 줄·하위부서 섹션 미노출
    expect(screen.queryByText(/인도 ·/)).toBeNull();
    expect(screen.queryByRole("heading", { name: DEPT_PAGE.subHeading })).toBeNull();

    // 확인된 정보만: 알림 사항(대상·모임)과 초대 문구는 노출, 근거 없는 활동·프로그램·사진은 미노출
    expect(screen.getByRole("heading", { name: "알림 사항" })).toBeDefined();
    expect(screen.getByText("주일 오전 9:30 교회학교예배")).toBeDefined();
    expect(screen.getByRole("heading", { name: "오렌지 미션팀에서 함께해요" })).toBeDefined();
    expect(screen.queryByRole("heading", { name: "특별 프로그램" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "활동 사진" })).toBeNull();
  });

  it("확인된 자료가 있는 팀만 한 해 구간을 보이고, 여섯 팀 내비는 현재 팀을 표시한다", async () => {
    stubBrowserApis();
    const first = render(await DepartmentDetailPage({ params: Promise.resolve({ slug: "orange" }) }));
    expect(screen.getByRole("heading", { name: DEPT_SECTIONS.year })).toBeDefined();
    const nav = screen.getByRole("navigation", { name: DEPT_SECTIONS.teamNav });
    expect(nav.querySelector('[aria-current="page"]')?.getAttribute("href")).toBe("/departments/orange");
    first.unmount();

    render(await DepartmentDetailPage({ params: Promise.resolve({ slug: "green" }) }));
    expect(screen.queryByRole("heading", { name: DEPT_SECTIONS.year })).toBeNull();
    expect(
      screen
        .getByRole("navigation", { name: DEPT_SECTIONS.teamNav })
        .querySelector('[aria-current="page"]')
        ?.getAttribute("href"),
    ).toBe("/departments/green");
  });

  it("없는 slug면 notFound()", async () => {
    stubBrowserApis();
    await expect(
      DepartmentDetailPage({ params: Promise.resolve({ slug: "nope" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("generateStaticParams가 모든 부서 slug를 반환한다", () => {
    const params = generateStaticParams();
    expect(params).toEqual(["orange", "skyblue", "red", "blue", "green", "purple"].map((slug) => ({ slug })));
  });
});

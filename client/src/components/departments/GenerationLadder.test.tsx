import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import { GenerationLadder } from "./GenerationLadder";
import type { Department } from "@/constants/departments";

const team = (slug: string, name: string, extra: Partial<Department> = {}): Department => ({
  slug,
  name,
  description: "",
  media: { type: "image", src: `/dept/${slug}.webp` },
  caption: [],
  ...extra,
});

describe("GenerationLadder", () => {
  it("팀을 받은 순서대로 나열하고 세대 라벨·한 줄 소개·상세 링크를 보여 준다", () => {
    render(
      <GenerationLadder
        departments={[
          team("orange", "오렌지 미션팀", { team: "orange", generation: "어린이", summary: "어린이 주일학교" }),
          team("green", "그린 미션팀", { team: "green", generation: "여성도", summary: "여선교회" }),
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain("어린이");
    expect(items[0].textContent).toContain("오렌지 미션팀");
    expect(items[1].textContent).toContain("여선교회");
    expect(screen.getByRole("link", { name: "오렌지 미션팀 자세히 보기" }).getAttribute("href")).toBe(
      "/departments/orange",
    );
  });

  it("사진이 있는 팀만 사진 카드를 보여 준다(없는 팀은 지어내지 않는다)", () => {
    render(
      <GenerationLadder
        departments={[
          team("orange", "오렌지 미션팀", {
            snaps: [{ src: "/dept/orange.webp", alt: "어버이주일 예배", caption: "어버이주일 예배에서" }],
          }),
          team("red", "레드 미션팀"),
        ]}
      />,
    );
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByText("어버이주일 예배에서")).toBeTruthy();
  });
});

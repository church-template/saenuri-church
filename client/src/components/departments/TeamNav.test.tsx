import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import { TeamNav } from "./TeamNav";
import type { Department } from "@/constants/departments";

const team = (slug: string, name: string, generation: string): Department => ({
  slug,
  name,
  generation,
  description: "",
  media: { type: "image", src: `/dept/${slug}.webp` },
  caption: [],
});

describe("TeamNav", () => {
  it("모든 팀을 링크로 나열하고 현재 팀만 aria-current로 표시한다", () => {
    render(
      <TeamNav
        heading="다섯 미션팀"
        eyebrow="3대가 함께"
        current="skyblue"
        departments={[team("orange", "오렌지 미션팀", "어린이"), team("skyblue", "스카이블루 미션팀", "청년")]}
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/departments/orange", "/departments/skyblue"]);
    expect(links[0].getAttribute("aria-current")).toBeNull();
    expect(links[1].getAttribute("aria-current")).toBe("page");
    expect(links[0].textContent).toContain("어린이");
  });
});

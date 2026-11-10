import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeptYear } from "./DeptYear";

describe("DeptYear", () => {
  it("시기·제목·설명을 순서대로 보여 주고, 사진은 있는 항목에만 붙는다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true }))); // Reveal: reduced-motion 경로(IO 미등록)
    render(
      <DeptYear
        heading="함께하는 한 해"
        items={[
          { when: "5월", title: "어린이주일", desc: "선물을 받습니다." },
          {
            when: "7월",
            title: "여름성경학교",
            desc: "찬양하고 요리합니다.",
            photo: { src: "/dept/orange/1.webp", alt: "여름성경학교 포스터", caption: "여름성경학교 포스터" },
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "함께하는 한 해" })).toBeTruthy();
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual([
      expect.stringContaining("5월"),
      expect.stringContaining("7월"),
    ]);
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});

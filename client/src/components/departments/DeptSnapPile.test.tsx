import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeptSnapPile } from "./DeptSnapPile";

describe("DeptSnapPile", () => {
  it("사진을 캡션과 함께 최대 3장까지만 겹쳐 보여 준다", () => {
    const snaps = [1, 2, 3, 4].map((n) => ({ src: `/dept/t/${n}.webp`, alt: `사진 ${n}`, caption: `캡션 ${n}` }));
    render(<DeptSnapPile snaps={snaps} />);
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getByText("캡션 1")).toBeTruthy();
    expect(screen.queryByText("캡션 4")).toBeNull();
  });
});

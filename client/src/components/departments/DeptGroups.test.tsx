import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeptGroups } from "./DeptGroups";

afterEach(() => vi.unstubAllGlobals());

describe("DeptGroups", () => {
  it("부서를 순서대로 학년과 함께 보여 주고, 설명·함께 모이는 때는 있을 때만 붙는다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true }))); // Reveal: reduced-motion 경로
    render(
      <DeptGroups
        heading="유치부부터 고등부까지"
        lead="네 부서가 한 팀입니다."
        team="orange"
        items={[
          { name: "유치부", range: "미취학", desc: "노래로 예배해요." },
          { name: "고등부", range: "고등학교 1~3학년" },
        ]}
        together={{ label: "함께 모이는 때", value: "주일 오전 9:30 교회학교예배" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "유치부부터 고등부까지" })).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["유치부", "고등부"]);
    expect(screen.getByText("고등학교 1~3학년")).toBeTruthy();
    expect(screen.getByText("노래로 예배해요.")).toBeTruthy();
    expect(screen.getByText("주일 오전 9:30 교회학교예배")).toBeTruthy();
  });

  it("함께 모이는 때가 없으면 그 줄을 그리지 않는다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(<DeptGroups heading="부서" items={[{ name: "초등부", range: "초등학교 1~6학년" }]} />);
    expect(screen.queryByText("함께 모이는 때")).toBeNull();
  });
});

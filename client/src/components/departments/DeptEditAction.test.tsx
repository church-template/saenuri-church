import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

const { useMeMock } = vi.hoisted(() => ({ useMeMock: vi.fn() }));
vi.mock("@/lib/auth/useMe", () => ({ useMe: useMeMock }));

import { DeptEditAction } from "./DeptEditAction";

afterEach(() => vi.clearAllMocks());
const renderAction = () => render(<DeptEditAction departmentId={1} slug="orange" />);

describe("DeptEditAction", () => {
  it("DEPT_WRITE 보유자에게 수정 페이지 링크를 보이고, 돌아올 주소로 이 미션팀 화면을 넘긴다", () => {
    useMeMock.mockReturnValue({ data: { permissions: ["DEPT_WRITE"] }, isLoading: false });
    renderAction();
    const href = screen.getByRole("link", { name: "이 팀 수정" }).getAttribute("href") ?? "";
    const url = new URL(href, "http://x");
    expect(url.pathname).toBe("/mypage/manage/departments/1/edit");
    expect(url.searchParams.get("from")).toBe("/departments/orange");
  });

  it("권한이 없으면 아무것도 보이지 않는다", () => {
    useMeMock.mockReturnValue({ data: { permissions: ["NOTICE_WRITE"] }, isLoading: false });
    renderAction();
    expect(screen.queryByRole("link", { name: "이 팀 수정" })).toBeNull();
  });

  it("비로그인(me 없음)이면 보이지 않는다", () => {
    useMeMock.mockReturnValue({ data: undefined, isLoading: false });
    renderAction();
    expect(screen.queryByRole("link", { name: "이 팀 수정" })).toBeNull();
  });
});

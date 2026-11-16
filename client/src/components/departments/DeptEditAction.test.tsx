import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { useMeMock, listMock, dialogMock } = vi.hoisted(() => ({
  useMeMock: vi.fn(),
  listMock: vi.fn(),
  dialogMock: vi.fn(),
}));
vi.mock("@/lib/auth/useMe", () => ({ useMe: useMeMock }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("@/lib/api/departments.admin", () => ({ listDepartmentsAdmin: listMock }));
// 수정 창 자체는 DepartmentFormDialog 테스트가 커버 — 여기선 어떤 부서로 열리는지만 본다.
vi.mock("@/components/admin/departments/DepartmentFormDialog", () => ({
  DepartmentFormDialog: (props: { open: boolean; mode: string; editId?: number }) => {
    dialogMock(props);
    return props.open ? <div role="dialog">수정 창 {props.editId}</div> : null;
  },
}));

import { DeptEditAction } from "./DeptEditAction";

let qc: QueryClient;
beforeEach(() => {
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  listMock.mockResolvedValue([]);
});
afterEach(() => vi.clearAllMocks());
const renderIt = () =>
  render(
    <QueryClientProvider client={qc}>
      <DeptEditAction departmentId={3} />
    </QueryClientProvider>,
  );

describe("DeptEditAction", () => {
  it("DEPT_WRITE가 없으면 버튼을 보이지 않는다", () => {
    useMeMock.mockReturnValue({ data: { permissions: ["NOTICE_WRITE"] }, isLoading: false });
    renderIt();
    expect(screen.queryByRole("button", { name: "이 팀 수정" })).toBeNull();
  });

  it("비로그인(내 정보 없음)이면 버튼을 보이지 않는다", () => {
    useMeMock.mockReturnValue({ data: undefined, isLoading: false });
    renderIt();
    expect(screen.queryByRole("button", { name: "이 팀 수정" })).toBeNull();
  });

  it("DEPT_WRITE가 있으면 버튼을 누를 때 그 팀 수정 창이 열린다", async () => {
    useMeMock.mockReturnValue({ data: { permissions: ["DEPT_WRITE"] }, isLoading: false });
    renderIt();
    fireEvent.click(screen.getByRole("button", { name: "이 팀 수정" }));
    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(dialogMock).toHaveBeenLastCalledWith(expect.objectContaining({ open: true, mode: "edit", editId: 3 }));
    await waitFor(() => expect(listMock).toHaveBeenCalled());
  });
});

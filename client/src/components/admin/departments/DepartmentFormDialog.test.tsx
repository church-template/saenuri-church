import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { createMock, updateMock, getDetailMock, notifySuccess, notifyError, revalidateMock, fetchAlbumsMock } = vi.hoisted(() => ({
  revalidateMock: vi.fn(),
  fetchAlbumsMock: vi.fn(),
  createMock: vi.fn(),
  updateMock: vi.fn(),
  getDetailMock: vi.fn(),
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));
vi.mock("@/lib/api/departments.admin", () => ({
  createDepartment: createMock,
  updateDepartment: updateMock,
  getDepartmentDetail: getDetailMock,
}));
vi.mock("@/lib/notify", () => ({ notify: { success: notifySuccess, error: notifyError } }));
vi.mock("@/lib/admin/revalidate", () => ({ revalidateDepartments: revalidateMock }));
vi.mock("@/lib/api/gallery", () => ({ fetchAlbums: fetchAlbumsMock }));

import { DepartmentFormDialog } from "./DepartmentFormDialog";
import type { DepartmentCardResponse } from "@/lib/api/types";

const departments: DepartmentCardResponse[] = [
  { id: 1, name: "학생부", leader: "", parentId: null, sortOrder: 10 },
  { id: 2, name: "중등부", leader: "", parentId: 1, sortOrder: 10 },
  { id: 3, name: "청년부", leader: "", parentId: null, sortOrder: 20 },
];

let qc: QueryClient;
beforeEach(() => {
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  revalidateMock.mockResolvedValue(undefined);
  fetchAlbumsMock.mockResolvedValue({ content: [{ id: 7, title: "2026 여름성경학교" }] });
});
afterEach(() => vi.clearAllMocks());
function renderDialog(ui: React.ReactNode) {
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("DepartmentFormDialog", () => {
  it("부서명이 비면 검증 메시지를 보이고 생성하지 않는다", async () => {
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="create" departments={departments} />);
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() => expect(screen.getByText("부서명을 입력해 주세요.")).toBeDefined());
    expect(createMock).not.toHaveBeenCalled();
  });

  it("생성은 POST body를 보낸다(루트=parentId null)", async () => {
    createMock.mockResolvedValue({ id: 9 });
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="create" departments={departments} />);
    fireEvent.change(screen.getByLabelText("부서명"), { target: { value: "새부서" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ name: "새부서", parentId: null })),
    );
    expect(notifySuccess).toHaveBeenCalled();
  });

  it("수정은 상세로 version을 시드하고 PUT에 version을 포함한다", async () => {
    getDetailMock.mockResolvedValue({
      id: 2, name: "중등부", description: "", leader: "이전도", parentId: 1, sortOrder: 10,
      createdAt: "", updatedAt: "", version: 4,
    });
    updateMock.mockResolvedValue({ id: 2 });
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="edit" editId={2} departments={departments} />);
    await waitFor(() => expect(getDetailMock).toHaveBeenCalledWith(2));
    await waitFor(() => expect((screen.getByLabelText("부서명") as HTMLInputElement).value).toBe("중등부"));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() =>
      expect(updateMock).toHaveBeenCalledWith(2, expect.objectContaining({ version: 4 })),
    );
  });

  it("수정 시 상위 옵션에서 자기 자신과 하위를 제외한다", async () => {
    getDetailMock.mockResolvedValue({
      id: 1, name: "학생부", description: "", leader: "", parentId: null, sortOrder: 10,
      createdAt: "", updatedAt: "", version: 1,
    });
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="edit" editId={1} departments={departments} />);
    await waitFor(() => expect(getDetailMock).toHaveBeenCalledWith(1));
    const select = screen.getByLabelText("상위 부서") as HTMLSelectElement;
    const optionValues = Array.from(select.options).map((o) => o.value);
    // 자기(1)+하위(2) 제외 → (없음)과 청년부(3)만 남는다
    expect(optionValues).toEqual(["", "3"]);
  });

  it("시드 조회 중에는 저장 버튼이 비활성, 도착 후 활성된다", async () => {
    let resolveDetail: (d: unknown) => void = () => {};
    getDetailMock.mockReturnValue(new Promise((r) => { resolveDetail = r; }));
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="edit" editId={2} departments={departments} />);
    await waitFor(() =>
      expect((screen.getByRole("button", { name: "저장" }) as HTMLButtonElement).disabled).toBe(true),
    );
    resolveDetail({
      id: 2, name: "중등부", description: "", leader: "", parentId: 1, sortOrder: 10,
      createdAt: "", updatedAt: "", version: 4,
    });
    await waitFor(() =>
      expect((screen.getByRole("button", { name: "저장" }) as HTMLButtonElement).disabled).toBe(false),
    );
  });

  it("시드 조회 실패 시 에러를 토스트한다", async () => {
    getDetailMock.mockRejectedValue(new Error("network"));
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="edit" editId={2} departments={departments} />);
    await waitFor(() => expect(notifyError).toHaveBeenCalled());
  });

  it("defaultParentId를 주면 create 폼의 상위가 프리셋된다", async () => {
    createMock.mockResolvedValue({ id: 9 });
    renderDialog(
      <DepartmentFormDialog open onOpenChange={() => {}} mode="create" departments={departments} defaultParentId={2} />,
    );
    await waitFor(() =>
      expect((screen.getByLabelText("상위 부서") as HTMLSelectElement).value).toBe("2"),
    );
    fireEvent.change(screen.getByLabelText("부서명"), { target: { value: "1학년부" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() =>
      expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ name: "1학년부", parentId: 2 })),
    );
  });

  it("시드 조회 실패 시 저장 버튼이 비활성(잘못된 PUT 방지)이다", async () => {
    getDetailMock.mockRejectedValue(new Error("network"));
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="edit" editId={2} departments={departments} />);
    await waitFor(() => expect(notifyError).toHaveBeenCalled());
    expect((screen.getByRole("button", { name: "저장" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("수정 PUT은 대표 사진·앨범을 값이 없어도(null) 항상 함께 보내고 공개 캐시를 비운다", async () => {
    getDetailMock.mockResolvedValue({
      id: 2, name: "중등부", description: "", leader: "", parentId: 1, sortOrder: 10,
      createdAt: "", updatedAt: "", version: 4, // 백엔드 배포 전 — heroMediaId·albumId 필드 없음
    });
    updateMock.mockResolvedValue({ id: 2 });
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="edit" editId={2} departments={departments} />);
    await waitFor(() => expect((screen.getByLabelText("부서명") as HTMLInputElement).value).toBe("중등부"));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() => expect(updateMock).toHaveBeenCalled());
    const body = updateMock.mock.calls[0][1];
    expect(body).toHaveProperty("heroMediaId", null);
    expect(body).toHaveProperty("albumId", null);
    await waitFor(() => expect(revalidateMock).toHaveBeenCalled());
  });

  it("시드된 대표 사진·앨범을 보이고, 앨범을 바꾸거나 사진을 빼면 그 값으로 PUT한다", async () => {
    getDetailMock.mockResolvedValue({
      id: 2, name: "중등부", description: "", leader: "", parentId: 1, sortOrder: 10,
      createdAt: "", updatedAt: "", version: 4, heroMediaId: 42, albumId: null, photos: [],
    });
    updateMock.mockResolvedValue({ id: 2 });
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="edit" editId={2} departments={departments} />);
    await waitFor(() => expect(screen.getByAltText("선택한 대표 사진")).toBeDefined());
    await waitFor(() => expect(screen.getByRole("option", { name: "2026 여름성경학교" })).toBeDefined());
    fireEvent.change(screen.getByLabelText("활동 사진 앨범"), { target: { value: "7" } });
    fireEvent.click(screen.getByRole("button", { name: "대표 사진 빼기" }));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() =>
      expect(updateMock).toHaveBeenCalledWith(2, expect.objectContaining({ heroMediaId: null, albumId: 7 })),
    );
  });

  it("앨범 고르기 옆에 공개 안내를 보이고 select와 연결한다(#92 3.3)", async () => {
    renderDialog(<DepartmentFormDialog open onOpenChange={() => {}} mode="create" departments={departments} />);
    const note = screen.getByText(/앨범의 사진 전체가 누구에게나 공개됩니다/);
    expect(screen.getByLabelText("활동 사진 앨범").getAttribute("aria-describedby")).toBe(note.id);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const m = vi.hoisted(() => ({ fetchAlbum: vi.fn() }));
vi.mock("@/lib/api/gallery", () => ({ fetchAlbum: m.fetchAlbum, fetchAlbums: vi.fn() }));

import { DeptEditPreview, type DeptEditPreviewProps } from "./DeptEditPreview";
import { findDepartmentByBackendId } from "@/constants/departments";

const photos = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i + 1, mediaId: 200 + i, sortOrder: i, url: `/api/media/${200 + i}?exp=1&sig=s${i}` }));
const NO_CHANGE = { hero: false, description: false, album: false };

let qc: QueryClient;
beforeEach(() => {
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  m.fetchAlbum.mockResolvedValue({ id: 5, photos: [] });
});
afterEach(() => vi.clearAllMocks());

function renderPreview(over: Partial<DeptEditPreviewProps> = {}) {
  const props: DeptEditPreviewProps = {
    backendId: 1, heroMediaId: null, description: "", albumId: null, changed: NO_CHANGE, ...over,
  };
  return render(
    <QueryClientProvider client={qc}>
      <DeptEditPreview {...props} />
    </QueryClientProvider>,
  );
}

describe("findDepartmentByBackendId", () => {
  it("백엔드 부서 번호로 공개 미션팀 상수를 찾는다", () => {
    expect(findDepartmentByBackendId(1)?.slug).toBe("orange");
    expect(findDepartmentByBackendId(9999)).toBeUndefined();
  });
});

const hero = () => screen.getByRole("img", { name: "오렌지 미션팀 대표 사진" }) as HTMLImageElement;
const activity = () => screen.queryAllByRole("img", { name: "오렌지 미션팀 활동 사진" });

describe("DeptEditPreview (공개 미션팀 상세와 같은 규칙)", () => {
  it("대표 사진이 없으면 상수 사진을, 있으면 그 사진을, 방금 고른 사진은 서명 주소를 쓴다", () => {
    const { unmount } = renderPreview();
    expect(hero().getAttribute("src")).toBe("/dept/orange.webp");
    unmount();
    const r2 = renderPreview({ heroMediaId: 12 });
    expect(hero().getAttribute("src")).toContain("/api/media/12");
    r2.unmount();
    renderPreview({ heroMediaId: 12, heroPickedUrl: "/api/media/12?exp=1&sig=a" });
    expect(hero().getAttribute("src")).toContain("sig=a");
  });

  it("제목은 공개 페이지와 같은 상수 팀 이름이다", () => {
    renderPreview();
    expect(screen.getByText("오렌지 미션팀")).toBeDefined();
  });

  it("소개가 비면 상수 소개(마크다운)를, 있으면 그 글을 보이고 바뀌었으면 표시한다", () => {
    const { unmount } = renderPreview();
    expect(screen.getByText("유치부·초등부·중등부·고등부")).toBeDefined();
    expect(screen.queryByText("바뀜")).toBeNull();
    unmount();
    renderPreview({ description: "새 소개 글", changed: { ...NO_CHANGE, description: true } });
    expect(screen.getByText("새 소개 글")).toBeDefined();
    expect(screen.getByText("바뀜")).toBeDefined();
  });

  it("앨범이 없으면 공개 화면처럼 기본 사진을 보이고 그 이유를 쓴다", () => {
    renderPreview();
    // 상수 사진 더미는 사진마다 설명(alt)이 달라 이름 대신 개수로 본다 — 대표 사진 말고도 사진이 있다
    expect(screen.getAllByRole("img").length).toBeGreaterThan(1);
    expect(screen.getByText("앨범을 연결하지 않아 기본 사진이 보입니다.")).toBeDefined();
  });

  it("앨범 사진은 소개 옆 사진 더미 3장과 활동 사진 4장으로, 서명 주소로 보인다", async () => {
    m.fetchAlbum.mockResolvedValue({ id: 5, photos: photos(5) });
    renderPreview({ albumId: 5, changed: { ...NO_CHANGE, album: true } });
    await screen.findByText(/사진 5장 · 미션팀 화면에서는 8장씩 보이고/);
    const imgs = activity();
    expect(imgs).toHaveLength(7); // 사진 더미 3 + 활동 사진 4
    expect(imgs.every((i) => (i.getAttribute("src") ?? "").includes("sig=s"))).toBe(true);
    expect(screen.getByText("바뀜")).toBeDefined();
  });

  it("공개 소개 페이지가 없는 부서는 안내 한 줄만 보인다", () => {
    renderPreview({ backendId: 9999 });
    expect(screen.getByText("이 부서는 공개 소개 페이지가 없습니다.")).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("수정 화면이 빈 값으로 먼저 그려진 뒤 상세로 채워질 때는 내리지 않는다(열자마자 튀지 않게)", async () => {
    const scrollTo = vi.fn();
    m.fetchAlbum.mockResolvedValue({ id: 5, photos: photos(2) });
    const view = (albumId: number | null) => (
      <QueryClientProvider client={qc}>
        <div style={{ overflowY: "auto" }} ref={(el) => { if (el) el.scrollTo = scrollTo; }}>
          <DeptEditPreview backendId={1} heroMediaId={null} description="" albumId={albumId} changed={NO_CHANGE} />
        </div>
      </QueryClientProvider>
    );
    const { rerender } = render(view(null)); // 폼 첫 렌더(EMPTY)
    rerender(view(5)); // 상세 시드
    await screen.findAllByRole("img", { name: /오렌지 미션팀 활동 사진/ });
    await new Promise((r) => setTimeout(r, 20));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("사진을 넣으면(요청 번호 증가) 사진을 다 불러온 뒤 활동 사진 구역으로 내린다", async () => {
    const scrollTo = vi.fn();
    m.fetchAlbum.mockResolvedValue({ id: 5, photos: photos(2) });
    const { rerender } = render(
      <QueryClientProvider client={qc}>
        <div style={{ overflowY: "auto" }} data-testid="box" ref={(el) => { if (el) el.scrollTo = scrollTo; }}>
          <DeptEditPreview backendId={1} heroMediaId={null} description="" albumId={5} changed={NO_CHANGE} />
        </div>
      </QueryClientProvider>,
    );
    await screen.findAllByRole("img", { name: /오렌지 미션팀 활동 사진/ });
    expect(scrollTo).not.toHaveBeenCalled(); // 처음 열 때는 움직이지 않는다
    m.fetchAlbum.mockResolvedValue({ id: 5, photos: photos(4) });
    await qc.invalidateQueries({ queryKey: ["album", 5] });
    rerender(
      <QueryClientProvider client={qc}>
        <div style={{ overflowY: "auto" }} data-testid="box" ref={(el) => { if (el) el.scrollTo = scrollTo; }}>
          <DeptEditPreview backendId={1} heroMediaId={null} description="" albumId={5} changed={NO_CHANGE} scrollRequest={1} />
        </div>
      </QueryClientProvider>,
    );
    await waitFor(() => expect(scrollTo).toHaveBeenCalled());
  });
});

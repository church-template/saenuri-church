import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhotoViewer } from "./PhotoViewer";
import { ZoomPhoto } from "./ZoomPhoto";

const A = { src: "/a.webp", alt: "가", caption: "첫 사진" };
const B = { src: "/b.webp", alt: "나" };

describe("PhotoViewer", () => {
  it("한 장이면 좌우 이동·순번 없이 사진과 캡션만 보여 준다", () => {
    render(<PhotoViewer photos={[A]} title="사진 크게 보기" index={0} onIndexChange={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: "사진 크게 보기" });
    expect(dialog.querySelector('img[src="/a.webp"]')).not.toBeNull();
    expect(dialog.textContent).toContain("첫 사진");
    expect(screen.queryByRole("button", { name: "다음 사진" })).toBeNull();
    expect(dialog.textContent).not.toContain("1 / 1");
  });

  it("여러 장이면 순번을 보이고 화살표·방향키로 넘긴다(끝에서는 멈춘다)", () => {
    const onIndexChange = vi.fn();
    render(<PhotoViewer photos={[A, B]} title="앨범" index={0} onIndexChange={onIndexChange} />);
    const dialog = screen.getByRole("dialog", { name: "앨범 사진 1 / 2" });
    expect(screen.getByRole("button", { name: "이전 사진" })).toHaveProperty("disabled", true);
    fireEvent.click(screen.getByRole("button", { name: "다음 사진" }));
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    onIndexChange.mockClear();
    fireEvent.keyDown(dialog, { key: "ArrowLeft" }); // 첫 장에서 왼쪽 — 움직이지 않는다
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("index가 null이면 창이 없다", () => {
    render(<PhotoViewer photos={[A]} title="t" index={null} onIndexChange={() => {}} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("ZoomPhoto", () => {
  it("누르기 전엔 창이 없고, 누르면 그 사진을 크게 보여 준다", () => {
    render(<ZoomPhoto src="/a.webp" alt="가" caption="첫 사진" />);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "첫 사진 크게 보기" }));
    expect(screen.getByRole("dialog").querySelector('img[src="/a.webp"]')).not.toBeNull();
  });

  it("캡션이 없으면 alt로 버튼 이름을 만들고, 숨긴 카드는 탭 순서에서 뺀다", () => {
    render(<ZoomPhoto src="/b.webp" alt="나" caption="" hidden />); // API 사진은 캡션이 빈 문자열로 온다
    expect(screen.getByRole("button", { name: "나 크게 보기" }).tabIndex).toBe(-1);
  });
});

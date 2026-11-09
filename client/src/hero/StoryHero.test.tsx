import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import StoryHero from "./StoryHero";
import { STORY_HERO } from "@/constants/storyHero";

function stubMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((q: string) => ({
      matches: q.includes("reduce") ? reduced : false,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("StoryHero", () => {
  it("스플릿 제목과 모든 장 제목이 DOM 텍스트로 남는다(SEO·스크린리더)", () => {
    stubMotion(false);
    const { container } = render(<StoryHero content={STORY_HERO} />);
    const text = container.textContent ?? "";
    for (const line of STORY_HERO.split.title) expect(text).toContain(line);
    for (const ch of STORY_HERO.chapters) for (const line of ch.title) expect(text).toContain(line);
  });

  it("인트로 동안 헤더를 숨기고, 축소가 끝나면 다시 보인다", () => {
    vi.useFakeTimers();
    stubMotion(false);
    const onConcealHeader = vi.fn();
    render(<StoryHero content={STORY_HERO} onConcealHeader={onConcealHeader} />);
    expect(onConcealHeader).toHaveBeenLastCalledWith(true);
    act(() => vi.advanceTimersByTime(3800));
    expect(onConcealHeader).toHaveBeenLastCalledWith(false);
  });

  it("인트로 연출(문구·축소)은 서버 HTML이 아니라 클라이언트 타이머와 같은 시점에 시작한다", () => {
    stubMotion(false);
    // 서버 HTML: 인트로 대기 상태(사진 풀스크린)만 — 문구 애니메이션 트리거는 없다
    expect(renderToString(<StoryHero content={STORY_HERO} />)).not.toContain('data-intro="run"');
    // 마운트 후: 타이머와 함께 시작
    const { container } = render(<StoryHero content={STORY_HERO} />);
    expect(container.querySelector('[data-intro="run"]')).not.toBeNull();
  });

  it("인트로 중 스크롤하면 인트로를 즉시 끝내고 헤더를 보인다", () => {
    vi.useFakeTimers();
    stubMotion(false);
    const onConcealHeader = vi.fn();
    render(<StoryHero content={STORY_HERO} onConcealHeader={onConcealHeader} />);
    act(() => {
      fireEvent.scroll(window);
    });
    expect(onConcealHeader).toHaveBeenLastCalledWith(false);
  });

  it("스크롤 위치가 복원된 채로 열리면 인트로를 건너뛰고 현재 위치(헤더 솔리드)를 반영한다", () => {
    vi.useFakeTimers();
    stubMotion(false);
    Object.defineProperty(window, "scrollY", { value: 5000, configurable: true });
    const onConcealHeader = vi.fn();
    const onSolid = vi.fn();
    render(<StoryHero content={STORY_HERO} onConcealHeader={onConcealHeader} onSolid={onSolid} />);
    act(() => vi.advanceTimersByTime(0));
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    expect(onConcealHeader).not.toHaveBeenCalledWith(true);
    expect(onSolid).toHaveBeenLastCalledWith(true);
  });

  it("'처음으로'는 마지막 장이 아닐 때 탭 순서에서 빠진다", () => {
    stubMotion(false);
    render(<StoryHero content={STORY_HERO} />);
    expect(screen.getByRole("button", { name: STORY_HERO.backLabel }).getAttribute("tabindex")).toBe("-1");
  });

  it("움직임 줄이기면 인트로 없이 모든 장 사진이 정적으로 보인다", () => {
    stubMotion(true);
    const onConcealHeader = vi.fn();
    render(<StoryHero content={STORY_HERO} onConcealHeader={onConcealHeader} />);
    expect(onConcealHeader).not.toHaveBeenCalledWith(true);
    for (const ch of STORY_HERO.chapters) {
      for (const card of ch.cards) expect(screen.getAllByAltText(card.caption).length).toBeGreaterThan(0);
    }
  });

  it("사진 카드를 눌러도 확대 창이 열리지 않는다(카드 전용)", () => {
    stubMotion(false);
    render(<StoryHero content={STORY_HERO} />);
    const img = screen.getAllByAltText(STORY_HERO.chapters[1].cards[0].caption)[0];
    fireEvent.click(img);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

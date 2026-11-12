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

  it("인트로 동안 헤더를 숨기고, 시간이 지나면 장 0으로 넘어가며 다시 보인다", () => {
    vi.useFakeTimers();
    stubMotion(false);
    const onConcealHeader = vi.fn();
    const { container } = render(<StoryHero content={STORY_HERO} onConcealHeader={onConcealHeader} />);
    expect(onConcealHeader).toHaveBeenLastCalledWith(true);
    expect(container.querySelector('[data-cur="-1"]')).not.toBeNull();
    act(() => vi.advanceTimersByTime(1800));
    expect(onConcealHeader).toHaveBeenLastCalledWith(false);
    expect(container.querySelector('[data-cur="0"]')).not.toBeNull();
  });

  it("인트로 중 스크롤 입력은 막혀 끝까지 보여 준 뒤에야 넘어간다", () => {
    vi.useFakeTimers();
    stubMotion(false);
    const onConcealHeader = vi.fn();
    const { container } = render(<StoryHero content={STORY_HERO} onConcealHeader={onConcealHeader} />);
    const wheel = new WheelEvent("wheel", { cancelable: true });
    window.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(true);
    act(() => {
      fireEvent.scroll(window);
    });
    expect(container.querySelector('[data-cur="-1"]')).not.toBeNull();
    expect(onConcealHeader).toHaveBeenLastCalledWith(true);
    act(() => vi.advanceTimersByTime(1800));
    expect(container.querySelector('[data-cur="0"]')).not.toBeNull();
    // 인트로가 끝나면 스크롤 입력을 더 막지 않는다
    const after = new WheelEvent("wheel", { cancelable: true });
    window.dispatchEvent(after);
    expect(after.defaultPrevented).toBe(false);
  });

  it("인트로 문구는 서버 HTML에 이미 있다(문구 등장은 CSS 애니메이션)", () => {
    stubMotion(false);
    // 글자마다 span으로 쪼개지므로 태그를 걷어낸 텍스트로 확인한다
    const text = renderToString(<StoryHero content={STORY_HERO} />).replace(/<[^>]+>/g, "");
    expect(text).toContain(STORY_HERO.intro.mark);
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

  it("움직임 줄이기면 헤더를 숨기지 않고 모든 장 사진이 정적으로 보인다", () => {
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

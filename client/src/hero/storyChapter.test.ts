import { describe, it, expect } from "vitest";
import { chapterAt } from "./storyChapter";

// 장 0 = 스플릿, 1..count-1 = 과거 장, count = 마지막 "지금" 장. 섹션 높이 = (count + 1) × viewport.
describe("chapterAt", () => {
  it("섹션 시작에서는 스플릿(0)", () => {
    expect(chapterAt(0, 0, 800, 8)).toBe(0);
  });

  it("장 경계의 절반을 기준으로 반올림한다", () => {
    expect(chapterAt(800 * 3 + 399, 0, 800, 8)).toBe(3);
    expect(chapterAt(800 * 3 + 401, 0, 800, 8)).toBe(4);
  });

  it("섹션보다 위(음수)는 0으로 클램프", () => {
    expect(chapterAt(-500, 0, 800, 8)).toBe(0);
  });

  it("섹션을 지나치면 마지막 장(count)으로 클램프", () => {
    expect(chapterAt(99999, 0, 800, 8)).toBe(8);
  });

  it("섹션 시작 오프셋(sectionTop)을 뺀 위치로 계산한다", () => {
    expect(chapterAt(1000 + 800 * 2, 1000, 800, 8)).toBe(2);
  });
});

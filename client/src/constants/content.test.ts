import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { ABOUT, HISTORY, PASTOR, WORSHIP_SERVICES } from "./content";

// public/ 기준 절대경로 → 실제 파일. 상수 경로 오타가 배포 후 깨진 이미지로 나오는 것을 막는다.
const publicFile = (src: string) => join(__dirname, "../../public", src);

describe("HISTORY 데이터", () => {
  it("10개 항목 모두 고유 id를 가진다", () => {
    const ids = HISTORY.items.map((i) => i.id);
    expect(ids.length).toBe(10);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("첫 항목은 1990년 7월 첫 예배다", () => {
    expect(HISTORY.items[0].year).toBe("1990년 7월");
  });

  it("모든 항목이 필수 필드를 가진다", () => {
    for (const item of HISTORY.items) {
      expect(item.year).toBeTruthy();
      expect(item.text).toBeTruthy();
      expect(item.desc).toBeTruthy();
      expect(item.details.length).toBeGreaterThan(0);
      expect(item.significance).toBeTruthy();
    }
  });

  it("연혁 사진은 assets/history·church 아래 실제 파일이다", () => {
    for (const item of HISTORY.items) {
      if (!item.media || item.media.type !== "image") continue;
      expect(item.media.src).toMatch(/^\/assets\/(history|church)\//);
      expect(existsSync(publicFile(item.media.src))).toBe(true);
    }
  });

  it("intro 한 줄을 가진다", () => {
    expect(HISTORY.intro).toBeTruthy();
  });
});

describe("예배·목회자·소개", () => {
  it("정기 예배 5개가 교회 확인 시간 그대로다", () => {
    expect(WORSHIP_SERVICES.map((s) => s.time)).toEqual([
      "주일 오전 9:30",
      "주일 오전 11:00",
      "주일 오후 1:40",
      "금요일 저녁 9:00",
      "월~금 오전 5:30",
    ]);
  });

  it("담임목사 사진은 실제 파일이고 이름이 황영기다", () => {
    expect(PASTOR.name).toBe("황영기");
    expect(existsSync(publicFile(PASTOR.image.src))).toBe(true);
  });

  it("로고 의미는 여섯 미션팀 색을 세대 순서(어린이→어른)로 담는다", () => {
    expect(ABOUT.symbolism.map((s) => s.team)).toEqual(["orange", "skyblue", "red", "blue", "green", "purple"]);
  });
});

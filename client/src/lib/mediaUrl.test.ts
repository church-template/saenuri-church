import { describe, it, expect } from "vitest";
import { gallerySrc, mediaSrc } from "./mediaUrl";

describe("mediaSrc", () => {
  it("서명 주소가 있으면 그것을 쓴다", () => {
    expect(mediaSrc(5, "/api/media/5?exp=1&sig=ab")).toBe("/api/media/5?exp=1&sig=ab");
  });
  it("서명 주소가 없으면(null·undefined·빈 값) 기존 공개 주소로 폴백한다", () => {
    expect(mediaSrc(5)).toBe("/api/media/5");
    expect(mediaSrc(5, null)).toBe("/api/media/5");
    expect(mediaSrc(5, "")).toBe("/api/media/5");
  });
});

describe("gallerySrc", () => {
  it("서명 주소가 있으면 그것을 쓴다", () => {
    expect(gallerySrc(5, "/api/media/5?exp=1&sig=ab")).toBe("/api/media/5?exp=1&sig=ab");
  });
  it("필드가 없으면(undefined, 구 백엔드) id로 조립한다", () => {
    expect(gallerySrc(5, undefined)).toBe("/api/media/5");
    expect(gallerySrc(null, undefined)).toBeNull();
  });
  it("null이면 id가 있어도 조립하지 않는다(사진 없음)", () => {
    expect(gallerySrc(5, null)).toBeNull();
  });
});

import { describe, it, expect, vi } from "vitest";

// API 베이스(교회 접두사 포함)가 있을 때의 주소 조립만 따로 본다 — 기본 테스트는 베이스가 ""라 이 차이가 드러나지 않는다.
vi.mock("./auth/apiBase", () => ({
  API_BASE: "https://api.test/church/x",
  apiUrl: (path: string) => `https://api.test/church/x${path}`,
}));

import { renderMarkdown } from "./markdown";

describe("renderMarkdown — API 베이스가 있을 때", () => {
  it("서명 맵이 없으면 본문 이미지는 API 베이스가 붙은 무서명 주소가 된다", () => {
    const html = renderMarkdown("![a](media:42)");
    expect(html).toContain('src="https://api.test/church/x/api/media/42"');
  });

  it("서명 맵에 있는 이미지는 API 베이스가 붙은 서명 주소가 된다(대조)", () => {
    const html = renderMarkdown("![a](media:42)", {
      urls: { "42": "/api/media/42?exp=9&sig=zz" },
      missing: "drop",
    });
    expect(html).toContain('src="https://api.test/church/x/api/media/42?exp=9&amp;sig=zz"');
  });
});

import { describe, it, expect, vi } from "vitest";
import { API_BASE, apiUrl } from "./apiBase";

describe("apiUrl", () => {
  it("API_BASE와 path를 결합한다", () => {
    expect(apiUrl("/api/auth/login")).toBe(`${API_BASE}/api/auth/login`);
  });

  it("path만 받아 이중 결합하지 않는다(맨 끝이 path)", () => {
    expect(apiUrl("/api/members/me").endsWith("/api/members/me")).toBe(true);
  });

  // 서버(빌드·렌더)에서 상대경로 fetch는 실패하지 않고 멈춰 sitemap·rss 빌드가 60초 타임아웃으로 죽었다.
  it("서버에서 API_BASE가 비어 있으면 즉시 실패해 호출자의 폴백(catch)으로 넘긴다", () => {
    if (API_BASE) return; // 백엔드 주소가 있는 환경은 해당 없음
    vi.stubGlobal("window", undefined);
    try {
      expect(() => apiUrl("/api/notices")).toThrow(/NEXT_PUBLIC_API_BASE/);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

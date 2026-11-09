import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// 브랜드 색은 globals.css @theme 한 곳이 정본이지만, global-error.tsx는 루트 레이아웃 밖이라
// CSS를 못 읽어 hex를 인라인으로 둔다 — 두 곳이 어긋나지 않게 감시한다.
const read = (file: string) => readFileSync(join(__dirname, file), "utf8");

describe("브랜드 컬러(새누리 네이비)", () => {
  it("globals.css primary 계열 토큰이 네이비 값이다", () => {
    const css = read("globals.css");
    expect(css).toContain("--color-primary: #13426f;");
    expect(css).toContain("--color-primary-active: #0d3256;");
    expect(css).toContain("--color-primary-soft: #e7eef5;");
    expect(css).toContain("--color-primary-on-dark: #2e96ff;");
  });

  it("global-error.tsx 인라인 폴백도 같은 primary를 쓴다", () => {
    const tsx = read("global-error.tsx");
    expect(tsx).toContain("#13426f");
    expect(tsx).not.toContain("#0052ff");
  });
});

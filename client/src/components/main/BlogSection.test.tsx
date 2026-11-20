import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MAIN_SECTIONS } from "@/constants/content";
import { CHURCH_BLOG_URL } from "@/constants/church";
import { BlogSection } from "./BlogSection";

const post = {
  title: "미래의 국대가 나타났다",
  url: "https://blog.naver.com/snrbtc/224470425297",
  date: "2026-11-09",
  image: "https://blogthumb.pstatic.net/a.jpg?type=w2",
};

describe("BlogSection", () => {
  it("글 카드 — 제목·날짜·새 탭 링크·대표 사진(리퍼러 없이)", () => {
    const { container } = render(<BlogSection posts={[post, { ...post, title: "사진 없는 글", url: `${post.url}1`, image: null }]} />);
    expect(screen.getByRole("heading", { name: MAIN_SECTIONS.blog.title })).toBeDefined();
    const link = screen.getByText(post.title).closest("a");
    expect(link?.getAttribute("href")).toBe(post.url);
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(screen.getAllByText("2026. 11. 9.")).toHaveLength(2);
    // 네이버는 다른 사이트 리퍼러가 붙은 사진 요청을 403으로 막는다 — no-referrer 필수
    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(1); // 사진 없는 글은 img 없음
    expect(imgs[0].getAttribute("src")).toBe(post.image);
    expect(imgs[0].getAttribute("referrerpolicy")).toBe("no-referrer");
  });

  it("머리의 블로그 가기 링크는 새 탭으로 블로그를 연다", () => {
    render(<BlogSection posts={[post]} />);
    const more = screen.getByText(MAIN_SECTIONS.blog.more).closest("a");
    expect(more?.getAttribute("href")).toBe(CHURCH_BLOG_URL);
    expect(more?.getAttribute("target")).toBe("_blank");
  });

  it("글이 없으면 구간째 그리지 않는다", () => {
    const { container } = render(<BlogSection posts={[]} />);
    expect(container.innerHTML).toBe("");
  });
});

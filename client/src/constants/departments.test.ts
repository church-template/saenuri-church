import { describe, it, expect } from "vitest";
import {
  DEPARTMENTS,
  DEPT_PAGE,
  DEPT_SECTIONS,
  allDepartmentSlugs,
  findDepartment,
  thumbnailOf,
  type Department,
} from "./departments";

describe("사역 부서 상수", () => {
  it("최소 한 개 이상이고 slug가 유일하다", () => {
    const slugs = allDepartmentSlugs();
    expect(DEPARTMENTS.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("findDepartment: slug로 부서를 찾는다", () => {
    expect(findDepartment("skyblue")?.name).toBe("스카이블루 미션팀");
    expect(findDepartment("green")?.name).toBe("그린 미션팀");
  });

  it("findDepartment: 없는 slug는 undefined", () => {
    expect(findDepartment("nope")).toBeUndefined();
  });

  it("allDepartmentSlugs는 모든 부서 slug를 포함한다", () => {
    expect(allDepartmentSlugs()).toEqual(["orange", "skyblue", "red", "blue", "green", "purple"]);
  });

  // 현재 공개 상수는 하위 부서가 없지만, 함수는 깊이 탐색을 지원한다(어드민·향후 대비) — 로컬 픽스처로 분기 커버.
  it("findDepartment·allDepartmentSlugs는 하위 부서까지 깊이 탐색한다", () => {
    const nested: Department[] = [
      {
        slug: "p",
        name: "상위부서",
        description: "",
        media: { type: "image", src: "/dept/p.jpg" },
        caption: [],
        children: [
          {
            slug: "c",
            name: "하위부서",
            description: "",
            media: { type: "image", src: "/dept/c.jpg" },
            caption: [],
          },
        ],
      },
    ];
    expect(findDepartment("c", nested)?.name).toBe("하위부서");
    expect(allDepartmentSlugs(nested)).toEqual(["p", "c"]);
  });

  it("thumbnailOf: image는 src, video는 poster, poster 없으면 기본", () => {
    expect(thumbnailOf({ type: "image", src: "/dept/youth.jpg" })).toBe("/dept/youth.jpg");
    expect(thumbnailOf({ type: "video", src: "/v.mp4", poster: "/p.jpg" })).toBe("/p.jpg");
    expect(thumbnailOf({ type: "video", src: "/v.mp4" })).toBe("/dept/default.webp");
  });

  it("페이지 카피 상수를 노출한다(하드코딩 0)", () => {
    expect(DEPT_PAGE.title.length).toBeGreaterThan(0);
    expect(DEPT_PAGE.leaderLabel.length).toBeGreaterThan(0);
    expect(DEPT_PAGE.subHeading.length).toBeGreaterThan(0);
  });

  it("오렌지 미션팀은 확인된 보강 데이터(intro·info·invite)와 교회가 준 활동 사진만 갖고, 근거 없는 활동·프로그램은 없다", () => {
    const orange = findDepartment("orange")!;
    expect(orange.intro?.heading).toBe("오렌지 미션팀 소개");
    expect(orange.info).toEqual([
      { label: "대상", value: "어린이" },
      { label: "모임", value: "주일 오전 9:30 교회학교예배" },
    ]);
    expect(orange.invite?.heading).toBe("오렌지 미션팀에서 함께해요");
    expect(orange.activities).toBeUndefined();
    expect(orange.programs).toBeUndefined();
    expect(orange.gallery).toHaveLength(13);
    expect(orange.gallery?.every((p) => p.src.startsWith("/dept/orange/") && p.src.endsWith(".webp"))).toBe(true);
  });

  it("최상위 미션팀은 모두 팀 색·세대 라벨·한 줄 소개를 갖고, 세대 순서(어린이→여성도)로 놓인다", () => {
    expect(DEPARTMENTS.map((d) => d.team)).toEqual(["orange", "skyblue", "red", "blue", "green", "purple"]);
    for (const d of DEPARTMENTS) {
      expect(d.generation?.length).toBeGreaterThan(0);
      expect(d.summary?.length).toBeGreaterThan(0);
    }
  });

  it("사진이 확인된 팀은 대표 사진이 기본 이미지가 아니고, 사진 카드를 갖는다", () => {
    for (const d of DEPARTMENTS.filter((d) => d.slug !== "purple")) {
      expect(d.snaps?.length).toBeGreaterThan(0);
    }
    for (const slug of ["orange", "skyblue", "red", "blue", "green"]) {
      const m = findDepartment(slug)!.media;
      expect(m.src).toBe(`/dept/${slug}.webp`);
    }
  });

  it("한 해 활동은 블로그로 확인된 오렌지 팀에만 있다", () => {
    expect(findDepartment("orange")!.year?.map((y) => y.title)).toEqual(["어린이주일", "여름성경학교"]);
    for (const slug of ["skyblue", "red", "blue", "green", "purple"]) {
      expect(findDepartment(slug)!.year).toBeUndefined();
    }
  });

  it("섹션 헤딩 상수를 노출한다(하드코딩 0)", () => {
    expect(DEPT_SECTIONS.info).toBe("알림 사항");
    expect(DEPT_SECTIONS.activities.length).toBeGreaterThan(0);
    expect(DEPT_SECTIONS.programs.length).toBeGreaterThan(0);
    expect(DEPT_SECTIONS.gallery.length).toBeGreaterThan(0);
    expect(DEPT_SECTIONS.galleryMore.length).toBeGreaterThan(0);
  });
});

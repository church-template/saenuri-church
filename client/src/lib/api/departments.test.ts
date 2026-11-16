import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getDepartments,
  getDepartment,
  buildDepartmentTree,
  bySortOrder,
  withApiCard,
  withApiDetail,
} from "./departments";
import type { Department } from "@/constants/departments";
import type { DepartmentCardResponse } from "./types";

afterEach(() => vi.unstubAllGlobals());

const okJson = (body: unknown) => ({ ok: true, status: 200, json: async () => body }) as Response;

const card = (over: Partial<DepartmentCardResponse>): DepartmentCardResponse => ({
  id: 1, name: "부서", leader: "", parentId: null, sortOrder: 0, ...over,
});

describe("getDepartments", () => {
  it("'/api/departments'를 revalidate 60으로 호출한다", async () => {
    const spy = vi.fn(async () => okJson([]));
    vi.stubGlobal("fetch", spy);
    await getDepartments();
    expect(spy).toHaveBeenCalledWith("/api/departments", { next: { revalidate: 60, tags: ["departments"] } });
  });

  it("null 응답은 빈 배열로 방어한다", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => okJson(null)));
    expect(await getDepartments()).toEqual([]);
  });

  it("비 200이면 throw한다(error.tsx 위임)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 500 }) as Response));
    await expect(getDepartments()).rejects.toThrow("GET /api/departments 실패: 500");
  });
});

describe("getDepartment", () => {
  it("상세를 반환한다", async () => {
    const detail = { ...card({ id: 7, name: "청년부" }), description: "본문", createdAt: "", updatedAt: "", version: 1 };
    vi.stubGlobal("fetch", vi.fn(async () => okJson(detail)));
    expect(await getDepartment(7)).toMatchObject({ id: 7, name: "청년부", description: "본문" });
  });

  it("'departments' 태그로 캐시한다(관리 화면 저장 시 즉시 무효화)", async () => {
    const spy = vi.fn(async () => okJson({}));
    vi.stubGlobal("fetch", spy);
    await getDepartment(3);
    expect(spy).toHaveBeenCalledWith("/api/departments/3", { next: { revalidate: 60, tags: ["departments"] } });
  });

  it("404는 null을 반환한다(미존재)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404 }) as Response));
    expect(await getDepartment(999)).toBeNull();
  });

  it("그 외 비 200은 throw한다", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 500 }) as Response));
    await expect(getDepartment(7)).rejects.toThrow("GET /api/departments/7 실패: 500");
  });
});

describe("buildDepartmentTree", () => {
  it("parentId로 자식을 중첩하고 sortOrder,id로 정렬한다", () => {
    const list = [
      card({ id: 1, name: "교회학교", sortOrder: 1 }),
      card({ id: 3, name: "초등부", parentId: 1, sortOrder: 2 }),
      card({ id: 2, name: "유치부", parentId: 1, sortOrder: 1 }),
    ];
    const roots = buildDepartmentTree(list);
    expect(roots.map((r) => r.id)).toEqual([1]);
    expect(roots[0].children.map((c) => c.name)).toEqual(["유치부", "초등부"]);
  });

  it("부모 없는 parentId(고아)는 루트로 승격한다", () => {
    const roots = buildDepartmentTree([card({ id: 5, name: "고아", parentId: 99 })]);
    expect(roots.map((r) => r.id)).toEqual([5]);
  });

  it("입력 배열을 변형하지 않는다(불변)", () => {
    const list = [card({ id: 1 }), card({ id: 2, parentId: 1 })];
    const snapshot = JSON.stringify(list);
    buildDepartmentTree(list);
    expect(JSON.stringify(list)).toBe(snapshot);
  });

  it("bySortOrder는 sortOrder 후 id로 비교한다", () => {
    expect(bySortOrder(card({ id: 2, sortOrder: 1 }), card({ id: 1, sortOrder: 1 }))).toBeGreaterThan(0);
    expect(bySortOrder(card({ id: 1, sortOrder: 1 }), card({ id: 9, sortOrder: 2 }))).toBeLessThan(0);
  });
});

const team: Department = {
  slug: "red",
  name: "레드 미션팀",
  description: "상수 소개",
  media: { type: "image", src: "/dept/red.webp", alt: "상수 히어로" },
  caption: ["c"],
  snaps: [{ src: "/dept/red.webp", alt: "상수 스냅", caption: "상수 캡션" }],
  gallery: [{ src: "/dept/red/1.webp", alt: "상수 갤러리" }],
};
const detailOf = (over: object) => ({
  ...card({ id: 3 }), description: "", createdAt: "", updatedAt: "", version: 1, ...over,
});

describe("withApiCard (목록)", () => {
  it("대표 사진이 있으면 목록 사진(snaps 첫 장)과 히어로를 API 사진으로 바꾼다", () => {
    const merged = withApiCard(team, card({ id: 3, heroMediaId: 42 }));
    expect(merged.media).toEqual({ type: "image", src: "/api/media/42", alt: "레드 미션팀 대표 사진" });
    expect(merged.snaps).toEqual([{ src: "/api/media/42", alt: "레드 미션팀 대표 사진", caption: "" }]);
  });

  it("대표 사진이 없거나(null·필드 없음) 응답이 없으면 상수 그대로", () => {
    expect(withApiCard(team, card({ id: 3, heroMediaId: null }))).toBe(team);
    expect(withApiCard(team, card({ id: 3 }))).toBe(team);
    expect(withApiCard(team, undefined)).toBe(team);
  });
});

describe("withApiDetail (상세)", () => {
  it("대표 사진·앨범 사진·소개를 API 값으로 바꾼다(소개 옆 사진은 앞 3장, 캡션 없음)", () => {
    const photos = [1, 2, 3, 4]; // mediaId 배열(#92 확정 계약)
    const merged = withApiDetail(team, detailOf({ heroMediaId: 9, photos, description: "API 소개" }));
    expect(merged.media).toMatchObject({ src: "/api/media/9" });
    expect(merged.description).toBe("API 소개");
    expect(merged.snaps).toEqual(
      [1, 2, 3].map((id) => ({ src: `/api/media/${id}`, alt: "레드 미션팀 활동 사진", caption: "" })),
    );
    expect(merged.gallery?.map((p) => p.src)).toEqual([1, 2, 3, 4].map((id) => `/api/media/${id}`));
    expect(team.description).toBe("상수 소개"); // 입력 불변
  });

  it("칸마다 비었으면 그 칸만 상수로 폴백한다", () => {
    const merged = withApiDetail(team, detailOf({ heroMediaId: null, photos: [], description: "  " }));
    expect(merged).toEqual(team);
    const onlyPhotos = withApiDetail(team, detailOf({ photos: [5] }));
    expect(onlyPhotos.media).toEqual(team.media);
    expect(onlyPhotos.description).toBe("상수 소개");
    expect(onlyPhotos.gallery).toEqual([{ src: "/api/media/5", alt: "레드 미션팀 활동 사진" }]);
  });

  it("응답이 없으면(실패·미연결) 상수 그대로", () => {
    expect(withApiDetail(team, null)).toBe(team);
  });

  it("앨범이 삭제돼 albumId=null·photos=[]면 사진은 상수로 폴백한다", () => {
    const merged = withApiDetail(team, detailOf({ albumId: null, photos: [] }));
    expect(merged.snaps).toEqual(team.snaps);
    expect(merged.gallery).toEqual(team.gallery);
  });
});

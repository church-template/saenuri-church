import { apiUrl } from "@/lib/auth/apiBase";
import type { Department, DeptSnap } from "@/constants/departments";
import type {
  DepartmentCardResponse,
  DepartmentDetailResponse,
  DepartmentNode,
} from "./types";

// 부서 조회(공개, 인증 불필요) — 서버 컴포넌트 전용. revalidate 60 = main.ts와 동일 캐시 정책.
// tags 부착으로 관리 화면 저장 시 updateTag("departments") 즉시 무효화 연결.
export async function getDepartments(): Promise<DepartmentCardResponse[]> {
  const res = await fetch(apiUrl("/api/departments"), { next: { revalidate: 60, tags: ["departments"] } });
  if (!res.ok) {
    throw new Error(`GET /api/departments 실패: ${res.status}`);
  }
  // 비페이징 평배열(정렬 sortOrder,id는 서버 보장). null 방어.
  return ((await res.json()) as DepartmentCardResponse[] | null) ?? [];
}

export async function getDepartment(id: number): Promise<DepartmentDetailResponse | null> {
  const res = await fetch(apiUrl(`/api/departments/${id}`), { next: { revalidate: 60, tags: ["departments"] } });
  if (res.status === 404) {
    return null; // 미존재 → 페이지가 notFound()로 처리
  }
  if (!res.ok) {
    throw new Error(`GET /api/departments/${id} 실패: ${res.status}`);
  }
  return (await res.json()) as DepartmentDetailResponse;
}

// 정렬 비교자 — 트리 조립·상세 자식 정렬 공용(서버 정렬 방어 + 트리 재정렬).
export const bySortOrder = (
  a: DepartmentCardResponse,
  b: DepartmentCardResponse,
): number => a.sortOrder - b.sortOrder || a.id - b.id;

// 평배열 → parentId 트리. 입력 불변(새 노드 생성). 부모 미존재(고아)는 루트로 승격.
export function buildDepartmentTree(
  list: DepartmentCardResponse[],
): DepartmentNode[] {
  const byId = new Map<number, DepartmentNode>();
  for (const d of list) {
    byId.set(d.id, { ...d, children: [] });
  }
  const roots: DepartmentNode[] = [];
  for (const node of byId.values()) {
    const parent = node.parentId != null ? byId.get(node.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  for (const node of byId.values()) {
    node.children.sort(bySortOrder);
  }
  roots.sort(bySortOrder);
  return roots;
}

// 미션팀 사진·소개 — API 칸이 있으면 그 칸만 바꾸고, 비었거나 응답이 없으면 상수를 그대로 쓴다(#32).
// API 사진은 캡션이 없어 alt는 팀 이름으로 짓고, 캡션은 비운다(SnapCard가 빈 캡션을 숨김).
const mediaSrc = (id: number) => apiUrl(`/api/media/${id}`);

function heroOf(dept: Department, id: number) {
  const src = mediaSrc(id);
  const alt = `${dept.name} 대표 사진`;
  return { media: { type: "image" as const, src, alt }, snap: { src, alt, caption: "" } };
}

// 목록 — 목록 사진은 snaps 첫 장이라 대표 사진을 그 자리에 둔다.
export function withApiCard(dept: Department, card: DepartmentCardResponse | undefined): Department {
  if (card?.heroMediaId == null) return dept;
  const hero = heroOf(dept, card.heroMediaId);
  return { ...dept, media: hero.media, snaps: [hero.snap] };
}

// 상세 — 히어로 ← 대표 사진, 소개 옆 사진 ← 앨범 앞 3장, 활동 사진 ← 앨범 전체, 본문 ← description.
export function withApiDetail(dept: Department, detail: DepartmentDetailResponse | null): Department {
  if (!detail) return dept;
  const photos: DeptSnap[] = (detail.photos ?? []).map((id) => ({
    src: mediaSrc(id),
    alt: `${dept.name} 활동 사진`,
    caption: "",
  }));
  return {
    ...dept,
    ...(detail.heroMediaId != null ? { media: heroOf(dept, detail.heroMediaId).media } : null),
    ...(detail.description?.trim() ? { description: detail.description } : null),
    ...(photos.length
      ? { snaps: photos.slice(0, 3), gallery: photos.map(({ src, alt }) => ({ src, alt })) }
      : null),
  };
}

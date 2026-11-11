// 백엔드는 별도 오리진(:8080). NEXT_PUBLIC_API_BASE는 Next가 빌드 시 인라인.
// 테스트(vitest)에서는 미설정이라 ""로 fallback → path만 남아 endsWith 매칭이 동작.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

// path는 항상 "/api/..." 형태. base와 결합해 요청 URL을 만든다(호출자는 apiUrl을 미리 붙이지 않는다).
export function apiUrl(path: string): string {
  // 서버에는 기준 오리진이 없어 상대경로 fetch가 실패하지 않고 멈춘다(빌드 60초 타임아웃).
  // 즉시 던져 호출자의 catch 폴백(sitemap·rss의 정적 엔트리 등)으로 넘긴다.
  if (!API_BASE && typeof window === "undefined") {
    throw new Error(`NEXT_PUBLIC_API_BASE 미설정 — 서버에서 ${path} 호출 불가`);
  }
  return `${API_BASE}${path}`;
}

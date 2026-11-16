import { apiUrl } from "@/lib/auth/apiBase";

// 미디어 주소(church-backend#92 결정 1번, #32) — 갤러리·관리 미디어는 비공개일 수 있어 API가 서명 주소
// (`/api/media/{id}?exp=…&sig=…`, 1시간 유효, 교회 접두사 없음)를 내려 준다. 둘 다 API_BASE 뒤에 붙인다.

// 관리 미디어·고른 사진 미리보기: 서명 주소가 있으면 쓰고, 없으면 `/api/media/{id}`.
export function mediaSrc(id: number, signedUrl?: string | null): string {
  return apiUrl(signedUrl || `/api/media/${id}`);
}

// 갤러리: 필드가 없으면(undefined, 구 백엔드) 기존처럼 id로 조립하고, null이면 그릴 사진이 없다(플레이스홀더).
// null을 id로 다시 조립하면 차단 뒤 404가 된다 — 없음과 null을 구분하는 이유.
export function gallerySrc(id: number | null, signedUrl: string | null | undefined): string | null {
  if (signedUrl !== undefined) return signedUrl ? apiUrl(signedUrl) : null;
  return id != null ? apiUrl(`/api/media/${id}`) : null;
}

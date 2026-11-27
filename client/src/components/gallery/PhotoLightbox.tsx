"use client";
import { PhotoViewer } from "@/components/common/PhotoViewer";
import { gallerySrc } from "@/lib/mediaUrl";
import type { GalleryPhotoResponse } from "@/lib/api/types";

interface PhotoLightboxProps {
  photos: GalleryPhotoResponse[];
  albumTitle: string;
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

// 회원 갤러리 사진 라이트박스 — 공용 PhotoViewer에 갤러리 사진(미디어 id·서명 주소)을 맞춰 넘긴다.
export function PhotoLightbox({ photos, albumTitle, index, onIndexChange }: PhotoLightboxProps) {
  return (
    <PhotoViewer
      // url: null이면 열 주소가 없다(id로 조립하면 차단 뒤 404). 필드가 없을 때(구 백엔드)만 mediaId로 폴백(#32).
      photos={photos.map((p) => ({ src: gallerySrc(p.mediaId, p.url), alt: p.caption ?? "", caption: p.caption }))}
      title={albumTitle}
      index={index}
      onIndexChange={onIndexChange}
    />
  );
}

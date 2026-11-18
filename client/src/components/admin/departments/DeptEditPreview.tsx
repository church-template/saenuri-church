"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";
import { findDepartmentByBackendId, thumbnailOf } from "@/constants/departments";
import { MarkdownContent } from "@/components/common/MarkdownContent";
import { ChangedBadge } from "@/components/admin/editor/ChangedBadge";
import { fetchAlbum } from "@/lib/api/gallery";
import { withApiDetail } from "@/lib/api/departments";
import { mediaSrc } from "@/lib/mediaUrl";
import type { DepartmentDetailResponse } from "@/lib/api/types";
import { spacingPx } from "@/components/admin/editor/useFitAbove";
import { albumKey } from "./DeptAlbumField";

export interface DeptEditPreviewProps {
  backendId?: number;
  heroMediaId: number | null;
  heroPickedUrl?: string; // 방금 고른 사진의 서명 경로(저장 전엔 비공개)
  description: string;
  albumId: number | null;
  changed: { hero: boolean; description: boolean; album: boolean };
  /** 늘어날 때마다 활동 사진 구역으로 내린다(사용자가 앨범을 고르거나 사진을 넣었을 때). 첫 값은 기준이라 움직이지 않는다. */
  scrollRequest?: number;
}

const PREVIEW_PHOTOS = 4;
const SNAP_PHOTOS = 3;

// dept-edit-preview(DESIGN, #37). 공개 미션팀 상세가 쓰는 withApiDetail을 그대로 불러 "공개 페이지가 그릴 미션팀"을 만든다 —
// 히어로 ← 대표 사진, 소개 ← description(비면 상수), 사진 더미 ← 앨범 앞 3장, 활동 사진 ← 사진 더미 + 상수 갤러리(중복 제외).
// 같은 함수라 규칙이 어긋나지 않는다. 다만 저장 전 앨범 사진은 아직 비공개라, 공개 주소를 서명 주소로만 바꿔 끼운다.
export function DeptEditPreview({
  backendId,
  heroMediaId,
  heroPickedUrl,
  description,
  albumId,
  changed,
  scrollRequest = 0,
}: DeptEditPreviewProps) {
  const base = backendId != null ? findDepartmentByBackendId(backendId) : undefined;
  const album = useQuery({
    queryKey: albumKey(albumId ?? 0),
    queryFn: () => fetchAlbum(albumId as number),
    enabled: albumId !== null && !!base,
    retry: false,
  });
  const photos = album.data?.photos ?? [];
  const settled = albumId === null || !album.isPending;
  useScrollToGallery(scrollRequest, settled ? `${albumId}:${photos.length}` : null);

  if (!base) {
    return <p className={cn(typo.bodySm, "text-body")}>이 부서는 공개 소개 페이지가 없습니다.</p>;
  }

  const dept = withApiDetail(base, {
    heroMediaId,
    description,
    photos: photos.map((p) => p.mediaId),
  } as DepartmentDetailResponse);
  // 공개 주소(withApiDetail이 만든 /api/media/{id}) → 서명 주소
  const signed = new Map(photos.map((p) => [mediaSrc(p.mediaId), mediaSrc(p.mediaId, p.url)]));
  const sign = (src: string) => signed.get(src) ?? src;

  const heroSrc = heroPickedUrl && heroMediaId !== null ? mediaSrc(heroMediaId, heroPickedUrl) : thumbnailOf(dept.media);
  const snaps = (dept.snaps ?? []).slice(0, SNAP_PHOTOS);
  // 공개 상세와 같은 합치기: 사진 더미를 앞에, 상수 갤러리는 중복 src를 빼고 뒤에
  const pile = new Set(dept.snaps?.map((s) => s.src));
  const gallery = [...(dept.snaps ?? []), ...(dept.gallery ?? []).filter((p) => !pile.has(p.src))];
  const usingApiPhotos = photos.length > 0;

  return (
    <div className="flex flex-col gap-lg">
      <PreviewBlock title="대표 사진" changed={changed.hero}>
        <div className="relative aspect-video overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element -- 관리 미리보기(서명 경로라 next/image 최적화 대상 아님) */}
          <img src={heroSrc} alt={`${dept.name} 대표 사진`} className="h-full w-full object-cover" />
          {/* 공개 히어로처럼 아래쪽 스크림 위에 팀 이름 */}
          <div className="scrim-bottom absolute inset-x-0 bottom-0 px-lg pt-xxl pb-base">
            <p className={cn(typo.displaySm, "text-on-dark")}>{dept.name}</p>
          </div>
        </div>
      </PreviewBlock>

      <PreviewBlock title="소개" changed={changed.description}>
        <MarkdownContent source={dept.description} className="line-clamp-4" />
        {snaps.length ? (
          <div className="grid grid-cols-3 gap-xs">
            {snaps.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- 관리 미리보기
              <img key={`${s.src}-${i}`} src={sign(s.src)} alt={s.alt} className="aspect-square w-full rounded-md object-cover" />
            ))}
          </div>
        ) : null}
      </PreviewBlock>

      <PreviewBlock title="활동 사진" changed={changed.album} scrollTarget>
        {!settled ? null : gallery.length === 0 ? (
          <Hidden>
            {albumId === null
              ? "앨범을 연결하지 않아 미션팀 화면에 이 구역이 보이지 않습니다."
              : "앨범은 연결됐지만 사진이 없어 이 구역은 아직 보이지 않습니다. 사진을 넣으면 나타납니다."}
          </Hidden>
        ) : (
          <div className="rounded-xl bg-surface-soft p-base">
            {/* 공개 dept-gallery와 같은 bento — 첫 장 2×2, 넷째 장 가로 2칸 */}
            <div className="grid auto-rows-18 grid-cols-4 gap-xs">
              {gallery.slice(0, PREVIEW_PHOTOS).map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- 관리 미리보기
                <img
                  key={`${p.src}-${i}`}
                  src={sign(p.src)}
                  alt={p.alt}
                  className={cn(
                    "h-full w-full rounded-md object-cover",
                    i === 0 && "col-span-2 row-span-2",
                    i === 3 && "col-span-2",
                  )}
                />
              ))}
            </div>
            {gallery.length > PREVIEW_PHOTOS ? (
              <p className={cn(typo.caption, "mt-sm text-body")}>
                {`사진 ${gallery.length}장 · 미션팀 화면에서는 8장씩 보이고 "사진 더 보기"로 더 엽니다.`}
              </p>
            ) : null}
            {usingApiPhotos ? null : (
              <p className={cn(typo.caption, "mt-sm text-body")}>
                {albumId === null
                  ? "앨범을 연결하지 않아 기본 사진이 보입니다."
                  : "앨범에 사진이 없어 기본 사진이 보입니다. 사진을 넣으면 바뀝니다."}
              </p>
            )}
          </div>
        )}
      </PreviewBlock>
    </div>
  );
}

function PreviewBlock({
  title,
  changed,
  scrollTarget = false,
  children,
}: {
  title: string;
  changed: boolean;
  scrollTarget?: boolean;
  children: ReactNode;
}) {
  return (
    <section data-preview-scroll-target={scrollTarget || undefined} className="flex flex-col gap-xs">
      <h3 className={cn(typo.bodySm, "font-semibold text-muted")}>
        {title}
        {changed ? <ChangedBadge /> : null}
      </h3>
      {children}
    </section>
  );
}

function Hidden({ children }: { children: ReactNode }) {
  return (
    <p className={cn(typo.bodySm, "rounded-xl border border-dashed border-muted-soft p-lg text-body")}>{children}</p>
  );
}

// 사용자가 앨범을 바꾸거나 사진을 넣으면(scrollRequest 증가), 사진을 다 불러온 뒤 미리보기 칸 안에서만 활동 사진 구역으로 내린다.
// 값 변화로 판단하지 않는다 — 수정 화면은 빈 값으로 먼저 그려지고 상세로 채워지는데, 그것까지 "변화"로 보면 열자마자 튄다.
// 페이지 전체는 스크롤하지 않는다.
function useScrollToGallery(request: number, settledSignature: string | null) {
  const done = useRef(request);
  useEffect(() => {
    if (request === done.current || settledSignature === null) return; // 요청 없음 / 앨범 불러오는 중
    done.current = request;
    const targets = document.querySelectorAll<HTMLElement>("[data-preview-scroll-target]");
    targets.forEach((el) => {
      const box = scrollParent(el);
      if (!box) return;
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - spacingPx("base");
      box.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    });
  }, [request, settledSignature]);
}

function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
  }
  return null;
}

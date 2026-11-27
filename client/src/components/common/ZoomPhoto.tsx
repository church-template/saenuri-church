"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PhotoViewer } from "./PhotoViewer";

interface ZoomPhotoProps {
  src: string;
  alt: string;
  /** 크게 볼 때 사진 아래에 붙는 설명(없으면 생략) */
  caption?: string | null;
  /** 버튼 이름 앞부분 — "{label} 크게 보기". 기본은 caption, 없으면 alt */
  label?: string;
  /** 버튼 모양(크기·포커스 링)은 카드가 정한다 */
  className?: string;
  /** 지금 보이지 않는 카드 — 탭 순서에서 뺀다 */
  hidden?: boolean;
  priority?: boolean;
  lazy?: boolean;
}

// 누르면 크게 보이는 사진 — 사진 카드(홈 story-hero 카드·snap-card)의 공통 알맹이.
// 카드 겉모양(테두리·기울기·캡션 위치)은 각 카드가, 누름·확대는 여기가 맡는다.
export function ZoomPhoto({ src, alt, caption, label, className, hidden, priority, lazy }: ZoomPhotoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={cn("block w-full cursor-zoom-in", className)}
        onClick={() => setOpen(true)}
        tabIndex={hidden ? -1 : undefined}
        aria-label={`${label || caption || alt} 크게 보기`} // 빈 캡션(API 사진)은 alt로 넘어간다
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 프레젠테이션 셸(정적 에셋·연출 미디어) */}
        <img src={src} alt={alt} fetchPriority={priority ? "high" : undefined} loading={lazy ? "lazy" : undefined} />
      </button>
      <PhotoViewer
        photos={[{ src, alt, caption }]}
        title="사진 크게 보기"
        index={open ? 0 : null}
        onIndexChange={(i) => setOpen(i !== null)}
      />
    </>
  );
}

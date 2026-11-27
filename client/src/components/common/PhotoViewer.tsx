"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";

export interface ViewerPhoto {
  /** null이면 열 주소가 없는 사진 — 사진 자리만 비운다(갤러리 비공개 미디어) */
  src: string | null;
  alt: string;
  caption?: string | null;
}

interface PhotoViewerProps {
  photos: ViewerPhoto[];
  /** 스크린리더용 창 제목 — 여러 장이면 뒤에 "사진 n / 전체"가 붙는다 */
  title: string;
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

const navButton = "absolute top-1/2 -translate-y-1/2 rounded-full bg-surface-card/80 p-xs text-ink disabled:opacity-30";

// 사진 크게 보기(DESIGN.md photo-viewer) — 사이트의 모든 사진 확대가 이 하나를 쓴다.
// 공용 Dialog(ESC·포커스 트랩·스크롤 잠금) 위에 사진 + (여러 장이면) 좌우 이동·순번 + 캡션.
// 사진 둘레 여백은 네 변 같게(p-base), 닫기 X는 사진 모서리 위라 반투명 흰 원판을 깐다.
export function PhotoViewer({ photos, title, index, onIndexChange }: PhotoViewerProps) {
  const open = index !== null;
  const current = open ? photos[index] : null;
  const many = photos.length > 1;

  const go = (delta: number) => {
    if (index === null) return;
    const next = index + delta;
    if (next >= 0 && next < photos.length) onIndexChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onIndexChange(null))}>
      <DialogContent
        className="max-w-[var(--container-lightbox)] p-base"
        closeClassName="right-lg top-lg rounded-full bg-surface-card/80 p-sm text-ink hover:bg-surface-card"
        aria-describedby={undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
      >
        {/* a11y: 제목은 시각적으로 숨기되 aria 연결 유지(가이드 15.2) */}
        <DialogTitle className="sr-only">
          {many ? `${title} 사진 ${open ? index + 1 : 0} / ${photos.length}` : title}
        </DialogTitle>

        {current ? (
          <div className="flex flex-col gap-sm">
            <div className="relative flex items-center justify-center">
              {current.src ? (
                // eslint-disable-next-line @next/next/no-img-element -- 프레젠테이션 셸
                <img
                  src={current.src}
                  alt={current.alt}
                  /* max-h-[70vh]: 뷰포트 높이 제약(색·간격 토큰이 아닌 레이아웃 값) — dept-hero 70vh 선례와 동일 */
                  className="max-h-[70vh] w-auto rounded-md object-contain"
                />
              ) : null}
              {many ? (
                <>
                  <Button
                    type="button"
                    variant="tertiary"
                    iconOnly
                    onClick={() => go(-1)}
                    disabled={index === 0}
                    aria-label="이전 사진"
                    className={cn(navButton, "left-xs")}
                  >
                    <ChevronLeft size={24} aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="tertiary"
                    iconOnly
                    onClick={() => go(1)}
                    disabled={index === photos.length - 1}
                    aria-label="다음 사진"
                    className={cn(navButton, "right-xs")}
                  >
                    <ChevronRight size={24} aria-hidden />
                  </Button>
                </>
              ) : null}
            </div>
            {many ? (
              <div className={cn(typo.datetime, "text-center text-muted")}>
                {index! + 1} / {photos.length}
              </div>
            ) : null}
            {current.caption ? (
              <p className={cn(typo.caption, "text-center text-muted")}>{current.caption}</p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

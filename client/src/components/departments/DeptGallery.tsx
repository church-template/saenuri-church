"use client";

import { useState } from "react";
import { Container } from "@/components/shell/Container";
import { PhotoViewer } from "@/components/common/PhotoViewer";
import { Button } from "@/components/ui/Button";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptPhoto } from "@/constants/departments";

const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-md";

// 활동 사진 — 회색 밴드(풀블리드) 위 그리드 + 확대 모달(ChurchPhotos 라이트박스 패턴, 카테고리 탭 없음).
// 소개 직후 배치라 감정 후크를 조기 노출하고, 밴드 리듬(흰↔회색 교차)을 위해 surface-soft 밴드로 감싼다.
// 정적 public 에셋을 <img>로 직접 렌더(멤버 갤러리 PhotoLightbox와 분리).
// 한 번에 PAGE장씩 — 더 보기로 다음 장들을 연다. 라이트박스는 전체 사진을 넘긴다.
const PAGE = 8;

export function DeptGallery({
  heading,
  photos,
  moreLabel = "더 보기",
}: {
  heading: string;
  photos: DeptPhoto[];
  moreLabel?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(PAGE);

  return (
    <section className="bg-surface-soft py-section">
      <Container>
        <h2 className={cn(typo.displayMd, "text-ink")}>{heading}</h2>
        <div className="mt-lg grid grid-cols-2 gap-xs sm:grid-cols-3 lg:grid-cols-4">
          {photos.slice(0, shown).map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 사진 크게 보기`}
              className={cn("block w-full", focusRing)}
            >
              <span className="block aspect-square overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element -- 프레젠테이션 셸 */}
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                />
              </span>
            </button>
          ))}
        </div>
        {shown < photos.length ? (
          <div className="mt-lg flex justify-center">
            <Button type="button" variant="secondary" onClick={() => setShown((n) => n + PAGE)}>
              {moreLabel}
            </Button>
          </div>
        ) : null}

        <PhotoViewer photos={photos} title={heading} index={index} onIndexChange={setIndex} />
      </Container>
    </section>
  );
}

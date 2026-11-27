"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PhotoViewer } from "@/components/common/PhotoViewer";
import { EmptyState } from "@/components/common/EmptyState";
import { cn } from "@/lib/utils";
import type { PhotoGroup } from "@/constants/content";

const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-md";

// 교회사진 공개 페이지 본체 — 카테고리 토글(Tabs) + 그리드 + 확대 모달(Dialog).
// 갤러리 미재사용(자체 컴포넌트), 이미지는 public/ 정적 에셋을 <img>로 직접 렌더.
export function ChurchPhotos({ empty, groups }: { empty: string; groups: PhotoGroup[] }) {
  const [activeKey, setActiveKey] = useState(groups[0]?.key ?? "");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeGroup = groups.find((g) => g.key === activeKey) ?? groups[0];
  const photos = activeGroup?.photos ?? [];

  // groups가 비어 주입되면(외부 데이터) 화면이 빈 채로 남지 않도록 최소 fallback.
  if (groups.length === 0) {
    return <EmptyState message={empty} className="mt-xl" />;
  }

  return (
    <>
      <Tabs
        value={activeKey}
        onValueChange={(v) => {
          setActiveKey(v);
          setLightboxIndex(null); // 묶음 전환 시 모달 닫기
        }}
        className="mt-xl"
      >
        <TabsList>
          {groups.map((g) => (
            <TabsTrigger key={g.key} value={g.key}>
              {g.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((g) => (
          <TabsContent key={g.key} value={g.key}>
            {g.photos.length === 0 ? (
              <EmptyState message={empty} className="mt-lg" />
            ) : (
              <div className="mt-lg grid grid-cols-2 gap-xs sm:grid-cols-3 lg:grid-cols-4">
                {g.photos.map((p, i) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`${i + 1}번째 사진 크게 보기`}
                    className={cn("block w-full", focusRing)}
                  >
                    <span className="block aspect-square overflow-hidden rounded-md">
                      {/* eslint-disable-next-line @next/next/no-img-element -- 프레젠테이션 셸 */}
                      <img
                        src={p.src}
                        alt={p.alt}
                        className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                      />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <PhotoViewer photos={photos} title={activeGroup?.title ?? ""} index={lightboxIndex} onIndexChange={setLightboxIndex} />
    </>
  );
}

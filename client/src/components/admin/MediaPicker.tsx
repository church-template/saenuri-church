// src/components/admin/MediaPicker.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";
import { mediaSrc } from "@/lib/mediaUrl";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";
import { adminKeys } from "@/lib/admin/queryKeys";
import { listMedia, type MediaResponse } from "@/lib/api/media.admin";
import { MediaUploader } from "./MediaUploader";

export interface MediaPickerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accept: "image" | "pdf";
  multiple?: boolean;
  // urls: 고른 미디어의 id→서명 주소(있는 것만, #32) — 저장 전 미리보기용(안 쓰인 파일은 공개 주소가 404).
  onConfirm: (mediaIds: number[], urls: Record<string, string>) => void;
}

// 고른 id 중 서명 주소가 있는 것만 id→url로 모은다(없으면 호출부가 공개 주소로 폴백).
export function signedUrlsOf(ids: number[], media: MediaResponse[]): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const m of media) {
    if (m.url && ids.includes(m.id)) urls[String(m.id)] = m.url;
  }
  return urls;
}

export function MediaPicker({ open, onOpenChange, accept, multiple = false, onConfirm }: MediaPickerProps) {
  const [selected, setSelected] = useState<number[]>([]);
  // 이번에 올린 파일은 목록 재조회 전에 고를 수 있어 따로 기억한다(서명 주소 전달용).
  const [uploadedMedia, setUploadedMedia] = useState<MediaResponse[]>([]);
  const params = { type: accept };
  const media = useQuery({
    queryKey: adminKeys.list("media", params),
    queryFn: () => listMedia(params),
    enabled: open,
    retry: false,
  });

  function toggle(id: number) {
    setSelected((prev) =>
      multiple ? (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]) : [id],
    );
  }
  function handleUploaded(uploaded: MediaResponse[]) {
    const ids = uploaded.map((m) => m.id);
    setUploadedMedia((prev) => [...prev, ...uploaded]);
    setSelected((prev) => (multiple ? [...prev, ...ids] : ids.slice(-1)));
    media.refetch();
  }
  function confirm() {
    onConfirm(selected, signedUrlsOf(selected, [...uploadedMedia, ...(media.data?.content ?? [])]));
    setSelected([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setSelected([]); onOpenChange(v); }}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>미디어 선택</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">라이브러리</TabsTrigger>
            <TabsTrigger value="upload">새 업로드</TabsTrigger>
          </TabsList>
          <TabsContent value="library">
            {media.isPending ? (
              <div className="grid grid-cols-2 gap-xs sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            ) : !media.data || media.data.content.length === 0 ? (
              <EmptyState message="라이브러리에 미디어가 없습니다." />
            ) : (
              <div className="grid grid-cols-2 gap-xs sm:grid-cols-3">
                {media.data.content.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    aria-pressed={selected.includes(m.id)}
                    className={cn(
                      "rounded-md border text-left",
                      selected.includes(m.id) ? "border-primary ring-1 ring-primary" : "border-hairline",
                    )}
                  >
                    {accept === "image" ? (
                      // fill 모드는 부모 relative 필수(next/image 규약). 다이얼로그 셀 폭 근사 sizes=200px.
                      <span className="relative block aspect-square w-full overflow-hidden rounded-md">
                        <Image src={mediaSrc(m.id, m.url)} unoptimized={!!m.url} alt={m.filename} fill sizes="200px" className="object-cover" />
                      </span>
                    ) : (
                      <span className={cn(typo.bodySm, "block truncate p-sm text-ink")}>{m.filename}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="upload">
            <MediaUploader accept={accept} multiple={multiple} onUploaded={handleUploaded} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => { setSelected([]); onOpenChange(false); }}>
            취소
          </Button>
          <Button type="button" variant="primary" disabled={selected.length === 0} onClick={confirm}>
            선택 ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

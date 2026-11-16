"use client";

import { useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/Textarea";
import { MarkdownContent } from "@/components/common/MarkdownContent";
import type { MediaUrlOptions } from "@/lib/markdown";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  error?: string;
  placeholder?: string;
  /** Textarea 행 수. 미지정 시 Textarea 기본(12) 유지 — 폼별로 높이를 조정할 때 사용. */
  rows?: number;
  /** 본문에 이미 있는 비공개 미디어의 id→서명 주소(앨범 설명 수정 시 응답 `mediaUrls`, #32). 주면 키 없는 이미지는 미리보기에서 뺀다. */
  mediaUrls?: Record<string, string>;
}

// 미리보기 주소 규칙 — 앨범 설명(mediaUrls 있음)은 공개 근거가 없어 맵에 없는 이미지는 뺀다.
// 그 밖의 본문(공지·행사·부서)은 저장된 이미지가 공개라, 방금 고른 사진만 서명 주소로 덮고 나머지는 공개 주소.
function previewMedia(
  mediaUrls: Record<string, string> | undefined,
  picked: Record<string, string>,
): MediaUrlOptions | undefined {
  if (mediaUrls) return { urls: { ...mediaUrls, ...picked }, missing: "drop" };
  return Object.keys(picked).length ? { urls: picked, missing: "public" } : undefined;
}

// Radix TabsContent는 비활성 탭의 자식을 아예 마운트하지 않는다.
// → preview 탭이 선택될 때만 MarkdownContent가 마운트되므로 작성 중 renderMarkdown은 실행되지 않는다.
export function MarkdownEditor({ value, onChange, id, error, placeholder, rows, mediaUrls }: MarkdownEditorProps) {
  const [tab, setTab] = useState("write");
  // 이번 편집에서 툴바로 넣은 사진의 서명 주소 — 저장 전엔 공개 근거가 없어 공개 주소가 404일 수 있다(#32).
  const [pickedUrls, setPickedUrls] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="write">작성</TabsTrigger>
        <TabsTrigger value="preview">미리보기</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <div className="flex flex-col gap-xs">
          <MarkdownToolbar
            textareaRef={textareaRef}
            value={value}
            onChange={onChange}
            onMediaUrls={(urls) => setPickedUrls((prev) => ({ ...prev, ...urls }))}
          />
          <Textarea
            ref={textareaRef}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            placeholder={placeholder}
            rows={rows}
          />
        </div>
      </TabsContent>
      <TabsContent value="preview">
        {value.trim() ? (
          <MarkdownContent source={value} media={previewMedia(mediaUrls, pickedUrls)} />
        ) : (
          <p className={cn(typo.bodySm, "text-muted")}>미리볼 내용이 없습니다.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}

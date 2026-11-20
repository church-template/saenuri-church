import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";
import { formatDate } from "@/lib/date";
import { gallerySrc } from "@/lib/mediaUrl";
import { MembersOnlyBadge } from "@/components/visibility/MembersOnlyBadge";
import type { GalleryAlbumCardResponse } from "@/lib/api/types";

const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-xl";

// 앨범 카드 — 16:9 썸네일(첫 사진, 없으면 플레이스홀더) + 제목 + 메타. department-card 호버 재사용.
// showBadge: 메뉴 전체가 교인만이면 글 단위 교인만 배지를 그리지 않는다(#46).
export function AlbumCard({ album, showBadge = true }: { album: GalleryAlbumCardResponse; showBadge?: boolean }) {
  // thumbnailUrl: null=썸네일 없음(플레이스홀더), 없음(구 백엔드)=thumbnailMediaId로 조립(#32).
  const thumb = gallerySrc(album.thumbnailMediaId, album.thumbnailUrl);
  return (
    <Link href={`/gallery/albums/${album.id}`} className={cn("block", focusRing)}>
      <Card bordered interactive className="group h-full">
        {/* fill 모드는 부모 relative 필수(next/image 규약). 항상 unoptimized: 서명 주소(쿼리스트링)는 remotePatterns(search 없음)에 안 맞고,
            무서명 주소도 공개 범위가 바뀔 수 있는데 31일 최적화 캐시는 지울 방법이 없어 교인만으로 바꾼 뒤에도 내준다(#32, 스펙 6.6-16). */}
        <div className="relative aspect-video overflow-hidden">
          {thumb ? (
            <Image
              src={thumb}
              unoptimized
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-strong">
              <ImageOff size={32} className="text-muted" aria-hidden />
            </div>
          )}
        </div>
        <div className="p-xl">
          <div className="flex flex-wrap items-center gap-xs">
            <h3 className={cn(typo.titleMd, "text-ink")}>{album.title}</h3>
            {showBadge && album.membersOnly ? <MembersOnlyBadge /> : null}
          </div>
          <p className={cn(typo.datetime, "mt-xxs text-muted")}>
            {formatDate(album.createdAt)} · 사진 {album.photoCount}장
            {album.author ? ` · ${album.author}` : ""}
          </p>
          {album.tags.length > 0 ? (
            <div className="mt-sm flex flex-wrap gap-xs">
              {album.tags.map((t) => (
                <Badge key={t.id}>{t.name}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}

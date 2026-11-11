import { NoticeRow } from "@/components/cards/NoticeRow";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHead } from "./SectionHead";
import { formatDate } from "@/lib/date";
import { MAIN_SECTIONS } from "@/constants/content";
import type { NoticeCardResponse } from "@/lib/api/types";

const N = MAIN_SECTIONS.notices;

// 13.4 ④ 공지 3 — 소식 밴드(page)의 왼쪽 열. hairline 행 목록, 고정글 우선 정렬은 서버 보장(재정렬 금지).
export function NoticeSection({ notices }: { notices: NoticeCardResponse[] }) {
  return (
    <div>
      <SectionHead title={N.title} more={{ label: N.more, href: N.moreHref }} />
      {notices.length === 0 ? (
        <EmptyState message={N.empty} className="mt-lg" />
      ) : (
        <div className="mt-base">
          {notices.map((n) => (
            <NoticeRow
              key={n.id}
              title={n.title}
              date={formatDate(n.createdAt)}
              isPinned={n.isPinned}
              href={`/notices/${n.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";

export interface SectionHeadProps {
  title: string;
  eyebrow?: string;
  /** external: 다른 사이트로 나가는 링크 — 새 탭 + 바깥 링크 아이콘 */
  more?: { label: string; href: string; external?: boolean };
  className?: string;
}

const moreClass = cn(
  typo.bodyStrong,
  "inline-flex min-h-12 items-center gap-xxs text-primary hover:text-primary-active",
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
);

// 메인 섹션 머리(main-section-head) — 영문 eyebrow + display-lg 제목 + 우측 "전체 보기" 링크.
// 링크는 48px 터치 타깃(고령 사용자). 좁은 폭에서는 제목 아래로 내려간다.
export function SectionHead({ title, eyebrow, more, className }: SectionHeadProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-base", className)}>
      <div>
        {eyebrow ? <p className={cn(typo.captionStrong, "mb-sm text-primary")}>{eyebrow}</p> : null}
        <h2 className={cn(typo.displayLg, "text-ink")}>{title}</h2>
      </div>
      {more ? (
        more.external ? (
          <a href={more.href} target="_blank" rel="noopener noreferrer" className={moreClass}>
            {more.label}
            <ExternalLink size={20} aria-hidden />
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
        ) : (
          <Link href={more.href} className={moreClass}>
            {more.label}
            <ArrowRight size={20} aria-hidden />
          </Link>
        )
      ) : null}
    </div>
  );
}

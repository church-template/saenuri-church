import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";

export interface SectionHeadProps {
  title: string;
  eyebrow?: string;
  more?: { label: string; href: string };
  className?: string;
}

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
        <Link
          href={more.href}
          className={cn(
            typo.bodyStrong,
            "inline-flex min-h-12 items-center gap-xxs text-primary hover:text-primary-active",
            "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          )}
        >
          {more.label}
          <ArrowRight size={20} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

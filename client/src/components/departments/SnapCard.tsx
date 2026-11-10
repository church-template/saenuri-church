import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptSnap } from "@/constants/departments";
import styles from "./Snap.module.css";

// 기울인 사진 카드(snap-card) — 흰 테두리 + 캡션. 기울기는 호출부가 className으로 준다.
export function SnapCard({ snap, className }: { snap: DeptSnap; className?: string }) {
  return (
    <figure className={cn(styles.snap, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 프레젠테이션 셸(정적 public 에셋) */}
      <img src={snap.src} alt={snap.alt} loading="lazy" />
      <figcaption className={cn(typo.caption, "text-body")}>{snap.caption}</figcaption>
    </figure>
  );
}

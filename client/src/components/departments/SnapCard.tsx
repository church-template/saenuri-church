import { ZoomPhoto } from "@/components/common/ZoomPhoto";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptSnap } from "@/constants/departments";
import styles from "./Snap.module.css";

// 기울인 사진 카드(snap-card) — 흰 테두리 + 캡션. 기울기는 호출부가 className으로 준다. 누르면 크게 보기(ZoomPhoto).
export function SnapCard({ snap, className }: { snap: DeptSnap; className?: string }) {
  return (
    <figure className={cn(styles.snap, className)}>
      <ZoomPhoto src={snap.src} alt={snap.alt} caption={snap.caption} lazy className={styles.zoom} />
      {/* API 사진은 캡션이 없다(#32) — 빈 캡션은 줄째 숨긴다. */}
      {snap.caption ? <figcaption className={cn(typo.caption, "text-body")}>{snap.caption}</figcaption> : null}
    </figure>
  );
}

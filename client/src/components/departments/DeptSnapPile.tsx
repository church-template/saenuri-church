import type { DeptSnap } from "@/constants/departments";
import { SnapCard } from "./SnapCard";
import styles from "./Snap.module.css";

const MAX = 3; // 더미 배치(CSS nth-child)가 3장까지만 정의돼 있다

// 사진 더미 — 상세 소개 옆에 사진 몇 장을 겹쳐 놓는다. 사진이 적은 팀도 틀이 비지 않게 1~3장 모두 성립.
export function DeptSnapPile({ snaps }: { snaps: DeptSnap[] }) {
  const shown = snaps.slice(0, MAX);
  return (
    <div className={styles.pile} data-count={shown.length}>
      {shown.map((s) => (
        <SnapCard key={s.src} snap={s} />
      ))}
    </div>
  );
}

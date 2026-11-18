"use client";

import Link from "next/link";
import { RequirePermission } from "@/components/admin/RequirePermission";
import { buttonVariants } from "@/components/ui/Button";
import { ACTION } from "@/constants/actionButton";

// 미션팀 상세의 "이 팀 수정"(admin-inline-action) — DEPT_WRITE 보유자에게만 보인다.
// 수정은 전용 페이지에서 한다(#37). 저장하면 이 미션팀 화면으로 돌아오도록 from을 넘긴다.
export function DeptEditAction({ departmentId, slug }: { departmentId: number; slug: string }) {
  const href = `/mypage/manage/departments/${departmentId}/edit?from=${encodeURIComponent(`/departments/${slug}`)}`;
  return (
    <RequirePermission permission="DEPT_WRITE">
      <div className="mb-base flex justify-end">
        <Link href={href} className={buttonVariants("tertiary")}>
          <ACTION.edit.Icon size={18} aria-hidden />
          이 팀 수정
        </Link>
      </div>
    </RequirePermission>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RequirePermission } from "@/components/admin/RequirePermission";
import { DepartmentFormDialog } from "@/components/admin/departments/DepartmentFormDialog";
import { Button } from "@/components/ui/Button";
import { ACTION } from "@/constants/actionButton";
import { adminKeys } from "@/lib/admin/queryKeys";
import { listDepartmentsAdmin } from "@/lib/api/departments.admin";

// 미션팀 상세의 "이 팀 수정"(admin-inline-action, #32) — DEPT_WRITE 보유자에게만 보이고,
// 관리 화면과 같은 부서 수정 창을 이 자리에서 연다. 저장하면 창이 공개 캐시를 비우고 여기선 화면만 새로 그린다.
export function DeptEditAction({ departmentId }: { departmentId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // 상위 부서 select 옵션용 — 창을 열 때만 조회(관리 화면과 같은 쿼리 키 공유).
  const list = useQuery({
    queryKey: adminKeys.list("departments"),
    queryFn: listDepartmentsAdmin,
    enabled: open,
    retry: false,
  });

  return (
    <RequirePermission permission="DEPT_WRITE">
      <div className="mb-base flex justify-end">
        <Button type="button" variant="tertiary" onClick={() => setOpen(true)}>
          <ACTION.edit.Icon size={18} aria-hidden />
          이 팀 수정
        </Button>
      </div>
      <DepartmentFormDialog
        open={open}
        onOpenChange={setOpen}
        mode="edit"
        editId={departmentId}
        departments={list.data ?? []}
        onSaved={() => router.refresh()}
      />
    </RequirePermission>
  );
}

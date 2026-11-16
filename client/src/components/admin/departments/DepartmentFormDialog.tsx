"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { typo } from "@/constants/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { mediaSrc } from "@/lib/mediaUrl";
import { fetchAlbums } from "@/lib/api/gallery";
import { revalidateDepartments } from "@/lib/admin/revalidate";
import { adminOnError } from "@/lib/admin/mutationHandlers";
import { notify } from "@/lib/notify";
import { adminKeys } from "@/lib/admin/queryKeys";
import { ACTION } from "@/constants/actionButton";
import { buildDepartmentTree } from "@/lib/api/departments";
import { collectDescendantIds, findNode } from "./treeUtils";
import {
  createDepartment,
  updateDepartment,
  getDepartmentDetail,
  type DepartmentCreateRequest,
} from "@/lib/api/departments.admin";
import type { DepartmentCardResponse, DepartmentDetailResponse } from "@/lib/api/types";
import { departmentSchema, type DepartmentFormValues } from "./schema";

export interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  editId?: number; // edit 시 필수 — 열 때 상세로 version·값 시드
  departments: DepartmentCardResponse[]; // 상위 select 옵션 소스(평배열)
  defaultParentId?: number | null; // create 시 상위 프리셋(미지정=null=최상위)
  onSaved?: () => void;
}

const EMPTY: DepartmentFormValues = {
  name: "",
  description: "",
  leader: "",
  parentId: null,
  sortOrder: null,
  heroMediaId: null,
  albumId: null,
};

// 앨범 고르기 목록 — 한 페이지로 받는다(교회 앨범 수가 이보다 적다는 가정).
// ponytail: 앨범이 이 수를 넘으면 오래된 앨범이 목록에서 빠진다 — 그때 검색형 선택으로 바꾼다.
const ALBUM_OPTIONS_SIZE = 100;
const selectClass = cn(
  typo.bodyMd,
  "h-12 rounded-md border border-hairline bg-canvas px-4 text-ink",
  "focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary outline-hidden",
);

// POST·PUT 공용 body. 선택 빈값은 전송 제외. parentId는 null 그대로(PUT 루트화 의미 보존).
// heroMediaId·albumId는 null이어도 항상 보낸다 — 백엔드 규칙: 안 보냄=유지, null=비움, 숫자=설정(church-backend#92).
// 수정 창은 현재 값을 시드해 보내므로 손대지 않은 칸은 그대로 남고, "빼기"·"(없음)"은 null로 비운다.
// sortOrder 생략(=DTO null)은 백엔드에서 create=max+10·PUT=기존 유지로 동일 처리(api-docs §부서).
function toRequestBody(v: DepartmentFormValues): DepartmentCreateRequest {
  const opt = (s: string) => (s.trim() === "" ? undefined : s);
  return {
    name: v.name,
    description: opt(v.description),
    leader: opt(v.leader),
    parentId: v.parentId,
    sortOrder: v.sortOrder ?? undefined,
    heroMediaId: v.heroMediaId,
    albumId: v.albumId,
  };
}

function seedValues(d: DepartmentDetailResponse): DepartmentFormValues {
  return {
    name: d.name,
    description: d.description ?? "",
    leader: d.leader ?? "",
    parentId: d.parentId,
    sortOrder: d.sortOrder,
    heroMediaId: d.heroMediaId ?? null, // 백엔드 배포 전엔 필드가 없다 → null
    albumId: d.albumId ?? null,
  };
}

// 상위 select 옵션 — edit 시 자기 자신 + 모든 하위 제외(순환 방지), create는 전체. 목록 기준 계산(시드 상세와 무관).
function parentOptionsFor(
  departments: DepartmentCardResponse[],
  mode: "create" | "edit",
  editId: number | undefined,
): DepartmentCardResponse[] {
  if (mode === "edit" && editId != null) {
    const self = findNode(buildDepartmentTree(departments), editId);
    const excluded = self ? collectDescendantIds(self) : new Set<number>();
    excluded.add(editId);
    return departments.filter((d) => !excluded.has(d.id));
  }
  return departments;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  mode,
  editId,
  departments,
  defaultParentId,
  onSaved,
}: DepartmentFormDialogProps) {
  const qc = useQueryClient();
  const isEdit = mode === "edit" && editId != null;
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: EMPTY,
  });

  // edit: 열릴 때 상세를 fresh로 조회해 version·값을 시드. 파생값으로 다뤄 effect 내 React setState를 피한다
  // (staleTime/gcTime 0 → 매 오픈 최신; 409 충돌은 refetch로 갱신).
  const detail = useQuery({
    queryKey: adminKeys.detail("departments", editId ?? 0),
    queryFn: () => getDepartmentDetail(editId as number),
    enabled: open && isEdit,
    staleTime: 0,
    gcTime: 0,
    retry: false, // 재시도하면 제출 버튼이 ~30초간 말없이 멈춤 — 즉시 실패 후 토스트(Bulletin 정책)
  });
  const version = detail.data?.version ?? 0;
  // edit는 상세 시드가 완료돼야(데이터 있음·非fetching·非error) 제출 허용 — 시드 진행 중/실패 시 stale version(0) PUT 차단.
  const canSubmit = mode === "create" || (!!detail.data && !detail.isFetching && !detail.isError);

  const parentOptions = parentOptionsFor(departments, mode, editId);
  const [pickerOpen, setPickerOpen] = useState(false);
  // 방금 고른 사진의 서명 주소 — 저장 전엔 공개 근거가 없어 공개 주소가 404일 수 있다(#32). 저장된 대표 사진은 공개.
  const [heroPreview, setHeroPreview] = useState<{ id: number; url: string } | null>(null); // id가 같을 때만 쓴다(다른 부서로 다시 열어도 엉뚱한 사진 방지)
  const heroMediaId = useWatch({ control, name: "heroMediaId" });
  const albumId = useWatch({ control, name: "albumId" });
  // 앨범 목록은 GALLERY_VIEW 필요 — 실패하면 고르기만 못 하고(현재 값은 유지) 저장은 막지 않는다.
  const albums = useQuery({
    queryKey: ["albums", { size: ALBUM_OPTIONS_SIZE }],
    queryFn: () => fetchAlbums({ size: ALBUM_OPTIONS_SIZE }),
    enabled: open,
    retry: false,
  });
  const albumOptions = albums.data?.content ?? [];

  // 폼 시드: create는 빈 폼, edit는 상세 도착 시 reset. reset()은 RHF API라 effect 내 React setState가 아니다.
  useEffect(() => {
    if (!open) return;
    if (mode === "create") reset({ ...EMPTY, parentId: defaultParentId ?? null });
    else if (detail.data) reset(seedValues(detail.data));
  }, [open, mode, defaultParentId, detail.data, reset]);

  // 시드 조회 실패는 즉시 토스트로 알린다(제출 버튼이 말없이 멈추는 것 방지). notify는 setState 아님.
  useEffect(() => {
    if (detail.isError) adminOnError()(detail.error);
  }, [detail.isError, detail.error]);

  const mutation = useMutation({
    mutationFn: (v: DepartmentFormValues) => {
      const body = toRequestBody(v);
      if (mode === "edit" && editId != null) {
        // 항상 PUT — 전체 폼이므로 루트화(parentId null)·필드 교체를 한 경로로 처리(낙관락 version).
        return updateDepartment(editId, { ...body, version });
      }
      return createDepartment(body);
    },
    onError: adminOnError({
      onFieldErrors: (fes) =>
        fes.forEach((fe) => setError(fe.field as keyof DepartmentFormValues, { message: fe.reason })),
      // 409 충돌 → 최신본 재조회. 새 version·값은 위 시드 effect가 폼에 반영(refetch 중엔 canSubmit=false로 제출 차단).
      onReedit: () => {
        if (isEdit) void detail.refetch();
      },
    }),
    onSuccess: async () => {
      // 공개 미션팀 페이지가 사진·소개를 이 부서 API에서 읽는다(#32) — ISR 캐시를 즉시 비운다.
      await revalidateDepartments();
      qc.invalidateQueries({ queryKey: adminKeys.list("departments") });
      notify.success("저장했습니다.");
      onOpenChange(false);
      onSaved?.();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "부서 수정" : "새 부서"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((v) => {
            if (!canSubmit) return; // 시드 미완료 edit 제출 방지(disabled 우회 방어)
            mutation.mutate(v);
          })}
          className="flex flex-col gap-base"
        >
          <div className="flex flex-col gap-xxs">
            <label htmlFor="dept-name" className={cn(typo.bodySm, "text-ink")}>부서명</label>
            <Input id="dept-name" error={errors.name?.message} {...register("name")} />
          </div>
          <div className="flex flex-col gap-xxs">
            <label htmlFor="dept-leader" className={cn(typo.bodySm, "text-ink")}>담당(선택)</label>
            <Input id="dept-leader" error={errors.leader?.message} {...register("leader")} />
          </div>
          <div className="flex flex-col gap-xxs">
            <label htmlFor="dept-parent" className={cn(typo.bodySm, "text-ink")}>상위 부서</label>
            <Controller
              control={control}
              name="parentId"
              render={({ field }) => (
                <select
                  id="dept-parent"
                  className={selectClass}
                  value={field.value === null ? "" : String(field.value)}
                  onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                >
                  <option value="">(없음 — 최상위 부서)</option>
                  {parentOptions.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <label htmlFor="dept-sortOrder" className={cn(typo.bodySm, "text-ink")}>정렬 순서(선택)</label>
            <Controller
              control={control}
              name="sortOrder"
              render={({ field }) => (
                <Input
                  id="dept-sortOrder"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={field.value === null ? "" : String(field.value)}
                  onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                  error={errors.sortOrder?.message}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-xxs">
            <span className={cn(typo.bodySm, "text-ink")}>대표 사진(선택) — 미션팀 목록과 상세 맨 위</span>
            <div className="flex flex-wrap items-center gap-sm">
              {heroMediaId != null ? (
                // eslint-disable-next-line @next/next/no-img-element -- 작은 미리보기(백엔드 미디어 원본)
                <img
                  src={mediaSrc(heroMediaId, heroPreview?.id === heroMediaId ? heroPreview.url : null)}
                  alt="선택한 대표 사진"
                  className="size-20 rounded-md border border-hairline object-cover"
                />
              ) : null}
              <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)}>
                {heroMediaId != null ? "사진 바꾸기" : "사진 선택"}
              </Button>
              {heroMediaId != null ? (
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setValue("heroMediaId", null, { shouldDirty: true })}
                >
                  대표 사진 빼기
                </Button>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-xxs">
            <label htmlFor="dept-album" className={cn(typo.bodySm, "text-ink")}>활동 사진 앨범</label>
            <select
              id="dept-album"
              aria-describedby="dept-album-public-note"
              className={selectClass}
              value={albumId === null ? "" : String(albumId)}
              onChange={(e) =>
                setValue("albumId", e.target.value === "" ? null : Number(e.target.value), { shouldDirty: true })
              }
            >
              <option value="">(없음)</option>
              {/* 목록에 없는 현재 앨범(권한·100개 밖)도 값이 사라지지 않게 남긴다. */}
              {albumId != null && !albumOptions.some((a) => a.id === albumId) ? (
                <option value={albumId}>{`앨범 #${albumId}`}</option>
              ) : null}
              {albumOptions.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <span className={cn(typo.caption, "text-muted")}>
              앨범 사진이 활동 사진이 되고, 앞 3장은 소개 옆에 놓입니다. 사진은 갤러리에서 올리고 순서를 정합니다.
            </span>
            {/* 공개 범위 안내(church-backend#92 3.3) — 연결하면 교인 전용 갤러리 사진이 공개로 바뀐다. */}
            <p id="dept-album-public-note" className={cn(typo.caption, "flex items-start gap-xxs text-body")}>
              <Info size={16} aria-hidden className="mt-xxs shrink-0" />
              앨범을 연결하면 그 앨범의 사진 전체가 누구에게나 공개됩니다. 연결한 뒤 앨범에 추가하는 사진도 공개됩니다.
              대표 사진으로 고른 사진도 공개됩니다.
            </p>
          </div>
          <div className="flex flex-col gap-xxs">
            <span className={cn(typo.bodySm, "text-ink")}>설명(선택)</span>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <MarkdownEditor value={field.value} onChange={field.onChange} id="dept-description" rows={5} />
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="tertiary">{ACTION.cancel.label}</Button>
            </DialogClose>
            <Button type="submit" variant="primary" loading={mutation.isPending} disabled={!canSubmit}>{ACTION.save.label}</Button>
          </DialogFooter>
        </form>
        <MediaPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          accept="image"
          onConfirm={(ids, urls) => {
            if (ids[0] == null) return;
            const url = urls[String(ids[0])];
            setHeroPreview(url ? { id: ids[0], url } : null);
            setValue("heroMediaId", ids[0], { shouldDirty: true });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

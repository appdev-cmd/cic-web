"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Archive,
  Edit3,
  PackageOpen,
  PauseCircle,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  ProductTypeItem,
  ProductTypeLocale,
  ProductTypeModuleData,
} from "@/features/product-types/types";
import {
  bulkSetProductTypesPublishedAction,
  saveProductTypeAction,
  trashProductTypeAction,
} from "@/features/product-types/server/actions";
import { CmsBulkActionBar } from "../../components/ui/CmsBulkActionBar";
import { CmsButton, CmsIconButton } from "../../components/ui/CmsButton";
import { CmsPageHeader } from "../../components/ui/CmsPageHeader";
import { CmsPagination } from "../../components/ui/CmsPagination";
import { CmsSelectionCheckbox } from "../../components/ui/CmsSelectionCheckbox";
import { useDialogA11y } from "../activity_logs_trash/useDialogA11y";

type Capabilities = { create: boolean; edit: boolean; delete: boolean };
type Toast = { tone: "success" | "error"; message: string };
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function ProductTypesManager({
  data,
  locale,
  capabilities,
}: {
  data: ProductTypeModuleData;
  locale: ProductTypeLocale;
  capabilities: Capabilities;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const items = data[locale];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<ProductTypeItem | null | undefined>();
  const [deleting, setDeleting] = useState<ProductTypeItem | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const filtered = useMemo(() => {
    const q = query
      .trim()
      .toLocaleLowerCase(locale === "en" ? "en-US" : "vi-VN");
    return items.filter(
      (i) =>
        (status === "all" ||
          (status === "active" ? i.published : !i.published)) &&
        (!q ||
          `${i.name} ${i.alias}`
            .toLocaleLowerCase(locale === "en" ? "en-US" : "vi-VN")
            .includes(q)),
    );
  }, [items, locale, query, status]);
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageIds = pageItems.map((i) => i.id);
  const all =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const partial = !all && pageIds.some((id) => selected.includes(id));
  useEffect(() => {
    const last = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (page > last) setPage(last);
  }, [filtered.length, page, pageSize]);
  const mutate = (job: () => Promise<unknown>, message: string) =>
    startTransition(async () => {
      try {
        await job();
        setToast({ tone: "success", message });
        setSelected([]);
        setEditing(undefined);
        setDeleting(null);
        router.refresh();
      } catch (error) {
        setToast({
          tone: "error",
          message:
            error instanceof Error
              ? error.message
              : "Không thể hoàn tất thao tác.",
        });
      }
    });
  return (
    <div className="space-y-6 pb-20">
      {toast && (
        <div
          role={toast.tone === "error" ? "alert" : "status"}
          className={`fixed bottom-4 left-4 right-4 z-[80] rounded-xl px-4 py-3 text-sm font-bold text-white shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md ${toast.tone === "error" ? "bg-red-700" : "bg-slate-900"}`}
        >
          {toast.message}
        </div>
      )}
      <CmsPageHeader
        icon={<PackageOpen />}
        title="Loại sản phẩm"
        description="Chuẩn hóa loại sản phẩm dùng trong danh mục và bộ lọc website."
        actions={
          capabilities.create ? (
            <CmsButton
              size="sm"
              variant="primary"
              leadingIcon={<Plus />}
              onClick={() => setEditing(null)}
            >
              Thêm loại sản phẩm
            </CmsButton>
          ) : undefined
        }
      />
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative w-full max-w-md flex-1">
            <span className="sr-only">Tìm loại sản phẩm</span>
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên hoặc tên hiệu..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-base outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 sm:text-sm"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Lọc trạng thái"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as typeof status);
                setPage(1);
              }}
              className="min-h-11 min-w-44 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang sử dụng</option>
              <option value="inactive">Ngừng sử dụng</option>
            </select>
            <button
              type="button"
              disabled={!query && status === "all"}
              onClick={() => {
                setQuery("");
                setStatus("all");
                setPage(1);
              }}
              className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </button>
          </div>
        </div>
        <CmsBulkActionBar
          selectedCount={selected.length}
          itemLabel="loại sản phẩm"
          onClear={() => setSelected([])}
          actions={
            capabilities.edit
              ? [
                  {
                    label: "Ngừng sử dụng",
                    icon: PauseCircle,
                    onClick: () =>
                      mutate(
                        () =>
                          bulkSetProductTypesPublishedAction(
                            locale,
                            selected,
                            false,
                          ),
                        "Đã cập nhật trạng thái.",
                      ),
                  },
                ]
              : []
          }
        />
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
              <tr>
                <th className="w-14 p-4">
                  <CmsSelectionCheckbox
                    checked={all}
                    indeterminate={partial}
                    onChange={() =>
                      setSelected((cur) =>
                        all
                          ? cur.filter((id) => !pageIds.includes(id))
                          : [...new Set([...cur, ...pageIds])],
                      )
                    }
                    aria-label="Chọn trang hiện tại"
                  />
                </th>
                <th className="p-4">Tên và tên hiệu</th>
                <th className="p-4">Thứ tự</th>
                <th className="p-4">Sử dụng</th>
                <th className="p-4">Trạng thái</th>
                <th className="w-28 p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="p-4">
                    <CmsSelectionCheckbox
                      checked={selected.includes(item.id)}
                      onChange={() =>
                        setSelected((cur) =>
                          cur.includes(item.id)
                            ? cur.filter((id) => id !== item.id)
                            : [...cur, item.id],
                        )
                      }
                      aria-label={`Chọn ${item.name}`}
                    />
                  </td>
                  <td className="max-w-md p-4">
                    <div className="min-w-0">
                        <p className="break-words font-bold text-slate-950 dark:text-white">
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {item.alias}
                        </p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold tabular-nums">
                    #{item.ordering}
                  </td>
                  <td className="p-4 tabular-nums">
                    {item.usageCount} sản phẩm
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {item.published ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      {capabilities.edit && (
                        <CmsIconButton
                          aria-label={`Sửa ${item.name}`}
                          onClick={() => setEditing(item)}
                        >
                          <Edit3 />
                        </CmsIconButton>
                      )}
                      {capabilities.delete && (
                        <CmsIconButton
                          variant="danger"
                          aria-label={`Xóa ${item.name}`}
                          onClick={() => setDeleting(item)}
                        >
                          <Trash2 />
                        </CmsIconButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-sm text-slate-500"
                  >
                    Không tìm thấy loại sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <CmsPagination
          currentPage={page}
          pageSize={pageSize}
          totalCount={filtered.length}
          itemLabel="loại sản phẩm"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </section>
      {editing !== undefined && (
        <ProductTypeDrawer
          locale={locale}
          item={editing}
          pending={pending}
          onClose={() => setEditing(undefined)}
          onSave={(payload) =>
            mutate(
              () => saveProductTypeAction(locale, editing?.id ?? null, payload),
              editing ? "Đã cập nhật loại sản phẩm." : "Đã tạo loại sản phẩm.",
            )
          }
        />
      )}
      {deleting && (
        <DeleteDialog
          item={deleting}
          pending={pending}
          onClose={() => setDeleting(null)}
          onDeactivate={() =>
            mutate(
              () =>
                bulkSetProductTypesPublishedAction(
                  locale,
                  [deleting.id],
                  false,
                ),
              "Đã ngừng sử dụng loại sản phẩm.",
            )
          }
          onTrash={() =>
            mutate(
              () => trashProductTypeAction(locale, deleting.id),
              "Đã chuyển loại sản phẩm vào Thùng rác.",
            )
          }
        />
      )}
    </div>
  );
}

function ProductTypeDrawer({
  locale,
  item,
  pending,
  onClose,
  onSave,
}: {
  locale: ProductTypeLocale;
  item: ProductTypeItem | null;
  pending: boolean;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    alias: string;
    ordering: number;
    published: boolean;
  }) => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [ordering, setOrdering] = useState(item?.ordering ?? 1);
  const [published, setPublished] = useState(item?.published ?? true);
  const [error, setError] = useState("");
  const dialogRef = useDialogA11y(true, onClose);
  const alias = slugify(name);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !alias) {
      setError("Vui lòng nhập tiêu đề dữ liệu.");
      return;
    }
    onSave({ name: name.trim(), alias, ordering, published });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs"
        onMouseDown={onClose}
      />
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-type-form-title"
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-[71] flex h-full w-full max-w-2xl flex-col justify-between border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-600 p-2.5 text-white shadow-md shadow-orange-600/20">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="product-type-form-title"
                className="text-base font-black text-slate-900 dark:text-white"
              >
                {item ? "Chỉnh sửa" : "Thêm"} Loại sản phẩm
              </h2>
              <p className="text-xs font-bold text-orange-600">
                Dùng trong phần thiết lập sản phẩm · {locale.toUpperCase()}
              </p>
            </div>
          </div>
          <CmsIconButton aria-label="Đóng" onClick={onClose}>
            <X />
          </CmsIconButton>
        </header>

        <form
          id="productTypeForm"
          onSubmit={submit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6 text-xs"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="sm:col-span-2">
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Tiêu đề dữ liệu <span className="text-red-500">*</span>
              </span>
              <input
                autoFocus
                required
                value={name}
                maxLength={255}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Ví dụ: Phần mềm"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
              />
            </label>
            <label>
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Tên hiệu{" "}
                <span className="font-normal text-slate-400">
                  (Tự động sinh)
                </span>
                :
              </span>
              <input
                readOnly
                value={alias}
                placeholder="ten-hieu-tu-dong"
                className="min-h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 font-mono text-base text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:text-sm"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Trạng thái hoạt động:
              </span>
              <select
                value={published ? "active" : "inactive"}
                onChange={(e) => setPublished(e.target.value === "active")}
                className="min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-bold outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 sm:text-sm"
              >
                <option value="active">Đang sử dụng</option>
                <option value="inactive">Ngừng sử dụng</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Thứ tự ưu tiên:
              </span>
              <input
                type="number"
                min={1}
                max={1000000}
                value={ordering}
                onChange={(e) => setOrdering(Number(e.target.value))}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-bold outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 sm:text-sm"
              />
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
        </form>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-slate-800 dark:bg-slate-900">
          <CmsButton onClick={onClose} disabled={pending}>
            Hủy bỏ
          </CmsButton>
          <CmsButton
            form="productTypeForm"
            type="submit"
            variant="primary"
            leadingIcon={<Save />}
            disabled={pending}
          >
            {pending
              ? "Đang lưu..."
              : item
                ? "Lưu thay đổi"
                : "Thêm Loại sản phẩm"}
          </CmsButton>
        </footer>
      </aside>
    </>
  );
}

function DeleteDialog({
  item,
  pending,
  onClose,
  onDeactivate,
  onTrash,
}: {
  item: ProductTypeItem;
  pending: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onTrash: () => void;
}) {
  const dialogRef = useDialogA11y(true, onClose);
  const used = item.usageCount > 0;
  return (
    <div className="fixed inset-0 z-[75] grid place-items-center bg-slate-950/65 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-type-delete-title"
        tabIndex={-1}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <header className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <h2 id="product-type-delete-title" className="font-black">
              Xác nhận thay đổi dữ liệu
            </h2>
            <p className="mt-1 break-words text-sm font-bold text-red-600">
              {item.name}
            </p>
          </div>
          <CmsIconButton aria-label="Đóng" onClick={onClose}>
            <X />
          </CmsIconButton>
        </header>
        <div className="space-y-3 p-5 text-sm">
          <p>
            Loại này đang được <strong>{item.usageCount}</strong> sản phẩm sử
            dụng.
          </p>
          <button
            type="button"
            disabled={pending || !item.published}
            onClick={onDeactivate}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-left font-bold text-amber-900 disabled:opacity-50"
          >
            <PauseCircle className="h-5 w-5" />
            Ngừng sử dụng — nên chọn
          </button>
          <button
            type="button"
            disabled={pending || used}
            onClick={onTrash}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-left font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Archive className="h-5 w-5" />
            {used
              ? "Không thể xóa khi còn sản phẩm sử dụng"
              : "Chuyển vào Thùng rác"}
          </button>
        </div>
      </div>
    </div>
  );
}

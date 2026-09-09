"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Archive,
  Edit3,
  FolderTree,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  SalesOwnerAssignments,
  SalesOwnerItem,
  SalesOwnerLocale,
  SalesOwnerModuleData,
  SalesOwnerProductOption,
} from "@/features/sales-owners/types";
import {
  bulkSetSalesOwnersPublishedAction,
  saveSalesOwnerAction,
  trashSalesOwnerAction,
} from "@/features/sales-owners/server/actions";
import { CmsBulkActionBar } from "@/cms/components/ui/CmsBulkActionBar";
import { CmsButton, CmsIconButton } from "@/cms/components/ui/CmsButton";
import { CmsPageHeader } from "@/cms/components/ui/CmsPageHeader";
import { CmsPagination } from "@/cms/components/ui/CmsPagination";
import { CmsSelectionCheckbox } from "@/cms/components/ui/CmsSelectionCheckbox";
import { useDialogA11y } from "@/cms/modules/activity_logs_trash/useDialogA11y";
type Caps = { create: boolean; edit: boolean; delete: boolean };
type Toast = { tone: "success" | "error"; message: string };
const fieldClass =
  "min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 placeholder:text-slate-400 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 sm:text-sm";
const emptyAssignments = (): SalesOwnerAssignments => ({
  contact: [],
  sales: [],
  technical: [],
  northSales: [],
  southSales: [],
});
const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
export function SalesOwnersManager({
  data,
  locale,
  capabilities,
}: {
  data: SalesOwnerModuleData;
  locale: SalesOwnerLocale;
  capabilities: Caps;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { items, products } = data[locale];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [product, setProduct] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<SalesOwnerItem | null | undefined>();
  const [deleting, setDeleting] = useState<SalesOwnerItem | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const filtered = useMemo(() => {
    const q = query
      .trim()
      .toLocaleLowerCase(locale === "en" ? "en-US" : "vi-VN");
    return items.filter(
      (i) =>
        (status === "all" ||
          (status === "active" ? i.published : !i.published)) &&
        (product === "all" ||
          Object.values(i.assignments).some((ids) => ids.includes(product))) &&
        (!q ||
          i.name
            .toLocaleLowerCase(locale === "en" ? "en-US" : "vi-VN")
            .includes(q)),
    );
  }, [items, locale, product, query, status]);
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
  if (editing !== undefined)
    return (
      <SalesOwnerForm
        locale={locale}
        item={editing}
        products={products}
        pending={pending}
        onClose={() => setEditing(undefined)}
        onSave={(payload) =>
          mutate(
            () => saveSalesOwnerAction(locale, editing?.id ?? null, payload),
            editing
              ? "Đã cập nhật người phụ trách."
              : "Đã tạo người phụ trách.",
          )
        }
      />
    );
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
        icon={<FolderTree />}
        title="Người phụ trách kinh doanh"
        description="Quản lý người phụ trách kinh doanh sản phẩm."
        actions={
          capabilities.create ? (
            <CmsButton
              size="sm"
              variant="primary"
              leadingIcon={<Plus />}
              onClick={() => setEditing(null)}
            >
              Thêm người phụ trách
            </CmsButton>
          ) : undefined
        }
      />
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative w-full max-w-md flex-1">
            <span className="sr-only">Tìm người phụ trách</span>
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên nhân viên..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-base outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 sm:text-sm"
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-[auto_minmax(14rem,20rem)_auto]">
            <select
              aria-label="Lọc trạng thái"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as typeof status);
                setPage(1);
              }}
              className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang sử dụng</option>
              <option value="inactive">Ngừng sử dụng</option>
            </select>
            <select
              aria-label="Lọc theo sản phẩm"
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
                setPage(1);
              }}
              className="min-h-11 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">Tất cả sản phẩm</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.published ? "" : " (ngừng dùng)"}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!query && status === "all" && product === "all"}
              onClick={() => {
                setQuery("");
                setStatus("all");
                setProduct("all");
                setPage(1);
              }}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </button>
          </div>
        </div>
        <CmsBulkActionBar
          selectedCount={selected.length}
          itemLabel="người phụ trách"
          onClear={() => setSelected([])}
          actions={
            capabilities.edit
              ? [
                  {
                    label: "Ngừng sử dụng",
                    icon: Archive,
                    onClick: () =>
                      mutate(
                        () =>
                          bulkSetSalesOwnersPublishedAction(
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
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800">
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
                <th className="p-4">Tên nhân viên</th>
                <th className="p-4">Thứ tự</th>
                <th className="p-4">Số điện thoại / Skype / Zalo</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Ngày tạo / ID</th>
                <th className="w-28 p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageItems.map((i) => (
                <tr
                  key={i.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="p-4">
                    <CmsSelectionCheckbox
                      checked={selected.includes(i.id)}
                      onChange={() =>
                        setSelected((cur) =>
                          cur.includes(i.id)
                            ? cur.filter((id) => id !== i.id)
                            : [...cur, i.id],
                        )
                      }
                      aria-label={`Chọn ${i.name}`}
                    />
                  </td>
                  <td className="max-w-xs p-4">
                    <button
                      type="button"
                      disabled={!capabilities.edit}
                      onClick={() => setEditing(i)}
                      className="break-words text-left font-bold text-slate-950 hover:text-orange-600 disabled:pointer-events-none dark:text-white"
                    >
                      {i.name}
                    </button>
                    {i.orphanProductIds.length > 0 && (
                      <p className="mt-1 text-xs font-semibold text-amber-700">
                        {i.orphanProductIds.length} liên kết legacy cần đối soát
                      </p>
                    )}
                  </td>
                  <td className="p-4 font-semibold tabular-nums">
                    #{i.ordering}
                  </td>
                  <td className="p-4">
                    <p className="flex items-center gap-1 font-semibold text-orange-600">
                      <Phone className="h-4 w-4" />
                      {i.phone || "—"}
                    </p>
                    <p className="mt-1 break-words text-xs text-slate-500">
                      Skype: {i.skype || "—"} · Zalo: {i.zalo || "—"}
                    </p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${i.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {i.published ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    <div>
                      {i.createdTime
                        ? new Intl.DateTimeFormat(
                            locale === "en" ? "en-US" : "vi-VN",
                          ).format(new Date(i.createdTime))
                        : "—"}
                    </div>
                    <div className="mt-1 font-bold text-slate-700">
                      ID: {i.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      {capabilities.edit && (
                        <CmsIconButton
                          aria-label={`Sửa ${i.name}`}
                          onClick={() => setEditing(i)}
                        >
                          <Edit3 />
                        </CmsIconButton>
                      )}
                      {capabilities.delete && (
                        <CmsIconButton
                          variant="danger"
                          aria-label={`Xóa ${i.name}`}
                          onClick={() => setDeleting(i)}
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
                    colSpan={7}
                    className="p-12 text-center text-sm text-slate-500"
                  >
                    Không tìm thấy người phụ trách phù hợp.
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
          itemLabel="người phụ trách"
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </section>
      {deleting && (
        <DeleteDialog
          item={deleting}
          pending={pending}
          onClose={() => setDeleting(null)}
          onDeactivate={() =>
            mutate(
              () =>
                bulkSetSalesOwnersPublishedAction(locale, [deleting.id], false),
              "Đã ngừng sử dụng người phụ trách.",
            )
          }
          onTrash={() =>
            mutate(
              () => trashSalesOwnerAction(locale, deleting.id),
              "Đã chuyển người phụ trách vào Thùng rác.",
            )
          }
        />
      )}
    </div>
  );
}

function SalesOwnerForm({
  locale,
  item,
  products,
  pending,
  onClose,
  onSave,
}: {
  locale: SalesOwnerLocale;
  item: SalesOwnerItem | null;
  products: readonly SalesOwnerProductOption[];
  pending: boolean;
  onClose: () => void;
  onSave: (v: unknown) => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [alias, setAlias] = useState(item?.alias ?? "");
  const [phone, setPhone] = useState(item?.phone ?? "");
  const [skype, setSkype] = useState(item?.skype ?? "");
  const [zalo, setZalo] = useState(item?.zalo ?? "");
  const [ordering, setOrdering] = useState(item?.ordering ?? 1);
  const [published, setPublished] = useState(item?.published ?? true);
  const [a, setA] = useState<SalesOwnerAssignments>(
    item?.assignments ?? emptyAssignments(),
  );
  const [error, setError] = useState("");
  const generated = slugify(name);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolved = alias.trim() || generated;
    if (!name.trim() || !resolved) {
      setError("Vui lòng nhập tên nhân viên.");
      return;
    }
    onSave({
      name: name.trim(),
      alias: resolved,
      phone,
      skype,
      zalo,
      ordering,
      published,
      assignments: a,
    });
  };
  const update = (key: keyof SalesOwnerAssignments, ids: readonly string[]) =>
    setA((cur) => ({ ...cur, [key]: ids }));
  return (
    <div className="min-h-[calc(100dvh-var(--cms-header-height)-2rem)] animate-in fade-in duration-200">
      <div
        className="mx-auto flex min-h-[calc(100dvh-var(--cms-header-height)-2rem)] w-full flex-col"
      >
        <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur sm:p-4 dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex min-w-0 items-center gap-3">
            <CmsIconButton aria-label="Quay lại danh sách" onClick={onClose}>
              <X />
            </CmsIconButton>
            <div className="min-w-0">
              <h2
                id="sales-owner-form-title"
                className="break-words text-base font-black"
              >
                {item ? "Chỉnh sửa" : "Thêm"} người phụ trách
              </h2>
              <p className="text-xs font-bold text-orange-600">
                Thiết lập sản phẩm / Người phụ trách kinh doanh ·{" "}
                {locale.toUpperCase()}
              </p>
            </div>
          </div>
          <CmsButton
            form="salesOwnerForm"
            type="submit"
            variant="primary"
            leadingIcon={<Save />}
            disabled={pending}
          >
            {pending
              ? "Đang lưu..."
              : item
                ? "Lưu thay đổi"
                : "Thêm người phụ trách"}
          </CmsButton>
        </header>
        <form
          id="salesOwnerForm"
          onSubmit={submit}
          className="mx-auto w-full max-w-6xl flex-1 space-y-5 p-4 text-xs sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Tên nhân viên" required>
              <input
                autoFocus
                required
                maxLength={255}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!item) setAlias(slugify(e.target.value));
                }}
                placeholder="Nhập tên nhân viên"
                className={fieldClass}
              />
            </Field>
            <Field label="Tên hiệu (Tự động sinh)">
              <div className="flex gap-2">
                <input
                  maxLength={255}
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder={generated || "ten-hieu-tu-dong"}
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => setAlias(generated)}
                  className="min-h-11 shrink-0 rounded-xl px-3 font-bold text-orange-600 hover:bg-orange-50"
                >
                  Tạo tự động
                </button>
              </div>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kích hoạt">
              <select
                value={published ? "active" : "inactive"}
                onChange={(e) => setPublished(e.target.value === "active")}
                className={fieldClass}
              >
                <option value="active">Đang sử dụng</option>
                <option value="inactive">Ngừng sử dụng</option>
              </select>
            </Field>
            <Field label="Thứ tự">
              <input
                type="number"
                min={1}
                max={1000000}
                value={ordering}
                onChange={(e) => setOrdering(Number(e.target.value))}
                className={fieldClass}
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Số điện thoại">
              <input
                type="tel"
                maxLength={225}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0934 045 088"
                className={fieldClass}
              />
            </Field>
            <Field label="Skype">
              <input
                maxLength={255}
                value={skype}
                onChange={(e) => setSkype(e.target.value)}
                placeholder="Tên tài khoản Skype"
                className={fieldClass}
              />
            </Field>
            <Field label="Zalo">
              <input
                maxLength={255}
                value={zalo}
                onChange={(e) => setZalo(e.target.value)}
                placeholder="Số điện thoại hoặc tài khoản Zalo"
                className={fieldClass}
              />
            </Field>
          </div>
          {item && item.orphanProductIds.length > 0 && (
            <p
              role="status"
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800"
            >
              Đang bảo toàn {item.orphanProductIds.length} liên kết Product
              legacy chưa còn bản ghi. Chỉ bỏ khi người vận hành chủ động bỏ
              chọn trong đúng nhóm.
            </p>
          )}
          <div className="space-y-4 border-t border-slate-200 pt-5">
            <Assignment
              label="Liên hệ"
              ids={a.contact}
              products={products}
              onChange={(ids) => update("contact", ids)}
            />
            <Assignment
              label="Liên hệ kinh doanh"
              ids={a.sales}
              products={products}
              onChange={(ids) => update("sales", ids)}
            />
            <Assignment
              label="Liên hệ hỗ trợ kỹ thuật"
              ids={a.technical}
              products={products}
              onChange={(ids) => update("technical", ids)}
            />
            <Assignment
              label="Liên hệ kinh doanh Miền Bắc"
              ids={a.northSales}
              products={products}
              onChange={(ids) => update("northSales", ids)}
            />
            <Assignment
              label="Liên hệ kinh doanh Miền Nam"
              ids={a.southSales}
              products={products}
              onChange={(ids) => update("southSales", ids)}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
function Assignment({
  label,
  ids,
  products,
  onChange,
}: {
  label: string;
  ids: readonly string[];
  products: readonly SalesOwnerProductOption[];
  onChange: (ids: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const known = new Set(products.map((p) => p.id));
  const hidden = ids.filter((id) => !known.has(id));
  const normalizedQuery = q.trim().toLocaleLowerCase();
  const shown = [...products]
    .filter(
      (p) =>
        !normalizedQuery ||
        p.name.toLocaleLowerCase().includes(normalizedQuery) ||
        p.id.includes(normalizedQuery),
    )
    .sort(
      (left, right) =>
        Number(ids.includes(right.id)) - Number(ids.includes(left.id)) ||
        left.name.localeCompare(right.name, "vi"),
    );
  return (
    <details className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-3 font-bold">
        <span>{label}</span>
        <span className="rounded-full bg-orange-50 px-2 py-1 text-orange-700">
          {ids.length} sản phẩm
        </span>
      </summary>
      <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-700">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên hoặc ID sản phẩm..."
          className={fieldClass}
        />
        <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
          {shown.map((p) => {
            const checked = ids.includes(p.id);
            return (
              <label
                key={p.id}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-2 ${checked ? "bg-orange-50 dark:bg-orange-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    onChange(
                      e.target.checked
                        ? [...ids, p.id]
                        : ids.filter((id) => id !== p.id),
                    )
                  }
                  className="size-4 accent-orange-600"
                />
                <span className="min-w-0 flex-1 break-words text-sm">
                  {p.name}{" "}
                  <span className="text-xs text-slate-500">· ID {p.id}</span>
                  {p.published ? "" : " (ngừng dùng)"}
                </span>
                {checked && (
                  <span className="shrink-0 text-xs font-bold text-orange-700">
                    Đã chọn
                  </span>
                )}
              </label>
            );
          })}
          {!normalizedQuery &&
            hidden.map((id) => (
              <label
                key={`legacy-${id}`}
                className="flex min-h-11 items-center gap-3 rounded-lg bg-amber-50 px-2 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
              >
                <input
                  type="checkbox"
                  checked
                  onChange={() => onChange(ids.filter((value) => value !== id))}
                  className="size-4 accent-orange-600"
                />
                <span className="min-w-0 flex-1 break-words text-sm font-semibold">
                  ID {id} · Sản phẩm gốc đã bị xóa
                </span>
                <span className="shrink-0 text-xs font-bold">Legacy</span>
              </label>
            ))}
          {shown.length === 0 && (normalizedQuery || hidden.length === 0) && (
            <p className="py-5 text-center text-sm text-slate-500">
              Không tìm thấy sản phẩm.
            </p>
          )}
        </div>
        {hidden.length > 0 && (
          <p className="text-xs font-semibold text-amber-700">
            Các ID Product legacy không còn bản ghi được xếp cuối danh sách và
            vẫn được bảo toàn cho tới khi bạn chủ động bỏ chọn.
          </p>
        )}
      </div>
    </details>
  );
}
function DeleteDialog({
  item,
  pending,
  onClose,
  onDeactivate,
  onTrash,
}: {
  item: SalesOwnerItem;
  pending: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onTrash: () => void;
}) {
  const ref = useDialogA11y(true, onClose);
  const used = item.usageCount > 0;
  return (
    <div className="fixed inset-0 z-[75] grid place-items-center overflow-y-auto bg-slate-950/65 p-4">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sales-owner-delete-title"
        tabIndex={-1}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <header className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 id="sales-owner-delete-title" className="font-black">
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
            Đầu mối đang phụ trách <strong>{item.usageCount}</strong> sản phẩm
            khác nhau.
          </p>
          <button
            disabled={pending || !item.published}
            onClick={onDeactivate}
            className="min-h-11 w-full rounded-xl border border-amber-300 bg-amber-50 p-3 text-left font-bold text-amber-900 disabled:opacity-50"
          >
            Ngừng sử dụng — nên chọn
          </button>
          <button
            disabled={pending || used}
            onClick={onTrash}
            className="min-h-11 w-full rounded-xl border border-red-200 bg-red-50 p-3 text-left font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {used
              ? "Không thể xóa khi còn sản phẩm phụ thuộc"
              : "Chuyển vào Thùng rác"}
          </button>
        </div>
      </div>
    </div>
  );
}

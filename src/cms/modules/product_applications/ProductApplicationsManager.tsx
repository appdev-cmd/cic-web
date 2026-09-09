'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  AlertTriangle,
  Archive,
  Edit3,
  FolderTree,
  PauseCircle,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import type {
  ProductApplicationItem,
  ProductApplicationLocale,
  ProductApplicationModuleData,
} from '@/features/product-applications/types';
import {
  bulkSetProductApplicationsPublishedAction,
  saveProductApplicationAction,
  trashProductApplicationAction,
} from '@/features/product-applications/server/actions';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { useDialogA11y } from '../activity_logs_trash/useDialogA11y';

type ProductApplicationCapabilities = {
  create: boolean;
  edit: boolean;
  delete: boolean;
};

type Toast = {
  tone: 'success' | 'error';
  message: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function ProductApplicationsManager({
  data,
  locale,
  capabilities,
}: {
  data: ProductApplicationModuleData;
  locale: ProductApplicationLocale;
  capabilities: ProductApplicationCapabilities;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const items = data[locale];
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<ProductApplicationItem | null | undefined>();
  const [deletingItem, setDeletingItem] = useState<ProductApplicationItem | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale === 'en' ? 'en-US' : 'vi-VN');
    return items.filter((item) => {
      const matchesStatus =
        status === 'all' || (status === 'active' ? item.published : !item.published);
      const searchable = `${item.name} ${item.alias}`.toLocaleLowerCase(
        locale === 'en' ? 'en-US' : 'vi-VN',
      );
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [items, locale, query, status]);

  const pageItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);
  const pageIds = pageItems.map((item) => item.id);
  const isWholePageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const isPartOfPageSelected =
    !isWholePageSelected && pageIds.some((id) => selectedIds.includes(id));

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    if (page > lastPage) setPage(lastPage);
  }, [filteredItems.length, page, pageSize]);

  const runMutation = (job: () => Promise<unknown>, successMessage: string) => {
    startTransition(async () => {
      try {
        await job();
        setToast({ tone: 'success', message: successMessage });
        setSelectedIds([]);
        setEditingItem(undefined);
        setDeletingItem(null);
        router.refresh();
      } catch (error) {
        setToast({
          tone: 'error',
          message: error instanceof Error ? error.message : 'Không thể hoàn tất thao tác.',
        });
      }
    });
  };

  const toggleWholePage = () => {
    setSelectedIds((current) =>
      isWholePageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])],
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {toast && (
        <div
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={`fixed bottom-4 left-4 right-4 z-[80] rounded-xl px-4 py-3 text-xs font-bold text-white shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md ${
            toast.tone === 'error' ? 'bg-red-700' : 'bg-slate-900'
          }`}
        >
          {toast.message}
        </div>
      )}

      <CmsPageHeader
        icon={<FolderTree />}
        title="Lĩnh vực ứng dụng"
        description="Quản lý danh sách lĩnh vực ứng dụng."
        actions={
          capabilities.create ? (
            <CmsButton
              size="sm"
              variant="primary"
              leadingIcon={<Plus />}
              onClick={() => setEditingItem(null)}
            >
              Thêm lĩnh vực ứng dụng
            </CmsButton>
          ) : undefined
        }
      />

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative w-full max-w-md flex-1">
            <span className="sr-only">Tìm lĩnh vực ứng dụng</span>
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên hoặc tên hiệu..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-base outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 sm:text-xs"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Lọc trạng thái"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as typeof status);
                setPage(1);
              }}
              className="min-h-11 min-w-44 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang sử dụng</option>
              <option value="inactive">Ngừng sử dụng</option>
            </select>
            <button
              type="button"
              disabled={!query && status === 'all'}
              onClick={() => {
                setQuery('');
                setStatus('all');
                setPage(1);
              }}
              className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Đặt lại
            </button>
          </div>
        </div>

        <CmsBulkActionBar
          selectedCount={selectedIds.length}
          itemLabel="lĩnh vực"
          onClear={() => setSelectedIds([])}
          actions={
            capabilities.edit
              ? [
                  {
                    label: 'Ngừng sử dụng',
                    icon: Archive,
                    onClick: () =>
                      runMutation(
                        () => bulkSetProductApplicationsPublishedAction(locale, selectedIds, false),
                        `Đã ngừng sử dụng ${selectedIds.length} lĩnh vực.`,
                      ),
                  },
                ]
              : []
          }
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="cms-data-table min-w-[720px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800">
              <tr>
                <th className="sticky left-0 z-20 w-10 border-r border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800">
                  <CmsSelectionCheckbox
                    checked={isWholePageSelected}
                    indeterminate={isPartOfPageSelected}
                    onChange={toggleWholePage}
                    label="Chọn tất cả lĩnh vực trên trang"
                  />
                </th>
                <th className="sticky left-10 z-20 min-w-[280px] border-r border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800">
                  Tên và tên hiệu
                </th>
                <th className="min-w-28 p-3">Thứ tự</th>
                <th className="min-w-32 p-3">Trạng thái</th>
                <th className="sticky right-0 z-20 w-24 border-l border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pageItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                >
                  <td className="sticky left-0 z-10 border-r border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                    <CmsSelectionCheckbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() =>
                        setSelectedIds((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id],
                        )
                      }
                      label={`Chọn ${item.name}`}
                    />
                  </td>
                  <td className="sticky left-10 z-10 border-r border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                    <button
                      type="button"
                      disabled={!capabilities.edit}
                      onClick={() => setEditingItem(item)}
                      className="max-w-full text-left disabled:cursor-default"
                    >
                      <span className="block break-words font-bold text-slate-900 transition-colors hover:text-orange-600 dark:text-white">
                        {item.name}
                      </span>
                      <span className="block break-all font-mono text-[10px] font-bold text-slate-500">
                        {item.alias}
                      </span>
                    </button>
                  </td>
                  <td className="p-3 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    #{item.ordering}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        item.published
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {item.published ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="sticky right-0 z-10 border-l border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex justify-center gap-1">
                      {capabilities.edit && (
                        <CmsIconButton
                          size="sm"
                          icon={<Edit3 />}
                          onClick={() => setEditingItem(item)}
                          aria-label={`Chỉnh sửa ${item.name}`}
                          title="Chỉnh sửa"
                        />
                      )}
                      {capabilities.delete && (
                        <CmsIconButton
                          size="sm"
                          variant="danger"
                          icon={<Trash2 />}
                          onClick={() => setDeletingItem(item)}
                          aria-label={`Xóa hoặc ngừng sử dụng ${item.name}`}
                          title="Xóa / Ngừng sử dụng"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-xs italic text-slate-400">
                    Không tìm thấy lĩnh vực ứng dụng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <CmsPagination
          currentPage={page}
          pageSize={pageSize}
          totalCount={filteredItems.length}
          itemLabel="lĩnh vực"
          pageSizeOptions={[10, 20, 50, 100]}
          onPageChange={setPage}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPage(1);
          }}
        />
      </section>

      {editingItem !== undefined && (
        <ApplicationFormDrawer
          item={editingItem}
          locale={locale}
          pending={pending}
          onClose={() => setEditingItem(undefined)}
          onSave={(payload) =>
            runMutation(
              () => saveProductApplicationAction(locale, editingItem?.id ?? null, payload),
              editingItem ? 'Đã cập nhật lĩnh vực ứng dụng.' : 'Đã tạo lĩnh vực ứng dụng.',
            )
          }
        />
      )}

      {deletingItem && (
        <ApplicationDeleteDialog
          item={deletingItem}
          pending={pending}
          onClose={() => setDeletingItem(null)}
          onDeactivate={() =>
            runMutation(
              () => bulkSetProductApplicationsPublishedAction(locale, [deletingItem.id], false),
              `Đã ngừng sử dụng “${deletingItem.name}”.`,
            )
          }
          onTrash={() =>
            runMutation(
              () => trashProductApplicationAction(locale, deletingItem.id),
              `Đã chuyển “${deletingItem.name}” vào Thùng rác.`,
            )
          }
        />
      )}
    </div>
  );
}

function ApplicationFormDrawer({
  item,
  locale,
  pending,
  onClose,
  onSave,
}: {
  item: ProductApplicationItem | null;
  locale: ProductApplicationLocale;
  pending: boolean;
  onClose: () => void;
  onSave: (payload: unknown) => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [alias, setAlias] = useState(item?.alias ?? '');
  const [ordering, setOrdering] = useState(item?.ordering ?? 1);
  const [published, setPublished] = useState(item?.published ?? true);
  const dialogRef = useDialogA11y(true, onClose);
  const titleId = 'product-application-form-title';
  const fieldClass =
    'min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-xs';

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-slate-900/60 backdrop-blur-xs"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            name,
            alias,
            ordering,
            published,
          });
        }}
        className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right dark:border-slate-800 dark:bg-slate-900"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-orange-600 p-2.5 text-white shadow-md shadow-orange-600/20">
              <Plus className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-base font-black text-slate-900 dark:text-white">
                {item ? 'Chỉnh sửa' : 'Thêm'} lĩnh vực ứng dụng
              </h2>
              <p className="text-xs font-bold text-orange-600">
                Dùng trong phần thiết lập sản phẩm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="grid min-h-11 min-w-11 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 text-xs sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="sm:col-span-2">
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Tiêu đề dữ liệu <span className="text-red-500">*</span>
              </span>
              <input
                required
                maxLength={255}
                value={name}
                onChange={(event) => {
                  const nextName = event.target.value;
                  setName(nextName);
                  setAlias(slugify(nextName));
                }}
                placeholder="Ví dụ: Quản lý dự án và chi phí"
                className={fieldClass}
              />
            </label>
            <label>
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Tên hiệu <span className="font-normal text-slate-400">(Tự động sinh)</span>:
              </span>
              <input
                readOnly
                required
                value={alias}
                placeholder="ten-hieu-tu-dong"
                className={`${fieldClass} cursor-not-allowed bg-slate-100 font-mono text-slate-600 dark:text-slate-300`}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Trạng thái hoạt động
              </span>
              <select
                value={published ? 'active' : 'inactive'}
                onChange={(event) => setPublished(event.target.value === 'active')}
                className={`${fieldClass} cursor-pointer font-bold`}
              >
                <option value="active">Đang sử dụng</option>
                <option value="inactive">Ngừng sử dụng</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                Thứ tự ưu tiên
              </span>
              <input
                type="number"
                min={1}
                max={1_000_000}
                value={ordering}
                onChange={(event) => setOrdering(Number(event.target.value))}
                className={`${fieldClass} font-bold`}
              />
            </label>
          </div>

          {item && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="font-bold text-slate-900 dark:text-white">
                {item.usageCount} sản phẩm đang sử dụng
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Cập nhật:{' '}
                {item.updatedTime
                  ? new Date(item.updatedTime).toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')
                  : 'Chưa có dữ liệu'}
              </p>
            </div>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:justify-end">
          <CmsButton type="button" variant="secondary" onClick={onClose} disabled={pending}>
            Hủy bỏ
          </CmsButton>
          <CmsButton
            type="submit"
            variant="primary"
            leadingIcon={<Save />}
            disabled={pending || !name.trim() || !alias}
          >
            {pending ? 'Đang lưu...' : item ? 'Lưu thay đổi' : 'Thêm lĩnh vực ứng dụng'}
          </CmsButton>
        </footer>
      </form>

    </div>
  );
}

function ApplicationDeleteDialog({
  item,
  pending,
  onClose,
  onDeactivate,
  onTrash,
}: {
  item: ProductApplicationItem;
  pending: boolean;
  onClose: () => void;
  onDeactivate: () => void;
  onTrash: () => void;
}) {
  const dialogRef = useDialogA11y(true, onClose);
  const hasUsage = item.usageCount > 0;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="product-application-delete-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-200 bg-red-500/10 p-5 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-red-600 p-2.5 text-white shadow-md">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 id="product-application-delete-title" className="text-sm font-black text-slate-900 dark:text-white">
                Xác nhận thay đổi dữ liệu
              </h2>
              <p className="truncate text-xs font-bold text-red-600">Tên hiệu: {item.alias}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="grid min-h-11 min-w-11 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 space-y-4 overflow-y-auto p-5 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <span className="block text-[11px] text-slate-500">Mục đang xử lý:</span>
            <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
              {item.name}
            </div>
            {hasUsage && (
              <div className="mt-2 flex items-start gap-1.5 border-t border-slate-200 pt-2 font-bold text-amber-700 dark:border-slate-700 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Đang có {item.usageCount} sản phẩm phụ thuộc lĩnh vực này.</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-700 dark:text-slate-300">
              Vui lòng chọn phương án xử lý:
            </p>
            <button
              type="button"
              disabled={pending || !item.published}
              onClick={onDeactivate}
              className="flex w-full items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <span>
                <strong className="block font-bold text-amber-900 dark:text-amber-300">
                  1. Ngừng sử dụng — nên chọn
                </strong>
                <span className="mt-0.5 block text-[11px] text-amber-700 dark:text-amber-400">
                  Ẩn khỏi lựa chọn và dữ liệu public mới; các sản phẩm cũ vẫn giữ liên kết.
                </span>
              </span>
            </button>
            <button
              type="button"
              disabled={pending || hasUsage}
              onClick={onTrash}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                hasUsage
                  ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-800/40'
                  : 'border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20'
              }`}
            >
              <Trash2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <strong className="block font-bold">2. Chuyển vào Thùng rác</strong>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {hasUsage
                    ? 'Bị khóa vì lĩnh vực đang được dùng. Hãy đổi lĩnh vực của các sản phẩm trước.'
                    : 'Có thể phục hồi về trạng thái ngừng sử dụng từ module Thùng rác.'}
                </span>
              </span>
            </button>
          </div>
        </div>

        <footer className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <CmsButton type="button" variant="secondary" onClick={onClose} disabled={pending}>
            Hủy bỏ
          </CmsButton>
        </footer>
      </div>
    </div>
  );
}

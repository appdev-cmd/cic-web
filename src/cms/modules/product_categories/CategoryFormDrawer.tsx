import { Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { ProductCategoryItem, ProductCategoryLocale } from '@/features/product-categories/types';
import { CmsButton } from '../../components/ui/CmsButton';
import { useDialogA11y } from '../activity_logs_trash/useDialogA11y';

export type CategoryFormValues = {
  name: string;
  alias: string;
  description: string | null;
  parentId: number | null;
  ordering: number;
  published: boolean;
};

type CategoryFormDrawerProps = {
  item: ProductCategoryItem | null;
  items: readonly ProductCategoryItem[];
  locale: ProductCategoryLocale;
  pending: boolean;
  onClose: () => void;
  onSave: (values: CategoryFormValues) => void;
};

const fieldClassName = 'min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-orange-500 sm:text-xs dark:border-slate-700 dark:bg-slate-800';
const slugify = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export function CategoryFormDrawer({ item, items, locale, pending, onClose, onSave }: CategoryFormDrawerProps) {
  const [name, setName] = useState(item?.name ?? '');
  const [alias, setAlias] = useState(item?.alias ?? '');
  const [hasManualAlias, setHasManualAlias] = useState(Boolean(item));
  const [description, setDescription] = useState(item?.description ?? '');
  const [parentId, setParentId] = useState(item?.parentId ?? '');
  const [ordering, setOrdering] = useState(item?.ordering ?? 1);
  const [published, setPublished] = useState(item?.published ?? true);
  const dialogRef = useDialogA11y(true, onClose);
  const blockedParentIds = useMemo(() => {
    const blockedIds = new Set(item ? [item.id] : []);
    if (item) {
      const visitChildren = (categoryId: string) => {
        items
          .filter((candidate) => candidate.parentId === categoryId)
          .forEach((candidate) => {
            if (!blockedIds.has(candidate.id)) {
              blockedIds.add(candidate.id);
              visitChildren(candidate.id);
            }
          });
      };
      visitChildren(item.id);
    }
    return blockedIds;
  }, [item, items]);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            name,
            alias,
            description: description.trim() || null,
            parentId: parentId ? Number(parentId) : null,
            ordering,
            published,
          });
        }}
        className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl animate-in slide-in-from-right dark:bg-slate-900"
      >
        <header className="flex items-center justify-between border-b p-4 shadow-md">
          <div>
            <h2 id="drawer-title" className="text-base font-black">
              {item ? 'Chỉnh sửa' : 'Thêm'} danh mục sản phẩm
            </h2>
            <p className="text-xs font-bold text-orange-600">Dùng trong phần thiết lập sản phẩm</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="grid size-11 place-items-center rounded-lg hover:bg-slate-100">
            <X />
          </button>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto p-4 text-xs sm:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="sm:col-span-2">
              <b className="mb-1 block">Tiêu đề dữ liệu *</b>
              <input required maxLength={250} value={name} onChange={(event) => {
                setName(event.target.value);
                if (!hasManualAlias) setAlias(slugify(event.target.value));
              }} className={fieldClassName} />
            </label>
            <label>
              <b className="mb-1 block">Tên hiệu *</b>
              <input required value={alias} onChange={(event) => {
                setHasManualAlias(true);
                setAlias(slugify(event.target.value));
              }} className={fieldClassName} />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <b className="mb-1 block">Danh mục cha</b>
              <select value={parentId} onChange={(event) => setParentId(event.target.value)} className={fieldClassName}>
                <option value="">Không có danh mục cha</option>
                {items.filter((candidate) => !blockedParentIds.has(candidate.id)).map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                ))}
              </select>
            </label>
            <label>
              <b className="mb-1 block">Thứ tự ưu tiên</b>
              <input type="number" min={0} value={ordering} onChange={(event) => setOrdering(Number(event.target.value))} className={fieldClassName} />
            </label>
          </div>
          <label>
            <b className="mb-1 block">Trạng thái hoạt động</b>
            <select value={published ? 'active' : 'inactive'} onChange={(event) => setPublished(event.target.value === 'active')} className={fieldClassName}>
              <option value="active">Đang sử dụng</option>
              <option value="inactive">Ngừng sử dụng</option>
            </select>
          </label>
          <label>
            <b className="mb-1 block">Mô tả</b>
            <textarea rows={6} value={description} onChange={(event) => setDescription(event.target.value)} className={`${fieldClassName} py-3`} />
          </label>
          {item && (
            <p className="rounded-xl bg-slate-50 p-3">
              Cập nhật: {item.updatedTime ? new Date(item.updatedTime).toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN') : 'Chưa có dữ liệu'} · {item.usageCount} sản phẩm
            </p>
          )}
        </div>
        <footer className="flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end">
          <CmsButton type="button" variant="secondary" onClick={onClose}>Hủy</CmsButton>
          <CmsButton type="submit" variant="primary" leadingIcon={<Save />} disabled={pending}>
            {pending ? 'Đang lưu...' : item ? 'Lưu thay đổi' : 'Thêm danh mục sản phẩm'}
          </CmsButton>
        </footer>
      </form>
    </div>
  );
}

import { Edit3, Trash2 } from 'lucide-react';

import type { ProductCategoryItem } from '@/features/product-categories/types';
import { CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';

type CategoryTableProps = {
  categories: readonly ProductCategoryItem[];
  selectedIds: readonly string[];
  allVisibleSelected: boolean;
  hasVisibleSelection: boolean;
  canEdit: boolean;
  canDelete: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onToggleVisible: () => void;
  onToggleCategory: (categoryId: string) => void;
  onEdit: (category: ProductCategoryItem) => void;
  onDelete: (category: ProductCategoryItem) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function CategoryTable({
  categories,
  selectedIds,
  allVisibleSelected,
  hasVisibleSelection,
  canEdit,
  canDelete,
  page,
  pageSize,
  totalCount,
  onToggleVisible,
  onToggleCategory,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: CategoryTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="cms-data-table min-w-[720px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800">
            <tr>
              <th className="sticky left-0 z-20 w-10 bg-slate-50 p-3 dark:bg-slate-800">
                <CmsSelectionCheckbox
                  checked={allVisibleSelected}
                  indeterminate={!allVisibleSelected && hasVisibleSelection}
                  onChange={onToggleVisible}
                  label="Chọn trang này"
                />
              </th>
              <th className="sticky left-10 z-20 min-w-[280px] bg-slate-50 p-3 dark:bg-slate-800">Tên và mã nhận diện</th>
              <th className="p-3">Thứ tự</th>
              <th className="p-3">Trạng thái</th>
              <th className="sticky right-0 z-20 bg-slate-50 p-3 text-center dark:bg-slate-800">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="sticky left-0 bg-white p-3 dark:bg-slate-900">
                  <CmsSelectionCheckbox
                    checked={selectedIds.includes(category.id)}
                    onChange={() => onToggleCategory(category.id)}
                    label={`Chọn ${category.name}`}
                  />
                </td>
                <td className="sticky left-10 bg-white p-3 dark:bg-slate-900">
                  <button disabled={!canEdit} onClick={() => onEdit(category)} className="max-w-full text-left">
                    <b className="block break-words">{category.name}</b>
                    <span className="block break-all font-mono text-[10px] text-slate-500">
                      {category.code || category.alias}
                    </span>
                    {category.parentName && <small>Thuộc: {category.parentName}</small>}
                  </button>
                </td>
                <td className="p-3 font-mono text-xs font-bold">#{category.ordering}</td>
                <td className="p-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${category.published ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700' : 'border-amber-500/20 bg-amber-500/10 text-amber-700'}`}>
                    {category.published ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="sticky right-0 bg-white p-3 dark:bg-slate-900">
                  <div className="flex justify-center gap-1">
                    {canEdit && <CmsIconButton onClick={() => onEdit(category)} icon={<Edit3 />} size="sm" aria-label={`Chỉnh sửa ${category.name}`} />}
                    {' '}
                    {canDelete && <CmsIconButton onClick={() => onDelete(category)} icon={<Trash2 />} size="sm" variant="danger" aria-label={`Xóa ${category.name}`} />}
                  </div>
                </td>
              </tr>
            ))}
            {!categories.length && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-xs italic text-slate-400">
                  Không tìm thấy danh mục phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <CmsPagination
        currentPage={page}
        pageSize={pageSize}
        totalCount={totalCount}
        itemLabel="danh mục"
        pageSizeOptions={[10, 20, 50, 100]}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
}

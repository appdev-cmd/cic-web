import { Archive, RotateCcw, Search } from 'lucide-react';

import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import type { CategoryStatusFilter } from './useCategoryListState';

type CategoryToolbarProps = {
  query: string;
  status: CategoryStatusFilter;
  selectedCount: number;
  canEdit: boolean;
  onQueryChange: (query: string) => void;
  onStatusChange: (status: CategoryStatusFilter) => void;
  onReset: () => void;
  onClearSelection: () => void;
  onBulkDeactivate: () => void;
};

export function CategoryToolbar({
  query,
  status,
  selectedCount,
  canEdit,
  onQueryChange,
  onStatusChange,
  onReset,
  onClearSelection,
  onBulkDeactivate,
}: CategoryToolbarProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative flex max-w-md flex-1 items-center">
          <span className="sr-only">Tìm danh mục</span>
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm theo tên, mã hoặc mô tả..."
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-base outline-none focus:border-orange-500 sm:text-xs dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Lọc trạng thái"
            value={status}
            onChange={(event) => onStatusChange(event.target.value as CategoryStatusFilter)}
            className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang sử dụng</option>
            <option value="inactive">Ngừng sử dụng</option>
          </select>
          <button
            disabled={!query && status === 'all'}
            onClick={onReset}
            className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-slate-500 disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Đặt lại
          </button>
        </div>
      </div>
      <CmsBulkActionBar
        selectedCount={selectedCount}
        itemLabel="danh mục"
        onClear={onClearSelection}
        actions={canEdit ? [{ label: 'Ngừng sử dụng', icon: Archive, onClick: onBulkDeactivate }] : []}
      />
    </section>
  );
}

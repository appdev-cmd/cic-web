import React, { useEffect, useState } from 'react';
import { Clock, Eye, Lock, RotateCcw, Search, Trash2 } from 'lucide-react';
import type { TrashItemViewModel, TrashListPage, TrashListQuery } from '@/features/trash/types';
import { CmsDataGridFrame } from '@/shared/ui/cms/CmsDataGridFrame';
import { CmsIconButton } from '../../components/ui/CmsButton';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsTabs } from '../../components/ui/CmsTabs';

interface TrashTabProps {
  page: TrashListPage;
  query: TrashListQuery;
  isLoading: boolean;
  capabilities: { restore: boolean; purge: boolean };
  onQueryChange: (query: TrashListQuery) => void;
  onOpenItemDetail: (item: TrashItemViewModel) => void;
  onQuickRestore: (item: TrashItemViewModel) => void;
  onOpenPermanentDelete: (item: TrashItemViewModel) => void;
  onBulkRestore: (selectedIds: string[]) => void;
  onBulkDelete: (selectedIds: string[]) => void;
}

export const TrashTab: React.FC<TrashTabProps> = ({
  page, query, isLoading, capabilities, onQueryChange, onOpenItemDetail,
  onQuickRestore, onOpenPermanentDelete, onBulkRestore, onBulkDelete,
}) => {
  const [searchDraft, setSearchDraft] = useState(query.search);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchDraft !== query.search) {
        setSelectedItemIds([]);
        onQueryChange({ ...query, search: searchDraft, page: 1 });
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [onQueryChange, query, searchDraft]);

  const selectedOnPage = page.items.filter((item) => selectedItemIds.includes(item.id));
  const toggleSelectItem = (id: string) => setSelectedItemIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSelectAll = () => setSelectedItemIds(selectedOnPage.length === page.items.length ? [] : page.items.map((item) => item.id));

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-5 md:flex-row md:items-center">
        <div className="min-w-0">
          <h3 className="flex items-start gap-2 text-base font-bold text-slate-900 dark:text-white sm:items-center">
            <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500 sm:mt-0" />
            <span className="break-words">Thùng rác & Phục hồi Dữ liệu (Recycle Bin & Trash Manager)</span>
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500 dark:text-slate-400">
            Nội dung được giữ 30 ngày trước khi đủ điều kiện xóa vĩnh viễn. Mục đang Legal Hold luôn bị chặn purge ở phía máy chủ.
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
          <label className="relative block">
            <span className="sr-only">Tìm trong Thùng rác</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Tìm theo tên, ID, module hoặc người xóa..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 sm:text-sm"
            />
          </label>
          <label className="flex min-h-11 items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="shrink-0">Module</span>
            <select
              value={query.module}
              onChange={(event) => {
                setSelectedItemIds([]);
                onQueryChange({ ...query, module: event.target.value, page: 1 });
              }}
              className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-base font-medium text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:text-sm"
            >
              <option value="all">Tất cả module đã hỗ trợ</option>
              {page.moduleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
        <CmsTabs
          ariaLabel="Phân loại mục đã xóa trong Thùng rác"
          value={query.category}
          onChange={(category) => {
            setSelectedItemIds([]);
            onQueryChange({ ...query, category: category as TrashListQuery['category'], page: 1 });
          }}
          items={[
            { id: 'all', label: 'Tất cả mục đã xóa', count: query.category === 'all' ? page.total : undefined },
            { id: 'expiring_soon', label: 'Sắp hết hạn lưu giữ (< 7 ngày)', count: page.expiringSoonTotal, icon: Clock },
          ]}
        />
      </div>

      <CmsBulkActionBar
        selectedCount={selectedOnPage.length}
        itemLabel="mục đã xóa"
        onClear={() => setSelectedItemIds([])}
        actions={[
          ...(capabilities.restore ? [{ label: 'Phục hồi', icon: RotateCcw, variant: 'primary' as const, onClick: () => onBulkRestore(selectedOnPage.map((item) => item.id)) }] : []),
          ...(capabilities.purge && selectedOnPage.some((item) => item.supportsPurge) ? [{ label: 'Xóa vĩnh viễn mục hỗ trợ', icon: Trash2, variant: 'danger' as const, onClick: () => onBulkDelete(selectedOnPage.filter((item) => item.supportsPurge).map((item) => item.id)) }] : []),
        ]}
      />

      <div className="relative" aria-busy={isLoading}>
        {isLoading && <div className="pointer-events-none absolute inset-0 z-30 rounded-2xl bg-white/55 backdrop-blur-[1px] dark:bg-slate-950/45"><span className="sr-only">Đang tải dữ liệu</span></div>}
        <CmsDataGridFrame
          ariaLabel="Danh sách mục trong Thùng rác"
          refreshKey={`${query.page}:${query.pageSize}:${page.total}`}
          footer={<CmsPagination currentPage={query.page} pageSize={query.pageSize} totalCount={page.total} itemLabel="mục đã xóa" onPageChange={(next) => { setSelectedItemIds([]); onQueryChange({ ...query, page: next }); }} onPageSizeChange={(size) => { setSelectedItemIds([]); onQueryChange({ ...query, pageSize: size, page: 1 }); }} />}
        >
          <table className="cms-data-table min-w-[1040px] text-left">
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-slate-200 bg-slate-100/95 text-[11px] font-bold uppercase tracking-wider text-slate-500 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-800/95 dark:text-slate-400">
                <th className="w-12 bg-inherit px-4 py-3 text-center lg:sticky lg:left-0 lg:z-30">
                  <CmsSelectionCheckbox checked={page.items.length > 0 && selectedOnPage.length === page.items.length} indeterminate={selectedOnPage.length > 0 && selectedOnPage.length < page.items.length} onChange={toggleSelectAll} label="Chọn tất cả mục trên trang" />
                </th>
                <th className="min-w-64 bg-inherit px-4 py-3 lg:sticky lg:left-12 lg:z-30 lg:shadow-[6px_0_10px_-10px_rgba(15,23,42,0.5)]">Tên Đối tượng</th>
                <th className="px-4 py-3">Loại & Scope</th>
                <th className="px-4 py-3">Người xóa & Thời gian</th>
                <th className="px-4 py-3">Hạn lưu giữ</th>
                <th className="px-4 py-3">Kiểm tra Xung đột</th>
                <th className="min-w-40 bg-inherit px-4 py-3 text-right lg:sticky lg:right-0 lg:z-30 lg:shadow-[-6px_0_10px_-10px_rgba(15,23,42,0.5)]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {page.items.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">Thùng rác trống hoặc không tìm thấy mục phù hợp.</td></tr>
              ) : page.items.map((item) => {
                const selected = selectedItemIds.includes(item.id);
                const retentionClass = item.daysRemaining <= 7
                  ? 'border-amber-500/20 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                  : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
                return (
                  <tr key={item.id} className="group bg-white transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/40">
                    <td className="bg-inherit px-4 py-3.5 text-center lg:sticky lg:left-0 lg:z-10"><CmsSelectionCheckbox checked={selected} onChange={() => toggleSelectItem(item.id)} label={`Chọn mục ${item.title}`} /></td>
                    <td className="max-w-80 whitespace-normal bg-inherit px-4 py-3.5 lg:sticky lg:left-12 lg:z-10 lg:shadow-[6px_0_10px_-10px_rgba(15,23,42,0.5)]">
                      <div className="flex min-w-0 items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span className="break-words">{item.title}</span>
                        {item.isLegalHold && <span className="shrink-0 rounded border border-purple-500/20 bg-purple-500/10 p-1 text-purple-600" aria-label="Đang Legal Hold"><Lock className="h-3 w-3" /></span>}
                      </div>
                      <span className="block max-w-80 break-all whitespace-normal text-[10px] text-slate-400">Module: {item.moduleName} · ID: {item.entityId}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300"><div className="max-w-48 whitespace-normal break-words">{item.itemType}</div><span className="block max-w-48 whitespace-normal break-words text-[10px] font-bold text-orange-600 dark:text-orange-400">{item.scope.siteName}</span></td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300"><div className="max-w-48 whitespace-normal break-words">{item.deletedBy.name}</div><span className="text-[10px] text-slate-400">{item.deletedAt}</span></td>
                    <td className="px-4 py-3.5"><span className={`rounded-md border px-2.5 py-1 text-[10px] font-bold tabular-nums ${retentionClass}`}>{item.daysRemaining === 9999 ? 'Không tự động' : `Còn ${item.daysRemaining} ngày`}</span></td>
                    <td className="px-4 py-3.5"><span className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase ${item.dependencyStatus === 'clear' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>{item.dependencyStatus}</span></td>
                    <td className="bg-inherit px-4 py-3.5 text-right lg:sticky lg:right-0 lg:z-10 lg:shadow-[-6px_0_10px_-10px_rgba(15,23,42,0.5)]">
                      <div className="flex items-center justify-end gap-1.5">
                        <CmsIconButton onClick={() => onOpenItemDetail(item)} icon={<Eye />} size="sm" className="size-11 lg:size-8" aria-label="Xem chi tiết mục đã xóa" title="Xem chi tiết" />
                        {capabilities.restore && <CmsIconButton onClick={() => onQuickRestore(item)} icon={<RotateCcw />} size="sm" className="size-11 lg:size-8" aria-label="Khôi phục mục" title="Khôi phục" />}
                        {capabilities.purge && item.supportsPurge && <CmsIconButton onClick={() => onOpenPermanentDelete(item)} disabled={item.isLegalHold} icon={<Trash2 />} size="sm" className="size-11 lg:size-8" variant="danger" aria-label="Xóa vĩnh viễn" title="Xóa vĩnh viễn" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CmsDataGridFrame>
      </div>
    </div>
  );
};

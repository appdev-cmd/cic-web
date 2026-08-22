import React, { useMemo, useState } from 'react';
import {
  Trash2,
  RotateCcw,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Globe,
  FileText,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { TrashedItem, TrashCategory } from './types';
import { CmsIconButton } from '../../components/ui/CmsButton';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsTabs } from '../../components/ui/CmsTabs';

const CMS_TRASH_MODULES = [
  'Tin tức',
  'Danh mục tin tức',
  'Trang nội dung',
  'Sự kiện',
  'Dự án',
  'Sản phẩm',
  'Danh mục sản phẩm',
  'Hãng sản xuất',
  'Lĩnh vực ứng dụng',
  'Loại sản phẩm',
  'Người phụ trách kinh doanh',
  'Dịch vụ',
  'Menu',
  'Thư viện media',
  'CTA',
  'Biểu mẫu',
  'Yêu cầu khách hàng',
  'Mẫu email',
  'Người dùng',
  'Vai trò & quyền',
  'Cấu hình hệ thống',
  'Ngôn ngữ giao diện',
  'Cấu hình SEO chức năng',
] as const;

interface TrashTabProps {
  items: TrashedItem[];
  onOpenItemDetail: (item: TrashedItem) => void;
  onQuickRestore: (item: TrashedItem) => void;
  onOpenPermanentDelete: (item: TrashedItem) => void;
  onBulkRestore: (selectedIds: string[]) => void;
  onBulkDelete: (selectedIds: string[]) => void;
}

export const TrashTab: React.FC<TrashTabProps> = ({
  items,
  onOpenItemDetail,
  onQuickRestore,
  onOpenPermanentDelete,
  onBulkRestore,
  onBulkDelete,
}) => {
  const [activeCategory, setActiveCategory] = useState<TrashCategory>('all');
  const [activeModule, setActiveModule] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const moduleOptions = useMemo(
    () => Array.from(new Set([...CMS_TRASH_MODULES, ...items.map((item) => item.moduleName)])),
    [items]
  );

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeModule !== 'all' && item.moduleName !== activeModule) return false;
    if (activeCategory === 'expiring_soon' && item.daysRemaining > 7) {
      return false;
    }

    // Keyword match
    if (searchKeyword.trim() !== '') {
      const kw = searchKeyword.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(kw);
      const matchType = item.itemType.toLowerCase().includes(kw);
      const matchModule = item.moduleName.toLowerCase().includes(kw);
      const matchDeletedBy = item.deletedBy.name.toLowerCase().includes(kw);
      if (!matchTitle && !matchType && !matchModule && !matchDeletedBy) return false;
    }

    return true;
  });
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <span>Thùng rác & Phục hồi Dữ liệu (Recycle Bin & Trash Manager)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mọi đối tượng xóa mềm sẽ được tự động tiêu hủy vĩnh viễn sau 30 ngày trừ khi được giữu chân pháp lý (Legal Hold).
          </p>
        </div>
      </div>

      {/* SEARCH & CATEGORY TABS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative flex items-center text-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên, loại, module hoặc người xóa..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="shrink-0">Module</span>
            <select
              value={activeModule}
              onChange={(event) => setActiveModule(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">Tất cả module</option>
              {moduleOptions.map((moduleName) => (
                <option key={moduleName} value={moduleName}>{moduleName}</option>
              ))}
            </select>
          </label>
        </div>

        {/* SUB-TABS */}
        <CmsTabs
          ariaLabel="Phân loại mục đã xóa trong thùng rác"
          value={activeCategory}
          onChange={(cat) => setActiveCategory(cat as TrashCategory)}
          items={[
            { id: 'all', label: 'Tất cả mục đã xóa', count: activeModule === 'all' ? items.length : items.filter((item) => item.moduleName === activeModule).length },
            { id: 'expiring_soon', label: 'Sắp hết hạn lưu giữ (< 7 ngày)', count: items.filter((i) => i.daysRemaining <= 7).length, icon: Clock },
          ]}
        />
      </div>

      {/* BULK SELECTION BAR */}
      <CmsBulkActionBar selectedCount={selectedItemIds.length} itemLabel="mục đã xóa" onClear={() => setSelectedItemIds([])} actions={[
        { label: 'Phục hồi', icon: RotateCcw, variant: 'primary', onClick: () => {
                onBulkRestore(selectedItemIds);
                setSelectedItemIds([]);
              } },
        { label: 'Xóa vĩnh viễn', icon: Trash2, variant: 'danger', onClick: () => {
                onBulkDelete(selectedItemIds);
                setSelectedItemIds([]);
              } },
      ]} />

      {/* ITEMS DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 w-10 text-center">
                  <CmsSelectionCheckbox
                    checked={selectedItemIds.length === filteredItems.length && filteredItems.length > 0}
                    indeterminate={selectedItemIds.length > 0 && selectedItemIds.length < filteredItems.length}
                    onChange={toggleSelectAll}
                    label="Chọn tất cả mục trong thùng rác"
                  />
                </th>
                <th className="py-3 px-4">Tên Đối tượng</th>
                <th className="py-3 px-4">Loại & Scope</th>
                <th className="py-3 px-4">Người xóa & Thời gian</th>
                <th className="py-3 px-4">Hạn lưu giữ</th>
                <th className="py-3 px-4">Kiểm tra Xung đột</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Thùng rác trống hoặc không tìm thấy mục đã xóa phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center">
                        <CmsSelectionCheckbox
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          label={`Chọn mục ${item.title}`}
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.isLegalHold && (
                            <span
                              className="p-1 rounded bg-purple-500/10 text-purple-600 border border-purple-500/20"
                              title="Legal Hold: Khóa tiêu hủy vĩnh viễn"
                            >
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Module: {item.moduleName}</span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        <div>{item.itemType}</div>
                        <span className="font-bold text-orange-600 dark:text-orange-400 text-[10px]">
                          {item.scope.siteName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <div>{item.deletedBy.name}</div>
                        <span className="font-mono text-[10px] text-slate-400">{item.deletedAt}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold ${
                            item.daysRemaining <= 7
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Còn {item.daysRemaining} ngày
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            item.dependencyStatus === 'clear'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}
                        >
                          {item.dependencyStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <CmsIconButton
                            onClick={() => onOpenItemDetail(item)}
                            icon={<Eye />}
                            size="sm"
                            aria-label="Xem chi tiết mục đã xóa"
                            title="Xem chi tiết mục đã xóa"
                          />

                          <CmsIconButton
                            onClick={() => onQuickRestore(item)}
                            icon={<RotateCcw />}
                            size="sm"
                            aria-label="Khôi phục mục"
                            title="Khôi phục mục"
                          />

                          <CmsIconButton
                            onClick={() => onOpenPermanentDelete(item)}
                            disabled={item.isLegalHold}
                            icon={<Trash2 />}
                            size="sm"
                            variant="danger"
                            aria-label="Xóa vĩnh viễn"
                            title="Xóa vĩnh viễn"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredItems.length} itemLabel="mục đã xóa" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Filter items
  const filteredItems = items.filter((item) => {
    // Category match
    if (activeCategory === 'content' && !['Bài viết Tin tức', 'Trang tĩnh'].includes(item.itemType)) {
      return false;
    }
    if (activeCategory === 'media' && !['Media Banner', 'Hình ảnh'].includes(item.itemType)) {
      return false;
    }
    if (activeCategory === 'config_resources' && !['Tài nguyên Quản trị', 'Cấu hình'].includes(item.itemType)) {
      return false;
    }
    if (activeCategory === 'expiring_soon' && item.daysRemaining > 7) {
      return false;
    }

    // Keyword match
    if (searchKeyword.trim() !== '') {
      const kw = searchKeyword.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(kw);
      const matchType = item.itemType.toLowerCase().includes(kw);
      const matchDeletedBy = item.deletedBy.name.toLowerCase().includes(kw);
      if (!matchTitle && !matchType && !matchDeletedBy) return false;
    }

    return true;
  });

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
        <div className="relative text-xs">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo Tên đối tượng xóa, Người xóa hoặc Loại tài nguyên..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Tất cả mục đã xóa ({items.length})
          </button>

          <button
            onClick={() => setActiveCategory('content')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              activeCategory === 'content'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Nội dung (Bài viết / Trang)
          </button>

          <button
            onClick={() => setActiveCategory('media')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              activeCategory === 'media'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Media & Banners
          </button>

          <button
            onClick={() => setActiveCategory('config_resources')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              activeCategory === 'config_resources'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Cấu hình & Quản trị
          </button>

          <button
            onClick={() => setActiveCategory('expiring_soon')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeCategory === 'expiring_soon'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-amber-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Sắp hết hạn lưu giữ (&lt; 7 ngày) ({items.filter((i) => i.daysRemaining <= 7).length})</span>
          </button>
        </div>
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
                filteredItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-orange-500/5' : ''
                      }`}
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
      </div>
    </div>
  );
};

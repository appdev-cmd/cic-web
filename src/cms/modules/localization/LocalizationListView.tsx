import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  UserCheck,
  Check,
  X,
  RotateCcw,
  MoreVertical,
  HelpCircle,
  Code,
  ShieldAlert,
} from 'lucide-react';
import { TranslationItem, TranslationStatus } from './types';
import { validatePlaceholders } from './utils';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';

interface LocalizationListViewProps {
  items: TranslationItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onSelectItem: (item: TranslationItem) => void;
  onQuickSaveTarget: (id: string, newTarget: string) => void;
  onOpenSourceDiff: (item: TranslationItem) => void;
  onBulkAssign: () => void;
  onBulkStatus: (status: TranslationStatus) => void;
  onClearSelection: () => void;
  currentUserId: string;
}

export const LocalizationListView: React.FC<LocalizationListViewProps> = ({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onSelectItem,
  onQuickSaveTarget,
  onOpenSourceDiff,
  onBulkAssign,
  onBulkStatus,
  onClearSelection,
  currentUserId,
}) => {
  // Density mode state
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');

  // Quick inline editing state for short strings
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const startInlineEdit = (item: TranslationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditingValue(item.target_text);
  };

  const handleSaveInline = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    onQuickSaveTarget(id, editingValue);
    setEditingId(null);
  };

  const getStatusBadge = (status: TranslationStatus) => {
    switch (status) {
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            Còn thiếu
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-500" />
            Đang dịch
          </span>
        );
      case 'review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
            <UserCheck className="w-3 h-3 text-sky-500" />
            Chờ review
          </span>
        );
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Hoàn thành
          </span>
        );
      case 'outdated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 dark:border-orange-800 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            Outdated (Nguồn đổi)
          </span>
        );
      default:
        return null;
    }
  };

  const getScopeBadge = (scope: string) => {
    switch (scope) {
      case 'frontend':
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded">
            Frontend UI
          </span>
        );
      case 'backend':
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded">
            Backend API
          </span>
        );
      case 'content_module':
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded">
            Content CMS
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* BULK SELECTION ACTION TOOLBAR */}
      <CmsBulkActionBar selectedCount={selectedIds.length} itemLabel="nội dung dịch" onClear={onClearSelection} actions={[
        { label: 'Phân công', onClick: onBulkAssign, icon: UserCheck, variant: 'primary' },
        { label: 'Chờ duyệt', onClick: () => onBulkStatus('review'), icon: Clock },
        { label: 'Hoàn thành', onClick: () => onBulkStatus('complete'), icon: CheckCircle2 },
      ]} />

      {/* DENSITY & PAGINATION TOP BAR */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Hiển thị <span className="font-bold text-slate-800 dark:text-slate-200">{paginatedItems.length}</span> trên tổng số <span className="font-bold text-slate-800 dark:text-slate-200">{items.length}</span> chuỗi/nội dung
        </div>
          <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setDensity('comfortable')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                density === 'comfortable' ? 'bg-orange-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Vừa vặn
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                density === 'compact' ? 'bg-orange-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Nén gọn
            </button>
          </div>

          </div>
      </div>

      {/* FULL-WIDTH DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="p-3.5 w-10 text-center sticky left-0 bg-slate-50 dark:bg-slate-800 z-10">
                  <CmsSelectionCheckbox
                    checked={paginatedItems.length > 0 && selectedIds.length === paginatedItems.length}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedItems.length}
                    onChange={onToggleSelectAll}
                    label="Chọn tất cả nội dung dịch trên trang"
                  />
                </th>
                <th className="p-3.5 min-w-[200px] sticky left-10 bg-slate-50 dark:bg-slate-800 z-10 border-r border-slate-200/60 dark:border-slate-800/60">
                  Key / Tiêu đề nghiệp vụ
                </th>
                <th className="p-3.5 min-w-[260px]">Bản nguồn (Nguồn VI)</th>
                <th className="p-3.5 min-w-[280px]">Bản dịch đích (Target EN)</th>
                <th className="p-3.5 w-24">Cặp locale</th>
                <th className="p-3.5 w-32">Trạng thái</th>
                <th className="p-3.5 w-36">Phụ trách / Duyệt</th>
                <th className="p-3.5 w-32">Cập nhật</th>
                <th className="p-3.5 w-28 text-right sticky right-0 bg-slate-50 dark:bg-slate-800 z-10 shadow-xs">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const { hasIssue, validations } = validatePlaceholders(item.source_text, item.target_text, item.placeholders);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={`hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-colors cursor-pointer ${
                        isSelected ? 'bg-orange-50/60 dark:bg-orange-950/30' : ''
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td
                        className={`p-3 text-center sticky left-0 bg-white dark:bg-slate-900 z-10 ${
                          density === 'compact' ? 'py-2' : 'py-3'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CmsSelectionCheckbox
                          checked={isSelected}
                          onChange={() => onToggleSelectOne(item.id)}
                          label={`Chọn nội dung ${item.key}`}
                        />
                      </td>

                      {/* Key & Path (Sticky left) */}
                      <td
                        className={`p-3 sticky left-10 bg-white dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800 ${
                          density === 'compact' ? 'py-2' : 'py-3'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-[11px] hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1.5">
                            <span className="truncate max-w-[180px]" title={item.key}>
                              {item.key}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {getScopeBadge(item.scope)}
                            <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {item.module_name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Source Text (VI) */}
                      <td className={`p-3 ${density === 'compact' ? 'py-2' : 'py-3'}`}>
                        <div className="space-y-1">
                          <p className="text-slate-800 dark:text-slate-200 line-clamp-2 text-xs leading-relaxed font-normal">
                            {item.source_text}
                          </p>
                          {item.placeholders && item.placeholders.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap text-[10px] text-slate-400 font-mono">
                              <span>Token:</span>
                              {item.placeholders.map((p) => (
                                <span key={p} className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-orange-600 dark:text-orange-400">
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Target Text (EN) + Quick Edit & Issue Markers */}
                      <td
                        className={`p-3 ${density === 'compact' ? 'py-2' : 'py-3'}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {editingId === item.id ? (
                          <form onSubmit={(e) => handleSaveInline(item.id, e)} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              autoFocus
                              className="w-full text-xs p-1.5 border border-orange-500 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                            />
                            <button
                              type="submit"
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                              title="Lưu nhanh"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                              title="Hủy"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        ) : (
                          <div className="space-y-1.5 group/edit relative">
                            {item.target_text ? (
                              <p className="text-slate-900 dark:text-slate-100 line-clamp-2 text-xs leading-relaxed font-medium">
                                {item.target_text}
                              </p>
                            ) : (
                              <span className="text-rose-500 italic text-[11px] font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Chưa dịch (Empty string)
                              </span>
                            )}

                            {/* Issue Markers */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {hasIssue && (
                                <span
                                  className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded border border-rose-300 flex items-center gap-1"
                                  title="Thiếu placeholder token trong bản dịch tiếng Anh"
                                >
                                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                                  Thiếu Token
                                </span>
                              )}

                              {item.status === 'outdated' && (
                                <button
                                  type="button"
                                  onClick={() => onOpenSourceDiff(item)}
                                  className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded border border-amber-300 hover:bg-amber-200 flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Xem Diff Nguồn</span>
                                </button>
                              )}
                            </div>

                            {/* Quick Edit Icon on Hover for short strings */}
                            {item.item_type === 'ui_string' && (
                              <button
                                type="button"
                                onClick={(e) => startInlineEdit(item, e)}
                                className="opacity-0 group-hover/edit:opacity-100 text-[10px] text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1 transition-opacity pt-0.5 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                Sửa nhanh
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Locale Pair */}
                      <td className={`p-3 text-[11px] font-mono text-slate-500 ${density === 'compact' ? 'py-2' : 'py-3'}`}>
                        VI → EN
                      </td>

                      {/* Status Badge */}
                      <td className={`p-3 ${density === 'compact' ? 'py-2' : 'py-3'}`}>
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Assignee & Reviewer Avatars */}
                      <td className={`p-3 ${density === 'compact' ? 'py-2' : 'py-3'}`}>
                        <div className="flex items-center gap-2">
                          {item.assignee_avatar ? (
                            <img
                              src={item.assignee_avatar}
                              alt={item.assignee_name}
                              className="w-6 h-6 rounded-full object-cover border border-slate-300"
                              title={`Translator: ${item.assignee_name}`}
                            />
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                              ?
                            </span>
                          )}
                          <div className="truncate text-[11px]">
                            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[90px]">
                              {item.assignee_name || 'Chưa gán'}
                            </div>
                            {item.reviewer_name && (
                              <div className="text-[9px] text-slate-400 truncate max-w-[90px]">
                                Rev: {item.reviewer_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Updated date */}
                      <td className={`p-3 text-[10px] text-slate-400 font-mono ${density === 'compact' ? 'py-2' : 'py-3'}`}>
                        <div>{item.updated_at.substring(0, 10)}</div>
                        <div className="text-[9px] text-slate-400">{item.updated_at.substring(11, 16)}</div>
                      </td>

                      {/* Action buttons (Sticky Right) */}
                      <td
                        className={`p-3 text-right sticky right-0 bg-white dark:bg-slate-900 z-10 shadow-xs ${
                          density === 'compact' ? 'py-2' : 'py-3'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onSelectItem(item)}
                          className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-[11px] shadow-2xs transition-all flex items-center justify-end gap-1 ml-auto cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Dịch / Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400 space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold">Không tìm thấy chuỗi hoặc nội dung phù hợp với bộ lọc.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={items.length} itemLabel="nội dung dịch" pageSizeOptions={[25, 50, 100]} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
      </div>
    </div>
  );
};

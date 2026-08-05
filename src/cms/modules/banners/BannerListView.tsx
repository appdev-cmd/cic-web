import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sliders,
  Edit,
  Copy,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  MoreHorizontal,
  Globe,
  Layers,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { BannerContent, SavedFilterView, WorkflowStatus, EffectiveStatus, slideshowPurposeOptions } from './types';
import { CmsIconButton } from '../../components/ui/CmsButton';

interface BannerListViewProps {
  items: BannerContent[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (item: BannerContent) => void;
  onPreview: (item: BannerContent) => void;
  onDuplicate: (item: BannerContent) => void;
  onDelete: (id: string) => void;
  onQuickToggleStatus: (item: BannerContent) => void;
  savedView: SavedFilterView;
  onSelectSavedView: (view: SavedFilterView) => void;
}

export const BannerListView: React.FC<BannerListViewProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onQuickToggleStatus,
  savedView,
  onSelectSavedView,
}) => {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const renderWorkflowBadge = (status: WorkflowStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
          </span>
        );
      case 'approved':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Approved
          </span>
        );
      case 'pending_review':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3 text-purple-600" /> Pending Review
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1 w-fit">
            <Edit className="w-3 h-3 text-slate-500" /> Draft
          </span>
        );
      case 'archived':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1 w-fit">
            <Trash2 className="w-3 h-3 text-amber-600" /> Archived
          </span>
        );
    }
  };

  const renderEffectiveBadge = (status: EffectiveStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500 text-white flex items-center gap-1 shadow-2xs w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> Đang chạy
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-500 text-white flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Sắp chạy
          </span>
        );
      case 'ended':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 w-fit">
            Đã kết thúc
          </span>
        );
      case 'conflict':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500 text-white flex items-center gap-1 shadow-2xs animate-pulse w-fit">
            <AlertTriangle className="w-3 h-3" /> Xung đột lịch
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Saved Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Saved Views:
        </span>
        {[
          { id: 'all', label: 'Tất cả nội dung' },
          { id: 'running', label: 'Đang chạy (Live)' },
          { id: 'upcoming', label: 'Sắp chạy' },
          { id: 'pending', label: 'Chờ duyệt' },
          { id: 'conflicts', label: 'Có xung đột' },
          { id: 'ended', label: 'Đã kết thúc' },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => onSelectSavedView(view.id as SavedFilterView)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              savedView === view.id
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <th className="p-3 w-10 text-center sticky left-0 bg-slate-50 dark:bg-slate-800">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500"
                />
              </th>
              <th className="p-3 min-w-[280px]">Nội dung & Loại</th>
              <th className="p-3 min-w-[180px]">Vị trí hiển thị</th>
              <th className="p-3 min-w-[140px]">Thời gian hiệu lực</th>
              <th className="p-3 min-w-[140px]">Trạng thái lịch</th>
              <th className="p-3 min-w-[130px]">Quy trình duyệt</th>
              <th className="p-3 min-w-[90px] text-center">Ưu tiên</th>
              <th className="p-3 min-w-[140px]">Cập nhật</th>
              <th className="p-3 w-28 text-right sticky right-0 bg-slate-50 dark:bg-slate-800">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <p className="font-semibold">Không tìm thấy banner hoặc slideshow phù hợp.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                      isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center sticky left-0 bg-white dark:bg-slate-900">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(item.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-orange-600 focus:ring-orange-500"
                      />
                    </td>

                    {/* Content & Type */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 group">
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          {item.type === 'slideshow' && (
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 text-[9px] font-extrabold rounded bg-slate-900/80 text-white flex items-center gap-0.5">
                              <Sliders className="w-2.5 h-2.5" /> {item.slides.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                                item.type === 'slideshow'
                                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              }`}
                            >
                              {item.type === 'slideshow' ? 'Trình chiếu' : 'Nội dung đơn'}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                              {slideshowPurposeOptions.find((option) => option.value === item.purpose)?.label || 'Chưa chọn mục đích'}
                            </span>
                            {item.has_draft_changes && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                                Draft v{item.draft_version}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-xs hover:text-orange-600 cursor-pointer" onClick={() => onEdit(item)}>
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                            Mã: <code className="font-mono">{item.alias}</code>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Placement */}
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {item.placement_name}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {item.site_id}
                        </span>
                      </div>
                    </td>

                    {/* Effective Time */}
                    <td className="p-3">
                      <div className="space-y-0.5 text-[11px] font-mono">
                        <div className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {item.start_time}
                        </div>
                        <div className="text-slate-400 dark:text-slate-500">Đến: {item.end_time}</div>
                      </div>
                    </td>

                    {/* Effective Status */}
                    <td className="p-3">{renderEffectiveBadge(item.effective_status)}</td>

                    {/* Workflow Status */}
                    <td className="p-3">{renderWorkflowBadge(item.workflow_status)}</td>

                    {/* Priority Order */}
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 font-mono font-bold text-xs rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        #{item.display_order} (W:{item.priority_weight})
                      </span>
                    </td>

                    {/* Updated */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.owner_avatar}
                          alt={item.owner_name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <span className="text-[11px] font-medium block truncate max-w-[100px]">
                            {item.owner_name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{item.updated_at.slice(5, 16)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right sticky right-0 bg-white dark:bg-slate-900">
                      <div className="flex items-center justify-end gap-1">
                        <CmsIconButton
                          onClick={() => onPreview(item)}
                          icon={<Eye />}
                          size="sm"
                          aria-label="Xem trước banner"
                          title="Xem trước"
                        />

                        <CmsIconButton
                          onClick={() => onEdit(item)}
                          icon={<Edit />}
                          size="sm"
                          aria-label="Chỉnh sửa banner"
                          title="Chỉnh sửa"
                        />

                        <CmsIconButton
                          onClick={() => onDuplicate(item)}
                          icon={<Copy />}
                          size="sm"
                          aria-label="Nhân bản banner"
                          title="Nhân bản"
                        />

                        <CmsIconButton
                          onClick={() => onDelete(item.id)}
                          icon={<Trash2 />}
                          size="sm"
                          variant="danger"
                          aria-label="Xóa banner"
                          title="Xóa vào thùng rác"
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
  );
};

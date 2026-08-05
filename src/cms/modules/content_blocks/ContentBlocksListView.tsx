import React from 'react';
import {
  Eye,
  Edit3,
  Copy,
  Trash2,
  FolderTree,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
  FileCode,
  Image as ImageIcon,
  Sliders,
  AlertCircle,
  Check,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { BlockItem, BlockType } from './types';
import { CmsIconButton } from '../../components/ui/CmsButton';

interface ContentBlocksListViewProps {
  blocks: BlockItem[];
  selectedBlockIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectBlock: (id: string) => void;
  onEditBlock: (block: BlockItem) => void;
  onOpenPreview: (block: BlockItem) => void;
  onOpenUsedBy: (block: BlockItem) => void;
  onDuplicateBlock: (block: BlockItem) => void;
  onDeleteBlock: (id: string) => void;
  onQuickStatusToggle: (id: string, currentStatus: string) => void;
}

export const ContentBlocksListView: React.FC<ContentBlocksListViewProps> = ({
  blocks,
  selectedBlockIds,
  onToggleSelectAll,
  onToggleSelectBlock,
  onEditBlock,
  onOpenPreview,
  onOpenUsedBy,
  onDuplicateBlock,
  onDeleteBlock,
  onQuickStatusToggle,
}) => {
  const isAllSelected = blocks.length > 0 && selectedBlockIds.length === blocks.length;

  const typeIcons: Record<BlockType, { icon: any; label: string; bg: string }> = {
    hero_cta: { icon: Sparkles, label: 'Hero CTA', bg: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
    announcement_bar: { icon: Sparkles, label: 'Announcement', bg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
    feature_grid: { icon: Layers, label: 'Feature Grid', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    highlight_banner: { icon: ImageIcon, label: 'Banner Highlight', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    testimonial_slider: { icon: Sliders, label: 'Testimonial', bg: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' },
    faq_accordion: { icon: HelpCircle, label: 'FAQ Accordion', bg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
    rich_text: { icon: FileCode, label: 'Rich Text', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    module_embed: { icon: FileCode, label: 'Module Embed', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-850 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 select-none">
              <th className="py-3 px-4 w-10 sticky left-0 bg-slate-50/90 dark:bg-slate-850 z-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 min-w-[260px]">Tên Khối & Loại Hiển Thị</th>
              <th className="py-3 px-4 min-w-[200px]">Vị Trí Cấu Hình (Placement)</th>
              <th className="py-3 px-4 min-w-[160px]">Phạm Vi Sử Dụng (Scope)</th>
              <th className="py-3 px-4 min-w-[130px]">Trạng Thái (Workflow)</th>
              <th className="py-3 px-4 min-w-[100px] text-center">Thứ Tự / Ưu Tiên</th>
              <th className="py-3 px-4 min-w-[150px]">Người Quản Lý</th>
              <th className="py-3 px-4 w-28 text-right sticky right-0 bg-slate-50/90 dark:bg-slate-850 z-10">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {blocks.map((b) => {
              const isSelected = selectedBlockIds.includes(b.id);
              const typeMeta = typeIcons[b.type] || typeIcons.hero_cta;
              const TypeIconComp = typeMeta.icon;

              return (
                <tr
                  key={b.id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                    isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                  }`}
                >
                  {/* Sticky Checkbox */}
                  <td className="py-3.5 px-4 sticky left-0 bg-white dark:bg-slate-900 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectBlock(b.id)}
                      className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Title & Type */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${typeMeta.bg}`}>
                        <TypeIconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onEditBlock(b)}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 text-left line-clamp-1 transition-colors"
                        >
                          {b.title}
                        </button>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[11px] text-slate-400">{b.code_alias}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {typeMeta.label}
                          </span>
                          {b.has_draft_changes && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 px-1.5 py-0.2 rounded">
                              Draft v{b.draft_version}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Placement Zone */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {b.placement_name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        {b.placement_id || 'CHƯA GÁN VỊ TRÍ'}
                      </span>
                    </div>
                  </td>

                  {/* Scope & Used-by trigger */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onOpenUsedBy(b)}
                      className="group flex items-center gap-1.5 hover:text-orange-600 transition-colors text-left"
                    >
                      <FolderTree className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500" />
                      <div>
                        <span className="font-semibold block text-slate-900 dark:text-white">
                          {b.scope.apply_all_pages ? 'Toàn bộ website' : `${b.used_by_count} trang chọn`}
                        </span>
                        <span className="text-[10px] text-orange-600 dark:text-orange-400 underline">
                          Xem danh sách used-by →
                        </span>
                      </div>
                    </button>
                  </td>

                  {/* Workflow Status */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onQuickStatusToggle(b.id, b.workflow_status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        b.workflow_status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                          : b.workflow_status === 'pending_review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span className="capitalize">{b.workflow_status.replace('_', ' ')}</span>
                    </button>
                  </td>

                  {/* Order & Priority */}
                  <td className="py-3.5 px-4 text-center font-mono font-medium">
                    <div className="text-xs text-slate-800 dark:text-slate-200">
                      #{b.display_order}
                    </div>
                    <span className="text-[10px] text-slate-400">Weight: {b.priority_weight}</span>
                  </td>

                  {/* Owner */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={b.owner_avatar}
                        alt={b.owner_name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                        {b.owner_name}
                      </span>
                    </div>
                  </td>

                  {/* Actions column */}
                  <td className="py-3.5 px-4 text-right sticky right-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center justify-end gap-1">
                      <CmsIconButton
                        onClick={() => onOpenPreview(b)}
                        icon={<Eye />}
                        size="sm"
                        aria-label="Xem trước khối nội dung"
                        title="Xem Context Preview Live"
                      />
                      <CmsIconButton
                        onClick={() => onEditBlock(b)}
                        icon={<Edit3 />}
                        size="sm"
                        aria-label="Chỉnh sửa khối nội dung"
                        title="Chỉnh sửa chi tiết"
                      />
                      <CmsIconButton
                        onClick={() => onDuplicateBlock(b)}
                        icon={<Copy />}
                        size="sm"
                        aria-label="Nhân bản khối nội dung"
                        title="Nhân bản khối"
                      />
                      <CmsIconButton
                        onClick={() => onDeleteBlock(b.id)}
                        icon={<Trash2 />}
                        size="sm"
                        variant="danger"
                        aria-label="Chuyển khối nội dung vào thùng rác"
                        title="Chuyển vào thùng rác"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

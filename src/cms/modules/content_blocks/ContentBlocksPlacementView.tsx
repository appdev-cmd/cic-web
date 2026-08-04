import React from 'react';
import {
  Layers,
  Sparkles,
  AlertTriangle,
  Plus,
  Eye,
  Edit3,
  Globe,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { PlacementZone, BlockItem } from './types';

interface ContentBlocksPlacementViewProps {
  placements: PlacementZone[];
  blocks: BlockItem[];
  onEditBlock: (block: BlockItem) => void;
  onOpenPreview: (block: BlockItem) => void;
  onCreateBlockInPlacement: (placementId: string) => void;
}

export const ContentBlocksPlacementView: React.FC<ContentBlocksPlacementViewProps> = ({
  placements,
  blocks,
  onEditBlock,
  onOpenPreview,
  onCreateBlockInPlacement,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Phân Nhóm Theo Vị Trí Hiển Thị Trên Website (Placement Lanes)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quản lý giới hạn dung lượng (Capacity), thứ tự hiển thị và kiểm tra xung đột trực quan theo từng vị trí.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {placements.map((plc) => {
          const blocksInPlc = blocks.filter((b) => b.placement_id === plc.id && b.workflow_status !== 'archived');
          const isOverCapacity = blocksInPlc.length > plc.max_capacity;

          return (
            <div
              key={plc.id}
              className={`border rounded-2xl bg-white dark:bg-slate-900 shadow-2xs overflow-hidden flex flex-col ${
                isOverCapacity
                  ? 'border-rose-300 dark:border-rose-900/60 ring-2 ring-rose-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Lane Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-900">
                      {plc.code}
                    </span>
                    {isOverCapacity && (
                      <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Vượt Dung Lượng
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                    {plc.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {plc.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      blocksInPlc.length > plc.max_capacity
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                    }`}
                  >
                    {blocksInPlc.length} / {plc.max_capacity} khối active
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                    Aspect Ratio: {plc.recommended_aspect_ratio}
                  </span>
                </div>
              </div>

              {/* Lane Blocks List */}
              <div className="p-4 flex-1 space-y-3 bg-slate-50/40 dark:bg-slate-900/40">
                {blocksInPlc.length > 0 ? (
                  blocksInPlc.map((b, idx) => (
                    <div
                      key={b.id}
                      className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          #{b.display_order}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {b.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>{b.type}</span>
                            <span>•</span>
                            <span>{b.scope.apply_all_pages ? 'All Pages' : `${b.used_by_count} pages`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onOpenPreview(b)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditBlock(b)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400">Vị trí này chưa có khối nội dung nào.</p>
                  </div>
                )}
              </div>

              {/* Lane Footer */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onCreateBlockInPlacement(plc.id)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> + Thêm khối vào vị trí này
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

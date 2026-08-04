import React from 'react';
import { X, Layers, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { BannerPlacementConfig } from './types';

interface BannerPlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  placements: BannerPlacementConfig[];
}

export const BannerPlacementModal: React.FC<BannerPlacementModalProps> = ({
  isOpen,
  onClose,
  placements,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Quản Lý Vị Trí Hiển Thị Website (Website Placements)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thiết lập quy chuẩn tỷ lệ ảnh, kích thước đề xuất và giới hạn số lượng banner đồng thời.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Placements */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {placements.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {p.code}
                  </span>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                  {p.active_count} / {p.max_capacity} banner đang chạy
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div>Tỷ lệ chuẩn: <strong className="font-mono text-slate-900 dark:text-white">{p.recommended_ratio}</strong></div>
                <div>Độ phân giải: <strong className="font-mono text-slate-900 dark:text-white">{p.recommended_resolution}</strong></div>
                <div>Site: <strong className="font-mono text-slate-900 dark:text-white">{p.site_id}</strong></div>
              </div>

              <p className="text-[11px] text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

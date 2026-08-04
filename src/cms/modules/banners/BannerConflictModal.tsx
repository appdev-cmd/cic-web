import React from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, Clock, Sliders, Edit, RotateCcw } from 'lucide-react';
import { ScheduleConflict, BannerContent } from './types';

interface BannerConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: ScheduleConflict[];
  items: BannerContent[];
  onResolveConflict: (conflictId: string, action: 'adjust_priority' | 'shift_time' | 'deactivate') => void;
}

export const BannerConflictModal: React.FC<BannerConflictModalProps> = ({
  isOpen,
  onClose,
  conflicts,
  items,
  onResolveConflict,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Kiểm Tra Xung Đột Lịch Hiển Thị (Schedule Conflict Guard)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phát hiện {conflicts.length} vi phạm sức chứa vị trí hoặc trùng lặp thời gian hiển thị.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflicts List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {conflicts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Tuyệt vời! Không có xung đột lịch hiển thị nào.
              </p>
              <p className="text-xs">Tất cả các banner và slideshow đều tuân thủ đúng sức chứa và thời gian đặt lịch.</p>
            </div>
          ) : (
            conflicts.map((cnf) => (
              <div
                key={cnf.id}
                className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-rose-600 text-white uppercase">
                    Mức độ: {cnf.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Vị trí: {cnf.placement_name}
                  </span>
                </div>

                <p className="text-xs text-rose-900 dark:text-rose-200 font-medium">{cnf.description}</p>

                {/* Conflicting items list */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Các mục bị ảnh hưởng:</span>
                  {cnf.conflicting_item_titles.map((title, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                    >
                      <span className="truncate max-w-md">• {title}</span>
                    </div>
                  ))}
                </div>

                {/* Resolution Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200 dark:border-rose-900/40">
                  <button
                    onClick={() => onResolveConflict(cnf.id, 'adjust_priority')}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg transition"
                  >
                    Tự động điều chỉnh Trọng số Ưu tiên
                  </button>
                  <button
                    onClick={() => onResolveConflict(cnf.id, 'shift_time')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition"
                  >
                    Lùi thời gian bắt đầu
                  </button>
                </div>
              </div>
            ))
          )}
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

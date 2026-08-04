import React from 'react';
import { X, History, RotateCcw, CheckCircle, Clock, ArrowUpRight, ShieldCheck, GitCommit } from 'lucide-react';
import { MenuVersion } from './types';

interface MenuVersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: MenuVersion[];
  onRestoreVersion: (version: MenuVersion) => void;
  onCompareVersion: (version: MenuVersion) => void;
}

export const MenuVersionHistoryDrawer: React.FC<MenuVersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  versions,
  onRestoreVersion,
  onCompareVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Lịch sử Phiên bản Menu</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Khôi phục (Restore) phiên bản cũ tạo ra một bản thảo Draft mới mà không đè trực tiếp Live.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {versions.map((ver) => (
            <div
              key={ver.version_id}
              className={`p-4 rounded-2xl border transition ${
                ver.is_current_live
                  ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800/80 dark:bg-emerald-950/20 ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    v{ver.version_number.toFixed(1)}
                  </span>
                  {ver.is_current_live ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500 text-white flex items-center gap-1 shadow-2xs">
                      <CheckCircle className="w-3 h-3" /> Đang phát hành Live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      Lịch sử Archival
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{ver.item_count} mục menu</span>
              </div>

              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {ver.change_summary}
              </p>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mb-3">
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {ver.published_at}
                </p>
                <p>Người thực hiện: <strong>{ver.published_by}</strong></p>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => onCompareVersion(ver)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 flex items-center gap-1"
                >
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>So sánh Diff</span>
                </button>

                {!ver.is_current_live && (
                  <button
                    onClick={() => onRestoreVersion(ver)}
                    className="px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 rounded-xl transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Nạp lại làm Draft</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

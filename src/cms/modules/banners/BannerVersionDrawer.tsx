import React from 'react';
import { X, History, CheckCircle2, RotateCcw, GitCompare, Sparkles, UserCheck } from 'lucide-react';
import { BannerVersion } from './types';

interface BannerVersionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: BannerVersion[];
  onRestoreVersion: (ver: BannerVersion) => void;
}

export const BannerVersionDrawer: React.FC<BannerVersionDrawerProps> = ({
  isOpen,
  onClose,
  versions,
  onRestoreVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Lịch Sử Phiên Bản & Rollback
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Truy vết mọi lần Xuất Bản (Publish) nguyên tử và khôi phục lại dễ dàng.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Items Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {versions.map((ver) => (
            <div
              key={ver.version_id}
              className={`p-4 rounded-2xl border transition space-y-3 ${
                ver.is_current_live
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 font-mono font-extrabold text-xs rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    v{ver.version_number.toFixed(1)}
                  </span>
                  {ver.is_current_live && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đang chạy Live
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{ver.published_at}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{ver.change_summary}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Người xuất bản: <strong>{ver.published_by}</strong></span>

                {!ver.is_current_live && (
                  <button
                    onClick={() => onRestoreVersion(ver)}
                    className="px-3 py-1 text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 rounded-lg transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Khôi phục (Rollback)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

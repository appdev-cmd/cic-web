import React from 'react';
import { X, History, RotateCcw, CheckCircle, Clock, FileDiff, Sparkles } from 'lucide-react';
import { BlockVersion, BlockItem } from './types';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  block: BlockItem | null;
  versions: BlockVersion[];
  onRollback: (version: BlockVersion) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  block,
  versions,
  onRollback,
}) => {
  if (!isOpen || !block) return null;

  const blockVersions = versions.filter((version) => version.block_id === block.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-orange-500" />
              <span>Lịch Sử Phiên Bản & Restore (Versions)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">
              Khối: {block.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Current Working Version Badge */}
          <div className="p-3.5 bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Trạng thái Live Hiện Tại
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Phiên bản Live: {block.live_version}
              </span>
              <span className="text-xs font-mono text-slate-500">Draft: {block.draft_version}</span>
            </div>
          </div>

          {/* Version list timeline */}
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6">
            {blockVersions.map((ver) => (
              <div key={ver.version_id} className="relative pl-6">
                {/* Point */}
                <div
                  className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${
                    ver.is_current_live
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {ver.is_current_live && <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>v{ver.version_number.toFixed(1)}</span>
                      {ver.is_current_live && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Live Active
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(ver.published_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ver.change_summary}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {ver.published_by}
                    </span>

                    {!ver.is_current_live && (
                      <button
                        type="button"
                        onClick={() => onRollback(ver)}
                        className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-orange-600 hover:text-white text-slate-800 dark:text-slate-200 rounded text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Rollback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, History, RotateCcw, Check, Eye, FileDiff, Sparkles } from 'lucide-react';
import { StaticPage, VersionRecord } from './types';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  page: StaticPage | null;
  onClose: () => void;
  onRestoreVersion?: (version: VersionRecord) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  page,
  onClose,
  onRestoreVersion,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<VersionRecord | null>(null);

  if (!isOpen || !page) return null;

  const mockVersions: VersionRecord[] = page.versions || [
    {
      version: page.working_version_number,
      created_at: page.updated_time || page.created_time,
      author_name: page.author?.name || 'Biên tập viên',
      note: 'Bản thảo làm việc (Working Version - Draft)',
      title: page.title,
      content: page.content,
      is_published_version: false,
    },
    {
      version: page.published_version_number || 1,
      created_at: page.created_time,
      author_name: page.reviewer?.name || 'Quản trị viên',
      note: 'Bản đã xuất bản công khai (Published Version v1.0)',
      title: page.title,
      content: page.content,
      is_published_version: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Lịch sử phiên bản</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[280px]">
                {page.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between">
            <div>
              <span className="font-bold">Phiên bản công khai: </span>
              <span className="font-mono">v{page.published_version_number || 1}.0</span>
            </div>
            <div>
              <span className="font-bold">Phiên bản đang sửa: </span>
              <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">
                v{page.working_version_number}.0 (Draft)
              </span>
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Danh sách lịch sử chỉnh sửa
          </h4>

          <div className="space-y-3">
            {mockVersions.map((v) => (
              <div
                key={v.version}
                className={`p-4 rounded-2xl border transition-all ${
                  v.is_published_version
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-xs font-bold rounded-md">
                      v{v.version}.0
                    </span>
                    {v.is_published_version && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" /> Đang công khai
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{v.created_at}</span>
                </div>

                <div className="pt-2.5 space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{v.note}</p>
                  <p className="text-[11px] text-slate-500">Người thực hiện: <strong>{v.author_name}</strong></p>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedVersion(v)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem nội dung
                  </button>
                  {!v.is_published_version && onRestoreVersion && (
                    <button
                      onClick={() => onRestoreVersion(v)}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Khôi phục bản này
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Version Viewer */}
          {selectedVersion && (
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-2 border border-slate-300 dark:border-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Xem bản v{selectedVersion.version}.0</span>
                <button
                  onClick={() => setSelectedVersion(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div
                className="text-xs text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-sans leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { History, X, Check, RotateCcw, GitCompare, User, Calendar, FileText } from 'lucide-react';
import { ArticleVersion, NewsArticle } from '../types';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  article: NewsArticle | null;
  onClose: () => void;
  onRestoreVersion: (version: ArticleVersion) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  article,
  onClose,
  onRestoreVersion,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<ArticleVersion | null>(null);

  if (!isOpen || !article) return null;

  const versions = article.versions || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Lịch sử phiên bản bài viết
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Phiên bản hiện tại: v{article.working_version_number || 1}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {versions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chưa có lịch sử phiên bản lưu trữ cho bài viết này.
              </p>
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {versions.map((ver) => {
                const isCurrent = ver.version_number === article.working_version_number;
                const isPublished = ver.is_published_version || ver.version_number === article.published_version_number;

                return (
                  <div
                    key={ver.id}
                    onClick={() => setSelectedVersion(ver)}
                    className={`relative pl-8 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedVersion?.id === ver.id
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Node Dot */}
                    <div
                      className={`absolute left-2 top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs ${
                        isPublished
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-indigo-500'
                          : 'bg-slate-400'
                      }`}
                    />

                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          v{ver.version_number}
                        </span>
                        {isPublished && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/20">
                            Published Version
                          </span>
                        )}
                        {isCurrent && !isPublished && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-500/20">
                            Working Draft
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" /> {ver.created_at}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                      {ver.title || article.title}
                    </p>

                    {ver.note && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-2">
                        "{ver.note}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {ver.created_by || 'Hệ thống'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestoreVersion(ver);
                        }}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Khôi phục v{ver.version_number}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Version Detail View */}
        {selectedVersion && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>Chi tiết phiên bản v{selectedVersion.version_number}</span>
              </h4>
              <button
                onClick={() => onRestoreVersion(selectedVersion)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Áp dụng phiên bản này</span>
              </button>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 max-h-36 overflow-y-auto">
              <p className="font-bold text-slate-800 dark:text-slate-200">{selectedVersion.title}</p>
              <p className="text-slate-500 dark:text-slate-400">{selectedVersion.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

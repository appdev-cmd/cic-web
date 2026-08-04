import React from 'react';
import { Activity, X, User, Calendar, CheckCircle2, Clock, RotateCcw, Send, Sparkles } from 'lucide-react';
import { ArticleActivityLog, NewsArticle } from '../types';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  article: NewsArticle | null;
  onClose: () => void;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({
  isOpen,
  article,
  onClose,
}) => {
  if (!isOpen || !article) return null;

  const logs = article.activity_logs || [
    {
      id: 'act_init',
      timestamp: article.created_time || '2026-08-01 09:00:00',
      user: article.author?.name || 'Tác giả',
      action: 'Tạo bản nháp bài viết',
      details: 'Khởi tạo bài viết ban đầu',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Nhật ký hoạt động & Kiểm vết (Audit Trail)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bài viết: #{article.id}
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

        {/* Audit Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-8 space-y-1">
                {/* Timeline Icon Node */}
                <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-xs" />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {log.timestamp}
                  </span>
                </div>

                {log.details && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    {log.details}
                  </p>
                )}

                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium pt-0.5">
                  <User className="w-3 h-3 text-slate-400" /> thực hiện bởi <strong className="text-slate-600 dark:text-slate-300">{log.user}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

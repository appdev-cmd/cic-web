import React from 'react';
import { X, Activity, User, Clock, FileText, CheckCircle2, RotateCcw } from 'lucide-react';
import { StaticPage } from './types';

interface ActivityLogDrawerProps {
  isOpen: boolean;
  page: StaticPage | null;
  onClose: () => void;
}

export const ActivityLogDrawer: React.FC<ActivityLogDrawerProps> = ({ isOpen, page, onClose }) => {
  if (!isOpen || !page) return null;

  const activities = (page.activities || [
    {
      id: 'act1',
      timestamp: page.created_time,
      actor_name: page.author?.name || 'Biên tập viên',
      action_type: 'create' as const,
      details: 'Khởi tạo trang tĩnh mới',
    },
    {
      id: 'act2',
      timestamp: page.updated_time || page.created_time,
      actor_name: page.author?.name || 'Hệ thống',
      action_type: page.published ? ('publish' as const) : ('update' as const),
      details: page.published ? 'Xuất bản trang' : 'Cập nhật nội dung bản thảo',
    },
  ]).map((activity) => ({
    ...activity,
    action_type: activity.action_type === 'approve' ? 'publish' : activity.action_type === 'submit' || activity.action_type === 'return' ? 'update' : activity.action_type,
    details: /duyệt|review|phê duyệt|trả lại/i.test(activity.details) ? 'Nội dung trang đã được cập nhật' : activity.details,
  }));

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'create':
        return <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] rounded flex items-center gap-1"><FileText className="w-3 h-3" /> Tạo mới</span>;
      case 'update':
        return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] rounded flex items-center gap-1"><Clock className="w-3 h-3" /> Cập nhật</span>;
      case 'publish':
        return <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Xuất bản</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 text-[10px] rounded">{type}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Nhật ký hoạt động</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[260px]">
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

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {activities.map((act) => (
              <div key={act.id} className="relative space-y-1.5">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-900" />
                <div className="flex items-center justify-between">
                  {getActionBadge(act.action_type)}
                  <span className="text-[10px] font-mono text-slate-400">{act.timestamp}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 pt-0.5">
                  {act.details}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{act.actor_name}</span>
                </p>
              </div>
            ))}
          </div>
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

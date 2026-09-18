import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import type { ActivityLog } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';

interface DashboardActivityTimelineProps {
  activityLogs: ActivityLog[];
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
  onOpenDrawerItem: (type: 'contact' | 'registration' | 'pending' | 'activity', data: any) => void;
}

export const DashboardActivityTimeline: React.FC<DashboardActivityTimelineProps> = ({
  activityLogs,
  workspaceLocale,
  onNavigate,
  onOpenDrawerItem,
}) => {
  const isEn = workspaceLocale === 'en';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {isEn ? 'Recent Audit Timeline' : 'Lịch sử hoạt động gần đây (Audit Timeline)'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEn
                ? 'Last 10 administrative operations recorded across the system'
                : 'Ghi nhận 10 tác vụ quản trị vừa thực hiện trên toàn hệ thống'}
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            onNavigate(
              '/cms/activity-logs',
              isEn ? 'Activity Logs (Audit)' : 'Nhật ký Hoạt động (Audit Logs)'
            )
          }
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>{isEn ? 'View all logs' : 'Xem chi tiết log'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activityLogs.map((log) => {
          const avatarUrl = log.user_avatar
            ? log.user_avatar.startsWith('/') || log.user_avatar.startsWith('http')
              ? log.user_avatar
              : `/${log.user_avatar}`
            : null;

          return (
            <div
              key={log.id}
              onClick={() => onOpenDrawerItem('activity', log)}
              className="relative pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-1 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2.5 rounded-xl transition-colors"
            >
              {/* Timeline Dot */}
              <div className="absolute left-2 top-4 w-3 h-3 rounded-full bg-orange-600 border-2 border-white dark:border-slate-900 shadow-xs group-hover:scale-125 transition-transform" />

              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={log.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {log.username ? log.username[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {log.username}
                    </span>
                    <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] rounded uppercase font-bold">
                      {log.activity_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                    {log.description}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 shrink-0 self-start sm:self-auto font-mono">
                {log.created_time}
              </span>
            </div>
          );
        })}
        {activityLogs.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 pl-8">
            {isEn ? 'No recent activity logs' : 'Chưa có nhật ký hoạt động nào'}
          </p>
        )}
      </div>
    </div>
  );
};

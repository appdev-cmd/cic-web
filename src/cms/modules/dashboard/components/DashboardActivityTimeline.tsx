'use client';

import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';
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

  const getActionBadge = (type: ActivityLog['activity_type']) => {
    switch (type) {
      case 'create':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
      case 'update':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60';
      case 'delete':
        return 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60';
      case 'publish':
        return 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              {isEn ? 'System Audit Log' : 'Nhật Ký Quản Trị Hệ Thống'}
            </h3>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              Audit
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isEn
              ? 'Last 10 administrative actions recorded across CMS'
              : 'Ghi nhận 10 tác vụ quản trị vừa thực hiện trên toàn hệ thống'}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onNavigate(
              '/cms/activity-logs',
              isEn ? 'Activity Logs (Audit)' : 'Nhật ký Hoạt động (Audit Logs)'
            )
          }
          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
        >
          <span>{isEn ? 'View all logs' : 'Xem toàn bộ nhật ký'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Audit Log Rows (Stream with Hairline Dividers - NO DISCONNECTED ORANGE DOTS) */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {activityLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            {isEn ? 'No recent activity logs.' : 'Chưa có nhật ký hoạt động nào.'}
          </div>
        ) : (
          activityLogs.map((log) => {
            const avatarUrl = log.user_avatar
              ? log.user_avatar.startsWith('/') || log.user_avatar.startsWith('http')
                ? log.user_avatar
                : `/${log.user_avatar}`
              : null;

            return (
              <div
                key={log.id}
                onClick={() => onOpenDrawerItem('activity', log)}
                className="py-2.5 px-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar or Initial */}
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={log.username}
                      className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      {log.username ? log.username[0].toUpperCase() : 'U'}
                    </div>
                  )}

                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white shrink-0">
                      {log.username}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-[10px] uppercase font-bold border ${getActionBadge(
                        log.activity_type
                      )}`}
                    >
                      {log.activity_type}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {log.description}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400 shrink-0 self-start sm:self-auto">
                  {log.created_time}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { ArrowRight, Clock, UserCheck } from 'lucide-react';
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

  // Format relative timestamp naturally
  const formatRelativeTime = (timeStr?: string): string => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return timeStr;
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) return isEn ? 'Just now' : 'Vừa xong';
      if (diffMinutes < 60) return isEn ? `${diffMinutes}m ago` : `${diffMinutes} phút trước`;
      if (diffHours < 24) return isEn ? `${diffHours}h ago` : `${diffHours} giờ trước`;
      if (diffDays === 1) return isEn ? 'Yesterday' : 'Hôm qua';
      if (diffDays < 7) return isEn ? `${diffDays}d ago` : `${diffDays} ngày trước`;
      return date.toLocaleDateString(isEn ? 'en-US' : 'vi-VN', { day: '2-digit', month: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  // Convert technical audit description into natural sentence without technical codes or UUIDs
  const formatNaturalDescription = (log: ActivityLog): { user: string; text: string } => {
    const rawUser = log.username || (isEn ? 'Admin' : 'Quản trị viên');
    const desc = log.description || '';

    // Strip raw UUIDs or technical hash patterns
    const cleanDesc = desc
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '')
      .replace(/#[0-9]+/g, '')
      .trim();

    if (desc.includes('product.status_changed')) {
      const entity = cleanDesc.split(':')[1]?.trim() || (isEn ? 'product' : 'sản phẩm');
      return {
        user: rawUser,
        text: isEn ? `published product: ${entity}` : `đã duyệt xuất bản sản phẩm: ${entity}`,
      };
    }

    if (desc.includes('customer_request.status_changed')) {
      const entity = cleanDesc.split(':')[1]?.trim() || (isEn ? 'inquiry' : 'yêu cầu khách hàng');
      return {
        user: rawUser,
        text: isEn ? `processed customer request: ${entity}` : `đã xử lý yêu cầu khách hàng: ${entity}`,
      };
    }

    if (desc.includes('news.status_changed') || desc.includes('news.publish')) {
      const entity = cleanDesc.split(':')[1]?.trim() || (isEn ? 'news' : 'bài viết');
      return {
        user: rawUser,
        text: isEn ? `published article: ${entity}` : `đã duyệt bài viết: ${entity}`,
      };
    }

    if (desc.includes('create')) {
      const entity = cleanDesc.split(':')[1]?.trim() || '';
      return {
        user: rawUser,
        text: isEn
          ? `created new content${entity ? `: ${entity}` : ''}`
          : `đã tạo nội dung mới${entity ? `: ${entity}` : ''}`,
      };
    }

    if (desc.includes('update')) {
      const entity = cleanDesc.split(':')[1]?.trim() || '';
      return {
        user: rawUser,
        text: isEn
          ? `updated content${entity ? `: ${entity}` : ''}`
          : `đã cập nhật nội dung${entity ? `: ${entity}` : ''}`,
      };
    }

    // Default cleaned description
    const formatted = cleanDesc.replace(/^[a-z_]+\.[a-z_]+:\s*/i, '');
    return {
      user: rawUser,
      text: formatted || (isEn ? 'updated website system' : 'cập nhật hệ thống website'),
    };
  };

  // Exactly 4 recent items
  const recentLogs = activityLogs.slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
            {isEn ? 'Recent Activity' : 'Hoạt Động Gần Đây'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isEn ? 'Administrative actions recorded in real time' : 'Tác vụ quản trị website thực hiện gần nhất'}
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
          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{isEn ? 'View all activity logs →' : 'Xem toàn bộ nhật ký →'}</span>
        </button>
      </div>

      {/* Activity List: 3-4 natural items without technical jargon or UUIDs */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {recentLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            {isEn ? 'No recent activity recorded.' : 'Chưa có hoạt động quản trị gần đây.'}
          </div>
        ) : (
          recentLogs.map((log) => {
            const { user, text } = formatNaturalDescription(log);
            const timeAgo = formatRelativeTime(log.created_time);

            return (
              <div
                key={log.id}
                onClick={() => onOpenDrawerItem('activity', log)}
                className="py-3 px-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {user.charAt(0).toUpperCase()}
                  </div>

                  <p className="truncate text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-semibold">{user}</strong>{' '}
                    <span>{text}</span>
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <span>·</span>
                  <span>{timeAgo}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

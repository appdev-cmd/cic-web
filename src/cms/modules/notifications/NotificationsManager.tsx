'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  CheckCheck,
  RotateCcw,
  Mail,
  FileText,
  Calendar,
  Sparkles,
  ShieldAlert,
  ExternalLink,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { CmsNotificationItem, GetNotificationsResult } from '@/server/notifications/types';
import {
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction,
} from '@/server/notifications/actions';
import { useCmsToast } from '@/cms/context/CmsToastContext';

interface NotificationsManagerProps {
  initialData: GetNotificationsResult;
  workspaceLocale?: 'vi' | 'en';
}

type TypeFilterKey = 'all' | 'contact' | 'quote' | 'registration' | 'editorial' | 'system';

export function NotificationsManager({
  initialData,
  workspaceLocale = 'vi',
}: NotificationsManagerProps) {
  const router = useRouter();
  const { showToast } = useCmsToast();
  const [isPending, startTransition] = useTransition();

  const [notifications, setNotifications] = useState<CmsNotificationItem[]>(initialData.notifications);
  const [unreadCount, setUnreadCount] = useState<number>(initialData.unreadCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilterKey>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeTab === 'unread' && !item.unread) return false;

      // Type filter
      if (typeFilter !== 'all') {
        if (typeFilter === 'system' && (item.type === 'system' || item.type === 'security')) {
          // match
        } else if (item.type !== typeFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesMeta = JSON.stringify(item.metadata || {}).toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesMeta) return false;
      }

      return true;
    });
  }, [notifications, activeTab, typeFilter, searchQuery]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(start, start + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);

  // Actions
  const handleMarkAsRead = async (id: string) => {
    const numId = Number(id);
    if (isNaN(numId)) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsReadAction(numId);
    } catch (err) {
      console.error(err);
      showToast('Không thể cập nhật trạng thái đã đọc.');
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsReadAction();
      showToast('Đã đánh dấu tất cả thông báo là đã đọc.');
    } catch (err) {
      console.error(err);
      showToast('Không thể đánh dấu tất cả đã đọc.');
    }
  };

  const handleDelete = async (id: string) => {
    const numId = Number(id);
    if (isNaN(numId)) return;

    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;

    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target?.unread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await deleteNotificationAction(numId);
      showToast('Đã xóa thông báo thành công.');
    } catch (err) {
      console.error(err);
      showToast('Không thể xóa thông báo.');
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-800/40">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'registration':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/40">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case 'contact':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-800/40">
            <Mail className="w-5 h-5" />
          </div>
        );
      case 'editorial':
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200/60 dark:border-purple-800/40">
            <Sparkles className="w-5 h-5" />
          </div>
        );
      case 'security':
      case 'system':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200/60 dark:border-rose-800/40">
            <ShieldAlert className="w-5 h-5" />
          </div>
        );
    }
  };

  const getTypeBadgeLabel = (type: string) => {
    switch (type) {
      case 'quote':
        return 'Báo giá';
      case 'registration':
        return 'Sự kiện';
      case 'contact':
        return 'Liên hệ';
      case 'editorial':
        return 'Nội dung';
      case 'security':
        return 'Bảo mật';
      case 'system':
        return 'Hệ thống';
      default:
        return 'Thông báo';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Bell className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Trung tâm Thông báo
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-2xs">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Quản lý và tra cứu toàn bộ lịch sử thông báo, yêu cầu khách hàng và hoạt động hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-orange-500" />
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => router.refresh()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-pointer shadow-2xs"
            title="Tải lại danh sách"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Toolbar & Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm theo tiêu đề, email, tên khách..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-2xs"
            />
          </div>

          {/* Read / Unread Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('unread');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] mr-1 hidden sm:inline flex items-center gap-1">
            <Filter className="w-3 h-3" /> Phân loại:
          </span>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'contact', label: 'Liên hệ' },
            { key: 'quote', label: 'Báo giá' },
            { key: 'registration', label: 'Sự kiện' },
            { key: 'editorial', label: 'Biên tập' },
            { key: 'system', label: 'Hệ thống' },
          ].map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => {
                setTypeFilter(pill.key as TypeFilterKey);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap text-xs ${
                typeFilter === pill.key
                  ? 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80 text-orange-600 dark:text-orange-400 font-semibold'
                  : 'bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Notification Cards List */}
      <div className="space-y-3">
        {paginatedList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Không có thông báo nào phù hợp
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc trạng thái để xem thêm thông báo.
            </p>
          </div>
        ) : (
          paginatedList.map((item) => {
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleString(workspaceLocale === 'en' ? 'en-US' : 'vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                  item.unread
                    ? 'border-orange-200 dark:border-orange-900/60 bg-orange-50/30 dark:bg-orange-950/15 shadow-2xs'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {renderIcon(item.type)}

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {getTypeBadgeLabel(item.type)}
                      </span>
                      {item.unread && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          Chưa đọc
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <h3
                      className={`text-sm ${
                        item.unread
                          ? 'font-bold text-slate-900 dark:text-white'
                          : 'font-semibold text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                        {item.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-500">
                        {Boolean(item.metadata.email) && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                            ✉️ {String(item.metadata.email)}
                          </span>
                        )}
                        {Boolean(item.metadata.telephone) && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                            📞 {String(item.metadata.telephone)}
                          </span>
                        )}
                        {Boolean(item.metadata.formName) && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                            📋 {String(item.metadata.formName)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                  {item.unread && (
                    <button
                      type="button"
                      onClick={() => void handleMarkAsRead(item.id)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                      title="Đánh dấu đã đọc"
                    >
                      Đã đọc
                    </button>
                  )}

                  {item.linkUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        void handleMarkAsRead(item.id);
                        router.push(item.linkUrl!);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => void handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Hiển thị {Math.min(filteredNotifications.length, (currentPage - 1) * pageSize + 1)} -{' '}
            {Math.min(filteredNotifications.length, currentPage * pageSize)} trong tổng số{' '}
            {filteredNotifications.length} thông báo
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 font-semibold text-slate-800 dark:text-slate-200">
              Trang {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

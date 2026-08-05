import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  FileText,
  Package,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { CmsUser, NotificationItem } from '../types';
import type { CmsLocale } from '../data/CmsDataSource';

interface CmsHeaderProps {
  user: CmsUser;
  initialNotifications: NotificationItem[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  workspaceLocale: CmsLocale;
  onToggleWorkspaceLocale: () => void;
  onOpenCommandPalette: () => void;
  onQuickAction: (type: 'product' | 'news' | 'banner' | 'event' | 'static_page') => void;
  onToggleMobileSidebar: () => void;
  onSwitchToWebsite?: () => void;
}

export const CmsHeader: React.FC<CmsHeaderProps> = ({
  user,
  initialNotifications,
  isDarkMode,
  onToggleTheme,
  workspaceLocale,
  onToggleWorkspaceLocale,
  onOpenCommandPalette,
  onQuickAction,
  onToggleMobileSidebar,
  onSwitchToWebsite,
}) => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-40 h-15 w-full overflow-visible bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Menu Toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          title="Mở Menu Admin"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onSwitchToWebsite}>
          <img src="/LOGO - 1990-08.png" alt="CIC Logo" className="h-9 w-auto object-contain shrink-0" />
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                CIC CMS
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline-block">
              Hệ thống Quản trị Nội dung
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Global Search Input with Ctrl+K */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Tìm sản phẩm, tin tức, banner, người dùng...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded shadow-xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Quick Action, Notifs, Lang, Theme, User */}
      <div className="flex min-w-0 items-center gap-1 sm:gap-2 lg:gap-3">
        {/* Mobile Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Tìm kiếm"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Quick + New Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsQuickActionOpen(!isQuickActionOpen);
              setIsNotifOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tạo mới</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isQuickActionOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setIsQuickActionOpen(false)}
            >
              <div className="px-3 py-1 font-semibold text-slate-400 dark:text-slate-500 uppercase text-[10px]">
                Tạo mới nhanh
              </div>
              <button
                onClick={() => {
                  onQuickAction('product');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-orange-500" />
                <span>Sản phẩm mới</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('news');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Bài viết mới</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('static_page');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Trang nội dung mới</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('banner');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Banner mới</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('event');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Sự kiện mới</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsQuickActionOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Thông báo hệ thống ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-orange-600 dark:text-orange-400 hover:underline text-[11px] font-medium"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex gap-2.5 ${
                      item.unread ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        item.unread ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <div className="flex-1 space-y-0.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {item.created_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700/80 text-center">
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-[11px]"
                >
                  Đóng thông báo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Workspace locale switch. UI language is a separate user preference. */}
        <button
          onClick={onToggleWorkspaceLocale}
          className="hidden sm:flex px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors items-center gap-1 cursor-pointer"
          title="Chuyển vùng dữ liệu CMS"
          aria-label={`Vùng dữ liệu hiện tại: ${workspaceLocale === 'vi' ? 'Tiếng Việt' : 'English'}`}
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{workspaceLocale.toUpperCase()}</span>
        </button>

        {/* Theme Toggle Light/Dark */}
        <button
          onClick={onToggleTheme}
          className="hidden sm:inline-flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isDarkMode ? 'Chuyển Chế độ Sáng' : 'Chuyển Chế độ Tối'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* User Menu Avatar */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsQuickActionOpen(false);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <img
              src={user.user_avatar}
              alt={user.full_name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className="hidden xl:inline text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
              {user.full_name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:inline" />
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs"
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/80">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {user.full_name}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-[11px] truncate">
                  @{user.username} • {user.role}
                </p>
              </div>

              <div className="py-1">
                {onSwitchToWebsite && (
                  <button
                    onClick={() => {
                      onSwitchToWebsite();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer font-medium text-orange-600 dark:text-orange-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Xem Website Frontend</span>
                  </button>
                )}
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Trang cá nhân Admin</span>
                </button>
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Cấu hình tài khoản</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-700/80">
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

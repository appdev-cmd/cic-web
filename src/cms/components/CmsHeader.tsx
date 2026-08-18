import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  KeyRound,
  LogOut,
  Globe,
  Menu,
  X,
  Newspaper,
  Package,
  Sparkles,
  Calendar,
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
  onQuickAction: (type: 'product' | 'news' | 'service' | 'event') => void;
  onToggleMobileSidebar: () => void;
  onSwitchToWebsite?: () => void;
  onOpenMyAccount?: () => void;
  onOpenChangePassword?: () => void;
  onLogout?: () => void;
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
  onOpenMyAccount,
  onOpenChangePassword,
  onLogout,
}) => {
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Quản trị viên cấp cao';
      case 'admin':
        return 'Quản trị viên';
      case 'editor':
        return 'Biên tập viên';
      case 'viewer':
        return 'Người xem';
      default:
        return 'Quản trị viên';
    }
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
      <div className="hidden sm:flex items-center flex-1 max-w-[220px] md:max-w-xs lg:max-w-lg mx-2 sm:mx-4 lg:mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between pl-2.5 sm:pl-3 pr-2 py-1.5 sm:py-2 bg-slate-50/90 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/90 hover:border-orange-400/80 dark:border-slate-700/80 dark:hover:border-orange-500/60 rounded-xl text-xs text-slate-400 transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md hover:shadow-orange-500/5"
          title="Mở Tìm kiếm toàn hệ thống (Ctrl + K hoặc /)"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors min-w-0">
            <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200 shrink-0">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span className="font-normal text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 truncate text-left">
              <span className="lg:hidden">Tìm kiếm CMS...</span>
              <span className="hidden lg:inline">
                Tìm kiếm toàn bộ CMS <span className="text-slate-400 dark:text-slate-500 font-light text-[11px]">(sản phẩm, tin tức, leads...)</span>
              </span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 shrink-0 pl-2">
            <kbd className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs group-hover:border-orange-300 dark:group-hover:border-orange-700/50 transition-colors">
              <span className="text-[11px] font-sans">⌘</span>K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Controls: Quick Action, Notifs, Lang, Theme, User */}
      <div className="flex min-w-0 items-center gap-1 sm:gap-2 lg:gap-3">
        {/* Mobile Search trigger (< sm) */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden flex items-center justify-center w-8.5 h-8.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 bg-slate-100/80 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
          title="Tìm kiếm toàn hệ thống"
        >
          <Search className="w-4 h-4" />
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
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Package className="w-4 h-4 text-orange-500" />
                <span>Sản phẩm mới</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('news');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Newspaper className="w-4 h-4 text-blue-500" />
                <span>Tin tức mới</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('service');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Dịch vụ mới</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('event');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
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
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isDarkMode ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
          aria-label="Đổi chế độ sáng tối"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-200" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 hover:text-slate-900 duration-200" />
          )}
        </button>

        {/* User Menu Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsQuickActionOpen(false);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Menu tài khoản"
          >
            <div className="relative">
              <img
                src={user.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.full_name}
                className="w-7.5 h-7.5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] truncate leading-tight">
                {user.full_name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                {getRoleDisplayName(user.role)}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 rounded-2xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              {/* Header Info Block */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-start gap-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-t-2xl">
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={user.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate leading-snug">
                    {user.full_name}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs truncate leading-snug">
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-900/60">
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Actions Section */}
              <div className="py-1.5 px-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenMyAccount) onOpenMyAccount();
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Tài khoản của tôi</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenChangePassword) onOpenChangePassword();
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Đổi mật khẩu</span>
                </button>
                <button
                  onClick={() => {
                    onToggleTheme();
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between cursor-pointer font-medium transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    )}
                    <span>{isDarkMode ? 'Giao diện sáng' : 'Giao diện tối'}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {isDarkMode ? 'Đang bật tối' : 'Đang bật sáng'}
                  </span>
                </button>
              </div>

              {/* View Website Section */}
              <div className="py-1.5 px-1.5 border-t border-slate-100 dark:border-slate-800">
                {onSwitchToWebsite && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSwitchToWebsite();
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 rounded-xl flex items-center justify-between cursor-pointer font-medium transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                      <span>Xem website</span>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-orange-500">Mở</span>
                  </button>
                )}
              </div>

              {/* Logout Section */}
              <div className="pt-1.5 pb-1 px-1.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
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

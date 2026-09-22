import React, { useState } from 'react';
import {
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
  Newspaper,
  Package,
  Sparkles,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { CmsUser, NotificationItem } from '../types';
import type { CmsLocale } from '../data/CmsDataSource';
import { getCmsDictionary } from '../i18n/cmsDictionary';

interface CmsHeaderProps {
  user: CmsUser;
  initialNotifications: NotificationItem[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  workspaceLocale: CmsLocale;
  onToggleWorkspaceLocale: () => void;
  onOpenCommandPalette?: () => void;
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

  const dict = getCmsDictionary(workspaceLocale);
  const tHeader = dict.header;
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
    <header className="sticky top-0 z-40 h-15 w-full overflow-visible bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Menu Toggle + Logo + Live Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
          title="Mở Menu Admin"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={onSwitchToWebsite}>
          <img src="/LOGO - 1990-08.png" alt="CIC Logo" className="h-9 w-auto object-contain shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                CIC CMS
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live System
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline-block">
              {tHeader.cmsSubtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: Live Website link, Quick Action, Lang Segmented Pill, Notifs, Theme, User */}
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
        {/* Direct Link to Live Website */}
        {onSwitchToWebsite && (
          <button
            onClick={onSwitchToWebsite}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
            title="Mở giao diện Website công khai"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Xem Website</span>
          </button>
        )}

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
            <span className="hidden sm:inline">{tHeader.quickAction}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isQuickActionOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setIsQuickActionOpen(false)}
            >
              <div className="px-3 py-1 font-semibold text-slate-400 dark:text-slate-500 uppercase text-[10px]">
                {tHeader.quickAction}
              </div>
              <button
                onClick={() => {
                  onQuickAction('product');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Package className="w-4 h-4 text-orange-500" />
                <span>{tHeader.newProduct}</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('news');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Newspaper className="w-4 h-4 text-blue-500" />
                <span>{tHeader.newNews}</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('service');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{tHeader.newService}</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('event');
                  setIsQuickActionOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>{tHeader.newEvent}</span>
              </button>
            </div>
          )}
        </div>

        {/* Workspace locale segmented control (VI | EN) */}
        <div 
          className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold"
          title="Chuyển vùng dữ liệu CMS (Tiếng Việt / English)"
        >
          <div className="hidden sm:flex items-center pl-1.5 pr-1 text-slate-400 dark:text-slate-500">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <button
            type="button"
            onClick={() => workspaceLocale !== 'vi' && onToggleWorkspaceLocale()}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer text-xs ${
              workspaceLocale === 'vi'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label="Vùng dữ liệu Tiếng Việt"
          >
            VI
          </button>
          <button
            type="button"
            onClick={() => workspaceLocale !== 'en' && onToggleWorkspaceLocale()}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer text-xs ${
              workspaceLocale === 'en'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label="Vùng dữ liệu English"
          >
            EN
          </button>
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
                  {tHeader.notifications} ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-orange-600 dark:text-orange-400 hover:underline text-[11px] font-medium"
                  >
                    {tHeader.markAllRead}
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                {notifications.length === 0 && (
                  <p className="px-4 py-8 text-center text-[11px] text-slate-500 dark:text-slate-400">
                    {tHeader.noNotifications}
                  </p>
                )}
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
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Package,
  Newspaper,
  FileText,
  Users,
  MessageSquare,
  FileCheck,
  ArrowUpRight,
  ChevronRight,
  Filter,
  RefreshCw,
  Download,
  SlidersHorizontal,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

import { CmsHeader } from './CmsHeader';
import { CmsSidebar } from './CmsSidebar';
import { CmsBreadcrumb } from './CmsBreadcrumb';
import { CmsFooter } from './CmsFooter';
import { CmsCommandPalette } from './CmsCommandPalette';
import { CmsRightDrawer, DrawerItem } from './CmsRightDrawer';

import {
  currentUserMock,
  kpiStatsMock,
  contactMessagesMock,
  productRegistrationsMock,
  pendingContentsMock,
  dailyTrafficMock,
  monthlyTrafficMock,
  weeklyContentStatsMock,
  activityLogsMock,
} from '../data/mockCmsData';

import { ContactMessage, ProductRegistration, PendingContent, ActivityLog } from '../types';
import { CicUsersManager } from '../modules/cic_users/CicUsersManager';
import { PermissionManagement } from '../modules/permission_management/PermissionManagement';
import { CicHistoryManager } from '../modules/cic_history/CicHistoryManager';
import { StaticPagesManager } from '../modules/static_pages/StaticPagesManager';
import { NewsManager } from '../modules/news/NewsManager';
import { EventsManager } from '../modules/events/EventsManager';
import { EmailTemplatesManager } from '../modules/email_templates/EmailTemplatesManager';
import { BannerCategoriesManager } from '../modules/banner_categories/BannerCategoriesManager';
import { BannersManager } from '../modules/banners/BannersManager';

interface CmsDashboardProps {
  onSwitchToWebsite?: () => void;
}

export const CmsDashboard: React.FC<CmsDashboardProps> = ({ onSwitchToWebsite }) => {
  // Theme & Layout States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lang, setLang] = useState<'VI' | 'EN'>('VI');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('/cms/dashboard');
  const [currentPageTitle, setCurrentPageTitle] = useState('Tổng quan CMS');

  // Command Palette & Right Drawer
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<DrawerItem | null>(null);

  // Filter & Data States
  const [trafficRange, setTrafficRange] = useState<'7' | '30'>('7');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lists state
  const [contacts, setContacts] = useState<ContactMessage[]>(contactMessagesMock);
  const [registrations, setRegistrations] = useState<ProductRegistration[]>(productRegistrationsMock);
  const [pendingItems, setPendingItems] = useState<PendingContent[]>(pendingContentsMock);
  const [activityLogs] = useState<ActivityLog[]>(activityLogsMock);
  const [searchFilter, setSearchFilter] = useState('');

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setToastMessage('Đang làm mới dữ liệu hệ thống...');
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage('Đã đồng bộ dữ liệu CMS mới nhất!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  // Status updates handler
  const handleUpdateStatus = (type: string, id: string, newStatus: string) => {
    if (type === 'contact') {
      setContacts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'completed' } : item))
      );
    } else if (type === 'registration') {
      setRegistrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'quoted' } : item))
      );
    } else if (type === 'pending') {
      setPendingItems((prev) => prev.filter((item) => item.id !== id));
    }
    setToastMessage(`Đã cập nhật trạng thái dữ liệu sang "${newStatus}"!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered lists based on search
  const filteredContacts = contacts.filter(
    (c) =>
      c.sender_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.company_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.product_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredPending = pendingItems.filter(
    (p) =>
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.author_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* 1. HEADER */}
      <CmsHeader
        user={currentUserMock}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'VI' ? 'EN' : 'VI')}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onQuickAction={(type) => {
          setToastMessage(`Đã mở giao diện tạo mới ${type.toUpperCase()}`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onSwitchToWebsite={onSwitchToWebsite}
      />

      {/* 2. SIDEBAR */}
      <CmsSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activePath={activePath}
        onSelectMenu={(path, title) => {
          setActivePath(path);
          setCurrentPageTitle(title);
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`transition-all duration-300 pt-4 px-4 sm:px-6 lg:px-8 pb-12 ${
          isSidebarCollapsed ? 'lg:ml-18' : 'lg:ml-60'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Toast Notification with Undo */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="ml-2 text-orange-400 hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ẩn</span>
              </button>
            </div>
          )}

          {/* Breadcrumb & Page Title */}
          <CmsBreadcrumb
            items={activePath === '/cms/dashboard' || activePath === '/cms' ? [{ label: 'Tổng quan' }] : [{ label: 'Tổng quan' }, { label: currentPageTitle }]}
            pageTitle={currentPageTitle}
            pageDescription="Bảng điều khiển trung tâm quản lý số liệu tổng hợp từ toàn bộ hệ thống CIC Technology."
            onRefresh={handleRefresh}
            onExport={() => {
              setToastMessage('Đã tạo file báo cáo XLSX cho Dashboard!');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            hideHeaderBar={activePath !== '/cms/dashboard' && activePath !== '/cms'}
          />

          {activePath === '/cms/users' ? (
            <CicUsersManager />
          ) : activePath === '/cms/permissions' ? (
            <PermissionManagement />
          ) : activePath === '/cms/history' || activePath === '/cms/logs' || activePath === '/cms/activity-logs' ? (
            <CicHistoryManager />
          ) : activePath === '/cms/static-pages' || activePath === '/cms/pages' ? (
            <StaticPagesManager />
          ) : activePath === '/cms/news' || activePath === '/cms/articles' ? (
            <NewsManager />
          ) : activePath === '/cms/events' ? (
            <EventsManager />
          ) : activePath === '/cms/email-templates' ? (
            <EmailTemplatesManager />
          ) : activePath === '/cms/banner-categories' || activePath === '/cms/banners/categories' ? (
            <BannerCategoriesManager />
          ) : activePath === '/cms/banners' ? (
            <BannersManager />
          ) : (
            <>
              {/* 3. QUICK ACTIONS ROW */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Thao tác nhanh hệ thống
              </h3>
              <span className="text-[11px] text-slate-400">Ctrl + S để lưu nhanh</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: '+ Sản phẩm mới', icon: Package, path: '/cms/products', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                { label: '+ Tin tức mới', icon: Newspaper, path: '/cms/news', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                { label: '+ Trang tĩnh mới', icon: FileText, path: '/cms/static-pages', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                { label: '+ Banner mới', icon: ImageIcon, path: '/cms/banners', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                { label: '+ Slideshow mới', icon: Sliders, path: '/cms/slideshows', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
              ].map((act, i) => {
                const IconComponent = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (act.path) {
                        setActivePath(act.path);
                        setCurrentPageTitle(act.label.replace('+ ', 'Quản lý '));
                      } else {
                        setToastMessage(`Đã chọn thao tác: ${act.label}`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }
                    }}
                    className={`px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-2xs ${act.color}`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 6 KPI STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {/* KPI 1: Published Products */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:border-orange-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Sản phẩm</span>
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {kpiStatsMock.published_products}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Đang Published</p>
              </div>
            </div>

            {/* KPI 2: Published News */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:border-orange-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Tin tức</span>
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <Newspaper className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {kpiStatsMock.published_news}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Bài viết tin tức</p>
              </div>
            </div>

            {/* KPI 3: Static Pages */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:border-purple-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Trang tĩnh</span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {kpiStatsMock.static_pages}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Trang giới thiệu / Dịch vụ</p>
              </div>
            </div>

            {/* KPI 4: Published Members */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Thành viên</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {kpiStatsMock.published_members}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Đã kích hoạt</p>
              </div>
            </div>

            {/* KPI 5: Unprocessed Contacts (With Warning Badge) */}
            <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-xl p-4 shadow-2xs hover:border-red-500 transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Tin nhắn liên hệ</span>
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">
                    {kpiStatsMock.unprocessed_contacts}
                  </span>
                  <span className="px-1.5 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 text-[10px] font-bold rounded animate-pulse">
                    Cảnh báo!
                  </span>
                </div>
                <p className="text-[11px] text-red-500 font-semibold mt-0.5">Chưa xử lý</p>
              </div>
            </div>

            {/* KPI 6: Unprocessed Product Registrations (With Warning Badge) */}
            <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 shadow-2xs hover:border-amber-500 transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                <span>Đăng ký SP</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {kpiStatsMock.unprocessed_registrations}
                  </span>
                  <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold rounded animate-pulse">
                    Chờ báo giá!
                  </span>
                </div>
                <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Chưa liên hệ</p>
              </div>
            </div>
          </div>

          {/* 5. TOOLBAR (Sticky Search, Filter, Sort, Columns, Refresh) */}
          <div className="sticky top-15 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Lọc dữ liệu các khối..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                onClick={handleRefresh}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-slate-500">
              <span className="hidden md:inline">Hiển thị dữ liệu thời gian thực</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* 6. KHỐI "CẦN XỬ LÝ" (ACTION REQUIRED BLOCKS) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Block A: Tin nhắn liên hệ mới nhất chưa xử lý */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-start space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-500/10 text-red-600 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Tin nhắn liên hệ mới
                    </h3>
                    <p className="text-[11px] text-slate-400">5 yêu cầu mới nhất chưa xử lý</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDrawerItem({ type: 'contact', data: filteredContacts[0] || contacts[0] })
                  }
                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredContacts.slice(0, 5).map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setDrawerItem({ type: 'contact', data: msg })}
                    className="py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[160px]">
                        {msg.sender_name}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.created_time.split(' ')[1]}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      {msg.subject}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{msg.sender_phone}</span>
                      <span
                        className={`px-1.5 py-0.2 font-semibold rounded ${
                          msg.status === 'unread'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : 'bg-orange-500/10 text-orange-600'
                        }`}
                      >
                        {msg.status === 'unread' ? 'Chưa đọc' : 'Đang xử lý'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Block B: Đăng ký liên hệ sản phẩm mới nhất chưa xử lý */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-start space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Đăng ký tư vấn SP
                    </h3>
                    <p className="text-[11px] text-slate-400">5 đơn đăng ký mua mới nhất</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDrawerItem({
                      type: 'registration',
                      data: filteredRegistrations[0] || registrations[0],
                    })
                  }
                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredRegistrations.slice(0, 5).map((reg) => (
                  <div
                    key={reg.id}
                    onClick={() => setDrawerItem({ type: 'registration', data: reg })}
                    className="py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[170px]">
                        {reg.company_name}
                      </span>
                      <span className="text-[10px] text-slate-400">{reg.created_time.split(' ')[1]}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 line-clamp-1">
                      {reg.product_name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{reg.customer_name}</span>
                      <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 font-semibold rounded border border-amber-500/20">
                        {reg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Block C: Bài viết & Nội dung mới cập nhật */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-start space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500/10 text-purple-600 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Nội dung mới cập nhật
                    </h3>
                    <p className="text-[11px] text-slate-400">Sản phẩm, Tin tức & Trang tĩnh vừa đăng</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDrawerItem({
                      type: 'pending',
                      data: filteredPending[0] || pendingItems[0],
                    })
                  }
                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPending.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setDrawerItem({ type: 'pending', data: item })}
                    className="py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 transition-colors cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1 flex-1 mr-2">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.2 bg-purple-500/10 text-purple-600 text-[10px] font-bold rounded uppercase">
                        {item.content_type === 'product'
                          ? 'Sản phẩm'
                          : item.content_type === 'news'
                          ? 'Tin tức'
                          : 'Trang tĩnh'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Tác giả: {item.author_name}</span>
                      <span className={`font-semibold ${item.status === 'published' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                        {item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. CHARTS SECTION (Line Chart + Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart: Lượt truy cập theo ngày (7/30 ngày) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Biểu đồ Lượt truy cập Website
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Theo dõi số lượt ghé thăm (Visits) và xem trang (Pageviews)
                  </p>
                </div>

                {/* Range Toggle Switch */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setTrafficRange('7')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      trafficRange === '7'
                        ? 'bg-orange-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    7 Ngày
                  </button>
                  <button
                    onClick={() => setTrafficRange('30')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      trafficRange === '30'
                        ? 'bg-orange-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    30 Ngày
                  </button>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trafficRange === '7' ? dailyTrafficMock : monthlyTrafficMock}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="date_label" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="visits_count"
                      name="Lượt ghé thăm (Visits)"
                      stroke="#ea580c"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#ea580c' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="page_views_count"
                      name="Lượt xem trang (Pageviews)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Nội dung tạo mới theo tuần (3 series: Tin tức, Sản phẩm, Trang tĩnh) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Thống kê Nội dung xuất bản theo tuần
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Phân bổ 3 loại nội dung: Tin tức, Sản phẩm, Trang tĩnh
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyContentStatsMock}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="week_label" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="news_count" name="Tin tức" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="product_count" name="Sản phẩm" fill="#ea580c" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="static_page_count"
                      name="Trang tĩnh"
                      fill="#a855f7"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 8. TIMELINE "HOẠT ĐỘNG GẦN ĐÂY" (10 LATEST LINES) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Lịch sử hoạt động gần đây (Audit Timeline)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ghi nhận 10 tác vụ quản trị vừa thực hiện trên toàn hệ thống
                </p>
              </div>
              <button
                onClick={() =>
                  setDrawerItem({ type: 'activity', data: activityLogs[0] })
                }
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
              >
                <span>Xem chi tiết log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setDrawerItem({ type: 'activity', data: log })}
                  className="relative pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-1 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-lg transition-colors"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-2 top-3 w-3 h-3 rounded-full bg-orange-600 border-2 border-white dark:border-slate-900 shadow-xs group-hover:scale-125 transition-transform" />

                  <div className="flex items-center gap-2.5">
                    {log.user_avatar ? (
                      <img
                        src={log.user_avatar}
                        alt={log.username}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {log.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {log.username}
                        </span>
                        <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] rounded uppercase">
                          {log.activity_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {log.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0 self-start sm:self-auto font-mono">
                    {log.created_time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>

        {/* 9. FOOTER */}
        <CmsFooter />
      </div>

      {/* COMMAND PALETTE MODAL */}
      <CmsCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={(path, label) => {
          setActivePath(path);
          setCurrentPageTitle(label);
          setToastMessage(`Đã chuyển sang: ${label}`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      {/* RIGHT DETAIL DRAWER */}
      <CmsRightDrawer
        item={drawerItem}
        onClose={() => setDrawerItem(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

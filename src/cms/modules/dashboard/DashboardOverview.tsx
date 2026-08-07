import React, { useState } from 'react';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import {
  LayoutDashboard,
  Package,
  Newspaper,
  FileText,
  Users,
  MessageSquare,
  FileCheck,
  ChevronRight,
  Sliders,
  Plus,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  Shield,
  RotateCcw,
  Globe,
  Filter,
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

import type { CmsDashboardData, CmsLocale } from '../../data/CmsDataSource';

import {
  ContactMessage,
  ProductRegistration,
  PendingContent,
  ActivityLog,
} from '../../types';

import {
  DashboardPreference,
  defaultDashboardPreference,
} from './types';

import { DashboardCustomizerDrawer } from './DashboardCustomizerDrawer';
import { ResetLayoutModal } from './ResetLayoutModal';

interface DashboardOverviewProps {
  workspaceLocale: CmsLocale;
  data?: CmsDashboardData;
  onNavigate: (path: string, title: string) => void;
  onOpenDrawerItem: (type: 'contact' | 'registration' | 'pending' | 'activity', data: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  workspaceLocale,
  data,
  onNavigate,
  onOpenDrawerItem,
}) => {
  // Preference state
  const [preference, setPreference] = useState<DashboardPreference>(defaultDashboardPreference);

  // Filter & Data States
  const [timeRange, setTimeRange] = useState<'7' | '30' | 'month' | 'year'>('7');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customizer Drawer & Reset Modal
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Lists state
  const contacts: ContactMessage[] = data?.contacts ?? [];
  const registrations: ProductRegistration[] = data?.productRegistrations ?? [];
  const pendingItems: PendingContent[] = data?.pendingContents ?? [];
  const activityLogs: ActivityLog[] = data?.activityLogs ?? [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const isWidgetVisible = (widgetId: string) => {
    const w = preference.widgets.find((item) => item.id === widgetId);
    return w ? w.visible : true;
  };

  const getWidgetOrder = (widgetId: string) => {
    const w = preference.widgets.find((item) => item.id === widgetId);
    return w ? w.order : 99;
  };

  // Sort sections by order
  const sortedWidgetIds = [...preference.widgets]
    .sort((a, b) => a.order - b.order)
    .map((w) => w.id);

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-orange-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Ẩn</span>
          </button>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <CmsPageHeader
        icon={<LayoutDashboard />}
        title="Tổng quan vận hành"
        description="Trung tâm giám sát thông số thời gian thực, tiếp nhận yêu cầu tư vấn và theo dõi nhật ký hoạt động CIC Technology"
        showStatus={true}
        actions={
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
          >
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>Tùy chỉnh giao diện</span>
          </button>
        }
      />

      {/* 2. DASHBOARD TOOLBAR */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Toolbar Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: '7', label: '7 Ngày' },
              { id: '30', label: '30 Ngày' },
              { id: 'month', label: 'Tháng này' },
              { id: 'year', label: 'Năm nay' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs whitespace-nowrap ${
                  timeRange === r.id
                    ? 'bg-orange-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            <Globe className="h-3.5 w-3.5" />
          </div>
        </div>

      </div>

      {/* DYNAMIC SECTIONS RENDERED BASED ON PREFERENCE ORDER AND VISIBILITY */}
      {!data ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <Globe className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">Chưa có dữ liệu Dashboard cho English</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Workspace EN là dataset độc lập và không sử dụng dữ liệu VI để thay thế.
          </p>
        </div>
      ) : sortedWidgetIds.map((widgetId) => {
        if (!isWidgetVisible(widgetId)) return null;

        // SECTION: QUICK ACTIONS
        if (widgetId === 'quick_actions') {
          return (
            <div
              key={widgetId}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Thao tác nhanh hệ thống
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    QUICK ACTIONS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">Phím tắt: Ctrl + K để mở Command Palette</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Sản phẩm mới', icon: Package, path: '/cms/products', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                  { label: 'Dịch vụ mới', icon: Layers, path: '/cms/services', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                  { label: 'Tin tức mới', icon: Newspaper, path: '/cms/news', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                  { label: 'Trang nội dung mới', icon: FileText, path: '/cms/static-pages', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                  { label: 'Slideshow mới', icon: Sliders, path: '/cms/slideshows', color: 'hover:border-orange-500 hover:text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300' },
                ].map((act, i) => {
                  const IconComponent = act.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => onNavigate(act.path, act.label.replace('+ ', 'Quản lý '))}
                      className={`px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:scale-[1.02] ${act.color}`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span className="truncate">{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        // SECTION: 6 KPI CARDS
        if (widgetId === 'kpi_cards') {
          return (
            <div key={widgetId} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
              {/* KPI 1: Published Products */}
              <div
                onClick={() => onNavigate('/cms/products', 'Quản lý Sản phẩm')}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-orange-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>Sản phẩm</span>
                  <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.kpi.published_products}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Đang Published</p>
                </div>
              </div>

              {/* KPI 2: Published News */}
              <div
                onClick={() => onNavigate('/cms/news', 'Quản lý Tin tức')}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-orange-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>Tin tức</span>
                  <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                    <Newspaper className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.kpi.published_news}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Bài viết tin tức</p>
                </div>
              </div>

              {/* KPI 3: Independent Static Pages */}
              <div
                onClick={() => onNavigate('/cms/static-pages', 'Quản lý Trang tĩnh')}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>Trang tĩnh</span>
                  <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.kpi.static_pages}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Trang giới thiệu / Chính sách</p>
                </div>
              </div>

              {/* KPI 4: Active Members */}
              <div
                onClick={() => onNavigate('/cms/users', 'Quản lý Người dùng')}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>Thành viên</span>
                  <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.kpi.published_members}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Đã kích hoạt</p>
                </div>
              </div>

              {/* KPI 5: Unprocessed Contact Messages */}
              <div
                onClick={() => onNavigate('/cms/contacts', 'Liên hệ & Khách hàng')}
                className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 shadow-xs hover:border-red-500 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>Tin nhắn liên hệ</span>
                  <div className="p-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-red-600 dark:text-red-400">
                      {data.kpi.unprocessed_contacts}
                    </span>
                    <span className="px-1.5 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 text-[10px] font-bold rounded animate-pulse">
                      Chưa xử lý!
                    </span>
                  </div>
                  <p className="text-[11px] text-red-500 font-semibold mt-0.5">Tin nhắn chưa xem</p>
                </div>
              </div>

              {/* KPI 6: Unprocessed Product Consultation Requests */}
              <div
                onClick={() => onNavigate('/cms/contacts', 'Liên hệ & Khách hàng')}
                className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 shadow-xs hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>Yêu cầu tư vấn SP</span>
                  <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <FileCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {data.kpi.unprocessed_registrations}
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold rounded animate-pulse">
                      Chờ báo giá!
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Yêu cầu tư vấn sản phẩm</p>
                </div>
              </div>
            </div>
          );
        }

        // SECTION: ACTION REQUIRED BLOCKS (CẦN XỬ LÝ NGAY)
        if (widgetId === 'action_required') {
          return (
            <div key={widgetId} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Block A: Tin nhắn liên hệ mới nhất chưa xử lý */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-red-500/10 text-red-600 rounded-xl">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        Tin nhắn liên hệ mới
                      </h3>
                      <p className="text-[11px] text-slate-400">5 yêu cầu mới nhất cần phản hồi</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/cms/contacts', 'Liên hệ & Khách hàng')}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
                  {contacts.slice(0, 5).map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => onOpenDrawerItem('contact', msg)}
                      className={`py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer space-y-1 group ${
                        preference.density === 'compact' ? 'py-1.5' : 'py-3'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[170px]">
                          {msg.sender_name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{msg.created_time.split(' ')[1]}</span>
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

              {/* Block B: Yêu cầu tư vấn sản phẩm mới nhất */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        Yêu cầu tư vấn sản phẩm
                      </h3>
                      <p className="text-[11px] text-slate-400">5 đăng ký nhận báo giá mới nhất</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/cms/contacts', 'Liên hệ & Khách hàng')}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
                  {registrations.slice(0, 5).map((reg) => (
                    <div
                      key={reg.id}
                      onClick={() => onOpenDrawerItem('registration', reg)}
                      className={`py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer space-y-1 group ${
                        preference.density === 'compact' ? 'py-1.5' : 'py-3'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[170px]">
                          {reg.company_name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{reg.created_time.split(' ')[1]}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 line-clamp-1">
                        {reg.product_name}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{reg.customer_name}</span>
                        <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 font-semibold rounded border border-amber-500/20">
                          {reg.status === 'pending' ? 'Chờ báo giá' : 'Đã báo giá'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Block C: Nội dung mới cập nhật */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        Nội dung mới cập nhật
                      </h3>
                      <p className="text-[11px] text-slate-400">Sản phẩm, Tin tức & Trang tĩnh vừa tạo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/cms/news', 'Quản lý Tin tức')}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
                  {pendingItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenDrawerItem('pending', item)}
                      className={`py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer space-y-1 group ${
                        preference.density === 'compact' ? 'py-1.5' : 'py-3'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1 flex-1 mr-2">
                          {item.title}
                        </span>
                        <span className="px-1.5 py-0.2 bg-purple-500/10 text-purple-600 text-[10px] font-bold rounded uppercase shrink-0">
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
          );
        }

        // SECTION: ANALYTICS CHARTS (LINE CHART & BAR CHART)
        if (widgetId === 'analytics_charts') {
          return (
            <div key={widgetId} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart: Lượt truy cập Website */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Biểu đồ Lượt truy cập Website
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Theo dõi số lượt ghé thăm (Visits) và xem trang (Pageviews)
                    </p>
                  </div>

                  {/* Range Switch */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setTimeRange('7')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                        timeRange === '7'
                          ? 'bg-orange-600 text-white font-bold shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      7 Ngày
                    </button>
                    <button
                      onClick={() => setTimeRange('30')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                        timeRange === '30'
                          ? 'bg-orange-600 text-white font-bold shadow-2xs'
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
                      data={timeRange === '7' ? data.traffic7Days : data.traffic30Days}
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

              {/* Bar Chart: Nội dung xuất bản theo tuần */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
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
                      data={data.weeklyContent}
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
          );
        }

        // SECTION: AUDIT ACTIVITY TIMELINE
        if (widgetId === 'activity_timeline') {
          return (
            <div
              key={widgetId}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Lịch sử hoạt động gần đây (Audit Timeline)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Ghi nhận 10 tác vụ quản trị vừa thực hiện trên toàn hệ thống
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('/cms/activity-logs', 'Nhật ký Hoạt động (Audit Logs)')}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Xem chi tiết log</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => onOpenDrawerItem('activity', log)}
                    className="relative pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-1 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2.5 rounded-xl transition-colors"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-2 top-4 w-3 h-3 rounded-full bg-orange-600 border-2 border-white dark:border-slate-900 shadow-xs group-hover:scale-125 transition-transform" />

                    <div className="flex items-center gap-3">
                      {log.user_avatar ? (
                        <img
                          src={log.user_avatar}
                          alt={log.username}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {log.username[0].toUpperCase()}
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
          );
        }

        return null;
      })}

      {/* DRAWERS & MODALS */}
      <DashboardCustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        preference={preference}
        onSavePreference={(newPref) => {
          setPreference(newPref);
          showToast('Đã lưu cấu hình Tùy chỉnh Dashboard thành công!');
        }}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      <ResetLayoutModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={() => {
          setPreference(defaultDashboardPreference);
          showToast('Đã khôi phục Bố cục Dashboard Mặc định!');
        }}
      />
    </div>
  );
};

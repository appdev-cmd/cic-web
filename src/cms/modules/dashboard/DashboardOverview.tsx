'use client';

import React, { useState, useTransition } from 'react';
import {
  Calendar,
  CheckCircle2,
  Globe,
  Loader2,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';

import type { CmsDashboardData, CmsLocale } from '../../data/CmsDataSource';
import type { DashboardOperationsMetrics, DashboardTimeFilterType } from '@/cms/types';
import { getCmsDictionary } from '../../i18n/cmsDictionary';

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

import { WebsiteOperationsHero } from './components/WebsiteOperationsHero';
import { WebsiteHealthDrawer } from './components/WebsiteHealthDrawer';
import { ActionableQueue } from './components/ActionableQueue';
import { CustomerRequestsLivePanel } from './components/CustomerRequestsLivePanel';
import { PopularContentPanel } from './components/PopularContentPanel';
import { CompactContentStrip } from './components/CompactContentStrip';
import { DashboardActivityTimeline } from './components/DashboardActivityTimeline';
import { getDashboardOperationsMetricsAction } from '@/features/dashboard/server/actions';

const STORAGE_KEY = 'cic_cms_dashboard_pref_v2';

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
  const dict = getCmsDictionary(workspaceLocale);
  const t = dict.dashboard;
  const isEn = workspaceLocale === 'en';

  // Global Time Filter State
  const [currentFilter, setCurrentFilter] = useState<DashboardTimeFilterType>(
    data?.operationsMetrics?.timeFilter?.type ?? '7d'
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const sevenDaysAgoStr = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [customFrom, setCustomFrom] = useState(sevenDaysAgoStr);
  const [customTo, setCustomTo] = useState(todayStr);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Synchronized Operations Metrics across the entire dashboard
  const [operationsMetrics, setOperationsMetrics] = useState<DashboardOperationsMetrics>(() => {
    if (data?.operationsMetrics) return data.operationsMetrics;

    const totalViews = data?.totalViews ?? 0;
    const leadsToday = data?.todayRequestsCount ?? 0;
    const unprocessedQuotes = data?.kpi?.unprocessed_registrations ?? 0;
    const unprocessedContacts = data?.kpi?.unprocessed_contacts ?? 0;
    const totalBacklog = unprocessedQuotes + unprocessedContacts;

    return {
      timeFilter: {
        type: '7d',
        label: isEn ? 'Past 7 Days' : '7 ngày qua',
        fromDate: '22/09/2026',
        toDate: '28/09/2026',
        prevFromDate: '15/09/2026',
        prevToDate: '21/09/2026',
      },
      traffic: {
        current: 0,
        previous: 0,
        percentChange: null,
        trend: 'neutral',
        formattedChange: '--',
        cumulativeHits: totalViews,
        activityInteractions: 0,
        note: isEn
          ? 'Cumulative article views in DB. Connect GA4 for per-day visitor sessions.'
          : 'Lượt đọc bài viết tích lũy trong DB. Cần kết nối GA4 để đồng bộ phiên theo ngày.',
      },
      customerRequests: {
        current: leadsToday,
        previous: 0,
        percentChange: null,
        trend: 'neutral',
        formattedChange: '--',
        breakdown: {
          productQuotes: { current: unprocessedQuotes, previous: 0 },
          contacts: { current: unprocessedContacts, previous: 0 },
        },
      },
      publishedContent: {
        current: (data?.kpi?.published_news ?? 0) + (data?.kpi?.published_products ?? 0),
        previous: 0,
        percentChange: null,
        trend: 'neutral',
        formattedChange: '--',
        breakdown: {
          news: { current: data?.kpi?.published_news ?? 0, previous: 0 },
          products: { current: data?.kpi?.published_products ?? 0, previous: 0 },
          events: { current: data?.kpi?.upcoming_events ?? 0, previous: 0 },
        },
      },
      unprocessedBacklog: {
        current: totalBacklog,
        previous: 0,
        percentChange: null,
        trend: 'neutral',
        formattedChange: '--',
        totalBacklog,
        currentPeriodUnprocessed: 0,
      },
      trendSeries: (data?.operationsTrend ?? []).map((item) => ({
        date: item.date_label,
        requests: item.requests_count,
        contentUpdates: item.content_updates_count,
        traffic: 0,
      })),
      popularContentCumulative: data?.popularContent ?? [],
      popularContentInPeriod: [],
      operationalInsight: isEn
        ? 'Website operations telemetry loaded from PostgreSQL.'
        : 'Dữ liệu vận hành website được truy vấn trực tiếp từ PostgreSQL.',
    };
  });

  const [isPending, startTransition] = useTransition();

  const handleSelectFilter = (filterType: DashboardTimeFilterType) => {
    if (filterType === 'custom') {
      setIsCustomOpen((prev) => !prev);
      return;
    }
    setIsCustomOpen(false);
    setCurrentFilter(filterType);

    startTransition(async () => {
      try {
        const res = await getDashboardOperationsMetricsAction({
          filterType,
          locale: workspaceLocale,
        });
        setOperationsMetrics(res);
      } catch (err) {
        console.error('Failed to sync metrics for filter:', err);
      }
    });
  };

  const handleApplyCustomFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFrom || !customTo) return;
    setCurrentFilter('custom');

    startTransition(async () => {
      try {
        const res = await getDashboardOperationsMetricsAction({
          filterType: 'custom',
          fromDate: customFrom,
          toDate: customTo,
          locale: workspaceLocale,
        });
        setOperationsMetrics(res);
      } catch (err) {
        console.error('Failed to sync custom metrics:', err);
      }
    });
  };

  // Preference state with localStorage hydration & automatic version upgrade
  const [preference, setPreference] = useState<DashboardPreference>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.widgets)) {
            const hasHero = parsed.widgets.some((w: any) => w.id === 'operations_hero');
            if (hasHero) {
              return parsed as DashboardPreference;
            }
          }
        }
      } catch {
        // ignore localStorage error
      }
    }
    return defaultDashboardPreference;
  });

  // Health Drawer state
  const [isHealthDrawerOpen, setIsHealthDrawerOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customizer Drawer & Reset Modal
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Lists state
  const contacts: ContactMessage[] = data?.contacts ?? [];
  const registrations: ProductRegistration[] = data?.productRegistrations ?? [];
  const activityLogs: ActivityLog[] = data?.activityLogs ?? [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSavePreference = (newPref: DashboardPreference) => {
    setPreference(newPref);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPref));
      } catch {
        // ignore
      }
    }
    showToast(isEn ? 'Dashboard layout saved!' : 'Đã lưu cấu hình Tùy chỉnh Dashboard thành công!');
  };

  const handleResetPreference = () => {
    setPreference(defaultDashboardPreference);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    showToast(isEn ? 'Reset to default dashboard layout!' : 'Đã khôi phục Bố cục Dashboard Mặc định!');
  };

  const isWidgetVisible = (widgetId: string) => {
    const w = preference.widgets.find((item) => item.id === widgetId);
    return w ? w.visible : true;
  };

  // Sort sections by order
  const sortedWidgetIds = [...preference.widgets]
    .sort((a, b) => a.order - b.order)
    .map((w) => w.id);

  const healthScore = data?.health?.score ?? 80;
  const attentionIssues = data?.health?.attentionCount ?? 0;
  const criticalIssues = data?.health?.criticalCount ?? 0;
  const isHealthy = healthScore >= 90;
  const isAttention = healthScore >= 75 && healthScore < 90;

  const filterOptions: Array<{ type: DashboardTimeFilterType; label: string }> = [
    { type: 'today', label: isEn ? 'Today' : 'Hôm nay' },
    { type: '7d', label: isEn ? '7 Days' : '7 ngày' },
    { type: '30d', label: isEn ? '30 Days' : '30 ngày' },
    { type: 'month', label: isEn ? 'This Month' : 'Tháng này' },
    { type: 'custom', label: isEn ? 'Custom' : 'Tùy chọn' },
  ];

  return (
    <div className="space-y-5">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-xl border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-orange-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isEn ? 'Dismiss' : 'Ẩn'}</span>
          </button>
        </div>
      )}

      {/* 1. TOP HEADER: TITLE + LEAN OPERATIONAL HEALTH STATUS + CUSTOMIZE ACTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEn ? 'Website Operations Center' : 'Trung Tâm Vận Hành Website'}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              CIC CMS
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Telemetry & operational health: visitor traffic, customer requests, catalog queue, and content performance.'
              : 'Giám sát vận hành tập trung: lưu lượng, yêu cầu khách hàng, hàng đợi cần xử lý và xuất bản nội dung.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto flex-wrap">
          {/* Requirement 7: Lean Operational Health Status Pill (No technical jargon, no giant meter) */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200/80 dark:border-slate-700 text-xs shadow-2xs">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isHealthy
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60'
                  : isAttention
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isHealthy ? 'bg-emerald-500' : isAttention ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
              {isHealthy
                ? (isEn ? 'Healthy' : 'Bình thường')
                : isAttention
                ? (isEn ? 'Attention' : 'Cần chú ý')
                : (isEn ? 'Alert' : 'Có sự cố')}
            </span>

            <button
              type="button"
              onClick={() => setIsHealthDrawerOpen(true)}
              className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>
                {attentionIssues > 0 || criticalIssues > 0
                  ? `${attentionIssues + criticalIssues} ${isEn ? 'issues' : 'việc cần tối ưu'}`
                  : (isEn ? 'Technical diagnostics' : 'Chi tiết kỹ thuật')}
              </span>
              <span>→</span>
            </button>
          </div>

          {/* Customize Layout Button */}
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{t.customizeLayout}</span>
          </button>
        </div>
      </header>

      {/* 2. GLOBAL TIME FILTER BAR (Synchronizes 4 KPIs, Main Chart, and Top Content) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
            {filterOptions.map((opt) => {
              const isActive = currentFilter === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleSelectFilter(opt.type)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.type === 'custom' && <Calendar className="w-3 h-3 shrink-0" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {isPending && (
            <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium px-2 py-0.5 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isEn ? 'Syncing...' : 'Đang cập nhật...'}</span>
            </div>
          )}
        </div>

        {/* Date Period Indicator & Comparison */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 self-start md:self-auto">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold font-mono">
              {operationsMetrics.timeFilter.fromDate} – {operationsMetrics.timeFilter.toDate}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span>{isEn ? 'Vs previous:' : 'So với kỳ trước:'}</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              {operationsMetrics.timeFilter.prevFromDate} – {operationsMetrics.timeFilter.prevToDate}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Custom Date Range Inputs */}
      {isCustomOpen && (
        <form
          onSubmit={handleApplyCustomFilter}
          className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3.5 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-1 text-xs"
        >
          <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{isEn ? 'Select Custom Date Range:' : 'Chọn khoảng thời gian tùy chọn:'}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">{isEn ? 'From:' : 'Từ ngày:'}</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">{isEn ? 'To:' : 'Đến ngày:'}</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isEn ? 'Apply Range' : 'Áp dụng'}
            </button>

            <button
              type="button"
              onClick={() => setIsCustomOpen(false)}
              className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md text-xs transition-colors cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Hủy'}
            </button>
          </div>
        </form>
      )}

      {/* DYNAMIC SECTIONS RENDERED BASED ON PREFERENCE ORDER AND VISIBILITY */}
      {!data ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <Globe className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{t.noDataEn}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.noDataEnDesc}</p>
        </div>
      ) : (
        sortedWidgetIds.map((widgetId) => {
          if (!isWidgetVisible(widgetId)) return null;

          // SECTION 1: WEBSITE OPERATIONS HERO (VISUAL CHÍNH: 4 Business KPIs + Large Chart + Deterministic Insight)
          if (widgetId === 'operations_hero' || widgetId === 'analytics_charts') {
            return (
              <WebsiteOperationsHero
                key={widgetId}
                data={data}
                metrics={operationsMetrics}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
              />
            );
          }

          // SECTION 2: PRIORITIZED ACTION TASK QUEUE (Khu vực quan trọng thứ 2)
          if (widgetId === 'actionable_queue' || widgetId === 'quick_actions') {
            return (
              <ActionableQueue
                key={widgetId}
                data={data}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
                onOpenHealthDrawer={() => setIsHealthDrawerOpen(true)}
              />
            );
          }

          // SECTION 3: 2 CARD SONG SONG (Yêu cầu khách hàng mới nhất + Nội dung nổi bật)
          if (widgetId === 'requests_and_popular' || widgetId === 'action_required') {
            return (
              <div key={widgetId} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <CustomerRequestsLivePanel
                    contacts={contacts}
                    registrations={registrations}
                    workspaceLocale={workspaceLocale}
                    onNavigate={onNavigate}
                    onOpenDrawerItem={onOpenDrawerItem}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PopularContentPanel
                    popularContent={data.popularContent}
                    popularContentInPeriod={operationsMetrics.popularContentInPeriod}
                    popularContentCumulative={operationsMetrics.popularContentCumulative}
                    workspaceLocale={workspaceLocale}
                    onNavigate={onNavigate}
                  />
                </div>
              </div>
            );
          }

          // SECTION 4: RECENT ACTIVITY TIMELINE (Hoạt động gần đây - Compact, 3-4 natural items without UUIDs)
          if (widgetId === 'activity_timeline') {
            return (
              <DashboardActivityTimeline
                key={widgetId}
                activityLogs={activityLogs}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
                onOpenDrawerItem={onOpenDrawerItem}
              />
            );
          }

          // SECTION 5: COMPACT CONTENT INVENTORY TOTALS (Low visual priority, thin bottom strip)
          if (widgetId === 'content_totals' || widgetId === 'kpi_cards') {
            return (
              <CompactContentStrip
                key={widgetId}
                kpi={data.kpi}
                workspaceLocale={workspaceLocale}
                onNavigate={onNavigate}
              />
            );
          }

          return null;
        })
      )}

      {/* DRAWERS & MODALS */}
      <WebsiteHealthDrawer
        isOpen={isHealthDrawerOpen}
        onClose={() => setIsHealthDrawerOpen(false)}
        health={data?.health}
        workspaceLocale={workspaceLocale}
        onNavigate={onNavigate}
      />

      <DashboardCustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        preference={preference}
        onSavePreference={handleSavePreference}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        workspaceLocale={workspaceLocale}
      />

      <ResetLayoutModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleResetPreference}
      />
    </div>
  );
};

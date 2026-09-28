'use client';

import React, { useState, useTransition } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  Loader2,
  Mail,
  Minus,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import type { CmsDashboardData, CmsLocale } from '../../../data/CmsDataSource';
import type { DashboardOperationsMetrics, DashboardTimeFilterType } from '@/cms/types';
import { getDashboardOperationsMetricsAction } from '@/features/dashboard/server/actions';

interface WebsiteOperationsHeroProps {
  data: CmsDashboardData;
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
  onOpenHealthDrawer: () => void;
}

export const WebsiteOperationsHero: React.FC<WebsiteOperationsHeroProps> = ({
  data,
  workspaceLocale,
  onNavigate,
  onOpenHealthDrawer,
}) => {
  const isEn = workspaceLocale === 'en';
  const score = data.health?.score ?? 80;
  const dbLatency = data.health?.dbLatencyMs ?? 8;

  // Filter state
  const [currentFilter, setCurrentFilter] = useState<DashboardTimeFilterType>(
    data.operationsMetrics?.timeFilter?.type ?? '7d'
  );

  // Default dates for custom range (7 days back to today)
  const todayStr = new Date().toISOString().split('T')[0];
  const sevenDaysAgoStr = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [customFrom, setCustomFrom] = useState(sevenDaysAgoStr);
  const [customTo, setCustomTo] = useState(todayStr);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Breakdown toggle for Customer Requests KPI
  const [showRequestsBreakdown, setShowRequestsBreakdown] = useState(false);

  // Series visibility toggles for Chart
  const [visibleSeries, setVisibleSeries] = useState({
    requests: true,
    contentUpdates: true,
    traffic: true,
  });

  // Local operational metrics state
  const [metrics, setMetrics] = useState<DashboardOperationsMetrics>(() => {
    if (data.operationsMetrics) {
      return data.operationsMetrics;
    }
    // Fallback if not populated
    const totalViews = data.totalViews ?? 0;
    const leadsToday = data.todayRequestsCount ?? 0;
    const unprocessedQuotes = data.kpi?.unprocessed_registrations ?? 0;
    const unprocessedContacts = data.kpi?.unprocessed_contacts ?? 0;
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
        current: (data.kpi?.published_news ?? 0) + (data.kpi?.published_products ?? 0),
        previous: 0,
        percentChange: null,
        trend: 'neutral',
        formattedChange: '--',
        breakdown: {
          news: { current: data.kpi?.published_news ?? 0, previous: 0 },
          products: { current: data.kpi?.published_products ?? 0, previous: 0 },
          events: { current: data.kpi?.upcoming_events ?? 0, previous: 0 },
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
      trendSeries: (data.operationsTrend ?? []).map((t) => ({
        date: t.date_label,
        requests: t.requests_count,
        contentUpdates: t.content_updates_count,
        traffic: 0,
      })),
      operationalInsight: isEn
        ? 'Website operations telemetry loaded from PostgreSQL.'
        : 'Dữ liệu vận hành website được truy vấn trực tiếp từ PostgreSQL.',
    };
  });

  const [isPending, startTransition] = useTransition();

  const handleSelectFilter = (filterType: DashboardTimeFilterType) => {
    if (filterType === 'custom') {
      setIsCustomOpen(true);
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
        setMetrics(res);
      } catch (err) {
        console.error('Failed to fetch filtered metrics:', err);
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
        setMetrics(res);
      } catch (err) {
        console.error('Failed to fetch custom metrics:', err);
      }
    });
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(isEn ? 'en-US' : 'vi-VN').format(num);
  };

  // Semantic latency styling for right Operational Health panel
  const getLatencyMeta = (latency: number) => {
    if (latency < 100) return { label: isEn ? 'Optimal (<100ms)' : 'Phản hồi tối ưu', text: 'text-emerald-600 dark:text-emerald-400' };
    if (latency < 1000) return { label: isEn ? 'Normal' : 'Bình thường', text: 'text-slate-700 dark:text-slate-300' };
    return { label: isEn ? 'High Latency' : 'Độ trễ cao', text: 'text-amber-600 dark:text-amber-400' };
  };

  const latencyMeta = getLatencyMeta(dbLatency);

  const getScoreMeta = (sc: number) => {
    if (sc >= 90) {
      return {
        label: isEn ? 'Optimal' : 'Rất tốt',
        badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
        text: 'text-emerald-600 dark:text-emerald-400',
        bar: 'bg-emerald-500',
      };
    }
    if (sc >= 75) {
      return {
        label: isEn ? 'Needs Attention' : 'Cần chú ý',
        badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
        text: 'text-amber-600 dark:text-amber-400',
        bar: 'bg-amber-500',
      };
    }
    return {
      label: isEn ? 'Action Required' : 'Cần xử lý',
      badge: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60',
      text: 'text-red-600 dark:text-red-400',
      bar: 'bg-red-500',
    };
  };

  const scoreMeta = getScoreMeta(score);

  // Diagnostic checklist numbers from real DB items
  const prodMissingSeo = data.health?.items?.find((i) => i.id === 'product_seo')?.count ?? 0;
  const prodMissingImg = data.health?.items?.find((i) => i.id === 'product_media')?.count ?? 0;
  const newsMissingSeo = data.health?.items?.find((i) => i.id === 'news_seo')?.count ?? 0;
  const totalBacklog = metrics.unprocessedBacklog.totalBacklog;

  // Render Delta Pill
  const renderDeltaBadge = (delta: { percentChange: number | null; formattedChange: string; trend: 'up' | 'down' | 'neutral' }, invertColor = false) => {
    if (delta.percentChange === null || delta.formattedChange === '--') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
          <Minus className="w-2.5 h-2.5" />
          <span>--</span>
        </span>
      );
    }

    const isPositive = delta.percentChange > 0;
    const isZero = delta.percentChange === 0;

    let badgeClass = '';
    let Icon = Minus;

    if (isZero) {
      badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/70 dark:border-slate-700';
      Icon = Minus;
    } else if (isPositive) {
      badgeClass = invertColor
        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/70'
        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/70';
      Icon = ArrowUpRight;
    } else {
      badgeClass = invertColor
        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/70'
        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/70';
      Icon = ArrowDownRight;
    }

    return (
      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${badgeClass} tabular-nums`}>
        <Icon className="w-2.5 h-2.5 shrink-0" />
        <span>{delta.formattedChange}</span>
      </span>
    );
  };

  const filterOptions: Array<{ type: DashboardTimeFilterType; label: string }> = [
    { type: 'today', label: isEn ? 'Today' : 'Hôm nay' },
    { type: '7d', label: isEn ? '7 Days' : '7 ngày' },
    { type: '30d', label: isEn ? '30 Days' : '30 ngày' },
    { type: 'month', label: isEn ? 'This Month' : 'Tháng này' },
    { type: 'custom', label: isEn ? 'Custom' : 'Tùy chọn' },
  ];

  return (
    <div className="space-y-3">
      {/* 1. GLOBAL TIME FILTER BAR (At Top of Dashboard) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Left: Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
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

        {/* Right: Period & Comparison Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 self-start md:self-auto">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold font-mono">
              {metrics.timeFilter.fromDate} – {metrics.timeFilter.toDate}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span>{isEn ? 'Vs previous:' : 'So với kỳ trước:'}</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              {metrics.timeFilter.prevFromDate} – {metrics.timeFilter.prevToDate}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Custom Range Picker Form */}
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

      {/* 2. MAIN OPERATIONS SECTION (65% Business Operations + 35% Sức khỏe vận hành) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT SURFACE: Live Operational Surface (65% / 8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-5 shadow-2xs">
          {/* Header of Hero */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="absolute -inset-0.5 rounded-full bg-emerald-500/30"></span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {isEn ? 'Website Operations' : 'Trung Tâm Vận Hành'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {metrics.timeFilter.label}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto px-2 py-0.5 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200/70 dark:border-slate-700/60 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{isEn ? 'Auto-synced with DB' : 'Đồng bộ trực tiếp PostgreSQL'}</span>
            </div>
          </div>

          {/* 4 STANDARDIZED CORE KPIs (Segmented Metric Strip - NO TECHNICAL JARGON) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 border-y border-slate-100 dark:border-slate-800/80 py-3 sm:py-2">
            {/* KPI 1: Lượt truy cập / Views */}
            <div
              onClick={() => onNavigate('/cms/news', isEn ? 'News & Content' : 'Quản lý Tin tức')}
              className="p-2 sm:px-3 sm:py-1 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {isEn ? 'Traffic & Reads' : 'Lượt truy cập'}
                  </span>
                  <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700">
                    {isEn ? 'Cumulative' : 'Tích lũy'}
                  </span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">
                  {formatNumber(metrics.traffic.cumulativeHits)}
                </div>
              </div>
              <div className="mt-1 text-[10px] text-slate-400 leading-tight">
                <span>{isEn ? 'Reads logged · GA4 integration ready' : 'Lượt đọc bài viết (Chờ kết nối GA4)'}</span>
              </div>
            </div>

            {/* KPI 2: Yêu cầu khách hàng (Báo giá + Liên hệ, có breakdown) */}
            <div
              onClick={() => onNavigate('/cms/customer-requests', isEn ? 'Customer Requests' : 'Yêu cầu khách hàng')}
              className="p-2 sm:px-3 sm:py-1 cursor-pointer group hover:bg-orange-50/40 dark:hover:bg-orange-950/20 rounded-lg transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    {isEn ? 'Inquiries' : 'Yêu cầu KH'}
                  </span>
                  {renderDeltaBadge(metrics.customerRequests)}
                </div>
                <div className="text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-400 tabular-nums mt-1">
                  {formatNumber(metrics.customerRequests.current)}
                </div>
              </div>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRequestsBreakdown((prev) => !prev);
                  }}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-0.5 cursor-pointer"
                >
                  <span>
                    {isEn ? 'Quotes:' : 'Báo giá:'}{' '}
                    <strong className="text-slate-700 dark:text-slate-300 font-mono">
                      {metrics.customerRequests.breakdown.productQuotes.current}
                    </strong>{' '}
                    · {isEn ? 'Contact:' : 'Liên hệ:'}{' '}
                    <strong className="text-slate-700 dark:text-slate-300 font-mono">
                      {metrics.customerRequests.breakdown.contacts.current}
                    </strong>
                  </span>
                  {showRequestsBreakdown ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                </button>
              </div>
            </div>

            {/* KPI 3: Nội dung xuất bản */}
            <div
              onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
              className="p-2 sm:px-3 sm:py-1 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {isEn ? 'Published' : 'Nội dung xuất bản'}
                  </span>
                  {renderDeltaBadge(metrics.publishedContent)}
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">
                  {formatNumber(metrics.publishedContent.current)}
                </div>
              </div>
              <div className="mt-1 text-[10px] text-slate-400 truncate">
                <span>
                  {isEn ? 'News:' : 'Tin:'} {metrics.publishedContent.breakdown.news.current} · {isEn ? 'Prod:' : 'SP:'} {metrics.publishedContent.breakdown.products.current} · {isEn ? 'Event:' : 'SK:'} {metrics.publishedContent.breakdown.events.current}
                </span>
              </div>
            </div>

            {/* KPI 4: Yêu cầu chờ xử lý (SLA Queue / Backlog thực tế từ DB) */}
            <div
              onClick={() => onNavigate('/cms/customer-requests?tab=registrations', isEn ? 'Customer Requests' : 'Yêu cầu khách hàng')}
              className="p-2 sm:px-3 sm:py-1 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {isEn ? 'Pending Backlog' : 'Chờ xử lý'}
                  </span>
                  {renderDeltaBadge(metrics.unprocessedBacklog, true)}
                </div>
                <div className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400 tabular-nums mt-1">
                  {formatNumber(totalBacklog)}
                </div>
              </div>
              <div className="mt-1 text-[10px] text-slate-400 truncate">
                <span>
                  {metrics.unprocessedBacklog.currentPeriodUnprocessed > 0
                    ? `+${metrics.unprocessedBacklog.currentPeriodUnprocessed} ${isEn ? 'new in period' : 'mới trong kỳ'}`
                    : (isEn ? 'SLA Queue awaiting review' : 'Hàng đợi SLA chưa duyệt')}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Strip for Customer Requests (When Expanded) */}
          {showRequestsBreakdown && (
            <div className="bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-800/60 rounded-lg p-2.5 px-3 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">{isEn ? 'Product Quotes:' : 'Báo giá sản phẩm:'}</span>{' '}
                  <strong className="text-orange-700 dark:text-orange-400 font-mono font-bold">
                    {metrics.customerRequests.breakdown.productQuotes.current}
                  </strong>{' '}
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({isEn ? 'prev' : 'kỳ trước'}: {metrics.customerRequests.breakdown.productQuotes.previous})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">{isEn ? 'Contact Inquiries:' : 'Tin nhắn liên hệ:'}</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200 font-mono font-bold">
                    {metrics.customerRequests.breakdown.contacts.current}
                  </strong>{' '}
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({isEn ? 'prev' : 'kỳ trước'}: {metrics.customerRequests.breakdown.contacts.previous})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/cms/customer-requests', isEn ? 'Customer Requests' : 'Yêu cầu khách hàng')}
                className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{isEn ? 'Open Request Center →' : 'Đi tới quản lý yêu cầu →'}</span>
              </button>
            </div>
          )}

          {/* 3. UPGRADED "XU HƯỚNG HOẠT ĐỘNG" CHART (Dual Y-Axis, No Flattening, Interactive Toggles) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {isEn ? 'Operations & Engagement Trends' : 'Xu hướng hoạt động & Tương tác'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isEn ? 'Synchronized with selected period' : 'Dữ liệu đồng bộ theo kỳ đã chọn'}
                </div>
              </div>

              {/* Series Visibility Toggles to Prevent Scale Flattening */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <button
                  type="button"
                  onClick={() => setVisibleSeries((s) => ({ ...s, requests: !s.requests }))}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                    visibleSeries.requests
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/60'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through'
                  }`}
                >
                  <span className="w-2 h-2 rounded-xs bg-orange-600 inline-block"></span>
                  <span>{isEn ? 'Requests' : 'Yêu cầu KH'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibleSeries((s) => ({ ...s, contentUpdates: !s.contentUpdates }))}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                    visibleSeries.contentUpdates
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through'
                  }`}
                >
                  <span className="w-2 h-2 rounded-xs bg-sky-600 inline-block"></span>
                  <span>{isEn ? 'Content' : 'Nội dung'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibleSeries((s) => ({ ...s, traffic: !s.traffic }))}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                    visibleSeries.traffic
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through'
                  }`}
                >
                  <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block"></span>
                  <span>{isEn ? 'Interactions' : 'Lượt tương tác'}</span>
                </button>
              </div>
            </div>

            {/* Recharts Area Container with Left (Requests/Content) and Right (Traffic) Y-Axes */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.trendSeries} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="opRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="opContent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="opTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    tickLine={false}
                  />
                  {/* Left Y Axis for Business Actions (Requests & Content Updates) */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  {/* Right Y Axis for Traffic / System Interactions */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#10b981' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    hide={!visibleSeries.traffic}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900/95 backdrop-blur-xs text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-700/80 min-w-44">
                            <p className="font-semibold text-slate-300 mb-1.5 border-b border-slate-700/60 pb-1">
                              {label}
                            </p>
                            <div className="space-y-1 font-mono text-[11px]">
                              {payload.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className="w-2 h-2 rounded-full inline-block"
                                      style={{ backgroundColor: entry.color }}
                                    ></span>
                                    <span className="font-sans text-slate-300">{entry.name}:</span>
                                  </div>
                                  <span className="font-bold">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {visibleSeries.requests && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="requests"
                      stroke="#ea580c"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#opRequests)"
                      name={isEn ? 'Customer Inquiries' : 'Yêu cầu KH'}
                    />
                  )}
                  {visibleSeries.contentUpdates && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="contentUpdates"
                      stroke="#0284c7"
                      strokeWidth={1.8}
                      fillOpacity={1}
                      fill="url(#opContent)"
                      name={isEn ? 'Published Content' : 'Nội dung xuất bản'}
                    />
                  )}
                  {visibleSeries.traffic && (
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="traffic"
                      stroke="#10b981"
                      strokeWidth={1.6}
                      strokeDasharray="3 3"
                      fillOpacity={1}
                      fill="url(#opTraffic)"
                      name={isEn ? 'System Interactions' : 'Lượt tương tác'}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. DETERMINISTIC OPERATIONAL INSIGHT LINE (Beneath Chart) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2.5 px-3.5 flex items-center justify-between gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <p className="truncate font-medium">
                {metrics.operationalInsight}
              </p>
            </div>

            <span className="shrink-0 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 text-slate-500 dark:text-slate-300 hidden sm:inline-block">
              {isEn ? 'Live Telemetry' : 'Dữ liệu thực'}
            </span>
          </div>
        </div>

        {/* RIGHT SURFACE: Website Health (Operational Health Diagnostic Panel - 35% / 4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs">
          <div>
            {/* Health Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                  {isEn ? 'Operational Health' : 'Sức Khỏe Vận Hành'}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {isEn ? 'Technical diagnostics & SLA benchmarks' : 'Chẩn đoán kỹ thuật & chuẩn SLA'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${scoreMeta.badge}`}>
                {scoreMeta.label}
              </span>
            </div>

            {/* Calibrated Meter (ONLY PLACE WITH THE NUMERIC SCORE) */}
            <div className="my-3 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold tracking-tight tabular-nums ${scoreMeta.text}`}>
                    {score}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    / 100
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {score >= 90
                    ? (isEn ? 'Healthy operations' : 'Vận hành tối ưu')
                    : (isEn ? 'SLA & SEO attention' : 'Cần xử lý tồn đọng SLA & SEO')}
                </span>
              </div>

              {/* Gauge progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${scoreMeta.bar}`}
                  style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {isEn
                  ? 'Audit score evaluated deterministically across 8 operational criteria: SLA queue, SEO completeness, media, and latency.'
                  : 'Đánh giá tất định từ 8 tiêu chuẩn: hàng đợi SLA, tính đầy đủ SEO, hình ảnh và độ trễ DB.'}
              </p>
            </div>

            {/* Diagnostic Technical Checklist (TECHNICAL METRICS RESIDE HERE) */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              {/* Technical Metric 1: DB Ping (Latency) */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{isEn ? 'PostgreSQL cluster ping' : 'Độ trễ phản hồi DB'}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`font-mono font-semibold ${latencyMeta.text}`}>
                    {dbLatency}ms
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    ({latencyMeta.label})
                  </span>
                </div>
              </div>

              {/* Technical Metric 2: Customer inquiries backlog */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{isEn ? 'Customer inquiries backlog' : 'Tồn đọng liên hệ & báo giá'}</span>
                </div>
                <span className="font-mono font-bold text-red-600 dark:text-red-400 shrink-0">
                  {formatNumber(totalBacklog)}
                </span>
              </div>

              {/* Technical Metric 3: SEO Gap */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{isEn ? 'Missing SEO description' : 'Sản phẩm & tin thiếu SEO'}</span>
                </div>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                  {prodMissingSeo + newsMissingSeo}
                </span>
              </div>

              {/* Technical Metric 4: Products without image */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{isEn ? 'Products without image' : 'Sản phẩm chưa có ảnh'}</span>
                </div>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                  {prodMissingImg}
                </span>
              </div>
            </div>
          </div>

          {/* Trigger Button to Health Drawer */}
          <button
            type="button"
            onClick={onOpenHealthDrawer}
            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200/90 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800/60 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer group"
          >
            <span>{isEn ? 'Detailed Health Checklist (8 Checks)' : 'Xem chi tiết 8 tiêu chuẩn sức khỏe'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

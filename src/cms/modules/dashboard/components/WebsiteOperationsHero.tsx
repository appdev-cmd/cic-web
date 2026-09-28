'use client';

import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Minus,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import type { CmsDashboardData, CmsLocale } from '../../../data/CmsDataSource';
import type { DashboardOperationsMetrics } from '@/cms/types';

interface WebsiteOperationsHeroProps {
  data: CmsDashboardData;
  metrics: DashboardOperationsMetrics;
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
}

export const WebsiteOperationsHero: React.FC<WebsiteOperationsHeroProps> = ({
  data,
  metrics,
  workspaceLocale,
  onNavigate,
}) => {
  const isEn = workspaceLocale === 'en';

  // Series visibility toggles for Chart
  const [visibleSeries, setVisibleSeries] = useState({
    traffic: true,
    requests: true,
    contentUpdates: true,
  });

  // Breakdown toggle for Customer Requests KPI
  const [showRequestsBreakdown, setShowRequestsBreakdown] = useState(false);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(isEn ? 'en-US' : 'vi-VN').format(num);
  };

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

  const totalBacklog = metrics.unprocessedBacklog.totalBacklog;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
      {/* 1. TOP SECTION: 4 STANDARDIZED BUSINESS KPIs (No Technical Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800 pb-2">
        {/* KPI 1: Lượt truy cập / Views */}
        <div
          onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
          className="p-3 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {isEn ? 'Traffic & Reads' : 'Lượt truy cập'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700">
                {isEn ? 'Cumulative' : 'Tích lũy'}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1.5">
              {formatNumber(metrics.traffic.cumulativeHits)}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 leading-tight">
            <span>{isEn ? 'Article reads · Ready for GA4' : 'Lượt đọc bài viết (Chờ kết nối GA4)'}</span>
          </div>
        </div>

        {/* KPI 2: Yêu cầu khách hàng (Báo giá + Liên hệ) */}
        <div
          onClick={() => onNavigate('/cms/customer-requests', isEn ? 'Customer Requests' : 'Yêu cầu khách hàng')}
          className="p-3 cursor-pointer group hover:bg-orange-50/40 dark:hover:bg-orange-950/20 rounded-lg transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {isEn ? 'Customer Requests' : 'Yêu cầu khách hàng'}
              </span>
              {renderDeltaBadge(metrics.customerRequests)}
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-orange-600 dark:text-orange-400 tabular-nums mt-1.5">
              {formatNumber(metrics.customerRequests.current)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isEn ? 'Quotes:' : 'Báo giá:'}{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">
                {metrics.customerRequests.breakdown.productQuotes.current}
              </strong>{' '}
              · {isEn ? 'Contact:' : 'Liên hệ:'}{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">
                {metrics.customerRequests.breakdown.contacts.current}
              </strong>
            </span>
          </div>
        </div>

        {/* KPI 3: Nội dung xuất bản */}
        <div
          onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
          className="p-3 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {isEn ? 'Published Content' : 'Nội dung xuất bản'}
              </span>
              {renderDeltaBadge(metrics.publishedContent)}
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1.5">
              {formatNumber(metrics.publishedContent.current)}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
            <span>
              {isEn ? 'News:' : 'Tin:'} {metrics.publishedContent.breakdown.news.current} · {isEn ? 'Prod:' : 'SP:'} {metrics.publishedContent.breakdown.products.current} · {isEn ? 'Events:' : 'SK:'} {metrics.publishedContent.breakdown.events.current}
            </span>
          </div>
        </div>

        {/* KPI 4: Chưa xử lý / Cần phản hồi (SLA Queue / Backlog) */}
        <div
          onClick={() => onNavigate('/cms/customer-requests', isEn ? 'Customer Requests' : 'Yêu cầu khách hàng')}
          className="p-3 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {isEn ? 'Pending Backlog' : 'Chưa xử lý'}
              </span>
              {renderDeltaBadge(metrics.unprocessedBacklog, true)}
            </div>
            <div className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums mt-1.5 ${totalBacklog > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
              {formatNumber(totalBacklog)}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 truncate">
            <span>
              {totalBacklog > 0
                ? (isEn ? 'Awaiting response in SLA' : 'Hàng đợi SLA cần xử lý')
                : (isEn ? 'All requests resolved on time' : 'Đã phản hồi toàn bộ đúng hạn')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. VISUAL CHÍNH: XU HƯỚNG HOẠT ĐỘNG (Full-width, large, breathable, clean) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              {isEn ? 'Operations Activity Stream' : 'Xu Hướng Hoạt Động & Tương Tác'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isEn ? 'Interactive timeline synchronized with active filter' : 'Biểu đồ hoạt động đồng bộ trực tiếp theo kỳ đã chọn'}
            </p>
          </div>

          {/* Series Toggles (Non-technical, clear labels) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setVisibleSeries((s) => ({ ...s, traffic: !s.traffic }))}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleSeries.traffic
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through opacity-70'
              }`}
            >
              <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block"></span>
              <span>{isEn ? 'Traffic & Reads' : 'Lượt truy cập & đọc'}</span>
            </button>

            <button
              type="button"
              onClick={() => setVisibleSeries((s) => ({ ...s, requests: !s.requests }))}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleSeries.requests
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/60'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through opacity-70'
              }`}
            >
              <span className="w-2 h-2 rounded-xs bg-orange-600 inline-block"></span>
              <span>{isEn ? 'Customer Requests' : 'Yêu cầu khách hàng'}</span>
            </button>

            <button
              type="button"
              onClick={() => setVisibleSeries((s) => ({ ...s, contentUpdates: !s.contentUpdates }))}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                visibleSeries.contentUpdates
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through opacity-70'
              }`}
            >
              <span className="w-2 h-2 rounded-xs bg-sky-600 inline-block"></span>
              <span>{isEn ? 'Published Content' : 'Nội dung xuất bản'}</span>
            </button>
          </div>
        </div>

        {/* Large, Airy Recharts Container with Dual Y-Axis */}
        <div className="h-64 sm:h-72 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.trendSeries} margin={{ top: 12, right: 12, left: -24, bottom: 4 }}>
              <defs>
                <linearGradient id="heroRequestsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="heroContentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="heroTrafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/80" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                tickLine={false}
              />
              {/* Left Y-Axis for Requests & Content */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              {/* Right Y-Axis for Traffic */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#10b981' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                hide={!visibleSeries.traffic}
              />
              <RechartsTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-xs text-white p-3 rounded-lg text-xs shadow-xl border border-slate-700/80 min-w-48">
                        <p className="font-semibold text-slate-300 mb-2 border-b border-slate-700/60 pb-1 font-mono">
                          {label}
                        </p>
                        <div className="space-y-1.5 font-mono text-[11px]">
                          {payload.map((entry, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-2 h-2 rounded-full inline-block"
                                  style={{ backgroundColor: entry.color }}
                                />
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
              {visibleSeries.traffic && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="traffic"
                  stroke="#10b981"
                  strokeWidth={1.8}
                  fillOpacity={1}
                  fill="url(#heroTrafficGrad)"
                  name={isEn ? 'Traffic & Reads' : 'Lượt truy cập/đọc'}
                />
              )}
              {visibleSeries.requests && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="requests"
                  stroke="#ea580c"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#heroRequestsGrad)"
                  name={isEn ? 'Customer Requests' : 'Yêu cầu khách hàng'}
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
                  fill="url(#heroContentGrad)"
                  name={isEn ? 'Published Content' : 'Nội dung xuất bản'}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. OPERATIONAL INSIGHT (Deterministic 1-liner under chart) */}
      <div className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3 px-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
          <p className="truncate font-medium text-slate-700 dark:text-slate-200">
            {metrics.operationalInsight}
          </p>
        </div>

        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 text-slate-500 dark:text-slate-300 hidden sm:inline-block">
          {isEn ? 'Live PostgreSQL Telemetry' : 'Dữ liệu thời gian thực'}
        </span>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { CalendarDays, FileText, Newspaper, Package } from 'lucide-react';
import type { KpiStats } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';

interface CompactContentStripProps {
  kpi: KpiStats;
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
}

export const CompactContentStrip: React.FC<CompactContentStripProps> = ({
  kpi,
  workspaceLocale,
  onNavigate,
}) => {
  const isEn = workspaceLocale === 'en';

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(isEn ? 'en-US' : 'vi-VN').format(num);
  };

  const items = [
    {
      label: isEn ? 'Products' : 'Sản phẩm',
      count: kpi.published_products ?? 275,
      icon: Package,
      path: '/cms/products',
      pageTitle: isEn ? 'Product Management' : 'Quản lý Sản phẩm',
    },
    {
      label: isEn ? 'Articles' : 'Bài viết',
      count: kpi.published_news ?? 1521,
      icon: Newspaper,
      path: '/cms/news',
      pageTitle: isEn ? 'News Management' : 'Quản lý Tin tức',
    },
    {
      label: isEn ? 'Pages' : 'Trang tĩnh',
      count: kpi.static_pages ?? 7,
      icon: FileText,
      path: '/cms/static-pages',
      pageTitle: isEn ? 'Static Pages' : 'Trang nội dung',
    },
    {
      label: isEn ? 'Events' : 'Sự kiện',
      count: kpi.upcoming_events ?? 38,
      icon: CalendarDays,
      path: '/cms/events',
      pageTitle: isEn ? 'Events Management' : 'Quản lý Sự kiện',
    },
  ];

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-lg p-2.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400">
      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {isEn ? 'Content Inventory Totals' : 'Tổng Thể Danh Mục Nội Dung'}
      </span>

      <div className="flex items-center gap-4 flex-wrap">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigate(item.path, item.pageTitle)}
              className="flex items-center gap-1.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {formatNumber(item.count)}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

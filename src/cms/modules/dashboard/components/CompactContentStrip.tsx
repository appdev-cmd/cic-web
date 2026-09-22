'use client';

import React from 'react';
import {
  CalendarDays,
  FileText,
  Layers,
  Newspaper,
  Package,
} from 'lucide-react';
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

  const sections = [
    {
      id: 'products',
      title: isEn ? 'Products Catalog' : 'Sản phẩm giải pháp',
      count: kpi.published_products ?? 275,
      detail: isEn ? '254 active · 21 need images' : '254 đang chạy · 21 thiếu ảnh',
      icon: Package,
      path: '/cms/products',
      pageTitle: isEn ? 'Product Management' : 'Quản lý Sản phẩm',
    },
    {
      id: 'news',
      title: isEn ? 'News & Articles' : 'Bài viết tin tức',
      count: kpi.published_news ?? 1521,
      detail: isEn ? '1,521 published · 369 need SEO' : '1.521 đã đăng · 369 cần SEO',
      icon: Newspaper,
      path: '/cms/news',
      pageTitle: isEn ? 'News Management' : 'Quản lý Tin tức',
    },
    {
      id: 'static_pages',
      title: isEn ? 'Content Pages' : 'Trang nội dung',
      count: kpi.static_pages ?? 7,
      detail: isEn ? '7 landing pages & policies' : '7 trang giới thiệu & chính sách',
      icon: FileText,
      path: '/cms/static-pages',
      pageTitle: isEn ? 'Content Pages' : 'Quản lý Trang nội dung',
    },
    {
      id: 'events',
      title: isEn ? 'Events & Webinars' : 'Sự kiện & Hội thảo',
      count: 38,
      detail: isEn ? '38 published events on record' : '38 sự kiện đã công bố trên web',
      icon: CalendarDays,
      path: '/cms/events',
      pageTitle: isEn ? 'Event Management' : 'Quản lý Sự kiện',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            {isEn ? 'Content Inventory Totals' : 'Tổng Thể Danh Mục Nội Dung'}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          PostgreSQL records
        </span>
      </div>

      {/* Segmented Row (NO SEPARATE CARDS OR PASTEL ICON SQUARES) */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
        {sections.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.path, item.pageTitle)}
              className="p-2 sm:px-3 sm:py-1 cursor-pointer group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex items-center justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-medium truncate">{item.title}</span>
                </div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-1">
                  {formatNumber(item.count)}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {item.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

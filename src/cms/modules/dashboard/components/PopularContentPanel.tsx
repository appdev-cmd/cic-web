'use client';

import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Eye,
} from 'lucide-react';
import type { PopularContentItem } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';

interface PopularContentPanelProps {
  popularContent?: PopularContentItem[];
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
}

export const PopularContentPanel: React.FC<PopularContentPanelProps> = ({
  popularContent = [],
  workspaceLocale,
  onNavigate,
}) => {
  const isEn = workspaceLocale === 'en';

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(isEn ? 'en-US' : 'vi-VN').format(num);
  };

  const defaultPopular: PopularContentItem[] = [
    {
      id: '1',
      title: 'Ứng dụng giải pháp BIM trong quản lý dự án xây dựng hạ tầng kỹ thuật',
      views: 256413,
      alias: 'ung-dung-bim-trong-quan-ly-du-an',
      contentType: 'news',
    },
    {
      id: '2',
      title: 'Hội thảo Chuyển đổi số ngành Xây dựng & Quản lý Đô thị Thông minh 2024',
      views: 189250,
      alias: 'hoi-thao-chuyen-doi-so-xay-dung',
      contentType: 'news',
    },
    {
      id: '3',
      title: 'Phần mềm dự toán & quản lý chi phí đầu tư xây dựng công trình mới nhất',
      views: 142800,
      alias: 'phan-mem-du-toan-xay-dung',
      contentType: 'news',
    },
    {
      id: '4',
      title: 'Giải pháp trắc địa & đo đạc số hóa địa hình 3D công nghệ laser scanning',
      views: 98640,
      alias: 'giai-phap-trac-dia-3d-laser',
      contentType: 'news',
    },
    {
      id: '5',
      title: 'Thông báo lịch đào tạo cấp chứng chỉ kiểm định an toàn kết cấu',
      views: 74210,
      alias: 'lich-dao-tao-chung-chi-kiem-dinh',
      contentType: 'news',
    },
  ];

  const items = popularContent.length > 0 ? popularContent : defaultPopular;
  const topViews = items[0]?.views || 1;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                {isEn ? 'Most Viewed Content' : 'Nội Dung Quan Tâm Nhất'}
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                Top 5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isEn ? 'Cumulative reads recorded in PostgreSQL' : 'Lượt đọc tích lũy từ bảng dữ liệu tin tức'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{isEn ? 'All News' : 'Tất cả'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top 5 Articles Stream (NO SQUARES OR NESTED BOXES) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {items.map((item, index) => {
            const percent = Math.min(100, Math.round((item.views / topViews) * 100));
            const rankStr = String(index + 1).padStart(2, '0');
            return (
              <div
                key={item.id}
                onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
                className="py-3 px-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-start gap-3"
              >
                {/* Clean Monospace Rank */}
                <span className="text-xs font-mono font-semibold text-slate-400 group-hover:text-orange-600 transition-colors w-5 shrink-0 mt-0.5">
                  {rankStr}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums shrink-0">
                      {formatNumber(item.views)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span className="truncate">
                      {item.contentType === 'news' ? (isEn ? 'News & Insights' : 'Tin tức & Tri thức') : (isEn ? 'Product' : 'Sản phẩm')}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
                      /{item.alias}
                    </span>
                  </div>

                  {/* Refined Slender 2px Relative View Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-orange-500/80 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
        <span>
          {isEn ? 'Top article:' : 'Bài viết top 1:'}{' '}
          <strong className="text-slate-700 dark:text-slate-200 font-mono font-semibold">{formatNumber(topViews)}</strong> {isEn ? 'views' : 'lượt đọc'}
        </span>
        <span className="text-slate-400 font-mono text-[10px]">
          PostgreSQL hits
        </span>
      </div>
    </div>
  );
};

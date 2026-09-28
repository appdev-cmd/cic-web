'use client';

import React, { useState } from 'react';
import { ArrowRight, Eye, TrendingUp } from 'lucide-react';
import type { PopularContentItem } from '../../../types';
import type { CmsLocale } from '../../../data/CmsDataSource';

interface PopularContentPanelProps {
  popularContent?: PopularContentItem[];
  popularContentInPeriod?: PopularContentItem[];
  popularContentCumulative?: PopularContentItem[];
  workspaceLocale: CmsLocale;
  onNavigate: (path: string, title: string) => void;
}

export const PopularContentPanel: React.FC<PopularContentPanelProps> = ({
  popularContent = [],
  popularContentInPeriod,
  popularContentCumulative,
  workspaceLocale,
  onNavigate,
}) => {
  const isEn = workspaceLocale === 'en';
  const [tabMode, setTabMode] = useState<'period' | 'cumulative'>('period');

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(isEn ? 'en-US' : 'vi-VN').format(num);
  };

  const cumulativeList = popularContentCumulative && popularContentCumulative.length > 0
    ? popularContentCumulative
    : popularContent;

  const inPeriodList = popularContentInPeriod && popularContentInPeriod.length > 0
    ? popularContentInPeriod
    : [];

  const items = tabMode === 'period'
    ? (inPeriodList.length > 0 ? inPeriodList : cumulativeList)
    : cumulativeList;

  const isPeriodEmpty = tabMode === 'period' && inPeriodList.length === 0;

  const topViews = items[0]?.views || 1;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                {isEn ? 'Top Content' : 'Nội Dung Nổi Bật'}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                TOP 5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isEn ? 'Most read articles & insights' : 'Bài viết có lượt tương tác và đọc cao nhất'}
            </p>
          </div>

          {/* Toggle [Trong kỳ] / [Tích lũy] */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <button
              type="button"
              onClick={() => setTabMode('period')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                tabMode === 'period'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'In Period' : 'Trong kỳ'}
            </button>
            <button
              type="button"
              onClick={() => setTabMode('cumulative')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                tabMode === 'cumulative'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isEn ? 'Cumulative' : 'Tích lũy'}
            </button>
          </div>
        </div>

        {/* Notice if period is empty */}
        {isPeriodEmpty && (
          <div className="p-3 mx-4 mt-3 bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-center text-xs text-slate-500 dark:text-slate-400">
            <span>
              {isEn
                ? 'No new articles published in this selected period. Showing cumulative rankings below.'
                : 'Chưa có bài viết mới xuất bản trong kỳ này. Đang hiển thị bảng xếp hạng tích lũy.'}
            </span>
          </div>
        )}

        {/* Top 5 Content Stream (Ranking + Bar visualization) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {items.map((item, index) => {
            const percent = Math.min(100, Math.max(10, Math.round((item.views / topViews) * 100)));
            const rankStr = String(index + 1).padStart(2, '0');
            const isTop1 = index === 0;

            return (
              <div
                key={item.id}
                onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
                className="py-3 px-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-center gap-3.5"
              >
                {/* Ranking Badge */}
                <span
                  className={`text-xs font-mono font-bold w-6 shrink-0 text-center ${
                    isTop1
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                >
                  {rankStr}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-medium text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 tabular-nums shrink-0">
                      {formatNumber(item.views)}
                    </span>
                  </div>

                  {/* Clean slender relative view bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isTop1 ? 'bg-orange-500' : 'bg-slate-400 dark:bg-slate-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 px-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-800/20">
        <span>
          {isEn ? 'Top article:' : 'Lượt đọc cao nhất:'}{' '}
          <strong className="text-slate-700 dark:text-slate-200 font-mono font-semibold">
            {formatNumber(topViews)}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => onNavigate('/cms/news', isEn ? 'News Management' : 'Quản lý Tin tức')}
          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{isEn ? 'All articles →' : 'Xem danh sách bài viết →'}</span>
        </button>
      </div>
    </div>
  );
};

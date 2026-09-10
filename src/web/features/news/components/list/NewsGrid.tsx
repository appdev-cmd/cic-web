'use client';

import React from 'react';
import { Search } from 'lucide-react';
import type { PublicNewsItem } from '../../types';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  items: PublicNewsItem[];
  onSelectNews: (id: string) => void;
  getTypeSimpleText: (item: PublicNewsItem) => string;
  onResetFilters: () => void;
}

export function NewsGrid({
  items,
  onSelectNews,
  getTypeSimpleText,
  onResetFilters,
}: NewsGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Search size={22} />
        </div>
        <h4 className="text-base font-bold text-slate-800">
          Không tìm thấy bài viết phù hợp
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại các tiêu chí bộ lọc.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-2 px-4 py-2 bg-[#FC5115] hover:bg-[#e0440e] text-white text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
        >
          Xóa toàn bộ bộ lọc
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {items.map((news, index) => (
        <NewsCard
          key={news.id}
          news={news}
          index={index}
          onSelectNews={onSelectNews}
          getTypeSimpleText={getTypeSimpleText}
        />
      ))}
    </div>
  );
}

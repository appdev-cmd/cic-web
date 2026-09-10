'use client';

import React from 'react';
import { ArrowLeft, Clock, Eye, User } from 'lucide-react';
import type { PublicNewsItem } from '../../types';

interface NewsDetailHeaderProps {
  article: PublicNewsItem;
  onBackToList: () => void;
  onNavigateHome: () => void;
}

export function NewsDetailHeader({
  article,
  onBackToList,
  onNavigateHome,
}: NewsDetailHeaderProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'company': return 'Tin CIC Tech';
      case 'specialty': return 'Tin chuyên ngành';
      case 'international': return 'Hợp tác quốc tế';
      case 'recruitment': return 'Tuyển dụng';
      case 'promotion': return 'Khuyến mại';
      case 'shareholder': return 'Quan hệ cổ đông';
      default: return 'Tin tức';
    }
  };

  return (
    <div className="space-y-4">
      {/* BACK BUTTON & BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <button
          onClick={onBackToList}
          className="inline-flex items-center gap-1.5 font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại danh sách tin tức</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 overflow-hidden">
          <button onClick={onNavigateHome} className="hover:text-slate-700">Trang chủ</button>
          <span>/</span>
          <button onClick={onBackToList} className="hover:text-slate-700">Tin tức</button>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-[200px]">{getCategoryLabel(article.category)}</span>
        </div>
      </div>

      {/* CATEGORY BADGE */}
      <div>
        <span className="inline-block px-3 py-1 bg-orange-100/70 text-[#FC5115] text-xs font-black uppercase tracking-wider rounded-md">
          {getCategoryLabel(article.category)}
        </span>
      </div>

      {/* ARTICLE TITLE */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 uppercase leading-tight tracking-tight">
        {article.title}
      </h1>

      {/* ARTICLE METADATA ROW */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-2 border-b border-slate-200/80">
        {article.author && (
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <User size={14} className="text-[#FC5115]" />
            <span>{article.author}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-[#FC5115]" />
          <span>{article.date}</span>
        </div>

        {article.views !== undefined && (
          <div className="flex items-center gap-1.5">
            <Eye size={14} className="text-slate-400" />
            <span>{article.views.toLocaleString()} lượt xem</span>
          </div>
        )}
      </div>
    </div>
  );
}

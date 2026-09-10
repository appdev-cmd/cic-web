'use client';

import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  Eye,
  Facebook,
  FileCheck,
  Linkedin,
  Twitter,
} from 'lucide-react';
import type { PublicNewsItem } from '../../types';

interface NewsDetailHeroProps {
  article: PublicNewsItem;
  copiedLink: boolean;
  isExportingPDF: boolean;
  onBackToList: () => void;
  onNavigateHome: () => void;
  onSharePlatform: (platform: 'facebook' | 'linkedin' | 'twitter' | 'zalo') => void;
  onShareClick: () => void;
  onExportPDF: () => void;
}

const getTypeSimpleText = (item: PublicNewsItem): string => {
  if (item.category === 'company') return item.subType || 'Tin CIC';
  if (item.category === 'specialty') return item.subType || 'Tin chuyên ngành';
  if (item.category === 'international') return item.subType || 'Hợp tác quốc tế';
  if (item.category === 'recruitment') return item.department || 'Tuyển dụng';
  if (item.category === 'promotion') return 'Khuyến mại';
  if (item.category === 'shareholder') return item.docType || 'Quan hệ cổ đông';
  return 'Tin tức';
};

export function NewsDetailHero({
  article,
  copiedLink,
  isExportingPDF,
  onBackToList,
  onNavigateHome,
  onSharePlatform,
  onShareClick,
  onExportPDF,
}: NewsDetailHeroProps) {
  return (
    <section className="relative w-full p-6 sm:p-10 bg-slate-100/90 border border-slate-200/80 shadow-sm overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#131b2e 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 space-y-5">
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-sans flex-wrap">
            <button
              onClick={onNavigateHome}
              className="hover:text-orange-600 transition-colors cursor-pointer font-medium"
            >
              Trang chủ
            </button>
            <span>/</span>
            <button
              onClick={onBackToList}
              className="hover:text-orange-600 transition-colors cursor-pointer font-medium"
            >
              Tin tức
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold line-clamp-1 max-w-xs sm:max-w-md">
              {article.title}
            </span>
          </nav>

          <button
            onClick={onBackToList}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors bg-white px-3.5 py-1.5 border border-slate-200 shadow-xs cursor-pointer rounded-[8px] shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Tags & Meta Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="bg-orange-600/10 border border-orange-500/20 text-orange-600 font-black px-3 py-1 uppercase tracking-wider text-[10px]">
            {getTypeSimpleText(article)}
          </span>
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            {article.date}
          </span>
          {article.views !== undefined && (
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-orange-600" />
              {article.views} lượt xem
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 uppercase leading-tight">
          {article.title}
        </h1>

        {/* Hero Actions Row: Social Share & Bookmark */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 hidden sm:inline">Chia sẻ:</span>
            <button
              onClick={() => onSharePlatform('facebook')}
              className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#1877F2] transition-colors border border-slate-200 cursor-pointer"
              title="Chia sẻ lên Facebook"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSharePlatform('linkedin')}
              className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#0A66C2] transition-colors border border-slate-200 cursor-pointer"
              title="Chia sẻ lên LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSharePlatform('twitter')}
              className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-black transition-colors border border-slate-200 cursor-pointer"
              title="Chia sẻ lên X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSharePlatform('zalo')}
              className="px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase transition-all cursor-pointer"
              title="Chia sẻ qua Zalo"
            >
              ZALO
            </button>
            <button
              onClick={onShareClick}
              className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 transition-colors border border-slate-200 cursor-pointer"
              title="Sao chép đường dẫn"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-orange-600 text-slate-700 hover:text-orange-600 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
              title="In / Xuất bài viết PDF"
            >
              <FileCheck size={14} className={isExportingPDF ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isExportingPDF ? 'Đang xử lý...' : 'In / PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ShieldCheck } from 'lucide-react';
import type { StaticPagePublicResult } from '@/features/static-pages/types';

interface PublicLegalPageViewProps {
  pageData?: StaticPagePublicResult | null;
  fallbackView?: React.ReactNode;
  defaultTitle?: string;
  categoryTag?: string;
}

export const PublicLegalPageView: React.FC<PublicLegalPageViewProps> = ({
  pageData,
  fallbackView,
  defaultTitle = 'Văn bản pháp lý',
  categoryTag = 'Pháp lý & Điều khoản',
}) => {
  const router = useRouter();

  if (!pageData) {
    return <>{fallbackView}</>;
  }

  const contentSec = pageData.sections.find((s) => s.sectionKey === 'legal.content');
  const richTextHtml = typeof contentSec?.config?.richTextHtml === 'string'
    ? (contentSec.config.richTextHtml as string)
    : '';

  if (!richTextHtml && fallbackView) {
    return <>{fallbackView}</>;
  }

  const title = pageData.name || defaultTitle;
  const lastUpdated = pageData.publishedAt
    ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date(pageData.publishedAt))
    : 'Chưa cập nhật';

  return (
    <div className="pt-28 pb-20 relative z-10 min-h-screen bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-sans">
          <button 
            onClick={() => router.push('/')} 
            className="hover:text-orange-600 transition-colors cursor-pointer font-medium"
          >
            Trang chủ
          </button>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{title}</span>
        </nav>

        <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-10 shadow-xs mb-6">
          <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[11px] uppercase tracking-wider rounded-md mb-3">
            {categoryTag}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 uppercase tracking-tight leading-snug mb-3">
            {title}
          </h1>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-orange-600" /> Cập nhật: {lastUpdated}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" /> Phiên bản: v{pageData.versionNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-10 shadow-xs leading-relaxed text-slate-700 prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: richTextHtml }} />
        </div>
      </div>
    </div>
  );
};

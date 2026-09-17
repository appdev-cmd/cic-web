import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ShieldCheck, Phone, Mail, ArrowLeft } from 'lucide-react';
import type { StaticPagePublicResult } from '@/features/static-pages/types';

interface PublicLegalPageViewProps {
  pageData?: StaticPagePublicResult | null;
  fallbackView?: React.ReactNode;
  defaultTitle?: string;
  categoryTag?: string;
}

function extractLeadParagraph(html: string): string {
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (!match) return '';
  return match[1].replace(/<[^>]+>/g, '').trim();
}

export const PublicLegalPageView: React.FC<PublicLegalPageViewProps> = ({
  pageData,
  fallbackView,
  defaultTitle = 'Văn bản pháp lý',
  categoryTag = 'Pháp lý & Chính sách',
}) => {
  if (!pageData) {
    return <>{fallbackView}</>;
  }

  const headerSec = pageData.sections.find((s) => s.sectionKey === 'legal.header');
  const contentSec = pageData.sections.find((s) => s.sectionKey === 'legal.content');

  const headerHtml = typeof headerSec?.config?.richTextHtml === 'string'
    ? (headerSec.config.richTextHtml as string)
    : '';

  const richTextHtml = typeof contentSec?.config?.richTextHtml === 'string'
    ? (contentSec.config.richTextHtml as string)
    : '';

  if (!richTextHtml && fallbackView) {
    return <>{fallbackView}</>;
  }

  const title = pageData.name || defaultTitle;
  const subtitle =
    extractLeadParagraph(headerHtml) ||
    pageData.seoDescription ||
    'Các điều khoản, chính sách và quy định chính thức từ Ban quản trị CIC Technology.';

  const lastUpdated = pageData.publishedAt
    ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date(pageData.publishedAt))
    : 'Chưa cập nhật';

  const cleanText = richTextHtml.replace(/<[^>]+>/g, ' ');
  const wordsCount = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = `${Math.max(1, Math.ceil(wordsCount / 200))} phút`;

  return (
    <div className="pt-8 pb-20 relative z-10 min-h-screen bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-sans">
          <Link 
            href="/" 
            className="hover:text-orange-600 transition-colors font-medium"
          >
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{title}</span>
        </nav>

        {/* ARTICLE HEADER CARD */}
        <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-10 shadow-xs mb-6">
          <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[11px] uppercase tracking-wider rounded-md mb-3">
            {categoryTag}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 uppercase tracking-tight leading-snug mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6 max-w-4xl">
              {subtitle}
            </p>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-orange-600" /> Cập nhật: {lastUpdated}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-orange-600" /> Thời gian đọc: {readingTime}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" /> Phiên bản: v{pageData.versionNumber}
              </span>
            </div>
            <span className="text-slate-400 hidden sm:inline">Công ty CP Công nghệ và Tư vấn CIC</span>
          </div>
        </div>

        {/* MAIN ARTICLE BODY */}
        <article className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-10 lg:p-12 shadow-xs space-y-10 leading-relaxed text-slate-700 prose prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: richTextHtml }} />

          {/* CONTACT ASSISTANCE BOX */}
          <div className="mt-10 p-6 sm:p-8 bg-slate-900 text-white rounded-[12px] space-y-3 shadow-md not-prose">
            <h3 className="text-xs sm:text-sm font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={18} /> Liên hệ giải đáp thắc mắc pháp lý
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mọi thắc mắc hoặc yêu cầu hỗ trợ liên quan đến văn bản chính sách này, quý khách vui lòng liên hệ Ban quản trị CIC:
            </p>
            <div className="flex flex-wrap gap-6 pt-2 text-xs sm:text-sm font-medium">
              <a href="tel:02439761381" className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors">
                <Phone size={15} className="text-orange-500" /> Hotline: 024 3976 1381
              </a>
              <a href="mailto:info@cic.com.vn" className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors">
                <Mail size={15} className="text-orange-500" /> Email: info@cic.com.vn
              </a>
            </div>
          </div>
        </article>

        {/* FOOTER BACK BUTTON */}
        <div className="mt-8 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <span>© 2026 CIC Technology & Consultancy.</span>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white border border-slate-200 hover:border-orange-500 hover:text-orange-600 rounded-[8px] font-bold transition-all flex items-center gap-2 shadow-2xs"
          >
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
        </div>

      </div>
    </div>
  );
};


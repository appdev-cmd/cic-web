'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';
import type { ShareholderNewsItem } from '../../types';

interface NewsShareholderPdfSectionProps {
  article: ShareholderNewsItem;
  pdfDownloaded: boolean;
  onDownloadAttachment: (title: string) => void;
}

export function NewsShareholderPdfSection({
  article,
  pdfDownloaded,
  onDownloadAttachment,
}: NewsShareholderPdfSectionProps) {
  if (article.category !== 'shareholder') return null;

  return (
    <div className="pt-8 border-t border-slate-200 space-y-8">
      <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
              <FileText size={14} /> Văn bản công bố thông tin chính thức
            </span>
            <h3 className="text-base md:text-lg font-bold uppercase tracking-tight text-slate-900">
              Tải về bản toàn văn PDF có chữ ký số
            </h3>
          </div>
          <span className="px-3 py-1 bg-white text-slate-700 text-xs font-mono border border-slate-300">
            {article.pdfSize || 'PDF'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Văn bản được công bố công khai minh bạch theo đúng quy định của Ủy ban Chứng khoán Nhà nước và Sở Giao dịch Chứng khoán. Quý cổ đông và nhà đầu tư có thể tải tài liệu chính thức bên dưới.
        </p>

        <button
          onClick={() => onDownloadAttachment(article.title)}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Download size={16} />
          <span>{pdfDownloaded ? 'Đã tải thành công!' : 'Tải tài liệu PDF (.PDF)'}</span>
        </button>
      </div>
    </div>
  );
}

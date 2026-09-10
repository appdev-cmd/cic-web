'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';
import type { PublicNewsItem } from '../../types';

interface ShareholderDocumentListProps {
  items: PublicNewsItem[];
  onSelectNews: (id: string) => void;
  onDownloadAttachment: (e: React.MouseEvent, item: PublicNewsItem) => void;
  pdfDownloadedId: string | null;
  downloadProgress: number;
}

export function ShareholderDocumentList({
  items,
  onSelectNews,
  onDownloadAttachment,
  pdfDownloadedId,
  downloadProgress,
}: ShareholderDocumentListProps) {
  return (
    <div className="space-y-3">
      {items.map((news) => (
        <div 
          key={news.id}
          onClick={() => onSelectNews(news.id)}
          className="group cursor-pointer bg-white p-5 rounded-[12px] border border-slate-200 hover:border-orange-500/50 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-[10px] bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <FileText size={24} className="text-red-600 group-hover:scale-110 transition-transform" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-100 text-[#FC5115] text-[10px] font-bold rounded">
                  {news.docType || 'Tài liệu'}
                </span>
                <span className="text-xs text-slate-400">Năm {news.year || '2026'}</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-500">{news.date}</span>
              </div>

              <h4 className="text-base font-bold text-slate-900 group-hover:text-[#FC5115] transition-colors leading-snug">
                {news.title}
              </h4>

              <p className="text-xs text-slate-500 line-clamp-2">
                {news.shortDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            {news.pdfUrl && (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => onDownloadAttachment(e, news)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-bold rounded-[8px] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Tải PDF ({news.pdfSize || '2.5 MB'})</span>
                </button>
                {pdfDownloadedId === news.id && (
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-150"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            <button 
              type="button"
              className="px-3.5 py-2 bg-white border border-slate-200 group-hover:border-[#FC5115] group-hover:text-[#FC5115] text-slate-700 text-xs font-bold rounded-[8px] transition-colors"
            >
              Chi tiết
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

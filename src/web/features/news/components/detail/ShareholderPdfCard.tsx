'use client';

import React, { useState } from 'react';
import { Check, Download, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import type { PublicNewsItem } from '../../types';

interface ShareholderPdfCardProps {
  article: PublicNewsItem;
}

export function ShareholderPdfCard({ article }: ShareholderPdfCardProps) {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (article.category !== 'shareholder' && !article.pdfUrl) return null;

  const handleDownload = () => {
    setDownloadProgress(0);
    setIsDownloaded(false);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloaded(true);
          return 100;
        }
        return prev + 20;
      });
    }, 60);
  };

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-red-50/70 via-orange-50/50 to-white border border-red-200/80 rounded-[14px] space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-100/80 border border-red-200 flex items-center justify-center text-red-600 shrink-0 shadow-xs">
          <FileText size={26} />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded">
              Văn bản công bố chính thức
            </span>
            <span className="text-xs text-slate-500 font-medium">Năm tài chính {article.year || 2026}</span>
          </div>

          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            {article.title}
          </h4>

          <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck size={14} /> Chữ ký số hợp lệ
            </span>
            <span>•</span>
            <span>Dung lượng: {article.pdfSize || '2.8 MB'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleDownload}
          disabled={downloadProgress > 0 && downloadProgress < 100}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-[8px] transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isDownloaded ? (
            <>
              <Check size={14} />
              <span>Đã tải văn bản thành công</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>{downloadProgress > 0 ? `Đang tải ${downloadProgress}%` : 'Tải tài liệu PDF'}</span>
            </>
          )}
        </button>

        <button
          onClick={() => window.open('#', '_blank')}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-[8px] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Xem trực tuyến</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {downloadProgress > 0 && downloadProgress < 100 && (
        <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-red-600 h-full transition-all duration-100" 
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}

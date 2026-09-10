'use client';

import React, { useState } from 'react';
import { Check, Copy, Facebook, FileText, Linkedin, Twitter } from 'lucide-react';

interface NewsDetailActionsProps {
  title: string;
}

export function NewsDetailActions({ title }: NewsDetailActionsProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleSharePlatform = (platform: 'facebook' | 'linkedin' | 'twitter' | 'zalo') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
        break;
      case 'zalo':
        window.open(`https://sp.zalo.me/share_inline?url=${url}`, '_blank', 'width=600,height=400');
        break;
    }
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      window.print();
      setIsExportingPDF(false);
    }, 600);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 my-6">
      {/* Social Share Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Chia sẻ:
        </span>
        <button
          onClick={() => handleSharePlatform('facebook')}
          className="w-8 h-8 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Chia sẻ lên Facebook"
        >
          <Facebook size={14} />
        </button>
        <button
          onClick={() => handleSharePlatform('linkedin')}
          className="w-8 h-8 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Chia sẻ lên LinkedIn"
        >
          <Linkedin size={14} />
        </button>
        <button
          onClick={() => handleSharePlatform('twitter')}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Chia sẻ lên X (Twitter)"
        >
          <Twitter size={14} />
        </button>
        <button
          onClick={() => handleSharePlatform('zalo')}
          className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-[10px] font-black tracking-wider transition-colors cursor-pointer"
          title="Chia sẻ qua Zalo"
        >
          ZALO
        </button>
      </div>

      {/* Action Tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          <span>{copiedLink ? 'Đã sao chép' : 'Sao chép link'}</span>
        </button>

        <button
          onClick={handleExportPDF}
          disabled={isExportingPDF}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <FileText size={14} className={isExportingPDF ? 'animate-spin' : ''} />
          <span>{isExportingPDF ? 'Đang chuẩn bị...' : 'In / Lưu PDF'}</span>
        </button>
      </div>
    </div>
  );
}

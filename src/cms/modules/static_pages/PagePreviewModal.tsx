import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, Globe, ExternalLink, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { StaticPage } from './types';

interface PagePreviewModalProps {
  isOpen: boolean;
  page: StaticPage | null;
  onClose: () => void;
}

export const PagePreviewModal: React.FC<PagePreviewModalProps> = ({ isOpen, page, onClose }) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeLocale, setActiveLocale] = useState<'vi' | 'en'>('vi');

  if (!isOpen || !page) return null;

  const displayTitle =
    activeLocale === 'en' && page.translations?.en?.title
      ? page.translations.en.title
      : page.title;

  const displaySummary =
    activeLocale === 'en' && page.translations?.en?.summary
      ? page.translations.en.summary
      : page.summary;

  const displayContent =
    activeLocale === 'en' && page.translations?.en?.content
      ? page.translations.en.content
      : page.content;

  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'desktop':
        return 'w-full max-w-5xl';
      case 'tablet':
        return 'w-[768px]';
      case 'mobile':
        return 'w-[375px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="px-6 py-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Xem trước giao diện công khai</span>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold rounded">
                /{page.alias}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[360px]">{displayTitle}</p>
          </div>
        </div>

        {/* Viewport Switcher & Locale */}
        <div className="flex items-center gap-4">
          {/* Viewport Selector */}
          <div className="p-1 bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-700">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewport === 'desktop' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewport === 'tablet' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" /> Tablet
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewport === 'mobile' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          {/* Locale Selector */}
          <div className="p-1 bg-slate-800 rounded-xl flex items-center gap-1 border border-slate-700">
            <button
              onClick={() => setActiveLocale('vi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeLocale === 'vi' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇻🇳 VI
            </button>
            <button
              onClick={() => setActiveLocale('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeLocale === 'en' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center bg-slate-950">
        <div
          className={`${getViewportWidthClass()} transition-all duration-300 bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 min-h-[600px] flex flex-col`}
        >
          {/* Simulated Website Navigation Bar */}
          <header className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 font-bold flex items-center justify-center text-white text-xs">
                CIC
              </div>
              <span className="font-bold text-sm tracking-wide">CIC TECHNOLOGY</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-300">
              <span>Trang chủ</span>
              <span className="text-orange-400 font-bold border-b-2 border-orange-500 pb-0.5">Giới thiệu</span>
              <span>Sản phẩm</span>
              <span>Dịch vụ</span>
              <span>Liên hệ</span>
            </div>
          </header>

          {/* Banner Hero */}
          {page.banner_image || page.image ? (
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
              <img
                src={page.banner_image || page.image}
                alt={displayTitle}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white space-y-2">
                <span className="px-3 py-1 bg-orange-600 text-white font-bold text-xs rounded-lg w-fit">
                  {page.category_id === 'cat_gioi_thieu' ? 'Giới thiệu công ty' : 'Thông tin chung'}
                </span>
                <h1 className="text-xl sm:text-3xl font-extrabold leading-tight drop-shadow-md">
                  {displayTitle}
                </h1>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-50 border-b border-slate-200">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{displayTitle}</h1>
            </div>
          )}

          {/* Article Main Body */}
          <main className="p-6 sm:p-10 flex-1 space-y-6 max-w-4xl mx-auto w-full">
            {/* Summary */}
            {displaySummary && (
              <div className="p-4 sm:p-5 bg-orange-50 border-l-4 border-orange-500 text-slate-800 font-medium text-sm sm:text-base leading-relaxed rounded-r-xl">
                {displaySummary}
              </div>
            )}

            {/* Rich HTML Content */}
            <div
              className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          </main>

          {/* Simulated Website Footer */}
          <footer className="mt-auto px-6 py-6 bg-slate-900 text-slate-400 text-xs border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>© 2026 CIC Technology & Consultancy JSC. All rights reserved.</span>
            <div className="flex items-center gap-4 text-slate-300 font-medium">
              <span>Chính sách bảo mật</span>
              <span>Điều khoản sử dụng</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink, Globe, Tag, Calendar, User, Eye, BookOpen } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticlePreviewModalProps {
  isOpen: boolean;
  article: NewsArticle | null;
  onClose: () => void;
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  isOpen,
  article,
  onClose,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen || !article) return null;

  const getWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-5xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Xem trước bài viết công khai</span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {article.workflow_status}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-md">
                /tin-tuc/{article.alias}
              </p>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                device === 'desktop'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                device === 'tablet'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                device === 'mobile'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Frame Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950 flex justify-center custom-scrollbar">
          <div
            className={`w-full ${getWidthClass()} bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden flex flex-col h-fit my-auto`}
          >
            {/* Website Header Bar Simulation */}
            <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-extrabold tracking-wider text-sm">
                  CIC TECHNOLOGY
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300 font-normal">Trang thông tin & Tin tức</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">cic.com.vn</span>
            </div>

            {/* Article Render Content */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Category & Meta Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-orange-600 text-white font-bold rounded-lg uppercase tracking-wider text-[10px]">
                    TIN CÔNG NGHỆ
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" /> {article.start_time || article.created_time}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <User className="w-3.5 h-3.5" /> {article.author?.name || 'CIC Admin'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {article.title}
                </h1>

                {article.summary && (
                  <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-orange-500 pl-4 py-1 bg-orange-50/30 dark:bg-orange-950/20 rounded-r-xl">
                    {article.summary}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              {article.image && (
                <div className="space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                    <img
                      src={article.image}
                      alt={article.image_alt || article.title}
                      className="w-full max-h-[420px] object-cover"
                    />
                  </div>
                  {article.image_caption && (
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic">
                      {article.image_caption}
                    </p>
                  )}
                </div>
              )}

              {/* Main Content HTML */}
              <div
                className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: article.content || '<p class="text-slate-400 italic">Chưa có nội dung bài viết.</p>' }}
              />

              {/* Video Embed */}
              {article.video && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Video đính kèm:
                  </p>
                  <a
                    href={article.video}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-orange-600 dark:text-orange-400 font-mono hover:underline flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{article.video}</span>
                  </a>
                </div>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {article.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

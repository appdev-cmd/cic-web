'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, FileText } from 'lucide-react';
import { SectionHeader } from '@shared/components/Typography';
export type HomeNewsDisplayItem = {
  id?: string | number;
  category: string;
  title: string;
  date: string;
  desc: string;
  img: string;
};

export interface HomeNewsSectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  newsItems: readonly HomeNewsDisplayItem[];
  renderPolicy?: any;
  setCurrentView: (view: any) => void;
  setActiveLink: (link: any) => void;
  setPreSelectedNewsCategory?: (cat: any) => void;
}

export const HomeNewsSection: React.FC<HomeNewsSectionProps> = ({
  title,
  subtitle,
  ctaLabel,
  ctaUrl,
  newsItems,
  setCurrentView,
  setActiveLink,
  setPreSelectedNewsCategory,
}) => {
  const [activeNewsCategory, setActiveNewsCategory] = useState('all');

  const filteredNews = newsItems.filter((n) => {
    if (activeNewsCategory === 'all') {
      return n.category !== 'investor';
    }
    return n.category === activeNewsCategory;
  });

  return (
    <section data-page-builder-section-key="home.news" id="news" className="py-12 bg-slate-50/40 border-t border-slate-100 z-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader 
          title={title || "Tin tức và Góc nhìn"} 
          sub={subtitle || "Cập nhật xu hướng công nghệ & chuyển đổi số mới nhất"} 
          titleProps={{ 'data-page-builder-config-path': JSON.stringify(['title']) } as any}
          subProps={{ 'data-page-builder-config-path': JSON.stringify(['subtitle']) } as any}
        />

        {/* News Categories */}
        <div className="flex flex-wrap gap-2.5 mb-8 scrollbar-hide overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'company', label: 'Tin Công ty' },
            { id: 'specialty', label: 'Tin Chuyên ngành' },
            { id: 'international', label: 'Hợp tác Quốc tế' },
            { id: 'promo', label: 'Tin Khuyến mại' },
            { id: 'career', label: 'Tuyển dụng' },
            { id: 'investor', label: 'Quan hệ Cổ đông' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveNewsCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-[8px] uppercase font-medium text-xs tracking-wider border transition-all ${
                activeNewsCategory === cat.id 
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-orange-600 hover:text-orange-600 hover:bg-orange-50/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div data-page-collection="news" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredNews.length > 0 ? filteredNews.slice(0, 4).map((news, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              onClick={() => {
                setCurrentView('news');
                setActiveLink('Tin tức');
                if (setPreSelectedNewsCategory) {
                  setPreSelectedNewsCategory(news.category);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group bg-slate-50 rounded-[10px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col relative cursor-pointer"
            >
              <div className="h-56 overflow-hidden relative rounded-[10px]">
                <img src={news.img} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-[10px]" />
                
                {/* Watermark */}
                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-all w-10">
                  <img src="/logo.png" alt="" className="w-full invert" />
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 bg-orange-600 text-white rounded-[8px] text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {news.category === 'company' ? 'Tin Công ty' : news.category === 'international' ? 'Hợp tác Quốc tế' : news.category === 'specialty' ? 'Tin Chuyên ngành' : news.category === 'promo' ? 'Khuyến mại' : news.category === 'career' ? 'Tuyển dụng' : news.category === 'investor' ? 'Cổ đông' : 'Tech News'}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">{news.date}</div>
                <h3 className="text-xl font-black text-slate-950 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">{news.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{news.desc}</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest group/link">
                    Đọc tiếp <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-16 px-6 text-center bg-white rounded-[10px] border border-dashed border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <FileText className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-bold text-sm tracking-wide">Đang cập nhật bài viết...</p>
              <p className="text-xs text-slate-400 mt-1">Nội dung chuyên mục này sẽ sớm được phát hành.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-5 md:mt-6">
          <button
            data-page-builder-config-path={JSON.stringify(['ctaLabel'])}
            data-page-builder-cta-key={JSON.stringify(['ctaUrl'])}
            onClick={() => {
              setCurrentView('news');
              setActiveLink('Tin tức');
              if (setPreSelectedNewsCategory) {
                setPreSelectedNewsCategory(activeNewsCategory !== 'all' ? activeNewsCategory : 'all');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-black uppercase tracking-widest text-xs transition-all group btn-modern-interaction shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>{ctaLabel || 'Xem tất cả tin tức'}</span>
            <ChevronRight size={16} className="inline-block group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

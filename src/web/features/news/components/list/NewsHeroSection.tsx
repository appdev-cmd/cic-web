'use client';

import React from 'react';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import type { PublicNewsItem } from '../../types';

interface NewsHeroSectionProps {
  highlightedNews: PublicNewsItem[];
  onSelectNews: (id: string) => void;
  getTypeSimpleText: (item: PublicNewsItem) => string;
}

export function NewsHeroSection({
  highlightedNews,
  onSelectNews,
  getTypeSimpleText,
}: NewsHeroSectionProps) {
  if (highlightedNews.length === 0) return null;

  const mainStory = highlightedNews[0];
  const sideStories = highlightedNews.slice(1, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
      {/* HERO MAIN ARTICLE (7 cols) */}
      <div 
        onClick={() => onSelectNews(mainStory.id)}
        className="lg:col-span-7 group cursor-pointer relative overflow-hidden bg-slate-950 min-h-[460px] lg:min-h-[520px] flex flex-col justify-end rounded-[12px]"
      >
        <img 
          src={mainStory.img}
          alt={mainStory.title}
          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative z-10 p-6 lg:p-10 space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#FC5115] text-white text-[10px] font-black uppercase tracking-wider rounded-[8px]">
              Tin Nổi Bật
            </span>
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
              <Clock size={13} className="text-[#FC5115]" /> {mainStory.date}
            </span>
          </div>

          <h2 className="text-xl lg:text-3xl font-black text-white uppercase leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
            {mainStory.title}
          </h2>

          <p className="text-sm lg:text-base text-slate-300 line-clamp-3 leading-relaxed font-medium max-w-3xl">
            {mainStory.shortDesc}
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FC5115] pr-2">
            <span>Đọc tiếp</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
          </div>
        </div>
      </div>

      {/* SECONDARY SIDE HIGHLIGHTS (5 cols - 3 larger stacked cards closer together) */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-200 flex items-center justify-between">
          <span className="text-slate-900 font-extrabold text-sm uppercase tracking-tight">Nội dung đáng chú ý</span>
          <TrendingUp size={16} className="text-[#FC5115]" />
        </div>

        {sideStories.map((sideItem) => (
          <div 
            key={sideItem.id}
            onClick={() => onSelectNews(sideItem.id)}
            className="group cursor-pointer flex gap-4 items-center p-2 bg-transparent hover:bg-slate-100/50 transition-all border-0 shadow-none rounded-[10px] overflow-hidden"
          >
            {/* Larger Thumbnail Image */}
            <div className="w-36 sm:w-40 lg:w-44 h-28 lg:h-32 shrink-0 overflow-hidden relative bg-slate-900 rounded-[10px]">
              <img 
                src={sideItem.img} 
                alt={sideItem.title} 
                className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bigger Content & Excerpt */}
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Clock size={12} className="text-[#FC5115]" />
                <span>{sideItem.date}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">{getTypeSimpleText(sideItem)}</span>
              </div>
              <h4 className="text-sm lg:text-base font-bold text-slate-900 transition-colors line-clamp-2 leading-snug">
                {sideItem.title}
              </h4>
              <p className="text-[13px] text-slate-500 line-clamp-3 font-medium leading-relaxed">
                {sideItem.shortDesc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

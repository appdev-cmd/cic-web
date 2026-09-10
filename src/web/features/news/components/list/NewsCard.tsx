'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock } from 'lucide-react';
import type { PublicNewsItem } from '../../types';

interface NewsCardProps {
  news: PublicNewsItem;
  index: number;
  onSelectNews: (id: string) => void;
  getTypeSimpleText: (item: PublicNewsItem) => string;
}

export function NewsCard({
  news,
  index,
  onSelectNews,
  getTypeSimpleText,
}: NewsCardProps) {
  return (
    <motion.div
      key={news.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index % 3 * 0.08 }}
      onClick={() => onSelectNews(news.id)}
      className="group cursor-pointer bg-transparent border-0 p-0 transition-all duration-300 shadow-none flex flex-col overflow-hidden rounded-[12px]"
    >
      {/* Card Image */}
      <div className="w-full h-52 lg:h-56 shrink-0 relative overflow-hidden bg-slate-900 rounded-[14px]">
        <img 
          src={news.img} 
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Card Body */}
      <div className="pt-4 pb-2 flex flex-col flex-1 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Clock size={12} className="text-[#FC5115] shrink-0" />
          <span>{news.date}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">{getTypeSimpleText(news)}</span>
        </div>

        <h3 className="text-base font-semibold text-[#333] group-hover:text-[#FC5115] transition-colors leading-snug line-clamp-2">
          {news.title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal flex-1">
          {news.shortDesc}
        </p>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#FC5115] pr-2">
          <span>Đọc tiếp</span>
          <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}

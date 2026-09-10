'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Box,
  ChevronDown,
  ChevronUp,
  Clock,
  ListOrdered,
} from 'lucide-react';
import type { Product } from '@/shared/types';
import type { PublicNewsItem } from '../../types';

interface NewsDetailSidebarProps {
  showTOC: boolean;
  isTocOpen: boolean;
  setIsTocOpen: (open: boolean) => void;
  tocItems: Array<{ id: string; title: string; fullTitle: string }>;
  activeTocId: string | null;
  scrollToSection: (id: string) => void;
  effectiveLinkedProducts: Product[];
  latestNews: PublicNewsItem[];
  onNavigateToProduct?: (productId: number) => void;
  onSelectNews: (id: string) => void;
}

export function NewsDetailSidebar({
  showTOC,
  isTocOpen,
  setIsTocOpen,
  tocItems,
  activeTocId,
  scrollToSection,
  effectiveLinkedProducts,
  latestNews,
  onNavigateToProduct,
  onSelectNews,
}: NewsDetailSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* 1. Collapsible Table of Contents */}
      {showTOC && tocItems.length > 0 && (
        <div className="bg-white border border-slate-200/80 shadow-2xs overflow-hidden transition-all rounded-[10px]">
          <div
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="p-3.5 px-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 select-none transition-colors border-b border-slate-100"
          >
            <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
              <ListOrdered size={15} />
              <span>Mục lục bài viết</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 ml-1 rounded-[6px]">
                {tocItems.length} mục
              </span>
            </h3>
            <button
              type="button"
              aria-label={isTocOpen ? 'Thu gọn mục lục' : 'Mở rộng mục lục'}
              className="text-slate-400 hover:text-orange-600 transition-colors p-0.5 rounded-[6px] cursor-pointer"
            >
              {isTocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {isTocOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <nav className="p-3.5 pt-2 space-y-1 max-h-[300px] overflow-y-auto pr-1">
                  {tocItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(item.id)}
                      title={item.fullTitle}
                      className={`block text-left w-full text-xs font-medium transition-colors py-1.5 px-2 border-b border-slate-50 last:border-0 rounded-[6px] cursor-pointer ${
                        activeTocId === item.id
                          ? 'text-orange-600 font-bold bg-orange-50/80 border-orange-200'
                          : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-orange-600 font-bold mr-1.5 text-[10px]">{idx + 1}.</span>
                      <span className="line-clamp-1 inline">{item.title}</span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Linked Products / Solutions Block */}
      {effectiveLinkedProducts.length > 0 && (
        <div className="bg-transparent p-0 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box size={16} className="text-orange-600" />
              <span>Sản phẩm liên quan</span>
            </div>
          </h3>
          <div className="space-y-2.5">
            {effectiveLinkedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigateToProduct?.(prod.id)}
                className="group cursor-pointer p-2 bg-transparent hover:bg-slate-100/60 border-0 transition-all flex items-center gap-3 rounded-[8px]"
              >
                <img
                  src={prod.img || (prod as any).image}
                  alt={prod.name}
                  className="w-11 h-11 object-cover border border-slate-200 shrink-0 rounded-[6px]"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {prod.description || (prod as any).desc}
                  </p>
                  <p className="text-[10px] font-bold text-orange-600 mt-0.5">{prod.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest News */}
      {latestNews.length > 0 && (
        <div className="bg-transparent p-0 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-600" />
              <span>Tin mới nhất</span>
            </div>
          </h3>

          <div className="space-y-2.5">
            {latestNews.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectNews(article.id)}
                className="group cursor-pointer p-2 bg-transparent hover:bg-slate-100/60 border-0 transition-all flex items-center gap-3 rounded-[8px]"
              >
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-14 h-14 object-cover border border-slate-200 shrink-0 rounded-[6px]"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 flex items-center gap-1 font-medium">
                    <Clock size={11} className="text-orange-600 shrink-0" />
                    <span>{article.date}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

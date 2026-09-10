'use client';

import React from 'react';
import { Clock, HelpCircle, Package, PhoneCall, Sparkles } from 'lucide-react';
import type { Product } from '@/shared/types';
import type { PublicNewsItem } from '../../types';
import { NewsToc, type TocItem } from './NewsToc';

interface NewsSidebarProps {
  tocItems: TocItem[];
  latestNews: PublicNewsItem[];
  relatedProducts: Product[];
  onSelectNews: (id: string) => void;
  onNavigateToProduct?: (productId: number) => void;
  onOpenConsultation?: () => void;
}

export function NewsSidebar({
  tocItems,
  latestNews,
  relatedProducts,
  onSelectNews,
  onNavigateToProduct,
  onOpenConsultation,
}: NewsSidebarProps) {
  return (
    <div className="space-y-8 sticky top-24">
      {/* TABLE OF CONTENTS */}
      <NewsToc items={tocItems} />

      {/* QUICK CONTACT / HOTLINE BANNER */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-orange-400 text-xs font-black uppercase tracking-wider">
          <PhoneCall size={14} />
          <span>Hỗ trợ kỹ thuật 24/7</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Cần giải đáp về giải pháp, giấy phép bản quyền phần mềm hoặc đào tạo chuyển giao?
        </p>
        <button
          onClick={onOpenConsultation}
          className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <HelpCircle size={14} />
          <span>Liên hệ chuyên gia</span>
        </button>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Package size={15} className="text-[#FC5115]" />
            <span>Sản phẩm công nghệ liên quan</span>
          </h4>

          <div className="space-y-3">
            {relatedProducts.slice(0, 3).map((product) => {
              const productImage = product.img || (product as any).image;
              const productCategory = product.field || product.brand || (product as any).category;
              return (
                <div
                  key={product.id}
                  onClick={() => onNavigateToProduct?.(product.id)}
                  className="group cursor-pointer flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {productImage && (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img 
                        src={productImage} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#FC5115] transition-colors truncate">
                      {product.name}
                    </h5>
                    {productCategory && (
                      <span className="text-[10px] text-slate-400 block truncate">
                        {productCategory}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LATEST NEWS LIST */}
      {latestNews.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles size={15} className="text-[#FC5115]" />
            <span>Tin tức mới nhất</span>
          </h4>

          <div className="space-y-3.5">
            {latestNews.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item.id)}
                className="group cursor-pointer flex gap-3 items-start"
              >
                <div className="w-16 h-14 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock size={10} className="text-[#FC5115]" /> {item.date}
                  </span>
                  <h5 className="text-xs font-bold text-slate-800 group-hover:text-[#FC5115] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

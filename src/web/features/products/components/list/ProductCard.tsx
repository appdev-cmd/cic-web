'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Download, ShoppingCart, ChevronRight } from 'lucide-react';
import { Product } from '@shared/types';

interface ProductCardProps {
  product: Product;
  idx: number;
  onSelect: (product: Product) => void;
  onContact: (product: Product) => void;
  onDownload: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export function ProductCard({
  product,
  idx,
  onSelect,
  onContact,
  onDownload,
  onBuy,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.04 }}
      onClick={() => onSelect(product)}
      className="bg-white border border-slate-200/90 hover:border-orange-500 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-[12px] group flex flex-col justify-between cursor-pointer relative overflow-hidden min-h-[285px] sm:min-h-[300px]"
    >
      <div className="space-y-3">
        {/* Image on Left (Logo size), Title on Right */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-transparent p-0 flex items-center justify-center overflow-hidden rounded-none">
            <img
              src={product.icon || product.img}
              alt={product.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-none"
            />
          </div>
          <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Giá bán:</span>
          <span className="text-sm sm:text-base font-extrabold text-orange-600 tracking-tight">
            {product.price === 'Liên hệ' ? 'Liên hệ' : product.price}
          </span>
        </div>

        {/* Short Description (Normal) & Action Buttons (On Hover) */}
        <div className="pt-2.5 border-t border-slate-100 min-h-[66px] flex flex-col justify-center">
          {/* Default state: Short description */}
          <p className="text-sm text-slate-600 font-normal leading-relaxed line-clamp-3 group-hover:hidden transition-all duration-200">
            {product.description}
          </p>

          {/* Hover state: 3 action buttons (1 xám, 1 trắng viền cam, 1 full cam) */}
          <div className="hidden group-hover:flex items-center gap-1.5 sm:gap-2 transition-all duration-200 animate-in fade-in-50">
            {/* 1. Xám: Tư vấn */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContact(product);
              }}
              className="flex-1 py-2 px-1.5 sm:px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[13px] font-semibold rounded-lg border border-slate-200/90 transition-all duration-200 flex items-center justify-center gap-1.5 text-center active:scale-95 cursor-pointer shadow-2xs"
              title="Liên hệ tư vấn"
            >
              <PhoneCall size={13.5} className="text-slate-600 shrink-0" />
              <span className="truncate">Tư vấn</span>
            </button>

            {/* 2. Trắng viền cam: Tải về */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(product);
              }}
              className="flex-1 py-2 px-1.5 sm:px-2 bg-white hover:bg-orange-50 text-orange-600 hover:text-orange-700 text-[13px] font-semibold rounded-lg border border-orange-500/80 hover:border-orange-600 transition-all duration-200 flex items-center justify-center gap-1.5 text-center active:scale-95 cursor-pointer shadow-2xs"
              title="Tải bộ cài & tài liệu"
            >
              <Download size={13.5} className="text-orange-600 shrink-0" />
              <span className="truncate">Tải về</span>
            </button>

            {/* 3. Full cam: Mua ngay */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBuy(product);
              }}
              className="flex-1 py-2 px-1.5 sm:px-2 bg-orange-600 hover:bg-orange-700 text-white text-[13px] font-semibold rounded-lg shadow-xs shadow-orange-600/30 hover:shadow-orange-600/40 transition-all duration-200 flex items-center justify-center gap-1.5 text-center active:scale-95 cursor-pointer"
              title="Đăng ký mua bản quyền / sản phẩm"
            >
              <ShoppingCart size={13.5} className="text-white shrink-0" />
              <span className="truncate">Mua ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Action at Bottom */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-[13px] font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
        <span className="font-bold tracking-tight">Chi tiết sản phẩm</span>
        <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}

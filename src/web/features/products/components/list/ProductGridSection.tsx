'use client';

import React from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@shared/types';
import { ProductCard } from './ProductCard';

interface ProductGridSectionProps {
  products: Product[];
  paginatedProducts: Product[];
  totalProductsCount: number;
  activeFiltersCount: number;
  search: string;
  onClearSearch: () => void;
  selectedFields: string[];
  onToggleField: (item: string) => void;
  selectedBrands: string[];
  onToggleBrand: (item: string) => void;
  selectedApps: string[];
  onToggleApp: (item: string) => void;
  selectedProductTypes: string[];
  onToggleProductType: (item: string) => void;
  onResetFilters: () => void;
  sortBy: 'default' | 'name-asc';
  onToggleSort: () => void;
  currentPage: number;
  totalPages: number;
  paginationItems: (number | 'ellipsis')[];
  onPageChange: (page: number) => void;
  onSelectProduct: (product: Product) => void;
  onContact: (product: Product) => void;
  onDownload: (product: Product) => void;
  onBuy: (product: Product) => void;
}

export function ProductGridSection({
  products,
  paginatedProducts,
  totalProductsCount,
  activeFiltersCount,
  search,
  onClearSearch,
  selectedFields,
  onToggleField,
  selectedBrands,
  onToggleBrand,
  selectedApps,
  onToggleApp,
  selectedProductTypes,
  onToggleProductType,
  onResetFilters,
  sortBy,
  onToggleSort,
  currentPage,
  totalPages,
  paginationItems,
  onPageChange,
  onSelectProduct,
  onContact,
  onDownload,
  onBuy,
}: ProductGridSectionProps) {
  return (
    <div className="lg:col-span-9 flex flex-col gap-6">
      {/* Active Filters Bar */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50/80 border border-orange-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs rounded-[10px]"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase text-orange-950 tracking-wider flex items-center gap-1.5 mr-1">
              <SlidersHorizontal size={13} className="text-orange-600" />
              Đang lọc ({activeFiltersCount}):
            </span>

            {/* Search Chip */}
            {search.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                <span className="text-slate-400 font-normal">Từ khóa:</span> "{search}"
                <button
                  onClick={onClearSearch}
                  className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                  title="Xóa lọc từ khóa"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Fields Chips */}
            {selectedFields.map((f) => (
              <span key={`chip-f-${f}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                <span className="text-orange-600 font-normal">Lĩnh vực:</span> {f}
                <button
                  onClick={() => onToggleField(f)}
                  className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                  title={`Bỏ chọn ${f}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* Brands Chips */}
            {selectedBrands.map((b) => (
              <span key={`chip-b-${b}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                <span className="text-orange-600 font-normal">Hãng:</span> {b}
                <button
                  onClick={() => onToggleBrand(b)}
                  className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                  title={`Bỏ chọn ${b}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* Apps Chips */}
            {selectedApps.map((application) => (
              <span key={`chip-a-${application}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                <span className="text-orange-600 font-normal">Ứng dụng:</span> {application}
                <button
                  onClick={() => onToggleApp(application)}
                  className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                  title={`Bỏ chọn ${application}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* Product Types Chips */}
            {selectedProductTypes.map((pt) => (
              <span key={`chip-pt-${pt}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                <span className="text-orange-600 font-normal">Loại:</span> {pt}
                <button
                  onClick={() => onToggleProductType(pt)}
                  className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                  title={`Bỏ chọn ${pt}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-red-200 px-3 py-1.5 transition-colors shrink-0 self-start sm:self-auto shadow-2xs rounded-[8px]"
          >
            <RefreshCw size={11} /> Xóa tất cả bộ lọc
          </button>
        </motion.div>
      )}

      {/* Listing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <span className="text-sm font-bold uppercase tracking-wider text-[#444] flex items-center gap-2">
          Danh sách sản phẩm
          <span className="px-2.5 py-0.5 bg-orange-600/10 text-orange-600 text-xs font-bold rounded-[8px]">
            {totalProductsCount} Kết quả
          </span>
        </span>

        {/* Sort A-Z Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onToggleSort}
            className={`px-4 py-2 text-xs font-black border uppercase tracking-wider transition-all flex items-center gap-2 rounded-[8px] ${
              sortBy === 'name-asc'
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-orange-600 hover:text-orange-600'
            }`}
          >
            {sortBy === 'name-asc' ? '✓ Danh sách từ A-Z' : 'Xem danh sách từ A-Z'}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4">
          {paginatedProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              idx={idx}
              onSelect={onSelectProduct}
              onContact={onContact}
              onDownload={onDownload}
              onBuy={onBuy}
            />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white border border-slate-200 p-8">
          <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <SlidersHorizontal size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-slate-500 font-medium text-sm max-w-md mx-auto mb-6">
            Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng làm mới bộ lọc và thử lại.
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-orange-600 text-white font-black uppercase tracking-wider text-xs hover:bg-orange-700 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </motion.div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px]"
          >
            <ChevronLeft size={16} />
          </button>

          {paginationItems.map((item, idx) => {
            if (item === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-10 h-10 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
                >
                  …
                </span>
              );
            }
            return (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`w-10 h-10 border flex items-center justify-center text-xs font-black transition-all rounded-[8px] ${
                  currentPage === item
                    ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-600 hover:text-orange-600'
                }`}
              >
                {item}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

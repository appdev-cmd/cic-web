import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import type { ProductCategory, ProductBrand } from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';

export interface ProductsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedBrand: string;
  onBrandChange: (value: string) => void;
  selectedProductType: string;
  onProductTypeChange: (value: string) => void;
  selectedApplication: string;
  onApplicationChange: (value: string) => void;
  categories: ProductCategory[];
  brands: ProductBrand[];
  productTypes: MasterProductTypeItem[];
  applications: MasterApplicationItem[];
  isFilterActive: boolean;
  onResetFilters: () => void;
}

export const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  selectedProductType,
  onProductTypeChange,
  selectedApplication,
  onApplicationChange,
  categories,
  brands,
  productTypes,
  applications,
  isFilterActive,
  onResetFilters,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Ô Tìm kiếm (Search Box) */}
        <div className="relative flex items-center w-full sm:w-56 lg:w-64 shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo Tên, SKU, Hãng..."
            className="w-full h-9.5 pl-9 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter 1: Lĩnh vực */}
        <div className="min-w-[130px] flex-1 max-w-[180px]">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
            title="Lọc theo Lĩnh vực"
          >
            <option value="all">Tất cả Lĩnh vực</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 2: Hãng sản xuất */}
        <div className="min-w-[140px] flex-1 max-w-[200px]">
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
            title="Lọc theo Hãng sản xuất"
          >
            <option value="all">Tất cả Hãng sản xuất</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 3: Loại sản phẩm */}
        <div className="min-w-[140px] flex-1 max-w-[200px]">
          <select
            value={selectedProductType}
            onChange={(e) => onProductTypeChange(e.target.value)}
            className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
            title="Lọc theo Loại sản phẩm"
          >
            <option value="all">Tất cả Loại sản phẩm</option>
            {productTypes
              .filter((t) => t.status === 'active')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </div>

        {/* Filter 4: Ứng dụng */}
        <div className="min-w-[140px] flex-1 max-w-[200px]">
          <select
            value={selectedApplication}
            onChange={(e) => onApplicationChange(e.target.value)}
            className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
            title="Lọc theo Ứng dụng"
          >
            <option value="all">Tất cả Ứng dụng</option>
            {applications
              .filter((a) => a.status === 'active')
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </select>
        </div>

        {/* Cụm nút thao tác bên phải: Đặt lại */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Nút Đặt lại */}
          <button
            type="button"
            disabled={!isFilterActive}
            onClick={onResetFilters}
            className={`flex h-9.5 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              isFilterActive
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 dark:hover:bg-orange-900/80 shadow-xs'
                : 'text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 disabled:cursor-not-allowed disabled:opacity-50'
            }`}
            title="Đặt lại tất cả bộ lọc và tìm kiếm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};

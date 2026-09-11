'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, Check, SlidersHorizontal, Layers, Box, FileText, Tag, ChevronUp, ChevronDown } from 'lucide-react';
import { Product } from '@shared/types';

interface ProductFilterSidebarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedFields: string[];
  onToggleField: (item: string) => void;
  onClearFields: () => void;
  selectedBrands: string[];
  onToggleBrand: (item: string) => void;
  onClearBrands: () => void;
  selectedApps: string[];
  onToggleApp: (item: string) => void;
  onClearApps: () => void;
  selectedProductTypes: string[];
  onToggleProductType: (item: string) => void;
  onClearProductTypes: () => void;
  fields: string[];
  brands: string[];
  apps: string[];
  productTypeOptions?: string[];
  productsData: Product[];
  activeFiltersCount: number;
  isMobileFilterOpen: boolean;
  getProductType: (product: Product) => string;
}

export function ProductFilterSidebar({
  search,
  onSearchChange,
  selectedFields,
  onToggleField,
  onClearFields,
  selectedBrands,
  onToggleBrand,
  onClearBrands,
  selectedApps,
  onToggleApp,
  onClearApps,
  selectedProductTypes,
  onToggleProductType,
  onClearProductTypes,
  fields,
  brands,
  apps,
  productTypeOptions,
  productsData,
  activeFiltersCount,
  isMobileFilterOpen,
  getProductType,
}: ProductFilterSidebarProps) {
  // Accordion open/close states
  const [isFieldsOpen, setIsFieldsOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);
  const [isAppsOpen, setIsAppsOpen] = useState(true);
  const [isTypesOpen, setIsTypesOpen] = useState(true);

  // Show more / Show less states
  const [isFieldsExpanded, setIsFieldsExpanded] = useState(false);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [isAppsExpanded, setIsAppsExpanded] = useState(false);

  const displayedFields = isFieldsExpanded ? fields : fields.slice(0, 10);
  const displayedBrands = isBrandsExpanded ? brands : brands.slice(0, 10);
  const displayedApps = isAppsExpanded ? apps : apps.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full lg:col-span-3 bg-white border border-slate-200 p-5 shadow-xs sticky top-28 rounded-[10px] ${
        isMobileFilterOpen ? 'block' : 'hidden lg:block'
      }`}
    >
      {/* Sidebar Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
        <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-slate-900">
          <SlidersHorizontal size={16} className="text-orange-600" />
          Bộ lọc tìm kiếm
        </span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-[8px]">
            Đã chọn {activeFiltersCount}
          </span>
        )}
      </div>

      {/* Compact Search Input */}
      <div className="mb-5">
        <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">Từ khóa</label>
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            <Search size={15} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nhập tên sản phẩm..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:bg-white focus:outline-none px-3 py-1.5 pl-8 pr-8 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 rounded-[8px]"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Accordion Filter 1: Field (Lĩnh vực) */}
      <div className="border-b border-slate-100 pb-3 mb-3">
        <div
          onClick={() => setIsFieldsOpen(!isFieldsOpen)}
          className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
        >
          <span className="flex items-center gap-1.5">
            <Layers size={15} className="text-orange-600" />
            Lĩnh vực
            {selectedFields.length > 0 && (
              <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                {selectedFields.length}
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            {selectedFields.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFields();
                }}
                className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                title="Xóa bộ lọc lĩnh vực"
              >
                Xóa
              </button>
            )}
            {isFieldsOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
          </div>
        </div>

        {isFieldsOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-1">
            {displayedFields.map((field) => {
              const isSelected = selectedFields.includes(field);
              const count = productsData.filter((product) =>
                (product.categories?.length ? product.categories : product.field ? [product.field] : []).includes(field),
              ).length;
              return (
                <button
                  key={field}
                  onClick={() => onToggleField(field)}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal'
                      : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{field}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                </button>
              );
            })}
            {fields.length > 10 && (
              <button
                onClick={() => setIsFieldsExpanded(!isFieldsExpanded)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors pt-1 px-2.5 flex items-center gap-1"
              >
                {isFieldsExpanded ? 'Thu gọn ▲' : `Xem thêm (${fields.length - 10}) ▼`}
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Accordion Filter 2: Brand (Hãng phát triển) */}
      <div className="border-b border-slate-100 pb-3 mb-3">
        <div
          onClick={() => setIsBrandsOpen(!isBrandsOpen)}
          className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
        >
          <span className="flex items-center gap-1.5">
            <Box size={15} className="text-orange-600" />
            Hãng phát triển
            {selectedBrands.length > 0 && (
              <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                {selectedBrands.length}
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            {selectedBrands.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearBrands();
                }}
                className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                title="Xóa bộ lọc hãng phát triển"
              >
                Xóa
              </button>
            )}
            {isBrandsOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
          </div>
        </div>

        {isBrandsOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-1">
            {displayedBrands.map((brand) => {
              const isSelected = selectedBrands.includes(brand);
              const count = productsData.filter((p) => p.brand === brand).length;
              return (
                <button
                  key={brand}
                  onClick={() => onToggleBrand(brand)}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal'
                      : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{brand}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                </button>
              );
            })}
            {brands.length > 10 && (
              <button
                onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors pt-1 px-2.5 flex items-center gap-1"
              >
                {isBrandsExpanded ? 'Thu gọn ▲' : `Xem thêm (${brands.length - 10}) ▼`}
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Accordion Filter 3: Application (Ứng dụng) */}
      <div className="border-b border-slate-100 pb-3 mb-3">
        <div
          onClick={() => setIsAppsOpen(!isAppsOpen)}
          className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
        >
          <span className="flex items-center gap-1.5">
            <FileText size={15} className="text-orange-600" />
            Ứng dụng
            {selectedApps.length > 0 && (
              <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                {selectedApps.length}
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            {selectedApps.length > 0 && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onClearApps();
                }}
                className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                title="Xóa bộ lọc ứng dụng"
              >
                Xóa
              </button>
            )}
            {isAppsOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
          </div>
        </div>

        {isAppsOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-1">
            {displayedApps.map((app) => {
              const isSelected = selectedApps.includes(app);
              const count = productsData.filter((product) =>
                (product.applications?.length ? product.applications : product.app ? [product.app] : []).includes(app),
              ).length;
              return (
                <button
                  key={app}
                  onClick={() => onToggleApp(app)}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal'
                      : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{app}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                </button>
              );
            })}
            {apps.length > 10 && (
              <button
                onClick={() => setIsAppsExpanded(!isAppsExpanded)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors pt-1 px-2.5 flex items-center gap-1"
              >
                {isAppsExpanded ? 'Thu gọn ▲' : `Xem thêm (${apps.length - 10}) ▼`}
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Accordion Filter 4: Product Type (Loại sản phẩm) */}
      <div>
        <div
          onClick={() => setIsTypesOpen(!isTypesOpen)}
          className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
        >
          <span className="flex items-center gap-1.5">
            <Tag size={15} className="text-orange-600" />
            Loại sản phẩm
            {selectedProductTypes.length > 0 && (
              <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                {selectedProductTypes.length}
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            {selectedProductTypes.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearProductTypes();
                }}
                className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                title="Xóa bộ lọc loại sản phẩm"
              >
                Xóa
              </button>
            )}
            {isTypesOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
          </div>
        </div>

        {isTypesOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-1">
            {(productTypeOptions ?? []).map((type) => {
              const isSelected = selectedProductTypes.includes(type);
              const count = productsData.filter((p) => getProductType(p) === type).length;
              return (
                <button
                  key={type}
                  onClick={() => onToggleProductType(type)}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal'
                      : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{type}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

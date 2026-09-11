'use client';

import React, { useMemo } from 'react';
import {
  Building,
  Cpu,
  Globe,
  Landmark,
  LayoutGrid,
  Newspaper,
  Tag,
  Users,
} from 'lucide-react';
import type { PublicNewsCategoryItem } from '../../types';

export type NewsCategoryTabId = string;

export function getCategoryIcon(alias: string, name?: string) {
  const a = (alias || '').toLowerCase();
  const n = (name || '').toLowerCase();
  if (a === 'all') return LayoutGrid;
  if (a.includes('cong-ty') || a.includes('company') || n.includes('công ty')) return Building;
  if (a.includes('chuyen-nganh') || a.includes('phan-mem') || a.includes('special') || n.includes('chuyên ngành') || n.includes('phần mềm')) return Cpu;
  if (a.includes('quoc-te') || a.includes('international') || n.includes('quốc tế')) return Globe;
  if (a.includes('tuyen-dung') || a.includes('recruit') || n.includes('tuyển dụng')) return Users;
  if (a.includes('khuyen-mai') || a.includes('promo') || n.includes('khuyến mại')) return Tag;
  if (a.includes('co-dong') || a.includes('investor') || a.includes('shareholder') || n.includes('cổ đông')) return Landmark;
  return Newspaper;
}

const FALLBACK_CATEGORIES: PublicNewsCategoryItem[] = [
  { id: '7', name: 'Tin công ty', alias: 'tin-cong-ty', ordering: 1 },
  { id: '8', name: 'Tin chuyên ngành', alias: 'tin-chuyen-nganh', ordering: 2 },
  { id: '9', name: 'Tin khuyến mại', alias: 'tin-khuyen-mai', ordering: 3 },
  { id: '10', name: 'Tin tuyển dụng', alias: 'tin-tuyen-dung', ordering: 4 },
  { id: '11', name: 'Quan hệ cổ đông', alias: 'quan-he-co-dong', ordering: 5 },
  { id: '12', name: 'Thông báo cổ đông', alias: 'thong-bao-co-dong', parentId: '11', ordering: 6 },
  { id: '15', name: 'Báo cáo thường niên', alias: 'bao-cao-thuong-nien', parentId: '11', ordering: 7 },
  { id: '13', name: 'Điều lệ công ty', alias: 'dieu-le-cong-ty', parentId: '11', ordering: 8 },
  { id: '14', name: 'Báo cáo tài chính', alias: 'bao-cao-tai-chinh', parentId: '11', ordering: 9 },
];

interface NewsCategoryTabsProps {
  categories?: PublicNewsCategoryItem[];
  activeCategory: NewsCategoryTabId;
  onSelectCategory: (cat: NewsCategoryTabId) => void;
  shareholderDocType: string;
  onSelectShareholderDocType: (docType: string) => void;
}

export function NewsCategoryTabs({
  categories = [],
  activeCategory,
  onSelectCategory,
  shareholderDocType,
  onSelectShareholderDocType,
}: NewsCategoryTabsProps) {
  const effectiveCategories = useMemo(() => {
    return categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  }, [categories]);

  // Top level categories (no parentId)
  const topCategories = useMemo(() => {
    return effectiveCategories.filter((c) => !c.parentId);
  }, [effectiveCategories]);

  // Active category object
  const currentCategoryObj = useMemo(() => {
    return effectiveCategories.find(
      (c) => c.alias === activeCategory || c.id === activeCategory
    );
  }, [effectiveCategories, activeCategory]);

  // Check if active category is shareholder or has child categories
  const childCategories = useMemo(() => {
    if (!currentCategoryObj) {
      if (activeCategory === 'shareholder' || activeCategory === 'quan-he-co-dong') {
        return effectiveCategories.filter((c) => c.parentId === '11' || c.alias.includes('co-dong') || c.alias.includes('bao-cao') || c.alias.includes('dieu-le'));
      }
      return [];
    }
    return effectiveCategories.filter((c) => c.parentId === currentCategoryObj.id);
  }, [effectiveCategories, currentCategoryObj, activeCategory]);

  const isShareholderCategory = 
    activeCategory === 'shareholder' ||
    activeCategory === 'quan-he-co-dong' ||
    currentCategoryObj?.alias === 'quan-he-co-dong' ||
    currentCategoryObj?.id === '11';

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* Tab: Tất cả */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`group shrink-0 px-3 py-1.5 text-xs sm:text-[13px] transition-all rounded-[8px] flex items-center gap-2 border cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#FC5115] text-white border-[#FC5115] shadow-md shadow-orange-500/20 font-bold'
              : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-600 font-semibold shadow-xs'
          }`}
        >
          <LayoutGrid
            size={15}
            className={`transition-colors shrink-0 ${
              activeCategory === 'all' ? 'text-white' : 'text-orange-500 group-hover:text-orange-600'
            }`}
          />
          <span>Tất cả</span>
        </button>

        {/* Dynamic categories from database */}
        {topCategories.map((cat) => {
          const isSelected =
            activeCategory === cat.alias ||
            activeCategory === cat.id ||
            (cat.alias === 'tin-cong-ty' && activeCategory === 'company') ||
            (cat.alias === 'tin-chuyen-nganh' && activeCategory === 'specialty') ||
            (cat.alias === 'tin-khuyen-mai' && activeCategory === 'promotion') ||
            (cat.alias === 'tin-tuyen-dung' && activeCategory === 'recruitment') ||
            (cat.alias === 'quan-he-co-dong' && activeCategory === 'shareholder');

          const CatIcon = getCategoryIcon(cat.alias, cat.name);
          return (
            <button
              key={cat.id || cat.alias}
              onClick={() => onSelectCategory(cat.alias)}
              className={`group shrink-0 px-3 py-1.5 text-xs sm:text-[13px] transition-all rounded-[8px] flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-[#FC5115] text-white border-[#FC5115] shadow-md shadow-orange-500/20 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-600 font-semibold shadow-xs'
              }`}
            >
              <CatIcon
                size={15}
                className={`transition-colors shrink-0 ${
                  isSelected ? 'text-white' : 'text-orange-500 group-hover:text-orange-600'
                }`}
              />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* SUBMENU TABS (for Shareholder or categories with children) */}
      {(isShareholderCategory || childCategories.length > 0) && (
        <div className="pt-2 pb-1 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Subtab: Tất cả tài liệu */}
          <button
            onClick={() => onSelectShareholderDocType('Tất cả tài liệu')}
            className={`shrink-0 px-4 py-2 text-xs font-bold transition-all rounded-[6px] cursor-pointer ${
              shareholderDocType === 'Tất cả tài liệu' || shareholderDocType === 'all'
                ? 'bg-[#FC5115] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tất cả tài liệu
          </button>

          {/* Child categories from DB */}
          {childCategories.map((child) => {
            const isSelected =
              shareholderDocType === child.name ||
              shareholderDocType === child.alias ||
              shareholderDocType === child.id;

            return (
              <button
                key={child.id || child.alias}
                onClick={() => onSelectShareholderDocType(child.name)}
                className={`shrink-0 px-4 py-2 text-xs font-bold transition-all rounded-[6px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#FC5115] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {child.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import {
  Building,
  Cpu,
  Globe,
  Landmark,
  LayoutGrid,
  Tag,
  Users,
} from 'lucide-react';
import type { PublicNewsCategory } from '../../types';

export type NewsCategoryTabId = 'all' | PublicNewsCategory;

export const CATEGORIES_LIST = [
  { id: 'all' as const, label: 'Tất cả', icon: LayoutGrid },
  { id: 'company' as const, label: 'Tin CIC Tech', icon: Building },
  { id: 'specialty' as const, label: 'Tin chuyên ngành', icon: Cpu },
  { id: 'international' as const, label: 'Hợp tác quốc tế', icon: Globe },
  { id: 'recruitment' as const, label: 'Tuyển dụng', icon: Users },
  { id: 'promotion' as const, label: 'Khuyến mại', icon: Tag },
  { id: 'shareholder' as const, label: 'Quan hệ cổ đông', icon: Landmark },
];

export const SHAREHOLDER_DOC_TYPES = [
  'Tất cả tài liệu',
  'Nghị quyết',
  'Báo cáo',
  'Thông báo',
  'Điều lệ',
  'Tài chính',
];

interface NewsCategoryTabsProps {
  activeCategory: NewsCategoryTabId;
  onSelectCategory: (cat: NewsCategoryTabId) => void;
  shareholderDocType: string;
  onSelectShareholderDocType: (docType: string) => void;
}

export function NewsCategoryTabs({
  activeCategory,
  onSelectCategory,
  shareholderDocType,
  onSelectShareholderDocType,
}: NewsCategoryTabsProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const CatIcon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group shrink-0 px-3 py-1.5 text-xs sm:text-[13px] transition-all rounded-[8px] flex items-center gap-2 border ${
                isSelected 
                  ? 'bg-[#FC5115] text-white border-[#FC5115] shadow-md shadow-orange-500/20 font-bold' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-600 font-semibold shadow-xs'
              }`}
            >
              <CatIcon 
                size={15} 
                className={`transition-colors shrink-0 ${
                  isSelected 
                    ? 'text-white' 
                    : 'text-orange-500 group-hover:text-orange-600'
                }`} 
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* SHAREHOLDER SUBMENU TABS */}
      {activeCategory === 'shareholder' && (
        <div className="pt-2 pb-1 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {SHAREHOLDER_DOC_TYPES.map((dt) => {
            const isSelected = shareholderDocType === dt;
            return (
              <button
                key={dt}
                onClick={() => onSelectShareholderDocType(dt)}
                className={`shrink-0 px-4 py-2 text-xs font-bold transition-all rounded-[6px] ${
                  isSelected
                    ? 'bg-[#FC5115] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {dt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

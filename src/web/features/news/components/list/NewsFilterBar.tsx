'use client';

import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useI18n } from '@/shared/i18n';
import type { NewsCategoryTabId } from './NewsCategoryTabs';

interface NewsFilterBarProps {
  activeCategory: NewsCategoryTabId;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  // Sub-filter states
  companySubType: string;
  onCompanySubTypeChange: (v: string) => void;
  specialtySubType: string;
  onSpecialtySubTypeChange: (v: any) => void;
  internationalSubType: string;
  onInternationalSubTypeChange: (v: string) => void;
  recruitmentDept: string;
  onRecruitmentDeptChange: (v: any) => void;
  recruitmentLoc: string;
  onRecruitmentLocChange: (v: any) => void;
  recruitmentStatus: string;
  onRecruitmentStatusChange: (v: any) => void;
  promotionStatus: string;
  onPromotionStatusChange: (v: any) => void;
  shareholderYear: number;
  onShareholderYearChange: (v: number) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  hasActiveFilters: boolean;
}

export function NewsFilterBar({
  activeCategory,
  searchQuery,
  onSearchChange,
  companySubType,
  onCompanySubTypeChange,
  specialtySubType,
  onSpecialtySubTypeChange,
  internationalSubType,
  onInternationalSubTypeChange,
  recruitmentDept,
  onRecruitmentDeptChange,
  recruitmentLoc,
  onRecruitmentLocChange,
  recruitmentStatus,
  onRecruitmentStatusChange,
  promotionStatus,
  onPromotionStatusChange,
  shareholderYear,
  onShareholderYearChange,
  onResetFilters,
  totalFilteredCount,
  hasActiveFilters,
}: NewsFilterBarProps) {
  const { locale } = useI18n();
  const isEn = locale === 'en';

  return (
    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-[12px] space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* SEARCH BAR */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isEn ? "Search title, keywords, news content..." : "Tìm kiếm tiêu đề, từ khóa, nội dung tin tức..."}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* CATEGORY SPECIFIC SUB-FILTERS */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {activeCategory === 'company' && (
            <select
              value={companySubType}
              onChange={(e) => onCompanySubTypeChange(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
            >
              <option value="Tất cả">{isEn ? 'All topics' : 'Tất cả chủ đề'}</option>
              <option value="Hoạt động CIC">{isEn ? 'CIC Activities' : 'Hoạt động CIC'}</option>
              <option value="Thông báo">{isEn ? 'Announcements' : 'Thông báo'}</option>
              <option value="Văn hóa doanh nghiệp">{isEn ? 'Corporate Culture' : 'Văn hóa doanh nghiệp'}</option>
            </select>
          )}

          {activeCategory === 'specialty' && (
            <select
              value={specialtySubType}
              onChange={(e) => onSpecialtySubTypeChange(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
            >
              <option value="Tất cả">{isEn ? 'All topics' : 'Tất cả chủ đề'}</option>
              <option value="Kiến thức">{isEn ? 'Knowledge' : 'Kiến thức'}</option>
              <option value="Cập nhật công nghệ">{isEn ? 'Tech Updates' : 'Cập nhật công nghệ'}</option>
              <option value="Chính sách">{isEn ? 'Policies' : 'Chính sách'}</option>
              <option value="Giải pháp">{isEn ? 'Solutions' : 'Giải pháp'}</option>
            </select>
          )}

          {activeCategory === 'international' && (
            <select
              value={internationalSubType}
              onChange={(e) => onInternationalSubTypeChange(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
            >
              <option value="Tất cả">{isEn ? 'All partners & topics' : 'Tất cả đối tác & chủ đề'}</option>
              <option value="Đối tác chiến lược">{isEn ? 'Strategic Partners' : 'Đối tác chiến lược'}</option>
              <option value="Chuyển giao công nghệ">{isEn ? 'Technology Transfer' : 'Chuyển giao công nghệ'}</option>
              <option value="Hội nghị quốc tế">{isEn ? 'International Conferences' : 'Hội nghị quốc tế'}</option>
              <option value="Dự án quốc tế">{isEn ? 'International Projects' : 'Dự án quốc tế'}</option>
            </select>
          )}

          {activeCategory === 'recruitment' && (
            <>
              <select
                value={recruitmentDept}
                onChange={(e) => onRecruitmentDeptChange(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="Tất cả">{isEn ? 'All departments' : 'Tất cả phòng ban'}</option>
                <option value="Khối Kỹ thuật">{isEn ? 'Technical Division' : 'Khối Kỹ thuật'}</option>
                <option value="Khối Kinh doanh">{isEn ? 'Sales Division' : 'Khối Kinh doanh'}</option>
                <option value="Khối Hỗ trợ">{isEn ? 'Support Division' : 'Khối Hỗ trợ'}</option>
                <option value="Khối Nghiên cứu & Phát triển">{isEn ? 'R&D Division' : 'Khối R&D'}</option>
              </select>

              <select
                value={recruitmentLoc}
                onChange={(e) => onRecruitmentLocChange(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="Tất cả">{isEn ? 'All locations' : 'Tất cả địa điểm'}</option>
                <option value="Hà Nội">{isEn ? 'Hanoi' : 'Hà Nội'}</option>
                <option value="TP. Hồ Chí Minh">{isEn ? 'Ho Chi Minh City' : 'TP. Hồ Chí Minh'}</option>
                <option value="Đà Nẵng">{isEn ? 'Da Nang' : 'Đà Nẵng'}</option>
              </select>

              <select
                value={recruitmentStatus}
                onChange={(e) => onRecruitmentStatusChange(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
              >
                <option value="Tất cả">{isEn ? 'All statuses' : 'Tất cả trạng thái'}</option>
                <option value="Đang tuyển">{isEn ? 'Hiring' : 'Đang tuyển'}</option>
                <option value="Đã hết hạn">{isEn ? 'Expired' : 'Đã hết hạn'}</option>
              </select>
            </>
          )}

          {activeCategory === 'promotion' && (
            <select
              value={promotionStatus}
              onChange={(e) => onPromotionStatusChange(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
            >
              <option value="Tất cả">{isEn ? 'All promotions' : 'Tất cả ưu đãi'}</option>
              <option value="Đang diễn ra">{isEn ? 'Ongoing' : 'Đang diễn ra'}</option>
              <option value="Đã kết thúc">{isEn ? 'Ended' : 'Đã kết thúc'}</option>
            </select>
          )}

          {activeCategory === 'shareholder' && (
            <select
              value={shareholderYear}
              onChange={(e) => onShareholderYearChange(Number(e.target.value))}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500"
            >
              <option value={0}>{isEn ? 'All years' : 'Tất cả các năm'}</option>
              <option value={2026}>{isEn ? 'Year 2026' : 'Năm 2026'}</option>
              <option value={2025}>{isEn ? 'Year 2025' : 'Năm 2025'}</option>
              <option value={2024}>{isEn ? 'Year 2024' : 'Năm 2024'}</option>
              <option value={2023}>{isEn ? 'Year 2023' : 'Năm 2023'}</option>
            </select>
          )}

          {/* RESET FILTER BUTTON */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-[8px] transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{isEn ? 'Reset filters' : 'Xóa bộ lọc'}</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER SUMMARY BAR */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-[#FC5115]" />
          <span>
            {isEn ? (
              <>Found <strong>{totalFilteredCount}</strong> articles</>
            ) : (
              <>Tìm thấy <strong>{totalFilteredCount}</strong> bài viết</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

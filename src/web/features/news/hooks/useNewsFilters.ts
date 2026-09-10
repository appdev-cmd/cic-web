'use client';

import { useMemo, useState } from 'react';
import type { PublicNewsItem } from '../types';
import type { NewsCategoryTabId } from '../components/list/NewsCategoryTabs';

interface UseNewsFiltersOptions {
  items: PublicNewsItem[];
  initialCategory?: NewsCategoryTabId;
}

export function useNewsFilters({ items, initialCategory = 'all' }: UseNewsFiltersOptions) {
  const [activeCategory, setActiveCategory] = useState<NewsCategoryTabId>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Category-specific sub-filters
  const [companySubType, setCompanySubType] = useState<string>('Tất cả');
  const [specialtySubType, setSpecialtySubType] = useState<'Tất cả' | 'Kiến thức' | 'Cập nhật công nghệ' | 'Chính sách' | 'Giải pháp'>('Tất cả');
  const [internationalSubType, setInternationalSubType] = useState<string>('Tất cả');
  const [recruitmentDept, setRecruitmentDept] = useState<'Tất cả' | 'Khối Kỹ thuật' | 'Khối Kinh doanh' | 'Khối Hỗ trợ' | 'Khối Nghiên cứu & Phát triển'>('Tất cả');
  const [recruitmentLoc, setRecruitmentLoc] = useState<'Tất cả' | 'Hà Nội' | 'TP. Hồ Chí Minh' | 'Đà Nẵng'>('Tất cả');
  const [recruitmentStatus, setRecruitmentStatus] = useState<'Tất cả' | 'Đang tuyển' | 'Đã hết hạn'>('Tất cả');
  const [promotionStatus, setPromotionStatus] = useState<'Tất cả' | 'Đang diễn ra' | 'Đã kết thúc'>('Tất cả');
  const [shareholderYear, setShareholderYear] = useState<number>(0);
  const [shareholderDocType, setShareholderDocType] = useState<string>('Tất cả tài liệu');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      searchQuery.trim() ||
      companySubType !== 'Tất cả' ||
      specialtySubType !== 'Tất cả' ||
      internationalSubType !== 'Tất cả' ||
      recruitmentDept !== 'Tất cả' ||
      recruitmentLoc !== 'Tất cả' ||
      recruitmentStatus !== 'Tất cả' ||
      promotionStatus !== 'Tất cả' ||
      shareholderYear !== 0 ||
      shareholderDocType !== 'Tất cả tài liệu'
    );
  }, [
    searchQuery,
    companySubType,
    specialtySubType,
    internationalSubType,
    recruitmentDept,
    recruitmentLoc,
    recruitmentStatus,
    promotionStatus,
    shareholderYear,
    shareholderDocType,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setCompanySubType('Tất cả');
    setSpecialtySubType('Tất cả');
    setInternationalSubType('Tất cả');
    setRecruitmentDept('Tất cả');
    setRecruitmentLoc('Tất cả');
    setRecruitmentStatus('Tất cả');
    setPromotionStatus('Tất cả');
    setShareholderYear(0);
    setShareholderDocType('Tất cả tài liệu');
    setCurrentPage(1);
  };

  const handleSelectCategory = (cat: NewsCategoryTabId) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const filteredNews = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.shortDesc.toLowerCase().includes(q);
        const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      // Company Sub-filter
      if (activeCategory === 'company' && companySubType !== 'Tất cả') {
        if (item.subType !== companySubType) return false;
      }

      // Specialty Sub-filter
      if (activeCategory === 'specialty' && specialtySubType !== 'Tất cả') {
        if (item.subType !== specialtySubType) return false;
      }

      // International Sub-filter
      if (activeCategory === 'international' && internationalSubType !== 'Tất cả') {
        if (item.subType !== internationalSubType) return false;
      }

      // Recruitment Sub-filters
      if (activeCategory === 'recruitment') {
        if (recruitmentDept !== 'Tất cả' && item.department !== recruitmentDept) return false;
        if (recruitmentLoc !== 'Tất cả' && item.location !== recruitmentLoc) return false;
        if (recruitmentStatus !== 'Tất cả' && item.status !== recruitmentStatus) return false;
      }

      // Promotion Sub-filter
      if (activeCategory === 'promotion' && promotionStatus !== 'Tất cả') {
        if (item.status !== promotionStatus) return false;
      }

      // Shareholder Sub-filters
      if (activeCategory === 'shareholder') {
        if (shareholderYear !== 0 && item.year !== shareholderYear) return false;
        if (shareholderDocType !== 'Tất cả tài liệu' && item.docType !== shareholderDocType) {
          if (shareholderDocType === 'Tài chính' && !item.docType?.includes('tài chính')) return false;
          if (shareholderDocType !== 'Tài chính' && item.docType !== shareholderDocType) return false;
        }
      }

      return true;
    });
  }, [
    items,
    activeCategory,
    searchQuery,
    companySubType,
    specialtySubType,
    internationalSubType,
    recruitmentDept,
    recruitmentLoc,
    recruitmentStatus,
    promotionStatus,
    shareholderYear,
    shareholderDocType,
  ]);

  const itemsPerPage = activeCategory === 'shareholder' ? 10 : 9;
  const totalItems = filteredNews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  return {
    activeCategory,
    setActiveCategory: handleSelectCategory,
    searchQuery,
    setSearchQuery: (q: string) => { setSearchQuery(q); setCurrentPage(1); },
    companySubType,
    setCompanySubType: (v: string) => { setCompanySubType(v); setCurrentPage(1); },
    specialtySubType,
    setSpecialtySubType: (v: any) => { setSpecialtySubType(v); setCurrentPage(1); },
    internationalSubType,
    setInternationalSubType: (v: string) => { setInternationalSubType(v); setCurrentPage(1); },
    recruitmentDept,
    setRecruitmentDept: (v: any) => { setRecruitmentDept(v); setCurrentPage(1); },
    recruitmentLoc,
    setRecruitmentLoc: (v: any) => { setRecruitmentLoc(v); setCurrentPage(1); },
    recruitmentStatus,
    setRecruitmentStatus: (v: any) => { setRecruitmentStatus(v); setCurrentPage(1); },
    promotionStatus,
    setPromotionStatus: (v: any) => { setPromotionStatus(v); setCurrentPage(1); },
    shareholderYear,
    setShareholderYear: (v: number) => { setShareholderYear(v); setCurrentPage(1); },
    shareholderDocType,
    setShareholderDocType: (v: string) => { setShareholderDocType(v); setCurrentPage(1); },
    currentPage,
    setCurrentPage,
    hasActiveFilters,
    resetFilters,
    filteredNews,
    paginatedNews,
    totalPages,
    totalItems,
  };
}

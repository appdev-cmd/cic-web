'use client';

import React, { useMemo, useState } from 'react';
import type { PublicNewsItem } from '../../types';
import { useNewsFilters } from '../../hooks/useNewsFilters';
import { NewsTicker } from './NewsTicker';
import { NewsHeroSection } from './NewsHeroSection';
import { NewsCategoryTabs, type NewsCategoryTabId } from './NewsCategoryTabs';
import { NewsFilterBar } from './NewsFilterBar';
import { NewsGrid } from './NewsGrid';
import { ShareholderDocumentList } from './ShareholderDocumentList';
import { NewsPagination } from './NewsPagination';
import { NewsCtaSection } from '../shared/NewsCtaSection';

export interface NewsListViewProps {
  items: PublicNewsItem[];
  initialCategory?: NewsCategoryTabId | null;
  onSelectNews: (id: string) => void;
  onOpenConsultation?: () => void;
}

export function NewsListView({
  items,
  initialCategory = 'all',
  onSelectNews,
  onOpenConsultation,
}: NewsListViewProps) {
  const [pdfDownloadedId, setPdfDownloadedId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const filters = useNewsFilters({
    items,
    initialCategory: initialCategory || 'all',
  });

  // Hot news ticker list
  const breakingNewsList = useMemo(() => {
    const hot = items.filter((item) => item.isHot && item.category !== 'shareholder');
    if (hot.length > 0) return hot.slice(0, 6);
    return items.filter((item) => item.category !== 'shareholder').slice(0, 6);
  }, [items]);

  // Hero section items: Ưu tiên tối đa 4 bài được đánh dấu nổi bật (isHot) mới nhất, fallback bài mới nhất
  const highlightedNews = useMemo(() => {
    const hotArticles = items.filter((item) => item.isHot && item.category !== 'shareholder');
    if (hotArticles.length >= 4) {
      return hotArticles.slice(0, 4);
    }
    const hotIds = new Set(hotArticles.map((item) => item.id));
    const nonHotArticles = items.filter((item) => !hotIds.has(item.id) && item.category !== 'shareholder');
    return [...hotArticles, ...nonHotArticles].slice(0, 4);
  }, [items]);

  const handleDownloadAttachment = (e: React.MouseEvent, item: PublicNewsItem) => {
    e.stopPropagation();
    setPdfDownloadedId(item.id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPdfDownloadedId(null), 1500);
          return 100;
        }
        return prev + 25;
      });
    }, 80);
  };

  const getTypeSimpleText = (item: PublicNewsItem): string => {
    if (item.category === 'company') return item.subType || 'Tin CIC';
    if (item.category === 'specialty') return item.subType || 'Tin chuyên ngành';
    if (item.category === 'international') return item.subType || 'Hợp tác quốc tế';
    if (item.category === 'recruitment') return item.department || 'Tuyển dụng';
    if (item.category === 'promotion') return 'Khuyến mại';
    if (item.category === 'shareholder') return item.docType || 'Quan hệ cổ đông';
    return 'Tin tức';
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800">
      <div className="py-8 sm:py-12 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Main Title & Editorial Headline */}
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Tin tức &amp; Sự kiện
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
              Cập nhật thông tin hoạt động, kiến thức kỹ thuật chuyên ngành và các thông cáo cổ đông mới nhất
            </p>
          </div>

          {/* Running News Ticker */}
          <NewsTicker
            breakingNews={breakingNewsList}
            onSelectNews={onSelectNews}
          />

          {/* HERO NEWSROOM SECTION (Top Highlight Story + Vertical Side Features) */}
          {filters.activeCategory === 'all' && !filters.searchQuery && highlightedNews.length > 0 && (
            <NewsHeroSection
              highlightedNews={highlightedNews}
              onSelectNews={onSelectNews}
              getTypeSimpleText={getTypeSimpleText}
            />
          )}

          {/* CATEGORY SELECTOR PILL TABS */}
          <NewsCategoryTabs
            activeCategory={filters.activeCategory}
            onSelectCategory={filters.setActiveCategory}
            shareholderDocType={filters.shareholderDocType}
            onSelectShareholderDocType={filters.setShareholderDocType}
          />

          {/* FILTER AND SEARCH BAR */}
          <NewsFilterBar
            activeCategory={filters.activeCategory}
            searchQuery={filters.searchQuery}
            onSearchChange={filters.setSearchQuery}
            companySubType={filters.companySubType}
            onCompanySubTypeChange={filters.setCompanySubType}
            specialtySubType={filters.specialtySubType}
            onSpecialtySubTypeChange={filters.setSpecialtySubType}
            internationalSubType={filters.internationalSubType}
            onInternationalSubTypeChange={filters.setInternationalSubType}
            recruitmentDept={filters.recruitmentDept}
            onRecruitmentDeptChange={filters.setRecruitmentDept}
            recruitmentLoc={filters.recruitmentLoc}
            onRecruitmentLocChange={filters.setRecruitmentLoc}
            recruitmentStatus={filters.recruitmentStatus}
            onRecruitmentStatusChange={filters.setRecruitmentStatus}
            promotionStatus={filters.promotionStatus}
            onPromotionStatusChange={filters.setPromotionStatus}
            shareholderYear={filters.shareholderYear}
            onShareholderYearChange={filters.setShareholderYear}
            onResetFilters={filters.resetFilters}
            totalFilteredCount={filters.totalItems}
            hasActiveFilters={filters.hasActiveFilters}
          />

          {/* MAIN NEWS CONTENT CONTAINER */}
          <div className="pt-2">
            {filters.activeCategory === 'shareholder' ? (
              <ShareholderDocumentList
                items={filters.paginatedNews}
                onSelectNews={onSelectNews}
                onDownloadAttachment={handleDownloadAttachment}
                pdfDownloadedId={pdfDownloadedId}
                downloadProgress={downloadProgress}
              />
            ) : (
              <NewsGrid
                items={filters.paginatedNews}
                onSelectNews={onSelectNews}
                getTypeSimpleText={getTypeSimpleText}
                onResetFilters={filters.resetFilters}
              />
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          <NewsPagination
            currentPage={filters.currentPage}
            totalPages={filters.totalPages}
            onPageChange={filters.setCurrentPage}
          />

          {/* BOTTOM CTA BANNER */}
          <NewsCtaSection onOpenConsultation={onOpenConsultation} />
        </div>
      </div>
    </div>
  );
}

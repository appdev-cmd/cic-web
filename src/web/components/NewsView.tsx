'use client';

import React, { useState } from 'react';
import type { PublicNewsDataSet, DetailedNewsItem } from '../features/news/types';
import { NewsListView } from '../features/news/components/list/NewsListView';
import { NewsDetailView } from '../features/news/components/detail/NewsDetailView';
import type { NewsCategoryTabId } from '../features/news/components/list/NewsCategoryTabs';

export interface NewsViewProps {
  key?: string | number;
  initialCategory?: string | null;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProduct?: (productId: number) => void;
  onNavigateToProject?: (projectId: string) => void;
  onNavigateToEvent?: (eventId: string) => void;
  onNavigateHome: () => void;
  onNavigateToPrivacy?: () => void;
  onOpenConsultation?: () => void;
  previewNews?: DetailedNewsItem;
  data?: PublicNewsDataSet;
  initialNewsId?: string | null;
  onNavigateToNews?: (id: string) => void;
  onBackToNews?: () => void;
}

/**
 * Compatibility wrapper that delegates to NewsListView or NewsDetailView.
 * Kept thin to preserve legacy App.tsx compatibility while modularizing architecture.
 */
export function NewsView({
  initialCategory,
  onNavigateToProduct,
  onNavigateToProject,
  onNavigateToEvent,
  onNavigateHome,
  onOpenConsultation,
  previewNews,
  data,
  initialNewsId,
  onNavigateToNews,
  onBackToNews,
}: NewsViewProps) {
  const items = data?.items ?? (previewNews ? [previewNews] : []);
  const [selectedId, setSelectedId] = useState<string | null>(previewNews?.id || initialNewsId || null);

  const selectedArticle = previewNews || items.find((item) => item.id === selectedId);

  const handleSelectNews = (id: string) => {
    setSelectedId(id);
    onNavigateToNews?.(id);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToList = () => {
    setSelectedId(null);
    onBackToNews?.();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (selectedArticle) {
    return (
      <NewsDetailView
        article={selectedArticle}
        items={items}
        relatedProducts={data?.relatedProducts ?? []}
        relatedProjects={data?.relatedProjects ?? []}
        relatedEvents={data?.relatedEvents ?? []}
        onBackToList={handleBackToList}
        onSelectNews={handleSelectNews}
        onNavigateHome={onNavigateHome}
        onNavigateToProduct={onNavigateToProduct}
        onNavigateToProject={onNavigateToProject}
        onNavigateToEvent={onNavigateToEvent}
        onOpenConsultation={onOpenConsultation}
      />
    );
  }

  return (
    <NewsListView
      items={items}
      initialCategory={(initialCategory as NewsCategoryTabId) || 'all'}
      onSelectNews={handleSelectNews}
      onOpenConsultation={onOpenConsultation}
    />
  );
}

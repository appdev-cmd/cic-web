'use client';

import React, { useMemo } from 'react';
import type { EventItem, Product } from '@/shared/types';
import type { NewsRelatedProject, PublicNewsItem } from '../../types';
import { ReadingProgress } from './ReadingProgress';
import { NewsDetailHeader } from './NewsDetailHeader';
import { NewsDetailActions } from './NewsDetailActions';
import { NewsArticleContent } from './NewsArticleContent';
import { NewsSidebar } from './NewsSidebar';
import { NewsRelatedSections } from './NewsRelatedSections';
import { NewsCtaSection } from '../shared/NewsCtaSection';
import type { TocItem } from './NewsToc';

export interface NewsDetailViewProps {
  article: PublicNewsItem;
  items?: PublicNewsItem[];
  relatedProducts?: Product[];
  relatedProjects?: NewsRelatedProject[];
  relatedEvents?: EventItem[];
  onBackToList: () => void;
  onSelectNews: (id: string) => void;
  onNavigateHome: () => void;
  onNavigateToProduct?: (productId: number) => void;
  onNavigateToProject?: (projectId: string) => void;
  onNavigateToEvent?: (eventId: string) => void;
  onOpenConsultation?: () => void;
}

export function NewsDetailView({
  article,
  items = [],
  relatedProducts = [],
  relatedProjects = [],
  relatedEvents = [],
  onBackToList,
  onSelectNews,
  onNavigateHome,
  onNavigateToProduct,
  onNavigateToProject,
  onNavigateToEvent,
  onOpenConsultation,
}: NewsDetailViewProps) {
  // Extract TOC items from article content
  const tocItems: TocItem[] = useMemo(() => {
    if (!article.contentMarkdown) return [];
    const headings: TocItem[] = [];
    const paragraphs = article.contentMarkdown.split('\n\n');
    paragraphs.forEach((p, idx) => {
      if (p.startsWith('### ')) {
        headings.push({
          id: `section-${idx}`,
          text: p.replace('### ', ''),
          level: 2,
        });
      } else if (p.startsWith('#### ')) {
        headings.push({
          id: `section-${idx}`,
          text: p.replace('#### ', ''),
          level: 3,
        });
      }
    });
    return headings;
  }, [article.contentMarkdown]);

  // Latest news excluding current article
  const latestNews = useMemo(() => {
    return items.filter((item) => item.id !== article.id);
  }, [items, article.id]);

  // Effective linked products (from article or fallback)
  const effectiveProducts = useMemo(() => {
    if (article.relatedProductIds && article.relatedProductIds.length > 0) {
      const found = relatedProducts.filter((p) => article.relatedProductIds?.includes(p.id));
      if (found.length > 0) return found;
    }
    return relatedProducts;
  }, [article.relatedProductIds, relatedProducts]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 relative">
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* HEADER SECTION */}
        <NewsDetailHeader
          article={article}
          onBackToList={onBackToList}
          onNavigateHome={onNavigateHome}
        />

        {/* SOCIAL SHARE & ACTIONS */}
        <NewsDetailActions title={article.title} />

        {/* TWO-COLUMN GRID: ARTICLE & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* MAIN ARTICLE BODY (8 cols) */}
          <main className="lg:col-span-8">
            <NewsArticleContent article={article} />

            {/* RELATED SECTIONS (PROJECTS & EVENTS) */}
            <NewsRelatedSections
              relatedProjects={relatedProjects}
              relatedEvents={relatedEvents}
              onNavigateToProject={onNavigateToProject}
              onNavigateToEvent={onNavigateToEvent}
            />
          </main>

          {/* SIDEBAR (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            <NewsSidebar
              tocItems={tocItems}
              latestNews={latestNews}
              relatedProducts={effectiveProducts}
              onSelectNews={onSelectNews}
              onNavigateToProduct={onNavigateToProduct}
              onOpenConsultation={onOpenConsultation}
            />
          </aside>
        </div>

        {/* BOTTOM CTA BANNER */}
        <NewsCtaSection onOpenConsultation={onOpenConsultation} />
      </div>
    </div>
  );
}

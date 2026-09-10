'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { EventItem, Product } from '@/shared/types';
import type {
  NewsRelatedProject,
  PublicNewsItem,
  ShareholderNewsItem,
} from '../../types';
import { ReadingProgress } from './ReadingProgress';
import { NewsTicker } from '../list/NewsTicker';
import { NewsDetailHero } from './NewsDetailHero';
import { NewsArticleMain } from './NewsArticleMain';
import { NewsRelatedContent } from './NewsRelatedContent';
import { NewsDetailSidebar } from './NewsDetailSidebar';
import { NewsShareholderPdfSection } from './NewsShareholderPdfSection';

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
  article: selectedItem,
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
  // Share & Print state
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // TOC state
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);

  // Consultation form state
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultMessage, setConsultMessage] = useState('');
  const [isConsultSubmitting, setIsConsultSubmitting] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // PDF download simulation
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Breaking news ticker items
  const breakingNewsList = useMemo(() => {
    return items.filter((item) => item.category !== 'shareholder').slice(0, 6);
  }, [items]);

  // Latest news excluding current
  const latestNews = useMemo(() => {
    return items.filter((item) => item.id !== selectedItem.id).slice(0, 6);
  }, [items, selectedItem.id]);

  // Linked products
  const effectiveLinkedProducts = useMemo(() => {
    if (selectedItem.relatedProductIds && selectedItem.relatedProductIds.length > 0) {
      const found = relatedProducts.filter((p) => selectedItem.relatedProductIds?.includes(p.id));
      if (found.length > 0) return found;
    }
    return relatedProducts.slice(0, 4);
  }, [selectedItem.relatedProductIds, relatedProducts]);

  // Linked projects & events
  const effectiveLinkedProjects = relatedProjects.slice(0, 2);
  const effectiveLinkedEvents = relatedEvents.slice(0, 2);

  // TOC extraction
  const tocItems = useMemo(() => {
    if (!selectedItem.contentMarkdown) return [];
    const items: Array<{ id: string; title: string; fullTitle: string }> = [];

    // Nếu là HTML
    if (/<[a-z][\s\S]*>/i.test(selectedItem.contentMarkdown)) {
      const headingMatches = selectedItem.contentMarkdown.matchAll(/<h([2-4])[^>]*>(.*?)<\/h\1>/gi);
      let idx = 0;
      for (const match of headingMatches) {
        const text = match[2].replace(/<[^>]+>/g, '').trim();
        if (text) {
          items.push({
            id: `sec-heading-${idx}`,
            title: text.length > 36 ? text.substring(0, 36) + '...' : text,
            fullTitle: text,
          });
          idx++;
        }
      }
      return items;
    }

    // Nếu là Markdown
    const lines = selectedItem.contentMarkdown.split('\n');
    let idx = 0;
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
        const title = trimmed.replace(/^#{3,4}\s+/, '').replace(/\*\*/g, '').trim();
        if (title) {
          items.push({
            id: `sec-heading-${idx}`,
            title: title.length > 36 ? title.substring(0, 36) + '...' : title,
            fullTitle: title,
          });
          idx++;
        }
      }
    });
    return items;
  }, [selectedItem.contentMarkdown]);

  const showTOC = tocItems.length >= 2;

  const scrollToSection = (id: string) => {
    setActiveTocId(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSharePlatform = (platform: 'facebook' | 'linkedin' | 'twitter' | 'zalo') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(selectedItem.title);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
        break;
      case 'zalo':
        window.open(`https://sp.zalo.me/share_inline?url=${url}`, '_blank', 'width=600,height=400');
        break;
    }
  };

  const handleShareClick = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      window.print();
      setIsExportingPDF(false);
    }, 600);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultEmail.trim()) return;
    setIsConsultSubmitting(true);
    setTimeout(() => {
      setIsConsultSubmitting(false);
      setConsultSubmitted(true);
    }, 600);
  };

  const handleDownloadAttachment = (title: string) => {
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800">
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* HERO HEADER SECTION */}
          <NewsDetailHero
            article={selectedItem}
            copiedLink={copiedLink}
            isExportingPDF={isExportingPDF}
            onBackToList={onBackToList}
            onNavigateHome={onNavigateHome}
            onSharePlatform={handleSharePlatform}
            onShareClick={handleShareClick}
            onExportPDF={handleExportPDF}
          />

          {/* 🔔 NEWS TICKER */}
          <NewsTicker
            breakingNews={breakingNewsList}
            onSelectNews={onSelectNews}
          />

          {/* 2-COLUMN EXPANDED LAYOUT (Main: 8-cols, Sidebar: 4-cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* CENTER COLUMN (col-span-8) */}
            <div className="lg:col-span-8 space-y-8">
              {/* BLOCK 1: MAIN ARTICLE CONTENT */}
              <NewsArticleMain
                article={selectedItem}
                consultName={consultName}
                setConsultName={setConsultName}
                consultEmail={consultEmail}
                setConsultEmail={setConsultEmail}
                consultMessage={consultMessage}
                setConsultMessage={setConsultMessage}
                isConsultSubmitting={isConsultSubmitting}
                consultSubmitted={consultSubmitted}
                onConsultSubmit={handleConsultSubmit}
              />

              {/* BLOCK 2: RELATED PROJECTS & EVENTS */}
              <NewsRelatedContent
                relatedProjects={effectiveLinkedProjects}
                relatedEvents={effectiveLinkedEvents}
                onNavigateToProject={onNavigateToProject}
                onNavigateToEvent={onNavigateToEvent}
              />
            </div>

            {/* RIGHT SIDEBAR (col-span-4) */}
            <NewsDetailSidebar
              showTOC={showTOC}
              isTocOpen={isTocOpen}
              setIsTocOpen={setIsTocOpen}
              tocItems={tocItems}
              activeTocId={activeTocId}
              scrollToSection={scrollToSection}
              effectiveLinkedProducts={effectiveLinkedProducts}
              latestNews={latestNews}
              onNavigateToProduct={onNavigateToProduct}
              onSelectNews={onSelectNews}
            />
          </div>

          {/* SHAREHOLDER PDF DOWNLOAD CARD AT BOTTOM */}
          <NewsShareholderPdfSection
            article={selectedItem as ShareholderNewsItem}
            pdfDownloaded={pdfDownloaded}
            onDownloadAttachment={handleDownloadAttachment}
          />
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Box,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Eye,
  Facebook,
  FileCheck,
  FileText,
  Linkedin,
  ListOrdered,
  MapPin,
  Percent,
  Send,
  Sparkles,
  Twitter,
} from 'lucide-react';
import type { EventItem, Product } from '@/shared/types';
import type {
  NewsRelatedProject,
  PublicNewsItem,
  RecruitmentNewsItem,
  PromotionNewsItem,
  ShareholderNewsItem,
} from '../../types';
import { ReadingProgress } from './ReadingProgress';
import { NewsTicker } from '../list/NewsTicker';

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

const renderFormattedText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const subParts = part.split(/(\*.*?\*)/g);
    return subParts.map((sub, sIdx) => {
      if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2) {
        return (
          <em key={`${index}-${sIdx}`} className="italic text-slate-800">
            {sub.slice(1, -1)}
          </em>
        );
      }
      return sub;
    });
  });
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
          {/* HERO HEADER SECTION - Khung xám dot pattern nguyên bản */}
          <section className="relative w-full p-6 sm:p-10 bg-slate-100/90 border border-slate-200/80 shadow-sm overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#131b2e 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 space-y-5">
              {/* Breadcrumb Navigation & Back Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
                <nav className="flex items-center gap-2 text-xs text-slate-500 font-sans flex-wrap">
                  <button 
                    onClick={onNavigateHome} 
                    className="hover:text-orange-600 transition-colors cursor-pointer font-medium"
                  >
                    Trang chủ
                  </button>
                  <span>/</span>
                  <button 
                    onClick={onBackToList} 
                    className="hover:text-orange-600 transition-colors cursor-pointer font-medium"
                  >
                    Tin tức
                  </button>
                  <span>/</span>
                  <span className="text-slate-900 font-semibold line-clamp-1 max-w-xs sm:max-w-md">
                    {selectedItem.title}
                  </span>
                </nav>

                <button
                  onClick={onBackToList}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors bg-white px-3.5 py-1.5 border border-slate-200 shadow-xs cursor-pointer rounded-[8px] shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại</span>
                </button>
              </div>

              {/* Tags & Meta Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="bg-orange-600/10 border border-orange-500/20 text-orange-600 font-black px-3 py-1 uppercase tracking-wider text-[10px]">
                  {getTypeSimpleText(selectedItem)}
                </span>
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  {selectedItem.date}
                </span>
                {selectedItem.views !== undefined && (
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-orange-600" />
                    {selectedItem.views} lượt xem
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 uppercase leading-tight">
                {selectedItem.title}
              </h1>

              {/* Hero Actions Row: Social Share & Bookmark */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 hidden sm:inline">Chia sẻ:</span>
                  <button
                    onClick={() => handleSharePlatform('facebook')}
                    className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#1877F2] transition-colors border border-slate-200 cursor-pointer"
                    title="Chia sẻ lên Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSharePlatform('linkedin')}
                    className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#0A66C2] transition-colors border border-slate-200 cursor-pointer"
                    title="Chia sẻ lên LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSharePlatform('twitter')}
                    className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-black transition-colors border border-slate-200 cursor-pointer"
                    title="Chia sẻ lên X (Twitter)"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSharePlatform('zalo')}
                    className="px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase transition-all cursor-pointer"
                    title="Chia sẻ qua Zalo"
                  >
                    ZALO
                  </button>
                  <button
                    onClick={handleShareClick}
                    className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 transition-colors border border-slate-200 cursor-pointer"
                    title="Sao chép đường dẫn"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-orange-600 text-slate-700 hover:text-orange-600 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    title="In / Xuất bài viết PDF"
                  >
                    <FileCheck size={14} className={isExportingPDF ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">{isExportingPDF ? 'Đang xử lý...' : 'In / PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 🔔 NEWS TICKER */}
          <NewsTicker
            breakingNews={breakingNewsList}
            onSelectNews={onSelectNews}
          />

          {/* 2-COLUMN EXPANDED LAYOUT (Main: 8-cols, Sidebar: 4-cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* CENTER COLUMN (col-span-8): Distinct Blocks Stack */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* BLOCK 1: MAIN ARTICLE CONTENT - Khung trắng có viền bóng đổ chuẩn */}
              <main className="bg-white border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm rounded-[10px] space-y-8">
                
                {/* Article Summary Lead Paragraph (Tóm tắt trước ảnh) */}
                {selectedItem.shortDesc && (
                  <p className="text-sm md:text-base text-slate-800 font-medium italic border-l-4 border-orange-500 pl-4 py-3 leading-relaxed bg-orange-50/60 rounded-r-lg">
                    {selectedItem.shortDesc}
                  </p>
                )}

                {/* Featured Hero Banner Image */}
                <div className="h-72 sm:h-[460px] lg:h-[500px] w-full relative overflow-hidden group rounded-[10px]">
                  <img 
                    src={selectedItem.img} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-[10px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-orange-400" />
                      {selectedItem.title}
                    </p>
                  </div>
                </div>

                {/* Recruitment Specific Info Box */}
                {selectedItem.category === 'recruitment' && (
                  <div className="bg-white border border-orange-200 border-l-4 border-l-orange-500 p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-800 my-4 shadow-2xs">
                    <div className="space-y-2">
                      <p><span className="text-slate-500 font-medium">Vị trí ứng tuyển:</span> <span className="text-slate-900 font-bold ml-1">{(selectedItem as RecruitmentNewsItem).position}</span></p>
                      <p><span className="text-slate-500 font-medium">Phòng ban:</span> <span className="text-slate-900 font-bold ml-1">{(selectedItem as RecruitmentNewsItem).department}</span></p>
                      <p><span className="text-slate-500 font-medium">Địa điểm làm việc:</span> <span className="text-slate-900 font-bold ml-1">{(selectedItem as RecruitmentNewsItem).location}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="text-slate-500 font-medium">Mức lương đề xuất:</span> <span className="text-orange-700 font-bold ml-1">{(selectedItem as RecruitmentNewsItem).salary}</span></p>
                      <p><span className="text-slate-500 font-medium">Hình thức làm việc:</span> <span className="text-slate-900 font-bold ml-1">{(selectedItem as RecruitmentNewsItem).jobType}</span></p>
                      <p><span className="text-slate-500 font-medium">Hạn nộp hồ sơ:</span> <span className="text-red-600 font-bold ml-1">{(selectedItem as RecruitmentNewsItem).deadline}</span></p>
                    </div>
                  </div>
                )}

                {/* Promotion Specific Info Box */}
                {selectedItem.category === 'promotion' && (
                  <div className="bg-white border border-orange-200 border-l-4 border-l-orange-500 p-5 md:p-6 space-y-3.5 text-xs text-slate-800 my-4 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 border-b border-orange-100 pb-2.5">
                      <h3 className="font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 text-xs">
                        <Percent size={16} className="text-orange-600 shrink-0" />
                        <span>Thông tin chương trình khuyến mại</span>
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                        (selectedItem as PromotionNewsItem).status === 'Đang diễn ra' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {(selectedItem as PromotionNewsItem).status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                      <p><span className="font-bold text-slate-900">Chương trình:</span> {(selectedItem as PromotionNewsItem).programName}</p>
                      <p><span className="font-bold text-slate-900">Thời gian áp dụng:</span> <span className="font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 border border-orange-200/80">{(selectedItem as PromotionNewsItem).timeFrame}</span></p>
                      <p className="md:col-span-2"><span className="font-bold text-slate-900">Đối tượng áp dụng:</span> {(selectedItem as PromotionNewsItem).appliedTargets?.join(', ') ?? ''}</p>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-500 italic flex items-center gap-1.5 border-t border-orange-100">
                      <Sparkles size={13} className="text-orange-500 shrink-0" />
                      <span>Tư vấn trực tiếp và nhận báo giá ưu đãi từ chuyên gia CIC Tech.</span>
                    </div>
                  </div>
                )}

                {/* Shareholder Specific Info Box */}
                {selectedItem.category === 'shareholder' && (
                  <div className="bg-white border border-orange-200 border-l-4 border-l-orange-500 p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-800 my-4 shadow-2xs">
                    <p><span className="text-slate-500 font-medium">Loại văn bản:</span> <span className="text-orange-700 font-bold ml-1">{(selectedItem as ShareholderNewsItem).docType}</span></p>
                    <p><span className="text-slate-500 font-medium">Năm tài chính công bố:</span> <span className="text-slate-900 font-bold ml-1">{(selectedItem as ShareholderNewsItem).year}</span></p>
                  </div>
                )}

                {/* RICH DETAILED ARTICLE TEXT WITH CKEDITOR HTML & MARKDOWN SUPPORT */}
                <div className="prose max-w-none text-slate-700 text-xs md:text-sm leading-relaxed space-y-4">
                  {/<[a-z][\s\S]*>/i.test(selectedItem.contentMarkdown) ? (
                    <div className="ck-content" dangerouslySetInnerHTML={{ __html: selectedItem.contentMarkdown }} />
                  ) : (() => {
                    type ContentBlock = {
                      type: 'h3' | 'h4' | 'ol' | 'ul' | 'quote' | 'p';
                      content: string;
                      items?: string[];
                    };
                    const blocks: ContentBlock[] = [];
                    const rawParagraphs = selectedItem.contentMarkdown.split('\n\n');

                    rawParagraphs.forEach((p) => {
                      const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
                      if (lines.length === 0) return;

                      let currentListItems: string[] = [];
                      let currentListType: 'ol' | 'ul' | null = null;

                      const flushList = () => {
                        if (currentListItems.length > 0 && currentListType) {
                          blocks.push({
                            type: currentListType,
                            content: '',
                            items: [...currentListItems],
                          });
                          currentListItems = [];
                          currentListType = null;
                        }
                      };

                      lines.forEach((line) => {
                        if (line.startsWith('### ')) {
                          flushList();
                          blocks.push({ type: 'h3', content: line.replace('### ', '') });
                        } else if (line.startsWith('#### ')) {
                          flushList();
                          blocks.push({ type: 'h4', content: line.replace('#### ', '') });
                        } else if (
                          line.startsWith('> ') || 
                          (line.startsWith('*"') && line.endsWith('"*')) || 
                          (line.startsWith('* "') && line.endsWith('"*')) ||
                          (line.startsWith('*"') && line.includes('"*'))
                        ) {
                          flushList();
                          let quoteText = line;
                          if (quoteText.startsWith('> ')) quoteText = quoteText.replace('> ', '');
                          if (quoteText.startsWith('*"')) quoteText = quoteText.slice(2);
                          if (quoteText.endsWith('"*')) quoteText = quoteText.slice(0, -2);
                          blocks.push({ type: 'quote', content: quoteText });
                        } else if (/^\d+\.\s/.test(line)) {
                          if (currentListType && currentListType !== 'ol') flushList();
                          currentListType = 'ol';
                          currentListItems.push(line.replace(/^\d+\.\s*/, ''));
                        } else if (/^\*\s/.test(line) || /^-\s/.test(line)) {
                          if (currentListType && currentListType !== 'ul') flushList();
                          currentListType = 'ul';
                          currentListItems.push(line.replace(/^[\*\-]\s*/, ''));
                        } else {
                          flushList();
                          blocks.push({ type: 'p', content: line });
                        }
                      });

                      flushList();
                    });

                    return blocks.map((block, idx) => {
                      const sectionId = `sec-heading-${idx}`;
                      if (block.type === 'h3') {
                        return (
                          <h3 
                            key={idx} 
                            id={sectionId}
                            className="text-base md:text-lg font-bold text-slate-900 pt-3 border-b border-slate-100 pb-2 scroll-mt-28"
                          >
                            {renderFormattedText(block.content)}
                          </h3>
                        );
                      }
                      if (block.type === 'h4') {
                        return (
                          <h4 
                            key={idx} 
                            id={sectionId}
                            className="text-sm md:text-base font-semibold text-slate-900 pt-2 scroll-mt-28"
                          >
                            {renderFormattedText(block.content)}
                          </h4>
                        );
                      }
                      if (block.type === 'quote') {
                        return (
                          <blockquote 
                            key={idx} 
                            className="my-4 p-4 md:p-5 bg-orange-50/70 border-l-4 border-orange-500 text-slate-800 text-xs md:text-sm italic font-medium leading-relaxed shadow-2xs"
                          >
                            "{renderFormattedText(block.content)}"
                          </blockquote>
                        );
                      }
                      if (block.type === 'ol' && block.items) {
                        return (
                          <ol key={idx} className="space-y-2.5 my-3 pl-1">
                            {block.items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2 text-slate-700 text-xs md:text-sm leading-relaxed">
                                <span className="h-5 w-5 bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                  {iIdx + 1}
                                </span>
                                <span className="flex-1">{renderFormattedText(item)}</span>
                              </li>
                            ))}
                          </ol>
                        );
                      }
                      if (block.type === 'ul' && block.items) {
                        return (
                          <ul key={idx} className="space-y-2 my-2.5 pl-1">
                            {block.items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2.5 text-slate-700 text-xs md:text-sm leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0 mt-2"></span>
                                <span className="flex-1">{renderFormattedText(item)}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={idx} className="text-slate-700 text-xs md:text-sm leading-relaxed my-2 text-justify">
                          {renderFormattedText(block.content)}
                        </p>
                      );
                    });
                  })()}
                </div>

                {/* Consultation Form Widget - Inside Main Article Box */}
                {selectedItem.category !== 'recruitment' && (
                  <div className="bg-orange-50/50 border border-orange-200 border-l-4 border-l-orange-500 p-6 md:p-8 space-y-4 shadow-2xs rounded-[10px] my-6">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 flex items-center gap-2">
                        <Send size={16} className="text-orange-600" />
                        <span>Đăng ký nhận tư vấn</span>
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Nhận thông tin tư vấn bản quyền enjiCAD, giải pháp phần mềm kỹ thuật hoặc chuyển đổi số từ chuyên gia CIC Tech.
                      </p>
                    </div>

                    {consultSubmitted ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 rounded-[8px]">
                        <Check size={18} className="text-emerald-600 shrink-0" />
                        <span>Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công. CIC Tech sẽ liên hệ lại trong thời gian sớm nhất.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleConsultSubmit} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Họ và tên *</label>
                            <input
                              type="text"
                              required
                              value={consultName}
                              onChange={(e) => setConsultName(e.target.value)}
                              placeholder="Nhập họ và tên"
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-colors rounded-[8px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Email liên hệ *</label>
                            <input
                              type="email"
                              required
                              value={consultEmail}
                              onChange={(e) => setConsultEmail(e.target.value)}
                              placeholder="Nhập email liên hệ"
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-colors rounded-[8px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Nội dung yêu cầu</label>
                          <textarea
                            rows={3}
                            value={consultMessage}
                            onChange={(e) => setConsultMessage(e.target.value)}
                            placeholder="Mô tả nhu cầu của bạn..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:border-orange-500 focus:bg-white resize-none transition-colors rounded-[8px]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isConsultSubmitting}
                          className="w-full py-3 bg-[#FC5115] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 rounded-[8px] cursor-pointer"
                        >
                          {isConsultSubmitting ? (
                            <span>Đang gửi thông tin...</span>
                          ) : (
                            <>
                              <span>Gửi yêu cầu tư vấn</span>
                              <Send size={14} />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </main>

              {/* BLOCK: LIÊN QUAN (DỰ ÁN, SỰ KIỆN) NẾU CÓ */}
              {(effectiveLinkedProjects.length > 0 || effectiveLinkedEvents.length > 0) && (
                <section className="bg-transparent border-0 p-0 shadow-none space-y-8">
                  {/* 1. Related Projects Section */}
                  {effectiveLinkedProjects.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                        <Building2 size={18} className="text-orange-600" />
                        <span>Dự án liên quan</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {effectiveLinkedProjects.map((proj) => (
                          <div
                            key={proj.id}
                            onClick={() => onNavigateToProject?.(proj.id)}
                            className="bg-white border border-slate-200 hover:border-orange-500 rounded-[10px] p-3.5 flex items-start gap-3.5 shadow-2xs transition-all hover:shadow-md cursor-pointer group hover:-translate-y-0.5 duration-200"
                          >
                            <img
                              src={proj.img || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'}
                              alt={proj.name}
                              className="w-16 h-16 rounded-[8px] object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded">
                                {proj.sector || 'Dự án tiêu biểu'}
                              </span>
                              <h4 className="text-xs font-bold text-slate-950 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                {proj.name}
                              </h4>
                              {proj.customer && (
                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {proj.customer}
                                </p>
                              )}
                              <div className="pt-1 flex items-center text-[10px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                                <span>Xem chi tiết dự án</span>
                                <ChevronRight size={12} className="ml-0.5" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Related Events Section */}
                  {effectiveLinkedEvents.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                        <Calendar size={18} className="text-orange-600" />
                        <span>Sự kiện liên quan</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {effectiveLinkedEvents.map((evt) => (
                          <div
                            key={evt.id}
                            onClick={() => onNavigateToEvent?.(String(evt.id))}
                            className="bg-white border border-slate-200 hover:border-orange-500 rounded-[10px] p-4 flex items-start gap-3.5 shadow-2xs transition-all hover:shadow-md cursor-pointer group hover:-translate-y-0.5 duration-200"
                          >
                            <div className="px-3 py-2 bg-orange-600 text-white rounded-[8px] text-center shrink-0 group-hover:bg-orange-700 transition-colors">
                              <span className="block text-[10px] font-extrabold uppercase tracking-wider">
                                {evt.date.split('/')[1] ? `Thg ${evt.date.split('/')[1]}` : 'Sự kiện'}
                              </span>
                              <span className="block text-base font-black leading-none mt-0.5">
                                {evt.date.split('/')[0]}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <h4 className="text-xs font-bold text-slate-950 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                {evt.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                <MapPin size={12} className="text-orange-600 shrink-0" />
                                <span className="line-clamp-1">{evt.location}</span>
                              </p>
                              <div className="pt-1 flex items-center text-[10px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                                <span>Xem chi tiết sự kiện</span>
                                <ChevronRight size={12} className="ml-0.5" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* RIGHT SIDEBAR (col-span-4): Category-Aware Dynamic Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* 1. Collapsible Table of Contents */}
              {showTOC && tocItems.length > 0 && (
                <div className="bg-white border border-slate-200/80 shadow-2xs overflow-hidden transition-all rounded-[10px]">
                  <div 
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="p-3.5 px-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 select-none transition-colors border-b border-slate-100"
                  >
                    <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                      <ListOrdered size={15} />
                      <span>Mục lục bài viết</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 ml-1 rounded-[6px]">
                        {tocItems.length} mục
                      </span>
                    </h3>
                    <button 
                      type="button"
                      aria-label={isTocOpen ? "Thu gọn mục lục" : "Mở rộng mục lục"}
                      className="text-slate-400 hover:text-orange-600 transition-colors p-0.5 rounded-[6px] cursor-pointer"
                    >
                      {isTocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isTocOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <nav className="p-3.5 pt-2 space-y-1 max-h-[300px] overflow-y-auto pr-1">
                          {tocItems.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => scrollToSection(item.id)}
                              title={item.fullTitle}
                              className={`block text-left w-full text-xs font-medium transition-colors py-1.5 px-2 border-b border-slate-50 last:border-0 rounded-[6px] cursor-pointer ${
                                activeTocId === item.id
                                  ? 'text-orange-600 font-bold bg-orange-50/80 border-orange-200'
                                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-orange-600 font-bold mr-1.5 text-[10px]">{idx + 1}.</span>
                              <span className="line-clamp-1 inline">{item.title}</span>
                            </button>
                          ))}
                        </nav>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Linked Products / Solutions Block */}
              {effectiveLinkedProducts.length > 0 && (
                <div className="bg-transparent p-0 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Box size={16} className="text-orange-600" />
                      <span>Sản phẩm liên quan</span>
                    </div>
                  </h3>
                  <div className="space-y-2.5">
                    {effectiveLinkedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => onNavigateToProduct?.(prod.id)}
                        className="group cursor-pointer p-2 bg-transparent hover:bg-slate-100/60 border-0 transition-all flex items-center gap-3 rounded-[8px]"
                      >
                        <img 
                          src={prod.img || (prod as any).image} 
                          alt={prod.name} 
                          className="w-11 h-11 object-cover border border-slate-200 shrink-0 rounded-[6px]" 
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {prod.description || (prod as any).desc}
                          </p>
                          <p className="text-[10px] font-bold text-orange-600 mt-0.5">{prod.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest News */}
              {latestNews.length > 0 && (
                <div className="bg-transparent p-0 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-600" />
                      <span>Tin mới nhất</span>
                    </div>
                  </h3>

                  <div className="space-y-2.5">
                    {latestNews.map((article) => (
                      <div
                        key={article.id}
                        onClick={() => onSelectNews(article.id)}
                        className="group cursor-pointer p-2 bg-transparent hover:bg-slate-100/60 border-0 transition-all flex items-center gap-3 rounded-[8px]"
                      >
                        <img 
                          src={article.img} 
                          alt={article.title} 
                          className="w-14 h-14 object-cover border border-slate-200 shrink-0 rounded-[6px]" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 flex items-center gap-1 font-medium">
                            <Clock size={11} className="text-orange-600 shrink-0" />
                            <span>{article.date}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </aside>

          </div>

          {/* SHAREHOLDER PDF DOWNLOAD CARD Ở CUỐI TRANG */}
          {selectedItem.category === 'shareholder' && (
            <div className="pt-8 border-t border-slate-200 space-y-8">
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 space-y-5 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
                      <FileText size={14} /> Văn bản công bố thông tin chính thức
                    </span>
                    <h3 className="text-base md:text-lg font-bold uppercase tracking-tight text-slate-900">
                      Tải về bản toàn văn PDF có chữ ký số
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-white text-slate-700 text-xs font-mono border border-slate-300">
                    {(selectedItem as ShareholderNewsItem).pdfSize || 'PDF'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Văn bản được công bố công khai minh bạch theo đúng quy định của Ủy ban Chứng khoán Nhà nước và Sở Giao dịch Chứng khoán. Quý cổ đông và nhà đầu tư có thể tải tài liệu chính thức bên dưới.
                </p>

                <button
                  onClick={() => handleDownloadAttachment(selectedItem.title)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download size={16} />
                  <span>{pdfDownloaded ? 'Đã tải thành công!' : 'Tải tài liệu PDF (.PDF)'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

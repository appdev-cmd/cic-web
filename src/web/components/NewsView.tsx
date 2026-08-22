/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  Layers, 
  FileText, 
  Download, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Video,
  Eye,
  Share2,
  FileCheck,
  Building2,
  BookOpen,
  Briefcase,
  Percent,
  TrendingUp,
  Clock,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Award,
  Globe,
  Handshake,
  CornerDownRight,
  Check,
  Copy,
  ListOrdered,
  List,
  Facebook,
  Linkedin,
  Twitter,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Box,
  Sparkles,
  Palette,
  Mail,
  Bell,
  BellRing,
  Pause,
  X
} from 'lucide-react';
import { getNewsData } from '../features/news/newsData';
import type { DetailedNewsItem, CompanyNewsItem, SpecialtyNewsItem, RecruitmentNewsItem, PromotionNewsItem, ShareholderNewsItem } from '../features/news/types';

interface NewsViewProps {
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
    const subParts = part.split(/(\*".*?"\*|\*.*?\*)/g);
    return subParts.map((sub, sIdx) => {
      if (sub.startsWith('*"') && sub.endsWith('"*') && sub.length > 4) {
        return (
          <span key={`${index}-${sIdx}`} className="italic text-slate-800 font-medium">
            "{sub.slice(2, -2)}"
          </span>
        );
      }
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

export function NewsView({ 
  initialCategory, 
  onNavigateToService, 
  onNavigateToProduct, 
  onNavigateToProject,
  onNavigateToEvent,
  onNavigateHome,
  onNavigateToPrivacy,
  onOpenConsultation,
  previewNews,
}: NewsViewProps) {
  const {
    items: sourceNewsData,
    relatedProducts: productsData,
    relatedProjects: projectsData,
    relatedEvents: eventsData,
  } = React.useMemo(getNewsData, []);
  const newsData = React.useMemo(() => previewNews ? [previewNews, ...sourceNewsData.filter((item) => item.id !== previewNews.id)] : sourceNewsData, [previewNews, sourceNewsData]);
  
  // Navigation states
  const [activeCategory, setActiveCategory] = useState<'all' | 'company' | 'specialty' | 'international' | 'recruitment' | 'promotion' | 'shareholder'>('all');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(previewNews?.id || null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category-specific sub-filters
  const [companySubType, setCompanySubType] = useState<string>('Tất cả');
  const [specialtySubType, setSpecialtySubType] = useState<'Tất cả' | 'Kiến thức' | 'Cập nhật công nghệ' | 'Chính sách' | 'Giải pháp'>('Tất cả');
  const [internationalSubType, setInternationalSubType] = useState<string>('Tất cả');
  
  const [recruitmentDept, setRecruitmentDept] = useState<string>('Tất cả');
  const [recruitmentLoc, setRecruitmentLoc] = useState<string>('Tất cả');
  const [recruitmentStatus, setRecruitmentStatus] = useState<string>('Tất cả');

  const [promotionStatus, setPromotionStatus] = useState<string>('Tất cả');

  const [shareholderYear, setShareholderYear] = useState<string>('Tất cả');
  const [shareholderDocType, setShareholderDocType] = useState<string>('Tất cả');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Detail View Interactive states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfDownloadedId, setPdfDownloadedId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Scroll Reading Progress state
  const [readingProgress, setReadingProgress] = useState(0);

  // News Ticker & Interactive Bell State
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [showBellModal, setShowBellModal] = useState(false);
  const [bellSubscribed, setBellSubscribed] = useState(true);
  const [bellEmail, setBellEmail] = useState('');
  const [bellToast, setBellToast] = useState<string | null>(null);

  const handleBellSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bellEmail.trim()) return;
    setBellSubscribed(true);
    setBellToast('Đã đăng ký nhận thông báo tin tức nổi bật thành công!');
    setBellEmail('');
    setTimeout(() => {
      setBellToast(null);
    }, 4000);
  };

  const toggleBellSubscription = () => {
    const nextState = !bellSubscribed;
    setBellSubscribed(nextState);
    setBellToast(nextState ? 'Đã bật thông báo tin tức nổi bật!' : 'Đã tắt thông báo tin tức');
    setTimeout(() => {
      setBellToast(null);
    }, 3000);
  };

  const breakingNewsList = React.useMemo(() => {
    return newsData.filter(item => item.category !== 'shareholder').slice(0, 6);
  }, [newsData]);

  const renderNewsTicker = () => (
    <div className="relative my-3">
      {/* Ticker Bar Container - Blends with main background */}
      <div 
        className="bg-transparent text-slate-900 py-2.5 flex items-center justify-between gap-3 overflow-hidden"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
      >
        {/* Interactive Bell Badge */}
        <button
          onClick={() => setShowBellModal(true)}
          className="flex bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest shrink-0 gap-1.5 items-center z-10 cursor-pointer transition-colors shadow-2xs"
          title="Nhấn để mở bảng tin nổi bật & đăng ký thông báo"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <Bell size={13} className={`animate-[bounce_1.2s_infinite] ${bellSubscribed ? 'fill-white' : ''}`} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400"></span>
            </span>
          </div>
          <span>HOT NEWS</span>
        </button>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div 
            className="animate-marquee flex items-center"
            style={{
              animationPlayState: isTickerPaused ? 'paused' : 'running'
            }}
          >
            {[...breakingNewsList, ...breakingNewsList].map((item, idx) => (
              <button
                key={`ticker-${item.id}-${idx}`}
                onClick={() => handleSelectNews(item.id)}
                className="inline-flex items-center gap-3 text-slate-900 hover:text-orange-600 transition-colors text-xs font-medium whitespace-nowrap cursor-pointer shrink-0 mr-6"
              >
                <span>{item.title}</span>
                <span className="text-slate-400 font-bold">•</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bell Notification Quick Toast */}
      {bellToast && (
        <div className="absolute -bottom-9 right-0 z-50 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-md shadow-md flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={13} />
          <span>{bellToast}</span>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Consultation Form state
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultMessage, setConsultMessage] = useState('');
  const [isConsultSubmitting, setIsConsultSubmitting] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultEmail.trim()) return;
    setIsConsultSubmitting(true);
    setTimeout(() => {
      setIsConsultSubmitting(false);
      setConsultSubmitted(true);
      setTimeout(() => {
        setConsultName('');
        setConsultEmail('');
        setConsultMessage('');
        setConsultSubmitted(false);
      }, 4000);
    }, 800);
  };

  // Job Application Form state (for Recruitment articles)
  const [jobName, setJobName] = useState('');
  const [jobEmail, setJobEmail] = useState('');
  const [jobPhone, setJobPhone] = useState('');
  const [jobNote, setJobNote] = useState('');
  const [isJobSubmitting, setIsJobSubmitting] = useState(false);
  const [jobSubmitted, setJobSubmitted] = useState(false);

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName.trim() || !jobEmail.trim() || !jobPhone.trim()) return;
    setIsJobSubmitting(true);
    setTimeout(() => {
      setIsJobSubmitting(false);
      setJobSubmitted(true);
      setTimeout(() => {
        setJobName('');
        setJobEmail('');
        setJobPhone('');
        setJobNote('');
        setJobSubmitted(false);
      }, 4000);
    }, 800);
  };

  // Promotion Quote Form state (for Promotion articles)
  const [promoName, setPromoName] = useState('');
  const [promoPhone, setPromoPhone] = useState('');
  const [promoEmail, setPromoEmail] = useState('');
  const [promoCompany, setPromoCompany] = useState('');
  const [isPromoSubmitting, setIsPromoSubmitting] = useState(false);
  const [promoSubmitted, setPromoSubmitted] = useState(false);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName.trim() || !promoPhone.trim() || !promoEmail.trim()) return;
    setIsPromoSubmitting(true);
    setTimeout(() => {
      setIsPromoSubmitting(false);
      setPromoSubmitted(true);
      setTimeout(() => {
        setPromoName('');
        setPromoPhone('');
        setPromoEmail('');
        setPromoCompany('');
        setPromoSubmitted(false);
      }, 4000);
    }, 800);
  };

  // Newsletter Subscription Form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setIsNewsletterSubmitting(true);
    setTimeout(() => {
      setIsNewsletterSubmitting(false);
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSubmitted(false);
      }, 5000);
    }, 800);
  };

  // Mock Events & Related Solutions for Detail Sidebars
  const upcomingEvents = [
    {
      id: 'evt-1',
      date: '15/08/2026',
      title: 'Webinar: Ứng dụng enjiCAD 2026 & BIM trong Thiết kế Hạ tầng Giao thông',
      location: 'Trực tuyến qua Zoom / MS Teams'
    },
    {
      id: 'evt-2',
      date: '28/08/2026',
      title: 'Triển lãm Quốc tế VietBuild 2026 - Gian hàng Công nghệ CIC Tech',
      location: 'Trung tâm Triển lãm SkyEx, TP. Hồ Chí Minh'
    },
    {
      id: 'evt-3',
      date: '10/09/2026',
      title: 'Hội thảo Chuyển đổi số & Tự động hóa Thiết kế Kết cấu Công trình',
      location: 'Khách sạn Pan Pacific, Hà Nội'
    }
  ];

  const relatedSolutions = [
    {
      id: 'sol-1',
      title: 'enjiCAD 2026 Pro',
      description: 'Phần mềm thiết kế CAD 2D/3D chuyên nghiệp thay thế hoàn hảo với chi phí tối ưu.'
    },
    {
      id: 'sol-2',
      title: 'Gradiant Pro - Hạ tầng kỹ thuật',
      description: 'Giải pháp tính toán san nền, bình đồ và quy hoạch hạ tầng kỹ thuật.'
    },
    {
      id: 'sol-3',
      title: 'Tư vấn & Triển khai BIM',
      description: 'Tư vấn lộ trình áp dụng BIM, đào tạo quy trình & chuẩn hóa dữ liệu công trình.'
    }
  ];

  // TOC States
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const [isTocOpen, setIsTocOpen] = useState(true);

  const handleSharePlatform = (platform: 'facebook' | 'linkedin' | 'twitter' | 'zalo') => {
    const currentUrl = window.location.href;
    const title = selectedItem?.title || 'Tin tức CIC Tech';
    let shareUrl = '';

    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
    } else if (platform === 'zalo') {
      shareUrl = `https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=500,scrollbars=yes');
    }
  };

  // Sync with prop changes
  useEffect(() => {
    if (initialCategory) {
      const cat = initialCategory.toLowerCase();
      if (['company', 'specialty', 'international', 'recruitment', 'promotion', 'shareholder'].includes(cat)) {
        setActiveCategory(cat as any);
      } else {
        setActiveCategory('all');
      }
      setSelectedNewsId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialCategory]);

  // Reset pagination when category, search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, companySubType, specialtySubType, internationalSubType, recruitmentDept, recruitmentLoc, recruitmentStatus, promotionStatus, shareholderYear, shareholderDocType]);

  const handleSelectNews = (id: string) => {
    setSelectedNewsId(id);
    setIsVideoPlaying(false);
    setCopiedLink(false);
    setPdfDownloadedId(null);
    setDownloadProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedNewsId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareClick = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      setIsExportingPDF(false);
      alert("Đã xuất bản in PDF thành công! Thiết bị sẽ tự động tải tài liệu.");
    }, 1500);
  };

  const handleDownloadAttachment = (title: string) => {
    setPdfDownloadedId(title);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  // --- FILTER LOGIC ---
  const filteredNews = newsData.filter((item) => {
    // 1. Category check - 'all' tab excludes 'shareholder' (Quan hệ cổ đông)
    if (activeCategory === 'all') {
      if (item.category === 'shareholder') {
        return false;
      }
    } else if (item.category !== activeCategory) {
      return false;
    }

    // 2. Universal search query (Title, Short Description)
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Category-specific filters
    if (item.category === 'company') {
      const cItem = item as CompanyNewsItem;
      if (companySubType !== 'Tất cả' && cItem.subType !== companySubType) return false;
    }

    if (item.category === 'specialty') {
      const sItem = item as SpecialtyNewsItem;
      if (specialtySubType !== 'Tất cả' && sItem.subType !== specialtySubType) return false;
    }

    if (item.category === 'international') {
      const iItem = item as any;
      if (internationalSubType !== 'Tất cả' && iItem.subType !== internationalSubType) return false;
    }

    if (item.category === 'recruitment') {
      const rItem = item as RecruitmentNewsItem;
      if (recruitmentDept !== 'Tất cả' && rItem.department !== recruitmentDept) return false;
      if (recruitmentLoc !== 'Tất cả' && rItem.location !== recruitmentLoc) return false;
      if (recruitmentStatus !== 'Tất cả' && rItem.status !== recruitmentStatus) return false;
    }

    if (item.category === 'promotion') {
      const pItem = item as PromotionNewsItem;
      if (promotionStatus !== 'Tất cả' && pItem.status !== promotionStatus) return false;
    }

    if (item.category === 'shareholder') {
      const sItem = item as ShareholderNewsItem;
      if (shareholderYear !== 'Tất cả' && sItem.year.toString() !== shareholderYear) return false;
      if (shareholderDocType !== 'Tất cả' && sItem.docType !== shareholderDocType) return false;
    }

    return true;
  });

  // Pagination calculation
  const totalItems = filteredNews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const selectedItem = newsData.find(item => item.id === selectedNewsId);

  // CMS Linked Entities (Lookup from Products, Projects, Events datasets) with fallback so no section is empty
  const effectiveLinkedProducts = React.useMemo(() => {
    if (selectedItem?.relatedProductIds && selectedItem.relatedProductIds.length > 0) {
      const found = productsData.filter(p => selectedItem.relatedProductIds?.includes(p.id));
      if (found.length > 0) return found;
    }
    return productsData.slice(0, 3);
  }, [selectedItem, productsData]);

  const effectiveLinkedProjects = React.useMemo(() => {
    if (selectedItem?.relatedProjectIds && selectedItem.relatedProjectIds.length > 0) {
      const found = projectsData.filter(p => selectedItem.relatedProjectIds?.includes(p.id));
      if (found.length > 0) return found;
    }
    return projectsData.slice(0, 2);
  }, [selectedItem, projectsData]);

  const effectiveLinkedEvents = React.useMemo(() => {
    if (selectedItem?.relatedEventIds && selectedItem.relatedEventIds.length > 0) {
      const found = eventsData.filter(e => selectedItem.relatedEventIds?.includes(e.id));
      if (found.length > 0) return found;
    }
    return eventsData.slice(0, 2);
  }, [selectedItem, eventsData]);

  const effectiveLinkedArticles = React.useMemo(() => {
    if (selectedItem?.relatedArticleIds && selectedItem.relatedArticleIds.length > 0) {
      const found = newsData.filter(a => selectedItem.relatedArticleIds?.includes(a.id));
      if (found.length > 0) return found;
    }
    const sameCat = newsData.filter(a => a.id !== selectedItem?.id && a.category === selectedItem?.category);
    if (sameCat.length >= 3) return sameCat.slice(0, 3);
    const others = newsData.filter(a => a.id !== selectedItem?.id);
    return others.slice(0, 3);
  }, [selectedItem, newsData]);

  // Extract Table of Contents dynamically from article markdown (Main sections only: ###)
  const rawTocItems: { id: string; title: string; fullTitle: string }[] = [];
  if (selectedItem) {
    const rawParagraphs = selectedItem.contentMarkdown.split('\n\n');
    rawParagraphs.forEach((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        const rawTitle = paragraph.replace('### ', '').trim();
        const cleanTitle = rawTitle.replace(/[\*\_\`]/g, '').trim();
        let shortTitle = cleanTitle;
        if (shortTitle.includes(':')) {
          const parts = shortTitle.split(':');
          if (parts[0].trim().length >= 3 && parts[0].trim().length <= 32) {
            shortTitle = parts[0].trim();
          }
        }
        if (shortTitle.length > 32) {
          shortTitle = shortTitle.slice(0, 30).trim() + '...';
        }

        rawTocItems.push({
          id: `sec-heading-${index}`,
          title: shortTitle,
          fullTitle: cleanTitle
        });
      }
    });
  }

  // TOC Visibility Rule: Show for specialty/international articles or company articles with headings.
  // Hide strictly for recruitment, promotion, and shareholder articles.
  const showTOC = selectedItem?.category === 'specialty' || selectedItem?.category === 'international' || (selectedItem?.category === 'company' && rawTocItems.length > 0);
  const tocItems = showTOC ? rawTocItems : [];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTocId(id);
    }
  };

  const getTypeSimpleText = (news: DetailedNewsItem) => {
    if (news.category === 'company') {
      return 'Tin công ty';
    }
    if (news.category === 'specialty') {
      return 'Tin chuyên ngành';
    }
    if (news.category === 'international') {
      return 'Hợp tác quốc tế';
    }
    if (news.category === 'recruitment') {
      return 'Tuyển dụng';
    }
    if (news.category === 'promotion') {
      return 'Tin khuyến mại';
    }
    if (news.category === 'shareholder') {
      return 'Quan hệ cổ đông';
    }
    return 'Tin tức';
  };

  // Get latest articles for detail sidebar
  const latestNews = React.useMemo(() => {
    if (!selectedItem) return [];
    return [...newsData]
      .filter(item => item.id !== selectedItem.id && (selectedItem.category === 'shareholder' ? true : item.category !== 'shareholder'))
      .slice(0, 5);
  }, [selectedItem]);

  // Get related articles
  const relatedArticles = React.useMemo(() => {
    if (!selectedItem) return [];
    const sameCategory = newsData.filter(item => item.id !== selectedItem.id && item.category === selectedItem.category);
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);

    const otherCategory = newsData.filter(item => item.id !== selectedItem.id && item.category !== selectedItem.category && (selectedItem.category === 'shareholder' ? true : item.category !== 'shareholder'));
    return [...sameCategory, ...otherCategory].slice(0, 4);
  }, [selectedItem]);

  // Helper lists for selectors
  const depts = ['Tất cả', 'Khối Kỹ thuật', 'Khối Kinh doanh', 'Khối Hỗ trợ', 'Khối Nghiên cứu & Phát triển'];
  const locs = ['Tất cả', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'];
  const rStatuses = ['Tất cả', 'Đang tuyển', 'Đã hết hạn'];
  const pStatuses = ['Tất cả', 'Đang diễn ra', 'Đã kết thúc'];
  const shYears = ['Tất cả', '2026', '2025', '2024', '2023'];
  const shDocTypes = ['Tất cả', 'Thông báo cổ đông', 'Báo cáo thường niên', 'Điều lệ công ty', 'Báo cáo tài chính'];

  // Categories helper to render beautiful tabs
  const categoriesList = [
    { id: 'all', label: 'Tất cả tin tức', icon: BookOpen },
    { id: 'company', label: 'Tin tức công ty', icon: Building2 },
    { id: 'specialty', label: 'Tin chuyên ngành', icon: Globe },
    { id: 'international', label: 'Hợp tác quốc tế', icon: Handshake },
    { id: 'recruitment', label: 'Tin tuyển dụng', icon: Briefcase },
    { id: 'promotion', label: 'Tin khuyến mại', icon: Percent },
    { id: 'shareholder', label: 'Quan hệ cổ đông', icon: TrendingUp },
  ];

  return (
    <div className="pt-28 pb-20 relative bg-slate-50/50">
      
      {/* Top Reading Progress Bar (Positioned under Header at top-[72px]) */}
      {selectedItem && (
        <div className="fixed top-[72px] left-0 w-full h-1 bg-slate-200/80 z-[45]">
          <div
            className="h-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIEW 1: NEWS DETAIL VIEW */}
        {selectedItem ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* HERO HEADER SECTION */}
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
                      onClick={handleBackToList} 
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
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors bg-white px-3.5 py-1.5 border border-slate-200 shadow-xs cursor-pointer rounded-md shrink-0"
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
                  {selectedItem.views && (
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
                      className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#1877F2] transition-colors border border-slate-200"
                      title="Chia sẻ lên Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSharePlatform('linkedin')}
                      className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#0A66C2] transition-colors border border-slate-200"
                      title="Chia sẻ lên LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSharePlatform('twitter')}
                      className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-black transition-colors border border-slate-200"
                      title="Chia sẻ lên X (Twitter)"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSharePlatform('zalo')}
                      className="px-2.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase transition-all"
                      title="Chia sẻ qua Zalo"
                    >
                      ZALO
                    </button>
                    <button
                      onClick={handleShareClick}
                      className="w-9 h-9 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 transition-colors border border-slate-200"
                      title="Sao chép đường dẫn"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportPDF}
                      disabled={isExportingPDF}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-orange-600 text-slate-700 hover:text-orange-600 text-[10px] font-black uppercase tracking-wider transition-all"
                      title="In / Xuất bài viết PDF"
                    >
                      <FileCheck size={14} className={isExportingPDF ? 'animate-spin' : ''} />
                      <span className="hidden sm:inline">{isExportingPDF ? 'Đang xử lý...' : 'In / PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 🔔 NEWS TICKER (Repositioned after Hero Header so reader context comes first) */}
            {renderNewsTicker()}

            {/* 2-COLUMN EXPANDED LAYOUT (Main: 8-cols, Sidebar: 4-cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* CENTER COLUMN (col-span-8): Distinct Blocks Stack */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* BLOCK 1: MAIN ARTICLE CONTENT */}
                <main className="bg-white border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm rounded-[10px] space-y-8">
                  
                  {/* Article Summary Lead Paragraph (Tóm tắt nội dung để trước ảnh tiêu đề) */}
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
                        <p className="md:col-span-2"><span className="font-bold text-slate-900">Đối tượng áp dụng:</span> {(selectedItem as PromotionNewsItem).appliedTargets.join(', ')}</p>
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

                  {/* RICH DETAILED ARTICLE TEXT WITH MARKDOWN SIMULATION */}
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
                        const lines = p.split('\n').map(l => l.trim()).filter(Boolean);
                        if (lines.length === 0) return;

                        let currentListItems: string[] = [];
                        let currentListType: 'ol' | 'ul' | null = null;

                        const flushList = () => {
                          if (currentListItems.length > 0 && currentListType) {
                            blocks.push({
                              type: currentListType,
                              content: '',
                              items: [...currentListItems]
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
                            className="w-full py-3 bg-[#FC5115] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 rounded-[8px]"
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
                              onClick={() => {
                                if (onNavigateToProject) {
                                  onNavigateToProject(proj.id);
                                }
                              }}
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
                              onClick={() => {
                                if (onNavigateToEvent) {
                                  onNavigateToEvent(evt.id);
                                }
                              }}
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
                        className="text-slate-400 hover:text-orange-600 transition-colors p-0.5 rounded-[6px]"
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
                                className={`block text-left w-full text-xs font-medium transition-colors py-1.5 px-2 border-b border-slate-50 last:border-0 rounded-[6px] ${
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
                          onClick={() => {
                            if (onNavigateToProduct) onNavigateToProduct(prod.id);
                          }}
                          className="group cursor-pointer p-2 bg-transparent hover:bg-slate-100/60 border-0 transition-all flex items-center gap-3 rounded-[8px]"
                        >
                          <img 
                            src={prod.img} 
                            alt={prod.name} 
                            className="w-11 h-11 object-cover border border-slate-200 shrink-0 rounded-[6px]" 
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                              {prod.description}
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
                          onClick={() => handleSelectNews(article.id)}
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

            {selectedItem.category === 'shareholder' && (
              <div className="pt-8 border-t border-slate-200 space-y-8">
                {/* Formal PDF Download Action Card */}
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
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-widest transition-all inline-flex items-center gap-2 shadow-xs"
                  >
                    <Download size={16} />
                    <span>Tải tài liệu PDF (.PDF)</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          
          /* VIEW 2: TECH NEWSROOM & EDITORIAL HUB VIEW */
          <div className="space-y-8">
            
            {/* Header section */}
            <div className="border-l-4 border-orange-600 pl-6 space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-[#444] uppercase tracking-tight">
                Tin Tức & Truyền Thông
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Cập nhật thông tin hoạt động, kiến thức kỹ thuật chuyên ngành và các thông cáo cổ đông mới nhất
              </p>
            </div>

            {/* Running News Ticker in Main Newsroom View */}
            {renderNewsTicker()}

            {/* HERO NEWSROOM SECTION (Top Highlight Story + Vertical Side Features) */}
            {activeCategory === 'all' && !searchQuery && filteredNews.length >= 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                
                {/* HERO MAIN ARTICLE (7 cols) */}
                <div 
                  onClick={() => handleSelectNews(filteredNews[0].id)}
                  className="lg:col-span-7 group cursor-pointer relative overflow-hidden bg-slate-950 min-h-[460px] lg:min-h-[520px] flex flex-col justify-end rounded-[12px]"
                >
                  <img 
                    src={filteredNews[0].img} 
                    alt={filteredNews[0].title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="relative z-10 p-6 lg:p-10 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#FC5115] text-white text-[10px] font-black uppercase tracking-wider rounded-[8px]">
                        Tin Nổi Bật
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <Clock size={13} className="text-[#FC5115]" /> {filteredNews[0].date}
                      </span>
                    </div>

                    <h2 className="text-xl lg:text-3xl font-black text-white uppercase leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
                      {filteredNews[0].title}
                    </h2>

                    <p className="text-sm lg:text-base text-slate-300 line-clamp-3 leading-relaxed font-medium max-w-3xl">
                      {filteredNews[0].shortDesc}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FC5115] pr-2">
                      <span>Đọc tiếp</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* SECONDARY SIDE HIGHLIGHTS (5 cols - 3 larger stacked cards closer together) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-slate-900 font-extrabold text-sm uppercase tracking-tight">Nội dung đáng chú ý</span>
                    <TrendingUp size={16} className="text-[#FC5115]" />
                  </div>

                  {filteredNews.slice(1, 4).map((sideItem) => (
                    <div 
                      key={sideItem.id}
                      onClick={() => handleSelectNews(sideItem.id)}
                      className="group cursor-pointer flex gap-4 items-center p-2 bg-transparent hover:bg-slate-100/50 transition-all border-0 shadow-none rounded-[10px] overflow-hidden"
                    >
                      {/* Larger Thumbnail Image */}
                      <div className="w-36 sm:w-40 lg:w-44 h-28 lg:h-32 shrink-0 overflow-hidden relative bg-slate-900 rounded-[10px]">
                        <img 
                          src={sideItem.img} 
                          alt={sideItem.title} 
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Bigger Content & Excerpt */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Clock size={12} className="text-[#FC5115] shrink-0" />
                          <span>{sideItem.date}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium">{getTypeSimpleText(sideItem)}</span>
                        </div>
                        <h4 className="text-sm lg:text-base font-bold text-slate-900 transition-colors line-clamp-2 leading-snug">
                          {sideItem.title}
                        </h4>
                        <p className="text-[13px] text-slate-500 line-clamp-3 font-medium leading-relaxed">
                          {sideItem.shortDesc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* CATEGORY SELECTOR PILL TABS */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categoriesList.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
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
                  {shDocTypes.map((dt) => {
                    const isSelected = shareholderDocType === dt;
                    return (
                      <button
                        key={dt}
                        onClick={() => setShareholderDocType(dt)}
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

              {/* SECONDARY FILTER ENGINE BAR */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-transparent p-0">
                {/* Search Input */}
                <div className="md:col-span-6 relative flex items-center">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Search className="text-slate-400" size={15} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm nội dung, thông báo, mã tài liệu..."
                    className="w-full bg-white border border-slate-200 focus:border-[#FC5115] pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-[8px]"
                  />
                </div>

                {/* Sub-Filters conditional on Selected Category */}
                {activeCategory === 'company' && (
                  <div className="md:col-span-4">
                    <select
                      value={companySubType}
                      onChange={(e: any) => setCompanySubType(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                    >
                      {['Tất cả', 'Thông báo', 'Văn hóa doanh nghiệp'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeCategory === 'specialty' && (
                  <div className="md:col-span-4">
                    <select
                      value={specialtySubType}
                      onChange={(e: any) => setSpecialtySubType(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                    >
                      {['Tất cả', 'Kiến thức', 'Cập nhật công nghệ', 'Chính sách', 'Giải pháp'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeCategory === 'international' && (
                  <div className="md:col-span-4">
                    <select
                      value={internationalSubType}
                      onChange={(e: any) => setInternationalSubType(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                    >
                      {['Tất cả', 'Đối tác chiến lược', 'Chuyển giao công nghệ', 'Hội nghị quốc tế', 'Dự án quốc tế'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeCategory === 'recruitment' && (
                  <>
                    <div className="md:col-span-2">
                      <select
                        value={recruitmentDept}
                        onChange={(e) => setRecruitmentDept(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                      >
                        {depts.map(d => <option key={d} value={d}>PB: {d}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <select
                        value={recruitmentLoc}
                        onChange={(e) => setRecruitmentLoc(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                      >
                        {locs.map(l => <option key={l} value={l}>ĐĐ: {l}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {activeCategory === 'promotion' && (
                  <div className="md:col-span-4">
                    <select
                      value={promotionStatus}
                      onChange={(e) => setPromotionStatus(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                    >
                      {pStatuses.map(s => <option key={s} value={s}>Trạng thái: {s}</option>)}
                    </select>
                  </div>
                )}

                {activeCategory === 'shareholder' && (
                  <div className="md:col-span-4">
                    <select
                      value={shareholderYear}
                      onChange={(e) => setShareholderYear(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                    >
                      {shYears.map(y => <option key={y} value={y}>Năm: {y}</option>)}
                    </select>
                  </div>
                )}

                {/* Reset Filters button */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCompanySubType('Tất cả');
                      setSpecialtySubType('Tất cả');
                      setInternationalSubType('Tất cả');
                      setRecruitmentDept('Tất cả');
                      setRecruitmentLoc('Tất cả');
                      setRecruitmentStatus('Tất cả');
                      setPromotionStatus('Tất cả');
                      setShareholderYear('Tất cả');
                      setShareholderDocType('Tất cả');
                    }}
                    className="w-full py-2 bg-slate-200 hover:bg-[#FC5115] hover:text-white text-slate-700 text-[10px] font-bold uppercase transition-colors text-center rounded-[8px]"
                  >
                    Xóa lọc
                  </button>
                </div>
              </div>
            </div>

            {/* EDITORIAL LIST SHOWCASE */}
            {paginatedNews.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-300 space-y-4 rounded-[10px]">
                <p className="text-slate-500 font-medium text-sm">Không tìm thấy tin tức hay văn bản nào phù hợp với bộ lọc.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCompanySubType('Tất cả');
                    setSpecialtySubType('Tất cả');
                    setInternationalSubType('Tất cả');
                    setRecruitmentDept('Tất cả');
                    setRecruitmentLoc('Tất cả');
                    setRecruitmentStatus('Tất cả');
                    setPromotionStatus('Tất cả');
                    setShareholderYear('Tất cả');
                    setShareholderDocType('Tất cả');
                  }}
                  className="px-6 py-2.5 bg-[#FC5115] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-700 transition-all rounded-[8px] shadow-sm"
                >
                  Đặt lại tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className={activeCategory === 'shareholder' ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"}>
                {paginatedNews.map((news, index) => {
                  if (news.category === 'shareholder') {
                    return (
                      <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03, duration: 0.25 }}
                        onClick={() => handleDownloadAttachment(news.title)}
                        className="group cursor-pointer bg-white border border-slate-200 hover:border-[#FC5115] rounded-[10px] p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:-translate-y-0.5"
                      >
                        {/* Left: Document Icon & Details */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* PDF Icon Box */}
                          <div className="w-12 h-14 sm:w-14 sm:h-16 shrink-0 bg-red-50 border border-red-200 rounded-[8px] flex flex-col items-center justify-center gap-0.5 group-hover:border-red-400 group-hover:bg-red-100/80 transition-all shadow-2xs">
                            <FileText size={24} className="text-red-600 group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-extrabold text-red-700 uppercase tracking-wider px-1 py-0.2 bg-red-100/90 rounded-[2px]">
                              PDF
                            </span>
                          </div>

                          {/* Title & Metadata */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Clock size={12} className="text-[#FC5115] shrink-0" />
                              <span>{news.date}</span>
                            </div>
                            <h3 className="text-sm font-bold text-[#333] group-hover:text-[#FC5115] transition-colors leading-snug line-clamp-2">
                              {news.title}
                            </h3>
                          </div>
                        </div>

                        {/* Right: File Size & Download Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                          <div className="text-right">
                            <span className="block text-xs font-bold text-slate-500 group-hover:text-[#FC5115] transition-colors">
                              {(news as ShareholderNewsItem).pdfSize || 'PDF Document'}
                            </span>
                            {pdfDownloadedId === news.title && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1 animate-pulse">
                                <CheckCircle2 size={12} /> Đã tải tệp
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadAttachment(news.title);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-[#FC5115] text-white text-xs font-bold transition-all rounded-[6px] shadow-2xs group-hover:bg-[#FC5115] shrink-0"
                          >
                            <Download size={14} />
                            <span>Tải về</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      onClick={() => handleSelectNews(news.id)}
                      className="group cursor-pointer bg-transparent border-0 p-0 transition-all duration-300 shadow-none flex flex-col overflow-hidden rounded-[12px]"
                    >
                      {/* Top: Image Container */}
                      <div className="w-full h-52 lg:h-56 shrink-0 relative overflow-hidden bg-slate-900 rounded-[14px]">
                        <img 
                          src={news.img} 
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Bottom: Card Content */}
                      <div className="pt-4 pb-2 flex flex-col flex-1 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <Clock size={12} className="text-[#FC5115] shrink-0" />
                          <span>{news.date}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium">{getTypeSimpleText(news)}</span>
                        </div>

                        {/* Title - Max 2 lines */}
                        <h3 className="text-base font-semibold text-[#333] group-hover:text-[#FC5115] transition-colors leading-snug line-clamp-2">
                          {news.title}
                        </h3>

                        {/* Excerpt - Max 3 lines */}
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal flex-1">
                          {news.shortDesc}
                        </p>

                        {/* Hover Arrow CTA */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#FC5115] pr-2">
                          <span>Đọc tiếp</span>
                          <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION ENGINE CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isCurrent = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 border flex items-center justify-center text-xs font-bold transition-all rounded-[8px] cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-orange-600 hover:text-orange-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px] cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* TECH CONSULTATION CTA SECTION */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 sm:mt-16 bg-white text-slate-900 p-8 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden rounded-2xl"
            >
              <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-950">
                    Cần tư vấn giải pháp?
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                    Đội ngũ chuyên gia CIC luôn sẵn sàng đồng hành, tư vấn và cung cấp các giải pháp phần mềm, chuyển đổi số phù hợp nhất cho bạn.
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenConsultation?.()}
                    className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white px-6 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 rounded-[8px] cursor-pointer"
                  >
                    <span>Liên hệ tư vấn</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.section>

          </div>
        )}

      </div>

      {/* Interactive Bell Notification Modal */}
      <AnimatePresence>
        {showBellModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-[16px] shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-500 shrink-0">
                    <BellRing size={20} className="animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight">
                      Bảng Tin Nổi Bật & Thông Báo CIC Tech
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cập nhật tin nóng tức thì về công nghệ, khuyến mại & sự kiện
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBellModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* Bell Alert Toggle */}
                <div className="p-4 bg-orange-50/60 border border-orange-200/80 rounded-[12px] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Bell size={14} className="text-orange-600" />
                      <span>Thông báo tin nóng trên trình duyệt</span>
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      {bellSubscribed ? 'Đang bật: Bạn sẽ nhận tin nổi bật ngay khi có thông cáo mới.' : 'Đang tắt thông báo tự động.'}
                    </p>
                  </div>
                  <button
                    onClick={toggleBellSubscription}
                    className={`px-3 py-1.5 text-xs font-bold rounded-[8px] transition-all cursor-pointer shrink-0 ${
                      bellSubscribed
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    {bellSubscribed ? 'Đã bật' : 'Bật ngay'}
                  </button>
                </div>

                {/* Email Subscription Form */}
                <form onSubmit={handleBellSubscribe} className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Đăng ký nhận tin tức qua Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Nhập email của bạn..."
                      value={bellEmail}
                      onChange={(e) => setBellEmail(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded-[8px] focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer shrink-0"
                    >
                      Đăng ký
                    </button>
                  </div>
                </form>

                {/* Latest Breaking News Feed inside Modal */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
                    <span>Tin tức nổi bật mới cập nhật</span>
                    <span className="text-[10px] text-orange-600 font-bold">{breakingNewsList.length} tin mới</span>
                  </h4>
                  <div className="space-y-2">
                    {breakingNewsList.map((item) => (
                      <div
                        key={`bell-modal-${item.id}`}
                        onClick={() => {
                          handleSelectNews(item.id);
                          setShowBellModal(false);
                        }}
                        className="p-3 bg-slate-50 hover:bg-orange-50/50 border border-slate-200 hover:border-orange-300 rounded-[10px] cursor-pointer transition-all flex items-start gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-slate-200 shrink-0">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-bold text-orange-600 uppercase">{item.category}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 line-clamp-1">
                            {item.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.shortDesc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowBellModal(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-[8px] transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

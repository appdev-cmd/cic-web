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
  Palette
} from 'lucide-react';
import { newsData, DetailedNewsItem, CompanyNewsItem, SpecialtyNewsItem, RecruitmentNewsItem, PromotionNewsItem, ShareholderNewsItem } from '../data/newsData';
import { projectsData } from '../data/projectsData';
import { eventsData } from '../data/eventsData';
import { productsData } from '../data/mockData';

interface NewsViewProps {
  key?: string | number;
  initialCategory?: string | null;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProduct?: (productId: number) => void;
  onNavigateHome: () => void;
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
  onNavigateHome 
}: NewsViewProps) {
  
  // Navigation states
  const [activeCategory, setActiveCategory] = useState<'all' | 'company' | 'specialty' | 'recruitment' | 'promotion' | 'shareholder'>('all');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category-specific sub-filters
  const [companySubType, setCompanySubType] = useState<'Tất cả' | 'Hoạt động CIC' | 'Thông báo' | 'Văn hóa doanh nghiệp'>('Tất cả');
  const [specialtySubType, setSpecialtySubType] = useState<'Tất cả' | 'Kiến thức' | 'Cập nhật công nghệ' | 'Chính sách' | 'Giải pháp'>('Tất cả');
  
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
      if (['company', 'specialty', 'recruitment', 'promotion', 'shareholder'].includes(cat)) {
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
  }, [activeCategory, searchQuery, companySubType, specialtySubType, recruitmentDept, recruitmentLoc, recruitmentStatus, promotionStatus, shareholderYear, shareholderDocType]);

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
    // 1. Category check
    if (activeCategory !== 'all' && item.category !== activeCategory) {
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

  // CMS Linked Entities (Lookup from Products, Projects, Events datasets)
  const linkedProducts = selectedItem?.relatedProductIds
    ? productsData.filter(p => selectedItem.relatedProductIds?.includes(p.id))
    : [];

  const effectiveLinkedProducts = React.useMemo(() => {
    if (linkedProducts.length > 0) return linkedProducts;
    if (!selectedItem) return [];

    if (selectedItem.category === 'promotion') {
      const pItem = selectedItem as PromotionNewsItem;
      const searchText = (pItem.title + ' ' + (pItem.appliedTargets || []).join(' ') + ' ' + (pItem.tags || []).join(' ')).toLowerCase();
      
      const matched = productsData.filter(prod => {
        const pName = prod.name.toLowerCase();
        if (searchText.includes('enjicad') && pName.includes('enjicad')) return true;
        if (searchText.includes('gstarcad') && pName.includes('gstarcad')) return true;
        if (searchText.includes('prokon') && pName.includes('prokon')) return true;
        if ((searchText.includes('bim') || searchText.includes('cde') || searchText.includes('gis')) && (pName.includes('enjicad') || pName.includes('prokon') || pName.includes('rdw') || pName.includes('vinasas'))) return true;
        if (searchText.includes('quan trắc') || searchText.includes('geo-cic') || searchText.includes('thủy điện')) {
          if (pName.includes('rô bốt') || pName.includes('địa chấn') || prod.productType === 'Thiết bị') return true;
        }
        return false;
      });

      return matched.length > 0 ? matched : productsData.slice(0, 3);
    }

    return [];
  }, [selectedItem, linkedProducts]);

  const linkedProjects = selectedItem?.relatedProjectIds
    ? projectsData.filter(p => selectedItem.relatedProjectIds?.includes(p.id))
    : [];

  const linkedEvents = selectedItem?.relatedEventIds
    ? eventsData.filter(e => selectedItem.relatedEventIds?.includes(e.id))
    : [];

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

  // TOC Visibility Rule: Show for specialty articles or company articles with headings.
  // Hide strictly for recruitment, promotion, and shareholder articles.
  const showTOC = selectedItem?.category === 'specialty' || (selectedItem?.category === 'company' && rawTocItems.length > 0);
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

  // Get related articles
  const relatedArticles = React.useMemo(() => {
    if (!selectedItem) return [];
    const sameCategory = newsData.filter(item => item.id !== selectedItem.id && item.category === selectedItem.category);
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);

    const otherCategory = newsData.filter(item => item.id !== selectedItem.id && item.category !== selectedItem.category);
    return [...sameCategory, ...otherCategory].slice(0, 4);
  }, [selectedItem]);

  // Helper lists for selectors
  const depts = ['Tất cả', 'Khối Kỹ thuật', 'Khối Kinh doanh', 'Khối Hỗ trợ', 'Khối Nghiên cứu & Phát triển'];
  const locs = ['Tất cả', 'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'];
  const rStatuses = ['Tất cả', 'Đang tuyển', 'Đã hết hạn'];
  const pStatuses = ['Tất cả', 'Đang diễn ra', 'Đã kết thúc'];
  const shYears = ['Tất cả', '2026'];
  const shDocTypes = ['Tất cả', 'Thông báo', 'Báo cáo', 'Nghị quyết', 'Tài liệu cổ đông'];

  // Categories helper to render beautiful tabs
  const categoriesList = [
    { id: 'all', label: 'Tất cả tin tức', icon: BookOpen },
    { id: 'company', label: 'Tin tức công ty', icon: Building2 },
    { id: 'specialty', label: 'Tin chuyên ngành', icon: Globe },
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
            className="space-y-8"
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
                {/* Back Button */}
                <button
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors bg-white px-4 py-2 border border-slate-200 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại danh sách tin tức</span>
                </button>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="bg-orange-600/10 border border-orange-500/20 text-orange-600 font-black px-3 py-1 uppercase tracking-wider text-[10px]">
                    {categoriesList.find(c => c.id === selectedItem.category)?.label || selectedItem.category}
                  </span>
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    {selectedItem.date}
                  </span>
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    ~{Math.max(1, Math.ceil(selectedItem.contentMarkdown.split(' ').length / 180))} phút đọc
                  </span>
                  {selectedItem.author && (
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-orange-600" />
                      {selectedItem.author}
                    </span>
                  )}
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

                <p className="text-xs sm:text-base text-slate-600 font-medium italic border-l-4 border-orange-500 pl-4 py-2 leading-relaxed bg-white/70">
                  {selectedItem.shortDesc}
                </p>

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

            {/* 2-COLUMN EXPANDED LAYOUT (Main: 8-cols, Sidebar: 4-cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* CENTER COLUMN (col-span-8): Rich Article Details - EXPANDED */}
              <main className="lg:col-span-8 space-y-8 bg-white border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-sm rounded-[10px]">
                
                {/* Featured Hero Banner Image */}
                <div className="h-72 sm:h-[460px] lg:h-[500px] w-full relative overflow-hidden group rounded-[10px]">
                  <img 
                    src={selectedItem.img} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-[10px]"
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
                  {(() => {
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
                              <li key={iIdx} className="flex items-start gap-2 text-slate-700 text-xs md:text-sm leading-relaxed">
                                <CornerDownRight size={14} className="text-orange-600 shrink-0 mt-1" />
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

                {/* Additional Media: Video & Attachments */}
                {(selectedItem.gallery && selectedItem.gallery.length > 1) || selectedItem.video || selectedItem.attachments ? (
                  <div className="space-y-6 pt-8 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-l-4 border-orange-600 pl-3">
                      Tài liệu bổ sung & Phương tiện trực quan
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Video embed */}
                      {selectedItem.video && (
                        <div className="space-y-2 md:col-span-2">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Video size={14} className="text-orange-600" /> Video giới thiệu/sự kiện
                          </h4>
                          <div className="bg-slate-900 border border-slate-800 relative overflow-hidden h-52 flex flex-col justify-center items-center">
                            {!isVideoPlaying ? (
                              <>
                                <img 
                                  src={selectedItem.video.thumbnail} 
                                  alt="Video thumbnail" 
                                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-slate-950/40"></div>
                                <button
                                  onClick={() => setIsVideoPlaying(true)}
                                  className="w-12 h-12 bg-orange-600 hover:bg-orange-700 hover:scale-105 text-white flex items-center justify-center rounded-full z-10 shadow-lg transition-all"
                                >
                                  <Play size={20} className="ml-1" />
                                </button>
                                <span className="absolute bottom-3 left-3 text-[9px] font-bold text-white z-10 uppercase tracking-widest bg-slate-900/85 px-2 py-0.5">
                                  {selectedItem.video.title}
                                </span>
                              </>
                            ) : (
                              <iframe
                                title="News Video Player"
                                src={selectedItem.video.embedUrl + "?autoplay=1"}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Attachments list */}
                      {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                        <div className="space-y-2 md:col-span-2">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tài liệu đính kèm tải về</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedItem.attachments.map((file, idx) => {
                              const isDownloaded = pdfDownloadedId === file.title && downloadProgress === 100;
                              const isDownloading = pdfDownloadedId === file.title && downloadProgress < 100;
                              return (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
                                  <div className="flex gap-3 items-start">
                                    <div className="h-9 w-9 bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                                      <FileText size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                      <h5 className="text-[11px] font-black text-slate-950 line-clamp-2 uppercase">
                                        {file.title}
                                      </h5>
                                      <p className="text-xs text-slate-400">{file.size}</p>
                                    </div>
                                  </div>

                                  {isDownloading && (
                                    <div className="w-full bg-slate-200 h-1">
                                      <div className="bg-orange-600 h-full transition-all" style={{ width: `${downloadProgress}%` }}></div>
                                    </div>
                                  )}

                                  <button
                                    onClick={() => handleDownloadAttachment(file.title)}
                                    disabled={isDownloaded}
                                    className={`w-full py-2 text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-1.5 rounded-none ${
                                      isDownloaded
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                        : 'bg-white hover:bg-slate-900 hover:text-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {isDownloaded ? <><Check size={12} /> Đã tải thành công</> : <><Download size={12} /> Tải tài liệu (.PDF)</>}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Consultation Form Widget - Clean Orange Framed Theme */}
                {selectedItem.category !== 'recruitment' && (
                  <div className="bg-white border border-orange-200 border-l-4 border-l-orange-500 p-6 md:p-8 space-y-4 my-6 shadow-2xs rounded-[10px]">
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
                              placeholder="Nguyễn Văn A"
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:border-orange-500 focus:bg-white transition-colors rounded-[8px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Email liên hệ *</label>
                            <input
                              type="email"
                              required
                              value={consultEmail}
                              onChange={(e) => setConsultEmail(e.target.value)}
                              placeholder="email@congty.com"
                              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 p-2.5 text-xs focus:outline-none focus:border-orange-500 focus:bg-white transition-colors rounded-[8px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Nội dung yêu cầu</label>
                          <textarea
                            rows={3}
                            value={consultMessage}
                            onChange={(e) => setConsultMessage(e.target.value)}
                            placeholder="Tôi muốn nhận thông tin tư vấn giải pháp..."
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

                {/* Author Info Card */}
                {selectedItem.author && (
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold overflow-hidden border border-slate-300">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{selectedItem.author}</h4>
                        <p className="text-xs text-slate-400 font-medium">Ban biên tập tin tức CIC Tech</p>
                      </div>
                    </div>
                    <button
                      onClick={handleShareClick}
                      className="p-2 border border-slate-200 hover:border-orange-500 text-slate-600 hover:text-orange-600 transition-colors"
                      title="Sao chép đường dẫn"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                )}
              </main>

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
                  <div className="bg-white border border-slate-200/80 shadow-2xs p-5 space-y-3 rounded-[10px]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Box size={16} className="text-orange-600" />
                        <span>Giải pháp liên quan</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">CIC Tech</span>
                    </h3>
                    <div className="space-y-2.5">
                      {effectiveLinkedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            if (onNavigateToProduct) onNavigateToProduct(prod.id);
                          }}
                          className="group cursor-pointer p-2.5 bg-white border border-slate-200/80 hover:border-orange-500 transition-all flex items-center gap-3 shadow-2xs rounded-[8px]"
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

                {/* Related Articles (Tin tức liên quan) */}
                {relatedArticles.length > 0 && (
                  <div className="bg-white border border-slate-200/80 shadow-2xs p-5 space-y-3 rounded-[10px]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-orange-600" />
                        <span>Tin tức liên quan</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">CIC News</span>
                    </h3>

                    <div className="space-y-2.5">
                      {relatedArticles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => handleSelectNews(article.id)}
                          className="group cursor-pointer p-2.5 bg-white border border-slate-200/80 hover:border-orange-500 transition-all flex items-center gap-3 shadow-2xs rounded-[8px]"
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
          <div className="space-y-12">
            
            {/* Header section */}
            <div className="border-l-4 border-orange-600 pl-6 space-y-2">
              <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tight">
                Tin Tức & Truyền Thông
              </h1>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Cập nhật thông tin hoạt động, kiến thức kỹ thuật chuyên ngành và các thông cáo cổ đông mới nhất
              </p>
            </div>

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
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-700 ease-out"
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

                    <p className="text-xs lg:text-sm text-slate-300 line-clamp-2 leading-relaxed font-medium max-w-3xl">
                      {filteredNews[0].shortDesc}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FC5115]">
                      <span>Đọc tiếp</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
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
                      className="group cursor-pointer flex gap-4 items-center p-3 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs hover:shadow rounded-[10px] overflow-hidden"
                    >
                      {/* Larger Thumbnail Image */}
                      <div className="w-36 sm:w-40 lg:w-44 h-28 lg:h-32 shrink-0 overflow-hidden relative bg-slate-900 rounded-[10px]">
                        <img 
                          src={sideItem.img} 
                          alt={sideItem.title} 
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#FC5115] text-white text-[9px] font-black uppercase tracking-wider shadow rounded-[8px]">
                          {categoriesList.find(c => c.id === sideItem.category)?.label}
                        </span>
                      </div>

                      {/* Bigger Content & Excerpt */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Clock size={12} className="text-[#FC5115]" /> {sideItem.date}
                        </span>
                        <h4 className="text-sm lg:text-base font-bold text-slate-900 transition-colors line-clamp-2 leading-snug">
                          {sideItem.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 font-medium leading-relaxed hidden sm:block">
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
                      className={`shrink-0 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-[8px] flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-[#FC5115] text-white shadow-md' 
                          : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-950'
                      }`}
                    >
                      <CatIcon size={14} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SECONDARY FILTER ENGINE BAR */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-100/60 p-4 rounded-[10px]">
                {/* Search Input */}
                <div className="md:col-span-6 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
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
                      {['Tất cả', 'Hoạt động CIC', 'Thông báo', 'Văn hóa doanh nghiệp'].map(st => (
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
                  <>
                    <div className="md:col-span-2">
                      <select
                        value={shareholderYear}
                        onChange={(e) => setShareholderYear(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                      >
                        {shYears.map(y => <option key={y} value={y}>Năm: {y}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <select
                        value={shareholderDocType}
                        onChange={(e) => setShareholderDocType(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#FC5115] px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none transition-all rounded-[8px] cursor-pointer"
                      >
                        {shDocTypes.map(d => <option key={d} value={d}>Loại: {d}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* Reset Filters button */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCompanySubType('Tất cả');
                      setSpecialtySubType('Tất cả');
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

            {/* EDITORIAL LIST SHOWCASE (APPLE / NVIDIA NEWSROOM STYLE - NO CARDS / NO BOXES) */}
            {paginatedNews.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-300 space-y-4 rounded-[10px]">
                <p className="text-slate-500 font-medium text-sm">Không tìm thấy tin tức hay văn bản nào phù hợp với bộ lọc.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCompanySubType('Tất cả');
                    setSpecialtySubType('Tất cả');
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedNews.map((news, index) => {
                  
                  // Specific badges depending on type
                  let typeBadge = null;
                  if (news.category === 'recruitment') {
                    const r = news as RecruitmentNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 rounded-[8px]">
                        {r.position} • {r.location}
                      </span>
                    );
                  } else if (news.category === 'promotion') {
                    const p = news as PromotionNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-orange-100 text-orange-800 rounded-[8px]">
                        {p.status}
                      </span>
                    );
                  } else if (news.category === 'shareholder') {
                    const s = news as ShareholderNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-indigo-100 text-indigo-800 rounded-[8px]">
                        {s.docType} ({s.year})
                      </span>
                    );
                  } else if (news.category === 'company') {
                    const c = news as CompanyNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-amber-100 text-amber-800 rounded-[8px]">
                        {c.subType}
                      </span>
                    );
                  } else if (news.category === 'specialty') {
                    const sp = news as SpecialtyNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-sky-100 text-sky-800 rounded-[8px]">
                        {sp.subType}
                      </span>
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
                      className="group cursor-pointer bg-white border border-slate-200/90 p-3 hover:border-orange-500/40 transition-all duration-300 shadow-2xs hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden rounded-[10px]"
                    >
                      {/* Top: Image Container */}
                      <div className="w-full h-48 lg:h-52 shrink-0 relative overflow-hidden bg-slate-900 rounded-[10px]">
                        <img 
                          src={news.img} 
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 bg-[#FC5115] text-white text-[9px] font-black uppercase tracking-wider shadow-sm rounded-[8px]">
                            {categoriesList.find(c => c.id === news.category)?.label}
                          </span>
                        </div>
                      </div>

                      {/* Bottom: Card Content */}
                      <div className="p-4 flex flex-col flex-1 space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                            <Clock size={12} className="text-[#FC5115]" /> {news.date}
                          </span>
                          {typeBadge}
                        </div>

                        {/* Title - Max 2 lines */}
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#FC5115] transition-colors leading-snug line-clamp-2">
                          {news.title}
                        </h3>

                        {/* Excerpt - Max 3 lines */}
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal flex-1">
                          {news.shortDesc}
                        </p>

                        {/* Hover Arrow CTA */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#FC5115]">
                          <span>Đọc tiếp</span>
                          <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION ENGINE CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center gap-1 px-3 py-2 bg-white border text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                    currentPage === 1
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500'
                  }`}
                >
                  <ChevronLeft size={14} /> Trước
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isCurrent = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 flex items-center justify-center text-xs font-bold transition-all border rounded-none ${
                          isCurrent
                            ? 'bg-orange-600 border-orange-600 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center gap-1 px-3 py-2 bg-white border text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                    currentPage === totalPages
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500'
                  }`}
                >
                  Sau <ChevronRight size={14} />
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
  Copy
} from 'lucide-react';
import { newsData, DetailedNewsItem, CompanyNewsItem, SpecialtyNewsItem, RecruitmentNewsItem, PromotionNewsItem, ShareholderNewsItem } from '../data/newsData';

interface NewsViewProps {
  key?: string | number;
  initialCategory?: string | null;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToProduct?: (productId: number) => void;
  onNavigateHome: () => void;
}

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
  const itemsPerPage = 4;

  // Detail View Interactive states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfDownloadedId, setPdfDownloadedId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

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

  // Get related articles
  const relatedArticles = selectedItem 
    ? newsData.filter(item => item.id !== selectedItem.id && item.category === selectedItem.category).slice(0, 3)
    : [];

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
      <div className="max-w-7xl mx-auto px-6">
        
        {/* VIEW 1: NEWS DETAIL VIEW */}
        {selectedItem ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Back Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <button
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft size={16} /> Quay lại danh sách tin tức
              </button>
              <div className="text-[10px] font-sans font-bold text-slate-400">
                TIN TỨC / {selectedItem.category.toUpperCase()} / {selectedItem.id.toUpperCase()}
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Rich Article Details (8-cols) */}
              <div className="lg:col-span-8 space-y-8 bg-white border border-slate-200/80 p-6 lg:p-8 shadow-sm">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-sans text-slate-400">
                  <span className="px-2 py-0.5 bg-orange-600/10 border border-orange-500/20 text-orange-600 text-[10px] font-sans font-black uppercase tracking-wider">
                    {categoriesList.find(c => c.id === selectedItem.category)?.label}
                  </span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {selectedItem.date}</span>
                  {selectedItem.author && <span className="flex items-center gap-1"><User size={12} /> {selectedItem.author}</span>}
                  {selectedItem.views && <span className="flex items-center gap-1"><Eye size={12} /> {selectedItem.views} lượt xem</span>}
                </div>

                {/* Main Title & Tagline */}
                <div className="space-y-4">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                    {selectedItem.title}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 font-bold italic border-l-4 border-orange-500 pl-4 py-1 leading-relaxed bg-slate-50">
                    "{selectedItem.shortDesc}"
                  </p>
                </div>

                {/* Featured Hero Banner Image */}
                <div className="h-64 md:h-[400px] w-full border border-slate-200 relative overflow-hidden">
                  <img 
                    src={selectedItem.img} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Recruitment Specific Info Box */}
                {selectedItem.category === 'recruitment' && (
                  <div className="bg-slate-950 text-white p-6 border-l-4 border-orange-600 grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                    <div className="space-y-2">
                      <p><span className="text-slate-400">Vị trí ứng tuyển:</span> <span className="text-white font-bold">{(selectedItem as RecruitmentNewsItem).position}</span></p>
                      <p><span className="text-slate-400">Phòng ban:</span> <span className="text-white font-bold">{(selectedItem as RecruitmentNewsItem).department}</span></p>
                      <p><span className="text-slate-400">Địa điểm làm việc:</span> <span className="text-white font-bold">{(selectedItem as RecruitmentNewsItem).location}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="text-slate-400">Mức lương đề xuất:</span> <span className="text-orange-400 font-black">{(selectedItem as RecruitmentNewsItem).salary}</span></p>
                      <p><span className="text-slate-400">Hình thức làm việc:</span> <span className="text-white font-bold">{(selectedItem as RecruitmentNewsItem).jobType}</span></p>
                      <p><span className="text-slate-400">Hạn nộp hồ sơ:</span> <span className="text-red-400 font-bold">{(selectedItem as RecruitmentNewsItem).deadline}</span></p>
                    </div>
                  </div>
                )}

                {/* Promotion Specific Info Box */}
                {selectedItem.category === 'promotion' && (
                  <div className="bg-orange-50 border border-orange-200 p-6 space-y-3 text-xs">
                    <h3 className="font-black uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
                      <Percent size={16} /> Thông tin chương trình khuyến mại
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-slate-700">
                      <p><span className="font-bold">Chương trình:</span> {(selectedItem as PromotionNewsItem).programName}</p>
                      <p><span className="font-bold">Thời gian áp dụng:</span> {(selectedItem as PromotionNewsItem).timeFrame}</p>
                      <p className="md:col-span-2"><span className="font-bold">Sản phẩm áp dụng:</span> {(selectedItem as PromotionNewsItem).appliedTargets.join(', ')}</p>
                    </div>
                  </div>
                )}

                {/* Shareholder Specific Info Box */}
                {selectedItem.category === 'shareholder' && (
                  <div className="bg-slate-900 text-white p-6 border-b-2 border-orange-600 grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                    <p><span className="text-slate-400">Loại văn bản:</span> <span className="text-orange-400 font-bold">{(selectedItem as ShareholderNewsItem).docType}</span></p>
                    <p><span className="text-slate-400">Năm tài chính công bố:</span> <span className="text-white font-bold">{(selectedItem as ShareholderNewsItem).year}</span></p>
                  </div>
                )}

                {/* RICH DETAILED ARTICLE TEXT WITH MARKDOWN SIMULATION */}
                <div className="prose max-w-none text-slate-700 text-xs md:text-sm leading-relaxed space-y-6">
                  {/* Since react-markdown uses standard paragraphs, let's parse raw lines to simulate formatting beautifully */}
                  {selectedItem.contentMarkdown.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={pIdx} className="text-base md:text-lg font-black uppercase text-slate-950 pt-2 border-b border-slate-100 pb-2">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('#### ')) {
                      return <h4 key={pIdx} className="text-sm md:text-base font-bold text-slate-900 pt-1">{paragraph.replace('#### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('* ')) {
                      return (
                        <ul key={pIdx} className="space-y-2.5 pl-4">
                          {paragraph.split('\n').map((line, lIdx) => (
                            <li key={lIdx} className="flex items-start gap-2 text-slate-600 font-medium">
                              <CornerDownRight size={14} className="text-orange-600 shrink-0 mt-0.5" />
                              <span>{line.replace('* ', '')}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    if (paragraph.startsWith('1. ') || paragraph.includes('\n1. ') || paragraph.includes('\n2. ')) {
                      return (
                        <ol key={pIdx} className="space-y-3.5 pl-4">
                          {paragraph.split('\n').map((line, lIdx) => {
                            const cleanLine = line.replace(/^\d+\.\s*/, '');
                            if (!cleanLine) return null;
                            return (
                              <li key={lIdx} className="flex gap-2 text-slate-600 font-medium">
                                <span className="h-5 w-5 bg-slate-950 text-white rounded-none flex items-center justify-center text-[9px] font-sans shrink-0 mt-0.5">{lIdx + 1}</span>
                                <span>{cleanLine}</span>
                              </li>
                            );
                          })}
                        </ol>
                      );
                    }
                    return <p key={pIdx} className="font-medium text-slate-600 leading-relaxed text-justify">{paragraph}</p>;
                  })}
                </div>

                {/* Additional Media: Video, Attachments / Documents */}
                {(selectedItem.gallery && selectedItem.gallery.length > 1) || selectedItem.video || selectedItem.attachments ? (
                  <div className="space-y-6 pt-8 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-l-4 border-orange-600 pl-3">
                      Tài liệu bổ sung & Phương tiện trực quan
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Video embed or placeholder */}
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
                                      <p className="text-[9px] font-sans text-slate-400">{file.size}</p>
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

              </div>

              {/* Right Column: Interaction Widgets & Related Articles (4-cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* INTERACTIVE ACTION HUB CARD */}
                <div className="bg-white border border-slate-200/80 p-6 space-y-5 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-2">
                    Tương tác bài viết
                  </h3>

                  <div className="space-y-3">
                    {/* Share Button with Link Copied notification */}
                    <button
                      onClick={handleShareClick}
                      className="w-full py-3 bg-slate-950 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2"
                    >
                      {copiedLink ? (
                        <>
                          <Check size={14} className="text-emerald-400" /> Đã sao chép liên kết!
                        </>
                      ) : (
                        <>
                          <Share2 size={14} /> Chia sẻ liên kết (Share)
                        </>
                      )}
                    </button>

                    {/* PDF Export Button */}
                    <button
                      onClick={handleExportPDF}
                      disabled={isExportingPDF}
                      className="w-full py-3 border border-slate-200 hover:border-orange-600 text-slate-700 hover:text-orange-600 text-[10px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2"
                    >
                      <FileCheck size={14} className={isExportingPDF ? 'animate-spin' : ''} />
                      {isExportingPDF ? "Đang xử lý PDF..." : "Tải bản in bài viết (PDF)"}
                    </button>
                  </div>

                  {/* Dynamic CTA Deep-link panel */}
                  <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
                    <p className="font-bold text-slate-600">Bạn quan tâm đến sản phẩm & dịch vụ liên quan của CIC Tech?</p>
                    <button
                      onClick={() => {
                        if (onNavigateToProduct) onNavigateToProduct(1);
                      }}
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1"
                    >
                      Xem phần mềm bản quyền <ArrowRight size={12} />
                    </button>
                  </div>
                </div>



                {/* RELATED ARTICLES BLOCK */}
                {relatedArticles.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-l-4 border-orange-600 pl-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
                        Bài viết cùng chuyên mục
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {relatedArticles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => handleSelectNews(article.id)}
                          className="bg-white border border-slate-200 hover:border-orange-500 group cursor-pointer p-4 flex gap-3 transition-all duration-300 shadow-sm"
                        >
                          <div className="h-16 w-20 shrink-0 overflow-hidden relative border border-slate-100">
                            <img 
                              src={article.img} 
                              alt={article.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-1 flex-1">
                            <span className="text-[8px] font-sans font-black text-orange-600 block">{article.date}</span>
                            <h4 className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase line-clamp-2 leading-snug">
                              {article.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        ) : (
          
          /* VIEW 2: CATEGORY HUB & LIST VIEW */
          <div className="space-y-10">
            
            {/* Main Header title */}
            <div className="border-l-4 border-orange-600 pl-6 space-y-2">
              <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tight">
                Tin Tức & Truyền Thông
              </h1>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Cập nhật thông tin hoạt động, kiến thức kỹ thuật chuyên ngành và các thông cáo cổ đông mới nhất
              </p>
            </div>

            {/* SIX CATEGORIES SELECTOR TABS BAR */}
            <div className="bg-white border border-slate-200/80 p-2.5 flex flex-wrap gap-1 shadow-sm">
              {categoriesList.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id as any);
                    }}
                    className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 rounded-none border ${
                      isSelected 
                        ? 'bg-slate-950 border-slate-950 text-white shadow-md' 
                        : 'bg-white border-transparent text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                    }`}
                  >
                    <CatIcon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CATEGORY DESCRIPTION CARD */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 lg:p-8 border-l-4 border-orange-600 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2">
                <span className="text-[9px] font-sans text-orange-400 font-black uppercase tracking-widest">
                  {activeCategory === 'all' ? 'TỔNG HỢP' : categoriesList.find(c => c.id === activeCategory)?.label.toUpperCase()}
                </span>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-white">
                  {activeCategory === 'all' && 'Tất cả tin tức & Quan hệ cổ đông'}
                  {activeCategory === 'company' && 'Tin tức hoạt động công ty & Văn hóa nội bộ'}
                  {activeCategory === 'specialty' && 'Kiến thức kỹ thuật & Cập nhật giải pháp'}
                  {activeCategory === 'recruitment' && 'Cơ hội phát triển nghề nghiệp tại CIC Tech'}
                  {activeCategory === 'promotion' && 'Chương trình ưu đãi phần mềm & Dịch vụ'}
                  {activeCategory === 'shareholder' && 'Công bố thông tin quan hệ cổ đông'}
                </h2>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed font-medium">
                  {activeCategory === 'all' && 'Kênh thông tin trực tuyến chính thống của Công ty Cổ phần Công nghệ và Tư vấn CIC. Tìm kiếm, tra cứu dễ dàng toàn bộ dữ liệu.'}
                  {activeCategory === 'company' && 'Các tin tức sự kiện hợp tác quốc tế, đào tạo công nghệ, thông báo vận hành và hành trình gắn kết team building của gia đình CIC.'}
                  {activeCategory === 'specialty' && 'Chuyên mục chia sẻ các nghiên cứu địa lý, địa chất sâu, cập nhật chính sách của Bộ Xây dựng và ứng dụng Digital Twins thời gian thực.'}
                  {activeCategory === 'recruitment' && 'CIC Tech chào đón các nhân tài trong lĩnh vực thiết kế BIM, kinh doanh giải pháp kỹ thuật cao. Môi trường chuyên nghiệp, chế độ đẳng cấp.'}
                  {activeCategory === 'promotion' && 'Nhận báo giá và quà tặng đi kèm các gói phần mềm CAD bản quyền vĩnh viễn enjiCAD Pro, GstarCAD, Autodesk ưu đãi lớn.'}
                  {activeCategory === 'shareholder' && 'Hệ thống lưu trữ nghị quyết Đại hội cổ đông, biên bản họp Hội đồng quản trị và báo cáo tài chính hàng năm đạt chuẩn ISO.'}
                </p>
              </div>

              {/* Little stats badge */}
              <div className="bg-slate-800 border border-slate-700 p-4 text-center shrink-0 min-w-[120px]">
                <span className="text-[10px] font-sans text-slate-400 uppercase font-bold block">Tổng số lượng</span>
                <span className="text-3xl font-black text-orange-500 font-sans">{filteredNews.length}</span>
                <span className="text-[9px] font-sans text-slate-400 block">bài viết</span>
              </div>
            </div>

            {/* DYNAMIC CATEGORY-SPECIFIC FILTER ENGINE */}
            <div className="bg-white border border-slate-200/80 p-5 lg:p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                <Filter size={16} className="text-orange-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Bộ lọc tra cứu chuyên sâu</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                
                {/* Search query (Universal for all views) */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Từ khóa tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nhập tiêu đề hoặc tóm tắt..."
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white pl-9 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-none"
                    />
                  </div>
                </div>

                {/* Sub-Filters conditional on Selected Category */}
                {activeCategory === 'company' && (
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Chuyên mục nhỏ</label>
                    <select
                      value={companySubType}
                      onChange={(e: any) => setCompanySubType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                    >
                      {['Tất cả', 'Hoạt động CIC', 'Thông báo', 'Văn hóa doanh nghiệp'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeCategory === 'specialty' && (
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Phân loại nội dung</label>
                    <select
                      value={specialtySubType}
                      onChange={(e: any) => setSpecialtySubType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                    >
                      {['Tất cả', 'Kiến thức', 'Cập nhật công nghệ', 'Chính sách', 'Giải pháp'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeCategory === 'recruitment' && (
                  <>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Phòng ban</label>
                      <select
                        value={recruitmentDept}
                        onChange={(e) => setRecruitmentDept(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                      >
                        {depts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Địa điểm</label>
                      <select
                        value={recruitmentLoc}
                        onChange={(e) => setRecruitmentLoc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                      >
                        {locs.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Trạng thái</label>
                      <select
                        value={recruitmentStatus}
                        onChange={(e) => setRecruitmentStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                      >
                        {rStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {activeCategory === 'promotion' && (
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Trạng thái ưu đãi</label>
                    <select
                      value={promotionStatus}
                      onChange={(e) => setPromotionStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                    >
                      {pStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {activeCategory === 'shareholder' && (
                  <>
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Năm tài liệu</label>
                      <select
                        value={shareholderYear}
                        onChange={(e) => setShareholderYear(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                      >
                        {shYears.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-sans">Loại tài liệu</label>
                      <select
                        value={shareholderDocType}
                        onChange={(e) => setShareholderDocType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-600 focus:bg-white px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none transition-all rounded-none cursor-pointer"
                      >
                        {shDocTypes.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* Reset button inside grid */}
                <div className="md:col-span-2">
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
                    className="w-full py-2.5 border border-slate-200 hover:border-orange-600 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-[10px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1.5"
                  >
                    Xóa lọc
                  </button>
                </div>

              </div>
            </div>

            {/* CARDS LIST GRID */}
            {paginatedNews.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 space-y-4">
                <p className="text-slate-400 font-bold text-sm">Không tìm thấy tin tức hay văn bản nào phù hợp với bộ lọc.</p>
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
                  className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all rounded-none"
                >
                  Đặt lại tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedNews.map((news, index) => {
                  
                  // Specific badges and attributes depending on type
                  let typeBadge = null;
                  let customMetaBlock = null;

                  if (news.category === 'recruitment') {
                    const r = news as RecruitmentNewsItem;
                    const isClosed = r.status === 'Đã hết hạn';
                    typeBadge = (
                      <span className={`px-2 py-0.5 font-sans text-[9px] font-black uppercase ${
                        isClosed ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.status}
                      </span>
                    );
                    customMetaBlock = (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-sans text-slate-400 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1"><Briefcase size={10} className="text-orange-600" /> Vị trí: {r.position}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} className="text-orange-600" /> {r.location}</span>
                        <span className="flex items-center gap-1"><DollarSign size={10} className="text-orange-600" /> {r.salary}</span>
                      </div>
                    );
                  } else if (news.category === 'promotion') {
                    const p = news as PromotionNewsItem;
                    const isClosed = p.status === 'Đã kết thúc';
                    typeBadge = (
                      <span className={`px-2 py-0.5 font-sans text-[9px] font-black uppercase ${
                        isClosed ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {p.status}
                      </span>
                    );
                    customMetaBlock = (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-sans text-slate-400 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1"><Clock size={10} className="text-orange-600" /> Hạn: {p.timeFrame}</span>
                      </div>
                    );
                  } else if (news.category === 'shareholder') {
                    const s = news as ShareholderNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 font-sans text-[9px] font-black uppercase bg-indigo-100 text-indigo-800">
                        {s.docType}
                      </span>
                    );
                    customMetaBlock = (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-sans text-slate-400 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1"><FileText size={10} className="text-orange-600" /> Năm: {s.year}</span>
                      </div>
                    );
                  } else if (news.category === 'company') {
                    const c = news as CompanyNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 font-sans text-[9px] font-black uppercase bg-amber-100 text-amber-800">
                        {c.subType}
                      </span>
                    );
                  } else if (news.category === 'specialty') {
                    const sp = news as SpecialtyNewsItem;
                    typeBadge = (
                      <span className="px-2 py-0.5 font-sans text-[9px] font-black uppercase bg-sky-100 text-sky-800">
                        {sp.subType}
                      </span>
                    );
                  }

                  return (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.6 }}
                      className="bg-white border border-slate-200/80 hover:border-orange-500 group flex flex-col hover:shadow-md transition-all duration-500 rounded-none overflow-hidden"
                    >
                      {/* Image header part */}
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={news.img} 
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
                        
                        {/* Tags / category pill on top */}
                        <div className="absolute top-4 left-4 flex gap-1.5 items-center">
                          <span className="px-2.5 py-0.5 bg-slate-900 text-white font-sans text-[8px] font-black uppercase tracking-wider">
                            {categoriesList.find(c => c.id === news.category)?.label}
                          </span>
                          {typeBadge}
                        </div>
                      </div>

                      {/* Content details part */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-sans font-bold text-slate-400 block flex items-center gap-1">
                            <Clock size={11} className="text-orange-500" /> {news.date}
                          </span>
                          <h3 
                            onClick={() => handleSelectNews(news.id)}
                            className="text-sm font-black text-slate-950 leading-tight group-hover:text-orange-600 transition-colors uppercase line-clamp-2 cursor-pointer pt-0.5"
                          >
                            {news.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-3 font-medium leading-relaxed pt-1">
                            {news.shortDesc}
                          </p>
                        </div>

                        {customMetaBlock}

                        <button
                          onClick={() => handleSelectNews(news.id)}
                          className="w-full py-2 bg-slate-900 hover:bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1.5"
                        >
                          Đọc chi tiết tin bài <ArrowRight size={12} />
                        </button>
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

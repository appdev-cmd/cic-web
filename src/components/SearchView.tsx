/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Box, 
  Briefcase, 
  Layers, 
  Calendar, 
  FileText, 
  MapPin, 
  Tag, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

import { productsData, newsItems } from '../data/mockData';
import { projectsData } from '../data/projectsData';
import { servicesData } from '../data/servicesData';
import { eventsData } from '../data/eventsData';

interface SearchViewProps {
  initialQuery?: string;
  onNavigateToProduct: (productId: number) => void;
  onNavigateToProject: (projectId: string) => void;
  onNavigateToService: (serviceId: string) => void;
  onNavigateToNews: (category: string) => void;
  onNavigateToEvent: (eventId: string) => void;
  onNavigateHome: () => void;
}

type ResultType = 'all' | 'product' | 'service' | 'project' | 'news' | 'event';

interface SearchResultItem {
  id: string | number;
  type: 'product' | 'service' | 'project' | 'news' | 'event';
  title: string;
  description: string;
  img: string;
  meta: string; // Price, sector, category, etc.
  tags?: string[];
  original: any;
}

export function SearchView({
  initialQuery = '',
  onNavigateToProduct,
  onNavigateToProject,
  onNavigateToService,
  onNavigateToNews,
  onNavigateToEvent,
  onNavigateHome
}: SearchViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchInputValue, setSearchInputValue] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<ResultType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state if initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
    setSearchInputValue(initialQuery);
  }, [initialQuery]);

  // Reset pagination when query or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeTab]);

  // Perform multi-source matching and normalize data
  const allResults = useMemo<SearchResultItem[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const results: SearchResultItem[] = [];

    // 1. Search Products
    productsData.forEach((item) => {
      if (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.field.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.app.toLowerCase().includes(q)
      ) {
        results.push({
          id: item.id,
          type: 'product',
          title: item.name,
          description: item.description,
          img: item.img,
          meta: `Hãng: ${item.brand} | Giá: ${item.price}`,
          tags: [item.field, item.app],
          original: item
        });
      }
    });

    // 2. Search Services
    servicesData.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: item.id,
          type: 'service',
          title: item.title,
          description: item.shortDesc,
          img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80', // generic services image
          meta: `Chuyên mục: ${item.category}`,
          tags: [item.tagline],
          original: item
        });
      }
    });

    // 3. Search Projects
    projectsData.forEach((item) => {
      if (
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q) ||
        item.solution.toLowerCase().includes(q)
      ) {
        results.push({
          id: item.id,
          type: 'project',
          title: item.name,
          description: item.shortDesc,
          img: item.gallery[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
          meta: `Địa điểm: ${item.location} | Lĩnh vực: ${item.sector}`,
          tags: [item.solution],
          original: item
        });
      }
    });

    // 4. Search News
    newsItems.forEach((item, index) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: `news-${index}`,
          type: 'news',
          title: item.title,
          description: item.desc,
          img: item.img,
          meta: `Ngày: ${item.date} | Danh mục: ${item.category === 'company' ? 'Tin công ty' : 'Tin chuyên ngành'}`,
          original: item
        });
      }
    });

    // 5. Search Events
    eventsData.forEach((item) => {
      if (
        item.title.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.longDesc.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      ) {
        results.push({
          id: item.id,
          type: 'event',
          title: item.title,
          description: item.shortDesc,
          img: item.img,
          meta: `Ngày diễn ra: ${item.date} | Địa điểm: ${item.location}`,
          tags: [item.status === 'upcoming' ? 'Sắp diễn ra' : item.status === 'ongoing' ? 'Đang diễn ra' : 'Đã diễn ra'],
          original: item
        });
      }
    });

    return results;
  }, [query]);

  // Tab counts
  const counts = useMemo(() => {
    const total = allResults.length;
    const product = allResults.filter(r => r.type === 'product').length;
    const service = allResults.filter(r => r.type === 'service').length;
    const project = allResults.filter(r => r.type === 'project').length;
    const news = allResults.filter(r => r.type === 'news').length;
    const event = allResults.filter(r => r.type === 'event').length;
    return { total, product, service, project, news, event };
  }, [allResults]);

  // Filtered by tab
  const tabFilteredResults = useMemo(() => {
    if (activeTab === 'all') return allResults;
    return allResults.filter(item => item.type === activeTab);
  }, [allResults, activeTab]);

  // Paginated
  const totalPages = Math.ceil(tabFilteredResults.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = useMemo(() => {
    return tabFilteredResults.slice(startIndex, startIndex + itemsPerPage);
  }, [tabFilteredResults, startIndex]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQuery(searchInputValue);
  };

  const handleItemClick = (item: SearchResultItem) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (item.type === 'product') {
      onNavigateToProduct(Number(item.id));
    } else if (item.type === 'project') {
      onNavigateToProject(String(item.id));
    } else if (item.type === 'service') {
      onNavigateToService(String(item.id));
    } else if (item.type === 'news') {
      onNavigateToNews(item.original.category);
    } else if (item.type === 'event') {
      onNavigateToEvent(String(item.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 font-sans relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb Navigation */}
        <nav id="search-breadcrumb" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
          <span className="cursor-pointer hover:text-orange-600 transition-colors" onClick={onNavigateHome}>Trang chủ</span>
          <ChevronRight size={10} />
          <span className="text-orange-600">Tra cứu thông tin</span>
        </nav>

        {/* Page Title & Search Bar */}
        <div className="bg-white border border-slate-100 p-8 md:p-12 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
                TRA CỨU THÔNG TIN
              </h1>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  placeholder="Nhập tên sản phẩm, dịch vụ tư vấn, dự án công trình, tin tức chuyên ngành..."
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-600 transition-colors font-bold rounded-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs tracking-wider transition-colors shrink-0"
              >
                Tìm kiếm
              </button>
            </form>

            {query.trim() && (
              <p className="text-xs text-slate-500 font-bold">
                Tìm thấy <span className="text-orange-600 font-black">{counts.total}</span> kết quả phù hợp cho từ khóa <span className="text-slate-800 font-black">"{query}"</span>
              </p>
            )}
          </div>
        </div>

        {/* Search Results Content */}
        {!query.trim() ? (
          <div className="bg-white border border-slate-100 p-12 text-center shadow-sm">
            <Search size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase">Chào mừng đến với hệ thống tìm kiếm</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
              Vui lòng nhập từ khóa vào thanh tìm kiếm ở trên để bắt đầu tra cứu thông tin sản phẩm, dự án, dịch vụ, tin tức, và sự kiện của CIC.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Filter Tabs / Phân nhóm kết quả */}
            <div className="flex border-b border-slate-200 overflow-x-auto pb-px scrollbar-thin">
              {[
                { type: 'all', label: 'Tất cả', count: counts.total },
                { type: 'product', label: 'Sản phẩm', count: counts.product },
                { type: 'service', label: 'Dịch vụ', count: counts.service },
                { type: 'project', label: 'Dự án', count: counts.project },
                { type: 'news', label: 'Tin tức', count: counts.news },
                { type: 'event', label: 'Sự kiện', count: counts.event }
              ].map((tab) => (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type as ResultType);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                    activeTab === tab.type
                      ? 'border-orange-600 text-orange-600 bg-white font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {tab.type === 'product' && <Box size={14} />}
                  {tab.type === 'service' && <Briefcase size={14} />}
                  {tab.type === 'project' && <Layers size={14} />}
                  {tab.type === 'news' && <FileText size={14} />}
                  {tab.type === 'event' && <Calendar size={14} />}
                  
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] rounded-none ${
                    activeTab === tab.type 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Results Grid / List */}
            {tabFilteredResults.length === 0 ? (
              /* Trạng thái không có kết quả */
              <div className="bg-white border border-slate-100 p-16 text-center shadow-sm">
                <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Không tìm thấy kết quả</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-6 font-medium">
                  Rất tiếc, chúng tôi không tìm thấy thông tin nào phù hợp với từ khóa <span className="font-bold text-slate-800">"{query}"</span> trong phân mục được chọn.
                </p>
                <div className="inline-block text-left bg-slate-50 border border-slate-200 p-6 max-w-md mx-auto">
                  <h4 className="text-xs font-black uppercase text-slate-800 mb-2">Gợi ý tìm kiếm:</h4>
                  <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
                    <li>Kiểm tra lại chính tả của từ khóa.</li>
                    <li>Sử dụng từ khóa tổng quát hơn hoặc ít từ hơn (ví dụ: thay vì "phần mềm enjicad 2026 chính hãng", hãy tìm "enjiCAD").</li>
                    <li>Chuyển qua tab <span className="font-bold">"Tất cả"</span> để tìm kiếm trên phạm vi toàn bộ website.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {paginatedResults.map((item, idx) => (
                      <motion.div
                        key={`${item.type}-${item.id}-${idx}`}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: (idx % 3) * 0.05 }}
                        onClick={() => handleItemClick(item)}
                        className="bg-white border border-slate-200 hover:border-orange-600 hover:shadow-lg transition-all duration-300 p-5 flex gap-4 group cursor-pointer"
                      >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-slate-100 border border-slate-100 overflow-hidden relative">
                          <img 
                            src={item.img} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <span className={`absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm ${
                            item.type === 'product' ? 'bg-indigo-600' :
                            item.type === 'service' ? 'bg-orange-600' :
                            item.type === 'project' ? 'bg-teal-600' :
                            item.type === 'news' ? 'bg-blue-600' : 'bg-red-600'
                          }`}>
                            {item.type === 'product' ? 'Sản phẩm' :
                             item.type === 'service' ? 'Dịch vụ' :
                             item.type === 'project' ? 'Dự án' :
                             item.type === 'news' ? 'Tin tức' : 'Sự kiện'}
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block truncate">
                              {item.meta}
                            </span>
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <div className="flex gap-1.5 overflow-hidden max-w-[70%]">
                              {item.tags?.slice(0, 1).map((tag, tIdx) => (
                                <span key={tIdx} className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 font-bold truncate">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] font-black uppercase text-orange-600 flex items-center gap-1 shrink-0">
                              Chi tiết <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination / Phân trang */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pNum = i + 1;
                      return (
                        <button
                          key={pNum}
                          onClick={() => setCurrentPage(pNum)}
                          className={`w-10 h-10 border flex items-center justify-center text-xs font-black transition-all ${
                            currentPage === pNum
                              ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-orange-600 hover:text-orange-600'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Mail, 
  User, 
  ChevronRight, 
  Briefcase, 
  Send, 
  Building2, 
  Check,
  Search,
  X,
  ChevronLeft,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  MessageSquare,
  Filter
} from 'lucide-react';
import { getServicesData } from '../features/services/servicesData';
import type { ServiceDetail } from '../features/services/types';
import { getProductsData } from '../features/products/productsData';
import { Product } from '@shared/types';

interface ServicesViewProps {
  key?: string | number;
  initialServiceId?: string | null;
  onNavigateHome?: () => void;
  onOpenConsultation?: () => void;
  previewService?: ServiceDetail;
}

const cleanCmsHtml = (htmlString: string): string => {
  if (!htmlString) return '';
  let cleaned = htmlString;

  // 1. Remove duplicate title_head block if present
  cleaned = cleaned.replace(/<div\s+class=["']title_head[^"']*["']>[\s\S]*?<\/div>/gi, '');

  // 2. Convert heading tags (h1, h2, h3, h4) that wrap long sentences (> 90 chars) into normal <p> tags
  cleaned = cleaned.replace(/<h[1234][^>]*>([\s\S]*?)<\/h[1234]>/gi, (match, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (text.length > 90) {
      return `<p>${inner}</p>`;
    }
    return match;
  });

  // 3. Strip problematic inline style declarations
  cleaned = cleaned
    .replace(/font-family\s*:\s*[^;"]+;?/gi, '')
    .replace(/font-size\s*:\s*[^;"]+;?/gi, '')
    .replace(/line-height\s*:\s*[^;"]+;?/gi, '')
    .replace(/background-color\s*:\s*[^;"]+;?/gi, '')
    .replace(/background\s*:\s*[^;"]+;?/gi, '')
    .replace(/color\s*:\s*[^;"]+;?/gi, '')
    // 4. Normalize image paths & ensure referrerpolicy
    .replace(/src="\/upload_images\//g, 'src="https://www.cic.com.vn/upload_images/')
    .replace(/<img\b(?![^>]*\breferrerpolicy=)/gi, '<img referrerpolicy="no-referrer"');

  return cleaned;
};

const getServiceExcerpt = (service: ServiceDetail): string => {
  if (service.shortDesc && service.shortDesc.trim().length > 15) {
    return service.shortDesc.trim();
  }
  if (service.htmlContent) {
    const cleanText = service.htmlContent
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanText.length > 20) {
      return cleanText.slice(0, 160) + '...';
    }
  }
  return service.tagline || service.title;
};

export const ServicesView = ({ initialServiceId = null, onNavigateHome, previewService }: ServicesViewProps) => {
  const servicesData = useMemo(() => {
    const services = getServicesData().services;
    return previewService ? [previewService, ...services.filter((item) => item.id !== previewService.id)] : services;
  }, [previewService]);
  const { products: productsData } = useMemo(getProductsData, []);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(initialServiceId);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    service: 'Tư vấn BIM',
    notes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 4 equal size white blocks per page as requested

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const activeService = servicesData.find(s => s.id === activeServiceId);

  // Handle fallback images for broken image URLs in htmlContent
  useEffect(() => {
    if (activeService) {
      const timer = setTimeout(() => {
        const images = document.querySelectorAll('.service-cms-content img');
        images.forEach((img) => {
          const htmlImg = img as HTMLImageElement;
          htmlImg.onerror = () => {
            htmlImg.onerror = null;
            htmlImg.src = activeService.image || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80";
          };
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeService, productsData]);

  const filteredServices = servicesData.filter(service => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.title.toLowerCase().includes(query) ||
      service.shortDesc.toLowerCase().includes(query) ||
      (service.tagline || '').toLowerCase().includes(query) ||
      (service.category || '').toLowerCase().includes(query)
    );
  });

  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Watch for external initial ID updates
  useEffect(() => {
    setActiveServiceId(initialServiceId);
  }, [initialServiceId]);

  // Related products modal state
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  const currentRelatedProducts = useMemo(() => {
    if (!activeService) return [];
    if (activeService.relatedProductIds && activeService.relatedProductIds.length > 0) {
      return productsData.filter(p => activeService.relatedProductIds!.includes(p.id));
    }
    return productsData.slice(0, 4);
  }, [activeService]);

  const relatedServices = useMemo(() => {
    if (!activeService) return [];
    const sameCategory = servicesData.filter(s => s.id !== activeService.id && s.category === activeService.category);
    const otherServices = servicesData.filter(s => s.id !== activeService.id && s.category !== activeService.category);
    return [...sameCategory, ...otherServices].slice(0, 3);
  }, [activeService, servicesData]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullname || !formData.phone) {
      alert("Vui lòng điền họ tên và số điện thoại liên hệ.");
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ fullname: '', phone: '', email: '', service: 'Tư vấn BIM', notes: '' });
    }, 5000);
  };

  const handleServiceSelect = (id: string) => {
    setActiveServiceId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-28 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {!activeService ? (
            /* ============================================================== */
            /* 1. CATALOG PAGE (TRANG DANH MỤC DỊCH VỤ & GIẢI PHÁP)           */
            /* ============================================================== */
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Header section */}
              <div className="border-l-4 border-orange-600 pl-6 space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-[#444] uppercase tracking-tight">
                  GIẢI PHÁP &amp; DỊCH VỤ CÔNG NGHỆ
                </h1>
                <p className="max-w-4xl text-sm leading-relaxed text-slate-600">
                  Thúc đẩy chuyển đổi số với tư vấn chiến lược và kỹ thuật công nghệ tiên tiến từ CIC. Chúng tôi kết nối giữa hạ tầng truyền thống và đổi mới sáng tạo sẵn sàng cho tương lai, đồng hành cùng hơn 5.000+ dự án cấp quốc gia.
                </p>
              </div>

              {/* MAIN LAYOUT WITH SIDEBAR (TƯƠNG TỰ FORMAT TRANG SẢN PHẨM) */}
              <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start space-y-10 lg:space-y-0">
                
                {/* COLUMN LEFT: SERVICES LIST (CÁC BLOCK TRẮNG ĐỒNG NHẤT SIZE) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Search Bar & Counter */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-slate-100/60 p-4 rounded-[10px]">
                    <div className="relative flex items-center w-full sm:max-w-md">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <Search className="text-slate-400" size={16} />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm dịch vụ, giải pháp..."
                        className="w-full bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 pl-10 pr-9 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-[8px]"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          aria-label="Xóa nội dung tìm kiếm"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
                      <SlidersHorizontal size={14} className="text-orange-600" />
                      <span>Hiển thị {filteredServices.length} trên {servicesData.length} dịch vụ</span>
                    </div>
                  </div>

                  {/* GRID 4 BLOCK TRẮNG ĐỒNG NHẤT SIZE */}
                  {paginatedServices.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200/90 rounded-[14px] p-8 space-y-4">
                      <p className="text-slate-400 font-bold text-sm">
                        {searchQuery ? `Không tìm thấy dịch vụ nào phù hợp với từ khóa "${searchQuery}".` : 'Không tìm thấy dịch vụ nào.'}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="px-5 py-2 bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-all rounded-[8px] cursor-pointer"
                        >
                          Xóa tìm kiếm
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {paginatedServices.map((service, idx) => {
                        const cleanTitle = service.title
                          .replace("Dịch Vụ ", "")
                          .replace("Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng", "");

                        return (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.4 }}
                            onClick={() => handleServiceSelect(service.id)}
                            className="bg-transparent border-0 p-0 transition-all duration-300 shadow-none flex flex-col justify-between h-full group cursor-pointer relative overflow-hidden"
                          >
                            <div>
                              {/* Uniform Image Banner */}
                              <div className="h-48 sm:h-52 w-full overflow-hidden rounded-[12px] relative mb-4 shrink-0 bg-slate-100">
                                <img 
                                  src={service.image} 
                                  alt={service.title} 
                                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              {/* Title & Excerpt */}
                              <div className="space-y-2 mb-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[#333] group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                  {cleanTitle}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                                  {getServiceExcerpt(service)}
                                </p>
                              </div>
                            </div>

                            {/* Card Footer Action Button */}
                            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-600 group-hover:text-orange-700 transition-colors">
                              <span>Xem Chi Tiết Dịch Vụ</span>
                              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 sm:mt-14">
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

                </div>

                {/* COLUMN RIGHT: STICKY SIDEBAR (FORM ĐĂNG KÝ TƯ VẤN & DEMO) */}
                <aside className="lg:col-span-4 space-y-6">
                  <div className="sticky top-28 space-y-6">
                    
                    {/* White Form Container */}
                    <div className="bg-white text-slate-900 p-7 sm:p-8 rounded-[16px] border border-slate-200/90 shadow-sm relative overflow-hidden">
                      <div className="relative z-10 space-y-5">
                        <div className="space-y-2">
                          <span className="inline-block px-2.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            TƯ VẤN TRỰC TIẾP
                          </span>
                          <h3 className="text-xl font-extrabold uppercase tracking-tight text-slate-950 leading-tight">
                            Đăng Ký Tư Vấn & Demo
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            Sẵn sàng chuyển đổi số cùng CIC? Hãy để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ trong 15 phút.
                          </p>
                        </div>

                        <div className="w-full h-[1px] bg-slate-100"></div>

                        {formSubmitted ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-orange-600 p-6 text-center space-y-3 rounded-[12px]"
                          >
                            <CheckCircle2 size={36} className="mx-auto text-white animate-bounce" />
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white">GỬI YÊU CẦU THÀNH CÔNG!</h4>
                            <p className="text-xs text-white/90 leading-relaxed font-normal">
                              Chuyên viên CIC sẽ gọi lại ngay theo số điện thoại bạn cung cấp. Xin trân trọng cảm ơn!
                            </p>
                          </motion.div>
                        ) : (
                          <form className="space-y-4" onSubmit={handleFormSubmit}>
                            
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">Họ và tên *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={14} /></span>
                                <input 
                                  type="text"
                                  required
                                  value={formData.fullname}
                                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                                  placeholder="Nhập họ và tên" 
                                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-normal rounded-[8px]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">Số điện thoại *</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                                <input 
                                  type="tel"
                                  required
                                  value={formData.phone}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                  placeholder="Nhập số điện thoại" 
                                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-normal rounded-[8px]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">Địa chỉ Email</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                                <input 
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                  placeholder="Nhập email liên hệ" 
                                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-normal rounded-[8px]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">Dịch vụ quan tâm</label>
                              <select 
                                value={formData.service}
                                onChange={(e) => setFormData({...formData, service: e.target.value})}
                                className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition-all font-normal cursor-pointer rounded-[8px]"
                              >
                                {servicesData.map(s => (
                                  <option key={s.id} value={s.title}>{s.title}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">Nội dung yêu cầu</label>
                              <textarea 
                                rows={2}
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                placeholder="Mô tả nhu cầu của bạn..." 
                                className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-normal resize-none rounded-[8px]"
                              ></textarea>
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-[8px] font-bold uppercase tracking-wider text-xs shadow-md shadow-orange-600/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              Gửi Yêu Cầu Tư Vấn <Send size={14} />
                            </button>

                          </form>
                        )}
                      </div>
                    </div>

                    {/* Support Contact Box */}
                    <div className="bg-white border border-slate-200/90 p-5 rounded-[14px] space-y-3.5 shadow-xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                        HỖ TRỢ TRỰC TIẾP 24/7
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <Phone size={14} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Tổng đài tư vấn</span>
                            <span className="text-xs font-bold text-slate-900">086 893 4576 / 024 3976 1381</span>
                          </div>
                        </div>
                        <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <Mail size={14} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Hộp thư hỗ trợ</span>
                            <span className="text-xs font-bold text-slate-900">info@cic.com.vn</span>
                          </div>
                        </div>
                      </div>
                    </div>



                  </div>
                </aside>

              </div>
            </motion.div>
          ) : (
            /* ============================================================== */
            /* 2. DETAIL PAGE (TRANG CHI TIẾT DỊCH VỤ)                        */
            /* ============================================================== */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Back Button & Breadcrumbs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
                <button
                  onClick={() => setActiveServiceId(null)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 hover:text-orange-600 hover:border-orange-500 text-xs font-bold uppercase tracking-wider transition-all rounded-[8px] cursor-pointer shadow-xs"
                >
                  <ArrowLeft size={14} /> Trở về danh mục dịch vụ
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="hover:text-orange-600 cursor-pointer" onClick={() => onNavigateHome?.()}>Trang chủ</span>
                  <ChevronRight size={12} />
                  <span className="hover:text-orange-600 cursor-pointer" onClick={() => setActiveServiceId(null)}>Dịch vụ</span>
                  <ChevronRight size={12} />
                  <span className="text-slate-800 truncate max-w-[200px]">{activeService?.title}</span>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Column Left: Main Content */}
                <div className="lg:col-span-8 space-y-6 bg-white border border-slate-200/90 p-8 sm:p-10 rounded-[16px] shadow-xs">
                  
                  {/* Header Title & Tagline */}
                  <div className="space-y-3 border-b border-slate-100 pb-5">
                    {activeService?.category && (
                      <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[11px] uppercase tracking-wider rounded-md">
                        {activeService.category}
                      </span>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                      {activeService?.title}
                    </h1>
                    {activeService?.tagline && (
                      <p className="text-xs sm:text-sm text-slate-600 font-medium italic leading-relaxed border-l-3 border-orange-500 pl-3 py-0.5 bg-slate-50 rounded-r-md">
                        "{activeService.tagline}"
                      </p>
                    )}
                  </div>

                  {/* Cleaned CMS HTML Content */}
                  {activeService?.htmlContent && (
                    <div 
                      className="service-cms-content pt-2"
                      dangerouslySetInnerHTML={{ __html: cleanCmsHtml(activeService.htmlContent) }}
                    />
                  )}

                </div>

                {/* Column Right: Form & Related Products */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* White Consultation Form */}
                  <div id="consultation-form" className="bg-white text-slate-900 p-7 sm:p-8 rounded-[16px] border border-slate-200/90 shadow-sm relative scroll-mt-32">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-orange-600 font-bold text-[10px] uppercase tracking-wider block">YÊU CẦU DỊCH VỤ</span>
                        <h3 className="text-lg font-extrabold uppercase text-slate-950 leading-tight">Tư Vấn Giải Pháp Thích Hợp</h3>
                        <p className="text-xs text-slate-600 font-normal">Chuyên gia CIC sẽ kết nối trực tiếp tư vấn chi tiết trong 15 phút.</p>
                      </div>

                      <div className="w-full h-[1px] bg-slate-100 my-3"></div>

                      {formSubmitted ? (
                        <div className="bg-orange-600 p-5 text-center space-y-2 rounded-[10px]">
                          <CheckCircle2 size={32} className="mx-auto text-white animate-bounce" />
                          <h4 className="text-xs font-bold uppercase text-white">GỬI YÊU CẦU THÀNH CÔNG!</h4>
                          <p className="text-[11px] text-white/90">Cảm ơn bạn. Chuyên viên CIC sẽ liên hệ ngay.</p>
                        </div>
                      ) : (
                        <form className="space-y-3.5" onSubmit={handleFormSubmit}>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-700 block">Họ tên *</label>
                            <input 
                              type="text"
                              required
                              value={formData.fullname}
                              onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                              placeholder="Nhập họ và tên" 
                              className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-normal rounded-[8px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-700 block">Số điện thoại *</label>
                            <input 
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="Nhập số điện thoại" 
                              className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-normal rounded-[8px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-700 block">Email</label>
                            <input 
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="Nhập email liên hệ" 
                              className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-normal rounded-[8px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-700 block">Ghi chú nhu cầu</label>
                            <textarea 
                              rows={2}
                              value={formData.notes}
                              onChange={(e) => setFormData({...formData, notes: e.target.value})}
                              placeholder="Mô tả nhu cầu của bạn..." 
                              className="w-full bg-slate-50/80 border border-slate-200 focus:border-orange-500 focus:bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-normal resize-none rounded-[8px]"
                            ></textarea>
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-[8px] font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-600/10"
                          >
                            Đăng Ký Tư Vấn <Send size={14} />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Related Products Widget */}
                  {currentRelatedProducts.length > 0 && (
                    <div className="bg-white border border-slate-200/90 p-5 rounded-[14px] space-y-3.5 shadow-xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                        SẢN PHẨM PHẦN MỀM LIÊN QUAN
                      </h4>

                      <div className="divide-y divide-slate-100">
                        {currentRelatedProducts.map((prod) => (
                          <div 
                            key={prod.id} 
                            onClick={() => setSelectedProductModal(prod)}
                            className="py-2.5 flex gap-3 items-center group cursor-pointer hover:bg-slate-50 transition-colors p-1.5 rounded-[8px]"
                          >
                            <div className="w-12 h-12 shrink-0 bg-slate-100 border border-slate-200 overflow-hidden relative rounded-[6px]">
                              <img 
                                src={prod.img} 
                                alt={prod.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                                {prod.name}
                              </h5>
                              <span className="text-[10px] text-slate-400 block uppercase font-medium">{prod.brand}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Related Services Section (Dịch vụ liên quan) */}
              {relatedServices.length > 0 && (
                <div className="pt-14 border-t border-slate-200 mt-14 space-y-8">
                  <div>
                    <h3 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                      Dịch Vụ Liên Quan
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Các gói giải pháp và tư vấn chuyển đổi số kỹ thuật nổi bật khác của CIC
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {relatedServices.map((relService) => {
                      const cleanRelTitle = relService.title
                        .replace("Dịch Vụ ", "")
                        .replace("Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng", "");

                      return (
                        <div
                          key={relService.id}
                          onClick={() => handleServiceSelect(relService.id)}
                          className="bg-white border border-slate-200/90 hover:border-orange-500 p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-[14px] group flex flex-col justify-between cursor-pointer relative overflow-hidden"
                        >
                          <div>
                            {/* Uniform Image Banner */}
                            <div className="h-44 w-full overflow-hidden rounded-[10px] relative mb-4 shrink-0 bg-slate-100">
                              <img 
                                src={relService.image} 
                                alt={relService.title} 
                                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Title & Excerpt */}
                            <div className="space-y-2 mb-4">
                              <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                {cleanRelTitle}
                              </h4>
                              <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                                {getServiceExcerpt(relService)}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer Action Button */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-orange-600 group-hover:text-orange-700 transition-colors">
                            <span>Xem Chi Tiết Dịch Vụ</span>
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button 
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="h-40 w-full overflow-hidden rounded-[10px] bg-slate-100 relative">
              <img src={selectedProductModal.img} alt={selectedProductModal.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{selectedProductModal.brand}</span>
              <h3 className="text-lg font-bold text-slate-950">{selectedProductModal.name}</h3>
              <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-3">{selectedProductModal.description}</p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setSelectedProductModal(null);
                  setFormData(prev => ({
                    ...prev,
                    service: selectedProductModal.name,
                    notes: `Quan tâm sản phẩm: ${selectedProductModal.name}`
                  }));
                }}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all"
              >
                Yêu cầu báo giá sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

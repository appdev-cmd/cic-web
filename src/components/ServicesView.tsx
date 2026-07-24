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
  Clock, 
  Send, 
  Building2, 
  Globe, 
  FileText, 
  Sparkles,
  Check,
  Search,
  X,
  ChevronLeft,
  SlidersHorizontal,
  Box,
  ExternalLink,
  Tag,
  Layers,
  Info,
  Package,
  ShoppingCart
} from 'lucide-react';
import { servicesData, ServiceDetail } from '../data/servicesData';
import { productsData } from '../data/mockData';
import { Product } from '../types';

interface ServicesViewProps {
  key?: string | number;
  initialServiceId?: string | null;
  onNavigateHome?: () => void;
}

export const ServicesView = ({ initialServiceId = null, onNavigateHome }: ServicesViewProps) => {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(initialServiceId);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    service: 'Phần mềm kỹ thuật',
    notes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 items per page is perfect for clean pagination on 9 items

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

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
  }, [activeService]);

  const categories = ['Tất cả', ...Array.from(new Set(servicesData.map(s => s.category)))];

  const filteredServices = servicesData.filter(service => {
    const matchesCategory = selectedCategory === 'Tất cả' || service.category === selectedCategory;
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.tagline || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Watch for external initial ID updates (e.g. from dropdown navigation)
  useEffect(() => {
    setActiveServiceId(initialServiceId);
  }, [initialServiceId]);

  // Related products modal state & selector
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  const currentRelatedProducts = useMemo(() => {
    if (!activeService) return [];
    if (activeService.relatedProductIds && activeService.relatedProductIds.length > 0) {
      return productsData.filter(p => activeService.relatedProductIds!.includes(p.id));
    }
    return productsData.slice(0, 4);
  }, [activeService]);

  const handleSelectProductForConsultation = (prod: Product) => {
    setFormData(prev => ({
      ...prev,
      service: prod.productType || prev.service,
      notes: `[Yêu cầu tư vấn sản phẩm]: ${prod.name} (${prod.brand || 'CIC'})`
    }));
    const formElement = document.getElementById('consultation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullname || !formData.phone) {
      alert("Vui lòng điền họ tên và số điện thoại liên hệ.");
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ fullname: '', phone: '', email: '', service: 'Phần mềm kỹ thuật', notes: '' });
    }, 5000);
  };

  const handleServiceSelect = (id: string) => {
    setActiveServiceId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter out the active service for "Related Services"
  const relatedServices = servicesData.filter(s => s.id !== activeServiceId).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 relative">
      {/* Visual Header Decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none opacity-[0.03] z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!activeServiceId ? (
            /* ============================================================== */
            /* 1. CATALOG PAGE (TRANG DANH MỤC)                               */
            /* ============================================================== */
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Heading */}
              <div className="text-center max-w-4xl mx-auto space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-950 uppercase tracking-tight leading-tight sm:whitespace-nowrap">
                  GIẢI PHÁP & <span className="text-orange-600">DỊCH VỤ</span> <span className="whitespace-nowrap">KỸ THUẬT SỐ</span>
                </h1>
                <p className="text-slate-500 font-normal text-sm leading-relaxed max-w-3xl mx-auto">
                  CIC đồng hành cùng cơ quan Nhà nước, Chủ đầu tư và các Nhà thầu hàng đầu xây dựng chuỗi giải pháp Tư vấn BIM, Chuyển đổi số xây dựng, Năng lượng tái tạo và Kiểm kê phát thải tiên tiến bậc nhất.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="bg-white border border-slate-200/80 p-6 space-y-6 rounded-[10px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  {/* Search input */}
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm dịch vụ, giải pháp..."
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-500 focus:bg-white px-11 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-normal rounded-[8px]"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filter stats */}
                  <div className="flex items-center justify-end text-xs font-bold text-slate-500 gap-2">
                    <SlidersHorizontal size={14} className="text-slate-400" />
                    Hiển thị {filteredServices.length} trên tổng số {servicesData.length} dịch vụ
                  </div>

                </div>

                {/* Category filtering pills */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Phân loại:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border rounded-[8px] ${
                              isSelected
                                ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Service Cards Grid / Empty State */}
              {paginatedServices.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200/80 space-y-4 rounded-[10px]">
                  <p className="text-slate-400 font-bold text-sm">Không tìm thấy dịch vụ nào phù hợp với điều kiện tìm kiếm.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Tất cả');
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-all rounded-[8px]"
                  >
                    Xóa bộ lọc tìm kiếm
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedServices.map((service, idx) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.6 }}
                      whileHover={{ y: -6 }}
                      className="bg-white border border-slate-200/90 hover:border-orange-500/40 p-3 group flex flex-col shadow-2xs hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all duration-300 relative rounded-[10px] overflow-hidden cursor-pointer"
                    >
                      {/* Image Area */}
                      <div className="h-56 w-full overflow-hidden relative rounded-[10px]">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-slate-900/90 text-white text-xs font-bold uppercase tracking-wider border border-white/10 rounded-[8px]">
                          {service.category}
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-base font-bold text-slate-950 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 uppercase">
                            {service.title.replace("Dịch Vụ ", "").replace("Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng", "")}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                            {service.shortDesc}
                          </p>
                        </div>

                        {/* CTA Link */}
                        <button 
                          onClick={() => handleServiceSelect(service.id)}
                          className="w-full py-2.5 border border-slate-200 hover:border-orange-600 hover:bg-orange-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-center gap-2 group-hover:shadow-md rounded-[8px]"
                        >
                          Xem chi tiết dịch vụ <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-slate-200 pt-8 mt-12">
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
            </motion.div>
          ) : (
            /* ============================================================== */
            /* 2. DETAIL PAGE (TRANG CHI TIẾT)                                */
            /* ============================================================== */
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Back to Catalog Button & Navigation Path */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <button
                  onClick={() => setActiveServiceId(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500 text-xs font-bold uppercase tracking-wider transition-all rounded-[8px]"
                >
                  <ArrowLeft size={14} /> Trở về danh mục dịch vụ
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span className="hover:text-orange-600 cursor-pointer" onClick={() => onNavigateHome?.()}>Trang chủ</span>
                  <ChevronRight size={12} />
                  <span className="hover:text-orange-600 cursor-pointer" onClick={() => setActiveServiceId(null)}>Dịch vụ</span>
                  <ChevronRight size={12} />
                  <span className="text-slate-600 truncate max-w-[200px]">{activeService?.title.slice(0, 30)}...</span>
                </div>
              </div>

              {/* Main Detail Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Column Left: Main description & rich HTML content */}
                <div className="lg:col-span-8 space-y-8 bg-white border border-slate-200/80 p-8 sm:p-10 rounded-[10px]">
                  
                  {/* Category & Title */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 border border-orange-100 rounded-[8px]">
                      {activeService?.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 uppercase tracking-tight leading-snug">
                      {activeService?.title}
                    </h2>
                  </div>

                  {/* Rich HTML Content Area */}
                  {activeService?.htmlContent && (
                    <div 
                      className="service-cms-content pt-2"
                      dangerouslySetInnerHTML={{ __html: activeService.htmlContent }}
                    />
                  )}

                </div>

                {/* Column Right: Related Products & Custom Consultation Form */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Modern Form Card */}
                  <div id="consultation-form" className="bg-white text-slate-900 p-8 border border-slate-200 shadow-xl relative scroll-mt-32 rounded-[10px]">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-slate-950">
                      <Briefcase size={80} />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h3 className="text-lg font-bold uppercase tracking-tight text-slate-950 leading-tight">
                        Tư Vấn Giải Pháp Thích Hợp
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        Điền nhanh thông tin dưới đây, Đội ngũ chuyên gia Trung tâm dịch vụ CIC sẽ kết nối tư vấn miễn phí trong 15 phút.
                      </p>

                      <div className="w-full h-[1px] bg-slate-100 my-4"></div>

                      {formSubmitted ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-orange-600 p-6 text-center space-y-3 rounded-[8px]"
                        >
                          <CheckCircle2 size={36} className="mx-auto text-white animate-bounce" />
                          <h4 className="text-sm font-bold uppercase tracking-wider text-white">GỬI YÊU CẦU THÀNH CÔNG</h4>
                          <p className="text-xs text-white/90 leading-relaxed font-normal">
                            Hệ thống đã ghi nhận nhu cầu tư vấn. Chúng tôi sẽ gọi lại ngay cho bạn qua số điện thoại đã cung cấp. Xin cảm ơn!
                          </p>
                        </motion.div>
                      ) : (
                        <form className="space-y-5" onSubmit={handleFormSubmit}>
                          
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Họ tên *</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={14} /></span>
                              <input 
                                type="text"
                                required
                                value={formData.fullname}
                                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                                placeholder="Ví dụ: Nguyễn Đức Anh" 
                                className="w-full bg-slate-50 border border-slate-200 px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-normal rounded-[8px]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Số điện thoại *</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                              <input 
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="Ví dụ: 0868934576" 
                                className="w-full bg-slate-50 border border-slate-200 px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-normal rounded-[8px]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Địa chỉ email</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                              <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Ví dụ: anh.nguyen@company.com" 
                                className="w-full bg-slate-50 border border-slate-200 px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-normal rounded-[8px]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Dịch vụ quan tâm</label>
                            <select 
                              value={formData.service}
                              onChange={(e) => setFormData({...formData, service: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-normal cursor-pointer rounded-[8px]"
                            >
                              <option>Phần mềm kỹ thuật</option>
                              <option>Thiết bị & IOT</option>
                              <option>Tư vấn BIM/Digital Twins</option>
                              <option>Chuyển đổi số & Net Zero</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Nội dung</label>
                            <textarea 
                              rows={3}
                              value={formData.notes}
                              onChange={(e) => setFormData({...formData, notes: e.target.value})}
                              placeholder="Mô tả cụ thể nhu cầu của bạn..." 
                              className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-normal resize-none rounded-[8px]"
                            ></textarea>
                          </div>

                          <div className="text-xs text-slate-500 font-normal leading-relaxed">
                            Bằng cách đăng ký, bạn đồng ý với chính sách bảo mật và cam kết bảo vệ thông tin doanh nghiệp của CIC.
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-[8px] font-bold uppercase tracking-wider text-xs btn-modern-interaction shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2"
                          >
                            Gửi yêu cầu tư vấn <Send size={14} />
                          </button>

                        </form>
                      )}
                    </div>
                  </div>

                  {/* Hotlines & Support Contacts matching exact inputs */}
                  <div className="bg-white border border-slate-200 p-6 space-y-4 rounded-[10px]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">HỖ TRỢ TRỰC TIẾP 24/7</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <Phone size={14} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-400 block uppercase">Hà Nội & Miền Bắc</span>
                          <span className="text-xs font-bold text-slate-800">086 893 4576 / 024 3976 1381</span>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <Mail size={14} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-400 block uppercase">Hộp thư điện tử</span>
                          <span className="text-xs font-bold text-slate-800">info@cic.com.vn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Products Widget (Minimal & Clean) */}
                  {currentRelatedProducts.length > 0 && (
                    <div className="bg-white border border-slate-200 p-5 space-y-3 rounded-[10px]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5">
                        SẢN PHẨM LIÊN QUAN
                      </h4>

                      <div className="divide-y divide-slate-100">
                        {currentRelatedProducts.map((prod) => (
                          <div 
                            key={prod.id} 
                            onClick={() => setSelectedProductModal(prod)}
                            className="py-2.5 first:pt-0 last:pb-0 flex gap-3 items-center group cursor-pointer hover:bg-slate-50/80 transition-colors p-1 rounded-[8px]"
                          >
                            {/* Thumbnail */}
                            <div className="w-14 h-14 shrink-0 bg-slate-100 border border-slate-200 overflow-hidden relative rounded-[8px]">
                              <img 
                                src={prod.img} 
                                alt={prod.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <h5 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                                {prod.name}
                              </h5>
                              <p className="text-xs text-slate-400 font-normal">
                                {prod.brand || 'CIC Tech'} {prod.productType ? `• ${prod.productType}` : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Related Services List (Dịch vụ liên quan) */}
              <div className="space-y-6 border-t border-slate-200 pt-10">
                <h3 className="text-lg font-extrabold text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-5 bg-orange-600 inline-block"></span>
                  Dịch vụ liên quan & Hệ giải pháp số
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((rSrv) => (
                    <div 
                      key={rSrv.id} 
                      onClick={() => handleServiceSelect(rSrv.id)}
                      className="bg-white border border-slate-200 p-5 space-y-3 hover:border-orange-500 hover:shadow-lg cursor-pointer transition-all duration-300 rounded-[10px]"
                    >
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">{rSrv.category}</span>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide group-hover:text-orange-600 line-clamp-1">{rSrv.title.replace("Dịch Vụ ", "").replace("Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng", "")}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">{rSrv.shortDesc}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-orange-600 tracking-wider">Tìm hiểu thêm <ChevronRight size={12} /></span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Quick Specs Modal */}
        <AnimatePresence>
          {selectedProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-slate-200 w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col rounded-[12px]"
              >
                {/* Header */}
                <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b-2 border-orange-600 shrink-0">
                  <div className="flex items-center gap-2">
                    <Box size={20} className="text-orange-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      THÔNG SỐ SẢN PHẨM / PHẦN MỀM
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProductModal(null)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors rounded-[6px]"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                    <div className="sm:col-span-5 space-y-3">
                      <div className="h-48 w-full bg-slate-900 border border-slate-200 overflow-hidden relative rounded-[10px]">
                        <img 
                          src={selectedProductModal.img} 
                          alt={selectedProductModal.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 space-y-1.5 text-xs rounded-[8px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Thương hiệu:</span>
                          <span className="font-bold text-slate-800">{selectedProductModal.brand || 'CIC Tech'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Lĩnh vực:</span>
                          <span className="font-bold text-slate-800">{selectedProductModal.field || 'Xây dựng'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phân loại:</span>
                          <span className="font-bold text-orange-600">{selectedProductModal.productType || 'Phần mềm'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-7 space-y-4">
                      <h3 className="text-lg font-bold text-slate-950 uppercase leading-snug">
                        {selectedProductModal.name}
                      </h3>

                      <div className="inline-block bg-orange-50 text-orange-700 px-3 py-1 border border-orange-200 text-xs font-bold rounded-[6px]">
                        Mức giá đề xuất: {selectedProductModal.price}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {selectedProductModal.description}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-normal">
                        <div className="flex items-center gap-2 text-slate-700">
                          <CheckCircle2 size={14} className="text-orange-500 shrink-0" />
                          <span>Bản quyền chính hãng & Hỗ trợ chuyển giao 100%</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <CheckCircle2 size={14} className="text-orange-500 shrink-0" />
                          <span>Đội ngũ kỹ sư tư vấn chuyên môn sâu từ CIC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedProductModal(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-[8px]"
                  >
                    Đóng
                  </button>

                  <button
                    onClick={() => {
                      const prod = selectedProductModal;
                      setSelectedProductModal(null);
                      handleSelectProductForConsultation(prod);
                    }}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md rounded-[8px]"
                  >
                    Thêm vào form tư vấn <Send size={14} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

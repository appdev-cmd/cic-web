/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
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
  SlidersHorizontal
} from 'lucide-react';
import { servicesData, ServiceDetail } from '../data/servicesData';

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

  const categories = ['Tất cả', ...Array.from(new Set(servicesData.map(s => s.category)))];

  const filteredServices = servicesData.filter(service => {
    const matchesCategory = selectedCategory === 'Tất cả' || service.category === selectedCategory;
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tagline.toLowerCase().includes(searchQuery.toLowerCase());
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

  const activeService = servicesData.find(s => s.id === activeServiceId);

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
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none">
                  GIẢI PHÁP & <span className="text-orange-600">DỊCH VỤ</span> KỸ THUẬT SỐ
                </h1>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  CIC đồng hành cùng cơ quan Nhà nước, Chủ đầu tư và các Nhà thầu hàng đầu xây dựng chuỗi giải pháp Tư vấn BIM, Chuyển đổi số xây dựng, Năng lượng tái tạo và Kiểm kê phát thải tiên tiến bậc nhất.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="bg-white border border-slate-200/80 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  {/* Search input */}
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm dịch vụ, giải pháp..."
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-orange-500 focus:bg-white px-11 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold rounded-none"
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
                  <div className="flex items-center justify-end text-xs font-bold text-slate-500 gap-2 font-sans">
                    <SlidersHorizontal size={14} className="text-slate-400" />
                    Hiển thị {filteredServices.length} trên tổng số {servicesData.length} dịch vụ
                  </div>

                </div>

                {/* Category filtering pills */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-2">Phân loại:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all border rounded-none ${
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
                <div className="text-center py-16 bg-white border border-slate-200/80 space-y-4">
                  <p className="text-slate-400 font-bold text-sm">Không tìm thấy dịch vụ nào phù hợp với điều kiện tìm kiếm.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Tất cả');
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all rounded-none"
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
                      whileHover={{ y: -8 }}
                      className="bg-white border border-slate-200/80 hover:border-orange-500 group flex flex-col hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 relative rounded-none overflow-hidden"
                    >
                      {/* Image Area */}
                      <div className="h-56 w-full overflow-hidden relative">
                        <img 
                          src={service.image} 
                          alt={service.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-slate-900/90 text-white font-sans text-[9px] font-black uppercase tracking-widest border border-white/10">
                          {service.category}
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-base font-black text-slate-950 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 uppercase">
                            {service.title.replace("Dịch Vụ ", "").replace("Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng", "")}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                            {service.shortDesc}
                          </p>
                        </div>

                        {/* CTA Link */}
                        <button 
                          onClick={() => handleServiceSelect(service.id)}
                          className="w-full py-2.5 border border-slate-200 hover:border-orange-600 hover:bg-orange-600 hover:text-white transition-all text-xs font-black uppercase tracking-widest text-slate-700 flex items-center justify-center gap-2 group-hover:shadow-md"
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-500 text-xs font-black uppercase tracking-widest transition-all rounded-none"
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
                
                {/* Column Left: Main description & scope & process */}
                <div className="lg:col-span-8 space-y-12 bg-white border border-slate-200/80 p-8 sm:p-10">
                  
                  {/* Title & Tagline */}
                  <div className="space-y-4">
                    <span className="font-sans text-[9px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 border border-orange-100">
                      {activeService?.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tighter leading-snug">
                      {activeService?.title}
                    </h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide leading-relaxed border-l-2 border-orange-500 pl-4">
                      {activeService?.tagline}
                    </p>
                  </div>

                  {/* Feature Image */}
                  <div className="h-[280px] sm:h-[380px] w-full overflow-hidden relative border border-slate-100">
                    <img 
                      src={activeService?.image} 
                      alt={activeService?.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
                  </div>

                  {/* Overview Introduction */}
                  <div className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed font-medium text-justify">
                      {activeService?.shortDesc}
                    </p>
                  </div>

                  {/* Why Need (Tại sao cần) */}
                  {activeService?.whyNeed && activeService.whyNeed.length > 0 && (
                    <div className="space-y-6 bg-slate-50 border border-slate-200/50 p-6 sm:p-8">
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <span className="w-2 h-4 bg-orange-600 inline-block"></span>
                        {activeService.whyNeedTitle || "Tại sao cần dịch vụ này?"}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {activeService.whyNeed.map((why, i) => (
                          <div key={i} className="flex gap-3 items-start text-xs text-slate-600 leading-relaxed font-medium">
                            <CheckCircle2 size={16} className="text-orange-500 shrink-0 mt-0.5" />
                            <span>{why}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scope of Services (Phạm vi dịch vụ) */}
                  <div className="space-y-8">
                    <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                      <span className="w-2.5 h-5 bg-orange-600 inline-block"></span>
                      {activeService?.scopeTitle || "Phạm vi & Các nội dung thực thi"}
                    </h3>

                    <div className="space-y-6">
                      {activeService?.scope.map((item, i) => (
                        <div key={i} className="border border-slate-100 hover:border-slate-200 p-6 space-y-4 transition-all">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                            <span>{item.title}</span>
                            <span className="text-[10px] text-orange-600 font-sans">#0{i+1}</span>
                          </h4>
                          {item.desc && (
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                              {item.desc}
                            </p>
                          )}
                          {item.list && item.list.length > 0 && (
                            <ul className="grid grid-cols-1 gap-2.5 pl-2">
                              {item.list.map((listItem, listIdx) => (
                                <li key={listIdx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                                  <span>{listItem}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {item.img && (
                            <div className="mt-4 h-48 w-full overflow-hidden border border-slate-100">
                              <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" referrerPolicy="referrer" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Process (Quy trình triển khai) */}
                  {activeService?.process && activeService.process.length > 0 && (
                    <div className="space-y-8">
                      <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-5 bg-orange-600 inline-block"></span>
                        Quy trình triển khai khoa học
                      </h3>

                      <div className="grid grid-cols-1 gap-6 relative pl-6 border-l-2 border-slate-200">
                        {activeService.process.map((step, i) => (
                          <div key={i} className="relative group space-y-2">
                            {/* Circle Pin */}
                            <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white group-hover:bg-orange-600 transition-colors"></div>
                            
                            <div className="flex items-center gap-2 font-sans">
                              <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 border border-orange-100">BƯỚC {step.step}</span>
                              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{step.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                              {step.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits (Lợi ích mang lại) */}
                  {activeService?.benefits && activeService.benefits.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-5 bg-orange-600 inline-block"></span>
                        Giá trị & Lợi ích bền vững
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeService.benefits.map((benefit, i) => (
                          <div key={i} className="p-4 border border-slate-100 bg-slate-50/50 flex gap-3 items-start rounded-none hover:border-orange-200 hover:bg-orange-50/20 transition-all">
                            <div className="w-6 h-6 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full shrink-0">
                              <Check size={14} />
                            </div>
                            <span className="text-xs text-slate-700 leading-relaxed font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* State & Intl Collaborations (Media details matching input) */}
                  {activeService?.stateCollaboration && (
                    <div className="space-y-6 border-t border-slate-200 pt-8">
                      <h3 className="text-base font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                        <Building2 size={18} className="text-orange-600" />
                        {activeService.stateCollaboration.title}
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        {activeService.stateCollaboration.items.map((collab, i) => (
                          <div key={i} className="bg-slate-50 p-6 space-y-2 border border-slate-200/50">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{collab.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{collab.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeService?.intlCollaboration && (
                    <div className="space-y-4 border-t border-slate-200 pt-8 bg-orange-50/20 p-6 border border-orange-100">
                      <h3 className="text-base font-black text-orange-800 uppercase tracking-tight flex items-center gap-2">
                        <Globe size={18} className="text-orange-600" />
                        {activeService.intlCollaboration.title}
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{activeService.intlCollaboration.desc}</p>
                    </div>
                  )}

                  {/* Special Media Highlights */}
                  {activeService?.media && activeService.media.length > 0 && (
                    <div className="space-y-6 border-t border-slate-200 pt-8">
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <FileText size={18} className="text-orange-600 animate-pulse" />
                        Hình ảnh & Ghi nhận từ sự kiện
                      </h3>
                      {activeService.media.map((med, i) => (
                        <div key={i} className="space-y-3 bg-slate-50 p-6 border border-slate-200/50">
                          {med.title && <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-snug">{med.title}</h4>}
                          {med.content && <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{med.content}</p>}
                          {med.url && (
                            <div className="h-48 sm:h-64 w-full overflow-hidden border border-slate-200">
                              <img src={med.url} alt={med.caption || ""} className="w-full h-full object-cover" />
                            </div>
                          )}
                          {med.caption && <span className="text-[10px] text-slate-400 block text-center font-bold uppercase tracking-wider">{med.caption}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* Column Right: Custom Consultation Form */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Modern Form Card */}
                  <div className="bg-white text-slate-900 p-8 border border-slate-200 shadow-xl relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-slate-950">
                      <Briefcase size={80} />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-950 leading-tight">
                        Tư Vấn Giải Pháp Thích Hợp
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Điền nhanh thông tin dưới đây, Đội ngũ chuyên gia Trung tâm dịch vụ CIC sẽ kết nối tư vấn miễn phí trong 15 phút.
                      </p>

                      <div className="w-full h-[1px] bg-slate-100 my-4"></div>

                      {formSubmitted ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-orange-600 p-6 text-center space-y-3"
                        >
                          <CheckCircle2 size={36} className="mx-auto text-white animate-bounce" />
                          <h4 className="text-sm font-black uppercase tracking-wider text-white">GỬI YÊU CẦU THÀNH CÔNG</h4>
                          <p className="text-[11px] text-white/90 leading-relaxed font-medium">
                            Hệ thống đã ghi nhận nhu cầu tư vấn. Chúng tôi sẽ gọi lại ngay cho bạn qua số điện thoại đã cung cấp. Xin cảm ơn!
                          </p>
                        </motion.div>
                      ) : (
                        <form className="space-y-5" onSubmit={handleFormSubmit}>
                          
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Họ tên *</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={14} /></span>
                              <input 
                                type="text"
                                required
                                value={formData.fullname}
                                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                                placeholder="Ví dụ: Nguyễn Đức Anh" 
                                className="w-full bg-slate-50 border border-slate-200 px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Số điện thoại *</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                              <input 
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="Ví dụ: 0868934576" 
                                className="w-full bg-slate-50 border border-slate-200 px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Địa chỉ email</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                              <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Ví dụ: anh.nguyen@company.com" 
                                className="w-full bg-slate-50 border border-slate-200 px-9 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Dịch vụ quan tâm</label>
                            <div className="relative">
                              <select 
                                value={formData.service}
                                onChange={(e) => setFormData({...formData, service: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold appearance-none"
                              >
                                <option>Phần mềm kỹ thuật</option>
                                <option>Thiết bị & IOT</option>
                                <option>Tư vấn BIM/Digital Twins</option>
                                <option>Chuyển đổi số & Net Zero</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Nội dung</label>
                            <textarea 
                              rows={3}
                              value={formData.notes}
                              onChange={(e) => setFormData({...formData, notes: e.target.value})}
                              placeholder="Mô tả cụ thể nhu cầu của bạn..." 
                              className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold resize-none"
                            ></textarea>
                          </div>

                          <div className="text-[11px] text-slate-600 font-bold leading-relaxed">
                            Bằng cách đăng ký, bạn đồng ý với chính sách bảo mật và cam kết bảo vệ thông tin doanh nghiệp của CIC.
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-none font-black uppercase tracking-widest text-xs btn-modern-interaction shadow-lg shadow-orange-600/10 flex items-center justify-center gap-2"
                          >
                            Gửi yêu cầu tư vấn <Send size={14} />
                          </button>

                        </form>
                      )}
                    </div>
                  </div>

                  {/* Hotlines & Support Contacts matching exact inputs */}
                  <div className="bg-white border border-slate-200 p-6 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2">HỖ TRỢ TRỰC TIẾP 24/7</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <Phone size={14} />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Hà Nội & Miền Bắc</span>
                          <span className="text-xs font-black text-slate-800">086 893 4576 / 024 3976 1381</span>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <Mail size={14} />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">Hộp thư điện tử</span>
                          <span className="text-xs font-black text-slate-800">info@cic.com.vn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Related Services List (Dịch vụ liên quan) */}
              <div className="space-y-6 border-t border-slate-200 pt-10">
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-5 bg-orange-600 inline-block"></span>
                  Dịch vụ liên quan & Hệ giải pháp số
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((rSrv) => (
                    <div 
                      key={rSrv.id} 
                      onClick={() => handleServiceSelect(rSrv.id)}
                      className="bg-white border border-slate-200 p-5 space-y-3 hover:border-orange-500 hover:shadow-lg cursor-pointer transition-all duration-300"
                    >
                      <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">{rSrv.category}</span>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide group-hover:text-orange-600 line-clamp-1">{rSrv.title.replace("Dịch Vụ ", "").replace("Toàn Diện của CIC – Bứt Phá Chuyển Đổi Số Ngành Xây Dựng", "")}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">{rSrv.shortDesc}</p>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-orange-600 tracking-wider">Tìm hiểu thêm <ChevronRight size={12} /></span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  SlidersHorizontal,
  RefreshCw,
  Box,
  Layers,
  FileText
} from 'lucide-react';
import { Product } from '../types';
import { productsData } from '../data/mockData';
import { ProductDetailView } from './ProductDetailView';

export function ProductsView() {
  const [search, setSearch] = useState('');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15); // Default to 15 (as requested by user)
  const [sortBy, setSortBy] = useState<'default' | 'name-asc'>('default');

  // Filter expand states
  const [isFieldsExpanded, setIsFieldsExpanded] = useState(false);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [isAppsExpanded, setIsAppsExpanded] = useState(false);

  // Mobile filter menu state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Interactive UI states
  const [modalType, setModalType] = useState<'contact' | 'buy' | 'download' | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  // Dynamic filter values generated from data
  const fields = useMemo(() => {
    return Array.from(new Set(productsData.map(p => p.field)));
  }, []);

  const brands = useMemo(() => {
    return Array.from(new Set(productsData.map(p => p.brand)));
  }, []);

  const apps = useMemo(() => {
    return Array.from(new Set(productsData.map(p => p.app)));
  }, []);

  // Filter subsets for Show More / Show Less
  const displayedFields = useMemo(() => {
    return isFieldsExpanded ? fields : fields.slice(0, 4);
  }, [fields, isFieldsExpanded]);

  const displayedBrands = useMemo(() => {
    return isBrandsExpanded ? brands : brands.slice(0, 4);
  }, [brands, isBrandsExpanded]);

  const displayedApps = useMemo(() => {
    return isAppsExpanded ? apps : apps.slice(0, 4);
  }, [apps, isAppsExpanded]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = productsData.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const matchesField = selectedField === null || p.field === selectedField;
      const matchesBrand = selectedBrand === null || p.brand === selectedBrand;
      const matchesApp = selectedApp === null || p.app === selectedApp;

      return matchesSearch && matchesField && matchesBrand && matchesApp;
    });

    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return result;
  }, [search, selectedField, selectedBrand, selectedApp, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedField(null);
    setSelectedBrand(null);
    setSelectedApp(null);
    setSortBy('default');
    setIsFieldsExpanded(false);
    setIsBrandsExpanded(false);
    setIsAppsExpanded(false);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Simulated download handler
  const triggerDownload = (product: Product) => {
    setActiveProduct(product);
    setModalType('download');
    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setModalType(null);
      setFormSubmitted(false);
      setActiveProduct(null);
    }, 2000);
  };

  if (selectedProduct) {
    return (
      <>
        <ProductDetailView 
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onContact={(prod) => { setActiveProduct(prod); setModalType('contact'); }}
          onDownload={(prod) => { triggerDownload(prod); }}
          onBuy={(prod) => { setActiveProduct(prod); setModalType('buy'); }}
        />
        
        {/* Interactive Action Modals */}
        <AnimatePresence>
          {modalType && activeProduct && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalType(null)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              ></motion.div>

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.25)] rounded-none w-full max-w-lg p-6 md:p-8 relative z-10 text-slate-900 overflow-y-auto max-h-[90vh]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setModalType(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-30"
                >
                  <X size={20} />
                </button>

                {/* Modal Tabs */}
                <div className="flex border-b border-slate-200 mb-6 mt-2">
                  <button
                    onClick={() => { setModalType('contact'); setFormSubmitted(false); }}
                    className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                      modalType === 'contact'
                        ? 'border-orange-600 text-orange-600 font-black'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Tư vấn & Báo giá
                  </button>
                  <button
                    onClick={() => { setModalType('buy'); setFormSubmitted(false); }}
                    className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                      modalType === 'buy'
                        ? 'border-orange-600 text-orange-600 font-black'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Mua bản quyền
                  </button>
                  <button
                    onClick={() => { 
                      setModalType('download'); 
                      triggerDownload(activeProduct);
                    }}
                    className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                      modalType === 'download'
                        ? 'border-orange-600 text-orange-600 font-black'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Tải tài liệu
                  </button>
                </div>

                {/* Interest Product Banner */}
                <div className="p-4 bg-slate-50 border-l-4 border-orange-600 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Sản phẩm đang chọn</span>
                  <span className="text-sm font-black text-slate-800">{activeProduct.name}</span>
                </div>

                {/* Download Modal Mode */}
                {modalType === 'download' && (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-orange-600/10 text-orange-600 flex items-center justify-center mx-auto mb-4 rounded-none">
                      <Download size={32} className={downloading ? 'animate-bounce' : ''} />
                    </div>
                    <h3 className="text-lg font-black uppercase text-slate-950 tracking-tight mb-2">
                      Tải tài liệu kỹ thuật
                    </h3>
                    
                    {downloading ? (
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 font-medium">Đang chuẩn bị file tài liệu, brochure và bản dùng thử...</p>
                        <div className="w-full h-1.5 bg-slate-100 rounded-none overflow-hidden relative">
                          <div 
                            style={{ width: `${downloadProgress}%` }}
                            className="h-full bg-orange-600 transition-all duration-150"
                          ></div>
                        </div>
                        <span className="text-xs font-mono font-black text-slate-700">{downloadProgress}%</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 border border-emerald-100">
                          <Check size={16} /> Tải tài liệu thành công!
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Tệp tin quảng cáo, hướng dẫn kỹ thuật và bộ cài dùng thử của <b>{activeProduct.name}</b> đã được lưu vào thiết bị của bạn thành công.
                        </p>
                        <button 
                          onClick={() => setModalType(null)}
                          className="px-6 py-2 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors"
                        >
                          Đóng cửa sổ
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Form Modes (Contact & Buy Registration) */}
                {(modalType === 'contact' || modalType === 'buy') && (
                  <div>
                    {formSubmitted ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 space-y-4"
                      >
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto rounded-none">
                          <Check size={24} />
                        </div>
                        <h4 className="text-lg font-black uppercase text-slate-950 tracking-tight">Gửi thông tin thành công!</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                          Cảm ơn bạn đã quan tâm. Đại diện kinh doanh và bộ phận kỹ thuật của CIC sẽ liên hệ lại với bạn trong vòng 1 giờ làm việc.
                        </p>
                        <button 
                          onClick={() => setModalType(null)}
                          className="mt-2 px-6 py-2 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors"
                        >
                          Đóng
                        </button>
                      </motion.div>
                    ) : (
                      <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ và tên *</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Nguyễn Văn A" 
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại *</label>
                            <input 
                              required 
                              type="tel" 
                              placeholder="0912 xxx xxx" 
                              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email nhận thông tin *</label>
                            <input 
                              required 
                              type="email" 
                              placeholder="username@domain.com" 
                              className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn vị / Doanh nghiệp</label>
                          <input 
                            type="text" 
                            placeholder="Công ty Xây dựng XYZ" 
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yêu cầu cụ thể</label>
                          <textarea 
                            required
                            rows={3} 
                            placeholder={modalType === 'contact' ? "Tôi muốn nhận báo giá chi tiết và brochure giới thiệu sản phẩm..." : "Tôi muốn đăng ký mua bản quyền chính hãng và nhận tư vấn thủ tục ký kết hợp đồng..."}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800 resize-none"
                          ></textarea>
                        </div>
                        
                        <button 
                          type="submit" 
                          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-orange-600/20"
                        >
                          {modalType === 'contact' ? 'Gửi yêu cầu báo giá' : 'Đăng ký bản quyền ngay'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-36 pb-24 relative overflow-hidden">
      {/* Visual background accents to match main landing page */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-none"></div>
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-slate-900/5 blur-[100px] rounded-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Banner Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/10 border border-orange-600/20 mb-4"
          >
            <span className="h-2 w-2 bg-orange-600"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600">
              CIC Technology Catalog
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black uppercase text-slate-950 tracking-tighter mb-4"
          >
            Hệ thống <span className="text-orange-600">Sản phẩm & Giải pháp</span>
          </motion.h1>
          <div className="w-20 h-1 bg-orange-600 mx-auto mb-6"></div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed"
          >
            Khám phá danh mục phần mềm bản quyền thay thế, mô phỏng chuyên sâu và các dòng thiết bị quan trắc thông minh hàng đầu phục vụ chuyển đổi số kỹ thuật tại Việt Nam.
          </motion.p>
        </div>

        {/* Filters and Catalog Grid Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex gap-2 w-full mb-2">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-800 text-sm font-bold uppercase tracking-wider transition-all hover:border-orange-600 hover:text-orange-600"
            >
              <SlidersHorizontal size={16} className="text-orange-600" />
              {isMobileFilterOpen ? 'Đóng bộ lọc' : 'Bộ lọc tìm kiếm'}
              {(selectedField !== null || selectedBrand !== null || selectedApp !== null || search) && (
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              )}
            </button>
            {(selectedField !== null || selectedBrand !== null || selectedApp !== null || search) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-3 bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <RefreshCw size={12} /> Đặt lại
              </button>
            )}
          </div>

          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full lg:col-span-3 bg-white border border-slate-200 p-6 shadow-sm sticky top-28 ${
              isMobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="flex items-center gap-2 font-black uppercase tracking-wider text-sm text-slate-950">
                <SlidersHorizontal size={16} className="text-orange-600" />
                Bộ lọc tìm kiếm
              </span>
              {(search || selectedField !== null || selectedBrand !== null || selectedApp !== null) && (
                <button 
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <RefreshCw size={10} /> Đặt lại
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="space-y-2 mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Từ khóa</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 pl-10 text-sm font-bold text-slate-800 transition-all placeholder:text-slate-400"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Field Filter (Lĩnh vực) */}
            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Layers size={10} className="text-orange-600" /> Lĩnh vực
              </label>
              <div className="flex flex-col gap-1 pr-1">
                {displayedFields.map(field => (
                  <button
                    key={field}
                    onClick={() => { setSelectedField(selectedField === field ? null : field); setCurrentPage(1); }}
                    className={`flex items-center justify-between text-left px-3 py-2 text-xs font-bold transition-all ${
                      selectedField === field 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{field}</span>
                    {selectedField === field && <Check size={12} />}
                  </button>
                ))}
              </div>
              {fields.length > 4 && (
                <button
                  onClick={() => setIsFieldsExpanded(!isFieldsExpanded)}
                  className="text-[11px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors mt-1.5 px-3 flex items-center gap-1"
                >
                  {isFieldsExpanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                </button>
              )}
            </div>

            {/* Brand Filter (Hãng) */}
            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Box size={10} className="text-orange-600" /> Hãng phát triển
              </label>
              <div className="flex flex-col gap-1 pr-1">
                {displayedBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => { setSelectedBrand(selectedBrand === brand ? null : brand); setCurrentPage(1); }}
                    className={`flex items-center justify-between text-left px-3 py-2 text-xs font-bold transition-all ${
                      selectedBrand === brand 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{brand}</span>
                    {selectedBrand === brand && <Check size={12} />}
                  </button>
                ))}
              </div>
              {brands.length > 4 && (
                <button
                  onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                  className="text-[11px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors mt-1.5 px-3 flex items-center gap-1"
                >
                  {isBrandsExpanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                </button>
              )}
            </div>

            {/* Application Filter (Ứng dụng) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <FileText size={10} className="text-orange-600" /> Ứng dụng
              </label>
              <div className="flex flex-col gap-1 pr-1">
                {displayedApps.map(app => (
                  <button
                    key={app}
                    onClick={() => { setSelectedApp(selectedApp === app ? null : app); setCurrentPage(1); }}
                    className={`flex items-center justify-between text-left px-3 py-2 text-xs font-bold transition-all ${
                      selectedApp === app 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{app}</span>
                    {selectedApp === app && <Check size={12} />}
                  </button>
                ))}
              </div>
              {apps.length > 4 && (
                <button
                  onClick={() => setIsAppsExpanded(!isAppsExpanded)}
                  className="text-[11px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 transition-colors mt-1.5 px-3 flex items-center gap-1"
                >
                  {isAppsExpanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                </button>
              )}
            </div>
          </motion.div>

          {/* Catalog Listing Area */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            {/* Listing Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
              <span className="text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-2">
                Danh sách sản phẩm 
                <span className="px-2.5 py-0.5 bg-orange-600/10 text-orange-600 text-xs font-black">
                  {filteredProducts.length} Kết quả
                </span>
              </span>

              {/* Sort A-Z Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => {
                    setSortBy(sortBy === 'name-asc' ? 'default' : 'name-asc');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-xs font-black border uppercase tracking-wider transition-all flex items-center gap-2 ${
                    sortBy === 'name-asc'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-orange-600 hover:text-orange-600'
                  }`}
                >
                  {sortBy === 'name-asc' ? '✓ Danh sách từ A-Z' : 'Xem danh sách từ A-Z'}
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="bg-white border border-slate-200 group flex flex-col hover:border-orange-600 hover:shadow-[0_20px_40px_rgba(234,88,12,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative cursor-pointer"
                  >
                    {/* Field badge in top corner */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest">
                        {product.field}
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="h-56 overflow-hidden bg-slate-100 relative">
                      <img 
                        src={product.img} 
                        alt={product.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent"></div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="space-y-1.5">
                        {/* Brand & App badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[9px] font-black uppercase text-orange-600 tracking-wider">
                            {product.brand}
                          </span>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                            • {product.app}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-black text-slate-950 leading-tight group-hover:text-orange-600 transition-colors min-h-[48px] flex items-start">
                          {product.name}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {product.description}
                      </p>

                      {/* Spacer */}
                      <div className="flex-1"></div>

                      {/* Price Section */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giá bán:</span>
                        <span className="text-sm font-black text-orange-600 tracking-tight">
                          {product.price === 'Liên hệ' ? 'Liên hệ' : product.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white border border-slate-200 p-8"
              >
                <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mx-auto mb-6">
                  <SlidersHorizontal size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-slate-500 font-medium text-sm max-w-md mx-auto mb-6">
                  Không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng làm mới bộ lọc và thử lại.
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-orange-600 text-white font-black uppercase tracking-wider text-xs hover:bg-orange-700 transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </motion.div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(pNum)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Action Modals */}
      <AnimatePresence>
        {modalType && activeProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.25)] rounded-none w-full max-w-lg p-6 md:p-8 relative z-10 text-slate-900 overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-30"
              >
                <X size={20} />
              </button>

              {/* Modal Tabs */}
              <div className="flex border-b border-slate-200 mb-6 mt-2">
                <button
                  onClick={() => { setModalType('contact'); setFormSubmitted(false); }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                    modalType === 'contact'
                      ? 'border-orange-600 text-orange-600 font-black'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Tư vấn & Báo giá
                </button>
                <button
                  onClick={() => { setModalType('buy'); setFormSubmitted(false); }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                    modalType === 'buy'
                      ? 'border-orange-600 text-orange-600 font-black'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Mua bản quyền
                </button>
                <button
                  onClick={() => { 
                    setModalType('download'); 
                    triggerDownload(activeProduct);
                  }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                    modalType === 'download'
                      ? 'border-orange-600 text-orange-600 font-black'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Tải tài liệu
                </button>
              </div>

              {/* Interest Product Banner */}
              <div className="p-4 bg-slate-50 border-l-4 border-orange-600 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Sản phẩm đang chọn</span>
                <span className="text-sm font-black text-slate-800">{activeProduct.name}</span>
              </div>

              {/* Download Modal Mode */}
              {modalType === 'download' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-orange-600/10 text-orange-600 flex items-center justify-center mx-auto mb-4 rounded-none">
                    <Download size={32} className={downloading ? 'animate-bounce' : ''} />
                  </div>
                  <h3 className="text-lg font-black uppercase text-slate-950 tracking-tight mb-2">
                    Tải tài liệu kỹ thuật
                  </h3>
                  
                  {downloading ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 font-medium">Đang chuẩn bị file tài liệu, brochure và bản dùng thử...</p>
                      <div className="w-full h-1.5 bg-slate-100 rounded-none overflow-hidden relative">
                        <div 
                          style={{ width: `${downloadProgress}%` }}
                          className="h-full bg-orange-600 transition-all duration-150"
                        ></div>
                      </div>
                      <span className="text-xs font-mono font-black text-slate-700">{downloadProgress}%</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 border border-emerald-100">
                        <Check size={16} /> Tải tài liệu thành công!
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Tệp tin quảng cáo, hướng dẫn kỹ thuật và bộ cài dùng thử của <b>{activeProduct.name}</b> đã được lưu vào thiết bị của bạn thành công.
                      </p>
                      <button 
                        onClick={() => setModalType(null)}
                        className="px-6 py-2 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors"
                      >
                        Đóng cửa sổ
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Form Modes (Contact & Buy Registration) */}
              {(modalType === 'contact' || modalType === 'buy') && (
                <div>
                  {formSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 space-y-4"
                    >
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto rounded-none">
                        <Check size={24} />
                      </div>
                      <h4 className="text-lg font-black uppercase text-slate-950 tracking-tight">Gửi thông tin thành công!</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Cảm ơn bạn đã quan tâm. Đại diện kinh doanh và bộ phận kỹ thuật của CIC sẽ liên hệ lại với bạn trong vòng 1 giờ làm việc.
                      </p>
                      <button 
                        onClick={() => setModalType(null)}
                        className="mt-2 px-6 py-2 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors"
                      >
                        Đóng
                      </button>
                    </motion.div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Họ và tên *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Nguyễn Văn A" 
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại *</label>
                          <input 
                            required 
                            type="tel" 
                            placeholder="0912 xxx xxx" 
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email nhận thông tin *</label>
                          <input 
                            required 
                            type="email" 
                            placeholder="username@domain.com" 
                            className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn vị / Doanh nghiệp</label>
                        <input 
                          type="text" 
                          placeholder="Công ty Xây dựng XYZ" 
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yêu cầu cụ thể</label>
                        <textarea 
                          rows={3} 
                          placeholder={modalType === 'contact' ? "Tôi muốn nhận báo giá chi tiết và brochure giới thiệu sản phẩm..." : "Tôi muốn đăng ký mua bản quyền chính hãng và nhận tư vấn thủ tục ký kết hợp đồng..."}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none px-4 py-3 text-sm font-bold text-slate-800 resize-none"
                        ></textarea>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-orange-600/20"
                      >
                        {modalType === 'contact' ? 'Gửi yêu cầu báo giá' : 'Đăng ký bản quyền ngay'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  ChevronDown,
  ChevronUp,
  X, 
  Check, 
  SlidersHorizontal,
  RefreshCw,
  Box,
  Layers,
  FileText,
  Tag,
  PhoneCall,
  ShoppingCart
} from 'lucide-react';
import { Product } from '@shared/types';
import { getProductsData } from '../features/products/productsData';
import { ProductDetailView } from './ProductDetailView';

const PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái'
];

interface ProductsViewProps {
  key?: string | number;
}

const PRODUCT_TYPES = ['Phần mềm', 'Thiết bị', 'Giải pháp tích hợp', 'Khác'];

const getProductType = (product: Product): string => {
  if (product.productType) return product.productType;
  const name = product.name.toLowerCase();
  if (name.includes('rô bốt') || name.includes('thiết bị') || name.includes('máy') || name.includes('cảm biến') || name.includes('chum') || name.includes('pet')) {
    return 'Thiết bị';
  }
  if (name.includes('hệ thống') || name.includes('giải pháp') || name.includes('simulators') || name.includes('vr trainer')) {
    return 'Giải pháp tích hợp';
  }
  if (name.includes('phần mềm') || name.includes('cad') || name.includes('bim') || name.includes('3d') || name.includes('autocad') || name.includes('revit')) {
    return 'Phần mềm';
  }
  return 'Khác';
};

export function ProductsView(_props?: ProductsViewProps) {
  const { products: productsData } = useMemo(getProductsData, []);
  const [search, setSearch] = useState('');
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15); // Default to 15 (as requested by user)
  const [sortBy, setSortBy] = useState<'default' | 'name-asc'>('default');

  // Filter section collapse states (Accordion)
  const [isFieldsOpen, setIsFieldsOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);
  const [isAppsOpen, setIsAppsOpen] = useState(true);
  const [isTypesOpen, setIsTypesOpen] = useState(true);

  // Filter expand states (Show more / Show less)
  const [isFieldsExpanded, setIsFieldsExpanded] = useState(false);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [isAppsExpanded, setIsAppsExpanded] = useState(false);

  // Mobile filter menu state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Helper function to toggle items in multi-select filters
  const toggleFilterItem = (currentList: string[], setList: (val: string[]) => void, item: string) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
    setCurrentPage(1);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return selectedProductTypes.length + selectedFields.length + selectedBrands.length + selectedApps.length + (search.trim() ? 1 : 0);
  }, [selectedProductTypes, selectedFields, selectedBrands, selectedApps, search]);

  // Interactive UI states
  const [modalType, setModalType] = useState<'contact' | 'buy' | 'download' | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [downloadFormSubmitted, setDownloadFormSubmitted] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    version: 'v2026-pro',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    return isFieldsExpanded ? fields : fields.slice(0, 10);
  }, [fields, isFieldsExpanded]);

  const displayedBrands = useMemo(() => {
    return isBrandsExpanded ? brands : brands.slice(0, 10);
  }, [brands, isBrandsExpanded]);

  const displayedApps = useMemo(() => {
    return isAppsExpanded ? apps : apps.slice(0, 10);
  }, [apps, isAppsExpanded]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = productsData.filter(p => {
      const matchesSearch = !search.trim() || 
                            p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const pType = getProductType(p);
      const matchesProductType = selectedProductTypes.length === 0 || selectedProductTypes.includes(pType);
      const matchesField = selectedFields.length === 0 || selectedFields.includes(p.field);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesApp = selectedApps.length === 0 || selectedApps.includes(p.app);

      return matchesSearch && matchesProductType && matchesField && matchesBrand && matchesApp;
    });

    if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return result;
  }, [search, selectedProductTypes, selectedFields, selectedBrands, selectedApps, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedProductTypes([]);
    setSelectedFields([]);
    setSelectedBrands([]);
    setSelectedApps([]);
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

  // Simulated download handler showing download registration form first
  const triggerDownload = (product: Product) => {
    setActiveProduct(product);
    setModalType('download');
    setDownloadFormSubmitted(false);
    setDownloading(false);
    setDownloadProgress(0);
    setFormErrors({});
    setFormData({
      name: '',
      phone: '',
      email: '',
      version: 'v2026-pro',
      notes: '',
    });
  };

  const triggerContact = (product: Product) => {
    setActiveProduct(product);
    setModalType('contact');
    setFormSubmitted(false);
    setFormErrors({});
    setFormData({
      name: '',
      phone: '',
      email: '',
      version: 'v2026-pro',
      notes: '',
    });
  };

  const triggerBuy = (product: Product) => {
    setActiveProduct(product);
    setModalType('buy');
    setFormSubmitted(false);
    setFormErrors({});
    setFormData({
      name: '',
      phone: '',
      email: '',
      version: 'v2026-pro',
      notes: '',
    });
  };

  const handleTabSwitch = (type: 'contact' | 'buy' | 'download') => {
    setModalType(type);
    setFormSubmitted(false);
    setFormErrors({});
    setFormData({
      name: '',
      phone: '',
      email: '',
      version: 'v2026-pro',
      notes: '',
    });
    if (type === 'download') {
      setDownloadFormSubmitted(false);
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDownloadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setDownloadFormSubmitted(true);
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Địa chỉ email không hợp lệ';
    }

    if (modalType === 'download' && !formData.version) {
      errors.version = 'Vui lòng chọn phiên bản';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormSubmitted(true);
    setTimeout(() => {
      setModalType(null);
      setFormSubmitted(false);
      setActiveProduct(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        version: 'v2026-pro',
        notes: '',
      });
      setFormErrors({});
    }, 2000);
  };

  const renderActionModal = () => {
    if (!modalType || !activeProduct) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalType(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[-1]"
          ></motion.div>

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white border border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.25)] rounded-2xl w-full max-w-xl p-6 md:p-8 relative z-10 text-slate-900 overflow-y-auto max-h-[92vh] sm:max-h-[94vh] custom-scrollbar"
          >
            {/* Close Button */}
            <button 
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-30"
              title="Đóng"
            >
              <X size={20} />
            </button>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 mb-6 mt-2">
              <button
                type="button"
                onClick={() => handleTabSwitch('contact')}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  modalType === 'contact'
                    ? 'border-orange-600 text-orange-600 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Yêu cầu tư vấn
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('buy')}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  modalType === 'buy'
                    ? 'border-orange-600 text-orange-600 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {getProductType(activeProduct) === 'Thiết bị' ? 'Đăng ký mua' : 'Mua bản quyền'}
              </button>
              {getProductType(activeProduct) !== 'Thiết bị' && (
                <button
                  type="button"
                  onClick={() => handleTabSwitch('download')}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                    modalType === 'download'
                      ? 'border-orange-600 text-orange-600 font-black'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Tải phần mềm
                </button>
              )}
            </div>

            {/* Selected Product Banner */}
            <div className="p-3.5 bg-slate-50 border-l-4 border-orange-600 mb-6 rounded-r-[8px] flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Sản phẩm đang chọn</span>
                <span className="text-sm font-black text-slate-800">{activeProduct.name}</span>
              </div>
            </div>

            {/* Download Modal Body */}
            {modalType === 'download' && (
              <div>
                {!downloadFormSubmitted ? (
                  <form className="space-y-4" onSubmit={handleDownloadFormSubmit}>
                    {/* Row 1: Họ tên */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập họ và tên" 
                        className={`w-full bg-slate-50 border ${
                          formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Row 2: Số điện thoại */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại" 
                        className={`w-full bg-slate-50 border ${
                          formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Row 3: Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Email
                      </label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Nhập email liên hệ" 
                        className={`w-full bg-slate-50 border ${
                          formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Row 4: Chọn phiên bản * */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Chọn phiên bản <span className="text-red-500">*</span>
                      </label>
                      <select 
                        required
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className={`w-full bg-slate-50 border ${
                          formErrors.version ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-bold text-slate-800 rounded-[8px] transition-all cursor-pointer`}
                      >
                        <option value="">-- Chọn phiên bản tải về --</option>
                        <option value="v2026-pro">{activeProduct.name} v2026.1 (Professional Edition)</option>
                        <option value="v2026-std">{activeProduct.name} v2026.1 (Standard Edition)</option>
                        <option value="v2025-ent">{activeProduct.name} v2025.2 (Enterprise Edition)</option>
                        <option value="v2024-lts">{activeProduct.name} v2024.4 (LTS Stable Edition)</option>
                      </select>
                      {formErrors.version && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.version}</p>
                      )}
                    </div>

                    {/* Row 5: Ghi chú */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Ghi chú
                      </label>
                      <textarea 
                        rows={2} 
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Mô tả nhu cầu của bạn..." 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all resize-none"
                      />
                    </div>

                    {/* Note block */}
                    <p className="text-[11px] text-orange-600 font-bold italic pt-0.5">
                      *Vui lòng điền đúng thông tin để chúng tôi liên hệ hỗ trợ bạn
                    </p>

                    <button 
                      type="submit" 
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-600/20 rounded-[8px]"
                    >
                      Bắt đầu tải phần mềm
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-orange-600/10 text-orange-600 flex items-center justify-center mx-auto mb-4 rounded-full">
                      <Download size={32} className={downloading ? 'animate-bounce' : ''} />
                    </div>
                    <h3 className="text-lg font-black uppercase text-slate-950 tracking-tight mb-2">
                      Tải phần mềm {activeProduct.name}
                    </h3>
                    
                    {downloading ? (
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 font-medium">Đang chuẩn bị bộ cài dùng thử, brochure hướng dẫn và tài liệu đi kèm...</p>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                          <div 
                            style={{ width: `${downloadProgress}%` }}
                            className="h-full bg-orange-600 transition-all duration-150 rounded-full"
                          ></div>
                        </div>
                        <span className="text-xs font-sans font-black text-slate-700">{downloadProgress}%</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 border border-emerald-100 rounded-[8px]">
                          <Check size={16} /> Tải phần mềm thành công!
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Bộ cài dùng thử (Trial), brochure kỹ thuật và hướng dẫn kích hoạt bản quyền của <b>{activeProduct.name}</b> đã được tải xuống thiết bị thành công.
                        </p>
                        <p className="text-[11px] text-orange-600 font-bold leading-relaxed">
                          Chúng tôi cũng đã gửi mã Trial Key kích hoạt 30 ngày cùng tài liệu hướng dẫn chuyên sâu vào thông tin liên hệ của bạn.
                        </p>
                        <button 
                          onClick={() => setModalType(null)}
                          className="px-6 py-2.5 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors rounded-[8px]"
                        >
                          Đóng cửa sổ
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contact & Buy Modals Body */}
            {(modalType === 'contact' || modalType === 'buy') && (
              <div>
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto rounded-full">
                      <Check size={24} />
                    </div>
                    <h4 className="text-lg font-black uppercase text-slate-950 tracking-tight">Gửi thông tin thành công!</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-bold">
                      Cảm ơn bạn đã quan tâm. Đại diện kinh doanh và bộ phận kỹ thuật của chúng tôi sẽ liên hệ lại với bạn trong vòng 1 giờ làm việc.
                    </p>
                    <button 
                      onClick={() => setModalType(null)}
                      className="mt-2 px-6 py-2.5 bg-slate-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest transition-colors rounded-[8px]"
                    >
                      Đóng
                    </button>
                  </motion.div>
                ) : (
                  <form className="space-y-4" onSubmit={handleFormSubmit}>
                    {/* Row 1: Họ tên */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập họ và tên" 
                        className={`w-full bg-slate-50 border ${
                          formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Row 2: Số điện thoại */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input 
                        required 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại" 
                        className={`w-full bg-slate-50 border ${
                          formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Row 3: Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Email
                      </label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Nhập email liên hệ" 
                        className={`w-full bg-slate-50 border ${
                          formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-orange-600'
                        } focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Row 4: Ghi chú */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Ghi chú
                      </label>
                      <textarea 
                        rows={2} 
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Mô tả nhu cầu của bạn..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:outline-none focus:bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 rounded-[8px] transition-all resize-none"
                      />
                    </div>

                    {/* Note block */}
                    <p className="text-[11px] text-orange-600 font-bold italic pt-0.5">
                      *Vui lòng điền đúng thông tin để chúng tôi liên hệ hỗ trợ bạn
                    </p>

                    <button 
                      type="submit" 
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-600/20 rounded-[8px]"
                    >
                      {modalType === 'contact' ? 'Gửi yêu cầu báo giá' : 'Đăng ký ngay'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  if (selectedProduct) {
    return (
      <>
        <ProductDetailView 
          product={selectedProduct}
          products={productsData}
          onBack={() => setSelectedProduct(null)}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onContact={triggerContact}
          onDownload={triggerDownload}
          onBuy={triggerBuy}
        />
        
        {renderActionModal()}
      </>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-36 pb-24 relative overflow-hidden">
      {/* Visual background accents to match main landing page */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-none"></div>
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-slate-900/5 blur-[100px] rounded-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Banner Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold uppercase text-[#444] tracking-tighter mb-4"
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all hover:border-orange-600 hover:text-orange-600 rounded-[8px]"
            >
              <SlidersHorizontal size={14} className="text-orange-600" />
              {isMobileFilterOpen ? 'Đóng bộ lọc' : 'Bộ lọc tìm kiếm'}
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-[8px]">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full lg:col-span-3 bg-white border border-slate-200 p-5 shadow-xs sticky top-28 rounded-[10px] ${
              isMobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Sidebar Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
              <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-slate-900">
                <SlidersHorizontal size={16} className="text-orange-600" />
                Bộ lọc tìm kiếm
              </span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-[8px]">
                  Đã chọn {activeFiltersCount}
                </span>
              )}
            </div>

            {/* Compact Search Input */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider mb-1.5">Từ khóa</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-orange-600 focus:bg-white focus:outline-none px-3 py-1.5 pl-8 text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 rounded-[8px]"
                />
                <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Accordion Filter 1: Field (Lĩnh vực) */}
            <div className="border-b border-slate-100 pb-3 mb-3">
              <div 
                onClick={() => setIsFieldsOpen(!isFieldsOpen)}
                className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
              >
                <span className="flex items-center gap-1.5">
                  <Layers size={15} className="text-orange-600" />
                  Lĩnh vực
                  {selectedFields.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                      {selectedFields.length}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedFields.length > 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedFields([]); }} 
                      className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                      title="Xóa bộ lọc lĩnh vực"
                    >
                      Xóa
                    </button>
                  )}
                  {isFieldsOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                </div>
              </div>

              {isFieldsOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1"
                >
                  {displayedFields.map(field => {
                    const isSelected = selectedFields.includes(field);
                    const count = productsData.filter(p => p.field === field).length;
                    return (
                      <button
                        key={field}
                        onClick={() => toggleFilterItem(selectedFields, setSelectedFields, field)}
                        className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                          isSelected 
                            ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal' 
                            : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className="truncate">{field}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                      </button>
                    );
                  })}
                  {fields.length > 10 && (
                    <button
                      onClick={() => setIsFieldsExpanded(!isFieldsExpanded)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors pt-1 px-2.5 flex items-center gap-1"
                    >
                      {isFieldsExpanded ? 'Thu gọn ▲' : `Xem thêm (${fields.length - 10}) ▼`}
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Accordion Filter 2: Brand (Hãng phát triển) */}
            <div className="border-b border-slate-100 pb-3 mb-3">
              <div 
                onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
              >
                <span className="flex items-center gap-1.5">
                  <Box size={15} className="text-orange-600" />
                  Hãng phát triển
                  {selectedBrands.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                      {selectedBrands.length}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedBrands.length > 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedBrands([]); }} 
                      className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                      title="Xóa bộ lọc hãng phát triển"
                    >
                      Xóa
                    </button>
                  )}
                  {isBrandsOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                </div>
              </div>

              {isBrandsOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1"
                >
                  {displayedBrands.map(brand => {
                    const isSelected = selectedBrands.includes(brand);
                    const count = productsData.filter(p => p.brand === brand).length;
                    return (
                      <button
                        key={brand}
                        onClick={() => toggleFilterItem(selectedBrands, setSelectedBrands, brand)}
                        className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                          isSelected 
                            ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal' 
                            : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className="truncate">{brand}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                      </button>
                    );
                  })}
                  {brands.length > 10 && (
                    <button
                      onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors pt-1 px-2.5 flex items-center gap-1"
                    >
                      {isBrandsExpanded ? 'Thu gọn ▲' : `Xem thêm (${brands.length - 10}) ▼`}
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Accordion Filter 3: Application (Ứng dụng) */}
            <div className="border-b border-slate-100 pb-3 mb-3">
              <div 
                onClick={() => setIsAppsOpen(!isAppsOpen)}
                className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
              >
                <span className="flex items-center gap-1.5">
                  <FileText size={15} className="text-orange-600" />
                  Ứng dụng
                  {selectedApps.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                      {selectedApps.length}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedApps.length > 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedApps([]); }} 
                      className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                      title="Xóa bộ lọc ứng dụng"
                    >
                      Xóa
                    </button>
                  )}
                  {isAppsOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                </div>
              </div>

              {isAppsOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1"
                >
                  {displayedApps.map(app => {
                    const isSelected = selectedApps.includes(app);
                    const count = productsData.filter(p => p.app === app).length;
                    return (
                      <button
                        key={app}
                        onClick={() => toggleFilterItem(selectedApps, setSelectedApps, app)}
                        className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                          isSelected 
                            ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal' 
                            : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className="truncate">{app}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                      </button>
                    );
                  })}
                  {apps.length > 10 && (
                    <button
                      onClick={() => setIsAppsExpanded(!isAppsExpanded)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors pt-1 px-2.5 flex items-center gap-1"
                    >
                      {isAppsExpanded ? 'Thu gọn ▲' : `Xem thêm (${apps.length - 10}) ▼`}
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Accordion Filter 4: Product Type (Loại sản phẩm) */}
            <div>
              <div 
                onClick={() => setIsTypesOpen(!isTypesOpen)}
                className="flex items-center justify-between cursor-pointer py-1.5 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-orange-600 transition-colors select-none"
              >
                <span className="flex items-center gap-1.5">
                  <Tag size={15} className="text-orange-600" />
                  Loại sản phẩm
                  {selectedProductTypes.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-orange-600 text-white text-xs font-bold rounded-full">
                      {selectedProductTypes.length}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedProductTypes.length > 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedProductTypes([]); }} 
                      className="text-xs font-medium text-slate-400 hover:text-orange-600 normal-case"
                      title="Xóa bộ lọc loại sản phẩm"
                    >
                      Xóa
                    </button>
                  )}
                  {isTypesOpen ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                </div>
              </div>

              {isTypesOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-1"
                >
                  {PRODUCT_TYPES.map(type => {
                    const isSelected = selectedProductTypes.includes(type);
                    const count = productsData.filter(p => getProductType(p) === type).length;
                    return (
                      <button
                        key={type}
                        onClick={() => toggleFilterItem(selectedProductTypes, setSelectedProductTypes, type)}
                        className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 text-sm transition-all border-l-2 ${
                          isSelected 
                            ? 'border-orange-600 bg-orange-50/80 text-orange-600 font-normal' 
                            : 'border-transparent text-slate-600 font-normal hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>
                          <span className="truncate">{type}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-normal ml-1">({count})</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Catalog Listing Area */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Active Filters Bar (Displays clear tags for currently selected criteria) */}
            {activeFiltersCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50/80 border border-orange-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs rounded-[10px]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-orange-950 tracking-wider flex items-center gap-1.5 mr-1">
                    <SlidersHorizontal size={13} className="text-orange-600" />
                    Đang lọc ({activeFiltersCount}):
                  </span>

                  {/* Search Chip */}
                  {search.trim() && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                      <span className="text-slate-400 font-normal">Từ khóa:</span> "{search}"
                      <button 
                        onClick={() => { setSearch(''); setCurrentPage(1); }}
                        className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                        title="Xóa lọc từ khóa"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {/* Fields Chips */}
                  {selectedFields.map(f => (
                    <span key={`chip-f-${f}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                      <span className="text-orange-600 font-normal">Lĩnh vực:</span> {f}
                      <button 
                        onClick={() => toggleFilterItem(selectedFields, setSelectedFields, f)}
                        className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                        title={`Bỏ chọn ${f}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {/* Brands Chips */}
                  {selectedBrands.map(b => (
                    <span key={`chip-b-${b}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                      <span className="text-orange-600 font-normal">Hãng:</span> {b}
                      <button 
                        onClick={() => toggleFilterItem(selectedBrands, setSelectedBrands, b)}
                        className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                        title={`Bỏ chọn ${b}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {/* Apps Chips */}
                  {selectedApps.map(a => (
                    <span key={`chip-a-${a}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                      <span className="text-orange-600 font-normal">Ứng dụng:</span> {a}
                      <button 
                        onClick={() => toggleFilterItem(selectedApps, setSelectedApps, a)}
                        className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                        title={`Bỏ chọn ${a}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  {/* Product Types Chips */}
                  {selectedProductTypes.map(pt => (
                    <span key={`chip-pt-${pt}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-300 text-xs font-bold text-slate-800 shadow-2xs rounded-[8px]">
                      <span className="text-orange-600 font-normal">Loại:</span> {pt}
                      <button 
                        onClick={() => toggleFilterItem(selectedProductTypes, setSelectedProductTypes, pt)}
                        className="text-slate-400 hover:text-red-600 transition-colors ml-0.5"
                        title={`Bỏ chọn ${pt}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-red-200 px-3 py-1.5 transition-colors shrink-0 self-start sm:self-auto shadow-2xs rounded-[8px]"
                >
                  <RefreshCw size={11} /> Xóa tất cả bộ lọc
                </button>
              </motion.div>
            )}

            {/* Listing Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#444] flex items-center gap-2">
                Danh sách sản phẩm 
                <span className="px-2.5 py-0.5 bg-orange-600/10 text-orange-600 text-xs font-bold rounded-[8px]">
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
                  className={`px-4 py-2 text-xs font-black border uppercase tracking-wider transition-all flex items-center gap-2 rounded-[8px] ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4">
                {paginatedProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="bg-white border border-slate-200/90 hover:border-orange-500 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-[12px] group flex flex-col justify-between cursor-pointer relative overflow-hidden min-h-[285px] sm:min-h-[300px]"
                  >
                    <div className="space-y-3">
                      {/* Image on Left (Logo size), Title on Right */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-transparent p-0 flex items-center justify-center overflow-hidden rounded-none">
                          <img 
                            src={product.img || product.icon} 
                            alt={product.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-none"
                          />
                        </div>
                        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                          {product.name}
                        </h3>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Giá bán:</span>
                        <span className="text-sm sm:text-base font-extrabold text-orange-600 tracking-tight">
                          {product.price === 'Liên hệ' ? 'Liên hệ' : product.price}
                        </span>
                      </div>

                      {/* Short Description (Normal) & Action Buttons (On Hover) */}
                      <div className="pt-2.5 border-t border-slate-100 min-h-[66px] flex flex-col justify-center">
                        {/* Default state: Short description */}
                        <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed line-clamp-3 group-hover:hidden transition-all duration-200">
                          {product.description}
                        </p>

                        {/* Hover state: 3 action buttons on the same row without icons (Liên hệ, Download, Đăng ký mua) */}
                        <div className="hidden group-hover:grid grid-cols-3 gap-1 transition-all duration-200 animate-in fade-in-50">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerContact(product);
                            }}
                            className="py-2 px-0.5 sm:px-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-tight rounded-[6px] transition-all flex items-center justify-center text-center shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                            title="Liên hệ tư vấn"
                          >
                            Liên hệ
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerDownload(product);
                            }}
                            className="py-2 px-0.5 sm:px-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold tracking-tight rounded-[6px] border border-slate-200 transition-all flex items-center justify-center text-center shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                            title="Tải bộ cài & tài liệu"
                          >
                            Download
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerBuy(product);
                            }}
                            className="py-2 px-0.5 sm:px-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold tracking-tight rounded-[6px] transition-all flex items-center justify-center text-center shadow-sm shadow-orange-600/20 active:scale-95 cursor-pointer whitespace-nowrap"
                            title="Đăng ký mua bản quyền / sản phẩm"
                          >
                            Đăng ký mua
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Product Details Action at Bottom */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-[13px] font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                      <span className="font-bold tracking-tight">Chi tiết sản phẩm</span>
                      <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
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
                  className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px]"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`w-10 h-10 border flex items-center justify-center text-xs font-black transition-all rounded-[8px] ${
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
                  className="w-10 h-10 border border-slate-200 flex items-center justify-center transition-colors hover:border-orange-600 disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed bg-white text-slate-700 rounded-[8px]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Action Modals */}
      {renderActionModal()}
    </div>
  );
}

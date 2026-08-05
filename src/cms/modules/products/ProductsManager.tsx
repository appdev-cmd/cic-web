import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Download,
  Trash2,
  CheckSquare,
  Square,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Eye,
  History,
  Copy,
  User,
  Star,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Layers,
  Sparkles,
  ArrowUpDown,
  Tag,
  ShieldCheck,
  Archive,
  FileCheck,
} from 'lucide-react';
import {
  ProductItem,
  ProductCategory,
  ProductBrand,
  ProductActivityLog,
  EditorialStatus,
  CatalogStatus,
} from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { ProductsModuleData } from '../../data/CatalogDataSource';
import { ProductsFormView } from './ProductsFormView';
import { ColumnSettingModal, ColumnVisibility } from './ColumnSettingModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ProductPreviewModal } from './ProductPreviewModal';
import { ProductQuickEditModal } from './ProductQuickEditModal';
import { ProductActivityDrawer } from './ProductActivityDrawer';
import { ProductDuplicateModal, DuplicateConfig } from './ProductDuplicateModal';

type SystemViewTab = 'all' | 'my' | 'pending' | 'low_quality' | 'active' | 'archived';

interface ProductsManagerProps {
  workspaceLocale: CmsLocale;
  data?: ProductsModuleData;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ workspaceLocale, data }) => {
  // Main Products List State
  const [products, setProducts] = useState<ProductItem[]>(data?.products ?? []);
  const [categories] = useState<ProductCategory[]>(data?.categories ?? []);
  const [brands] = useState<ProductBrand[]>(data?.brands ?? []);
  const [owners] = useState(data?.owners ?? []);
  const [activityLogs] = useState<ProductActivityLog[]>(data?.activityLogs ?? []);

  // Current User context (mock current logged in user)
  const currentUserId = data?.currentUserId;

  // Navigation State: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [selectedProductForForm, setSelectedProductForForm] = useState<ProductItem | null>(null);

  // System Views Tab
  const [activeTab, setActiveTab] = useState<SystemViewTab>('all');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [editorialFilter, setEditorialFilter] = useState<string>('all');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');

  // Table Density & Column Visibility
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    title: true,
    sku: true,
    category: true,
    brand: true,
    owner: true,
    editorial_status: true,
    catalog_status: true,
    updated_time: true,
    completeness: true,
  });

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [productToPreview, setProductToPreview] = useState<ProductItem | null>(null);
  const [productToQuickEdit, setProductToQuickEdit] = useState<ProductItem | null>(null);
  const [productForActivity, setProductForActivity] = useState<ProductItem | null>(null);
  const [productToDuplicate, setProductToDuplicate] = useState<ProductItem | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // System View Tab
      if (activeTab === 'my' && p.owner_id !== currentUserId) return false;
      if (activeTab === 'pending' && p.editorial_status !== 'pending_review') return false;
      if (activeTab === 'low_quality' && p.completeness_score >= 75) return false;
      if (activeTab === 'active' && p.catalog_status !== 'active') return false;
      if (activeTab === 'archived' && p.editorial_status !== 'archived' && p.catalog_status !== 'archived') return false;

      // Exclude archived from 'all' tab unless explicitly chosen
      if (activeTab === 'all' && (p.editorial_status === 'archived' || p.catalog_status === 'archived')) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = p.brand_name.toLowerCase().includes(q);
        const matchDesc = p.short_description.toLowerCase().includes(q);
        if (!matchTitle && !matchSku && !matchBrand && !matchDesc) return false;
      }

      // Dropdown Filters
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brand_id !== selectedBrand) return false;
      if (editorialFilter !== 'all' && p.editorial_status !== editorialFilter) return false;
      if (catalogFilter !== 'all' && p.catalog_status !== catalogFilter) return false;

      return true;
    });
  }, [products, activeTab, searchQuery, selectedCategory, selectedBrand, editorialFilter, catalogFilter]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  // Selection Checkbox Handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedProducts.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Bulk Actions
  const handleBatchChangeEditorialStatus = (status: EditorialStatus) => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, editorial_status: status } : p))
    );
    showToast(`Đã chuyển trạng thái biên tập sang "${status.toUpperCase()}" cho ${selectedIds.length} sản phẩm!`);
    setSelectedIds([]);
  };

  const handleBatchChangeCatalogStatus = (status: CatalogStatus) => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, catalog_status: status } : p))
    );
    showToast(`Đã chuyển trạng thái kinh doanh sang "${status.toUpperCase()}" cho ${selectedIds.length} sản phẩm!`);
    setSelectedIds([]);
  };

  const handleBatchArchive = () => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, editorial_status: 'archived', catalog_status: 'archived' } : p
      )
    );
    showToast(`Đã lưu trữ ${selectedIds.length} sản phẩm!`);
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    showToast(`Đã xóa vĩnh viễn ${selectedIds.length} sản phẩm khỏi hệ thống!`);
    setSelectedIds([]);
  };

  // Form Save Handler
  const handleSaveProductFromForm = (
    productData: Partial<ProductItem>,
    actionType: 'draft' | 'submit' | 'approve' | 'publish'
  ) => {
    if (selectedProductForForm) {
      // Update
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProductForForm.id ? { ...p, ...productData } as ProductItem : p))
      );
      showToast(`Đã cập nhật sản phẩm "${productData.title}"!`);
    } else {
      // Create new
      const newProd = productData as ProductItem;
      setProducts((prev) => [newProd, ...prev]);
      showToast(`Đã tạo mới sản phẩm "${newProd.title}"!`);
    }
    setViewMode('list');
    setSelectedProductForForm(null);
  };

  // Duplicate Confirmation Handler
  const handleConfirmDuplicate = (config: DuplicateConfig) => {
    if (!productToDuplicate) return;

    const newProd: ProductItem = {
      ...productToDuplicate,
      id: `prod_${Date.now()}`,
      sku: `${productToDuplicate.sku}${config.newSkuSuffix}`,
      title: `${productToDuplicate.title} (Copy)`,
      alias: `${productToDuplicate.alias}-copy`,
      editorial_status: 'draft',
      catalog_status: 'inactive',
      published: false,
      working_version_id: undefined,
      has_working_draft: false,
      created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast(`Đã nhân bản sản phẩm mới thành công! Mã SKU: ${newProd.sku}`);
    setProductToDuplicate(null);
  };

  // If in Form View
  if (viewMode === 'form') {
    return (
      <ProductsFormView
        product={selectedProductForForm}
        categories={categories}
        brands={brands}
        owners={owners}
        onSave={handleSaveProductFromForm}
        onCancel={() => {
          setViewMode('list');
          setSelectedProductForForm(null);
        }}
        onOpenPreview={(prod) => setProductToPreview(prod)}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP MODULE HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-orange-500/10 text-orange-600 rounded-2xl shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Quản lý danh mục sản phẩm · {workspaceLocale.toUpperCase()}
              </h1>
              <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 font-bold text-[11px] rounded-full border border-orange-500/20">
                {products.filter((product) => product.editorial_status !== 'archived').length} Sản phẩm
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản trị toàn bộ vòng đời sản phẩm, phân loại taxonomy, giá niêm yết & chất lượng dữ liệu catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedProductForForm(null);
              setViewMode('form');
            }}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* 2. SAVED SYSTEM VIEWS TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'all', label: 'Tất cả sản phẩm', count: products.filter((p) => p.editorial_status !== 'archived').length },
          { id: 'my', label: 'Việc của tôi', count: products.filter((p) => p.owner_id === currentUserId).length },
          { id: 'pending', label: 'Hàng chờ review', count: products.filter((p) => p.editorial_status === 'pending_review').length },
          { id: 'low_quality', label: 'Chất lượng thấp (<75%)', count: products.filter((p) => p.completeness_score < 75).length },
          { id: 'active', label: 'Đang Active', count: products.filter((p) => p.catalog_status === 'active').length },
          { id: 'archived', label: 'Lưu trữ / Thùng rác', count: products.filter((p) => p.editorial_status === 'archived' || p.catalog_status === 'archived').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as SystemViewTab);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full ${
                activeTab === tab.id ? 'bg-orange-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. TOOLBAR & FILTERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo Tên sản phẩm, SKU, Hãng..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả Danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Brand */}
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả Hãng sản xuất</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Editorial Status */}
            <select
              value={editorialFilter}
              onChange={(e) => {
                setEditorialFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả Biên tập</option>
              <option value="draft">Bản nháp (Draft)</option>
              <option value="pending_review">Chờ duyệt (Pending)</option>
              <option value="approved">Đã duyệt (Approved)</option>
              <option value="published">Đã xuất bản (Published)</option>
              <option value="rejected">Bị trả lại (Rejected)</option>
            </select>

            {/* Column Setting Button */}
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
              <span>Cấu hình cột</span>
            </button>
          </div>
        </div>

        {/* BULK ACTIONS BAR (Visible when checkboxes are checked) */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold">
              <CheckSquare className="w-4 h-4" />
              <span>Đã chọn {selectedIds.length} sản phẩm</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleBatchChangeEditorialStatus('published')}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Xuất bản hàng loạt
              </button>
              <button
                onClick={() => handleBatchChangeCatalogStatus('active')}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Kích hoạt Active Catalog
              </button>
              <button
                onClick={handleBatchArchive}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
              >
                Chuyển sang Lưu trữ
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Xóa các mục đã chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                {/* Checkbox Sticky Left */}
                <th className="py-3 px-3 w-10 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                  <button
                    onClick={handleSelectAllOnPage}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {paginatedProducts.length > 0 &&
                    paginatedProducts.every((p) => selectedIds.includes(p.id)) ? (
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>

                {/* Title & Identity (Sticky Left) */}
                <th className="py-3 px-4 min-w-[280px] sticky left-10 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                  Sản phẩm & Mã SKU
                </th>

                {/* Category */}
                {columnVisibility.category && <th className="py-3 px-4 min-w-[160px]">Danh mục</th>}

                {/* Brand */}
                {columnVisibility.brand && <th className="py-3 px-4 min-w-[150px]">Hãng sản xuất</th>}

                {/* Owner */}
                {columnVisibility.owner && <th className="py-3 px-4 min-w-[150px]">Người phụ trách</th>}

                {/* Completeness */}
                {columnVisibility.completeness && <th className="py-3 px-4 min-w-[120px]">Chất lượng (%)</th>}

                {/* Editorial Status */}
                {columnVisibility.editorial_status && <th className="py-3 px-4 min-w-[140px]">Biên tập</th>}

                {/* Catalog Status */}
                {columnVisibility.catalog_status && <th className="py-3 px-4 min-w-[140px]">Kinh doanh</th>}

                {/* Updated Time */}
                {columnVisibility.updated_time && <th className="py-3 px-4 min-w-[140px]">Cập nhật</th>}

                {/* Actions (Sticky Right) */}
                <th className="py-3 px-4 w-28 text-center sticky right-0 z-20 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-800">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const catName = categories.find((c) => c.id === p.category_id)?.name || 'Chưa phân loại';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-orange-500/5 dark:bg-orange-950/20' : ''
                      } ${density === 'compact' ? 'py-1' : ''}`}
                    >
                      {/* Checkbox Sticky Left */}
                      <td className="py-3 px-3 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleToggleSelect(p.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Product Identity */}
                      <td className="py-3 px-4 sticky left-10 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 dark:text-white hover:text-orange-600 cursor-pointer line-clamp-1" onClick={() => { setSelectedProductForForm(p); setViewMode('form'); }}>
                                {p.title}
                              </span>
                              {p.is_hot && (
                                <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 text-[9px] font-black rounded border border-amber-500/20">
                                  HOT
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                                SKU: {p.sku}
                              </span>
                              <span>•</span>
                              <span className="text-orange-600 font-bold">{p.price}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      {columnVisibility.category && (
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg">
                            {catName}
                          </span>
                        </td>
                      )}

                      {/* Brand */}
                      {columnVisibility.brand && (
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {p.brand_name}
                        </td>
                      )}

                      {/* Owner */}
                      {columnVisibility.owner && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {p.owner_avatar ? (
                              <img src={p.owner_avatar} alt="" className="w-5 h-5 rounded-full" />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="font-bold text-slate-800 dark:text-slate-200">{p.owner_name}</span>
                          </div>
                        </td>
                      )}

                      {/* Completeness */}
                      {columnVisibility.completeness && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  p.completeness_score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${p.completeness_score}%` }}
                              />
                            </div>
                            <span className="font-bold font-mono text-[11px] text-slate-700 dark:text-slate-300">
                              {p.completeness_score}%
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Editorial Status */}
                      {columnVisibility.editorial_status && (
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                              p.editorial_status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : p.editorial_status === 'pending_review'
                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                : p.editorial_status === 'draft'
                                ? 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                                : 'bg-red-500/10 text-red-600 border-red-500/20'
                            }`}
                          >
                            {p.editorial_status}
                          </span>
                        </td>
                      )}

                      {/* Catalog Status */}
                      {columnVisibility.catalog_status && (
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                              p.catalog_status === 'active'
                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                            }`}
                          >
                            {p.catalog_status}
                          </span>
                        </td>
                      )}

                      {/* Updated Time */}
                      {columnVisibility.updated_time && (
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                          {p.updated_time}
                        </td>
                      )}

                      {/* Sticky Right Actions */}
                      <td className="py-3 px-4 sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Quick Edit */}
                          <button
                            onClick={() => setProductToQuickEdit(p)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Sửa nhanh thuộc tính"
                          >
                            <Zap className="w-4 h-4" />
                          </button>

                          {/* Preview */}
                          <button
                            onClick={() => setProductToPreview(p)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Xem thử giao diện Public"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Audit History */}
                          <button
                            onClick={() => setProductForActivity(p)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Lịch sử phiên bản & Audit"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => setProductToDuplicate(p)}
                            className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Nhân bản sản phẩm"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Archive/Delete */}
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Lưu trữ hoặc Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400 text-xs italic">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div>
            Hiển thị {filteredProducts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
            {Math.min(currentPage * pageSize, filteredProducts.length)} / Tổng số {filteredProducts.length} sản phẩm
          </div>

          <div className="flex items-center gap-3">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold cursor-pointer"
            >
              <option value={25}>25 hàng/trang</option>
              <option value={50}>50 hàng/trang</option>
              <option value={100}>100 hàng/trang</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-slate-800 dark:text-slate-200">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AUXILIARY MODALS & DRAWERS */}
      <ColumnSettingModal
        isOpen={isColumnModalOpen}
        columns={columnVisibility}
        density={density}
        onToggleColumn={(colKey) =>
          setColumnVisibility((prev) => ({ ...prev, [colKey]: !prev[colKey] }))
        }
        onChangeDensity={setDensity}
        onReset={() =>
          setColumnVisibility({
            title: true,
            sku: true,
            category: true,
            brand: true,
            owner: true,
            editorial_status: true,
            catalog_status: true,
            updated_time: true,
            completeness: true,
          })
        }
        onClose={() => setIsColumnModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={!!productToDelete}
        product={productToDelete}
        onConfirmArchive={() => {
          if (productToDelete) {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === productToDelete.id
                  ? { ...p, editorial_status: 'archived', catalog_status: 'archived' }
                  : p
              )
            );
            showToast(`Đã chuyển sản phẩm "${productToDelete.title}" sang trạng thái Lưu trữ.`);
            setProductToDelete(null);
          }
        }}
        onConfirmPermanentDelete={() => {
          if (productToDelete) {
            setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
            showToast(`Đã xóa vĩnh viễn sản phẩm "${productToDelete.title}".`);
            setProductToDelete(null);
          }
        }}
        onClose={() => setProductToDelete(null)}
      />

      <ProductPreviewModal
        isOpen={!!productToPreview}
        product={productToPreview}
        categories={categories}
        onClose={() => setProductToPreview(null)}
      />

      <ProductQuickEditModal
        isOpen={!!productToQuickEdit}
        product={productToQuickEdit}
        categories={categories}
        brands={brands}
        onSave={(updatedFields) => {
          if (productToQuickEdit) {
            setProducts((prev) =>
              prev.map((p) => (p.id === productToQuickEdit.id ? { ...p, ...updatedFields } : p))
            );
            showToast(`Đã cập nhật nhanh sản phẩm "${productToQuickEdit.title}".`);
            setProductToQuickEdit(null);
          }
        }}
        onClose={() => setProductToQuickEdit(null)}
      />

      <ProductActivityDrawer
        isOpen={!!productForActivity}
        product={productForActivity}
        activityLogs={activityLogs}
        onClose={() => setProductForActivity(null)}
      />

      <ProductDuplicateModal
        isOpen={!!productToDuplicate}
        product={productToDuplicate}
        onConfirmDuplicate={handleConfirmDuplicate}
        onClose={() => setProductToDuplicate(null)}
      />
    </div>
  );
};

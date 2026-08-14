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
  RotateCcw,
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
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';

type SystemViewTab = 'all' | 'low_quality' | 'active' | 'archived';

interface ProductsManagerProps {
  workspaceLocale: CmsLocale;
  data?: ProductsModuleData;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ workspaceLocale, data }) => {
  // Main Products List State
  const [products, setProducts] = useState<ProductItem[]>(() => (data?.products ?? []).map((item) => ({
    ...item,
    editorial_status: item.editorial_status === 'published' || item.editorial_status === 'archived' ? item.editorial_status : 'draft',
  })));
  const [categories] = useState<ProductCategory[]>(data?.categories ?? []);
  const [brands] = useState<ProductBrand[]>(data?.brands ?? []);
  const [applications] = useState(data?.applications ?? []);
  const [productTypes] = useState(data?.productTypes ?? []);
  const [owners] = useState(data?.owners ?? []);
  const [activityLogs] = useState<ProductActivityLog[]>(data?.activityLogs ?? []);

  // Current User context (mock current logged in user)

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
  const [pageSize, setPageSize] = useState(20);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // System View Tab
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
    actionType: 'draft' | 'publish'
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const editorialStatus: EditorialStatus = actionType === 'publish' ? 'published' : 'draft';
    if (selectedProductForForm) {
      // Update
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProductForForm.id ? {
          ...p,
          ...productData,
          title: productData.name || productData.title || p.title,
          short_description: productData.summary ?? productData.short_description ?? p.short_description,
          content_html: productData.description ?? productData.content_html ?? p.content_html,
          editorial_status: editorialStatus,
          published: editorialStatus === 'published',
          published_time: editorialStatus === 'published' ? p.published_time || now : undefined,
          updated_time: now,
        } : p))
      );
      showToast(`Đã cập nhật sản phẩm "${productData.name || productData.title || selectedProductForForm.title}"!`);
    } else {
      // Create new
      const title = productData.name || productData.title || '';
      const newProd: ProductItem = {
        id: `prod_${Date.now()}`,
        sku: productData.code || productData.sku || `SP-${Date.now()}`,
        title,
        alias: productData.alias || '',
        short_description: productData.summary || productData.short_description || '',
        product_type: productData.types || productData.product_type || '',
        category_id: productData.category_ids?.[0] || productData.category_id || '',
        brand_id: productData.manufactory || productData.brand_id || '',
        brand_name: brands.find((brand) => brand.id === (productData.manufactory || productData.brand_id))?.name || '',
        application_areas: productData.application || productData.application_areas || [],
        price: productData.price_old || productData.price || '',
        currency: productData.currency || 'VND',
        unit: productData.unit || '',
        origin: productData.origin || '',
        warranty: productData.warranty || '',
        availability_signal: productData.availability_signal || 'contact',
        content_html: productData.description || productData.content_html || '',
        highlights: productData.highlights || [],
        tech_specs: productData.tech_specs || [],
        image: productData.image || '',
        gallery: productData.gallery || [],
        documents: productData.documents || [],
        meta_title: productData.seo_title || productData.meta_title || '',
        meta_description: productData.seo_description || productData.meta_description || '',
        meta_keywords: productData.seo_keyword || productData.meta_keywords || '',
        canonical_url: productData.canonical_url || '',
        owner_id: productData.owner_id || '',
        owner_name: productData.owner_name || '',
        inquiry_routing: productData.inquiry_routing || '',
        editorial_status: editorialStatus,
        catalog_status: productData.catalog_status || 'inactive',
        published: editorialStatus === 'published',
        is_hot: productData.is_hot || false,
        ordering: productData.ordering || 1,
        site_placement: productData.site_placement || ['catalog_grid'],
        completeness_score: productData.completeness_score || 0,
        created_time: now,
        updated_time: now,
        published_time: editorialStatus === 'published' ? now : undefined,
        ...productData,
      };
      setProducts((prev) => [newProd, ...prev]);
      showToast(`Đã tạo mới sản phẩm "${title}"!`);
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
      <>
        <ProductsFormView
          product={selectedProductForForm}
          categories={categories}
          brands={brands}
          applications={applications}
          productTypes={productTypes}
          relatedProducts={products}
          owners={owners}
          onSave={handleSaveProductFromForm}
          onCancel={() => {
            setViewMode('list');
            setSelectedProductForForm(null);
          }}
          onOpenPreview={(prod) => setProductToPreview(prod)}
        />
        <ProductPreviewModal
          isOpen={!!productToPreview}
          product={productToPreview}
          categories={categories}
          onClose={() => setProductToPreview(null)}
        />
      </>
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
      <CmsPageHeader
        icon={<Package />}
        title="Sản phẩm"
        description="Quản lý thông tin, phân loại, giá bán, trạng thái xuất bản và chất lượng dữ liệu sản phẩm."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{products.filter((product) => product.editorial_status !== 'archived').length} sản phẩm</span>}
        actions={(
          <CmsButton
            onClick={() => {
              setSelectedProductForForm(null);
              setViewMode('form');
            }}
            variant="primary"
            size="sm"
            leadingIcon={<Plus />}
          >
            Thêm sản phẩm
          </CmsButton>
        )}
      />

      <CmsTabs
        ariaLabel="Nhóm sản phẩm"
        value={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        items={[
          { id: 'all', label: 'Tất cả sản phẩm', count: products.filter((p) => p.editorial_status !== 'archived').length },
          { id: 'low_quality', label: 'Chất lượng dưới 75%', count: products.filter((p) => p.completeness_score < 75).length },
          { id: 'active', label: 'Đang kinh doanh', count: products.filter((p) => p.catalog_status === 'active').length },
          { id: 'archived', label: 'Lưu trữ và thùng rác', count: products.filter((p) => p.editorial_status === 'archived' || p.catalog_status === 'archived').length },
        ]}
      />

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
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản (Published)</option>
            </select>

            {/* Column Setting Button */}
            <button type="button" disabled={!searchQuery && selectedCategory === 'all' && selectedBrand === 'all' && editorialFilter === 'all' && catalogFilter === 'all'} onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedBrand('all'); setEditorialFilter('all'); setCatalogFilter('all'); setCurrentPage(1); }} className="flex h-9 w-24 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"><RotateCcw className="h-3.5 w-3.5" />Đặt lại</button>
          </div>
        </div>

        {/* BULK ACTIONS BAR (Visible when checkboxes are checked) */}
        <CmsBulkActionBar
          selectedCount={selectedIds.length}
          itemLabel="sản phẩm"
          onClear={() => setSelectedIds([])}
          actions={[
            { label: 'Xuất bản', onClick: () => handleBatchChangeEditorialStatus('published'), icon: FileCheck, variant: 'primary' },
            { label: 'Đưa vào kinh doanh', onClick: () => handleBatchChangeCatalogStatus('active'), icon: Package },
            { label: 'Lưu trữ', onClick: handleBatchArchive, icon: Archive },
            { label: 'Xóa', onClick: handleBatchDelete, icon: Trash2, variant: 'danger' },
          ]}
        />
      </div>

      {/* 4. MAIN DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                {/* Checkbox Sticky Left */}
                <th className="py-3 px-3 w-10 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                  <CmsSelectionCheckbox
                    checked={paginatedProducts.length > 0 && paginatedProducts.every((product) => selectedIds.includes(product.id))}
                    indeterminate={selectedIds.some((id) => paginatedProducts.some((product) => product.id === id)) && !paginatedProducts.every((product) => selectedIds.includes(product.id))}
                    onChange={handleSelectAllOnPage}
                    label="Chọn tất cả sản phẩm trên trang"
                  />
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
                        <CmsSelectionCheckbox checked={isSelected} onChange={() => handleToggleSelect(p.id)} label={`Chọn sản phẩm ${p.title}`} />
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
                          <CmsIconButton
                            onClick={() => setProductToQuickEdit(p)}
                            icon={<Zap />}
                            size="sm"
                            aria-label="Sửa nhanh sản phẩm"
                            title="Sửa nhanh thuộc tính"
                          />

                          {/* Preview */}
                          <CmsIconButton
                            onClick={() => setProductToPreview(p)}
                            icon={<Eye />}
                            size="sm"
                            aria-label="Xem thử sản phẩm"
                            title="Xem thử giao diện công khai"
                          />

                          {/* Audit History */}
                          <CmsIconButton
                            onClick={() => setProductForActivity(p)}
                            icon={<History />}
                            size="sm"
                            aria-label="Xem lịch sử sản phẩm"
                            title="Lịch sử phiên bản"
                          />

                          {/* Duplicate */}
                          <CmsIconButton
                            onClick={() => setProductToDuplicate(p)}
                            icon={<Copy />}
                            size="sm"
                            aria-label="Nhân bản sản phẩm"
                            title="Nhân bản sản phẩm"
                          />

                          {/* Archive/Delete */}
                          <CmsIconButton
                            onClick={() => setProductToDelete(p)}
                            icon={<Trash2 />}
                            size="sm"
                            variant="danger"
                            aria-label="Lưu trữ hoặc xóa sản phẩm"
                            title="Lưu trữ hoặc xóa"
                          />
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
        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredProducts.length} itemLabel="sản phẩm" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
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

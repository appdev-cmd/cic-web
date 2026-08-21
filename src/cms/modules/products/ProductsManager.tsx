import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  CheckCircle2,
  Eye,
  History,
  Copy,
  Star,
  Tag,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  Layers,
  Edit,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  ProductItem,
  ProductCategory,
  ProductBrand,
  ProductActivityLog,
  EditorialStatus,
} from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';
import type { CmsLocale } from '../../data/CmsDataSource';
import type { ProductsModuleData } from '../../data/CatalogDataSource';
import { ProductsFormView } from './ProductsFormView';
import { ColumnSettingModal, ColumnVisibility, defaultColumnVisibility } from './ColumnSettingModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ProductPreviewModal } from './ProductPreviewModal';
import { ProductActivityDrawer } from './ProductActivityDrawer';
import { ProductDuplicateModal, DuplicateConfig } from './ProductDuplicateModal';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';

type SystemViewTab = 'all' | 'published' | 'draft' | 'is_hot';

interface ProductsManagerProps {
  workspaceLocale: CmsLocale;
  data?: ProductsModuleData;
}

const removeVietnameseTones = (str: string = ''): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
};

export const ProductsManager: React.FC<ProductsManagerProps> = ({ data }) => {
  // Main Products List State
  const [products, setProducts] = useState<ProductItem[]>(() =>
    (data?.products ?? []).map((item) => ({
      ...item,
      name: item.name || item.title || '',
      code: item.code || item.sku || '',
      price_old: item.price_old || item.price || '',
      types: item.types || item.product_type || '',
      manufactory: item.manufactory || item.brand_id || '',
      category_ids: item.category_ids && item.category_ids.length > 0
        ? item.category_ids
        : item.category_id
        ? [item.category_id]
        : [],
      application: item.application || item.application_areas || [],
      editorial_status: item.editorial_status === 'published' ? 'published' : 'draft',
    }))
  );
  const [categories] = useState<ProductCategory[]>(data?.categories ?? []);
  const [brands] = useState<ProductBrand[]>(data?.brands ?? []);
  const [applications] = useState<MasterApplicationItem[]>(data?.applications ?? []);
  const [productTypes] = useState<MasterProductTypeItem[]>(data?.productTypes ?? []);
  const [owners] = useState(data?.owners ?? []);
  const [activityLogs] = useState<ProductActivityLog[]>(data?.activityLogs ?? []);

  // Navigation State: 'list' | 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [selectedProductForForm, setSelectedProductForForm] = useState<ProductItem | null>(null);

  // System Views Tab
  const [activeTab, setActiveTab] = useState<SystemViewTab>('all');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedProductType, setSelectedProductType] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<string>('all');

  // Table Density & Column Visibility
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultColumnVisibility);

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [productToPreview, setProductToPreview] = useState<ProductItem | null>(null);
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

  // Helper lookups
  const getCategoryNames = (p: ProductItem): string[] => {
    const ids = p.category_ids && p.category_ids.length > 0 ? p.category_ids : p.category_id ? [p.category_id] : [];
    const matched = categories.filter((c) => ids.includes(c.id) || ids.includes(c.name));
    if (matched.length > 0) return matched.map((c) => c.name);
    if (ids.length > 0) return ids;
    return ['Chưa phân loại'];
  };

  const getBrandName = (p: ProductItem): string => {
    const brandId = p.manufactory || p.brand_id;
    const found = brands.find((b) => b.id === brandId || b.name === brandId || b.name === p.brand_name);
    return found ? found.name : p.brand_name || brandId || '—';
  };

  const getProductTypeName = (p: ProductItem): string => {
    const typeId = p.types || p.product_type;
    const found = productTypes.find((t) => t.id === typeId || t.name === typeId);
    return found ? found.name : typeId || '—';
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. System View Tab
      if (activeTab === 'published' && p.editorial_status !== 'published') return false;
      if (activeTab === 'draft' && p.editorial_status !== 'draft') return false;
      if (activeTab === 'is_hot' && !p.is_hot) return false;

      // 2. Search Query (supports accented and unaccented search across all fields)
      if (searchQuery.trim()) {
        const rawQ = searchQuery.toLowerCase().trim();
        const normQ = removeVietnameseTones(searchQuery);

        const catNames = getCategoryNames(p).join(' ');
        const brandName = getBrandName(p);
        const typeName = getProductTypeName(p);
        const appNames = (p.application || p.application_areas || []).join(' ');
        const tagNames = (p.tags || []).join(' ');

        const searchableParts = [
          p.name,
          p.title,
          p.code,
          p.sku,
          p.alias,
          p.summary,
          p.short_description,
          p.description,
          p.price,
          p.price_old,
          brandName,
          typeName,
          catNames,
          appNames,
          tagNames,
        ];

        const rawText = searchableParts.filter(Boolean).join(' ').toLowerCase();
        const normText = removeVietnameseTones(rawText);

        if (!rawText.includes(rawQ) && !normText.includes(normQ)) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== 'all') {
        const pCatIds = [
          ...(p.category_ids || []),
          p.category_id,
        ].filter(Boolean) as string[];

        const targetCat = categories.find((c) => c.id === selectedCategory);
        const targetCatNameNorm = targetCat ? removeVietnameseTones(targetCat.name) : '';

        const hasCatMatch = pCatIds.some((catIdOrName) => {
          if (catIdOrName === selectedCategory) return true;
          if (targetCatNameNorm && removeVietnameseTones(catIdOrName).includes(targetCatNameNorm)) return true;
          return false;
        });

        if (!hasCatMatch) return false;
      }

      // 4. Brand Filter
      if (selectedBrand !== 'all') {
        const targetBrand = brands.find((b) => b.id === selectedBrand);
        const targetBrandNameNorm = targetBrand ? removeVietnameseTones(targetBrand.name) : '';

        const pBrandId = p.manufactory || p.brand_id || '';
        const pBrandNameNorm = removeVietnameseTones(p.brand_name || getBrandName(p));

        const isBrandMatch =
          pBrandId === selectedBrand ||
          (targetBrandNameNorm && (pBrandNameNorm.includes(targetBrandNameNorm) || targetBrandNameNorm.includes(pBrandNameNorm)));

        if (!isBrandMatch) return false;
      }

      // 5. Product Type Filter
      if (selectedProductType !== 'all') {
        const targetType = productTypes.find((t) => t.id === selectedProductType);
        const targetTypeNameNorm = targetType ? removeVietnameseTones(targetType.name) : '';
        const pTypeVal = p.types || p.product_type || '';
        const pTypeValNorm = removeVietnameseTones(pTypeVal);

        const isTypeMatch =
          pTypeVal === selectedProductType ||
          (targetType && pTypeVal === targetType.name) ||
          (targetTypeNameNorm && pTypeValNorm && (pTypeValNorm.includes(targetTypeNameNorm) || targetTypeNameNorm.includes(pTypeValNorm)));

        if (!isTypeMatch) return false;
      }

      // 6. Application Filter
      if (selectedApplication !== 'all') {
        const targetApp = applications.find((a) => a.id === selectedApplication);
        const targetAppNameNorm = targetApp ? removeVietnameseTones(targetApp.name) : '';
        const pAppsNorm = (p.application || p.application_areas || []).map((a) => removeVietnameseTones(a));

        const isAppMatch =
          (p.application || p.application_areas || []).includes(selectedApplication) ||
          (targetAppNameNorm && pAppsNorm.some((a) => a.includes(targetAppNameNorm) || targetAppNameNorm.includes(a)));

        if (!isAppMatch) return false;
      }

      return true;
    });
  }, [
    products,
    activeTab,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedProductType,
    selectedApplication,
    categories,
    brands,
    productTypes,
    applications,
  ]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

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
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, editorial_status: status, published: status === 'published' } : p))
    );
    showToast(`Đã chuyển trạng thái sang "${status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}" cho ${selectedIds.length} sản phẩm!`);
    setSelectedIds([]);
  };

  const handleBatchToggleHot = (isHot: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, is_hot: isHot } : p))
    );
    showToast(`Đã ${isHot ? 'đánh dấu tiêu biểu' : 'bỏ đánh dấu tiêu biểu'} cho ${selectedIds.length} sản phẩm!`);
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
    const prodName = productData.name || productData.title || 'Sản phẩm mới';

    if (selectedProductForForm) {
      // Update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProductForForm.id
            ? {
                ...p,
                ...productData,
                name: prodName,
                title: prodName,
                code: productData.code || productData.sku || p.code || p.sku,
                sku: productData.code || productData.sku || p.sku,
                price_old: productData.price_old || productData.price || p.price_old || p.price,
                price: productData.price_old || productData.price || p.price,
                types: productData.types || productData.product_type || p.types || p.product_type,
                product_type: productData.types || productData.product_type || p.product_type,
                manufactory: productData.manufactory || productData.brand_id || p.manufactory || p.brand_id,
                brand_id: productData.manufactory || productData.brand_id || p.brand_id,
                category_ids: productData.category_ids || p.category_ids,
                application: productData.application || productData.application_areas || p.application,
                summary: productData.summary ?? productData.short_description ?? p.summary,
                short_description: productData.summary ?? productData.short_description ?? p.short_description,
                description: productData.description ?? productData.content_html ?? p.description,
                content_html: productData.description ?? productData.content_html ?? p.content_html,
                editorial_status: editorialStatus,
                published: editorialStatus === 'published',
                published_time: editorialStatus === 'published' ? p.published_time || now : undefined,
                updated_time: now,
              }
            : p
        )
      );
      showToast(`Đã cập nhật sản phẩm "${prodName}"!`);
    } else {
      // Create new
      const newProd: ProductItem = {
        id: `prod_${Date.now()}`,
        name: prodName,
        title: prodName,
        code: productData.code || productData.sku || `SP-${Date.now()}`,
        sku: productData.code || productData.sku || `SP-${Date.now()}`,
        alias: productData.alias || '',
        other_languages1: productData.other_languages1 || '',
        manufactory: productData.manufactory || productData.brand_id || '',
        brand_id: productData.manufactory || productData.brand_id || '',
        brand_name: brands.find((b) => b.id === (productData.manufactory || productData.brand_id))?.name || '',
        types: productData.types || productData.product_type || '',
        product_type: productData.types || productData.product_type || '',
        category_ids: productData.category_ids || (productData.category_id ? [productData.category_id] : []),
        category_id: productData.category_ids?.[0] || productData.category_id || '',
        application: productData.application || productData.application_areas || [],
        application_areas: productData.application || productData.application_areas || [],
        products_relates: productData.products_relates || [],
        summary: productData.summary || productData.short_description || '',
        short_description: productData.summary || productData.short_description || '',
        description: productData.description || productData.content_html || '',
        content_html: productData.description || productData.content_html || '',
        feature_details: productData.feature_details || '',
        video: productData.video || productData.video_url || '',
        tawk_to: productData.tawk_to || '',
        tags: productData.tags || [],
        price_old: productData.price_old || productData.price || '',
        price: productData.price_old || productData.price || '',
        currency: productData.currency || 'VND',
        unit: productData.unit || '',
        origin: productData.origin || '',
        warranty: productData.warranty || '',
        availability_signal: productData.availability_signal || 'contact',
        image: productData.image || '',
        icon: productData.icon || '',
        gallery: productData.gallery || [],
        documents: productData.documents || [],
        is_hot: productData.is_hot || false,
        teamview: productData.teamview || false,
        ordering: productData.ordering || 1,
        landing_page: productData.landing_page || '',
        seo_title: productData.seo_title || productData.meta_title || '',
        meta_title: productData.seo_title || productData.meta_title || '',
        seo_keyword: productData.seo_keyword || productData.meta_keywords || '',
        meta_keywords: productData.seo_keyword || productData.meta_keywords || '',
        seo_description: productData.seo_description || productData.meta_description || '',
        meta_description: productData.seo_description || productData.meta_description || '',
        canonical_url: productData.canonical_url || '',
        file_catalogue: productData.file_catalogue || '',
        file_price: productData.file_price || '',
        link_catalogue: productData.link_catalogue || '',
        file_driver_name: productData.file_driver_name || '',
        file_driver: productData.file_driver || '',
        link_driver: productData.link_driver || '',
        owner_id: productData.owner_id || '',
        owner_name: productData.owner_name || '',
        inquiry_routing: productData.inquiry_routing || '',
        editorial_status: editorialStatus,
        catalog_status: 'active',
        published: editorialStatus === 'published',
        site_placement: ['catalog_grid'],
        completeness_score: 85,
        created_time: now,
        updated_time: now,
        published_time: editorialStatus === 'published' ? now : undefined,
        ...productData,
      };
      setProducts((prev) => [newProd, ...prev]);
      showToast(`Đã tạo mới sản phẩm "${prodName}"!`);
    }
    setViewMode('list');
    setSelectedProductForForm(null);
  };

  // Duplicate Confirmation Handler
  const handleConfirmDuplicate = (config: DuplicateConfig) => {
    if (!productToDuplicate) return;

    const sourceName = productToDuplicate.name || productToDuplicate.title;
    const newProd: ProductItem = {
      ...productToDuplicate,
      id: `prod_${Date.now()}`,
      name: `${sourceName} (Bản sao)`,
      title: `${sourceName} (Bản sao)`,
      code: `${productToDuplicate.code || productToDuplicate.sku}${config.newSkuSuffix}`,
      sku: `${productToDuplicate.sku || productToDuplicate.code}${config.newSkuSuffix}`,
      alias: `${productToDuplicate.alias}-copy`,
      editorial_status: 'draft',
      published: false,
      created_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast(`Đã nhân bản sản phẩm mới thành công!`);
    setProductToDuplicate(null);
  };

  const activeFiltersCount = [
    searchQuery.trim() !== '',
    selectedCategory !== 'all',
    selectedBrand !== 'all',
    selectedProductType !== 'all',
    selectedApplication !== 'all',
  ].filter(Boolean).length;

  const isFilterActive = activeFiltersCount > 0;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedProductType('all');
    setSelectedApplication('all');
    setCurrentPage(1);
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
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP MODULE HEADER CARD */}
      <CmsPageHeader
        icon={<Package />}
        title="Sản phẩm"
        description="Quản lý danh mục sản phẩm, cấu hình giá, phân loại theo hãng, lĩnh vực, ứng dụng và trạng thái xuất bản."
        meta={
          <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {products.length} sản phẩm
          </span>
        }
        actions={
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
        }
      />

      {/* 2. TABS */}
      <CmsTabs
        ariaLabel="Trạng thái sản phẩm"
        value={activeTab}
        onChange={(tab) => {
          setActiveTab(tab as SystemViewTab);
          setCurrentPage(1);
        }}
        items={[
          {
            id: 'all',
            label: 'Tất cả sản phẩm',
            count: products.length,
          },
          {
            id: 'published',
            label: 'Đã xuất bản',
            count: products.filter((p) => p.editorial_status === 'published').length,
          },
          {
            id: 'draft',
            label: 'Bản nháp',
            count: products.filter((p) => p.editorial_status === 'draft').length,
          },
          {
            id: 'is_hot',
            label: 'Sản phẩm tiêu biểu',
            count: products.filter((p) => p.is_hot).length,
          },
        ]}
      />

      {/* 3. TOOLBAR & FILTERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Ô Tìm kiếm (Search Box) */}
          <div className="relative flex items-center w-full sm:w-56 lg:w-64 shrink-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo Tên, SKU, Hãng..."
              className="w-full h-9.5 pl-9 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter 1: Lĩnh vực */}
          <div className="min-w-[130px] flex-1 max-w-[180px]">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
              title="Lọc theo Lĩnh vực"
            >
              <option value="all">Tất cả Lĩnh vực</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 2: Hãng sản xuất */}
          <div className="min-w-[140px] flex-1 max-w-[200px]">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
              title="Lọc theo Hãng sản xuất"
            >
              <option value="all">Tất cả Hãng sản xuất</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 3: Loại sản phẩm */}
          <div className="min-w-[140px] flex-1 max-w-[200px]">
            <select
              value={selectedProductType}
              onChange={(e) => {
                setSelectedProductType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
              title="Lọc theo Loại sản phẩm"
            >
              <option value="all">Tất cả Loại sản phẩm</option>
              {productTypes
                .filter((t) => t.status === 'active')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Filter 4: Ứng dụng */}
          <div className="min-w-[140px] flex-1 max-w-[200px]">
            <select
              value={selectedApplication}
              onChange={(e) => {
                setSelectedApplication(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"
              title="Lọc theo Ứng dụng"
            >
              <option value="all">Tất cả Ứng dụng</option>
              {applications
                .filter((a) => a.status === 'active')
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Cụm nút thao tác bên phải: Đặt lại */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Nút Đặt lại */}
            <button
              type="button"
              disabled={!isFilterActive}
              onClick={handleResetFilters}
              className={`flex h-9.5 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isFilterActive
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 dark:hover:bg-orange-900/80 shadow-xs'
                  : 'text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 disabled:cursor-not-allowed disabled:opacity-50'
              }`}
              title="Đặt lại tất cả bộ lọc và tìm kiếm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* BULK ACTIONS BAR (Visible when checkboxes are checked) */}
      <CmsBulkActionBar
        selectedCount={selectedIds.length}
        itemLabel="sản phẩm"
        onClear={() => setSelectedIds([])}
        actions={[
          {
            label: 'Xuất bản',
            onClick: () => handleBatchChangeEditorialStatus('published'),
            icon: FileCheck,
            variant: 'primary',
          },
          {
            label: 'Chuyển về nháp',
            onClick: () => handleBatchChangeEditorialStatus('draft'),
            icon: RotateCcw,
          },
          {
            label: 'Xóa',
            onClick: handleBatchDelete,
            icon: Trash2,
            variant: 'danger',
          },
        ]}
      />

      {/* 4. MAIN DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                {/* Checkbox Sticky Left */}
                <th className="py-3 px-3 w-10 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                  <CmsSelectionCheckbox
                    checked={
                      paginatedProducts.length > 0 &&
                      paginatedProducts.every((product) => selectedIds.includes(product.id))
                    }
                    indeterminate={
                      selectedIds.some((id) => paginatedProducts.some((product) => product.id === id)) &&
                      !paginatedProducts.every((product) => selectedIds.includes(product.id))
                    }
                    onChange={handleSelectAllOnPage}
                    label="Chọn tất cả sản phẩm trên trang"
                  />
                </th>

                {/* Tên sản phẩm & Nhận diện (Sticky Left) */}
                {columnVisibility.product && (
                  <th className="py-3 px-4 min-w-[280px] sticky left-10 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                    Sản phẩm
                  </th>
                )}

                {/* Biệt danh / Mã */}
                {columnVisibility.code && <th className="py-3 px-4 min-w-[130px]">Biệt danh</th>}

                {/* Lĩnh vực */}
                {columnVisibility.category && <th className="py-3 px-4 min-w-[160px]">Lĩnh vực</th>}

                {/* Hãng sản xuất */}
                {columnVisibility.brand && <th className="py-3 px-4 min-w-[150px]">Hãng sản xuất</th>}

                {/* Loại sản phẩm */}
                {columnVisibility.product_type && <th className="py-3 px-4 min-w-[140px]">Loại sản phẩm</th>}

                {/* Ứng dụng */}
                {columnVisibility.application && <th className="py-3 px-4 min-w-[160px]">Ứng dụng</th>}

                {/* Giá */}
                {columnVisibility.price && <th className="py-3 px-4 min-w-[120px]">Giá</th>}

                {/* Thứ tự */}
                {columnVisibility.ordering && <th className="py-3 px-3 min-w-[80px] text-center">Thứ tự</th>}

                {/* Sản phẩm tiêu biểu */}
                {columnVisibility.is_hot && <th className="py-3 px-3 min-w-[100px] text-center">Tiêu biểu</th>}

                {/* Link TeamViewer */}
                {columnVisibility.teamview && <th className="py-3 px-3 min-w-[110px] text-center">TeamViewer</th>}

                {/* Trạng thái */}
                {columnVisibility.editorial_status && (
                  <th className="py-3 px-4 min-w-[120px] text-center">Trạng thái</th>
                )}

                {/* Thời gian cập nhật */}
                {columnVisibility.updated_time && <th className="py-3 px-4 min-w-[130px]">Cập nhật</th>}

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
                  const prodName = p.name || p.title || 'Chưa đặt tên';
                  const prodCode = p.code || p.sku || '—';
                  const prodPrice = p.price_old || p.price || 'Báo giá';
                  const catNames = getCategoryNames(p);
                  const brandName = getBrandName(p);
                  const typeName = getProductTypeName(p);
                  const apps = p.application || p.application_areas || [];

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        density === 'compact' ? 'py-1' : ''
                      }`}
                    >
                      {/* Checkbox Sticky Left */}
                      <td className="py-3 px-3 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                        <CmsSelectionCheckbox
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          label={`Chọn sản phẩm ${prodName}`}
                        />
                      </td>

                      {/* Product Identity (Tên & Ảnh & Hot) */}
                      {columnVisibility.product && (
                        <td className="py-3 px-4 sticky left-10 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-3">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProductForForm(p);
                                  setViewMode('form');
                                }}
                                className="font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer text-left line-clamp-1"
                              >
                                {prodName}
                              </button>
                              {p.is_hot && (
                                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black rounded border border-amber-500/20 shrink-0">
                                  HOT
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Biệt danh / Mã */}
                      {columnVisibility.code && (
                        <td className="py-3 px-4 font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                          {prodCode}
                        </td>
                      )}

                      {/* Lĩnh vực */}
                      {columnVisibility.category && (
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {catNames.map((cat, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}

                      {/* Hãng sản xuất */}
                      {columnVisibility.brand && (
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {brandName}
                        </td>
                      )}

                      {/* Loại sản phẩm */}
                      {columnVisibility.product_type && (
                        <td className="py-3 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {typeName}
                        </td>
                      )}

                      {/* Ứng dụng */}
                      {columnVisibility.application && (
                        <td className="py-3 px-4">
                          {apps.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {apps.map((app, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-[10px] font-medium rounded"
                                >
                                  {app}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                      )}

                      {/* Giá */}
                      {columnVisibility.price && (
                        <td className="py-3 px-4 font-bold text-xs text-orange-600 dark:text-orange-400">
                          {prodPrice}
                        </td>
                      )}

                      {/* Thứ tự */}
                      {columnVisibility.ordering && (
                        <td className="py-3 px-3 text-center font-mono font-bold text-xs text-slate-600 dark:text-slate-300">
                          {p.ordering ?? 1}
                        </td>
                      )}

                      {/* Tiêu biểu */}
                      {columnVisibility.is_hot && (
                        <td className="py-3 px-3 text-center">
                          {p.is_hot ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Star className="w-3 h-3 fill-amber-500" />
                              Tiêu biểu
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                      )}

                      {/* Link TeamViewer */}
                      {columnVisibility.teamview && (
                        <td className="py-3 px-3 text-center">
                          {p.teamview ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Có
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                      )}

                      {/* Trạng thái */}
                      {columnVisibility.editorial_status && (
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border tracking-wider ${
                              p.editorial_status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : p.editorial_status === 'draft'
                                ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                            }`}
                          >
                            {p.editorial_status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                          </span>
                        </td>
                      )}

                      {/* Updated Time */}
                      {columnVisibility.updated_time && (
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          {p.updated_time}
                        </td>
                      )}

                      {/* Sticky Right Actions */}
                      <td className="py-3 px-4 sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Edit Full */}
                          <CmsIconButton
                            onClick={() => {
                              setSelectedProductForForm(p);
                              setViewMode('form');
                            }}
                            icon={<Edit />}
                            size="sm"
                            aria-label="Chỉnh sửa chi tiết"
                            title="Chỉnh sửa toàn bộ biểu mẫu"
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

                          {/* Delete */}
                          <CmsIconButton
                            onClick={() => setProductToDelete(p)}
                            icon={<Trash2 />}
                            size="sm"
                            variant="danger"
                            aria-label="Xóa sản phẩm"
                            title="Xóa"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400 text-xs italic">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION FOOTER */}
        <CmsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={filteredProducts.length}
          itemLabel="sản phẩm"
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
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
        onReset={() => setColumnVisibility(defaultColumnVisibility)}
        onClose={() => setIsColumnModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={!!productToDelete}
        product={productToDelete}
        onConfirmPermanentDelete={() => {
          if (productToDelete) {
            setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
            showToast(`Đã xóa vĩnh viễn sản phẩm "${productToDelete.name || productToDelete.title}".`);
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

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
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
import { FEATURED_CONTENT_LIMITS } from '../featuredContentPolicy';
import { ColumnSettingModal, ColumnVisibility, defaultColumnVisibility } from './ColumnSettingModal';
import { CmsTrashConfirmDialog } from '@/shared/ui/cms/CmsTrashConfirmDialog';
import { sanitizeCmsErrorMessage } from '@/shared/ui/cms/errorUtils';
import { ProductsToolbar } from './ProductsToolbar';

const ProductsFormView = React.lazy(() => import('./ProductsFormView').then((m) => ({ default: m.ProductsFormView })));
import { ProductPreviewModal } from './ProductPreviewModal';
import { ProductActivityDrawer } from './ProductActivityDrawer';
import { ProductDuplicateModal, DuplicateConfig } from './ProductDuplicateModal';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { saveProductAction, setProductsFeaturedAction, setProductsPublishedAction, trashProductAction } from '@/features/products/server/actions';

import { useProductFilters, type SystemViewTab } from './useProductFilters';

interface ProductsManagerProps {
  workspaceLocale: CmsLocale;
  data?: ProductsModuleData;
  capabilities?: { create: boolean; edit: boolean; delete: boolean };
}

const toProductInput = (product: Partial<ProductItem>, published: boolean) => ({
  name: product.name || product.title || '', alias: product.alias || '', code: product.code || product.sku || '', other_languages1: product.other_languages1 || '',
  summary: product.summary || product.short_description || '', description: product.description || product.content_html || '', feature_details: product.feature_details || '', video: product.video || product.video_url || '', tawk_to: product.tawk_to || '',
  image: product.image || '', icon: product.icon || '', price: product.price || product.price_old || '', tags: product.tags || [], landing_page: product.landing_page || '', seo_title: product.seo_title || product.meta_title || '', seo_keyword: product.seo_keyword || product.meta_keywords || '', seo_description: product.seo_description || product.meta_description || '',
  file_catalogue: product.file_catalogue || '', file_price: product.file_price || '', link_catalogue: product.link_catalogue || '', file_driver_name: product.file_driver_name || '', file_driver: product.file_driver || '', link_driver: product.link_driver || '',
  downloads: Array.from({ length: 6 }, (_, index) => ({ name: String(product[`file_name${index + 1}` as keyof ProductItem] || ''), file: String(product[`file_download${index + 1}` as keyof ProductItem] || ''), link: String(product[`link_download${index + 1}` as keyof ProductItem] || '') })),
  categoryIds: (product.category_ids || (product.category_id ? [product.category_id] : [])).map(Number), applicationIds: (product.application || product.application_areas || []).map(Number), relatedProductIds: (product.products_relates || []).map(Number),
  manufactoryId: Number(product.manufactory || product.brand_id) || null, typeId: Number(product.types || product.product_type) || null,
  published, is_hot: Boolean(product.is_hot), teamview: Boolean(product.teamview), ordering: Number(product.ordering || 0),
});

export const ProductsManager: React.FC<ProductsManagerProps> = ({ data, workspaceLocale, capabilities = { create: false, edit: false, delete: false } }) => {
  const router = useRouter();
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

  // Table Density & Column Visibility
  const [density, setDensity] = useState<'normal' | 'compact'>('normal');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(defaultColumnVisibility);

  // Selected Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [trashTargets, setTrashTargets] = useState<ProductItem[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToPreview, setProductToPreview] = useState<ProductItem | null>(null);
  const [productForActivity, setProductForActivity] = useState<ProductItem | null>(null);
  const [productToDuplicate, setProductToDuplicate] = useState<ProductItem | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const persist = async (operation: Promise<unknown>, fallbackMsg = 'Không thể cập nhật dữ liệu sản phẩm.') => {
    try {
      await operation;
      return true;
    } catch (error) {
      const sanitized = sanitizeCmsErrorMessage(error, fallbackMsg);
      showToast(sanitized);
      throw new Error(sanitized);
    }
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Product Filters & Lookups Hook
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectedProductType,
    setSelectedProductType,
    selectedApplication,
    setSelectedApplication,
    handleSearchChange,
    handleCategoryChange,
    handleBrandChange,
    handleProductTypeChange,
    handleApplicationChange,
    handleResetFilters,
    isFilterActive,
    filteredProducts,
    getCategoryNames,
    getBrandName,
    getProductTypeName,
    getApplicationNames,
  } = useProductFilters({
    products,
    categories,
    brands,
    productTypes,
    applications,
    activeTab,
    onFilterChange: () => setCurrentPage(1),
  });

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
  const handleBatchChangeEditorialStatus = async (status: EditorialStatus) => {
    if (!capabilities.edit) return showToast('Bạn không có quyền cập nhật sản phẩm.');
    if (!await persist(setProductsPublishedAction(workspaceLocale, selectedIds, status === 'published'))) return;
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, editorial_status: status, published: status === 'published' } : p))
    );
    showToast(`Đã chuyển trạng thái sang "${status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}" cho ${selectedIds.length} sản phẩm!`);
    setSelectedIds([]);
  };

  const handleBatchToggleHot = async (isHot: boolean) => {
    if (!capabilities.edit) return showToast('Bạn không có quyền cập nhật sản phẩm.');
    const featuredOutsideSelection = products.filter((product) => product.is_hot && !selectedIds.includes(product.id)).length;
    if (isHot && featuredOutsideSelection + selectedIds.length > FEATURED_CONTENT_LIMITS.product) {
      showToast(`Chỉ được chọn tối đa ${FEATURED_CONTENT_LIMITS.product} sản phẩm nổi bật.`);
      return;
    }
    if (!await persist(setProductsFeaturedAction(workspaceLocale, selectedIds, isHot))) return;
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, is_hot: isHot } : p))
    );
    showToast(`Đã ${isHot ? 'đánh dấu tiêu biểu' : 'bỏ đánh dấu tiêu biểu'} cho ${selectedIds.length} sản phẩm!`);
    setSelectedIds([]);
  };

  const handleToggleFeatured = async (id: string) => {
    if (!capabilities.edit) return showToast('Bạn không có quyền cập nhật sản phẩm.');
    const target = products.find((product) => product.id === id);
    if (!target?.is_hot && products.filter((product) => product.is_hot).length >= FEATURED_CONTENT_LIMITS.product) {
      showToast(`Đã đủ ${FEATURED_CONTENT_LIMITS.product} sản phẩm nổi bật. Hãy bỏ chọn một sản phẩm khác trước.`);
      return;
    }
    if (!await persist(setProductsFeaturedAction(workspaceLocale, [id], !target?.is_hot))) return;
    setProducts((current) => current.map((product) => product.id === id ? { ...product, is_hot: !product.is_hot } : product));
    showToast(target?.is_hot ? 'Đã bỏ Sản phẩm nổi bật.' : 'Đã chọn Sản phẩm nổi bật.');
  };

  const handleBatchDelete = () => {
    if (!capabilities.delete) return showToast('Bạn không có quyền xóa sản phẩm.');
    const targets = products.filter((p) => selectedIds.includes(p.id));
    if (targets.length > 0) {
      setTrashTargets(targets);
    }
  };

  const handleConfirmDelete = async () => {
    if (!trashTargets || trashTargets.length === 0) return;
    if (!capabilities.delete) return showToast('Bạn không có quyền xóa sản phẩm.');
    setIsDeleting(true);
    try {
      const ids = trashTargets.map((item) => item.id);
      for (const id of ids) {
        await persist(trashProductAction(workspaceLocale, id), 'Không thể chuyển sản phẩm vào Thùng rác.');
      }
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      showToast(
        ids.length === 1
          ? `Đã đưa sản phẩm "${trashTargets[0].name || trashTargets[0].title}" vào Thùng rác.`
          : `Đã đưa ${ids.length} sản phẩm vào Thùng rác.`
      );
      setTrashTargets(null);
      router.refresh();
    } catch {
      // Handled and toasted in persist
    } finally {
      setIsDeleting(false);
    }
  };

  // Form Save Handler
  const handleSaveProductFromForm = async (
    productData: Partial<ProductItem>,
    actionType: 'draft' | 'publish'
  ) => {
    if (selectedProductForForm ? !capabilities.edit : !capabilities.create) return showToast('Bạn không có quyền lưu sản phẩm.');
    if (productData.is_hot && !selectedProductForForm?.is_hot && products.filter((product) => product.is_hot).length >= FEATURED_CONTENT_LIMITS.product) {
      showToast(`Chỉ được chọn tối đa ${FEATURED_CONTENT_LIMITS.product} sản phẩm nổi bật.`);
      return;
    }
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const editorialStatus: EditorialStatus = actionType === 'publish' ? 'published' : 'draft';
    if (!await persist(saveProductAction(workspaceLocale, selectedProductForForm?.id || null, toProductInput(productData, editorialStatus === 'published')))) return;
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
    router.refresh();
  };

  // Duplicate Confirmation Handler
  const handleConfirmDuplicate = async (config: DuplicateConfig) => {
    if (!productToDuplicate) return;
    if (!capabilities.create) return showToast('Bạn không có quyền tạo sản phẩm.');

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

    if (!await persist(saveProductAction(workspaceLocale, null, toProductInput(newProd, false)))) return;
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Đã nhân bản sản phẩm mới thành công!`);
    setProductToDuplicate(null);
    router.refresh();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-3 bg-slate-900 text-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {viewMode === 'form' ? (
        <React.Suspense
          fallback={(
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900" aria-busy="true">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-4 h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>
          )}
        >
          <ProductsFormView
            locale={workspaceLocale}
            product={selectedProductForForm}
            categories={categories}
            brands={brands}
            applications={applications}
            productTypes={productTypes}
            relatedProducts={products}
            owners={owners}
            featuredCount={products.filter((product) => product.id !== selectedProductForForm?.id && product.is_hot).length}
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
            brands={brands}
            applications={applications}
            productTypes={productTypes}
            onClose={() => setProductToPreview(null)}
          />
        </React.Suspense>
      ) : (
        <>

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
      <ProductsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedBrand={selectedBrand}
        onBrandChange={handleBrandChange}
        selectedProductType={selectedProductType}
        onProductTypeChange={handleProductTypeChange}
        selectedApplication={selectedApplication}
        onApplicationChange={handleApplicationChange}
        categories={categories}
        brands={brands}
        productTypes={productTypes}
        applications={applications}
        isFilterActive={isFilterActive}
        onResetFilters={handleResetFilters}
      />

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
                  const appNames = getApplicationNames(p);

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
                          {catNames.length > 0 ? (
                            <div className="flex items-center gap-1">
                              {catNames.slice(0, 2).map((cat, idx) => (
                                <span
                                  key={idx}
                                  title={cat}
                                  className="max-w-[110px] truncate px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg"
                                >
                                  {cat}
                                </span>
                              ))}
                              {catNames.length > 2 && (
                                <span
                                  title={catNames.slice(2).join(', ')}
                                  className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] rounded-md cursor-help shrink-0 shadow-2xs"
                                >
                                  +{catNames.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
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
                          {appNames.length > 0 ? (
                            <div className="flex items-center gap-1">
                              {appNames.slice(0, 2).map((app, idx) => (
                                <span
                                  key={idx}
                                  title={app}
                                  className="max-w-[100px] truncate px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-[10px] font-medium rounded"
                                >
                                  {app}
                                </span>
                              ))}
                              {appNames.length > 2 && (
                                <span
                                  title={appNames.slice(2).join(', ')}
                                  className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded cursor-help shrink-0 shadow-2xs"
                                >
                                  +{appNames.length - 2}
                                </span>
                              )}
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
                          <button type="button" onClick={() => handleToggleFeatured(p.id)} aria-pressed={Boolean(p.is_hot)} aria-label={`${p.is_hot ? 'Bỏ' : 'Đánh dấu'} sản phẩm nổi bật: ${prodName}`} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold transition-colors ${p.is_hot ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-800'}`}>
                            <Star className={`w-3 h-3 ${p.is_hot ? 'fill-current' : ''}`} />
                            {p.is_hot ? 'Nổi bật' : 'Không nổi bật'}
                          </button>
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
                            onClick={() => setTrashTargets([p])}
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

      <ProductPreviewModal
        isOpen={!!productToPreview}
        product={productToPreview}
        categories={categories}
        brands={brands}
        applications={applications}
        productTypes={productTypes}
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
        </>
      )}

      <CmsTrashConfirmDialog
        open={Boolean(trashTargets && trashTargets.length > 0)}
        itemName={
          trashTargets && trashTargets.length > 1
            ? `${trashTargets.length} sản phẩm đã chọn`
            : trashTargets?.[0]?.name || trashTargets?.[0]?.title || 'sản phẩm'
        }
        busy={isDeleting}
        onClose={() => setTrashTargets(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

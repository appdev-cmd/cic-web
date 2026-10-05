import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Eye,
  Globe,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import { CmsDeleteConfirmModal } from '@/shared/ui/cms/CmsDeleteConfirmModal';
import { ContentQualityPanel } from '../../components/ContentQualityPanel';
import { PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import type {
  CmsProductListItem,
  ProductBrand,
  ProductCategory,
  ProductItem,
  ProductOwnerOption,
} from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';
import type { AiProductDraftResult } from '@/features/ai-operator/types';
import { useProductForm } from './components/form/useProductForm';
import { ProductBasicSection } from './components/form/ProductBasicSection';
import { ProductClassificationSection } from './components/form/ProductClassificationSection';
import { ProductContentSection } from './components/form/ProductContentSection';
import { ProductFilesSection } from './components/form/ProductFilesSection';
import { ProductSidebarMedia } from './components/form/ProductSidebarMedia';
import { ProductSidebarSettings } from './components/form/ProductSidebarSettings';
import { ProductSidebarSeo } from './components/form/ProductSidebarSeo';

interface ProductsFormViewProps {
  locale: 'vi' | 'en';
  product: ProductItem | null;
  aiDraftResult?: AiProductDraftResult | null;
  categories: ProductCategory[];
  brands: ProductBrand[];
  applications: MasterApplicationItem[];
  productTypes: MasterProductTypeItem[];
  relatedProducts: CmsProductListItem[];
  owners: ProductOwnerOption[];
  featuredCount: number;
  onSave: (productData: Partial<ProductItem>, actionType: 'draft' | 'publish') => Promise<void> | void;
  onCancel: () => void;
  onOpenPreview: (productData: ProductItem) => void;
}

export const ProductsFormView: React.FC<ProductsFormViewProps> = ({
  locale,
  product,
  aiDraftResult,
  categories,
  brands,
  applications: applicationOptions,
  productTypes,
  relatedProducts,
  featuredCount,
  onSave,
  onCancel,
  onOpenPreview,
}) => {
  const {
    isTranslatingEn,
    enCreatedInfo,
    setEnCreatedInfo,
    outlineTarget,
    setOutlineTarget,
    name,
    setName,
    alias,
    setAlias,
    setManualAlias,
    code,
    setCode,
    otherLanguages1,
    setOtherLanguages1,
    image,
    setImage,
    icon,
    setIcon,
    categoryIds,
    setCategoryIds,
    manufactory,
    setManufactory,
    applications,
    setApplications,
    types,
    setTypes,
    productsRelates,
    setProductsRelates,
    summary,
    setSummary,
    description,
    setDescription,
    featureDetails,
    setFeatureDetails,
    video,
    setVideo,
    tagsText,
    setTagsText,
    priceOld,
    setPriceOld,
    isHot,
    setIsHot,
    ordering,
    setOrdering,
    seoTitle,
    setSeoTitle,
    seoKeyword,
    setSeoKeyword,
    seoDescription,
    setSeoDescription,
    downloads,
    updateDownload,
    fileCatalogue,
    setFileCatalogue,
    filePrice,
    setFilePrice,
    linkCatalogue,
    setLinkCatalogue,
    fileDriverName,
    setFileDriverName,
    fileDriver,
    setFileDriver,
    linkDriver,
    setLinkDriver,
    gallery,
    setGallery,
    mediaTarget,
    setMediaTarget,
    isSubmitting,
    submittingAction,
    formError,
    isAutoFilling,
    hasAiAutoFilled,
    isAnchorsReady,
    handleAiSection2,
    handleSmartAutoFill,
    handleUndoAutoFill,
    handleAiSummary,
    handleAiSeo,
    handleAiTags,
    handleAiOverviewOutline,
    handleAiFeaturesOutline,
    executeAiOverviewOutline,
    executeAiFeaturesOutline,
    handleTranslateToEn,
    payload,
    save,
    handleFieldFocus,
    isTouched,
  } = useProductForm({
    locale,
    product,
    aiDraftResult,
    categories,
    brands,
    applications: applicationOptions,
    productTypes,
    relatedProducts,
    featuredCount,
    onSave,
  });

  return (
    <div className="space-y-5 pb-16">
      <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-bold text-orange-600">SẢN PHẨM</p>
            <h1 className="font-black dark:text-white">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {locale === 'vi' && (
            <CmsButton
              variant="secondary"
              size="sm"
              disabled={isSubmitting || isTranslatingEn}
              loading={isTranslatingEn}
              loadingText="Đang dịch & tạo bản EN..."
              onClick={handleTranslateToEn}
              leadingIcon={<Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
              title="Dịch toàn bộ bài viết, tính năng & SEO và tạo bản nháp sang Tiếng Anh"
            >
              Dịch sang bản Tiếng Anh
            </CmsButton>
          )}
          <CmsButton
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => onOpenPreview({ ...(product || {}), ...payload() } as ProductItem)}
            leadingIcon={<Eye className="h-4 w-4" />}
            title="Xem trước ngay giao diện website với dữ liệu đang nhập (không cần lưu nháp)"
          >
            Xem trước
          </CmsButton>
          <CmsButton
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            loading={isSubmitting && submittingAction === 'draft'}
            loadingText="Đang lưu..."
            onClick={() => void save('draft')}
            leadingIcon={<Save className="h-4 w-4" />}
          >
            Lưu nháp
          </CmsButton>
          <CmsButton
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            loading={isSubmitting && submittingAction === 'publish'}
            loadingText="Đang xuất bản..."
            onClick={() => void save('publish')}
            leadingIcon={<Send className="h-4 w-4" />}
          >
            Xuất bản
          </CmsButton>
        </div>
      </header>

      {/* Thông báo khi vừa dịch & tạo bản Tiếng Anh thành công */}
      {enCreatedInfo && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 dark:border-emerald-900/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Bản nháp Tiếng Anh đã sẵn sàng
              </p>
              <h4 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-50 truncate">
                {enCreatedInfo.enName}
              </h4>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-mono mt-0.5">
                {enCreatedInfo.enUrl}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('cic_cms_workspace_locale', 'en');
                localStorage.setItem('cms_workspace_locale', 'en');
                document.cookie = 'cms_workspace_locale=en; path=/; max-age=31536000; SameSite=Lax';
                window.location.reload();
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Chuyển sang xem bản Tiếng Anh
            </button>
            <button
              type="button"
              onClick={() => setEnCreatedInfo(null)}
              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Thông báo hoàn tác khi vừa tự động điền */}
      {hasAiAutoFilled && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/40 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                ✦ Hệ thống: Đã tự động điền Định danh kỹ thuật, Tóm tắt, SEO và Thẻ Tags.
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-2 hidden sm:inline">
                (Nội dung bài viết và hình ảnh của bạn được giữ nguyên 100%)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUndoAutoFill}
            className="px-3 py-1.5 font-bold rounded-lg bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Hoàn tác về ban đầu
          </button>
        </div>
      )}

      {formError && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0 flex-1 font-semibold">{formError}</div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(310px,1fr)]">
        <main className="space-y-5">
          <ProductBasicSection
            name={name}
            setName={setName}
            manufactory={manufactory}
            setManufactory={setManufactory}
            categoryIds={categoryIds}
            setCategoryIds={setCategoryIds}
            brands={brands}
            categories={categories}
            isAnchorsReady={isAnchorsReady}
            isAutoFilling={isAutoFilling}
            onSmartAutoFill={handleSmartAutoFill}
          />

          <ProductClassificationSection
            alias={alias}
            setAlias={setAlias}
            setManualAlias={setManualAlias}
            code={code}
            setCode={setCode}
            otherLanguages1={otherLanguages1}
            setOtherLanguages1={setOtherLanguages1}
            types={types}
            setTypes={setTypes}
            applications={applications}
            setApplications={setApplications}
            productsRelates={productsRelates}
            setProductsRelates={setProductsRelates}
            productTypes={productTypes}
            applicationOptions={applicationOptions}
            relatedProducts={relatedProducts}
            currentProductId={product?.id}
            onAiSection2={handleAiSection2}
          />

          <ProductContentSection
            summary={summary}
            setSummary={setSummary}
            description={description}
            setDescription={setDescription}
            featureDetails={featureDetails}
            setFeatureDetails={setFeatureDetails}
            video={video}
            setVideo={setVideo}
            onAiSummary={handleAiSummary}
            onAiOverviewOutline={handleAiOverviewOutline}
            onAiFeaturesOutline={handleAiFeaturesOutline}
          />

          <ProductFilesSection
            fileCatalogue={fileCatalogue}
            setFileCatalogue={setFileCatalogue}
            filePrice={filePrice}
            setFilePrice={setFilePrice}
            linkCatalogue={linkCatalogue}
            setLinkCatalogue={setLinkCatalogue}
            fileDriverName={fileDriverName}
            setFileDriverName={setFileDriverName}
            fileDriver={fileDriver}
            setFileDriver={setFileDriver}
            linkDriver={linkDriver}
            setLinkDriver={setLinkDriver}
            downloads={downloads}
            updateDownload={updateDownload}
          />
        </main>

        <aside className="space-y-5">
          <ContentQualityPanel
            title="Trạng thái xuất bản"
            onFieldFocus={handleFieldFocus}
            checks={[
              { label: 'Tên sản phẩm', passed: Boolean(name.trim()), required: true, group: 'content', fieldKey: 'name' },
              { label: 'Có tóm tắt (ít nhất 20 ký tự)', passed: summary.trim().length >= 20, required: true, group: 'content', fieldKey: 'summary' },
              {
                label: 'Nội dung hoặc thông số chi tiết',
                passed:
                  description.replace(/<[^>]+>/g, '').trim().length >= 30 ||
                  featureDetails.replace(/<[^>]+>/g, '').trim().length >= 30,
                required: true,
                group: 'content',
                fieldKey: 'description',
              },
              { label: 'Đã chọn Hãng sản xuất', passed: Boolean(manufactory), required: true, group: 'classification', fieldKey: 'manufactory' },
              { label: 'Đã chọn Lĩnh vực / Danh mục', passed: categoryIds.length > 0, required: true, group: 'classification', fieldKey: 'category_ids' },
              { label: 'Đường dẫn tĩnh (Slug) chuẩn', passed: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias), required: true, group: 'seo', fieldKey: 'alias' },
              { label: 'SEO Title (30 - 65 ký tự)', passed: seoTitle.trim().length >= 30 && seoTitle.trim().length <= 65, required: false, group: 'seo', fieldKey: 'seo_title' },
              { label: 'SEO Description (120 - 160 ký tự)', passed: seoDescription.trim().length >= 120 && seoDescription.trim().length <= 160, required: false, group: 'seo', fieldKey: 'seo_description' },
              { label: 'Ảnh đại diện sản phẩm', passed: Boolean(image), required: false, group: 'media', fieldKey: 'image' },
              { label: 'Thông tin Giá bán', passed: Boolean(priceOld.trim()), required: true, group: 'business', fieldKey: 'price' },
            ]}
          />

          <ProductSidebarMedia
            image={image}
            setImage={setImage}
            icon={icon}
            setIcon={setIcon}
            gallery={gallery}
            setGallery={setGallery}
            tagsText={tagsText}
            setTagsText={setTagsText}
            onSelectMedia={setMediaTarget}
            onAiTags={handleAiTags}
          />

          <ProductSidebarSettings
            priceOld={priceOld}
            setPriceOld={setPriceOld}
            isHot={isHot}
            setIsHot={setIsHot}
            ordering={ordering}
            setOrdering={setOrdering}
            featuredCount={featuredCount}
            isTouched={isTouched}
          />

          <ProductSidebarSeo
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoKeyword={seoKeyword}
            setSeoKeyword={setSeoKeyword}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            onAiSeo={handleAiSeo}
            isTouched={isTouched}
          />
        </aside>
      </div>

      {mediaTarget && (
        <PageMediaPickerModal
          locale={locale}
          returnValue="url"
          currentId={mediaTarget === 'image' ? image : mediaTarget === 'icon' ? icon : ''}
          onClose={() => setMediaTarget(null)}
          onConfirm={(mediaUrl) => {
            if (mediaTarget === 'image') setImage(mediaUrl);
            else if (mediaTarget === 'icon') setIcon(mediaUrl);
            else if (mediaTarget === 'gallery_add') setGallery((prev) => [...prev, mediaUrl]);
            setMediaTarget(null);
          }}
        />
      )}

      <CmsDeleteConfirmModal
        isOpen={Boolean(outlineTarget)}
        title="Chèn thêm khung dàn bài mẫu"
        itemName={outlineTarget === 'overview' ? 'Mục Tổng quan' : 'Mục Chi tiết tính năng'}
        description={
          outlineTarget === 'overview'
            ? 'Mục Tổng quan đã có nội dung và hình ảnh. Bạn có muốn chèn thêm khung dàn bài mẫu vào cuối bài không?'
            : 'Mục Chi tiết tính năng đã có nội dung. Bạn có muốn chèn thêm khung dàn bài mẫu vào cuối bài không?'
        }
        confirmLabel="Chèn thêm vào cuối"
        cancelLabel="Hủy bỏ"
        onClose={() => setOutlineTarget(null)}
        onConfirm={async () => {
          const target = outlineTarget;
          setOutlineTarget(null);
          if (target === 'overview') await executeAiOverviewOutline();
          else if (target === 'features') await executeAiFeaturesOutline();
        }}
      />
    </div>
  );
};

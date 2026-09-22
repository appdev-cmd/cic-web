import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Eye, FileText, Image as ImageIcon, Link2, Package, Save, Search, Send, Star, FileDown, ShieldCheck, Tag, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import { ContentQualityPanel } from '../../components/ContentQualityPanel';
import { SearchableMultiSelect, SearchableSelect } from '../../components/SearchableSelect';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import { ProductFileInput } from './ProductFileInput';
import type { CmsProductListItem, ProductBrand, ProductCategory, ProductItem, ProductOwnerOption } from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';
import { FEATURED_CONTENT_LIMITS } from '../featuredContentPolicy';
import type { AiProductDraftResult, FieldChangeItem, FieldOrigin, ProductFormViewMode } from '@/features/ai-operator/types';
import { AiChangesDiffModal } from './components/AiChangesDiffModal';
import { AiActionsDropdown } from './components/AiActionsDropdown';

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

interface LegacyDownload { name: string; file: string; link: string }
const slugify = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';

export const ProductsFormView: React.FC<ProductsFormViewProps> = ({ locale, product, aiDraftResult, categories, brands, applications: applicationOptions, productTypes, relatedProducts, featuredCount, onSave, onCancel, onOpenPreview }) => {
  const [formMode, setFormMode] = useState<ProductFormViewMode>(aiDraftResult ? 'needs_attention' : 'all');
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [aiChanges, setAiChanges] = useState<FieldChangeItem[]>(aiDraftResult?.changes || []);
  const [fieldOrigins, setFieldOrigins] = useState<Record<string, FieldOrigin>>(aiDraftResult?.fieldOrigins || {});
  const [aiBannerDismissed, setAiBannerDismissed] = useState(false);

  const [name, setName] = useState(product?.name || product?.title || '');
  const [alias, setAlias] = useState(product?.alias || '');
  const [manualAlias, setManualAlias] = useState(false);
  const [code, setCode] = useState(product?.code || product?.sku || '');
  const [otherLanguages1, setOtherLanguages1] = useState(product?.other_languages1 || '');
  const [image, setImage] = useState(product?.image || '');
  const [icon, setIcon] = useState(product?.icon || '');
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.category_ids || (product?.category_id ? [product.category_id] : []));
  const [manufactory, setManufactory] = useState(product?.manufactory || product?.brand_id || '');
  const [applications, setApplications] = useState<string[]>(product?.application || []);
  const [types, setTypes] = useState(product?.types || product?.product_type || '');
  const [productsRelates, setProductsRelates] = useState<string[]>(product?.products_relates || []);
  const [summary, setSummary] = useState(product?.summary || product?.short_description || '');
  const [description, setDescription] = useState(product?.description || product?.content_html || '');
  const [featureDetails, setFeatureDetails] = useState(product?.feature_details || '');
  const [video, setVideo] = useState(product?.video || product?.video_url || '');
  const [tawkTo, setTawkTo] = useState(product?.tawk_to || '');
  const [tagsText, setTagsText] = useState((product?.tags || []).join(', '));
  const [priceOld, setPriceOld] = useState(product?.price || product?.price_old || '');
  const [isHot, setIsHot] = useState(product?.is_hot ?? false);
  const [teamview, setTeamview] = useState(product?.teamview ?? false);
  const [ordering, setOrdering] = useState(product?.ordering || 1);
  const [landingPage, setLandingPage] = useState(product?.landing_page || '');
  const [seoTitle, setSeoTitle] = useState(product?.seo_title || product?.meta_title || '');
  const [seoKeyword, setSeoKeyword] = useState(product?.seo_keyword || product?.meta_keywords || '');
  const [seoDescription, setSeoDescription] = useState(product?.seo_description || product?.meta_description || '');
  const [fileCatalogue, setFileCatalogue] = useState(product?.file_catalogue || '');
  const [filePrice, setFilePrice] = useState(product?.file_price || '');
  const [linkCatalogue, setLinkCatalogue] = useState(product?.link_catalogue || '');
  const [fileDriverName, setFileDriverName] = useState(product?.file_driver_name || '');
  const [fileDriver, setFileDriver] = useState(product?.file_driver || '');
  const [linkDriver, setLinkDriver] = useState(product?.link_driver || '');
  const [downloads, setDownloads] = useState<LegacyDownload[]>(Array.from({ length: 6 }, (_, index) => ({ name: product?.[`file_name${index + 1}` as keyof ProductItem] as string || '', file: product?.[`file_download${index + 1}` as keyof ProductItem] as string || '', link: product?.[`link_download${index + 1}` as keyof ProductItem] as string || '' })));
  const updateDownload = (index: number, key: keyof LegacyDownload, val: string) => {
    setDownloads((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: val };
      return next;
    });
  };
  const [mediaTarget, setMediaTarget] = useState<'image' | 'icon' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<'draft' | 'publish' | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => { if (!manualAlias) setAlias(slugify(name)); }, [name, manualAlias]);
  const ids = (text: string) => text.split(',').map((item) => item.trim()).filter(Boolean);
  const payload = (): Partial<ProductItem> => {
    const base: Partial<ProductItem> = {
      name, alias: alias || slugify(name), code, other_languages1: otherLanguages1, image, icon,
      category_ids: categoryIds, category_id: categoryIds.join(','), manufactory,
      application: applications, types, products_relates: productsRelates, summary,
      description, feature_details: featureDetails, video, tawk_to: tawkTo, tags: ids(tagsText),
      price_old: priceOld, price: priceOld, is_hot: isHot, teamview, ordering: Number(ordering) || 1,
      landing_page: landingPage, seo_title: seoTitle, seo_keyword: seoKeyword, seo_description: seoDescription,
      file_catalogue: fileCatalogue, file_price: filePrice, link_catalogue: linkCatalogue,
      file_driver_name: fileDriverName, file_driver: fileDriver, link_driver: linkDriver,
    };
    downloads.forEach((item, index) => { Object.assign(base, { [`file_name${index + 1}`]: item.name, [`file_download${index + 1}`]: item.file, [`link_download${index + 1}`]: item.link }); });
    return base;
  };
  const save = async (action: 'draft' | 'publish') => {
    setFormError(null);
    if (!name.trim() || categoryIds.length === 0) {
      setFormError('Vui lòng nhập tên và chọn ít nhất một lĩnh vực.');
      return;
    }
    if (isHot && !product?.is_hot && featuredCount >= FEATURED_CONTENT_LIMITS.product) {
      setFormError(`Chỉ được chọn tối đa ${FEATURED_CONTENT_LIMITS.product} sản phẩm nổi bật.`);
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmittingAction(action);
      await onSave(payload(), action);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };
  const handleRevertField = (fieldName: string) => {
    switch (fieldName) {
      case 'name': setName(product?.name || ''); break;
      case 'alias': setAlias(product?.alias || ''); break;
      case 'code': setCode(product?.code || ''); break;
      case 'summary': setSummary(product?.summary || ''); break;
      case 'description': setDescription(product?.description || ''); break;
      case 'feature_details': setFeatureDetails(product?.feature_details || ''); break;
      case 'seo_title': setSeoTitle(product?.seo_title || ''); break;
      case 'seo_description': setSeoDescription(product?.seo_description || ''); break;
      case 'seo_keyword': setSeoKeyword(product?.seo_keyword || ''); break;
      case 'tags': setTagsText((product?.tags || []).join(', ')); break;
      case 'manufactory': setManufactory(product?.manufactory || ''); break;
      case 'category_ids': setCategoryIds(product?.category_ids || []); break;
      default: break;
    }
    setAiChanges((prev) => prev.filter((c) => c.field !== fieldName));
    setFieldOrigins((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleRevertAll = () => {
    setName(product?.name || '');
    setAlias(product?.alias || '');
    setCode(product?.code || '');
    setSummary(product?.summary || '');
    setDescription(product?.description || '');
    setFeatureDetails(product?.feature_details || '');
    setSeoTitle(product?.seo_title || '');
    setSeoDescription(product?.seo_description || '');
    setSeoKeyword(product?.seo_keyword || '');
    setTagsText((product?.tags || []).join(', '));
    setManufactory(product?.manufactory || '');
    setCategoryIds(product?.category_ids || []);
    setAiChanges([]);
    setFieldOrigins({});
    setIsDiffOpen(false);
  };

  const handleApplyAiUpdates = (updates: Record<string, unknown>, explanation: string) => {
    if (updates.name !== undefined) setName(String(updates.name));
    if (updates.summary !== undefined) setSummary(String(updates.summary));
    if (updates.description !== undefined) setDescription(String(updates.description));
    if (updates.seo_title !== undefined) setSeoTitle(String(updates.seo_title));
    if (updates.seo_description !== undefined) setSeoDescription(String(updates.seo_description));
    if (updates.seo_keyword !== undefined) setSeoKeyword(String(updates.seo_keyword));
    if (updates.manufactory !== undefined) setManufactory(String(updates.manufactory));
    setFormError(null);
  };

  const handleFieldFocus = (fieldKey: string) => {
    setFormMode('all');
    setTimeout(() => {
      const el = document.getElementById(`field-${fieldKey}`) || document.querySelector(`[name="${fieldKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).focus();
      }
    }, 100);
  };

  const isTouched = (fName: string) => Boolean(fieldOrigins[fName]);

  return (
    <div className="space-y-5 pb-16">
      <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800 disabled:opacity-50">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-bold text-orange-600">SẢN PHẨM</p>
            <h1 className="font-black dark:text-white">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AiActionsDropdown
            currentProduct={payload()}
            workspaceLocale={locale}
            onApplyUpdates={handleApplyAiUpdates}
          />
          <CmsButton
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => onOpenPreview({ ...(product || {}), ...payload() } as ProductItem)}
            leadingIcon={<Eye className="h-4 w-4" />}
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

      {/* AI Changes Notification Banner */}
      {aiChanges.length > 0 && !aiBannerDismissed && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-800/80 bg-orange-50/80 dark:bg-orange-950/30 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                ✦ Smart Operator: Đã hoàn thiện {aiChanges.length} mục dựa trên dữ liệu CIC
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-2 hidden sm:inline">
                (Các trường được viền cam bên trái)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDiffOpen(true)}
              className="px-2.5 py-1 font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              Xem chi tiết thay đổi
            </button>
            <button
              type="button"
              onClick={handleRevertAll}
              className="px-2.5 py-1 font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              Hoàn tác AI
            </button>
            <button
              type="button"
              onClick={() => setAiBannerDismissed(true)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer"
              title="Ẩn thông báo"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Form View Modes: [Cần xử lý] | [Đề xuất AI] | [Tất cả] */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1.5">Chế độ xem:</span>
          <button
            type="button"
            onClick={() => setFormMode('needs_attention')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              formMode === 'needs_attention'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Cần xử lý</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-200/70 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
              {aiDraftResult?.needsAttention?.length || (priceOld ? 0 : 1)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFormMode('ai_suggestions')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              formMode === 'ai_suggestions'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Đề xuất AI</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200/70 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
              {aiDraftResult?.suggestedCount || 2}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFormMode('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              formMode === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả trường
          </button>
        </div>
      </div>

      {formError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0 flex-1 font-semibold">{formError}</div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(310px,1fr)]">
        <main className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Package className="h-5 w-5 text-orange-600" />Thông tin sản phẩm</div><div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><label className={labelClass}>Tên sản phẩm *</label><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></div><div><label className={labelClass}>Alias</label><input className={inputClass} value={alias} onChange={(e) => { setManualAlias(true); setAlias(e.target.value); }} /></div><div><label className={labelClass}>Biệt danh</label><input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} /></div><div><label className={labelClass}>URL ngôn ngữ khác</label><input className={inputClass} value={otherLanguages1} onChange={(e) => setOtherLanguages1(e.target.value)} /></div><div><label className={labelClass}>Hãng sản xuất</label><SearchableSelect options={brands.map((item) => ({ id: item.id, label: item.name }))} selectedId={manufactory} onChange={setManufactory} /></div><div><label className={labelClass}>Loại sản phẩm</label><SearchableSelect options={productTypes.filter((item) => item.status === 'active').map((item) => ({ id: item.id, label: item.name }))} selectedId={types} onChange={setTypes} /></div><div className="md:col-span-2"><label className={labelClass}>Lĩnh vực *</label><SearchableMultiSelect options={categories.map((item) => ({ id: item.id, label: item.name }))} selectedIds={categoryIds} onChange={setCategoryIds} /></div><div className="md:col-span-2"><label className={labelClass}>Ứng dụng</label><SearchableMultiSelect options={applicationOptions.filter((item) => item.status === 'active').map((item) => ({ id: item.id, label: item.name }))} selectedIds={applications} onChange={setApplications} /></div><div className="md:col-span-2"><label className={labelClass}>Sản phẩm liên quan</label><SearchableMultiSelect options={relatedProducts.filter((item) => item.id !== product?.id).map((item) => ({ id: item.id, label: item.name || item.title }))} selectedIds={productsRelates} onChange={setProductsRelates} /></div><div className="md:col-span-2"><label className={labelClass}>Tóm tắt</label><textarea rows={4} className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Tổng quan</div><RichTextEditor value={description} onChange={setDescription} minHeight="320px" allowedEmbeds={['cta', 'form']} /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Chi tiết tính năng</div><RichTextEditor value={featureDetails} onChange={setFeatureDetails} minHeight="300px" allowedEmbeds={['cta', 'form']} /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3 flex items-center gap-2 font-black dark:text-white"><FileText className="h-5 w-5 text-orange-600" />Video</div><RichTextEditor value={video} onChange={setVideo} minHeight="260px" /></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
          <Link2 className="h-5 w-5 text-orange-600" />
          Tệp sản phẩm & Tài liệu đính kèm
        </div>
        <div className="space-y-6">
          {/* File báo giá (Catalog / Price) */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
              <FileDown className="w-4 h-4" />
              File báo giá & Catalogue
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className={labelClass}>Tên file báo giá / tiêu đề</label>
                <input 
                  className={inputClass} 
                  value={fileCatalogue} 
                  onChange={(e) => setFileCatalogue(e.target.value)} 
                  placeholder="VD: Báo giá AutoCAD 2026..." 
                />
              </div>
              <div>
                <ProductFileInput
                  label="Chọn tệp báo giá"
                  value={filePrice}
                  onChange={setFilePrice}
                  onAutoFillName={(autoName) => {
                    if (!fileCatalogue) setFileCatalogue(autoName);
                  }}
                  placeholder="Chọn file báo giá từ máy..."
                />
              </div>
              <div>
                <label className={labelClass}>Link báo giá (URL trực tuyến)</label>
                <input 
                  className={inputClass} 
                  value={linkCatalogue} 
                  onChange={(e) => setLinkCatalogue(e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
            </div>
          </div>

          {/* File khóa cứng (Driver / Dongle) */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              File Driver & Khóa cứng (Dongle)
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className={labelClass}>Tên file khóa cứng / driver</label>
                <input 
                  className={inputClass} 
                  value={fileDriverName} 
                  onChange={(e) => setFileDriverName(e.target.value)} 
                  placeholder="VD: Driver Sentinel HASP..." 
                />
              </div>
              <div>
                <ProductFileInput
                  label="Chọn tệp Driver / Khóa cứng"
                  value={fileDriver}
                  onChange={setFileDriver}
                  onAutoFillName={(autoName) => {
                    if (!fileDriverName) setFileDriverName(autoName);
                  }}
                  placeholder="Chọn file driver từ máy..."
                />
              </div>
              <div>
                <label className={labelClass}>Link khóa cứng (URL trực tuyến)</label>
                <input 
                  className={inputClass} 
                  value={linkDriver} 
                  onChange={(e) => setLinkDriver(e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
            </div>
          </div>

          {/* Các tệp tải về 1 - 6 */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Danh sách tệp tải về bổ sung (Tối đa 6 tệp)
            </div>
            {downloads.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-slate-200 p-3.5 md:grid-cols-3 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-2xs">
                <div>
                  <label className={labelClass}>Ghi chú / Tên tệp {index + 1}</label>
                  <input 
                    className={inputClass} 
                    value={item.name} 
                    onChange={(e) => updateDownload(index, 'name', e.target.value)} 
                    placeholder={`Tên tài liệu / phần mềm ${index + 1}...`}
                  />
                </div>
                <div>
                  <ProductFileInput
                    label={`Chọn tệp đính kèm ${index + 1}`}
                    value={item.file}
                    onChange={(val) => updateDownload(index, 'file', val)}
                    onAutoFillName={(autoName) => {
                      if (!item.name) updateDownload(index, 'name', autoName);
                    }}
                    placeholder={`Chọn tệp ${index + 1} từ máy...`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Link tải trực tuyến {index + 1}</label>
                  <input 
                    className={inputClass} 
                    value={item.link} 
                    onChange={(e) => updateDownload(index, 'link', e.target.value)} 
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main><aside className="space-y-5">
      <ContentQualityPanel
        title="Trạng thái xuất bản"
        onFieldFocus={handleFieldFocus}
        checks={[
          { label: 'Tên sản phẩm', passed: Boolean(name.trim()), required: true, group: 'content', fieldKey: 'name' },
          { label: 'Có tóm tắt (ít nhất 20 ký tự)', passed: summary.trim().length >= 20, required: true, group: 'content', fieldKey: 'summary' },
          { label: 'Nội dung hoặc thông số chi tiết', passed: description.replace(/<[^>]+>/g, '').trim().length >= 30 || featureDetails.replace(/<[^>]+>/g, '').trim().length >= 30, required: true, group: 'content', fieldKey: 'description' },
          { label: 'Đã chọn Hãng sản xuất', passed: Boolean(manufactory), required: true, group: 'classification', fieldKey: 'manufactory' },
          { label: 'Đã chọn Lĩnh vực / Danh mục', passed: categoryIds.length > 0, required: true, group: 'classification', fieldKey: 'category_ids' },
          { label: 'Đường dẫn tĩnh (Slug) chuẩn', passed: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias), required: true, group: 'seo', fieldKey: 'alias' },
          { label: 'SEO Title (30 - 65 ký tự)', passed: seoTitle.trim().length >= 30 && seoTitle.trim().length <= 65, required: false, group: 'seo', fieldKey: 'seo_title' },
          { label: 'SEO Description (120 - 160 ký tự)', passed: seoDescription.trim().length >= 120 && seoDescription.trim().length <= 160, required: false, group: 'seo', fieldKey: 'seo_description' },
          { label: 'Ảnh đại diện sản phẩm', passed: Boolean(image), required: false, group: 'media', fieldKey: 'image' },
          { label: 'Thông tin Giá bán', passed: Boolean(priceOld.trim()), required: true, group: 'business', fieldKey: 'price' },
        ]}
      />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 font-black dark:text-white"><ImageIcon className="h-5 w-5 text-orange-600" />Media</div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Ảnh sản phẩm</label>
            {image && <img src={findPageBuilderImage(image)?.thumbnail_url ?? findPageBuilderImage(image)?.url ?? image} alt="" className="mb-2 aspect-video w-full rounded-xl object-cover" />}
            <button type="button" onClick={() => setMediaTarget('image')} className="w-full rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600">Chọn hoặc tải ảnh sản phẩm</button>
          </div>
          <div>
            <label className={labelClass}>Icon</label>
            {icon && <img src={findPageBuilderImage(icon)?.thumbnail_url ?? findPageBuilderImage(icon)?.url ?? icon} alt="" className="mb-2 h-20 w-20 rounded-xl object-contain" />}
            <button type="button" onClick={() => setMediaTarget('icon')} className="w-full rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600">Chọn hoặc tải icon</button>
          </div>
          <div><label className={labelClass}>Tags</label><textarea rows={3} className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} /></div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Star className="h-5 w-5 text-orange-600" />Hiển thị</div><div className="space-y-4"><div><label className={labelClass}>Giá</label><input id="field-price" className={`${inputClass} ${isTouched('price') ? 'border-l-4 border-l-orange-500' : ''}`} value={priceOld} onChange={(e) => setPriceOld(e.target.value)} /></div><label className="flex items-start justify-between gap-4 text-sm font-semibold dark:text-slate-200"><span>Sản phẩm nổi bật <span className="font-normal text-slate-400">({featuredCount + Number(isHot)}/{FEATURED_CONTENT_LIMITS.product})</span><span className="mt-0.5 block text-[11px] font-normal text-slate-500">Dự phòng cho section Sản phẩm trong tương lai; không dùng cho Hệ sinh thái Công nghệ CIC.</span></span><input type="checkbox" checked={isHot} disabled={!isHot && featuredCount >= FEATURED_CONTENT_LIMITS.product} onChange={(e) => setIsHot(e.target.checked)} /></label><label className="flex items-center justify-between text-sm font-semibold dark:text-slate-200"><span>Link TeamViewer</span><input type="checkbox" checked={teamview} onChange={(e) => setTeamview(e.target.checked)} /></label><div><label className={labelClass}>Thứ tự</label><input type="number" className={inputClass} value={ordering} onChange={(e) => setOrdering(Number(e.target.value))} /></div><div><label className={labelClass}>Landing page</label><input className={inputClass} value={landingPage} onChange={(e) => setLandingPage(e.target.value)} /></div></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Search className="h-5 w-5 text-orange-600" />SEO</div><div className="space-y-4"><div><label className={labelClass}>SEO title</label><input id="field-seo_title" className={`${inputClass} ${isTouched('seo_title') ? 'border-l-4 border-l-orange-500' : ''}`} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div><div><label className={labelClass}>SEO keyword</label><input className={inputClass} value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} /></div><div><label className={labelClass}>SEO description</label><textarea id="field-seo_description" rows={4} className={`${inputClass} ${isTouched('seo_description') ? 'border-l-4 border-l-orange-500' : ''}`} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></div><div><label className={labelClass}>Tawk.to</label><textarea rows={3} className={inputClass} value={tawkTo} onChange={(e) => setTawkTo(e.target.value)} /></div></div></section>
    </aside></div>
    {mediaTarget && <PageMediaPickerModal locale={locale} returnValue="url" currentId={mediaTarget === 'image' ? image : icon} onClose={() => setMediaTarget(null)} onConfirm={(mediaUrl) => mediaTarget === 'image' ? setImage(mediaUrl) : setIcon(mediaUrl)} />}

    <AiChangesDiffModal
      isOpen={isDiffOpen}
      onClose={() => setIsDiffOpen(false)}
      changes={aiChanges}
      onRevertField={handleRevertField}
      onRevertAll={handleRevertAll}
    />
  </div>
  );
};

import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Eye, FileText, Image as ImageIcon, Link2, Package, Save, Search, Send, Star, FileDown, ShieldCheck, Tag, AlertCircle, Sparkles, RotateCcw, Plus, Trash2, Globe, ExternalLink, X, Video } from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import { CmsDeleteConfirmModal } from '@/shared/ui/cms/CmsDeleteConfirmModal';
import { ContentQualityPanel } from '../../components/ContentQualityPanel';
import { SearchableMultiSelect, SearchableSelect } from '../../components/SearchableSelect';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import { ProductFileInput } from './ProductFileInput';
import type { CmsProductListItem, ProductBrand, ProductCategory, ProductItem, ProductOwnerOption } from './types';
import type { MasterApplicationItem, MasterProductTypeItem } from '../product_settings/types';
import { FEATURED_CONTENT_LIMITS } from '../featuredContentPolicy';
import type { AiProductDraftResult, FieldChangeItem, FieldOrigin, ProductFormViewMode } from '@/features/ai-operator/types';
import { useCmsToast } from '@/cms/context/CmsToastContext';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import {
  generateSeoAction,
  generateSummaryAction,
  extractTagsAction,
  generateOutlineAction,
  classifyProductTaxonomyAction,
} from '@/features/ai-operator/server/shared-actions';
import { translateAndCreateEnProductAction } from '@/features/products/server/actions';

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
function toYoutubeEmbedUrl(urlOrIframe: string): string {
  if (!urlOrIframe) return '';
  const matchIframe = urlOrIframe.match(/src=["']([^"']+)["']/i);
  const raw = matchIframe ? matchIframe[1] : urlOrIframe.trim();
  const ytMatch = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : (raw.startsWith('http') ? raw : '');
}
const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';

export const ProductsFormView: React.FC<ProductsFormViewProps> = ({ locale, product, aiDraftResult, categories, brands, applications: applicationOptions, productTypes, relatedProducts, featuredCount, onSave, onCancel, onOpenPreview }) => {
  const [formMode, setFormMode] = useState<ProductFormViewMode>('all');
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [aiChanges, setAiChanges] = useState<FieldChangeItem[]>(aiDraftResult?.changes || []);
  const [fieldOrigins, setFieldOrigins] = useState<Record<string, FieldOrigin>>(aiDraftResult?.fieldOrigins || {});
  const [aiBannerDismissed, setAiBannerDismissed] = useState(false);
  const [isTranslatingEn, setIsTranslatingEn] = useState(false);
  const [enCreatedInfo, setEnCreatedInfo] = useState<{ enName: string; enUrl: string } | null>(null);
  const [outlineTarget, setOutlineTarget] = useState<'overview' | 'features' | null>(null);

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
  const [tagsText, setTagsText] = useState((product?.tags || []).join(', '));
  const [priceOld, setPriceOld] = useState(() => {
    const p = (product?.price || product?.price_old || '').trim();
    return p || 'Liên hệ';
  });
  const [isHot, setIsHot] = useState(product?.is_hot ?? false);
  const [ordering, setOrdering] = useState(product?.ordering || 1);
  const [seoTitle, setSeoTitle] = useState(product?.seo_title || product?.meta_title || '');
  const [seoKeyword, setSeoKeyword] = useState(product?.seo_keyword || product?.meta_keywords || '');
  const [seoDescription, setSeoDescription] = useState(product?.seo_description || product?.meta_description || '');
  const [downloads, setDownloads] = useState<LegacyDownload[]>(Array.from({ length: 6 }, (_, index) => ({ name: product?.[`file_name${index + 1}` as keyof ProductItem] as string || '', file: product?.[`file_download${index + 1}` as keyof ProductItem] as string || '', link: product?.[`link_download${index + 1}` as keyof ProductItem] as string || '' })));
  const updateDownload = (index: number, key: keyof LegacyDownload, val: string) => {
    setDownloads((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: val };
      return next;
    });
  };
  const [gallery, setGallery] = useState<string[]>(product?.gallery || []);
  const [mediaTarget, setMediaTarget] = useState<'image' | 'icon' | 'gallery_add' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<'draft' | 'publish' | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { toast } = useCmsToast();
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [hasAiAutoFilled, setHasAiAutoFilled] = useState(false);
  const undoSnapshotRef = useRef<{
    alias: string;
    code: string;
    otherLanguages1: string;
    types: string;
    applications: string[];
    productsRelates: string[];
    summary: string;
    priceOld: string;
    seoTitle: string;
    seoDescription: string;
    seoKeyword: string;
    tagsText: string;
    gallery: string[];
  } | null>(null);

  const isAnchorsReady = Boolean(name.trim() && manufactory && categoryIds.length > 0);

  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAiSection2 = async () => {
    if (!name.trim()) {
      toast.warning('Vui lòng nhập Tên sản phẩm trước.');
      return;
    }

    try {
      const selectedBrand = brands.find((b) => b.id === manufactory)?.name || '';
      const selectedCatNames = categories
        .filter((c) => categoryIds.includes(c.id))
        .map((c) => c.name);

      const activeTypes = productTypes.filter((t) => t.status === 'active');
      const activeApps = applicationOptions.filter((a) => a.status === 'active');
      const candidateProds = relatedProducts.map((p) => ({
        id: p.id,
        name: p.name || p.title || '',
        brandName: p.manufactory || p.brand_name || '',
        categoryName: categories.find((c) => (p.category_ids || []).includes(c.id) || p.category_id === c.id)?.name || '',
      }));

      const taxResult = await classifyProductTaxonomyAction({
        name,
        brandName: selectedBrand,
        categoryNames: selectedCatNames,
        content: description,
        availableTypes: activeTypes.map((t) => ({ id: t.id, name: t.name })),
        availableApplications: activeApps.map((a) => ({ id: a.id, name: a.name })),
        candidateProducts: candidateProds,
      });

      if (!alias.trim() || !manualAlias) {
        setAlias(slugify(name));
      }
      if (!code.trim() && taxResult.suggestedSku) {
        setCode(taxResult.suggestedSku);
      }
      if (!otherLanguages1.trim()) {
        setOtherLanguages1(`/en/products/${slugify(name)}`);
      }
      if (!types && taxResult.selectedTypeId) {
        setTypes(taxResult.selectedTypeId);
      }
      if (applications.length === 0 && taxResult.selectedApplicationIds.length > 0) {
        setApplications(taxResult.selectedApplicationIds);
      }
      if (productsRelates.length === 0 && taxResult.selectedRelatedProductIds.length > 0) {
        setProductsRelates(taxResult.selectedRelatedProductIds);
      }

      toast.success('Đã tự động nhận diện Mã SKU, URL Tiếng Anh và Phân loại kỹ thuật!');
    } catch {
      if (!alias.trim() || !manualAlias) setAlias(slugify(name));
      if (!code.trim()) {
        setCode(name.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').substring(0, 20));
      }
      if (!otherLanguages1.trim()) setOtherLanguages1(`/en/products/${slugify(name)}`);
      toast.info('Đã chuẩn hóa thông tin kỹ thuật cơ bản.');
    }
  };

  const handleSmartAutoFill = async () => {
    if (!isAnchorsReady) {
      toast.warning('Vui lòng điền đủ Tên sản phẩm, chọn Hãng và Lĩnh vực trước!');
      return;
    }

    undoSnapshotRef.current = {
      alias,
      code,
      otherLanguages1,
      types,
      applications: [...applications],
      productsRelates: [...productsRelates],
      summary,
      priceOld,
      seoTitle,
      seoDescription,
      seoKeyword,
      tagsText,
      gallery: [...gallery],
    };

    try {
      setIsAutoFilling(true);
      const selectedBrand = brands.find((b) => b.id === manufactory)?.name || '';
      const selectedCatNames = categories
        .filter((c) => categoryIds.includes(c.id))
        .map((c) => c.name);
      const selectedCats = selectedCatNames.join(', ');

      const contextStr = `${name} do hãng ${selectedBrand} phát triển, lĩnh vực ${selectedCats}.`;
      const cleanDesc = description.replace(/<[^>]*>?/gm, ' ').trim();

      const activeTypes = productTypes.filter((t) => t.status === 'active');
      const activeApps = applicationOptions.filter((a) => a.status === 'active');
      const candidateProds = relatedProducts.map((p) => ({
        id: p.id,
        name: p.name || p.title || '',
        brandName: p.manufactory || p.brand_name || '',
        categoryName: categories.find((c) => (p.category_ids || []).includes(c.id) || p.category_id === c.id)?.name || '',
      }));

      // Chạy song song 4 tác vụ AI: Phân loại kỹ thuật + SEO + Tóm tắt + Tags
      const [taxRes, seoRes, summaryRes, tagsRes] = await Promise.all([
        classifyProductTaxonomyAction({
          name,
          brandName: selectedBrand,
          categoryNames: selectedCatNames,
          content: cleanDesc,
          availableTypes: activeTypes.map((t) => ({ id: t.id, name: t.name })),
          availableApplications: activeApps.map((a) => ({ id: a.id, name: a.name })),
          candidateProducts: candidateProds,
        }),
        (!seoTitle || !seoDescription)
          ? generateSeoAction({
              title: name,
              brandName: selectedBrand,
              categoryName: selectedCats,
              content: cleanDesc || contextStr,
              moduleType: 'product',
            })
          : Promise.resolve(null),
        (!summary.trim())
          ? generateSummaryAction({
              title: name,
              brandName: selectedBrand,
              categoryName: selectedCats,
              content: cleanDesc || contextStr,
              maxLength: 200,
            })
          : Promise.resolve(null),
        (!tagsText.trim())
          ? extractTagsAction({
              title: name,
              content: `${selectedBrand} ${selectedCats} ${cleanDesc}`,
              count: 6,
            })
          : Promise.resolve(null),
      ]);

      // 1. Phân loại kỹ thuật thông minh từ AI (không hardcode)
      if (!alias.trim() && !manualAlias) setAlias(slugify(name));
      if (!code.trim() && taxRes?.suggestedSku) setCode(taxRes.suggestedSku);
      if (!otherLanguages1.trim()) setOtherLanguages1(`/en/products/${slugify(name)}`);
      if (!types && taxRes?.selectedTypeId) setTypes(taxRes.selectedTypeId);
      if (applications.length === 0 && taxRes?.selectedApplicationIds?.length) {
        setApplications(taxRes.selectedApplicationIds);
      }
      if (productsRelates.length === 0 && taxRes?.selectedRelatedProductIds?.length) {
        setProductsRelates(taxRes.selectedRelatedProductIds);
      }

      // 2. Tóm tắt, SEO và Thẻ Tags
      if (summaryRes && !summary.trim()) {
        setSummary(summaryRes.summary);
      }
      if (seoRes) {
        if (!seoTitle.trim()) setSeoTitle(seoRes.seo_title);
        if (!seoDescription.trim()) setSeoDescription(seoRes.seo_description);
        if (!seoKeyword.trim()) {
          const kw = Array.isArray(seoRes.seo_keyword)
            ? (seoRes.seo_keyword as string[]).join(', ')
            : String(seoRes.seo_keyword || '');
          setSeoKeyword(kw);
        }
      }
      if (tagsRes && !tagsText.trim()) {
        setTagsText(tagsRes.tags.join(', '));
      }
      if (!priceOld.trim()) {
        setPriceOld('Liên hệ');
      }

      setHasAiAutoFilled(true);
      toast.success('Đã tự động điền Định danh kỹ thuật, Tóm tắt, SEO và Thẻ Tags!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi khi tự động điền dữ liệu.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleUndoAutoFill = () => {
    if (undoSnapshotRef.current) {
      setAlias(undoSnapshotRef.current.alias);
      setCode(undoSnapshotRef.current.code);
      setOtherLanguages1(undoSnapshotRef.current.otherLanguages1);
      setTypes(undoSnapshotRef.current.types);
      setApplications(undoSnapshotRef.current.applications);
      setProductsRelates(undoSnapshotRef.current.productsRelates);
      setSummary(undoSnapshotRef.current.summary);
      if (undoSnapshotRef.current.priceOld !== undefined) {
        setPriceOld(undoSnapshotRef.current.priceOld || 'Liên hệ');
      }
      setSeoTitle(undoSnapshotRef.current.seoTitle);
      setSeoDescription(undoSnapshotRef.current.seoDescription);
      setSeoKeyword(undoSnapshotRef.current.seoKeyword);
      setTagsText(undoSnapshotRef.current.tagsText);
      setGallery(undoSnapshotRef.current.gallery);
      undoSnapshotRef.current = null;
    }
    setHasAiAutoFilled(false);
    toast.info('Đã hoàn tác các trường vừa được điền tự động.');
  };

  const handleAiSummary = async () => {
    const selectedBrand = brands.find((b) => b.id === manufactory)?.name || '';
    const selectedCats = categories
      .filter((c) => categoryIds.includes(c.id))
      .map((c) => c.name)
      .join(', ');
    const cleanDesc = description.replace(/<[^>]*>?/gm, ' ').trim();
    const contextStr = cleanDesc || `${name} của hãng ${selectedBrand}, lĩnh vực ${selectedCats}.`;

    try {
      const res = await generateSummaryAction({
        title: name || 'Sản phẩm phần mềm',
        brandName: selectedBrand,
        categoryName: selectedCats,
        content: contextStr,
        maxLength: 200,
      });
      setSummary(res.summary);
      toast.success('Đã cập nhật Tóm tắt tự động!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tạo tóm tắt.');
    }
  };

  const handleAiSeo = async () => {
    const selectedBrand = brands.find((b) => b.id === manufactory)?.name || '';
    const selectedCats = categories
      .filter((c) => categoryIds.includes(c.id))
      .map((c) => c.name)
      .join(', ');
    const cleanDesc = description.replace(/<[^>]*>?/gm, ' ').trim();
    try {
      const res = await generateSeoAction({
        title: name || 'Sản phẩm phần mềm',
        brandName: selectedBrand,
        categoryName: selectedCats,
        content: cleanDesc || `${summary} ${selectedBrand}`,
        moduleType: 'product',
      });
      setSeoTitle(res.seo_title);
      setSeoDescription(res.seo_description);
      const kw = Array.isArray(res.seo_keyword)
        ? (res.seo_keyword as string[]).join(', ')
        : String(res.seo_keyword || '');
      setSeoKeyword(kw);
      toast.success('Đã tối ưu bộ thẻ SEO tự động!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tối ưu SEO.');
    }
  };

  const handleAiTags = async () => {
    const selectedBrand = brands.find((b) => b.id === manufactory)?.name || '';
    const cleanDesc = description.replace(/<[^>]*>?/gm, ' ').trim();
    try {
      const res = await extractTagsAction({
        title: name || 'Sản phẩm phần mềm',
        content: `${selectedBrand} ${summary} ${cleanDesc}`,
        count: 6,
      });
      setTagsText(res.tags.join(', '));
      toast.success('Đã cập nhật danh sách Thẻ Tags!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi gợi ý Tags.');
    }
  };

  const executeAiOverviewOutline = async () => {
    try {
      const res = await generateOutlineAction({
        title: name || 'Sản phẩm phần mềm',
        moduleType: 'product',
      });
      setDescription((prev) => (prev ? `${prev}<br/><hr/><br/>${res.outlineHtml}` : res.outlineHtml));
      toast.success('Đã chèn khung dàn ý tổng quan!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tạo dàn ý tổng quan.');
    }
  };

  const handleAiOverviewOutline = async () => {
    if (description.replace(/<[^>]*>?/gm, '').trim().length > 30) {
      setOutlineTarget('overview');
      return;
    }
    await executeAiOverviewOutline();
  };

  const executeAiFeaturesOutline = async () => {
    try {
      const res = await generateOutlineAction({
        title: `${name} - Tính năng kỹ thuật`,
        moduleType: 'product',
        notes: 'Tập trung vào các mô-đun công cụ, tính năng mô hình hóa 3D, phân tích kết cấu và liên kết BIM',
      });
      setFeatureDetails((prev) => (prev ? `${prev}<br/><hr/><br/>${res.outlineHtml}` : res.outlineHtml));
      toast.success('Đã chèn khung dàn ý tính năng!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tạo dàn ý tính năng.');
    }
  };

  const handleAiFeaturesOutline = async () => {
    if (featureDetails.replace(/<[^>]*>?/gm, '').trim().length > 30) {
      setOutlineTarget('features');
      return;
    }
    await executeAiFeaturesOutline();
  };

  const handleTranslateToEn = async () => {
    if (!name.trim()) {
      toast.warning('Vui lòng nhập Tên sản phẩm trước khi dịch sang tiếng Anh.');
      return;
    }
    setIsTranslatingEn(true);
    try {
      const res = await translateAndCreateEnProductAction({
        sourceProductId: product?.id ?? null,
        name,
        code,
        summary,
        description,
        feature_details: featureDetails,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keyword: Array.isArray(seoKeyword) ? seoKeyword.join(', ') : String(seoKeyword || ''),
        categoryIds: categoryIds.map(Number).filter((n) => Number.isInteger(n) && n > 0),
        applicationIds: applications.map(Number).filter((n) => Number.isInteger(n) && n > 0),
        manufactoryId: manufactory ? Number(manufactory) : null,
        typeId: types ? Number(types) : null,
        image,
        icon,
        price: priceOld.trim() || 'Liên hệ',
        tags: ids(tagsText),
        downloads,
        video,
      });

      setOtherLanguages1(res.enUrl);
      setEnCreatedInfo({ enName: res.enName, enUrl: res.enUrl });
      toast.success('Đã dịch toàn bộ nội dung và tạo bản nháp Tiếng Anh thành công!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi khi dịch sang Tiếng Anh.');
    } finally {
      setIsTranslatingEn(false);
    }
  };

  useEffect(() => { if (!manualAlias) setAlias(slugify(name)); }, [name, manualAlias]);
  const ids = (text: string) => text.split(',').map((item) => item.trim()).filter(Boolean);
  const payload = (): Partial<ProductItem> => {
    const base: Partial<ProductItem> = {
      name, alias: alias || slugify(name), code, other_languages1: otherLanguages1, image, icon,
      gallery,
      category_ids: categoryIds, category_id: categoryIds.join(','), manufactory,
      application: applications, types, products_relates: productsRelates, summary,
      description, feature_details: featureDetails, video, tawk_to: '', tags: ids(tagsText),
      price_old: priceOld.trim() || 'Liên hệ', price: priceOld.trim() || 'Liên hệ', is_hot: isHot, teamview: false, ordering: Number(ordering) || 1,
      landing_page: '', seo_title: seoTitle,
      seo_keyword: Array.isArray(seoKeyword) ? (seoKeyword as string[]).join(', ') : String(seoKeyword || ''),
      seo_description: seoDescription,
      file_catalogue: '', file_price: '', link_catalogue: '',
      file_driver_name: '', file_driver: '', link_driver: '',
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
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Bản nháp Tiếng Anh đã sẵn sàng</p>
              <h4 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-50 truncate">{enCreatedInfo.enName}</h4>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 font-mono mt-0.5">{enCreatedInfo.enUrl}</p>
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
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0 flex-1 font-semibold">{formError}</div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(310px,1fr)]">
        <main className="space-y-5">
          {/* Section 1: Thông tin cốt lõi (Anchors) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <Package className="h-5 w-5 text-orange-600" />
                1. Thông tin cơ bản
              </div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Thông tin bắt buộc (*)
              </span>
            </div>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Nhập tên sản phẩm, hãng sản xuất và lĩnh vực chuyên ngành để làm căn cứ nhận diện.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Tên sản phẩm *</label>
                <input
                  className={inputClass}
                  placeholder="VD: SAP2000, Kompas-3D, PTV Vissim..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Hãng sản xuất *</label>
                <SearchableSelect
                  options={brands.map((item) => ({ id: item.id, label: item.name }))}
                  selectedId={manufactory}
                  onChange={setManufactory}
                />
              </div>
              <div>
                <label className={labelClass}>Lĩnh vực chính *</label>
                <SearchableMultiSelect
                  options={categories.map((item) => ({ id: item.id, label: item.name }))}
                  selectedIds={categoryIds}
                  onChange={setCategoryIds}
                />
              </div>
            </div>
          </section>

          {/* Thanh hỗ trợ điền nhanh */}
          <div
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              isAnchorsReady
                ? 'border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs'
                : 'border-slate-200/60 bg-slate-50/40 dark:border-slate-800/50 dark:bg-slate-900/30'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isAnchorsReady ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`} />
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {isAnchorsReady
                      ? 'Gợi ý tự động: Có thể hỗ trợ điền nhanh thông tin kỹ thuật, SEO và thẻ tags.'
                      : 'Hỗ trợ điền nhanh (Nhập Tên, Hãng và Lĩnh vực ở trên để kích hoạt)'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAnchorsReady
                    ? 'Chỉ bổ sung các trường còn trống, tuyệt đối không can thiệp vào bài viết hay hình ảnh của bạn.'
                    : `Trạng thái: ${[Boolean(name.trim()) && 'Tên', Boolean(manufactory) && 'Hãng', categoryIds.length > 0 && 'Lĩnh vực'].filter(Boolean).length}/3 trường bắt buộc.`}
                </p>
              </div>
              <CmsButton
                variant={isAnchorsReady ? 'primary' : 'secondary'}
                size="sm"
                disabled={!isAnchorsReady || isAutoFilling}
                loading={isAutoFilling}
                loadingText="Đang phân tích & điền..."
                onClick={handleSmartAutoFill}
                leadingIcon={<Sparkles className="h-4 w-4" />}
              >
                Gợi ý điền nhanh
              </CmsButton>
            </div>
          </div>

          {/* Section 2: Phân loại & Liên kết mở rộng */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <Package className="h-5 w-5 text-orange-600" />
                2. Phân loại & Định danh kỹ thuật
              </div>
              <AiMagicWand
                label="Nhận diện kỹ thuật"
                title="Tự động nhận diện Mã SKU, URL Tiếng Anh, Loại phần mềm & Sản phẩm liên quan"
                onTrigger={handleAiSection2}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Alias (Đường dẫn tĩnh)</label>
                <input className={inputClass} value={alias} onChange={(e) => { setManualAlias(true); setAlias(e.target.value); }} />
              </div>
              <div>
                <label className={labelClass}>Biệt danh / Mã sản phẩm</label>
                <input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>URL ngôn ngữ khác (Tiếng Anh)</label>
                <input className={inputClass} value={otherLanguages1} onChange={(e) => setOtherLanguages1(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Loại sản phẩm</label>
                <SearchableSelect options={productTypes.filter((item) => item.status === 'active').map((item) => ({ id: item.id, label: item.name }))} selectedId={types} onChange={setTypes} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Ứng dụng</label>
                <SearchableMultiSelect options={applicationOptions.filter((item) => item.status === 'active').map((item) => ({ id: item.id, label: item.name }))} selectedIds={applications} onChange={setApplications} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Sản phẩm liên quan</label>
                <SearchableMultiSelect options={relatedProducts.filter((item) => item.id !== product?.id).map((item) => ({ id: item.id, label: item.name || item.title }))} selectedIds={productsRelates} onChange={setProductsRelates} />
              </div>
            </div>
          </section>

          {/* Section 3: Tóm tắt */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <FileText className="h-5 w-5 text-orange-600" />
                Tóm tắt sản phẩm
              </div>
              <AiMagicWand label="Tóm tắt từ bài viết" title="Tự động đọc bài viết và tóm tắt ngắn gọn" onTrigger={handleAiSummary} />
            </div>
            <textarea rows={4} className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Tóm tắt 1-2 câu súc tích để hiển thị ngoài danh mục sản phẩm..." />
          </section>

          {/* Section 4: Tổng quan */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <FileText className="h-5 w-5 text-orange-600" />
                Tổng quan
              </div>
              <AiMagicWand label="Khung dàn bài" title="Tạo khung dàn bài kỹ thuật chuẩn có sẵn đề mục" onTrigger={handleAiOverviewOutline} />
            </div>
            <RichTextEditor value={description} onChange={setDescription} minHeight="320px" allowedEmbeds={['cta', 'form']} />
          </section>

          {/* Section 5: Chi tiết tính năng */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <FileText className="h-5 w-5 text-orange-600" />
                Chi tiết tính năng
              </div>
              <AiMagicWand label="Khung tính năng" title="Tạo dàn ý các tính năng kỹ thuật nổi bật" onTrigger={handleAiFeaturesOutline} />
            </div>
            <RichTextEditor value={featureDetails} onChange={setFeatureDetails} minHeight="300px" allowedEmbeds={['cta', 'form']} />
          </section>

          {/* Section 6: Video giới thiệu */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <Video className="h-5 w-5 text-orange-600" />
                Video giới thiệu sản phẩm
              </div>
              <span className="text-[11px] text-slate-400">YouTube URL hoặc mã nhúng</span>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                className={inputClass}
                placeholder="Dán link YouTube (VD: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
              />
              {toYoutubeEmbedUrl(video) && (
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-black aspect-video max-w-lg">
                  <iframe
                    src={toYoutubeEmbedUrl(video)}
                    title="Video preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </section>

          {/* Section 7: Tệp sản phẩm & Tài liệu đính kèm */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
              <Link2 className="h-5 w-5 text-orange-600" />
              Tệp sản phẩm & Tài liệu đính kèm
            </div>
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Danh sách tệp tải về & Catalogue (Tối đa 6 tệp)
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
        </section>
      </main>
      <aside className="space-y-5">
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
            <label className={labelClass}>Ảnh đại diện</label>
            {image && <img src={findPageBuilderImage(image)?.thumbnail_url ?? findPageBuilderImage(image)?.url ?? image} alt="" className="mb-2 aspect-video w-full rounded-xl object-cover" />}
            <div className="flex gap-2">
              <button type="button" onClick={() => setMediaTarget('image')} className="flex-1 rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30">Chọn hoặc tải ảnh</button>
              {image && (
                <button type="button" onClick={() => setImage('')} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-700">Xóa</button>
              )}
            </div>
          </div>

          {/* Ảnh Slide / Slider Gallery */}
          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass}>
                Ảnh slide (Slider)
                {gallery.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                    {gallery.length} ảnh
                  </span>
                )}
              </label>
            </div>
            <p className="mb-2 text-[11px] text-slate-500 dark:text-slate-400">
              Các hình ảnh hiển thị trình chiếu (slider) trên trang chi tiết sản phẩm.
            </p>

            {gallery.length > 0 && (
              <div className="mb-2.5 grid grid-cols-3 gap-2">
                {gallery.map((imgUrl, idx) => (
                  <div key={idx} className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                    <img
                      src={findPageBuilderImage(imgUrl)?.thumbnail_url ?? findPageBuilderImage(imgUrl)?.url ?? imgUrl}
                      alt={`Slide ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                        title="Xóa ảnh khỏi slide"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMediaTarget('gallery_add')}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-orange-300 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm ảnh vào slide
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <label className={labelClass}>Icon sản phẩm</label>
            {icon && <img src={findPageBuilderImage(icon)?.thumbnail_url ?? findPageBuilderImage(icon)?.url ?? icon} alt="" className="mb-2 h-16 w-16 rounded-xl object-contain" />}
            <div className="flex gap-2">
              <button type="button" onClick={() => setMediaTarget('icon')} className="flex-1 rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30">Chọn hoặc tải icon</button>
              {icon && (
                <button type="button" onClick={() => setIcon('')} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:border-slate-700">Xóa</button>
              )}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass}>Tags</label>
              <AiMagicWand label="Gợi ý Tags" title="Tự động bóc tách từ khóa kỹ thuật" onTrigger={handleAiTags} />
            </div>
            <textarea rows={3} className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="VD: SAP2000, Phần mềm kết cấu, CSI Vietnam..." />
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Star className="h-5 w-5 text-orange-600" />Hiển thị</div>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass}>Giá bán</label>
              {priceOld.trim() !== 'Liên hệ' && (
                <button
                  type="button"
                  onClick={() => setPriceOld('Liên hệ')}
                  className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline dark:text-orange-400"
                >
                  Đặt lại &quot;Liên hệ&quot;
                </button>
              )}
            </div>
            <input
              id="field-price"
              className={`${inputClass} ${isTouched('price') ? 'border-l-4 border-l-orange-500' : ''}`}
              placeholder="VD: Liên hệ (mặc định), 15.000.000 VNĐ, Báo giá theo license..."
              value={priceOld}
              onChange={(e) => setPriceOld(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Mặc định là <span className="font-semibold text-slate-700 dark:text-slate-300">Liên hệ</span>. Nếu có mức giá cụ thể, bạn có thể chỉnh sửa tại đây.
            </p>
          </div>
          <label className="flex items-start justify-between gap-4 text-sm font-semibold dark:text-slate-200">
            <span>Sản phẩm nổi bật <span className="font-normal text-slate-400">({featuredCount + Number(isHot)}/{FEATURED_CONTENT_LIMITS.product})</span><span className="mt-0.5 block text-[11px] font-normal text-slate-500">Dự phòng cho section Sản phẩm trong tương lai; không dùng cho Hệ sinh thái Công nghệ CIC.</span></span>
            <input type="checkbox" checked={isHot} disabled={!isHot && featuredCount >= FEATURED_CONTENT_LIMITS.product} onChange={(e) => setIsHot(e.target.checked)} />
          </label>
          <div><label className={labelClass}>Thứ tự</label><input type="number" className={inputClass} value={ordering} onChange={(e) => setOrdering(Number(e.target.value))} /></div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black dark:text-white">
            <Search className="h-5 w-5 text-orange-600" />
            SEO
          </div>
          <AiMagicWand label="Tối ưu SEO" title="Tự động sinh bộ thẻ Title, Description, Keyword chuẩn Google" onTrigger={handleAiSeo} />
        </div>
        <div className="space-y-4">
          <div><label className={labelClass}>SEO title</label><input id="field-seo_title" className={`${inputClass} ${isTouched('seo_title') ? 'border-l-4 border-l-orange-500' : ''}`} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div>
          <div><label className={labelClass}>SEO keyword</label><input className={inputClass} value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} /></div>
          <div><label className={labelClass}>SEO description</label><textarea id="field-seo_description" rows={4} className={`${inputClass} ${isTouched('seo_description') ? 'border-l-4 border-l-orange-500' : ''}`} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></div>
        </div>
      </section>
    </aside></div>
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

    {/* Tạm thời ẩn AI Changes Diff Modal - mở lại khi server AI sẵn sàng */}
    {/* <AiChangesDiffModal
      isOpen={isDiffOpen}
      onClose={() => setIsDiffOpen(false)}
      changes={aiChanges}
      onRevertField={handleRevertField}
      onRevertAll={handleRevertAll}
    /> */}

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

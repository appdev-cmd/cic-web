import { useEffect, useState, useRef } from 'react';
import type { CmsProductListItem, ProductBrand, ProductCategory, ProductItem } from '../../types';
import type { MasterApplicationItem, MasterProductTypeItem } from '@/cms/modules/product_settings/types';
import { FEATURED_CONTENT_LIMITS } from '@/cms/modules/featuredContentPolicy';
import type { AiProductDraftResult, FieldChangeItem, FieldOrigin, ProductFormViewMode } from '@/features/ai-operator/types';
import { useCmsToast } from '@/cms/context/CmsToastContext';
import {
  generateSeoAction,
  generateSummaryAction,
  extractTagsAction,
  generateOutlineAction,
  classifyProductTaxonomyAction,
} from '@/features/ai-operator/server/shared-actions';
import { translateAndCreateEnProductAction } from '@/features/products/server/actions';
import { slugify, type LegacyDownload } from './productFormUtils';

export interface UseProductFormProps {
  locale: 'vi' | 'en';
  product: ProductItem | null;
  aiDraftResult?: AiProductDraftResult | null;
  categories: ProductCategory[];
  brands: ProductBrand[];
  applications: MasterApplicationItem[];
  productTypes: MasterProductTypeItem[];
  relatedProducts: CmsProductListItem[];
  featuredCount: number;
  onSave: (productData: Partial<ProductItem>, actionType: 'draft' | 'publish') => Promise<void> | void;
}

export function useProductForm({
  product,
  aiDraftResult,
  categories,
  brands,
  applications: applicationOptions,
  productTypes,
  relatedProducts,
  featuredCount,
  onSave,
}: UseProductFormProps) {
  const [formMode, setFormMode] = useState<ProductFormViewMode>('all');
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [aiChanges, setAiChanges] = useState<FieldChangeItem[]>(aiDraftResult?.changes || []);
  const [fieldOrigins, setFieldOrigins] = useState<Record<string, FieldOrigin>>(aiDraftResult?.fieldOrigins || {});
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
  const [downloads, setDownloads] = useState<LegacyDownload[]>(
    Array.from({ length: 6 }, (_, index) => ({
      name: (product?.[`file_name${index + 1}` as keyof ProductItem] as string) || '',
      file: (product?.[`file_download${index + 1}` as keyof ProductItem] as string) || '',
      link: (product?.[`link_download${index + 1}` as keyof ProductItem] as string) || '',
    }))
  );
  const [fileCatalogue, setFileCatalogue] = useState<string>(product?.file_catalogue || '');
  const [filePrice, setFilePrice] = useState<string>(product?.file_price || '');
  const [linkCatalogue, setLinkCatalogue] = useState<string>(product?.link_catalogue || '');
  const [fileDriverName, setFileDriverName] = useState<string>(product?.file_driver_name || '');
  const [fileDriver, setFileDriver] = useState<string>(product?.file_driver || '');
  const [linkDriver, setLinkDriver] = useState<string>(product?.link_driver || '');

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

  useEffect(() => {
    if (!manualAlias) setAlias(slugify(name));
  }, [name, manualAlias]);

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
        categoryName:
          categories.find((c) => (p.category_ids || []).includes(c.id) || p.category_id === c.id)?.name || '',
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
        setCode(
          name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 20)
        );
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
        categoryName:
          categories.find((c) => (p.category_ids || []).includes(c.id) || p.category_id === c.id)?.name || '',
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
        !seoTitle || !seoDescription
          ? generateSeoAction({
              title: name,
              brandName: selectedBrand,
              categoryName: selectedCats,
              content: cleanDesc || contextStr,
              moduleType: 'product',
            })
          : Promise.resolve(null),
        !summary.trim()
          ? generateSummaryAction({
              title: name,
              brandName: selectedBrand,
              categoryName: selectedCats,
              content: cleanDesc || contextStr,
              maxLength: 200,
            })
          : Promise.resolve(null),
        !tagsText.trim()
          ? extractTagsAction({
              title: name,
              content: `${selectedBrand} ${selectedCats} ${cleanDesc}`,
              count: 6,
            })
          : Promise.resolve(null),
      ]);

      // 1. Phân loại kỹ thuật thông minh từ AI
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

  const ids = (text: string) =>
    text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const payload = (): Partial<ProductItem> => {
    const base: Partial<ProductItem> = {
      name,
      alias: alias || slugify(name),
      code,
      other_languages1: otherLanguages1,
      image,
      icon,
      gallery,
      category_ids: categoryIds,
      category_id: categoryIds.join(','),
      manufactory,
      application: applications,
      types,
      products_relates: productsRelates,
      summary,
      description,
      feature_details: featureDetails,
      video,
      tawk_to: '',
      tags: ids(tagsText),
      price_old: priceOld.trim() || 'Liên hệ',
      price: priceOld.trim() || 'Liên hệ',
      is_hot: isHot,
      teamview: false,
      ordering: Number(ordering) || 1,
      landing_page: '',
      seo_title: seoTitle,
      seo_keyword: Array.isArray(seoKeyword)
        ? (seoKeyword as string[]).join(', ')
        : String(seoKeyword || ''),
      seo_description: seoDescription,
      file_catalogue: fileCatalogue,
      file_price: filePrice,
      link_catalogue: linkCatalogue,
      file_driver_name: fileDriverName,
      file_driver: fileDriver,
      link_driver: linkDriver,
    };
    downloads.forEach((item, index) => {
      Object.assign(base, {
        [`file_name${index + 1}`]: item.name,
        [`file_download${index + 1}`]: item.file,
        [`link_download${index + 1}`]: item.link,
      });
    });
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
      setFormError(
        error instanceof Error ? error.message : 'Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  const handleFieldFocus = (fieldKey: string) => {
    setFormMode('all');
    setTimeout(() => {
      const el =
        document.getElementById(`field-${fieldKey}`) ||
        document.querySelector(`[name="${fieldKey}"]`) ||
        document.getElementById(`field-${fieldKey}-input`);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight effect to draw immediate visual attention
        const highlightTarget = (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea'
          ? el
          : el.closest('section') || el) as HTMLElement;

        highlightTarget.classList.add('ring-2', 'ring-orange-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'transition-all', 'duration-300');
        setTimeout(() => {
          highlightTarget.classList.remove('ring-2', 'ring-orange-500', 'ring-offset-2', 'dark:ring-offset-slate-900');
        }, 2200);

        // Find the most appropriate interactive element to focus
        const focusable =
          el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLButtonElement
            ? el
            : el.querySelector<HTMLElement>('input, textarea, button, [tabindex="0"]');

        if (focusable) {
          focusable.focus();
        } else if (el instanceof HTMLElement) {
          el.setAttribute('tabindex', '-1');
          el.focus();
        }
      }
    }, 150);
  };

  const isTouched = (fName: string) => Boolean(fieldOrigins[fName]);

  return {
    formMode,
    setFormMode,
    isDiffOpen,
    setIsDiffOpen,
    aiChanges,
    setAiChanges,
    fieldOrigins,
    setFieldOrigins,
    isTranslatingEn,
    enCreatedInfo,
    setEnCreatedInfo,
    outlineTarget,
    setOutlineTarget,
    name,
    setName,
    alias,
    setAlias,
    manualAlias,
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
    setDownloads,
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
    setFormError,
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
  };
}

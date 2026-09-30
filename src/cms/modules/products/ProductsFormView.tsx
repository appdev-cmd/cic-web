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
import { useCmsToast } from '@/cms/context/CmsToastContext';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import {
  generateSeoAction,
  generateSummaryAction,
  extractTagsAction,
  translateFieldsAction,
  generateOutlineAction,
} from '@/features/ai-operator/server/shared-actions';

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
  const [formMode, setFormMode] = useState<ProductFormViewMode>('all');
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
    seoTitle: string;
    seoDescription: string;
    seoKeyword: string;
    tagsText: string;
  } | null>(null);

  const isAnchorsReady = Boolean(name.trim() && manufactory && categoryIds.length > 0);

  const handleAiSection2 = () => {
    if (!name.trim()) {
      toast.warning('Vui lòng nhập Tên sản phẩm trước.');
      return;
    }

    const selectedBrand = brands.find((b) => b.id === manufactory)?.name || '';
    const selectedCats = categories
      .filter((c) => categoryIds.includes(c.id))
      .map((c) => c.name)
      .join(', ');

    if (!alias.trim() || !manualAlias) {
      setAlias(slugify(name));
    }

    if (!code.trim()) {
      const generatedCode = name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 20);
      if (generatedCode) setCode(generatedCode);
    }

    if (!otherLanguages1.trim()) {
      setOtherLanguages1(`/en/products/${slugify(name)}`);
    }

    if (!types) {
      const activeTypes = productTypes.filter((t) => t.status === 'active');
      const matchedType =
        activeTypes.find(
          (t) =>
            t.name.toLowerCase().includes('phần mềm') ||
            t.name.toLowerCase().includes('bản quyền') ||
            t.name.toLowerCase().includes('thương mại')
        ) || activeTypes[0];
      if (matchedType) setTypes(matchedType.id);
    }

    if (applications.length === 0) {
      const activeApps = applicationOptions.filter((a) => a.status === 'active');
      const matchedApps = activeApps.filter((a) => {
        const appName = a.name.toLowerCase();
        const prodName = name.toLowerCase();
        const catName = selectedCats.toLowerCase();
        return (
          ((catName.includes('kết cấu') || prodName.includes('etabs') || prodName.includes('sap2000')) &&
            (appName.includes('kết cấu') || appName.includes('bê tông') || appName.includes('thép') || appName.includes('xây dựng'))) ||
          ((catName.includes('kiến trúc') || prodName.includes('cad') || prodName.includes('revit')) &&
            (appName.includes('kiến trúc') || appName.includes('cad') || appName.includes('bim'))) ||
          ((catName.includes('giao thông') || prodName.includes('vissim') || prodName.includes('visum')) &&
            (appName.includes('giao thông') || appName.includes('hạ tầng') || appName.includes('mô phỏng'))) ||
          ((catName.includes('địa kỹ thuật') || prodName.includes('plaxis')) &&
            (appName.includes('địa kỹ thuật') || appName.includes('móng') || appName.includes('hầm')))
        );
      });
      if (matchedApps.length > 0) {
        setApplications(matchedApps.map((a) => a.id));
      }
    }

    if (productsRelates.length === 0) {
      const sameBrandOrCat = relatedProducts.filter((p) => {
        if (p.id === product?.id) return false;
        const matchBrand = manufactory && (p.manufactory === manufactory || p.brand_id === manufactory);
        const matchCat = categoryIds.some((cid) => (p.category_ids || []).includes(cid) || p.category_id === cid);
        return matchBrand || matchCat;
      });
      if (sameBrandOrCat.length > 0) {
        setProductsRelates(sameBrandOrCat.slice(0, 3).map((p) => p.id));
      }
    }

    toast.success('Đã tự động nhận diện Mã SKU, URL Tiếng Anh và Phân loại kỹ thuật!');
  };

  const handleSmartAutoFill = async () => {
    if (!isAnchorsReady) {
      toast.warning('Vui lòng điền đủ Tên sản phẩm, chọn Hãng và Lĩnh vực trước khi dùng AI!');
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
      seoTitle,
      seoDescription,
      seoKeyword,
      tagsText,
    };

    try {
      setIsAutoFilling(true);
      const selectedBrand = brands.find((b) => b.id === manufactory)?.name || '';
      const selectedCats = categories
        .filter((c) => categoryIds.includes(c.id))
        .map((c) => c.name)
        .join(', ');

      const contextStr = `${name} do hãng ${selectedBrand} phát triển, lĩnh vực ${selectedCats}.`;
      const cleanDesc = description.replace(/<[^>]*>?/gm, ' ').trim();

      // 1. Tự động nhận diện Phân loại & Định danh kỹ thuật (Section 2)
      if (!alias.trim() && !manualAlias) {
        setAlias(slugify(name));
      }
      if (!code.trim()) {
        const generatedCode = name
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 20);
        if (generatedCode) setCode(generatedCode);
      }
      if (!otherLanguages1.trim()) {
        setOtherLanguages1(`/en/products/${slugify(name)}`);
      }
      if (!types) {
        const activeTypes = productTypes.filter((t) => t.status === 'active');
        const matchedType =
          activeTypes.find(
            (t) =>
              t.name.toLowerCase().includes('phần mềm') ||
              t.name.toLowerCase().includes('bản quyền') ||
              t.name.toLowerCase().includes('thương mại')
          ) || activeTypes[0];
        if (matchedType) setTypes(matchedType.id);
      }
      if (applications.length === 0) {
        const activeApps = applicationOptions.filter((a) => a.status === 'active');
        const matchedApps = activeApps.filter((a) => {
          const appName = a.name.toLowerCase();
          const prodName = name.toLowerCase();
          const catName = selectedCats.toLowerCase();
          return (
            ((catName.includes('kết cấu') || prodName.includes('etabs') || prodName.includes('sap2000')) &&
              (appName.includes('kết cấu') || appName.includes('bê tông') || appName.includes('thép') || appName.includes('xây dựng'))) ||
            ((catName.includes('kiến trúc') || prodName.includes('cad') || prodName.includes('revit')) &&
              (appName.includes('kiến trúc') || appName.includes('cad') || appName.includes('bim'))) ||
            ((catName.includes('giao thông') || prodName.includes('vissim') || prodName.includes('visum')) &&
              (appName.includes('giao thông') || appName.includes('hạ tầng') || appName.includes('mô phỏng'))) ||
            ((catName.includes('địa kỹ thuật') || prodName.includes('plaxis')) &&
              (appName.includes('địa kỹ thuật') || appName.includes('móng') || appName.includes('hầm')))
          );
        });
        if (matchedApps.length > 0) {
          setApplications(matchedApps.map((a) => a.id));
        }
      }
      if (productsRelates.length === 0) {
        const sameBrandOrCat = relatedProducts.filter((p) => {
          if (p.id === product?.id) return false;
          const matchBrand = manufactory && (p.manufactory === manufactory || p.brand_id === manufactory);
          const matchCat = categoryIds.some((cid) => (p.category_ids || []).includes(cid) || p.category_id === cid);
          return matchBrand || matchCat;
        });
        if (sameBrandOrCat.length > 0) {
          setProductsRelates(sameBrandOrCat.slice(0, 3).map((p) => p.id));
        }
      }

      // 2. Gọi AI sinh Tóm tắt, SEO và Thẻ Tags
      const [seoRes, summaryRes, tagsRes] = await Promise.all([
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
              count: 5,
            })
          : Promise.resolve(null),
      ]);

      if (summaryRes && !summary.trim()) {
        setSummary(summaryRes.summary);
      }
      if (seoRes) {
        if (!seoTitle.trim()) setSeoTitle(seoRes.seo_title);
        if (!seoDescription.trim()) setSeoDescription(seoRes.seo_description);
        if (!seoKeyword.trim()) setSeoKeyword(seoRes.seo_keyword);
      }
      if (tagsRes && !tagsText.trim()) {
        setTagsText(tagsRes.tags.join(', '));
      }

      setHasAiAutoFilled(true);
      toast.success('Trợ lý AI đã tự động điền Định danh kỹ thuật, Tóm tắt, SEO và Thẻ Tags!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi khi AI tự động điền dữ liệu.');
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
      setSeoTitle(undoSnapshotRef.current.seoTitle);
      setSeoDescription(undoSnapshotRef.current.seoDescription);
      setSeoKeyword(undoSnapshotRef.current.seoKeyword);
      setTagsText(undoSnapshotRef.current.tagsText);
      undoSnapshotRef.current = null;
    }
    setHasAiAutoFilled(false);
    toast.info('Đã hoàn tác các trường vừa được AI điền tự động.');
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
      toast.success('Đã cập nhật Tóm tắt bằng AI!');
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
      setSeoKeyword(res.seo_keyword);
      toast.success('Đã tối ưu bộ thẻ SEO bằng AI!');
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

  const handleAiOverviewOutline = async () => {
    if (description.replace(/<[^>]*>?/gm, '').trim().length > 30) {
      const ok = window.confirm('Mục Tổng quan đã có nội dung và hình ảnh. Bạn có muốn chèn thêm khung dàn bài mẫu vào cuối bài không?');
      if (!ok) return;
    }
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

  const handleAiFeaturesOutline = async () => {
    if (featureDetails.replace(/<[^>]*>?/gm, '').trim().length > 30) {
      const ok = window.confirm('Mục Chi tiết tính năng đã có nội dung. Bạn có muốn chèn thêm khung dàn bài mẫu vào cuối bài không?');
      if (!ok) return;
    }
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

  const handleAiTranslateEn = async () => {
    try {
      const fieldsToTranslate: Record<string, string> = {};
      if (name.trim()) fieldsToTranslate.name = name;
      if (summary.trim()) fieldsToTranslate.summary = summary;
      if (seoTitle.trim()) fieldsToTranslate.seo_title = seoTitle;
      if (seoDescription.trim()) fieldsToTranslate.seo_description = seoDescription;

      if (Object.keys(fieldsToTranslate).length === 0) {
        toast.warning('Chưa có thông tin để dịch sang tiếng Anh.');
        return;
      }

      const res = await translateFieldsAction({
        fields: fieldsToTranslate,
        targetLang: 'en',
      });

      if (res.translations.name && !otherLanguages1.trim()) {
        setOtherLanguages1(`/en/products/${slugify(res.translations.name)}`);
      }

      toast.success('Đã hoàn tất dịch thuật ngữ tiếng Anh bằng AI!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi khi dịch nội dung.');
    }
  };

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
          <AiMagicWand
            label="Dịch sang EN"
            title="Dịch thông tin sang tiếng Anh bằng Trợ lý AI"
            onTrigger={handleAiTranslateEn}
            variant="outline"
            size="sm"
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

      {/* Thông báo hoàn tác khi AI vừa tự động điền */}
      {hasAiAutoFilled && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/40 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                ✦ Trợ lý AI: Đã tự động điền Định danh kỹ thuật, Tóm tắt, SEO và Thẻ Tags.
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
            Hoàn tác AI về ban đầu
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
          <section className="rounded-2xl border-2 border-orange-200/90 bg-gradient-to-b from-orange-50/40 to-white p-5 shadow-xs dark:border-orange-900/50 dark:from-orange-950/20 dark:to-slate-900">
            <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <Package className="h-5 w-5 text-orange-600" />
                1. Thông tin nhận diện cốt lõi
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80">
                ⚡ Điền 3 ô này để kích hoạt Trợ lý AI
              </span>
            </div>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Nhập Tên sản phẩm, chọn Hãng và Lĩnh vực để AI nhận diện ngữ cảnh và hỗ trợ điền tự động các mục còn lại.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Tên sản phẩm *</label>
                <input
                  className={inputClass}
                  placeholder="VD: SAP2000 v25, Kompas-3D v23, Plaxis 3D..."
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

          {/* Thanh kích hoạt thông minh (Smart AI Copilot Trigger Bar) */}
          <div
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              isAnchorsReady
                ? 'border-orange-300 bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50 dark:border-orange-800/80 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-orange-950/30 shadow-xs'
                : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40 opacity-80'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isAnchorsReady ? 'text-orange-600 dark:text-orange-400 animate-pulse' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {isAnchorsReady
                      ? '✦ Đã nhận diện thông tin sản phẩm! Bạn có muốn AI hỗ trợ điền?'
                      : 'Trợ lý AI Co-pilot (Điền đủ Tên, Hãng và Lĩnh vực ở trên để mở khóa)'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAnchorsReady
                    ? 'AI sẽ tự động sinh Tóm tắt, bộ thẻ SEO và Thẻ Tags. (Tuyệt đối không ghi đè bài viết hoặc hình ảnh của bạn)'
                    : `Trạng thái: ${[Boolean(name.trim()) && 'Tên', Boolean(manufactory) && 'Hãng', categoryIds.length > 0 && 'Lĩnh vực'].filter(Boolean).length}/3 trường cốt lõi đã sẵn sàng.`}
                </p>
              </div>
              <CmsButton
                variant="primary"
                size="sm"
                disabled={!isAnchorsReady || isAutoFilling}
                loading={isAutoFilling}
                loadingText="AI đang phân tích & điền..."
                onClick={handleSmartAutoFill}
                leadingIcon={<Sparkles className="h-4 w-4" />}
              >
                Tự động điền phần còn lại với AI
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

          {/* Section 6: Video */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2 font-black dark:text-white">
              <FileText className="h-5 w-5 text-orange-600" />
              Video
            </div>
            <RichTextEditor value={video} onChange={setVideo} minHeight="260px" />
          </section>
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
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass}>Tags</label>
              <AiMagicWand label="Gợi ý Tags" title="Tự động bóc tách từ khóa kỹ thuật bằng Trợ lý AI" onTrigger={handleAiTags} />
            </div>
            <textarea rows={3} className={inputClass} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="VD: SAP2000, Phần mềm kết cấu, CSI Vietnam..." />
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-4 flex items-center gap-2 font-black dark:text-white"><Star className="h-5 w-5 text-orange-600" />Hiển thị</div><div className="space-y-4"><div><label className={labelClass}>Giá</label><input id="field-price" className={`${inputClass} ${isTouched('price') ? 'border-l-4 border-l-orange-500' : ''}`} value={priceOld} onChange={(e) => setPriceOld(e.target.value)} /></div><label className="flex items-start justify-between gap-4 text-sm font-semibold dark:text-slate-200"><span>Sản phẩm nổi bật <span className="font-normal text-slate-400">({featuredCount + Number(isHot)}/{FEATURED_CONTENT_LIMITS.product})</span><span className="mt-0.5 block text-[11px] font-normal text-slate-500">Dự phòng cho section Sản phẩm trong tương lai; không dùng cho Hệ sinh thái Công nghệ CIC.</span></span><input type="checkbox" checked={isHot} disabled={!isHot && featuredCount >= FEATURED_CONTENT_LIMITS.product} onChange={(e) => setIsHot(e.target.checked)} /></label><label className="flex items-center justify-between text-sm font-semibold dark:text-slate-200"><span>Link TeamViewer</span><input type="checkbox" checked={teamview} onChange={(e) => setTeamview(e.target.checked)} /></label><div><label className={labelClass}>Thứ tự</label><input type="number" className={inputClass} value={ordering} onChange={(e) => setOrdering(Number(e.target.value))} /></div><div><label className={labelClass}>Landing page</label><input className={inputClass} value={landingPage} onChange={(e) => setLandingPage(e.target.value)} /></div></div></section>
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
          <div><label className={labelClass}>Tawk.to</label><textarea rows={3} className={inputClass} value={tawkTo} onChange={(e) => setTawkTo(e.target.value)} /></div>
        </div>
      </section>
    </aside></div>
    {mediaTarget && <PageMediaPickerModal locale={locale} returnValue="url" currentId={mediaTarget === 'image' ? image : icon} onClose={() => setMediaTarget(null)} onConfirm={(mediaUrl) => mediaTarget === 'image' ? setImage(mediaUrl) : setIcon(mediaUrl)} />}

    {/* Tạm thời ẩn AI Changes Diff Modal - mở lại khi server AI sẵn sàng */}
    {/* <AiChangesDiffModal
      isOpen={isDiffOpen}
      onClose={() => setIsDiffOpen(false)}
      changes={aiChanges}
      onRevertField={handleRevertField}
      onRevertAll={handleRevertAll}
    /> */}
  </div>
  );
};

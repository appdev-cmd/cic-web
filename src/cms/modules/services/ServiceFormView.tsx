import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Globe,
  Eye,
  FileText,
  Layers,
  Image as ImageIcon,
  Search,
  Clock,
  AlertCircle,
  Sparkles,
  RotateCcw,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  ServiceItem,
  EditorialStatus,
} from './types';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import { SearchableMultiSelect } from '../../components/SearchableSelect';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import { ContentQualityPanel } from '@/cms/components/ContentQualityPanel';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import {
  generateServiceSmartDraftAction,
  generateSeoAction,
  generateSummaryAction,
  generateOutlineAction,
  extractTagsAction,
  translateFieldsAction,
  suggestRelatedEntitiesAction,
} from '@/features/ai-operator/server/shared-actions';
import type { CmsLocale } from '../../data/CmsDataSource';

interface ServiceFormViewProps {
  service: ServiceItem;
  locale?: CmsLocale;
  canEdit?: boolean;
  canPublish?: boolean;
  onBack: () => void;
  onSave: (updated: ServiceItem) => Promise<void> | void;
  onOpenPreview: (item: ServiceItem) => void;
  productOptions?: Array<{ id: string; label: string; image?: string; published?: boolean }>;
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const ServiceFormView: React.FC<ServiceFormViewProps> = ({
  service,
  locale = 'vi',
  canEdit = true,
  canPublish = true,
  onBack,
  onSave,
  onOpenPreview,
  productOptions = [],
}) => {
  const [formData, setFormData] = useState<ServiceItem>({ ...service });
  const [lastAutosaved, setLastAutosaved] = useState<string>('vừa xong');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // AI Co-pilot State
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [hasAiAutoFilled, setHasAiAutoFilled] = useState(false);
  const [previousData, setPreviousData] = useState<ServiceItem | null>(null);
  const [isTranslatingEn, setIsTranslatingEn] = useState(false);
  const [enCreatedInfo, setEnCreatedInfo] = useState<{ enName: string; enUrl: string } | null>(null);
  const [manualSlug, setManualSlug] = useState(Boolean(service.slug));

  useEffect(() => {
    setFormData({ ...service });
    setIsDirty(false);
  }, [service]);

  const handleChange = (field: keyof ServiceItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isAnchorsReady = Boolean(formData.title.trim().length >= 5);

  const handleSmartAutoFill = async () => {
    if (!formData.title.trim()) return;
    try {
      setIsAutoFilling(true);
      setPreviousData({ ...formData });

      const relatedNames = (formData.related_product_ids || [])
        .map((id) => productOptions.find((p) => p.id === id)?.label)
        .filter(Boolean) as string[];

      const draft = await generateServiceSmartDraftAction({
        title: formData.title.trim(),
        relatedProductNames: relatedNames,
        locale: locale as 'vi' | 'en',
      });

      let suggestedProducts = formData.related_product_ids || [];
      if (suggestedProducts.length === 0 && productOptions.length > 0) {
        try {
          const pRes = await suggestRelatedEntitiesAction({
            title: formData.title.trim(),
            context: `${draft.summary} ${draft.tags.join(' ')}`,
            entityType: 'product',
            candidates: productOptions,
            maxSelect: 3,
          });
          if (pRes.selectedIds.length > 0) {
            suggestedProducts = pRes.selectedIds;
          }
        } catch {
          // non-blocking
        }
      }

      setFormData((prev) => ({
        ...prev,
        slug: prev.slug || slugify(prev.title),
        summary: prev.summary || draft.summary,
        meta_title: prev.meta_title || draft.meta_title,
        meta_description: prev.meta_description || draft.meta_description,
        meta_keywords: prev.meta_keywords || draft.meta_keywords,
        tags: prev.tags || draft.tags.join(', '),
        related_product_ids: suggestedProducts,
      }));

      setIsDirty(true);
      setHasAiAutoFilled(true);
      showToast('✦ Trợ lý AI đã tự động điền Tóm tắt, Bộ 3 SEO, Thẻ Tags & Sản phẩm áp dụng!');
    } catch (err: any) {
      showToast(err?.message || 'Không thể tự động điền với AI. Vui lòng thử lại.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleUndoAutoFill = () => {
    if (previousData) {
      setFormData({ ...previousData });
      setHasAiAutoFilled(false);
      setPreviousData(null);
      showToast('Đã hoàn tác dữ liệu về ban đầu.');
    }
  };

  const handleAiSummary = async () => {
    if (!formData.title.trim() && !formData.description.trim()) {
      showToast('Cần có Tên dịch vụ hoặc Nội dung chi tiết để tạo tóm tắt.');
      return;
    }
    const res = await generateSummaryAction({
      title: formData.title,
      categoryName: 'Dịch vụ tư vấn & chuyển giao công nghệ',
      content: formData.description,
      maxLength: 200,
    });
    if (res.summary) {
      handleChange('summary', res.summary);
      showToast('✦ Đã tối ưu tóm tắt dịch vụ!');
    }
  };

  const handleAiOutline = async () => {
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập Tên dịch vụ trước khi tạo dàn ý.');
      return;
    }
    const res = await generateOutlineAction({
      title: formData.title,
      moduleType: 'service',
    });
    if (res.outlineHtml) {
      if (formData.description.trim() && formData.description.trim() !== '<p></p>') {
        if (window.confirm('Nội dung hiện tại sẽ được thay thế bằng Khung quy trình chuẩn của AI. Bạn có muốn tiếp tục?')) {
          handleChange('description', res.outlineHtml);
          showToast('✦ Đã tạo khung quy trình dịch vụ chuẩn!');
        }
      } else {
        handleChange('description', res.outlineHtml);
        showToast('✦ Đã tạo khung quy trình dịch vụ chuẩn!');
      }
    }
  };

  const handleAiSeo = async () => {
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập Tên dịch vụ để tối ưu SEO.');
      return;
    }
    const res = await generateSeoAction({
      title: formData.title,
      categoryName: 'Dịch vụ kỹ thuật',
      content: formData.description || formData.summary,
      moduleType: 'service',
    });
    setFormData((prev) => ({
      ...prev,
      meta_title: res.seo_title,
      meta_description: res.seo_description,
      meta_keywords: res.seo_keyword,
    }));
    setIsDirty(true);
    showToast('✦ Đã tối ưu bộ 3 thẻ SEO Google!');
  };

  const handleAiTags = async () => {
    if (!formData.title.trim()) return;
    const res = await extractTagsAction({
      title: formData.title,
      content: formData.description || formData.summary,
      count: 5,
    });
    if (res.tags.length > 0) {
      handleChange('tags', res.tags.join(', '));
      showToast(`✦ Đã gợi ý ${res.tags.length} thẻ tags!`);
    }
  };

  const handleAiRelatedProducts = async () => {
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập Tên dịch vụ trước khi gợi ý sản phẩm.');
      return;
    }
    try {
      const res = await suggestRelatedEntitiesAction({
        title: formData.title,
        context: `${formData.summary} ${formData.tags || ''} ${formData.description}`,
        entityType: 'product',
        candidates: productOptions,
        maxSelect: 4,
      });
      if (res.selectedIds.length > 0) {
        const merged = Array.from(new Set([...(formData.related_product_ids || []), ...res.selectedIds]));
        handleChange('related_product_ids', merged);
        showToast(`✦ Đã gợi ý ${res.selectedIds.length} sản phẩm áp dụng phù hợp!`);
      } else {
        showToast('Không tìm thấy sản phẩm khớp với dịch vụ này.');
      }
    } catch {
      showToast('Không thể gợi ý sản phẩm lúc này.');
    }
  };

  const handleTranslateToEn = async () => {
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập Tên dịch vụ trước khi dịch.');
      return;
    }
    try {
      setIsTranslatingEn(true);
      const res = await translateFieldsAction({
        fields: {
          title: formData.title,
          summary: formData.summary,
          description: formData.description,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description,
          meta_keywords: formData.meta_keywords,
        },
        targetLang: 'en',
      });

      const enSlug = slugify(res.translations.title || formData.title);
      setEnCreatedInfo({
        enName: res.translations.title || formData.title,
        enUrl: `/services/${enSlug}`,
      });
      showToast('✦ Đã dịch toàn bộ nội dung dịch vụ sang Tiếng Anh!');
    } catch (err: any) {
      showToast(err?.message || 'Không thể dịch sang Tiếng Anh.');
    } finally {
      setIsTranslatingEn(false);
    }
  };

  const handleFieldFocus = (fieldKey: string) => {
    setTimeout(() => {
      const el =
        document.getElementById(`field-${fieldKey}`) ||
        document.querySelector(`[name="${fieldKey}"]`) ||
        document.getElementById(`field-${fieldKey}-input`);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const highlightTarget = (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea'
          ? el
          : el.closest('div') || el) as HTMLElement;

        highlightTarget.classList.add('ring-2', 'ring-orange-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'transition-all', 'duration-300');
        setTimeout(() => {
          highlightTarget.classList.remove('ring-2', 'ring-orange-500', 'ring-offset-2', 'dark:ring-offset-slate-900');
        }, 2200);

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

  const handleSaveDraft = async () => {
    setFormError(null);
    if (!formData.title.trim()) {
      setFormError('Vui lòng nhập tên dịch vụ.');
      return;
    }
    const updated: ServiceItem = {
      ...formData,
      editorial_status: formData.editorial_status === 'published' ? 'published' : 'draft',
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    try {
      setIsSubmitting(true);
      await onSave(updated);
      setIsDirty(false);
      setLastAutosaved(new Date().toLocaleTimeString('vi-VN'));
      showToast('Đã lưu bản nháp dịch vụ thành công!');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Không thể lưu dịch vụ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setFormError(null);
    if (!formData.title.trim()) {
      setFormError('Vui lòng nhập tên dịch vụ.');
      return;
    }
    const updated: ServiceItem = {
      ...formData,
      editorial_status: 'published',
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    try {
      setIsSubmitting(true);
      await onSave(updated);
      setIsDirty(false);
      showToast('Đã xuất bản dịch vụ trên website!');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Không thể xuất bản dịch vụ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header Actions */}
      <div className="cms-sticky-action bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="hidden items-center gap-2 sm:flex">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  formData.editorial_status === 'published'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {formData.editorial_status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate max-w-lg mt-0.5">
              {formData.title || 'Dịch vụ chưa đặt tên'}
            </h2>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <span className="hidden text-[11px] text-slate-400 mr-2 items-center gap-1 md:flex">
            <Clock className="w-3 h-3" /> Tự động lưu: {lastAutosaved}
          </span>

          {locale === 'vi' && (
            <CmsButton
              variant="secondary"
              size="sm"
              disabled={isSubmitting || isTranslatingEn}
              loading={isTranslatingEn}
              loadingText="Đang dịch..."
              onClick={handleTranslateToEn}
              leadingIcon={<Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
              title="Dịch toàn bộ thông tin dịch vụ sang Tiếng Anh"
            >
              Dịch sang Tiếng Anh
            </CmsButton>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onOpenPreview(formData)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Xem trước
          </button>

          <button
            type="button"
            disabled={!canEdit || isSubmitting}
            onClick={handleSaveDraft}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none dark:bg-slate-700 cursor-pointer"
            title={canEdit ? 'Lưu bản nháp dịch vụ' : 'Bạn không có quyền chỉnh sửa dịch vụ'}
          >
            <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Đang lưu...' : 'Lưu nháp'}
          </button>

          <button
            type="button"
            disabled={!canPublish || isSubmitting}
            onClick={handlePublish}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none cursor-pointer"
            title={canPublish ? 'Xuất bản dịch vụ' : 'Bạn không có quyền xuất bản dịch vụ'}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> {isSubmitting ? 'Đang lưu...' : 'Xuất bản'}
          </button>
        </div>
      </div>

      {/* English Draft Created Banner */}
      {enCreatedInfo && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Bản dịch Tiếng Anh đã sẵn sàng</p>
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

      {/* Undo Notification Banner */}
      {hasAiAutoFilled && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/40 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                ✦ Trợ lý AI Co-pilot: Đã tự động điền Tóm tắt, Bộ 3 SEO và Thẻ Tags!
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-2 hidden sm:inline">
                (Nội dung chi tiết và hình ảnh của bạn được bảo toàn)
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
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0 flex-1">{formError}</div>
        </div>
      )}

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main form content */}
        <div className="lg:col-span-8 space-y-5">
          {/* SECTION 1: THÔNG TIN CHUNG */}
          <div
            id="section_general"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. Thông tin chung dịch vụ
              </h3>
            </div>

            <div id="field-title">
              <label htmlFor="field-title-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tên dịch vụ <span className="text-rose-500">*</span>
              </label>
              <input
                id="field-title-input"
                name="title"
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug: manualSlug ? prev.slug : slugify(title),
                  }));
                  setIsDirty(true);
                }}
                placeholder="Ví dụ: Tư vấn Lộ trình Chuyển đổi số BIM ISO 19650, Thử tải Cầu hầm..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Smart Trigger Bar Co-pilot */}
            <div
              className={`rounded-xl border p-3.5 transition-all ${
                isAnchorsReady
                  ? 'border-orange-300 bg-orange-50/70 dark:border-orange-900/60 dark:bg-orange-950/20 shadow-xs'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className={`h-4 w-4 ${isAnchorsReady ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isAnchorsReady
                        ? 'Trợ lý AI Co-pilot: Sẵn sàng tự động điền Tóm tắt, Bộ 3 SEO & Thẻ Tags!'
                        : 'Trợ lý AI Co-pilot (Nhập Tên dịch vụ ở trên để mở khóa)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAnchorsReady
                      ? 'AI sẽ tự động tối ưu SEO Google B2B, gắn thẻ Tags và viết tóm tắt khẳng định năng lực tư vấn CIC.'
                      : 'Hệ thống cần tối thiểu Tên dịch vụ để nhận diện lĩnh vực chuyên môn và hỗ trợ điền tự động.'}
                  </p>
                </div>
                <CmsButton
                  type="button"
                  variant={isAnchorsReady ? 'primary' : 'secondary'}
                  size="sm"
                  disabled={!isAnchorsReady || isAutoFilling}
                  loading={isAutoFilling}
                  loadingText="Đang phân tích & điền..."
                  onClick={handleSmartAutoFill}
                  leadingIcon={<Sparkles className="h-4 w-4" />}
                >
                  Tự động điền phần còn lại với AI
                </CmsButton>
              </div>
            </div>

            <div id="field-slug">
              <label htmlFor="field-slug-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Đường dẫn tĩnh (Slug / Alias) <span className="text-rose-500">*</span>
              </label>
              <input
                id="field-slug-input"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setManualSlug(true);
                  handleChange('slug', e.target.value);
                }}
                placeholder="vi-du: tu-van-chuyen-doi-so-bim"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div id="field-summary">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="field-summary-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tóm tắt dịch vụ (Summary)
                </label>
                <AiMagicWand
                  label="Tóm tắt từ bài viết"
                  title="Tự động đọc nội dung chi tiết và viết tóm tắt súc tích"
                  onTrigger={handleAiSummary}
                  disabled={!formData.title.trim() && !formData.description.trim()}
                />
              </div>
              <textarea
                id="field-summary-input"
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={(e) => handleChange('summary', e.target.value)}
                placeholder="Mô tả tóm tắt 2-3 câu về giá trị nổi bật dịch vụ mang lại..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* SECTION 2: THẺ NỘI DUNG & LIÊN KẾT */}
          <div
            id="section_classification"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Layers className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2. Phân loại & Liên kết</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div id="field-tags">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="field-tags-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Thẻ nội dung (Tags)
                  </label>
                  <AiMagicWand
                    label="Gợi ý Tags"
                    title="Tự động bóc tách từ khóa chuyên môn kỹ thuật"
                    onTrigger={handleAiTags}
                    disabled={!formData.title.trim()}
                  />
                </div>
                <input
                  id="field-tags-input"
                  name="tags"
                  type="text"
                  value={formData.tags || ''}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="Ví dụ: BIM, chuyển đổi số, kiểm định cầu, TCVN"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div id="field-related">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sản phẩm / Phần mềm liên quan áp dụng
                  </label>
                  <AiMagicWand
                    label="Gợi ý sản phẩm"
                    title="AI tự động đề xuất phần mềm liên quan áp dụng cho dịch vụ"
                    onTrigger={handleAiRelatedProducts}
                    disabled={!formData.title.trim() || productOptions.length === 0}
                  />
                </div>
                <SearchableMultiSelect
                  options={productOptions}
                  selectedIds={formData.related_product_ids ?? []}
                  onChange={(ids) => handleChange('related_product_ids', ids)}
                  placeholder="Chọn sản phẩm liên quan..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: NỘI DUNG MÔ TẢ CHI TIẾT */}
          <div
            id="field-description"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  3. Nội dung mô tả chi tiết & Quy trình
                </h3>
              </div>
              <AiMagicWand
                label="Tạo khung quy trình"
                title="Tạo khung dàn ý dịch vụ chuẩn mẫu B2B (Căn cứ tiêu chuẩn, Lộ trình các bước & Cam kết CIC)"
                onTrigger={handleAiOutline}
                disabled={!formData.title.trim()}
              />
            </div>

            <div>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleChange('description', value)}
                allowedEmbeds={['cta', 'form']}
                minHeight="360px"
              />
            </div>
          </div>

          {/* SECTION 4: MEDIA */}
          <div
            id="field-thumbnail_url"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <ImageIcon className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                4. Hình ảnh đại diện
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ảnh chính dịch vụ</label>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left hover:border-orange-400 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              >
                {formData.thumbnail_url ? (
                  <>
                    <img src={formData.thumbnail_url} alt="Ảnh đại diện dịch vụ" className="aspect-[16/7] w-full object-cover" />
                    <span className="block px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Chọn hoặc tải ảnh khác</span>
                  </>
                ) : (
                  <span className="flex min-h-32 flex-col items-center justify-center gap-2 p-4 text-xs font-semibold text-slate-500">
                    <ImageIcon className="h-7 w-7 text-orange-500" />
                    Chọn hoặc tải ảnh từ thư viện
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 5: SEO */}
          <div
            id="field-seo_title"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  5. Cấu hình SEO Google
                </h3>
              </div>
              <AiMagicWand
                label="Tối ưu SEO"
                title="Tự động sinh bộ 3 thẻ Title, Description, Keyword chuẩn Google"
                onTrigger={handleAiSeo}
                disabled={!formData.title.trim()}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                SEO Title (Tiêu đề tìm kiếm)
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                placeholder="Ví dụ: Dịch vụ Tư vấn Chuyển đổi số BIM — Bản quyền & Chuyển giao | CIC"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                SEO Description (Mô tả tìm kiếm)
              </label>
              <textarea
                rows={2}
                value={formData.meta_description}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                placeholder="Mô tả ngắn 135-155 ký tự hiển thị trên kết quả tìm kiếm Google..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                SEO Keywords
              </label>
              <input
                type="text"
                value={formData.meta_keywords}
                onChange={(e) => handleChange('meta_keywords', e.target.value)}
                placeholder="Ví dụ: tư vấn BIM, chuyển giao công nghệ, kiểm định tải trọng cầu, CIC"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Publishing sidebar */}
        <div className="cms-sticky-aside lg:col-span-4 space-y-5">
          {/* Trạng thái chất lượng xuất bản */}
          <ContentQualityPanel
            title="Trạng thái xuất bản"
            onFieldFocus={handleFieldFocus}
            checks={[
              { label: 'Tên dịch vụ', passed: Boolean(formData.title.trim()), required: true, group: 'content', fieldKey: 'title' },
              { label: 'Đường dẫn tĩnh (Slug) chuẩn', passed: Boolean(formData.slug.trim()), required: true, group: 'seo', fieldKey: 'slug' },
              { label: 'Tóm tắt ngắn (Summary)', passed: formData.summary.trim().length >= 20, required: true, group: 'content', fieldKey: 'summary' },
              {
                label: 'Nội dung mô tả chi tiết',
                passed: formData.description.replace(/<[^>]+>/g, '').trim().length > 30,
                required: true,
                group: 'content',
                fieldKey: 'description',
              },
              { label: 'Ảnh đại diện dịch vụ', passed: Boolean(formData.thumbnail_url), required: true, group: 'media', fieldKey: 'thumbnail_url' },
              {
                label: 'SEO Title & Description',
                passed: Boolean(formData.meta_title.trim() && formData.meta_description.trim()),
                required: false,
                group: 'seo',
                fieldKey: 'seo_title',
              },
              { label: 'Thẻ phân loại Tags', passed: Boolean(formData.tags?.trim()), required: false, group: 'classification', fieldKey: 'tags' },
            ]}
          />

          {/* XUẤT BẢN & HIỂN THỊ */}
          <div
            id="section_publishing"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Globe className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Xuất bản & Hiển thị
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Trạng thái xuất bản
                </label>
                <select
                  value={formData.editorial_status}
                  onChange={(e) => handleChange('editorial_status', e.target.value as EditorialStatus)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 font-bold"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMediaPickerOpen && (
        <PageMediaPickerModal
          currentId={formData.thumbnail_url || ''}
          returnValue="url"
          locale={locale}
          onClose={() => setIsMediaPickerOpen(false)}
          onConfirm={(mediaUrl) => {
            if (mediaUrl) handleChange('thumbnail_url', mediaUrl);
          }}
        />
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Eye,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Link2,
  RotateCcw,
  Save,
  Search,
  Send,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import { CmsConfirmModal } from '@/shared/ui/cms';
import { ContentQualityPanel } from '../../components/ContentQualityPanel';
import { SearchableMultiSelect } from '../../components/SearchableSelect';
import type { CmsMediaPickerItem } from '../../data/MediaPickerDataSource';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { findPageBuilderImage, PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import type { NewsArticle } from '../news/types';
import type { EventItem, RelatedProductItem } from './types';
import type { CmsLocale } from '../../data/CmsDataSource';
import { FEATURED_CONTENT_LIMITS } from '../featuredContentPolicy';
import { sanitizeCmsErrorMessage } from '@/shared/ui/cms/errorUtils';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import {
  generateSeoAction,
  generateSummaryAction,
  extractTagsAction,
  generateOutlineAction,
  suggestRelatedProductsForNewsAction,
  suggestRelatedNewsAction,
  suggestRelatedEventsAction,
  generateEventThemeAction,
} from '@/features/ai-operator/server/shared-actions';
import { translateAndCreateEnEventAction } from '@/features/events/server/actions';

interface EventsFormViewProps {
  eventToEdit: EventItem | null;
  locale?: CmsLocale;
  relatedEvents: EventItem[];
  relatedArticles: NewsArticle[];
  relatedProducts: RelatedProductItem[];
  mediaImages: CmsMediaPickerItem[];
  featuredCount: number;
  onSave: (data: Partial<EventItem>) => Promise<void> | void;
  onOpenPreview: (data: EventItem) => void;
  onCancel: () => void;
  onMessage?: (message: string, tone?: 'success' | 'error' | 'info') => void;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';

export const EventsFormView: React.FC<EventsFormViewProps> = ({
  eventToEdit,
  locale = 'vi',
  relatedEvents,
  relatedArticles,
  relatedProducts,
  mediaImages,
  featuredCount,
  onSave,
  onOpenPreview,
  onCancel,
  onMessage,
}) => {
  const [title, setTitle] = useState(eventToEdit?.title || '');
  const [chuDe, setChuDe] = useState(eventToEdit?.chu_de || '');
  const [alias, setAlias] = useState(eventToEdit?.alias || '');
  const [manualAlias, setManualAlias] = useState(false);
  const [place, setPlace] = useState(eventToEdit?.place || '');
  const [timeEvent, setTimeEvent] = useState((eventToEdit?.time_event || new Date().toISOString()).slice(0, 16));
  const [endTime, setEndTime] = useState((eventToEdit?.end_time || '').slice(0, 16));
  const [linkDangky, setLinkDangky] = useState(eventToEdit?.link_dangky || '');
  const [ordering, setOrdering] = useState(eventToEdit?.ordering || 1);
  const [image, setImage] = useState(eventToEdit?.image || '');
  const [content, setContent] = useState(eventToEdit?.content || '');
  const [eventRelated, setEventRelated] = useState<string[]>(eventToEdit?.event_related || []);
  const [newsRelated, setNewsRelated] = useState<string[]>(eventToEdit?.news_related || []);
  const [productsRelated, setProductsRelated] = useState<string[]>(eventToEdit?.products_related || []);
  const [tagsText, setTagsText] = useState(
    Array.isArray(eventToEdit?.tags) ? eventToEdit.tags.join(', ') : eventToEdit?.tags || ''
  );
  const published = eventToEdit?.published ?? false;
  const [isHot, setIsHot] = useState(eventToEdit?.is_hot ?? false);
  const [showInHome, setShowInHome] = useState(eventToEdit?.show_in_home ?? false);
  const [createdTime] = useState((eventToEdit?.created_time || new Date().toISOString()).slice(0, 16));
  const [summary, setSummary] = useState(eventToEdit?.summary || '');
  const [seoTitle, setSeoTitle] = useState(eventToEdit?.seo_title || '');
  const [seoKeyword, setSeoKeyword] = useState(eventToEdit?.seo_keyword || '');
  const [seoDescription, setSeoDescription] = useState(eventToEdit?.seo_description || '');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingType, setSubmittingType] = useState<'draft' | 'publish' | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingAgendaHtml, setPendingAgendaHtml] = useState<string | null>(null);

  // AI Co-pilot State
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [hasAiAutoFilled, setHasAiAutoFilled] = useState(false);
  const [undoSnapshot, setUndoSnapshot] = useState<{
    chuDe: string;
    alias: string;
    summary: string;
    tagsText: string;
    seoTitle: string;
    seoKeyword: string;
    seoDescription: string;
    productsRelated: string[];
    newsRelated: string[];
    eventRelated: string[];
  } | null>(null);

  // English Translation State
  const [isTranslatingEn, setIsTranslatingEn] = useState(false);
  const [enCreatedInfo, setEnCreatedInfo] = useState<{ enId: number | string; enName: string; enUrl: string } | null>(
    null
  );

  useEffect(() => {
    if (!manualAlias) setAlias(slugify(title));
  }, [title, manualAlias]);

  // Kiểm tra 3 trường neo cốt lõi
  const isAnchorsReady = Boolean(title.trim() && timeEvent && endTime);

  const payload = (nextPublished = published): Partial<EventItem> => ({
    title,
    chu_de: chuDe,
    alias: alias || slugify(title),
    place,
    time_event: timeEvent,
    end_time: endTime,
    specific_time: '',
    link_dangky: linkDangky,
    tawk_to: '',
    ordering: Number(ordering) || 1,
    image,
    content,
    event_related: eventRelated,
    news_related: newsRelated,
    products_related: productsRelated,
    tags: tagsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    published: nextPublished,
    is_hot: isHot,
    show_in_home: isHot || showInHome,
    created_time: createdTime,
    summary,
    seo_title: seoTitle,
    seo_keyword: seoKeyword,
    seo_description: seoDescription,
  });

  // Kích hoạt AI Co-pilot tự động điền
  const handleSmartAutoFill = async () => {
    if (!title.trim() || !timeEvent || !endTime) {
      setSubmitError('Vui lòng nhập Tiêu đề, Thời gian bắt đầu và kết thúc trước khi kích hoạt AI Co-pilot.');
      return;
    }

    setSubmitError(null);
    setIsAutoFilling(true);

    try {
      // Lưu snapshot để Hoàn tác
      setUndoSnapshot({
        chuDe,
        alias,
        summary,
        tagsText,
        seoTitle,
        seoKeyword,
        seoDescription,
        productsRelated: [...productsRelated],
        newsRelated: [...newsRelated],
        eventRelated: [...eventRelated],
      });

      const contentContext = content.trim()
        ? content
        : `Sự kiện: ${title}. Địa điểm: ${place || 'Trực tuyến'}. Thời gian: ${timeEvent} đến ${endTime}.`;

      if (!alias.trim() && !manualAlias) setAlias(slugify(title));

      // Thực thi song song các tác vụ AI
      const [themeRes, summaryRes, tagsRes, seoRes, relProdsRes, relNewsRes, relEventsRes] = await Promise.all([
        !chuDe.trim()
          ? generateEventThemeAction({ title }).catch((err) => {
              console.warn('AI Theme failed:', err);
              return { chuDe: '' };
            })
          : Promise.resolve({ chuDe: '' }),
        !summary.trim()
          ? generateSummaryAction({
              title,
              categoryName: 'Hội thảo & Sự kiện',
              content: contentContext,
              maxLength: 220,
            }).catch((err) => {
              console.warn('AI Summary failed:', err);
              return { summary: '' };
            })
          : Promise.resolve({ summary: '' }),
        !tagsText.trim()
          ? extractTagsAction({
              title,
              content: contentContext,
              count: 6,
            }).catch((err) => {
              console.warn('AI Tags failed:', err);
              return { tags: [] };
            })
          : Promise.resolve({ tags: [] }),
        !seoTitle.trim() || !seoDescription.trim()
          ? generateSeoAction({
              title,
              categoryName: 'Sự kiện CIC',
              content: contentContext,
              moduleType: 'event',
            }).catch((err) => {
              console.warn('AI SEO failed:', err);
              return { seo_title: '', seo_description: '', seo_keyword: '' };
            })
          : Promise.resolve({ seo_title: '', seo_description: '', seo_keyword: '' }),
        productsRelated.length === 0 && relatedProducts.length > 0
          ? suggestRelatedProductsForNewsAction({
              title,
              categoryName: 'Hội thảo',
              content: contentContext,
              candidateProducts: relatedProducts.map((p) => ({ id: p.id, name: p.name })),
            }).catch((err) => {
              console.warn('AI Related Products failed:', err);
              return { selectedProductIds: [] };
            })
          : Promise.resolve({ selectedProductIds: [] }),
        newsRelated.length === 0 && relatedArticles.length > 0
          ? suggestRelatedNewsAction({
              title,
              categoryName: 'Sự kiện',
              summary,
              content: contentContext,
              candidateArticles: relatedArticles.map((a) => ({ id: a.id, title: a.title })),
              currentArticleId: null,
            }).catch((err) => {
              console.warn('AI Related News failed:', err);
              return { selectedNewsIds: [] };
            })
          : Promise.resolve({ selectedNewsIds: [] }),
        eventRelated.length === 0 && relatedEvents.length > 0
          ? suggestRelatedEventsAction({
              title,
              summary,
              content: contentContext,
              candidateEvents: relatedEvents
                .filter((e) => e.id !== eventToEdit?.id)
                .map((e) => ({ id: e.id, title: e.title })),
              currentEventId: eventToEdit?.id,
            }).catch((err) => {
              console.warn('AI Related Events failed:', err);
              return { selectedEventIds: [] };
            })
          : Promise.resolve({ selectedEventIds: [] }),
      ]);

      if (themeRes.chuDe) setChuDe(themeRes.chuDe);
      if (summaryRes.summary) setSummary(summaryRes.summary);
      if (tagsRes.tags.length > 0) setTagsText(tagsRes.tags.join(', '));
      if (seoRes.seo_title) setSeoTitle(seoRes.seo_title);
      if (seoRes.seo_description) setSeoDescription(seoRes.seo_description);
      if (seoRes.seo_keyword) setSeoKeyword(seoRes.seo_keyword);
      if (relProdsRes.selectedProductIds?.length > 0) {
        setProductsRelated((prev) => Array.from(new Set([...prev, ...relProdsRes.selectedProductIds])));
      }
      if (relNewsRes.selectedNewsIds?.length > 0) {
        setNewsRelated((prev) => Array.from(new Set([...prev, ...relNewsRes.selectedNewsIds])));
      }
      if (relEventsRes.selectedEventIds?.length > 0) {
        setEventRelated((prev) => Array.from(new Set([...prev, ...relEventsRes.selectedEventIds])));
      }

      setHasAiAutoFilled(true);
      onMessage?.('✦ Đã tự động điền Chủ đề, Tóm tắt, Bộ 3 SEO, Tags và Gợi ý liên quan!', 'success');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Lỗi khi kích hoạt AI Co-pilot');
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Hoàn tác AI Auto-Fill
  const handleUndoAutoFill = () => {
    if (!undoSnapshot) return;
    setChuDe(undoSnapshot.chuDe);
    setAlias(undoSnapshot.alias);
    setSummary(undoSnapshot.summary);
    setTagsText(undoSnapshot.tagsText);
    setSeoTitle(undoSnapshot.seoTitle);
    setSeoDescription(undoSnapshot.seoDescription);
    setSeoKeyword(undoSnapshot.seoKeyword);
    setProductsRelated(undoSnapshot.productsRelated);
    setNewsRelated(undoSnapshot.newsRelated);
    setEventRelated(undoSnapshot.eventRelated);
    setHasAiAutoFilled(false);
    setUndoSnapshot(null);
    onMessage?.('Đã hoàn tác các trường về trạng thái ban đầu.', 'info');
  };

  // Dịch sang Tiếng Anh 1-Click
  const handleTranslateToEn = async () => {
    if (!title.trim() || !timeEvent || !endTime) {
      setSubmitError('Vui lòng nhập Tiêu đề, Thời gian bắt đầu và kết thúc trước khi dịch sang tiếng Anh.');
      return;
    }

    setIsTranslatingEn(true);
    setSubmitError(null);

    try {
      const res = await translateAndCreateEnEventAction({
        sourceEventId: eventToEdit?.id,
        title,
        chuDe,
        place,
        timeEvent,
        endTime,
        linkDangky,
        summary,
        content: content || `<p>Chi tiết sự kiện: ${title}</p>`,
        image,
        tags: tagsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        productsRelated,
        newsRelated,
        eventRelated,
        ordering: Number(ordering) || 1,
        seoTitle,
        seoDescription,
        seoKeyword,
      });

      setEnCreatedInfo({
        enId: res.enId,
        enName: res.enTitle,
        enUrl: `/en/events/${res.enAlias}`,
      });

      onMessage?.(
        res.isUpdate
          ? `✦ Đã cập nhật thành công bản dịch Tiếng Anh: "${res.enTitle}"`
          : `✦ Đã dịch và tạo thành công bản nháp Tiếng Anh: "${res.enTitle}"`,
        'success'
      );
    } catch (err) {
      setSubmitError(sanitizeCmsErrorMessage(err, 'Dịch sang tiếng Anh thất bại. Vui lòng thử lại.'));
    } finally {
      setIsTranslatingEn(false);
    }
  };

  const save = async (nextPublished: boolean) => {
    setSubmitError(null);
    if (!title.trim() || !timeEvent || !endTime || !content.trim()) {
      setSubmitError('Vui lòng nhập tiêu đề, thời gian bắt đầu, thời gian kết thúc và nội dung sự kiện.');
      return;
    }
    if (new Date(endTime).getTime() <= new Date(timeEvent).getTime()) {
      setSubmitError('Thời gian kết thúc phải sau thời gian bắt đầu.');
      return;
    }
    if (isHot && !eventToEdit?.is_hot && featuredCount >= FEATURED_CONTENT_LIMITS.event) {
      setSubmitError(`Chỉ được chọn ${FEATURED_CONTENT_LIMITS.event} sự kiện nổi bật. Hãy bỏ chọn sự kiện hiện tại trước.`);
      return;
    }
    setIsSubmitting(true);
    setSubmittingType(nextPublished ? 'publish' : 'draft');
    try {
      await onSave(payload(nextPublished));
    } catch (err) {
      setSubmitError(sanitizeCmsErrorMessage(err, 'Lưu sự kiện thất bại. Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
      setSubmittingType(null);
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
          : el.closest('section') || el) as HTMLElement;

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

  return (
    <div className="space-y-5 pb-16">
      {/* Header Sticky Action Bar */}
      <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800 disabled:opacity-50 cursor-pointer"
            aria-label="Quay lại danh sách"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-bold text-orange-600">SỰ KIỆN</p>
            <h1 className="font-black dark:text-white">{eventToEdit ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {locale === 'vi' && (
            <CmsButton
              variant="secondary"
              size="sm"
              disabled={isSubmitting || isTranslatingEn}
              loading={isTranslatingEn}
              loadingText="Đang dịch & tạo bản EN..."
              onClick={handleTranslateToEn}
              leadingIcon={<Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
              title="Dịch toàn bộ sự kiện, thông tin & SEO và tạo bản nháp sang Tiếng Anh"
            >
              Dịch sang bản Tiếng Anh
            </CmsButton>
          )}

          <CmsButton
            variant="secondary"
            size="sm"
            leadingIcon={<Eye className="h-4 w-4" />}
            disabled={isSubmitting}
            onClick={() => onOpenPreview({ ...(eventToEdit || {}), ...payload() } as EventItem)}
          >
            Xem trước
          </CmsButton>

          <CmsButton
            variant="secondary"
            size="sm"
            leadingIcon={<Save className="h-4 w-4" />}
            loading={isSubmitting && submittingType === 'draft'}
            loadingText="Đang lưu..."
            disabled={isSubmitting}
            onClick={() => void save(false)}
          >
            Lưu nháp
          </CmsButton>

          <CmsButton
            variant="primary"
            size="sm"
            leadingIcon={<Send className="h-4 w-4" />}
            loading={isSubmitting && submittingType === 'publish'}
            loadingText="Đang xuất bản..."
            disabled={isSubmitting}
            onClick={() => void save(true)}
          >
            Xuất bản
          </CmsButton>
        </div>
      </header>

      {/* English Draft Created Banner */}
      {enCreatedInfo && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
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

      {/* Undo Notification Banner */}
      {hasAiAutoFilled && undoSnapshot && (
        <div className="rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 p-3.5 flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-semibold text-rose-950 dark:text-rose-100">
              AI Co-pilot đã tự động điền dữ liệu. Nếu chưa ưng ý, bạn có thể hoàn tác ngay:
            </span>
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

      {/* Error Alert */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0 flex-1">{submitError}</div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <main className="space-y-5">
          {/* Section 1: Thông tin sự kiện & Smart Trigger Bar */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <Calendar className="h-5 w-5 text-orange-600" />
                Thông tin sự kiện
              </div>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Thông tin bắt buộc (*)
              </span>
            </div>

            {/* 1. Các trường neo cốt lõi */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass} htmlFor="field-title">Tiêu đề sự kiện *</label>
                <input
                  id="field-title"
                  name="title"
                  className={inputClass}
                  value={title}
                  placeholder="Ví dụ: Hội thảo: Đột Phá Ứng Dụng AI Trong Vận Hành Cảng Biển..."
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="field-time_event">Thời gian bắt đầu *</label>
                <input
                  id="field-time_event"
                  name="time_event"
                  type="datetime-local"
                  className={inputClass}
                  value={timeEvent}
                  onChange={(e) => setTimeEvent(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="field-end_time">Thời gian kết thúc *</label>
                <input
                  id="field-end_time"
                  name="end_time"
                  type="datetime-local"
                  min={timeEvent}
                  className={inputClass}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="field-place">Địa điểm / Hình thức tổ chức</label>
                <input
                  id="field-place"
                  name="place"
                  className={inputClass}
                  value={place}
                  placeholder="Ví dụ: Online qua Zoom hoặc Khách sạn Daewoo, Hà Nội"
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Link đăng ký tham dự</label>
                <input
                  className={inputClass}
                  value={linkDangky}
                  placeholder="https://forms.gle/... hoặc liên kết landing page"
                  onChange={(e) => setLinkDangky(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Chủ đề sự kiện
                  </label>
                  <AiMagicWand
                    label="Tạo chủ đề"
                    size="xs"
                    disabled={!title.trim()}
                    onTrigger={async () => {
                      const res = await generateEventThemeAction({ title });
                      if (res.chuDe) {
                        setChuDe(res.chuDe);
                        onMessage?.('✦ Đã tạo chủ đề sự kiện!', 'success');
                      }
                    }}
                  />
                </div>
                <input
                  className={inputClass}
                  value={chuDe}
                  placeholder="Chủ đề chính hoặc thông điệp của sự kiện"
                  onChange={(e) => setChuDe(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tóm tắt giới thiệu (Sapo)
                  </label>
                  <AiMagicWand
                    label="Viết lại tóm tắt"
                    size="xs"
                    disabled={!title.trim()}
                    onTrigger={async () => {
                      const res = await generateSummaryAction({
                        title,
                        categoryName: 'Hội thảo & Sự kiện',
                        content: content.trim() || `Sự kiện: ${title}. Địa điểm: ${place || 'Trực tuyến'}`,
                        maxLength: 220,
                      });
                      if (res.summary) {
                        setSummary(res.summary);
                        onMessage?.('✦ Đã tối ưu tóm tắt sự kiện!', 'success');
                      }
                    }}
                  />
                </div>
                <textarea
                  id="field-summary"
                  name="summary"
                  rows={3}
                  className={inputClass}
                  value={summary}
                  placeholder="2-3 câu nêu bối cảnh, đối tượng tham gia và giá trị khách hàng nhận được..."
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </div>

            {/* Smart Trigger Bar Co-pilot */}
            <div
              className={`mt-4 rounded-xl border p-4 transition-all duration-200 ${
                isAnchorsReady
                  ? 'border-orange-300 bg-linear-to-r from-orange-50 to-amber-50/50 dark:border-orange-900/60 dark:from-orange-950/30 dark:to-amber-950/20'
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
                        ? 'Trợ lý AI Co-pilot: Sẵn sàng tự động điền Chủ đề, Tóm tắt, SEO, Tags & Gợi ý liên quan!'
                        : 'Trợ lý AI Co-pilot (Nhập Tiêu đề, Thời gian bắt đầu và kết thúc ở trên để mở khóa)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAnchorsReady
                      ? 'AI sẽ tự động tối ưu SEO Google, gắn thẻ Tags, đề xuất Sản phẩm và Tin liên quan từ cơ sở dữ liệu.'
                      : 'Hệ thống cần tối thiểu Tiêu đề và Thời gian sự kiện để nhận diện ngữ cảnh và hỗ trợ điền tự động.'}
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

            {/* Cấu hình đường dẫn tĩnh */}
            <div className="grid gap-4 md:grid-cols-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-4">
              <div>
                <label className={labelClass}>Alias (Đường dẫn tĩnh)</label>
                <input
                  className={inputClass}
                  value={alias}
                  placeholder="duong-dan-su-kien"
                  onChange={(e) => {
                    setManualAlias(true);
                    setAlias(e.target.value);
                  }}
                />
              </div>

              <div>
                <label className={labelClass}>Thứ tự hiển thị</label>
                <input
                  type="number"
                  className={inputClass}
                  value={ordering}
                  onChange={(e) => setOrdering(Number(e.target.value))}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Nội dung & Agenda */}
          <section id="field-content" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <FileText className="h-5 w-5 text-orange-600" />
                Nội dung & Khung chương trình (Agenda) *
              </div>
              <AiMagicWand
                label="Tạo khung Agenda"
                size="xs"
                disabled={!title.trim()}
                onTrigger={async () => {
                  const res = await generateOutlineAction({
                    title,
                    moduleType: 'event',
                    notes: `Địa điểm: ${place || 'Trực tuyến'}`,
                  });
                  if (res.outlineHtml) {
                    if (content.trim() && content.trim() !== '<p></p>') {
                      setPendingAgendaHtml(res.outlineHtml);
                    } else {
                      setContent(res.outlineHtml);
                      onMessage?.('✦ Đã tạo khung Agenda sự kiện chuẩn!', 'success');
                    }
                  }
                }}
              />
            </div>
            <RichTextEditor
              value={content}
              onChange={setContent}
              minHeight="340px"
              allowedEmbeds={['cta', 'form', 'video']}
            />
          </section>

          {/* Section 3: Nội dung liên quan */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
              <Link2 className="h-5 w-5 text-orange-600" />
              Nội dung liên quan
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Sự kiện liên quan ({eventRelated.length})
                  </label>
                  <AiMagicWand
                    label="Gợi ý sự kiện"
                    size="xs"
                    disabled={!title.trim() || relatedEvents.length === 0}
                    onTrigger={async () => {
                      const res = await suggestRelatedEventsAction({
                        title,
                        summary,
                        content,
                        candidateEvents: relatedEvents
                          .filter((e) => e.id !== eventToEdit?.id)
                          .map((e) => ({ id: e.id, title: e.title })),
                        currentEventId: eventToEdit?.id,
                      });
                      if (res.selectedEventIds.length > 0) {
                        setEventRelated((prev) => Array.from(new Set([...prev, ...res.selectedEventIds])));
                        onMessage?.(`✦ Đã gợi ý ${res.selectedEventIds.length} sự kiện liên quan!`, 'success');
                      } else {
                        onMessage?.('Không tìm thấy sự kiện nào có liên quan.', 'info');
                      }
                    }}
                  />
                </div>
                <SearchableMultiSelect
                  options={relatedEvents
                    .filter((item) => item.id !== eventToEdit?.id)
                    .map((item) => ({ id: item.id, label: item.title }))}
                  selectedIds={eventRelated}
                  onChange={setEventRelated}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tin tức liên quan ({newsRelated.length})
                  </label>
                  <AiMagicWand
                    label="Gợi ý tin tức"
                    size="xs"
                    disabled={!title.trim() || relatedArticles.length === 0}
                    onTrigger={async () => {
                      const res = await suggestRelatedNewsAction({
                        title,
                        categoryName: 'Sự kiện',
                        summary,
                        content,
                        candidateArticles: relatedArticles.map((a) => ({ id: a.id, title: a.title })),
                        currentArticleId: null,
                      });
                      if (res.selectedNewsIds.length > 0) {
                        setNewsRelated((prev) => Array.from(new Set([...prev, ...res.selectedNewsIds])));
                        onMessage?.(`✦ Đã gợi ý ${res.selectedNewsIds.length} bài tin tức liên quan!`, 'success');
                      } else {
                        onMessage?.('Không tìm thấy tin tức nào có liên quan.', 'info');
                      }
                    }}
                  />
                </div>
                <SearchableMultiSelect
                  options={relatedArticles.map((item) => ({ id: item.id, label: item.title }))}
                  selectedIds={newsRelated}
                  onChange={setNewsRelated}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Sản phẩm liên quan ({productsRelated.length})
                  </label>
                  <AiMagicWand
                    label="Gợi ý sản phẩm"
                    size="xs"
                    disabled={!title.trim() || relatedProducts.length === 0}
                    onTrigger={async () => {
                      const res = await suggestRelatedProductsForNewsAction({
                        title,
                        categoryName: 'Hội thảo',
                        content,
                        candidateProducts: relatedProducts.map((p) => ({ id: p.id, name: p.name })),
                      });
                      if (res.selectedProductIds.length > 0) {
                        setProductsRelated((prev) => Array.from(new Set([...prev, ...res.selectedProductIds])));
                        onMessage?.(`✦ Đã gợi ý ${res.selectedProductIds.length} sản phẩm liên quan!`, 'success');
                      } else {
                        onMessage?.('Không tìm thấy sản phẩm nào có liên quan.', 'info');
                      }
                    }}
                  />
                </div>
                <SearchableMultiSelect
                  options={relatedProducts.map((item) => ({ id: item.id, label: item.name }))}
                  selectedIds={productsRelated}
                  onChange={setProductsRelated}
                />
              </div>
            </div>
          </section>
        </main>

        {/* Aside Sidebar */}
        <aside className="space-y-5">
          <ContentQualityPanel
            title="Trạng thái xuất bản"
            onFieldFocus={handleFieldFocus}
            checks={[
              { label: 'Tiêu đề sự kiện', passed: Boolean(title.trim()), required: true, fieldKey: 'title', group: 'content' },
              { label: 'Thời gian bắt đầu', passed: Boolean(timeEvent), required: true, fieldKey: 'time_event', group: 'business' },
              {
                label: 'Thời gian kết thúc hợp lệ',
                passed: Boolean(endTime) && new Date(endTime).getTime() > new Date(timeEvent).getTime(),
                required: true,
                fieldKey: 'end_time',
                group: 'business',
              },
              { label: 'Địa điểm / hình thức', passed: Boolean(place.trim()), required: true, fieldKey: 'place', group: 'content' },
              { label: 'Tóm tắt giới thiệu', passed: Boolean(summary.trim()), required: true, fieldKey: 'summary', group: 'content' },
              {
                label: 'Nội dung sự kiện',
                passed: content.replace(/<[^>]+>/g, '').trim().length > 30,
                required: true,
                fieldKey: 'content',
                group: 'content',
              },
              { label: 'Hình ảnh đại diện', passed: Boolean(image), required: true, fieldKey: 'image', group: 'media' },
            ]}
          />

          {/* Media & Tags */}
          <section id="field-image" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
              <ImageIcon className="h-5 w-5 text-orange-600" />
              Media & Thẻ Tags
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Hình ảnh đại diện</label>
                {image && findPageBuilderImage(image, mediaImages) && (
                  <img
                    src={
                      findPageBuilderImage(image, mediaImages)?.thumbnail_url ??
                      findPageBuilderImage(image, mediaImages)?.url
                    }
                    alt=""
                    className="mb-2 aspect-video w-full rounded-xl object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="w-full rounded-xl border border-dashed border-orange-300 px-3 py-2.5 text-xs font-bold text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950/30 transition cursor-pointer"
                >
                  Chọn hoặc tải ảnh
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Thẻ Tags công nghệ
                  </label>
                  <AiMagicWand
                    label="Gợi ý Tags"
                    size="xs"
                    disabled={!title.trim()}
                    onTrigger={async () => {
                      const res = await extractTagsAction({
                        title,
                        content: content.trim() || summary.trim() || title,
                        count: 6,
                      });
                      if (res.tags.length > 0) {
                        setTagsText(res.tags.join(', '));
                        onMessage?.('✦ Đã gợi ý thẻ tags công nghệ!', 'success');
                      }
                    }}
                  />
                </div>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="Phân cách bằng dấu phẩy (VD: IDEA StatiCa, BIM, Webinar)"
                />
              </div>
            </div>
          </section>

          {/* Hiển thị & Cấu hình */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 font-black dark:text-white">
              <Star className="h-5 w-5 text-orange-600" />
              Hiển thị
            </div>
            <div className="space-y-3">
              <label className="flex items-start justify-between gap-4 text-sm font-semibold dark:text-slate-200">
                <span>
                  Sự kiện nổi bật{' '}
                  <span className="font-normal text-slate-400">
                    ({featuredCount + Number(isHot)}/{FEATURED_CONTENT_LIMITS.event})
                  </span>
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-500">
                    Sự kiện chính được section Trang chủ lấy tự động.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={isHot}
                  disabled={!isHot && featuredCount >= FEATURED_CONTENT_LIMITS.event}
                  onChange={(e) => setIsHot(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-sm font-semibold dark:text-slate-200">
                <span>Sự kiện lớn ở trang chủ</span>
                <input
                  type="checkbox"
                  checked={showInHome}
                  onChange={(e) => setShowInHome(e.target.checked)}
                />
              </label>

              <div>
                <label className={labelClass}>Thời gian tạo</label>
                <input
                  type="datetime-local"
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800`}
                  value={createdTime}
                />
              </div>
            </div>
          </section>

          {/* SEO Metadata */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black dark:text-white">
                <Search className="h-5 w-5 text-orange-600" />
                Tối ưu hóa SEO
              </div>
              <AiMagicWand
                label="Tối ưu SEO"
                size="xs"
                disabled={!title.trim()}
                onTrigger={async () => {
                  const res = await generateSeoAction({
                    title,
                    categoryName: 'Sự kiện CIC',
                    content: content.trim() || summary.trim() || title,
                    moduleType: 'event',
                  });
                  if (res.seo_title) setSeoTitle(res.seo_title);
                  if (res.seo_description) setSeoDescription(res.seo_description);
                  if (res.seo_keyword) setSeoKeyword(res.seo_keyword);
                  onMessage?.('✦ Đã tối ưu Bộ 3 thẻ SEO sự kiện!', 'success');
                }}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>SEO Title</label>
                <input
                  className={inputClass}
                  value={seoTitle}
                  placeholder="Tiêu đề chuẩn SEO Google"
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>SEO Keyword</label>
                <input
                  className={inputClass}
                  value={seoKeyword}
                  placeholder="Từ khóa cách nhau bởi dấu phẩy"
                  onChange={(e) => setSeoKeyword(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>SEO Description</label>
                <textarea
                  rows={4}
                  className={inputClass}
                  value={seoDescription}
                  placeholder="Mô tả tóm tắt chuẩn SEO (135 - 155 ký tự)"
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </div>
            </div>
          </section>
        </aside>
      </div>

      {mediaPickerOpen && (
        <PageMediaPickerModal
          currentId={image}
          returnValue="url"
          locale={locale}
          images={mediaImages}
          onClose={() => setMediaPickerOpen(false)}
          onConfirm={(val) => {
            if (val) setImage(val);
          }}
        />
      )}

      {/* AI Agenda Confirm Modal */}
      <CmsConfirmModal
        isOpen={!!pendingAgendaHtml}
        title="Thay thế nội dung bằng Agenda AI?"
        description="Nội dung hiện tại sẽ được thay thế bằng Khung chương trình chuẩn của AI. Bạn có muốn tiếp tục?"
        confirmLabel="Thay thế nội dung"
        variant="warning"
        zIndex="z-[80]"
        onClose={() => setPendingAgendaHtml(null)}
        onConfirm={() => {
          if (pendingAgendaHtml) {
            setContent(pendingAgendaHtml);
            setPendingAgendaHtml(null);
            onMessage?.('✦ Đã tạo khung Agenda sự kiện chuẩn!', 'success');
          }
        }}
      />
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Eye,
  FileText,
  Image,
  Images,
  Link2,
  Save,
  Search,
  Upload,
  X,
  Sparkles,
  RotateCcw,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import { SearchableMultiSelect } from '../../components/SearchableSelect';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import { PageMediaPickerModal } from '../static_pages/PageMediaPickerModal';
import { AiMagicWand } from '@/features/ai-operator/components/AiMagicWand';
import { ContentQualityPanel } from '@/cms/components/ContentQualityPanel';
import {
  generateProjectSmartDraftAction,
  generateSeoAction,
  generateSummaryAction,
  generateOutlineAction,
  translateFieldsAction,
} from '@/features/ai-operator/server/shared-actions';
import type { CmsProject, ProjectRelationOption } from './types';
import { FEATURED_CONTENT_LIMITS } from '../featuredContentPolicy';

interface Props {
  project: CmsProject | null;
  productOptions: ProjectRelationOption[];
  serviceOptions: ProjectRelationOption[];
  featuredCount: number;
  locale?: 'vi' | 'en';
  onSave: (project: CmsProject) => Promise<void> | void;
  onPreview: (project: CmsProject) => void;
  onCancel: () => void;
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const labelClass = 'mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300';
const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const ProjectFormView: React.FC<Props> = ({
  project,
  productOptions,
  serviceOptions,
  featuredCount,
  locale = 'vi',
  onSave,
  onPreview,
  onCancel,
}) => {
  const initial = useMemo<CmsProject>(
    () =>
      project ?? {
        id: `project_${Date.now()}`,
        title: '',
        alias: '',
        tagline: '',
        summary: '',
        content: '',
        sector: '',
        solution: '',
        technologies: [],
        customer_name: '',
        location: '',
        start_year: null,
        end_year: null,
        is_ongoing: false,
        image: '',
        products_related: [],
        services_related: [],
        is_featured: false,
        published: false,
        ordering: 0,
        seo_title: '',
        seo_keyword: '',
        seo_description: '',
        created_time: new Date().toISOString(),
        updated_time: new Date().toISOString(),
      },
    [project]
  );

  const [form, setForm] = useState(initial);
  const [technologyInput, setTechnologyInput] = useState(initial.technologies.join('\n'));
  const [manualAlias, setManualAlias] = useState(Boolean(project));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Co-pilot State
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [hasAiAutoFilled, setHasAiAutoFilled] = useState(false);
  const [previousForm, setPreviousForm] = useState<CmsProject | null>(null);
  const [isTranslatingEn, setIsTranslatingEn] = useState(false);
  const [enCreatedInfo, setEnCreatedInfo] = useState<{ enName: string; enUrl: string } | null>(null);

  const set = <K extends keyof CmsProject>(key: K, value: CmsProject[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isAnchorsReady = Boolean(
    form.title.trim().length >= 4 && form.customer_name.trim() && form.sector.trim()
  );

  const handleSmartAutoFill = async () => {
    if (!form.title.trim()) return;
    try {
      setIsAutoFilling(true);
      setPreviousForm({ ...form, technologies: splitLines(technologyInput) });

      const draft = await generateProjectSmartDraftAction({
        title: form.title.trim(),
        customer_name: form.customer_name.trim(),
        sector: form.sector.trim(),
        location: form.location.trim(),
        locale: locale as 'vi' | 'en',
      });

      setForm((prev) => ({
        ...prev,
        tagline: prev.tagline || draft.tagline,
        summary: prev.summary || draft.summary,
        solution: prev.solution || draft.solution,
        technologies: prev.technologies.length > 0 ? prev.technologies : draft.technologies,
        seo_title: prev.seo_title || draft.seo_title,
        seo_description: prev.seo_description || draft.seo_description,
        seo_keyword: prev.seo_keyword || draft.seo_keyword,
      }));

      if (!technologyInput.trim() && draft.technologies.length > 0) {
        setTechnologyInput(draft.technologies.join('\n'));
      }

      setHasAiAutoFilled(true);
      showToast('✦ Trợ lý AI đã tự động điền Tagline, Tóm tắt, Giải pháp, Công nghệ & SEO!');
    } catch (err: any) {
      showToast(err?.message || 'Không thể tự động điền với AI. Vui lòng thử lại.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleUndoAutoFill = () => {
    if (previousForm) {
      setForm({ ...previousForm });
      setTechnologyInput(previousForm.technologies.join('\n'));
      setHasAiAutoFilled(false);
      setPreviousForm(null);
      showToast('Đã hoàn tác dữ liệu về ban đầu.');
    }
  };

  const handleAiSummary = async () => {
    if (!form.title.trim() && !form.content.trim()) {
      showToast('Cần có Tên dự án hoặc Nội dung chi tiết để tạo tóm tắt.');
      return;
    }
    const res = await generateSummaryAction({
      title: form.title,
      categoryName: form.sector || 'Dự án kỹ thuật',
      content: form.content,
      maxLength: 220,
    });
    if (res.summary) {
      set('summary', res.summary);
      showToast('✦ Đã tối ưu tóm tắt dự án!');
    }
  };

  const handleAiOutline = async () => {
    if (!form.title.trim()) {
      showToast('Vui lòng nhập Tên dự án trước khi tạo dàn ý.');
      return;
    }
    const res = await generateOutlineAction({
      title: form.title,
      moduleType: 'project',
      notes: `Chủ đầu tư: ${form.customer_name || 'Đang cập nhật'}, Lĩnh vực: ${form.sector || 'Hạ tầng'}`,
    });
    if (res.outlineHtml) {
      if (form.content.trim() && form.content.trim() !== '<p></p>') {
        if (
          window.confirm(
            'Nội dung hiện tại sẽ được thay thế bằng Khung hồ sơ năng lực chuẩn của AI. Bạn có muốn tiếp tục?'
          )
        ) {
          set('content', res.outlineHtml);
          showToast('✦ Đã tạo khung hồ sơ năng lực dự án chuẩn!');
        }
      } else {
        set('content', res.outlineHtml);
        showToast('✦ Đã tạo khung hồ sơ năng lực dự án chuẩn!');
      }
    }
  };

  const handleAiSeo = async () => {
    if (!form.title.trim()) {
      showToast('Vui lòng nhập Tên dự án để tối ưu SEO.');
      return;
    }
    const res = await generateSeoAction({
      title: form.title,
      brandName: form.customer_name,
      categoryName: form.sector || 'Dự án tiêu biểu',
      content: form.content || form.summary,
      moduleType: 'project',
    });
    setForm((prev) => ({
      ...prev,
      seo_title: res.seo_title,
      seo_description: res.seo_description,
      seo_keyword: res.seo_keyword,
    }));
    showToast('✦ Đã tối ưu bộ 3 thẻ SEO Google!');
  };

  const handleTranslateToEn = async () => {
    if (!form.title.trim()) {
      showToast('Vui lòng nhập Tên dự án trước khi dịch.');
      return;
    }
    try {
      setIsTranslatingEn(true);
      const res = await translateFieldsAction({
        fields: {
          title: form.title,
          tagline: form.tagline,
          summary: form.summary,
          solution: form.solution,
          content: form.content,
          seo_title: form.seo_title,
          seo_description: form.seo_description,
        },
        targetLang: 'en',
      });

      const enSlug = slugify(res.translations.title || form.title);
      setEnCreatedInfo({
        enName: res.translations.title || form.title,
        enUrl: `/projects/${enSlug}`,
      });
      showToast('✦ Đã dịch toàn bộ hồ sơ dự án sang Tiếng Anh!');
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

        const highlightTarget = (
          el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea'
            ? el
            : el.closest('div') || el
        ) as HTMLElement;

        highlightTarget.classList.add(
          'ring-2',
          'ring-orange-500',
          'ring-offset-2',
          'dark:ring-offset-slate-900',
          'transition-all',
          'duration-300'
        );
        setTimeout(() => {
          highlightTarget.classList.remove(
            'ring-2',
            'ring-orange-500',
            'ring-offset-2',
            'dark:ring-offset-slate-900'
          );
        }, 2200);

        const focusable =
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          el instanceof HTMLButtonElement
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

  const submit = async () => {
    if (!form.title.trim()) return setError('Vui lòng nhập tên dự án.');
    if (!form.alias.trim()) return setError('Vui lòng nhập đường dẫn dự án.');
    if (form.start_year && form.end_year && form.end_year < form.start_year)
      return setError('Năm kết thúc không được nhỏ hơn năm bắt đầu.');
    if (
      form.is_featured &&
      !project?.is_featured &&
      featuredCount >= FEATURED_CONTENT_LIMITS.project
    )
      return setError(
        `Chỉ được chọn tối đa ${FEATURED_CONTENT_LIMITS.project} dự án nổi bật. Hãy bỏ chọn một dự án khác trước.`
      );
    setError('');
    try {
      setIsSubmitting(true);
      await onSave({
        ...form,
        title: form.title.trim(),
        alias: slugify(form.alias),
        technologies: splitLines(technologyInput),
        end_year: form.is_ongoing ? null : form.end_year,
        updated_time: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu dự án. Vui lòng kiểm tra lại thông tin.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header Actions */}
      <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-bold text-orange-600">DỰ ÁN</p>
            <h1 className="font-black text-slate-900 dark:text-white">
              {project ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {locale === 'vi' && (
            <CmsButton
              variant="secondary"
              size="sm"
              disabled={isSubmitting || isTranslatingEn}
              loading={isTranslatingEn}
              loadingText="Đang dịch..."
              onClick={handleTranslateToEn}
              leadingIcon={<Globe className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
              title="Dịch toàn bộ thông tin dự án sang Tiếng Anh"
            >
              Dịch sang Tiếng Anh
            </CmsButton>
          )}

          <CmsButton
            size="sm"
            variant="secondary"
            leadingIcon={<Eye className="h-4 w-4" />}
            disabled={isSubmitting}
            onClick={() => onPreview({ ...form, technologies: splitLines(technologyInput) })}
          >
            Xem trước
          </CmsButton>

          <CmsButton
            size="sm"
            variant="primary"
            leadingIcon={<Save className="h-4 w-4" />}
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Đang lưu..."
            onClick={() => void submit()}
          >
            Lưu dự án
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
                Bản dịch Tiếng Anh đã sẵn sàng
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
      {hasAiAutoFilled && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/40 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                ✦ Trợ lý AI Co-pilot: Đã tự động điền Tagline, Tóm tắt, Giải pháp, Công nghệ & Bộ 3 SEO!
              </span>
              <span className="text-slate-600 dark:text-slate-400 ml-2 hidden sm:inline">
                (Nội dung chi tiết và hình ảnh của bạn được bảo toàn 100%)
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-sm animate-in fade-in">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 xl:col-span-2">
          {/* SECTION 1: THÔNG TIN DỰ ÁN & ANCHORS */}
          <Section icon={<FileText />} title="1. Thông tin nhận diện cốt lõi">
            <div className="grid gap-4 md:grid-cols-2">
              <div id="field-title" className="md:col-span-2">
                <span className={labelClass}>Tên dự án *</span>
                <input
                  id="field-title-input"
                  name="title"
                  className={inputClass}
                  value={form.title}
                  placeholder="Ví dụ: Tư vấn ứng dụng BIM & Mô phỏng Giao thông Cầu Nhật Tân..."
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((current) => ({
                      ...current,
                      title,
                      alias: manualAlias ? current.alias : slugify(title),
                    }));
                  }}
                />
              </div>

              <div id="field-customer_name">
                <span className={labelClass}>Chủ đầu tư / Khách hàng *</span>
                <input
                  id="field-customer_name-input"
                  name="customer_name"
                  className={inputClass}
                  value={form.customer_name}
                  placeholder="Ví dụ: Ban QLDA Thăng Long, Bộ GTVT..."
                  onChange={(e) => set('customer_name', e.target.value)}
                />
              </div>

              <div id="field-sector">
                <span className={labelClass}>Lĩnh vực dự án *</span>
                <input
                  id="field-sector-input"
                  name="sector"
                  className={inputClass}
                  value={form.sector}
                  placeholder="Ví dụ: Cầu đường, Cảng biển, Đường cao tốc..."
                  onChange={(e) => set('sector', e.target.value)}
                />
              </div>

              {/* Smart Trigger Bar */}
              <div className="md:col-span-2">
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
                            ? 'Trợ lý AI Co-pilot: Sẵn sàng tự động điền Tagline, Tóm tắt, Giải pháp & SEO!'
                            : 'Trợ lý AI Co-pilot (Nhập Tên dự án, Chủ đầu tư và Lĩnh vực ở trên để mở khóa)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isAnchorsReady
                          ? 'AI sẽ tự động nhận diện quy mô công trình, sinh thông điệp Tagline, giải pháp kỹ thuật và bộ 3 SEO Google.'
                          : `Trạng thái: ${[Boolean(form.title.trim()), Boolean(form.customer_name.trim()), Boolean(form.sector.trim())].filter(Boolean).length}/3 trường bắt buộc.`}
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
              </div>

              <div>
                <span className={labelClass}>Đường dẫn (Alias) *</span>
                <input
                  className={inputClass}
                  value={form.alias}
                  onChange={(e) => {
                    setManualAlias(true);
                    set('alias', e.target.value);
                  }}
                />
              </div>

              <div>
                <span className={labelClass}>Địa điểm thực hiện</span>
                <input
                  className={inputClass}
                  value={form.location}
                  placeholder="Ví dụ: Hà Nội, Đà Nẵng, Quốc lộ 1A..."
                  onChange={(e) => set('location', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <span className={labelClass}>Câu giới thiệu / Tagline</span>
                <input
                  className={inputClass}
                  value={form.tagline}
                  placeholder="Thông điệp ngắn nổi bật của công trình..."
                  onChange={(e) => set('tagline', e.target.value)}
                />
              </div>

              <div id="field-summary" className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={labelClass}>Mô tả tóm tắt quy mô</span>
                  <AiMagicWand
                    label="Tóm tắt từ bài viết"
                    title="Tự động đọc nội dung chi tiết và tóm tắt quy mô dự án"
                    onTrigger={handleAiSummary}
                    disabled={!form.title.trim() && !form.content.trim()}
                  />
                </div>
                <textarea
                  id="field-summary-input"
                  name="summary"
                  rows={3}
                  className={inputClass}
                  value={form.summary}
                  placeholder="Tóm tắt 1-2 câu ngắn gọn về quy mô và đóng góp của giải pháp CIC..."
                  onChange={(e) => set('summary', e.target.value)}
                />
              </div>
            </div>
          </Section>

          {/* SECTION 2: NỘI DUNG CHI TIẾT */}
          <Section
            id="field-content"
            icon={<FileText />}
            title="2. Nội dung chi tiết & Hồ sơ năng lực"
            action={
              <AiMagicWand
                label="Tạo khung hồ sơ dự án"
                title="Tạo khung dàn bài dự án chuẩn (Quy mô công trình, Thách thức kỹ thuật & Hiệu quả đạt được)"
                onTrigger={handleAiOutline}
                disabled={!form.title.trim()}
              />
            }
          >
            <RichTextEditor
              value={form.content}
              onChange={(value) => set('content', value)}
              minHeight="380px"
              allowedEmbeds={['cta', 'form', 'video']}
            />
          </Section>

          {/* SECTION 3: MEDIA */}
          <Section id="field-image" icon={<Image />} title="3. Hình ảnh công trình">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Ảnh đại diện dự án" wide>
                <ImagePickerField
                  value={form.image}
                  onChange={(image) => set('image', image)}
                  onPickFromMedia={() => setMediaPickerOpen(true)}
                />
              </Field>
            </div>
          </Section>

          {/* SECTION 4: NỘI DUNG LIÊN QUAN */}
          <Section icon={<Link2 />} title="4. Nội dung liên quan">
            <div className="space-y-4">
              <div>
                <span className={labelClass}>Sản phẩm / Phần mềm liên quan</span>
                <SearchableMultiSelect
                  options={productOptions}
                  selectedIds={form.products_related}
                  onChange={(ids) => set('products_related', ids)}
                  placeholder="Chọn sản phẩm liên quan..."
                />
              </div>
              <div>
                <span className={labelClass}>Dịch vụ liên quan</span>
                <SearchableMultiSelect
                  options={serviceOptions}
                  selectedIds={form.services_related}
                  onChange={(ids) => set('services_related', ids)}
                  placeholder="Chọn dịch vụ liên quan..."
                />
              </div>
            </div>
          </Section>
        </div>

        {/* Aside Sidebar */}
        <aside className="space-y-6">
          {/* Trạng thái chất lượng xuất bản */}
          <ContentQualityPanel
            title="Trạng thái xuất bản"
            onFieldFocus={handleFieldFocus}
            checks={[
              {
                label: 'Tên dự án',
                passed: Boolean(form.title.trim()),
                required: true,
                group: 'content',
                fieldKey: 'title',
              },
              {
                label: 'Chủ đầu tư / Khách hàng',
                passed: Boolean(form.customer_name.trim()),
                required: true,
                group: 'classification',
                fieldKey: 'customer_name',
              },
              {
                label: 'Lĩnh vực công trình',
                passed: Boolean(form.sector.trim()),
                required: true,
                group: 'classification',
                fieldKey: 'sector',
              },
              {
                label: 'Mô tả tóm tắt quy mô',
                passed: form.summary.trim().length >= 20,
                required: true,
                group: 'content',
                fieldKey: 'summary',
              },
              {
                label: 'Nội dung hồ sơ chi tiết',
                passed: form.content.replace(/<[^>]+>/g, '').trim().length > 30,
                required: true,
                group: 'content',
                fieldKey: 'content',
              },
              {
                label: 'Ảnh đại diện dự án',
                passed: Boolean(form.image),
                required: true,
                group: 'media',
                fieldKey: 'image',
              },
              {
                label: 'SEO Title & Description',
                passed: Boolean(form.seo_title.trim() && form.seo_description.trim()),
                required: false,
                group: 'seo',
                fieldKey: 'seo_title',
              },
              {
                label: 'Giải pháp & Công nghệ',
                passed: Boolean(form.solution.trim() || technologyInput.trim()),
                required: false,
                group: 'business',
                fieldKey: 'technologies',
              },
            ]}
          />

          {/* Factsheet kỹ thuật */}
          <Section icon={<Search />} title="Phân loại & Factsheet">
            <div className="space-y-4">
              <div id="field-solution">
                <Field label="Dịch vụ / Giải pháp chính">
                  <input
                    id="field-solution-input"
                    className={inputClass}
                    value={form.solution}
                    placeholder="VD: Mô hình hóa BIM & Đo dao động"
                    onChange={(e) => set('solution', e.target.value)}
                  />
                </Field>
              </div>

              <div id="field-technologies">
                <Field label="Công nghệ & Tiêu chuẩn áp dụng">
                  <textarea
                    id="field-technologies-input"
                    rows={4}
                    className={inputClass}
                    value={technologyInput}
                    onChange={(e) => setTechnologyInput(e.target.value)}
                    placeholder="Mỗi dòng một công nghệ/tiêu chuẩn (VD: TCVN 11823, SAP2000, BIM)"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Năm bắt đầu">
                  <input
                    type="number"
                    className={inputClass}
                    value={form.start_year ?? ''}
                    onChange={(e) =>
                      set('start_year', e.target.value ? Number(e.target.value) : null)
                    }
                  />
                </Field>
                <Field label="Năm kết thúc">
                  <input
                    type="number"
                    disabled={form.is_ongoing}
                    className={inputClass}
                    value={form.end_year ?? ''}
                    onChange={(e) =>
                      set('end_year', e.target.value ? Number(e.target.value) : null)
                    }
                  />
                </Field>
              </div>

              <Check
                label="Đang triển khai"
                checked={form.is_ongoing}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    is_ongoing: checked,
                    end_year: checked ? null : current.end_year,
                  }))
                }
              />
            </div>
          </Section>

          {/* Hiển thị */}
          <Section icon={<BriefcaseBusiness />} title="Hiển thị & Nổi bật">
            <div className="space-y-4">
              <Field label="Thứ tự hiển thị">
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.ordering}
                  onChange={(e) =>
                    set('ordering', Math.max(0, Number(e.target.value) || 0))
                  }
                />
              </Field>
              <label className="flex items-start gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  disabled={!form.is_featured && featuredCount >= FEATURED_CONTENT_LIMITS.project}
                  onChange={(e) => set('is_featured', e.target.checked)}
                  className="mt-0.5 size-4 accent-orange-600"
                />
                <span>
                  Dự án nổi bật{' '}
                  <span className="font-normal text-slate-400">
                    ({featuredCount + Number(form.is_featured)}/{FEATURED_CONTENT_LIMITS.project})
                  </span>
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-500">
                    Nguồn tự động cho section Dự án tiêu biểu ngoài Trang chủ.
                  </span>
                </span>
              </label>
            </div>
          </Section>

          {/* Cấu hình SEO */}
          <div id="field-seo_title">
            <Section
              icon={<Search />}
              title="Cấu hình SEO Google"
              action={
                <AiMagicWand
                  label="Tối ưu SEO"
                  title="Tự động sinh bộ 3 thẻ Title, Description, Keyword chuẩn Google"
                  onTrigger={handleAiSeo}
                  disabled={!form.title.trim()}
                />
              }
            >
              <div className="space-y-4">
                <Field label="SEO Title">
                  <input
                    className={inputClass}
                    value={form.seo_title}
                    placeholder="Dự án [Tên dự án] — Giải pháp kỹ thuật | CIC"
                    onChange={(e) => set('seo_title', e.target.value)}
                  />
                </Field>
                <Field label="SEO Keyword">
                  <input
                    className={inputClass}
                    value={form.seo_keyword}
                    placeholder="Từ khóa cách nhau bởi dấu phẩy"
                    onChange={(e) => set('seo_keyword', e.target.value)}
                  />
                </Field>
                <Field label="SEO Description">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={form.seo_description}
                    placeholder="Mô tả chuẩn Google B2B 135-155 ký tự..."
                    onChange={(e) => set('seo_description', e.target.value)}
                  />
                </Field>
              </div>
            </Section>
          </div>
        </aside>
      </div>

      {mediaPickerOpen && (
        <PageMediaPickerModal
          currentId={form.image}
          returnValue="url"
          onClose={() => setMediaPickerOpen(false)}
          onConfirm={(mediaUrl) => set('image', mediaUrl)}
        />
      )}
    </div>
  );
};

const ImagePickerField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onPickFromMedia: () => void;
}> = ({ value, onChange, onPickFromMedia }) => {
  const [fileError, setFileError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setFileError('Vui lòng chọn đúng định dạng ảnh.');
    if (file.size > 10 * 1024 * 1024) return setFileError('Ảnh không được vượt quá 10 MB.');

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        setFileError('');
      }
    };
    reader.onerror = () => setFileError('Không thể đọc tệp ảnh. Vui lòng chọn lại.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
        {value ? (
          <div className="relative">
            <img src={value} alt="Xem trước ảnh đại diện dự án" className="aspect-[16/7] w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-2 rounded-lg bg-slate-950/75 p-1.5 text-white transition hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 cursor-pointer"
              aria-label="Bỏ ảnh đã chọn"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex min-h-32 flex-col items-center justify-center gap-2 px-4 py-6 text-xs text-slate-500">
            <Image className="size-7 text-orange-500" />
            <span>Chưa chọn ảnh đại diện</span>
            <span className="text-[11px] text-slate-400">JPG, PNG, GIF hoặc WebP · tối đa 10 MB</span>
          </div>
        )}
        <div className="grid border-t border-slate-200 sm:grid-cols-2 dark:border-slate-700">
          <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-orange-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-700 focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-orange-300">
            <Upload className="size-4" />
            {value ? 'Tải ảnh khác từ máy' : 'Tải ảnh từ máy'}
            <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
          </label>
          <button
            type="button"
            onClick={onPickFromMedia}
            className="flex min-h-11 items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-500 dark:hover:bg-orange-950/20 cursor-pointer"
          >
            <Images className="size-4" />
            Chọn từ Thư viện Media
          </button>
        </div>
      </div>
      {fileError && (
        <p className="text-xs font-semibold text-red-600" role="alert">
          {fileError}
        </p>
      )}
    </div>
  );
};

const Section: React.FC<{
  id?: string;
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ id, icon, title, action, children }) => (
  <section
    id={id}
    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
  >
    <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
      <h2 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
        <span className="text-orange-600 [&>svg]:size-4">{icon}</span>
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

const Field: React.FC<{ label: string; wide?: boolean; children: React.ReactNode }> = ({
  label,
  wide,
  children,
}) => (
  <label className={wide ? 'block md:col-span-2' : 'block'}>
    <span className={labelClass}>{label}</span>
    {children}
  </label>
);

const Check: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="size-4 accent-orange-600"
    />
    {label}
  </label>
);

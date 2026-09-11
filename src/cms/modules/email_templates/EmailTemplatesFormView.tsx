import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, Save, Send, X } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import { RichTextEditor } from '../static_pages/RichTextEditor';
import {
  DOWNLOAD_VARIABLES,
  EmailAudience,
  EmailEvent,
  EmailTemplate,
  EmailTemplateStatus,
  EMAIL_EVENTS,
  INTERNAL_VARIABLES,
  SAMPLE_VALUES,
  VARIABLE_GROUPS,
} from './types';

interface Props {
  templateToEdit: EmailTemplate | null;
  workspaceLocale: 'vi' | 'en';
  onSave: (data: Partial<EmailTemplate> & { publishNow?: boolean }) => Promise<boolean | void> | void;
  onCancel: () => void;
}

const renderSample = (value: string) =>
  Object.entries(SAMPLE_VALUES).reduce((text, [token, sample]) => text.split(token).join(sample), value);

export const EmailTemplatesFormView: React.FC<Props> = ({
  templateToEdit,
  workspaceLocale,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(templateToEdit?.name ?? '');
  const [event, setEvent] = useState<EmailEvent | string>(templateToEdit?.event ?? 'product_contact');
  const [audience, setAudience] = useState<EmailAudience>(templateToEdit?.audience ?? 'customer');
  const [subject, setSubject] = useState(templateToEdit?.subject ?? '');
  const [content, setContent] = useState(templateToEdit?.content ?? '');
  const [status, setStatus] = useState<EmailTemplateStatus>(
    templateToEdit?.status === 'active' ? 'active' : 'draft'
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tokens = useMemo(() => {
    const base = VARIABLE_GROUPS.flatMap((group) => group.tokens);
    if (audience === 'internal') base.push(...INTERNAL_VARIABLES);
    if (event === 'product_download' && audience === 'customer') base.push(...DOWNLOAD_VARIABLES);
    return [...new Set(base)];
  }, [audience, event]);

  const insertToken = (token: string) => {
    setContent((current) => {
      if (!current || !current.trim()) return `<p>${token}</p>`;
      if (current.endsWith('</p>')) {
        return current.replace(/<\/p>$/, ` ${token}</p>`);
      }
      return `${current} ${token}`;
    });
  };

  const validate = (): boolean => {
    const nextErrors: string[] = [];
    if (!name.trim()) nextErrors.push('Vui lòng nhập tên mẫu email.');
    if (!subject.trim()) nextErrors.push('Vui lòng nhập tiêu đề email.');
    if (!content.trim()) nextErrors.push('Vui lòng nhập nội dung email.');

    const rawTokens = `${subject} ${content}`.match(/\{\{[^}]+\}\}/g) ?? [];
    const invalid = rawTokens.filter((token) => !tokens.includes(token));
    if (invalid.length) {
      nextErrors.push(`Biến không hợp lệ: ${[...new Set(invalid)].join(', ')}.`);
    }

    setErrors(nextErrors);
    if (nextErrors.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const handleSaveDraft = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        event,
        audience,
        subject: subject.trim(),
        content: content.trim(),
        status: 'draft',
        publishNow: false,
        workspace: workspaceLocale,
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Không thể lưu bản nháp. Vui lòng thử lại.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!validate()) return;
    setSubmitError(null);
    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        event,
        audience,
        subject: subject.trim(),
        content: content.trim(),
        status: 'active',
        publishNow: true,
        workspace: workspaceLocale,
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Không thể xuất bản mẫu email. Vui lòng thử lại.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* 1. STICKY HEADER ACTION BAR */}
      <header className="cms-sticky-action flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            title="Quay lại danh sách"
            aria-label="Quay lại danh sách"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Mẫu Email</p>
            <h1 className="text-base font-black text-slate-900 dark:text-white">
              {templateToEdit ? 'Chỉnh sửa mẫu email' : 'Thêm mới mẫu email'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setPreviewOpen(true)}
            disabled={isSubmitting}
            leadingIcon={<Eye />}
          >
            Xem trước
          </CmsButton>
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => void handleSaveDraft()}
            disabled={isSubmitting}
            leadingIcon={<Save />}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu nháp'}
          </CmsButton>
          <CmsButton
            type="button"
            size="sm"
            variant="primary"
            onClick={() => void handlePublish()}
            disabled={isSubmitting}
            leadingIcon={<Send />}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xuất bản'}
          </CmsButton>
        </div>
      </header>

      {/* Errors Alert */}
      {(errors.length > 0 || submitError) && (
        <div
          role="alert"
          className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in slide-in-from-top-2"
        >
          <AlertCircle className="size-4.5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <div className="space-y-1">
            {submitError && <p className="font-bold text-red-800 dark:text-red-200">{submitError}</p>}
            {errors.length > 0 && (
              <ul className="list-disc pl-4 space-y-0.5 font-medium">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* 2. FORM BODY */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main Content Area */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
              Tên mẫu email <span className="text-red-500">*</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Xác nhận đơn hàng, Báo giá sản phẩm..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900 outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </label>

            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
              Trạng thái
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmailTemplateStatus)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900 outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="draft">Bản nháp</option>
                <option value="active">Đã xuất bản</option>
              </select>
            </label>

            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
              Sự kiện kích hoạt
              <select
                value={event}
                onChange={(e) => setEvent(e.target.value as EmailEvent)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900 outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {EMAIL_EVENTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {workspaceLocale === 'vi' ? item.label : item.labelEn}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
              Đối tượng nhận email
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as EmailAudience)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900 outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="customer">Khách hàng</option>
                <option value="internal">Nội bộ (Nhân viên/Admin)</option>
              </select>
            </label>
          </div>

          <label className="block space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
            Tiêu đề email (Subject) <span className="text-red-500">*</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: [CIC] Xác nhận đơn hàng #{{order.code}} thành công"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900 outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                Nội dung email <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Hỗ trợ RichText và nút <strong>Source</strong> để biên tập HTML trực tiếp
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <RichTextEditor
                value={content}
                onChange={(val) => setContent(val)}
                minHeight="520px"
              />
            </div>
          </div>
        </section>

        {/* Sidebar: Variable Token Palette */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-20">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Danh sách biến nội dung</h2>
            <p className="mt-1 text-xs text-slate-500">
              Bấm vào biến để chèn vào vị trí cuối văn bản:
            </p>
          </div>

          <div className="mt-4 flex max-h-[500px] flex-wrap gap-2 overflow-y-auto pr-1">
            {tokens.map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => insertToken(token)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-slate-700 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-orange-500 dark:hover:bg-orange-950/30"
                title={`Chèn biến ${token}`}
              >
                {token}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* 3. MODAL XEM TRƯỚC VĂN BẢN VỚI DỮ LIỆU MẪU */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-preview-modal-title"
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Xem trước nội dung gửi
                </p>
                <h2 id="email-preview-modal-title" className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {renderSample(subject) || 'Chưa có tiêu đề'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Đóng xem trước"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="p-6">
              {/<[a-z][\s\S]*>/i.test(content) ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: renderSample(content) }}
                />
              ) : (
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {renderSample(content) || 'Chưa có nội dung'}
                </div>
              )}
            </div>

            <footer className="flex justify-end border-t border-slate-100 p-4 dark:border-slate-800">
              <CmsButton
                size="sm"
                variant="secondary"
                onClick={() => setPreviewOpen(false)}
              >
                Đóng
              </CmsButton>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

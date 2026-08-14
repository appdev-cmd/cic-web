import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Eye, Save } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
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

interface Props { templateToEdit: EmailTemplate | null; workspaceLocale: 'vi' | 'en'; onSave: (data: Partial<EmailTemplate>) => void; onCancel: () => void; }

const renderSample = (value: string) => Object.entries(SAMPLE_VALUES).reduce((text, [token, sample]) => text.split(token).join(sample), value);

export const EmailTemplatesFormView: React.FC<Props> = ({ templateToEdit, workspaceLocale, onSave, onCancel }) => {
  const [name, setName] = useState(templateToEdit?.name ?? '');
  const [event, setEvent] = useState<EmailEvent>(templateToEdit?.event ?? 'product_contact');
  const [audience, setAudience] = useState<EmailAudience>(templateToEdit?.audience ?? 'customer');
  const [subject, setSubject] = useState(templateToEdit?.subject ?? '');
  const [content, setContent] = useState(templateToEdit?.content ?? '');
  const [status, setStatus] = useState<EmailTemplateStatus>(templateToEdit?.status ?? 'draft');
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const tokens = useMemo(() => {
    const base = VARIABLE_GROUPS.flatMap((group) => group.tokens);
    if (audience === 'internal') base.push(...INTERNAL_VARIABLES);
    if (event === 'product_download' && audience === 'customer') base.push(...DOWNLOAD_VARIABLES);
    return [...new Set(base)];
  }, [audience, event]);

  const insertToken = (token: string) => {
    const field = contentRef.current;
    if (!field) return setContent((current) => `${current}${current ? ' ' : ''}${token}`);
    const start = field.selectionStart;
    const end = field.selectionEnd;
    setContent(`${content.slice(0, start)}${token}${content.slice(end)}`);
    requestAnimationFrame(() => { field.focus(); field.setSelectionRange(start + token.length, start + token.length); });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: string[] = [];
    if (!name.trim()) nextErrors.push('Nhập tên mẫu email.');
    if (!subject.trim()) nextErrors.push('Nhập tiêu đề email.');
    if (!content.trim()) nextErrors.push('Nhập nội dung email.');
    const rawTokens = `${subject} ${content}`.match(/\{\{[^}]+\}\}/g) ?? [];
    const invalid = rawTokens.filter((token) => !tokens.includes(token));
    if (invalid.length) nextErrors.push(`Biến không hợp lệ: ${[...new Set(invalid)].join(', ')}.`);
    if (status === 'active') nextErrors.push('Không thể xuất bản trực tiếp trong form. Hãy lưu bản nháp, xem trước rồi xuất bản từ danh sách.');
    setErrors(nextErrors);
    if (nextErrors.length) return window.scrollTo({ top: 0, behavior: 'smooth' });
    onSave({ name: name.trim(), event, audience, subject: subject.trim(), content: content.trim(), status, workspace: workspaceLocale });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <CmsButton variant="ghost" size="sm" onClick={onCancel} leadingIcon={<ArrowLeft />}>Danh sách</CmsButton>
          <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">{templateToEdit ? 'Chỉnh sửa mẫu email' : 'Thêm mẫu email'}</h1><p className="text-xs text-slate-500">Workspace {workspaceLocale.toUpperCase()} · Lưu bản nháp và xem trước trước khi xuất bản.</p></div>
        </div>
        <div className="flex flex-wrap gap-2"><CmsButton size="sm" onClick={() => setPreview(!preview)} leadingIcon={<Eye />}>Xem trước</CmsButton><CmsButton type="submit" size="sm" variant="primary" leadingIcon={<Save />}>Lưu bản nháp</CmsButton></div>
      </div>

      {errors.length > 0 && <div role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"><AlertCircle className="size-4 shrink-0"/><ul className="list-disc pl-4">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Tên mẫu <span className="text-red-500">*</span><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Trạng thái<select value={status} onChange={(e) => setStatus(e.target.value as EmailTemplateStatus)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800"><option value="draft">Bản nháp</option><option value="inactive">Ngừng sử dụng</option>{templateToEdit?.status === 'archived' && <option value="archived">Đã lưu trữ</option>}</select></label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Sự kiện<select value={event} onChange={(e) => setEvent(e.target.value as EmailEvent)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">{EMAIL_EVENTS.map((item) => <option key={item.value} value={item.value}>{workspaceLocale === 'vi' ? item.label : item.labelEn}</option>)}</select></label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Đối tượng nhận<select value={audience} onChange={(e) => setAudience(e.target.value as EmailAudience)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800"><option value="customer">Khách hàng</option><option value="internal">Nội bộ</option></select></label>
          </div>
          <label className="block space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Tiêu đề email <span className="text-red-500">*</span><input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></label>
          <label className="block space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">Nội dung email <span className="text-red-500">*</span><textarea ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} rows={15} className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-mono text-xs leading-6 text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></label>
          <p className="text-xs text-slate-500">Mẫu email chỉ quản lý nội dung. Biểu mẫu quyết định mẫu được dùng và địa chỉ nhận thông báo; cấu hình hệ thống quản lý danh tính gửi.</p>
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 xl:sticky xl:top-20">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Chèn biến</h2><p className="mt-1 text-xs text-slate-500">Chỉ hiển thị biến hợp lệ với sự kiện và đối tượng nhận.</p>
          <div className="mt-4 flex max-h-[460px] flex-wrap gap-2 overflow-y-auto">{tokens.map((token) => <button key={token} type="button" onClick={() => insertToken(token)} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 font-mono text-[11px] text-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{token}</button>)}</div>
        </aside>
      </div>

      {preview && <section className="rounded-xl border border-orange-200 bg-white p-5 shadow-xs dark:border-orange-900 dark:bg-slate-900"><div className="mb-4 border-b border-slate-200 pb-3 dark:border-slate-800"><p className="text-[11px] font-bold uppercase text-slate-400">Xem trước bằng dữ liệu mẫu</p><h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">{renderSample(subject)}</h2></div><div className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">{renderSample(content)}</div></section>}
    </form>
  );
};

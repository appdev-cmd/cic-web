import React, { useEffect, useMemo, useState } from 'react';
import { Archive, Check, Copy, Edit, ExternalLink, Eye, FileText, Link2, MailCheck, MapPin, Plus, Search, Send, X } from 'lucide-react';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { EmailTemplatesFormView } from './EmailTemplatesFormView';
import type { EmailTemplateModuleData } from '../../data/CustomerInteractionDataSource';
import { EmailAudience, EmailEvent, EmailTemplate, EmailTemplateStatus, EMAIL_EVENTS, SAMPLE_VALUES, TEMPLATE_STATUSES } from './types';
import type { FormItem } from '../customer_interaction/forms/types';
import type { CtaItem } from '../customer_interaction/cta/types';

interface Props { workspaceLocale: 'vi' | 'en'; data: EmailTemplateModuleData; }
const renderSample = (value: string) => Object.entries(SAMPLE_VALUES).reduce((text, [token, sample]) => text.split(token).join(sample), value);

interface TemplateUsage {
  formId: string;
  formName: string;
  formCode: string;
  formStatus: string;
  purpose: 'confirmation' | 'internal';
  ctas: Array<{ id: string; name: string; status: string; pages: Array<{ title: string; path: string; placement: string }> }>;
}

const resolveTemplateUsage = (templateId: string, forms: FormItem[], ctas: CtaItem[]): TemplateUsage[] => forms.flatMap((form) => {
  const purpose = form.submitConfig.confirmationEmailTemplate === templateId
    ? 'confirmation'
    : form.submitConfig.adminEmailTemplate === templateId ? 'internal' : null;
  if (!purpose) return [];
  const relatedCtas = ctas.filter((cta) => cta.actionConfig.type === 'open_form' && cta.actionConfig.formId === form.id)
    .map((cta) => ({
      id: cta.id,
      name: cta.adminName,
      status: cta.status,
      pages: cta.usedByPages.map((page) => ({ title: page.pageTitle, path: page.pagePath, placement: page.placementKey })),
    }));
  return [{ formId: form.id, formName: form.adminName, formCode: form.code, formStatus: form.status, purpose, ctas: relatedCtas }];
});

const resolveDirectCtaUsage = (templateId: string, ctas: CtaItem[]) => ctas
  .filter((cta) => cta.actionConfig.type === 'send_email' && cta.actionConfig.emailTemplateId === templateId)
  .map((cta) => ({
    id: cta.id,
    name: cta.adminName,
    status: cta.status,
    recipient: cta.actionConfig.emailAddress || '',
    reviewBeforeSend: cta.actionConfig.reviewBeforeSend === true,
    pages: cta.usedByPages.map((page) => ({ title: page.pageTitle, path: page.pagePath, placement: page.placementKey })),
  }));

export const EmailTemplatesManager: React.FC<Props> = ({ workspaceLocale, data }) => {
  const [templates, setTemplates] = useState(data.templates);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null);
  const [usageTemplate, setUsageTemplate] = useState<EmailTemplate | null>(null);
  const [query, setQuery] = useState('');
  const [event, setEvent] = useState<'all' | EmailEvent>('all');
  const [audience, setAudience] = useState<'all' | EmailAudience>('all');
  const [status, setStatus] = useState<'all' | EmailTemplateStatus>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const getTemplateUsage = (templateId: string) => resolveTemplateUsage(templateId, data.forms, data.ctas);
  const getDirectCtaUsage = (templateId: string) => resolveDirectCtaUsage(templateId, data.ctas);

  const rows = useMemo(() => templates.filter((item) =>
    (!query.trim() || `${item.name} ${item.subject}`.toLowerCase().includes(query.toLowerCase().trim())) &&
    (event === 'all' || item.event === event) && (audience === 'all' || item.audience === audience) &&
    (status === 'all' || item.status === status)), [templates, query, event, audience, status]);
  const paginatedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(rows.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, pageSize, rows.length]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  const save = (data: Partial<EmailTemplate>) => {
    if (editing) setTemplates((all) => all.map((item) => item.id === editing.id ? { ...item, ...data, version: item.version + 1, updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16) } : item));
    else setTemplates((all) => [{ id: `${workspaceLocale}-${Date.now()}`, workspace: workspaceLocale, name: '', event: 'product_contact', audience: 'customer', subject: '', content: '', status: 'draft', version: 1, updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16), ...data } as EmailTemplate, ...all]);
    notify(editing ? 'Đã lưu phiên bản mới của mẫu email.' : 'Đã tạo mẫu email ở trạng thái Bản nháp.'); setEditing(null); setView('list');
  };
  const changeStatus = (item: EmailTemplate, next: EmailTemplateStatus) => {
    setTemplates((all) => all.map((tpl) => tpl.id === item.id ? { ...tpl, status: next, updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16) } : tpl));
    notify(next === 'active' ? 'Đã xuất bản mẫu email.' : 'Đã cập nhật trạng thái mẫu email.');
  };
  const duplicate = (item: EmailTemplate) => setTemplates((all) => [{ ...item, id: `${item.id}-copy-${Date.now()}`, name: `${item.name} — Bản sao`, status: 'draft', version: 1 }, ...all]);
  const allSelected = rows.length > 0 && rows.every((item) => selected.includes(item.id));

  if (view === 'form') return <EmailTemplatesFormView templateToEdit={editing} workspaceLocale={workspaceLocale} onSave={save} onCancel={() => { setEditing(null); setView('list'); }} />;

  return <div className="space-y-5">
    {toast && <div role="status" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl"><Check className="size-4 text-emerald-400"/>{toast}</div>}
    <CmsPageHeader icon={<MailCheck/>} title="Mẫu email" description="Soạn và quản lý nội dung email. Biểu mẫu chọn mẫu cần gửi và tổng hợp nơi đang sử dụng." actions={<CmsButton variant="primary" size="sm" leadingIcon={<Plus/>} onClick={() => { setEditing(null); setView('form'); }}>Thêm mẫu email</CmsButton>} />

    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-3 md:grid-cols-12">
        <div className="relative flex items-center md:col-span-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-4 text-slate-400" />
          </div>
          <span className="sr-only">Tìm mẫu email</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên hoặc tiêu đề..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" />
        </div>
        <select aria-label="Lọc sự kiện" value={event} onChange={(e) => setEvent(e.target.value as typeof event)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-3"><option value="all">Tất cả sự kiện</option>{EMAIL_EVENTS.map((item) => <option value={item.value} key={item.value}>{workspaceLocale === 'vi' ? item.label : item.labelEn}</option>)}</select>
        <select aria-label="Lọc đối tượng" value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-2"><option value="all">Mọi đối tượng</option><option value="customer">Khách hàng</option><option value="internal">Nội bộ</option></select>
        <select aria-label="Lọc trạng thái" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-2"><option value="all">Mọi trạng thái</option>{Object.entries(TEMPLATE_STATUSES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select>
      </div>
      {selected.length > 0 && <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800"><span><strong>{selected.length}</strong> mẫu đã chọn</span><CmsButton size="sm" onClick={() => { setTemplates((all) => all.map((item) => selected.includes(item.id) && item.status !== 'active' ? { ...item, status: 'archived' } : item)); setSelected([]); notify('Đã lưu trữ các mẫu hợp lệ.'); }} leadingIcon={<Archive/>}>Lưu trữ</CmsButton></div>}
    </section>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"><div className="overflow-x-auto"><table className="cms-data-table min-w-[980px] text-left"><thead><tr><th className="w-10 p-3 text-center"><CmsSelectionCheckbox checked={allSelected} indeterminate={selected.length > 0 && !allSelected} onChange={() => setSelected(allSelected ? [] : rows.map((item) => item.id))} label="Chọn tất cả"/></th><th className="min-w-[300px] p-3">Tên mẫu</th><th className="w-48 p-3">Sự kiện</th><th className="w-28 p-3">Đối tượng</th><th className="w-32 p-3">Trạng thái</th><th className="w-24 p-3">Phiên bản</th><th className="w-40 p-3 text-right">Thao tác</th></tr></thead><tbody>
      {rows.length === 0 ? <tr><td colSpan={7} className="p-12 text-center text-sm text-slate-500">Không có mẫu email phù hợp trong workspace này.</td></tr> : paginatedRows.map((item) => { const eventInfo = EMAIL_EVENTS.find((option) => option.value === item.event)!; const state = TEMPLATE_STATUSES[item.status]; const usageCount = getTemplateUsage(item.id).length + getDirectCtaUsage(item.id).length; return <tr key={item.id}><td className="p-3 text-center"><CmsSelectionCheckbox checked={selected.includes(item.id)} onChange={() => setSelected((ids) => ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids, item.id])} label={`Chọn ${item.name}`}/></td><td className="p-3"><button className="max-w-[420px] truncate text-left font-semibold text-slate-900 hover:text-orange-600 dark:text-white" onClick={() => { setEditing(item); setView('form'); }}>{item.name}</button><p className="mt-1 max-w-[420px] truncate text-[11px] text-slate-500">{item.subject}</p></td><td className="p-3 text-xs">{workspaceLocale === 'vi' ? eventInfo.label : eventInfo.labelEn}</td><td className="p-3 text-xs">{item.audience === 'customer' ? 'Khách hàng' : 'Nội bộ'}</td><td className="p-3"><span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${state.className}`}>{state.label}</span></td><td className="p-3 text-xs">v{item.version}<button className="ml-2 font-semibold text-orange-600 hover:underline disabled:text-slate-400 disabled:no-underline" disabled={usageCount === 0} onClick={() => setUsageTemplate(item)}>{usageCount} nơi dùng</button></td><td className="p-3"><div className="flex justify-end gap-1"><CmsIconButton size="sm" aria-label="Xem trước" title="Xem trước" icon={<Eye/>} onClick={() => setPreviewing(item)}/><CmsIconButton size="sm" aria-label="Xem nơi sử dụng" title="Xem nơi sử dụng" icon={<Link2/>} onClick={() => setUsageTemplate(item)}/><CmsIconButton size="sm" aria-label="Nhân bản" title="Nhân bản" icon={<Copy/>} onClick={() => { duplicate(item); notify('Đã tạo bản sao ở trạng thái Bản nháp.'); }}/><CmsIconButton size="sm" aria-label="Sửa" title="Sửa" icon={<Edit/>} onClick={() => { setEditing(item); setView('form'); }}/>{item.status === 'draft' && <CmsIconButton size="sm" aria-label="Xuất bản" title="Xuất bản" icon={<Check/>} onClick={() => changeStatus(item, 'active')}/>}</div></td></tr>; })}
    </tbody></table></div><CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={rows.length} itemLabel="mẫu email" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}/></section>

    {previewing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="email-preview-title"><div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"><header className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div><p className="text-xs font-semibold text-orange-600">Xem trước bằng dữ liệu mẫu</p><h2 id="email-preview-title" className="mt-1 text-base font-bold">{renderSample(previewing.subject)}</h2></div><CmsIconButton aria-label="Đóng xem trước" icon={<X/>} onClick={() => setPreviewing(null)}/></header><div className="whitespace-pre-wrap p-6 text-sm leading-7 text-slate-700 dark:text-slate-300">{renderSample(previewing.content)}</div></div></div>}

    {usageTemplate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="email-usage-title"><div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"><header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div><p className="text-xs font-semibold text-orange-600">Nơi sử dụng</p><h2 id="email-usage-title" className="mt-1 text-base font-bold text-slate-900 dark:text-white">{usageTemplate.name}</h2><p className="mt-1 text-xs text-slate-500">Trang/vị trí → CTA → Biểu mẫu → Mẫu email, hoặc CTA → Mẫu email trực tiếp</p></div><CmsIconButton aria-label="Đóng nơi sử dụng" icon={<X/>} onClick={() => setUsageTemplate(null)}/></header><div className="space-y-3 p-5">{getTemplateUsage(usageTemplate.id).length === 0 && getDirectCtaUsage(usageTemplate.id).length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">Mẫu email này chưa được sử dụng.</div> : <>{getDirectCtaUsage(usageTemplate.id).map((cta) => <article key={cta.id} className="rounded-xl border border-orange-200 p-4 dark:border-orange-900"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Send className="size-4 text-orange-500"/>{cta.name}</h3><p className="mt-1 text-[11px] text-slate-500">CTA gửi trực tiếp tới {cta.recipient}</p></div><span className="rounded-md bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{cta.reviewBeforeSend ? 'Bắt buộc xem lại' : 'Chưa bật xem lại'}</span></div>{cta.pages.length > 0 && <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 dark:border-slate-800">{cta.pages.map((page) => <li key={`${page.path}-${page.placement}`} className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400"><MapPin className="size-3"/><span className="font-semibold">{page.title}</span><span>· {page.placement}</span><span className="font-mono text-slate-400">{page.path}</span></li>)}</ul>}</article>)}{getTemplateUsage(usageTemplate.id).map((usage) => <article key={`${usage.formId}-${usage.purpose}`} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><div className="flex flex-wrap items-start justify-between gap-2"><div className="flex gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40"><FileText className="size-4"/></div><div><h3 className="text-sm font-bold text-slate-900 dark:text-white">{usage.formName}</h3><p className="mt-0.5 font-mono text-[11px] text-slate-500">{usage.formCode}</p></div></div><div className="flex gap-2 text-[11px]"><span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{usage.purpose === 'confirmation' ? 'Gửi khách hàng' : 'Thông báo quản trị'}</span><span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{usage.formStatus}</span></div></div>{usage.ctas.length === 0 ? <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">Biểu mẫu chưa được CTA nào mở.</p> : <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">{usage.ctas.map((cta) => <div key={cta.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60"><div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200"><Link2 className="size-3.5 text-orange-500"/>{cta.name}<span className="font-normal text-slate-400">({cta.status})</span></div>{cta.pages.length === 0 ? <p className="mt-2 pl-5 text-[11px] text-slate-500">CTA chưa được đặt trên trang nào.</p> : <ul className="mt-2 space-y-1 pl-5">{cta.pages.map((page) => <li key={`${page.path}-${page.placement}`} className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400"><MapPin className="size-3"/><span className="font-semibold">{page.title}</span><span>· {page.placement}</span><span className="inline-flex items-center gap-1 font-mono text-slate-400"><ExternalLink className="size-3"/>{page.path}</span></li>)}</ul>}</div>)}</div>}</article>)}</>}</div></div></div>}
  </div>;
};

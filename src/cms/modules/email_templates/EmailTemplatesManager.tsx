import React, { useMemo, useState } from 'react';
import { Archive, Check, Copy, Edit, Eye, MailCheck, Plus, Search, Send, X } from 'lucide-react';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsListFooter } from '../../components/ui/CmsPagination';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { EmailTemplatesFormView } from './EmailTemplatesFormView';
import { mockEmailTemplates } from './mockData';
import { EmailAudience, EmailEvent, EmailTemplate, EmailTemplateStatus, EMAIL_EVENTS, SAMPLE_VALUES, TEMPLATE_STATUSES } from './types';

interface Props { workspaceLocale: 'vi' | 'en'; }
const renderSample = (value: string) => Object.entries(SAMPLE_VALUES).reduce((text, [token, sample]) => text.split(token).join(sample), value);

export const EmailTemplatesManager: React.FC<Props> = ({ workspaceLocale }) => {
  const [templates, setTemplates] = useState(mockEmailTemplates);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null);
  const [query, setQuery] = useState('');
  const [event, setEvent] = useState<'all' | EmailEvent>('all');
  const [audience, setAudience] = useState<'all' | EmailAudience>('all');
  const [status, setStatus] = useState<'all' | EmailTemplateStatus>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState('');

  const workspaceTemplates = templates.filter((item) => item.workspace === workspaceLocale);
  const rows = useMemo(() => workspaceTemplates.filter((item) =>
    (!query.trim() || `${item.name} ${item.subject}`.toLowerCase().includes(query.toLowerCase().trim())) &&
    (event === 'all' || item.event === event) && (audience === 'all' || item.audience === audience) &&
    (status === 'all' || item.status === status)), [templates, workspaceLocale, query, event, audience, status]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  const save = (data: Partial<EmailTemplate>) => {
    if (editing) setTemplates((all) => all.map((item) => item.id === editing.id ? { ...item, ...data, version: item.version + 1, updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16) } : item));
    else setTemplates((all) => [{ id: `${workspaceLocale}-${Date.now()}`, workspace: workspaceLocale, name: '', event: 'product_contact', audience: 'customer', subject: '', content: '', status: 'draft', version: 1, usageCount: 0, updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16), ...data } as EmailTemplate, ...all]);
    notify(editing ? 'Đã lưu phiên bản mới của mẫu email.' : 'Đã tạo mẫu email ở trạng thái Bản nháp.'); setEditing(null); setView('list');
  };
  const changeStatus = (item: EmailTemplate, next: EmailTemplateStatus) => {
    if (next === 'active' && item.status !== 'review') return notify('Mẫu phải ở trạng thái Chờ duyệt trước khi kích hoạt.');
    setTemplates((all) => all.map((tpl) => tpl.id === item.id ? { ...tpl, status: next, updatedAt: new Date().toLocaleString('sv-SE').slice(0, 16) } : tpl));
    notify(next === 'active' ? 'Đã kích hoạt mẫu email.' : next === 'review' ? 'Đã gửi mẫu email chờ duyệt.' : 'Đã cập nhật trạng thái mẫu email.');
  };
  const duplicate = (item: EmailTemplate) => setTemplates((all) => [{ ...item, id: `${item.id}-copy-${Date.now()}`, name: `${item.name} — Bản sao`, status: 'draft', version: 1, usageCount: 0 }, ...all]);
  const allSelected = rows.length > 0 && rows.every((item) => selected.includes(item.id));

  if (view === 'form') return <EmailTemplatesFormView templateToEdit={editing} workspaceLocale={workspaceLocale} onSave={save} onCancel={() => { setEditing(null); setView('list'); }} />;

  return <div className="space-y-5">
    {toast && <div role="status" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl"><Check className="size-4 text-emerald-400"/>{toast}</div>}
    <CmsPageHeader icon={<MailCheck/>} title="Mẫu email" description="Soạn, duyệt và quản lý phiên bản nội dung email theo từng sự kiện. Người nhận và cấu hình gửi được quản lý riêng." meta={<span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Workspace {workspaceLocale.toUpperCase()}</span>} actions={<CmsButton variant="primary" size="sm" leadingIcon={<Plus/>} onClick={() => { setEditing(null); setView('form'); }}>Thêm mẫu email</CmsButton>} />

    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-3 md:grid-cols-12">
        <label className="relative md:col-span-5"><Search className="absolute left-3 top-2.5 size-4 text-slate-400"/><span className="sr-only">Tìm mẫu email</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên hoặc tiêu đề..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"/></label>
        <select aria-label="Lọc sự kiện" value={event} onChange={(e) => setEvent(e.target.value as typeof event)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-3"><option value="all">Tất cả sự kiện</option>{EMAIL_EVENTS.map((item) => <option value={item.value} key={item.value}>{workspaceLocale === 'vi' ? item.label : item.labelEn}</option>)}</select>
        <select aria-label="Lọc đối tượng" value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-2"><option value="all">Mọi đối tượng</option><option value="customer">Khách hàng</option><option value="internal">Nội bộ</option></select>
        <select aria-label="Lọc trạng thái" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 md:col-span-2"><option value="all">Mọi trạng thái</option>{Object.entries(TEMPLATE_STATUSES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select>
      </div>
      {selected.length > 0 && <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800"><span><strong>{selected.length}</strong> mẫu đã chọn</span><CmsButton size="sm" onClick={() => { setTemplates((all) => all.map((item) => selected.includes(item.id) && item.status !== 'active' ? { ...item, status: 'archived' } : item)); setSelected([]); notify('Đã lưu trữ các mẫu hợp lệ.'); }} leadingIcon={<Archive/>}>Lưu trữ</CmsButton></div>}
    </section>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"><div className="overflow-x-auto"><table className="cms-data-table min-w-[980px] text-left"><thead><tr><th className="w-10 p-3 text-center"><CmsSelectionCheckbox checked={allSelected} indeterminate={selected.length > 0 && !allSelected} onChange={() => setSelected(allSelected ? [] : rows.map((item) => item.id))} label="Chọn tất cả"/></th><th className="min-w-[300px] p-3">Tên mẫu</th><th className="w-48 p-3">Sự kiện</th><th className="w-28 p-3">Đối tượng</th><th className="w-32 p-3">Trạng thái</th><th className="w-24 p-3">Phiên bản</th><th className="w-40 p-3 text-right">Thao tác</th></tr></thead><tbody>
      {rows.length === 0 ? <tr><td colSpan={7} className="p-12 text-center text-sm text-slate-500">Không có mẫu email phù hợp trong workspace này.</td></tr> : rows.map((item) => { const eventInfo = EMAIL_EVENTS.find((option) => option.value === item.event)!; const state = TEMPLATE_STATUSES[item.status]; return <tr key={item.id}><td className="p-3 text-center"><CmsSelectionCheckbox checked={selected.includes(item.id)} onChange={() => setSelected((ids) => ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids, item.id])} label={`Chọn ${item.name}`}/></td><td className="p-3"><button className="max-w-[420px] truncate text-left font-semibold text-slate-900 hover:text-orange-600 dark:text-white" onClick={() => { setEditing(item); setView('form'); }}>{item.name}</button><p className="mt-1 max-w-[420px] truncate text-[11px] text-slate-500">{item.subject}</p></td><td className="p-3 text-xs">{workspaceLocale === 'vi' ? eventInfo.label : eventInfo.labelEn}</td><td className="p-3 text-xs">{item.audience === 'customer' ? 'Khách hàng' : 'Nội bộ'}</td><td className="p-3"><span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${state.className}`}>{state.label}</span></td><td className="p-3 text-xs">v{item.version}<span className="ml-2 text-slate-400">· {item.usageCount} nơi dùng</span></td><td className="p-3"><div className="flex justify-end gap-1"><CmsIconButton size="sm" aria-label="Xem trước" title="Xem trước" icon={<Eye/>} onClick={() => setPreviewing(item)}/><CmsIconButton size="sm" aria-label="Nhân bản" title="Nhân bản" icon={<Copy/>} onClick={() => { duplicate(item); notify('Đã tạo bản sao ở trạng thái Bản nháp.'); }}/><CmsIconButton size="sm" aria-label="Sửa" title="Sửa" icon={<Edit/>} onClick={() => { setEditing(item); setView('form'); }}/>{item.status === 'draft' && <CmsIconButton size="sm" aria-label="Gửi duyệt" title="Gửi duyệt" icon={<Send/>} onClick={() => changeStatus(item, 'review')}/>} {item.status === 'review' && <CmsIconButton size="sm" aria-label="Kích hoạt" title="Kích hoạt" icon={<Check/>} onClick={() => changeStatus(item, 'active')}/>}</div></td></tr>; })}
    </tbody></table></div><CmsListFooter visibleCount={rows.length} totalCount={workspaceTemplates.length} itemLabel="mẫu email"/></section>

    {previewing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="email-preview-title"><div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"><header className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div><p className="text-xs font-semibold text-orange-600">Xem trước bằng dữ liệu mẫu</p><h2 id="email-preview-title" className="mt-1 text-base font-bold">{renderSample(previewing.subject)}</h2></div><CmsIconButton aria-label="Đóng xem trước" icon={<X/>} onClick={() => setPreviewing(null)}/></header><div className="whitespace-pre-wrap p-6 text-sm leading-7 text-slate-700 dark:text-slate-300">{renderSample(previewing.content)}</div></div></div>}
  </div>;
};

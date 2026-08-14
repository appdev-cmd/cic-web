import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, CircleDot, Edit3, ExternalLink, FileText, FolderTree, Globe2, Search, SearchCheck, X } from 'lucide-react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import type { FunctionSeoRecord, SeoOwnerStatus } from './types';

interface Props {
  workspaceLocale: CmsLocale;
  data: FunctionSeoRecord[];
}
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950';

export const FunctionSeoManager: React.FC<Props> = ({ workspaceLocale, data }) => {
  const [records, setRecords] = useState(() => data.map((item) => ({ ...item })));
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<FunctionSeoRecord | null>(null);
  const [expandedIds, setExpandedIds] = useState(() => new Set(records.map((item) => item.id)));
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const filtered = useMemo(() => records.filter((item) => `${item.label} ${item.path} ${item.module} ${item.intent}`.toLowerCase().includes(query.trim().toLowerCase())), [query, records]);
  const paginatedRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, filtered.length, pageSize]);

  const save = () => {
    if (!editing || !editing.title.trim() || !editing.description.trim()) return;
    setRecords((current) => current.map((item) => item.id === editing.id ? { ...editing, updatedAt: new Date().toISOString() } : item));
    setEditing(null);
    setToast('Đã lưu SEO trang chính. SEO nội dung chi tiết không bị thay đổi.');
    window.setTimeout(() => setToast(''), 3500);
  };
  const toggle = (id: string) => setExpandedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return <div className="space-y-5">
    {toast && <div className="fixed bottom-6 right-6 z-50 flex max-w-[calc(100vw-3rem)] items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{toast}</div>}
    <CmsPageHeader icon={<SearchCheck />} title="Cấu hình SEO chức năng" description="Quản lý SEO trang chính và xem rõ nơi quản lý SEO của các cấp nội dung thực sự tồn tại." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700">{workspaceLocale.toUpperCase()} · {records.length} module</span>} />

    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30"><div className="flex gap-3"><FolderTree className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><div><h2 className="text-sm font-bold text-blue-900 dark:text-blue-100">Cấp SEO bám theo cấu trúc thực tế của từng module</h2><div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-200"><span className="rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-slate-900">Trang chính</span><ChevronRight className="h-4 w-4" /><span className="rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-slate-900">Danh mục nếu có</span><ChevronRight className="h-4 w-4" /><span className="rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-slate-900">Chi tiết</span></div><p className="mt-3 text-xs leading-5 text-blue-700 dark:text-blue-300">Dịch vụ, Dự án và Sự kiện không có cấp danh mục nên không hiển thị cấp này. SEO chi tiết vẫn được chỉnh tại module sở hữu.</p></div></div></section>

    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm module hoặc đường dẫn..." className={`${inputClass} pl-9`} /></div></section>

    <div className="space-y-3">{paginatedRecords.map((item) => {
      const expanded = expandedIds.has(item.id);
      return <section key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <button type="button" onClick={() => toggle(item.id)} className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5" aria-expanded={expanded}>
          <div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/30"><Globe2 className="h-5 w-5" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-black text-slate-900 dark:text-white">{item.label}</h2><span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[10px] text-slate-500 dark:bg-slate-800">{item.module}</span></div><p className="mt-1 break-all font-mono text-xs font-semibold text-orange-600">{item.path}</p></div></div>
          <div className="flex shrink-0 items-center gap-3"><span className={`hidden rounded-md px-2 py-1 text-xs font-bold sm:inline ${item.indexable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.indexable ? 'index' : 'noindex'}</span>{expanded ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}</div>
        </button>
        {expanded && <div className="border-t border-slate-200 p-4 dark:border-slate-800 sm:p-5"><div className="relative space-y-3 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
          <SeoLevel number="1" icon={<Globe2 />} title="Trang chính của module" pattern={item.path} owner="Cấu hình SEO chức năng" editable onEdit={() => setEditing({ ...item })}><p className="line-clamp-2 text-xs text-slate-500">{item.title}</p><p className="mt-1 line-clamp-2 text-xs text-slate-400">{item.description}</p></SeoLevel>
          {item.categoryPattern && <SeoLevel number="2" icon={<FolderTree />} title="Trang danh mục" pattern={item.categoryPattern} owner={item.categoryOwner} status={item.categoryStatus} href={item.categoryPath} />}
          <SeoLevel number={item.categoryPattern ? '3' : '2'} icon={<FileText />} title="Trang chi tiết" pattern={item.detailPattern} owner={item.detailOwner} status={item.detailStatus} href={item.detailPath} />
        </div></div>}
      </section>;
    })}</div>
    {filtered.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">Không tìm thấy module phù hợp.</div>}
    {filtered.length > 0 && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filtered.length} itemLabel="module" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} /></div>}

    {editing && <SeoEditor value={editing} onChange={setEditing} onClose={() => setEditing(null)} onSave={save} />}
  </div>;
};

function SeoLevel({ number, icon, title, pattern, owner, status = 'available', editable, href, onEdit, children }: { number: string; icon: React.ReactNode; title: string; pattern: string; owner: string; status?: SeoOwnerStatus; editable?: boolean; href?: string; onEdit?: () => void; children?: React.ReactNode }) {
  const missing = !editable && status === 'missing';
  return <article className={`relative ml-10 rounded-xl border p-4 ${editable ? 'border-orange-200 bg-orange-50/40 dark:border-orange-900 dark:bg-orange-950/20' : missing ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20' : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}><span className={`absolute -left-10 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white text-xs font-black dark:border-slate-900 ${editable ? 'bg-orange-600 text-white' : missing ? 'bg-amber-400 text-amber-950' : 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{number}</span><div className="flex flex-col items-start justify-between gap-3 sm:flex-row"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><span className="text-orange-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>{title}<span className={`rounded-md px-2 py-0.5 text-[10px] font-black ${editable ? 'bg-orange-100 text-orange-700' : missing ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>{editable ? 'CHỈNH TẠI ĐÂY' : missing ? 'CHƯA CÓ MÀN QUẢN LÝ' : 'ĐÃ CÓ SEO RIÊNG'}</span></div><p className="mt-1 break-all font-mono text-xs text-slate-500">{pattern}</p><p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{editable ? 'Chỉnh tại' : missing ? 'Trạng thái' : 'Chỉnh tại'}: <strong>{owner}</strong></p><div className="mt-2">{children}</div></div>{editable ? <CmsButton size="sm" leadingIcon={<Edit3 />} onClick={onEdit}>Chỉnh SEO</CmsButton> : href && !missing ? <a href={href} onClick={(event) => { event.preventDefault(); window.history.pushState({}, '', href); window.dispatchEvent(new PopStateEvent('popstate')); }} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Mở nơi chỉnh<ExternalLink className="h-3.5 w-3.5" /></a> : null}</div></article>;
}

function SeoEditor({ value, onChange, onClose, onSave }: { value: FunctionSeoRecord; onChange: (value: FunctionSeoRecord) => void; onClose: () => void; onSave: () => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-label={`Chỉnh SEO ${value.label}`}><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"><header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div><p className="text-xs font-bold uppercase text-orange-600">Cấp 1 · Trang chính</p><h2 className="mt-1 text-lg font-black">SEO {value.label}</h2><p className="mt-1 font-mono text-xs text-slate-500">{value.path}</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Đóng"><X className="h-5 w-5" /></button></header><div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="space-y-4"><Field label="SEO title" count={`${value.title.length}/60`}><input className={inputClass} value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} /></Field><Field label="Meta keywords" count={`${value.keywords.length}/170`}><textarea rows={3} className={inputClass} value={value.keywords} onChange={(event) => onChange({ ...value, keywords: event.target.value })} /></Field><Field label="Meta description" count={`${value.description.length}/170`}><textarea rows={5} className={inputClass} value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} /></Field><label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-semibold dark:border-slate-700"><span>Cho phép lập chỉ mục</span><input type="checkbox" checked={value.indexable} onChange={(event) => onChange({ ...value, indexable: event.target.checked })} /></label></div><aside className="space-y-4"><div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-[11px] font-bold uppercase text-slate-400">Google preview</p><p className="mt-3 text-base font-medium text-blue-700">{value.title || 'SEO title'}</p><p className="mt-1 break-all text-xs text-emerald-700">https://cic.com.vn{value.canonicalPath}</p><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{value.description || 'Meta description'}</p></div><div className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"><p className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"><CircleDot className="h-4 w-4 text-orange-600" />Phạm vi tác động</p><p className="mt-2">Chỉ áp dụng cho <strong>{value.path}</strong>. Không ghi đè SEO của nội dung chi tiết.</p></div></aside></div><footer className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><CmsButton variant="secondary" onClick={onClose}>Hủy</CmsButton><CmsButton onClick={onSave} disabled={!value.title.trim() || !value.description.trim()}>Lưu cấu hình</CmsButton></footer></div></div>;
}

function Field({ label, count, children }: { label: string; count?: string; children: React.ReactNode }) { return <label className="block space-y-1.5"><span className="flex justify-between text-xs font-bold"><span>{label}</span>{count && <span className="font-normal text-slate-400">{count}</span>}</span>{children}</label>; }

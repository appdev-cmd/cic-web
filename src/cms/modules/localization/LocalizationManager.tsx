import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, Code2, Globe2, History, Languages, Search, X } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import type { DictionaryApplication, DictionaryEntry, DictionaryLocale, DictionaryStatus } from './uiDictionaryData';

const statusMeta: Record<DictionaryStatus, { label: string; className: string }> = {
  active: { label: 'Đầy đủ', className: 'bg-emerald-50 text-emerald-700' },
  new: { label: 'Mới đồng bộ', className: 'bg-blue-50 text-blue-700' },
  missing: { label: 'Thiếu bản dịch', className: 'bg-red-50 text-red-700' },
  needs_check: { label: 'Cần kiểm tra', className: 'bg-amber-50 text-amber-700' },
  deprecated: { label: 'Đã ngừng sử dụng', className: 'bg-slate-100 text-slate-600' },
};

const variablePattern = /\{\{\s*([a-zA-Z_][\w.]*)\s*\}\}/g;

function validate(entry: DictionaryEntry, value: string) {
  const errors: string[] = [];
  if (!value.trim()) errors.push('Bản dịch không được để trống.');
  if (/<\/?[a-z][^>]*>|javascript:|<script/i.test(value)) errors.push('Chỉ cho phép plain text; không được chứa HTML hoặc script.');
  const variables = [...value.matchAll(variablePattern)].map((match) => match[1]);
  const missing = entry.requiredVariables.filter((name) => !variables.includes(name));
  const unexpected = variables.filter((name) => !entry.requiredVariables.includes(name));
  if (missing.length) errors.push(`Thiếu biến bắt buộc: ${missing.map((name) => `{{${name}}}`).join(', ')}.`);
  if (unexpected.length) errors.push(`Biến không hợp lệ: ${unexpected.map((name) => `{{${name}}}`).join(', ')}.`);
  return errors;
}

export const LocalizationManager: React.FC<{ data: DictionaryEntry[] }> = ({ data }) => {
  const [items, setItems] = useState(() => data);
  const [query, setQuery] = useState('');
  const [application, setApplication] = useState<'all' | DictionaryApplication>('all');
  const [namespace, setNamespace] = useState('all');
  const [status, setStatus] = useState<'all' | DictionaryStatus>('all');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [locale, setLocale] = useState<DictionaryLocale>('en');
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const errors = selected ? validate(selected, draft) : [];
  const namespaces = [...new Set(items.map((item) => `${item.application}.${item.namespace}`))];
  const filtered = useMemo(() => items.filter((item) => {
    const normalized = query.trim().toLowerCase();
    return (!normalized || `${item.key} ${item.description} ${item.values.vi} ${item.values.en}`.toLowerCase().includes(normalized))
      && (application === 'all' || item.application === application)
      && (namespace === 'all' || `${item.application}.${item.namespace}` === namespace)
      && (status === 'all' || item.status === status)
      && (!onlyMissing || !item.values.en.trim());
  }), [application, items, namespace, onlyMissing, query, status]);
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > lastPage) setCurrentPage(lastPage);
  }, [currentPage, filtered.length, pageSize]);

  const openEditor = (entry: DictionaryEntry, nextLocale: DictionaryLocale = locale) => { setSelectedId(entry.id); setLocale(nextLocale); setDraft(entry.values[nextLocale]); };
  const switchLocale = (nextLocale: DictionaryLocale) => { if (!selected) return; setLocale(nextLocale); setDraft(selected.values[nextLocale]); };
  const save = () => {
    if (!selected || errors.length) return;
    const now = new Date().toISOString();
    setItems((current) => current.map((item) => item.id !== selected.id ? item : {
      ...item,
      values: { ...item.values, [locale]: draft },
      status: locale === 'en' && draft.trim() ? 'active' : item.status,
      updatedAt: now,
      updatedBy: 'Nguyễn Văn Quản Trị',
      history: [{ id: `history_${Date.now()}`, locale, oldValue: item.values[locale], newValue: draft, changedBy: 'Nguyễn Văn Quản Trị', changedAt: now, source: 'cms' as const }, ...item.history],
    }));
    setToast('Đã cập nhật bản dịch giao diện.');
    window.setTimeout(() => setToast(''), 3000);
  };

  return <div className="space-y-5">
    {toast && <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{toast}</div>}
    <CmsPageHeader icon={<Languages />} title="Ngôn ngữ giao diện" description="Quản lý bản dịch cho các chuỗi giao diện dùng chung. Key và cấu trúc kỹ thuật được đồng bộ từ code." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">{items.length} key · VI / EN</span>} />

    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold text-slate-500">Tổng số key</p><p className="mt-1 text-2xl font-black text-slate-950">{items.length}</p></div>
      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold text-slate-500">Đã dịch đầy đủ</p><p className="mt-1 text-2xl font-black text-emerald-600">{items.filter((item) => item.values.en).length}</p></div>
      <button type="button" onClick={() => setOnlyMissing(true)} className="rounded-xl border border-red-200 bg-red-50 p-4 text-left"><p className="text-xs font-semibold text-red-600">Thiếu tiếng Anh</p><p className="mt-1 text-2xl font-black text-red-700">{items.filter((item) => !item.values.en).length}</p></button>
    </div>

    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_160px_190px_170px_auto]">
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo key, mô tả hoặc nội dung VI/EN..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500" /></div>
        <select value={application} onChange={(event) => setApplication(event.target.value as typeof application)} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="all">Website & CMS</option><option value="web">Website</option><option value="cms">CMS</option></select>
        <select value={namespace} onChange={(event) => setNamespace(event.target.value)} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="all">Tất cả namespace</option>{namespaces.map((value) => <option key={value} value={value}>{value}</option>)}</select>
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-xl border border-slate-200 px-3 text-sm"><option value="all">Tất cả trạng thái</option>{Object.entries(statusMeta).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select>
        <label className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 px-3 text-xs font-semibold"><input type="checkbox" checked={onlyMissing} onChange={(event) => setOnlyMissing(event.target.checked)} />Chỉ thiếu bản dịch</label>
      </div>
    </section>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto"><table className="cms-data-table min-w-[1050px] text-left"><thead><tr><th className="p-3">Key</th><th className="p-3">Phạm vi</th><th className="p-3">Tiếng Việt</th><th className="p-3">Tiếng Anh</th><th className="p-3">Trạng thái</th><th className="p-3">Cập nhật</th></tr></thead><tbody>{paginatedItems.map((item) => <tr key={item.id} onClick={() => openEditor(item)} className="cursor-pointer border-t border-slate-100 hover:bg-orange-50/40"><td className="p-3"><code className="text-xs font-bold text-orange-700">{item.key}</code><p className="mt-1 max-w-xs truncate text-[11px] text-slate-500">{item.description}</p></td><td className="p-3"><span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase">{item.application}</span><p className="mt-1 text-xs text-slate-500">{item.namespace}</p></td><td className="max-w-xs p-3 text-sm">{item.values.vi}</td><td className="max-w-xs p-3 text-sm">{item.values.en || <span className="font-semibold text-red-600">Chưa có bản dịch</span>}</td><td className="p-3"><span className={`rounded-md px-2 py-1 text-xs font-bold ${statusMeta[item.status].className}`}>{statusMeta[item.status].label}</span></td><td className="p-3 text-xs text-slate-500">{new Date(item.updatedAt).toLocaleDateString('vi-VN')}<p className="mt-1 text-[11px]">{item.updatedBy}</p></td></tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-500">Không tìm thấy key phù hợp.</div>}
      <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filtered.length} itemLabel="key" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
    </section>

    {selected && <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/45" role="dialog" aria-modal="true"><button className="absolute inset-0" onClick={() => setSelectedId(null)} aria-label="Đóng" /><aside className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5"><div><p className="text-xs font-bold uppercase text-orange-600">Chỉnh sửa bản dịch</p><h2 className="mt-1 font-mono text-sm font-bold text-slate-950">{selected.key}</h2></div><button onClick={() => setSelectedId(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="space-y-5 p-5">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-800"><div className="flex gap-2"><Code2 className="h-4 w-4 shrink-0" /><p>Key do Developer quản lý và chỉ đọc trong CMS. Người dịch chỉ được cập nhật giá trị plain text.</p></div></div>
      <div><p className="text-xs font-bold text-slate-700">Mô tả và ngữ cảnh</p><p className="mt-2 text-sm text-slate-700">{selected.description}</p><p className="mt-1 text-xs text-slate-500">{selected.context}</p></div>
      <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-bold text-slate-500">Giá trị mặc định</p><p className="mt-1 text-sm">{selected.defaultValue}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-bold text-slate-500">Biến bắt buộc</p><p className="mt-1 font-mono text-xs">{selected.requiredVariables.length ? selected.requiredVariables.map((name) => `{{${name}}}`).join(', ') : 'Không có'}</p></div></div>
      <div className="flex rounded-xl bg-slate-100 p-1">{(['vi', 'en'] as const).map((value) => <button key={value} onClick={() => switchLocale(value)} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${locale === value ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500'}`}>{value === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}</button>)}</div>
      <label className="block space-y-2"><span className="text-xs font-bold text-slate-700">Nội dung bản dịch</span><textarea rows={6} value={draft} onChange={(event) => setDraft(event.target.value)} className={`w-full rounded-xl border p-3 text-sm outline-none ${errors.length ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-orange-500'}`} /><span className="flex justify-between text-[11px] text-slate-500"><span>Plain text · không HTML/Script</span><span className={selected.lengthHint && draft.length > selected.lengthHint ? 'font-bold text-amber-600' : ''}>{draft.length}{selected.lengthHint ? ` / gợi ý ${selected.lengthHint}` : ''}</span></span></label>
      {errors.map((error) => <p key={error} className="flex gap-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>)}
      {selected.lengthHint && draft.length > selected.lengthHint && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Bản dịch dài hơn giới hạn gợi ý và có thể ảnh hưởng giao diện. Đây là cảnh báo, không tự động chặn lưu.</p>}
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><CmsButton variant="secondary" onClick={() => setSelectedId(null)}>Hủy</CmsButton><CmsButton disabled={errors.length > 0} onClick={save}>Lưu bản dịch</CmsButton></div>
      <div className="border-t border-slate-200 pt-5"><h3 className="flex items-center gap-2 text-sm font-bold"><History className="h-4 w-4" />Lịch sử thay đổi</h3>{selected.history.length ? <div className="mt-3 space-y-2">{selected.history.map((entry) => <div key={entry.id} className="rounded-lg border border-slate-200 p-3 text-xs"><p className="font-semibold">{entry.changedBy} · {entry.locale.toUpperCase()}</p><p className="mt-1 text-slate-500">{entry.oldValue} → {entry.newValue}</p></div>)}</div> : <p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Clock3 className="h-4 w-4" />Chưa có thay đổi từ CMS.</p>}</div>
    </div></aside></div>}
  </div>;
};

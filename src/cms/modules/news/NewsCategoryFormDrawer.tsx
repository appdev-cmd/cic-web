import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Search, X } from 'lucide-react';
import { CmsButton } from '../../components/ui/CmsButton';
import { PageMediaPickerModal, findPageBuilderImage } from '../static_pages/PageMediaPickerModal';
import type { NewsCategory } from './types';

interface Props {
  category: NewsCategory | null;
  categories: NewsCategory[];
  onClose: () => void;
  onSave: (category: NewsCategory) => void;
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950';
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const NewsCategoryFormDrawer: React.FC<Props> = ({ category, categories, onClose, onSave }) => {
  const [form, setForm] = useState<NewsCategory>(() => emptyCategory());
  const [manualSlug, setManualSlug] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(category ? { ...category } : emptyCategory());
    setManualSlug(Boolean(category));
    setError('');
  }, [category]);

  const save = () => {
    const name = form.name.trim();
    const alias = slugify(form.alias || name);
    if (!name) return setError('Vui lòng nhập tên danh mục.');
    if (!alias) return setError('Đường dẫn danh mục không hợp lệ.');
    if (categories.some((item) => item.id !== form.id && item.alias === alias)) return setError('Đường dẫn này đã được một danh mục khác sử dụng.');
    onSave({ ...form, name, alias, updated_time: new Date().toISOString() });
  };

  const selectedImage = form.image ? findPageBuilderImage(form.image) : undefined;
  const blockedParentIds = category ? collectDescendantIds(category.id, categories) : new Set<string>();

  return <div className="fixed inset-0 z-[70] bg-slate-950/55" role="dialog" aria-modal="true" aria-label={category ? 'Sửa danh mục tin tức' : 'Thêm danh mục tin tức'}>
    <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Đóng" />
    <aside className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-slate-900">
      <header className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800"><div><p className="text-xs font-bold uppercase text-orange-600">Tin tức</p><h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{category ? 'Sửa danh mục' : 'Thêm danh mục'}</h2><p className="mt-1 text-sm text-slate-500">Cấu hình nội dung, hiển thị và SEO của trang danh mục.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng"><X className="h-5 w-5" /></button></header>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <Section title="Thông tin danh mục">
          <Field label="Tên danh mục *"><input className={inputClass} value={form.name} onChange={(event) => { const name = event.target.value; setForm((current) => ({ ...current, name, alias: manualSlug ? current.alias : slugify(name) })); }} /></Field>
          <Field label="Tiêu đề hiển thị"><input className={inputClass} value={form.title ?? ''} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Nếu để trống sẽ dùng tên danh mục" /></Field>
          <Field label="Đường dẫn"><div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-orange-500 dark:border-slate-700"><span className="flex items-center bg-slate-50 px-3 text-xs text-slate-500 dark:bg-slate-800">/tin-tuc/</span><input className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" value={form.alias} onChange={(event) => { setManualSlug(true); setForm({ ...form, alias: slugify(event.target.value) }); }} /></div></Field>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Danh mục cha"><select className={inputClass} value={form.parent_id ?? ''} onChange={(event) => setForm({ ...form, parent_id: event.target.value || null })}><option value="">Không có danh mục cha</option>{categories.filter((item) => item.id !== form.id && !blockedParentIds.has(item.id)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Thứ tự"><input type="number" min={1} className={inputClass} value={form.ordering ?? 1} onChange={(event) => setForm({ ...form, ordering: Number(event.target.value) || 1 })} /></Field></div>
          <Field label="Tóm tắt"><textarea rows={4} className={inputClass} value={form.summary ?? ''} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></Field>
          <Field label="Ảnh danh mục"><div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">{selectedImage ? <div className="mb-3 flex items-center gap-3"><img src={selectedImage.thumbnail_url ?? selectedImage.url} alt="" className="h-16 w-24 rounded-lg object-cover" /><div className="min-w-0"><p className="truncate text-sm font-bold">{selectedImage.title}</p><p className="truncate text-xs text-slate-500">{selectedImage.filename}</p></div></div> : <p className="mb-3 text-xs text-slate-500">Chưa chọn ảnh.</p>}<CmsButton size="sm" variant="secondary" leadingIcon={<ImageIcon />} onClick={() => setShowMedia(true)}>Chọn hoặc tải ảnh</CmsButton></div></Field>
        </Section>
        <Section title="Hiển thị"><div className="grid gap-3 sm:grid-cols-2"><Toggle label="Xuất bản" checked={form.published ?? true} onChange={(checked) => setForm({ ...form, published: checked })} /><Toggle label="Trang chủ" checked={form.show_in_homepage ?? true} onChange={(checked) => setForm({ ...form, show_in_homepage: checked })} /></div></Section>
        <Section title="Cấu hình SEO" icon={<Search className="h-4 w-4" />}>
          <Field label="SEO title" count={`${(form.seo_title ?? '').length}/60`}><input className={inputClass} value={form.seo_title ?? ''} onChange={(event) => setForm({ ...form, seo_title: event.target.value })} /></Field>
          <Field label="SEO keyword"><input className={inputClass} value={form.seo_keyword ?? ''} onChange={(event) => setForm({ ...form, seo_keyword: event.target.value })} /></Field>
          <Field label="SEO description" count={`${(form.seo_description ?? '').length}/170`}><textarea rows={4} className={inputClass} value={form.seo_description ?? ''} onChange={(event) => setForm({ ...form, seo_description: event.target.value })} /></Field>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-[11px] font-bold uppercase text-slate-400">Google preview</p><p className="mt-2 text-base text-blue-700">{form.seo_title || form.title || form.name || 'Tên danh mục'}</p><p className="mt-1 break-all text-xs text-emerald-700">https://cic.com.vn/tin-tuc/{form.alias || 'duong-dan'}</p><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{form.seo_description || form.summary || 'Mô tả danh mục sẽ hiển thị tại đây.'}</p></div>
        </Section>
      </div>
      <footer className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-800"><CmsButton variant="secondary" onClick={onClose}>Hủy</CmsButton><CmsButton variant="primary" onClick={save}>Lưu danh mục</CmsButton></footer>
    </aside>
    {showMedia && <PageMediaPickerModal currentId={form.image ?? ''} onClose={() => setShowMedia(false)} onConfirm={(image) => setForm({ ...form, image })} />}
  </div>;
};

function emptyCategory(): NewsCategory { return { id: `cat_news_${Date.now()}`, name: '', alias: '', parent_id: null, ordering: 1, published: true, show_in_homepage: true, count: 0, created_time: new Date().toISOString() }; }
function collectDescendantIds(parentId: string, categories: NewsCategory[]): Set<string> { const result = new Set<string>(); const visit = (id: string) => categories.filter((item) => item.parent_id === id).forEach((item) => { if (result.has(item.id)) return; result.add(item.id); visit(item.id); }); visit(parentId); return result; }
function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) { return <section className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800"><h3 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">{icon}{title}</h3>{children}</section>; }
function Field({ label, count, children }: { label: string; count?: string; children: React.ReactNode }) { return <label className="block space-y-1.5"><span className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300"><span>{label}</span>{count && <span className="font-normal text-slate-400">{count}</span>}</span>{children}</label>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-3 text-xs font-bold dark:border-slate-700"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>; }

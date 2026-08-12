import React, { useMemo, useState } from 'react';
import { CheckCircle2, Edit, Eye, FileText, Globe2, Plus, RefreshCw, Search, X } from 'lucide-react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsListFooter } from '../../components/ui/CmsPagination';
import { PageBuilderEditor } from './PageBuilderEditor';
import { PageBuilderPreviewModal } from './PageBuilderPreviewModal';
import { createLegalPage, pageBuilderPagesMock } from './pageBuilderData';
import type { PageBuilderPage } from './pageBuilderTypes';

interface StaticPagesManagerProps { workspaceLocale: CmsLocale }

const clonePages = () => JSON.parse(JSON.stringify(pageBuilderPagesMock)) as PageBuilderPage[];
const formatTime = (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const StaticPagesManager: React.FC<StaticPagesManagerProps> = ({ workspaceLocale }) => {
  const [pages, setPages] = useState<PageBuilderPage[]>(clonePages);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<PageBuilderPage | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'has_draft' | 'published'>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3000); };
  const filteredPages = useMemo(() => pages.filter((page) => {
    const normalized = query.trim().toLowerCase();
    const matchesQuery = !normalized || page.name.toLowerCase().includes(normalized) || page.slug.toLowerCase().includes(normalized) || page.code.includes(normalized);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' ? page.published.version > 0 : page.draft.version > page.published.version);
    return matchesQuery && matchesStatus;
  }), [pages, query, statusFilter]);
  const editingPage = pages.find((page) => page.id === editingId) ?? null;

  const createPage = () => {
    const name = newPageName.trim();
    const slugPart = (newPageSlug.trim() || slugify(name)).replace(/^\/+/, '');
    if (!name || !slugPart) return;
    const slug = `/${slugPart}`;
    if (pages.some((page) => page.slug === slug)) { showToast('Đường dẫn này đã được sử dụng.'); return; }
    const code = `content_${slugify(slugPart).replace(/-/g, '_')}`;
    const created = createLegalPage({ id: `page_${Date.now()}`, code, name, slug });
    setPages((current) => [...current, created]);
    setCreateOpen(false); setNewPageName(''); setNewPageSlug(''); setEditingId(created.id);
    showToast(`Đã tạo Draft. Link dự kiến: ${slug}`);
  };

  if (editingPage) return <>
    {toast && <Toast message={toast} />}
    <PageBuilderEditor key={`${editingPage.id}-${editingPage.draft.version}-${editingPage.published.version}`} page={editingPage} onBack={() => setEditingId(null)} onSaveDraft={(nextPage) => {
      const saved = { ...nextPage, draft: { ...nextPage.draft, version: nextPage.draft.version + 1, status: 'draft' as const, updatedAt: new Date().toISOString() } };
      setPages((current) => current.map((page) => page.id === saved.id ? saved : page)); showToast('Đã lưu bản nháp. Website chưa thay đổi.');
    }} onPreview={setPreviewPage} onPublish={(nextPage) => {
      const now = new Date().toISOString();
      const published = { ...JSON.parse(JSON.stringify(nextPage.draft)), status: 'published' as const, publishedAt: now, updatedAt: now };
      const saved = { ...nextPage, published };
      setPages((current) => current.map((page) => page.id === saved.id ? saved : page)); showToast(`Đã xuất bản: https://cic.com.vn${saved.slug}`);
    }} />
    <PageBuilderPreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />
  </>;

  return <div className="space-y-5">
    {toast && <Toast message={toast} />}
    <CmsPageHeader icon={<FileText />} title="Trang nội dung" description="Quản lý các trang thiết kế riêng và tạo trang mới theo mẫu nội dung chuẩn." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">{pages.length} Page · {workspaceLocale.toUpperCase()}</span>} actions={<div className="flex flex-wrap gap-2"><CmsButton variant="secondary" leadingIcon={<RefreshCw />} onClick={() => showToast('Đã tải lại danh sách Page.')}>Làm mới</CmsButton><CmsButton leadingIcon={<Plus />} onClick={() => setCreateOpen(true)}>Tạo trang nội dung</CmsButton></div>} />
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, code hoặc đường dẫn..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none dark:border-slate-700 dark:bg-slate-800"><option value="all">Tất cả trạng thái</option><option value="has_draft">Có thay đổi Draft</option><option value="published">Đã xuất bản</option></select></div></section>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="hidden overflow-x-auto md:block"><table className="cms-data-table min-w-[920px] text-left"><thead><tr><th className="p-3">Page</th><th className="p-3">Code / đường dẫn</th><th className="p-3">Section</th><th className="p-3">Draft</th><th className="p-3">Published</th><th className="p-3 text-right">Thao tác</th></tr></thead><tbody>{filteredPages.map((page) => <PageRow key={page.id} page={page} onPreview={setPreviewPage} onEdit={setEditingId} />)}</tbody></table></div>
      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">{filteredPages.map((page) => <PageCard key={page.id} page={page} onPreview={setPreviewPage} onEdit={setEditingId} />)}</div>
      {filteredPages.length === 0 && <div className="py-12 text-center text-sm text-slate-500">Không tìm thấy Page phù hợp.</div>}
      <CmsListFooter visibleCount={filteredPages.length} totalCount={pages.length} itemLabel="Page" />
    </section>
    <PageBuilderPreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />
    {createOpen && <CreatePageModal name={newPageName} slug={newPageSlug} onNameChange={(name) => { setNewPageName(name); setNewPageSlug((current) => current || slugify(name)); }} onSlugChange={(slug) => setNewPageSlug(slugify(slug))} onClose={() => setCreateOpen(false)} onCreate={createPage} />}
  </div>;
};

function Toast({ message }: { message: string }) { return <div className="fixed bottom-6 right-6 z-[80] flex max-w-[calc(100vw-3rem)] items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />{message}</div>; }
function typeLabel(page: PageBuilderPage) { return page.templateKey === 'legal_standard' ? 'Mẫu nội dung chuẩn' : 'Thiết kế riêng'; }

function PageRow({ page, onPreview, onEdit }: { page: PageBuilderPage; onPreview: (page: PageBuilderPage) => void; onEdit: (id: string) => void }) {
  const changed = page.draft.version > page.published.version;
  return <tr className="border-t border-slate-100 dark:border-slate-800"><td className="p-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Globe2 className="h-4 w-4" /></span><div><p className="text-sm font-bold text-slate-900 dark:text-white">{page.name}</p><p className="text-xs text-slate-500">{typeLabel(page)}</p></div></div></td><td className="p-3"><p className="font-mono text-xs font-semibold">{page.code}</p><p className="mt-1 text-xs text-slate-500">{page.slug}</p></td><td className="p-3 text-sm font-semibold">{page.draft.sections.length} cố định</td><td className="p-3"><span className={`rounded-md px-2 py-1 text-xs font-bold ${changed ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>v{page.draft.version}{changed ? ' · Chưa publish' : ''}</span><p className="mt-1 text-[11px] text-slate-400">{formatTime(page.draft.updatedAt)}</p></td><td className="p-3">{page.published.version > 0 ? <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">v{page.published.version} · Published</span> : <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">Chưa xuất bản</span>}</td><td className="p-3"><div className="flex justify-end gap-1"><button onClick={() => onPreview(page)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600" title="Preview Draft"><Eye className="h-4 w-4" /></button><button onClick={() => onEdit(page.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600" title="Chỉnh sửa"><Edit className="h-4 w-4" /></button></div></td></tr>;
}

function PageCard({ page, onPreview, onEdit }: { page: PageBuilderPage; onPreview: (page: PageBuilderPage) => void; onEdit: (id: string) => void }) {
  return <article className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Globe2 className="h-4 w-4" /></span><div className="min-w-0"><h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">{page.name}</h2><p className="text-xs text-slate-500">{typeLabel(page)}</p></div></div><div className="flex shrink-0 gap-1"><button onClick={() => onPreview(page)} className="rounded-lg bg-slate-100 p-2 text-slate-600" aria-label={`Xem trước ${page.name}`}><Eye className="h-4 w-4" /></button><button onClick={() => onEdit(page.id)} className="rounded-lg bg-orange-50 p-2 text-orange-600" aria-label={`Chỉnh sửa ${page.name}`}><Edit className="h-4 w-4" /></button></div></div><div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60"><p className="break-all font-mono text-xs font-semibold">{page.slug}</p><p className="mt-1 text-[11px] text-slate-500">{page.draft.sections.length} section cố định · Draft v{page.draft.version}{page.published.version > 0 ? ` · Published v${page.published.version}` : ' · Chưa xuất bản'}</p></div></article>;
}

function CreatePageModal({ name, slug, onNameChange, onSlugChange, onClose, onCreate }: { name: string; slug: string; onNameChange: (value: string) => void; onSlugChange: (value: string) => void; onClose: () => void; onCreate: () => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-label="Tạo trang nội dung"><div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-black">Tạo trang nội dung</h2><p className="mt-1 text-xs text-slate-500">Dùng cùng thiết kế với Chính sách bảo mật và Điều khoản sử dụng.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Đóng"><X className="h-5 w-5" /></button></div><div className="mt-5 space-y-4"><label className="block space-y-1.5"><span className="text-xs font-bold">Tên trang *</span><input value={name} onChange={(event) => onNameChange(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" placeholder="Ví dụ: Quy chế hoạt động" /></label><label className="block space-y-1.5"><span className="text-xs font-bold">Đường dẫn *</span><div className="flex rounded-xl border border-slate-200 dark:border-slate-700"><span className="border-r border-slate-200 px-3 py-2.5 text-sm text-slate-400 dark:border-slate-700">/</span><input value={slug} onChange={(event) => onSlugChange(event.target.value)} className="min-w-0 flex-1 rounded-r-xl px-3 py-2.5 text-sm outline-none dark:bg-slate-950" /></div></label><div className="break-all rounded-xl bg-orange-50 p-3 text-xs text-orange-800"><span className="font-bold">Link sau khi xuất bản:</span> https://cic.com.vn/{slug || slugify(name) || 'duong-dan'}</div></div><div className="mt-6 flex justify-end gap-2"><CmsButton variant="secondary" onClick={onClose}>Hủy</CmsButton><CmsButton onClick={onCreate} disabled={!name.trim() || !slug.trim()}>Tạo Draft</CmsButton></div></div></div>;
}

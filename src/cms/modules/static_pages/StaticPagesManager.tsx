import React, { useMemo, useState } from 'react';
import { CheckCircle2, Edit, Eye, FileText, Globe2, Plus, RefreshCw, RotateCcw, Search, X } from 'lucide-react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { PageBuilderEditor } from './PageBuilderEditor';
import { PageBuilderPreviewModal } from './PageBuilderPreviewModal';
import { createLegalPage } from './pageBuilderData';
import type { StaticPagesModuleData } from './staticPagesData';
import type { PageBuilderPage } from './pageBuilderTypes';

interface StaticPagesManagerProps { workspaceLocale: CmsLocale; data: StaticPagesModuleData }

const clonePages = (pages: PageBuilderPage[]) => JSON.parse(JSON.stringify(pages)) as PageBuilderPage[];
const formatTime = (value: string) => new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const shortSlug = (value: string) => slugify(value).split('-').slice(0, 6).join('-').slice(0, 42).replace(/-$/, '');

export const StaticPagesManager: React.FC<StaticPagesManagerProps> = ({ workspaceLocale, data }) => {
  const [pages, setPages] = useState<PageBuilderPage[]>(() => clonePages(data.pages));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<PageBuilderPage | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'has_draft' | 'published'>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 3000); };
  const filteredPages = useMemo(() => pages.filter((page) => {
    const normalized = query.trim().toLowerCase();
    const matchesQuery = !normalized || page.name.toLowerCase().includes(normalized) || page.slug.toLowerCase().includes(normalized) || page.code.includes(normalized);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' ? page.published.version > 0 : page.draft.version > page.published.version);
    return matchesQuery && matchesStatus;
  }), [pages, query, statusFilter]);
  const paginatedPages = filteredPages.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const editingPage = pages.find((page) => page.id === editingId) ?? null;
  const suggestedSlug = useMemo(() => {
    const base = shortSlug(newPageName) || 'trang-noi-dung';
    if (!pages.some((page) => page.slug === `/${base}`)) return base;
    let suffix = 2;
    while (pages.some((page) => page.slug === `/${base}-${suffix}`)) suffix += 1;
    return `${base}-${suffix}`;
  }, [newPageName, pages]);

  const createPage = () => {
    if (!data.canCreateLegalPage) { showToast('Workspace này chưa có mẫu nội dung được duyệt.'); return; }
    const name = newPageName.trim();
    const slugPart = suggestedSlug;
    if (!name || !slugPart) return;
    const slug = `/${slugPart}`;
    if (pages.some((page) => page.slug === slug)) { showToast('Đường dẫn này đã được sử dụng.'); return; }
    const code = `content_${slugify(slugPart).replace(/-/g, '_')}`;
    const created = createLegalPage({ id: `page_${Date.now()}`, code, name, slug });
    setPages((current) => [...current, created]);
    setCreateOpen(false); setNewPageName(''); setEditingId(created.id);
    showToast(`Đã tạo Draft. Link dự kiến: ${slug}`);
  };

  if (editingPage) return <>
    {toast && <Toast message={toast} />}
    <PageBuilderEditor key={`${editingPage.id}-${editingPage.draft.version}-${editingPage.published.version}`} page={editingPage} entityOptions={data.entityOptions} mediaImages={data.mediaImages} onBack={() => setEditingId(null)} onSaveDraft={(nextPage) => {
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
    <CmsPageHeader icon={<FileText />} title="Trang nội dung" description="Quản lý các trang thiết kế riêng và tạo trang mới theo mẫu nội dung chuẩn." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">{pages.length} Page · {workspaceLocale.toUpperCase()}</span>} actions={<div className="flex flex-wrap gap-2"><CmsButton variant="secondary" leadingIcon={<RefreshCw />} onClick={() => showToast('Đã tải lại danh sách Page.')}>Làm mới</CmsButton><CmsButton leadingIcon={<Plus />} disabled={!data.canCreateLegalPage} onClick={() => setCreateOpen(true)}>Tạo trang nội dung</CmsButton></div>} />
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
        <label className="relative md:col-span-6"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><span className="sr-only">Tìm kiếm</span><input value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Tìm theo tên, code hoặc đường dẫn..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" /></label>
        <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as typeof statusFilter); setCurrentPage(1); }} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 md:col-span-3 dark:border-slate-700 dark:bg-slate-800"><option value="all">Trạng thái: Tất cả</option><option value="has_draft">Có thay đổi bản nháp</option><option value="published">Đã xuất bản</option></select>
        <button type="button" disabled={!query && statusFilter === 'all'} onClick={() => { setQuery(''); setStatusFilter('all'); setCurrentPage(1); }} className="flex h-9 w-24 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"><RotateCcw className="h-3.5 w-3.5" />Đặt lại</button>
      </div>
    </section>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="hidden overflow-x-auto md:block"><table className="cms-data-table min-w-[920px] text-left"><thead><tr><th className="p-3">Page</th><th className="p-3">Code / đường dẫn</th><th className="p-3">Section</th><th className="p-3">Draft</th><th className="p-3">Published</th><th className="p-3 text-right">Thao tác</th></tr></thead><tbody>{paginatedPages.map((page) => <PageRow key={page.id} page={page} onPreview={setPreviewPage} onEdit={setEditingId} />)}</tbody></table></div>
      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">{paginatedPages.map((page) => <PageCard key={page.id} page={page} onPreview={setPreviewPage} onEdit={setEditingId} />)}</div>
      {filteredPages.length === 0 && <div className="py-12 text-center text-sm text-slate-500">Không tìm thấy Page phù hợp.</div>}
      <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredPages.length} itemLabel="Page" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
    </section>
    <PageBuilderPreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />
    {createOpen && <CreatePageModal name={newPageName} slug={suggestedSlug} onNameChange={setNewPageName} onClose={() => setCreateOpen(false)} onCreate={createPage} />}
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

function CreatePageModal({ name, slug, onNameChange, onClose, onCreate }: { name: string; slug: string; onNameChange: (value: string) => void; onClose: () => void; onCreate: () => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4" role="dialog" aria-modal="true" aria-label="Tạo trang nội dung"><div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-black">Tạo trang nội dung</h2><p className="mt-1 text-xs text-slate-500">Dùng cùng thiết kế với Chính sách bảo mật và Điều khoản sử dụng.</p></div><button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Đóng"><X className="h-5 w-5" /></button></div><div className="mt-5 space-y-4"><label className="block space-y-1.5"><span className="text-xs font-bold">Tên trang *</span><input value={name} onChange={(event) => onNameChange(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950" placeholder="Ví dụ: Quy chế hoạt động" /></label><div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Đường dẫn tự động</p><p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">/{slug}</p><p className="mt-1 text-[11px] text-slate-500">Nếu đã tồn tại, hệ thống tự thêm hậu tố ngắn như -2, -3.</p></div><div className="break-all rounded-xl bg-orange-50 p-3 text-xs text-orange-800"><span className="font-bold">Link sau khi xuất bản:</span> https://cic.com.vn/{slug}</div></div><div className="mt-6 flex justify-end gap-2"><CmsButton variant="secondary" onClick={onClose}>Hủy</CmsButton><CmsButton onClick={onCreate} disabled={!name.trim()}>Tạo Draft</CmsButton></div></div></div>;
}

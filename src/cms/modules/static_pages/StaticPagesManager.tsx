import React, { useMemo, useState } from 'react';
import { CheckCircle2, Edit, Eye, FileText, Globe2, RefreshCw, Search } from 'lucide-react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsListFooter } from '../../components/ui/CmsPagination';
import { PageBuilderEditor } from './PageBuilderEditor';
import { PageBuilderPreviewModal } from './PageBuilderPreviewModal';
import { pageBuilderPagesMock } from './pageBuilderData';
import type { PageBuilderPage } from './pageBuilderTypes';

interface StaticPagesManagerProps {
  workspaceLocale: CmsLocale;
}

function clonePages(): PageBuilderPage[] {
  return JSON.parse(JSON.stringify(pageBuilderPagesMock)) as PageBuilderPage[];
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export const StaticPagesManager: React.FC<StaticPagesManagerProps> = ({ workspaceLocale }) => {
  const [pages, setPages] = useState<PageBuilderPage[]>(clonePages);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<PageBuilderPage | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'has_draft' | 'published'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const filteredPages = useMemo(() => pages.filter((page) => {
    const normalized = query.trim().toLowerCase();
    const matchesQuery = !normalized || page.name.toLowerCase().includes(normalized) || page.slug.toLowerCase().includes(normalized) || page.code.includes(normalized);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' ? Boolean(page.published) : page.draft.version > page.published.version);
    return matchesQuery && matchesStatus;
  }), [pages, query, statusFilter]);

  const editingPage = pages.find((page) => page.id === editingId) ?? null;
  if (editingPage) {
    return <>
      {toast && <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{toast}</div>}
      <PageBuilderEditor
        key={`${editingPage.id}-${editingPage.draft.version}-${editingPage.published.version}`}
        page={editingPage}
        onBack={() => setEditingId(null)}
        onSaveDraft={(nextPage) => {
          const saved: PageBuilderPage = { ...nextPage, draft: { ...nextPage.draft, version: nextPage.draft.version + 1, status: 'draft', updatedAt: new Date().toISOString() } };
          setPages((current) => current.map((page) => page.id === saved.id ? saved : page));
          showToast('Đã lưu bản nháp. Website chưa thay đổi.');
        }}
        onPreview={(nextPage) => setPreviewPage(nextPage)}
        onPublish={(nextPage) => {
          const now = new Date().toISOString();
          const publishedVersion = { ...JSON.parse(JSON.stringify(nextPage.draft)), status: 'published' as const, publishedAt: now, updatedAt: now };
          const saved = { ...nextPage, published: publishedVersion };
          setPages((current) => current.map((page) => page.id === saved.id ? saved : page));
          showToast('Đã xuất bản Page thành công.');
        }}
      />
      <PageBuilderPreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />
    </>;
  }

  return (
    <div className="space-y-5">
      {toast && <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{toast}</div>}
      <CmsPageHeader icon={<FileText />} title="Trang nội dung" description="Quản lý nội dung các Page đã được hệ thống định nghĩa. Section và giao diện được kiểm soát bởi code." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{pages.length} Page · {workspaceLocale.toUpperCase()}</span>} actions={<CmsButton variant="secondary" leadingIcon={<RefreshCw />} onClick={() => showToast('Đã tải lại danh sách Page.')}>Làm mới</CmsButton>} />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, code hoặc đường dẫn..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" /></div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800"><option value="all">Tất cả trạng thái</option><option value="has_draft">Có thay đổi Draft</option><option value="published">Đã xuất bản</option></select>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto"><table className="cms-data-table min-w-[920px] text-left"><thead><tr><th className="p-3">Page</th><th className="p-3">Code / đường dẫn</th><th className="p-3">Section</th><th className="p-3">Draft</th><th className="p-3">Published</th><th className="p-3 text-right">Thao tác</th></tr></thead><tbody>
          {filteredPages.map((page) => {
            const changed = page.draft.version > page.published.version;
            return <tr key={page.id} className="border-t border-slate-100 dark:border-slate-800"><td className="p-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/30"><Globe2 className="h-4 w-4" /></span><div><p className="text-sm font-bold text-slate-900 dark:text-white">{page.name}</p><p className="text-xs text-slate-500">{page.pageType}</p></div></div></td><td className="p-3"><p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{page.code}</p><p className="mt-1 text-xs text-slate-500">{page.slug}</p></td><td className="p-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{page.draft.sections.length} cố định</td><td className="p-3"><span className={`rounded-md px-2 py-1 text-xs font-bold ${changed ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>v{page.draft.version}{changed ? ' · Chưa publish' : ''}</span><p className="mt-1 text-[11px] text-slate-400">{formatTime(page.draft.updatedAt)}</p></td><td className="p-3"><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">v{page.published.version} · Published</span><p className="mt-1 text-[11px] text-slate-400">{formatTime(page.published.publishedAt ?? page.published.updatedAt)}</p></td><td className="p-3"><div className="flex justify-end gap-1"><button onClick={() => setPreviewPage(page)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600 dark:hover:bg-slate-800" title="Preview Draft"><Eye className="h-4 w-4" /></button><button onClick={() => setEditingId(page.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600 dark:hover:bg-slate-800" title="Chỉnh sửa"><Edit className="h-4 w-4" /></button></div></td></tr>;
          })}
        </tbody></table></div>
        {filteredPages.length === 0 && <div className="py-12 text-center text-sm text-slate-500">Không tìm thấy Page phù hợp.</div>}
        <CmsListFooter visibleCount={filteredPages.length} totalCount={pages.length} itemLabel="Page" />
      </section>
      <PageBuilderPreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />
    </div>
  );
};

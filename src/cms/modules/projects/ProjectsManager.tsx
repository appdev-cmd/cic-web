import React, { useMemo, useState } from 'react';
import { Archive, BriefcaseBusiness, CheckCircle2, Edit3, Plus, RotateCcw, Search, Star, Trash2 } from 'lucide-react';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { ProjectFormView } from './ProjectFormView';
import type { CmsProject, ProjectsModuleData } from './types';

interface Props { data: ProjectsModuleData; }
type StatusFilter = 'all' | 'published' | 'draft';

export const ProjectsManager: React.FC<Props> = ({ data }) => {
  const [projects, setProjects] = useState(data.projects);
  const [editing, setEditing] = useState<CmsProject | null | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sector, setSector] = useState('all');
  const [featured, setFeatured] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState('');

  const sectors = useMemo(() => Array.from(new Set(projects.map((item) => item.sector).filter(Boolean))).sort(), [projects]);
  const filtered = useMemo(() => projects.filter((project) => {
    const keyword = query.trim().toLowerCase();
    if (keyword && !`${project.title} ${project.summary} ${project.customer_name} ${project.location}`.toLowerCase().includes(keyword)) return false;
    if (status === 'published' && !project.published) return false;
    if (status === 'draft' && project.published) return false;
    if (sector !== 'all' && project.sector !== sector) return false;
    if (featured === 'yes' && !project.is_featured) return false;
    if (featured === 'no' && project.is_featured) return false;
    return true;
  }).sort((a, b) => a.ordering - b.ordering || a.title.localeCompare(b.title)), [projects, query, status, sector, featured]);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageIds = pageItems.map((item) => item.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const reset = () => { setQuery(''); setStatus('all'); setSector('all'); setFeatured('all'); setCurrentPage(1); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3000); };

  const save = (saved: CmsProject) => {
    if (projects.some((item) => item.id !== saved.id && item.alias === saved.alias)) return notify('Đường dẫn này đã được một dự án khác sử dụng.');
    const exists = projects.some((item) => item.id === saved.id);
    setProjects((current) => exists ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
    setEditing(undefined);
    notify(exists ? 'Đã cập nhật dự án.' : 'Đã thêm dự án.');
  };
  const updateSelected = (patch: Partial<CmsProject>, message: string) => {
    setProjects((current) => current.map((item) => selectedIds.includes(item.id) ? { ...item, ...patch, updated_time: new Date().toISOString() } : item));
    setSelectedIds([]);
    notify(message);
  };

  if (editing !== undefined) return <ProjectFormView project={editing} productOptions={data.productOptions} serviceOptions={data.serviceOptions} onSave={save} onCancel={() => setEditing(undefined)} />;

  return <div className="relative space-y-6 pb-16">
    {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl"><CheckCircle2 className="size-4 text-emerald-400" />{toast}</div>}
    <CmsPageHeader icon={<BriefcaseBusiness />} title="Dự án" description="Quản lý dự án hiển thị trên website, nội dung chi tiết và dữ liệu phân loại." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{projects.length} dự án</span>} actions={<CmsButton size="sm" variant="primary" leadingIcon={<Plus />} onClick={() => setEditing(null)}>Thêm dự án</CmsButton>} />

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} placeholder="Tìm tên dự án, khách hàng, địa điểm..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" /></div>
        <div className="grid gap-2 sm:grid-cols-3 lg:flex lg:shrink-0">
          <select value={status} onChange={(e) => { setStatus(e.target.value as StatusFilter); setCurrentPage(1); }} className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"><option value="all">Tất cả trạng thái</option><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select>
          <select value={sector} onChange={(e) => { setSector(e.target.value); setCurrentPage(1); }} className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"><option value="all">Tất cả lĩnh vực</option>{sectors.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={featured} onChange={(e) => { setFeatured(e.target.value); setCurrentPage(1); }} className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-800"><option value="all">Tất cả hiển thị</option><option value="yes">Dự án nổi bật</option><option value="no">Không nổi bật</option></select>
        </div>
        <button type="button" disabled={!query && status === 'all' && sector === 'all' && featured === 'all'} onClick={reset} className="ml-auto flex h-9 w-24 shrink-0 items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"><RotateCcw className="size-3.5" />Đặt lại</button>
      </div>
      <div className="mt-3"><CmsBulkActionBar selectedCount={selectedIds.length} itemLabel="dự án" onClear={() => setSelectedIds([])} actions={[{ label: 'Xuất bản', icon: CheckCircle2, onClick: () => updateSelected({ published: true }, 'Đã xuất bản các dự án đã chọn.') }, { label: 'Chuyển bản nháp', icon: Archive, onClick: () => updateSelected({ published: false }, 'Đã chuyển các dự án về bản nháp.') }, { label: 'Xóa', icon: Trash2, variant: 'danger', onClick: () => { setProjects((current) => current.filter((item) => !selectedIds.includes(item.id))); setSelectedIds([]); notify('Đã xóa các dự án đã chọn khỏi mock hiện tại.'); } }]} /></div>
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto"><table className="cms-data-table min-w-[1050px] text-left"><thead><tr><th className="w-12 px-3 py-3"><CmsSelectionCheckbox checked={allPageSelected} indeterminate={!allPageSelected && pageIds.some((id) => selectedIds.includes(id))} onChange={() => setSelectedIds((current) => allPageSelected ? current.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...current, ...pageIds])))} label="Chọn tất cả dự án trên trang" /></th><th className="min-w-[320px] px-4 py-3">Dự án</th><th className="min-w-[180px] px-4 py-3">Lĩnh vực / Giải pháp</th><th className="min-w-[180px] px-4 py-3">Khách hàng</th><th className="min-w-[130px] px-4 py-3">Thời gian</th><th className="min-w-[130px] px-4 py-3">Trạng thái</th><th className="w-24 px-4 py-3 text-center">Thao tác</th></tr></thead>
        <tbody>{pageItems.map((project) => <tr key={project.id}><td className="px-3 py-3"><CmsSelectionCheckbox checked={selectedIds.includes(project.id)} onChange={() => setSelectedIds((current) => current.includes(project.id) ? current.filter((id) => id !== project.id) : [...current, project.id])} label={`Chọn ${project.title}`} /></td><td className="px-4 py-3"><div className="flex items-center gap-3">{project.image ? <img src={project.image} alt="" className="h-12 w-20 rounded-lg object-cover" /> : <div className="h-12 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />}<div className="min-w-0"><button onClick={() => setEditing(project)} className="line-clamp-2 text-left text-sm font-bold text-slate-900 hover:text-orange-600 dark:text-white">{project.title}</button><p className="mt-1 truncate font-mono text-[10px] text-slate-400">/{project.alias}</p></div></div></td><td className="px-4 py-3 text-xs"><p className="font-bold text-slate-800 dark:text-slate-200">{project.sector || '—'}</p><p className="mt-1 text-slate-500">{project.solution || '—'}</p></td><td className="px-4 py-3 text-xs"><p className="font-semibold text-slate-800 dark:text-slate-200">{project.customer_name || '—'}</p><p className="mt-1 text-slate-500">{project.location || '—'}</p></td><td className="px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-300">{formatPeriod(project)}</td><td className="px-4 py-3"><div className="flex flex-col items-start gap-1">{project.is_featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700"><Star className="size-3" />Nổi bật</span>}<span className={`rounded-full px-2 py-1 text-[10px] font-bold ${project.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{project.published ? 'Đã xuất bản' : 'Bản nháp'}</span></div></td><td className="px-4 py-3"><div className="flex justify-center gap-1"><CmsIconButton aria-label={`Sửa ${project.title}`} icon={<Edit3 />} onClick={() => setEditing(project)} /><CmsIconButton aria-label={`Xóa ${project.title}`} icon={<Trash2 />} variant="danger" onClick={() => { if (window.confirm(`Xóa dự án “${project.title}”?`)) { setProjects((current) => current.filter((item) => item.id !== project.id)); notify('Đã xóa dự án khỏi mock hiện tại.'); } }} /></div></td></tr>)}</tbody></table></div>
      {pageItems.length === 0 && <div className="py-14 text-center text-sm text-slate-500">Không tìm thấy dự án phù hợp.</div>}
      <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filtered.length} itemLabel="dự án" pageSizeOptions={[10, 20, 50]} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
    </section>
  </div>;
};

const formatPeriod = (project: CmsProject) => project.start_year ? project.is_ongoing ? `${project.start_year} - Hiện tại` : project.end_year && project.end_year !== project.start_year ? `${project.start_year} - ${project.end_year}` : String(project.start_year) : '—';

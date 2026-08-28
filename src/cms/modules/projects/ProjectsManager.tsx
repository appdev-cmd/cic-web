import React, { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, Edit3, Eye, Plus, RotateCcw, Search, Star, Trash2, X } from 'lucide-react';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { ProjectFormView } from './ProjectFormView';
import { ProjectPreviewModal } from './ProjectPreviewModal';
import type { CmsProject, ProjectsModuleData } from './types';
import { FEATURED_CONTENT_LIMITS } from '../featuredContentPolicy';
import { createProjectAction, updateProjectAction, deleteProjectAction, bulkUpdateProjectsAction } from '@/features/projects/server/actions';

interface Props { data: ProjectsModuleData; }
type StatusFilter = 'all' | 'published' | 'draft';

export const ProjectsManager: React.FC<Props> = ({ data }) => {
  const [projects, setProjectsState] = useState(data.projects);
  const setProjects = (updater: typeof data.projects | ((current: typeof data.projects) => typeof data.projects)) => {
    setProjectsState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      const removed = current.filter((item) => !next.some((candidate) => candidate.id === item.id));
      if (removed.length) void Promise.all(removed.map((item) => deleteProjectAction(item.id))).catch(() => undefined);
      return next;
    });
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; fetch('/api/cms/projects').then(async (response) => { if (!response.ok) throw new Error('Không thể tải danh sách dự án.'); const body = await response.json() as { projects?: CmsProject[] }; if (active && body.projects) setProjects(body.projects); }).catch(() => undefined).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const [editing, setEditing] = useState<CmsProject | null | undefined>(undefined);
  const [previewProject, setPreviewProject] = useState<CmsProject | null>(null);
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
  const isFilterActive = Boolean(query || status !== 'all' || sector !== 'all' || featured !== 'all');
  const reset = () => { setQuery(''); setStatus('all'); setSector('all'); setFeatured('all'); setCurrentPage(1); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3000); };

  const save = async (saved: CmsProject) => {
    const payload = { ...saved, id: undefined };
    try {
      const result = saved.id.startsWith('project_') ? await createProjectAction(payload) : await updateProjectAction(saved.id, payload);
      saved = { ...saved, id: String((result as { id?: string | number }).id ?? saved.id) };
    } catch (error) { return notify(error instanceof Error ? error.message : 'Không thể lưu dự án.'); }
    if (projects.some((item) => item.id !== saved.id && item.alias === saved.alias)) return notify('Đường dẫn này đã được một dự án khác sử dụng.');
    if (saved.is_featured && !projects.find((item) => item.id === saved.id)?.is_featured && projects.filter((item) => item.is_featured).length >= FEATURED_CONTENT_LIMITS.project) return notify(`Chỉ được chọn tối đa ${FEATURED_CONTENT_LIMITS.project} dự án nổi bật.`);
    const exists = projects.some((item) => item.id === saved.id);
    setProjects((current) => exists ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
    setEditing(undefined);
    notify(exists ? 'Đã cập nhật dự án.' : 'Đã thêm dự án.');
  };
  const toggleFeatured = async (id: string) => {
    const target = projects.find((item) => item.id === id);
    if (!target) return;
    if (!target?.is_featured && projects.filter((item) => item.is_featured).length >= FEATURED_CONTENT_LIMITS.project) return notify(`Đã đủ ${FEATURED_CONTENT_LIMITS.project} dự án nổi bật. Hãy bỏ chọn một dự án khác trước.`);
    try { await bulkUpdateProjectsAction([id], { is_featured: !target.is_featured }); } catch (error) { return notify(error instanceof Error ? error.message : 'Không thể cập nhật dự án.'); }
    setProjects((current) => current.map((item) => item.id === id ? { ...item, is_featured: !item.is_featured, updated_time: new Date().toISOString() } : item));
    notify(target?.is_featured ? 'Đã bỏ dự án khỏi nhóm Nổi bật.' : 'Đã thêm dự án vào nhóm Nổi bật.');
  };
const removeProject = async (id: string) => { try { await deleteProjectAction(id); setProjects((current) => current.filter((item) => item.id !== id)); notify('Đã xóa dự án.'); } catch (error) { notify(error instanceof Error ? error.message : 'Không thể xóa dự án.'); } };
  const removeSelectedProjects = async () => {
    try { await Promise.all(selectedIds.map((id) => deleteProjectAction(id))); setProjects((current) => current.filter((item) => !selectedIds.includes(item.id))); setSelectedIds([]); notify('Đã xóa các dự án đã chọn.'); }
    catch (error) { notify(error instanceof Error ? error.message : 'Không thể xóa các dự án đã chọn.'); }
  };
  const updateSelected = async (patch: Partial<CmsProject>, message: string) => {
    try { await bulkUpdateProjectsAction(selectedIds, { published: patch.published, is_featured: patch.is_featured }); } catch (error) { return notify(error instanceof Error ? error.message : 'Không thể cập nhật các dự án.'); }
    setProjects((current) => current.map((item) => selectedIds.includes(item.id) ? { ...item, ...patch, updated_time: new Date().toISOString() } : item));
    setSelectedIds([]);
    notify(message);
  };

  if (editing !== undefined) return <><ProjectFormView project={editing} productOptions={data.productOptions} serviceOptions={data.serviceOptions} featuredCount={projects.filter((item) => item.id !== editing?.id && item.is_featured).length} onSave={save} onPreview={setPreviewProject} onCancel={() => setEditing(undefined)} /><ProjectPreviewModal project={previewProject} onClose={() => setPreviewProject(null)} /></>;

  return <div className="relative space-y-6 pb-16">
    {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl"><CheckCircle2 className="size-4 text-emerald-400" />{toast}</div>}
    <CmsPageHeader icon={<BriefcaseBusiness />} title="Dự án" description="Quản lý dự án hiển thị trên website, nội dung chi tiết và dữ liệu phân loại." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{projects.length} dự án</span>} actions={<CmsButton size="sm" variant="primary" leadingIcon={<Plus />} onClick={() => setEditing(null)}>Thêm dự án</CmsButton>} />

    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex items-center w-full sm:w-56 lg:w-64 shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Tìm tên dự án, khách hàng..."
            className="w-full h-9.5 pl-9 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setCurrentPage(1); }}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="min-w-[140px] flex-1 max-w-[200px]">
          <select value={status} onChange={(e) => { setStatus(e.target.value as StatusFilter); setCurrentPage(1); }} className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"><option value="all">Tất cả trạng thái</option><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select>
        </div>
        <div className="min-w-[140px] flex-1 max-w-[200px]">
          <select value={sector} onChange={(e) => { setSector(e.target.value); setCurrentPage(1); }} className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"><option value="all">Tất cả lĩnh vực</option>{sectors.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <div className="min-w-[140px] flex-1 max-w-[200px]">
          <select value={featured} onChange={(e) => { setFeatured(e.target.value); setCurrentPage(1); }} className="w-full h-9.5 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer truncate"><option value="all">Tất cả hiển thị</option><option value="yes">Dự án nổi bật</option><option value="no">Không nổi bật</option></select>
        </div>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            type="button"
            disabled={!isFilterActive}
            onClick={reset}
            className={`flex h-9.5 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              isFilterActive
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 dark:hover:bg-orange-900/80 shadow-xs'
                : 'text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 disabled:cursor-not-allowed disabled:opacity-50'
            }`}
            title="Đặt lại tất cả bộ lọc và tìm kiếm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>
    </section>

    {/* Bulk Actions Bar outside filter */}
    <CmsBulkActionBar selectedCount={selectedIds.length} itemLabel="dự án" onClear={() => setSelectedIds([])} actions={[{ label: 'Xuất bản', icon: CheckCircle2, variant: 'primary', onClick: () => updateSelected({ published: true }, 'Đã xuất bản các dự án đã chọn.') }, { label: 'Chuyển bản nháp', icon: RotateCcw, onClick: () => updateSelected({ published: false }, 'Đã chuyển các dự án về bản nháp.') }, { label: 'Xóa', icon: Trash2, variant: 'danger', onClick: () => { setProjects((current) => current.filter((item) => !selectedIds.includes(item.id))); setSelectedIds([]); notify('Đã xóa các dự án đã chọn khỏi mock hiện tại.'); } }]} />

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto"><table className="cms-data-table min-w-[1050px] text-left"><thead><tr><th className="w-12 px-3 py-3"><CmsSelectionCheckbox checked={allPageSelected} indeterminate={!allPageSelected && pageIds.some((id) => selectedIds.includes(id))} onChange={() => setSelectedIds((current) => allPageSelected ? current.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...current, ...pageIds])))} label="Chọn tất cả dự án trên trang" /></th><th className="min-w-[320px] px-4 py-3">Dự án</th><th className="min-w-[180px] px-4 py-3">Lĩnh vực / Giải pháp</th><th className="min-w-[180px] px-4 py-3">Khách hàng</th><th className="min-w-[130px] px-4 py-3">Thời gian</th><th className="min-w-[130px] px-4 py-3">Trạng thái</th><th className="w-24 px-4 py-3 text-center">Thao tác</th></tr></thead>
        <tbody>{pageItems.map((project) => <tr key={project.id}><td className="px-3 py-3"><CmsSelectionCheckbox checked={selectedIds.includes(project.id)} onChange={() => setSelectedIds((current) => current.includes(project.id) ? current.filter((id) => id !== project.id) : [...current, project.id])} label={`Chọn ${project.title}`} /></td><td className="px-4 py-3"><div className="flex items-center gap-3">{project.image ? <img src={project.image} alt="" className="h-12 w-20 rounded-lg object-cover" /> : <div className="h-12 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />}<div className="min-w-0"><button onClick={() => setEditing(project)} className="line-clamp-2 text-left text-sm font-bold text-slate-900 hover:text-orange-600 dark:text-white">{project.title}</button><p className="mt-1 truncate font-mono text-[10px] text-slate-400">/{project.alias}</p></div></div></td><td className="px-4 py-3 text-xs"><p className="font-bold text-slate-800 dark:text-slate-200">{project.sector || '—'}</p><p className="mt-1 text-slate-500">{project.solution || '—'}</p></td><td className="px-4 py-3 text-xs"><p className="font-semibold text-slate-800 dark:text-slate-200">{project.customer_name || '—'}</p><p className="mt-1 text-slate-500">{project.location || '—'}</p></td><td className="px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-300">{formatPeriod(project)}</td><td className="px-4 py-3"><div className="flex flex-col items-start gap-1">{project.is_featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700"><Star className="size-3" />Nổi bật</span>}<span className={`rounded-full px-2 py-1 text-[10px] font-bold ${project.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{project.published ? 'Đã xuất bản' : 'Bản nháp'}</span></div></td><td className="px-4 py-3"><div className="flex justify-center gap-1"><CmsIconButton aria-label={`Xem trước ${project.title}`} icon={<Eye />} onClick={() => setPreviewProject(project)} /><CmsIconButton aria-label={`Sửa ${project.title}`} icon={<Edit3 />} onClick={() => setEditing(project)} /><CmsIconButton aria-label={`Xóa ${project.title}`} icon={<Trash2 />} variant="danger" onClick={() => { if (window.confirm(`Xóa dự án “${project.title}”?`)) { setProjects((current) => current.filter((item) => item.id !== project.id)); notify('Đã xóa dự án khỏi mock hiện tại.'); } }} /></div></td></tr>)}</tbody></table></div>
      {pageItems.length === 0 && <div className="py-14 text-center text-sm text-slate-500">Không tìm thấy dự án phù hợp.</div>}
      <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filtered.length} itemLabel="dự án" pageSizeOptions={[10, 20, 50]} onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
    </section>
    <ProjectPreviewModal project={previewProject} onClose={() => setPreviewProject(null)} />
  </div>;
};

const formatPeriod = (project: CmsProject) => project.start_year ? project.is_ongoing ? `${project.start_year} - Hiện tại` : project.end_year && project.end_year !== project.start_year ? `${project.start_year} - ${project.end_year}` : String(project.start_year) : '—';

import React, { useMemo, useState } from 'react';
import { ArrowLeft, Edit3, Eye, EyeOff, FolderTree, Home, Plus, Search, Star, Trash2 } from 'lucide-react';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { NewsCategoryFormDrawer } from './NewsCategoryFormDrawer';
import type { NewsCategory } from './types';

interface Props {
  categories: NewsCategory[];
  onChange: (categories: NewsCategory[]) => void;
  onBack: () => void;
  onMessage: (message: string) => void;
}

export const NewsCategoryManager: React.FC<Props> = ({ categories, onChange, onBack, onMessage }) => {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<NewsCategory | null | undefined>(undefined);
  const ordered = useMemo(() => buildTree(categories).filter((item) => !query.trim() || `${item.name} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase())), [categories, query]);

  const save = (saved: NewsCategory) => {
    const exists = categories.some((item) => item.id === saved.id);
    onChange(exists ? categories.map((item) => item.id === saved.id ? saved : item) : [...categories, saved]);
    setEditing(undefined);
    onMessage(exists ? 'Đã cập nhật danh mục tin tức.' : 'Đã thêm danh mục tin tức.');
  };
  const toggle = (id: string, field: 'published' | 'show_in_homepage' | 'is_hot') => onChange(categories.map((item) => item.id === id ? { ...item, [field]: !item[field] } : item));
  const remove = (item: NewsCategory) => {
    if ((item.count ?? 0) > 0) return onMessage(`Không thể xóa “${item.name}” vì đang có ${item.count} bài viết.`);
    if (categories.some((candidate) => candidate.parent_id === item.id)) return onMessage(`Không thể xóa “${item.name}” vì vẫn còn danh mục con.`);
    if (window.confirm(`Xóa danh mục “${item.name}”?`)) { onChange(categories.filter((candidate) => candidate.id !== item.id)); onMessage('Đã xóa danh mục tin tức.'); }
  };

  return <div className="space-y-5">
    <CmsPageHeader icon={<FolderTree />} title="Danh mục tin tức" description="Quản lý cấu trúc, hiển thị và SEO của các trang danh mục tin tức." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">{categories.length} danh mục</span>} actions={<><CmsButton size="sm" variant="secondary" leadingIcon={<ArrowLeft />} onClick={onBack}>Quay lại tin tức</CmsButton><CmsButton size="sm" variant="primary" leadingIcon={<Plus />} onClick={() => setEditing(null)}>Thêm danh mục</CmsButton></>} />
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"><div className="relative max-w-lg"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc đường dẫn..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800" /></div></section>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70"><tr><th className="px-4 py-3">Tên danh mục</th><th className="px-4 py-3">Đường dẫn</th><th className="px-4 py-3 text-center">Bài viết</th><th className="px-4 py-3 text-center">Thứ tự</th><th className="px-4 py-3 text-center">Trang chủ</th><th className="px-4 py-3 text-center">Nổi bật</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{ordered.map((item) => <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40"><td className="px-4 py-3"><div className="flex items-center gap-2" style={{ paddingLeft: `${item.depth * 20}px` }}>{item.depth > 0 && <span className="text-slate-300">└</span>}<div><p className="font-bold text-slate-900 dark:text-white">{item.name}</p>{item.title && item.title !== item.name && <p className="mt-0.5 text-[11px] text-slate-400">{item.title}</p>}</div></div></td><td className="px-4 py-3 font-mono text-[11px] text-orange-600">/tin-tuc/{item.slug}</td><td className="px-4 py-3 text-center font-bold">{item.count ?? 0}</td><td className="px-4 py-3 text-center">{item.ordering ?? 1}</td><td className="px-4 py-3 text-center"><button onClick={() => toggle(item.id, 'show_in_homepage')} className={`rounded-lg p-2 ${item.show_in_homepage ? 'bg-blue-50 text-blue-600' : 'text-slate-300'}`} aria-label="Đổi hiển thị trang chủ"><Home className="h-4 w-4" /></button></td><td className="px-4 py-3 text-center"><button onClick={() => toggle(item.id, 'is_hot')} className={`rounded-lg p-2 ${item.is_hot ? 'bg-amber-50 text-amber-600' : 'text-slate-300'}`} aria-label="Đổi trạng thái nổi bật"><Star className="h-4 w-4" /></button></td><td className="px-4 py-3"><button onClick={() => toggle(item.id, 'published')} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{item.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}{item.published ? 'Đang xuất bản' : 'Tạm ẩn'}</button></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><CmsIconButton aria-label={`Sửa ${item.name}`} icon={<Edit3 />} onClick={() => setEditing(item)} /><CmsIconButton aria-label={`Xóa ${item.name}`} icon={<Trash2 />} variant="danger" onClick={() => remove(item)} /></div></td></tr>)}</tbody></table></div>
      {ordered.length === 0 && <div className="py-12 text-center text-sm text-slate-500">Không tìm thấy danh mục phù hợp.</div>}
    </section>
    {editing !== undefined && <NewsCategoryFormDrawer category={editing} categories={categories} onClose={() => setEditing(undefined)} onSave={save} />}
  </div>;
};

type TreeItem = NewsCategory & { depth: number };
function buildTree(categories: NewsCategory[]): TreeItem[] {
  const result: TreeItem[] = [];
  const append = (parentId: string | null, depth: number, visited: Set<string>) => categories.filter((item) => (item.parent_id ?? null) === parentId).sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0)).forEach((item) => { if (visited.has(item.id)) return; const next = new Set(visited).add(item.id); result.push({ ...item, depth }); append(item.id, depth + 1, next); });
  append(null, 0, new Set());
  categories.filter((item) => !result.some((found) => found.id === item.id)).forEach((item) => result.push({ ...item, depth: 0 }));
  return result;
}

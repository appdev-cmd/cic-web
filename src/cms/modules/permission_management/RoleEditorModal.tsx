import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Search, Shield, X } from 'lucide-react';
import type { CmsRole, MatrixAction, ModulePermissionMatrix, PermissionTask } from './types';
import { CmsButton } from '../../components/ui/CmsButton';

interface Props { isOpen: boolean; onClose: () => void; onSaveRole: (role: CmsRole) => void | Promise<void>; roleToEdit: CmsRole | null; existingRoles: CmsRole[]; permissionTasks: PermissionTask[]; isSaving?: boolean }
const actions: { code: MatrixAction; label: string }[] = [{ code: 'view', label: 'Xem' }, { code: 'create', label: 'Tạo' }, { code: 'edit', label: 'Sửa' }, { code: 'publish', label: 'Xuất bản' }, { code: 'delete', label: 'Xóa' }, { code: 'export', label: 'Xuất' }, { code: 'configure', label: 'Cấu hình' }];

export const RoleEditorModal: React.FC<Props> = ({ isOpen, onClose, onSaveRole, roleToEdit, existingRoles, permissionTasks, isSaving = false }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(roleToEdit?.name ?? '');
  const [description, setDescription] = useState(roleToEdit?.description ?? '');
  const [matrix, setMatrix] = useState<ModulePermissionMatrix>(roleToEdit?.matrix ?? {});
  const [permissionQuery, setPermissionQuery] = useState('');
  const [error, setError] = useState('');
  const filteredTasks = useMemo(() => { const query = permissionQuery.trim().toLocaleLowerCase('vi'); return !query ? permissionTasks : permissionTasks.filter((task) => `${task.module} ${task.view} ${task.task} ${task.description}`.toLocaleLowerCase('vi').includes(query)); }, [permissionQuery, permissionTasks]);
  const groupedTasks = useMemo(() => filteredTasks.reduce<Map<string, PermissionTask[]>>((groups, task) => { const key = task.module.trim() || 'Khác'; groups.set(key, [...(groups.get(key) ?? []), task]); return groups; }, new Map()), [filteredTasks]);
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSaving) onClose();
      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled])') ?? [])];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); };
  }, [isOpen, isSaving, onClose]);
  if (!isOpen) return null;
  const toggle = (taskId: string, action: MatrixAction) => setMatrix((current) => ({ ...current, [taskId]: { ...current[taskId], [action]: current[taskId]?.[action] === 'allowed' ? 'denied' : 'allowed' } }));
  const save = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 255) return setError('Tên vai trò phải có từ 2 đến 255 ký tự.');
    if (existingRoles.some((role) => role.id !== roleToEdit?.id && role.name.trim().toLocaleLowerCase('vi') === trimmed.toLocaleLowerCase('vi'))) return setError('Tên vai trò đã tồn tại.');
    if (description.trim().length > 5000) return setError('Mô tả không được vượt quá 5.000 ký tự.');
    void onSaveRole({ id: roleToEdit?.id ?? 'new', code: roleToEdit?.code ?? '', name: trimmed, description: description.trim(), status: roleToEdit?.status ?? 'active', isProtected: roleToEdit?.isProtected ?? false, matrix, assignedUsersCount: roleToEdit?.assignedUsersCount ?? 0, updatedTime: roleToEdit?.updatedTime ?? new Date(0).toISOString(), updatedById: roleToEdit?.updatedById ?? null });
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="role-editor-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) onClose(); }}>
    <div ref={dialogRef} className="my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[92vh] [&_label]:!text-xs [&_[role=alert]]:!text-xs [&_[role=alert]]:!font-medium [&_tbody]:!text-sm [&_thead]:!text-xs [&_tbody_.font-mono]:!text-[11px] dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4 dark:border-slate-800"><div className="flex min-w-0 items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40"><Shield className="size-5" /></span><div className="min-w-0"><h2 id="role-editor-title" className="truncate font-bold text-slate-950 dark:text-white">{roleToEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}</h2><p className="text-xs text-slate-500 dark:text-slate-400">Chọn quyền theo từng tác vụ đang hoạt động.</p></div></div><button ref={closeButtonRef} type="button" onClick={onClose} disabled={isSaving} className="min-h-11 min-w-11 rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-500 dark:hover:bg-slate-800" aria-label="Đóng"><X className="mx-auto size-5" /></button></header>
      <div className="overflow-y-auto p-4 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"><span>Tên vai trò *</span><input autoFocus value={name} maxLength={255} onChange={(event) => { setName(event.target.value); setError(''); }} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label><label className="space-y-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300"><span>Mô tả</span><input value={description} maxLength={5000} onChange={(event) => setDescription(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 sm:text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label></div>{error && <p role="alert" className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
        <section className="mt-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-sm font-bold text-slate-950 dark:text-white">Quyền theo tác vụ</h3><p className="mt-0.5 text-xs text-slate-500">Chọn đúng thao tác cần cấp; ô trống là không được phép.</p></div><label className="relative w-full sm:max-w-64"><span className="sr-only">Tìm tác vụ quyền</span><Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" /><input type="search" value={permissionQuery} onChange={(event) => setPermissionQuery(event.target.value)} placeholder="Tìm phân hệ hoặc tác vụ..." className="min-h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2.5 text-base outline-none focus:border-orange-500 sm:min-h-9 sm:text-sm dark:border-slate-700 dark:bg-slate-800" /></label></div><p className="mt-2 text-[11px] text-slate-500 sm:hidden">Vuốt ngang từng nhóm để xem đủ thao tác.</p>{permissionTasks.length ? <div className="mt-3 space-y-3">{[...groupedTasks].map(([module, tasks]) => <div key={module} className="overflow-x-auto rounded-xl border border-slate-200 overscroll-x-contain dark:border-slate-800"><table className="w-full min-w-[720px] text-left text-xs"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800/70"><tr><th className="min-w-56 px-3 py-2">{module}</th>{actions.map((action) => <th key={action.code} className="px-2 py-2 text-center">{action.label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{tasks.map((task) => <tr key={task.id}><th className="px-3 py-2"><span className="block font-semibold text-slate-800 dark:text-slate-200">{task.description || task.task}</span><span className="mt-0.5 block font-mono text-[10px] font-normal text-slate-500">{task.view}/{task.task}</span></th>{actions.map((action) => { const checked = matrix[task.id]?.[action.code] === 'allowed'; return <td key={action.code} className="px-2 py-2 text-center"><button type="button" disabled={isSaving} onClick={() => toggle(task.id, action.code)} aria-pressed={checked} aria-label={`${action.label}: ${task.description || task.task}`} className={`inline-flex size-7 items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-500 ${checked ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300 bg-white text-transparent hover:border-orange-400 dark:border-slate-700 dark:bg-slate-950'}`}>{checked && <Check className="size-3.5" />}</button></td>; })}</tr>)}</tbody></table></div>)}{filteredTasks.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-700">Không tìm thấy tác vụ phù hợp.</div>}</div> : <div className="mt-3 rounded-xl border border-slate-200 p-5 text-sm text-slate-500 dark:border-slate-800">Chưa có task quyền đang hoạt động. Hãy bootstrap danh mục quyền trước khi tạo role.</div>}</section>
      </div><footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 px-4 py-3 sm:px-5 sm:py-4 dark:border-slate-800"><CmsButton variant="secondary" size="sm" onClick={onClose} disabled={isSaving}>Hủy</CmsButton><CmsButton size="sm" onClick={save} disabled={isSaving || permissionTasks.length === 0}>{isSaving ? 'Đang lưu...' : 'Lưu vai trò'}</CmsButton></footer>
    </div>
  </div>;
};

import React, { useMemo, useState } from 'react';
import { Edit, Lock, Search, Shield, Trash2, Unlock, UserPlus, Users, UserX, X } from 'lucide-react';
import type { CmsRole, CmsUserPermissionTarget, RoleAssignment, RoleCategory } from './types';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPagination } from '../../components/ui/CmsPagination';

interface Props {
  roles: CmsRole[];
  assignments: RoleAssignment[];
  users: CmsUserPermissionTarget[];
  onAssignRole: (userId: string, roleId: string) => Promise<void>;
  onRevokeAssignment: (assignmentId: string) => Promise<void>;
  onOpenCreate: () => void;
  onOpenEdit: (role: CmsRole) => void;
  onToggleRoleStatus: (role: CmsRole) => void;
  onDeleteRole: (role: CmsRole) => void;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isMutating: boolean;
}

export const RolesOverviewTab: React.FC<Props> = ({ roles, assignments, users, onAssignRole, onRevokeAssignment, onOpenCreate, onOpenEdit, onToggleRoleStatus, onDeleteRole, canCreate, canEdit, canDelete, isMutating }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | RoleCategory | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [peopleRole, setPeopleRole] = useState<CmsRole | null>(null);
  const filtered = useMemo(() => roles.filter((role) => {
    const needle = query.trim().toLocaleLowerCase('vi');
    const matchesText = !needle || role.name.toLocaleLowerCase('vi').includes(needle) || (role.code ?? '').toLocaleLowerCase('vi').includes(needle) || role.description.toLocaleLowerCase('vi').includes(needle);
    const matchesFilter = filter === 'all' || filter === 'inactive' ? filter === 'all' || role.status === 'inactive' : filter === 'system' ? role.isProtected : !role.isProtected;
    return matchesText && matchesFilter;
  }), [filter, query, roles]);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const filters: { value: typeof filter; label: string; count: number }[] = [
    { value: 'all', label: 'Tất cả', count: roles.length },
    { value: 'system', label: 'Hệ thống', count: roles.filter((role) => role.isProtected).length },
    { value: 'custom', label: 'Tùy chỉnh', count: roles.filter((role) => !role.isProtected).length },
    { value: 'inactive', label: 'Không hoạt động', count: roles.filter((role) => role.status === 'inactive').length },
  ];

  return <section className="space-y-4 [&_select]:text-base sm:[&_select]:text-sm" aria-label="Danh sách vai trò">
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-2 lg:grid-cols-[minmax(16rem,1fr)_auto] lg:items-center">
        <label className="relative flex min-w-0 items-center"><span className="sr-only">Tìm vai trò</span><Search className="pointer-events-none absolute left-3 size-4 text-slate-400" /><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm theo tên, mã hoặc mô tả..." className="min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" /></label>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800" aria-label="Lọc vai trò">{filters.map((item) => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => { setFilter(item.value); setPage(1); }} className={`min-h-9 shrink-0 rounded-lg px-2.5 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-orange-500 ${filter === item.value ? 'bg-white text-orange-600 shadow-2xs dark:bg-slate-900 dark:text-orange-400' : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'}`}>{item.label} ({item.count})</button>)}</div>
      </div>
    </div>

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto"><table className="cms-data-table min-w-[860px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400"><tr><th className="px-4 py-3">Tên vai trò & loại</th><th className="px-4 py-3">Mô tả</th><th className="px-4 py-3 text-center">Trạng thái</th><th className="px-4 py-3 text-center">Nhân sự được gán</th><th className="px-4 py-3 text-center">Quyền</th><th className="px-4 py-3">Cập nhật cuối</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
        <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800">{visible.map((role) => {
          const roleAssignments = assignments.filter((assignment) => assignment.roleId === role.id);
          const permissionCount = Object.values(role.matrix).reduce((count, actions) => count + Object.values(actions).filter((state) => state === 'allowed').length, 0);
          return <tr key={role.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"><td className="px-4 py-3"><div className="flex min-w-0 items-center gap-2"><Shield className={`size-4 shrink-0 ${role.isProtected ? 'text-blue-600' : 'text-orange-600'}`} /><div className="min-w-0"><p className="max-w-56 truncate font-bold text-slate-900 dark:text-white" title={role.name}>{role.name}</p><div className="mt-0.5 flex items-center gap-1.5"><span className="font-mono text-[9px] text-slate-500">{role.code || role.id}</span><span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${role.isProtected ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'}`}>{role.isProtected ? 'SYSTEM' : 'CUSTOM'}</span></div></div></div></td><td className="max-w-xs px-4 py-3 leading-4 text-slate-600 dark:text-slate-300"><p className="line-clamp-2 break-words">{role.description || 'Chưa có mô tả.'}</p></td><td className="px-4 py-3 text-center"><span className={`inline-flex rounded-md border px-2 py-1 text-[9px] font-bold ${role.status === 'active' ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{role.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</span></td><td className="px-4 py-3 text-center"><button type="button" onClick={() => setPeopleRole(role)} className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-blue-300 dark:hover:bg-blue-950/40"><Users className="size-3.5" />{roleAssignments.length}</button></td><td className="px-4 py-3 text-center font-semibold tabular-nums text-slate-700 dark:text-slate-200">{permissionCount}</td><td className="px-4 py-3 text-[11px] text-slate-500"><time dateTime={role.updatedTime}>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(role.updatedTime))}</time></td><td className="px-4 py-3"><div className="flex justify-end gap-1">{canEdit && <><CmsIconButton aria-label={`Gán nhân sự vào ${role.name}`} icon={<UserPlus />} onClick={() => setPeopleRole(role)} disabled={isMutating || role.status !== 'active'} size="sm" /><CmsIconButton aria-label={`Sửa ${role.name}`} icon={<Edit />} onClick={() => onOpenEdit(role)} disabled={isMutating} size="sm" /><CmsIconButton aria-label={`${role.status === 'active' ? 'Tắt' : 'Bật'} ${role.name}`} icon={role.status === 'active' ? <Lock /> : <Unlock />} onClick={() => onToggleRoleStatus(role)} disabled={isMutating || (role.isProtected && role.status === 'active')} size="sm" /></>}{canDelete && !role.isProtected && <CmsIconButton aria-label={`Chuyển ${role.name} vào Thùng rác`} title="Chuyển vào Thùng rác" icon={<Trash2 />} variant="danger" onClick={() => onDeleteRole(role)} disabled={isMutating} size="sm" />}</div></td></tr>;
        })}{visible.length === 0 && <tr><td colSpan={7} className="px-6 py-10 text-center text-xs text-slate-500"><Shield className="mx-auto mb-2 size-7 text-slate-300" /><p className="font-semibold text-slate-700 dark:text-slate-200">{roles.length ? 'Không tìm thấy vai trò phù hợp.' : 'Chưa có vai trò nào.'}</p>{!roles.length && canCreate && <CmsButton className="mt-3" size="sm" onClick={onOpenCreate}>Thêm vai trò đầu tiên</CmsButton>}</td></tr>}</tbody>
      </table></div>
      <CmsPagination currentPage={page} totalCount={filtered.length} pageSize={pageSize} itemLabel="vai trò" onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
    </div>
    {peopleRole && <RolePeopleModal role={peopleRole} assignments={assignments.filter((assignment) => assignment.roleId === peopleRole.id)} users={users} onAssignRole={onAssignRole} onRevokeAssignment={onRevokeAssignment} onClose={() => setPeopleRole(null)} canEdit={canEdit} isMutating={isMutating} />}
  </section>;
};

const RolePeopleModal: React.FC<{ role: CmsRole; assignments: RoleAssignment[]; users: CmsUserPermissionTarget[]; onAssignRole: (userId: string, roleId: string) => Promise<void>; onRevokeAssignment: (id: string) => Promise<void>; onClose: () => void; canEdit: boolean; isMutating: boolean }> = ({ role, assignments, users, onAssignRole, onRevokeAssignment, onClose, canEdit, isMutating }) => {
  const assignedIds = new Set(assignments.map((assignment) => assignment.userId));
  const availableUsers = users.filter((user) => !assignedIds.has(user.id));
  const [userId, setUserId] = useState(availableUsers[0]?.id ?? '');
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3" role="dialog" aria-modal="true" aria-labelledby="role-people-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !isMutating) onClose(); }}><div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"><header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800"><div className="min-w-0"><h2 id="role-people-title" className="truncate text-sm font-bold text-slate-950 dark:text-white">Nhân sự được gán · {role.name}</h2><p className="mt-0.5 text-[11px] text-slate-500">{assignments.length} nhân sự đang nhận quyền từ vai trò này</p></div><CmsIconButton aria-label="Đóng" icon={<X />} onClick={onClose} disabled={isMutating} /></header>{canEdit && role.status === 'active' && <form className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 p-3 sm:flex-row dark:border-slate-800 dark:bg-slate-800/40" onSubmit={(event) => { event.preventDefault(); if (userId) void onAssignRole(userId, role.id); }}><label className="min-w-0 flex-1"><span className="sr-only">Chọn nhân sự</span><select value={userId} onChange={(event) => setUserId(event.target.value)} disabled={isMutating || availableUsers.length === 0} className="min-h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><option value="">{availableUsers.length ? 'Chọn nhân sự để gán' : 'Tất cả nhân sự đã được gán'}</option>{availableUsers.map((user) => <option key={user.id} value={user.id}>{user.fullName || user.username} · {user.email}</option>)}</select></label><CmsButton type="submit" size="sm" variant="primary" disabled={!userId || isMutating} leadingIcon={<UserPlus />}>{isMutating ? 'Đang gán...' : 'Gán nhân sự'}</CmsButton></form>}<div className="min-h-0 flex-1 overflow-y-auto p-3">{assignments.length ? <ul className="divide-y divide-slate-100 dark:divide-slate-800">{assignments.map((assignment) => <li key={assignment.id} className="flex items-center gap-3 py-2.5"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{(assignment.userFullName || assignment.username).slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-900 dark:text-white">{assignment.userFullName || assignment.username}</p><p className="truncate text-[10px] text-slate-500">{assignment.userEmail}</p></div>{canEdit && <CmsIconButton aria-label={`Thu hồi vai trò của ${assignment.userFullName || assignment.username}`} icon={<UserX />} variant="danger" size="sm" disabled={isMutating} onClick={() => void onRevokeAssignment(assignment.id)} />}</li>)}</ul> : <div className="py-8 text-center text-xs text-slate-500"><Users className="mx-auto mb-2 size-7 text-slate-300" />Chưa có nhân sự nào được gán.</div>}</div><footer className="flex justify-end border-t border-slate-200 px-4 py-3 dark:border-slate-800"><CmsButton size="sm" variant="secondary" onClick={onClose} disabled={isMutating}>Đóng</CmsButton></footer></div></div>;
};

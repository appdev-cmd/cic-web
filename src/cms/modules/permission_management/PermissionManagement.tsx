'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Shield } from 'lucide-react';
import type { PermissionsGovernanceData } from '../../data/GovernanceDataSource';
import type { CmsRole, RoleAssignment } from './types';
import { RolesOverviewTab } from './RolesOverviewTab';
import { RoleEditorModal } from './RoleEditorModal';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { assignCmsRoleAction, createCmsRoleAction, revokeCmsRoleAssignmentAction, updateCmsRoleAction, updateCmsRoleStatusAction } from '@/features/permissions/server/actions';

export const PermissionManagement: React.FC<{ data: PermissionsGovernanceData; capabilities: { create: boolean; edit: boolean } }> = ({ data, capabilities }) => {
  const router = useRouter();
  const [roles, setRoles] = useState(data.roles); const [assignments, setAssignments] = useState(data.assignments);
  const [isEditorOpen, setIsEditorOpen] = useState(false); const [roleToEdit, setRoleToEdit] = useState<CmsRole | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null); const [isMutating, setIsMutating] = useState(false);
  useEffect(() => { setRoles(data.roles); setAssignments(data.assignments); }, [data.roles, data.assignments]);
  const showToast = (message: string) => { setToastMsg(message); window.setTimeout(() => setToastMsg(null), 3500); };
  const openCreate = () => { setRoleToEdit(null); setIsEditorOpen(true); }; const openEdit = (role: CmsRole) => { setRoleToEdit(role); setIsEditorOpen(true); };
  const saveRole = async (candidate: CmsRole) => {
    if (isMutating) return; setIsMutating(true);
    try {
      const permissions = Object.entries(candidate.matrix).flatMap(([module, actions]) => Object.entries(actions).filter(([, state]) => state === 'allowed').map(([action]) => ({ module, action })));
      const exists = roles.some((role) => role.id === candidate.id); let savedRole = candidate;
      if (exists) await updateCmsRoleAction(candidate.id, { name: candidate.name, description: candidate.description, status: candidate.status, permissions });
      else { const created = await createCmsRoleAction({ name: candidate.name, description: candidate.description, status: candidate.status, permissions }); savedRole = { ...candidate, id: created.id }; }
      setRoles((current) => exists ? current.map((role) => role.id === savedRole.id ? savedRole : role) : [savedRole, ...current]);
      setIsEditorOpen(false); showToast(`Đã lưu vai trò "${savedRole.name}".`); router.refresh();
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể lưu vai trò.'); } finally { setIsMutating(false); }
  };
  const cloneRole = async (source: CmsRole) => saveRole({ ...source, id: `new_${Date.now()}`, name: `${source.name} (Bản sao)`, category: 'custom', status: 'inactive', assignedUsersCount: 0, assignedGroupCount: 0, updatedTime: new Date().toISOString() });
  const toggleStatus = async (roleId: string) => { const target = roles.find((role) => role.id === roleId); if (!target || isMutating) return; const status = target.status === 'active' ? 'inactive' : 'active'; setIsMutating(true); try { await updateCmsRoleStatusAction(roleId, status); setRoles((current) => current.map((role) => role.id === roleId ? { ...role, status } : role)); showToast(status === 'active' ? `Đã bật vai trò "${target.name}".` : `Đã tắt vai trò "${target.name}".`); router.refresh(); } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể đổi trạng thái vai trò.'); } finally { setIsMutating(false); } };
  const addAssignment = async (assignment: RoleAssignment) => { if (isMutating) return; setIsMutating(true); try { const created = await assignCmsRoleAction({ userId: assignment.userId, roleId: assignment.roleId }); const saved = { ...assignment, id: created.id }; setAssignments((current) => [saved, ...current.filter((item) => !(item.userId === saved.userId && item.roleId === saved.roleId))]); showToast(`Đã gán vai trò "${saved.roleName}" cho ${saved.userFullName}.`); router.refresh(); } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể gán vai trò.'); } finally { setIsMutating(false); } };
  const revokeAssignment = async (id: string) => { if (isMutating) return; setIsMutating(true); try { await revokeCmsRoleAssignmentAction(id); setAssignments((current) => current.filter((item) => item.id !== id)); showToast('Đã thu hồi vai trò khỏi tài khoản.'); router.refresh(); } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể thu hồi vai trò.'); } finally { setIsMutating(false); } };
  return <div className="space-y-5 animate-in fade-in duration-200" aria-busy={isMutating}>
    {toastMsg && <div role="status" className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl"><CheckCircle2 className="size-4 shrink-0 text-emerald-400" /><span>{toastMsg}</span></div>}
    <CmsPageHeader icon={<Shield />} title="Vai trò và quyền" description="Gán người dùng vào vai trò và xác định các thao tác được phép trong từng phân hệ." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{roles.filter((role) => role.status === 'active').length} vai trò hoạt động</span>} actions={capabilities.create ? <CmsButton onClick={openCreate} variant="primary" size="sm" leadingIcon={<Shield />}>Thêm vai trò</CmsButton> : undefined} />
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"><span><strong className="text-slate-950 dark:text-white">{roles.filter((role) => role.status === 'active').length}</strong> vai trò hoạt động</span><span><strong className="text-slate-950 dark:text-white">{assignments.length}</strong> lượt phân công</span><span className="text-slate-400">Danh mục quyền được định nghĩa bởi hệ thống.</span></div>
    <RolesOverviewTab roles={roles} assignments={assignments} users={data.users} onAddAssignment={addAssignment} onRevokeAssignment={revokeAssignment} onOpenCreate={openCreate} onOpenEdit={openEdit} onCloneRole={cloneRole} onToggleRoleStatus={toggleStatus} canCreate={capabilities.create} canEdit={capabilities.edit} />
    <RoleEditorModal key={roleToEdit?.id ?? 'create'} isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} onSaveRole={saveRole} roleToEdit={roleToEdit} existingRoles={roles} permissionTasks={data.tasks} isSaving={isMutating} />
  </div>;
};

'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Shield } from 'lucide-react';
import type { PermissionsGovernanceData } from '../../data/GovernanceDataSource';
import type { CmsRole } from './types';
import { RolesOverviewTab } from './RolesOverviewTab';
import { RoleEditorModal } from './RoleEditorModal';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { assignCmsRoleAction, createCmsRoleAction, deleteCmsRoleAction, revokeCmsRoleAssignmentAction, updateCmsRoleAction, updateCmsRoleStatusAction } from '@/features/permissions/server/actions';
import { CmsTrashConfirmDialog } from '@/shared/ui/cms/CmsTrashConfirmDialog';

export const PermissionManagement: React.FC<{ data: PermissionsGovernanceData; capabilities: { create: boolean; edit: boolean; delete: boolean } }> = ({ data, capabilities }) => {
  const router = useRouter();
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roles = data.roles;
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<CmsRole | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<CmsRole | null>(null);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  const showToast = (message: string) => { setToastMsg(message); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToastMsg(null), 3500); };
  const openCreate = () => { setRoleToEdit(null); setIsEditorOpen(true); };
  const openEdit = (role: CmsRole) => { setRoleToEdit(role); setIsEditorOpen(true); };
  const saveRole = async (candidate: CmsRole) => {
    if (isMutating) return;
    setIsMutating(true);
    try {
      const permissions = Object.entries(candidate.matrix).flatMap(([taskId, actions]) => Object.entries(actions).filter(([, state]) => state === 'allowed').map(([action]) => ({ taskId: Number(taskId), action })));
      const exists = roles.some((role) => role.id === candidate.id);
      if (exists) await updateCmsRoleAction(candidate.id, { name: candidate.name, description: candidate.description, status: candidate.status, permissions });
      else await createCmsRoleAction({ name: candidate.name, description: candidate.description, status: candidate.status, permissions });
      setIsEditorOpen(false);
      showToast(`Đã lưu vai trò "${candidate.name}".`);
      router.refresh();
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể lưu vai trò.'); }
    finally { setIsMutating(false); }
  };
  const toggleStatus = async (role: CmsRole) => {
    if (isMutating) return;
    setIsMutating(true);
    const status = role.status === 'active' ? 'inactive' : 'active';
    try { await updateCmsRoleStatusAction(role.id, status); showToast(status === 'active' ? `Đã bật vai trò "${role.name}".` : `Đã tắt vai trò "${role.name}".`); router.refresh(); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Không thể đổi trạng thái vai trò.'); }
    finally { setIsMutating(false); }
  };
  const assignRole = async (userId: string, roleId: string) => {
    if (isMutating) return;
    setIsMutating(true);
    try { await assignCmsRoleAction({ userId, roleId }); showToast('Đã gán nhân sự vào vai trò.'); router.refresh(); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Không thể gán nhân sự.'); }
    finally { setIsMutating(false); }
  };
  const revokeAssignment = async (assignmentId: string) => {
    if (isMutating) return;
    setIsMutating(true);
    try { await revokeCmsRoleAssignmentAction(assignmentId); showToast('Đã thu hồi vai trò khỏi nhân sự.'); router.refresh(); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Không thể thu hồi vai trò.'); }
    finally { setIsMutating(false); }
  };
  const deleteRole = async () => {
    if (!roleToDelete || isMutating) return;
    setIsMutating(true);
    try { await deleteCmsRoleAction(roleToDelete.id); showToast(`Đã chuyển vai trò "${roleToDelete.name}" vào Thùng rác.`); setRoleToDelete(null); router.refresh(); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Không thể chuyển vai trò vào Thùng rác.'); }
    finally { setIsMutating(false); }
  };
  const activeCount = roles.filter((role) => role.status === 'active').length;
  return <div className="space-y-5 animate-in fade-in duration-200" aria-busy={isMutating}>
    {toastMsg && <div role="status" aria-live="polite" className="fixed inset-x-3 top-20 z-50 mx-auto flex max-w-md items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl sm:inset-x-auto sm:right-6 sm:mx-0"><CheckCircle2 className="size-4 shrink-0 text-emerald-400" /><span className="min-w-0 break-words">{toastMsg}</span></div>}
    <CmsPageHeader icon={<Shield />} title="Vai trò và quyền" description="Quản lý vai trò và các thao tác được phép trong từng chức năng CMS." meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{activeCount} vai trò hoạt động</span>} actions={capabilities.create ? <CmsButton onClick={openCreate} variant="primary" size="sm" leadingIcon={<Shield />}>Thêm vai trò</CmsButton> : undefined} />
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"><span><strong className="text-slate-950 dark:text-white">{roles.length}</strong> tổng vai trò</span><span><strong className="text-slate-950 dark:text-white">{activeCount}</strong> đang hoạt động</span><span><strong className="text-slate-950 dark:text-white">{data.assignments.length}</strong> lượt gán nhân sự</span></div>
    <RolesOverviewTab roles={roles} assignments={data.assignments} users={data.users} onAssignRole={assignRole} onRevokeAssignment={revokeAssignment} onOpenCreate={openCreate} onOpenEdit={openEdit} onToggleRoleStatus={toggleStatus} onDeleteRole={setRoleToDelete} canCreate={capabilities.create} canEdit={capabilities.edit} canDelete={capabilities.delete} isMutating={isMutating} />
    <RoleEditorModal key={roleToEdit?.id ?? 'create'} isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} onSaveRole={saveRole} roleToEdit={roleToEdit} existingRoles={roles} permissionTasks={data.tasks} isSaving={isMutating} />
    <CmsTrashConfirmDialog open={Boolean(roleToDelete)} title="Xóa vai trò" description="Quyền và các lượt gán sẽ được snapshot; khi phục hồi, vai trò và assignment trở về trạng thái không hoạt động." itemName={roleToDelete?.name ?? ''} busy={isMutating} onClose={() => setRoleToDelete(null)} onConfirm={() => void deleteRole()} />
  </div>;
};

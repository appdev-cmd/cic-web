import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
} from 'lucide-react';
import type { PermissionsGovernanceData } from '../../data/GovernanceDataSource';
import { CmsRole, RoleAssignment } from './types';
import { RolesOverviewTab } from './RolesOverviewTab';
import { RoleEditorModal } from './RoleEditorModal';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';

export const PermissionManagement: React.FC<{ data: PermissionsGovernanceData }> = ({ data }) => {
  // Core Data States
  const [users] = useState(data.users);

  // Roles & Assignments States
  const [roles, setRoles] = useState<CmsRole[]>(data.roles);
  const [assignments, setAssignments] = useState<RoleAssignment[]>(data.assignments);

  // Modal State for Creating/Editing Role
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<CmsRole | null>(null);

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Role Handlers
  const handleOpenCreateRole = () => {
    setRoleToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditRole = (role: CmsRole) => {
    setRoleToEdit(role);
    setIsEditorOpen(true);
  };

  const handleSaveRole = (savedRole: CmsRole, activateImmediately: boolean) => {
    setRoles((prev) => {
      const exists = prev.some((r) => r.id === savedRole.id);
      if (exists) {
        return prev.map((r) => (r.id === savedRole.id ? savedRole : r));
      }
      return [savedRole, ...prev];
    });
    setIsEditorOpen(false);
    showToast(activateImmediately ? `Đã lưu vai trò "${savedRole.name}".` : `Đã lưu vai trò "${savedRole.name}".`);
  };

  const handleCloneRole = (roleToClone: CmsRole) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const cloned: CmsRole = {
      ...roleToClone,
      id: `role_clone_${Date.now()}`,
      name: `${roleToClone.name} (Bản sao)`,
      category: 'custom',
      status: 'inactive',
      activeVersion: 1.0,
      draftVersion: undefined,
      versions: [
        {
          versionNumber: 1.0,
          createdTime: nowStr,
          createdBy: 'admin_cic',
          status: 'draft',
          changeNote: `Nhân bản từ role ${roleToClone.name}`,
          matrix: roleToClone.matrix,
        },
      ],
      assignedUsersCount: 0,
      assignedGroupCount: 0,
      updatedTime: nowStr,
      updatedBy: 'admin_cic',
    };
    setRoles((prev) => [cloned, ...prev]);
    showToast(`Đã nhân bản vai trò "${roleToClone.name}" thành công`);
  };

  const handleToggleRoleStatus = (roleId: string) => {
    const target = roles.find((role) => role.id === roleId);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'inactive' : 'active';
    setRoles((current) => current.map((role) => role.id === roleId ? { ...role, status: nextStatus } : role));
    showToast(nextStatus === 'active' ? `Đã bật vai trò "${target.name}".` : `Đã tắt vai trò "${target.name}". Các lượt gán hiện có được giữ lại.`);
  };

  // Assignment Handlers
  const handleAddAssignment = (newAsg: RoleAssignment) => {
    setAssignments((prev) => [newAsg, ...prev]);
    setRoles((prev) =>
      prev.map((r) => (r.id === newAsg.roleId ? { ...r, assignedUsersCount: r.assignedUsersCount + 1 } : r))
    );
    showToast(`Đã gán thành công vai trò "${newAsg.roleName}" cho ${newAsg.userFullName}`);
  };

  const handleRevokeAssignment = (asgId: string) => {
    const target = assignments.find((a) => a.id === asgId);
    setAssignments((prev) => prev.filter((a) => a.id !== asgId));
    if (target) {
      setRoles((prev) =>
        prev.map((r) => (r.id === target.roleId ? { ...r, assignedUsersCount: Math.max(0, r.assignedUsersCount - 1) } : r))
      );
    }
    showToast('Đã thu hồi gán quyền tài khoản!');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <CmsPageHeader
        icon={<Shield />}
        title="Vai trò và quyền"
        description="Gán người dùng vào vai trò và xác định các thao tác được phép trong từng phân hệ."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{roles.filter((role) => role.status === 'active').length} vai trò hoạt động</span>}
        actions={(
          <CmsButton onClick={handleOpenCreateRole} variant="primary" size="sm" leadingIcon={<Shield />}>
            Thêm vai trò
          </CmsButton>
        )}
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span><strong className="text-slate-950 dark:text-white">{roles.filter((role) => role.status === 'active').length}</strong> vai trò hoạt động</span>
        <span><strong className="text-slate-950 dark:text-white">{assignments.length}</strong> lượt phân công</span>
        <span className="text-slate-400">Danh mục quyền được định nghĩa bởi hệ thống và không chỉnh sửa tại màn hình này.</span>
      </div>

      <RolesOverviewTab
        roles={roles}
        assignments={assignments}
        users={users}
        onAddAssignment={handleAddAssignment}
        onRevokeAssignment={handleRevokeAssignment}
        onOpenCreate={handleOpenCreateRole}
        onOpenEdit={handleOpenEditRole}
        onCloneRole={handleCloneRole}
        onToggleRoleStatus={handleToggleRoleStatus}
      />

      {/* ROLE EDITOR MODAL */}
      <RoleEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveRole={handleSaveRole}
        roleToEdit={roleToEdit}
        existingRoles={roles}
      />
    </div>
  );
};

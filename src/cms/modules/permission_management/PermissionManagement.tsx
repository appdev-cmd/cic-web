import React, { useState } from 'react';
import {
  Shield,
  Sliders,
  CheckCircle2,
  Users,
  AlertTriangle,
  Clock,
  Layers,
} from 'lucide-react';
import type { PermissionsGovernanceData } from '../../data/GovernanceDataSource';
import {
  PermissionTask,
  UserPermissionState,
  CmsRole,
  RoleAssignment,
  PolicyIssue,
  AccessReview,
} from './types';
import { PermissionMatrixTab } from './PermissionMatrixTab';
import { TaskDefinitionTab } from './TaskDefinitionTab';
import { RolesOverviewTab } from './RolesOverviewTab';
import { RoleEditorModal } from './RoleEditorModal';
import { AssignmentsTab } from './AssignmentsTab';
import { PolicyIssuesTab } from './PolicyIssuesTab';
import { AccessReviewsTab } from './AccessReviewsTab';
import { CmsButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsTabs } from '../../components/ui/CmsTabs';

export const PermissionManagement: React.FC<{ data: PermissionsGovernanceData }> = ({ data }) => {
  // Tabs State: 'roles' (Module 15 Main) | 'assignments' | 'issues' | 'reviews' | 'matrix' | 'tasks'
  const [activeTab, setActiveTab] = useState<'roles' | 'assignments' | 'issues' | 'reviews' | 'matrix' | 'tasks'>('roles');

  // Core Data States
  const [users] = useState(data.users);
  const [tasks, setTasks] = useState<PermissionTask[]>(data.tasks);
  const [functions] = useState(data.functions);
  const [fields] = useState(data.fields);

  // Module 15 States
  const [roles, setRoles] = useState<CmsRole[]>(data.roles);
  const [assignments, setAssignments] = useState<RoleAssignment[]>(data.assignments);
  const [issues, setIssues] = useState<PolicyIssue[]>(data.issues);
  const [reviews, setReviews] = useState<AccessReview[]>(data.reviews);

  // Modal State for Creating/Editing Role
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<CmsRole | null>(null);

  // Legacy Matrix User Permissions Map State
  const [userPermissionsMap, setUserPermissionsMap] = useState<
    Record<string, UserPermissionState>
  >(data.userPermissions);

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
    showToast(
      activateImmediately
        ? `Đã kích hoạt chính thức Vai trò "${savedRole.name}" (Version v${savedRole.activeVersion})`
        : `Đã lưu Bản nháp Draft v${savedRole.draftVersion} cho Vai trò "${savedRole.name}"`
    );
  };

  const handleCloneRole = (roleToClone: CmsRole) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const cloned: CmsRole = {
      ...roleToClone,
      id: `role_clone_${Date.now()}`,
      name: `${roleToClone.name} (Bản sao)`,
      category: 'custom',
      status: 'draft',
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
          scopes: roleToClone.scopes,
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

  const handleArchiveRole = (roleId: string, replacementRoleId?: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === roleId) {
          return { ...r, status: 'archived', assignedUsersCount: 0 };
        }
        if (replacementRoleId && r.id === replacementRoleId) {
          const targetArchivedRole = prev.find((x) => x.id === roleId);
          return {
            ...r,
            assignedUsersCount: r.assignedUsersCount + (targetArchivedRole?.assignedUsersCount || 0),
          };
        }
        return r;
      })
    );

    if (replacementRoleId) {
      const replRole = roles.find((r) => r.id === replacementRoleId);
      setAssignments((prev) =>
        prev.map((a) => (a.roleId === roleId ? { ...a, roleId: replRole!.id, roleName: replRole!.name } : a))
      );
    }

    showToast('Đã chuyển vai trò vào lưu trữ (Archived) thành công!');
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

  // Policy Issue Handlers
  const handleResolveIssue = (issueId: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
    showToast('Đã ghi nhận xử lý xong cảnh báo Security/SoD!');
  };

  // Access Review Handlers
  const handleConfirmReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'confirmed', notes: 'Đã hoàn tất rà soát trực tiếp' } : r))
    );
    showToast('Đã phê duyệt xác nhận quyền hạn cho nhân sự!');
  };

  const handleRevokeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'revoked', notes: 'Thu hồi do thay đổi vị trí công tác' } : r))
    );
    showToast('Đã ghi nhận thu hồi quyền hạn nhân sự!');
  };

  // Legacy Task/User Handlers
  const handleSaveTask = (savedTask: PermissionTask) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
    showToast(`Đã lưu Task Definition "${savedTask.task}"`);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (confirm(`Bạn có chắc muốn xóa Task "${taskToDelete?.task || taskId}"?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast('Đã xóa Task Definition thành công');
    }
  };

  const handleSaveUserPermissions = (userId: string, newPerms: UserPermissionState) => {
    setUserPermissionsMap((prev) => ({
      ...prev,
      [userId]: newPerms,
    }));
    const userObj = users.find((u) => u.id === userId);
    showToast(`Đã lưu cấu hình phân quyền cho tài khoản "${userObj?.fullName || userId}"!`);
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
        description="Quản lý vai trò, phạm vi truy cập, cảnh báo xung đột quyền và các đợt rà soát."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{roles.filter((role) => role.status !== 'archived').length} vai trò</span>}
        actions={(
          <CmsButton onClick={handleOpenCreateRole} variant="primary" size="sm" leadingIcon={<Shield />}>
            Thêm vai trò
          </CmsButton>
        )}
      />

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">

        {/* STAT KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tổng vai trò</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {roles.filter((r) => r.status !== 'archived').length}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({roles.filter((r) => r.category === 'system').length} hệ thống / {roles.filter((r) => r.category === 'custom' && r.status !== 'archived').length} tùy chỉnh)
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tài khoản được gán</div>
            <div className="text-xl font-extrabold text-orange-600 dark:text-orange-400 font-mono">
              {assignments.length}
              <span className="text-xs text-slate-400 font-normal ml-1">tài khoản</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Xung đột quyền</div>
            <div className="text-xl font-extrabold text-red-600 dark:text-red-400 font-mono flex items-center gap-1">
              <span>{issues.length}</span>
              {issues.length > 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chờ rà soát</div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {reviews.filter((r) => r.status === 'pending').length}
              <span className="text-xs text-slate-400 font-normal ml-1">lượt</span>
            </div>
          </div>
        </div>

        {/* PRIMARY TAB NAVIGATION BAR */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <CmsTabs
            ariaLabel="Phân loại vai trò và quản trị quyền"
            value={activeTab}
            onChange={(tab) => setActiveTab(tab as any)}
            items={[
              { id: 'roles', label: 'Danh sách vai trò', icon: Shield },
              { id: 'assignments', label: 'Gán vai trò', count: assignments.length, icon: Users },
              { id: 'issues', label: 'Xung đột quyền', count: issues.length, icon: AlertTriangle },
              { id: 'reviews', label: 'Đợt rà soát', count: reviews.filter((r) => r.status === 'pending').length, icon: Clock },
              { id: 'matrix', label: 'Ma trận quyền', icon: Sliders },
              { id: 'tasks', label: 'Danh mục chức năng', icon: Layers },
            ]}
          />
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'roles' && (
        <RolesOverviewTab
          roles={roles}
          onOpenCreate={handleOpenCreateRole}
          onOpenEdit={handleOpenEditRole}
          onCloneRole={handleCloneRole}
          onArchiveRole={handleArchiveRole}
          onSelectRoleForReview={(r) => {
            setActiveTab('reviews');
            showToast(`Vui lòng thực hiện rà soát cho vai trò "${r.name}"`);
          }}
        />
      )}

      {activeTab === 'assignments' && (
        <AssignmentsTab
          users={users}
          assignments={assignments}
          roles={roles}
          onAddAssignment={handleAddAssignment}
          onRevokeAssignment={handleRevokeAssignment}
        />
      )}

      {activeTab === 'issues' && (
        <PolicyIssuesTab
          issues={issues}
          roles={roles}
          onOpenEditRole={(r) => {
            setRoleToEdit(r);
            setIsEditorOpen(true);
          }}
          onResolveIssue={handleResolveIssue}
        />
      )}

      {activeTab === 'reviews' && (
        <AccessReviewsTab
          reviews={reviews}
          onConfirmReview={handleConfirmReview}
          onRevokeReview={handleRevokeReview}
        />
      )}

      {activeTab === 'matrix' && (
        <PermissionMatrixTab
          users={users}
          tasks={tasks}
          functions={functions}
          fields={fields}
          userPermissionsMap={userPermissionsMap}
          onSaveUserPermissions={handleSaveUserPermissions}
        />
      )}

      {activeTab === 'tasks' && (
        <TaskDefinitionTab
          tasks={tasks}
          onSaveTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* ROLE EDITOR MODAL */}
      <RoleEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaveRole={handleSaveRole}
        roleToEdit={roleToEdit}
        existingRoles={roles}
        agencies={data.agencies}
      />
    </div>
  );
};

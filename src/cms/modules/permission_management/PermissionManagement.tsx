import React, { useState } from 'react';
import {
  Shield,
  Sliders,
  CheckCircle2,
  Users,
  AlertTriangle,
  Clock,
  Layers,
  Plus,
} from 'lucide-react';
import {
  permissionUsersMock,
  initialPermissionTasksMock,
  permissionFunctionsMock,
  permissionFieldsMock,
  initialUserPermissionsMock,
  cmsRolesMock,
  roleAssignmentsMock,
  policyIssuesMock,
  accessReviewsMock,
} from './mockData';
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

export const PermissionManagement: React.FC = () => {
  // Tabs State: 'roles' (Module 15 Main) | 'assignments' | 'issues' | 'reviews' | 'matrix' | 'tasks'
  const [activeTab, setActiveTab] = useState<'roles' | 'assignments' | 'issues' | 'reviews' | 'matrix' | 'tasks'>('roles');

  // Core Data States
  const [users] = useState(permissionUsersMock);
  const [tasks, setTasks] = useState<PermissionTask[]>(initialPermissionTasksMock);
  const [functions] = useState(permissionFunctionsMock);
  const [fields] = useState(permissionFieldsMock);

  // Module 15 States
  const [roles, setRoles] = useState<CmsRole[]>(cmsRolesMock);
  const [assignments, setAssignments] = useState<RoleAssignment[]>(roleAssignmentsMock);
  const [issues, setIssues] = useState<PolicyIssue[]>(policyIssuesMock);
  const [reviews, setReviews] = useState<AccessReview[]>(accessReviewsMock);

  // Modal State for Creating/Editing Role
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<CmsRole | null>(null);

  // Legacy Matrix User Permissions Map State
  const [userPermissionsMap, setUserPermissionsMap] = useState<
    Record<string, UserPermissionState>
  >(initialUserPermissionsMock);

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

      {/* TOP HEADER & MODULE 15 SUMMARY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                <Shield className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Vai trò & quyền</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Quản lý vòng đời Vai trò (RBAC), Ma trận Quyền (Permission Matrix), Phạm vi Scope, Tách biệt Trách nhiệm (SoD) & Audit Review.
                </p>
              </div>
            </div>
          </div>

          {/* QUICK CREATE ROLE BUTTON */}
          <button
            onClick={handleOpenCreateRole}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Vai trò & Policy mới</span>
          </button>
        </div>

        {/* STAT KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tổng Vai trò (Roles)</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {roles.filter((r) => r.status !== 'archived').length}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({roles.filter((r) => r.category === 'system').length} System / {roles.filter((r) => r.category === 'custom' && r.status !== 'archived').length} Custom)
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
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cảnh báo SoD / Issue</div>
            <div className="text-xl font-extrabold text-red-600 dark:text-red-400 font-mono flex items-center gap-1">
              <span>{issues.length}</span>
              {issues.length > 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Access Review Chờ</div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {reviews.filter((r) => r.status === 'pending').length}
              <span className="text-xs text-slate-400 font-normal ml-1">lượt</span>
            </div>
          </div>
        </div>

        {/* PRIMARY TAB NAVIGATION BAR */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'roles'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Danh sách Vai trò & Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Phân gán Role & Simulator ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'issues'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Cảnh báo SoD & Risk ({issues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Rà soát Access Review ({reviews.filter((r) => r.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Ma trận Quyền theo User (Chi tiết)</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Task Definition Catalogue</span>
          </button>
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
      />
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  Layers,
  Copy,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Archive,
  RefreshCw,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Globe,
  Sliders,
  Sparkles,
  ChevronRight,
  FileText,
  X,
  Building,
} from 'lucide-react';
import { CmsRole, RoleRiskLevel, RoleStatus, RoleCategory, RoleAssignment, CmsUserPermissionTarget } from './types';
import { CmsIconButton, CmsButton } from '../../components/ui/CmsButton';

interface RolesOverviewTabProps {
  roles: CmsRole[];
  assignments?: RoleAssignment[];
  users?: CmsUserPermissionTarget[];
  onAddAssignment?: (assignment: RoleAssignment) => void;
  onRevokeAssignment?: (id: string) => void;
  onOpenCreate: () => void;
  onOpenEdit: (role: CmsRole) => void;
  onCloneRole: (role: CmsRole) => void;
  onArchiveRole: (roleId: string, replacementRoleId?: string) => void;
}

export const RolesOverviewTab: React.FC<RolesOverviewTabProps> = ({
  roles,
  assignments = [],
  users = [],
  onAddAssignment,
  onRevokeAssignment,
  onOpenCreate,
  onOpenEdit,
  onCloneRole,
  onArchiveRole,
}) => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | RoleCategory | 'archived'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | RoleRiskLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RoleStatus>('all');

  // Archive Replacement Modal State
  const [archiveTargetRole, setArchiveTargetRole] = useState<CmsRole | null>(null);
  const [replacementRoleId, setReplacementRoleId] = useState<string>('');

  // Direct Assign Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssignRoleId, setSelectedAssignRoleId] = useState<string>(roles[0]?.id || '');
  const [selectedAssignUserId, setSelectedAssignUserId] = useState<string>(users[0]?.id || '');
  const [assignScopeNote, setAssignScopeNote] = useState<string>('Chi nhánh Hà Nội & TP.HCM');

  // Role Members Inspection Modal State
  const [inspectingRole, setInspectingRole] = useState<CmsRole | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      // Search by name / purpose / description
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.purpose.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query);

      // Category filter
      let matchCat = true;
      if (categoryFilter === 'system') matchCat = r.category === 'system' && r.status !== 'archived';
      else if (categoryFilter === 'custom') matchCat = r.category === 'custom' && r.status !== 'archived';
      else if (categoryFilter === 'archived') matchCat = r.status === 'archived';

      // Risk Filter
      const matchRisk = riskFilter === 'all' || r.riskLevel === riskFilter;

      // Status Filter
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchQuery && matchCat && matchRisk && matchStatus;
    });
  }, [roles, searchQuery, categoryFilter, riskFilter, statusFilter]);

  // Execute Archive Handler
  const handleConfirmArchive = () => {
    if (!archiveTargetRole) return;
    onArchiveRole(archiveTargetRole.id, replacementRoleId || undefined);
    setArchiveTargetRole(null);
    setReplacementRoleId('');
  };

  // Open Direct Assign Modal for a specific role
  const handleOpenAssignForRole = (role: CmsRole) => {
    setSelectedAssignRoleId(role.id);
    if (users.length > 0 && !selectedAssignUserId) {
      setSelectedAssignUserId(users[0].id);
    }
    const defaultScope = role.scopes[0]?.description || 'Toàn quyền chi nhánh';
    setAssignScopeNote(defaultScope);
    setIsAssignModalOpen(true);
  };

  // Submit Direct Assignment
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddAssignment) return;

    const targetUser = users.find((u) => u.id === selectedAssignUserId);
    const targetRole = roles.find((r) => r.id === selectedAssignRoleId);

    if (!targetUser || !targetRole) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newAsg: RoleAssignment = {
      id: `asg_${Date.now()}`,
      userId: targetUser.id,
      username: targetUser.username,
      userFullName: targetUser.fullName,
      userEmail: targetUser.email,
      avatar: targetUser.avatar,
      roleId: targetRole.id,
      roleName: targetRole.name,
      scopeSummary: assignScopeNote || targetRole.scopes[0]?.description || 'Global Scope',
      assignedAt: nowStr,
      assignedBy: 'admin_cic',
    };

    onAddAssignment(newAsg);
    setIsAssignModalOpen(false);
  };

  // Badge Helper
  const renderRiskBadge = (risk: RoleRiskLevel) => {
    switch (risk) {
      case 'privileged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span>Privileged Access</span>
          </span>
        );
      case 'elevated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Elevated Risk</span>
          </span>
        );
      case 'standard':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Standard</span>
          </span>
        );
    }
  };

  const renderStatusBadge = (r: CmsRole) => {
    if (r.status === 'archived') {
      return (
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[10px] font-bold border border-slate-300 dark:border-slate-700">
          Archived
        </span>
      );
    }
    if (r.draftVersion) {
      return (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 rounded text-[10px] font-bold border border-blue-300 dark:border-blue-800">
          Draft v{r.draftVersion}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 rounded text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
        Active v{r.activeVersion}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR & SEARCH */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo Tên vai trò, Mục đích nghiệp vụ, Mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="lg:col-span-4 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                categoryFilter === 'all' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tất cả ({roles.filter((r) => r.status !== 'archived').length})
            </button>
            <button
              onClick={() => setCategoryFilter('system')}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                categoryFilter === 'system' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Hệ thống ({roles.filter((r) => r.category === 'system' && r.status !== 'archived').length})
            </button>
            <button
              onClick={() => setCategoryFilter('custom')}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                categoryFilter === 'custom' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Tùy chỉnh ({roles.filter((r) => r.category === 'custom' && r.status !== 'archived').length})
            </button>
            <button
              onClick={() => setCategoryFilter('archived')}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                categoryFilter === 'archived' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Lưu trữ ({roles.filter((r) => r.status === 'archived').length})
            </button>
          </div>

          {/* Risk Level Filter */}
          <div className="lg:col-span-3">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <option value="all">Tất cả mức độ rủi ro</option>
              <option value="standard">Standard Risk (Tiêu chuẩn)</option>
              <option value="elevated">Elevated Risk (Nâng cao)</option>
              <option value="privileged">Privileged Risk (Đặc quyền cao)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ROLES TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                {/* Role Name & Type (Sticky Left) */}
                <th className="py-3 px-4 min-w-[240px] sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                  Tên Vai trò & Loại
                </th>
                <th className="py-3 px-4 min-w-[200px]">Mục đích Nghiệp vụ</th>
                <th className="py-3 px-4 min-w-[130px] text-center">Mức Rủi ro</th>
                <th className="py-3 px-4 min-w-[140px] text-center">Trạng thái Phiên bản</th>
                <th className="py-3 px-4 min-w-[140px]">Phạm vi Scope</th>
                <th className="py-3 px-4 min-w-[150px] text-center">Nhân sự Được Gán</th>
                <th className="py-3 px-4 min-w-[140px]">Cập nhật cuối</th>
                {/* Actions (Sticky Right) */}
                <th className="py-3 px-4 w-40 text-center sticky right-0 z-20 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-800">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không tìm thấy vai trò nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => {
                  const roleAssignments = assignments.filter((a) => a.roleId === role.id);
                  const assignedCount = roleAssignments.length > 0 ? roleAssignments.length : role.assignedUsersCount;

                  return (
                    <tr
                      key={role.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Name & Category (Sticky Left) */}
                      <td className="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-r border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{role.name}</span>
                          {role.category === 'system' ? (
                            <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[9px] font-mono font-bold rounded">
                              SYSTEM
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-mono font-bold rounded">
                              CUSTOM
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                          {role.description}
                        </div>
                      </td>

                      {/* Purpose */}
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs">
                        <div className="line-clamp-2 text-[11px]">{role.purpose}</div>
                      </td>

                      {/* Risk Badge */}
                      <td className="py-3 px-4 text-center">{renderRiskBadge(role.riskLevel)}</td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">{renderStatusBadge(role)}</td>

                      {/* Scope Summary */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                          <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span>{role.scopes[0]?.description || 'Global'}</span>
                        </div>
                      </td>

                      {/* Assigned Counts & Inline Avatars & Quick Assign */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => setInspectingRole(role)}
                            className="group/assign inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer"
                            title="Bấm để xem danh sách nhân sự giữ vai trò này"
                          >
                            <Users className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span className="font-mono">{assignedCount}</span>
                            <span className="text-[11px] font-normal text-slate-500 group-hover/assign:text-orange-600">tài khoản</span>
                          </button>

                          {/* Avatars preview and direct + Gán button */}
                          <div className="flex items-center justify-center -space-x-1.5">
                            {roleAssignments.slice(0, 3).map((asg) => (
                              <img
                                key={asg.id}
                                src={asg.avatar}
                                alt={asg.userFullName}
                                title={`${asg.userFullName} (${asg.username})`}
                                className="w-5 h-5 rounded-full border border-white dark:border-slate-800 object-cover"
                              />
                            ))}
                            {role.status !== 'archived' && (
                              <button
                                onClick={() => handleOpenAssignForRole(role)}
                                className="w-5 h-5 rounded-full bg-orange-100 hover:bg-orange-200 dark:bg-orange-950 dark:hover:bg-orange-900 text-orange-700 dark:text-orange-300 font-bold text-[10px] flex items-center justify-center border border-white dark:border-slate-800 transition-colors cursor-pointer"
                                title="Gán thêm người dùng vào vai trò này"
                              >
                                +
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Updated */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-mono whitespace-nowrap">
                        <div>{role.updatedTime}</div>
                        <div className="text-[10px] text-slate-400">bởi {role.updatedBy}</div>
                      </td>

                      {/* Actions (Sticky Right) */}
                      <td className="py-3 px-4 sticky right-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-l border-slate-100 dark:border-slate-800 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View assigned users & Revoke / Delete */}
                          <CmsIconButton
                            onClick={() => {
                              setMemberSearchQuery('');
                              setInspectingRole(role);
                            }}
                            icon={<Users />}
                            size="sm"
                            aria-label="Xem danh sách nhân sự đang dùng & Thu hồi/Xóa"
                            title="Xem danh sách nhân sự đang dùng & Thu hồi/Xóa quyền"
                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          />

                          {/* Direct Assign Role to User */}
                          {role.status !== 'archived' && (
                            <CmsIconButton
                              onClick={() => handleOpenAssignForRole(role)}
                              icon={<UserPlus />}
                              size="sm"
                              aria-label="Gán vai trò cho người dùng"
                              title="Gán vai trò cho người dùng"
                              className="text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40"
                            />
                          )}

                          {/* Edit Draft */}
                          <CmsIconButton
                            onClick={() => onOpenEdit(role)}
                            icon={<Edit />}
                            size="sm"
                            aria-label="Sửa vai trò"
                            title="Sửa bản nháp & Ma trận quyền"
                          />

                          {/* Clone Role */}
                          <CmsIconButton
                            onClick={() => onCloneRole(role)}
                            icon={<Copy />}
                            size="sm"
                            aria-label="Nhân bản vai trò"
                            title="Nhân bản vai trò"
                          />

                          {/* Archive Role */}
                          {role.status !== 'archived' && (
                            <CmsIconButton
                              onClick={() => setArchiveTargetRole(role)}
                              icon={<Archive />}
                              size="sm"
                              variant="danger"
                              aria-label="Lưu trữ vai trò"
                              title="Lưu trữ vai trò"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIRECT ROLE ASSIGNMENT MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Gán vai trò cho người dùng
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chọn nhân sự và chỉ định vai trò cùng phạm vi áp dụng (Scope).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {/* Select Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Vai trò cần gán (Role):
                </label>
                <select
                  value={selectedAssignRoleId}
                  onChange={(e) => setSelectedAssignRoleId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:border-orange-500"
                >
                  {roles
                    .filter((r) => r.status !== 'archived')
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.category.toUpperCase()} - {r.riskLevel.toUpperCase()})
                      </option>
                    ))}
                </select>
              </div>

              {/* Select User Target */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nhân sự / Tài khoản đích:
                </label>
                <select
                  value={selectedAssignUserId}
                  onChange={(e) => setSelectedAssignUserId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:border-orange-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.username}) - {u.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected User Preview Card */}
              {(() => {
                const u = users.find((x) => x.id === selectedAssignUserId);
                if (!u) return null;
                return (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{u.email}</div>
                      <div className="text-slate-400 text-[10px]">{u.department || 'Phòng ban công nghệ'}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Scope Constraint */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phạm vi hiệu lực (Scope):
                </label>
                <input
                  type="text"
                  value={assignScopeNote}
                  onChange={(e) => setAssignScopeNote(e.target.value)}
                  placeholder="Ví dụ: Chi nhánh Hà Nội, Toàn hệ thống, v.v."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Toàn hệ thống (Global)', 'Chi nhánh Hà Nội & TP.HCM', 'Chỉ dữ liệu do mình tạo (Ownership)'].map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setAssignScopeNote(sc)}
                      className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-600 dark:text-slate-300 hover:text-orange-600 rounded-md border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận gán quyền</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ROLE MEMBERS INSPECTION MODAL */}
      {inspectingRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-2xl w-full space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Nhân sự đang giữ vai trò: {inspectingRole.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                      {assignments.filter((a) => a.roleId === inspectingRole.id).length} người dùng
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {inspectingRole.purpose}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingRole(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Member Search & Info */}
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm nhân sự theo họ tên, email, tài khoản..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* List of members */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {(() => {
                const roleAsgs = assignments.filter((a) => a.roleId === inspectingRole.id);
                const q = memberSearchQuery.toLowerCase().trim();
                const matchedAsgs = !q
                  ? roleAsgs
                  : roleAsgs.filter(
                      (a) =>
                        a.userFullName.toLowerCase().includes(q) ||
                        a.username.toLowerCase().includes(q) ||
                        a.userEmail.toLowerCase().includes(q) ||
                        a.scopeSummary.toLowerCase().includes(q)
                    );

                if (roleAsgs.length === 0) {
                  return (
                    <div className="py-8 text-center space-y-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Chưa có nhân sự nào được gán vào vai trò này.
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Bạn có thể gán nhanh người dùng vào vai trò này bằng nút bên dưới.
                      </p>
                    </div>
                  );
                }

                if (matchedAsgs.length === 0) {
                  return (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      Không tìm thấy nhân sự phù hợp với từ khóa "{memberSearchQuery}".
                    </div>
                  );
                }

                return matchedAsgs.map((asg) => {
                  const targetUser = users.find((u) => u.id === asg.userId);

                  return (
                    <div
                      key={asg.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={asg.avatar}
                          alt={asg.userFullName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {asg.userFullName}
                            </span>
                            <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded">
                              @{asg.username}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {asg.userEmail} {targetUser?.department ? `• ${targetUser.department}` : ''}
                          </div>
                          <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                              <Globe className="w-3 h-3 text-orange-600" />
                              <span>{asg.scopeSummary}</span>
                            </span>
                            <span>•</span>
                            <span>Gán lúc: {asg.assignedAt}</span>
                            <span>•</span>
                            <span>Bởi: {asg.assignedBy}</span>
                          </div>
                        </div>
                      </div>

                      {/* Revoke / Delete Action */}
                      {onRevokeAssignment && (
                        <button
                          onClick={() => onRevokeAssignment(asg.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 text-xs font-bold rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs shrink-0"
                          title="Xóa/Thu hồi vai trò của nhân sự này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa khỏi vai trò</span>
                        </button>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              {inspectingRole.status !== 'archived' && (
                <button
                  onClick={() => {
                    const r = inspectingRole;
                    setInspectingRole(null);
                    handleOpenAssignForRole(r);
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Gán thêm nhân sự vào vai trò này</span>
                </button>
              )}

              <button
                onClick={() => setInspectingRole(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ml-auto"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARCHIVE CONFIRMATION MODAL WITH REPLACEMENT PLAN */}
      {archiveTargetRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lưu trữ Role: {archiveTargetRole.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Vai trò đang được gán cho <strong>{archiveTargetRole.assignedUsersCount} tài khoản</strong>.
                </p>
              </div>
            </div>

            {archiveTargetRole.assignedUsersCount > 0 && (
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Chọn Vai trò thay thế (Replacement Plan):
                </label>
                <select
                  value={replacementRoleId}
                  onChange={(e) => setReplacementRoleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  <option value="">-- Không chuyển đổi (Gỡ gán quyền) --</option>
                  {roles
                    .filter((r) => r.id !== archiveTargetRole.id && r.status === 'active')
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.category})
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Mọi tài khoản đang giữ vai trò cũ sẽ được chuyển tự động sang vai trò thay thế này.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setArchiveTargetRole(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Xác nhận Lưu trữ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


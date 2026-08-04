import React, { useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Eye,
  Globe,
  Calendar,
  UserCheck,
  Building,
  Sparkles,
  Sliders,
  X,
} from 'lucide-react';
import { RoleAssignment, CmsRole, CmsUserPermissionTarget, ModulePermissionMatrix } from './types';
import { permissionUsersMock } from './mockData';

interface AssignmentsTabProps {
  assignments: RoleAssignment[];
  roles: CmsRole[];
  onAddAssignment: (assignment: RoleAssignment) => void;
  onRevokeAssignment: (id: string) => void;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  roles,
  onAddAssignment,
  onRevokeAssignment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Assign Role Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string>(permissionUsersMock[0]?.id || '');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || '');
  const [scopeCustomNote, setScopeCustomNote] = useState('Chi nhánh Hà Nội & TP.HCM');

  // Effective Access Simulator Drawer State
  const [simulatorUser, setSimulatorUser] = useState<RoleAssignment | null>(null);

  // Filtered Assignments
  const filteredAssignments = assignments.filter((asg) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      asg.userFullName.toLowerCase().includes(query) ||
      asg.username.toLowerCase().includes(query) ||
      asg.roleName.toLowerCase().includes(query);

    const matchRole = roleFilter === 'all' || asg.roleId === roleFilter;

    return matchSearch && matchRole;
  });

  // Submit New Assignment
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = permissionUsersMock.find((u) => u.id === targetUserId);
    const targetRole = roles.find((r) => r.id === selectedRoleId);

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
      scopeSummary: scopeCustomNote || targetRole.scopes[0]?.description || 'Global Scope',
      assignedAt: nowStr,
      assignedBy: 'admin_cic',
    };

    onAddAssignment(newAsg);
    setIsModalOpen(false);
  };

  // Helper to retrieve role matrix for effective access simulator
  const activeRoleObj = roles.find((r) => r.id === simulatorUser?.roleId);

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Keyword Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo Tên người dùng, Email, Role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <option value="all">Tất cả Vai trò (Roles)</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Gán Role cho Người dùng</span>
        </button>
      </div>

      {/* ASSIGNMENTS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-3 w-12 text-center">Avatar</th>
                <th className="p-3">Họ tên & Tài khoản</th>
                <th className="p-3">Vai trò (Role Được Gán)</th>
                <th className="p-3">Phạm vi Scope Áp dụng</th>
                <th className="p-3">Thời gian Gán</th>
                <th className="p-3">Người Gán</th>
                <th className="p-3 text-right pr-5">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Chưa có tài khoản nào được gán vai trò theo tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((asg) => (
                  <tr key={asg.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Avatar */}
                    <td className="p-3 text-center">
                      <img
                        src={asg.avatar}
                        alt={asg.username}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 mx-auto"
                      />
                    </td>

                    {/* User Full Name & Email */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{asg.userFullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{asg.userEmail}</div>
                    </td>

                    {/* Role Name */}
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-lg border border-orange-500/20">
                        {asg.roleName}
                      </span>
                    </td>

                    {/* Scope */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>{asg.scopeSummary}</span>
                      </div>
                    </td>

                    {/* Assigned At */}
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{asg.assignedAt}</td>

                    {/* Assigned By */}
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{asg.assignedBy}</td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* Effective Access Simulator */}
                        <button
                          onClick={() => setSimulatorUser(asg)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Xem Effective Access Simulator"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Revoke */}
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn thu hồi gán quyền "${asg.roleName}" của tài khoản ${asg.userFullName}?`)) {
                              onRevokeAssignment(asg.id);
                            }
                          }}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Thu hồi Gán quyền"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={handleAssignSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <span>Gán Vai trò (Role Assignment)</span>
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn Tài khoản Người dùng *
                </label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  {permissionUsersMock.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.username}) — {u.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn Vai trò Phân gán (Role) *
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ghi chú Phạm vi Scope (Scope Customization)
                </label>
                <input
                  type="text"
                  value={scopeCustomNote}
                  onChange={(e) => setScopeCustomNote(e.target.value)}
                  placeholder="Ví dụ: Chi nhánh Hà Nội & TP.HCM"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Xác nhận Gán Role
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EFFECTIVE ACCESS SIMULATOR DRAWER */}
      {simulatorUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <img src={simulatorUser.avatar} alt={simulatorUser.username} className="w-10 h-10 rounded-full border border-slate-200" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Effective Access Preview: {simulatorUser.userFullName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Role: {simulatorUser.roleName}</p>
                </div>
              </div>
              <button onClick={() => setSimulatorUser(null)} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Giải trình Quyền thực tế (Resolved Effective Access)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Đây là ma trận quyền tổng hợp sau khi giải phóng Scope Policy và phân quyền theo vai trò chính thức.
                </p>
              </div>

              {activeRoleObj ? (
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Ma trận Quyền khả thi (Resolved Matrix):
                  </div>
                  <div className="space-y-2">
                    {Object.entries(activeRoleObj.matrix).map(([modCode, actMap]) => (
                      <div key={modCode} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{modCode}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(actMap).map(([actCode, state]) => (
                            <span
                              key={actCode}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                state === 'allowed'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                                  : state === 'conditional'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                                  : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                              }`}
                            >
                              {actCode}: {state}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">Chưa tìm thấy ma trận vai trò.</div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setSimulatorUser(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
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
  Globe,
  Sliders,
  Sparkles,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { CmsRole, RoleRiskLevel, RoleStatus, RoleCategory } from './types';
import { CmsIconButton } from '../../components/ui/CmsButton';

interface RolesOverviewTabProps {
  roles: CmsRole[];
  onOpenCreate: () => void;
  onOpenEdit: (role: CmsRole) => void;
  onCloneRole: (role: CmsRole) => void;
  onArchiveRole: (roleId: string, replacementRoleId?: string) => void;
  onSelectRoleForReview: (role: CmsRole) => void;
}

export const RolesOverviewTab: React.FC<RolesOverviewTabProps> = ({
  roles,
  onOpenCreate,
  onOpenEdit,
  onCloneRole,
  onArchiveRole,
  onSelectRoleForReview,
}) => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | RoleCategory | 'archived'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | RoleRiskLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RoleStatus>('all');

  // Archive Replacement Modal State
  const [archiveTargetRole, setArchiveTargetRole] = useState<CmsRole | null>(null);
  const [replacementRoleId, setReplacementRoleId] = useState<string>('');

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative flex items-center">
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
          <div className="md:col-span-4 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
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
          <div className="md:col-span-3">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <option value="all">Tất cả mức rủi ro</option>
              <option value="standard">Standard Risk</option>
              <option value="elevated">Elevated Risk</option>
              <option value="privileged">Privileged Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* ROLES TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-3 w-64">Tên Vai trò & Loại</th>
                <th className="p-3">Mục đích Nghiệp vụ</th>
                <th className="p-3 text-center">Mức Rủi ro</th>
                <th className="p-3 text-center">Trạng thái Phiên bản</th>
                <th className="p-3">Phạm vi Scope</th>
                <th className="p-3 text-center">Được Gán</th>
                <th className="p-3 text-center">Cảnh báo SoD</th>
                <th className="p-3">Cập nhật cuối</th>
                <th className="p-3 text-right pr-5">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Không tìm thấy vai trò nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Name & Category */}
                    <td className="p-3">
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
                    <td className="p-3 text-slate-700 dark:text-slate-300 max-w-xs">
                      <div className="line-clamp-2 text-[11px]">{role.purpose}</div>
                    </td>

                    {/* Risk Badge */}
                    <td className="p-3 text-center">{renderRiskBadge(role.riskLevel)}</td>

                    {/* Status Badge */}
                    <td className="p-3 text-center">{renderStatusBadge(role)}</td>

                    {/* Scope Summary */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>{role.scopes[0]?.description || 'Global'}</span>
                      </div>
                    </td>

                    {/* Assigned Counts */}
                    <td className="p-3 text-center">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {role.assignedUsersCount} users
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {role.assignedGroupCount} groups
                      </div>
                    </td>

                    {/* Conflict Issue */}
                    <td className="p-3 text-center">
                      {role.conflictIssuesCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span>{role.conflictIssuesCount} Issue</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">An toàn</span>
                      )}
                    </td>

                    {/* Updated */}
                    <td className="p-3 text-slate-500 text-[11px] font-mono whitespace-nowrap">
                      <div>{role.updatedTime}</div>
                      <div className="text-[10px] text-slate-400">bởi {role.updatedBy}</div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
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

                        {/* Review Access */}
                        <CmsIconButton
                          onClick={() => onSelectRoleForReview(role)}
                          icon={<Clock />}
                          size="sm"
                          aria-label="Rà soát vai trò"
                          title="Rà soát vai trò"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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

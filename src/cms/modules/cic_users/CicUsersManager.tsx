import React, { useState, useMemo } from 'react';
import {
  Plus,
  RefreshCw,
  Search,
  Filter,
  Edit,
  User,
  CheckCircle2,
  XCircle,
  Shield,
  Layers,
  Building,
  Square,
  CheckSquare,
  AlertTriangle,
  UserCheck,
  UserX,
  Clock,
  Download,
  KeyRound,
  History,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  Mail,
} from 'lucide-react';
import { CicUser, UserAccountStatus } from './types';
import { cicUsersMock, agenciesMock, productCategoriesMock, newsCategoriesMock, rolesMock } from './mockData';
import { CicUserFormModal } from './CicUserFormModal';

export const CicUsersManager: React.FC = () => {
  // Main Users State
  const [users, setUsers] = useState<CicUser[]>(cicUsersMock);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserAccountStatus>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [onlineFilter, setOnlineFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<CicUser | null>(null);

  // Status Change Prompt Modal State (Suspend / Deactivate with reason)
  const [statusPromptUser, setStatusPromptUser] = useState<CicUser | null>(null);
  const [targetStatus, setTargetStatus] = useState<UserAccountStatus>('suspended');
  const [changeReason, setChangeReason] = useState('');

  // Audit Drawer State
  const [auditUser, setAuditUser] = useState<CicUser | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      suspended: users.filter((u) => u.status === 'suspended').length,
      deactivated: users.filter((u) => u.status === 'deactivated').length,
      pending: users.filter((u) => u.status === 'pending_invite').length,
      online: users.filter((u) => u.status_online).length,
    };
  }, [users]);

  // Filtered Users Calculation
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search by username / fullname / email / phone
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        user.username.toLowerCase().includes(query) ||
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query);

      // Status Filter
      const matchStatus = statusFilter === 'all' || user.status === statusFilter;

      // Role Filter
      const matchRole = roleFilter === 'all' || user.role_id === roleFilter;

      // Agency Filter
      const matchAgency = agencyFilter === 'all' || user.agencies.includes(agencyFilter);

      // Online Filter
      const matchOnline =
        onlineFilter === 'all' ||
        (onlineFilter === 'online' && user.status_online) ||
        (onlineFilter === 'offline' && !user.status_online);

      return matchSearch && matchStatus && matchRole && matchAgency && matchOnline;
    });
  }, [users, searchQuery, statusFilter, roleFilter, agencyFilter, onlineFilter]);

  // Refresh Handler
  const handleRefresh = () => {
    showToast('Đã làm mới danh sách tài khoản quản trị!');
  };

  // Batch Select Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Batch Status Update (e.g. Suspend or Activate selected)
  const handleBatchStatusChange = (newSt: UserAccountStatus) => {
    if (selectedIds.length === 0) return;
    const label = newSt === 'active' ? 'Kích hoạt' : newSt === 'suspended' ? 'Tạm khóa' : 'Ngừng sử dụng';
    if (confirm(`Bạn có chắc muốn ${label} ${selectedIds.length} tài khoản đã chọn?`)) {
      setUsers((prev) =>
        prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: newSt, published: newSt === 'active' } : u))
      );
      showToast(`Đã ${label} thành công ${selectedIds.length} tài khoản!`);
      setSelectedIds([]);
    }
  };

  // Execute Status Change from Prompt Modal
  const confirmStatusChange = () => {
    if (!statusPromptUser) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === statusPromptUser.id) {
          const newHistory = [
            {
              id: `sth_${Date.now()}`,
              timestamp: nowStr,
              previous_status: u.status,
              new_status: targetStatus,
              changed_by: 'admin_cic',
              reason: changeReason.trim() || `Chuyển trạng thái sang ${targetStatus}`,
            },
            ...(u.status_history || []),
          ];
          return {
            ...u,
            status: targetStatus,
            published: targetStatus === 'active',
            status_history: newHistory,
          };
        }
        return u;
      })
    );
    showToast(`Đã chuyển trạng thái tài khoản "${statusPromptUser.username}" sang ${targetStatus}`);
    setStatusPromptUser(null);
    setChangeReason('');
  };

  // Reset Password Link Action
  const handleSendResetPassword = (user: CicUser) => {
    showToast(`Đã gửi liên kết khôi phục mật khẩu tới email: ${user.email}`);
  };

  // Save User Handler (Create/Update)
  const handleSaveUser = (savedUser: CicUser) => {
    const exists = users.some((u) => u.id === savedUser.id);
    if (exists) {
      setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
      showToast(`Đã cập nhật tài khoản "${savedUser.username}"`);
    } else {
      setUsers((prev) => [savedUser, ...prev]);
      showToast(`Đã tạo mới tài khoản "${savedUser.username}" thành công!`);
    }
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  // Helper badge renderers
  const renderStatusBadge = (st: UserAccountStatus) => {
    switch (st) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Hoạt động</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Tạm khóa</span>
          </span>
        );
      case 'deactivated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Đã khóa</span>
          </span>
        );
      case 'pending_invite':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Chờ kích hoạt</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER & TOP TITLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Quản lý Người dùng & Tài khoản CMS
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Vòng đời tài khoản, hồ sơ cá nhân, phân quyền Role & Scope và theo dõi hoạt động bảo mật hệ thống.
          </p>
        </div>

        {/* Top Action Button */}
        <button
          onClick={() => {
            setUserToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm / Mời người dùng</span>
        </button>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng tài khoản</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.total}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-950 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Đang hoạt động</div>
          <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">{stats.active}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-950 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Tạm khóa</div>
          <div className="text-xl font-extrabold text-amber-700 dark:text-amber-300 font-mono">{stats.suspended}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Đã khóa</div>
          <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300 font-mono">{stats.deactivated}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-950 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Chờ kích hoạt</div>
          <div className="text-xl font-extrabold text-blue-700 dark:text-blue-300 font-mono">{stats.pending}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-950 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Trực tuyến</div>
          <div className="text-xl font-extrabold text-teal-700 dark:text-teal-300 font-mono flex items-center gap-2">
            <span>{stats.online}</span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo Username, Họ tên, Email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động (Active)</option>
              <option value="suspended">Tạm khóa (Suspended)</option>
              <option value="deactivated">Đã khóa (Deactivated)</option>
              <option value="pending_invite">Chờ kích hoạt</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả vai trò (Roles)</option>
              {rolesMock.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Agency Filter */}
          <div className="md:col-span-2">
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả chi nhánh</option>
              {agenciesMock.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh */}
          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={handleRefresh}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium cursor-pointer"
              title="Làm mới"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Batch Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
            <span>Hiển thị: <strong>{filteredUsers.length}</strong> / {users.length} tài khoản</span>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-lg">
                Đã chọn: {selectedIds.length} dòng
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBatchStatusChange('active')}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Kích hoạt ({selectedIds.length})</span>
              </button>
              <button
                onClick={() => handleBatchStatusChange('suspended')}
                className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Tạm khóa ({selectedIds.length})</span>
              </button>
              <button
                onClick={() => handleBatchStatusChange('deactivated')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Ngừng dùng ({selectedIds.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DATA TABLE VIEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {filteredUsers.length > 0 && selectedIds.length === filteredUsers.length ? (
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3 w-12 text-center">Avatar</th>
                <th className="p-3">Tài khoản (Username)</th>
                <th className="p-3">Họ và tên</th>
                <th className="p-3">Vai trò (Role)</th>
                <th className="p-3">Chi nhánh / Scope</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-center">Trực tuyến</th>
                <th className="p-3">Lần truy cập cuối</th>
                <th className="p-3 text-right pr-5">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    Không tìm thấy tài khoản quản trị nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedIds.includes(user.id);
                  const userRoleObj = rolesMock.find((r) => r.id === user.role_id);
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-orange-50/40 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectOne(user.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Avatar */}
                      <td className="p-3 text-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 mx-auto"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center mx-auto">
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* Username & Email */}
                      <td className="p-3">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {user.username}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {user.email}
                        </div>
                      </td>

                      {/* Full Name & Phone */}
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {user.full_name || `${user.lname} ${user.fname}`.trim()}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {user.phone || '—'}
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${userRoleObj?.badge_color || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {user.role_name || userRoleObj?.name || 'Content Editor'}
                        </span>
                      </td>

                      {/* Agency & Category Scope count */}
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {user.agencies.map((aid) => {
                            const ag = agenciesMock.find((a) => a.id === aid);
                            return (
                              <span key={aid} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold rounded">
                                {ag?.code || aid}
                              </span>
                            );
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {user.products_categories.length + user.news_categories.length} danh mục phụ trách
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 text-center">
                        {renderStatusBadge(user.status)}
                      </td>

                      {/* Online Status */}
                      <td className="p-3 text-center">
                        {user.status_online ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Online</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Offline</span>
                        )}
                      </td>

                      {/* Last visit */}
                      <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">
                        <div>{user.last_visit_time || 'Chưa truy cập'}</div>
                        <div className="text-[10px] text-slate-400">{user.nums_visit || 0} lượt ghé thăm</div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right pr-5 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit button */}
                          <button
                            onClick={() => {
                              setUserToEdit(user);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Sửa hồ sơ & phân quyền"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Audit activity drawer trigger */}
                          <button
                            onClick={() => setAuditUser(user)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Xem nhật ký bảo mật"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Quick Reset Password Link */}
                          <button
                            onClick={() => handleSendResetPassword(user)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Gửi link khôi phục mật khẩu"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* Status toggle modal trigger */}
                          <button
                            onClick={() => {
                              setStatusPromptUser(user);
                              setTargetStatus(user.status === 'active' ? 'suspended' : 'active');
                              setChangeReason('');
                            }}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Đổi trạng thái tài khoản"
                          >
                            {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Hiển thị <strong>{filteredUsers.length}</strong> / <strong>{users.length}</strong> người dùng
          </span>
          {selectedIds.length > 0 && (
            <span className="text-orange-600 font-bold">
              Đã chọn {selectedIds.length} mục
            </span>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <CicUserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
        }}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
        existingUsers={users}
      />

      {/* STATUS CHANGE PROMPT MODAL */}
      {statusPromptUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Đổi trạng thái: {statusPromptUser.username}
                </h3>
                <p className="text-xs text-slate-500">
                  Hiện tại: <strong>{statusPromptUser.status}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chọn trạng thái mới:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as UserAccountStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  <option value="active">Kích hoạt lại (Active)</option>
                  <option value="suspended">Tạm khóa (Suspended)</option>
                  <option value="deactivated">Ngừng sử dụng (Deactivated)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lý do thay đổi (Lưu nhật ký Audit):
                </label>
                <textarea
                  rows={2}
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Nhập nguyên nhân..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusPromptUser(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Xác nhận đổi trạng thái
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT ACTIVITY DRAWER */}
      {auditUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Nhật ký bảo mật: {auditUser.username}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{auditUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setAuditUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">Thông tin tổng quan</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Lần truy cập cuối: <strong className="font-mono">{auditUser.last_visit_time || 'Chưa có'}</strong></div>
                  <div>Lượt ghé thăm: <strong className="font-mono">{auditUser.nums_visit || 0} lần</strong></div>
                  <div>2FA: <strong>{auditUser.two_factor_enabled ? 'Đã bật' : 'Tắt'}</strong></div>
                  <div>Đổi pass cuối: <strong className="font-mono">{auditUser.password_last_changed || 'N/A'}</strong></div>
                </div>
              </div>

              {/* Status Audit Trail */}
              {auditUser.status_history && auditUser.status_history.length > 0 && (
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-orange-600">
                    Lịch sử thay đổi trạng thái
                  </div>
                  <div className="space-y-2">
                    {auditUser.status_history.map((sth) => (
                      <div key={sth.id} className="p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>{sth.previous_status} → {sth.new_status}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{sth.timestamp}</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">Lý do: {sth.reason}</p>
                        <div className="text-[10px] text-slate-400 font-mono">Bởi: {sth.changed_by}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Logs */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-blue-600">
                  Nhật ký thao tác & Đăng nhập
                </div>
                <div className="space-y-2">
                  {auditUser.security_logs && auditUser.security_logs.length > 0 ? (
                    auditUser.security_logs.map((log) => (
                      <div key={log.id} className="p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {log.action}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          IP: {log.ip_address} {log.user_agent ? `| ${log.user_agent}` : ''}
                        </div>
                        {log.details && <div className="text-[11px] text-slate-500">{log.details}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400">Không có dữ liệu nhật ký.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setAuditUser(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

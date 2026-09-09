/* eslint-disable @next/next/no-img-element -- legacy avatar URLs are rendered as-is */
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Edit,
  CheckCircle2,
  XCircle,
  Shield,
  AlertTriangle,
  UserCheck,
  History,
  Lock,
  Unlock,
  Mail,
  Columns3,
  Trash2,
} from 'lucide-react';
import { CicUser, UserAccountStatus } from './types';
import type { UsersGovernanceData } from '../../data/GovernanceDataSource';
import { CicUserFormModal } from './CicUserFormModal';
import { CmsButton, CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPageHeader } from '../../components/ui/CmsPageHeader';
import { CmsSelectionCheckbox } from '../../components/ui/CmsSelectionCheckbox';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { bulkDeleteCmsUsersAction, bulkUpdateCmsUserStatusAction, createCmsUserAction, deleteCmsUserAction, getCmsUserActivityAction, sendCmsPasswordResetAction, updateCmsUserAction, updateCmsUserStatusAction } from '@/features/users/server/actions';
import { CmsDataGridFrame } from '@/shared/ui/cms/CmsDataGridFrame';
import { CmsTrashConfirmDialog } from '@/shared/ui/cms/CmsTrashConfirmDialog';
import { CicUsersOverview } from './CicUsersOverview';

type UserColumnId = 'id' | 'email' | 'avatar' | 'fullName' | 'firstName' | 'lastName' | 'phone' | 'role' | 'agencies' | 'status' | 'online' | 'lastVisit' | 'visits' | 'created' | 'updated' | 'passwordChanged' | 'address' | 'summary';
const userColumns: ReadonlyArray<{ id: UserColumnId; label: string; defaultVisible: boolean }> = [
  { id: 'id', label: 'ID', defaultVisible: false },
  { id: 'email', label: 'Email', defaultVisible: true },
  { id: 'avatar', label: 'Avatar', defaultVisible: true },
  { id: 'fullName', label: 'Họ và tên', defaultVisible: true },
  { id: 'firstName', label: 'Tên', defaultVisible: false },
  { id: 'lastName', label: 'Họ', defaultVisible: false },
  { id: 'phone', label: 'Điện thoại', defaultVisible: true },
  { id: 'role', label: 'Vai trò', defaultVisible: true },
  { id: 'agencies', label: 'Chi nhánh / Scope', defaultVisible: true },
  { id: 'status', label: 'Trạng thái', defaultVisible: true },
  { id: 'online', label: 'Trực tuyến', defaultVisible: true },
  { id: 'lastVisit', label: 'Lần truy cập cuối', defaultVisible: true },
  { id: 'visits', label: 'Số lượt truy cập', defaultVisible: false },
  { id: 'created', label: 'Ngày tạo', defaultVisible: false },
  { id: 'updated', label: 'Ngày cập nhật', defaultVisible: false },
  { id: 'passwordChanged', label: 'Đổi mật khẩu cuối', defaultVisible: false },
  { id: 'address', label: 'Địa chỉ', defaultVisible: false },
  { id: 'summary', label: 'Ghi chú', defaultVisible: false },
];

export const CicUsersManager: React.FC<{ data: UsersGovernanceData; capabilities: { create: boolean; edit: boolean; delete: boolean; currentUserId: string } }> = ({ data, capabilities }) => {
  const router = useRouter();
  // Main Users State
  const [users, setUsers] = useState<CicUser[]>(data.users);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserAccountStatus>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
  const [isMutating, setIsMutating] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<CicUser[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Set<UserColumnId>>(() => new Set(userColumns.filter((column) => column.defaultVisible).map((column) => column.id)));

  useEffect(() => {
    // The route refresh is authoritative; retain local optimistic state between refreshes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsers(data.users);
  }, [data.users]);
  const toggleColumn = (id: UserColumnId) => setVisibleColumns((current) => {
    const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next;
  });
  const visibleColumnCount = 3 + visibleColumns.size;
  useEffect(() => {
    if (!statusPromptUser && !auditUser) return;
    const previousOverflow=document.body.style.overflow; document.body.style.overflow='hidden';
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!isMutating){setStatusPromptUser(null);setAuditUser(null);}};
    document.addEventListener('keydown',onKeyDown);
    return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',onKeyDown);};
  },[statusPromptUser,auditUser,isMutating]);

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
      online: users.filter((u) => u.isOnline).length,
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
      const matchRole = roleFilter === 'all' || user.primaryRoleId === roleFilter;

      // Agency Filter
      const matchAgency = agencyFilter === 'all' || user.agencies.includes(agencyFilter);

      return matchSearch && matchStatus && matchRole && matchAgency;
    });
  }, [users, searchQuery, statusFilter, roleFilter, agencyFilter]);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Refresh Handler
  const handleRefresh = () => {
    router.refresh();
    showToast('Đã làm mới danh sách tài khoản quản trị!');
  };

  // Batch Select Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.id));
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
  const handleBatchStatusChange = async (newSt: UserAccountStatus) => {
    if (selectedIds.length === 0) return;
    const label = newSt === 'active' ? 'Kích hoạt' : newSt === 'suspended' ? 'Tạm khóa' : 'Ngừng sử dụng';
    if (confirm(`Bạn có chắc muốn ${label} ${selectedIds.length} tài khoản đã chọn?`)) {
      setIsMutating(true);
      try {
        await bulkUpdateCmsUserStatusAction(selectedIds, newSt);
        setUsers((prev) => prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: newSt } : u)));
        showToast(`Đã ${label} thành công ${selectedIds.length} tài khoản!`);
        setSelectedIds([]);
        router.refresh();
      } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể cập nhật tài khoản.'); }
      finally { setIsMutating(false); }
    }
  };

  // Execute Status Change from Prompt Modal
  const confirmStatusChange = async () => {
    if (!statusPromptUser) return;
    if (!changeReason.trim()) { showToast('Vui lòng nhập lý do thay đổi trạng thái.'); return; }
    setIsMutating(true);
    try {
      await updateCmsUserStatusAction(statusPromptUser.id, targetStatus, changeReason.trim());
    setUsers((prev) => prev.map((user) => user.id === statusPromptUser.id ? { ...user, status: targetStatus } : user));
    showToast(`Đã chuyển trạng thái tài khoản "${statusPromptUser.username}" sang ${targetStatus}`);
    setStatusPromptUser(null);
    setChangeReason('');
    router.refresh();
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể đổi trạng thái tài khoản.'); }
    finally { setIsMutating(false); }
  };

  // Reset Password Link Action
  const handleSendResetPassword = async (user: CicUser) => {
    setIsMutating(true);
    try { await sendCmsPasswordResetAction(user.id); showToast(`Đã gửi liên kết khôi phục mật khẩu tới email: ${user.email}`); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Không thể gửi email khôi phục.'); }
    finally { setIsMutating(false); }
  };

  const loadUserActivity = async (user: CicUser) => {
    const activity = await getCmsUserActivityAction(user.id);
    return { ...user, ...activity };
  };

  const openUserEditor = async (user: CicUser) => {
    setIsMutating(true);
    try { setUserToEdit(await loadUserActivity(user)); setIsModalOpen(true); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Không thể tải chi tiết tài khoản.'); }
    finally { setIsMutating(false); }
  };

  const openUserActivity = async (user: CicUser) => {
    setIsMutating(true);
    try { setAuditUser(await loadUserActivity(user)); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Không thể tải nhật ký tài khoản.'); }
    finally { setIsMutating(false); }
  };

  // Save User Handler (Create/Update)
  const handleSaveUser = async (savedUser: CicUser, password?: string, statusReason = '') => {
    setIsMutating(true);
    try {
    const exists = users.some((u) => u.id === savedUser.id);
    const payload = { username: savedUser.username, email: savedUser.email, password, fname: savedUser.fname, lname: savedUser.lname, phone: savedUser.phone, address: savedUser.address, summary: savedUser.summary, avatar: savedUser.avatar, status: savedUser.status, roleId: savedUser.primaryRoleId, agencies: savedUser.agencies, statusReason };
    if (exists) {
      await updateCmsUserAction(savedUser.id, payload);
      setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
      showToast(`Đã cập nhật tài khoản "${savedUser.username}"`);
    } else {
      const created = await createCmsUserAction(payload);
      setUsers((prev) => [{ ...savedUser, id: created.id }, ...prev]);
      showToast(`Đã tạo mới tài khoản "${savedUser.username}" thành công!`);
    }
    setIsModalOpen(false);
    setUserToEdit(null);
    router.refresh();
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể lưu tài khoản.'); }
    finally { setIsMutating(false); }
  };

  const confirmDeleteUsers = async () => {
    if (!deleteTargets.length) return;
    setIsMutating(true);
    try {
      const results = deleteTargets.length === 1
        ? [{ id: deleteTargets[0].id, ok: true, ...(await deleteCmsUserAction(deleteTargets[0].id)), message: `Đã chuyển “${deleteTargets[0].username}” vào Thùng rác.` }]
        : await bulkDeleteCmsUsersAction(deleteTargets.map((user) => user.id));
      const succeeded = new Set(results.filter((result) => result.ok).map((result) => result.id));
      setUsers((current) => current.filter((user) => !succeeded.has(user.id)));
      setSelectedIds((current) => current.filter((id) => !succeeded.has(id)));
      const failed = results.filter((result) => !result.ok);
      showToast(failed.length ? `Đã chuyển ${succeeded.size} tài khoản; ${failed.length} tài khoản bị chặn: ${failed[0].message}` : `Đã chuyển ${succeeded.size} tài khoản vào Thùng rác.`);
      setDeleteTargets([]);
      router.refresh();
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không thể chuyển tài khoản vào Thùng rác.'); }
    finally { setIsMutating(false); }
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
    <div className="space-y-5 animate-in fade-in duration-200" aria-busy={isMutating}>
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="fixed top-20 inset-x-3 sm:left-auto sm:right-6 z-50 max-w-md px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-start gap-2 border border-slate-700 animate-in slide-in-from-top-2 motion-reduce:animate-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <CmsPageHeader
        icon={<Shield />}
        title="Người dùng CMS"
        description="Quản lý tài khoản, hồ sơ, vai trò và trạng thái truy cập hệ thống."
        meta={<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{users.length} tài khoản</span>}
        actions={capabilities.create ? (
          <CmsButton
            onClick={() => {
              setUserToEdit(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            size="sm"
            leadingIcon={<UserCheck />}
          >
            Thêm người dùng
          </CmsButton>
        ) : undefined}
      />

      <CicUsersOverview
        stats={stats}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        agencyFilter={agencyFilter}
        roles={data.roles}
        agencies={data.agencies}
        filteredCount={filteredUsers.length}
        totalCount={users.length}
        selectedCount={selectedIds.length}
        canEdit={capabilities.edit}
        canDelete={capabilities.delete}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        onAgencyFilterChange={setAgencyFilter}
        onRefresh={handleRefresh}
        onClearSelection={() => setSelectedIds([])}
        onBatchStatusChange={(status) => void handleBatchStatusChange(status)}
        onBatchDelete={() => setDeleteTargets(users.filter((user) => selectedIds.includes(user.id)))}
      />

      {/* DATA TABLE VIEW */}
      <CmsDataGridFrame
        ariaLabel="Bảng người dùng"
        refreshKey={`${visibleColumns.size}:${[...visibleColumns].join(',')}:${paginatedUsers.length}`}
        toolbar={(
          <details className="relative">
            <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Columns3 className="h-4 w-4" />
              Cột hiển thị
            </summary>
            <div className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Column Visibility</span>
                <button type="button" onClick={() => setVisibleColumns(new Set(userColumns.filter((column) => column.defaultVisible).map((column) => column.id)))} className="text-[11px] font-semibold text-orange-600 hover:underline">Mặc định</button>
              </div>
              <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                {userColumns.map((column) => (
                  <label key={column.id} className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <input type="checkbox" checked={visibleColumns.has(column.id)} onChange={() => toggleColumn(column.id)} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500" />
                    <span>{column.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </details>
        )}
        footer={<CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredUsers.length} itemLabel="tài khoản" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />}
      >
          <table className="cms-data-table text-left">
            <thead className="sticky top-0 z-30 bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                {/* Checkbox Sticky Left */}
                <th className="py-3 px-3 w-10 lg:sticky lg:left-0 lg:z-40 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800 text-center">
                  <CmsSelectionCheckbox checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length} indeterminate={selectedIds.length > 0 && selectedIds.length < filteredUsers.length} onChange={handleSelectAll} label="Chọn tất cả tài khoản" />
                </th>
                {/* Username Sticky Left */}
                <th className="py-3 px-4 min-w-[160px] sm:min-w-[200px] sticky left-0 lg:left-10 z-40 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-800">
                  Tài khoản (Username)
                </th>
                {visibleColumns.has('id') && <th className="py-3 px-4 min-w-20">ID</th>}
                {visibleColumns.has('email') && <th className="py-3 px-4 min-w-[220px]">Email</th>}
                {visibleColumns.has('avatar') && <th className="py-3 px-3 w-14 text-center">Avatar</th>}
                {visibleColumns.has('fullName') && <th className="py-3 px-4 min-w-[170px]">Họ và tên</th>}
                {visibleColumns.has('firstName') && <th className="py-3 px-4 min-w-[130px]">Tên</th>}
                {visibleColumns.has('lastName') && <th className="py-3 px-4 min-w-[130px]">Họ</th>}
                {visibleColumns.has('phone') && <th className="py-3 px-4 min-w-[140px]">Điện thoại</th>}
                {visibleColumns.has('role') && <th className="py-3 px-4 min-w-[150px]">Vai trò (Role)</th>}
                {visibleColumns.has('agencies') && <th className="py-3 px-4 min-w-[160px]">Chi nhánh / Scope</th>}
                {visibleColumns.has('status') && <th className="py-3 px-4 min-w-[120px] text-center">Trạng thái</th>}
                {visibleColumns.has('online') && <th className="py-3 px-4 min-w-[100px] text-center">Trực tuyến</th>}
                {visibleColumns.has('lastVisit') && <th className="py-3 px-4 min-w-[150px]">Lần truy cập cuối</th>}
                {visibleColumns.has('visits') && <th className="py-3 px-4 min-w-[120px] text-right">Số lượt</th>}
                {visibleColumns.has('created') && <th className="py-3 px-4 min-w-[170px]">Ngày tạo</th>}
                {visibleColumns.has('updated') && <th className="py-3 px-4 min-w-[170px]">Ngày cập nhật</th>}
                {visibleColumns.has('passwordChanged') && <th className="py-3 px-4 min-w-[180px]">Đổi mật khẩu cuối</th>}
                {visibleColumns.has('address') && <th className="py-3 px-4 min-w-[220px]">Địa chỉ</th>}
                {visibleColumns.has('summary') && <th className="py-3 px-4 min-w-[260px]">Ghi chú</th>}
                {/* Actions Sticky Right */}
                <th className="py-3 px-3 sm:px-4 w-32 sm:w-36 text-center sticky right-0 z-40 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-800">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumnCount} className="p-8 text-center text-slate-400">
                    Không tìm thấy tài khoản quản trị nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isSelected = selectedIds.includes(user.id);
                  const userRoleObj = data.roles.find((r) => r.id === user.primaryRoleId);
                  return (
                    <tr
                      key={user.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Checkbox Sticky Left */}
                      <td className="py-3 px-3 lg:sticky lg:left-0 lg:z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-r border-slate-100 dark:border-slate-800 text-center">
                        <CmsSelectionCheckbox checked={isSelected} onChange={() => handleSelectOne(user.id)} label={`Chọn tài khoản ${user.username}`} />
                      </td>

                      {/* Username Sticky Left */}
                      <td className="py-3 px-4 sticky left-0 lg:left-10 z-20 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-r border-slate-100 dark:border-slate-800">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {user.username}
                        </div>
                      </td>

                      {visibleColumns.has('id') && <td className="py-3 px-4 font-mono text-slate-500">{user.id}</td>}
                      {visibleColumns.has('email') && <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 break-all">{user.email}</td>}

                      {/* Avatar */}
                      {visibleColumns.has('avatar') && <td className="py-3 px-3 text-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 mx-auto"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center mx-auto">
                            {user.username[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </td>}

                      {/* Full Name & Phone */}
                      {visibleColumns.has('fullName') && <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {user.full_name || `${user.lname} ${user.fname}`.trim()}
                        </div>
                      </td>}
                      {visibleColumns.has('firstName') && <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{user.fname || '—'}</td>}
                      {visibleColumns.has('lastName') && <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{user.lname || '—'}</td>}
                      {visibleColumns.has('phone') && <td className="py-3 px-4 text-[11px] text-slate-500 font-mono whitespace-nowrap">{user.phone || '—'}</td>}

                      {/* Role Badge */}
                      {visibleColumns.has('role') && <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${userRoleObj?.badge_color || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {userRoleObj?.name || 'Chưa gán vai trò'}
                        </span>
                      </td>}

                      {/* Agency scope */}
                      {visibleColumns.has('agencies') && <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.agencies.map((aid) => {
                            const ag = data.agencies.find((a) => a.id === aid);
                            return (
                              <span key={aid} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold rounded">
                                {ag?.code || aid}
                              </span>
                            );
                          })}
                        </div>
                      </td>}

                      {/* Status */}
                      {visibleColumns.has('status') && <td className="py-3 px-4 text-center">
                        {renderStatusBadge(user.status)}
                      </td>}

                      {/* Online Status */}
                      {visibleColumns.has('online') && <td className="py-3 px-4 text-center">
                        {user.isOnline ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                            <span>Online</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Offline</span>
                        )}
                      </td>}

                      {/* Last visit */}
                      {visibleColumns.has('lastVisit') && <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">{user.last_visit_time || 'Chưa truy cập'}</td>}
                      {visibleColumns.has('visits') && <td className="py-3 px-4 text-right font-mono text-slate-500">{user.nums_visit || 0}</td>}
                      {visibleColumns.has('created') && <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{user.created_time || '—'}</td>}
                      {visibleColumns.has('updated') && <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{user.updated_time || '—'}</td>}
                      {visibleColumns.has('passwordChanged') && <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{user.passwordChangedAt || '—'}</td>}
                      {visibleColumns.has('address') && <td className="py-3 px-4 text-slate-600 dark:text-slate-400 [overflow-wrap:anywhere]">{user.address || '—'}</td>}
                      {visibleColumns.has('summary') && <td className="py-3 px-4 text-slate-600 dark:text-slate-400 [overflow-wrap:anywhere]">{user.summary || '—'}</td>}

                      {/* Actions (Sticky Right) */}
                      <td className="py-3 px-3 sm:px-4 sticky right-0 z-20 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 border-l border-slate-100 dark:border-slate-800 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Edit button */}
                          {capabilities.edit && <CmsIconButton
                            onClick={() => void openUserEditor(user)}
                            aria-label="Sửa người dùng"
                            title="Sửa người dùng"
                            icon={<Edit />}
                            size="sm"
                          />}
                          {capabilities.delete && user.id !== capabilities.currentUserId && <CmsIconButton
                            onClick={() => setDeleteTargets([user])}
                            aria-label={`Chuyển tài khoản ${user.username} vào Thùng rác`}
                            title="Chuyển vào Thùng rác"
                            icon={<Trash2 />}
                            variant="danger"
                            size="sm"
                            disabled={isMutating}
                          />}

                          {/* Audit activity drawer trigger */}
                          <CmsIconButton
                            onClick={() => void openUserActivity(user)}
                            aria-label="Xem nhật ký bảo mật"
                            title="Xem nhật ký bảo mật"
                            icon={<History />}
                            size="sm"
                          />

                          {/* Quick Reset Password Link */}
                          {capabilities.edit && <CmsIconButton
                            onClick={() => handleSendResetPassword(user)}
                            aria-label="Gửi liên kết đặt lại mật khẩu"
                            title="Gửi liên kết đặt lại mật khẩu"
                            icon={<Mail />}
                            size="sm"
                          />}

                          {/* Status toggle modal trigger */}
                          {capabilities.edit && <CmsIconButton
                            onClick={() => {
                              setStatusPromptUser(user);
                              setTargetStatus(user.status === 'active' ? 'suspended' : 'active');
                              setChangeReason('');
                            }}
                            aria-label={user.status === 'active' ? 'Tạm khóa tài khoản' : 'Kích hoạt tài khoản'}
                            title={user.status === 'active' ? 'Tạm khóa tài khoản' : 'Kích hoạt tài khoản'}
                            icon={user.status === 'active' ? <Lock /> : <Unlock />}
                            size="sm"
                          />}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
      </CmsDataGridFrame>

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
        agencies={data.agencies}
        roles={data.roles}
        permissionTasks={data.permissionTasks}
        rolePermissions={data.rolePermissions}
        isSaving={isMutating}
      />

      {/* STATUS CHANGE PROMPT MODAL */}
      {statusPromptUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 motion-reduce:animate-none">
          <div role="dialog" aria-modal="true" aria-labelledby="user-status-dialog-title" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 id="user-status-dialog-title" className="text-sm font-bold text-slate-900 dark:text-white">
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
                  className="w-full min-h-11 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-xs font-bold cursor-pointer"
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
                  className="w-full min-h-20 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-xs resize-y"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusPromptUser(null)}
                className="min-h-11 w-full sm:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={confirmStatusChange}
                className="min-h-11 w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Xác nhận đổi trạng thái
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT ACTIVITY DRAWER */}
      {auditUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 motion-reduce:animate-none">
          <div role="dialog" aria-modal="true" aria-labelledby="user-security-dialog-title" className="bg-white dark:bg-slate-900 sm:border-l border-slate-200 dark:border-slate-800 w-full max-w-lg h-[100dvh] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 motion-reduce:animate-none">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex min-w-0 items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <History className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 id="user-security-dialog-title" className="text-sm font-bold text-slate-900 dark:text-white break-words">
                    Nhật ký bảo mật: {auditUser.username}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono break-all">{auditUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setAuditUser(null)}
                aria-label="Đóng nhật ký bảo mật"
                className="min-h-11 min-w-11 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs [overflow-wrap:anywhere]">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">Thông tin tổng quan</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>Lần truy cập cuối: <strong className="font-mono">{auditUser.last_visit_time || 'Chưa có'}</strong></div>
                  <div>Lượt ghé thăm: <strong className="font-mono">{auditUser.nums_visit || 0} lần</strong></div>
                  <div>2FA: <strong>Chưa tích hợp</strong></div>
                  <div>Đổi pass cuối: <strong className="font-mono">{auditUser.passwordChangedAt || 'N/A'}</strong></div>
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 font-bold">
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 font-bold">
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
                className="w-full min-h-11 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      <CmsTrashConfirmDialog
        open={deleteTargets.length > 0}
        title={deleteTargets.length > 1 ? `Xóa ${deleteTargets.length} tài khoản` : 'Xóa tài khoản'}
        description="Tài khoản sẽ bị khóa đăng nhập ngay và được giữ identity tombstone để bảo toàn Nhật ký/Audit."
        itemName={deleteTargets.length > 1 ? `${deleteTargets.length} tài khoản đã chọn` : deleteTargets[0]?.username ?? ''}
        busy={isMutating}
        onClose={() => setDeleteTargets([])}
        onConfirm={() => void confirmDeleteUsers()}
      />
    </div>
  );
};

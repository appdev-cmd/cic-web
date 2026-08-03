import React, { useState, useMemo } from 'react';
import {
  Plus,
  RefreshCw,
  Trash2,
  Search,
  Filter,
  Edit,
  User,
  CheckCircle2,
  XCircle,
  Check,
  Building,
  Shield,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  Square,
  CheckSquare,
} from 'lucide-react';
import { CicUser } from './types';
import { cicUsersMock, agenciesMock, productCategoriesMock, newsCategoriesMock } from './mockData';
import { CicUserFormModal } from './CicUserFormModal';

export const CicUsersManager: React.FC = () => {
  // Main Users State
  const [users, setUsers] = useState<CicUser[]>(cicUsersMock);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [onlineFilter, setOnlineFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<CicUser | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Filtered Users Calculation
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search by username / fullname / email
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        user.username.toLowerCase().includes(query) ||
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      // Filter Published
      const matchPublished =
        publishedFilter === 'all' ||
        (publishedFilter === 'published' && user.published) ||
        (publishedFilter === 'unpublished' && !user.published);

      // Filter Online Status
      const matchOnline =
        onlineFilter === 'all' ||
        (onlineFilter === 'online' && user.status_online) ||
        (onlineFilter === 'offline' && !user.status_online);

      return matchSearch && matchPublished && matchOnline;
    });
  }, [users, searchQuery, publishedFilter, onlineFilter]);

  // 2. Refresh Handler
  const handleRefresh = () => {
    showToast('Đã làm mới danh sách tài khoản quản trị!');
  };

  // 3. Batch Select Handlers
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

  // 4. Batch Delete Handler
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tài khoản đã chọn?`)) {
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      showToast(`Đã xóa thành công ${selectedIds.length} tài khoản!`);
    }
  };

  // 5. Delete Single Handler
  const handleDeleteUser = (user: CicUser) => {
    if (confirm(`Bạn có chắc muốn xóa tài khoản "${user.username}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSelectedIds((prev) => prev.filter((id) => id !== user.id));
      showToast(`Đã xóa tài khoản "${user.username}"!`);
    }
  };

  // 6. Toggle Published State inline
  const handleTogglePublished = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextPublished = !u.published;
          showToast(`Đã ${nextPublished ? 'bật' : 'tắt'} trạng thái tài khoản "${u.username}"`);
          return { ...u, published: nextPublished };
        }
        return u;
      })
    );
  };

  // 7. Inline Edit Ordering
  const handleOrderingChange = (id: string, newOrdering: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ordering: newOrdering } : u))
    );
  };

  // 8. Save User Handler (Create/Update)
  const handleSaveUser = (savedUser: CicUser) => {
    const exists = users.some((u) => u.id === savedUser.id);
    if (exists) {
      setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
      showToast(`Đã cập nhật thông tin tài khoản "${savedUser.username}"`);
    } else {
      setUsers((prev) => [savedUser, ...prev]);
      showToast(`Đã thêm mới tài khoản "${savedUser.username}" thành công`);
    }
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* TOAST MESSAGE NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOOLBAR & TITLE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Quản lý Tài khoản Quản trị
            </h1>
            <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
              {users.length} tài khoản
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Danh sách tài khoản có quyền đăng nhập và thao tác trên hệ thống quản trị CMS CIC.
          </p>
        </div>

        {/* Top Right Action Button */}
        <button
          onClick={() => {
            setUserToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm quản trị viên</span>
        </button>
      </div>

      {/* TOOLBAR (Search, Filters & Batch Actions) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo Username, Họ tên, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Filter Published */}
          <div className="md:col-span-3">
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái hoạt động</option>
              <option value="published">Đang hoạt động (Published)</option>
              <option value="unpublished">Tắt hoạt động (Draft / Off)</option>
            </select>
          </div>

          {/* Filter Online Status + Refresh */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={onlineFilter}
              onChange={(e) => setOnlineFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái Online</option>
              <option value="online">Trực tuyến (Online)</option>
              <option value="offline">Ngoại tuyến (Offline)</option>
            </select>

            <button
              onClick={handleRefresh}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium cursor-pointer shrink-0"
              title="Làm mới danh sách"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Batch Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
            <span>Hiển thị: <strong>{filteredUsers.length}</strong> / {users.length} tài khoản</span>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold rounded-lg">
                Đã chọn: {selectedIds.length} dòng
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa ({selectedIds.length})</span>
              </button>
            )}
          </div>
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
                <th className="p-3 w-14 text-center">Avatar</th>
                <th className="p-3">Username</th>
                <th className="p-3">Full name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3 text-center">Published</th>
                <th className="p-3 text-center">Online Status</th>
                <th className="p-3 text-center w-24">Ordering</th>
                <th className="p-3">Created Time</th>
                <th className="p-3 text-right pr-5">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    Không tìm thấy tài khoản quản trị nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedIds.includes(user.id);
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

                      {/* Username */}
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {user.username}
                        </span>
                      </td>

                      {/* Full name */}
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {user.full_name || `${user.lname} ${user.fname}`.trim()}
                      </td>

                      {/* Email */}
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {user.phone || '—'}
                      </td>

                      {/* Published Toggle Switch */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleTogglePublished(user.id)}
                          className="cursor-pointer inline-flex items-center"
                          title="Bật/Tắt kích hoạt"
                        >
                          <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                            user.published ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              user.published ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </div>
                        </button>
                      </td>

                      {/* Online Status Badge */}
                      <td className="p-3 text-center">
                        {user.status_online ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Trực tuyến</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Ngoại tuyến</span>
                          </span>
                        )}
                      </td>

                      {/* Ordering Inline Edit */}
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={user.ordering}
                          onChange={(e) =>
                            handleOrderingChange(user.id, parseInt(e.target.value) || 0)
                          }
                          className="w-16 px-1.5 py-1 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </td>

                      {/* Created Time */}
                      <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">
                        {user.created_time}
                      </td>

                      {/* Action Buttons (Edit & Delete only) */}
                      <td className="p-3 text-right pr-5 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setUserToEdit(user);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Sửa thông tin tài khoản"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Table Footer Stats */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Hiển thị <strong>{filteredUsers.length}</strong> / <strong>{users.length}</strong> tài khoản quản trị
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
    </div>
  );
};

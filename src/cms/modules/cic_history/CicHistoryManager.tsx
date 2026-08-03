import React, { useState, useMemo } from 'react';
import {
  RotateCw,
  Download,
  Search,
  Filter,
  RotateCcw,
  Eye,
  X,
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Globe,
  Terminal,
  Copy,
  Check,
  FileText,
  Calendar,
  Layers,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { CicHistoryLog, HistoryType, HistoryFilterState } from './types';
import { mockHistoryLogs } from './mockData';

export const CicHistoryManager: React.FC = () => {
  // State for logs
  const [logs, setLogs] = useState<CicHistoryLog[]>(mockHistoryLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<HistoryFilterState>({
    usernameSearch: '',
    typeFilter: 'ALL',
    serviceFilter: 'ALL',
    startDate: '',
    endDate: '',
    publishedFilter: 'ALL',
  });

  // Sort State
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Selected Log for Readonly Drawer
  const [selectedLog, setSelectedLog] = useState<CicHistoryLog | null>(null);
  const [copiedIp, setCopiedIp] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Get unique service names for filter dropdown
  const serviceList = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.service_name)));
  }, [logs]);

  // Filter & Sort Logic
  const filteredAndSortedLogs = useMemo(() => {
    return logs
      .filter((item) => {
        // Username / Description search
        if (filters.usernameSearch.trim()) {
          const q = filters.usernameSearch.toLowerCase();
          const matchUser = item.username.toLowerCase().includes(q);
          const matchFullname = item.user_fullname?.toLowerCase().includes(q) || false;
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchIp = item.ip_address.includes(q);
          if (!matchUser && !matchFullname && !matchDesc && !matchIp) return false;
        }

        // Type filter
        if (filters.typeFilter !== 'ALL' && item.type !== filters.typeFilter) {
          return false;
        }

        // Service filter
        if (filters.serviceFilter !== 'ALL' && item.service_name !== filters.serviceFilter) {
          return false;
        }

        // Published filter
        if (filters.publishedFilter !== 'ALL') {
          const isPub = filters.publishedFilter === 'PUBLISHED';
          if (item.published !== isPub) return false;
        }

        // Date range filter
        if (filters.startDate) {
          const itemDate = item.created_time.split(' ')[0];
          if (itemDate < filters.startDate) return false;
        }
        if (filters.endDate) {
          const itemDate = item.created_time.split(' ')[0];
          if (itemDate > filters.endDate) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_time).getTime();
        const timeB = new Date(b.created_time).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [logs, filters, sortOrder]);

  const handleResetFilters = () => {
    setFilters({
      usernameSearch: '',
      typeFilter: 'ALL',
      serviceFilter: 'ALL',
      startDate: '',
      endDate: '',
      publishedFilter: 'ALL',
    });
    showToast('Đã đặt lại bộ lọc nhật ký');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Đã làm mới dữ liệu nhật ký mới nhất');
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Created Time', 'Username', 'Type', 'Service Name', 'Description', 'IP Address'];
    const rows = filteredAndSortedLogs.map((l) => [
      l.id,
      l.created_time,
      l.username,
      l.type,
      `"${l.service_name}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      l.ip_address,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cic_history_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Đã xuất ${filteredAndSortedLogs.length} bản ghi lịch sử ra CSV`);
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  // Helper Badge Color mapping for Type
  const getTypeBadge = (type: HistoryType) => {
    switch (type) {
      case 'Create':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: <Plus className="w-3 h-3 shrink-0" />,
        };
      case 'Update':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: <Edit className="w-3 h-3 shrink-0" />,
        };
      case 'Delete':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: <Trash2 className="w-3 h-3 shrink-0" />,
        };
      case 'Success':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-3 h-3 shrink-0" />,
        };
      case 'Warning':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: <AlertTriangle className="w-3 h-3 shrink-0" />,
        };
      case 'Error':
        return {
          bg: 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          icon: <XCircle className="w-3 h-3 shrink-0" />,
        };
      case 'Expired':
        return {
          bg: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          icon: <Clock className="w-3 h-3 shrink-0" />,
        };
      case 'Login':
        return {
          bg: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
          icon: <User className="w-3 h-3 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
          icon: <Activity className="w-3 h-3 shrink-0" />,
        };
    }
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

      {/* TOP HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Nhật ký Hoạt động
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
              {logs.length} bản ghi
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lưu vết kiểm toán toàn bộ thao tác người dùng, truy cập hệ thống và lịch sử hoạt động quản trị.
          </p>
        </div>

        {/* TOOLBAR CHỈ CÓ REFRESH VÀ EXPORT */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            title="Xuất file CSV"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* TOOLBAR & FILTER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* 1. Search Username / Text */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Username / IP / Nội dung..."
              value={filters.usernameSearch}
              onChange={(e) => setFilters((prev) => ({ ...prev, usernameSearch: e.target.value }))}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 2. Type Filter */}
          <div>
            <select
              value={filters.typeFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, typeFilter: e.target.value }))}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Loại nhật ký: Tất cả</option>
              <option value="Create">Create (Thêm mới)</option>
              <option value="Update">Update (Cập nhật)</option>
              <option value="Delete">Delete (Xóa)</option>
              <option value="Success">Success (Thành công)</option>
              <option value="Warning">Warning (Cảnh báo)</option>
              <option value="Error">Error (Lỗi)</option>
              <option value="Expired">Expired (Hết hạn)</option>
              <option value="Login">Login (Đăng nhập)</option>
            </select>
          </div>

          {/* 3. Service Name Filter */}
          <div>
            <select
              value={filters.serviceFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, serviceFilter: e.target.value }))}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Dịch vụ: Tất cả</option>
              {serviceList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Date Range Start */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Từ:</span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 5. Date Range End */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Đến:</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 6. Published Filter & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={filters.publishedFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, publishedFilter: e.target.value }))}
              className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="UNPUBLISHED">Chưa xuất bản</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Hiển thị: <strong>{filteredAndSortedLogs.length}</strong> / {logs.length} nhật ký</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            Mới nhất trước ({sortOrder === 'desc' ? 'Giảm dần' : 'Tăng dần'})
          </button>
        </div>
      </div>

      {/* LOGS TABLE LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Hiển thị <strong className="text-slate-900 dark:text-white">{filteredAndSortedLogs.length}</strong> nhật ký
          </span>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 hover:text-orange-600 font-bold transition-colors cursor-pointer"
          >
            <span>Sắp xếp thời gian: {sortOrder === 'desc' ? 'Mới nhất trước' : 'Cũ nhất trước'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 w-40">Thời gian tạo</th>
                <th className="p-3.5 w-36">Tài khoản</th>
                <th className="p-3.5 w-32 text-center">Loại nhật ký</th>
                <th className="p-3.5 w-44">Tên dịch vụ</th>
                <th className="p-3.5 min-w-[280px]">Nội dung thao tác</th>
                <th className="p-3.5 w-32 font-mono">Địa chỉ IP</th>
                <th className="p-3.5 text-right w-24 pr-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredAndSortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>Không tìm thấy bản ghi nhật ký phù hợp với bộ lọc.</p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedLogs.map((log) => {
                  const badge = getTypeBadge(log.type);
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-orange-50/40 dark:hover:bg-orange-950/20 transition-colors cursor-pointer group"
                    >
                      {/* Created Time */}
                      <td className="p-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400 font-mono text-[11px] font-medium">
                        {log.created_time}
                      </td>

                      {/* Username */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          @{log.username}
                        </div>
                        {log.user_fullname && (
                          <div className="text-[10px] text-slate-400 truncate">{log.user_fullname}</div>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{log.type}</span>
                        </span>
                      </td>

                      {/* Service Name */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold text-[11px]">
                          {log.service_name}
                        </span>
                      </td>

                      {/* Description (Limit 2 lines + Hover title) */}
                      <td className="p-3.5" title={log.description}>
                        <p className="line-clamp-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                          {log.description}
                        </p>
                      </td>

                      {/* IP Address */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {log.ip_address}
                      </td>

                      {/* Action Detail */}
                      <td className="p-3.5 text-right pr-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết Log"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= READONLY SLIDE-OVER DRAWER DETAIL ================= */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-orange-100 dark:bg-orange-950 text-orange-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Chi tiết Nhật ký Hệ thống (Log Detail)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedLog.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (READONLY INFO - NO EDIT FORM) */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Type & Status Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Loại Nhật ký (Type)
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold ${
                      getTypeBadge(selectedLog.type).bg
                    }`}
                  >
                    {getTypeBadge(selectedLog.type).icon}
                    <span>{selectedLog.type}</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Dịch vụ tác động
                  </span>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {selectedLog.service_name}
                  </span>
                </div>
              </div>

              {/* Primary Grid Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Thời gian tạo (Created Time)
                  </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedLog.created_time}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tài khoản (Username)
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    @{selectedLog.username}
                  </span>
                  {selectedLog.user_fullname && (
                    <span className="block text-[11px] text-slate-500">{selectedLog.user_fullname}</span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Dịch vụ liên quan (Service)
                  </span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {selectedLog.service_name}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Địa chỉ IP (IP Address)
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {selectedLog.ip_address}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyIp(selectedLog.ip_address)}
                      className="text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                      title="Copy IP"
                    >
                      {copiedIp ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Mô tả chi tiết (Description)
                </span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedLog.description}
                </p>
              </div>

              {/* User Agent */}
              {selectedLog.user_agent && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Trình duyệt / Thiết bị (User Agent)
                  </span>
                  <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
                    {selectedLog.user_agent}
                  </p>
                </div>
              )}

              {/* Request Data JSON payload */}
              {selectedLog.request_data && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Payload Dữ liệu Yêu cầu (Request Data)</span>
                  </span>
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                    {JSON.stringify(selectedLog.request_data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Response Data JSON payload */}
              {selectedLog.response_data && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dữ liệu Phản hồi (Response Data)</span>
                  </span>
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                    {JSON.stringify(selectedLog.response_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Bản ghi nhật ký hệ thống ở chế độ Chỉ đọc (Readonly)</span>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
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

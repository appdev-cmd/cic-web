import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Shield,
  ShieldAlert,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  RefreshCw,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { AuditEvent, AuditCategory } from './types';
import { CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsTabs } from '../../components/ui/CmsTabs';

interface AuditTabProps {
  logs: AuditEvent[];
  onOpenEventDetail: (event: AuditEvent) => void;
  onOpenExportDrawer: () => void;
}

export const AuditTab: React.FC<AuditTabProps> = ({
  logs,
  onOpenEventDetail,
  onOpenExportDrawer,
}) => {
  const [activeCategory, setActiveCategory] = useState<AuditCategory>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all'>('30days');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filter logic
  const filteredLogs = logs.filter((log) => {
    // Category match
    if (activeCategory !== 'all') {
      if (activeCategory === 'sensitive' && !log.action.isSensitive) return false;
      if (activeCategory === 'permissions_users' && log.action.category !== 'permissions_users') return false;
      if (activeCategory === 'config_publish' && log.action.category !== 'config_publish') return false;
      if (activeCategory === 'export_jobs' && log.action.category !== 'export_jobs') return false;
    }

    // Severity match
    if (severityFilter !== 'all' && log.action.severity !== severityFilter) return false;

    // Result match
    if (resultFilter !== 'all' && log.result !== resultFilter) return false;

    // Search Keyword match
    if (searchKeyword.trim() !== '') {
      const kw = searchKeyword.toLowerCase();
      const matchName = log.actor.name.toLowerCase().includes(kw);
      const matchAction = log.action.label.toLowerCase().includes(kw);
      const matchTarget = log.target.title.toLowerCase().includes(kw);
      const matchId = log.id.toLowerCase().includes(kw);
      if (!matchName && !matchAction && !matchTarget && !matchId) return false;
    }

    return true;
  });
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER & TOP TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span>Nhật ký Hoạt động Kiểm toán (Activity Audit Logs)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ghi vết vĩnh viễn mọi thao tác phân quyền, thay đổi cấu hình, xuất bản và đăng nhập nhạy cảm.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenExportDrawer}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Tạo Báo cáo Export</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        {/* SEARCH & CONTROLS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo Tên Actor, ID Sự kiện, Tên bài viết hoặc Hành động..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="today">Thời gian: Hôm nay</option>
              <option value="7days">Thời gian: 7 Ngày gần đây</option>
              <option value="30days">Thời gian: 30 Ngày gần đây</option>
              <option value="all">Thời gian: Tất cả lịch sử</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="all">Mức độ: Tất cả</option>
              <option value="critical">Critical (Nghiêm trọng)</option>
              <option value="high">High (Cao)</option>
              <option value="medium">Medium (Trung bình)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="all">Kết quả: Tất cả</option>
              <option value="success">Success (Thành công)</option>
              <option value="denied">Denied / Failed (Bị chặn)</option>
            </select>
          </div>
        </div>

        {/* CATEGORY TAB CHIPS */}
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
          <CmsTabs
            ariaLabel="Phân loại nhật ký kiểm toán"
            value={activeCategory}
            onChange={(cat) => setActiveCategory(cat as AuditCategory)}
            items={[
              { id: 'all', label: 'Tất cả hoạt động', count: logs.length },
              { id: 'sensitive', label: 'Hoạt động nhạy cảm', count: logs.filter((l) => l.action.isSensitive).length, icon: Lock },
              { id: 'permissions_users', label: 'Quyền & Người dùng' },
              { id: 'config_publish', label: 'Cấu hình & Xuất bản' },
              { id: 'export_jobs', label: 'Export Jobs' },
            ]}
          />
        </div>

      </div>

      {/* AUDIT LOGS DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Đối tượng Tác động</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Kết quả</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy nhật ký hoạt động phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 shrink-0">
                      {log.timestamp}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <div>{log.actor.name}</div>
                      <span className="font-mono text-[10px] text-slate-400 block font-normal">
                        {log.actor.ipAddress} • {log.actor.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {log.action.label}
                        </span>
                        {log.action.isSensitive && (
                          <span title="Thao tác nhạy cảm">
                            <Lock className="w-3 h-3 text-red-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 block">
                        [{log.action.code}]
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      <div className="truncate max-w-[200px]" title={log.target.title}>
                        {log.target.title}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Module: {log.target.module}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-bold">
                      {log.scope.siteName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${
                          log.result === 'success'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 border border-red-500/20'
                        }`}
                      >
                        {log.result}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <CmsIconButton
                        onClick={() => onOpenEventDetail(log)}
                        icon={<Eye />}
                        size="sm"
                        className="ml-auto"
                        aria-label="Xem chi tiết hoạt động"
                        title="Xem chi tiết hoạt động"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={filteredLogs.length} itemLabel="hoạt động" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
      </div>
    </div>
  );
};

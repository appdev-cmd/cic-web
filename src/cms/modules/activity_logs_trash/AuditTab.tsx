import React, { useEffect, useRef, useState } from 'react';
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
import { AuditEvent, AuditCategory, AuditListQuery, AuditResult, AuditSeverity } from './types';
import { CmsIconButton } from '../../components/ui/CmsButton';
import { CmsPagination } from '../../components/ui/CmsPagination';
import { CmsTabs } from '../../components/ui/CmsTabs';

interface AuditTabProps {
  logs: AuditEvent[];
  onOpenEventDetail: (event: AuditEvent) => void;
  onOpenExportDrawer: () => void;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  onLoadPage: (query: AuditListQuery) => Promise<void>;
}

export const AuditTab: React.FC<AuditTabProps> = ({
  logs,
  onOpenEventDetail,
  onOpenExportDrawer,
  totalCount,
  isLoading,
  error,
  onLoadPage,
}) => {
  const [activeCategory, setActiveCategory] = useState<AuditCategory>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all'>('30days');
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | 'all'>('all');
  const [resultFilter, setResultFilter] = useState<AuditResult | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const timer = window.setTimeout(() => {
      void onLoadPage({ page: currentPage, pageSize, search: searchKeyword, date: dateFilter, severity: severityFilter, result: resultFilter, category: activeCategory });
    }, searchKeyword ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [activeCategory, currentPage, dateFilter, onLoadPage, pageSize, resultFilter, searchKeyword, severityFilter]);

  const resetPage = () => setCurrentPage(1);

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
            Ghi vết bất biến các thao tác phân quyền, thay đổi cấu hình, xuất bản và đăng nhập nhạy cảm.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <button
            onClick={onOpenExportDrawer}
            className="min-h-11 w-full md:w-auto px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
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
          <div className="md:col-span-5 relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); resetPage(); }}
              placeholder="Tìm theo Tên Actor, ID Sự kiện, Tên bài viết hoặc Hành động..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value as typeof dateFilter); resetPage(); }}
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
              onChange={(e) => { setSeverityFilter(e.target.value as AuditSeverity | 'all'); resetPage(); }}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="all">Mức độ: Tất cả</option>
              <option value="low">Low (Thấp)</option>
              <option value="critical">Critical (Nghiêm trọng)</option>
              <option value="high">High (Cao)</option>
              <option value="medium">Medium (Trung bình)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={resultFilter}
              onChange={(e) => { setResultFilter(e.target.value as AuditResult | 'all'); resetPage(); }}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <option value="all">Kết quả: Tất cả</option>
              <option value="success">Success (Thành công)</option>
              <option value="failed">Failed (Thất bại)</option>
              <option value="partial">Partial (Một phần)</option>
              <option value="denied">Denied (Bị chặn)</option>
            </select>
          </div>
        </div>

        {/* CATEGORY TAB CHIPS */}
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
          <CmsTabs
            ariaLabel="Phân loại nhật ký kiểm toán"
            value={activeCategory}
            onChange={(cat) => { setActiveCategory(cat as AuditCategory); resetPage(); }}
            items={[
              { id: 'all', label: 'Tất cả hoạt động', count: activeCategory === 'all' ? totalCount : undefined },
              { id: 'sensitive', label: 'Hoạt động nhạy cảm', icon: Lock },
              { id: 'permissions_users', label: 'Quyền & Người dùng' },
              { id: 'config_publish', label: 'Cấu hình & Xuất bản' },
              { id: 'export_jobs', label: 'Export Jobs' },
            ]}
          />
        </div>

      </div>

      {/* AUDIT LOGS DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {error && <div role="alert" className="border-b border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error} Thay đổi bộ lọc hoặc thử lại.</div>}
        <div aria-live="polite" className="sr-only">{isLoading ? 'Đang tải nhật ký hoạt động' : `Đã tải ${logs.length} bản ghi`}</div>
        <div className="overflow-x-auto overscroll-x-contain" tabIndex={0} aria-label="Bảng nhật ký hoạt động, có thể cuộn ngang trên màn hình hẹp">
          <table className={`cms-data-table min-w-[68rem] text-left transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`} aria-busy={isLoading}>
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
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy nhật ký hoạt động phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
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
        <CmsPagination currentPage={currentPage} pageSize={pageSize} totalCount={totalCount} itemLabel="hoạt động" onPageChange={setCurrentPage} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} />
      </div>
    </div>
  );
};

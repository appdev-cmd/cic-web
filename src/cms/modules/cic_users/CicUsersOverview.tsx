import React from 'react';
import { Lock, RefreshCw, Search, Trash2, Unlock, UserX } from 'lucide-react';
import type { AgencyOption, RoleOption, UserAccountStatus } from './types';
import { CmsBulkActionBar } from '../../components/ui/CmsBulkActionBar';
import { CmsIconButton } from '../../components/ui/CmsButton';

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  deactivated: number;
  pending: number;
  online: number;
}

interface CicUsersOverviewProps {
  stats: UserStats;
  searchQuery: string;
  statusFilter: 'all' | UserAccountStatus;
  roleFilter: string;
  agencyFilter: string;
  roles: RoleOption[];
  agencies: AgencyOption[];
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
  canEdit: boolean;
  canDelete: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: 'all' | UserAccountStatus) => void;
  onRoleFilterChange: (value: string) => void;
  onAgencyFilterChange: (value: string) => void;
  onRefresh: () => void;
  onClearSelection: () => void;
  onBatchStatusChange: (status: UserAccountStatus) => void;
  onBatchDelete: () => void;
}

export function CicUsersOverview({
  stats,
  searchQuery,
  statusFilter,
  roleFilter,
  agencyFilter,
  roles,
  agencies,
  filteredCount,
  totalCount,
  selectedCount,
  canEdit,
  canDelete,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onAgencyFilterChange,
  onRefresh,
  onClearSelection,
  onBatchStatusChange,
  onBatchDelete,
}: CicUsersOverviewProps) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Tổng tài khoản" value={stats.total} tone="slate" />
        <StatCard label="Đang hoạt động" value={stats.active} tone="emerald" />
        <StatCard label="Tạm khóa" value={stats.suspended} tone="amber" />
        <StatCard label="Đã khóa" value={stats.deactivated} tone="muted" />
        <StatCard label="Chờ kích hoạt" value={stats.pending} tone="blue" />
        <StatCard label="Trực tuyến" value={stats.online} tone="teal" online />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo Username, Họ tên, Email, SĐT..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full min-h-11 pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-base sm:text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="md:col-span-2">
            <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value as 'all' | UserAccountStatus)} className="w-full min-h-11 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-base sm:text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động (Active)</option>
              <option value="suspended">Tạm khóa (Suspended)</option>
              <option value="deactivated">Đã khóa (Deactivated)</option>
              <option value="pending_invite">Chờ kích hoạt</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select value={roleFilter} onChange={(event) => onRoleFilterChange(event.target.value)} className="w-full min-h-11 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-base sm:text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer">
              <option value="all">Tất cả vai trò (Roles)</option>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <select value={agencyFilter} onChange={(event) => onAgencyFilterChange(event.target.value)} className="w-full min-h-11 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-base sm:text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer">
              <option value="all">Tất cả chi nhánh</option>
              {agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-1 flex justify-end [&>button]:min-h-11 [&>button]:min-w-11">
            <CmsIconButton onClick={onRefresh} aria-label="Làm mới danh sách" title="Làm mới danh sách" icon={<RefreshCw />} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
            <span>Hiển thị: <strong>{filteredCount}</strong> / {totalCount} tài khoản</span>
          </div>
        </div>
        {(canEdit || canDelete) && (
          <CmsBulkActionBar
            selectedCount={selectedCount}
            itemLabel="tài khoản"
            onClear={onClearSelection}
            actions={[
              ...(canEdit ? [
                { label: 'Kích hoạt', onClick: () => onBatchStatusChange('active'), icon: Unlock, variant: 'primary' as const },
                { label: 'Tạm khóa', onClick: () => onBatchStatusChange('suspended'), icon: Lock },
                { label: 'Ngừng sử dụng', onClick: () => onBatchStatusChange('deactivated'), icon: UserX, variant: 'danger' as const },
              ] : []),
              ...(canDelete ? [{ label: 'Chuyển vào Thùng rác', onClick: onBatchDelete, icon: Trash2, variant: 'danger' as const }] : []),
            ]}
          />
        )}
      </div>
    </>
  );
}

const statToneClasses = {
  slate: ['border-slate-200 dark:border-slate-800', 'text-slate-400', 'text-slate-900 dark:text-white'],
  emerald: ['border-emerald-200 dark:border-emerald-950', 'text-emerald-600 dark:text-emerald-400', 'text-emerald-700 dark:text-emerald-300'],
  amber: ['border-amber-200 dark:border-amber-950', 'text-amber-600 dark:text-amber-400', 'text-amber-700 dark:text-amber-300'],
  muted: ['border-slate-200 dark:border-slate-800', 'text-slate-500 dark:text-slate-400', 'text-slate-700 dark:text-slate-300'],
  blue: ['border-blue-200 dark:border-blue-950', 'text-blue-600 dark:text-blue-400', 'text-blue-700 dark:text-blue-300'],
  teal: ['border-teal-200 dark:border-teal-950', 'text-teal-600 dark:text-teal-400', 'text-teal-700 dark:text-teal-300'],
} as const;

function StatCard({ label, value, tone, online = false }: { label: string; value: number; tone: keyof typeof statToneClasses; online?: boolean }) {
  const [borderClass, labelClass, valueClass] = statToneClasses[tone];
  return (
    <div className={`bg-white dark:bg-slate-900 border ${borderClass} rounded-2xl p-4 shadow-2xs space-y-1`}>
      <div className={`text-[11px] font-bold ${labelClass} uppercase tracking-wider`}>{label}</div>
      <div className={`text-xl font-extrabold ${valueClass} font-mono${online ? ' flex items-center gap-2' : ''}`}>
        {online ? <><span>{value}</span><span className="w-2 h-2 rounded-full bg-teal-500 animate-ping motion-reduce:animate-none" /></> : value}
      </div>
    </div>
  );
}

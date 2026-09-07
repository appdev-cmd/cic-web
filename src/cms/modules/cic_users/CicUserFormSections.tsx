import React from 'react';
import { Building, CheckCircle2, Clock, History, Shield, Sparkles } from 'lucide-react';
import type { AgencyOption, CicUser, RoleOption } from './types';

export interface EffectiveAccessRow {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export function UserRolesAndScopesSection({ roles, roleId, onRoleChange, agencies, selectedAgencies, onAgenciesChange }: {
  roles: RoleOption[];
  roleId: string;
  onRoleChange: (roleId: string) => void;
  agencies: AgencyOption[];
  selectedAgencies: string[];
  onAgenciesChange: (agencyIds: string[]) => void;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Chọn Vai trò Quản trị (Role Assignment)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles.map((role) => {
            const isSelected = roleId === role.id;
            return (
              <label key={role.id} className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${isSelected ? 'bg-white dark:bg-slate-900 border-2 border-orange-500 shadow-md shadow-orange-500/10' : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}>
                <input type="radio" name="primary_role" value={role.id} checked={isSelected} onChange={() => onRoleChange(role.id)} className="sr-only" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${role.badge_color}`}>{role.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{role.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Permissions count</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{role.permissions_count} quyền</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
      <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
          <Building className="w-4 h-4" />
          <span>Phạm vi Đơn vị / Chi nhánh (Agencies Scope)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {agencies.map((agency) => {
            const isChecked = selectedAgencies.includes(agency.id);
            return (
              <label key={agency.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-white dark:bg-slate-900 border-orange-500 shadow-xs' : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center gap-2.5">
                  <input type="checkbox" checked={isChecked} onChange={() => onAgenciesChange(isChecked ? selectedAgencies.filter((id) => id !== agency.id) : [...selectedAgencies, agency.id])} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 cursor-pointer" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{agency.name}</span>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px] font-bold rounded">{agency.code}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function UserEffectiveAccessSection({ currentRole, selectedAgencies, agencies, rows }: {
  currentRole?: RoleOption;
  selectedAgencies: string[];
  agencies: AgencyOption[];
  rows: EffectiveAccessRow[];
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-orange-900 dark:text-orange-300">Tóm tắt Quyền hạn Hiệu lực (Effective Access)</div>
          <p className="text-orange-700 dark:text-orange-400">Bảng tóm tắt quyền được suy ra từ vai trò <strong>{currentRole?.name}</strong> và phạm vi phụ trách. Quyền trực tiếp legacy không còn được chỉnh sửa tại giao diện.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="text-[11px] font-bold uppercase text-slate-400">Vai trò chính</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><Shield className="w-4 h-4 text-orange-600" /><span>{currentRole?.name}</span></div>
          <p className="text-xs text-slate-500">{currentRole?.description}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <div className="text-[11px] font-bold uppercase text-slate-400">Số đơn vị quản lý</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><Building className="w-4 h-4 text-blue-600" /><span>{selectedAgencies.length} Chi nhánh / HQ</span></div>
          <div className="flex flex-wrap gap-1">
            {selectedAgencies.map((id) => <span key={id} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded">{agencies.find((agency) => agency.id === id)?.code || id}</span>)}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">Ma trận phân quyền chi tiết theo module CMS</div>
        <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {rows.map((row) => (
            <div key={row.module} className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 break-words">{row.module}</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {([['view', 'Xem'], ['create', 'Thêm'], ['edit', 'Sửa'], ['delete', 'Xóa']] as const).map(([key, label]) => <span key={key} className={`px-2 py-0.5 rounded text-[10px] font-bold ${row[key] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{label}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UserSecuritySection({ user }: { user: CicUser }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SecurityMetric label="Xác thực 2 yếu tố (2FA)"><span className="text-xs font-bold text-slate-500">Chưa tích hợp</span></SecurityMetric>
        <SecurityMetric label="Đổi mật khẩu lần cuối"><div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{user.passwordChangedAt || 'Chưa cập nhật'}</div></SecurityMetric>
        <SecurityMetric label="Số lượt đăng nhập thành công"><div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{user.nums_visit || 0} lần</div></SecurityMetric>
      </div>
      {user.status_history && user.status_history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span>Lịch sử thay đổi trạng thái tài khoản (Status Audit Trail)</span></div>
          <div className="space-y-2 text-xs">
            {user.status_history.map((history) => <div key={history.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 [overflow-wrap:anywhere]">
              <div className="space-y-1"><div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><span>{history.previous_status}</span><span>→</span><span className="text-orange-600">{history.new_status}</span></div><p className="text-[11px] text-slate-500">Lý do: {history.reason}</p></div>
              <div className="sm:text-right text-[10px] text-slate-400 font-mono sm:shrink-0"><div>{history.timestamp}</div><div>Bởi: {history.changed_by}</div></div>
            </div>)}
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><History className="w-4 h-4 text-blue-500" /><span>Nhật ký bảo mật gần đây (Security Log)</span></div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {user.security_logs && user.security_logs.length > 0 ? user.security_logs.map((log) => <div key={log.id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 [overflow-wrap:anywhere]">
            <div className="min-w-0 space-y-0.5"><div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} /><span>{log.action}</span></div><div className="text-[11px] text-slate-400 font-mono">IP: {log.ip_address} | {log.user_agent || 'N/A'}</div></div>
            <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
          </div>) : <div className="p-4 text-center text-slate-400">Chưa có nhật ký hoạt động.</div>}
        </div>
      </div>
    </div>
  );
}

function SecurityMetric({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1"><div className="text-[11px] font-bold uppercase text-slate-400">{label}</div><div className="flex items-center justify-between pt-1">{children}</div></div>;
}

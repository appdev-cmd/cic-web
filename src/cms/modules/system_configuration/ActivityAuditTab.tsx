import React from 'react';
import { History, Shield, Key, FileCheck, Save, Send, Globe } from 'lucide-react';
import { ConfigActivityLog, ConfigScope } from './types';

interface ActivityAuditTabProps {
  logs: ConfigActivityLog[];
  scopes: ConfigScope[];
}

export const ActivityAuditTab: React.FC<ActivityAuditTabProps> = ({ logs, scopes }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          <span>Nhật ký Hoạt động Cấu hình & Bảo mật (Configuration Activity Audit Log)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ghi nhận thời gian thực mọi hành động thao tác cấu hình, xoay mật khẩu secret và xuất bản phiên bản. Mọi secret value đều bị che khuất tuân thủ chuẩn ISO 27001.
        </p>
      </div>

      {/* TABLE OF AUDIT LOGS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Tài khoản (Actor)</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Phạm vi Scope</th>
                <th className="py-3 px-4">Nội dung Thao tác</th>
                <th className="py-3 px-4">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 shrink-0">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {log.actor}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        log.action === 'secret_rotated'
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                          : log.action === 'publish_version'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : log.action === 'save_draft'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {log.scopeName}
                  </td>

                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                    {log.details}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, History, User, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { MenuActivityLog } from './types';

interface MenuActivityLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: MenuActivityLog[];
}

export const MenuActivityLogDrawer: React.FC<MenuActivityLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Nhật ký Tác động & Kiểm vết</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ghi lại mọi thay đổi cấu trúc, di chuyển mục, kiểm tra và xuất bản menu.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={log.user_avatar}
                    alt={log.user_name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{log.user_name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{log.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono uppercase">
                  {log.action_type}
                </span>
                <span>• Ghi log tự động theo chuẩn ISO 27001</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

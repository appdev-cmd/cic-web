import React, { useState } from 'react';
import { X, History, User, Clock, CheckCircle, AlertCircle, FileText, Send, Sparkles } from 'lucide-react';
import { EventItem, EventActivityLog, EditorialStatus, EventProgressStatus } from './types';

interface EventActivityLogDrawerProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onAddLog?: (log: Partial<EventActivityLog>) => void;
}

export const EventActivityLogDrawer: React.FC<EventActivityLogDrawerProps> = ({
  isOpen,
  event,
  onClose,
  onAddLog,
}) => {
  const [newNote, setNewNote] = useState('');

  if (!isOpen || !event) return null;

  const logs = event.activity_logs || [
    {
      id: 'default_log_1',
      user: event.created_by || 'Admin',
      role: 'Editor',
      action: 'Khởi tạo sự kiện',
      previous_editorial_status: 'draft',
      new_editorial_status: event.editorial_status || 'published',
      timestamp: event.created_time || 'Vừa xong',
      note: 'Dữ liệu sự kiện được đồng bộ lên hệ thống CMS.',
    },
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    if (onAddLog) {
      onAddLog({
        user: 'Quản trị viên (Hiện tại)',
        role: 'Content Manager',
        action: 'Ghi chú biên tập',
        previous_editorial_status: event.editorial_status,
        new_editorial_status: event.editorial_status,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        note: newNote,
      });
    }
    setNewNote('');
  };

  const getStatusBadge = (status?: EditorialStatus) => {
    if (!status) return null;
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold text-[10px] rounded">Xuất bản</span>;
      case 'archived':
        return <span className="px-2 py-0.5 bg-slate-500/10 text-slate-600 font-bold text-[10px] rounded">Lưu trữ</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] rounded">Bản nháp</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-500/10 text-orange-600 rounded-xl">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Nhật ký Biên tập & Thay đổi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[240px]">
                  {event.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timeline Content List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-8 space-y-1">
                  {/* Timeline Node Icon */}
                  <div className="absolute left-2 top-1 w-3.5 h-3.5 rounded-full bg-orange-600 border-2 border-white dark:border-slate-900 shadow-xs" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {log.user}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    {log.action}
                  </p>

                  {(log.previous_editorial_status || log.new_editorial_status) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
                      <span>Trạng thái:</span>
                      {getStatusBadge(log.previous_editorial_status)}
                      <span>→</span>
                      {getStatusBadge(log.new_editorial_status)}
                    </div>
                  )}

                  {log.note && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 italic mt-1">
                      "{log.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Drawer Footer Add Note Form */}
          <form onSubmit={handleAddNote} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Thêm ghi chú biên tập mới
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Nhập phản hồi, lý do duyệt hoặc ghi chú..."
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="p-2 bg-orange-600 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

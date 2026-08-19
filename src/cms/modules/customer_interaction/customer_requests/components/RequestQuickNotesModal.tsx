import React, { useState } from 'react';
import { MessageSquare, X, Send, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { CustomerRequest } from '../types';

interface RequestQuickNotesModalProps {
  isOpen: boolean;
  request: CustomerRequest | null;
  onClose: () => void;
  onAddNote: (requestId: string, content: string) => void;
}

export const RequestQuickNotesModal: React.FC<RequestQuickNotesModalProps> = ({
  isOpen,
  request,
  onClose,
  onAddNote,
}) => {
  const [noteContent, setNoteContent] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onAddNote(request.id, noteContent.trim());
    setNoteContent('');
  };

  const getCustomerName = (): string => {
    const nameField = request.submissionValues.find(
      (v) => v.fieldKey === 'full_name' || v.fieldType === 'text'
    );
    return nameField?.valueText || 'Khách hàng';
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ghi chú nội bộ ({request.internalNotes?.length || 0})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {getCustomerName()} · <span className="font-mono font-semibold">#{request.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Timeline */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Notes History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Lịch sử trao đổi / ghi chú
            </h4>

            {(!request.internalNotes || request.internalNotes.length === 0) ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 opacity-60" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Chưa có ghi chú nội bộ nào
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Nhập ghi chú bên dưới để ghi lại tiến độ liên hệ hoặc trao đổi với khách
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {request.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[10px]">
                          {note.createdByName ? note.createdByName.charAt(0) : 'U'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {note.createdByName || 'Người dùng'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap pl-7 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form add note */}
          <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Thêm ghi chú mới
            </label>
            <textarea
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="VD: Đã liên hệ qua điện thoại, khách hẹn gửi file dự toán qua Zalo để kiểm tra..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={!noteContent.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Lưu ghi chú</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

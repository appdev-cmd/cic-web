import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Globe,
  ExternalLink,
  Send,
  Tag,
  History,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MessageSquare,
  Smartphone,
  Laptop,
  UserCheck,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { CustomerRequest } from '../types';
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS, REQUEST_STATUSES } from '../../shared/constants/statusTypes';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../shared/constants/statusTypes';

interface RequestDetailModalProps {
  isOpen: boolean;
  request: CustomerRequest | null;
  onClose: () => void;
  onAssignUser: (requestId: string, userId: string) => void;
  onUpdateStatus: (requestId: string, newStatus: string) => void;
  onAddNote: (requestId: string, noteContent: string) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  isOpen,
  request,
  onClose,
  onAssignUser,
  onUpdateStatus,
  onAddNote,
}) => {
  const [noteInput, setNoteInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const getFieldValue = (keys: string[]): string => {
    const found = request.submissionValues.find((v) =>
      keys.includes(v.fieldKey.toLowerCase()) || keys.includes(v.fieldType)
    );
    return found?.valueText || '';
  };

  const getCustomerName = (): string => {
    return getFieldValue(['full_name', 'name', 'ho_ten', 'text']) || 'Khách hàng ẩn danh';
  };

  const getCustomerEmail = (): string => {
    return getFieldValue(['email']);
  };

  const getCustomerPhone = (): string => {
    return getFieldValue(['phone', 'sdt', 'dien_thoai']);
  };

  const getCustomerCompany = (): string => {
    return getFieldValue(['company', 'cong_ty', 'doanh_nghiep']);
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

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(request.id, noteInput.trim());
    setNoteInput('');
  };

  const customerName = getCustomerName();
  const customerEmail = getCustomerEmail();
  const customerPhone = getCustomerPhone();
  const customerCompany = getCustomerCompany();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-orange-600/20">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {customerName}
                </h3>
                <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                  #{request.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gửi lúc {formatDate(request.sourceConfig.submittedAt)} từ {request.sourceConfig.formName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={request.status}
              onChange={(e) => onUpdateStatus(request.id, e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
            >
              {REQUEST_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Quick Contact & Status Pill Row */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {customerPhone && (
                <a
                  href={`tel:${customerPhone}`}
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{customerPhone}</span>
                </a>
              )}
              {customerEmail && (
                <a
                  href={`mailto:${customerEmail}`}
                  className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{customerEmail}</span>
                </a>
              )}
              {customerCompany && (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{customerCompany}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full font-bold border ${
                  REQUEST_STATUS_COLORS[request.status as keyof typeof REQUEST_STATUS_COLORS]
                }`}
              >
                {REQUEST_STATUS_LABELS[request.status]}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full font-bold border ${
                  PRIORITY_COLORS[request.priority as keyof typeof PRIORITY_COLORS]
                }`}
              >
                Ưu tiên: {PRIORITY_LABELS[request.priority]}
              </span>
            </div>
          </div>

          {/* Submitted Form Values */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Nội dung gửi từ Biểu mẫu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {request.submissionValues.map((field) => (
                <div
                  key={field.fieldKey}
                  className={`p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1 ${
                    field.fieldType === 'textarea' ? 'md:col-span-2' : ''
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {field.fieldLabel}
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {field.valueText || field.valueJson?.toString() || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ghi chú nội bộ ({request.internalNotes.length})
            </h4>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Thêm ghi chú xử lý..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={!noteInput.trim()}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                Gửi
              </button>
            </form>

            <div className="space-y-2">
              {request.internalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>{note.createdByName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

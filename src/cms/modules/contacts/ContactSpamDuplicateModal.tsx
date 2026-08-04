import React, { useState } from 'react';
import { ShieldAlert, Copy, X, AlertTriangle } from 'lucide-react';
import { ContactRequest } from './types';

interface ContactSpamDuplicateModalProps {
  isOpen: boolean;
  type: 'spam' | 'duplicate';
  contact: ContactRequest | null;
  allContacts: ContactRequest[];
  onClose: () => void;
  onConfirmSpam: (reason: string) => void;
  onConfirmDuplicate: (originalId: string, reason: string) => void;
}

export const ContactSpamDuplicateModal: React.FC<ContactSpamDuplicateModalProps> = ({
  isOpen,
  type,
  contact,
  allContacts,
  onClose,
  onConfirmSpam,
  onConfirmDuplicate,
}) => {
  const [reason, setReason] = useState<string>('');
  const [originalId, setOriginalId] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !contact) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'spam') {
      if (!reason.trim()) {
        setError('Vui lòng nhập lý do phân loại Spam / Rác.');
        return;
      }
      onConfirmSpam(reason);
    } else {
      if (!originalId) {
        setError('Vui lòng chọn bản ghi yêu cầu gốc bị trùng lặp.');
        return;
      }
      onConfirmDuplicate(originalId, reason);
    }

    setReason('');
    setOriginalId('');
    onClose();
  };

  const potentialDuplicates = allContacts.filter((c) => c.id !== contact.id && c.status !== 'spam' && c.status !== 'duplicate');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${type === 'spam' ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600' : 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600'}`}>
              {type === 'spam' ? <ShieldAlert className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {type === 'spam' ? 'Đánh dấu Yêu cầu Spam / Rác' : 'Đánh dấu Yêu cầu Trùng lặp (Duplicate)'}
              </h3>
              <p className="text-xs text-slate-500">Bản ghi: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{contact.id}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">{contact.sender_name} ({contact.sender_email})</div>
            <div className="text-slate-600 dark:text-slate-400 truncate">{contact.request_subject}</div>
          </div>

          {type === 'duplicate' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Chọn yêu cầu gốc bị trùng <span className="text-rose-500">*</span>
              </label>
              <select
                value={originalId}
                onChange={(e) => setOriginalId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Chọn bản ghi gốc --</option>
                {potentialDuplicates.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.id}] {item.sender_name} - {item.request_subject.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {type === 'spam' ? 'Lý do xác nhận Spam' : 'Ghi chú trùng lặp'} {type === 'spam' && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={type === 'spam' ? 'Ví dụ: Thư rác quảng cáo dịch vụ Crypto/SEO bot nước ngoài...' : 'Ghi chú thêm nếu có...'}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                type === 'spam' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {type === 'spam' ? <ShieldAlert className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{type === 'spam' ? 'Đánh dấu Spam' : 'Liên kết trùng lặp'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UserCheck, X, AlertCircle } from 'lucide-react';
import { ContactRequest, StaffMember } from './types';
import { MOCK_STAFF_MEMBERS } from './mockData';

interface ContactReassignModalProps {
  isOpen: boolean;
  contact: ContactRequest | null;
  onClose: () => void;
  onConfirmReassign: (targetStaff: StaffMember, reason: string) => void;
}

export const ContactReassignModal: React.FC<ContactReassignModalProps> = ({
  isOpen,
  contact,
  onClose,
  onConfirmReassign,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !contact) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Vui lòng chọn nhân sự phụ trách mới.');
      return;
    }
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do chuyển giao công việc.');
      return;
    }
    const staff = MOCK_STAFF_MEMBERS.find((s) => s.id === selectedStaffId);
    if (staff) {
      onConfirmReassign(staff, reason);
      setSelectedStaffId('');
      setReason('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/50 text-orange-600 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Chuyển giao người phụ trách (Reassign)
              </h3>
              <p className="text-xs text-slate-500">Mã yêu cầu: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{contact.id}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Chịu trách nhiệm hiện tại
            </label>
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{contact.owner_name ? `${contact.owner_name} (${contact.assigned_team || 'Team'})` : 'Chưa phân công (Unassigned)'}</span>
              <span className="text-[11px] text-slate-400">Owner cũ</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Chọn nhân sự phụ trách mới <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {MOCK_STAFF_MEMBERS.map((staff) => (
                <label
                  key={staff.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedStaffId === staff.id
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-orange-950 dark:text-orange-100 font-medium'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="reassign_staff"
                      value={staff.id}
                      checked={selectedStaffId === staff.id}
                      onChange={() => setSelectedStaffId(staff.id)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <img src={staff.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{staff.name}</div>
                      <div className="text-[11px] text-slate-400">{staff.team} • {staff.email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Đang xử lý: {staff.active_cases_count} việc
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Lý do chuyển giao công việc <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ví dụ: Khách hàng thuộc khu vực miền Nam, chuyển cho Sales Structural phụ trách chuyên sâu..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Xác nhận chuyển giao</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

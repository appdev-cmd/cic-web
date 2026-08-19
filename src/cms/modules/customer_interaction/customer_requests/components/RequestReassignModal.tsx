import React, { useState } from 'react';
import { UserCheck, X, AlertCircle, Users, Check, Shield, Search } from 'lucide-react';
import { CustomerRequest } from '../types';
import { StaffMember } from '../../../contacts/types';
import { MOCK_STAFF_MEMBERS } from '../../../contacts/mockData';

interface RequestReassignModalProps {
  isOpen: boolean;
  requests: CustomerRequest[];
  onClose: () => void;
  onConfirmReassign: (requestIds: string[], targetStaff: StaffMember, reason: string) => void;
}

export const RequestReassignModal: React.FC<RequestReassignModalProps> = ({
  isOpen,
  requests,
  onClose,
  onConfirmReassign,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || requests.length === 0) return null;

  const isBulk = requests.length > 1;
  const singleRequest = !isBulk ? requests[0] : null;

  const filteredStaff = MOCK_STAFF_MEMBERS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Vui lòng chọn nhân sự phụ trách mới.');
      return;
    }
    const staff = MOCK_STAFF_MEMBERS.find((member) => member.id === selectedStaffId);
    if (staff) {
      onConfirmReassign(
        requests.map((r) => r.id),
        staff,
        reason.trim()
      );
      setSelectedStaffId('');
      setReason('');
      setSearchQuery('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBulk ? `Gán người phụ trách (${requests.length} yêu cầu)` : 'Gán người phụ trách'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBulk ? (
                  <span>Áp dụng cho các yêu cầu đã chọn</span>
                ) : (
                  <span>
                    Mã yêu cầu: <strong className="font-mono text-slate-800 dark:text-slate-200">{singleRequest?.id}</strong>
                  </span>
                )}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {!isBulk && singleRequest && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Người phụ trách hiện tại
              </label>
              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold">
                  {singleRequest.assignedUserName ? singleRequest.assignedUserName : 'Chưa phân công (Unassigned)'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {singleRequest.assignedUserName ? 'Hiện tại' : 'Trống'}
                </span>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Chọn nhân sự phụ trách mới <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{filteredStaff.length} nhân sự</span>
            </div>

            {/* Quick Search */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân sự theo tên, email, phòng ban..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredStaff.map((staff) => (
                <label
                  key={staff.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedStaffId === staff.id
                      ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 font-medium ring-1 ring-orange-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="staffSelection"
                      value={staff.id}
                      checked={selectedStaffId === staff.id}
                      onChange={() => {
                        setSelectedStaffId(staff.id);
                        setError('');
                      }}
                      className="text-orange-600 focus:ring-orange-500 h-4 w-4"
                    />
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{staff.name}</span>
                        {staff.role === 'manager' && (
                          <Shield className="w-3 h-3 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{staff.team}</span>
                        <span>•</span>
                        <span className="font-mono">{staff.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      {staff.active_cases_count} việc
                    </span>
                  </div>
                </label>
              ))}

              {filteredStaff.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  Không tìm thấy nhân sự phù hợp
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Ghi chú / Lý do chuyển giao công việc
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Chuyển giao theo khu vực địa lý / Nhân sự chuyên trách giải pháp CAD-BIM..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Xác nhận phân công</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

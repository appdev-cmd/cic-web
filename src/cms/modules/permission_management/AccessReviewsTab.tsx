import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Search,
  UserCheck,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { AccessReview } from './types';

interface AccessReviewsTabProps {
  reviews: AccessReview[];
  onConfirmReview: (reviewId: string) => void;
  onRevokeReview: (reviewId: string) => void;
}

export const AccessReviewsTab: React.FC<AccessReviewsTabProps> = ({
  reviews,
  onConfirmReview,
  onRevokeReview,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'revoked'>('pending');

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Chiến dịch Rà soát Định kỳ Quyền hạn (Access Review Campaign)
            </h3>
            <p className="text-xs text-slate-500">
              Xác nhận định kỳ sự phù hợp của vai trò & phân quyền cấp cho tài khoản nhân sự.
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Chờ rà soát ({reviews.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'confirmed'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Đã xác nhận ({reviews.filter((r) => r.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Tất cả ({reviews.length})
          </button>
        </div>
      </div>

      {/* REVIEWS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cms-data-table text-left font-medium">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-3">Vai trò Rà soát</th>
                <th className="p-3">Tài khoản Nhân sự</th>
                <th className="p-3">Người Rà soát (Reviewer)</th>
                <th className="p-3">Hạn chót (Due Date)</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3">Ghi chú Rà soát</th>
                <th className="p-3 text-right pr-5">Hành động Rà soát</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không có lượt rà soát nào ở trạng thái đã chọn.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Role Name */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{rev.roleName}</div>
                    </td>

                    {/* Target User */}
                    <td className="p-3">
                      <div className="font-bold text-orange-600 dark:text-orange-400">{rev.targetUserName}</div>
                    </td>

                    {/* Reviewer */}
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{rev.reviewer}</td>

                    {/* Due Date */}
                    <td className="p-3 font-mono text-[11px] text-slate-500">{rev.dueDate}</td>

                    {/* Status */}
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                            : rev.status === 'revoked'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        }`}
                      >
                        {rev.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">{rev.notes}</td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-5 whitespace-nowrap">
                      {rev.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onConfirmReview(rev.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Xác nhận Giữ quyền</span>
                          </button>
                          <button
                            onClick={() => onRevokeReview(rev.id)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Thu hồi Quyền</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Đã hoàn tất</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

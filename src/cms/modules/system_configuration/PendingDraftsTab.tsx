import React, { useState } from 'react';
import {
  Clock,
  GitCompare,
  CheckCircle2,
  XCircle,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ConfigDraft, ConfigScope } from './types';

interface PendingDraftsTabProps {
  drafts: ConfigDraft[];
  scopes: ConfigScope[];
  onOpenCompare: (draft: ConfigDraft) => void;
  onApproveDraft: (draftId: string) => void;
  onReturnDraft: (draftId: string, notes: string) => void;
  onPublishDraft: (draft: ConfigDraft) => void;
}

export const PendingDraftsTab: React.FC<PendingDraftsTabProps> = ({
  drafts,
  scopes,
  onOpenCompare,
  onApproveDraft,
  onReturnDraft,
  onPublishDraft,
}) => {
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [returnNotes, setReturnNotes] = useState('');

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <span>Hàng chờ Duyệt & Xuất bản Bản nháp Cấu hình (Pending Drafts Workflow)</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Mọi thay đổi cấu hình phải được Review trước khi thực thi Xuất bản Nguyên khối (Atomic Publish) lên hệ thống Production.
        </p>
      </div>

      {/* DRAFTS LIST */}
      <div className="space-y-4">
        {drafts.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
            Hiện không có bản nháp cấu hình nào đang chờ duyệt.
          </div>
        ) : (
          drafts.map((draft) => {
            const scope = scopes.find((s) => s.id === draft.scopeId);

            return (
              <div
                key={draft.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
              >
                {/* DRAFT HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {draft.scopeName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {draft.versionNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          draft.status === 'pending_review'
                            ? 'bg-blue-500/10 text-blue-600'
                            : draft.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {draft.status === 'pending_review' ? 'Chờ Review' : draft.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Tạo bởi <strong>{draft.createdBy}</strong> vào lúc {draft.createdAt} • Thay đổi{' '}
                      <strong>{draft.changedCount}</strong> trường cấu hình
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCompare(draft)}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <GitCompare className="w-4 h-4 text-blue-500" />
                    <span>Xem So sánh Diff</span>
                  </button>
                </div>

                {/* CHANGES SUMMARY TABLE */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Chi tiết danh sách trường thay đổi trong Bản nháp này:
                  </div>

                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold text-[11px]">
                          <th className="py-2 px-3">Tên trường</th>
                          <th className="py-2 px-3">Giá trị Cũ (Live)</th>
                          <th className="py-2 px-3 text-emerald-600">Giá trị Mới (Draft)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {draft.changesSummary.map((ch, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">
                              {ch.label}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-400 line-through">
                              {String(ch.oldValue)}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {String(ch.newValue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* REVIEW ACTIONS */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-slate-500">
                    * Bấm Xuất bản Nguyên khối (Atomic Publish) để áp dụng ngay lên Production.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReturnId(draft.id)}
                      className="px-3.5 py-1.5 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 dark:border-red-900/40 cursor-pointer"
                    >
                      Trả về Yêu cầu Sửa
                    </button>

                    <button
                      onClick={() => onPublishDraft(draft)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Xuất bản Ngay (Atomic Publish)</span>
                    </button>
                  </div>
                </div>

                {/* RETURN NOTES BOX */}
                {selectedReturnId === draft.id && (
                  <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-red-700 dark:text-red-300">
                      Nhập ghi chú yêu cầu chỉnh sửa gửi cho Translator / Editor:
                    </div>
                    <textarea
                      rows={2}
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="VD: Kiểm tra lại tên website chưa đúng chuẩn nhận diện thương hiệu..."
                      className="w-full p-2 bg-white dark:bg-slate-800 rounded-lg border border-red-200 dark:border-red-900/50 text-xs focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedReturnId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => {
                          onReturnDraft(draft.id, returnNotes);
                          setSelectedReturnId(null);
                          setReturnNotes('');
                        }}
                        className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg"
                      >
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

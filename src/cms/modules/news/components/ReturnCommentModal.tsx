import React, { useState } from 'react';
import { RotateCcw, X, MessageSquare, AlertCircle } from 'lucide-react';

interface ReturnCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  articleTitle?: string;
}

export const ReturnCommentModal: React.FC<ReturnCommentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  articleTitle,
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Vui lòng nhập lý do/ghi chú trả lại bài viết.');
      return;
    }
    setError('');
    onConfirm(comment.trim());
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Trả lại bài viết cho tác giả
            </h3>
            {articleTitle && (
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 line-clamp-1">
                "{articleTitle}"
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bài viết sẽ được chuyển về trạng thái <strong>Bị trả lại (Returned)</strong>. Tác giả sẽ nhận được thông báo kèm lý do này.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>Nội dung phản hồi / Yêu cầu chỉnh sửa <span className="text-red-500">*</span></span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError('');
              }}
              rows={4}
              placeholder="Ví dụ: Cần bổ sung thêm hình ảnh minh họa cho mục 2, kiểm tra lại thông số TCVN và rút ngắn tiêu đề dưới 70 ký tự..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
            {error && (
              <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xác nhận trả bài</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

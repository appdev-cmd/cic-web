import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Tag,
} from 'lucide-react';
import type { UploadFileItem } from './types';

interface UploadQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: UploadFileItem[];
  onRemoveFromQueue: (id: string) => void;
  onCompleteUpload: (queueItems: UploadFileItem[]) => void;
  onRetryAi?: (itemId: string) => void;
}

export const UploadQueueDrawer: React.FC<UploadQueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  onRemoveFromQueue,
  onCompleteUpload,
  onRetryAi,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen || queue.length === 0) return null;

  const completedCount = queue.filter((q) => q.status === 'completed').length;
  const isAllDone = completedCount === queue.length;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 w-auto max-w-lg bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 sm:left-auto sm:right-6 sm:w-full">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold">
            <UploadCloud className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold">
              Hàng chờ tải lên ({completedCount}/{queue.length} tệp)
            </h4>
            <p className="text-[10px] text-slate-400">Tải lên độc lập & Tự động xử lý AI metadata</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex min-h-11 min-w-11 items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label={isMinimized ? 'Mở rộng hàng chờ tải lên' : 'Thu gọn hàng chờ tải lên'}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Đóng hàng chờ tải lên"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Minimizable Body */}
      {!isMinimized && (
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex flex-col gap-2.5"
            >
              {/* File Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <ImageIcon className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-200 truncate">{item.file_name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {(item.file_size_kb / 1024).toFixed(1)} MB
                </span>
              </div>

              {/* Upload Progress Bar */}
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              {/* Status and Action Row */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                {item.status === 'completed' ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu tệp vào kho
                  </span>
                ) : item.status === 'uploading' ? (
                  <span className="text-orange-400">Đang tải lên... {item.progress}%</span>
                ) : item.status === 'error' ? (
                  <span className="text-rose-300" role="alert">{item.error_message || 'Tải lên thất bại'}</span>
                ) : (
                  <span className="text-amber-400">Đang chuẩn bị...</span>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveFromQueue(item.id)}
                  className="min-h-8 px-2 text-xs text-slate-400 hover:text-rose-300 transition-colors"
                >
                  Xóa
                </button>
              </div>

              {/* AI Metadata Sub-status (when upload completed) */}
              {item.status === 'completed' && item.mime_type.startsWith('image/') && (
                <div className="pt-2 border-t border-slate-700/60">
                  {item.ai_status === 'processing' && (
                    <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-950/30 border border-amber-900/50 px-2.5 py-1.5 rounded-lg">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                      <span>✦ AI đang phân tích ảnh & điền Tiêu đề, Alt Text chuẩn SEO...</span>
                    </div>
                  )}

                  {item.ai_status === 'completed' && (
                    <div className="space-y-1.5 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg text-[11px]">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✦ AI đã điền metadata hoàn tất</span>
                      </div>
                      {item.ai_result?.title && (
                        <p className="text-slate-300 text-[10px] truncate">
                          <strong className="text-slate-400 font-normal">Tiêu đề:</strong> {item.ai_result.title}
                        </p>
                      )}
                      {item.ai_result?.alt_text && (
                        <p className="text-slate-400 text-[10px] line-clamp-1">
                          <strong className="font-normal">Alt:</strong> {item.ai_result.alt_text}
                        </p>
                      )}
                      {item.ai_result?.tags && item.ai_result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.ai_result.tags.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] text-slate-300">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {item.ai_status === 'error' && (
                    <div className="flex items-center justify-between gap-2 bg-rose-950/30 border border-rose-900/50 p-2 rounded-lg text-[11px]">
                      <div className="flex items-center gap-1.5 text-rose-300 truncate">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Lỗi AI: {item.ai_error || 'Timeout/Quota'} (Tệp đã lưu an toàn)</span>
                      </div>
                      {onRetryAi && (
                        <button
                          type="button"
                          onClick={() => onRetryAi(item.id)}
                          className="px-2 py-0.5 rounded bg-rose-800/60 hover:bg-rose-700 text-white font-bold text-[10px] shrink-0 transition-colors"
                        >
                          Thử lại AI
                        </button>
                      )}
                    </div>
                  )}

                  {item.ai_status === 'skipped' && (
                    <div className="text-[10px] text-slate-400 italic">
                      Đã giữ nguyên metadata bạn nhập (không ghi đè).
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isAllDone && (
            <div className="pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => onCompleteUpload(queue)}
                className="min-h-11 w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                Hoàn tất & Đóng hàng chờ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Folder,
  Tag,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { UploadFileItem } from './types';

interface UploadQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: UploadFileItem[];
  onRemoveFromQueue: (id: string) => void;
  onCompleteUpload: (queueItems: UploadFileItem[]) => void;
}

export const UploadQueueDrawer: React.FC<UploadQueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  onRemoveFromQueue,
  onCompleteUpload,
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
            <p className="text-[10px] text-slate-400">Preflight check & Metadata processing</p>
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
              className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <ImageIcon className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-200 truncate">{item.file_name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {(item.file_size_kb / 1024).toFixed(1)} MB
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                {item.status === 'completed' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Đã tải lên & sẵn sàng
                  </span>
                ) : item.status === 'uploading' ? (
                  <span className="text-orange-400">Đang tải lên... {item.progress}%</span>
                ) : item.status === 'error' ? (
                  <span className="text-rose-300" role="alert">{item.error_message || 'Tải lên thất bại'}</span>
                ) : (
                  <span className="text-amber-400">Đang xử lý preflight check...</span>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveFromQueue(item.id)}
                  className="min-h-11 px-2 text-slate-400 hover:text-rose-300"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          {isAllDone && (
            <button
              type="button"
              onClick={() => onCompleteUpload(queue)}
              className="min-h-11 w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Hoàn tất & Chèn vào Thư viện
            </button>
          )}
        </div>
      )}
    </div>
  );
};

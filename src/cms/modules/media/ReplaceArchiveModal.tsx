import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  UploadCloud,
  Check,
  Layers,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { MediaAsset } from './types';

interface ReplaceArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MediaAsset | null;
  onConfirmReplace: (asset: MediaAsset, newFileNote: string) => void;
}

export const ReplaceArchiveModal: React.FC<ReplaceArchiveModalProps> = ({
  isOpen,
  onClose,
  asset,
  onConfirmReplace,
}) => {
  const [note, setNote] = useState('');

  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Xác Nhận Thay Thế Tệp Gốc (Replace Global Asset)
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Tác động đến {asset.used_by_count} vị trí tham chiếu trên website
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-amber-700 hover:text-amber-950 dark:text-amber-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-3">
            <img src={asset.thumbnail_url || asset.url} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{asset.title}</p>
              <p className="text-[11px] text-slate-400 font-mono">{asset.filename}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Chọn tệp mới để thay thế
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Kéo thả file mới vào đây hoặc bấm để chọn tệp
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Giữ nguyên ID asset & tạo tự động phiên bản v{(asset.versions.length + 1.1).toFixed(1)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ghi chú lý do thay thế tệp
            </label>
            <input
              type="text"
              placeholder="VD: Cập nhật hình ảnh chất lượng cao hơn, đổi màu nhận diện..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReplace(asset, note);
              onClose();
            }}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Tiến Hành Thay Thế Global
          </button>
        </div>
      </div>
    </div>
  );
};

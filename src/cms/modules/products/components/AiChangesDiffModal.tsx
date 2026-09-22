import React from 'react';
import { X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { CmsButton } from '@/shared/ui/cms/CmsButton';
import type { FieldChangeItem } from '@/features/ai-operator/types';

interface AiChangesDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  changes: FieldChangeItem[];
  onRevertField: (fieldName: string) => void;
  onRevertAll: () => void;
}

const GROUP_TITLES: Record<string, string> = {
  normalization: '1. Chuẩn hóa Định danh & Đường dẫn',
  classification: '2. Phân loại & Hãng sản xuất',
  content: '3. Nội dung Biên tập',
  seo: '4. Cấu hình Thẻ SEO',
  relations: '5. Liên kết & Sản phẩm liên quan',
};

const ORIGIN_LABELS: Record<string, { label: string; className: string }> = {
  verified: {
    label: 'Xác thực từ DB/Input',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  },
  generated: {
    label: 'AI Biên soạn',
    className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
  },
  suggested: {
    label: 'AI Đề xuất (Cần duyệt)',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  },
  missing: {
    label: 'Chưa có dữ liệu',
    className: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  },
};

export const AiChangesDiffModal: React.FC<AiChangesDiffModalProps> = ({
  isOpen,
  onClose,
  changes,
  onRevertField,
  onRevertAll,
}) => {
  if (!isOpen) return null;

  const grouped = changes.reduce<Record<string, FieldChangeItem[]>>((acc, item) => {
    const grp = item.group || 'content';
    if (!acc[grp]) acc[grp] = [];
    acc[grp].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Chi tiết thay đổi do AI thực hiện ({changes.length} trường)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minh bạch nguồn gốc, cho phép kiểm tra và hoàn tác từng trường
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          {Object.entries(grouped).map(([groupKey, items]) => (
            <div key={groupKey} className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {GROUP_TITLES[groupKey] || groupKey}
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                {items.map((item) => {
                  const originMeta = ORIGIN_LABELS[item.origin] || ORIGIN_LABELS.generated;
                  return (
                    <div
                      key={item.field}
                      className="p-3 flex items-start justify-between gap-3 hover:bg-white dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.label}
                          </span>
                          <span
                            className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold border ${originMeta.className}`}
                          >
                            {originMeta.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800 truncate max-w-lg">
                          {typeof item.newValue === 'object'
                            ? JSON.stringify(item.newValue)
                            : String(item.newValue || '—')}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRevertField(item.field)}
                        className="shrink-0 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-[11px] font-medium"
                        title="Hoàn tác trường này"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Hoàn tác</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onRevertAll}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hoàn tác toàn bộ thay đổi</span>
          </button>
          <CmsButton variant="primary" size="sm" onClick={onClose} leadingIcon={<Check className="w-3.5 h-3.5" />}>
            Đóng & Giữ các thay đổi
          </CmsButton>
        </div>
      </div>
    </div>
  );
};

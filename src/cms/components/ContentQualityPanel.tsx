import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

export interface QualityCheckItem {
  label: string;
  passed: boolean;
  required?: boolean;
  group?: 'content' | 'classification' | 'seo' | 'relations' | 'media' | 'business';
  fieldKey?: string;
}

const GROUP_LABELS: Record<string, string> = {
  content: 'Nội dung',
  classification: 'Phân loại',
  seo: 'SEO & Chuẩn hóa',
  relations: 'Liên kết',
  media: 'Hình ảnh & Tài nguyên',
  business: 'Thông tin kinh doanh',
};

interface ContentQualityPanelProps {
  title?: string;
  checks: QualityCheckItem[];
  onFieldFocus?: (fieldKey: string) => void;
}

export const ContentQualityPanel: React.FC<ContentQualityPanelProps> = ({
  title = 'Trạng thái nội dung',
  checks,
  onFieldFocus,
}) => {
  const requiredFailed = checks.filter((item) => item.required !== false && !item.passed).length;
  const optionalFailed = checks.filter((item) => item.required === false && !item.passed).length;
  const isReady = requiredFailed === 0;

  // Group checks
  const groupedChecks = checks.reduce<Record<string, QualityCheckItem[]>>((acc, item) => {
    const groupKey = item.group || 'general';
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header with Actionable Status */}
      <div className="border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              isReady
                ? optionalFailed === 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
            }`}
          >
            {isReady ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{optionalFailed === 0 ? 'Sẵn sàng xuất bản' : `Khuyến nghị +${optionalFailed} mục`}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-rose-500" />
                <span>Còn {requiredFailed} mục bắt buộc</span>
              </>
            )}
          </span>
        </div>

        {!isReady && (
          <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            Cần hoàn thành {requiredFailed} mục bắt buộc trước khi lưu xuất bản.
          </p>
        )}
      </div>

      {/* Grouped checks list */}
      <div className="divide-y divide-slate-100 p-2 dark:divide-slate-800/60">
        {Object.entries(groupedChecks).map(([groupKey, items]) => {
          const groupTitle = GROUP_LABELS[groupKey] || '';
          return (
            <div key={groupKey} className="py-2 first:pt-1 last:pb-1">
              {groupTitle && (
                <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {groupTitle}
                </div>
              )}
              <div className="space-y-1">
                {items.map((item, idx) => {
                  const isInteractive = Boolean(item.fieldKey && onFieldFocus && !item.passed);
                  return (
                    <div
                      key={item.label + idx}
                      onClick={() => {
                        if (isInteractive && item.fieldKey && onFieldFocus) {
                          onFieldFocus(item.fieldKey);
                        }
                      }}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                        item.passed
                          ? 'bg-slate-50/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                          : item.required !== false
                          ? 'bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300 font-medium'
                          : 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300'
                      } ${isInteractive ? 'cursor-pointer hover:bg-rose-100/70 dark:hover:bg-rose-900/40 group' : ''}`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {item.passed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        ) : item.required !== false ? (
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        )}
                        <span className="truncate">{item.label}</span>
                      </div>

                      {isInteractive && (
                        <span className="flex items-center text-[10px] text-rose-500 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0 font-semibold">
                          <span>Xử lý</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

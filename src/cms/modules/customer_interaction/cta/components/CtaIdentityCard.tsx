import React from 'react';
import { MousePointer2, Copy } from 'lucide-react';
import { CtaFormData } from '../types';

interface CtaIdentityCardProps {
  formData: CtaFormData;
  setFormData: React.Dispatch<React.SetStateAction<CtaFormData>>;
  onAdminNameChange: (value: string) => void;
  onCopyCode: () => void;
  copiedCode: boolean;
}

export const CtaIdentityCard: React.FC<CtaIdentityCardProps> = ({
  formData,
  setFormData,
  onAdminNameChange,
  onCopyCode,
  copiedCode,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <MousePointer2 className="w-4 h-4 text-orange-500" />
          Thông tin định danh CTA
        </h2>
        <span className="text-xs text-slate-400">Bắt buộc (*Check)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Tên quản trị <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.adminName}
            onChange={(e) => onAdminNameChange(e.target.value)}
            placeholder="Ví dụ: CTA - Tư vấn giải pháp ERP"
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Tên hiển thị trong CMS giúp phân biệt nội bộ.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Mã định danh (Code) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              placeholder="cta_tuvan_erp"
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={onCopyCode}
              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              title="Sao chép shortcode"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>
              Dùng nhúng shortcode: <code className="font-mono text-orange-600 dark:text-orange-400">{`{{cta:${formData.code || 'code'}}}`}</code>
            </span>
            {copiedCode && <span className="text-emerald-600 font-semibold">Đã chép!</span>}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Mô tả nội bộ
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Mô tả mục đích sử dụng, phạm vi hiển thị hoặc chiến dịch tiếp thị liên quan..."
          rows={2}
          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs resize-none"
        />
      </div>
    </div>
  );
};

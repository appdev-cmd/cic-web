import React from 'react';
import { FileText, Copy } from 'lucide-react';
import { FormFormData } from '../../types';
import { FORM_STATUSES, FormStatus } from '../../../shared/constants/statusTypes';

interface FormBasicSettingsTabProps {
  formData: FormFormData;
  setFormData: React.Dispatch<React.SetStateAction<FormFormData>>;
  onAdminNameChange: (value: string) => void;
  onCopyShortcode: () => void;
  copiedCode: boolean;
}

export const FormBasicSettingsTab: React.FC<FormBasicSettingsTabProps> = ({
  formData,
  setFormData,
  onAdminNameChange,
  onCopyShortcode,
  copiedCode,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs max-w-3xl space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-orange-500" />
        Cấu hình thông tin cơ bản Biểu mẫu
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Tên quản trị nội bộ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.adminName}
            onChange={(e) => onAdminNameChange(e.target.value)}
            placeholder="Ví dụ: Biểu mẫu - Đăng ký Tư vấn ERP"
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Tiêu đề hiển thị trên Website <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Ví dụ: Đăng ký nhận tư vấn giải pháp ERP"
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Mô tả / Lời dẫn biểu mẫu
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Vui lòng để lại thông tin để chuyên viên tư vấn CIC liên hệ hỗ trợ bạn nhanh nhất."
            rows={3}
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Mã định danh (Form Code) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={onCopyShortcode}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-orange-600 cursor-pointer"
                title="Sao chép shortcode"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>
                Nhúng shortcode: <code className="text-orange-600 font-mono">{`{{form:${formData.code || 'code'}}}`}</code>
              </span>
              {copiedCode && <span className="text-emerald-600 font-semibold">Đã chép!</span>}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Trạng thái biểu mẫu
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as FormStatus }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
            >
              {FORM_STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

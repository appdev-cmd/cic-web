import React from 'react';
import {
  Sparkles,
  MessageSquare,
  Download,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  ExternalLink,
  Send,
  MousePointer2,
} from 'lucide-react';
import { CtaFormData, CtaStyleVariant } from '../types';

interface CtaDisplayCardProps {
  formData: CtaFormData;
  setFormData: React.Dispatch<React.SetStateAction<CtaFormData>>;
  buttonSize: 'sm' | 'md' | 'lg';
  setButtonSize: (size: 'sm' | 'md' | 'lg') => void;
}

export const ICON_OPTIONS = [
  { value: '', label: 'Không dùng icon' },
  { value: 'MessageSquare', label: 'Tin nhắn (MessageSquare)', icon: MessageSquare },
  { value: 'Download', label: 'Tải xuống (Download)', icon: Download },
  { value: 'Phone', label: 'Điện thoại (Phone)', icon: Phone },
  { value: 'Mail', label: 'Thư điện tử (Mail)', icon: Mail },
  { value: 'FileText', label: 'Tài liệu (FileText)', icon: FileText },
  { value: 'ArrowRight', label: 'Mũi tên (ArrowRight)', icon: ArrowRight },
  { value: 'ExternalLink', label: 'Mở trang ngoài (ExternalLink)', icon: ExternalLink },
  { value: 'Sparkles', label: 'Nổi bật (Sparkles)', icon: Sparkles },
  { value: 'Send', label: 'Gửi đi (Send)', icon: Send },
  { value: 'MousePointer2', label: 'Con trỏ (MousePointer2)', icon: MousePointer2 },
];

export const CtaDisplayCard: React.FC<CtaDisplayCardProps> = ({
  formData,
  setFormData,
  buttonSize,
  setButtonSize,
}) => {
  const buttonVariant = formData.styleVariant;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          Nội dung & Kiểu hiển thị nút trên Website
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Nội dung hiển thị trên web <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.displayText}
            onChange={(e) => setFormData((prev) => ({ ...prev, displayText: e.target.value }))}
            placeholder="Ví dụ: Nhận tư vấn ngay"
            maxLength={100}
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold"
          />
          <p className="text-[11px] text-slate-400 mt-1">{formData.displayText.length}/100 ký tự</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Icon đính kèm
          </label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs cursor-pointer font-medium"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Styling Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Biến thể kiểu dáng (Variant)
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'primary', label: 'Primary (Cam)' },
              { id: 'secondary', label: 'Dark / Grey' },
              { id: 'outline', label: 'Outline' },
              { id: 'gradient', label: 'Gradient' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setFormData((current) => ({ ...current, styleVariant: v.id as CtaStyleVariant }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  buttonVariant === v.id
                    ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Kích thước nút (Size)
          </label>
          <div className="flex items-center gap-2">
            {[
              { id: 'sm', label: 'Nhỏ (Small)' },
              { id: 'md', label: 'Vừa (Medium)' },
              { id: 'lg', label: 'Lớn (Large)' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setButtonSize(s.id as 'sm' | 'md' | 'lg')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  buttonSize === s.id
                    ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

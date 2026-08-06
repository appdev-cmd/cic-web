import React, { useState } from 'react';
import { X, Eye, Monitor, Smartphone, CheckCircle2, FileText } from 'lucide-react';
import { FormItem } from '../types';

interface FormPreviewModalProps {
  isOpen: boolean;
  form: FormItem | null;
  onClose: () => void;
}

export const FormPreviewModal: React.FC<FormPreviewModalProps> = ({
  isOpen,
  form,
  onClose,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Xem trước Biểu mẫu (Live Form Preview)
            </h3>
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg ml-2">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`p-1 rounded ${device === 'desktop' ? 'bg-white dark:bg-slate-900 text-orange-600' : 'text-slate-400'}`}
                title="Giao diện Máy tính"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`p-1 rounded ${device === 'mobile' ? 'bg-white dark:bg-slate-900 text-orange-600' : 'text-slate-400'}`}
                title="Giao diện Điện thoại"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Canvas */}
        <div className="p-6 bg-slate-100 dark:bg-slate-950 flex-1 overflow-y-auto flex justify-center items-start">
          <div
            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-5 transition-all ${
              device === 'mobile' ? 'w-[340px]' : 'w-full max-w-lg'
            }`}
          >
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-in zoom-in-90" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Gửi thông tin thành công!
                </h4>
                <p className="text-xs text-slate-500">
                  {form.submitConfig.successMessage || 'Cảm ơn bạn đã liên hệ với chúng tôi.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-xs text-slate-500 mt-1">{form.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {form.fields.map((f) => (
                    <div key={f.id} className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {f.label} {f.isRequired && <span className="text-red-500">*</span>}
                      </label>
                      {f.fieldType === 'textarea' ? (
                        <textarea
                          placeholder={f.placeholder}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <input
                          type={f.fieldType === 'phone' ? 'tel' : f.fieldType === 'email' ? 'email' : 'text'}
                          placeholder={f.placeholder}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      )}
                      {f.helpText && <p className="text-[10px] text-slate-400">{f.helpText}</p>}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 mt-2 transition-all cursor-pointer"
                  >
                    Gửi thông tin ngay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

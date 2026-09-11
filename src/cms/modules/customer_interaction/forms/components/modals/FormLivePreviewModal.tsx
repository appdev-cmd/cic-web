import React, { useState } from 'react';
import { X, Monitor, Smartphone } from 'lucide-react';
import { FormFormData } from '../../types';

interface FormLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormFormData;
}

export const FormLivePreviewModal: React.FC<FormLivePreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              Xem trước Giao diện Biểu mẫu
            </span>
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1 rounded cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-white dark:bg-slate-900 text-orange-600' : 'text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1 rounded cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-white dark:bg-slate-900 text-orange-600' : 'text-slate-400'
                }`}
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

        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-5 transition-all ${
              previewDevice === 'mobile' ? 'w-[340px]' : 'w-full max-w-md'
            }`}
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {formData.title || 'Tiêu đề biểu mẫu'}
              </h3>
              {formData.description && (
                <p className="text-xs text-slate-500 mt-1">{formData.description}</p>
              )}
            </div>

            <div className="space-y-3">
              {formData.fields.map((f) => (
                <div key={f.id} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {f.label} {f.isRequired && <span className="text-red-500">*</span>}
                  </label>
                  {f.fieldType === 'textarea' ? (
                    <textarea
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  ) : (
                    <input
                      type={f.fieldType === 'phone' ? 'tel' : f.fieldType === 'email' ? 'email' : 'text'}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  )}
                  {f.helpText && <p className="text-[10px] text-slate-400">{f.helpText}</p>}
                </div>
              ))}

              <button
                type="button"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 mt-2"
              >
                {formData.submitConfig.submitButtonText?.trim() || 'Gửi thông tin'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

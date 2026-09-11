import React from 'react';
import { X } from 'lucide-react';
import { EmailTemplate, SAMPLE_VALUES } from '../../../../email_templates/types';
import { CmsButton } from '../../../../../components/ui/CmsButton';

interface FormEmailPreviewModalProps {
  previewEmailTemplate: EmailTemplate | undefined;
  adminEmails: string[];
  onClose: () => void;
}

export const FormEmailPreviewModal: React.FC<FormEmailPreviewModalProps> = ({
  previewEmailTemplate,
  adminEmails,
  onClose,
}) => {
  if (!previewEmailTemplate) return null;

  const renderEmailSample = (value: string) =>
    (Object.entries(SAMPLE_VALUES) as [string, string][]).reduce(
      (text, [token, sample]) => text.split(token).join(sample),
      value
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-email-preview-title"
    >
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-orange-600">Xem trước bằng dữ liệu mẫu</p>
            <h2 id="form-email-preview-title" className="mt-1 text-base font-bold text-slate-900 dark:text-white">
              {renderEmailSample(previewEmailTemplate.subject)}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Tới:{' '}
              {previewEmailTemplate.audience === 'internal'
                ? adminEmails.join(', ') || 'Chưa nhập email quản trị'
                : 'Email người điền biểu mẫu (dữ liệu mẫu)'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Đóng xem trước email"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="whitespace-pre-wrap p-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
          {renderEmailSample(previewEmailTemplate.content)}
        </div>
        <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-800">
          <CmsButton type="button" onClick={onClose}>
            Đóng xem trước
          </CmsButton>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X } from 'lucide-react';
import { EmailTemplate, SAMPLE_VALUES } from '../../../email_templates/types';
import { CmsButton } from '../../../../components/ui/CmsButton';

interface CtaEmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmailTemplate: EmailTemplate | undefined;
  emailAddress: string;
}

export const CtaEmailPreviewModal: React.FC<CtaEmailPreviewModalProps> = ({
  isOpen,
  onClose,
  selectedEmailTemplate,
  emailAddress,
}) => {
  if (!isOpen || !selectedEmailTemplate) return null;

  const renderEmailSample = (value: string) =>
    Object.entries(SAMPLE_VALUES).reduce(
      (text, [token, sample]) => text.split(token).join(sample),
      value
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cta-email-preview-title"
    >
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-orange-600">Email sẽ được xem lại trước khi gửi</p>
            <h2 id="cta-email-preview-title" className="mt-1 text-base font-bold text-slate-900 dark:text-white">
              {renderEmailSample(selectedEmailTemplate.subject)}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Tới: {emailAddress || 'Chưa nhập địa chỉ nhận'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Đóng xem trước"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="whitespace-pre-wrap p-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
          {renderEmailSample(selectedEmailTemplate.content)}
        </div>
        <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-800">
          <CmsButton onClick={onClose}>Đóng xem trước</CmsButton>
        </div>
      </div>
    </div>
  );
};

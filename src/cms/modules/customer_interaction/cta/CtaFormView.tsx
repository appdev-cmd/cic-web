import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Play,
  AlertCircle,
} from 'lucide-react';
import { CtaItem, CtaFormData } from './types';
import { ActionType } from '../shared/constants/actionTypes';
import { generateCode } from '../shared/utils/validationHelpers';
import { CmsButton } from '../../../components/ui/CmsButton';
import { type EmailTemplate } from '../../email_templates/types';
import type { CmsLocale } from '../../../data/CmsDataSource';
import type { CtaDownloadFileOption } from '../../../data/CustomerInteractionDataSource';
import type { FormItem } from '../forms/types';

import { CtaIdentityCard } from './components/CtaIdentityCard';
import { CtaDisplayCard } from './components/CtaDisplayCard';
import { CtaActionConfigCard } from './components/CtaActionConfigCard';
import { CtaLivePreviewCard } from './components/CtaLivePreviewCard';
import { CtaAnalyticsSidebar } from './components/CtaAnalyticsSidebar';
import { CtaEmailPreviewModal } from './components/CtaEmailPreviewModal';

interface CtaFormViewProps {
  cta: CtaItem | null;
  workspaceLocale: CmsLocale;
  forms: FormItem[];
  emailTemplates: EmailTemplate[];
  downloadFiles: CtaDownloadFileOption[];
  onSave: (ctaData: CtaFormData, action: 'draft' | 'publish') => void;
  onCancel: () => void;
}

export const CtaFormView: React.FC<CtaFormViewProps> = ({
  cta,
  workspaceLocale,
  forms,
  emailTemplates,
  downloadFiles,
  onSave,
  onCancel,
}) => {
  const defaultFormId = forms.find((form) => form.status === 'active')?.id ?? '';
  const defaultDownloadFileId = downloadFiles[0]?.id ?? '';

  const [formData, setFormData] = useState<CtaFormData>({
    adminName: '',
    displayText: '',
    description: '',
    code: '',
    icon: 'MessageSquare',
    styleVariant: 'primary',
    actionConfig: {
      type: 'open_form',
      formId: defaultFormId,
    },
    status: 'draft',
  });

  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [saveError, setSaveError] = useState('');

  const selectedEmailTemplate = emailTemplates.find(
    (template) => template.id === formData.actionConfig.emailTemplateId
  );

  useEffect(() => {
    if (cta) {
      setFormData({
        adminName: cta.adminName,
        displayText: cta.displayText,
        description: cta.description || '',
        code: cta.code,
        icon: cta.icon || '',
        styleVariant: cta.styleVariant ?? 'primary',
        actionConfig: cta.actionConfig,
        status: cta.status,
      });
    } else {
      setFormData({
        adminName: '',
        displayText: '',
        description: '',
        code: '',
        icon: 'MessageSquare',
        styleVariant: 'primary',
        actionConfig: {
          type: 'open_form',
          formId: defaultFormId,
        },
        status: 'draft',
      });
    }
    window.scrollTo(0, 0);
  }, [cta, defaultFormId]);

  const handleAdminNameChange = (value: string) => {
    const newCode = cta ? formData.code : generateCode(value);
    setFormData((prev) => ({
      ...prev,
      adminName: value,
      code: newCode,
    }));
  };

  const handleActionTypeChange = (type: ActionType) => {
    setFormData((prev) => ({
      ...prev,
      actionConfig: {
        type,
        formId: type === 'open_form' ? defaultFormId : undefined,
        url: type === 'redirect_internal' ? '/lien-he' : type === 'redirect_external' ? 'https://' : undefined,
        openInNewTab: type === 'redirect_external',
        sectionId: type === 'scroll_to_section' ? 'section_contact' : undefined,
        fileId: type === 'download_file' ? defaultDownloadFileId : undefined,
        phoneNumber: type === 'call_phone' ? '024 3976 1381' : undefined,
        emailAddress: type === 'send_email' ? 'info@cic.com.vn' : undefined,
        emailTemplateId: type === 'send_email' ? '' : undefined,
        reviewBeforeSend: type === 'send_email' ? true : undefined,
      },
    }));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`{{cta:${formData.code || 'cta_code'}}}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = (action: 'draft' | 'publish') => {
    if (action === 'publish') {
      if (!formData.adminName.trim() || !formData.displayText.trim() || !formData.code.trim()) {
        setSaveError('Tên quản trị, nội dung hiển thị và mã CTA là bắt buộc trước khi xuất bản.');
        return;
      }
      const config = formData.actionConfig;
      const missingActionValue =
        (config.type === 'open_form' && !config.formId) ||
        ((config.type === 'redirect_internal' || config.type === 'redirect_external') && !config.url?.trim()) ||
        (config.type === 'scroll_to_section' && !config.sectionId?.trim()) ||
        (config.type === 'download_file' && !config.fileId) ||
        (config.type === 'call_phone' && !config.phoneNumber?.trim());
      if (missingActionValue) {
        setSaveError('Hãy điền đầy đủ cấu hình hành động trước khi xuất bản CTA.');
        return;
      }
    }
    if (action === 'publish' && formData.actionConfig.type === 'send_email') {
      if (!formData.actionConfig.emailAddress?.trim() || !formData.actionConfig.emailTemplateId) {
        setSaveError('CTA gửi email phải có địa chỉ nhận và mẫu email trước khi xuất bản.');
        return;
      }
      if (!selectedEmailTemplate || selectedEmailTemplate.status !== 'active') {
        setSaveError('Chỉ được xuất bản CTA khi mẫu email đã ở trạng thái Đang sử dụng.');
        return;
      }
      if (formData.actionConfig.reviewBeforeSend !== true) {
        setSaveError('CTA gửi email trực tiếp phải bật bước xem trước trước khi gửi.');
        return;
      }
    }
    setSaveError('');
    onSave(formData, action);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs sticky top-16 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                CTA
              </span>
              <span className="text-xs font-mono text-slate-400">
                {formData.code ? `code: ${formData.code}` : 'Tạo mới'}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {cta ? `Chỉnh sửa CTA: ${cta.adminName}` : 'Tạo nút CTA mới'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <CmsButton variant="secondary" size="sm" onClick={onCancel}>
            Hủy bỏ
          </CmsButton>
          <CmsButton
            variant="secondary"
            size="sm"
            onClick={() => handleSave('draft')}
            leadingIcon={<Save className="w-4 h-4 text-slate-500" />}
          >
            Lưu bản nháp
          </CmsButton>
          <CmsButton
            variant="primary"
            size="sm"
            onClick={() => handleSave('publish')}
            leadingIcon={<Play className="w-4 h-4" />}
          >
            Xuất bản ngay
          </CmsButton>
        </div>
      </div>

      {saveError && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="size-4" />
          {saveError}
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Form - 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <CtaIdentityCard
            formData={formData}
            setFormData={setFormData}
            onAdminNameChange={handleAdminNameChange}
            onCopyCode={handleCopyCode}
            copiedCode={copiedCode}
          />
          <CtaDisplayCard
            formData={formData}
            setFormData={setFormData}
            buttonSize={buttonSize}
            setButtonSize={setButtonSize}
          />
          <CtaActionConfigCard
            formData={formData}
            setFormData={setFormData}
            onActionTypeChange={handleActionTypeChange}
            forms={forms}
            emailTemplates={emailTemplates}
            downloadFiles={downloadFiles}
            workspaceLocale={workspaceLocale}
            onOpenEmailPreview={() => setIsEmailPreviewOpen(true)}
          />
        </div>

        {/* Right Column (Sidebar - 1 Col) */}
        <div className="space-y-6">
          <CtaLivePreviewCard formData={formData} buttonSize={buttonSize} />
          <CtaAnalyticsSidebar cta={cta} formData={formData} setFormData={setFormData} />
        </div>
      </div>

      {/* Email Preview Modal */}
      <CtaEmailPreviewModal
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        selectedEmailTemplate={selectedEmailTemplate}
        emailAddress={formData.actionConfig.emailAddress || ''}
      />
    </div>
  );
};

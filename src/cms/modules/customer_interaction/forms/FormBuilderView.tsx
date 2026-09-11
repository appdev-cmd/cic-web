import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Play,
  Eye,
  FileText,
  AlertCircle,
  Layers,
  Send,
  BarChart2,
} from 'lucide-react';
import { FormItem, FormFormData, FormField } from './types';
import { FieldType } from '../shared/constants/fieldTypes';
import { generateCode } from '../shared/utils/validationHelpers';
import { CmsButton } from '../../../components/ui/CmsButton';
import { type EmailTemplate } from '../../email_templates/types';
import type { CmsLocale } from '../../../data/CmsDataSource';

import { FormFieldPalette } from './components/builder/FormFieldPalette';
import { FormFieldCanvas } from './components/builder/FormFieldCanvas';
import { FormFieldInspector } from './components/builder/FormFieldInspector';
import { FormBasicSettingsTab } from './components/settings/FormBasicSettingsTab';
import { FormSubmitActionsTab } from './components/settings/FormSubmitActionsTab';
import { FormAnalyticsTab } from './components/settings/FormAnalyticsTab';
import { FormLivePreviewModal } from './components/modals/FormLivePreviewModal';
import { FormEmailPreviewModal } from './components/modals/FormEmailPreviewModal';

interface FormBuilderViewProps {
  form: FormItem | null;
  workspaceLocale: CmsLocale;
  emailTemplates: EmailTemplate[];
  onSave: (formData: FormFormData, action: 'draft' | 'publish') => void;
  onCancel: () => void;
}

export const FormBuilderView: React.FC<FormBuilderViewProps> = ({
  form,
  workspaceLocale,
  emailTemplates,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormFormData>({
    adminName: '',
    title: '',
    description: '',
    code: '',
    status: 'draft',
    fields: [],
    submitConfig: {
      saveToDatabase: true,
      createCustomerRequest: true,
      sendAdminEmail: true,
      adminEmails: ['sales@cic.com.vn', 'cskh@cic.com.vn'],
      sendConfirmationEmail: false,
      confirmationEmailTemplate: '',
      adminEmailTemplate: '',
      successMessage: 'Cảm ơn bạn đã gửi thông tin! Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.',
      submitButtonText: 'Gửi thông tin',
      redirectUrl: '',
      allowFileDownload: false,
      webhookUrl: '',
      crmSyncEnabled: false,
    },
  });

  const [activeTab, setActiveTab] = useState<'fields' | 'basic' | 'submit_actions' | 'analytics'>('fields');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewEmailTemplateId, setPreviewEmailTemplateId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');

  const previewEmailTemplate = emailTemplates.find((template) => template.id === previewEmailTemplateId);

  useEffect(() => {
    if (form) {
      setFormData({
        adminName: form.adminName,
        title: form.title,
        description: form.description || '',
        code: form.code,
        status: form.status,
        fields: form.fields,
        submitConfig: form.submitConfig,
      });
      if (form.fields.length > 0) {
        setSelectedFieldId(form.fields[0].id);
      }
    } else {
      const sampleFields: FormField[] = [
        {
          id: 'field_name',
          fieldKey: 'full_name',
          label: 'Họ và tên',
          fieldType: 'text',
          roleType: 'customer_name',
          placeholder: 'Nhập họ và tên...',
          helpText: '',
          validation: { required: true },
          position: 1,
          isRequired: true,
          isLocked: false,
        },
        {
          id: 'field_phone',
          fieldKey: 'phone',
          label: 'Số điện thoại',
          fieldType: 'phone',
          roleType: 'phone',
          placeholder: '0901234567',
          helpText: '',
          validation: { required: true },
          position: 2,
          isRequired: true,
          isLocked: false,
        },
        {
          id: 'field_email',
          fieldKey: 'email',
          label: 'Email liên hệ',
          fieldType: 'email',
          roleType: 'email',
          placeholder: 'nguyenvana@gmail.com',
          helpText: '',
          validation: { required: true },
          position: 3,
          isRequired: true,
          isLocked: false,
        },
        {
          id: 'field_note',
          fieldKey: 'message',
          label: 'Nhu cầu chi tiết',
          fieldType: 'textarea',
          roleType: 'message',
          placeholder: 'Mô tả nhu cầu tư vấn hoặc câu hỏi của bạn...',
          helpText: '',
          validation: { required: false },
          position: 4,
          isRequired: false,
          isLocked: false,
        },
      ];

      setFormData({
        adminName: '',
        title: '',
        description: '',
        code: '',
        status: 'draft',
        fields: sampleFields,
        submitConfig: {
          saveToDatabase: true,
          createCustomerRequest: true,
          sendAdminEmail: true,
          adminEmails: ['sales@cic.com.vn'],
          sendConfirmationEmail: false,
          confirmationEmailTemplate: '',
          successMessage: 'Cảm ơn bạn đã gửi thông tin thành công!',
          submitButtonText: 'Gửi thông tin',
          redirectUrl: '',
          allowFileDownload: false,
          webhookUrl: '',
          crmSyncEnabled: false,
        },
      });
      setSelectedFieldId('field_name');
    }
    window.scrollTo(0, 0);
  }, [form]);

  const handleAdminNameChange = (value: string) => {
    const newCode = form ? formData.code : generateCode(value);
    const newTitle = formData.title ? formData.title : value.replace(/^Biểu mẫu - /i, '');
    setFormData((prev) => ({
      ...prev,
      adminName: value,
      title: newTitle,
      code: newCode,
    }));
  };

  const handleSave = (action: 'draft' | 'publish') => {
    if (action === 'publish') {
      if (!formData.adminName.trim() || !formData.title.trim() || !formData.code.trim()) {
        setSaveError('Tên quản trị, tiêu đề và mã biểu mẫu là bắt buộc trước khi xuất bản.');
        return;
      }
      if (formData.fields.length === 0 || formData.fields.some((field) => !field.fieldKey.trim() || !field.label.trim())) {
        setSaveError('Biểu mẫu phải có ít nhất một trường và mỗi trường phải có mã cùng nhãn hiển thị.');
        return;
      }
      const keys = formData.fields.map((field) => field.fieldKey.trim().toLowerCase());
      const positions = formData.fields.map((field) => field.position);
      if (new Set(keys).size !== keys.length || new Set(positions).size !== positions.length) {
        setSaveError('Mã trường và thứ tự hiển thị không được trùng nhau.');
        return;
      }
      if (!formData.submitConfig.saveToDatabase || !formData.submitConfig.submitButtonText?.trim() || !formData.submitConfig.successMessage.trim()) {
        setSaveError('Cần lưu submission, có tên nút gửi và thông báo thành công trước khi xuất bản.');
        return;
      }
      const adminTemplate = emailTemplates.find((item) => item.id === formData.submitConfig.adminEmailTemplate);
      const customerTemplate = emailTemplates.find((item) => item.id === formData.submitConfig.confirmationEmailTemplate);
      if (formData.submitConfig.sendAdminEmail && (!formData.submitConfig.adminEmails.length || !adminTemplate || adminTemplate.status !== 'active')) {
        setSaveError('Email quản trị cần người nhận và một mẫu nội bộ đang sử dụng.');
        return;
      }
      if (formData.submitConfig.sendConfirmationEmail && (!customerTemplate || customerTemplate.status !== 'active')) {
        setSaveError('Email xác nhận cần một mẫu khách hàng đang sử dụng.');
        return;
      }
    }
    setSaveError('');
    onSave(formData, action);
  };

  const addField = (fieldType: FieldType) => {
    const fieldKey = `field_${Date.now().toString().slice(-4)}`;
    let defaultRole = 'other' as any;
    if (fieldType === 'text') defaultRole = 'other';
    if (fieldType === 'email') defaultRole = 'email';
    if (fieldType === 'phone') defaultRole = 'phone';
    if (fieldType === 'textarea') defaultRole = 'message';

    const newField: FormField = {
      id: `f_${Date.now()}`,
      fieldKey,
      label: 'Trường mới',
      fieldType,
      roleType: defaultRole,
      placeholder: `Nhập trường mới...`,
      helpText: '',
      validation: { required: false },
      position: formData.fields.length + 1,
      isRequired: false,
      isLocked: false,
      options: ['select', 'radio', 'checkbox'].includes(fieldType)
        ? [
            { value: 'opt_1', label: 'Tùy chọn 1', order: 1 },
            { value: 'opt_2', label: 'Tùy chọn 2', order: 2 },
          ]
        : undefined,
    };

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setSelectedFieldId(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    }));
  };

  const deleteField = (fieldId: string) => {
    const target = formData.fields.find((f) => f.id === fieldId);
    if (target?.isLocked) {
      alert('Trường này đã bị khóa vì có dữ liệu đã gửi từ trước.');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa trường dữ liệu này khỏi biểu mẫu?')) {
      const nextFields = formData.fields.filter((f) => f.id !== fieldId);
      setFormData((prev) => ({
        ...prev,
        fields: nextFields,
      }));
      if (selectedFieldId === fieldId) {
        setSelectedFieldId(nextFields.length > 0 ? nextFields[0].id : null);
      }
    }
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const index = formData.fields.findIndex((f) => f.id === fieldId);
    if (index < 0) return;

    const newFields = [...formData.fields];
    if (direction === 'up' && index > 0) {
      [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    }

    setFormData((prev) => ({
      ...prev,
      fields: newFields.map((f, i) => ({ ...f, position: i + 1 })),
    }));
  };

  const handleCopyShortcode = () => {
    navigator.clipboard.writeText(`{{form:${formData.code || 'form_code'}}}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const selectedField = formData.fields.find((f) => f.id === selectedFieldId);

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
                Biểu mẫu v{form?.currentVersion || 1}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {formData.code ? `code: ${formData.code}` : 'Tạo mới'}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {form ? `Chỉnh sửa biểu mẫu: ${form.title}` : 'Thiết kế biểu mẫu thu thập mới'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <CmsButton
            variant="secondary"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            leadingIcon={<Eye className="w-4 h-4 text-orange-500" />}
          >
            Xem trước
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
            Xuất bản phiên bản mới
          </CmsButton>
        </div>
      </div>

      {saveError && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="size-4" />
          {saveError}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-2xs">
        {[
          { id: 'fields' as const, label: 'Thành phần & Trường dữ liệu', icon: Layers },
          { id: 'basic' as const, label: 'Cấu hình thông tin', icon: FileText },
          { id: 'submit_actions' as const, label: 'Xử lý sau khi gửi & Email', icon: Send },
          { id: 'analytics' as const, label: 'Thống kê & Vị trí nhúng', icon: BarChart2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Form Builder Studio */}
      {activeTab === 'fields' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
          <FormFieldPalette onAddField={addField} />
          <FormFieldCanvas
            fields={formData.fields}
            selectedFieldId={selectedFieldId}
            onSelectField={(id) => setSelectedFieldId(id)}
            onMoveField={moveField}
            onDeleteField={deleteField}
          />
          <FormFieldInspector
            selectedField={selectedField}
            onUpdateField={updateField}
          />
        </div>
      )}

      {/* Tab 2: General Info Config */}
      {activeTab === 'basic' && (
        <FormBasicSettingsTab
          formData={formData}
          setFormData={setFormData}
          onAdminNameChange={handleAdminNameChange}
          onCopyShortcode={handleCopyShortcode}
          copiedCode={copiedCode}
        />
      )}

      {/* Tab 3: Submit Actions */}
      {activeTab === 'submit_actions' && (
        <FormSubmitActionsTab
          formData={formData}
          setFormData={setFormData}
          emailTemplates={emailTemplates}
          workspaceLocale={workspaceLocale}
          onPreviewEmailTemplate={(id) => setPreviewEmailTemplateId(id)}
        />
      )}

      {/* Tab 4: Analytics */}
      {activeTab === 'analytics' && <FormAnalyticsTab form={form} />}

      {/* Live Preview Modal */}
      <FormLivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
      />

      {/* Email Preview Modal */}
      <FormEmailPreviewModal
        previewEmailTemplate={previewEmailTemplate}
        adminEmails={formData.submitConfig.adminEmails || []}
        onClose={() => setPreviewEmailTemplateId(null)}
      />
    </div>
  );
};

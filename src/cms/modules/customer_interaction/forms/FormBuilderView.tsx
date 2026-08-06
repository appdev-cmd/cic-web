import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Play,
  Eye,
  Settings,
  FileText,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  Tag,
  Copy,
  Info,
  Send,
  Mail,
  ShieldCheck,
  Download,
  BarChart2,
  Lock,
  Layers,
  Sparkles,
  Smartphone,
  Monitor,
  X,
} from 'lucide-react';
import { FormItem, FormFormData, FormField, FieldOption } from './types';
import { FIELD_TYPES, FieldType, FIELD_ROLE_TYPES, FieldRoleType } from '../shared/constants/fieldTypes';
import { FORM_STATUSES, FormStatus } from '../shared/constants/statusTypes';
import { generateCode } from '../shared/utils/validationHelpers';
import { CmsButton } from '../../../components/ui/CmsButton';

interface FormBuilderViewProps {
  form: FormItem | null;
  onSave: (formData: FormFormData, action: 'draft' | 'submit' | 'publish') => void;
  onCancel: () => void;
}

export const FormBuilderView: React.FC<FormBuilderViewProps> = ({
  form,
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
      confirmationEmailTemplate: 'Cảm ơn quý khách đã gửi thông tin. Đội ngũ CIC sẽ liên hệ trong thời gian sớm nhất!',
      successMessage: 'Cảm ơn bạn đã gửi thông tin! Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.',
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
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

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
      // Default sample fields for new form
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
          confirmationEmailTemplate: 'Cảm ơn quý khách đã gửi thông tin.',
          successMessage: 'Cảm ơn bạn đã gửi thông tin thành công!',
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

  const addField = (fieldType: FieldType) => {
    const typeObj = FIELD_TYPES.find((ft) => ft.value === fieldType);
    const label = typeObj?.label || 'Trường mới';
    const fieldKey = `field_${Date.now().toString().slice(-4)}`;

    let defaultRole: FieldRoleType = 'other';
    if (fieldType === 'text') defaultRole = 'other';
    if (fieldType === 'email') defaultRole = 'email';
    if (fieldType === 'phone') defaultRole = 'phone';
    if (fieldType === 'textarea') defaultRole = 'message';

    const newField: FormField = {
      id: `f_${Date.now()}`,
      fieldKey,
      label,
      fieldType,
      roleType: defaultRole,
      placeholder: `Nhập ${label.toLowerCase()}...`,
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
            onClick={() => onSave(formData, 'draft')}
            leadingIcon={<Save className="w-4 h-4 text-slate-500" />}
          >
            Lưu bản nháp
          </CmsButton>
          <CmsButton
            variant="primary"
            size="sm"
            onClick={() => onSave(formData, 'publish')}
            leadingIcon={<Play className="w-4 h-4" />}
          >
            Xuất bản phiên bản mới
          </CmsButton>
        </div>
      </div>

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
          {/* Left Palette: Field Types (Col 3) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Thêm loại trường</span>
              <Plus className="w-3.5 h-3.5 text-orange-500" />
            </h3>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {FIELD_TYPES.map((ft) => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => addField(ft.value as FieldType)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover:text-orange-600 dark:group-hover:text-orange-400">
                      {ft.label}
                    </span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Middle Canvas: Fields Order List (Col 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                Danh sách trường ({formData.fields.length})
              </h3>
              <span className="text-[11px] text-slate-400">Kéo/Di chuyển thứ tự</span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar max-h-[500px] pr-1">
              {formData.fields.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Chưa có trường dữ liệu nào
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nhấn chọn các mục ở cột bên trái để thêm vào biểu mẫu.
                  </p>
                </div>
              ) : (
                formData.fields.map((field, idx) => {
                  const isSelected = selectedFieldId === field.id;
                  const roleObj = FIELD_ROLE_TYPES.find((r) => r.value === field.roleType);

                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col gap-0.5 pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(field.id, 'up');
                            }}
                            disabled={idx === 0}
                            className="p-0.5 text-slate-400 hover:text-orange-600 disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(field.id, 'down');
                            }}
                            disabled={idx === formData.fields.length - 1}
                            className="p-0.5 text-slate-400 hover:text-orange-600 disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Drag Handle Icon */}
                        <GripVertical className="w-4 h-4 text-slate-300 mt-1 shrink-0" />

                        {/* Field info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {field.label || 'Chưa đặt tiêu đề'}
                            </span>
                            {field.isRequired && <span className="text-red-500 font-bold">*</span>}
                            {field.isLocked && (
                              <span title="Đã khóa"><Lock className="w-3 h-3 text-amber-500" /></span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded-md">
                              {field.fieldKey}
                            </span>
                            {roleObj && (
                              <span className="text-[10px] font-semibold text-orange-700 bg-orange-100 dark:bg-orange-950 dark:text-orange-300 px-1.5 py-0.5 rounded-md">
                                {roleObj.label}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteField(field.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Xóa trường"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Inspector: Selected Field Property Editor (Col 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              Chỉnh sửa thuộc tính trường
            </h3>

            {selectedField ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nhãn hiển thị (Label) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mã trường (Field Key) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedField.fieldKey}
                    onChange={(e) => updateField(selectedField.id, { fieldKey: e.target.value })}
                    disabled={selectedField.isLocked}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                  />
                  {selectedField.isLocked && (
                    <p className="text-[10px] text-amber-600 mt-1">Mã trường đã bị khóa để bảo toàn dữ liệu cũ.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vai trò nhận diện khách hàng (Role Type)
                  </label>
                  <select
                    value={selectedField.roleType || 'other'}
                    onChange={(e) => updateField(selectedField.id, { roleType: e.target.value as FieldRoleType })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {FIELD_ROLE_TYPES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Gợi ý nhập (Placeholder)
                  </label>
                  <input
                    type="text"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ghi chú hướng dẫn (Help Text)
                  </label>
                  <input
                    type="text"
                    value={selectedField.helpText || ''}
                    onChange={(e) => updateField(selectedField.id, { helpText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedField.isRequired}
                      onChange={(e) =>
                        updateField(selectedField.id, {
                          isRequired: e.target.checked,
                          validation: { ...selectedField.validation, required: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    Bắt buộc nhập dữ liệu (*)
                  </label>
                </div>

                {/* Options Manager if field is select/radio/checkbox */}
                {['select', 'radio', 'checkbox'].includes(selectedField.fieldType) && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Danh sách Lựa chọn (Options)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentOpts = selectedField.options || [];
                          const newOpt: FieldOption = {
                            value: `opt_${Date.now()}`,
                            label: `Tùy chọn ${currentOpts.length + 1}`,
                            order: currentOpts.length + 1,
                          };
                          updateField(selectedField.id, { options: [...currentOpts, newOpt] });
                        }}
                        className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                      >
                        + Thêm lựa chọn
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(selectedField.options || []).map((opt, oIdx) => (
                        <div key={opt.value} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.label}
                            onChange={(e) => {
                              const updatedOpts = [...(selectedField.options || [])];
                              updatedOpts[oIdx] = { ...opt, label: e.target.value };
                              updateField(selectedField.id, { options: updatedOpts });
                            }}
                            className="flex-1 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedOpts = (selectedField.options || []).filter((_, i) => i !== oIdx);
                              updateField(selectedField.id, { options: updatedOpts });
                            }}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs">Chọn 1 trường ở giữa để chỉnh sửa thuộc tính.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: General Info Config */}
      {activeTab === 'basic' && (
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
                onChange={(e) => handleAdminNameChange(e.target.value)}
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShortcode}
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-orange-600 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Nhúng shortcode: <code className="text-orange-600 font-mono">{`{{form:${formData.code || 'code'}}}`}</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Trạng thái biểu mẫu
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as FormStatus })}
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
      )}

      {/* Tab 3: Submit Actions */}
      {activeTab === 'submit_actions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs max-w-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-orange-500" />
            Cấu hình Xử lý tự động sau khi khách hàng gửi biểu mẫu
          </h2>

          <div className="space-y-4">
            {/* Action Checkboxes */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.submitConfig.saveToDatabase}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitConfig: { ...formData.submitConfig, saveToDatabase: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Lưu vào CSDL hệ thống (Bắt buộc)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.submitConfig.createCustomerRequest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitConfig: { ...formData.submitConfig, createCustomerRequest: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tự động tạo bản ghi Yêu cầu khách hàng mới trong CMS
                </span>
              </label>
            </div>

            {/* Email Notification to Admin */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.submitConfig.sendAdminEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitConfig: { ...formData.submitConfig, sendAdminEmail: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-orange-500" />
                  Gửi Email thông báo tức thì cho Quản trị viên/Kinh doanh
                </span>
              </label>

              {formData.submitConfig.sendAdminEmail && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Danh sách Email nhận thông báo (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={(formData.submitConfig.adminEmails || []).join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        submitConfig: {
                          ...formData.submitConfig,
                          adminEmails: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    placeholder="sales@cic.com.vn, cskh@cic.com.vn"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Confirmation Response Message */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Phản hồi trên Màn hình sau khi gửi thành công
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Câu thông báo thành công (Success Message)
                </label>
                <input
                  type="text"
                  value={formData.submitConfig.successMessage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitConfig: { ...formData.submitConfig, successMessage: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chuyển hướng URL / Trang Cảm ơn (Redirect URL - Tùy chọn)
                </label>
                <input
                  type="text"
                  value={formData.submitConfig.redirectUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitConfig: { ...formData.submitConfig, redirectUrl: e.target.value },
                    })
                  }
                  placeholder="/cam-on-dang-ky"
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs max-w-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-orange-500" />
            Thống kê chuyển đổi & Vị trí nhúng
          </h2>

          <div className="grid grid-cols-3 gap-4 text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <span className="text-xs text-slate-400 block">Lượt hiển thị</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {form?.analytics.impressions?.toLocaleString() || 0}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Số lượt điền thành công</span>
              <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                {form?.stats?.submissions || form?.analytics.clicks || 0}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Tỷ lệ hoàn thành</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {form?.stats?.conversionRate || form?.analytics.ctr || 0}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewOpen && (
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
                    className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-900 text-orange-600' : 'text-slate-400'}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-900 text-orange-600' : 'text-slate-400'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
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
                    Gửi thông tin ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

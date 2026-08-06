import React, { useState, useEffect } from 'react';
import { X, Eye, Save, Send, Play, Settings, FileText, ChevronUp, ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import { FormItem, FormFormData, FormField } from '../types';
import { FIELD_TYPES, FieldType } from '../../shared/constants/fieldTypes';
import { generateCode } from '../../shared/utils/validationHelpers';

interface FormBuilderModalProps {
  isOpen: boolean;
  form: FormItem | null;
  onSave: (form: FormFormData, action: 'draft' | 'submit' | 'publish') => void;
  onCancel: () => void;
}

export const FormBuilderModal: React.FC<FormBuilderModalProps> = ({
  isOpen,
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
      adminEmails: [],
      sendConfirmationEmail: false,
      successMessage: 'Cảm ơn bạn đã gửi thông tin.',
      webhookUrl: '',
      crmSyncEnabled: false,
    },
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'fields' | 'preview' | 'settings'>('basic');

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
    } else {
      setFormData({
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
          adminEmails: [],
          sendConfirmationEmail: false,
          successMessage: 'Cảm ơn bạn đã gửi thông tin.',
          webhookUrl: '',
          crmSyncEnabled: false,
        },
      });
    }
    setSelectedFieldId(null);
    setActiveTab('basic');
  }, [form, isOpen]);

  const handleAdminNameChange = (value: string) => {
    setFormData({
      ...formData,
      adminName: value,
      code: generateCode(value),
    });
  };

  const addField = (fieldType: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      fieldKey: `field_${formData.fields.length + 1}`,
      label: FIELD_TYPES.find((ft) => ft.value === fieldType)?.label || 'Trường mới',
      fieldType,
      placeholder: '',
      helpText: '',
      validation: { required: false },
      position: formData.fields.length + 1,
      isRequired: false,
      isLocked: false,
    };
    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    });
    setSelectedFieldId(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    });
  };

  const deleteField = (fieldId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa trường này?')) {
      setFormData({
        ...formData,
        fields: formData.fields.filter((f) => f.id !== fieldId),
      });
      if (selectedFieldId === fieldId) {
        setSelectedFieldId(null);
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

    setFormData({
      ...formData,
      fields: newFields.map((f, i) => ({ ...f, position: i + 1 })),
    });
  };

  const handleSave = (action: 'draft' | 'submit' | 'publish') => {
    onSave(formData, action);
  };

  const selectedField = formData.fields.find((f) => f.id === selectedFieldId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {form ? 'Chỉnh sửa biểu mẫu' : 'Tạo biểu mẫu mới'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'basic'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Thông tin cơ bản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fields')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'fields'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Trường dữ liệu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Cấu hình
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {activeTab === 'basic' && (
            <div className="p-6 overflow-y-auto min-h-0">
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tên quản trị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => handleAdminNameChange(e.target.value)}
                      placeholder="Ví dụ: Biểu mẫu - Tư vấn ERP"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tiêu đề hiển thị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ví dụ: Đăng ký nhận tư vấn"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Mô tả về mục đích của biểu mẫu..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mã (Code)
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="tuvan-erp"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'fields' && (
            <div className="flex h-full min-h-0">
              {/* Left: Field Types */}
              <div className="w-64 border-r border-slate-200 dark:border-slate-700 p-4 overflow-y-auto shrink-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Thêm trường
                </h3>
                <div className="space-y-2">
                  {FIELD_TYPES.map((fieldType) => (
                    <button
                      key={fieldType.value}
                      type="button"
                      onClick={() => addField(fieldType.value as FieldType)}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      {fieldType.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle: Fields List */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-800 min-h-0">
                <div className="space-y-2">
                  {formData.fields.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <p className="text-sm">Chưa có trường nào</p>
                      <p className="text-xs mt-1">Thêm trường từ menu bên trái</p>
                    </div>
                  ) : (
                    formData.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`bg-white dark:bg-slate-900 rounded-lg p-4 border transition-colors ${
                          selectedFieldId === field.id
                            ? 'border-orange-500 ring-2 ring-orange-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1 pt-1">
                            <button
                              type="button"
                              onClick={() => moveField(field.id, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveField(field.id, 'down')}
                              disabled={index === formData.fields.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                          <GripVertical className="w-5 h-5 text-slate-400 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {field.label}
                              </span>
                              {field.isRequired && (
                                <span className="text-xs text-red-500"> *</span>
                              )}
                              {field.isLocked && (
                                <span className="text-xs text-orange-500"> 🔒</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {FIELD_TYPES.find((ft) => ft.value === field.fieldType)?.label}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedFieldId(field.id)}
                            className="p-2 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteField(field.id)}
                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right: Field Properties */}
              <div className="w-80 border-l border-slate-200 dark:border-slate-700 p-4 overflow-y-auto shrink-0">
                {selectedField ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Chỉnh sửa trường
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={selectedField.label}
                          onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Field Key
                        </label>
                        <input
                          type="text"
                          value={selectedField.fieldKey}
                          onChange={(e) => updateField(selectedField.id, { fieldKey: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={selectedField.placeholder || ''}
                          onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Help Text
                        </label>
                        <textarea
                          value={selectedField.helpText || ''}
                          onChange={(e) => updateField(selectedField.id, { helpText: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="required"
                          checked={selectedField.isRequired}
                          onChange={(e) => updateField(selectedField.id, { isRequired: e.target.checked, validation: { ...selectedField.validation, required: e.target.checked } })}
                          className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="required" className="text-sm text-slate-700 dark:text-slate-300">
                          Bắt buộc
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="locked"
                          checked={selectedField.isLocked}
                          onChange={(e) => updateField(selectedField.id, { isLocked: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="locked" className="text-sm text-slate-700 dark:text-slate-300">
                          Khóa (không thể xóa)
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p className="text-sm">Chọn trường để chỉnh sửa</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'preview' && (
            <div className="p-6 overflow-y-auto min-h-0 bg-slate-50 dark:bg-slate-800">
              <div className="max-w-lg mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {formData.title || 'Tiêu đề biểu mẫu'}
                  </h3>
                  {formData.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                      {formData.description}
                    </p>
                  )}
                  <div className="space-y-4">
                    {formData.fields.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                        Chưa có trường nào
                      </p>
                    ) : (
                      formData.fields.map((field) => (
                        <div key={field.id} className="space-y-1">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {field.label}
                            {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.fieldType === 'text' && (
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                              disabled
                            />
                          )}
                          {field.fieldType === 'email' && (
                            <input
                              type="email"
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                              disabled
                            />
                          )}
                          {field.fieldType === 'phone' && (
                            <input
                              type="tel"
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                              disabled
                            />
                          )}
                          {field.fieldType === 'textarea' && (
                            <textarea
                              placeholder={field.placeholder}
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
                              disabled
                            />
                          )}
                          {field.fieldType === 'select' && (
                            <select
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                              disabled
                            >
                              <option value="">-- Chọn --</option>
                              {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {field.fieldType === 'checkbox' && (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={field.id}
                                className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                disabled
                              />
                              <label htmlFor={field.id} className="text-sm text-slate-700 dark:text-slate-300">
                                {field.placeholder}
                              </label>
                            </div>
                          )}
                          {field.helpText && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">{field.helpText}</p>
                          )}
                        </div>
                      ))
                    )}
                    {formData.fields.length > 0 && (
                      <button
                        type="button"
                        className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors"
                        disabled
                      >
                        Gửi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-6 overflow-y-auto min-h-0">
              <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Cấu hình gửi biểu mẫu
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveToDatabase"
                      checked={formData.submitConfig.saveToDatabase}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submitConfig: { ...formData.submitConfig, saveToDatabase: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="saveToDatabase" className="text-sm text-slate-700 dark:text-slate-300">
                      Lưu vào cơ sở dữ liệu
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="createCustomerRequest"
                      checked={formData.submitConfig.createCustomerRequest}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submitConfig: { ...formData.submitConfig, createCustomerRequest: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="createCustomerRequest" className="text-sm text-slate-700 dark:text-slate-300">
                      Tạo yêu cầu khách hàng
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sendAdminEmail"
                      checked={formData.submitConfig.sendAdminEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submitConfig: { ...formData.submitConfig, sendAdminEmail: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="sendAdminEmail" className="text-sm text-slate-700 dark:text-slate-300">
                      Gửi email cho admin
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email admin (ngăn cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={formData.submitConfig.adminEmails.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submitConfig: {
                            ...formData.submitConfig,
                            adminEmails: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      placeholder="admin@example.com, sales@example.com"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sendConfirmationEmail"
                      checked={formData.submitConfig.sendConfirmationEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submitConfig: { ...formData.submitConfig, sendConfirmationEmail: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="sendConfirmationEmail" className="text-sm text-slate-700 dark:text-slate-300">
                      Gửi email xác nhận cho khách hàng
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Thông báo thành công
                    </label>
                    <textarea
                      value={formData.submitConfig.successMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          submitConfig: { ...formData.submitConfig, successMessage: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Lưu nháp
          </button>
          <button
            type="button"
            onClick={() => handleSave('publish')}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
          >
            Đăng & Phát hành
          </button>
        </div>
      </div>
    </div>
  );
};

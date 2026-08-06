import React, { useState, useEffect } from 'react';
import { X, Eye, Save, Send, Play } from 'lucide-react';
import { CtaItem, CtaFormData, CtaActionConfig } from '../types';
import { ActionType } from '../../shared/constants/actionTypes';
import { CtaStatus } from '../../shared/constants/statusTypes';
import { ACTION_TYPES } from '../../shared/constants/actionTypes';
import { CTA_STATUSES } from '../../shared/constants/statusTypes';
import { generateCode } from '../../shared/utils/validationHelpers';
import { mockEmailTemplates } from '../../../email_templates/mockData';
import { EMAIL_EVENTS, TEMPLATE_STATUSES } from '../../../email_templates/types';

interface CtaEditorModalProps {
  isOpen: boolean;
  cta: CtaItem | null;
  onSave: (cta: CtaFormData, action: 'draft' | 'submit' | 'publish') => void;
  onCancel: () => void;
}

export const CtaEditorModal: React.FC<CtaEditorModalProps> = ({
  isOpen,
  cta,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CtaFormData>({
    adminName: '',
    displayText: '',
    description: '',
    code: '',
    icon: '',
    actionConfig: {
      type: 'open_form',
    },
    status: 'draft',
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (cta) {
      setFormData({
        adminName: cta.adminName,
        displayText: cta.displayText,
        description: cta.description || '',
        code: cta.code,
        icon: cta.icon || '',
        actionConfig: cta.actionConfig,
        status: cta.status,
      });
    } else {
      setFormData({
        adminName: '',
        displayText: '',
        description: '',
        code: '',
        icon: '',
        actionConfig: {
          type: 'open_form',
        },
        status: 'draft',
      });
    }
  }, [cta, isOpen]);

  const handleAdminNameChange = (value: string) => {
    setFormData({
      ...formData,
      adminName: value,
      code: generateCode(value),
    });
  };

  const handleActionTypeChange = (type: ActionType) => {
    setFormData({
      ...formData,
      actionConfig: {
        type,
        // Reset action-specific fields
        formId: undefined,
        url: undefined,
        openInNewTab: undefined,
        sectionId: undefined,
        fileId: undefined,
        phoneNumber: undefined,
        emailAddress: undefined,
        emailTemplateId: type === 'send_email' ? '' : undefined,
        reviewBeforeSend: type === 'send_email' ? true : undefined,
        customAction: undefined,
      },
    });
  };

  const handleSave = (action: 'draft' | 'submit' | 'publish') => {
    onSave(formData, action);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {cta ? 'Chỉnh sửa CTA' : 'Tạo CTA mới'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar min-h-0">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Thông tin cơ bản
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Tên quản trị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.adminName}
                onChange={(e) => handleAdminNameChange(e.target.value)}
                placeholder="Ví dụ: CTA - Tư vấn ERP"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Nội dung hiển thị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.displayText}
                onChange={(e) => setFormData({ ...formData, displayText: e.target.value })}
                placeholder="Ví dụ: Nhận tư vấn"
                maxLength={100}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <p className="text-[10px] text-slate-500 mt-1">{formData.displayText.length}/100 ký tự</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Mô tả nội bộ
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về mục đích sử dụng của CTA này..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Mã định danh
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="cta_tuvan_erp"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">Không chọn icon</option>
                <option value="MessageSquare">MessageSquare</option>
                <option value="Download">Download</option>
                <option value="Phone">Phone</option>
                <option value="Mail">Mail</option>
                <option value="Eye">Eye</option>
                <option value="Play">Play</option>
                <option value="FileText">FileText</option>
                <option value="ArrowRight">ArrowRight</option>
              </select>
            </div>
          </div>

          {/* Action Configuration */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hành động khi nhấn
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Loại hành động <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.actionConfig.type}
                onChange={(e) => handleActionTypeChange(e.target.value as ActionType)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                {ACTION_TYPES.map((action) => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic fields based on action type */}
            {formData.actionConfig.type === 'open_form' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Chọn biểu mẫu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.actionConfig.formId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, formId: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                >
                  <option value="">Chọn biểu mẫu...</option>
                  <option value="form_001">Biểu mẫu - Tư vấn ERP</option>
                  <option value="form_002">Biểu mẫu - Báo giá</option>
                  <option value="form_003">Biểu mẫu - Liên hệ</option>
                </select>
              </div>
            )}

            {(formData.actionConfig.type === 'redirect_internal' ||
              formData.actionConfig.type === 'redirect_external') && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Đường dẫn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.actionConfig.url || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actionConfig: { ...formData.actionConfig, url: e.target.value },
                      })
                    }
                    placeholder={formData.actionConfig.type === 'redirect_internal' ? '/giai-phap-erp' : 'https://example.com'}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Cách mở
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="openInNewTab"
                        checked={formData.actionConfig.openInNewTab === true}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            actionConfig: { ...formData.actionConfig, openInNewTab: true },
                          })
                        }
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300">Tab mới</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="openInNewTab"
                        checked={formData.actionConfig.openInNewTab === false}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            actionConfig: { ...formData.actionConfig, openInNewTab: false },
                          })
                        }
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300">Cùng tab</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {formData.actionConfig.type === 'scroll_to_section' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Chọn section <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.actionConfig.sectionId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, sectionId: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Chọn section...</option>
                  <option value="section_hero">Hero Section</option>
                  <option value="section_features">Features Section</option>
                  <option value="section_pricing">Pricing Section</option>
                  <option value="section_contact">Contact Section</option>
                </select>
              </div>
            )}

            {formData.actionConfig.type === 'download_file' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Chọn tài liệu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.actionConfig.fileId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, fileId: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Chọn tài liệu...</option>
                  <option value="file_001">Catalogue sản phẩm.pdf</option>
                  <option value="file_002">Hồ sơ năng lực.docx</option>
                  <option value="file_003">Bảng giá.xlsx</option>
                </select>
              </div>
            )}

            {formData.actionConfig.type === 'call_phone' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.actionConfig.phoneNumber || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, phoneNumber: e.target.value },
                    })
                  }
                  placeholder="0901234567"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            )}

            {formData.actionConfig.type === 'send_email' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Địa chỉ email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.actionConfig.emailAddress || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, emailAddress: e.target.value },
                    })
                  }
                  placeholder="sales@company.com"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <label className="mb-1.5 mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mẫu email sử dụng <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.actionConfig.emailTemplateId || ''}
                  onChange={(event) => setFormData({
                    ...formData,
                    actionConfig: { ...formData.actionConfig, emailTemplateId: event.target.value },
                  })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Chọn mẫu email...</option>
                  {mockEmailTemplates
                    .filter((template) => template.workspace === 'vi' && template.audience === 'internal')
                    .map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} · {EMAIL_EVENTS.find((item) => item.value === template.event)?.label} · {TEMPLATE_STATUSES[template.status].label}
                      </option>
                    ))}
                </select>
                <p className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                  Bắt buộc xem lại người nhận, tiêu đề và nội dung trước khi xác nhận gửi.
                </p>
              </div>
            )}

            {formData.actionConfig.type === 'custom_action' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Custom action <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.actionConfig.customAction || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, customAction: e.target.value },
                    })
                  }
                  placeholder="customFunctionName"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trạng thái
            </h3>
            <div className="flex items-center gap-4">
              {CTA_STATUSES.map((status) => (
                <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === status.value}
                    onChange={() => setFormData({ ...formData, status: status.value as CtaStatus })}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Preview
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                {formData.icon && <span className="text-lg">📋</span>}
                {formData.displayText || 'Nội dung hiển thị'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Lưu bản nháp
          </button>
          <button
            type="button"
            onClick={() => handleSave('submit')}
            className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Gửi duyệt
          </button>
          <button
            type="button"
            onClick={() => handleSave('publish')}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Xuất bản
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Send, Mail, Eye } from 'lucide-react';
import { FormFormData } from '../../types';
import { EMAIL_EVENTS, TEMPLATE_STATUSES, type EmailTemplate } from '../../../../email_templates/types';
import { CmsButton } from '../../../../../components/ui/CmsButton';
import type { CmsLocale } from '../../../../../data/CmsDataSource';

interface FormSubmitActionsTabProps {
  formData: FormFormData;
  setFormData: React.Dispatch<React.SetStateAction<FormFormData>>;
  emailTemplates: EmailTemplate[];
  workspaceLocale: CmsLocale;
  onPreviewEmailTemplate: (templateId: string) => void;
}

export const FormSubmitActionsTab: React.FC<FormSubmitActionsTabProps> = ({
  formData,
  setFormData,
  emailTemplates,
  workspaceLocale,
  onPreviewEmailTemplate,
}) => {
  return (
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
            <div className="grid gap-3 md:grid-cols-2">
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
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Mẫu thông báo quản trị
                </label>
                <select
                  value={formData.submitConfig.adminEmailTemplate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      submitConfig: {
                        ...formData.submitConfig,
                        adminEmailTemplate: e.target.value || undefined,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="">Không gửi bằng mẫu</option>
                  {emailTemplates
                    .filter((template) => template.workspace === workspaceLocale && template.audience === 'internal')
                    .map((template) => {
                      const eventName = EMAIL_EVENTS.find((item: { value: string; label: string }) => item.value === template.event)?.label;
                      return (
                        <option key={template.id} value={template.id}>
                          {template.name} · {eventName} · {TEMPLATE_STATUSES[template.status].label}
                        </option>
                      );
                    })}
                </select>
                <CmsButton
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  leadingIcon={<Eye className="size-4" />}
                  disabled={!formData.submitConfig.adminEmailTemplate}
                  onClick={() => onPreviewEmailTemplate(formData.submitConfig.adminEmailTemplate || '')}
                >
                  Xem trước email quản trị
                </CmsButton>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Email to Customer */}
        <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={formData.submitConfig.sendConfirmationEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  submitConfig: { ...formData.submitConfig, sendConfirmationEmail: e.target.checked },
                })
              }
              className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500"
            />
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Send className="h-4 w-4 text-orange-500" />
              Gửi email xác nhận cho người điền biểu mẫu
            </span>
          </label>

          {formData.submitConfig.sendConfirmationEmail && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Mẫu gửi khách hàng
              </label>
              <select
                value={formData.submitConfig.confirmationEmailTemplate || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    submitConfig: {
                      ...formData.submitConfig,
                      confirmationEmailTemplate: e.target.value || undefined,
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">Chọn mẫu email</option>
                {emailTemplates
                  .filter((template) => template.workspace === workspaceLocale && template.audience === 'customer')
                  .map((template) => {
                    const eventName = EMAIL_EVENTS.find((item: { value: string; label: string }) => item.value === template.event)?.label;
                    return (
                      <option key={template.id} value={template.id}>
                        {template.name} · {eventName} · {TEMPLATE_STATUSES[template.status].label}
                      </option>
                    );
                  })}
              </select>
              <CmsButton
                type="button"
                size="sm"
                variant="secondary"
                className="mt-2"
                leadingIcon={<Eye className="size-4" />}
                disabled={!formData.submitConfig.confirmationEmailTemplate}
                onClick={() => onPreviewEmailTemplate(formData.submitConfig.confirmationEmailTemplate || '')}
              >
                Xem trước email gửi khách hàng
              </CmsButton>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Chỉ mẫu Đang sử dụng mới được phép gửi khi kết nối production. Mẫu nháp vẫn hiển thị để đối chiếu cấu hình demo.
              </p>
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
              Chữ trên nút gửi biểu mẫu
            </label>
            <input
              type="text"
              value={formData.submitConfig.submitButtonText || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  submitConfig: { ...formData.submitConfig, submitButtonText: e.target.value },
                })
              }
              placeholder="Ví dụ: Gửi yêu cầu, Nhận báo giá, Đăng ký ngay"
              maxLength={60}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 font-medium"
            />
            <p className="mt-1 text-[11px] text-slate-400">Nên dùng động từ mô tả đúng kết quả sau khi gửi.</p>
          </div>

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
  );
};

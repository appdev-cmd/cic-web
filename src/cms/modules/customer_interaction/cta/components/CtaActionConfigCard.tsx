import React from 'react';
import { ExternalLink, Upload, Eye } from 'lucide-react';
import { CtaFormData } from '../types';
import { ActionType, ACTION_TYPES } from '../../shared/constants/actionTypes';
import { CmsButton } from '../../../../components/ui/CmsButton';
import type { FormItem } from '../../forms/types';
import type { EmailTemplate } from '../../../email_templates/types';
import { EMAIL_EVENTS, TEMPLATE_STATUSES } from '../../../email_templates/types';
import type { CtaDownloadFileOption } from '../../../../data/CustomerInteractionDataSource';
import type { CmsLocale } from '../../../../data/CmsDataSource';

interface CtaActionConfigCardProps {
  formData: CtaFormData;
  setFormData: React.Dispatch<React.SetStateAction<CtaFormData>>;
  onActionTypeChange: (type: ActionType) => void;
  forms: FormItem[];
  emailTemplates: EmailTemplate[];
  downloadFiles: CtaDownloadFileOption[];
  workspaceLocale: CmsLocale;
  onOpenEmailPreview: () => void;
}

export const REAL_WEBSITE_PAGES = [
  { value: '/', label: 'Trang chủ (/)' },
  { value: '/gioi-thieu', label: 'Giới thiệu — Tổng quan (/gioi-thieu)' },
  { value: '/gioi-thieu/co-cau-to-chuc', label: 'Giới thiệu — Cơ cấu tổ chức (/gioi-thieu/co-cau-to-chuc)' },
  { value: '/gioi-thieu/nang-luc-kinh-nghiem', label: 'Giới thiệu — Năng lực & Kinh nghiệm (/gioi-thieu/nang-luc-kinh-nghiem)' },
  { value: '/san-pham', label: 'Sản phẩm công nghệ (/san-pham)' },
  { value: '/dich-vu', label: 'Dịch vụ chuyên sâu (/dich-vu)' },
  { value: '/du-an', label: 'Dự án tiêu biểu (/du-an)' },
  { value: '/tin-tuc', label: 'Tin tức & Góc nhìn (/tin-tuc)' },
  { value: '/su-kien', label: 'Sự kiện & Hội thảo (/su-kien)' },
  { value: '/lien-he', label: 'Liên hệ tư vấn (/lien-he)' },
  { value: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật (/chinh-sach-bao-mat)' },
  { value: '/dieu-khoan-su-dung', label: 'Điều khoản sử dụng (/dieu-khoan-su-dung)' },
];

export const REAL_WEBSITE_SECTIONS = [
  {
    group: 'Trang chủ (Home)',
    sections: [
      { value: '#home-hero', label: '#home-hero — Hero Banner chính' },
      { value: '#home-intro', label: '#home-intro — Giới thiệu & Video doanh nghiệp' },
      { value: '#home-stats', label: '#home-stats — Thống kê năng lực 35+ năm' },
      { value: '#home-awards', label: '#home-awards — Thành tựu & Giải thưởng' },
      { value: '#home-ecosystem', label: '#home-ecosystem — Hệ sinh thái Sản phẩm & Dịch vụ' },
      { value: '#home-projects', label: '#home-projects — Dự án tiêu biểu' },
      { value: '#home-events', label: '#home-events — Sự kiện nổi bật' },
      { value: '#home-news', label: '#home-news — Tin tức & Góc nhìn' },
      { value: '#home-partners', label: '#home-partners — Đối tác chiến lược' },
      { value: '#contact-form', label: '#contact-form — Form gửi yêu cầu tư vấn' },
    ],
  },
  {
    group: 'Trang Giới thiệu (About)',
    sections: [
      { value: '#about-overview', label: '#about-overview — Tổng quan doanh nghiệp' },
      { value: '#about-timeline', label: '#about-timeline — Lịch sử & Tiến trình phát triển' },
      { value: '#about-strategy', label: '#about-strategy — Tầm nhìn - Sứ mệnh - Giá trị cốt lõi' },
      { value: '#about-offerings', label: '#about-offerings — Lĩnh vực kinh doanh & Dịch vụ' },
      { value: '#about-structure', label: '#about-structure — Sơ đồ Cơ cấu tổ chức' },
      { value: '#about-capacity', label: '#about-capacity — Năng lực doanh nghiệp' },
      { value: '#about-experience', label: '#about-experience — Kinh nghiệm theo chuyên ngành' },
      { value: '#about-partners', label: '#about-partners — Đối tác phần mềm & thiết bị' },
    ],
  },
  {
    group: 'Trang Dịch vụ (Services)',
    sections: [
      { value: '#services-list', label: '#services-list — Danh sách dịch vụ trọng tâm' },
      { value: '#service-detail', label: '#service-detail — Khối chi tiết dịch vụ' },
    ],
  },
  {
    group: 'Trang Sản phẩm (Products)',
    sections: [
      { value: '#products-grid', label: '#products-grid — Danh mục sản phẩm công nghệ' },
      { value: '#product-categories', label: '#product-categories — Bộ lọc phân loại sản phẩm' },
    ],
  },
  {
    group: 'Trang Liên hệ (Contact)',
    sections: [
      { value: '#contact-branches', label: '#contact-branches — Chi nhánh Hà Nội & TP.HCM' },
      { value: '#contact-map', label: '#contact-map — Bản đồ Google Maps' },
    ],
  },
];

export const CtaActionConfigCard: React.FC<CtaActionConfigCardProps> = ({
  formData,
  setFormData,
  onActionTypeChange,
  forms,
  emailTemplates,
  downloadFiles,
  workspaceLocale,
  onOpenEmailPreview,
}) => {
  const selectedEmailTemplate = emailTemplates.find(
    (template) => template.id === formData.actionConfig.emailTemplateId
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-orange-500" />
          Hành động kích hoạt khi người dùng nhấn nút
        </h2>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Loại hành động (Action Type) <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.actionConfig.type}
          onChange={(e) => onActionTypeChange(e.target.value as ActionType)}
          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-semibold cursor-pointer"
        >
          {ACTION_TYPES.map((act) => (
            <option key={act.value} value={act.value}>
              {act.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-form based on selected action type */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        {formData.actionConfig.type === 'open_form' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Chọn Biểu mẫu tương tác mở Popup <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.actionConfig.formId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  actionConfig: { ...formData.actionConfig, formId: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium cursor-pointer"
            >
              <option value="">Chọn biểu mẫu</option>
              {forms
                .filter((form) => form.status === 'active')
                .map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.adminName} ({form.code})
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Khi người dùng nhấn CTA, hệ thống sẽ mở Popup chứa biểu mẫu này.
            </p>
          </div>
        )}

        {formData.actionConfig.type === 'redirect_internal' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Chọn trang nội bộ đích <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <select
                  value={
                    REAL_WEBSITE_PAGES.some((p) => p.value === formData.actionConfig.url)
                      ? formData.actionConfig.url
                      : formData.actionConfig.url
                      ? '__custom__'
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value !== '__custom__') {
                      setFormData({
                        ...formData,
                        actionConfig: { ...formData.actionConfig, url: e.target.value },
                      });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium cursor-pointer"
                >
                  <option value="">-- Chọn trang nội bộ từ danh sách --</option>
                  {REAL_WEBSITE_PAGES.map((page) => (
                    <option key={page.value} value={page.value}>
                      {page.label}
                    </option>
                  ))}
                  <option value="__custom__">-- Tự nhập đường dẫn tùy chỉnh --</option>
                </select>

                <input
                  type="text"
                  value={formData.actionConfig.url || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, url: e.target.value },
                    })
                  }
                  placeholder="Ví dụ: /gioi-thieu/nang-luc-kinh-nghiem hoặc /dich-vu"
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
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
                  className="text-orange-600 focus:ring-orange-500"
                />
                Mở trong tab mới (_blank)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="openInNewTab"
                  checked={
                    formData.actionConfig.openInNewTab === false ||
                    formData.actionConfig.openInNewTab === undefined
                  }
                  onChange={() =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, openInNewTab: false },
                    })
                  }
                  className="text-orange-600 focus:ring-orange-500"
                />
                Mở cùng tab hiện tại (_self)
              </label>
            </div>
          </div>
        )}

        {formData.actionConfig.type === 'redirect_external' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Đường dẫn URL bên ngoài <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.actionConfig.url || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    actionConfig: { ...formData.actionConfig, url: e.target.value },
                  })
                }
                placeholder="https://cic.com.vn hoặc liên kết ngoài"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="openInNewTabExt"
                  checked={
                    formData.actionConfig.openInNewTab === true ||
                    formData.actionConfig.openInNewTab === undefined
                  }
                  onChange={() =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, openInNewTab: true },
                    })
                  }
                  className="text-orange-600 focus:ring-orange-500"
                />
                Mở trong tab mới (_blank - Khuyên dùng cho link ngoài)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="openInNewTabExt"
                  checked={formData.actionConfig.openInNewTab === false}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, openInNewTab: false },
                    })
                  }
                  className="text-orange-600 focus:ring-orange-500"
                />
                Mở cùng tab hiện tại (_self)
              </label>
            </div>
          </div>
        )}

        {formData.actionConfig.type === 'scroll_to_section' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Chọn Section trên trang cần cuộn mượt tới <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <select
                  value={
                    REAL_WEBSITE_SECTIONS.some((group) =>
                      group.sections.some((s) => s.value === formData.actionConfig.sectionId)
                    )
                      ? formData.actionConfig.sectionId
                      : formData.actionConfig.sectionId
                      ? '__custom__'
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value !== '__custom__') {
                      setFormData({
                        ...formData,
                        actionConfig: { ...formData.actionConfig, sectionId: e.target.value },
                      });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium cursor-pointer"
                >
                  <option value="">-- Chọn Section thực tế từ danh sách website --</option>
                  {REAL_WEBSITE_SECTIONS.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.sections.map((sec) => (
                        <option key={sec.value} value={sec.value}>
                          {sec.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="__custom__">-- Tự nhập mã Section tùy chỉnh (#id) --</option>
                </select>

                <input
                  type="text"
                  value={formData.actionConfig.sectionId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actionConfig: { ...formData.actionConfig, sectionId: e.target.value },
                    })
                  }
                  placeholder="#contact-form hoặc #home-stats"
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Khi click vào nút, trình duyệt sẽ tự động cuộn mượt (smooth scroll) đến vị trí section đã chọn.
            </p>
          </div>
        )}

        {formData.actionConfig.type === 'download_file' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Chọn tệp tài liệu cho phép tải xuống <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.actionConfig.fileId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  actionConfig: { ...formData.actionConfig, fileId: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium cursor-pointer"
            >
              <option value="">Chọn tệp từ Thư viện Media</option>
              {formData.actionConfig.fileId &&
                !downloadFiles.some((file) => file.id === formData.actionConfig.fileId) && (
                  <option value={formData.actionConfig.fileId}>
                    {formData.actionConfig.fileId.replace(/^uploaded_\d+_/, '')}
                  </option>
                )}
              {downloadFiles.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.title} ({file.filename})
                </option>
              ))}
            </select>
            <label className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-orange-300 px-3 py-2 text-xs font-bold text-orange-600 transition-colors hover:border-orange-500 hover:bg-orange-50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-orange-500 dark:hover:bg-orange-950/20">
              <Upload className="size-4" />
              Tải tệp mới từ máy
              <input
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) {
                    setFormData({
                      ...formData,
                      actionConfig: {
                        ...formData.actionConfig,
                        fileId: `uploaded_${Date.now()}_${file.name}`,
                      },
                    });
                  }
                }}
                className="sr-only"
              />
            </label>
            <p className="text-[11px] text-slate-500">
              Tệp tải từ máy sẽ tự được thêm vào Thư viện Media khi lưu CTA.
            </p>
          </div>
        )}

        {formData.actionConfig.type === 'call_phone' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Số điện thoại hotline cần gọi <span className="text-red-500">*</span>
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
              placeholder="024 3976 1381"
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold"
            />
          </div>
        )}

        {formData.actionConfig.type === 'send_email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Địa chỉ email nhận thư <span className="text-red-500">*</span>
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
                placeholder="truyenthong@cic.com.vn"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Mẫu email sử dụng <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.actionConfig.emailTemplateId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    actionConfig: { ...formData.actionConfig, emailTemplateId: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Chọn mẫu email</option>
                {emailTemplates
                  .filter((template) => template.workspace === workspaceLocale && template.audience === 'internal')
                  .map((template) => {
                    const eventName = EMAIL_EVENTS.find((event) => event.value === template.event)?.label;
                    return (
                      <option key={template.id} value={template.id}>
                        {template.name} · {eventName} · {TEMPLATE_STATUSES[template.status].label}
                      </option>
                    );
                  })}
              </select>
            </div>
            <label className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
              <input type="checkbox" checked disabled className="mt-0.5 size-4 accent-orange-600" />
              <span>
                <strong>Xem lại trước khi gửi là bắt buộc.</strong>
                <br />
                Người dùng phải xem người nhận, tiêu đề và nội dung đã điền biến rồi mới xác nhận gửi.
              </span>
            </label>
            <CmsButton
              size="sm"
              variant="secondary"
              leadingIcon={<Eye className="size-4" />}
              disabled={!selectedEmailTemplate}
              onClick={onOpenEmailPreview}
            >
              Xem trước email
            </CmsButton>
          </div>
        )}
      </div>
    </div>
  );
};

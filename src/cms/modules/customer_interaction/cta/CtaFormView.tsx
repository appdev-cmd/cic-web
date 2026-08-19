import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Play,
  Eye,
  MousePointer2,
  MessageSquare,
  Download,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Send,
  Layers,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  Tag,
  Copy,
  Info,
  X,
} from 'lucide-react';
import { CtaItem, CtaFormData, CtaActionConfig, CtaStyleVariant } from './types';
import { ActionType, ACTION_TYPES } from '../shared/constants/actionTypes';
import { CtaStatus, CTA_STATUSES } from '../shared/constants/statusTypes';
import { generateCode } from '../shared/utils/validationHelpers';
import { CmsButton } from '../../../components/ui/CmsButton';
import { EMAIL_EVENTS, SAMPLE_VALUES, TEMPLATE_STATUSES, type EmailTemplate } from '../../email_templates/types';
import type { CmsLocale } from '../../../data/CmsDataSource';
import type { CtaDownloadFileOption } from '../../../data/CustomerInteractionDataSource';
import type { FormItem } from '../forms/types';

interface CtaFormViewProps {
  cta: CtaItem | null;
  workspaceLocale: CmsLocale;
  forms: FormItem[];
  emailTemplates: EmailTemplate[];
  downloadFiles: CtaDownloadFileOption[];
  onSave: (ctaData: CtaFormData, action: 'draft' | 'publish') => void;
  onCancel: () => void;
}

const ICON_OPTIONS = [
  { value: '', label: 'Không dùng icon' },
  { value: 'MessageSquare', label: 'Tin nhắn (MessageSquare)', icon: MessageSquare },
  { value: 'Download', label: 'Tải xuống (Download)', icon: Download },
  { value: 'Phone', label: 'Điện thoại (Phone)', icon: Phone },
  { value: 'Mail', label: 'Thư điện tử (Mail)', icon: Mail },
  { value: 'FileText', label: 'Tài liệu (FileText)', icon: FileText },
  { value: 'ArrowRight', label: 'Mũi tên (ArrowRight)', icon: ArrowRight },
  { value: 'ExternalLink', label: 'Mở trang ngoài (ExternalLink)', icon: ExternalLink },
  { value: 'Sparkles', label: 'Nổi bật (Sparkles)', icon: Sparkles },
  { value: 'Send', label: 'Gửi đi (Send)', icon: Send },
  { value: 'MousePointer2', label: 'Con trỏ (MousePointer2)', icon: MousePointer2 },
];

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

  const buttonVariant = formData.styleVariant;
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [previewHovered, setPreviewHovered] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [saveError, setSaveError] = useState('');

  const selectedEmailTemplate = emailTemplates.find((template) => template.id === formData.actionConfig.emailTemplateId);
  const renderEmailSample = (value: string) => Object.entries(SAMPLE_VALUES).reduce((text, [token, sample]) => text.split(token).join(sample), value);

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
  }, [cta]);

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

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4" />;
      case 'Download':
        return <Download className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      case 'Mail':
        return <Mail className="w-4 h-4" />;
      case 'FileText':
        return <FileText className="w-4 h-4" />;
      case 'ArrowRight':
        return <ArrowRight className="w-4 h-4" />;
      case 'ExternalLink':
        return <ExternalLink className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Send':
        return <Send className="w-4 h-4" />;
      case 'MousePointer2':
        return <MousePointer2 className="w-4 h-4" />;
      default:
        return null;
    }
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

      {saveError && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"><AlertCircle className="size-4"/>{saveError}</div>}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Form - 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Thông tin quản trị */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 text-orange-500" />
                Thông tin định danh CTA
              </h2>
              <span className="text-xs text-slate-400">Bắt buộc (*Check)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Tên quản trị <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => handleAdminNameChange(e.target.value)}
                  placeholder="Ví dụ: CTA - Tư vấn giải pháp ERP"
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tên hiển thị trong CMS giúp phân biệt nội bộ.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Mã định danh (Code) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="cta_tuvan_erp"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    title="Sao chép shortcode"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Dùng nhúng shortcode: <code className="font-mono text-orange-600 dark:text-orange-400">{`{{cta:${formData.code || 'code'}}}`}</code></span>
                  {copiedCode && <span className="text-emerald-600 font-semibold">Đã chép!</span>}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Mô tả nội bộ
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả mục đích sử dụng, phạm vi hiển thị hoặc chiến dịch tiếp thị liên quan..."
                rows={2}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs resize-none"
              />
            </div>
          </div>

          {/* Card 2: Nội dung & Giao diện hiển thị */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Nội dung & Kiểu hiển thị nút trên Website
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nội dung hiển thị trên web <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.displayText}
                  onChange={(e) => setFormData({ ...formData, displayText: e.target.value })}
                  placeholder="Ví dụ: Nhận tư vấn ngay"
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">{formData.displayText.length}/100 ký tự</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Icon đính kèm
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs cursor-pointer font-medium"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Styling Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Biến thể kiểu dáng (Variant)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'primary', label: 'Primary (Cam)' },
                    { id: 'secondary', label: 'Dark / Grey' },
                    { id: 'outline', label: 'Outline' },
                    { id: 'gradient', label: 'Gradient' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setFormData((current) => ({ ...current, styleVariant: v.id as CtaStyleVariant }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        buttonVariant === v.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kích thước nút (Size)
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'sm', label: 'Nhỏ (Small)' },
                    { id: 'md', label: 'Vừa (Medium)' },
                    { id: 'lg', label: 'Lớn (Large)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setButtonSize(s.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        buttonSize === s.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Cấu hình Hành động (Action Config) */}
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
                onChange={(e) => handleActionTypeChange(e.target.value as ActionType)}
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
                    {forms.filter((form) => form.status === 'active').map((form) => (
                      <option key={form.id} value={form.id}>{form.adminName} ({form.code})</option>
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
                        value={REAL_WEBSITE_PAGES.some((p) => p.value === formData.actionConfig.url) ? formData.actionConfig.url : (formData.actionConfig.url ? '__custom__' : '')}
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
                          <option key={page.value} value={page.value}>{page.label}</option>
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
                        checked={formData.actionConfig.openInNewTab === false || formData.actionConfig.openInNewTab === undefined}
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
                        checked={formData.actionConfig.openInNewTab === true || formData.actionConfig.openInNewTab === undefined}
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
                          REAL_WEBSITE_SECTIONS.some((group) => group.sections.some((s) => s.value === formData.actionConfig.sectionId))
                            ? formData.actionConfig.sectionId
                            : (formData.actionConfig.sectionId ? '__custom__' : '')
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
                              <option key={sec.value} value={sec.value}>{sec.label}</option>
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
                <div>
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
                    {downloadFiles.map((file) => (
                      <option key={file.id} value={file.id}>{file.title} ({file.filename})</option>
                    ))}
                  </select>
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
                      onChange={(e) => setFormData({ ...formData, actionConfig: { ...formData.actionConfig, emailTemplateId: e.target.value } })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">Chọn mẫu email</option>
                      {emailTemplates.filter((template) => template.workspace === workspaceLocale && template.audience === 'internal').map((template) => {
                        const eventName = EMAIL_EVENTS.find((event) => event.value === template.event)?.label;
                        return <option key={template.id} value={template.id}>{template.name} · {eventName} · {TEMPLATE_STATUSES[template.status].label}</option>;
                      })}
                    </select>
                  </div>
                  <label className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                    <input type="checkbox" checked disabled className="mt-0.5 size-4 accent-orange-600" />
                    <span><strong>Xem lại trước khi gửi là bắt buộc.</strong><br/>Người dùng phải xem người nhận, tiêu đề và nội dung đã điền biến rồi mới xác nhận gửi.</span>
                  </label>
                  <CmsButton size="sm" variant="secondary" leadingIcon={<Eye/>} disabled={!selectedEmailTemplate} onClick={() => setIsEmailPreviewOpen(true)}>
                    Xem trước email
                  </CmsButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar - 1 Col) */}
        <div className="space-y-6">
          {/* Sidebar 1: Trạng thái CTA */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Trạng thái lưu
            </h3>

            <div className="space-y-2">
              {CTA_STATUSES.map((status) => (
                <label
                  key={status.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.status === status.value
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === status.value}
                    onChange={() => setFormData({ ...formData, status: status.value as CtaStatus })}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {status.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {status.value === 'active' && 'Hiển thị hoạt động bình thường trên web'}
                      {status.value === 'draft' && 'Lưu bản nháp chưa công khai'}
                      {status.value === 'archived' && 'Tạm ẩn lưu trữ lịch sử'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Sidebar 2: Live Button Interactive Preview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-orange-500" />
                Xem trước giao diện
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-md">
                Live Preview
              </span>
            </div>

            <div className="p-6 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center gap-3 min-h-[140px]">
              <button
                type="button"
                onMouseEnter={() => setPreviewHovered(true)}
                onMouseLeave={() => setPreviewHovered(false)}
                className={`inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all shadow-md ${
                  buttonSize === 'sm' ? 'px-3.5 py-2 text-xs' : buttonSize === 'lg' ? 'px-6 py-3.5 text-base' : 'px-4 py-2.5 text-sm'
                } ${
                  buttonVariant === 'primary'
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20'
                    : buttonVariant === 'secondary'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                    : buttonVariant === 'outline'
                    ? 'bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
                    : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:brightness-105'
                }`}
              >
                {renderIcon(formData.icon)}
                <span>{formData.displayText || 'Nội dung hiển thị'}</span>
              </button>

              <span className="text-[11px] text-slate-400 font-medium">
                {previewHovered ? 'Trạng thái: Hover State' : 'Rê chuột để thử hiệu ứng'}
              </span>
            </div>
          </div>

          {/* Sidebar 3: Usage Locations & Analytics (if editing) */}
          {cta && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-orange-500" />
                Hiệu quả & Vị trí nhúng
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] text-slate-400 block">Lượt xem</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {cta.analytics.impressions.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Lượt nhấn</span>
                  <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">
                    {cta.analytics.clicks.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CTR</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {cta.analytics.ctr}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Trang đang sử dụng CTA này ({cta.usedByCount}):
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {cta.usedByPages.map((page, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                        {page.pageTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {page.placementKey}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEmailPreviewOpen && selectedEmailTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="cta-email-preview-title">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <div><p className="text-xs font-semibold text-orange-600">Email sẽ được xem lại trước khi gửi</p><h2 id="cta-email-preview-title" className="mt-1 text-base font-bold text-slate-900 dark:text-white">{renderEmailSample(selectedEmailTemplate.subject)}</h2><p className="mt-1 text-xs text-slate-500">Tới: {formData.actionConfig.emailAddress || 'Chưa nhập địa chỉ nhận'}</p></div>
              <button type="button" onClick={() => setIsEmailPreviewOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng xem trước"><X className="size-4"/></button>
            </div>
            <div className="whitespace-pre-wrap p-6 text-sm leading-7 text-slate-700 dark:text-slate-300">{renderEmailSample(selectedEmailTemplate.content)}</div>
            <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-800"><CmsButton onClick={() => setIsEmailPreviewOpen(false)}>Đóng xem trước</CmsButton></div>
          </div>
        </div>
      )}
    </div>
  );
};

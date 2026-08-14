export type EmailWorkspace = 'vi' | 'en';
export type EmailAudience = 'customer' | 'internal';
export type EmailTemplateStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type EmailEvent = 'product_contact' | 'product_download' | 'product_purchase' | 'product_quote' | 'product_hardlock';

export interface EmailTemplate {
  id: string;
  workspace: EmailWorkspace;
  name: string;
  event: EmailEvent;
  audience: EmailAudience;
  subject: string;
  content: string;
  status: EmailTemplateStatus;
  version: number;
  updatedAt: string;
}

export const EMAIL_EVENTS: Array<{ value: EmailEvent; label: string; labelEn: string }> = [
  { value: 'product_contact', label: 'Liên hệ sản phẩm', labelEn: 'Product enquiry' },
  { value: 'product_download', label: 'Tải tài liệu', labelEn: 'Document download' },
  { value: 'product_purchase', label: 'Đăng ký mua', labelEn: 'Purchase request' },
  { value: 'product_quote', label: 'Yêu cầu báo giá', labelEn: 'Quotation request' },
  { value: 'product_hardlock', label: 'Yêu cầu khóa cứng', labelEn: 'Hardware lock request' },
];

export const TEMPLATE_STATUSES: Record<EmailTemplateStatus, { label: string; className: string }> = {
  draft: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  active: { label: 'Đã xuất bản', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  inactive: { label: 'Ngừng sử dụng', className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  archived: { label: 'Đã lưu trữ', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
};

export const VARIABLE_GROUPS = [
  { label: 'Thương hiệu', tokens: ['{{brand.name}}', '{{brand.website_url}}', '{{brand.support_email}}', '{{brand.support_phone}}'] },
  { label: 'Yêu cầu', tokens: ['{{request.reference}}', '{{request.type_name}}', '{{request.received_at}}'] },
  { label: 'Khách hàng', tokens: ['{{customer.full_name}}', '{{customer.company_name}}'] },
  { label: 'Sản phẩm', tokens: ['{{product.name}}', '{{product.public_url}}'] },
];

export const INTERNAL_VARIABLES = ['{{customer.email}}', '{{customer.phone}}', '{{request.message}}', '{{cms.request_url}}'];
export const DOWNLOAD_VARIABLES = ['{{document.name}}', '{{document.download_url}}', '{{document.expires_at}}', '{{document.download_instruction}}'];

export const SAMPLE_VALUES: Record<string, string> = {
  '{{brand.name}}': 'CIC Technology', '{{brand.website_url}}': 'https://www.cic.com.vn',
  '{{brand.support_email}}': 'support@cic.com.vn', '{{brand.support_phone}}': '024 0000 0000',
  '{{request.reference}}': 'YC-2026-000123', '{{request.type_name}}': 'Yêu cầu báo giá',
  '{{request.received_at}}': '14:30, 05/08/2026', '{{request.message}}': 'Tôi cần tư vấn gói phù hợp.',
  '{{customer.full_name}}': 'Nguyễn Văn An', '{{customer.company_name}}': 'Công ty ABC',
  '{{customer.email}}': 'an.nguyen@example.vn', '{{customer.phone}}': '09xx xxx xxx',
  '{{product.name}}': 'Phần mềm ABC', '{{product.public_url}}': 'https://www.cic.com.vn/san-pham/abc',
  '{{document.name}}': 'Tài liệu giới thiệu sản phẩm', '{{document.download_url}}': 'https://download.example.vn/tai-lieu',
  '{{document.expires_at}}': '23:59, 07/08/2026', '{{document.download_instruction}}': 'Nhấn liên kết để tải tài liệu.',
  '{{cms.request_url}}': 'https://cms.example.vn/requests/YC-2026-000123',
};

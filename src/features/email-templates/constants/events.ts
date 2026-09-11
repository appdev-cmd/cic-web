import type { EmailEvent, EmailTemplateStatus } from '../types';

export interface EmailEventOption {
  value: EmailEvent | string;
  label: string;
  labelEn: string;
  category: 'product' | 'auth' | 'order';
}

export const EMAIL_EVENTS: EmailEventOption[] = [
  { value: 'product_contact', label: 'Liên hệ sản phẩm', labelEn: 'Product enquiry', category: 'product' },
  { value: 'product_download', label: 'Tải tài liệu sản phẩm', labelEn: 'Document download', category: 'product' },
  { value: 'product_purchase', label: 'Đăng ký mua sản phẩm', labelEn: 'Purchase request', category: 'product' },
  { value: 'product_quote', label: 'Yêu cầu báo giá', labelEn: 'Quotation request', category: 'product' },
  { value: 'product_hardlock', label: 'Yêu cầu khóa cứng', labelEn: 'Hardware lock request', category: 'product' },
  { value: 'auth_activate', label: 'Kích hoạt tài khoản', labelEn: 'Account activation', category: 'auth' },
  { value: 'auth_forgot_password', label: 'Quên mật khẩu / OTP', labelEn: 'Password reset / OTP', category: 'auth' },
  { value: 'order_confirmation', label: 'Xác nhận đơn hàng', labelEn: 'Order confirmation', category: 'order' },
  { value: 'order_payment_success', label: 'Thanh toán thành công', labelEn: 'Payment success', category: 'order' },
];

export const TEMPLATE_STATUSES: Record<EmailTemplateStatus, { label: string; className: string }> = {
  draft: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  active: { label: 'Đã xuất bản', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  inactive: { label: 'Ngừng sử dụng', className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  archived: { label: 'Đã lưu trữ', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
};

export const VARIABLE_GROUPS = [
  {
    label: 'Thương hiệu',
    tokens: ['{{brand.name}}', '{{brand.website_url}}', '{{brand.support_email}}', '{{brand.support_phone}}'],
  },
  {
    label: 'Yêu cầu',
    tokens: ['{{request.reference}}', '{{request.type_name}}', '{{request.received_at}}'],
  },
  {
    label: 'Khách hàng',
    tokens: ['{{customer.full_name}}', '{{customer.company_name}}'],
  },
  {
    label: 'Sản phẩm / Dịch vụ',
    tokens: ['{{product.name}}', '{{product.public_url}}'],
  },
  {
    label: 'Tải tài liệu',
    tokens: ['{{document.name}}', '{{document.download_url}}', '{{document.expires_at}}', '{{document.download_instruction}}'],
  },
  {
    label: 'Tài khoản & Xác thực',
    tokens: ['{{auth.activation_url}}', '{{auth.otp_code}}', '{{auth.reset_password_url}}'],
  },
  {
    label: 'Đơn hàng & Thanh toán',
    tokens: ['{{order.code}}', '{{order.total_amount}}', '{{order.payment_method}}', '{{order.items_table}}'],
  },
];

export const INTERNAL_VARIABLES = [
  '{{customer.email}}',
  '{{customer.phone}}',
  '{{request.message}}',
  '{{cms.request_url}}',
];

export const SAMPLE_VALUES: Record<string, string> = {
  '{{brand.name}}': 'CIC Technology & Consultancy',
  '{{brand.website_url}}': 'https://www.cic.com.vn',
  '{{brand.support_email}}': 'support@cic.com.vn',
  '{{brand.support_phone}}': '024 3974 1436',
  '{{request.reference}}': 'YC-2026-000123',
  '{{request.type_name}}': 'Yêu cầu báo giá',
  '{{request.received_at}}': '14:30, 05/08/2026',
  '{{request.message}}': 'Tôi cần tư vấn và nhận báo giá gói phần mềm.',
  '{{customer.full_name}}': 'Nguyễn Văn An',
  '{{customer.company_name}}': 'Công ty CP Xây dựng ABC',
  '{{customer.email}}': 'an.nguyen@example.vn',
  '{{customer.phone}}': '0912 345 678',
  '{{product.name}}': 'Phần mềm EnjiCAD',
  '{{product.public_url}}': 'https://www.cic.com.vn/san-pham/enjicad',
  '{{document.name}}': 'Bộ cài đặt dùng thử EnjiCAD 2026',
  '{{document.download_url}}': 'https://www.cic.com.vn/download/enjicad-trial.zip',
  '{{document.expires_at}}': '23:59, 15/08/2026',
  '{{document.download_instruction}}': 'Tải tệp zip về máy tính, giải nén và làm theo hướng dẫn cài đặt.',
  '{{cms.request_url}}': 'https://cms.cic.com.vn/customer-requests/YC-2026-000123',
  '{{auth.activation_url}}': 'https://www.cic.com.vn/auth/activate?token=sample_token_123',
  '{{auth.otp_code}}': '849201',
  '{{auth.reset_password_url}}': 'https://www.cic.com.vn/auth/reset-password?token=sample_token_456',
  '{{order.code}}': 'DH2026-0089',
  '{{order.total_amount}}': '15.500.000 đ',
  '{{order.payment_method}}': 'Chuyển khoản ngân hàng / VNPay',
  '{{order.items_table}}': 'Phần mềm EnjiCAD Pro (Số lượng: 1) - 15.500.000 đ',
};

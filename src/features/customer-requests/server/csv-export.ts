import 'server-only';
import type { CustomerRequest } from '../types';

interface CsvExportMetadata {
  workspace?: 'vi' | 'en';
  searchQuery?: string;
  tab?: string;
  status?: string;
  formId?: string;
  ctaId?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedUserName?: string;
  totalCount?: number;
}

const STATUS_LABELS_VI: Record<string, string> = {
  new: 'Mới tiếp nhận',
  received: 'Đã tiếp nhận',
  processing: 'Đang xử lý',
  contacted: 'Đã liên hệ',
  completed: 'Đã hoàn thành',
  not_suitable: 'Không phù hợp',
  cancelled: 'Đã hủy',
};

const PRIORITY_LABELS_VI: Record<string, string> = {
  urgent: 'Khẩn cấp',
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

function sanitizeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/[\r\n]+/g, ' - ').trim();
  if (!str) return '""';

  // Excel text formula for phone or preserved strings (e.g. ="0901234567")
  if (/^=".*"$/.test(str)) {
    return str;
  }

  // Prevent Spreadsheet formula injection
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${safe.replace(/"/g, '""')}"`;
}

function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  if (!cleanPhone) return '""';
  // Use Excel formula ="0901234567" so leading zeros are preserved and no scientific notation
  const digitsOnly = cleanPhone.replace(/[^0-9+]/g, '');
  return `="${digitsOnly}"`;
}

function formatDate(isoDateString?: string | null): string {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return '';

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function resolveAiClassification(tags: string[] = []): string {
  if (tags.includes('ai:enterprise')) return 'Doanh nghiệp lớn / VIP';
  if (tags.includes('ai:irrelevant')) return 'Không phù hợp / Nhầm thương hiệu';
  if (tags.includes('ai:qualified')) return 'Khách tiềm năng chuẩn';
  return 'Chưa thẩm định';
}

function buildFilterSummary(metadata: CsvExportMetadata): string {
  const parts: string[] = [];
  if (metadata.searchQuery) parts.push(`Từ khóa: "${metadata.searchQuery}"`);
  if (metadata.tab && metadata.tab !== 'all') {
    const tabMap: Record<string, string> = {
      new: 'Chưa xử lý (Mới)',
      processing: 'Đang xử lý',
      completed: 'Đã hoàn thành',
      not_suitable: 'Không phù hợp',
      cancelled: 'Đã hủy',
    };
    parts.push(`Tab: ${tabMap[metadata.tab] || metadata.tab}`);
  }
  if (metadata.status) parts.push(`Trạng thái: ${STATUS_LABELS_VI[metadata.status] || metadata.status}`);
  if (metadata.formId) parts.push(`Biểu mẫu: ${metadata.formId}`);
  if (metadata.ctaId) parts.push(`CTA: ${metadata.ctaId}`);
  if (metadata.assignedUserName) parts.push(`Người phụ trách: ${metadata.assignedUserName}`);
  if (metadata.dateFrom) parts.push(`Từ ngày: ${metadata.dateFrom}`);
  if (metadata.dateTo) parts.push(`Đến ngày: ${metadata.dateTo}`);

  return parts.length > 0 ? parts.join(' | ') : 'Tất cả yêu cầu (Không lọc)';
}

export function formatCustomerRequestsCsv(
  requests: CustomerRequest[],
  metadata: CsvExportMetadata = {}
): string {
  const now = new Date();
  const nowFormatted = formatDate(now.toISOString());
  const filterDesc = buildFilterSummary(metadata);
  const totalRecords = requests.length;

  // Professional Report Metadata Banner
  const headerBannerLines = [
    sanitizeCsvCell('CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC'),
    sanitizeCsvCell('BÁO CÁO DANH SÁCH YÊU CẦU KHÁCH HÀNG'),
    [sanitizeCsvCell('Thời gian xuất báo cáo:'), sanitizeCsvCell(nowFormatted)].join(','),
    [sanitizeCsvCell('Bộ lọc áp dụng:'), sanitizeCsvCell(filterDesc)].join(','),
    [sanitizeCsvCell('Tổng số bản ghi:'), sanitizeCsvCell(String(totalRecords))].join(','),
    '', // Empty separator row
  ];

  // Table Column Headers
  const columnHeaders = [
    'STT',
    'Mã yêu cầu',
    'Thời gian gửi',
    'Họ và tên',
    'Số điện thoại',
    'Email',
    'Đơn vị / Doanh nghiệp',
    'Địa chỉ',
    'Biểu mẫu / Nguồn',
    'Nút kêu gọi (CTA)',
    'Sản phẩm quan tâm',
    'Trạng thái xử lý',
    'Độ ưu tiên',
    'Phân loại AI',
    'Người phụ trách',
    'Thẻ phân loại (Tags)',
    'Tóm tắt yêu cầu',
    'Nội dung tin nhắn',
  ];

  // Table Data Rows
  const dataRows = requests.map((r, index) => {
    const getVal = (keys: string[], types: string[]): string => {
      const found = r.submissionValues?.find(
        (v) =>
          keys.includes((v.fieldKey || '').toLowerCase()) ||
          types.includes((v.fieldType || '').toLowerCase())
      );
      return (found?.valueText || '').trim();
    };

    const name = getVal(['full_name', 'name', 'ho_ten'], ['text']) || r.sourceConfig?.pageTitle || '';
    const phone = getVal(['phone', 'sdt', 'dien_thoai', 'telephone'], ['phone']);
    const email = getVal(['email'], ['email']);
    const company = getVal(['company', 'cong_ty', 'don_vi', 'organization'], []);
    const address = getVal(['address', 'dia_chi'], []);
    const message = getVal(['message', 'noi_dung', 'note', 'loi_nhan', 'yeu_cau'], ['textarea']);

    // Extract product
    const productField = getVal(['product', 'product_name', 'san_pham'], []);
    const productTags = (r.tags || [])
      .filter((t) => t.startsWith('sp:'))
      .map((t) => t.replace(/^sp:/, '').replace(/_/g, ' '));
    const productDisplay = productField || productTags.join(', ') || '';

    // Status & Priority
    const statusLabel = STATUS_LABELS_VI[r.status] || r.status;
    const priorityLabel = PRIORITY_LABELS_VI[r.priority] || r.priority;
    const aiCategory = resolveAiClassification(r.tags);

    // Tags
    const tagsDisplay = (r.tags || []).join('; ');

    // Source date
    const rawDate = r.sourceConfig?.submittedAt || r.createdAt;
    const dateFormatted = formatDate(rawDate);

    // Latest note or summary
    const summary = r.internalNotes?.[r.internalNotes.length - 1]?.content || '';

    return [
      sanitizeCsvCell(index + 1),
      sanitizeCsvCell(r.id),
      sanitizeCsvCell(dateFormatted),
      sanitizeCsvCell(name),
      formatPhoneNumber(phone),
      sanitizeCsvCell(email),
      sanitizeCsvCell(company),
      sanitizeCsvCell(address),
      sanitizeCsvCell(r.sourceConfig?.formName || r.sourceType),
      sanitizeCsvCell(r.sourceConfig?.ctaName || ''),
      sanitizeCsvCell(productDisplay),
      sanitizeCsvCell(statusLabel),
      sanitizeCsvCell(priorityLabel),
      sanitizeCsvCell(aiCategory),
      sanitizeCsvCell(r.assignedUserName || 'Chưa phân công'),
      sanitizeCsvCell(tagsDisplay),
      sanitizeCsvCell(summary),
      sanitizeCsvCell(message),
    ].join(',');
  });

  // Combine with UTF-8 BOM (\uFEFF) for Excel compatibility on Windows
  return (
    '\uFEFF' +
    [
      ...headerBannerLines,
      columnHeaders.map(sanitizeCsvCell).join(','),
      ...dataRows,
    ].join('\r\n')
  );
}

import 'server-only';
import * as XLSX from 'xlsx';
import type { CustomerRequest } from '../types';

export interface CsvExportMetadata {
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

/**
 * Build a structured XLSX Workbook for customer requests.
 * Uses native cell typing (strings, numbers) so Excel and WPS Office
 * open each value in its exact column with proper widths and no text merging.
 */
export function buildCustomerRequestsWorkbook(
  requests: CustomerRequest[],
  metadata: CsvExportMetadata = {}
): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  const now = new Date();
  const nowFormatted = formatDate(now.toISOString());
  const filterDesc = buildFilterSummary(metadata);
  const totalRecords = requests.length;

  const aoaData: Array<Array<string | number>> = [
    ['CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC'],
    ['BÁO CÁO DANH SÁCH YÊU CẦU KHÁCH HÀNG'],
    ['Thời gian xuất báo cáo:', nowFormatted],
    ['Bộ lọc áp dụng:', filterDesc],
    ['Tổng số bản ghi:', totalRecords],
    [], // Dòng trống phân cách
    [
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
    ],
  ];

  requests.forEach((r, index) => {
    const getVal = (keys: string[], types: string[]): string => {
      const found = r.submissionValues?.find(
        (v) =>
          keys.includes((v.fieldKey || '').toLowerCase()) ||
          types.includes((v.fieldType || '').toLowerCase())
      );
      return (found?.valueText || '').trim();
    };

    const name = getVal(['full_name', 'name', 'ho_ten'], ['text']) || r.sourceConfig?.pageTitle || '';
    const rawPhone = getVal(['phone', 'sdt', 'dien_thoai', 'telephone'], ['phone']);
    const phone = rawPhone ? rawPhone.trim().replace(/\s+/g, '') : '';
    const email = getVal(['email'], ['email']);
    const company = getVal(['company', 'cong_ty', 'don_vi', 'organization'], []);
    const address = getVal(['address', 'dia_chi'], []);
    const message = getVal(['message', 'noi_dung', 'note', 'loi_nhan', 'yeu_cau'], ['textarea']).replace(/[\r\n]+/g, ' ');

    const productField = getVal(['product', 'product_name', 'san_pham'], []);
    const productTags = (r.tags || [])
      .filter((t) => t.startsWith('sp:'))
      .map((t) => t.replace(/^sp:/, '').replace(/_/g, ' '));
    const productDisplay = productField || productTags.join(', ') || '';

    const statusLabel = STATUS_LABELS_VI[r.status] || r.status;
    const priorityLabel = PRIORITY_LABELS_VI[r.priority] || r.priority;
    const aiCategory = resolveAiClassification(r.tags);
    const tagsDisplay = (r.tags || []).join(', ');

    const rawDate = r.sourceConfig?.submittedAt || r.createdAt;
    const dateFormatted = formatDate(rawDate);
    const summary = (r.internalNotes?.[r.internalNotes.length - 1]?.content || '').replace(/[\r\n]+/g, ' ');

    aoaData.push([
      index + 1,
      r.id,
      dateFormatted,
      name,
      phone, // Treated as string cell to keep leading 0
      email,
      company,
      address,
      r.sourceConfig?.formName || r.sourceType,
      r.sourceConfig?.ctaName || '',
      productDisplay,
      statusLabel,
      priorityLabel,
      aiCategory,
      r.assignedUserName || 'Chưa phân công',
      tagsDisplay,
      summary,
      message,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoaData);

  // Set explicit column widths for beautiful spreadsheet rendering in WPS & Excel
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 15 }, // Mã yêu cầu
    { wch: 20 }, // Thời gian gửi
    { wch: 26 }, // Họ và tên
    { wch: 16 }, // Số điện thoại
    { wch: 28 }, // Email
    { wch: 28 }, // Đơn vị / Doanh nghiệp
    { wch: 26 }, // Địa chỉ
    { wch: 24 }, // Biểu mẫu / Nguồn
    { wch: 20 }, // Nút kêu gọi (CTA)
    { wch: 24 }, // Sản phẩm quan tâm
    { wch: 18 }, // Trạng thái xử lý
    { wch: 15 }, // Độ ưu tiên
    { wch: 26 }, // Phân loại AI
    { wch: 22 }, // Người phụ trách
    { wch: 28 }, // Thẻ phân loại (Tags)
    { wch: 36 }, // Tóm tắt yêu cầu
    { wch: 45 }, // Nội dung tin nhắn
  ];

  // Format phone numbers explicitly as string cells to preserve leading 0
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:R1');
  for (let R = 7; R <= range.e.r; ++R) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: 4 }); // Column E: Số điện thoại
    const cell = ws[cellAddress];
    if (cell && cell.v !== undefined && cell.v !== '') {
      cell.t = 's';
      cell.v = String(cell.v);
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Yêu cầu khách hàng');
  return wb;
}

/**
 * Generate native Excel .xlsx file Buffer
 */
export function formatCustomerRequestsExcel(
  requests: CustomerRequest[],
  metadata: CsvExportMetadata = {}
): Buffer {
  const wb = buildCustomerRequestsWorkbook(requests, metadata);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate standard CSV with UTF-8 BOM
 */
export function formatCustomerRequestsCsv(
  requests: CustomerRequest[],
  metadata: CsvExportMetadata = {}
): string {
  const wb = buildCustomerRequestsWorkbook(requests, metadata);
  const csvStr = XLSX.utils.sheet_to_csv(wb.Sheets['Yêu cầu khách hàng']);
  return '\uFEFF' + csvStr;
}

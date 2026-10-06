import 'server-only';
import * as XLSX from 'xlsx-js-style';
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

// Styling tokens for Excel
const THIN_BORDER = {
  top: { style: 'thin', color: { rgb: 'CBD5E1' } },
  bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
  left: { style: 'thin', color: { rgb: 'CBD5E1' } },
  right: { style: 'thin', color: { rgb: 'CBD5E1' } },
};

const HEADER_BORDER = {
  top: { style: 'medium', color: { rgb: '1E3A8A' } },
  bottom: { style: 'medium', color: { rgb: '1E3A8A' } },
  left: { style: 'thin', color: { rgb: '3B82F6' } },
  right: { style: 'thin', color: { rgb: '3B82F6' } },
};

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
    ['BÁO CÁO DANH SÁCH YÊU CẦU KHÁCH HÀNG (CUSTOMER REQUESTS)'],
    ['Thời gian xuất báo cáo:', nowFormatted],
    ['Bộ lọc áp dụng:', filterDesc],
    ['Tổng số bản ghi:', `${totalRecords.toLocaleString('vi-VN')} yêu cầu`],
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
      phone,
      email,
      company,
      address,
      r.sourceConfig?.formName || r.sourceType || '',
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

  // 1. Set explicit column widths for beautiful readability
  ws['!cols'] = [
    { wch: 6 },  // A: STT
    { wch: 15 }, // B: Mã yêu cầu
    { wch: 20 }, // C: Thời gian gửi
    { wch: 26 }, // D: Họ và tên
    { wch: 16 }, // E: Số điện thoại
    { wch: 28 }, // F: Email
    { wch: 28 }, // G: Đơn vị / Doanh nghiệp
    { wch: 24 }, // H: Địa chỉ
    { wch: 24 }, // I: Biểu mẫu / Nguồn
    { wch: 18 }, // J: Nút kêu gọi (CTA)
    { wch: 24 }, // K: Sản phẩm quan tâm
    { wch: 18 }, // L: Trạng thái xử lý
    { wch: 15 }, // M: Độ ưu tiên
    { wch: 26 }, // N: Phân loại AI
    { wch: 22 }, // O: Người phụ trách
    { wch: 28 }, // P: Thẻ phân loại (Tags)
    { wch: 38 }, // Q: Tóm tắt yêu cầu
    { wch: 48 }, // R: Nội dung tin nhắn
  ];

  // 2. Set row heights (pt)
  ws['!rows'] = [
    { hpt: 26 }, // Row 1: Company header
    { hpt: 32 }, // Row 2: Report title
    { hpt: 20 }, // Row 3: Meta Time
    { hpt: 20 }, // Row 4: Meta Filter
    { hpt: 20 }, // Row 5: Meta Total
    { hpt: 12 }, // Row 6: Blank separator
    { hpt: 32 }, // Row 7: Table column headers
  ];

  // 3. Merged Banners (Row 1 & Row 2 across 18 columns)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } },
  ];

  // 4. Freeze row 7 so headers stay visible on scroll
  ws['!views'] = [{ state: 'frozen', ySplit: 7 }];

  // 5. Apply rich styling
  // Row 1: Company Name
  if (ws['A1']) {
    ws['A1'].s = {
      font: { name: 'Segoe UI', sz: 12, bold: true, color: { rgb: '1E3A8A' } },
      alignment: { vertical: 'center', horizontal: 'left' },
    };
  }

  // Row 2: Report Title Banner
  if (ws['A2']) {
    ws['A2'].s = {
      fill: { fgColor: { rgb: 'FFF7ED' } }, // Light warm orange tint
      font: { name: 'Segoe UI', sz: 15, bold: true, color: { rgb: 'C2410C' } },
      alignment: { vertical: 'center', horizontal: 'left', indent: 1 },
      border: {
        bottom: { style: 'medium', color: { rgb: 'EA580C' } },
      },
    };
  }

  // Rows 3-5: Metadata
  ['A3', 'A4', 'A5'].forEach((cellKey) => {
    if (ws[cellKey]) {
      ws[cellKey].s = {
        font: { name: 'Segoe UI', sz: 10, italic: true, color: { rgb: '64748B' } },
        alignment: { vertical: 'center' },
      };
    }
  });

  if (ws['B3']) {
    ws['B3'].s = {
      font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '0F172A' } },
      alignment: { vertical: 'center' },
    };
  }
  if (ws['B4']) {
    ws['B4'].s = {
      font: { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '0369A1' } },
      alignment: { vertical: 'center' },
    };
  }
  if (ws['B5']) {
    ws['B5'].s = {
      font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: '166534' } },
      alignment: { vertical: 'center' },
    };
  }

  // Row 7: Table Column Headers (18 columns: A7 to R7)
  const colLetters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  ];

  colLetters.forEach((col) => {
    const key = `${col}7`;
    if (ws[key]) {
      ws[key].s = {
        fill: { fgColor: { rgb: '1E3A8A' } }, // Classic Navy Blue
        font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: HEADER_BORDER,
      };
    }
  });

  // Rows 8+: Data Rows with Zebra Striping & Badges
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:R1');
  for (let R = 7; R <= range.e.r; ++R) {
    const isOdd = (R - 7) % 2 === 1;
    const rowBgRgb = isOdd ? 'F8FAFC' : 'FFFFFF'; // Subtle zebra striping

    for (let C = 0; C <= 17; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];
      if (!cell) continue;

      // Base style
      const cellStyle: Record<string, unknown> = {
        fill: { fgColor: { rgb: rowBgRgb } },
        font: { name: 'Segoe UI', sz: 10, color: { rgb: '1E293B' } },
        alignment: { vertical: 'center', horizontal: 'left' },
        border: THIN_BORDER,
      };

      // Column-specific enhancements
      if (C === 0) {
        // Col A: STT
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        (cellStyle.font as Record<string, unknown>).bold = true;
      } else if (C === 1) {
        // Col B: Mã yêu cầu
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        cellStyle.font = { name: 'Consolas', sz: 10, bold: true, color: { rgb: '0369A1' } };
      } else if (C === 2) {
        // Col C: Thời gian gửi
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
      } else if (C === 3) {
        // Col D: Họ và tên
        (cellStyle.font as Record<string, unknown>).bold = true;
      } else if (C === 4) {
        // Col E: Số điện thoại (Ensure string type to keep leading 0)
        cell.t = 's';
        cell.v = String(cell.v || '');
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        (cellStyle.font as Record<string, unknown>).bold = true;
      } else if (C === 5) {
        // Col F: Email
        cellStyle.font = { name: 'Segoe UI', sz: 10, color: { rgb: '2563EB' } };
      } else if (C === 11) {
        // Col L: Trạng thái xử lý (Color Badges)
        const val = String(cell.v || '');
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        if (val.includes('Mới')) {
          cellStyle.fill = { fgColor: { rgb: 'DBEAFE' } }; // Light blue
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '1E40AF' } };
        } else if (val.includes('tiếp nhận') || val.includes('xử lý')) {
          cellStyle.fill = { fgColor: { rgb: 'FEF3C7' } }; // Light amber
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'B45309' } };
        } else if (val.includes('liên hệ')) {
          cellStyle.fill = { fgColor: { rgb: 'E0E7FF' } }; // Light indigo
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '4338CA' } };
        } else if (val.includes('hoàn thành')) {
          cellStyle.fill = { fgColor: { rgb: 'DCFCE7' } }; // Light green
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '15803D' } };
        } else if (val.includes('Không phù hợp') || val.includes('hủy')) {
          cellStyle.fill = { fgColor: { rgb: 'FEE2E2' } }; // Light red
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'B91C1C' } };
        }
      } else if (C === 12) {
        // Col M: Độ ưu tiên (Color Badges)
        const val = String(cell.v || '');
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        if (val === 'Khẩn cấp') {
          cellStyle.fill = { fgColor: { rgb: 'FEE2E2' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'DC2626' } };
        } else if (val === 'Cao') {
          cellStyle.fill = { fgColor: { rgb: 'FFEDD5' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'C2410C' } };
        } else if (val === 'Trung bình') {
          cellStyle.font = { name: 'Segoe UI', sz: 10, color: { rgb: '475569' } };
        } else if (val === 'Thấp') {
          cellStyle.font = { name: 'Segoe UI', sz: 10, color: { rgb: '94A3B8' } };
        }
      } else if (C === 13) {
        // Col N: Phân loại AI (Badges)
        const val = String(cell.v || '');
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        if (val.includes('VIP') || val.includes('Doanh nghiệp lớn')) {
          cellStyle.fill = { fgColor: { rgb: 'FEF9C3' } }; // Light gold
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'A16207' } };
        } else if (val.includes('tiềm năng chuẩn')) {
          cellStyle.fill = { fgColor: { rgb: 'F0FDF4' } }; // Light emerald
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '15803D' } };
        } else if (val.includes('Không phù hợp')) {
          cellStyle.fill = { fgColor: { rgb: 'F1F5F9' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, color: { rgb: '64748B' } };
        } else {
          cellStyle.font = { name: 'Segoe UI', sz: 10, color: { rgb: '94A3B8' } };
        }
      } else if (C === 14) {
        // Col O: Người phụ trách
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
      } else if (C === 16 || C === 17) {
        // Col Q (Tóm tắt) & Col R (Lời nhắn): Wrap text
        cellStyle.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      }

      cell.s = cellStyle;
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Yêu cầu khách hàng');
  return wb;
}

/**
 * Generate native Excel .xlsx file Buffer with full colors, formatting, and auto column widths
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

import 'server-only';
import * as XLSX from 'xlsx-js-style';

interface AuditExportMetadata {
  range: string;
  days: number;
  workspace: string;
  totalRecords: number;
}

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

function formatDate(val: unknown): string {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(String(val));
  if (isNaN(d.getTime())) return String(val);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Nghiêm trọng (Critical)',
  high: 'Cao (High)',
  medium: 'Trung bình (Medium)',
  low: 'Thấp (Low)',
};

const RESULT_LABELS: Record<string, string> = {
  success: 'Thành công (Success)',
  failed: 'Thất bại (Failed)',
  denied: 'Bị từ chối (Denied)',
  partial: 'Một phần (Partial)',
};

export function formatAuditLogsExcel(
  rows: Array<Record<string, unknown>>,
  metadata: AuditExportMetadata
): Buffer {
  const wb = XLSX.utils.book_new();
  const now = new Date();
  const nowFormatted = formatDate(now);
  const totalRecords = rows.length;

  const hasSensitive = rows.length > 0 && ('ip_address' in rows[0] || 'user_agent' in rows[0]);

  // Headers list
  const headers = [
    'STT',
    'Thời gian ghi nhận',
    'Người thực hiện',
    'Mã hành động',
    'Phân loại',
    'Mức độ nghiêm trọng',
    'Loại đối tượng',
    'Mã đối tượng',
    'Tiêu đề đối tượng',
    'Phân hệ (Module)',
    'Không gian (Workspace)',
    'Ngôn ngữ',
    'Kết quả',
    'Thông điệp kết quả',
    'Mã tương quan (Correlation ID)',
  ];

  if (hasSensitive) {
    headers.push(
      'Địa chỉ IP',
      'User Agent',
      'Dữ liệu trước thay đổi',
      'Dữ liệu sau thay đổi',
      'Trường che giấu'
    );
  }

  const aoaData: Array<Array<string | number>> = [
    ['CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TƯ VẤN CIC'],
    ['BÁO CÁO NHẬT KÝ HOẠT ĐỘNG HỆ THỐNG (SYSTEM AUDIT LOGS)'],
    ['Thời gian xuất báo cáo:', nowFormatted],
    ['Phạm vi dữ liệu:', `Nhật ký ${metadata.days} ngày gần nhất • Workspace: ${metadata.workspace}`],
    ['Tổng số bản ghi:', `${totalRecords.toLocaleString('vi-VN')} hoạt động`],
    [], // Dòng trống
    headers,
  ];

  rows.forEach((row, index) => {
    const formatJsonCell = (val: unknown): string => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    };

    const rowData: Array<string | number> = [
      index + 1,
      formatDate(row.occurred_at),
      String(row.actor_label || ''),
      String(row.action_code || ''),
      String(row.category || ''),
      SEVERITY_LABELS[String(row.severity)] || String(row.severity || ''),
      String(row.entity_type || ''),
      String(row.entity_id || ''),
      String(row.entity_title || ''),
      String(row.module || ''),
      String(row.workspace || ''),
      String(row.locale || ''),
      RESULT_LABELS[String(row.result)] || String(row.result || ''),
      String(row.result_message || ''),
      String(row.correlation_id || ''),
    ];

    if (hasSensitive) {
      rowData.push(
        String(row.ip_address || ''),
        String(row.user_agent || ''),
        formatJsonCell(row.before_data),
        formatJsonCell(row.after_data),
        formatJsonCell(row.redacted_fields)
      );
    }

    aoaData.push(rowData);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoaData);

  const totalCols = headers.length;

  // 1. Set explicit column widths
  const cols = [
    { wch: 6 },  // STT
    { wch: 20 }, // Thời gian ghi nhận
    { wch: 24 }, // Người thực hiện
    { wch: 26 }, // Mã hành động
    { wch: 18 }, // Phân loại
    { wch: 22 }, // Mức độ nghiêm trọng
    { wch: 20 }, // Loại đối tượng
    { wch: 16 }, // Mã đối tượng
    { wch: 30 }, // Tiêu đề đối tượng
    { wch: 18 }, // Module
    { wch: 16 }, // Workspace
    { wch: 12 }, // Locale
    { wch: 22 }, // Kết quả
    { wch: 32 }, // Thông điệp
    { wch: 36 }, // Correlation ID
  ];

  if (hasSensitive) {
    cols.push(
      { wch: 18 }, // IP
      { wch: 35 }, // User Agent
      { wch: 40 }, // Before
      { wch: 40 }, // After
      { wch: 25 }  // Redacted
    );
  }

  ws['!cols'] = cols;

  // 2. Row heights
  ws['!rows'] = [
    { hpt: 26 }, // Row 1
    { hpt: 32 }, // Row 2
    { hpt: 20 }, // Row 3
    { hpt: 20 }, // Row 4
    { hpt: 20 }, // Row 5
    { hpt: 12 }, // Row 6
    { hpt: 32 }, // Row 7: Headers
  ];

  // 3. Merged Banners (Row 1 & Row 2 across all columns)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
  ];

  // 4. Freeze header pane on row 7
  ws['!views'] = [{ state: 'frozen', ySplit: 7 }];

  // 5. Rich styles
  if (ws['A1']) {
    ws['A1'].s = {
      font: { name: 'Segoe UI', sz: 12, bold: true, color: { rgb: '1E3A8A' } },
      alignment: { vertical: 'center', horizontal: 'left' },
    };
  }

  if (ws['A2']) {
    ws['A2'].s = {
      fill: { fgColor: { rgb: 'FFF7ED' } },
      font: { name: 'Segoe UI', sz: 15, bold: true, color: { rgb: 'C2410C' } },
      alignment: { vertical: 'center', horizontal: 'left', indent: 1 },
      border: {
        bottom: { style: 'medium', color: { rgb: 'EA580C' } },
      },
    };
  }

  ['A3', 'A4', 'A5'].forEach((k) => {
    if (ws[k]) {
      ws[k].s = {
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

  // Row 7: Table Headers
  for (let c = 0; c < totalCols; c++) {
    const key = XLSX.utils.encode_cell({ r: 6, c });
    if (ws[key]) {
      ws[key].s = {
        fill: { fgColor: { rgb: '1E3A8A' } },
        font: { name: 'Segoe UI', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        border: HEADER_BORDER,
      };
    }
  }

  // Row 8+: Data rows with zebra striping and badges
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:O1');
  for (let R = 7; R <= range.e.r; ++R) {
    const isOdd = (R - 7) % 2 === 1;
    const rowBgRgb = isOdd ? 'F8FAFC' : 'FFFFFF';

    for (let C = 0; C < totalCols; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];
      if (!cell) continue;

      const cellStyle: Record<string, unknown> = {
        fill: { fgColor: { rgb: rowBgRgb } },
        font: { name: 'Segoe UI', sz: 10, color: { rgb: '1E293B' } },
        alignment: { vertical: 'center', horizontal: 'left' },
        border: THIN_BORDER,
      };

      if (C === 0) {
        // STT
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        (cellStyle.font as Record<string, unknown>).bold = true;
      } else if (C === 1) {
        // Thời gian
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
      } else if (C === 3) {
        // Mã hành động
        cellStyle.font = { name: 'Consolas', sz: 10, bold: true, color: { rgb: '0369A1' } };
      } else if (C === 5) {
        // Mức độ nghiêm trọng
        const val = String(cell.v || '');
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        if (val.includes('Critical') || val.includes('Nghiêm trọng')) {
          cellStyle.fill = { fgColor: { rgb: 'FEE2E2' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'B91C1C' } };
        } else if (val.includes('High') || val.includes('Cao')) {
          cellStyle.fill = { fgColor: { rgb: 'FFEDD5' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'C2410C' } };
        } else if (val.includes('Medium') || val.includes('Trung bình')) {
          cellStyle.fill = { fgColor: { rgb: 'FEF3C7' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'B45309' } };
        } else {
          cellStyle.fill = { fgColor: { rgb: 'DCFCE7' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '15803D' } };
        }
      } else if (C === 12) {
        // Kết quả
        const val = String(cell.v || '');
        cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
        if (val.includes('Success') || val.includes('Thành công')) {
          cellStyle.fill = { fgColor: { rgb: 'DCFCE7' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: '15803D' } };
        } else if (val.includes('Failed') || val.includes('Denied') || val.includes('Thất bại')) {
          cellStyle.fill = { fgColor: { rgb: 'FEE2E2' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'B91C1C' } };
        } else {
          cellStyle.fill = { fgColor: { rgb: 'FEF3C7' } };
          cellStyle.font = { name: 'Segoe UI', sz: 10, bold: true, color: { rgb: 'B45309' } };
        }
      } else if (C === 14) {
        // Correlation ID
        cellStyle.font = { name: 'Consolas', sz: 9, color: { rgb: '64748B' } };
      }

      cell.s = cellStyle;
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Nhật ký hoạt động');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

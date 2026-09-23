import 'server-only';
import { getGoogleSheetsClient, hasGoogleServiceAccountCredentials } from './credentials';

export interface GoogleSheetMetadataResult {
  success: boolean;
  spreadsheetTitle?: string;
  sheets?: string[];
  headers?: string[];
  error?: string;
}

export function formatCellValueForGoogleSheet(val: unknown): string {
  if (val === null || val === undefined) return '';

  if (typeof val === 'string') {
    const trimmed = val.trim();
    // If it looks like a phone number starting with '0' (e.g. 0912345678 or 02431234567),
    // prepend an apostrophe (') so Google Sheets USER_ENTERED parses it as plain text and preserves leading zeros.
    if (/^0\d{8,12}$/.test(trimmed)) {
      return `'${trimmed}`;
    }
    return trimmed;
  }

  if (typeof val === 'number') {
    return String(val);
  }

  if (typeof val === 'boolean') {
    return val ? 'Có' : 'Không';
  }

  if (val instanceof Date) {
    return val.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  }

  if (Array.isArray(val)) {
    return val.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
  }

  if (typeof val === 'object') {
    return JSON.stringify(val);
  }

  return String(val);
}

function parseGoogleApiError(err: any): string {
  if (!err) return 'Lỗi kết nối không xác định.';
  const status = err.status || err.code || err.response?.status;
  const msg = err.message || '';

  if (status === 404 || msg.includes('Requested entity was not found')) {
    return 'Không tìm thấy file Google Sheet. Vui lòng kiểm tra lại Spreadsheet ID hoặc URL.';
  }
  if (status === 403 || msg.includes('The caller does not have permission') || msg.includes('permission')) {
    return 'Không có quyền truy cập. Vui lòng đảm bảo đã chia sẻ file Google Sheet cho email Service Account với quyền "Người chỉnh sửa" (Editor).';
  }
  if (status === 400 || msg.includes('Unable to parse range') || msg.includes('bad request')) {
    return 'Tên Trang tính (Sheet Tab) hoặc định dạng Spreadsheet ID không hợp lệ.';
  }
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED' || msg.includes('timeout')) {
    return 'Kết nối tới Google Sheets API bị quá thời gian chờ (Timeout).';
  }

  return `Lỗi từ Google Sheets: ${msg.slice(0, 150)}`;
}

export async function testGoogleSheetAccess(
  spreadsheetId: string,
  sheetName?: string
): Promise<GoogleSheetMetadataResult> {
  if (!hasGoogleServiceAccountCredentials()) {
    return {
      success: false,
      error: 'Hệ thống chưa được cấu hình tài khoản Google Service Account trên server (thiếu GOOGLE_SERVICE_ACCOUNT_EMAIL hoặc GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).',
    };
  }

  try {
    const sheets = getGoogleSheetsClient();

    // 1. Fetch metadata
    const metaRes = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'properties.title,sheets.properties.title',
    });

    const spreadsheetTitle = metaRes.data.properties?.title || 'Bảng tính không tên';
    const sheetTitles = (metaRes.data.sheets || [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => Boolean(t));

    const targetSheet = sheetName || sheetTitles[0] || 'Sheet1';

    // 2. Fetch row 1 headers
    let headers: string[] = [];
    try {
      const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${targetSheet}!1:1`,
      });
      const rows = headerRes.data.values;
      if (rows && rows.length > 0 && Array.isArray(rows[0])) {
        headers = rows[0].map((h) => String(h || '').trim()).filter(Boolean);
      }
    } catch {
      // Row 1 read error is non-fatal if sheet tab is empty
      headers = [];
    }

    return {
      success: true,
      spreadsheetTitle,
      sheets: sheetTitles,
      headers,
    };
  } catch (err: any) {
    return {
      success: false,
      error: parseGoogleApiError(err),
    };
  }
}

export async function getGoogleSheetHeaders(
  spreadsheetId: string,
  sheetName: string
): Promise<string[]> {
  const sheets = getGoogleSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!1:1`,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0 || !Array.isArray(rows[0])) {
    return [];
  }
  return rows[0].map((h) => String(h || '').trim()).filter(Boolean);
}

export async function initializeGoogleSheetHeaders(
  spreadsheetId: string,
  sheetName: string,
  headers: string[]
): Promise<void> {
  if (headers.length === 0) return;
  const sheets = getGoogleSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [headers],
    },
  });
}

export async function appendGoogleSheetRow(
  spreadsheetId: string,
  sheetName: string,
  rowValues: unknown[]
): Promise<{ updatedRows?: number; updatedRange?: string }> {
  const sheets = getGoogleSheetsClient();

  const formattedRow = rowValues.map((v) => formatCellValueForGoogleSheet(v));

  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [formattedRow],
    },
  });

  return {
    updatedRows: res.data.updates?.updatedRows || 1,
    updatedRange: res.data.updates?.updatedRange || undefined,
  };
}

import 'server-only';
import { getGoogleSheetsClient, hasGoogleServiceAccountCredentials } from './credentials';

export interface GoogleSheetMetadataResult {
  success: boolean;
  spreadsheetTitle?: string;
  sheets?: string[];
  activeSheet?: string;
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

export function formatSheetRange(sheetName: string, subRange: string): string {
  const clean = (sheetName || 'Sheet1').trim();
  const escaped = clean.replace(/'/g, "''");
  return `'${escaped}'!${subRange}`;
}

export async function testGoogleSheetAccess(
  spreadsheetId: string,
  sheetName?: string
): Promise<GoogleSheetMetadataResult> {
  if (!hasGoogleServiceAccountCredentials()) {
    return {
      success: false,
      error: 'Hệ thống chưa được cấu hình tài khoản Google Service Account trên server (thiếu file JSON credentials hoặc biến GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).',
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

    // If requested sheetName exists in sheetTitles use it; otherwise prefer first sheet tab
    const targetSheet = (sheetName && sheetTitles.includes(sheetName))
      ? sheetName
      : (sheetTitles[0] || sheetName || 'Sheet1');

    // 2. Fetch row 1 & row 2 headers
    let headers: string[] = [];
    try {
      const headerRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: formatSheetRange(targetSheet, '1:2'),
      });
      const rows = headerRes.data.values;
      if (rows && rows.length > 0) {
        const row1 = Array.isArray(rows[0]) ? rows[0].map((h) => String(h || '').trim()).filter(Boolean) : [];
        const row2 = Array.isArray(rows[1]) ? rows[1].map((h) => String(h || '').trim()).filter(Boolean) : [];

        // If row 1 is a merged title banner or single cell while row 2 has multiple columns, use row 2
        if (row1.length <= 1 && row2.length > 1) {
          headers = row2;
        } else if (row1.length > 0) {
          headers = row1;
        } else if (row2.length > 0) {
          headers = row2;
        }
      }
    } catch (readErr) {
      console.warn('[testGoogleSheetAccess] Header read warning:', readErr);
      headers = [];
    }

    return {
      success: true,
      spreadsheetTitle,
      sheets: sheetTitles,
      activeSheet: targetSheet,
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
    range: formatSheetRange(sheetName, '1:2'),
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }
  const row1 = Array.isArray(rows[0]) ? rows[0].map((h) => String(h || '').trim()).filter(Boolean) : [];
  const row2 = Array.isArray(rows[1]) ? rows[1].map((h) => String(h || '').trim()).filter(Boolean) : [];

  if (row1.length <= 1 && row2.length > 1) {
    return row2;
  }
  if (row1.length > 0) return row1;
  return row2;
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
    range: formatSheetRange(sheetName, 'A1'),
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
    range: formatSheetRange(sheetName, 'A1'),
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


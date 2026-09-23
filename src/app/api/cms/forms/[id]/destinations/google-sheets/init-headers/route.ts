import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { normalizeSpreadsheetId } from '@/features/forms/server/validation/destination-schemas';
import { initializeGoogleSheetHeaders } from '@/lib/integrations/google-sheets/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    await params; // consume params
    const body = await request.json();
    const rawSpreadsheetId = body?.spreadsheetId;
    const sheetName = body?.sheetName?.trim() || 'Sheet1';
    const headers = body?.headers;

    if (!rawSpreadsheetId || !Array.isArray(headers) || headers.length === 0) {
      return NextResponse.json({ error: 'Thiếu Spreadsheet ID hoặc danh sách tiêu đề cột headers.' }, { status: 400 });
    }

    const spreadsheetId = normalizeSpreadsheetId(rawSpreadsheetId);
    await initializeGoogleSheetHeaders(spreadsheetId, sheetName, headers);

    return NextResponse.json({
      success: true,
      message: `Đã khởi tạo ${headers.length} cột tiêu đề trên sheet "${sheetName}".`,
      headers,
    });
  } catch (err: any) {
    const norm = normalizeServerError(err);
    if (norm.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    if (norm.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    console.error('[API Init Sheet Headers Error]', err);
    return NextResponse.json({ success: false, error: err?.message || 'Lỗi khởi tạo tiêu đề.' }, { status: 500 });
  }
}

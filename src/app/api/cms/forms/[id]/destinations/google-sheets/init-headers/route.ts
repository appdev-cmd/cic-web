import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { normalizeSpreadsheetId } from '@/features/forms/server/validation/destination-schemas';
import { initializeGoogleSheetHeaders } from '@/lib/integrations/google-sheets/client';

import { matchSheetHeadersToFields } from '@/lib/integrations/google-sheets/matcher';
import { getFormById } from '@/features/forms/server/queries';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const rawSpreadsheetId = body?.spreadsheetId;
    const sheetName = body?.sheetName?.trim() || 'Sheet1';
    const headers = body?.headers;
    const clientFields = Array.isArray(body?.fields) ? body.fields : null;

    if (!rawSpreadsheetId || !Array.isArray(headers) || headers.length === 0) {
      return NextResponse.json({ error: 'Thiếu Spreadsheet ID hoặc danh sách tiêu đề cột headers.' }, { status: 400 });
    }

    const spreadsheetId = normalizeSpreadsheetId(rawSpreadsheetId);
    await initializeGoogleSheetHeaders(spreadsheetId, sheetName, headers);

    let fieldsToMatch = clientFields;
    if (!fieldsToMatch || fieldsToMatch.length === 0) {
      if (id && id !== 'new') {
        const form = await getFormById(id);
        if (form && form.fields) fieldsToMatch = form.fields;
      }
    }

    const suggestedMapping = fieldsToMatch && fieldsToMatch.length > 0
      ? matchSheetHeadersToFields(headers, fieldsToMatch)
      : headers.map((h: string) => ({
          sheetHeader: h.trim(),
          sourceType: 'field' as const,
          sourceKey: '',
        }));

    return NextResponse.json({
      success: true,
      message: `Đã khởi tạo ${headers.length} cột tiêu đề trên sheet "${sheetName}".`,
      headers,
      suggestedMapping,
    });
  } catch (err: unknown) {
    const norm = normalizeServerError(err);
    if (norm.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    if (norm.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    console.error('[API Init Sheet Headers Error]', err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Lỗi khởi tạo tiêu đề.' }, { status: 500 });
  }
}

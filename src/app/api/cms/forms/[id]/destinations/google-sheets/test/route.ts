import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { normalizeSpreadsheetId } from '@/features/forms/server/validation/destination-schemas';
import { testGoogleSheetAccess } from '@/lib/integrations/google-sheets/client';
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
    const sheetName = body?.sheetName?.trim() || undefined;

    if (!rawSpreadsheetId || typeof rawSpreadsheetId !== 'string') {
      return NextResponse.json({ error: 'Spreadsheet URL hoặc ID không được để trống.' }, { status: 400 });
    }

    const spreadsheetId = normalizeSpreadsheetId(rawSpreadsheetId);
    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Spreadsheet ID không hợp lệ.' }, { status: 400 });
    }

    // Test access and get headers
    const testResult = await testGoogleSheetAccess(spreadsheetId, sheetName);
    if (!testResult.success) {
      return NextResponse.json({ success: false, error: testResult.error }, { status: 200 });
    }

    // If headers exist, match with form fields
    let suggestedMapping: any[] = [];
    if (testResult.headers && testResult.headers.length > 0) {
      const form = await getFormById(id);
      if (form && form.fields) {
        suggestedMapping = matchSheetHeadersToFields(testResult.headers, form.fields);
      }
    }

    return NextResponse.json({
      success: true,
      spreadsheetId,
      spreadsheetTitle: testResult.spreadsheetTitle,
      sheets: testResult.sheets || [],
      headers: testResult.headers || [],
      suggestedMapping,
    });
  } catch (err: any) {
    const norm = normalizeServerError(err);
    if (norm.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    if (norm.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    console.error('[API Google Sheets Test Error]', err);
    return NextResponse.json({ success: false, error: err?.message || 'Lỗi kiểm tra kết nối.' }, { status: 500 });
  }
}

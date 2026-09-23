import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { retrySubmissionDelivery } from '@/features/forms/server/mutations';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; subId: string; delId: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id, subId, delId } = await params;
    const result = await retrySubmissionDelivery(id, subId, delId, principal);

    return NextResponse.json({
      success: result.status === 'success',
      result,
    });
  } catch (err: any) {
    const norm = normalizeServerError(err);
    if (norm.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    if (norm.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    console.error('[API Retry Delivery Error]', err);
    return NextResponse.json({ success: false, error: err?.message || 'Lỗi khi gửi lại.' }, { status: 500 });
  }
}

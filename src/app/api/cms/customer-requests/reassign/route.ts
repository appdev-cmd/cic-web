import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { reassignCustomerRequests } from '@/features/customer-requests/server/mutations';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  if (normalized.code === 'VALIDATION_ERROR') return NextResponse.json({ error: normalized.message }, { status: 400 });
  console.error('[API reassign Error]', error);
  return NextResponse.json({ error: normalized.message || 'Internal Server Error' }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (
      !principal.isAdministrator &&
      !can(principal, 'customer_requests', 'edit') &&
      !can(principal, 'contents', 'edit')
    ) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids : [];
    const targetUserId = body.targetUserId ? Number(body.targetUserId) : null;
    const reason = typeof body.reason === 'string' ? body.reason : '';

    if (!ids.length) {
      return NextResponse.json({ error: 'Chưa chọn yêu cầu nào để phân công.' }, { status: 400 });
    }

    const result = await reassignCustomerRequests(ids, targetUserId, reason, principal);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}

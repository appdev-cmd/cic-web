import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { updateCustomerRequestPriority } from '@/features/customer-requests/server/mutations';
import type { PriorityLevel } from '@/features/customer-requests/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  if (normalized.code === 'VALIDATION_ERROR') return NextResponse.json({ error: normalized.message }, { status: 400 });
  console.error('[API updatePriority Error]', error);
  return NextResponse.json({ error: normalized.message || 'Internal Server Error' }, { status: 500 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (
      !principal.isAdministrator &&
      !can(principal, 'customer_requests', 'edit') &&
      !can(principal, 'contents', 'edit')
    ) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const priority = body.priority as PriorityLevel;

    if (!priority) {
      return NextResponse.json({ error: 'Độ ưu tiên không hợp lệ.' }, { status: 400 });
    }

    const result = await updateCustomerRequestPriority(decodeURIComponent(id), priority, principal);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}

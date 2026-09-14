import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { listCustomerRequests } from '@/features/customer-requests/server/queries';
import type { RequestListTabType, RequestStatus } from '@/features/customer-requests/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  if (normalized.code === 'VALIDATION_ERROR') return NextResponse.json({ error: normalized.message }, { status: 400 });
  console.error('[API /api/cms/customer-requests Error]', error);
  return NextResponse.json({ error: normalized.message || 'Internal Server Error' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (
      !principal.isAdministrator &&
      !can(principal, 'customer_requests', 'view') &&
      !can(principal, 'contents', 'view')
    ) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const workspace = (searchParams.get('workspace') || 'vi') as 'vi' | 'en';
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const tab = (searchParams.get('tab') || undefined) as RequestListTabType | undefined;
    const status = (searchParams.get('status') || undefined) as RequestStatus | undefined;
    const formId = searchParams.get('formId') || undefined;
    const ctaId = searchParams.get('ctaId') || undefined;
    const assignedUserId = searchParams.get('assignedUserId') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;

    const data = await listCustomerRequests({
      workspace,
      searchQuery,
      tab,
      status,
      formId,
      ctaId,
      assignedUserId,
      dateFrom,
      dateTo,
      page,
      pageSize,
    });

    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}

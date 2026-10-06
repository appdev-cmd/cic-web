import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { listCustomerRequests } from '@/features/customer-requests/server/queries';
import { formatCustomerRequestsCsv } from '@/features/customer-requests/server/csv-export';
import type { RequestListTabType, RequestStatus } from '@/features/customer-requests/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  if (normalized.code === 'FORBIDDEN') {
    return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  }
  if (normalized.code === 'VALIDATION_ERROR') {
    return NextResponse.json({ error: normalized.message }, { status: 400 });
  }
  console.error('[API /api/cms/customer-requests/export Error]', error);
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

    // Fetch the FULL dataset matching the filters (no 10-item page limit)
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
      unlimited: true,
    });

    const requests = data.requests || [];

    // Format into polished CSV with UTF-8 BOM, metadata header and Excel phone formula
    const csvContent = formatCustomerRequestsCsv(requests, {
      workspace,
      searchQuery,
      tab,
      status,
      formId,
      ctaId,
      dateFrom,
      dateTo,
      totalCount: requests.length,
    });

    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
    const filename = `Bao_cao_yeu_cau_khach_hang_${dateStamp}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { deleteForms } from '@/features/forms/server/mutations';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/forms/bulk-delete Error]', error);
  return NextResponse.json({ error: (error as any)?.message || 'Internal Server Error' }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'delete') && !can(principal, 'contents', 'delete')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids : [];
    if (ids.length === 0) {
      return NextResponse.json({ error: 'Danh sách ID không được rỗng.' }, { status: 400 });
    }

    const { count } = await deleteForms(ids, principal);
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    return errorResponse(err);
  }
}

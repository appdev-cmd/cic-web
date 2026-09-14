import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { getFormSubmissions } from '@/features/forms/server/queries';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/forms/[id]/submissions Error]', error);
  return NextResponse.json({ error: (error as any)?.message || 'Internal Server Error' }, { status: 500 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'view') && !can(principal, 'contents', 'view')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 50;

    const submissions = await getFormSubmissions(id, limit);
    return NextResponse.json({ submissions });
  } catch (err) {
    return errorResponse(err);
  }
}

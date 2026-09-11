import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { deleteEmailTemplates } from '@/features/email-templates/server/mutations';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/email-templates/bulk-delete Error]', error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'email_templates', 'delete') && !can(principal, 'contents', 'delete')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const body = await request.json();
    const ids: string[] = body.ids || [];
    if (!ids.length) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    const result = await deleteEmailTemplates(ids);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return errorResponse(err);
  }
}

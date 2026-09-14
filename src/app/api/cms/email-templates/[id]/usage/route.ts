import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { getEmailTemplateUsage, isValidEmailTemplateId } from '@/features/email-templates/server/queries';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  if (normalized.code === 'VALIDATION_ERROR') return NextResponse.json({ error: normalized.message }, { status: 400 });
  console.error('[API /api/cms/email-templates/[id]/usage Error]', error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'email_templates', 'view') && !can(principal, 'contents', 'view')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    if (!isValidEmailTemplateId(id)) {
      return NextResponse.json({ error: 'Invalid email template ID.' }, { status: 400 });
    }

    const usages = await getEmailTemplateUsage(id.trim());
    return NextResponse.json({ usages });
  } catch (err) {
    return errorResponse(err);
  }
}

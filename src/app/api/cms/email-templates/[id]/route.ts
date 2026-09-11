import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { getEmailTemplateDetail } from '@/features/email-templates/server/queries';
import { updateEmailTemplate, archiveEmailTemplates, deleteEmailTemplates } from '@/features/email-templates/server/mutations';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/email-templates/[id] Error]', error);
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
    const detail = await getEmailTemplateDetail(id);
    if (!detail) {
      return NextResponse.json({ error: 'Email template not found.' }, { status: 404 });
    }

    return NextResponse.json({ template: detail });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'email_templates', 'edit') && !can(principal, 'contents', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const result = await updateEmailTemplate(
      id,
      {
        name: body.name,
        event: body.event,
        audience: body.audience,
        subject: body.subject,
        content: body.content,
        status: body.status,
        publishNow: Boolean(body.publishNow),
      },
      principal.legacyUserId
    );

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'email_templates', 'delete') && !can(principal, 'contents', 'delete')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const result = await deleteEmailTemplates([id]);

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    return errorResponse(err);
  }
}

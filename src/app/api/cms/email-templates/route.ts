import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { listEmailTemplates } from '@/features/email-templates/server/queries';
import { createEmailTemplate } from '@/features/email-templates/server/mutations';
import type { EmailAudience, EmailTemplateStatus, EmailWorkspace } from '@/features/email-templates/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/email-templates Error]', error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'email_templates', 'view') && !can(principal, 'contents', 'view')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const workspace = (searchParams.get('workspace') as EmailWorkspace) || 'vi';
    const event = searchParams.get('event') || undefined;
    const audience = (searchParams.get('audience') as EmailAudience) || undefined;
    const status = (searchParams.get('status') as EmailTemplateStatus) || undefined;
    const search = searchParams.get('search') || undefined;

    const templates = await listEmailTemplates({ workspace, event, audience, status, search });
    return NextResponse.json({ templates });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'email_templates', 'create') && !can(principal, 'contents', 'create')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.event || !body.audience || !body.subject || !body.content) {
      return NextResponse.json({ error: 'Missing required fields (name, event, audience, subject, content).' }, { status: 400 });
    }

    const result = await createEmailTemplate(
      {
        workspace: body.workspace || 'vi',
        name: body.name,
        event: body.event,
        audience: body.audience,
        subject: body.subject,
        content: body.content,
        status: body.status || 'draft',
        publishNow: Boolean(body.publishNow),
      },
      principal.legacyUserId
    );

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

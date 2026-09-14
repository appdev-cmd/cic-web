import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { listCtas } from '@/features/cta/server/queries';
import { createCta } from '@/features/cta/server/mutations';
import type { CtaStatus, CtaWorkspace } from '@/features/cta/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/cta Error]', error);
  return NextResponse.json({ error: (error as any)?.message || 'Internal Server Error' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'cta', 'view') && !can(principal, 'contents', 'view')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const workspace = (searchParams.get('workspace') as CtaWorkspace) || 'vi';
    const status = (searchParams.get('status') as CtaStatus) || undefined;
    const actionType = (searchParams.get('actionType') as any) || undefined;
    const search = searchParams.get('search') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;

    const ctas = await listCtas({
      workspace,
      status,
      actionType,
      search,
      dateFrom,
      dateTo,
      sortBy,
    });

    return NextResponse.json({ ctas });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'cta', 'create') && !can(principal, 'contents', 'create')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const body = await request.json();
    const actionType = body.actionType || body.actionConfig?.type;
    if (!body.adminName || !body.displayText || !body.code || !actionType) {
      return NextResponse.json(
        { error: 'Thiếu các trường bắt buộc (adminName, displayText, code, actionType).' },
        { status: 400 }
      );
    }

    const created = await createCta(
      {
        workspace: body.workspace || 'vi',
        code: body.code,
        adminName: body.adminName,
        displayText: body.displayText,
        description: body.description,
        icon: body.icon,
        styleVariant: body.styleVariant || 'primary',
        actionType,
        actionConfig: body.actionConfig || {},
        formId: body.formId,
        mediaAssetId: body.mediaAssetId,
        emailTemplateId: body.emailTemplateId,
        status: body.status || 'draft',
      },
      principal
    );

    return NextResponse.json({ cta: created }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

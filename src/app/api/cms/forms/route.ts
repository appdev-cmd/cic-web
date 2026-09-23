import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { listForms } from '@/features/forms/server/queries';
import { createForm } from '@/features/forms/server/mutations';
import type { FormStatus, FormWorkspace } from '@/features/forms/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/forms Error]', error);
  return NextResponse.json({ error: (error as any)?.message || 'Internal Server Error' }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'view') && !can(principal, 'contents', 'view')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const workspace = (searchParams.get('workspace') as FormWorkspace) || 'vi';
    const status = (searchParams.get('status') as FormStatus) || undefined;
    const search = searchParams.get('search') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;

    const forms = await listForms({
      workspace,
      status,
      search,
      dateFrom,
      dateTo,
      sortBy,
    });

    return NextResponse.json({ forms });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'create') && !can(principal, 'contents', 'create')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const body = await request.json();
    if (!body.adminName || !body.title || !body.code || !body.fields || !body.submitConfig) {
      return NextResponse.json(
        { error: 'Thiếu các trường bắt buộc (adminName, title, code, fields, submitConfig).' },
        { status: 400 }
      );
    }

    const form = await createForm(
      {
        workspace: body.workspace || 'vi',
        code: body.code.trim(),
        adminName: body.adminName.trim(),
        title: body.title.trim(),
        description: body.description?.trim(),
        status: body.status || 'draft',
        submitConfig: body.submitConfig,
        destinations: body.destinations,
        fields: body.fields,
      },
      principal
    );

    return NextResponse.json({ form }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

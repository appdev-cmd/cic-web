import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { getFormById } from '@/features/forms/server/queries';
import { updateForm, updateFormStatus, deleteForms } from '@/features/forms/server/mutations';
import type { FormStatus } from '@/features/forms/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/forms/[id] Error]', error);
  return NextResponse.json({ error: (error as any)?.message || 'Internal Server Error' }, { status: 500 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'view') && !can(principal, 'contents', 'view')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const form = await getFormById(id);
    if (!form) {
      return NextResponse.json({ error: 'Không tìm thấy biểu mẫu.' }, { status: 404 });
    }

    return NextResponse.json({ form });
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
    if (!principal.isAdministrator && !can(principal, 'forms', 'edit') && !can(principal, 'contents', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.adminName || !body.title || !body.fields || !body.submitConfig) {
      return NextResponse.json(
        { error: 'Thiếu các trường bắt buộc (adminName, title, fields, submitConfig).' },
        { status: 400 }
      );
    }

    const form = await updateForm(
      id,
      {
        adminName: body.adminName.trim(),
        title: body.title.trim(),
        description: body.description?.trim(),
        status: body.status,
        incrementVersion: Boolean(body.incrementVersion),
        submitConfig: body.submitConfig,
        fields: body.fields,
      },
      principal
    );

    return NextResponse.json({ form });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'forms', 'edit') && !can(principal, 'contents', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    if (!body.status) {
      return NextResponse.json({ error: 'Thiếu trường status.' }, { status: 400 });
    }

    const form = await updateFormStatus(id, body.status as FormStatus, principal);
    return NextResponse.json({ form });
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
    if (!principal.isAdministrator && !can(principal, 'forms', 'delete') && !can(principal, 'contents', 'delete')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    await deleteForms([id], principal);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}

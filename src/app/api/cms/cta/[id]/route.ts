import { NextRequest, NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { normalizeServerError } from '@/server/errors';
import { getCtaById } from '@/features/cta/server/queries';
import { updateCta, updateCtaStatus, deleteCtas } from '@/features/cta/server/mutations';
import type { CtaStatus } from '@/features/cta/types';

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  console.error('[API /api/cms/cta/[id] Error]', error);
  return NextResponse.json({ error: (error as any)?.message || 'Internal Server Error' }, { status: 500 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!principal.isAdministrator && !can(principal, 'cta', 'view') && !can(principal, 'contents', 'view')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const cta = await getCtaById(id);
    if (!cta) {
      return NextResponse.json({ error: 'Không tìm thấy CTA.' }, { status: 404 });
    }

    return NextResponse.json({ cta });
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
    if (!principal.isAdministrator && !can(principal, 'cta', 'edit') && !can(principal, 'contents', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const actionType = body.actionType || body.actionConfig?.type;

    if (!body.adminName || !body.displayText || !actionType) {
      return NextResponse.json(
        { error: 'Thiếu các trường bắt buộc (adminName, displayText, actionType).' },
        { status: 400 }
      );
    }

    const updated = await updateCta(
      id,
      {
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
        status: body.status,
      },
      principal
    );

    return NextResponse.json({ cta: updated });
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
    if (!principal.isAdministrator && !can(principal, 'cta', 'edit') && !can(principal, 'contents', 'edit')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json({ error: 'Thiếu trường status.' }, { status: 400 });
    }

    const updated = await updateCtaStatus(id, body.status as CtaStatus, principal);
    return NextResponse.json({ cta: updated });
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
    if (!principal.isAdministrator && !can(principal, 'cta', 'delete') && !can(principal, 'contents', 'delete')) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }

    const { id } = await params;
    const { count } = await deleteCtas([id], principal);
    if (count === 0) {
      return NextResponse.json({ error: 'Không tìm thấy CTA để xóa.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}

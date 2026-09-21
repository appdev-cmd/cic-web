import { NextResponse } from 'next/server';
import { getCtaByCode } from '@/features/cta/server/queries';
import type { CtaWorkspace } from '@/features/cta/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { searchParams } = new URL(req.url);
    const workspace = (searchParams.get('workspace') || 'vi') as CtaWorkspace;

    const cta = await getCtaByCode(workspace, code);
    if (!cta || cta.status !== 'active') {
      return NextResponse.json({ error: 'CTA không tồn tại hoặc chưa kích hoạt.' }, { status: 404 });
    }

    return NextResponse.json(cta);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Lỗi nạp CTA.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { submitDynamicForm } from '@/features/forms/server/mutations';
import { checkRateLimit, getClientIp } from '@/server/auth/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`form-submit:${ip}`, { maxRequests: 10, windowSeconds: 60 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    if (!body?.formId || !body?.values) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin formId hoặc values.' },
        { status: 400 }
      );
    }

    const result = await submitDynamicForm({
      formId: body.formId,
      sourceType: body.sourceType || 'website_form',
      sourceId: body.sourceId ? String(body.sourceId) : undefined,
      sourcePath: body.sourcePath || undefined,
      ctaId: body.ctaId ? String(body.ctaId) : undefined,
      placementKey: body.placementKey || undefined,
      values: body.values,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /api/forms/submit Error]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Có lỗi xảy ra khi gửi biểu mẫu.' },
      { status: 500 }
    );
  }
}

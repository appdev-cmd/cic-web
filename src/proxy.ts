import { NextResponse, type NextRequest } from 'next/server';

import { refreshSupabaseSession } from '@/server/supabase/proxy';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/events/') && /%3a|:/i.test(pathname)) {
    let decodedPath: string;
    try {
      decodedPath = decodeURIComponent(pathname);
    } catch {
      decodedPath = pathname;
    }
    const { resolveRedirect } = await import('@/features/function-seo/server/queries');
    const rule = await resolveRedirect(decodedPath);
    if (rule && rule.targetPath.startsWith('/') && !rule.targetPath.startsWith('//')) {
      const destination = new URL(rule.targetPath, request.url);
      destination.search = request.nextUrl.search;
      return NextResponse.redirect(destination, rule.statusCode);
    }
  }
  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', isEn ? 'en' : 'vi');

  if (pathname.startsWith('/cms') || pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {
    return refreshSupabaseSession(request);
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { NextResponse, type NextRequest } from 'next/server';

import { refreshSupabaseSession } from '@/server/supabase/proxy';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
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

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/news';
  if (url.hostname === '0.0.0.0') {
    url.hostname = request.headers.get('host')?.split(':')[0] || '127.0.0.1';
  }
  return NextResponse.redirect(url, 301);
}

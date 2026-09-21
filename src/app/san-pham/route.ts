import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL('/products', request.url);
  return NextResponse.redirect(url, 301);
}

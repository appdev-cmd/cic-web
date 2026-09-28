import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: Promise<{ slug: string }>;
}

function safeRedirect(request: NextRequest, targetPath: string) {
  const url = request.nextUrl.clone();
  url.pathname = targetPath;
  if (url.hostname === '0.0.0.0') {
    url.hostname = request.headers.get('host')?.split(':')[0] || '127.0.0.1';
  }
  return NextResponse.redirect(url, 301);
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { slug } = await params;
  if (!slug) {
    return safeRedirect(request, '/projects');
  }

  const cleanSlug = slug.replace(/\.html$/i, '');
  return safeRedirect(request, `/projects/${cleanSlug}`);
}

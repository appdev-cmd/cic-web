import { NextRequest, NextResponse } from 'next/server';
import { getPublishedProductById, getPublishedProductBySlug } from '@/features/products/server/queries';

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
    return safeRedirect(request, '/products');
  }

  // Pattern 1: standard legacy product format: [alias]-p[id].html
  const matchPattern = slug.match(/^(.*)-p(\d+)\.html$/i);
  if (matchPattern) {
    const legacySlug = matchPattern[1];
    const legacyId = parseInt(matchPattern[2], 10);

    if (Number.isFinite(legacyId) && legacyId > 0) {
      const product = await getPublishedProductById(legacyId);
      if (product && product.alias) {
        return safeRedirect(request, `/products/${product.alias}`);
      }
    }

    // Fallback: try lookup by legacy slug
    if (legacySlug) {
      const productBySlug = await getPublishedProductBySlug(legacySlug);
      if (productBySlug && productBySlug.slug) {
        return safeRedirect(request, `/products/${productBySlug.slug}`);
      }
    }
  }

  // Pattern 2: legacy product without -p[id], e.g. [alias].html or [alias]
  const cleanSlug = slug.replace(/\.html$/i, '');
  const productFallback = await getPublishedProductBySlug(cleanSlug);
  if (productFallback && productFallback.slug) {
    return safeRedirect(request, `/products/${productFallback.slug}`);
  }

  // If no matching product exists, return 404 to avoid soft-404 penalty
  return new NextResponse('Product Not Found', { status: 404 });
}

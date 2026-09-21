import { NextRequest, NextResponse } from 'next/server';
import { getPublishedProductById, getPublishedProductBySlug } from '@/features/products/server/queries';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.redirect(new URL('/products', request.url), 301);
  }

  // Pattern 1: standard legacy product format: [alias]-p[id].html
  const matchPattern = slug.match(/^(.*)-p(\d+)\.html$/i);
  if (matchPattern) {
    const legacySlug = matchPattern[1];
    const legacyId = parseInt(matchPattern[2], 10);

    if (Number.isFinite(legacyId) && legacyId > 0) {
      const product = await getPublishedProductById(legacyId);
      if (product && product.alias) {
        return NextResponse.redirect(new URL(`/products/${product.alias}`, request.url), 301);
      }
    }

    // Fallback: try lookup by legacy slug
    if (legacySlug) {
      const productBySlug = await getPublishedProductBySlug(legacySlug);
      if (productBySlug && productBySlug.slug) {
        return NextResponse.redirect(new URL(`/products/${productBySlug.slug}`, request.url), 301);
      }
    }
  }

  // Pattern 2: legacy product without -p[id], e.g. [alias].html or [alias]
  const cleanSlug = slug.replace(/\.html$/i, '');
  const productFallback = await getPublishedProductBySlug(cleanSlug);
  if (productFallback && productFallback.slug) {
    return NextResponse.redirect(new URL(`/products/${productFallback.slug}`, request.url), 301);
  }

  // If no matching product exists, return 404 to avoid soft-404 penalty
  return new NextResponse('Product Not Found', { status: 404 });
}

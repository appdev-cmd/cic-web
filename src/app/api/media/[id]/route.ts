import { NextRequest, NextResponse } from 'next/server';
import { getPostgresClient } from '@/server/db/postgres';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { MEDIA_BUCKET } from '@/features/media/constants';

const MEDIA_CACHE_TTL_MS = 1800_000; // 30 mins
const signedUrlCache = new Map<string, { url: string; mimeType: string | null; expiresAt: number }>();

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id || '').trim();

    if (!decodedId) {
      return NextResponse.json({ error: 'Asset ID or path is required' }, { status: 400 });
    }

    const cached = signedUrlCache.get(decodedId);
    if (cached && cached.expiresAt > Date.now()) {
      const isSvg = cached.mimeType === 'image/svg+xml' || decodedId.toLowerCase().endsWith('.svg');
      const response = NextResponse.redirect(cached.url, 307);
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
      if (cached.mimeType) {
        response.headers.set('Content-Type', cached.mimeType);
      }
      if (isSvg) {
        response.headers.set('Content-Disposition', 'attachment');
        response.headers.set('Content-Security-Policy', "default-src 'none'; sandbox");
      }
      return response;
    }

    let storagePath: string | null = null;
    let mimeType: string | null = null;

    // Strict lookup against cic_media_assets, always requiring deleted_at IS NULL.
    // Prohibits direct path bypassing to avoid exposing soft-deleted or uncatalogued assets.
    const sql = getPostgresClient();
    const rows = await sql<{ storage_path: string; mime_type: string | null }[]>`
      SELECT storage_path, mime_type
      FROM cic_media_assets
      WHERE (id::text = ${decodedId} OR storage_path = ${decodedId}) AND deleted_at IS NULL
      LIMIT 1
    `;
    if (rows.length > 0) {
      storagePath = rows[0].storage_path;
      mimeType = rows[0].mime_type;
    }

    if (!storagePath) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
    }

    const isSvg = mimeType === 'image/svg+xml' || storagePath.toLowerCase().endsWith('.svg');
    const { data, error } = await createSupabaseAdminClient()
      .storage.from(MEDIA_BUCKET)
      .createSignedUrl(storagePath, 43200, isSvg ? { download: true } : undefined);

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: 'Unable to sign media URL' }, { status: 500 });
    }

    signedUrlCache.set(decodedId, { url: data.signedUrl, mimeType, expiresAt: Date.now() + MEDIA_CACHE_TTL_MS });

    const response = NextResponse.redirect(data.signedUrl, 307);
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    if (mimeType) {
      response.headers.set('Content-Type', mimeType);
    }
    if (isSvg) {
      response.headers.set('Content-Disposition', 'attachment');
      response.headers.set('Content-Security-Policy', "default-src 'none'; sandbox");
    }
    return response;
  } catch (error) {
    console.error('Media resolver error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getPostgresClient } from '@/server/db/postgres';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { MEDIA_BUCKET } from '@/features/media/constants';

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

    let storagePath: string | null = null;
    let mimeType: string | null = null;

    if (decodedId.includes('/')) {
      storagePath = decodedId;
    } else {
      const sql = getPostgresClient();
      const rows = await sql<{ storage_path: string; mime_type: string | null }[]>`
        SELECT storage_path, mime_type
        FROM cic_media_assets
        WHERE id = ${decodedId} AND deleted_at IS NULL
        LIMIT 1
      `;
      if (rows.length > 0) {
        storagePath = rows[0].storage_path;
        mimeType = rows[0].mime_type;
      }
    }

    if (!storagePath) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
    }

    const { data, error } = await createSupabaseAdminClient()
      .storage.from(MEDIA_BUCKET)
      .createSignedUrl(storagePath, 43200);

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: 'Unable to sign media URL' }, { status: 500 });
    }

    const response = NextResponse.redirect(data.signedUrl, 307);
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    if (mimeType) {
      response.headers.set('Content-Type', mimeType);
    }
    return response;
  } catch (error) {
    console.error('Media resolver error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
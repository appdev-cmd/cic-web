import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getCurrentCmsPrincipal } from '@/server/auth/guards';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { MEDIA_BUCKET, MEDIA_MAX_FILE_BYTES } from '@/features/media/constants';
import { createMediaAsset } from '@/features/media/server/repository';

export const dynamic = 'force-dynamic';

const allowedMime = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
]);

const safeFilename = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(-180) || 'editor-image';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentCmsPrincipal().catch(() => null);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Bạn cần đăng nhập để tải ảnh lên.' } },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('upload');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { message: 'Không tìm thấy tệp ảnh hợp lệ.' } },
        { status: 400 }
      );
    }

    if (!allowedMime.has(file.type)) {
      return NextResponse.json(
        { error: { message: 'Chỉ chấp nhận các tệp định dạng hình ảnh (JPEG, PNG, WebP, GIF, SVG).' } },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MEDIA_MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: { message: 'Kích thước tệp không hợp lệ (tối đa 100 MB).' } },
        { status: 400 }
      );
    }

    const storagePath = `editor/${new Date().toISOString().slice(0, 7)}/${randomUUID()}-${safeFilename(file.name)}`;
    const supabase = createSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      return NextResponse.json(
        { error: { message: 'Lỗi tải ảnh lên kho lưu trữ.' } },
        { status: 500 }
      );
    }

    try {
      const asset = await createMediaAsset(
        {
          storagePath,
          filename: file.name,
          mimeType: file.type,
          fileSizeBytes: file.size,
          mediaType: 'image',
          locale: 'vi',
          title: file.name.replace(/\.[^.]+$/, ''),
          altText: '',
          folderId: null,
        },
        user
      );

      const url = `/api/media/${asset.id}`;
      return NextResponse.json({ url, default: url });
    } catch (dbError) {
      // Dọn dẹp storage nếu insert db thất bại
      await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
      throw dbError;
    }
  } catch (error) {
    console.error('Editor upload error:', error);
    return NextResponse.json(
      { error: { message: 'Đã xảy ra lỗi nội bộ khi xử lý tải ảnh.' } },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { MEDIA_BUCKET } from '@/features/media/constants';
import { createMediaAsset } from '@/features/media/server/repository';
import {
  EDITOR_ALLOWED_MIME_SET,
  EDITOR_MAX_FILE_BYTES,
  validateUploadedFileSecurity,
} from '@/shared/lib/file-security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentCmsPrincipal().catch(() => null);
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Bạn cần đăng nhập để tải ảnh lên.' } },
        { status: 401 }
      );
    }

    // Strict RBAC authorization: requires permission to create media or create/edit contents
    const hasUploadPermission =
      user.isAdministrator ||
      can(user, 'media', 'create') ||
      can(user, 'contents', 'create') ||
      can(user, 'contents', 'edit');

    if (!hasUploadPermission) {
      return NextResponse.json(
        { error: { message: 'Bạn không có quyền tải tệp lên hệ thống.' } },
        { status: 403 }
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

    // Comprehensive security validation:
    // - Size limit: 15MB max for editor images
    // - Extension matching against MIME
    // - Magic bytes verification
    // - SVG sanitization
    // - Image dimension limit (protection against decompression bombs)
    let validated;
    try {
      validated = await validateUploadedFileSecurity(file, {
        allowedMimes: EDITOR_ALLOWED_MIME_SET,
        maxFileSizeBytes: EDITOR_MAX_FILE_BYTES,
        checkDimensions: true,
      });
    } catch (valErr) {
      return NextResponse.json(
        { error: { message: valErr instanceof Error ? valErr.message : 'Tệp không đạt yêu cầu bảo mật.' } },
        { status: 400 }
      );
    }

    const storagePath = `editor/${new Date().toISOString().slice(0, 7)}/${randomUUID()}-${validated.safeFilename}`;
    const supabase = createSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, file, {
        contentType: validated.mimeType,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      return NextResponse.json(
        { error: { message: `Lỗi tải ảnh lên kho lưu trữ: ${uploadError.message}` } },
        { status: 500 }
      );
    }

    try {
      const asset = await createMediaAsset(
        {
          storagePath,
          filename: validated.safeFilename,
          mimeType: validated.mimeType,
          fileSizeBytes: file.size,
          mediaType: 'image',
          locale: 'vi',
          title: validated.safeFilename.replace(/\.[^.]+$/, ''),
          altText: '',
          folderId: null,
          width: validated.dimensions?.width ?? null,
          height: validated.dimensions?.height ?? null,
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
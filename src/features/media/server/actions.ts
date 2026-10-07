'use server';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { requirePermission } from '@/server/auth/guards';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { MEDIA_BUCKET, MEDIA_MAX_FILE_BYTES, type MediaLocale, type MediaType } from '../constants';
import {
  mediaAlbumInputSchema,
  mediaCropVariantSchema,
  mediaFocalPointSchema,
  mediaFolderInputSchema,
  mediaIdSchema,
  mediaMetadataPatchSchema,
  mediaReplaceRegistrationSchema,
  mediaUploadRegistrationSchema,
} from '../schemas/mediaInput';
import {
  createMediaAsset,
  createMediaFolder,
  deleteMediaAlbum,
  deleteMediaVariant,
  replaceMediaAsset,
  saveAssetFocalPoint,
  saveMediaAlbum,
  saveMediaCropVariant,
  trashMediaAssets,
  updateMediaMetadata,
} from './repository';
import { getPostgresClient } from '@/server/db/postgres';
import { getCmsMediaData, getCmsMediaPickerItems } from './queries';
import { MEDIA_ALLOWED_MIME_SET, validateUploadedFileSecurity } from '@/shared/lib/file-security';

const mediaType = (mime: string): MediaType =>
  mime.startsWith('image/') ? 'image' : mime.startsWith('video/') ? 'video' : 'document';

const refresh = () => {
  revalidatePath('/cms');
  revalidatePath('/cms/media');
};

async function uploadFile(file: File, locale: MediaLocale) {
  const validated = await validateUploadedFileSecurity(file, {
    allowedMimes: MEDIA_ALLOWED_MIME_SET,
    maxFileSizeBytes: MEDIA_MAX_FILE_BYTES,
    checkDimensions: true,
  });

  const path = `${locale}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}-${validated.safeFilename}`;
  const { error } = await createSupabaseAdminClient()
    .storage.from(MEDIA_BUCKET)
    .upload(path, file, {
      contentType: validated.mimeType,
      upsert: false,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Không thể tải tệp lên kho Media: ${error.message}`);
  }

  return {
    path,
    mime: validated.mimeType,
    filename: validated.safeFilename,
    dimensions: validated.dimensions,
  };
}

export async function refreshMediaAction(locale: MediaLocale) {
  return getCmsMediaData(locale);
}

export async function getMediaPickerItemsAction(locale: MediaLocale) {
  return getCmsMediaPickerItems(locale);
}

export async function uploadMediaAction(formData: FormData) {
  const actor = await requirePermission('media', 'create');
  const file = formData.get('file');
  if (!(file instanceof File)) throw new Error('Vui lòng chọn tệp cần tải lên.');

  const locale = formData.get('locale') === 'en' ? 'en' : 'vi';
  const { path, mime, filename, dimensions } = await uploadFile(file, locale);

  try {
    const input = mediaUploadRegistrationSchema.parse({
      storagePath: path,
      filename,
      mimeType: mime,
      fileSizeBytes: file.size,
      mediaType: mediaType(mime),
      locale,
      title: String(formData.get('title') || file.name),
      altText: String(formData.get('altText') || ''),
      folderId: formData.get('folderId') || null,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
    });

    const result = await createMediaAsset(input, actor);
    refresh();
    return result;
  } catch (error) {
    await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([path]);
    throw error;
  }
}

export async function updateMediaMetadataAction(rawId: unknown, payload: unknown) {
  const actor = await requirePermission('media', 'edit');
  await updateMediaMetadata(mediaIdSchema.parse(rawId), mediaMetadataPatchSchema.parse(payload), actor);
  refresh();
}

export async function createMediaFolderAction(payload: unknown) {
  const actor = await requirePermission('media', 'edit');
  const result = await createMediaFolder(mediaFolderInputSchema.parse(payload), actor);
  refresh();
  return result;
}

export async function saveMediaAlbumAction(rawId: unknown, payload: unknown) {
  const actor = await requirePermission('media', rawId ? 'edit' : 'create');
  const id = rawId ? mediaIdSchema.parse(rawId) : null;
  const result = await saveMediaAlbum(id, mediaAlbumInputSchema.parse(payload), actor);
  refresh();
  return result;
}

export async function deleteMediaAlbumAction(rawId: unknown) {
  const actor = await requirePermission('media', 'delete');
  await deleteMediaAlbum(mediaIdSchema.parse(rawId), actor);
  refresh();
}

export async function trashMediaAssetsAction(rawIds: unknown) {
  const actor = await requirePermission('media', 'delete');
  const ids = Array.isArray(rawIds) ? rawIds.map((id) => mediaIdSchema.parse(id)) : [];
  if (!ids.length || ids.length > 100) throw new Error('Vui lòng chọn từ 1 đến 100 tệp.');
  await trashMediaAssets([...new Set(ids)], actor);
  refresh();
}

export async function replaceMediaAssetAction(rawId: unknown, formData: FormData) {
  const actor = await requirePermission('media', 'replace');
  const id = mediaIdSchema.parse(rawId);
  const file = formData.get('file');
  if (!(file instanceof File)) throw new Error('Vui lòng chọn tệp thay thế.');

  const locale = formData.get('locale') === 'en' ? 'en' : 'vi';
  const { path, mime, filename, dimensions } = await uploadFile(file, locale);

  try {
    const input = mediaReplaceRegistrationSchema.parse({
      storagePath: path,
      filename,
      mimeType: mime,
      fileSizeBytes: file.size,
      note: String(formData.get('note') || 'Thay thế tệp'),
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      durationSeconds: null,
    });
    await replaceMediaAsset(id, input, actor);
    refresh();
  } catch (error) {
    await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([path]);
    throw error;
  }
}

export async function createCropVariantAction(rawPayload: unknown) {
  const actor = await requirePermission('media', 'edit');
  const payload = mediaCropVariantSchema.parse(rawPayload);

  const sql = getPostgresClient();
  const [asset] = await sql`
    SELECT id, filename, mime_type, storage_path, width, height
    FROM cic_media_assets WHERE id = ${payload.assetId} AND deleted_at IS NULL
  `;
  if (!asset) throw new Error('Không tìm thấy tệp Media.');

  const { data, error } = await createSupabaseAdminClient()
    .storage.from(MEDIA_BUCKET)
    .download(String(asset.storage_path));
  if (error || !data) {
    throw new Error(`Không thể đọc ảnh gốc từ kho lưu trữ: ${error?.message || 'Lỗi tải tệp'}`);
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  const sharp = (await import('sharp')).default;
  let img = sharp(buffer);

  if (payload.rotate && payload.rotate !== 0) {
    img = img.rotate(payload.rotate);
  }

  const meta = await img.metadata();
  const imgWidth = meta.width || Number(asset.width) || 1000;
  const imgHeight = meta.height || Number(asset.height) || 1000;

  const left = Math.max(0, Math.min(Math.round(payload.crop.x), imgWidth - 1));
  const top = Math.max(0, Math.min(Math.round(payload.crop.y), imgHeight - 1));
  const cropWidth = Math.max(1, Math.min(Math.round(payload.crop.width), imgWidth - left));
  const cropHeight = Math.max(1, Math.min(Math.round(payload.crop.height), imgHeight - top));

  const webpBuffer = await img
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .webp({ quality: 90 })
    .toBuffer();

  const presetSlug = payload.presetName.toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
  const variantPath = `${payload.locale}/variants/${payload.assetId}-${presetSlug}-${randomUUID().slice(0, 8)}.webp`;

  const { error: uploadError } = await createSupabaseAdminClient()
    .storage.from(MEDIA_BUCKET)
    .upload(variantPath, webpBuffer, {
      contentType: 'image/webp',
      upsert: true,
      cacheControl: '3600',
    });
  if (uploadError) {
    throw new Error(`Không thể lưu biến thể vào kho lưu trữ: ${uploadError.message}`);
  }

  try {
    const { variantId, oldStoragePath } = await saveMediaCropVariant(
      {
        assetId: payload.assetId,
        presetName: payload.presetName,
        width: cropWidth,
        height: cropHeight,
        format: 'webp',
        storagePath: variantPath,
        fileSizeBytes: webpBuffer.length,
        focalX: payload.focalX ?? null,
        focalY: payload.focalY ?? null,
      },
      actor
    );

    if (oldStoragePath && oldStoragePath !== variantPath) {
      await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([oldStoragePath]);
    }

    refresh();
    return { variantId, storagePath: variantPath, width: cropWidth, height: cropHeight, fileSizeBytes: webpBuffer.length };
  } catch (err) {
    await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([variantPath]);
    throw err;
  }
}

export async function saveMediaFocalPointAction(rawPayload: unknown) {
  const actor = await requirePermission('media', 'edit');
  const payload = mediaFocalPointSchema.parse(rawPayload);
  await saveAssetFocalPoint(payload.assetId, payload.focalX, payload.focalY, actor);
  refresh();
}

export async function deleteMediaVariantAction(rawVariantId: unknown) {
  const actor = await requirePermission('media', 'edit');
  const variantId = mediaIdSchema.parse(rawVariantId);
  const { storagePath } = await deleteMediaVariant(variantId, actor);
  if (storagePath) {
    await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([storagePath]);
  }
  refresh();
}


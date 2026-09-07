import 'server-only';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { MEDIA_BUCKET } from '../constants';

export async function createMediaSignedUrls(paths: string[], expiresIn = 3600) {
  const unique = [...new Set(paths.filter(Boolean))];
  if (!unique.length) return new Map<string, string>();
  const { data, error } = await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).createSignedUrls(unique, expiresIn);
  if (error) throw new Error('Không thể tạo liên kết Media an toàn.');
  return new Map(unique.map((path, index) => [path, data[index]?.signedUrl ?? '']));
}
export async function removeMediaObjects(paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))]; if (!unique.length) return;
  const { error } = await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove(unique);
  if (error) throw new Error('Không thể xóa tệp Media khỏi kho lưu trữ.');
}

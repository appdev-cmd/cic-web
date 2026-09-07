import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: 'require' });
try {
  const [result] = await sql`
    SELECT
      EXISTS (
        SELECT 1 FROM public.cic_permission_tasks
        WHERE lower(module)='media' AND published=true
          AND list_function LIKE '%view%' AND list_function LIKE '%create%'
          AND list_function LIKE '%edit%' AND list_function LIKE '%delete%'
          AND list_function LIKE '%replace%'
      ) AS permission_task,
      (SELECT count(*)::int FROM pg_class c
        WHERE c.oid IN (
          'public.cic_media_assets'::regclass, 'public.cic_media_asset_translations'::regclass,
          'public.cic_media_folders'::regclass, 'public.cic_media_folder_assets'::regclass,
          'public.cic_media_albums'::regclass, 'public.cic_media_album_assets'::regclass,
          'public.cic_media_versions'::regclass, 'public.cic_media_variants'::regclass
        ) AND c.relrowsecurity
      ) AS rls_tables,
      (SELECT count(*)::int FROM pg_policies
        WHERE schemaname='public' AND tablename LIKE 'cic_media_%'
          AND cmd='SELECT' AND roles @> ARRAY['authenticated']::name[]
      ) AS read_policies,
      (SELECT count(*)::int FROM pg_indexes WHERE schemaname='public' AND indexname IN (
        'idx_cic_media_assets_type_status_deleted','idx_cic_media_assets_updated_at',
        'idx_cic_media_assets_tags','idx_cic_media_asset_translations_locale_updated',
        'idx_cic_media_folders_workspace_ordering','idx_cic_media_folder_assets_folder_ordering',
        'idx_cic_media_albums_workspace_status_ordering','idx_cic_media_versions_asset_version'
      )) AS operational_indexes,
      EXISTS (
        SELECT 1 FROM storage.buckets WHERE id='cms-media' AND public=false
          AND file_size_limit=104857600
      ) AS private_bucket,
      (SELECT count(*)::int FROM pg_policies
        WHERE schemaname='storage' AND tablename='objects'
          AND policyname IN ('cms_media_read','cms_media_insert','cms_media_update','cms_media_delete')
      ) AS storage_policies
  `;
  if (!result.permission_task || Number(result.rls_tables) !== 8 || Number(result.read_policies) !== 8
    || Number(result.operational_indexes) !== 8 || !result.private_bucket || Number(result.storage_policies) !== 4) {
    throw new Error(`Media foundation verification failed: ${JSON.stringify(result)}`);
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  await sql.end({ timeout: 2 });
}

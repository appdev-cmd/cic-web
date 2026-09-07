BEGIN;

SELECT setval(
  pg_get_serial_sequence('public.cic_permission_tasks', 'id'),
  coalesce((SELECT max(id) FROM public.cic_permission_tasks), 1),
  EXISTS (SELECT 1 FROM public.cic_permission_tasks)
);

UPDATE public.cic_permission_tasks
SET view='Thư viện Media', _task='media',
    description='Xem, tải lên, cập nhật, thay thế và chuyển tài nguyên Media vào Thùng rác',
    published=true, list_function='view,create,edit,delete,replace'
WHERE lower(module)='media';

INSERT INTO public.cic_permission_tasks
  (module,view,_task,trigger,description,ordering,published,list_field,list_function,is_contents)
SELECT 'media','Thư viện Media','media',NULL,
       'Xem, tải lên, cập nhật, thay thế và chuyển tài nguyên Media vào Thùng rác',
       890,true,NULL,'view,create,edit,delete,replace',false
WHERE NOT EXISTS (SELECT 1 FROM public.cic_permission_tasks WHERE lower(module)='media');

CREATE INDEX IF NOT EXISTS idx_cic_media_assets_type_status_deleted
  ON public.cic_media_assets (media_type, workflow_status, deleted_at);
CREATE INDEX IF NOT EXISTS idx_cic_media_assets_updated_at
  ON public.cic_media_assets (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_media_assets_tags
  ON public.cic_media_assets USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_cic_media_asset_translations_locale_updated
  ON public.cic_media_asset_translations (locale, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_media_folders_workspace_ordering
  ON public.cic_media_folders (workspace, ordering, id);
CREATE INDEX IF NOT EXISTS idx_cic_media_folder_assets_folder_ordering
  ON public.cic_media_folder_assets (folder_id, ordering);
CREATE INDEX IF NOT EXISTS idx_cic_media_albums_workspace_status_ordering
  ON public.cic_media_albums (workspace, workflow_status, ordering, id);
CREATE INDEX IF NOT EXISTS idx_cic_media_versions_asset_version
  ON public.cic_media_versions (asset_id, version_number DESC);

DO $media_rls$
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'cic_media_assets', 'cic_media_asset_translations',
    'cic_media_folders', 'cic_media_folder_assets',
    'cic_media_albums', 'cic_media_album_assets',
    'cic_media_versions', 'cic_media_variants'
  ]
  LOOP
    policy_name := 'cms_authenticated_read_' || table_name;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated', table_name);
    EXECUTE format('GRANT SELECT ON TABLE public.%I TO authenticated', table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.cic_cms_has_permission(%L, %L))',
      policy_name, table_name, 'media', 'view'
    );
  END LOOP;
END
$media_rls$;

-- One private bucket stores source files and generated variants. Public delivery
-- must go through the future server Media resolver so restricted/deleted assets
-- cannot be exposed by a public object URL.
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES (
  'cms-media','cms-media',false,104857600,
  ARRAY[
    'image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml',
    'video/mp4','video/webm','application/pdf',
    'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public=false, file_size_limit=EXCLUDED.file_size_limit,
    allowed_mime_types=EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS cms_media_read ON storage.objects;
CREATE POLICY cms_media_read ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='cms-media' AND public.cic_cms_has_permission('media','view'));

DROP POLICY IF EXISTS cms_media_insert ON storage.objects;
CREATE POLICY cms_media_insert ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id='cms-media'
  AND public.cic_cms_has_permission('media','create')
  AND (storage.foldername(name))[1] IN ('vi','en','global')
);

DROP POLICY IF EXISTS cms_media_update ON storage.objects;
CREATE POLICY cms_media_update ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id='cms-media' AND public.cic_cms_has_permission('media','replace'))
WITH CHECK (
  bucket_id='cms-media'
  AND public.cic_cms_has_permission('media','replace')
  AND (storage.foldername(name))[1] IN ('vi','en','global')
);

DROP POLICY IF EXISTS cms_media_delete ON storage.objects;
CREATE POLICY cms_media_delete ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='cms-media' AND public.cic_cms_has_permission('media','delete'));

COMMIT;

BEGIN;

-- Permission catalog is code-owned. Re-running this migration is safe.
UPDATE public.cic_permission_tasks
SET view = 'Nhật ký hoạt động', _task = 'activity_logs',
    description = 'Xem, xem dữ liệu nhạy cảm và xuất nhật ký hoạt động',
    published = true
WHERE lower(module) = 'audit';

SELECT setval(
  pg_get_serial_sequence('public.cic_permission_tasks', 'id'),
  coalesce((SELECT max(id) FROM public.cic_permission_tasks), 1),
  EXISTS (SELECT 1 FROM public.cic_permission_tasks)
);

INSERT INTO public.cic_permission_tasks
  (module, view, _task, trigger, description, ordering, published, list_field, list_function, is_contents)
SELECT 'audit', 'Nhật ký hoạt động', 'activity_logs', NULL,
       'Xem, xem dữ liệu nhạy cảm và xuất nhật ký hoạt động', 900, true, NULL,
       'view,view_sensitive,export', false
WHERE NOT EXISTS (SELECT 1 FROM public.cic_permission_tasks WHERE lower(module) = 'audit');

-- Approved bootstrap principal for the migrated CIC administration account.
-- This does not create auth.users directly; Supabase Auth provisioning remains
-- owned by the supported Auth Admin API.
SELECT setval(pg_get_serial_sequence('public.cic_roles', 'id'),
  coalesce((SELECT max(id) FROM public.cic_roles), 1), EXISTS (SELECT 1 FROM public.cic_roles));
SELECT setval(pg_get_serial_sequence('public.cic_user_roles', 'id'),
  coalesce((SELECT max(id) FROM public.cic_user_roles), 1), EXISTS (SELECT 1 FROM public.cic_user_roles));

INSERT INTO public.cic_roles (code,name,description,status,is_protected)
SELECT 'superadmin','Super Administrator','Bootstrap administrator with full CMS access','active',true
WHERE NOT EXISTS (SELECT 1 FROM public.cic_roles WHERE lower(code)='superadmin');

INSERT INTO public.cic_user_roles (user_id,role_id,status)
SELECT u.id,r.id,'active'
FROM public.cic_users u CROSS JOIN public.cic_roles r
WHERE lower(u.email)='admin@cic.com.vn' AND lower(r.code)='superadmin'
  AND u.account_status='active' AND u.published IS DISTINCT FROM false
  AND NOT EXISTS (SELECT 1 FROM public.cic_user_roles ur WHERE ur.user_id=u.id AND ur.role_id=r.id AND ur.status='active');

CREATE INDEX IF NOT EXISTS idx_cic_activity_logs_occurred_at ON public.cic_activity_logs (occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_activity_logs_actor_occurred_at ON public.cic_activity_logs (actor_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_activity_logs_action_occurred_at ON public.cic_activity_logs (action_code, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_activity_logs_entity_occurred_at ON public.cic_activity_logs (entity_type, entity_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_activity_logs_category_result_occurred_at ON public.cic_activity_logs (category, result, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_activity_logs_correlation_id ON public.cic_activity_logs (correlation_id) WHERE correlation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cic_audit_export_jobs_requester_requested_at ON public.cic_audit_export_jobs (requested_by, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_audit_export_jobs_status_requested_at ON public.cic_audit_export_jobs (status, requested_at);
CREATE INDEX IF NOT EXISTS idx_cic_audit_export_jobs_expires_at ON public.cic_audit_export_jobs (expires_at);

DO $audit_export_constraints$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_audit_export_jobs'::regclass AND conname='cic_audit_export_jobs_status_check') THEN
    ALTER TABLE public.cic_audit_export_jobs ADD CONSTRAINT cic_audit_export_jobs_status_check CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'expired')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_audit_export_jobs'::regclass AND conname='cic_audit_export_jobs_workspace_check') THEN
    ALTER TABLE public.cic_audit_export_jobs ADD CONSTRAINT cic_audit_export_jobs_workspace_check CHECK (workspace IN ('global', 'vi', 'en')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_audit_export_jobs'::regclass AND conname='cic_audit_export_jobs_total_records_check') THEN
    ALTER TABLE public.cic_audit_export_jobs ADD CONSTRAINT cic_audit_export_jobs_total_records_check CHECK (total_records IS NULL OR total_records >= 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_audit_export_jobs'::regclass AND conname='cic_audit_export_jobs_file_size_bytes_check') THEN
    ALTER TABLE public.cic_audit_export_jobs ADD CONSTRAINT cic_audit_export_jobs_file_size_bytes_check CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0) NOT VALID;
  END IF;
END
$audit_export_constraints$;
ALTER TABLE public.cic_audit_export_jobs VALIDATE CONSTRAINT cic_audit_export_jobs_status_check;
ALTER TABLE public.cic_audit_export_jobs VALIDATE CONSTRAINT cic_audit_export_jobs_workspace_check;
ALTER TABLE public.cic_audit_export_jobs VALIDATE CONSTRAINT cic_audit_export_jobs_total_records_check;
ALTER TABLE public.cic_audit_export_jobs VALIDATE CONSTRAINT cic_audit_export_jobs_file_size_bytes_check;

CREATE OR REPLACE FUNCTION public.cic_cms_has_permission(required_module text, required_action text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cic_users u
    JOIN public.cic_user_roles ur ON ur.user_id = u.id AND ur.status = 'active'
    JOIN public.cic_roles r ON r.id = ur.role_id AND r.status = 'active'
    LEFT JOIN public.cic_role_permissions rp ON rp.role_id = r.id AND rp.allowed = true
    LEFT JOIN public.cic_permission_tasks pt ON pt.id = rp.permission_task_id AND pt.published = true
    WHERE lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      AND u.account_status = 'active' AND u.published IS DISTINCT FROM false
      AND (
        lower(r.code) IN ('admin', 'superadmin')
        OR (lower(pt.module) = lower(required_module) AND lower(rp.action) = lower(required_action))
      )
  );
$$;
REVOKE ALL ON FUNCTION public.cic_cms_has_permission(text, text) FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.cic_cms_has_permission(text, text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.cic_cms_user_id()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp AS $$
  SELECT id FROM public.cic_users
  WHERE lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    AND account_status = 'active' AND published IS DISTINCT FROM false
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.cic_cms_user_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cic_cms_user_id() TO authenticated, service_role;

-- CMS read access for legacy tables is explicit and permission-gated. These
-- policies do not grant anon access and do not apply to raw audit tables.
DO $cms_read_policies$
DECLARE
  item record;
  policy_name text;
BEGIN
  FOR item IN
    SELECT * FROM (VALUES
      ('cic_products', 'products'), ('cic_products_en', 'products'),
      ('cic_news', 'news'), ('cic_news_en', 'news'),
      ('cic_event', 'events'), ('cic_event_en', 'events'),
      ('cic_projects', 'projects'), ('cic_projects_en', 'projects'),
      ('cic_services', 'services'), ('cic_services_en', 'services'),
      ('cic_content_pages', 'static_pages'), ('cic_contact', 'contacts'),
      ('cic_media_assets', 'media'), ('cic_ctas', 'cta'),
      ('cic_forms', 'forms'), ('cic_form_fields', 'forms'),
      ('cic_users', 'users'), ('cic_user_status_history', 'users'),
      ('cic_security_events', 'users'),
      ('cic_products_categories', 'users'), ('cic_news_categories', 'users'),
      ('cic_roles', 'roles'), ('cic_user_roles', 'roles'),
      ('cic_role_permissions', 'permissions'),
      ('cic_permission_tasks', 'permissions'),
      ('cic_config', 'settings'), ('cic_config_en', 'settings'),
      ('cic_config_enjicad', 'settings'), ('cic_branches', 'settings'),
      ('cic_config_modules', 'function_seo'),
      ('cic_config_modules_en', 'function_seo')
    ) AS configured(table_name, permission_module)
    WHERE to_regclass('public.' || configured.table_name) IS NOT NULL
  LOOP
    policy_name := 'cms_authenticated_read_' || item.table_name;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', item.table_name);
    EXECUTE format('GRANT SELECT ON TABLE public.%I TO authenticated', item.table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, item.table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.cic_cms_has_permission(%L, %L))',
      policy_name, item.table_name, item.permission_module, 'view'
    );
  END LOOP;
END
$cms_read_policies$;

ALTER TABLE public.cic_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cic_audit_export_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audit_logs_authorized_read ON public.cic_activity_logs;
DROP POLICY IF EXISTS audit_export_jobs_authorized_read ON public.cic_audit_export_jobs;

REVOKE ALL ON public.cic_activity_logs, public.cic_audit_export_jobs FROM PUBLIC, anon, authenticated;
-- Raw audit rows are server-DAL only. This prevents audit.view users bypassing
-- audit.view_sensitive by querying before_data/after_data directly via PostgREST.

CREATE OR REPLACE FUNCTION public.cic_reject_audit_log_mutation()
RETURNS trigger LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  IF current_setting('app.audit_retention_mode', true) IS DISTINCT FROM 'on' THEN
    RAISE EXCEPTION 'cic_activity_logs is append-only';
  END IF;
  RETURN OLD;
END;
$$;
DROP TRIGGER IF EXISTS cic_activity_logs_append_only ON public.cic_activity_logs;
CREATE TRIGGER cic_activity_logs_append_only
BEFORE UPDATE OR DELETE ON public.cic_activity_logs
FOR EACH ROW EXECUTE FUNCTION public.cic_reject_audit_log_mutation();

-- Private bucket; only trusted service-role code uploads and creates signed URLs.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('audit-exports', 'audit-exports', false, 10485760, ARRAY['text/csv'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS audit_exports_insert_own ON storage.objects;
CREATE POLICY audit_exports_insert_own ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='audit-exports' AND public.cic_cms_has_permission('audit','export')
  AND (storage.foldername(name))[1] = public.cic_cms_user_id()::text);
DROP POLICY IF EXISTS audit_exports_read_own ON storage.objects;
CREATE POLICY audit_exports_read_own ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='audit-exports' AND public.cic_cms_has_permission('audit','export')
  AND (storage.foldername(name))[1] = public.cic_cms_user_id()::text);
DROP POLICY IF EXISTS audit_exports_delete_own ON storage.objects;
CREATE POLICY audit_exports_delete_own ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='audit-exports' AND public.cic_cms_has_permission('audit','export')
  AND (storage.foldername(name))[1] = public.cic_cms_user_id()::text);

COMMIT;

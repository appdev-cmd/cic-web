BEGIN;

ALTER TABLE public.cic_users ADD COLUMN IF NOT EXISTS auth_user_id uuid NULL;

DO $users_identity_backfill$
BEGIN
  IF to_regclass('auth.users') IS NOT NULL THEN
    UPDATE public.cic_users profile
    SET auth_user_id = account.id
    FROM auth.users account
    WHERE profile.auth_user_id IS NULL
      AND lower(profile.email) = lower(account.email);
  END IF;
END
$users_identity_backfill$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_users_auth_user_id
  ON public.cic_users (auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_users_username_normalized
  ON public.cic_users (lower(trim(username))) WHERE username IS NOT NULL AND trim(username) <> '';
CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_users_email_normalized
  ON public.cic_users (lower(trim(email))) WHERE email IS NOT NULL AND trim(email) <> '';
CREATE INDEX IF NOT EXISTS idx_cic_users_cms_list
  ON public.cic_users (account_status, ordering, id);
CREATE INDEX IF NOT EXISTS idx_cic_user_status_history_user_changed
  ON public.cic_user_status_history (user_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_security_events_user_created
  ON public.cic_security_events (user_id, created_at DESC);

DO $users_constraints$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_users'::regclass AND conname='cic_users_account_status_check') THEN
    ALTER TABLE public.cic_users ADD CONSTRAINT cic_users_account_status_check
      CHECK (account_status IN ('active','suspended','deactivated','pending_invite')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_user_roles'::regclass AND conname='cic_user_roles_status_check') THEN
    ALTER TABLE public.cic_user_roles ADD CONSTRAINT cic_user_roles_status_check
      CHECK (status IN ('active','inactive')) NOT VALID;
  END IF;
END
$users_constraints$;

ALTER TABLE public.cic_users VALIDATE CONSTRAINT cic_users_account_status_check;
ALTER TABLE public.cic_user_roles VALIDATE CONSTRAINT cic_user_roles_status_check;

-- Once the UUID bridge exists, authorization must resolve the CMS profile by
-- the authenticated subject. Email remains editable profile data, not identity.
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
    WHERE u.auth_user_id = auth.uid()
      AND u.account_status = 'active' AND u.published IS DISTINCT FROM false
      AND (
        lower(r.code) IN ('admin', 'superadmin')
        OR (lower(pt.module) = lower(required_module) AND lower(rp.action) = lower(required_action))
      )
  );
$$;
REVOKE ALL ON FUNCTION public.cic_cms_has_permission(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cic_cms_has_permission(text, text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.cic_cms_user_id()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp AS $$
  SELECT id FROM public.cic_users
  WHERE auth_user_id = auth.uid()
    AND account_status = 'active' AND published IS DISTINCT FROM false
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.cic_cms_user_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cic_cms_user_id() TO authenticated, service_role;

-- Browser clients may only read through permission-gated RLS. All writes,
-- credential synchronization and audit production remain server-DAL only.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.cic_users, public.cic_user_roles, public.cic_user_status_history, public.cic_security_events
  FROM PUBLIC, anon, authenticated;

COMMIT;

-- Migration: 20260915_static_pages_readiness.sql
-- Description: Static Pages / Page Builder Core RBAC Catalogue, Conservative Backfill, and Canonical Foundation Seed.
-- Scope: Home, About Group (about, organization, capacity_experience), Privacy Policy, Terms of Use.
-- NOTE: Contact is explicitly OUT OF PAGE BUILDER (managed via Settings/Branches + Contact Form).

BEGIN;

SELECT pg_advisory_xact_lock(hashtextextended('cic:static-pages:readiness', 0));

-- ============================================================================
-- 1. RBAC PERMISSION TASK: static_pages
-- ============================================================================

INSERT INTO public.cic_permission_tasks (
  module, view, _task, trigger, description, ordering, published, list_field, list_function, is_contents
)
SELECT
  'static_pages',
  'Trang nội dung',
  'static_pages',
  NULL,
  'Xem, biên tập, xem trước, xuất bản trang nội dung và tạo trang chính sách mới',
  850,
  true,
  NULL,
  'view,edit,preview,publish,create_legal',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.cic_permission_tasks WHERE lower(btrim(module)) = 'static_pages'
);

-- Conservative backfill from legacy contents tasks (IDs 10, 11) if any non-admin role permissions exist
DO $$
DECLARE
  sp_task_id integer;
BEGIN
  SELECT id INTO sp_task_id
  FROM public.cic_permission_tasks
  WHERE lower(btrim(module)) = 'static_pages'
  LIMIT 1;

  IF sp_task_id IS NOT NULL THEN
    -- Read permission -> view
    INSERT INTO public.cic_role_permissions (role_id, permission_task_id, action, allowed, updated_at, updated_by)
    SELECT DISTINCT rp.role_id, sp_task_id, 'view', true, now(), 1
    FROM public.cic_role_permissions rp
    WHERE rp.permission_task_id IN (10, 11)
      AND rp.action IN ('view', 'list', 'detail')
      AND rp.allowed = true
    ON CONFLICT DO NOTHING;

    -- Edit / Save permission -> edit, preview
    INSERT INTO public.cic_role_permissions (role_id, permission_task_id, action, allowed, updated_at, updated_by)
    SELECT DISTINCT rp.role_id, sp_task_id, 'edit', true, now(), 1
    FROM public.cic_role_permissions rp
    WHERE rp.permission_task_id IN (10, 11)
      AND rp.action IN ('add', 'save', 'edit', 'apply')
      AND rp.allowed = true
    ON CONFLICT DO NOTHING;

    INSERT INTO public.cic_role_permissions (role_id, permission_task_id, action, allowed, updated_at, updated_by)
    SELECT DISTINCT rp.role_id, sp_task_id, 'preview', true, now(), 1
    FROM public.cic_role_permissions rp
    WHERE rp.permission_task_id IN (10, 11)
      AND rp.action IN ('add', 'save', 'edit', 'apply')
      AND rp.allowed = true
    ON CONFLICT DO NOTHING;

    -- Publish permission -> publish
    INSERT INTO public.cic_role_permissions (role_id, permission_task_id, action, allowed, updated_at, updated_by)
    SELECT DISTINCT rp.role_id, sp_task_id, 'publish', true, now(), 1
    FROM public.cic_role_permissions rp
    WHERE rp.permission_task_id IN (10, 11)
      AND rp.action IN ('published', 'publish')
      AND rp.allowed = true
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Verify task
DO $$
DECLARE
  task_count integer;
BEGIN
  SELECT count(*) INTO task_count
  FROM public.cic_permission_tasks
  WHERE lower(btrim(module)) = 'static_pages'
    AND published IS TRUE;

  IF task_count < 1 THEN
    RAISE EXCEPTION 'static_pages RBAC task creation failed.';
  END IF;
END $$;

COMMIT;

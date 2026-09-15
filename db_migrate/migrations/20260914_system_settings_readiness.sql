BEGIN;

SELECT pg_advisory_xact_lock(hashtextextended('cic:system-settings:permission-catalogue', 0));

DO $$
BEGIN
  IF (
    SELECT count(*)
    FROM public.cic_permission_tasks
    WHERE lower(btrim(module)) IN ('settings', 'config')
  ) > 1 THEN
    RAISE EXCEPTION 'System Settings permission migration aborted: ambiguous settings/config tasks exist.';
  END IF;
END $$;

SELECT setval(
  pg_get_serial_sequence('public.cic_permission_tasks', 'id'),
  greatest(coalesce((SELECT max(id) FROM public.cic_permission_tasks), 1), 1),
  EXISTS (SELECT 1 FROM public.cic_permission_tasks)
);

UPDATE public.cic_permission_tasks
SET module = 'settings',
    view = 'Cấu hình hệ thống',
    _task = 'settings',
    description = 'Xem và cập nhật cấu hình hệ thống được phép quản lý',
    published = true,
    list_function = 'view,edit',
    is_contents = false
WHERE lower(btrim(module)) IN ('settings', 'config');

INSERT INTO public.cic_permission_tasks
  (module, view, _task, trigger, description, ordering, published, list_field, list_function, is_contents)
SELECT
  'settings',
  'Cấu hình hệ thống',
  'settings',
  NULL,
  'Xem và cập nhật cấu hình hệ thống được phép quản lý',
  920,
  true,
  NULL,
  'view,edit',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.cic_permission_tasks WHERE lower(btrim(module)) = 'settings'
);

DO $$
DECLARE
  task_count integer;
BEGIN
  SELECT count(*) INTO task_count
  FROM public.cic_permission_tasks
  WHERE lower(btrim(module)) = 'settings'
    AND _task = 'settings'
    AND published IS TRUE
    AND list_function = 'view,edit';

  IF task_count <> 1 THEN
    RAISE EXCEPTION 'System Settings permission catalogue verification failed: expected one published view/edit task, found %.', task_count;
  END IF;
END $$;

COMMIT;

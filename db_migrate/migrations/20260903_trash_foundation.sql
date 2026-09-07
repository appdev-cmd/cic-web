BEGIN;

-- Trash permission catalogue is backend-owned and idempotent.
SELECT setval(
  pg_get_serial_sequence('public.cic_permission_tasks', 'id'),
  coalesce((SELECT max(id) FROM public.cic_permission_tasks), 1),
  EXISTS (SELECT 1 FROM public.cic_permission_tasks)
);

UPDATE public.cic_permission_tasks
SET view='Thùng rác', _task='trash', description='Xem, phục hồi và xóa vĩnh viễn dữ liệu trong Thùng rác',
    published=true, list_function='view,restore,purge'
WHERE lower(module)='trash';

INSERT INTO public.cic_permission_tasks
  (module,view,_task,trigger,description,ordering,published,list_field,list_function,is_contents)
SELECT 'trash','Thùng rác','trash',NULL,'Xem, phục hồi và xóa vĩnh viễn dữ liệu trong Thùng rác',910,true,NULL,
       'view,restore,purge',false
WHERE NOT EXISTS (SELECT 1 FROM public.cic_permission_tasks WHERE lower(module)='trash');

CREATE INDEX IF NOT EXISTS idx_cic_trash_items_status_deleted_at
  ON public.cic_trash_items (status, deleted_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_trash_items_status_purge_after
  ON public.cic_trash_items (status, purge_after);
CREATE INDEX IF NOT EXISTS idx_cic_trash_items_deleted_by_deleted_at
  ON public.cic_trash_items (deleted_by, deleted_at DESC);
CREATE INDEX IF NOT EXISTS idx_cic_trash_items_retention_due
  ON public.cic_trash_items (purge_after)
  WHERE status='trashed' AND is_legal_hold=false AND purge_after IS NOT NULL;

DO $trash_constraints$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_trash_items'::regclass AND conname='cic_trash_items_workspace_check') THEN
    ALTER TABLE public.cic_trash_items ADD CONSTRAINT cic_trash_items_workspace_check
      CHECK (workspace IN ('global','vi','en')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_trash_items'::regclass AND conname='cic_trash_items_identity_not_blank_check') THEN
    ALTER TABLE public.cic_trash_items ADD CONSTRAINT cic_trash_items_identity_not_blank_check
      CHECK (btrim(entity_type)<>'' AND btrim(entity_id)<>'' AND btrim(module)<>'') NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_trash_items'::regclass AND conname='cic_trash_items_legal_hold_reason_check') THEN
    ALTER TABLE public.cic_trash_items ADD CONSTRAINT cic_trash_items_legal_hold_reason_check
      CHECK (NOT is_legal_hold OR nullif(btrim(legal_hold_reason),'') IS NOT NULL) NOT VALID;
  END IF;
END
$trash_constraints$;

ALTER TABLE public.cic_trash_items VALIDATE CONSTRAINT cic_trash_items_workspace_check;
ALTER TABLE public.cic_trash_items VALIDATE CONSTRAINT cic_trash_items_identity_not_blank_check;
ALTER TABLE public.cic_trash_items VALIDATE CONSTRAINT cic_trash_items_legal_hold_reason_check;

ALTER TABLE public.cic_trash_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trash_items_browser_read ON public.cic_trash_items;
DROP POLICY IF EXISTS cms_authenticated_read_cic_trash_items ON public.cic_trash_items;
REVOKE ALL ON TABLE public.cic_trash_items FROM PUBLIC, anon, authenticated;
-- Snapshot rows remain server-DAL only. CMS users receive redacted projections
-- after application-level trash.view authorization, never raw payload_snapshot.

COMMIT;


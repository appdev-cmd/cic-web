BEGIN;

SELECT pg_advisory_xact_lock(hashtextextended('cic:services:hardening', 0));

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.cic_services
    WHERE alias IS NULL OR btrim(alias) = ''
  ) OR EXISTS (
    SELECT 1 FROM public.cic_services_en
    WHERE alias IS NULL OR btrim(alias) = ''
  ) THEN
    RAISE EXCEPTION 'Service hardening aborted: NULL/blank aliases require an explicit data policy.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.cic_services
    GROUP BY lower(btrim(alias)) HAVING count(*) > 1
  ) OR EXISTS (
    SELECT 1 FROM public.cic_services_en
    GROUP BY lower(btrim(alias)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Service hardening aborted: duplicate normalized aliases require cleanup.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cic_services'::regclass
      AND conname = 'ck_cic_services_alias_nonblank'
  ) THEN
    ALTER TABLE public.cic_services
      ADD CONSTRAINT ck_cic_services_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias) <> '') NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cic_services_en'::regclass
      AND conname = 'ck_cic_services_en_alias_nonblank'
  ) THEN
    ALTER TABLE public.cic_services_en
      ADD CONSTRAINT ck_cic_services_en_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias) <> '') NOT VALID;
  END IF;
END $$;

ALTER TABLE public.cic_services
  VALIDATE CONSTRAINT ck_cic_services_alias_nonblank;
ALTER TABLE public.cic_services_en
  VALIDATE CONSTRAINT ck_cic_services_en_alias_nonblank;

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_services_alias_norm
  ON public.cic_services (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_services_en_alias_norm
  ON public.cic_services_en (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

SELECT setval(
  pg_get_serial_sequence('public.cic_services', 'id'),
  greatest(coalesce((SELECT max(id) FROM public.cic_services), 0), 1),
  (SELECT count(*) > 0 FROM public.cic_services)
);

SELECT setval(
  pg_get_serial_sequence('public.cic_services_en', 'id'),
  greatest(coalesce((SELECT max(id) FROM public.cic_services_en), 0), 1),
  (SELECT count(*) > 0 FROM public.cic_services_en)
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.cic_services
    WHERE alias IS NULL OR btrim(alias) = ''
  ) OR EXISTS (
    SELECT 1 FROM public.cic_services_en
    WHERE alias IS NULL OR btrim(alias) = ''
  ) OR EXISTS (
    SELECT 1 FROM public.cic_services
    GROUP BY lower(btrim(alias)) HAVING count(*) > 1
  ) OR EXISTS (
    SELECT 1 FROM public.cic_services_en
    GROUP BY lower(btrim(alias)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Service hardening verification failed.';
  END IF;
END $$;

COMMIT;

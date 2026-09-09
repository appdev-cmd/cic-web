BEGIN;

SELECT setval(pg_get_serial_sequence('public.cic_business','id'),GREATEST(COALESCE((SELECT max(id) FROM public.cic_business),1),1),true);
SELECT setval(pg_get_serial_sequence('public.cic_business_en','id'),GREATEST(COALESCE((SELECT max(id) FROM public.cic_business_en),1),1),true);

CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_business_alias_normalized
  ON public.cic_business (lower(btrim(alias))) WHERE nullif(btrim(alias),'') IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_business_en_alias_normalized
  ON public.cic_business_en (lower(btrim(alias))) WHERE nullif(btrim(alias),'') IS NOT NULL;

COMMIT;

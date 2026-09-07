BEGIN;
SELECT setval(
  pg_get_serial_sequence('cic_manufactories', 'id'),
  GREATEST(COALESCE((SELECT max(id) FROM cic_manufactories), 1), 1),
  true
);
SELECT setval(
  pg_get_serial_sequence('cic_manufactories_en', 'id'),
  GREATEST(COALESCE((SELECT max(id) FROM cic_manufactories_en), 1), 1),
  true
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_manufactories_alias_normalized ON cic_manufactories(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_manufactories_en_alias_normalized ON cic_manufactories_en(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
COMMIT;

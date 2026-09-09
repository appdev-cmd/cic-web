BEGIN;
SELECT setval(pg_get_serial_sequence('cic_application','id'),GREATEST(COALESCE((SELECT max(id) FROM cic_application),1),1),true);
SELECT setval(pg_get_serial_sequence('cic_application_en','id'),GREATEST(COALESCE((SELECT max(id) FROM cic_application_en),1),1),true);
CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_application_alias_normalized ON cic_application(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_application_en_alias_normalized ON cic_application_en(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
COMMIT;

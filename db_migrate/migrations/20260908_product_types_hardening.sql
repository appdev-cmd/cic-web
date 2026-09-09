BEGIN;
SELECT setval(pg_get_serial_sequence('cic_products_types','id'),GREATEST(COALESCE((SELECT max(id) FROM cic_products_types),1),1),true);
SELECT setval(pg_get_serial_sequence('cic_products_types_en','id'),GREATEST(COALESCE((SELECT max(id) FROM cic_products_types_en),1),1),true);
CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_products_types_alias_normalized ON cic_products_types(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
CREATE UNIQUE INDEX IF NOT EXISTS uq_cic_products_types_en_alias_normalized ON cic_products_types_en(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
COMMIT;

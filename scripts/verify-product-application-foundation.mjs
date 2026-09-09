import assert from 'node:assert/strict';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 1, prepare: false });
try {
  const [state] = await sql.unsafe(`
    SELECT
      (SELECT count(*)::int FROM cic_products_applications_rel) vi_relations,
      (SELECT count(*)::int FROM cic_products_applications_rel_en) en_relations,
      (SELECT count(*)::int FROM cic_products_applications_rel r LEFT JOIN cic_application a ON a.id=r.application_id WHERE a.id IS NULL) vi_orphans,
      (SELECT count(*)::int FROM cic_products_applications_rel_en r LEFT JOIN cic_application_en a ON a.id=r.application_id WHERE a.id IS NULL) en_orphans,
      (SELECT count(*)::int FROM pg_indexes WHERE schemaname='public' AND indexname='uq_cic_application_alias_normalized') vi_unique_index,
      (SELECT count(*)::int FROM pg_indexes WHERE schemaname='public' AND indexname='uq_cic_application_en_alias_normalized') en_unique_index,
      (SELECT count(*)::int FROM cic_application WHERE alias LIKE 'application-roundtrip-%') fixture_rows,
      (SELECT count(*)::int FROM cic_trash_items WHERE entity_type IN ('product_application','product_application_en') AND title_snapshot LIKE 'Lĩnh vực kiểm thử roundtrip%') fixture_trash,
      (SELECT count(*)::int FROM cic_activity_logs WHERE entity_type='product_application' AND entity_title LIKE 'Lĩnh vực kiểm thử roundtrip%') roundtrip_audit_events
  `);
  assert.equal(state.vi_orphans, 0);
  assert.equal(state.en_orphans, 0);
  assert.equal(state.vi_unique_index, 1);
  assert.equal(state.en_unique_index, 1);
  assert.equal(state.fixture_rows, 0);
  assert.equal(state.fixture_trash, 0);
  console.log(JSON.stringify(state, null, 2));
} finally {
  await sql.end();
}

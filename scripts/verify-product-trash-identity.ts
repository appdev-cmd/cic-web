import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { saveProduct, trashProduct } from '../src/features/products/server/repository.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';
import type { ProductLocale } from '../src/features/products/types.ts';

const sql = getPostgresClient();
const marker = `product-trash-identity-${Date.now()}`;
const [actorRow] = await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`;
if (!actorRow) throw new Error('Product Trash verification requires one CMS actor.');
const actor = { legacyUserId: Number(actorRow.id), fullName: 'Product Trash verifier', username: 'verifier', email: '', isAdministrator: true, roleCodes: ['superadmin'], permissions: [], authUser: {} as CmsPrincipal['authUser'] } satisfies CmsPrincipal;
const createdIds: Array<{ locale: ProductLocale; id: number }> = [];
const trashIds: string[] = [];

const names = (locale: ProductLocale) => locale === 'en'
  ? { p: 'cic_products_en', c: 'cic_products_categories_en', a: 'cic_application_en', cr: 'cic_products_categories_rel_en', ar: 'cic_products_applications_rel_en', rr: 'cic_products_related_rel_en', im: 'cic_products_images_en' }
  : { p: 'cic_products', c: 'cic_products_categories', a: 'cic_application', cr: 'cic_products_categories_rel', ar: 'cic_products_applications_rel', rr: 'cic_products_related_rel', im: 'cic_products_images' };

async function verifyLocale(locale: ProductLocale) {
  const t = names(locale);
  const [category] = await sql.unsafe(`SELECT id FROM ${t.c} ORDER BY id LIMIT 1`);
  const [application] = await sql.unsafe(`SELECT id FROM ${t.a} ORDER BY id LIMIT 1`);
  const [related] = await sql.unsafe(`SELECT id FROM ${t.p} ORDER BY id LIMIT 1`);
  if (!category || !related) throw new Error(`${locale} verification requires category and related product fixtures.`);
  const alias = `${marker}-${locale}`;
  const payload = { name: `Identity verifier ${locale}`, alias, code: alias, other_languages1: '', summary: 'Roundtrip', description: '<p>Original content</p>', feature_details: '<p>Original feature</p>', video: '', tawk_to: '', image: '', icon: '', price: 'Contact', tags: ['verify'], landing_page: '', seo_title: 'Verify', seo_keyword: '', seo_description: '', file_catalogue: '', file_price: '', link_catalogue: '', file_driver_name: '', file_driver: '', link_driver: '', downloads: [], categoryIds: [Number(category.id)], applicationIds: application ? [Number(application.id)] : [], relatedProductIds: [Number(related.id)], manufactoryId: null, typeId: null, published: true, is_hot: false, teamview: false, ordering: 999999 };

  const originalId = Number((await saveProduct(locale, null, payload, actor)).id);
  createdIds.push({ locale, id: originalId });
  await saveProduct(locale, originalId, { ...payload, name: `Identity verifier updated ${locale}` }, actor);
  const [image] = await sql.unsafe(`INSERT INTO ${t.im}(record_id,image,ordering,title) VALUES($1,$2,1,$3) RETURNING id`, [originalId, `/${alias}.jpg`, `Image ${locale}`]);
  const originalImageId = Number(image.id);
  const moved = await trashProduct(locale, originalId, actor);
  trashIds.push(moved.trashId);
  assert.equal((await sql.unsafe(`SELECT 1 FROM ${t.p} WHERE id=$1`, [originalId])).length, 0);

  const [trash] = await sql`SELECT payload_snapshot FROM cic_trash_items WHERE id=${moved.trashId}`;
  const snapshot = trash.payload_snapshot as { record: Record<string, unknown>; categories: number[] };
  await sql.unsafe(`INSERT INTO ${t.p} OVERRIDING SYSTEM VALUE SELECT (jsonb_populate_record(NULL::${t.p},$1::text::jsonb)).*`, [JSON.stringify(snapshot.record)]);
  await assert.rejects(() => restoreTrashRecord(moved.trashId, 'as_draft', actor), /ID/);
  await sql.unsafe(`DELETE FROM ${t.p} WHERE id=$1`, [originalId]);

  const brokenSnapshot = { ...snapshot, categories: [...snapshot.categories, 2147483647] };
  await sql`UPDATE cic_trash_items SET payload_snapshot=${sql.json(brokenSnapshot as never)} WHERE id=${moved.trashId}`;
  await assert.rejects(() => restoreTrashRecord(moved.trashId, 'as_draft', actor));
  assert.equal((await sql.unsafe(`SELECT 1 FROM ${t.p} WHERE id=$1`, [originalId])).length, 0);
  assert.equal((await sql`SELECT status FROM cic_trash_items WHERE id=${moved.trashId}`)[0].status, 'trashed');
  await sql`UPDATE cic_trash_items SET payload_snapshot=${sql.json(snapshot as never)} WHERE id=${moved.trashId}`;

  const restoredResult = await restoreTrashRecord(moved.trashId, 'as_draft', actor);
  assert.equal(Number(restoredResult.restoredEntityId), originalId);
  const [restored] = await sql.unsafe(`SELECT id,name,description,feature_details,published,is_hot FROM ${t.p} WHERE id=$1`, [originalId]);
  assert.equal(Number(restored.id), originalId);
  assert.equal(restored.description, payload.description);
  assert.equal(restored.feature_details, payload.feature_details);
  assert.equal(restored.published, false);
  assert.equal(restored.is_hot, false);
  assert.equal(Number((await sql.unsafe(`SELECT count(*) count FROM ${t.cr} WHERE product_id=$1`, [originalId]))[0].count), 1);
  assert.equal(Number((await sql.unsafe(`SELECT count(*) count FROM ${t.ar} WHERE product_id=$1`, [originalId]))[0].count), application ? 1 : 0);
  assert.equal(Number((await sql.unsafe(`SELECT count(*) count FROM ${t.rr} WHERE product_id=$1`, [originalId]))[0].count), 1);
  assert.equal(Number((await sql.unsafe(`SELECT id FROM ${t.im} WHERE record_id=$1`, [originalId]))[0].id), originalImageId);

  await saveProduct(locale, originalId, { ...payload, name: `Identity verifier edited after restore ${locale}`, published: false }, actor);
  const secondId = Number((await saveProduct(locale, null, { ...payload, name: `Identity verifier second ${locale}`, alias: `${alias}-second`, code: `${alias}-second`, relatedProductIds: [] }, actor)).id);
  createdIds.push({ locale, id: secondId });
  assert.notEqual(secondId, originalId);
  return { locale, originalId, restoredId: Number(restored.id), originalImageId, restoredImageId: originalImageId, nextGeneratedId: secondId };
}

try {
  const results = [await verifyLocale('vi'), await verifyLocale('en')];
  console.log(JSON.stringify({ results, conflictRejected: true, failedRelationRolledBack: true, relationsRestored: true, editAfterRestore: true }, null, 2));
} finally {
  for (const { locale, id } of createdIds.reverse()) {
    const t = names(locale);
    await sql.unsafe(`DELETE FROM ${t.im} WHERE record_id=$1`, [id]);
    await sql.unsafe(`DELETE FROM ${t.p} WHERE id=$1`, [id]);
  }
  for (const id of trashIds) await sql`DELETE FROM cic_trash_items WHERE id=${id}`;
  await sql.end();
}

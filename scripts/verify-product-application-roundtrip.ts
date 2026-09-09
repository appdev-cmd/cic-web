import assert from 'node:assert/strict';

import { getPostgresClient } from '../src/server/db/postgres.ts';
import {
  saveProductApplication,
  trashProductApplication,
} from '../src/features/product-applications/server/repository.ts';
import { listPublishedProductApplications } from '../src/features/product-applications/server/queries.ts';
import { listPublishedProductsForReference } from '../src/features/products/server/queries.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';

const sql = getPostgresClient();
const marker = `application-roundtrip-${Date.now()}`;
const initialName = 'Lĩnh vực kiểm thử roundtrip';
const publishedName = 'Lĩnh vực kiểm thử roundtrip đã cập nhật';
let applicationId = '';
let trashId = '';
let productId: number | null = null;

const [actorRow] = await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`;
if (!actorRow) throw new Error('Roundtrip requires one existing CMS actor.');
const actor = {
  legacyUserId: Number(actorRow.id), fullName: 'Product application verifier',
  username: 'verifier', email: '', isAdministrator: true,
  roleCodes: ['superadmin'], permissions: [], authUser: {} as CmsPrincipal['authUser'],
} satisfies CmsPrincipal;

try {
  const created = await saveProductApplication('vi', null, {
    name: initialName, alias: marker, ordering: 999_999, published: false,
  }, actor);
  applicationId = created.id;
  await sql`UPDATE cic_application SET image='legacy-application-sentinel.svg',show_in_homepage=true WHERE id=${Number(applicationId)}`;
  assert.equal((await listPublishedProductApplications('vi')).some((item) => item.id === applicationId), false, 'draft application leaked to public projection');

  await saveProductApplication('vi', Number(applicationId), {
    name: publishedName, alias: marker, ordering: 999_999, published: true,
  }, actor);
  const [patched] = await sql`SELECT image,show_in_homepage FROM cic_application WHERE id=${Number(applicationId)}`;
  assert.equal(String(patched.image), 'legacy-application-sentinel.svg');
  assert.equal(patched.show_in_homepage, true, 'PATCH overwrote a non-form legacy field');
  assert.equal((await listPublishedProductApplications('vi')).some((item) => item.id === applicationId && item.name === publishedName), true, 'published application missing');

  const [product] = await sql`SELECT id FROM cic_products WHERE published=true ORDER BY id LIMIT 1`;
  assert.ok(product, 'roundtrip requires one published Product consumer');
  productId = Number(product.id);
  await sql`INSERT INTO cic_products_applications_rel(product_id,application_id,ordering) VALUES(${productId},${Number(applicationId)},999999)`;
  const publicProduct = (await listPublishedProductsForReference()).find((item) => item.id === productId);
  assert.equal(publicProduct?.app.includes(publishedName), true, 'Product consumer did not use Application junction identity');
  await assert.rejects(() => trashProductApplication('vi', Number(applicationId), actor), /sản phẩm sử dụng/, 'Trash should be blocked while Product references Application');
  await sql`DELETE FROM cic_products_applications_rel WHERE product_id=${productId} AND application_id=${Number(applicationId)}`;
  productId = null;

  const moved = await trashProductApplication('vi', Number(applicationId), actor);
  trashId = moved.trashId;
  assert.equal((await listPublishedProductApplications('vi')).some((item) => item.id === applicationId), false, 'trashed application leaked');
  await restoreTrashRecord(trashId, 'as_draft', actor);
  const [restored] = await sql`SELECT published,name,image,show_in_homepage FROM cic_application WHERE id=${Number(applicationId)}`;
  assert.equal(restored.published, false);
  assert.equal(String(restored.name), publishedName);
  assert.equal(String(restored.image), 'legacy-application-sentinel.svg');
  assert.equal(restored.show_in_homepage, true);
  const events = await sql`SELECT action_code FROM cic_activity_logs WHERE entity_type='product_application' AND entity_id=${applicationId}`;
  assert.ok(events.length >= 3, 'Application mutation audit events are missing');
  console.log(JSON.stringify({ created: true, draftHidden: true, publishedVisible: true, productConsumerUsesJunction: true, referencedTrashBlocked: true, trashHidden: true, restoredInactive: true, patchPreservesNonFormLegacyFields: true, audit: true }, null, 2));
} finally {
  if (productId !== null && applicationId) await sql`DELETE FROM cic_products_applications_rel WHERE product_id=${productId} AND application_id=${Number(applicationId)}`;
  if (applicationId) await sql`DELETE FROM cic_application WHERE id=${Number(applicationId)}`;
  if (trashId) await sql`DELETE FROM cic_trash_items WHERE id=${trashId}`;
  await sql.end();
}

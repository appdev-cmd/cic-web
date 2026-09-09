import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { saveProduct, trashProduct } from '../src/features/products/server/repository.ts';
import { listPublishedProductsForReference } from '../src/features/products/server/queries.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';

const sql = getPostgresClient(); const marker = `product-roundtrip-${Date.now()}`; let productId = ''; let trashId = '';
const [actorRow] = await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`; if (!actorRow) throw new Error('Roundtrip requires one CMS actor.');
const actor = { legacyUserId: Number(actorRow.id), fullName: 'Product verifier', username: 'verifier', email: '', isAdministrator: true, roleCodes: ['superadmin'], permissions: [], authUser: {} as CmsPrincipal['authUser'] } satisfies CmsPrincipal;
const [category] = await sql`SELECT id FROM cic_products_categories ORDER BY id LIMIT 1`; if (!category) throw new Error('Roundtrip requires one product category.');
const [application] = await sql`SELECT id FROM cic_application ORDER BY id LIMIT 1`;
const payload = { name: 'Sản phẩm kiểm thử', alias: marker, code: marker, other_languages1: '', summary: 'Kiểm thử', description: '<p>Nội dung</p>', feature_details: '<p>Tính năng</p>', video: '', tawk_to: '', image: '', icon: '', price: 'Liên hệ', tags: ['kiểm thử'], landing_page: '', seo_title: 'SEO', seo_keyword: '', seo_description: '', file_catalogue: '', file_price: '', link_catalogue: '', file_driver_name: '', file_driver: '', link_driver: '', downloads: [{ name: 'Tài liệu', file: '', link: 'https://example.com/document.pdf' }], categoryIds: [Number(category.id)], applicationIds: application ? [Number(application.id)] : [], relatedProductIds: [], manufactoryId: null, typeId: null, published: false, is_hot: false, teamview: false, ordering: 999999 };
try {
  productId = (await saveProduct('vi', null, payload, actor)).id;
  await sql`UPDATE cic_products SET category_alias_wrapper='legacy-sentinel' WHERE id=${Number(productId)}`;
  assert.equal((await listPublishedProductsForReference()).some((item) => item.id === Number(productId)), false);
  await saveProduct('vi', Number(productId), { ...payload, name: 'Sản phẩm kiểm thử cập nhật', published: true }, actor);
  const publicProduct = (await listPublishedProductsForReference()).find((item) => item.id === Number(productId)); assert.ok(publicProduct); assert.equal(publicProduct.documents?.[0]?.name, 'Tài liệu');
  const [preserved] = await sql`SELECT category_alias_wrapper FROM cic_products WHERE id=${Number(productId)}`; assert.equal(preserved.category_alias_wrapper, 'legacy-sentinel');
  await sql`INSERT INTO cic_products_images(record_id,image,ordering,title) VALUES(${Number(productId)},'/verify-product.jpg',1,'Ảnh kiểm thử')`;
  const moved = await trashProduct('vi', Number(productId), actor); trashId = moved.trashId;
  assert.equal((await listPublishedProductsForReference()).some((item) => item.id === Number(productId)), false);
  await restoreTrashRecord(trashId, 'as_draft', actor);
  const [restored] = await sql`SELECT published,is_hot,category_alias_wrapper FROM cic_products WHERE id=${Number(productId)}`; assert.equal(restored.published, false); assert.equal(restored.is_hot, false); assert.equal(restored.category_alias_wrapper, 'legacy-sentinel');
  const [image] = await sql`SELECT image FROM cic_products_images WHERE record_id=${Number(productId)}`; assert.equal(image.image, '/verify-product.jpg');
  const events = await sql`SELECT action_code FROM cic_activity_logs WHERE entity_type='product' AND entity_id=${productId}`; assert.ok(events.length >= 3);
  console.log(JSON.stringify({ created: true, draftHidden: true, publishedVisible: true, documentsFromDb: true, legacyFieldsPreserved: true, trashRestoreDraft: true, galleryRestored: true, audit: true }, null, 2));
} finally {
  if (productId) { await sql`DELETE FROM cic_products_images WHERE record_id=${Number(productId)}`; await sql`DELETE FROM cic_products WHERE id=${Number(productId)}`; }
  if (trashId) await sql`DELETE FROM cic_trash_items WHERE id=${trashId}`;
  await sql.end();
}

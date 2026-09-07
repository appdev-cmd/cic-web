import assert from 'node:assert/strict';

import { getPostgresClient } from '../src/server/db/postgres.ts';
import {
  saveProductBrand,
  trashProductBrand,
} from '../src/features/product-brands/server/repository.ts';
import { listPublishedProductBrands } from '../src/features/product-brands/server/queries.ts';
import { listPublishedProductsForReference } from '../src/features/products/server/queries.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';

const sql = getPostgresClient();
const marker = `brand-roundtrip-${Date.now()}`;
const initialName = 'Hãng kiểm thử roundtrip';
const publishedName = 'Hãng kiểm thử roundtrip đã cập nhật';
let brandId = '';
let trashId = '';
let productId: number | null = null;
let originalManufactory: unknown;
let originalManufactoryName: unknown;

const [actorRow] = await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`;
if (!actorRow) throw new Error('Roundtrip requires one existing CMS actor.');

const actor = {
  legacyUserId: Number(actorRow.id),
  fullName: 'Product brand verifier',
  username: 'verifier',
  email: '',
  isAdministrator: true,
  roleCodes: ['superadmin'],
  permissions: [],
  authUser: {} as CmsPrincipal['authUser'],
} satisfies CmsPrincipal;

try {
  const created = await saveProductBrand(
    'vi',
    null,
    {
      name: initialName,
      alias: marker,
      ordering: 999_999,
      published: false,
    },
    actor,
  );
  brandId = created.id;

  await sql`
    UPDATE cic_manufactories
    SET image='legacy-logo-sentinel.svg',
        show_in_homepage=true
    WHERE id=${Number(brandId)}
  `;

  assert.equal(
    (await listPublishedProductBrands('vi')).some((item) => item.id === brandId),
    false,
    'draft brand leaked to public projection',
  );

  await saveProductBrand(
    'vi',
    Number(brandId),
    {
      name: publishedName,
      alias: marker,
      ordering: 999_999,
      published: true,
    },
    actor,
  );

  const [patched] = await sql`
    SELECT image, show_in_homepage
    FROM cic_manufactories
    WHERE id=${Number(brandId)}
  `;
  assert.equal(String(patched.image), 'legacy-logo-sentinel.svg');
  assert.equal(patched.show_in_homepage, true, 'PATCH overwrote a non-form legacy field');

  assert.equal(
    (await listPublishedProductBrands('vi')).some(
      (item) => item.id === brandId && item.name === publishedName,
    ),
    true,
    'published brand missing from public projection',
  );

  const [product] = await sql`
    SELECT id, manufactory, manufactory_name
    FROM cic_products
    WHERE published=true
    ORDER BY id
    LIMIT 1
  `;
  assert.ok(product, 'roundtrip requires one published Product consumer');
  productId = Number(product.id);
  originalManufactory = product.manufactory;
  originalManufactoryName = product.manufactory_name;

  await sql`
    UPDATE cic_products
    SET manufactory=${brandId}, manufactory_name='stale fallback value'
    WHERE id=${productId}
  `;

  const publicProduct = (await listPublishedProductsForReference()).find(
    (item) => item.id === productId,
  );
  assert.equal(publicProduct?.brand, publishedName, 'Product consumer did not use Brand identity');

  await assert.rejects(
    () => trashProductBrand('vi', Number(brandId), actor),
    /sản phẩm sử dụng/,
    'Trash should be blocked while Product references the Brand',
  );

  await sql`
    UPDATE cic_products
    SET manufactory=${originalManufactory as never},
        manufactory_name=${originalManufactoryName as never}
    WHERE id=${productId}
  `;
  productId = null;

  const moved = await trashProductBrand('vi', Number(brandId), actor);
  trashId = moved.trashId;
  assert.equal(
    (await listPublishedProductBrands('vi')).some((item) => item.id === brandId),
    false,
    'trashed brand leaked to public projection',
  );

  await restoreTrashRecord(trashId, 'as_draft', actor);
  const [restored] = await sql`
    SELECT published, name, image, show_in_homepage
    FROM cic_manufactories
    WHERE id=${Number(brandId)}
  `;
  assert.equal(restored.published, false);
  assert.equal(String(restored.name), publishedName);
  assert.equal(String(restored.image), 'legacy-logo-sentinel.svg');
  assert.equal(restored.show_in_homepage, true);

  const events = await sql`
    SELECT action_code
    FROM cic_activity_logs
    WHERE entity_type='product_brand' AND entity_id=${brandId}
  `;
  assert.ok(events.length >= 3, 'Brand mutation audit events are missing');

  console.log(
    JSON.stringify(
      {
        created: true,
        draftHidden: true,
        publishedVisible: true,
        productConsumerUsesBrand: true,
        referencedTrashBlocked: true,
        trashHidden: true,
        restoredInactive: true,
        patchPreservesNonFormLegacyFields: true,
        legacySnapshotRestored: true,
        audit: true,
      },
      null,
      2,
    ),
  );
} finally {
  if (productId !== null) {
    await sql`
      UPDATE cic_products
      SET manufactory=${originalManufactory as never},
          manufactory_name=${originalManufactoryName as never}
      WHERE id=${productId}
    `;
  }
  if (brandId) await sql`DELETE FROM cic_manufactories WHERE id=${Number(brandId)}`;
  if (trashId) await sql`DELETE FROM cic_trash_items WHERE id=${trashId}`;
  await sql.end();
}

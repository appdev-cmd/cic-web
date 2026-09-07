import assert from 'node:assert/strict';

import { mediaTrashAdapter } from '../src/features/trash/server/adapters/media.ts';
import { productBrandEnTrashAdapter, productBrandTrashAdapter } from '../src/features/trash/server/adapters/product-brand.ts';
import { productCategoryEnTrashAdapter, productCategoryTrashAdapter } from '../src/features/trash/server/adapters/product-category.ts';
import { projectTrashAdapter } from '../src/features/trash/server/adapters/project.ts';
import { roleTrashAdapter } from '../src/features/trash/server/adapters/role.ts';
import { userTrashAdapter } from '../src/features/trash/server/adapters/user.ts';
import type { TrashEntityAdapter } from '../src/features/trash/server/registry-types.ts';

const paths = (adapter: TrashEntityAdapter, operation: 'restore' | 'purge') =>
  adapter.getRevalidationTargets(operation).map((target) => `${target.path}:${target.type ?? ''}`);

for (const adapter of [productCategoryTrashAdapter, productCategoryEnTrashAdapter]) {
  assert.deepEqual(paths(adapter, 'restore'), ['/cms/product-categories:', '/products:', '/products/[slug]:page']);
  assert.deepEqual(paths(adapter, 'purge'), paths(adapter, 'restore'));
}

for (const adapter of [productBrandTrashAdapter, productBrandEnTrashAdapter]) {
  assert.deepEqual(paths(adapter, 'restore'), ['/cms/manufacturers:', '/products:', '/products/[slug]:page']);
  assert.deepEqual(paths(adapter, 'purge'), paths(adapter, 'restore'));
}

assert.deepEqual(paths(projectTrashAdapter, 'restore'), ['/cms/projects:', '/projects:', '/projects/[slug]:page']);
assert.deepEqual(paths(projectTrashAdapter, 'purge'), paths(projectTrashAdapter, 'restore'));
assert.deepEqual(paths(roleTrashAdapter, 'restore'), ['/cms/permissions:', '/cms/users:']);
assert.deepEqual(paths(roleTrashAdapter, 'purge'), paths(roleTrashAdapter, 'restore'));
assert.deepEqual(paths(userTrashAdapter, 'restore'), ['/cms/users:']);
assert.deepEqual(paths(userTrashAdapter, 'purge'), []);
assert.equal(userTrashAdapter.supportsPurge, false);
assert.deepEqual(paths(mediaTrashAdapter, 'restore'), ['/cms/media:']);
assert.deepEqual(paths(mediaTrashAdapter, 'purge'), []);
assert.equal(mediaTrashAdapter.supportsPurge, false);

console.log(JSON.stringify({ category: true, brand: true, media: true, user: true, role: true, project: true, unsupportedPurgeIsExplicit: true }, null, 2));

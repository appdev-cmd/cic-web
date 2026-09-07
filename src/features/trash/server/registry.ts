import 'server-only';
import { projectTrashAdapter } from './adapters/project';
import { roleTrashAdapter } from './adapters/role';
import { userTrashAdapter } from './adapters/user';
import { mediaTrashAdapter } from './adapters/media';
import { productCategoryTrashAdapter,productCategoryEnTrashAdapter } from './adapters/product-category';
import {productBrandTrashAdapter,productBrandEnTrashAdapter} from './adapters/product-brand';
import type { TrashEntityAdapter } from './registry-types';

const adapters = [projectTrashAdapter, userTrashAdapter, roleTrashAdapter, mediaTrashAdapter, productCategoryTrashAdapter, productCategoryEnTrashAdapter,productBrandTrashAdapter,productBrandEnTrashAdapter] as const satisfies readonly TrashEntityAdapter[];
const byEntityType = new Map(adapters.map((adapter) => [adapter.entityType, adapter]));

export function getTrashEntityAdapter(entityType: string): TrashEntityAdapter {
  const adapter = byEntityType.get(entityType);
  if (!adapter) throw new Error(`Loại dữ liệu “${entityType}” chưa hỗ trợ phục hồi/xóa vĩnh viễn.`);
  return adapter;
}

export function listTrashModuleOptions() {
  return adapters.map((adapter) => ({ value: adapter.module, label: adapter.label }));
}

export function getTrashModuleMetadata(entityType: string) {
  const adapter = byEntityType.get(entityType);
  return adapter ? { moduleName: adapter.label, itemType: adapter.itemType, restoreState: adapter.restoreState, supportsPurge: adapter.supportsPurge, purgeBlockedReason: adapter.purgeBlockedReason } : null;
}

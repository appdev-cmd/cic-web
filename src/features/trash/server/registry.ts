import 'server-only';
import { projectTrashAdapter } from './adapters/project';
import { roleTrashAdapter } from './adapters/role';
import { userTrashAdapter } from './adapters/user';
import { mediaTrashAdapter } from './adapters/media';
import { productCategoryTrashAdapter,productCategoryEnTrashAdapter } from './adapters/product-category';
import {productBrandTrashAdapter,productBrandEnTrashAdapter} from './adapters/product-brand';
import { productApplicationTrashAdapter, productApplicationEnTrashAdapter } from './adapters/product-application';
import { productTypeTrashAdapter, productTypeEnTrashAdapter } from './adapters/product-type';
import { salesOwnerTrashAdapter, salesOwnerEnTrashAdapter } from './adapters/sales-owner';
import { productTrashAdapter, productEnTrashAdapter } from './adapters/product';
import { newsCategoryTrashAdapter, newsCategoryEnTrashAdapter } from './adapters/news-category';
import { newsTrashAdapter, newsEnTrashAdapter } from './adapters/news';
import { serviceTrashAdapter, serviceEnTrashAdapter } from './adapters/service';
import { eventTrashAdapter, eventEnTrashAdapter } from './adapters/event';
import { emailTemplateTrashAdapter, emailTemplateEnTrashAdapter } from './adapters/email-template';
import type { TrashEntityAdapter } from './registry-types';

const adapters = [projectTrashAdapter, userTrashAdapter, roleTrashAdapter, mediaTrashAdapter, productCategoryTrashAdapter, productCategoryEnTrashAdapter,productBrandTrashAdapter,productBrandEnTrashAdapter,productApplicationTrashAdapter,productApplicationEnTrashAdapter,productTypeTrashAdapter,productTypeEnTrashAdapter,salesOwnerTrashAdapter,salesOwnerEnTrashAdapter,productTrashAdapter,productEnTrashAdapter,newsCategoryTrashAdapter,newsCategoryEnTrashAdapter,newsTrashAdapter,newsEnTrashAdapter,serviceTrashAdapter,serviceEnTrashAdapter,eventTrashAdapter,eventEnTrashAdapter,emailTemplateTrashAdapter,emailTemplateEnTrashAdapter] as const satisfies readonly TrashEntityAdapter[];
const byEntityType = new Map(adapters.map((adapter) => [adapter.entityType, adapter]));

export function getTrashEntityAdapter(entityType: string): TrashEntityAdapter {
  const adapter = byEntityType.get(entityType);
  if (!adapter) throw new Error(`Loại dữ liệu “${entityType}” chưa hỗ trợ phục hồi/xóa vĩnh viễn.`);
  return adapter;
}

export function listTrashModuleOptions() {
  const seen = new Set<string>();
  const options: Array<{ value: string; label: string }> = [];
  for (const adapter of adapters) {
    if (!seen.has(adapter.module)) {
      seen.add(adapter.module);
      options.push({ value: adapter.module, label: adapter.label });
    }
  }
  return options;
}

export function getTrashModuleMetadata(entityType: string) {
  const adapter = byEntityType.get(entityType);
  return adapter ? { moduleName: adapter.label, itemType: adapter.itemType, restoreState: adapter.restoreState, supportsPurge: adapter.supportsPurge, purgeBlockedReason: adapter.purgeBlockedReason } : null;
}

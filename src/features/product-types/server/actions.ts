'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { productTypeIdSchema, productTypeInputSchema, productTypeLocaleSchema } from '../schemas/productTypeInput';
import { saveProductType, setProductTypesPublished, trashProductType } from './repository';

const refresh = () => { revalidatePath('/cms/product-settings/product-types'); revalidatePath('/products'); revalidatePath('/products/[slug]', 'page'); };

export async function saveProductTypeAction(locale: unknown, id: unknown, payload: unknown) {
  const actor = await requirePermission('product_settings', id ? 'edit' : 'create');
  const result = await saveProductType(productTypeLocaleSchema.parse(locale), id ? productTypeIdSchema.parse(id) : null,
    productTypeInputSchema.parse(payload), actor); refresh(); return result;
}
export async function bulkSetProductTypesPublishedAction(locale: unknown, ids: unknown, published: unknown) {
  const actor = await requirePermission('product_settings', 'edit');
  await setProductTypesPublished(productTypeLocaleSchema.parse(locale), [...new Set(z.array(productTypeIdSchema).min(1).max(100).parse(ids))], z.boolean().parse(published), actor); refresh();
}
export async function trashProductTypeAction(locale: unknown, id: unknown) {
  const actor = await requirePermission('product_settings', 'delete');
  await trashProductType(productTypeLocaleSchema.parse(locale), productTypeIdSchema.parse(id), actor); refresh();
}

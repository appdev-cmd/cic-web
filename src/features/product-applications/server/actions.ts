'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { requirePermission } from '@/server/auth/guards';
import {
  applicationIdSchema,
  applicationLocaleSchema,
  productApplicationInputSchema,
} from '../schemas/applicationInput';
import {
  saveProductApplication,
  setProductApplicationsPublished,
  trashProductApplication,
} from './repository';

const refresh = () => {
  revalidatePath('/cms/product-settings/applications');
  revalidatePath('/products');
  revalidatePath('/products/[slug]', 'page');
};

export async function saveProductApplicationAction(locale: unknown, id: unknown, payload: unknown) {
  const actor = await requirePermission('product_settings', id ? 'edit' : 'create');
  const result = await saveProductApplication(
    applicationLocaleSchema.parse(locale),
    id ? applicationIdSchema.parse(id) : null,
    productApplicationInputSchema.parse(payload),
    actor,
  );
  refresh();
  return result;
}

export async function bulkSetProductApplicationsPublishedAction(
  locale: unknown,
  ids: unknown,
  published: unknown,
) {
  const actor = await requirePermission('product_settings', 'edit');
  await setProductApplicationsPublished(
    applicationLocaleSchema.parse(locale),
    [...new Set(z.array(applicationIdSchema).min(1).max(100).parse(ids))],
    z.boolean().parse(published),
    actor,
  );
  refresh();
}

export async function trashProductApplicationAction(locale: unknown, id: unknown) {
  const actor = await requirePermission('product_settings', 'delete');
  await trashProductApplication(
    applicationLocaleSchema.parse(locale),
    applicationIdSchema.parse(id),
    actor,
  );
  refresh();
}

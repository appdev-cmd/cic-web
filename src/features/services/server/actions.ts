'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { serviceIdSchema, serviceInputSchema, serviceLocaleSchema } from '../schemas/serviceInput';
import { saveService, setServicesPublished, trashService } from './repository';

const refresh = () => {
  revalidatePath('/cms/services');
  revalidatePath('/services');
  revalidatePath('/services/[slug]', 'page');
  revalidatePath('/');
};

export async function saveServiceAction(locale: unknown, id: unknown, payload: unknown) {
  const actor = await requirePermission('services', id ? 'edit' : 'create');
  const result = await saveService(
    serviceLocaleSchema.parse(locale),
    id ? serviceIdSchema.parse(id) : null,
    serviceInputSchema.parse(payload),
    actor
  );
  refresh();
  return result;
}

export async function setServicesPublishedAction(locale: unknown, ids: unknown, published: unknown) {
  const actor = await requirePermission('services', 'edit');
  await setServicesPublished(
    serviceLocaleSchema.parse(locale),
    z.array(serviceIdSchema).min(1).max(100).parse(ids),
    z.boolean().parse(published),
    actor
  );
  refresh();
}

export async function trashServiceAction(locale: unknown, id: unknown) {
  const actor = await requirePermission('services', 'delete');
  const result = await trashService(
    serviceLocaleSchema.parse(locale),
    serviceIdSchema.parse(id),
    actor
  );
  refresh();
  return result;
}

export async function trashServicesAction(locale: unknown, ids: unknown) {
  const actor = await requirePermission('services', 'delete');
  const parsedLocale = serviceLocaleSchema.parse(locale);
  const parsedIds = z.array(serviceIdSchema).min(1).max(100).parse(ids);
  const results = [];
  for (const id of parsedIds) {
    results.push(await trashService(parsedLocale, id, actor));
  }
  refresh();
  return results;
}

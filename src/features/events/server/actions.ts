'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/server/auth/guards';
import { z } from 'zod';
import { eventInputSchema } from '../schemas/eventInput';
import {
  saveEvent,
  setEventsPublished,
  trashEvent,
} from './repository';
import type { EventLocale } from '../types';

const localeSchema = z.enum(['vi', 'en']);
const idSchema = z.coerce.number().int().positive();
const idsSchema = z.array(idSchema).min(1);

function revalidateEvents() {
  revalidatePath('/events');
  revalidatePath('/events/[slug]', 'page');
  revalidatePath('/cms/events');
  revalidatePath('/');
}

export async function saveEventAction(
  localeRaw: unknown,
  idRaw: unknown,
  payloadRaw: unknown
) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const id = idRaw ? idSchema.parse(idRaw) : null;
  const input = eventInputSchema.parse(payloadRaw);

  const actor = await requirePermission('events', id ? 'edit' : 'create');
  const result = await saveEvent(locale, id, input, actor);
  revalidateEvents();
  return result;
}

export async function setEventsPublishedAction(
  localeRaw: unknown,
  idsRaw: unknown,
  publishedRaw: unknown
) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const ids = idsSchema.parse(idsRaw);
  const published = z.boolean().parse(publishedRaw);

  const actor = await requirePermission('events', 'edit');
  await setEventsPublished(locale, ids, published, actor);
  revalidateEvents();
  return { ok: true, count: ids.length };
}

export async function trashEventAction(localeRaw: unknown, idRaw: unknown) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const id = idSchema.parse(idRaw);

  const actor = await requirePermission('events', 'delete');
  const result = await trashEvent(locale, id, actor);
  revalidateEvents();
  return result;
}

export async function trashEventsAction(localeRaw: unknown, idsRaw: unknown) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const ids = idsSchema.parse(idsRaw);

  const actor = await requirePermission('events', 'delete');
  const results = [];
  for (const id of ids) {
    results.push(await trashEvent(locale, id, actor));
  }
  revalidateEvents();
  return { ok: true, count: results.length };
}

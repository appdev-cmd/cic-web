'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { projectInputSchema } from '../schemas/projectInput';
import { createProject, deleteProject, updateProject, updateProjects } from './repository';

const relationsSchema = z.object({ products_related: z.array(z.coerce.number().int().positive()).default([]), services_related: z.array(z.coerce.number().int().positive()).default([]) });
const idSchema = z.coerce.number().int().positive();

function parsePayload(payload: unknown) {
  const input = projectInputSchema.parse(payload);
  const relations = relationsSchema.parse(payload);
  return { input, relations: { productIds: relations.products_related, serviceIds: relations.services_related } };
}

function refreshProjects() {
  revalidatePath('/projects');
  revalidatePath('/projects/[slug]', 'page');
  revalidatePath('/cms');
}

export async function createProjectAction(payload: unknown) {
  const user = await requirePermission('projects', 'create');
  const { input, relations } = parsePayload(payload);
  const result = await createProject(input, relations, user.legacyUserId);
  refreshProjects();
  return result;
}

export async function updateProjectAction(id: string, payload: unknown) {
  const user = await requirePermission('projects', 'edit');
  const { input, relations } = parsePayload(payload);
  const result = await updateProject(idSchema.parse(id), input, relations, user.legacyUserId);
  refreshProjects();
  return result;
}

export async function deleteProjectAction(id: string) {
  await requirePermission('projects', 'delete');
  await deleteProject(idSchema.parse(id));
  refreshProjects();
}

export async function bulkUpdateProjectsAction(ids: string[], patch: { published?: boolean; is_featured?: boolean }) {
  const user = await requirePermission('projects', 'edit');
  const safePatch = z.object({ published: z.boolean().optional(), is_featured: z.boolean().optional() }).refine((value) => Object.keys(value).length > 0).parse(patch);
  const parsedIds = z.array(idSchema).min(1).max(100).parse(ids);
  await updateProjects(parsedIds, safePatch, user.legacyUserId);
  refreshProjects();
}

export async function bulkDeleteProjectsAction(ids: string[]) {
  await requirePermission('projects', 'delete');
  const parsedIds = z.array(idSchema).min(1).max(100).parse(ids);
  await Promise.all(parsedIds.map((id) => deleteProject(id)));
  refreshProjects();
}

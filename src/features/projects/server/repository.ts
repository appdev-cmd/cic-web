import 'server-only';

import type { Sql } from 'postgres';
import { withTransaction } from '@/server/db/postgres';
import type { ProjectInput } from '../schemas/projectInput';

export type ProjectRelations = { productIds: number[]; serviceIds: number[] };

function toProjectRow(input: ProjectInput, legacyUserId: number, creating: boolean) {
  const row: Record<string, unknown> = { ...input, updated_by: legacyUserId, updated_time: new Date() };
  if (creating) row.created_by = legacyUserId;
  return row;
}

async function validateRelations(sql: Sql, relations: ProjectRelations) {
  const productIds = [...new Set(relations.productIds)];
  const serviceIds = [...new Set(relations.serviceIds)];
  if (productIds.some((id) => !Number.isSafeInteger(id) || id <= 0) || serviceIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) throw new Error('Invalid project relation identifier.');
  if (productIds.length) {
    const rows = await sql`SELECT id FROM cic_products WHERE id IN ${sql(productIds)}`;
    if (rows.length !== productIds.length) throw new Error('One or more related products do not exist.');
  }
  if (serviceIds.length) {
    const rows = await sql`SELECT id FROM cic_services WHERE id IN ${sql(serviceIds)}`;
    if (rows.length !== serviceIds.length) throw new Error('One or more related services do not exist.');
  }
  return { productIds, serviceIds };
}

async function syncRelations(sql: Sql, projectId: number, relations: ProjectRelations) {
  const { productIds, serviceIds } = await validateRelations(sql, relations);
  await sql`DELETE FROM cic_projects_products_rel WHERE project_id = ${projectId}`;
  await sql`DELETE FROM cic_projects_services_rel WHERE project_id = ${projectId}`;
  for (const [ordering, productId] of productIds.entries()) await sql`INSERT INTO cic_projects_products_rel (project_id, product_id, ordering) VALUES (${projectId}, ${productId}, ${ordering})`;
  for (const [ordering, serviceId] of serviceIds.entries()) await sql`INSERT INTO cic_projects_services_rel (project_id, service_id, ordering) VALUES (${projectId}, ${serviceId}, ${ordering})`;
}

export async function createProject(input: ProjectInput, relations: ProjectRelations, legacyUserId: number) {
  return withTransaction(async (sql) => {
    const [row] = await sql`INSERT INTO cic_projects ${sql(toProjectRow(input, legacyUserId, true))} RETURNING id`;
    const id = Number(row?.id);
    if (!Number.isSafeInteger(id)) throw new Error('Unable to create project.');
    await syncRelations(sql, id, relations);
    return { id: String(id) };
  });
}

export async function updateProject(id: number, input: ProjectInput, relations: ProjectRelations, legacyUserId: number) {
  return withTransaction(async (sql) => {
    const [row] = await sql`UPDATE cic_projects SET ${sql(toProjectRow(input, legacyUserId, false))} WHERE id = ${id} RETURNING id`;
    if (!row) throw new Error('Project not found.');
    await syncRelations(sql, id, relations);
    return { id: String(id) };
  });
}

export async function deleteProject(id: number) {
  return withTransaction(async (sql) => {
    const rows = await sql`DELETE FROM cic_projects WHERE id = ${id} RETURNING id`;
    if (!rows.length) throw new Error('Project not found.');
  });
}

export async function updateProjects(ids: number[], patch: { published?: boolean; is_featured?: boolean }, legacyUserId: number) {
  if (!ids.length) return;
  return withTransaction(async (sql) => {
    const rows = await sql`UPDATE cic_projects SET ${sql({ ...patch, updated_by: legacyUserId, updated_time: new Date() })} WHERE id IN ${sql(ids)} RETURNING id`;
    if (rows.length !== new Set(ids).size) throw new Error('One or more projects no longer exist.');
  });
}

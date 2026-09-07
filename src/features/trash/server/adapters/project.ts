import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { TrashRestoreMode } from '../../types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const nullableText = z.string().nullable();
const nullableNumber = z.number().int().nullable();
const projectSnapshotSchema = z.object({
  version: z.literal(1),
  record: z.object({
    id: z.number().int().positive(),
    title: z.string().min(1).max(255),
    alias: z.string().min(1).max(255),
    tagline: nullableText,
    summary: nullableText,
    content: nullableText,
    sector: nullableText,
    solution: nullableText,
    technologies: z.array(z.string()),
    customer_name: nullableText,
    location: nullableText,
    start_year: nullableNumber,
    end_year: nullableNumber,
    is_ongoing: z.boolean(),
    image: nullableText,
    is_featured: z.boolean(),
    published: z.boolean(),
    ordering: z.number().int().min(0),
    seo_title: nullableText,
    seo_keyword: nullableText,
    seo_description: nullableText,
    created_by: nullableNumber,
    updated_by: nullableNumber,
    created_time: z.string().datetime(),
    updated_time: z.string().datetime(),
  }),
  relations: z.object({
    productIds: z.array(z.number().int().positive()),
    serviceIds: z.array(z.number().int().positive()),
  }),
});

export type ProjectTrashSnapshot = z.infer<typeof projectSnapshotSchema>;

const toIso = (value: unknown) => new Date(String(value)).toISOString();
const nullable = (value: unknown) => value == null ? null : String(value);
const nullableInt = (value: unknown) => value == null ? null : Number(value);

export async function moveProjectToTrash(sql: Sql, projectId: number, actorId: number): Promise<{ trashId: string; title: string }> {
  const [row] = await sql`
    SELECT id,title,alias,tagline,summary,content,sector,solution,technologies,customer_name,location,
      start_year,end_year,is_ongoing,image,is_featured,published,ordering,seo_title,seo_keyword,
      seo_description,created_by,updated_by,created_time,updated_time
    FROM cic_projects WHERE id=${projectId} FOR UPDATE
  `;
  if (!row) throw new Error('Không tìm thấy dự án.');

  const productRows = await sql`SELECT product_id FROM cic_projects_products_rel WHERE project_id=${projectId} ORDER BY ordering,product_id`;
  const serviceRows = await sql`SELECT service_id FROM cic_projects_services_rel WHERE project_id=${projectId} ORDER BY ordering,service_id`;
  const snapshot: ProjectTrashSnapshot = projectSnapshotSchema.parse({
    version: 1,
    record: {
      id: Number(row.id), title: String(row.title), alias: String(row.alias), tagline: nullable(row.tagline),
      summary: nullable(row.summary), content: nullable(row.content), sector: nullable(row.sector), solution: nullable(row.solution),
      technologies: Array.isArray(row.technologies) ? row.technologies.map(String) : [], customer_name: nullable(row.customer_name),
      location: nullable(row.location), start_year: nullableInt(row.start_year), end_year: nullableInt(row.end_year),
      is_ongoing: Boolean(row.is_ongoing), image: nullable(row.image), is_featured: Boolean(row.is_featured),
      published: Boolean(row.published), ordering: Number(row.ordering), seo_title: nullable(row.seo_title),
      seo_keyword: nullable(row.seo_keyword), seo_description: nullable(row.seo_description), created_by: nullableInt(row.created_by),
      updated_by: nullableInt(row.updated_by), created_time: toIso(row.created_time), updated_time: toIso(row.updated_time),
    },
    relations: {
      productIds: productRows.map((item) => Number(item.product_id)),
      serviceIds: serviceRows.map((item) => Number(item.service_id)),
    },
  });

  const [trash] = await sql`
    INSERT INTO cic_trash_items
      (workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state)
    VALUES
      ('vi','project',${String(projectId)},'projects',${snapshot.record.title},${sql.json(snapshot as never)},${`/projects/${snapshot.record.alias}`},'trashed',${actorId},now()+interval '30 days','draft')
    RETURNING id
  `;
  await sql`DELETE FROM cic_projects WHERE id=${projectId}`;
  return { trashId: String(trash.id), title: snapshot.record.title };
}

async function inspectProject(sql: Sql, rawSnapshot: unknown): Promise<TrashInspection> {
  const parsed = projectSnapshotSchema.safeParse(rawSnapshot);
  if (!parsed.success) return { status: 'schema_mismatch', details: 'Snapshot dự án không đúng phiên bản được hỗ trợ.', restoreModes: [] };
  const snapshot = parsed.data;
  const [idConflict] = await sql`SELECT 1 FROM cic_projects WHERE id=${snapshot.record.id} LIMIT 1`;
  if (idConflict) return { status: 'conflict', details: 'ID dự án gốc đã được sử dụng; cần xử lý thủ công trước khi phục hồi.', restoreModes: [] };
  const [aliasConflict] = await sql`SELECT 1 FROM cic_projects WHERE lower(alias)=lower(${snapshot.record.alias}) LIMIT 1`;
  const products = snapshot.relations.productIds.length
    ? await sql`SELECT id FROM cic_products WHERE id IN ${sql(snapshot.relations.productIds)}` : [];
  const services = snapshot.relations.serviceIds.length
    ? await sql`SELECT id FROM cic_services WHERE id IN ${sql(snapshot.relations.serviceIds)}` : [];
  if (products.length !== snapshot.relations.productIds.length || services.length !== snapshot.relations.serviceIds.length) {
    return { status: 'conflict', details: 'Một hoặc nhiều sản phẩm/dịch vụ liên quan không còn tồn tại.', restoreModes: [] };
  }
  if (aliasConflict) return { status: 'conflict', details: `Slug “${snapshot.record.alias}” đang được một dự án khác sử dụng.`, restoreModes: ['auto_rename'] };
  return { status: 'clear', details: 'Snapshot và các quan hệ dự án sẵn sàng phục hồi.', restoreModes: ['as_draft'] };
}

async function uniqueRestoredAlias(sql: Sql, original: string) {
  const base = `${original.replace(/-restored(?:-\d+)?$/, '')}-restored`.slice(0, 240);
  let candidate = base;
  for (let suffix = 2; (await sql`SELECT 1 FROM cic_projects WHERE lower(alias)=lower(${candidate}) LIMIT 1`).length; suffix += 1) {
    candidate = `${base.slice(0, 246 - String(suffix).length)}-${suffix}`;
  }
  return candidate;
}

async function restoreProject(sql: Sql, rawSnapshot: unknown, mode: TrashRestoreMode) {
  const snapshot = projectSnapshotSchema.parse(rawSnapshot);
  const inspection = await inspectProject(sql, snapshot);
  if (!inspection.restoreModes.includes(mode)) throw new Error(inspection.details);
  const record = snapshot.record;
  const alias = mode === 'auto_rename' ? await uniqueRestoredAlias(sql, record.alias) : record.alias;
  await sql`
    INSERT INTO cic_projects
      (id,title,alias,tagline,summary,content,sector,solution,technologies,customer_name,location,start_year,end_year,
       is_ongoing,image,is_featured,published,ordering,seo_title,seo_keyword,seo_description,created_by,updated_by,created_time,updated_time)
    OVERRIDING SYSTEM VALUE
    VALUES
      (${record.id},${record.title},${alias},${record.tagline},${record.summary},${record.content},${record.sector},${record.solution},
       ${sql.array(record.technologies)},${record.customer_name},${record.location},${record.start_year},${record.end_year},${record.is_ongoing},
       ${record.image},${record.is_featured},false,${record.ordering},${record.seo_title},${record.seo_keyword},${record.seo_description},
       ${record.created_by},${record.updated_by},${record.created_time},now())
  `;
  for (const [ordering, productId] of snapshot.relations.productIds.entries()) {
    await sql`INSERT INTO cic_projects_products_rel (project_id,product_id,ordering) VALUES (${record.id},${productId},${ordering})`;
  }
  for (const [ordering, serviceId] of snapshot.relations.serviceIds.entries()) {
    await sql`INSERT INTO cic_projects_services_rel (project_id,service_id,ordering) VALUES (${record.id},${serviceId},${ordering})`;
  }
  return { title: record.title, restoredEntityId: String(record.id), restoredState: 'draft' as const, originalAlias: record.alias, restoredAlias: alias };
}

export const projectTrashAdapter: TrashEntityAdapter = {
  entityType: 'project', module: 'projects', label: 'Dự án', itemType: 'Dự án', workspace: 'vi',
  restoreState: 'draft', supportsPurge: true,
  getRevalidationTargets: () => [
    { path: '/cms/projects' },
    { path: '/projects' },
    { path: '/projects/[slug]', type: 'page' },
  ],
  parseSnapshot: (value) => projectSnapshotSchema.parse(value),
  inspect: inspectProject,
  restore: restoreProject,
  purge: async () => undefined,
  presentSnapshot: (value) => {
    const snapshot = projectSnapshotSchema.parse(value);
    return {
      version: snapshot.version,
      title: snapshot.record.title,
      slug: snapshot.record.alias,
      publishedBeforeDelete: snapshot.record.published,
      image: snapshot.record.image,
      productRelations: snapshot.relations.productIds.length,
      serviceRelations: snapshot.relations.serviceIds.length,
    };
  },
};

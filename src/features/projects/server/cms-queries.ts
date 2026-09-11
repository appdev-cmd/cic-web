import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { normalizeMediaUrl } from '@/shared/lib/content';
import type { CmsProject, ProjectRelationOption, ProjectsModuleData } from '@/cms/modules/projects/types';

export type ProjectLocale = 'vi' | 'en';

const tables = (l: ProjectLocale) =>
  l === 'en'
    ? {
        p: 'cic_projects_en',
        pr: 'cic_projects_products_rel_en',
        sr: 'cic_projects_services_rel_en',
        prod: 'cic_products_en',
        serv: 'cic_services_en',
      }
    : {
        p: 'cic_projects',
        pr: 'cic_projects_products_rel',
        sr: 'cic_projects_services_rel',
        prod: 'cic_products',
        serv: 'cic_services',
      };

export async function getCmsProjects(locale: ProjectLocale): Promise<ProjectsModuleData> {
  const sql = getPostgresClient();
  const t = tables(locale);

  const [projects, productRels, serviceRels, productOptions, serviceOptions] = await Promise.all([
    sql.unsafe(`
      SELECT id, title, alias, tagline, summary, content, image, sector, solution,
             technologies, customer_name, location, start_year, end_year, is_ongoing,
             is_featured, published, ordering, seo_title, seo_keyword, seo_description,
             created_time, updated_time
      FROM ${t.p}
      ORDER BY ordering ASC, id ASC
    `),
    sql.unsafe(`SELECT project_id, product_id FROM ${t.pr} ORDER BY ordering ASC`).catch(() => []),
    sql.unsafe(`SELECT project_id, service_id FROM ${t.sr} ORDER BY ordering ASC`).catch(() => []),
    sql.unsafe(`
      SELECT p.id, p.name as label, p.image, m.name as brand, a.name as application
      FROM ${t.prod} p
      LEFT JOIN cic_manufactories m ON m.id::text = p.manufactory
      LEFT JOIN cic_products_applications_rel par ON par.product_id = p.id
      LEFT JOIN cic_application a ON a.id = par.application_id
      WHERE p.published = true
      ORDER BY p.ordering ASC, p.id ASC
    `).catch(() => []),
    sql.unsafe(`
      SELECT id, title as label, image, category_name as category
      FROM ${t.serv}
      WHERE published::text IN ('1', 'true')
      ORDER BY ordering ASC, id ASC
    `).catch(() => []),
  ]);

  const productRelMap = new Map<number, string[]>();
  for (const r of productRels as Array<{ project_id: number; product_id: number }>) {
    const pId = Number(r.project_id);
    if (!productRelMap.has(pId)) productRelMap.set(pId, []);
    productRelMap.get(pId)!.push(String(r.product_id));
  }

  const serviceRelMap = new Map<number, string[]>();
  for (const r of serviceRels as Array<{ project_id: number; service_id: number }>) {
    const pId = Number(r.project_id);
    if (!serviceRelMap.has(pId)) serviceRelMap.set(pId, []);
    serviceRelMap.get(pId)!.push(String(r.service_id));
  }

  const mappedProjects: CmsProject[] = (projects as Record<string, unknown>[]).map((row) => {
    const numId = Number(row.id);
    return {
      id: String(row.id),
      title: String(row.title ?? ''),
      alias: String(row.alias ?? row.id),
      tagline: String(row.tagline ?? ''),
      summary: String(row.summary ?? ''),
      content: String(row.content ?? ''),
      sector: String(row.sector ?? ''),
      solution: String(row.solution ?? ''),
      technologies: Array.isArray(row.technologies)
        ? (row.technologies as string[]).map(String)
        : [],
      customer_name: String(row.customer_name ?? ''),
      location: String(row.location ?? ''),
      start_year: row.start_year != null ? Number(row.start_year) : null,
      end_year: row.end_year != null ? Number(row.end_year) : null,
      is_ongoing: Boolean(row.is_ongoing),
      image: normalizeMediaUrl(row.image ? String(row.image) : ''),
      products_related: productRelMap.get(numId) ?? [],
      services_related: serviceRelMap.get(numId) ?? [],
      is_featured: Boolean(row.is_featured),
      published: Boolean(row.published),
      ordering: Number(row.ordering ?? 0),
      seo_title: String(row.seo_title ?? ''),
      seo_keyword: String(row.seo_keyword ?? ''),
      seo_description: String(row.seo_description ?? ''),
      created_time: row.created_time ? new Date(String(row.created_time)).toISOString() : new Date().toISOString(),
      updated_time: row.updated_time ? new Date(String(row.updated_time)).toISOString() : new Date().toISOString(),
    };
  });

  const mappedProducts: ProjectRelationOption[] = (productOptions as Record<string, unknown>[]).map((p) => ({
    id: String(p.id),
    label: String(p.label ?? p.id),
    subLabel: [p.brand, p.application].filter(Boolean).map(String).join(' · '),
    image: normalizeMediaUrl(p.image ? String(p.image) : ''),
  }));

  const mappedServices: ProjectRelationOption[] = (serviceOptions as Record<string, unknown>[]).map((s) => ({
    id: String(s.id),
    label: String(s.label ?? s.id),
    subLabel: String(s.category ?? 'Dịch vụ CIC'),
    image: normalizeMediaUrl(s.image ? String(s.image) : ''),
  }));

  return {
    projects: mappedProjects,
    productOptions: mappedProducts,
    serviceOptions: mappedServices,
  };
}

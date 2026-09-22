import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import { getPostgresClient } from '@/server/db/postgres';
import type { ProjectListItemViewModel, ProjectDetailViewModel, ProjectRelationLink } from '../types';

type ProjectRow = {
  id: number | string;
  title: string;
  alias: string;
  tagline: string | null;
  summary: string | null;
  content?: string | null;
  image: string | null;
  sector: string | null;
  solution: string | null;
  technologies: string[] | null;
  customer_name: string | null;
  location: string | null;
  start_year: number | null;
  end_year: number | null;
  is_ongoing: boolean;
  is_featured: boolean;
  ordering?: number;
  seo_title?: string | null;
  seo_keyword?: string | null;
  seo_description?: string | null;
};

export function formatProjectPeriod(
  startYear: number | null,
  endYear: number | null,
  isOngoing: boolean,
  locale: 'vi' | 'en' = 'vi'
): string {
  if (!startYear) return '—';
  if (isOngoing) return locale === 'en' ? `${startYear} - Present` : `${startYear} - Hiện tại`;
  if (endYear && endYear !== startYear) return `${startYear} - ${endYear}`;
  return String(startYear);
}

export function mapProjectListItem(row: ProjectRow, locale: 'vi' | 'en' = 'vi'): ProjectListItemViewModel {
  return {
    id: String(row.id),
    title: row.title,
    slug: row.alias,
    tagline: row.tagline ?? null,
    summary: row.summary ?? null,
    image: row.image ?? null,
    sector: row.sector ?? null,
    solution: row.solution ?? null,
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    customerName: row.customer_name ?? null,
    location: row.location ?? null,
    startYear: row.start_year ?? null,
    endYear: row.end_year ?? null,
    isOngoing: Boolean(row.is_ongoing),
    isFeatured: Boolean(row.is_featured),
    timeDisplay: formatProjectPeriod(row.start_year, row.end_year, Boolean(row.is_ongoing), locale),
  };
}

export async function listPublishedProjects(locale: 'vi' | 'en' = 'vi'): Promise<ProjectListItemViewModel[]> {
  const sql = getPostgresClient();
  const isEn = locale === 'en';
  const table = isEn ? sql`cic_projects_en` : sql`cic_projects`;

  const rows = await sql<ProjectRow[]>`
    SELECT id, title, alias, tagline, summary, image, sector, solution,
           technologies, customer_name, location, start_year, end_year, is_ongoing,
           is_featured, ordering
    FROM ${table}
    WHERE published = true
    ORDER BY coalesce(updated_time, created_time) DESC NULLS LAST, ordering ASC, id DESC
  `;

  return rows.map((r) => mapProjectListItem(r, locale));
}

export async function getPublishedProjectBySlug(slug: string, locale: 'vi' | 'en' = 'vi'): Promise<ProjectDetailViewModel | null> {
  const sql = getPostgresClient();
  const isEn = locale === 'en';
  const table = isEn ? sql`cic_projects_en` : sql`cic_projects`;
  const prodTable = isEn ? sql`cic_products_en` : sql`cic_products`;
  const mfgTable = isEn ? sql`cic_manufactories_en` : sql`cic_manufactories`;
  const serviceTable = isEn ? sql`cic_services_en` : sql`cic_services`;

  const [row] = await sql<ProjectRow[]>`
    SELECT id, title, alias, tagline, summary, content, image, sector, solution,
           technologies, customer_name, location, start_year, end_year, is_ongoing,
           is_featured, ordering, seo_title, seo_keyword, seo_description
    FROM ${table}
    WHERE published = true AND alias = ${slug}
    LIMIT 1
  `;

  if (!row) return null;

  const projectId = Number(row.id);

  // Parallel fetch: related products & related services & related projects
  const [productRows, serviceRows, relatedProjectRows] = await Promise.all([
    sql`
      SELECT p.id, p.name as label, p.image, m.name as brand, a.name as application
      FROM cic_projects_products_rel r
      JOIN ${prodTable} p ON p.id = r.product_id
      LEFT JOIN ${mfgTable} m ON m.id::text = p.manufactory
      LEFT JOIN cic_products_applications_rel par ON par.product_id = p.id
      LEFT JOIN cic_application a ON a.id = par.application_id AND a.name NOT ILIKE '[Du lieu da bi xoa%'
      WHERE r.project_id = ${projectId} AND p.published = true AND p.name NOT ILIKE '[Du lieu da bi xoa%'
      ORDER BY r.ordering ASC, p.id ASC
    `,
    sql`
      SELECT s.id, s.title as label, s.alias, s.image, s.summary
      FROM cic_projects_services_rel r
      JOIN ${serviceTable} s ON s.id = r.service_id
      WHERE r.project_id = ${projectId} AND s.published::text IN ('1', 'true')
      ORDER BY r.ordering ASC, s.id ASC
    `,
    sql<ProjectRow[]>`
      SELECT id, title, alias, tagline, summary, image, sector, solution,
             technologies, customer_name, location, start_year, end_year, is_ongoing, is_featured
      FROM ${table}
      WHERE published = true AND id != ${projectId}
      ORDER BY (CASE WHEN sector = ${row.sector} THEN 0 ELSE 1 END), ordering ASC, id ASC
      LIMIT 3
    `,
  ]);

  const serviceSubLabel = locale === 'en' ? 'CIC Consulting Service' : 'Dịch vụ CIC';

  const relatedLinks: ProjectRelationLink[] = [
    ...productRows.map((p: any) => ({
      id: Number(p.id),
      label: p.label,
      view: 'products' as const,
      subLabel: [p.brand, p.application].filter(Boolean).join(' · '),
      image: p.image,
    })),
    ...serviceRows.map((s: any) => ({
      id: s.alias || String(s.id),
      label: s.label,
      view: 'services' as const,
      subLabel: serviceSubLabel,
      image: s.image,
    })),
  ];

  const baseItem = mapProjectListItem(row, locale);

  return {
    ...baseItem,
    content: row.content ?? null,
    seoTitle: row.seo_title ?? row.title,
    seoKeyword: row.seo_keyword ?? null,
    seoDescription: row.seo_description ?? row.summary,
    relatedLinks,
    relatedProjects: relatedProjectRows.map((p) => mapProjectListItem(p, locale)),
  };
}

// Legacy alias for compatibility
export const mapProject = mapProjectListItem;

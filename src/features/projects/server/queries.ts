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
  isOngoing: boolean
): string {
  if (!startYear) return '—';
  if (isOngoing) return `${startYear} - Hiện tại`;
  if (endYear && endYear !== startYear) return `${startYear} - ${endYear}`;
  return String(startYear);
}

export function mapProjectListItem(row: ProjectRow): ProjectListItemViewModel {
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
    timeDisplay: formatProjectPeriod(row.start_year, row.end_year, Boolean(row.is_ongoing)),
  };
}

export async function listPublishedProjects(): Promise<ProjectListItemViewModel[]> {
  const client = await getDatabaseClient();
  const { data, error } = await client
    .from('cic_projects')
    .select(
      'id,title,alias,tagline,summary,image,sector,solution,technologies,customer_name,location,start_year,end_year,is_ongoing,is_featured,ordering'
    )
    .eq('published', true)
    .order('ordering', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw new Error('Unable to load projects.');
  return ((data ?? []) as unknown as ProjectRow[]).map(mapProjectListItem);
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectDetailViewModel | null> {
  const sql = getPostgresClient();

  const [row] = await sql<ProjectRow[]>`
    SELECT id, title, alias, tagline, summary, content, image, sector, solution,
           technologies, customer_name, location, start_year, end_year, is_ongoing,
           is_featured, ordering, seo_title, seo_keyword, seo_description
    FROM cic_projects
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
      JOIN cic_products p ON p.id = r.product_id
      LEFT JOIN cic_manufactories m ON m.id = p.manufactory
      LEFT JOIN cic_products_applications_rel par ON par.products_id = p.id
      LEFT JOIN cic_application a ON a.id = par.application_id
      WHERE r.project_id = ${projectId} AND p.published = true
      ORDER BY r.ordering ASC, p.id ASC
    `,
    sql`
      SELECT s.id, s.title as label, s.alias, s.image, s.summary
      FROM cic_projects_services_rel r
      JOIN cic_services s ON s.id = r.service_id
      WHERE r.project_id = ${projectId} AND s.published = true
      ORDER BY r.ordering ASC, s.id ASC
    `,
    sql<ProjectRow[]>`
      SELECT id, title, alias, tagline, summary, image, sector, solution,
             technologies, customer_name, location, start_year, end_year, is_ongoing, is_featured
      FROM cic_projects
      WHERE published = true AND id != ${projectId}
      ORDER BY (CASE WHEN sector = ${row.sector} THEN 0 ELSE 1 END), ordering ASC, id ASC
      LIMIT 3
    `,
  ]);

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
      subLabel: 'Dịch vụ CIC',
      image: s.image,
    })),
  ];

  const baseItem = mapProjectListItem(row);

  return {
    ...baseItem,
    content: row.content ?? null,
    seoTitle: row.seo_title ?? row.title,
    seoKeyword: row.seo_keyword ?? null,
    seoDescription: row.seo_description ?? row.summary,
    relatedLinks,
    relatedProjects: relatedProjectRows.map(mapProjectListItem),
  };
}

// Legacy alias for compatibility
export const mapProject = mapProjectListItem;

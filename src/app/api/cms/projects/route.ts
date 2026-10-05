import { NextResponse } from 'next/server';
import { can, getCurrentCmsPrincipal } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import { normalizeServerError } from '@/server/errors';

interface ProjectRow {
  id: number | string;
  title: string;
  alias: string;
  tagline?: string | null;
  summary?: string | null;
  content?: string | null;
  sector?: string | null;
  solution?: string | null;
  technologies?: unknown;
  customer_name?: string | null;
  location?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  is_ongoing?: boolean | null;
  image?: string | null;
  is_featured?: boolean | null;
  published?: boolean | null;
  ordering?: number | null;
  seo_title?: string | null;
  seo_keyword?: string | null;
  seo_description?: string | null;
  created_time?: string | Date | null;
  updated_time?: string | Date | null;
}

interface ProductOptionRow {
  id: number | string;
  label: string;
  brand?: string | null;
  application?: string | null;
  image?: string | null;
}

interface ServiceOptionRow {
  id: number | string;
  label: string;
  category?: string | null;
  image?: string | null;
}

function errorResponse(error: unknown) {
  const normalized = normalizeServerError(error);
  if (normalized.code === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (normalized.code === 'FORBIDDEN') return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
  return NextResponse.json({ error: 'Unable to load projects.' }, { status: 500 });
}

export async function GET() {
  try {
    const principal = await getCurrentCmsPrincipal();
    if (!can(principal, 'projects', 'view') && !can(principal, 'contents', 'view') && !principal.isAdministrator) {
      return NextResponse.json({ error: 'Permission denied.' }, { status: 403 });
    }
    const sql = getPostgresClient();

    const [projects, productRels, serviceRels, productOptions, serviceOptions] = await Promise.all([
      sql<ProjectRow[]>`
        SELECT id, title, alias, tagline, summary, content, image, sector, solution,
               technologies, customer_name, location, start_year, end_year, is_ongoing,
               is_featured, published, ordering, seo_title, seo_keyword, seo_description,
               created_time, updated_time
        FROM cic_projects
        ORDER BY ordering ASC, id ASC
      `,
      sql`SELECT project_id, product_id FROM cic_projects_products_rel ORDER BY ordering ASC`,
      sql`SELECT project_id, service_id FROM cic_projects_services_rel ORDER BY ordering ASC`,
      sql<ProductOptionRow[]>`
        SELECT p.id, p.name as label, p.image, m.name as brand, a.name as application
        FROM cic_products p
        LEFT JOIN cic_manufactories m ON m.id::text = p.manufactory
        LEFT JOIN cic_products_applications_rel par ON par.product_id = p.id
        LEFT JOIN cic_application a ON a.id = par.application_id
        WHERE p.published = true
        ORDER BY p.ordering ASC, p.id ASC
      `,
      sql<ServiceOptionRow[]>`
        SELECT id, title as label, image, category_name as category
        FROM cic_services
        WHERE published::text IN ('1', 'true')
        ORDER BY ordering ASC, id ASC
      `,
    ]);

    const productRelMap = new Map<number, string[]>();
    for (const r of productRels) {
      const pId = Number(r.project_id);
      if (!productRelMap.has(pId)) productRelMap.set(pId, []);
      productRelMap.get(pId)!.push(String(r.product_id));
    }

    const serviceRelMap = new Map<number, string[]>();
    for (const r of serviceRels) {
      const pId = Number(r.project_id);
      if (!serviceRelMap.has(pId)) serviceRelMap.set(pId, []);
      serviceRelMap.get(pId)!.push(String(r.service_id));
    }

    const mappedProjects = (projects as ProjectRow[]).map((row) => {
      const numId = Number(row.id);
      return {
        id: String(row.id),
        title: row.title,
        alias: row.alias,
        tagline: row.tagline ?? '',
        summary: row.summary ?? '',
        content: row.content ?? '',
        sector: row.sector ?? '',
        solution: row.solution ?? '',
        technologies: Array.isArray(row.technologies) ? row.technologies : [],
        customer_name: row.customer_name ?? '',
        location: row.location ?? '',
        start_year: row.start_year ?? null,
        end_year: row.end_year ?? null,
        is_ongoing: Boolean(row.is_ongoing),
        image: row.image ?? '',
        products_related: productRelMap.get(numId) ?? [],
        services_related: serviceRelMap.get(numId) ?? [],
        is_featured: Boolean(row.is_featured),
        published: Boolean(row.published),
        ordering: Number(row.ordering ?? 0),
        seo_title: row.seo_title ?? '',
        seo_keyword: row.seo_keyword ?? '',
        seo_description: row.seo_description ?? '',
        created_time: row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString(),
        updated_time: row.updated_time ? new Date(row.updated_time).toISOString() : new Date().toISOString(),
      };
    });

    const productMap = new Map<string, { id: string; label: string; subLabel: string; image?: string | null }>();
    for (const p of productOptions as ProductOptionRow[]) {
      const idStr = String(p.id);
      const appName = p.application ? String(p.application) : null;
      const existing = productMap.get(idStr);
      if (!existing) {
        productMap.set(idStr, {
          id: idStr,
          label: p.label,
          subLabel: [p.brand, appName].filter(Boolean).join(' · '),
          image: p.image,
        });
      } else if (appName && existing.subLabel && !existing.subLabel.includes(appName)) {
        existing.subLabel = `${existing.subLabel}, ${appName}`;
      }
    }
    const mappedProducts = Array.from(productMap.values());

    const serviceMap = new Map<string, { id: string; label: string; subLabel: string; image?: string | null }>();
    for (const s of serviceOptions as ServiceOptionRow[]) {
      const idStr = String(s.id);
      if (!serviceMap.has(idStr)) {
        serviceMap.set(idStr, {
          id: idStr,
          label: s.label,
          subLabel: s.category || 'Dịch vụ CIC',
          image: s.image,
        });
      }
    }
    const mappedServices = Array.from(serviceMap.values());

    return NextResponse.json({
      projects: mappedProjects,
      productOptions: mappedProducts,
      serviceOptions: mappedServices,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

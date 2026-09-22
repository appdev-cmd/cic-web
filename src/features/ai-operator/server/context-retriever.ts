import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';

export interface CicTaxonomyContext {
  brands: Array<{ id: number; name: string; alias: string }>;
  categories: Array<{ id: number; name: string; alias: string }>;
  applications: Array<{ id: number; name: string }>;
  productTypes: Array<{ id: number; name: string }>;
}

export interface CicSimilarProductContext {
  id: number;
  name: string;
  summary: string;
  manufactory: string;
  categoryId: string;
  tags: string;
}

// In-memory cache for taxonomy to prevent connection pool pressure
let cachedTaxonomy: { data: CicTaxonomyContext; expiresAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Optimized batched query for master taxonomy.
 * Uses cached result when available to prevent repeated pool exhaustion.
 */
export async function getCicTaxonomyContext(forceRefresh = false): Promise<CicTaxonomyContext> {
  const now = Date.now();
  if (!forceRefresh && cachedTaxonomy && cachedTaxonomy.expiresAt > now) {
    return cachedTaxonomy.data;
  }

  const sql = getPostgresClient();

  // Run sequential or bundled query without spamming concurrent connections
  const brandsRows = await sql<{ id: number; name: string; alias: string }[]>`
    SELECT id, name, alias 
    FROM cic_manufactories 
    WHERE published = true 
    ORDER BY ordering, name
  `;

  const categoriesRows = await sql<{ id: number; name: string; alias: string }[]>`
    SELECT id, name, alias 
    FROM cic_products_categories 
    WHERE published = true 
    ORDER BY ordering, name
  `;

  const applicationsRows = await sql<{ id: number; name: string }[]>`
    SELECT id, name 
    FROM cic_application 
    WHERE published = true AND name NOT ILIKE '[Du lieu da bi xoa%'
    ORDER BY ordering, name
  `;

  const typesRows = await sql<{ id: number; name: string }[]>`
    SELECT id, name 
    FROM cic_products_types 
    ORDER BY ordering, name
  `;

  const result: CicTaxonomyContext = {
    brands: brandsRows.map((r) => ({ id: Number(r.id), name: String(r.name || ''), alias: String(r.alias || '') })),
    categories: categoriesRows.map((r) => ({ id: Number(r.id), name: String(r.name || ''), alias: String(r.alias || '') })),
    applications: applicationsRows.map((r) => ({ id: Number(r.id), name: String(r.name || '') })),
    productTypes: typesRows.map((r) => ({ id: Number(r.id), name: String(r.name || '') })),
  };

  cachedTaxonomy = {
    data: result,
    expiresAt: now + CACHE_TTL_MS,
  };

  return result;
}

/**
 * Searches for a similar existing product to use as structure/style reference.
 * Returns up to 2 items max, strictly for structure guidance (not fact copying).
 */
export async function findSimilarProductsContext(
  keyword: string,
  manufactoryId?: number | null
): Promise<CicSimilarProductContext[]> {
  const sql = getPostgresClient();
  const cleanKeyword = keyword.trim().replace(/[%_]/g, '');
  if (!cleanKeyword) return [];

  // Single targeted query
  const rows = await sql<{
    id: number;
    name: string;
    summary: string;
    manufactory: string;
    category_id: string;
    tags: string;
  }[]>`
    SELECT id, name, summary, manufactory, category_id, tags
    FROM cic_products
    WHERE published = true AND name NOT ILIKE '[Du lieu da bi xoa%'
      AND (
        (${manufactoryId ?? null}::text IS NOT NULL AND manufactory = ${String(manufactoryId)})
        OR name ILIKE '%' || ${cleanKeyword} || '%'
      )
    ORDER BY id DESC
    LIMIT 2
  `;

  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name || ''),
    summary: String(r.summary || ''),
    manufactory: String(r.manufactory || ''),
    categoryId: String(r.category_id || ''),
    tags: String(r.tags || ''),
  }));
}

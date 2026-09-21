import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import { getPostgresClient } from '@/server/db/postgres';
import type { FunctionSeoRecord, SeoFacetLevel, RedirectRule, SeoHealthMetrics, SeoWarningItem } from '../types';

interface ConfigModuleRow {
  id: number;
  module: string | null;
  view: string | null;
  task: string | null;
  title: string | null;
  value_seo_title: string | null;
  value_seo_keyword: string | null;
  value_seo_description: string | null;
  seo_indexable: boolean | null;
  ordering: number | null;
}

interface RedirectRow {
  id: number;
  source_path: string;
  target_path: string;
  status_code: number;
  source: string;
  is_active: boolean;
  hit_count: number;
  note: string | null;
  created_at: Date;
  updated_at: Date;
}

function resolveCanonicalRoute(module: string, view: string, locale: 'vi' | 'en') {
  const prefix = locale === 'en' ? '/en' : '';
  const key = `${module}:${view}`;
  switch (key) {
    case 'home:home':
      return { path: prefix || '/', canonical: prefix || '/', label: 'Trang chủ', intent: 'Cổng thông tin tổng quan và hệ sinh thái giải pháp CIC' };
    case 'products:home':
      return { path: `${prefix}/products`, canonical: `${prefix}/products`, label: 'Trang chủ sản phẩm', intent: 'Danh mục sản phẩm phần mềm, thiết bị và giải pháp công nghệ' };
    case 'products:cat':
      return { path: `${prefix}/products/categories`, canonical: `${prefix}/products/[category]`, label: 'Danh mục sản phẩm', intent: 'Trang duyệt cây phân loại sản phẩm và chuyên ngành' };
    case 'products:product':
      return { path: `${prefix}/products/[slug]`, canonical: `${prefix}/products/[slug]`, label: 'Chi tiết sản phẩm', intent: 'Trang thông tin kỹ thuật, thông số và đăng ký bản quyền sản phẩm' };
    case 'products:search':
      return { path: `${prefix}/search`, canonical: `${prefix}/search`, label: 'Tìm kiếm sản phẩm', intent: 'Trang kết quả tìm kiếm và bộ lọc thông số kỹ thuật' };
    case 'news:home':
      return { path: `${prefix}/news`, canonical: `${prefix}/news`, label: 'Trang chủ tin tức', intent: 'Trung tâm tin tức công nghệ, sự kiện và thông cáo báo chí' };
    case 'news:cat':
      return { path: `${prefix}/news/categories`, canonical: `${prefix}/news/[category]`, label: 'Danh mục tin tức', intent: 'Trang chuyên mục bài viết theo chủ đề và lĩnh vực' };
    case 'news:news':
      return { path: `${prefix}/news/[slug]`, canonical: `${prefix}/news/[slug]`, label: 'Chi tiết tin tức', intent: 'Trang hiển thị bài viết, bài phân tích chuyên sâu' };
    case 'contact:contact':
      return { path: `${prefix}/contact`, canonical: `${prefix}/contact`, label: 'Liên hệ', intent: 'Trang thông tin văn phòng, chi nhánh và biểu mẫu liên hệ' };
    case 'contents:cat':
      return { path: `${prefix}/gioi-thieu`, canonical: `${prefix}/gioi-thieu`, label: 'Giới thiệu & Danh mục tĩnh', intent: 'Trang hồ sơ năng lực và cơ cấu tổ chức doanh nghiệp' };
    case 'contents:content':
      return { path: `${prefix}/[slug]`, canonical: `${prefix}/[slug]`, label: 'Trang tĩnh & Chính sách', intent: 'Trang điều khoản, quy chế sử dụng và chính sách bảo mật' };
    default:
      return { path: `${prefix}/${module}`, canonical: `${prefix}/${module}`, label: module, intent: 'Trang chức năng hệ thống' };
  }
}

function getProductFacets(locale: 'vi' | 'en'): SeoFacetLevel[] {
  const isEn = locale === 'en';
  return [
    {
      id: 'prod_cat',
      number: 'F1',
      title: isEn ? 'Product Categories' : 'Danh mục sản phẩm',
      facetType: 'category',
      pattern: isEn ? '/en/products/[category]' : '/products/[category]',
      owner: 'Nguyễn Văn A (Nhóm Sản phẩm)',
      status: 'available',
      href: '/cms/product-settings/categories',
      description: isEn ? 'SEO template for product category archives' : 'Mẫu SEO áp dụng cho các trang lưu trữ và phân loại danh mục sản phẩm',
      titleTemplate: isEn ? '{Category Name} Solutions | CIC' : '{Tên danh mục} | Giải pháp phần mềm CIC',
      keywordsTemplate: '{Tên danh mục}, bản quyền phần mềm, CIC Vietnam',
      descriptionTemplate: isEn ? 'Discover official {Category Name} software and hardware solutions at CIC.' : 'Khám phá và tư vấn các giải pháp {Tên danh mục} chính hãng tại CIC Vietnam.',
    },
    {
      id: 'prod_brand',
      number: 'F2',
      title: isEn ? 'Brands & Manufacturers' : 'Hãng sản xuất',
      facetType: 'brand',
      pattern: isEn ? '/en/products/brand/[brand]' : '/products/brand/[brand]',
      owner: 'Trần Thị B (Đối tác quốc tế)',
      status: 'available',
      href: '/cms/product-settings/brands',
      description: isEn ? 'SEO template for brand pages' : 'Mẫu SEO áp dụng cho các trang thương hiệu và nhà phát triển đối tác',
      titleTemplate: isEn ? '{Brand Name} Software & Licenses | CIC' : 'Phần mềm {Tên hãng} chính hãng | CIC',
      keywordsTemplate: '{Tên hãng}, đại lý phân phối, bản quyền chính hãng',
      descriptionTemplate: isEn ? 'CIC is an official authorized partner of {Brand Name} in Vietnam.' : 'CIC là đại diện phân phối chính thức của {Tên hãng} tại Việt Nam, hỗ trợ kỹ thuật 24/7.',
    },
    {
      id: 'prod_app',
      number: 'F3',
      title: isEn ? 'Application Fields' : 'Lĩnh vực ứng dụng',
      facetType: 'application',
      pattern: isEn ? '/en/products/application/[app]' : '/products/application/[app]',
      owner: 'Lê Văn C (Tư vấn kỹ thuật)',
      status: 'available',
      href: '/cms/product-settings/applications',
      description: isEn ? 'SEO template for industry application segments' : 'Mẫu SEO phân loại theo chuyên ngành và mục tiêu ứng dụng',
      titleTemplate: isEn ? 'Solutions for {Application Field} | CIC' : 'Giải pháp cho {Lĩnh vực ứng dụng} | CIC',
      keywordsTemplate: '{Lĩnh vực ứng dụng}, giải pháp số, mô hình hóa',
      descriptionTemplate: isEn ? 'High-end specialized solutions for {Application Field}.' : 'Hệ sinh thái công nghệ hàng đầu phục vụ chuyên sâu cho {Lĩnh vực ứng dụng}.',
    },
    {
      id: 'prod_type',
      number: 'F4',
      title: isEn ? 'Product Types' : 'Loại sản phẩm',
      facetType: 'product_type',
      pattern: isEn ? '/en/products/type/[type]' : '/products/type/[type]',
      owner: 'Phạm Thị D (Quản lý bản quyền)',
      status: 'available',
      href: '/cms/product-settings/types',
      description: isEn ? 'SEO template for license forms' : 'Mẫu SEO phân chia theo loại hình bản quyền hoặc thiết bị phần cứng',
      titleTemplate: isEn ? '{Product Type} - Licensing & Hardware | CIC' : '{Loại sản phẩm} - Bản quyền & Phần cứng | CIC',
      keywordsTemplate: '{Loại sản phẩm}, mua bản quyền, giấy phép',
      descriptionTemplate: isEn ? 'Official {Product Type} options provided by CIC.' : 'Cung cấp các gói {Loại sản phẩm} theo tiêu chuẩn chính hãng từ nhà sản xuất.',
    },
  ];
}

export async function getFunctionSeoData(locale: 'vi' | 'en'): Promise<FunctionSeoRecord[]> {
  const sql = getPostgresClient();
  const table = locale === 'en' ? 'cic_config_modules_en' : 'cic_config_modules';

  const rows = await sql<ConfigModuleRow[]>`
    SELECT id, module, view, task, title, value_seo_title, value_seo_keyword, value_seo_description, seo_indexable, ordering
    FROM ${sql(table)}
    ORDER BY ordering NULLS LAST, id ASC
  `;

  return rows.map((r) => {
    const mod = String(r.module ?? '');
    const v = String(r.view ?? '');
    const meta = resolveCanonicalRoute(mod, v, locale);

    const hasFacets = mod === 'products' && v === 'home';
    const facetLevels = hasFacets ? getProductFacets(locale) : undefined;

    const title = String(r.value_seo_title ?? '');
    const description = String(r.value_seo_description ?? '');

    return {
      id: String(r.id),
      routeKey: `${mod}_${v}`,
      path: meta.path,
      module: mod,
      view: v,
      label: String(r.title ?? meta.label),
      intent: meta.intent,
      title: title,
      keywords: String(r.value_seo_keyword ?? ''),
      description: description,
      canonicalPath: meta.canonical,
      indexable: r.seo_indexable !== false,
      updatedAt: new Date().toISOString(),
      categoryPath: mod === 'products' ? '/products/categories' : mod === 'news' ? '/news/categories' : undefined,
      categoryPattern: mod === 'products' ? '/products/[category]' : mod === 'news' ? '/news/[category]' : undefined,
      categoryOwner: 'Ban Biên Tập',
      categoryStatus: 'available' as const,
      detailPath: meta.canonical,
      detailPattern: meta.canonical,
      detailOwner: 'Quản trị viên',
      detailStatus: title && description ? 'available' as const : 'missing' as const,
      facetLevels,
    };
  });
}

export async function getRedirects(): Promise<RedirectRule[]> {
  const sql = getPostgresClient();
  const rows = await sql<RedirectRow[]>`
    SELECT id, source_path, target_path, status_code, source, is_active, hit_count, note, created_at, updated_at
    FROM cic_redirects
    ORDER BY id DESC
  `;

  return rows.map((r) => ({
    id: r.id,
    from: r.source_path,
    to: r.target_path,
    type: r.status_code === 302 ? '302' : '301',
    source: r.source,
    active: r.is_active,
    hitCount: r.hit_count,
    note: r.note,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
  }));
}

export async function getSeoHealthMetrics(locale: 'vi' | 'en'): Promise<SeoHealthMetrics> {
  const records = await getFunctionSeoData(locale);
  const sql = getPostgresClient();

  // Also count published articles, products, pages to give accurate health overview
  const [newsCount] = await sql`SELECT count(*)::int as count FROM cic_news WHERE published = true`;
  const [prodCount] = await sql`SELECT count(*)::int as count FROM cic_products WHERE published = true`;
  const [pageCount] = await sql`SELECT count(*)::int as count FROM cic_content_pages WHERE published_revision_id IS NOT NULL`;
  const [serviceCount] = await sql`SELECT count(*)::int as count FROM cic_services WHERE published::int = 1`;
  const [projectCount] = await sql`SELECT count(*)::int as count FROM cic_projects WHERE published = true`;
  const [eventCount] = await sql`SELECT count(*)::int as count FROM cic_event WHERE published = true`;

  const totalPages =
    records.length +
    (newsCount?.count ?? 0) +
    (prodCount?.count ?? 0) +
    (pageCount?.count ?? 0) +
    (serviceCount?.count ?? 0) +
    (projectCount?.count ?? 0) +
    (eventCount?.count ?? 0);

  const missingDescriptionCount = records.filter((r) => !r.description.trim()).length;
  const missingTitleCount = records.filter((r) => !r.title.trim()).length;
  const noindexCount = records.filter((r) => !r.indexable).length;
  const missingOwnerCount = records.filter((r) => r.detailStatus === 'missing').length;

  const warnings: SeoWarningItem[] = [];

  for (const r of records) {
    const issues: string[] = [];
    if (!r.title.trim()) issues.push('Chưa cấu hình Tiêu đề SEO (Title)');
    if (!r.description.trim()) issues.push('Thiếu thẻ mô tả Meta Description');
    if (!r.indexable) issues.push('Đang tắt lập chỉ mục Google (noindex)');

    if (issues.length > 0) {
      warnings.push({
        id: r.id,
        path: r.path,
        label: r.label,
        severity: !r.indexable ? 'high' : !r.title.trim() ? 'high' : 'medium',
        issues,
        editUrl: r.module === 'products' ? '/cms/products' : r.module === 'news' ? '/cms/news' : '/cms/function-seo',
      });
    }
  }

  return {
    totalPages,
    missingDescriptionCount,
    missingTitleCount,
    noindexCount,
    missingOwnerCount,
    warnings,
  };
}

export async function resolveRedirect(pathname: string): Promise<{ targetPath: string; statusCode: number } | null> {
  const sql = getPostgresClient();
  const normalized = pathname.trim().toLowerCase();

  const [match] = await sql<{ id: number; target_path: string; status_code: number }[]>`
    SELECT id, target_path, status_code 
    FROM cic_redirects 
    WHERE LOWER(TRIM(source_path)) = ${normalized} AND is_active = true
    LIMIT 1
  `;

  if (!match) return null;

  // Increment hit count asynchronously
  sql`UPDATE cic_redirects SET hit_count = hit_count + 1 WHERE id = ${match.id}`.catch(() => {});

  return {
    targetPath: match.target_path,
    statusCode: match.status_code,
  };
}

export async function getFunctionSeoMetadata(moduleKey: string, viewKey: string, locale: 'vi' | 'en' = 'vi') {
  const sql = getPostgresClient();
  const table = locale === 'en' ? 'cic_config_modules_en' : 'cic_config_modules';

  const [row] = await sql<ConfigModuleRow[]>`
    SELECT value_seo_title, value_seo_keyword, value_seo_description, seo_indexable, title
    FROM ${sql(table)}
    WHERE module = ${moduleKey} AND (view = ${viewKey} OR view IS NULL)
    LIMIT 1
  `;

  if (!row) return null;

  return {
    title: row.value_seo_title || row.title || undefined,
    description: row.value_seo_description || undefined,
    keywords: row.value_seo_keyword || undefined,
    indexable: row.seo_indexable !== false,
  };
}

export interface SitemapUrlEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function getPublicSitemapUrls(baseUrl: string): Promise<SitemapUrlEntry[]> {
  const sql = getPostgresClient();
  const rawEntries: SitemapUrlEntry[] = [];
  const base = baseUrl.replace(/\/+$/, '');

  // 1. Static System Pages from cic_config_modules (VI & EN)
  const [systemRecordsVi, systemRecordsEn] = await Promise.all([
    getFunctionSeoData('vi').catch(() => []),
    getFunctionSeoData('en').catch(() => []),
  ]);

  for (const item of systemRecordsVi) {
    if (item.indexable && !item.path.includes('[') && item.path !== '/search' && !item.path.endsWith('/search')) {
      rawEntries.push({
        url: `${base}${item.path}`,
        lastModified: new Date(),
        changeFrequency: item.path === '/' ? 'daily' : 'weekly',
        priority: item.path === '/' ? 1.0 : 0.8,
      });
    }
  }

  for (const item of systemRecordsEn) {
    if (item.indexable && !item.path.includes('[') && item.path !== '/en/search' && !item.path.endsWith('/search')) {
      rawEntries.push({
        url: `${base}${item.path}`,
        lastModified: new Date(),
        changeFrequency: item.path === '/en' ? 'daily' : 'weekly',
        priority: item.path === '/en' ? 0.9 : 0.7,
      });
    }
  }

  // 2. Published Static Pages (exclude test pages)
  const pages = await sql<{ slug: string; code: string; updated_at: Date }[]>`
    SELECT slug, code, updated_at 
    FROM cic_content_pages 
    WHERE published_revision_id IS NOT NULL 
      AND slug IS NOT NULL AND slug != ''
      AND lower(btrim(code)) NOT LIKE '%test%'
      AND lower(btrim(slug, '/')) != 'test'
  `;
  for (const p of pages) {
    if (p.code !== 'home') {
      const path = p.slug.startsWith('/') ? p.slug : `/${p.slug}`;
      rawEntries.push({
        url: `${base}${path}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Common static EN routes
  const staticEnPaths = ['/en/about', '/en/contact', '/en/privacy', '/en/terms'];
  for (const path of staticEnPaths) {
    rawEntries.push({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // 3. Published Products (VI & EN)
  const [productsVi, productsEn] = await Promise.all([
    sql<{ alias: string; edited_time: Date | null; created_time: Date | null }[]>`
      SELECT alias, edited_time, created_time 
      FROM cic_products 
      WHERE published = true AND alias IS NOT NULL AND alias != '' 
      LIMIT 10000
    `,
    sql<{ alias: string; edited_time: Date | null; created_time: Date | null }[]>`
      SELECT alias, edited_time, created_time 
      FROM cic_products_en 
      WHERE published = true AND alias IS NOT NULL AND alias != '' 
      LIMIT 10000
    `.catch(() => []),
  ]);

  for (const prod of productsVi) {
    rawEntries.push({
      url: `${base}/products/${prod.alias}`,
      lastModified: prod.edited_time ? new Date(prod.edited_time) : prod.created_time ? new Date(prod.created_time) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const prod of productsEn) {
    rawEntries.push({
      url: `${base}/en/products/${prod.alias}`,
      lastModified: prod.edited_time ? new Date(prod.edited_time) : prod.created_time ? new Date(prod.created_time) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // 4. Published News (VI & EN)
  const [newsVi, newsEn] = await Promise.all([
    sql<{ alias: string; updated_time: Date | null; created_time: Date | null }[]>`
      SELECT alias, updated_time, created_time 
      FROM cic_news 
      WHERE published = true AND alias IS NOT NULL AND alias != '' 
      LIMIT 10000
    `,
    sql<{ alias: string; updated_time: Date | null; created_time: Date | null }[]>`
      SELECT alias, updated_time, created_time 
      FROM cic_news_en 
      WHERE published = true AND alias IS NOT NULL AND alias != '' 
      LIMIT 10000
    `.catch(() => []),
  ]);

  for (const n of newsVi) {
    rawEntries.push({
      url: `${base}/news/${n.alias}`,
      lastModified: n.updated_time ? new Date(n.updated_time) : n.created_time ? new Date(n.created_time) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const n of newsEn) {
    rawEntries.push({
      url: `${base}/en/news/${n.alias}`,
      lastModified: n.updated_time ? new Date(n.updated_time) : n.created_time ? new Date(n.created_time) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  // 5. Published Services (VI & EN)
  const services = await sql<{ alias: string; created_time: Date | null }[]>`
    SELECT alias, created_time 
    FROM cic_services 
    WHERE published::int = 1 AND alias IS NOT NULL AND alias != '' 
    LIMIT 1000
  `;
  for (const s of services) {
    const lm = s.created_time ? new Date(s.created_time) : new Date();
    rawEntries.push({
      url: `${base}/services/${s.alias}`,
      lastModified: lm,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
    rawEntries.push({
      url: `${base}/en/services/${s.alias}`,
      lastModified: lm,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  // 6. Published Projects (VI & EN)
  const projects = await sql<{ alias: string; created_time: Date | null }[]>`
    SELECT alias, created_time 
    FROM cic_projects 
    WHERE published = true AND alias IS NOT NULL AND alias != '' 
    LIMIT 1000
  `;
  for (const proj of projects) {
    const lm = proj.created_time ? new Date(proj.created_time) : new Date();
    rawEntries.push({
      url: `${base}/projects/${proj.alias}`,
      lastModified: lm,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
    rawEntries.push({
      url: `${base}/en/projects/${proj.alias}`,
      lastModified: lm,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  // 7. Published Events
  const events = await sql<{ alias: string; updated_time: Date | null; created_time: Date | null }[]>`
    SELECT alias, updated_time, created_time 
    FROM cic_event 
    WHERE published = true AND alias IS NOT NULL AND alias != '' 
    LIMIT 1000
  `;
  for (const ev of events) {
    rawEntries.push({
      url: `${base}/events/${ev.alias}`,
      lastModified: ev.updated_time ? new Date(ev.updated_time) : ev.created_time ? new Date(ev.created_time) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  // Deduplicate URLs
  const seen = new Set<string>();
  const deduplicated: SitemapUrlEntry[] = [];
  for (const entry of rawEntries) {
    if (!seen.has(entry.url)) {
      seen.add(entry.url);
      deduplicated.push(entry);
    }
  }

  return deduplicated;
}

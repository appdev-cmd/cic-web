import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import { getPostgresClient } from '@/server/db/postgres';
import type { CmsQuickSearchResult, CmsSearchRecord } from '../types';

const text = (value: unknown) => typeof value === 'string' ? value : '';
type DbRow = Record<string, unknown>;
const status = (published: unknown) => published === true
  ? { statusText: 'Đã xuất bản', statusColor: 'emerald' as const }
  : { statusText: 'Bản nháp', statusColor: 'slate' as const };

export async function searchCmsQuickJump(
  query: string,
  locale: 'vi' | 'en' = 'vi',
  allowedModules: string[] | null = null,
  limitPerType: number = 5
): Promise<CmsQuickSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const sql = getPostgresClient();
  const searchPattern = `%${trimmed}%`;
  const canAccess = (module: string) => allowedModules === null || allowedModules.includes(module);

  const productTable = locale === 'en' ? 'cic_products_en' : 'cic_products';
  const newsTable = locale === 'en' ? 'cic_news_en' : 'cic_news';
  const servicesTable = locale === 'en' ? 'cic_services_en' : 'cic_services';
  const projectsTable = locale === 'en' ? 'cic_projects_en' : 'cic_projects';

  const results: CmsQuickSearchResult[] = [];
  const promises: Promise<void>[] = [];

  // 1. Products
  if (canAccess('products')) {
    promises.push(
      sql.unsafe(
        `SELECT id, name, alias, published FROM ${productTable} WHERE (name ILIKE $1 OR alias ILIKE $1) LIMIT $2`,
        [searchPattern, limitPerType]
      ).then((rows) => {
        for (const r of rows) {
          results.push({
            id: `product_${r.id}`,
            title: String(r.name || `#${r.id}`),
            subtitle: r.alias ? `/${r.alias}` : undefined,
            module: 'products',
            moduleLabel: 'Sản phẩm',
            statusText: r.published === true || r.published === 1 ? 'Đã xuất bản' : 'Bản nháp',
            statusColor: r.published === true || r.published === 1 ? 'emerald' : 'slate',
            path: `/cms/products`,
            actionType: 'edit',
          });
        }
      }).catch(() => {})
    );
  }

  // 2. News
  if (canAccess('news')) {
    promises.push(
      sql.unsafe(
        `SELECT id, title, alias, published FROM ${newsTable} WHERE (title ILIKE $1 OR alias ILIKE $1) LIMIT $2`,
        [searchPattern, limitPerType]
      ).then((rows) => {
        for (const r of rows) {
          results.push({
            id: `news_${r.id}`,
            title: String(r.title || `#${r.id}`),
            subtitle: r.alias ? `/${r.alias}` : undefined,
            module: 'news',
            moduleLabel: 'Tin tức & Bài viết',
            statusText: r.published === true || r.published === 1 ? 'Đã xuất bản' : 'Bản nháp',
            statusColor: r.published === true || r.published === 1 ? 'emerald' : 'slate',
            path: `/cms/news`,
            actionType: 'edit',
          });
        }
      }).catch(() => {})
    );
  }

  // 3. Services
  if (canAccess('services')) {
    promises.push(
      sql.unsafe(
        `SELECT id, title, alias, published FROM ${servicesTable} WHERE (title ILIKE $1 OR alias ILIKE $1) LIMIT $2`,
        [searchPattern, limitPerType]
      ).then((rows) => {
        for (const r of rows) {
          results.push({
            id: `service_${r.id}`,
            title: String(r.title || `#${r.id}`),
            subtitle: r.alias ? `/${r.alias}` : undefined,
            module: 'services',
            moduleLabel: 'Dịch vụ',
            statusText: r.published === true || r.published === 1 ? 'Đã xuất bản' : 'Bản nháp',
            statusColor: r.published === true || r.published === 1 ? 'emerald' : 'slate',
            path: `/cms/services`,
            actionType: 'edit',
          });
        }
      }).catch(() => {})
    );
  }

  // 4. Projects
  if (canAccess('projects')) {
    promises.push(
      sql.unsafe(
        `SELECT id, title, alias, customer_name, published FROM ${projectsTable} WHERE (title ILIKE $1 OR alias ILIKE $1 OR customer_name ILIKE $1) LIMIT $2`,
        [searchPattern, limitPerType]
      ).then((rows) => {
        for (const r of rows) {
          results.push({
            id: `project_${r.id}`,
            title: String(r.title || `#${r.id}`),
            subtitle: r.customer_name ? `Khách hàng: ${r.customer_name}` : (r.alias ? `/${r.alias}` : undefined),
            module: 'projects',
            moduleLabel: 'Dự án tiêu biểu',
            statusText: r.published === true || r.published === 1 ? 'Đã xuất bản' : 'Bản nháp',
            statusColor: r.published === true || r.published === 1 ? 'emerald' : 'slate',
            path: `/cms/projects`,
            actionType: 'edit',
          });
        }
      }).catch(() => {})
    );
  }

  // 5. Contacts / Customer Requests
  if (canAccess('customer_requests') || canAccess('contacts')) {
    promises.push(
      sql`
        SELECT id, fullname, email, telephone, subject, published
        FROM cic_contact
        WHERE (fullname ILIKE ${searchPattern} OR email ILIKE ${searchPattern} OR telephone ILIKE ${searchPattern} OR subject ILIKE ${searchPattern})
        ORDER BY id DESC
        LIMIT ${limitPerType}
      `.then((rows) => {
        for (const r of rows) {
          results.push({
            id: `contact_${r.id}`,
            title: String(r.subject || r.fullname || r.email || `#${r.id}`),
            subtitle: `${r.fullname || ''} · ${r.email || ''} · ${r.telephone || ''}`.replace(/^[\s·]+|[\s·]+$/g, ''),
            module: 'customer_requests',
            moduleLabel: 'Yêu cầu khách hàng & Leads',
            statusText: r.published ? 'Đã xử lý' : 'Chưa xử lý',
            statusColor: r.published ? 'emerald' : 'amber',
            path: `/cms/contact-requests`,
            actionType: 'view',
          });
        }
      }).catch(() => {})
    );
  }

  // 6. Content Pages
  if (canAccess('static_pages') || canAccess('pages')) {
    promises.push(
      sql`
        SELECT id, name, slug, workspace, published_revision_id
        FROM cic_content_pages
        WHERE (name ILIKE ${searchPattern} OR slug ILIKE ${searchPattern})
        LIMIT ${limitPerType}
      `.then((rows) => {
        for (const r of rows) {
          results.push({
            id: `page_${r.id}`,
            title: String(r.name || r.slug || `#${r.id}`),
            subtitle: `/${r.slug || ''}`,
            module: 'static_pages',
            moduleLabel: 'Trang nội dung',
            statusText: r.published_revision_id ? 'Đã xuất bản' : 'Bản nháp',
            statusColor: r.published_revision_id ? 'emerald' : 'slate',
            path: `/cms/static-pages`,
            actionType: 'edit',
          });
        }
      }).catch(() => {})
    );
  }

  await Promise.all(promises);
  return results;
}

export async function getCmsSearchRecords(includeUserRecords: boolean, allowedModules: string[] | null): Promise<CmsSearchRecord[]> {
  const db = await getDatabaseClient();
  const results = await Promise.all([
    db.from('cic_products').select('id,code,name,published').limit(150),
    db.from('cic_products_en').select('id,code,name,published').limit(150),
    db.from('cic_news').select('id,title,alias,summary,category_name,tags,author,published').limit(150),
    db.from('cic_news_en').select('id,title,alias,summary,category_name,tags,author,published').limit(150),
    db.from('cic_event').select('id,title,alias,summary,place,time_event,published').limit(100),
    db.from('cic_event_en').select('id,title,alias,summary,place,time_event,published').limit(100),
    db.from('cic_projects').select('id,title,alias,summary,sector,customer_name,location,technologies,published').limit(100),
    db.from('cic_projects_en').select('id,title,alias,summary,sector,customer_name,location,technologies,published').limit(100),
    db.from('cic_services').select('id,title,alias,summary,published').limit(100),
    db.from('cic_services_en').select('id,title,alias,summary,published').limit(100),
    db.from('cic_content_pages').select('id,workspace,code,name,slug,page_type,published_revision_id').limit(100),
    db.from('cic_contact').select('id,email,fullname,telephone,subject,message,published,created_time').order('created_time', { ascending: false }).limit(100),
    db.from('cic_media_assets').select('id,filename,mime_type,workflow_status,created_at').is('deleted_at', null).limit(100),
    db.from('cic_ctas').select('id,workspace,code,admin_name,display_text,description,status').is('deleted_at', null).limit(50),
    db.from('cic_forms').select('id,workspace,code,admin_name,title,description,status').is('deleted_at', null).limit(50),
    db.from('cic_users').select('id,username,full_name,email,phone,account_status,summary').limit(includeUserRecords ? 100 : 0),
  ]);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error('Unable to load CMS global search index.');
  const rows = results.map((result) => result.data ?? []);
  const records: CmsSearchRecord[] = [];
  const addLocalizedContent = (items: DbRow[], locale: 'vi' | 'en', module: CmsSearchRecord['module'], label: string, path: string) => items.forEach((item) => {
    const title = text(item.title) || text(item.code) || `#${item.id}`;
    records.push({ id: `${module}_${locale}_${item.id}`, title, subtitle: text(item.summary) || text(item.alias), module, moduleLabel: label, category: text(item.category_name) || label, ...status(item.published), path, actionType: 'edit', locale, metadata: { code: text(item.code), slug: text(item.alias), author: text(item.author), company: text(item.customer_name), location: text(item.location), tags: Array.isArray(item.technologies) ? item.technologies : [] }, keywords: [title, text(item.summary), text(item.alias), text(item.tags), text(item.sector), text(item.customer_name), text(item.location), text(item.place)] });
  });
  addLocalizedContent(rows[0] as DbRow[], 'vi', 'products', 'Sản phẩm', '/cms/products');
  addLocalizedContent(rows[1] as DbRow[], 'en', 'products', 'Sản phẩm', '/cms/products');
  addLocalizedContent(rows[2] as DbRow[], 'vi', 'news', 'Tin tức & Bài viết', '/cms/news');
  addLocalizedContent(rows[3] as DbRow[], 'en', 'news', 'Tin tức & Bài viết', '/cms/news');
  addLocalizedContent(rows[4] as DbRow[], 'vi', 'events', 'Sự kiện & Hội thảo', '/cms/events');
  addLocalizedContent(rows[5] as DbRow[], 'en', 'events', 'Sự kiện & Hội thảo', '/cms/events');
  addLocalizedContent(rows[6] as DbRow[], 'vi', 'projects', 'Dự án tiêu biểu', '/cms/projects');
  addLocalizedContent(rows[7] as DbRow[], 'en', 'projects', 'Dự án tiêu biểu', '/cms/projects');
  addLocalizedContent(rows[8] as DbRow[], 'vi', 'services', 'Dịch vụ', '/cms/services');
  addLocalizedContent(rows[9] as DbRow[], 'en', 'services', 'Dịch vụ', '/cms/services');
  (rows[10] as DbRow[]).forEach((item) => records.push({ id: `page_${item.id}`, title: text(item.name) || text(item.code), subtitle: `/${text(item.slug)}`, module: 'static_pages', moduleLabel: 'Trang nội dung', category: text(item.page_type), statusText: item.published_revision_id ? 'Đã xuất bản' : 'Bản nháp', statusColor: item.published_revision_id ? 'emerald' : 'slate', path: '/cms/static-pages', actionType: 'edit', locale: item.workspace === 'en' ? 'en' : 'vi', metadata: { code: text(item.code), slug: text(item.slug) }, keywords: [text(item.name), text(item.code), text(item.slug), text(item.page_type)] }));
  (rows[11] as DbRow[]).forEach((item) => records.push({ id: `contact_${item.id}`, title: text(item.subject) || text(item.fullname) || text(item.email), subtitle: `${text(item.fullname)} · ${text(item.email)} · ${text(item.telephone)}`, module: 'customer_requests', moduleLabel: 'Yêu cầu khách hàng & Leads', category: 'Liên hệ website', statusText: item.published ? 'Đã xử lý' : 'Chưa xử lý', statusColor: item.published ? 'emerald' : 'amber', path: '/cms/contact-requests', actionType: 'view', locale: 'vi', metadata: { email: text(item.email), phone: text(item.telephone), date: text(item.created_time) }, keywords: [text(item.fullname), text(item.email), text(item.telephone), text(item.subject), text(item.message)] }));
  (rows[12] as DbRow[]).forEach((item) => records.push({ id: `media_${item.id}`, title: text(item.filename), subtitle: text(item.mime_type), module: 'media', moduleLabel: 'Thư viện Media', category: text(item.mime_type), statusText: text(item.workflow_status), statusColor: item.workflow_status === 'ready' ? 'emerald' : 'slate', path: '/cms/media', actionType: 'navigate', metadata: { date: text(item.created_at) }, keywords: [text(item.filename), text(item.mime_type), text(item.workflow_status)] }));
  for (const [index, kind] of [[13, 'cta'], [14, 'form']] as const) (rows[index] as DbRow[]).forEach((item) => records.push({ id: `${kind}_${item.id}`, title: text(item.admin_name) || text(item.title), subtitle: text(item.description) || text(item.display_text), module: 'forms_cta', moduleLabel: 'Biểu mẫu & CTA', category: kind === 'cta' ? 'CTA Block' : 'Biểu mẫu Web', statusText: item.status === 'active' ? 'Đang hoạt động' : 'Bản nháp', statusColor: item.status === 'active' ? 'emerald' : 'slate', path: kind === 'cta' ? '/cms/cta' : '/cms/forms', actionType: 'navigate', locale: item.workspace === 'en' ? 'en' : 'vi', metadata: { code: text(item.code) }, keywords: [text(item.admin_name), text(item.title), text(item.display_text), text(item.description), text(item.code)] }));
  (rows[15] as DbRow[]).forEach((item) => records.push({ id: `user_${item.id}`, title: text(item.full_name) || text(item.username), subtitle: `${text(item.email)} · ${text(item.phone)}`, module: 'users_permissions', moduleLabel: 'Quản trị viên & Phân quyền', category: 'Tài khoản', statusText: text(item.account_status), statusColor: item.account_status === 'active' ? 'emerald' : 'rose', path: '/cms/users', actionType: 'navigate', metadata: { email: text(item.email), phone: text(item.phone) }, keywords: [text(item.full_name), text(item.username), text(item.email), text(item.phone), text(item.summary)], requiredRole: ['admin', 'superadmin'] }));
  if (allowedModules === null) return records;
  const permissionMap: Record<CmsSearchRecord['module'], string[]> = {
    products: ['products'], news: ['news'], customer_requests: ['customer_requests', 'contacts'], events: ['events'], projects: ['projects'], static_pages: ['static_pages', 'pages'], services: ['services'], forms_cta: ['forms', 'cta'], media: ['media'], users_permissions: ['users', 'permissions'],
  };
  return records.filter((record) => permissionMap[record.module].some((module) => allowedModules.includes(module)));
}

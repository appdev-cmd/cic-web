import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import type { CmsSearchRecord } from '../types';

const text = (value: unknown) => typeof value === 'string' ? value : '';
type DbRow = Record<string, unknown>;
const status = (published: unknown) => published === true
  ? { statusText: 'Đã xuất bản', statusColor: 'emerald' as const }
  : { statusText: 'Bản nháp', statusColor: 'slate' as const };

export async function getCmsSearchRecords(includeUserRecords: boolean, allowedModules: string[] | null): Promise<CmsSearchRecord[]> {
  const db = await getDatabaseClient();
  const results = await Promise.all([
    db.from('cic_products').select('id,code,published'),
    db.from('cic_products_en').select('id,code,published'),
    db.from('cic_news').select('id,title,alias,summary,category_name,tags,author,published'),
    db.from('cic_news_en').select('id,title,alias,summary,category_name,tags,author,published'),
    db.from('cic_event').select('id,title,alias,summary,place,time_event,published'),
    db.from('cic_event_en').select('id,title,alias,summary,place,time_event,published'),
    db.from('cic_projects').select('id,title,alias,summary,sector,customer_name,location,technologies,published'),
    db.from('cic_projects_en').select('id,title,alias,summary,sector,customer_name,location,technologies,published'),
    db.from('cic_services').select('id,title,alias,summary,published'),
    db.from('cic_services_en').select('id,title,alias,summary,published'),
    db.from('cic_content_pages').select('id,workspace,code,name,slug,page_type,published_revision_id'),
    db.from('cic_contact').select('id,email,fullname,telephone,subject,message,published,created_time').order('created_time', { ascending: false }),
    db.from('cic_media_assets').select('id,filename,mime_type,workflow_status,created_at').is('deleted_at', null),
    db.from('cic_ctas').select('id,workspace,code,admin_name,display_text,description,status').is('deleted_at', null),
    db.from('cic_forms').select('id,workspace,code,admin_name,title,description,status').is('deleted_at', null),
    db.from('cic_users').select('id,username,full_name,email,phone,account_status,summary').limit(includeUserRecords ? 1000 : 0),
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

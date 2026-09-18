import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { CmsDashboardData, CmsLocale } from '@/cms/data/CmsDataSource';
import type {
  KpiStats,
  ContactMessage,
  ProductRegistration,
  PendingContent,
  ActivityLog,
  WeeklyContentStat,
  TrafficStat,
} from '@/cms/types';

const dashboardCache = new Map<string, { data: CmsDashboardData; expiresAt: number }>();
const DASHBOARD_CACHE_TTL_MS = 20_000;

export function invalidateCmsDashboardCache(): void {
  dashboardCache.clear();
}

export async function getCmsDashboardData(locale: CmsLocale = 'vi'): Promise<CmsDashboardData> {
  const cached = dashboardCache.get(locale);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const sql = getPostgresClient();
  const isEn = locale === 'en';

  const pTable = isEn ? 'cic_products_en' : 'cic_products';
  const nTable = isEn ? 'cic_news_en' : 'cic_news';
  const eTable = isEn ? 'cic_event_en' : 'cic_event';
  const cTable = isEn ? 'cic_contact_en' : 'cic_contact';

  const [
    kpiRow,
    recentContacts,
    recentRegistrations,
    pendingNews,
    pendingProducts,
    recentLogs,
    weeklyStats,
  ] = await Promise.all([
    // All KPIs combined into a single query to eliminate connection pool starvation
    sql.unsafe<[{
      published_products: number;
      published_news: number;
      static_pages: number;
      upcoming_events: number;
      unprocessed_contacts: number;
      unprocessed_registrations: number;
    }]>(`
      SELECT
        (SELECT count(*)::int FROM ${pTable} WHERE published = true) AS published_products,
        (SELECT count(*)::int FROM ${nTable} WHERE published = true) AS published_news,
        (SELECT count(*)::int FROM cic_content_pages WHERE ${isEn ? "workspace = 'en'" : "workspace = 'vi' OR workspace IS NULL"}) AS static_pages,
        (SELECT count(*)::int FROM ${eTable} WHERE published = true AND time_event >= now()) AS upcoming_events,
        (SELECT count(*)::int FROM ${cTable} WHERE published = false) AS unprocessed_contacts,
        (SELECT count(*)::int FROM cic_product_contact WHERE published = false) AS unprocessed_registrations
    `),

    // Contacts: 10 most recent
    sql.unsafe<Array<{
      id: number;
      fullname: string | null;
      email: string;
      telephone: string | null;
      subject: string | null;
      message: string | null;
      published: boolean;
      created_time: Date;
    }>>(`
      SELECT id, fullname, email, telephone, subject, message, published, created_time 
      FROM ${cTable} 
      ORDER BY created_time DESC 
      LIMIT 10
    `),

    // Product Registrations: 10 most recent
    sql<Array<{
      id: number;
      fullname: string | null;
      telephone: string | null;
      email: string;
      products_id: number | null;
      products_name: string | null;
      company: string | null;
      published: boolean;
      created_time: Date;
    }>>`
      SELECT id, fullname, telephone, email, products_id, products_name, company, published, created_time 
      FROM cic_product_contact 
      ORDER BY created_time DESC 
      LIMIT 10
    `,

    // Pending News: 5 most recent drafts
    sql.unsafe<Array<{
      id: number;
      title: string | null;
      created_time: Date;
    }>>(`
      SELECT id, title, created_time 
      FROM ${nTable} 
      WHERE published = false 
      ORDER BY created_time DESC 
      LIMIT 5
    `),

    // Pending Products: 5 most recent drafts
    sql.unsafe<Array<{
      id: number;
      name: string | null;
      created_time: Date;
    }>>(`
      SELECT id, name, created_time 
      FROM ${pTable} 
      WHERE published = false 
      ORDER BY created_time DESC 
      LIMIT 5
    `),

    // Activity Logs: 10 most recent
    sql<Array<{
      id: string;
      actor_label: string | null;
      action_code: string;
      entity_title: string | null;
      occurred_at: Date;
      user_avatar: string | null;
    }>>`
      SELECT a.id, a.actor_label, a.action_code, a.entity_title, a.occurred_at, u.image as user_avatar
      FROM cic_activity_logs a
      LEFT JOIN cic_users u ON u.id = a.actor_id
      ORDER BY a.occurred_at DESC 
      LIMIT 10
    `,

    // Weekly Content Stats for the last 4 weeks
    sql.unsafe<Array<{
      week_index: number;
      news_count: number;
      product_count: number;
      event_count: number;
    }>>(`
      WITH weeks AS (
        SELECT 
          i AS week_index,
          now() - (i * interval '7 days') AS week_end,
          now() - ((i + 1) * interval '7 days') AS week_start
        FROM generate_series(0, 3) AS i
      )
      SELECT 
        w.week_index,
        (SELECT count(*)::int FROM ${nTable} WHERE created_time >= w.week_start AND created_time < w.week_end) AS news_count,
        (SELECT count(*)::int FROM ${pTable} WHERE created_time >= w.week_start AND created_time < w.week_end) AS product_count,
        (SELECT count(*)::int FROM ${eTable} WHERE created_time >= w.week_start AND created_time < w.week_end) AS event_count
      FROM weeks w
      ORDER BY w.week_index DESC
    `),
  ]);

  const formatDate = (d: Date | string | null | undefined): string => {
    if (!d) return '';
    const date = new Date(d);
    return isNaN(date.getTime()) ? String(d) : date.toISOString().replace('T', ' ').substring(0, 19);
  };

  const kpiData = kpiRow[0];
  const kpi: KpiStats = {
    published_products: kpiData?.published_products ?? 0,
    published_news: kpiData?.published_news ?? 0,
    static_pages: kpiData?.static_pages ?? 0,
    upcoming_events: kpiData?.upcoming_events ?? 0,
    unprocessed_contacts: kpiData?.unprocessed_contacts ?? 0,
    unprocessed_registrations: kpiData?.unprocessed_registrations ?? 0,
  };

  const contacts: ContactMessage[] = recentContacts.map((item) => ({
    id: String(item.id),
    sender_name: item.fullname || item.email || (isEn ? 'Website Visitor' : 'Khách hàng'),
    sender_email: item.email || '',
    sender_phone: item.telephone || '',
    subject: item.subject || (isEn ? 'Website Inquiry' : 'Liên hệ website'),
    content: item.message || '',
    status: item.published ? 'completed' : 'unread',
    created_time: formatDate(item.created_time),
  }));

  const productRegistrations: ProductRegistration[] = recentRegistrations.map((item) => ({
    id: String(item.id),
    customer_name: item.fullname || (isEn ? 'Customer' : 'Khách hàng'),
    customer_phone: item.telephone || '',
    customer_email: item.email || '',
    product_id: item.products_id ? String(item.products_id) : '',
    product_name: item.products_name || (isEn ? 'Product Request' : 'Sản phẩm tư vấn'),
    company_name: item.company || (isEn ? 'Business Client' : 'Khách hàng doanh nghiệp'),
    status: item.published ? 'quoted' : 'pending',
    created_time: formatDate(item.created_time),
  }));

  const pendingContents: PendingContent[] = [
    ...pendingNews.map((n) => ({
      id: String(n.id),
      title: n.title || (isEn ? 'Untitled News' : 'Bài viết chưa có tiêu đề'),
      content_type: 'news' as const,
      author_name: isEn ? 'News Editor' : 'Biên tập viên',
      status: 'draft' as const,
      created_time: formatDate(n.created_time),
    })),
    ...pendingProducts.map((p) => ({
      id: String(p.id),
      title: p.name || (isEn ? 'Untitled Product' : 'Sản phẩm chưa có tên'),
      content_type: 'product' as const,
      author_name: isEn ? 'Product Manager' : 'Quản trị viên',
      status: 'draft' as const,
      created_time: formatDate(p.created_time),
    })),
  ].sort((a, b) => b.created_time.localeCompare(a.created_time)).slice(0, 6);

  const mapActionType = (actionCode?: string | null): ActivityLog['activity_type'] => {
    const code = (actionCode || '').toLowerCase();
    if (code.includes('create')) return 'create';
    if (code.includes('delete') || code.includes('trash') || code.includes('purge')) return 'delete';
    if (code.includes('publish') || code.includes('status')) return 'publish';
    if (code.includes('login') || code.includes('auth')) return 'auth';
    if (code.includes('system') || code.includes('backup')) return 'system';
    return 'update';
  };

  const activityLogs: ActivityLog[] = recentLogs.map((log) => ({
    id: String(log.id),
    username: log.actor_label || (isEn ? 'System' : 'Hệ thống'),
    user_avatar: log.user_avatar ? String(log.user_avatar) : undefined,
    activity_type: mapActionType(log.action_code),
    description: log.entity_title ? `${log.action_code}: ${log.entity_title}` : log.action_code,
    created_time: formatDate(log.occurred_at),
  }));

  const weekLabels = isEn
    ? ['3 Weeks Ago', '2 Weeks Ago', 'Last Week', 'This Week']
    : ['3 tuần trước', '2 tuần trước', 'Tuần trước', 'Tuần này'];

  const weeklyContent: WeeklyContentStat[] = weeklyStats.map((stat, idx) => ({
    week_label: weekLabels[idx] || `W${idx + 1}`,
    news_count: stat.news_count ?? 0,
    product_count: stat.product_count ?? 0,
    event_count: stat.event_count ?? 0,
  }));

  const now = new Date();
  const generateTraffic = (days: number): TrafficStat[] => {
    const result: TrafficStat[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const base = 120 + ((d.getDate() * 17) % 80);
      result.push({
        date_label: `${day}/${month}`,
        visits_count: base,
        page_views_count: Math.round(base * 2.4),
      });
    }
    return result;
  };

  const result: CmsDashboardData = {
    kpi,
    contacts,
    productRegistrations,
    pendingContents,
    activityLogs,
    traffic7Days: generateTraffic(7),
    traffic30Days: generateTraffic(30),
    weeklyContent,
  };

  dashboardCache.set(locale, {
    data: result,
    expiresAt: Date.now() + DASHBOARD_CACHE_TTL_MS,
  });

  return result;
}

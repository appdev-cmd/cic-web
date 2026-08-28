import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import type { CmsDashboardData } from '@/cms/data/CmsDataSource';

export async function getCmsDashboardData(): Promise<CmsDashboardData> {
  const client = await getDatabaseClient();
  const count = async (table: string, filters: Array<[string, unknown]> = []) => {
    let query = client.from(table).select('*', { count: 'exact', head: true });
    for (const [column, value] of filters) query = query.eq(column, value);
    const { count: total, error } = await query;
    if (error) throw new Error(`Unable to load dashboard metric: ${table}.`);
    return total ?? 0;
  };
  const now = new Date().toISOString();
  const [products, news, pages, events, contactsCount, contactsResult] = await Promise.all([
    count('cic_products', [['published', true]]), count('cic_news', [['published', true]]), count('cic_content_pages'),
    client.from('cic_event').select('*', { count: 'exact', head: true }).eq('published', true).gte('time_event', now),
    count('cic_contact', [['published', false]]),
    client.from('cic_contact').select('id,email,fullname,telephone,subject,message,published,created_time').order('created_time', { ascending: false }).limit(10),
  ]);
  if (events.error || contactsResult.error) throw new Error('Unable to load CMS dashboard.');
  return {
    kpi: { published_products: products, published_news: news, static_pages: pages, upcoming_events: events.count ?? 0, unprocessed_contacts: contactsCount, unprocessed_registrations: 0 },
    contacts: (contactsResult.data ?? []).map((item) => ({ id: String(item.id), sender_name: item.fullname ?? item.email, sender_email: item.email, sender_phone: item.telephone ?? '', subject: item.subject ?? 'Liên hệ website', content: item.message ?? '', status: item.published ? 'completed' : 'unread', created_time: String(item.created_time) })),
    productRegistrations: [], pendingContents: [], activityLogs: [], traffic7Days: [], traffic30Days: [], weeklyContent: [],
  };
}

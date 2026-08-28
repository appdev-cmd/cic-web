import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getPublishedAboutContent() { const c = await getDatabaseClient(); const { data, error } = await c.from('cic_config').select('name,value,title').eq('published', true).order('ordering'); if (error) throw new Error('Unable to load about content.'); return (data ?? []).filter((row) => String(row.name).startsWith('about_')).map((row) => ({ key: row.name, title: row.title ?? row.name, value: row.value ?? '' })); }

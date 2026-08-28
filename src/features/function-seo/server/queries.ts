import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import type { FunctionSeoRecord } from '@/cms/modules/function_seo/types';
type SeoRow = Record<string, unknown>;

export async function getFunctionSeoData(locale: 'vi' | 'en'): Promise<FunctionSeoRecord[]> {
  const db = await getDatabaseClient();
  const table = locale === 'en' ? 'cic_config_modules_en' : 'cic_config_modules';
  const { data, error } = await db.from(table).select('id,module,view,task,title,value_seo_title,value_seo_keyword,value_seo_description,seo_indexable,updated_at').order('ordering', { ascending: true });
  if (error) throw new Error('Unable to load SEO modules.');
  return (data as SeoRow[] ?? []).map((r) => ({ id: String(r.id), routeKey: `${r.module ?? 'module'}_${r.view ?? 'index'}`, path: '/', module: String(r.module ?? ''), view: String(r.view ?? ''), label: String(r.title ?? r.module ?? ''), intent: '', title: String(r.value_seo_title ?? ''), keywords: String(r.value_seo_keyword ?? ''), description: String(r.value_seo_description ?? ''), canonicalPath: '/', indexable: r.seo_indexable !== false, updatedAt: String(r.updated_at ?? new Date().toISOString()), detailPath: '', detailPattern: '', detailOwner: '', detailStatus: 'missing' as const }));
}

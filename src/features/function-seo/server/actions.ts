'use server';
import { revalidatePath } from 'next/cache';
import { getDatabaseClient } from '@/server/db/foundation';
import { requirePermission } from '@/server/auth/guards';
import { functionSeoInputSchema, type FunctionSeoInput } from '../schemas/functionSeoInput';
export async function updateFunctionSeo(input: FunctionSeoInput) {
  await requirePermission('function_seo', 'edit');
  const value = functionSeoInputSchema.parse(input); const db = await getDatabaseClient();
  const table = value.locale === 'en' ? 'cic_config_modules_en' : 'cic_config_modules';
  const { error } = await db.from(table).update({ value_seo_title: value.title, value_seo_keyword: value.keywords, value_seo_description: value.description, seo_indexable: value.indexable }).eq('id', value.id);
  if (error) throw new Error('Unable to save SEO configuration.'); revalidatePath('/cms'); return { ok: true };
}

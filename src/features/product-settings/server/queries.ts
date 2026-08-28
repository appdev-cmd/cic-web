import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
export async function getProductSettingsData() {
  const db = await getDatabaseClient();
  const [categories, brands, applications, types] = await Promise.all([
    db.from('cic_products_categories').select('*').order('ordering', { ascending: true }),
    db.from('cic_manufactories').select('*').order('ordering', { ascending: true }),
    db.from('cic_application').select('*').order('ordering', { ascending: true }),
    db.from('cic_products_types').select('*').order('ordering', { ascending: true }),
  ]);
  if (categories.error || brands.error || applications.error || types.error) throw new Error('Unable to load product settings.');
  return { categories: categories.data ?? [], brands: brands.data ?? [], applications: applications.data ?? [], product_types: types.data ?? [] };
}

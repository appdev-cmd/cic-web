import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import { APPROVED_SETTINGS_MANIFEST } from '../domain/settingsManifest';
import type { CmsBranch, CmsSettingsData, PublicSystemSettings } from '../domain/model';

const SCOPE_DEFS = [
  { id: 'site_cic', locale: 'vi', name: 'CIC Tiếng Việt', domain: 'cic.com.vn' },
  { id: 'site_english', locale: 'en', name: 'CIC English', domain: 'cic.com.vn/en' },
  { id: 'site_enjicad', locale: 'enjicad', name: 'Enjicad', domain: 'enjicad.vn' },
] as const;
const labels: Record<string, string> = { site_name: 'Tên website', domain: 'Tên miền', admin_name: 'Người phụ trách', admin_email: 'Email liên hệ', tel: 'Hotline chính', tel2: 'Hotline phụ', logo: 'Logo', logo_white: 'Logo nền tối', facebook: 'Facebook', twitter: 'Twitter / X', youtube: 'YouTube', teamview: 'Hỗ trợ từ xa', google_analytics: 'Google Analytics ID' };
const descriptions: Record<string, string> = { admin_name: 'Thông tin vận hành nội bộ, không công khai.', google_analytics: 'Chỉ lưu mã đo lường công khai; credential và secret phải đặt trong ENV.' };
const mapBranch = (row: Record<string, unknown>): CmsBranch => ({ id: String(row.id), code: String(row.code ?? ''), name: String(row.name ?? ''), address: String(row.address ?? ''), phone: String(row.phone ?? ''), email: String(row.email ?? ''), fax: String(row.fax ?? ''), workingHours: String(row.working_hours ?? ''), mapEmbedUrl: String(row.map_embed_url ?? ''), mapSearchQuery: String(row.map_search_query ?? ''), isHeadOffice: Boolean(row.is_head_office), published: Boolean(row.published), ordering: Number(row.ordering ?? 0) });

export async function getCmsSystemSettingsData(): Promise<CmsSettingsData> {
  const sql = getPostgresClient(); const keys = APPROVED_SETTINGS_MANIFEST.map((item) => item.key);
  const [vi, en, enjicad, branches] = await Promise.all([
    sql`SELECT name,value,title FROM cic_config WHERE lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT name,value,title FROM cic_config_en WHERE lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT name,value,title FROM cic_config_enjicad WHERE lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT id,workspace,code,name,address,phone,email,fax,working_hours,map_embed_url,map_search_query,is_head_office,published,ordering FROM cic_branches ORDER BY workspace,ordering,id`,
  ]);
  const rowsByScope = { vi, en, enjicad } as const;
  return { workspaces: SCOPE_DEFS.map((scope) => { const values = new Map(rowsByScope[scope.locale].map((row) => [String(row.name).trim().toLowerCase(), row])); return { scope, settings: APPROVED_SETTINGS_MANIFEST.filter((item) => item.scopes.includes(scope.locale)).map((item) => ({ key: item.key, label: labels[item.key] ?? item.key, description: descriptions[item.key] ?? `Cấu hình ${labels[item.key] ?? item.key}.`, group: item.group, type: item.type, value: String(values.get(item.key)?.value ?? ''), publicReadable: item.publicReadable, maxLength: item.validation.maxLength })), branches: scope.locale === 'enjicad' ? [] : branches.filter((row) => row.workspace === scope.locale).map(mapBranch) }; }) };
}

export async function getPublicSystemSettings(locale: 'vi' | 'en' = 'vi'): Promise<PublicSystemSettings> {
  const sql = getPostgresClient(); const table = locale === 'en' ? 'cic_config_en' : 'cic_config';
  const keys = APPROVED_SETTINGS_MANIFEST.filter((item) => item.publicReadable && item.scopes.includes(locale)).map((item) => item.key);
  const [values, branches] = await Promise.all([
    sql`SELECT name,value FROM ${sql(table)} WHERE published IS TRUE AND lower(btrim(name)) IN ${sql(keys)} ORDER BY ordering NULLS LAST,id`,
    sql`SELECT id,workspace,code,name,address,phone,email,fax,working_hours,map_embed_url,map_search_query,is_head_office,published,ordering FROM cic_branches WHERE workspace=${locale} AND published IS TRUE ORDER BY ordering,id`,
  ]);
  return { values: Object.fromEntries(values.map((row) => [String(row.name).trim().toLowerCase(), String(row.value ?? '')])), branches: branches.map(mapBranch) };
}

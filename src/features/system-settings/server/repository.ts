import 'server-only';
import type { Sql } from 'postgres';
import { APPROVED_SETTINGS_BY_KEY } from '../domain/settingsManifest';
import type { SaveSettingsInput } from '../schemas/settingsInput';

const tableFor = (scope: string) => scope === 'site_cic' ? 'cic_config' : scope === 'site_english' ? 'cic_config_en' : 'cic_config_enjicad';
const localeFor = (scope: string) => scope === 'site_cic' ? 'vi' : scope === 'site_english' ? 'en' : 'enjicad';
export async function saveSystemSettings(input: SaveSettingsInput, actorId: number, sql: Sql) {
  for (const change of input.changes) {
    const definition = APPROVED_SETTINGS_BY_KEY.get(change.key);
    if (!definition || !definition.scopes.includes(localeFor(change.scopeId))) throw new Error('Cấu hình không thuộc danh sách được phép.');
    const result = await sql`UPDATE ${sql(tableFor(change.scopeId))} SET value=${change.value} WHERE lower(btrim(name))=${change.key}`;
    if (result.count !== 1) throw new Error(`Không tìm thấy cấu hình ${change.key}.`);
  }
  if (!input.branches) return;
  const { workspace, items } = input.branches; const ids = items.map((item) => Number(item.id)).filter((id) => Number.isSafeInteger(id) && id > 0);
  if (ids.length) await sql`DELETE FROM cic_branches WHERE workspace=${workspace} AND id NOT IN ${sql(ids)}`; else await sql`DELETE FROM cic_branches WHERE workspace=${workspace}`;
  for (const branch of items) {
    const id = Number(branch.id); const row = { workspace, code: branch.code, name: branch.name, address: branch.address, phone: branch.phone || null, email: branch.email || null, fax: branch.fax || null, working_hours: branch.workingHours || null, map_embed_url: branch.mapEmbedUrl || null, map_search_query: branch.mapSearchQuery || null, is_head_office: branch.isHeadOffice, published: branch.published, ordering: branch.ordering, updated_by: actorId, updated_at: new Date() };
    if (Number.isSafeInteger(id) && id > 0) { const result = await sql`UPDATE cic_branches SET ${sql(row)} WHERE id=${id} AND workspace=${workspace}`; if (result.count !== 1) throw new Error('Chi nhánh không còn tồn tại.'); }
    else await sql`INSERT INTO cic_branches ${sql({ ...row, created_by: actorId })}`;
  }
}

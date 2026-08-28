import 'server-only';
import { withTransaction } from '@/server/db/postgres';
import type { SaveSettingsInput } from '../schemas/settingsInput';

const tableFor = (scope: string) => scope === 'site_cic' ? 'cic_config' : scope === 'site_english' ? 'cic_config_en' : 'cic_config_enjicad';
const serialize = (value: string | number | boolean | null) => value === null ? null : typeof value === 'string' ? value : String(value);
export async function saveSystemSettings(input: SaveSettingsInput, actorId: number) {
  return withTransaction(async (sql) => {
    for (const change of input.changes) {
      const [scope, rawId] = change.settingId.split(':'); const id = Number(rawId);
      if (scope !== change.scopeId || !Number.isSafeInteger(id) || id <= 0) throw new Error('Khóa cấu hình không hợp lệ.');
      const table = tableFor(change.scopeId); const result = await sql`UPDATE ${sql(table)} SET value=${serialize(change.value)} WHERE id=${id}`;
      if (result.count !== 1) throw new Error('Một cấu hình không còn tồn tại.');
    }
    if (input.branches) {
      const workspace = input.branches.workspace; const ids = input.branches.items.map((item) => Number(item.id)).filter((id) => Number.isSafeInteger(id) && id > 0);
      if (ids.length) await sql`DELETE FROM cic_branches WHERE workspace=${workspace} AND id NOT IN ${sql(ids)}`; else await sql`DELETE FROM cic_branches WHERE workspace=${workspace}`;
      for (const branch of input.branches.items) {
        const id = Number(branch.id); const row = { workspace, code: branch.code, name: branch.name, address: branch.address, phone: branch.phone || null, email: branch.email || null, fax: branch.fax || null, working_hours: branch.workingHours || null, map_embed_url: branch.mapEmbedUrl || null, map_search_query: branch.mapSearchQuery || null, is_head_office: branch.isHeadOffice, published: branch.published, ordering: branch.ordering, updated_by: actorId, updated_at: new Date() };
        if (Number.isSafeInteger(id) && id > 0) await sql`UPDATE cic_branches SET ${sql(row)} WHERE id=${id} AND workspace=${workspace}`;
        else await sql`INSERT INTO cic_branches ${sql({ ...row, created_by: actorId })}`;
      }
    }
  });
}

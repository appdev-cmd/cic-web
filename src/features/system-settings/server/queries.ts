import 'server-only';
import { getDatabaseClient } from '@/server/db/foundation';
import type { SystemConfigurationData } from '@/cms/data/ConfigurationDataSource';
import type { ConfigItem, ConfigScopeId, ConfigValueType } from '@/cms/modules/system_configuration/types';

const empty = (): SystemConfigurationData => ({ scopes: [], groups: [], items: [], values: {}, issues: [], drafts: [], versions: [], activityLogs: [] });
const typeOf = (value: string | null): ConfigValueType => { const type = (value ?? '').toLowerCase(); if (type.includes('bool')) return 'boolean'; if (type.includes('int') || type.includes('number')) return 'number'; if (type.includes('text') || type.includes('textarea')) return 'textarea'; if (type.includes('image')) return 'image'; if (type.includes('file')) return 'file'; if (type.includes('secret') || type.includes('password') || type.includes('key')) return 'secret'; return 'text'; };
const parseValue = (value: string | null, type: ConfigValueType) => type === 'boolean' ? ['1','true','yes','on'].includes((value ?? '').toLowerCase()) : type === 'number' ? Number(value ?? 0) : value ?? '';

export async function getCmsSystemSettingsData(): Promise<SystemConfigurationData> {
  const db = await getDatabaseClient();
  const [vi, en, enjicad, branches] = await Promise.all([
    db.from('cic_config').select('id,name,value,data_type,is_common,published,is_ga,ordering,title').order('ordering'),
    db.from('cic_config_en').select('id,name,value,data_type,is_common,published,is_ga,ordering,title').order('ordering'),
    db.from('cic_config_enjicad').select('id,name,value,data_type,is_common,published,is_ga,ordering,title').order('ordering'),
    db.from('cic_branches').select('id,workspace,code,name,address,phone,email,fax,working_hours,map_embed_url,map_search_query,is_head_office,published,ordering,updated_at').order('workspace').order('ordering'),
  ]);
  if (vi.error || en.error || enjicad.error || branches.error) throw new Error('Không thể tải cấu hình hệ thống.');
  const data = empty();
  const scopeDefs: Array<{ id: ConfigScopeId; name: string; domain: string; rows: typeof vi.data }> = [{ id: 'site_cic', name: 'CIC Tiếng Việt', domain: 'cic.com.vn', rows: vi.data }, { id: 'site_english', name: 'CIC English', domain: 'cic.com.vn/en', rows: en.data }, { id: 'site_enjicad', name: 'Enjicad', domain: 'enjicad.vn', rows: enjicad.data }];
  data.scopes = scopeDefs.map((scope, index) => ({ id: scope.id, name: scope.name, domain: scope.domain, description: 'Cấu hình PostgreSQL theo workspace', badgeColor: index ? 'blue' : 'orange', isDefault: true, liveVersion: 'live', lastPublished: '', issueCount: 0, overrideCount: scope.rows?.length ?? 0 }));
  data.groups = [{ id: 'general', title: 'Cấu hình chung', description: 'Các giá trị cấu hình đã có trong PostgreSQL.', iconName: 'Settings' }, { id: 'company', title: 'Doanh nghiệp & liên hệ', description: 'Trụ sở và chi nhánh theo workspace.', iconName: 'Building' }];
  const itemMap = new Map<string, ConfigItem>();
  for (const scope of scopeDefs) {
    const scopeValues: Record<string, never> = {};
    data.values[scope.id] = scopeValues;
    for (const row of scope.rows ?? []) {
      const id = `${scope.id}:${row.id}`; const valueType = typeOf(row.data_type); const secret = valueType === 'secret';
      itemMap.set(id, { id, path: `${scope.id}.${row.name}`, label: row.title || row.name, groupId: 'general', description: `Khóa cấu hình: ${row.name}`, type: valueType, sensitivity: 'standard', isShared: Boolean(row.is_common) });
      (data.values[scope.id] as Record<string, unknown>)[id] = { settingId: id, scopeId: scope.id, liveValue: secret ? '' : parseValue(row.value, valueType), inheritanceState: 'default', effectiveValue: secret ? '' : parseValue(row.value, valueType), lastUpdatedBy: 'PostgreSQL', lastUpdatedAt: '', isMaskedSecret: secret };
    }
    const workspace = scope.id === 'site_english' ? 'en' : 'vi'; const branchRows = (branches.data ?? []).filter((branch) => branch.workspace === workspace);
    if (scope.id !== 'site_enjicad') (data.values[scope.id] as Record<string, unknown>).comp_branches = { settingId: 'comp_branches', scopeId: scope.id, liveValue: branchRows.map((branch) => ({ id: String(branch.id), code: branch.code, name: branch.name, address: branch.address, phone: branch.phone ?? '', email: branch.email ?? '', fax: branch.fax ?? '', workingHours: branch.working_hours ?? '', mapEmbedUrl: branch.map_embed_url ?? '', mapSearchQuery: branch.map_search_query ?? '', isHeadOffice: branch.is_head_office, published: branch.published, ordering: branch.ordering })), inheritanceState: 'default', effectiveValue: branchRows, lastUpdatedBy: 'PostgreSQL', lastUpdatedAt: '' };
  }
  data.items = [...itemMap.values(), { id: 'comp_branches', path: 'system.company.branches', label: 'Trụ sở & chi nhánh', groupId: 'company', description: 'Nguồn dùng chung cho Trang Liên hệ và Footer.', type: 'list', sensitivity: 'standard', isShared: false }];
  return data;
}

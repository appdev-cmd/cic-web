import type { ConfigurationDataSource, SystemConfigurationData } from './ConfigurationDataSource';
import {
  configGroupsMock,
  configItemsMock,
  configScopesMock,
  initialActivityLogsMock,
  initialConfigValuesMock,
  initialDraftsMock,
  initialIssuesMock,
  initialVersionsMock,
} from '../modules/system_configuration/mockData';

const supportedGroupIds = new Set(['general', 'seo', 'company', 'footer_social', 'measurement', 'error_page']);
const excludedItemIds = new Set([
  'gen_brand_color',
  'gen_default_lang',
  'measure_tiktok_pixel',
  'measure_linkedin',
  'measure_clarity',
]);

function selectScopes(scopeIds: string[]): SystemConfigurationData {
  const selected = new Set(scopeIds);
  const visibleItems = configItemsMock.filter(
    (item) => supportedGroupIds.has(item.groupId) && !excludedItemIds.has(item.id),
  );
  const visibleItemIds = new Set(visibleItems.map((item) => item.id));
  const excludedPaths = new Set(
    configItemsMock.filter((item) => !visibleItemIds.has(item.id)).map((item) => item.path),
  );
  const drafts = initialDraftsMock
    .filter((item) => selected.has(item.scopeId))
    .map((draft) => {
      const changesSummary = draft.changesSummary.filter((change) => visibleItemIds.has(change.settingId));
      return { ...draft, changesSummary, changedCount: changesSummary.length };
    })
    .filter((draft) => draft.changedCount > 0);
  const versions = initialVersionsMock
    .filter((item) => selected.has(item.scopeId))
    .map((version) => {
      const changes = version.changes.filter((change) => visibleItemIds.has(change.settingId));
      return { ...version, changes, changesCount: changes.length };
    })
    .filter((version) => version.changesCount > 0);

  return {
    scopes: configScopesMock.filter((scope) => selected.has(scope.id)),
    groups: configGroupsMock.filter((group) => supportedGroupIds.has(group.id)),
    items: visibleItems,
    values: Object.fromEntries(Object.entries(initialConfigValuesMock).filter(([scopeId]) => selected.has(scopeId))),
    issues: initialIssuesMock.filter((item) => selected.has(item.scopeId) && visibleItemIds.has(item.settingId)),
    drafts,
    versions,
    activityLogs: initialActivityLogsMock.filter(
      (item) => selected.has(item.scopeId) && (!item.settingPath || !excludedPaths.has(item.settingPath)),
    ),
  };
}

export const demoConfigurationDataSource: ConfigurationDataSource = {
  websiteConfigByLocale: {
    vi: selectScopes(['global', 'site_cic']),
    en: selectScopes(['site_english']),
  },
  globalConfig: selectScopes(['site_enjicad']),
};

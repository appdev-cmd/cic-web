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

function selectScopes(scopeIds: string[]): SystemConfigurationData {
  const selected = new Set(scopeIds);
  return {
    scopes: configScopesMock.filter((scope) => selected.has(scope.id)),
    groups: configGroupsMock,
    items: configItemsMock,
    values: Object.fromEntries(Object.entries(initialConfigValuesMock).filter(([scopeId]) => selected.has(scopeId))),
    issues: initialIssuesMock.filter((item) => selected.has(item.scopeId)),
    drafts: initialDraftsMock.filter((item) => selected.has(item.scopeId)),
    versions: initialVersionsMock.filter((item) => selected.has(item.scopeId)),
    activityLogs: initialActivityLogsMock.filter((item) => selected.has(item.scopeId)),
  };
}

export const demoConfigurationDataSource: ConfigurationDataSource = {
  websiteConfigByLocale: {
    vi: selectScopes(['global', 'site_cic']),
    en: selectScopes(['site_english']),
  },
  globalConfig: selectScopes(['site_enjicad']),
};

import type { ConfigurationDataSource, SystemConfigurationData } from './ConfigurationDataSource';

const emptyConfigurationData: SystemConfigurationData = {
  scopes: [],
  groups: [],
  items: [],
  values: {},
  issues: [],
  drafts: [],
  versions: [],
  activityLogs: [],
};

export const demoConfigurationDataSource: ConfigurationDataSource = {
  websiteConfigByLocale: {
    vi: emptyConfigurationData,
    en: emptyConfigurationData,
  },
  globalConfig: emptyConfigurationData,
};

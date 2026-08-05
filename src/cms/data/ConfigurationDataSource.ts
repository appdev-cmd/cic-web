import type { CmsLocale } from './CmsDataSource';
import type {
  ConfigActivityLog,
  ConfigDraft,
  ConfigGroupDef,
  ConfigItem,
  ConfigScope,
  ConfigValueRecord,
  ConfigVersionHistory,
  ValidationIssue,
} from '../modules/system_configuration/types';

export interface SystemConfigurationData {
  scopes: ConfigScope[];
  groups: ConfigGroupDef[];
  items: ConfigItem[];
  values: Record<string, Record<string, ConfigValueRecord>>;
  issues: ValidationIssue[];
  drafts: ConfigDraft[];
  versions: ConfigVersionHistory[];
  activityLogs: ConfigActivityLog[];
}

export interface ConfigurationDataSource {
  websiteConfigByLocale: Partial<Record<CmsLocale, SystemConfigurationData>>;
  globalConfig: SystemConfigurationData;
}

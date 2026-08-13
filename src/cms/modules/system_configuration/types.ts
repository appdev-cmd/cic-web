export type ConfigScopeId = 'global' | 'site_cic' | 'site_enjicad' | 'site_english';

export interface ConfigScope {
  id: ConfigScopeId;
  name: string;
  domain: string;
  description: string;
  parentScopeId?: ConfigScopeId; // for inheritance
  badgeColor: string;
  isDefault?: boolean;
  liveVersion: string;
  draftVersion?: string;
  lastPublished: string;
  issueCount: number;
  overrideCount: number;
}

export type ConfigGroupId =
  | 'general'
  | 'seo'
  | 'company'
  | 'footer_social'
  | 'measurement'
  | 'error_page'
  | 'media_assets'
  | 'integrations'
  | 'email_notif'
  | 'advanced';

export interface ConfigGroupDef {
  id: ConfigGroupId;
  title: string;
  description: string;
  iconName: string;
}

export type SensitivityLevel = 'standard' | 'sensitive' | 'secret';
export type InheritanceState = 'inherited' | 'overridden' | 'default';
export type ConfigValueType = 'text' | 'textarea' | 'boolean' | 'number' | 'select' | 'image' | 'file' | 'secret' | 'json' | 'list';

export interface ConfigItem {
  id: string; // e.g. 'general.site_name'
  path: string; // e.g. 'system.general.site_name'
  label: string;
  groupId: ConfigGroupId;
  description: string;
  type: ConfigValueType;
  options?: { label: string; value: string }[]; // for select type
  sensitivity: SensitivityLevel;
  isShared: boolean; // if true, easily inherited
  isDeprecated?: boolean;
  deprecatedNote?: string;
  impactDescription?: string;
  affectedServices?: string[];
  placeholder?: string;
  validationRegex?: string;
  unit?: string;
  usedBy?: string[];
  futureNote?: string;
}

export interface ConfigValueRecord {
  settingId: string;
  scopeId: ConfigScopeId;
  liveValue?: any;
  draftValue?: any;
  inheritanceState: InheritanceState;
  inheritedFromScopeId?: ConfigScopeId;
  effectiveValue: any;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  isMaskedSecret?: boolean;
  isTestedOk?: boolean;
  testLastRun?: string;
}

export interface ValidationIssue {
  id: string;
  scopeId: ConfigScopeId;
  settingId: string;
  settingLabel: string;
  groupId: ConfigGroupId;
  severity: 'critical' | 'warning' | 'info';
  code: string;
  message: string;
  recommendation: string;
  createdAt: string;
}

export interface ConfigDraft {
  id: string;
  scopeId: ConfigScopeId;
  scopeName: string;
  versionNumber: string;
  status: 'draft';
  changedCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  changesSummary: {
    settingId: string;
    label: string;
    changeType: 'created_override' | 'modified_value' | 'reset_inherited' | 'secret_rotated';
    oldValue: any;
    newValue: any;
  }[];
}

export interface ConfigVersionHistory {
  id: string;
  scopeId: ConfigScopeId;
  versionNumber: string;
  publishedAt: string;
  publishedBy: string;
  releaseNotes: string;
  changesCount: number;
  status: 'active_live' | 'archived_version';
  changes: {
    settingId: string;
    settingLabel: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface ConfigActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  scopeId: ConfigScopeId;
  scopeName: string;
  action: 'save_draft' | 'publish_version' | 'override_field' | 'reset_inherited' | 'secret_rotated' | 'restore_version';
  settingPath?: string;
  details: string;
  ipAddress: string;
}

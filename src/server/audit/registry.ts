export const AUDIT_ACTIONS = {
  SETTINGS_UPDATED: 'settings.updated',
  EXPORT_CREATED: 'audit.export_created',
  EXPORT_DOWNLOADED: 'audit.export_downloaded',
} as const;

export const AUDIT_ENTITY_TYPES = {
  SYSTEM_SETTINGS: 'system_settings',
  AUDIT_EXPORT: 'audit_export',
} as const;

export const AUDIT_WORKSPACES = ['global', 'vi', 'en'] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[keyof typeof AUDIT_ENTITY_TYPES];
export type AuditWorkspace = (typeof AUDIT_WORKSPACES)[number];

export const auditActionRegistry = {
  [AUDIT_ACTIONS.SETTINGS_UPDATED]: { category: 'config_publish', severity: 'high', entityType: AUDIT_ENTITY_TYPES.SYSTEM_SETTINGS },
  [AUDIT_ACTIONS.EXPORT_CREATED]: { category: 'export_jobs', severity: 'medium', entityType: AUDIT_ENTITY_TYPES.AUDIT_EXPORT },
  [AUDIT_ACTIONS.EXPORT_DOWNLOADED]: { category: 'export_jobs', severity: 'medium', entityType: AUDIT_ENTITY_TYPES.AUDIT_EXPORT },
} as const;

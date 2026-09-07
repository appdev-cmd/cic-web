export type {
  AuditCategory,
  AuditEvent,
  AuditListPage,
  AuditListQuery,
  AuditResult,
  AuditSeverity,
  ExportJob,
  SensitivityLevel,
} from '@/features/activity-logs/types';

export type TrashCategory = 'all' | 'expiring_soon';
export type DependencyStatus = 'clear' | 'conflict' | 'parent_trashed' | 'schema_mismatch';

export interface TrashedItem {
  id: string;
  title: string;
  itemType: string;
  moduleName: string;
  scope: { siteId: string; siteName: string };
  deletedBy: { id: string; name: string; role: string };
  deletedAt: string;
  expiresAt: string;
  daysRemaining: number;
  isLegalHold: boolean;
  legalHoldReason?: string;
  dependencyStatus: DependencyStatus;
  dependencyDetails?: string;
  snapshotData: Record<string, unknown>;
  originalUrl?: string;
  targetRestoreState: 'draft' | 'inactive';
}

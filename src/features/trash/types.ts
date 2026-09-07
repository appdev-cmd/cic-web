export const TRASH_WORKSPACES = ['global', 'vi', 'en'] as const;
export type TrashWorkspace = (typeof TRASH_WORKSPACES)[number];

export const TRASH_RESTORE_MODES = ['as_draft', 'auto_rename', 'restore_parent_first'] as const;
export type TrashRestoreMode = (typeof TRASH_RESTORE_MODES)[number];
export type TrashCategory = 'all' | 'expiring_soon';
export type TrashDependencyStatus = 'clear' | 'conflict' | 'parent_trashed' | 'schema_mismatch';

export type TrashModuleOption = Readonly<{ value: string; label: string }>;

export interface TrashItemViewModel {
  id: string;
  title: string;
  entityType: string;
  entityId: string;
  itemType: string;
  moduleKey: string;
  moduleName: string;
  scope: { siteId: TrashWorkspace; siteName: string };
  deletedBy: { id: string; name: string; role: string };
  deletedAt: string;
  expiresAt: string;
  daysRemaining: number;
  isLegalHold: boolean;
  legalHoldReason?: string;
  dependencyStatus: TrashDependencyStatus;
  dependencyDetails?: string;
  snapshotData: Record<string, unknown>;
  originalUrl?: string;
  targetRestoreState: 'draft' | 'inactive';
  restoreModes: TrashRestoreMode[];
  supportsPurge: boolean;
  purgeBlockedReason?: string;
}

export interface TrashListQuery {
  page: number;
  pageSize: number;
  search: string;
  module: string;
  category: TrashCategory;
}

export interface TrashListPage {
  items: TrashItemViewModel[];
  total: number;
  expiringSoonTotal: number;
  moduleOptions: TrashModuleOption[];
  query: TrashListQuery;
}

export type TrashMutationItemResult = Readonly<{
  id: string;
  ok: boolean;
  message: string;
}>;

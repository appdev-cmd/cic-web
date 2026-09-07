import type { Sql } from 'postgres';
import type { TrashDependencyStatus, TrashRestoreMode, TrashWorkspace } from '../types';

export type TrashRevalidationOperation = 'restore' | 'purge';

export type TrashRevalidationTarget = Readonly<{
  path: string;
  type?: 'page' | 'layout';
}>;

export type TrashInspection = Readonly<{
  status: TrashDependencyStatus;
  details: string;
  restoreModes: TrashRestoreMode[];
}>;

export type TrashRestoreResult = Readonly<{
  title: string;
  restoredEntityId: string;
  restoredState: 'draft' | 'inactive';
  originalAlias?: string;
  restoredAlias?: string;
}>;

export interface TrashEntityAdapter {
  readonly entityType: string;
  readonly module: string;
  readonly label: string;
  readonly itemType: string;
  readonly workspace: TrashWorkspace;
  readonly restoreState: 'draft' | 'inactive';
  readonly supportsPurge: boolean;
  readonly purgeBlockedReason?: string;
  getRevalidationTargets(operation: TrashRevalidationOperation): readonly TrashRevalidationTarget[];
  parseSnapshot(value: unknown): unknown;
  inspect(sql: Sql, snapshot: unknown): Promise<TrashInspection>;
  restore(sql: Sql, snapshot: unknown, mode: TrashRestoreMode): Promise<TrashRestoreResult>;
  purge(sql: Sql, snapshot: unknown): Promise<void>;
  presentSnapshot(snapshot: unknown): Record<string, unknown>;
}

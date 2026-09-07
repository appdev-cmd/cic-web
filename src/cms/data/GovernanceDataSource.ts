import type { AgencyOption, CicUser, RoleOption } from '../modules/cic_users/types';
import type {
  AccessReview,
  CmsRole,
  CmsUserPermissionTarget,
  PermissionField,
  PermissionFunction,
  PermissionTask,
  PolicyIssue,
  RoleAssignment,
  UserPermissionState,
} from '../modules/permission_management/types';
import type { AuditGovernanceData } from '@/features/activity-logs/types';
import type { TrashedItem } from '../modules/activity_logs_trash/types';
import type { TrashListPage } from '@/features/trash/types';

export interface UsersGovernanceData {
  users: CicUser[];
  agencies: AgencyOption[];
  roles: RoleOption[];
  permissionTasks: PermissionTask[];
  rolePermissions: Record<string, Array<{ taskId: string; action: string }>>;
}

export interface PermissionsGovernanceData {
  users: CmsUserPermissionTarget[];
  tasks: PermissionTask[];
  functions: PermissionFunction[];
  fields: PermissionField[];
  userPermissions: Record<string, UserPermissionState>;
  roles: CmsRole[];
  assignments: RoleAssignment[];
  issues: PolicyIssue[];
  reviews: AccessReview[];
  agencies: AgencyOption[];
}

export type { AuditGovernanceData } from '@/features/activity-logs/types';

export type TrashGovernanceData = TrashListPage;

export interface GovernanceDataSource {
  users: UsersGovernanceData;
  permissions: PermissionsGovernanceData;
  audit: AuditGovernanceData;
  trash: TrashedItem[];
}

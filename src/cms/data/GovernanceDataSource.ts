import type { AgencyOption, CategoryOption, CicUser, RoleOption } from '../modules/cic_users/types';
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
import type { AuditEvent, ExportJob, TrashedItem } from '../modules/activity_logs_trash/types';

export interface UsersGovernanceData {
  users: CicUser[];
  agencies: AgencyOption[];
  productCategories: CategoryOption[];
  newsCategories: CategoryOption[];
  roles: RoleOption[];
  permissionTasks: PermissionTask[];
  userPermissions: Record<string, UserPermissionState>;
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

export interface AuditGovernanceData {
  auditLogs: AuditEvent[];
  exportJobs: ExportJob[];
}

export interface GovernanceDataSource {
  users: UsersGovernanceData;
  permissions: PermissionsGovernanceData;
  audit: AuditGovernanceData;
  trash: TrashedItem[];
}

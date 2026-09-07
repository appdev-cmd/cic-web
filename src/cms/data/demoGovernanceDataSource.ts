import type { GovernanceDataSource } from './GovernanceDataSource';
import type { CicUser } from '../modules/cic_users/types';
import { agenciesMock, cicUsersMock, rolesMock } from '../modules/cic_users/mockData';
import {
  accessReviewsMock,
  cmsRolesMock,
  initialPermissionTasksMock,
  initialUserPermissionsMock,
  permissionFieldsMock,
  permissionFunctionsMock,
  permissionUsersMock,
  policyIssuesMock,
  roleAssignmentsMock,
} from '../modules/permission_management/mockData';
import { initialTrashedItemsMock } from '../modules/activity_logs_trash/mockData';

export const demoGovernanceDataSource: GovernanceDataSource = {
  users: {
    users: cicUsersMock.map(({ country: _country, ordering: _ordering, products_categories: _productScopes, news_categories: _newsScopes, two_factor_enabled: _twoFactor, failed_login_attempts: _failedLogins, ...user }) => user) as CicUser[],
    agencies: agenciesMock,
    roles: rolesMock,
    permissionTasks: initialPermissionTasksMock,
    rolePermissions: {},
  },
  permissions: {
    users: permissionUsersMock,
    tasks: initialPermissionTasksMock,
    functions: permissionFunctionsMock,
    fields: permissionFieldsMock,
    userPermissions: initialUserPermissionsMock,
    roles: cmsRolesMock,
    assignments: roleAssignmentsMock,
    issues: policyIssuesMock,
    reviews: accessReviewsMock,
    agencies: agenciesMock,
  },
  audit: {
    auditLogs: [],
    auditTotal: 0,
    exportJobs: [],
  },
  trash: initialTrashedItemsMock,
};

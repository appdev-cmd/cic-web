import type { GovernanceDataSource } from './GovernanceDataSource';
import { agenciesMock, cicUsersMock, newsCategoriesMock, productCategoriesMock, rolesMock } from '../modules/cic_users/mockData';
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
import { initialAuditLogsMock, initialExportJobsMock, initialTrashedItemsMock, savedViewFiltersMock } from '../modules/activity_logs_trash/mockData';

export const demoGovernanceDataSource: GovernanceDataSource = {
  users: {
    users: cicUsersMock,
    agencies: agenciesMock,
    productCategories: productCategoriesMock,
    newsCategories: newsCategoriesMock,
    roles: rolesMock,
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
    auditLogs: initialAuditLogsMock,
    exportJobs: initialExportJobsMock,
    savedViews: savedViewFiltersMock,
  },
  trash: initialTrashedItemsMock,
};

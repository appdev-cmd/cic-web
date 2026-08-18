export interface PermissionTask {
  id: string;
  module: string;
  view: string;
  task: string;
  description: string;
  published: boolean;
  ordering: number;
}

export interface PermissionFunction {
  id: string;
  taskId: string;
  code: string;
  name: string;
}

export interface PermissionField {
  id: string;
  moduleId: string;
  fieldCode: string;
  fieldName: string;
}

export interface UserPermissionState {
  userId: string;
  grantedTaskIds: string[];
  grantedFunctionIds: string[];
  grantedFieldIds: string[]; // Fields allowed to edit/view
}

export interface CmsUserPermissionTarget {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}

// --- MODULE 15: VAI TRÒ & QUYỀN SPECIFICATION TYPES ---

export type RoleRiskLevel = 'standard' | 'elevated' | 'privileged';
export type RoleStatus = 'active' | 'draft' | 'archived';
export type RoleCategory = 'system' | 'custom';

export type MatrixAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'publish'
  | 'export'
  | 'configure';

export type CellPermissionState = 'denied' | 'allowed' | 'conditional';

export type ScopeType = 'global' | 'site' | 'team' | 'locale' | 'ownership';

export interface ScopeConstraint {
  type: ScopeType;
  allowedValues: string[];
  description: string;
}

// Module Resource -> Action -> Permission State
export type ModulePermissionMatrix = Record<string, Partial<Record<MatrixAction, CellPermissionState>>>;

export interface RoleVersion {
  versionNumber: number;
  createdTime: string;
  createdBy: string;
  status: 'active' | 'draft' | 'superseded';
  changeNote: string;
  matrix: ModulePermissionMatrix;
  scopes: ScopeConstraint[];
}

export interface CmsRole {
  id: string;
  name: string;
  category: RoleCategory;
  riskLevel: RoleRiskLevel;
  status: RoleStatus;
  purpose: string;
  description: string;
  owner: string;
  reviewer: string;
  activeVersion: number;
  draftVersion?: number;
  versions: RoleVersion[];
  matrix: ModulePermissionMatrix;
  scopes: ScopeConstraint[];
  assignedUsersCount: number;
  assignedGroupCount: number;
  reviewDueDays?: number;
  conflictIssuesCount: number;
  updatedTime: string;
  updatedBy: string;
}

export interface RoleAssignment {
  id: string;
  userId: string;
  username: string;
  userFullName: string;
  userEmail: string;
  avatar: string;
  roleId: string;
  roleName: string;
  scopeSummary: string;
  assignedAt: string;
  assignedBy: string;
  expiresAt?: string;
}

export interface PolicyIssue {
  id: string;
  roleId: string;
  roleName: string;
  severity: 'high' | 'medium' | 'low';
  type: 'conflict' | 'overbroad' | 'unused' | 'review_overdue';
  title: string;
  description: string;
  recommendation: string;
  detectedAt: string;
}

export interface AccessReview {
  id: string;
  roleId: string;
  roleName: string;
  targetUserId?: string;
  targetUserName?: string;
  reviewer: string;
  dueDate: string;
  status: 'pending' | 'confirmed' | 'reduced' | 'revoked';
  notes?: string;
}


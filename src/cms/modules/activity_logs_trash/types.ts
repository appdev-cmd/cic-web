export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AuditResult = 'success' | 'failed' | 'partial' | 'denied';
export type SensitivityLevel = 'normal' | 'sensitive' | 'top_secret';

export type AuditCategory = 
  | 'all' 
  | 'sensitive' 
  | 'permissions_users' 
  | 'config_publish' 
  | 'export_jobs';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    ipAddress: string;
    userAgent: string;
  };
  action: {
    code: string;
    label: string;
    category: AuditCategory;
    severity: AuditSeverity;
    isSensitive: boolean;
  };
  target: {
    type: string;
    id: string;
    title: string;
    url?: string;
    module: string;
  };
  scope: {
    siteId: string;
    siteName: string;
    locale?: string;
  };
  result: AuditResult;
  resultMessage?: string;
  context: {
    sessionId: string;
    correlationId: string;
    sourceApp: string;
    environment: 'production' | 'staging';
  };
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
    isRedacted?: boolean;
    redactionReason?: string;
  }[];
  technicalRef?: {
    httpMethod?: string;
    endpoint?: string;
    executionTimeMs?: number;
    requestHeaders?: Record<string, string>;
  };
}

export type TrashCategory = 
  | 'all' 
  | 'content' 
  | 'media' 
  | 'config_resources' 
  | 'expiring_soon';

export type DependencyStatus = 'clear' | 'conflict' | 'parent_trashed' | 'schema_mismatch';

export interface TrashedItem {
  id: string;
  title: string;
  itemType: string; // e.g., 'Bài viết', 'Sản phẩm', 'Media Banner', 'Trang tĩnh'
  moduleName: string;
  scope: {
    siteId: string;
    siteName: string;
  };
  deletedBy: {
    id: string;
    name: string;
    role: string;
  };
  deletedAt: string;
  expiresAt: string;
  daysRemaining: number;
  isLegalHold: boolean;
  legalHoldReason?: string;
  dependencyStatus: DependencyStatus;
  dependencyDetails?: string;
  snapshotData: Record<string, any>;
  originalUrl?: string;
  targetRestoreState: 'draft' | 'inactive' | 'published';
}

export interface ExportJob {
  id: string;
  requestedAt: string;
  requestedBy: string;
  scopeName: string;
  dateRange: string;
  filterSummary: string;
  status: 'completed' | 'processing' | 'failed';
  totalRecords: number;
  fileSizeMb?: number;
  downloadUrl?: string;
  expiresAt: string;
}

export interface SavedViewFilter {
  id: string;
  name: string;
  category: AuditCategory | TrashCategory;
  dateRange: 'today' | '7days' | '30days' | 'all';
  severity?: AuditSeverity;
  result?: AuditResult;
  searchKeyword?: string;
}

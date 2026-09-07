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
  actor: { id: string; name: string; email: string; role: string; avatarUrl?: string; ipAddress: string; userAgent: string };
  action: { code: string; label: string; category: AuditCategory; severity: AuditSeverity; isSensitive: boolean };
  target: { type: string; id: string; title: string; url?: string; module: string };
  scope: { siteId: string; siteName: string; locale?: string };
  result: AuditResult;
  resultMessage?: string;
  context: { sessionId: string; correlationId: string; sourceApp: string; environment: 'production' | 'staging' };
  changes?: { field: string; oldValue: unknown; newValue: unknown; isRedacted?: boolean; redactionReason?: string }[];
  technicalRef?: { httpMethod?: string; endpoint?: string; executionTimeMs?: number };
}

export interface AuditListQuery {
  page: number;
  pageSize: number;
  search: string;
  date: 'today' | '7days' | '30days' | 'all';
  severity: AuditSeverity | 'all';
  result: AuditResult | 'all';
  category: AuditCategory;
}

export interface AuditListPage { items: AuditEvent[]; total: number }

export interface ExportJob {
  id: string;
  requestedAt: string;
  requestedBy: string;
  scopeName: string;
  dateRange: string;
  filterSummary: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
  totalRecords?: number;
  fileSizeMb?: number;
  downloadUrl?: string;
  expiresAt?: string;
}

export interface AuditGovernanceData {
  auditLogs: AuditEvent[];
  auditTotal: number;
  exportJobs: ExportJob[];
}

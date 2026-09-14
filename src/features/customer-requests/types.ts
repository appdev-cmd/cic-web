export type CustomerRequestSourceType = 'contact' | 'product_contact' | 'order' | 'form_submission';

export type RequestStatus =
  | 'new'
  | 'received'
  | 'processing'
  | 'contacted'
  | 'completed'
  | 'not_suitable'
  | 'cancelled';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type RequestListTabType = 'all' | 'new' | 'processing' | 'completed' | 'not_suitable' | 'cancelled';

export interface SourceConfig {
  formId?: string;
  formVersion?: number;
  formName?: string;
  ctaId?: string;
  ctaName?: string;
  pageType?: string;
  pageId?: string;
  pageUrl?: string;
  pageTitle?: string;
  placementKey?: string;
  submittedAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  deviceInfo?: {
    userAgent?: string;
    browser?: string;
    os?: string;
    device?: string;
  };
}

export interface SubmissionValue {
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  valueText?: string;
  valueJson?: unknown;
  fileId?: string;
}

export interface RequestNote {
  id: string;
  content: string;
  createdBy?: string;
  createdByName: string;
  createdAt: string;
}

export interface RequestLog {
  id: string;
  actionType: string;
  oldValue?: unknown;
  newValue?: unknown;
  createdBy?: string;
  createdByName: string;
  createdAt: string;
}

export interface CustomerRequest {
  id: string; // Unified key format: `${source_type}:${source_id}` (e.g. `contact:255`, `product_contact:2269`)
  sourceType: CustomerRequestSourceType;
  sourceId: number;
  workspace: 'vi' | 'en';
  sourceConfig: SourceConfig;
  submissionValues: SubmissionValue[];
  status: RequestStatus;
  assignedUserId?: string;
  assignedUserName?: string;
  priority: PriorityLevel;
  tags: string[];
  internalNotes: RequestNote[];
  logs: RequestLog[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRequestFilterParams {
  workspace: 'vi' | 'en';
  searchQuery?: string;
  tab?: RequestListTabType;
  status?: RequestStatus;
  formId?: string;
  ctaId?: string;
  assignedUserId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface CustomerRequestStats {
  all: number;
  new: number;
  processing: number;
  completed: number;
  not_suitable: number;
  cancelled: number;
}

export interface AssignableStaff {
  id: string;
  name: string;
  email: string;
  username: string;
  role?: string;
}

export interface CustomerRequestListResponse {
  requests: CustomerRequest[];
  totalCount: number;
  page: number;
  pageSize: number;
  stats: CustomerRequestStats;
  formOptions: Array<{ id: string; name: string }>;
  ctaOptions: Array<{ id: string; name: string }>;
  staffMembers: AssignableStaff[];
}

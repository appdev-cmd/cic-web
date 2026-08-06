// Customer Request Module Types

import { BaseEntity } from '../shared/types';
import { RequestStatus, PriorityLevel } from '../shared/constants/statusTypes';

export interface SourceConfig {
  formId: string;
  formVersion: number;
  formName: string;
  ctaId?: string;
  ctaName?: string;
  pageType: string;
  pageId: string;
  pageUrl: string;
  pageTitle: string;
  placementKey?: string;
  submittedAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  deviceInfo?: {
    userAgent: string;
    browser: string;
    os: string;
    device: string;
  };
}

export interface SubmissionValue {
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  valueText?: string;
  valueJson?: any;
  fileId?: string;
}

export interface RequestNote {
  id: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface RequestLog {
  id: string;
  actionType: string;
  oldValue?: any;
  newValue?: any;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface CustomerRequest extends BaseEntity {
  sourceConfig: SourceConfig;
  submissionValues: SubmissionValue[];
  status: RequestStatus;
  assignedUserId?: string;
  assignedUserName?: string;
  priority: PriorityLevel;
  tags: string[];
  internalNotes: RequestNote[];
  logs: RequestLog[];
}

export type RequestListTabType = 'all' | 'new' | 'processing' | 'completed' | 'not_suitable' | 'cancelled' | 'trash';

export interface RequestFilterState {
  searchQuery: string;
  status?: RequestStatus;
  formId?: string;
  ctaId?: string;
  pageId?: string;
  assignedUserId?: string;
  tab: RequestListTabType;
  dateFrom?: string;
  dateTo?: string;
}

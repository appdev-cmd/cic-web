// CTA Module Types

import { BaseEntity, UsageLocation, AnalyticsData } from '../shared/types';
import { ActionType } from '../shared/constants/actionTypes';
import { CtaStatus } from '../shared/constants/statusTypes';
import type { CustomerInteractionGovernance } from '../../../../shared/customerInteractionContract';

export interface CtaActionConfig {
  type: ActionType;
  formId?: string;
  url?: string;
  openInNewTab?: boolean;
  sectionId?: string;
  fileId?: string;
  phoneNumber?: string;
  emailAddress?: string;
  emailTemplateId?: string;
  reviewBeforeSend?: boolean;
}

export type CtaStyleVariant = 'primary' | 'secondary' | 'outline' | 'gradient';

export interface CtaItem extends BaseEntity {
  adminName: string;
  displayText: string;
  description?: string;
  code: string;
  icon?: string;
  styleVariant?: CtaStyleVariant;
  actionConfig: CtaActionConfig;
  status: CtaStatus;
  usedByCount: number;
  usedByPages: UsageLocation[];
  analytics: AnalyticsData;
  governance: CustomerInteractionGovernance;
}

export interface CtaFormData {
  adminName: string;
  displayText: string;
  description?: string;
  code: string;
  icon?: string;
  styleVariant: CtaStyleVariant;
  actionConfig: CtaActionConfig;
  status: CtaStatus;
}

export type CtaListTabType = 'all' | 'active' | 'draft' | 'archived';

export interface CtaFilterState {
  searchQuery: string;
  status?: CtaStatus;
  actionType?: ActionType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'oldest' | 'clicks' | 'ctr' | 'name';
  tab: CtaListTabType;
}

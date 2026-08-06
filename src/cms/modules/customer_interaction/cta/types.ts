// CTA Module Types

import { BaseEntity, UsageLocation, AnalyticsData } from '../shared/types';
import { ActionType } from '../shared/constants/actionTypes';
import { CtaStatus } from '../shared/constants/statusTypes';

export interface CtaActionConfig {
  type: ActionType;
  formId?: string;
  url?: string;
  openInNewTab?: boolean;
  sectionId?: string;
  fileId?: string;
  phoneNumber?: string;
  emailAddress?: string;
  customAction?: string;
}

export interface CtaItem extends BaseEntity {
  adminName: string;
  displayText: string;
  description?: string;
  code: string;
  icon?: string;
  actionConfig: CtaActionConfig;
  status: CtaStatus;
  usedByCount: number;
  usedByPages: UsageLocation[];
  analytics: AnalyticsData;
}

export interface CtaFormData {
  adminName: string;
  displayText: string;
  description?: string;
  code: string;
  icon?: string;
  actionConfig: CtaActionConfig;
  status: CtaStatus;
}

export type CtaListTabType = 'all' | 'active' | 'draft' | 'archived' | 'trash';

export interface CtaFilterState {
  searchQuery: string;
  status?: CtaStatus;
  actionType?: ActionType;
  tab: CtaListTabType;
}

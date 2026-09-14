export type { ActionType } from '@/cms/modules/customer_interaction/shared/constants/actionTypes';
export type { CtaStatus } from '@/cms/modules/customer_interaction/shared/constants/statusTypes';
import type { ActionType } from '@/cms/modules/customer_interaction/shared/constants/actionTypes';
import type { CtaStatus } from '@/cms/modules/customer_interaction/shared/constants/statusTypes';
import type { UsageLocation, AnalyticsData } from '@/cms/modules/customer_interaction/shared/types';
import type { CustomerInteractionGovernance } from '@/shared/customerInteractionContract';

export type CtaWorkspace = 'vi' | 'en';
export type CtaStyleVariant = 'primary' | 'secondary' | 'outline' | 'gradient';

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

export interface CtaEntity {
  id: string;
  workspace: CtaWorkspace;
  code: string;
  isSystem: boolean;
  adminName: string;
  displayText: string;
  description?: string;
  icon?: string;
  styleVariant: CtaStyleVariant;
  actionType: ActionType;
  actionConfig: CtaActionConfig;
  formId?: string | null;
  mediaAssetId?: string | null;
  emailTemplateId?: string | null;
  status: CtaStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  usedByCount?: number;
  usedByPages?: UsageLocation[];
  analytics?: AnalyticsData;
  governance?: CustomerInteractionGovernance;
}

export interface CreateCtaInput {
  workspace: CtaWorkspace;
  code: string;
  adminName: string;
  displayText: string;
  description?: string;
  icon?: string;
  styleVariant: CtaStyleVariant;
  actionType: ActionType;
  actionConfig: CtaActionConfig;
  formId?: string | null;
  mediaAssetId?: string | null;
  emailTemplateId?: string | null;
  status?: CtaStatus;
}

export interface UpdateCtaInput {
  adminName: string;
  displayText: string;
  description?: string;
  icon?: string;
  styleVariant: CtaStyleVariant;
  actionType: ActionType;
  actionConfig: CtaActionConfig;
  formId?: string | null;
  mediaAssetId?: string | null;
  emailTemplateId?: string | null;
  status?: CtaStatus;
}

export interface CtaFilterParams {
  workspace: CtaWorkspace;
  status?: CtaStatus;
  actionType?: ActionType;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'oldest' | 'clicks' | 'ctr' | 'name';
}

// Form Module Types

import { BaseEntity, AnalyticsData } from '../shared/types';
import { FieldType, FieldRoleType } from '../shared/constants/fieldTypes';
import { FormStatus } from '../shared/constants/statusTypes';

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  customMessage?: string;
}

export interface FieldOption {
  value: string;
  label: string;
  order?: number;
}

export interface FileConfig {
  allowedTypes: string[];
  maxSize: number;
  maxFiles: number;
}

export interface FormField {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: FieldType;
  roleType?: FieldRoleType;
  placeholder?: string;
  helpText?: string;
  validation: FieldValidation;
  options?: FieldOption[];
  fileConfig?: FileConfig;
  position: number;
  isRequired: boolean;
  isLocked: boolean;
}

export interface FormSubmitConfig {
  saveToDatabase: boolean;
  createCustomerRequest: boolean;
  sendAdminEmail: boolean;
  adminEmails: string[];
  sendConfirmationEmail: boolean;
  confirmationEmailTemplate?: string;
  adminEmailTemplate?: string;
  successMessage: string;
  submitButtonText?: string;
  redirectUrl?: string;
  allowFileDownload?: boolean;
  downloadFileId?: string;
  webhookUrl?: string;
  webhookHeaders?: Record<string, string>;
  crmSyncEnabled: boolean;
  crmConfig?: Record<string, any>;
}

export interface FormItem extends BaseEntity {
  adminName: string;
  title: string;
  description?: string;
  code: string;
  status: FormStatus;
  currentVersion: number;
  fields: FormField[];
  submitConfig: FormSubmitConfig;
  analytics: AnalyticsData;
  stats?: {
    submissions: number;
    conversionRate: number;
  };
}

export interface FormFormData {
  adminName: string;
  title: string;
  description?: string;
  code: string;
  status: FormStatus;
  fields: FormField[];
  submitConfig: FormSubmitConfig;
}

export type FormListTabType = 'all' | 'active' | 'draft' | 'archived' | 'trash';

export interface FormFilterState {
  searchQuery: string;
  status?: FormStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'oldest' | 'submissions' | 'conversionRate' | 'name';
  tab: FormListTabType;
}

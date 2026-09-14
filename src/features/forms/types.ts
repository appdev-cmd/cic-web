export type FormWorkspace = 'vi' | 'en';
export type FormStatus = 'draft' | 'active' | 'inactive' | 'archived';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'consent';

export type FormFieldRoleType =
  | 'customer_name'
  | 'email'
  | 'phone'
  | 'company'
  | 'message'
  | 'other';

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

export interface FormFieldDefinition {
  id?: string;
  fieldKey: string;
  label: string;
  fieldType: FormFieldType;
  roleType?: FormFieldRoleType;
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
  submitButtonText?: string;
  successMessage: string;
  redirectUrl?: string;
  allowFileDownload?: boolean;
  downloadFileId?: string;
  webhookUrl?: string;
  crmSyncEnabled: boolean;
}

export interface FormEntity {
  id: string;
  workspace: FormWorkspace;
  code: string;
  isSystem: boolean;
  adminName: string;
  title: string;
  description?: string;
  status: FormStatus;
  currentVersion: number;
  submitConfig: FormSubmitConfig;
  fields: FormFieldDefinition[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  stats?: {
    submissions: number;
    conversionRate: number;
  };
}

export interface CreateFormInput {
  workspace: FormWorkspace;
  code: string;
  adminName: string;
  title: string;
  description?: string;
  status?: FormStatus;
  submitConfig: FormSubmitConfig;
  fields: FormFieldDefinition[];
}

export interface UpdateFormInput {
  adminName: string;
  title: string;
  description?: string;
  status?: FormStatus;
  incrementVersion?: boolean;
  submitConfig: FormSubmitConfig;
  fields: FormFieldDefinition[];
}

export interface FormSubmissionValueItem {
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  valueText?: string;
  valueJson?: unknown;
  mediaAssetId?: string;
}

export interface FormSubmissionDetail {
  id: string;
  formId: string;
  formVersion: number;
  sourceType?: string;
  sourceId?: number;
  sourcePath?: string;
  ctaId?: string;
  placementKey?: string;
  submittedAt: string;
  values: FormSubmissionValueItem[];
  customerName?: string;
  email?: string;
  phone?: string;
}

export interface FormFilterParams {
  workspace: FormWorkspace;
  status?: FormStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'oldest' | 'submissions' | 'conversionRate' | 'name';
}

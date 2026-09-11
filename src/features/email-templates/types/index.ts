export type EmailWorkspace = 'vi' | 'en';
export type EmailAudience = 'customer' | 'internal';
export type EmailTemplateStatus = 'draft' | 'active' | 'inactive' | 'archived';

export type EmailEvent =
  | 'product_contact'
  | 'product_download'
  | 'product_purchase'
  | 'product_quote'
  | 'product_hardlock'
  | 'auth_activate'
  | 'auth_forgot_password'
  | 'order_confirmation'
  | 'order_payment_success';

export interface EmailTemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  subject: string;
  content: string;
  createdBy?: number | null;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  workspace: EmailWorkspace;
  name: string;
  event: EmailEvent | string;
  audience: EmailAudience;
  status: EmailTemplateStatus;
  draftVersionId?: string | null;
  activeVersionId?: string | null;
  subject: string;
  content: string;
  version: number;
  updatedAt: string;
  updatedBy?: number | null;
  activatedAt?: string | null;
  activatedBy?: number | null;
  versionsCount?: number;
}

export interface EmailTemplateDetail extends EmailTemplate {
  versions: EmailTemplateVersion[];
}

export interface EmailTemplateFilter {
  workspace?: EmailWorkspace;
  event?: string;
  audience?: EmailAudience;
  status?: EmailTemplateStatus;
  search?: string;
}

export interface EmailUsageItem {
  id: string | number;
  name: string;
  type: 'form' | 'cta';
  url?: string;
}

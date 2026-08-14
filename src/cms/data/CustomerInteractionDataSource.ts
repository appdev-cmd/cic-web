import type { CmsLocale } from './CmsDataSource';
import type { CtaItem } from '../modules/customer_interaction/cta/types';
import type { FormItem } from '../modules/customer_interaction/forms/types';
import type { CustomerRequest } from '../modules/customer_interaction/customer_requests/types';
import type { EmailTemplate } from '../modules/email_templates/types';

export interface CtaDownloadFileOption {
  id: string;
  title: string;
  filename: string;
}

export interface CtaModuleData {
  ctas: CtaItem[];
  forms: FormItem[];
  emailTemplates: EmailTemplate[];
  downloadFiles: CtaDownloadFileOption[];
}

export interface FormModuleData {
  forms: FormItem[];
  emailTemplates: EmailTemplate[];
}

export interface CustomerRequestModuleData {
  requests: CustomerRequest[];
}

export interface CustomerInteractionDataSource {
  ctaByLocale: Partial<Record<CmsLocale, CtaModuleData>>;
  formByLocale: Partial<Record<CmsLocale, FormModuleData>>;
  customerRequestByLocale: Partial<Record<CmsLocale, CustomerRequestModuleData>>;
}

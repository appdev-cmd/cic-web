import type { CmsLocale } from './CmsDataSource';
import type { CtaModuleData, CustomerInteractionDataSource, CustomerRequestModuleData, EmailTemplateModuleData, FormModuleData } from './CustomerInteractionDataSource';
import { getDemoMediaModuleData } from './demoMediaDataSource';
import { MOCK_CTAS } from '../modules/customer_interaction/cta/mockData';
import { MOCK_FORMS } from '../modules/customer_interaction/forms/mockData';
import { MOCK_CUSTOMER_REQUESTS } from '../modules/customer_interaction/customer_requests/mockData';
import { mockEmailTemplates } from '../modules/email_templates/mockData';

const clone = <T,>(value: T): T => structuredClone(value);

const viCtaData: CtaModuleData = {
  ctas: MOCK_CTAS.map((cta) => ({ ...cta, styleVariant: cta.styleVariant ?? 'primary' })),
  forms: MOCK_FORMS,
  emailTemplates: mockEmailTemplates.filter((template) => template.workspace === 'vi'),
  downloadFiles: getDemoMediaModuleData('vi').assets
    .filter((asset) => asset.type === 'document' && asset.workflow_status === 'ready')
    .map(({ id, title, filename }) => ({ id, title, filename })),
};

export const demoCustomerInteractionDataSource: CustomerInteractionDataSource = {
  ctaByLocale: { vi: viCtaData },
  formByLocale: {
    vi: { forms: MOCK_FORMS, emailTemplates: viCtaData.emailTemplates },
  },
  customerRequestByLocale: {
    vi: { requests: MOCK_CUSTOMER_REQUESTS },
  },
  emailTemplateByLocale: {
    vi: { templates: viCtaData.emailTemplates, forms: MOCK_FORMS, ctas: MOCK_CTAS },
    en: { templates: mockEmailTemplates.filter((template) => template.workspace === 'en'), forms: [], ctas: [] },
  },
};

const emptyCtaData = (): CtaModuleData => ({ ctas: [], forms: [], emailTemplates: [], downloadFiles: [] });

/** Current React mock boundary. Workspaces never fall back to another locale. */
export const getDemoCtaModuleData = (locale: CmsLocale): CtaModuleData =>
  clone(demoCustomerInteractionDataSource.ctaByLocale[locale] ?? emptyCtaData());

const emptyFormData = (): FormModuleData => ({ forms: [], emailTemplates: [] });

/** Current React mock boundary for Forms; no cross-workspace fallback. */
export const getDemoFormModuleData = (locale: CmsLocale): FormModuleData =>
  clone(demoCustomerInteractionDataSource.formByLocale[locale] ?? emptyFormData());

const emptyCustomerRequestData = (): CustomerRequestModuleData => ({ requests: [] });

/** Current React mock boundary for the unified customer-request read model. */
export const getDemoCustomerRequestModuleData = (locale: CmsLocale): CustomerRequestModuleData =>
  clone(demoCustomerInteractionDataSource.customerRequestByLocale[locale] ?? emptyCustomerRequestData());

const emptyEmailTemplateData = (): EmailTemplateModuleData => ({ templates: [], forms: [], ctas: [] });

/** Current React mock boundary for Email Templates and its Form/CTA usage relations. */
export const getDemoEmailTemplateModuleData = (locale: CmsLocale): EmailTemplateModuleData =>
  clone(demoCustomerInteractionDataSource.emailTemplateByLocale[locale] ?? emptyEmailTemplateData());

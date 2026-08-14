import type { CmsLocale } from './CmsDataSource';
import type { CtaModuleData, CustomerInteractionDataSource } from './CustomerInteractionDataSource';
import { getDemoMediaModuleData } from './demoMediaDataSource';
import { MOCK_CTAS } from '../modules/customer_interaction/cta/mockData';
import { MOCK_FORMS } from '../modules/customer_interaction/forms/mockData';
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
};

const emptyCtaData = (): CtaModuleData => ({ ctas: [], forms: [], emailTemplates: [], downloadFiles: [] });

/** Current React mock boundary. Workspaces never fall back to another locale. */
export const getDemoCtaModuleData = (locale: CmsLocale): CtaModuleData =>
  clone(demoCustomerInteractionDataSource.ctaByLocale[locale] ?? emptyCtaData());

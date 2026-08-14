import type { CmsLocale } from './CmsDataSource';
import type { FunctionSeoRecord } from '../modules/function_seo/types';
import { functionSeoByLocale } from '../modules/function_seo/mockData';

export function getDemoFunctionSeoData(locale: CmsLocale): FunctionSeoRecord[] {
  return functionSeoByLocale[locale].map((record) => ({ ...record }));
}

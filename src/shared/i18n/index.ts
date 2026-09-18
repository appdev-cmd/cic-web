import type { Locale } from './locales';
import type { TranslationDictionary } from './types';
import { viDictionary } from './dictionaries/vi';
import { enDictionary } from './dictionaries/en';

export * from './locales';
export * from './types';
export * from './context';
export { viDictionary } from './dictionaries/vi';
export { enDictionary } from './dictionaries/en';

const dictionaries: Record<Locale, TranslationDictionary> = {
  vi: viDictionary,
  en: enDictionary,
};

export function getDictionary(locale: Locale = 'vi'): TranslationDictionary {
  return dictionaries[locale] ?? dictionaries.vi;
}

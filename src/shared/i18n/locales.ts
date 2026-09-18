export type Locale = 'vi' | 'en';

export const DEFAULT_LOCALE: Locale = 'vi';

export const SUPPORTED_LOCALES: readonly Locale[] = ['vi', 'en'] as const;

export function isSupportedLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

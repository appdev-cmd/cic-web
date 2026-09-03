export const SUPPORTED_LOCALES = ['vi', 'en'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'vi';

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}

export function resolveAppLocale(value: string | null | undefined): AppLocale {
  return value && isAppLocale(value) ? value : DEFAULT_LOCALE;
}

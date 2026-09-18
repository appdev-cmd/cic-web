'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Locale } from './locales';
import type { TranslationDictionary } from './types';
import { getDictionary } from './index';

interface I18nContextValue {
  locale: Locale;
  dictionary: TranslationDictionary;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  locale: Locale;
  children: React.ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    dictionary,
    t: dictionary,
  }), [locale, dictionary]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback if rendered outside provider
    const fallbackDictionary = getDictionary('vi');
    return {
      locale: 'vi',
      dictionary: fallbackDictionary,
      t: fallbackDictionary,
    };
  }
  return context;
}

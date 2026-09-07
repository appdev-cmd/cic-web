'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { CmsLocale } from '@/cms/data/CmsDataSource';

const CmsWorkspaceLocaleContext = createContext<CmsLocale>('vi');

export function CmsWorkspaceLocaleProvider({ locale, children }: Readonly<{ locale: CmsLocale; children: ReactNode }>) {
  return <CmsWorkspaceLocaleContext.Provider value={locale}>{children}</CmsWorkspaceLocaleContext.Provider>;
}

export function useCmsWorkspaceLocale(): CmsLocale {
  return useContext(CmsWorkspaceLocaleContext);
}

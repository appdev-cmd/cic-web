'use client';

import React, { createContext, useContext } from 'react';
import type { ContactMessage, ProductRegistration, PendingContent, ActivityLog } from '../types';

export type DrawerItemData =
  | { type: 'contact'; data: ContactMessage }
  | { type: 'registration'; data: ProductRegistration }
  | { type: 'pending'; data: PendingContent }
  | { type: 'activity'; data: ActivityLog };

interface CmsDrawerContextValue {
  openDrawer: (type: 'contact' | 'registration' | 'pending' | 'activity', data: any) => void;
  closeDrawer: () => void;
}

export const CmsDrawerContext = createContext<CmsDrawerContextValue>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const useCmsDrawer = () => useContext(CmsDrawerContext);

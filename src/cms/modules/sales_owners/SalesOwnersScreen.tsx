'use client';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';import type { SalesOwnerModuleData } from '@/features/sales-owners/types';import { SalesOwnersManager } from './SalesOwnersManager';
export function SalesOwnersScreen({data,capabilities}:{data:SalesOwnerModuleData;capabilities:{create:boolean;edit:boolean;delete:boolean}}){const locale=useCmsWorkspaceLocale();return <SalesOwnersManager key={locale} data={data} locale={locale} capabilities={capabilities}/>;}

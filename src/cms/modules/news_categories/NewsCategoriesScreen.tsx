'use client';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { NewsCategoryModuleData } from '@/features/news-categories/types';
import { NewsCategoriesManager } from './NewsCategoriesManager';
export type NewsCategoryCapabilities={create:boolean;edit:boolean;delete:boolean};
export function NewsCategoriesScreen({data,capabilities}:Readonly<{data:NewsCategoryModuleData;capabilities:NewsCategoryCapabilities}>){const locale=useCmsWorkspaceLocale();return <NewsCategoriesManager key={locale} items={data[locale]} locale={locale} capabilities={capabilities}/>;}

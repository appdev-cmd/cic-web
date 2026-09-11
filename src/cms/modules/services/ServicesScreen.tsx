'use client';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { getCmsServices } from '@/features/services/server/cms-queries';
import { ServicesManager } from './ServicesManager';
type Data=Awaited<ReturnType<typeof getCmsServices>>;
export function ServicesScreen({data,capabilities}:{data:Record<'vi'|'en',Data>;capabilities:{create:boolean;edit:boolean;delete:boolean}}){const locale=useCmsWorkspaceLocale(),current=data[locale],version=current.services.map(item=>`${item.id}:${item.updated_at}`).join('|');return <ServicesManager key={`${locale}:${version}`} workspaceLocale={locale} data={current} capabilities={capabilities}/>;}

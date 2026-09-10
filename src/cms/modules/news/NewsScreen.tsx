'use client';
import { useCmsWorkspaceLocale } from '@/cms/context/CmsWorkspaceLocaleContext';
import type { getCmsNews } from '@/features/news/server/cms-queries';
import { NewsManager } from './NewsManager';
type Data=Awaited<ReturnType<typeof getCmsNews>>;
export function NewsScreen({data,capabilities}:Readonly<{data:Record<'vi'|'en',Data>;capabilities:{create:boolean;edit:boolean;delete:boolean}}>){const locale=useCmsWorkspaceLocale();const current=data[locale];const version=current.articles.map((item)=>`${item.id}:${item.updated_time}`).join('|');return <NewsManager key={`${locale}:${version}`} workspaceLocale={locale} data={current} capabilities={capabilities}/>;}

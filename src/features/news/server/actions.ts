'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { newsIdSchema,newsInputSchema,newsLocaleSchema } from '../schemas/newsInput';
import { saveNews,setNewsPlacement,setNewsPublished,trashNews } from './repository';
const refresh=()=>{revalidatePath('/cms/news');revalidatePath('/news');revalidatePath('/news/[slug]','page');};
export async function saveNewsAction(locale:unknown,id:unknown,payload:unknown){const actor=await requirePermission('news',id?'edit':'create');const result=await saveNews(newsLocaleSchema.parse(locale),id?newsIdSchema.parse(id):null,newsInputSchema.parse(payload),actor);refresh();return result;}
export async function setNewsPublishedAction(locale:unknown,ids:unknown,published:unknown){const actor=await requirePermission('news','edit');await setNewsPublished(newsLocaleSchema.parse(locale),z.array(newsIdSchema).min(1).max(100).parse(ids),z.boolean().parse(published),actor);refresh();}
export async function setNewsPlacementAction(locale:unknown,id:unknown,placement:unknown,enabled:unknown){const actor=await requirePermission('news','edit');await setNewsPlacement(newsLocaleSchema.parse(locale),newsIdSchema.parse(id),z.enum(['hot','home']).parse(placement),z.boolean().parse(enabled),actor);refresh();}
export async function trashNewsAction(locale:unknown,id:unknown){const actor=await requirePermission('news','delete');await trashNews(newsLocaleSchema.parse(locale),newsIdSchema.parse(id),actor);refresh();}

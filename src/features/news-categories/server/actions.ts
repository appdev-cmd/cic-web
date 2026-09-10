'use server';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/server/auth/guards';
import { newsCategoryIdSchema,newsCategoryInputSchema,newsCategoryLocaleSchema } from '../schemas/newsCategoryInput';
import { getCmsNewsCategories } from './queries';
import { saveNewsCategory,setNewsCategoryHomepage,setNewsCategoryPublished,trashNewsCategory } from './repository';
const refresh=()=>{revalidatePath('/cms/news/categories');revalidatePath('/news');revalidatePath('/');};
export async function refreshNewsCategoriesAction(locale:unknown){await requirePermission('news','view');return getCmsNewsCategories(newsCategoryLocaleSchema.parse(locale));}
export async function saveNewsCategoryAction(locale:unknown,id:unknown,payload:unknown){const actor=await requirePermission('news',id?'edit':'create');const result=await saveNewsCategory(newsCategoryLocaleSchema.parse(locale),id?newsCategoryIdSchema.parse(id):null,newsCategoryInputSchema.parse(payload),actor);refresh();return result;}
export async function setNewsCategoryPublishedAction(locale:unknown,id:unknown,published:unknown){const actor=await requirePermission('news','edit');await setNewsCategoryPublished(newsCategoryLocaleSchema.parse(locale),newsCategoryIdSchema.parse(id),published===true,actor);refresh();}
export async function setNewsCategoryHomepageAction(locale:unknown,id:unknown,value:unknown){const actor=await requirePermission('news','edit');await setNewsCategoryHomepage(newsCategoryLocaleSchema.parse(locale),newsCategoryIdSchema.parse(id),value===true,actor);refresh();}
export async function trashNewsCategoryAction(locale:unknown,id:unknown){const actor=await requirePermission('news','delete');const result=await trashNewsCategory(newsCategoryLocaleSchema.parse(locale),newsCategoryIdSchema.parse(id),actor);refresh();return result;}

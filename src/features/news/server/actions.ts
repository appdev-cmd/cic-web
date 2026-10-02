'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { newsIdSchema,newsInputSchema,newsLocaleSchema } from '../schemas/newsInput';
import { saveNews,setNewsPlacement,setNewsPublished,trashNews } from './repository';
import { getCmsNewsContent, invalidateCmsNewsCache } from './cms-queries';

import { getPostgresClient } from '@/server/db/postgres';
import { getLlmProvider } from '@/features/ai-operator/server/llm-provider';
import type { NewsInput } from '../schemas/newsInput';

const refresh=()=>{
  invalidateCmsNewsCache();
  revalidatePath('/cms/news');
  revalidatePath('/news');
  revalidatePath('/news/[slug]','page');
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

export interface TranslateAndCreateEnNewsInput {
  sourceNewsId?: string | number | null;
  title: string;
  summary?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keyword?: string;
  tags?: string[];
  categoryId: string | number;
  image?: string;
  video?: string;
  fileUpload?: string;
  newsRelated?: string[];
  productsRelated?: string[];
  isHot?: boolean;
  showInHomepage?: boolean;
  ordering?: number;
  startTime?: string;
  endTime?: string;
}

export async function translateAndCreateEnNewsAction(input: TranslateAndCreateEnNewsInput) {
  const actor = await requirePermission('news', 'create');
  const title = input.title?.trim();
  if (!title) {
    throw new Error('Vui lòng nhập tiêu đề bài viết trước khi dịch sang tiếng Anh.');
  }

  const fieldsToTranslate: Record<string, string> = { title };
  if (input.summary?.trim()) fieldsToTranslate.summary = input.summary.trim();
  if (input.content?.trim()) fieldsToTranslate.content = input.content.trim();
  if (input.seo_title?.trim()) fieldsToTranslate.seo_title = input.seo_title.trim();
  if (input.seo_description?.trim()) fieldsToTranslate.seo_description = input.seo_description.trim();
  if (input.seo_keyword?.trim()) fieldsToTranslate.seo_keyword = input.seo_keyword.trim();

  const llm = getLlmProvider();
  const systemPrompt = `You are a professional technical translator and technology journalist for CIC Technology (a leading AEC & engineering technology corporation in Vietnam).
Translate the provided key-value fields from Vietnamese into professional, engaging English for a B2B engineering audience.
CRITICAL RULES:
1. Preserve all HTML tags, classes, and attributes completely intact (e.g. <h2>, <h3>, <p>, <b>, <ul>, <li>, <a>, <table>, <tr>, <td>, <img>). Do NOT remove or modify HTML structure.
2. Use precise AEC, software engineering, and BIM terminology (e.g. Building Information Modeling, Structural Engineering, Geotechnical, Smart City, Digital Twin, Infrastructure Lifecycle).
3. Return a JSON object with the exact same keys containing the translated values:
{
  "title": "...",
  "summary": "...",
  "content": "...",
  "seo_title": "...",
  "seo_description": "...",
  "seo_keyword": "..."
}`;

  const raw = await llm.generateStructured<Record<string, string>>({
    systemPrompt,
    userPrompt: JSON.stringify(fieldsToTranslate),
    temperature: 0.2,
  });

  const translated = (raw && typeof raw === 'object' && 'translations' in raw && typeof (raw as any).translations === 'object' && (raw as any).translations !== null)
    ? (raw as any).translations
    : (raw && typeof raw === 'object' ? raw : {});

  const enTitle = String(translated.title || title).trim();
  const baseEnAlias = slugify(enTitle) || slugify(title);
  const sql = getPostgresClient();

  let existingEnId: number | null = null;
  if (input.sourceNewsId) {
    const existingById = await sql.unsafe<{ id: number }[]>(
      `SELECT id FROM cic_news_en WHERE id = $1 LIMIT 1`,
      [Number(input.sourceNewsId)]
    );
    if (existingById.length > 0) {
      existingEnId = Number(existingById[0].id);
    } else {
      const existingByOtherLang = await sql.unsafe<{ id: number }[]>(
        `SELECT id FROM cic_news_en WHERE other_languages1 = $1 LIMIT 1`,
        [`/news/${slugify(title)}`]
      );
      if (existingByOtherLang.length > 0) {
        existingEnId = Number(existingByOtherLang[0].id);
      }
    }
  }

  if (!existingEnId) {
    const existingByAlias = await sql.unsafe<{ id: number }[]>(
      `SELECT id FROM cic_news_en WHERE lower(btrim(alias)) = lower(btrim($1)) LIMIT 1`,
      [baseEnAlias]
    );
    if (existingByAlias.length > 0) {
      existingEnId = Number(existingByAlias[0].id);
    }
  }

  let finalEnAlias = baseEnAlias;
  const isTaken = await sql.unsafe<{ id: number }[]>(
    `SELECT id FROM cic_news_en WHERE lower(btrim(alias)) = lower(btrim($1)) AND ($2::int IS NULL OR id <> $2) LIMIT 1`,
    [finalEnAlias, existingEnId]
  );
  if (isTaken.length > 0) {
    finalEnAlias = `${baseEnAlias}-${Date.now().toString().slice(-4)}`;
  }

  // Map category to cic_news_categories_en
  let validEnCategoryId: number | null = null;
  if (input.categoryId) {
    const viCatRows = await sql.unsafe<{ id: number; name: string; alias: string }[]>(
      `SELECT id, name, alias FROM cic_news_categories WHERE id = $1 LIMIT 1`,
      [Number(input.categoryId)]
    );
    if (viCatRows.length > 0) {
      const viCat = viCatRows[0];
      const matchedEnCat = await sql.unsafe<{ id: number }[]>(
        `SELECT id FROM cic_news_categories_en WHERE lower(btrim(alias)) = lower(btrim($1)) OR lower(btrim(name)) = lower(btrim($2)) LIMIT 1`,
        [viCat.alias, viCat.name]
      );
      if (matchedEnCat.length > 0) {
        validEnCategoryId = Number(matchedEnCat[0].id);
      } else {
        const sameIdEnCat = await sql.unsafe<{ id: number }[]>(
          `SELECT id FROM cic_news_categories_en WHERE id = $1 LIMIT 1`,
          [Number(viCat.id)]
        );
        if (sameIdEnCat.length > 0) {
          validEnCategoryId = Number(sameIdEnCat[0].id);
        }
      }
    }
  }

  if (!validEnCategoryId) {
    const defaultEnCat = await sql.unsafe<{ id: number }[]>(
      `SELECT id FROM cic_news_categories_en ORDER BY ordering, id LIMIT 1`
    );
    if (defaultEnCat.length > 0) {
      validEnCategoryId = Number(defaultEnCat[0].id);
    } else {
      validEnCategoryId = Number(input.categoryId) || 1;
    }
  }

  // Filter valid related items for EN
  let validEnRelatedNewsIds: number[] = [];
  if (input.newsRelated?.length) {
    const candidateNewsIds = input.newsRelated.map(Number).filter((n) => Number.isInteger(n) && n > 0);
    if (candidateNewsIds.length > 0) {
      const existingNews = await sql.unsafe<{ id: number }[]>(
        `SELECT id FROM cic_news_en WHERE id = ANY($1::int[])`,
        [candidateNewsIds]
      );
      validEnRelatedNewsIds = existingNews.map((r) => Number(r.id));
    }
  }

  let validEnRelatedProductIds: number[] = [];
  if (input.productsRelated?.length) {
    const candidateProdIds = input.productsRelated.map(Number).filter((n) => Number.isInteger(n) && n > 0);
    if (candidateProdIds.length > 0) {
      const existingProds = await sql.unsafe<{ id: number }[]>(
        `SELECT id FROM cic_products_en WHERE id = ANY($1::int[])`,
        [candidateProdIds]
      );
      validEnRelatedProductIds = existingProds.map((r) => Number(r.id));
    }
  }

  const enPayload: NewsInput = {
    title: enTitle,
    alias: finalEnAlias,
    other_languages1: input.sourceNewsId ? `/news/${slugify(title)}` : '',
    categoryId: validEnCategoryId,
    summary: String(translated.summary || input.summary || '').trim(),
    content: String(translated.content || input.content || '').trim(),
    image: input.image || '',
    video: input.video || '',
    fileUpload: input.fileUpload || '',
    tags: Array.isArray(input.tags) ? input.tags : [],
    relatedNewsIds: validEnRelatedNewsIds,
    relatedProductIds: validEnRelatedProductIds,
    startTime: input.startTime || new Date().toISOString(),
    endTime: input.endTime || '',
    published: false,
    isHot: false,
    showInHomepage: false,
    ordering: Number(input.ordering) || 1,
    seoTitle: String(translated.seo_title || enTitle).trim(),
    seoKeyword: String(translated.seo_keyword || '').trim(),
    seoDescription: String(translated.seo_description || translated.summary || input.summary || '').trim(),
    tawkTo: '',
  };

  const parsedEnPayload = newsInputSchema.parse(enPayload);
  const result = await saveNews('en', existingEnId, parsedEnPayload, actor);

  if (input.sourceNewsId) {
    await sql.unsafe(
      `UPDATE cic_news SET other_languages1 = $1 WHERE id = $2`,
      [`/en/news/${finalEnAlias}`, Number(input.sourceNewsId)]
    );
  }

  refresh();
  return {
    enId: result.id,
    enTitle,
    enUrl: `/en/news/${finalEnAlias}`,
  };
}

export async function getNewsContentAction(locale: unknown, id: unknown): Promise<string> {
  await requirePermission('news', 'view');
  const validLocale = newsLocaleSchema.parse(locale);
  const validId = newsIdSchema.parse(id);
  return getCmsNewsContent(validLocale, String(validId));
}

export async function saveNewsAction(locale:unknown,id:unknown,payload:unknown){const actor=await requirePermission('news',id?'edit':'create');const result=await saveNews(newsLocaleSchema.parse(locale),id?newsIdSchema.parse(id):null,newsInputSchema.parse(payload),actor);refresh();return result;}
export async function setNewsPublishedAction(locale:unknown,ids:unknown,published:unknown){const actor=await requirePermission('news','edit');await setNewsPublished(newsLocaleSchema.parse(locale),z.array(newsIdSchema).min(1).max(100).parse(ids),z.boolean().parse(published),actor);refresh();}
export async function setNewsPlacementAction(locale:unknown,id:unknown,placement:unknown,enabled:unknown){const actor=await requirePermission('news','edit');await setNewsPlacement(newsLocaleSchema.parse(locale),newsIdSchema.parse(id),z.enum(['hot','home']).parse(placement),z.boolean().parse(enabled),actor);refresh();}
export async function trashNewsAction(locale:unknown,id:unknown){const actor=await requirePermission('news','delete');await trashNews(newsLocaleSchema.parse(locale),newsIdSchema.parse(id),actor);refresh();}

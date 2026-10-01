'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { productIdSchema, productInputSchema, productLocaleSchema } from '../schemas/productInput';
import { saveProduct, setProductsFeatured, setProductsPublished, trashProduct } from './repository';
import { getCmsProductActivity, getCmsProductDetail } from './cms-queries';
import { getPostgresClient } from '@/server/db/postgres';
import { getLlmProvider } from '@/features/ai-operator/server/llm-provider';

const refresh = () => { revalidatePath('/cms/products'); revalidatePath('/products'); revalidatePath('/products/[slug]', 'page'); };

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

export interface TranslateAndCreateEnProductInput {
  sourceProductId?: string | number | null;
  name: string;
  code?: string;
  summary?: string;
  description?: string;
  feature_details?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keyword?: string;
  categoryIds?: number[];
  applicationIds?: number[];
  manufactoryId?: number | null;
  typeId?: number | null;
  image?: string;
  icon?: string;
  price?: string;
  tags?: string[];
  downloads?: Array<{ name: string; file: string; link: string }>;
  video?: string;
}

export async function translateAndCreateEnProductAction(input: TranslateAndCreateEnProductInput) {
  const actor = await requirePermission('products', 'create');
  const name = input.name?.trim();
  if (!name) {
    throw new Error('Vui lòng nhập tên sản phẩm trước khi dịch sang tiếng Anh.');
  }

  const fieldsToTranslate: Record<string, string> = { name };
  if (input.summary?.trim()) fieldsToTranslate.summary = input.summary.trim();
  if (input.description?.trim()) fieldsToTranslate.description = input.description.trim();
  if (input.feature_details?.trim()) fieldsToTranslate.feature_details = input.feature_details.trim();
  if (input.seo_title?.trim()) fieldsToTranslate.seo_title = input.seo_title.trim();
  if (input.seo_description?.trim()) fieldsToTranslate.seo_description = input.seo_description.trim();
  if (input.seo_keyword?.trim()) fieldsToTranslate.seo_keyword = input.seo_keyword.trim();

  const llm = getLlmProvider();
  const systemPrompt = `You are a professional technical translator for CIC Technology (a leading AEC & engineering software distributor).
Translate the provided key-value fields from Vietnamese into professional English.
CRITICAL RULES:
1. Preserve all HTML tags, classes, and attributes completely intact (e.g. <p>, <b>, <ul>, <li>, <h3>, <a>, <table>, <tr>, <td>).
2. Use precise software engineering and AEC terminology (e.g., Structural Analysis, Geotechnical, BIM, CAD, Licensing).
3. Return a JSON object with the exact same keys containing the translated values:
{
  "name": "...",
  "summary": "...",
  "description": "...",
  "feature_details": "...",
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

  const enName = String(translated.name || name).trim();
  const baseEnAlias = slugify(enName) || slugify(name);
  const sql = getPostgresClient();

  let existingEnId: number | null = null;
  if (input.sourceProductId) {
    const existingById = await sql.unsafe(
      `SELECT id FROM cic_products_en WHERE id = $1 LIMIT 1`,
      [Number(input.sourceProductId)]
    );
    if (existingById.length > 0) {
      existingEnId = Number(existingById[0].id);
    }
  }

  if (!existingEnId) {
    const existingByAlias = await sql.unsafe(
      `SELECT id FROM cic_products_en WHERE lower(btrim(alias)) = lower(btrim($1)) LIMIT 1`,
      [baseEnAlias]
    );
    if (existingByAlias.length > 0) {
      existingEnId = Number(existingByAlias[0].id);
    }
  }

  // Check alias collision with another product
  let finalEnAlias = baseEnAlias;
  const isTaken = await sql.unsafe(
    `SELECT id FROM cic_products_en WHERE lower(btrim(alias)) = lower(btrim($1)) AND ($2::int IS NULL OR id <> $2) LIMIT 1`,
    [finalEnAlias, existingEnId]
  );
  if (isTaken.length > 0) {
    finalEnAlias = `${baseEnAlias}-${Date.now().toString().slice(-4)}`;
  }

  // Ensure categoryIds is valid for EN
  let validCategoryIds = (input.categoryIds ?? []).map(Number).filter((n) => Number.isInteger(n) && n > 0);
  if (validCategoryIds.length === 0) {
    const defaultCats = await sql.unsafe(`SELECT id FROM cic_products_categories_en ORDER BY ordering, id LIMIT 1`);
    if (defaultCats.length > 0) {
      validCategoryIds = [Number(defaultCats[0].id)];
    }
  }

  const enPayload = {
    name: enName,
    alias: finalEnAlias,
    code: input.code || '',
    other_languages1: input.sourceProductId ? `/products/${slugify(name)}` : '',
    summary: String(translated.summary || input.summary || '').trim(),
    description: String(translated.description || input.description || '').trim(),
    feature_details: String(translated.feature_details || input.feature_details || '').trim(),
    video: input.video || '',
    tawk_to: '',
    image: input.image || '',
    icon: input.icon || '',
    price: input.price || 'Liên hệ',
    tags: Array.isArray(input.tags) ? input.tags : [],
    landing_page: '',
    seo_title: String(translated.seo_title || enName).trim(),
    seo_keyword: String(translated.seo_keyword || '').trim(),
    seo_description: String(translated.seo_description || translated.summary || input.summary || '').trim(),
    file_catalogue: '',
    file_price: '',
    link_catalogue: '',
    file_driver_name: '',
    file_driver: '',
    link_driver: '',
    downloads: Array.from({ length: 6 }, (_, index) => ({
      name: input.downloads?.[index]?.name || '',
      file: input.downloads?.[index]?.file || '',
      link: input.downloads?.[index]?.link || '',
    })),
    categoryIds: validCategoryIds,
    applicationIds: (input.applicationIds ?? []).map(Number).filter((n) => Number.isInteger(n) && n > 0),
    relatedProductIds: [],
    manufactoryId: input.manufactoryId ? Number(input.manufactoryId) : null,
    typeId: input.typeId ? Number(input.typeId) : null,
    published: false,
    is_hot: false,
    teamview: false,
    ordering: 0,
  };

  const parsedEnPayload = productInputSchema.parse(enPayload);
  const result = await saveProduct('en', existingEnId, parsedEnPayload, actor);

  // Link VI product's other_languages1 if source product exists
  if (input.sourceProductId) {
    await sql.unsafe(
      `UPDATE cic_products SET other_languages1 = $1 WHERE id = $2`,
      [`/en/products/${finalEnAlias}`, Number(input.sourceProductId)]
    );
  }

  refresh();

  return {
    success: true,
    enProductId: result.id,
    enAlias: finalEnAlias,
    enUrl: `/en/products/${finalEnAlias}`,
    enName,
  };
}

export async function saveProductAction(locale: unknown, id: unknown, payload: unknown) { const actor = await requirePermission('products', id ? 'edit' : 'create'); const result = await saveProduct(productLocaleSchema.parse(locale), id ? productIdSchema.parse(id) : null, productInputSchema.parse(payload), actor); refresh(); return result; }
export async function setProductsPublishedAction(locale: unknown, ids: unknown, published: unknown) { const actor = await requirePermission('products', 'edit'); await setProductsPublished(productLocaleSchema.parse(locale), z.array(productIdSchema).min(1).max(100).parse(ids), z.boolean().parse(published), actor); refresh(); }
export async function setProductsFeaturedAction(locale: unknown, ids: unknown, featured: unknown) { const actor = await requirePermission('products', 'edit'); await setProductsFeatured(productLocaleSchema.parse(locale), z.array(productIdSchema).min(1).max(100).parse(ids), z.boolean().parse(featured), actor); refresh(); }
export async function trashProductAction(locale: unknown, id: unknown) { const actor = await requirePermission('products', 'delete'); await trashProduct(productLocaleSchema.parse(locale), productIdSchema.parse(id), actor); refresh(); }
export async function getCmsProductDetailAction(locale: unknown, id: unknown) { await requirePermission('products', 'view'); return getCmsProductDetail(productLocaleSchema.parse(locale), productIdSchema.parse(id)); }
export async function getCmsProductActivityAction(locale: unknown, id: unknown) { await requirePermission('products', 'view'); return getCmsProductActivity(productLocaleSchema.parse(locale), productIdSchema.parse(id)); }

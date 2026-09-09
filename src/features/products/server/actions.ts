'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { productIdSchema, productInputSchema, productLocaleSchema } from '../schemas/productInput';
import { saveProduct, setProductsFeatured, setProductsPublished, trashProduct } from './repository';
const refresh = () => { revalidatePath('/cms/products'); revalidatePath('/products'); revalidatePath('/products/[slug]', 'page'); };
export async function saveProductAction(locale: unknown, id: unknown, payload: unknown) { const actor = await requirePermission('products', id ? 'edit' : 'create'); const result = await saveProduct(productLocaleSchema.parse(locale), id ? productIdSchema.parse(id) : null, productInputSchema.parse(payload), actor); refresh(); return result; }
export async function setProductsPublishedAction(locale: unknown, ids: unknown, published: unknown) { const actor = await requirePermission('products', 'edit'); await setProductsPublished(productLocaleSchema.parse(locale), z.array(productIdSchema).min(1).max(100).parse(ids), z.boolean().parse(published), actor); refresh(); }
export async function setProductsFeaturedAction(locale: unknown, ids: unknown, featured: unknown) { const actor = await requirePermission('products', 'edit'); await setProductsFeatured(productLocaleSchema.parse(locale), z.array(productIdSchema).min(1).max(100).parse(ids), z.boolean().parse(featured), actor); refresh(); }
export async function trashProductAction(locale: unknown, id: unknown) { const actor = await requirePermission('products', 'delete'); await trashProduct(productLocaleSchema.parse(locale), productIdSchema.parse(id), actor); refresh(); }

'use server';

import { revalidatePath } from 'next/cache';
import { requireStaticPagesPermission } from '../permissions';
import {
  savePageDraftRecord,
  publishPageRecord,
  createLegalPageRecord,
  getCmsPageDetail,
} from './repository';
import type { CreateLegalPageInput, SaveDraftInput } from '../types';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Saves draft changes for a page.
 * Requires `static_pages.edit` permission.
 */
export async function savePageDraftAction(
  pageId: number,
  payload: SaveDraftInput
): Promise<ActionResult<{ revisionId: string; versionNumber: number }>> {
  try {
    const actor = await requireStaticPagesPermission('edit');
    const result = await savePageDraftRecord(pageId, payload, actor);
    revalidatePath('/cms/static-pages');
    return { success: true, data: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể lưu bản nháp.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Publishes the current draft revision.
 * Requires `static_pages.publish` permission.
 */
export async function publishPageAction(
  pageId: number
): Promise<ActionResult<{ revisionId: string; versionNumber: number; slug: string }>> {
  try {
    const actor = await requireStaticPagesPermission('publish');
    const result = await publishPageRecord(pageId, actor);

    // Revalidate CMS and public website paths
    revalidatePath('/cms/static-pages');
    if (result.slug) {
      revalidatePath(result.slug);
      if (result.slug === '/') {
        revalidatePath('/', 'page');
      }
    }
    return { success: true, data: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể xuất bản trang.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Creates a new custom legal page.
 * Requires `static_pages.create_legal` permission.
 */
export async function createLegalPageAction(
  input: CreateLegalPageInput
): Promise<ActionResult<{ id: string; code: string; slug: string }>> {
  try {
    const actor = await requireStaticPagesPermission('create_legal');
    const result = await createLegalPageRecord(input, actor);
    revalidatePath('/cms/static-pages');
    return { success: true, data: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Không thể tạo trang pháp lý.';
    return { success: false, error: message };
  }
}

/**
 * Server Action: Fetches full page detail for editing in CMS.
 * Requires `static_pages.view` permission.
 */
export async function getCmsPageDetailAction(pageId: number | string) {
  try {
    await requireStaticPagesPermission('view');
    const page = await getCmsPageDetail(pageId);
    if (!page) return { success: false, error: 'Không tìm thấy trang.' };
    return { success: true, data: page };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải chi tiết trang.';
    return { success: false, error: message };
  }
}

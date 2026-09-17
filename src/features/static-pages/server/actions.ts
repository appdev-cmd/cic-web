'use server';

import { revalidatePath } from 'next/cache';
import { requireStaticPagesPermission } from '../permissions';
import {
  savePageDraftRecord,
  publishPageRecord,
  createLegalPageRecord,
  getCmsPageDetail,
} from './repository';
import { getPostgresClient } from '@/server/db/postgres';
import type { PageBuilderEntityOption } from '@/cms/modules/static_pages/pageBuilderTypes';
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
      if (result.slug.startsWith('/gioi-thieu') || result.slug.startsWith('/about')) {
        revalidatePath('/gioi-thieu');
        revalidatePath('/gioi-thieu/co-cau-to-chuc');
        revalidatePath('/gioi-thieu/nang-luc-kinh-nghiem');
        revalidatePath('/about');
        revalidatePath('/about/organization');
        revalidatePath('/about/capacity-experience');
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

/**
 * Server Action: Fetches real entities from database for Page Builder reference picking.
 */
export async function getPageBuilderEntityOptionsAction(
  _workspace: 'vi' | 'en' = 'vi'
): Promise<ActionResult<PageBuilderEntityOption[]>> {
  try {
    const sql = getPostgresClient();
    const options: PageBuilderEntityOption[] = [];

    // 1. Projects
    try {
      const projectRows = await sql`
        SELECT id, title, tagline, solution, sector, image, location, is_featured, customer_name, technologies
        FROM cic_projects
        WHERE published = true
        ORDER BY is_featured DESC, ordering, id
        LIMIT 30
      `;
      projectRows.forEach((p) => {
        options.push({
          id: String(p.id),
          label: p.title || `Dự án #${p.id}`,
          description: `Dự án · ${p.solution || p.sector || 'Kỹ thuật'}${p.is_featured ? ' · Nổi bật' : ''}`,
          entityType: 'project',
          status: 'published',
          meta: {
            image: p.image || undefined,
            location: p.location || undefined,
            category: p.solution || p.sector || 'Dự án',
            summary: p.tagline || undefined,
            client: p.customer_name || undefined,
            tags: Array.isArray(p.technologies) ? p.technologies : undefined,
            isFeatured: Boolean(p.is_featured),
          },
        });
      });
    } catch (err) {
      console.error('Error fetching projects for page builder:', err);
    }

    // 2. Events
    try {
      const eventRows = await sql`
        SELECT id, title, time_event, specific_time, place, image, summary, is_hot, show_in_homepage, link_dangky
        FROM cic_event
        WHERE published = true
        ORDER BY is_hot DESC, show_in_homepage DESC, coalesce(time_event, created_time) DESC
        LIMIT 30
      `;
      eventRows.forEach((e) => {
        options.push({
          id: String(e.id),
          label: e.title || `Sự kiện #${e.id}`,
          description: `Sự kiện · ${e.place || 'Hội thảo'}${e.is_hot ? ' · Nổi bật' : ''}`,
          entityType: 'event',
          status: 'published',
          meta: {
            image: e.image || undefined,
            location: e.place || undefined,
            date: e.time_event ? String(e.time_event) : undefined,
            time: e.specific_time || undefined,
            summary: e.summary || undefined,
            ctaUrl: e.link_dangky || undefined,
            isFeatured: Boolean(e.is_hot || e.show_in_homepage),
          },
        });
      });
    } catch (err) {
      console.error('Error fetching events for page builder:', err);
    }

    // 3. News
    try {
      const newsRows = await sql`
        SELECT id, title, category_name, start_time, created_time, image, summary, is_hot, show_in_homepage
        FROM cic_news
        WHERE published = true
        ORDER BY is_hot DESC, show_in_homepage DESC, coalesce(start_time, created_time) DESC
        LIMIT 30
      `;
      newsRows.forEach((n) => {
        options.push({
          id: String(n.id),
          label: n.title || `Tin tức #${n.id}`,
          description: `Tin tức · ${n.category_name || 'Bài viết'}${n.is_hot ? ' · Nổi bật' : ''}`,
          entityType: 'news',
          status: 'published',
          meta: {
            image: n.image || undefined,
            category: n.category_name || undefined,
            summary: n.summary || undefined,
            date: n.start_time || n.created_time ? String(n.start_time || n.created_time) : undefined,
            isFeatured: Boolean(n.is_hot || n.show_in_homepage),
          },
        });
      });
    } catch (err) {
      console.error('Error fetching news for page builder:', err);
    }

    // 4. Services
    try {
      const serviceRows = await sql`
        SELECT id, title, alias, summary, show_in_homepage
        FROM cic_services
        WHERE published = 1
        ORDER BY show_in_homepage DESC, id ASC
        LIMIT 30
      `;
      serviceRows.forEach((s) => {
        options.push({
          id: String(s.id),
          label: s.title || `Dịch vụ #${s.id}`,
          description: `Dịch vụ · ${s.alias || 'Chuyên sâu'}`,
          entityType: 'service',
          status: 'published',
          meta: {
            summary: s.summary || undefined,
            isFeatured: s.show_in_homepage === 1,
          },
        });
      });
    } catch (err) {
      console.error('Error fetching services for page builder:', err);
    }

    // 5. Partners
    try {
      const partnerRows = await sql`
        SELECT id, name, alias, image, show_in_homepage
        FROM cic_manufactories
        WHERE published = true
        ORDER BY show_in_homepage DESC, id ASC
        LIMIT 30
      `;
      partnerRows.forEach((m) => {
        options.push({
          id: String(m.id),
          label: m.name || `Đối tác #${m.id}`,
          description: `Đối tác · ${m.alias || 'Công nghệ'}`,
          entityType: 'partner',
          status: 'published',
          meta: {
            image: m.image || undefined,
            isFeatured: Boolean(m.show_in_homepage),
          },
        });
      });
    } catch (err) {
      console.error('Error fetching partners for page builder:', err);
    }

    return { success: true, data: options };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi tải danh sách thực thể.';
    return { success: false, error: message };
  }
}


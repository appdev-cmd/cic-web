import 'server-only';
import {
  listCmsPages,
  getCmsPageDetail,
  getPublicPublishedPage,
} from './repository';
import type { CmsStaticPageListItem, StaticPageFullDetail, StaticPagePublicResult, StaticPageRevisionDetail } from '../types';

/**
 * Loads the list of static pages for CMS workspace with explicit projection.
 */
export async function getCmsStaticPagesList(
  workspace: 'vi' | 'en' = 'vi'
): Promise<CmsStaticPageListItem[]> {
  return listCmsPages(workspace);
}

/**
 * Loads the full detail of a page (page + draft + published + history) for CMS editing.
 */
export async function getCmsStaticPageDetail(
  pageId: string | number
): Promise<StaticPageFullDetail | null> {
  return getCmsPageDetail(pageId);
}

/**
 * Public website query: loads strictly the published revision.
 * Returns null if not published or not found.
 */
export async function getPublicStaticPage(
  workspace: 'vi' | 'en' = 'vi',
  codeOrSlug: string
): Promise<StaticPagePublicResult | null> {
  return getPublicPublishedPage(workspace, codeOrSlug);
}

/**
 * Backward-compatible helper.
 */
export async function getStaticPagesData(locale: 'vi' | 'en' = 'vi') {
  return listCmsPages(locale);
}

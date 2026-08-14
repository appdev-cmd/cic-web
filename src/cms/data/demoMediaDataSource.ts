import type { CmsLocale } from './CmsDataSource';
import type { MediaDataSource, MediaModuleData } from './MediaDataSource';
import type { CmsMediaPickerItem } from './MediaPickerDataSource';
import { INITIAL_ASSETS, MOCK_ALBUMS, MOCK_FOLDERS, MOCK_ISSUES } from '../modules/media/mockData';

const viMediaData: MediaModuleData = {
  assets: INITIAL_ASSETS.map(({ alt_text, caption, ...asset }) => ({
    ...asset,
    alt_text: alt_text.vi,
    caption: caption?.vi,
  })),
  albums: MOCK_ALBUMS,
  folders: MOCK_FOLDERS,
  issues: MOCK_ISSUES,
  currentUserName: 'Nguyễn Văn Minh',
};

export const demoMediaDataSource: MediaDataSource = {
  mediaByLocale: {
    vi: viMediaData,
  },
};

const emptyMediaData = (): MediaModuleData => ({ assets: [], albums: [], folders: [], issues: [] });

/** Current React mock boundary. Workspaces never fall back to another locale. */
export const getDemoMediaModuleData = (locale: CmsLocale): MediaModuleData =>
  demoMediaDataSource.mediaByLocale[locale] ?? emptyMediaData();

/** Shared picker projection; later replace with a published/ready server-side media query. */
export const getDemoMediaPickerItems = (locale: CmsLocale): CmsMediaPickerItem[] =>
  getDemoMediaModuleData(locale).assets
    .filter((asset) => asset.type === 'image' && asset.workflow_status === 'ready')
    .map(({ id, filename, title, url, thumbnail_url }) => ({ id, filename, title, url, thumbnail_url }));

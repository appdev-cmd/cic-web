import type { MediaAlbum, MediaAsset, MediaFolder, MediaIssue } from '../modules/media/types';
import type { CmsLocale } from './CmsDataSource';

export interface MediaModuleData {
  assets: MediaAsset[];
  albums: MediaAlbum[];
  folders: MediaFolder[];
  issues: MediaIssue[];
  currentUserName?: string;
}

export interface MediaDataSource {
  mediaByLocale: Partial<Record<CmsLocale, MediaModuleData>>;
}

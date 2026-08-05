import type { MediaAlbum, MediaAsset, MediaFolder, MediaIssue } from '../modules/media/types';

/** Binary assets are shared; localized metadata is edited in an explicit workspace locale. */
export interface MediaModuleData {
  assets: MediaAsset[];
  albums: MediaAlbum[];
  folders: MediaFolder[];
  issues: MediaIssue[];
  currentUserName?: string;
}

export interface MediaDataSource {
  sharedLibrary: MediaModuleData;
}

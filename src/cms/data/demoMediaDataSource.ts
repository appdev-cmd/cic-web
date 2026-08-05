import type { MediaDataSource } from './MediaDataSource';
import { INITIAL_ASSETS, MOCK_ALBUMS, MOCK_FOLDERS, MOCK_ISSUES } from '../modules/media/mockData';

export const demoMediaDataSource: MediaDataSource = {
  sharedLibrary: {
    assets: INITIAL_ASSETS,
    albums: MOCK_ALBUMS,
    folders: MOCK_FOLDERS,
    issues: MOCK_ISSUES,
    currentUserName: 'Nguyễn Văn Minh',
  },
};

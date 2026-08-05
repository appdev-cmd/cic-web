import type { MediaDataSource } from './MediaDataSource';
import { INITIAL_ASSETS, MOCK_ALBUMS, MOCK_FOLDERS, MOCK_ISSUES } from '../modules/media/mockData';

export const demoMediaDataSource: MediaDataSource = {
  mediaByLocale: {
    vi: {
      assets: INITIAL_ASSETS.map(({ alt_text, caption, ...asset }) => ({
        ...asset,
        alt_text: alt_text.vi,
        caption: caption?.vi,
      })),
      albums: MOCK_ALBUMS,
      folders: MOCK_FOLDERS,
      issues: MOCK_ISSUES,
      currentUserName: 'Nguyễn Văn Minh',
    },
  },
};

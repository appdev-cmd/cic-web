import type { PresentationDataSource } from './PresentationDataSource';
import { mockMenuGroups, mockMenuItems } from '../modules/menu/mockData';

export const demoPresentationDataSource: PresentationDataSource = {
  menuByLocale: {
    vi: {
      groups: mockMenuGroups,
      items: mockMenuItems,
    },
  },
};

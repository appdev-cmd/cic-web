import React from 'react';
import type { CmsLocale } from '../../data/CmsDataSource';
import { NewsManager } from './NewsManager';
import { getCmsNewsData } from './newsData';

export const NewsModulePage: React.FC<{ workspaceLocale: CmsLocale }> = ({ workspaceLocale }) => {
  return <NewsManager data={getCmsNewsData(workspaceLocale)} />;
};

export default NewsModulePage;

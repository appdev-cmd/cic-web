import React from 'react';
import type { CmsLocale } from '../../data/CmsDataSource';

export const NewsModulePage: React.FC<{ workspaceLocale: CmsLocale }> = () => {
  return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">Tin tức cần được tải qua CMS server route đã xác thực.</div>;
};

export default NewsModulePage;

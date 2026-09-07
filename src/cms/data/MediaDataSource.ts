import type { CmsLocale } from './CmsDataSource';
import type { MediaModuleData } from '@/features/media/types';

export type { MediaModuleData } from '@/features/media/types';

export interface MediaDataSource {
  mediaByLocale: Partial<Record<CmsLocale, MediaModuleData>>;
}

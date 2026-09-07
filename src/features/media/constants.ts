export const MEDIA_BUCKET = 'cms-media' as const;
export const MEDIA_TYPES = ['image', 'video', 'document'] as const;
export const MEDIA_WORKFLOW_STATUSES = ['processing', 'ready', 'restricted', 'archived'] as const;
export const MEDIA_LICENSE_TYPES = ['internal', 'purchased', 'cc_by', 'editorial'] as const;
export const MEDIA_LOCALES = ['vi', 'en'] as const;
export const MEDIA_MAX_FILE_BYTES = 100 * 1024 * 1024;

export type MediaLocale = (typeof MEDIA_LOCALES)[number];
export type MediaType = (typeof MEDIA_TYPES)[number];

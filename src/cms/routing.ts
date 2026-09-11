export type CmsModuleKey =
  | 'dashboard'
  | 'search'
  | 'users'
  | 'permissions'
  | 'settings'
  | 'function_seo'
  | 'activity_logs'
  | 'trash'
  | 'static_pages'
  | 'news'
  | 'events'
  | 'projects'
  | 'email_templates'
  | 'product_settings'
  | 'products'
  | 'services'
  | 'menu'
  | 'media'
  | 'contacts'
  | 'localization'
  | 'cta'
  | 'forms'
  | 'customer_requests'
  | 'not_found';

interface CmsRouteDefinition {
  module: Exclude<CmsModuleKey, 'not_found'>;
  canonicalPath: string;
  aliases?: string[];
  nestedPrefixes?: string[];
}

export const CMS_ROUTES: CmsRouteDefinition[] = [
  { module: 'dashboard', canonicalPath: '/cms/dashboard', aliases: ['/cms'] },
  { module: 'search', canonicalPath: '/cms/search', aliases: ['/cms/global-search'], nestedPrefixes: ['/cms/search/'] },
  {
    module: 'users',
    canonicalPath: '/cms/users',
    aliases: ['/cms/accounts', '/cms/user-management'],
    nestedPrefixes: ['/cms/users/'],
  },
  { module: 'permissions', canonicalPath: '/cms/permissions', nestedPrefixes: ['/cms/permissions/'] },
  {
    module: 'settings',
    canonicalPath: '/cms/settings',
    aliases: ['/cms/system-settings'],
    nestedPrefixes: ['/cms/settings/'],
  },
  { module: 'function_seo', canonicalPath: '/cms/function-seo', aliases: ['/cms/seo-modules'], nestedPrefixes: ['/cms/function-seo/'] },
  {
    module: 'activity_logs',
    canonicalPath: '/cms/activity-logs',
    aliases: ['/cms/history', '/cms/logs', '/cms/audit'],
    nestedPrefixes: ['/cms/activity-logs/'],
  },
  { module: 'trash', canonicalPath: '/cms/trash', aliases: ['/cms/recycle-bin'], nestedPrefixes: ['/cms/trash/'] },
  { module: 'static_pages', canonicalPath: '/cms/static-pages', aliases: ['/cms/pages'], nestedPrefixes: ['/cms/static-pages/'] },
  { module: 'news', canonicalPath: '/cms/news', aliases: ['/cms/articles'], nestedPrefixes: ['/cms/news/'] },
  { module: 'events', canonicalPath: '/cms/events', nestedPrefixes: ['/cms/events/'] },
  { module: 'projects', canonicalPath: '/cms/projects', nestedPrefixes: ['/cms/projects/'] },
  { module: 'email_templates', canonicalPath: '/cms/email-templates', nestedPrefixes: ['/cms/email-templates/'] },
  {
    module: 'product_settings',
    canonicalPath: '/cms/product-settings',
    aliases: [
      '/cms/products/settings',
      '/cms/product-categories',
      '/cms/manufacturers',
      '/cms/applications',
      '/cms/product-types',
      '/cms/sales-staff',
      '/cms/products/categories',
      '/cms/products/brands',
      '/cms/products/routing',
    ],
    nestedPrefixes: ['/cms/product-settings/'],
  },
  {
    module: 'products',
    canonicalPath: '/cms/products',
    aliases: ['/cms/products/catalog', '/cms/catalog'],
    nestedPrefixes: ['/cms/products/'],
  },
  { module: 'services', canonicalPath: '/cms/services', nestedPrefixes: ['/cms/services/'] },
  {
    module: 'menu',
    canonicalPath: '/cms/frontend-menus',
    aliases: ['/cms/menu', '/cms/navigation'],
    nestedPrefixes: ['/cms/frontend-menus/', '/cms/menu/'],
  },
  {
    module: 'media',
    canonicalPath: '/cms/media',
    aliases: ['/cms/media-library', '/cms/albums'],
    nestedPrefixes: ['/cms/media/'],
  },
  {
    module: 'contacts',
    canonicalPath: '/cms/contact-requests',
    aliases: ['/cms/contact-messages', '/cms/product-registrations', '/cms/contacts', '/cms/customers'],
    nestedPrefixes: ['/cms/contact-requests/', '/cms/contact-messages/', '/cms/contacts/'],
  },
  {
    module: 'localization',
    canonicalPath: '/cms/translation-strings',
    aliases: ['/cms/translation-progress', '/cms/localization', '/cms/translations'],
    nestedPrefixes: ['/cms/translation-strings/', '/cms/translation-progress/', '/cms/localization/'],
  },
  {
    module: 'cta',
    canonicalPath: '/cms/cta',
    nestedPrefixes: ['/cms/cta/'],
  },
  {
    module: 'forms',
    canonicalPath: '/cms/forms',
    nestedPrefixes: ['/cms/forms/'],
  },
  {
    module: 'customer_requests',
    canonicalPath: '/cms/customer-requests',
    aliases: ['/cms/requests'],
    nestedPrefixes: ['/cms/customer-requests/', '/cms/customer-requests/detail/', '/cms/requests/', '/cms/requests/detail/'],
  },
];

export function resolveCmsModule(path: string): CmsModuleKey {
  const normalizedPath = path.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';

  const match = CMS_ROUTES.find((route) => {
    if (normalizedPath === route.canonicalPath) return true;
    if (route.aliases?.includes(normalizedPath)) return true;
    return route.nestedPrefixes?.some((prefix) => normalizedPath.startsWith(prefix));
  });

  return match?.module ?? 'not_found';
}

const normalizeCmsPath = (path: string) =>
  path.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';

export function isProductCategoryCmsPath(path: string): boolean {
  const normalizedPath = normalizeCmsPath(path);
  return normalizedPath === '/cms/product-categories' ||
    normalizedPath === '/cms/products/categories' ||
    normalizedPath === '/cms/product-settings/categories' ||
    normalizedPath.startsWith('/cms/product-settings/categories/');
}

export function isProductBrandCmsPath(path: string): boolean {
  const normalizedPath = normalizeCmsPath(path);
  return normalizedPath === '/cms/manufacturers' ||
    normalizedPath === '/cms/products/brands' ||
    normalizedPath === '/cms/product-settings/brands' ||
    normalizedPath.startsWith('/cms/product-settings/brands/');
}

export function isProductApplicationCmsPath(path: string): boolean {
  const normalizedPath = normalizeCmsPath(path);
  return normalizedPath === '/cms/applications' ||
    normalizedPath === '/cms/product-settings/applications' ||
    normalizedPath.startsWith('/cms/product-settings/applications/');
}

export function isProductTypeCmsPath(path: string): boolean {
  const normalizedPath = normalizeCmsPath(path);
  return normalizedPath === '/cms/product-types' ||
    normalizedPath === '/cms/product-settings/product-types' ||
    normalizedPath.startsWith('/cms/product-settings/product-types/');
}

export function isSalesOwnerCmsPath(path: string): boolean {
  const normalizedPath = normalizeCmsPath(path);
  return normalizedPath === '/cms/sales-staff' ||
    normalizedPath === '/cms/product-settings/sales-staff' ||
    normalizedPath.startsWith('/cms/product-settings/sales-staff/');
}

export function isNewsCategoryCmsPath(path: string): boolean {
  const normalizedPath = normalizeCmsPath(path);
  return normalizedPath === '/cms/news/categories' || normalizedPath.startsWith('/cms/news/categories/');
}

export function isEmailTemplatesCmsPath(path: string): boolean {
  const normalizedPath = normalizeCmsPath(path);
  return (
    normalizedPath === '/cms/email-templates' ||
    normalizedPath === '/cms/email_templates' ||
    normalizedPath.startsWith('/cms/email-templates/') ||
    normalizedPath.startsWith('/cms/email_templates/')
  );
}

export function getCanonicalCmsPath(module: Exclude<CmsModuleKey, 'not_found'>): string {
  return CMS_ROUTES.find((route) => route.module === module)?.canonicalPath ?? '/cms/dashboard';
}

const CMS_PERMISSION_MODULE_OVERRIDES: Partial<Record<CmsModuleKey, readonly string[]>> = {
  permissions: ['roles', 'permissions'],
  settings: ['settings', 'config'],
  activity_logs: ['audit'],
};

export function getCmsPermissionModuleKeys(module: CmsModuleKey): readonly string[] {
  if (module === 'dashboard') return [];
  return CMS_PERMISSION_MODULE_OVERRIDES[module] ?? [module];
}

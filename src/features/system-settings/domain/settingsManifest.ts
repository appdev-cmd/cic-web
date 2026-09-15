export const SETTINGS_SCOPES = ['vi', 'en', 'enjicad'] as const;

export type SettingsScope = (typeof SETTINGS_SCOPES)[number];
export type SettingsSourceTable = 'cic_config' | 'cic_config_en' | 'cic_config_enjicad';
export type SettingsValueType = 'text' | 'textarea' | 'email' | 'phone' | 'url' | 'image' | 'tracking_id' | 'html';
export type SettingsValidation = Readonly<{
  kind: SettingsValueType;
  maxLength: number;
  allowEmpty: boolean;
}>;

export type ApprovedSettingDefinition = Readonly<{
  key: string;
  owner: 'system_settings';
  scopes: readonly SettingsScope[];
  sourceTables: readonly SettingsSourceTable[];
  type: SettingsValueType;
  editable: true;
  publicReadable: boolean;
  validation: SettingsValidation;
  group: 'branding' | 'seo' | 'company' | 'footer_social' | 'measurement';
  ordering: number;
  sensitive: boolean;
}>;

const ALL_SCOPES = SETTINGS_SCOPES;
const ALL_TABLES = ['cic_config', 'cic_config_en', 'cic_config_enjicad'] as const;

const setting = (
  key: string,
  group: ApprovedSettingDefinition['group'],
  ordering: number,
  type: SettingsValueType,
  publicReadable: boolean,
  options: Partial<Pick<ApprovedSettingDefinition, 'scopes' | 'sourceTables' | 'sensitive'>> = {},
): ApprovedSettingDefinition => ({
  key,
  owner: 'system_settings',
  scopes: options.scopes ?? ALL_SCOPES,
  sourceTables: options.sourceTables ?? ALL_TABLES,
  type,
  editable: true,
  publicReadable,
  validation: {
    kind: type,
    maxLength: type === 'image' || type === 'url' || type === 'textarea' || type === 'html' ? 50_000 : 500,
    allowEmpty: true,
  },
  group,
  ordering,
  sensitive: options.sensitive ?? false,
});

/**
 * Authoritative allowlist for values owned by System Settings.
 * Credentials and secrets are intentionally impossible to describe here.
 */
export const APPROVED_SETTINGS_MANIFEST = [
  // 1. Thương hiệu (Branding)
  setting('site_name', 'branding', 10, 'text', true),
  setting('main_title', 'branding', 20, 'text', true),
  setting('logo', 'branding', 30, 'image', true),
  setting('logo_white', 'branding', 40, 'image', true),
  setting('favicon', 'branding', 50, 'image', true),

  // 2. SEO mặc định (SEO)
  setting('title', 'seo', 60, 'text', true),
  setting('meta_des', 'seo', 70, 'textarea', true),
  setting('meta_key', 'seo', 80, 'text', true),
  setting('og_image', 'seo', 90, 'image', true),
  setting('robots_txt', 'seo', 100, 'textarea', true, { sensitive: true }),

  // 3. Doanh nghiệp & liên hệ (Company & Contact)
  setting('legal_name', 'company', 110, 'text', true),
  setting('tax_id', 'company', 120, 'text', true),
  setting('tel', 'company', 130, 'phone', true),
  setting('tel2', 'company', 140, 'phone', true),
  setting('admin_name', 'company', 150, 'text', false),
  setting('admin_email', 'company', 160, 'email', true),
  setting('public_email', 'company', 170, 'email', true),
  setting('domain', 'company', 180, 'url', true),
  setting('address', 'company', 190, 'text', true),

  // 4. Footer & mạng xã hội (Footer & Social)
  setting('footer_bottom', 'footer_social', 200, 'html', true),
  setting('zalo_url', 'footer_social', 210, 'url', true),
  setting('facebook', 'footer_social', 220, 'url', true),
  setting('linkedin_url', 'footer_social', 230, 'url', true),
  setting('youtube', 'footer_social', 240, 'url', true),
  setting('twitter', 'footer_social', 250, 'url', true),
  setting('bct_badge_url', 'footer_social', 260, 'url', true),

  // 5. Đo lường & tiếp thị (Measurement & Marketing)
  setting('google_analytics', 'measurement', 270, 'tracking_id', true),
  setting('gtm_id', 'measurement', 280, 'tracking_id', true),
  setting('google_ads_id', 'measurement', 290, 'tracking_id', true),
  setting('meta_pixel_id', 'measurement', 300, 'tracking_id', true),
  setting('teamview', 'measurement', 310, 'url', true),
] as const satisfies readonly ApprovedSettingDefinition[];

export const APPROVED_SETTINGS_BY_KEY = new Map(
  APPROVED_SETTINGS_MANIFEST.map((definition) => [definition.key, definition]),
);

export const OTHER_MODULE_OWNED_SETTINGS = {
  page_builder: ['info_404', 'footer', 'intro', 'intro_link', 'video', 'image_content', 'banner_new', 'image_home'],
  products: ['product_bundle_banner', 'product_full_width_banner', 'discount'],
  email_templates: ['mail_order_subject', 'mail_order_body'],
  enjicad_content: ['summary', 'img_summary', 'title_contents'],
} as const;

export const OTHER_MODULE_OWNED_PREFIXES = [
  'icon_content',
  'title_content',
  'summary_content',
  'version1_',
  'version2_',
  'version3_',
] as const;

export const LEGACY_PRESERVE_ONLY_SETTINGS = ['slogan', 'google', 'tawk_to'] as const;

/** Credentials matching these names are ENV-only and never enter the CMS manifest. */
export const SECRET_ENV_ONLY_NAME_PATTERN = /(?:api[_-]?key|token|password|secret|credential|smtp)/i;

export function isApprovedSettingsKey(key: string): boolean {
  return APPROVED_SETTINGS_BY_KEY.has(key.trim().toLowerCase());
}

export function isSecretEnvOnlyKey(key: string): boolean {
  return SECRET_ENV_ONLY_NAME_PATTERN.test(key.trim());
}


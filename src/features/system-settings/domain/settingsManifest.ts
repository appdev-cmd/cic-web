export const SETTINGS_SCOPES = ['vi', 'en', 'enjicad'] as const;

export type SettingsScope = (typeof SETTINGS_SCOPES)[number];
export type SettingsSourceTable = 'cic_config' | 'cic_config_en' | 'cic_config_enjicad';
export type SettingsValueType = 'text' | 'email' | 'phone' | 'url' | 'image' | 'tracking_id';
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
  group: 'identity' | 'contact' | 'branding' | 'social' | 'support' | 'measurement';
  ordering: number;
  sensitive: false;
}>;

const ALL_SCOPES = SETTINGS_SCOPES;
const ALL_TABLES = ['cic_config', 'cic_config_en', 'cic_config_enjicad'] as const;

const setting = (
  key: string,
  group: ApprovedSettingDefinition['group'],
  ordering: number,
  type: SettingsValueType,
  publicReadable: boolean,
  options: Partial<Pick<ApprovedSettingDefinition, 'scopes' | 'sourceTables'>> = {},
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
    maxLength: type === 'image' || type === 'url' ? 2_000 : 500,
    allowEmpty: true,
  },
  group,
  ordering,
  sensitive: false,
});

/**
 * Authoritative allowlist for values owned by System Settings.
 * Credentials and secrets are intentionally impossible to describe here.
 */
export const APPROVED_SETTINGS_MANIFEST = [
  setting('site_name', 'identity', 10, 'text', true),
  setting('domain', 'identity', 20, 'url', true, {
    scopes: ['enjicad'],
    sourceTables: ['cic_config_enjicad'],
  }),
  setting('admin_name', 'contact', 30, 'text', false),
  setting('admin_email', 'contact', 40, 'email', true),
  setting('tel', 'contact', 50, 'phone', true),
  setting('tel2', 'contact', 60, 'phone', true),
  setting('logo', 'branding', 70, 'image', true),
  setting('logo_white', 'branding', 80, 'image', true),
  setting('facebook', 'social', 90, 'url', true),
  setting('twitter', 'social', 100, 'url', true),
  setting('youtube', 'social', 110, 'url', true),
  setting('teamview', 'support', 120, 'url', true),
  setting('google_analytics', 'measurement', 130, 'tracking_id', true),
] as const satisfies readonly ApprovedSettingDefinition[];

export const APPROVED_SETTINGS_BY_KEY = new Map(
  APPROVED_SETTINGS_MANIFEST.map((definition) => [definition.key, definition]),
);

export const OTHER_MODULE_OWNED_SETTINGS = {
  function_seo: ['title', 'meta_des', 'meta_key', 'main_title', 'main_meta_key', 'main_meta_des'],
  page_builder: ['info_404', 'footer', 'footer_bottom', 'fotter_bottom', 'intro', 'intro_link', 'video', 'image_content', 'banner_new', 'image_home'],
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

export const LEGACY_PRESERVE_ONLY_SETTINGS = ['address', 'slogan', 'google', 'tawk_to'] as const;

/** Credentials matching these names are ENV-only and never enter the CMS manifest. */
export const SECRET_ENV_ONLY_NAME_PATTERN = /(?:api[_-]?key|token|password|secret|credential|smtp)/i;

export function isApprovedSettingsKey(key: string): boolean {
  return APPROVED_SETTINGS_BY_KEY.has(key.trim().toLowerCase());
}

export function isSecretEnvOnlyKey(key: string): boolean {
  return SECRET_ENV_ONLY_NAME_PATTERN.test(key.trim());
}

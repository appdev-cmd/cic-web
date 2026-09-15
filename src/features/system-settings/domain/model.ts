import type { SettingsScope, SettingsValueType } from './settingsManifest';

export type CmsSettingsScopeId = 'site_cic' | 'site_english' | 'site_enjicad';
export type CmsSettingsScope = Readonly<{ id: CmsSettingsScopeId; locale: SettingsScope; name: string; domain: string }>;
export type CmsSettingItem = Readonly<{ key: string; label: string; description: string; group: 'identity' | 'contact' | 'branding' | 'social' | 'support' | 'measurement'; type: SettingsValueType; value: string; publicReadable: boolean; maxLength: number }>;
export type CmsBranch = Readonly<{ id: string; code: string; name: string; address: string; phone: string; email: string; fax: string; workingHours: string; mapEmbedUrl: string; mapSearchQuery: string; isHeadOffice: boolean; published: boolean; ordering: number }>;
export type CmsSettingsWorkspace = Readonly<{ scope: CmsSettingsScope; settings: readonly CmsSettingItem[]; branches: readonly CmsBranch[] }>;
export type CmsSettingsData = Readonly<{ workspaces: readonly CmsSettingsWorkspace[] }>;
export type PublicSystemSettings = Readonly<{ values: Readonly<Record<string, string>>; branches: readonly CmsBranch[] }>;

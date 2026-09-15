import { z } from 'zod';
import { APPROVED_SETTINGS_BY_KEY } from '../domain/settingsManifest';

export const scopeSchema = z.enum(['site_cic', 'site_english', 'site_enjicad']);
export const settingChangeSchema = z.object({ scopeId: scopeSchema, key: z.string().trim().toLowerCase().min(1).max(100), value: z.string().max(2_000) }).superRefine((change, context) => {
  const definition = APPROVED_SETTINGS_BY_KEY.get(change.key);
  const scope = change.scopeId === 'site_cic' ? 'vi' : change.scopeId === 'site_english' ? 'en' : 'enjicad';
  if (!definition || !definition.scopes.includes(scope)) return context.addIssue({ code: 'custom', path: ['key'], message: 'Cấu hình không thuộc danh sách được phép.' });
  if (change.value.length > definition.validation.maxLength) context.addIssue({ code: 'custom', path: ['value'], message: `Giá trị tối đa ${definition.validation.maxLength} ký tự.` });
  if (definition.type === 'email' && change.value && !z.string().email().safeParse(change.value).success) context.addIssue({ code: 'custom', path: ['value'], message: 'Email không hợp lệ.' });
  if (definition.type === 'url' && change.value && !z.string().url().safeParse(change.value).success) context.addIssue({ code: 'custom', path: ['value'], message: 'URL không hợp lệ.' });
});
export const branchSchema = z.object({ id: z.string().trim().max(100), code: z.string().trim().min(1).max(100).regex(/^[a-z0-9_-]+$/i), name: z.string().trim().min(1).max(255), address: z.string().trim().min(1).max(5000), phone: z.string().trim().max(255), email: z.string().trim().email().max(255).or(z.literal('')), fax: z.string().trim().max(100).optional().default(''), workingHours: z.string().trim().max(255), mapEmbedUrl: z.string().trim().max(5000), mapSearchQuery: z.string().trim().max(5000).optional().default(''), isHeadOffice: z.boolean(), published: z.boolean(), ordering: z.number().int().min(0) });
export const saveSettingsSchema = z.object({ changes: z.array(settingChangeSchema).max(50), branches: z.object({ workspace: z.enum(['vi','en']), items: z.array(branchSchema).max(100) }).optional() }).refine((value) => value.changes.length > 0 || value.branches, 'Không có thay đổi để lưu.');
export type SaveSettingsInput = z.infer<typeof saveSettingsSchema>;

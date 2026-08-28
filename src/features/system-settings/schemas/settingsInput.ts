import { z } from 'zod';

export const scopeSchema = z.enum(['site_cic', 'site_english', 'site_enjicad']);
export const settingChangeSchema = z.object({ scopeId: scopeSchema, settingId: z.string().trim().min(1).max(520), value: z.union([z.string().max(200000), z.number().finite(), z.boolean(), z.null()]) });
export const branchSchema = z.object({ id: z.string().trim().max(100), code: z.string().trim().min(1).max(100).regex(/^[a-z0-9_-]+$/i), name: z.string().trim().min(1).max(255), address: z.string().trim().min(1).max(5000), phone: z.string().trim().max(255), email: z.string().trim().email().max(255).or(z.literal('')), fax: z.string().trim().max(100).optional().default(''), workingHours: z.string().trim().max(255), mapEmbedUrl: z.string().trim().max(5000), mapSearchQuery: z.string().trim().max(5000).optional().default(''), isHeadOffice: z.boolean(), published: z.boolean(), ordering: z.number().int().min(0) });
export const saveSettingsSchema = z.object({ changes: z.array(settingChangeSchema).max(500), branches: z.object({ workspace: z.enum(['vi','en']), items: z.array(branchSchema).max(100) }).optional() }).refine((value) => value.changes.length > 0 || value.branches, 'Không có thay đổi để lưu.');
export type SaveSettingsInput = z.infer<typeof saveSettingsSchema>;

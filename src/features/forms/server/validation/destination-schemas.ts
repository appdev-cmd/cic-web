import { z } from 'zod';
import type { GoogleSheetsDestinationConfig, EmailDestinationConfig } from '../../types';

export function normalizeSpreadsheetId(input: string): string {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  // Check if it's a full Google Sheets URL
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  // Check if it's already an ID
  const idMatch = trimmed.match(/^[a-zA-Z0-9-_]{15,}$/);
  if (idMatch) {
    return trimmed;
  }
  return trimmed;
}

export const googleSheetsColumnMappingSchema = z.object({
  sheetHeader: z.string().min(1, 'Tiêu đề cột không được rỗng'),
  sourceType: z.enum(['field', 'system']),
  sourceKey: z.string().min(1, 'Khóa nguồn không được rỗng'),
});

export const googleSheetsDestinationConfigSchema = z.object({
  spreadsheetId: z
    .string()
    .min(1, 'Spreadsheet ID hoặc URL không được rỗng')
    .transform((val) => normalizeSpreadsheetId(val)),
  sheetName: z.string().min(1, 'Tên Sheet không được rỗng').default('Sheet1'),
  columnMapping: z.array(googleSheetsColumnMappingSchema).default([]),
  autoCreateHeaders: z.boolean().optional().default(false),
});

export const emailDestinationConfigSchema = z.object({
  sendAdminEmail: z.boolean().default(false),
  adminEmails: z.array(z.string().email('Email quản trị không hợp lệ')).default([]),
  adminEmailTemplateId: z.string().nullable().optional(),
  sendConfirmationEmail: z.boolean().default(false),
  confirmationEmailTemplateId: z.string().nullable().optional(),
});

export const destinationInputSchema = z.object({
  id: z.string().optional(),
  destinationType: z.enum(['google_sheets', 'email', 'webhook']),
  name: z.string().max(255).default(''),
  isEnabled: z.boolean().default(true),
  config: z.record(z.string(), z.any()),
});

export function validateDestinationConfig(
  type: string,
  rawConfig: unknown
): GoogleSheetsDestinationConfig | EmailDestinationConfig | Record<string, any> {
  if (type === 'google_sheets') {
    return googleSheetsDestinationConfigSchema.parse(rawConfig);
  }
  if (type === 'email') {
    return emailDestinationConfigSchema.parse(rawConfig);
  }
  return rawConfig as Record<string, any>;
}

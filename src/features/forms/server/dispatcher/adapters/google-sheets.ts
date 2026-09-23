import 'server-only';
import type { FormDestinationEntity, GoogleSheetsDestinationConfig } from '@/features/forms/types';
import type { IDestinationAdapter, FormSubmissionContext, DeliveryResult } from '../types';
import { appendGoogleSheetRow, getGoogleSheetHeaders, initializeGoogleSheetHeaders } from '@/lib/integrations/google-sheets/client';

export class GoogleSheetsDestinationAdapter implements IDestinationAdapter {
  readonly type = 'google_sheets';

  async deliver(destination: FormDestinationEntity, context: FormSubmissionContext): Promise<DeliveryResult> {
    const config = destination.config as GoogleSheetsDestinationConfig;

    if (!config?.spreadsheetId) {
      return {
        destinationId: destination.id,
        destinationType: this.type,
        destinationName: destination.name,
        status: 'failed',
        lastError: 'Cấu hình Google Sheets thiếu Spreadsheet ID.',
      };
    }

    const sheetName = config.sheetName || 'Sheet1';

    try {
      // 1. Check if headers need initialization (if autoCreateHeaders is true and sheet has no headers)
      if (config.autoCreateHeaders) {
        try {
          const existingHeaders = await getGoogleSheetHeaders(config.spreadsheetId, sheetName);
          if (existingHeaders.length === 0 && config.columnMapping && config.columnMapping.length > 0) {
            const headerTitles = config.columnMapping.map((m) => m.sheetHeader);
            await initializeGoogleSheetHeaders(config.spreadsheetId, sheetName, headerTitles);
          }
        } catch (initErr) {
          console.warn('[GoogleSheetsAdapter] Auto-create headers check skipped:', initErr);
        }
      }

      // 2. Build row values based on columnMapping
      const rowValues: any[] = [];

      if (config.columnMapping && config.columnMapping.length > 0) {
        for (const col of config.columnMapping) {
          if (col.sourceType === 'system') {
            if (col.sourceKey === 'submitted_at') {
              rowValues.push(context.submittedAt);
            } else if (col.sourceKey === 'submission_id') {
              rowValues.push(context.submissionId);
            } else if (col.sourceKey === 'source_path') {
              rowValues.push(context.sourcePath || '');
            } else if (col.sourceKey === 'form_title') {
              rowValues.push(context.formTitle);
            } else {
              rowValues.push('');
            }
          } else {
            // Source is a form field
            const fieldVal = context.fields[col.sourceKey]?.value;
            rowValues.push(fieldVal ?? '');
          }
        }
      } else {
        // Fallback default: system fields + all form fields
        rowValues.push(context.submittedAt);
        rowValues.push(context.submissionId);
        for (const f of Object.values(context.fields)) {
          rowValues.push(f.value ?? '');
        }
      }

      // 3. Append row
      const appendResult = await appendGoogleSheetRow(config.spreadsheetId, sheetName, rowValues);

      return {
        destinationId: destination.id,
        destinationType: this.type,
        destinationName: destination.name,
        status: 'success',
        responseMetadata: {
          spreadsheetId: config.spreadsheetId,
          sheetName,
          updatedRange: appendResult.updatedRange,
          updatedRows: appendResult.updatedRows,
          appendedAt: new Date().toISOString(),
        },
      };
    } catch (err: any) {
      console.error('[GoogleSheetsAdapter Delivery Error]', err);
      return {
        destinationId: destination.id,
        destinationType: this.type,
        destinationName: destination.name,
        status: 'failed',
        lastError: err?.message || 'Lỗi không xác định khi ghi Google Sheet.',
      };
    }
  }
}

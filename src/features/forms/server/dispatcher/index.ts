import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { FormDestinationEntity } from '@/features/forms/types';
import type { FormSubmissionContext, DeliveryResult, IDestinationAdapter } from './types';
import { GoogleSheetsDestinationAdapter } from './adapters/google-sheets';
import { EmailDestinationAdapter } from './adapters/email';

export class DestinationDispatcher {
  private adapters = new Map<string, IDestinationAdapter>();

  constructor() {
    this.registerAdapter(new GoogleSheetsDestinationAdapter());
    this.registerAdapter(new EmailDestinationAdapter());
  }

  registerAdapter(adapter: IDestinationAdapter) {
    this.adapters.set(adapter.type, adapter);
  }

  getAdapter(type: string): IDestinationAdapter | undefined {
    return this.adapters.get(type);
  }

  /**
   * Dispatches form submission to all enabled destinations asynchronously and safely.
   * Guaranteed:
   * - Never throws unhandled error to caller.
   * - Executes adapters concurrently via Promise.allSettled with a strict 5000ms timeout.
   * - Records every delivery attempt into cic_form_submission_deliveries.
   */
  async dispatchAll(context: FormSubmissionContext): Promise<DeliveryResult[]> {
    const sql = getPostgresClient();
    const results: DeliveryResult[] = [];

    try {
      // 1. Load active destinations for this form
      const destRows = await sql<Array<{
        id: number | string;
        form_id: number | string;
        destination_type: string;
        name: string;
        is_enabled: boolean;
        config: any;
        created_at: string;
        updated_at: string;
      }>>`
        SELECT id, form_id, destination_type, name, is_enabled, config, created_at, updated_at
        FROM cic_form_destinations
        WHERE form_id = ${context.formId}
          AND is_enabled = true
          AND deleted_at IS NULL
        ORDER BY id ASC
      `;

      let destinations: FormDestinationEntity[] = destRows.map((r) => ({
        id: String(r.id),
        formId: String(r.form_id),
        destinationType: r.destination_type as any,
        name: r.name || r.destination_type,
        isEnabled: r.is_enabled,
        config: r.config || {},
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));

      // Backward compatibility fallback:
      // If no destinations are in cic_form_destinations, check if form has legacy email settings
      if (destinations.length === 0) {
        const [formRow] = await sql<Array<{
          send_admin_email: boolean;
          admin_emails: string[];
          admin_email_template_id: number | null;
          send_confirmation_email: boolean;
          confirmation_email_template_id: number | null;
        }>>`
          SELECT send_admin_email, admin_emails, admin_email_template_id, send_confirmation_email, confirmation_email_template_id
          FROM cic_forms
          WHERE id = ${context.formId}
          LIMIT 1
        `;

        if (formRow && (formRow.send_admin_email || formRow.send_confirmation_email)) {
          // Create or retrieve an on-the-fly destination record so delivery tracking works
          const [createdDest] = await sql<Array<{ id: number }>>`
            INSERT INTO cic_form_destinations (
              form_id, destination_type, name, is_enabled, config, created_at, updated_at
            ) VALUES (
              ${context.formId},
              'email',
              'Thông báo Email (Tự động chuyển tiếp)',
              true,
              ${sql.json({
                sendAdminEmail: formRow.send_admin_email,
                adminEmails: formRow.admin_emails || [],
                adminEmailTemplateId: formRow.admin_email_template_id ? String(formRow.admin_email_template_id) : null,
                sendConfirmationEmail: formRow.send_confirmation_email,
                confirmationEmailTemplateId: formRow.confirmation_email_template_id ? String(formRow.confirmation_email_template_id) : null,
              })},
              now(),
              now()
            )
            RETURNING id
          `;

          if (createdDest?.id) {
            destinations = [
              {
                id: String(createdDest.id),
                formId: String(context.formId),
                destinationType: 'email',
                name: 'Thông báo Email',
                isEnabled: true,
                config: {
                  sendAdminEmail: formRow.send_admin_email,
                  adminEmails: formRow.admin_emails || [],
                  adminEmailTemplateId: formRow.admin_email_template_id ? String(formRow.admin_email_template_id) : null,
                  sendConfirmationEmail: formRow.send_confirmation_email,
                  confirmationEmailTemplateId: formRow.confirmation_email_template_id ? String(formRow.confirmation_email_template_id) : null,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ];
          }
        }
      }

      if (destinations.length === 0) {
        return [];
      }

      // 2. Execute each destination in parallel with safe delivery logging
      const subIdNum = Number(context.submissionId);

      const tasks = destinations.map(async (dest): Promise<DeliveryResult> => {
        const destIdNum = Number(dest.id);
        const adapter = this.getAdapter(dest.destinationType);

        if (!adapter) {
          console.warn(`[DestinationDispatcher] No adapter found for destination_type: ${dest.destinationType}`);
          return {
            destinationId: dest.id,
            destinationType: dest.destinationType,
            destinationName: dest.name,
            status: 'failed',
            lastError: `Hệ thống chưa hỗ trợ adapter cho loại điểm đến "${dest.destinationType}".`,
          };
        }

        // Initialize or update delivery record to 'processing'
        await sql`
          INSERT INTO cic_form_submission_deliveries (
            submission_id,
            destination_id,
            destination_type,
            status,
            attempt_count,
            last_attempt_at,
            created_at,
            updated_at
          ) VALUES (
            ${subIdNum},
            ${destIdNum},
            ${dest.destinationType},
            'processing',
            1,
            now(),
            now(),
            now()
          )
          ON CONFLICT (submission_id, destination_id) DO UPDATE SET
            status = 'processing',
            attempt_count = cic_form_submission_deliveries.attempt_count + 1,
            last_attempt_at = now(),
            updated_at = now()
        `;

        // Run adapter with 5000ms timeout
        const timeoutPromise = new Promise<DeliveryResult>((_, reject) =>
          setTimeout(() => reject(new Error('Quá thời gian xử lý (Timeout 5000ms)')), 5000)
        );

        let deliverResult: DeliveryResult;
        try {
          deliverResult = await Promise.race([adapter.deliver(dest, context), timeoutPromise]);
        } catch (execErr: any) {
          deliverResult = {
            destinationId: dest.id,
            destinationType: dest.destinationType,
            destinationName: dest.name,
            status: 'failed',
            lastError: execErr?.message || 'Lỗi thực thi adapter',
          };
        }

        // Persist final delivery status
        await sql`
          UPDATE cic_form_submission_deliveries
          SET 
            status = ${deliverResult.status},
            last_error = ${deliverResult.lastError || null},
            response_metadata = ${deliverResult.responseMetadata ? sql.json(deliverResult.responseMetadata) : null},
            delivered_at = ${deliverResult.status === 'success' ? sql`now()` : null},
            updated_at = now()
          WHERE submission_id = ${subIdNum} AND destination_id = ${destIdNum}
        `;

        return deliverResult;
      });

      const settled = await Promise.allSettled(tasks);
      for (const item of settled) {
        if (item.status === 'fulfilled') {
          results.push(item.value);
        } else {
          console.error('[DestinationDispatcher] Unexpected unhandled rejection:', item.reason);
        }
      }
    } catch (globalErr) {
      console.error('[DestinationDispatcher Global Error]', globalErr);
    }

    return results;
  }

  /**
   * Retry a single delivery attempt for a specific submission and destination.
   */
  async retryDelivery(submissionId: string | number, deliveryId: string | number): Promise<DeliveryResult> {
    const sql = getPostgresClient();
    const subIdNum = Number(submissionId);
    const delIdNum = Number(deliveryId);

    const [delRow] = await sql<Array<{
      id: number;
      submission_id: number;
      destination_id: number;
      destination_type: string;
      status: string;
      attempt_count: number;
    }>>`
      SELECT id, submission_id, destination_id, destination_type, status, attempt_count
      FROM cic_form_submission_deliveries
      WHERE id = ${delIdNum} AND submission_id = ${subIdNum}
      LIMIT 1
    `;

    if (!delRow) {
      throw new Error('Không tìm thấy bản ghi chuyển phát để thử lại.');
    }

    const [destRow] = await sql<Array<{
      id: number;
      form_id: number;
      destination_type: string;
      name: string;
      is_enabled: boolean;
      config: any;
      created_at: string;
      updated_at: string;
    }>>`
      SELECT id, form_id, destination_type, name, is_enabled, config, created_at, updated_at
      FROM cic_form_destinations
      WHERE id = ${delRow.destination_id}
      LIMIT 1
    `;

    if (!destRow) {
      throw new Error('Cấu hình điểm đến tương ứng không tồn tại hoặc đã bị xóa.');
    }

    // Reconstruct FormSubmissionContext
    const [subRow] = await sql<Array<{
      id: number;
      form_id: number;
      source_type: string | null;
      source_path: string | null;
      submitted_at: string;
    }>>`
      SELECT id, form_id, source_type, source_path, submitted_at
      FROM cic_form_submissions
      WHERE id = ${subIdNum}
      LIMIT 1
    `;

    if (!subRow) {
      throw new Error('Lượt gửi biểu mẫu không tồn tại.');
    }

    const [formRow] = await sql<Array<{
      id: number;
      code: string;
      title: string;
      workspace: string;
      success_message: string;
      redirect_url: string | null;
    }>>`
      SELECT id, code, title, workspace, success_message, redirect_url
      FROM cic_forms
      WHERE id = ${subRow.form_id}
      LIMIT 1
    `;

    const valRows = await sql<Array<{
      field_key: string;
      value_text: string | null;
      value_json: any;
      field_label?: string | null;
      field_type?: string | null;
      role_type?: string | null;
    }>>`
      SELECT v.field_key, v.value_text, v.value_json, f.label AS field_label, f.field_type, f.role_type
      FROM cic_form_submission_values v
      LEFT JOIN cic_form_fields f ON f.id = v.field_id
      WHERE v.submission_id = ${subIdNum}
      ORDER BY v.id ASC
    `;

    const fieldsContext: Record<string, any> = {};
    let customerName = '';
    let customerEmail = '';
    let customerPhone = '';

    for (const v of valRows) {
      const rawVal = v.value_text !== null ? v.value_text : v.value_json;
      fieldsContext[v.field_key] = {
        fieldKey: v.field_key,
        label: v.field_label || v.field_key,
        fieldType: v.field_type || 'text',
        roleType: v.role_type || undefined,
        value: rawVal,
      };

      if (v.role_type === 'email' || v.field_key === 'email') customerEmail = String(rawVal || '');
      if (v.role_type === 'customer_name' || v.field_key === 'fullname' || v.field_key === 'name') customerName = String(rawVal || '');
      if (v.role_type === 'phone' || v.field_key === 'phone') customerPhone = String(rawVal || '');
    }

    const context: FormSubmissionContext = {
      submissionId: String(subRow.id),
      formId: subRow.form_id,
      formCode: formRow?.code || '',
      formTitle: formRow?.title || '',
      workspace: formRow?.workspace || 'vi',
      submittedAt: new Date(subRow.submitted_at),
      sourcePath: subRow.source_path || undefined,
      sourceType: subRow.source_type || undefined,
      fields: fieldsContext,
      customerName: customerName || 'Khách hàng',
      customerEmail,
      customerPhone,
      successMessage: formRow?.success_message,
      redirectUrl: formRow?.redirect_url,
    };

    const destEntity: FormDestinationEntity = {
      id: String(destRow.id),
      formId: String(destRow.form_id),
      destinationType: destRow.destination_type as any,
      name: destRow.name,
      isEnabled: destRow.is_enabled,
      config: destRow.config || {},
      createdAt: new Date(destRow.created_at).toISOString(),
      updatedAt: new Date(destRow.updated_at).toISOString(),
    };

    const adapter = this.getAdapter(destRow.destination_type);
    if (!adapter) {
      throw new Error(`Không tìm thấy adapter cho loại "${destRow.destination_type}".`);
    }

    // Set status to processing
    await sql`
      UPDATE cic_form_submission_deliveries
      SET status = 'processing', attempt_count = attempt_count + 1, last_attempt_at = now(), updated_at = now()
      WHERE id = ${delIdNum}
    `;

    let deliverResult: DeliveryResult;
    try {
      deliverResult = await adapter.deliver(destEntity, context);
    } catch (err: any) {
      deliverResult = {
        destinationId: destEntity.id,
        destinationType: destEntity.destinationType,
        destinationName: destEntity.name,
        status: 'failed',
        lastError: err?.message || 'Lỗi khi gửi lại',
      };
    }

    await sql`
      UPDATE cic_form_submission_deliveries
      SET 
        status = ${deliverResult.status},
        last_error = ${deliverResult.lastError || null},
        response_metadata = ${deliverResult.responseMetadata ? sql.json(deliverResult.responseMetadata) : null},
        delivered_at = ${deliverResult.status === 'success' ? sql`now()` : null},
        updated_at = now()
      WHERE id = ${delIdNum}
    `;

    return deliverResult;
  }
}

export const destinationDispatcher = new DestinationDispatcher();

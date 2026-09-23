import 'server-only';
import { withTransaction, getPostgresClient } from '@/server/db/postgres';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import type { CmsPrincipal } from '@/server/auth/guards';
import type { CreateFormInput, UpdateFormInput, FormStatus, FormEntity, FormDestinationInput, EmailDestinationConfig } from '../types';
import { getFormById } from './queries';
import { destinationDispatcher } from './dispatcher';
import type { DeliveryResult, FormSubmissionFieldContext } from './dispatcher/types';
import { validateDestinationConfig } from './validation/destination-schemas';

function parseTemplateId(val: string | undefined): number | null {
  if (!val) return null;
  const n = Number(val);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export async function saveFormDestinations(
  formId: number,
  destinations: FormDestinationInput[] | undefined,
  sql: any
): Promise<void> {
  if (!destinations) return;

  const activeIds: number[] = [];

  for (const dest of destinations) {
    const validatedConfig = validateDestinationConfig(dest.destinationType, dest.config);
    const destIdNum = dest.id ? Number(dest.id) : null;

    if (destIdNum && Number.isSafeInteger(destIdNum) && destIdNum > 0) {
      const [updated] = await sql`
        UPDATE cic_form_destinations
        SET 
          destination_type = ${dest.destinationType},
          name = ${dest.name || ''},
          is_enabled = ${Boolean(dest.isEnabled)},
          config = ${sql.json(validatedConfig as any)},
          updated_at = now(),
          deleted_at = NULL
        WHERE id = ${destIdNum} AND form_id = ${formId}
        RETURNING id
      `;
      if (updated?.id) activeIds.push(Number(updated.id));
    } else {
      const [inserted] = await sql`
        INSERT INTO cic_form_destinations (
          form_id,
          destination_type,
          name,
          is_enabled,
          config,
          created_at,
          updated_at
        ) VALUES (
          ${formId},
          ${dest.destinationType},
          ${dest.name || ''},
          ${Boolean(dest.isEnabled)},
          ${sql.json(validatedConfig as any)},
          now(),
          now()
        )
        RETURNING id
      `;
      if (inserted?.id) activeIds.push(Number(inserted.id));
    }
  }

  // Soft delete removed destinations
  if (activeIds.length > 0) {
    await sql`
      UPDATE cic_form_destinations
      SET deleted_at = now()
      WHERE form_id = ${formId} AND id NOT IN ${sql(activeIds)} AND deleted_at IS NULL
    `;
  } else {
    await sql`
      UPDATE cic_form_destinations
      SET deleted_at = now()
      WHERE form_id = ${formId} AND deleted_at IS NULL
    `;
  }

  // Dual-write sync for Email destination back to cic_forms legacy columns
  const emailDest = destinations.find((d) => d.destinationType === 'email');
  if (emailDest) {
    const cfg = emailDest.config as EmailDestinationConfig;
    const adminTplId = parseTemplateId(cfg?.adminEmailTemplateId || undefined);
    const confTplId = parseTemplateId(cfg?.confirmationEmailTemplateId || undefined);

    await sql`
      UPDATE cic_forms
      SET 
        send_admin_email = ${Boolean(emailDest.isEnabled && cfg?.sendAdminEmail)},
        admin_emails = ${sql.array(cfg?.adminEmails || [])},
        admin_email_template_id = ${adminTplId},
        send_confirmation_email = ${Boolean(emailDest.isEnabled && cfg?.sendConfirmationEmail)},
        confirmation_email_template_id = ${confTplId}
      WHERE id = ${formId}
    `;
  }
}

export async function createForm(input: CreateFormInput, actor: CmsPrincipal): Promise<FormEntity> {
  const result = await withTransaction(async (sql) => {
    // 1. Verify code uniqueness in workspace
    const [existing] = await sql`
      SELECT id FROM cic_forms 
      WHERE workspace = ${input.workspace} AND code = ${input.code} AND deleted_at IS NULL
      LIMIT 1
    `;
    if (existing) {
      throw new Error(`Mã biểu mẫu "${input.code}" đã tồn tại trong workspace ${input.workspace.toUpperCase()}.`);
    }

    const adminEmailTemplateId = parseTemplateId(input.submitConfig.adminEmailTemplate);
    const confirmationEmailTemplateId = parseTemplateId(input.submitConfig.confirmationEmailTemplate);

    // 2. Insert form record
    const [formRow] = await sql`
      INSERT INTO cic_forms (
        workspace,
        code,
        is_system,
        admin_name,
        title,
        description,
        status,
        current_version,
        create_customer_request,
        send_admin_email,
        admin_emails,
        admin_email_template_id,
        send_confirmation_email,
        confirmation_email_template_id,
        submit_button_text,
        success_message,
        redirect_url,
        created_by,
        created_at,
        updated_at
      ) VALUES (
        ${input.workspace},
        ${input.code},
        false,
        ${input.adminName},
        ${input.title},
        ${input.description || null},
        ${input.status || 'draft'},
        1,
        ${input.submitConfig.createCustomerRequest !== false},
        ${Boolean(input.submitConfig.sendAdminEmail)},
        ${sql.array(input.submitConfig.adminEmails || [])},
        ${adminEmailTemplateId},
        ${Boolean(input.submitConfig.sendConfirmationEmail)},
        ${confirmationEmailTemplateId},
        ${input.submitConfig.submitButtonText || 'Gửi thông tin'},
        ${input.submitConfig.successMessage || 'Cảm ơn bạn đã gửi thông tin!'},
        ${input.submitConfig.redirectUrl || null},
        ${actor.legacyUserId || null},
        now(),
        now()
      )
      RETURNING id
    `;

    const formId = Number(formRow.id);

    // 3. Insert form fields
    if (input.fields && input.fields.length > 0) {
      for (let i = 0; i < input.fields.length; i++) {
        const field = input.fields[i];
        await sql`
          INSERT INTO cic_form_fields (
            form_id,
            field_key,
            field_type,
            role_type,
            label,
            placeholder,
            help_text,
            is_required,
            is_locked,
            position,
            validation_config,
            options_config
          ) VALUES (
            ${formId},
            ${field.fieldKey},
            ${field.fieldType},
            ${field.roleType || null},
            ${field.label},
            ${field.placeholder || null},
            ${field.helpText || null},
            ${Boolean(field.isRequired)},
            ${Boolean(field.isLocked)},
            ${i + 1},
            ${sql.json((field.validation || {}) as any)},
            ${sql.json((field.options || []) as any)}
          )
        `;
      }
    }

    // 3.5. Insert form destinations
    await saveFormDestinations(formId, input.destinations, sql);

    // 4. Audit Log
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.FORM_CREATED,
        entityType: AUDIT_ENTITY_TYPES.FORM,
        entityId: String(formId),
        entityTitle: input.title,
        module: 'forms',
        workspace: input.workspace,
        result: 'success',
        after: {
          code: input.code,
          adminName: input.adminName,
          status: input.status || 'draft',
          fieldCount: input.fields?.length || 0,
        },
      },
      sql
    );

    return formId;
  });

  const created = await getFormById(result);
  if (!created) throw new Error('Không thể tải lại biểu mẫu vừa tạo.');
  return created;
}

export async function updateForm(
  id: string | number,
  input: UpdateFormInput,
  actor: CmsPrincipal
): Promise<FormEntity> {
  const numId = Number(id);
  if (!Number.isSafeInteger(numId) || numId <= 0) {
    throw new Error('ID biểu mẫu không hợp lệ.');
  }

  await withTransaction(async (sql) => {
    const [existing] = await sql`
      SELECT * FROM cic_forms 
      WHERE id = ${numId} AND deleted_at IS NULL 
      FOR UPDATE
    `;
    if (!existing) {
      throw new Error('Không tìm thấy biểu mẫu hoặc biểu mẫu đã bị xóa.');
    }

    const adminEmailTemplateId = parseTemplateId(input.submitConfig.adminEmailTemplate);
    const confirmationEmailTemplateId = parseTemplateId(input.submitConfig.confirmationEmailTemplate);

    const nextVersion = input.incrementVersion ? Number(existing.current_version) + 1 : Number(existing.current_version);

    // 1. Update form table
    await sql`
      UPDATE cic_forms SET
        admin_name = ${input.adminName},
        title = ${input.title},
        description = ${input.description || null},
        status = ${input.status || existing.status},
        current_version = ${nextVersion},
        create_customer_request = ${input.submitConfig.createCustomerRequest !== false},
        send_admin_email = ${Boolean(input.submitConfig.sendAdminEmail)},
        admin_emails = ${sql.array(input.submitConfig.adminEmails || [])},
        admin_email_template_id = ${adminEmailTemplateId},
        send_confirmation_email = ${Boolean(input.submitConfig.sendConfirmationEmail)},
        confirmation_email_template_id = ${confirmationEmailTemplateId},
        submit_button_text = ${input.submitConfig.submitButtonText || 'Gửi thông tin'},
        success_message = ${input.submitConfig.successMessage || 'Cảm ơn bạn đã gửi thông tin!'},
        redirect_url = ${input.submitConfig.redirectUrl || null},
        updated_at = now()
      WHERE id = ${numId}
    `;

    // 2. Re-create / sync fields
    await sql`DELETE FROM cic_form_fields WHERE form_id = ${numId}`;

    if (input.fields && input.fields.length > 0) {
      for (let i = 0; i < input.fields.length; i++) {
        const field = input.fields[i];
        await sql`
          INSERT INTO cic_form_fields (
            form_id,
            field_key,
            field_type,
            role_type,
            label,
            placeholder,
            help_text,
            is_required,
            is_locked,
            position,
            validation_config,
            options_config
          ) VALUES (
            ${numId},
            ${field.fieldKey},
            ${field.fieldType},
            ${field.roleType || null},
            ${field.label},
            ${field.placeholder || null},
            ${field.helpText || null},
            ${Boolean(field.isRequired)},
            ${Boolean(field.isLocked)},
            ${i + 1},
            ${sql.json((field.validation || {}) as any)},
            ${sql.json((field.options || []) as any)}
          )
        `;
      }
    }

    // 2.5. Update form destinations
    await saveFormDestinations(numId, input.destinations, sql);

    // 3. Audit Log
    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.FORM_UPDATED,
        entityType: AUDIT_ENTITY_TYPES.FORM,
        entityId: String(numId),
        entityTitle: input.title,
        module: 'forms',
        workspace: existing.workspace,
        result: 'success',
        before: {
          adminName: existing.admin_name,
          title: existing.title,
          status: existing.status,
          currentVersion: existing.current_version,
        },
        after: {
          adminName: input.adminName,
          title: input.title,
          status: input.status || existing.status,
          currentVersion: nextVersion,
          fieldCount: input.fields?.length || 0,
        },
      },
      sql
    );
  });

  const updated = await getFormById(numId);
  if (!updated) throw new Error('Không thể tải lại biểu mẫu sau khi cập nhật.');
  return updated;
}

export async function updateFormStatus(
  id: string | number,
  status: FormStatus,
  actor: CmsPrincipal
): Promise<FormEntity> {
  const numId = Number(id);
  if (!Number.isSafeInteger(numId) || numId <= 0) {
    throw new Error('ID biểu mẫu không hợp lệ.');
  }

  await withTransaction(async (sql) => {
    const [existing] = await sql`
      SELECT id, workspace, title, status FROM cic_forms 
      WHERE id = ${numId} AND deleted_at IS NULL 
      FOR UPDATE
    `;
    if (!existing) throw new Error('Biểu mẫu không tồn tại.');

    await sql`
      UPDATE cic_forms 
      SET status = ${status}, updated_at = now()
      WHERE id = ${numId}
    `;

    await writeAuditEvent(
      actor,
      {
        action: AUDIT_ACTIONS.FORM_STATUS_CHANGED,
        entityType: AUDIT_ENTITY_TYPES.FORM,
        entityId: String(numId),
        entityTitle: existing.title,
        module: 'forms',
        workspace: existing.workspace,
        result: 'success',
        before: { status: existing.status },
        after: { status },
      },
      sql
    );
  });

  const updated = await getFormById(numId);
  if (!updated) throw new Error('Không thể tải lại biểu mẫu.');
  return updated;
}

export async function deleteForms(ids: Array<string | number>, actor: CmsPrincipal): Promise<{ count: number }> {
  const validIds = ids.map(Number).filter((n) => Number.isSafeInteger(n) && n > 0);
  if (validIds.length === 0) return { count: 0 };

  const count = await withTransaction(async (sql) => {
    const rows = await sql`
      SELECT id, workspace, title, is_system FROM cic_forms
      WHERE id IN ${sql(validIds)} AND deleted_at IS NULL
      FOR UPDATE
    `;

    // Prevent deleting system forms
    const systemForm = rows.find((r) => r.is_system);
    if (systemForm) {
      throw new Error(`Không thể xóa biểu mẫu hệ thống: "${systemForm.title}".`);
    }

    if (rows.length === 0) return 0;

    const deletingIds = rows.map((r) => r.id);
    await sql`
      UPDATE cic_forms
      SET deleted_at = now(), updated_at = now()
      WHERE id IN ${sql(deletingIds)}
    `;

    for (const r of rows) {
      await writeAuditEvent(
        actor,
        {
          action: AUDIT_ACTIONS.FORM_TRASHED,
          entityType: AUDIT_ENTITY_TYPES.FORM,
          entityId: String(r.id),
          entityTitle: r.title,
          module: 'forms',
          workspace: r.workspace,
          result: 'success',
        },
        sql
      );
    }

    return rows.length;
  });

  return { count };
}

export interface DynamicFormSubmissionPayload {
  formId: string | number;
  sourceType?: string;
  sourceId?: string;
  sourcePath?: string;
  ctaId?: string | number;
  placementKey?: string;
  values: Record<string, any>;
}

export async function submitDynamicForm(payload: DynamicFormSubmissionPayload): Promise<{
  success: boolean;
  submissionId: string;
  successMessage?: string;
  redirectUrl?: string | null;
}> {
  const formIdNum = Number(payload.formId);
  if (!Number.isSafeInteger(formIdNum) || formIdNum <= 0) {
    throw new Error('ID biểu mẫu không hợp lệ.');
  }

  const { submissionId, form, customerEmail, customerName, customerPhone, fieldContexts } = await withTransaction(
    async (sql) => {
      // 1. Get form configuration
      const [formRow] = await sql`
        SELECT 
          id, workspace, code, title, admin_name, current_version,
          create_customer_request, send_admin_email, admin_emails,
          admin_email_template_id, send_confirmation_email,
          confirmation_email_template_id, success_message, redirect_url
        FROM cic_forms
        WHERE id = ${formIdNum} AND deleted_at IS NULL AND status = 'active'
        LIMIT 1
      `;
      if (!formRow) {
        throw new Error('Biểu mẫu không tồn tại hoặc đã ngừng tiếp nhận.');
      }

      // 2. Get form fields to resolve roles
      const fields = await sql`
        SELECT id, field_key, role_type, label, field_type
        FROM cic_form_fields
        WHERE form_id = ${formIdNum}
        ORDER BY position ASC
      `;

      // Identify special roles and build field contexts
      let emailVal = '';
      let nameVal = '';
      let phoneVal = '';
      const contexts: Record<string, FormSubmissionFieldContext> = {};

      for (const f of fields) {
        const key = f.field_key;
        const val = payload.values[key];
        const stringVal = typeof val === 'string' ? val.trim() : val !== undefined && val !== null ? JSON.stringify(val) : '';

        contexts[key] = {
          fieldKey: key,
          label: f.label || key,
          fieldType: f.field_type || 'text',
          roleType: f.role_type || undefined,
          value: val !== undefined ? val : '',
        };

        if (f.role_type === 'email' || key === 'email') {
          if (!emailVal && stringVal) emailVal = stringVal;
        } else if (f.role_type === 'customer_name' || key === 'fullName' || key === 'fullname' || key === 'name') {
          if (!nameVal && stringVal) nameVal = stringVal;
        } else if (f.role_type === 'phone' || key === 'phone' || key === 'telephone') {
          if (!phoneVal && stringVal) phoneVal = stringVal;
        }
      }

      // 3. Insert submission record
      const [subRow] = await sql`
        INSERT INTO cic_form_submissions (
          form_id,
          form_version,
          source_type,
          source_id,
          source_path,
          cta_id,
          placement_key,
          submitted_at
        ) VALUES (
          ${formIdNum},
          ${formRow.current_version || 1},
          ${payload.sourceType || 'website'},
          ${payload.sourceId || null},
          ${payload.sourcePath || null},
          ${payload.ctaId ? Number(payload.ctaId) : null},
          ${payload.placementKey || null},
          now()
        )
        RETURNING id
      `;

      const subId = String(subRow.id);

      // 4. Insert submission values
      for (const f of fields) {
        const key = f.field_key;
        const rawVal = payload.values[key];
        if (rawVal === undefined || rawVal === null) continue;

        const valText = typeof rawVal === 'string' ? rawVal : typeof rawVal === 'number' || typeof rawVal === 'boolean' ? String(rawVal) : null;
        const valJson = typeof rawVal === 'object' ? sql.json(rawVal) : null;

        await sql`
          INSERT INTO cic_form_submission_values (
            submission_id,
            field_id,
            field_key,
            value_text,
            value_json
          ) VALUES (
            ${subRow.id},
            ${f.id},
            ${key},
            ${valText},
            ${valJson}
          )
        `;
      }

      // 5. Create customer request state if enabled
      if (formRow.create_customer_request) {
        const [state] = await sql`
          INSERT INTO cic_customer_request_states (
            workspace, source_type, source_id, status, priority, tags, created_at, updated_at
          ) VALUES (
            ${formRow.workspace}, 'form_submission', ${subRow.id}, 'new', 'medium', ${sql.array([formRow.code || 'form'])}, now(), now()
          )
          ON CONFLICT (workspace, source_type, source_id) DO NOTHING
          RETURNING id
        `;

        if (state?.id) {
          await sql`
            INSERT INTO cic_customer_request_events (
              request_state_id, event_type, old_value, new_value, actor_id, created_at
            ) VALUES (
              ${state.id}, 'created', NULL, ${sql.json({
                formId: formIdNum,
                formCode: formRow.code,
                formTitle: formRow.title,
                name: nameVal,
                email: emailVal,
                phone: phoneVal,
              })}, NULL, now()
            )
          `;
        }
      }

      return {
        submissionId: subId,
        form: formRow,
        customerEmail: emailVal,
        customerName: nameVal || 'Khách hàng',
        customerPhone: phoneVal,
        fieldContexts: contexts,
      };
    }
  );

  // 6. Asynchronously dispatch to all destinations via DestinationDispatcher
  try {
    await destinationDispatcher.dispatchAll({
      submissionId,
      formId: formIdNum,
      formCode: form.code,
      formTitle: form.title,
      workspace: form.workspace,
      submittedAt: new Date(),
      sourcePath: payload.sourcePath,
      sourceType: payload.sourceType,
      ctaId: payload.ctaId ? Number(payload.ctaId) : null,
      placementKey: payload.placementKey,
      fields: fieldContexts,
      customerName,
      customerEmail,
      customerPhone,
      successMessage: form.success_message,
      redirectUrl: form.redirect_url,
    });
  } catch (dispatchErr) {
    console.error('[submitDynamicForm] Error during destination dispatching:', dispatchErr);
  }

  return {
    success: true,
    submissionId,
    successMessage: form.success_message || 'Gửi biểu mẫu thành công!',
    redirectUrl: form.redirect_url || null,
  };
}

export async function retrySubmissionDelivery(
  formId: string | number,
  submissionId: string | number,
  deliveryId: string | number,
  actor: CmsPrincipal
): Promise<DeliveryResult> {
  const result = await destinationDispatcher.retryDelivery(submissionId, deliveryId);

  const sql = getPostgresClient();
  const [formRow] = await sql`
    SELECT workspace, title FROM cic_forms WHERE id = ${Number(formId)}
  `;

  await writeAuditEvent(
    actor,
    {
      action: AUDIT_ACTIONS.FORM_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.FORM,
      entityId: String(formId),
      entityTitle: formRow?.title ? `${formRow.title} (Delivery #${deliveryId})` : `Thử gửi lại chuyển phát (Delivery #${deliveryId})`,
      module: 'forms',
      workspace: (formRow?.workspace as any) || 'vi',
      result: result.status === 'success' ? 'success' : 'failed',
      after: {
        submissionId: String(submissionId),
        deliveryId: String(deliveryId),
        destinationType: result.destinationType,
        status: result.status,
        lastError: result.lastError,
      },
    }
  );

  return result;
}

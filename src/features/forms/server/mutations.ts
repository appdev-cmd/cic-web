import 'server-only';
import { withTransaction } from '@/server/db/postgres';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import type { CmsPrincipal } from '@/server/auth/guards';
import type { CreateFormInput, UpdateFormInput, FormStatus, FormEntity } from '../types';
import { getFormById } from './queries';

function parseTemplateId(val: string | undefined): number | null {
  if (!val) return null;
  const n = Number(val);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
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

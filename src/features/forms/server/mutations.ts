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

  const { dispatchTemplatedEmail } = await import('@/lib/email/dispatcher');
  const { sendEmail } = await import('@/lib/email/transporter');

  const { submissionId, form, customerEmail, customerName, customerPhone, formattedValues } = await withTransaction(
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
        SELECT id, field_key, role_type, label
        FROM cic_form_fields
        WHERE form_id = ${formIdNum}
        ORDER BY position ASC
      `;

      // Identify special roles
      let emailVal = '';
      let nameVal = '';
      let phoneVal = '';
      const formattedMap: Record<string, string> = {};

      for (const f of fields) {
        const key = f.field_key;
        const val = payload.values[key];
        const stringVal = typeof val === 'string' ? val.trim() : val !== undefined && val !== null ? JSON.stringify(val) : '';
        if (stringVal) {
          formattedMap[f.label || key] = stringVal;
        }

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
        formattedValues: formattedMap,
      };
    }
  );

  // 6. Send notification emails asynchronously
  try {
    // Admin notification
    if (form.send_admin_email) {
      const adminRecipients = Array.isArray(form.admin_emails) && form.admin_emails.length > 0
        ? form.admin_emails
        : [process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'nampt@cic.com.vn'];

      if (form.admin_email_template_id) {
        await dispatchTemplatedEmail({
          workspace: form.workspace,
          templateId: form.admin_email_template_id,
          audience: 'internal',
          to: adminRecipients,
          variables: {
            '{{customer.full_name}}': customerName,
            '{{customer.email}}': customerEmail,
            '{{customer.phone}}': customerPhone,
            '{{form.title}}': form.title,
            ...formattedValues,
          },
        });
      } else {
        const tableRows = Object.entries(formattedValues)
          .map(([lbl, v]) => `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>${lbl}:</strong></td><td style="padding: 8px 0; color: #1e293b;">${v}</td></tr>`)
          .join('');

        await sendEmail({
          to: adminRecipients,
          subject: `[Biểu mẫu] Lượt gửi mới: ${form.title} - ${customerName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3 style="color: #ea580c; margin-top: 0;">Thông báo: Lượt gửi biểu mẫu mới</h3>
              <p>Biểu mẫu: <strong>${form.title}</strong></p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">${tableRows}</table>
              <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin: 0;">Đã lưu vào hệ thống Yêu cầu khách hàng CMS.</p>
            </div>
          `,
        });
      }
    }

    // Customer confirmation email
    if (form.send_confirmation_email && customerEmail && customerEmail.includes('@')) {
      if (form.confirmation_email_template_id) {
        await dispatchTemplatedEmail({
          workspace: form.workspace,
          templateId: form.confirmation_email_template_id,
          audience: 'customer',
          to: customerEmail,
          variables: {
            '{{customer.full_name}}': customerName,
            '{{customer.email}}': customerEmail,
            '{{form.title}}': form.title,
            ...formattedValues,
          },
        });
      } else {
        await sendEmail({
          to: customerEmail,
          subject: `[CIC Technology] Tiếp nhận biểu mẫu: ${form.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3 style="color: #ea580c; margin-top: 0;">CIC Technology & Consultancy</h3>
              <p>Kính gửi <strong>${customerName}</strong>,</p>
              <p>Cảm ơn Quý khách đã gửi thông tin qua biểu mẫu <strong>${form.title}</strong> của CIC Technology.</p>
              <p>${form.success_message || 'Chúng tôi đã tiếp nhận thông tin và sẽ liên hệ phản hồi sớm nhất có thể.'}</p>
              <p style="font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 20px;">Trân trọng,<br/><strong>CIC Technology</strong></p>
            </div>
          `,
        });
      }
    }
  } catch (emailErr) {
    console.error('[submitDynamicForm] Error sending emails:', emailErr);
  }

  return {
    success: true,
    submissionId,
    successMessage: form.success_message || 'Gửi biểu mẫu thành công!',
    redirectUrl: form.redirect_url || null,
  };
}


import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type {
  FormEntity,
  FormFieldDefinition,
  FormFilterParams,
  FormSubmissionDetail,
  FormWorkspace,
} from '../types';

interface RawFormRow {
  id: number | string;
  workspace: string;
  code: string;
  is_system: boolean;
  admin_name: string;
  title: string;
  description: string | null;
  status: string;
  current_version: number;
  create_customer_request: boolean;
  send_admin_email: boolean;
  admin_emails: string[] | null;
  admin_email_template_id: number | string | null;
  send_confirmation_email: boolean;
  confirmation_email_template_id: number | string | null;
  submit_button_text: string;
  success_message: string;
  redirect_url: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator_name?: string | null;
  submission_count?: number | string | null;
}

interface RawFieldRow {
  id: number | string;
  form_id: number | string;
  field_key: string;
  field_type: string;
  role_type: string | null;
  label: string;
  placeholder: string | null;
  help_text: string | null;
  is_required: boolean;
  is_locked: boolean;
  position: number;
  validation_config: any;
  options_config: any;
}

export async function listForms(params: FormFilterParams): Promise<FormEntity[]> {
  const sql = getPostgresClient();
  const workspace = params.workspace || 'vi';

  // Base query for forms with submission count
  const formRows = await sql<RawFormRow[]>`
    SELECT 
      f.*,
      COALESCE(u.full_name, u.username) AS creator_name,
      (
        SELECT COUNT(*)::int 
        FROM cic_form_submissions fs 
        WHERE fs.form_id = f.id
      ) AS submission_count
    FROM cic_forms f
    LEFT JOIN cic_users u ON u.id = f.created_by
    WHERE f.workspace = ${workspace}
      AND f.deleted_at IS NULL
      ${params.status ? sql`AND f.status = ${params.status}` : sql``}
      ${params.search ? sql`AND (
        lower(f.admin_name) LIKE lower(${`%${params.search}%`})
        OR lower(f.title) LIKE lower(${`%${params.search}%`})
        OR lower(f.code) LIKE lower(${`%${params.search}%`})
      )` : sql``}
      ${params.dateFrom ? sql`AND f.created_at >= ${params.dateFrom}::timestamptz` : sql``}
      ${params.dateTo ? sql`AND f.created_at <= ${`${params.dateTo} 23:59:59`}::timestamptz` : sql``}
    ORDER BY 
      ${params.sortBy === 'oldest' ? sql`f.created_at ASC` :
        params.sortBy === 'name' ? sql`f.title ASC` :
        params.sortBy === 'submissions' ? sql`submission_count DESC, f.updated_at DESC` :
        sql`f.updated_at DESC`}
  `;

  if (formRows.length === 0) {
    return [];
  }

  const formIds = formRows.map((r) => Number(r.id));
  const fieldRows = await sql<RawFieldRow[]>`
    SELECT *
    FROM cic_form_fields
    WHERE form_id IN ${sql(formIds)}
    ORDER BY form_id ASC, position ASC
  `;

  const fieldsByForm = new Map<string, FormFieldDefinition[]>();
  for (const field of fieldRows) {
    const fId = String(field.form_id);
    if (!fieldsByForm.has(fId)) {
      fieldsByForm.set(fId, []);
    }
    fieldsByForm.get(fId)!.push({
      id: String(field.id),
      fieldKey: field.field_key,
      label: field.label,
      fieldType: field.field_type as any,
      roleType: (field.role_type as any) || undefined,
      placeholder: field.placeholder || '',
      helpText: field.help_text || '',
      validation: field.validation_config || {},
      options: Array.isArray(field.options_config) ? field.options_config : [],
      position: field.position,
      isRequired: field.is_required,
      isLocked: field.is_locked,
    });
  }

  return formRows.map((r) => {
    const strId = String(r.id);
    const subCount = Number(r.submission_count || 0);
    return {
      id: strId,
      workspace: r.workspace as FormWorkspace,
      code: r.code,
      isSystem: r.is_system,
      adminName: r.admin_name,
      title: r.title,
      description: r.description || '',
      status: r.status as any,
      currentVersion: r.current_version,
      submitConfig: {
        saveToDatabase: true,
        createCustomerRequest: r.create_customer_request,
        sendAdminEmail: r.send_admin_email,
        adminEmails: Array.isArray(r.admin_emails) ? r.admin_emails : [],
        sendConfirmationEmail: r.send_confirmation_email,
        confirmationEmailTemplate: r.confirmation_email_template_id ? String(r.confirmation_email_template_id) : undefined,
        adminEmailTemplate: r.admin_email_template_id ? String(r.admin_email_template_id) : undefined,
        submitButtonText: r.submit_button_text || 'Gửi thông tin',
        successMessage: r.success_message,
        redirectUrl: r.redirect_url || '',
        allowFileDownload: false,
        crmSyncEnabled: false,
      },
      fields: fieldsByForm.get(strId) || [],
      createdBy: r.creator_name || undefined,
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
      deletedAt: r.deleted_at ? new Date(r.deleted_at).toISOString() : null,
      stats: {
        submissions: subCount,
        conversionRate: subCount > 0 ? 5.0 : 0,
      },
    };
  });
}

export async function getFormById(id: string | number): Promise<FormEntity | null> {
  const sql = getPostgresClient();
  const numId = Number(id);
  if (!Number.isSafeInteger(numId) || numId <= 0) return null;

  const [row] = await sql<RawFormRow[]>`
    SELECT 
      f.*,
      COALESCE(u.full_name, u.username) AS creator_name,
      (
        SELECT COUNT(*)::int 
        FROM cic_form_submissions fs 
        WHERE fs.form_id = f.id
      ) AS submission_count
    FROM cic_forms f
    LEFT JOIN cic_users u ON u.id = f.created_by
    WHERE f.id = ${numId}
    LIMIT 1
  `;

  if (!row) return null;

  const fieldRows = await sql<RawFieldRow[]>`
    SELECT *
    FROM cic_form_fields
    WHERE form_id = ${numId}
    ORDER BY position ASC
  `;

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
    WHERE form_id = ${numId} AND deleted_at IS NULL
    ORDER BY id ASC
  `;

  const subCount = Number(row.submission_count || 0);

  return {
    id: String(row.id),
    workspace: row.workspace as FormWorkspace,
    code: row.code,
    isSystem: row.is_system,
    adminName: row.admin_name,
    title: row.title,
    description: row.description || '',
    status: row.status as any,
    currentVersion: row.current_version,
    submitConfig: {
      saveToDatabase: true,
      createCustomerRequest: row.create_customer_request,
      sendAdminEmail: row.send_admin_email,
      adminEmails: Array.isArray(row.admin_emails) ? row.admin_emails : [],
      sendConfirmationEmail: row.send_confirmation_email,
      confirmationEmailTemplate: row.confirmation_email_template_id ? String(row.confirmation_email_template_id) : undefined,
      adminEmailTemplate: row.admin_email_template_id ? String(row.admin_email_template_id) : undefined,
      submitButtonText: row.submit_button_text || 'Gửi thông tin',
      successMessage: row.success_message,
      redirectUrl: row.redirect_url || '',
      allowFileDownload: false,
      crmSyncEnabled: false,
    },
    destinations: destRows.map((d) => ({
      id: String(d.id),
      formId: String(d.form_id),
      destinationType: d.destination_type as any,
      name: d.name || d.destination_type,
      isEnabled: d.is_enabled,
      config: d.config || {},
      createdAt: new Date(d.created_at).toISOString(),
      updatedAt: new Date(d.updated_at).toISOString(),
    })),
    fields: fieldRows.map((f) => ({
      id: String(f.id),
      fieldKey: f.field_key,
      label: f.label,
      fieldType: f.field_type as any,
      roleType: (f.role_type as any) || undefined,
      placeholder: f.placeholder || '',
      helpText: f.help_text || '',
      validation: f.validation_config || {},
      options: Array.isArray(f.options_config) ? f.options_config : [],
      position: f.position,
      isRequired: f.is_required,
      isLocked: f.is_locked,
    })),
    createdBy: row.creator_name || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    deletedAt: row.deleted_at ? new Date(row.deleted_at).toISOString() : null,
    stats: {
      submissions: subCount,
      conversionRate: subCount > 0 ? 5.0 : 0,
    },
  };
}

export async function getFormSubmissions(formId: string | number, limit = 50): Promise<FormSubmissionDetail[]> {
  const sql = getPostgresClient();
  const numId = Number(formId);
  if (!Number.isSafeInteger(numId) || numId <= 0) return [];

  const submissionRows = await sql<Array<{
    id: number | string;
    form_id: number;
    form_version: number;
    source_type: string | null;
    source_id: number | null;
    source_path: string | null;
    cta_id: number | null;
    placement_key: string | null;
    submitted_at: string;
  }>>`
    SELECT *
    FROM cic_form_submissions
    WHERE form_id = ${numId}
    ORDER BY submitted_at DESC
    LIMIT ${limit}
  `;

  if (submissionRows.length === 0) return [];

  const subIds = submissionRows.map((s) => Number(s.id));
  const valRows = await sql<Array<{
    submission_id: number;
    field_id: number;
    field_key: string;
    value_text: string | null;
    value_json: any;
    media_asset_id: number | null;
    field_label?: string | null;
    field_type?: string | null;
  }>>`
    SELECT 
      v.*,
      f.label AS field_label,
      f.field_type
    FROM cic_form_submission_values v
    LEFT JOIN cic_form_fields f ON f.id = v.field_id
    WHERE v.submission_id IN ${sql(subIds)}
    ORDER BY v.id ASC
  `;

  const deliveryRows = await sql<Array<{
    id: number;
    submission_id: number;
    destination_id: number;
    destination_type: string;
    destination_name?: string;
    status: string;
    attempt_count: number;
    last_error: string | null;
    response_metadata: any;
    idempotency_key: string | null;
    last_attempt_at: string | null;
    delivered_at: string | null;
    created_at: string;
    updated_at: string;
  }>>`
    SELECT 
      d.id,
      d.submission_id,
      d.destination_id,
      d.destination_type,
      d.status,
      d.attempt_count,
      d.last_error,
      d.response_metadata,
      d.idempotency_key,
      d.last_attempt_at,
      d.delivered_at,
      d.created_at,
      d.updated_at,
      COALESCE(dest.name, d.destination_type) AS destination_name
    FROM cic_form_submission_deliveries d
    LEFT JOIN cic_form_destinations dest ON dest.id = d.destination_id
    WHERE d.submission_id IN ${sql(subIds)}
    ORDER BY d.id ASC
  `;

  const valuesBySub = new Map<number, FormSubmissionDetail['values']>();
  for (const v of valRows) {
    const vSubId = Number(v.submission_id);
    if (!valuesBySub.has(vSubId)) {
      valuesBySub.set(vSubId, []);
    }
    valuesBySub.get(vSubId)!.push({
      fieldKey: v.field_key,
      fieldLabel: v.field_label || v.field_key,
      fieldType: v.field_type || 'text',
      valueText: v.value_text || undefined,
      valueJson: v.value_json,
      mediaAssetId: v.media_asset_id ? String(v.media_asset_id) : undefined,
    });
  }

  const deliveriesBySub = new Map<number, FormSubmissionDetail['deliveries']>();
  for (const d of deliveryRows) {
    const dSubId = Number(d.submission_id);
    if (!deliveriesBySub.has(dSubId)) {
      deliveriesBySub.set(dSubId, []);
    }
    deliveriesBySub.get(dSubId)!.push({
      id: String(d.id),
      submissionId: String(d.submission_id),
      destinationId: String(d.destination_id),
      destinationType: d.destination_type as any,
      destinationName: d.destination_name,
      status: d.status as any,
      attemptCount: d.attempt_count,
      lastError: d.last_error,
      responseMetadata: d.response_metadata,
      idempotencyKey: d.idempotency_key,
      lastAttemptAt: d.last_attempt_at ? new Date(d.last_attempt_at).toISOString() : null,
      deliveredAt: d.delivered_at ? new Date(d.delivered_at).toISOString() : null,
      createdAt: new Date(d.created_at).toISOString(),
      updatedAt: new Date(d.updated_at).toISOString(),
    });
  }

  return submissionRows.map((s) => {
    const sId = Number(s.id);
    const vals = valuesBySub.get(sId) || [];
    const delivs = deliveriesBySub.get(sId) || [];
    const nameVal = vals.find((v) => v.fieldKey === 'full_name' || v.fieldKey === 'name')?.valueText;
    const emailVal = vals.find((v) => v.fieldKey === 'email')?.valueText;
    const phoneVal = vals.find((v) => v.fieldKey === 'phone' || v.fieldKey === 'telephone')?.valueText;

    return {
      id: String(s.id),
      formId: String(s.form_id),
      formVersion: s.form_version,
      sourceType: s.source_type || undefined,
      sourceId: s.source_id || undefined,
      sourcePath: s.source_path || undefined,
      ctaId: s.cta_id ? String(s.cta_id) : undefined,
      placementKey: s.placement_key || undefined,
      submittedAt: new Date(s.submitted_at).toISOString(),
      values: vals,
      deliveries: delivs,
      customerName: nameVal,
      email: emailVal,
      phone: phoneVal,
    };
  });
}


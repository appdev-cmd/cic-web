import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { getPostgresClient } from '@/server/db/postgres';
import { listCtas } from '@/features/cta/server/queries';
import { listForms } from '@/features/forms/server/queries';
import { listEmailTemplates } from '@/features/email-templates/server/queries';
import { CtaScreen } from './CtaScreen';
import type { CtaItem } from './types';
import type { CtaEntity } from '@/features/cta/types';
import type { FormItem } from '../forms/types';
import type { FormEntity } from '@/features/forms/types';
import type { CtaDownloadFileOption } from '@/cms/data/CustomerInteractionDataSource';

function mapCtaEntityToCtaItem(entity: CtaEntity): CtaItem {
  const actionConfig = {
    ...entity.actionConfig,
    type: entity.actionType,
    formId: entity.formId ? String(entity.formId) : entity.actionConfig?.formId,
    fileId: entity.mediaAssetId ? String(entity.mediaAssetId) : entity.actionConfig?.fileId,
    emailTemplateId: entity.emailTemplateId ? String(entity.emailTemplateId) : entity.actionConfig?.emailTemplateId,
  };

  return {
    id: entity.id,
    adminName: entity.adminName,
    displayText: entity.displayText,
    description: entity.description || undefined,
    code: entity.code,
    icon: entity.icon || 'MousePointer2',
    styleVariant: entity.styleVariant || 'primary',
    actionConfig,
    status: entity.status,
    usedByCount: entity.usedByCount || 0,
    usedByPages: entity.usedByPages || [],
    analytics: entity.analytics || {
      impressions: 0,
      clicks: 0,
      ctr: 0,
    },
    governance: entity.governance || {
      origin: entity.isSystem ? 'system' : 'custom',
      allowedPlacements: entity.isSystem ? ['fixed_section', 'rich_text'] : ['rich_text'],
      fixedPlacementKeys: entity.isSystem ? [`cta.${entity.code}`] : undefined,
    },
    createdBy: entity.createdBy || 'Hệ thống',
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deletedAt: entity.deletedAt,
  };
}

function mapFormEntityToFormItem(entity: FormEntity): FormItem {
  return {
    id: entity.id,
    adminName: entity.adminName,
    title: entity.title,
    description: entity.description,
    code: entity.code,
    status: entity.status,
    currentVersion: entity.currentVersion,
    fields: entity.fields.map((f) => ({
      id: f.id || `f_${f.fieldKey}`,
      fieldKey: f.fieldKey,
      label: f.label,
      fieldType: f.fieldType as any,
      roleType: f.roleType as any,
      placeholder: f.placeholder,
      helpText: f.helpText,
      validation: f.validation || {},
      options: f.options,
      fileConfig: f.fileConfig,
      position: f.position,
      isRequired: f.isRequired,
      isLocked: f.isLocked,
    })),
    submitConfig: {
      saveToDatabase: true,
      createCustomerRequest: entity.submitConfig.createCustomerRequest,
      sendAdminEmail: entity.submitConfig.sendAdminEmail,
      adminEmails: entity.submitConfig.adminEmails || [],
      sendConfirmationEmail: entity.submitConfig.sendConfirmationEmail,
      confirmationEmailTemplate: entity.submitConfig.confirmationEmailTemplate,
      adminEmailTemplate: entity.submitConfig.adminEmailTemplate,
      successMessage: entity.submitConfig.successMessage,
      submitButtonText: entity.submitConfig.submitButtonText,
      redirectUrl: entity.submitConfig.redirectUrl,
      allowFileDownload: entity.submitConfig.allowFileDownload,
      downloadFileId: entity.submitConfig.downloadFileId,
      webhookUrl: entity.submitConfig.webhookUrl,
      crmSyncEnabled: entity.submitConfig.crmSyncEnabled,
    },
    analytics: {
      impressions: 0,
      clicks: entity.stats?.submissions || 0,
      ctr: entity.stats?.conversionRate || 0,
    },
    stats: {
      submissions: entity.stats?.submissions || 0,
      conversionRate: entity.stats?.conversionRate || 0,
    },
    governance: {
      origin: entity.isSystem ? 'system' : 'custom',
      allowedPlacements: entity.isSystem ? ['fixed_section', 'cta_action'] : ['rich_text', 'cta_action'],
      fixedPlacementKeys: entity.isSystem ? [`form.${entity.code}`] : undefined,
    },
    createdBy: entity.createdBy || 'Hệ thống',
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deletedAt: entity.deletedAt,
  };
}

async function getDownloadFiles(locale: 'vi' | 'en'): Promise<CtaDownloadFileOption[]> {
  try {
    const sql = getPostgresClient();
    const rows = await sql`
      SELECT a.id, a.filename, coalesce(t.title, a.filename) as title
      FROM cic_media_assets a
      LEFT JOIN cic_media_asset_translations t ON t.asset_id = a.id AND t.locale = ${locale}
      WHERE a.deleted_at IS NULL AND a.workflow_status = 'ready'
      ORDER BY a.updated_at DESC
      LIMIT 50
    `;
    return rows.map((r: any) => ({
      id: String(r.id),
      title: String(r.title),
      filename: String(r.filename),
    }));
  } catch (err) {
    console.error('[CtaRoute] getDownloadFiles error:', err);
    return [];
  }
}

export async function CtaRoute() {
  const principal = await requireCmsPageAccess();
  if (
    !can(principal, 'cta', 'view') &&
    !can(principal, 'contents', 'view') &&
    !principal.isAdministrator
  ) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem CTA (Nút kêu gọi hành động).
      </div>
    );
  }

  const [
    viCtasRaw,
    enCtasRaw,
    viFormsRaw,
    enFormsRaw,
    viTemplates,
    enTemplates,
    viDownloads,
    enDownloads,
  ] = await Promise.all([
    listCtas({ workspace: 'vi' }),
    listCtas({ workspace: 'en' }),
    listForms({ workspace: 'vi' }),
    listForms({ workspace: 'en' }),
    listEmailTemplates({ workspace: 'vi' }),
    listEmailTemplates({ workspace: 'en' }),
    getDownloadFiles('vi'),
    getDownloadFiles('en'),
  ]);

  const initialCtas = {
    vi: viCtasRaw.map(mapCtaEntityToCtaItem),
    en: enCtasRaw.map(mapCtaEntityToCtaItem),
  };

  const forms = {
    vi: viFormsRaw.map(mapFormEntityToFormItem),
    en: enFormsRaw.map(mapFormEntityToFormItem),
  };

  const emailTemplates = {
    vi: viTemplates,
    en: enTemplates,
  };

  const downloadFiles = {
    vi: viDownloads,
    en: enDownloads,
  };

  const canEdit =
    can(principal, 'cta', 'edit') ||
    can(principal, 'contents', 'edit') ||
    principal.isAdministrator;

  const canCreate =
    can(principal, 'cta', 'create') ||
    can(principal, 'contents', 'create') ||
    principal.isAdministrator;

  const canDelete =
    can(principal, 'cta', 'delete') ||
    can(principal, 'contents', 'delete') ||
    principal.isAdministrator;

  return (
    <CtaScreen
      initialCtas={initialCtas}
      forms={forms}
      emailTemplates={emailTemplates}
      downloadFiles={downloadFiles}
      capabilities={{
        create: canCreate,
        edit: canEdit,
        delete: canDelete,
      }}
    />
  );
}

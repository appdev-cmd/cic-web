import { can } from '@/server/auth/guards';
import { requireCmsPageAccess } from '@/server/auth/page-guards';
import { listForms } from '@/features/forms/server/queries';
import { listEmailTemplates } from '@/features/email-templates/server/queries';
import { FormsScreen } from './FormsScreen';
import type { FormItem } from './types';
import type { FormEntity } from '@/features/forms/types';

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

export async function FormsRoute() {
  const principal = await requireCmsPageAccess();
  if (
    !can(principal, 'forms', 'view') &&
    !can(principal, 'contents', 'view') &&
    !principal.isAdministrator
  ) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm font-semibold text-amber-800">
        Bạn không có quyền xem Biểu mẫu.
      </div>
    );
  }

  const [viFormsRaw, enFormsRaw, viTemplates, enTemplates] = await Promise.all([
    listForms({ workspace: 'vi' }),
    listForms({ workspace: 'en' }),
    listEmailTemplates({ workspace: 'vi' }),
    listEmailTemplates({ workspace: 'en' }),
  ]);

  const initialForms = {
    vi: viFormsRaw.map(mapFormEntityToFormItem),
    en: enFormsRaw.map(mapFormEntityToFormItem),
  };

  const emailTemplates = {
    vi: viTemplates,
    en: enTemplates,
  };

  const canEdit =
    can(principal, 'forms', 'edit') ||
    can(principal, 'contents', 'edit') ||
    principal.isAdministrator;

  const canCreate =
    can(principal, 'forms', 'create') ||
    can(principal, 'contents', 'create') ||
    principal.isAdministrator;

  const canDelete =
    can(principal, 'forms', 'delete') ||
    can(principal, 'contents', 'delete') ||
    principal.isAdministrator;

  return (
    <FormsScreen
      initialForms={initialForms}
      emailTemplates={emailTemplates}
      capabilities={{
        create: canCreate,
        edit: canEdit,
        delete: canDelete,
      }}
    />
  );
}

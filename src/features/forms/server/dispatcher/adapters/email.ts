import 'server-only';
import type { FormDestinationEntity, EmailDestinationConfig } from '@/features/forms/types';
import type { IDestinationAdapter, FormSubmissionContext, DeliveryResult } from '../types';
import { dispatchTemplatedEmail } from '@/lib/email/dispatcher';
import { sendEmail } from '@/lib/email/transporter';
import { escapeHtml } from '@/lib/email/tokens';

export class EmailDestinationAdapter implements IDestinationAdapter {
  readonly type = 'email';

  async deliver(destination: FormDestinationEntity, context: FormSubmissionContext): Promise<DeliveryResult> {
    const config = destination.config as EmailDestinationConfig;

    if (!config?.sendAdminEmail && !config?.sendConfirmationEmail) {
      return {
        destinationId: destination.id,
        destinationType: this.type,
        destinationName: destination.name,
        status: 'success',
        responseMetadata: { note: 'Không có tùy chọn gửi email nào được bật trong cấu hình.' },
      };
    }

    try {
      const formattedValues: Record<string, string> = {};
      for (const [key, f] of Object.entries(context.fields)) {
        formattedValues[f.label || key] = String(f.value ?? '');
      }

      const errors: string[] = [];

      // 1. Admin Email Notification
      if (config.sendAdminEmail) {
        try {
          const adminRecipients = Array.isArray(config.adminEmails) && config.adminEmails.length > 0
            ? config.adminEmails
            : [process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'nampt@cic.com.vn'];

          const adminTemplateId = config.adminEmailTemplateId ? Number(config.adminEmailTemplateId) : null;

          if (adminTemplateId && Number.isSafeInteger(adminTemplateId) && adminTemplateId > 0) {
            await dispatchTemplatedEmail({
              workspace: context.workspace === 'en' ? 'en' : 'vi',
              templateId: adminTemplateId,
              audience: 'internal',
              to: adminRecipients,
              variables: {
                '{{customer.full_name}}': context.customerName,
                '{{customer.email}}': context.customerEmail,
                '{{customer.phone}}': context.customerPhone,
                '{{form.title}}': context.formTitle,
                '{{submission.id}}': context.submissionId,
                ...formattedValues,
              },
            });
          } else {
            const tableRows = Object.entries(formattedValues)
              .map(
                ([lbl, v]) =>
                  `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>${escapeHtml(lbl)}:</strong></td><td style="padding: 8px 0; color: #1e293b;">${escapeHtml(v)}</td></tr>`
              )
              .join('');

            await sendEmail({
              to: adminRecipients,
              subject: `[Biểu mẫu] Lượt gửi mới: ${context.formTitle} - ${context.customerName}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <h3 style="color: #ea580c; margin-top: 0;">Thông báo: Lượt gửi biểu mẫu mới</h3>
                  <p>Biểu mẫu: <strong>${escapeHtml(context.formTitle)}</strong></p>
                  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">${tableRows}</table>
                  <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin: 0;">Mã lượt gửi: ${escapeHtml(context.submissionId)} · Đã lưu vào CSDL hệ thống.</p>
                </div>
              `,
            });
          }
        } catch (adminErr: any) {
          console.error('[EmailAdapter] Admin email dispatch error:', adminErr);
          errors.push(`Admin email: ${adminErr?.message || 'Lỗi gửi mail'}`);
        }
      }

      // 2. Customer Confirmation Email
      if (config.sendConfirmationEmail && context.customerEmail && context.customerEmail.includes('@')) {
        try {
          const confirmTemplateId = config.confirmationEmailTemplateId
            ? Number(config.confirmationEmailTemplateId)
            : null;

          if (confirmTemplateId && Number.isSafeInteger(confirmTemplateId) && confirmTemplateId > 0) {
            await dispatchTemplatedEmail({
              workspace: context.workspace === 'en' ? 'en' : 'vi',
              templateId: confirmTemplateId,
              audience: 'customer',
              to: context.customerEmail,
              variables: {
                '{{customer.full_name}}': context.customerName,
                '{{customer.email}}': context.customerEmail,
                '{{customer.phone}}': context.customerPhone,
                '{{form.title}}': context.formTitle,
                '{{submission.id}}': context.submissionId,
                ...formattedValues,
              },
            });
          } else {
            await sendEmail({
              to: context.customerEmail,
              subject: `[CIC Technology] Tiếp nhận biểu mẫu: ${context.formTitle}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                  <h3 style="color: #ea580c; margin-top: 0;">CIC Technology & Consultancy</h3>
                  <p>Kính gửi <strong>${escapeHtml(context.customerName)}</strong>,</p>
                  <p>Cảm ơn Quý khách đã gửi thông tin qua biểu mẫu <strong>${escapeHtml(context.formTitle)}</strong> của CIC Technology.</p>
                  <p>${escapeHtml(context.successMessage) || 'Chúng tôi đã tiếp nhận thông tin và sẽ liên hệ phản hồi sớm nhất có thể.'}</p>
                  <p style="font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 20px;">Trân trọng,<br/><strong>CIC Technology</strong></p>
                </div>
              `,
            });
          }
        } catch (customerErr: any) {
          console.error('[EmailAdapter] Customer confirmation email error:', customerErr);
          errors.push(`Customer email: ${customerErr?.message || 'Lỗi gửi mail'}`);
        }
      }

      if (errors.length > 0) {
        return {
          destinationId: destination.id,
          destinationType: this.type,
          destinationName: destination.name,
          status: 'failed',
          lastError: errors.join('; '),
        };
      }

      return {
        destinationId: destination.id,
        destinationType: this.type,
        destinationName: destination.name,
        status: 'success',
        responseMetadata: {
          sentAt: new Date().toISOString(),
          adminEmailCount: config.sendAdminEmail ? config.adminEmails?.length || 1 : 0,
          customerEmailSent: Boolean(config.sendConfirmationEmail && context.customerEmail),
        },
      };
    } catch (err: any) {
      console.error('[EmailAdapter Delivery Error]', err);
      return {
        destinationId: destination.id,
        destinationType: this.type,
        destinationName: destination.name,
        status: 'failed',
        lastError: err?.message || 'Lỗi không xác định khi gửi email.',
      };
    }
  }
}

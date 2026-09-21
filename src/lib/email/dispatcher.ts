import { getEmailTemplateForEvent, getActiveEmailTemplateContent } from '@/features/email-templates/server/queries';
import { interpolateTokens } from './tokens';
import { sendEmail, SendMailResult } from './transporter';

export interface DispatchEmailOptions {
  workspace?: 'vi' | 'en';
  eventKey?: string;
  templateId?: string | number;
  audience?: 'customer' | 'internal';
  to: string | string[];
  variables: Record<string, string | number | undefined | null>;
  fallbackSubject?: string;
  fallbackContent?: string;
  bcc?: string | string[];
  replyTo?: string;
}

export async function dispatchTemplatedEmail({
  workspace = 'vi',
  eventKey,
  templateId,
  audience = 'customer',
  to,
  variables,
  fallbackSubject,
  fallbackContent,
  bcc,
  replyTo,
}: DispatchEmailOptions): Promise<SendMailResult & { templateUsed?: boolean; templateId?: string }> {
  try {
    let tmpl: { subject: string; content: string; templateId: string } | null = null;

    if (templateId) {
      tmpl = await getActiveEmailTemplateContent(templateId);
    }
    if (!tmpl && eventKey) {
      tmpl = await getEmailTemplateForEvent(workspace, eventKey, audience);
    }

    let rawSubject = tmpl?.subject || fallbackSubject || `[CIC] Thông báo`;
    let rawContent = tmpl?.content || fallbackContent || `Nội dung thông báo từ CIC`;

    const subject = interpolateTokens(rawSubject, variables, { isHtml: false });
    const isHtml = /<[a-z][\s\S]*>/i.test(rawContent);
    const content = interpolateTokens(rawContent, variables, { isHtml });

    const result = await sendEmail({
      to,
      subject,
      html: isHtml ? content : undefined,
      text: !isHtml ? content : undefined,
      bcc,
      replyTo,
    });

    return {
      ...result,
      templateUsed: Boolean(tmpl),
      templateId: tmpl?.templateId,
    };
  } catch (error: any) {
    console.error('[Dispatch Email Error]', error);
    return {
      success: false,
      error: error?.message || 'Failed to dispatch email',
    };
  }
}

import nodemailer from 'nodemailer';

const isConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

export const mailTransporter = isConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  bcc?: string | string[];
  replyTo?: string;
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  previewUrl?: string | false;
  error?: string;
}

export function getMailTransporter() {
  const isConfigured = Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
  if (!isConfigured) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail({ to, subject, html, text, bcc, replyTo }: SendMailOptions): Promise<SendMailResult> {
  const fromName = process.env.MAIL_FROM_NAME || 'CIC Technology & Consultancy';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'noreply@cic.com.vn';
  const adminBcc = process.env.ADMIN_NOTIFICATION_EMAIL;

  const transporter = getMailTransporter();

  // If SMTP is not configured, simulate safely
  if (!transporter) {
    console.info(
      `[Email Transporter (Simulated)]\nTo: ${Array.isArray(to) ? to.join(', ') : to}\nSubject: ${subject}\nBCC: ${bcc || adminBcc || 'none'}\nLength: ${(html || text || '').length} chars`
    );
    return {
      success: true,
      simulated: true,
      messageId: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      html: html || (text ? `<pre>${text}</pre>` : ''),
      text: text || (html ? html.replace(/<[^>]+>/g, ' ') : ''),
      bcc: bcc || adminBcc,
      replyTo: replyTo || fromAddress,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (error: any) {
    console.error('[Email Transporter Error]', error);
    return {
      success: false,
      error: error?.message || 'Failed to send email via SMTP transporter',
    };
  }
}

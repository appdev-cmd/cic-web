'use server';

import { contactInputSchema } from '../schemas/contactInput';
import { getDatabaseClient } from '@/server/db/foundation';
import { getPostgresClient } from '@/server/db/postgres';
import { customerInteractionInputSchema } from '../schemas/customerInteractionInput';
import { sendEmail } from '@/lib/email/transporter';


export async function submitContactAction(payload: unknown) {
  const input = contactInputSchema.parse(payload);
  const client = await getDatabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await client
    .from('cic_contact')
    .insert({
      ...input,
      edited_time: now,
      created_time: now,
      published: false,
    })
    .select('id,created_time')
    .single();

  if (error || !data) throw new Error('Unable to submit contact request.');

  // Initialize operational overlay in background / transaction
  try {
    const sql = getPostgresClient();
    const [state] = await sql`
      INSERT INTO cic_customer_request_states (
        workspace, source_type, source_id, status, priority, tags, created_at, updated_at
      ) VALUES (
        'vi', 'contact', ${data.id}, 'new', 'medium', '{}', now(), now()
      )
      ON CONFLICT (workspace, source_type, source_id) DO NOTHING
      RETURNING id
    `;
    if (state?.id) {
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'created', NULL, ${sql.json({ source: 'contact_form', formCode: 'form_lienhe', subject: input.subject || 'Liên hệ mới' })}, NULL, now()
        )
      `;
    }
  } catch (err) {
    console.error('[submitContactAction] Error initializing customer request state:', err);
  }

  // Send automatic email notifications
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'nampt@cic.com.vn';
    const customerName = input.fullname || 'Khách hàng';
    const contactSubject = input.subject || 'Yêu cầu liên hệ mới';

    // 1. Send notification to admin
    await sendEmail({
      to: adminEmail,
      subject: `[CIC Web] Liên hệ mới: ${customerName} - ${contactSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #ea580c; margin-top: 0;">Thông báo: Yêu cầu liên hệ mới từ Website</h3>
          <p>Hệ thống vừa tiếp nhận một yêu cầu liên hệ mới từ khách hàng qua form liên hệ hệ thống:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Họ và tên:</strong></td><td style="padding: 8px 0; color: #1e293b;"><strong>${customerName}</strong></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${input.email}">${input.email}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Số điện thoại:</strong></td><td style="padding: 8px 0; color: #1e293b;">${input.telephone || 'Chưa cung cấp'}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Tiêu đề:</strong></td><td style="padding: 8px 0; color: #1e293b;">${contactSubject}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Nội dung:</strong></td><td style="padding: 8px 0; color: #1e293b; white-space: pre-wrap;">${input.message || 'Không có nội dung tin nhắn'}</td></tr>
          </table>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 12px;">Yêu cầu này đã được đồng bộ vào hệ thống quản lý CMS Yêu cầu khách hàng.</p>
        </div>
      `,
    });

    // 2. Send confirmation to customer
    if (input.email) {
      await sendEmail({
        to: input.email,
        subject: `[CIC Technology] Xác nhận tiếp nhận thông tin liên hệ của Quý khách`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #ea580c; margin-top: 0;">CIC Technology & Consultancy</h3>
            <p>Kính gửi <strong>${customerName}</strong>,</p>
            <p>Cảm ơn Quý khách đã gửi thông tin liên hệ tới <strong>Công ty Cổ phần Công nghệ và Tư vấn CIC</strong>.</p>
            <p>Chúng tôi đã tiếp nhận yêu cầu với nội dung: <em>"${contactSubject}"</em>. Bộ phận chuyên trách của CIC sẽ liên hệ lại với Quý khách trong thời gian sớm nhất.</p>
            <div style="background-color: #f8fafc; padding: 12px 16px; border-left: 4px solid #ea580c; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Hotline hỗ trợ:</strong> 024 3974 1373 - 0866 059 659</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #475569;"><strong>Email:</strong> info@cic.com.vn | <strong>Website:</strong> https://www.cic.com.vn</p>
            </div>
            <p style="font-size: 13px; color: #64748b;">Trân trọng cảm ơn,<br/><strong>Đội ngũ Chăm sóc Khách hàng CIC Technology</strong></p>
          </div>
        `,
      });
    }
  } catch (emailErr) {
    console.error('[submitContactAction] Error sending notification email:', emailErr);
  }

  return { ok: true };
}

export async function submitCustomerInteractionAction(payload: unknown) {
  const input = customerInteractionInputSchema.parse(payload);
  const values = input.values;
  const now = new Date().toISOString();
  const client = await getDatabaseClient();

  const email = typeof values.email === 'string' ? values.email.trim() : '';

  const fullname =
    typeof values.fullName === 'string' && values.fullName.trim()
      ? values.fullName.trim()
      : typeof values.fullname === 'string' && values.fullname.trim()
      ? values.fullname.trim()
      : typeof values.name === 'string' && values.name.trim()
      ? values.name.trim()
      : null;

  const telephone =
    typeof values.phone === 'string' && values.phone.trim()
      ? values.phone.trim()
      : typeof values.phoneNumber === 'string' && values.phoneNumber.trim()
      ? values.phoneNumber.trim()
      : typeof values.telephone === 'string' && values.telephone.trim()
      ? values.telephone.trim()
      : null;

  const subject =
    typeof values.subject === 'string' && values.subject.trim()
      ? values.subject.trim()
      : input.formName || 'Yêu cầu liên hệ';

  const message =
    typeof values.message === 'string' && values.message.trim()
      ? values.message.trim()
      : typeof values.note === 'string' && values.note.trim()
      ? values.note.trim()
      : typeof values.notes === 'string' && values.notes.trim()
      ? values.notes.trim()
      : null;

  const { data, error } = await client
    .from('cic_contact')
    .insert({
      email,
      fullname,
      telephone,
      subject,
      message,
      parts_email: JSON.stringify({ formId: input.formId, source: input.source, values }),
      edited_time: now,
      created_time: now,
      published: false,
    })
    .select('id,created_time')
    .single();

  if (error || !data) throw new Error('Unable to submit customer request.');

  // Initialize operational overlay in customer request states
  try {
    const sql = getPostgresClient();
    const [state] = await sql`
      INSERT INTO cic_customer_request_states (
        workspace, source_type, source_id, status, priority, tags, created_at, updated_at
      ) VALUES (
        'vi', 'contact', ${data.id}, 'new', 'medium', '{}', now(), now()
      )
      ON CONFLICT (workspace, source_type, source_id) DO NOTHING
      RETURNING id
    `;
    if (state?.id) {
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'created', NULL, ${sql.json({ formId: input.formId, source: input.source, subject })}, NULL, now()
        )
      `;
    }
  } catch (err) {
    console.error('[submitCustomerInteractionAction] Error initializing customer request state:', err);
  }

  // Send automatic email notifications for customer interaction
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'nampt@cic.com.vn';
    const customerName = fullname || 'Khách hàng';
    const formTitle = input.formName || 'Đăng ký tư vấn';

    // 1. Send notification to admin
    await sendEmail({
      to: adminEmail,
      subject: `[CIC Web] ${formTitle}: ${customerName} (${email || telephone || 'N/A'})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #ea580c; margin-top: 0;">Thông báo: ${formTitle} mới từ Website</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Biểu mẫu:</strong></td><td style="padding: 8px 0; color: #1e293b;"><strong>${formTitle}</strong></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Khách hàng:</strong></td><td style="padding: 8px 0; color: #1e293b;"><strong>${customerName}</strong></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${email}">${email || 'Chưa cung cấp'}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Số điện thoại:</strong></td><td style="padding: 8px 0; color: #1e293b;">${telephone || 'Chưa cung cấp'}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Nguồn phát sinh:</strong></td><td style="padding: 8px 0; color: #1e293b;">${input.source || 'Trang web'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Nội dung / Ghi chú:</strong></td><td style="padding: 8px 0; color: #1e293b; white-space: pre-wrap;">${message || 'Không có ghi chú thêm'}</td></tr>
          </table>
          <p style="font-size: 13px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 12px;">Đã tự động lưu vào hệ thống Yêu cầu khách hàng (Customer Requests).</p>
        </div>
      `,
    });

    // 2. Send confirmation to customer if email is present
    if (email && email.includes('@')) {
      await sendEmail({
        to: email,
        subject: `[CIC Technology] Xác nhận tiếp nhận: ${formTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #ea580c; margin-top: 0;">CIC Technology & Consultancy</h3>
            <p>Kính gửi <strong>${customerName}</strong>,</p>
            <p>Cảm ơn Quý khách đã gửi yêu cầu <strong>${formTitle}</strong> tại website <strong>CIC Technology</strong>.</p>
            <p>Chúng tôi đã tiếp nhận thông tin và chuyên viên phụ trách sẽ liên hệ tư vấn trong thời gian sớm nhất.</p>
            <div style="background-color: #f8fafc; padding: 12px 16px; border-left: 4px solid #ea580c; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Hotline hỗ trợ:</strong> 024 3974 1373 - 0866 059 659</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #475569;"><strong>Email:</strong> info@cic.com.vn | <strong>Website:</strong> https://www.cic.com.vn</p>
            </div>
            <p style="font-size: 13px; color: #64748b;">Trân trọng cảm ơn,<br/><strong>Đội ngũ Kỹ thuật & Tư vấn CIC Technology</strong></p>
          </div>
        `,
      });
    }
  } catch (emailErr) {
    console.error('[submitCustomerInteractionAction] Error sending notification email:', emailErr);
  }

  return { requestId: String(data.id), submittedAt: String(data.created_time) };
}

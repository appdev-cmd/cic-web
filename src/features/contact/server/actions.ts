'use server';

import { headers } from 'next/headers';
import { contactInputSchema } from '../schemas/contactInput';
import { getDatabaseClient } from '@/server/db/foundation';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { getPostgresClient } from '@/server/db/postgres';
import { customerInteractionInputSchema } from '../schemas/customerInteractionInput';
import { sendEmail } from '@/lib/email/transporter';
import { escapeHtml } from '@/lib/email/tokens';
import { checkRateLimit, getClientIp } from '@/server/auth/rate-limit';
import { createCmsNotification } from '@/server/notifications/service';
import { analyzeCustomerRequestWithAi, type AiTriageResult } from '@/features/customer-requests/server/ai-triage';


export async function submitContactAction(payload: unknown) {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const rateLimit = checkRateLimit(`contact:${ip}`, { maxRequests: 10, windowSeconds: 60 });
  if (!rateLimit.success) {
    throw new Error('Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.');
  }

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

  // 1. Run AI Lead Triage
  let aiResult: AiTriageResult;
  try {
    aiResult = await analyzeCustomerRequestWithAi({
      fullname: input.fullname,
      email: input.email,
      telephone: input.telephone,
      subject: input.subject,
      message: input.message,
      formName: 'Biểu mẫu liên hệ chính',
    });
  } catch (triageErr) {
    console.error('[submitContactAction] AI triage error:', triageErr);
    aiResult = {
      category: 'qualified',
      confidence: 50,
      priority: 'medium',
      suggestedStatus: 'new',
      tags: ['ai:qualified'],
      summary: `Liên hệ từ ${input.fullname || 'khách hàng'}`,
      reason: 'Tiếp nhận thông thường.',
      identifiedProducts: [],
      suggestedAction: 'Liên hệ tư vấn.',
    };
  }

  // 2. Initialize operational overlay with AI results
  try {
    const sql = getPostgresClient();
    const [state] = await sql`
      INSERT INTO cic_customer_request_states (
        workspace, source_type, source_id, status, priority, tags, created_at, updated_at
      ) VALUES (
        'vi', 'contact', ${data.id}, ${aiResult.suggestedStatus}, ${aiResult.priority}, ${aiResult.tags}, now(), now()
      )
      ON CONFLICT (workspace, source_type, source_id) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        priority = EXCLUDED.priority,
        tags = EXCLUDED.tags,
        updated_at = now()
      RETURNING id
    `;
    if (state?.id) {
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'created', NULL, ${sql.json({ source: 'contact_form', formCode: 'form_lienhe', subject: input.subject || 'Liên hệ mới', ai: aiResult } as never)}, NULL, now()
        )
      `;

      // Insert AI analysis note into cic_customer_request_notes
      const noteContent =
        aiResult.category === 'enterprise'
          ? `[AI Thẩm định] ⭐ KHÁCH HÀNG DOANH NGHIỆP LỚN / VIP (Độ tin cậy: ${aiResult.confidence}%)\n- Tóm tắt: ${aiResult.summary}\n- Phần mềm nhận diện: ${aiResult.identifiedProducts.join(', ') || 'N/A'}\n- Đề xuất: ${aiResult.suggestedAction}`
          : aiResult.category === 'irrelevant'
          ? `[AI Thẩm định] 🚫 KHÔNG LIÊN QUAN / RÁC (Độ tin cậy: ${aiResult.confidence}%)\n- Lý do: ${aiResult.reason}\n- Tóm tắt: ${aiResult.summary}\n- Hệ thống đã tự động chuyển sang trạng thái: Không phù hợp (not_suitable).`
          : `[AI Thẩm định] 💼 KHÁCH TIỀM NĂNG CHUẨN (Độ tin cậy: ${aiResult.confidence}%)\n- Tóm tắt: ${aiResult.summary}\n- Phần mềm nhận diện: ${aiResult.identifiedProducts.join(', ') || 'N/A'}\n- Đề xuất: ${aiResult.suggestedAction}`;

      await sql`
        INSERT INTO cic_customer_request_notes (
          request_state_id, content, created_by, created_at
        ) VALUES (
          ${state.id}, ${noteContent}, NULL, now()
        )
      `;
    }
  } catch (err) {
    console.error('[submitContactAction] Error initializing customer request state:', err);
  }

  // 3. Trigger CMS Notification (Skip notification for irrelevant/spam to avoid noise)
  if (aiResult.category !== 'irrelevant') {
    const isEnterprise = aiResult.category === 'enterprise';
    void createCmsNotification({
      title: `${isEnterprise ? '[⭐ VIP] ' : ''}Liên hệ mới: ${input.fullname || 'Khách hàng'}`,
      description: `${aiResult.summary} (SĐT: ${input.telephone || 'Chưa cung cấp'})`,
      type: 'contact',
      priority: isEnterprise ? 'urgent' : 'normal',
      targetModule: 'customer_requests',
      targetAction: 'view',
      linkUrl: `/cms/customer-requests?search=${encodeURIComponent(input.email || input.fullname || '')}`,
      metadata: {
        contactId: data.id,
        name: input.fullname,
        email: input.email,
        telephone: input.telephone,
        subject: input.subject,
        aiCategory: aiResult.category,
        aiScore: aiResult.confidence,
      },
    });
  }

  // Send automatic email notifications
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'nampt@cic.com.vn';
    const customerName = escapeHtml(input.fullname || 'Khách hàng');
    const contactSubject = escapeHtml(input.subject || 'Yêu cầu liên hệ mới');
    const safeEmail = escapeHtml(input.email);
    const safeTelephone = escapeHtml(input.telephone || 'Chưa cung cấp');
    const safeMessage = escapeHtml(input.message || 'Không có nội dung tin nhắn');

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
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Số điện thoại:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safeTelephone}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Tiêu đề:</strong></td><td style="padding: 8px 0; color: #1e293b;">${contactSubject}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Nội dung:</strong></td><td style="padding: 8px 0; color: #1e293b; white-space: pre-wrap;">${safeMessage}</td></tr>
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
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const rateLimit = checkRateLimit(`interaction:${ip}`, { maxRequests: 10, windowSeconds: 60 });
  if (!rateLimit.success) {
    throw new Error('Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.');
  }

  const input = customerInteractionInputSchema.parse(payload);
  const values = input.values;
  const now = new Date().toISOString();
  let client;
  try {
    client = createSupabaseAdminClient();
  } catch {
    client = await getDatabaseClient();
  }

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

  const sql = getPostgresClient();
  let data: { id: number; created_time: string };
  try {
    const [row] = await sql`
      INSERT INTO cic_contact (
        email, fullname, telephone, subject, message, parts_email, edited_time, created_time, published
      ) VALUES (
        ${email}, ${fullname}, ${telephone}, ${subject}, ${message}, ${JSON.stringify({ formId: input.formId, source: input.source, values })}, ${now}, ${now}, false
      )
      RETURNING id, created_time
    `;
    data = row as { id: number; created_time: string };
  } catch (dbErr: any) {
    console.error('[submitCustomerInteractionAction DB error]:', dbErr);
    throw new Error('Unable to submit customer request: ' + (dbErr?.message || 'db error'));
  }

  // 1. Run AI Lead Triage
  let aiResult: AiTriageResult;
  try {
    aiResult = await analyzeCustomerRequestWithAi({
      fullname,
      email,
      telephone,
      subject,
      message,
      formName: input.formName,
      values: input.values,
    });
  } catch (triageErr) {
    console.error('[submitCustomerInteractionAction] AI triage error:', triageErr);
    aiResult = {
      category: 'qualified',
      confidence: 50,
      priority: 'medium',
      suggestedStatus: 'new',
      tags: ['ai:qualified'],
      summary: `Yêu cầu từ ${fullname || 'khách hàng'}: ${subject || 'Tư vấn'}`,
      reason: 'Tiếp nhận thông thường.',
      identifiedProducts: [],
      suggestedAction: 'Liên hệ tư vấn.',
    };
  }

  // 2. Initialize operational overlay with AI results
  try {
    const sql = getPostgresClient();
    const [state] = await sql`
      INSERT INTO cic_customer_request_states (
        workspace, source_type, source_id, status, priority, tags, created_at, updated_at
      ) VALUES (
        'vi', 'contact', ${data.id}, ${aiResult.suggestedStatus}, ${aiResult.priority}, ${aiResult.tags}, now(), now()
      )
      ON CONFLICT (workspace, source_type, source_id) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        priority = EXCLUDED.priority,
        tags = EXCLUDED.tags,
        updated_at = now()
      RETURNING id
    `;
    if (state?.id) {
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'created', NULL, ${sql.json({ formId: input.formId, source: input.source, subject, ai: aiResult } as never)}, NULL, now()
        )
      `;

      // Insert AI analysis note into cic_customer_request_notes
      const noteContent =
        aiResult.category === 'enterprise'
          ? `[AI Thẩm định] ⭐ KHÁCH HÀNG DOANH NGHIỆP LỚN / VIP (Độ tin cậy: ${aiResult.confidence}%)\n- Tóm tắt: ${aiResult.summary}\n- Phần mềm nhận diện: ${aiResult.identifiedProducts.join(', ') || 'N/A'}\n- Đề xuất: ${aiResult.suggestedAction}`
          : aiResult.category === 'irrelevant'
          ? `[AI Thẩm định] 🚫 KHÔNG LIÊN QUAN / RÁC (Độ tin cậy: ${aiResult.confidence}%)\n- Lý do: ${aiResult.reason}\n- Tóm tắt: ${aiResult.summary}\n- Hệ thống đã tự động chuyển sang trạng thái: Không phù hợp (not_suitable).`
          : `[AI Thẩm định] 💼 KHÁCH TIỀM NĂNG CHUẨN (Độ tin cậy: ${aiResult.confidence}%)\n- Tóm tắt: ${aiResult.summary}\n- Phần mềm nhận diện: ${aiResult.identifiedProducts.join(', ') || 'N/A'}\n- Đề xuất: ${aiResult.suggestedAction}`;

      await sql`
        INSERT INTO cic_customer_request_notes (
          request_state_id, content, created_by, created_at
        ) VALUES (
          ${state.id}, ${noteContent}, NULL, now()
        )
      `;
    }
  } catch (err) {
    console.error('[submitCustomerInteractionAction] Error initializing customer request state:', err);
  }

  // 3. Trigger CMS Notification (Skip notification for irrelevant/spam to avoid noise)
  if (aiResult.category !== 'irrelevant') {
    const isQuoteRequest =
      input.source?.ctaName?.toLowerCase().includes('báo giá') ||
      input.source?.pageTitle?.toLowerCase().includes('báo giá') ||
      input.formName?.toLowerCase().includes('báo giá') ||
      Boolean(subject?.toLowerCase().includes('báo giá'));
    const isEnterprise = aiResult.category === 'enterprise';

    void createCmsNotification({
      title: `${isEnterprise ? '[⭐ VIP] ' : ''}${isQuoteRequest ? 'Yêu cầu báo giá mới' : 'Yêu cầu tư vấn mới'}: ${fullname || 'Khách hàng'}`,
      description: `${aiResult.summary} (SĐT: ${telephone || 'Chưa cung cấp'})`,
      type: isQuoteRequest ? 'quote' : 'contact',
      priority: isEnterprise ? 'urgent' : 'normal',
      targetModule: 'customer_requests',
      targetAction: 'view',
      linkUrl: `/cms/customer-requests?search=${encodeURIComponent(email || fullname || '')}`,
      metadata: {
        contactId: data.id,
        name: fullname,
        email,
        telephone,
        formName: input.formName,
        source: input.source,
        subject,
        aiCategory: aiResult.category,
        aiScore: aiResult.confidence,
      },
    });
  }

  // Send automatic email notifications for customer interaction
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'nampt@cic.com.vn';
    const customerName = escapeHtml(fullname || 'Khách hàng');
    const formTitle = escapeHtml(input.formName || 'Đăng ký tư vấn');
    const safeEmail = escapeHtml(email || 'Chưa cung cấp');
    const safeTelephone = escapeHtml(telephone || 'Chưa cung cấp');
    const safeSource = escapeHtml(input.source || 'Trang web');
    const safeMessage = escapeHtml(message || 'Không có ghi chú thêm');

    // 1. Send notification to admin
    await sendEmail({
      to: adminEmail,
      subject: `[CIC Web] ${formTitle}: ${customerName} (${safeEmail || safeTelephone || 'N/A'})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #ea580c; margin-top: 0;">Thông báo: ${formTitle} mới từ Website</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Biểu mẫu:</strong></td><td style="padding: 8px 0; color: #1e293b;"><strong>${formTitle}</strong></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Khách hàng:</strong></td><td style="padding: 8px 0; color: #1e293b;"><strong>${customerName}</strong></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Số điện thoại:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safeTelephone}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Nguồn phát sinh:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safeSource}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Nội dung / Ghi chú:</strong></td><td style="padding: 8px 0; color: #1e293b; white-space: pre-wrap;">${safeMessage}</td></tr>
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

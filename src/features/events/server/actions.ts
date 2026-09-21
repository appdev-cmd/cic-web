'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { requirePermission } from '@/server/auth/guards';
import { z } from 'zod';
import { eventInputSchema } from '../schemas/eventInput';
import { escapeHtml } from '@/lib/email/tokens';
import { checkRateLimit, getClientIp } from '@/server/auth/rate-limit';
import {
  saveEvent,
  setEventsPublished,
  trashEvent,
} from './repository';
import type { EventLocale } from '../types';

const localeSchema = z.enum(['vi', 'en']);
const idSchema = z.coerce.number().int().positive();
const idsSchema = z.array(idSchema).min(1);

function revalidateEvents() {
  revalidatePath('/events');
  revalidatePath('/events/[slug]', 'page');
  revalidatePath('/cms/events');
  revalidatePath('/');
}

export async function saveEventAction(
  localeRaw: unknown,
  idRaw: unknown,
  payloadRaw: unknown
) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const id = idRaw ? idSchema.parse(idRaw) : null;
  const input = eventInputSchema.parse(payloadRaw);

  const actor = await requirePermission('events', id ? 'edit' : 'create');
  const result = await saveEvent(locale, id, input, actor);
  revalidateEvents();
  return result;
}

export async function setEventsPublishedAction(
  localeRaw: unknown,
  idsRaw: unknown,
  publishedRaw: unknown
) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const ids = idsSchema.parse(idsRaw);
  const published = z.boolean().parse(publishedRaw);

  const actor = await requirePermission('events', 'edit');
  await setEventsPublished(locale, ids, published, actor);
  revalidateEvents();
  return { ok: true, count: ids.length };
}

export async function trashEventAction(localeRaw: unknown, idRaw: unknown) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const id = idSchema.parse(idRaw);

  const actor = await requirePermission('events', 'delete');
  const result = await trashEvent(locale, id, actor);
  revalidateEvents();
  return result;
}

export async function trashEventsAction(localeRaw: unknown, idsRaw: unknown) {
  const locale = localeSchema.parse(localeRaw) as EventLocale;
  const ids = idsSchema.parse(idsRaw);

  const actor = await requirePermission('events', 'delete');
  const results = [];
  for (const id of ids) {
    results.push(await trashEvent(locale, id, actor));
  }
  revalidateEvents();
  return { ok: true, count: results.length };
}

const eventRegistrationInputSchema = z.object({
  eventId: z.union([z.string(), z.number()]),
  eventTitle: z.string().min(1),
  eventTime: z.string().optional(),
  eventLocation: z.string().optional(),
  fullName: z.string().trim().min(1, 'Họ tên không được để trống'),
  company: z.string().trim().optional(),
  position: z.string().trim().optional(),
  email: z.string().trim().email('Email không đúng định dạng'),
  phone: z.string().trim().min(9, 'Số điện thoại không hợp lệ'),
  attendeesCount: z.coerce.number().int().min(1).default(1),
  note: z.string().optional(),
  consent: z.boolean().default(true),
});

export type EventRegistrationPayload = z.infer<typeof eventRegistrationInputSchema>;

export async function registerEventAction(payload: unknown) {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const rateLimit = checkRateLimit(`event-reg:${ip}`, { maxRequests: 10, windowSeconds: 60 });
  if (!rateLimit.success) {
    throw new Error('Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.');
  }

  const input = eventRegistrationInputSchema.parse(payload);
  const now = new Date().toISOString();
  const { getDatabaseClient } = await import('@/server/db/foundation');
  const { getPostgresClient } = await import('@/server/db/postgres');
  const { sendEmail } = await import('@/lib/email/transporter');

  const client = await getDatabaseClient();

  const detailsNote = [
    input.company ? `Đơn vị: ${input.company}` : null,
    input.position ? `Chức vụ: ${input.position}` : null,
    `Số lượng tham dự: ${input.attendeesCount} người`,
    input.note ? `Ghi chú: ${input.note}` : null,
  ].filter(Boolean).join('\n');

  const { data, error } = await client
    .from('cic_contact')
    .insert({
      email: input.email,
      fullname: input.fullName,
      telephone: input.phone,
      subject: `Đăng ký tham dự sự kiện: ${input.eventTitle}`,
      message: detailsNote,
      parts_email: JSON.stringify({
        sourceType: 'event_registration',
        eventId: String(input.eventId),
        eventTitle: input.eventTitle,
        company: input.company,
        position: input.position,
        attendeesCount: input.attendeesCount,
      }),
      edited_time: now,
      created_time: now,
      published: false,
    })
    .select('id,created_time')
    .single();

  if (error || !data) {
    console.error('[registerEventAction] Error inserting contact:', error);
    throw new Error('Không thể ghi nhận đăng ký sự kiện.');
  }

  // Create Customer Request State
  try {
    const sql = getPostgresClient();
    const [state] = await sql`
      INSERT INTO cic_customer_request_states (
        workspace, source_type, source_id, status, priority, tags, created_at, updated_at
      ) VALUES (
        'vi', 'contact', ${data.id}, 'new', 'high', '{event_registration}', now(), now()
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
            source: 'event_registration',
            eventId: String(input.eventId),
            eventTitle: input.eventTitle,
            attendeesCount: input.attendeesCount,
          })}, NULL, now()
        )
      `;
    }
  } catch (err) {
    console.error('[registerEventAction] Error initializing customer request state:', err);
  }

  // Send Emails
  try {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MAIL_FROM_ADDRESS || 'nampt@cic.com.vn';
    const safeTitle = escapeHtml(input.eventTitle);
    const safeFullName = escapeHtml(input.fullName);
    const safeCompany = escapeHtml(input.company || 'Chưa cung cấp');
    const safePosition = escapeHtml(input.position || 'Chưa cung cấp');
    const safeEmail = escapeHtml(input.email);
    const safePhone = escapeHtml(input.phone);
    const safeNote = escapeHtml(input.note || 'Không có ghi chú');
    const safeTime = input.eventTime ? escapeHtml(input.eventTime) : '';
    const safeLocation = input.eventLocation ? escapeHtml(input.eventLocation) : '';

    // 1. Admin notification
    await sendEmail({
      to: adminEmail,
      subject: `[Sự kiện] Đăng ký mới: ${safeFullName} tham dự "${safeTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #ea580c; margin-top: 0;">Thông báo: Đăng ký tham dự sự kiện mới</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 150px;"><strong>Sự kiện:</strong></td><td style="padding: 8px 0; color: #1e293b;"><strong>${safeTitle}</strong></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Họ và tên:</strong></td><td style="padding: 8px 0; color: #1e293b;"><strong>${safeFullName}</strong></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Công ty/Đơn vị:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safeCompany}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Chức vụ:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safePosition}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Số điện thoại:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safePhone}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;"><strong>Số vé đăng ký:</strong></td><td style="padding: 8px 0; color: #1e293b;">${input.attendeesCount} người</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Ghi chú:</strong></td><td style="padding: 8px 0; color: #1e293b; white-space: pre-wrap;">${safeNote}</td></tr>
          </table>
          <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin: 0;">Đã lưu vào danh sách Yêu cầu khách hàng CMS.</p>
        </div>
      `,
    });

    // 2. Customer Confirmation Email
    if (input.email) {
      await sendEmail({
        to: input.email,
        subject: `[CIC Technology] Xác nhận đăng ký tham dự sự kiện "${safeTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #ea580c; margin-top: 0; font-size: 20px;">CIC Technology & Consultancy</h2>
            <p>Kính gửi <strong>${safeFullName}</strong>,</p>
            <p>Cảm ơn Quý khách đã quan tâm và đăng ký tham gia sự kiện do <strong>CIC Technology</strong> tổ chức.</p>
            <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 6px 0; font-size: 15px; color: #9a3412;"><strong>SỰ KIỆN: ${safeTitle}</strong></p>
              ${safeTime ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #431407;"><strong>Thời gian:</strong> ${safeTime}</p>` : ''}
              ${safeLocation ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #431407;"><strong>Địa điểm:</strong> ${safeLocation}</p>` : ''}
              <p style="margin: 0; font-size: 14px; color: #431407;"><strong>Số người tham dự:</strong> ${input.attendeesCount} người</p>
            </div>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">Ban tổ chức sẽ liên hệ lại với Quý khách trước ngày diễn ra sự kiện để gửi thông tin tham dự chi tiết hoặc liên kết phòng họp trực tuyến.</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">Nếu Quý khách có bất kỳ câu hỏi nào, vui lòng liên hệ hotline: <strong>024 3974 1373 - 0866 059 659</strong> hoặc gửi thư về <a href="mailto:info@cic.com.vn">info@cic.com.vn</a>.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 13px; color: #64748b; margin: 0;">Trân trọng,<br/><strong>Ban Tổ chức Sự kiện CIC Technology</strong></p>
          </div>
        `,
      });
    }
  } catch (emailErr) {
    console.error('[registerEventAction] Error sending confirmation email:', emailErr);
  }

  return {
    eventId: String(input.eventId),
    eventTitle: input.eventTitle,
    fullName: input.fullName,
    company: input.company || '',
    position: input.position || '',
    email: input.email,
    phone: input.phone,
    attendeesCount: input.attendeesCount,
    note: input.note || '',
    consent: input.consent,
    registeredAt: now,
  };
}


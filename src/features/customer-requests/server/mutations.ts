import 'server-only';
import { getPostgresClient, withTransaction } from '@/server/db/postgres';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { AppError } from '@/server/errors';
import {
  parseUnifiedRequestId,
  formatUnifiedRequestId,
  getCustomerRequestDetail,
} from './queries';
import { analyzeCustomerRequestWithAi, type AiTriageResult } from './ai-triage';
import type {
  CustomerRequestSourceType,
  RequestStatus,
  PriorityLevel,
} from '../types';

const VALID_STATUSES: RequestStatus[] = [
  'new',
  'received',
  'processing',
  'contacted',
  'completed',
  'not_suitable',
  'cancelled',
];

const VALID_PRIORITIES: PriorityLevel[] = ['low', 'medium', 'high', 'urgent'];

async function resolveSourceWorkspace(
  sql: Sql,
  sourceType: CustomerRequestSourceType,
  sourceId: number
): Promise<'vi' | 'en'> {
  if (sourceType === 'contact') {
    const [vi] = await sql`SELECT 1 FROM cic_contact WHERE id = ${sourceId}`;
    if (vi) return 'vi';
    const [en] = await sql`SELECT 1 FROM cic_contact_en WHERE id = ${sourceId}`;
    if (en) return 'en';
  } else if (sourceType === 'product_contact' || sourceType === 'order') {
    return 'vi';
  } else if (sourceType === 'form_submission') {
    const [row] = await sql`
      SELECT f.workspace 
      FROM cic_form_submissions fs 
      JOIN cic_forms f ON f.id = fs.form_id 
      WHERE fs.id = ${sourceId}
    `;
    if (row?.workspace === 'en') return 'en';
    return 'vi';
  }
  return 'vi';
}

async function getOrCreateState(
  sql: Sql,
  sourceType: CustomerRequestSourceType,
  sourceId: number,
  workspace: 'vi' | 'en'
): Promise<{ id: number; status: RequestStatus; priority: PriorityLevel; assigned_user_id: number | null; tags: string[] }> {
  const [existing] = await sql<Array<{ id: number; status: RequestStatus; priority: PriorityLevel; assigned_user_id: number | null; tags: string[] }>>`
    SELECT id, status, priority, assigned_user_id, tags
    FROM cic_customer_request_states
    WHERE workspace = ${workspace} AND source_type = ${sourceType} AND source_id = ${sourceId}
    FOR UPDATE
  `;
  if (existing) {
    return { ...existing, id: Number(existing.id) };
  }

  const [inserted] = await sql<Array<{ id: number; status: RequestStatus; priority: PriorityLevel; assigned_user_id: number | null; tags: string[] }>>`
    INSERT INTO cic_customer_request_states (
      workspace, source_type, source_id, status, priority, tags, created_at, updated_at
    ) VALUES (
      ${workspace}, ${sourceType}, ${sourceId}, 'new', 'medium', '{}', now(), now()
    )
    ON CONFLICT (workspace, source_type, source_id)
    DO UPDATE SET updated_at = now()
    RETURNING id, status, priority, assigned_user_id, tags
  `;
  return { ...inserted, id: Number(inserted.id) };
}

export async function updateCustomerRequestStatus(
  unifiedId: string,
  newStatus: RequestStatus,
  principal: CmsPrincipal
): Promise<{ success: boolean; newStatus: RequestStatus }> {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new AppError(`Invalid request status: ${newStatus}`, 'VALIDATION_ERROR');
  }
  const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);

  return withTransaction(async (sql) => {
    const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
    const state = await getOrCreateState(sql, sourceType, sourceId, workspace);
    const oldStatus = state.status;

    if (oldStatus !== newStatus) {
      await sql`
        UPDATE cic_customer_request_states
        SET status = ${newStatus}, updated_at = now()
        WHERE id = ${state.id}
      `;

      // Log event to customer request timeline
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'status_changed', ${sql.json(oldStatus)}, ${sql.json(newStatus)}, ${principal.legacyUserId}, now()
        )
      `;
    }

    return { success: true, newStatus };
  });
}

export async function updateCustomerRequestPriority(
  unifiedId: string,
  newPriority: PriorityLevel,
  principal: CmsPrincipal
): Promise<{ success: boolean; newPriority: PriorityLevel }> {
  if (!VALID_PRIORITIES.includes(newPriority)) {
    throw new AppError(`Invalid priority: ${newPriority}`, 'VALIDATION_ERROR');
  }
  const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);

  return withTransaction(async (sql) => {
    const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
    const state = await getOrCreateState(sql, sourceType, sourceId, workspace);
    const oldPriority = state.priority;

    if (oldPriority !== newPriority) {
      await sql`
        UPDATE cic_customer_request_states
        SET priority = ${newPriority}, updated_at = now()
        WHERE id = ${state.id}
      `;

      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'priority_changed', ${sql.json(oldPriority)}, ${sql.json(newPriority)}, ${principal.legacyUserId}, now()
        )
      `;
    }

    return { success: true, newPriority };
  });
}

export async function updateCustomerRequestTags(
  unifiedId: string,
  newTags: string[],
  principal: CmsPrincipal
): Promise<{ success: boolean; tags: string[] }> {
  const cleanTags = [...new Set(newTags.map((t) => t.trim()).filter(Boolean))];
  const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);

  return withTransaction(async (sql) => {
    const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
    const state = await getOrCreateState(sql, sourceType, sourceId, workspace);
    const oldTags = state.tags || [];

    await sql`
      UPDATE cic_customer_request_states
      SET tags = ${cleanTags}, updated_at = now()
      WHERE id = ${state.id}
    `;

    await sql`
      INSERT INTO cic_customer_request_events (
        request_state_id, event_type, old_value, new_value, actor_id, created_at
      ) VALUES (
        ${state.id}, 'tags_changed', ${sql.json(oldTags)}, ${sql.json(cleanTags)}, ${principal.legacyUserId}, now()
      )
    `;

    return { success: true, tags: cleanTags };
  });
}

export async function addCustomerRequestNote(
  unifiedId: string,
  content: string,
  principal: CmsPrincipal
): Promise<{ success: boolean; noteId: string }> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new AppError('Nội dung ghi chú không được để trống.', 'VALIDATION_ERROR');
  }
  const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);

  return withTransaction(async (sql) => {
    const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
    const state = await getOrCreateState(sql, sourceType, sourceId, workspace);

    const [note] = await sql`
      INSERT INTO cic_customer_request_notes (
        request_state_id, content, created_by, created_at
      ) VALUES (
        ${state.id}, ${trimmed}, ${principal.legacyUserId}, now()
      )
      RETURNING id
    `;

    await sql`
      INSERT INTO cic_customer_request_events (
        request_state_id, event_type, old_value, new_value, actor_id, created_at
      ) VALUES (
        ${state.id}, 'note_added', NULL, ${sql.json({ noteId: Number(note.id), snippet: trimmed.slice(0, 100) })}, ${principal.legacyUserId}, now()
      )
    `;

    await sql`
      UPDATE cic_customer_request_states
      SET updated_at = now()
      WHERE id = ${state.id}
    `;

    return { success: true, noteId: String(note.id) };
  });
}

export async function reassignCustomerRequests(
  unifiedIds: string[],
  targetUserId: number | null,
  reason: string,
  principal: CmsPrincipal
): Promise<{ success: boolean; updatedCount: number }> {
  if (!unifiedIds.length) {
    throw new AppError('No requests specified for reassignment.', 'VALIDATION_ERROR');
  }

  return withTransaction(async (sql) => {
    let targetUserName = 'Chưa phân công';
    if (targetUserId) {
      const [u] = await sql`
        SELECT full_name, username 
        FROM cic_users 
        WHERE id = ${targetUserId} AND published = true
      `;
      if (!u) {
        throw new AppError('Nhân sự phụ trách không tồn tại hoặc đã bị khóa.', 'VALIDATION_ERROR');
      }
      targetUserName = u.full_name || u.username;
    }

    for (const unifiedId of unifiedIds) {
      const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);
      const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
      const state = await getOrCreateState(sql, sourceType, sourceId, workspace);

      let oldUserName = 'Chưa phân công';
      if (state.assigned_user_id) {
        const [oldU] = await sql`SELECT full_name, username FROM cic_users WHERE id = ${state.assigned_user_id}`;
        if (oldU) oldUserName = oldU.full_name || oldU.username;
      }

      await sql`
        UPDATE cic_customer_request_states
        SET assigned_user_id = ${targetUserId}, updated_at = now()
        WHERE id = ${state.id}
      `;

      // If reason is provided, add an internal note
      if (reason.trim()) {
        const noteContent = `[Chuyển giao người phụ trách] Từ "${oldUserName}" sang "${targetUserName}". Lý do: ${reason.trim()}`;
        await sql`
          INSERT INTO cic_customer_request_notes (
            request_state_id, content, created_by, created_at
          ) VALUES (
            ${state.id}, ${noteContent}, ${principal.legacyUserId}, now()
          )
        `;
      }

      // Add timeline event
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'reassigned', ${sql.json({ userId: state.assigned_user_id, name: oldUserName })}, ${sql.json({ userId: targetUserId, name: targetUserName })}, ${principal.legacyUserId}, now()
        )
      `;
    }

    // Send email notification to newly assigned staff member
    if (targetUserId) {
      try {
        const [targetUser] = await sql`
          SELECT email, full_name, username 
          FROM cic_users 
          WHERE id = ${targetUserId}
        `;
        if (targetUser?.email) {
          const { sendEmail } = await import('@/lib/email/transporter');
          await sendEmail({
            to: targetUser.email,
            subject: `[CIC CRM] Bạn vừa được phân công phụ trách ${unifiedIds.length} yêu cầu khách hàng mới`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h3 style="color: #ea580c; margin-top: 0;">Thông báo phân công yêu cầu khách hàng</h3>
                <p>Xin chào <strong>${targetUser.full_name || targetUser.username}</strong>,</p>
                <p>Bạn vừa được phân công phụ trách <strong>${unifiedIds.length} yêu cầu</strong> khách hàng mới trên hệ thống CMS.</p>
                ${reason.trim() ? `<p><strong>Lý do chuyển giao:</strong> ${reason.trim()}</p>` : ''}
                <p>Danh sách mã yêu cầu: <code>${unifiedIds.join(', ')}</code></p>
                <p style="margin-top: 20px;">
                  <a href="${process.env.APP_URL || 'http://localhost:3000'}/cms/customer-requests" style="background: #ea580c; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Xem trên CMS</a>
                </p>
                <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px;">Hệ thống Quản lý Yêu cầu Khách hàng CIC Technology</p>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error('[reassignCustomerRequests] Error sending notification email to staff:', emailErr);
      }
    }

    return { success: true, updatedCount: unifiedIds.length };
  });
}

export async function trashCustomerRequests(
  unifiedIds: string[],
  principal: CmsPrincipal
): Promise<{ success: boolean; count: number }> {
  if (!unifiedIds.length) {
    throw new AppError('No requests specified to trash.', 'VALIDATION_ERROR');
  }

  return withTransaction(async (sql) => {
    for (const unifiedId of unifiedIds) {
      const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);
      const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
      const state = await getOrCreateState(sql, sourceType, sourceId, workspace);

      await sql`
        UPDATE cic_customer_request_states
        SET status = 'cancelled', updated_at = now()
        WHERE id = ${state.id}
      `;

      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'status_changed', ${sql.json(state.status)}, ${sql.json('cancelled')}, ${principal.legacyUserId}, now()
        )
      `;
    }

    return { success: true, count: unifiedIds.length };
  });
}

export async function triageCustomerRequest(
  unifiedId: string,
  principal: CmsPrincipal
): Promise<{ success: boolean; aiResult: AiTriageResult }> {
  const detail = await getCustomerRequestDetail(unifiedId);
  if (!detail) {
    throw new AppError(`Customer request not found: ${unifiedId}`, 'NOT_FOUND');
  }

  // Extract fields from submissionValues & sourceConfig
  const nameVal = detail.submissionValues.find((v) =>
    ['fullname', 'fullName', 'full_name', 'name', 'ho_ten', 'hoten'].includes(v.fieldKey)
  )?.valueText;
  const emailVal = detail.submissionValues.find((v) =>
    ['email', 'thu_dien_tu'].includes(v.fieldKey)
  )?.valueText;
  const phoneVal = detail.submissionValues.find((v) =>
    ['phone', 'telephone', 'so_dien_thoai', 'sdt'].includes(v.fieldKey)
  )?.valueText;
  const companyVal = detail.submissionValues.find((v) =>
    ['company', 'don_vi', 'cong_ty'].includes(v.fieldKey)
  )?.valueText;
  const subjectVal =
    detail.submissionValues.find((v) => ['subject', 'tieu_de', 'title'].includes(v.fieldKey))?.valueText ||
    detail.sourceConfig?.ctaName ||
    detail.sourceConfig?.formName;
  const messageVal = detail.submissionValues.find((v) =>
    ['message', 'note', 'notes', 'noi_dung', 'loi_nhan', 'content'].includes(v.fieldKey)
  )?.valueText;

  const valuesMap = detail.submissionValues.reduce<Record<string, unknown>>((acc, curr) => {
    acc[curr.fieldKey] = curr.valueText;
    return acc;
  }, {});

  const aiResult = await analyzeCustomerRequestWithAi({
    fullname: nameVal,
    email: emailVal,
    telephone: phoneVal,
    company: companyVal,
    subject: subjectVal,
    message: messageVal,
    formName: detail.sourceConfig?.formName,
    values: valuesMap,
  });

  const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);

  return withTransaction(async (sql) => {
    const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
    const state = await getOrCreateState(sql, sourceType, sourceId, workspace);

    // Replace conflicting previous AI category tags (ai:qualified, ai:enterprise, ai:irrelevant)
    const existingTags = (state.tags || []).filter(
      (t) => !['ai:qualified', 'ai:enterprise', 'ai:irrelevant'].includes(t)
    );
    const mergedTags = Array.from(new Set([...existingTags, ...aiResult.tags]));

    // Update state priority and tags, and status if state is still 'new' and AI suggests 'not_suitable'
    const newStatus =
      state.status === 'new' && aiResult.suggestedStatus === 'not_suitable'
        ? 'not_suitable'
        : state.status;

    await sql`
      UPDATE cic_customer_request_states
      SET priority = ${aiResult.priority},
          status = ${newStatus},
          tags = ${mergedTags},
          updated_at = now()
      WHERE id = ${state.id}
    `;

    // Note formatting
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
        ${state.id}, ${noteContent}, ${principal.legacyUserId}, now()
      )
    `;

    await sql`
      INSERT INTO cic_customer_request_events (
        request_state_id, event_type, old_value, new_value, actor_id, created_at
      ) VALUES (
        ${state.id}, 'ai_triaged', ${sql.json(state.status)}, ${sql.json(aiResult as never)}, ${principal.legacyUserId}, now()
      )
    `;

    return { success: true, aiResult };
  });
}

export async function bulkCleanIrrelevantRequests(
  unifiedIds: string[],
  principal: CmsPrincipal
): Promise<{ success: boolean; count: number }> {
  if (!unifiedIds.length) {
    throw new AppError('No requests specified.', 'VALIDATION_ERROR');
  }

  return withTransaction(async (sql) => {
    for (const unifiedId of unifiedIds) {
      const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);
      const workspace = await resolveSourceWorkspace(sql, sourceType, sourceId);
      const state = await getOrCreateState(sql, sourceType, sourceId, workspace);

      await sql`
        UPDATE cic_customer_request_states
        SET status = 'not_suitable', priority = 'low', updated_at = now()
        WHERE id = ${state.id}
      `;

      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'bulk_cleaned', ${sql.json(state.status)}, ${sql.json('not_suitable')}, ${principal.legacyUserId}, now()
        )
      `;
    }

    return { success: true, count: unifiedIds.length };
  });
}


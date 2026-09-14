import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type {
  CustomerRequest,
  CustomerRequestFilterParams,
  CustomerRequestListResponse,
  CustomerRequestStats,
  CustomerRequestSourceType,
  RequestStatus,
  PriorityLevel,
  SubmissionValue,
  SourceConfig,
  RequestNote,
  RequestLog,
  AssignableStaff,
} from '../types';

export function parseUnifiedRequestId(id: string): { sourceType: CustomerRequestSourceType; sourceId: number } {
  const parts = id.split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid customer request ID format: ${id}`);
  }
  const [sourceType, idStr] = parts;
  const sourceId = Number(idStr);
  if (
    !['contact', 'product_contact', 'order', 'form_submission'].includes(sourceType) ||
    isNaN(sourceId) ||
    sourceId <= 0
  ) {
    throw new Error(`Invalid customer request source type or ID: ${id}`);
  }
  return { sourceType: sourceType as CustomerRequestSourceType, sourceId };
}

export function formatUnifiedRequestId(sourceType: CustomerRequestSourceType, sourceId: number | string): string {
  return `${sourceType}:${sourceId}`;
}

export async function getAssignableStaffMembers(): Promise<AssignableStaff[]> {
  const sql = getPostgresClient();
  const rows = await sql<Array<{ id: number; full_name: string | null; email: string; username: string }>>`
    SELECT id, full_name, email, username
    FROM cic_users
    WHERE published = true AND account_status = 'active'
    ORDER BY COALESCE(NULLIF(full_name, ''), username) ASC
  `;
  return rows.map((r) => ({
    id: String(r.id),
    name: r.full_name || r.username || r.email,
    email: r.email,
    username: r.username,
  }));
}

interface RawUnifiedRow {
  unified_id: string;
  source_type: CustomerRequestSourceType;
  source_id: number;
  workspace: 'vi' | 'en';
  created_time: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  country: string | null;
  subject: string | null;
  message: string | null;
  extra_json: string | null;
  product_name: string | null;
  product_alias: string | null;
  req_type: string | null;
  version: string | null;
  total_amount: number | null;
  state_id: string | null;
  status: RequestStatus | null;
  priority: PriorityLevel | null;
  assigned_user_id: number | null;
  assigned_user_name: string | null;
  tags: string[] | null;
  updated_at: string | null;
}

function mapRawRowToCustomerRequest(
  row: RawUnifiedRow,
  notesMap: Map<string, RequestNote[]> = new Map(),
  logsMap: Map<string, RequestLog[]> = new Map()
): CustomerRequest {
  const unifiedId = row.unified_id;
  const submissionValues: SubmissionValue[] = [];
  let sourceConfig: SourceConfig = {
    submittedAt: row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString(),
  };

  // Check if extra_json has structured submission payload (from modern public forms)
  let parsedJson: any = null;
  if (row.extra_json) {
    try {
      parsedJson = JSON.parse(row.extra_json);
    } catch {
      // Ignore parse failure
    }
  }

  if (parsedJson && parsedJson.values && parsedJson.source) {
    sourceConfig = {
      formId: parsedJson.formId,
      formName: row.subject || 'Biểu mẫu trực tuyến',
      ctaId: parsedJson.source.ctaId,
      ctaName: parsedJson.source.ctaName,
      pageType: parsedJson.source.pageType,
      pageId: parsedJson.source.pageId,
      pageUrl: parsedJson.source.pageUrl,
      pageTitle: parsedJson.source.pageTitle,
      placementKey: parsedJson.source.placementKey,
      submittedAt: row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString(),
      utmSource: parsedJson.source.utmSource,
      utmMedium: parsedJson.source.utmMedium,
      utmCampaign: parsedJson.source.utmCampaign,
      referrer: parsedJson.source.referrer,
      deviceInfo: parsedJson.source.deviceInfo,
    };

    // Construct submission values from parsed values
    for (const [key, val] of Object.entries(parsedJson.values)) {
      if (val === undefined || val === null) continue;
      const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
      let label = key;
      let type = 'text';
      if (key === 'name' || key === 'fullname' || key === 'full_name') {
        label = 'Họ và tên';
        type = 'text';
      } else if (key === 'email') {
        label = 'Email';
        type = 'email';
      } else if (key === 'phone' || key === 'telephone') {
        label = 'Số điện thoại';
        type = 'phone';
      } else if (key === 'message' || key === 'content' || key === 'note') {
        label = 'Nhu cầu / Lời nhắn';
        type = 'textarea';
      } else if (key === 'company') {
        label = 'Công ty / Tổ chức';
        type = 'text';
      }
      submissionValues.push({
        fieldKey: key,
        fieldLabel: label,
        fieldType: type,
        valueText: strVal,
      });
    }
  } else if (row.source_type === 'product_contact') {
    sourceConfig = {
      formName: row.req_type || 'Đăng ký sản phẩm',
      pageUrl: row.product_alias ? `/products/${row.product_alias}` : '/products',
      pageTitle: row.product_name || 'Chi tiết sản phẩm',
      submittedAt: row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString(),
    };
    if (row.name) submissionValues.push({ fieldKey: 'full_name', fieldLabel: 'Họ và tên', fieldType: 'text', valueText: row.name });
    if (row.email) submissionValues.push({ fieldKey: 'email', fieldLabel: 'Email', fieldType: 'email', valueText: row.email });
    if (row.phone) submissionValues.push({ fieldKey: 'phone', fieldLabel: 'Số điện thoại', fieldType: 'phone', valueText: row.phone });
    if (row.company) submissionValues.push({ fieldKey: 'company', fieldLabel: 'Công ty', fieldType: 'text', valueText: row.company });
    if (row.country) submissionValues.push({ fieldKey: 'country', fieldLabel: 'Khu vực / Tỉnh thành', fieldType: 'text', valueText: row.country });
    if (row.product_name) submissionValues.push({ fieldKey: 'product', fieldLabel: 'Sản phẩm quan tâm', fieldType: 'text', valueText: row.product_name });
    if (row.version) submissionValues.push({ fieldKey: 'version', fieldLabel: 'Phiên bản', fieldType: 'text', valueText: row.version });
    if (row.req_type) submissionValues.push({ fieldKey: 'type', fieldLabel: 'Loại yêu cầu', fieldType: 'text', valueText: row.req_type });
    if (row.message) submissionValues.push({ fieldKey: 'message', fieldLabel: 'Nội dung lời nhắn', fieldType: 'textarea', valueText: row.message });
  } else if (row.source_type === 'order') {
    sourceConfig = {
      formName: 'Đơn hàng trực tuyến',
      pageUrl: '/cart',
      pageTitle: 'Đặt hàng sản phẩm',
      submittedAt: row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString(),
    };
    if (row.name) submissionValues.push({ fieldKey: 'full_name', fieldLabel: 'Người đặt hàng', fieldType: 'text', valueText: row.name });
    if (row.email) submissionValues.push({ fieldKey: 'email', fieldLabel: 'Email', fieldType: 'email', valueText: row.email });
    if (row.phone) submissionValues.push({ fieldKey: 'phone', fieldLabel: 'Số điện thoại', fieldType: 'phone', valueText: row.phone });
    if (row.address) submissionValues.push({ fieldKey: 'address', fieldLabel: 'Địa chỉ giao hàng', fieldType: 'text', valueText: row.address });
    if (row.total_amount) submissionValues.push({ fieldKey: 'total', fieldLabel: 'Tổng thanh toán', fieldType: 'text', valueText: `${row.total_amount.toLocaleString('vi-VN')} VNĐ` });
    if (row.message) submissionValues.push({ fieldKey: 'message', fieldLabel: 'Ghi chú đơn hàng', fieldType: 'textarea', valueText: row.message });
  } else {
    // Default contact source
    sourceConfig = {
      formName: row.subject || (row.workspace === 'en' ? 'Website Contact' : 'Liên hệ website'),
      pageUrl: '/contact',
      pageTitle: row.workspace === 'en' ? 'Contact Page' : 'Trang liên hệ',
      submittedAt: row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString(),
    };
    if (row.name) submissionValues.push({ fieldKey: 'full_name', fieldLabel: 'Họ và tên', fieldType: 'text', valueText: row.name });
    if (row.email) submissionValues.push({ fieldKey: 'email', fieldLabel: 'Email', fieldType: 'email', valueText: row.email });
    if (row.phone) submissionValues.push({ fieldKey: 'phone', fieldLabel: 'Số điện thoại', fieldType: 'phone', valueText: row.phone });
    if (row.address) submissionValues.push({ fieldKey: 'address', fieldLabel: 'Địa chỉ', fieldType: 'text', valueText: row.address });
    if (row.subject) submissionValues.push({ fieldKey: 'subject', fieldLabel: 'Tiêu đề liên hệ', fieldType: 'text', valueText: row.subject });
    if (row.message) submissionValues.push({ fieldKey: 'message', fieldLabel: 'Nội dung tin nhắn', fieldType: 'textarea', valueText: row.message });
  }

  const internalNotes = row.state_id ? notesMap.get(String(row.state_id)) || [] : [];
  const logs = row.state_id ? logsMap.get(String(row.state_id)) || [] : [];

  return {
    id: unifiedId,
    sourceType: row.source_type,
    sourceId: row.source_id,
    workspace: row.workspace,
    sourceConfig,
    submissionValues,
    status: row.status || 'new',
    assignedUserId: row.assigned_user_id ? String(row.assigned_user_id) : undefined,
    assignedUserName: row.assigned_user_name || undefined,
    priority: row.priority || 'medium',
    tags: Array.isArray(row.tags) ? row.tags : [],
    internalNotes,
    logs,
    createdAt: row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : (row.created_time ? new Date(row.created_time).toISOString() : new Date().toISOString()),
  };
}

export async function listCustomerRequests(params: CustomerRequestFilterParams): Promise<CustomerRequestListResponse> {
  const sql = getPostgresClient();
  const workspace = params.workspace === 'en' ? 'en' : 'vi';
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 10));
  const offset = (page - 1) * pageSize;

  // Build the Unified Source CTE based on workspace
  let sourceCte;
  if (workspace === 'vi') {
    sourceCte = sql`
      WITH raw_sources AS (
        SELECT 
          'contact'::varchar(30) AS source_type,
          id AS source_id,
          'vi'::varchar(5) AS workspace,
          created_time,
          fullname AS name,
          email,
          telephone AS phone,
          address,
          NULL::varchar AS company,
          NULL::varchar AS country,
          COALESCE(subject, title) AS subject,
          message,
          parts_email AS extra_json,
          NULL::varchar AS product_name,
          NULL::varchar AS product_alias,
          NULL::varchar AS req_type,
          NULL::varchar AS version,
          NULL::double precision AS total_amount
        FROM cic_contact

        UNION ALL

        SELECT 
          'product_contact'::varchar(30) AS source_type,
          id AS source_id,
          'vi'::varchar(5) AS workspace,
          created_time,
          fullname AS name,
          email,
          telephone AS phone,
          address,
          company,
          country,
          title AS subject,
          message,
          parts_email AS extra_json,
          products_name AS product_name,
          products_alias AS product_alias,
          type AS req_type,
          version,
          NULL::double precision AS total_amount
        FROM cic_product_contact

        UNION ALL

        SELECT 
          'order'::varchar(30) AS source_type,
          id AS source_id,
          'vi'::varchar(5) AS workspace,
          created_time,
          sender_name AS name,
          sender_email AS email,
          sender_telephone AS phone,
          sender_address AS address,
          NULL::varchar AS company,
          NULL::varchar AS country,
          'Đơn hàng #' || id AS subject,
          sender_comments AS message,
          NULL::varchar AS extra_json,
          NULL::varchar AS product_name,
          NULL::varchar AS product_alias,
          'Đơn hàng' AS req_type,
          NULL::varchar AS version,
          total_after_discount AS total_amount
        FROM cic_order

        UNION ALL

        SELECT 
          'form_submission'::varchar(30) AS source_type,
          fs.id AS source_id,
          'vi'::varchar(5) AS workspace,
          fs.submitted_at AS created_time,
          NULL::varchar AS name,
          NULL::varchar AS email,
          NULL::varchar AS phone,
          NULL::varchar AS address,
          NULL::varchar AS company,
          NULL::varchar AS country,
          f.title AS subject,
          NULL::text AS message,
          NULL::varchar AS extra_json,
          NULL::varchar AS product_name,
          NULL::varchar AS product_alias,
          'Biểu mẫu' AS req_type,
          NULL::varchar AS version,
          NULL::double precision AS total_amount
        FROM cic_form_submissions fs
        JOIN cic_forms f ON f.id = fs.form_id
        WHERE f.workspace = 'vi'
      )
    `;
  } else {
    sourceCte = sql`
      WITH raw_sources AS (
        SELECT 
          'contact'::varchar(30) AS source_type,
          id AS source_id,
          'en'::varchar(5) AS workspace,
          created_time,
          fullname AS name,
          email,
          telephone AS phone,
          address,
          NULL::varchar AS company,
          NULL::varchar AS country,
          COALESCE(subject, title) AS subject,
          message,
          parts_email AS extra_json,
          NULL::varchar AS product_name,
          NULL::varchar AS product_alias,
          NULL::varchar AS req_type,
          NULL::varchar AS version,
          NULL::double precision AS total_amount
        FROM cic_contact_en

        UNION ALL

        SELECT 
          'form_submission'::varchar(30) AS source_type,
          fs.id AS source_id,
          'en'::varchar(5) AS workspace,
          fs.submitted_at AS created_time,
          NULL::varchar AS name,
          NULL::varchar AS email,
          NULL::varchar AS phone,
          NULL::varchar AS address,
          NULL::varchar AS company,
          NULL::varchar AS country,
          f.title AS subject,
          NULL::text AS message,
          NULL::varchar AS extra_json,
          NULL::varchar AS product_name,
          NULL::varchar AS product_alias,
          'Biểu mẫu' AS req_type,
          NULL::varchar AS version,
          NULL::double precision AS total_amount
        FROM cic_form_submissions fs
        JOIN cic_forms f ON f.id = fs.form_id
        WHERE f.workspace = 'en'
      )
    `;
  }

  // Calculate status condition based on tab or status
  let statusCondition = sql`TRUE`;
  if (params.status) {
    statusCondition = sql`COALESCE(s.status, 'new') = ${params.status}`;
  } else if (params.tab && params.tab !== 'all') {
    if (params.tab === 'new') {
      statusCondition = sql`COALESCE(s.status, 'new') = 'new'`;
    } else if (params.tab === 'processing') {
      statusCondition = sql`COALESCE(s.status, 'new') IN ('received', 'processing', 'contacted')`;
    } else if (params.tab === 'completed') {
      statusCondition = sql`COALESCE(s.status, 'new') = 'completed'`;
    } else if (params.tab === 'not_suitable') {
      statusCondition = sql`COALESCE(s.status, 'new') = 'not_suitable'`;
    } else if (params.tab === 'cancelled') {
      statusCondition = sql`COALESCE(s.status, 'new') = 'cancelled'`;
    }
  }

  // Assignee condition
  let assigneeCondition = sql`TRUE`;
  if (params.assignedUserId) {
    if (params.assignedUserId === 'unassigned') {
      assigneeCondition = sql`s.assigned_user_id IS NULL`;
    } else {
      const uId = Number(params.assignedUserId);
      if (!isNaN(uId)) {
        assigneeCondition = sql`s.assigned_user_id = ${uId}`;
      }
    }
  }

  // Date range condition
  let dateCondition = sql`TRUE`;
  if (params.dateFrom && params.dateTo) {
    dateCondition = sql`src.created_time >= ${params.dateFrom}::timestamptz AND src.created_time <= ${params.dateTo}::timestamptz`;
  } else if (params.dateFrom) {
    dateCondition = sql`src.created_time >= ${params.dateFrom}::timestamptz`;
  } else if (params.dateTo) {
    dateCondition = sql`src.created_time <= ${params.dateTo}::timestamptz`;
  }

  // Search query condition
  let searchCondition = sql`TRUE`;
  if (params.searchQuery && params.searchQuery.trim()) {
    const q = `%${params.searchQuery.trim()}%`;
    searchCondition = sql`(
      src.name ILIKE ${q}
      OR src.email ILIKE ${q}
      OR src.phone ILIKE ${q}
      OR src.subject ILIKE ${q}
      OR src.message ILIKE ${q}
      OR src.company ILIKE ${q}
      OR src.product_name ILIKE ${q}
      OR (src.source_type || ':' || src.source_id::text) ILIKE ${q}
    )`;
  }

  // Execute Count Query & Paged Query in parallel
  const [totalRes, rows, stats, staffMembers] = await Promise.all([
    sql`
      ${sourceCte}
      SELECT count(*)::int AS count
      FROM raw_sources src
      LEFT JOIN cic_customer_request_states s 
        ON s.workspace = src.workspace 
        AND s.source_type = src.source_type 
        AND s.source_id = src.source_id
      WHERE ${statusCondition} 
        AND ${assigneeCondition} 
        AND ${dateCondition} 
        AND ${searchCondition}
    `,
    sql<RawUnifiedRow[]>`
      ${sourceCte}
      SELECT 
        (src.source_type || ':' || src.source_id::text) AS unified_id,
        src.source_type,
        src.source_id,
        src.workspace,
        src.created_time::text,
        src.name,
        src.email,
        src.phone,
        src.address,
        src.company,
        src.country,
        src.subject,
        src.message,
        src.extra_json,
        src.product_name,
        src.product_alias,
        src.req_type,
        src.version,
        src.total_amount,
        s.id::text AS state_id,
        s.status,
        s.priority,
        s.assigned_user_id,
        COALESCE(NULLIF(u.full_name, ''), u.username) AS assigned_user_name,
        s.tags,
        s.updated_at::text
      FROM raw_sources src
      LEFT JOIN cic_customer_request_states s 
        ON s.workspace = src.workspace 
        AND s.source_type = src.source_type 
        AND s.source_id = src.source_id
      LEFT JOIN cic_users u ON u.id = s.assigned_user_id
      WHERE ${statusCondition} 
        AND ${assigneeCondition} 
        AND ${dateCondition} 
        AND ${searchCondition}
      ORDER BY src.created_time DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `,
    getCustomerRequestStats(workspace),
    getAssignableStaffMembers(),
  ]);

  const totalCount = totalRes[0]?.count || 0;

  // Batch query notes and logs for existing state IDs in this page
  const stateIds = rows.map((r) => r.state_id).filter(Boolean) as string[];
  const notesMap = new Map<string, RequestNote[]>();
  const logsMap = new Map<string, RequestLog[]>();

  if (stateIds.length > 0) {
    const numStateIds = stateIds.map((id) => Number(id));
    const [notesRows, eventsRows] = await Promise.all([
      sql<Array<{ id: number; request_state_id: number; content: string; created_by: number | null; creator_name: string | null; created_at: string }>>`
        SELECT 
          n.id,
          n.request_state_id,
          n.content,
          n.created_by,
          COALESCE(NULLIF(u.full_name, ''), u.username, 'Quản trị viên') AS creator_name,
          n.created_at::text
        FROM cic_customer_request_notes n
        LEFT JOIN cic_users u ON u.id = n.created_by
        WHERE n.request_state_id IN ${sql(numStateIds)}
        ORDER BY n.created_at ASC
      `,
      sql<Array<{ id: number; request_state_id: number; event_type: string; old_value: any; new_value: any; actor_id: number | null; actor_name: string | null; created_at: string }>>`
        SELECT 
          e.id,
          e.request_state_id,
          e.event_type,
          e.old_value,
          e.new_value,
          e.actor_id,
          COALESCE(NULLIF(u.full_name, ''), u.username, 'Hệ thống') AS actor_name,
          e.created_at::text
        FROM cic_customer_request_events e
        LEFT JOIN cic_users u ON u.id = e.actor_id
        WHERE e.request_state_id IN ${sql(numStateIds)}
        ORDER BY e.created_at ASC
      `,
    ]);

    for (const note of notesRows) {
      const k = String(note.request_state_id);
      if (!notesMap.has(k)) notesMap.set(k, []);
      notesMap.get(k)!.push({
        id: String(note.id),
        content: note.content,
        createdBy: note.created_by ? String(note.created_by) : undefined,
        createdByName: note.creator_name || 'Quản trị viên',
        createdAt: new Date(note.created_at).toISOString(),
      });
    }

    for (const ev of eventsRows) {
      const k = String(ev.request_state_id);
      if (!logsMap.has(k)) logsMap.set(k, []);
      logsMap.get(k)!.push({
        id: String(ev.id),
        actionType: ev.event_type,
        oldValue: ev.old_value,
        newValue: ev.new_value,
        createdBy: ev.actor_id ? String(ev.actor_id) : 'system',
        createdByName: ev.actor_name || 'Hệ thống',
        createdAt: new Date(ev.created_at).toISOString(),
      });
    }
  }

  const requests = rows.map((r) => mapRawRowToCustomerRequest(r, notesMap, logsMap));

  // Extract available form/CTA options from database
  const formOptions = [
    { id: 'contact', name: workspace === 'en' ? 'Website Contact' : 'Liên hệ website' },
    { id: 'product_contact', name: 'Đăng ký / Báo giá sản phẩm' },
    { id: 'order', name: 'Đơn đặt hàng' },
  ];
  const ctaOptions = [
    { id: 'consultation', name: 'Đăng ký tư vấn' },
    { id: 'quote', name: 'Yêu cầu báo giá' },
    { id: 'download', name: 'Tải bản cài đặt' },
  ];

  return {
    requests,
    totalCount,
    page,
    pageSize,
    stats,
    formOptions,
    ctaOptions,
    staffMembers,
  };
}

export async function getCustomerRequestStats(workspace: 'vi' | 'en'): Promise<CustomerRequestStats> {
  const sql = getPostgresClient();
  const ws = workspace === 'en' ? 'en' : 'vi';

  let unionSource;
  if (ws === 'vi') {
    unionSource = sql`
      SELECT 'contact'::varchar(30) AS source_type, id AS source_id, 'vi'::varchar(5) AS workspace FROM cic_contact
      UNION ALL
      SELECT 'product_contact'::varchar(30) AS source_type, id AS source_id, 'vi'::varchar(5) AS workspace FROM cic_product_contact
      UNION ALL
      SELECT 'order'::varchar(30) AS source_type, id AS source_id, 'vi'::varchar(5) AS workspace FROM cic_order
      UNION ALL
      SELECT 'form_submission'::varchar(30) AS source_type, fs.id AS source_id, 'vi'::varchar(5) AS workspace 
      FROM cic_form_submissions fs JOIN cic_forms f ON f.id = fs.form_id WHERE f.workspace = 'vi'
    `;
  } else {
    unionSource = sql`
      SELECT 'contact'::varchar(30) AS source_type, id AS source_id, 'en'::varchar(5) AS workspace FROM cic_contact_en
      UNION ALL
      SELECT 'form_submission'::varchar(30) AS source_type, fs.id AS source_id, 'en'::varchar(5) AS workspace 
      FROM cic_form_submissions fs JOIN cic_forms f ON f.id = fs.form_id WHERE f.workspace = 'en'
    `;
  }

  const [row] = await sql<Array<{
    all_count: number;
    new_count: number;
    processing_count: number;
    completed_count: number;
    not_suitable_count: number;
    cancelled_count: number;
  }>>`
    WITH raw_sources AS (${unionSource})
    SELECT 
      count(*)::int AS all_count,
      count(*) FILTER (WHERE COALESCE(s.status, 'new') = 'new')::int AS new_count,
      count(*) FILTER (WHERE COALESCE(s.status, 'new') IN ('received', 'processing', 'contacted'))::int AS processing_count,
      count(*) FILTER (WHERE COALESCE(s.status, 'new') = 'completed')::int AS completed_count,
      count(*) FILTER (WHERE COALESCE(s.status, 'new') = 'not_suitable')::int AS not_suitable_count,
      count(*) FILTER (WHERE COALESCE(s.status, 'new') = 'cancelled')::int AS cancelled_count
    FROM raw_sources src
    LEFT JOIN cic_customer_request_states s 
      ON s.workspace = src.workspace 
      AND s.source_type = src.source_type 
      AND s.source_id = src.source_id
  `;

  return {
    all: row?.all_count || 0,
    new: row?.new_count || 0,
    processing: row?.processing_count || 0,
    completed: row?.completed_count || 0,
    not_suitable: row?.not_suitable_count || 0,
    cancelled: row?.cancelled_count || 0,
  };
}

export async function getCustomerRequestDetail(unifiedId: string): Promise<CustomerRequest | null> {
  const { sourceType, sourceId } = parseUnifiedRequestId(unifiedId);
  const sql = getPostgresClient();

  let rawRow: RawUnifiedRow | undefined;

  if (sourceType === 'contact') {
    // Try VI then EN
    const viRows = await sql<RawUnifiedRow[]>`
      SELECT 
        ('contact:' || c.id::text) AS unified_id,
        'contact'::varchar(30) AS source_type,
        c.id AS source_id,
        'vi'::varchar(5) AS workspace,
        c.created_time::text,
        c.fullname AS name,
        c.email,
        c.telephone AS phone,
        c.address,
        NULL::varchar AS company,
        NULL::varchar AS country,
        COALESCE(c.subject, c.title) AS subject,
        c.message,
        c.parts_email AS extra_json,
        NULL::varchar AS product_name,
        NULL::varchar AS product_alias,
        NULL::varchar AS req_type,
        NULL::varchar AS version,
        NULL::double precision AS total_amount,
        s.id::text AS state_id,
        s.status,
        s.priority,
        s.assigned_user_id,
        COALESCE(NULLIF(u.full_name, ''), u.username) AS assigned_user_name,
        s.tags,
        s.updated_at::text
      FROM cic_contact c
      LEFT JOIN cic_customer_request_states s 
        ON s.workspace = 'vi' AND s.source_type = 'contact' AND s.source_id = c.id
      LEFT JOIN cic_users u ON u.id = s.assigned_user_id
      WHERE c.id = ${sourceId}
      LIMIT 1
    `;
    if (viRows.length > 0) {
      rawRow = viRows[0];
    } else {
      const enRows = await sql<RawUnifiedRow[]>`
        SELECT 
          ('contact:' || c.id::text) AS unified_id,
          'contact'::varchar(30) AS source_type,
          c.id AS source_id,
          'en'::varchar(5) AS workspace,
          c.created_time::text,
          c.fullname AS name,
          c.email,
          c.telephone AS phone,
          c.address,
          NULL::varchar AS company,
          NULL::varchar AS country,
          COALESCE(c.subject, c.title) AS subject,
          c.message,
          c.parts_email AS extra_json,
          NULL::varchar AS product_name,
          NULL::varchar AS product_alias,
          NULL::varchar AS req_type,
          NULL::varchar AS version,
          NULL::double precision AS total_amount,
          s.id::text AS state_id,
          s.status,
          s.priority,
          s.assigned_user_id,
          COALESCE(NULLIF(u.full_name, ''), u.username) AS assigned_user_name,
          s.tags,
          s.updated_at::text
        FROM cic_contact_en c
        LEFT JOIN cic_customer_request_states s 
          ON s.workspace = 'en' AND s.source_type = 'contact' AND s.source_id = c.id
        LEFT JOIN cic_users u ON u.id = s.assigned_user_id
        WHERE c.id = ${sourceId}
        LIMIT 1
      `;
      rawRow = enRows[0];
    }
  } else if (sourceType === 'product_contact') {
    const rows = await sql<RawUnifiedRow[]>`
      SELECT 
        ('product_contact:' || pc.id::text) AS unified_id,
        'product_contact'::varchar(30) AS source_type,
        pc.id AS source_id,
        'vi'::varchar(5) AS workspace,
        pc.created_time::text,
        pc.fullname AS name,
        pc.email,
        pc.telephone AS phone,
        pc.address,
        pc.company,
        pc.country,
        pc.title AS subject,
        pc.message,
        pc.parts_email AS extra_json,
        pc.products_name AS product_name,
        pc.products_alias AS product_alias,
        pc.type AS req_type,
        pc.version,
        NULL::double precision AS total_amount,
        s.id::text AS state_id,
        s.status,
        s.priority,
        s.assigned_user_id,
        COALESCE(NULLIF(u.full_name, ''), u.username) AS assigned_user_name,
        s.tags,
        s.updated_at::text
      FROM cic_product_contact pc
      LEFT JOIN cic_customer_request_states s 
        ON s.workspace = 'vi' AND s.source_type = 'product_contact' AND s.source_id = pc.id
      LEFT JOIN cic_users u ON u.id = s.assigned_user_id
      WHERE pc.id = ${sourceId}
      LIMIT 1
    `;
    rawRow = rows[0];
  } else if (sourceType === 'order') {
    const rows = await sql<RawUnifiedRow[]>`
      SELECT 
        ('order:' || o.id::text) AS unified_id,
        'order'::varchar(30) AS source_type,
        o.id AS source_id,
        'vi'::varchar(5) AS workspace,
        o.created_time::text,
        o.sender_name AS name,
        o.sender_email AS email,
        o.sender_telephone AS phone,
        o.sender_address AS address,
        NULL::varchar AS company,
        NULL::varchar AS country,
        'Đơn hàng #' || o.id AS subject,
        o.sender_comments AS message,
        NULL::varchar AS extra_json,
        NULL::varchar AS product_name,
        NULL::varchar AS product_alias,
        'Đơn hàng' AS req_type,
        NULL::varchar AS version,
        o.total_after_discount AS total_amount,
        s.id::text AS state_id,
        s.status,
        s.priority,
        s.assigned_user_id,
        COALESCE(NULLIF(u.full_name, ''), u.username) AS assigned_user_name,
        s.tags,
        s.updated_at::text
      FROM cic_order o
      LEFT JOIN cic_customer_request_states s 
        ON s.workspace = 'vi' AND s.source_type = 'order' AND s.source_id = o.id
      LEFT JOIN cic_users u ON u.id = s.assigned_user_id
      WHERE o.id = ${sourceId}
      LIMIT 1
    `;
    rawRow = rows[0];
  }

  if (!rawRow) return null;

  // Query notes and events if state exists
  const notesMap = new Map<string, RequestNote[]>();
  const logsMap = new Map<string, RequestLog[]>();

  if (rawRow.state_id) {
    const sId = Number(rawRow.state_id);
    const [notesRows, eventsRows] = await Promise.all([
      sql<Array<{ id: number; content: string; created_by: number | null; creator_name: string | null; created_at: string }>>`
        SELECT 
          n.id,
          n.content,
          n.created_by,
          COALESCE(NULLIF(u.full_name, ''), u.username, 'Quản trị viên') AS creator_name,
          n.created_at::text
        FROM cic_customer_request_notes n
        LEFT JOIN cic_users u ON u.id = n.created_by
        WHERE n.request_state_id = ${sId}
        ORDER BY n.created_at ASC
      `,
      sql<Array<{ id: number; event_type: string; old_value: any; new_value: any; actor_id: number | null; actor_name: string | null; created_at: string }>>`
        SELECT 
          e.id,
          e.event_type,
          e.old_value,
          e.new_value,
          e.actor_id,
          COALESCE(NULLIF(u.full_name, ''), u.username, 'Hệ thống') AS actor_name,
          e.created_at::text
        FROM cic_customer_request_events e
        LEFT JOIN cic_users u ON u.id = e.actor_id
        WHERE e.request_state_id = ${sId}
        ORDER BY e.created_at ASC
      `,
    ]);

    notesMap.set(
      rawRow.state_id,
      notesRows.map((n) => ({
        id: String(n.id),
        content: n.content,
        createdBy: n.created_by ? String(n.created_by) : undefined,
        createdByName: n.creator_name || 'Quản trị viên',
        createdAt: new Date(n.created_at).toISOString(),
      }))
    );

    logsMap.set(
      rawRow.state_id,
      eventsRows.map((e) => ({
        id: String(e.id),
        actionType: e.event_type,
        oldValue: e.old_value,
        newValue: e.new_value,
        createdBy: e.actor_id ? String(e.actor_id) : 'system',
        createdByName: e.actor_name || 'Hệ thống',
        createdAt: new Date(e.created_at).toISOString(),
      }))
    );
  }

  return mapRawRowToCustomerRequest(rawRow, notesMap, logsMap);
}

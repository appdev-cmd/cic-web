import React from 'react';

export type ContactSource = 
  | 'general_contact'        // Liên hệ chung
  | 'product_registration'   // Đăng ký sản phẩm / Báo giá
  | 'service_inquiry'        // Tư vấn dịch vụ
  | 'technical_support'      // Hỗ trợ kỹ thuật
  | 'event_registration';    // Đăng ký hội thảo / sự kiện

export type ContactStatus = 
  | 'new'          // Mới tiếp nhận
  | 'assigned'     // Đã phân công
  | 'in_progress'  // Đang xử lý
  | 'resolved'     // Đã giải quyết
  | 'closed'       // Đã đóng
  | 'spam'         // Rác / Quảng cáo
  | 'duplicate';   // Trùng lặp

export type PriorityLevel = 'urgent' | 'high' | 'normal' | 'low';

export type SlaStatus = 'on_time' | 'near_overdue' | 'overdue';

export type UserRole = 'sales' | 'support' | 'manager' | 'marketing' | 'admin';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  team: 'Sales CAD/BIM' | 'Sales Structural' | 'Customer Care' | 'Tech Support' | 'Management';
  active_cases_count: number;
}

export interface RelatedObject {
  id: string;
  type: 'product' | 'service' | 'event';
  title: string;
  code?: string;
  thumbnail?: string;
  url?: string;
  category_name?: string;
}

export interface InternalNote {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  is_pinned?: boolean;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_avatar?: string;
  event_type: 'created' | 'assigned' | 'reassigned' | 'status_changed' | 'note_added' | 'marked_spam' | 'restored' | 'pii_revealed';
  description: string;
  old_value?: string;
  new_value?: string;
}

export interface ContactRequest {
  id: string; // e.g. REQ-2026-0891
  source_locale: 'vi' | 'en'; // Locale của form/page tại thời điểm gửi; không đổi theo CMS workspace
  source: ContactSource;
  form_title: string; // e.g. "Yêu cầu báo giá EnjiCAD Network"
  
  // Customer Original Data (Read-only / Immutable)
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  sender_company?: string;
  sender_address?: string;
  request_subject: string;
  request_content: string;
  sender_ip?: string;
  page_url?: string;
  created_at: string;

  // Workflow & Assignment State
  status: ContactStatus;
  priority: PriorityLevel;
  owner_id?: string;
  owner_name?: string;
  owner_avatar?: string;
  assigned_team?: string;
  
  // SLA & Age Tracking
  sla_deadline: string; // ISO date string
  sla_status: SlaStatus;
  first_response_time?: string;
  resolved_at?: string;
  closed_at?: string;
  
  // Relations & Categorization
  related_object?: RelatedObject;
  tags: string[];
  duplicate_of_id?: string; // ID of original request if duplicate
  spam_reason?: string;
  resolution_summary?: string;
  
  // Notes & History
  internal_notes: InternalNote[];
  timeline: TimelineEvent[];
  
  // Read / Unread / Flags
  is_unread: boolean;
  is_starred?: boolean;
  deleted_at?: string; // Soft delete / trash
}

export type MainTabType = 
  | 'all'           // Tất cả
  | 'my_queue'      // Việc của tôi
  | 'unassigned'    // Chưa phân công
  | 'overdue'       // Quá hạn
  | 'general'       // Liên hệ chung
  | 'product'       // Liên hệ sản phẩm
  | 'resolved'      // Đã giải quyết
  | 'spam'          // Spam / Duplicate
  | 'trash';        // Thùng rác

export type SavedFilterView = 
  | 'all'
  | 'my_urgent'
  | 'unassigned_today'
  | 'overdue_sales'
  | 'product_quotes'
  | 'awaiting_close';

export interface FilterState {
  searchQuery: string;
  sources: ContactSource[];
  statuses: ContactStatus[];
  priority: PriorityLevel[];
  slaStatuses: SlaStatus[];
  ownerId: string;
  team: string;
  dateRange: 'all' | 'today' | '7days' | '30days' | 'custom';
  productId: string;
  isUnreadOnly: boolean;
}

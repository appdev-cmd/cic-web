import { ContactRequest, ContactSource, ContactStatus, FilterState, PriorityLevel, SlaStatus } from './types';

/**
 * PII Masking helper functions
 */
export function maskEmail(email?: string): string {
  if (!email) return '—';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***.***';
  const [name, domain] = parts;
  const maskedName = name.length <= 2 ? name[0] + '***' : name[0] + '***' + name[name.length - 1];
  const domainParts = domain.split('.');
  const maskedDomain = domainParts.map((dp, idx) => (idx === domainParts.length - 1 ? dp : dp[0] + '***')).join('.');
  return `${maskedName}@${maskedDomain}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return '—';
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length < 7) return '09******';
  return cleaned.substring(0, 3) + '****' + cleaned.substring(cleaned.length - 3);
}

export function maskName(name?: string): string {
  if (!name) return '—';
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return name[0] + '***';
  return words.map((w, i) => (i === 0 || i === words.length - 1 ? w : w[0] + '*')).join(' ');
}

/**
 * Format SLA Remaining Time
 */
export function getSlaRemainingText(deadlineIso: string, status: ContactStatus): { text: string; isOverdue: boolean } {
  if (status === 'resolved' || status === 'closed' || status === 'spam' || status === 'duplicate') {
    return { text: 'Đã hoàn tất', isOverdue: false };
  }
  
  const now = new Date().getTime();
  const deadline = new Date(deadlineIso).getTime();
  const diffMs = deadline - now;
  
  if (diffMs <= 0) {
    const overdueMins = Math.abs(Math.floor(diffMs / (1000 * 60)));
    const hours = Math.floor(overdueMins / 60);
    const mins = overdueMins % 60;
    const text = hours > 0 ? `Quá hạn ${hours}h ${mins}m` : `Quá hạn ${mins} phút`;
    return { text, isOverdue: true };
  } else {
    const remMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(remMins / 60);
    const mins = remMins % 60;
    const text = hours > 0 ? `Còn ${hours}h ${mins}m` : `Còn ${mins} phút`;
    return { text, isOverdue: false };
  }
}

/**
 * Filter requests matching UI criteria
 */
export function filterContactRequests(
  requests: ContactRequest[],
  filter: FilterState,
  currentUserId: string
): ContactRequest[] {
  return requests.filter((req) => {
    // Search query match (Code, Name, Email, Phone, Subject, Company, Related Product)
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchId = req.id.toLowerCase().includes(q);
      const matchName = req.sender_name.toLowerCase().includes(q);
      const matchEmail = req.sender_email.toLowerCase().includes(q);
      const matchPhone = req.sender_phone.includes(q);
      const matchCompany = (req.sender_company || '').toLowerCase().includes(q);
      const matchSubject = req.request_subject.toLowerCase().includes(q);
      const matchContent = req.request_content.toLowerCase().includes(q);
      const matchProduct = (req.related_object?.title || '').toLowerCase().includes(q);
      
      if (!matchId && !matchName && !matchEmail && !matchPhone && !matchCompany && !matchSubject && !matchContent && !matchProduct) {
        return false;
      }
    }

    // Source filter
    if (filter.sources.length > 0 && !filter.sources.includes(req.source)) {
      return false;
    }

    // Status filter
    if (filter.statuses.length > 0 && !filter.statuses.includes(req.status)) {
      return false;
    }

    // Priority filter
    if (filter.priority.length > 0 && !filter.priority.includes(req.priority)) {
      return false;
    }

    // SLA filter
    if (filter.slaStatuses.length > 0 && !filter.slaStatuses.includes(req.sla_status)) {
      return false;
    }

    // Owner filter
    if (filter.ownerId === 'me' && req.owner_id !== currentUserId) {
      return false;
    } else if (filter.ownerId === 'unassigned' && req.owner_id) {
      return false;
    } else if (filter.ownerId && filter.ownerId !== 'all' && filter.ownerId !== 'me' && filter.ownerId !== 'unassigned' && req.owner_id !== filter.ownerId) {
      return false;
    }

    // Team filter
    if (filter.team && filter.team !== 'all' && req.assigned_team !== filter.team) {
      return false;
    }

    // Unread filter
    if (filter.isUnreadOnly && !req.is_unread) {
      return false;
    }

    return true;
  });
}

/**
 * Source badge label & color
 */
export function getSourceBadge(source: ContactSource): { label: string; colorClass: string } {
  switch (source) {
    case 'general_contact':
      return { label: 'Liên hệ chung', colorClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
    case 'product_registration':
      return { label: 'Liên hệ sản phẩm', colorClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
    case 'service_inquiry':
      return { label: 'Tư vấn dịch vụ', colorClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    case 'technical_support':
      return { label: 'Hỗ trợ kỹ thuật', colorClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
    case 'event_registration':
      return { label: 'Đăng ký sự kiện', colorClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
    default:
      return { label: 'Khác', colorClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
  }
}

/**
 * Status badge label & color
 */
export function getStatusBadge(status: ContactStatus): { label: string; colorClass: string } {
  switch (status) {
    case 'new':
      return { label: 'Mới (New)', colorClass: 'bg-blue-500 text-white font-medium' };
    case 'assigned':
      return { label: 'Đã phân công', colorClass: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-700' };
    case 'in_progress':
      return { label: 'Đang xử lý', colorClass: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold' };
    case 'resolved':
      return { label: 'Đã giải quyết', colorClass: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700' };
    case 'closed':
      return { label: 'Đã đóng', colorClass: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700' };
    case 'spam':
      return { label: 'Spam / Rác', colorClass: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700' };
    case 'duplicate':
      return { label: 'Trùng lặp', colorClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700' };
    default:
      return { label: status, colorClass: 'bg-slate-100 text-slate-800' };
  }
}

/**
 * Priority badge label & color
 */
export function getPriorityBadge(priority: PriorityLevel): { label: string; colorClass: string } {
  switch (priority) {
    case 'urgent':
      return { label: 'Khẩn cấp', colorClass: 'bg-rose-600 text-white font-bold animate-pulse' };
    case 'high':
      return { label: 'Cao', colorClass: 'bg-orange-500 text-white font-semibold' };
    case 'normal':
      return { label: 'Bình thường', colorClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700' };
    case 'low':
      return { label: 'Thấp', colorClass: 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400' };
  }
}

// Status Types constants

// CTA Status
export const CTA_STATUSES = [
  { value: 'active', label: 'Đang hoạt động', color: 'green' },
  { value: 'inactive', label: 'Tạm ngừng', color: 'orange' },
  { value: 'draft', label: 'Bản nháp', color: 'yellow' },
  { value: 'archived', label: 'Lưu trữ', color: 'gray' },
] as const;

export type CtaStatus = typeof CTA_STATUSES[number]['value'];

export const CTA_STATUS_LABELS: Record<CtaStatus, string> = {
  active: 'Đang hoạt động',
  inactive: 'Tạm ngừng',
  draft: 'Bản nháp',
  archived: 'Lưu trữ',
};

export const CTA_STATUS_COLORS: Record<CtaStatus, string> = {
  active: 'green',
  inactive: 'orange',
  draft: 'yellow',
  archived: 'gray',
};

// Form Status
export const FORM_STATUSES = [
  { value: 'active', label: 'Đang hoạt động', color: 'green' },
  { value: 'inactive', label: 'Tạm ngừng', color: 'orange' },
  { value: 'draft', label: 'Bản nháp', color: 'yellow' },
  { value: 'archived', label: 'Lưu trữ', color: 'gray' },
] as const;

export type FormStatus = typeof FORM_STATUSES[number]['value'];

export const FORM_STATUS_LABELS: Record<FormStatus, string> = {
  active: 'Đang hoạt động',
  inactive: 'Tạm ngừng',
  draft: 'Bản nháp',
  archived: 'Lưu trữ',
};

export const FORM_STATUS_COLORS: Record<FormStatus, string> = {
  active: 'green',
  inactive: 'orange',
  draft: 'yellow',
  archived: 'gray',
};

// Customer Request Status
export const REQUEST_STATUSES = [
  { value: 'new', label: 'Mới', color: 'blue' },
  { value: 'received', label: 'Đã tiếp nhận', color: 'cyan' },
  { value: 'processing', label: 'Đang xử lý', color: 'orange' },
  { value: 'contacted', label: 'Đã liên hệ', color: 'purple' },
  { value: 'completed', label: 'Hoàn thành', color: 'green' },
  { value: 'not_suitable', label: 'Không phù hợp', color: 'gray' },
  { value: 'cancelled', label: 'Hủy', color: 'red' },
] as const;

export type RequestStatus = typeof REQUEST_STATUSES[number]['value'];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  new: 'Mới',
  received: 'Đã tiếp nhận',
  processing: 'Đang xử lý',
  contacted: 'Đã liên hệ',
  completed: 'Hoàn thành',
  not_suitable: 'Không phù hợp',
  cancelled: 'Hủy',
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  new: 'blue',
  received: 'cyan',
  processing: 'orange',
  contacted: 'purple',
  completed: 'green',
  not_suitable: 'gray',
  cancelled: 'red',
};

// Priority Levels
export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Thấp', color: 'gray' },
  { value: 'medium', label: 'Trung bình', color: 'blue' },
  { value: 'high', label: 'Cao', color: 'orange' },
  { value: 'urgent', label: 'Khẩn cấp', color: 'red' },
] as const;

export type PriorityLevel = typeof PRIORITY_LEVELS[number]['value'];

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  urgent: 'Khẩn cấp',
};

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
};

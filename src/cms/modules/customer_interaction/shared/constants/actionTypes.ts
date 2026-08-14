// CTA Action Types constants

export const ACTION_TYPES = [
  { value: 'open_form', label: 'Mở Biểu mẫu' },
  { value: 'redirect_internal', label: 'Điều hướng URL nội bộ' },
  { value: 'redirect_external', label: 'Điều hướng URL bên ngoài' },
  { value: 'scroll_to_section', label: 'Cuộn tới Section' },
  { value: 'download_file', label: 'Tải File' },
  { value: 'call_phone', label: 'Gọi điện' },
  { value: 'send_email', label: 'Gửi Email' },
] as const;

export type ActionType = typeof ACTION_TYPES[number]['value'];

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  open_form: 'Mở Biểu mẫu',
  redirect_internal: 'Điều hướng URL nội bộ',
  redirect_external: 'Điều hướng URL bên ngoài',
  scroll_to_section: 'Cuộn tới Section',
  download_file: 'Tải File',
  call_phone: 'Gọi điện',
  send_email: 'Gửi Email',
};

export const getActionTypeLabel = (type: ActionType): string => {
  return ACTION_TYPE_LABELS[type] || type;
};

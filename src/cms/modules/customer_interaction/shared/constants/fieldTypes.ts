// Form Field Types constants

export const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'file_upload', label: 'File Upload' },
  { value: 'hidden', label: 'Hidden Field' },
  { value: 'consent', label: 'Consent Checkbox' },
] as const;

export type FieldType = typeof FIELD_TYPES[number]['value'];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  textarea: 'Textarea',
  email: 'Email',
  phone: 'Phone',
  number: 'Number',
  select: 'Select',
  radio: 'Radio',
  checkbox: 'Checkbox',
  date: 'Date',
  file_upload: 'File Upload',
  hidden: 'Hidden Field',
  consent: 'Consent Checkbox',
};

export const getFieldTypeLabel = (type: FieldType): string => {
  return FIELD_TYPE_LABELS[type] || type;
};

// Field Role Types
export const FIELD_ROLE_TYPES = [
  { value: 'customer_name', label: 'Họ tên khách hàng' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Số điện thoại' },
  { value: 'company', label: 'Công ty' },
  { value: 'message', label: 'Tin nhắn/nội dung' },
  { value: 'other', label: 'Khác' },
] as const;

export type FieldRoleType = typeof FIELD_ROLE_TYPES[number]['value'];

export const FIELD_ROLE_LABELS: Record<FieldRoleType, string> = {
  customer_name: 'Họ tên khách hàng',
  email: 'Email',
  phone: 'Số điện thoại',
  company: 'Công ty',
  message: 'Tin nhắn/nội dung',
  other: 'Khác',
};

export const getFieldRoleLabel = (type: FieldRoleType): string => {
  return FIELD_ROLE_LABELS[type] || type;
};

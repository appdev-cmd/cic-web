import type { FormFieldDefinition, GoogleSheetsColumnMapping } from '@/features/forms/types';

export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function normalizeText(str: string): string {
  return removeVietnameseTones(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Canonical aliases for system fields
const SYSTEM_FIELD_MATCHES: Record<string, string[]> = {
  submitted_at: ['thoi gian', 'thoi gian gui', 'ngay gui', 'ngay tao', 'created at', 'timestamp', 'date', 'thoi gian tao'],
  submission_id: ['ma gui', 'ma yeu cau', 'ma submission', 'submission id', 'id', 'ma don', 'ma'],
  source_path: ['duong dan trang', 'trang gui', 'duong dan', 'url', 'link', 'source path', 'trang', 'link trang'],
  form_title: ['ten bieu mau', 'bieu mau', 'form title', 'form name', 'ten form'],
};

// Canonical aliases for role_types
const ROLE_TYPE_MATCHES: Record<string, string[]> = {
  customer_name: ['ho va ten', 'ho ten', 'ten khach hang', 'ten', 'full name', 'fullname', 'name', 'nguoi gui', 'khach hang'],
  email: ['email', 'thu dien tu', 'dia chi email', 'e mail', 'mail'],
  phone: ['so dien thoai', 'dien thoai', 'so di dong', 'di dong', 'sdt', 'hotline', 'phone', 'telephone', 'mobile', 'cellphone'],
  company: ['cong ty', 'to chuc', 'don vi', 'doanh nghiep', 'company', 'organization', 'agency'],
  message: ['noi dung', 'loi nhan', 'ghi chu', 'yeu cau', 'tin nhan', 'message', 'note', 'content', 'noi dung tin nhan'],
};

/**
 * Deterministically match Google Sheet headers to form fields or system fields.
 * Strict rules:
 * 1. Exact field_key match (case-insensitive)
 * 2. Exact normalized label match
 * 3. Semantic role_type match
 * 4. System field match
 * 5. Otherwise: UNMAPPED
 */
export function matchSheetHeadersToFields(
  headers: string[],
  fields: FormFieldDefinition[]
): GoogleSheetsColumnMapping[] {
  return headers.map((rawHeader) => {
    const trimmedHeader = rawHeader.trim();
    const normalizedHeader = normalizeText(trimmedHeader);

    // Rule 1: Exact field_key match (case-insensitive)
    const exactKeyField = fields.find(
      (f) => f.fieldKey.toLowerCase() === trimmedHeader.toLowerCase() || f.fieldKey.toLowerCase() === normalizedHeader
    );
    if (exactKeyField) {
      return {
        sheetHeader: trimmedHeader,
        sourceType: 'field',
        sourceKey: exactKeyField.fieldKey,
      };
    }

    // Rule 2: Exact normalized label match
    const exactLabelField = fields.find(
      (f) => normalizeText(f.label) === normalizedHeader
    );
    if (exactLabelField) {
      return {
        sheetHeader: trimmedHeader,
        sourceType: 'field',
        sourceKey: exactLabelField.fieldKey,
      };
    }

    // Rule 3: Semantic role_type match
    for (const [role, aliases] of Object.entries(ROLE_TYPE_MATCHES)) {
      if (aliases.includes(normalizedHeader)) {
        // Find field with this roleType or matching fieldKey
        const roleField = fields.find((f) => f.roleType === role || f.fieldKey.toLowerCase() === role);
        if (roleField) {
          return {
            sheetHeader: trimmedHeader,
            sourceType: 'field',
            sourceKey: roleField.fieldKey,
          };
        }
      }
    }

    // Rule 4: System field match
    for (const [sysKey, aliases] of Object.entries(SYSTEM_FIELD_MATCHES)) {
      if (aliases.includes(normalizedHeader)) {
        return {
          sheetHeader: trimmedHeader,
          sourceType: 'system',
          sourceKey: sysKey,
        };
      }
    }

    // Rule 5: Fallback to UNMAPPED
    return {
      sheetHeader: trimmedHeader,
      sourceType: 'field',
      sourceKey: '',
    };
  });
}

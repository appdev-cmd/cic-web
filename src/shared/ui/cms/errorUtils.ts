/**
 * Tiện ích chuẩn hóa và rút gọn thông báo lỗi dùng chung cho toàn bộ CMS.
 * Tự động chuyển đổi các lỗi kỹ thuật (PostgreSQL, Foreign Key, Duplicate Key, Zod/Syntax error)
 * thành thông điệp tiếng Việt ngắn gọn, thân thiện và dễ hiểu cho người dùng.
 */
export function sanitizeCmsErrorMessage(
  error: unknown,
  fallback = 'Thao tác không thành công. Vui lòng thử lại sau.'
): string {
  if (!error) return fallback;
  const msg = typeof error === 'string' ? error : (error as any)?.message || '';
  if (!msg) return fallback;

  const lower = msg.toLowerCase();

  // 1. Lỗi trùng lặp dữ liệu (Unique Constraint)
  if (
    lower.includes('unique') ||
    lower.includes('duplicate') ||
    lower.includes('already exists') ||
    lower.includes('đã tồn tại')
  ) {
    return 'Dữ liệu này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.';
  }

  // 2. Lỗi ràng buộc khóa ngoại / dữ liệu liên kết
  if (
    lower.includes('foreign key') ||
    lower.includes('violates foreign key') ||
    lower.includes('_rel') ||
    lower.includes('còn dữ liệu liên quan') ||
    lower.includes('đang được sử dụng')
  ) {
    return 'Không thể thực hiện do bản ghi đang có liên kết với dữ liệu khác trong hệ thống.';
  }

  // 3. Thiếu thông tin bắt buộc / Lỗi validate
  if (
    lower.includes('missing') ||
    lower.includes('bắt buộc') ||
    lower.includes('required') ||
    lower.includes('chưa nhập')
  ) {
    return 'Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc.';
  }

  // 4. Lỗi phân quyền
  if (
    lower.includes('permission') ||
    lower.includes('quyền') ||
    lower.includes('forbidden') ||
    lower.includes('unauthorized') ||
    lower.includes('access denied')
  ) {
    return 'Bạn không có quyền thực hiện thao tác này.';
  }

  // 5. Lỗi máy chủ / Database raw exception
  if (
    lower.includes('postgres') ||
    lower.includes('syntax error') ||
    lower.includes('relation') ||
    lower.includes('internal server error') ||
    lower.includes('econnrefused')
  ) {
    return 'Hệ thống gặp sự cố khi xử lý dữ liệu. Vui lòng thử lại sau.';
  }

  // Nếu là thông báo ngắn gọn, không chứa stack trace hay code
  if (
    msg.length < 100 &&
    !msg.includes(';') &&
    !msg.includes('{') &&
    !msg.includes('at ') &&
    !msg.includes('Error:')
  ) {
    return msg;
  }

  return fallback;
}

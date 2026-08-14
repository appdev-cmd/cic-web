export type DictionaryApplication = 'web' | 'cms';
export type DictionaryStatus = 'active' | 'new' | 'missing' | 'needs_check' | 'deprecated';
export type DictionaryLocale = 'vi' | 'en';

export interface DictionaryHistory {
  id: string;
  locale: DictionaryLocale;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
  source: 'cms' | 'sync';
}

export interface DictionaryEntry {
  id: string;
  key: string;
  application: DictionaryApplication;
  namespace: string;
  description: string;
  context: string;
  defaultLocale: DictionaryLocale;
  defaultValue: string;
  values: Record<DictionaryLocale, string>;
  requiredVariables: string[];
  lengthHint?: number;
  status: DictionaryStatus;
  updatedAt: string;
  updatedBy: string;
  history: DictionaryHistory[];
}

export const INITIAL_DICTIONARY_ENTRIES: DictionaryEntry[] = [
  { id: 'dict_01', key: 'cms.common.save', application: 'cms', namespace: 'common', description: 'Nút lưu dữ liệu dùng chung trong CMS.', context: 'Thanh hành động của form và modal.', defaultLocale: 'vi', defaultValue: 'Lưu', values: { vi: 'Lưu', en: 'Save' }, requiredVariables: [], lengthHint: 20, status: 'active', updatedAt: '2026-08-10T09:15:00+07:00', updatedBy: 'Nguyễn Văn Quản Trị', history: [] },
  { id: 'dict_02', key: 'cms.common.cancel', application: 'cms', namespace: 'common', description: 'Hủy thao tác hiện tại mà không lưu thay đổi.', context: 'Form, modal xác nhận.', defaultLocale: 'vi', defaultValue: 'Hủy', values: { vi: 'Hủy', en: 'Cancel' }, requiredVariables: [], lengthHint: 20, status: 'active', updatedAt: '2026-08-10T09:15:00+07:00', updatedBy: 'Nguyễn Văn Quản Trị', history: [] },
  { id: 'dict_03', key: 'cms.common.publish', application: 'cms', namespace: 'common', description: 'Xuất bản phiên bản nội dung hiện tại.', context: 'Thanh hành động nội dung.', defaultLocale: 'vi', defaultValue: 'Xuất bản', values: { vi: 'Xuất bản', en: 'Publish' }, requiredVariables: [], lengthHint: 24, status: 'active', updatedAt: '2026-08-09T14:30:00+07:00', updatedBy: 'Lê Minh Anh', history: [] },
  { id: 'dict_04', key: 'cms.validation.required', application: 'cms', namespace: 'validation', description: 'Thông báo khi trường bắt buộc chưa có dữ liệu.', context: 'Validation dùng chung của CMS.', defaultLocale: 'vi', defaultValue: 'Trường này là bắt buộc.', values: { vi: 'Trường này là bắt buộc.', en: 'This field is required.' }, requiredVariables: [], status: 'active', updatedAt: '2026-08-08T10:00:00+07:00', updatedBy: 'Developer Sync', history: [] },
  { id: 'dict_05', key: 'cms.notification.save_success', application: 'cms', namespace: 'notification', description: 'Thông báo sau khi lưu dữ liệu thành công.', context: 'Toast dùng chung trong CMS.', defaultLocale: 'vi', defaultValue: 'Lưu thành công.', values: { vi: 'Lưu thành công.', en: 'Saved successfully.' }, requiredVariables: [], status: 'active', updatedAt: '2026-08-08T10:00:00+07:00', updatedBy: 'Developer Sync', history: [] },
  { id: 'dict_06', key: 'web.common.read_more', application: 'web', namespace: 'common', description: 'Liên kết mở nội dung chi tiết.', context: 'Card tin tức, sản phẩm và dự án.', defaultLocale: 'vi', defaultValue: 'Xem thêm', values: { vi: 'Xem thêm', en: 'Read more' }, requiredVariables: [], lengthHint: 20, status: 'active', updatedAt: '2026-08-07T16:45:00+07:00', updatedBy: 'Trần Thu Hà', history: [] },
  { id: 'dict_07', key: 'web.common.no_data', application: 'web', namespace: 'common', description: 'Empty state dùng khi danh sách không có dữ liệu.', context: 'Danh sách và kết quả lọc trên website.', defaultLocale: 'vi', defaultValue: 'Không tìm thấy dữ liệu.', values: { vi: 'Không tìm thấy dữ liệu.', en: 'No data found.' }, requiredVariables: [], status: 'active', updatedAt: '2026-08-07T16:45:00+07:00', updatedBy: 'Trần Thu Hà', history: [] },
  { id: 'dict_08', key: 'web.search.result_count', application: 'web', namespace: 'search', description: 'Thông báo số kết quả tìm kiếm.', context: 'Đầu trang kết quả tìm kiếm.', defaultLocale: 'vi', defaultValue: 'Đã tìm thấy {{count}} kết quả.', values: { vi: 'Đã tìm thấy {{count}} kết quả.', en: 'Found {{count}} results.' }, requiredVariables: ['count'], status: 'active', updatedAt: '2026-08-06T11:20:00+07:00', updatedBy: 'Developer Sync', history: [] },
  { id: 'dict_09', key: 'web.form.submit', application: 'web', namespace: 'form', description: 'Nút gửi biểu mẫu dùng nhãn mặc định.', context: 'Form website chưa cấu hình nhãn riêng.', defaultLocale: 'vi', defaultValue: 'Gửi', values: { vi: 'Gửi', en: 'Submit' }, requiredVariables: [], lengthHint: 20, status: 'new', updatedAt: '2026-08-11T08:00:00+07:00', updatedBy: 'Developer Sync', history: [] },
  { id: 'dict_10', key: 'web.form.invalid_phone', application: 'web', namespace: 'form', description: 'Thông báo số điện thoại không hợp lệ.', context: 'Validation biểu mẫu website.', defaultLocale: 'vi', defaultValue: 'Số điện thoại không hợp lệ.', values: { vi: 'Số điện thoại không hợp lệ.', en: '' }, requiredVariables: [], status: 'missing', updatedAt: '2026-08-11T08:00:00+07:00', updatedBy: 'Developer Sync', history: [] },
];

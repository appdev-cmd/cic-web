# Thiết Kế Hệ Thống Thông Báo CMS (CMS Notification Center)

- **Ngày tạo:** 2026-10-06
- **Trạng thái:** Đã thống nhất thiết kế (Approved)
- **Nhánh triển khai:** `refactor/nextjs-fullstack`

---

## 1. Mục tiêu & Bối cảnh

Hệ thống CMS hiện đã có biểu tượng Chuông thông báo ở `CmsHeader`, nhưng đang nhận mảng rỗng (`initialNotifications={[]}`) và chưa có cơ sở dữ liệu lưu trữ cũng như cơ chế phát hiện sự kiện thời gian thực.

Mục tiêu của hệ thống **CMS Notification Center**:
1. Tự động ghi nhận thông báo tức thời khi có các tương tác quan trọng từ website (Khách gửi liên hệ, yêu cầu báo giá, đăng ký sự kiện), khi có thay đổi trạng thái nội dung biên tập, hoặc cảnh báo hệ thống.
2. **Phân quyền chặt chẽ theo vai trò (RBAC):** Chỉ những tài khoản có quyền đối với module tương ứng mới nhận được thông báo (Admin xem toàn bộ; Sales xem khách hàng/báo giá; Editor xem bài viết/sản phẩm; IT xem hệ thống). Hỗ trợ thông báo gửi đích danh cho 1 tài khoản cụ thể.
3. **Quản lý trạng thái Đã đọc độc lập:** Mỗi tài khoản có danh sách thông báo và trạng thái đã đọc riêng biệt (tài khoản A đọc không làm mất trạng thái chưa đọc của tài khoản B).
4. **Trải nghiệm người dùng mượt mà:** Cập nhật ngầm bằng cơ chế polling nhẹ (30s) + revalidate khi quay lại tab, hiển thị số chưa đọc động, thông báo Toast nổi + âm thanh chuông nhẹ khi có khách hàng mới, và trang quản lý lịch sử `/cms/notifications`.
5. **Cập nhật tài liệu đầy đủ:** Khai báo cấu trúc bảng trong `db_migrate/database.html` và tài liệu delta lược đồ CSDL.

---

## 2. Kiến trúc Cơ sở dữ liệu (Database Schema)

### 2.1. Bảng `cms_notifications` (Lưu thông tin sự kiện thông báo)

```sql
CREATE TABLE IF NOT EXISTS cms_notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'contact' | 'registration' | 'quote' | 'editorial' | 'system' | 'security'
    target_module VARCHAR(100), -- 'customer_requests', 'news', 'products', 'events', 'system' (đối chiếu RBAC)
    target_action VARCHAR(50) DEFAULT 'view', -- 'view' | 'edit'
    target_user_id BIGINT REFERENCES cic_users(id) ON DELETE CASCADE, -- NULL nếu broadcast cho nhóm quyền, hoặc ID tài khoản đích danh
    link_url TEXT, -- Đường dẫn điều hướng khi click: ví dụ '/cms/customer-requests?id=123'
    metadata JSONB DEFAULT '{}'::jsonb, -- Dữ liệu mở rộng: { customer_name, email, phone, entity_id, ... }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục tăng tốc độ truy vấn
CREATE INDEX IF NOT EXISTS idx_cms_notifications_module ON cms_notifications(target_module, target_action);
CREATE INDEX IF NOT EXISTS idx_cms_notifications_user ON cms_notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_cms_notifications_created_at ON cms_notifications(created_at DESC);
```

### 2.2. Bảng `cms_notification_reads` (Trạng thái đã đọc theo từng tài khoản)

```sql
CREATE TABLE IF NOT EXISTS cms_notification_reads (
    notification_id BIGINT NOT NULL REFERENCES cms_notifications(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES cic_users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (notification_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cms_notification_reads_user ON cms_notification_reads(user_id);
```

### 2.3. Cập nhật Tài liệu Cơ sở dữ liệu
- Tạo file migration: `db_migrate/migrations/20261006_cms_notifications.sql`.
- Bổ sung định nghĩa bảng `cms_notifications` và `cms_notification_reads` vào:
  - `db_migrate/database.html` (Mục Module Hệ thống & Tương tác người dùng).
  - `docs/database/POSTGRES_SCHEMA_DELTA.md`.

---

## 3. Phân quyền & Bảo mật (RBAC Security Filtering)

Việc lọc thông báo được thực thi an toàn tại tầng server dựa trên `CmsPrincipal` từ `src/server/auth/guards.ts`:

1. **Quản trị viên (`principal.isAdministrator === true`):**
   - Được quyền xem tất cả thông báo hệ thống, thông báo broadcast của mọi module, và thông báo đích danh gửi cho mình.
2. **Nhân viên / Biên tập viên thường:**
   - Chỉ được xem thông báo nếu thỏa mãn một trong hai điều kiện:
     - Gửi đích danh: `target_user_id = principal.legacyUserId`.
     - Thông báo nhóm (`target_user_id IS NULL`): Kiểm tra quyền `can(principal, target_module, target_action) === true`.
3. **Trạng thái đọc:**
   - Join bảng `cms_notification_reads` với điều kiện `user_id = principal.legacyUserId`.
   - Nếu `read_at IS NOT NULL` -> `unread = false`.
   - Ngược lại -> `unread = true`.

---

## 4. Backend Logic & Server Actions

Tạo module `src/server/notifications/`:
- `src/server/notifications/types.ts`: Định nghĩa types cho Notification.
- `src/server/notifications/service.ts`: Chứa các hàm nghiệp vụ thao tác CSDL với Postgres client.
- `src/server/notifications/actions.ts`: Các Next.js Server Actions có xác thực `requireCmsAccess()`.

### 4.1. Hàm dịch vụ cốt lõi `createCmsNotification(...)`
```ts
export interface CreateNotificationInput {
  title: string;
  description: string;
  type: 'contact' | 'registration' | 'quote' | 'editorial' | 'system' | 'security';
  targetModule?: string;
  targetAction?: string;
  targetUserId?: number | null;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}
```
- Thực thi an toàn: Bọc trong khối try/catch riêng biệt để đảm bảo không làm gián đoạn luồng chính (như luồng khách gửi form trên website).

### 4.2. Các Server Actions
1. `getCmsNotificationsAction(options?: { limit?: number; page?: number; unreadOnly?: boolean; type?: string })`:
   - Trả về: `{ notifications: NotificationItem[], total: number, unreadCount: number }`.
2. `markNotificationAsReadAction(notificationId: number)`:
   - Thêm bản ghi vào `cms_notification_reads` nếu chưa có.
3. `markAllNotificationsAsReadAction()`:
   - Đánh dấu đã đọc toàn bộ thông báo thuộc quyền xem của user hiện tại.
4. `deleteNotificationAction(notificationId: number)`:
   - Xóa thông báo (chỉ dành cho Admin hoặc chủ sở hữu thông báo).

### 4.3. Các điểm kích hoạt tự động (Event Triggers)
1. **Public Form Submission:**
   - Trong `submitCustomerRequestAction` hoặc handler xử lý form liên hệ: Tự động gọi `createCmsNotification` với type `'contact'` hoặc `'quote'`, `target_module = 'customer_requests'`, `link_url = '/cms/customer-requests?id=...'`.
2. **Event Registration:**
   - Khi có đăng ký hội thảo/sự kiện: Tạo thông báo với type `'registration'`, `target_module = 'events'`.
3. **Editorial Actions:**
   - Khi xuất bản hoặc thay đổi nội dung quan trọng trong Sản phẩm/Tin tức: Tạo thông báo với type `'editorial'`.

---

## 5. Thiết kế Giao diện & Trải nghiệm người dùng (Frontend UI/UX)

### 5.1. Custom Hook `useCmsNotifications()`
Đặt tại `src/cms/hooks/useCmsNotifications.ts`:
- **State:** `notifications`, `unreadCount`, `isLoading`, `soundEnabled`.
- **Cơ chế Polling:** Gọi `getCmsNotificationsAction({ limit: 20 })` định kỳ mỗi **30 giây**.
- **Window Focus Revalidation:** Tự động gọi lại ngay khi người dùng chuyển tab quay lại CMS.
- **Phát hiện thông báo mới:** 
  - So sánh ID thông báo mới nhất. Nếu có thông báo khách hàng/sự kiện mới:
    - Bật Toast thông báo nổi ở góc màn hình: *"🔔 Yêu cầu mới từ khách hàng..."* kèm nút *"Xem ngay"*.
    - Phát âm thanh chuông "ting" ngắn dịu nhẹ bằng Web Audio API (Synthesizer tần số nhẹ, không cần tải file mp3 bên ngoài).
    - Hỗ trợ lưu cấu hình bật/tắt chuông vào `localStorage`.

### 5.2. Cập nhật `CmsHeader.tsx`
- Biểu tượng Chuông có badge đỏ hiển thị `unreadCount` kèm hiệu ứng pulse khi có tin mới.
- Dropdown Popover:
  - Header: Tiêu đề "Thông báo hệ thống", số chưa đọc, nút "Đánh dấu tất cả đã đọc", nút bật/tắt âm thanh.
  - Tabs: [Tất cả] và [Chưa đọc].
  - Danh sách thông báo: Icon màu sắc nhận diện loại thông báo, tiêu đề, tóm tắt 2 dòng, thời gian tương đối ("vài phút trước").
  - Click vào thông báo: Đánh dấu đã đọc ngay lập tức và điều hướng sang `link_url`.
  - Footer: Nút "Xem tất cả thông báo" dẫn tới trang `/cms/notifications`.

### 5.3. Màn hình Lịch sử Thông báo `/cms/notifications`
Tạo route `src/app/cms/(workspace)/[...path]/page.tsx` hoặc module `src/cms/modules/notifications/NotificationsManager.tsx`:
- Bảng danh sách thông báo đầy đủ.
- Bộ lọc theo Loại (Tất cả, Liên hệ & Báo giá, Sự kiện, Biên tập, Hệ thống) và Trạng thái (Tất cả / Chưa đọc).
- Tìm kiếm theo từ khóa.
- Phân trang pagination.
- Nút "Đánh dấu tất cả đã đọc" và thao tác xóa hàng loạt cho Admin.

---

## 6. Kế hoạch Kiểm thử & Tiêu chuẩn hoàn thành (Verification)

1. **Kiểm thử CSDL & Phân quyền:**
   - Tài khoản Admin thấy tất cả thông báo.
   - Tài khoản chỉ có quyền `news` không thấy thông báo khách hàng gửi liên hệ.
   - Đọc thông báo ở tài khoản A không ảnh hưởng trạng thái chưa đọc của tài khoản B.
2. **Kiểm thử Trigger tự động:**
   - Gửi thử 1 form liên hệ từ website -> CMS nhận được thông báo mới kèm badge và toast trong vòng 30s.
3. **Kiểm thử UI & Điều hướng:**
   - Click vào thông báo chuyển đúng đến chi tiết yêu cầu khách hàng.
   - Nút "Đánh dấu tất cả đã đọc" xóa sạch badge đỏ.
4. **Kiểm tra kỹ thuật:**
   - `npm run typecheck:foundation` đạt 0 lỗi.
   - Cập nhật đầy đủ vào `db_migrate/database.html`.

# Tổng quan tài liệu kiến trúc CMS

> Mục đích: Biết cần đọc và cập nhật tài liệu nào trước khi thêm database, sửa database hoặc triển khai backend.  
> Lưu ý: Các tài liệu dưới đây là thiết kế đã khảo sát, chưa đồng nghĩa database/backend đã được triển khai.

## Tài liệu cần tìm

| Khi làm chức năng | Đọc và cập nhật tài liệu |
|---|---|
| Người dùng | `users-roles-permissions-data-compatibility-plan.md` |
| Vai trò & Quyền | `users-roles-permissions-data-compatibility-plan.md` |
| Nhật ký hoạt động | `activity-audit-log-data-plan.md` |
| Thùng rác | `trash-data-compatibility-plan.md` |
| Tin tức | `news-data-backend-compatibility.md` |
| Trang nội dung | `static-pages-page-builder-data-backend-plan.md` |
| Các lỗi FK/schema PostgreSQL đã phát hiện | `postgresql-schema-issues.md` |
| Module được kết luận giữ nguyên | `unchanged-modules-data-compatibility.md` — sẽ tạo khi có module đầu tiên được chốt giữ nguyên |

## Nội dung của từng tài liệu

### `users-roles-permissions-data-compatibility-plan.md`

Dùng khi sửa hoặc triển khai:

- Bảng người dùng.
- Vai trò và ma trận quyền.
- Phạm vi phụ trách của người dùng.
- Chuyển dữ liệu người dùng/quyền từ CMS cũ.
- API đăng nhập, quản lý tài khoản và phân quyền.

Tài liệu ghi rõ trường legacy cần giữ, bảng mới cần bổ sung, cách map dữ liệu và những trường có thể xem xét bỏ sau này.

### `activity-audit-log-data-plan.md`

Dùng khi sửa hoặc triển khai:

- Bảng Nhật ký hoạt động.
- Ghi lại ai làm gì, lúc nào và trên dữ liệu nào.
- Dữ liệu thay đổi trước/sau.
- API danh sách, chi tiết và xuất báo cáo audit.
- Liên kết audit với các module khác.

Đây là bảng mới; không tái sử dụng nhầm bảng `cic_history` của CMS cũ.

### `trash-data-compatibility-plan.md`

Dùng khi sửa hoặc triển khai:

- Bảng `cic_trash_items`.
- `deleted_at`, `deleted_by` và thời hạn lưu giữ.
- Snapshot để phục hồi dữ liệu.
- Xóa mềm, phục hồi và xóa vĩnh viễn.
- Xử lý file, quan hệ và foreign key khi xóa.
- API của module Thùng rác.

Tài liệu giải thích vì sao không thể tiếp tục dùng trực tiếp cơ chế hard-delete của CMS cũ.

### `news-data-backend-compatibility.md`

Dùng khi triển khai database/API cho bài viết và danh mục Tin tức, bao gồm field legacy, mapping kiểu dữ liệu, Draft/Published, VI/EN và public contract.

Các lỗi khóa ngoại PostgreSQL được ghi chung tại `postgresql-schema-issues.md` để xử lý schema độc lập và tránh tạo nhiều file issue theo module.

### `static-pages-page-builder-data-backend-plan.md`

Dùng khi triển khai database/API cho module Trang nội dung mới, bao gồm Page, Draft/Published version, Section cố định, config theo `section_type`, entity reference chọn thủ công và cách giữ dữ liệu `cic_contents*` chỉ để đối chiếu legacy.

Tài liệu này cũng xác định rõ public chỉ đọc Published, Preview đọc Draft và backend phải enforce template/giới hạn thay vì tin dữ liệu gửi từ frontend.

### `unchanged-modules-data-compatibility.md`

Đây sẽ là tài liệu chung cho những module sau khảo sát được kết luận:

- Giữ nguyên bảng và trường legacy.
- Không cần kiến trúc database riêng.
- Chỉ cần mapping trực tiếp sang API/backend mới.
- Không có rủi ro đặc biệt cần một tài liệu riêng.

Không tạo file này khi chưa có module nào được chốt giữ nguyên.

## Khi nào tạo tài liệu riêng cho module

Chỉ tạo một tài liệu riêng nếu module có ít nhất một trong các điểm sau:

- Cần bảng mới hoặc thay đổi schema đáng kể.
- CMS mới có nghiệp vụ khác CMS cũ.
- Có dữ liệu legacy cần chuyển đổi đặc biệt.
- Có quan hệ, file, locale, permission hoặc trạng thái phức tạp.
- Có rủi ro mất dữ liệu hoặc breaking change.

Nếu không có các điểm trên, ghi module vào `unchanged-modules-data-compatibility.md` thay vì tạo thêm nhiều plan nhỏ.

## Quy trình rà soát module tiếp theo

Mỗi lần chỉ rà soát một module:

1. Đối chiếu giao diện và field CMS mới.
2. Đọc code CMS cũ để xác định field thực sự được dùng.
3. Đối chiếu database MySQL cũ và schema PostgreSQL dự kiến.
4. Xác định phần giữ nguyên, thiếu, thừa và rủi ro dữ liệu.
5. Gửi **báo cáo khảo sát trước**, chưa viết docs.
6. Sau khi báo cáo được chốt:
   - Có thay đổi đáng kể → viết tài liệu riêng.
   - Giữ nguyên/mapping trực tiếp → bổ sung vào tài liệu chung.

Không viết SQL, migration hoặc backend trước khi tài liệu của module được chốt.

## Trạng thái hiện tại

| Module | Kết quả | Tài liệu |
|---|---|---|
| Người dùng | Đã khảo sát; cần lớp tương thích và mở rộng | `users-roles-permissions-data-compatibility-plan.md` |
| Vai trò & Quyền | Đã khảo sát; cần mô hình mới nhưng giữ dữ liệu quyền cũ | `users-roles-permissions-data-compatibility-plan.md` |
| Nhật ký hoạt động | Đã khảo sát; cần bảng mới | `activity-audit-log-data-plan.md` |
| Thùng rác | Đã khảo sát; cần bảng mới và thay cơ chế hard-delete | `trash-data-compatibility-plan.md` |
| Tin tức | Đã khảo sát; giữ bảng legacy, cần mapping API và sửa FK | `news-data-backend-compatibility.md`, `postgresql-schema-issues.md` |
| Trang nội dung | Đã khảo sát; là Page Builder mới, không tái sử dụng mô hình `cic_contents` | `static-pages-page-builder-data-backend-plan.md` |
| Các module còn lại | Chưa chốt | Phải báo cáo trước khi viết docs |

## Thứ tự đề xuất

1. Tin tức.
2. Sản phẩm và Thiết lập sản phẩm.
3. Dịch vụ.
4. Sự kiện.
5. Trang nội dung.
6. Media.
7. Liên hệ và tương tác khách hàng.
8. Menu, SEO, cấu hình chung và ngôn ngữ.
9. Dashboard và các màn hình tổng hợp.

Thứ tự có thể thay đổi theo module cần làm trước. Nguyên tắc không đổi: **báo cáo trước, chốt kết luận, rồi mới viết hoặc cập nhật docs**.

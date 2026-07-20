# Quản lý danh mục sản phẩm

## Mục tiêu

Cung cấp lát cắt module hóa đầu tiên để quản trị danh mục và kiểm chứng registry, feature flag, capability, permission và frontend navigation.

## Người dùng

- Admin: xem, tạo, sửa và xóa danh mục chưa được sử dụng.
- Manager/employee: xem danh mục.

## Phạm vi

- Danh sách danh mục và số sản phẩm.
- Tạo, sửa tên/mô tả.
- Chặn xóa danh mục đang có sản phẩm.
- Menu/route lọc theo capability.

## Ngoài phạm vi

- Danh mục cha-con, disable và chuyển hàng loạt sản phẩm.
- Chuẩn hóa trường category legacy trên product.

## Permission

```text
category.view
category.manage
```

## Feature flag

```text
category_management
```

Module có thể tắt bằng `DISABLED_MODULES=["categories"]`; feature có thể override bằng `ENABLED_FEATURES`/`DISABLED_FEATURES` dạng JSON array trong environment.

## Data model và migration

Dùng bảng `product_categories` và quan hệ `products.category_id` hiện có. Không tạo migration mới.

## API

```text
GET    /api/v1/categories/
POST   /api/v1/categories/
PATCH  /api/v1/categories/{id}
DELETE /api/v1/categories/{id}
GET    /api/v1/system/features
GET    /api/v1/system/capabilities
```

## Frontend route

```text
/admin/categories
```

## Security risks

- Backend kiểm tra role cho mutation; không dựa vào ẩn nút.
- Tên/mô tả có giới hạn độ dài và SQLAlchemy dùng truy vấn tham số hóa.
- Trùng tên trả 409; danh mục đang dùng không được xóa.

## Test cases

- Registry chỉ include module enabled và từ chối tên trùng.
- Capability employee có `category.view`, không có `category.manage`.
- Frontend lint/type/build.
- Route/capability không xác thực trả 401.

## Rollback

Tắt `category_management` hoặc module `categories`; bỏ đăng ký navigation. Không xóa bảng hay dữ liệu.

## Removal plan

Ẩn menu, tắt flag/module, theo dõi consumer, deprecate API, giữ dữ liệu qua ít nhất một release rồi mới đánh giá migration xóa.

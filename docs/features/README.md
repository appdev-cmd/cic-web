# Tài liệu chức năng

Thư mục này chứa yêu cầu và thiết kế cho từng chức năng của RAG CIC.

## Cách tạo yêu cầu mới

1. Sao chép `_template.md`.
2. Đổi tên theo dạng kebab-case, ví dụ `notification-management.md`.
3. Điền rõ phạm vi, ngoài phạm vi, permission, feature flag, API, dữ liệu, test và rollback.
4. Duyệt tài liệu trước khi sửa code.

Ví dụ:

```text
docs/features/notification-management.md
docs/features/lead-management.md
docs/features/document-reindex.md
```

Không sửa trực tiếp `_template.md` cho một yêu cầu cụ thể; hãy tạo bản sao để mẫu tiếp tục dùng cho chức năng sau.

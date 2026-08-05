# QUYẾT ĐỊNH SẢN PHẨM — MODULE MẪU EMAIL

> Trạng thái: Đã chốt  
> Ngày quyết định: 2026-08-05  
> Phạm vi: CMS CIC mới  
> Giai đoạn: Quyết định kiến trúc sản phẩm, chưa phải Product Specification chi tiết

## 1. Bối cảnh

CMS hiện đã mô tả cấu hình gửi email và luồng phân công người nhận, nhưng chưa có đặc tả sản phẩm riêng cho việc quản lý nội dung mẫu email. Registry production vì vậy đang để `email_templates` ở trạng thái `VERIFY` dù route và dữ liệu khảo sát đã tồn tại.

Khảo sát CMS cũ ghi nhận khoảng 13 mẫu email, các thao tác tạo, sửa, xóa, bật/tắt và việc chọn mẫu cho các tình huống liên hệ, tải tài liệu, đặt mua, báo giá hoặc tải khóa cứng. Ma trận dataset đồng thời xác nhận có hai cặp bảng `cic_email`/`cic_email_en` và `cic_types_email`/`cic_types_email_en`.

## 2. Quyết định

Giữ `Mẫu email` thành một module sản phẩm độc lập.

- Tên module: **Mẫu email**.
- Module key: `email_templates`.
- Canonical path: `/cms/email-templates`.
- Trạng thái registry: `KEEP`.
- Dataset: `Workspace`; VI và EN là hai tập dữ liệu độc lập, không fallback.
- Navigation mục tiêu: menu cấp 1 trong nhóm **Khách hàng**, đặt ngay sau **Yêu cầu khách hàng**.
- Không đặt module trong **Thiết lập sản phẩm**.
- Không gộp module vào **Cấu hình hệ thống**.

Việc đưa menu vào runtime chỉ thực hiện sau khi Product Specification và acceptance criteria của module được duyệt.

## 3. Ranh giới trách nhiệm

| Phạm vi | Chịu trách nhiệm | Không chịu trách nhiệm |
|---|---|---|
| Cấu hình hệ thống | SMTP, danh tính gửi, reply-to, trạng thái kết nối | Nội dung template, người nhận theo nghiệp vụ |
| Thiết lập sản phẩm | Nhân sự phụ trách và routing theo sản phẩm/phạm vi | Soạn nội dung email |
| Yêu cầu khách hàng | Contact, ownership, trạng thái xử lý và lịch sử trao đổi | Quản trị thư viện template |
| Mẫu email | Nội dung, tiêu đề, loại mẫu, biến được phép dùng, trạng thái và nơi sử dụng | SMTP và quyết định người nhận |

## 4. Luồng tham chiếu bắt buộc

```text
Sự kiện nghiệp vụ
→ Routing xác định người nhận
→ Cấu hình sự kiện chọn mẫu email đang hoạt động
→ Hệ thống kết xuất dữ liệu vào biến được phép
→ Dịch vụ gửi dùng cấu hình SMTP
→ Kết quả gửi được ghi vào lịch sử của đối tượng nghiệp vụ
```

Gửi email thành công hoặc thất bại không tự động thay đổi ownership hay trạng thái xử lý của yêu cầu khách hàng.

## 5. Nguyên tắc dữ liệu và ngôn ngữ

- Mẫu VI và EN được quản lý trong workspace tương ứng.
- Không tự lấy mẫu VI khi workspace EN chưa có dữ liệu.
- Template không lưu lặp địa chỉ nhận, SMTP hoặc thông tin routing.
- Quan hệ “nơi sử dụng” phải tham chiếu template, không sao chép nội dung template vào từng sản phẩm hoặc từng rule.
- Template đang được sử dụng không được xóa cứng; chỉ được ngừng sử dụng hoặc lưu trữ.

## 6. Ảnh hưởng tới các tài liệu hiện có

- Module 06 tiếp tục quản lý người phụ trách và email routing, nhưng không quản lý nội dung mẫu.
- Module 12 hiển thị lịch sử gửi và mẫu đã sử dụng trong ngữ cảnh yêu cầu khách hàng.
- Module 16 chỉ quản lý hạ tầng gửi email.
- Cần tạo Product Specification riêng cho Mẫu email.
- Ma trận sự kiện–người nhận–template–routing được quản lý tại `docs/email-event-template-routing-matrix.md` và phải được xác nhận trước khi triển khai tích hợp.
- Danh mục token, phạm vi sử dụng và quy tắc dữ liệu thiếu được quản lý tại `docs/email-template-variable-catalog.md`.

## 7. Ngoài phạm vi quyết định này

- Không chốt danh sách field chi tiết.
- Không thiết kế API hoặc database.
- Không thiết kế cơ chế gửi email marketing hàng loạt.
- Không bật menu production trong giai đoạn này.
- Không quyết định workflow duyệt chi tiết trước khi hoàn thành Product Specification.

## 8. Điều kiện chuyển sang triển khai

- Product Specification của Mẫu email được duyệt.
- Ma trận sự kiện–template được chốt.
- Danh sách biến của từng loại template được xác nhận.
- Quyền xem, sửa, duyệt, kích hoạt và lưu trữ được xác nhận.
- Kế hoạch đối chiếu 13 mẫu cũ và consumer hiện tại được hoàn thành.

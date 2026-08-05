# VARIABLE CATALOG — MẪU EMAIL

> Phạm vi: Bước 4 của thiết kế module Mẫu email  
> Ngày rà soát: 2026-08-05  
> Trạng thái: Baseline sản phẩm; các biến phụ thuộc nghiệp vụ chưa xác nhận không được bật trong production

## 1. Mục tiêu

Tài liệu này định nghĩa thư viện biến mà người dùng được phép chèn vào tiêu đề và nội dung email. Catalog giúp UI Designer thiết kế Variable Picker, người soạn hiểu dữ liệu bằng ngôn ngữ nghiệp vụ, QA kiểm tra preview/render và đội triển khai không phải cho template truy cập toàn bộ dữ liệu hệ thống.

Catalog không định nghĩa API, database, SMTP, người nhận hoặc logic routing.

## 2. Nguyên tắc hiển thị cho người dùng

- UI hiển thị **tên tiếng Việt dễ hiểu** trước; token kỹ thuật chỉ là giá trị được chèn vào editor.
- Biến được chia theo nhóm nghiệp vụ, có tìm kiếm và mô tả ngắn.
- Chỉ hiện biến hợp lệ với `workspace + event + audience` đang chọn.
- Không cho nhập hoặc tạo token ngoài catalog.
- Preview mặc định dùng dữ liệu giả; dữ liệu thật chỉ hiện khi người dùng có quyền phù hợp.
- Token không được dịch giữa VI và EN; nhãn, mô tả và dữ liệu mẫu được bản địa hóa.
- Biến không quyết định người nhận, địa chỉ gửi, CC/BCC, SMTP hoặc routing.

## 3. Cú pháp chuẩn

Cú pháp hiển thị trong editor:

```text
{{group.variable}}
```

Quy tắc:

- Dùng chữ thường, tiếng Anh không dấu và dấu chấm để phân nhóm.
- Không hỗ trợ biểu thức, gọi hàm, truy cập object tùy ý hoặc mã thực thi.
- Khi chèn qua Variable Picker, token được đưa vào đúng vị trí con trỏ và hiển thị như một chip có thể nhận biết.
- Nếu người dùng sửa tay làm sai cú pháp, editor báo lỗi tại token và không cho Activate.
- Copy/paste token hợp lệ vẫn được nhận diện lại thành biến trong catalog.

## 4. Thuộc tính của một biến

Mỗi biến trong catalog phải có:

| Thuộc tính | Ý nghĩa sản phẩm |
|---|---|
| Tên hiển thị | Cách gọi dễ hiểu cho người non-tech |
| Token | Chuỗi chèn vào template |
| Mô tả | Dữ liệu này đại diện cho điều gì |
| Audience | Khách hàng, nội bộ hoặc cả hai |
| Vị trí | Tiêu đề, nội dung hoặc cả hai |
| Mức dữ liệu | Công khai, nội bộ hoặc dữ liệu cá nhân |
| Event áp dụng | Loại sự kiện được phép sử dụng |
| Bắt buộc/tùy chọn | Quy tắc khi kết xuất email |
| Dữ liệu mẫu | Giá trị an toàn dùng trong preview |

## 5. Nhóm Thương hiệu

Áp dụng cho mọi event và cả hai audience.

| Tên hiển thị | Token | Vị trí | Mức dữ liệu | Bắt buộc | Dữ liệu mẫu |
|---|---|---|---|---|---|
| Tên đơn vị | `{{brand.name}}` | Tiêu đề, nội dung | Công khai | Có | CIC Technology |
| Địa chỉ website | `{{brand.website_url}}` | Nội dung | Công khai | Có | https://www.cic.com.vn |
| Email hỗ trợ công khai | `{{brand.support_email}}` | Nội dung | Công khai | Tùy chọn | support@example.vn |
| Số điện thoại hỗ trợ | `{{brand.support_phone}}` | Nội dung | Công khai | Tùy chọn | 024 0000 0000 |

Không đưa SMTP sender hoặc địa chỉ nội bộ vào nhóm này. Email hỗ trợ chỉ là nội dung công khai đã được cấu hình và phê duyệt.

## 6. Nhóm Yêu cầu

Áp dụng cho năm event sản phẩm đã xác nhận.

| Tên hiển thị | Token | Audience | Vị trí | Bắt buộc | Dữ liệu mẫu |
|---|---|---|---|---|---|
| Mã yêu cầu | `{{request.reference}}` | Cả hai | Tiêu đề, nội dung | Có | YC-2026-000123 |
| Loại yêu cầu | `{{request.type_name}}` | Cả hai | Tiêu đề, nội dung | Có | Yêu cầu báo giá |
| Thời gian tiếp nhận | `{{request.received_at}}` | Cả hai | Nội dung | Có | 14:30, 05/08/2026 |
| Nội dung khách hàng gửi | `{{request.message}}` | Nội bộ | Nội dung | Tùy chọn | Tôi cần tư vấn gói phù hợp... |

`request.message` không xuất hiện trong template gửi khách hàng để tránh phản chiếu nội dung không an toàn hoặc quá dài. Nếu sản phẩm cần xác nhận lại nội dung đã gửi, phải có quyết định nghiệp vụ riêng.

## 7. Nhóm Khách hàng

| Tên hiển thị | Token | Audience | Vị trí | Mức dữ liệu | Bắt buộc | Dữ liệu mẫu |
|---|---|---|---|---|---|---|
| Họ tên khách hàng | `{{customer.full_name}}` | Cả hai | Tiêu đề, nội dung | Dữ liệu cá nhân | Có | Nguyễn Văn An |
| Tên công ty | `{{customer.company_name}}` | Cả hai | Nội dung | Dữ liệu cá nhân | Tùy chọn | Công ty ABC |
| Email khách hàng | `{{customer.email}}` | Nội bộ | Nội dung | Dữ liệu cá nhân | Có khi event thu email | an.nguyen@example.vn |
| Số điện thoại | `{{customer.phone}}` | Nội bộ | Nội dung | Dữ liệu cá nhân | Tùy event | 09xx xxx xxx |

Template gửi khách hàng không cần chèn lại email hoặc số điện thoại của họ. Template nội bộ chỉ render các biến PII khi người xem và người nhận có quyền.

## 8. Nhóm Sản phẩm

Áp dụng cho cả năm event sản phẩm.

| Tên hiển thị | Token | Audience | Vị trí | Bắt buộc | Dữ liệu mẫu |
|---|---|---|---|---|---|
| Tên sản phẩm | `{{product.name}}` | Cả hai | Tiêu đề, nội dung | Có | Phần mềm ABC |
| Mã sản phẩm | `{{product.code}}` | Nội bộ | Nội dung | Tùy chọn | SP-ABC |
| Trang giới thiệu sản phẩm | `{{product.public_url}}` | Khách hàng | Nội dung | Tùy chọn | https://www.cic.com.vn/san-pham/abc |

Không dùng URL quản trị trong biến công khai. Nếu sản phẩm đã bị ẩn sau khi yêu cầu được tạo, lịch sử email vẫn phải dùng snapshot tên sản phẩm; link công khai được bỏ hoặc thay bằng nội dung an toàn theo policy.

## 9. Nhóm Tài liệu

Nhóm này chỉ hiện khi event và điều kiện nghiệp vụ cho phép.

| Tên hiển thị | Token | Event | Audience | Vị trí | Bắt buộc | Dữ liệu mẫu |
|---|---|---|---|---|---|---|
| Tên tài liệu | `{{document.name}}` | Download, Báo giá, Khóa cứng | Khách hàng | Nội dung | Khi có tài liệu | Tài liệu giới thiệu sản phẩm |
| Liên kết tải | `{{document.download_url}}` | Download; Báo giá/Khóa cứng khi được xác nhận | Khách hàng | Nội dung | Khi email có nhiệm vụ cấp file | https://download.example.vn/temporary-link |
| Thời hạn liên kết | `{{document.expires_at}}` | Event có link thời hạn | Khách hàng | Nội dung | Khi link có thời hạn | 23:59, 07/08/2026 |
| Hướng dẫn tải | `{{document.download_instruction}}` | Event có file/link | Khách hàng | Nội dung | Tùy chọn | Nhấn vào liên kết và làm theo hướng dẫn. |

`document.download_url` bị khóa trong Báo giá và Khóa cứng cho đến khi nghiệp vụ xác nhận điều kiện cấp file/quyền. Không cho Activate template yêu cầu biến này khi event chưa được bật.

## 10. Nhóm Phụ trách

| Tên hiển thị | Token | Audience | Vị trí | Bắt buộc | Dữ liệu mẫu |
|---|---|---|---|---|---|
| Tên đơn vị phụ trách | `{{assignee.team_name}}` | Cả hai | Nội dung | Khi routing có kết quả | Bộ phận Kinh doanh |
| Tên người phụ trách | `{{assignee.display_name}}` | Nội bộ; khách hàng khi cho phép công khai | Nội dung | Tùy chọn | Nhân viên phụ trách |
| Kênh liên hệ công khai | `{{assignee.public_contact}}` | Khách hàng | Nội dung | Tùy chọn | support@example.vn |

Không cung cấp email cá nhân hoặc số nội bộ làm biến mặc định. Khi routing chưa resolve được, nhóm Phụ trách không được render bằng “người đầu tiên”.

## 11. Nhóm Điều hướng CMS

Chỉ dùng cho thông báo nội bộ.

| Tên hiển thị | Token | Vị trí | Mức dữ liệu | Bắt buộc | Dữ liệu mẫu |
|---|---|---|---|---|---|
| Mở yêu cầu trong CMS | `{{cms.request_url}}` | Nội dung | Nội bộ | Có | https://cms.example.vn/requests/YC-2026-000123 |

Link phải dẫn đến đúng workspace và vẫn chịu kiểm tra đăng nhập/quyền khi mở. Việc có URL trong email không cấp thêm quyền truy cập.

## 12. Ma trận biến theo event

Ký hiệu: `B` = bắt buộc, `T` = tùy chọn, `K` = không cho dùng, `C` = chỉ dùng khi nghiệp vụ đã xác nhận.

| Nhóm biến | Liên hệ sản phẩm | Download | Đặt mua | Báo giá | Khóa cứng | Nội bộ |
|---|---:|---:|---:|---:|---:|---:|
| Thương hiệu | B | B | B | B | B | T |
| Yêu cầu | B | B | B | B | B | B |
| Khách hàng | T | T | T | T | T | B theo quyền |
| Sản phẩm | B | B | B | B | B | B |
| Tài liệu | K | B/T | K | C | C | K |
| Phụ trách | T | T | T | T | T | T |
| Điều hướng CMS | K | K | K | K | K | B |

## 13. Quy tắc dữ liệu thiếu

- Thiếu biến bắt buộc: render thất bại, không gửi, ghi rõ token thiếu.
- Thiếu biến tùy chọn đứng một mình: bỏ giá trị và không để lại token thô.
- Thiếu biến tùy chọn nằm trong câu: editor cảnh báo nguy cơ tạo câu cụt; người soạn phải preview trước khi Activate.
- Không tự thay bằng dữ liệu từ workspace khác, bản ghi khác hoặc giá trị “đầu tiên”.
- Không tự thay tên khách hàng bằng email; có thể dùng lời chào trung tính nếu template được thiết kế rõ cho trường hợp thiếu tên.
- Link thiếu hoặc hết hạn không được render thành nút CTA có vẻ vẫn hoạt động.

## 14. An toàn nội dung

- Giá trị biến dạng text được escape theo ngữ cảnh; không được biến thành HTML thực thi.
- URL chỉ được render vào vị trí link đã hỗ trợ và phải qua kiểm tra scheme/domain theo policy.
- Dữ liệu nhiều dòng không được dùng trong Subject.
- Subject không cho dùng `request.message`, email, số điện thoại, link tải hoặc URL CMS.
- Preview dữ liệu thật phải che PII khi người dùng không có quyền.
- Log lỗi không ghi toàn bộ nội dung PII hoặc token link tải có thời hạn.

## 15. Variable Picker

Variable Picker gồm:

1. Tìm kiếm theo tên dễ hiểu, token hoặc mô tả.
2. Nhóm biến có thể thu gọn.
3. Nhãn `Bắt buộc`, `Tùy chọn`, `Nội bộ`, `Dữ liệu cá nhân`.
4. Mô tả ngắn và dữ liệu mẫu trước khi chèn.
5. Chỉ báo biến không khả dụng kèm lý do, thay vì biến mất khó hiểu khi người dùng đổi event.
6. Thao tác chèn bằng chuột hoặc bàn phím.

Nếu đổi event/audience khiến token đang có trở nên không hợp lệ, form giữ nội dung nhưng đánh dấu từng token và chặn Activate cho đến khi xử lý xong.

## 16. Preview và gửi thử

- Preview có bộ dữ liệu giả chuẩn cho từng event.
- Có thể chuyển giữa trường hợp dữ liệu đầy đủ và thiếu dữ liệu tùy chọn.
- Hiển thị danh sách token đã render, token bị bỏ và token lỗi.
- Gửi thử chỉ gửi tới địa chỉ test được nhập theo quyền; không sử dụng routing production.
- Email thử phải có dấu hiệu nhận biết và không tạo yêu cầu khách hàng, không đổi trạng thái, không ảnh hưởng SLA.

## 17. Version và tương thích

- Template version lưu danh sách token đã sử dụng.
- Đổi tên hiển thị/mô tả không làm thay đổi token.
- Token đã Active không được xóa ngay; phải chuyển sang deprecated và chỉ rõ template đang dùng.
- Template dùng token deprecated vẫn preview được với cảnh báo, nhưng phải được thay trước mốc ngừng hỗ trợ.
- Không tái sử dụng một token cũ cho ý nghĩa dữ liệu mới.

## 18. Acceptance Criteria

- [ ] Variable Picker chỉ hiện/chấp nhận token thuộc catalog.
- [ ] Token được lọc đúng theo workspace, event và audience.
- [ ] Nhãn biến dễ hiểu với người dùng non-tech.
- [ ] Không có token SMTP, To, CC, BCC hoặc routing.
- [ ] Không cho template truy cập object hoặc biểu thức tùy ý.
- [ ] Biến bắt buộc thiếu làm render thất bại trước khi gửi.
- [ ] Biến tùy chọn thiếu không để lại token thô hoặc câu CTA sai.
- [ ] PII được giới hạn theo audience và quyền.
- [ ] Subject chặn các biến nhạy cảm/không phù hợp.
- [ ] Link tải chỉ khả dụng cho event đã được phép.
- [ ] Báo giá và Khóa cứng chưa dùng link tải khi nghiệp vụ chưa xác nhận.
- [ ] Preview mặc định dùng dữ liệu giả và bao phủ trạng thái thiếu dữ liệu.
- [ ] Gửi thử không dùng routing production và không tạo dữ liệu nghiệp vụ.
- [ ] Đổi event/audience chỉ rõ mọi token trở nên không hợp lệ.
- [ ] Token deprecated không bị xóa khi còn template sử dụng.
- [ ] VI và EN dùng cùng token contract nhưng template/dữ liệu nghiệp vụ vẫn độc lập theo workspace.

## 19. Điểm cần xác nhận trước production

1. Báo giá có gửi file/link ngay hay chỉ xác nhận đã tiếp nhận.
2. Khóa cứng cần điều kiện cấp quyền nào trước khi có link/hướng dẫn.
3. Những event nào bắt buộc có số điện thoại và công ty.
4. Có cho hiển thị tên cá nhân phụ trách trong email khách hàng hay chỉ tên đơn vị.
5. Thời gian và múi giờ hiển thị theo workspace hay theo cấu hình toàn hệ thống.
6. Domain nào được phép dùng cho link tải có thời hạn.

Các biến phụ thuộc sáu quyết định này phải ở trạng thái khóa hoặc tùy chọn an toàn cho đến khi có xác nhận nghiệp vụ.

Các token trong catalog được áp dụng vào 20 template khởi tạo tại `docs/email-template-baseline-library.md`.

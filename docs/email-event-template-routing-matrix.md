# MA TRẬN SỰ KIỆN — NGƯỜI NHẬN — ROUTING — MẪU EMAIL

> Trạng thái: Baseline sản phẩm để xác nhận  
> Ngày: 2026-08-05  
> Căn cứ: khảo sát CMS cũ, Module 05, 06, 12 và Product Specification Module 16A  
> Không thiết kế API hoặc database

## 1. Mục tiêu

Tài liệu xác định template nào có thể được dùng khi một sự kiện frontend phát sinh, người nhận được lấy từ đâu, nhóm dữ liệu nào được phép đưa vào nội dung và kết quả nào phải được ghi nhận.

Mục tiêu quan trọng nhất là ngăn ba lỗi:

1. Lấy nhầm email người nhận từ nội dung template.
2. Chọn ngẫu nhiên “email đầu tiên” khi routing không có kết quả.
3. Coi gửi email thành công là yêu cầu khách hàng đã được xử lý.

## 2. Mức độ bằng chứng

| Mức | Ý nghĩa | Quyết định triển khai |
|---|---|---|
| Đã xác nhận | Có trong khảo sát form/template CMS cũ | Được đưa vào baseline |
| Suy luận có kiểm soát | Có dữ liệu liên quan nhưng chưa chứng minh đầy đủ hành vi gửi | Chỉ triển khai sau khi nghiệp vụ xác nhận |
| Chưa xác nhận | Không có bằng chứng đủ | Không bật tự động gửi |

Khảo sát xác nhận năm loại cấu hình email theo sản phẩm: Liên hệ, Download, Đặt mua, Tải báo giá và Tải khóa cứng. Khảo sát cũng ghi nhận khách hàng nhận email tự động khi thực hiện một số hành động. Việc có gửi đồng thời email nội bộ cho từng loại chưa được chứng minh đầy đủ.

## 3. Nguyên tắc xác định người nhận

### 3.1. Email gửi cho khách hàng

- Lấy từ email khách hàng đã nhập trong yêu cầu frontend và đã qua validation.
- Không lấy từ template, cấu hình SMTP hoặc hồ sơ nhân viên.
- Nếu không có email hợp lệ, vẫn lưu yêu cầu nhưng không tạo tác vụ gửi cho khách hàng.

### 3.2. Email thông báo nội bộ

Thứ tự routing:

```text
Rule chính xác theo sản phẩm + loại sự kiện + phạm vi hiệu lực
→ Rule theo nhóm sản phẩm/đơn vị nếu được cấu hình
→ Rule mặc định đã được chỉ định rõ
→ Không có người nhận: ghi cảnh báo vận hành, không chọn ngẫu nhiên
```

- Người nhận nội bộ lấy email công việc của nhân sự/nhóm được rule phân công.
- Không dùng “bản ghi email đầu tiên” hoặc “nhân viên đầu tiên” làm fallback.
- `Admin email` chỉ được dùng nếu được cấu hình rõ là rule mặc định, không phải fallback ngầm.
- Nhiều rule cùng mức ưu tiên là conflict; chặn activate rule hoặc đưa vào hàng cảnh báo.

### 3.3. Danh tính gửi

- From, sender name và reply-to lấy từ Cấu hình hệ thống.
- Template không quyết định danh tính gửi.
- Reply-to có thể trỏ về địa chỉ nghiệp vụ được cấu hình, nhưng không lấy trực tiếp từ nội dung template.

## 4. Ma trận baseline

| ID sự kiện sản phẩm | Sự kiện frontend | Bằng chứng | Email khách hàng | Email nội bộ | Routing nội bộ | Loại template | Kết quả nghiệp vụ |
|---|---|---|---|---|---|---|---|
| EVT-PRODUCT-CONTACT | Liên hệ/tư vấn về sản phẩm | Đã xác nhận | Có, nếu email hợp lệ | Cần xác nhận bật/tắt | Theo sản phẩm + loại Liên hệ | Xác nhận liên hệ sản phẩm | Tạo Product Contact/Yêu cầu khách hàng |
| EVT-PRODUCT-DOWNLOAD | Đăng ký tải tài liệu/sản phẩm | Đã xác nhận | Có | Cần xác nhận | Theo sản phẩm + loại Download | Gửi thông tin/link tải | Tạo đăng ký Download và lịch sử cấp link |
| EVT-PRODUCT-PURCHASE | Đăng ký đặt mua | Đã xác nhận | Có | Khuyến nghị có, cần nghiệp vụ xác nhận | Theo sản phẩm + loại Đặt mua | Xác nhận đăng ký mua | Tạo yêu cầu mua/tư vấn trong hàng đợi |
| EVT-PRODUCT-QUOTE | Yêu cầu/tải báo giá | Đã xác nhận loại template; hành vi file cần xác nhận | Có | Khuyến nghị có, cần xác nhận | Theo sản phẩm + loại Báo giá | Xác nhận yêu cầu hoặc gửi tài liệu báo giá | Tạo yêu cầu báo giá; không coi là đã báo giá xong |
| EVT-PRODUCT-HARDLOCK | Yêu cầu tải khóa cứng | Đã xác nhận loại template; quy trình cấp quyền cần xác nhận | Có khi đủ điều kiện | Cần xác nhận | Theo sản phẩm + loại Khóa cứng | Hướng dẫn/xác nhận yêu cầu khóa cứng | Tạo yêu cầu; không tự xác nhận đã cấp khóa |

### Ngoài baseline tự động

| Sự kiện | Trạng thái | Lý do |
|---|---|---|
| Liên hệ chung từ website | Chưa xác nhận auto-reply | Khảo sát xác nhận hàng đợi contact nhưng chưa chứng minh template/gửi phản hồi |
| Staff trả lời thủ công từ CMS | Chưa xác nhận | Module 12 hiện không được phép giả định có email composer |
| Đổi trạng thái contact | Không tự gửi mặc định | Trạng thái vận hành không đồng nghĩa sự kiện giao tiếp |
| Marketing/broadcast | Ngoài phạm vi | Không thuộc kho email giao dịch hiện tại |
| Mời/kích hoạt tài khoản CMS | Tách phạm vi | Là notification quản trị người dùng, chưa thuộc nhóm template khảo sát này |

## 5. Ma trận người nhận

| Nhóm gửi | To | CC/BCC | Nguồn địa chỉ | Khi thiếu địa chỉ |
|---|---|---|---|---|
| Xác nhận cho khách hàng | Email trong submission | Không mặc định | Yêu cầu frontend | Lưu yêu cầu, đánh dấu không thể gửi |
| Thông báo Sales/Operations | Nhân sự/nhóm từ routing | Theo rule đã duyệt | Module 06 + hồ sơ người dùng | Cảnh báo “Chưa có người nhận”, không chọn ngẫu nhiên |
| Gửi thử template | Người thực hiện hoặc allowlist | Không | User hiện tại/cấu hình test | Chặn gửi thử và giải thích |

Email gửi thử phải được đánh dấu rõ là test và không tạo contact mới, không thay đổi SLA hoặc ownership.

## 6. Nhóm template

| Nhóm template | Đối tượng đọc | Mục tiêu nội dung | Không được khẳng định |
|---|---|---|---|
| Xác nhận liên hệ | Khách hàng | Đã tiếp nhận và cung cấp mã tham chiếu/kỳ vọng phản hồi | Yêu cầu đã giải quyết |
| Download | Khách hàng | Xác nhận yêu cầu và cung cấp/hướng dẫn lấy tài liệu hợp lệ | Link tồn tại vĩnh viễn |
| Đặt mua | Khách hàng | Xác nhận đăng ký và bước tiếp theo | Đơn hàng đã thanh toán/xác nhận pháp lý |
| Báo giá | Khách hàng | Xác nhận yêu cầu hoặc cung cấp tài liệu theo policy | Giá đã được phê duyệt nếu chưa có quy trình |
| Khóa cứng | Khách hàng | Xác nhận yêu cầu và hướng dẫn | Khóa đã được cấp khi mới tiếp nhận |
| Thông báo nội bộ | Staff | Tóm tắt yêu cầu và link mở CMS | Dữ liệu nhạy cảm vượt quyền người nhận |

Một template cho khách hàng không được tái sử dụng nguyên trạng làm thông báo nội bộ và ngược lại.

## 7. Nhóm biến được phép

Tài liệu chỉ chốt nhóm dữ liệu; token cụ thể được quản lý trong Variable Catalog ở bước tiếp theo.

| Nhóm biến | Ví dụ ý nghĩa | Dùng cho |
|---|---|---|
| Thương hiệu | Tên công ty, website, thông tin hỗ trợ | Tất cả template |
| Yêu cầu | Mã tham chiếu, loại yêu cầu, thời gian tiếp nhận | Khách hàng và nội bộ |
| Khách hàng | Họ tên, công ty; email/điện thoại theo quyền | Xác nhận và nội bộ |
| Sản phẩm | Tên, mã, đường dẫn sản phẩm | Sự kiện theo sản phẩm |
| Tài liệu | Tên tài liệu, link có thời hạn, hướng dẫn | Download/Báo giá/Khóa cứng theo policy |
| Phụ trách | Tên nhóm/người phụ trách, kênh liên hệ công khai | Chỉ khi routing đã có kết quả |
| Điều hướng CMS | Link mở yêu cầu trong CMS | Chỉ thông báo nội bộ |

### Quy tắc dữ liệu nhạy cảm

- Template khách hàng chỉ nhận dữ liệu thuộc chính yêu cầu của họ.
- Template nội bộ chỉ render PII mà người nhận có quyền xem.
- Preview mặc định dùng dữ liệu giả lập.
- Không cho template truy cập toàn bộ object hoặc chèn biến tự do ngoài catalog.

## 8. Chọn template

Thứ tự chọn template cho một email:

```text
Workspace của yêu cầu
→ Loại sự kiện
→ Template được gán rõ cho sản phẩm/scope
→ Template mặc định của loại sự kiện trong cùng workspace
→ Không có template: không gửi và tạo cảnh báo cấu hình
```

- Không fallback template VI sang EN.
- Không tự chọn template Active đầu tiên trong danh sách.
- Nếu có nhiều template Active cùng độ ưu tiên cho một binding, đây là conflict cấu hình.
- Bản template sử dụng phải là phiên bản Active tại thời điểm tạo tác vụ gửi.
- Nội dung gửi phải tham chiếu version/snapshot để lịch sử không thay đổi khi template được cập nhật sau đó.

## 9. Trình tự xử lý sản phẩm

```text
1. Validate submission
2. Lưu yêu cầu nghiệp vụ trước
3. Xác định workspace và event type
4. Resolve routing nội bộ
5. Resolve template khách hàng/nội bộ độc lập
6. Validate dữ liệu biến
7. Tạo từng tác vụ gửi độc lập
8. Ghi kết quả render và dispatch
9. Hiển thị trạng thái email trong timeline yêu cầu
```

Lưu yêu cầu không được phụ thuộc vào việc gửi email thành công. Một lỗi SMTP không được làm mất Product Contact.

## 10. Kết quả cần ghi nhận

Mỗi lần gửi hoặc thử gửi cần đủ bằng chứng vận hành ở mức sản phẩm:

- Đối tượng nghiệp vụ và event type.
- Workspace.
- Template và phiên bản đã dùng.
- Nhóm người nhận; địa chỉ hiển thị phải được che theo quyền.
- Trạng thái render: hợp lệ/thất bại và lý do.
- Trạng thái dispatch: chưa gửi, đang xử lý, được hệ thống gửi chấp nhận hoặc thất bại.
- Thời điểm và số lần thử lại.
- Người/kênh khởi tạo: frontend event, staff test hoặc system retry.

Không dùng nhãn “Khách hàng đã nhận” nếu chưa có bằng chứng delivery phù hợp từ nhà cung cấp email.

## 11. Trạng thái hiển thị trong Yêu cầu khách hàng

| Trạng thái UI | Ý nghĩa |
|---|---|
| Không cần gửi | Event không cấu hình email này |
| Thiếu email khách hàng | Submission không có địa chỉ hợp lệ |
| Thiếu template | Không resolve được template trong workspace |
| Thiếu người nhận nội bộ | Routing không có kết quả |
| Không thể kết xuất | Biến/template lỗi |
| Đang gửi | Tác vụ đã được tạo |
| Hệ thống gửi chấp nhận | Hạ tầng đã nhận/gửi thành công theo mức bằng chứng hiện có |
| Gửi thất bại | Có lỗi và khả năng retry |

Các trạng thái email nằm trong timeline/communication status, không thay thế New, Assigned, In progress hoặc Resolved.

## 12. Quyền và kiểm soát

- Editor template không được sửa routing.
- Sales Manager không được sửa nội dung Active nếu không có quyền template.
- Người gửi thử chỉ được gửi tới bản thân hoặc allowlist đã duyệt.
- Thay đổi binding template–event là thay đổi ảnh hưởng cao, cần preview impact và audit.
- Người xem lịch sử gửi chỉ thấy địa chỉ đầy đủ nếu có quyền PII tương ứng.
- Retry không được đổi template/version trừ khi người có quyền chủ động tạo lần gửi mới.

## 13. Conflict và fallback

| Tình huống | Xử lý |
|---|---|
| Không có routing | Lưu contact, cảnh báo vận hành, không chọn người đầu tiên |
| Nhiều routing cùng ưu tiên | Conflict; không activate cấu hình mơ hồ |
| Không có template Active | Không gửi; cảnh báo thiếu template |
| Có nhiều template phù hợp | Conflict binding; không chọn bản ghi đầu tiên |
| Workspace EN thiếu template | Không fallback VI |
| Email khách hàng sai | Không gửi customer email; contact vẫn tồn tại |
| Staff bị khóa/ngừng dùng | Rule không hợp lệ; chuyển theo rule thay thế đã khai báo |
| Template đổi sau khi queue | Lần gửi giữ version đã resolve |

## 14. Ma trận quyết định triển khai

| Hạng mục | Quyết định hiện tại |
|---|---|
| Năm loại event theo sản phẩm | Đưa vào baseline |
| Customer confirmation | Có cho event đã cấu hình và email hợp lệ |
| Internal notification | Thiết kế hỗ trợ nhưng cần xác nhận bật/tắt theo event |
| General contact auto-reply | Chưa bật |
| Manual reply composer | Chưa thiết kế |
| Marketing/bulk email | Ngoài phạm vi |
| Fallback template khác workspace | Cấm |
| Fallback “bản ghi đầu tiên” | Cấm |
| SMTP/sender trong template | Cấm |

## 15. Acceptance Criteria

- [ ] Mỗi email xác định được event type và workspace trước khi chọn template.
- [ ] Customer recipient chỉ lấy từ submission hợp lệ.
- [ ] Internal recipient chỉ lấy từ routing đã activate.
- [ ] Không có đoạn xử lý nào chọn email/template đầu tiên làm fallback ngầm.
- [ ] `Admin email` chỉ dùng khi được cấu hình thành rule mặc định rõ ràng.
- [ ] Năm loại event sản phẩm map được tới năm nhóm template độc lập.
- [ ] Customer template và internal template không bị dùng lẫn.
- [ ] Không fallback template giữa VI và EN.
- [ ] Thiếu routing/template không làm mất yêu cầu frontend.
- [ ] Một lỗi gửi không tự đổi trạng thái contact.
- [ ] Timeline phân biệt render error, routing error và dispatch error.
- [ ] Lịch sử ghi template version đã dùng.
- [ ] Retry mặc định giữ nguyên template version và người nhận đã resolve.
- [ ] Gửi thử không tạo contact và không ảnh hưởng SLA.
- [ ] Preview dùng dữ liệu giả nếu người dùng không có quyền PII.
- [ ] UI không ghi “đã nhận” khi chỉ có bằng chứng hệ thống chấp nhận gửi.

## 16. Các điểm cần nghiệp vụ xác nhận

1. Sự kiện nào trong năm loại phải gửi thêm thông báo nội bộ.
2. “Tải báo giá” là gửi file ngay hay chỉ xác nhận đã tiếp nhận yêu cầu.
3. “Tải khóa cứng” cần điều kiện cấp quyền nào trước khi gửi link/hướng dẫn.
4. Liên hệ chung có cần auto-reply hay chỉ tạo hàng đợi cho staff.
5. Rule mặc định nội bộ có dùng Admin email hiện tại hay một nhóm vận hành riêng.
6. Có cần CC/BCC trong bất kỳ event nào; mặc định hiện tại là không.
7. Mức bằng chứng delivery từ nhà cung cấp email có sẵn hay chỉ biết dispatch accepted/failed.

Các điểm chưa xác nhận không chặn thiết kế module Mẫu email, nhưng chặn việc bật gửi tự động tương ứng trong production.


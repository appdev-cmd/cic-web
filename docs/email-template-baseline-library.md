# THƯ VIỆN MẪU EMAIL BASELINE

> Phạm vi: Bước 5 của thiết kế module Mẫu email  
> Ngày: 2026-08-05  
> Trạng thái: Nội dung khởi tạo để review; không tự động Activate trong production

## 1. Mục tiêu

Tài liệu này biến Product Specification, Event Matrix và Variable Catalog thành các mẫu email có thể đưa vào thư viện CMS. Mỗi mẫu xác định rõ mục đích, subject, cấu trúc nội dung, token, CTA, điều kiện sử dụng và câu chữ không được cam kết.

Đây là thiết kế nội dung sản phẩm, không phải HTML, API, database hay cấu hình gửi mail.

## 2. Phạm vi thư viện

Baseline gồm 20 bản ghi độc lập:

| Workspace | Khách hàng | Nội bộ | Tổng |
|---|---:|---:|---:|
| VI | 5 | 5 | 10 |
| EN | 5 | 5 | 10 |

- Năm mẫu khách hàng: Liên hệ sản phẩm, Download, Đặt mua, Báo giá, Khóa cứng.
- Năm mẫu nội bộ dùng cùng event nhưng là bản riêng, không tái sử dụng nội dung khách hàng.
- VI và EN là hai workspace độc lập. EN có baseline riêng, không phải fallback tự động của VI.
- Tất cả bản ghi được tạo ở trạng thái Draft; chỉ Activate sau khi preview, gửi thử, duyệt nội dung và hoàn tất routing tương ứng.

### 2.1. Danh sách 20 bản ghi cần khởi tạo

| Workspace | Event | Audience | Tên bản ghi baseline | Trạng thái |
|---|---|---|---|---|
| VI | Liên hệ sản phẩm | Khách hàng | Xác nhận đã tiếp nhận liên hệ sản phẩm | Draft |
| VI | Download | Khách hàng | Gửi liên kết tải tài liệu sản phẩm | Draft |
| VI | Đặt mua | Khách hàng | Xác nhận đăng ký mua sản phẩm | Draft |
| VI | Báo giá | Khách hàng | Xác nhận đã tiếp nhận yêu cầu báo giá | Draft |
| VI | Khóa cứng | Khách hàng | Xác nhận đã tiếp nhận yêu cầu khóa cứng | Draft |
| VI | Liên hệ sản phẩm | Nội bộ | Thông báo liên hệ sản phẩm mới | Draft |
| VI | Download | Nội bộ | Thông báo đăng ký tải mới | Draft |
| VI | Đặt mua | Nội bộ | Thông báo đăng ký mua mới | Draft |
| VI | Báo giá | Nội bộ | Thông báo yêu cầu báo giá mới | Draft |
| VI | Khóa cứng | Nội bộ | Thông báo yêu cầu khóa cứng mới | Draft |
| EN | Product enquiry | Customer | Product enquiry acknowledgement | Draft |
| EN | Download | Customer | Product document download | Draft |
| EN | Purchase | Customer | Purchase registration acknowledgement | Draft |
| EN | Quotation | Customer | Quotation request acknowledgement | Draft |
| EN | Hardware lock | Customer | Hardware lock request acknowledgement | Draft |
| EN | Product enquiry | Internal | New product enquiry notification | Draft |
| EN | Download | Internal | New download registration notification | Draft |
| EN | Purchase | Internal | New purchase registration notification | Draft |
| EN | Quotation | Internal | New quotation request notification | Draft |
| EN | Hardware lock | Internal | New hardware lock request notification | Draft |

## 3. Quy ước chung

### 3.1. Cấu trúc email khách hàng

1. Lời chào.
2. Xác nhận hệ thống đã tiếp nhận đúng loại yêu cầu.
3. Tóm tắt sản phẩm và mã yêu cầu.
4. Bước tiếp theo hoặc CTA hợp lệ.
5. Kênh hỗ trợ công khai.
6. Lời kết và tên thương hiệu.

Không dùng các câu “đã xử lý xong”, “đã thanh toán”, “đã cấp quyền”, “chắc chắn liên hệ trong…” nếu hệ thống chưa có bằng chứng tương ứng.

### 3.2. Cấu trúc email nội bộ

1. Event và mức độ cần xử lý.
2. Mã yêu cầu, thời gian tiếp nhận.
3. Khách hàng và sản phẩm.
4. Nội dung/chi tiết cần thiết theo quyền.
5. CTA mở đúng yêu cầu trong CMS.

Không đưa link tải của khách hàng vào thông báo nội bộ và không coi việc gửi email là đã nhận xử lý.

### 3.3. CTA

- Mỗi email khách hàng tối đa một CTA chính.
- CTA chỉ xuất hiện khi URL hợp lệ; nếu thiếu URL, bỏ cả nút và câu dẫn liên quan.
- Email nội bộ dùng CTA `Mở yêu cầu trong CMS`.
- Link thuần có thể đặt dưới CTA để hỗ trợ client email/accessibility.

## 4. Baseline VI — khách hàng

### 4.1. VI — Xác nhận liên hệ sản phẩm

**Tên mẫu:** Xác nhận đã tiếp nhận liên hệ sản phẩm  
**Event:** `EVT-PRODUCT-CONTACT`  
**Subject:** `Đã tiếp nhận yêu cầu về {{product.name}} — {{request.reference}}`

**Nội dung:**

> Xin chào {{customer.full_name}},
>
> {{brand.name}} đã tiếp nhận yêu cầu của bạn về {{product.name}} vào {{request.received_at}}.
>
> Mã yêu cầu: {{request.reference}}
>
> Bộ phận phụ trách sẽ kiểm tra thông tin và liên hệ qua kênh bạn đã cung cấp. Bạn có thể xem thêm thông tin sản phẩm tại liên kết bên dưới.
>
> CTA: Xem thông tin sản phẩm → {{product.public_url}}
>
> Nếu cần bổ sung thông tin, vui lòng liên hệ {{brand.support_email}} hoặc {{brand.support_phone}}.
>
> Trân trọng,  
> {{brand.name}}

**Bắt buộc:** `customer.full_name`, `product.name`, `request.received_at`, `request.reference`, `brand.name`.  
**CTA tùy chọn:** bỏ trọn khối CTA nếu `product.public_url` không có.  
**Không được ghi:** thời hạn phản hồi cụ thể nếu chưa có SLA được xác nhận.

### 4.2. VI — Gửi tài liệu Download

**Tên mẫu:** Gửi liên kết tải tài liệu sản phẩm  
**Event:** `EVT-PRODUCT-DOWNLOAD`  
**Subject:** `Tài liệu {{product.name}} — {{request.reference}}`

**Nội dung:**

> Xin chào {{customer.full_name}},
>
> Yêu cầu tải tài liệu về {{product.name}} của bạn đã được ghi nhận.
>
> Tài liệu: {{document.name}}  
> Mã yêu cầu: {{request.reference}}
>
> CTA: Tải tài liệu → {{document.download_url}}
>
> Liên kết có hiệu lực đến {{document.expires_at}}. {{document.download_instruction}}
>
> Nếu liên kết không hoạt động, vui lòng liên hệ {{brand.support_email}}.
>
> Trân trọng,  
> {{brand.name}}

**Bắt buộc khi Activate:** `document.name`, `document.download_url` và policy link tải đã sẵn sàng.  
**Điều kiện:** nếu link được sinh sau một bước duyệt, không dùng mẫu này; dùng biến thể xác nhận tiếp nhận chưa có CTA.  
**Không được ghi:** file an toàn/tương thích tuyệt đối hoặc quyền sử dụng vượt chính sách sản phẩm.

### 4.3. VI — Xác nhận đăng ký đặt mua

**Tên mẫu:** Xác nhận đăng ký mua sản phẩm  
**Event:** `EVT-PRODUCT-PURCHASE`  
**Subject:** `Đã tiếp nhận đăng ký mua {{product.name}} — {{request.reference}}`

**Nội dung:**

> Xin chào {{customer.full_name}},
>
> {{brand.name}} đã tiếp nhận đăng ký mua {{product.name}} của bạn.
>
> Mã yêu cầu: {{request.reference}}  
> Thời gian tiếp nhận: {{request.received_at}}
>
> Bộ phận phụ trách sẽ kiểm tra nhu cầu và liên hệ để tư vấn gói sản phẩm, điều kiện sử dụng và các bước tiếp theo.
>
> Nếu cần bổ sung thông tin, vui lòng liên hệ {{brand.support_email}} hoặc {{brand.support_phone}}.
>
> Trân trọng,  
> {{brand.name}}

**Không có CTA giao dịch.**  
**Không được ghi:** đơn hàng đã xác nhận, đã thanh toán, giá đã chốt hoặc giấy phép đã cấp.

### 4.4. VI — Xác nhận yêu cầu báo giá

**Tên mẫu:** Xác nhận đã tiếp nhận yêu cầu báo giá  
**Event:** `EVT-PRODUCT-QUOTE`  
**Subject:** `Đã tiếp nhận yêu cầu báo giá {{product.name}} — {{request.reference}}`

**Nội dung:**

> Xin chào {{customer.full_name}},
>
> {{brand.name}} đã tiếp nhận yêu cầu báo giá cho {{product.name}}.
>
> Mã yêu cầu: {{request.reference}}  
> Thời gian tiếp nhận: {{request.received_at}}
>
> Bộ phận phụ trách sẽ kiểm tra thông tin và liên hệ để làm rõ nhu cầu trước khi cung cấp báo giá phù hợp.
>
> Nếu cần bổ sung thông tin, vui lòng liên hệ {{brand.support_email}} hoặc {{brand.support_phone}}.
>
> Trân trọng,  
> {{brand.name}}

**Baseline không có file hoặc CTA tải báo giá.**  
**Không được ghi:** đây là báo giá chính thức, mức giá đã được duyệt hoặc yêu cầu đã hoàn tất. Biến thể gửi file chỉ được tạo sau quyết định nghiệp vụ riêng.

### 4.5. VI — Xác nhận yêu cầu khóa cứng

**Tên mẫu:** Xác nhận đã tiếp nhận yêu cầu khóa cứng  
**Event:** `EVT-PRODUCT-HARDLOCK`  
**Subject:** `Đã tiếp nhận yêu cầu khóa cứng {{product.name}} — {{request.reference}}`

**Nội dung:**

> Xin chào {{customer.full_name}},
>
> {{brand.name}} đã tiếp nhận yêu cầu liên quan đến khóa cứng cho {{product.name}}.
>
> Mã yêu cầu: {{request.reference}}  
> Thời gian tiếp nhận: {{request.received_at}}
>
> Bộ phận phụ trách sẽ kiểm tra điều kiện sử dụng và hướng dẫn bước tiếp theo qua kênh liên hệ bạn đã cung cấp.
>
> Nếu cần hỗ trợ, vui lòng liên hệ {{brand.support_email}} hoặc {{brand.support_phone}}.
>
> Trân trọng,  
> {{brand.name}}

**Baseline không có link tải.**  
**Không được ghi:** khóa đã được cấp, đã kích hoạt hoặc khách hàng đã đủ điều kiện.

## 5. Baseline EN — customer

Các mẫu EN là bản ghi độc lập và phải được English content owner duyệt. Câu chữ dưới đây là baseline nội dung, không tự đồng bộ khi VI thay đổi.

### 5.1. EN — Product enquiry acknowledgement

**Subject:** `We received your enquiry about {{product.name}} — {{request.reference}}`

> Hello {{customer.full_name}},
>
> {{brand.name}} received your enquiry about {{product.name}} at {{request.received_at}}.
>
> Reference: {{request.reference}}
>
> Our team will review the information and contact you through the details you provided.
>
> CTA: View product information → {{product.public_url}}
>
> For additional support, contact {{brand.support_email}} or {{brand.support_phone}}.
>
> Regards,  
> {{brand.name}}

CTA is optional. Do not promise a response time unless an approved SLA exists.

### 5.2. EN — Product document download

**Subject:** `Your {{product.name}} document — {{request.reference}}`

> Hello {{customer.full_name}},
>
> Your request for information about {{product.name}} has been recorded.
>
> Document: {{document.name}}  
> Reference: {{request.reference}}
>
> CTA: Download document → {{document.download_url}}
>
> This link is available until {{document.expires_at}}. {{document.download_instruction}}
>
> If the link does not work, contact {{brand.support_email}}.
>
> Regards,  
> {{brand.name}}

Only Activate when the download-link policy and required variables are available.

### 5.3. EN — Purchase registration acknowledgement

**Subject:** `We received your purchase request for {{product.name}} — {{request.reference}}`

> Hello {{customer.full_name}},
>
> {{brand.name}} received your purchase registration for {{product.name}}.
>
> Reference: {{request.reference}}  
> Received at: {{request.received_at}}
>
> Our team will review your needs and contact you about the appropriate package, terms of use and next steps.
>
> For additional support, contact {{brand.support_email}} or {{brand.support_phone}}.
>
> Regards,  
> {{brand.name}}

Do not describe this as a confirmed or paid order.

### 5.4. EN — Quotation request acknowledgement

**Subject:** `We received your quotation request for {{product.name}} — {{request.reference}}`

> Hello {{customer.full_name}},
>
> {{brand.name}} received your quotation request for {{product.name}}.
>
> Reference: {{request.reference}}  
> Received at: {{request.received_at}}
>
> Our team will review the information and may contact you to clarify your requirements before providing an appropriate quotation.
>
> For additional support, contact {{brand.support_email}} or {{brand.support_phone}}.
>
> Regards,  
> {{brand.name}}

The baseline has no quotation file or download CTA. Do not describe it as an official quotation.

### 5.5. EN — Hardware lock request acknowledgement

**Subject:** `We received your hardware lock request for {{product.name}} — {{request.reference}}`

> Hello {{customer.full_name}},
>
> {{brand.name}} received your hardware lock request for {{product.name}}.
>
> Reference: {{request.reference}}  
> Received at: {{request.received_at}}
>
> Our team will verify the applicable conditions and contact you with the next steps.
>
> For support, contact {{brand.support_email}} or {{brand.support_phone}}.
>
> Regards,  
> {{brand.name}}

The baseline has no download link. Do not claim that a lock has been issued or activated.

## 6. Baseline nội bộ — VI và EN

Thông báo nội bộ phải tạo thành năm template/event cho mỗi workspace để có thể bật/tắt và thay đổi mức ưu tiên độc lập. Trước khi nghiệp vụ xác nhận event nào gửi nội bộ, cả mười bản ghi giữ trạng thái Draft.

### 6.1. Khung VI

**Tên mẫu:** `[Nội bộ] Yêu cầu {loại sự kiện} mới`  
**Subject:** `[{{request.type_name}}] {{product.name}} — {{request.reference}}`

> Có yêu cầu mới cần kiểm tra.
>
> Loại yêu cầu: {{request.type_name}}  
> Mã yêu cầu: {{request.reference}}  
> Tiếp nhận lúc: {{request.received_at}}  
> Khách hàng: {{customer.full_name}}  
> Công ty: {{customer.company_name}}  
> Email: {{customer.email}}  
> Điện thoại: {{customer.phone}}  
> Sản phẩm: {{product.name}}  
> Nội dung: {{request.message}}
>
> CTA: Mở yêu cầu trong CMS → {{cms.request_url}}

Mỗi event chỉ giữ các dòng dữ liệu thực sự được thu thập. Dòng tùy chọn phải biến mất trọn vẹn khi không có dữ liệu.

### 6.2. EN framework

**Template name:** `[Internal] New {event type} request`  
**Subject:** `[{{request.type_name}}] {{product.name}} — {{request.reference}}`

> A new request requires review.
>
> Request type: {{request.type_name}}  
> Reference: {{request.reference}}  
> Received at: {{request.received_at}}  
> Customer: {{customer.full_name}}  
> Company: {{customer.company_name}}  
> Email: {{customer.email}}  
> Phone: {{customer.phone}}  
> Product: {{product.name}}  
> Message: {{request.message}}
>
> CTA: Open request in CMS → {{cms.request_url}}

EN notification is selected by the request workspace, not by the staff interface language.

## 7. Trạng thái khởi tạo

| Nhóm mẫu | Trạng thái tạo | Có thể Activate khi |
|---|---|---|
| Liên hệ sản phẩm — khách hàng | Draft | Content owner duyệt, sender sẵn sàng, gửi thử đạt |
| Download — khách hàng | Draft | Link policy, expiry và dữ liệu tài liệu đã xác nhận |
| Đặt mua — khách hàng | Draft | Content owner duyệt và gửi thử đạt |
| Báo giá — khách hàng | Draft | Duyệt bản acknowledgement; không kèm file mặc định |
| Khóa cứng — khách hàng | Draft | Duyệt bản acknowledgement; không kèm link mặc định |
| Tất cả mẫu nội bộ | Draft | Xác nhận bật event + routing có rule hợp lệ |

Không có mẫu nào được Activate chỉ vì đã được seed vào CMS.

## 8. Checklist duyệt từng mẫu

- [ ] Đúng workspace và đúng event.
- [ ] Audience khách hàng/nội bộ không bị dùng lẫn.
- [ ] Subject ngắn, không chứa PII hoặc token bị cấm.
- [ ] Tất cả token thuộc Variable Catalog.
- [ ] Không có token bắt buộc bị thiếu trong dữ liệu mẫu.
- [ ] Khối tùy chọn biến mất sạch khi không có dữ liệu.
- [ ] Chỉ có một CTA chính và CTA đúng mục đích.
- [ ] Link hiển thị được bằng bàn phím và có nhãn dễ hiểu.
- [ ] Preview desktop/mobile và plain-text đều đọc được.
- [ ] Không cam kết trạng thái nghiệp vụ chưa xảy ra.
- [ ] Không chứa email người nhận, routing hoặc SMTP cố định.
- [ ] Gửi thử không tạo dữ liệu nghiệp vụ.
- [ ] Content owner và approver đã duyệt đúng version.

## 9. Acceptance Criteria của thư viện baseline

- [ ] Có đủ 20 bản ghi Draft: 5 event × 2 audience × 2 workspace.
- [ ] VI và EN là các bản độc lập, không fallback và không auto-translate.
- [ ] Mỗi template có tên, event, audience, subject và body rõ ràng.
- [ ] Năm mẫu khách hàng VI và EN có nội dung baseline để review, không chỉ là cấu hình trống.
- [ ] Mười mẫu nội bộ được tách theo event dù dùng chung framework ban đầu.
- [ ] Download chỉ Activate khi link tải hoạt động và có policy hết hạn.
- [ ] Báo giá mặc định chỉ xác nhận tiếp nhận, không giả định gửi báo giá.
- [ ] Khóa cứng mặc định chỉ xác nhận tiếp nhận, không giả định đã cấp quyền.
- [ ] Không mẫu nào tự Activate khi khởi tạo.
- [ ] Không hard-code người nhận, sender, CC/BCC hoặc địa chỉ routing trong nội dung.
- [ ] Mọi token đều đối chiếu được với Variable Catalog.

## 10. Điểm cần phê duyệt

1. Tên thương hiệu và thông tin hỗ trợ chính thức cho từng workspace.
2. Tone of voice cuối cùng của VI và EN.
3. SLA có được phép công bố trong email liên hệ/đặt mua/báo giá hay không.
4. Download gửi link ngay hay phải qua bước duyệt.
5. Báo giá có thêm biến thể “gửi file báo giá” sau khi nhân viên xử lý hay không.
6. Khóa cứng có thêm biến thể “đủ điều kiện/cấp hướng dẫn” hay không.
7. Năm event nào cần thông báo nội bộ và mức ưu tiên tương ứng.

Các quyết định này ảnh hưởng việc Activate hoặc tạo biến thể tiếp theo, nhưng không làm thay đổi baseline acknowledgement an toàn đã thiết kế.

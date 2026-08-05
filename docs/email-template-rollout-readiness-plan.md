# KẾ HOẠCH ĐỐI CHIẾU VÀ ĐƯA MẪU EMAIL VÀO VẬN HÀNH

> Phạm vi: Bước 6 của thiết kế module Mẫu email  
> Ngày: 2026-08-05  
> Loại tài liệu: Product rollout/readiness plan; không phải thiết kế API hoặc database

## 1. Mục tiêu

Đưa module Mẫu email và thư viện 20 mẫu baseline vào production theo từng cổng kiểm soát, đồng thời không làm gián đoạn luồng email cũ. Kế hoạch phải trả lời được:

- 13 mẫu email cũ đang phục vụ sự kiện nào và còn consumer nào.
- Mẫu cũ nào được giữ, thay thế, gộp nội dung hoặc ngừng sử dụng.
- Khi nào menu mới được phép xuất hiện.
- Khi nào từng event được phép gửi bằng template mới.
- QA cần kiểm tra gì trước, trong và sau rollout.
- Cách quay lại cấu hình cũ nếu kết quả không đạt.

## 2. Nguyên tắc rollout

- Không migration theo tên mẫu; phải đối chiếu bằng workspace, event, audience và consumer thực tế.
- Không tự Activate template vừa được khởi tạo.
- Không chuyển đồng thời cả năm event trong một lần.
- Không fallback VI/EN hoặc chọn template/email đầu tiên.
- Luôn lưu yêu cầu nghiệp vụ trước tác vụ email.
- Lỗi email không làm mất yêu cầu, đổi ownership hoặc đổi trạng thái liên hệ.
- Rollback đổi binding về template cũ/luồng cũ; không xóa lịch sử đã phát sinh.
- Menu mới có thể được mở cho nhóm quản trị nội dung trước khi template mới được dùng để gửi thật.

## 3. Vai trò và trách nhiệm

| Vai trò | Trách nhiệm | Không tự quyết định |
|---|---|---|
| Product Owner | Chốt event, audience, SLA và phạm vi rollout | Nội dung chuyên môn nếu chưa có Content Owner duyệt |
| Business Owner | Xác nhận hành vi Download, Báo giá, Khóa cứng | Cấu hình kỹ thuật gửi |
| Content Owner VI | Duyệt câu chữ và thông tin công khai VI | Nội dung EN |
| Content Owner EN | Duyệt câu chữ EN độc lập | Tự động đồng bộ từ VI |
| CMS Administrator | Khởi tạo template, phân quyền, binding đã duyệt | Tự thay routing/người nhận |
| Email Operations | Xác nhận sender, SMTP, deliverability và bằng chứng gửi | Sửa nội dung template không qua duyệt |
| QA | Kiểm thử ma trận event/workspace/audience/state | Tự Activate production |
| Support/Operations | Theo dõi yêu cầu và lỗi sau rollout | Xóa log hoặc yêu cầu thất bại |

Một người không nên vừa soạn, tự duyệt và Activate cùng một phiên bản nếu tổ chức áp dụng nguyên tắc phân tách nhiệm vụ.

## 4. Đầu vào bắt buộc

| Tài liệu | Vai trò trong rollout |
|---|---|
| `product_spec_module_16a_mau_email.md` | UX, workflow, permission và acceptance module |
| `email-event-template-routing-matrix.md` | Event, audience, routing và kết quả cần ghi nhận |
| `email-template-variable-catalog.md` | Token hợp lệ và quy tắc render |
| `email-template-baseline-library.md` | 20 nội dung khởi tạo VI/EN |
| Khảo sát 13 mẫu cũ | Nguồn đối chiếu legacy, không mặc định là chuẩn mới |

Thiếu một trong bốn tài liệu thiết kế mới thì không được chuyển sang cấu hình production.

## 5. Workstream A — kiểm kê 13 mẫu cũ

Mỗi mẫu cũ phải có một dòng trong worksheet đối chiếu:

| Thuộc tính cần ghi | Câu hỏi cần trả lời |
|---|---|
| Workspace | VI hay EN; có bản tương ứng ở workspace kia không |
| Tên/loại cũ | Người vận hành hiện hiểu mẫu này dùng cho việc gì |
| Subject và nội dung | Có token, link, địa chỉ hoặc cam kết nghiệp vụ nào |
| Consumer | Form/sự kiện/sản phẩm nào đang gọi mẫu |
| Audience | Khách hàng hay nhân viên nội bộ |
| Người nhận hiện tại | Lấy từ submission, routing hay hard-code |
| Tần suất gần đây | Còn dùng hay chỉ là dữ liệu tồn |
| Rủi ro | Token lạ, PII, link tĩnh, câu chữ sai hoặc không có owner |
| Quyết định | Keep, Replace, Merge-content, Archive hoặc Investigate |
| Mẫu đích | Bản ghi baseline nào sẽ thay thế nếu có |

### 5.1. Quy tắc quyết định

| Quyết định | Khi dùng | Kết quả |
|---|---|---|
| Keep | Có consumer hợp lệ nhưng chưa có baseline thay thế | Chuyển thành Draft để review; chưa binding mới |
| Replace | Cùng event/audience với baseline và baseline đáp ứng nghiệp vụ | Mapping tới template mới sau QA |
| Merge-content | Nội dung cũ có đoạn nghiệp vụ hợp lệ cần giữ | Content Owner đưa đoạn cần thiết vào version mới |
| Archive | Không có consumer, trùng lặp hoặc đã ngừng nghiệp vụ | Lưu lịch sử, không được chọn cho binding mới |
| Investigate | Không xác định được event, audience hoặc người nhận | Chặn migration mẫu đó |

Không xóa cứng mẫu cũ trong rollout đầu tiên.

### 5.2. Definition of Done

- [ ] Đủ 13/13 mẫu có dòng đối chiếu.
- [ ] Mỗi mẫu xác định được workspace hoặc được đánh dấu dữ liệu lỗi.
- [ ] Mỗi mẫu có consumer đã xác nhận hoặc bằng chứng không còn consumer.
- [ ] Không còn token lạ chưa có quyết định.
- [ ] Không còn địa chỉ nhận/sender hard-code chưa được xử lý.
- [ ] Mỗi mẫu có owner và quyết định cuối cùng.

## 6. Workstream B — chuẩn bị module

### 6.1. Navigation và quyền

- Menu `Mẫu email` nằm trong nhóm Khách hàng, sau `Yêu cầu khách hàng`.
- Menu chỉ hiện với người có quyền xem module.
- Author tạo/sửa Draft; Reviewer duyệt; Publisher Activate/Inactive; Administrator quản lý quyền.
- Người chỉ xử lý yêu cầu khách hàng không mặc định có quyền sửa template.

### 6.2. Dữ liệu khởi tạo

- Tạo đúng 20 bản ghi theo manifest trong Baseline Library.
- Mỗi bản ghi có workspace, event, audience và trạng thái Draft rõ ràng.
- Không seed địa chỉ người nhận, sender, CC/BCC hoặc routing vào template.
- Version đầu tiên phải có người tạo và thời điểm tạo.

### 6.3. Readiness của UI

- List, Create, Edit, Preview, Version history và nơi sử dụng hoạt động theo Product Specification.
- Variable Picker lọc đúng event/audience.
- Preview có dữ liệu giả và trạng thái thiếu dữ liệu tùy chọn.
- Gửi thử tách khỏi routing production.
- Activate có bước confirm và hiển thị consumer bị ảnh hưởng.

## 7. Workstream C — hoàn thiện dependency

### 7.1. Cấu hình hệ thống

- Sender identity và reply-to được duyệt.
- Kiểm tra kết nối không đồng nghĩa email đã được khách hàng nhận.
- Môi trường test không sử dụng nhầm sender production nếu chưa được phép.

### 7.2. Email Routing

- Mỗi event được rollout có rule nội bộ rõ ràng hoặc quyết định không gửi nội bộ.
- Rule mặc định phải được cấu hình tường minh; không dùng email đầu tiên.
- Không có rule trùng độ ưu tiên cho cùng workspace/event/scope.

### 7.3. Dữ liệu sự kiện

- Event cung cấp đủ token bắt buộc.
- Workspace lấy từ yêu cầu nghiệp vụ, không lấy từ ngôn ngữ giao diện của staff.
- Download có policy link và expiry.
- Báo giá/Khóa cứng giữ acknowledgement không link cho đến khi nghiệp vụ duyệt biến thể khác.

## 8. Workstream D — QA

### 8.1. Ma trận kiểm thử tối thiểu

Mỗi event phải chạy các ca sau trong cả VI và EN:

| Ca | Kỳ vọng |
|---|---|
| Khách hàng + dữ liệu đầy đủ | Render đúng template, token và workspace |
| Thiếu dữ liệu tùy chọn | Bỏ trọn khối/dòng, không còn câu cụt |
| Thiếu dữ liệu bắt buộc | Không gửi; lỗi chỉ rõ token thiếu |
| Không có template Active | Yêu cầu vẫn được lưu; có cảnh báo cấu hình |
| Routing nội bộ không có kết quả | Email khách hàng xử lý độc lập; nội bộ không gửi |
| Template conflict | Không tự chọn bản đầu tiên |
| Workspace EN thiếu mẫu | Không fallback VI |
| Gửi thử | Không tạo yêu cầu, không dùng routing thật |
| Dispatch failed | Lịch sử ghi failed; trạng thái yêu cầu không tự đổi |
| Retry | Giữ template version và recipient đã resolve theo policy |

Baseline tối thiểu: `5 event × 2 workspace × 10 ca = 100` ca logic, chưa tính responsive, accessibility và permission.

### 8.2. Kiểm thử nội dung

- Subject không chứa PII/token bị cấm và không bị cắt khó hiểu.
- HTML view và plain-text view truyền đạt cùng ý nghĩa.
- Link/CTA có nhãn rõ, focus được bằng bàn phím và không phụ thuộc màu.
- Nội dung VI/EN được owner tương ứng duyệt.
- Báo giá không tự nhận là báo giá chính thức.
- Khóa cứng không tự nhận đã cấp/activate.

### 8.3. Kiểm thử lịch sử và audit

- Ghi event, workspace, audience, template và version.
- Phân biệt render failed, routing failed và dispatch failed.
- UI không ghi “khách hàng đã nhận” nếu chỉ có dispatch accepted.
- Không lộ PII hoặc token link tải trong log lỗi ngoài quyền.

## 9. Thứ tự rollout theo event

Thứ tự đề xuất dựa trên mức độ phụ thuộc nghiệp vụ:

| Wave | Event | Lý do | Điều kiện riêng |
|---|---|---|---|
| 0 | Module + Draft templates | Cho phép review không ảnh hưởng gửi thật | Menu giới hạn theo quyền |
| 1 | Liên hệ sản phẩm | Acknowledgement đơn giản, không cấp file/giao dịch | Content và routing đã duyệt |
| 2 | Đặt mua | Chỉ xác nhận tiếp nhận, không xác nhận đơn hàng | Câu chữ pháp lý được duyệt |
| 3 | Download | Phụ thuộc link và thời hạn | Link policy, expiry, security đạt |
| 4 | Báo giá | Có nguy cơ hiểu nhầm là báo giá chính thức | Chỉ bật acknowledgement baseline |
| 5 | Khóa cứng | Phụ thuộc điều kiện quyền sử dụng | Chỉ bật acknowledgement baseline |

Mỗi wave phải qua cửa kiểm soát riêng; wave sau không tự động được phép chỉ vì wave trước thành công.

## 10. Cổng kiểm soát cho từng wave

### Gate 1 — Content Ready

- Template VI/EN đúng event và audience.
- Token validation đạt.
- Content Owner và Approver duyệt version.

### Gate 2 — Dependency Ready

- Sender/SMTP sẵn sàng.
- Routing có quyết định rõ.
- Consumer phát đúng event/workspace và đủ biến.

### Gate 3 — QA Ready

- Test logic, permission, accessibility và responsive đạt.
- Gửi thử tới địa chỉ kiểm soát đạt.
- Có bằng chứng timeline/audit đúng.

### Gate 4 — Production Ready

- Chọn thời điểm rollout và người trực theo dõi.
- Xác định rõ binding cũ, binding mới và thao tác rollback.
- Không còn issue Critical/High; issue thấp có owner và thời hạn.

Chỉ sau Gate 4 mới Activate template và đổi binding của event tương ứng.

## 11. Cách chuyển đổi an toàn

```text
Khởi tạo Draft
→ Review và gửi thử
→ Activate version mới nhưng chưa đổi consumer
→ Kiểm tra trạng thái Active duy nhất trong đúng scope
→ Chuyển binding của một event/workspace
→ Gửi giao dịch kiểm soát
→ Theo dõi kết quả
→ Mới chuyển workspace/event kế tiếp
```

Không chuyển VI và EN cùng một thao tác nếu chưa kiểm tra độc lập.

## 12. Theo dõi sau rollout

Theo dõi theo event và workspace, tối thiểu:

- Số yêu cầu nghiệp vụ đã tạo.
- Số tác vụ email dự kiến.
- Render success/failed.
- Routing success/failed.
- Dispatch accepted/failed.
- Số lần retry.
- Template/version được sử dụng.
- Khiếu nại nội dung hoặc link không hoạt động.

Không dùng open rate làm bằng chứng duy nhất về việc khách hàng đã nhận hoặc đọc email.

## 13. Điều kiện rollback

Rollback wave khi có một trong các tình huống:

- Gửi sai workspace, audience hoặc người nhận.
- Token PII lộ sai quyền.
- Template conflict dẫn đến chọn không xác định.
- Tỷ lệ render/dispatch lỗi vượt ngưỡng vận hành đã duyệt.
- Link Download sai, hết hạn bất thường hoặc không an toàn.
- Nội dung tạo cam kết pháp lý/nghiệp vụ sai.

### 13.1. Hành vi rollback

1. Ngừng binding mới của event/workspace bị ảnh hưởng.
2. Trở về binding cũ đã ghi nhận hoặc tạm ngừng gửi event nếu luồng cũ không an toàn.
3. Không xóa template version, log hoặc yêu cầu đã tạo.
4. Xác định các giao dịch bị ảnh hưởng theo version/event/workspace.
5. Content/Business Owner quyết định có cần liên hệ sửa sai hay không.

Rollback email không rollback hoặc xóa yêu cầu khách hàng.

## 14. Quyết định Go/No-Go toàn module

### Go

- 13/13 mẫu cũ đã được đối chiếu.
- 20/20 mẫu mới tồn tại dưới dạng Draft và đúng manifest.
- Quyền, workflow, preview, version và audit đạt acceptance.
- Có ít nhất một wave hoàn tất bốn gate.
- Rollback đã được diễn tập hoặc kiểm chứng bằng ca kiểm thử.

### No-Go

- Còn consumer cũ không xác định.
- Còn token ngoài catalog chưa xử lý.
- Routing còn fallback ngầm hoặc conflict.
- VI/EN còn fallback chéo.
- Template mới hard-code người nhận/sender.
- Báo giá/Khóa cứng dùng link khi chưa có quyết định nghiệp vụ.
- Không truy vết được version đã gửi.

## 15. Acceptance Criteria của Bước 6

- [ ] Có worksheet đối chiếu đủ 13 mẫu cũ với owner và quyết định.
- [ ] Có manifest 20 mẫu mới và trạng thái Draft ban đầu.
- [ ] Có phân công trách nhiệm Product, Business, Content VI/EN, Admin, Email Operations và QA.
- [ ] Có bốn gate rõ ràng trước khi chuyển mỗi event.
- [ ] Có thứ tự rollout từng wave, không big-bang.
- [ ] Có tối thiểu 100 ca logic trong ma trận QA baseline.
- [ ] Có kiểm tra riêng cho permission, accessibility, responsive và nội dung.
- [ ] Có monitoring phân biệt render, routing và dispatch.
- [ ] Có điều kiện và hành vi rollback không làm mất yêu cầu/lịch sử.
- [ ] Menu production không mở đại trà trước khi quyền và module acceptance đạt.
- [ ] Activate template không đồng nghĩa consumer đã được chuyển.
- [ ] VI và EN được kiểm tra/chuyển đổi độc lập.

## 16. Kết quả sau Bước 6

Sau khi tài liệu này được duyệt, đội dự án có thể bắt đầu kiểm kê 13 mẫu legacy và chuẩn bị triển khai module theo các gate. Chưa được bật gửi production chỉ dựa trên việc tài liệu đã hoàn thành; từng wave vẫn phải có bằng chứng Go riêng.

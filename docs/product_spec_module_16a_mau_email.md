# PRODUCT SPECIFICATION — MODULE 16A: MẪU EMAIL

> TO-BE Detailed Product Specification  
> Căn cứ: khảo sát CMS cũ, ma trận workspace dataset và quyết định `docs/email-template-product-decision.md`  
> Form chỉ mô tả cấu trúc, không liệt kê field  
> Không bao gồm code, HTML, React, API hoặc database

---

# 1. Mục tiêu

Mẫu email là thư viện nội dung giao tiếp tự động được dùng bởi các sự kiện như tiếp nhận liên hệ, đăng ký tư vấn, đặt mua, yêu cầu báo giá hoặc tải tài liệu. Module không thực hiện gửi mail, không cấu hình SMTP và không quyết định người nhận.

| Vai trò | Nhu cầu | Khi sử dụng |
|---|---|---|
| Content/Marketing Editor | Soạn, xem trước và cập nhật nội dung | Khi thông điệp hoặc thương hiệu thay đổi |
| Customer Operations | Xác nhận nội dung đúng với hành trình khách hàng | Khi thay đổi quy trình tiếp nhận |
| Product/Sales Manager | Kiểm tra mẫu đang gắn với sự kiện sản phẩm | Khi sản phẩm hoặc routing thay đổi |
| Reviewer/Approver | Duyệt phiên bản trước khi đưa vào sử dụng | Theo hàng chờ duyệt |
| Admin | Quản trị quyền, ngoại lệ, lưu trữ và phục hồi | Khi cần quản trị hệ thống |

**Mục tiêu:** tạo một nguồn nội dung email có kiểm soát. **Lý do:** CMS cũ đặt template trong Sản phẩm và trộn nội dung với routing. **Lợi ích:** tái sử dụng, truy vết và thay đổi an toàn. **Ảnh hưởng UX:** người dùng luôn biết mình đang sửa nội dung, cấu hình người nhận hay hạ tầng gửi.

Module dùng dataset độc lập theo workspace VI/EN. Chuyển workspace chỉ thay danh sách template của workspace tương ứng; không fallback nội dung giữa hai workspace.

---

# 2. User Flow

## 2.1. Tạo và kích hoạt mẫu mới

```text
Danh sách → Tạo mẫu → Chọn mục đích sử dụng → Soạn nội dung
→ Chèn biến được phép → Kiểm tra lỗi → Preview bằng dữ liệu mẫu
→ Lưu nháp → Gửi duyệt → Duyệt → Kích hoạt → Thông báo
```

## 2.2. Cập nhật mẫu đang sử dụng

```text
Danh sách → Mở mẫu đang hoạt động → Tạo phiên bản chỉnh sửa
→ Sửa nội dung → So sánh với bản đang chạy → Preview
→ Gửi duyệt → Kích hoạt phiên bản mới → Bản cũ vào lịch sử
```

Bản đang hoạt động tiếp tục được sử dụng trong thời gian phiên bản mới còn là nháp hoặc chờ duyệt.

## 2.3. Nhân bản

```text
Row action → Nhân bản → Chọn workspace hiện tại và mục đích mới
→ Hệ thống tạo bản nháp → Đổi tên/nội dung → Validate → Lưu
```

Nhân bản không sao chép quan hệ nơi sử dụng để tránh gửi nhầm.

## 2.4. Ngừng sử dụng

```text
Detail → Nơi sử dụng → Ngừng sử dụng
→ Kiểm tra sự kiện đang tham chiếu → Chọn mẫu thay thế hoặc gỡ liên kết
→ Confirm → Inactive/Archived
```

## 2.5. Kiểm tra trước khi sử dụng

```text
Preview → Chọn bộ dữ liệu mẫu → Xem desktop/mobile/plain-text
→ Kiểm tra biến, link và nội dung → Gửi email thử theo quyền
→ Ghi kết quả thử nghiệm → Quay lại chỉnh sửa hoặc gửi duyệt
```

**Quyết định:** “Gửi thử” là kiểm tra nội dung, không phải publish và không thay đổi trạng thái template.

---

# 3. Sitemap trong module

```text
Mẫu email
├── Tất cả mẫu
├── Việc của tôi
├── Chờ duyệt
├── Đang sử dụng
├── Có lỗi/cảnh báo
├── Create
├── Detail/Edit
│   ├── Nội dung
│   ├── Biến sử dụng
│   ├── Preview
│   ├── Nơi sử dụng
│   ├── Phiên bản
│   └── Hoạt động
└── Lưu trữ
```

Các mục trên là view trong cùng module, không tạo nhiều menu sidebar dẫn tới cùng một trang.

---

# 4. Layout

## 4.1. List

- Page header: tên module, số mẫu trong workspace hiện tại và action Tạo mẫu.
- Scope navigation: các view hệ thống, không dùng số thứ tự trang trí.
- Filter toolbar: search, loại/mục đích, trạng thái, nơi sử dụng, người cập nhật và nút xóa lọc.
- Bulk action bar: chỉ xuất hiện khi chọn bản ghi.
- Content: data table chuẩn của CMS.
- Footer: tổng số kết quả và pagination chuẩn.

## 4.2. Create/Edit

- Mở bằng trang riêng, không dùng Drawer.
- Header gọn: quay lại, trạng thái lưu, Preview, Lưu nháp và action workflow phù hợp quyền.
- Main content: khu vực soạn nội dung theo section.
- Sidebar/aside: mục đích, trạng thái, cảnh báo và nơi sử dụng tóm tắt.
- Sticky action chỉ dùng trên desktop và không che nội dung; mobile chuyển thành action trong luồng trang.

## 4.3. Preview và Compare

- Preview là màn hình hoặc modal lớn đủ không gian, có chuyển desktop/mobile/plain-text.
- Compare dùng hai cột trên desktop và diff theo khối trên tablet.
- Dialog chỉ dùng cho confirm, gửi thử hoặc thao tác ngắn.

**Lý do:** template thường dài và cần so sánh/preview. **Lợi ích:** giảm chỉnh sửa thiếu ngữ cảnh. **Ảnh hưởng UX:** người dùng không bị giới hạn bởi Drawer hẹp.

---

# 5. Data Table

| Cột | Mục đích | Hành vi |
|---|---|---|
| Chọn | Bulk action | Checkbox chuẩn, hỗ trợ indeterminate |
| Tên mẫu | Nhận diện chính | Tên, mã nhận diện ngắn và cảnh báo quan trọng |
| Loại/mục đích | Hiểu template dùng khi nào | Badge text rõ nghĩa, không chỉ dùng màu |
| Trạng thái | Biết khả năng sử dụng | Draft/Review/Active/Inactive/Archived |
| Nơi sử dụng | Đánh giá ảnh hưởng | Số consumer; mở danh sách chi tiết |
| Chất lượng | Phát hiện lỗi | Biến thiếu, link lỗi hoặc nội dung chưa hoàn thiện |
| Cập nhật | Truy vết | Người cập nhật và thời gian |
| Thao tác | Hành động nhanh | Xem, sửa, preview, nhân bản, thêm tùy chọn |

### Sort

- Mặc định theo cập nhật mới nhất.
- Cho phép sort tên, trạng thái, nơi sử dụng và thời gian cập nhật.

### Filter và Search

- Search theo tên hoặc mã nhận diện.
- Filter kết hợp, hiển thị filter đang có hiệu lực.
- Xóa lọc đưa về view hiện tại, không tự chuyển workspace.

### Bulk Action

- Gửi duyệt, kích hoạt theo quyền, ngừng sử dụng và lưu trữ.
- Không bulk xóa cứng.
- Action không hợp lệ với một phần selection phải disabled kèm giải thích.

### Saved View và Column Setting

- Có view hệ thống; saved view cá nhân là mở rộng sau khi nhu cầu được xác nhận.
- Cho phép ẩn các cột phụ; cột tên, trạng thái và thao tác luôn giữ.

### Sticky và Pagination

- Cột chọn/tên có thể sticky trái, thao tác sticky phải trên desktop.
- Mobile dùng cuộn ngang có kiểm soát.
- Footer dùng mẫu: “Hiển thị 1–25 trong 80 mẫu email”.

---

# 6. Form

Form gồm các section, không liệt kê field chi tiết:

## 6.1. Nhận diện và mục đích

Xác định template là gì, dùng cho nhóm sự kiện nào và giúp phân biệt với template tương tự.

## 6.2. Nội dung email

Khu vực soạn tiêu đề, phần nội dung chính và phiên bản plain-text. Toolbar chỉ giữ chức năng định dạng email cần thiết.

## 6.3. Biến dữ liệu

Hiển thị thư viện biến theo mục đích đã chọn, hỗ trợ tìm kiếm, chèn và xem mô tả bằng ngôn ngữ non-tech. Không cho tự tạo biến tùy ý trong editor.

## 6.4. Preview và dữ liệu mẫu

Chọn kịch bản dữ liệu mẫu, xem kết quả kết xuất, trạng thái thiếu dữ liệu và link phát sinh.

## 6.5. Nơi sử dụng

Hiển thị sự kiện, sản phẩm hoặc rule đang tham chiếu. Quan hệ được quản lý ở consumer tương ứng; module template chủ yếu cho xem và điều hướng.

## 6.6. Publish

Tóm tắt trạng thái, reviewer, cảnh báo chặn và action workflow.

## 6.7. Advanced

Chỉ chứa cấu hình ít dùng đã được phê duyệt; mặc định thu gọn. Không đưa SMTP hoặc routing vào section này.

**Mục tiêu:** tách nội dung khỏi cấu hình vận hành. **Lý do:** giảm lỗi gửi sai người. **Lợi ích:** form dễ học. **Ảnh hưởng UX:** người soạn chỉ tập trung vào thông điệp và biến hợp lệ.

---

# 7. Workflow

```text
Draft → Pending review → Approved → Active
Active → Create revision → Pending review → Approved → Active version mới
Active → Inactive → Archived
Pending review → Returned → Draft
Archived → Restore as Draft
```

- Chỉ một phiên bản Active cho cùng một template trong một workspace.
- Approved chưa tự động Active nếu policy yêu cầu người có quyền kích hoạt riêng.
- Returned bắt buộc có lý do.
- Active không được chỉnh trực tiếp; chỉnh sửa tạo working revision.
- Archive bị chặn nếu còn consumer active mà chưa có phương án thay thế.

---

# 8. Permission

| Khả năng | Editor | Reviewer | Operations/Product Manager | Admin |
|---|---:|---:|---:|---:|
| Xem danh sách/preview | Có theo scope | Có | Có | Có |
| Tạo/sửa Draft | Có | Theo policy | Theo policy | Có |
| Gửi duyệt | Có | Có | Có | Có |
| Approve/Return | Không | Có | Theo policy | Có |
| Activate/Inactive | Không | Theo policy | Có | Có |
| Gửi thử | Theo allowlist | Có | Có | Có |
| Archive/Restore | Không | Không | Theo policy | Có |
| Xem nơi sử dụng/lịch sử | Có | Có | Có | Có |

- Quyền áp dụng theo workspace.
- Không suy ra quyền template từ quyền chỉnh Product Settings.
- Người không có quyền xem dữ liệu khách hàng chỉ được preview bằng dữ liệu giả lập.

---

# 9. Validation Strategy

## Bắt buộc

- Nhận diện và mục đích hợp lệ.
- Nội dung đủ để kết xuất ở kênh được yêu cầu.
- Biến thuộc danh sách cho phép của loại template.
- Không còn placeholder sai cú pháp hoặc chưa đóng.

## Cảnh báo

- Template chưa có consumer.
- Nội dung quá dài, link chưa kiểm tra hoặc thiếu plain-text.
- Có thay đổi lớn so với bản Active.
- Dữ liệu mẫu chưa bao phủ biến tùy chọn.

## Lỗi chặn

- Biến không tồn tại hoặc bắt buộc nhưng không thể cung cấp.
- Template trùng mã nhận diện trong workspace.
- Kích hoạt khi chưa được duyệt.
- Archive khi còn consumer active chưa xử lý.

## Feedback

- Inline error đặt gần section liên quan.
- Summary lỗi đầu trang có link tới vị trí lỗi.
- Loading action có trạng thái rõ; chống submit lặp.
- Success nêu rõ đã lưu nháp, gửi duyệt hay kích hoạt.

---

# 10. Empty State

| Trạng thái | Nội dung | Action |
|---|---|---|
| Workspace chưa có mẫu | Giải thích VI/EN độc lập | Tạo mẫu đầu tiên nếu có quyền |
| View không có dữ liệu | Nêu view hiện tại | Chuyển về Tất cả mẫu |
| Filter không có kết quả | Hiển thị filter có hiệu lực | Xóa lọc |
| Không có quyền | Không để lộ dữ liệu | Quay lại hoặc yêu cầu quyền |
| Không có nơi sử dụng | Nêu template chưa được gán | Đi tới hướng dẫn gán |

---

# 11. Loading State

- List: skeleton header và các hàng, giữ chiều rộng cột ổn định.
- Detail: skeleton theo section.
- Preview: skeleton khung email; không hiển thị nội dung cũ của template khác.
- Compare/version: spinner cục bộ.
- Gửi thử: progress trong dialog, cho phép đóng sau khi hệ thống xác nhận đã nhận tác vụ.

---

# 12. Error State

| Loại | Cách xử lý |
|---|---|
| Network | Giữ nội dung chưa lưu, cho Retry |
| Permission | Chặn action, giải thích quyền cần thiết |
| Server | Hiển thị mã tham chiếu, không mất draft local |
| Validation | Highlight section và summary lỗi |
| Preview render | Chỉ ra biến/khối gây lỗi |
| Gửi thử thất bại | Tách lỗi kết xuất và lỗi hạ tầng gửi |
| Version conflict | Yêu cầu compare/reload, không ghi đè âm thầm |
| Session hết hạn | Giữ bản nháp tạm và đưa về đăng nhập |

---

# 13. Notification

- Toast: lưu nháp, nhân bản, gửi duyệt, return, approve, activate thành công.
- Alert inline: lỗi biến, template đang có consumer, phiên bản Active đã thay đổi.
- Confirm dialog: inactive, archive, restore hoặc thay thế phiên bản Active.
- Result dialog: gửi thử, gồm người nhận thử đã che bớt, thời gian và trạng thái.
- Không dùng toast thành công để khẳng định khách hàng đã nhận email nếu mới chỉ tiếp nhận tác vụ gửi.

---

# 14. Responsive

## Desktop

- Table đầy đủ, sticky column khi cần.
- Form main–aside; preview và compare hai cột.

## Laptop

- Giảm cột phụ mặc định; giữ tên, loại, trạng thái, cập nhật và action.
- Aside hẹp hơn nhưng không che editor.

## Tablet

- Filter chuyển thành panel/drawer ngắn.
- Table cuộn ngang; action không bị co.
- Form một cột; publish summary đặt cuối nội dung.

Module không tối ưu riêng cho mobile phone trong CMS production hiện tại; nếu hỗ trợ, ưu tiên read/approve và không ép trải nghiệm soạn email phức tạp trên màn hình nhỏ.

---

# 15. UX Details

- Shortcut: lưu nháp; preview; tìm kiếm trong danh sách.
- Autosave chỉ áp dụng Draft, hiển thị thời điểm lưu gần nhất.
- Undo cho thay đổi UI cục bộ; không Undo action workflow đã xác nhận.
- Recent: các template vừa mở trong Command Palette.
- Quick action: Preview và Nhân bản; không đặt Activate thành action dễ bấm nhầm.
- Variable picker có search, nhóm và mô tả; chèn tại vị trí con trỏ.
- Preview giữ nguyên kịch bản dữ liệu mẫu khi quay lại chỉnh sửa.
- Khi chuyển workspace, cảnh báo nếu đang có Draft chưa lưu.

---

# 16. Accessibility

- Tất cả action có accessible name; icon không đứng một mình nếu nghĩa không rõ.
- Table có header association, checkbox label và trạng thái indeterminate.
- Editor, variable picker và dialog thao tác hoàn toàn bằng bàn phím.
- Focus không nhảy mất sau khi chèn biến hoặc validation.
- Error summary dùng live region phù hợp.
- Trạng thái không chỉ biểu diễn bằng màu.
- Contrast đạt WCAG AA cho text, badge, focus ring và disabled state.
- Preview không dùng nội dung email làm accessible label của toàn bộ iframe/khung.

---

# 17. Edge Cases

| Tình huống | Hành vi mong muốn |
|---|---|
| Workspace EN không có mẫu | Empty state; không lấy mẫu VI |
| Template Active đang được sửa | Bản Active vẫn chạy; sửa trên revision |
| Consumer bị xóa | Nơi sử dụng đánh dấu mất liên kết, không crash |
| Biến đổi tên | Template liên quan bị cảnh báo, không tự thay âm thầm |
| Dữ liệu biến chứa HTML | Escape/sanitize theo policy và preview đúng |
| Link tải hết hạn | Preview dùng trạng thái giả lập; runtime tạo link theo sự kiện |
| Hai người sửa cùng Draft | Phát hiện conflict và compare |
| Reviewer cũng là tác giả | Áp dụng policy separation nếu được cấu hình |
| Archive template cuối cùng của sự kiện | Chặn và yêu cầu mẫu thay thế |
| Gửi thử nhiều lần | Chống submit lặp, hiển thị từng kết quả |
| Nội dung rất dài | Editor và preview vẫn cuộn độc lập, action không bị mất |
| Session hết hạn | Giữ draft tạm, không kích hoạt ngoài ý muốn |
| Mất mạng sau Activate | Không giả định thành công; kiểm tra lại trạng thái |
| Template không có plain-text | Cảnh báo hoặc chặn tùy loại sự kiện |
| Dữ liệu mẫu thiếu biến tùy chọn | Preview thể hiện trạng thái trống có chủ ý |

---

# 18. Acceptance Criteria

## Navigation và scope

- [ ] Module có canonical path `/cms/email-templates`.
- [ ] Module là màn hình độc lập, không nằm trong Thiết lập sản phẩm hoặc Cấu hình hệ thống.
- [ ] Chuyển VI/EN tải dataset độc lập và không fallback.
- [ ] Draft chưa lưu được bảo vệ khi chuyển workspace hoặc rời trang.

## List/Table

- [ ] Search, filter, sort và pagination hoạt động nhất quán.
- [ ] Selection và bulk action dùng chuẩn CMS chung.
- [ ] Tên, trạng thái, nơi sử dụng và action luôn đọc được.
- [ ] Empty/no-result/no-permission khác nhau rõ ràng.
- [ ] Footer hiển thị đúng khoảng bản ghi và tổng số.

## Create/Edit

- [ ] Create/Edit mở trang riêng.
- [ ] Form có đủ các section đã định nghĩa và không chứa SMTP/routing.
- [ ] Autosave Draft không tạo nhiều phiên bản ngoài ý muốn.
- [ ] Variable picker chỉ cho chèn biến hợp lệ theo mục đích.
- [ ] Validation đưa focus tới lỗi và không làm mất nội dung.

## Preview và gửi thử

- [ ] Preview hỗ trợ desktop/mobile/plain-text.
- [ ] Có thể đổi dữ liệu mẫu mà không sửa template.
- [ ] Biến thiếu hoặc sai được hiển thị rõ.
- [ ] Gửi thử không publish và không đổi trạng thái template.
- [ ] Kết quả gửi thử phân biệt lỗi render và lỗi hạ tầng gửi.

## Workflow và version

- [ ] Draft–Pending review–Approved–Active–Inactive–Archived đúng quyền.
- [ ] Returned bắt buộc có lý do.
- [ ] Sửa bản Active tạo revision; bản Active cũ vẫn dùng.
- [ ] Kích hoạt phiên bản mới lưu bản cũ vào lịch sử.
- [ ] Không thể có hai phiên bản Active cùng lúc cho một template/workspace.

## Dependency và an toàn

- [ ] Nơi sử dụng hiển thị consumer hiện tại và điều hướng được.
- [ ] Nhân bản không sao chép consumer.
- [ ] Không thể archive khi còn consumer active chưa có phương án.
- [ ] Gửi email không tự đổi trạng thái xử lý của contact.
- [ ] Người thiếu quyền dữ liệu khách hàng chỉ preview bằng dữ liệu giả.

## Accessibility và responsive

- [ ] Keyboard hoàn thành được list, form, variable picker, preview và workflow.
- [ ] Focus visible và không bị sticky header che.
- [ ] Trạng thái có text, không phụ thuộc màu.
- [ ] Table không làm button/action bị ép trên tablet.
- [ ] Contrast đạt WCAG AA.

---

# 19. Kết quả

Module Mẫu email được xác định là thư viện nội dung giao tiếp có workflow và version riêng, tách khỏi:

- hạ tầng gửi mail trong Cấu hình hệ thống;
- quyết định người nhận trong Email routing;
- trạng thái xử lý trong Yêu cầu khách hàng;
- cấu hình taxonomy trong Thiết lập sản phẩm.

Thiết kế này cho phép tái sử dụng template giữa nhiều sự kiện, quản lý VI/EN độc lập, thay đổi phiên bản an toàn và cung cấp đủ trạng thái cho UI Designer, Frontend, Backend workflow và QA tiếp tục triển khai.

## Tài liệu tích hợp kế tiếp

Product Specification này không tự xác định template nào được dùng cho sự kiện nào. Ma trận tích hợp đã được lập tại `docs/email-event-template-routing-matrix.md`:

```text
Sự kiện → Đối tượng nhận → Routing → Template → Nhóm biến → Kết quả cần ghi nhận
```

Ma trận này là baseline để nối Mẫu email với Sản phẩm và Yêu cầu khách hàng mà không đưa routing trở lại template. Các điểm được đánh dấu cần nghiệp vụ xác nhận phải được chốt trước khi bật gửi tự động tương ứng.

Variable Catalog dùng cho editor, preview và validation được chốt tại `docs/email-template-variable-catalog.md`. Catalog chỉ cung cấp dữ liệu nội dung; không chứa SMTP, người nhận hoặc routing.

Thư viện nội dung khởi tạo VI/EN cho năm event và hai audience được đặc tả tại `docs/email-template-baseline-library.md`. Tất cả mẫu khởi tạo ở trạng thái Draft và phải qua review trước khi Activate.

# WORKSHEET ĐỐI CHIẾU MẪU EMAIL LEGACY

> Phạm vi: Bước 7 của thiết kế module Mẫu email  
> Ngày lập: 2026-08-05  
> Trạng thái: Đối chiếu tài liệu hoàn tất; kiểm kê bản ghi thực tế chưa hoàn tất

## 1. Kết luận hiện tại

Tài liệu khảo sát hiện có chưa đủ bằng chứng để tuyên bố đã đối chiếu 13/13 mẫu legacy.

- Khảo sát chi tiết module Email ghi nhận **7 bản ghi** trên danh sách được quan sát.
- Product Decision ghi **khoảng 13 mẫu**, nhưng không kèm manifest tên/ID/workspace.
- Cấu trúc dữ liệu xác nhận VI và EN là hai dataset độc lập.
- Khảo sát xác nhận năm loại sử dụng: Download, Đặt mua, Liên hệ, Tải báo giá và Tải khóa cứng.
- Chỉ có ba tên được ghi như ví dụ: `Download- DCS`, `DatMua_DCS`, `LienHe_DCS`.
- Chưa có bằng chứng tài liệu để biết ba tên ví dụ là ba bản ghi đang tồn tại, chỉ là quy ước đặt tên minh họa, hay consumer nào đang dùng chúng.

Vì vậy trạng thái Go-Live hiện tại là **No-Go cho migration/binding**, nhưng không chặn thiết kế module hoặc khởi tạo 20 template mới dưới dạng Draft.

## 2. Nguồn bằng chứng

| Nguồn | Bằng chứng sử dụng | Giới hạn |
|---|---|---|
| `khao_sat_cms_module_san_pham.md` | Danh sách Email có 7 bản ghi; năm loại email; ba ví dụ tên; form Sản phẩm có năm vị trí chọn mẫu | Không có manifest 7 dòng, subject, token, status hoặc consumer cụ thể |
| `cms-workspace-dataset-matrix.md` | `cic_email` và `cic_email_en` độc lập | Không cung cấp số lượng hoặc nội dung bản ghi |
| `email-template-product-decision.md` | Khoảng 13 mẫu legacy | Không chỉ rõ cách đếm hoặc phân bổ VI/EN |
| `email-event-template-routing-matrix.md` | Năm event baseline | Không chứng minh mapping từng template cũ |

Không dùng mock data của CMS mới làm bằng chứng legacy.

## 3. Chênh lệch số lượng cần xử lý

Ba khả năng cần kiểm chứng bằng dữ liệu/runtime được ủy quyền:

1. `7` là số bản ghi của workspace đang mở; tổng VI + EN xấp xỉ `13`.
2. `13` là số ở một thời điểm khảo sát khác; dữ liệu đã thay đổi.
3. `13` gồm cả mẫu và loại email hoặc bản ghi không còn active.

Không chọn một giả thuyết làm kết luận cho đến khi có manifest riêng của `cic_email` và `cic_email_en` hoặc export tương đương.

## 4. Worksheet 13 slot ban đầu

Các slot dưới đây chỉ là hàng kiểm kê, không phải 13 bản ghi đã xác nhận. `LEGACY-xx` là mã worksheet, không phải ID database.

| Slot | Workspace | Tên legacy | Event khả dĩ | Audience | Consumer | Quyết định | Mẫu đích | Mức bằng chứng |
|---|---|---|---|---|---|---|---|---|
| LEGACY-01 | Chưa xác nhận | `Download- DCS` (ví dụ trong khảo sát) | Download | Khách hàng khả dĩ | Chưa xác nhận | Investigate | Gửi liên kết tải tài liệu sản phẩm | Tên ví dụ + loại event |
| LEGACY-02 | Chưa xác nhận | `DatMua_DCS` (ví dụ trong khảo sát) | Đặt mua | Khách hàng khả dĩ | Chưa xác nhận | Investigate | Xác nhận đăng ký mua sản phẩm | Tên ví dụ + loại event |
| LEGACY-03 | Chưa xác nhận | `LienHe_DCS` (ví dụ trong khảo sát) | Liên hệ sản phẩm | Khách hàng khả dĩ | Chưa xác nhận | Investigate | Xác nhận đã tiếp nhận liên hệ sản phẩm | Tên ví dụ + loại event |
| LEGACY-04 | Chưa xác nhận | Chưa có bằng chứng | Báo giá khả dĩ | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chỉ biết loại event tồn tại |
| LEGACY-05 | Chưa xác nhận | Chưa có bằng chứng | Khóa cứng khả dĩ | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chỉ biết loại event tồn tại |
| LEGACY-06 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |
| LEGACY-07 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |
| LEGACY-08 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |
| LEGACY-09 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |
| LEGACY-10 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |
| LEGACY-11 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |
| LEGACY-12 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |
| LEGACY-13 | Chưa xác nhận | Chưa có bằng chứng | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | Investigate | Chưa map | Chưa đủ dữ liệu |

Không được dùng slot trống để tạo template giả hoặc suy ra ID theo số thứ tự.

## 5. Mapping đã có thể chốt ở mức loại sự kiện

| Vị trí chọn mẫu ở Sản phẩm cũ | Event mới | Baseline khách hàng | Trạng thái mapping |
|---|---|---|---|
| Loại email liên hệ | `EVT-PRODUCT-CONTACT` | Xác nhận đã tiếp nhận liên hệ sản phẩm | Chốt ở mức event; chưa chốt template record |
| Loại email download | `EVT-PRODUCT-DOWNLOAD` | Gửi liên kết tải tài liệu sản phẩm | Chốt ở mức event; cần xác nhận link policy |
| Loại email đặt mua | `EVT-PRODUCT-PURCHASE` | Xác nhận đăng ký mua sản phẩm | Chốt ở mức event; chưa chốt template record |
| Loại email tải báo giá | `EVT-PRODUCT-QUOTE` | Xác nhận đã tiếp nhận yêu cầu báo giá | Chốt acknowledgement; chưa cho file/link |
| Loại email tải khóa cứng | `EVT-PRODUCT-HARDLOCK` | Xác nhận đã tiếp nhận yêu cầu khóa cứng | Chốt acknowledgement; chưa cho link/quyền |

Mapping này không chứng minh một template cũ dùng chung hay riêng cho nhiều sản phẩm.

## 6. Dữ liệu tối thiểu cần thu cho từng bản ghi thật

Khi có quyền truy cập dữ liệu/runtime, mỗi bản ghi phải bổ sung:

1. Workspace nguồn: VI hoặc EN.
2. ID legacy và tên/alias nguyên gốc.
3. Trạng thái active/inactive.
4. Subject nếu có và nội dung hiện tại.
5. Danh sách token/placeholder thực tế.
6. Link, email, sender hoặc recipient bị hard-code.
7. Event/type đang được gán.
8. Danh sách sản phẩm/consumer đang tham chiếu.
9. Bằng chứng sử dụng gần nhất nếu có.
10. Audience thực tế.
11. Owner nghiệp vụ/content owner.
12. Quyết định Keep, Replace, Merge-content, Archive hoặc Investigate.
13. Template baseline đích và các đoạn nội dung cần bảo tồn.

Chỉ cần đọc metadata/nội dung phục vụ đối chiếu; không sửa, Activate, Delete hoặc đổi binding trong bước kiểm kê.

## 7. Quy tắc rà token legacy

Mỗi placeholder tìm thấy được phân loại:

| Loại | Xử lý |
|---|---|
| Có token tương đương trong Variable Catalog | Map rõ token cũ → token mới |
| Dữ liệu hợp lệ nhưng catalog chưa có | Đưa ra Business/Product review; không tự tạo token |
| To/CC/BCC/sender/routing | Loại khỏi template và chuyển về đúng module chịu trách nhiệm |
| HTML/script hoặc object tùy ý | Không migrate trực tiếp; review an toàn |
| Không xác định ý nghĩa | Giữ mẫu ở Investigate; chặn Activate |
| Link tĩnh có nghiệp vụ | Xác nhận owner, domain, expiry và event trước khi giữ |

## 8. Quy tắc xác định consumer

- Một template được coi là có consumer chỉ khi có tham chiếu từ sản phẩm/cấu hình sự kiện hoặc bằng chứng runtime tương đương.
- Tên giống event không phải bằng chứng consumer.
- `published = true` không chứng minh template đang được dùng.
- Ordering không được dùng làm quy tắc “mẫu đầu tiên”.
- Nếu nhiều sản phẩm dùng cùng template, ghi đầy đủ scope và đánh giá tác động trước Replace.
- Consumer VI không suy ra consumer EN và ngược lại.

## 9. Cổng hoàn thành worksheet

### Gate A — Count reconciled

- Xác nhận tổng số thực tế và phân bổ VI/EN.
- Giải thích được chênh lệch `7` và `khoảng 13`.
- Không còn slot giả được coi như bản ghi thật.

### Gate B — Record reconciled

- Mỗi bản ghi thật có ID, workspace, name, status và content fingerprint.
- Mỗi bản ghi có event/audience hoặc giữ Investigate với owner.

### Gate C — Consumer reconciled

- Mỗi bản ghi có danh sách consumer hoặc bằng chứng không còn sử dụng.
- Không có binding dựa trên ordering/fallback ngầm.

### Gate D — Decision approved

- Mỗi bản ghi có quyết định và template đích.
- Content Owner duyệt đoạn nội dung cần giữ.
- Product/Business Owner duyệt trường hợp Archive/Investigate ảnh hưởng consumer.

Chỉ khi qua cả bốn gate mới được đánh dấu `13/13` hoặc `N/N` theo tổng số đã kiểm chứng.

## 10. Trạng thái readiness sau rà docs

| Hạng mục | Trạng thái | Kết luận |
|---|---|---|
| Năm event sản phẩm | Đủ bằng chứng | Có thể dùng làm taxonomy mới |
| Hai workspace độc lập | Đủ bằng chứng | Không fallback VI/EN |
| Tổng số template legacy | Mâu thuẫn | Cần manifest thực tế |
| Danh sách tên/ID | Thiếu | Chưa migration |
| Audience từng mẫu | Thiếu | Chưa Activate |
| Consumer từng mẫu | Thiếu | Chưa đổi binding |
| Token legacy | Thiếu | Chưa map nội dung tự động |
| Nội dung baseline mới | Đã có | Có thể khởi tạo Draft |

## 11. Acceptance Criteria của Bước 7

- [x] Ghi nhận rõ chênh lệch 7 và khoảng 13, không che giấu bằng giả định.
- [x] Có 13 slot worksheet để tiếp tục kiểm kê mà không giả mạo ID.
- [x] Ba tên ví dụ được đánh dấu đúng là ví dụ, chưa coi là record xác nhận.
- [x] Năm vị trí chọn mẫu được map tới năm event mới ở mức nghiệp vụ.
- [x] Có bộ dữ liệu tối thiểu cần thu cho từng record.
- [x] Có quy tắc xử lý token, consumer và nội dung hard-code.
- [x] Có bốn gate để kết thúc reconciliation.
- [x] Kết luận No-Go cho migration/binding khi manifest chưa đủ.
- [ ] Tổng số thực tế và phân bổ VI/EN đã được xác minh.
- [ ] Tất cả record có ID/tên/workspace/status/content.
- [ ] Tất cả consumer đã được xác minh.
- [ ] Tất cả token legacy đã được map hoặc có quyết định.
- [ ] Mỗi record có quyết định cuối cùng được owner duyệt.

Năm mục chưa hoàn thành là công việc kiểm kê dữ liệu thực tế, không thể đóng chỉ bằng tài liệu khảo sát hiện có.

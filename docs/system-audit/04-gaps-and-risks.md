# Gap và rủi ro thực sự

> Chỉ liệt kê điểm chưa khớp có tác động dữ liệu/backend. Khác tên nhưng cùng nghĩa không nằm trong danh sách thiếu schema.

## Gap đã xác nhận

| Gap | Nhóm | Tác động | Hướng xử lý sau khi được duyệt |
|---|---|---|---|
| Page Builder không có model Page/Section/config/reference | D | Không thể lưu draft/published section cố định | Bảng mới theo `static-pages-page-builder-data-backend-plan.md`; giữ `cic_contents*` legacy |
| Media mới cần asset/folder/version/variant/license/usage, trong khi legacy phân mảnh | D | Không thể vận hành đủ UI Media từ các bảng cũ | Tạo model Media chuẩn hóa và adapter đọc URL/file legacy |
| CTA generic và Form động chưa có bảng | D | Không thể tái sử dụng CTA/form hoặc validate submit | Tạo bảng riêng; config schema allowlist, không lưu code |
| Yêu cầu khách hàng nằm ở contact/order/product_contact | A + D mở rộng | Một list hợp nhất dễ làm mất field/nguồn nếu gộp vật lý | Dùng adapter/source type; chỉ tạo bảng note/log/common index nếu cần |
| Mẫu email chưa có bảng template; `cic_email` là dữ liệu khác nghĩa | D | Không thể lưu version/workspace/event/audience template | Tạo bảng template riêng; không đổi nghĩa bảng legacy |
| RBAC role/version/scope chưa tồn tại đầy đủ | D | UI Vai trò & Quyền không thể chạy thật chỉ từ quyền trực tiếp legacy | Giữ quyền legacy và bổ sung lớp role theo tài liệu compatibility |
| Audit CMS đúng nghĩa chưa có | D | Không truy vết được actor/action/before/after | Bảng append-only mới; `cic_history` không phù hợp |
| Thùng rác chung/deleted_at không tồn tại đồng đều | D | Xóa/khôi phục không an toàn nếu chỉ dựa bảng entity | Bảng trash chung + snapshot/transaction; audit riêng |

## Điểm chưa đủ bằng chứng để thêm DB

| Điểm | Vì sao chưa thêm |
|---|---|
| Event `end_time` legacy | Nghiệp vụ đã chốt cần ba trạng thái. Không thêm field: tái sử dụng `end_time`, nhưng phải đối soát/cleanup giá trị do code cũ ghi như updated time trước khi public sử dụng. |
| Agenda, speaker, audience, gallery/documents riêng cho Event | Chưa có form/DB legacy; có thể biểu diễn bằng `content`, file/media và related hiện tại. |
| Category Dịch vụ | CMS/code legacy không chứng minh có danh mục dịch vụ; filter mock không đủ căn cứ. |
| Các block `whyNeed`, `process`, `benefits`, collaboration | Là cấu trúc mock cũ; rich text đáp ứng nội dung và giữ thiết kế. |
| Các subtype Tin tuyển dụng/khuyến mại/cổ đông với hàng chục field | Chưa có nguồn tương ứng rõ ràng trong form vận hành; trước mắt category + rich text/file đủ biểu diễn. |
| Role review/access review, translation review workflow | UI mock vượt backend và có thể trái quyết định bỏ quy trình duyệt nội dung; phải chốt nghiệp vụ bảo mật riêng. |

## Field frontend/CMS nên bỏ hoặc không đưa vào API production

- Workflow nội dung `pending_review`, `approved`, `rejected`, reviewer/approver và action gửi duyệt.
- `isOpenRegistration` khi chỉ lặp lại sự tồn tại của `link_dangky`.
- Manual event status khi có thể derive; đặc biệt không dùng mock hard-code làm nguồn.
- Category/filter Dịch vụ và category Sự kiện nếu không có nghiệp vụ nguồn.
- Working Draft version giả, Used-By giả, điểm chất lượng/audit hard-code, số lượng request giả.
- Các field presentation: accordion state, active tab, label, icon mặc định, placeholder, helper text, CSS/layout/responsive.
- Saved presets và các số liệu/demo không có backend thật.

## Rủi ro migration

1. `migration_report.json` vẫn có entity báo lỗi dù export report chứng minh có record; phải chạy lại migrate rehearsal và đối soát count/checksum.
2. Một số FK PostgreSQL đã được ghi tại `postgresql-schema-issues.md`; không bật constraint production trước khi dò orphan và xác nhận target đúng.
3. CSV/text relation (`related`, tags, scope user) có thể chứa ID trùng, rỗng hoặc mất entity; parser phải giữ thứ tự và xuất báo cáo orphan.
4. VI/EN là dataset độc lập; auto fallback/translate sẽ làm sai dữ liệu.
5. URL ảnh/file legacy có thể là path tương đối hoặc file thiếu; Media adapter phải giữ raw path và báo missing asset.
6. `end_time` ở các module không có nghĩa thống nhất. Chỉ riêng Event được chốt dùng làm thời gian kết thúc sau cleanup; không áp dụng hàng loạt cho module khác.
7. `created_time` có nơi từng được dùng như ngày đăng. Cần xác định per-module trước khi tạo `published_at` hoặc đổi semantics.
8. Quyền legacy là quyền trực tiếp theo user; chuyển máy móc thành role có thể làm tăng/giảm quyền. Phải so sánh effective permission từng user.
9. Gộp contact/order/product contact vào một bảng ngay có nguy cơ mất field đặc thù và ID nguồn. Ưu tiên read model/adapter.
10. Rich text legacy có HTML/embed/class cũ; cần sanitize tương thích và kiểm thử render, không strip mù làm mất nội dung.

## Những phần đã tương thích

- Core Tin tức/Danh mục tin, Sự kiện, Sản phẩm/Thiết lập sản phẩm, Dịch vụ, Menu.
- User profile và permission task/function/field legacy.
- Cấu hình chung, SEO chức năng và từ điển ngôn ngữ ở mức dữ liệu lõi.
- SEO từng entity, trạng thái Published, ordering, timestamps và phần lớn relations legacy.

## Kết luận trước triển khai

Không cần thay đổi PostgreSQL chỉ để khớp tên mock/UI. Việc đầu tiên của backend nên là định nghĩa DTO/adapter và kiểm thử migration cho các bảng hiện có. Event dùng lại `end_time`, không thêm `event_end_time`; các structured content mock khác vẫn phải được quyết định nghiệp vụ riêng trước khi thêm.

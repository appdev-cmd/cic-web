# Mapping field theo module

> Bảng dùng tên nhóm khi nhiều field có cùng quy tắc. “Không” ở cột DB mới nghĩa là không cần bổ sung schema ngoài PostgreSQL hiện tại. A/B/C/D theo quy ước của yêu cầu audit.

## Tin tức

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| title, alias | title, id/slug | title, alias | fs_news.title/alias | cic_news.title/alias | Tiêu đề, URL | A | Không | Không tạo `slug` |
| summary | shortDesc | summary | fs_news.summary | cic_news.summary | Tóm tắt | A | Không | DTO đổi tên |
| content | contentMarkdown | content | fs_news.content | cic_news.content | Nội dung bài | A | Không | Dùng rich text; không cần column Markdown riêng |
| category_id | category/subType | category_id | fs_news.category_id | cic_news.category_id | Danh mục | A | Không | subType lấy từ category relation nếu phù hợp |
| image | img, gallery | image | fs_news.image | cic_news.image | Ảnh đại diện | A | Không | Gallery có thể lấy từ Media/relation; chưa coi mock là column |
| file_upload | attachments/pdfUrl | file_upload | fs_news.file_upload | cic_news.file_upload | Tệp bài viết | A | Không | `pdfSize` lấy metadata file |
| tags, related IDs | tags, related*Ids | tags/news_related/products_related | các column tương ứng | các column tương ứng | Tag/liên kết thủ công | A | Không lúc đầu | Parse CSV/text; giữ thứ tự |
| author, views, date | author/views/date | author fields/hits/time | field legacy | field tương ứng | Metadata | A/B | Không | Author join user; date format ở DTO |
| recruitment/promotion fields | position, salary, deadline, programName... | Không có form tương ứng | Không có nguồn chắc chắn | Không có | Mock theo loại tin | C/D chưa chứng minh | Không | Giữ trong rich text hoặc bỏ UI trước khi đòi schema |
| SEO | seoTitle/seoDesc/seoKeywords | seo_* | fs_news.seo_* | cic_news.seo_* | SEO detail | A | Không | Đổi array keyword thành chuỗi contract ổn định |

## Trang nội dung

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| Legacy article | title/alias/content/image/seo | contents form | fs_contents* | cic_contents* | Trang bài viết cũ | A | Không | Bảo toàn khi migrate |
| Page | code/slug/name/status/version | Không có Page Builder | Không có | Không có | Trang theo template | D | Có, bảng mới | Module vẫn tên “Trang nội dung” |
| Section | section_type/config/order | Không có | Không có | Không có | Instance section cố định | D | Có, bảng mới | Type/layout định nghĩa bằng code; không Add/Delete/change type |
| Entity selection | productIds/newsIds/... | Một số CSV legacy rời rạc | Không có model chung | Không có | Chọn thủ công có thứ tự | D | Có relation/config có kiểm soát | Không auto selection |
| Rich article template | `legal.header` + `legal.content.richTextHtml` | title/content | fs_contents.title/content | cic_contents.title/content | Chính sách/điều khoản/trang cùng layout | A hoặc Page config | Không thêm column nội dung nhỏ | Chỉ hai section cố định: tiêu đề và một Rich Text body; heading/list/bảng/ảnh nằm trong body |

## Sự kiện

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| title/alias/summary/content/image | title/id/shortDesc/longDesc/img | cùng tên legacy | fs_event.* | cic_event.* | Nội dung chính | A | Không | longDesc → content rich text |
| time_event | startDate/date | time_event | fs_event.time_event | cic_event.time_event | Thời điểm sự kiện | A | Không | `date` là format UI |
| specific_time | date label | specific_time | fs_event.specific_time | cic_event.specific_time | Chuỗi thời gian trình bày | A | Không | Không dùng làm logic |
| place | location/address | place | fs_event.place | cic_event.place | Địa điểm | A | Không | address có thể nằm trong place/content |
| chu_de | eventType | chu_de | fs_event.chu_de | cic_event.chu_de | Chủ đề | A | Không | Không tạo danh mục sự kiện |
| link_dangky | isOpenRegistration | link_dangky | fs_event.link_dangky | cic_event.link_dangky | Đăng ký | B | Không | Có link hợp lệ ⇒ có CTA; không lưu boolean trùng nghĩa |
| status | upcoming/ongoing/past | Không có status chuẩn | Không có | Không có | Trạng thái theo thời gian | B một phần | Chưa | Với một mốc chỉ suy ra sắp/đã; “đang diễn ra” cần end thật mới có nghĩa |
| endDate | endDate | `end_time` từng bị code cũ ghi như updated time | fs_event.end_time | cic_event.end_time | Kết thúc sự kiện | Có, sau cleanup legacy | Không | CMS mới ghi đúng nghĩa; derive ongoing từ `time_event/end_time` |
| agenda/speakers/audience/documents/media | các object mock | Không có form | Không có nguồn chắc chắn | Không có | Chi tiết mở rộng | C/D chưa chứng minh | Không | Dùng content rich text/file/media relation trước |
| SEO/related/published/is_hot/show_in_home | cùng nghĩa UI | có | field legacy | field tương ứng | SEO/liên kết/hiển thị | A | Không | Draft/Published duy nhất |

## Sản phẩm và Thiết lập sản phẩm

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| name/title, alias, summary, content | name/description/overviewHtml/featuresHtml | name/title/alias/summary/content | fs_products.* | cic_products.* | Nội dung sản phẩm | A | Không | Các HTML tab có thể map vào content/field legacy đang dùng; không nhân column theo UI |
| category/type/brand/application | field/productType/brand/app | relation/select legacy | products category/type/manufactories/application | cic_* tương ứng | Phân loại | A | Không | Trả object qua join, lưu FK/relations |
| image/gallery/video/document | img/slides/videoUrl/documents | image/images/file/video legacy | fs_products + fs_products_images | cic_products + cic_products_images | Media sản phẩm | A/B | Không | Size file derive từ media |
| price | price string | price/contact logic | products/products_price | cic_products/cic_products_price | Giá | A/B | Không | “Liên hệ” là presentation/policy, không phải giá text mới |
| related data | related IDs | relation/CSV legacy | cụm relation | cụm cic_* | Nội dung liên quan | A | Không | Giữ thứ tự, chọn thủ công |
| sales owner | select sản phẩm/phạm vi | business/email legacy | fs_business, fs_email, fs_types_email | cic_business, cic_email, cic_types_email | Người phụ trách | A | Không | Không trộn với cấu hình mẫu email |
| UI metrics/audit/working draft | score, usedBy, version... | Không có | Không có | Không có | Trình bày demo | C | Không | Tính tại UI hoặc bỏ nếu không có backend thật |
| SEO/published/order/timestamps | cùng nghĩa | có | field legacy | field tương ứng | Quản trị | A | Không | Hai trạng thái Draft/Published |

## Dịch vụ

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| title/alias/summary/content/image | title/id/shortDesc/htmlContent/image | field tương ứng | fs_services.* | cic_services.* | Nội dung dịch vụ | A | Không | `htmlContent` → content rich text |
| tagline | tagline | Có thể dùng summary | fs_services.summary | cic_services.summary | Câu giới thiệu | A | Không | Không thêm column trùng nghĩa |
| category | category mock | CMS cũ không có nghiệp vụ danh mục dịch vụ độc lập | Không có nguồn đáng tin | Không có | Nhãn lọc mock | C/D chưa chứng minh | Không | Bỏ filter/category nếu không có nghiệp vụ |
| relatedProductIds | related products | products_related nếu field legacy có dùng | field legacy | field tương ứng | SP liên quan | A/B | Không | Chọn thủ công |
| whyNeed/process/benefits/collaboration/media blocks | object mock | Không có form tương ứng | Không có | Không có | Các khối nội dung | C | Không | Giữ trong content rich text để bảo toàn thiết kế |
| contact form/support text | formData/hard-code | contact/product contact/config | bảng request/config | bảng tương ứng | Tương tác/cấu hình chung | B | Không trên service | Form/setting cung cấp, không nhân vào dịch vụ |

## Menu và Media

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| Menu group/item/name/link/parent/order/published | nav tree | menus CMS | fs_menus_groups/items | cic_menus_groups/items | Cây menu | A | Không | Breadcrumb compose từ route/content |
| Menu target/visibility | target/schedule/rules | một phần legacy | menus item fields | cic_menus_items fields | Điều hướng/hiển thị | A/B | Không trước | UI state không lưu DB |
| Asset path/name/type/size/dimensions | media item | image/gallery/video/upload | nhiều bảng/file | nhiều cic_* | Tệp legacy | A/B | Không để đọc legacy | Adapter hợp nhất nguồn |
| Folder/asset/version/variant/license/usage | mock Media mới | Không có model chung | Không có | Không có | Media library chuẩn hóa | D | Có bảng mới nếu giữ chức năng | Không sửa/xóa file legacy khi chưa đối soát |

## CTA, Biểu mẫu, Yêu cầu khách hàng, Mẫu email

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| CTA generic | label/actionConfig/style/status | Nút hard-code theo module | Không có bảng generic | Không có | CTA tái sử dụng | D | Có bảng mới | Style option là enum code, không lưu CSS/JS |
| Form definition | fields/submitConfig/status | Form hard-code | Không có schema form động | Không có | Form tái sử dụng | D | Có bảng + field relation | Không lưu JSX; webhook/redirect phải kiểm soát quyền |
| Request common | source/values/status/assignee | contact/order/product contact | fs_contact/fs_order/fs_product_contact | cic_contact/cic_order/cic_product_contact | Yêu cầu thực tế | A qua adapter | Không bắt buộc gộp ngay | Giữ source ID/type; không mất field riêng từng loại |
| Request notes/logs | notes/activity | hạn chế/rải rác | không có model chung | không có | Theo dõi xử lý | D nếu vận hành thật | Có bảng con | Không nhét JSON lịch sử vào record nguồn |
| Email template | workspace/event/audience/subject/body/status | Không có thư viện template tương ứng | fs_email/types_email là nhân viên/routing | cic_email/types_email | Nội dung email | Không | Có bảng mới | Không dùng nhầm bảng email người phụ trách |

## Quản trị

| UI/CMS field | Mock field | CMS cũ | DB cũ | PostgreSQL mới | Ý nghĩa | Mapping được? | Cần DB mới? | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| User profile | fullName/avatar/status | full_name/fname/lname/image/published | fs_users | cic_users | Người dùng | A | Không core | avatar → image; status map published trước |
| 2FA/lock/security status | mock security | Không đầy đủ | Không có | Không có | Bảo mật tài khoản | D nếu triển khai thật | Có column/table tối thiểu | Không hiển thị số liệu giả production |
| Direct permissions | task/function/field | có | fs_permission*, fs_users_permission* | cic_permission*, cic_users_permission* | Quyền legacy | A | Không | Bảo toàn hiệu lực từng user |
| Role/version/scope/review | mock role governance | nhóm/quyền cũ không tương đương đầy đủ | thiếu model role chuẩn | thiếu | RBAC mới | D một phần | Có bảng mới nếu giữ UI | Bỏ action review/approve nội dung; access review là nghiệp vụ security khác |
| System setting key/value | group/value | config | fs_config | cic_config | Cấu hình chung | A | Không core | Label/help/schema có thể khai báo trong code |
| Function SEO | routeKey/path/title/description/indexable | config modules | fs_config_modules | cic_config_modules | SEO cấp route/module | A/B | Không | Cấp bậc compose từ route/module/view |
| Translation key/value/locale | translation item | languages text/admin/content | fs_languages* | cic_languages* | Từ điển UI | A | Không core | reviewer/workflow mock không áp dụng |
| Activity log | actor/action/entity/before/after/IP | Không có audit đúng nghĩa | fs_history khác nghiệp vụ | cic_history khác nghiệp vụ | Audit CMS | D | Có bảng mới | Không lưu secret; append-only |
| Trash item/snapshot/source/deletedBy | trash mock | Không có soft-delete chung | Không có | Không có | Xóa/khôi phục | D | Có bảng mới | Bù cho entity không có `deleted_at`; không thay audit log |

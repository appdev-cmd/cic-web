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

### Field Usage Map — audit Tin tức 2026-09-10

- `CMS_EDITABLE`: `title,alias,category_id,summary,content,image,video,file_upload,tags,news_related,products_related,ordering,published,is_hot,show_in_homepage,start_time,end_time,seo_title,seo_keyword,seo_description`; `other_languages1,tawk_to` chỉ editable nếu giữ đúng form đã duyệt, không dùng làm i18n fallback hoặc script tùy ý.
- `CMS_OPERATIONAL`: `id,published,is_hot,show_in_homepage,ordering,category_id,created_time,updated_time,author_id,author_last_id`; category/user names là joined read model.
- `PUBLIC_READ`: `id,title,alias,summary,content,image,video,file_upload,tags,category_id,published,is_hot,show_in_homepage,ordering,created_time,hits,news_related,products_related,seo_title,seo_description`; chỉ qua published/category-visible projection.
- `SYSTEM_MANAGED`: `id,hits,created_time,updated_time,author_id,author_last_id`; `creator/editor/author/author_last` là legacy snapshot, không nhận identity từ client.
- `RELATION`: `category_id → cic_news_categories*.id`, `author_id/author_last_id → cic_users.id`; `news_related/products_related` là ordered legacy text contract cần parse, validate tồn tại, bỏ trùng/tự tham chiếu và không tự tạo junction table.
- `AUDIT`: shared Audit Writer/history; không dùng `action_id/action_name/action_time/action_username` làm audit authority mới.
- `LEGACY_UNUSED`: `category_alias,category_id_wrapper,category_alias_wrapper,category_published,is_slide,is_new_video,is_video,display_title,display_column,tags_group,rating_count,rating_sum,comments_*,source_news,source_website,icon,optimal_seo,actflg,ctdusr,ctdwks,ctddtm,mdfusr,mdfwks,lstmdf,cdtpgm,mdfpgm` khi không có use case đã duyệt.
- `UNKNOWN`: semantics hiện tại của `action_id` và mức còn sử dụng thật của `is_new`; preserve nguyên giá trị, không expose input/default/cleanup.

Projection bắt buộc: public list; public detail; CMS list; CMS form/detail; category/user/news/product lookup; full-row Trash snapshot. Không `select *` trong application query và update phải có PATCH ownership.

### Invariant dữ liệu Tin tức — áp dụng 2026-09-10

- Trong cùng một locale, `lower(btrim(alias))` phải unique và alias không được NULL/rỗng; VI/EN là hai dataset độc lập.
- Canonical duplicate: published trước, `start_time` (fallback `created_time/updated_time`) mới hơn, rồi ID lớn hơn. Non-canonical giữ bài và published, đổi alias thành `normalized-old-alias-id`.
- URL legacy trùng vốn ambiguous: canonical giữ URL cũ; các bài còn lại có URL mới, không tạo nhiều redirect từ cùng source URL.
- Mỗi locale tối đa 4 Hot và 4 Home, hai vùng độc lập. `ordering ASC` là ưu tiên hiện hành, sau đó date DESC và ID DESC; overflow chỉ tắt đúng placement flag.
- Mutation bật placement phải gọi khóa–đếm trong cùng PostgreSQL transaction trước write; client validation không phải enforcement.

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

### Field Usage Audit — Sản phẩm (2026-09-09)

| Field/nhóm | Phân loại | Contract |
|---|---|---|
| `id` | SYSTEM_MANAGED; RELATION | DB identity; read-only; khóa cho junction, gallery, audit và trash |
| `name`, `alias`, `code`, `summary` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Tên/URL/mã/tóm tắt; alias mới hoặc sửa phải unique, alias rỗng legacy không tự backfill |
| `description`, `feature_details`, `video`, `link_video` | CMS_EDITABLE; PUBLIC_READ | Rich HTML/video cho detail; validate/sanitize server trước khi ghi/render |
| `image`, `icon` | CMS_EDITABLE; PUBLIC_READ; RELATION_MEDIA | Media chính; tiếp nhận Media ID/path theo resolver chuẩn, không giả quan hệ |
| `price`, `price_old`, `currency` | CMS_EDITABLE; PUBLIC_READ | Giá/presentation; không invent unit/origin/availability từ mock |
| `published`, `is_hot`, `teamview`, `ordering`, `landing_page` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Publish/featured tối đa 6/order và behavior public; scheduled/version state không tự thêm |
| `seo_title`, `seo_keyword`, `seo_description` | CMS_EDITABLE; PUBLIC_READ | Metadata riêng Product; Function SEO chỉ consume/report |
| catalogue/driver + `file_name1..6`, `file_download1..6`, `link_download1..6` | CMS_EDITABLE; PUBLIC_READ; RELATION_MEDIA | File/link legacy đúng form; projection tường minh, type/size derive; preserve slot không thuộc PATCH |
| `cic_products_categories_rel*` | RELATION | Authority N-N category; replace transactionally theo form ownership |
| `cic_products_applications_rel*` | RELATION | Authority N-N application; không dùng `application_name` làm authority |
| `cic_products_related_rel*` | RELATION | Quan hệ có hướng, cấm self/duplicate, preserve ordering |
| `types_id`, `manufactory` | RELATION | Product type FK đúng locale; brand hiện là numeric ID trong varchar, validate bằng master thật |
| `cic_products_images*` | RELATION; PUBLIC_READ | Gallery theo `record_id/ordering`; không lưu mock gallery array vào Product row |
| `created_time`, `edited_time`, `user_id` | SYSTEM_MANAGED; AUDIT | Server/auth quản lý; không tin actor từ client |
| `category_id`, `application`, `products_relates`, `*_name`, `*_alias` cache legacy | LEGACY_UNUSED như authority; UNKNOWN cleanup | Preserve compatibility; không select/write mặc định hoặc đồng bộ ngược tùy tiện |
| commerce/location/mail/hit/style fields không có form/use case duyệt | LEGACY_UNUSED/UNKNOWN | Không expose, validate, default, NULL hoặc cleanup; Trash snapshot phải giữ nguyên |

Projection riêng: public list chỉ card/filter/order fields + published relations; public detail thêm rich content/gallery/files/related/SEO/contact; CMS list chỉ columns/filter/status/derived completeness; CMS form/detail chỉ form-owned fields + relation IDs/metadata; relation lookup chỉ `id/name/published`; Trash snapshot full Product row và toàn bộ junction/gallery liên quan để restore lossless. Không `select *` trong application query.

Implementation 2026-09-09 dùng explicit projection theo các contract trên. CMS PATCH ghi `price` và `tags` từ đúng control form, không ghi đè `price_old` hay cache/commerce/location legacy; create chỉ cấp các cột system-required không có default. Quan hệ inbound ngoài ownership Product được Trash guard, không tự xóa.

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

### Field Usage Audit — Danh mục tin tức (2026-09-10)

| Field | Phân loại | Contract |
|---|---|---|
| `id` | SYSTEM_MANAGED; RELATION | Identity số, DB/server quản lý; không nhận ID tùy ý từ form create |
| `name`, `title`, `alias`, `summary` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Nội dung form và URL/nhãn danh mục; alias bắt buộc, chuẩn hóa và unique độc lập theo VI/EN |
| `parent_id` | CMS_EDITABLE; RELATION; PUBLIC_READ | Self-FK đúng bảng locale; chặn self/descendant/cycle; `NULL` là node gốc |
| `ordering`, `published`, `show_in_homepage` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Sắp xếp, trạng thái và placement đúng functional requirement; public chỉ đọc node published |
| `image` | CMS_EDITABLE; PUBLIC_READ; RELATION | Form reference có Media selector; giữ raw legacy path để đọc, upload mới dùng Media foundation |
| `seo_title`, `seo_keyword`, `seo_description` | CMS_EDITABLE; PUBLIC_READ | Form reference và functional requirement xác nhận SEO/search metadata |
| `level`, `list_parents`, `alias_wrapper` | SYSTEM_MANAGED; RELATION | Derive lại từ cây trong transaction khi tạo/chuyển cha; không cho browser ghi tùy ý |
| `created_time`, `updated_time`, `ctdusr`, `ctdwks`, `ctddtm`, `mdfusr`, `mdfwks`, `lstmdf`, `cdtpgm`, `mdfpgm` | AUDIT; SYSTEM_MANAGED | Timestamp/legacy provenance do server giữ; không thành arbitrary form input |
| `display_title`, `display_tags`, `display_related`, `display_created_time`, `display_category`, `display_comment`, `display_sharing` | SYSTEM_MANAGED cho create; UNKNOWN về ownership UI | Live schema bắt buộc và toàn bộ row hiện là `true`; backend create phải dùng compatibility policy đã chứng minh, PATCH thường không ghi đè |
| `icon`, `icon_font`, `name_display`, `is_comment`, `display_summary`, `products_related`, `estore_id`, `category_id`, `actflg` | UNKNOWN/LEGACY_UNUSED | Không có capability/form/consumer Next được duyệt; không expose, validate, default, NULL hoặc cleanup; Trash snapshot phải preserve |
| `cic_news*.category_id` | RELATION | FK authority bài viết→danh mục cùng locale; dùng để đếm usage và guard delete |

Projection: public category/navigation `id,name,title,alias,parent_id,ordering,image,summary,seo_*` với `published=true`; CMS list `id,name,title,alias,parent_id,level,ordering,published,show_in_homepage,updated_time` + `COUNT(cic_news*.id)`; CMS form/detail chỉ field form-owned + hierarchy/audit metadata; relation lookup `id,name,alias,parent_id,published`; Trash snapshot full row để restore lossless. Không `select *` trong application query.

Live audit 2026-09-10: VI 10 category (9 published), EN 9 (9 published); 4 node con mỗi locale; không alias rỗng/trùng chuẩn hóa, không orphan/cycle. `cic_news` có 1.553 row dùng đủ 10 category VI; `cic_news_en` có 300 row dùng đủ 9 category EN. FK bài viết và self-tree đều đúng workspace.

### Field Usage Audit — Danh mục sản phẩm (2026-09-04)

| Nhóm field | PostgreSQL | Phân loại | Contract/projection |
|---|---|---|---|
| `id` | `cic_products_categories*.id` | SYSTEM_MANAGED; RELATION | Identity read-only; create để DB sinh, không nhận từ form |
| `name`, `alias`, `description` | hai bảng category VI/EN độc lập | CMS_EDITABLE; PUBLIC_READ | Form/nội dung danh mục; alias validate riêng từng workspace và dùng cho public URL/filter |
| `parent_id` | self-FK đúng bảng locale | CMS_EDITABLE; RELATION | Chọn cha–con; chặn self/descendant/cycle; `NULL` là node gốc |
| `ordering`, `published` | hai bảng category | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | List/sort/bật-tắt; public chỉ đọc `published=true` |
| `image`, `icon`, `banner`, `published_image` | hai bảng category | UNKNOWN | DB có nhưng CMS functional doc/form category và public category surface chưa chứng minh ownership; không đưa vào input/projection mặc định |
| `seo_title`, `seo_keyword`, `seo_description`, `link` | hai bảng category | UNKNOWN | DB có nhưng chưa có form/reference category detail được duyệt; `link` vẫn là field riêng, không suy thành canonical |
| `show_in_homepage`, `show_in_footer` | hai bảng category | UNKNOWN | Chưa có control/consumer category được chứng minh; không tự ghi hoặc expose chỉ vì cột tồn tại |
| `created_time`, `updated_time` | hai bảng category | AUDIT; SYSTEM_MANAGED | Server/trigger quản lý; read-only trong detail/history |
| `level`, `root_id`, `root_alias`, `list_parents`, `alias_wrapper` | hai bảng category | SYSTEM_MANAGED | Derive/maintain từ cây trong transaction; không cho browser ghi tùy ý |
| `total_products` | hai bảng category | LEGACY_UNUSED như authority | Usage count phải `COUNT` từ relation; chỉ giữ cache legacy nguyên trạng đến khi có reconciliation |
| `product_id`, `category_id` | `cic_products_categories_rel*` | RELATION | Authority N-N Product↔Category; không parse/ghi lại CSV `cic_products*.category_id` trong contract mới |
| `code` | hai bảng category | CMS_OPERATIONAL; UNKNOWN về write ownership | UI list hiển thị mã nhưng save mock lại ghi alias; cần chốt semantics trước mutation, không tự default/ghi đè |
| `summary` | hai bảng category | UNKNOWN | Chưa có bằng chứng form/public surface; không đưa vào contract mặc định |
| `vat`, `is_accessories`, `tablename`, `tags_group`, `promotion_main`, `hotline`, `promotion`, `price`, `type`, `sizes` | hai bảng category | LEGACY_UNUSED | Không đưa vào UI/input/validation, không NULL/default/cleanup |

Projection tối thiểu: public filter/list `id,name,alias,parent_id,ordering` với `published=true`; CMS list `id,name,alias,code,parent_id,level,ordering,published,updated_time` + relation count; CMS form/detail chỉ `id,name,alias,description,parent_id,ordering,published` + audit metadata; relation lookup `id,name,alias,parent_id,published`. Các field UNKNOWN không nằm trong projection mặc định. Không dùng `select *`.

### Field Usage Audit — Hãng sản xuất (2026-09-04)

| Field | Phân loại | Contract |
|---|---|---|
| `id` | SYSTEM_MANAGED; RELATION | DB sinh; Product lưu ID legacy trong `manufactory`; không nhận ID từ form create |
| `name`, `alias` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Tên và tên hiệu; alias sinh/validate theo workspace, unique chuẩn hóa |
| `ordering`, `published` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Sort/trạng thái; public chỉ expose published |
| `created_time`, `updated_time` | SYSTEM_MANAGED; AUDIT | Server/trigger quản lý; read-only |
| `image`, `country`, `website`, `show_in_homepage` | LEGACY_UNUSED | Có trong schema/mock type nhưng không có control trong form React reference; không đưa vào input/projection/UI, không default/NULL/ghi đè |
| `description`, `seo_*`, `content` | UNKNOWN | Schema có nhưng form/reference hãng đã duyệt chưa chứng minh ownership; không input/update/projection mặc định |
| `code`, `tablenames`, `first_toll`, `prefix_name`, `old_id`, `color_code`, `is_retail`, `is_common` | LEGACY_UNUSED/UNKNOWN | Giữ nguyên, không default/NULL/cleanup |

Projection: public filter `id,name,alias,ordering` + `published=true`; CMS list/form `id,name,alias,ordering,published,created_time,updated_time` + usage count; Product relation lookup `id,name,published`. Không `select *`. Trash lifecycle được phép snapshot đầy đủ row để khôi phục nguyên trạng nhưng không expose các cột legacy thành field form.

### Field Usage Audit — Lĩnh vực ứng dụng (2026-09-08)

| Field | Phân loại | Contract |
|---|---|---|
| `id` | SYSTEM_MANAGED; RELATION | DB sinh; Product lưu CSV ID trong `application`; không nhận ID từ form create |
| `name`, `alias` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Tên và tên hiệu; alias application tự sinh/read-only trong UI, server validate unique theo từng workspace |
| `ordering`, `published` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Sort/trạng thái; public chỉ expose published |
| `created_time`, `updated_time` | SYSTEM_MANAGED; AUDIT | Server/trigger quản lý; chỉ đọc cho history/detail nếu cần |
| `cic_products*.application` | RELATION | Compatibility CSV của ID số; parser trim/dedupe/validate; ownership ghi thuộc Product, Application chỉ đọc để usage/guard; không còn là relation authority sau khi junction được materialize |
| `cic_products_applications_rel*.(product_id,application_id,ordering)` | RELATION; SYSTEM_MANAGED | Authority quan hệ N-N hiện tại; composite identity, FK và ordering do repository/migration quản lý, không cho nhập trực tiếp như arbitrary form field |
| `image`, `color_code` | UNKNOWN | DB có nhưng form React không render icon/color control và live data đều rỗng; không đưa vào input/projection/default |
| `sector_group`, `color_badge`, `icon` | LEGACY_UNUSED đối với persistence | Chỉ có trong type/mock payload, không phải cột/form-owned field; remove khỏi Application input contract |
| `description`, `seo_title`, `seo_keyword`, `seo_description`, `content` | UNKNOWN | Không có control/consumer được chứng minh; không input/update/projection mặc định |
| `code`, `tablenames`, `first_toll`, `show_in_homepage`, `prefix_name`, `old_id`, `is_retail`, `is_common` | LEGACY_UNUSED/UNKNOWN | Giữ nguyên; không expose, default, NULL, ghi đè hay cleanup trong module |

Projection: public filter/lookup `id,name,alias,ordering` với `published=true`; public Product list/detail đọc relation junction rồi map Application published; CMS list/form `id,name,alias,ordering,published,created_time,updated_time` + usage count từ junction; relation lookup `id,name,alias,published`. Không `select *`. Trash có thể snapshot full row và relation nội bộ để restore lossless nhưng không biến field legacy thành input.

Re-audit trực tiếp 2026-09-08: master VI/EN có 13/11 row; junction có 249/89 relation và 0 orphan. VI `8`, EN `13`,`14` hiện là stub unpublished, alias rỗng, giữ lần lượt 7/1/1 relation. Preserve nguyên trạng và loại khỏi public/CMS selector mặc định; không tự sửa tên/alias cho tới khi có nguồn dữ liệu có thẩm quyền.

### Field Usage Audit — Loại sản phẩm (2026-09-08)

| Field | Phân loại | Contract |
|---|---|---|
| `id` | SYSTEM_MANAGED; RELATION | DB sinh; `cic_products*.types_id` tham chiếu FK; không nhận ID tùy ý khi create type |
| `name`, `alias` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Tên/tên hiệu theo workspace; alias tự sinh/read-only ở UI và phải unique theo chuẩn hóa trong từng bảng |
| `published`, `ordering` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Trạng thái/thứ tự; public/selector mới chỉ expose published; inactive vẫn resolve được cho Product cũ |
| `image` | UNKNOWN / LEGACY_UNUSED | React Product Settings không có control Biểu tượng và form được duyệt phải giống các form master-data cùng nhóm; không đưa vào input/projection, không ghi đè, Trash vẫn bảo toàn |
| `created_time`, `updated_time` | SYSTEM_MANAGED; AUDIT | Server/trigger quản lý, read-only; `updated_time` legacy hiện NULL và chỉ ghi khi mutation thật xảy ra |
| `cic_products*.types_id` | RELATION | Authority quan hệ đơn Product→Type đúng locale; validation phải kiểm tra type tồn tại/active khi gắn mới |
| `cic_products*.types_name` | LEGACY_UNUSED như authority; UNKNOWN về cleanup | Cache/chuỗi legacy, live EN có 148 mismatch; không dùng trong domain/public/CMS mapping, không NULL/xóa trong task module |
| `description` | UNKNOWN | DB có nhưng React form/list và functional requirement không chứng minh ownership; không input/update/projection mặc định |
| `tablenames` | LEGACY_UNUSED | Không có use case CMS/public/relation/audit; preserve nguyên trạng |
| `type_code`, `requires_license_key`, `pricing_model_default` | LEGACY_UNUSED đối với persistence | Chỉ có trong type/mock/default, không có cột DB và không có control React; không tạo field/validation/default |

Projection: public filter/lookup `id,name,alias,ordering` với `published=true`; public Product list/detail join `types_id` và chỉ trả identity/label cần dùng; CMS list `id,name,alias,published,ordering,created_time,updated_time` + usage count; CMS form/detail không thêm field ngoài form chung; relation lookup `id,name,alias,published`. Trash được snapshot full row nội bộ để restore lossless nhưng không expose `image/description/tablenames` thành input. Không `select *`.

Live DB 2026-09-08: 4 row VI + 4 row EN, tất cả published; 0 alias/name rỗng, 0 FK orphan; 92/32 Product VI/EN có `types_id` NULL. Usage VI `1:211`, `2:72`, `5:0`, `6:0`; EN `1:143`, `2:17`, `5:0`, `6:0`. Hai bảng chỉ có PK và index alias thường, chưa có unique normalized index.

Implementation 2026-09-08 giữ đúng projection/ownership trên: CMS chỉ PATCH `name/alias/ordering/published`; public Product join bằng `types_id`; Trash snapshot full row để bảo toàn `image/description/tablenames`. Migration unique alias đã áp dụng và roundtrip DB thật pass.

### Field Usage Audit — Người phụ trách kinh doanh (2026-09-09)

| Field | Phân loại | Contract |
|---|---|---|
| `id` | SYSTEM_MANAGED; RELATION | DB sinh; read-only; identity dùng cho audit/trash và lookup |
| `name`, `alias` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Tên đầu mối và alias; alias có thể tạo từ tên nhưng form React cho phép chỉnh; validate unique theo workspace |
| `phone`, `Skype`, `Zalo` | CMS_EDITABLE; PUBLIC_READ | Thông tin liên hệ; public chỉ trả cho đầu mối published đang gắn đúng Product |
| `published`, `ordering` | CMS_EDITABLE; CMS_OPERATIONAL; PUBLIC_READ | Bật/tắt và sắp xếp; đầu mối inactive không vào lựa chọn mới/public nhưng assignment legacy vẫn được preserve |
| `lienhe`, `lienhe_kd`, `lienhe_kt`, `lienhe_kdmb`, `lienhe_kdmn` | CMS_EDITABLE; RELATION; PUBLIC_READ | Năm bucket Product ID dạng CSV legacy; parse/serialize tập ID numeric có thứ tự, validate ID mới, PATCH theo ownership; preserve orphan hiện hữu nếu không bị người vận hành sửa khỏi bucket |
| `created_time`, `updated_time` | SYSTEM_MANAGED; AUDIT; CMS_OPERATIONAL | Server/trigger quản lý; list/detail read-only |
| `khuvuc`, `khuvuc_name`, `products` | UNKNOWN | Có dữ liệu legacy nhưng React không có control; functional role/khu vực đang được biểu diễn bằng bucket `lienhe*`; không expose/input/default/NULL |
| `image`, `description`, `content`, `seo_*`, `show_in_homepage` | UNKNOWN/LEGACY_UNUSED | Không có surface/form được duyệt; image/description hiện trống; preserve khi PATCH/Trash restore |
| `code`, `tablenames`, `first_toll`, `prefix_name`, `old_id`, `color_code`, `is_retail`, `is_common` | LEGACY_UNUSED/UNKNOWN | Không thuộc UI/input/validation mặc định; không cleanup hoặc ghi đè |
| `usage_count`, `updated_by` | derived, không phải cột entity | Usage derive từ union năm bucket; actor lấy server auth và ghi qua Audit Writer |

Projection tối thiểu: public Product contact `id,name,phone,Skype,Zalo,ordering` sau khi lọc `published=1` và resolve bucket theo Product; CMS list `id,name,phone,Skype,Zalo,published,ordering,created_time` + derived usage; CMS form/detail thêm `alias` và năm `lienhe*`; relation lookup Product chỉ `id,name,published`. Trash snapshot full row nội bộ để restore lossless. Không `select *` trong application query.

Live DB 2026-09-09: VI 25 row/23 published, EN 18/14; 0 name/alias/phone rỗng. Năm bucket có 832 token VI và 423 token EN, toàn bộ numeric; orphan lần lượt 2 và 4 token. `khuvuc/khuvuc_name/products` có dữ liệu trên 8/8/7 row mỗi workspace và phải được giữ nguyên.

Implementation 2026-09-09 dùng đúng projection trên. Mutation chỉ ghi `name/alias/phone/Skype/Zalo/ordering/published` và năm bucket `lienhe*`; boolean UI được map rõ sang `smallint` 0/1. Public Product contact chỉ đọc staff published và tên/số điện thoại cần render. Roundtrip DB thật xác nhận giữ nguyên orphan và các field legacy ngoài ownership; Trash snapshot full row và restore inactive.

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
| User login identity | username/email/password input | username/email/password | fs_users | Supabase Auth + cic_users identity bridge | Tài khoản đăng nhập CMS | A/B | Không | Password/credential chỉ thuộc Supabase Auth; không đọc/trả `cic_users.password`, không ghi secret vào audit |
| User lifecycle | status/reason | published | fs_users | cic_users.account_status + cic_user_status_history | active/suspended/deactivated/pending_invite và lịch sử | B | Không | `published` chỉ compatibility mirror; reason/history/actor do server quản lý |
| User role | primaryRoleId/effective access | quyền trực tiếp legacy | fs_users_permission* | cic_user_roles → cic_roles → cic_role_permissions | Vai trò và quyền hiệu lực | B | Không | UI hiện chọn một role chính; không sửa quyền trực tiếp legacy trong Người dùng |
| User agency/category scope | agencies/product/news categories | CSV IDs | fs_users | cic_users.agencies/products_categories/news_categories | Phạm vi phụ trách legacy | A | Không ở đợt này | Giữ PATCH-owned CSV để tương thích; không suy thành quan hệ chuẩn hoặc set rỗng ngoài form ownership |
| User security summary | 2FA/password changed/failed login/security log | không đầy đủ | thiếu | auth provider + cic_users flags + cic_security_events | Bảo mật tài khoản | D có điều kiện | Không core | Chỉ hiển thị/cho thao tác khi có producer/provider thật; không dùng mock làm dữ liệu production |
| User online/visits | online/last visit/count | status_online/last_visit_time/nums_visit | fs_users | cic_users fields | Presence và lịch sử truy cập | A/C | Không | Read-only; cần auth/session producer xác minh trước khi coi là realtime |
| 2FA/lock/security status | mock security | Không đầy đủ | Không có | Không có | Bảo mật tài khoản | D nếu triển khai thật | Có column/table tối thiểu | Không hiển thị số liệu giả production |
| Direct permissions | task/function/field | có | fs_permission*, fs_users_permission* | cic_permission*, cic_users_permission* | Quyền trực tiếp legacy | C (legacy read-only) | Không | Theo cutover đã duyệt, không còn là authority của RBAC mới; giữ nguyên dữ liệu, không đưa vào form/mutation và chưa cleanup |
| Role core | code/name/description/status/protected/permission/assignment | nhóm/quyền cũ không tương đương đầy đủ | fs_groups, fs_users_groups, fs_groups_permission | cic_roles, cic_role_permissions, cic_user_roles | RBAC mới | B | Không core | Live 2026-09-03: 1 role, 1 assignment, 76 task, 0 role-permission; Next chỉ nối list/editor |
| Role version/scope | version/draft/active/workspace scope | không có bằng chứng tương đương | thiếu | không cần cho scope đã duyệt | Governance nâng cao | C | Không | Out of scope theo quyết định dùng UI đơn giản hiện tại; không tạo bảng |
| SoD/access review | issue/severity/owner/reviewer/cycle/decision | không có bằng chứng tương đương | thiếu | không cần cho scope đã duyệt | Governance nâng cao | C | Không | Out of scope; loại runtime mock/disconnected UI khi implement, không tạo bảng |
| System setting key/value | group/value | config | fs_config | cic_config | Cấu hình chung | A | Không core | Label/help/schema có thể khai báo trong code |
| Function SEO | routeKey/path/title/description/indexable | config modules | fs_config_modules | cic_config_modules | SEO cấp route/module | A/B | Không | Cấp bậc compose từ route/module/view |
| Translation key/value/locale | translation item | languages text/admin/content | fs_languages* | cic_languages* | Từ điển UI | A | Không core | reviewer/workflow mock không áp dụng |
| Activity log | actor/action/entity/before/after/IP | Không có audit đúng nghĩa | fs_history khác nghiệp vụ | cic_history khác nghiệp vụ | Audit CMS | D | Có bảng mới | Không lưu secret; append-only |
| Trash item/snapshot/source/deletedBy | Next runtime không còn mock | Không có soft-delete chung | Không có | `cic_trash_items` (20 cột, live 0 row sau khi dọn test) | Xóa/khôi phục | D + Projects adapter | Bảng trung tâm đã secured; adapter các module khác pending | `id/workspace/entity_type/entity_id/module/title_snapshot/original_url/status/purge_after/restore_state/is_legal_hold` phục vụ identity/operation; `payload_snapshot` server-only, list không select và detail chỉ allowlist. Actor/time/reason dùng Audit Writer. RLS bật, browser revoke, 4 operational indexes, 3 constraint validated; Projects VI roundtrip pass. |

## Media field usage audit — 2026-09-04

| Nhóm field | PostgreSQL thật | Phân loại | Projection / ghi chú |
|---|---|---|---|
| `id`, `filename`, `media_type`, `mime_type`, `storage_path`, `thumbnail_path`, `file_size_bytes`, dimensions/duration | `cic_media_assets` | SYSTEM_MANAGED; CMS_OPERATIONAL | List/detail/picker chỉ select field cần dùng; URL derive qua Storage resolver, không trả raw row hoặc `select *` |
| `title`, `description`, `alt_text`, `caption`, `locale` | `cic_media_asset_translations` | CMS_EDITABLE; PUBLIC_READ | Một binary dùng metadata VI/EN riêng; public/picker join đúng locale, không fallback chéo workspace |
| `credit_author`, `license_type`, `license_expiry`, `tags` | `cic_media_assets` | CMS_EDITABLE; CMS_OPERATIONAL | Validate allowlist/date/tags; không suy từ mock |
| `workflow_status`, `deleted_at` | `cic_media_assets` | CMS_OPERATIONAL; SYSTEM_MANAGED | Filter/publishability/trash; mutation phải qua permission + service, không nhận tùy ý từ browser |
| `created_by/at`, `updated_at`, translation `updated_by/at` | asset/translation | AUDIT | Actor từ server auth; owner name/avatar join `cic_users`, không snapshot |
| folder `workspace/name/alias/icon/ordering` và junction ordering | folder tables | CMS_EDITABLE; RELATION | “Tất cả thư mục” là filter ảo; count/folder name derive |
| album `workspace/title/alias/description/cover/status/ordering` và item position | album tables | CMS_EDITABLE; RELATION | Cover phải thuộc album; count/cover URL derive |
| version fields | `cic_media_versions` | SYSTEM_MANAGED; AUDIT | Replace giữ asset ID; version history do server tạo, không cho sửa trực tiếp |
| variant/focal/processing fields | `cic_media_variants` | SYSTEM_MANAGED | Chỉ processor/crop flow ghi; preset rows hard-code hiện tại không phải dữ liệu thật |
| `legacy_source_table/id/path` | `cic_media_assets` | SYSTEM_MANAGED | Trace/backfill; không đưa vào form/public projection |
| `used_by_count/refs`, `metadata_status`, issue rows, folder/owner names, absolute URLs | không phải column | RELATION / derived | Query relation/reference registry hoặc derive; không tạo snapshot/column chỉ để khớp mock |
| toàn bộ field nghiệp vụ trong `cic_image*` ngoài trace/import | legacy tables | LEGACY_UNUSED hoặc UNKNOWN đối với Media Library mới | Không đưa vào UI/input, không default/null/cleanup; giữ nguyên để đối soát |

Live implementation 2026-09-04: đủ 8 bảng `cic_media_*`, RLS + policy SELECT `media.view`, permission catalog `view/create/edit/delete/replace`, private bucket `cms-media` và bốn object policy. Runtime dùng explicit projection, signed URL, PATCH-owned mutations, locale translation, CTA/form used-by lookup, public-ready resolver và typed Trash snapshot/restore; không ghi vào các field legacy trace. Legacy backfill và chuyển consumer raw path sang Media ID vẫn là integration riêng của module sở hữu nội dung.

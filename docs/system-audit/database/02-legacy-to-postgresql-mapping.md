# Legacy → Target PostgreSQL mapping

## Quy tắc chung

| Legacy type/value | Target | Transform |
|---|---|---|
| `int` PK | `integer` identity-compatible | Insert explicit legacy ID; reset sequence về max+1 |
| `tinyint(1)`/flag 0,1 | `boolean` | `0 → false`, `1 → true`, giá trị khác/NULL vào exception report |
| `datetime`/timestamp | `timestamptz` | Parse theo timezone nguồn đã chốt; không dùng timezone máy chạy |
| `varchar` content dài | `text` | Copy nguyên UTF-8; không truncate |
| CSV IDs | raw varchar/text + relation backfill | Copy raw trước; parse trim/dedupe/keep order sau |
| relative file path | varchar/text + Media mapping | Copy nguyên path; không đòi file tồn tại để giữ record |
| zero/invalid date | NULL + exception report | Không tự thay bằng thời gian hiện tại |

## Mapping các bảng phục vụ CMS/website mới

Các cột không liệt kê trong bảng nhóm vẫn **direct-copy cùng tên** và được bảo toàn.

| Legacy table | Legacy column | Target table | Target column | Transform | Nullable | Default | Notes |
|---|---|---|---|---|---|---|---|
| `fs_news` | `id` | `cic_news` | `id` | direct, preserve ID | No | none | reset identity |
| `fs_news` | `title`,`alias` | `cic_news` | same | UTF-8 direct | theo source | none | duplicate alias report trước unique |
| `fs_news` | `summary`,`content` | `cic_news` | same | direct rich text | Yes | NULL | không split content |
| `fs_news` | `category_id` | `cic_news` | same | int; FK sau orphan check | Yes | NULL | orphan vẫn giữ record |
| `fs_news` | `published`,`is_hot`,`is_new`,`show_in_homepage` | `cic_news` | same | flag → boolean | theo validation | false cho record mới | không override legacy |
| `fs_news` | `news_related`,`products_related`,`tags` | `cic_news` | same | raw direct | Yes | NULL | relation parse riêng |
| `fs_news` | `image`,`file_upload`,`video` | `cic_news` | same | raw path/URL | Yes | NULL | Media map sau |
| `fs_news` | `seo_*` | `cic_news` | same | direct | Yes | NULL | entity detail SEO |
| `fs_news_categories` | all used columns | `cic_news_categories` | same | direct; flags boolean | theo source | none | parent FK deferred |
| `fs_event` | `id,title,alias,summary,content,image` | `cic_event` | same | direct | theo source | none | rich text giữ nguyên |
| `fs_event` | `time_event`,`specific_time` | `cic_event` | same | parse timestamp/direct label | Yes | NULL | source event time |
| `fs_event` | `place`,`chu_de`,`link_dangky` | `cic_event` | same | direct | Yes | NULL | location/topic/registration |
| `fs_event` | `end_time` | `cic_event` | `end_time` | đối soát với `updated_time`; giá trị audit legacy → NULL, chỉ giữ giá trị được xác minh là event end | Yes | NULL | Từ CMS mới là thời gian kết thúc; không tạo `event_end_time` |
| `fs_event` | related/SEO/flags | `cic_event` | same | raw/direct/boolean | Yes | none | preserve order when parsed |
| `fs_products` | `id,name,title,alias,summary,content` | `cic_products` | same | direct | theo source | none | không đổi sang mock names |
| `fs_products` | category/manufactory/type/application IDs | `cic_products`/relation tables | corresponding columns | int + deferred FK | Yes | NULL | giữ snapshot name/alias legacy |
| `fs_products` | related/CSV fields | `cic_products` | same | raw direct | Yes | NULL | normalize later, no overwrite |
| `fs_products_images` | `record_id,image,ordering` | `cic_products_images` | same | direct | record required after validation | 0 for new order | gallery order |
| `fs_products` | `id`,`category_id` CSV | `cic_products_categories_rel` | `product_id`,`category_id` | parse ordered CSV; resolve valid IDs | No for inserted row | none | synthetic relation; composite unique after dedupe |
| product master tables | all | matching `cic_*` | same | direct; flags boolean | source | none | types/manufactories/application |
| `fs_services` | title/alias/summary/content/image | `cic_services` | same | direct | source | none | tagline → summary at mapper |
| `fs_services` | category wrapper fields | `cic_services` | same | direct preserve | Yes | NULL | DEPRECATED if no real service category |
| `fs_menus_groups*` | all | `cic_menus_groups*` | same | direct | source | none | preserve locale tables |
| `fs_menus_items*` | name/link/parent/group/order/flags | `cic_menus_items*` | same | flags boolean; FK deferred | source | none | tree validation |
| `fs_users` | identity/profile/auth fields | `cic_users` | same | direct | source | none | preserve password hash |
| `fs_users` | `image` | `cic_users` | `image` | direct | Yes | NULL | frontend `avatar` is MAP |
| `fs_users` | scope CSV columns | `cic_users` | same | raw direct | Yes | NULL | relation backfill later |
| permission tables | all | matching `cic_*` | same | direct | source | none | effective permission parity required |
| `fs_config*` | all | matching `cic_config*` | same | direct | source | none | no mock field expansion |
| `fs_config_modules*` | module/view/task/SEO fields | matching target | same | direct | source | none | Function SEO source |
| language tables | all | matching target | same | direct | source | none | no approval workflow |
| `fs_contents*` | all | `cic_contents*` | same | direct | source | none | legacy static content preserved |
| `fs_contact*` | all | `cic_contact*` | same | direct/boolean/time | source | none | source_type supplied by adapter |
| `fs_product_contact` | all | `cic_product_contact` | same | direct | source | none | do not merge physically |
| `fs_order*` | all | `cic_order*` | same | direct | source | none | preserve order/items relation |
| `fs_email*`,`fs_types_email*` | all | matching `cic_*` | same | direct | source | none | routing/owner, not templates |
| `fs_business*` | all | `cic_business*` | same | direct | source | none | sales owner/settings |
| image/gallery/video/banner/slideshow | all | matching `cic_*` | same | direct | source | none | Media indexing occurs after copy |

## Coverage đầy đủ 104 bảng

Bảng dưới đây khóa quy tắc mapping ở cấp bảng cho toàn bộ PostgreSQL draft. Mọi cột cùng tên được direct-copy; chỉ các cột được nêu ở bảng chi tiết phía trên hoặc migration manifest mới có transformation riêng. Nếu tên bảng legacy thực tế trong dump không khớp quy tắc tiền tố dưới đây, migration phải dừng và đưa vào exception report, không tự đoán.

| Legacy table | Target table | Rule |
|---|---|---|
| `fs_address` | `cic_address` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_address_en` | `cic_address_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_areas` | `cic_areas` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_cities` | `cic_cities` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_cities_en` | `cic_cities_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_khuvuc` | `cic_regions` | Mapping tên bảng đã duyệt; cột theo `manifest.json`, preserve ID. |
| `fs_khuvuc_en` | `cic_regions_en` | Mapping tên bảng đã duyệt; cột theo `manifest.json`, preserve ID. |
| `fs_wards` | `cic_wards` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_users` | `cic_users` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_users_permission` | `cic_users_permission` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_users_permission_field` | `cic_users_permission_field` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_users_permission_fun` | `cic_users_permission_fun` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_permission_field` | `cic_permission_field` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_permission_fun` | `cic_permission_fun` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_permission_tasks` | `cic_permission_tasks` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_members` | `cic_members` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_menus_admin` | `cic_menus_admin` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_menus_createlink` | `cic_menus_createlink` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_menus_groups` | `cic_menus_groups` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_menus_groups_en` | `cic_menus_groups_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_menus_items` | `cic_menus_items` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_menus_items_en` | `cic_menus_items_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_config` | `cic_config` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_config_en` | `cic_config_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_config_enjicad` | `cic_config_enjicad` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_config_modules` | `cic_config_modules` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_config_modules_en` | `cic_config_modules_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_blocks` | `cic_blocks` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_blocks` + `fs_blocks_en` | `cic_blocks_translations` | Bảng normalized được sinh theo `manifest.json`; giữ `entity_id`, `locale` và content tương ứng, không direct-copy giả định. |
| `fs_blocks_exist` | `cic_blocks_exist` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_tables` | `cic_tables` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_extends_groups` | `cic_extends_groups` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_extends_items` | `cic_extends_items` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_history` | `cic_history` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_hits` | `cic_hits` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_languages` | `cic_languages` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_languages_contents` | `cic_languages_contents` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_languages_tables` | `cic_languages_tables` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_languages_text` | `cic_languages_text` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_languages_text_admin` | `cic_languages_text_admin` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_translate_content` | `cic_translate_content` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_contents` | `cic_contents` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_contents_en` | `cic_contents_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_contents_categories` | `cic_contents_categories` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_contents_categories_en` | `cic_contents_categories_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_news` | `cic_news` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_news_en` | `cic_news_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_news_categories` | `cic_news_categories` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_news_categories_en` | `cic_news_categories_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_news_keyword` | `cic_news_keyword` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_keywords` | `cic_keywords` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_event` | `cic_event` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_event_en` | `cic_event_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products` | `cic_products` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_en` | `cic_products_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_categories` | `cic_products_categories` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_categories_en` | `cic_products_categories_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products.category_id` | `cic_products_categories_rel` | Parse CSV thành `(product_id, category_id)`; bảng đích là synthetic, không có bảng nguồn trực tiếp. |
| `fs_products_en.category_id` | `cic_products_categories_rel_en` | Parse CSV thành `(product_id, category_id)`; bảng đích là synthetic, không có bảng nguồn trực tiếp. |
| `fs_products_fields_groups` | `cic_products_fields_groups` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_filters` | `cic_products_filters` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_filters_values` | `cic_products_filters_values` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_images` | `cic_products_images` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_images_en` | `cic_products_images_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_incentives` | `cic_products_incentives` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_price` | `cic_products_price` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_sizes` | `cic_products_sizes` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_tables` | `cic_products_tables` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_tables_en` | `cic_products_tables_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_types` | `cic_products_types` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_products_types_en` | `cic_products_types_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_product_contact` | `cic_product_contact` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_manufactories` | `cic_manufactories` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_manufactories_en` | `cic_manufactories_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_order` | `cic_order` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_order_items` | `cic_order_items` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_banners` | `cic_banners` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_banners_en` | `cic_banners_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_banners_categories` | `cic_banners_categories` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_banners_categories_en` | `cic_banners_categories_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_slideshow` | `cic_slideshow` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_slideshow_en` | `cic_slideshow_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_slideshow_categories` | `cic_slideshow_categories` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_slideshow_categories_en` | `cic_slideshow_categories_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_contact` | `cic_contact` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_contact_en` | `cic_contact_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_contact_enjicad` | `cic_contact_enjicad` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_email` | `cic_email` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_email_en` | `cic_email_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_types_email` | `cic_types_email` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_types_email_en` | `cic_types_email_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_onlinesupport` | `cic_onlinesupport` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_business` | `cic_business` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_business_en` | `cic_business_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_services` | `cic_services` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_services_en` | `cic_services_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_image` | `cic_image` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_image_en` | `cic_image_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_image_images` | `cic_image_images` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_image_images_en` | `cic_image_images_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_video` | `cic_video` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_application` | `cic_application` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_application_en` | `cic_application_en` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |
| `fs_year` | `cic_year` | Direct-copy toàn bộ cột cùng tên; transformation kiểu dữ liệu theo quy tắc chung; ngoại lệ được ghi ở bảng chi tiết phía trên. |

### Bảng nguồn không tạo thành bảng target vận hành

Các bảng `fs_banners_en_`, `fs_contents_en-bk`, `fs_image_en_`, `fs_image_images_en_`, `fs_manufactories_en_bk`, `fs_menus_items_en_bk`, `fs_news_18052020`, `fs_news_categories_copy1`, `fs_news_en1`, `fs_products_copy1`, `fs_products_en_` có tên backup/lỗi/snapshot. Chúng không trở thành bảng production riêng. Dữ liệu vẫn phải được kiểm kê, checksum và lưu raw archive; chỉ merge khi có rule đối chiếu được duyệt, không tự chọn bản “mới hơn”. `fs_blocks_en`, `fs_khuvuc` và `fs_khuvuc_en` không bị bỏ: chúng đã có mapping normalized/đổi tên rõ ở bảng trên.

## Quan hệ CSV backfill

1. Copy raw string unchanged.
2. Parse delimiters documented per column; trim, ignore empty token.
3. Preserve first occurrence order; duplicate goes to report.
4. Resolve entity in same workspace.
5. Insert relation row only when target exists; orphan remains in report and raw source.
6. Compare parsed valid count with relation count.
7. Backend reads normalized relation, fallback raw only during compatibility window.

## Invalid data strategy

- Never drop parent record because FK target is missing.
- Load with FK `NOT VALID` or load staging without FK enforcement.
- Store orphan/duplicate/invalid timestamp in migration exception tables/report files.
- Cleanup requires explicit rule/owner; then validate constraint.
- Unresolved rows remain nullable/unlinked but fully preserved.

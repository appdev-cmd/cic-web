# Target PostgreSQL schema cuối cùng

> Đây là specification, chưa phải SQL. Schema nền là `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql` (104 bảng).  
> Ưu tiên: bảo toàn dữ liệu legacy > tối ưu mô hình.

## Phạm vi target

Target gồm:

1. **104 bảng `cic_*` hiện tại**: giữ tên bảng/cột và dữ liệu để migrate/rollback.
2. **Constraint/index được xác minh**: chỉ enforce sau khi kiểm tra orphan/duplicate/null.
3. **Domain mới additive**: Page Builder, Media, CTA, Forms, Email Templates, RBAC tối thiểu, Activity Logs, Trash và phần mở rộng Customer Request nếu được vận hành.
4. **Application mapping**: đổi tên frontend, derive và compose; không thay DB.

## Phân loại cuối

### KEEP

| Nhóm | Bảng |
|---|---|
| Địa chỉ/khu vực | `cic_address*`, `cic_areas`, `cic_cities*`, `cic_regions*`, `cic_wards` |
| User/permission legacy | `cic_users`, `cic_users_permission*`, `cic_permission_*`, `cic_members` |
| Menu/config | `cic_menus_*`, `cic_config*`, `cic_config_modules*` |
| Language | `cic_languages*`, `cic_translate_content` |
| Static legacy | `cic_contents*`, `cic_contents_categories*` |
| News | `cic_news*`, `cic_news_categories*`, keyword tables |
| Event | `cic_event*` |
| Product | toàn bộ `cic_products*`, category/relation/image/type/price/filter/table/size/incentive |
| Product settings | `cic_manufactories*`, `cic_application*`, `cic_business*`, `cic_email*`, `cic_types_email*` |
| Customer source | `cic_contact*`, `cic_product_contact`, `cic_order*` |
| Service | `cic_services*` |
| Legacy media/content | `cic_image*`, `cic_video`, gallery/banner/slideshow tables |
| Khác | các bảng legacy còn lại; không drop trong migration đầu |

### MODIFY

Không rename/drop. Chỉ sửa metadata schema sau validation:

| Nhóm | Điều chỉnh |
|---|---|
| Boolean legacy | `NOT NULL DEFAULT false` chỉ khi thống kê chứng minh NULL không mang nghĩa riêng; trước đó backfill deterministic |
| Ordering/count | default `0` sau khi backfill NULL; index chỉ tại query thực tế |
| Timestamp | dùng `timestamptz`; default `now()` cho record mới, không ghi đè timestamp legacy |
| Alias | unique theo đúng dataset/workspace khi duplicate report sạch; không unique toàn hệ thống giữa VI/EN |
| FK | sửa target FK theo `postgresql-schema-issues.md`; dùng `NOT VALID`, validate sau orphan cleanup |
| Relation table | unique composite và index hai chiều; giữ raw CSV legacy trong rollout đầu |
| Text length | nâng `varchar` lên `text` khi dữ liệu thực vượt giới hạn; không truncate |
| Numeric money | domain mới dùng `numeric`; không rewrite hàng loạt `double precision` legacy ở migration đầu |

### ADD — bảng domain mới

| Bảng logic | Mục đích |
|---|---|
| `cic_content_pages` | Page identity/template/workspace/status/SEO |
| `cic_content_page_revisions` | Draft/Published immutable revision |
| `cic_content_page_sections` | Section cố định theo template, config JSON có schema |
| `cic_content_page_section_references` | Entity selection thủ công, có thứ tự |
| `cic_media_assets` | Asset chuẩn hóa + legacy source/path |
| `cic_media_folders`, `cic_media_folder_assets` | Tổ chức Media |
| `cic_media_versions`, `cic_media_variants` | Chỉ tạo nếu giữ replacement/variant production |
| `cic_ctas` | CTA reusable, action config allowlist |
| `cic_forms`, `cic_form_fields` | Form definition |
| `cic_form_submissions`, `cic_form_submission_values` | Submission/value |
| `cic_email_templates`, `cic_email_template_versions` | Template mail, không dùng nhầm `cic_email` |
| `cic_roles`, `cic_role_permissions`, `cic_user_roles` | RBAC tối thiểu song song direct permission legacy |
| `cic_activity_logs` | Audit append-only |
| `cic_trash_items` | Xóa/khôi phục chung |
| `cic_customer_request_notes`, `cic_customer_request_events` | Chỉ thêm nếu CMS ghi chú/phân công/lịch sử thật |

### MAP ONLY

| Frontend/CMS | PostgreSQL |
|---|---|
| `slug` | `alias` |
| `shortDescription`, `shortDesc`, `description` dùng như excerpt | `summary` |
| `body`, `contentHtml`, `contentMarkdown`, `htmlContent` | `content` rich text |
| `heroImage`, `thumbnail`, `img`, `avatar` | `image` hoặc Media resolver |
| `brand` | manufactory relation |
| `productType` | product type relation |
| `application/app` | application relation |
| `seoTitle/seoDescription/seoKeywords` | `seo_title/seo_description/seo_keyword` |
| `eventType` | `chu_de` |
| `location` | Event `place` |

### DERIVED

- Breadcrumb, category count, file size/type/dimensions, author display object.
- Public status label, reading time, share URL, “mới”, ngày còn lại.
- Event Upcoming/Past từ `time_event`; Ongoing chỉ khi `event_end_time` được duyệt.
- `isOpenRegistration` từ registration link/time policy.
- SEO fallback/canonical, media display URL, related entity display object.

### UI ONLY

- Tab/accordion/modal state, selected rows, filters, pagination state.
- Placeholder/helper/label/icon/design token/layout/responsive.
- Quality score được tính runtime, loading/empty state, preview viewport.
- Mock metrics, saved preset, used-by giả, working version giả.

### DEPRECATE — giữ cột nhưng backend mới không ghi

- Snapshot/category wrapper/alias dư thừa legacy nếu đã có FK, cho đến hết rollback window.
- CSV relations sau khi relation table mới đã backfill và đối soát.
- `cic_event.end_time` với nghĩa timestamp cập nhật không ổn định; không dùng làm event end.
- Category fields của Event/Service không có nghiệp vụ thật.
- Workflow duyệt nội dung, `optimal_seo`, rating/comments/action flags không còn UI mới.
- `cic_history` không dùng làm CMS audit; vẫn giữ đúng dữ liệu nghiệp vụ cũ.
- `cic_email*` không dùng làm Email Template; vẫn giữ người phụ trách/routing legacy.

## Rich Text quyết định cuối

`cic_news.content`, `cic_event.content`, `cic_services.content`, product content fields đang dùng và legal/static article content tiếp tục là rich text. Không tạo `section_1_*`, agenda/speaker/process/benefit columns chỉ để khớp mockup. Structured Page Builder chỉ áp dụng cho page có section component cố định.

## Locale/workspace

Giữ mô hình bảng VI/EN độc lập trong migration đầu. Bảng domain mới có `workspace varchar(10) NOT NULL` với allowlist (`vi`, `en`, ...). Không tự fallback/translate. Việc hợp nhất bảng legacy thành translation table là ngoài scope và sẽ là breaking migration riêng nếu sau này cần.

Seed Page Builder cũng phải theo manifest riêng từng workspace. Không được dùng config/content VI để tự tạo Draft EN; workspace chưa có manifest được duyệt giữ rỗng hoặc chưa khả dụng.

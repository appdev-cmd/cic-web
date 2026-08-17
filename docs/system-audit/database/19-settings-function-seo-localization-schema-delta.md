# Schema Delta — Cấu hình hệ thống, Cấu hình SEO chức năng và Ngôn ngữ giao diện

Phạm vi audit: code CMS cũ trong `httpdocs` → PostgreSQL hiện tại → code CMS mới. Tài liệu chỉ ghi phần cần **thêm**; chưa phải migration SQL.

## Cấu hình hệ thống

### Bảng hiện có cần mở rộng

Không có field bắt buộc cần thêm. Tiếp tục dùng:

- `cic_config` cho website CIC/VI;
- `cic_config_en` cho website EN;
- `cic_config_enjicad` cho scope Enjicad.

Các bảng đã có `name` unique, `value`, `data_type`, trạng thái, ordering và title. Metadata trình bày/validation của editor mới (`label`, `group`, `description`, `type`, `options`, `sensitivity`, regex, unit, used-by) nên nằm trong manifest/type ở application, không nhân bản thành column DB.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `settingId/path → name`, `liveValue/effectiveValue → value`, kiểu điều khiển → `data_type`; scope map sang đúng một trong ba bảng `cic_config*` hiện có.
- `ConfigScope`, `ConfigGroupDef` và `ConfigItem` là metadata ứng dụng. `issueCount`, `overrideCount`, effective/inherited value là dữ liệu derive, không tạo column.
- Draft, atomic publish, version history, validation issue và activity log hiện chỉ thay đổi local state/mock. Chúng chưa được chốt thành workflow backend nên không tạo các bảng config draft/version/change/issue chỉ để giữ mockup.
- Nếu sau này duyệt versioning cấu hình thật, phải audit riêng cơ chế immutable version và publish transaction; không lưu `draftValue` cạnh `value` trên từng bảng legacy một cách tùy tiện.
- Secret test/rotate hiện là mô phỏng. Không lưu secret thô hoặc lịch sử secret trong `cic_config*`; secret production phải đi qua cơ chế mã hóa/secret store được duyệt.

## Cấu hình SEO chức năng

### Bảng hiện có cần mở rộng

| Table | Field thêm | Type | Nullable / Default | FK | Index | Mức độ | CMS mới sử dụng | Lý do cần thêm |
| ----- | ---------- | ---- | ------------------ | -- | ----- | ------ | --------------- | -------------- |
| `cic_config_modules` | `value_seo_keyword` | `varchar(255)` | Nullable, default `NULL` | — | — | **BẮT BUỘC** | Editor Meta keywords của route/module VI | Field tồn tại trong `fs_config_modules`, được CMS/website cũ ghi và đọc nhưng bị bỏ sót khỏi PostgreSQL draft. |
| `cic_config_modules` | `value_seo_description` | `varchar(255)` | Nullable, default `NULL` | — | — | **BẮT BUỘC** | Editor Meta description của route/module VI | Field legacy đang dùng thật nhưng PostgreSQL draft chỉ giữ `value_seo_title`. |
| `cic_config_modules` | `seo_indexable` | `boolean` | `NOT NULL DEFAULT true` | — | Index có điều kiện chỉ khi query sitemap/noindex cần | **BẮT BUỘC** | Checkbox “Cho phép lập chỉ mục” của Function SEO VI | `published` là trạng thái cấu hình module, không đồng nghĩa với robots index/noindex. |
| `cic_config_modules_en` | `value_seo_keyword` | `varchar(255)` | Nullable, default `NULL` | — | — | **BẮT BUỘC** | Editor Meta keywords workspace EN | Khôi phục field tương ứng của `fs_config_modules_en` bị bỏ sót khi dựng PostgreSQL. |
| `cic_config_modules_en` | `value_seo_description` | `varchar(255)` | Nullable, default `NULL` | — | — | **BẮT BUỘC** | Editor Meta description workspace EN | Giữ contract SEO ba field title/keyword/description độc lập cho EN. |
| `cic_config_modules_en` | `seo_indexable` | `boolean` | `NOT NULL DEFAULT true` | — | Index có điều kiện chỉ khi query sitemap/noindex cần | **BẮT BUỘC** | Checkbox “Cho phép lập chỉ mục” của Function SEO EN | Không dùng `published` thay cho robots policy. |

Ngoài column, cần unique index chuẩn hóa `(module, view, COALESCE(task, ''))` trên từng bảng VI/EN sau khi profiling NULL, khoảng trắng và record trùng. Mức độ **BẮT BUỘC** vì CMS dùng bộ ba này làm identity ổn định của route/module.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `title → value_seo_title`, `keywords → value_seo_keyword`, `description → value_seo_description`, `indexable → seo_indexable`.
- `routeKey`, `path`, `label`, `intent`, category/detail hierarchy và owner/status là ViewModel compose từ `module + view + task` và route registry; không tạo column.
- `canonicalPath` hiện chỉ được preview, không có control chỉnh sửa. Derive từ route registry; chưa thêm `canonical_path`.
- `fields_seo_*` tiếp tục giữ công thức compose SEO detail legacy; editor mới ở màn này chỉ sửa SEO trang chính, không ghi đè SEO của entity detail.
- Không thêm `updated_at` chỉ vì ViewModel gán timestamp khi save; nếu cần lịch sử thay đổi dùng shared Activity Log sau audit riêng.

## Ngôn ngữ giao diện

### Bảng hiện có cần mở rộng

Không có field cần thêm. Dùng:

- `cic_languages_text` cho chuỗi website (`application = web`);
- `cic_languages_text_admin` cho chuỗi CMS (`application = cms`);
- `cic_languages` làm danh mục locale.

Cần bổ sung unique index `lower(trim(lang_key))` độc lập trên `cic_languages_text` và `cic_languages_text_admin` sau khi profiling dữ liệu trùng/rỗng. Mức độ **BẮT BUỘC**; code cũ đã kiểm tra trùng key ở application nhưng PostgreSQL chưa cưỡng chế.

### Bảng mới cần tạo

Không có.

### Mapping / lưu ý

- `key → lang_key`, `values.vi → lang_vi`, `values.en → lang_en`; `application` quyết định bảng web hay admin; `namespace → module` khi có mapping module rõ ràng.
- `missing` có thể derive khi `lang_en` rỗng; `active` derive khi các locale bắt buộc đã có giá trị. `new`, `needs_check`, `deprecated` hiện là trạng thái fixture/filter, không có control workflow ghi thật nên chưa thêm `status`.
- `description`, `context`, `defaultLocale`, `defaultValue`, `requiredVariables`, `lengthHint` là dictionary manifest phục vụ validation/UI; không thêm vào bảng legacy.
- `updatedAt`, `updatedBy` và `history` hiện chỉ là mock; thao tác save không tạo history record. Chưa tạo bảng revision/history cho đến khi có yêu cầu audit bản dịch thật.
- Không dùng `cic_languages_contents` hoặc `cic_translate_content` cho UI dictionary; hai bảng đó có ngữ nghĩa dịch nội dung/entity khác.

## Kết luận delta

- Cấu hình hệ thống: **không thêm field hoặc bảng**.
- Cấu hình SEO chức năng: **6 field bắt buộc trên 2 bảng hiện có**, không có bảng mới.
- Ngôn ngữ giao diện: **không thêm field hoặc bảng**; thêm **2 unique index `lang_key`** sau profiling.
- Index identity Function SEO: **2 unique index** sau profiling, mỗi workspace một index.

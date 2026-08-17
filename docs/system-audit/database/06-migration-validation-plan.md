# Migration validation plan

## Required artifacts

- `table_counts.csv`: source/target count by table.
- `column_profiles.json`: null/distinct/min/max/invalid values for critical columns.
- `checksums.csv`: stable row/content checksum batches.
- `orphans.csv`, `duplicates.csv`, `invalid_values.csv`, `missing_files.csv`.
- `relation_parity.csv`: raw parsed IDs vs normalized relation rows/order.
- `permission_parity.csv`: effective permission per user/task before/after.
- signed `migration-summary.md` with exceptions and owners.

## Record count

For every migrated legacy table: `source count = target count`. No filtering of unpublished/invalid rows during migration. For relation backfill, compare valid parsed token count after dedupe and report rejected/orphan tokens separately.

## Critical field validation

| Domain | Required comparison |
|---|---|
| News/Event/Service/Contents | ID, title, alias, summary, full content hash, image, published, order, timestamps, SEO |
| Product | identity/name/alias/content, classification IDs, images order, files, price/raw related fields, SEO |
| Menu | group/item count, parent/group/order/link/target/published; cycle report |
| User | ID, username, password hash exact, email/profile/status/last visit/scope raw values |
| Permission | every task/function/field assignment and numeric permission |
| Contact/Order | identity, customer contact, message/items/amount/status/time |
| Config/SEO/Language | key/module/view/task/value/content/locale flags |
| Media legacy | raw URL/path and owner/source relation |
| Event time | `time_event` giữ nguyên; `end_time` hợp lệ phải lớn hơn `time_event`; thống kê riêng giá trị legacy trùng/tiệm cận `updated_time` và các bản ghi target nhận `NULL` |

## Relationship checks

- FK orphan count before/after cleanup.
- Parent tree cycle and depth checks.
- Product-category/image/type/manufactory/application parity.
- News/category/author/related parity.
- Menu parent/group parity.
- Order-item/product parity.
- New section references point to correct workspace and preserve `position`.
- Public relation resolver excludes draft/deleted but CMS reports them; migration does not delete them.
- Event status được kiểm tra từ thời gian: `now < time_event` = sắp diễn ra; `time_event <= now < end_time` = đang diễn ra; còn lại = đã kết thúc. Bản ghi legacy thiếu `end_time` không được phân loại là đang diễn ra.

## Duplicate/unique checks

- Alias duplicates within each table/workspace, case/trim normalized.
- Username/email duplicates before unique enforcement.
- Config/role/page/form/CTA stable code duplicates.
- Relation duplicate pairs and duplicate positions.
- File storage key/path collisions.

## Sample comparison

Select per table: first/last ID, recently updated, Published/Draft, record with max content length, non-ASCII, NULL-heavy, relations/files, known problematic row. Compare raw source, target row and final frontend/CMS mapped view. Product/News/Event/Service/Static detail require visual comparison after Next.js implementation, not during DB-only phase.

## Automated acceptance

- 100% table count parity, except explicitly documented generated tables.
- 100% ID preservation.
- 100% password hash and critical content hash parity.
- 0 unexplained orphan/duplicate/invalid required value.
- 100% valid relation order parity.
- 100% effective permission parity before enabling CMS write.
- No new table seed Active/Published unless explicitly approved.
- Every missing file/path retained and reported.
- Migration report không còn `ERROR` hoặc `SKIPPED` ngoài allowlist được phê duyệt; đặc biệt `cic_regions` phải load thành công và hai bảng `cic_products_categories_rel*` phải được backfill/đếm riêng dù không dùng PK đơn.

## Performance validation

Run EXPLAIN for public list/detail/alias/category queries and CMS filters after realistic data load. Verify no N+1 for product/news relation resolution, Page sections/references and media. Index changes require evidence from query plan, not assumption.

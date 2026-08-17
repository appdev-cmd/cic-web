# Migration plan

## Tách ba loại migration

### Schema migration

- Create target legacy-compatible schema and additive domain tables.
- Create indexes/FK initially non-blocking where necessary.
- No data cleanup or semantic rewrite.

### Data migration

- Bulk copy legacy tables, preserving IDs/raw values.
- Transform types deterministically.
- Backfill normalized relations and Media mapping in separate jobs.
- Seed new domain data only from approved mapping; no invented content.

### Data cleanup

- Resolve duplicate alias, orphan FK, invalid flag/date, malformed CSV/file.
- Every rule is versioned, repeatable and produces before/after report.
- Cleanup never runs implicitly inside schema DDL.

## Execution order

1. Freeze/export legacy snapshot; record checksums/version/timezone/charset.
2. Create empty target schema.
3. Load reference/master tables and users.
4. Load content/category/product/service/event/menu/config/language tables.
5. Load transactional contact/order/product-contact.
6. Load legacy media/path tables.
7. Reset all identity sequences.
8. Run raw validation.
9. Backfill normalized relations and Media asset index.
10. Seed Page Builder/CTA/Form/Email Template only from approved manifests, initially Draft.
11. Add/validate FK, unique, checks and final indexes.
12. Run full validation and sign-off; no application cutover before pass.

### Blocker đã thấy trong artifact hiện tại

`db_migrate/migration_report.json` đang ghi `cic_products_categories_rel = SKIPPED_NO_PK` và `cic_regions = ERROR`. Đây là lỗi của lần chạy draft, không phải trạng thái được chấp nhận của target. Trước migration chính thức phải sửa loader/manifest cho bảng relation synthetic và mapping `fs_khuvuc → cic_regions`, chạy lại từ bản dump bất biến, rồi đưa kết quả vào validation report. Không được đánh dấu migration thành công nếu hai lỗi này còn tồn tại.

## Backfill rules

| Backfill | Rule | Legacy preservation |
|---|---|---|
| CSV relation | parse/trim/dedupe/resolve/position | raw column unchanged |
| Media asset | one mapping per verified path/source | raw path unchanged; missing asset reported |
| Page Builder | manifest maps known page/template/section/config | `cic_contents*` unchanged |
| CTA/Form | seed only explicitly approved reusable records | hard-coded legacy UI remains reference until cutover |
| Roles | explicit role manifest only | direct permission tables authoritative |
| Email Template | approved baseline records Draft | `cic_email*` unchanged |
| Event end time | chỉ giữ giá trị `end_time` đã được xác minh là thời gian kết thúc nghiệp vụ; giá trị trùng/tiệm cận `updated_time` do CMS cũ ghi theo audit được đưa vào báo cáo và target nhận `NULL` | giữ snapshot/raw export để truy vết; không suy diễn nội dung không tồn tại |

## Null/default rules for old records

- New optional field: NULL, never fabricated.
- New status: safest non-public state (`draft`) for newly seeded content.
- New ordering: deterministic source order; otherwise `0` with review report.
- New workspace: from source table (`_en` → `en`, base → `vi`), not UI language.
- New audit actor: NULL/system if source cannot identify user.
- Media metadata: NULL until extracted; legacy path always retained.
- No synthetic form submission, activity log, trash item or role assignment.

## Rollback

- Database snapshot retained and restoration rehearsed.
- Additive tables can remain unused; application read path can return to legacy tables.
- Do not drop raw CSV/path/legacy columns during first production cycle.
- Sequence changes and cleanup scripts have explicit reverse manifests where possible.
- Backfill rows carry source identity/batch ID for targeted removal/re-run.

## Cutover gate

Migration only succeeds when counts/checksums/required values/relation parity/permission parity/file reports pass agreed thresholds and every exception has disposition. Backend implementation begins after schema and migrated dataset are signed off.

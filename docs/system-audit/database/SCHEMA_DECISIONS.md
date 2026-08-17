# Final schema decisions

## Decision 1 — Preserve the 104-table PostgreSQL draft

**Reason:** It maps the real legacy database and operating CMS.  
**Legacy impact:** IDs/records/columns retained.  
**Frontend impact:** Uses ViewModels, not raw rows.  
**CMS impact:** Existing fields remain available through mapping.  
**Migration impact:** Direct-copy first; no destructive redesign.

## Decision 2 — No DB rename for frontend naming

**Reason:** `summary/alias/content/image` already represent `shortDescription/slug/body/heroImage`.  
**Legacy impact:** None.  
**Frontend impact:** Mapper exposes clear names.  
**CMS impact:** Contract can use UI-friendly labels.  
**Migration impact:** No data rewrite.

## Decision 3 — Rich Text remains the article-content model

**Reason:** Ordinary headings, paragraphs, images, tables, lists and embeds do not need independent query/business logic.  
**Legacy impact:** Full HTML preserved.  
**Frontend impact:** Existing design can render sanitized content.  
**CMS impact:** News/Event/Service/Product description/legal content keeps Rich Text Editor.  
**Migration impact:** Copy content unchanged; compatibility sanitization tests required.

## Decision 4 — Page Builder is an additive domain

**Reason:** Legacy contents cannot express fixed template sections, Draft/Preview/Published config and ordered entity selection.  
**Legacy impact:** `cic_contents*` retained.  
**Frontend impact:** Components/layout stay in code.  
**CMS impact:** No Add/Delete/change section type.  
**Migration impact:** Seed only approved pages/sections; no invented content.

## Decision 5 — Reusable Media/CTA/Form are relations

**Reason:** Avoid duplicated URLs/button/form schema across entities.  
**Legacy impact:** Raw paths/forms remain during transition.  
**Frontend impact:** Resolved view objects preserve design.  
**CMS impact:** Shared pickers/modules.  
**Migration impact:** Additive tables and mapping/backfill; old paths not removed.

## Decision 6 — Customer requests are not physically merged initially

**Reason:** Contact, product contact and order have different semantics/fields.  
**Legacy impact:** Every source record preserved.  
**Frontend impact:** CMS receives unified read model.  
**CMS impact:** source type/ID visible through service.  
**Migration impact:** Direct table copy; optional notes/events additive.

## Decision 7 — `cic_email` is not Email Template

**Reason:** It stores legacy owner/routing configuration.  
**Legacy impact:** Meaning/data unchanged.  
**Frontend impact:** None.  
**CMS impact:** Email Template uses new tables.  
**Migration impact:** Seed Draft templates separately; no source reinterpretation.

## Decision 8 — `cic_history` is not CMS Audit

**Reason:** Its money/service fields have another business meaning.  
**Legacy impact:** Table retained.  
**Frontend impact:** None.  
**CMS impact:** Activity Log uses append-only new table.  
**Migration impact:** No synthetic audit history from legacy rows.

## Decision 9 — RBAC is additive; direct permission remains authoritative during migration

**Reason:** Automatic role inference risks privilege drift.  
**Legacy impact:** All direct permissions retained.  
**Frontend impact:** None.  
**CMS impact:** New role UI can coexist with legacy source explanation.  
**Migration impact:** Explicit role manifest and 100% effective-permission parity required.

## Decision 10 — Reuse Event `end_time` as the business end time

**Reason:** Nghiệp vụ đã xác nhận cần phân biệt Upcoming/Ongoing/Ended và PostgreSQL đã có `end_time`; thêm `event_end_time` sẽ trùng dữ liệu.
**Legacy impact:** Code cũ từng ghi thời điểm sửa vào `end_time`. Phải đối soát với `updated_time`; không được coi giá trị legacy chưa xác minh là thời gian kết thúc sự kiện.
**Frontend impact:** Trạng thái được derive từ `time_event` và `end_time`, không lưu thủ công.
**CMS impact:** Form bắt buộc nhập thời gian bắt đầu và kết thúc, với `end_time > time_event`.
**Migration impact:** Không thêm column. Record legacy có `end_time` mang nghĩa audit được chuyển thành NULL sau khi lưu bằng chứng/đối soát; `updated_time` tiếp tục giữ thời gian sửa.

Implementation note: `time_event` là thời gian bắt đầu, `end_time` là thời gian kết thúc từ hệ thống mới. `created_time` không phải lịch xuất bản. Mock `agenda`, `speakers`, `targetAudience`, `status` và `isOpenRegistration` không phải bằng chứng thêm column; chúng lần lượt nằm trong Rich Text hoặc được derive.

## Decision 11 — No Level 4 breaking change in initial migration

**Reason:** Additive schema plus application mapping solves current requirements.  
**Legacy impact:** Maximum preservation/rollback.  
**Frontend impact:** No design change.  
**CMS impact:** Feature rollout can be module-by-module.  
**Migration impact:** No initial drop, destructive rename or physical table merge.

## Decision 12 — Next.js uses server-side data access, not a mandatory separate REST backend

**Reason:** Target is Next.js Fullstack.  
**Legacy impact:** None.  
**Frontend impact:** Server Components receive ViewModels.  
**CMS impact:** Server Actions handle internal mutations; Route Handlers only when HTTP is needed.  
**Migration impact:** Backend starts only after migrated PostgreSQL is validated.  

## Decision 13 — Projects use independent workspace tables and FK relations

**Reason:** Project is a real new domain with public list/filter/detail, homepage selection, SEO and CMS CRUD, while legacy has no project table; reinterpreting contents/image/business would corrupt existing meanings. The approved minimal design is documented in [09-projects-schema-delta.md](./09-projects-schema-delta.md).
**Legacy impact:** No legacy table is renamed, dropped or reinterpreted; no project record is invented automatically.
**Frontend impact:** Homepage and Project pages use one mapped entity; ordinary scope/results prose remains Rich Text, còn danh sách “Công nghệ áp dụng” đọc từ `technologies`.
**CMS impact:** VI và EN quản lý dataset độc lập cùng contract; `technologies` là danh sách text có thứ tự, còn sản phẩm/dịch vụ liên quan được chọn qua selector và lưu trong junction table có FK.
**Migration impact:** Additive `cic_projects`, `cic_projects_en` and four workspace-specific junction tables for related Product/Service records. Junction tables enforce FK integrity and relation ordering; there is no cross-workspace FK and no new taxonomy table.

## Current approval blockers

- Lần chạy draft hiện có `cic_regions = ERROR`; phải sửa mapping/load `fs_khuvuc` và validate lại.
- `cic_products_categories_rel = SKIPPED_NO_PK`; loader phải hỗ trợ relation synthetic có composite key và đối soát count từ CSV.
- Migration Event phải có báo cáo đối chiếu `end_time` với `updated_time` trước khi chuẩn hóa; không copy mù timestamp audit thành thời gian kết thúc nghiệp vụ.
- Các field bảo mật mở rộng và Customer Request notes/events chỉ được đưa vào migration khi implementation tương ứng được duyệt; không tạo column/table “để dành”.

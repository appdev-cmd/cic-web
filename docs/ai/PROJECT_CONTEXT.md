# Project Context

## Mục tiêu hệ thống

Hệ thống đích là **một Next.js App Router full-stack duy nhất** gồm website public, CMS, backend/domain/data layer và PostgreSQL/Supabase cho persistence.

Đợt audit ngày 2026-08-31 chỉ khóa bối cảnh, nguồn sự thật, module, dependency và nguyên tắc migration. Đợt này **không sửa source, không refactor, không migrate module và không thiết kế lại UI**.

## Hiện trạng repository

Repository đang ở trạng thái chuyển tiếp, không còn là frontend React thuần:

- **React/Vite legacy** vẫn tồn tại nguyên vẹn qua `index.html`, `src/main.tsx`, `src/App.tsx`, `src/web/**`, `src/cms/**`, `src/index.css`; đây là reference implementation cho giao diện và hành vi.
- **Next.js hiện tại** đã là build mặc định qua `src/app/**`, có public routes, CMS shell/login, server foundation và một số query/action theo feature trong `src/features/**`.
- **Backend/data foundation hiện tại** có Supabase server client, PostgreSQL transaction client, auth guard, validation và server queries/actions. Sự tồn tại của boundary này không chứng minh module đã hoàn tất.
- Nhiều CMS module vẫn dùng `demo*DataSource`, `mockData.ts` hoặc dữ liệu ghép từ fixture. Một số public route vẫn dùng legacy content adapter hoặc chỉ render lát cắt Next mỏng.
- Database artifacts và tài liệu schema nằm ở `db_migrate/**`, `docs/database/**`, `docs/system-audit/database/**`; đây là nguồn persistence, không phải fixture React.

Không được mặc định code Next hiện tại đúng chỉ vì đã tồn tại, build được hoặc có kết nối PostgreSQL.

## Source of truth đã khóa

### React legacy authoritative cho presentation

React legacy là nguồn sự thật cho giao diện, layout, text/content hiển thị, icon/asset, interaction, UX flow, responsive behavior và mọi trạng thái hiển thị.

Nguồn đối chiếu chính: `src/App.tsx`, `src/web/**`, `src/cms/**`, `src/shared/**`, `src/index.css`, `public/**` và bản render legacy. React legacy **không authoritative cho kiến trúc đích, schema, relation hoặc persistence**.

### Database docs/schema authoritative cho persistence

`db_migrate/database.html`, `docs/database/POSTGRES_SCHEMA_DELTA.md`, schema SQL và các schema decision liên quan là nguồn sự thật cho table, column, PK/FK, relationship, kiểu dữ liệu, constraint/index đã chốt, persistence, dữ liệu nghiệp vụ đang tồn tại và delta/gate migration database.

`database.html` là baseline inventory/schema; `POSTGRES_SCHEMA_DELTA.md` và quyết định schema đã duyệt là lớp delta/clarification. Khi tài liệu có điểm chưa thống nhất, phải ghi unresolved và chốt schema decision trước khi code; không tự chọn theo mock UI.

### CMS functional docs authoritative cho nghiệp vụ quản trị

`DE_XUAT_CHUC_NANG_CMS.md` là nguồn sự thật cho capability, workflow, trạng thái nghiệp vụ, quyền thao tác, hành vi quản trị và phạm vi module CMS. Các compatibility/data plan trong `docs/**` bổ sung constraint và rủi ro triển khai nhưng không được âm thầm thay đổi capability đã chốt.

### Next.js hiện tại là implementation cần audit

Next.js hiện tại chỉ là bằng chứng implementation. Nó không tự động authoritative cho UI, database contract hay CMS capability. Mọi phần đã có phải được kiểm tra lại theo ba nguồn sự thật ở trên trước khi được công nhận trạng thái cao hơn `[A]`.

## Quy tắc data shape bắt buộc

Không suy tên field DB, PK/FK, relation, enum hoặc schema từ mock/static data React.

```text
PostgreSQL/Supabase → server query → mapper → domain/view model → public/CMS UI
```

- UI không consume raw database row.
- Mapper chịu trách nhiệm đổi naming, project relation, fallback hợp lệ và redaction.
- Không sửa database chỉ để giống object mock.
- Mock chỉ có giá trị làm fixture/reference cho presentation; không phải database contract và không được dùng để giả lập hard dependency.

## Ranh giới migration bắt buộc

- Không copy kiến trúc hoặc component tree React sang Next.js như kiến trúc mới.
- Không sửa, cleanup hoặc xóa React legacy cho đến khi parity gate tương ứng được duyệt.
- Website và CMS tách presentation nhưng dùng chung domain/data logic khi cùng nghiệp vụ.
- Tổ chức code theo feature/domain; `app` chỉ compose route/layout.
- Query và mutation tách rõ; mutation phải authenticate, authorize, validate, thực hiện transaction/service khi cần, audit và revalidate.
- Server Component là mặc định; Client Component chỉ ở interaction/browser boundary thực sự.
- Không duplicate business rule giữa website và CMS.
- Chỉ tạo mapper/service/repository/shared abstraction khi có nhu cầu thực tế; không dựng generic layer để “đủ kiến trúc”.

## Gate đọc tài liệu trước khi migrate module

Agent sau phải đọc tối thiểu `PROJECT_CONTEXT.md`, `CURRENT_STRUCTURE.md`, `MODULE_MAP.md`, `ARCHITECTURE.md`, `DATABASE_MAPPING_RULES.md`, `UI_PRESERVATION.md`, tài liệu schema của module và phần tương ứng trong `DE_XUAT_CHUC_NANG_CMS.md`.

Chỉ bắt đầu khi hard dependencies trong `MODULE_MAP.md` đã tồn tại thật. Không dùng fake component/data/repository để vượt gate.

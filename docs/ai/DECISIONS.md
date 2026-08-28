# Architecture Decisions

Tài liệu này ghi quyết định kiến trúc cấp project. Quyết định schema chi tiết vẫn thuộc `docs/system-audit/database/SCHEMA_DECISIONS.md` và không bị thay thế tại đây.

## D-001 — Một Next.js App Router fullstack project

**Decision:** Website public, CMS và backend/data layer nằm trong một Next.js App Router project deploy Vercel.  
**Reason:** Đây là mục tiêu đã chốt; giảm boundary HTTP/deployment không cần thiết.  
**Consequence:** Internal reads dùng Server Components/server functions; mutation nội bộ ưu tiên Server Actions; Route Handlers chỉ cho HTTP boundary thật.

## D-002 — Tổ chức theo domain/feature

**Decision:** Mỗi domain sở hữu public UI, CMS UI, types/schemas và server behavior; `app` chỉ compose routes/layouts.  
**Reason:** Public và CMS dùng chung nghiệp vụ mà không trở thành ba project logic tách biệt.  
**Consequence:** `features/news`, `features/products`, v.v. có presentation boundary riêng nhưng dùng cùng domain contract.

## D-003 — Server-first, client islands nhỏ

**Decision:** Server Component là mặc định; Client Component chỉ ở boundary cần state/event/browser API/heavy browser library.  
**Reason:** Giảm client bundle, tận dụng App Router và tránh SSR/hydration problem.  
**Consequence:** CKEditor, Recharts, motion widgets, canvas, drag/drop, modal/drawer là client islands dưới server parent.

## D-004 — UI/ViewModel tách raw PostgreSQL row

**Decision:** UI nhận serializable ViewModel camelCase qua feature mapper; không consume raw row/generated DB type.  
**Reason:** Giữ UI source of truth và cô lập legacy snake_case/schema/connection changes.  
**Consequence:** Mapper chịu rename, relation projection, fallback và redaction; migration DB không kéo theo redesign component.

## D-005 — Layer theo độ phức tạp, không ceremony

**Decision:** Read đơn giản dùng typed server query + mapper; service/repository chỉ khi có rule, transaction, security, compatibility hoặc nhiều nguồn.  
**Reason:** Hạn chế coupling nhưng không over-engineer.  
**Consequence:** Không bắt buộc mỗi feature có controller/service/repository/interface đầy đủ.

## D-006 — Supabase access mặc định ở server

**Decision:** Business table access dùng server-only Supabase/DB client; browser client chỉ khi use-case được duyệt.  
**Reason:** Bảo vệ credentials, centralize authorization/mapping và kiểm soát cache.  
**Consequence:** Service-role/admin client có allowlist; RLS/least privilege là defense-in-depth, không thay server permission checks.

## D-007 — PostgreSQL migration additive và versioned

**Decision:** Kế thừa 104-table baseline và schema decisions; mọi thay đổi qua versioned Supabase migration, rehearsal và validation.  
**Reason:** Bảo toàn legacy data/rollback và tránh schema sinh từ mock UI.  
**Consequence:** Không drop/rename/physical merge ban đầu; seed/field mới cần approval.

## D-008 — Auth/permission được enforce phía server

**Decision:** `/cms`, queries và mutations nhạy cảm kiểm session/effective permission/scope ở server.  
**Reason:** UI hiding không phải security control.  
**Consequence:** RBAC additive coexist với direct legacy permission đến khi parity được duyệt; action quan trọng ghi audit.

## D-009 — Public Published cache theo tag; CMS sensitive uncached

**Decision:** Public Published data dùng feature/entity cache tags; Draft/Preview/PII/permission/audit/trash/secret request-scoped hoặc uncached.  
**Reason:** Cần hiệu năng public mà không rò rỉ dữ liệu quản trị.  
**Consequence:** Publish/mutation invalidates sau commit; preview không dùng public cache.

## D-010 — Shared theo responsibility thật

**Decision:** Chỉ đưa code vào shared khi contract ổn định và thực sự xuyên domain; similarity đơn thuần không đủ.  
**Reason:** Tránh shared trở thành vùng coupling/god utilities.  
**Consequence:** Domain card/form/mapper ở feature; tokens/UI primitives/shell/visual-editing contract có thể shared.

## D-011 — Route public trở thành deep-link nhưng presentation giữ nguyên

**Decision:** App Router cấp route list/detail/metadata thật cho public modules; UI/interaction hiện tại vẫn là visual source of truth.  
**Reason:** React hiện dùng view state dưới `/`, không đáp ứng routing/SEO Next.js.  
**Consequence:** Navigation đổi cơ chế kỹ thuật nhưng không tự thay layout, spacing, animation hoặc flow; cần regression từng route/state.

## D-012 — Mock removal theo module

**Decision:** Fixture chỉ được gỡ sau khi module đạt DB/data, CMS/public, permission, relation/media/SEO/rich-text, visual và rollback parity.  
**Reason:** Tránh big-bang migration và mất nguồn so sánh UI/data.  
**Consequence:** Mock fallback có thể coexist tạm thời sau server boundary; không bulk cleanup.

## D-013 — Error và validation contract thống nhất

**Decision:** Feature schema validation ở server boundary; expected domain errors map qua taxonomy chung.  
**Reason:** Tránh mỗi module tự nghĩ validation/error shape và ngăn lộ DB/provider details.  
**Consequence:** Client validation chỉ là UX; action/handler luôn validate lại và trả safe typed result.

## D-014 — Cross-domain qua public contract/read model

**Decision:** Feature không import private repository của feature khác; aggregate/search/dashboard dùng projection contract hoặc application use-case.  
**Reason:** Tránh import vòng và god repository.  
**Consequence:** Search/dashboard không sở hữu source data; workflow mutation nhiều domain có explicit orchestrator.

## D-015 — Next foundation coexist với React/Vite baseline trong giai đoạn chuyển tiếp

**Decision:** Next.js trở thành entry/build chính; React/Vite source hiện tại được giữ nguyên làm visual/behavior baseline và có scripts/typecheck legacy riêng cho đến khi từng module migrate.  
**Reason:** Prompt 2 chưa được phép migrate module/shared UI; xóa hoặc ép toàn bộ legacy source qua Next strict/lint sẽ làm lại công việc ngoài scope và mất nguồn regression.  
**Consequence:** `tsconfig.json` strict chỉ sở hữu foundation Next; `tsconfig.legacy.json` tiếp tục kiểm tra source cũ; ESLint Next chỉ lint foundation. Scripts `dev:legacy`, `build:legacy`, `preview:legacy` giữ khả năng chạy baseline tạm thời. Boundary này được thu hẹp theo từng module và chỉ xóa sau parity gate.

## D-016 — Chưa tạo Supabase browser client hoặc health endpoint

**Decision:** Prompt 2 chỉ tạo request-aware server client và allowlisted admin factory; chưa tạo browser client/health route/temporary table.  
**Reason:** Chưa có auth realtime, direct storage hoặc browser DB use case; route health sẽ buộc chọn schema/query giả trái giới hạn foundation.  
**Consequence:** Public/CMS skeleton build không cần secret thật. Env được validate fail-fast khi server DB factory được dùng; browser client chỉ thêm khi một feature được duyệt cần nó.

## D-017 — Shared UI migrate theo implementation authority, giữ compatibility shim cho legacy

**Decision:** Các primitive CMS đã tái sử dụng thật được chuyển từ `src/cms/components/ui` sang `src/shared/ui/cms`; đường dẫn cũ chỉ re-export tạm thời. Typography/Icons/Counter/tokens tiếp tục nằm ở `src/shared` và trở thành một phần của Next foundation.  
**Reason:** Shared không được phụ thuộc CMS, nhưng Prompt 3 chưa được phép sửa hàng loạt import của các module React legacy đang làm regression baseline.  
**Consequence:** Chỉ có một implementation authority trong `src/shared`; shim cũ không chứa markup/style/logic và được xóa khi consumer legacy tương ứng migrate. Modal/drawer/dialog/business card vẫn ở module/shell sở hữu chúng.

## D-018 — Tailwind Next chỉ scan App và shared foundation đã migrate

**Decision:** Next dùng `@tailwindcss/postcss`; `globals.css` đặt Tailwind `source(none)` rồi allowlist `src/app`, `src/shared/components` và `src/shared/ui`.  
**Reason:** Giữ nguyên utility classes của React source of truth mà không kéo toàn bộ legacy module CSS/client surface vào bundle Next trước khi migrate.  
**Consequence:** Mỗi prompt migrate feature/shell phải thêm source path tương ứng có chủ đích. Legacy `src/index.css` vẫn là baseline; chỉ base styles và CMS list/table/pagination contracts cần cho shared primitives được chuyển ở Prompt 3.

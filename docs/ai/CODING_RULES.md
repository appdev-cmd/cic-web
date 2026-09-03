# Coding Rules

Các quy tắc dưới đây là bắt buộc cho mọi AI/dev trong migration Next.js.

## 1. Preservation first

1. React UI hiện tại là source of truth. Không đổi layout, spacing, typography, màu, radius, shadow, responsive, content hierarchy, interaction hoặc animation nếu task không yêu cầu rõ.
2. Migration/refactor không phải redesign. “Clean code” không phải lý do đổi pixels hoặc behavior.
3. Trước khi migrate module, đọc `PROJECT_CONTEXT.md`, `CURRENT_STRUCTURE.md`, `MODULE_MAP.md`, `UI_PRESERVATION.md`, `ARCHITECTURE.md`, `MIGRATION_STATUS.md` và tài liệu mapping/schema liên quan.
4. Không sửa design tokens/global CSS để chuẩn hóa nếu chưa có visual regression chứng minh không đổi UI.
5. Không thay asset/logo/copy/business data bằng placeholder.

## 2. Server-first Next.js

1. `page.tsx`, `layout.tsx` và read-only composition mặc định là Server Component.
2. Chỉ thêm `"use client"` tại component nhỏ nhất cần state/event/browser API/browser-only library.
3. Không import `server/*`, secret, DB client, repository/query server hoặc generated DB row type vào Client Component.
4. Data truyền qua RSC boundary phải serializable, tối thiểu và là ViewModel/DTO an toàn.
5. Không fetch lại ở client dữ liệu mà server page đã có, trừ khi interaction/realtime thực sự yêu cầu.
6. Query độc lập chạy song song; tránh sequential waterfall. Heavy browser library load theo island/dynamic boundary.
7. Request-scoped server reads dùng `cache()` khi cùng request có nhiều consumer thực sự; không cache global dữ liệu CMS/PII.

## 3. Domain boundaries

1. Code thuộc domain đặt trong `features/<domain>`; public, CMS và server logic cùng domain nhưng tách boundary rõ.
2. `app` chỉ routing/layout/metadata/error-loading composition; không chứa business logic hoặc SQL.
3. `shared` không phụ thuộc `features`; client code không phụ thuộc server code.
4. Feature không import private repository/query của feature khác. Dùng public contract/projection hoặc application use-case được chốt.
5. Không tạo shared abstraction vì hai file trông giống nhau. Chỉ shared khi responsibility và contract thực sự chung.
6. Không tạo repository/service/interface hình thức. Read CRUD đơn giản dùng typed server query + mapper; thêm layer khi có rule, transaction, compatibility, nhiều nguồn hoặc test seam có giá trị.
7. Chạy `npm run check:boundaries` sau khi đổi foundation/import; checker phải pass và không có circular dependency trong `app`, `server`, `shared`, `features`.

## 4. TypeScript và naming

1. TypeScript strict; không dùng `any`, non-null assertion hoặc type cast để che lỗi nếu chưa chứng minh invariant.
2. Component/type/class: PascalCase; function/variable/file utility: camelCase; constant thật sự bất biến: UPPER_SNAKE_CASE; route/folder: kebab-case.
3. Database giữ snake_case/legacy names; application ViewModel/DTO dùng camelCase rõ nghĩa. Mapper sở hữu chuyển đổi.
4. Không expose raw database type cho UI. Read model và mutation input là type riêng khi shape/responsibility khác.
5. Dùng import alias; tránh relative path xuyên nhiều domain. Tránh barrel import lớn/heavy/server-client ambiguity.
6. Tên file phản ánh một responsibility; không dùng `utils.ts`/`helpers.ts` làm nơi chứa nghiệp vụ hỗn hợp.

## 5. Component responsibility

1. Component render UI; query/mapping/authorization/business transaction ở server boundary phù hợp.
2. Không đặt component definition bên trong component khác nếu gây remount/re-render.
3. UI-only state ở client: modal, tab, hover, selection, filter, carousel, draft visual. Không persistence các state này vào DB.
4. Business data/state persisted qua server action/service; không giả persistence bằng local array hoặc localStorage.
5. Không áp quota dòng máy móc. Khi file trộn nhiều responsibility hoặc khó test/migrate, tách theo visual/behavior boundary mà không tạo wrapper vô nghĩa.
6. Preserve existing component/shared implementation nếu đã đáp ứng; không tạo component mới chỉ để đổi tên hoặc bọc một dòng JSX.

## 6. Data access và mutations

1. Component không query PostgreSQL/Supabase trực tiếp.
2. Public read phải enforce Published/current revision, workspace/locale và loại Trash/private data phía server.
3. CMS mutation ưu tiên Server Action; Route Handler chỉ cho HTTP boundary thật như webhook, upload/download, integration, external/public API.
4. Mọi mutation: authenticate → authorize → validate → service/transaction → audit → revalidate.
5. Không tin hidden fields, client role, client-computed status hoặc client validation.
6. Transaction phải ngắn; tránh network/external call giữ DB transaction mở. Có idempotency khi webhook/submission có thể retry.
7. List query phải paginate; relation batch để tránh N+1; chỉ select cột cần thiết.
8. Không xóa mock cho đến khi module đạt parity/rollback gate.
9. Feature query/mutation đặt gần domain và đặt tên theo use case (`getProducts`, `getProductBySlug`, `createProduct`); không dựng generic repository framework.
10. Query trả `null` cho no-result được dự kiến; database/provider failure phải throw `DataAccessError` với message an toàn. `DataResult` chỉ dùng tại action/HTTP boundary cần typed result.
11. Persistence row type nằm trong feature server boundary cạnh mapper; domain/ViewModel và mutation input là type riêng khi responsibility khác.
12. Write path: validate → authenticate/authorize → feature mutation/transaction → audit nếu bắt buộc → revalidate/cache sau commit.

## 7. Supabase/PostgreSQL security

1. DB/Supabase server client nằm trong server-only module.
2. Service-role key, database URL, webhook/API secret không được dùng `NEXT_PUBLIC_`, gửi client, log hoặc đưa vào error.
3. Browser Supabase client chỉ được thêm khi use-case đã được duyệt; không dùng để bypass server application authorization.
4. Áp least privilege và RLS/GRANT theo role; server vẫn kiểm tra permission/scope.
5. Schema change phải qua versioned migration; không thay dashboard-only mà thiếu source migration.
6. Không thêm field/table vì mock/UI. Chỉ dùng schema decision được duyệt.
7. Index dựa trên query/FK/filter/order thực tế; không tạo index/partition “để dành”.
8. Migration production phải có rehearsal, validation, backup và rollback/forward-fix plan.
9. `createSupabaseServerClient` là request/cookie-aware client mặc định; `createSupabaseAdminClient` chỉ cho allowlisted server operation cần Auth Admin.
10. Session refresh thuộc `src/proxy.ts`; không đặt business query vào proxy.
11. Không tạo browser Supabase client trước use case realtime/direct Storage đã duyệt. Publishable key an toàn để public nhưng không thay thế RLS/authorization.
12. Direct SQL dùng pooled URL, connection limit/timeout và transaction ngắn; production credential phải là least-privileged role, không phải owner/bypass-RLS role.

## 8. Validation, errors và security

1. Mỗi feature dùng schema validation thống nhất cho server input; client validation chỉ hỗ trợ UX.
2. Kiểm tra locale/workspace, ID/relation, enum/status, rich text/media constraints và concurrency/version nếu cần.
3. Expected error dùng taxonomy chung; không throw/message tùy ý ra UI.
4. Không expose stack, SQL, provider response, secret hoặc raw PII.
5. `notFound()` cho entity không tồn tại/không visible; unauthorized và forbidden phân biệt rõ ở server.
6. Rich HTML sanitize bằng policy server được review; không thêm `dangerouslySetInnerHTML` mới nếu không đi qua contract đó.
7. Upload kiểm MIME, size, extension/storage key, permission và malware policy khi được yêu cầu.
8. Public submission/integration có origin/CSRF strategy phù hợp, rate limit, anti-spam và idempotency.

### Application states

- Root/CMS route có loading/error/not-found boundary riêng; unauthorized và forbidden là hai trạng thái khác nhau.
- `ApplicationState`/`ApplicationLoadingState` chỉ là shell server-compatible cho trường hợp đơn giản. Feature được giữ UI state riêng khi layout/copy/action khác.
- Empty state thuộc feature/list owner; không biến mọi empty/error/loading thành một component đa năng.
- Page guard có thể điều hướng authentication failure sang state route; Server Action và Route Handler vẫn dùng typed error phù hợp.

### Types, validation và mapper

- Generated DB types chỉ ở data/server boundary; UI không import DB Row type.
- Domain type diễn tả nghiệp vụ; input schema diễn tả dữ liệu không tin cậy; ViewModel là output serializable tối thiểu cho UI.
- Mapper đặt trong feature khi DB shape khác domain/UI; không tạo mapper/base repository generic cho phép đổi tên đơn giản.
- Luồng chuẩn: `DB → query → mapper (nếu cần) → domain/view model → UI`.

### Locale và routing

- Locale application dùng `AppLocale` từ `src/shared/i18n/config.ts`; hiện chỉ gồm `vi`, `en`, mặc định `vi`.
- Route locale và table/workspace locale map tường minh theo schema; không tự dịch hoặc fallback VI/EN trong persistence layer.
- `app` sở hữu route/layout; feature sở hữu domain/data/presentation; shared không sở hữu routing nghiệp vụ.

## 9. Auth và permissions

1. Ẩn menu/button không phải authorization.
2. Mọi CMS query/action nhạy cảm kiểm session và effective permission phía server.
3. Trong giai đoạn chuyển tiếp, RBAC additive và direct legacy permission tiếp tục authoritative cho đến khi parity được duyệt.
4. Draft/Preview/Publish, user/permission, settings secret, audit/trash và PII có permission/scope riêng.
5. Audit append-only và redact; không ghi password, hash, token, OTP, secret hoặc raw request header.

### CMS auth foundation

- `getCurrentCmsPrincipal()` là nguồn duy nhất cho Auth user, active `cic_users` profile, role codes và effective permission trong một request.
- `can(principal, module, action)` chỉ dựng UX/capability. Sensitive query, Server Action và Route Handler bắt buộc gọi `requirePermission(module, action)` ở server.
- CMS identity bridge dùng email đã normalize giữa Supabase Auth và `cic_users`; profile thiếu, disabled hoặc unpublished trả forbidden. Không nhận role/user ID từ browser làm bằng chứng.
- Permission mặc định fail closed. Không suy numeric legacy permission, không tự seed admin và không bỏ qua lỗi permission provider.
- Page boundary được phép chuyển unauthenticated/forbidden sang route state; HTTP boundary phải trả lần lượt 401/403, không gom thành 500 hoặc redirect login.
- `returnTo` login chỉ nhận internal `/cms...`; logout phải gọi Supabase sign-out thật và xóa session cookie qua server action.

## 10. Caching

1. Chỉ cache public Published data có tag/key/scope rõ.
2. CMS Draft/Preview, users/permissions, contacts/requests, audit/trash và secret data mặc định uncached/request-scoped.
3. Mutation revalidate đúng tag/path sau commit thành công; không invalidate trước transaction.
4. Không cache cross-user/workspace nếu key không encode scope an toàn.
5. Không thêm Redis hoặc cache layer mới khi chưa có metrics/use-case.

## 11. Accessibility và UI states

1. Giữ semantic HTML, label, keyboard, focus-visible, ARIA state và touch behavior; không làm giảm accessibility trong migration.
2. Giữ loading, empty, validation, error, success, disabled, hover/focus, modal/drawer và responsive states hiện có.
3. Modal/drawer mới hoặc chuyển đổi phải quản lý focus/escape/scroll đúng mà không đổi visual.
4. Animation/browser behavior phải có cleanup listener/timer/observer; hỗ trợ reduced motion khi thực hiện mà không phá state feedback/visual contract.
5. Mỗi public/CMS module phải regression ở các breakpoint/state ghi trong `UI_PRESERVATION.md`.

## 12. Testing và completion gate

1. Mọi task code chạy typecheck, lint, relevant tests và production build.
2. Data/server task kiểm authorization, validation, error mapping, cache invalidation và query behavior.
3. UI migration kiểm desktop/tablet/mobile và interactive states; so với React source of truth.
4. Module chưa đạt data/UI/permission/rollback parity không được đánh dấu completed.
5. Sau mỗi task cập nhật `MIGRATION_STATUS.md`; quyết định kiến trúc mới thật sự cần thiết ghi vào `DECISIONS.md`.
6. Không sửa unrelated dirty worktree và không tự cleanup/refactor ngoài scope.

## 13. Không được làm

- Không biến toàn app/page thành Client Component.
- Không dựng API/controller/repository giả để mô phỏng kiến trúc.
- Không query DB từ client hoặc JSX component.
- Không redesign trong migration.
- Không rename/drop/merge schema legacy trái quyết định đã duyệt.
- Không bulk-delete fixture/mock.
- Không tạo abstraction/dependency mới nếu implementation hiện có đáp ứng.
- Không đánh dấu hoàn thành dựa trên typecheck đơn lẻ khi chưa có functional/visual parity.


# Kế hoạch module hóa RAG CIC

## 1. Nguyên tắc

- Chuyển từng lát cắt, giữ route/table/task name và hành vi cũ cho tới khi consumer đã chuyển.
- Không tạo hàng loạt file rỗng; chỉ tạo file khi có trách nhiệm và test.
- Registry là composition root rõ ràng, không dùng import discovery ma thuật.
- Feature flag điều khiển rollout; permission quyết định người dùng có quyền hay không.
- Interface chỉ phản ánh hành vi thực tế đang cần.

## 2. Thứ tự triển khai

### M0 — Baseline và safety net

- Chốt test command chạy trong container.
- Snapshot OpenAPI và route list.
- Ghi task names, module imports và frontend routes hiện tại.
- Thêm architecture checks ở chế độ report-only trước khi enforce.

**Thoát:** build/test/Compose pass; baseline được lưu; không đổi runtime.

### M1 — Module Registry

- Tạo `ModuleDefinition` immutable với name, enabled, router, permissions, health checks, task names, capability/menu key.
- Registry phát hiện tên/route/permission trùng.
- Chuyển đăng ký bốn router hiện tại vào adapter definitions, chưa di chuyển code.
- Enabled modules lấy từ cấu hình có default tương thích: tất cả module hiện hữu bật.

**Test:** enabled đăng ký router; disabled không đăng ký; duplicate bị từ chối; app boot.

**Rollback:** `api/router.py` quay về include trực tiếp; definitions không ảnh hưởng domain code.

### M2 — Feature Flags và Capability API

- Tạo catalog flag đã biết; ban đầu dùng settings/default ổn định.
- Repository DB là tùy chọn ở bước sau; cache có TTL/invalidate và fallback an toàn.
- Tạo `/system/features` và `/system/capabilities` theo authenticated user.
- Capability hợp nhất module enabled, feature flags và permissions.

**Test:** flag off chặn dependency/API tương ứng; capability theo role; cache refresh; audit hook.

**Rollback:** giữ catalog defaults; vô hiệu DB override; không xóa dữ liệu.

### M3 — Provider Interfaces

- Bọc implementation hiện tại: Gemini/OpenAI LLM, Gemini embedding, MinIO storage.
- Factory chọn theo settings; mock/noop cho test/reranker.
- Giữ các hàm legacy làm adapter gọi factory để call site cũ không vỡ.
- Thêm contract tests trước khi chuyển call site.

**Test:** provider contract, timeout/error mapping, health, dimension/batch/storage lifecycle.

**Rollback:** legacy adapter trỏ lại implementation cũ.

### M4 — Frontend Capabilities và Registries

- Shared API client và capability provider/query.
- `PermissionGuard`, `FeatureGuard`, `RouteGuard` tối thiểu.
- Navigation registry thay mảng menu trong layout.
- Route registry lưu metadata cho các filesystem route hiện có; không dynamic component loader.
- Tách API clients khỏi products/documents/chat page theo từng feature, giữ JSX trước.

**Test:** menu/action/route filtering, 403, refresh/error behavior, build và E2E smoke.

**Rollback:** layout dùng menu cũ; page imports legacy API wrapper.

### M5 — Scaffold, Templates và Architecture Checks

- Scaffold mặc định dry-run/no-overwrite; validate snake/kebab/Pascal case.
- Sinh module/feature tối thiểu theo options, không tạo mọi file.
- Architecture checker dùng AST nơi có thể; regex chỉ cảnh báo.
- List/check module đọc manifest/registry thay vì import app có side effect.

**Test:** golden output, collision/no-overwrite, invalid name, checker fixtures.

### M6 — Pilot Categories

- Giữ model/table hiện tại, tạo module repository/service/schema/router/permission.
- Feature frontend categories chỉ khi API pilot đã ổn định.
- Đăng ký qua module registry, feature flag và capability.
- Không sửa products sang category relation mới trong cùng bước.

**Test:** unit/repository/API/permission/flag; enabled/disabled; migration head unchanged.

### M7 — Đánh giá pilot

- So sánh số file phải sửa để thêm/xóa categories.
- Kiểm tra import cycles, OpenAPI diff, startup, Compose, frontend build/E2E.
- Ghi ADR và điều chỉnh convention trước module thứ hai.

### M8 — Chuyển dần module còn lại

Thứ tự đề xuất:

1. audit/prompts (cross-cutting contract trước, nghiệp vụ sau);
2. products;
3. documents + jobs + storage;
4. search/RAG + AI providers;
5. conversations/leads;
6. auth/users cuối cùng vì rủi ro bảo mật cao.

## 3. Definition of Done cho mỗi module

- Public API/module manifest rõ; không deep import ngoài module.
- Router mỏng, service giữ nghiệp vụ, repository giữ persistence.
- Permission và feature flag (nếu cần) được registry/capability phản ánh.
- Task/event/metrics/audit được đăng ký có chủ đích.
- Unit/repository/API/permission/flag tests pass.
- Disabled module không có route/task/menu; app boot; dữ liệu còn nguyên.
- OpenAPI/backward compatibility và rollback được chứng minh.
- Dependency map/changelog/feature docs cập nhật.

## 4. Các quyết định chưa thực hiện trong phase tài liệu

- Chưa chọn DB-backed feature flags hay chỉ config ở phiên đầu.
- Chưa quyết định event bus in-process kết hợp outbox ở mức nào.
- Chưa chọn reranker thật.
- Chưa thay cách lưu refresh token.
- Chưa di chuyển file/module hay đổi import path.

Các quyết định này cần ADR khi bắt đầu triển khai tương ứng.

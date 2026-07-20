# Chuyển từ cấu trúc hiện tại sang module hóa

## 1. Chiến lược strangler

Giữ đường dẫn cũ như compatibility adapter, tạo implementation mới cạnh nó, chuyển consumer từng bước, sau đó deprecate và xóa adapter. Không đổi import path, API path, table name và task name trong cùng một bước.

## 2. Mapping cũ → mới

| Hiện tại | Đích | Cách chuyển |
|---|---|---|
| `api/routes/auth.py` | `modules/auth/router.py` | Router cũ re-export router mới; giữ URL |
| `api/deps.py`, `core/security.py` | `modules/auth` + core security primitives | Tách policy/session sau, giữ dependency aliases |
| `models/user.py`, user repo/schema | `modules/users/*` | Re-export model trước; không đổi table/import Alembic đột ngột |
| products route/repo/model/schema | `modules/products/*` | Tách Excel import/service trước, sau đó router |
| category model | `modules/categories/*` | Pilot; model cũ re-export hoặc chuyển với metadata import test |
| documents route/model/processor | `modules/documents/*` | Tách storage/service/job orchestration theo lát cắt |
| `services/minio_client.py` | `core/storage/minio.py` | Legacy functions gọi StorageProvider |
| embedding/LLM services | `core/ai/*` | Legacy functions gọi factories |
| retrieval service/RAG route | `modules/search`, `modules/rag` | Bọc legal strategy hiện tại, giữ response contract |
| conversation/lead/governance models | module tương ứng | Chuyển khi có service/API thực tế |
| `tasks/*` | module `tasks.py` + jobs composition | Giữ Celery task names/aliases |
| frontend `lib/api.ts` | `shared/api/client.ts` | Re-export `apiRequest` trong transition |
| admin pages | `features/*` + thin app page | Tách API/types/hooks trước, JSX sau |
| admin layout menu | navigation registry | Registry chứa metadata; layout chỉ render filtered entries |

## 3. Trình tự an toàn cho một module

1. Ghi feature document, dependencies, permissions, flag và rollback.
2. Thêm test characterization cho API/hành vi hiện hữu.
3. Tạo module definition và files có trách nhiệm.
4. Re-export/import adapter từ đường dẫn cũ.
5. Đăng ký module qua registry với default enabled.
6. Chuyển call site từng nhóm; chạy test sau mỗi nhóm.
7. Thêm frontend feature API/hooks và thin page adapter.
8. Kiểm tra OpenAPI diff, Alembic head, task registry, capability và UI.
9. Đánh dấu compatibility path deprecated; đo consumer/import còn lại.
10. Xóa adapter ở release sau theo deprecation policy.

## 4. Pilot categories chi tiết

### Bước A — Không đổi runtime

- Tạo `modules/categories` với definition, permissions, repository/service/schema/router tests.
- Model vẫn ở `models/category.py`; `modules/categories/models.py` chỉ public re-export có chú thích transition.
- Không tạo migration vì bảng đã có.

### Bước B — Registry/flag/capability

- Registry đăng categories conditionally.
- Flag `category_management` (nếu product yêu cầu rollout riêng) không thay permission `category.view/manage`.
- Capability phản ánh module/feature/permission.

### Bước C — Frontend

- Tạo feature API/hooks/types/navigation.
- Tạo thin filesystem route.
- Menu được lọc bằng capability.

### Bước D — Disable/removal proof

- Tắt module: route 404, menu biến mất, scheduler không đổi, dữ liệu nguyên.
- Bật lại: route/menu hoạt động không migration.

## 5. Alembic và model imports

- `Base.metadata` phải discover mọi model ở cả đường dẫn cũ/mới trong transition.
- Không định nghĩa cùng table bằng hai class.
- Test `alembic heads`, upgrade trên DB sạch và upgrade trên snapshot.
- Di chuyển Python model không yêu cầu migration nếu table/schema không đổi.
- Chỉ xóa table sau deprecation/data retention/export/rollback plan.

## 6. Celery

- Task name string là public contract; giữ `app.tasks.indexing.process_document_task` khi đổi Python location hoặc đăng ký alias.
- Beat schedule không import task từ module disabled.
- Drain/inspect queue trước khi xóa alias.
- Handler/task phải idempotent; task nặng không chạy in-process event handler.

## 7. Frontend route compatibility

- Giữ URL `/admin/products`, `/admin/documents`, `/admin/chat`.
- App Router page re-export/compose feature component; registry không thay filesystem routing.
- Chuyển direct `fetch` sang feature API client trước khi tách UI.
- Capability loading không được làm flash menu trái quyền; chọn deny-until-loaded cho admin actions.

## 8. Rollback theo lớp

| Thay đổi | Rollback |
|---|---|
| Registry | Chuyển composition về include router trực tiếp |
| Feature flag | Dùng default config/fallback và tắt DB override |
| Provider adapter | Legacy function trỏ concrete implementation cũ |
| Module move | Re-export ngược hoặc revert consumer imports |
| Frontend feature | Thin page import component cũ; navigation registry về snapshot |
| Migration | Deploy code tương thích trước; downgrade chỉ khi không mất dữ liệu |

## 9. Kiểm chứng bắt buộc mỗi bước

- Backend unit/API/permission/flag/architecture/import-cycle tests.
- `alembic heads` và migration smoke.
- Celery registered task names và Beat schedule.
- OpenAPI route/schema diff.
- Frontend unit/lint/type/build và critical E2E.
- Module disabled test và capability response.
- Docker Compose startup/readiness.

## 10. Điều không làm cùng lúc

- Không đổi auth/session trong pilot categories.
- Không hợp nhất hai bảng tài liệu trong lúc tạo registry.
- Không thay Gemini/MinIO thật khi chỉ thêm interface.
- Không redesign UI khi tách feature folder.
- Không xóa legacy imports trước khi đo và chuyển hết consumer.

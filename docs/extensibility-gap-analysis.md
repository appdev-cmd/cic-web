# Phân tích khoảng cách khả năng mở rộng RAG CIC

> Ngày phân tích: 20/07/2026  
> Phạm vi: phân tích kiến trúc và lập kế hoạch; chưa refactor hoặc thay đổi hành vi runtime.

## 1. Kết luận

Codebase hiện có phân lớp ban đầu (`api`, `models`, `schemas`, `repositories`, `services`, `tasks`) và đủ nhỏ để chuyển dần sang module hóa. Không nên di chuyển toàn bộ ngay. Vấn đề chính không phải số lượng file mà là ranh giới trách nhiệm chưa nhất quán: một số route làm cả validation, truy cập DB, gọi provider và nghiệp vụ; frontend page vừa gọi HTTP vừa quản lý state vừa render; provider được gọi qua hàm/global client thay vì interface.

Module thử nghiệm phù hợp nhất là **categories** vì đã có model và migration nhưng chưa có route/service/frontend đang phục vụ người dùng. Nó cho phép kiểm chứng registry, permission, feature flag, capability và test mà ít rủi ro hồi quy. `audit` đứng thứ hai nhưng sẽ sớm trở thành dependency dùng chung của nhiều module, nên không nên dùng làm thử nghiệm đầu tiên.

## 2. Module hiện có theo hành vi thực tế

| Module logic | Hiện trạng | Điểm vào chính |
|---|---|---|
| auth | Login, refresh, logout, JWT, role guard | `api/routes/auth.py`, `services/auth_service.py`, `core/security.py` |
| users | Model và repository đọc user | `models/user.py`, `repositories/user_repository.py` |
| products | List, import, keyword/vector/RRF | `api/routes/products.py`, `repositories/product_repository.py`, `models/product.py` |
| categories | Model/migration, chưa có nghiệp vụ | `models/category.py` |
| documents | Upload/list/status/reindex/delete, MinIO | `api/routes/documents.py`, `models/document_upload.py` |
| legal metadata | Dữ liệu Google Sheets pháp lý legacy | `models/document.py`, `cli/sync_google_data.py` |
| indexing | Extract/chunk/embed và Celery task | `services/document_processor.py`, `tasks/indexing.py` |
| search/RAG | Hybrid retrieval và sinh câu trả lời pháp lý | `api/routes/rag.py`, `services/rag_retrieval_service.py` |
| conversations | Chỉ có model | `models/conversation.py` |
| leads/handoff | Chỉ có model | `models/lead.py` |
| prompts/audit | Chỉ có model | `models/governance.py` |
| jobs/system | Celery app, Google schedule, health/metrics | `tasks/*`, `api/routes/health.py` |
| frontend auth | Login và lưu token | `components/auth/login-form.tsx`, `lib/auth.ts` |
| frontend admin | Layout/menu, products, documents, chat, dashboard | `app/admin/**` |

Các thư mục `agents`, `rag`, `prompts`, `tools` hiện chỉ chứa `__init__.py`; tên thư mục không đồng nghĩa với module đã hoạt động.

## 3. Dependency hiện tại

```text
main
 ├─ api.router
 │   ├─ auth route ── auth service ── user repository ── User
 │   ├─ products route ── ProductRepository ── Product
 │   │                  └─ embedding_service ── Gemini
 │   ├─ documents route ── DB models + MinIO global + Celery task
 │   └─ rag route ── embedding_service
 │                ├─ RagRetrievalService ── Documents/Chunks/LegalDocument
 │                └─ llm_service ── OpenAI/Gemini HTTP
 ├─ db/redis/config
 └─ health route

Celery
 ├─ indexing ── MinIO + extractor + embedding + Documents DB
 └─ google_sync ── Google APIs + MinIO + Documents DB + legacy CLI sync
```

Frontend:

```text
admin layout ── hard-coded menu + local token logout
page products ── shared apiRequest + direct fetch import
page documents ── shared apiRequest + direct fetch upload
page chat ── shared apiRequest
```

## 4. Coupling cao

### Backend

- `api/routes/documents.py` truy cập `AsyncSession`, model, MinIO global và Celery task trực tiếp. Route không mỏng và khó thay storage/job implementation.
- `api/routes/products.py` làm parse Excel, upsert, xây nội dung embedding và gọi embedding provider; repository chỉ được dùng một phần.
- `api/routes/rag.py` tự xây prompt, gọi embedding, retrieval và LLM. Thay pipeline/provider buộc sửa route.
- `tasks/indexing.py` biết trực tiếp MinIO, parser, embedding, model và transaction; task không phải thin adapter.
- `tasks/google_sync.py` import các hàm từ `cli/sync_google_data.py`, làm CLI trở thành dependency runtime.
- `core/config.py` gom mọi domain setting trong một class; chưa có module/provider-specific validation.
- `models/__init__.py` nhập toàn bộ model để Alembic discover; nếu chuyển module thiếu quy ước metadata import sẽ dễ mất migration autogenerate.

### Frontend

- `admin/layout.tsx` chứa menu, label route, active state và logout.
- Mỗi page products/documents/chat chứa type, API call, state, nghiệp vụ UI và component lớn.
- Upload/import dùng `fetch` trực tiếp, lặp lại token/base URL/error parsing.
- Không có capability/permission context; route và action không thể tắt độc lập.

## 5. File lớn và trách nhiệm trộn

| File | Dòng | Nhận xét |
|---|---:|---|
| `backend/app/cli/sync_google_data.py` | 406 | Google auth/download, mapping, DB upsert, embedding, indexing và CLI output |
| `frontend/src/app/admin/products/page.tsx` | 264 | API, import, search, state, table, alerts |
| `frontend/src/app/admin/documents/page.tsx` | 263 | API, upload/delete/poll, status mapping, table |
| `frontend/src/app/admin/chat/page.tsx` | 249 | API, conversation state, source viewer, suggestions, render |
| `backend/app/cli/index_drive_files.py` | 223 | Trùng download/index với sync/task |
| `backend/app/tasks/google_sync.py` | 207 | Provider, persistence, storage, orchestration và scheduling |
| `backend/app/api/routes/products.py` | 193 | HTTP + Excel + persistence + embedding |
| `backend/app/api/routes/documents.py` | 180 | HTTP + DB + storage + task dispatch |

Ngưỡng dòng chỉ là tín hiệu. Lý do cần tách là số trách nhiệm và dependency, không phải ép mọi file nhỏ.

## 6. Logic trùng lặp

- Google credentials/client/download xuất hiện ở `cli/index_drive_files.py`, `cli/sync_google_data.py` và `tasks/google_sync.py`.
- Lập chỉ mục tài liệu xuất hiện ở CLI và `tasks/indexing.py` với cách lưu `file_path`, chunk metadata và giới hạn xử lý khác nhau.
- Xây text embedding sản phẩm tồn tại trong import route và Google sync.
- Upload/import frontend lặp base URL, bearer token, `fetch`, parse error và reset input.
- Status/alert/loading/empty table được viết riêng trong page thay vì shared component.
- Cấu hình API URL có default trong client và lặp lại ở hai page.

## 7. Provider bị gọi trực tiếp

| Provider | Call site | Vấn đề |
|---|---|---|
| Embedding | products route, RAG route, indexing task, hai CLI sync | Hàm `get_embedding` buộc Gemini và không có batch contract chung |
| LLM | RAG route → `call_llm` | Provider switch nằm trong một hàm; prompt và lỗi không có typed request/result |
| Storage | documents route, Google task, indexing task | Global `minio_client`; `secure=False`; khó thay local/S3 |
| Google | CLI và task | Client construction/download/mapping trùng lặp |
| Search | repository và retrieval service | SQL cụ thể gắn thẳng pgvector/PostgreSQL, chưa có contract |
| Metrics | FastAPI instrumentator toàn cục | Chưa có module metrics/registration lifecycle |

## 8. Hard-code

### Route backend

`backend/app/api/router.py` import và `include_router` cứng bốn router. Health route được đăng ký riêng trong `main.py`. Không có module enable/disable hoặc collision detection.

### Permission backend

- Permission hiện là ba `UserRole` và dependency như `require_roles`.
- Admin/role được ghi trực tiếp tại endpoint.
- Chưa có catalog permission, mapping role-permission hay data scope.

### Route/menu/frontend

- `frontend/src/app/admin/layout.tsx` có mảng `menuItems` cứng cho dashboard/products/documents/chat.
- Route Next.js phụ thuộc filesystem; có thể dùng registry cho metadata/guard/navigation nhưng không nên giả vờ registry có thể tự tạo route runtime.
- API endpoint strings nằm trực tiếp trong page.
- Không có permission/feature guard và trang 403.

## 9. Khoảng cách so với kiến trúc mở rộng

| Năng lực | Hiện trạng | Khoảng cách |
|---|---|---|
| Module registry | Chưa có | Definition, enabled modules, router/permission/health/capability registration |
| Feature flags | Chưa có | Definitions/store/cache/audit/dependency/API |
| Capability API | Chưa có | User-aware modules/features/permissions |
| Provider interfaces | Chưa có | LLM/embedding/storage/reranker/notification contracts, factory, mocks |
| Event bus | Chưa có | Domain event, handler registry, failure/idempotency policy |
| Feature frontend | Chưa có | Public index, module API/hooks/components |
| Route/navigation registry | Chưa có | Metadata registry và capability filtering |
| Scaffold/contracts | Chưa có | Safe generator, provider/strategy contract tests |
| Architecture enforcement | Chưa có | Static checks/CI dependency rules |
| Removal/deprecation | Chưa có | Policy, dependency manifest và staged removal |

## 10. Rủi ro khi modular hóa

1. **Big-bang import breakage:** di chuyển models/routes sẽ làm hỏng Alembic imports, test monkeypatch paths và Celery task names.
2. **Dữ liệu/migration:** đổi Python import path không cần đổi table; nếu đổi table/schema cùng lúc sẽ tăng rủi ro không cần thiết.
3. **Celery compatibility:** task name đang là contract với queue/Beat; phải giữ alias cũ trong thời gian chuyển.
4. **OpenAPI/frontend:** đổi path hoặc response khi tách route sẽ phá UI hiện tại.
5. **Registry quá động:** FastAPI/Next.js hưởng lợi từ registration rõ ràng, nhưng dynamic plugin discovery tùy tiện gây khó type-check và debug.
6. **Feature flag lạm dụng:** flag không thay permission; flag DB không được làm app không boot khi DB lỗi.
7. **Event consistency:** event in-process không bền; handler nặng phải qua Celery/outbox khi cần guarantee.
8. **Circular dependencies:** RAG dễ phụ thuộc documents/products/conversations/leads và ngược lại; cần interface/event và dependency direction.
9. **Provider abstraction quá sớm:** chỉ tạo contract dựa trên hành vi đang dùng; không xây mọi provider giả định ngay.
10. **Test false confidence:** mock contract không thay integration test với MinIO/Gemini/PostgreSQL thật.

## 11. Module chuyển thử đề xuất: categories

Lý do:

- Model và migration đã có, không cần đổi bảng ở bước đầu.
- Chưa có API/UI consumer nên có thể giữ hoàn toàn tương thích.
- Có đủ lát cắt để kiểm chứng: repository → service → schema → router → permission → feature → capability → frontend registry → test.
- Không phải cross-cutting dependency như audit/auth.

Tiêu chí thử nghiệm:

- `categories` bật: router xuất hiện, capability true, permission được đăng ký.
- `categories` tắt: router trả 404, capability false, menu không xuất hiện, app vẫn boot, dữ liệu không bị xóa.
- Không đổi bảng `product_categories`, không đổi product API hiện tại.

## 12. File dự kiến tạo và sửa ở bước nền tảng sau báo cáo

### Tạo

- `backend/app/core/module_registry.py`
- `backend/app/modules/__init__.py`, `backend/app/modules/registry.py`
- `backend/app/core/features/{__init__,definitions,service,repository,dependencies}.py`
- `backend/app/modules/system/{__init__,router,schemas,service,permissions}.py`
- `backend/app/core/ai/llm/*`, `backend/app/core/ai/embeddings/*`, `backend/app/core/ai/rerankers/*`
- `backend/app/core/storage/*`, `backend/app/core/events/*`
- `backend/app/modules/categories/*` với các file có trách nhiệm thực tế và tests
- `backend/tests/contracts/*`
- `frontend/src/shared/api/*`, guards/capability context tối thiểu
- `frontend/src/features/categories/*`
- `frontend/src/app/route-registry.ts`, `frontend/src/app/navigation-registry.ts`
- `scripts/scaffold/*`, scripts kiểm tra/list module/feature
- Tài liệu/checklist/template/ADR được yêu cầu ở giai đoạn tương ứng.

### Sửa

- `backend/app/api/router.py`, `backend/app/main.py`, `backend/app/core/config.py`
- `backend/app/models/__init__.py`, `backend/app/tasks/celery_app.py`
- `frontend/src/app/admin/layout.tsx`, `frontend/src/lib/api.ts`, `frontend/src/components/providers.tsx`
- `AGENTS.md`, `README.md`, `CHANGELOG.md`, Compose/CI chỉ khi nền tảng tương ứng được triển khai.

Danh sách trên là kế hoạch, không phải quyền sửa đồng loạt. Mỗi bước sau phải thu hẹp file, thêm test và rollback riêng.

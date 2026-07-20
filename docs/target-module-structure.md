# Cấu trúc module mục tiêu

## 1. Cấu trúc phù hợp codebase hiện tại

```text
backend/app/
├── core/
│   ├── ai/
│   │   ├── llm/
│   │   ├── embeddings/
│   │   └── rerankers/
│   ├── events/
│   ├── features/
│   ├── notifications/
│   ├── storage/
│   ├── config.py                 # giữ adapter trước, tách dần khi cần
│   └── module_registry.py
├── modules/
│   ├── registry.py
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── documents/
│   ├── search/
│   ├── rag/
│   ├── conversations/
│   ├── leads/
│   ├── prompts/
│   ├── audit/
│   ├── jobs/
│   └── system/
├── api/                          # compatibility/composition adapters
├── db/
└── main.py

frontend/src/
├── app/                          # Next.js filesystem routes, thin page adapters
│   ├── route-registry.ts
│   └── navigation-registry.ts
├── config/
├── features/
│   ├── auth/
│   ├── products/
│   ├── categories/
│   ├── documents/
│   ├── chat/
│   └── ...
├── shared/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── permissions/
│   └── types/
└── generated/
```

## 2. Module backend tối thiểu

Không module nào bắt buộc đủ 13 file. Chọn theo trách nhiệm:

```text
modules/categories/
├── __init__.py       # public exports tối thiểu
├── definition.py     # ModuleDefinition/composition
├── models.py         # có thể re-export model cũ trong giai đoạn chuyển
├── schemas.py
├── repository.py
├── service.py
├── router.py
├── permissions.py
└── tests/
```

Chỉ thêm:

- `tasks.py` khi có Celery task;
- `events.py` khi module phát/consume domain event;
- `metrics.py` khi có metric riêng;
- `dependencies.py` khi dependency injection không dùng chung;
- `exceptions.py` khi có lỗi domain cần map;
- `constants.py` khi enum/constant là contract của module.

## 3. Public API và dependency direction

```text
router -> service -> repository -> model/database
                 -> provider interface
                 -> event publisher
```

- Module khác gọi public service/protocol được export từ `__init__.py`, không import repository nội bộ.
- Module không import router của module khác.
- Cross-module side effect dùng event; truy vấn đồng bộ quan trọng dùng public service/interface.
- Core không import domain modules. Composition root/registry được phép import core và module definitions.
- SQLAlchemy relationships có thể tham chiếu tên bảng/forward reference để giảm import vòng.

## 4. Module Definition

Thiết kế đề xuất:

```python
@dataclass(frozen=True, slots=True)
class ModuleDefinition:
    name: str
    enabled: bool
    router: APIRouter | None = None
    permissions: tuple[str, ...] = ()
    task_names: tuple[str, ...] = ()
    health_checks: tuple[HealthCheck, ...] = ()
    capability_key: str | None = None
    dependencies: tuple[str, ...] = ()
```

Registry chịu trách nhiệm validate uniqueness/dependency/order và include router. Registry không tự scan filesystem.

## 5. Feature frontend tối thiểu

```text
features/categories/
├── api/categories-api.ts
├── components/category-list.tsx
├── hooks/use-categories.ts
├── types/index.ts
├── permissions.ts
├── routes.ts
├── navigation.ts
└── index.ts
```

App Router page vẫn tồn tại tại `app/admin/categories/page.tsx`, nhưng chỉ compose feature page/component. Next.js không hỗ trợ tạo filesystem route chỉ bằng runtime registry; registry là metadata cho guard, breadcrumb và navigation.

## 6. Shared frontend

Chỉ tạo shared component sau khi có ít nhất hai consumer hoặc khi là security boundary:

- Tạo sớm: API client, capability context, PermissionGuard, FeatureGuard, RouteGuard, error mapping.
- Tạo khi tách page: LoadingState, EmptyState, ErrorState, AsyncButton, ConfirmDialog.
- Chưa tạo DataTable tổng quát cho tới khi requirements products/documents/categories đủ rõ.

## 7. RAG structure mục tiêu

```text
modules/rag/
├── definition.py
├── router.py
├── service.py
├── pipeline.py
├── context.py
├── result.py
├── strategies/{base,legal,product,mixed,fallback}.py
├── retrieval/{keyword,vector,fusion,deduplication,reranking,neighbor_expansion}.py
├── validation/{context_sufficiency,citation_validation,grounding_validation}.py
└── prompts/{legal,product,mixed,fallback}.py
```

Pipeline phụ thuộc protocols cho retrieval/LLM/reranker, không phụ thuộc concrete Gemini/pgvector. Chỉ tạo file strategy/step khi triển khai hành vi đó; giai đoạn đầu có thể bọc legal pipeline hiện hữu trong ít file hơn.

## 8. Cấu hình

Giữ `core/config.py` làm facade để tránh sửa toàn bộ import. Tách dần thành nhóm settings khi module/provider được chuyển. Enabled modules và provider names phải được validate; secret chỉ ở backend environment/secret manager.

## 9. Test placement

- Unit gần module hoặc trong `backend/tests/modules/<name>`; chọn một convention và dùng thống nhất.
- Contract tests ở `backend/tests/contracts`.
- Integration DB dùng fixture/migration thật, không mock SQLAlchemy behavior.
- Frontend feature tests gần feature; E2E theo critical journey.
- Architecture tests chạy riêng và tăng từ warning thành failure sau migration window.

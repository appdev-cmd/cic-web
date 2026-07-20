# Bản đồ dependency module RAG CIC

## 1. Quy ước

- `A → B`: A phụ thuộc trực tiếp B.
- `event`: dependency bất đồng bộ/lỏng, không yêu cầu gọi service trực tiếp.
- `optional`: module có thể tắt nếu consumer xử lý capability/fallback.

## 2. Hiện tại

```text
auth → users → database
auth → redis

products → database
products → embeddings → Gemini

categories → database
products → categories (schema relation, chưa có service)

documents → database
documents → MinIO
documents → indexing task

indexing → documents
indexing → extraction/chunking
indexing → embeddings
indexing → MinIO

rag → embeddings
rag → retrieval → documents + legal_documents + pgvector/PostgreSQL
rag → LLM → Gemini/OpenAI

google_sync → Google APIs
google_sync → products + legal_documents + documents
google_sync → MinIO + indexing + Redis lock

conversations ─┐
leads/handoff  ├─ database only; chưa có runtime consumer
prompts/audit ─┘
```

## 3. Đích

```text
system/composition
 ├─ module registry
 ├─ feature flags
 └─ capability service → auth permissions

auth → users
auth → permissions
auth ─event→ audit

products → categories
products → brands
products → embedding interface
products ─event→ audit/jobs

documents → storage interface
documents → extraction/chunking interfaces
documents → embedding interface
documents → jobs
documents ─event→ audit

search → keyword/vector interfaces
search → reranker interface (optional/noop)
search → products/documents read ports

rag → intent classifier
rag → search
rag → LLM interface
rag → prompts
rag → authorization/data scope
rag ─event→ conversations/audit/metrics

chat → rag
chat → conversations
chat → leads/handoff (optional)

leads → users (assignment)
leads → notifications (optional/noop)
leads ─event→ audit/CRM integration

jobs → Celery/Redis
google_sync → Google provider + products/documents public services + jobs
```

## 4. Ma trận dependency đích

| Module | Phụ thuộc bắt buộc | Phụ thuộc tùy chọn/event | Consumer chính |
|---|---|---|---|
| auth | users, security primitives, session store | audit | mọi API bảo vệ |
| users | database | audit, notifications | auth, leads, admin |
| permissions | users/roles/config | audit | capability, routers |
| products | database, embedding interface | categories, brands, jobs, audit | search, chat, admin |
| categories | database | audit | products, admin |
| documents | database, storage | jobs, extraction, embedding, audit | search/RAG/admin |
| search | document/product read ports | reranker | RAG, product search |
| rag | search, LLM, prompts, permissions | conversations, handoff, metrics | chat |
| conversations | database, users | audit | chat, CRM |
| leads | database, users | conversations, notifications, CRM, audit | chat/admin |
| prompts | database | audit | RAG |
| audit | audit storage | export | mọi module qua event/writer |
| jobs | queue/store | notifications, metrics | documents/sync/reindex/export |
| notifications | provider interface | jobs | leads/system |
| system | registry/features/capability | health/metrics | frontend/admin |

## 5. Khả năng tắt/xóa độc lập

| Module | Tắt được? | Điều kiện trước khi xóa |
|---|---|---|
| categories | Có, pilot tốt | Products phải chấp nhận category legacy/null; bỏ route/menu/permission; giữ bảng trong deprecation |
| notifications | Có với noop | Consumer không coi notification là transaction bắt buộc |
| reranker | Có với noop | RAG pipeline có fallback fusion result |
| leads/handoff | Có | Chat ẩn CTA và không dispatch event; giữ conversation |
| conversations | Có một phần | Chat phải hỗ trợ stateless mode; citation/feedback phụ thuộc được tắt |
| prompts | Không nếu RAG dùng DB-only | Có default/version active fallback trước khi tắt |
| audit | Không nên | Mọi security/admin mutation cần audit sink; có noop chỉ dành test, không production |
| products | Có nếu legal-only deployment | Chat/router/capability không quảng bá product intent |
| documents | Không với legal RAG hiện tại | RAG/search phải tắt hoặc có nguồn khác |
| search | Không với RAG | RAG phải tắt/fallback/handoff |
| RAG/chat | Có | Admin/data modules vẫn hoạt động |
| auth/users | Không đối với admin app | Cần authentication provider thay thế hoàn chỉnh |
| jobs | Có hạn chế | Tắt upload/reindex/sync/export cần background work |
| system registry/capability | Không | Là composition/control plane |

## 6. Chu kỳ cần tránh

- `documents ↔ rag`: documents chỉ phát event/index; RAG đọc qua search/read port.
- `products ↔ categories`: categories không gọi product repository; kiểm tra in-use qua query port/service hoặc DB constraint phù hợp.
- `auth ↔ audit`: auth phát audit event; audit không phụ thuộc auth service, chỉ actor ID/context.
- `chat ↔ leads`: chat phát handoff/lead command; leads không import chat service.
- `jobs ↔ domain`: job runner gọi public domain service; domain chỉ enqueue qua job port, không import concrete Celery task.

## 7. Ownership dữ liệu

Mỗi bảng có một owner module. Module khác không ghi trực tiếp bảng của owner. Cross-module read ưu tiên public read service/projection; join repository trực tiếp chỉ được ADR hóa khi hiệu năng/transaction yêu cầu. Hiện vi phạm đáng chú ý là Google sync và RAG retrieval truy cập nhiều model trực tiếp; đây là các điểm cần adapter đầu tiên sau pilot.

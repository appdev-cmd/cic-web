# Kiến trúc đích RAG CIC

## 1. Mục tiêu

Kiến trúc đích giữ stack Next.js/FastAPI/PostgreSQL-pgvector/Redis/Celery/MinIO, nhưng tách rõ policy, domain, pipeline RAG và operations. Supabase self-host hoặc cloud được xem là một triển khai PostgreSQL chuẩn qua cấu hình; Compose không được ép khởi động PostgreSQL local khi môi trường dùng Supabase.

## 2. Sơ đồ logic

```text
                        +-------------------+
                        | Next.js Web App   |
                        | Admin + Chat/CRM  |
                        +---------+---------+
                                  |
                         HTTPS / secure cookie
                                  |
                     +------------v------------+
                     | Nginx / API Gateway     |
                     | headers, limits, TLS    |
                     +------------+------------+
                                  |
              +-------------------v-------------------+
              | FastAPI Application                  |
              | request ID | auth | policy | audit   |
              +------+-------------+----------+------+
                     |             |          |
          +----------v--+   +------v------+  +v----------------+
          | Core Admin  |   | RAG Orchestrator| | Conversation/CRM|
          | users/data  |   | intent + gates | | feedback/handoff|
          +------+------+
                 |              |                  |
                 +--------------+------------------+
                                |
              +-----------------v------------------+
              | Domain services/repositories      |
              +-------+-----------+---------+------+
                      |           |         |
       +--------------v--+  +-----v----+ +--v-------------+
       | PostgreSQL       |  | Redis    | | MinIO/S3       |
       | relational+vector|  | cache/   | | originals      |
       | Supabase or local|  | queue/lock| | versions       |
       +------------------+  +----+-----+ +----------------+
                                  |
                     +------------v-------------+
                     | Celery workers / beat    |
                     | index, sync, eval, export|
                     +------------+-------------+
                                  |
                +-----------------v----------------+
                | LLM / Embedding / Reranker       |
                | provider adapters + telemetry    |
                +----------------------------------+
```

## 3. Ranh giới module backend

```text
app/
  api/                 # HTTP contracts only
  core/                # config, errors, logging, security, telemetry
  auth/                # sessions, token rotation, permissions, policies
  users/
  catalog/             # products, categories, brands, imports
  documents/           # metadata, files, versions, lifecycle
  jobs/                # execution registry/progress/retry
  rag/
    router/            # intent/entities/confidence
    pipelines/         # legal/product/mixed/fallback/handoff
    retrieval/         # normalize/filter/search/RRF/rerank/neighbor
    generation/        # context/prompt/model/citation/grounding
    indexing/           # chunks/embeddings/index versions
  conversations/       # messages, citations, feedback
  crm/                 # leads, history, handoff
  governance/          # prompts, audit, settings
  integrations/        # Google, MinIO, LLM, embedding, reranker
  tasks/               # thin Celery entrypoints calling services
```

Không cần di chuyển hàng loạt ngay. Cấu trúc này là đích; mỗi phase chỉ tách module đang thay đổi và duy trì adapter tương thích.

## 4. Auth và policy

### Session model

- Refresh token ngẫu nhiên/JWT có `jti`, `family_id`, `session_id`; DB/Redis chỉ lưu hash.
- Mỗi lần refresh: transaction khóa session, kiểm tra token hiện hành, revoke token cũ, phát token mới.
- Reuse: revoke family và ghi audit/security event.
- Metadata: user, device label/fingerprint tối thiểu, IP/user-agent có chính sách retention, created/last-used/expires/revoked.
- Khuyến nghị browser: refresh token trong HttpOnly + Secure + SameSite cookie; access token ngắn hạn trong memory. Nếu vẫn dùng Web Storage phải có threat model và CSP chặt.

### Authorization

```text
request -> authenticate -> permission check -> data-scope predicate -> domain service
```

- Permission là capability ổn định; role chỉ là tập permission mặc định.
- Data scope áp vào truy vấn repository: all/department/assigned/self.
- Backend là nguồn quyết định; frontend chỉ dùng permission để điều hướng và trình bày.

## 5. Mô hình dữ liệu mục tiêu

### Catalog

- `products`: soft delete, embedding/index state, canonical `category_id`, `brand_id`.
- `categories`: `parent_id`, enabled, sort path.
- `brands`: unique normalized name, enabled.
- `import_jobs` + `import_rows`: preview/mapping/mode/error/result/idempotency.

### Documents/index

- `legal_documents`: metadata pháp lý canonical, effective status, relations, visibility/scope.
- `document_versions`: original file/checksum/source version/created-by/status.
- `document_chunks`: hierarchy, position, page range, parent/prev/next, checksum.
- `index_versions`: provider/model/dimension/config/status active|building|validating|retained|failed.
- Embedding record gắn với content checksum và index version; active alias chọn phiên bản truy vấn.
- `job_executions`: task ID/type/entity/progress/step/retry/error/timestamps.

### Conversation/CRM/governance

- `conversations`, `messages`, `citations`, `feedback`.
- `customer_leads`, `lead_status_history`, `lead_notes`, `human_handoffs`, consent metadata.
- `prompt_versions` có draft/approved/active/retired, author/approver/changelog/model constraints.
- `audit_logs` append-only với actor/action/entity/before-after/trace/IP policy.

## 6. Pipeline RAG mục tiêu

```text
Input validation + injection signals
                |
Query normalization
                |
Intent/entity router (structured + confidence)
                |
Permission / visibility / effective-state filters
                |
  +-------------+-------------+----------------+
  | Legal       | Product     | Mixed          |
  | retrieval   | retrieval   | balanced merge |
  +-------------+-------------+----------------+
                |
keyword + vector + exact entity boosts
                |
RRF -> dedupe -> reranker -> diversity -> neighbors
                |
dynamic top-k + context budget + sufficiency gate
                |
versioned prompt + LLM structured response
                |
citation validation + grounding verification
                |
persist trace/message/citations/metrics
                |
answer | clarification | safe refusal | human handoff
```

### Bất biến an toàn

- Không retrieval nguồn ngoài scope của user.
- Không gọi LLM trả lời thực chứng khi context dưới ngưỡng.
- Citation chỉ được trỏ tới chunk đã retrieval và được lưu bằng ID.
- Nguồn hết hiệu lực phải bị cảnh báo; nguồn active/newer được ưu tiên theo policy.
- Dữ liệu tài liệu được coi là untrusted content, không phải instruction.
- Provider failure là typed error/fallback, không trở thành nội dung câu trả lời.

## 7. Indexing an toàn

```text
upload -> quarantine -> validate/scan -> store immutable original
       -> create document version -> parse -> hierarchical chunks
       -> batch embed into pending index -> validate/evaluate
       -> atomic active-version switch -> retain prior version
```

- Task idempotent theo document version + index version.
- Checkpoint và retry theo batch; không xóa index active trước khi pending hoàn tất.
- Progress và lỗi được ghi vào `job_executions`; UI poll/SSE theo nhu cầu.

## 8. Frontend mục tiêu

- Server/middleware route protection kết hợp client session hydration.
- Một API client chuẩn hóa refresh, error envelope, request ID và abort/retry policy.
- Navigation dựa permission; trang 403 rõ ràng.
- Design system được trích xuất vào `.stitch/DESIGN.md` trước redesign; tokens CSS và shadcn primitives là nguồn UI chung.
- Mọi màn hình có loading/skeleton, empty, error, permission, offline/timeout và destructive-confirmation state.
- Tables có pagination/filter/sort, responsive overflow, keyboard access và accessible names.
- Chat có history, citation viewer, status/effectivity badge, feedback và handoff/lead flow.

## 9. Deployment theo môi trường

### Local thuần Compose

Compose chạy PostgreSQL-pgvector, Redis, MinIO, API, migration one-shot, worker, beat, frontend và Nginx.

### Local/production dùng Supabase

Không khởi động hoặc không phụ thuộc service PostgreSQL local. API/migration/worker cùng dùng một `DATABASE_URL` được secret manager cấp. Supabase Studio/API không thay thế URL kết nối PostgreSQL của SQLAlchemy.

### Quy tắc

- Một file Compose chuẩn và override/profile theo môi trường.
- Migration là one-shot deployment step có lock, không chạy trong từng replica API.
- Container non-root, health checks, resource limits, read-only filesystem nơi phù hợp.
- Secret không commit/log; TLS cho external DB/object/provider; key rotation/runbook.

## 10. Observability và độ tin cậy

- Structured JSON logs: timestamp, level, service, env, request/trace ID, user ID đã pseudonymize, route, latency, status/error code.
- OpenTelemetry trace xuyên Nginx/API/Celery/provider; không ghi prompt/document nhạy cảm mặc định.
- Metrics: HTTP, DB pool, Redis, queue age, job success/retry, indexing throughput, retrieval scores, router/handoff/refusal, token/cost, feedback.
- SLO đề xuất cần benchmark rồi chốt: availability, p95 API/RAG, job completion, error/citation-invalid rate.
- Alert theo symptom và burn rate; dashboard tách product/document/RAG/CRM/operations.

## 11. Backup/restore

- PostgreSQL PITR hoặc scheduled dump; MinIO versioning/replication; export cấu hình/prompt không chứa secret.
- Mã hóa, checksum, retention, quyền truy cập riêng và off-site copy.
- Restore vào môi trường cô lập; kiểm tra schema, object linkage, vector/index version và RAG smoke.
- Restore drill định kỳ là release/operations gate, không chỉ kiểm tra file backup tồn tại.

## 12. Quality gates

| Gate | Yêu cầu tối thiểu |
|---|---|
| Code | lint/type/unit/integration pass; migration upgrade/downgrade tested |
| Security | auth/session/permission/upload/injection negative tests; không critical/high mở |
| RAG | baseline dataset; retrieval/citation/grounding/refusal không regression ngoài ngưỡng |
| UI | production build, critical E2E, responsive viewports, accessibility scan/keyboard |
| Operations | compose/deploy smoke, health/readiness, rollback và restore path được chứng minh |

## 13. Quyết định cần xác nhận trước Phase 1

1. DB chuẩn cho dev và production: Supabase self-host, Supabase cloud hay PostgreSQL Compose.
2. Refresh token transport: HttpOnly cookie (khuyến nghị) hay tiếp tục bearer/Web Storage.
3. Data scope tổ chức: department, assigned-owner hay cả hai; nguồn user/department chuẩn.
4. Canonical legal document: hợp nhất `legal_documents` và `documents` hay giữ metadata/file-version tách nhưng có quan hệ rõ.
5. Reranker/provider và ngưỡng latency/cost/evaluation chấp nhận được.

# Lộ trình triển khai RAG CIC

## Nguyên tắc điều hành

- Mỗi phase có migration, API contract, test và tiêu chí thoát riêng.
- Không thay index/schema đang hoạt động nếu chưa có đường rollback.
- Ưu tiên lát cắt dọc nhỏ, có thể demo và đo được.
- Mọi thay đổi RAG phải chạy evaluation baseline; mọi thay đổi UI phải qua browser và accessibility audit.
- Giữ tương thích chức năng hiện tại cho đến khi luồng thay thế đã được kiểm chứng.

## Phase 0 — Audit và baseline (đã hoàn thành tài liệu)

**Mục tiêu:** thống nhất hiện trạng, kiến trúc đích, thứ tự và tiêu chí kiểm chứng.

**Đầu ra:** bốn tài liệu trong `docs/`; kết quả test baseline; danh sách rủi ro.

**Điều kiện thoát:** stakeholder xác nhận scope và thứ tự ưu tiên; quyết định dùng PostgreSQL Compose hay Supabase làm DB chuẩn cho từng môi trường.

## Phase 1 — Ổn định auth, RBAC và runtime

**Ưu tiên:** P0, 1–2 sprint.

- Session/refresh token store dạng hash, rotation, reuse detection, revoke family/device/all sessions.
- Frontend logout gọi API; refresh tự động; route guard; 401/403 chuẩn.
- Permission + role mapping + data scope; policy dependency ở backend.
- Rate limit login/refresh/upload/RAG; generic error envelope; request ID; security headers.
- Chốt topology Docker/Supabase; tách migration job khỏi backend startup; bỏ compose trùng; non-root worker.
- Upload boundary: size/MIME/signature/page cap, filename sanitization và đường quét malware.

**Migration:** auth sessions, permissions, role mappings, user login/security fields.

**Test gate:** rotation/reuse/logout/expiry/403/data scope; upload negative cases; compose smoke; backend suite chạy được trong container.

## Phase 2 — Quản trị lõi

**Ưu tiên:** P1, 2–4 sprint.

### 2A. Users và catalog

- User list/create/detail/update/disable/reset/revoke sessions; bảo vệ last-admin.
- Product CRUD, soft-delete/restore, embedding status/reindex, pagination/filter/sort/bulk/export.
- Import preview/mapping/modes/error file/idempotency; chỉ re-embed khi searchable content đổi.
- Category tree/disable/stats và Brand CRUD.

### 2B. Documents và jobs

- Chuẩn hóa canonical legal document giữa metadata và file/chunks.
- Metadata pháp lý/effective status/relations/visibility/department scope.
- Preview/download/edit/retry/reindex/soft-delete/restore/permanent-delete/version/checksum.
- Job execution model, progress/current step/task ID/retry/error/timestamps; API/UI jobs.
- Quản trị Google sync: configuration status, run now, log, retry và version.

**Test gate:** CRUD/permissions/concurrency/import transaction/document lifecycle/job retry/Google idempotency; UI E2E cho các happy path và lỗi chính.

## Phase 3 — Chất lượng và an toàn RAG

**Ưu tiên:** P1, 3–5 sprint.

- Intent router có structured output: legal/product/mixed/lead/general/unsupported.
- Tách Legal/Product/Mixed/Fallback/Handoff pipeline.
- Query normalization, entity extraction, metadata/data-scope filter.
- Hierarchical chunks với parent/previous/next/page range; exact match boost.
- Vector + keyword + RRF + reranker + diversity + neighbor expansion + dynamic top-k.
- Context sufficiency gate, effective-status warning và safe refusal.
- Citation persistence/validation; grounding check; prompt-injection filtering.
- Prompt registry/versioning/approval/rollback; model/token/latency/trace recording.
- Blue/green index versioning, validation, alias switch và rollback.

**Migration:** document/index versions, hierarchical chunk links, conversation/message extensions, citations, prompt lifecycle.

**Test gate:** evaluation dataset baseline; retrieval/citation/groundedness/refusal metrics đạt ngưỡng đã thống nhất; security red-team cases pass.

## Phase 4 — Conversation, feedback và CRM

**Ưu tiên:** P1/P2, 2–4 sprint.

- Lưu và quản lý conversation/message/citation; rename/delete/search/continue/regenerate/copy.
- Feedback taxonomy + review queue; không tự động sửa prompt.
- Handoff rule engine; lead form với validation số Việt Nam và consent.
- Lead CRUD/assign/status/history/note/export/conversation link.
- UI conversation sidebar, source viewer, feedback, handoff, leads.

**Migration:** feedback, lead consent/intent/priority/product/document fields, notes/notifications.

**Test gate:** privacy/permission, consent validation, transition rules, handoff accuracy, full E2E.

## Phase 5 — Evaluation, dashboard và operations

**Ưu tiên:** P2, 2–4 sprint rồi duy trì liên tục.

- `evaluation/` dataset/evaluators/rubrics/reports/scripts; comparison prompt/model/embedding/chunk/top-k/RRF/reranker.
- Dashboard product/document/RAG/CRM/operations từ metrics thật.
- Structured logs, trace, metrics, alerts, SLO/error budget, cost/token reporting.
- Backup/restore PostgreSQL + MinIO + configuration; retention/encryption/restore drill.
- CI/CD: lint/type/unit/integration/security/build/migration/E2E; image scan/SBOM; staged deployment/rollback.
- UX polish theo `.stitch/DESIGN.md`, shadcn, responsive và WCAG audit.

**Test gate:** scheduled evaluation regression; restore drill thành công; alert test; load target; zero critical accessibility/security findings.

## Trình tự phụ thuộc

```text
Runtime + Auth/RBAC
        |
        +--> Users/Catalog
        +--> Documents/Jobs/Google
                    |
                    v
          RAG pipelines + Index versioning
                    |
                    v
       Conversation/Feedback/Handoff/CRM
                    |
                    v
       Evaluation/Dashboard/Ops/UX release gate
```

## Quy tắc báo cáo sau mỗi phase

Mỗi lần bàn giao phải ghi: mục tiêu và kết quả; file thay đổi; migration/backfill/rollback; API contract; UI states; test đã chạy và kết quả; metrics trước/sau; rủi ro còn lại; việc bị hoãn có lý do.

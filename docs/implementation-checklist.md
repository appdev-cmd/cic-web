# Checklist triển khai RAG CIC

Quy ước: `[ ]` chưa làm, `[x]` đã có và được audit xác nhận, `[~]` có một phần.

## Phase 0 — Audit

- [x] Đọc README, AGENTS, cấu trúc frontend/backend, models, migrations, routes, services, Compose.
- [x] Đọc 10 skill bắt buộc và tài liệu tham chiếu liên quan.
- [x] Lập bản đồ module và gap analysis.
- [x] Tạo kiến trúc đích, roadmap và checklist.
- [x] Chạy frontend test/lint/build và Compose config.
- [~] Backend test: bị chặn trên host bởi dependency `jwt` chưa cài trong môi trường chạy.
- [ ] Xác nhận DB chuẩn theo môi trường: Supabase hay PostgreSQL trong Compose.

## Phase 1 — Auth, permission, runtime

- [~] Login email/password và JWT access/refresh.
- [ ] Refresh session table/store với token hash, family, user, device, expiry.
- [ ] Rotation và revoke token đã dùng.
- [ ] Reuse detection và revoke toàn bộ family.
- [~] Logout API; [ ] frontend gọi API và xóa trạng thái an toàn.
- [ ] Revoke one/all sessions và active-session view.
- [ ] Frontend middleware/guard cho toàn bộ admin route.
- [ ] Automatic refresh; refresh fail => logout; trang 401/403.
- [~] Role guards; [ ] permission catalog; role-permission; data scope.
- [ ] Last-admin and privilege-escalation protections.
- [ ] Login attempt throttling/lockout và audit.
- [ ] Rate limit riêng cho auth/upload/import/RAG.
- [ ] Request ID, error envelope, exception sanitization.
- [~] Nginx headers; [ ] CSP/HSTS/Permissions-Policy.
- [ ] Upload size/MIME/signature/page/malware validation.
- [ ] Chọn một Compose file; tách migration job; non-root worker.
- [ ] Backend tests pass trong môi trường tái lập được.

## Phase 2 — Users, products, catalog, documents, jobs

### Users

- [ ] List/create/detail/update/role/disable/enable/reset password.
- [ ] Search/filter/pagination và session view.
- [ ] Revoke all sessions; last login/status.
- [ ] Audit log và negative authorization tests.
- [ ] `/admin/users`, `/admin/users/new`, `/admin/users/[id]`.

### Products/import

- [~] List/search/import/upsert/RRF.
- [ ] Create/detail/update/soft-delete/restore.
- [ ] Single/bulk reindex và embedding status.
- [ ] Pagination/filter category/brand/stock/sort/bulk/export.
- [ ] Import preview, mapping, per-row errors, error download.
- [ ] create-only/update-only/upsert/skip-invalid/all-or-nothing.
- [ ] Duplicate/race protection và content-change-aware embedding.

### Category/brand

- [~] Minimal category table.
- [ ] Category CRUD/tree/disable/stats/in-use protection.
- [ ] Brand model, CRUD và product relation.
- [ ] Admin UI.

### Documents/jobs/Google

- [~] Upload/index/list/status/reindex API/hard delete.
- [ ] Canonical legal document design và metadata đầy đủ.
- [ ] Effective states/relations/visibility/department scope.
- [ ] Preview/download/edit/hide from RAG.
- [ ] Soft-delete/restore/permanent-delete/version/checksum duplicate.
- [ ] Processing progress/step/retry/error/times/task ID/index version.
- [ ] Job list/detail/retry/cancel/log and dead-letter strategy.
- [~] Google sync jobs; [ ] status/config/log/run/retry UI and idempotency.

## Phase 3 — RAG quality/security

- [ ] Structured intent router và confidence policy.
- [ ] Legal/Product/Mixed/Fallback/Handoff pipelines.
- [ ] Query normalization/entity extraction/metadata filter.
- [~] Chapter/article/clause parsing; [ ] full hierarchy and neighbor links.
- [~] Keyword/vector/RRF; [ ] reranker/diversity/exact boosts.
- [ ] Dynamic top-k/context budget.
- [ ] Context sufficiency/effective status/permission gate.
- [ ] Safe refusal and low-confidence clarification.
- [ ] Citation table/persistence/validation/completeness.
- [ ] Grounding/faithfulness verification.
- [ ] Prompt injection input/context/output defenses.
- [ ] Prompt version publish/approve/rollback/testing.
- [ ] Embedding/index version metadata and blue/green switch/rollback.
- [ ] Batch reindex, checkpoint, progress and validation.

## Phase 4 — Conversation, feedback, CRM

- [~] Conversation/message/lead/handoff/history models.
- [ ] Conversation/message/citation repositories, services and APIs.
- [ ] History/new/rename/delete/continue/search/copy/regenerate.
- [ ] Feedback model/API/UI/review workflow.
- [ ] Handoff rules, priority, assignment, resolution.
- [ ] Lead validation (Vietnam phone), consent and duplicate policy.
- [ ] Lead CRUD/assign/status/note/export/conversation link.
- [ ] Chat history/source/feedback/handoff UI.
- [ ] `/admin/leads` và `/admin/leads/[id]`.

## Phase 5 — Evaluation, dashboard, operations, UX

- [ ] Tạo cấu trúc `evaluation/`.
- [ ] Dataset 12 nhóm bắt buộc.
- [ ] Retrieval metrics: hit/recall/precision/MRR/NDCG.
- [ ] Generation metrics: faithfulness/groundedness/relevance/citation/hallucination/refusal/handoff.
- [ ] Operational metrics: latency/token/error/cost.
- [ ] Comparison runner và JSON/Markdown reports.
- [ ] Product/document/RAG/CRM/operations dashboards.
- [~] Health/readiness/process metrics; [ ] traces/business metrics/alerts/SLO.
- [ ] Backup Postgres/MinIO/config, encryption/retention/restore drill.
- [ ] CI lint/type/unit/integration/security/build/migration/E2E.
- [ ] Container image scan/SBOM/staging/rollback.
- [ ] Tạo `.stitch/DESIGN.md` trước redesign.
- [ ] Chuẩn hóa shadcn components/tokens/states/responsive.
- [ ] Browser E2E cho mọi critical flow.
- [ ] Accessibility scan + keyboard + screen-reader smoke; sửa toàn bộ critical/high.

## Definition of Done cho mỗi hạng mục

- [ ] Acceptance criteria và out-of-scope được ghi rõ.
- [ ] Migration/backfill/downgrade/rollback đã kiểm thử nếu có DB change.
- [ ] Backend enforcement tồn tại; không dựa vào ẩn UI.
- [ ] Loading/empty/error/success/permission states đã xử lý.
- [ ] Unit/integration/E2E/security/a11y phù hợp đã pass.
- [ ] Logs/metrics không chứa secret/PII không cần thiết.
- [ ] Tài liệu API/runbook/changelog được cập nhật.
- [ ] Không làm giảm baseline RAG hoặc hiệu năng ngoài ngưỡng đã duyệt.

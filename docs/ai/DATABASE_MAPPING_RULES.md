# Database Mapping Rules

## Cấu hình hệ thống (7.x-R)

Workspace configuration maps to `cic_config` (VI), `cic_config_en` (EN), and the approved legacy Enjicad table `cic_config_enjicad`; keys map from `name`, values from `value`, and UI control types derive only from the persisted `data_type`. Configuration identifiers retain table identity at the feature boundary (`scope:id`) so updates cannot cross workspaces. Branch/contact settings map to `cic_branches` by `workspace`, preserving code, address, contact, map, publication, head-office and ordering fields. Standard and reviewed values are both validated server-side and persisted in a PostgreSQL transaction; secret values are never returned to the client.

## Phân quyền (7.x-Q)

`cic_roles` owns stable role identity (`code`), display name/description, active state, protected-system marker and actor timestamps. The CMS matrix is a module-level projection over published `cic_permission_tasks`: each allowed module/action selection is persisted to `cic_role_permissions` for every active task in that module, replacing the role's permission rows atomically. UI-only risk, owner/reviewer and version labels are derived presentation values and are not persisted as invented columns.

Active user assignments come from `cic_user_roles` joined to `cic_users`; assign/reactivate and revoke operations validate both FKs and run transactionally. Revocation marks the assignment inactive and refuses to remove a user's last effective active role. Protected roles cannot be deactivated. Permission catalog tasks are system-owned and remain read-only in this module.

## Người dùng CIC (7.x-P)

`cic_users` owns the CMS profile and lifecycle projection (`username`, `email`, name/contact/profile fields, `image`, `account_status`, `published`, ordering, comma-delimited approved scope IDs, 2FA flag and visit/security counters). Active role assignment is synchronized in `cic_user_roles`; every lifecycle transition appends `cic_user_status_history` in the same PostgreSQL transaction. Read-only security activity comes from `cic_security_events`. Agency/product/news scopes are validated against `cic_branches`, `cic_products_categories`, and `cic_news_categories` before write. Effective access is projected from `cic_permission_tasks` and `cic_role_permissions`.

Supabase Auth remains the credential authority. The authenticated email is the approved bridge to the legacy integer `cic_users.id`; profile email changes are synchronized server-side. Plaintext or password hashes are never written to `cic_users.password`. Local avatar data URLs are not persisted into the legacy `varchar(255)` image field; until Media storage is migrated, the form accepts only an existing HTTP(S) URL or website-relative path.

## CMS Global Search (7.x-O)

CMS Global Search owns no table. Its authenticated server read model projects VI/EN records from `cic_products*`, `cic_news*`, `cic_event*`, `cic_projects*`, and `cic_services*`, plus `cic_content_pages`, `cic_contact`, `cic_media_assets`, `cic_ctas`, and `cic_forms`. `cic_users` fields are serialized only when the effective active role code is `admin` or `superadmin`; passwords and other credential/security fields are never selected. Search commands and browser-local recent-query history are interaction data, not business fixtures.

## CMS Dashboard (7.x-N)

Dashboard owns no table. Its server-only aggregate read model counts published rows in `cic_products` and `cic_news`, all `cic_content_pages`, published upcoming `cic_event` rows by `time_event`, and unresolved/recent `cic_contact` rows. Contact presentation maps `fullname`, `email`, `telephone`, `subject`, `message`, `published`, and `created_time`; workflows without an approved PostgreSQL mapping are returned as explicit empty datasets and never populated from fixtures.

## Search (7.x-I)

Search owns no table: it composes the published read models for Products, Projects, Services, News, and Events and never queries mock fixtures.

## Global interaction/widgets (7.x-H)

System submissions map email/name/phone/message to `cic_contact`; form/source metadata is serialized into `parts_email`. New submissions are unpublished and server-timestamped.

## About (7.x-G)

About content reads only published `cic_config` rows with the `about_` key prefix; no synthetic About table/columns are introduced.

## Events (7.x-E)

Published reads map `cic_event.title`, `alias`, `summary`, `image`, `time_event`, `published`, and `ordering` into `EventViewModel`.

## News (7.x-D)

Published reads map `cic_news.title`, `alias`, `summary`, `image`, `published`, and `ordering` into a serializable view model.

## Products (7.x-B)

Published reads use `cic_products.published`, ordered by `ordering` then `id`. The schema exposes `code` as the canonical product identifier; no title/alias column exists on `cic_products`, so the public read model uses `code` for slug/title fallback.

## Projects implementation note (2026-08-28)

Project create/update synchronizes `cic_projects_products_rel` and `cic_projects_services_rel` inside the same PostgreSQL transaction as `cic_projects`; related IDs are existence-checked against `cic_products` and `cic_services` before inserts.

PostgreSQL is the backend/data source of truth. The approved baseline is the 144-table schema represented by `db_migrate/database.html` and `db_migrate/cic14005_cic_fs_schema_moi_postgresql_PATCHED.sql`. The React UI remains the source of truth for presentation and interaction only.

## Rules

- Database access is server-only; UI receives serializable domain ViewModels, never raw rows.
- Map snake_case to camelCase at the feature boundary (`alias` → `slug`, `summary` → `shortDescription`, `content` → `body`/`contentHtml`, `image`/media relation → `heroImage`/`thumbnail`, `seo_*` → `seo`).
- Preserve PostgreSQL nullability and defaults. A UI field is not required unless domain rules and the database contract require it.
- Preserve foreign keys and relation ordering; polymorphic references require an allowlist and existence validation in the owning service.
- Keep language-specific tables (`*_en`) distinct; do not infer translations from Vietnamese fixtures.
- Preserve enum/status values from the database and derive display labels in presentation code.
- Legacy fields remain mapped for compatibility; do not rename, drop, merge, or invent columns from mock data.

## Initial scope

### Projects (7.x-A)

The first vertical slice uses `cic_projects` for Vietnamese published reads. `title` → `title`, `alias` → `slug`, `summary` → `summary`, `image` → `image`, `customer_name` → `customerName`, `start_year/end_year` → `startYear/endYear`, `is_ongoing` → `isOngoing`, and `is_featured` → `isFeatured`. `technologies` remains an ordered text array. Related product/service junction tables are reserved for the CMS/detail slice.

Project write validation mirrors the database checks: non-empty bounded title/alias, kebab-case alias, non-negative ordering, `end_year >= start_year`, and ongoing projects requiring a null `end_year`. This schema does not authorize writes; authentication/permission and mutation remain pending.

The initial Server Actions require a Supabase-authenticated session. Legacy integer `created_by`/`updated_by` are intentionally not populated from the UUID auth subject until the approved identity-to-`cic_users` mapping is available.

This foundation defines conventions only; no business module mapping or mock removal is performed. Module-specific mappings are added with each migration prompt and must cite the PostgreSQL table/column.

## Verified live schema (read-only, 2026-08-28)

Connection verified against Supabase PostgreSQL 17.6: `public` contains 144 base tables, 3,096 columns, 144 primary keys, 155 foreign keys, 27 unique constraints, 54 check constraints, and 404 indexes. No schema mutation was performed. The repository does not contain a file literally named `POSTGRES_SCHEMA_DATABASE*`; `db_migrate/database.html` and the patched SQL are the available schema references.

## Responsibilities

Supabase SSR client is the default request-aware access path. The admin client is server-only and allowlisted for future privileged use. No browser client, storage, realtime, or auth flow is implemented in this foundation.

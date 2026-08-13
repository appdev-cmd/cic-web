# Relations, constraints and indexes

## Constraint rollout rule

1. Create schema/table/index without rejecting legacy load.
2. Load data.
3. Detect null/orphan/duplicate.
4. Cleanup by approved deterministic rule.
5. Add FK/check as `NOT VALID` where supported.
6. Validate constraint.
7. Add `NOT NULL`/unique last.

## Existing domain relations

| Relation | Target action | Delete behavior |
|---|---|---|
| news → category | correct FK after orphan report | `SET NULL` preferred to preserve article |
| category → parent | self FK, cycle validation | `SET NULL` |
| product ↔ categories | relation table composite unique + indexes | cascade relation row only |
| product → type/manufactory/application | verified FK | `RESTRICT` or `SET NULL`; never delete product |
| product images → product | correct `record_id` FK | cascade image relation row after file policy review |
| menu item → group/parent | FK + cycle check application | `RESTRICT` group, `SET NULL` parent |
| author IDs → users | FK after orphan check | `SET NULL`; snapshot author remains |
| permissions → user/task | FK + composite indexes | cascade assignment on user deletion only under controlled account purge |
| order items → order/product | preserve order item; nullable product if legacy orphan | cascade by order only |

Known incorrect FK targets stay documented in `postgresql-schema-issues.md`; proposal does not silently legitimize them.

## New domain constraints

### Page Builder

- unique `(workspace, code)`, `(workspace, slug)`.
- revision unique `(page_id, version_no)`; partial unique one Draft/one Published pointer strategy.
- section unique `(revision_id, section_key)` and `(revision_id, position)`.
- references unique `(section_id, entity_type, entity_id)`; index `(entity_type,entity_id)` for used-by.
- polymorphic entity FK cannot be a native FK; service validates against allowlist and entity existence. Alternative typed tables may be chosen when implementing SQL.

### Media

- unique storage key; partial unique `(legacy_source_type,legacy_source_id)` when both present.
- check size/dimensions non-negative; MIME/status allowlist.
- folder relation composite PK.
- entity use references should live in owning relation/config; do not duplicate usage count column.

### CTA/Form

- CTA unique `(workspace,code)`; check action/status/style allowlists.
- Form unique `(workspace,code)`; field unique `(form_id,key)` and `(form_id,position)`.
- submission indexes `(form_id,created_at)`, `(source_type,source_id)`, status if actual filter uses it.
- config JSON validated at application boundary; optional DB JSON type checks only when stable.

### RBAC

- role code unique; assignment unique active `(user_id,role_id,scope)` as model permits.
- permission unique `(role_id,task_id,action)`.
- direct legacy permission remains; effective-permission service combines both without privilege escalation.

### Audit/Trash

- audit indexes time, actor+time, entity+time; append-only DB permission.
- trash unique active `(entity_type,entity_id,workspace)`; index deleted/purge time.
- snapshots redacted and size-limited; no secrets.

## Index policy

Add indexes based on actual list/detail queries:

- `(published, ordering)`, `(published, created_time desc)` on public content tables.
- alias lookup per dataset/workspace.
- category/filter FKs and relation reverse lookup.
- trigram/full-text only after search requirements and language configuration are fixed.
- avoid indexing every JSON key or low-cardinality boolean alone.
- use partial indexes for Published/not trashed where query volume warrants.

## SEO ownership

- Entity detail SEO remains on entity legacy `seo_*` fields.
- Function/list route SEO remains `cic_config_modules*`.
- Page Builder page SEO belongs to `cic_content_pages`/published revision according to final revision strategy.
- CTA/Form/Media do not duplicate page SEO.
- canonical/robots can be derived unless editors have a confirmed need to override.


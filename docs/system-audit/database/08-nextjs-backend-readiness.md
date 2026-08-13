# Next.js backend readiness gate

## Backend may start only when

- Target schema documents are approved.
- PostgreSQL schema migration is generated/reviewed/reversible.
- Legacy rehearsal migration passes validation plan.
- FK/schema issues have disposition.
- Page/Section/CTA/Form/Media seed manifests are approved.
- Permission parity and security model are approved.
- Database backup/rollback rehearsal passes.

## Recommended implementation sequence

1. Server-only database client/ORM schema matching approved PostgreSQL.
2. Compatibility queries/mappers for legacy content.
3. Public News/Event/Product/Service/Menu/SEO reads.
4. Auth/user/effective permission.
5. CMS read and Server Actions per module.
6. Media resolver/upload.
7. Page Builder Draft/Preview/Publish.
8. CTA/Form/Customer Request/Email Template.
9. Audit/Trash transaction integration.
10. Replace mock per module after parity tests.

## Server Component candidates

Public list/detail, Page Builder published renderer, menu/header/footer, breadcrumb and SEO metadata. Query data server-side and pass serializable ViewModel into small interactive islands.

## Client Component candidates

CMS forms/Rich Text/media/entity pickers, filters needing instant client behavior, table selection/bulk actions, modal/drawer, sliders/tabs/reorder and preview controls.

## Services/repositories required

- Page revision/publish validation and ordered references.
- Permission/effective access.
- Media storage/version/usage.
- Form submission/request routing.
- Email template activation/rendering.
- Trash delete/restore/purge with conflicts.
- Activity audit/redaction.
- Legacy CSV/path compatibility and migration fallback.

Simple alias lookup/list queries do not require ceremonial repository interfaces; use typed server-only query functions plus mapper.

## Security/readiness checklist

- Server Actions authenticate, authorize and validate.
- Public never reads Draft/trash/private fields.
- Rich Text sanitization policy supports safe legacy content/embed.
- Upload validates MIME/size/storage key and access.
- Secrets never reach client/log/trash snapshot.
- Audit is append-only and redacted.
- CSRF/origin/rate limit applied where appropriate, especially public forms.
- SQL query prevents N+1 and respects workspace.

## Mock removal gate

Per module: DB data count/parity, CMS list/create/edit/detail, public list/detail, relation/media/SEO/Rich Text, permission, validation, responsive visual regression, and rollback all pass. Then remove only that module's mock path. No global mock deletion.


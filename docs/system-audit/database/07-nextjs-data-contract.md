# Next.js Fullstack data contract

## Target flow

```text
Server Component / Server Action / Route Handler when needed
                 ↓
Query/Repository (only where useful)
                 ↓
Service (domain rules/transaction/security)
                 ↓
Mapper
                 ↓
PostgreSQL
```

Frontend/CMS never consumes raw ORM row. Simple read may use a server-only query function directly; service/repository is required for publish, permissions, trash, media, form, Page Builder and compatibility logic.

## Shared mapping

| DB | ViewModel |
|---|---|
| `alias` | `slug` |
| `summary` | `shortDescription` |
| `content` | `body`/`contentHtml` |
| `image`/media relation | `thumbnail`/`heroImage` MediaView |
| `seo_*` | `seo` object |
| author/category IDs | resolved lightweight relation object |
| timestamps | ISO string/date formatted in presentation |

## Read/write matrix

| Module | Read | Create/update editable | Computed/system | Relations | Frontend-only |
|---|---|---|---|---|---|
| News | content/category/media/related/SEO/status | legacy-used fields in audit mapping | ID/timestamps/author audit, counts | category, author, media, related | filters, selection, quality score |
| Static Pages | page/published or draft revision/sections | allowed config fields per section | revision/version/publish actor | media, CTA, form, ordered entities | canvas viewport/open panel |
| Events | core content/start/end/place/topic/link/SEO | legacy form fields với `end_time` đã cleanup | Upcoming/Ongoing/Ended derive từ thời gian | media/related | countdown/display label |
| Products | core/detail/classification/media/price/SEO | legacy-used product fields | display price/file metadata | category/type/brand/application/gallery/download/related/CTA | tabs/slider state |
| Product Settings | master data/business owner | fields matching legacy tables | usage counts | products/categories/users as applicable | select/search state |
| Services | title/alias/summary/content/image/related/SEO | legacy-used fields | excerpt/breadcrumb | media/product/form/CTA/settings | structured mock blocks removed |
| Menus | tree/group/link/status | existing menu fields | path/tree/breadcrumb | parent/group/linked entity | expanded nodes |
| Media | asset/metadata/folder/version/usage | metadata and lifecycle actions | URL/variants/usage count | folder/owner/entity uses | grid/list selection |
| CTA | label/type/config/style/status | all validated CTA fields | usage count | form/media | preview state |
| Forms | definition/fields/submissions | definition; submission public input | IDs/times/source/audit | CTA/email/request | builder drag state |
| Customer Requests | unified read model | notes/assignment/status only when supported | source identity/timeline | source table/user/form | table filters |
| Email Templates | template/active/draft version | content/version activation | usage/audit | event/routing config | preview viewport |
| Users | profile/status/roles/scopes/security summary | allowed profile/admin state | last login/effective permission | roles/direct permission | modal/tab state |
| Permissions | roles/tasks/effective matrix | role/assignment/permission | conflicts/effective access | user/task | matrix expansion |
| Settings | key/value/schema metadata | allowed values | validation/secret masking | media where relevant | editor state |
| Function SEO | route/module SEO | value fields | hierarchy/route/canonical | menu/route registry | tree expansion |
| Translations | key/locale values | values | completeness/count | module/key | filters |
| Activity Logs | audit entries | system only | all audit metadata | actor/entity | filters/export state |
| Trash | trash entries/conflicts | delete/restore/purge service only | snapshots/times | actor/source entity | confirmation state |

## Public visibility

Server-side query must enforce Published/current published revision and exclude active Trash. Related entity resolver removes unavailable items without N+1. Preview requires authenticated CMS permission and reads Draft; it never calls public cached query.

## Mutation boundary

Server Actions are preferred for internal CMS forms. Route Handlers are reserved for upload/download, webhook, external integration, public form submission when HTTP boundary is needed, or public API. Every mutation validates input/schema/permission server-side and writes audit transactionally.

## Caching

Public list/detail can use Next.js cache/tag revalidation. Publish/unpublish/menu/settings/SEO changes invalidate affected tags. CMS Draft/Preview, user/permission, request/audit/trash are uncached or request-scoped. Cache strategy is implementation detail, not DB column.

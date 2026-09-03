LEGACY DATABASE FIELD RULE

The existing database contains legacy fields that are not necessarily
part of the new system contract.

A database column must not become a CMS field or application field
merely because it exists.

For each module, use only fields required by:

1. CMS create/edit forms,
2. CMS list/filter/operational screens,
3. public Website rendering,
4. required relationships,
5. system-managed state,
6. audit/history,
7. confirmed cross-module integration.

All other legacy fields must remain untouched until a separate
database-cleanup audit is performed.

Do not populate, reset, null, expose, migrate or delete unused legacy
fields merely to make the new implementation appear complete.

Updates must modify only fields owned by the current operation.
Avoid full-row update payloads for legacy tables.
Avoid SELECT * when the consumer needs only a subset of columns.
# Security Architecture & Reconnaissance Summary

## 1. Product & Architecture Overview
- **Product**: CIC Technology & Consultancy Web Platform (Next.js 16 fullstack application with CMS backoffice and public customer-facing web portal).
- **Technology Stack**:
  - Runtime: Next.js 16.3.3 (App Router), React 19.0.1, Node.js 22.
  - Database: PostgreSQL 17.6 (managed by Supabase, accessed via `postgres` npm client and `@supabase/ssr`).
  - Storage: Supabase Storage (`media` bucket).
  - Styling & UI: Tailwind CSS v4, Motion, Lucide React, CKEditor 5.
  - Email Engine: Nodemailer SMTP transport with dynamic token interpolation.
- **Principals & Trust Boundaries**:
  - *Public Anonymous Visitors*: Can browse published products, news, events, legal pages, search, and submit contact/custom forms.
  - *CMS Authenticated Staff (Editor / HR / Content Managers)*: Authenticated via Supabase Auth + `cic_users` profile. Subject to RBAC permissions (`cic_role_permissions`).
  - *CMS Administrators / Superadmins*: Full administrative bypass across all CMS modules.
  - *Database & Service Layer*: Direct SQL connection pool via `DATABASE_URL` executing with elevated Postgres role; Supabase service role key used for storage and auth administrative operations.

## 2. Attack Surface & Entry Points
1. **Public Web & Forms Surface**:
   - Dynamic form submission API: `/api/forms/submit` (POST, unauthenticated).
   - Contact form Server Action: `submitContactAction` (unauthenticated).
   - Public CTA resolver: `/api/cta/[code]` (GET, unauthenticated).
   - Public Media resolver & signed URL generator: `/api/media/[id]` (GET, unauthenticated).
2. **CMS Backoffice Surface**:
   - CMS Authentication: `/cms/login` (`loginAction` via Supabase Auth).
   - Media Upload API: `/api/upload` (POST, authenticated CMS users).
   - CMS Management APIs: `/api/cms/customer-requests/*`, `/api/cms/forms/*`, `/api/cms/email-templates/*`, `/api/cms/cta/*`, `/api/cms/projects`.
   - CMS Server Actions: User management, role assignment, trash management, audit logs, system settings.

## 3. Trust Boundaries & Controls Evaluation
- **Authentication & RBAC**: Centralized through `src/server/auth/guards.ts` (`requireCmsAccess`, `requirePermission`). Cached in-memory with 30s TTL.
- **Database Boundary**: Parameterized SQL queries using `postgres` tagged template literals and transactions (`withTransaction`). Database catalog audit reveals 49/149 tables have RLS enabled, while direct server queries run as elevated Postgres role.
- **Repository & Supply Chain**: Production database dumps (`db_migrate/cic14005_cic_fs.sql`, `db_migrate/export_data.sql`) tracked in Git violate isolation rules.
- **Client-Side & Content Rendering**: Multiple public views and CMS previews render HTML directly via `dangerouslySetInnerHTML` without an HTML sanitizer.

## 4. Companion Selection Summary
- `WEB-PROTOCOL-AND-AUTH.md`: Selected for Supabase session management, RBAC enforcement, and API auth boundaries.
- `CLIENT-SIDE.md`: Selected for rich text / HTML rendering, CKEditor integration, and vector SVG uploads.
- `DATA-ISOLATION-AND-LIFECYCLE.md`: Selected for multi-tenant workspace separation (`vi` vs `en`), customer request states, and trash lifecycle.
- `RESOURCE-EXHAUSTION-AND-AVAILABILITY.md`: Selected for public unauthenticated endpoints (forms, contact, login) and media streaming.
- `SUPPLY-CHAIN-AND-RELEASE.md`: Selected for repository hygiene, tracked ETL SQL dumps, and dependency verification.
- `CLOUD-AND-DEPLOYMENT.md`: Selected for HTTP security headers in `next.config.ts`, Supabase storage security, and SMTP configuration.

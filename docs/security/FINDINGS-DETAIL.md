# Security Findings Detail

This document contains full technical specifications, source traces, reproduction conditions, and remediation guidance for all 9 confirmed vulnerabilities.

---

## SEC-001: Stored XSS via Unsanitized Rich Text HTML Rendering in Public and CMS Views

- **Fingerprint**: `sec.001.xss.dangerously_set_inner_html`
- **Severity**: HIGH (Impact: High, Likelihood: High, Confidence: High)
- **Affected Files**:
  - `src/web/features/projects/ProjectDetailRuntimeView.tsx:140`
  - `src/web/components/LegacyHtml.tsx:5`
  - `src/web/features/events/components/detail/EventDetailView.tsx:130`
  - `src/web/components/ServicesView.tsx:630`
  - `src/cms/modules/news/components/ArticlePreviewModal.tsx:38`

### Technical Description
The frontend renders stored database HTML content using React's `dangerouslySetInnerHTML`. Existing helper functions (`cleanCmsHtml`, `cleanEventHtml`, `cleanProductHtml`, `normalizeHtmlContent`) perform regular expression replacements solely on image URLs, inline font styles, or heading IDs. None of these functions strip or sanitize dangerous elements such as `<script>`, `<iframe src="evil.com">`, `<img src=x onerror=...>`, or `<svg onload=...>`.

### Trace
1. **Entrypoint** (`src/server/db/postgres.ts:26`): Server queries retrieve HTML content from database columns.
2. **Propagation** (`src/shared/lib/content.ts:13`): `normalizeHtmlContent` modifies URLs but leaves script tags intact.
3. **Sink** (`src/web/features/projects/ProjectDetailRuntimeView.tsx:140`): Raw string is injected directly into the DOM.

### Remediation
Wrap all HTML strings with a sanitizer before passing to `dangerouslySetInnerHTML`:
```ts
import sanitizeHtml from 'sanitize-html';

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height', 'loading', 'referrerpolicy'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
```

---

## SEC-002: Production Database Dumps and Compiled Bytecode Tracked in Git Repository

- **Fingerprint**: `sec.002.supply_chain.tracked_database_dump`
- **Severity**: HIGH (Impact: High, Likelihood: High, Confidence: High)
- **Affected Files**:
  - `db_migrate/cic14005_cic_fs.sql` (68.7 MB)
  - `db_migrate/export_data.sql` (51.6 MB)
  - `db_migrate/__pycache__/*.pyc`
  - `scripts/check-repository-security.mjs`

### Technical Description
Production database dumps generated via phpMyAdmin are actively tracked in Git. These files contain production table definitions, historical data, customer emails, phone numbers, and internal addresses. Furthermore, running `npm run check:repository-security` exits with code 1 due to these tracked files.

### Remediation
1. Run `git rm --cached db_migrate/cic14005_cic_fs.sql db_migrate/export_data.sql db_migrate/__pycache__/*.pyc`.
2. Ensure `.gitignore` contains:
   ```gitignore
   db_migrate/*.sql
   db_migrate/__pycache__/
   *.pyc
   ```
3. Verify that `npm run check:repository-security` passes with exit code 0.

---

## SEC-003: Unsanitized User Form Inputs Interpolated Directly into HTML Notification Emails

- **Fingerprint**: `sec.003.email.html_phishing_injection`
- **Severity**: MEDIUM (Impact: Medium, Likelihood: High, Confidence: High)
- **Affected Files**:
  - `src/features/forms/server/mutations.ts:546`
  - `src/features/contact/server/actions.ts:68`
  - `src/lib/email/dispatcher.ts:43`

### Technical Description
Form submissions from public visitors are interpolated directly into HTML email templates without HTML character escaping. An attacker can inject phishing links, deceptive login forms, or tracking pixels into emails delivered to CIC administrative personnel or confirmation emails sent to customer addresses.

### Remediation
Apply HTML entity escaping to all interpolated parameters:
```ts
function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!));
}
```

---

## SEC-004: Missing Rate Limiting and Anti-Automation on Auth and Public Submission Endpoints

- **Fingerprint**: `sec.004.resource.missing_rate_limiting`
- **Severity**: MEDIUM (Impact: Medium, Likelihood: High, Confidence: High)
- **Affected Files**:
  - `src/app/cms/login/actions.ts:9`
  - `src/app/api/forms/submit/route.ts:4`
  - `src/features/contact/server/actions.ts:10`

### Technical Description
No rate-limiting or anti-automation protection exists on `loginAction` or public form submission routes. This exposes the application to credential stuffing and automated spam attacks that can exhaust SMTP email sending quotas.

### Remediation
1. Implement IP-based sliding window rate limiting on `/cms/login` (e.g., maximum 5 attempts per 60 seconds).
2. Add honeypot fields and rate limits on public submission routes.

---

## SEC-005: Arbitrary Media Storage Path Resolution Bypassing Soft-Delete Protection

- **Fingerprint**: `sec.005.media.storage_path_bypass`
- **Severity**: MEDIUM (Impact: Medium, Likelihood: High, Confidence: High)
- **Affected Files**:
  - `src/app/api/media/[id]/route.ts:36`

### Technical Description
When `id` contains a slash (`/`), `/api/media/[id]` sets `storagePath = decodedId` directly, bypassing database record lookups and the `deleted_at IS NULL` filter. This allows unauthenticated users to generate 12-hour signed URLs for soft-deleted media assets.

### Remediation
Query `cic_media_assets` even when slashes are present, and verify that `deleted_at IS NULL`.

---

## SEC-006: Missing Content-Security-Policy (CSP) in HTTP Security Headers Configuration

- **Fingerprint**: `sec.006.headers.missing_content_security_policy`
- **Severity**: MEDIUM (Impact: Medium, Likelihood: High, Confidence: High)
- **Affected Files**:
  - `next.config.ts:16-28`

### Technical Description
`next.config.ts` configures five security headers but omits `Content-Security-Policy`. Without CSP, the browser will execute any injected scripts without origin or nonce validation.

### Remediation
Define a strict CSP in `next.config.ts` specifying `default-src 'self'`, `img-src 'self' https: data: blob:`, and `frame-src 'self' https://www.youtube.com`.

---

## SEC-007: Vertical Privilege Escalation via User Role Mutation in CMS User Management

- **Fingerprint**: `sec.007.rbac.vertical_privilege_escalation`
- **Severity**: HIGH (Impact: High, Likelihood: Medium, Confidence: High)
- **Affected Files**:
  - `src/features/users/server/actions.ts:46`
  - `src/features/users/server/repository.ts:78`

### Technical Description
`updateCmsUserAction` allows any user with `users:edit` permission to change a user's role to `input.roleId` and reset their password. There is no verification that the actor holds an administrator role, allowing a non-admin to elevate accounts to `admin` or `superadmin`.

### Remediation
In `updateUserRecord`, require `actor.isAdministrator` if the target user or the requested `roleId` corresponds to `admin` or `superadmin`.

---

## SEC-008: Stale In-Memory Principal Cache Retaining Elevated Privileges Post Status Revocation

- **Fingerprint**: `sec.008.auth.stale_principal_cache`
- **Severity**: LOW (Impact: Low, Likelihood: Medium, Confidence: High)
- **Affected Files**:
  - `src/server/auth/guards.ts:64`
  - `src/features/users/server/actions.ts:15`

### Technical Description
`principalCache` caches CMS user permissions for 30 seconds. When an administrator deactivates or modifies a user, `invalidateCmsPrincipalCache()` is never called, allowing the affected user to continue performing actions until the cache expires.

### Remediation
Call `invalidateCmsPrincipalCache(targetUserId)` inside `updateCmsUserStatusAction`, `bulkUpdateCmsUserStatusAction`, and `updateUserRecord`.

---

## SEC-009: Unrestricted SVG Vector Upload Enabling Stored Script Execution in Media Storage

- **Fingerprint**: `sec.009.upload.unrestricted_svg_execution`
- **Severity**: MEDIUM (Impact: Medium, Likelihood: Medium, Confidence: High)
- **Affected Files**:
  - `src/app/api/upload/route.ts:16`
  - `src/app/api/media/[id]/route.ts:69`

### Technical Description
The upload route allows `image/svg+xml` without XML sanitization. Embedded `<script>` elements in SVGs execute when the asset URL is viewed directly in modern browsers.

### Remediation
Sanitize SVG files on upload to strip all `<script>` and event handler attributes, or force `Content-Disposition: attachment` for SVG downloads.

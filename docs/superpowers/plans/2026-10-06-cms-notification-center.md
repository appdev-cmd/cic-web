# CMS Notification Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, role-based notification subsystem for CIC CMS with independent read tracking, automated customer interaction triggers, audio chimes, and full history management.

**Architecture:** PostgreSQL-backed event storage (`cms_notifications`, `cms_notification_reads`), Server Actions guarded by `CmsPrincipal` RBAC, auto-triggers from public forms and editorial actions, client SWR polling (30s) + Web Audio API chime in `useCmsNotifications`, integrated into `CmsHeader` and a dedicated `/cms/notifications` screen.

**Tech Stack:** Next.js 16 (App Router), PostgreSQL (`postgres` client), TypeScript, Tailwind CSS, Lucide icons, Web Audio API.

**Spec:** [docs/superpowers/specs/2026-10-06-cms-notification-center-design.md](file:///d:/Workspace/CIC/old_page/cic-web/docs/superpowers/specs/2026-10-06-cms-notification-center-design.md)

## Global Constraints
- Strictly follow Git workflow: `pull → code → commit → pull → push`.
- TypeScript compliance: `npm run typecheck:foundation` must pass with 0 errors.
- Never block user operations if notification creation fails (safe background try/catch).
- Documentation sync: Update `db_migrate/database.html` and `docs/database/POSTGRES_SCHEMA_DELTA.md`.

---

### Task 1: Database Migration & Schema Documentation

**Files:**
- Create: `db_migrate/migrations/20261006_cms_notifications.sql`
- Create: `scripts/apply-notification-migration.mjs`
- Modify: `db_migrate/database.html`
- Modify: `docs/database/POSTGRES_SCHEMA_DELTA.md`

**Interfaces:**
- Produces: Tables `cms_notifications` and `cms_notification_reads` with indexes in PostgreSQL.

- [ ] **Step 1: Write SQL migration file**

Create `db_migrate/migrations/20261006_cms_notifications.sql`:
```sql
-- Migration: CMS Notification Center Schema
-- Tables: cms_notifications, cms_notification_reads

CREATE TABLE IF NOT EXISTS cms_notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    target_module VARCHAR(100),
    target_action VARCHAR(50) DEFAULT 'view',
    target_user_id BIGINT REFERENCES cic_users(id) ON DELETE CASCADE,
    link_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_notifications_module ON cms_notifications(target_module, target_action);
CREATE INDEX IF NOT EXISTS idx_cms_notifications_user ON cms_notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_cms_notifications_created_at ON cms_notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS cms_notification_reads (
    notification_id BIGINT NOT NULL REFERENCES cms_notifications(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES cic_users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (notification_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cms_notification_reads_user ON cms_notification_reads(user_id);
```

- [ ] **Step 2: Create and run node runner to execute SQL migration**

Create `scripts/apply-notification-migration.mjs`:
```js
import fs from 'fs';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('DATABASE_URL is required. Run with --env-file=.env.local');
}

const sql = postgres(url, { max: 1 });

async function run() {
  console.log('Applying CMS Notification Migration...');
  const migrationSql = fs.readFileSync('db_migrate/migrations/20261006_cms_notifications.sql', 'utf8');
  await sql.unsafe(migrationSql);
  console.log('Migration applied successfully.');
  await sql.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
```
Run: `node --env-file=.env.local scripts/apply-notification-migration.mjs`
Expected: "Migration applied successfully."

- [ ] **Step 3: Document tables in database.html & POSTGRES_SCHEMA_DELTA.md**

Update `db_migrate/database.html` adding table descriptions for `cms_notifications` and `cms_notification_reads`.
Update `docs/database/POSTGRES_SCHEMA_DELTA.md` recording migration `20261006_cms_notifications.sql`.

- [ ] **Step 4: Commit Task 1**

```bash
git add db_migrate/ scripts/apply-notification-migration.mjs docs/database/POSTGRES_SCHEMA_DELTA.md
git commit -m "feat(db): add cms_notifications and cms_notification_reads schema and documentation"
```

---

### Task 2: Backend Notifications Service & RBAC Filter Logic

**Files:**
- Create: `src/server/notifications/types.ts`
- Create: `src/server/notifications/service.ts`
- Create: `src/server/notifications/actions.ts`
- Create: `scripts/test-cms-notifications.mjs`

**Interfaces:**
- Produces: 
  - `createCmsNotification(input: CreateNotificationInput): Promise<number | null>`
  - `getCmsNotificationsAction(options?: GetNotificationsOptions): Promise<{ notifications: CmsNotificationItem[]; unreadCount: number; total: number }>`
  - `markNotificationAsReadAction(notificationId: number): Promise<boolean>`
  - `markAllNotificationsAsReadAction(): Promise<boolean>`
  - `deleteNotificationAction(notificationId: number): Promise<boolean>`

- [ ] **Step 1: Write notification types**

Create `src/server/notifications/types.ts`:
```ts
export type NotificationType = 'contact' | 'registration' | 'quote' | 'editorial' | 'system' | 'security';

export interface CreateNotificationInput {
  title: string;
  description?: string;
  type: NotificationType;
  targetModule?: string;
  targetAction?: string;
  targetUserId?: number | null;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CmsNotificationItem {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  targetModule?: string;
  targetUserId?: number | null;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
  unread: boolean;
  createdAt: string;
}

export interface GetNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: string;
}
```

- [ ] **Step 2: Implement service with RBAC SQL query**

Create `src/server/notifications/service.ts`:
- Implement `createCmsNotification`: Inserts into `cms_notifications` safely.
- Implement `getCmsNotifications`: Uses `CmsPrincipal`. If administrator, fetches all. If regular user, filters by `(target_user_id = principal.legacyUserId OR (target_user_id IS NULL AND target_module IN allowedModules))`. Joins `cms_notification_reads` to calculate `unread`.
- Implement `markNotificationAsRead`: Upserts `cms_notification_reads`.
- Implement `markAllNotificationsAsRead`: Inserts reads for all unread visible notifications.
- Implement `deleteNotification`: Removes notification record if authorized.

- [ ] **Step 3: Implement Server Actions**

Create `src/server/notifications/actions.ts`:
- Exports Next.js Server Actions wrapping `service.ts` guarded by `getCurrentCmsPrincipal()`.

- [ ] **Step 4: Write verification test script and run it**

Create `scripts/test-cms-notifications.mjs` to test:
1. Creating a notification.
2. Querying notifications.
3. Marking as read.
4. Marking all as read.
Run: `node --env-file=.env.local scripts/test-cms-notifications.mjs`
Expected: All steps pass successfully.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/server/notifications/ scripts/test-cms-notifications.mjs
git commit -m "feat(cms): add backend notification service, RBAC filtering and server actions"
```

---

### Task 3: Event Triggers Integration (Form Submissions & System Events)

**Files:**
- Modify: `src/server/customer_requests/actions.ts` (or public contact submission endpoint)
- Modify: `src/app/api/contact/route.ts` or form submit action
- Modify: `src/cms/modules/products/actions.ts` or editorial handlers

**Interfaces:**
- Consumes: `createCmsNotification` from `src/server/notifications/service`

- [ ] **Step 1: Inspect form submission action and add notification trigger**

Call `createCmsNotification` when a contact request or quote form is submitted:
```ts
void createCmsNotification({
  title: `Liên hệ mới từ ${contact.name}`,
  description: `${contact.email || ''} - ${contact.company || ''}: ${contact.content?.slice(0, 80) || ''}`,
  type: contact.request_type === 'quote' ? 'quote' : 'contact',
  targetModule: 'customer_requests',
  targetAction: 'view',
  linkUrl: `/cms/customer-requests?search=${encodeURIComponent(contact.email || contact.name)}`,
  metadata: { customerId: contact.id, email: contact.email, name: contact.name },
}).catch((err) => console.error('[Notification Trigger Error]', err));
```

- [ ] **Step 2: Add trigger for event registration**

When an event attendee registers, trigger notification with `type: 'registration'` and `targetModule: 'events'`.

- [ ] **Step 3: Verify trigger execution**

Run test submission script to ensure notification is created in database.

- [ ] **Step 4: Commit Task 3**

```bash
git add src/server/customer_requests/ src/app/api/
git commit -m "feat(cms): wire automated notification triggers for public customer forms"
```

---

### Task 4: Frontend Notification Hook with Polling & Audio Chime

**Files:**
- Create: `src/cms/hooks/useCmsNotifications.ts`
- Create: `src/cms/utils/soundAlert.ts`

**Interfaces:**
- Produces: `useCmsNotifications()` returning `{ notifications, unreadCount, isLoading, markAsRead, markAllAsRead, soundEnabled, toggleSound, refresh }`

- [ ] **Step 1: Implement Web Audio API subtle chime utility**

Create `src/cms/utils/soundAlert.ts`:
- Synthesize an elegant 2-tone chime (880Hz -> 1320Hz) using `window.AudioContext` with zero external dependencies.

- [ ] **Step 2: Implement `useCmsNotifications` hook**

Create `src/cms/hooks/useCmsNotifications.ts`:
- Polls `getCmsNotificationsAction({ limit: 15 })` every 30 seconds.
- Revalidates on `window.addEventListener('focus', ...)`.
- Detects if new notifications arrived (by comparing latest ID) and triggers sound chime if `soundEnabled` and unread count increased.
- Exposes `markAsRead` and `markAllAsRead`.

- [ ] **Step 3: Verify with foundation typecheck**

Run: `npm run typecheck:foundation`
Expected: 0 errors.

- [ ] **Step 4: Commit Task 4**

```bash
git add src/cms/hooks/useCmsNotifications.ts src/cms/utils/soundAlert.ts
git commit -m "feat(cms): create useCmsNotifications hook with polling and Web Audio alert"
```

---

### Task 5: Upgrade `CmsHeader` Notification Popover UI

**Files:**
- Modify: `src/cms/components/CmsHeader.tsx`
- Modify: `src/cms/components/CmsDashboard.tsx`

**Interfaces:**
- Consumes: `useCmsNotifications` from `src/cms/hooks/useCmsNotifications`

- [ ] **Step 1: Wire hook in `CmsHeader`**

Connect `CmsHeader` to `useCmsNotifications`:
- Display unread badge on Bell button with pulse animation when unread > 0.
- Add sound toggle icon (BellRing / Volume2 / VolumeX) in popover header.
- Add tabs: [Tất cả] and [Chưa đọc].
- Display type icons (Contact, Registration, Quote, Editorial, System) with respective theme colors.
- Format relative time ("vừa xong", "15 phút trước", "Hôm qua").
- Handle click: call `markAsRead(item.id)`, navigate to `item.linkUrl`, and close popover.
- Add "Xem tất cả thông báo" link pointing to `/cms/notifications`.

- [ ] **Step 2: Update `CmsDashboard.tsx` to remove unused prop pass-through**

Clean up `initialNotifications` prop in `CmsDashboard.tsx`.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck:foundation`
Expected: 0 errors.

- [ ] **Step 4: Commit Task 5**

```bash
git add src/cms/components/CmsHeader.tsx src/cms/components/CmsDashboard.tsx
git commit -m "feat(cms): upgrade CmsHeader bell popover with dynamic badges and live actions"
```

---

### Task 6: Dedicated Notification History Screen `/cms/notifications`

**Files:**
- Create: `src/cms/modules/notifications/NotificationsManager.tsx`
- Create: `src/cms/modules/notifications/NotificationsRoute.tsx`
- Modify: `src/app/cms/(workspace)/[...path]/page.tsx`
- Modify: `src/cms/data/mockCmsData.ts` (menu definitions if needed)

**Interfaces:**
- Produces: Route `/cms/notifications` displaying the complete notification center.

- [ ] **Step 1: Implement `NotificationsManager.tsx`**

Create `src/cms/modules/notifications/NotificationsManager.tsx`:
- Header with title "Trung tâm thông báo", total count, and "Đánh dấu tất cả đã đọc" button.
- Toolbar: Search input, Type filter pills (Tất cả, Khách hàng, Sự kiện, Nội dung, Hệ thống), and Read status tab (Tất cả / Chưa đọc).
- Table / Card list: Icon, Title, Description, Timestamp, Status tag, Direct action button ("Xem chi tiết").
- Pagination controls.
- Delete notification action for administrators.

- [ ] **Step 2: Implement `NotificationsRoute.tsx` and register in CMS router**

Create `NotificationsRoute.tsx` with `requireCmsPageAccess()`.
Wire `/cms/notifications` in `src/app/cms/(workspace)/[...path]/page.tsx`.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck:foundation`
Expected: 0 errors.

- [ ] **Step 4: Commit Task 6**

```bash
git add src/cms/modules/notifications/ src/app/cms/
git commit -m "feat(cms): add full-page Notification Center module at /cms/notifications"
```

---

### Task 7: End-to-End Verification & Documentation Audit

**Files:**
- Audit all touched files
- Final typecheck & build test

- [ ] **Step 1: Run typecheck**

Run: `npm run typecheck:foundation`
Expected: Exit code 0.

- [ ] **Step 2: Verify in browser / dev server**

Check `http://localhost:3000/cms/notifications` and bell popover in header.
Ensure no console errors or hydration warnings.

- [ ] **Step 3: Pull & Push final work**

```bash
git pull origin refactor/nextjs-fullstack
git push origin refactor/nextjs-fullstack
```

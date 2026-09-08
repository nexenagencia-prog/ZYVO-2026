# ZYVO 2026 CMS + Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a protected Supabase-backed CMS to ZYVO-2026 so the approved administrator can edit all Home copy, performance percentages, profile data, card media, and carousel media without code changes.

**Architecture:** Keep the existing Next.js 15 App Router Home and add a small content domain under `lib/cms`, Supabase browser/server clients, protected CMS routes, and SQL migrations. Public Home reads published data with hard-coded fallbacks; authenticated CMS writes through RLS. Auth uses Supabase email/password, a forced first-password-change flag, PKCE recovery callback, and a dedicated reset-password screen.

**Tech Stack:** Next.js 15.5.24, React 19.1, TypeScript 5.7, `@supabase/ssr`, `@supabase/supabase-js`, Supabase Auth/Postgres/Storage, Node built-in test runner for pure validation helpers.

**Spec:** `docs/superpowers/specs/2026-09-08-cms-auth-design.md`

## Global Constraints

- Administrator email is exactly `sandrobellomind@gmail.com`.
- Never commit the temporary password, service-role key, or any private Supabase secret.
- Temporary password is at least 20 characters and must be changed on first successful login.
- Percentages must stay in the inclusive range 0–100.
- Carousel interval defaults to 4000 ms and remains manually navigable.
- Home must render safe fallback content when Supabase is unavailable.
- CMS may edit content/media but not arbitrary CSS, fonts, spacing, or component structure.
- JPEG, PNG, and WebP are accepted for CMS media; failed replacement uploads must not destroy the previous image.
- `npm run build` must exit 0 before completion is claimed.

---

### Task 1: Supabase client foundation and validation contracts

**Files:**
- Modify: `package.json`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/cms/types.ts`
- Create: `lib/cms/defaults.ts`
- Create: `lib/cms/validation.ts`
- Create: `tests/cms-validation.test.mjs`

**Interfaces:**
- Produces `createBrowserSupabaseClient()`, `createServerSupabaseClient()`, `HomeContent`, `DEFAULT_HOME_CONTENT`, `validatePercentage(value)`, `validatePassword(password, confirmation)`, and `validateImage(file)`.

- [ ] **Step 1: Add a failing Node test for percentage/password validation**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePercentage, validatePassword } from '../lib/cms/validation.js';

test('percentage accepts 0..100 only', () => {
  assert.equal(validatePercentage(69), 69);
  assert.throws(() => validatePercentage(101));
});

test('password requires 12+ chars and matching confirmation', () => {
  assert.throws(() => validatePassword('short', 'short'));
  assert.throws(() => validatePassword('LongEnough123!', 'different'));
  assert.equal(validatePassword('LongEnough123!', 'LongEnough123!'), 'LongEnough123!');
});
```

- [ ] **Step 2: Run `node --test tests/cms-validation.test.mjs` and verify RED because the module/functions do not exist.**
- [ ] **Step 3: Add `@supabase/ssr` and `@supabase/supabase-js`, create focused client modules, content types/defaults, and minimal validation implementation.**
- [ ] **Step 4: Run the validation test and `npx tsc --noEmit`; both must pass.**
- [ ] **Step 5: Commit with `feat: add Supabase CMS foundation`.**

### Task 2: Database, RLS, storage, seeds, and admin bootstrap

**Files:**
- Create: `supabase/migrations/20260908_zyvo_cms.sql`
- Create: `scripts/bootstrap-admin.mjs`
- Create: `.env.example`

**Interfaces:**
- Produces tables `site_content`, `carousel_items`, `home_cards`, `admin_users`; bucket `cms-media`; helper policy based on authenticated admin email; initial rows matching current Home.

- [ ] **Step 1: Write SQL assertions in the migration comments/check section for percentage constraints, unique content keys, RLS enablement, and admin-only writes; verify they are absent before migration.**
- [ ] **Step 2: Add idempotent SQL creating tables, indexes, triggers, RLS policies and public-read/admin-write storage policies. Seed the current 69/82/54/76 percentages and current Home copy.**
- [ ] **Step 3: Add `bootstrap-admin.mjs` that requires `SUPABASE_SERVICE_ROLE_KEY` only at execution time, generates a cryptographically random 24+ character temporary password, creates/updates `sandrobellomind@gmail.com`, sets `must_change_password=true`, and prints the password once to the operator without writing it to disk.**
- [ ] **Step 4: Apply migration to project `lexsucpyhgruolmqxwnd`; query schema/policies and run Supabase security advisors. Fix any CMS-related security advisory before continuing.**
- [ ] **Step 5: Run bootstrap once in a secure environment, confirm the admin exists and `must_change_password=true`; do not add the generated password to Git history.**
- [ ] **Step 6: Commit with `feat: add CMS database and admin bootstrap`.**

### Task 3: Login, protected session, first-password change, and recovery

**Files:**
- Create: `app/cms/login/page.tsx`
- Create: `app/cms/reset-password/page.tsx`
- Create: `app/auth/callback/route.ts`
- Create: `middleware.ts`
- Create: `lib/cms/auth.ts`
- Create: `app/cms/auth.css`
- Create: `tests/auth-rules.test.mjs`

**Interfaces:**
- Produces `isAdminEmail(email)`, `/cms/login`, `/auth/callback`, `/cms/reset-password`, and middleware protection for `/cms`.

- [ ] **Step 1: Write failing tests proving only `sandrobellomind@gmail.com` is accepted as admin and password validation rejects mismatch/weak values.**
- [ ] **Step 2: Run `node --test tests/auth-rules.test.mjs` and verify RED.**
- [ ] **Step 3: Implement login with `signInWithPassword`; after success, read `must_change_password` and route to `/cms/reset-password?first=1` when true. Implement forgot-password with `resetPasswordForEmail(email,{redirectTo: origin + '/auth/callback?next=/cms/reset-password'})`.**
- [ ] **Step 4: Implement PKCE callback using `exchangeCodeForSession(code)` and allow only internal `next` paths. Implement reset screen using `auth.updateUser({password})`, then clear `must_change_password` only after Supabase confirms the password update.**
- [ ] **Step 5: Implement middleware that refreshes the Supabase session and redirects unauthenticated `/cms` traffic to `/cms/login`; login/reset/callback remain reachable.**
- [ ] **Step 6: Run tests, `npx tsc --noEmit`, and manually exercise invalid login, first-login redirect, recovery callback, mismatched confirmation, successful password update, and expired session.**
- [ ] **Step 7: Commit with `feat: add CMS authentication and password recovery`.**

### Task 4: CMS content repository and protected editor

**Files:**
- Create: `lib/cms/repository.ts`
- Create: `app/cms/page.tsx`
- Create: `app/cms/CmsEditor.tsx`
- Create: `app/cms/cms.css`
- Create: `app/api/cms/content/route.ts`
- Create: `app/api/cms/upload/route.ts`
- Create: `tests/cms-payload.test.mjs`

**Interfaces:**
- Produces `loadHomeContent()`, authenticated content update endpoint, authenticated image upload endpoint, and editor sections Hero / Performance / Próxima reunião / Carrossel / Cards / Perfil / Navegação.

- [ ] **Step 1: Write failing payload tests for clamping/rejecting invalid percentages, unsupported image MIME types, and missing required text fields.**
- [ ] **Step 2: Run tests and verify RED.**
- [ ] **Step 3: Implement repository reads that merge Supabase values over `DEFAULT_HOME_CONTENT`; on read failure return defaults without throwing into the Home render.**
- [ ] **Step 4: Implement authenticated content API that checks the current user, admin email, validates payloads, and upserts only allowed CMS fields. Return non-2xx on real persistence failure.**
- [ ] **Step 5: Implement upload API for JPEG/PNG/WebP with a 10 MB limit, unique object names, upload-first/update-second semantics, and no deletion of the previous image until the new DB reference is confirmed.**
- [ ] **Step 6: Implement the CMS UI with grouped fields, numeric percentage inputs, image preview/file selection, save-state/error feedback, carousel ordering/activation, and logout. Do not expose CSS/layout controls.**
- [ ] **Step 7: Run tests and `npx tsc --noEmit`; manually verify a failed save remains visibly unsaved and a failed upload preserves the previous image URL.**
- [ ] **Step 8: Commit with `feat: add editable ZYVO CMS`.**

### Task 5: Connect the existing Home to CMS data without visual regression

**Files:**
- Modify: `app/page.tsx`
- Create: `app/HomeClient.tsx`
- Modify: `app/refine.css`

**Interfaces:**
- Consumes `loadHomeContent()` and `HomeContent`.
- Preserves progress entrance animation, 4-second carousel, manual arrows, expandable sidebar, and current approved layout.

- [ ] **Step 1: Add a failing content-mapping test showing CMS title, 69-style main percentage, card percentages, profile name/avatar, carousel text/images, nav labels, and next-meeting fields override defaults.**
- [ ] **Step 2: Run the test and verify RED.**
- [ ] **Step 3: Convert `app/page.tsx` to a server loader and move interactive markup to `HomeClient.tsx`. Replace hard-coded editable values with `HomeContent` props while preserving all existing classes and animations.**
- [ ] **Step 4: Render CMS card/carousel image URLs as background media with the same overlays and `cover/center` behavior. Keep current GitHub-hosted card art as fallback if the database has no replacement.**
- [ ] **Step 5: Run tests, `npx tsc --noEmit`, and compare the default-data Home against the pre-CMS Home to confirm no intentional layout/copy regression.**
- [ ] **Step 6: Commit with `feat: connect Home to CMS content`.**

### Task 6: Production verification and deployment

**Files:**
- Modify only if verification reveals a defect.

**Interfaces:**
- Produces a verified production build and deployed CMS/Home.

- [ ] **Step 1: Run all Node tests and require zero failures.**
- [ ] **Step 2: Run `npm run build` and require exit code 0.**
- [ ] **Step 3: Verify no service-role key or generated temporary password appears in tracked files using repository search.**
- [ ] **Step 4: Configure Vercel production environment with only the public Supabase URL/publishable key needed by the browser; keep any privileged bootstrap secret out of Vercel unless a server-only route explicitly requires it.**
- [ ] **Step 5: Deploy production and verify `/`, `/cms/login`, forced first-password change, forgot-password callback, `/cms`, text edit, percentage edit, image replacement, and Home reflection.**
- [ ] **Step 6: Run Supabase security advisors once more and resolve any new CMS-related security finding.**
- [ ] **Step 7: Commit any verification fixes and record the final verified commit/deployment ID in the completion report.**

# Floating Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating dark note editor and persistent notes library to the Home sidebar.

**Architecture:** Use a focused `FloatingNotes` client component for editor/library UI and Supabase persistence. Add a `notes` table with RLS scoped to `auth.uid()`. Wire existing Home sidebar buttons to open the component without route changes.

**Tech Stack:** Next.js 15, React, TypeScript, Supabase, CSS, lucide-react.

**Spec:** `docs/superpowers/specs/2026-09-09-floating-notes-design.md`

## Global Constraints
- Preserve current Hero, cards, menu visuals, calculator behavior, images, and quality.
- `Anotar` opens editor; `Anotações` opens saved-note cards.
- Notes persist in Supabase and are private per authenticated user.

---

### Task 1: Notes database

**Files:**
- Create: `supabase/migrations/20260909_user_notes.sql`

**Interfaces:**
- Produces: `public.notes(id,user_id,subject,body,created_at,updated_at)` with RLS.

- [ ] **Step 1: Write migration**
- [ ] **Step 2: Apply migration to project `rbsgkwwlnxjxqxlqlzfe`**
- [ ] **Step 3: Verify table and RLS**
- [ ] **Step 4: Commit**

### Task 2: Floating notes component

**Files:**
- Create: `app/FloatingNotes.tsx`
- Create: `app/floating-notes.css`

**Interfaces:**
- Consumes: existing `createBrowserClient()` helper.
- Produces: `FloatingNotes({mode,onClose})`, where `mode` is `editor | library | null`.

- [ ] **Step 1: Write a failing source test for editor/library and Supabase note operations**
- [ ] **Step 2: Verify RED**
- [ ] **Step 3: Implement editor, card library, load/save/update behavior**
- [ ] **Step 4: Verify GREEN**
- [ ] **Step 5: Commit**

### Task 3: Home sidebar wiring

**Files:**
- Modify: `app/HomeClient.tsx`

**Interfaces:**
- Consumes: `FloatingNotes`.
- Produces: sidebar handlers for `Anotar` and `Anotações`.

- [ ] **Step 1: Write failing wiring test**
- [ ] **Step 2: Verify RED**
- [ ] **Step 3: Add state and sidebar handlers; render FloatingNotes**
- [ ] **Step 4: Verify GREEN**
- [ ] **Step 5: Commit**

### Task 4: Verification

**Files:**
- Test: `tests/floating-notes-source.test.mjs`

- [ ] **Step 1: Run focused tests**
- [ ] **Step 2: Verify latest GitHub contents**
- [ ] **Step 3: Verify Vercel deployment status**

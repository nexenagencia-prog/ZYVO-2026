# Interactive Notes Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver physical arrow/drag motion plus functional view, edit and delete for every Notes card.

**Architecture:** Keep the existing `/anotacoes` client route and Supabase notes table. Add carousel animation state and a centered modal editor in the page, materializing demo cards into user-owned notes when they are first saved.

**Tech Stack:** Next.js 15, React, TypeScript, Supabase, CSS.

**Spec:** `docs/superpowers/specs/2026-09-09-interactive-notes-carousel-design.md`

## Global Constraints
- Preserve the existing card visual language.
- Preserve `AppSidebar` and profile avatar on the Notes page.
- Keep RLS and authenticated ownership for persisted notes.
- Do not generate or replace UI with mockup images.

---

### Task 1: Behavior tests
- [ ] Extend the notes source test to require arrow animation, modal open, save and delete handlers.
- [ ] Verify the test fails before implementation.

### Task 2: Interactive carousel and modal
- [ ] Add arrow transition state so cards physically animate before active index changes.
- [ ] Add card/modal selection and view/edit state.
- [ ] Add save that inserts demo notes or updates persisted notes through Supabase.
- [ ] Add delete confirmation and persisted delete.
- [ ] Keep pointer drag and sidebar behavior intact.

### Task 3: Styling and verification
- [ ] Style the larger centered modal in the same premium black language.
- [ ] Run tests and confirm green.
- [ ] Verify Vercel build/deploy status before reporting completion.

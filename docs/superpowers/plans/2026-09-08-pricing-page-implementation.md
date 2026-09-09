# Pricing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a faithful ZYVO pricing page at `/planos` and link it from the existing top navigation.

**Architecture:** Keep Home untouched except for the `Planos e Preços` link. Build the pricing page as a focused client component with local billing-period state and a dedicated stylesheet scoped to the pricing page.

**Tech Stack:** Next.js App Router, React, TypeScript, Lucide icons, CSS.

**Spec:** `docs/superpowers/specs/2026-09-08-pricing-page-design.md`

## Global Constraints
- Do not alter the existing Home hero structure, colors, or layout.
- Use the exact pricing copy from the supplied reference.
- Monthly and annual controls must be interactive; annual uses 20% discount.
- Page must remain responsive.

---

### Task 1: Build pricing route

**Files:**
- Create: `app/planos/page.tsx`
- Create: `app/planos/pricing.css`

- [ ] Implement the three cards and billing toggle.
- [ ] Match spacing, typography, borders, rounded corners, highlighted Pro card and button treatment.
- [ ] Add responsive rules.
- [ ] Verify TypeScript/JSX structure by re-fetching the committed files.

### Task 2: Wire navigation

**Files:**
- Modify: `app/HomeClient.tsx`

- [ ] Give the fourth top navigation item an href to `/planos` while keeping the other existing navigation items unchanged.
- [ ] Re-fetch the file to verify the link is present.
- [ ] Check repository status/CI if available.

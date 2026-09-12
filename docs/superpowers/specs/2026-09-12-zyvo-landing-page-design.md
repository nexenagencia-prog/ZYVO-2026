# ZYVO Landing Page — Design Spec

Date: 2026-09-12
Repository: nexenagencia-prog/ZYVO-2026
Status: approved concept, awaiting implementation-plan approval

## Objective
Build a production-ready ZYVO landing page that translates the approved Apple-inspired mockup into a real responsive web experience. The page must feel premium, minimal and product-first, while clearly explaining ZYVO to first-time visitors.

The landing page must distinguish ZYVO's core platform from its two intelligence layers:
- Skills: meeting-performance analysis.
- Human Pro: contextual intelligence that uses meeting history to identify recurring patterns, blind spots, capability gaps and what the user should learn or practice next.

## Visual Direction
Use the approved mockup as the primary visual reference.

Key characteristics:
- Apple-inspired editorial spacing and visual restraint.
- White, silver, graphite and deep-black palette.
- Soft radial gradients and directional light rather than saturated color.
- Glass surfaces with subtle blur, fine borders and restrained shadows.
- Large refined typography with strong hierarchy and generous whitespace.
- Minimal line icons.
- Cinematic device/product framing.
- Motion should be slow, subtle and functional; no neon, excessive glow or gimmicks.

The supplied original ZYVO wordmark is the brand source of truth. Do not redraw or reinterpret it.

## Technology
Use the existing ZYVO-2026 Next.js application and follow its current architecture rather than creating a separate standalone project.

Target stack:
- Next.js App Router
- TypeScript
- Existing styling approach in the repository; Tailwind may be used only if already compatible with the codebase, otherwise implement with the current CSS strategy.
- Next/Image for local imagery where practical.
- Lightweight CSS/React transitions; avoid large animation dependencies unless the existing repository already uses one.

No new backend is required for the landing page. Existing Supabase/app functionality must remain untouched unless navigation requires a safe existing route.

## Information Architecture

### 1. Header
A thin premium header using the supplied ZYVO logo.

Primary navigation:
- Início
- Skills
- Human Pro
- Planos
- Contato

Primary CTA: `Começar agora`.

Behavior:
- Starts visually integrated with the hero.
- Becomes lightly translucent/blurred when scrolling if this can be done without visual noise.
- Mobile navigation collapses cleanly.

### 2. Hero
Purpose: explain ZYVO in under five seconds.

Recommended headline direction:
`Converse. Evolua. Vá além.`

Supporting copy must immediately define the product:
`A ZYVO é uma plataforma de videoconferência com inteligência de performance humana. Faça suas reuniões, analise seu comportamento e descubra o que realmente precisa desenvolver.`

CTAs:
- `Começar agora`
- `Ver como funciona`

The visual side should present a high-end meeting interface/device composition inspired by the approved mockup. It must feel like a real ZYVO product surface, not a generic stock SaaS dashboard.

### 3. ZYVO Explanation
Purpose: move the visitor from “video meeting product” to “performance platform.”

Core idea:
`Mais do que uma chamada de vídeo.`

This section explains that meetings contain behavioral signals and that ZYVO preserves and interprets context across meetings instead of treating each call as an isolated event.

Avoid listing Skills scores in this section.

### 4. Skills
Purpose: explain Skills as the meeting-analysis layer.

Skills should be presented as analysis of what happened in a meeting: communication, structure, interaction and meeting-performance signals. This section may visually reference analytics, progress or meeting analysis, but must not be used to explain Human Pro.

The exact Skills indicators should reuse the product's existing language and should not be fabricated solely for marketing.

### 5. Human Pro
Purpose: position Human Pro as a separate intelligence tool inside ZYVO.

Required explanation:
Human Pro is not another standalone product and not a score dashboard. It is a contextual conversational intelligence layer inside ZYVO that can inspect meeting history and recurring patterns to help the user understand what is missing and what to develop.

Core prebuilt questions:
- Onde estou errando?
- O que está me faltando?
- O que preciso aprender?
- O que preciso mudar no meu comportamento?
- O que devo praticar?

Human Pro may connect meeting patterns to development areas such as persuasion, sales, negotiation, oratory, teaching, leadership, argumentation, product knowledge and listening. Copy must avoid diagnostic/clinical claims.

Visual treatment: dark editorial section, restrained glass conversation panel, strong contrast against the brighter surrounding sections.

### 6. Integrated Tools
Purpose: show that ZYVO is a working environment, not only an analysis product.

Show the current product tools in a clean grid using only features that already exist or are clearly planned in the current product:
- Reuniões
- Gravações
- Agenda
- Anotações
- Compartilhar tela
- Calculadora
- Criar slides
- Skills

Human Pro remains visually distinct rather than being reduced to one equal-size utility tile.

### 7. Performance Loop
Purpose: make the system easy to understand without generic motivational language.

Show the product logic visually:
`Reunião → padrão → lacuna → prática → nova reunião → comparação`

The message is that ZYVO can preserve context over time and help the user compare behavior across subsequent meetings.

### 8. Final CTA
A cinematic dark/silver closing section.

Suggested direction:
`Suas próximas reuniões podem mostrar mais do que você imagina.`

Primary CTA: `Começar agora`.
Secondary CTA may be `Conhecer a plataforma` or `Falar com um especialista`, depending on the final route availability.

Avoid unsupported claims such as fake user counts, fake country counts, fake testimonials or unverified numerical results.

## Copy Principles
- Direct, intelligent and high-authority.
- Explain the product as if the visitor has never heard of ZYVO.
- No romantic/self-help language.
- No “libere seu potencial” style messaging.
- No invented superiority claims such as “10,000x better.”
- No claim that ZYVO is the only product in the world unless independently validated.
- Emphasize concrete behavior: meetings, patterns, blind spots, development gaps, practice and comparison.
- Keep Skills and Human Pro conceptually separate.

## Responsive Behavior
Desktop is the hero experience, but mobile must be intentionally designed rather than simply stacked.

Requirements:
- No horizontal overflow.
- Large typography scales down smoothly.
- Device/product mockups remain readable without dominating the viewport.
- Cards collapse from grids to one/two columns at sensible breakpoints.
- Human Pro prompt chips remain compact and tappable.
- Header/navigation remains usable at common mobile widths.

## Accessibility and Performance
- Semantic landmarks and headings.
- Meaningful alt text for product visuals.
- Visible keyboard focus.
- Respect `prefers-reduced-motion`.
- Optimize large images and avoid unnecessary client-side JavaScript.
- Prioritize strong Core Web Vitals and prevent layout shifts.

## Component Boundaries
Recommended focused components:
- LandingHeader
- HeroSection
- PlatformIntroSection
- SkillsSection
- HumanProSection
- ToolsSection
- PerformanceLoopSection
- FinalCtaSection
- reusable GlassCard / SectionEyebrow / CTA primitives where existing patterns do not already cover them.

Keep content/data separate from complex visual layout where practical so marketing copy can be edited without restructuring components.

## Routing and Integration
The landing page should live inside the existing ZYVO-2026 app and must not break authenticated application routes.

Before implementation, inspect the current root route, middleware and login/app routing. If `/` is currently an authenticated/product route, preserve behavior via a safe public landing route strategy rather than overwriting a critical flow blindly.

CTAs should point only to routes verified to exist in the repository. No dead links.

## Testing and Acceptance Criteria
Before deployment:
- Existing tests continue to pass.
- Add focused tests for landing route rendering/navigation where the repository's current test stack supports them.
- Run production build successfully.
- Check desktop and mobile layouts.
- Verify no obvious overflow, missing images or broken CTA routes.
- Verify Skills and Human Pro copy remain separated.
- Verify original ZYVO logo is used.
- Verify no fabricated social proof appears.

## Deployment
Use the existing GitHub repository `nexenagencia-prog/ZYVO-2026`.

After implementation and verification:
1. Commit the landing-page changes to a dedicated branch.
2. Open/review the change as appropriate.
3. Deploy using the existing Vercel project connected to this repository when accessible.
4. Confirm the production deployment is healthy before declaring completion.

If multiple Vercel projects are attached to the repository, identify the currently active ZYVO-2026 production project from the connected account rather than guessing.

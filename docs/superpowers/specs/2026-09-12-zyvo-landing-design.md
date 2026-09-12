# ZYVO Landing Page — Design Specification

Date: 2026-09-12
Repository: nexenagencia-prog/ZYVO-2026
Status: Approved design, awaiting implementation-plan review gate

## 1. Objective

Create a production-ready ZYVO landing page inside the current ZYVO-2026 Next.js application, using the approved Apple-inspired visual direction and the original ZYVO logo supplied by the user.

The page must position ZYVO as a videoconferencing platform centered on human performance, while clearly separating the roles of Skills and Human Pro.

The implementation should feel premium, minimal, precise, cinematic, and fast rather than template-like or visually noisy.

## 2. Product Narrative

The page must explain ZYVO to a first-time visitor in this order:

1. ZYVO is a videoconferencing platform with intelligence focused on human performance.
2. Meetings are the source of behavioral and professional context.
3. Skills analyzes meeting performance and provides structured analysis.
4. Human Pro is a separate intelligence tool inside ZYVO that uses the user's meeting history to identify patterns, blind spots, learning gaps, and areas to practice.
5. ZYVO also centralizes productivity tools so the user can remain in the same environment before, during, and after meetings.

The landing page must avoid generic self-development language, coaching clichés, or ungrounded claims. The copy should be forceful, technical, persuasive, and concrete.

## 3. Visual Direction

Reference direction: the approved second landing-page mockup generated in this conversation.

Core style:

- Apple-inspired premium minimalism.
- White, silver, graphite, charcoal, and deep black palette.
- Soft monochrome gradients.
- Large editorial typography with generous whitespace.
- Thin dividers and subtle borders.
- Frosted-glass / translucent cards used sparingly.
- Soft layered shadows, no neon.
- Cinematic light falloff and blurred background shapes.
- Refined micro-interactions rather than aggressive animation.
- High contrast where content becomes dark, but never pure visual clutter.

The original ZYVO logo supplied by the user should be used rather than recreated as text where practical.

## 4. Page Architecture

### 4.1 Header

Persistent clean top navigation with:

- ZYVO logo.
- Início.
- Skills.
- Human Pro.
- Planos.
- Contato.
- Primary CTA: "Começar agora".

Desktop header is spacious and thin. Mobile header collapses into a compact menu without changing the premium appearance.

### 4.2 Hero

Purpose: explain the category immediately.

Suggested headline direction:

"A reunião agora entende você."

Supporting copy should establish that ZYVO is a videoconferencing platform with intelligence focused on human performance.

Hero visual: a realistic ZYVO meeting interface presented in a premium device / glass-panel composition inspired by the approved mockup, using existing ZYVO UI patterns where possible instead of imitating another videoconferencing product.

CTAs:

- Começar agora.
- Ver como funciona.

Supporting microcopy should be minimal. Avoid fake adoption numbers unless real data is available.

### 4.3 What ZYVO Changes

Large light section explaining that ZYVO does more than host a call.

Core narrative:

- Meetings create context.
- ZYVO preserves that context.
- Repeated interactions can reveal patterns.
- The user gains a better view of what is happening across conversations rather than only receiving a transcript or recap.

Use 3 premium cards, for example:

- Reuniões em alta qualidade.
- Inteligência aplicada às reuniões.
- Continuidade entre uma reunião e a próxima.

These cards are explanatory, not statistical.

### 4.4 Skills Section

Skills must be visually and conceptually independent from Human Pro.

Purpose: structured analysis of a meeting and meeting performance.

Explain that Skills can surface performance indicators, key moments, insights, and patterns inside meeting analysis.

Do not use Human Pro messaging in this section.

Do not hard-code fake score values as marketing proof. If sample values are used visually, mark them as interface demo content only.

### 4.5 Human Pro Section

Dark cinematic section with the strongest contrast on the page.

Human Pro must be explicitly introduced as:

"uma ferramenta dentro da ZYVO"

Its purpose is not to repeat Skills scores. Its purpose is to help interpret the person behind the meetings by using available historical context.

Prominent pre-built questions:

- Onde estou errando?
- O que está me faltando?
- O que preciso aprender?
- O que preciso mudar no meu comportamento?
- O que devo praticar?

Messaging should emphasize pattern discovery, blind spots, learning gaps, professional behavior, communication, persuasion, sales, teaching, leadership, negotiation, argumentation, and product knowledge when supported by meeting context.

The section should visually feel like a focused intelligence workspace, not a generic chatbot.

### 4.6 Integrated Tools

Light section with simple icon-based modules based on tools already present or planned in ZYVO:

- Reuniões.
- Gravações.
- Agenda.
- Anotações.
- Compartilhar tela.
- Calculadora.
- Criar slides.
- Skills.

This section supports the idea that ZYVO keeps the user's meeting workflow in one environment.

### 4.7 Performance Intelligence / Continuity

A section explaining the loop:

Meeting → analysis → pattern → learning gap → practice → next meeting → comparison.

The page should explain this visually with minimal copy and a refined progression rather than a crowded diagram.

### 4.8 Final CTA

Premium dark-to-silver section with original ZYVO branding.

Primary message should focus on the next meeting becoming more useful because previous conversations retain context.

CTA: "Começar agora".

Secondary CTA may be "Conhecer a plataforma" or "Ver como funciona".

Do not include fabricated user counts, country counts, testimonials, or performance promises.

## 5. Copy Principles

- Portuguese (Brazil).
- Short, direct, high-authority language.
- No romanticism.
- No generic "desperte seu potencial" style copy.
- Avoid repetitive use of "evolução" when a concrete term is available.
- Explain the product before assuming the visitor understands Human Pro or Skills.
- Human Pro is always described as a tool inside ZYVO.
- Skills and Human Pro remain separate concepts.
- Do not promise psychological diagnosis or mental-health assessment.
- Avoid literally claiming "10,000x better" or "nothing else exists" unless externally validated.

## 6. Technical Architecture

Use the existing Next.js 15 / React 19 application in `nexenagencia-prog/ZYVO-2026` rather than creating a separate repository.

Current repository already contains:

- Next.js application structure.
- Supabase dependencies.
- Existing ZYVO shell / UI components.
- Existing Vercel trigger file.
- Existing tests.

Implementation should avoid unnecessary dependencies. Use existing `lucide-react` for icons.

Tailwind should not be introduced unless it is already present in the repository at implementation time; the current package manifest does not list Tailwind. Prefer the project's existing CSS approach to avoid increasing complexity solely for the landing page.

Recommended component structure:

- `app/landing/page.tsx` or another non-destructive route first.
- `app/landing/LandingPage.tsx` for page composition.
- `app/landing/landing.css` for scoped visual system.
- Small focused components for Header, Hero, Skills, HumanPro, Tools, PerformanceLoop, FinalCTA if the page becomes large.

Do not replace the existing authenticated home/dashboard until the landing page is verified and routing behavior is explicitly confirmed.

## 7. Asset Strategy

- Use the original ZYVO logo supplied in the conversation.
- Reuse existing repository assets where they fit the visual language.
- Avoid copying third-party product screenshots.
- UI screenshots shown in the landing page should be derived from ZYVO's own interface patterns.
- Use optimized local images / WebP where possible.

## 8. Interaction and Motion

Motion should communicate quality rather than spectacle.

Allowed:

- Soft fade / translate on viewport entry.
- Subtle card parallax or hover depth.
- Slow light-gradient movement.
- Minimal button hover feedback.
- Smooth anchor navigation.

Avoid:

- Continuous heavy animation.
- Neon glows.
- Large-scale 3D libraries.
- Motion that hurts mobile performance.

Respect `prefers-reduced-motion`.

## 9. Responsiveness

Target:

- Desktop: primary reference, 1440–1920px.
- Tablet: preserve composition without cramped cards.
- Mobile: single-column narrative, compact typography, touch-friendly controls, no horizontal overflow.

Hero device composition should simplify on mobile rather than shrinking illegibly.

## 10. Accessibility

- Semantic headings.
- Sufficient contrast.
- Visible focus states.
- Buttons and links with meaningful labels.
- Alt text for meaningful imagery.
- Decorative imagery hidden from assistive technology when appropriate.
- Reduced-motion support.

## 11. Performance

- Prefer server components where interactivity is unnecessary.
- Keep client-side JavaScript minimal.
- Use Next image optimization when appropriate.
- Lazy-load below-the-fold visual assets.
- Avoid large animation runtimes.
- Maintain a lightweight landing route that does not load authenticated dashboard logic unnecessarily.

## 12. Routing and Safety

The first implementation should be isolated from the current application experience.

Recommended path: `/landing` for implementation and review.

After visual and functional approval, routing can be switched so `/` becomes the marketing landing page and the current app home moves or remains behind the authenticated route, but this is a separate routing decision and must not be done implicitly.

This approach minimizes risk to the current ZYVO product while enabling full production deployment and review on Vercel.

## 13. Testing

At minimum:

- Existing test suite must remain green.
- `npm run build` must succeed.
- Validate landing route on desktop and mobile widths.
- Check navigation anchors.
- Check reduced-motion behavior.
- Check no overflow on mobile.
- Verify logo asset renders correctly.
- Verify no console errors.

## 14. Git / Deployment Strategy

Implementation should be done on a dedicated feature branch.

Suggested branch:

`feat/apple-landing`

Workflow:

1. Create feature branch from current `main`.
2. Implement landing page and assets.
3. Run tests and production build.
4. Commit changes.
5. Push branch.
6. Open PR against `main`.
7. Verify Vercel preview deployment if the project is already linked.
8. After approval, merge to `main`.
9. Verify production deployment.

If the Vercel project is not currently linked to `nexenagencia-prog/ZYVO-2026`, use the connected Vercel integration to identify or create the project and link the repository only after confirming the correct production project.

## 15. Non-Goals for This First Pass

- Building a full new backend.
- Reimplementing Skills logic.
- Reimplementing Human Pro intelligence logic.
- Changing Supabase schema.
- Replacing existing authenticated application routes before review.
- Adding payments or subscription checkout.
- Adding fake social proof.

This first pass is a production-ready marketing landing experience built on top of the current ZYVO codebase.

# ZYVO Space Design

## Goal

Add a `Space` destination to the existing ZYVO sidebar and provide an isolated, responsive meeting workspace inspired by the supplied reference. Existing routes, colors, spacing, and layouts remain unchanged.

## Scope

The new `/space` route combines six focused areas: a live meeting stage, participant gallery, evolution carousel, compact agenda, meeting notes, and bottom meeting controls. The route uses the existing `AppSidebar`, ZYVO logo, typography, pale glass treatment, stored profile, recordings, and notes conventions.

The implementation is local-first. Camera and microphone controls use `navigator.mediaDevices.getUserMedia` after a user click and stop every media track when disabled or when leaving the page. Chat messages, notes, agenda entries, selected layout, and lightweight meeting preferences persist in `localStorage`. Share copies the current Space URL using the Web Share API when available and the clipboard otherwise.

## Interaction Model

- `Space` in the shared sidebar navigates to `/space` and receives the active state only on that route.
- Camera and microphone buttons request only the media permission they need, show their live status, and surface a concise permission error without blocking the workspace.
- Chat adds non-empty messages, timestamps them, persists them, and scrolls to the latest message.
- Participant layout switches between mosaic and list views. Participant filters can show all, active, or muted people.
- Evolution cards move with previous/next controls and pagination indicators.
- Agenda items can be added, completed, reopened, and removed.
- Meeting notes can be created, edited, saved, and removed using the same guest notes storage used elsewhere in ZYVO.
- The bottom toolbar opens the relevant panels, toggles devices, copies/shares the link, and asks for confirmation before leaving the Space.

## Architecture

- `app/space/space-model.ts` owns serializable types, default data, and pure state helpers.
- `app/space/SpaceClient.tsx` owns browser integrations and composes the workspace sections.
- `app/space/space.css` is fully scoped beneath `.space-page` so no existing route changes appearance.
- `app/space/page.tsx` is the route entry point.
- `app/AppSidebar.tsx` gains the single shared navigation item.

## Error Handling and Accessibility

Controls expose accessible names and pressed/expanded state. Modals are keyboard dismissible, forms have labels, and reduced-motion preferences disable nonessential transitions. Media and clipboard failures are shown inline and never erase saved state.

## Verification

Static contract tests protect the sidebar route, scoped CSS, persistence keys, media cleanup, and expected functional sections. Browser verification covers navigation, chat, notes, agenda, layout/filter controls, share fallback, media-denial handling, and exit confirmation. The full test command and production build must complete before delivery; pre-existing unrelated failures, if any, will be reported explicitly.

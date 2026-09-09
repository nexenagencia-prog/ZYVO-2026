# Floating Notes Design

## Goal
Create a floating black note editor opened from the Home sidebar item **Anotar**, visually matching the existing floating calculator, and persist saved notes in Supabase so they appear under **Anotações** as cards.

## UX
- Clicking **Anotar** opens a centered floating black note window above the existing Home without navigating away.
- The editor contains an **Assunto** input, a larger **Texto** field, a minimal **Salvar** button, and a close control.
- The surface follows the calculator's dark, rounded, minimal visual language.
- Clicking **Anotações** opens a floating notes library with cards showing subject, text preview, and date/time.
- Clicking a note card opens it in the editor for reading/editing.
- Saving an existing note updates the same record.

## Persistence
- Store notes in a new `public.notes` table in Supabase.
- Each note belongs to `auth.uid()` through `user_id`.
- RLS allows authenticated users to select, insert, update, and delete only their own notes.
- The client uses the existing Supabase browser client and authenticated session.

## Constraints
- Do not modify Hero, cards, menu appearance, calculator behavior, images, or current visual quality.
- No route transition is required for Anotar/Anotações; both are floating overlays on Home.
- Keep the implementation lightweight and client-side except for Supabase persistence.

# Interactive Notes Carousel Design

## Goal
Make the fixed Notes page feel like an Apple-style physical carousel and make every visible note card openable, editable and deletable while preserving the Hero sidebar and profile.

## Interaction
- Pointer drag moves the physical cards continuously.
- Arrow clicks use the same physical slide transition rather than replacing card content in place.
- The centered card scales up while neighboring cards scale down.
- Clicking a card or `Ver anotação` opens a larger centered note modal.
- The modal supports view/edit, save, delete with confirmation, and close.

## Persistence
Authenticated notes are stored in `public.notes` under existing RLS. The three illustration notes remain available for visual seeding; when an authenticated user edits one, it is materialized as a real user-owned note before saving. Deleting an illustration hides it locally for that user session; persisted user notes delete from Supabase.

## Navigation invariant
`AppSidebar` is always present on internal product pages and reads the same `zyvo-profile-avatar` localStorage key as Home, preserving the user's profile photo.

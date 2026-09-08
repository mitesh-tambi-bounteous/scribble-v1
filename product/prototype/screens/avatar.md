---
project: scribl
updated: 2026-09-01
---

# /avatar

The account-profile use of the shared drawing canvas: a person draws their own
avatar instead of picking one from a preset. It sits inside F8 Account and
profile, reached from Settings, and is the only one of the three DrawPad
screens whose result is saved to the server rather than a local store.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/avatar` |
| Router file | `app/avatar.tsx` |
| Flows | F8 Account and profile |
| Position in flow | none; a side trip off `/settings`, not a numbered step (`/home` -> `/settings` -> `/avatar` -> `/settings`) |
| Data calls | one write, `updateUser` via `updateProfile`, `PATCH /users/{id}` |
| Shared surface | the `DrawPad` canvas, shared with `/draw` and `/onboarding/canvas` |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/10-avatar.png"><img src="/assets/prototype/10-avatar.png" alt="Avatar screen: a header reading 'YOUR AVATAR' above a white canvas holding a grey circle guide with a stick-figure creature drawn inside it in navy, pink and yellow, a row of nine colour swatches with orange selected below the canvas, then an undo button and a pink Save avatar button"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

`72c3ab8` is not on `main`; it is the unmerged flow-map branch that seeds a
draft so the capture shows a real drawing instead of an empty canvas. Unlike
the three onboarding-canvas captures downstream of the seed, this one is not a
copy of another route's screenshot, since `/avatar` is not gated by the
onboarding draft guard. There is no trash/clear button visible in the tile,
only undo and Save avatar; the toolset check below explains why.

## Features

| Feature | Where it lives |
|---------|----------------|
| Draw freehand inside a circular guide, not a rounded-rect frame | `app/avatar.tsx:54` passes `frameShape="circle"`, guide drawn at `components/canvas/DrawPad.tsx:468-486` |
| Pick a colour from the full base palette, not narrowed by `allowedColors` | `app/avatar.tsx:48-56` passes no `allowedColors` prop, so `DrawPad` skips the `narrow()` step (`components/canvas/DrawPad.tsx:200-204, 229`) and renders `toolset.palette` unchanged |
| Undo the last stroke | `components/canvas/DrawPad.tsx:319-323`, control at `:700-708` |
| Finish, cropping and saving the drawing as the profile avatar | `app/avatar.tsx:31-42`, export at `components/canvas/DrawPad.tsx:325-357` |
| A busy state on the Save button while the write is in flight | `app/avatar.tsx:29, 50-51` (`busy={saving}`, `busyLabel="Saving..."`) |

Same toolset gate as onboarding-canvas: this screen is rendered with whichever
toolset `activeToolset()` resolves to at build time (`components/canvas/DrawPad.tsx:12, 223`,
`src/config/features.ts:24-29`), so brush-size selector, style picker, fill
bucket and clear-with-confirm all come or go together with the
`EXPO_PUBLIC_FULL_TOOLSET` flag, not per screen. The one thing avatar.tsx
itself controls is the mask (`frameShape="circle"`) and the palette (no
`allowedColors`, so it gets whatever the active toolset's full palette is).
That is the opposite of onboarding-canvas, which narrows the palette but keeps
the rectangular frame.

## Data calls

**One write, and it reaches the server.**

| Client method | Endpoint | Handler |
|----------------|----------|---------|
| `updateUser(id, patch)` | `PATCH /users/{id}` | `backend/lambda/handlers/user-update.ts` |

`app/avatar.tsx:34-38` crops the exported PNG to a 256x256 square with
`squareAvatarDataUri` (`src/lib/image.ts:15-58`), then calls
`useAuthStore.updateProfile({ avatarImage })` (`app/avatar.tsx:35`). That store
action calls `dataClient.updateUser(currentUser.id, patch)`
(`src/stores/useAuthStore.ts:150`), which sends the PATCH
(`src/data/http.ts:272-283`) whose handler is documented as "self-only user
profile update (S-Settings)" (`backend/lambda/handlers/user-update.ts:2`).

This is the direct opposite of onboarding-canvas, where finishing the drawing
writes only to `useDraftStore` and never calls the API. Here the drawing does
travel to the server, and the local write is a side effect of the network
call succeeding: `updateProfile` sets `currentUser` from the server's response
(`src/stores/useAuthStore.ts:150-153`), not from the data URI directly.
`goBack("/settings")` only fires when the PATCH returns `ok` (`app/avatar.tsx:38`);
on failure the screen stays put and renders `authError` below the canvas
(`app/avatar.tsx:58-62`).

## State in, state out

**Reads on entry.** None. The screen renders `DrawPad` directly with no prompt
or prior-state fetch; the only store read is `authError` from `useAuthStore`
(`app/avatar.tsx:28`), used only for the error banner.

**Writes on mount.** None. There is no onboarding-step marker or draft seed
written when this screen opens; `CAPTURE_CANVAS_INITIAL_STROKES` at
`app/avatar.tsx:15-17` is a dev-only capture-harness seed, gated out of release
bundles by `parseCaptureCanvasStrokes` (`app/avatar.tsx:16`).

**Writes on exit.** On Save: `avatarImage` PATCHed to the server and, on
success, mirrored into `currentUser` and AsyncStorage via `persistCurrentUser`
(`src/stores/useAuthStore.ts:150-153`), then `goBack("/settings")`
(`app/avatar.tsx:38`). On Cancel (the header back arrow): `goBack("/settings")`
with no write at all (`app/avatar.tsx:46`).

## Components

| Component | Path |
|-----------|------|
| `DrawPad`, the shared canvas and its tool row | `components/canvas/DrawPad.tsx`, imported at `app/avatar.tsx:5` |
| `ScreenHeader` | `components/nav/ScreenHeader.tsx`, used at `app/avatar.tsx:46` |
| `Text` (error banner) | `components/ui/text` |

`DrawPad` is documented in its own comment as shared across
`app/draw.tsx`, `app/avatar.tsx` and `app/onboarding/canvas.tsx`
(`components/canvas/DrawPad.tsx:206-212`), confirmed here by the import at
`app/avatar.tsx:5` and the doc comment above it at `app/avatar.tsx:19-25`
("Reuses the shared DrawPad canvas with a circle guide"). One canvas, three
screens, three flows: F4 (`/draw`), F8 (`/avatar`), F2
([/prototype/screens/onboarding-canvas](/prototype/screens/onboarding-canvas)).
`/draw` is a plain route, not yet its own wiki page in this pass.

## Notes for planning

Authored here, not read out of the app.

### The avatar is the one DrawPad output that leaves the device

Onboarding's drawing and the daily `/draw` submission both stay local or
route through their own flow-specific store; only this screen's export
travels as a PATCH body to a shared user record. That makes avatar the one
place in the app where the data-URI-too-large-for-a-route-param problem (noted
in onboarding-canvas's own writeup, `src/stores/useDraftStore.ts:23-25`) is
also a network-payload-size problem: every profile fetch that returns this
user now carries a base64 PNG. The 256x256 crop keeps that bounded on web, but
`squareAvatarDataUri` is a no-op on native (`src/lib/image.ts:15-22`), so a
native save PATCHes the full, uncropped export. Worth checking the actual size
of that payload before this ships past a POC.

### No confirmation on discard, unlike Settings' other edits

The header back arrow exits with no write and no confirm dialog
(`app/avatar.tsx:46`), so a drawn avatar not yet saved is silently lost. That
matches `/draw`'s clear-canvas confirm being about erasing strokes, not about
leaving the screen, so this is consistent with the rest of the app rather than
an omission specific to avatar.

### Full palette here, narrowed palette in onboarding: likely intentional, not written down

Avatar passes no `allowedColors`, so it gets the same base palette as `/draw`.
Onboarding narrows it. That split reads as deliberate: a first-run tutorial
constraining choice, a profile edit not needing to. But same as
onboarding-canvas's own note on its palette, nothing in the source states the
reasoning, so the next person to touch either screen cannot tell "designed
this way" from "nobody revisited it."

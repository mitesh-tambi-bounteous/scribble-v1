---
project: scribl
updated: 2026-09-01
---

# /compose

Take several drawings picked off a wall and arrange them into one composed
piece. It is reachable only from a wall's multi-select, and it refuses to
render its own canvas until at least two drawings are in hand.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/compose` |
| Router file | `app/compose.tsx` |
| Flows | F5 Wall browsing, reactions and composition |
| Position in flow | a branch off `/family`, not a step in the main journey |
| Data calls | one write, `createComposition`, fired from Save or Share, not on entry |
| Shared surface | none; the Skia stage is compose-only, isolated the same way `app/draw.tsx` isolates `DrawingCanvas` |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/20-compose.png"><img src="/assets/prototype/20-compose.png" alt="Compose screen showing the real composer: a white canvas holding one placed drawing of a bird with a selection frame and corner handles, a tray of three picked drawings below it, undo and clear buttons, and Save and Share buttons at the bottom"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This is the real composer, not the guard message. The inventory's screen table
lists `/compose` as "yes, guard message" (`product/design/screen-flow-inventory.md`,
the `/compose` row), but this tile shows a populated canvas: one drawing placed
and selected, three drawings in the tray below it, undo and clear controls, and
Save and Share at the bottom. `72c3ab8` seeds sources before visiting the route,
the same pattern the F2 workflow page found for the draft-guarded onboarding
screens, so this tile clears the `MIN_SOURCES` guard that a cold visit on `main`
would not. The inventory's "yes, guard message" line is stale for this capture
and needs the same correction the F2 page already flagged for its own tiles.

## Features

| Feature | Where it lives |
|---------|----------------|
| See the guard message and go back when fewer than two drawings are selected | `app/compose.tsx:37-55` |
| Place a picked drawing onto the canvas as a movable sticker | `components/compose/ComposeStage.tsx:192-212` |
| Move, corner-scale and rotate a placed drawing | `components/compose/composeReducer.ts:68-89` (gesture actions), rendered via `ComposeCanvas` |
| Undo the last change | `components/compose/ComposeStage.tsx:214-216`, control at `:369-382` |
| Clear the canvas | `components/compose/ComposeStage.tsx:218-220`, control at `:383-395` |
| Save the composition to the personal wall | `components/compose/ComposeStage.tsx:284-308` |
| Share the composition, skipping the response-detail detour | `components/compose/ComposeStage.tsx:310-347` |
| Go back to the wall | `app/compose.tsx:40`, `:49-51` |

`MIN_SOURCES` is `2` (`app/compose.tsx:12`), enforced at `app/compose.tsx:37`:
`sources.length < MIN_SOURCES` renders the guard state instead of
`ComposeStageHost`. The inventory's own prose already states this value
(`product/design/screen-flow-inventory.md`, F5 section), and the source
confirms it. A composition also caps at 6 source drawings
(`COMPOSITION_MAX_SOURCES`, `packages/shared-types/composition.ts:74`) and 12
placed items (`COMPOSITION_MAX_PLACED_ITEMS`, `:82`); a source can be placed
more than once, so those two caps are independent, and `ComposeStage.tsx:206-209`
enforces the placed-item cap with an honest status line rather than a silent
no-op.

## Data calls

**One write, not on entry.**

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `createComposition()` | `POST /compositions` | `backend/lambda/handlers/composition-create.ts` |

The client method is `src/data/http.ts:173-183`. It fires from `saveComposition()`
(`components/compose/ComposeStage.tsx:227-282`), called by both `handleSave`
(`:284-308`) and `handleShare` (`:310-347`). The screen never calls it on mount;
there is no read call at all. The handler derives the destination channel
server-side from the caller's id rather than trusting the request body, and
re-checks membership and submission on every source response the same way
`channel-responses.ts` does, stated in the handler's own doc comment
(`backend/lambda/handlers/composition-create.ts:1-23`).

## State in, state out

**Reads on entry.** `sources` off `useComposeStore`
(`app/compose.tsx:35`), populated earlier by the wall's multi-select, not by
this screen. Nothing else is read on mount; there is no effect and no API call.

**Writes on exit, success path.** `handleSave` sets a confirmation status,
replaces to `/family` with the origin channel id, then turns multi-select off,
which clears `sources`, `originChannelId` and `capMessage`
(`components/compose/ComposeStage.tsx:299-307`, store side effect at
`src/stores/useComposeStore.ts:53`). `handleShare` instead replaces to `/share`
with the saved response's fields as params (`components/compose/ComposeStage.tsx:332-345`).

**Writes on exit, failure path.** A failed save leaves `sources` untouched so
the person can retry with the same drawings still picked
(`components/compose/ComposeStage.tsx:227-233`, comment at `:286-289`).

## Components

| Component | Path |
|-----------|------|
| `ComposeStageHost`, the Skia-safe loader boundary | `components/compose/ComposeStageHost.tsx`, imported at `app/compose.tsx:4` |
| `ComposeStage`, the canvas, tray, and save/share actions | `components/compose/ComposeStage.tsx` |
| `ComposeCanvas`, the Skia surface | `components/compose/ComposeCanvas.tsx` |
| `ComposeTray`, the row of picked drawings | `components/compose/ComposeTray.tsx` |
| `ScreenHeader` | `components/nav/ScreenHeader.tsx`, used at `app/compose.tsx:40` and `:59` |

None of these are shared with another screen the way `DrawPad` is. `ComposeStage`
carries a doc comment stating its isolation is a direct copy of
`components/canvas/DrawingCanvas.tsx`'s pattern, not a shared instance of it
(`components/compose/ComposeStage.tsx:34-51`).

## Notes for planning

Authored here, not read out of the app.

### The inventory's capture note for this screen is stale

The inventory says `/compose` shows "guard message"; this tile shows the real
composer with one drawing placed and three in the tray. Both statements were
true of different captures. The inventory's screen table is gated by
`npm run test:flow-inventory` and is out of scope for this pass, but whoever
owns that document should re-run it against a capture seeded the way `72c3ab8`
seeds it, the same fix the F2 workflow page already flags for the
draft-guarded onboarding screens.

### No persistent nav entry is a deliberate constraint, not an oversight

`/compose` only exists as a branch off `/family`'s multi-select
(`product/design/screen-flow-inventory.md`, F5 section). There is no back
button that leads here, no tab, nothing bookmarkable. That is consistent with
compose being a tool applied to a specific set of drawings rather than a
place, but it does mean a person cannot resume a half-built composition after
leaving; closing the app loses the arrangement, since nothing here persists it
before Save is pressed.

### Save and Share both write, and only one of them can be undone

Both actions call the same `saveComposition()`, so tapping Share also
permanently saves the composition to the personal wall, even for someone whose
only intent was to share it once
(`components/compose/ComposeStage.tsx:310-347`). There is no share-without-save
path. Worth confirming this is the intended behaviour before anyone treats
Share as a lighter-weight action than Save.

---
project: scribl
updated: 2026-09-01
---

# /story-select

Step 2 of the daily loop, F4. The either/or fork: a person tells the story
behind the drawing they just made, either by typing it or by recording a
voice note, never both. It holds no state of its own and makes no data
calls; it exists to route to one of two screens.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/story-select` |
| Router file | `app/story-select.tsx` |
| Flows | F4 Daily create and submit |
| Position in flow | step 2 of 5, the type-or-record fork |
| Data calls | none |
| Shared surface | none; same two-card shape as `/onboarding/story-select`, not a shared component |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/14-story-select.png"><img src="/assets/prototype/14-story-select.png" alt="Story-select screen: 'Tell the story behind your drawing. Type it, or record it out loud.' above two large cards, a T-glyph card marked 280 characters or less and a microphone-icon card marked 30 seconds or less"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This tile is the screen's real interface, not a bounced copy of `/draw`.
It shows exactly what the source renders: a centered column with the two
choice cards and their character/duration copy, correctly reflecting a
seeded draft in the store.

## Features

| Feature | Where it lives |
|---------|----------------|
| Read `STORY_MAX_LENGTH` (280) and show it in the type-card copy | `app/story-select.tsx:11`, `:52` |
| Read `VOICE_MAX_SECONDS` (30) and show it in the record-card copy | `app/story-select.tsx:11`, `:67` |
| Go to `/write` to type the story | `app/story-select.tsx:58` |
| Go to `/record` to record the story | `app/story-select.tsx:73` |
| Back to `/draw` | `app/story-select.tsx:38` |

There is no third option and no skip. A person cannot advance past this
screen without choosing type or record.

## Data calls

**None.** This screen makes no API call and reads no data beyond the draft
guard below. It is a pure router between `/write` and `/record`.

## State in, state out

**Reads on entry.** `useDraftStore`'s `imageRef`
(`app/story-select.tsx:26`), used only for the draft guard.

**R6 draft guard.** Landing here without an active draft (a deep link or a
web refresh) is structurally invalid, so the screen bounces straight to
`/draw`:

```
useEffect(() => {
  if (!draftImageRef) router.replace("/draw");
}, []);
```

at `app/story-select.tsx:30-33`. This is the first of the four draft-guarded
screens in this flow; `/write`, `/record`, and `/choose-channels` each carry
the identical pattern.

**Writes on exit.** None. `story-select` does not touch the draft store; it
only routes.

## Components

| Component | Path |
|-----------|------|
| `ScreenHeader`, the shared back-button-plus-label top bar | `components/nav/ScreenHeader.tsx`, imported at `app/story-select.tsx:7` |

No canvas, no shared drawing component -- this is the one screen in the F4
loop before submission that does not touch `DrawPad` or the drawing image.

## Notes for planning

Authored here, not read out of the app.

### The draft guard is the load-bearing fact of this entire screen set

`/story-select`, `/write`, `/record`, and `/choose-channels` all read
`useDraftStore`'s `imageRef` on mount and bounce to `/draw` if it is empty
(`app/story-select.tsx:30-33`, `app/write.tsx:50-53`, `app/record.tsx:75-80`,
`app/choose-channels.tsx:49-52`). Reached cold -- a bookmark, a shared link,
a stale web tab -- every one of these four screens is unreachable; the
person lands back at the drawing canvas with no explanation of why. That is
correct behavior for a screen that structurally cannot render anything
useful without a draft, but it means these four routes have exactly one
entry point in practice: falling through from `/draw`. Anyone testing or
demoing this flow by URL needs to know that.

### The two cards commit to a choice with no way back to the other one mid-flow

Tapping the type card or the record card is a one-way door within this
step: `/write` and `/record` each have their own back button
(`app/write.tsx:63`, back to `/story-select`), so a person CAN return here
and pick the other path, but nothing already typed or recorded survives the
switch -- `setCaption` and `setAudio` each clear the other field
(`src/stores/useDraftStore.ts:72-74`). That is the right data model given
the DB's text-or-audio CHECK constraint, but it means "let me try recording
instead" silently discards a caption already drafted.

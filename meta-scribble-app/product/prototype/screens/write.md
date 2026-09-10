---
project: scribl
updated: 2026-09-01
---

# /write

The text half of the story fork, step 3 of the daily loop, F4. A person
captions the drawing they just made, looking at the real image while they
type. Nothing is submitted here: the primary button stashes the caption
into the draft and hands off to `/choose-channels`, where the actual
submit-to-unlock call happens.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/write` |
| Router file | `app/write.tsx` |
| Flows | F4 Daily create and submit |
| Position in flow | step 3 of 5, the text half of the type-or-record fork |
| Data calls | none. Writes the caption to the draft store, no API call |
| Shared surface | none; reads `useDraftStore`'s `imageRef` the same way `/choose-channels` does |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/15-write.png"><img src="/assets/prototype/15-write.png" alt="Write screen: 'ADD A CAPTION' header above a white card holding a drawn orange sun, then an empty caption input marked 0 / 280, and a pink 'Choose who sees this' button"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

Real interface, real content: the sun drawing in the preview card is the
seeded draft's actual image, not the crayon-doodle fallback
(`app/write.tsx:73-78`) that renders only when `imageRef` is unexpectedly
absent. The caption input is empty at capture time, so the character
counter reads `0 / 280` -- confirming the 280 cap below, not the 280-word
claim from onboarding copy alone.

## Features

| Feature | Where it lives |
|---------|----------------|
| Show the real drawing from the draft, large, above the caption field | `app/write.tsx:70-79`, image component `components/DrawingImage.tsx` |
| Fall back to a placeholder doodle only if the draft image is missing | `app/write.tsx:73-77` |
| Size the preview card to the drawing's own aspect ratio, capped at a 320px budget | `app/write.tsx:44-45`, hooks in `components/art/useDrawingAspectRatio.ts` |
| Type a caption up to 280 characters, with a live `n / 280` counter | `app/write.tsx:83-88`, `:107-109` |
| Clear the caption in one tap | `app/write.tsx:94-103` |
| Continue to channel selection, stashing the caption first | `app/write.tsx:55-58`, `:115-117` |
| Back to `/story-select` | `app/write.tsx:63` |

## Data calls

**None.** `/write` makes no API call. Continuing writes into the draft
store:

```
useDraftStore.getState().setCaption(caption);
router.push("/choose-channels");
```

at `app/write.tsx:56-57`. `setCaption` also clears any voice-note fields
left over from an abandoned recording (`src/stores/useDraftStore.ts:72-73`),
so a submission can never carry both.

The 280-character cap is `STORY_MAX_LENGTH`, defined once at
`packages/shared-types/tools.ts:86` and imported directly here
(`app/write.tsx:18`), the same constant `/story-select` reads for its own
copy (`app/story-select.tsx:11`). One number, one source, confirmed against
the real screen rather than assumed from the onboarding twin.

## State in, state out

**Reads on entry.** `useDraftStore`'s `imageRef` (`app/write.tsx:38`), used
both for the preview and for the draft guard below.

**R6 draft guard.** Landing here without an active draft (a deep link or a
web refresh) is structurally invalid, so the screen bounces to `/draw`:

```
useEffect(() => {
  if (!draftImageRef) router.replace("/draw");
}, []);
```

at `app/write.tsx:50-53`, with the same mount-only, `getState()`-avoiding
pattern as the other three guarded screens in this flow. The draft is never
cleared while on this screen (per the code comment at `app/write.tsx:49`).

**Writes on exit.** `caption` into `useDraftStore` via `setCaption`
(`app/write.tsx:56`).

## Components

| Component | Path |
|-----------|------|
| `ScreenHeader` | `components/nav/ScreenHeader.tsx`, imported at `app/write.tsx:11` |
| `PaperSurface`, the preview card chrome | `components/art/PaperSurface.tsx`, imported at `app/write.tsx:9` |
| `DrawingImage`, renders the draft's data URI | `components/DrawingImage.tsx`, imported at `app/write.tsx:8` |
| `Doodle`, the placeholder-only fallback art | `components/art/Doodle.tsx`, imported at `app/write.tsx:7` |

## Notes for planning

Authored here, not read out of the app.

### "Final once it's out there" is asserted here before submission exists

The footer copy under the button -- "Your drawing is final once it's out
there -- captions you can still tweak" (`app/write.tsx:118-120`) -- promises
caption edits after publish, but nothing in this repo pass shows a caption
edit surface post-submission. That promise is made on a screen two steps
before the actual submit call (`/choose-channels`), and honoring it is a
gap this write-up can name but not close: there is no `/response/[id]`
caption editor evidenced from this pass. Worth confirming before this copy
ships as-is.

### The 280 cap is real and matches onboarding, but confirm it independently next time

The task brief for this page asked to verify the real cap rather than
assume it matched onboarding's copy. It does match, and it is the same
constant (`packages/shared-types/tools.ts:86`), not a coincidence of two
different numbers landing on 280. That is good hygiene already in the
source; noting it here so a future audit does not re-derive it from
scratch.

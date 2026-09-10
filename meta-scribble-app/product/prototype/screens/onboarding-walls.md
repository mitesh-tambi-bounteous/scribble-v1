---
project: scribl
updated: 2026-09-01
---

# /onboarding/walls

Step 6 of 7 in first-run onboarding, and the screen where the first Scribl
actually goes out: tapping Share here calls the same submit path
`/choose-channels` uses. Everything on it is about picking a destination, not
about drawing or writing.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/onboarding/walls` |
| Router file | `app/onboarding/walls.tsx` |
| Flows | F2 First-run onboarding, F3 Invite and join, per the [screen and flow inventory](/design/screen-flow-inventory) |
| Position in flow | step 6 of 7, the draft producer's last stop before it posts |
| Data calls | one write, `submit()`, fired from this screen's Share button |
| Shared surface | `OnboardingFrame`, the heading/paragraphs/footer chrome every onboarding screen uses |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/07-onboarding-walls.png"><img src="/assets/prototype/07-onboarding-walls.png" alt="Onboarding walls: 'You're almost done' above three lines of copy about picking walls, a white card labelled 'SHARE TO:' holding two rows, 'Personal Wall' and 'Family Wall', each with an empty circular selector on the right, and below the card a full-width grey bar with no visible text where the Share button sits"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

Two rows, "Personal Wall" and "Family Wall", each with an unchecked circular
selector, matching the unselected-row markup at `app/onboarding/walls.tsx:194-197`.
Neither is checked, which is correct: nothing is preselected once there is a
real choice (`app/onboarding/walls.tsx:52-65`). The bar at the bottom is the
Share button in its disabled state. It reads as a flat grey-purple rectangle
with no visible label. The label is not actually absent from the markup --
see Features below -- but at this viewport the disabled styling makes it
unreadable, which is the same visual outcome as no label at all.

## Features

One row per thing a person can do.

| Feature | Where it lives |
|---------|----------------|
| See every wall they belong to, personal wall included | `app/onboarding/walls.tsx:31,164-201`, backed by `useWallsStore` |
| Toggle any wall on or off, no wall privileged or locked | `app/onboarding/walls.tsx:76-84` |
| See a filled circle with a check on a selected row, an empty ring on an unselected one | `app/onboarding/walls.tsx:181-197` |
| Share to every wall picked, at least one required | `app/onboarding/walls.tsx:86-130`, disabled condition at `:145` |
| See a submit error inline if the share call fails | `app/onboarding/walls.tsx:203-205` |

There is no back button and no skip. Not stated as an omission; the affordance
is absent from `app/onboarding/walls.tsx`.

**The disabled/unlabelled button, confirmed in source.** The Share button's
`disabled` prop is `selected.size === 0 || submitting`
(`app/onboarding/walls.tsx:145`). Its label is always rendered text, either
`"Sharing..."` or `"Share"` (`app/onboarding/walls.tsx:154-156`), so the label
is never empty in the markup. What makes it unreadable in the capture is a
styling call made at this exact call site: when `selected.size === 0`, the
button gets `className="bg-muted opacity-100"` and the text gets
`className="text-muted"` (`app/onboarding/walls.tsx:146-154`). A comment right
above that code (`app/onboarding/walls.tsx:146-151`) says this is a deliberate
patch for a real defect in the shared `Button` component, whose default
opacity-50-disabled style still reads as an enabled pink button at this
viewport, and the fix is applied here rather than in
`components/ui/button.tsx` because other agents own that file. So: the button
is disabled on purpose, correctly, and its label is technically present but
low-contrast enough at this viewport to look blank. The tile is showing a real
UI state, not a broken one.

## Data calls

**One write, fired from this screen.**

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `submit()` | `POST /submit` | `backend/lambda/handlers/submit.ts` |

The client method is `src/data/http.ts:162-171`. `handleShare()`
(`app/onboarding/walls.tsx:86-130`) calls `dataClient.submit()` at
`app/onboarding/walls.tsx:98`, passing the prompt id, caption or audio, and
strokes from `useDraftStore`, plus the chosen wall ids as `channelIds`
(`:90,99-112`). On success it clears the draft
(`app/onboarding/walls.tsx:122`) and replaces the route with
`/onboarding/ready` (`:123`). This is the actual post: by the time
`/onboarding/ready` renders, the Scribl already exists server-side.

`dataClient` resolves to `httpDataClient` when `EXPO_PUBLIC_API_MODE=http`
(`src/data/index.ts:11-17`); otherwise it is the mock adapter. `submit.ts`'s
own header states it is the only write path that creates the submission item
the AC2 unlock check depends on (`backend/lambda/handlers/submit.ts:1-7`).

On failure, `submitError` is set and shown inline
(`app/onboarding/walls.tsx:124-126,203-205`); the person stays on this screen.

## State in, state out

**Reads on entry.** The list of walls, via `useWallsStore().load()`
(`app/onboarding/walls.tsx:31,48-50`). The in-memory draft's `imageRef`,
`promptId`, `caption`, `audioRef` and `strokes`, via `useDraftStore`
(`app/onboarding/walls.tsx:32`).

**Draft guard on mount.** A mount-only effect checks
`useDraftStore.getState().imageRef` and, if absent, replaces the route with
`/onboarding/canvas` (`app/onboarding/walls.tsx:40-46`). `walls` is one of the
three `DRAFT_REQUIRED_STEPS` (`src/lib/onboardingFlow.ts:34`); reached without
a draft, `resumeStep()` would have already sent this person to `canvas`
(`src/lib/onboardingFlow.ts:53-60`).

**Writes on mount.** `useOnboardingStep("walls")`
(`app/onboarding/walls.tsx:28`) persists the step name to AsyncStorage under a
per-user key (`src/lib/useOnboardingStep.ts:13-19`,
`src/stores/useOnboardingStore.ts:220`).

**Writes on exit.** The submission itself, server-side, via `submit()`
(`app/onboarding/walls.tsx:98`). Locally, `useDraftStore.getState().clearDraft()`
(`app/onboarding/walls.tsx:122`) and a best-effort streak record that is not
awaited and cannot block navigation
(`app/onboarding/walls.tsx:118-121`).

## Components

| Component | Path |
|-----------|------|
| `OnboardingFrame` | `components/onboarding/OnboardingFrame.tsx`, imported at `app/onboarding/walls.tsx:17` |
| `Button` | `components/ui/button.tsx`, imported at `app/onboarding/walls.tsx:18` |
| `Icon` (renders the check glyph) | `components/ui/icon.tsx`, imported at `app/onboarding/walls.tsx:19` |
| `Text` | `components/ui/text.tsx`, imported at `app/onboarding/walls.tsx:20` |

`OnboardingFrame` is shared across all seven F2 steps; a change to its
heading/paragraph/footer layout lands on every one of them.

## Notes for planning

Authored here, not read out of the app.

### The disabled button is a deliberate patch, not a gap

The greyed, hard-to-read Share button is not a defect in this screen. It is a
documented workaround (`app/onboarding/walls.tsx:146-151`) for a defect in the
shared `Button` component, applied locally because this screen's agent does
not own that file. That is the right call for a POC, but it means the real fix
is still owed to `components/ui/button.tsx`, and every other screen using
`Button`'s default disabled state has the same low-contrast problem this one
just chose to route around.

### "You can pick as many walls as you like" undersells the one-wall case

The copy always says "starting with your own personal wall" and "pick as many
walls as you like" (`app/onboarding/walls.tsx:137-139`), but when a person has
exactly one wall it is silently preselected
(`app/onboarding/walls.tsx:52-65`) so Share is reachable at all. The tile in
this capture shows two walls and nothing preselected, so this branch is not
visible here. Worth deciding whether the copy should say anything different
when there is nothing left to choose.

### The disabled state is invisible-by-accident, not invisible-by-design

The intent at `app/onboarding/walls.tsx:146-151` is a button that reads
"unambiguously not yet available." What the tile shows is a button that reads
as blank. Low contrast between `text-muted` and `bg-muted` achieves "not
tappable" and "not readable" at the same time, and only the first one was the
goal. This is worth a second look with real contrast values before this
screen goes in front of a client.

---
project: scribl
updated: 2026-09-01
---

# /splash

The cold-start fork. It shows the brand mark for a fixed dwell, checks whether
the signed-in person has finished onboarding, and sends them to either today's
prompt or their resume step in first-run onboarding. It never renders a choice;
it decides one.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/splash` |
| Router file | `app/splash.tsx` |
| Flows | F1 Launch and authentication |
| Position in flow | the fork after sign-in, before today's prompt or onboarding |
| Data calls | none. Reads two local stores, writes none |
| Shared surface | none |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/01-splash.png"><img src="/assets/prototype/01-splash.png" alt="Splash screen: a full-bleed abstract colour illustration in pink, orange, green and navy with the white scribl wordmark centred over it, no other text or controls"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This is a good tile: it shows exactly what the screen is, art and wordmark,
nothing else. There is no button to click and nothing hidden by the capture,
because the screen has no control surface. The dwell-then-redirect behaviour
described below cannot show up in a static image; it is documented from the
source, not the tile.

## Features

| Feature | Where it lives |
|---------|----------------|
| Hold the brand mark for a fixed dwell before moving on | `app/splash.tsx:15`, `:35` (`SPLASH_DWELL_MS = 900`) |
| Fork to today's prompt when the person has finished onboarding | `app/splash.tsx:49-51` |
| Fork to the resumed onboarding step when they have not | `app/splash.tsx:53-55` |

There is nothing to tap. The screen moves on by itself; the doc comment at
`app/splash.tsx:19` says so directly: "it is not a button-stop."

## Data calls

No direct call, and no call at all on this screen. `checkOnboarded()`
(`app/splash.tsx:34`) reads local `AsyncStorage` through `useOnboardingStore`,
not the API (`src/stores/useOnboardingStore.ts:147-185`).

## State in, state out

**Reads on entry.** `useOnboardingStore`'s `hasOnboarded`
(`app/splash.tsx:29`), populated by `checkOnboarded()` fired in the mount
effect (`app/splash.tsx:33-37`). Once the dwell timer finishes and
`hasOnboarded` is resolved, a second effect reads `useDraftStore.getState().imageRef`
to see if a drawing survives (`app/splash.tsx:53`), then calls
`useOnboardingStore.getState().resumeTarget(hasDraft)` to pick the resume step
(`app/splash.tsx:54`). `resumeTarget` is `resumeStep()` in
`src/lib/onboardingFlow.ts:53-61`: a persisted step is honored unless it needs
the draft and the draft is gone, in which case it clamps back to `canvas`.

**Writes on mount.** None. This screen writes nothing to any store; it only
triggers the read in `checkOnboarded()`.

**Writes on exit.** None. The route change is a `router.replace`
(`app/splash.tsx:50`, `:55`), not a state write.

## Components

| Component | Path |
|-----------|------|
| `ImageBackground` splash art, `Title Animation.png` | `app/splash.tsx:59-69` |

No shared component from elsewhere in the app renders here; the screen is
self-contained.

## Notes for planning

Authored here, not read out of the app.

### The fork is a matched pair with two other screens

`/splash` alone cannot be read. Its "onboarded" branch depends on
`useOnboardingStore`'s state, which `/sign-up` populates via
`checkOnboarded()` before routing (`src/lib/postAuthRoute.ts:20-21`), and its
"not onboarded" branch depends on `useDraftStore`, which only
`/onboarding/canvas` writes. Reading this screen in isolation, without those
two, tells you what it does but not why it is correct.

### The dwell has a dev-only escape hatch

`app/splash.tsx:46-48` skips both forks entirely when `__DEV__` and a capture
flag are set, so the screenshot harness can freeze here. Worth noting because
a reader diffing behaviour against a screenshot should know this branch
exists and is gated out of any shipped build.

### No failure state

If `checkOnboarded()` throws, the catch in the store still resolves
`hasOnboarded: false` rather than leaving the promise rejected
(`src/stores/useOnboardingStore.ts:177-184`), so `/splash` always reaches one
of its two forks. There is no third branch on this screen for "something went
wrong"; the store already absorbed that decision upstream.

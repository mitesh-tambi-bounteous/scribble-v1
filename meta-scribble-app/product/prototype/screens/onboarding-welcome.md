---
project: scribl
updated: 2026-09-01
---

# /onboarding/welcome

Step 1 of 7 in first-run onboarding, the first screen anyone sees after splash
or after accepting an invite. It says what Scribl is and offers exactly one way
forward.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/onboarding/welcome` |
| Router file | `app/onboarding/welcome.tsx` |
| Flows | F2 First-run onboarding, F3 Invite and join |
| Position in flow | step 1 of 7 |
| Data calls | none. Reads the local invite context and store, no request |
| Shared surface | `OnboardingFrame`, the shell every onboarding screen after this one uses too |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/02-onboarding-welcome.png"><img src="/assets/prototype/02-onboarding-welcome.png" alt="Onboarding welcome: the scribl wordmark, the heading 'Welcome to Scribl!', a muted paragraph about connecting with family and friends through prompts and drawings, two bolder lines about the guided tutorial and connecting with people you care about, and a pink Get Started button"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This is the invite-less copy: "Welcome to Scribl!" rather than a name, and the
generic closing line rather than one naming an inviter
(`src/lib/invitePersonalization.ts:73`, `:78-80`). The capture does not show the
personalized path.

One thing the tile shows that the source does not explain: the first paragraph
renders in the frame's muted text style, but the second and third paragraphs
render visibly bolder and darker despite all three coming from the same
`paragraphs` prop mapped through one `Text` element with one class
(`components/onboarding/OnboardingFrame.tsx:48-52`). Recorded as seen in the
capture, not diagnosed against the source.

## Features

| Feature | Where it lives |
|---------|----------------|
| Read the wordmark and greeting, personalized when an invite is active | `app/onboarding/welcome.tsx:30-36`, greeting logic `src/lib/invitePersonalization.ts:72-74` |
| Advance to the prompt intro | `app/onboarding/welcome.tsx:23-25`, button at `:43-49` |

There is no back button and no skip. Not an omission in this write-up; the
affordance is absent from `app/onboarding/welcome.tsx`.

The screen's own doc comment calls it "Screen 4 of the designed first run, from
Figma export 'Intro - What is.png'" (`app/onboarding/welcome.tsx:11`). The
numbering there is a Figma-export numbering, not the F2 step count used on this
page; ONBOARDING_STEPS (`src/lib/onboardingFlow.ts:11-19`) is what this page
follows.

## Data calls

**No direct call.** The screen calls two hooks, `useInviteContext()`
(`app/onboarding/welcome.tsx:21`) and `useOnboardingStep("welcome")`
(`app/onboarding/welcome.tsx:19`). `useInviteContext()` reads
`useInvitesStore`, whose `load()` reads two `AsyncStorage` keys and returns,
with no network request (`src/stores/useInvitesStore.ts:96-104`). There is no
`getTodayPrompt` or any other `httpDataClient` call on this screen.

## State in, state out

**Reads on entry.** The active simulated invite and invite list, via
`useInviteContext()` (`app/onboarding/welcome.tsx:21`, hook body
`src/lib/invitePersonalization.ts:51-69`). Returns `null` for an invite-less
walk, which drives the generic copy.

**Writes on mount.** `useOnboardingStep("welcome")`
(`app/onboarding/welcome.tsx:19`) persists the step name to AsyncStorage under
a per-user key (`src/lib/useOnboardingStep.ts:16-18`,
`src/stores/useOnboardingStore.ts:220`). This is what makes a relaunch resume
here, not a hard-coded first screen, as long as the step is not clamped by the
draft guard (it is not on the guard list, see Notes below).

**Writes on exit.** Nothing. `handleGetStarted` only calls `router.push`
(`app/onboarding/welcome.tsx:23-25`); no store write happens on leaving this
screen.

## Components

| Component | Path |
|-----------|------|
| `OnboardingFrame`, the shared onboarding shell | `components/onboarding/OnboardingFrame.tsx`, imported at `app/onboarding/welcome.tsx:4` |
| `Button` | `components/ui/button`, imported at `app/onboarding/welcome.tsx:5` |
| `Text` | `components/ui/text`, imported at `app/onboarding/welcome.tsx:6` |

`OnboardingFrame` is the shared shell for every screen in the designed first
run, "screens 4 to 11" per its own doc comment
(`components/onboarding/OnboardingFrame.tsx:22-26`). It lands on both screens
in this pass and on the five other onboarding screens named in the F2 workflow
page.

## Notes for planning

Authored here, not read out of the app.

### The personalization seam is invisible in the capture

`welcomeGreeting()` (`src/lib/invitePersonalization.ts:72-74`) and
`welcomeConnectionLine()` (`:77-81`) both branch on an active
invite, but the committed tile only
shows the invite-less branch. Anyone reviewing this page from the screenshot
alone will not see the feature that F3 depends on. Worth capturing the invited
variant too before this page is used to sell the invite flow to a client.

### "Screen 4" and "step 1" are two numbering systems on one file

The file's own comment says "Screen 4 of the designed first run"
(`app/onboarding/welcome.tsx:11`), counting from the Figma export. This page
and the F2 workflow page count from `ONBOARDING_STEPS`, where welcome is index
0, step 1 of 7. Both are correct in their own frame, but a reader jumping
between the source comment and this page will see two different numbers for
the same screen with nothing pointing out that they are different scales.

### Bold paragraphs with no styling difference in the source

The second and third paragraphs render bolder in the capture than the first,
despite `OnboardingFrame` giving every paragraph the same class
(`components/onboarding/OnboardingFrame.tsx:48-52`). Either something
downstream (font fallback, a global style) treats these strings differently,
or the capture is misleading. Flagged as a finding, not fixed here.

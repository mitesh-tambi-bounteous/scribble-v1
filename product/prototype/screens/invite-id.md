---
project: scribl
updated: 2026-09-01
---

# /invite/[id]

The accept screen for a wall invitation, and the entire screen surface of F3
Invite and join. It stands in for a hosted invite-landing page that the
project has not built, and it hands off into the full F2 onboarding flow for
anyone who has not onboarded yet.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/invite/[id]` |
| Router file | `app/invite/[id].tsx` |
| Flows | F3 Invite and join (its whole screen surface) |
| Position in flow | entry point: `/invite/[id]` -> F2 in full -> `/family` -> `/home` |
| Data calls | no direct call on accept; reads and writes are local to `useInvitesStore` (AsyncStorage). Decline, unreachable from this screen, would call `leaveWall` |
| Shared surface | `OnboardingFrame`, also used across the seven `/onboarding/*` screens |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/27-invite.png"><img src="/assets/prototype/27-invite.png" alt="Invite screen: the scribl wordmark, the heading 'Rob has invited you to their Family Wall wall', a drawn illustration of two figures high-fiving under the words 'LET'S SCRIBL!!!' in pink, then a solid pink 'Accept and join' button and a plain-text 'Not now' link below it"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This tile shows the real accept card, not the guard state. That is worth
saying because the route defaults to a not-found empty state when no matching
invite record exists in storage (`src/dev/captureRoute.ts:59-61`, describing
`CAPTURE_INVITE`), and the committed default for that seed constant is the
empty string, meaning no seed (`src/dev/captureRoute.ts:63`). So this capture
only shows the working card because `72c3ab8` seeded an invite record before
navigating. `72c3ab8` is not on `main`; it is the unmerged flow-map branch,
the same one that seeds the onboarding canvas draft. On `main` with no seed,
this route photographs as the "This invite is no longer available" state
(`app/invite/[id].tsx:65-76`), not this card.

One more thing the tile shows, unremarked, as a real product-copy bug rather
than a capture artifact: the heading reads "Family Wall wall". `inviteHeadline`
appends the literal word "wall" after the wall's own name
(`src/lib/simulatedInvites.ts:195-198`), so any wall already named with the
word "wall" in it doubles up. That is not the seed data being unrealistic,
it is the heading template not accounting for a name that already ends in the
word it appends.

## Features

| Feature | Where it lives |
|---------|----------------|
| Load the invite record for the id in the route param | `app/invite/[id].tsx:39-51` |
| Show a loading spinner while the store loads | `app/invite/[id].tsx:53-59` |
| Show an honest "no longer available" state for a missing or already-decided invite, with a way back to the wall list | `app/invite/[id].tsx:65-76` |
| Accept, then route to onboarding or straight into the wall depending on onboarding status | `app/invite/[id].tsx:80-105` |
| Show an inline error if the accept write fails, with no distinct retry action beyond tapping again | `app/invite/[id].tsx:83-86`, `143-147` |
| Defer with "Not now", which returns to the wall list without deciding the invite | `app/invite/[id].tsx:111-113`, `151-158` |

"Not now" is not a decline. It does not call the store's `decline` method; it
only routes back to `/home`, leaving the record pending so it reappears there
(comment at `app/invite/[id].tsx:107-110`). `useInvitesStore.decline`
(`src/stores/useInvitesStore.ts:144-175`) is real code with its own
`leaveWall` call, but no screen calls it; the only caller in the repo is the
store's own unit test (`tests/invites-store.test.ts:173-202`). It is either
aimed at a decline affordance that was designed and then cut from this
screen, or dead code waiting for one to be added back. Either way the screen
currently offers no UI path to actually decline an invite, only to defer it
indefinitely.

## Data calls

**No direct call on accept or defer.**

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| none called from this screen | -- | -- |

Accept reads and writes only `useInvitesStore`, which is backed by
AsyncStorage under `scribl:simulatedInvites` and `scribl:activeSimulatedInvite`
(`src/stores/useInvitesStore.ts:24-27`, `128-143`). Membership in the wall
already exists server-side by the time this screen runs; the invite record is
what hides that membership from the wall list until it is accepted
(`src/lib/simulatedInvites.ts:17-21`). The one path in the store that does
touch the network is `decline`, which calls `dataClient.leaveWall`
(`src/stores/useInvitesStore.ts:165`, client method at
`src/data/http.ts` under `leaveWall`, handler under
`backend/lambda/handlers/`), but this screen never calls `decline`, so that
call site is unreachable from here.

## State in, state out

**Reads on entry.** `useInvitesStore`'s `loaded` state and the invite matching
the route's `id` param via `find` (`app/invite/[id].tsx:39-44`), loading the
store if it has not loaded yet (`:47-51`).

**Writes on mount.** None. Unlike the onboarding screens, this route does not
call `useOnboardingStep`; it is outside the seven-step sequence.

**Writes on exit.** On accept: the invite's status flips to `"accepted"` in
AsyncStorage and the accepted invite becomes the active invite for onboarding
personalization (`app/invite/[id].tsx:82`, store logic at
`src/stores/useInvitesStore.ts:128-143`). Then, depending on the resolved
`hasOnboarded` flag, navigation replaces to `/onboarding/welcome`
(`app/invite/[id].tsx:96`) or to `/family` with the wall's id as a param
(`app/invite/[id].tsx:104`). On defer: no store write, just a replace to
`/home` (`app/invite/[id].tsx:112`).

## Components

| Component | Path |
|-----------|------|
| `OnboardingFrame`, the shared centered-copy shell | `components/onboarding/OnboardingFrame.tsx`, imported at `app/invite/[id].tsx:31` |
| `Button` | `components/ui/button.tsx`, imported at `app/invite/[id].tsx:32` |
| `Text` | `components/ui/text.tsx`, imported at `app/invite/[id].tsx:33` |

`OnboardingFrame` is shared with all seven `/onboarding/*` screens
(doc comment at `components/onboarding/OnboardingFrame.tsx:21-26`), so this
screen inherits their layout conventions rather than defining its own.

## Notes for planning

Authored here, not read out of the app.

### There is no hosted landing page, and no way to reach this screen from outside the app

The router file's own header calls this "an in-app stand-in for the hosted
invite landing page" and says the real page is unfunded and out of scope
(`app/invite/[id].tsx:1-18`), a framing the flow inventory repeats
(`product/design/screen-flow-inventory.md:91-93`). Tracing how this screen is
actually reached shows the gap is bigger than "no landing page yet": the only
route into `/invite/[id]` anywhere in the app is a tap on a badged wall row
already inside the signed-in app (`app/home.tsx:205`, `router.push({
pathname: "/invite/[id]" ...})`). There is no deep link, no email send, and no
token. Accepting an invite today only works if the invitee already has an
account, is already signed in, and already sees the wall in their own list.
The realignment-plan item this defers to (`src/lib/simulatedInvites.ts:1-10`)
is not a styling gap on top of a working mechanism; it is the entire
out-of-app half of the feature, and nothing in this repo builds toward it.

### The invite record is a single-device illusion

`src/lib/simulatedInvites.ts:12-16` says this outright: invite on one device,
accept on another, and the request does not exist there. That is fine for a
one-machine demo and wrong for anything past it. Anyone estimating "add real
invites" from this POC should read that as "replace the whole mechanism," not
"wire up the button," because the button already does the right sequencing
(accept, then resolve onboarding state, then route); only the transport under
it is fake.

### The final hop to /home in the e2e proof is asserted, not demonstrated

`e2e/invite-flow.spec.ts` walks this flow across two accounts up to landing in
`/family`, then calls `page.goto("/home")` directly at line 195 rather than
tapping any in-app control, exactly as the flow inventory says
(`product/design/screen-flow-inventory.md:88-90`). The spec's own assertion
that follows, that the wall shows up unbadged, is real coverage of the state
change. What is not covered by any test is a person actually tapping their way
from the wall back to the home list. Small gap, but it is the only edge in
this flow's diagram that has no UI-driven test behind it.

### Decline exists in the store and nowhere in the UI

`useInvitesStore.decline` (`src/stores/useInvitesStore.ts:144-175`) does real
work, including giving back membership through `leaveWall`, but no screen
calls it. "Not now" only defers. Worth deciding on purpose whether declining
an invite outright is a feature this POC intends to ship, because right now
the store is built for it and the UI is not, which is the kind of mismatch
that is easy to miss until someone asks "how do I say no."

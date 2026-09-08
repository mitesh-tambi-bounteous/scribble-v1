---
project: scribl
updated: 2026-09-01
---

# Prototype

What the POC app actually is, screen by screen and flow by flow, with the real
capture of each screen next to the features on it and the API calls behind it.

The [screen and flow inventory](/design/screen-flow-inventory) answers "what
screens exist and which journey is each one in." It stops there on purpose:
per-screen feature extraction is listed as out of scope for that pass. This
section is that next pass. It takes the inventory's 9 flows and 27 screens as
given and adds, per screen, the three things a backlog needs and the inventory
does not carry: what a person can do on the screen, what data call sits behind
each of those things, and what the screen looks like today.

Nothing here generates backlog items. That is a later phase, and it will read
these pages rather than the app.

## How the section is laid out

| Group | One page per | Answers |
|-------|--------------|---------|
| Workflows | flow, F1 to F9 | which screens the journey touches, in order, and where it forks or dead-ends |
| Screens | route template | what you can do here, what it calls, what it looks like |

A screen sits in more than one flow often enough that flows link to screens and
not the reverse ownership. `/home` is in four flows, `/family` in four.

## Sources, and what is authored here

Everything factual on these pages traces to one of three places, and each page
cites which:

- **The app repo, hs2studio/scribl-app.** Route templates, features, guards and
  data calls, cited as `path:line` at a named commit. This is the only source
  for "what the screen does."
- **The screen and flow inventory.** Flow names, flow membership, the nine-flow
  structure. Do not re-derive flow membership on a screen page; cite the
  inventory and keep one answer in the repo.
- **The tile capture.** One PNG per screen from the app's own
  `npm run capture:board`, committed under `docs/public/assets/prototype/`. Each
  screen page names the capture run it used, because captures go stale and a
  screenshot with no run behind it is not evidence.

Judgement calls -- what counts as a feature, what a gap means for planning --
are authored here and marked as such.

## State of the section

Complete. [9 flow pages](/prototype/workflows/) and
[28 screen pages](/prototype/screens/), one per route template in the router.

Every code fact is cited `path:line` against scribl-app `c1b3c2d` on `main`.
Every screen has its real capture. What is not here: any backlog item. That is
the next phase, and it reads these pages rather than the app.

## What writing this turned up

The section was built to describe the app, not to audit it, but describing 28
screens honestly surfaced things worth acting on. They live in the "Notes for
planning" section of the page they belong to, and the sharpest ones are:

- **The invite flow has no way in from outside the app.** `/invite/[id]` is
  reachable only from `/home`, so "an invited person arrives from outside the
  app" is not true today. See
  [F3](/prototype/workflows/f3-invite-and-join).
- **Wall administration has no door on the wall.** The only entry to
  `/wall/[id]/members` is inside `/settings`. See
  [F7](/prototype/workflows/f7-wall-creation-and-administration).
- **The recorded onboarding path leaves the onboarding step list**, routing
  through `/record`, which resume cannot represent and no e2e spec walks. See
  [F2](/prototype/workflows/f2-first-run-onboarding).
- **The drawing toolset is narrower than anyone probably thinks**, hidden
  app-wide behind a flag that is off by default. See
  [`/draw`](/prototype/screens/draw).
- **Two documents in the app repo describe features inaccurately**, one
  overstating what exists and one understating it. Both are named on the pages
  that found them.
- **The inventory's own screenshot claims have gone stale.** Its "Capture shows
  the screen" column, and Findings 1 through 3, describe an older capture. Four
  onboarding screens, `/family`, `/compose` and `/response/[id]` all render
  their own interface now. Its gate checks that counts reconcile; it cannot
  check whether a claim about a screenshot is still true, and nothing flagged
  the drift. See
  [F2 First-run onboarding](/prototype/workflows/f2-first-run-onboarding).

These are recorded, not fixed. Fixing them is not what this section is for.

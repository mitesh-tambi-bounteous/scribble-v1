---
project: scribl
updated: 2026-09-01
---

# F9 Catch-all

An on-brand 404 offering a route back to today's prompt, instead of a
framework default or a dead end.

## Provenance

- **Features, routes and data calls** cited to hs2studio/scribl-app at
  `c1b3c2d` on `main`, clean tree.
- **Tile** from `npm run capture:board` at scribl-app `72c3ab8`, captured
  2026-08-31, committed here under `docs/public/assets/prototype/`. `72c3ab8`
  is not on `main`.
- **Flow name, number and membership** from the
  [screen and flow inventory](/design/screen-flow-inventory).

## The journey

One screen, one hop: `/+not-found` to `/`, via the "Back to Today" button
(`app/+not-found.tsx:28`, `router.replace("/")`). No diagram: a flowchart for
a two-node, one-edge hop adds a legend and a render step to read what this
one sentence already says.

## Screens in this flow

| Route | What it is for | Screen page |
|-------|----------------|-------------|
| `/+not-found` | Catch any unmatched route and offer a way back | [`/+not-found`](/prototype/screens/not-found) |

## Guards and forks

None. One screen, one button, one destination. There is nothing here that
branches, refuses, or bounces.

## What the capture shows

<div class="tile-strip">
<figure><a href="/assets/prototype/29-not-found.png"><img src="/assets/prototype/29-not-found.png" alt="Not found screen: a small ghost doodle icon, the heading This screen does not exist, a line about the page wandering off and getting back to today's prompt, and a Back to Today button"></a><figcaption><strong>1 /+not-found</strong>The whole screen: icon, heading, one line of copy, one button.</figcaption></figure>
</div>

The tile withholds nothing; there is no other state to show.

## Notes for planning

Authored here, not read out of the app.

### No journey aims here on purpose

The inventory says it outright: no journey deliberately routes to this
screen. It exists as insurance against a stale link, deep link, or bookmark
left behind by one of the other eight flows changing its routes, not as a
step anyone designs a journey around. Test it by breaking a route, not by
walking a flow.

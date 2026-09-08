---
project: scribl
updated: 2026-09-01
---

# /+not-found

Expo Router's catch-all for any unmatched route, restyled on-brand rather than
left as a framework default. It exists to give a stray link somewhere to go
rather than a dead end.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/+not-found` |
| Router file | `app/+not-found.tsx` |
| Flows | F9 Catch-all |
| Position in flow | not applicable; F9 has one screen and no journey routes here deliberately |
| Data calls | none |
| Shared surface | `Doodle` ghost icon |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/29-not-found.png"><img src="/assets/prototype/29-not-found.png" alt="Not found screen: a small ghost doodle icon, the heading This screen does not exist, a line about the page wandering off and getting back to today's prompt, and a Back to Today button"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

The tile shows the whole screen; there is nothing it withholds. Body copy at
the bottom of the tile is visually cut close to the button, but both lines of
text and the button are legible.

## Features

| Feature | Where it lives |
|---------|----------------|
| Route back to today's prompt | `app/+not-found.tsx:28` (`router.replace("/")`) |

That is the entire feature set. One heading, one line of copy, one button.

## Data calls

None. The screen renders static text and a themed icon; it reads nothing and
writes nothing.

## State in, state out

Nothing in, nothing out. `useThemeColors()` (`app/+not-found.tsx:11`) reads
the active theme to color the ghost icon; that is the only state touched, and
it is not specific to this screen.

## Components

| Component | Path |
|-----------|------|
| `Doodle` (`kind="ghost"`) | `components/art/Doodle.tsx`, used at `app/+not-found.tsx:19` |
| `Button`, `Text` | `components/ui/button.tsx`, `components/ui/text.tsx` |

## Notes for planning

Authored here, not read out of the app.

### No journey reaches this screen on purpose

The inventory says it outright: "No journey aims at it; it exists so a bad
link is not a dead end" (`product/design/screen-flow-inventory.md`). For
planning, that means this screen is not a gap to fill with a story about how
someone gets here. It is insurance against routes the other eight flows
change out from under a stale link, deep link, or bookmark. Test it by
breaking a route, not by walking a flow.

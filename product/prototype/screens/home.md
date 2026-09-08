---
project: scribl
updated: 2026-09-01
---

# /home

The hub screen. Four of the app's nine flows pass through it: F3 Invite and
join lands here after onboarding closes, F5 Wall browsing starts here, F7 Wall
creation reaches out from here, and F8 Account and profile reaches out from
here too. Nothing else in the app sits at that many crossings.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/home` |
| Router file | `app/home.tsx` |
| Flows | F3 Invite and join, F5 Wall browsing and composition, F7 Wall creation and administration, F8 Account and profile (see [screen-flow-inventory.md](/design/screen-flow-inventory)) |
| Position in flow | landing point for F3, entry point for F5/F7/F8 |
| Data calls | four reads on load: streak, walls, today's prompt, and stats. No writes. |
| Shared surface | `BottomNav`, also on every other tab-bar screen |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/12-home.png"><img src="/assets/prototype/12-home.png" alt="Home screen: Nice work, Rob, with a pink avatar; a stats card showing a 1 day streak, best is 1, 6 drawings made, 1/7 drawn this week, a seven-dot week strip with one checked, and three greyed milestone badges for 7-day, 30-day and 100-day; below it Your walls with a Personal Wall row and a Family Wall row, then a dashed Create new row; a floating bottom nav with home, a pink draw pencil, and a people icon"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This is a good capture: it shows the screen's real interface with real seeded
numbers, not an empty or guarded state. The three milestone badges are all
greyed (locked), consistent with a 1-day streak against 7/30/100-day
thresholds.

## Features

| Feature | Where it lives |
|---------|-----------------|
| Greet the signed-in person by display name | `app/home.tsx:249-256`, `currentUser?.displayName` at `:158` |
| Open a pending invite's walkthrough, from a "Your walls" row badged "New invite" | `app/home.tsx:204-206`, navigates to `/invite/[id]` |
| Open a joined wall | `app/home.tsx:208`, navigates to `/family` with `channelId` and `promptId` params |
| Start a new wall | `app/home.tsx:413-416`, navigates to `/create-wall` |
| Open account settings, via the bottom nav "You" icon | `app/home.tsx:433`, navigates to `/settings` |
| Jump to today's prompt, via the bottom nav center draw button | `app/home.tsx:432`, navigates to `/` |
| Retry all four loads after a failure | `app/home.tsx:151-156`, wired to the "Try again" button at `:226-228` |

That is every navigation exit this screen offers: `/invite/[id]` (F3), `/family`
(F5), `/create-wall` (F7), `/settings` (F8), and `/` (F4, the daily loop's own
entry). `/settings` is itself the door to `/wall/[id]/members`
(`screen-flow-inventory.md`, F7 section), so wall administration is reachable
from Home only by a two-hop detour through Settings.

## Data calls

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `getStreak()` | `GET /me/stats` | `me-stats.ts` |
| `getMyStats()` | `GET /me/stats` | `me-stats.ts` |
| `listWalls(userId)` | `GET /walls` | `walls-list.ts` |
| `getTodayPrompt()` | `GET /prompt/today` | not walked here; see [onboarding-canvas](/prototype/screens/onboarding-canvas) |

Handler paths are relative to `backend/lambda/handlers/`.

All four numbers on the stats card are real, server-computed values, not
hardcoded. `getStreak()` and `getMyStats()` both call the same endpoint,
`GET /me/stats` (`src/data/http.ts:149-154`, `:313-315`): `getStreak()`'s own
comment says "No dedicated /streak route exists server-side; derive the
current streak from the server's own computeStreaks() output via /me/stats"
(`src/data/http.ts:150-151`). The handler computes `drawingsCount`,
`weeklyCompletion`, `currentStreak`, `bestStreak` and `badges` from the
caller's real submission history (`backend/lambda/handlers/me-stats.ts:37-51`),
delegating the streak and badge math to
`backend/lambda/data/stats.ts` (`computeStreaks`, `computeWeeklyCompletion`,
`computeBadges`).

One write call exists in the same store and is a no-op against the backend:
`recordSubmission()` is documented as doing nothing because "submit() already
records the submission server-side" (`src/data/http.ts:156-160`), and this
screen never calls it (`useStreakStore.ts` marks `recordSubmission` as "not
called from any screen in this slice", `src/stores/useStreakStore.ts:18`).

The screen itself never calls `dataClient` directly; it reads four stores --
`useStreakStore`, `useWallsStore`, `usePromptStore`, `useStatsStore`
(`app/home.tsx:24-29`) -- each of which owns its own `load()` against
`dataClient`.

## State in, state out

**Reads on entry.** `streakCurrent`/`streakError` from `useStreakStore`,
`walls`/`wallsError` from `useWallsStore`, `promptData` from `usePromptStore`,
and `drawingsCount`/`weeklyCompletion`/`bestStreak`/`badges` from
`useStatsStore` (`app/home.tsx:127-144`). `currentUser` from `useAuthStore`
(`app/home.tsx:157`). Pending invites from `useInvitesStore`, filtered by the
current user's email (`app/home.tsx:163-164`).

**Writes on mount.** None to the API. `loadStreak`, `loadPrompt` and
`loadStats` fire once on mount (`app/home.tsx:167-169`, `:183-189`).
`loadWalls` and `loadInvites` fire on every focus, not just mount
(`app/home.tsx:176-181`), with the comment explaining why: Home is the screen a
person returns to after creating a wall, accepting an invite, or leaving one,
and a mount-only fetch would show a stale list.

**Writes on exit.** None. The screen only routes; state for the destination
screen travels as route params (`channelId`, `promptId` at `:208`).

## Components

| Component | Path |
|-----------|------|
| `Avatar` | `components/ui/avatar.tsx`, used at `app/home.tsx:258-264` |
| `BottomNav` | `components/nav/BottomNav.tsx`, used at `app/home.tsx:429-435` |
| `Button` | `components/ui/button.tsx`, the retry action |
| `Icon` | `components/ui/icon.tsx` |

`BottomNav` renders on every tab-bar screen and takes generic `onHome`/`onDraw`/
`onYou` callbacks (`components/nav/BottomNav.tsx:8-13`), so this screen's own
`onHome` is a no-op (`app/home.tsx:431`) because pressing Home while already on
Home does nothing.

## Notes for planning

Authored here, not read out of the app.

### The stats are real, which raises the bar for the empty-history case

All four stat numbers come from `GET /me/stats`, computed from the caller's
actual submission history (`backend/lambda/handlers/me-stats.ts:37-44`). That
is a stronger foundation than a placeholder would be, but it means a
brand-new user's first visit renders a 0-day streak, 0 drawings, and three
locked badges rather than an onboarding-flavored empty state. Worth deciding
whether that is the intended first impression before this ships past a POC.

### Two client methods, one endpoint, one dead write

`getStreak()` and `getMyStats()` both round-trip to `GET /me/stats`
(`src/data/http.ts:149-154`, `:313-315`), so Home fires the same request
twice on every load through two separate stores. `recordSubmission()` exists
on the streak store, is wired to nothing, and its own client method is coded
as a permanent no-op (`src/data/http.ts:156-160`). Neither is broken, but both
are the kind of leftover seam that should either get collapsed into one store
or get a comment explaining why it stays split.

### Wall administration has no door on Home itself

Reaching `/wall/[id]/members` from Home takes two hops: Home to Settings, then
Settings to Members (`screen-flow-inventory.md`, F7 section). The inventory
already flags this as a planning question for F7; it is worth restating here
because Home is where a person would naturally look for it first.

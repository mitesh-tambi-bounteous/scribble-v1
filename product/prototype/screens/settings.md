---
project: scribl
updated: 2026-09-01
---

# /settings

Account and profile management: change display name, email, avatar, theme, and
wall roster access, then sign out. It is the hub screen for F8 and also the only
door into F7's wall-membership screen.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/settings` |
| Router file | `app/settings.tsx` |
| Flows | F8 Account and profile |
| Position in flow | the hub of F8, reached from `/home` and returned to from `/avatar` |
| Data calls | one write, `updateProfile` (name and email); one read, wall list for the roster links |
| Shared surface | none captured; `DarkModeToggle` is settings-only |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/28-settings.png"><img src="/assets/prototype/28-settings.png" alt="Settings screen: back chevron and SETTINGS header, a pink circular avatar with the letter R, a 'Change avatar' pill button, then three grey fields labelled Display Name (Rob), Email (rob.demo@scribl.co) and Password (dots, with the caption Not wired up in this POC), a Dark mode row with an off toggle, a pink Save button, a Your walls heading with two rows, Personal Wall and Family Wall, each ending in a chevron, and a Log out row at the bottom"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This tile shows the real screen, not a guard or empty state. Note `72c3ab8` is
not on `main`; it is the unmerged flow-map branch. On `main` this route is not
draft-guarded, so the capture is expected to match regardless of branch. Two
walls appear because the seeded account belongs to two; a fresh account would
show an empty "Your walls" list with no visible affordance to create one from
here (creation lives at `/create-wall`, reached from `/home`).

## Features

| Feature | Where it lives |
|---------|----------------|
| Change display name | `app/settings.tsx:92-99`, saved via `handleSave` at `:43-52` |
| Change email | `app/settings.tsx:106-115`, saved via `handleSave` at `:43-52` |
| Change password field, visibly present, explicitly inert | `app/settings.tsx:118-134`, caption "Not wired up in this POC." at `:131-133` |
| Change avatar, hands off to the shared drawing canvas | `app/settings.tsx:76-85`, navigates to `/avatar` at `:80` |
| Toggle dark mode | `components/settings/DarkModeToggle.tsx:22-63`, mounted at `app/settings.tsx:136` |
| Browse "Your walls" and open a wall's member roster | `app/settings.tsx:157-174`, navigates to `/wall/[id]/members` at `:163-165` |
| Log out | `app/settings.tsx:180-192`, handler at `:54-59` |

The password field is the odd one: it renders exactly like the other two
inputs, takes keystrokes into local state (`app/settings.tsx:32, 122-129`), and
is never read by `handleSave` (`:43-52` sends only `displayName` and `email`).
A person can type a new password here and it goes nowhere. The screen's own
comment admits this in the UI text, which is the right call for a POC, but it
means the field is a plausible false affordance if anyone forgets the caption
is load-bearing.

The wall-roster link deserves its own line. `/wall/[id]/members` is F7's
screen, wall creation and administration, and this is its only entry point in
the app; `app/family.tsx:1107-1111` used to carry an add-member call site and
that was deliberately removed, per the screen and flow inventory
(`product/design/screen-flow-inventory.md`). Settings is not just a launcher for `/avatar` inside F8, it is also the sole
door into an F7 screen. See Notes for planning.

## Data calls

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `updateProfile({ displayName, email })` -> `dataClient.updateUser(id, patch)` | `PATCH /users/{id}` | `backend/lambda/handlers/user-update.ts` |

`updateProfile` is `src/stores/useAuthStore.ts:142-160`, calling
`dataClient.updateUser` at `src/data/http.ts:272-283`. The handler accepts
`displayName`, `email`, `avatarColor` or `avatarImage`, any one of which
satisfies the request (`backend/lambda/handlers/user-update.ts:21-30, 64-69`),
and self-only gates the write: the caller may update only their own record,
checked server-side from `x-user-id`, never a client-supplied id
(`backend/lambda/handlers/user-update.ts:54-62`). This screen only ever sends
`displayName` and `email` (`app/settings.tsx:46-49`); the avatar fields the
same handler accepts are written from `/avatar`, not from here.

**Dark mode does not persist to the server.** `setMode` writes straight to
AsyncStorage under a per-user key and updates `useThemeStore` in memory
(`src/stores/useThemeStore.ts:113-124`); there is no API call in the toggle's
path at all (`components/settings/DarkModeToggle.tsx:22-30`). This is
consistent with the store's own doc comment, which frames a device-wide write
as the bug it is guarding against, not an oversight. It is still a setting
that looks identical in weight to name and email on this screen, one of which
round-trips to the server and one of which does not, with no visual cue that
distinguishes them.

**The password field does not persist anywhere**, server or local. Nothing
reads `password` state (`app/settings.tsx:32`) after it is set. It is inert by
design and the caption says so.

**Walls list is a read, not a setting.** `loadWalls` fires on mount when the
store is empty (`app/settings.tsx:37-41`), calling
`dataClient.listWalls(userId)` (`src/stores/useWallsStore.ts:61-69`) against
`GET /walls`. It populates the roster links; it is not something a person
changes on this screen.

## State in, state out

**Reads on entry.** `currentUser` from `useAuthStore`, seeding `displayName`
and `email` local state (`app/settings.tsx:24, 30-31`). `walls` from
`useWallsStore` (`app/settings.tsx:28`).

**Writes on mount.** Wall list load if the store is empty
(`app/settings.tsx:37-41`); no onboarding-step or draft writes on this screen.

**Writes on exit.** None from navigating away. `handleSave` writes
`displayName`/`email` to the server and to `useAuthStore.currentUser`
(`app/settings.tsx:43-52`, `src/stores/useAuthStore.ts:150-153`) only when a
person presses Save; there is no autosave and no write-on-blur. `handleLogout`
clears the active user and replaces to `/sign-up` (`app/settings.tsx:54-59`).

## Components

| Component | Path |
|-----------|------|
| `ScreenHeader` | `components/nav/ScreenHeader.tsx`, imported at `app/settings.tsx:8` |
| `Avatar` | `components/ui/avatar.tsx`, imported at `app/settings.tsx:6` |
| `DarkModeToggle` | `components/settings/DarkModeToggle.tsx`, mounted at `app/settings.tsx:136` |
| `Button` | `components/ui/button.tsx`, imported at `app/settings.tsx:10` |
| `Icon` | `components/ui/icon.tsx`, imported at `app/settings.tsx:11` |

## Notes for planning

Authored here, not read out of the app.

### Wall administration's only door lives inside account settings

`/wall/[id]/members` belongs to F7, wall creation and administration, per the
screen and flow inventory (`product/design/screen-flow-inventory.md`), but
`app/settings.tsx:163-165` is the sole call site left after the add-member
entry point was removed from `/family`. That means a feature-planning session
organized around "wall administration" will point at a screen owned by
"account and profile" to find its own entry door. This is worth raising
explicitly rather than fixing quietly: either F7 gets a door on the wall
itself, or the inventory should note that F7's real home is F8 for now. Leaving
it as an unstated accident is the wrong outcome either way.

### Two settings that look the same and behave differently

Display name and email round-trip through `PATCH /users/{id}` and persist for
every device the account signs into. Dark mode never leaves the device: it is
an AsyncStorage write with no server call. Both live in identically styled
rows on the same screen, gated behind the same visual weight, with nothing to
tell a person (or a future engineer) that one is durable account state and the
other is a local preference. Not urgent for a POC, but worth a decision before
production: either theme becomes a real account field, or the UI should stop
implying parity with the fields above it.

### A visibly present setting that does nothing

The password field takes input, shows a caption admitting it is not wired up,
and is otherwise indistinguishable from the two fields above it that do
persist. The caption is honest, but a caption is not a guard; nothing disables
the field or the keyboard focus. Fine for an internal POC review, wrong to
ship as-is.

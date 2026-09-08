---
project: scribl
updated: 2026-09-01
---

# /create-wall

A form for starting a new wall: name it, optionally invite people by email,
submit. It sits in F7 Wall creation and administration, reached only from
`/home` and returning there on success.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/create-wall` |
| Router file | `app/create-wall.tsx` |
| Flows | F7 Wall creation and administration |
| Position in flow | entry point, `/home` -> `/create-wall` -> `/home` |
| Data calls | one write, `createWall`, plus an optional follow-up `inviteMember` per address |
| Shared surface | `ScreenHeader`, used across most authenticated screens |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/26-create-wall.png"><img src="/assets/prototype/26-create-wall.png" alt="Create a wall: a Wall name field with placeholder 'Wall name (e.g. Book club)', an Invite by email field with placeholder 'friend@example.com' and a comma/semicolon/space hint, and a pink Create wall button pinned to the bottom, both fields and the button empty"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

The tile shows the real screen in its empty state, both fields blank and the
submit button enabled-looking but actually disabled (`app/create-wall.tsx:169`
requires a non-empty trimmed name). No error state, no filled form, and no
sign of the invite-parsing feedback the code supports are visible here.

## Features

| Feature | Where it lives |
|---------|----------------|
| Name the wall | `app/create-wall.tsx:39`, `126-133` |
| Invite one or more people by email, comma/semicolon/space separated | `app/create-wall.tsx:40`, `140-153`, parsed at `src/lib/emails.ts` |
| Submit, creating the wall and returning to `/home` | `app/create-wall.tsx:44-105`, `167-173` |
| See a parse/send failure per invalid or failed address | `app/create-wall.tsx:89-98`, rendered `162-166` |
| Recover from a stale session by being signed out and sent to `/sign-up` | `app/create-wall.tsx:55-63` |

The kind of wall created is not a choice on this screen. `app/create-wall.tsx:52`
hardcodes `kind: "group"`, with a comment noting it is "the only wall kind the
client creates now that challenges are gone."

## Data calls

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `createWall(input)` | `POST /walls` | `backend/lambda/handlers/walls-create.ts` |
| `inviteMember(wallId, email)` | `POST /channels/:id/members` | `backend/lambda/handlers/member-add.ts` |

Both client methods live in `src/data/http.ts:293-303` and `:317-331`. The
screen never calls `dataClient` for the create step directly; it goes through
`useWallsStore.createWall` (`app/create-wall.tsx:35`, `48-54`, store at
`src/stores/useWallsStore.ts:76-92`), which calls `dataClient.createWall` and
then reloads the wall list. This is a real server write: the created wall is
not local-only, and its id (`useWallsStore.getState().lastCreatedWall`,
`app/create-wall.tsx:65`) is a genuine server id used for the follow-up
invite call.

If an invite address was entered, the screen calls `dataClient.inviteMember`
directly, once per parsed address (`app/create-wall.tsx:70-77`), then records
each accepted invite locally via `useInvitesStore.recordInvite`
(`:78-84`). The invite itself is simulated -- no email goes out -- per the
screen's own doc comment (`app/create-wall.tsx:24-28`), which points at
`src/lib/simulatedInvites.ts` for why.

## State in, state out

**Reads on entry.** Nothing; the form starts blank, no route params, no
draft store read.

**Writes on mount.** None.

**Writes on exit.** On success: a new wall row on the server
(`POST /walls`) and, per valid invite address, a member-invite row on the
server plus a local pending-invite record. On failure with a stale session:
signs the local user out (`app/create-wall.tsx:59`) and replaces to
`/sign-up`.

## Components

| Component | Path |
|-----------|------|
| `ScreenHeader` | `components/nav/ScreenHeader.tsx`, imported at `app/create-wall.tsx:6` |
| `Button` | `components/ui/button.tsx`, imported at `app/create-wall.tsx:7` |

`ScreenHeader` is the shared top bar used by every screen in this set and by
`/settings`, `/wall/[id]/members`, and the two prompt-pack screens; a change
to it lands on all four pages in this pass plus F8.

## Notes for planning

Authored here, not read out of the app.

### The wall is real, the invite is theater

`createWall` is a genuine server write with a real id. `inviteMember` looks
identical from the UI but sends no email; it only writes a local pending-row
so the same device can show "invited" on a future sign-in
(`src/lib/simulatedInvites.ts`). Anyone demoing this screen to a client should
know the invite step proves the UI, not the delivery mechanism.

### There is no wall-kind choice, and the comment says why

`kind: "group"` is hardcoded with a comment blaming a removed "challenges"
concept (`app/create-wall.tsx:50-52`). That is a deliberate simplification,
not a gap, but it means the form has an invisible field: nothing here
suggests to a planner that wall kind was ever a decision point.

### The only door to this screen is `/home`

The inventory's F7 route is `/home` -> `/create-wall` -> `/home`. There is no
"create a wall" affordance from `/family` or from `/wall/[id]/members`;
starting a new wall and managing an existing one are two screens that never
link to each other directly.

---
project: scribl
updated: 2026-09-01
---

# /wall/[id]/members

The roster for one wall: every member's name and email, an invite-by-email
box, a per-member remove control, and leave/delete for the wall itself. It is
F7's only administration screen, and its one entry point sits inside F8.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/wall/[id]/members` |
| Router file | `app/wall/[id]/members.tsx` |
| Flows | F7 Wall creation and administration |
| Position in flow | `/settings` -> `/wall/[id]/members`, a dead end back to `/settings` or `/family` |
| Data calls | one read (`getChannelRoster`), three writes (`inviteMember`, `removeMember`, `leaveWall`/`deleteWall`) |
| Shared surface | `ScreenHeader`, `Avatar` |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/23-wall-members.png"><img src="/assets/prototype/23-wall-members.png" alt="Members screen listing three rows, Alice with a Remove link, Rob with no Remove link, Sam with a Remove link, each with an avatar, name and email, below them an Add member card with a comma-separated email placeholder and a pink plus Add member button, then a Delete wall row with a trash icon and a Leave wall row with an exit icon"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

This is a real, populated capture, not an empty state: three members, and the
capture's viewer is clearly the wall's creator, since Rob's own row has no
Remove link (you cannot remove yourself this way) while Alice's and Sam's do,
and both the invite card and the delete-wall row render. A non-creator's view
of this same screen -- no invite card, no Remove links, no delete row -- has
no tile in this set.

## Features

Gating differs by action, not by screen. Anyone in the wall can open this
screen and see the roster; only the creator gets the write controls inside
it.

| Feature | Where it lives | Who can use it |
|---------|----------------|----------------|
| View the member roster (name, email, avatar) | `app/wall/[id]/members.tsx:64-89`, rendered `304-340` | any member |
| Invite by email, one or more addresses at once | `app/wall/[id]/members.tsx:100-176`, gated `:58` | creator only |
| Remove a member | `app/wall/[id]/members.tsx:243-258`, gated per-row `:306-307` | creator only |
| Delete the wall, behind a two-step confirm | `app/wall/[id]/members.tsx:224-241`, gated `:62` | creator only, and never on the archive wall |
| Leave the wall | `app/wall/[id]/members.tsx:193-215` | any member, blocked if sole owner |

The per-action gating is explicit in the code, not inferred: `canInvite`
(`:58`) and `canDelete` (`:62`) both derive from `isCreator` (`:57`), and the
per-row `canRemove` (`:306-307`) repeats the same `currentUserId === createdBy`
check rather than reusing `isCreator`. Three checks doing the same
comparison in one file is a small duplication worth collapsing, not a bug.

Leaving guards against orphaning the wall: a sole-owner creator with no other
members is blocked client-side with an explanatory message rather than being
allowed to leave a now-inaccessible wall (`app/wall/[id]/members.tsx:199-206`).
Deleting is permanently blocked on the personal archive wall, since the
server refuses that delete with a 400 (`app/wall/[id]/members.tsx:60-61`).

## Data calls

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `getChannelRoster(channelId)` | `GET /channels/:id/roster` | `channel-roster.ts` |
| `inviteMember(channelId, email)` | `POST /channels/:id/members` | `member-add.ts` |
| `removeMember(channelId, userId)` | `DELETE /channels/:id/members` | `member-remove.ts` |
| `leaveWall(channelId)` | `DELETE /channels/:id/members` | `member-remove.ts` |
| `deleteWall(channelId)` | `DELETE /channels/:id` | `wall-delete.ts` |

Handler paths are relative to `backend/lambda/handlers/`.

All five methods are on `src/data/http.ts` (`getChannelRoster:373-378`,
`inviteMember:317-331`, `removeMember:388-409`, `leaveWall:333-351`,
`deleteWall:353-371`). The screen calls all of them directly off `dataClient`,
not through a store, except that a successful leave or delete also calls
`useWallsStore.load()` (`:184`, `:237`) so `/home`'s list drops the wall.
`leaveWall` and `removeMember` share one backend route distinguished by
whether `userId` is a query param naming someone else (`app/wall/[id]/members.tsx:252`,
`183`) or the caller's own session identity.

The invite here is the same simulated mechanism as `/create-wall`: the
server accepts the address and a local pending record is written via
`useInvitesStore.recordInvite`, but no email is sent
(`app/wall/[id]/members.tsx:28-32`, `140-150`).

## State in, state out

**Reads on entry.** The route's `id` and `from` params
(`app/wall/[id]/members.tsx:35`); `from === "wall"` changes where the back
arrow goes. Then the roster, loaded in an effect keyed on `channelId`
(`:91-98`).

**Writes on mount.** None beyond the roster fetch.

**Writes on exit.** None automatic. A remove, invite, leave or delete is a
direct user action, not something the screen does on unmount.

## Components

| Component | Path |
|-----------|------|
| `ScreenHeader` | `components/nav/ScreenHeader.tsx`, imported at `app/wall/[id]/members.tsx:9` |
| `Avatar` | `components/ui/avatar.tsx`, imported at `app/wall/[id]/members.tsx:10`, one per member row |
| `Icon` (`LogOut`, `Trash2`) | `components/ui/icon.tsx`, imported at `app/wall/[id]/members.tsx:8` |

None of these are unique to this screen; `ScreenHeader` and `Avatar` both
recur across F7 and F8.

## Notes for planning

Authored here, not read out of the app.

### Wall administration has no door on the wall itself

The only way in is `/settings` -> "Your walls" -> a wall row
(`app/settings.tsx:164`). `/family`, the screen a person actually uses to
look at a wall, had its own entry point deliberately removed
(`app/family.tsx:1107-1111`, comment: "It's still reachable from Settings").
That is a real product gap, not a nit: managing who is in a wall lives
entirely inside the account-settings flow (F8), one hop removed from the wall
it administers. A person who wants to remove someone has to leave the
context they are looking at.

### Creator-gating is per-action, and the members screen is the permissive one

This screen opens for any member; the prompt-packs entry point
(`app/family.tsx:1092`) is gated before the screen even renders, so a
non-creator never reaches `/wall/[id]/prompt-packs` at all. Flatten these two
gating strategies together in a spec and you get the wrong answer for one of
them.

### Three separate creator checks, one intent

`canInvite`, `canDelete`, and the inline `canRemove` per row all recompute
"is this user the creator" independently (`:58`, `:62`, `:306-307`) rather
than branching on `isCreator` (`:57`) once. Harmless today at this file's
size, but it is the kind of duplication that drifts the next time one check
changes and the other two do not.

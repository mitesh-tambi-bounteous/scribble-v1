---
project: scribl
updated: 2026-09-01
---

# /sign-up

One screen carrying three jobs: create an account, log into an existing one,
and switch to any already-known account on the device. It is where F1 decides
whether a person goes to onboarding or straight to today's prompt.

## At a glance

| Property | Value |
|----------|-------|
| Route | `/sign-up` |
| Router file | `app/sign-up.tsx` |
| Flows | F1 Launch and authentication |
| Position in flow | the identity gate between a cold start and either `/` or `/splash` |
| Data calls | `signUp`, `login`, `listUsers`; switching does not call the API |
| Shared surface | none unique to this screen; uses standard `Button`, `Text`, `Icon` |

Cited to hs2studio/scribl-app at `c1b3c2d` on `main`, clean tree.

## The capture

<figure class="tile-single"><a href="/assets/prototype/09-sign-up.png"><img src="/assets/prototype/09-sign-up.png" alt="Sign-up screen: the scribl S mark and wordmark, the line One prompt, One drawing, Every day, a Sign up and Log in toggle with Log in selected, an email field, a name field, a note about checking both email and name, an Always show new-user onboarding toggle set off, and a Log in button"></a><figcaption>Open the tile. From <code>npm run capture:board</code> at scribl-app <code>72c3ab8</code>, captured 2026-08-31.</figcaption></figure>

The tile is in log-in mode, with the demo-only `NewUserToggle` visible and off.
It does not show the sign-up mode's form (same fields, different toggle
state), the error state, or the existing-user picker, which only renders in
sign-up mode once `listUsers()` returns at least one account
(`app/sign-up.tsx:265`). The inventory's Finding 4 notes a second, logged-out
capture of this route is byte-identical to this one, so that variant adds
nothing either.

## Features

| Feature | Where it lives |
|---------|----------------|
| Sign up: create an account by email and display name | `app/sign-up.tsx:102-108`, calling `signUp` |
| Log in: match an existing account by both email and name | `app/sign-up.tsx:110-116`, calling `login` |
| Switch to an existing account on this device, no credentials | `app/sign-up.tsx:118-121`, `:265-305`, calling `switchUser` |
| Toggle between sign-up and log-in modes | `app/sign-up.tsx:69-74`, `:167-189` |
| Offer to switch to sign-up after a failed log-in | `app/sign-up.tsx:226-232` |
| Force full new-user onboarding on every sign-in, a demo switch | `components/demo/NewUserToggle.tsx`, rendered at `app/sign-up.tsx:242` |

Log-in requires both fields to match the stored user, case-insensitive and
trimmed; a miss on either is reported as "No account matches that email and
name" (`app/sign-up.tsx:41-43`, error text set in
`src/stores/useAuthStore.ts:111-112`). The existing-user picker is local only:
`switchUser` never touches the network (`src/stores/useAuthStore.ts:130-134`).

## Data calls

| Client method | Endpoint | Handler |
|---------------|----------|---------|
| `signUp(email, displayName)` | `POST /auth/signup` | `backend/lambda/handlers/auth-signup.ts` |
| `login(email, displayName)` | `POST /auth/login` | `backend/lambda/handlers/auth-login.ts` |
| `listUsers()` | `GET /users` | `backend/lambda/handlers/users-list.ts` |

`signUp` and `login` are `src/data/http.ts:247-255` and `:257-265`; `listUsers`
is `:267-269`. The screen never calls `httpDataClient` directly; it goes
through `useAuthStore`'s `signUp`, `login`, `listUsers`, `switchUser`
(`app/sign-up.tsx:49`). `listUsers()` fires on mount to populate the picker
(`app/sign-up.tsx:59-67`). Switching an existing user (`switchUser`,
`src/stores/useAuthStore.ts:130-134`) makes no call at all; it only sets the
active-user seam and persists the chosen user locally.

`auth-signup.ts` is idempotent on email and provisions the new user's Personal
Archive channel (`backend/lambda/handlers/auth-signup.ts:1-3`).
`auth-login.ts` 404s as `user_not_found` on a miss on either field
(`backend/lambda/handlers/auth-login.ts:1-6`), which the client surfaces via
`UserNotFoundError` (`src/data/http.ts:93-94`).

## State in, state out

**Reads on entry.** `useAuthStore`'s `signUp`, `login`, `listUsers`,
`switchUser`, `loading`, `error` (`app/sign-up.tsx:49`); the account list is
fetched into local component state (`app/sign-up.tsx:53`, `:59-67`).

**Writes on exit, all three paths.** Every successful path (`handleCreate`,
`handleLogin`, `handleSwitch`) writes the same three things: the active-user
seam via `setActiveUser` inside the store method, the persisted current user
in `AsyncStorage`, and `currentUser` in `useAuthStore`
(`src/stores/useAuthStore.ts:89-100`, `:102-118`, `:130-134`). Then all three
call `routePostAuth()` (`app/sign-up.tsx:95-100`), which runs
`checkOnboarded()` and routes via `postAuthRoute(hasOnboarded)`
(`src/lib/postAuthRoute.ts:20-22`): `/` if truly onboarded, `/splash`
otherwise, `null` treated as `false` on purpose
(`src/lib/postAuthRoute.ts:16-18`). This is the helper the spec calls out, and
it is deliberately pure: no storage read of its own, just the branch
(`src/lib/postAuthRoute.ts:9-14`).

**Writes on mode switch.** Switching between sign-up and log-in clears any
stale auth error (`app/sign-up.tsx:69-74`).

## Components

| Component | Path |
|-----------|------|
| `NewUserToggle`, the demo onboarding-force switch | `components/demo/NewUserToggle.tsx` |
| `Icon`, `Button`, `Text` | `components/ui/icon.tsx`, `components/ui/button.tsx`, `components/ui/text.tsx` |

`NewUserToggle` is unique to this screen among the four in this pass; it
reads and writes `useOnboardingStore`'s device-wide `forceNewUser` override
directly (`components/demo/NewUserToggle.tsx:19-21`, `:29-35`), ahead of the
per-user flag `checkOnboarded()` would otherwise read
(`src/stores/useOnboardingStore.ts:150-156`).

## Notes for planning

Authored here, not read out of the app.

### Three features, one screen, no visual separation

Sign-up, log-in and account-switching are three different trust models
(create identity, verify identity, no verification at all) presented as one
form with a scrollable list tacked underneath. The switcher only appears in
sign-up mode, which is a strange pairing: the mode for creating a new
identity is also the only mode that shows you every other identity already on
the device. That is worth a second look before this becomes a real
onboarding gate rather than a POC convenience.

### The onboarding-check error is silent to everyone but the person mid-signup

`checkOnboarded()` can fail after auth already succeeded, and the screen
surfaces that failure as `onboardingError` text (`app/sign-up.tsx:57`,
`:236-240`). But `postAuthRoute` runs anyway on whatever `hasOnboarded` value
comes back, defaulting to the safe `/splash` path
(`src/lib/postAuthRoute.ts:16-18`). So the error is informational only; it
never blocks the route. That is a reasonable POC choice and it is not stated
as a decision anywhere outside the comment at `app/sign-up.tsx:80-93`.

### The demo toggle sits permanently in a production-shaped screen

`NewUserToggle` is a device-wide debug switch living on the same screen every
real user would see (`app/sign-up.tsx:242`). Fine for a client-facing POC
where the point is showing both new- and returning-user paths on demand; it
would need a build-time flag before this screen is anything but a demo
artifact.

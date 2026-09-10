# scribl API contract, v3 draft (E01-F5)

Status: revised after Pankaj Aggarwal's mobile-gap review on PR #2
(2026-09-03). Reconciled directly against the shipping product in
[`ScriblOrg/scribl-mobile-app`](https://github.com/ScriblOrg/scribl-mobile-app):
`packages/contracts` (the Zod source of truth), `@scribl/mock-server`
(what mobile actually talks to on `:4000` today), and
`apps/mobile/src/data/`. Where this draft previously cited the handbook or
the old Bitbucket POC and disagreed with that package, the package wins.
See **Sources** at the bottom.

## Changelog (newest first)

- **2026-09-03 (v3.4, third review round):** Fixed the last four
  `u_9f2b3a1c`-style media-key examples (presign response, `POST /audio`
  `audioRef`, `POST /artifacts` `renderKey`, `PUT /me/avatar`
  `avatarKey`) left over from the v3.3 ID sweep -- they're now real
  UUID-shaped ids, matching the `art/{userId}/{submissionId}/v{n}/...`
  namespacing rule and the mock's owner-scope regex.
- **2026-09-03 (v3.3, second review round):** Added `POST /auth/challenge`
  (sign-in-time challenge answer, distinct from sign-up's
  `confirm-email`) -- a real, already-called route that was missing.
  **Reverted two v3.2 decisions** after the architect pointed out they'd
  break the shipping app: `expiresAt` is back on `GET /invites/{token}`'s
  response (the field is still required in `packages/contracts` today;
  removing it now, not later, would break the current client), and the
  authenticated empty-body redeem branch is now explicitly a future idea,
  not a current requirement (`InviteRedeemScreen` always sends the full
  body today). Fixed the `POST /submissions` example: omits optional
  fields instead of sending `null`, uses real UUIDs instead of leftover
  slug-style ids, and adds a separate minimal redraw example. Fixed a
  flag-count off-by-one (13 keys, not 12).
- **2026-09-03 (v3.2, closing two open questions):** Dropped `expiresAt`
  from `GET /invites/{token}`'s response entirely -- invites don't expire
  in practice, so there was nothing meaningful to report. Added the
  authenticated branch of `POST /invites/{token}/redeem` as a proposed
  dedicated (empty-body) schema, distinct from the unauthenticated
  new-account body -- see that section below. Both were left as open
  questions in v3; both are decided now.
- **2026-09-03 (v3, architect review reconciliation):** Rewritten section by
  section against `packages/contracts` after Pankaj's PR #2 review found the
  v2 draft drifted from the shipping app in ways that aren't just naming
  (report/block, email verification, `GET /me`, avatars, wall tiles, invite
  minting, redraw, artifacts were all missing). Highlights: error envelope
  and every error code replaced with the real `ErrorCode` union; auth
  rewritten around discriminated sign-in/sign-up results and email
  verification; invites gain a token-minting endpoint and drop the
  email-collecting one; consent kinds split `crash_diagnostics` from
  `log_shipping`; `GET /prompts/today` is now the single unanswered/submitted
  union; media presign gains `avatar`/`artifact_render`/`cutout`; submissions
  carry a body-level idempotency key and an explicit `replacesSubmissionId`
  redraw path, and drop the caption-only `PATCH`; **compositions renamed to
  artifacts**, a distinct entity with no `promptId` and no submit-to-unlock
  interaction; the wall feed becomes `GET /channels/{id}/wall` returning
  `visible`/`locked`/`empty` tiles; reactions become a single per-submission
  `PUT`, self-reaction allowed, per-wall isolation dropped; comments, the
  user directory, and a second roster endpoint move to "not needed"; users
  gain avatars; dashboard and streak stats merge into one `GET /me/stats`;
  flags gain the six missing keys and the real `{version, values}` envelope;
  account delete/export reworked; **report and block are reinstated** as
  their own section (Apple 1.2 / Play UGC, previously and wrongly cut); a
  diagnostics-log-shipping endpoint is added. Wire format is camelCase
  throughout, not snake_case.
- **2026-09-03 (v2):** `GET /me/stats` added (streaks, weekly completion,
  milestone badges) -- superseded by the v3 merge with dashboard stats below.
- **2026-09-02 (3rd pass):** POC-derived pass -- superseded throughout by v3.
- **2026-09-02 (2nd pass):** submission edits removed entirely, reactions
  rescoped per wall, report/block moved to out-of-scope -- **all three
  reversed in v3**: redraw is back (as an explicit replace), reactions are
  not wall-scoped, report/block are back in scope and required.
- **2026-08-27:** `DELETE /account` soft-delete framing -- superseded by v3's
  `DELETE /me` (soft delete + a same-transaction hard-purge job).

## What changed from v2, and why

| v2 said | v3 says | Because |
|---|---|---|
| `{ error, message, correlation_id }`, ad hoc codes | `{ code, message, correlationId }`, the 11-code `ErrorCode` union | `packages/contracts/src/api/errors.ts` is what the app parses |
| `POST /auth/signup` returns tokens for everyone | Discriminated union: `verification_required` or `parental_consent_required`; a minor never gets an account | `api/auth.ts`, COPPA Option A |
| No `GET /me` | `GET /me` -> `{ user, capabilities }` | The Cognito adapter loads this after every token |
| `POST /compositions`, folded into `submissions.kind` | `POST /artifacts` / `GET /artifacts/{id}`, its own entity | `entities/artifact.ts`: an artifact has no prompt day and is never replaced |
| `GET /channels/{id}/feed`, flat submission list | `GET /channels/{id}/wall`, `visible`/`locked`/`empty` tiles | The wall grid **is** submit-to-unlock; a flat list can't show a locked slot |
| Per-wall reactions, `cannot_react_own`, 5 emoji | `PUT /submissions/{id}/reactions`, self-react allowed, 3 emoji | The app's own UI puts a heart control on your own tile |
| Report/block out of scope | In scope, required | Apple 1.2 / Play UGC; the app already ships both |
| No avatars | `avatarUrl` on `User`, `PUT /me/avatar` | Dashboard, wall tiles, roster all render it |
| `reset_token` password reset | `{ email, code, newPassword }` | What Cognito's `ConfirmForgotPassword` and the app's screen actually send |
| Invite redemption collects nothing extra | Invite **minting** (`POST /channels/{id}/invites`) never collects an email; redemption still requires `displayName`/`dateOfBirth` | The members screen shares a link, it doesn't ask for an address first |
| `story.char_limit` hardcoded | Server-evaluated feature flag, default 280 | `packages/contracts/src/flags.ts` |
| No `GET /flags` | Added, `{ version, values }` envelope | Same file |

---

## Confirmed foundation

- **Compute**: one containerized Node HTTP service behind a load balancer,
  not function-per-route (register 2.1, 2.2).
- **Data store**: Aurora Serverless v2, Postgres -- `schema-draft.md`
  (register 2.3, gate closed per 10b). Not implemented yet: today's
  `scribl-mobile-app` Prisma schema has exactly one table (`User`); the
  product tables below are the target, not the current state.
- **Identity**: managed user pool (Cognito), email/password only, no social
  sign-in (register 3.1). The app's own auth adapter is Cognito-backed and is
  what `packages/contracts/src/api/auth.ts` models.
- **Bundle id**: `co.scribl.app` both platforms; API likely at
  `api.scribl.co` -- not yet provisioned.

---

## Global conventions

| Aspect | Decision |
|---|---|
| Base URL | `https://api.scribl.co/v1` (placeholder) |
| Auth | Bearer token from our own `/auth/*`, verified against the active identity adapter. Clients never talk to Cognito directly |
| Content type | `application/json`, except presigned uploads (raw bytes to object storage) and `POST /audio` (base64 in the JSON body) |
| Field naming | **camelCase** throughout (`code`, `correlationId`, `promptId`), not snake_case. Paths use hyphens for multi-word segments (`/auth/sign-up`, `/media/presign`) |
| ID format | UUIDs on the wire (`z.uuid()` everywhere a real id is expected). Invite tokens are a separate 22-128 char URL-safe base64 shape, never a UUID |
| Timestamps | ISO 8601, UTC |
| "Today" | Resolved once, server-side, per caller's stored timezone -- one shared definition everywhere (the "prompt day") |
| Idempotency | `POST /submissions` and `POST /artifacts` carry `idempotencyKey` (UUID) **in the request body**, and the response carries `deduplicated: boolean` so a client can tell a replay from a fresh create. Other retryable POSTs use a header-based `Idempotency-Key` convention |
| Errors | `{ "code": "<ErrorCode>", "message": "...", "correlationId": "<id>" }`. Never leak internals |
| Rate limiting | `429 rate_limited`. Invite resolution limited more tightly than the general limit |

### Common errors

| Status | `code` | When |
|---|---|---|
| 401 | `unauthenticated` | Missing, expired or invalid token |
| 403 | `forbidden` | Not authorized for this action (owner-only prompt injection, editing someone else's row, etc.) |
| 403 | `submission_required` | Caller hasn't submitted today; the whole wall (and any submission on it) stays refused until they have |
| 403 | `parental_consent_required` | Minor's sign-up/redemption can't proceed to account creation without parental consent |
| 404 | `not_found` | Not visible to this caller. Also used where a v2 draft used `not_a_member`: a channel/submission the caller can't see returns `not_found`, never a distinguishable "forbidden," so a wall's existence is never confirmed to a non-member |
| 422 | `validation_failed` | Body fails schema validation |
| 409 | `conflict` | Duplicate daily submission without a `replacesSubmissionId` |
| 429 | `rate_limited` | Too many requests |
| 404 | `invite_invalid` | Invite token unknown (an expired token answers identically -- see Invites) |
| 410 | `invite_expired` | Reserved for a token whose expiry is enforced; today unknown and expired both answer `invite_invalid` |
| 500 | `internal` | Unhandled server fault |

Full type: `errorCodeSchema` in `packages/contracts/src/api/errors.ts` --
**11 codes today**, all listed above. `submission_required` and channel
isolation are enforced in the authorization module, never bypassable by
flag or config.

> **Proposed 12th code, not yet in `errorCodeSchema`:** `503
> no_prompt_available`, for the rotating-fallback-prompt failure case (client
> must render something, not a blank screen). Useful and worth adding, but
> as of this writing it does not exist in `packages/contracts` -- treat any
> mention of it below as a to-do for that package, not a currently-returnable
> code.

---

## Endpoint index

| Group | Method and path | Purpose |
|---|---|---|
| Auth | `POST /auth/sign-up` | Create an account directly (not via invite) |
| Auth | `POST /auth/sign-in` | Sign in |
| Auth | `POST /auth/challenge` | Answer a sign-in-time challenge (unverified email, forced password change, MFA) |
| Auth | `POST /auth/confirm-email` | Confirm the sign-up verification code |
| Auth | `POST /auth/confirm-email/resend` | Resend the verification code |
| Auth | `POST /auth/refresh` | Refresh the access token |
| Auth | `POST /auth/signout` | Invalidate the session (documented, not yet in `packages/contracts`/the mock) |
| Auth | `POST /auth/password-reset/request` | Start password reset |
| Auth | `POST /auth/password-reset/confirm` | Complete password reset |
| Auth | `GET /me` | Current user + capabilities |
| Invites | `GET /invites/{token}` | Resolve an invite link |
| Invites | `POST /invites/{token}/redeem` | Accept an invite, creating an account inline if needed |
| Invites | `POST /channels/{id}/invites` | Mint a shareable invite token for this wall |
| Consent | `GET /me/consents` | Current consent state for the caller |
| Consent | `POST /me/consents` | Record a granted or revoked consent |
| Consent | `POST /parental-consent/initiate` | Start verifiable parental consent for a minor account (future, not enrolled today) |
| Consent | `POST /parental-consent/confirm` | Complete the verification, method pending ADR (future) |
| Consent | `GET /parental/children` | List accounts a parent has consented for (future) |
| Prompt | `GET /prompts/today` | Today's prompt, and whether the caller has answered it |
| Prompt | `GET /prompts/{date}` | A prompt for a specific date (documented, not yet in the mock) |
| Prompt packs | `GET /prompt-packs` | Browse curated prompt packs |
| Prompt packs | `GET /prompt-packs/{packId}` | One pack's prompts |
| Prompt packs | `POST /channels/{id}/prompt-packs` | Owner injects pack-sourced or custom prompt(s) onto their wall |
| Prompt packs | `GET /channels/{id}/prompt-packs/injected` | A wall's injected-prompt history |
| Media | `POST /media/presign` | Presigned upload URL for a render, stroke document, cutout, avatar, or artifact render |
| Media | `POST /audio` | Upload a capped voice-note clip (base64), behind `story.voice_enabled` |
| Submission | `POST /submissions` | Create (or, with `replacesSubmissionId`, redraw) today's submission |
| Submission | `GET /submissions/{id}` | Submission detail, with reaction counts |
| Submission | `PUT /submissions/{id}/reactions` | Set or clear the caller's reaction |
| Artifacts | `POST /artifacts` | Arrange several already-entitled drawings into one keepsake -- never satisfies submit-to-unlock |
| Artifacts | `GET /artifacts/{id}` | Artifact detail, with source credits |
| Channels | `GET /channels` | List the caller's walls |
| Channels | `POST /channels` | Create a new wall |
| Channels | `GET /channels/{id}/wall` | Wall grid: visible / locked / empty tiles |
| Channels | `GET /channels/{id}/members` | Member roster (identity + avatar only, no email, no drawn-today) |
| Channels | `POST /channels/{id}/seen` | Mark a wall as read (documented, not yet in the mock) |
| Users | `PUT /me/avatar` | Commit a presigned avatar upload, or clear it |
| Users | `PATCH /users/{id}` | Self-service display-name update (documented, not yet in `packages/contracts`/the mock -- only `PUT /me/avatar` exists today) |
| Stats | `GET /me/stats` | Created/shared counts, streak, weekly grid, milestone badges -- one body for Dashboard and Today |
| Flags | `GET /flags` | Resolved feature-flag snapshot |
| Account | `DELETE /me` | Delete own account: soft-delete now, hard-purge job enqueued in the same call |
| Account | `POST /me/export` | Request an export of own creations |
| Account | `GET /me/export/{requestId}` | Poll an export request for its signed download link (documented, not yet in `packages/contracts`/the mock -- only `POST /me/export` exists today) |
| Moderation | `POST /reports` | Report a submission |
| Moderation | `POST /blocks` | Block or unblock a user |
| Diagnostics | `POST /diagnostics/logs` | Ship a batch of device log lines, consent- and flag-gated |
| Health | `GET /health/live` | Shallow liveness |
| Health | `GET /health/ready` | Deep readiness, checks the database. Implemented in the Nest scaffold (`apps/api`); `@scribl/mock-server` has no database to check and only exposes `GET /health` |

---

## Auth

One interface, two adapters: **local** (default, no cloud credential) and
**Cognito** (staging/prod) -- register 6.1. Clients only ever talk to our
API. Tokens (`accessToken`/`refreshToken`/`expiresIn`) are transport-level
additions returned alongside these shapes on the wire; they are **never**
part of the typed `User`, `SignInResult`, or any other product object --
a type that can hold a token is a type that can leak one into a log line.

### `POST /auth/sign-up`
```json
{ "email": "matthew@example.com", "password": "correct-horse-battery-staple", "displayName": "Matthew", "dateOfBirth": "1990-04-12" }
```
`inviteToken` is optional and, when present, a redeemed-alongside-signup
token -- omit the field entirely rather than sending `null`
(`signUpRequestSchema.inviteToken` is `.optional()`, not `.nullable()`).
`displayName` is required (shown on the dashboard greeting). `dateOfBirth`
derives `accountClass` (register 7.1). `password` needs 12+ characters.

**Response, `200 OK`**, a discriminated union on `kind`:
```json
{ "kind": "verification_required", "email": "matthew@example.com" }
```
```json
{ "kind": "parental_consent_required", "accountClass": "minor", "consentRequestId": "..." }
```
Per the current product decision (Option A), **a minor never reaches
account creation** -- there is no "create with tokens, gate later" path.
The `verification_required` branch is followed by:

### `POST /auth/confirm-email`
```json
{ "email": "matthew@example.com", "code": "482913" }
```
`200 OK` on success.

### `POST /auth/confirm-email/resend`
```json
{ "email": "matthew@example.com" }
```
Always `200 OK`, same non-disclosure rule as password reset: the answer is
identical whether or not the address has an account waiting on a code.

### `POST /auth/sign-in`
```json
{ "email": "matthew@example.com", "password": "correct-horse-battery-staple" }
```
**Response, `200 OK`**, a discriminated union on `kind`:
```json
{ "kind": "authenticated", "user": { "...": "userSchema" }, "capabilities": { "...": "capabilitiesSchema" } }
```
```json
{ "kind": "challenge", "challenge": { "kind": "email_verification" }, "challengeToken": "..." }
```
`challenge.kind` is `email_verification | new_password_required | mfa_totp |
mfa_sms` (the latter two declared now, unreachable until `auth.mfa_enabled`
opens). Cognito already answers with challenges today; collapsing sign-in to
a token blob leaves the verify / new-password screens nowhere to go.

### `POST /auth/challenge`
Answers a challenge returned by `POST /auth/sign-in`. This is the
**sign-in-time** unverified-email / new-password path -- distinct from
`POST /auth/confirm-email`, which is the sign-up verify screen.
```json
{ "challengeToken": "...", "kind": "email_verification", "answer": "482913" }
```
Response is the same `SignInResult` discriminated union as sign-in: it can
authenticate outright, or hand back another challenge (e.g.
`new_password_required` after an `email_verification` answer succeeds).
This is what a Nest-owned `/auth/*` has to expose so clients never talk to
Cognito directly -- today the local adapter
(`apps/mobile/src/services/auth/adapters/local.ts`) already calls it.

### `POST /auth/refresh`
```json
{ "refreshToken": "..." }
```
-> `{ "accessToken": "...", ... }`. Refresh token lives in platform secure
storage; biometric unlock (`auth.biometric_unlock`) just gates local release
of it -- the server never trusts a client-asserted "biometric verified" claim.

### `POST /auth/signout`
No body. `204 No Content`. Invalidates the refresh token server-side.
**Not yet in `packages/contracts` or the mock** -- there's no schema or
route for it today; documented as the obvious counterpart to `refresh`,
not a currently-callable endpoint.

### `POST /auth/password-reset/request`
```json
{ "email": "matthew@example.com" }
```
Always `200 OK`, match or not, so the endpoint can't be used to enumerate
emails.

### `POST /auth/password-reset/confirm`
```json
{ "email": "matthew@example.com", "code": "482913", "newPassword": "..." }
```
`200 OK` on success. This is `{ email, code, newPassword }` -- what
Cognito's `ConfirmForgotPassword` takes -- not a `reset_token`; nothing
issues one.

### `GET /me`
Loaded by the auth adapter after every token (sign-in, refresh, or app
restore).
```json
{
  "user": { "id": "...", "displayName": "Sarah", "accountClass": "adult", "emailVerified": true, "createdAt": "...", "avatarUrl": null },
  "capabilities": { "canSubmit": true, "canReact": true, "canInvite": true, "requiresParentalConsent": false }
}
```
`User` deliberately has no email and no token -- see the naming rationale
above. `capabilities` are booleans derived server-side from account class,
consent rows, and flags; the client receives answers, never rules.

---

## Invites and onboarding

Confirmed in scope (`code-questions.md` Q9).

### `GET /invites/{token}`
Public and unauthenticated -- the most exposed surface in the system.
- Unknown and expired tokens return the identical `invite_invalid` refusal.
- No internal channel id in the response, just a name. The invitee's email
  is never returned to an unauthenticated caller.

```json
{ "inviterDisplayName": "Matthew", "channelName": "Family", "promptText": "The last time I felt creative was...", "expiresAt": "2026-09-30T00:00:00.000Z" }
```
```json
{ "code": "invite_invalid", "message": "That invite link is not valid.", "correlationId": "..." }
```

**`expiresAt` stays on the wire for now.** `resolvedInviteSchema.expiresAt`
is `z.iso.datetime()`, **required**, in `packages/contracts` today, and the
mock actually sends one (`"2026-09-30T00:00:00.000Z"`) -- a resolve payload
without it fails to parse in the app's `resolveInvite` right now, so
dropping the field here would be a breaking change against the client that
already ships, not a documentation cleanup. The column backing it is
unused (invites don't expire in practice), but that's a `packages/contracts`
change to make later, paired with an app release that can parse its
absence -- either keep sending a (possibly sentinel) datetime, or make the
field `.optional()` in the same change that updates the app. Not resolved
unilaterally in this draft.

### `POST /channels/{id}/invites`
Mints a wall-scoped invite token. No request body. The wall's owner shares
the resulting `scribl://invite/{token}` link themselves, through whatever
channel they choose -- this endpoint never collects the invitee's email, one
fewer peer address through our servers.
```json
{ "token": "kX3f...9pQ2" }
```

### `POST /invites/{token}/redeem`
**Unauthenticated** (new person). Account creation and membership happen in
one atomic operation, so a double-clicked link can't leave a half-formed
account. An invite is not consent: a minor's redemption still runs the
parental-consent gate.
```json
{ "token": "kX3f...9pQ2", "email": "priya@example.com", "displayName": "Priya", "password": "...", "dateOfBirth": "2014-03-01" }
```

**Response, `200 OK`**, a discriminated union:
```json
{ "kind": "joined", "channelId": "...", "user": { "...": "userSchema" }, "capabilities": { "...": "capabilitiesSchema" } }
```
```json
{ "kind": "parental_consent_required", "consentRequestId": "..." }
```

**The unauthenticated body above is the one that has to work first.**
`InviteRedeemScreen` always sends the full new-account body
(`token`/`email`/`displayName`/`password`/`dateOfBirth`), **even when the
caller already has a session** -- there is no signed-in "just join this
wall" screen today, so an authenticated caller redeeming a link still goes
through this same path.

An empty-body "already authenticated, just add the membership" branch is a
**future idea only**, not a current requirement -- do not make Nest treat
"has a Bearer token" as "body must be empty," or every signed-in redeem
from the current app will fail with `422 validation_failed`. If/when a
dedicated join-another-wall screen exists, that's the point to add this
branch, not before.

`POST /channels/{id}/members` (owner adds someone directly by email) is a
different product from invite minting and has no current UI -- see "Not
needed by current mobile" below.

---

## Consent and child safety

Under-13 is in scope, decided by the architect (register 7.1,
`code-questions.md` Q32).

### `GET /me/consents`
```json
{ "consents": [
  { "kind": "terms", "version": "2026-08-01", "grantedAt": "2026-08-25T10:00:00Z", "revokedAt": null, "actorUserId": "...", "method": "self" }
] }
```
`kind` in `terms | privacy | crash_diagnostics | log_shipping | third_party_ai
| parental`. `crash_diagnostics` (Apple 5.1.2(i)) and `log_shipping` (device
log shipping) are deliberately separate rows -- folding them into one
`diagnostics` kind would mean Settings can't grant one without the other.
`third_party_ai` is specifically the AI-enhance consent.

A **not-yet-granted** kind is simply **absent** from this list, not present
with `grantedAt: null` -- `grantedAt` is required on every row that does
appear.

### `POST /me/consents`
```json
{ "kind": "log_shipping", "version": "2026-08-01", "granted": true }
```
Always a new row, never a boolean flip -- full audit trail by design.

### `POST /parental-consent/initiate`, `POST /parental-consent/confirm`, `GET /parental/children`
Future surfaces, not exercised by production mobile today: the current
product decision (Option A) refuses account creation for a minor outright
rather than enrolling them pending consent. Kept documented for when the
pending COPPA ADR lands, but they do not replace the age gate.

---

## Daily prompt

### `GET /prompts/today`
Server-resolved date. A discriminated union so the home screen's primary CTA
is one call, not two:
```json
{ "status": "unanswered", "prompt": { "id": "...", "text": "Where do you feel most like yourself?", "promptDay": "2026-08-25" } }
```
```json
{ "status": "submitted", "prompt": { "...": "promptSchema" }, "submissionId": "...", "submittedAt": "2026-08-25T14:32:07Z" }
```
`503 no_prompt_available` on the rotating-fallback failure case -- client
must render something, not a blank screen. **Proposed, not yet in
`errorCodeSchema`** (see the note under Common errors above).

### `GET /prompts/{date}`
Same shape, for a specific date. **Not yet implemented** in
`@scribl/mock-server` -- documented as a target, not a current call.

---

## Prompt packs

Catalog content browsed before injecting onto a wall. No membership gate --
any authenticated caller can browse.

### `GET /prompt-packs`
```json
{ "packs": [{ "id": "3e6a1f2b-...-uuid", "title": "Workplace Check-in", "promptCount": 8 }] }
```
Pack ids are **UUIDs**, not slugs.

### `GET /prompt-packs/{packId}`
```json
{ "pack": { "id": "3e6a1f2b-...", "title": "Workplace Check-in", "promptCount": 8 }, "prompts": [{ "id": "pack-3e6a1f2b-0", "text": "I am unhappy at work when..." }] }
```
`404 not_found` for an unknown pack id.

### `POST /channels/{id}/prompt-packs`
Creator-only (`403 forbidden` otherwise). A discriminated union, because
both branches land in the same place -- the wall's injected-prompt feed:
```json
{ "kind": "pack", "packId": "3e6a1f2b-...", "packPromptIds": ["pack-3e6a1f2b-0", "pack-3e6a1f2b-1"] }
```
```json
{ "kind": "custom", "text": "What made today feel different?" }
```
1-5 prompts per call (`MAX_INJECT_PROMPTS`); custom text capped at 140
characters. `201 Created` -> `{ "injected": [{ "id", "text", "packId", "injectedByDisplayName", "injectedAt" }] }`.

### `GET /channels/{id}/prompt-packs/injected`
A wall's injected-prompt history, newest first.
```json
{ "injected": [{ "id": "...", "text": "...", "packId": "3e6a1f2b-...", "injectedByDisplayName": "Matthew", "injectedAt": "2026-09-01T12:00:00Z" }] }
```

---

## Media

Images never sit in the database; every submission stores strokes as well
as a render (register 2.5, 2.6).

### `POST /media/presign`
Presigned URL for one artifact of one submission, an avatar, or a composed
artifact render. Limits (content type, byte size) are enforced in the
signed policy, not trusted from the client.
```json
{ "kind": "render", "contentType": "image/png", "byteSize": 512000 }
```
`kind` in `stroke_document | render | avatar | artifact_render | cutout`.

```json
{ "uploadUrl": "https://scribl-media.s3.amazonaws.com/...", "key": "art/99999999-9999-4999-8999-999999999999/77777777-7777-4777-8777-777777777777/v1/render.png", "expiresAt": "2026-08-25T15:00:00Z", "headers": { "x-amz-server-side-encryption": "aws:kms" } }
```

**Key namespacing** by `kind`:
```
art/{userId}/{submissionId}/v{n}/strokes.json
art/{userId}/{submissionId}/v{n}/render.png
art/{userId}/{submissionId}/v{n}/cutout.png
art/{userId}/{artifactId}/v1/render.png            -- artifact_render: own namespace, no submissionId
avatars/{userId}/{uuid}.png                        -- avatar: no submission/artifact id at all
```
The `v{n}` revision segment exists because redraw (`canvas.allow_edit_draw`)
can replace today's row with a new revision of the same submission -- a
"no revision segment" model contradicts that shipping flag.

`cutout` is the ink-only PNG that compose stickers load; optional on
`POST /submissions` so an old binary that never uploaded one still submits.

### `POST /audio`
Behind `story.voice_enabled` (default off). Sent as base64 in the body
rather than through presign-then-PUT: a capped 30-second clip
(`VOICE_MAX_SECONDS`) under 2 MB (`MAX_AUDIO_BYTES`) is small enough that
the extra round trip buys nothing.
```json
{ "audioBase64": "...", "mimeType": "audio/m4a", "durationMs": 4200 }
```
```json
{ "audioRef": "audio/99999999-9999-4999-8999-999999999999/....m4a", "mimeType": "audio/m4a", "byteLength": 51200, "durationMs": 4200 }
```
Moving this onto `POST /media/presign` (a `kind: "audio"` value) is an
acceptable future replacement **if** the signed policy still caps
duration/size the same way -- not implemented today; `presignRequestSchema.kind`
has no `"audio"` value yet.

### The stroke document
Stored at the `strokes` key, referenced from the submission but never read
on the wall feed path.
```json
{
  "schemaVersion": 1,
  "logicalCanvas": { "width": 1000, "height": 1250 },
  "totalDurationMs": 8200,
  "strokes": [
    { "order": 0, "inkId": "magenta", "colorValue": "#D51668", "brushWidth": 12, "startedAt": 0, "durationMs": 900, "points": [{ "x": 120, "y": 550 }] }
  ]
}
```
Nine inks (`orange yellow red magenta teal lime indigo green white`),
brush widths `[2, 3, 5, 8, 12, 18]`. Point coordinates are in the fixed
**logical canvas box** (`0..width`, `0..height`, currently `1000x1250`),
not a normalized 0-1 range -- resolution-independent because every device
maps into that one box, not because the coordinates themselves are
fractional. (Contrast with an artifact's placement items below, whose
`cx`/`cy` genuinely are 0-1 canvas-relative -- a different schema for a
different purpose.)

---

## Submission

### `POST /submissions`

**First draw** (no replace, no audio -- the common case). Optional fields
are **omitted entirely**, never sent as `null`: the composer
(`submit-scribl.ts`) leaves them out of the request object rather than
setting them to `null`, and `null` fails `422 validation_failed` against
`.optional()` schema fields the same way it would on `signUpRequestSchema.inviteToken`.
```json
{
  "idempotencyKey": "11111111-1111-4111-8111-111111111111",
  "promptId": "22222222-2222-4222-8222-222222222222",
  "story": "I always feel most like myself during our family vacations.",
  "shareToChannelIds": ["33333333-3333-4333-8333-333333333333"],
  "strokeDocumentKey": "art/99999999-9999-4999-8999-999999999999/77777777-7777-4777-8777-777777777777/v1/strokes.json",
  "renderKey": "art/99999999-9999-4999-8999-999999999999/77777777-7777-4777-8777-777777777777/v1/render.png",
  "pointCount": 842,
  "byteSize": 51200,
  "strokeSchemaVersion": 1,
  "rendererVersion": 1,
  "logicalCanvas": { "width": 1000, "height": 1250 }
}
```
`promptId` is a real `z.uuid()` -- `GET /prompts/today` already returns one
(the mock's `fixtures.PROMPT_ID` is
`22222222-2222-4222-8222-222222222222`); the old slug-style
`"prompt_20260825"` was left over from the pre-reconciliation draft and
doesn't parse. Same for `shareToChannelIds` (`z.array(z.uuid())`) and every
id embedded in a media key.

**Redraw** (same day, replacing the caller's own current submission):
identical to the first-draw body above, with exactly one field added --
```json
{ "replacesSubmissionId": "77777777-7777-4777-8777-777777777777" }
```
-- merged into the same request object. Nothing else changes shape; this
is additive, not a different request.

**Voice story** (`story.voice_enabled`): swap `story` for
`audioRef`/`audioMime`/`audioDurationMs`, again only the fields actually
being sent, nothing set to `null`.

| Field | Notes |
|---|---|
| `idempotencyKey` | UUID, **in the body**, not header-only. The response's `deduplicated` flag depends on it |
| `shareToChannelIds` | Additional walls beyond Personal; Personal is added server-side regardless of what's requested |
| `strokeDocumentKey`, `renderKey` | Object-storage keys from a completed presigned upload. `cutoutKey` optional (old binaries never uploaded one) |
| `strokeSchemaVersion`, `rendererVersion` | Integers: which document shape and which renderer produced this, so a future format change can still replay old drawings |
| `logicalCanvas` | `{ width, height }` object the stroke coordinates are relative to (fixed at `1000x1250` today, not a 0-1 normalized range -- see the stroke document note above) |
| `pointCount`, `byteSize` | Only the client knows these -- describe the drawing itself, not derivable server-side |
| `replacesSubmissionId` | **Explicit redraw**, behind `canvas.allow_edit_draw`. Absent means "create." The server verifies the named submission belongs to the caller and to the current prompt day, and refuses when the flag is off. A lost-response retry must never silently overwrite -- that's why this is a stated intent, not inferred from "caller already has a row today" |
| `story` | Length limit is the `story.char_limit` flag (default 280) |
| `audioRef`, `audioMime`, `audioDurationMs` | A voice story, behind `story.voice_enabled`. Mutually exclusive with `story` at the client (not enforced in this schema) |

**Response, `201 Created`** (or `200 OK` if `deduplicated`)
```json
{ "submissionId": "77777777-7777-4777-8777-777777777777", "deduplicated": false }
```
No signed render URL here -- the client already has the local render it
just uploaded.

**Error, `409 conflict`**: a second create for today with a fresh
`idempotencyKey` and no `replacesSubmissionId`.

A submission's **artwork is keyed to a revision** (`revision` on the
`Submission` entity, `v{n}` in every media key). Redraw replaces the row's
content and bumps the revision; it does not create a second submission for
the day, and reactions/wall placement carry over to the new revision.

### `GET /submissions/{id}`
```json
{
  "submission": { "id": "77777777-7777-4777-8777-777777777777", "promptId": "...", "authorId": "...", "authorDisplayName": "Sarah", "story": "...", "revision": 1, "media": { "...": "submissionMediaSchema" }, "createdAt": "..." },
  "promptText": "Where do you feel most like yourself?",
  "channelName": "Family",
  "authorAvatarUrl": null,
  "imageUrl": "https://cdn.scribl.co/signed/...",
  "reactions": [{ "kind": "heart", "count": 3, "mine": true }]
}
```
`403 submission_required` if the caller hasn't submitted today (applies to
every submission read, not only the caller's own).

### `PUT /submissions/{id}/reactions`
```json
{ "kind": "heart", "active": true }
```
`kind` in `heart | smile | star`. **Self-reaction is allowed** -- the
caller's own tile shows a heart control -- there is no
`cannot_react_own` refusal. Returns the full response detail above (so the
UI can fold updated counts without a second `GET`). `403 submission_required`
/ `404 not_found` apply the same as the detail read.

There is no separate `GET .../reactions` list endpoint; counts live on the
detail response and inline on wall tiles.

---

## Artifacts

Arrange several drawings the caller already can see (own, or from shared
walls) into one picture, saved to their own Personal wall.

**Not a `Submission`.** An artifact has no prompt day, is never replaced,
and never satisfies submit-to-unlock -- folding it into
`submissions.kind = composition` would make `promptId` mean two different
things depending on which optional fields are set, exactly the "one shape
with six optional fields" this contract avoids elsewhere.

### `POST /artifacts`
```json
{
  "idempotencyKey": "c2f3...uuid",
  "sourceSubmissionIds": ["77777777-7777-4777-8777-777777777777", "88888888-8888-4888-8888-888888888888"],
  "layout": {
    "items": [
      { "sourceSubmissionId": "77777777-7777-4777-8777-777777777777", "cx": 0.3, "cy": 0.4, "scale": 0.4, "rotation": 0, "z": 0 },
      { "sourceSubmissionId": "88888888-8888-4888-8888-888888888888", "cx": 0.6, "cy": 0.3, "scale": 0.3, "rotation": 12, "z": 1 }
    ]
  },
  "renderKey": "art/99999999-9999-4999-8999-999999999999/66666666-6666-4666-8666-666666666666/v1/render.png",
  "byteSize": 88000
}
```
2-6 sources. `cx`/`cy` are the **center** point in 0-1 canvas space (not a
corner). Destination is always the caller's own Personal wall, derived
server-side. Every distinct `sourceSubmissionId` re-runs the normal read
gates (`submission_required`, channel isolation) -- an artifact can't grant
new access.

**Response, `201 Created`** (or `200 OK` if `deduplicated`)
```json
{ "artifactId": "66666666-6666-4666-8666-666666666666", "deduplicated": false }
```

### `GET /artifacts/{id}`
```json
{
  "artifact": { "id": "66666666-6666-4666-8666-666666666666", "authorId": "...", "authorDisplayName": "Sarah", "sourceSubmissionIds": ["..."], "layout": { "...": "compositionLayoutSchema" }, "media": { "renderKey": "...", "thumbnailKey": "...", "byteSize": 88000 }, "createdAt": "..." },
  "imageUrl": "https://cdn.scribl.co/signed/...",
  "sources": [{ "submissionId": "77777777-7777-4777-8777-777777777777", "thumbnailUrl": "https://cdn.scribl.co/signed/thumb/...", "authorDisplayName": "Sarah" }]
}
```
`sources` credits every drawing the artifact was built from -- who to
thank, not just what.

Agree compositions must not satisfy unlock -- that part matches the v2
draft and the app.

---

## Channels and walls

### `GET /channels`
```json
{ "channels": [
  { "id": "44444444-4444-4444-8444-444444444444", "kind": "personal", "name": "Personal", "isAutomatic": true, "memberCount": 1, "createdByUserId": "..." },
  { "id": "33333333-3333-4333-8333-333333333333", "kind": "family", "name": "Family", "isAutomatic": false, "memberCount": 4, "createdByUserId": "..." }
] }
```
`kind` is a free string (seeded: `personal | family | friends | coworkers`;
user-created walls get `kind: "custom"`), not a closed enum -- adding a
channel kind is a row, not a release. `isAutomatic` marks Personal, which
cannot be left.

### `POST /channels`
```json
{ "name": "Book Club" }
```
Creates a wall owned by the caller, starting with a roster of one -- others
join by invite (`POST /channels/{id}/invites`), the same path anyone joins
any wall. `201 Created` -> `{ "channel": { "...": "channelSchema" } }`.

### `GET /channels/{id}/wall`
**This is the grid, and the grid is submit-to-unlock.** Refused with
`403 submission_required` until the caller has a submission for today --
that refusal is transactional and server-side, never a UI decision.
```json
{
  "channel": { "...": "channelSchema" },
  "promptText": "Where do you feel most like yourself?",
  "tiles": [
    { "state": "visible", "submissionId": "77777777-7777-4777-8777-777777777777", "authorDisplayName": "Sarah", "authorAvatarUrl": null, "thumbnailUrl": "https://cdn.scribl.co/signed/thumb/...", "createdAt": "...", "kind": "scribl", "cutoutUrl": "https://cdn.scribl.co/signed/cutout/...", "heartCount": 2, "heartedByMe": false },
    { "state": "locked", "authorDisplayName": "Matthew" },
    { "state": "empty", "authorDisplayName": "Priya" }
  ]
}
```
Three tile states, distinct on purpose: `empty` (nobody was ever there),
`locked` (somebody drew, you haven't), `visible` (you can open it). A flat
list of only-visible submissions can't render a locked slot, which makes
the invariant unreadable on the grid.

`visible` tiles additionally carry: `kind: scribl | artifact` (tap ->
`/response/:id` vs `/artifact/:id`, missing means `scribl`), optional
`cutoutUrl` (compose multi-select prefers this over the paper-backed
thumbnail), and optional `heartCount`/`heartedByMe` (inline hearting from
the grid, present together or not at all -- absent on `artifact` tiles,
which carry no reactions).

`POST /channels/{id}/seen` (mark read, backing a `has_new_activity` field on
`GET /channels`) is documented as a future addition -- **not yet
implemented** in `@scribl/mock-server` -- and is not a substitute for the
tile states above.

### `GET /channels/{id}/members`
Membership identity list, visible to any member regardless of whether
they've drawn today -- a bare "who's on this wall" isn't peer content, so
it's deliberately not submit-to-unlock-gated.
```json
{ "members": [{ "userId": "55555555-5555-4555-8555-555555555555", "displayName": "Matthew", "avatarUrl": null, "isCreator": true }] }
```
**No email** on this or any peer-facing read (same rule as `User`).
`isCreator` is how the members screen decides whether to render invite/
remove controls for a given row. There is deliberately no second
"drawn-today" variant of this endpoint, and no separate `/roster` --see
"Not needed by current mobile" below.

`POST /channels/{id}/members` (owner adds someone directly by email) is
documented but unused by current mobile -- a different product from invite
minting, no current UI.

---

## Users

### `PUT /me/avatar`
Commits the key produced by a presign with `kind: "avatar"`.
```json
{ "avatarKey": "avatars/99999999-9999-4999-8999-999999999999/22112211-2211-4211-8211-221122112211.png" }
```
`avatarKey: null` clears the avatar -- the same verb does both rather than
a second endpoint for "unset." `200 OK` -> `{ "user": { "...": "userSchema" } }`.

### `PATCH /users/{id}`
Self-only (`403 forbidden` otherwise).
```json
{ "displayName": "Sarah K." }
```
**Not yet in `packages/contracts` or the mock** -- today `GET /me` +
`PUT /me/avatar` cover reading a profile and changing the avatar, but
there's no schema/route yet for a self-service display-name change. This
is a real gap to add, not a documented-and-shipped endpoint.

A global `GET /users` directory is documented but not needed by current
mobile -- see below.

---

## Stats

### `GET /me/stats`
One body backs both the Dashboard screen and the Today screen's streak /
week strip / milestone badges -- previously split across two endpoints in
the v2 draft, which left `/me/stats` without the created/shared counts
Dashboard actually renders.
```json
{
  "scriblsCreated": 12, "scriblsShared": 9,
  "weeklyAverageCreated": 3.1, "weeklyAverageShared": 2.4,
  "currentStreak": 6, "bestStreak": 14,
  "weeklyCompletion": [
    { "date": "2026-08-28", "done": true }, { "date": "2026-08-29", "done": true },
    { "date": "2026-08-30", "done": false }, { "date": "2026-08-31", "done": true },
    { "date": "2026-09-01", "done": true }, { "date": "2026-09-02", "done": true },
    { "date": "2026-09-03", "done": false }
  ],
  "badges": [{ "day": 7, "earned": true }, { "day": 30, "earned": false }, { "day": 100, "earned": false }],
  "impressionsShared": null, "impressionsReceived": null
}
```
`currentStreak`: consecutive days ending today or yesterday (a gap today
doesn't reset until tomorrow). `bestStreak`: longest run ever, never lost.
`badges[].day` is fixed at **7/30/100**. Impressions need view-event
tracking (out of scope for now), so they're explicitly `null`, never
fabricated.

Artifacts (compositions) are their own entity now, not a `submissions.kind`
value, so they naturally don't count toward `scriblsCreated` or the streak
-- there's no filter to remember, unlike the v2 draft's
"submissions.kind = composition, remember to exclude it" framing.

---

## Feature flags

### `GET /flags`
Evaluated server-side against the verified token, never client-supplied
context.
```json
{
  "version": "a1b2c3",
  "values": {
    "canvas.full_toolset": false,
    "canvas.allow_edit_draw": true,
    "ai.enhance_enabled": false,
    "story.voice_enabled": false,
    "invite.hosted_landing": false,
    "story.char_limit": 280,
    "auth.mfa_enabled": false,
    "auth.biometric_unlock": true,
    "diagnostics.crash_reporting": true,
    "diagnostics.log_shipping": false,
    "diagnostics.log_level": "warn",
    "diagnostics.log_buffer_entries": 200,
    "diagnostics.log_buffer_bytes": 262144
  }
}
```
`values` is a **partial** map of the declared registry
(`packages/contracts/src/flags.ts`, 13 keys total): an unknown key must fail
parse, a missing declared key falls back to the registry default -- the
client merges what it receives over those defaults, so a server one deploy
behind doesn't drop every other answer. `diagnostics.crash_reporting` can
only turn collection **off**; turning it on still requires a matching
consent row.

---

## Account

### `DELETE /me`
```json
{ "confirmation": "DELETE" }
```
The confirmation literal is required -- it's what stops a stray `DELETE`.
This call **soft-deletes immediately** (`users.deleted_at`, revokes
sessions -- the same auth module that enforces channel isolation hides the
account everywhere from this point on) **and enqueues a `hard_purge`
`account_jobs` row in the same transaction**, so the object-storage cascade
(every stroke-document revision) is guaranteed rather than a separate,
easy-to-forget legal/admin-only operation. Apple requires in-app deletion;
this is what satisfies it without leaving a minor's drawings sitting in the
bucket.

**Response, `204 No Content`**

### `POST /me/export`
```json
{ "requestId": "12121212-1212-4212-8212-121212121212", "status": "queued", "downloadUrl": null }
```
`status` is `queued | ready`. Poll:

### `GET /me/export/{requestId}`
```json
{ "requestId": "12121212-1212-4212-8212-121212121212", "status": "ready", "downloadUrl": "https://cdn.scribl.co/signed/export/..." }
```
**Not yet in `packages/contracts` or the mock** -- only `POST /me/export`
exists today, and it always answers `queued` with a `null` `downloadUrl`
in the mock. This poll route is proposed, not shipped: Settings has no
poll loop today, and can't until this (or an equivalent) exists.

---

## Report and block

**Required for MVP -- Apple 1.2 and Play's UGC policy both require both of
these, and the app already ships them.**

### `POST /reports`
```json
{ "submissionId": "77777777-7777-4777-8777-777777777777", "reason": "inappropriate" }
```
`reason` in `inappropriate | harassment | spam | other`. `202 Accepted`.
Rendered from `ReportContentButton` on the response-detail screen.

### `POST /blocks`
```json
{ "userId": "55555555-5555-4555-8555-555555555555", "blocked": true }
```
`204 No Content`. A caller cannot block themself. Rendered from
`BlockUserButton` on the members roster. Enforced at the same authorization
choke point as channel isolation, so a blocked user disappears from each
other's walls -- not a separate moderation-only check.

---

## Diagnostics

### `POST /diagnostics/logs`
NDJSON body (not JSON), one log line per row. Consent-gated
(`log_shipping` consent kind) and flag-gated (`diagnostics.log_shipping`,
off by default) end to end -- off means this route is never called.
`204 No Content`. Not client-facing in the sense of a screen; it's what the
app's logging adapter talks to once both gates are open.

---

## Health

Not client-facing; what the load balancer depends on (register 6.4).
- `GET /health/live`: shallow, no dependency checks. Implemented in both
  the Nest scaffold (`apps/api`) and `@scribl/mock-server`.
- `GET /health/ready`: deep, touches the database. Kept separate so a DB
  blip doesn't kill every running task at once. Implemented in the Nest
  scaffold; `@scribl/mock-server` has no database to check, so it only
  exposes a plain `GET /health` (`{ ok, db: "mock" }`) as a convenience
  route -- not a `/ready` equivalent, and not part of `packages/contracts`.

---

## Not needed by current mobile

Modeled or discussed at some point, but no current UI calls for these --
keep the idea, don't let it delay the gaps above:

- **Comments.** Not modeled anywhere in `packages/contracts` today; a
  moderation surface with real compliance weight once revisited.
- **`GET /users`**, a global user directory.
- **A second `/roster` endpoint** next to `/members` -- the app's single
  `GET /channels/{id}/members` already is the ungated identity list.
- **`GET /channels/{id}/days`**, a date/response-count index.
- **`DELETE /channels/{id}`** (owner deletes a channel) and
  **`DELETE /channels/{id}/members/{userId}`** (owner removes a member) --
  no current UI for either.
- **`POST /channels/{id}/members`** (owner adds a member directly by
  email) -- different product from invite minting, no current UI.
- **Public walls read authorization** -- `channels.is_public` isn't
  currently exposed by `channelSchema`; whether/how it should be is
  undecided.

---

## Deliberately out of scope for this contract

- **Managed push notification delivery.** Seams + a local daily reminder
  only. `POST /devices/register` when funded.
- **Automated content moderation.** `POST /reports` and `POST /blocks` are
  in scope (see above); an AI/automated moderation layer and a
  `moderation_queue` stay out of band.
- **Analytics event pipeline.** Separate system entirely.
- **Timed drawing challenges.** Parked, not deleted.
- **Experiment/A/B variant serving.** The flags interface reserves
  `getVariant`; nothing implements it.

---

## Contract conformance

Per engineering-standards.md tier 2 (register 10b, "mock-to-real contract
drift guard"): one suite should run against both the mock server and the
real API from the same `packages/contracts` definitions, asserting identical
shapes/codes/errors. This is E01-F5's acceptance criterion. Treat
`packages/contracts` as the app-facing contract to reconcile against on
every future change to this draft -- that package is what
`@scribl/mock-server` already validates every response against today, and
it is what will fork from this document if the two disagree again.

---

## Where this contract lives in the codebase

Per `architecture.md` section 2 and confirmed against the actual layout:
entity types in `packages/contracts/src/entities/`, request/response shapes
in `packages/contracts/src/api/` (one file per resource), fixed enums in
`packages/contracts/src/constants/`, flag registry in
`packages/contracts/src/flags.ts`. `@scribl/mock-server`'s
`src/routes.ts` is what actually serves every route above to `apps/mobile`
today, validating each response against the same schema before returning
it. This document is the plain-language draft of what those files contain.

---

## Still open, not guessed at here

- **Verifiable parental consent method**, and children's-store-category
  question. Pending ADR, register 7.1.
- **Whether a minor needs their own unique email.** Moot under the current
  Option A decision (a minor never reaches account creation), but worth
  confirming it stays moot if the ADR changes that.
- **"Get Inspired" examples branch** (Q10), low urgency, unresolved.
- **Model hosting for future AI calls** (Bedrock recommended, register 1b
  A3), not load-bearing yet.
- **Public-wall read authorization** -- `is_public` is not currently on
  `channelSchema` at all; whether to add it and what it should authorize is
  undecided.

---

## Sources

Primary, checked source of truth:
[`ScriblOrg/scribl-mobile-app`](https://github.com/ScriblOrg/scribl-mobile-app)
-- `packages/contracts/src/**` (the Zod schemas every shape above is taken
from verbatim), `packages/mock-server/src/routes.ts` (what `apps/mobile`
actually calls on `:4000` today), and `apps/mobile/src/data/`.

Also `meta-scribl-app/handbook/engineering/architecture.md`,
`decision-register.md`, `code-questions.md`, `feature-flags.md`,
`engineering-standards.md` for product decisions not visible in code
(consent policy, branching, versioning, flag governance rules).

This v3 revision exists because the v2 draft was cross-checked against the
handbook and the old POC (`hs2studio/scribl-app`) but not against
`packages/contracts` -- which is why wall tiles, avatars, report/block,
invite minting, redraw, cutouts, artifacts, `GET /me`, and email
verification were absent from it. Pankaj Aggarwal's review on PR #2
(2026-09-03) is the record of that gap and the basis for every change above.

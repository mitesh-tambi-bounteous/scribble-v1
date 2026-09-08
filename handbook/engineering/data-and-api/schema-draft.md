# scribl database schema, v3 draft (E01-F3)

Status: revised after Pankaj Aggarwal's mobile-gap review on PR #2
(2026-09-03), to stay consistent with `api-contract-draft.md`'s v3
rewrite (same folder). Target: **Aurora Serverless v2 (PostgreSQL)** --
decision-register.md 2.3 and 10b (Aurora gate closed).

**Not implemented yet.** `scribl-mobile-app`'s actual Prisma schema today
has exactly one table (`User`: `id`, `idpSub`, `email`, timestamps). Every
table below is the target design, reconciled against
`packages/contracts` so that whoever builds it doesn't have to guess the
shapes the app already expects on the wire.

## Changelog (newest first)

- **2026-09-03 (v3.3, third review round):** Fixed the `invites` table
  note and the v3.1 changelog bullet, both of which still said
  `expiresAt` should be dropped/removed after `api-contract-draft.md`
  v3.3 had already restored it -- this file now says the same thing the
  API doc does (keep sending it; the column stays unused, dropping the
  wire field needs a paired `packages/contracts` + app change). Added
  `DEFAULT gen_random_uuid()` to `submissions.id` and `artifacts.id`,
  both leftover from an earlier draft where the client sent its own id --
  today the server mints both and an insert with no default would fail.
- **2026-09-03 (v3.2, second review round):** **Reverted v3's
  `submissions.superseded_by` redraw design** -- the architect showed it
  breaks the app (`GET /submissions/{id}` 404s on the old id, reactions
  stay on the superseded row, the wall tile points at an id the client
  never asked for). Redraw is now a same-row update: `revision` bumps,
  media keys move to the next `v{n}`, `id` never changes, and
  `idx_submissions_daily_unlock` is a plain `UNIQUE (user_id, prompt_id)`
  again. Added `consents.method` (required on every wire row,
  `consentRecordSchema.method`, previously had no column at all) and made
  `consents.granted_at` `NOT NULL` (a revoked row keeps its original grant
  time). Fixed the leftover `prompt_packs`/`prompts` count comment to
  reference the new `pack_prompts` table. Fixed a flag-count off-by-one
  (13 keys, not 12).
- **2026-09-03 (v3.1, self-correction after an adversarial verification
  pass):** The v3 pass below over-corrected pack-sourced prompt ids to
  `UUID`. Fixed: `prompts` is daily-only now; a new `pack_prompts` table
  holds pack-sourced prompts with a **computed, non-UUID** wire id
  (`pack-{pack_id}-{ordinal}`), matching `packPromptSchema.id` (`z.string()`)
  and this folder's own `api-contract-draft.md` example. Also fixed:
  `reactions.kind`'s `CHECK` now lists the real three-value set
  (`heart | smile | star`) instead of a leftover five-emoji list. Also
  decided the previously-open `invites.expires_at` vs. `expiresAt`
  question by dropping `expiresAt` from the API response entirely --
  **reverted in v3.3**, see below: the field is required in
  `packages/contracts` today and dropping it now breaks the app.
- **2026-09-03 (v3):** Reconciled against `packages/contracts` per Pankaj's
  PR #2 review. `users` gains `avatar_key` and `email_verified`.
  **Reinstated `reports` / `blocks` / `moderation_queue`** (Apple 1.2 / Play
  UGC -- cutting these was flagged as a store-blocking issue, not an MVP
  trim). Compositions split out of `submissions` into their own `artifacts`
  + `artifact_sources` tables (an artifact is not a submission -- see
  `entities/artifact.ts`); `submissions.kind` dropped along with it. Added
  `submissions.superseded_by` so an explicit redraw
  (`canvas.allow_edit_draw`) can replace today's row while keeping full
  revision history. `consents.kind` split `crash_diagnostics` from
  `log_shipping` and renamed `third_party_processing` to `third_party_ai`.
  `prompt_packs.id` changed from a slug `TEXT` to `UUID` (this part held up
  -- `promptPackSchema.id` really is `z.uuid()`). `reactions` dropped its
  `channel_id` scoping -- the app reacts per submission, not per wall-copy.
- **2026-09-03 (v2):** `GET /me/stats` added to the API contract with no
  schema change -- unaffected by this revision, still fully derived from
  `submissions` at read time.
- **2026-09-02 (3rd pass):** `submissions.kind` ('daily' | 'composition')
  added -- **reverted in v3**; compositions are `artifacts` now, not a
  `submissions` variant. `prompt_packs` made table-backed -- kept.
- **2026-09-02 (2nd pass):** Cut `reports` / `blocks` / `moderation_queue`
  -- **reinstated in v3**, they were cut in error (see above). Added
  `comments`, voice-note + enhancement/composition columns, `wall_prompts`,
  `channels.is_public`, `prompts` `source`/`pack_id`.
- **2026-09-02 (1st pass):** No more submission edits ever
  (`submission_revisions` removed) -- **partially reverted in v3**: redraw
  is back as an explicit `replacesSubmissionId` flow, modeled via
  `superseded_by` rather than a separate revisions table, so unlock stays
  singular per prompt day while history survives. Reactions scoped per wall
  -- **reverted in v3**, back to per-submission. Invite links no longer
  expire -- kept, though the API contract's `expiresAt` field is flagged as
  an open inconsistency with this.
- **2026-08-27:** Account deletion is soft by default; hard purge is a
  separate operation -- **tightened in v3**: `DELETE /me` now enqueues the
  `hard_purge` job in the same transaction as the soft delete, rather than
  leaving it as a fully separate, easy-to-forget trigger.

## How the tables relate

- A **user** belongs to many **channels** (walls) via **memberships**; every
  account gets one automatic **Personal** channel.
- A **submission** is one row per prompt day per user, answering that day's
  prompt. Redraw updates that same row in place (new
  `strokes_key`/`render_key`/etc, bumped `revision`) -- it never creates a
  second row, so the submission's id, its wall placement, and any
  reactions on it all survive a redraw unchanged.
- **submission_channels** puts one submission on several walls without
  copying the artwork.
- An **artifact** is a separate, standalone entity: several already-posted
  drawings arranged into a new picture, saved to the author's Personal
  wall. It has no prompt day and does not participate in submit-to-unlock.
  **artifact_sources** credits which submissions it was built from.
- **Reactions** hang off a submission directly (not off a wall-copy) --
  reacting to a drawing reacts to it everywhere it's visible, matching the
  app's single `PUT /submissions/{id}/reactions`.
- **Consents** is compliance substrate built in from the start (register
  7.3). **Reports / blocks / moderation_queue** are in scope for MVP (Apple
  1.2 / Play UGC) -- not cut.

Two rules are enforced **in the schema**, not just in app code:

1. **Submit-to-unlock:** `UNIQUE (user_id, prompt_id)` on `submissions`.
   Exactly one row per user per prompt day, redraw or not -- an artifact
   can never collide with this, since it isn't in this table.
2. **Soft delete, hard purge queued in the same call:** `DELETE /me` sets
   `users.deleted_at` **and** inserts an `account_jobs` row of kind
   `hard_purge` in one transaction. The `ON DELETE CASCADE`s below exist for
   that purge job to walk, not for the everyday delete button to fire
   directly.

---

## Tables

### `users`
```sql
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_provider   TEXT NOT NULL DEFAULT 'local',   -- 'local' | 'cognito'
  identity_subject    TEXT NOT NULL,                    -- external id in whichever provider
  email               TEXT UNIQUE NOT NULL,
  display_name        TEXT NOT NULL,
  email_verified      BOOLEAN NOT NULL DEFAULT false,
  avatar_key          TEXT,                 -- object storage key, avatars/{userId}/{uuid}.png; NULL = no avatar
  birth_date          DATE,
  account_class       TEXT NOT NULL DEFAULT 'unknown',  -- 'adult' | 'minor' | 'unknown'
  account_pending_consent BOOLEAN NOT NULL DEFAULT false,
  deleted_at          TIMESTAMPTZ,          -- soft delete: set by DELETE /me; row is otherwise untouched
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (identity_provider, identity_subject)
);

CREATE INDEX idx_users_account_class ON users(account_class);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;
```
- `display_name` is `NOT NULL`: `signUpRequestSchema.displayName` is
  required, shown on the dashboard greeting.
- `email_verified`: drives whether app restore sends the caller to
  `VerifyEmailScreen` (`userSchema.emailVerified`).
- `avatar_key`: the object a presigned `kind: "avatar"` upload writes to;
  `PUT /me/avatar` commits the key here. `NULL` renders an initial, not a
  broken image.
- `account_class` derives from `birth_date` at signup (age gate, register
  7.1). Under the current product decision (Option A), a `minor` result
  never completes signup -- there is no minor row with
  `account_pending_consent = true` sitting active in practice, though the
  column stays for the pending-ADR future where that changes.
- `deleted_at`: once set, the channel-isolation auth module (register 4.2)
  hides this account's content everywhere. `email` stays permanently unique
  so it can't be reused until the paired hard-purge job completes.

### `channels`
```sql
CREATE TABLE channels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        TEXT NOT NULL DEFAULT 'custom',   -- 'personal' | 'family' | 'friends' | 'coworkers' | 'custom' | ...
  name        TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_channels_one_personal_per_owner
  ON channels(created_by) WHERE kind = 'personal';
```
- `kind` is **data, not an enum** (`constants/channels.ts`): four seeded
  values (`personal`, plus `family`/`friends`/`coworkers` as recommended
  defaults) at signup, `custom` for anything created later via
  `POST /channels`. No `CHECK` constraint on purpose -- adding a kind is a
  row, not a migration.
- Partial index guarantees exactly one Personal wall per account. No cap on
  other channels.
- `ON DELETE CASCADE` on `created_by` only matters for the hard-purge job
  (every account owns its Personal channel); soft delete never triggers it.
- No `is_public` column: `channelSchema` doesn't expose one today, and
  public-wall read authorization is undecided (see the API doc's "Still
  open" section). Add it back only when that's resolved.

### `memberships`
```sql
CREATE TABLE memberships (
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel_id    UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member',   -- 'owner' | 'member'
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ,   -- NULL = never opened this wall
  PRIMARY KEY (user_id, channel_id)
);

CREATE INDEX idx_memberships_user ON memberships(user_id);
```
- The table channel isolation (register 4.2) authorizes against. Personal
  channel + owning membership are created in the same transaction as the
  user.
- Creating any channel also inserts the creator's membership as
  `role = 'owner'`; `GET /channels/{id}/members`'s `isCreator` field is
  `role = 'owner'` on this table, not a separate flag. "At least one owner
  per channel" is an app-layer rule, not a DB constraint.
- `last_seen_at` backs a future `POST /channels/{id}/seen` (sets it to
  `now()`) and a future `has_new_activity` field on `GET /channels`.
  **Not wired to any endpoint in `@scribl/mock-server` today** -- the
  column is forward-looking, matching the API doc's note that this
  endpoint isn't implemented yet.

### `prompt_packs`
```sql
CREATE TABLE prompt_packs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
`promptPackSchema.id` is a UUID, not a slug -- changed from the prior draft's
`workplace-check-in`-style text id. `promptCount` in the API response is
computed (`COUNT(*) FROM pack_prompts WHERE pack_id = ...`, the table
below), not stored here -- `prompts` is daily-only as of the `pack_prompts`
split and has no `pack_id` to count against.

### `prompts`
```sql
CREATE TABLE prompts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_date  DATE NOT NULL,
  text         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'approved',  -- 'draft' | 'approved'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_prompts_daily_date ON prompts(prompt_date);
```
**Daily prompts only.** `id` is a `UUID`, matching `promptSchema.id` on the
wire. Seeded by editors, never generated at request time. Pack-sourced
prompts are a **separate table** below, not a `source`/`pack_id` branch on
this one -- see the correction note in this file's changelog.

### `pack_prompts`
```sql
CREATE TABLE pack_prompts (
  pack_id  UUID NOT NULL REFERENCES prompt_packs(id) ON DELETE CASCADE,
  ordinal  INTEGER NOT NULL,
  text     TEXT NOT NULL,
  PRIMARY KEY (pack_id, ordinal)
);
```
**Not `UUID`-keyed.** `packPromptSchema.id` in `entities/prompt-pack.ts` is
`z.string().min(1)`, documented there as "composite and stable, e.g.
`pack-<packId>-<index>` -- never a fresh uuid per read." This table matches
that: the wire id is **computed** as `pack-{pack_id}-{ordinal}` from
`(pack_id, ordinal)`, not stored as its own column. An earlier pass of this
draft wrongly typed pack-sourced prompts as `UUID` inside the `prompts`
table above -- that was a genuine error, corrected here, and it also
contradicted `api-contract-draft.md`'s own example
(`"id": "pack-3e6a1f2b-0"`).

`packPromptIds` in `POST /channels/{id}/prompt-packs`'s `kind: "pack"`
branch are these computed ids, resolved back to `(pack_id, ordinal)` pairs
server-side.

### `wall_prompts`
```sql
CREATE TABLE wall_prompts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id    UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  prompt_text   TEXT NOT NULL,   -- copied at injection time: covers both pack-sourced and free-typed custom text
  pack_id       UUID REFERENCES prompt_packs(id),   -- NULL for a custom-text injection
  injected_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  injected_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wall_prompts_channel ON wall_prompts(channel_id, injected_at DESC);
```
Backs `POST /channels/{id}/prompt-packs` and
`GET /channels/{id}/prompt-packs/injected`. `prompt_text` is stored
directly (copied at injection time) rather than only referencing `prompts`,
because `applyPromptPackRequestSchema`'s `kind: "custom"` branch injects
free-typed text that was never a `prompts` row at all -- a pure FK to
`prompts` can't represent that branch. `injected_by` is `SET NULL`: the
wall's prompt history belongs to the channel, not the injector.

### `submissions`
```sql
CREATE TABLE submissions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id             UUID NOT NULL REFERENCES prompts(id),
  render_key            TEXT NOT NULL,   -- object storage key, the rendered image
  thumb_key             TEXT NOT NULL,   -- object storage key, server-generated thumbnail
  strokes_key           TEXT NOT NULL,   -- object storage key, the versioned stroke document
  cutout_key            TEXT,            -- object storage key, ink-only PNG for compose stickers; absent pre-cutouts
  stroke_schema_version INTEGER NOT NULL,
  renderer_version      INTEGER NOT NULL,
  canvas_width          INTEGER NOT NULL,
  canvas_height         INTEGER NOT NULL,
  point_count           INTEGER NOT NULL,
  byte_size             INTEGER NOT NULL,
  story_text            TEXT CHECK (char_length(story_text) <= 280),
  audio_key             TEXT,   -- object storage key, the voice-note recording
  audio_mime            TEXT,
  audio_duration_ms     INTEGER,
  revision              INTEGER NOT NULL DEFAULT 1,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  CHECK (story_text IS NULL OR audio_key IS NULL)   -- a story is typed text OR a voice note, never both
);

-- One submission per user per prompt day, full stop.
CREATE UNIQUE INDEX idx_submissions_daily_unlock ON submissions(user_id, prompt_id);
```
- No more `kind` column: compositions are `artifacts` now (below), so this
  table is daily submissions only and the prior partial-unique-on-`kind`
  complication is gone.
- **Redraw** (`canvas.allow_edit_draw`, `replacesSubmissionId` on the wire):
  **updates this same row in place** -- new media keys (moved to the next
  `v{n}` segment), `revision` incremented, `id` unchanged. No new row, no
  `superseded_by` chain. The app holds exactly one submission id per
  prompt day (from `GET /prompts/today` or the create response) and has no
  concept of "which id is current" -- a second row with the old id
  superseded would 404 on `GET /submissions/{id}`, orphan the wall tile's
  `submissionId`, and strand any `reactions` rows still keyed to the old
  id after the wall had already moved on to the new one. If audit history
  of prior revisions is ever needed, version the object-storage keys (the
  `v{n}` segment already does this) -- don't change the row's identity to
  get it. `idx_submissions_daily_unlock` is therefore a plain unique index,
  no partial-`WHERE` needed, since there is only ever one row per day.
  (An earlier pass of this draft modeled redraw as a second row chained by
  `superseded_by`; that was wrong for the reason above and is reverted
  here.)
- `thumb_key`: `thumb.webp`/`thumb.png` generated server-side on upload,
  needs its own key rather than a feed-time string substitution on
  `render_key`.
- **Voice notes:** `audio_key`/`audio_mime`/`audio_duration_ms`, mutually
  exclusive with `story_text` via the `CHECK`.
- No `enhanced_render_key`/`enhancement_status`/`layout`/`background_prompt`
  columns: the AI-enhance pipeline is built but switched off
  (`ai.enhance_enabled`, default false) and not modeled in
  `packages/contracts` today; add them back if/when that flag's product
  decision changes.

### `submission_channels`
```sql
CREATE TABLE submission_channels (
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  channel_id     UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  PRIMARY KEY (submission_id, channel_id)
);

CREATE INDEX idx_subchan_channel ON submission_channels(channel_id);
```
One drawing, several walls, zero duplicate artwork (register 2.4). The
submitter's Personal channel is inserted here automatically regardless of
what `shareToChannelIds` requested.

### `artifacts`
```sql
CREATE TABLE artifacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  layout        JSONB NOT NULL,   -- compositionLayoutSchema: { items: [{ sourceSubmissionId, cx, cy, scale, rotation, z }] }
  render_key    TEXT NOT NULL,
  thumb_key     TEXT NOT NULL,
  byte_size     INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
`entities/artifact.ts`'s reasoning applies directly here: an artifact has
no prompt day, is never replaceable, and never satisfies or blocks
submit-to-unlock -- it deliberately does **not** live in `submissions`.
Always saved to the author's own Personal wall (not modeled as a
`submission_channels` row -- an artifact isn't a submission to begin with;
resolve its wall placement in application code, e.g. a parallel
`artifact_channels` row or a fixed "always Personal" rule).

### `artifact_sources`
```sql
CREATE TABLE artifact_sources (
  artifact_id     UUID NOT NULL REFERENCES artifacts(id) ON DELETE CASCADE,
  submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL,   -- paint order within the layout, mirrors layout.items[].z
  PRIMARY KEY (artifact_id, submission_id)
);

CREATE INDEX idx_artifact_sources_submission ON artifact_sources(submission_id);
```
Backs `GET /artifacts/{id}`'s `sources[]` credit list (resolved back to
`authorDisplayName`/`thumbnailUrl` via a join to `submissions` and
`users`). 2-6 rows per artifact (`COMPOSITION_MIN_SOURCES`/`MAX_SOURCES`),
enforced in the application layer, not a `CHECK` (Postgres can't count
sibling rows in a row-level constraint).

### `reactions`
```sql
CREATE TABLE reactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind           TEXT NOT NULL CHECK (kind IN ('heart', 'smile', 'star')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (submission_id, user_id, kind)
);

CREATE INDEX idx_reactions_submission ON reactions(submission_id);
```
Keyed off `submission_id` directly -- **no `channel_id` scoping**. The app
reacts to a drawing once, via a single `PUT /submissions/{id}/reactions`,
and that reaction shows up everywhere the drawing is visible; there is no
per-wall-copy isolation to model. **Self-reaction is allowed** -- there is
no application-layer block on `user_id = submissions.user_id` the way a
prior draft assumed. `kind` is the fixed three-value set from
`reactionKindSchema` (`heart | smile | star`), not the wider five-emoji set
an earlier draft used.

### `invites`
```sql
CREATE TABLE invites (
  token         TEXT PRIMARY KEY,
  inviter_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel_id    UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  expires_at    TIMESTAMPTZ,          -- NULL = never expires
  redeemed_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  redeemed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
Confirmed in scope (`code-questions.md` Q9). `expires_at` is nullable --
invite links don't expire in practice (2026-09-01 decision). Minted by
`POST /channels/{id}/invites`; `token` is the value returned there and
resolved by `GET /invites/{token}`. **`GET /invites/{token}` keeps sending
`expiresAt` on the wire** -- `resolvedInviteSchema.expiresAt` is `z.iso.datetime()`,
**required**, in `packages/contracts` today, and the app fails to parse a
resolve response without it. This column stays nullable and effectively
unused (send a sentinel/whatever the API layer resolves it to); dropping
the field from the wire is a `packages/contracts` change paired with an
app release, not something this draft can do unilaterally. See
`api-contract-draft.md`'s `GET /invites/{token}` section (v3.3) for the
same note. `redeemed_by` is
`SET NULL`: a hard purge of the redeemer shouldn't delete the inviter's
invite history.

### `consents`
```sql
CREATE TABLE consents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL CHECK (kind IN ('terms', 'privacy', 'crash_diagnostics', 'log_shipping', 'third_party_ai', 'parental')),
  version      TEXT NOT NULL,
  method       TEXT NOT NULL CHECK (method IN ('self', 'stub', 'payment_instrument', 'signed_form', 'video', 'knowledge_based')),
  granted_at   TIMESTAMPTZ NOT NULL,
  revoked_at   TIMESTAMPTZ,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,   -- who performed the action, may differ from user_id for parental consent
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_consents_user ON consents(user_id, kind);
```
`kind` split `crash_diagnostics` from `log_shipping` (Apple 5.1.2(i) vs.
device-log shipping are different gates a Settings toggle needs to control
independently) and renamed `third_party_processing` to `third_party_ai`
(`entities/consent.ts`). A kind with no row for a user means "not yet
granted" -- `GET /me/consents` simply omits it, it does not return a row
with `granted_at: null`. `actor_user_id` is `SET NULL` so a later-purged
parent doesn't retroactively delete their child's own record.

`method` (added) is required on every row: `consentRecordSchema.method` is
always present on the wire (`"self"` for an ordinary Settings toggle,
`"stub"`/`"payment_instrument"`/`"signed_form"`/`"video"`/
`"knowledge_based"` for the parental-consent methods pending ADR), and
without a column Nest has nowhere to read it from or write it to.

`granted_at` is `NOT NULL` (changed from nullable): a **revoked** row
still keeps the timestamp of when it was originally granted -- `revoked_at`
is what flips `isConsentActive()` to false, `granted_at` never goes away.
Since an ungranted kind is simply absent from the table (see above), there
was never a real row that needed `granted_at` to be null in the first
place.

### `reports`
```sql
CREATE TABLE reports (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  reporter_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason         TEXT NOT NULL CHECK (reason IN ('inappropriate', 'harassment', 'spam', 'other')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_submission ON reports(submission_id);
```
**Reinstated.** Backs `POST /reports`. Cutting this table in the 2026-09-02
pass conflicted with the shipping app (`ReportContentButton`) and with
Apple 1.2 / Play UGC requirements -- not optional for an app that lets
people post to shared walls.

### `blocks`
```sql
CREATE TABLE blocks (
  blocker_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);
```
**Reinstated.** Backs `POST /blocks` (`BlockUserButton` on the members
roster). Must be read by the **same authorization choke point** that
enforces channel isolation, so a blocked user disappears from each other's
walls rather than needing a second, separately-maintained check.

### `moderation_queue`
```sql
CREATE TABLE moderation_queue (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  report_id      UUID REFERENCES reports(id) ON DELETE SET NULL,
  status         TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'reviewed' | 'actioned'
  reviewed_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_moderation_queue_submission ON moderation_queue(submission_id);
```
**Reinstated.** Human moderation queue fed by `reports`; an automated
moderation layer stays out of band regardless (see the API doc's
"Deliberately out of scope" section).

### `feature_flag_overrides` and `feature_flag_audit`
```sql
CREATE TABLE feature_flag_overrides (
  flag_key     TEXT NOT NULL,
  environment  TEXT NOT NULL,   -- 'dev' | 'staging' | 'prod'
  value_json   JSONB NOT NULL,
  updated_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (flag_key, environment)
);

CREATE TABLE feature_flag_audit (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key          TEXT NOT NULL,
  environment       TEXT NOT NULL,
  previous_value    JSONB,
  new_value         JSONB,
  changed_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  changed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
`flag_key` should track the 13 keys in `packages/contracts/src/flags.ts`
(`canvas.full_toolset`, `canvas.allow_edit_draw`, `ai.enhance_enabled`,
`story.voice_enabled`, `invite.hosted_landing`, `story.char_limit`,
`auth.mfa_enabled`, `auth.biometric_unlock`, `diagnostics.crash_reporting`,
`diagnostics.log_shipping`, `diagnostics.log_level`,
`diagnostics.log_buffer_entries`, `diagnostics.log_buffer_bytes`) -- up
from the six a prior draft's example covered. Declarations themselves stay
in code; this is per-environment configuration + audit trail, required
since several flags gate COPPA-relevant behavior.

### `idempotency_keys`
```sql
CREATE TABLE idempotency_keys (
  key            TEXT PRIMARY KEY,
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint       TEXT NOT NULL,
  status_code    INTEGER NOT NULL,
  response_body  JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_idempotency_created_at ON idempotency_keys(created_at);
```
`POST /submissions` and `POST /artifacts` carry `idempotencyKey` in the
request **body** (not a header) and this table is exactly what makes their
`deduplicated: true` response possible on replay: a key hit returns the
stored response instead of repeating the insert. Pruned by TTL, not kept
forever.

### `account_jobs`
```sql
CREATE TABLE account_jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL CHECK (kind IN ('export', 'hard_purge')),
  status        TEXT NOT NULL DEFAULT 'processing',  -- 'processing' | 'complete' | 'failed'
  result_key    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

CREATE INDEX idx_account_jobs_user ON account_jobs(user_id, kind);
```
Backs `POST /me/export` + `GET /me/export/{requestId}` (kind `export`) and
the `hard_purge` job that `DELETE /me` now enqueues directly (see the
changelog and the "how the tables relate" note above -- this is the one
behavior change from the prior soft-delete-only framing). No `soft_delete`
kind -- that's a synchronous `UPDATE` on `users`, not a job.

---

## Indexes, and what they back

| Index | Backs |
|---|---|
| `prompts.prompt_date` (unique) | `GET /prompts/today`, `GET /prompts/{date}` |
| `pack_prompts` PK `(pack_id, ordinal)` | `GET /prompt-packs/{packId}` prompt listing |
| `wall_prompts(channel_id, injected_at DESC)` | `GET /channels/{id}/prompt-packs/injected` |
| `submissions(user_id, prompt_id)` (unique) | `GET /prompts/today`'s submitted branch, submit-to-unlock |
| `memberships.user_id` | `GET /channels` |
| `submission_channels.channel_id` | `GET /channels/{id}/wall` |
| `reactions.submission_id` | `GET /submissions/{id}` reaction counts, wall-tile `heartCount`/`heartedByMe` |
| `artifact_sources.submission_id` | Resolving which artifacts a given drawing was used in |
| `consents(user_id, kind)` | `GET /me/consents` |
| `reports.submission_id` | Moderation queue triage |
| `users.account_class` | Age-gated feature checks |
| `users.deleted_at` (partial: `IS NOT NULL`) | Hard-purge sweeps, admin tooling |
| `idempotency_keys.key` (PK) | Replay lookup on `POST /submissions` / `POST /artifacts` |
| `account_jobs(user_id, kind)` | `GET /me/export/{requestId}` status; hard-purge job status |

**Feed query note.** `GET /channels/{id}/wall` joins
`submission_channels -> submissions`, ordered by `submissions.created_at`,
plus a union with `artifacts` for the Personal wall (compositions are
saved there, ahead of the day's own scribl, but are not shared to a prompt
day the way a submission is). Fine at this scale; denormalize before
rethinking the schema if the join ever needs to go.

---

## Seed data needed from day one

- **The curated daily prompt set** (`prompts`, UUID-keyed) and any
  starter **prompt packs** (`prompt_packs` + `pack_prompts`, the latter
  keyed by `(pack_id, ordinal)`, not a UUID).
- **A pre-seeded reviewer/demo account** with at least one submission and
  visible wall content -- submit-to-unlock otherwise leaves a fresh
  account's wall empty, and a store reviewer will reject an
  apparently-empty build (register 7.5).
- **Default channels**: Personal is automatic; Family/Friends/Coworkers are
  recommended defaults (Q29), created by the app, not hardcoded here.

---

## Deliberately not in this schema

- **Streaks / milestones.** Derived from `submissions` at read time
  (`GET /me/stats`, api-contract-draft.md) -- no table needed.
- **Push device tokens.** Would be a `push_tokens` table when funded.
- **Analytics events.** Never this database -- a separate pipeline
  (register 8), so the operational store never serves analytical joins.
- **Automated moderation verdicts.** Out of band regardless of the
  `moderation_queue` table existing for human review.
- **AI-enhance pipeline columns on `submissions`.** The pipeline is built
  but switched off (`ai.enhance_enabled`) and not modeled in
  `packages/contracts` today; add `enhanced_render_key` /
  `enhancement_status` back if that changes.
- **`comments`.** Not modeled anywhere in `packages/contracts` today; see
  the API doc's "Not needed by current mobile" section.

---

## Closing the Aurora gate (E00-F11)

Already closed (decision-register.md 10b, entry 2.3). Reasoning: the data
is relational, access patterns are joins (person, wall, membership,
prompt, submission, and a join table putting one submission on several
walls), and a relational engine gives the key invariants for free -- worth
the extra operational surface versus a document store.

---

## Sources

Primary, checked source of truth:
[`ScriblOrg/scribl-mobile-app`](https://github.com/ScriblOrg/scribl-mobile-app)
`packages/contracts/src/**` -- every column above traces back to a field
on the Zod entity it stores, cross-referenced against
`packages/mock-server/src/routes.ts` for what's actually exercised
end-to-end today (that repo's own Prisma schema has none of these tables
yet -- this remains a target design, not a description of shipped
Postgres).

Also `meta-scribl-app/handbook/engineering/decision-register.md` sections
2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 7.1, 7.2, 7.3, 7.5, 10b; `code-questions.md`
Q9, Q29, Q32; `feature-flags.md` sections 8, 9, 10; and the 2026-08-26 /
2026-09-01 standups, for product decisions not visible in code.

This v3 revision exists because the v2 draft cut `reports`/`blocks`/
`moderation_queue` and modeled compositions as a `submissions.kind`
variant, both of which conflict with the shipping app -- see Pankaj
Aggarwal's review on PR #2 (2026-09-03), which is the record of that
conflict and the basis for every change above.

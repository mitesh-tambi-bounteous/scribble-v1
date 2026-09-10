# Feature flags

No paid flagging platform is chosen, and one may never be. So the decision is
not "which vendor" but "how do we make the vendor a detail." One interface, a
typed registry, and adapters behind it.

This is the same adapter-with-local-default pattern the rest of the scaffold
uses for auth, media, telemetry and crash reporting. If it looks familiar, that
is the point.

---

## 1. What a flag is for here

Four distinct jobs, and conflating them is how flag systems rot:

| Kind | Purpose | Lifetime | Example |
|---|---|---|---|
| **Release** | Ship code dark, turn it on when ready | Weeks. Delete after rollout | The invite flow before the landing page is hosted |
| **Kill switch** | Turn a broken thing off in production without a release | Permanent | Disable the AI-enhance pipeline, disable voice upload |
| **Config** | A value, not a boolean | Permanent | Story character cap, thumbnail size |
| **Experiment** | Compare variants | Weeks. Delete after the decision | Not in this phase, but the interface should not preclude it |

Every flag declares which kind it is. A release flag with no removal date becomes
permanent debt; a kill switch deleted after rollout removes the ability to
respond to an incident. They are not interchangeable.

---

## 2. Three rules that are not negotiable

**A flag must never gate an authorization decision or a product invariant.**
Submit-to-unlock and channel isolation are not flaggable. Not "flagged on by
default", not "flag defaults to secure" -- not reachable from the flag system at
all. A privacy invariant that a misconfiguration can switch off is a privacy
incident with a delay on it. Enforce this with a test asserting no module under
`backend/src/authz/` imports the flag client.

**Every flag declares its unreachable-provider default, and risky flags fail
closed.** When the provider is down, an unknown flag is not `false` by accident;
it is whatever the registry says. Anything touching minors, consent, moderation
or payment fails closed. Cosmetic flags may fail open so an outage does not
blank the UI.

**Evaluate server-side. The client receives answers, not rules.** The client
sends its context and gets back a resolved set. It never receives the targeting
rules. Three reasons, and the second is the one that matters here: rules may
reference data the client should not hold; **`account_class` is a targeting
dimension now that under-13 is in scope, and shipping targeting logic about
children to a device is a bad idea**; and a client that only sees answers cannot
flip a gate by editing local state.

---

## 3. The interface

One interface, in `packages/contracts`, so app and backend share it.

```
isEnabled(key, context?) -> boolean
getValue(key, context?)  -> string | number | boolean
getVariant(key, context?) -> string | null      // for later experiments
snapshot(context?)       -> Record<key, value>  // one round trip at startup
onChange(callback)       -> unsubscribe          // live updates, optional
ready()                  -> Promise<void>
```

`snapshot` matters more than it looks: without it every flag read is a network
call, and the first screen makes twenty. Fetch once, read synchronously.

`onChange` is optional per adapter. The static adapter never fires it. Callers
must work correctly if it never fires.

---

## 4. The registry: flags are declared, never invented

A single typed registry in `packages/contracts/flags.ts`. **No free-string
lookups anywhere.** `isEnabled('some_key')` with an undeclared key is a compile
error, not a silent `false`.

Every entry carries:

| Field | Why |
|---|---|
| `key` | Stable, snake_case, namespaced by area |
| `kind` | release, kill_switch, config, experiment |
| `description` | What it does, in a sentence |
| `default` | The value when no provider answers |
| `failMode` | closed or open, and why |
| `owner` | A person, not a team |
| `removeBy` | A date for release and experiment flags. Absent only for kill switches and config |
| `scope` | client, server, or both |

`removeBy` is the anti-rot mechanism. A CI check warns on any release or
experiment flag past its date. Nobody deletes a flag they are afraid of, so make
the fear visible and dated.

---

## 5. Adapters

**`static`, the default.** Values from the compiled registry defaults, with an
optional local override file for development. Zero dependencies, zero network,
works offline, deterministic in tests. This is what runs in dev and CI unless
told otherwise.

**`api`, ours.** The backend exposes `GET /flags`, evaluating the registry
against the authenticated caller and returning the resolved snapshot. Rules live
in the database, editable without a release. This is the "custom API" path, and
it is the one to build after `static`.

Requirements on the `api` adapter:

- Short-TTL cached response, with the **last known good snapshot persisted** so a
  cold start on a bad network uses yesterday's answers rather than falling to
  defaults and visibly changing the app.
- **Never blocks app startup.** Hydrate from cache, refresh in the background.
  A flag fetch on the critical path is a blank screen waiting to happen.
- An ETag or version so an unchanged snapshot is a cheap request.
- Flag reads are not logged per call. Aggregate if evaluation telemetry is ever
  wanted; per-read logging on a hot path is a self-inflicted cost.

**`vendor`, later and hypothetical.** Whichever platform gets chosen implements
the same interface and nothing above the interface changes. Build this only when
there is a reason, and record the reason.

---

## 6. Runtime flags versus build-time flags

These are different mechanisms and the POC blurred them. Keep them apart.

**Build-time**, an environment variable inlined at bundle time. Use for things
that must not exist in a production binary: debug menus, mock adapters, test
seams. It cannot be changed without a release, and that is the point.

**Runtime**, the flag provider. Use for anything a human might want to change
without shipping a new build.

The POC implemented `EXPO_PUBLIC_AI_ENABLED` and `EXPO_PUBLIC_FULL_TOOLSET` as
build-time env vars. Both are conceptually runtime kill switches, and they were
build-time out of expedience. **In the rebuild they are runtime flags**, because
"turn the AI pipeline off" was a real request the client made once already and
answering it should not require an App Store release cycle.

Rule of thumb: if you would ever want to change it during an incident, it is a
runtime flag.

---

## 7. Client behaviour

**No flicker.** A flag-dependent screen resolves before first paint or renders a
stable placeholder. Do not render the off state and then flip. Flags hydrate from
cache during the same startup window that resolves fonts and session, and the
router does not mount until it settles.

**Read through a hook, never the client directly.** `useFlag('key')` and
`useFlagValue('key')`. Components do not import the flag client, exactly as they
do not import the HTTP client. One lint rule covers both.

**Flags are not app state.** They live in the same query cache as other server
data, not in Zustand. They are fetched, cached and refreshed, which is precisely
what the cache is for.

**Deleting a flag is a code change, and the compiler helps.** Because keys are
typed, removing a registry entry surfaces every call site. That is the payoff for
refusing free strings.

---

## 8. Server behaviour

- Evaluation is a pure function of (registry, rules, context). Pure means
  testable, and flag bugs are miserable to debug otherwise.
- The context is built **server-side from the verified token subject**, never
  from a client-supplied body. A client that can assert its own targeting context
  can target itself into any cohort.
- **Flag changes are audited**: who, what, when, previous value. Some flags will
  gate COPPA-relevant behaviour, and "who turned that off" needs an answer.
- Changing a flag is a privileged operation behind the same authorization module
  as everything else.

---

## 9. Environments

Flag state is per environment, and the values differ deliberately: dev is
permissive so the team can see unfinished work; staging matches production so a
demo is representative; production is conservative.

Two consequences for the pipeline, covered in `ci-cd.md`:

- **Flag configuration is not a deploy artifact.** It lives in the database per
  environment. A deploy does not overwrite production flags with a developer's
  values, and a rollback does not silently revert them.
- **The registry is code and does ship with the deploy.** So a new flag exists,
  with its default, from the moment the code lands. Adding a flag is a pull
  request; changing its value is not.

---

## 10. Starting set

Enough to prove the seam without inventing product decisions. Everything else
gets added when a feature needs it.

| Key | Kind | Default | Fail | Why |
|---|---|---|---|---|
| `canvas.full_toolset` | kill_switch | off | closed | The reduced six-ink set is the product. This restores the full set for a future wall type |
| `canvas.allow_edit_draw` | release | **on** | closed | ALLOW_EDIT_DRAW. Redraw a prompt already answered; that submit replaces today's scribl instead of adding one. A development affordance — the canvas is otherwise unreachable for the rest of the day once you have drawn. Remove by 2026-12-31 |
| `ai.enhance_enabled` | kill_switch | off | closed | Built, demonstrated, switched off at the client's request. Stays reachable, stays off |
| `story.voice_enabled` | release | off | closed | Voice is unresolved. The flag lets the path land dark rather than sitting on a branch |
| `invite.hosted_landing` | release | off | closed | Turn on when the landing page is actually hosted |
| `story.char_limit` | config | 280 | open | The client's frames say 280 and the POC said 80. Make it a value, not a constant |
| `diagnostics.crash_reporting` | kill_switch | off | closed | Gated on consent. **The consent record is authoritative, not this flag**: the flag can only turn collection off, never on without consent |

`canvas.allow_edit_draw` is the first flag whose **server** half carries the
behaviour rather than the visibility. The client sends
`replacesSubmissionId` on `POST /submissions`; the backend replaces only when
the flag is on, the named submission belongs to the caller, and it belongs to
the current prompt day. Gating this in the UI alone would mean the replace path
is protected by a hidden button, which is not a gate. Note that a replaced
scribl is still a scribl, so submit-to-unlock never observes a difference — the
flag gates a feature, not an invariant.

That last row is the important one. A flag must not be able to override a consent
decision. Consent is a stored fact about a person; a flag is an operational
control. Where they disagree, consent wins, and the code should make the other
outcome impossible rather than merely unlikely.

---

## 11. What is deliberately not built

- No experiment or A/B engine. The interface leaves room for `getVariant` and
  nothing implements it.
- No percentage rollouts in the first cut. Add them to the `api` adapter when a
  rollout actually needs staging.
- No client-side rule evaluation, ever. See section 2.
- No vendor integration until there is a named reason to pay for one.
- No flag on any authorization path. See section 2.

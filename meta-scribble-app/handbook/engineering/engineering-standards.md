# Engineering standards

What "production grade" means on this project, concretely enough to check.

Structure and module boundaries are in `architecture.md`. This document is
about the code inside those boundaries: how it is written, how it is proven, and
how it is kept secure enough to pass a store review without a scramble.

---

## 1. Design principles, with their failure modes

Naming a principle is easy. Every one below is misapplied more often than it is
ignored, so each comes with the way it goes wrong here.

### DRY: remove duplicated *knowledge*, not duplicated *lines*

Two blocks that look alike but change for different reasons are not duplication,
and merging them couples two things that wanted to move apart. The onboarding
canvas and the daily canvas will look similar and will diverge.

**The test:** if a rule changes, must both places change? Then it is one piece of
knowledge; extract it. If only one changes, leave them alone.

**Rule of three.** Two occurrences is a coincidence. Abstract on the third, when
you can see what actually varies. The premature abstraction built from two
examples is nearly always the wrong shape.

### KISS and YAGNI: no machinery for a requirement nobody has

No configuration option with one caller. No generic when a concrete works. No
event bus for two components that could take a prop.

**The honest exception, stated because this project is full of it.** The scaffold
deliberately builds seams ahead of need: auth, media, telemetry, crash
reporting, feature flags. That looks like a YAGNI violation and is not, on one
condition: **each seam exists because retrofitting it is proven expensive, and
each has an ADR saying so.** A provider swap behind an interface is a day; a
provider swap threaded through forty call sites is a sprint.

Everything without that written justification gets YAGNI applied without mercy.
"We might need it" is not a reason. "Here is what it costs to add later, and it
is more than now" is.

### Single responsibility, at the module level

A module has one reason to change. The practical tell is the sentence describing
it: if it needs an "and", split it.

Applies hardest to the layers in `architecture.md`. A route that also
contains business logic has two reasons to change and will be edited by two
people for two purposes in the same sprint.

### Dependency inversion, which is what the seams are

Business logic depends on an interface; the adapter depends on the interface too.
Services are constructor-injected or factory-provided, never reaching for a
concrete import. The payoff is not theoretical: it is why tests substitute a fake
media adapter instead of mocking a module path, and why the flag provider can
change without touching a call site.

### Make illegal states unrepresentable

The most valuable principle on this codebase, because it converts whole classes
of bug into compile errors.

- Session state is a discriminated union of `restoring`, `locked`,
  `authenticated`, `anonymous`. **Not** a `user` plus two booleans, which permits
  `loading && authenticated` and produces the login-screen flash.
- A submission is either draft or submitted, with different shapes. Not one shape
  with six optional fields.
- Fetch state comes from the query cache, not hand-rolled `isLoading` and
  `error` booleans that can both be true.

If a comment says "this can't happen", the type is wrong.

### Fail loudly, at the boundary

Validate at the edge, once, with a schema, then trust the value inward. No
defensive re-checking three layers deep, which hides where the real contract is.

No silent catch. A caught error is handled, rethrown as a typed domain error, or
logged with enough context to act on. `catch {}` is a bug with a comment
attached.

---

## 2. TypeScript

Strict mode, and the strictness is the point rather than a formality.

**Banned outright, enforced by lint:**

- `any`, including implicit. If a type is genuinely unknown, `unknown` and narrow.
- Non-null assertion `!`. If it cannot be null, the type should say so; if it
  can, handle it.
- `as` casts that change meaning. Casting to satisfy the compiler removes the one
  check that would have caught the bug. Type guards or schema parsing instead.
- `@ts-ignore`. `@ts-expect-error` with a one-line reason is acceptable and rare.

**Required:**

- Explicit return types on exported functions. Inference is fine internally;
  an exported signature is a contract and should be written down.
- Discriminated unions over optional-field bags.
- Exhaustive switches, with a `never` check in the default so adding a variant
  becomes a compile error at every site that must handle it.
- `readonly` on arrays and object types that are not meant to be mutated.
- Schema validation at every external boundary: HTTP bodies, deep-link payloads,
  environment variables, flag snapshots. **Parse, do not cast.** The parsed type
  is the source of truth, not a hand-written interface hoping to match.

---

## 3. Error handling

- **Typed domain errors**, mapped to HTTP status in exactly one place. A route
  never builds an error response by hand.
- **Never leak internals to a client:** no stack traces, no SQL, no internal ids,
  no vendor error text. Log the detail, return a correlation id.
- **Every async path has a defined failure.** If a fetch fails, the screen shows
  something a person can act on. No infinite spinner, no blank screen.
- **Error boundary per route group**, so one broken screen is not a broken app.
- **Idempotency on anything a mobile client retries.** Submit carries a key;
  two deliveries create one row.

---

## 4. Testing

Tests are graded by what they prevent, not by coverage percentage.

**The tiers, highest value first:**

1. **Invariant tests.** Submit-to-unlock cannot be bypassed. Channel A never
   leaks into channel B. A minor's diagnostics stay off without consent. No authz
   module imports the flag client. **These are launch gates and are written
   first**, before the features they guard.
2. **Contract tests.** The app and the backend agree on every endpoint shape,
   asserted against `packages/contracts`. This is what stops the mock and the
   real API drifting apart once both exist.
3. **Unit tests on pure logic.** `lib/` and `selectors/` should be near-fully
   covered, because they are cheap to test and the tests stay true.
4. **Integration tests** on service plus repository against a real local
   Postgres. Not mocked SQL: a mocked query proves the mock works.
5. **Component tests** on behaviour, not markup. Assert what a user can see and
   do. A snapshot of a component tree tests nothing and breaks on every restyle.
6. **End-to-end**, thin and few, on the daily loop only. E2E is the slowest and
   flakiest tier; use it for the path that must never break.

**Standards:**

- Test names state the behaviour: `refuses a channel read before submit`, not
  `test submit 2`.
- Substitute adapters; do not mock module paths. If a test needs
  `jest.mock('../../../services/media')`, the dependency should have been
  injected.
- No test depends on another test, on execution order, or on wall-clock time.
  Inject the clock.
- A flaky test is fixed or deleted the day it is found. A quarantined flaky test
  that stays quarantined is a lie about coverage.
- Coverage thresholds are set per tier once the shape is real, not as one global
  number. The team's coverage bar is an open question with three candidate
  answers on record; do not invent a fourth.

---

## 5. Mobile application security

Distinct from the store metadata in `release-readiness.md`. This is code.

### The bundle is public

**Anything shipped in the app binary is readable by anyone who wants it.** Not
obscure, not hard: readable. This is the single most commonly violated rule in
mobile work.

- **No secret, key, token or credential in the app**, ever. No API keys with any
  privilege, no signing secrets, no database strings.
- `EXPO_PUBLIC_*` variables are inlined at build time and are **public by
  definition**. Never put anything sensitive behind that prefix, and treat the
  prefix as a label meaning "the world may read this".
- Anything privileged happens server-side, behind an authenticated call.
- **Secret scanning in CI and as a pre-commit hook.** A leaked key in git history
  is leaked even after the fix commit.

### Credentials and data at rest

- Refresh token in the platform secure store, Keychain or Keystore. **Never**
  AsyncStorage, never a plain file, never redux-persist.
- Access token in memory only. Not persisted, not logged, not in a crash report.
- Biometrics gate the release of a stored credential. They are **not** an
  authentication factor the server trusts, and the server never accepts a
  client-asserted "biometric verified" claim.
- Nothing sensitive in the clipboard.
- No personal data, content, or image bytes in logs, telemetry or crash reports,
  enforced by the logger's type signature rather than by discipline.

### Transport

- HTTPS only. App Transport Security at its secure default, no arbitrary loads,
  no per-domain exceptions.
- Certificate pinning is **not** implemented. It breaks on rotation, is routinely
  bypassed on a rooted device, and costs more in incidents than it prevents. The
  position is recorded so nobody adds it as a reflex.
- No sensitive data in URLs or query strings. Bodies, not paths.

### Untrusted input

- **Deep links and notification payloads are untrusted.** Parse with a schema,
  never trust an id, and **authorize the destination server-side before
  rendering it.** A link that navigates straight to a wall by id is an access
  control bug with a nice UI.
- Every server boundary validates before use. Parameterized SQL only, always.

### Platform posture, decided so nobody re-litigates it

- **No WebViews.** If one ever becomes unavoidable, remote content gets no
  JavaScript bridge and the origin is allowlisted.
- **No remotely-loaded or interpreted code.** Beyond being a supply-chain risk,
  Apple guideline 2.5.2 prohibits downloading and executing code. This is a
  further reason the no-EAS-Update decision holds: over-the-air JavaScript
  replacement is exactly the mechanism that rule addresses.
- **No jailbreak or root detection.** Defeatable, adds friction for legitimate
  users, and offers little for an app whose sensitive operations are all
  server-authorized.
- **Minimum permissions.** Declare only what the shipped build exercises. An
  unused permission is a reviewer question with no good answer.
- Consider obscuring the app switcher snapshot on the authentication screen. Low
  value for a drawing app; noted so it is a decision rather than an oversight.

### Supply chain

- Lockfile committed. Installs are reproducible.
- Dependency audit in CI at an agreed severity threshold, failing the build.
- New dependencies are justified in the pull request: what it does, why not
  standard library, its licence, and its maintenance state. A transitive
  dependency count is a real cost.
- **Every new dependency is checked for an Apple privacy manifest** before it is
  added. A dependency without one can block a submission.
- Licence check in CI. Copyleft in a shipped mobile binary is a legal problem,
  not a preference.

---

## 6. Code review

- **Every change goes through a pull request.** No direct pushes to `main`. A
  green pipeline and one approval are required.
- The pipeline checks the mechanical things: format, lint, types, boundaries,
  tests, secrets, audit. **Review is for what a machine cannot judge**: is this
  the right shape, is it in the right layer, will the next person understand it.
- A pull request states what it changes and why. A diff shows what; only the
  author knows why.
- Anything touching authorization, consent, the two invariants, or the flag
  registry gets explicit attention. These are the places where a plausible-looking
  change is a serious defect.
- **Architecture changes need an ADR before the pull request**, not a paragraph
  inside it.

---

## 7. Comments and documentation

- Comment **why**, never what. The code says what it does; only a person knows
  why it does it that way.
- The comments worth writing: a non-obvious constraint, a rejected alternative
  and its reason, a link to the decision, a warning about a subtle failure.
- Delete a comment when it stops being true. A wrong comment is worse than none,
  because it is believed.
- No commented-out code. Git remembers.
- No `TODO` without an owner and a tracking reference. An anonymous `TODO` is
  litter.

---

## 8. Agent-specific rules

Most of this codebase will be written by AI agents, which changes what needs
saying explicitly.

- **Read before writing.** Find the module that owns this concern before creating
  one. State what you considered extending.
- **Do not create a directory to hold one file.**
- **Do not invent a value.** If it is not in the brain, in a decision table, or
  in an ADR, it is an open question. Add it to `code-questions.md` and stop.
- **Do not add a dependency to avoid writing ten lines.** Do not add one at all
  without the justification in section 5.
- **Report accurately.** If something is stubbed, say stubbed. If a test is
  skipped, say why. If an acceptance criterion was not met, name it. Do not
  describe a seam as a feature, and do not narrow the scope silently to make a
  report look complete.
- **Prefer a smaller diff.** A change that touches three files and does the job
  beats one that touches thirty and does it more elegantly, because the review
  that actually happens is the one that fits in a head.

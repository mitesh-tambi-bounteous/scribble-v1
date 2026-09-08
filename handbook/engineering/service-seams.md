# Service Seams

How every external dependency is wrapped so that replacing it is a day rather
than a sprint, and how the app logs in a way that serves both a human reading a
support file and a CloudWatch Logs Insights query.

`decision-register.md` section 6.1 decided the pattern: one interface, a local
adapter that is the default and needs no credentials, a cloud adapter selected by
configuration, adapters injected rather than imported. This page is that decision
made specific enough to build from.

**Read `architecture.md` section 2 first.** Everything here lives in
`src/services/`, which may import `contracts` and `lib` and must never import
React, `stores` or `features`. Nothing on this page relaxes that.

**Real-user monitoring is out of scope for this phase** (2026-08-31). No RUM SDK,
no session replay, no performance-trace vendor. Observability is the platform
floor that register section 6.4 already decided -- structured logging, one log
group per environment, alarms on error rate and service health -- plus client
crash reporting and the support-bundle path in section 5. **Section 6.4 therefore
stands unamended.** If RUM returns it is a new decision, and the seam rule in
section 1 is what makes it cheap.

---

## 1. The rule that decides where a seam's swap point goes

**A seam whose vendor might change belongs behind our own API, not behind an
in-app interface.**

An in-app interface makes a vendor swap a code change, a release build, and an
App Store review. That is two to three weeks, and it is the cost the seam was
supposed to remove. The same seam terminated at our own endpoint makes the swap a
backend deploy.

| | In-app swap | Server-side swap |
|---|---|---|
| Cost to change vendor | Code change plus store release, 1-3 weeks | Backend deploy, hours |
| AWS credentials on device | Required | None |
| Redaction passes | One, client-side | Two, client and server |
| Rate limiting | Client-side only, and the client is untrusted | At our edge |
| New third-party SDK in the binary | Yes, so a new privacy manifest and a new subprocessor | No |

**So the default is: device posts to us, we fan out.** The client seam exists to
give a typed, redacted, buffered, consent-gated call site. The vendor choice sits
in `backend/src/effects/`.

**The exception, and there is exactly one.** Crash reporting must capture native
crashes and the last moments of a dying process, which cannot be done from
JavaScript over HTTP. It runs in-process, and it is the only seam where a
diagnostics vendor is linked into the app binary.

**Push registration is the rule's clearest case, recorded 2026-08-31.** AWS SNS is
the intended provider. Creating an SNS platform endpoint is an authenticated AWS
call, so doing it from the device would need either a credential in the binary,
which is not a secret, or an unauthenticated identity pool, which section 2 names
as the signal that something is putting credentials on an untrusted client. The
device therefore gets its APNs or FCM token from the OS and posts it to
`POST /notifications/registrations`; the backend owns the endpoint, the ARN and
the topic subscription in `backend/src/effects/`. Swapping SNS is then a backend
deploy rather than a store release, and the app carries no AWS SDK. The
`apns-fcm` adapter remains for verifying the permission flow with no backend: it
registers with the OS and the token goes nowhere.

State this reasoning in each seam's ADR rather than restating the conclusion.

---

## 2. The seam catalogue

| Seam | Interface lives in | Local default | Cloud adapter | Swap point | Consent kind |
|---|---|---|---|---|---|
| `auth` | `services/auth` | `local`, signed JWTs from local API | `cognito` | In-app, unavoidable | n/a |
| `crash` | `services/crash` | `local`, writes a file plus console | `crashlytics` | **In-app (the exception)** | `crash_diagnostics` |
| `logging` | `services/logging` | `local`, pretty console plus ring buffer | `api` -> our `/diagnostics/logs` | **Server-side** | `crash_diagnostics` |
| `media` | `services/media` | `local`, filesystem | `s3` | In-app, presigned | n/a |
| `notifications` | `services/notifications` | `local`, logs a fake token | `apns-fcm`, or `sns` via our API | **Server-side for `sns`** | n/a |
| `flags` | `packages/contracts` | `static` | `api` | Server-side already | n/a |

**Deliberately absent, and each absence is a decision:**

| Not built | Why |
|---|---|
| `rum` | Out of scope this phase, 2026-08-31. Register 6.4 stands |
| `telemetry` (product analytics) | E11, ORANGE band, out of these eight weeks. **Adding it changes both stores' declarations, so it is a product decision** |
| Firebase Analytics | Not in scope. It ships inside the Firebase pods, so **verify it is not initialised** rather than assuming |
| Advertising or attribution SDK | None. See section 7 |
| An unauthenticated Cognito identity pool | Nothing on the device needs AWS credentials. If a proposal needs one, that is the signal it is putting credentials on an untrusted client |

---

## 3. What every seam must have

A seam is not "an interface somewhere". It is these seven things, and a seam
missing any of them is not done.

1. **One interface, in `services/<seam>/types.ts`.** No vendor type appears in a
   signature, including in a generic parameter or an error type. If a caller can
   name the vendor, the seam leaked.
2. **Two or more adapters, in `services/<seam>/adapters/`.** One per file, named
   for the vendor: `local.ts`, `cognito.ts`, `api.ts`.
3. **A factory, `services/<seam>/index.ts`**, reading exactly one build-time
   environment variable and returning the interface. The factory is the only
   module that imports an adapter. **The factory throws on an unrecognised value
   rather than falling back**, because a typo that silently selects the local
   adapter in a production build is a seam that reports nothing and looks fine.
4. **Injection at the composition root.** Consumers receive the interface. This is
   what lets a test substitute rather than mock a module path.
5. **A conformance suite, `services/<seam>/conformance.test.ts`**, written once
   against the interface and **run against every adapter**. Same trick as the
   mock-versus-real API contract test in scaffold deliverable 1, same reason:
   without it the local and cloud adapters drift, and the drift surfaces on first
   deploy. Highest-value test per seam.
6. **A local adapter that is genuinely useful, not a no-op.** A no-op means nobody
   exercises the path in development and the cloud path breaks the first time it
   runs.
7. **An ADR** stating what the retrofit would have cost. Register section 6.1
   grants the seams an explicit YAGNI exemption **on that condition only**.

### Adapter selection is build-time. Behaviour is runtime.

Per register section 6.3, and the split is not a detail.

| Concern | Mechanism | Why |
|---|---|---|
| Which adapter | Build-time env var, `EXPO_PUBLIC_<SEAM>_ADAPTER` | A mock adapter must not exist in a production binary |
| Whether collection is on | **Consent row**, then a kill-switch flag | Consent is a stored fact about a person |
| Log level, batch size, buffer size | **Runtime flag** | You would change these during an incident |
| Endpoint, pool id, client id | Build-time env var | Environment-shaped, not incident-shaped |

Cognito pool ids and app client ids are **not secrets** and belong in
`EXPO_PUBLIC_*`. A Cognito app client **secret** is a secret, which is why the
mobile app client must not have one -- see section 4.

---

## 4. `auth`: Cognito, built so MFA and step-up are not a refactor

Scaffold deliverable 3 holds the acceptance criteria. This section covers the
wrapper decisions it leaves open. **Confirmed 2026-08-31.**

### 4.1 The client library

**Do not add Amplify.** It is a large dependency that brings its own analytics and
pulls a wide surface into the per-SDK privacy-manifest audit that
`release-readiness.md` requires, including collection this app has explicitly
declared out of scope. Use `@aws-sdk/client-cognito-identity-provider`, or a thin
fetch-based adapter against the Cognito IdP API. Record the choice in the ADR.

**Chosen 2026-08-31: the thin fetch adapter, and the AWS SDK is removed.** The
choice was forced rather than preferred. `@aws-sdk/client-cognito-identity-provider`
resolves through `@smithy/node-http-handler`, which requires `node:https`, a
module React Native does not have; the app fails to bundle with "Unable to resolve
module node:https". Metro resolver overrides for `react-native` main fields and
export conditions did not shift it. The failure appears on device ONLY, because a
web build resolves the browser entry and passes, so nothing catches it until
someone runs the native app.

The deciding argument once that was known: **every operation this app performs is
unsigned.** Sign-up, sign-in, challenge responses, email confirmation, password
reset and token revocation are all public app-client calls with no SigV4 and no
credentials, so the SDK's principal job is not needed. The wire format is JSON
with an `X-Amz-Target` header. The adapter is about 120 lines, has no
dependencies, behaves identically on all three platforms, and keeps a large
package out of the one bundle that ships to a store.

**The mobile app client is a public client with no secret.** A secret embedded in
an app binary is not a secret. If a future server-side flow needs a confidential
client, that is a second app client, not a secret in the bundle.

**Use `USER_SRP_AUTH`, not `USER_PASSWORD_AUTH`.** SRP never transmits the
password. `USER_PASSWORD_AUTH` sends it over TLS, which is not a break but is
strictly worse for no gain, and it requires enabling a flow on the app client
that is better left off.

### 4.2 The one signature that decides whether MFA is cheap later

**`signIn` must return a discriminated union from the first commit, not a
session.**

```
type SignInResult =
  | { kind: 'authenticated'; user: User }
  | { kind: 'challenge'; challenge: AuthChallenge; challengeToken: ChallengeToken }

type AuthChallenge =
  | { kind: 'email_verification' }
  | { kind: 'new_password_required' }
  | { kind: 'mfa_totp' }        // declared now, unreachable until the flag opens
  | { kind: 'mfa_sms' }         // declared now, may never be built
```

**Why this is the whole game.** Cognito already answers `signIn` with a challenge
today -- unverified email, forced password change. If the interface returns
`Promise<User>` and swallows those, then adding MFA later changes the return type
of the most-called method in the app, and every call site with it. Returning the
union from day one means **enabling MFA adds a case to one switch statement.**

Three consequences, all cheap now and expensive later:

- **`refreshSession` returns the same union.** If MFA is later enforced, or a
  session is revoked, a refresh can come back needing re-authentication. A
  `Promise<Session>` here has the identical problem one layer down.
- **Step-up authentication needs no new method.** Deleting an account, changing an
  email or revoking consent may later require re-authentication. That is a
  challenge, so the union already models it. This is the argument for *not*
  adding a `reauthenticate()` method now.
- **Exhaustive-switch enforcement is already a deliverable 0 lint rule.** Adding a
  challenge kind therefore produces a compile error at every site that must
  handle it. The type system does the migration planning.

`enrollMfa`, `verifyMfa` and `respondToMfaChallenge` are declared in the
interface, unimplemented, and flagged off, per deliverable 3. **The methods being
declared is not what makes MFA cheap. The union is.**

### 4.3 User pool settings that cannot be changed after creation

Get these wrong and the fix is a pool migration, which means re-registering every
user. **Verify each against current AWS documentation before creating the pool**
-- this list is the shape of the risk, not a substitute for the docs.

| Setting | Why it is a one-way door |
|---|---|
| **Username and alias attributes** | Fixed at pool creation. Email-as-username must be chosen now; it cannot be added later |
| **Username case sensitivity** | Fixed at pool creation |
| **Required attributes** | Cannot be added to an existing pool |
| **Custom attributes** | Can be added, up to a limit, but **never renamed or removed**, and mutability is fixed per attribute |

Changeable later, so do not over-think them now: password policy, MFA
configuration and which factors are enabled, device tracking, token lifetimes,
Lambda triggers.

**`account_class` lives in our database, not as a Cognito custom attribute.**
Authorization and flag evaluation both need it in SQL, custom attributes cannot be
removed if the model changes, and it is a product concept rather than an identity
one.

### 4.4 Tokens and biometrics

**Tokens never cross the seam boundary.** The interface returns `user` and
capability booleans and has no method that returns a token. The access token stays
in memory inside the adapter and the HTTP client; the refresh token stays in the
platform secure store. No context, no prop, no hook, and no log line can reach
one, because the type system offers no path.

**Verification is server-side against the pool's JWKS**, cached and refreshed,
checking issuer, audience, expiry and signature. Never decode without verifying.

**Biometric unlock is a device-local gate on a stored credential.** It gates
release of the refresh token. The server trusts nothing about it and never accepts
a client-asserted "biometric verified" claim -- `engineering-standards.md` states
this and it is repeated here because it is the thing most often got wrong.

**Biometric success must never satisfy an MFA challenge.** When MFA lands, the
temptation is to treat a local biometric as the second factor. It is not: it
proves possession of an unlocked device, which is the same thing the stored
refresh token already proves. Model them as unrelated in the types -- a
`challenge` is resolved by `respondToMfaChallenge`, and the biometric gate has no
method that can resolve one. Write this into the ADR as an explicit non-goal.

---

## 5. Logging: one event, three destinations

The requirement (2026-08-31): logs must be collectible from a device as a
**plain-text support file**, and reach **CloudWatch as JSON** for filtering and
querying.

**So the log event is structured data, and text and JSON are both formatters of
it.** Never write text and parse it back. That is the whole design, and getting it
backwards is how you end up with a regex that half-works.

```
LogEvent  ->  jsonFormatter  ->  stdout / our API  ->  CloudWatch Logs Insights
          ->  textFormatter  ->  on-device file     ->  support bundle
```

### 5.1 The envelope is a contract, shared by app and backend

One Logs Insights query should work across a device log line and a backend
request line. That only holds if the field names are identical, so **the envelope
type lives in `packages/contracts`**, not in either logger.

Fixed fields: `ts`, `level`, `event` (an enum, never a sentence), `correlationId`,
`appVersion`, `buildNumber`, `commitSha`, `platform`, `osVersion`, `deviceModel`,
plus a typed `attrs` bag. `event` is an enum because a free-text message is not
filterable and is where personal data enters.

Device model and OS version are diagnostics and are what make a crash actionable.
A device **identifier** is not, and is not collected -- see section 7.

### 5.2 The three destinations

| Destination | Format | Trigger | Egress |
|---|---|---|---|
| Backend stdout | JSON | Always | Container runtime -> CloudWatch. Register 6.4, already decided |
| Device support file | **Plain text** | **User taps "contact support"** | **None by us.** Handed to the OS share sheet |
| Device -> our API | JSON | Opt-in, off by default | Our `/diagnostics/logs` -> CloudWatch |

**The support bundle is the privacy-cheapest path in the system and should be the
default answer to "we need logs from a tester's device."** The app writes the file
locally and hands it to the OS share sheet. The person sees what they are sharing
and chooses the recipient. **We transmit nothing**, so there is no collection to
declare, no consent row required for the export itself, and no server to breach.
Plain text is the right format precisely because it is legible to the person
sharing it -- a format they cannot read is a disclosure they cannot consent to.

**Never upload the support bundle automatically.** The moment the app posts it,
the whole privacy calculus changes and it becomes background collection.

Background shipping to CloudWatch stays available for QA builds and incidents,
**off by default** (`diagnostics.log_shipping`), and consent-gated like crash
reporting.

### 5.3 Redaction is a type, not a discipline

`engineering-standards.md` requires this be enforced in the logger's type
signature rather than by convention. Concretely:

- A branded `LogSafe` type. The `attrs` bag accepts `LogSafe`, never `string` or
  `unknown`. Constructors take known scalars: enums, ids, durations, counts,
  status codes.
- **Free text has no constructor.** There is no `LogSafe.fromString`. A caption, a
  display name, a prompt or a story cannot be passed, because no function accepts
  one.
- **A second scrub at the transport boundary**, server-side. The type stops the
  honest mistake; the scrub stops the clever workaround.
- **Ban `console.*` in `src/` and `app/`** outside `services/logging`, mirroring
  the rule deliverable 0 already applies to `backend/src`. A stray `console.log`
  bypasses the type system entirely -- and lands in the support bundle unredacted,
  which is the file a person is about to email to us.
- **Route names come from an allowlisted enum, never a resolved path.**
  `/wall/{id}/response/{id}` leaks channel structure and a route param can carry a
  display name.

### 5.4 The correlation id is per-launch and must never be stable

Scaffold deliverable 6 requires a correlation id from client to API to log line.
One generator in `lib/`, read by the logger, the crash adapter and the HTTP
client, so a crash report and a log line describing the same moment join up.

**Regenerate it on every app launch. Never derive it from a device identifier and
never persist it.** A correlation id that is stable across sessions is a
persistent identifier, which makes it a tracking identifier, which changes both
stores' declarations and the tracking posture in the privacy manifest. The
usefulness of a correlation id lasts one session; the liability of a stable one
lasts forever.

### 5.5 The ring buffer is also the breadcrumb trail

- **Bounded.** Fixed entry count and fixed byte cap, both runtime flags. An
  unbounded buffer is a disk-filling bug.
- **Reports its own drops.** A flush carries a dropped-count. A silently truncated
  log is worse than a gap you can see.
- **Flushed on background, on foreground, and on a timer** -- never per line, which
  is a battery and mobile-data cost for no benefit.
- **Survives app kill.** Persisted, because the lines before a crash are the
  valuable ones.
- **Readable by the crash adapter.** The last N entries attach to a crash report
  as breadcrumbs. This is what makes a crash report actionable, and it is why
  `logging` and `crash` are designed together.
- **Nothing enters the buffer before the consent gate passes.** Buffering
  unconsented data and discarding it later is still collection. The exception is
  the support-bundle buffer, which never leaves the device unless a person shares
  it -- keep the two buffers distinct rather than reusing one and hoping.

---

## 6. The consent gate, shared by `crash` and `logging`

One function. Both sinks call it and neither implements its own version. Two
copies of this check is two places for it to be wrong, and this is the check that
must not be wrong.

```
canCollect(accountClass, consents, flags) -> boolean
```

Rules, in this order:

1. **`account_class === 'unknown'` collects nothing.** Before the age gate
   resolves, the account may be a child's. The tempting default is to collect
   until told otherwise; that default is a COPPA breach. **Unknown is treated as
   minor.**
2. **`account_class === 'minor'` collects nothing without both a `parental`
   consent row and a `crash_diagnostics` row.** Both, not either.
3. **`account_class === 'adult'` collects only with a `crash_diagnostics` row**,
   default off, per Apple guideline 5.1.2(i).
4. **A flag can only subtract.** `diagnostics.*` kill switches turn collection
   off. **No flag can turn collection on without a consent row** --
   `feature-flags.md` rule 3, which is why the flag is consulted last.
5. **Provider unreachable means off.** Fail closed, `feature-flags.md` rule 2.

**Write the test that a minor account with no consent row collects nothing, on
both sinks.** Deliverable 6 requires it for crash; it applies identically to logs.

### Flags to seed, and no others until something needs them

| Flag | Kind | Default | Fail mode |
|---|---|---|---|
| `diagnostics.crash_reporting` | kill_switch | on | closed |
| `diagnostics.log_shipping` | kill_switch | **off** | closed |
| `diagnostics.log_level` | config | `warn` | `error` |
| `diagnostics.log_buffer_entries` | config | `200` | `50` |
| `diagnostics.log_buffer_bytes` | config | `262144` | `65536` |

---

## 7. Privacy posture: what is deliberately not collected

The app must satisfy Apple's and Google's privacy rules on the strength of what it
actually does, not what a form claims. The cheapest way to hold that line is to
collect little enough that the declarations are short.

**Not collected, and each is a decision rather than an omission:**

| Not collected | Consequence of the absence |
|---|---|
| Advertising identifier, IDFA, Google Advertising ID | **No App Tracking Transparency prompt at all.** `NSPrivacyTracking` is `false` and there are no `NSPrivacyTrackingDomains` |
| Any stable device or installation identifier of our own | Nothing to link diagnostics to a person across sessions |
| A persistent correlation id | Section 5.4 |
| Precise or coarse location | No location permission, no purpose string |
| IP-derived geography | See below |
| Contacts, calendar, photo library reads | Photo-library **add** only, and only if the share flow saves art |
| Microphone | Voice is out of scope, so **no microphone purpose string**. An unused declaration invites a reviewer question |
| Free-text user content in any diagnostic | Section 5.3, enforced by `LogSafe` |

**Source IP is the one that gets logged by accident.** The load balancer sees it
and the default request-logging middleware in most frameworks records it. For a
minor's request it is personal data with no diagnostic value we need. **Do not log
it, or truncate it before the log line is written**, and make that an explicit
line in the backend logger rather than a default someone re-enables.

**Set an explicit CloudWatch Logs retention per log group.** The default is never
expire, which is simultaneously a compliance problem, a deletion-cascade problem
and a cost problem. Retention for a minor's diagnostics should be shorter than for
an adult's; the number comes from the COPPA ADR.

**Crashlytics collects a Firebase installation identifier**, which is the minimum
for deduplicating crashes and cannot be removed while using it. Declare it, and
note it as the specific thing to re-examine if the Kids Category question
resolves toward that category.

### iOS: what the privacy manifest must say

`PrivacyInfo.xcprivacy`, committed and included in the build:

- `NSPrivacyTracking`: **false**. No `NSPrivacyTrackingDomains`.
- `NSPrivacyCollectedDataTypes`: crash data and performance/other diagnostic data
  only, **not linked to identity, not used for tracking**.
- `NSPrivacyAccessedAPITypes`: **writing log files and a support bundle triggers
  required-reason API categories that a non-logging app would not** -- file
  timestamp, disk space, and user defaults are the ones to expect. Declare the
  reason code that actually matches the use; **verify the codes against Apple's
  current list rather than copying them from anywhere, including this page.**
- Every third-party SDK on Apple's list must ship its own signed manifest.
  **Audit before adding**, Firebase included, and record failures in
  `code-questions.md`.

Purpose strings for **only** what ships: Face ID for biometric unlock, and
photo-library add if the share flow saves art. Nothing else.

### Google Play Data Safety

Diagnostics and crash logs, **not linked to a user identity, not shared with
third parties for advertising, collected only with consent, and deletable.** The
web-accessible deletion request path that Play additionally requires is
deliverable 7's endpoint with a thin page over it, not a second implementation.

**Both declarations must match the code.** A mismatch is a worse finding than an
omission, and it is found by a reviewer reading the manifest against the binary.

---

## 8. Bootstrap and the provider tree

### 8.1 There is a pre-React phase

A crash during module evaluation or provider construction happens before any
React tree exists. If the sinks are created inside the tree, those crashes are
invisible -- and they are exactly the crashes worth seeing.

**The sinks are constructed at module load, in a disabled buffering state, and
enabled later by consent.** Construction is not collection: a disabled sink
accepts calls, holds nothing the consent gate would forbid, and starts delivering
only when the gate passes.

This lives in `services/diagnostics/bootstrap.ts`, exporting
`bootstrapDiagnostics()`. **Do not create a top-level `src/bootstrap/`
directory** -- the scaffold's "no new top-level directory without an ADR" rule
applies, and this fits inside the services layer that already owns it.

Register all three JavaScript error paths there, because a React error boundary
catches only render errors:

- `ErrorUtils.setGlobalHandler`, for fatal JS errors
- the unhandled-promise-rejection hook
- native crashes, which the crash adapter handles in its own process

Missing the second is the usual reason a crash dashboard looks quiet while testers
report crashes.

### 8.2 The tree

```
bootstrapDiagnostics()                ← pre-React. Sinks exist, disabled, buffering
<GestureHandlerRootView>              ← native root, not a provider
  <RootErrorBoundary>                 1. reports to the sink created above
    <SafeAreaProvider>                2. pure measurement, no dependencies
      <ThemeProvider>                 3. static this phase, one `brand` theme
        <QueryClientProvider>          4. the server-state boundary
          <FlagsProvider>              5. above session so auth screens read flags
            <SessionProvider>          6. restoring | locked | authenticated | anonymous
              <BiometricLockProvider>  7. owns the lock machine, withholds the refresh token
                <DiagnosticsGate>      8. wires consent → sinks. Renders children straight through
                  <AppReadyGate>       9. holds splash until fonts, session and flags settle
                    <Slot />          10. expo-router. The only thing that touches features
```

`providers/index.tsx` composes and does nothing else. Each entry is its own
module. `providers/` may import `services`, `data`, `stores` and `theme`, and
**never `features`** -- which is why the router mounts innermost and why the
biometric unlock *screen* is a route rather than something the provider renders.

### 8.3 Why each sits at that depth

| # | Why here specifically |
|---|---|
| 1 | Outermost, or it cannot catch a provider's own constructor throwing. A boundary inside `ThemeProvider` cannot render an error screen when the theme is what failed |
| 2 | Above anything that lays out; no dependencies, so hoisting is free |
| 3 | Above the query client so any error or loading surface below has tokens. Statically valued this phase, so it never re-renders |
| 4 | Above session because session hydration reads profile and consent rows through the cache |
| 5 | Above session so unauthenticated screens can read flags -- MFA-off, auth-stack kill switches. Re-evaluates with the authenticated context when session resolves. One provider, two evaluation contexts |
| 6 | Consumes flags and the cache, produces the four-state union. Exposes `user` and capability booleans only, never a token |
| 7 | Inside session, because `locked` is a session state |
| 8 | **Needs session (`account_class`), the cache (consent rows) and flags** -- the innermost point that can evaluate `canCollect`. Renders children unconditionally: diagnostics must never delay startup |
| 9 | The one place that sees fonts, session and flags settledness together |
| 10 | Mounts last, so no route renders before hydration settles. This prevents the login-screen flash on cold launch |

### 8.4 Why `DiagnosticsGate` is a component with two sinks, not three

An earlier draft justified it by the rule of three, on three sinks. RUM is gone,
so that argument no longer holds and the justification changes rather than the
conclusion.

It stands on **single responsibility**. The consent-to-sink wiring has to run
somewhere in the tree, and a hook needs a host component regardless. The candidate
host is `AppReadyGate`, whose job is holding the splash. Giving it the consent
wiring too means it changes for two reasons, and
`engineering-standards.md`'s own tell applies: if the sentence describing a module
needs an "and", split it.

It holds no context and provides nothing. It renders `children` directly. It is a
named place for an effect, and the name is the point.

### 8.5 What reordering breaks

| Move | Consequence |
|---|---|
| Sinks constructed inside the tree | Provider-construction crashes are invisible -- the crashes most worth seeing |
| `DiagnosticsGate` above `SessionProvider` | No `account_class`, so it cannot fail closed for a minor. This is the compliance-breaking reorder |
| `DiagnosticsGate` gating its children | Diagnostics delay first paint. A logging outage becomes an app-launch outage |
| `SessionProvider` above `QueryClientProvider` | Session hydration cannot use the cache; you hand-roll a second retry path for the profile read |
| `ThemeProvider` below `SessionProvider` | Splash and auth-stack error surfaces have no tokens; someone hardcodes hex and the no-raw-hex test fails |
| `FlagsProvider` below `SessionProvider` | Auth screens cannot read flags, so a second pre-auth flag path appears. That is how a silent `false` ships |
| `<Slot />` above `AppReadyGate` | Login screen flashes on every cold launch. The bug the four-state union exists to prevent |

---

## 9. Guardrails to add in deliverable 0

Machine-checked, or it is decoration. Additions to what deliverable 0 already
specifies.

**dependency-cruiser, forbidden edges:**

- `features/**` -> `services/crash`, `services/logging` (reached through
  `hooks/`, never directly, same rule as the HTTP client)
- `services/*/adapters/**` -> any other seam's adapters
- anything except `services/<seam>/index.ts` -> `services/<seam>/adapters/**`
  (the factory is the only importer of an adapter)
- `components/ui/**` -> `services/**` (already specified; it now matters more)
- `backend/src/authz/**` -> the flag client (already specified)

**ESLint:**

- `no-restricted-imports` mirroring the above
- **no `console.*` in `src/` or `app/`** outside `services/logging`
- no vendor SDK import outside its own adapter: `@aws-sdk/*` only under
  `services/auth/adapters/cognito.ts`, Firebase only under
  `services/crash/adapters/`
- exhaustive-switch enforcement, which is what makes adding an `AuthChallenge`
  kind a compile error at every site that must handle it

**Structural tests:**

- no module under `services/*/adapters/` is imported by anything but its factory
- every seam in the catalogue has an interface, at least two adapters, a factory
  and a conformance suite -- **a test that fails when a seam is added without its
  wrapper**
- every `diagnostics.*` flag declares `failMode: 'closed'`
- the log envelope's `attrs` accepts `LogSafe` and never bare `string`
- the auth interface exposes **no method returning a token**
- the biometric gate exposes no method that can resolve an `AuthChallenge`
- `NSPrivacyTracking` is `false` and `NSPrivacyTrackingDomains` is absent
- no module under `backend/src/authz/` imports the flag client

---

## 10. Open questions and required ADRs

**Closed 2026-08-31.** Recorded so nobody reopens them by accident:

- **A7, real-user monitoring.** Out of scope this phase. Register 6.4 stands
  unamended and needs no change.
- **A8, which RUM backend.** Moot while A7 is closed. Noted only because AWS
  ships no first-party React Native RUM client, so if RUM returns, that is the
  first constraint to check rather than an implementation detail.

**Still open.** In `code-questions.md` section 1b:

- **A9, device log collection.** In scope as a seam. What remains open is the
  **retention number** for shipped device logs, which is shorter for a minor than
  an adult and comes from the COPPA ADR. The support-bundle path in section 5.2
  needs no retention decision, because we never hold the file.

**ADRs required before the corresponding seam is built.** All stay **Proposed**
and wait for Pankaj, per the scaffold's gates.

| ADR | Covers |
|---|---|
| `adr-000X-auth-and-identity` | No Amplify, public client, SRP, the `SignInResult` union and why MFA hinges on it, the immutable pool settings, the biometric threat model and the biometric-is-not-MFA non-goal, what `local` does not simulate |
| `adr-000X-crash-reporting` | Already required by scaffold deliverable 6 |
| `adr-000X-logging-and-support-bundles` | The one-event-many-formatters design, the contract envelope, why the support bundle is never uploaded, the ring buffer, `LogSafe`, the per-launch correlation id, log retention |
| `adr-000X-diagnostics-consent-gate` | `canCollect`, why unknown is treated as minor, the flag-cannot-turn-on rule |
| `adr-000X-privacy-posture` | Section 7: what is not collected and what each absence buys, the manifest contents, why there is no ATT prompt |

The consent-gate and privacy-posture ADRs **reference rather than duplicate** the
pending COPPA ADR. If it contradicts anything in section 6 or 7, the COPPA ADR
wins and this page is corrected in the same unit of work.

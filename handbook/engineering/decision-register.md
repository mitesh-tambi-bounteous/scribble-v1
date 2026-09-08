# Scribl production build: decision register

Every architectural and engineering choice made for the Scribl production
rebuild, with the reason for it and the trade-off it accepts.

**Audience:** the whole delivery team, plus anyone who needs to understand or
challenge a choice. Shareable as-is.

> **This page is the source of truth**, kept here in the project brain rather
> than in `scribl-mobile-app` and republished. Before 2026-08-27 the source lived
> in the code repository and was published here; that model is retired, so
> that a change and its record cannot land in two different repositories out
> of step with each other. Edit this page directly, then run `npm run
> docs:sync` in this repository so the rendered site picks it up. The same
> pairing rule this repository applies to stories applies here: a document
> that disagrees with what shipped is worse than no document, because it is
> believed.

**Why one document.** A formal ADR is still the right artifact for a decision
that needs sign-off in its own right; when one is authored for this build, file
it beside this page under `handbook/engineering/` and link it in. This register
exists because a folder of twenty ADR files answers "what was decided about X"
badly, and a new joiner needs the shape of the whole thing before the detail of
one part.

---

## How to read the status column

| Status | Means |
|---|---|
| **Decided** | Settled by the engineering lead and architect. Build to it. Reopening needs a new decision, not a discussion |
| **Recommended** | Our recommendation, pending architecture sign-off. Build to it; the seam that lets it change is deliberate |
| **Position** | Our working answer to a question the client has not yet confirmed. Build to it, keep it cheap to change, and **do not present it to the client as settled** |

A decision with only advantages listed is marketing rather than a record, so
every entry names what it costs. If the trade-off column is empty, the entry is
not finished.

---

## If you read only one section

Five decisions carry more weight than the rest, because the others largely follow
from them.

1. **The API is a long-running container, not Lambda.** This supersedes a
   previously ratified serverless-first decision. See 2.1.
2. **Under-13 users are in scope**, so COPPA compliance is a requirement of this
   build rather than later preparation. See 7.1.
3. **Two invariants are load-bearing and enforced server-side**: submit-to-unlock
   and channel isolation. A bypass of either is a privacy incident, not a bug.
   See 4.
4. **Everything external sits behind an adapter with a local default**, so no
   developer needs a cloud credential and no vendor is load-bearing. See 6.1.
5. **Architecture boundaries are enforced by CI, not by review.** See 8.2.

---

## 1. Platform and shape

### 1.1 Rebuild from scratch rather than extend the prototype

**Status:** Decided.

**Decision.** The production app is a greenfield build. The existing prototype is
reference material, not a starting point.

**Why.** The prototype was built to communicate a product idea and it did that
well. It carries choices that were right for a one-week demonstration and wrong
for a product: images stored in database text columns, caller identity read from
a request header, fourteen client stores holding server data, four runtime
themes, a caption limit that contradicts the client's own designs. Each is
individually fixable and collectively they are a rewrite.

**Trade-off.** Rebuilding costs more than retuning, always. What it buys is that
the second month of work is not spent unpicking the first.

**Carried forward from the prototype**, because these were proven: the adapter
seam pattern, the shared type package, and the containerized API image.

### 1.2 Expo open-source framework, React Native, no Expo cloud services

**Status:** Decided.

**Decision.** Expo's open-source framework and libraries. No EAS Build, Update,
Submit or Workflows. Native builds go through `expo prebuild` into our own
pipeline.

**Why.** Expo's framework solves real React Native problems and its libraries are
well maintained. Its cloud services are a separate proposition: they introduce a
vendor into the release path, and the release path is the thing we most need to
own and understand. Builds, hosting and CI stay in infrastructure we control.

**Trade-off.** More pipeline work than letting a managed service do it. In
exchange, no dependency on an external service to ship a build, and no surprise
in the release path.

**Related.** Over-the-air JavaScript replacement is also the mechanism Apple's
guideline on downloaded and interpreted code addresses. Not using it removes that
question entirely.

### 1.3 One repository, frontend and backend together

**Status:** Decided.

**Decision.** App and API in one repository, with a shared `contracts` package
that both import.

**Why.** The API contract is the thing most likely to drift between two lanes
working in parallel, and a shared package in one repository makes a contract
change a single atomic commit that both sides typecheck against. Two repositories
would need a published package and version coordination between two engineers who
are already stretched.

**Trade-off.** Coarser access control and a single pipeline that must handle two
kinds of build. Both are manageable at this team size.

### 1.4 Device support: iPhone 11 and newer, phone first, iPad deferred

**Status:** Decided, 2026-08-26, by Rob Forshier II.

**Decision.** The device floor is iPhone 11. The deployment target is computed as
the higher of the Expo SDK's own minimum and what an iPhone 11 runs, recorded
rather than guessed. Phone first. iPad is deferred out of this phase, wanted
later.

**Why.** iPhone 11 keeps a wide install base without dragging the canvas
performance target down to hardware nobody is buying. Source for the phone-first
scope: Eric Rice on the kickoff transcript, 00:52:26 to 00:52:45, "Yes, just the
closest start."

**Trade-off.** None from iPad this phase. iPad returns later as its own scoped
piece of work, not a layout pass folded into this one.

**Open consequence.** Stylus and Apple Pencil support stays deferred out of this
phase. The prior note that this sits less comfortably with iPad in scope no
longer applies, since iPad is out of scope.

**Superseded 2026-08-26.** The position below was the 2026-08-24 architect
position and read the room as iPad in scope. The kickoff transcript disagreed
with the register, and the transcript won. Kept readable rather than deleted:

> **Status:** Position. Awaiting client confirmation.
>
> **Decision.** The device floor is iPhone 11. The deployment target is computed
> as the higher of the Expo SDK's own minimum and what an iPhone 11 runs,
> recorded rather than guessed. iPad is in scope.
>
> **Why.** iPhone 11 keeps a wide install base without dragging the canvas
> performance target down to hardware nobody is buying. The larger iPad surface
> suits a drawing app.
>
> **Trade-off.** iPad is a responsive layout pass across every screen rather
> than a line item, and it roughly doubles the test device matrix. Worth naming
> as a cost rather than absorbing it.
>
> **Open consequence.** Stylus and Apple Pencil support was deferred out of this
> phase, which sits less comfortably now that iPad is in. Worth revisiting.

---

## 2. Compute and data

### 2.1 A long-running containerized API, not Lambda

**Status:** Decided. **Supersedes the previously ratified serverless-first
decision for this phase.** An ADR recording that supersession is the first one to
write.

**Decision.** One Node HTTP service in a container behind a load balancer.
Not function-per-route behind an API gateway.

**Why.** Three reasons, in order of weight.

- **Connection handling.** A long-running process holds a proper database
  connection pool. Functions open a connection per execution environment and
  exhaust the database as concurrency rises, which is the classic failure of that
  pattern and is solved by adding a connection proxy in front. Containers remove
  the problem instead of mitigating it.
- **Latency predictability.** No cold starts on a path a person is waiting on.
- **Portability.** The same image runs on a managed container service now and on
  a Kubernetes cluster later without a rewrite, which keeps the longer-term
  direction open.

**Trade-off.** We now own capacity: a service that scales on metrics rather than
implicitly per request, and a minimum running cost when idle. We also diverge
from a ratified decision, which is why it needs a written ADR rather than a quiet
change.

**Consequence worth noting.** A connection proxy is no longer a day-one
requirement. It was mandatory only because of the function-per-request model.

### 2.2 Managed container service recommended over self-managed Kubernetes

**Status:** Recommended.

**Decision.** Run the container on a managed serverless container service. Not
raw instances, not a Kubernetes cluster, for this phase.

**Why.** Containerizing is the decision that matters; the runtime underneath is
reversible. A Kubernetes cluster adds a control plane, node groups, an ingress
controller, cluster autoscaling, service-account identity plumbing and a version
upgrade treadmill. That is a platform engineering function, not a task a backend
lane absorbs alongside feature work. A managed service removes instance patching
entirely.

**Trade-off.** Less control and fewer knobs than a cluster. If a cluster is
wanted later, the container and every layer above it are unaffected, which is the
point of recommending containerization rather than a specific runtime.

### 2.3 Relational database as the system of record

**Status:** Decided. Confirms an existing revised decision.

**Decision.** A managed serverless PostgreSQL cluster. The prototype's
document-store path is not carried forward.

**Why.** The data is relational and the access patterns are joins: a person, a
wall, a membership, a prompt, a submission, and a join table putting one
submission on several walls. A relational engine expresses the two invariants
naturally, and one of them is a transactional existence check that a relational
transaction gives us for free.

**Trade-off.** More operational surface than a document store, and a cluster to
size. Accepted, because the invariants are the product.

### 2.4 One submission, several walls, one stored image

**Status:** Decided.

**Decision.** A join table between submissions and channels. Sharing to three
walls creates three rows, never three copies of the artwork.

**Why.** It keeps multi-wall sharing cheap, and it keeps deletion coherent:
removing a submission removes it everywhere, and removing it from one wall does
not orphan an image. Copies would drift.

**Trade-off.** Every read path has to join. Correct and cheap with the right
index.

### 2.5 Images in object storage, never in the database

**Status:** Decided.

**Decision.** Artwork uploads directly to object storage using a pre-signed URL,
and is served through a CDN with short-lived signed URLs over a private bucket.
Thumbnails are generated on upload; the wall grid reads thumbnails only.

**Why.** The prototype stored images in database text columns, which is the first
thing to fall over at wall-grid scale. Uploading directly also keeps image bytes
out of the API service entirely, so it never spends memory or time on data it does
not need to see.

**Trade-off.** More moving parts than a column: a bucket policy, a CDN
distribution, signed URL handling, and an authorization check before any URL is
signed. All of it standard, none of it retrofittable cheaply.

### 2.6 Store the drawing strokes, not only the picture

**Status:** Decided.

**Decision.** Every submission stores two things: the raw drawing strokes as a
versioned vector document, and a rendered image. The strokes are the source of
truth; the image is a render of them. A thumbnail is derived for the wall grid.

**Why.** Three reasons, and the first is the one that decides it.

- **It enables editing a drawing later.** Reopening a drawing to change it needs
  the strokes; pixels cannot be un-drawn. The same data also allows replaying a
  drawing as it was made, which is a distinctive thing this product could do and a
  raster-only competitor cannot retrofit.
- **It cannot be added retroactively.** Art submitted without its strokes can
  never gain them. Every day this is deferred is a permanently pixel-only day of
  submissions, which is why it is a foundation decision rather than a feature.
- **It costs almost nothing now.** A one-brush, six-ink drawing is a small
  document, and the canvas already holds the stroke list in memory in order to
  render.

**What the format has to get right**, because these are the parts that are
expensive to fix later: a schema version on the very first write, so the format
can change while old drawings still render; resolution-independent coordinates
with the logical canvas size recorded. This mattered specifically because iPad
was in scope when this was written; iPad is deferred as of 2026-08-26 (section
1.4), but the resolution-independent requirement stands on its own, since a
phone drawing still has to re-render on a different phone; the ink identifier
alongside the resolved colour, so re-tuning the palette does not silently alter
existing art; and a recorded renderer version, so a re-render reproduces what
people actually saw.

**Editing produces a new revision rather than mutating one.** A wall has already
shown the previous version and reactions attach to it, so an edit adds a revision
and the submission points at the current one.

**Trade-off.** A second artefact to store, version, migrate and delete on every
submission, plus a format we now have to maintain compatibility with
indefinitely. Stroke documents also sit outside the wall read path, so they add
storage without adding read cost -- which is the right shape, but it does mean
paying for data that is unused until the editing feature exists.

---

## 3. Identity

### 3.1 Managed user pool, email and password, no federation

**Status:** Decided.

**Decision.** A managed identity provider with email and password only. No social
or platform sign-in.

**Why.** Nobody on this team should be writing password storage. Federation is
scope we do not need to spend now.

**Trade-off.** Adding a third-party social login later triggers an Apple
requirement to also offer an equivalent privacy-preserving option, which makes it
a product decision rather than a small feature. Worth knowing before somebody
adds a button.

### 3.2 Biometric unlock is a device gate, not an authentication factor

**Status:** Decided.

**Decision.** Biometrics gate the release of a stored refresh token on the
device. The server validates that token exactly as it would without biometrics,
and never accepts a client-asserted "biometric verified" claim.

**Why.** This is the security-relevant distinction. A client-asserted biometric
claim is trivially forged; the device proving a person to the device, then
releasing a credential the server independently validates, is sound. Getting this
backwards is a real vulnerability and the naive implementation invites it.

**Trade-off.** Biometrics do not add a server-side factor. That is the correct
outcome, not a limitation.

### 3.3 Multi-factor deferred, interface present

**Status:** Decided.

**Decision.** The auth interface declares enrolment and challenge methods. They
are unimplemented and flagged off.

**Why.** Multi-factor is not in the backlog and the approved methods differ
enormously in build cost. Declaring the shape now means adding it later is a
configuration and implementation task rather than an interface change rippling
through call sites.

**Trade-off.** Dead interface surface until it is filled. Cheap.

### 3.4 Invite by email is the entry path; guided onboarding deferred

**Status:** Position.

**Decision.** An invite is issued for a wall, the recipient accepts, and an
account is created in our store and the identity provider at that moment. The
client's eight-screen guided onboarding comes later.

**Why.** Invitation-only is the product's security model, so the invite path is
load-bearing regardless. Deferring the guided screens releases the single largest
item on the client-side critical path.

**Trade-off, stated plainly.** The client's guided first-drawing flow, which
lands a new person's first creation on the inviter's wall inside the first
minute, is the strongest part of their design. Deferring it means a new person
signs in and arrives at the prompt screen with nothing in front of it. Recoverable
later; thinner in the meantime.

---

## 4. The two invariants

### 4.1 Submit-to-unlock, enforced at the data layer

**Status:** Decided. Confirms an existing decision.

**Decision.** A person cannot read a wall for a given prompt until their own
submission exists. Enforced as a transactional existence check, not in the UI. A
direct API call with a valid token and no submission receives a refusal.

**Why.** This is the product's central promise: you cannot consume other people's
creativity without contributing your own. A UI-only gate is not a gate, because
the API is public to anyone with a token.

**Trade-off.** Every wall read carries the check. Negligible with the right index,
and it is the feature.

### 4.2 Channel isolation, through a single authorization choke point

**Status:** Decided.

**Decision.** Every wall read authorizes on membership of that specific wall,
through **one** authorization module that every read path calls. Row-level
security in the database sits behind it as defence in depth. Block relationships
are enforced in the same place.

**Why.** A leak between two walls is a privacy incident, not a display bug. The
prototype spread identity checks across many handlers, and a gate you can only
verify by reading many files is not a gate. One choke point is testable; the
database policy means a missed application check still fails.

**Trade-off.** A single module every read path depends on. That coupling is the
intent.

### 4.3 Neither invariant is reachable from configuration

**Status:** Decided.

**Decision.** No feature flag, environment variable or runtime setting can
disable either invariant. Not "on by default" -- not reachable. A test asserts
that the authorization layer cannot even import the flag client.

**Why.** A privacy invariant that a misconfiguration can switch off is a privacy
incident with a delay attached.

**Trade-off.** No ability to disable them in an incident. Correct.

---

## 5. Client architecture

### 5.1 Server data in a query cache, client state in a store

**Status:** Decided.

**Decision.** Fetched data lives in a query cache. The client store holds only
draft work in progress, session hydration and interface state. Stores perform no
input or output.

**Why.** The prototype accumulated fourteen stores because server data was pushed
into them, so retry, invalidation, staleness and offline behaviour were
hand-rolled per store. Separating them solves those once.

**Trade-off.** Two state mechanisms to learn instead of one. The boundary is
crisp and machine-enforced, so the ambiguity is small.

### 5.2 Drawing strokes do not live in component state

**Status:** Decided.

**Decision.** Stroke points accumulate outside the render cycle and commit to
state when a stroke ends.

**Why.** Re-rendering per touch point is what makes a canvas feel wrong on the
oldest supported device, which is exactly what the performance acceptance
criterion measures.

**Trade-off.** More care than the naive implementation. The naive implementation
does not meet the bar.

### 5.3 One brand theme, held in a structure that could hold more

**Status:** Decided.

**Decision.** A semantic token layer where components reference roles and never
raw colour values, with exactly one populated theme that the app defaults to. No
theme switcher, no second scheme.

**Why.** The prototype carried four runtime themes and none matched the client's
brand. One theme removes that. Keeping it in a keyed structure means a second
scheme later is a data entry rather than a component refactor, and it costs
nothing now.

**Trade-off.** None material. The structure is free; populating a second scheme is
the expensive part and is not being done.

### 5.4 Session state is a four-state union, and tokens never reach a component

**Status:** Decided.

**Decision.** Session hydration is one of restoring, locked, authenticated or
anonymous. Contexts are split by how often their contents change. Components
receive a user and capability booleans; raw tokens stay inside the auth adapter
and HTTP client, unreachable from a component.

**Why.** Two states rather than four is what produces a flash of the login screen
on every cold launch while the secure store is read. And a component that can
read a token can leak it into a log line, a crash report or a screenshot, so the
type system should make reaching one impossible.

**Trade-off.** More ceremony than a user object and a loading boolean. It removes
a class of bug rather than a single bug.

---

## 6. Cross-cutting patterns

### 6.1 Everything external sits behind an adapter with a local default

**Status:** Decided. This is the unifying pattern of the whole build.

**Decision.** Authentication, media, notifications, telemetry, crash reporting
and feature flags each get one interface, a local adapter that is the default and
needs no credentials, and a cloud adapter selected by configuration. Adapters are
injected, never imported directly.

**Why.** Three benefits from one pattern. **Development needs no cloud account**,
so nobody waits on provisioning. **Tests substitute an implementation** instead of
mocking a module path, which is why the tests stay true when code moves. And **no
vendor is load-bearing**, so replacing one is a day rather than a sprint.

**Trade-off, named honestly.** This is building a seam before it is needed, which
is ordinarily the wrong instinct. It is justified here on one condition: each
seam exists because retrofitting it is provably more expensive than building it,
and each carries an ADR saying so. Anything without that written justification
does not get a seam.

### 6.2 Feature flags: a seam, not a vendor

**Status:** Decided.

**Decision.** One flag interface and a typed registry where every flag is
declared with its kind, default, failure mode, owner and removal date. A static
adapter is the default; our own evaluated endpoint is the second. No commercial
platform is chosen, and one may never be.

**Why.** The question is not which vendor but how to make the vendor a detail. A
typed registry also means an undeclared flag is a compile error rather than a
silent false, and deleting a flag surfaces every call site.

**Two rules that are not negotiable.** Flags are **evaluated on the server** and
the client receives answers rather than rules, partly because account class is a
targeting dimension and targeting logic about children should not ship to a
device. And **a flag can never override a consent decision**: it may turn
diagnostics off, never on without consent. Consent is a stored fact about a
person; a flag is an operational control; where they disagree, consent wins.

**Trade-off.** More upfront work than reading environment variables, and no
percentage rollouts in the first cut.

### 6.3 Runtime flags and build-time flags are different things

**Status:** Decided.

**Decision.** Build-time environment variables are for what must not exist in a
production binary: debug menus, mock adapters, test seams. Anything a person
might want to change without shipping a release is a runtime flag.

**Why.** The prototype implemented two conceptual kill switches as build-time
variables. "Turn the enhancement pipeline off" was a real request the client made
once, and answering it should not require a store release cycle.

**Trade-off.** A runtime flag is a live network dependency and a value that can
be wrong in production without anyone shipping anything, so it needs an audit
trail and a considered default. A build-time variable has neither problem and
neither capability. The cost of choosing runtime is that discipline; the cost of
choosing build-time is a release cycle to answer an operational question.

**Rule of thumb.** If you would want to change it during an incident, it is a
runtime flag.

### 6.4 Observability: the platform floor, deliberately

**Status:** Decided.

**Decision.** Structured request logging, one log group per environment, and
alarms on error rate and service health. Not a metrics and dashboarding stack.

**Why.** The richer observability stack in the longer-term architecture belongs to
a multi-region target, and no decision covers it for this phase. Building it now
would be inventing infrastructure nothing has asked for.

**Trade-off.** Less insight than a full stack. Adequate for a build with no
production traffic, and it does not preclude more later.

### 6.5 Crash reporting on a free tier, gated on consent

**Status:** Decided.

**Decision.** A free-tier crash reporting service. **Collection starts disabled
and is enabled only after consent is recorded.**

**Why.** No funding conversation, and it symbolicates. The consent gate is not
good practice here, it is a requirement: diagnostic collection on a minor's
device without parental consent is a policy breach on both stores.

**Trade-off.** It collects crash traces and an installation identifier, so it
appears in both stores' data declarations and must match what the code does. And
if we target a children's store category, its third-party SDK rules may force this
choice to be revisited.

---

## 7. Compliance and security

### 7.1 Under-13 users are in scope

**Status:** Decided by the architect. Governing
[ADR-0012](/context/pages/reference/decisions/0012-coppa-under-13-support),
drafted 2026-09-02 from the age-gate and consent mechanism already shipped in
`scribl-mobile-app`. **Two sub-decisions inside that ADR are still open and
still the highest-priority outstanding items**: store-category targeting and
the verifiable-consent method. Until they close, the shipped code (see
`account-class.ts`'s `allowsMinorEnrollment`) keeps production closed to
minor enrollment even though this entry says minors are in scope for the
product -- read that as the current production posture, not a contradiction
of this decision.

**Decision.** Children are a supported audience. COPPA compliance is a
requirement of this build, not later preparation.

**Why.** It is a family drawing app. Shipping without an age position and adding
a children's edition later is the harder path, and the position was already listed
as a decision blocking the build.

**Trade-off, stated fully because it is the largest scope change on the project.**
This was previously scoped outside the current phase and was unsized. It brings
in verifiable parental consent, which is not a checkbox and whose approved methods
differ enormously in cost; an age gate that branches rather than merely records;
constraints on which third-party SDKs are acceptable; stricter retention; and a
stricter default moderation posture, where fail-safe stops being a product
trade-off and becomes a legal position.

**Two questions [ADR-0012](/context/pages/reference/decisions/0012-coppa-under-13-support)
names but does not answer**, because they change the SDK set and
the store listing: whether we target a children's store category or serve
under-13 users outside one, and which verifiable-consent method we implement.

### 7.2 Consent is versioned rows, never a flag on a record

**Status:** Decided.

**Decision.** Consent is stored per person, per kind, per version, with who
consented, when, and whether it was revoked. Kinds include terms, privacy,
diagnostics, third-party processing and parental.

**Why.** You cannot reconstruct an audit trail from a boolean, and this is the
single most expensive thing on the list to retrofit. One kind is also an explicit
store requirement.

**Trade-off.** More schema and more care than a column. Retrofitting costs
multiples.

### 7.3 Deletion, export and the moderation substrate are built with the schema

**Status:** Decided.

**Decision.** Account deletion that cascades to stored images, data export,
content reporting, user blocking, and a moderation queue with an owner field and
a response-time field. Built now, not later.

**Why.** In-app deletion is required for any app that creates accounts, and one
store additionally requires a web-accessible deletion path. Reporting, blocking
and prompt action on reports are all required for user-generated content, and
blocking specifically is easy to overlook next to reporting. Retrofitting deletion
across a schema costs multiples of building it in.

**Trade-off.** Work in the foundation with no visible product surface. Two items
are outright store requirements rather than preferences.

### 7.4 Mobile security posture, including what we deliberately do not do

**Status:** Decided.

**Decision.** Anything in the app binary is treated as public, so no secret,
key or credential ships in it and secret scanning runs in the pipeline and as a
commit hook. Refresh tokens go in platform secure storage; access tokens live in
memory only. No personal data in logs, telemetry or crash reports, enforced by
type signature. Transport is HTTPS with platform security defaults and no
exceptions. Deep links are untrusted input, validated and authorized server-side
before anything renders.

**Deliberately not doing**, recorded so nobody adds them as a reflex:

- **No certificate pinning.** It breaks on rotation, is routinely bypassed on a
  compromised device, and costs more in incidents than it prevents.
- **No jailbreak or root detection.** Defeatable, adds friction for legitimate
  users, and every sensitive operation is server-authorized anyway.
- **No embedded web views**, and no remotely loaded or interpreted code.

**Trade-off.** We accept that a determined attacker with a compromised device can
inspect the app. That is true regardless, and the mitigations that pretend
otherwise cost real usability.

### 7.5 A pre-seeded reviewer account, because submit-to-unlock hides the product

**Status:** Decided.

**Decision.** An automated, pre-populated demo account for store review.

**Why.** This one is easy to miss and expensive to miss. Submit-to-unlock means a
fresh account sees an empty wall. A reviewer given clean credentials cannot
evaluate the product and will reject the build as incomplete. The demo account
must arrive already holding a submission and visible wall content.

**Trade-off.** A seeding path to maintain. Far cheaper than a rejected submission
and a re-review cycle.

---

## 8. Code structure and standards

### 8.1 A layered architecture with one dependency rule

**Status:** Decided.

**Decision.** Dependencies point inward and downward, never sideways or upward.
Shared contracts import nothing. Pure functions import only contracts. Adapters
know nothing of the interface layer. On the server, all data access is confined to
one layer and all authorization to another. Product code lives in vertical feature
slices with a single public surface each.

**Why.** It makes "where does this code go" answerable without a debate, and it
keeps the cost of the tenth change close to the cost of the first. The specific
failure it prevents is a codebase where a function needing a home creates a file,
then a directory, then a general-purpose folder, and six weeks later every change
touches five places.

**Trade-off.** More directories than a flat structure, and occasional friction
when a boundary fights a real feature. The response to that friction is a
deliberate change to the rule, in an ADR, never a quiet exception.

### 8.2 The architecture is enforced by CI, and the guardrails are built first

**Status:** Decided.

**Decision.** Import boundaries are checked by a tool with a committed
configuration, failing the build. Naming, structure and safety rules are lint
rules and tests. **All of it lands before any product code.**

**Why.** An unenforced convention is a suggestion, and suggestions lose to
deadlines. Boundaries added later are boundaries the existing code already
violates, and at that point the rule gets weakened to fit rather than the code
getting fixed.

**Trade-off.** A slower start with nothing visible to show for it. It is the
cheapest guardrail available and the only moment it is free.

**Named consequence.** No boundary exception without an ADR. An allowlist that
grows an entry per sprint is an architecture decaying in public, and that is worse
than no rule because it still looks like one.

### 8.3 Design principles, applied with their failure modes

**Status:** Decided.

**Decision.** Remove duplicated **knowledge**, not duplicated lines: if a rule
changes, must both places change? Abstract on the third occurrence, not the
second. No machinery for a requirement nobody has. Make illegal states
unrepresentable, with discriminated unions rather than optional-field bags.
Validate at boundaries by parsing, not casting.

**Why.** Each of these is misapplied more often than ignored, so the record names
the failure mode rather than the slogan. Two screens that look alike and change
for different reasons are not duplication, and merging them couples things that
wanted to move apart.

**Trade-off.** Some judgement is required rather than a rule to follow
mechanically. That is unavoidable; the alternative is premature abstraction
enforced by policy.

---

## 9. Tooling and delivery

### 9.1 pnpm workspaces

**Status:** Decided. **Supersedes the npm-workspaces decision below**, found
2026-09-02: the shipped `scribl-mobile-app` repo ships `pnpm-lock.yaml` and
`pnpm-workspace.yaml`, not a `package-lock.json`. No record of when or why the
switch happened was found in this repo; it is recorded here as an observed
fact about the shipped repo, not as a re-litigation of the original reasoning.

**Decision.** pnpm, across `apps/web`, `apps/mobile`, `apps/api` and five
packages (`contracts`, `api-client`, `mock-server`, `eslint-config`,
`tsconfig`) as of 2026-09-02 -- past the "roughly four workspace packages"
revisit trigger the original decision named below. Turborepo (`turbo.json`)
was also adopted for task orchestration, which section 10's "not building"
table and `toolchain.md` section 6 both listed as deliberately not adopted;
that line is now stale too.

**Trade-off.** Whatever motivated the switch away from the original npm
decision is not recorded. If the React Native autolinking risk the original
decision named did not materialize, or was mitigated some other way, that
reasoning belongs here for the next person who has this same debate.

**Superseded decision, kept readable because the reasoning may still apply
to a future choice between these two tools:**

> **Status:** Decided.
>
> **Decision.** npm. Considered and rejected the main alternatives.
>
> **Why.** The strongest alternative offers disk efficiency and strictness, where
> strictness means code cannot import a package it never declared. That is
> genuinely valuable. But native mobile builds resolve module linking by walking the
> dependency tree, and the alternative's symlinked layout is the fragile case. It
> can be configured into a flat layout, which **forfeits exactly the strictness that
> was the reason to choose it.** The trade collapses. Additionally, its benefits
> scale with the number of workspace packages and we have one.
>
> The deciding factor is the failure mode: a package manager problem here does not
> surface as a clear error, it surfaces as a native build failing the evening before
> a demo. On the fragile part of this stack, take the well-trodden path.
>
> **Trade-off.** No protection against undeclared dependency use, and a larger
> dependency tree on disk. Accepted.
>
> **Revisit when** the workspace passes roughly four packages, or install time
> becomes a measured complaint. As an ADR, not a quiet switch.

### 9.2 One test runner, two projects

**Status:** Decided.

**Decision.** One test runner across app and server, configured as two projects.

**Why.** The app side requires the framework's own transform regardless. A
different runner for the server is nicer in isolation but means two mental
models, two configurations and two sets of quirks for one team.

**Trade-off.** Slightly worse server-side ergonomics than the modern alternative.
Simplicity wins at this team size.

### 9.3 The hosted pipeline builds iOS too, no self-hosted runner

**Status:** Decided, 2026-08-27, superseding the 2026-08-24 position below.

**Decision.** The iOS binary builds in the hosted pipeline like everything
else, on a GitHub Actions macOS runner. There is no local-build phase and no
self-hosted-runner phase.

**Why.** The CI platform decision (9.6) is GitHub Actions, and GitHub Actions
ships hosted macOS runners, unlike the Bitbucket Cloud Pipelines the original
position was written against. The fact that removed the original constraint is
the platform, not a change of mind about the constraint itself.

**Trade-off.** A macOS runner minute is billed at roughly ten times a Linux
one. Scope `runs-on: macos-*` to only the iOS build and archive step. Gate that
step to a release trigger rather than every push to `main`, so backend-only
commits never pay the macOS rate.

**Superseded 2026-08-24 position.** Written against Bitbucket Cloud Pipelines,
which has no hosted macOS option at all. Kept readable because the phased
build-locally-then-add-a-runner shape may still be the right call on a future
CI platform that lacks hosted macOS.

> **Decision.** Everything except the iOS binary builds in the hosted pipeline.
> iOS builds locally to start, from a committed script, then move to a
> self-hosted macOS runner that calls the same script unchanged.
>
> **Why.** The hosted CI service provides Linux runners only. There is no
> configuration that works around it.
>
> **Trade-off.** Local builds work, but only for whoever holds the signing
> identity and is not on leave. That is the actual risk, rather than the builds
> failing, and it is why the script exists now and the runner path is written
> down.

### 9.4 Cloud access by short-lived role assumption, not stored keys

**Status:** Decided.

**Decision.** The pipeline assumes a scoped role via federated identity. No
long-lived access keys in CI configuration.

**Why.** A key pair in a CI variable cannot be rotated without somebody
remembering to, and it is among the most common ways a cloud account is
compromised.

**Trade-off.** More one-time setup. Done once.

### 9.5 Development needs no cloud credential

**Status:** Decided.

**Decision.** The whole stack runs locally: local database, local adapters,
infrastructure templates that synthesize with no credentials. Nothing in the
development loop requires cloud access.

**Why.** Nobody waits on provisioning to be productive, tests do not depend on a
shared environment, and no developer is tempted to point at a personal account.

**Trade-off.** Local adapters are not the cloud ones, so some behaviour is only
proven on deploy. Mitigated by keeping the seam thin and the contract shared.

### 9.6 Code repository and CI/CD on the client's GitHub, not Bitbucket

**Status:** Decided, 2026-08-27, by Pankaj, confirmed with the client.
Reverses the 2026-08-25 Shape kickoff room decision (Bounteous Bitbucket now,
handoff later), which itself was reversed at the 2026-08-26 internal standup
pending client confirmation: `knowledge/meetings/2026-08-25-scribl-shape-kickoff.md`
row 10, `knowledge/meetings/2026-08-26-standup.md`.

**Decision.** The build repository lives in the client's GitHub org from the
start, not Bounteous's Bitbucket workspace. CI/CD is GitHub Actions, building
and deploying to AWS.

**Why.** Rob Forshier II named the reason at the 2026-08-26 standup before the
client had confirmed access: the shared B2B repo already has a GitHub folder in
it, and building in Bitbucket first would mean rewriting the whole pipeline
later to move it, "apples and oranges" (00:01:30 to 00:02:07). Eric Rice
committed to requesting GitHub org access from the former dev team that day
(00:03:25). The client has now confirmed the GitHub account is usable, which
closes that open item.

**What this changes.** Everything in `ci-cd.md` that assumed Bitbucket
Pipelines: the workflow files are `.github/workflows/*.yml`, not
`bitbucket-pipelines.yml`; AWS auth is GitHub's OIDC token exchange, not
Bitbucket's; environments and secrets are GitHub's, not Bitbucket's. It also
changes 9.3: GitHub Actions has hosted macOS runners, which Bitbucket Cloud
Pipelines does not, so the local-build and self-hosted-runner phasing in the
superseded half of 9.3 is no longer the right shape. `dev-setup.md` and
`developer-bootstrap.md`'s clone URL and SSH setup for this repository move
from `bitbucket.org` to the client's GitHub org, confirmed 2026-09-02 as
`ScriblOrg/scribl-mobile-app`.

**A validated precedent.** The client's own B2B product already runs this
exact platform pairing successfully, GitHub Actions deploying to AWS by OIDC
role assumption (`scribl-b2b .github/workflows/deploy.yml`, read in
`knowledge/research/scribl-b2b-stack-review.md`). Their pipeline shape is worth
copying; their gate, which checks a label, an assignee, and a title prefix and
runs no test anywhere, is not. See `ci-cd.md` for the split.

**Trade-off.** `meta-scribl-app` and the POC repo `scribl-app` are unaffected
and stay where they are; this decision is scoped to the production build repo
only. Access to the client's GitHub org sits with a team outside Scribl's
current staff, per the standup note, so the org name and who administers it
are worth re-confirming rather than assumed stable.

---

## 10. What is deliberately not in this phase

Recorded so absence reads as a decision rather than an oversight. None of these
is cancelled.

| Not building | Why, and where it goes |
|---|---|
| Managed push notification delivery | Out of the current band. The seams and a local daily reminder are built, so enabling it later is configuration rather than surgery |
| Automated content moderation | Out of the current band. The human path -- report, block, take down, a queue with an owner -- is built, because that is what store review checks |
| Analytics event pipeline | Out of the current band. Named as the thing most worth fighting to keep, because unmeasured months cannot be recovered |
| AI-generated drawing backgrounds | Built in the prototype, demonstrated, and switched off at the client's request. Parked, not deleted. The client's premise is that the person is the artist |
| Runtime prompt generation | Never built and not wanted. Prompts stay curated by the client's own programme team and are seeded and resolved by date. A model may draft candidates for editorial review; nothing reaches a person unapproved |
| Voice notes | The client's designs and their own prioritisation disagree. Specified end to end and parked pending their decision |
| Timed drawing challenges | Built in the prototype and removed from the product surface by the new designs. Returns as a wall type if it returns |
| Composed keepsakes from several drawings | In the client's prototype, parked by their own decision for a later phase |
| Experiment and A/B infrastructure | The flag interface leaves room for it. Nothing implements it |
| Native end-to-end test automation | Web end-to-end is set up. Native is a later decision, and the simpler of the two candidate tools first |
| Monorepo build orchestration, component workshop, publishing automation | None is justified at this size. Each has a written revisit trigger |

---

## 10b. Sprint 0 spike coverage

The Shape window carries fifteen spikes, eight of which are architecture, backend
or AWS. This is where each one's artifact stands, because a spike is done when
its artifact exists rather than when its timebox runs out.

| Spike | Artifact required | Where it is |
|---|---|---|
| Dev environment | Documented setup plus a bootstrap that runs end to end | Done. The setup document and the bootstrap script |
| Close the Aurora gate | One page closing or amending the gate | Done. Entry 2.3 closes it |
| Backend architecture, signed | Signed decision, plus a sizing memo | Decision done, entries 2.1 and 2.2. **Sizing memo outstanding**, and it is the one input the cost estimate has no substitute for |
| Client architecture and portability | ADR naming the shared layer and the platform boundary | Done as the platform-boundary section of the architecture document. **Should be promoted to an ADR** alongside the compute one |
| Security and privacy review | Written scope decision on under-13 handling and retention | Structure and consequences done, entries 7.1 to 7.4. [ADR-0012](/context/pages/reference/decisions/0012-coppa-under-13-support) drafted 2026-09-02 from the shipped mechanism. **The store-category question and the consent method are still outstanding** inside that ADR |
| Channel model | Written scope decision | Recommendation recorded, entry 2.4 and the schema treatment. Client confirmation outstanding |
| Mock-to-real contract drift guard | A conformance check that runs when the real API lands | Specified as an acceptance criterion on the foundation deliverable. Not yet built, because the code does not exist |
| Moderation fail policy | Written policy decision per content type | **Outstanding.** A recommendation is on the open-questions list; the decision is not made |

**Four architect-owned decisions from the architecture register have no entry in
this document at all**, because they are undecided rather than decided: agentic
personalised follow-up, model hosting, premium tier, and the analytics system of
record. Each carries a recommendation on the open-questions list. Two of them are
marked as blocking the build, so they are not safe to leave until somebody trips
over them.

---

## 11. Decisions still open

This register holds what has been decided. What has not is tracked in
`code-questions.md` at the repository root, which lists only questions that block
development, each with an owner and, where one exists, the architect's working
position.

The largest open items at the time of writing are the two questions inside
[ADR-0012](/context/pages/reference/decisions/0012-coppa-under-13-support)
(store-category targeting and the verifiable-consent method), the IaC tool
conflict between ADR-0005 (CDK) and the shipped Terraform infra stub
(code-questions.md A10), several client design values, and the scope of voice
notes.

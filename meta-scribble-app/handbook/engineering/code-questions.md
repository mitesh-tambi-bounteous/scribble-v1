# Open questions, scribl-mobile-app

**Only questions that block development.** If a question does not stop somebody
writing code this week, it does not belong here. Prerequisites for starting and
publishing are in `release-readiness.md` section 1.

Where a question exists in the engagement-wide register
(`tracking/open-questions.md`, rendered at `/open-questions`), its Q number is
given so the two do not drift. This page is the code-blocking subset of that
register, with the architect's working position attached. An `S` prefix means the
question was raised by the scaffold instruction.

**How to read the architect position.** Rows below carry a position from Pankaj,
engineering lead and architect, dated 2026-08-24. **A position is a recommendation
that unblocks the build, not a closed question.** Build to the position, keep the
seam that lets the answer change, and do not treat the question as answered when
talking to the client. The question closes when the named owner confirms it.

**Convention.** Append, never overwrite. When a question closes, move it to
section 4 with the answer and the date. An agent that needs a value recorded
nowhere adds a row here and stops, rather than inventing one.

---

## 1. Blocking work in flight

| ID | Question | Architect position, 2026-08-24 | Owner |
|---|---|---|---|
| Q1 | Is the drawing canvas a dark surface or paper-white? The Figma frames draw on a dark ground; every sales-deck mockup shows drawings on white cards on a light background | **Paper-white**, and it must be driven entirely by the theme token so the answer is a one-line change. Recommend `#FFFFFF` for `canvasSurface`. Do not hardcode white anywhere outside the token | Client design |
| Q4 | What is the muted text colour? The deck carries no vector value | **A neutral mid-gray**, industry standard, rather than the gray-violet estimate the realignment plan sampled. Recommend `#6B7280` as the starting value. One token, changeable later at no cost | Client design |
| Q16 | Are the 23 PNG exports the complete frame set, and can we have Figma file access? | **Treat the current 23 as the complete set and proceed.** More frames are expected and will arrive ad hoc. Standing risk rather than a blocker: any frame we do not hold is a screen built twice, and image exports go stale silently when a frame is edited. Re-raise if a new frame contradicts a built screen | Client design |
| Q29 | How many fixed channels ship, three or four, and is coworkers its own channel? | **Do not hardcode a limit.** The schema supports N channels; there is no reason to cap what we can add. If a hard limit is genuinely required, the floor is **four**. **Coworkers is its own channel.** Seed Personal (automatic, every scribl lands there) plus Family, Friends and Coworkers as the defaults. Onboarding copy, the share-to checklist and the dashboard all read the channel set as data, never as an enum | Client product |
| Q12 | What content goes in the "Your Stats" card on the dashboard? | **Scribls created, scribls shared, impressions shared and received, and weekly averages of each.** Two halves with very different costs: created and shared counts are cheap queries against submissions and ship now; **impressions require view-event tracking, which is analytics instrumentation in the ORANGE band and out of these eight weeks.** Ship the cheap half, leave the impression rows as defined-but-empty rather than faking them. See the note below on impressions and children | Client product |
| Q11 | Is guided onboarding in the first band of work? | **Deferred.** The entry path for this phase is **invite by email**: an invite is sent, the recipient joins, and an account is created in our store and in the Cognito user pool at that moment. The client's eight-screen guided onboarding comes later. See the cost note below, because this cuts both ways | Client product |
| Q9 | Is the hosted invite landing page and tokenized invite flow in scope? | **Yes, in scope.** Build the invite redemption screen in the app and the token-resolve endpoint plus landing page in the backend. This restores work previously on the cut list; see the cost note below | Client product |
| Q32 | Are under-13 users in scope, and what is the COPPA position? | **Yes, under-13 is in scope.** [ADR-0012](/context/pages/reference/decisions/0012-coppa-under-13-support) drafted 2026-09-02 from the shipped age-gate/consent mechanism. Two sub-questions remain open in that ADR: store-category targeting and the verifiable-consent method; production does not enrol minors until they close. This is the largest scope change on this page and it is not a feature that gets added; it changes consent, retention, moderation posture, third-party SDK choices and the store age rating. See the cost note below, which is the longest one for a reason | Pankaj, ADR-0012 drafted, two sub-decisions open |

## 1b. Architect-owned decisions from the ADR gate list

These are not client questions. They are the decisions the brain's architecture
register marks as gating, plus the Sprint 0 spike artifacts that have no home
yet. **Every one is Pankaj's to close**, and each carries a recommendation so it
is a review rather than a blank page. Sourced from
`product/inputs/reference/decisions/README.md` and `tracking/backlog-sprint0.md`
in the brain.

| ID | Decision | Recommendation | Gate |
|---|---|---|---|
| A1 | **Agentic personalised follow-up: in the minimum product, or post-launch?** The register marks this as blocking the build and says lock it before week 3. It appears nowhere in the eight-week epic set | **Post-launch.** Nothing in the current scope produces the behavioural history a follow-up would personalise against, analytics instrumentation is out of band, and the product's own premise is one curated prompt a day rather than a system that reacts to you. Deciding it now costs nothing; discovering it in week three costs a replan | **Blocks the build.** Unnumbered in the open-questions register, so nobody is chasing it |
| A2 | **Moderation fail policy, per content type.** When the moderation service is unavailable, times out, or returns low confidence, does a submission publish or hold? | **Fail safe, meaning hold, for every content type, with no exception for adults.** Two reasons: under-13 content is in scope so a fail-open path is a legal exposure rather than a product tradeoff, and a single policy is testable where a per-type matrix is not. **Name the product cost out loud**: holding a child's drawing off their grandmother's wall for ten minutes is a bad moment, and it should be a decision rather than a surprise in a demo | **Blocks the build.** E00-F13, one day, unstarted |
| A3 | **Model hosting: direct API, Bedrock, or a managed platform.** The register calls this a privacy and compliance decision now, not only cost | **Bedrock, in our own AWS account.** With minors in scope the deciding factor is that content stays inside our account boundary with no third-party training path, which is far easier to defend in a store review and in a parental-consent disclosure than a direct third-party call. The provider adapter means this is configuration, not architecture. Note the caveat: it only matters if any model call ships at all, and today only speech-to-text is live | Resolve early. Does not block |
| A4 | **Premium tier: at launch or post-launch?** | **Post-launch.** Monetisation is on record as not an expectation of this phase and the client has no pricing philosophy yet. Recorded so its absence is a decision rather than an oversight | Resolve early. Does not block |
| A5 | **Analytics system of record: the event pipeline in ADR-0008, or a product-analytics SDK.** ADR-0008 chose a streaming-to-warehouse pipeline; the technical implementation plan names a product-analytics SDK. Both are live documents and they disagree | **Defer the choice, but mark ADR-0008 as superseded-pending rather than leaving it reading as settled.** Analytics is out of band this phase so nothing is blocked, and the instrumentation seam should not be built against a contradiction. What must not happen is somebody building to ADR-0008 because it looks current | Resolve early. Does not block, but the contradiction should not sit unmarked |
| A6 | **Sizing: what user base, concurrency and regions is this built and costed for?** No sizing input exists. The register separately carries an unresolved inconsistency between a 2,000-concurrent target and much larger numbers used elsewhere | **Cannot be recommended, it needs a number from the client.** What can be produced without them is the memo's shape: expected accounts, daily active fraction, peak concurrent at the daily prompt boundary, media volume per user per day, and region count. **One agreed number first, then an architecture.** This is the artifact E00-F4 requires and the one input the cost estimate has no substitute for | Does not block the build. Blocks costing it, and blocks the event-wall conversation entirely |
| A9 | **Device log retention: how long are shipped device logs kept, and how much shorter for a minor?** The seam itself is decided (2026-08-31, in scope, `diagnostics.log_shipping` defaulting off). What is unresolved is the number | **Two retention classes, minor shorter than adult, and set an explicit CloudWatch retention on every log group** -- the default is never-expire, which is simultaneously a compliance problem, a deletion-cascade problem and a cost problem. The number itself comes from the COPPA ADR rather than from here. **Note that the support-bundle path needs no retention decision at all**, because the app hands the file to the OS share sheet and we never hold it -- see `service-seams.md` section 5.2 | **Blocks the log seam's cloud adapter, not the local one.** Also needs a retention class per the deliverable 7 requirement that every table carries one |
| A10 | **IaC tool: ADR-0005 vs. what shipped.** ADR-0005 decided AWS CDK (TypeScript) for all infrastructure, and `toolchain.md` records the same decision at 9.1's sibling entry. The shipped `scribl-mobile-app` repo's `infra/README.md` instead says "Terraform lives here when AWS account IDs exist," and `infra/` has no CDK app. Found 2026-09-02 during a docs-vs-code review; nobody has recorded which one is intended | **Cannot be recommended without knowing who changed it and why.** If Terraform was a deliberate switch, ADR-0005 needs a superseded banner and `toolchain.md` section 2/4 need their CDK references corrected. If it was scaffolding drift (an infra stub written before ADR-0005 was checked), the stub should be redone in CDK before real AWS account IDs exist, per that stub's own comment. Either way, this should not be resolved by guessing | Blocks nothing today, since `infra/` is an empty stub either way. Blocks the first real infra work |

**Why these are here rather than in the register.** The decision register records
what has been decided. These are open, they are architect-owned rather than
client-owned, and until they close they are exactly the kind of thing an agent
would otherwise invent an answer to.

## 1c. Deviations from the binding documents, taken on instruction

Recorded because the scaffold requires an agent to log rather than invent, and
because both of these read as an agent's unilateral choice if nobody writes down
that they were not. Both were directed by Pankaj on 2026-08-31 while the frontend
scaffold was being built. Neither is an open question; each is here so the
divergence between the documents and the code is visible.

| ID | Deviation | Instruction and consequence |
|---|---|---|
| D1 | **Expo SDK 57, not the SDK 56 the scaffold specifies** | "Use the latest version of react-native and any child package." The consequence is the iOS deployment target: SDK 57's `expo-build-properties` enforces a minimum of **16.4** and rejects anything lower, where SDK 56 would have allowed a lower floor. React Native 0.86.3's own minimum is 15.1 and an iPhone 11 runs well past both, so 16.4 is binding and the device floor decision is unaffected. Re-read both sources on every SDK upgrade rather than trusting the number |
| D2 | **The client lives in `frontend/`, not at the repository root** | "Create a frontend folder in scribl-mobile and start placing code for frontend app in this." The scaffold's repo layout puts `app/`, `src/`, `packages/`, `backend/`, `infra/` and `e2e/` at the root, and separately requires an ADR for any new top-level directory. The practical effect is that every path in `architecture.md` and `toolchain.md` is prefixed by `frontend/`; the boundary rules, the dependency-cruiser configuration and the CI working directory all account for it. **`backend/` and `infra/` do not exist in this repository**, because the backend is another lane's work; the contract mock in `packages/mock-server` stands in so the client is not blocked |

Two smaller consequences worth recording, since both contradict a specific line
in a handbook page:

- **The AWS SDK is not used for Cognito.** `service-seams.md` section 4.1 offered
  either the SDK or a thin fetch adapter; the SDK does not bundle on React
  Native. The reasoning is recorded in that section rather than here.
- **The crash seam ships without its vendor.** `services/crash/` is complete and
  `@react-native-firebase/crashlytics` is deliberately absent, pending the
  privacy-manifest audit and the Kids Category question. Recorded in
  `release-readiness.md` section 7.

---

## 2. Still open, no position yet

| ID | Question | What it blocks | Owner |
|---|---|---|---|
| Q18 | Voice notes: the client's frames show a Record option twice, and their own kickoff board cut voice memos from the minimum lovable product. The two disagree | Whether the story input ships a write-only path or a write-or-record fork, and whether a microphone permission string is declared at all. An unused permission declaration is a review risk, so this cannot be hedged. **Now also a COPPA question**, since recording a child's voice is a different data class from a typed sentence | Client product |
| Q10 | The onboarding prompt screen offers a "Get Inspired" examples branch and no frame exists for where it leads | Onboarding screen 5. Lower urgency now that guided onboarding is deferred under Q11, but it returns with it | Client design and product |
| Q15 | Which screens get a full client design pass, and which get the brand theme replicated across them by us? | How much of the build can run ahead of design and how much waits. The "grown by the iPad decision" clause is removed 2026-08-26, when iPad left scope | Client design |
| Q2b | What is the exact brush width, as a number? Q2 closed on "second from the right of the four sizes on the client's own canvas frame" and deliberately asserted no pixel value, so the number itself is still unrecorded. Matthew Kaplan's dissent for a narrower width was never withdrawn | The canvas ships one fixed width, so a value has to exist in the code. Ship the measured value, confirm it on an iPhone 11, and expect a revision. It is a constant, not a design, so the rework is cheap. There is also an outstanding scribl-app change to bring the POC off the client's B2B width | Bounteous to measure, Eric Rice to confirm |
| Q29a | Is white a permanent ninth ink, or provisional? Shipped 2026-08-25 by Rob Forshier II as a soft eraser via paint-over rather than a tenth colour, and Eric Rice named the internal disagreement himself: "We will play around with it and see if we like it" | Whether the ink set is eight or nine, and whether the swatch row lays out for eight or nine. Held in contracts as data, so removing it is a data change. Tracked as C11 in `tracking/eric-poc-change-requests-2026-08-25.md` | Client product, internal to Scribl |
| Q29b | What is the display order of the inks? ROYGBIV is confirmed rejected; no replacement order was given | The swatch row's order. **Do not hardcode an order into a design mock or a fixture screenshot** before it closes, because a screenshot is what gets treated as the answer. Tracked in the 2026-08-25 prioritization workshop record, row 8 | Client design |
| Q33 | Does an eraser ship at all? Eric Rice asked for one; Matthew Kaplan pushed back asking whether there is any user input justifying it. Eric: "what we talk about internally, now's not really the time" | Whether the canvas gets an erase tool. **Do not build one until this closes.** Interacts with Q29a, since white-as-paint-over is the current stand-in for the same job. Tracked as C20 in `tracking/eric-poc-change-requests-2026-08-25.md` | Client product, internal to Scribl |

## 2b. Screen questions raised by the scaffold, 2026-08-31

Raised by auditing the client's 23 Figma frames, the POC's 29 routes and the
seven live POC screens against the scaffold's route graph. **Each is a screen
somebody would otherwise invent an answer to**, so each carries a recommendation
rather than a blank. The full inventory these come from is the screen-inventory
section of `SCAFFOLD_PROMPT.md` in the build repository.

| ID | Question | Recommendation | Owner |
|---|---|---|---|
| S6 | **With voice out of scope, what happens to the type-or-record fork?** `Story Input Select.png` is a whole screen whose only job is choosing between typing and recording, and `Daily Prompt Blank.png` puts a Record button next to Write on the canvas. Q18 leaves voice unresolved and the scaffold declares no microphone permission string | **Skip the fork screen and drop the Record button, do not ship either disabled.** A disabled control is a support question and an App Store reviewer question, and a permission string we do not exercise is a review risk the scaffold already refuses. Going straight from canvas to the text editor is one screen fewer and reverses cheaply: the fork returns as a screen, not as a refactor, if Q18 lands on voice | Client product, with Q18 |
| S7 | **What does a locked tile look like on the wall grid?** Submit-to-unlock is one of the two load-bearing invariants, and its entire visible face is this state. `Family Wall.png` shows empty tiles with no locked treatment, and `Artifact Select.png` proves the magenta outline is multi-select rather than a lock. The POC solved it with a padlock and "Katie hasn't drawn", which no frame carries forward | **Ask for the frame; it is a one-frame request and the invariant is not shippable without it.** Until it arrives, build the POC's semantics behind the theme: a tile that names the member and says they have not drawn, visually distinct from an empty grid slot. **The distinction matters**: an empty slot means nobody was ever there, a locked tile means somebody drew and you have not. Conflating them makes the invariant unreadable | Client design |
| S8 | **The share-to checklist appears in two presentations. Which ships?** `Wall Explanation.png` puts it in a modal over the walls list during onboarding; `Daily Prompt Story Complete.png` puts it inline under the story editor in the daily loop. The POC has it as its own route | **Inline on the story screen, one presentation.** Onboarding is deferred, so the modal has no home this phase, and the POC's separate route is a step the designs deliberately removed. One control, one place | Settled unless design objects |
| S9 | **What does the "Your Stats" card actually render?** The frame draws a placeholder chart glyph, not numbers. Q12 says ship the created and shared counts and leave impressions defined but empty | **Numbers, not a chart.** Two counts with their weekly averages, and no impression rows rendered at all until the analytics band lands. A chart drawn from two integers is decoration, and a chart with an empty series looks broken | Client design, with Q12 |
| S10 | **`Get Started.png` promises two things this phase does not ship.** Its recap lists Artifacts and custom prompts alongside three that do ship. Artifacts are out of scope per the register, and runtime prompt authoring is recorded as never wanted | **Cut those two bullets when onboarding is built.** Not urgent, because onboarding is deferred under Q11, but it must not ship as drawn: an onboarding screen that promises a feature the app does not have is the first thing a new person tries and fails to find | Client product |
| S11 | **Which navigator, and what goes in it?** `Family Wall.png` shows a three-item bottom bar of home, envelope-plus and sparkle. `Dashboard.png` shows a hamburger. Neither appears in any acceptance criterion, and the sparkle is the artifact surface, which is out of scope | **Two tabs, not three, and no drawer.** Ship home and the submit path; leave the sparkle out rather than shipping a tab that goes nowhere. The hamburger needs a menu inventory before it is worth building, and nothing in scope currently needs one. **This is the one item on this list that is expensive to defer**, because a navigator added after the screens exist is a restructure of every route file | Client design, urgent |
| S12 | **The entire authentication surface has no design.** No frame shows a password, a sign-in, a verification step or a reset. The designed flow enters through an invite and never asks for a credential. The POC's screen asks for an email and a name and says it checks both to sign you in, which is not authentication and cannot be restyled into Cognito email and password | **Build the six screens to the brand theme without waiting**: sign up, email verification, sign in, reset request, reset confirm, and the biometric prompt. They are conventional, the theme makes them consistent, and the alternative is deliverable 3 blocking on a design pass nobody has scheduled. **Flag it to the client as built-not-designed** so it is a known gap rather than a surprise in a demo | Client design to review, not to block |
| S13 | **What does the response detail carry?** It has no frame. The POC's live screen shows an author header with wall and timestamp, the drawing, an AI Original toggle, a comment input box, three reaction types (heart, smiley, star) and a share action | **Reactions yes. Share, comments and the AI toggle no.** Reactions post-unlock are E05-F6 and in scope. **Share is E12, which is ORANGE band and out of these eight weeks**, so the share control in the POC's header does not ship: leave the affordance out rather than wiring it to a native sheet that loses the story and the prompt, which is the exact gap E12 exists to close. The AI toggle belongs to the enhancement pipeline, built and switched off at the client's request. **Comments are the real question**: they are a separate card on the client's own board, they are a moderation surface, and with under-13 in scope a free-text channel between users is a different compliance weight class from a reaction. Do not build them by copying the POC | Client product |
| S14 | **The settings and account screen has no design and carries three store requirements.** In-app account deletion is an Apple requirement for any app that creates accounts, the consent records of deliverable 7 need a surface, and the Crashlytics diagnostics toggle has to be reachable | **Build it plainly to the theme, and treat it as a compliance surface rather than a design one.** It needs: account deletion, data export, the consent list with revoke, the diagnostics toggle, sign out, and the app version and build number for tester reports. Design can restyle it later at no cost to the schema | Bounteous to build, client design to review |

## 3. Cost notes on the positions above

These are the consequences the positions carry. They are recorded here so the
positions are not read as free.

**Under-13 in scope, Q32.** The brain placed this in the GRAY band, outside these
eight weeks, sized as "not sized," and separately listed it as one of four
decisions blocking the build. Bringing it in scope means, at minimum:

- **Verifiable parental consent**, which under COPPA is not a checkbox. The
  approved methods are things like a payment-instrument check, a signed form, a
  video or phone verification, or knowledge-based authentication. Cheap to
  describe, expensive to build correctly, and it sits in front of account
  creation for a whole class of user.
- **An age gate that actually gates**, not one that merely records. The scaffold
  currently records an account class; it now needs a branching flow behind it.
- **Third-party SDK constraints.** Any diagnostic or analytics SDK on a child's
  device needs the consent gate to hold. This makes the Crashlytics consent
  toggle load-bearing rather than good practice, and if the app goes into
  Apple's Kids Category the SDK rules tighten further. **The ADR needs to answer
  whether we are targeting the Kids Category or serving under-13 users outside
  it**, because they are different compliance regimes and only one of them
  restricts what we can link to and embed.
- **Stricter retention and a stricter default moderation posture.** The
  fail-safe policy stops being a product tradeoff and becomes a legal
  requirement.
- **Google Play Families policy** applies in parallel, with its own declarations.

This is a genuine scope addition on top of a plan that was already over capacity
before it. It should be sized and stated rather than absorbed.

**iPad in scope, S5. Superseded 2026-08-26.** This note existed only because
iPad was in scope. iPad left scope 2026-08-26 (phone first, iPad deferred to a
later phase; Eric Rice, kickoff transcript, 00:52:26 to 00:52:45, "Yes, just the
closest start."). The note no longer applies. Original text, kept readable:

> The brain's own words are that iPad in scope is a layout pass across every
> screen rather than a line item. Concretely: every screen needs a tablet
> layout, the two-column and three-column grid decisions change, the canvas
> toolbar has to work at tablet width, and the QA device matrix roughly doubles.
> The canvas itself benefits from the larger surface, which is the one upside.

**Brush size selector, Q2. Superseded 2026-08-26.** Q2 closed as one brush at
one width, no size picker; see the answered table in section 4. The 2026-08-24
architect position it replaced is kept readable here, because two other records
cite its size array by value. Original text:

> | Q2 | Is the brush size selector four sizes or one? | **Four sizes**, matching
> the four-dot row in the client's own canvas frame. `[18, 12, 5, 2]`, largest to
> smallest. One brush style | Client design |

The four-size row survives as the client's picture, which is what Eric was
pointing at when he picked the second from the right. What is superseded is
shipping a selector for all four.

**Onboarding deferred and invites in scope, Q11 and Q9.** These move in opposite
directions and roughly cancel on the client lane. Deferring guided onboarding
releases about five iOS-days, which the brain named as the single biggest iOS
line and the biggest relief available on the critical path. Bringing invites into
scope costs about three iOS-days and three backend-days, plus the hosted page.
Net effect is roughly neutral on iOS and worse on backend, which was already the
more overcommitted lane.

Worth naming the product cost of the deferral: the client's guided first-scribble
flow, which lands a new person's first drawing on the inviter's wall inside the
first minute, is the thing the realignment plan singled out as better than our
POC and as "the whole product." Deferring it means a new person signs in and
arrives at the prompt screen with nothing in front of it.

**Impressions in the stats card, Q12.** Two problems beyond the analytics
dependency. Impressions on a private family wall is an odd metric, since the
audience is a handful of named relatives rather than an audience. And once
under-13 is in scope, counting who viewed a child's drawing is view-tracking of
children's content, which needs to be justified against the COPPA position rather
than shipped because a frame had a chart on it. Recommend confirming what the
client actually wants that number to mean before building it.

---

## 4. Answered, kept so nobody asks twice

| Question | Answer | Date |
|---|---|---|
| Expo or bare React Native? | Expo OSS framework, no EAS. Builds and CI are ours | 2026-08-24 |
| Does the app ship dark mode? | No. One brand theme which the app defaults to, held in a themes map so a second scheme is a map entry rather than a refactor. No switcher | 2026-08-24 |
| Bundle identifier and application id? | `co.scribl.app` on both platforms. Reverse DNS of the client's own domain, because the app ships under the client's store accounts. Fixed from the first TestFlight upload onward | 2026-08-24 |
| Minimum supported device? | iPhone 11 and newer, phone only. The deployment target is the higher of Expo SDK 56's own minimum and what an iPhone 11 runs; record the number, do not guess it. The original answer's "plus iPad" half is superseded 2026-08-26 by the phone-first, iPad-deferred decision recorded in the S5 row below | 2026-08-24, device floor superseded 2026-08-26 |
| Is iPad in scope? (S5, moved here from section 1) | **No, deferred out of this phase, wanted later.** Phone first. Decided by Rob 2026-08-26, source Eric Rice on the kickoff transcript, 00:52:26 to 00:52:45, "Yes, just the closest start." This supersedes the 2026-08-24 architect position in section 1 that read "Yes, iPad is in scope," with a cost note that iPad was a responsive layout pass across every screen and roughly doubled the QA device matrix (see the superseded cost note in section 3). The board at `tracking/board-questions-filled-2026-08-25.md` had recorded this as a contradiction between the transcript and this register; the transcript wins | 2026-08-26 |
| Does real-user monitoring ship this phase? (A7) | **No.** No RUM SDK, no session replay, no performance-trace vendor. Observability is the platform floor decision register 6.4 already decided -- structured logging, one log group per environment, alarms on error rate and service health -- plus client crash reporting and the user-initiated support bundle. **Register 6.4 therefore stands unamended and needs no change.** If RUM returns it is a new decision, and the server-side swap rule in `service-seams.md` section 1 is what keeps it cheap | 2026-08-31 |
| Which RUM backend? (A8) | **Moot while A7 is closed.** Kept only because it is the first constraint to check if RUM ever returns: **AWS ships no first-party React Native RUM client** -- CloudWatch RUM's client is `aws-rum-web`, a browser SDK, and ADOT's React Native support is thin. Verify against current AWS documentation at that point rather than trusting this row | 2026-08-31 |
| Cognito client library and auth flow? | **`@aws-sdk/client-cognito-identity-provider`, not Amplify** -- Amplify brings its own analytics and widens the per-SDK privacy-manifest audit against collection this app has declared out of scope. Public app client with **no secret**, because a secret in an app binary is not a secret. **`USER_SRP_AUTH`, not `USER_PASSWORD_AUTH`**: SRP never transmits the password. See `service-seams.md` section 4 | 2026-08-31 |
| How is MFA kept cheap to add later? | **`signIn` returns a discriminated union from the first commit, not a session.** Cognito already answers with challenges today (unverified email, forced password change), so the union is needed regardless; having it means enabling MFA later adds a case to one switch rather than changing the return type of the most-called method in the app. `refreshSession` returns the same union. Step-up auth needs no new method, because a step-up is a challenge. **Biometric success must never satisfy an MFA challenge** and the types must make that unreachable | 2026-08-31 |
| Compute tier? | A containerized long-running HTTP API, **not Lambda**. ECS on Fargate recommended, with the same container portable to EC2 or EKS. Supersedes ADR-0002 for this phase and needs its own ADR | 2026-08-24 |
| Data store? | Aurora Serverless v2, PostgreSQL | 2026-08-24 |
| Crash reporting provider? | Firebase Crashlytics, free tier. Collection starts disabled and is enabled after consent, which is now load-bearing rather than good practice | 2026-08-24 |
| Is MFA in the minimum viable product? | No, deferred. The interface carries the methods, flagged off and unimplemented | 2026-08-24 |
| Is password reset in scope? | Yes, sequenced last. Backend endpoints and adapter methods land in the scaffold; the two screens come last. The app cannot reach a store without them | 2026-08-24 |
| Push notifications and deep linking? | Seams only. The invite deep link is the one live destination, since invites are now in scope. The managed push pipeline is ORANGE band, out of these eight weeks | 2026-08-24 |
| Biometric login? | Yes, where the device supports it. It gates release of a stored refresh token and is explicitly not an authentication factor the server trusts | 2026-08-24 |
| How does a build reach testers? | TestFlight, 100 testers or fewer, which puts internal distribution and no beta review within reach | 2026-08-24 |
| CI system? | **GitHub Actions, not Bitbucket Pipelines.** Superseded 2026-08-27: the client confirmed their GitHub account, and the repository moves there too. GitHub Actions ships hosted macOS runners, so iOS builds in the hosted pipeline from day one; the original answer's local-build and self-hosted-runner plan no longer applies. See decision register 9.6 and 9.3, and `ci-cd.md` | 2026-08-24, superseded 2026-08-27 |
| Feature flagging platform? | **None chosen, and the decision is deferred by design.** Build a provider seam: a `static` adapter as the default and our own `GET /flags` API as the second. A vendor, if one is ever paid for, implements the same interface and nothing above it changes. See `feature-flags.md` | 2026-08-25 |
| Reusing the existing scribl.co backend? | No, greenfield | 2026-08-20 |
| Extending the POC or rebuilding? | Rebuilding from scratch. The POC is a communication artifact, not a codebase | 2026-08-20 |
| Prompts generated by a model at runtime? | No. Curated by the client's program team, seeded and resolved by date. A model may draft candidates for editorial review | 2026-08-20 |
| Stylus and Apple Pencil support? | Deferred out of this phase. The original note ("sits less comfortably now that iPad is in scope") is void as of 2026-08-26: iPad is deferred, so the caveat no longer applies | 2026-08-20, caveat voided 2026-08-26 |
| Is Android in scope? | Wanted and confirmed, descoped for timeline. iOS first, Android fast follow | 2026-08-20 |
| Is the AI drawing-enhancement pipeline live? | No. Built, demonstrated, and disabled at the client's request | 2026-08-20 |
| Is the brush size selector four sizes or one? (Q2, moved here from section 1) | **One brush, one width, no size picker.** Decided by Rob 2026-08-26. The width is the second from the right of the four sizes on the client's own canvas frame, Eric's pick at 00:25:15, restated 00:26:04 as "second from the right." No pixel number is asserted here; the width is read off the client's frame, not guessed. See the prose block immediately after this table for Matthew Kaplan's recorded dissent and an outstanding code-repo change | 2026-08-26 |

### Q2, brush width: dissent and outstanding code change

Matthew Kaplan dissented on the width and never withdrew it. He was holding a
phone at the time. He called the largest of the four sizes "massive" and said
"The smallest line on Rob's app on my phone is closest to the scribble game
today" (00:25:23). He then said, "I think that is either one, either that third
one or 4th one to the right is probably close... I would say that third one is
probably mimics mostly what we have today. So I would go with that one for the
MVP" (00:25:52), preferring the third or fourth position over Eric's second
from the right. Eric's reply was conditional, not a handover: "if you're on the
phone and you think it needs to be smaller, then yeah, go for it" (00:25:49).
Decided 2026-08-26 by Rob in Eric's favor: second from the right.

The shipped scribl-app code currently carries the client's own B2B width
instead of Eric's pick. A code change is outstanding to bring it to the decided
width. That change is a scribl-app repo change, not something this record
makes.

---
title: "Sprint 0 backlog, the fifteen spikes"
project: scribl
type: planning
updated: 2026-09-02
---

Sprint 0 is the Shape window, 2026-08-24 to 2026-09-01. Its fifteen spikes are
items in their own right, filed on the Jira board as E00 and E00-F1 to E00-F15.
They live in this file rather than in `tracking/backlog-epics.md` because that
file is the machine-readable input to `scripts/jira-sync/` for the eight-week
feature backlog, and Sprint 0 is a different kind of work: a spike is done when
its artifact exists, not when a screen works.

# SPRINT0 band. The Shape window before sprint 1

## E00 Sprint 0, the Shape window

`id: E00 | band: SPRINT0 | board item: "Sprint 0" | discipline: Delivery`

The Shape window, named as a sprint. Sprint 1 presumes fifteen decisions that nobody has made, and this epic is those decisions with an owner and a timebox against each. Sprint 1 keeps its 2026-09-02 start and all four demo dates hold.

Six of the fifteen carry `source: Derived`, meaning they came out of a feature-by-feature pass over all 112 features in `tracking/backlog-epics.md` asking what decision each sprint 1 item presumes, rather than off anybody's list. Section 4 has the day cost per lane, the not-startable list, and the three spikes that Sprint 0 already funds.

These are spikes rather than features, so they carry no band colour from the kickoff board and no size in lane-days against a feature estimate. A spike is done when its artifact exists, not when its timebox runs out.

The Shape window ran 2026-08-24 to 2026-09-01; today is 2026-09-02. Decision
register 10b (`handbook/engineering/decision-register.md`) is the standing
record of where each spike's artifact stands, and this file is reconciled
against it. Closed against a register entry: dev environment (9.5), close the
Aurora gate (2.3), client architecture and portability (architecture.md 3b).
Decided but with one input still outstanding: backend architecture (2.1, 2.2;
the sizing memo is the open piece). Structure done but with a named gap:
security and privacy review (7.1 to 7.4, ADR-0012), channel model (2.4).
Specified but not yet built: the mock-to-real contract drift guard. Still
outstanding with no decision made: moderation fail policy. E00-F1 and E00-F14
are reconciled to the GitHub-org repo move (register 9.6). E00-F15 is
reconciled to the device-matrix decision (register 1.4). E00-F2, E00-F7 and
E00-F9 carry no register entry and are left as they were.

**E00-F1 Lay down the Claude Code harness in the new repo**
`parent: E00 | band: SPRINT0 | discipline: Delivery | depends on: none | blocked by: none | status: Not started | size: 2 days | carries forward: none`

**Question.** What harness configuration, skills and guardrails does this team adopt, rather than the ones a single engineer runs alone?

**Artifact.** A working Claude Code harness committed to the production repo
(`ScriblOrg/scribl-mobile-app`, not `hs2studio` -- the repo moved to the
client's GitHub org 2026-08-27, decision register 9.6, after this backlog item
was written), plus a one-page standard for using it.

**Unblocks.** No sprint 1 item is hard-blocked by this. Every lane inherits the harness on day one, and the two days sit outside the 99 build-lane days, so it competes with nothing.

A single-engineer harness is tuned to one person working without review. A team harness needs the review points, the commit conventions and the guardrails that a shared repository implies. Doing it before the repository fills up is cheaper than retrofitting it.

**E00-F2 Arc in the delivery flow**
`parent: E00 | band: SPRINT0 | discipline: Delivery | depends on: none | blocked by: none | status: Not started | size: 1 day | carries forward: none`

**Question.** Where does Arc sit in the delivery flow, and who uses it for what?

**Artifact.** A written flow with its entry and exit points named.

**Unblocks.** No sprint 1 item is hard-blocked. Outside the 99.

Arc without a named place in the flow becomes a tool two people use and nobody else knows about. One page saying who opens it, at what point, and what comes out is the whole deliverable.

**E00-F3 Automation framework choice, with the reasoning**
`parent: E00 | band: SPRINT0 | discipline: QA | depends on: none | blocked by: none | status: Not started | size: 4 QA-days | carries forward: none`

**Question.** Which automation framework, and why that one rather than the alternatives?

**Artifact.** A tooling recommendation with the alternatives written down and the reasoning for the choice.

**Unblocks.** E06-F3 (3 QA-days) and E06-F6 (2 QA-days), both already recorded as blocked, and the sprint 1 test-execution day.

**Answers.** Q48, Q53

This is E06-F2, four QA-days already inside Sprint 0, so it costs nothing new. It appears here because it is a decision rather than a build task. `toolchain.md` section 2 has since settled the tool choices this spike was scoping: Jest everywhere as one runner with two projects, Playwright for web E2E against the export, native E2E deferred with Maestro first once it is needed. What this spike still owns is Q48 and Q53. `engineering-standards.md` section 4 gives the working constraint on Q48: coverage thresholds are set per tier once the shape is real, not as one global number, and the team's coverage bar already has three candidate answers on record from one hour on 2026-08-20. Do not invent a fourth; settle among the three.

**E00-F4 Backend architecture, signed**
`parent: E00 | band: SPRINT0 | discipline: Backend | depends on: none | blocked by: none | status: Not started | size: 2 backend-days | carries forward: none`

**Question.** Closed, and the answer reverses what this spike asked. It asked whether serverless-first Lambda is the committed compute tier. Decision register 2.1 decides one long-running Node HTTP container behind a load balancer, not function-per-route behind an API gateway, and it explicitly supersedes the previously ratified serverless-first decision. Register 2.2 recommends a managed serverless container service over self-managed Kubernetes.

**Artifact.** The signed decision exists at register 2.1 and 2.2. The sizing memo does not: what user base, concurrency and regions the container is sized for. Register 10b names this as the one input the cost estimate has no substitute for.

**Unblocks.** E01-F4 (5 backend-days), E01-F7 and E01-F8.

**Answers.** Q50 stays open. The compute-tier question is closed; the sizing question it was tied to is not.

The prior reasoning here named ADR-0002, ADR-0003, ADR-0005 and ADR-0010 as settled and an unresolved Lambda-versus-EKS divergence as the open piece. That is stale: register 2.1 is the ADR to write, recording the supersession of ADR-0002's serverless-first decision, and there is no EKS-versus-Lambda choice left to make. What remains is Q50, and it is unchanged by the compute decision: an architecture nobody has sized is an architecture nobody can cost.

**E00-F5 Client architecture, and how it stays portable**
`parent: E00 | band: SPRINT0 | discipline: iOS | depends on: none | blocked by: none | status: Not started | size: 3 iOS-days | carries forward: none`

**Question.** iOS ships first and Android is a fast follow, so which layers are written once and which are deliberately per-platform?

**Artifact.** Done, as `architecture.md` section 3b, the platform boundary: everything except the platform edge (secure storage, biometrics, push registration, audio, file access, native config) is written once, and the platform edge is the only place a second implementation is allowed. That section names itself as the artifact this spike asked for and says it should be promoted to a standalone ADR alongside the compute decision (register 2.1). The promotion is the outstanding piece.

**Unblocks.** E02-F2, E03-F2 and E04-F1.

iOS is the only client lane in these eight weeks and there is no Android engineer in the 99. That makes this a decision about what the fast follow costs later, taken now while the codebase is small. Drawing the boundary after three sprints of iOS-shaped code makes Android a rewrite rather than a port.

**E00-F6 Dev environment**
`parent: E00 | band: SPRINT0 | discipline: Platform | depends on: none | blocked by: none | status: Not started | size: 2 days | carries forward: none`

**Question.** What does a developer have working on day one, and how long does it take to get there?

**Artifact.** Done. `handbook/engineering/dev-setup.md` and `developer-bootstrap.md` exist and the bootstrap runs end to end. Register 9.5 decides the property that makes it work: the whole stack runs locally, with no cloud credential anywhere in the development loop.

**Unblocks.** Every lane, on day one. Repository access, toolchain and a running local build are each a way this fails before any feature work starts.

Day one spent on environment setup is day one not spent on the sprint, and it repeats per person. The test for this spike is that someone who has never seen the repository can reach a running build by following the document, without asking anyone.

**E00-F7 Design token handoff**
`parent: E00 | band: SPRINT0 | discipline: Product | depends on: none | blocked by: none | status: Not started | size: 1 day | carries forward: none`

**Question.** What are the final canvas surface, ink row, splash and muted-text tokens?

**Artifact.** A token sheet that the theme pass and the ink palette both read from.

**Unblocks.** The E04-F1 ink palette and the E01-F9 theme pass.

**Answers.** Q1, Q2, Q3, Q4

These are answers the design lead gives rather than artifacts the build lanes produce, so the day is coordination rather than effort. Working sessions are already booked for 2026-08-26 and 2026-08-27, which makes this a dated dependency. If those slip, the theme half of E01-F9 slips into sprint 1 and two iOS-days come back onto a queue that is already full.

The register carries no entry for this spike. Q1 (canvas surface) and Q4
(muted text) have recommended values in `code-questions.md`, paper-white and a
neutral mid-gray, both pending client confirmation, not decided. Q3 (does the
splash animate or ship static) is still open in `tracking/open-questions.md`.

**E00-F8 Security and privacy review**
`parent: E00 | band: SPRINT0 | discipline: AWS | depends on: none | blocked by: none | status: Not started | size: 2 days | carries forward: none`

**Question.** What do family sharing, invites and under-13 accounts require before a single one of them is built?

**Artifact.** Structure and consequences done, register 7.1 to 7.4: under-13 users are in scope, consent is versioned rows rather than a flag, deletion and export are built with the schema, and the mobile security posture is set. ADR-0012 was drafted 2026-09-02 from the shipped mechanism. Two questions inside that ADR are still outstanding: the store-category question and the verifiable-consent method. Register 11 names these two as the largest open items in the whole register.

**Unblocks.** E02, E05 and E16.

Family sharing and invites put minors' content in scope, and under-13 handling is a build requirement rather than later preparation because those users are already in scope, not a future possibility. Retrofitting an age gate onto shipped invite and sharing flows is more expensive than deciding the scope first, and it may be a harder path through App Review.

**E00-F9 Team readiness**
`parent: E00 | band: SPRINT0 | discipline: Delivery | depends on: none | blocked by: none | status: Not started | size: 1 day | carries forward: none`

**Question.** Can every person on the roster build and run on day one, and which calendar days are they actually available?

**Artifact.** A confirmed access checklist and a published holiday calendar.

**Unblocks.** Everything, on 2026-09-02. Outside the 99.

**Answers.** Q7, Q42, Q51

Sprint 1's own start date is still an open question, and so is the release day inside it. The roster's holiday calendar is not published, and one regional holiday would land on the last two days of sprint 1 immediately before the week-four demo. None of that is caught by a spike about architecture.

**E00-F10 Mock-to-real contract drift guard**
`parent: E00 | band: SPRINT0 | discipline: Backend | depends on: none | blocked by: none | status: Not started | size: 0.5 days | carries forward: none`

**Question.** The mock contract is built in Sprint 0 and the real API in sprint 1 by the same engineer, so what stops them diverging after iOS and QA have already coded against the mock?

**Artifact.** Specified, not built: the conformance check is an acceptance criterion on the foundation deliverable, E01-F5, and the code it checks does not exist yet. `engineering-standards.md` section 4 tier 2 is the mechanism: contract tests asserted against `packages/contracts` on both sides. `service-seams.md` section 3 point 5 uses the same trick for adapter conformance and names it explicitly as the same reason: without it, the mock and the real adapter drift and the drift surfaces on first deploy.

**Unblocks.** E03-F2, E06-F4 and the sprint 1 QA execution day.

The whole mock-first sequencing exists so the iOS and QA lanes do not idle behind the backend lane. That only works while the mock and the real API agree, and the check that enforces it is specified but not yet running. The drift would surface as rework in the two lanes the sequencing was meant to protect.

**E00-F11 Close the Aurora gate**
`parent: E00 | band: SPRINT0 | discipline: Backend | depends on: none | blocked by: none | status: Not started | size: 0.5 days | carries forward: none`

**Question.** Closed. Register 2.3 closes the gate in favour of a managed serverless PostgreSQL cluster as the system of record. The prototype's document-store path is not carried forward.

**Artifact.** Done, register 2.3.

**Unblocks.** The E01-F3 applied day, E01-F4 and E02-F1.

Five backend-days of API surface get built on this answer in sprint 1. The relational choice is decided because the data is joins, a person, a wall, a membership, a prompt, a submission, and the two invariants read naturally off a relational transaction. Do not reopen it.

**E00-F12 Channel model**
`parent: E00 | band: SPRINT0 | discipline: Product | depends on: none | blocked by: none | status: Not started | size: 1 day | carries forward: none`

**Question.** Four fixed channels, or channels that users can create?

**Artifact.** Recommendation recorded: register 2.4 and its schema treatment, a join table between submissions and channels, one submission on several walls through rows rather than copies. Q29 in `code-questions.md` gives the working position: do not hardcode a channel limit, four is the floor if one is required, Personal, Family, Friends and Coworkers seed as defaults read as data. Client confirmation is still outstanding.

**Unblocks.** E05 in full.

This is structural rather than a feature toggle. Fixed channels and user-created channels differ in the data model, the authorization rules and the moderation surface. The recommendation is on record; what remains is the client confirming it rather than the team deciding it.

**E00-F13 Moderation fail policy**
`parent: E00 | band: SPRINT0 | discipline: Product | depends on: none | blocked by: none | status: Not started | size: 1 day | carries forward: none`

**Question.** When the moderation service is unavailable, does submission fail open or fail safe?

**Artifact.** A written policy decision.

**Unblocks.** E10.

Register 10b confirms this is still outstanding: a recommendation sits on the open-questions list and the decision itself is not made. The epic is named fail-safe and the register left fail-open against fail-safe per content type as an open gate, so the epic title is currently ahead of the decision. With minors' content in scope this is a policy call before it is an engineering one, and it is not one the build team should make alone.

**E00-F14 Distribution path to testers**
`parent: E00 | band: SPRINT0 | discipline: Delivery | depends on: none | blocked by: none | status: Not started | size: 1 day | carries forward: none`

**Question.** How does a signed build reach Scribl's testers, and how many testers are there?

**Artifact.** A written distribution process, and the developer account request tracked to closure.

**Unblocks.** The sprint 1 TestFlight day, and whether the week-four demo runs on a real device. Outside the 99.

**Answers.** Q45, Q46, Q47, Q56

Three Wednesday demos need a build reaching a human being who is not on the project. The developer account itself is Q5, the single question that blocks more of this plan than any other, and it has no engineering workaround. This spike owns chasing it as well as writing the process.

The build repo and CI moved to `ScriblOrg/scribl-mobile-app` on GitHub, register 9.6. Register 9.3 says GitHub Actions ships hosted macOS runners, so there is no self-hosted-runner phase and no local-iOS-build phase to plan into this process. Any distribution step that assumed Bitbucket Pipelines or a developer's own Mac for the archive step is stale; the archive and signing step runs on a hosted `runs-on: macos-*` job, scoped to that step only because macOS runner minutes bill at roughly ten times the Linux rate.

**E00-F15 Device and OS matrix**
`parent: E00 | band: SPRINT0 | discipline: iOS | depends on: none | blocked by: none | status: Not started | size: 1 iOS-day | carries forward: none`

**Question.** Closed. Register 1.4 decides iPhone 11 and newer, phone first, iPad deferred, as of 2026-08-26.

**Artifact.** Done, register 1.4. Nothing further to write to Scribl beyond what is already recorded there.

**Unblocks.** The E04-F6 size, which section 5 already flags as disputed, and real-device QA.

**Answers.** Q44, Q51

E04-F6 is sized at 2 iOS-days and that holds only while iPad stays out of scope, which register 1.4 confirms. By its own description, iPad in scope would have turned it into a layout pass across every screen in E02 and E05; deferral is what keeps the 2-day size correct.

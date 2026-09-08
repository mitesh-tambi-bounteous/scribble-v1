---
title: "Jira filing draft, 2026-09-02"
project: scribl
type: planning
status: awaiting per-epic approval
updated: 2026-09-02
---

# Jira filing draft, 2026-09-02

Every create and update intended against the SCRIBL Jira project, drawn from
`tracking/backlog-epics.md` and `tracking/backlog-sprint0.md` at `main`
(2297c49, PR 3 merged). Nothing in this file has been written to Jira.
Approval is per epic: mark an epic's checkbox and that section files; leave it
unmarked and that section does not.

The description bodies inside `~~~` fences are the exact text the filing
agents will write. Read them as the ticket, not as a summary of one.

## Live reconciliation, queried 2026-09-02

`project = SCRIBL ORDER BY key ASC`, 78 issues. The 2026-08-25 snapshot in
`scripts/data/jira-scribl.json` (72 issues) is stale and was not trusted;
these counts come from the live query.

| State | Count | Detail |
|---|---|---|
| Epics filed | 9 | E00-E08: SCRIBL-3, 1, 27, 34, 40, 47, 54, 62, 68 |
| Stories filed | 48 | E01 9, E02 6, E03 5, E04 6, E05 6, E06 7, E07 5, E08 4 |
| Spikes filed | 15 | E00-F1..F15: SCRIBL-4..18 |
| Hand-added since the snapshot | 6 | SCRIBL-73..78, no wiki counterpart, untouched by this filing |
| Epics missing | 10 | E09-E18 |
| Stories missing | 64 | E02 9, E03 4, E04 4, E05 7, E09 4, E10 5, E11 4, E12 5, E13 5, E14 4, E15 3, E16 3, E17 4, E18 3 |

Every filed item is stale. PR 3 rewrote all 112 feature bodies (Frontend,
Backend, Reads/writes, QE blocks, GitHub links, register reconciliation), and
the filed descriptions predate it; SCRIBL-31 was sampled to confirm (one
paragraph, no blocks, no links). The E00 spikes were reconciled against the
decision register after filing, so their 15 descriptions are stale too. So
this draft updates all 72 filed issues (the 63 wiki-backed items plus the 9
epics) and creates the 74 missing ones: 146 write operations if every epic
is approved.

One summary changes: SCRIBL-41, "E04-F1 Skia canvas with the six-ink reduced
tool set" -> "E04-F1 Skia canvas with one brush and the client's eight
colors", the wiki's post-retirement title. Every other summary already
matches the wiki exactly (checked by diffing all 78 live summaries against
the wiki titles).

## Filing order

Band order, per `tracking/epic-board-mapping.md`: the band is the filing
order. Within this draft: E00 updates, then GREEN (E01-E08) updates and
creates, then ORANGE creates (E09-E13), then GRAY creates (E14-E18). Creates
inside an epic go in F-number order so `is blocked by` links mostly point at
issues that already exist.

## Execution rules for the filing phase

For the agents that execute approved sections, after Rob's approval and not
before:

1. File approved sections in the order they appear here; inside a section,
   the epic first, then features in F-number order, so `is blocked by`
   targets exist when the link is created.
2. Resolve every `NEW E<nn>` reference to the key Jira returned when that
   item was created in this same run. If a referenced item's section was not
   approved, skip that link and record it as skipped.
3. Links are idempotent: before creating an issue link, read the target
   issue's existing links and skip any that already exist. The 2026-08-25
   filing already created links for the dependencies that existed then
   (verified on SCRIBL-19 and SCRIBL-28), which is why UPDATE entries list
   only new links.
4. Descriptions are the fenced bodies verbatim, markdown. Labels replace the
   full label set with the proposed list. Never touch status, assignee,
   points, or any issue not named in an approved entry.
5. Record every write: issue key, operation, timestamp. The audit diffs that
   record against this draft.

## Deliberately not done

- **No deletes, no closes, no transitions.** Three spikes are In Progress and
  SCRIBL-75 is Done; nothing here touches status.
- **SCRIBL-73..78 untouched.** Two subtasks (73 under SCRIBL-4, 74 under
  SCRIBL-18), one Done feature (75), three client-access spikes (76, 77, 78),
  all hand-added after 2026-08-25 with no wiki counterpart. They look like
  live Sprint 0 work, not candidates for retirement. If the hub should track
  them, that is a wiki edit, not a Jira one.
- **E18-F1, E18-F2, E18-F5 not filed.** Retired 2026-09-02 before ever
  reaching Jira; ids not reused.
- **No assignees, no story points.** The board's rough-points label carries
  the sizing convention; per-person assignment stays human.
- **Register contradictions carried as flags, not resolved.** Each ticket
  that sits on one names it in a "Flagged risk" block.

## E00 Sprint 0, the Shape window -- SCRIBL-3

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-3 E00 Sprint 0, the Shape window
- Action: update
- Summary: unchanged
- Labels: current Delivery,SPRINT0 -> proposed Delivery, SPRINT0 (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The Shape window, named as a sprint. Sprint 1 presumes fifteen decisions that nobody has made, and this epic is those decisions with an owner and a timebox against each. Sprint 1 keeps its 2026-09-02 start and all four demo dates hold.

Six of the fifteen carry source Derived, meaning they came out of a feature-by-feature pass over all 112 features in the backlog asking what decision each sprint 1 item presumes, rather than off anybody's list.

These are spikes rather than features, so they carry no band colour from the kickoff board and no size in lane-days against a feature estimate. A spike is done when its artifact exists, not when its timebox runs out.

The Shape window ran 2026-08-24 to 2026-09-01. Decision register 10b is the standing record of where each spike's artifact stands, and this epic is reconciled against it. Closed against a register entry: dev environment (9.5), close the Aurora gate (2.3), client architecture and portability (architecture.md 3b). Decided but with one input still outstanding: backend architecture (2.1, 2.2; the sizing memo is the open piece). Structure done but with a named gap: security and privacy review (7.1 to 7.4, ADR-0012), channel model (2.4). Specified but not yet built: the mock-to-real contract drift guard. Still outstanding with no decision made: moderation fail policy. E00-F1 and E00-F14 are reconciled to the GitHub-org repo move (register 9.6). E00-F15 is reconciled to the device-matrix decision (register 1.4). E00-F2, E00-F7 and E00-F9 carry no register entry and are left as they were.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00)
Decision register: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
~~~

### UPDATE SCRIBL-4 E00-F1 Lay down the Claude Code harness in the new repo
- Action: update
- Summary: unchanged
- Labels: current Delivery,SPRINT0,rough-points -> proposed Delivery, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** What harness configuration, skills and guardrails does this team adopt, rather than the ones a single engineer runs alone?

**Artifact.** A working Claude Code harness committed to the production repo (ScriblOrg/scribl-mobile-app, not hs2studio -- the repo moved to the client's GitHub org 2026-08-27, decision register 9.6, after this backlog item was written), plus a one-page standard for using it.

**Unblocks.** No sprint 1 item is hard-blocked by this. Every lane inherits the harness on day one, and the two days sit outside the build lanes, so it competes with nothing.

A single-engineer harness is tuned to one person working without review. A team harness needs the review points, the commit conventions and the guardrails that a shared repository implies. Doing it before the repository fills up is cheaper than retrofitting it.

**Size (rough)**: 2 days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F1)
~~~

### UPDATE SCRIBL-5 E00-F2 Arc in the delivery flow
- Action: update
- Summary: unchanged
- Labels: current Delivery,SPRINT0,rough-points -> proposed Delivery, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** Where does Arc sit in the delivery flow, and who uses it for what?

**Artifact.** A written flow with its entry and exit points named.

**Unblocks.** No sprint 1 item is hard-blocked; this sits outside the build lanes.

Arc without a named place in the flow becomes a tool two people use and nobody else knows about. One page saying who opens it, at what point, and what comes out is the whole deliverable.

**Size (rough)**: 1 day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F2)
~~~

### UPDATE SCRIBL-6 E00-F3 Automation framework choice, with the reasoning
- Action: update
- Summary: unchanged
- Labels: current QA,SPRINT0,rough-points -> proposed QA, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** Which automation framework, and why that one rather than the alternatives?

**Artifact.** A tooling recommendation with the alternatives written down and the reasoning for the choice.

**Unblocks.** E06-F3 (3 QA-days) and E06-F6 (2 QA-days), both already recorded as blocked, and the sprint 1 test-execution day.

**Answers.** Q48, Q53

This is E06-F2, four QA-days already inside Sprint 0, so it costs nothing new. It appears here because it is a decision rather than a build task. toolchain.md section 2 has since settled the tool choices this spike was scoping: Jest everywhere as one runner with two projects, Playwright for web E2E against the export, native E2E deferred with Maestro first once it is needed. What this spike still owns is Q48 and Q53. engineering-standards.md section 4 gives the working constraint on Q48: coverage thresholds are set per tier once the shape is real, not as one global number, and the team's coverage bar already has three candidate answers on record from one working session. Do not invent a fourth; settle among the three.

**Undecided, deliberately**
- Q48: the coverage-threshold answer is not settled; three candidate values are on record and none is chosen.
- Q53: open, tracked alongside Q48 in the same spike.

**Size (rough)**: 4 QA-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F3)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/toolchain.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-7 E00-F4 Backend architecture, signed
- Action: update
- Summary: unchanged
- Labels: current Backend,SPRINT0,rough-points -> proposed Backend, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** Closed, and the answer reverses what this spike asked. It asked whether serverless-first Lambda is the committed compute tier. Decision register 2.1 decides one long-running Node HTTP container behind a load balancer, not function-per-route behind an API gateway, and it explicitly supersedes the previously ratified serverless-first decision. Register 2.2 recommends a managed serverless container service over self-managed Kubernetes.

**Artifact.** The signed decision exists at register 2.1 and 2.2. The sizing memo does not: what user base, concurrency and regions the container is sized for. Register 10b names this as the one input the cost estimate has no substitute for.

**Unblocks.** E01-F4 (5 backend-days), E01-F7 and E01-F8.

**Answers.** Q50 stays open. The compute-tier question is closed; the sizing question it was tied to is not.

The prior reasoning here named ADR-0002, ADR-0003, ADR-0005 and ADR-0010 as settled and an unresolved Lambda-versus-EKS divergence as the open piece. That is stale: register 2.1 is the ADR to write, recording the supersession of ADR-0002's serverless-first decision, and there is no EKS-versus-Lambda choice left to make. What remains is Q50, and it is unchanged by the compute decision: an architecture nobody has sized is an architecture nobody can cost.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Undecided, deliberately**
- Q50: the sizing memo (user base, concurrency, regions) is not written; the compute-tier decision does not resolve it.

**Size (rough)**: 2 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F4)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-8 E00-F5 Client architecture, and how it stays portable
- Action: update
- Summary: unchanged
- Labels: current SPRINT0,iOS,rough-points -> proposed iOS, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** iOS ships first and Android is a fast follow, so which layers are written once and which are deliberately per-platform?

**Artifact.** Done, as architecture.md section 3b, the platform boundary: everything except the platform edge (secure storage, biometrics, push registration, audio, file access, native config) is written once, and the platform edge is the only place a second implementation is allowed. That section names itself as the artifact this spike asked for and says it should be promoted to a standalone ADR alongside the compute decision (register 2.1). The promotion is the outstanding piece.

**Unblocks.** E02-F2, E03-F2 and E04-F1.

iOS is the only client lane in these eight weeks. That makes this a decision about what the fast follow costs later, taken now while the codebase is small. Drawing the boundary after three sprints of iOS-shaped code makes Android a rewrite rather than a port.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ -> components/ui/, data/ (query cache), stores/ (Zustand client state), services/ -> contracts/ -> lib/.

**Size (rough)**: 3 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F5)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
~~~

### UPDATE SCRIBL-9 E00-F6 Dev environment
- Action: update
- Summary: unchanged
- Labels: current Platform,SPRINT0,rough-points -> proposed Platform, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** What does a developer have working on day one, and how long does it take to get there?

**Artifact.** Done. handbook/engineering/dev-setup.md and developer-bootstrap.md exist and the bootstrap runs end to end. Register 9.5 decides the property that makes it work: the whole stack runs locally, with no cloud credential anywhere in the development loop.

**Unblocks.** Every lane, on day one. Repository access, toolchain and a running local build are each a way this fails before any feature work starts.

Day one spent on environment setup is day one not spent on the sprint, and it repeats per person. The test for this spike is that someone who has never seen the repository can reach a running build by following the document, without asking anyone.

**Size (rough)**: 2 days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F6)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/dev-setup.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/developer-bootstrap.md
~~~

### UPDATE SCRIBL-10 E00-F7 Design token handoff
- Action: update
- Summary: unchanged
- Labels: current Product,SPRINT0,rough-points -> proposed Product, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** What are the final canvas surface, ink row, splash and muted-text tokens?

**Artifact.** A token sheet that the theme pass and the ink palette both read from.

**Unblocks.** The E04-F1 ink palette and the E01-F9 theme pass.

**Answers.** Q1, Q2, Q3, Q4

These are answers the design lead gives rather than artifacts the build lanes produce, so the day is coordination rather than effort. Working sessions were already booked for 2026-08-26 and 2026-08-27, which makes this a dated dependency. If those slip, the theme half of E01-F9 slips into sprint 1.

The register carries no entry for this spike. Q1 (canvas surface) and Q4 (muted text) have recommended values in code-questions.md, paper-white and a neutral mid-gray, both pending client confirmation, not decided. Q3 (does the splash animate or ship static) is still open in tracking/open-questions.md.

**Undecided, deliberately**
- Q1: canvas surface recommended as paper-white, pending client confirmation.
- Q3: splash animate-or-static, still open.
- Q4: muted text recommended as neutral mid-gray, pending client confirmation.

**Size (rough)**: 1 day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F7)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/code-questions.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-11 E00-F8 Security and privacy review
- Action: update
- Summary: unchanged
- Labels: current AWS,SPRINT0,rough-points -> proposed AWS, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** What do family sharing, invites and under-13 accounts require before a single one of them is built?

**Artifact.** Structure and consequences done, register 7.1 to 7.4: under-13 users are in scope, consent is versioned rows rather than a flag, deletion and export are built with the schema, and the mobile security posture is set. ADR-0012 was drafted 2026-09-02 from the shipped mechanism. Two questions inside that ADR are still outstanding: the store-category question and the verifiable-consent method. Register 11 names these two as the largest open items in the whole register.

**Unblocks.** E02, E05 and E16.

Family sharing and invites put minors' content in scope, and under-13 handling is a build requirement rather than later preparation because those users are already in scope, not a future possibility. Retrofitting an age gate onto shipped invite and sharing flows is more expensive than deciding the scope first, and it may be a harder path through App Review.

**Undecided, deliberately**
- Store-category question inside ADR-0012: not resolved.
- Verifiable-consent method inside ADR-0012: not resolved.

**Size (rough)**: 2 days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F8)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
~~~

### UPDATE SCRIBL-12 E00-F9 Team readiness
- Action: update
- Summary: unchanged
- Labels: current Delivery,SPRINT0,rough-points -> proposed Delivery, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** Can every person on the roster build and run on day one, and which calendar days are they actually available?

**Artifact.** A confirmed access checklist and a published holiday calendar.

**Unblocks.** Everything, on 2026-09-02. Sits outside the build lanes.

**Answers.** Q7, Q42, Q51

Sprint 1's own start date is still an open question, and so is the release day inside it. The roster's holiday calendar is not published, and one regional holiday would land on the last two days of sprint 1 immediately before the week-four demo. None of that is caught by a spike about architecture.

**Undecided, deliberately**
- Q7, Q42, Q51: sprint 1 start date, release day, and the holiday calendar are all still open.

**Size (rough)**: 1 day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F9)
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-13 E00-F10 Mock-to-real contract drift guard
- Action: update
- Summary: unchanged
- Labels: current Backend,SPRINT0 -> proposed Backend, SPRINT0, rough-points (changed: add rough-points, the wiki sizes this spike at 0.5 days)
- New issue links: none
- New description (full replacement):

~~~
**Question.** The mock contract is built in Sprint 0 and the real API in sprint 1 by the same engineer, so what stops them diverging after iOS and QA have already coded against the mock?

**Artifact.** Specified, not built: the conformance check is an acceptance criterion on the foundation deliverable, E01-F5, and the code it checks does not exist yet. engineering-standards.md section 4 tier 2 is the mechanism: contract tests asserted against packages/contracts on both sides. service-seams.md section 3 point 5 uses the same trick for adapter conformance and names it explicitly as the same reason: without it, the mock and the real adapter drift and the drift surfaces on first deploy.

**Unblocks.** E03-F2, E06-F4 and the sprint 1 QA execution day.

The whole mock-first sequencing exists so the iOS and QA lanes do not idle behind the backend lane. That only works while the mock and the real API agree, and the check that enforces it is specified but not yet running. The drift would surface as rework in the two lanes the sequencing was meant to protect.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.
Contract tests against packages/contracts, asserted on both sides, so the mock server and the real API cannot drift.

**Size (rough)**: 0.5 days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F10)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
~~~

### UPDATE SCRIBL-14 E00-F11 Close the Aurora gate
- Action: update
- Summary: unchanged
- Labels: current Backend,SPRINT0 -> proposed Backend, SPRINT0, rough-points (changed: add rough-points, the wiki sizes this spike at 0.5 days)
- New issue links: none
- New description (full replacement):

~~~
**Question.** Closed. Register 2.3 closes the gate in favour of a managed serverless PostgreSQL cluster as the system of record. The prototype's document-store path is not carried forward.

**Artifact.** Done, register 2.3.

**Unblocks.** The E01-F3 applied day, E01-F4 and E02-F1.

Five backend-days of API surface get built on this answer in sprint 1. The relational choice is decided because the data is joins, a person, a wall, a membership, a prompt, a submission, and the two invariants read naturally off a relational transaction. Do not reopen it.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 0.5 days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F11)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
~~~

### UPDATE SCRIBL-15 E00-F12 Channel model
- Action: update
- Summary: unchanged
- Labels: current Product,SPRINT0,rough-points -> proposed Product, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** Four fixed channels, or channels that users can create?

**Artifact.** Recommendation recorded: register 2.4 and its schema treatment, a join table between submissions and channels, one submission on several walls through rows rather than copies. Q29 in code-questions.md gives the working position: do not hardcode a channel limit, four is the floor if one is required, Personal, Family, Friends and Coworkers seed as defaults read as data. Client confirmation is still outstanding.

**Unblocks.** E05 in full.

This is structural rather than a feature toggle. Fixed channels and user-created channels differ in the data model, the authorization rules and the moderation surface. The recommendation is on record; what remains is the client confirming it rather than the team deciding it.

**Engineering context**
Invariant tests are launch gates and are written before the feature (engineering-standards.md section 4). All authorization runs through backend/src/authz/, the single choke point.

**Undecided, deliberately**
- Q29: client confirmation of the channel-model recommendation is still outstanding.

**Size (rough)**: 1 day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F12)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/code-questions.md
~~~

### UPDATE SCRIBL-16 E00-F13 Moderation fail policy
- Action: update
- Summary: unchanged
- Labels: current Product,SPRINT0,rough-points -> proposed Product, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** When the moderation service is unavailable, does submission fail open or fail safe?

**Artifact.** A written policy decision.

**Unblocks.** E10.

Register 10b confirms this is still outstanding: a recommendation sits on the open-questions list and the decision itself is not made. The epic is named fail-safe and the register left fail-open against fail-safe per content type as an open gate, so the epic title is currently ahead of the decision. With minors' content in scope this is a policy call before it is an engineering one, and it is not one the build team should make alone.

**Undecided, deliberately**
- The fail-open vs fail-safe policy, per content type, is not decided; only a recommendation is on record.

**Size (rough)**: 1 day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F13)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-17 E00-F14 Distribution path to testers
- Action: update
- Summary: unchanged
- Labels: current Delivery,SPRINT0,rough-points -> proposed Delivery, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** How does a signed build reach Scribl's testers, and how many testers are there?

**Artifact.** A written distribution process, and the developer account request tracked to closure.

**Unblocks.** The sprint 1 TestFlight day, and whether the week-four demo runs on a real device. Sits outside the build lanes.

**Answers.** Q45, Q46, Q47, Q56

Three Wednesday demos need a build reaching a human being who is not on the project. The developer account itself is Q5, the single question that blocks more of this plan than any other, and it has no engineering workaround. This spike owns chasing it as well as writing the process.

The build repo and CI moved to ScriblOrg/scribl-mobile-app on GitHub, register 9.6. Register 9.3 says GitHub Actions ships hosted macOS runners, so there is no self-hosted-runner phase and no local-iOS-build phase to plan into this process. Any distribution step that assumed Bitbucket Pipelines or a developer's own Mac for the archive step is stale; the archive and signing step runs on a hosted runs-on: macos-* job, scoped to that step only because macOS runner minutes bill at roughly ten times the Linux rate.

**Undecided, deliberately**
- Q5: the developer account request is not closed; it blocks distribution and TestFlight.
- Q45, Q46, Q47, Q56: distribution details tracked alongside Q5.

**Size (rough)**: 1 day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F14)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-18 E00-F15 Device and OS matrix
- Action: update
- Summary: unchanged
- Labels: current SPRINT0,iOS,rough-points -> proposed iOS, SPRINT0, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
**Question.** Closed. Register 1.4 decides iPhone 11 and newer, phone first, iPad deferred, as of 2026-08-26.

**Artifact.** Done, register 1.4. Nothing further to write beyond what is already recorded there.

**Unblocks.** The E04-F6 size, which is already flagged as disputed, and real-device QA.

**Answers.** Q44, Q51

E04-F6 is sized at 2 iOS-days and that holds only while iPad stays out of scope, which register 1.4 confirms. By its own description, iPad in scope would have turned it into a layout pass across every screen in E02 and E05; deferral is what keeps the 2-day size correct.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ -> components/ui/, data/ (query cache), stores/ (Zustand client state), services/ -> contracts/ -> lib/.

**Size (rough)**: 1 iOS-day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-sprint0.md (E00-F15)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
~~~

# E01 and E03 -- Jira filing draft

## E01 Cloud foundation and app shell -- SCRIBL-1

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-1 E01 Cloud foundation and app shell
- Action: update
- Issue type: Epic
- Summary: unchanged
- Labels: current Backend-and-AWS,GREEN -> proposed Backend-and-AWS, GREEN (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Cloud foundation and app shell: the AWS environments, the data model, the
API, and the app shell everything else builds on.

**Flagged risk (register contradiction, not resolved here)**
- The epic description previously cited ADR-0002, serverless-first, API
  Gateway plus Lambda. Decision register 2.1 supersedes that: one
  long-running Node HTTP service in a container behind a load balancer, on
  a managed serverless container service per 2.2, not function-per-route.
  That supersession is the heaviest single decision in the register, per
  its own "if you read only one section" note, and it changes E01-F4's
  shape.
- The IaC tool (E01-F2) is separately contested: ADR-0005 names CDK, the
  shipped repo's infra/README.md names Terraform, tracked as A10 in
  code-questions.md.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/code-questions.md
~~~

### UPDATE SCRIBL-2 E01-F1 AWS accounts and three environments
- Action: update
- Summary: unchanged
- Labels: current AWS,GREEN,Q17,Q49,rough-points -> proposed AWS, GREEN, Q17, Q49, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Three accounts or three isolated environments (dev, staging, prod) with
billing visible per environment. Two things are unknown and neither is
ours to decide: whether the accounts come from Scribl, from their AWS
representative through the funding relationship, or from Bounteous in the
interim (Q17), and who pays for hosting during this phase, not yet
allocated (Q49). Both stay open, undecided, no source resolves them.

Work in every other feature of this epic queues behind this one, so it is
the first thing to close in discovery.

**Backend**  No implementation until Q17 and Q49 close. When they do, this
feature provisions the three environments and wires billing visibility per
environment.
**QE (draft)**  No test surface exists yet. Once accounts land, an
integration check confirms each environment is isolated (no shared
resource reachable across dev, staging, prod).

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.

**Undecided, deliberately**
- Q17: whether the AWS accounts come from Scribl, their AWS representative,
  or Bounteous in the interim.
- Q49: who pays for hosting during this phase, not yet allocated.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F1)
- Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-19 E01-F2 CDK stack skeleton
- Action: update
- Summary: unchanged
- Labels: current AWS,GREEN,rough-points -> proposed AWS, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The stack layout: networking, data, api, events and observability,
parameterized per environment. Doing this before any service exists is
what makes the staging environment real: with three demos to Scribl in
eight weeks, a demo build has to come off a deployed environment rather
than off someone's laptop.

The IaC tool is undecided, not CDK by default. ADR-0005 names AWS CDK in
TypeScript, but the shipped scribl-mobile-app repo's infra/README.md names
Terraform instead, and infra/ has no CDK app. code-questions.md A10 tracks
this and says it cannot be resolved by guessing: either Terraform was a
deliberate switch, in which case ADR-0005 needs a superseded banner, or it
is scaffolding drift that should be redone in CDK before real AWS account
IDs exist. This feature waits on that answer rather than picking one.

**Backend**  Whichever tool is confirmed, the stack covers networking
(VPC, load balancer), data (the Postgres cluster from E01-F3), the
container service, an events path, and the observability floor from
E01-F8, each parameterized by environment.
**QE (draft)**  Integration test: applying the stack to a fresh environment
produces a reachable load balancer and a reachable database, with no
manual step. Contract test: the parameterization surfaces the same
resource shape in dev, staging and prod, differing only by size and count.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.

**Flagged risk (register contradiction, not resolved here)**
- ADR-0005 names CDK in TypeScript for infrastructure as code; the shipped
  repo's infra/README.md names Terraform instead, with no CDK app present.
  Tracked as code-questions.md A10. Not resolved here.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F2)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/code-questions.md
~~~

### UPDATE SCRIBL-20 E01-F3 Relational data model
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A managed serverless PostgreSQL cluster with the schema the loop needs:
users, channels, memberships, prompts, submissions, the multi-channel share
join table, and reactions. Register 2.3 closes the Aurora-versus-DynamoDB
gate that ADR-0004 left open: relational is decided, the prototype's
document-store path is not carried forward. The schema work should target
Postgres directly rather than hedging for portability the register no
longer asks for. The join table (register 2.4) is not a detail: it is what
makes one submission appear on three walls without three copies of the
artwork, and it is what keeps deletion coherent, since removing a
submission removes it everywhere.

**Backend**  repositories/ owns all SQL, parameterized, nowhere else, per
architecture.md's dependency rule. Tables are snake_case plural.
**QE (draft)**  Invariant test, launch gate written first: submit-to-unlock
is a transactional existence check at the data layer (register 4.1) and
cannot be bypassed. Integration tests on repositories against a real local
Postgres, not mocked SQL, covering the join table's multi-wall read and the
cascade on delete.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Invariant tests are launch gates and are written before the feature
  (engineering-standards.md section 4). All authorization runs through
  backend/src/authz/, the single choke point.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F3)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
~~~

### UPDATE SCRIBL-21 E01-F4 Serverless API surface
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The request and response path for the loop endpoints: today's prompt,
submit, channel read, membership, reactions. The title says "Serverless
API surface" and that title is stale. It was written against ADR-0002's
API Gateway plus Lambda design, which register 2.1 supersedes. The
decision of record is one long-running Node HTTP service in a container
behind a load balancer, run on a managed container service per register
2.2, not function-per-route behind a gateway. Layers are routes/
(validate, authorize, delegate, no logic, no SQL) -> authz/ (the single
authorization choke point) -> services/ -> repositories/ -> effects/. The
AI service is deliberately not in this path; ADR-0003 puts Claude work in
a separate service and ADR-0010 makes it asynchronous, so submit never
waits on a model.

**Backend**  POST /submissions, GET /prompts/today, GET /channels/:id,
POST /channels/:id/memberships, POST /submissions/:id/reactions, each
validated and authorized in routes/ before any service call.
**QE (draft)**  Invariant test, launch gate written first: channel
isolation runs through the one authz module (register 4.2), with a test
asserting backend/src/authz/ cannot import the flag client (register 4.3).
Contract tests against packages/contracts, asserted on both sides, so the
mock server in E01-F5 and this real API cannot drift once both exist.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Invariant tests are launch gates and are written before the feature
  (engineering-standards.md section 4). All authorization runs through
  backend/src/authz/, the single choke point.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Flagged risk (register contradiction, not resolved here)**
- This feature's summary and prior description carried the title
  "Serverless API surface" written against ADR-0002 (API Gateway plus
  Lambda). Decision register 2.1 supersedes that design with one
  long-running Node HTTP container behind a load balancer. The title is
  kept stale by instruction; the body above reflects the register-2.1
  decision. Not resolved here.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F4)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### UPDATE SCRIBL-22 E01-F5 API contract and mock server
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A written request and response contract for every endpoint in E01-F4, plus
a mock server that answers it, built in packages/contracts. This exists
because of the capacity shape rather than because contracts are tidy: with
one iOS engineer and one backend engineer, whoever finishes first waits on
the other. A mock server means iOS codes against a stub in sprint 1 and QA
writes API-level tests before the real API exists. Build it before the
endpoints, not after.

Register 10b lists this spike's artifact, the mock-to-real contract drift
guard, as specified but not built: it is an acceptance criterion on the
foundation deliverable with no code behind it yet, because the code that
would need it does not exist. This feature is where it gets built.

**Backend**  packages/contracts holds the schema for every endpoint in
E01-F4. The mock server answers against that same schema, not a hand-rolled
copy.
**QE (draft)**  Contract tests asserted against packages/contracts on both
the mock server and, once E01-F4 ships, the real API, so the two cannot
drift. This is the tier-2 obligation for the whole backlog. Any feature
crossing the app/backend boundary carries it, and this feature is where
the conformance check that runs when the real API lands gets written.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F5)
~~~

### UPDATE SCRIBL-23 E01-F6 Media storage and delivery
- Action: update
- Summary: unchanged
- Labels: current AWS,GREEN,rough-points -> proposed AWS, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
S3 for artwork with presigned PUT on submit and short-lived signed CDN URLs
on read over a private bucket, thumbnails generated on upload (register
2.5). The POC put images in database text columns; at wall-grid scale that
is the first thing to fall over, so the rebuild starts with the bucket.
Retention and thumbnail sizes are set here because the wall grid in E05
reads thumbnails only, never originals.

**Backend**  effects/ owns the S3 presign and the thumbnail generation
trigger. The client media port has no URL-building method. Reads return
server-issued signed URLs, never a client-constructed one.
**QE (draft)**  Contract tests against packages/contracts for the presign
response shape, both sides. Integration test: an uploaded original produces
a thumbnail before the wall grid's read path can reach it.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F6)
~~~

### UPDATE SCRIBL-24 E01-F7 Deploy automation
- Action: update
- Summary: unchanged
- Labels: current GREEN,Platform,rough-points -> proposed GREEN, Platform, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
One command, or one merge, deploys the stack to an environment. The
previous proposal here was Bitbucket Pipelines, "because the code already
lives in Bitbucket." That is stale. Register 9.6 puts the repository and
CI/CD on the client's GitHub org, decided 2026-08-27 and confirmed with the
client, and the repo has since moved. The real pipeline shape is in
ci-cd.md: GitHub Actions, AWS auth through GitHub OIDC role assumption with
no stored keys, the backend container tagged with the commit sha and
pushed to ECR, database migrations as an explicit gated step that never
runs on service start, then deploy, then a smoke check against /health.
This is the same decision as E07-F2 seen from the server side, made once
here.

**Backend**  Main-branch pipeline: install, typecheck, lint, test, web
export, backend container build, tag with commit sha, push to ECR, run
migrations (gated), deploy, smoke-check /health.
**QE (draft)**  Integration test: a migration run twice is idempotent.
Pipeline test: a deploy to staging with a failing /health check does not
promote, and rolls back to the previous known-good tagged image.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F7)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/ci-cd.md
~~~

### UPDATE SCRIBL-25 E01-F8 Baseline observability
- Action: update
- Summary: unchanged
- Labels: current GREEN,Platform,rough-points -> proposed GREEN, Platform, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Structured request logging, one log group per environment, and alarms on
error rate and service health, per register 6.4, which decided this floor
deliberately rather than by omission. service-seams.md confirms real-user
monitoring is out of scope for this phase (2026-08-31) and that 6.4 stands
unamended. The richer observability stack in the future-state docs, managed
Prometheus, managed Grafana, X-Ray, is the scale-up target for a
multi-region build and is not in this epic; building it now would be
infrastructure nobody has asked for. This scope was confirmed in the
2026-08-20 walkthrough.

**Backend**  One log group per environment, structured JSON request logs,
a dashboard and alarms on API error rate and service health for the
container from E01-F4.
**QE (draft)**  Integration test: a forced 5xx response trips the error
rate alarm within its evaluation window. Unit test on the log formatter in
lib/ for the structured shape.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F8)
~~~

### UPDATE SCRIBL-26 E01-F9 App shell, routing and the single brand theme
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q1,Q3,Q4,iOS,rough-points -> proposed GREEN, iOS, Q1, Q3, Q4, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A React Native app with the full route graph reachable, one theme, and
error states that never leave a blank screen. One theme, not four: the POC
carries four runtime themes and none of them match the client's deck, so
the rebuild starts from the deck values (#1D1A34 ink, #D51668 magenta,
#F8F8FA surface, Nunito and Prompt) recorded in the POC realignment plan
section 1. Three design values are still open and cheap to change now,
expensive to change everywhere later: the canvas surface color (Q1),
whether the splash animates (Q3), and the muted text value (Q4). Session
hydration is the four-state discriminated union from register 5.4,
restoring, locked, authenticated, anonymous, and no component reaches a raw
token; tokens stay inside the auth adapter and HTTP client.

**Frontend**  app/ holds thin routes only. Shell chrome is a ScreenHeader
and bottom nav around every route. Each route group carries an error
boundary so a thrown error never leaves a blank screen; the not-found
route is the one screen page for that behavior, a themed ghost icon, a
heading, one line of body copy, and a single Back to Today button in a
centered card with no header chrome.
**Backend**  None for the shell or the not-found route, which is a
client-only route guard with no journey pointed at it.
**Reads/writes**  Reads the session union on every route mount to decide
chrome and gating. The not-found route reads only the active theme color
for its icon and writes nothing; its one control does router.replace back
to the root route.
**QE (draft)**  Unit tests on the session-union selectors in lib/,
near-full coverage, since every route depends on them. Component test: a
route that throws renders its error boundary's fallback, not a blank
screen. Happy path: a broken or stale link resolves to the not-found route,
and tapping Back to Today returns to root.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.

**Undecided, deliberately**
- Q1: the canvas surface color, still open.
- Q3: whether the splash animates, still open.
- Q4: the muted text value, still open.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E01-F9)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/not-found.md
- Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

## E02 Auth and onboarding -- SCRIBL-27

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-27 E02 Auth and onboarding
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS-and-Backend -> proposed GREEN, iOS-and-Backend (unchanged)
- New issue links: none
- New description (full replacement):

~~~
An account, and the first two minutes that decide whether someone comes back
tomorrow. The client's own Figma flow is better than the POC's here: theirs
opens on a personalized invite ("Matthew has invited you to their Family
wall", "Hi Sarah"), walks a guided first drawing, and lands that drawing on
the inviter's wall. The POC shows a static three-panel tutorial.

Decision register 3.4 does not settle which flow ships. It records a
POSITION, not a decision: invite by email is the entry path and the client's
eight-screen guided onboarding (E02-F4) is deferred, because deferring it
releases the single largest item on the client-side critical path. The
trade-off is stated plainly in the register too, that the guided flow is the
strongest part of the client's design and deferring it means a new person
signs in to a bare prompt screen. This epic description previously argued for
adopting the client's flow outright. Both readings are defensible. Do not
resolve this here; E02-F4 carries the same conflict on its own body, and
register 3.4 is the place to settle it before sprint 1.

Federation is out. The plan of record is backend-managed email and password on
a managed user pool, no Apple or Google sign-in, federation left to a later
phase (register 3.1). Session state on the client is a four-state
discriminated union, restoring, locked, authenticated, anonymous, never a
user object plus loading booleans (register 5.4, engineering-standards.md
section 1). Tokens never reach a component: refresh token in Keychain or
Keystore, access token in memory only, never AsyncStorage, never logged
(engineering-standards.md section 5).

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### UPDATE SCRIBL-28 E02-F1 Email and password accounts
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Sign-up, sign-in with real credential validation, and a sign-out to sign-in
round trip that actually works, on a managed user pool with email and
password only (register 3.1). The POC stubbed this and the rebuild cannot:
every other feature's authorization checks read the identity this feature
issues.

**Frontend**  The sign-up and log-in toggle with shared email and name
fields, a primary submit button whose label follows the active mode. The
POC's existing-user picker and demo new-user toggle are a different feature,
E02-F14, and do not belong here since a real user pool needs credentials to
pick an account.
**Backend**  `POST /auth/signup` and `POST /auth/login` against the user
pool, validating email and password rather than the POC's email-plus-name
match.
**Reads/writes**  Writes the issued session into the auth adapter, never a
component; nothing is read on entry.
**QE (draft)**  Happy path: valid email and password creates an account and
signs it in. Edge: a login attempt with a wrong password is rejected with no
account detail leaked in the error. Contract test against
`packages/contracts` for the signup and login request and response shapes,
since this is the app-to-backend boundary every later feature depends on.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 3 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F1)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/sign-up.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f1-launch-and-authentication.md
~~~

### UPDATE SCRIBL-29 E02-F2 Token issuance and native secure storage
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS,rough-points -> proposed GREEN, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Tokens issued on sign-in, held in the platform secure store through the
native secure-storage seam, refreshed without bouncing the user to a login
screen. This is what makes "open the app and draw" a two-second action
instead of a login, and it owns the identity facts in register 3.1 to 3.3:
refresh token in Keychain on iOS or Keystore on Android, access token in
memory only, never persisted, never logged, never AsyncStorage, never
redux-persist. Biometrics gate the release of a stored credential and are
not a factor the server trusts; the server never accepts a client-asserted
biometric claim. MFA is deferred with the interface present (register 3.3).
`service-seams.md` marks `auth` as the one seam whose swap point is
unavoidably in-app, and `architecture.md` section 3b names secure storage as
a platform-edge adapter, so the Android fast-follow is an adapter swap
behind the same interface, with `Platform.OS` checks confined to
`services/`.

**Frontend**  Session hydration exposed as the four-state discriminated
union, restoring, locked, authenticated, anonymous (register 5.4), never a
user object plus loading booleans. The root screen reads this state to
decide between a loading spinner, the prompt body, and a bounce to sign-up;
it must show only the spinner during `restoring` and never flash the prompt.
**Backend**  Token issuance rides `POST /auth/login` from E02-F1; refresh
and revocation live behind the `auth` seam's cloud adapter, selected by one
build-time variable per `service-seams.md`.
**Reads/writes**  Reads the hydrated session and current user; writes
nothing from a component, since no component can hold a raw token.
**QE (draft)**  Invariant test, written first per engineering-standards.md
section 4: no component-reachable API can return a raw token, and the
biometric gate cannot resolve an auth challenge. Happy path: a signed-in
person with an unsubmitted day sees the prompt, countdown and streak with an
"Open the canvas" button. Edge: hydration not yet finished shows only a
spinner. Edge: hydration finishes with no user and the screen replaces
itself with sign-up rather than flashing the prompt.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size (rough)**: 3 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F2)
Screens: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/root-today.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/sign-up.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f1-launch-and-authentication.md
~~~

### UPDATE SCRIBL-30 E02-F3 Invite token backend
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,Q8,rough-points -> proposed Backend, GREEN, Q8, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Create an invite for a wall, resolve a token to inviter, wall and prompt, and
expire it. This carries "Matthew has invited you" and "a prompt Matthew
chose for you" into onboarding, and it is the reason the flow feels personal
at all. Q8 is open on whether the client funds this plus the small hosted
landing page the invite link needs; if not, the fallback is a typed invite
code, cheaper and less personal. The POC's invite is theater: no email
leaves the device, so this is new backend work, not a rebuild of something
that already sends mail.

**Frontend**  On `/create-wall`: a wall-name input, an invite-by-email input
parsing comma, semicolon or space separated addresses, a Create wall button
disabled until the name is non-empty, and a per-address error row for a
failed invite. This is the only door to wall creation in the app.
**Backend**  `POST /walls` returns a server id; `POST /walls/:id/invites`
takes one address at a time. Invite delivery is real email in this feature,
not the simulated store. Token resolution reads inviter, wall and prompt for
the accept screen in E02-F5.
**Reads/writes**  Success writes a wall row and invite rows; a stale session
at submit time signs the user out and returns them to sign-up rather than
silently failing.
**QE (draft)**  Happy path: a wall name and one or more valid addresses
creates the wall and issues invites, wall creation succeeding independent of
any single address failure. Edge: an unparsable address shows an error
against only that row. Contract test on the invite-create and invite-resolve
shapes in `packages/contracts`, since E02-F5's accept screen depends on the
same shape.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 3 backend-days

**Undecided, deliberately**
Q8: whether the client funds the invite backend and the hosted landing page
it needs; without funding the fallback is a typed invite code.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F3)
Screens: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/create-wall.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/invite-id.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f3-invite-and-join.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-31 E02-F4 Guided onboarding, screens 1 to 8
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q10,Q11,iOS,rough-points -> proposed GREEN, iOS, Q10, Q11, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Splash, personalized welcome, prompt introduction, the guided first canvas,
story input, the wall explanation with its share-to checklist, and the ready
screen. Frame order comes from stepping the client's live prototype end to
end on 2026-08-20, so it is their order, not ours.

This feature sits directly on the epic's unresolved conflict. Decision
register 3.4 is a POSITION, not a decision: invite by email is the entry
path and this eight-screen guided flow is deferred, because deferring it
releases the single largest item on the client-side critical path. This
feature sits in the GREEN band against that position with a 5 iOS-day
estimate, as if the flow were adopted rather than deferred. The register's
own trade-off says the guided flow is the strongest part of the client's
design and deferring it leaves a new person at a bare prompt screen. Both
readings are defensible. This body does not resolve it; register 3.4 has to,
before sprint 1.

Two further gaps: the "Get Inspired" examples branch has no frame at all
(Q10), and the board never put onboarding in the FIRST group despite it
being a live sticky and named new design work (Q11). Client screen feedback
from 2026-08-25 adds two more open questions, whether the post-signin Home
and Profile buttons should skip the daily prompt, and whether the login and
intro screens want animation. All four stay open here.

The story-select fork (screen 5) is covered separately at E02-F10 since
E04-F3 ships without the record option it offers. Step persistence and
resume are covered separately at E02-F15.

**Frontend**  Eight screens in sequence: splash, welcome, prompt intro,
canvas, story select, story, walls, ready. Each screen persists its own step
name on mount so a relaunch resumes mid-flow (see E02-F15), and several
redirect back to the canvas step if the draft they depend on is missing.
**Backend**  `GET /prompt/today` backs the intro and canvas screens with no
cached fallback, so a failed fetch strands a first run in a retry loop.
`POST /submit` on the walls screen accepts prompt id, caption or audio,
strokes, and chosen wall ids, and is where the first Scribl actually posts,
not on the ready screen.
**Reads/writes**  The in-progress drawing, prompt id and caption live in
`useDraftStore`, not a route param, and are cleared on a successful submit.
**QE (draft)**  Happy path: stepping welcome through ready with a drawing
and a caption ends on the invited wall or the root screen. Edge: a missing
draft on story, story-select or walls redirects to canvas. Edge: a failed
prompt fetch on canvas or prompt-intro shows a retry control, never a
stranded blank screen. Contract test on the `POST /submit` shape against
`packages/contracts`, since E04-F4 owns the same call.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 5 iOS-days

**Undecided, deliberately**
Q10: whether the "Get Inspired" examples gallery is in scope, and what goes
in it; no Figma frame exists for where it leads.
Q11: whether onboarding and the invited-user flow belong in the first group
of work, despite being a live sticky and named new design work.

**Flagged risk (register contradiction, not resolved here)**
This feature carries a 5 iOS-day GREEN-band estimate as if register 3.4
adopted the client's eight-screen guided flow, while register 3.4 itself
only records a POSITION deferring that flow in favor of invite-by-email as
the entry path. Register 3.4 has to settle which flow ships before sprint 1.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F4)
Screens: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/splash.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-welcome.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-prompt-intro.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-canvas.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-story.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-walls.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-ready.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f2-first-run-onboarding.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-32 E02-F5 Invite redemption and the invite-code fallback
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q8,Q9,iOS,rough-points -> proposed GREEN, iOS, Q8, Q9, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Open an invite link, land in the right wall with the right names in the
copy, and ask "have an invite code?" on first launch when the link did not
survive the App Store install. Deferred deep linking with install
attribution would remove that fallback question entirely and nobody has
funded it (Q9), so the plan of record is the light version with an extra
step documented rather than hidden.

The invite id in the route is untrusted input. `engineering-standards.md`
section 5 requires parsing it with a schema and authorizing the destination
server-side before rendering the accept card; a link that navigates
straight to a wall by id is an access control bug with a UI on it. The
resolver lives in the app's one deep-link module, `linking/`
(`architecture.md` section 2), not inline in the screen.

**Frontend**  On `/home`: the greeting header, stats card, wall list with a
pending-invite row that opens `/invite/[id]`, and a Try again control
retrying all four loads on failure. On `/invite/[id]`: the accept card, a
solid Accept and join button, a Not now link, and a no-longer-available
state for an id the backend refuses.
**Backend**  The invite-resolve endpoint from E02-F3 validates the token
against the caller's identity before returning wall or prompt detail; an id
that does not resolve, or resolves to a wall the caller has no standing on,
returns the no-longer-available response rather than any wall detail.
**Reads/writes**  Home reloads walls and pending invites on every focus so a
just-accepted invite is never stale. Accept flips the invite to accepted and
routes to onboarding or the wall by whether onboarding is complete; Not now
writes nothing.
**QE (draft)**  Invariant test, written first: an invite id for a wall the
caller cannot join is refused server-side, never rendered. Happy path: the
four home loads succeed and a pending invite is badged. Edge: one load
failing surfaces one retry control for all four. Edge: an invite id with no
matching record shows no-longer-available.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 3 iOS-days

**Undecided, deliberately**
Q8: whether the client funds the invite backend and the hosted landing page
this flow needs.
Q9: whether zero-friction invite redemption with deep-link install
attribution is expected, versus the lighter invite-code fallback that is
the current plan of record.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F5)
Screens: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/home.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/invite-id.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f3-invite-and-join.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md, https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-33 E02-F6 Account deletion and data export
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Delete the account and everything in it, and export a person's own
creations. This sits in the green band rather than with the gray compliance
epic because register 7.3 puts deletion, export and the moderation
substrate in the schema from the start, and retrofitting deletion across a
schema costs multiples of building it in. `release-readiness.md` section 5
names in-app account deletion as an App Store 5.1.1 requirement, and
section 2 additionally requires a web-accessible deletion path for the
Google Play submission, a thin client over this same endpoint.

**Backend**  `DELETE /users/me` cascades to the caller's images in object
storage, submissions, and wall membership; authorizes from the caller's own
identity through `backend/src/authz/`, the same choke point E02-F12 uses,
never a client-supplied id. `GET /users/me/export` returns the caller's own
submissions and strokes.
**QE (draft)**  Invariant test, written first per engineering-standards.md
section 4: deletion authorizes on the caller's own id and a request for
another user's account is refused before any row is touched. Happy path: a
delete request removes the user row, the submission rows, and the S3
objects, and a follow-up sign-in fails. Edge: an export request returns
every submission the caller made and nothing belonging to anyone else.
Integration test against a real local Postgres for the cascade, not mocked
SQL.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size (rough)**: 2 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F6)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### CREATE E02-F7 Draw your own avatar and save it to the profile
- Action: create
- Issue type: Story
- Summary: E02-F7 Draw your own avatar and save it to the profile
- Parent: SCRIBL-27
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-41 (E04-F1); is blocked by SCRIBL-42 (E04-F2)
- Description:

~~~
Reuse the drawing canvas to draw an avatar, crop it to the profile circle,
and save it on the user record. The POC's canvas is bigger than the circle
it crops to, so a person can draw outside the visible guide and lose that
work; the rebuild sizes the canvas to the crop instead of clipping after the
fact. The POC also crops correctly only on web: the crop helper is a no-op
on native, so a native save today PATCHes the full uncropped export.

The avatar payload itself contradicts register 2.5. The POC PATCHes the
avatar as a base64 data URI directly onto the user record, which puts an
image in the database and means every profile read now carries image bytes.
Register 2.5 requires images in object storage with presigned upload and
signed CDN URLs, never in the database. This feature's PATCH has to upload
to storage and store a reference, not the bytes; see the same contradiction
noted on E02-F12.

**Frontend**  The DrawPad canvas sized to the circular crop guide, the full
palette, an undo control, and a Save avatar button showing a Saving state
while busy. An error line renders below the canvas on a failed save; the
back arrow exits with no confirmation.
**Backend**  A self-only `PATCH /users/me/avatar` accepts an image upload
(a presigned object-storage PUT, not a data URI body) and returns the
updated profile with a CDN reference.
**Reads/writes**  On save, the cropped image uploads and the local user
mirrors the server response; failure leaves the person on the canvas with
an error shown. Cancel writes nothing.
**QE (draft)**  Happy path: drawing inside the guide and saving shows the
busy state then returns to settings. Edge: a failed save keeps the canvas
open with an error, never a silent loss. Edge: the exported crop matches the
circle on both iOS and Android, closing the native no-op defect. Component
test on the crop boundary, not a snapshot of the canvas tree.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Flagged risk (POC pattern contradicts register 2.5)**
The POC PATCHes the avatar as a base64 data URI onto the user record.
Register 2.5 requires images in object storage with presigned upload and a
signed CDN reference, never in the database, and this ticket's Backend
block follows the register. The risk is the POC pattern being carried
forward in the rebuild; E02-F12 carries the same risk.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F7)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/avatar.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f8-account-and-profile.md
~~~

### CREATE E02-F8 Reach an invite from outside the app
- Action: create
- Issue type: Story
- Summary: E02-F8 Reach an invite from outside the app
- Parent: SCRIBL-27
- Labels: GREEN, iOS, Q8
- Issue links: is blocked by SCRIBL-30 (E02-F3); is blocked by SCRIBL-32 (E02-F5)
- Description:

~~~
The only route to the invite screen today is a wall row inside the
signed-in app, so accepting an invite needs an account you already have.
This builds the out-of-app half: the invite email, the hosted landing page,
and the link into the accept screen. A prior review's finding holds against
the source: the transport under the button is a single-device local-storage
illusion with no entry point from outside the app at all.

This is exactly the worked example in `feature-flags.md` section 1: a
release flag, `invite.hosted_landing`, ships the deep-link path dark until
the landing page is actually hosted, defaults off, fails closed, and is
deleted once the rollout completes. Do not ship this reachable before the
landing page exists.

Funding is open. Q8 covers whether the client funds the invite backend and
this landing page; without it, the fallback is the typed invite code named
on E02-F3 and E02-F5.

**Frontend**  The accept card at `/invite/[id]`: wall-name headline, Accept
and join, Not now, a loading spinner, and a no-longer-available state, all
built already at E02-F5. This feature adds the path that reaches that
screen from outside the app: the invite email template and the landing page
that redirects into it or into the app store.
**Backend**  The landing page resolves the same invite token E02-F3 issues
and either deep-links into the installed app or forwards to the store
listing; the token is parsed with a schema and authorized server-side
before any wall detail renders, same rule as E02-F5.
**QE (draft)**  Happy path: an invite email link opens the landing page and
routes into the accept screen with the app installed. Edge: the same link
with the app not installed lands on the store listing, not a broken
custom-scheme link. Invariant test: the flag defaults off and the path is
unreachable until `invite.hosted_landing` is on.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Undecided, deliberately**
Q8: whether the client funds the invite backend and this hosted landing
page; without funding, the fallback is a typed invite code.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F8)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/invite-id.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f3-invite-and-join.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E02-F9 Decline an invite from the accept screen
- Action: create
- Issue type: Story
- Summary: E02-F9 Decline an invite from the accept screen
- Parent: SCRIBL-27
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-32 (E02-F5)
- Description:

~~~
The invite store's decline path does real work, including handing
membership back, and no screen calls it. This decides whether saying no
outright ships, and if it does, puts a decline control on the accept screen
next to Not now, which only defers.

**Frontend**  On `/invite/[id]`, add a decline action distinct from Not now:
Not now leaves the invite pending, decline resolves it and releases
whatever membership the invite reserved.
**Backend**  A decline call on the invite-resolve endpoint from E02-F3 that
authorizes on the caller's own identity, same rule as E02-F12, and hands
membership back rather than only marking the row.
**Reads/writes**  Decline writes the invite to a decided state and clears
any reserved membership; unlike Not now it cannot be undone by reopening the
link.
**QE (draft)**  Happy path: declining a pending invite resolves it and the
person returns to home. Edge: declining an invite that has already been
accepted elsewhere is refused rather than double-processed. Unit test on
the decline transition in `lib/`.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F9)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/invite-id.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f3-invite-and-join.md
~~~

### CREATE E02-F10 Resolve what the story fork screen looks like without record
- Action: create
- Issue type: Story
- Summary: E02-F10 Resolve what the story fork screen looks like without record
- Parent: SCRIBL-27
- Labels: GREEN, Product, Q18
- Issue links: is blocked by SCRIBL-31 (E02-F4); is blocked by SCRIBL-43 (E04-F3)
- Description:

~~~
The onboarding story fork is a two-card choice between write and record, and
E04-F3 ships without the record button, so the screen either loses a step
or shows a card that goes nowhere. This is a decision feature, not build
work: Q18 (the record-button fork) has to be answered before this screen's
shape is settled, and it stays open here.

The screen also is not the seven-step line E02-F4 describes. Its record
branch pushes to `/record` with `next=onboarding-walls`, leaving the named
flow entirely, so the straight-line diagram in E02-F4 is only half right
regardless of how Q18 resolves.

**Backend**  None. The screen today is two static buttons and a
draft-required guard; nothing behind it needs serving whichever way Q18
lands.
**QE (draft)**  Undecided pending Q18. Once resolved: if the record card is
cut, a unit test asserts the screen renders one card, not two, and a
regression test confirms no live route still targets `/record`. If kept, a
contract test covers the fork's two destinations against
`packages/contracts`.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.

**Size**: not sized

**Undecided, deliberately**
Q18: whether voice recording ships as designed on the story step and the
daily loop, or stays cut as the kickoff board decided; this screen's shape
depends on the answer.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F10)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-story-select.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f2-first-run-onboarding.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E02-F11 Account and profile settings screen
- Action: create
- Issue type: Story
- Summary: E02-F11 Account and profile settings screen
- Parent: SCRIBL-27
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-28 (E02-F1)
- Description:

~~~
The settings hub edits display name and email, launches the avatar canvas,
holds the theme toggle, lists the walls, and signs out. No prior feature
covered it, and it is also where the App Store required account deletion
from E02-F6 needs a surface.

Two things on this screen are decisions, not build. Dark mode is local-only
and never round-trips while name and email do round-trip, with no visual
cue distinguishing the two; E01-F9 also rules for one theme rather than
four, which this toggle contradicts until that is settled. This screen is
also the sole door into the member roster at `/wall/[id]/members`.

**Frontend**  A ScreenHeader with back chevron, avatar plus a Change avatar
pill routing to `/avatar`, text inputs for name and email, a DarkModeToggle
row, a Save button, a Your walls list linking into the member roster, a
Log out row, and an account-deletion entry point for E02-F6.
**Backend**  Reads the current user and the caller's wall list to build the
roster links; writes name and email through the self-only PATCH in E02-F12.
**Reads/writes**  Name and email load into local fields and save to the
server and the auth store only on Save; dark mode is local-only until the
round-trip decision above is made.
**QE (draft)**  Happy path: editing name and email and pressing Save
persists both and the screen reflects the update. Edge: an account on no
walls renders an empty walls list with no create-wall affordance here.
Component test on the Save round-trip, not a snapshot of the form.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Flagged risk (register contradiction, not resolved here)**
This screen's dark-mode toggle contradicts E01-F9's one-theme rule: dark
mode is local-only and never round-trips, while name and email do, with no
visual cue distinguishing the two behaviors. The avatar PATCH this screen
routes to (E02-F12) also carries the base64-versus-object-storage
contradiction against register 2.5.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F11)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/settings.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f8-account-and-profile.md
~~~

### CREATE E02-F12 Self-only profile update endpoint
- Action: create
- Issue type: Story
- Summary: E02-F12 Self-only profile update endpoint
- Parent: SCRIBL-27
- Labels: Backend, GREEN
- Issue links: is blocked by SCRIBL-28 (E02-F1)
- Description:

~~~
A PATCH on the user record for display name, email and avatar that
authorizes from the caller's own identity rather than a client-supplied id.
That authorization rule is the load-bearing part, not the field list. The
handler lives in `backend/src/authz/`, the single choke point register 4.3
requires, and register 4.3 also requires a test asserting that module
cannot import the flag client, so this endpoint's authorization can never
be switched off from configuration.

The avatar field carries the same contradiction as E02-F7. If this PATCH
accepts a base64 data URI for the avatar, it puts an image in the database
against register 2.5, which requires images in object storage with a
presigned upload and a signed CDN reference, never in the database. The
endpoint has to accept an object-storage reference, not image bytes.

**Backend**  `PATCH /users/me` for `displayName`, `email`, and an avatar
object reference, authorized against the caller's own id read from the
session, never a path or body id. Backs the Save action on E02-F11 and the
avatar save on E02-F7.
**QE (draft)**  Invariant test, written before the endpoint exists, per
engineering-standards.md section 4: a PATCH carrying another user's id in
the body is refused and the target row is never touched, and
`backend/src/authz/` imports no module from the flag client. Happy path:
the caller's own id updates displayName and email and the response mirrors
the change. Edge: an avatar reference to an object the caller does not own
is refused. Contract test on the PATCH request and response shapes against
`packages/contracts`.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Flagged risk (POC pattern contradicts register 2.5)**
The POC PATCHes a base64 data URI; register 2.5 requires images in object
storage with a presigned upload and a signed CDN reference, never in the
database. This endpoint accepts an object reference, following the
register. The risk is the POC pattern being carried forward; E02-F7
carries the same risk.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F12)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/settings.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f8-account-and-profile.md
~~~

### CREATE E02-F13 Change a password from settings
- Action: create
- Issue type: Story
- Summary: E02-F13 Change a password from settings
- Parent: SCRIBL-27
- Labels: Backend, GREEN
- Issue links: is blocked by SCRIBL-28 (E02-F1)
- Description:

~~~
The POC's settings screen shows a password field that accepts input and
discards it, no visual cue distinguishing it from the fields that actually
save. Build a real credential change against the managed user pool from
register 3.1, or drop the field; do not ship a control that silently does
nothing.

**Backend**  A change-password call against the user pool, requiring the
current password and re-authentication before the change takes effect, per
the step-up pattern `service-seams.md` section 4 names for account-sensitive
actions. Authorizes from the caller's own session, same rule as E02-F12.
**QE (draft)**  Happy path: the current password plus a valid new password
changes the credential and a subsequent login uses the new one. Edge: a
wrong current password is refused with no hint about which check failed.
Invariant test: the change cannot proceed without a fresh re-authentication
step, since a stale session should not be enough to rotate a credential.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F13)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/settings.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f8-account-and-profile.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
~~~

### CREATE E02-F14 Decide the fate of the on-device account switcher and the onboarding-replay toggle
- Action: create
- Issue type: Story
- Summary: E02-F14 Decide the fate of the on-device account switcher and the onboarding-replay toggle
- Parent: SCRIBL-27
- Labels: GRAY, Product
- Issue links: none
- Description:

~~~
Two demo-only affordances on the sign-up screen, a credential-free account
picker and a toggle that forces onboarding on every sign-in, cannot survive
a real managed-user-pool login: there is no credential-free list of
accounts to pick from once sign-up needs a password (register 3.1), and a
forced-replay toggle has no honest server-side meaning once onboarding
state belongs to a real account. Someone has to say keep or cut before the
rebuild copies either forward; this feature is that decision, with no build
content of its own.

Also worth naming while this screen is being decided: a real account is
seen once per device, at sign-up, and never again unless someone signs out.
Building the picker or the toggle as a peer of the daily loop overweights a
screen nobody returns to.

**Backend**  None until the decision lands. If either affordance is kept
for internal QA only, it needs a build-time flag gate that cannot ship to
production, not a runtime toggle a real user could reach.
**QE (draft)**  Undecided. No test to write until keep-or-cut is resolved;
if kept behind a dev-only build flag, the test is that the flag is absent
from any release build's `EXPO_PUBLIC_*` surface.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F14)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/sign-up.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f1-launch-and-authentication.md
~~~

### CREATE E02-F15 Persist the onboarding step and resume there on relaunch
- Action: create
- Issue type: Story
- Summary: E02-F15 Persist the onboarding step and resume there on relaunch
- Parent: SCRIBL-27
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-31 (E02-F4)
- Description:

~~~
Every onboarding screen records a per-user step so a half-finished first
run resumes where it stopped, and E02-F4's eight-screen list never mentions
this machinery even though every one of its screens depends on it.

**Frontend**  The splash screen holds a fixed dwell, then reads the
onboarding-complete flag and the draft's image reference to pick a resume
step, clamping back to the canvas step if the draft that step needs is
gone. Each onboarding screen persists its own step name on mount so this
read has something current to act on.
**Backend**  None. Onboarding progress lives entirely in local storage;
nothing here is served remotely.
**Reads/writes**  Reads the onboarding-complete flag and the draft store on
the dwell's end; writes nothing itself, since the resulting navigation is a
route replace, not a state write.
**QE (draft)**  Happy path: the dwell ends and the app advances to today's
prompt for a completed account, or to the resumed step for one mid-flow.
Edge: a resume step whose required draft data is missing clamps back to the
canvas step rather than crashing or resuming into a blank screen. Unit test
on the resume-step selection logic in `lib/`.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E02-F15)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/splash.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f2-first-run-onboarding.md
~~~

## E03 Daily prompt -- SCRIBL-34

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-34 E03 Daily prompt
- Action: update
- Issue type: Epic
- Summary: unchanged
- Labels: current Backend-and-iOS,GREEN -> proposed Backend-and-iOS, GREEN (unchanged)
- New issue links: none
- New description (full replacement):

~~~
One prompt a day, the same for everyone, that the app can never edit.
Everything else in the product hangs off it, which is why a day without a
prompt is an outage rather than a bug.

**Flagged risk (register contradiction, not resolved here)**
- The board's own wording needs a note. The board sticky says "Daily prompt
  (Claude)". The kickoff two hours earlier decided the opposite: prompts
  stay curated by Scribl's program team of mental-health professionals and
  educators, with Claude scoped to drafting suggestions for their review,
  because the client's own words were "our entire modality is based on
  these prompts and making sure that we have final say and a hand in
  them". No runtime prompt-generation pipeline was ever built. Prompts have
  always been an admin-curated set, seeded into the database and resolved
  by date. The pipeline that was built and then disabled is the AI
  background enhancement, behind the EXPO_PUBLIC_AI_ENABLED flag and off
  by default. So the board sticky and the client decision disagree, and
  the client decision wins. This epic ships a seeded curated set on the
  same fetch contract runtime generation would use later, plus a Claude
  drafting tool the client's editors operate. Nobody should read the board
  sticky as authorization to generate prompts at runtime.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03)
~~~

### UPDATE SCRIBL-35 E03-F1 Seeded prompt set and fetch contract
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A curated set loaded into the database, one prompt resolved per calendar
day per timezone, served on a contract that does not change if generation
ever moves server-side. A rotating fallback so a scheduling failure never
leaves a day blank. Day resolution is pure date arithmetic and belongs in
lib/prompt-day.ts (architecture.md section 4 names that file as the worked
example of a pure module), with the clock injected per
engineering-standards.md section 4 rather than read from the system clock.
The onboarding intro screen shares this same fetch, gated to fire once per
session, with an invite override layered on top.

**Frontend**  Onboarding prompt-intro card shows a loading spinner until the
prompt resolves, then enables Let's Scribl once text is present; invite
context can substitute a personalized prompt over the fetched one.
**Backend**  GET /prompt/today, resolved by calendar day and timezone
against the seeded set, with a rotating fallback prompt if the day's row is
missing.
**Reads/writes**  Server-owned, cached in data/ behind the typed API
client, not a Zustand store (register 5.1); the invite override is read
once and never written back.
**QE (draft)**  Tier 3 unit tests on lib/prompt-day.ts for day-boundary
resolution across timezones and a midnight-local rollover, with the clock
injected, near-full coverage. Tier 2 contract test on packages/contracts
for the prompt shape, asserted on both the backend route and the client.
Happy path: a signed-in session with a resolved prompt shows text and
enables the button. Edge: prompt fetch fails, a Try again control appears
in the card and the button stays disabled.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F1)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-prompt-intro.md
- Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f2-first-run-onboarding.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### UPDATE SCRIBL-36 E03-F2 Today's prompt screen
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS,rough-points -> proposed GREEN, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The prompt card, the "Let's Scribl" call to action, and defined loading,
empty and unavailable states. This is the app's root screen and the first
thing every returning person sees, so a blank on a cold network reads as a
broken app. The streak tile on this same screen is E11-F2, which is ORANGE
and blocked on Q12 and Q6, so a GREEN root screen currently depends on an
ORANGE feature for one of its tiles. That sequencing gap is worth resolving
before sprint 1, not papered over with a placeholder.

**Frontend**  ScreenHeader and bottom nav around a date badge, prompt text,
live countdown tile, and streak tile; the primary button label swaps
between Open the canvas and Draw another by today's submit status. A bare
loading spinner covers the body until auth hydration resolves, and a retry
control appears if the prompt load fails. The draw route builds the
DrawPad canvas with color swatches, undo and trash, an elapsed-time chip,
and a Done button disabled with an explanatory label when the unpinned
prompt fetch fails.
**Backend**  Serves today's prompt and the user's stats for a computed
streak, gated behind an authenticated user so neither request fires before
auth resolves. The draw route's unpinned path calls the same prompt read;
the pinned deep-link path carries its prompt in route params and calls
nothing.
**Reads/writes**  Reads auth hydration state, current user, the prompt
cache, and the streak cache from data/, all server-owned per register 5.1,
not client stores. Writes nothing on this screen; finishing a drawing
writes image, prompt id, strokes, and channel id into the shared draft
store for story-select to pick up.
**QE (draft)**  Tier 5 component tests on behaviour: hydration pending
shows only the spinner with neither prompt body nor sign-up bounce;
hydration resolved with no user replaces the route with sign-up instead of
flashing the prompt; an unsubmitted signed-in user sees prompt, countdown,
and streak with the Open the canvas label. Tier 6 end-to-end covers finish
drawing to story-select on the daily loop. Edge: unpinned prompt fetch
failure keeps Done disabled with an explanatory label; an unauthenticated
visitor on /draw is redirected to sign-up before the canvas renders.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F2)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/root-today.md
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/draw.md
- Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
~~~

### UPDATE SCRIBL-37 E03-F3 Submitted-state read
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Has this caller already submitted for today's prompt. One read, called on
every launch, so it needs an indexed lookup rather than a scan of
submissions. It shares its definition of "today" with E03-F1's day
resolution in lib/prompt-day.ts and with what E04-F5 enforces at write
time, and all three have to agree or a submission can land on the wrong
side of midnight.

**Frontend**  Feeds the root screen's primary button label, which reads
Open the canvas when the day is unsubmitted and Draw another once it is.
**Backend**  An indexed submitted-state read keyed by user and calendar
day, sharing the day-boundary logic in lib/prompt-day.ts with E03-F1 and
the submit-to-unlock check in E04-F5 (register 4.1).
**Reads/writes**  Server-owned, read into data/ alongside the prompt and
streak caches on root-screen mount; writes nothing.
**QE (draft)**  Tier 3 unit test on the shared day-boundary function
covering a submission made just before and just after local midnight. Tier
4 integration test against a real local Postgres for the indexed lookup,
not mocked SQL. Happy path: an unsubmitted day renders Open the canvas; a
submitted day renders Draw another.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F3)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/root-today.md
- Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
~~~

### UPDATE SCRIBL-38 E03-F4 Claude-assisted prompt drafting for editorial review
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A batch tool that drafts candidate prompts for Scribl's editors to accept,
edit or reject, writing only accepted prompts into E03-F1's seeded set.
This is the honest reading of "(Claude)" on the board sticky, and register
section 10 is explicit that runtime prompt generation was never built and
is not wanted: prompts stay curated by the client's program team, seeded
and resolved by date. Claude drafts, an editor decides, nothing reaches a
person unapproved. This feature never runs on the runtime read path and
must not grow one; ADR-0011 puts prompt generation on the Opus tier, and at
roughly a few hundred candidates a month the model cost is negligible.

**Backend**  An offline batch job that calls Claude to draft candidate
prompt text, writes candidates to an editorial review table, and on editor
approval inserts the accepted row into the same seeded-set table E03-F1
reads. No route on the prompt read path calls a model.
**QE (draft)**  Tier 1 invariant test asserting the runtime GET
/prompt/today path cannot import or call the drafting job or any model
client, written before the batch tool. Happy path: an editor-approved draft
appears in the seeded set on the next resolved day. Edge: a rejected draft
never reaches the seeded set and a partial batch failure leaves no
half-written candidate rows.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F4)
~~~

### UPDATE SCRIBL-39 E03-F5 Local daily reminder
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS,rough-points -> proposed GREEN, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
An on-device scheduled notification for the daily prompt, no server
involved. This is the bridge that keeps the habit loop alive if E09 loses
its capacity fight, and it costs one day against E09's several days. It is
not a substitute for managed push, because it cannot react to anything
happening on a wall, only to the local clock.

**Backend**  None; this is a client-only Expo local-notification schedule
tied to the resolved prompt day from lib/prompt-day.ts, rescheduled on
timezone change.
**QE (draft)**  Tier 3 unit test on the schedule calculation with the clock
injected, covering a timezone change between scheduling and firing. Happy
path: the notification fires once at the configured local time on a day
with a resolved prompt. Edge: a timezone change after scheduling
reschedules rather than firing at the old offset.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F5)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
~~~

### CREATE E03-F6 Give today's prompt a close time and count down to it
- Action: create
- Issue type: Story
- Summary: E03-F6 Give today's prompt a close time and count down to it
- Parent: SCRIBL-34 (E03)
- Labels: Backend, GREEN
- Issue links: is blocked by SCRIBL-35 (E03-F1)
- Description:

~~~
The root screen runs a live countdown to the prompt's close, but E03-F1's
fetch contract defines only one prompt per calendar day and never names a
close time. That is a packages/contracts change, not a UI add: the
contract needs a close timestamp field, and both the backend route and the
client have to agree on it before the countdown tile can render a real
number instead of a guess.

**Frontend**  The countdown tile on the root screen ticks down to the
close timestamp; a bare loading spinner covers the body until it and the
prompt both resolve.
**Backend**  Adds a close-timestamp field to the GET /prompt/today contract
in packages/contracts, computed alongside the resolved prompt by the same
day-boundary logic in lib/prompt-day.ts.
**Reads/writes**  Server-owned, read into the same prompt cache in data/
E03-F1 populates; writes nothing.
**QE (draft)**  Tier 2 contract test asserted on both sides, that the close
timestamp is present and matches the resolved day's boundary. Tier 3 unit
test on the close-time calculation with the clock injected across a
timezone change. Happy path: the tile counts down and reaches zero at the
contract's close timestamp. Edge: a client on a different timezone from
the server still counts down to the same instant.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F6)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/root-today.md
- Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
~~~

### CREATE E03-F7 Prompt pack catalog and per-wall prompt injection
- Action: create
- Issue type: Story
- Summary: E03-F7 Prompt pack catalog and per-wall prompt injection
- Parent: SCRIBL-34 (E03)
- Labels: Backend, GREEN
- Issue links: is blocked by SCRIBL-35 (E03-F1); is blocked by SCRIBL-48 (E05-F1)
- Description:

~~~
Curated prompt packs a wall creator can pull prompts from onto their own
wall. E03's premise, on record from the kickoff, is that prompts stay
curated by the client's program team and the app never edits them. A
wall-scoped prompt source with its own authorization is a second prompt
path outside that premise, not an extension of the one-prompt-a-day model.
The capability shipped in the POC without a filed feature; E18-F2's parked
"challenges" concept named packs once and was retired on 2026-09-01, and
this screen is what that concept became. Whether wall creators get any
unreviewed prompt path at all is undecided and needs a policy call before
this is built, not just scoped.

**Frontend**  A prompt-pack catalog list with title and prompt count per
row, and a retry control if the list fails to load; the custom-prompt
authoring UI is E03-F8's concern on the same screen.
**Backend**  A prompt-pack catalog listing endpoint, read-only until a pack
is opened; the wall-scoped write for an injected or custom prompt belongs
to E03-F8 and E03-F9.
**Reads/writes**  Server-owned pack catalog, read into data/; nothing
written from the catalog list itself.
**QE (draft)**  Tier 1 invariant question, undecided until the policy call
lands: does a wall-scoped prompt bypass editorial review, and if so does
register 5.1's server-owned/client-owned split still hold for a wall's
local prompt set. Happy path: the catalog loads and lists packs with
counts. Edge: the catalog fails to load and the retry control appears
instead of an empty list.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Flagged risk (register contradiction, not resolved here)**
- E03's premise on record from the kickoff is that prompts stay curated by
  the client's program team and the app never edits them. A wall-scoped
  prompt catalog and injection path is a second prompt source outside that
  premise. Not resolved here; needs a policy call.

**Undecided, deliberately**
- Whether wall creators get any unreviewed prompt path at all is undecided
  and needs a policy call before this is built.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F7)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/wall-id-prompt-packs.md
- Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
~~~

### CREATE E03-F8 Author a custom prompt for one wall
- Action: create
- Issue type: Story
- Summary: E03-F8 Author a custom prompt for one wall
- Parent: SCRIBL-34 (E03)
- Labels: GREEN, iOS
- Issue links: is blocked by NEW E03-F7
- Description:

~~~
A wall creator types their own prompt and it goes live on that wall with no
editorial review. This contradicts E03's curated-only premise on record
from the kickoff, so it needs a policy call before a build, not after.
Whether a wall creator gets an unreviewed prompt path at all is undecided;
do not build past the catalog and text-entry UI until that call lands.

**Frontend**  A custom-prompt card with a text area, character counter, and
a submit button disabled until text is entered, above the E03-F7 pack
list.
**Backend**  A wall-scoped endpoint to persist a custom prompt against the
caller's own wall id, guarded by wall membership authorization.
**Reads/writes**  A successful submit writes a new prompt row scoped to the
wall and bounces back to the family screen with the wall in context;
nothing is written on entry.
**QE (draft)**  Happy path: typing a custom prompt and submitting adds it
to the wall and returns to the wall view. Edge: an empty or
whitespace-only prompt keeps submit disabled. Undecided and blocking:
whether this write path needs an editorial gate before ship, per the E03
curated-prompt premise; no test tier can close that until the policy call
does.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.
- Invariant tests are launch gates and are written before the feature
  (engineering-standards.md section 4). All authorization runs through
  backend/src/authz/, the single choke point.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Flagged risk (register contradiction, not resolved here)**
- This feature contradicts E03's curated-only premise on record from the
  kickoff: a wall creator's custom prompt bypasses editorial review
  entirely. Not resolved here; needs a policy call before build proceeds
  past catalog and text-entry UI.

**Undecided, deliberately**
- Whether a wall creator gets any unreviewed prompt path at all is
  undecided; blocking on a policy call before this write path can ship.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F8)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/wall-id-prompt-packs.md
- Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
~~~

### CREATE E03-F9 Pick prompts from a pack and add them to a wall
- Action: create
- Issue type: Story
- Summary: E03-F9 Pick prompts from a pack and add them to a wall
- Parent: SCRIBL-34 (E03)
- Labels: GREEN, iOS
- Issue links: is blocked by NEW E03-F7
- Description:

~~~
The pack-detail picker where a creator selects up to five prompts and they
persist to the wall. The cap of five needs ratifying; selecting a sixth
prompt is currently a silent client-side no-op with no message, which is a
UX defect independent of the cap's value.

**Frontend**  A per-pack prompt list with a per-row check mark, a running
selected count in the header, and a submit button pinned to the bottom
that appears once at least one prompt is picked.
**Backend**  A pack-detail endpoint keyed by pack id, and a wall-scoped
write that persists the chosen prompt ids, guarded against a non-creator
caller or a bad pack or prompt id.
**Reads/writes**  Pack detail is server-owned and read into data/ on
mount; a successful submit writes the chosen prompt ids to the wall and
replaces the route to the family screen, blocking back navigation into the
picker on success.
**QE (draft)**  Happy path: selecting up to five prompts and submitting
adds them to the wall and returns to the wall view. Edge: selecting a
sixth prompt while five are already picked must give a visible signal
instead of the current silent no-op, once the cap is ratified; a
non-creator caller or an invalid pack or prompt id is rejected server-side
per register 4.2's authorization choke point.

**Engineering context**
- The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
  monorepo. Dependency rule per architecture.md: dependencies point inward
  and downward, never sideways or upward.
- Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
  repositories/ (all SQL, nowhere else) and effects/ (outbound side
  effects) -> contracts/ -> lib/. The API is one long-running Node HTTP
  container behind a load balancer (decision register 2.1, 2.2), not
  Lambda.
- Frontend layering: app/ (expo-router routes) -> features/ ->
  components/ui/, data/ (query cache), stores/ (Zustand client state),
  services/ -> contracts/ -> lib/.
- Invariant tests are launch gates and are written before the feature
  (engineering-standards.md section 4). All authorization runs through
  backend/src/authz/, the single choke point.
- Contract tests against packages/contracts, asserted on both sides, so the
  mock server and the real API cannot drift.

**Undecided, deliberately**
- The cap of five prompts per pack selection needs ratifying; the current
  behavior on a sixth selection is a silent no-op, not a decided limit
  with a user-visible message.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E03-F9)
- Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/wall-id-prompt-packs-packid.md
- Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
~~~

## E04 Drawing and submit, with submit-to-unlock -- SCRIBL-40

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-40 E04 Drawing and submit, with submit-to-unlock
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS-and-Backend -> proposed GREEN, iOS-and-Backend (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The thing people actually do. Draw with a deliberately small set of tools, add
a story in text, submit, and only then get to see what anyone else made. The
constraint is the feature: one brush and eight colors, per E04-F1, means
nobody opens the app and feels unqualified, and the client's own frames are
stricter than our POC was.

Submit-to-unlock is not UI. Register 4.1 puts it at the data layer as a
transactional existence check on (user, prompt), returning 403 on a channel
read until a submission row exists, precisely so no client bug and no direct
API call can bypass it. Register 4.3 and feature-flags.md section 2 hold the
same line from the flag side: neither invariant is reachable from
configuration, and a standing test asserts backend/src/authz/ never imports
the flag client. Treat a bypass as a defect of the same severity as a privacy
leak. E04-F5 owns the bypass test itself, written before the feature it
guards (engineering-standards.md section 4, tier 1, a launch gate).

Register 2.6 is the other decision that shapes this epic: every submission
stores a versioned stroke document and a render, strokes are the source of
truth, and this cannot be added retroactively. E04-F2 carries the detail.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### UPDATE SCRIBL-41 E04-F1 Skia canvas with the six-ink reduced tool set
- Action: update
- Summary: change to "E04-F1 Skia canvas with one brush and the client's eight colors"
- Labels: current GREEN,Q1,Q2,iOS,rough-points -> proposed GREEN, iOS, rough-points (unchanged otherwise; Q1 and Q2 no longer appear in the wiki body, dropping both; the wiki's own blocked-by is "none")
- New issue links: none
- New description (full replacement):

~~~
React Native Skia canvas (ADR-0006). The client's tool set is one brush at a
single weight, eight colors, undo, erase, and a trash control. No brush-size
row, no fill tool, no brush styles, no layers.

**Flagged risk (register contradiction, not resolved here)**: Register 2.6
describes the shipped tool set as "one brush, six inks", written before the
client's final palette call. This feature is the eight-color version that
supersedes that number, and the register should be read against this body,
not the other way round. This ticket's own retitle from "six-ink reduced
tool set" to "one brush and the client's eight colors" is itself evidence of
that stale register language; the register text has not been corrected to
match.

The eight colors, client order, deliberately not ROYGBIV: #db0632 red,
#f58c29 orange, #ffd93b yellow, #afd129 light green, #1d864a dark green,
#99d9d9 light blue, #20145f dark blue, #d51668 magenta, the last being the
brand magenta exactly. Erase carries the same weight as the brush and can
read as a white swatch, matching the POC. Per-wall narrowing of the palette
is data through allowedColors, not a code path; this is the seam E18-F1
(retired 2026-09-01) would have used and E04-F1 now owns outright, per the
draw and onboarding-canvas map notes. packages/contracts/constants holds the
ink set, brush size and channel kinds so app and backend agree (contract-test
tier 2).

**Undecided, deliberately**
- The drawing area's bounding box wants a firmer definition; swatch order
  and layout are unsettled. Does not block build. History of the earlier
  four-size, six-ink frame lives in the client feedback record and does not
  belong here.

**Frontend**  DrawPad canvas, eight-swatch row, undo, trash-to-clear-confirm,
elapsed-time chip on draw; circular guide mask and full palette on avatar;
reduced onboarding palette with a Try again control on prompt-fetch failure
on onboarding-canvas.
**Backend**  draw needs GET /prompt/today for the unpinned path only; a
pinned deep link carries its prompt in route params. avatar needs a
self-only PATCH on the user record accepting the cropped image.
**Reads/writes**  Finishing writes image, prompt id, strokes, and pinned
channel id to the shared draft store (draw, onboarding-canvas); nothing
posts to the server from the canvas itself. squareAvatarDataUri is a no-op
on native (src/lib/image.ts:15-22), so a native avatar save PATCHes the full
uncropped export, not the cropped circle.
**QE (draft)**  Unit tests in lib/ on stroke and crop math (tier 3).
Component test: Done stays disabled with an explanatory label when the
unpinned prompt fetch fails. Component test: an unauthenticated visitor is
redirected to sign-up before the canvas renders. Fix the native crop no-op
before writing its regression test, since the bug and the test are the same
finding.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 5 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F1)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/draw.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/avatar.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-canvas.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f8-account-and-profile.md
~~~

### UPDATE SCRIBL-42 E04-F2 Stroke serialization and artwork capture
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS,rough-points -> proposed GREEN, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Register 2.6: every submission stores a versioned vector stroke document, a
rendered image, and a derived thumbnail for the wall grid. Strokes are the
source of truth, the image is a render of them, and this cannot be added
retroactively: art submitted without its strokes never gains them. The
document needs, from the first write, a schema version, resolution-
independent coordinates with the logical canvas size recorded, the ink
identifier stored alongside its resolved color so re-tuning the palette does
not alter existing art, and a recorded renderer version so a re-render
reproduces what people actually saw. Editing produces a new revision rather
than mutating one, because a wall has already shown the previous version and
reactions attach to it. Stroke geometry lives in lib/ as pure functions
(register 5.2), kept apart from the render loop, so this is unit-test
territory with near-full coverage (tier 3), not component-test territory.

**Backend**  no endpoint of its own; the stroke document and the render
travel with the submit call in E04-F4 and land through the object-storage
path in register 2.5, never as a database text column.
**Reads/writes**  writes the versioned stroke document, the render, and the
thumbnail alongside the submission; a later edit writes a new revision, the
submission pointer moves, the prior revision stays addressable.
**QE (draft)**  Unit tests on stroke serialization and coordinate
normalization in lib/, tier 3, near-full coverage. Integration test: an edit
creates a new revision row rather than mutating the existing one. Contract
test: the stroke document schema version round-trips through
packages/contracts, tier 2.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 2 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F2)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/draw.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/avatar.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-canvas.md
~~~

### UPDATE SCRIBL-43 E04-F3 Story input at 280 characters
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q18,iOS,rough-points -> proposed GREEN, Q18, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
After the drawing, a story: a write-or-record fork and a 280 character cap,
STORY_CHAR_LIMIT per architecture.md's naming table, a shared constant so app
and backend agree. The POC caps captions at 80; take the client's 280.
Record is the gated half. The client's frames put a record card on both the
onboarding story step and the daily loop, and the client's own kickoff board
cut voice memos from the MLP (Q18). Ship the write path only. Leave the
record button out until the client reconciles frames against board; do not
build the pipeline silently to get ahead of that answer. The pipeline itself
is fully specified and parked as E18-F3.

The POC ships the record card on every platform already, on story-select,
onboarding-story-select, and record (the last two also scoped under E18-F3
and E18-F6). That is a gap between the shipped app and this feature's
write-only scope, not a second feature.

**Undecided, deliberately**
- Q18: whether the record card renders at all is not this feature's call to
  make; do not write its test until the card's fate is decided.

**Frontend**  drawing preview card, 280-char capped input with a live
counter and clear control, Share Your Story / Continue button, on
onboarding-story and write; a typed-story choice card without a recording
alternative, on story-select and onboarding-story-select once Q18 resolves
to write-only.
**Backend**  none of these screens call an endpoint; caption is local state
until the submit call in E04-F4 carries it.
**Reads/writes**  each screen guards entry on the draft store's imageRef and
bounces to the canvas if missing; on exit the caption writes into the draft
store and any leftover voice-note fields clear.
**QE (draft)**  Component test: entry with no draft image bounces to the
drawing screen instead of rendering the caption field. Unit test in lib/ on
the char-limit boundary against STORY_CHAR_LIMIT. Undecided until Q18:
whether the record card renders at all; do not write its test until the
card's fate is decided.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size (rough)**: 2 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F3)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/story-select.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/write.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-44 E04-F4 Submit endpoint and presigned upload
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
One submit call: writes the submission row, fans out through the join table
to every chosen wall (register 2.4, one submission, several walls, one
image), and returns a presigned PUT so artwork bytes go straight to object
storage rather than through the API service (register 2.5). Base64 in a
JSON body pins payload size to a gateway limit; that pattern belongs to the
Lambda-and-API-Gateway design register 2.1 superseded, not to the
long-running container this backend actually is, so it is dropped rather
than replaced with a container-shaped equivalent of the same mistake. An
authorization check happens before any URL is signed (register 2.5).

**Frontend**  choose-channels and onboarding-walls: multi-select wall list,
disabled-until-checked submit button, inline error that preserves the
picker's selections on failure.
**Backend**  POST /submit in routes/, validating prompt id, channel ids, and
caption-or-audio (never both) before delegating; services/ writes the
submission and the fan-out rows; repositories/ holds the parameterized SQL.
No presigned-URL signing without the authorization check running first.
**Reads/writes**  reads the draft (image ref, prompt id, strokes, caption or
audio ref) and the caller's wall list; on success clears the draft and
navigates home then to family; on failure keeps the picker populated for
retry.
**QE (draft)**  Contract test against packages/contracts for the submit
request and response shape, tier 2. Integration test against a real local
Postgres: the fan-out writes one row per selected wall, not one row per wall
times image copy. Component test: a failed submit preserves the picker's
prior selections and shows an inline error.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 3 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F4)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/choose-channels.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-walls.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
~~~

### UPDATE SCRIBL-45 E04-F5 Submit-to-unlock at the data layer, with its bypass test
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The product's central promise (register 4.1): a person cannot read a wall
for a given prompt until their own submission exists, enforced as a
transactional existence check in authz/, not the UI, because the API is
public to anyone with a token. Register 4.3 and feature-flags.md section 2
say the same thing from opposite sides: this is not reachable from
configuration, not "on by default", not reachable from the flag system at
all, and a standing test asserts nothing under backend/src/authz/ imports the
flag client. engineering-standards.md section 4 tier 1 calls the bypass
probe a launch gate written before the feature it guards.

This is the single most important QE block in E04. The regression test
calls the channel read directly with a valid token and no submission and
proves it gets a 403; that test is half the feature, not a follow-up to it.
It belongs in the release gate E06-F6 defines, not in a suite nobody blocks
a release on.

**Backend**  authz/ gains the one existence check every wall read calls
through (register 4.2's single choke point); repositories/ runs it inside
the same transaction as the read, not as a separate query the caller could
race.
**Reads/writes**  no new state; it gates every existing wall-read path on a
row already written by E04-F4's submit call.
**QE (draft)**  Invariant test, tier 1, launch gate, written first: a valid
token with no submission gets a 403 from the channel read, called directly,
not through the app. Invariant test: backend/src/authz/ has no import of the
flag client. Integration test against real Postgres: the existence check and
the read happen in one transaction, so a submission written concurrently
with the read cannot race past the gate.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size (rough)**: 3 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F5)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/choose-channels.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### UPDATE SCRIBL-46 E04-F6 Canvas performance on the device matrix
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q44,Q51,iOS-and-QA,rough-points -> proposed GREEN, Q44, Q51, iOS-and-QA, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Drawing has to stay smooth under a fast scribble on the oldest device in
scope, not just the newest, which is what register 5.2 (strokes accumulate
outside the render cycle, commit to state when a stroke ends) exists to make
possible. Nobody has decided which iOS versions, which iPhone models, or
whether iPad is in scope; the client expects that recommendation from us
(Q44). iPad itself is deferred as of decision-register section 1.4, but if
it lands back in scope this is a layout pass across every E02 and E05
screen, not a line item here.

**Undecided, deliberately**
- Q44: which iOS versions, which iPhone models, and whether iPad is in
  scope. No definition of done exists until this resolves.
- Q51: the device floor. Inventing a device matrix to fill the gap would be
  worse than leaving this blocked.

**Backend**  none. This is a device and rendering budget question.
**QE (draft)**  Once Q44 and Q51 resolve: a performance test tier
(engineering-standards.md does not name a device-farm tier explicitly; this
is closest to component-behavior testing, run on the oldest device the
answer names) asserting frame time under a scripted fast-scribble input
stays under the agreed budget on that device, not the newest available one.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size (rough)**: 2 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F6)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E04-F7 Make submit safe to repeat
- Action: create
- Issue type: Story
- Summary: E04-F7 Make submit safe to repeat
- Parent: SCRIBL-40
- Labels: GREEN, Backend
- Issue links: is blocked by SCRIBL-44 (E04-F4)
- Description:

~~~
Submit is the only call that unlocks a wall, and it is not idempotent as
specified. The submission id is deterministic per user and per prompt, which
reads as an intended idempotency key that neither E04-F4 nor E04-F5 states as
a requirement; the choose-channels map note is where this gap surfaced.
engineering-standards.md section 3 requires idempotency on anything a mobile
client retries: submit carries a key, two deliveries create one row. Right
now the client's only protection is a submitting boolean disabling the
button mid-flight, which does not cover a retried request after a dropped
response, an app restart mid-flight, or a second device.

**Backend**  the submit write becomes an upsert on the deterministic
submission id rather than a duplicate-key failure, in repositories/, so a
retried request returns the existing row's result instead of erroring.
**Reads/writes**  no new inputs; the same submit payload, written so a
second delivery of it is a no-op against the first.
**QE (draft)**  Invariant-adjacent integration test against real Postgres:
two concurrent submit calls with the same deterministic id create exactly
one row and both callers see the same result. Contract test, tier 2: the
submit response shape is identical on first delivery and on a retried
duplicate.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F7)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/choose-channels.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### CREATE E04-F8 Leave a text-only reflection on a past day
- Action: create
- Issue type: Story
- Summary: E04-F8 Leave a text-only reflection on a past day
- Parent: SCRIBL-40
- Labels: GREEN, Backend
- Issue links: is blocked by SCRIBL-44 (E04-F4); is blocked by SCRIBL-45 (E04-F5)
- Description:

~~~
The family wall accepts a text-only answer with no drawing on a locked past
day, through ReflectionInput, writing to the same POST /submit endpoint the
drawing flow uses. No feature states what a drawing-free submission does to
the unlock rule in E04-F5 or to a streak count: does a text-only reflection
satisfy submit-to-unlock for that prompt, or is it a second, weaker write
that leaves the wall still locked.

**Undecided, deliberately**
- Whether a text-only reflection satisfies submit-to-unlock for that
  prompt, or leaves the wall still locked; naming it here rather than
  deciding it in the route handler.

**Backend**  POST /submit accepts a caption with no image and no strokes for
a past, already-locked day; services/ needs an explicit rule for whether
this row counts toward the existence check in E04-F5, decided before the
endpoint accepts the shape, not inferred from what happens to compile.
**Reads/writes**  writes a submission row with caption only, no image ref,
no stroke document, joined to the one wall the reflection was left on.
**QE (draft)**  Invariant test, tier 1: once the unlock question above is
answered, assert directly whether a text-only submission does or does not
satisfy the existence check for that prompt, so the answer is enforced
rather than incidental. Integration test against real Postgres: a text-only
submission on a locked past day does not retroactively unlock that day for
other members if the answer is "does not count".

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F8)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/family.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f5-wall-browsing-and-composition.md
~~~

### CREATE E04-F9 Clear the canvas behind a confirmation
- Action: create
- Issue type: Story
- Summary: E04-F9 Clear the canvas behind a confirmation
- Parent: SCRIBL-40
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-41 (E04-F1)
- Description:

~~~
The canvas ships a trash control behind its own confirm modal, a detail
E04-F1's tool list names but does not describe at the interaction level.
Clearing the canvas after the confirm resets the stroke document E04-F2
holds, not just the visible pixels, so an accepted clear cannot leave a
stale stroke list behind for a later Done to export.

**Frontend**  trash control opens a confirm modal on onboarding-canvas;
declining leaves the drawing untouched, confirming clears both the visible
canvas and the underlying stroke list.
**Backend**  none; purely client-side state.
**Reads/writes**  on confirm, clears the in-memory stroke accumulator
E04-F2's lib/ functions hold, so nothing partial survives into the next Done
export.
**QE (draft)**  Component test: tapping trash shows the confirm modal before
anything clears. Component test: declining the modal leaves the drawing
intact. Unit test in lib/, tier 3: confirming clear resets the stroke
accumulator, not only the rendered surface.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F9)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-canvas.md
~~~

### CREATE E04-F10 Guard the create-flow screens on a missing draft
- Action: create
- Issue type: Story
- Summary: E04-F10 Guard the create-flow screens on a missing draft
- Parent: SCRIBL-40
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-41 (E04-F1)
- Description:

~~~
The four screens after the canvas, story-select, write, record, and
choose-channels, all bounce back to the canvas when no draft exists in the
draft store. One shared guard rather than four copies of the same imageRef
check means those routes have a single real entry point in practice, and a
fix to the guard's condition lands once. The current build duplicates the
check in at least onboarding-story-select on top of the resume-time guard
already in onboardingFlow.ts, which is exactly the duplication this feature
removes.

**Frontend**  extract the imageRef-missing redirect into one guard used by
every post-canvas route, replacing the per-screen copies.
**Backend**  none.
**Reads/writes**  reads only the draft store's imageRef; writes nothing.
**QE (draft)**  Unit test in lib/ or a shared hook, tier 3: the guard
redirects to the canvas route when imageRef is absent and is a no-op when
present. Component test: each of the four post-canvas screens uses the
shared guard rather than a local copy, so a change to the guard's condition
is not something a future screen can silently skip.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E04-F10)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/story-select.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
~~~

## E05 Walls and channels -- SCRIBL-47

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-47 E05 Walls and channels
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS-and-Backend -> proposed GREEN, iOS-and-Backend (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Private walls that feel like a family fridge instead of a feed. Invitation
only, no discovery, no strangers, no followers, and a response posted to the
Family wall is invisible from the Friends wall. Register 4.2 makes that
isolation a single authorization module in backend/src/authz/ that every
read path calls, with row-level security behind it as defence in depth, not
a check scattered across handlers the way the prototype had it. A leak
between two walls is a privacy incident, not a display bug, so its
regression test (E05-F2) is a launch gate written before the read-path
features that depend on it. Every read-path feature in this epic, the grid,
the dashboard, reactions, depends on that one module; the coupling is the
point, not a smell (register 4.2's trade-off line).

The channel count is still open on Q29 (register 10b): the schema does not
care how many fixed walls ship, but onboarding copy, the share-to checklist
and the dashboard list do, so this stays undecided rather than picked here.

**Flagged risk (register contradiction, not resolved here)**: Reactions
(E05-F6) carries band GREEN inside this epic while the client board treats
it as an orange sticky. This epic is not a single-band epic as a result;
epic-board-mapping.md records the disagreement rather than resolving it.
Re-point or re-band E05-F6 at sprint 1 planning if the board was right; keep
the disagreement on record here rather than resolving it in this filing.
Multi-channel posting (E05-F3) is not the same act as E12's file-export
sharing; keep those separate.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
~~~

### UPDATE SCRIBL-48 E05-F1 Channel model and membership
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,Q29,rough-points -> proposed Backend, GREEN, Q29, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Channels with members, roles and an invitation-only join path, reusing the
resolve-or-create invitee pattern the POC already proved. How many fixed
channels ship, three or four, and whether coworkers is its own channel,
stays open on Q29 (register 10b: recommendation recorded, client
confirmation outstanding). The schema does not care about the number; the
onboarding copy, the share-to checklist and the dashboard list all do, so
the answer is needed before E02-F4 is built, not after.

**Undecided, deliberately**
- Q29: how many fixed channels ship, and whether coworkers is its own
  channel. Recommendation recorded, client confirmation outstanding.

**Frontend**  The create-wall form needs a wall-name input, an
invite-by-email input that parses comma, semicolon or space separated
addresses, a Create wall button disabled until the name is non-empty, and
per-address error rows. Membership itself has no screen of its own; the
roster UI is E05-F10.
**Backend**  services/ plus repositories/ own wall create (returns a real
server id) and a per-address member-invite call the client fires once per
parsed address. Invite delivery is simulated, not a real send, per
src/lib/simulatedInvites.ts in the prototype; this feature must not be read
as already built. All membership reads route through backend/src/authz/,
the single choke point E05-F2 builds the regression gate for; this feature
owns the schema and the join rows that module authorizes against, not a
second check.
**Reads/writes**  Server data (wall rows, membership rows, invite rows)
lives in data/ behind the typed client, never in a Zustand store (register
5.1). A stale session at submit time signs the caller out to sign-up rather
than silently failing.
**QE (draft)**  Happy path: a valid name and submit creates the wall and
returns home. Edge: one bad address in a batch errors only that row while
the wall still creates. Edge: a stale session at submit time signs out to
sign-up instead of showing a false success. Contract test against
packages/contracts for the wall-create and member-invite shapes, since this
is the first client/server boundary crossing in the epic.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 3 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F1)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/create-wall.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/invite-id.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-walls.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/wall-id-members.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-49 E05-F2 Server-side channel isolation and its regression gate
- Action: update
- Summary: unchanged
- Labels: current Backend,GREEN,rough-points -> proposed Backend, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The launch gate for register 4.2. Every wall read authorizes on membership
of that specific wall, through one authorization module in
backend/src/authz/ and nowhere else, per architecture.md section 2: routes/
may call authz/ but never reaches repositories/ directly. Row-level security
in Postgres sits behind it as defence in depth, and block relationships are
enforced in the same module. A leak between two walls is a privacy incident,
not a display bug, which is why one choke point everyone calls is the
requirement rather than a per-handler check repeated thirteen times across
this epic. The coupling every read-path feature in E05 has to this module is
deliberate (register 4.2's own trade-off line).

**Backend**  authz/ exposes the membership and block check that services/
calls before any repository read. repositories/ holds the SQL, parameterized,
nothing else does. Register 4.3 and feature-flags.md section 2: this module
is not reachable from the flag system at all, and CI carries a
dependency-cruiser rule (architecture.md section 8.2) asserting no module
under backend/src/authz/ imports the flag client.
**QE (draft)**  This is a tier-1 invariant test per engineering-standards.md
section 4, written before the read-path features that depend on it: a
member of wall A cannot read wall B by any route, including a direct API
call with a valid token. A second invariant test asserts the
import-boundary rule itself. Both are launch gates, not regression coverage
added after the fact. Every other read-path feature in this epic, E05-F4
grid, F5 dashboard, F6 reactions, cross-references this gate instead of
repeating it.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size (rough)**: 3 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F2)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### UPDATE SCRIBL-50 E05-F3 Multi-channel share on submit
- Action: update
- Summary: unchanged
- Labels: current Backend-and-iOS,GREEN,rough-points -> proposed Backend-and-iOS, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Pick which walls today's response goes to, on the same screen as the story,
per the client's frames. This is not the "sharing personal" sticky:
epic-board-mapping.md is explicit that posting one submission to several
walls is a different act from producing a file and sending it elsewhere,
which is E12, not this feature.

**Frontend**  A SHARE TO header over a multi-select wall list, a Submit and
unlock the wall button disabled until at least one wall is checked, and an
inline error that does not clear the selection on failure. A pinned-prompt
deep link skips the list for a one-wall confirmation view instead.
**Backend**  Register 2.4: a submission_channels join table, snake_case
plural, all SQL in repositories/, parameterized. Sharing to three walls
writes three join rows, never three copies of the artwork; deleting the
submission removes it everywhere in one operation. The submit endpoint
validates prompt id and channel ids, rejects text and audio together, and
its write is the row E04's unlock check depends on. Every read of these
walls still passes through the single authz/ module E05-F2 gates, this
feature only adds the write side of the join.
**Reads/writes**  The draft (image ref, prompt id, caption, strokes) lives in
a client store per register 5.1's client-state boundary; on success it
clears and the app resets navigation to home then family. On failure the
picker state holds so the person can retry, an inline error rather than a
blank screen (engineering-standards.md section 3).
**QE (draft)**  Happy path: one or more walls checked, submit succeeds,
lands on family unlocked. Edge: no draft image on entry redirects to draw
instead of showing the picker. Edge: submit failure keeps prior selections
and shows inline error. Contract test on the submit endpoint's channel-ids
shape against packages/contracts. Integration test on the join-table write
against a real local Postgres, not mocked SQL.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 2 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F3)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/choose-channels.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-walls.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
~~~

### UPDATE SCRIBL-51 E05-F4 Wall grid and response detail
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS,rough-points -> proposed GREEN, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The two-column rounded tile grid, scrollable back through previous days,
plus a detail view with the drawing, the story and the reaction affordances.
This is the payoff screen for the whole loop and the one place pixel
fidelity to the client's design is worth the extra half day. The client's
2026-08-25 feedback flags this area, screens 11 and 16, as the least
internally discussed; the client plans to review with their team before the
workshop and wants alignment confirmed, not assumed.

**Frontend**  Response grid with member tiles and a roster strip, a
locked-day prompt state versus an unlocked reveal, a text reflection input
for past locked days, a multi-select toggle with a counter feeding the
compose flow (E12), and an archive gallery variant for personal walls. The
locked-day state and a load error must render differently: a locked wall is
a designed state, not an error state (engineering-standards.md section 3).
**Backend**  Roster, days, members and prompts serve per wall, gated by the
single authz/ module E05-F2 builds; this feature calls that gate, it does
not duplicate the check. The wall grid reads thumbnails only, never the
full-resolution image, per register 2.5, served as short-lived signed CDN
URLs over a private bucket with the authorization check happening before any
URL is signed. Detail view also accepts a reaction write and a text-only
reflection through the same submit endpoint the drawing flow uses.
**Reads/writes**  Wall contents, membership and roster are server data in
data/ behind the typed client, never a client store (register 5.1). The
grid reloads on every screen focus so removals and new state surface
promptly; selecting drawings for compose writes to a client store because
that selection is local, ephemeral UI state, not server data.
**QE (draft)**  Happy path: opening a wall with an unlocked prompt shows the
roster and each member's drawing. Edge: a removed member's row disappears on
next focus. Edge: two or more drawings selected enables the compose button,
below the count it stays disabled. Contract test on the roster and reaction
shapes. The channel-isolation invariant test from E05-F2 is this feature's
launch gate, not a new one.

**Undecided, deliberately**
- A pagination and empty-state strategy for the grid at scale; no source
  names a page size, and picking one now would be inventing scope.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 4 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F4)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/family.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/response-id.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f5-wall-browsing-and-composition.md
~~~

### UPDATE SCRIBL-52 E05-F5 Dashboard with Your Walls and the stats card
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q12,iOS,rough-points -> proposed GREEN, Q12, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The home surface: a list of walls with an active indicator, and the Your
Stats card from the client's Dashboard frame. Nothing in that frame says
what numbers belong in the card (Q12, open), so the honest split is that the
shell is green-band work and its contents lean on the orange-band streak and
analytics epics. Build the shell here and fill it when E11 and E08 land. The
client's 2026-08-25 feedback on this screen says it feels good overall; the
sign-out button next to the avatar is an open question, not yet resolved.

**Undecided, deliberately**
- Q12: what numbers belong in the stats card. The shell ships here; the
  contents wait on E11 and E08.
- Whether the sign-out button belongs next to the avatar is open, not
  resolved.

**Frontend**  Greeting header with avatar, the stats card (streak, best
streak, drawing count, weekly dot strip, three milestone badges, contents
pending E11/E08), the Your walls list with a Create new row, and a Try
again control that retries all four loads together rather than one at a
time.
**Backend**  A stats endpoint computes streak, weekly completion, drawing
count and badges from real submission history; separate endpoints serve the
wall list and today's prompt. All four reads pass through the E05-F2 authz
gate for wall membership before returning rows.
**Reads/writes**  Streak, walls, prompt and stats are server data in data/
behind the typed client (register 5.1); walls and pending invites reload on
every focus so returning from creating or joining a wall is never stale.
The screen writes nothing itself, only routes forward with params.
**QE (draft)**  Happy path: all four loads succeed and the greeting, stats
and wall list render together. Edge: one of four loads fails, Try again
retries all four rather than just the failed one, a defined failure state
per engineering-standards.md section 3, not an infinite spinner. Edge: a
wall created or invite accepted elsewhere refreshes the list on return
instead of showing stale data. Unit tests on the streak and badge
calculation logic in lib/, since that math is pure. Contract test on the
stats endpoint shape once E11 and E08 define its fields.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 3 iOS-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F5)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/home.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-53 E05-F6 Reactions, post-unlock only
- Action: update
- Summary: unchanged
- Labels: current Backend-and-iOS,GREEN,rough-points -> proposed Backend-and-iOS, GREEN, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A fixed sentiment-emoji set, available only after the caller has submitted.

**Flagged risk (register contradiction, not resolved here)**: this feature
is filed GREEN, here on SCRIBL-53, but epic-board-mapping.md records a live
disagreement: the client board treats reactions as an orange sticky. Re-point
or re-band it at sprint 1 planning if the board was right; keep the
disagreement on record rather than resolving it here.

Reactions are the entire social currency of this product, no comments, no
counts, no algorithm. Open commenting was deferred at kickoff and, if it
ever ships, is a per-wall-host toggle, never always on.

**Undecided, deliberately**
- Whether a person can react to their own work; no source in the packet
  answers it.

**Frontend**  A single heart reaction chip on the response detail view,
reachable only from an unlocked (post-submit) state.
**Backend**  The reaction write is gated by the same submit-to-unlock check
(register 4.1) that governs the response itself, so the invariant reaches
into this feature. A reaction attempt pre-unlock must fail the same way a
locked read fails, not with a different error shape. The reaction endpoint
returns the updated response in place rather than requiring a reload, and
its read side passes through the E05-F2 authz gate like every other wall
read.
**Reads/writes**  Reactions are server data in data/, not client state
(register 5.1); reacting writes the new reaction straight into the already
loaded response.
**QE (draft)**  This is a tier-1 invariant test alongside submit-to-unlock
and channel isolation per engineering-standards.md section 4: reacting
pre-unlock must be impossible by any route, written before the reaction UI.
Happy path: reacting on an unlocked response updates the chip in place. The
"can a person react to their own work" question stays undecided until a
source answers it, do not guess a rule.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 2 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F6)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/family.md
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/response-id.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f5-wall-browsing-and-composition.md
~~~

### CREATE E05-F7 Create a wall and invite by email in one form
- Action: create
- Issue type: Story
- Summary: E05-F7 Create a wall and invite by email in one form
- Parent: SCRIBL-47
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-48 (E05-F1)
- Description:

~~~
E05-F1 builds the channel model server-side; no feature builds the client
form that names a wall, parses an address list, and reports per-address
failures. It is the only door to wall creation in the app.

**Frontend**  Wall-name input, invite-by-email input parsing comma,
semicolon or space separated addresses, a Create wall button disabled until
the name is non-empty, per-address error rows for a failed or invalid
invite, and the standard ScreenHeader.
**Backend**  Calls the wall-create endpoint from E05-F1, returning a real
server id, then the per-address member-invite endpoint once per parsed
address. Invite delivery is simulated server-side, not a real email send;
this form must not ship as if that gap is closed.
**Reads/writes**  The form opens blank, nothing read on entry. Success
writes the new wall and invite rows through the API client into the query
cache, plus a local pending-invite record in a client store since that
record is ephemeral UI state, not server truth (register 5.1). A stale
session at submit time signs the caller out to sign-up rather than showing
a false success.
**QE (draft)**  Happy path: a valid name and submit creates the wall and
returns to home. Edge: one bad address in a batch errors only that row
while wall creation still succeeds. Edge: a stale session at submit signs
out to sign-up. Contract test on the wall-create and member-invite request
shapes against packages/contracts.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F7)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/create-wall.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
~~~

### CREATE E05-F8 Draw against a wall-pinned prompt
- Action: create
- Issue type: Story
- Summary: E05-F8 Draw against a wall-pinned prompt
- Parent: SCRIBL-47
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-41 (E04-F1)
- Description:

~~~
The draw screen carries a second entry path that skips the daily prompt and
submits to one wall against a pinned prompt, and nothing else in the
backlog owns it. The narrow tool set here (one brush, eight colors) is the
shipping decision, not a flagged-down richer set; E18-F1 was retired
2026-09-01 and E04-F1 states the client's decision outright, so that
question is closed against this feature, not open.

**Frontend**  The DrawPad canvas with its color swatch row, undo and trash
controls, an elapsed-time chip, and a Done button disabled with an
explanatory label when the prompt fetch fails, a defined failure state
rather than a silent hang (engineering-standards.md section 3).
**Backend**  Serves today's prompt for the unpinned path only; the pinned
deep-link path carries its prompt in route params and skips the call. No
write endpoint fires from this screen, the submit call belongs to E05-F3.
**Reads/writes**  Gates on auth hydration, then reads the prompt from the
query cache or from route params depending on pinned status. Finishing
writes the image, prompt id, strokes and pinned channel id into a client
draft store, since that draft is client state until submitted (register
5.1), then hands off to story-select.
**QE (draft)**  Happy path: finishing a drawing advances to story-select
with the export written to the draft. Edge: an unpinned prompt fetch
failure disables Done with an explanatory label. Edge: an unauthenticated
visitor is redirected to sign-up before the canvas renders. Component test
on the Done-button disabled state, behaviour not markup.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F8)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/draw.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
~~~

### CREATE E05-F9 Remove the AI enhancement controls from the response viewer
- Action: create
- Issue type: Story
- Summary: E05-F9 Remove the AI enhancement controls from the response viewer
- Parent: SCRIBL-47
- Labels: GRAY, iOS
- Issue links: is blocked by SCRIBL-51 (E05-F4)
- Description:

~~~
E18-F5's retirement leaves the original-and-enhanced toggle pill and the
regenerate action as dead controls behind an off flag. Take them out rather
than shipping UI for a capability the product no longer has.
architecture.md section 4: delete as readily as you add, dead code behind a
month-old flag gets removed along with the flag.

**Frontend**  Remove the original-and-enhanced toggle pill and the
regenerate action from the response detail view. The prompt, author,
timestamp, drawing, caption or voice-note player, heart reaction chip,
header share button, retry-on-failure control and locked-state message all
stay as built by E05-F4 and E05-F6.
**Backend**  No endpoint change; the enhancement pipeline these controls
called is already gone with E18-F5.
**QE (draft)**  Happy path: the response detail view renders without the
toggle or regenerate action and nothing else on the screen regresses. Edge:
the off flag and its dead branch are deleted together, not left in place
disabled, so a later contributor cannot re-enable a capability that no
longer exists server-side. Component test confirming the controls are
absent from the rendered tree.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F9)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/response-id.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f5-wall-browsing-and-composition.md
~~~

### CREATE E05-F10 Wall member administration screen
- Action: create
- Issue type: Story
- Summary: E05-F10 Wall member administration screen
- Parent: SCRIBL-47
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-48 (E05-F1)
- Description:

~~~
The roster screen that shows members, invites by email, removes a member,
and offers leave and delete, gated per action so only the creator sees the
write controls. E05-F1 covers membership as data only; this is the
administration surface on top of it.

**Frontend**  Member list with avatar, name, email and a per-row Remove
link, an Add member card with an email input and Add button, and Delete
wall and Leave wall rows, each shown or hidden by whether the viewer is the
wall's creator.
**Backend**  A roster endpoint keyed by wall id, plus member-add,
member-remove, leave and delete endpoints. Invite stays simulated
server-side per E05-F1, no real email send. Every roster read passes
through the E05-F2 authz gate; write actions (remove, leave, delete)
enforce the creator-only rule inside authz/ as well, not as a client-side
hide.
**Reads/writes**  The route's wall id and an origin param drive the roster
load in an effect, server data in data/. Remove, invite, leave and delete
are direct actions with no automatic write on exit; a successful leave or
delete also invalidates the wall-list cache so home drops the wall.
**QE (draft)**  Happy path: the wall's creator opens the screen and the
roster, invite card and delete row all render. Edge: the sole owner of a
wall with no other members tries to leave, the screen blocks it with an
explanatory message, this is E05-F11's rule surfaced here. Non-creator
viewers see the roster with write controls hidden, not just disabled, since
a hidden control that is still reachable by direct call is an authz gap,
not a UI gap. Contract test on the roster and member-action shapes.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F10)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/wall-id-members.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
~~~

### CREATE E05-F11 Leave a wall and delete a wall, with the orphan and archive guards
- Action: create
- Issue type: Story
- Summary: E05-F11 Leave a wall and delete a wall, with the orphan and archive guards
- Parent: SCRIBL-47
- Labels: GREEN, Backend
- Issue links: is blocked by SCRIBL-48 (E05-F1)
- Description:

~~~
Both endpoints exist in the POC with real rules: a sole-owner creator cannot
leave, and the personal archive wall refuses delete. E05-F1 says nothing
about leaving or deleting, so this feature owns those rules server-side
while E05-F10 owns the screen that calls them.

**Frontend**  No screen of its own; the leave and delete rows this feature
backs live on the roster screen E05-F10 builds.
**Backend**  Leave and delete endpoints in services/, enforcing the two
guards: a sole owner with no other members cannot leave (the wall would
orphan), and the personal archive wall cannot be deleted at all. Both
checks sit behind the same authz/ module every wall read and write goes
through, not as separate ad hoc logic in the route handler. A successful
delete removes the wall's submission_channels rows for that wall, register
2.4's join table, without touching the submission or its image, since the
same submission may still be shared to other walls.
**Reads/writes**  Wall and membership state read for the guard checks comes
from data/ behind the typed client; a successful leave or delete
invalidates the wall-list cache so home drops the wall, the same
invalidation E05-F10 relies on.
**QE (draft)**  Happy path: a creator with other members present leaves
cleanly, and a non-archive wall's creator deletes it cleanly. Edge: a
sole-owner creator attempting to leave a wall with no other members is
blocked with an explanatory error. Edge: an attempt to delete the personal
archive wall is refused regardless of caller. Integration test on both
guards against a real local Postgres, since orphan and archive rules are
exactly the kind of logic that mocked SQL would hide a bug in.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F11)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/wall-id-members.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
~~~

### CREATE E05-F12 Put a wall administration door on the wall
- Action: create
- Issue type: Story
- Summary: E05-F12 Put a wall administration door on the wall
- Parent: SCRIBL-47
- Labels: GREEN, Design
- Issue links: is blocked by NEW E05-F10
- Description:

~~~
The member screen is reachable only through settings, so a person managing
a wall has to leave the wall to do it. This is a design decision, not a
build task: put a door to the roster screen (E05-F10) on the wall itself.

**Frontend**  A visible entry point on the wall or family screen that
routes directly to the wall-members screen, carrying an origin param so
the back arrow returns to the wall rather than to settings. No new backend
surface; this reuses E05-F10's screen and E05-F1's data.
**QE (draft)**  Happy path: from a wall's own screen, the new entry point
opens the roster for that wall and the back control returns to the wall.
No new invariant or contract surface, this is a navigation change on top of
an existing screen; a component test on the origin-param back-arrow
behaviour covers it.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F12)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/wall-id-members.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f7-wall-creation-and-administration.md
~~~

### CREATE E05-F13 Edit a caption after it is submitted
- Action: create
- Issue type: Story
- Summary: E05-F13 Edit a caption after it is submitted
- Parent: SCRIBL-47
- Labels: GREEN, iOS
- Issue links: is blocked by SCRIBL-51 (E05-F4)
- Description:

~~~
The write screen promises the caption stays editable after publish, and no
edit surface exists anywhere in the app. Build the editor or change the
copy; leaving the promise unbuilt is a defect either way.

**Frontend**  An edit control on the response detail view (E05-F4) that
opens the existing caption input pattern from the write screen, a live
character counter at the shared 280-character cap, and a save or cancel
pair.
**Backend**  Register 2.6: edits add a revision, never mutate one, so a
caption edit is a new revision row against the submission, not an in-place
UPDATE of the original. The submit-to-unlock check (register 4.1) is
untouched by an edit since the submission already exists; the edit only
authorizes on ownership of that submission through the same authz/ module.
**Reads/writes**  The caption is server data once submitted, so an edit
reads and writes through data/ and the typed client, not a client store,
even though the original draft caption lived in a client store before
submit (register 5.1, the boundary sits at submit time).
**QE (draft)**  Happy path: the author edits a caption under the cap and
saves, the new text renders on the response detail view. Edge: a
non-author viewer has no access to the edit control, enforced by the same
authz check as the write, not by hiding a button. Edge: an edit over the
character cap is blocked client-side and rejected server-side if it
somehow arrives. Contract test on the caption-edit endpoint shape.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects)
-> contracts/ -> lib/. The API is one long-running Node HTTP container
behind a load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E05-F13)
Screen: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/write.md
Flow: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
~~~

## E06 QA foundation and standards -- SCRIBL-54

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-54 E06 QA foundation and standards
- Action: update
- Summary: unchanged
- Labels: current GREEN,QA -> proposed GREEN, QA (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The 2026-08-20 walkthrough named the problem. QA starts on day one and there is no code, so there is nothing to write test cases against until week three at the earliest. The sequence agreed on that call is the right one: documented and reviewed requirements first, then test cases generated from those requirements plus the design frames, because a mockup does not tell you what the screen was meant to achieve.

This epic owns more than its own testing. It owns the test-tier doctrine for the whole engagement, engineering-standards.md section 4: six tiers ordered by value, invariant tests as launch gates written before the feature they guard, contract tests against packages/contracts, unit tests on lib/ and selectors/, integration tests against a real local Postgres rather than mocked SQL, component tests on behaviour, and a thin Playwright E2E suite on the daily loop only. It also owns two artifacts that belong to other epics' invariants: the submit-to-unlock and channel-isolation bypass probes (architecture.md section 6), and the structural tests that no module under backend/src/authz/ imports the flag client and that every declared flag has an owner with every release flag carrying a removeBy.

The coverage bar is genuinely undecided. engineering-standards.md section 4 says thresholds are set per tier once the shape is real, not as one global number, and names three candidate answers already on record with an instruction not to invent a fourth. Q48 tracks the same fact: three different coverage numbers were given in one hour on 2026-08-20. This epic settles the number; it does not invent one here.

E06 and E07 never map to the kickoff board: both were added after the sticky-note wall, so the wall is not a complete backlog and this epic should not be read against it.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Invariant tests are launch gates and are written before the feature (engineering-standards.md section 4). All authorization runs through backend/src/authz/, the single choke point.

**Undecided, deliberately**
- Q48: three different coverage numbers were given in one hour on the 2026-08-20 call; the number this epic settles is not invented here.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Board mapping: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/epic-board-mapping.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-55 E06-F1 QA process standard for this engagement
- Action: update
- Summary: unchanged
- Labels: current GREEN,QA,rough-points -> proposed GREEN, QA, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The written process: how a feature moves from ready to tested, what evidence counts, who signs off, and what happens when a build fails a gate. Sized to three two-week sprints and a remote team split across time zones rather than to a general-purpose QA handbook. Client-facing document, because it is the reference both sides work from when a build is called tested.

A markdown process document under handbook/, not code. It has to name the six test tiers from engineering-standards.md section 4 as the shared vocabulary for "tested," so later features (E06-F3, E06-F5, E06-F6) can cite a tier by name instead of re-explaining it.

**QE (draft)**
No test surface of its own. Its acceptance check is a review by Scribl and a sign-off recorded against the document itself.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.

**Size (rough)**: 3 QA-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06-F1)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### UPDATE SCRIBL-56 E06-F2 Tooling recommendation with the alternatives written down
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q53,Q58,Q59,QA,rough-points -> proposed GREEN, QA, Q53, Q58, Q59, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Three recommendations, each with the options considered and the reason for the call: the automation framework for a React Native app on iOS, the device strategy (real devices, simulators or a hosted farm), and where test cases live given that nobody knows yet whether the Bounteous Jira instance does test-case management (Q53). Write the cost of each option next to it, because the subscription question needs a case before it can be approved. This is the same deliverable as the Sprint 0 spike E00-F3: it answers Q48 and Q53 and costs nothing new because the four QA-days already sit here.

toolchain.md section 2 has already made the tool decisions this feature is not free to re-open: Jest everywhere as one runner with two projects, because the app side needs jest-expo for the React Native transform regardless and two runners would mean two mental models for one team; Playwright for web E2E against the export; native E2E deferred, Maestro first when it is needed because it is far simpler to keep green than Detox; dependency-cruiser for the architecture boundaries. What this feature still has to decide is the device strategy (real devices, simulator, or a hosted farm) and where test cases live (Q53), both open.

**QE (draft)**
No automated test of its own. The deliverable is the recommendation document; its check is Scribl's sign-off on the priced options, same as E06-F1.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.

**Size (rough)**: 4 QA-days

**Undecided, deliberately**
- Q53: whether the Bounteous Jira instance does test-case management, which decides where test cases live.
- Q58: open, tracked against this feature's device-strategy recommendation.
- Q59: open, tracked against this feature's device-strategy recommendation.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06-F2)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/toolchain.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-57 E06-F3 Test strategy and a priced coverage commitment
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q48,QA,rough-points -> proposed GREEN, QA, Q48, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
What gets unit tested, what gets automated end to end, what stays manual, and what the number is, with the cost of each layer in QA-days. An 80 percent unit coverage commitment across three two-week sprints is a different engagement from a manual-plus-smoke commitment. Settle the number with Scribl before it gets quoted anywhere else.

Undecided by design. engineering-standards.md section 4 says coverage thresholds are set per tier once the shape is real, not as one global number, and names three candidate answers on record with an instruction not to invent a fourth. Q48 is the same open item: three different coverage answers were given in one hour on 2026-08-20. This feature does not pick one; it prices the candidates so Scribl can.

**QE (draft)**
This feature is the definition of the QE tiers other features cite, not a thing tested itself. Its output is the priced strategy document.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.

**Size (rough)**: 3 QA-days

**Undecided, deliberately**
- Q48: three different coverage answers were given in one hour on 2026-08-20; this feature prices the candidates rather than picking one.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06-F3)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-58 E06-F4 Requirements review and traceability
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q15,Q16,QA,rough-points -> proposed GREEN, QA, Q15, Q16, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Every feature on this page reviewed and turned into testable statements, traced back to the design frame or the decision it came from. This is the starting order QA set out on the 2026-08-20 walkthrough and it is the right one. Two limits: the 23 PNG exports may not be the complete set and we do not have file access (Q16), and which screens get a full design pass versus which get the theme replicated is not yet split (Q15), so traceability against design is partial until both close.

A traceability matrix mapping each feature body to the decision register entry, ADR or design frame it derives from. For the features in this epic itself, that source is the handbook rather than a screen, since none of E06, E08 or E10 carries a prototype screen.

**QE (draft)**
No automated check. The matrix is reviewed against tracking/backlog-epics.md and the register for gaps, and Q15 and Q16 are named as the reason coverage is partial rather than silently treated as complete.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.

**Size (rough)**: 4 QA-days

**Undecided, deliberately**
- Q15: which screens get a full design pass versus which get the theme replicated is not yet split.
- Q16: the 23 PNG exports may not be the complete set and file access is not yet available.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06-F4)
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-59 E06-F5 Automation harness build
- Action: update
- Summary: unchanged
- Labels: current GREEN,QA,rough-points -> proposed GREEN, QA, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The harness itself, built against the API contract and mock server from E01-F5 so it does not wait on the app. First real tests are the invariants rather than the screens: submit-to-unlock cannot be bypassed, channel A never leaks into channel B, reactions are impossible pre-unlock. Those three are the tests worth having on day one because each of them failing is a product promise broken rather than a cosmetic defect.

Jest as the one runner, two projects per toolchain.md section 2, wired to the mock server contract from E01-F5 so the harness runs before the real backend exists. This feature is where the two invariant probes named in architecture.md section 6 become artifacts, even though the invariants themselves belong to E04 (submit-to-unlock) and E05 (channel isolation): a probe that submits without unlocking and expects a refusal, and a probe that reads across two wall memberships and expects isolation. Adapters are substituted, never module-mocked, per section 4's standard.

**QE (draft)**
Tier 1, invariant. These are launch gates and are written before the features they guard, per engineering-standards.md section 4. Test names state the behaviour, for example "refuses a channel read before submit". The clock is injected, not read from the wall.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Invariant tests are launch gates and are written before the feature (engineering-standards.md section 4). All authorization runs through backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the mock server and the real API cannot drift.

**Size (rough)**: 6 QA-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06-F5)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/toolchain.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
~~~

### UPDATE SCRIBL-60 E06-F6 Release gate, definition of ready, definition of done
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q43,QA-and-Delivery,rough-points -> proposed GREEN, QA-and-Delivery, Q43, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
What has to be true before a build goes to a Wednesday demo, and what has to be true before a feature is called done. Neither is defined for this team today (Q43), and with three demos in eight weeks the gate gets used six times, so it is worth the two days. The three invariant tests from E06-F5 are the non-negotiable part of the gate.

A written definition of ready and definition of done. The non-negotiable line item in definition of done is a green run of the two invariant probes from E06-F5, plus the flag-client import check from architecture.md section 6 (no module under backend/src/authz/ imports the flag client, every declared flag has an owner, every release flag carries a removeBy). Blocked on Q43 for the rest of the gate's content.

**QE (draft)**
No test of its own; it is the gate other tests report into. The three invariant tests it names are Tier 1 per engineering-standards.md section 4 and are already covered by E06-F5.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Invariant tests are launch gates and are written before the feature (engineering-standards.md section 4). All authorization runs through backend/src/authz/, the single choke point.

**Size (rough)**: 2 QA-days

**Undecided, deliberately**
- Q43: neither the release gate nor the definition of done is defined for this team today; this feature is blocked on that answer beyond the invariant-probe line item.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06-F6)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-61 E06-F7 Device matrix and the test-device request
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q44,Q51,QA-and-Delivery,rough-points -> proposed GREEN, QA-and-Delivery, Q44, Q51, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The list of devices and iOS versions this build is tested on, and the purchase or loan request that gets them into testers' hands. Bounteous runs this process on other projects, so the process exists; the numbers do not, and they depend on the same Q44 answer that gates E04-F6. Raise the request in discovery, because hardware procurement is measured in weeks and this engagement is eight of them.

A device and OS-version matrix, undecided pending Q44 (the same device-support answer E04-F6 needs) and Q51 (physical device availability). No code surface; this is a procurement and planning artifact.

**QE (draft)**
No automated test. The matrix feeds which devices the component and E2E tiers in E06-F5 actually run against once real devices exist.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.

**Size (rough)**: 2 QA-days

**Undecided, deliberately**
- Q44: device-support answer, shared with E04-F6, not yet settled.
- Q51: physical device availability not yet settled.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E06-F7)
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

## E07 Build, signing and tester distribution -- SCRIBL-62

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-62 E07 Build, signing and tester distribution
- Action: update
- Summary: unchanged
- Labels: current GREEN,Platform-and-iOS -> proposed GREEN, Platform-and-iOS (unchanged)
- New issue links: none
- New description (full replacement):

~~~
How a build reaches a human being. This is on the page as a green epic because the engagement commits to three Wednesday demos and Scribl was promised working software, and today none of it exists: no Apple Developer account, so no provisioning profile and no signing identity (Q5); no build host and no pipeline, with the laptops-versus-CI question raised on 2026-08-20 and closed by the platform decision at decision-register.md 9.3 and 9.6 (Q47); no distribution process, with TestFlight only a leaning (Q45); and no idea how many internal and external testers to configure for (Q46).

Worth separating this from the gray band cleanly. The board's gray item is App Store readiness and compliance, which is submission to the public store, and that stays gray and stays gated on Q56. This epic is a signed build in a tester's hands in week three. They are different problems and only one of them can wait.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E07)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-63 E07-F1 Apple Developer account and signing identity
- Action: update
- Summary: unchanged
- Labels: current Delivery,GREEN,Q5 -> proposed GREEN, Delivery, Q5 (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Scribl provisions an Apple Developer account, and the team gets a signing identity and provisioning profiles under it. Nothing in this epic and no demo build happens without it, and it is not work Bounteous can do unilaterally. It blocks E07-F3, E07-F4, every TestFlight build, and by extension the first client demo, which makes it the most expensive unanswered question on the engagement. Q5 stays open, undecided, no source resolves it.

**Backend**
No implementation until Q5 closes. When it does, the signing certificate and provisioning profile go into the pipeline as an encrypted secret, imported into a temporary keychain at build start and removed at the end, per release-readiness.md section 1.

**QE (draft)**
No test surface exists yet. Once the identity lands, a pipeline check confirms the signed archive step completes without a human running Xcode.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size**: not sized

**Undecided, deliberately**
- Q5: who provisions the Apple Developer account and signing identity stays open; no source resolves it.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E07-F1)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-64 E07-F2 Build host and pipeline decision
- Action: update
- Summary: unchanged
- Labels: current GREEN,Platform,Q47,rough-points -> proposed GREEN, Platform, Q47, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Decide where iOS builds run and write it down. This is decided, not open: register 9.3 confirms the hosted pipeline builds iOS too, on a GitHub Actions macOS runner, with no local-build phase and no self-hosted-runner phase to plan around. ci-cd.md's macOS-runner section gives the shape: runs-on: macos-* scoped to only the iOS build and archive step, gated to a release trigger rather than every push to main, because a macOS runner minute bills at roughly ten times a Linux one and nothing about the iOS build needs to run on every backend-only commit. This is the same decision as E01-F7 seen from the app side, made once there.

**Backend**
The release-trigger job: read the version, derive a monotonically increasing build number, expo prebuild, archive and export a signed build, upload debug symbols, upload to App Store Connect, print version, build number and commit sha.

**QE (draft)**
Pipeline test: two consecutive release triggers produce strictly increasing build numbers with no hand-typed value. Integration test: the macOS job is the only step in the workflow running on a macOS runner, confirmed by reading the workflow file's runs-on values.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 1 platform-day

**Flagged risk (register contradiction, not resolved here)**
The wiki's own metadata line still lists this feature as blocked by Q47. Open-questions.md records Q47 as closed 2026-08-27, resolved by the decision-register entries at 9.3 and 9.6 in favour of GitHub Actions hosted CI, which is exactly what this feature's body already describes as decided. Carried here as the wiki states it; the question this feature's blocked-by line points at may cover something narrower than the closed record. Do not treat this as reopening the build-host decision.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E07-F2)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/ci-cd.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-65 E07-F3 Automated iOS build
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q5,iOS-and-Platform,rough-points -> proposed GREEN, iOS-and-Platform, Q5, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A signed build produced from a commit without a human running Xcode, with versioning and build numbers that increment on their own. No Expo cloud build service and no EAS Update: native prebuild runs in the pipeline from E07-F2, and engineering-standards.md section 5 names the reason the no-EAS-Update decision holds beyond the standing POC-harness constraint, Apple guideline 2.5.2 prohibits downloading and executing code, and over-the-air JavaScript replacement is exactly the mechanism that rule addresses. This is invisible work that competes directly with screen work, worth stating out loud.

Three build variants come out of this pipeline: co.scribl.app.dev, co.scribl.app.qa, and the clean co.scribl.app for production, driven by APP_ENV through one dynamic app.config.ts rather than three checked-in variants that drift.

expo prebuild is where the pnpm autolinking risk in toolchain.md section 1 actually bites: prebuild and the Xcode native build resolve autolinking by walking node_modules, and pnpm's symlinked store is the historically fragile case for that walk. If autolinking breaks here, the fallback is node-linker=hoisted, which forfeits the strictness pnpm was chosen for. Verify this is actually solved rather than assumed before relying on it in a release pipeline.

**Backend**
scripts/build-ios.sh, called by the workflow step rather than written inline in YAML so it runs identically on a developer's own Mac. Reads the version from its single source of truth, derives the build number from the CI run number, prebuilds, archives, exports.

**QE (draft)**
Integration test: a prebuild against the pnpm-managed workspace resolves every native module's autolinking with no manual pod/gradle edit. Pipeline test: a repeated or lower build number is rejected rather than silently accepted.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 3 iOS-days

**Undecided, deliberately**
- Q5: this feature depends on E07-F1's signing identity, which stays open.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E07-F3)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/toolchain.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-66 E07-F4 TestFlight distribution process, written for Scribl
- Action: update
- Summary: unchanged
- Labels: current Delivery,GREEN,Q45,Q46 -> proposed GREEN, Delivery, Q45, Q46 (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The written process for getting a build to Scribl's testers: who manages the tester list, what the caps are, what a tester does on day one. release-readiness.md section 4 sizes internal testing at 100 or fewer with no beta review, build available in minutes, versus external testing at up to 10,000 with Beta App Review required. Nobody knows which group Scribl's testers fall into or how many there are (Q46), which stays open and feeds the infrastructure sizing question in Q50. The demo-account trap applies regardless of path: submit-to-unlock means a fresh account sees an empty wall, so the seeded reviewer account must arrive pre-seeded with a submission and visible wall content, automated behind a documented flag, never hand-built the night before a submission.

**Backend**
The seeding flag and its seeded account, backend-owned, with the contract mock from E01-F5 reproducing the same shape so the client path stays exercisable before the real API exists.

**QE (draft)**
Integration test: the seeded demo account, run through the seeding flag, shows a non-empty wall on first login. Q45 and Q46 stay undecided until the client names the tester list and count.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.
Contract tests against packages/contracts, asserted on both sides, so the mock server and the real API cannot drift.

**Size**: not sized

**Undecided, deliberately**
- Q45: TestFlight is only a leaning, not a confirmed distribution path.
- Q46: which tester group (internal or external) Scribl's testers fall into, and how many, is unknown, feeding Q50.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E07-F4)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-67 E07-F5 Crash reporting and build traceability
- Action: update
- Summary: unchanged
- Labels: current GREEN,iOS,rough-points -> proposed GREEN, iOS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Crashes from a tester's device arrive somewhere the team can read them, tied to a build number and a commit. One day of work that turns "it crashed" from a message into a stack trace, which matters more than usual when the testers are the client and the feedback loop is a weekly demo. release-readiness.md section 7 records the seam as already built, local adapter and Crashlytics adapter both written against the conformance suite, with the Crashlytics vendor package itself deliberately not wired until a Firebase project exists and its privacy manifest is audited. Debug symbols are uploaded to Crashlytics as part of the E07-F3 workflow; skipping that step leaves crash reports unsymbolicated.

**Backend**
services/crash/ seam, local and Crashlytics adapters behind one interface, factory throws on an unrecognised EXPO_PUBLIC_CRASH_ADAPTER value rather than falling back silently. Collection starts disabled and is enabled after consent.

**QE (draft)**
Conformance suite run against both adapters. Integration test: a crash on a build tagged with a commit sha resolves to a symbolicated stack trace naming that build number and commit.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 1 iOS-day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E07-F5)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
~~~

## E08 Analytics instrumentation, instrument now, report later -- SCRIBL-68

Approve: [ ] file this section  [ ] hold

### UPDATE SCRIBL-68 E08 Analytics instrumentation, instrument now, report later
- Action: update
- Summary: unchanged
- Labels: current Backend-and-iOS,GREEN -> proposed GREEN, Backend-and-iOS (unchanged)
- New issue links: none
- New description (full replacement):

~~~
The board's own qualifier is the whole scope of this epic. Instrumenting late means the first two months of behavior are gone permanently, and this is a retention product where D1, D7 and D30 are the numbers that decide whether it works. Reporting can wait, and ADR-0008 already says the analytics pipeline is separate from the operational store, with the warehouse deferred until product analytics cannot answer a question.

This is the epic that moved bands, and the reason is on record. epic-board-mapping.md says the analytics sticky sat in the green core band while the backlog had it ORANGE, and the conflict was resolved 2026-08-24 in favour of the board. Register section 10 names the analytics event pipeline as out of the current band in the same breath it calls it "the thing most worth fighting to keep, because unmeasured months cannot be recovered." Both readings are on record and neither has been reconciled beyond the band move; that tension is this epic's shape, not a contradiction to paper over.

service-seams.md section 1 decides where the seam sits. A vendor that might change belongs behind our own API, not an in-app interface, because an in-app swap costs a code change plus a store release, one to three weeks, while a server-side swap is a backend deploy in hours. The device posts events to us and we fan out; the vendor choice lives in backend/src/effects/, never in the app. The seam catalogue marks telemetry (product analytics) as DELIBERATELY ABSENT from this phase, with the reason that adding it changes both app stores' privacy declarations, which makes it a product decision rather than an engineering one. That is the single most important fact governing this epic's shape.

Real-user monitoring is out of scope for this phase (service-seams.md, 2026-08-31), and register 6.4 stands unamended: structured logging, one log group per environment, alarms on error rate and service health. No RUM SDK, no session replay, no performance-trace vendor.

Privacy floor, engineering-standards.md section 5: no personal data, content, or image bytes in logs, telemetry or crash reports, enforced by the logger's type signature rather than by discipline. A minor's diagnostics stay off without consent, and that is a Tier 1 invariant test and a launch gate. Register 7.2: consent is versioned rows, never a flag on a record. Register 6.5: crash reporting runs on a free tier gated on consent, and crash is the one seam whose swap point is in-app, because it has to capture native crashes and the last moments of a dying process, which cannot be done from JavaScript over HTTP.

The analytics system of record is one of four architect-owned decisions with no register entry at all (register 10b). It carries a recommendation on the open-questions list and is marked undecided here; do not invent one.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ -> components/ui/, data/ (query cache), stores/ (Zustand client state), services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature (engineering-standards.md section 4). All authorization runs through backend/src/authz/, the single choke point.

**Undecided, deliberately**
- Register 10b: the analytics system of record is one of four architect-owned decisions with no register entry at all. Carried as undecided, not resolved here.

**Flagged risk (register contradiction, not resolved here)**
ADR-0008 chose a streaming-to-warehouse pipeline; the technical implementation plan elsewhere names a product-analytics SDK, and the two documents disagree. Analytics is out of band this phase so nothing is blocked, but ADR-0008 should not be read as settled or built against as current; the instrumentation seam should not be built to a contradiction. This also sits against the band-move tension recorded above: the board calls this epic green core while the backlog and register 10 read it as out of band, and that has not been reconciled beyond the 2026-08-24 board decision.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E08)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
Board mapping: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/epic-board-mapping.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-69 E08-F1 Versioned event taxonomy
- Action: update
- Summary: unchanged
- Labels: current GREEN,Product-and-Backend,Q13,rough-points -> proposed GREEN, Product-and-Backend, Q13, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
A typed, versioned list of events with their properties, agreed before anyone fires one. Scribl offered their own success-metrics list on the kickoff call and it has not arrived (Q13); this taxonomy should be built from that list rather than from our guesses about what they measure.

**Backend**
Lives in packages/contracts as a versioned schema, parsed at the boundary rather than cast, per engineering-standards.md section 2. No personal data, content, or image bytes in an event property, per section 5's privacy floor. The system of record the taxonomy ultimately feeds is undecided, register 10b; this feature defines the shape, not the destination.

**QE (draft)**
Contract test asserting every declared event matches its schema on both the app and backend side, Tier 2 per engineering-standards.md section 4. Undecided until Q13 closes: which events Scribl's own success-metrics list requires beyond the funnel already named in E08-F2.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 2 backend-days

**Undecided, deliberately**
- Q13: Scribl's own success-metrics list, offered on the kickoff call, has not arrived; this taxonomy should be built from it once it does.
- Register 10b: the system of record this taxonomy ultimately feeds is undecided; this feature defines the shape, not the destination.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E08-F1)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-70 E08-F2 Client instrumentation
- Action: update
- Summary: unchanged
- Labels: current GREEN,Q6,iOS,rough-points -> proposed GREEN, iOS, Q6, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Events fired from the app for the prompt funnel: prompt seen, canvas opened, submitted, wall viewed, reaction given, invite sent, invite redeemed. That funnel and the invite pair are the two things worth having on day one, because one measures the habit and the other measures whether the product spreads.

**Frontend**
Calls sit in features/<name>/ alongside the action they describe, never in components/ui, per architecture.md section 2's dependency rule. The event posts to our own API rather than to a third-party SDK directly, per service-seams.md section 1: telemetry has no client-side vendor seam in this phase, deliberately, because adding one changes both stores' privacy declarations. Blocked on Q6 (consent-flow sequencing) since a minor's account cannot fire diagnostics before consent is recorded.

**QE (draft)**
Component test asserting the event fires on the user action it describes, not on a render, Tier 5 per engineering-standards.md section 4. The consent gate itself is Tier 1, a launch gate, per section 5's privacy floor: a minor's diagnostics stay off without consent.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ -> components/ui/, data/ (query cache), stores/ (Zustand client state), services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature (engineering-standards.md section 4). All authorization runs through backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the mock server and the real API cannot drift.

**Size (rough)**: 2 iOS-days

**Undecided, deliberately**
- Q6: consent-flow sequencing is unresolved; a minor's account cannot fire diagnostics before consent is recorded.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E08-F2)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### UPDATE SCRIBL-71 E08-F3 Event pipeline
- Action: update
- Summary: unchanged
- Labels: current AWS,GREEN,rough-points -> proposed GREEN, AWS, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Events land somewhere durable and queryable, per ADR-0008: Firehose into partitioned S3 with Athena over it. Deliberately not QuickSight dashboards and not the Glue and SageMaker data lake from the future-state design, both of which that design gates to well after this phase. Report later means exactly this.

**Backend**
Sits in backend/src/effects/, the seam-owning layer per architecture.md section 2 and service-seams.md section 1, since the downstream analytics vendor (if any) is a decision Scribl's stores have to sign off on, not us. The device posts to our own API; this feature is the fan out. The system of record beyond raw Athena-queryable S3 is undecided, register 10b.

**QE (draft)**
Integration test against a real local Postgres or the Firehose local adapter, not mocked, Tier 4 per engineering-standards.md section 4: an event posted lands in a queryable partition. No personal data, content, or image bytes in the event body, per section 5.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 3 backend-days

**Flagged risk (register contradiction, not resolved here)**
This feature implements against ADR-0008's Firehose-and-Athena shape. ADR-0008 and the technical implementation plan's product-analytics SDK disagree on the analytics system of record (code-questions.md A5); this feature should not be read as settling that contradiction, only as the fan-out layer feeding whichever system of record is eventually chosen.

**Undecided, deliberately**
- Register 10b: the system of record beyond raw Athena-queryable S3 is undecided.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E08-F3)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
~~~

### UPDATE SCRIBL-72 E08-F4 AI and infrastructure cost telemetry
- Action: update
- Summary: unchanged
- Labels: current AWS,GREEN,Q49,Q50,rough-points -> proposed GREEN, AWS, Q49, Q50, rough-points (unchanged)
- New issue links: none
- New description (full replacement):

~~~
Per-call model token logging and cost attributed per environment. The AWS estimate puts AI inference at roughly 60 percent of the 30-month total cost of ownership and about two thirds of it at full scale, so cost per active user is a product metric on this engagement rather than a finance one. It also matters more than usual here because hosting spend for this phase is not yet allocated (Q49) and the user base and concurrency to size for are undecided (Q50).

**Backend**
Structured log line per model call in backend/src/effects/, one log group per environment per register 6.4, tagged with environment and attributed cost. Not a dashboard, per the same register entry: the platform floor is logging plus alarms on error rate and service health, not a metrics stack. No RUM vendor, per service-seams.md's 2026-08-31 scope line.

**QE (draft)**
Unit test in lib/ on the cost-attribution calculation itself, Tier 3 per engineering-standards.md section 4, with the clock injected rather than read from the wall. Sizing thresholds and alarm bounds are undecided pending Q49 and Q50.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace monorepo. Dependency rule per architecture.md: dependencies point inward and downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ -> repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) -> contracts/ -> lib/. The API is one long-running Node HTTP container behind a load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 2 backend-days

**Undecided, deliberately**
- Q49: hosting spend for this phase is not yet allocated.
- Q50: the user base and concurrency to size for are undecided; also fed by E07-F4's Q46.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E08-F4)
Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

## E09 Push notifications, the daily nudge -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E09 Push notifications, the daily nudge
- Action: create
- Issue type: Epic
- Summary: E09 Push notifications, the daily nudge
- Parent: none (top-level epic)
- Labels: ORANGE, Backend-and-iOS
- Issue links: none
- Description:

~~~
A once-a-day habit product with no way to reach a person who has not opened
it is a product that quietly loses its users in week two. That is why this
is the first orange item and why E03-F5 exists as a one-day local-notification
bridge: if this epic loses its capacity fight, the loop degrades instead of
disappearing. The difference is that a local reminder cannot say "your sister
just posted", and that message is the reason anyone opens the app twice.

Managed push notification delivery is out of the current band per decision
register section 10: the seams here plus the local reminder are what get
built, so turning on server-driven push later is a configuration change
against service-seams.md section 1, not a rewrite. The board mapping
records the same split: the backend side (E09-F1, E09-F3) fits the capacity
this phase has; the client side (E09-F2, E09-F4) does not.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E09)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
~~~

### CREATE E09-F1 Managed push infrastructure
- Action: create
- Issue type: Story
- Summary: E09-F1 Managed push infrastructure
- Parent: NEW E09 epic
- Labels: ORANGE, AWS, rough-points
- Issue links: is blocked by SCRIBL-19 (E01-F2)
- Description:

~~~
Backend infrastructure for push delivery. Creates the SNS platform endpoint
per device, holds the ARN against the user, and manages the topic
subscription, all server-side per the seam decision recorded in
service-seams.md section 1 on 2026-08-31: an authenticated AWS call has no
safe path from the device, so the device only ever posts its OS-issued token
to POST /notifications/registrations and never sees an AWS credential. The
old "SNS into Pinpoint, per the production AWS architecture docs" framing is
stale against that decision and is replaced here.

**Backend** POST /notifications/registrations in routes/, delegating to
backend/src/effects/ for the SNS platform-endpoint create and topic
subscribe. The sns adapter and the local apns-fcm adapter (registers with
the OS, token goes nowhere) share the notifications seam interface, with a
factory that throws on an unrecognised adapter value rather than falling
back.

**QE (draft)** Contract test (tier 2) asserting the registration endpoint's
request and response shape against packages/contracts. Conformance suite
(tier 4, lib/-adjacent) run against both the sns and apns-fcm adapters so
the interface holds for either. No client AWS SDK to test; that absence is
itself the thing to assert in review.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 3 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E09-F1)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
~~~

### CREATE E09-F2 APNs registration and permission UX
- Action: create
- Issue type: Story
- Summary: E09-F2 APNs registration and permission UX
- Parent: NEW E09 epic
- Labels: ORANGE, iOS, Q6, rough-points
- Issue links: is blocked by NEW E09-F1; is blocked by SCRIBL-29 (E02-F2)
- Description:

~~~
Native APNs registration and the permission prompt, timed to earn a yes rather
than fired on first launch. ADR-0001 names push registration as one of the
few justified native modules. Push registration is a platform-edge adapter
per architecture.md section 3b, so Android replaces this adapter rather than
inheriting it; Platform.OS checks stay inside services/notifications and
never leak into a feature's action or selector. Blocked on Q6 and on iOS lane capacity: the orange
band earns a sprint slot only if the green work leaves room.

**Implementation** services/notifications adapter registers for APNs,
receives the OS token, and posts it to POST /notifications/registrations
(E09-F1). The permission-prompt timing and the decline path live in
features/notifications/.

**QE (draft)** Component test (tier 5) on the permission-prompt trigger
condition and the decline path, asserting behaviour, not markup. Contract
test (tier 2) on the registration POST payload shape.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 2 iOS-days

**Undecided, deliberately**
- Q6: blocked on iOS lane capacity; not resolved by this body.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E09-F2)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E09-F3 Timezone-correct daily nudge
- Action: create
- Issue type: Story
- Summary: E09-F3 Timezone-correct daily nudge
- Parent: NEW E09 epic
- Labels: ORANGE, Backend, rough-points
- Issue links: is blocked by NEW E09-F1; is blocked by SCRIBL-35 (E03-F1)
- Description:

~~~
The daily nudge fires on the person's local morning, not the server's clock.
E11-F1's streak engine has the identical day-boundary problem; solved twice,
the two would disagree at midnight and tell someone their streak broke while
reminding them to draw.

**Backend** A single pure day-boundary function in lib/, taking a timezone
and a clock value, shared by the nudge scheduler in backend/src/services/
and by E11-F1's streak calculation. The scheduler effect that actually sends
lives in backend/src/effects/, downstream of the SNS seam in E09-F1.

**QE (draft)** Unit tests (tier 3) on the day-boundary function across
timezone offsets and DST transitions, clock injected rather than read from
wall time, per engineering-standards.md section 4. Integration test (tier
4) that the scheduler and the streak engine, given the same instant and
timezone, agree on which calendar day it is.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 3 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E09-F3)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### CREATE E09-F4 Notification preferences and quiet hours
- Action: create
- Issue type: Story
- Summary: E09-F4 Notification preferences and quiet hours
- Parent: NEW E09 epic
- Labels: ORANGE, Backend-and-iOS, Q6, rough-points
- Issue links: is blocked by NEW E09-F3
- Description:

~~~
An on/off switch and quiet hours, the floor App Store review sets for an app
that sends daily notifications; if E09 ships, this ships with it.

**Backend** Preference storage and a quiet-hours window per user, read by
the E09-F3 scheduler before it calls the effect that sends. Not a feature
flag: this is a user preference, not a release control, and it has no
relationship to the flag rules in feature-flags.md.

**QE (draft)** Integration test (tier 4) against a local Postgres asserting
the scheduler does not send inside a configured quiet-hours window, and does
send just outside it. Contract test (tier 2) on the preferences endpoint
shape.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 2 backend-days

**Undecided, deliberately**
- Q6: blocked on capacity; not resolved by this body.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E09-F4)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

## E10 Moderation, fail-safe -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E10 Moderation, fail-safe
- Action: create
- Issue type: Epic
- Summary: E10 Moderation, fail-safe
- Parent: none (top-level epic)
- Labels: ORANGE, Backend-and-iOS
- Issue links: none
- Description:

~~~
The walls are private and invitation-only, which lowers the risk but does not
remove it, and App Store review does not grade on intent. Any app with
user-generated content needs report, block and takedown before it reaches the
public store, and the board's own word for this item is fail-safe, meaning
content is held rather than published when moderation cannot reach a verdict.

The fail policy is genuinely undecided. Register 10b lists "moderation fail
policy" as OUTSTANDING: a recommendation is on the open-questions list and
the decision is not made. E00-F13 is the Sprint 0 spike that owns closing it.
The board-mapping row (Q31) says the same thing: the ADR review left
fail-open versus fail-safe per content type as an open gate. This epic does
not decide it; E10-F2 prices the candidates instead.

What this epic DOES build is the human path, and that is a store-review
requirement, not a nicety. Register section 10: automated content moderation
is out of the current band, and report, block, take down, and a queue with a
named owner are built, because that is what store review checks. Register
7.3 puts the moderation substrate in the schema from the start, alongside
deletion and export.

Block relationships are enforced in backend/src/authz/, the same choke point
as channel isolation, register 4.2. That makes blocking a Tier 1 invariant
concern rather than a feature-level check, and it means this epic reaches
into E05's read path: a block has to be checked wherever a wall is read, not
only where content is reported.

Anything touching minors, consent, moderation or payment fails closed,
feature-flags.md section 2. A moderation kill switch is a permanent flag, not
a release flag, per the four flag kinds in that section. Under-13 users are
in scope, register 7.1, which is what makes this epic's fail-closed posture
non-negotiable rather than cautious.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E10)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
~~~

### CREATE E10-F1 Async moderation lane
- Action: create
- Issue type: Story
- Summary: E10-F1 Async moderation lane
- Parent: NEW E10 epic
- Labels: ORANGE, Backend, rough-points
- Issue links: is blocked by SCRIBL-21 (E01-F4); is blocked by SCRIBL-44 (E04-F4)
- Description:

~~~
Submission enqueues a moderation job; the queue is drained by the separate
AI service rather than by the request path, per ADR-0003 and ADR-0010, so
submit never waits on a model. ADR-0011 puts moderation on the Haiku tier,
which is the cheapest of the three tiers and the one that scales with
volume.

**Backend** Queue producer lives in backend/src/effects/; the consumer is a
separate service, per ADR-0003 and ADR-0010, so this feature never touches
routes/ or authz/ directly. The moderation kill switch this lane needs is a
permanent flag under feature-flags.md's kill-switch kind, and it fails
closed on outage per section 2's rule for anything touching moderation.

**QE (draft)** Integration test against a real local Postgres and the local
queue adapter, Tier 4 per engineering-standards.md section 4: a submission
enqueues exactly one job and submit returns before the job drains. Contract
test, Tier 2, on the job payload shape against packages/contracts.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 4 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E10-F1)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### CREATE E10-F2 Fail-safe policy per content type
- Action: create
- Issue type: Story
- Summary: E10-F2 Fail-safe policy per content type
- Parent: NEW E10 epic
- Labels: ORANGE, Product-and-Backend, Q31, rough-points
- Issue links: is blocked by NEW E10-F1
- Description:

~~~
Written policy, then code: what happens to a drawing, a story and a
transcript when the model is unavailable, times out, or returns low
confidence. The board says fail-safe, which means hold rather than publish,
and holding a child's drawing from their grandmother's wall for ten minutes
has a product cost worth naming before it happens in a demo.

**Backend** Undecided. Register 10b marks the moderation fail policy
OUTSTANDING, and Q31 is the same open item. This feature does not choose
fail-open or fail-safe; it prices what each candidate costs per content type
(hold time, false-hold rate, the ten-minute grandmother case) so the decision
lands with evidence rather than a guess. Once decided, whichever policy wins
fails closed per feature-flags.md section 2 because moderation is on that
section's fails-closed list regardless of which branch is chosen.

**QE (draft)** Tier 1, invariant, once the policy is decided. A model
timeout or low-confidence result never results in publish under the
fail-safe branch. Until then this feature has no test, because there is no
decided behaviour to assert.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 2 backend-days

**Undecided, deliberately**
- Q31: the fail-open versus fail-safe policy per content type is not decided
  here; this feature prices the candidates and stops there.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E10-F2)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E10-F3 Report, block and takedown
- Action: create
- Issue type: Story
- Summary: E10-F3 Report, block and takedown
- Parent: NEW E10 epic
- Labels: ORANGE, iOS-and-Backend, Q6, rough-points
- Issue links: is blocked by SCRIBL-51 (E05-F4)
- Description:

~~~
Any wall member can report content, block a person, and have content
removed. This is the human path and it is the part App Store review
actually checks, so if automated moderation slips out of the eight weeks
this feature cannot slip with it. Blocked on iOS capacity, not on a
decision.

**Backend** Block relationships are enforced in backend/src/authz/, the same
choke point that enforces channel isolation, register 4.2. That means this
feature reaches into E05's read path: every wall read has to consult the
block relationship at the same choke point, not at the report/takedown
endpoint alone. Report and takedown are routes/ -> authz/ -> services/ ->
repositories/, per architecture.md section 2, with no SQL outside
repositories/.

**QE (draft)** Tier 1, invariant: a blocked person's content never appears
in the blocking person's wall read, tested the same way as the
channel-isolation probe in E06-F5 since it shares the choke point. Component
test, Tier 5, on the report and block UI behaviour, not markup.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.

**Size (rough)**: 2 iOS-days

**Undecided, deliberately**
- Q6: blocked on iOS lane capacity; not resolved by this body.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E10-F3)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/architecture.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E10-F4 Review queue with a named owner and an action SLA
- Action: create
- Issue type: Story
- Summary: E10-F4 Review queue with a named owner and an action SLA
- Parent: NEW E10 epic
- Labels: ORANGE, Product-and-Delivery, Q22, Q31
- Issue links: is blocked by NEW E10-F3
- Description:

~~~
Somewhere reported content lands, someone whose job it is to look at it, and
a committed turnaround. Store review for user-generated content expects
prompt action on reported content, and a queue with no named owner fails
that test on paper. Scribl has no named product owner (Q22), so this feature
has no owner either, and that is the blocker rather than the tooling.

**Backend** The queue table, owner field and response-time field are
already part of the schema per register 7.3, built with deletion and export
rather than as an afterthought. What is undecided is who the owner is (Q22)
and what the committed turnaround is (Q31, since the SLA and the fail policy
are the same conversation about how fast a verdict has to land).

**QE (draft)** Undecided until Q22 and Q31 close. Once an owner and an SLA
exist, the integration test, Tier 4, asserts a reported item's age against
the SLA is queryable; no test can assert a turnaround that has no committed
number yet.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size**: not sized

**Undecided, deliberately**
- Q22: Scribl has no named product owner, so this feature has no owner either.
- Q31: the committed turnaround depends on the same open fail-policy question as E10-F2.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E10-F4)
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E10-F5 Third-party AI consent
- Action: create
- Issue type: Story
- Summary: E10-F5 Third-party AI consent
- Parent: NEW E10 epic
- Labels: ORANGE, iOS-and-Backend, rough-points
- Issue links: is blocked by SCRIBL-28 (E02-F1)
- Description:

~~~
Explicit consent, captured once, before any content is sent to a
third-party model, and content never used for training without an opt-in.
Apple's rules require the disclosure, and the product principle that the
person owns their creations requires the opt-in to be off by default.

**Backend** Consent is a versioned row per person, per kind, per version,
register 7.2, never a flag on a record. Content only reaches a third-party
model after the consent row exists; the check sits ahead of the moderation
lane's queue producer in E10-F1. Off by default is the same fail-closed
posture feature-flags.md section 2 requires for anything touching consent.

**QE (draft)** Tier 1, invariant: content cannot reach the moderation queue
without a recorded consent row for the account. Test names the behaviour
directly, for example "refuses third-party dispatch before consent
recorded".

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size (rough)**: 1 backend-day

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E10-F5)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
~~~

## E11 Streaks and progression -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E11 Streaks and progression
- Action: create
- Issue type: Epic
- Summary: E11 Streaks and progression
- Parent: none (top-level epic)
- Labels: ORANGE, Backend-and-iOS
- Issue links: none
- Description:

~~~
The mechanic that turns one good day into a practice. It is also the
cheapest orange item on the board: the streak rule is a few lines against
the submissions table, and the archive is a query that already has its
index from E01-F3. The part that is not cheap is being correct about what a
day is, because a streak that resets wrongly at midnight is worse for
retention than no streak at all.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E11)
~~~

### CREATE E11-F1 Timezone-correct streak engine
- Action: create
- Issue type: Story
- Summary: E11-F1 Timezone-correct streak engine
- Parent: NEW E11 epic
- Labels: ORANGE, Backend, rough-points
- Issue links: is blocked by SCRIBL-20 (E01-F3); is blocked by SCRIBL-44 (E04-F4)
- Description:

~~~
Increment once on a new local day, never twice on the same day, reset on a
miss, computed in the person's timezone rather than the server's. Shares
the day-boundary definition in lib/prompt-day.ts with E03-F3 and E09-F3 so
the prompt, the nudge, and the streak all agree on when today started.
Whether the streak is computed on read or maintained as a stored counter is
undecided. The packet's authored backend prose for the root screen says the
user's stats are served "for a computed streak," which this feature takes as
the shape, but a computed streak recalculated from the submissions table on
every read and a stored counter incremented on submit are different builds
with different staleness risk, and no source picks one. The choose-channels
submit screen is where a submission is written, which is the moment any
stored counter would need to advance; if the streak stays computed, that
screen writes nothing extra at all.

**Frontend** No dedicated screen; the wall-unlock submit on choose-channels
is the write that would trigger a stored increment if the engine is ever
built that way.

**Backend** A pure streak selector over the submissions table, timezone
aware, sharing lib/prompt-day.ts's day boundary with E03-F3 and E09-F3.
Server data only, read into data/, never a client store (register 5.1),
correcting the POC's "streak store" framing.

**Reads/writes** Reads submission history and the user's timezone; writes
nothing if computed on read, or writes one counter row per qualifying
submission if a stored counter is chosen, pending the undecided question
above.

**QE (draft)** Tier 1 invariant test, launch gate written first per
engineering-standards.md section 4: a streak never increments twice for the
same local day and always resets on a missed day, with the clock injected
rather than read from wall-clock time. Tier 3 unit tests on the pure
selector across a DST transition and a cross-midnight submission. Happy
path: a submission on a new local day increments the streak by one. Edge:
two submissions on the same local day leave the streak unchanged; a missed
day resets it to zero on the next read.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 3 backend-days

**Undecided, deliberately**
- Whether the streak is computed on read or maintained as a stored counter
  is not decided; no source in this packet picks one.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E11-F1)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/choose-channels.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
~~~

### CREATE E11-F2 Streak and stats surface
- Action: create
- Issue type: Story
- Summary: E11-F2 Streak and stats surface
- Parent: NEW E11 epic
- Labels: ORANGE, iOS, Q12, Q6, rough-points
- Issue links: is blocked by NEW E11-F1; is blocked by SCRIBL-52 (E05-F5)
- Description:

~~~
The current streak, a week view, and the stats card content. Blocked on
Q12 and Q6. This is the content for the E05-F5 shell, which ships green and
empty rather than waiting, because an empty deliberate card reads better
than a broken half-built one. E11 is ORANGE and outside the eight weeks on
the client side (register section 10's not-in-this-phase table); this
feature does not get promoted to close the root-screen gap below, the gap
gets resolved by changing what the root screen depends on, not by pulling
this feature forward.

Name the sequencing problem plainly: the root screen (E03-F2) is GREEN and
renders a streak tile that is this feature, ORANGE and blocked. A GREEN
front door depending on a blocked ORANGE feature is a real scheduling
defect, worth resolving before sprint 1, most likely by having the root
screen ship with the streak tile behind a release flag defaulting to hidden
until this feature clears its blockers.

**Frontend** The stats card on /home: streak, best streak, drawing count, a
weekly dot strip, and three milestone badges (E11-F4's numbers), plus the
streak tile on the root screen; a Try again control on /home retries all
four of that screen's loads together, not just the failed one.

**Backend** A stats endpoint computing streak, weekly completion, drawing
count, and badge state from real submission history, built on E11-F1's
streak selector.

**Reads/writes** Server-owned stats read into data/, not a "stats store" or
"streak store" per the POC framing; register 5.1 keeps this out of Zustand.
Reloads on every focus to /home so a just-completed submission is never
stale; writes nothing.

**QE (draft)** Tier 5 component tests on behaviour: the four /home loads
succeed and render real numbers; one of the four fails and the single Try
again control retries all four; returning to /home after a wall action
refreshes rather than showing stale data. Happy path on root: an
unsubmitted day renders the streak tile alongside the prompt and countdown.
Undecided: Q12 and Q6 gate this feature and are not resolved by this body.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 2 iOS-days

**Undecided, deliberately**
- Q12 and Q6 gate this feature and are not resolved by this body.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E11-F2)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/root-today.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/home.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E11-F3 Personal archive
- Action: create
- Issue type: Story
- Summary: E11-F3 Personal archive
- Parent: NEW E11 epic
- Labels: ORANGE, Backend-and-iOS, rough-points
- Issue links: is blocked by SCRIBL-20 (E01-F3)
- Description:

~~~
Every submission automatically kept in the person's own history, readable
without a wall. This is what makes the app worth keeping after a group goes
quiet, and it is also what a premium tier would eventually gate, so build it
now and leave tiering alone.

**Frontend** The family screen's archive gallery variant for personal
walls: the response grid, roster strip, locked-day draw prompt versus
unlocked reveal, and the ReflectionInput field for a text-only entry on a
past locked day.

**Backend** Serves channel roster, days, members, and prompts for the
personal wall, and accepts a text-only reflection through the same
POST /submit endpoint the drawing flow uses; that reflection path is real in
the shipped app and has no filed feature until this one names it.

**Reads/writes** Channel id from route params drives roster, day, member,
and prompt reads, reloaded on every focus so a removal or new entry is
never stale; a text-only reflection writes a submission row, and selecting
drawings for multi-select writes into the compose store for E12-F2's
compose screen.

**QE (draft)** Tier 4 integration test against a real local Postgres for
the indexed personal-history read, not mocked SQL. Happy path: opening a
personal wall renders the roster and each day's entry, drawn or reflected.
Edge: a past locked day accepts a text-only reflection through POST /submit
and it appears in the grid on the next read; a member removed elsewhere
disappears from the roster on next focus.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 2 backend-days

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E11-F3)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/family.md
~~~

### CREATE E11-F4 Milestone badges
- Action: create
- Issue type: Story
- Summary: E11-F4 Milestone badges
- Parent: NEW E11 epic
- Labels: ORANGE, iOS, Q6, rough-points
- Issue links: is blocked by NEW E11-F1
- Description:

~~~
Badges at 7, 30 and 100 days. Blocked on Q6. This is the release valve for
E11: the one ORANGE feature whose absence nobody notices in a demo, so it is
the first thing to drop if the lane needs room, ahead of E11-F2.
E11 is ORANGE and outside the eight weeks on the client side; this stays
that way regardless of how cheap the badge logic is.

**Frontend** Three milestone badges on the /home stats card, driven by
E11-F1's streak selector; locked or earned state per badge.

**Backend** Badge state is a pure threshold check (7, 30, 100 days) over
E11-F1's streak output, folded into the same stats endpoint E11-F2 reads;
no separate storage.

**Reads/writes** Server-owned, read into data/ as part of the /home stats
load; writes nothing.

**QE (draft)** Tier 3 unit test on the threshold check across the three
milestones and the boundary day of each (day 6 versus day 7, and so on).
Happy path: crossing day 7 flips the first badge to earned on the next
stats read. Undecided: Q6 gates this feature and is not resolved by this
body.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 1 iOS-day

**Undecided, deliberately**
- Q6 gates this feature and is not resolved by this body.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E11-F4)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/home.md
Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

## E12 Sharing a response, and a wall, as a document -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E12 Sharing a response, and a wall, as a document
- Action: create
- Issue type: Epic
- Summary: E12 Sharing a response, and a wall, as a document
- Parent: none (top-level epic)
- Labels: ORANGE, iOS-and-Backend
- Issue links: none
- Description:

~~~
The orange band carried a sticky reading "Sharing personal" with no epic
behind it. This is that epic, opened new at the 2026-08-25 prioritization
session. Today a drawing goes onto a wall and stays there: the only way to
get it out is a screenshot, which loses the story written underneath it and
loses the prompt that produced it.

This is sharing, not multi-channel posting. The board mapping draws the
line: putting one submission on several walls is E05-F3, a different act
from producing a file and sending it somewhere. E12 is the second act, one
response, one document, across E12-F1 to E12-F5.

The scope is one picture. Picking several and grouping them into one file is
the same idea with the count raised; it is the gray sticky, carried here as
E12-F2, and it stays gray while E12-F1 through E12-F4 sit orange.

The format is not decided. A PDF travels everywhere and needs no hosting; a
single HTML file keeps type and layout closer to the app and can hold more
than one page cheaply. Pick one in scoping, not here.

Sharing a wall as a document crosses the channel-isolation boundary (register
4.2): producing a file containing other people's submissions is a read of a
wall, so it authorizes on membership through the same choke point every
other wall read uses, and the exported document is only as private as the
link it produces. This epic does not build without E12-F5's permission
question answered first.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E12)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
~~~

### CREATE E12-F1 Share one response as a document
- Action: create
- Issue type: Story
- Summary: E12-F1 Share one response as a document
- Parent: NEW E12 epic
- Labels: ORANGE, Backend
- Issue links: is blocked by SCRIBL-44 (E04-F4); is blocked by SCRIBL-23 (E01-F6); is blocked by NEW E12-F5
- Description:

~~~
One response in, one document out: the artwork at print resolution, the
story text underneath it, the prompt it answered, and the date. Rendered
server-side from the stored submission, so the output is the same on every
phone. This is the decision register 2.6 payoff: the submission holds the
versioned stroke document plus a render, and re-rendering for export reads
those resolution-independent coordinates rather than a bitmap, so the
document is not bound to whatever screen size produced the original render.

**Frontend** The /share card view (drawing, caption or voice marker, prompt
line, date badge), a target-tile row, and the hidden ViewShot capture tree.

**Backend** A day-list lookup for the caption's prompt text. The current
POC captures the card as a client-side PNG, which is the opposite of this
feature's server-render decision; that capture path comes out as part of
this feature, not a later cleanup.

**Reads/writes** Response fields arrive as route params; no store or API
write happens in this screen. The document render itself is the async job
in E12-F3.

**QE (draft)** Contract test (tier 2) on the render job's input shape
against packages/contracts. Component test (tier 5) that the Share tile
falls back to a URL when card capture fails, so a broken capture path
degrades rather than blocking the share.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Undecided, deliberately**
- The document format (PDF versus single-file HTML) is not decided; picked
  in scoping, not here.
- This feature does not build until E12-F5's permission question is
  answered.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E12-F1)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/share.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f6-share-outside-the-app.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/decision-register.md
~~~

### CREATE E12-F2 Pick several and group them into one file
- Action: create
- Issue type: Story
- Summary: E12-F2 Pick several and group them into one file
- Parent: NEW E12 epic
- Labels: GRAY, iOS-and-Backend
- Issue links: is blocked by NEW E12-F1; is blocked by SCRIBL-51 (E05-F4)
- Description:

~~~
A selection mode on the wall grid and home screen: tap to select, a count, a
clear action, one share action composing the selected responses into one
file in wall order. This is the board's gray sticky, "picking multiple
pictures and grouping them", carried here as E12-F2 rather than as its own
epic, and it stays gray while E12-F1 through E12-F4 sit orange (per the
board mapping). Register section 10 lists "composed keepsakes from several
drawings" as parked by the client's own decision for a later phase; that is
the same deferral seen from the board side and the register side, and
E18-F4's keepsake feature needs the identical selection interaction, so it
is built once here for both.

**Frontend** /compose's Skia canvas stage (place, move, corner-scale,
rotate, tray, undo/clear/Save/Share) with its fewer-than-two guard, plus
/family's multi-select toggle and compose button feeding it.

**Backend** A compositions endpoint that derives the destination channel
from the caller's identity server-side and re-checks membership and prior
submission before accepting a save or share, per the channel-isolation
choke point in register 4.2.

**Reads/writes** Compose reads the picked source drawings on entry only;
Save writes the composition and clears the selection, Share instead routes
to /share with the saved response's fields, and a failed save leaves the
tray intact for retry. Family's multi-select writes the picked ids into the
compose store on exit and nothing else.

**QE (draft)** Integration test (tier 4) that a save with fewer than two
drawings is refused server-side, not only guarded in the UI. Component test
(tier 5) that a failed save leaves the tray populated for retry.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E12-F2)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/compose.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/family.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f5-wall-browsing-and-composition.md
~~~

### CREATE E12-F3 Document rendering service and delivery
- Action: create
- Issue type: Story
- Summary: E12-F3 Document rendering service and delivery
- Parent: NEW E12 epic
- Labels: ORANGE, AWS
- Issue links: is blocked by SCRIBL-23 (E01-F6)
- Description:

~~~
Composition runs off the request path. A submit-style asynchronous job
renders the document from the stored stroke document and render (register
2.6), writes it to S3, and hands back a time-limited signed URL, per the
pattern ADR-0010 sets for anything slow. The retention question is a
privacy decision, not a storage one: a generated document is a copy of a
child's drawing behind a URL, and under-13 users are in scope per register
7.1.

**Backend** The render job in backend/src/effects/, an S3 write, and the
signed-URL issuance. Retention period and whether the link is revocable on
demand are undecided; no source sets a value, so this is not sized until
one does.

**QE (draft)** Integration test (tier 4) against local Postgres and a local
object-storage adapter that the signed URL expires and a re-fetch after
expiry is refused. Invariant test (tier 1) that the render job re-checks
wall membership before rendering, since a queued job outlives the request
that authorized it.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.

**Size**: not sized

**Undecided, deliberately**
- Retention period for the generated document is not set; no source in this
  packet or the register picks a value.
- Whether the signed link is revocable on demand is not decided.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E12-F3)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/share.md
~~~

### CREATE E12-F4 The share destination
- Action: create
- Issue type: Story
- Summary: E12-F4 The share destination
- Parent: NEW E12 epic
- Labels: ORANGE, iOS
- Issue links: is blocked by NEW E12-F1
- Description:

~~~
The system share sheet is the whole of the app's job past producing the
file: it reaches messages, mail, social, print and the photo library without
Scribl building any of those paths. The POC's /share screen admits its
endpoint is not real; this replaces it rather than restyling it. Whether the
sheet receives a signed short-lived URL or a file handed directly to the OS
is undecided; no source in this packet or the register sets it, and it
decides how private the shared artifact actually is (register 4.2), so it
belongs in the same scoping pass as E12-F5's permission answer.

**Frontend** /response/[id]'s header share button (the AI original/enhanced
toggle carried over from a retired feature) and /share's card view and
target-tile row. The Instagram and More tiles render as enabled but are
inert in the POC; they come out rather than get built, per this feature's
own boundary that the app's job stops at the file and the sheet.

**Backend** Response detail and reaction-post endpoints for /response/[id];
the day-list lookup for /share's caption prompt text. Neither backend path
records that a share happened.

**Reads/writes** /response/[id] loads on route params (channelId, promptId,
id) and writes a reaction in place on react; sharing pushes payload to
/share as route params, not a store write.

**QE (draft)** Component test (tier 5) that the locked-message state on
/response/[id] has no retry or bypass for a viewer who has not submitted
today. Invariant test (tier 1) that a response fetch by id authorizes on
membership before rendering, since a share button on an unauthorized
response is the same access-control shape the register 4.2 rule exists to
close.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer (decision register 2.1, 2.2), not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature
(engineering-standards.md section 4). All authorization runs through
backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Undecided, deliberately**
- Whether the share sheet receives a signed short-lived URL or a file
  handed directly to the OS is not decided; belongs in the same scoping
  pass as E12-F5.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E12-F4)
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/response-id.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/share.md
https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f6-share-outside-the-app.md
~~~

### CREATE E12-F5 What may leave a private wall, and who decides
- Action: create
- Issue type: Story
- Summary: E12-F5 What may leave a private wall, and who decides
- Parent: NEW E12 epic
- Labels: ORANGE, Product, rough-points
- Issue links: none
- Description:

~~~
Whose work a member may export, and whether the author or the wall creator
can refuse. A family wall holds other people's children's drawings, so
"select and share" is a request to copy content the sharer did not create.
This is a client decision, not an engineering one, and it has to land before
E12-F1 through E12-F4 ship: retrofitting a permission rule onto a shipped
export path means revisiting every read in it, the same class of problem as
channel isolation in E05-F2. Under-13 scope (register 7.1, E00-F8) makes
this a compliance question as much as a product one: exporting a minor's
artwork outside the wall's invitation boundary needs a documented consent
basis, not just a UX flow.

**Backend** Whatever this decides gets enforced in the same authorization
module as wall membership (register 4.2), not as a client-side check. No
implementation until the decision exists.

**QE (draft)** Not applicable until the decision lands; the eventual
enforcement gets an invariant test (tier 1) per the register 4.2 pattern.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.

**Size**: 1 day, a written decision

**Undecided, deliberately**
- This entire feature is the open decision: whether a member may export
  another person's or a minor's work, and who can refuse. It waits on the
  client and on the under-13 scope closing in E00-F8. This is a policy
  decision, not a build task, and stays that way here.

**Links**
Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E12-F5)
~~~

# E13 to E18

## E13 Comments, with the wall creator as moderator -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E13 Comments, with the wall creator as moderator
- Action: create
- Issue type: Epic
- Summary: E13 Comments, with the wall creator as moderator
- Parent: none (top-level epic)
- Labels: ORANGE, iOS-and-Backend
- Issue links: none
- Description:

~~~
The kickoff settled that reactions ship and open commenting waits, and that if
commenting is built it is a switch the wall's creator holds rather than a
feature that is always on. This epic is that design, written down.

The part that makes it Scribl's rather than generic is who moderates. The
person who made the wall moderates the wall. A parent who creates a family
wall gets the hide, the delete and the remove-member action on their own wall,
and does not wait on support to use them. That is a smaller and more
defensible surface than central moderation, and it is the reason commenting
can be considered at all on a product holding children's work.

The AI filter in E13-F5 sits in front of publication, not behind it: text is
checked before anyone sees it. Its fail policy is the same open question E10
and E00-F13 already carry, so it gets answered once for both.

The board had this sticky in the gray band, outside the eight weeks. The
2026-08-25 prioritization session moved it up, so the epic is written to be
plannable rather than parked. Its band is a decision, not an inheritance.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E13)
~~~

### CREATE E13-F1 Comment model and the per-wall switch
- Action: create
- Issue type: Story
- Summary: E13-F1 Comment model and the per-wall switch
- Parent: NEW E13 epic
- Labels: ORANGE, Backend
- Issue links: is blocked by NEW E13 epic (parent); is blocked by SCRIBL-20 (E01-F3); is blocked by SCRIBL-48 (E05-F1)
- Description:

~~~
Comments against a response, and a per-wall setting, default off, that only
the wall's creator can change. Off means the endpoints refuse rather than the
client hiding a button, on the same submit-to-unlock pattern the decision
register enforces at the data layer. The switch is an authorization role, not
a UI toggle: ownership sits in the same single authorization module as
membership, and a client-enforced toggle would not count as enforced at all.

**Backend**  A `comments` table plus a per-wall setting column, checked in
`backend/src/authz/` before any comment write or read, not in `routes/`.
Every comment-touching route calls that one module.

**QE (draft)**  Invariant test (tier 1), written before the feature: a
comment write against a wall with the setting off is refused server-side
regardless of client state. Structural test that `backend/src/authz/` does
not import the flag client, extended to cover this switch.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E13-F1)
~~~

### CREATE E13-F2 Write and read a comment
- Action: create
- Issue type: Story
- Summary: E13-F2 Write and read a comment
- Parent: NEW E13 epic
- Labels: ORANGE, iOS
- Issue links: is blocked by NEW E13-F1; is blocked by SCRIBL-51 (E05-F4)
- Description:

~~~
A short comment on a response detail, flat rather than threaded, visible only
after the reader has submitted their own drawing, on the same unlock rule the
walls already run. A length cap in the spirit of the 280-character story cap
on the canvas story input. Flat, not threaded, because a thread is a
moderation surface, and this epic's whole shape is keeping that surface small
enough for one parent to manage.

**Frontend**  A comment list and input on the response detail screen, gated
on the same locked-state message that screen already shows a viewer who has
not submitted today.

**Backend**  Comment create and list endpoints, validating length
server-side and re-checking submit-to-unlock before either read or write,
since a comment read is a read of the wall.

**Reads/writes**  Comment list loads with the response detail; a posted
comment appends to that loaded list rather than triggering a reload.

**QE (draft)**  Contract test (tier 2) on the comment create/list shapes
against `packages/contracts`. Unit test (tier 3) on the length-cap check in
`lib/`. Invariant test (tier 1) that a comment read before the reader's own
submission exists is refused.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E13-F2)
- Screen page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/response-id.md
- Flow page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f5-wall-browsing-and-composition.md
~~~

### CREATE E13-F3 Creator moderation actions
- Action: create
- Issue type: Story
- Summary: E13-F3 Creator moderation actions
- Parent: NEW E13 epic
- Labels: ORANGE, Backend-and-iOS
- Issue links: is blocked by NEW E13-F1
- Description:

~~~
Hide a comment, delete a comment, mute a member on this wall, remove a member
from this wall, authorized against wall creator rather than a global role.
Ownership and block relationships sit in the same single authorization module
as membership, so this is invariant work reaching into `backend/src/authz/`,
not a client-side toggle. Every action is recorded, because a moderation
action nobody can see the history of is one the creator cannot explain to the
person on the other end of it.

**Backend**  Moderation-action endpoints (`hide`, `delete`, `mute`, `remove`)
that check wall-creator ownership through `backend/src/authz/`, plus an
append-only action log table, `moderation_actions`, written on every action.

**QE (draft)**  Invariant test (tier 1), written first: only the wall's
creator can hide, delete, mute or remove on that wall, and the check cannot
be bypassed by any role claim in the request body. Integration test (tier 4)
against local Postgres that every action produces exactly one log row.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E13-F3)
~~~

### CREATE E13-F4 Report, and the path off the wall
- Action: create
- Issue type: Story
- Summary: E13-F4 Report, and the path off the wall
- Parent: NEW E13 epic
- Labels: ORANGE, Backend
- Issue links: is blocked by NEW E13-F1; is blocked by NEW E10-F1 (created in the E10 section)
- Description:

~~~
A member reports a comment to the wall creator, and anything the creator
cannot or will not resolve escalates into the existing moderation lane. App
Store review expects a report path for user-generated content and does not
accept the wall creator as the sole recourse. This is a named cross-epic
dependency: this feature adds a second reportable content type into the
existing moderation queue rather than building a second queue.

**Backend**  A report-create endpoint writing into the existing queue schema
with a `comment` content type alongside whatever it already reports on, plus
a creator-notification path when a report lands on their wall.

**QE (draft)**  Contract test (tier 2) that a comment report enters the
queue in the same shape as its existing content types. Component test (tier
5) that the report action is reachable from the comment even when the wall
creator has taken no action.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E13-F4)
~~~

### CREATE E13-F5 Pre-publish safety check on comment text
- Action: create
- Issue type: Story
- Summary: E13-F5 Pre-publish safety check on comment text
- Parent: NEW E13 epic
- Labels: ORANGE, Backend
- Issue links: is blocked by NEW E13-F1; is blocked by NEW E10-F1 (created in the E10 section)
- Description:

~~~
A comment is checked before it is published, not after it is seen: is it
harmful, is it cruel, does it fail the standard Scribl sets. Held rather than
shown when the check cannot reach a verdict, which is what "fail-safe" means
on the board sticky. The standard's language is the program team's to write,
not engineering's to infer.

This is undecided and stays undecided here. Automated content moderation is
out of the current band, with the human path (report, block, take down)
built instead. The moderation fail policy is named as outstanding: a
recommendation sits on the open-questions list and no decision is made. The
board sticky's own words, "possible ai moderation", are a question, not a
requirement, and this fragment does not resolve it.

**Backend**  Undecided pending the fail policy. What is fixed regardless of
the answer: this touches moderation, so it fails closed and cannot be a
release flag: it is a permanent kill switch, evaluated server-side, with an
unreachable-provider default of "held". Every comment run through the check
is a model call, so spend scales with usage.

**Undecided, deliberately**
- The moderation fail policy (shared with E10 and E00-F13): what happens when
  the safety check cannot reach a verdict is a recommendation on the
  open-questions list, not a decision.

**QE (draft)**  Not written until the fail policy lands. Once it does, the
first test is an invariant test (tier 1): a check that cannot reach a
verdict holds the comment rather than publishing it, and that behaviour is
not reachable from configuration.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E13-F5)
~~~

## E14 App Store readiness and compliance -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E14 App Store readiness and compliance
- Action: create
- Issue type: Epic
- Summary: E14 App Store readiness and compliance
- Parent: none (top-level epic)
- Labels: GRAY, future, Platform-QA-and-Product, Q56
- Issue links: none
- Description:

~~~
Later home: the release phase, after sprint 3, gated on the Apple Developer
account question closing.

Public submission, not distribution. Getting a signed build to Scribl's own
testers happens inside the eight weeks; getting through App Store review and
onto the public store is this epic and happens in the release phase after
sprint 3. No one has committed to a store release at the end of this phase.
Three of its four features are schema and policy work, and retrofitting them
costs multiples of building them in place, which is why account deletion and
AI consent already moved out of this epic into the green and orange bands:
account deletion in-app is an Apple requirement for any app that creates
accounts, and submit-to-unlock hides the product from a reviewer who has
drawn nothing, which is why a reviewer account is pre-seeded rather than
left to submission week.

Authority for this epic is the release-readiness handbook page in full: the
store prerequisites, the build artifacts already landed or blocked, the
TestFlight cap and demo-account trap, the guideline-by-guideline table, and
the seam-adapter and permission-declaration rules in engineering-standards.md
and service-seams.md that govern what this epic is allowed to add to the
binary.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E14)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/engineering-standards.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
~~~

### CREATE E14-F1 Store listing and review package
- Action: create
- Issue type: Story
- Summary: E14-F1 Store listing and review package
- Parent: NEW E14 epic
- Labels: GRAY, Delivery, Q56
- Issue links: is blocked by SCRIBL-63 (E07-F1); is blocked by NEW E16-F1
- Description:

~~~
Screenshots, description, age rating questionnaire, review notes, and the
seeded reviewer demo account. The age rating answer runs straight into the
under-13 epic, since one decision puts under-13 users in scope while a
related ADR leaves the store-category question open, so this feature cannot
close before that question does.

**Implementation**  Metadata and screenshots are a delivery task, not code.
The demo account is code: `npm run db:seed:reviewer`, which seeds a
submission and visible wall content so a reviewer does not land on an empty
wall behind submit-to-unlock. Assign the guideline 1.2 named-owner and SLA
fields before submission.

**Backend**  The seed script writes through the same repositories the app
uses, no direct SQL from the script, so seeded data matches production
shape.

**Flagged risk (register contradiction, not resolved here)**
- This feature's age-rating answer depends on E16 (under-13/COPPA) closing
  its two open sub-decisions; the epic body carries the same flag.

**QE (draft)**  Verify the seed script from a clean database produces a
reviewer account whose first screen shows content, not an empty wall. Verify
the age rating answer and the store listing text agree with whatever the
under-13 epic settles. Tier: integration test against a local Postgres for
the seed path, plus a manual walkthrough before each submission.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q56: this epic belongs to the release phase after sprint 3, and Q56, the gate on that phase, is not yet decided.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E14-F1)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/toolchain.md
~~~

### CREATE E14-F2 Privacy manifest and data-use disclosures
- Action: create
- Issue type: Story
- Summary: E14-F2 Privacy manifest and data-use disclosures
- Parent: NEW E14 epic
- Labels: GRAY, iOS-and-Product, Q56
- Issue links: is blocked by NEW E10-F5 (created in the E10 section)
- Description:

~~~
The privacy manifest, tracking disclosures, and the third-party AI
disclosure that follows from sending content to a model, describing consent
already captured elsewhere. The manifest itself is already built in
`app.config.ts` under `ios.privacyManifests`; this feature is the accuracy
check against what ships, not the first draft.

**Implementation**  Re-verify the required-reason codes against Apple's
current list before submission, since the repo's declared codes cannot be
trusted as current without a re-check. Any new third-party SDK added to the
binary between now and submission needs its own signed privacy manifest and
a new subprocessor entry before this feature can close. The App Privacy
label in App Store Connect must match the manifest and match what the crash
reporter actually collects, or the mismatch surfaces at review.

**Backend**  None. This is a client-binary and console-metadata surface.

**QE (draft)**  Diff the declared manifest against the dependency list at
submission time, not at feature-complete time, since a dependency added
after this feature closes can silently invalidate it. Tier: manual
verification checklist, no automated test reaches App Store Connect
metadata.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q56: this epic belongs to the release phase after sprint 3, and Q56, the gate on that phase, is not yet decided.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E14-F2)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
~~~

### CREATE E14-F3 User-generated content review evidence
- Action: create
- Issue type: Story
- Summary: E14-F3 User-generated content review evidence
- Parent: NEW E14 epic
- Labels: GRAY, QA-and-Product, Q31, Q56
- Issue links: is blocked by NEW E10-F3 (created in the E10 section); is blocked by NEW E10-F4 (created in the E10 section)
- Description:

~~~
Demonstrable report, block and takedown paths, a named moderation owner, and
a committed action turnaround, documented for the reviewer against Apple
guideline 1.2. The underlying schema (reports table, block relationship
enforced in the authz choke point, owner and SLA fields) is built with the
schema rather than later; this feature packages evidence that path works,
and the queue owner assignment itself is still open.

**Implementation**  Automated content filtering is out of this band; the
reviewer evidence is the human path only, so the walkthrough must show a
report, a block, and a moderator action reaching a committed turnaround, not
a claim of automation.

**Backend**  Evidence is read off the existing reports and moderation-queue
repositories; no new backend surface, this feature is verification and
documentation of what the moderation epic already stores.

**Undecided, deliberately**
- Q31: how deep moderation and content-safety tooling goes beyond a written
  point of view for phase one is explicitly deferred to a future roadmap
  item.

**QE (draft)**  End to end: submit a report, confirm it lands in the queue
with owner and SLA fields populated, confirm a block enforced through the
authz choke point actually removes visibility. Tier: this exercises the
channel-isolation invariant indirectly, so treat the block-enforcement check
as a launch-gate-adjacent test, written against `backend/src/authz/`, not a
plain integration test.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q56: this epic belongs to the release phase after sprint 3, and Q56, the gate on that phase, is not yet decided.
- Q22: the review-queue owner named by E10-F4 is not assigned; the evidence this feature packages depends on that queue existing.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E14-F3)
- Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E14-F4 Phased rollout and update strategy
- Action: create
- Issue type: Story
- Summary: E14-F4 Phased rollout and update strategy
- Parent: NEW E14 epic
- Labels: GRAY, Platform, Q56
- Issue links: is blocked by SCRIBL-65 (E07-F3)
- Description:

~~~
Phased release percentages, a rollback position, and how a fix reaches
people without a full review cycle. Decide this before the first public
release, not during the first incident.

**Implementation**  Remotely loaded or interpreted code, and an
over-the-air update path, are ruled out elsewhere in this project's stack
notes; a "fix without a review cycle" here means a fast expedited review
plus a phased-percentage rollback of the store listing, not an over-the-air
code push, since Apple guideline 2.5.2 prohibits the latter. Name that
constraint in the rollout plan itself so nobody proposes an update mechanism
this stack has already ruled out.

**Backend**  None directly; the rollback lever is the store console's
phased-release percentage control, not a backend flag.

**QE (draft)**  No automated test reaches a store console. Tier: manual
runbook, exercised once as a dry run before the first real submission.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q56: this epic belongs to the release phase after sprint 3, and Q56, the gate on that phase, is not yet decided.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E14-F4)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
~~~

## E15 re:Invent event wall -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E15 re:Invent event wall
- Action: create
- Issue type: Epic
- Summary: E15 re:Invent event wall
- Parent: none (top-level epic)
- Labels: GRAY, future, Backend-and-AWS, Q21
- Issue links: none
- Description:

~~~
Later home: its own scope and funding call, tracked as an open question.

A live wall at re:Invent, with everyone in a room drawing at once. re:Invent
is a real commitment with an unreal number attached: the working capacity
figure is roughly 100,000 concurrent users, three orders of magnitude beyond
anything else on this page and the opposite architecture from the private
invitation-only walls the rest of the product is built around. This gap is
named elsewhere as the largest unaddressed architectural gap in the corpus,
and a past comparable product degraded around 50-60 participants per wall,
nowhere close to 100k. Its later home is its own scope and funding call, not
a sprint inside this phase.

The real source behind this epic is thin: one paragraph naming the demo bar
and four undesigned candidate directions, one line noting timed challenges
could return as a wall type, and the calendar fact that the eight weeks end
before a re:Invent freeze. Nothing decides a wall definition, a capacity
target, a budget, or an architecture. This should not arrive as a two-week
request in October: the scope and funding call has to happen before any
engineering does.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E15)
~~~

### CREATE E15-F1 Scope and capacity call
- Action: create
- Issue type: Story
- Summary: E15-F1 Scope and capacity call
- Parent: NEW E15 epic
- Labels: GRAY, Product-and-AWS, Q21
- Issue links: none
- Description:

~~~
What the event wall actually is, how many people are on it at once, and who
pays for the burst, before any architecture spike starts. re:Invent is named
as the aspirational proof point at up to roughly 100,000 concurrent
submitters to a single wall, and this is plainly the largest unaddressed
architectural gap in the corpus, noting a past comparable product degraded
around 50-60 participants per wall.

**Undecided, deliberately**
- What the event wall is, how many concurrent participants it must hold, and
  who funds the burst: no source names a wall definition, a capacity target,
  a budget owner, or a funding mechanism. Four candidate directions
  (fan-out/broadcast, cached wall reads, write buffering, pre-aggregated
  tiles) are listed as design work to schedule, not decisions.

**Backend**  None assignable yet; this feature is the scope call, not a
build.

**QE (draft)**  Not applicable until scope exists.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q21: the event wall is its own scope and funding call, tracked as Q21; nothing here starts until it is made.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E15-F1)
~~~

### CREATE E15-F2 Realtime broadcast architecture
- Action: create
- Issue type: Story
- Summary: E15-F2 Realtime broadcast architecture
- Parent: NEW E15 epic
- Labels: GRAY, AWS, Q21
- Issue links: is blocked by NEW E15-F1
- Description:

~~~
A design for pushing a wall's updates to a room in real time. Nothing in the
current serverless request and response design does this, and no ADR covers
it, so this is a genuine architecture spike, not a configuration change, and
it cannot start before the scope call gives it a number to design against.

**Undecided, deliberately**
- Which mechanism fills the seam (WebSocket API, AppSync subscriptions, or
  one of the other candidate directions): the seam is kept documented even
  though event mode is out of the MVP, but nothing is chosen. Candidate
  directions: fan-out/broadcast, CloudFront-cached wall snapshots,
  SQS/Kinesis write buffering ahead of the store, or pre-aggregated wall
  tiles.

**Backend**  Undecided pending the scope call.

**QE (draft)**  Not applicable until an architecture exists. Once one does,
this crosses the app/backend boundary and carries the contract-test
obligation against `packages/contracts`, plus a load test against the
capacity number the scope call sets, since the prior comparable product's
50-60-per-wall degradation point is exactly the failure mode a load test
needs to catch before re:Invent, not after.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q21: the event wall is its own scope and funding call, tracked as Q21; nothing here starts until it is made.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E15-F2)
~~~

### CREATE E15-F3 Event wall client surface
- Action: create
- Issue type: Story
- Summary: E15-F3 Event wall client surface
- Parent: NEW E15 epic
- Labels: GRAY, iOS, Q21
- Issue links: is blocked by NEW E15-F2
- Description:

~~~
The screen itself, plus a way in that does not require an invitation, which
means it deliberately breaks the invitation-only rule the rest of the
product is built around for one wall type. That exception is the design
question, and the same mechanism named as "timed challenges returning as a
wall type" is the nearest existing precedent for a wall that behaves
differently from a private channel.

**Undecided, deliberately**
- No source specifies the entry screen, the join mechanism, or how it
  differs from the standard invite flow beyond "does not require an
  invitation." The parked-capability epic is named as preserving the
  challenge-mode mechanism this exception would reuse; the actual reuse is
  not designed.

**Backend**  Depends entirely on the broadcast architecture; no independent
backend surface for this feature.

**QE (draft)**  Not applicable until the broadcast architecture closes.
When it does, this is an iOS-surface feature and needs component tests on
the join-without-invite behaviour plus an end-to-end walkthrough of the
daily loop analog for this wall type.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q21: the event wall is its own scope and funding call, tracked as Q21; nothing here starts until it is made.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E15-F3)
~~~

## E16 Under-13 and the COPPA Family edition -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E16 Under-13 and the COPPA Family edition
- Action: create
- Issue type: Epic
- Summary: E16 Under-13 and the COPPA Family edition
- Parent: none (top-level epic)
- Labels: GRAY, future, Product-and-Backend, Q32
- Issue links: none
- Description:

~~~
Later home: post-launch planning, tracked as an open question.

Children are the obvious audience for a family drawing app and they are also
the one audience that changes the legal shape of the product. COPPA
compliance is not a feature added on top, it changes consent, data
retention, moderation posture and the age rating on the store listing.

**Flagged risk (register contradiction, not resolved here)**
This epic sits in the GRAY band with a post-launch later home. But one of the
five decisions the decision register itself names as carrying more weight
than the rest states flatly that under-13 users are in scope, so COPPA
compliance is a requirement of this build rather than later preparation. The
board's placement and the register's decision disagree about when this work
is required, not about whether it is required. ADR-0012 resolves the
disagreement in practice, not in principle: production stays on "OPTION A,"
no minor enrollment in `prod`, until the ADR's two open sub-decisions
(store-category targeting, verifiable-consent method) close, so the gate
mechanism is built and tested now while the audience it protects is not yet
live in production. Read the register's under-13 decision with ADR-0012's
caveat attached, or it overstates what is actually shipped.

ADR-0012 records what is already built (the age gate, the fail-closed
consent-and-diagnostics wiring, the parental-consent UI) versus what its two
open sub-decisions leave undecided; the decision register names both
sub-decisions as the largest open items in the whole register. This epic's
three features do not re-answer them; they build the legal position and the
two mechanisms (verification method, retention and moderation defaults) that
let production flip `allowsMinorEnrollment` from `false` to `true` once the
two ADR-0012 sub-decisions close.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E16)
~~~

### CREATE E16-F1 Legal position and age gate
- Action: create
- Issue type: Story
- Summary: E16-F1 Legal position and age gate
- Parent: NEW E16 epic
- Labels: GRAY, Product, Q32
- Issue links: none
- Description:

~~~
A written position on who this app is for, what age gate the store listing
claims, and what COPPA obliges given under-13 users. The decision register
already settles the product question: children are a supported audience and
COPPA compliance is a build requirement, not later preparation, and it is
one of the five decisions the register's own "if you read only one section"
names as carrying more weight than the rest. ADR-0012 catches the record up
to code already shipped: `account-class.ts`'s `COPPA_AGE_THRESHOLD = 13`
classes an account `adult`, `minor` or `unknown` from date of birth, and
`unknown` is treated as `minor` everywhere downstream, a fail-closed default
on bad input.

**Implementation**  The age-gate mechanism itself is not this feature's
work, it is already built and ADR-0012 confirms its shape as correct. This
feature is the legal position and the store age-rating answer that sits on
top of it. `packages/contracts/entities` holds `AccountClass`, so any
product-level "who is this app for" answer has to agree with that type
rather than restate it informally.

**Backend**  `canProceedToAccountCreation` returns true only for `adult`; a
`minor` classification branches into a parental-consent flow before any
account is created, covered by an existing e2e test. This feature does not
touch that code; it produces the legal position that names which of
ADR-0012's two open sub-decisions (store-category targeting, verifiable
consent method) the business wants to close, and how.

**Flagged risk (register contradiction, not resolved here)**
- E16 GRAY vs decision register: under-13 in scope now, per the epic body.

**QE (draft)**  No new test surface; the branching behaviour already has an
e2e test per ADR-0012. This feature's own verification is a legal sign-off
document, not a test.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q32: under-13 and the Family edition sit in post-launch planning, tracked as Q32, not yet scheduled.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E16-F1)
~~~

### CREATE E16-F2 Verifiable parental consent
- Action: create
- Issue type: Story
- Summary: E16-F2 Verifiable parental consent
- Parent: NEW E16 epic
- Labels: GRAY, Backend-and-iOS, Q32
- Issue links: is blocked by NEW E16-F1
- Description:

~~~
A consent flow that meets the verifiable standard rather than a checkbox,
plus the parent-side controls that follow from it. Cheap to describe,
expensive to build correctly, and ADR-0012 names this as one of its two open
sub-decisions: which COPPA-approved method (payment instrument, signed form,
video verification, knowledge-based authentication) is actually implemented.
Consent is versioned rows, never a flag on a record, with who consented,
when, and whether it was revoked.

**Implementation**  Undecided which verification method ships; ADR-0012
says so directly. `consent.ts` already declares a `method` field with all
four COPPA methods in its type plus a `stub` value, deliberately visible in
data so a placeholder consent can never be mistaken for a verified one
downstream. Only `self` and `stub` are meaningful today. This feature picks
and implements one of the four real methods; it is not building the
consent-row mechanism, which already exists.

**Backend**  `ParentalConsentScreen`, `ParentControlsScreen`, and
`RequiredConsentGate` already exist and are wired at
`app/(auth)/parental-consent.tsx`. `allowsMinorEnrollment(appEnv)` is the
single switch gating minor enrollment, `false` for `prod`. ADR-0012's own
risk register says this switch must not flip to allow minor enrollment in
`prod` before a real verification method exists, or the system starts
recording `stub` consent for real under-13 accounts, the exact
checkbox-consent failure the type was built to prevent. This feature is what
earns the right to flip it.

**Undecided, deliberately**
- Which of the four COPPA-approved verification methods ships is an open
  sub-decision in ADR-0012.

**Flagged risk (register contradiction, not resolved here)**
- E16 GRAY vs decision register: under-13 in scope now, per the epic body.

**QE (draft)**  Invariant test, launch gate: a minor's diagnostics and
crash-reporting collection stay off without a `parental` consent row plus
the diagnostics consent row, per the diagnostics-consent fail-closed order
(unknown collects nothing, minor needs both rows, a flag can only subtract
collection). Write this before the verification method itself. Contract
test on the `method` field against `packages/contracts` once a real method
is chosen, asserted on both app and backend sides.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q32: under-13 and the Family edition sit in post-launch planning, tracked as Q32, not yet scheduled.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E16-F2)
~~~

### CREATE E16-F3 Family edition data handling
- Action: create
- Issue type: Story
- Summary: E16-F3 Family edition data handling
- Parent: NEW E16 epic
- Labels: GRAY, Backend, Q32
- Issue links: is blocked by NEW E16-F1
- Description:

~~~
Retention limits, no third-party model calls on children's content without
consent, and a stricter default moderation posture. This is where the
fail-safe policy stops being a product tradeoff and becomes a legal
requirement.

**Implementation**  `account_class` is a targeting dimension now that
under-13 is in scope, and shipping targeting logic about children to a
device is a bad idea, which is part of why flags evaluate server-side and
the client receives resolved answers rather than targeting rules. Anything
touching minors, consent, moderation or payment fails closed by the same
rule; this feature's retention and moderation defaults are exactly the
flags that rule governs.

**Backend**  Deletion, export and the moderation substrate are built with
the schema, not deferred to this feature; this feature sets the
minor-specific retention limits and the stricter moderation default on top
of that existing substrate, and confirms deletion actually deletes,
including S3 objects, for a minor's account.

**Flagged risk (register contradiction, not resolved here)**
- E16 GRAY vs decision register: under-13 in scope now, per the epic body.

**QE (draft)**  Invariant test, launch gate: a minor's diagnostics stay off
without consent (shared with the verifiable-consent feature). Integration
test against a real local Postgres, not mocked SQL, confirming a minor
account's deletion cascades to S3-stored images within the retention window
this feature sets.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.

**Size**: not sized

**Undecided, deliberately (epic gate)**
- Q32: under-13 and the Family edition sit in post-launch planning, tracked as Q32, not yet scheduled.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E16-F3)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
~~~

## E17 Monetization -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E17 Monetization
- Action: create
- Issue type: Epic
- Summary: E17 Monetization
- Parent: none (top-level epic)
- Labels: GRAY, Product-iOS-and-Backend
- Issue links: none
- Description:

~~~
Later home: after this phase. Hooks now, selling later.

Gray on the board, and it had no epic until the 2026-08-25 prioritization
session. The kickoff was clear on the shape of it: not freemium forever, and
the paywall hooks belong in the infrastructure for the store release even if
nothing switches on at launch. Nothing in the backlog built those hooks
before this epic, so the release-day decision had no code behind it.

**What survives, and what does not.** The direction was upgraded expression,
resting on a fuller tool set already built and parked. That tool set was
retired 2026-09-01: the client chose the final eight colors, so there is no
richer set behind a flag for a paid tier to unlock. What survives is the
mechanism, not the merchandise: allowed brushes and colors are per-wall data
rather than compiled in, so a paid tier can read that seam instead of
running a second one beside it.

**What this epic is not.** Premium tier is one of four architect-owned
decisions with no register entry at all, undecided rather than decided,
carrying a recommendation on the open-questions list rather than a build-to
answer. No source names a price, a tier, a store product id, or a
subscription model, and this pass does not invent one. This epic's four
features are the hooks, and where a source does not decide the content of
the paid tier, that content stays undecided rather than guessed at.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E17)
~~~

### CREATE E17-F1 Define the paid tier
- Action: create
- Issue type: Story
- Summary: E17-F1 Define the paid tier
- Parent: NEW E17 epic
- Labels: GRAY, Product
- Issue links: none
- Description:

~~~
What is free forever and what is paid, written down as a list rather than a
direction. The candidate list is inks, brushes, canvas sizes and wall count.
The constraint to hold while deciding: the daily prompt, drawing, submitting
and seeing the wall stay free, since charging for the loop breaks the habit
the product is built on.

**Implementation**  Undecided, and it stays undecided by design. Premium
tier is one of four architect-owned decisions with no register entry at
all, undecided rather than decided, carrying only a recommendation on the
open-questions list. No source names a price, a tier, or a subscription
model; the sources checked are silent on monetization entirely. The earlier
assumption behind this feature, that a paid tier would unlock a fuller tool
set already built and parked, no longer holds: that tool set was retired
2026-09-01, the client's eight colors are final, so there is nothing richer
sitting behind a flag to sell. This feature has to invent the paid list
from a blank state, not surface an existing one.

**Backend**  None; this is a product decision with a client answer as its
blocker, not an engineering task.

**Undecided, deliberately**
- What is in the paid tier: no source names a price, a tier, a store
  product id, or a subscription model. This is a client decision.

**QE (draft)**  Not applicable. Nothing to test until the list exists.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E17-F1)
~~~

### CREATE E17-F2 Store purchase and entitlement plumbing
- Action: create
- Issue type: Story
- Summary: E17-F2 Store purchase and entitlement plumbing
- Parent: NEW E17 epic
- Labels: GRAY, iOS-and-Backend, Q5
- Issue links: is blocked by NEW E17-F1; is blocked by SCRIBL-28 (E02-F1)
- Description:

~~~
In-app purchase on the Apple side, receipt validation on the server, and an
entitlement on the account that survives reinstall and follows the user to
a second device. The entitlement is the server's, not the app's, or it is
trivially defeated. This is the "hooks in the infrastructure now, selling
later" half of the board's own phrasing for this epic, and it needs the
Apple Developer account that has been an open question since 2026-08-19.

**Implementation**  A payment SDK entering the binary means a new privacy
manifest and a new subprocessor entry, same rule the privacy-manifest
feature applies to AI disclosures. Anything touching payment fails closed,
which governs every flag this feature declares: an unreachable entitlement
provider must resolve to no entitlement, never to a default grant.

**Backend**  Receipt validation and the entitlement record live behind
`routes/` -> `authz/` -> `services/` -> `repositories/` per
architecture.md's dependency rule, same as any other authorization-bearing
resource; the entitlement check itself belongs in the single authz choke
point, not duplicated per feature. No store product id, price, or
subscription model is specified anywhere in the sources checked; this
feature builds the plumbing only, with no product decided to plumb yet
beyond what the paid-tier feature eventually names.

**Undecided, deliberately**
- Q5: the Apple Developer account this feature needs.

**QE (draft)**  Invariant-adjacent test: an unreachable entitlement
provider must fail closed to no entitlement, written before the receipt
validation logic itself. Contract test on the entitlement shape against
`packages/contracts`, asserted on both app and backend, once the paid-tier
feature names what the entitlement actually grants.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E17-F2)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/service-seams.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/release-readiness.md
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
~~~

### CREATE E17-F3 Entitlement checks on the existing tool seam
- Action: create
- Issue type: Story
- Summary: E17-F3 Entitlement checks on the existing tool seam
- Parent: NEW E17 epic
- Labels: GRAY, iOS-and-Backend
- Issue links: is blocked by NEW E17-F2; is blocked by NEW E17-F1
- Description:

~~~
The allowed brushes and colors are already data per wall rather than
hardcoded, so a paid tier reads that seam instead of running a second
gating mechanism beside it. Entitlement widens the allowed set; the free set
is what the drawing canvas ships. This feature now depends on the paid-tier
definition rather than on a built-and-parked tool set, because the richer
set that was supposed to sit behind the flag was retired 2026-09-01. There is
nothing to widen the allowed set to until the paid-tier feature says what
the paid tier contains.

**Implementation**  Undecided until the paid-tier feature closes. Plumbing
an entitlement check that gates access to the same eight colors everyone
already has is work with no product behind it, and the epic body says so
directly; this fragment does not invent a richer set to fill that gap.

**Backend**  The read path is `allowedBrushStyles` and `allowedColors` as
per-wall data; entitlement widens which values a given account's request
resolves to, through the one authz choke point, not a second check living
in the client.

**Undecided, deliberately**
- What the paid tier contains, and therefore what the entitlement-widened
  set is: not specifiable until the paid-tier feature names the content.

**QE (draft)**  Not fully specifiable until the paid-tier feature names the
content. Once it does, a contract test against `packages/contracts` asserts
the entitlement-widened set and the free set never disagree between app and
backend, and a unit test on the selector that resolves allowed tools from
entitlement plus wall data lives in `lib/` or `selectors/`.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
All authorization runs through backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E17-F3)
~~~

### CREATE E17-F4 Paywall surfaces and the experiment harness
- Action: create
- Issue type: Story
- Summary: E17-F4 Paywall surfaces and the experiment harness
- Parent: NEW E17 epic
- Labels: GRAY, iOS
- Issue links: is blocked by NEW E17-F2; is blocked by SCRIBL-70 (E08-F2)
- Description:

~~~
Where the offer appears, and the ability to change it without shipping an
app update. The kickoff asked for before-and-after and multi-variant paywall
testing, so the surface is remotely configured and every step is
instrumented against the event taxonomy. A paywall with no funnel behind it
cannot be tuned, only guessed at, which is why this feature depends on
client instrumentation.

**Implementation**  This is an experiment-kind flag, and "experiment and A/B
infrastructure" is explicitly not implemented in this phase, only left room
for in the flag interface. This feature is the first thing to actually
implement that kind, not reuse an existing one. No variant, offer copy, or
price point exists anywhere in the sources checked; this feature builds the
harness, not the paywall's content, since the paid-tier feature has not
named what is being sold.

**Backend**  Flags evaluate server-side; the client receives a resolved
variant, never targeting rules, same reasoning given for `account_class` in
the under-13 epic. Anything touching payment fails closed, so an
unreachable flag provider must resolve to the no-paywall variant, not a
default-on offer.

**Undecided, deliberately**
- The paywall's content: no variant, offer copy, or price point exists
  anywhere in the sources checked.

**QE (draft)**  Contract test on the variant-resolution shape against
`packages/contracts`. Component tests on paywall-surface behaviour, not a
snapshot of its markup. The funnel-instrumentation event names must exist in
the event taxonomy before this feature can claim its own acceptance
criteria met, since an uninstrumented paywall step is invisible by the epic
body's own argument.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E17-F4)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
~~~

## E18 Parked capability -- NEW

Approve: [ ] file this section  [ ] hold

### CREATE E18 Parked capability
- Action: create
- Issue type: Epic
- Summary: E18 Parked capability
- Parent: none (top-level epic)
- Labels: GRAY, parked, iOS-and-Product
- Issue links: none
- Description:

~~~
Later home: named per feature below.

The new designs made the app simpler. This epic holds what the POC built
and the product then set aside, so the simplification is recorded as what
it actually is, a reduction in surface rather than a deletion of code.

Two things are parked here now, voice notes and Artifacts. Three others were
retired on 2026-09-01, and the reasons are below. One mechanism from the
retired work is worth keeping, the per-wall restriction seam,
`allowedBrushStyles` and `allowedColors` as data. That seam is how the
drawing canvas's palette is expressed today, and it is what a future wall
type would use to ask for different tools. It earns its place on its own
rather than as the door to a parked tool set.

**Where each re-enters.** Voice notes re-enter the moment the client
reconciles their own frames with their own board decision. Artifacts re-enter
with Beta, where a key decision parked them.

**What parked costs to keep.** These are named as kill switches, permanent
by kind, not release flags with a removal date. The standing principle to
delete as readily as you add is exactly the tension a kill switch that has
sat off for a month does not resolve on its own, since deleting the
flagged-off code removes the ability to respond to an incident with it, and
keeping it means carrying dead paths through every dependency upgrade and
every boundary check. This page does not decide that tension for voice
notes or Artifacts. It names it so a later planning pass makes the call on
purpose.

**Retired 2026-09-01, and NOT filed as creates.** Three features left this
epic on direction from the client-side decision owner. They are recorded
here rather than deleted quietly, because a feature that vanishes with no
trace reads later as an oversight. The three ids are retired rather than
reused, so a later feature under this epic takes the next free number
instead of stepping into a vacated one.

- E18-F1, full drawing tool set behind a flag. No such tool set was ever
  decided; the client's final color choice makes it moot. What survives is
  the per-wall restriction seam as data, now carried by the drawing canvas
  feature directly.
- E18-F2, challenges. The capability arrived instead as prompt packs plus a
  wall creator's own prompt; that half shipped in the POC and is filed
  under the daily-prompt epic. Nothing is left parked; the blind draw-off,
  server-enforced blindness, and the leaderboard were the parts the product
  dropped.
- E18-F5, the AI enhancement pipeline. Built in the POC, disabled at the
  client's request, and never turned back on. Not parked pending a
  decision; the decision was taken. Drawing bytes never reached an image
  model, only a text caption crossed that seam, and that structural fact is
  worth remembering if this ever returns.

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E18)
~~~

### CREATE E18-F3 Voice note store and replay
- Action: create
- Issue type: Story
- Summary: E18-F3 Voice note store and replay
- Parent: NEW E18 epic
- Labels: GRAY, iOS-and-Backend, Q18, rough-points
- Issue links: is blocked by SCRIBL-43 (E04-F3)
- Description:

~~~
Record up to 30 seconds, upload the raw file, encode server-side with fixed
arguments, store the compact result, replay it from the wall. Specified end
to end and shovel-ready on purpose: it does not enter a sprint until the
client resolves the conflict between their frames, which show Record twice,
and their board, which cut voice memos from the MLP. This is a stored
replayable message, not a transcription input, so it is greenfield rather
than a port.

Disabling voice upload is a kill-switch example, permanent rather than
release-scoped: once this ships, turning it off in an incident does not
remove the capability, it removes the ability to respond to one, so it
should not be deleted after rollout the way a release flag would be.

The web build is ahead of this feature's own framing. Real capture, real
upload, and server-side byte and duration clamping already exist on web (the
record screen), while native has nothing; a doc comment in the codebase
still calls voice capture stubbed, which understates what shipped. The
native gap is priced separately and does not sit inside this feature's own
size.

The response detail screen renders the voice-note player when this feature
ships; it currently also renders an original-and-enhanced toggle that
belongs to the retired AI enhancement pipeline, and that toggle should come
out regardless of this feature's own schedule.

**Backend**  `POST /audio` stores the uploaded recording; encoding with
fixed arguments and the compact-result storage happen server-side, in
`effects/`, not the client.

**Reads/writes**  a successful upload writes `audioRef`, `audioMime`, and
`audioDurationMs` to the draft; a failed upload or re-record clears the
same fields and keeps the person on the recording screen.

**Undecided, deliberately**
- Q18: whether voice notes ship at all is unresolved between the client's
  own frames and their own board decision.

**QE (draft)**  Contract test, tier 2: the audio upload response shape
matches `packages/contracts`. Component test: an unsupported browser shows
the fallback message and a disabled submit control rather than a silent
failure. Kill-switch test: disabling voice upload removes the record
affordance without touching the write path in the story-input feature.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size (rough)**: 4 to 5 days across two lanes

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E18-F3)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/feature-flags.md
- Screen page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/record.md
- Screen page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/story-select.md
- Screen page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/onboarding-story-select.md
- Screen page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/response-id.md
- Flow page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
- Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E18-F4 Artifacts and keepsake composition
- Action: create
- Issue type: Story
- Summary: E18-F4 Artifacts and keepsake composition
- Parent: NEW E18 epic
- Labels: GRAY, iOS-and-Backend, Q19, Q20
- Issue links: is blocked by SCRIBL-51 (E05-F4)
- Description:

~~~
Select tiles on a wall and compose a shareable keepsake from them. It is in
the client's prototype flow, their own key decision parked it for Beta, and
the ownership boundary against earlier keepsake work is also unresolved. Two
open questions on one feature is reason enough not to plan it in yet.

Client screen feedback from 2026-08-25 adds detail on top of those two
questions. Open: whether the Artifact is in the MVP at all, and to what
extent; discovery was done with an intent to automate it, but automating it
needs more work to get right. Decided already: a manual option, where a
person chooses, arranges, and manipulates the art, has proven engaging, and
that is what the POC's compose screen actually built, ahead of this
feature's own gray status. The feedback names why this matters past the
screen itself: it is a rewarding ending to the experience, it adds
content-creation and sharing options, replay value and retention, possible
future monetization, and event display options (the re:Invent event wall
epic names this explicitly).

**Frontend**  Skia stage with move, corner-scale, and rotate handles over
placed drawings, a tray of picked source drawings, undo, clear, Save, and
Share; a guard message replaces the stage when fewer than two drawings are
picked. The multi-select interaction that feeds this screen is shared with
the sharing-personal epic's multi-picture extension and is built once for
both.

**Backend**  a compositions endpoint that derives the destination channel
from the caller's identity server-side, in `authz/`, and re-checks
membership and prior submission before accepting a save or share, so this
does not open a second path around the submit-to-unlock existence check.

**Reads/writes**  reads the selected source drawings on entry; Save clears
the compose selection and returns to family; Share routes to the share
screen with the saved response's fields; a failed save keeps the tray
intact for retry.

**Undecided, deliberately**
- Q19: whether and to what extent the Artifact is in the MVP at all.
- Q20: the ownership boundary against earlier keepsake work.

**QE (draft)**  Once both open questions resolve: invariant test, tier 1,
that the compositions endpoint's authorization re-check cannot be bypassed
by a caller who supplies someone else's channel id. Component test: fewer
than two picked drawings shows the guard message, not the stage.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Backend layering: routes/ (validate, authorize, delegate) -> services/ ->
repositories/ (all SQL, nowhere else) and effects/ (outbound side effects) ->
contracts/ -> lib/. The API is one long-running Node HTTP container behind a
load balancer, not Lambda.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.
Invariant tests are launch gates and are written before the feature.
All authorization runs through backend/src/authz/, the single choke point.
Contract tests against packages/contracts, asserted on both sides, so the
mock server and the real API cannot drift.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E18-F4)
- Screen page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/compose.md
- Flow page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f5-wall-browsing-and-composition.md
- Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

### CREATE E18-F6 Capture a voice note on a native build
- Action: create
- Issue type: Story
- Summary: E18-F6 Capture a voice note on a native build
- Parent: NEW E18 epic
- Labels: GRAY, iOS, Q18
- Issue links: is blocked by NEW E18-F3
- Description:

~~~
Voice capture works on web and does not exist on native, where support
detection can only ever say not available. The voice-note store-and-replay
feature prices voice notes as greenfield without naming that platform
split; this feature is that gap, native recording, encoding trigger, and
upload, once the client's decision lets voice ship at all.

A React Native autolinking risk applies here: native audio capture pulls in
a native module, and pnpm's symlinked store is the fragile case for
autolinking on a native build. `node-linker=hoisted` is the documented
fallback if autolinking breaks, but it forfeits the strictness pnpm was
chosen for, so it is a fallback to reach for, not a default to plan around.

**Frontend**  native mic capture with the same 30 second cap, countdown,
and re-record affordance the web record screen already has, using
whichever native audio module survives the autolinking check above.

**Backend**  none beyond `POST /audio`, already specified in the
voice-note store-and-replay feature.

**Reads/writes**  same draft fields as the voice-note store-and-replay
feature: `audioRef`, `audioMime`, `audioDurationMs` on success, cleared on
failure or re-record.

**Undecided, deliberately**
- Q18: whether voice notes ship at all, inherited from the parent feature.

**QE (draft)**  Component test on native: recording, uploading, and the 30
second cap behave the same as the web record screen's happy path.
Build-time check: a prebuild with `node-linker=hoisted` is exercised at
least once in CI if the native audio module's autolinking is unresolved by
launch, so the fallback is proven rather than assumed.

**Engineering context**
The build repo is ScriblOrg/scribl-mobile-app on GitHub, a pnpm workspace
monorepo. Dependency rule per architecture.md: dependencies point inward and
downward, never sideways or upward.
Frontend layering: app/ (expo-router routes) -> features/ ->
components/ui/, data/ (query cache), stores/ (Zustand client state),
services/ -> contracts/ -> lib/.

**Size**: not sized

**Links**
- Hub source of truth: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/backlog-epics.md (E18-F6)
- Handbook: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/handbook/engineering/toolchain.md
- Screen page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/screens/record.md
- Flow page: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/product/prototype/workflows/f4-daily-create-and-submit.md
- Open questions: https://github.com/ScriblOrg/meta-scribl-mobile-app/blob/main/tracking/open-questions.md
~~~

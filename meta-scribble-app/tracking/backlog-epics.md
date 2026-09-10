---
title: "scribl backlog, epics and features"
project: scribl
type: planning
status: draft for team review
updated: 2026-09-02
future_home: https://bounteous.jira.com/jira/software/projects/SCRIBL/boards/13809/backlog
---

# scribl backlog, epics and features

Epics and features for the eight-week Scribl build that starts 2026-08-24. Shape
is seven working days, not two weeks, then three two-week build sprints. See
"The calendar" below for the confirmed dates. No user stories on this page by
direction; decomposition happens at sprint planning with the people who will do
the work.

Prioritization is the kickoff board of 2026-08-19, read verbatim. Its three
bands are GREEN ("FIRST, carries the daily loop"), ORANGE ("NEXT, the real
conversation, what earns a sprint slot"), and GRAY ("OUTSIDE these 8 weeks, each
has a later home, none are dropped"). Every gray epic below carries a named
later home, because the board's own words are that none are dropped.

Two epics on this page are not on the board. E06 (QA foundation and standards)
and E07 (build, signing and tester distribution) are additions, marked as such
in their metadata, and the reason each is here is argued in its description. One
epic, E18, is not work at all; it is the capability the new designs took off the
product surface, already built and switched off, recorded so nobody reads the
reduction as a deletion. It now sits under the GRAY band rather than a band of
its own, because parked is a status on an epic, not a priority tier.

Three stickies on the board had no epic behind them until the 2026-08-25
prioritization session: E12 (sharing a response as a document), E13 (comments,
with the wall creator as moderator) and E17 (monetization). That session also
moved analytics from the orange band to green, matching the kickoff board's own
green sticky rather than an earlier misreading of it.

## The clickable view

Every epic and feature below, expandable, filterable by band and by owning discipline.

<iframe src="/assets/backlog/scribl-backlog-epics.html" style="width:100%;height:1200px;border:1px solid var(--vp-c-divider);border-radius:8px;" title="scribl backlog, epics and features"></iframe>

[Open the backlog full-window](/assets/backlog/scribl-backlog-epics.html)

For the dated calendar, the sprint 1 queue and the demo milestones rendered as
a visual timeline, see [Timeline and milestones](/timeline-and-milestones), also
available standalone at
[`/assets/backlog/scribl-timeline.html`](/assets/backlog/scribl-timeline.html).

## Future home

This backlog migrates to Jira project SCRIBL, board 13809:
https://bounteous.jira.com/jira/software/projects/SCRIBL/boards/13809/backlog.
Nothing has been created there. Every item below carries a metadata header with
the fields the import needs, so the migration is a mapping exercise and not a
re-authoring one. Epic maps to a SCRIBL Epic named `E<nn> <epic name>`. Feature
maps to a SCRIBL Story or Task under that epic, keyed `E<nn>-F<n>`, with `band`
and `discipline` as labels and `status` as the board column. Jira sharing with
Scribl is unresolved (Q52), so backlog visibility for the client runs off this
page until it is.

## What this supersedes

`tracking/production-sprint-backlog.md` and its rendered HTML
(`docs/public/assets/backlog/scribl-production-sprint-backlog.html`) are the
pre-kickoff story-level plan, dated 2026-07-27. Four things it assumes are now
wrong: four sprints rather than two discovery weeks plus three build sprints,
four generic roles rather than the named roster, a 16-color palette and a
multi-brush canvas rather than the six inks the client's own frames show, and
challenges as a future epic rather than a capability already built and flagged
off. This page supersedes it as the plan of record at the epic and feature
level. That file stays in place unedited and keeps its value as the story-level
dataset and the Fibonacci sizing history; it is not a competing plan and should
not be read as one. Where the two disagree, this page wins.

`tracking/production-backlog.md` (EPIC-01 to EPIC-10) and
`tracking/expo-rebuild-epics.md` (RE-01 to RE-14, RE-F1 to RE-F9) stay as the
long-horizon inventory beyond this eight weeks. Feature rows below cite the RE
epic they carry forward from, so nothing that was already thought through gets
re-derived.

## Board mapping, all eighteen items

Every item on the kickoff board, and where it lives on this page. Nothing is
silently dropped. The board has eighteen stickies, not twelve, and the table
below was stale against it. Three of those stickies, sharing personal,
picking multiple pictures, and comments, plus the gray monetization sticky,
had no epic behind them until the 2026-08-25 prioritization session, which
gave them E12, E13 and E17.

| Board band | Board item, verbatim | Epic | Note |
|---|---|---|---|
| GREEN | Drawing + submit, with submit-to-unlock | E04 | Whole item in scope |
| GREEN | Daily prompt - curated (Claude) | E03 | In scope. The board struck out its own "Claude" against the 2026-08-19 client decision. See E03 |
| GREEN | Auth | E02 | In scope. Invite tokens inside it are funding-gated (Q8) |
| GREEN | Walls + channels | E05 | In scope. Channel count unresolved (Q29) |
| GREEN | Cloud foundation (AWS, CI/CD, data model) | E01 | In scope. Account provisioning and hosting cost unresolved (Q17, Q49) |
| GREEN | Onboarding + Invited/New user | E02 | In scope. A live design sticky and not yet placed in the FIRST group (Q11) |
| GREEN | Analytics instrumentation (instrument now, report later) | E08 | Moved here from orange at the 2026-08-25 session. The kickoff board carries it as a green sticky; this page had it wrong |
| ORANGE | Push notifications (the daily nudge) | E09 | Backend side fits. Client side does not, see the capacity section |
| ORANGE | Moderation (fail-safe) | E10 | Backend side fits. Fail policy unresolved |
| ORANGE | Streaks + progression | E11 | Backend side fits. Client side contends with green work |
| ORANGE | Sharing personal | E12 | New at the 2026-08-25 session. One response, one document, per E12-F1 to F5 |
| ORANGE | Reactions | E05 | Fixed sentiment set, post-unlock only. See E05-F6 |
| GRAY | Monitization | E17 | New at the 2026-08-25 session. Hooks in the infrastructure now, selling later |
| GRAY | App Store readiness + compliance -> release phase | E14 | Later home: the release phase after sprint 3, gated on Q56 |
| GRAY | re:Invent event wall -> its own scope + funding call | E15 | Later home: its own scope and funding call, tracked as Q21 |
| GRAY | Under-13 / COPPA Family edition -> after launch planning | E16 | Later home: post-launch planning, tracked as Q32 |
| GRAY | picking multiple pictures and grouping them | E12-F2 | The deferred multi-picture extension of sharing, out past the orange work |
| GRAY | comments? - Add toggles for Wall Creators, possible ai moderation of comments | E13 | New at the 2026-08-25 session. Moved up from parked to plannable; its band is a decision, not an inheritance |
| Not on the board | -- | E06 | Addition. QA foundation and standards, endorsed by Rob Forshier |
| Not on the board | -- | E07 | Addition. Build, signing and tester distribution |
| Not on the board | -- | E18 | Not work. Parked capability, already built and switched off |

## The calendar

Source: `docs/meetings/schedule-plan.html`, lines 359 to 371. This calendar is
confirmed, not proposed.

| Phase | Dates | Working days |
|---|---|---|
| Shape (discovery) | Monday 2026-08-24 to Tuesday 2026-09-01 | 7 |
| Sprint 1 | Wednesday 2026-09-02 to Tuesday 2026-09-15 | 10 |
| Sprint 2 | Wednesday 2026-09-16 to Tuesday 2026-09-29 | 10 |
| Sprint 3 | Wednesday 2026-09-30 to Tuesday 2026-10-13 | 10 |

Demo Wednesdays: 2026-09-02 (Shape readout), 2026-09-16, 2026-09-30, 2026-10-14.
The eight weeks end 2026-10-16. The last demo is 2026-10-14, so two working days
sit after it and there is no hardening sprint.

**The correction this backlog has to carry.** An earlier draft of this page
called Shape "two weeks of discovery". The confirmed calendar gives Shape seven
working days, not ten, and the schedule plan says why. Starting sprint 1 later,
on 2026-09-09 instead of 2026-09-02, would push the last demo past the end of
the eight weeks and into the re:Invent freeze around 2026-10-23. So discovery
supply is seven days per full-time lane, not ten. The build lanes get 20
discovery lane-days (Neelesh 2 at 30 percent, Nitish 7, Karuna 7, Pankaj 4 at
0.6), not 25. Shubhankar Bhavsar is onboarding through the Shape window and
contributes no build days there; his capacity starts with sprint 1.

Sprint boundaries fall on Wednesdays, so a week-numbered grid is approximate at
every boundary. That applies everywhere below that uses week numbers as labels.

### Holiday and availability collisions inside the window

Named here as risks, not absorbed into the lane-day arithmetic above.

| Date | What | Lands in | Who it costs |
|---|---|---|---|
| Monday 2026-09-07 | US Labor Day | Sprint 1, week 3 | Rob Forshier, David Lawton, John Kilgore. All three sit outside the 22.8 person-weeks, so no build-lane day is lost. What is lost is a day of the design and product answers Rob supplies, plus that week's Monday standup and Monday backlog check-in |
| Friday 2026-10-02 | Gandhi Jayanti, an India national holiday | Sprint 3, week 7 | Up to five build-lane days across Shubhankar, Neelesh, Nitish, Karuna and Pankaj's share, in the sprint that already carries zero slack |
| Around Monday 2026-09-14 to Tuesday 2026-09-15 | Ganesh Chaturthi, regional in India, date to be confirmed | The last two days of sprint 1, immediately before the week-four demo | Unknown until the roster's own holiday calendar is confirmed. If it holds, it lands on the two days before the anchor demo |

The delivery team is largely India-based, so a US-only holiday calendar is the
wrong calendar, and nobody has published the roster's own holiday list yet.
**Owner: Pramod Kumar, to publish the team's actual holiday and planned-leave
calendar for 2026-08-24 to 2026-10-16 before sprint 1 planning on 2026-09-03.**
The two India dates above are what a public calendar gives; treat them as a
prompt for that list, not as the list itself.

## Capacity arithmetic

The constraint from the board is roughly 21 person-weeks across three build
sprints, about 7 per sprint, with feature work serial behind one iOS engineer.
Here is where the actual roster capacity comes from, a sprint being two
calendar weeks.

| Person | Lane | Person-weeks per sprint |
|---|---|---|
| Neelesh Aggarwal | iOS | 0.6 |
| Shubhankar Bhavsar | iOS | 2.0 |
| Nitish Goyal | Backend and AWS | 2.0 |
| Karuna Arshakota | QA | 2.0 |
| Pankaj Aggarwal | Engineering lead and architect, split across accounts (Q26) | 0.6 |
| Pramod Kumar | Delivery management | 0.4 |
| **Total** | | **7.6** |

Shubhankar Bhavsar joins as the second iOS engineer. His onboarding was
targeted for 2026-08-26 and may slip a day; there is no Bounteous email for him
yet and his Mac setup is running longer than planned. He can absorb context and
do analysis during Shape, not build, so his row above is full capacity from
sprint 1 (2026-09-02) on, and he carries zero build days in the Shape window.
Neelesh Aggarwal drops from 2.0 to 0.6 person-weeks per sprint to make room for
him.

Three sprints at 7.6 is 22.8 person-weeks, which is 114 lane-days at five
days to the week. Six of those are Pramod Kumar's delivery management, so
build supply is **108 lane-days**, and every percentage below divides by 108.
Rob Forshier, David Lawton and John Kilgore sit outside the 22.8. There is no
PM (Q25). The second iOS engineer question, Q6, is answered: Shubhankar
Bhavsar fills that seat.

Every feature below carries a size in lane-days. The three tables in this
section are the rollup of those sizes, not a separate estimate, so a size that
changes on a feature changes the arithmetic here. Where the POC realignment plan
(`product/design/poc-realignment-plan.md` section 5) already sized an equivalent
screen, the feature takes the top of its range and adds for greenfield, because
the walkthrough decision is that the POC gets rebuilt from scratch rather than
retuned (Rob Forshier II, 00:11:27). Rebuilding costs more than retuning, never
less.

### Supply and demand per lane

| Lane | Available lane-days | GREEN demand | ORANGE demand | Green as percent of lane |
|---|---|---|---|---|
| iOS (Shubhankar Bhavsar plus Neelesh Aggarwal) | 39 | 43 | 7 | 110 |
| Backend and AWS (Nitish Goyal plus Pankaj Aggarwal) | 39 | 60 | 20 | 154 |
| QA (Karuna Arshakota) | 30 | 24 | 0 | 80 |
| Platform (inside Pankaj Aggarwal's share, already counted above) | included above | 1 | 0 | -- |
| Delivery (Pramod Kumar) | 6 | not sized | not sized | -- |
| **Total, three build lanes** | **108** | **128** | **27** | **119** |

The three build lanes hold 108 of the 114 lane-days and Pramod Kumar's delivery
management is the other 6. An idle delivery-management day cannot be spent as
an iOS-day, so 108 is the denominator everywhere below. Read the lane rows
rather than the total for the same reason, because an idle QA-day cannot be
spent as an iOS-day either. The delivery-lane items on this page (E07-F1,
E07-F4, E10-F4 and most of E14) are deliberately unsized because they are
client and vendor coordination rather than build work, so 128 is a floor
rather than a total. Three numbers matter.

Earlier copies of this table totalled green at 119 and green plus orange at
155, both counting the one platform green-day twice and both dividing by the
105 total rather than by build-lane supply. The build-lane figures are 128 and
155 against 108.

**The green band alone is 128 lane-days against 108 available.** That is an
overrun of 20 lane-days, a 119 percent load, before a single orange item.

**Green plus orange is 155 lane-days against 108.** A 144 percent load, 47
lane-days over. There is no sequencing of this backlog that makes that fit,
and reshuffling to hide it would only move which sprint discovers it.

**The overrun sits in the backend lane.** iOS is 4 days over on green and
backend is 21 days over. QA is the only lane with slack, 6 days of it, and
QA-days do not convert.

### The iOS lane, feature by feature

39 iOS-days for the whole build: Shubhankar Bhavsar at 2.0 plus Neelesh
Aggarwal at 0.6 is 2.6 person-weeks per sprint across three sprints.

| Green-band iOS feature | iOS-days |
|---|---|
| E01-F9 App shell, routing and the single brand theme | 5 |
| E02-F2 Token issuance and native secure storage | 3 |
| E02-F4 Guided onboarding, screens 1 to 8 | 5 |
| E02-F5 Invite redemption and the invite-code fallback | 3 |
| E03-F2 Today's prompt screen | 2 |
| E03-F5 Local daily reminder | 1 |
| E04-F1 Skia canvas with one brush and the client's eight colors | 5 |
| E04-F2 Stroke serialization and artwork capture | 2 |
| E04-F3 Story input at 280 characters | 2 |
| E04-F6 Canvas performance on the device matrix | 2 |
| E05-F4 Wall grid and response detail | 4 |
| E05-F5 Dashboard with Your Walls and the stats card | 3 |
| E07-F3 Automated iOS build | 3 |
| E07-F5 Crash reporting and build traceability | 1 |
| **Green total** | **41** |

43 against 39, and that is the optimistic read. It excludes prep for three
Wednesday demos, code review, fixing anything QA finds, and iPad if Q44 puts
iPad in scope, which would be a layout pass across every screen in E02 and E05
rather than a line item. The orange band adds 7 more iOS-days (E09-F2, E10-F3,
E11-F2 and E11-F4), taking iOS to 50 against 39.

Two of the 43 iOS-days are invisible work worth naming because it competes
directly with screens: E07-F3 and E07-F5 are four days of build and crash
plumbing that no demo shows and no demo happens without.

### The backend lane

Nitish Goyal at 2.0 plus Pankaj Aggarwal at 0.6 is 2.6 person-weeks per sprint,
**39 backend-days** across three sprints. Green-band backend demand is 60:
E01 is 24 of it (accounts, CDK, schema, API, contract and mock, media, deploy,
observability), E02 is 8, E03 is 5, E04 is 6, E05 is 10 and E08 is 7. Orange-band backend
demand is 20: E09 8, E10 7 and E11 5.

So the backend lane is 21 days over on green and 41 days over on green plus
orange. It is the bottleneck now, not iOS. It has no slack to absorb the orange
band's server side, and it is the only lane where the green band alone needs
more people than the roster has.

### What I would do, with the numbers

**Option 1, land the green band only, and cut into it.** The orange band coming
out saves 27 lane-days and gets green to 128 against 108, still 20 over,
with iOS 4 over and backend 21 over. Slipping the features that are already
gated on client answers gets part of the way: E04-F6 (2 iOS-days, Q44), E02-F5
(3 iOS-days, Q8) and E01-F1 (2 backend-days, Q17 and Q49) recover 5 iOS-days and
2 backend-days, leaving iOS 1 day under and backend 19 over. The backend side is
still not enough, so this option means cutting green work that nobody has a
reason to cut except the arithmetic. Where I would take the remaining
lane-days, in this order.

| Cut | Lane-days | Why this one |
|---|---|---|
| E02-F3 invite token backend, with E02-F5 already slipped | 3 backend | The whole invite flow is funding-blocked on Q8. Cut it as a unit rather than half-building it, and fall back to typed invite codes |
| E05-F5 dashboard and stats card | 3 iOS | Its contents are orange-band work, so in a green-only plan the card ships empty. Ship the wall without a dashboard instead |
| E03-F4 Claude-assisted prompt drafting | 2 backend | Scribl's editors can seed eight weeks of prompts by hand. This is the feature that saves them time in month three, not month one |
| E02-F6 account deletion and export | 2 backend | Only needed for public submission, which is gray and gated on Q56. Moves to E14 with the eyes-open cost that retrofitting deletion is worse than building it with the schema |
| E01-F8 baseline observability, reduced to logs plus one alarm | 2 backend | Keeps the floor, drops the dashboards until there is traffic to look at |
| E04-F2 stroke serialization, raster capture only | 2 iOS | The cut I like least. It cannot be added retroactively to art already submitted, so it trades a permanent capability for two days |
| E10-F3 report and block, if it had survived the orange cut | 2 iOS | Named here only to say it should not be cut. Store review checks it |

The two iOS cuts in this table, E05-F5 dashboard and E04-F2 raster-only stroke
capture, are no longer forced by the iOS arithmetic, so they become a product
call rather than an arithmetic one.

Those cuts recover 5 iOS-days and 9 backend-days, which closes the iOS lane and
leaves backend roughly 10 days over. Option 1 no longer reaches the budget on
its own, and the reason is analytics: instrumenting from day one is a green
commitment now, and it carries 7 backend-days that used to sit in the orange
band. Either two more backend-days come out of this list, or the green band
accepts that it lands over. Even at the budget there is zero slack for demos,
review or defects, and zero slack across three sprints is a plan that fails in
week five, so read option 1 as the floor rather than the plan. It needs
no money and no new people, and it is what happens by default if nobody decides
anything. Say that to Scribl now rather than in week six.

**Option 2, add two engineers for the three sprints.** One iOS takes the lane
from 39 to 69 and covers green plus orange (50) with 19 days of slack. One
backend takes 39 to 69, which still leaves green plus orange 11 days short, so
the backend addition buys green plus most of orange rather than all of it.
That is 12 extra person-weeks against a 22.8 person-week budget, so it is a 53
percent increase in team cost and it should be presented as one.

**Option 3, a fourth sprint.** The orange band is 27 lane-days, which is 5.4
person-weeks, which is one more sprint at this team size. This is the cleanest
option arithmetically and the one the eight-week clock does not allow.

My recommendation is option 1 as the plan, with option 2 requested and priced in
parallel. Option 1 is honest and it ships the daily loop. What it costs is the
daily nudge, moderation, streaks and instrumentation, and of those four, the
missing nudge is the one that will show up as retention in the first month.
Ranked by what I would fight to keep inside the eight weeks: E08 analytics
instrumentation first, because unmeasured months cannot be recovered later;
then E10-F3 report and block, because store review checks it; then E09 push.

### Where the iOS lane serializes the others, and what fills the gap

Overcommitment is the capacity problem. Serialization is a separate scheduling
problem and it is worst in the first four weeks, when the app does not exist yet
and QA has nothing to click. Karuna Arshakota raised exactly this on 2026-08-20.

| When | Who idles, and why | What fills it |
|---|---|---|
| Discovery, weeks 1 and 2 | QA has no build and no test cases to write | E06-F1 and E06-F2, with E06-F4 in sprint 1 where its design blockers resolve. The QA standard and the tooling research. Client-facing artifacts, not test cases |
| Sprint 1 | Backend finishes endpoints before any client can call them. QA has an app shell and an auth screen | E01-F5, the API contract plus a mock server. QA writes API-level tests against the mock and iOS codes against a stub, so neither waits on the other. E07-F1 to E07-F3 run in the platform lane in parallel |
| Sprint 2 | The daily loop becomes testable only when submit lands late in the sprint | E06-F5 automation harness, E06-F7 device matrix, and backend integration tests against the contract |
| Sprint 3 | Every lane is over capacity, so nobody idles. The risk inverts from idleness to unreviewed work landing in the last week | E06-F6, the release gate, applied at the sprint 3 demo rather than after it |

Serial versus parallel, stated plainly. Everything inside E04 and E05 is serial
behind the one iOS lane and adding a backend engineer cannot compress it. E01,
E06 and E07 are genuinely concurrent with all of it, which is why they carry the
discovery weeks. E02 has a serial client half and a parallel backend half
(invite tokens) that can be built before any screen consumes it.

## What discovery produces

The lane-idling table above assigns Shape output only to QA and to decisions.
It never says what the iOS and backend lanes build during those seven days.
This is that answer. Every item below is real backlog work pulled forward, so
every day spent here comes off a build sprint.

### Neelesh Aggarwal, iOS, 2 days

Shubhankar Bhavsar is onboarding through this window and carries no items
below; he can absorb context and do analysis, not build. Neelesh's own 2 days
at 30 percent go to the piece of E01-F9 that needs no design answer.

| Item | Days | Week | Depends on an open question |
|---|---|---|---|
| E01-F9 App shell and routing, 2 of its 5 days | 2 | Week 1 | Q1, Q3, Q4. The shell and routing need no design answer. The theme pass, the remaining 3 days, moves in full to sprint 1, where it waits on the tokens out of the design working session on 2026-08-26 and the design sync on 2026-08-27 |

E04-F1 no longer has a Shape allocation; the whole 5-day feature lands in
sprint 1.

Absorbs **2 of the 43 green iOS-days**. The iOS build-sprint demand drops to 41
against 39.

### Nitish Goyal, backend, 7 days

| Item | Days | Week | Depends on an open question |
|---|---|---|---|
| E01-F5 API contract and mock server, whole feature | 2 | Week 1 | None. Needs no AWS account. This is the item that lets QA write API-level tests and iOS code against a stub, so it goes first |
| E01-F3 relational data model, the schema draft, 3 of its 4 days | 3 | Weeks 1 and 2 | None to draft. The schema and its migrations are authored and reviewed here; the remaining day applies them to a provisioned environment in sprint 1, which needs Q17 and Q49. E01-F3 formally depends on E01-F2, and Shape deliberately overrides that for the drafting half only, because authoring a schema needs no CDK stack. The dependency holds for the applied day, which is why it follows the deploy in sprint 1. |
| E01-F2 CDK stack skeleton, 2 of its 3 days | 2 | Week 2 | Q17, Q49. CDK can be authored and synthesized locally with no account. It cannot be deployed. The third day is the deploy, in sprint 1 |

Absorbs **7 of the 60 green backend-days**.

### Pankaj Aggarwal, engineering lead and architect, 4 days at 0.6

| Item | Days | Week | Depends on an open question |
|---|---|---|---|
| E01-F1 AWS accounts and three environments | 2 | Weeks 1 and 2 | Q17, Q49. Blocked on both. What is doable regardless is the account request, the environment design and the cost shape. If Q17 and Q49 are still open on 2026-09-02, nothing deploys in sprint 1 and the whole backend lane stalls behind it |
| E07-F2 build host and pipeline decision | 1 | Week 1 | Q47. This feature is the decision, so Shape is exactly where it belongs |
| An auth and identity ADR | 1 | Week 2 | None |

The auth ADR is not a backlog feature today, and that is the gap. No ADR covers
auth or identity anywhere, while E02-F1 recommends a Cognito user pool and
every authorization check in E04 and E05 reads the identity it issues. One page
from Pankaj in Shape closes it. It should become a feature at sprint 1 planning
rather than stay an unlisted deliverable.

Pankaj's 2 days on E01-F1 absorb 2 more of the 60 green backend-days, so the
backend lane absorbs **9 in total** and its build-sprint demand drops to 51
against 39.

### Karuna Arshakota, QA, 7 days

| Item | Days | Week |
|---|---|---|
| E06-F1 QA process standard for this engagement | 3 | Week 1 |
| E06-F2 tooling recommendation with the alternatives written down | 4 | Weeks 1 and 2 |

E06-F4, requirements review and traceability, is **not** in Shape. It was
double-booked, appearing both in the discovery fill and in Karuna's sprint 1
lane. It sits in sprint 1 only, which is also where its blockers resolve. It is
gated on Q15 and Q16, the design questions Shape exists to answer.

Absorbs 7 of the 24 green QA-days, so QA build-sprint demand is 17 against 30.
That grows QA slack from 6 days to 13. Those 13 days are the entire
test-execution budget for the app across three sprints and nothing else in the
plan funds execution, so name them as that budget rather than as slack.

### Pramod Kumar, delivery, 3 days at 0.4

E07-F1, chasing the Apple Developer account (Q5) daily until it closes. E07-F4,
the TestFlight distribution process written for Scribl. The answers to Q44
through Q48. The roster holiday calendar named above. All unsized coordination
work.

### What the discovery allocation buys

Green build-lane demand is 128 against 108. Shape absorbs 18 green lane-days (2
iOS, 9 backend and 7 QA), which takes green demand to 110 against 108.

It does not close the overrun per lane, and the lane rows are the ones that
matter because an idle QA-day cannot be spent as an iOS-day. After Shape, iOS is
41 against 39, still 2 over. Backend 51 against 39, still 12 over. QA 17 against
30, 13 under. The fourteen remaining lane-days of overrun sit in the two lanes with
no slack, and face 13 days of slack in the lane that cannot convert.

So Shape is the cheapest relief available, and it was worth claiming before
asking for money. It is not a fix. The green band still does not fit in the two
lanes that build the product.

## Sprint 1 lane view

Sprint 1 is Wednesday 2026-09-02 to Tuesday 2026-09-15. Capacity is 13 iOS-days,
10 backend-days, 3 of Pankaj's days and 10 QA-days. **36 lane-days.**

The previous version of this section assigned 60 sized lane-days into a
33-lane-day budget and did not say so, a 182 percent load. Anyone who opened sprint 1 planning
from it planned a sprint that could not execute.

This version is a ranked queue rather than a hard re-cut, for two reasons.
Sixteen features on this page are honestly not sized, so every size here is a
floor and a hard cut would pretend an order nobody has agreed to. And Q5 can
stall the whole platform track outright, in which case the queue reorders
itself at planning without a replan. Decomposition happens at sprint planning
with the people doing the work, which is this page's own rule.

**Above the line is 36 lane-days against 36 available. The queue states its own
load, and it fits exactly.**

### The iOS lane, Shubhankar Bhavsar and Neelesh Aggarwal. Capacity 13, committed 13

Shubhankar carries 10 of the 13 days, the substantive build. Neelesh carries 3
at his 30 percent, the smaller operational days he already has context on from
Shape.

| Rank | Item | iOS-days | Who | Why here |
|---|---|---|---|---|
| 1 | E02-F2 token issuance and native secure storage | 3 | Shubhankar | Somebody has to be able to sign in before anything else at the demo means anything |
| 2 | E03-F2 today's prompt screen | 2 | Shubhankar | The first screen a returning person sees. Renders against E01-F5's mock. Its metadata depends on E01-F9 and E03-F1. E01-F9's shell and routing landed in Shape, and E03-F1 is below the backend line this sprint, so the mock stands in for it on the same fetch contract. That substitution is a choice, not a given |
| 3 | E04-F1 Skia canvas, the whole 5 days | 5 | Shubhankar | Shape held none of it this time, so it lands in sprint 1 in full. Needs Q1 and Q2 answered by 2026-09-02 for the ink palette |
| 4 | A manual signed build and the first TestFlight upload, 1 of E07-F3's 3 days | 1 | Neelesh | Demo 1 needs a build that reaches a human once. The page's own words are that laptop builds "work once", and once is what this demo needs. The other 2 days, the automation, are sprint 2 |
| 5 | Demo preparation and defect fixes | 1 | Neelesh | Named, not assumed. This is the only reserve day in the whole sprint |
| 6 | E01-F9 theme pass, 1 of its remaining 3 days | 1 | Neelesh | The first day of the theme work Shape could not take. The other 2 days sit below the cut line, where they wait on the design tokens |

**Cut line.** Below it, in rank order: E04-F2 stroke serialization and artwork
capture (2), E04-F3 story input at 280 characters (2), E02-F4 guided onboarding
screens 1 to 8 (5), E07-F3 build automation, the remaining 2, E01-F9 theme
close-out if the design answers land late (up to 2).

E02-F4 is the notable move out of sprint 1. It is the biggest single iOS line
in the plan, it is blocked on Q10 and Q11, and eight screens of greenfield
React Native in 5 days is thin against this page's own sizing rule. It goes to
sprint 2. The cost is that the first run at the week-four demo is bare: you
sign in and you are on the prompt screen, with no guided onboarding in front of
it.

### Nitish Goyal, backend. Capacity 10, committed 10

| Rank | Item | backend-days | Why here |
|---|---|---|---|
| 1 | E01-F2 CDK stack skeleton, the remaining 1 day, deployed | 1 | Gated on Q17 and Q49. Nothing else in this lane lands until it does. It goes first because E01-F3 depends on it and applying a migration needs the stack to exist |
| 2 | E01-F3 relational data model, the remaining 1 day, applied to the deployed environment | 1 | Same gate, and it follows rank 1 by dependency |
| 3 | E01-F4 serverless API surface | 5 | Every other epic reads through it |
| 4 | E02-F1 email and password accounts | 3 | E02-F2 on the client has nothing to talk to without it |

**Cut line.** Below it, in rank order: E03-F1 seeded prompt set and fetch
contract (2), E01-F6 media storage and delivery (3), E04-F4 submit endpoint and
presigned upload (3), E02-F3 invite token backend (3, funding-blocked on Q8),
E02-F6 account deletion and export (2).

This is the lane with zero reserve, and it is the lane to watch. Two of its
four items are gated on Q17 and Q49, so if the AWS account question is still
open on 2026-09-02 the first two ranks do not start and the other two cannot
deploy. The first relief available is moving E02-F1 to Pankaj, which costs the
deploy automation below his line. The second is funding a backend engineer,
which the capacity section prices.

### Pankaj Aggarwal, architecture and AWS. Capacity 3, committed 3

| Rank | Item | days | Why here |
|---|---|---|---|
| 1 | E01-F7 deploy automation | 2 | Two demos follow this one. Deploying by hand three times is how the third one breaks |
| 2 | E01-F8 baseline observability, the logs-plus-one-alarm floor, 1 of its 3 days | 1 | The floor now, the dashboards when there is traffic to look at |

**Cut line.** Below it: E01-F8's remaining 2 days, and E01-F1 if the AWS
accounts land late and the provisioning work comes back.

The previous version of this table gave Pankaj 10 days of AWS work against his
3. E01-F1 moved to Shape, E01-F2 moved to Nitish who owns the schema and the
API it deploys, and what is left fits his 0.6 exactly. Whether 0.6 is the right
number at all is Q26, and it is not a later question: either Pankaj is full
time through sprint 1, or these two items move to Nitish and his lane
arithmetic gets worse where everyone can see it.

### Karuna Arshakota, QA. Capacity 10, committed 10

| Rank | Item | QA-days | Why here |
|---|---|---|---|
| 1 | E06-F4 requirements review and traceability | 4 | Off the Figma frames. Gated on Q15 and Q16, which Shape is meant to answer |
| 2 | E06-F3 test strategy and a priced coverage commitment | 3 | Gated on Q48. Three different coverage numbers already exist in one hour of transcript, so this is the item that stops a fourth reaching a client call |
| 3 | E06-F6 release gate, definition of ready, definition of done | 2 | Three demos are gated on it. It has to exist before the first one |
| 4 | Test execution against the mock server and the auth path | 1 | The first day anywhere in this plan that is sized for running a test rather than writing a document |

**Cut line.** Below it: E06-F5 automation harness build (6), which needs the
app to be testable and belongs in sprint 2, and E06-F7 device matrix (2),
blocked on Q44 and Q51.

### What moved out of sprint 1, and where it went

| Item | Was | Now |
|---|---|---|
| E01-F9 app shell and theme | Neelesh, sprint 1 | Shape, 2 days (shell and routing); the rest in sprint 1 |
| E04-F1 Skia canvas | Split, Shape and sprint 1 | Wholly in sprint 1, 5 days |
| E02-F4 guided onboarding, screens 1 to 8 | Neelesh, sprint 1 | Sprint 2 |
| E07-F3 automated iOS build | Neelesh, sprint 1, 3 days | 1 day of manual signed build in sprint 1, 2 days of automation in sprint 2 |
| E01-F3 relational data model | Nitish, sprint 1 | Schema draft in Shape, the applied day in sprint 1 |
| E01-F5 API contract and mock server | Nitish, sprint 1 | Shape, week 1 |
| E01-F6 media storage and delivery | Nitish, sprint 1 | Sprint 2 |
| E02-F3 invite token backend | Nitish, sprint 1 | Below the line, funding-blocked on Q8. Cut as a unit with E02-F5 under option 1 |
| E01-F1 AWS accounts and environments | Pankaj, sprint 1 | Shape |
| E01-F2 CDK stack skeleton | Pankaj, sprint 1 | Nitish, 2 days in Shape and 1 in sprint 1 |
| E01-F8 baseline observability | Pankaj, sprint 1, 3 days | 1-day floor in sprint 1, 2 days in sprint 2 |
| E06-F4 requirements traceability | Double-booked, Shape and sprint 1 | Sprint 1 only. This is the double-booking fixed |
| E06-F5 automation harness | Karuna, sprint 1 | Sprint 2 |
| E06-F7 device matrix | Karuna, sprint 1 | Sprint 2, blocked on Q44 and Q51 |

### The two gates on sprint 1

If Q5, the Apple Developer account, has not closed by 2026-09-02, then E07-F1,
E07-F3 and E07-F4 all stall, and rank 4 in the iOS lane comes off the queue
with them. There is no signed build, no TestFlight, and the week-four demo is a
simulator screen recording rather than an app on a tester's phone. That single
unanswered question blocks more of this page than any other.

Q17 with Q49, whose AWS account and whose money, is the second gate and it is
not smaller. Ranks 1 and 2 in the backend lane cannot start until they close,
and ranks 3 and 4 cannot deploy behind them. If they are still open on
2026-09-02, the backend lane spends sprint 1 authoring against a mock and the
week-four demo has no hosted back end. Q5 costs the demo its build. Q17 and Q49
cost it everything the build would talk to.

## Metadata fields

Every epic and feature below carries a header. Fields, and what the Jira import
does with each.

- `id`. `E<nn>` for epics, `E<nn>-F<n>` for features. Becomes the SCRIBL issue key alias.
- `parent`. The epic a feature sits under. Becomes the Jira epic link.
- `band`. GREEN, ORANGE or GRAY. Becomes a Jira label and drives backlog rank.
- `discipline`. The lane that owns delivery: iOS, Backend, AWS, QA, Platform, Product, Design. Becomes a Jira label and the default assignee.
- `depends on`. Items that must land first. Becomes a Jira "is blocked by" link.
- `blocked by`. Open questions, by id, on `tracking/open-questions.md`. Becomes a Jira label plus a comment link. Anything genuinely unresolved is here rather than guessed at in the write-up.
- `status`. Now, Next or Blocked, matching `tracking/board.md`. Becomes the Jira column.
- `size`. In lane-days, only where it is defensible. `not sized` where it is not, which is honest and imports cleanly as an empty estimate.
- `carries forward`. The RE epic in `tracking/expo-rebuild-epics.md` this reuses, so the earlier analysis is not re-derived.

Twenty-five features, E02-F7 to F15, E03-F6 to F9, E04-F7 to F10, E05-F7 to
F13 and E18-F6, were promoted on 2026-09-02 from the POC screen
cross-reference in `artifacts/scribl-backlog-epics-v2.html`. Their entries
are deliberately short. Each links to its screen page under [the prototype
screens index](/prototype/screens/), which holds the full feature, endpoint
and state detail, and the artifact holds the per-screen rationale. Neither
is duplicated here.

# GREEN band. First, carries the daily loop

## E01 Cloud foundation and app shell

`id: E01 | band: GREEN | board item: "Cloud foundation (AWS, CI/CD, data model)" | discipline: Backend and AWS | jira: SCRIBL Epic`

Cloud foundation and app shell: the AWS environments, the data model, the
API, and the app shell everything else builds on.

The epic description previously cited ADR-0002, serverless-first, API
Gateway plus Lambda. Decision register 2.1 supersedes that: one long-running
Node HTTP service in a container behind a load balancer, on a managed
serverless container service per 2.2, not function-per-route. That
supersession is the heaviest single decision in the register, per its own
"if you read only one section" note, and it changes E01-F4's shape below.
The IaC tool (E01-F2) is separately contested: ADR-0005 names CDK, the
shipped repo's `infra/README.md` names Terraform, tracked as A10 in
`code-questions.md`.

**E01-F1 AWS accounts and three environments**
`parent: E01 | band: GREEN | discipline: AWS | depends on: none | blocked by: Q17, Q49 | status: Blocked | size: 2 backend-days | carries forward: RE-13`

Three accounts or three isolated environments (dev, staging, prod) with
billing visible per environment. Two things are unknown and neither is ours
to decide: whether the accounts come from Scribl, from their AWS
representative through the funding relationship, or from Bounteous in the
interim (Q17), and who pays for hosting during this phase, not yet
allocated (Q49). Both stay open, undecided, no source resolves them.

**Backend**  No implementation until Q17 and Q49 close. When they do, this
feature provisions the three environments and wires billing visibility per
environment.
**QE (draft)**  No test surface exists yet. Once accounts land, an
integration check confirms each environment is isolated (no shared
resource reachable across dev, staging, prod).

Work in every other feature of this epic queues behind this one, so it is
the first thing to close in discovery.

**E01-F2 CDK stack skeleton**
`parent: E01 | band: GREEN | discipline: AWS | depends on: E01-F1 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-13`

The stack layout: networking, data, api, events and observability,
parameterized per environment. Doing this before any service exists is
what makes the staging environment real: with three demos to Scribl in
eight weeks, a demo build has to come off a deployed environment rather
than off someone's laptop.

The IaC tool is undecided, not CDK by default. ADR-0005 names AWS CDK in
TypeScript, but the shipped `scribl-mobile-app` repo's `infra/README.md`
names Terraform instead, and `infra/` has no CDK app. `code-questions.md`
A10 tracks this and says it cannot be resolved by guessing: either
Terraform was a deliberate switch, in which case ADR-0005 needs a
superseded banner, or it is scaffolding drift that should be redone in CDK
before real AWS account IDs exist. This feature waits on that answer rather
than picking one.

**Backend**  Whichever tool is confirmed, the stack covers networking
(VPC, load balancer), data (the Postgres cluster from E01-F3), the
container service, an events path, and the observability floor from
E01-F8, each parameterized by environment.
**QE (draft)**  Integration test: applying the stack to a fresh environment
produces a reachable load balancer and a reachable database, with no
manual step. Contract test: the parameterization surfaces the same
resource shape in dev, staging and prod, differing only by size and count.

**E01-F3 Relational data model**
`parent: E01 | band: GREEN | discipline: Backend | depends on: E01-F2 | blocked by: none | status: Next | size: 4 backend-days | carries forward: RE-13`

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

**Backend**  `repositories/` owns all SQL, parameterized, nowhere else, per
`architecture.md`'s dependency rule. Tables are snake_case plural.
**QE (draft)**  Invariant test, launch gate written first: submit-to-unlock
is a transactional existence check at the data layer (register 4.1) and
cannot be bypassed. Integration tests on repositories against a real local
Postgres, not mocked SQL, covering the join table's multi-wall read and the
cascade on delete.

**E01-F4 Serverless API surface**
`parent: E01 | band: GREEN | discipline: Backend | depends on: E01-F3 | blocked by: none | status: Next | size: 5 backend-days | carries forward: RE-13`

The request and response path for the loop endpoints: today's prompt,
submit, channel read, membership, reactions. The title says "Serverless API
surface" and that title is stale. It was written against ADR-0002's
API Gateway plus Lambda design, which register 2.1 supersedes. The decision
of record is one long-running Node HTTP service in a container behind a
load balancer, run on a managed container service per register 2.2, not
function-per-route behind a gateway. Layers are `routes/` (validate,
authorize, delegate, no logic, no SQL) -> `authz/` (the single
authorization choke point) -> `services/` -> `repositories/` -> `effects/`.
The AI service is deliberately not in this path; ADR-0003 puts Claude work
in a separate service and ADR-0010 makes it asynchronous, so submit never
waits on a model.

**Backend**  `POST /submissions`, `GET /prompts/today`, `GET /channels/:id`,
`POST /channels/:id/memberships`, `POST /submissions/:id/reactions`, each
validated and authorized in `routes/` before any service call.
**QE (draft)**  Invariant test, launch gate written first: channel
isolation runs through the one authz module (register 4.2), with a test
asserting `backend/src/authz/` cannot import the flag client (register
4.3). Contract tests against `packages/contracts`, asserted on both sides,
so the mock server in E01-F5 and this real API cannot drift once both
exist.

**E01-F5 API contract and mock server**
`parent: E01 | band: GREEN | discipline: Backend | depends on: none | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-14`

A written request and response contract for every endpoint in E01-F4, plus
a mock server that answers it, built in `packages/contracts`. This exists
because of the capacity shape rather than because contracts are tidy: with
one iOS engineer and one backend engineer, whoever finishes first waits on
the other. A mock server means iOS codes against a stub in sprint 1 and QA
writes API-level tests before the real API exists. Build it before the
endpoints, not after.

Register 10b lists this spike's artifact, the mock-to-real contract drift
guard, as specified but not built: it is an acceptance criterion on the
foundation deliverable with no code behind it yet, because the code that
would need it does not exist. This feature is where it gets built.

**Backend**  `packages/contracts` holds the schema for every endpoint in
E01-F4. The mock server answers against that same schema, not a hand-rolled
copy.
**QE (draft)**  Contract tests asserted against `packages/contracts` on
both the mock server and, once E01-F4 ships, the real API, so the two
cannot drift. This is the tier-2 obligation for the whole backlog. Any
feature crossing the app/backend boundary carries it, and this feature is
where the conformance check that runs when the real API lands gets
written.

**E01-F6 Media storage and delivery**
`parent: E01 | band: GREEN | discipline: AWS | depends on: E01-F2 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-13`

S3 for artwork with presigned PUT on submit and short-lived signed CDN URLs
on read over a private bucket, thumbnails generated on upload (register
2.5). The POC put images in database text columns; at wall-grid scale that
is the first thing to fall over, so the rebuild starts with the bucket.
Retention and thumbnail sizes are set here because the wall grid in E05
reads thumbnails only, never originals.

**Backend**  `effects/` owns the S3 presign and the thumbnail generation
trigger. The client media port has no URL-building method. Reads return
server-issued signed URLs, never a client-constructed one.
**QE (draft)**  Contract tests against `packages/contracts` for the presign
response shape, both sides. Integration test: an uploaded original produces
a thumbnail before the wall grid's read path can reach it.

**E01-F7 Deploy automation**
`parent: E01 | band: GREEN | discipline: Platform | depends on: E01-F2 | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-14`

One command, or one merge, deploys the stack to an environment. The
previous proposal here was Bitbucket Pipelines, "because the code already
lives in Bitbucket." That is stale. Register 9.6 puts the repository and
CI/CD on the client's GitHub org, decided 2026-08-27 and confirmed with the
client, and the repo has since moved. The real pipeline shape is in
`ci-cd.md`: GitHub Actions, AWS auth through GitHub OIDC role assumption
with no stored keys, the backend container tagged with the commit sha and
pushed to ECR, database migrations as an explicit gated step that never
runs on service start, then deploy, then a smoke check against `/health`.
This is the same decision as E07-F2 seen from the server side, made once
here.

**Backend**  Main-branch pipeline: install, typecheck, lint, test, web
export, backend container build, tag with commit sha, push to ECR, run
migrations (gated), deploy, smoke-check `/health`.
**QE (draft)**  Integration test: a migration run twice is idempotent.
Pipeline test: a deploy to staging with a failing `/health` check does not
promote, and rolls back to the previous known-good tagged image.

**E01-F8 Baseline observability**
`parent: E01 | band: GREEN | discipline: Platform | depends on: E01-F4 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-14`

Structured request logging, one log group per environment, and alarms on
error rate and service health, per register 6.4, which decided this floor
deliberately rather than by omission. `service-seams.md` confirms
real-user monitoring is out of scope for this phase (2026-08-31) and that
6.4 stands unamended. The richer observability stack in the future-state
docs, managed Prometheus, managed Grafana, X-Ray, is the scale-up target
for a multi-region build and is not in this epic; building it now would be
infrastructure nobody has asked for. This scope was confirmed in the
2026-08-20 walkthrough (00:19:35).

**Backend**  One log group per environment, structured JSON request logs,
a dashboard and alarms on API error rate and service health for the
container from E01-F4.
**QE (draft)**  Integration test: a forced 5xx response trips the error
rate alarm within its evaluation window. Unit test on the log formatter in
`lib/` for the structured shape.

**E01-F9 App shell, routing and the single brand theme**
`parent: E01 | band: GREEN | discipline: iOS | depends on: none | blocked by: Q1, Q3, Q4 | status: Next | size: 5 iOS-days | carries forward: RE-01`

A React Native app with the full route graph reachable, one theme, and
error states that never leave a blank screen. One theme, not four: the POC
carries four runtime themes and none of them match the client's deck, so
the rebuild starts from the deck values (`#1D1A34` ink, `#D51668` magenta,
`#F8F8FA` surface, Nunito and Prompt) recorded in the POC realignment plan
section 1. Three design values are still open and cheap to change now,
expensive to change everywhere later: the canvas surface color (Q1),
whether the splash animates (Q3), and the muted text value (Q4). Session
hydration is the four-state discriminated union from register 5.4,
restoring, locked, authenticated, anonymous, and no component reaches a raw
token; tokens stay inside the auth adapter and HTTP client.

**Frontend**  `app/` holds thin routes only. Shell chrome is a
`ScreenHeader` and bottom nav around every route. Each route group carries
an error boundary so a thrown error never leaves a blank screen; the
not-found route is the one screen page for that behavior, a themed ghost
icon, a heading, one line of body copy, and a single Back to Today button
in a centered card with no header chrome.
**Backend**  None for the shell or the not-found route, which is a
client-only route guard with no journey pointed at it.
**Reads/writes**  Reads the session union on every route mount to decide
chrome and gating. The not-found route reads only the active theme color
for its icon and writes nothing; its one control does `router.replace`
back to the root route.
**QE (draft)**  Unit tests on the session-union selectors in `lib/`,
near-full coverage, since every route depends on them. Component test: a
route that throws renders its error boundary's fallback, not a blank
screen. Happy path: a broken or stale link resolves to the not-found route,
and tapping Back to Today returns to root.

Source: [not-found screen page](/prototype/screens/not-found)

## E02 Auth and onboarding

`id: E02 | band: GREEN | board item: "Auth plus onboarding" | discipline: iOS and Backend | jira: SCRIBL Epic`

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

**E02-F1 Email and password accounts**
`parent: E02 | band: GREEN | discipline: Backend | depends on: E01-F3 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-02`

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

Source: [sign-up screen page](/prototype/screens/sign-up)

**E02-F2 Token issuance and native secure storage**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E02-F1 | blocked by: none | status: Next | size: 3 iOS-days | carries forward: RE-02`

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

Source: [root/today screen page](/prototype/screens/root-today), [sign-up screen page](/prototype/screens/sign-up)

**E02-F3 Invite token backend**
`parent: E02 | band: GREEN | discipline: Backend | depends on: E01-F3 | blocked by: Q8 | status: Blocked | size: 3 backend-days | carries forward: RE-07`

Create an invite for a wall, resolve a token to inviter, wall and prompt, and
expire it. This carries "Matthew has invited you" and "a prompt Matthew
chose for you" into onboarding, and it is the reason the flow feels personal
at all. Q8 is open on whether the client funds this plus the small hosted
landing page the invite link needs; if not, the fallback is a typed invite
code, cheaper and less personal. The POC's invite is theater: no email
leaves the device (`src/lib/simulatedInvites.ts`), so this is new backend
work, not a rebuild of something that already sends mail.

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

Source: [create-wall screen page](/prototype/screens/create-wall), [invite screen page](/prototype/screens/invite-id)

**E02-F4 Guided onboarding, screens 1 to 8**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E01-F9, E02-F2 | blocked by: Q10, Q11 | status: Next | size: 5 iOS-days | carries forward: RE-02`

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
being a live sticky and named new design work (Q11). Eric's 2026-08-25
screen feedback adds two more open questions, whether the post-signin Home
and Profile buttons should skip the daily prompt, and whether the login and
intro screens want animation; see
`knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`. All four stay
open here.

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

Source: [splash screen page](/prototype/screens/splash), [welcome screen page](/prototype/screens/onboarding-welcome), [prompt intro screen page](/prototype/screens/onboarding-prompt-intro), [canvas screen page](/prototype/screens/onboarding-canvas), [story screen page](/prototype/screens/onboarding-story), [walls screen page](/prototype/screens/onboarding-walls), [ready screen page](/prototype/screens/onboarding-ready)

**E02-F5 Invite redemption and the invite-code fallback**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E02-F3, E02-F4 | blocked by: Q8, Q9 | status: Blocked | size: 3 iOS-days | carries forward: RE-07`

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

Source: [home screen page](/prototype/screens/home), [invite screen page](/prototype/screens/invite-id)

**E02-F6 Account deletion and data export**
`parent: E02 | band: GREEN | discipline: Backend | depends on: E02-F1 | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-12`

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

**E02-F7 Draw your own avatar and save it to the profile**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E04-F1, E04-F2 | blocked by: none | status: Next | size: not sized`

Reuse the drawing canvas to draw an avatar, crop it to the profile circle,
and save it on the user record. The POC's canvas is bigger than the circle
it crops to, so a person can draw outside the visible guide and lose that
work; the rebuild sizes the canvas to the crop instead of clipping after the
fact. The POC also crops correctly only on web: `squareAvatarDataUri` is a
no-op on native (`src/lib/image.ts:15-22`), so a native save today PATCHes
the full uncropped export.

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

Source: [avatar screen page](/prototype/screens/avatar)

**E02-F8 Reach an invite from outside the app**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E02-F3, E02-F5 | blocked by: Q8 | status: Blocked | size: not sized`

The only route to the invite screen today is a wall row inside the
signed-in app, so accepting an invite needs an account you already have.
This builds the out-of-app half: the invite email, the hosted landing page,
and the link into the accept screen. PR 63's finding holds against the
source: the transport under the button is a single-device AsyncStorage
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

Source: [invite screen page](/prototype/screens/invite-id)

**E02-F9 Decline an invite from the accept screen**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E02-F5 | blocked by: none | status: Next | size: not sized`

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

Source: [invite screen page](/prototype/screens/invite-id)

**E02-F10 Resolve what the story fork screen looks like without record**
`parent: E02 | band: GREEN | discipline: Product | depends on: E02-F4, E04-F3 | blocked by: Q18 | status: Blocked | size: not sized`

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

Source: [story-select screen page](/prototype/screens/onboarding-story-select)

**E02-F11 Account and profile settings screen**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E02-F1 | blocked by: none | status: Next | size: not sized`

The settings hub edits display name and email, launches the avatar canvas,
holds the theme toggle, lists the walls, and signs out. No prior feature
covered it, and it is also where the App Store required account deletion
from E02-F6 needs a surface.

Two things on this screen are decisions, not build. Dark mode is local-only
and never round-trips (`src/stores/useThemeStore.ts:113-124`) while name
and email do round-trip, with no visual cue distinguishing the two; E01-F9
also rules for one theme rather than four, which this toggle contradicts
until that is settled. This screen is also the sole door into the member
roster at `/wall/[id]/members`.

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

Source: [settings screen page](/prototype/screens/settings)

**E02-F12 Self-only profile update endpoint**
`parent: E02 | band: GREEN | discipline: Backend | depends on: E02-F1 | blocked by: none | status: Next | size: not sized`

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

Source: [settings screen page](/prototype/screens/settings)

**E02-F13 Change a password from settings**
`parent: E02 | band: GREEN | discipline: Backend | depends on: E02-F1 | blocked by: none | status: Next | size: not sized`

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

Source: [settings screen page](/prototype/screens/settings)

**E02-F14 Decide the fate of the on-device account switcher and the onboarding-replay toggle**
`parent: E02 | band: GRAY | discipline: Product | depends on: none | blocked by: none | status: Next | size: not sized`

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

Source: [sign-up screen page](/prototype/screens/sign-up)

**E02-F15 Persist the onboarding step and resume there on relaunch**
`parent: E02 | band: GREEN | discipline: iOS | depends on: E02-F4 | blocked by: none | status: Next | size: not sized`

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

Source: [splash screen page](/prototype/screens/splash)

## E03 Daily prompt

`id: E03 | band: GREEN | board item: "Daily prompt (Claude)" | discipline: Backend and iOS | jira: SCRIBL Epic`

One prompt a day, the same for everyone, that the app can never edit. Everything
else in the product hangs off it, which is why a day without a prompt is an
outage rather than a bug.

**The board's own wording needs a note.** The board sticky says "Daily prompt
(Claude)". The kickoff two hours earlier decided the opposite: prompts stay
curated by Scribl's program team of mental-health professionals and educators,
with Claude scoped to drafting suggestions for their review, because Eric Rice's
words were "our entire modality is based on these prompts and making sure that
we have final say and a hand in them". No runtime prompt-generation pipeline was
ever built. Prompts have always been an admin-curated set, seeded into the
database and resolved by date. The pipeline that was built and then disabled is
the AI background enhancement, behind the `EXPO_PUBLIC_AI_ENABLED` flag and off
by default, which is what the walkthrough names at 00:47:45. So the board
sticky and the client decision disagree, and the client decision wins. This epic
ships a seeded curated set on the same fetch contract runtime generation would
use later, plus a Claude drafting tool the client's editors operate. Nobody
should read the board sticky as authorization to generate prompts at runtime.

**E03-F1 Seeded prompt set and fetch contract**
`parent: E03 | band: GREEN | discipline: Backend | depends on: E01-F3, E01-F4 | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-03`

A curated set loaded into the database, one prompt resolved per calendar day
per timezone, served on a contract that does not change if generation ever
moves server-side. A rotating fallback so a scheduling failure never leaves a
day blank. Day resolution is pure date arithmetic and belongs in
`lib/prompt-day.ts` (`architecture.md` section 4 names that file as the
worked example of a pure module), with the clock injected per
`engineering-standards.md` section 4 rather than read from the system clock.
The onboarding intro screen shares this same fetch, gated to fire once per
session, with an invite override layered on top.

**Frontend**  Onboarding prompt-intro card shows a loading spinner until the
prompt resolves, then enables Let's Scribl once text is present; invite
context can substitute a personalized prompt over the fetched one.
**Backend**  `GET /prompt/today`, resolved by calendar day and timezone
against the seeded set, with a rotating fallback prompt if the day's row is
missing.
**Reads/writes**  Server-owned, cached in `data/` behind the typed API
client, not a Zustand store (register 5.1); the invite override is read
once and never written back.
**QE (draft)**  Tier 3 unit tests on `lib/prompt-day.ts` for day-boundary
resolution across timezones and a midnight-local rollover, with the clock
injected, near-full coverage. Tier 2 contract test on `packages/contracts`
for the prompt shape, asserted on both the backend route and the client.
Happy path: a signed-in session with a resolved prompt shows text and
enables the button. Edge: prompt fetch fails, a Try again control appears
in the card and the button stays disabled.

Source: [onboarding prompt-intro screen page](/prototype/screens/onboarding-prompt-intro)

**E03-F2 Today's prompt screen**
`parent: E03 | band: GREEN | discipline: iOS | depends on: E01-F9, E03-F1 | blocked by: none | status: Next | size: 2 iOS-days | carries forward: RE-03`

The prompt card, the "Let's Scribl" call to action, and defined loading,
empty and unavailable states. This is the app's root screen and the first
thing every returning person sees, so a blank on a cold network reads as a
broken app. The streak tile on this same screen is E11-F2, which is ORANGE
and blocked on Q12 and Q6, so a GREEN root screen currently depends on an
ORANGE feature for one of its tiles. That sequencing gap is worth resolving
before sprint 1, not papered over with a placeholder.

**Frontend**  ScreenHeader and bottom nav around a date badge, prompt text,
live countdown tile, and streak tile; the primary button label swaps between
Open the canvas and Draw another by today's submit status. A bare loading
spinner covers the body until auth hydration resolves, and a retry control
appears if the prompt load fails. The draw route builds the DrawPad canvas
with color swatches, undo and trash, an elapsed-time chip, and a Done button
disabled with an explanatory label when the unpinned prompt fetch fails.
**Backend**  Serves today's prompt and the user's stats for a computed
streak, gated behind an authenticated user so neither request fires before
auth resolves. The draw route's unpinned path calls the same prompt read;
the pinned deep-link path carries its prompt in route params and calls
nothing.
**Reads/writes**  Reads auth hydration state, current user, the prompt
cache, and the streak cache from `data/`, all server-owned per register
5.1, not client stores. Writes nothing on this screen; finishing a drawing
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

Source: [daily prompt screen page](/prototype/screens/root-today), [draw screen page](/prototype/screens/draw)

**E03-F3 Submitted-state read**
`parent: E03 | band: GREEN | discipline: Backend | depends on: E03-F1 | blocked by: none | status: Next | size: 1 backend-day | carries forward: RE-03`

Has this caller already submitted for today's prompt. One read, called on
every launch, so it needs an indexed lookup rather than a scan of
submissions. It shares its definition of "today" with E03-F1's day
resolution in `lib/prompt-day.ts` and with what E04-F5 enforces at write
time, and all three have to agree or a submission can land on the wrong
side of midnight.

**Frontend**  Feeds the root screen's primary button label, which reads
Open the canvas when the day is unsubmitted and Draw another once it is.
**Backend**  An indexed submitted-state read keyed by user and calendar
day, sharing the day-boundary logic in `lib/prompt-day.ts` with E03-F1 and
the submit-to-unlock check in E04-F5 (register 4.1).
**Reads/writes**  Server-owned, read into `data/` alongside the prompt and
streak caches on root-screen mount; writes nothing.
**QE (draft)**  Tier 3 unit test on the shared day-boundary function
covering a submission made just before and just after local midnight.
Tier 4 integration test against a real local Postgres for the indexed
lookup, not mocked SQL. Happy path: an unsubmitted day renders Open the
canvas; a submitted day renders Draw another.

Source: [daily prompt screen page](/prototype/screens/root-today)

**E03-F4 Claude-assisted prompt drafting for editorial review**
`parent: E03 | band: GREEN | discipline: Backend | depends on: E03-F1 | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-F3`

A batch tool that drafts candidate prompts for Scribl's editors to accept,
edit or reject, writing only accepted prompts into E03-F1's seeded set.
This is the honest reading of "(Claude)" on the board sticky, and register
section 10 is explicit that runtime prompt generation was never built and
is not wanted: prompts stay curated by the client's program team, seeded
and resolved by date. Claude drafts, an editor decides, nothing reaches a
person unapproved. This feature never runs on the runtime read path and
must not grow one; ADR-0011 puts prompt generation on the Opus tier, and
at roughly a few hundred candidates a month the model cost is negligible.

**Backend**  An offline batch job that calls Claude to draft candidate
prompt text, writes candidates to an editorial review table, and on
editor approval inserts the accepted row into the same seeded-set table
E03-F1 reads. No route on the prompt read path calls a model.
**QE (draft)**  Tier 1 invariant test asserting the runtime `GET
/prompt/today` path cannot import or call the drafting job or any model
client, written before the batch tool. Happy path: an editor-approved
draft appears in the seeded set on the next resolved day. Edge: a
rejected draft never reaches the seeded set and a partial batch failure
leaves no half-written candidate rows.

**E03-F5 Local daily reminder**
`parent: E03 | band: GREEN | discipline: iOS | depends on: E03-F2 | blocked by: none | status: Next | size: 1 iOS-day | carries forward: RE-03`

An on-device scheduled notification for the daily prompt, no server
involved. This is the bridge that keeps the habit loop alive if E09 loses
its capacity fight, and it costs one day against E09's several days. It is
not a substitute for managed push, because it cannot react to anything
happening on a wall, only to the local clock.

**Backend**  None; this is a client-only Expo local-notification schedule
tied to the resolved prompt day from `lib/prompt-day.ts`, rescheduled on
timezone change.
**QE (draft)**  Tier 3 unit test on the schedule calculation with the
clock injected, covering a timezone change between scheduling and firing.
Happy path: the notification fires once at the configured local time on a
day with a resolved prompt. Edge: a timezone change after scheduling
reschedules rather than firing at the old offset.

**E03-F6 Give today's prompt a close time and count down to it**
`parent: E03 | band: GREEN | discipline: Backend | depends on: E03-F1 | blocked by: none | status: Next | size: not sized`

The root screen runs a live countdown to the prompt's close, but E03-F1's
fetch contract defines only one prompt per calendar day and never names a
close time. That is a `packages/contracts` change, not a UI add: the
contract needs a close timestamp field, and both the backend route and the
client have to agree on it before the countdown tile can render a real
number instead of a guess.

**Frontend**  The countdown tile on the root screen ticks down to the
close timestamp; a bare loading spinner covers the body until it and the
prompt both resolve.
**Backend**  Adds a close-timestamp field to the `GET /prompt/today`
contract in `packages/contracts`, computed alongside the resolved prompt
by the same day-boundary logic in `lib/prompt-day.ts`.
**Reads/writes**  Server-owned, read into the same prompt cache in
`data/` E03-F1 populates; writes nothing.
**QE (draft)**  Tier 2 contract test asserted on both sides, that the
close timestamp is present and matches the resolved day's boundary. Tier 3
unit test on the close-time calculation with the clock injected across a
timezone change. Happy path: the tile counts down and reaches zero at the
contract's close timestamp. Edge: a client on a different timezone from
the server still counts down to the same instant.

Source: [daily prompt screen page](/prototype/screens/root-today)

**E03-F7 Prompt pack catalog and per-wall prompt injection**
`parent: E03 | band: GREEN | discipline: Backend | depends on: E03-F1, E05-F1 | blocked by: none | status: Next | size: not sized`

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
**Backend**  A prompt-pack catalog listing endpoint, read-only until a
pack is opened; the wall-scoped write for an injected or custom prompt
belongs to E03-F8 and E03-F9.
**Reads/writes**  Server-owned pack catalog, read into `data/`; nothing
written from the catalog list itself.
**QE (draft)**  Tier 1 invariant question, undecided until the policy
call lands: does a wall-scoped prompt bypass editorial review, and if so
does register 5.1's server-owned/client-owned split still hold for a
wall's local prompt set. Happy path: the catalog loads and lists packs
with counts. Edge: the catalog fails to load and the retry control
appears instead of an empty list.

Source: [prompt packs screen page](/prototype/screens/wall-id-prompt-packs)

**E03-F8 Author a custom prompt for one wall**
`parent: E03 | band: GREEN | discipline: iOS | depends on: E03-F7 | blocked by: none | status: Next | size: not sized`

A wall creator types their own prompt and it goes live on that wall with
no editorial review. This contradicts E03's curated-only premise on
record from the kickoff, so it needs a policy call before a build, not
after. Whether a wall creator gets an unreviewed prompt path at all is
undecided; do not build past the catalog and text-entry UI until that call
lands.

**Frontend**  A custom-prompt card with a text area, character counter,
and a submit button disabled until text is entered, above the E03-F7 pack
list.
**Backend**  A wall-scoped endpoint to persist a custom prompt against the
caller's own wall id, guarded by wall membership authorization.
**Reads/writes**  A successful submit writes a new prompt row scoped to
the wall and bounces back to the family screen with the wall in context;
nothing is written on entry.
**QE (draft)**  Happy path: typing a custom prompt and submitting adds it
to the wall and returns to the wall view. Edge: an empty or whitespace-only
prompt keeps submit disabled. Undecided and blocking: whether this write
path needs an editorial gate before ship, per the E03 curated-prompt
premise; no test tier can close that until the policy call does.

Source: [prompt packs screen page](/prototype/screens/wall-id-prompt-packs)

**E03-F9 Pick prompts from a pack and add them to a wall**
`parent: E03 | band: GREEN | discipline: iOS | depends on: E03-F7 | blocked by: none | status: Next | size: not sized`

The pack-detail picker where a creator selects up to five prompts and
they persist to the wall. The cap of five needs ratifying; selecting a
sixth prompt is currently a silent client-side no-op with no message,
which is a UX defect independent of the cap's value.

**Frontend**  A per-pack prompt list with a per-row check mark, a running
selected count in the header, and a submit button pinned to the bottom
that appears once at least one prompt is picked.
**Backend**  A pack-detail endpoint keyed by pack id, and a wall-scoped
write that persists the chosen prompt ids, guarded against a non-creator
caller or a bad pack or prompt id.
**Reads/writes**  Pack detail is server-owned and read into `data/` on
mount; a successful submit writes the chosen prompt ids to the wall and
replaces the route to the family screen, blocking back navigation into the
picker on success.
**QE (draft)**  Happy path: selecting up to five prompts and submitting
adds them to the wall and returns to the wall view. Edge: selecting a
sixth prompt while five are already picked must give a visible signal
instead of the current silent no-op, once the cap is ratified; a
non-creator caller or an invalid pack or prompt id is rejected server-side
per register 4.2's authorization choke point.

Source: [prompt pack detail screen page](/prototype/screens/wall-id-prompt-packs-packid)

## E04 Drawing and submit, with submit-to-unlock

`id: E04 | band: GREEN | board item: "Drawing plus submit, with submit-to-unlock" | discipline: iOS and Backend | jira: SCRIBL Epic`

The thing people actually do. Draw with a deliberately small set of tools, add
a story in text, submit, and only then get to see what anyone else made. The
constraint is the feature: one brush and eight colors, per E04-F1, means
nobody opens the app and feels unqualified, and the client's own frames are
stricter than our POC was.

Submit-to-unlock is not UI. Register 4.1 puts it at the data layer as a
transactional existence check on (user, prompt), returning 403 on a channel
read until a submission row exists, precisely so no client bug and no direct
API call can bypass it. Register 4.3 and `feature-flags.md` section 2 hold the
same line from the flag side: neither invariant is reachable from
configuration, and a standing test asserts `backend/src/authz/` never imports
the flag client. Treat a bypass as a defect of the same severity as a privacy
leak. E04-F5 owns the bypass test itself, written before the feature it
guards (`engineering-standards.md` section 4, tier 1, a launch gate).

Register 2.6 is the other decision that shapes this epic: every submission
stores a versioned stroke document and a render, strokes are the source of
truth, and this cannot be added retroactively. E04-F2 carries the detail.

**E04-F1 Skia canvas with one brush and the client's eight colors**
`parent: E04 | band: GREEN | discipline: iOS | depends on: E01-F9 | blocked by: none | status: Next | size: 5 iOS-days | carries forward: RE-04`

React Native Skia canvas (ADR-0006). The client's tool set is one brush at a
single weight, eight colors, undo, erase, and a trash control. No brush-size
row, no fill tool, no brush styles, no layers. Register 2.6 describes the
shipped tool set as "one brush, six inks", written before the client's final
palette call; this feature is the eight-color version that supersedes that
number, and the register should be read against this body, not the other way
round.

The eight colors, client order, deliberately not ROYGBIV: `#db0632` red,
`#f58c29` orange, `#ffd93b` yellow, `#afd129` light green, `#1d864a` dark
green, `#99d9d9` light blue, `#20145f` dark blue, `#d51668` magenta, the last
being the brand magenta exactly. Erase carries the same weight as the brush
and can read as a white swatch, matching the POC. Per-wall narrowing of the
palette is data through `allowedColors`, not a code path; this is the seam
E18-F1 (retired 2026-09-01) would have used and E04-F1 now owns outright, per
the `draw` and `onboarding-canvas` map notes. `packages/contracts/constants`
holds the ink set, brush size and channel kinds so app and backend agree
(contract-test tier 2).

Open, does not block build: the drawing area's bounding box wants a firmer
definition, and swatch order and layout are unsettled. History of the earlier
four-size, six-ink frame lives in the 2026-08-25 client feedback record and
does not belong here.

**Frontend**  DrawPad canvas, eight-swatch row, undo, trash-to-clear-confirm,
elapsed-time chip on `draw`; circular guide mask and full palette on `avatar`;
reduced onboarding palette with a Try again control on prompt-fetch failure
on `onboarding-canvas`.
**Backend**  `draw` needs `GET /prompt/today` for the unpinned path only; a
pinned deep link carries its prompt in route params. `avatar` needs a
self-only `PATCH` on the user record accepting the cropped image.
**Reads/writes**  Finishing writes image, prompt id, strokes, and pinned
channel id to the shared draft store (`draw`, `onboarding-canvas`); nothing
posts to the server from the canvas itself. `squareAvatarDataUri` is a no-op
on native (`src/lib/image.ts:15-22`), so a native avatar save PATCHes the
full uncropped export, not the cropped circle.
**QE (draft)**  Unit tests in `lib/` on stroke and crop math (tier 3).
Component test: Done stays disabled with an explanatory label when the
unpinned prompt fetch fails. Component test: an unauthenticated visitor is
redirected to sign-up before the canvas renders. Fix the native crop no-op
before writing its regression test, since the bug and the test are the same
finding.

Source: [draw screen page](/prototype/screens/draw), [avatar screen
page](/prototype/screens/avatar), [onboarding canvas screen
page](/prototype/screens/onboarding-canvas)

**E04-F2 Stroke serialization and artwork capture**
`parent: E04 | band: GREEN | discipline: iOS | depends on: E04-F1 | blocked by: none | status: Next | size: 2 iOS-days | carries forward: RE-04`

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
reactions attach to it. Stroke geometry lives in `lib/` as pure functions
(register 5.2), kept apart from the render loop, so this is unit-test
territory with near-full coverage (tier 3), not component-test territory.

**Backend**  no endpoint of its own; the stroke document and the render
travel with the submit call in E04-F4 and land through the object-storage
path in register 2.5, never as a database text column.
**Reads/writes**  writes the versioned stroke document, the render, and the
thumbnail alongside the submission; a later edit writes a new revision, the
submission pointer moves, the prior revision stays addressable.
**QE (draft)**  Unit tests on stroke serialization and coordinate
normalization in `lib/`, tier 3, near-full coverage. Integration test: an
edit creates a new revision row rather than mutating the existing one.
Contract test: the stroke document schema version round-trips through
`packages/contracts`, tier 2.

Source: [draw screen page](/prototype/screens/draw), [avatar screen
page](/prototype/screens/avatar), [onboarding canvas screen
page](/prototype/screens/onboarding-canvas)

**E04-F3 Story input at 280 characters**
`parent: E04 | band: GREEN | discipline: iOS | depends on: E04-F1 | blocked by: Q18 | status: Next | size: 2 iOS-days | carries forward: RE-05`

After the drawing, a story: a write-or-record fork and a 280 character cap,
`STORY_CHAR_LIMIT` per `architecture.md`'s naming table, a shared constant so
app and backend agree. The POC caps captions at 80; take the client's 280.
Record is the gated half. The client's frames put a record card on both the
onboarding story step and the daily loop, and the client's own kickoff board
cut voice memos from the MLP (Q18). Ship the write path only. Leave the
record button out until the client reconciles frames against board; do not
build the pipeline silently to get ahead of that answer. The pipeline itself
is fully specified and parked as E18-F3. Undecided: Q18, the record button,
is not this feature's call to make.

The POC ships the record card on every platform already, on
`story-select`, `onboarding-story-select`, and `record` (the last two also
scoped under E18-F3 and E18-F6). That is a gap between the shipped app and
this feature's write-only scope, not a second feature.

**Frontend**  drawing preview card, 280-char capped input with a live
counter and clear control, Share Your Story / Continue button, on
`onboarding-story` and `write`; a typed-story choice card without a
recording alternative, on `story-select` and `onboarding-story-select` once
Q18 resolves to write-only.
**Backend**  none of these screens call an endpoint; caption is local state
until the submit call in E04-F4 carries it.
**Reads/writes**  each screen guards entry on the draft store's `imageRef`
and bounces to the canvas if missing; on exit the caption writes into the
draft store and any leftover voice-note fields clear.
**QE (draft)**  Component test: entry with no draft image bounces to the
drawing screen instead of rendering the caption field. Unit test in `lib/`
on the char-limit boundary against `STORY_CHAR_LIMIT`. Undecided until Q18:
whether the record card renders at all; do not write its test until the
card's fate is decided.

Source: [story-select screen page](/prototype/screens/story-select), [write
screen page](/prototype/screens/write)

**E04-F4 Submit endpoint and presigned upload**
`parent: E04 | band: GREEN | discipline: Backend | depends on: E01-F4, E01-F6 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-06`

One submit call: writes the submission row, fans out through the join table
to every chosen wall (register 2.4, one submission, several walls, one
image), and returns a presigned PUT so artwork bytes go straight to object
storage rather than through the API service (register 2.5). Base64 in a
JSON body pins payload size to a gateway limit; that pattern belongs to the
Lambda-and-API-Gateway design register 2.1 superseded, not to the
long-running container this backend actually is, so it is dropped rather
than replaced with a container-shaped equivalent of the same mistake. An
authorization check happens before any URL is signed (register 2.5).

**Frontend**  `choose-channels` and `onboarding-walls`: multi-select wall
list, disabled-until-checked submit button, inline error that preserves the
picker's selections on failure.
**Backend**  `POST /submit` in `routes/`, validating prompt id, channel ids,
and caption-or-audio (never both) before delegating; `services/` writes the
submission and the fan-out rows; `repositories/` holds the parameterized SQL.
No presigned-URL signing without the authorization check running first.
**Reads/writes**  reads the draft (image ref, prompt id, strokes, caption
or audio ref) and the caller's wall list; on success clears the draft and
navigates home then to family; on failure keeps the picker populated for
retry.
**QE (draft)**  Contract test against `packages/contracts` for the submit
request and response shape, tier 2. Integration test against a real local
Postgres: the fan-out writes one row per selected wall, not one row per
wall times image copy. Component test: a failed submit preserves the
picker's prior selections and shows an inline error.

Source: [choose channels screen page](/prototype/screens/choose-channels),
[onboarding walls screen page](/prototype/screens/onboarding-walls)

**E04-F5 Submit-to-unlock at the data layer, with its bypass test**
`parent: E04 | band: GREEN | discipline: Backend | depends on: E04-F4, E03-F3 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-06`

The product's central promise (register 4.1): a person cannot read a wall
for a given prompt until their own submission exists, enforced as a
transactional existence check in `authz/`, not the UI, because the API is
public to anyone with a token. Register 4.3 and `feature-flags.md` section 2
say the same thing from opposite sides: this is not reachable from
configuration, not "on by default", not reachable from the flag system at
all, and a standing test asserts nothing under `backend/src/authz/` imports
the flag client. `engineering-standards.md` section 4 tier 1 calls the
bypass probe a launch gate written before the feature it guards.

This is the single most important QE block in E04. The regression test
calls the channel read directly with a valid token and no submission and
proves it gets a 403; that test is half the feature, not a follow-up to it.
It belongs in the release gate E06-F6 defines, not in a suite nobody blocks
a release on.

**Backend**  `authz/` gains the one existence check every wall read calls
through (register 4.2's single choke point); `repositories/` runs it inside
the same transaction as the read, not as a separate query the caller could
race.
**Reads/writes**  no new state; it gates every existing wall-read path on a
row already written by E04-F4's submit call.
**QE (draft)**  Invariant test, tier 1, launch gate, written first: a valid
token with no submission gets a 403 from the channel read, called directly,
not through the app. Invariant test: `backend/src/authz/` has no import of
the flag client. Integration test against real Postgres: the existence
check and the read happen in one transaction, so a submission written
concurrently with the read cannot race past the gate.

Source: [choose channels screen page](/prototype/screens/choose-channels)

**E04-F6 Canvas performance on the device matrix**
`parent: E04 | band: GREEN | discipline: iOS and QA | depends on: E04-F1 | blocked by: Q44, Q51 | status: Blocked | size: 2 iOS-days | carries forward: RE-04`

Drawing has to stay smooth under a fast scribble on the oldest device in
scope, not just the newest, which is what register 5.2 (strokes accumulate
outside the render cycle, commit to state when a stroke ends) exists to
make possible. Nobody has decided which iOS versions, which iPhone models,
or whether iPad is in scope; Scribl expects that recommendation from us
(Q44). iPad itself is deferred as of decision-register section 1.4, but if
it lands back in scope this is a layout pass across every E02 and E05
screen, not a line item here. Undecided: Q44 and Q51 (the device floor);
this feature has no definition of done until they resolve, and inventing a
device matrix to fill the gap would be worse than leaving it blocked.

**Backend**  none. This is a device and rendering budget question.
**QE (draft)**  Once Q44 and Q51 resolve: a performance test tier
(engineering-standards.md does not name a device-farm tier explicitly; this
is closest to component-behavior testing, run on the oldest device the
answer names) asserting frame time under a scripted fast-scribble input
stays under the agreed budget on that device, not the newest available one.

**E04-F7 Make submit safe to repeat**
`parent: E04 | band: GREEN | discipline: Backend | depends on: E04-F4 | blocked by: none | status: Next | size: not sized`

Submit is the only call that unlocks a wall, and it is not idempotent as
specified. The submission id is deterministic per user and per prompt,
which reads as an intended idempotency key that neither E04-F4 nor E04-F5
states as a requirement; the `choose-channels` map note is where this gap
surfaced. `engineering-standards.md` section 3 requires idempotency on
anything a mobile client retries: submit carries a key, two deliveries
create one row. Right now the client's only protection is a `submitting`
boolean disabling the button mid-flight, which does not cover a retried
request after a dropped response, an app restart mid-flight, or a second
device. The POC evidence pointer is `backend/lambda/handlers/submit.ts:84`,
worth naming because the path says `lambda`: register 2.1 moved this API to
a long-running container, so the fix lands in that container's `services/`
and `repositories/` layers, not in a Lambda handler.

**Backend**  the submit write becomes an upsert on the deterministic
submission id rather than a duplicate-key failure, in `repositories/`, so a
retried request returns the existing row's result instead of erroring.
**Reads/writes**  no new inputs; the same submit payload, written so a
second delivery of it is a no-op against the first.
**QE (draft)**  Invariant-adjacent integration test against real Postgres:
two concurrent submit calls with the same deterministic id create exactly
one row and both callers see the same result. Contract test, tier 2: the
submit response shape is identical on first delivery and on a retried
duplicate.

Source: [choose channels screen page](/prototype/screens/choose-channels)

**E04-F8 Leave a text-only reflection on a past day**
`parent: E04 | band: GREEN | discipline: Backend | depends on: E04-F4, E04-F5 | blocked by: none | status: Next | size: not sized`

The `family` wall accepts a text-only answer with no drawing on a locked
past day, through `ReflectionInput`, writing to the same `POST /submit`
endpoint the drawing flow uses. No feature states what a drawing-free
submission does to the unlock rule in E04-F5 or to a streak count: does a
text-only reflection satisfy submit-to-unlock for that prompt, or is it a
second, weaker write that leaves the wall still locked. Undecided; naming
it here rather than deciding it in the route handler.

**Backend**  `POST /submit` accepts a caption with no image and no strokes
for a past, already-locked day; `services/` needs an explicit rule for
whether this row counts toward the existence check in E04-F5, decided
before the endpoint accepts the shape, not inferred from what happens to
compile.
**Reads/writes**  writes a submission row with caption only, no image ref,
no stroke document, joined to the one wall the reflection was left on.
**QE (draft)**  Invariant test, tier 1: once the unlock question above is
answered, assert directly whether a text-only submission does or does not
satisfy the existence check for that prompt, so the answer is enforced
rather than incidental. Integration test against real Postgres: a
text-only submission on a locked past day does not retroactively unlock
that day for other members if the answer is "does not count".

Source: [family wall screen page](/prototype/screens/family)

**E04-F9 Clear the canvas behind a confirmation**
`parent: E04 | band: GREEN | discipline: iOS | depends on: E04-F1 | blocked by: none | status: Next | size: not sized`

The canvas ships a trash control behind its own confirm modal, a detail
E04-F1's tool list names but does not describe at the interaction level.
Clearing the canvas after the confirm resets the stroke document E04-F2
holds, not just the visible pixels, so an accepted clear cannot leave a
stale stroke list behind for a later Done to export.

**Frontend**  trash control opens a confirm modal on `onboarding-canvas`;
declining leaves the drawing untouched, confirming clears both the visible
canvas and the underlying stroke list.
**Backend**  none; purely client-side state.
**Reads/writes**  on confirm, clears the in-memory stroke accumulator
E04-F2's `lib/` functions hold, so nothing partial survives into the next
Done export.
**QE (draft)**  Component test: tapping trash shows the confirm modal
before anything clears. Component test: declining the modal leaves the
drawing intact. Unit test in `lib/`, tier 3: confirming clear resets the
stroke accumulator, not only the rendered surface.

Source: [onboarding canvas screen page](/prototype/screens/onboarding-canvas)

**E04-F10 Guard the create-flow screens on a missing draft**
`parent: E04 | band: GREEN | discipline: iOS | depends on: E04-F1 | blocked by: none | status: Next | size: not sized`

The four screens after the canvas, `story-select`, `write`, `record`, and
`choose-channels`, all bounce back to the canvas when no draft exists in
the draft store. One shared guard rather than four copies of the same
`imageRef` check means those routes have a single real entry point in
practice, and a fix to the guard's condition lands once. The current build
duplicates the check in at least `onboarding-story-select` on top of the
resume-time guard already in `onboardingFlow.ts`, which is exactly the
duplication this feature removes.

**Frontend**  extract the `imageRef`-missing redirect into one guard used
by every post-canvas route, replacing the per-screen copies.
**Backend**  none.
**Reads/writes**  reads only the draft store's `imageRef`; writes nothing.
**QE (draft)**  Unit test in `lib/` or a shared hook, tier 3: the guard
redirects to the canvas route when `imageRef` is absent and is a no-op when
present. Component test: each of the four post-canvas screens uses the
shared guard rather than a local copy, so a change to the guard's
condition is not something a future screen can silently skip.

Source: [story-select screen page](/prototype/screens/story-select)

## E05 Walls and channels

`id: E05 | band: GREEN | board item: "Walls plus channels" | discipline: iOS and Backend | jira: SCRIBL Epic`

Private walls that feel like a family fridge instead of a feed. Invitation
only, no discovery, no strangers, no followers, and a response posted to the
Family wall is invisible from the Friends wall. Register 4.2 makes that
isolation a single authorization module in `backend/src/authz/` that every
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

Reactions (E05-F6) carries `band: GREEN` inside this epic while the client
board treats it as an orange sticky; `epic-board-mapping.md` records the
disagreement rather than resolving it. Multi-channel posting (E05-F3) is not
the same act as E12's file-export sharing, keep those separate.

**E05-F1 Channel model and membership**
`parent: E05 | band: GREEN | discipline: Backend | depends on: E01-F3 | blocked by: Q29 | status: Blocked | size: 3 backend-days | carries forward: RE-07`

Channels with members, roles and an invitation-only join path, reusing the
resolve-or-create invitee pattern the POC already proved. How many fixed
channels ship, three or four, and whether coworkers is its own channel, stays
open on Q29 (register 10b: recommendation recorded, client confirmation
outstanding). The schema does not care about the number; the onboarding copy,
the share-to checklist and the dashboard list all do, so the answer is needed
before E02-F4 is built, not after.

**Frontend**  The create-wall form needs a wall-name input, an invite-by-email
input that parses comma, semicolon or space separated addresses, a Create
wall button disabled until the name is non-empty, and per-address error rows.
Membership itself has no screen of its own; the roster UI is E05-F10.

**Backend**  `services/` plus `repositories/` own wall create (returns a real
server id) and a per-address member-invite call the client fires once per
parsed address. Invite delivery is simulated, not a real send, per
`src/lib/simulatedInvites.ts` in the prototype; this feature must not be read
as already built. All membership reads route through `backend/src/authz/`,
the single choke point E05-F2 builds the regression gate for; this feature
owns the schema and the join rows that module authorizes against, not a
second check.

**Reads/writes**  Server data (wall rows, membership rows, invite rows) lives
in `data/` behind the typed client, never in a Zustand store (register 5.1).
A stale session at submit time signs the caller out to sign-up rather than
silently failing.

**QE (draft)**  Happy path: a valid name and submit creates the wall and
returns home. Edge: one bad address in a batch errors only that row while the
wall still creates. Edge: a stale session at submit time signs out to
sign-up instead of showing a false success. Contract test against
`packages/contracts` for the wall-create and member-invite shapes, since this
is the first client/server boundary crossing in the epic.

Source: [create-wall screen page](/prototype/screens/create-wall), [invite
screen page](/prototype/screens/invite-id), [onboarding walls screen
page](/prototype/screens/onboarding-walls), [wall members screen
page](/prototype/screens/wall-id-members)

**E05-F2 Server-side channel isolation and its regression gate**
`parent: E05 | band: GREEN | discipline: Backend | depends on: E05-F1 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-07`

The launch gate for register 4.2. Every wall read authorizes on membership of
that specific wall, through one authorization module in `backend/src/authz/`
and nowhere else, per `architecture.md` section 2: `routes/` may call
`authz/` but never reaches `repositories/` directly. Row-level security in
Postgres sits behind it as defence in depth, and block relationships are
enforced in the same module. A leak between two walls is a privacy incident,
not a display bug, which is why one choke point everyone calls is the
requirement rather than a per-handler check repeated thirteen times across
this epic. The coupling every read-path feature in E05 has to this module is
deliberate (register 4.2's own trade-off line).

**Backend**  `authz/` exposes the membership and block check that
`services/` calls before any repository read. `repositories/` holds the SQL,
parameterized, nothing else does. Register 4.3 and `feature-flags.md` section
2: this module is not reachable from the flag system at all, and CI carries a
dependency-cruiser rule (`architecture.md` section 8.2) asserting no module
under `backend/src/authz/` imports the flag client.

**QE (draft)**  This is a tier-1 invariant test per `engineering-standards.md`
section 4, written before the read-path features that depend on it: a member
of wall A cannot read wall B by any route, including a direct API call with a
valid token. A second invariant test asserts the import-boundary rule itself.
Both are launch gates, not regression coverage added after the fact. Every
other read-path feature in this epic, E05-F4 grid, F5 dashboard, F6
reactions, cross-references this gate instead of repeating it.

**E05-F3 Multi-channel share on submit**
`parent: E05 | band: GREEN | discipline: Backend and iOS | depends on: E04-F4, E05-F1 | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-07`

Pick which walls today's response goes to, on the same screen as the story,
per the client's frames. This is not the "sharing personal" sticky:
`epic-board-mapping.md` is explicit that posting one submission to several
walls is a different act from producing a file and sending it elsewhere,
which is E12, not this feature.

**Frontend**  A SHARE TO header over a multi-select wall list, a Submit and
unlock the wall button disabled until at least one wall is checked, and an
inline error that does not clear the selection on failure. A pinned-prompt
deep link skips the list for a one-wall confirmation view instead.

**Backend**  Register 2.4: a `submission_channels` join table, snake_case
plural, all SQL in `repositories/`, parameterized. Sharing to three walls
writes three join rows, never three copies of the artwork; deleting the
submission removes it everywhere in one operation. The submit endpoint
validates prompt id and channel ids, rejects text and audio together, and
its write is the row E04's unlock check depends on. Every read of these
walls still passes through the single `authz/` module E05-F2 gates, this
feature only adds the write side of the join.

**Reads/writes**  The draft (image ref, prompt id, caption, strokes) lives in
a client store per register 5.1's client-state boundary; on success it
clears and the app resets navigation to home then family. On failure the
picker state holds so the person can retry, an inline error rather than a
blank screen (`engineering-standards.md` section 3).

**QE (draft)**  Happy path: one or more walls checked, submit succeeds, lands
on family unlocked. Edge: no draft image on entry redirects to draw instead
of showing the picker. Edge: submit failure keeps prior selections and shows
inline error. Contract test on the submit endpoint's channel-ids shape
against `packages/contracts`. Integration test on the join-table write
against a real local Postgres, not mocked SQL.

Source: [choose-channels screen page](/prototype/screens/choose-channels),
[onboarding walls screen page](/prototype/screens/onboarding-walls)

**E05-F4 Wall grid and response detail**
`parent: E05 | band: GREEN | discipline: iOS | depends on: E01-F9, E05-F2 | blocked by: none | status: Next | size: 4 iOS-days | carries forward: RE-07`

The two-column rounded tile grid, scrollable back through previous days, plus
a detail view with the drawing, the story and the reaction affordances. This
is the payoff screen for the whole loop and the one place pixel fidelity to
the client's design is worth the extra half day. Eric's 2026-08-25 feedback
(`knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`) flags this
area, his screens 11 and 16, as the least internally discussed; he plans to
review with his team before the workshop and wants alignment confirmed, not
assumed.

**Frontend**  Response grid with member tiles and a roster strip, a
locked-day prompt state versus an unlocked reveal, a text reflection input
for past locked days, a multi-select toggle with a counter feeding the
compose flow (E12), and an archive gallery variant for personal walls. The
locked-day state and a load error must render differently: a locked wall is
a designed state, not an error state (`engineering-standards.md` section 3).

**Backend**  Roster, days, members and prompts serve per wall, gated by the
single `authz/` module E05-F2 builds; this feature calls that gate, it does
not duplicate the check. The wall grid reads thumbnails only, never the
full-resolution image, per register 2.5, served as short-lived signed CDN
URLs over a private bucket with the authorization check happening before any
URL is signed. Detail view also accepts a reaction write and a text-only
reflection through the same submit endpoint the drawing flow uses.

**Reads/writes**  Wall contents, membership and roster are server data in
`data/` behind the typed client, never a client store (register 5.1). The
grid reloads on every screen focus so removals and new state surface
promptly; selecting drawings for compose writes to a client store because
that selection is local, ephemeral UI state, not server data.

**QE (draft)**  Happy path: opening a wall with an unlocked prompt shows the
roster and each member's drawing. Edge: a removed member's row disappears on
next focus. Edge: two or more drawings selected enables the compose button
below the count it stays disabled. Contract test on the roster and reaction
shapes. The channel-isolation invariant test from E05-F2 is this feature's
launch gate, not a new one; a pagination and empty-state strategy for the
grid at scale is undecided, no source names a page size, and picking one now
would be inventing scope.

Source: [family screen page](/prototype/screens/family), [response screen
page](/prototype/screens/response-id)

**E05-F5 Dashboard with Your Walls and the stats card**
`parent: E05 | band: GREEN | discipline: iOS | depends on: E05-F4 | blocked by: Q12 | status: Next | size: 3 iOS-days | carries forward: RE-09`

The home surface: a list of walls with an active indicator, and the Your
Stats card from the client's Dashboard frame. Nothing in that frame says what
numbers belong in the card (Q12, open), so the honest split is that the
shell is green-band work and its contents lean on the orange-band streak and
analytics epics. Build the shell here and fill it when E11 and E08 land.
Eric's 2026-08-25 feedback on this screen (his screen 13, Home) says the
screen feels good overall; the sign-out button next to the avatar is an open
question, not yet resolved.

**Frontend**  Greeting header with avatar, the stats card (streak, best
streak, drawing count, weekly dot strip, three milestone badges, contents
pending E11/E08), the Your walls list with a Create new row, and a Try again
control that retries all four loads together rather than one at a time.

**Backend**  A stats endpoint computes streak, weekly completion, drawing
count and badges from real submission history; separate endpoints serve the
wall list and today's prompt. All four reads pass through the E05-F2 authz
gate for wall membership before returning rows.

**Reads/writes**  Streak, walls, prompt and stats are server data in `data/`
behind the typed client (register 5.1); walls and pending invites reload on
every focus so returning from creating or joining a wall is never stale. The
screen writes nothing itself, only routes forward with params.

**QE (draft)**  Happy path: all four loads succeed and the greeting, stats
and wall list render together. Edge: one of four loads fails, Try again
retries all four rather than just the failed one, a defined failure state
per `engineering-standards.md` section 3, not an infinite spinner. Edge: a
wall created or invite accepted elsewhere refreshes the list on return
instead of showing stale data. Unit tests on the streak and badge
calculation logic in `lib/`, since that math is pure. Contract test on the
stats endpoint shape once E11 and E08 define its fields.

Source: [home screen page](/prototype/screens/home)

**E05-F6 Reactions, post-unlock only**
`parent: E05 | band: GREEN | discipline: Backend and iOS | depends on: E05-F2, E04-F5 | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-08`

A fixed sentiment-emoji set, available only after the caller has submitted.
`epic-board-mapping.md` records this as a live disagreement: the client
board treats reactions as an orange sticky, this backlog files it GREEN
inside E05, filed as such on SCRIBL-53. Re-point or re-band it at sprint 1
planning if the wall was right; keep the disagreement on record rather than
resolving it here. Reactions are the entire social currency of this product,
no comments, no counts, no algorithm. Open commenting was deferred at
kickoff and, if it ever ships, is a per-wall-host toggle, never always on.
Whether a person can react to their own work is undecided, no source in the
packet answers it.

**Frontend**  A single heart reaction chip on the response detail view,
reachable only from an unlocked (post-submit) state.

**Backend**  The reaction write is gated by the same submit-to-unlock check
(register 4.1) that governs the response itself, so the invariant reaches
into this feature. A reaction attempt pre-unlock must fail the same way a
locked read fails, not with a different error shape. The reaction endpoint
returns the updated response in place rather than requiring a reload, and
its read side passes through the E05-F2 authz gate like every other wall
read.

**Reads/writes**  Reactions are server data in `data/`, not client state
(register 5.1); reacting writes the new reaction straight into the already
loaded response.

**QE (draft)**  This is a tier-1 invariant test alongside submit-to-unlock
and channel isolation per `engineering-standards.md` section 4: reacting
pre-unlock must be impossible by any route, written before the reaction UI.
Happy path: reacting on an unlocked response updates the chip in place. The
"can a person react to their own work" question stays undecided until a
source answers it, do not guess a rule.

Source: [family screen page](/prototype/screens/family), [response screen
page](/prototype/screens/response-id)

**E05-F7 Create a wall and invite by email in one form**
`parent: E05 | band: GREEN | discipline: iOS | depends on: E05-F1 | blocked by: none | status: Next | size: not sized`

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
session at submit time signs the caller out to sign-up rather than showing a
false success.

**QE (draft)**  Happy path: a valid name and submit creates the wall and
returns to home. Edge: one bad address in a batch errors only that row while
wall creation still succeeds. Edge: a stale session at submit signs out to
sign-up. Contract test on the wall-create and member-invite request shapes
against `packages/contracts`.

Source: [create-wall screen page](/prototype/screens/create-wall)

**E05-F8 Draw against a wall-pinned prompt**
`parent: E05 | band: GREEN | discipline: iOS | depends on: E03-F7, E04-F1 | blocked by: none | status: Next | size: not sized`

The draw screen carries a second entry path that skips the daily prompt and
submits to one wall against a pinned prompt, and nothing else in the backlog
owns it. The narrow tool set here (one brush, eight colors) is the shipping
decision, not a flagged-down richer set. PR 63 read it as a finding under the
assumption a fuller toolset waited behind `EXPO_PUBLIC_FULL_TOOLSET`; E18-F1
was retired 2026-09-01 and E04-F1 states the client's decision outright, so
that question is closed against this feature, not open.

**Frontend**  The DrawPad canvas with its color swatch row, undo and trash
controls, an elapsed-time chip, and a Done button disabled with an
explanatory label when the prompt fetch fails, a defined failure state
rather than a silent hang (`engineering-standards.md` section 3).

**Backend**  Serves today's prompt for the unpinned path only; the pinned
deep-link path carries its prompt in route params and skips the call. No
write endpoint fires from this screen, the submit call belongs to E05-F3.

**Reads/writes**  Gates on auth hydration, then reads the prompt from the
query cache or from route params depending on pinned status. Finishing
writes the image, prompt id, strokes and pinned channel id into a client
draft store, since that draft is client state until submitted (register
5.1), then hands off to story-select.

**QE (draft)**  Happy path: finishing a drawing advances to story-select with
the export written to the draft. Edge: an unpinned prompt fetch failure
disables Done with an explanatory label. Edge: an unauthenticated visitor is
redirected to sign-up before the canvas renders. Component test on the
Done-button disabled state, behaviour not markup.

Source: [draw screen page](/prototype/screens/draw)

**E05-F9 Remove the AI enhancement controls from the response viewer**
`parent: E05 | band: GRAY | discipline: iOS | depends on: E05-F4 | blocked by: none | status: Next | size: not sized`

E18-F5's retirement leaves the original-and-enhanced toggle pill and the
regenerate action as dead controls behind an off flag. Take them out rather
than shipping UI for a capability the product no longer has. `architecture.md`
section 4: delete as readily as you add, dead code behind a month-old flag
gets removed along with the flag.

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
longer exists server-side. Component test confirming the controls are absent
from the rendered tree.

Source: [response screen page](/prototype/screens/response-id)

**E05-F10 Wall member administration screen**
`parent: E05 | band: GREEN | discipline: iOS | depends on: E05-F1 | blocked by: none | status: Next | size: not sized`

The roster screen that shows members, invites by email, removes a member,
and offers leave and delete, gated per action so only the creator sees the
write controls. E05-F1 covers membership as data only; this is the
administration surface on top of it. PR 63's finding checks out against
`app/settings.tsx:163-165` as the sole call site into this screen in the
prototype.

**Frontend**  Member list with avatar, name, email and a per-row Remove
link, an Add member card with an email input and Add button, and Delete
wall and Leave wall rows, each shown or hidden by whether the viewer is the
wall's creator.

**Backend**  A roster endpoint keyed by wall id, plus member-add,
member-remove, leave and delete endpoints. Invite stays simulated
server-side per E05-F1, no real email send. Every roster read passes
through the E05-F2 authz gate; write actions (remove, leave, delete) enforce
the creator-only rule inside `authz/` as well, not as a client-side hide.

**Reads/writes**  The route's wall id and an origin param drive the roster
load in an effect, server data in `data/`. Remove, invite, leave and delete
are direct actions with no automatic write on exit; a successful leave or
delete also invalidates the wall-list cache so home drops the wall.

**QE (draft)**  Happy path: the wall's creator opens the screen and the
roster, invite card and delete row all render. Edge: the sole owner of a
wall with no other members tries to leave, the screen blocks it with an
explanatory message, this is E05-F11's rule surfaced here. Non-creator
viewers see the roster with write controls hidden, not just disabled, since
a hidden control that is still reachable by direct call is an authz gap, not
a UI gap. Contract test on the roster and member-action shapes.

Source: [wall members screen page](/prototype/screens/wall-id-members)

**E05-F11 Leave a wall and delete a wall, with the orphan and archive guards**
`parent: E05 | band: GREEN | discipline: Backend | depends on: E05-F1 | blocked by: none | status: Next | size: not sized`

Both endpoints exist in the POC with real rules: a sole-owner creator cannot
leave, and the personal archive wall refuses delete. E05-F1 says nothing
about leaving or deleting, so this feature owns those rules server-side
while E05-F10 owns the screen that calls them.

**Frontend**  No screen of its own; the leave and delete rows this feature
backs live on the roster screen E05-F10 builds.

**Backend**  Leave and delete endpoints in `services/`, enforcing the two
guards: a sole owner with no other members cannot leave (the wall would
orphan), and the personal archive wall cannot be deleted at all. Both checks
sit behind the same `authz/` module every wall read and write goes through,
not as separate ad hoc logic in the route handler. A successful delete
removes the wall's `submission_channels` rows for that wall, register 2.4's
join table, without touching the submission or its image, since the same
submission may still be shared to other walls.

**Reads/writes**  Wall and membership state read for the guard checks comes
from `data/` behind the typed client; a successful leave or delete
invalidates the wall-list cache so home drops the wall, the same
invalidation E05-F10 relies on.

**QE (draft)**  Happy path: a creator with other members present leaves
cleanly, and a non-archive wall's creator deletes it cleanly. Edge: a
sole-owner creator attempting to leave a wall with no other members is
blocked with an explanatory error. Edge: an attempt to delete the personal
archive wall is refused regardless of caller. Integration test on both
guards against a real local Postgres, since orphan and archive rules are
exactly the kind of logic that mocked SQL would hide a bug in.

Source: [wall members screen page](/prototype/screens/wall-id-members)

**E05-F12 Put a wall administration door on the wall**
`parent: E05 | band: GREEN | discipline: Design | depends on: E05-F10 | blocked by: none | status: Next | size: not sized`

The member screen is reachable only through settings, so a person managing a
wall has to leave the wall to do it. This is a design decision, not a build
task: put a door to the roster screen (E05-F10) on the wall itself.

**Frontend**  A visible entry point on the wall or family screen that routes
directly to the wall-members screen, carrying an origin param so the back
arrow returns to the wall rather than to settings. No new backend surface;
this reuses E05-F10's screen and E05-F1's data.

**QE (draft)**  Happy path: from a wall's own screen, the new entry point
opens the roster for that wall and the back control returns to the wall. No
new invariant or contract surface, this is a navigation change on top of an
existing screen; a component test on the origin-param back-arrow behaviour
covers it.

Source: [wall members screen page](/prototype/screens/wall-id-members)

**E05-F13 Edit a caption after it is submitted**
`parent: E05 | band: GREEN | discipline: iOS | depends on: E05-F4 | blocked by: none | status: Next | size: not sized`

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
authorizes on ownership of that submission through the same `authz/` module.

**Reads/writes**  The caption is server data once submitted, so an edit
reads and writes through `data/` and the typed client, not a client store,
even though the original draft caption lived in a client store before
submit (register 5.1, the boundary sits at submit time).

**QE (draft)**  Happy path: the author edits a caption under the cap and
saves, the new text renders on the response detail view. Edge: a non-author
viewer has no access to the edit control, enforced by the same authz check
as the write, not by hiding a button. Edge: an edit over the character cap
is blocked client-side and rejected server-side if it somehow arrives.
Contract test on the caption-edit endpoint shape.

Source: [write screen page](/prototype/screens/write)

## E06 QA foundation and standards

`id: E06 | band: GREEN (addition, not on the board) | discipline: QA | jira: SCRIBL Epic`

The 2026-08-20 walkthrough named the problem. QA starts on day one and there is
no code, so there is nothing to write test cases against until week three at
the earliest. The sequence agreed on that call is the right one: documented
and reviewed requirements first, then test cases generated from those
requirements plus the design frames, because a mockup does not tell you what
the screen was meant to achieve.

This epic owns more than its own testing. It owns the test-tier doctrine for
the whole engagement, `engineering-standards.md` section 4: six tiers ordered
by value, invariant tests as launch gates written before the feature they
guard, contract tests against `packages/contracts`, unit tests on `lib/` and
`selectors/`, integration tests against a real local Postgres rather than
mocked SQL, component tests on behaviour, and a thin Playwright E2E suite on
the daily loop only. It also owns two artifacts that belong to other epics'
invariants: the submit-to-unlock and channel-isolation bypass probes
(`architecture.md` section 6), and the structural tests that no module under
`backend/src/authz/` imports the flag client and that every declared flag has
an owner with every release flag carrying a `removeBy`.

The coverage bar is genuinely undecided. `engineering-standards.md` section 4
says thresholds are set per tier once the shape is real, not as one global
number, and names three candidate answers already on record with an
instruction not to invent a fourth. Q48 tracks the same fact: three different
coverage numbers were given in one hour on 2026-08-20. This epic settles the
number; it does not invent one here.

`E06 and E07 never map to the kickoff board` (`tracking/epic-board-mapping.md`):
both were added after the sticky-note wall, so the wall is not a complete
backlog and this epic should not be read against it.

**E06-F1 QA process standard for this engagement**
`parent: E06 | band: GREEN | discipline: QA | depends on: none | blocked by: none | status: Now | size: 3 QA-days | carries forward: RE-14`

The written process: how a feature moves from ready to tested, what evidence
counts, who signs off, and what happens when a build fails a gate. Sized to
three two-week sprints and a remote team split across Central and IST rather
than to a general-purpose QA handbook. Client-facing document, because it is
the reference both sides work from when a build is called tested.

**Implementation**  A markdown process document under `handbook/`, not code.
It has to name the six test tiers from `engineering-standards.md` section 4
as the shared vocabulary for "tested," so later features (E06-F3, E06-F5,
E06-F6) can cite a tier by name instead of re-explaining it.

**QE (draft)**  No test surface of its own. Its acceptance check is a review
by Scribl and a sign-off recorded against the document itself.

**E06-F2 Tooling recommendation with the alternatives written down**
`parent: E06 | band: GREEN | discipline: QA | depends on: none | blocked by: Q53, Q58, Q59 | status: Now | size: 4 QA-days | carries forward: RE-14`

Three recommendations, each with the options considered and the reason for
the call: the automation framework for a React Native app on iOS, the device
strategy (real devices, simulators or a hosted farm), and where test cases
live given that nobody knows yet whether the Bounteous Jira instance does
test-case management (Q53). Write the cost of each option next to it, because
the subscription question needs a case before it can be approved. This is the
same deliverable as the Sprint 0 spike E00-F3: it answers Q48 and Q53 and
costs nothing new because the four QA-days already sit here.

**Implementation**  `toolchain.md` section 2 has already made the tool
decisions this feature is not free to re-open: Jest everywhere as one runner
with two projects, because the app side needs `jest-expo` for the React
Native transform regardless and two runners would mean two mental models for
one team; Playwright for web E2E against the export; native E2E deferred,
Maestro first when it is needed because it is far simpler to keep green than
Detox; dependency-cruiser for the architecture boundaries. What this feature
still has to decide is the device strategy (real devices, simulator, or a
hosted farm) and where test cases live (Q53), both open.

**QE (draft)**  No automated test of its own. The deliverable is the
recommendation document; its check is Scribl's sign-off on the priced
options, same as E06-F1.

**E06-F3 Test strategy and a priced coverage commitment**
`parent: E06 | band: GREEN | discipline: QA | depends on: E06-F2 | blocked by: Q48 | status: Blocked | size: 3 QA-days | carries forward: RE-14`

What gets unit tested, what gets automated end to end, what stays manual, and
what the number is, with the cost of each layer in QA-days against the 30
QA-days this engagement actually has. An 80 percent unit coverage commitment
across three two-week sprints is a different engagement from a
manual-plus-smoke commitment, and the difference lands on the iOS lane, which
has no slack. Settle the number with Scribl before it gets quoted anywhere
else.

**Implementation**  Undecided by design. `engineering-standards.md` section 4
says coverage thresholds are set per tier once the shape is real, not as one
global number, and names three candidate answers on record with an
instruction not to invent a fourth. Q48 is the same open item: three
different coverage answers were given in one hour on 2026-08-20. This feature
does not pick one; it prices the candidates against the 30 QA-days budget so
Scribl can.

**QE (draft)**  This feature is the definition of the QE tiers other features
cite, not a thing tested itself. Its output is the priced strategy document.

**E06-F4 Requirements review and traceability**
`parent: E06 | band: GREEN | discipline: QA | depends on: E06-F1 | blocked by: Q15, Q16 | status: Now | size: 4 QA-days | carries forward: RE-14`

Every feature on this page reviewed and turned into testable statements,
traced back to the design frame or the decision it came from. This is the
starting order QA set out on the 2026-08-20 walkthrough and it is the right
one. Two limits: the 23 PNG exports may not be the complete set and we do not
have file access (Q16), and which screens get a full design pass versus
which get the theme replicated is not yet split (Q15), so traceability
against design is partial until both close.

**Implementation**  A traceability matrix mapping each feature body to the
decision register entry, ADR or design frame it derives from. For the
features in this epic itself, that source is the handbook rather than a
screen, since none of E06, E08 or E10 carries a prototype screen.

**QE (draft)**  No automated check. The matrix is reviewed against
`tracking/backlog-epics.md` and the register for gaps, and Q15 and Q16 are
named as the reason coverage is partial rather than silently treated as
complete.

**E06-F5 Automation harness build**
`parent: E06 | band: GREEN | discipline: QA | depends on: E06-F2, E01-F5 | blocked by: none | status: Next | size: 6 QA-days | carries forward: RE-14`

The harness itself, built against the API contract and mock server from
E01-F5 so it does not wait on the app. First real tests are the invariants
rather than the screens: submit-to-unlock cannot be bypassed, channel A never
leaks into channel B, reactions are impossible pre-unlock. Those three are
the tests worth having on day one because each of them failing is a product
promise broken rather than a cosmetic defect.

**Implementation**  Jest as the one runner, two projects per `toolchain.md`
section 2, wired to the mock server contract from E01-F5 so the harness runs
before the real backend exists. This feature is where the two invariant
probes named in `architecture.md` section 6 become artifacts, even though the
invariants themselves belong to E04 (submit-to-unlock) and E05 (channel
isolation): a probe that submits without unlocking and expects a refusal, and
a probe that reads across two wall memberships and expects isolation.
Adapters are substituted, never module-mocked, per section 4's standard.

**QE (draft)**  Tier 1, invariant. These are launch gates and are written
before the features they guard, per `engineering-standards.md` section 4.
Test names state the behaviour, for example `refuses a channel read before
submit`. The clock is injected, not read from the wall.

**E06-F6 Release gate, definition of ready, definition of done**
`parent: E06 | band: GREEN | discipline: QA and Delivery | depends on: E06-F1 | blocked by: Q43 | status: Next | size: 2 QA-days | carries forward: RE-14`

What has to be true before a build goes to a Wednesday demo, and what has to
be true before a feature is called done. Neither is defined for this team
today (Q43), and with three demos in eight weeks the gate gets used six
times, so it is worth the two days. The three invariant tests from E06-F5 are
the non-negotiable part of the gate.

**Implementation**  A written definition of ready and definition of done. The
non-negotiable line item in definition of done is a green run of the two
invariant probes from E06-F5, plus the flag-client import check from
`architecture.md` section 6 (no module under `backend/src/authz/` imports the
flag client, every declared flag has an owner, every release flag carries a
`removeBy`). Blocked on Q43 for the rest of the gate's content.

**QE (draft)**  No test of its own; it is the gate other tests report into.
The three invariant tests it names are Tier 1 per `engineering-standards.md`
section 4 and are already covered by E06-F5.

**E06-F7 Device matrix and the test-device request**
`parent: E06 | band: GREEN | discipline: QA and Delivery | depends on: E06-F2 | blocked by: Q44, Q51 | status: Blocked | size: 2 QA-days | carries forward: RE-04`

The list of devices and iOS versions this build is tested on, and the
purchase or loan request that gets them into testers' hands. Bounteous runs
this process on other projects, so the process exists; the numbers do not,
and they depend on the same Q44 answer that gates E04-F6. Raise the request
in discovery, because hardware procurement is measured in weeks and this
engagement is eight of them.

**Implementation**  A device and OS-version matrix, undecided pending Q44
(the same device-support answer E04-F6 needs) and Q51 (physical device
availability). No code surface; this is a procurement and planning artifact.

**QE (draft)**  No automated test. The matrix feeds which devices the
component and E2E tiers in E06-F5 actually run against once real devices
exist.

## E07 Build, signing and tester distribution

`id: E07 | band: GREEN (addition, not on the board) | discipline: Platform and iOS | jira: SCRIBL Epic`

How a build reaches a human being. This is on the page as a green epic because
the engagement commits to three Wednesday demos and Scribl was promised working
software, and today none of it exists: no Apple Developer account, so no
provisioning profile and no signing identity (Q5); no build host and no
pipeline, with the laptops-versus-CI question raised on 2026-08-20 and left
unanswered (Q47); no distribution process, with TestFlight only a leaning
(Q45); and no idea how many internal and external testers to configure for
(Q46).

Worth separating this from the gray band cleanly. The board's gray item is App
Store readiness and compliance, which is submission to the public store, and
that stays gray and stays gated on Q56. This epic is a signed build in a
tester's hands in week three. They are different problems and only one of them
can wait.

**E07-F1 Apple Developer account and signing identity**
`parent: E07 | band: GREEN | discipline: Delivery | depends on: none | blocked by: Q5 | status: Blocked | size: not sized | carries forward: RE-14`

Scribl provisions an Apple Developer account, and the team gets a signing
identity and provisioning profiles under it. Nothing in this epic and no
demo build happens without it, and it is not work Bounteous can do
unilaterally. It blocks E07-F3, E07-F4, every TestFlight build, and by
extension the first client demo, which makes it the most expensive
unanswered question on the engagement. Q5 stays open, undecided, no
source resolves it.

**Backend**  No implementation until Q5 closes. When it does, the signing
certificate and provisioning profile go into the pipeline as an encrypted
secret, imported into a temporary keychain at build start and removed at
the end, per `release-readiness.md` section 1.
**QE (draft)**  No test surface exists yet. Once the identity lands, a
pipeline check confirms the signed archive step completes without a human
running Xcode.

**E07-F2 Build host and pipeline decision**
`parent: E07 | band: GREEN | discipline: Platform | depends on: none | blocked by: Q47 | status: Blocked | size: 1 platform-day | carries forward: RE-14`

Decide where iOS builds run and write it down. This is decided, not open:
register 9.3 confirms the hosted pipeline builds iOS too, on a GitHub
Actions macOS runner, with no local-build phase and no self-hosted-runner
phase to plan around. `ci-cd.md`'s macOS-runner section gives the shape:
`runs-on: macos-*` scoped to only the iOS build and archive step, gated to
a release trigger rather than every push to main, because a macOS runner
minute bills at roughly ten times a Linux one and nothing about the iOS
build needs to run on every backend-only commit. This is the same decision
as E01-F7 seen from the app side, made once there.

**Backend**  The release-trigger job: read the version, derive a
monotonically increasing build number, `expo prebuild`, archive and export
a signed build, upload debug symbols, upload to App Store Connect, print
version, build number and commit sha.
**QE (draft)**  Pipeline test: two consecutive release triggers produce
strictly increasing build numbers with no hand-typed value. Integration
test: the macOS job is the only step in the workflow running on a macOS
runner, confirmed by reading the workflow file's `runs-on` values.

**E07-F3 Automated iOS build**
`parent: E07 | band: GREEN | discipline: iOS and Platform | depends on: E07-F1, E07-F2, E01-F9 | blocked by: Q5 | status: Blocked | size: 3 iOS-days | carries forward: RE-14`

A signed build produced from a commit without a human running Xcode, with
versioning and build numbers that increment on their own. No Expo cloud
build service and no EAS Update: native prebuild runs in the pipeline from
E07-F2, and `engineering-standards.md` section 5 names the reason the
no-EAS-Update decision holds beyond the standing POC-harness constraint,
Apple guideline 2.5.2 prohibits downloading and executing code, and
over-the-air JavaScript replacement is exactly the mechanism that rule
addresses. Three of the 43 green-band iOS-days go here, which is worth
stating out loud because it is invisible work that competes directly with
screens.

Three build variants come out of this pipeline: `co.scribl.app.dev`,
`co.scribl.app.qa`, and the clean `co.scribl.app` for production, driven by
`APP_ENV` through one dynamic `app.config.ts` rather than three checked-in
variants that drift.

`expo prebuild` is where the pnpm autolinking risk in `toolchain.md`
section 1 actually bites: prebuild and the Xcode native build resolve
autolinking by walking `node_modules`, and pnpm's symlinked store is the
historically fragile case for that walk. If autolinking breaks here, the
fallback is `node-linker=hoisted`, which forfeits the strictness pnpm was
chosen for. Verify this is actually solved rather than assumed before
relying on it in a release pipeline.

**Backend**  `scripts/build-ios.sh`, called by the workflow step rather
than written inline in YAML so it runs identically on a developer's own
Mac. Reads the version from its single source of truth, derives the build
number from the CI run number, prebuilds, archives, exports.
**QE (draft)**  Integration test: a prebuild against the pnpm-managed
workspace resolves every native module's autolinking with no manual
pod/gradle edit. Pipeline test: a repeated or lower build number is
rejected rather than silently accepted.

**E07-F4 TestFlight distribution process, written for Scribl**
`parent: E07 | band: GREEN | discipline: Delivery | depends on: E07-F3 | blocked by: Q45, Q46 | status: Blocked | size: not sized | carries forward: RE-14`

The written process for getting a build to Scribl's testers: who manages
the tester list, what the caps are, what a tester does on day one.
`release-readiness.md` section 4 sizes internal testing at 100 or fewer
with no beta review, build available in minutes, versus external testing
at up to 10,000 with Beta App Review required. Nobody knows which group
Scribl's testers fall into or how many there are (Q46), which stays open
and feeds the infrastructure sizing question in Q50. The demo-account trap
applies regardless of path: submit-to-unlock means a fresh account sees an
empty wall, so the seeded reviewer account must arrive pre-seeded with a
submission and visible wall content, automated behind a documented flag,
never hand-built the night before a submission.

**Backend**  The seeding flag and its seeded account, backend-owned, with
the contract mock from E01-F5 reproducing the same shape so the client path
stays exercisable before the real API exists.
**QE (draft)**  Integration test: the seeded demo account, run through the
seeding flag, shows a non-empty wall on first login. Q45 and Q46 stay
undecided until the client names the tester list and count.

**E07-F5 Crash reporting and build traceability**
`parent: E07 | band: GREEN | discipline: iOS | depends on: E07-F3 | blocked by: none | status: Next | size: 1 iOS-day | carries forward: RE-14`

Crashes from a tester's device arrive somewhere the team can read them,
tied to a build number and a commit. One day of work that turns "it
crashed" from a Slack message into a stack trace, which matters more than
usual when the testers are the client and the feedback loop is a weekly
demo. `release-readiness.md` section 7 records the seam as already built,
local adapter and Crashlytics adapter both written against the conformance
suite, with the Crashlytics vendor package itself deliberately not wired
until a Firebase project exists and its privacy manifest is audited.
Debug symbols are uploaded to Crashlytics as part of the E07-F3 workflow;
skipping that step leaves crash reports unsymbolicated.

**Backend**  `services/crash/` seam, local and Crashlytics adapters behind
one interface, factory throws on an unrecognised `EXPO_PUBLIC_CRASH_ADAPTER`
value rather than falling back silently. Collection starts disabled and is
enabled after consent.
**QE (draft)**  Conformance suite run against both adapters. Integration
test: a crash on a build tagged with a commit sha resolves to a
symbolicated stack trace naming that build number and commit.

## E08 Analytics instrumentation, instrument now, report later

`id: E08 | band: GREEN | board item: "Analytics instrumentation (instrument now, report later)" | discipline: Backend and iOS | jira: SCRIBL Epic`

The board's own qualifier is the whole scope of this epic. Instrumenting late
means the first two months of behavior are gone permanently, and this is a
retention product where D1, D7 and D30 are the numbers that decide whether it
works. Reporting can wait, and ADR-0008 already says the analytics pipeline
is separate from the operational store, with the warehouse deferred until
product analytics cannot answer a question.

This is the epic that moved bands, and the reason is on record.
`tracking/epic-board-mapping.md` says the analytics sticky sat in the green
core band while the backlog had it ORANGE, and the conflict was resolved
2026-08-24 in favour of the board. Register section 10 names the analytics
event pipeline as out of the current band in the same breath it calls it "the
thing most worth fighting to keep, because unmeasured months cannot be
recovered." Both readings are on record and neither has been reconciled
beyond the band move; that tension is this epic's shape, not a contradiction
to paper over.

`service-seams.md` section 1 decides where the seam sits. A vendor that might
change belongs behind our own API, not an in-app interface, because an in-app
swap costs a code change plus a store release, one to three weeks, while a
server-side swap is a backend deploy in hours. The device posts events to us
and we fan out; the vendor choice lives in `backend/src/effects/`, never in
the app. The seam catalogue marks `telemetry` (product analytics) as
DELIBERATELY ABSENT from this phase, with the reason that adding it changes
both app stores' privacy declarations, which makes it a product decision
rather than an engineering one. That is the single most important fact
governing this epic's shape.

Real-user monitoring is out of scope for this phase (`service-seams.md`,
2026-08-31), and register 6.4 stands unamended: structured logging, one log
group per environment, alarms on error rate and service health. No RUM SDK,
no session replay, no performance-trace vendor.

Privacy floor, `engineering-standards.md` section 5: no personal data,
content, or image bytes in logs, telemetry or crash reports, enforced by the
logger's type signature rather than by discipline. A minor's diagnostics stay
off without consent, and that is a Tier 1 invariant test and a launch gate.
Register 7.2: consent is versioned rows, never a flag on a record. Register
6.5: crash reporting runs on a free tier gated on consent, and crash is the
one seam whose swap point is in-app, because it has to capture native crashes
and the last moments of a dying process, which cannot be done from JavaScript
over HTTP.

The analytics system of record is one of four architect-owned decisions with
no register entry at all (register 10b). It carries a recommendation on the
open-questions list and is marked undecided here; do not invent one.

**E08-F1 Versioned event taxonomy**
`parent: E08 | band: GREEN | discipline: Product and Backend | depends on: none | blocked by: Q13 | status: Blocked | size: 2 backend-days | carries forward: RE-14`

A typed, versioned list of events with their properties, agreed before anyone
fires one. Scribl offered their own success-metrics list on the kickoff call
and it has not arrived (Q13); this taxonomy should be built from that list
rather than from our guesses about what they measure.

**Backend**  Lives in `packages/contracts` as a versioned schema, parsed at
the boundary rather than cast, per `engineering-standards.md` section 2. No
personal data, content, or image bytes in an event property, per section 5's
privacy floor. The system of record the taxonomy ultimately feeds is
undecided, register 10b; this feature defines the shape, not the destination.

**QE (draft)**  Contract test asserting every declared event matches its
schema on both the app and backend side, Tier 2 per `engineering-standards.md`
section 4. Undecided until Q13 closes: which events Scribl's own
success-metrics list requires beyond the funnel already named in E08-F2.

**E08-F2 Client instrumentation**
`parent: E08 | band: GREEN | discipline: iOS | depends on: E08-F1 | blocked by: Q6 | status: Blocked | size: 2 iOS-days | carries forward: RE-14`

Events fired from the app for the prompt funnel: prompt seen, canvas opened,
submitted, wall viewed, reaction given, invite sent, invite redeemed. That
funnel and the invite pair are the two things worth having on day one,
because one measures the habit and the other measures whether the product
spreads.

**Implementation**  Calls sit in `features/<name>/` alongside the action they
describe, never in `components/ui`, per `architecture.md` section 2's
dependency rule. The event posts to our own API rather than to a third-party
SDK directly, per `service-seams.md` section 1: `telemetry` has no client-side
vendor seam in this phase, deliberately, because adding one changes both
stores' privacy declarations. Blocked on Q6 (consent-flow sequencing) since a
minor's account cannot fire diagnostics before consent is recorded.

**QE (draft)**  Component test asserting the event fires on the user action it
describes, not on a render, Tier 5 per `engineering-standards.md` section 4.
The consent gate itself is Tier 1, a launch gate, per section 5's privacy
floor: a minor's diagnostics stay off without consent.

**E08-F3 Event pipeline**
`parent: E08 | band: GREEN | discipline: AWS | depends on: E08-F1, E01-F2 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-14`

Events land somewhere durable and queryable, per ADR-0008: Firehose into
partitioned S3 with Athena over it. Deliberately not QuickSight dashboards
and not the Glue and SageMaker data lake from the future-state design, both
of which that design gates to well after this phase. Report later means
exactly this.

**Backend**  Sits in `backend/src/effects/`, the seam-owning layer per
`architecture.md` section 2 and `service-seams.md` section 1, since the
downstream analytics vendor (if any) is a decision Scribl's stores have to
sign off on, not us. The device posts to our own API; this feature is the fan
out. The system of record beyond raw Athena-queryable S3 is undecided,
register 10b.

**QE (draft)**  Integration test against a real local Postgres or the
Firehose local adapter, not mocked, Tier 4 per `engineering-standards.md`
section 4: an event posted lands in a queryable partition. No personal data,
content, or image bytes in the event body, per section 5.

**E08-F4 AI and infrastructure cost telemetry**
`parent: E08 | band: GREEN | discipline: AWS | depends on: E01-F8 | blocked by: Q49, Q50 | status: Blocked | size: 2 backend-days | carries forward: RE-F7`

Per-call model token logging and cost attributed per environment. The AWS
estimate puts AI inference at roughly 60 percent of the 30-month total cost
of ownership and about two thirds of it at full scale, so cost per active
user is a product metric on this engagement rather than a finance one. It
also matters more than usual here because hosting spend for this phase is
not yet allocated (Q49) and the user base and concurrency to size for are
undecided (Q50).

**Backend**  Structured log line per model call in `backend/src/effects/`,
one log group per environment per register 6.4, tagged with environment and
attributed cost. Not a dashboard, per the same register entry: the platform
floor is logging plus alarms on error rate and service health, not a metrics
stack. No RUM vendor, per `service-seams.md`'s 2026-08-31 scope line.

**QE (draft)**  Unit test in `lib/` on the cost-attribution calculation
itself, Tier 3 per `engineering-standards.md` section 4, with the clock
injected rather than read from the wall. Sizing thresholds and alarm bounds
are undecided pending Q49 and Q50.

## E09 Push notifications, the daily nudge

`id: E09 | band: ORANGE | board item: "Push notifications (the daily nudge)" | discipline: Backend and iOS | jira: SCRIBL Epic`

A once-a-day habit product with no way to reach a person who has not opened
it is a product that quietly loses its users in week two. That is why this
is the first orange item and why E03-F5 exists as a one-day local-notification
bridge: if this epic loses its capacity fight, the loop degrades instead of
disappearing. The difference is that a local reminder cannot say "your sister
just posted", and that message is the reason anyone opens the app twice.

Managed push notification delivery is out of the current band per decision
register section 10: the seams here plus the local reminder are what get
built, so turning on server-driven push later is a configuration change
against `service-seams.md` section 1, not a rewrite. `epic-board-mapping.md`
records the same split on the board: the backend side (E09-F1, E09-F3) fits
the capacity this phase has; the client side (E09-F2, E09-F4) does not.

**E09-F1 Managed push infrastructure**
`parent: E09 | band: ORANGE | discipline: AWS | depends on: E01-F2 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-11`

Backend infrastructure for push delivery. Creates the SNS platform endpoint
per device, holds the ARN against the user, and manages the topic
subscription, all server-side per the seam decision recorded in
`service-seams.md` section 1 on 2026-08-31: an authenticated AWS call has no
safe path from the device, so the device only ever posts its OS-issued token
to `POST /notifications/registrations` and never sees an AWS credential. The
old "SNS into Pinpoint, per the production AWS architecture docs" framing is
stale against that decision and is replaced here.

**Backend**  `POST /notifications/registrations` in `routes/`, delegating to
`backend/src/effects/` for the SNS platform-endpoint create and topic
subscribe. The `sns` adapter and the local `apns-fcm` adapter (registers with
the OS, token goes nowhere) share the `notifications` seam interface, with a
factory that throws on an unrecognised adapter value rather than falling
back.

**QE (draft)**  Contract test (tier 2) asserting the registration endpoint's
request and response shape against `packages/contracts`. Conformance suite
(tier 4, `lib/`-adjacent) run against both the `sns` and `apns-fcm` adapters
so the interface holds for either. No client AWS SDK to test; that absence is
itself the thing to assert in review.

**E09-F2 APNs registration and permission UX**
`parent: E09 | band: ORANGE | discipline: iOS | depends on: E09-F1, E02-F2 | blocked by: Q6 | status: Blocked | size: 2 iOS-days | carries forward: RE-11`

Native APNs registration and the permission prompt, timed to earn a yes rather
than fired on first launch. ADR-0001 names push registration as one of the
few justified native modules. Push registration is a platform-edge adapter
per `architecture.md` section 3b, so Android replaces this adapter rather
than inheriting it; `Platform.OS` checks stay inside `services/notifications`
and never leak into a feature's action or selector. Blocked on capacity: two
iOS-days that do not fit in a lane whose green-band demand already runs over
budget (Q6).

**Implementation**  `services/notifications` adapter registers for APNs,
receives the OS token, and posts it to `POST /notifications/registrations`
(E09-F1). The permission-prompt timing and the decline path live in
`features/notifications/`.

**QE (draft)**  Component test (tier 5) on the permission-prompt trigger
condition and the decline path, asserting behaviour, not markup. Contract
test (tier 2) on the registration POST payload shape.

**E09-F3 Timezone-correct daily nudge**
`parent: E09 | band: ORANGE | discipline: Backend | depends on: E09-F1, E03-F1 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-11`

The daily nudge fires on the person's local morning, not the server's clock.
E11-F1's streak engine has the identical day-boundary problem; solved twice,
the two would disagree at midnight and tell someone their streak broke while
reminding them to draw.

**Backend**  A single pure day-boundary function in `lib/`, taking a
timezone and a clock value, shared by the nudge scheduler in
`backend/src/services/` and by E11-F1's streak calculation. The scheduler
effect that actually sends lives in `backend/src/effects/`, downstream of the
SNS seam in E09-F1.

**QE (draft)**  Unit tests (tier 3) on the day-boundary function across
timezone offsets and DST transitions, clock injected rather than read from
wall time, per `engineering-standards.md` section 4. Integration test (tier
4) that the scheduler and the streak engine, given the same instant and
timezone, agree on which calendar day it is.

**E09-F4 Notification preferences and quiet hours**
`parent: E09 | band: ORANGE | discipline: Backend and iOS | depends on: E09-F3 | blocked by: Q6 | status: Blocked | size: 2 backend-days | carries forward: RE-11`

An on/off switch and quiet hours, the floor App Store review sets for an app
that sends daily notifications; if E09 ships, this ships with it.

**Backend**  Preference storage and a quiet-hours window per user, read by
the E09-F3 scheduler before it calls the effect that sends. Not a feature
flag: this is a user preference, not a release control, and it has no
relationship to the flag rules in `feature-flags.md`.

**QE (draft)**  Integration test (tier 4) against a local Postgres asserting
the scheduler does not send inside a configured quiet-hours window, and does
send just outside it. Contract test (tier 2) on the preferences endpoint
shape.

## E10 Moderation, fail-safe

`id: E10 | band: ORANGE | board item: "Moderation (fail-safe)" | discipline: Backend and iOS | jira: SCRIBL Epic`

The walls are private and invitation-only, which lowers the risk but does not
remove it, and App Store review does not grade on intent. Any app with
user-generated content needs report, block and takedown before it reaches the
public store, and the board's own word for this item is fail-safe, meaning
content is held rather than published when moderation cannot reach a verdict.

The fail policy is genuinely undecided. Register 10b lists "moderation fail
policy" as OUTSTANDING: a recommendation is on the open-questions list and
the decision is not made. E00-F13 is the Sprint 0 spike that owns closing it.
The backlog's own board-mapping row (Q31) says the same thing: the ADR review
left fail-open versus fail-safe per content type as an open gate. This epic
does not decide it; E10-F2 prices the candidates instead.

What this epic DOES build is the human path, and that is a store-review
requirement, not a nicety. Register section 10: automated content moderation
is out of the current band, and report, block, take down, and a queue with a
named owner are built, because that is what store review checks. Register
7.3 puts the moderation substrate in the schema from the start, alongside
deletion and export.

Block relationships are enforced in `backend/src/authz/`, the same choke
point as channel isolation, register 4.2. That makes blocking a Tier 1
invariant concern rather than a feature-level check, and it means this epic
reaches into E05's read path: a block has to be checked wherever a wall is
read, not only where content is reported.

Anything touching minors, consent, moderation or payment fails closed,
`feature-flags.md` section 2. A moderation kill switch is a permanent flag,
not a release flag, per the four flag kinds in that section. Under-13 users
are in scope, register 7.1, which is what makes this epic's fail-closed
posture non-negotiable rather than cautious.

**E10-F1 Async moderation lane**
`parent: E10 | band: ORANGE | discipline: Backend | depends on: E01-F4, E04-F4 | blocked by: none | status: Next | size: 4 backend-days | carries forward: RE-12`

Submission enqueues a moderation job; the queue is drained by the separate
AI service rather than by the request path, per ADR-0003 and ADR-0010, so
submit never waits on a model. ADR-0011 puts moderation on the Haiku tier,
which is the cheapest of the three tiers and the one that scales with
volume.

**Backend**  Queue producer lives in `backend/src/effects/`; the consumer is
a separate service, per ADR-0003 and ADR-0010, so this feature never touches
`routes/` or `authz/` directly. The moderation kill switch this lane needs is
a permanent flag under `feature-flags.md`'s kill-switch kind, and it fails
closed on outage per section 2's rule for anything touching moderation.

**QE (draft)**  Integration test against a real local Postgres and the local
queue adapter, Tier 4 per `engineering-standards.md` section 4: a submission
enqueues exactly one job and submit returns before the job drains. Contract
test, Tier 2, on the job payload shape against `packages/contracts`.

**E10-F2 Fail-safe policy per content type**
`parent: E10 | band: ORANGE | discipline: Product and Backend | depends on: E10-F1 | blocked by: Q31 | status: Blocked | size: 2 backend-days | carries forward: RE-12`

Written policy, then code: what happens to a drawing, a story and a
transcript when the model is unavailable, times out, or returns low
confidence. The board says fail-safe, which means hold rather than publish,
and holding a child's drawing from their grandmother's wall for ten minutes
has a product cost worth naming before it happens in a demo.

**Backend**  Undecided. Register 10b marks the moderation fail policy
OUTSTANDING, and Q31 is the same open item. This feature does not choose
fail-open or fail-safe; it prices what each candidate costs per content type
(hold time, false-hold rate, the ten-minute grandmother case) so the decision
lands with evidence rather than a guess. Once decided, whichever policy wins
fails closed per `feature-flags.md` section 2 because moderation is on that
section's fails-closed list regardless of which branch is chosen.

**QE (draft)**  Tier 1, invariant, once the policy is decided. A model
timeout or low-confidence result never results in publish under the
fail-safe branch. Until then this feature has no test, because there is no
decided behaviour to assert.

**E10-F3 Report, block and takedown**
`parent: E10 | band: ORANGE | discipline: iOS and Backend | depends on: E05-F4 | blocked by: Q6 | status: Blocked | size: 2 iOS-days | carries forward: RE-12`

Any wall member can report content, block a person, and have content
removed. This is the human path and it is the part App Store review
actually checks, so if automated moderation slips out of the eight weeks
this feature cannot slip with it. Blocked on iOS capacity, not on a
decision.

**Backend**  Block relationships are enforced in `backend/src/authz/`, the
same choke point that enforces channel isolation, register 4.2. That means
this feature reaches into E05's read path: every wall read has to consult
the block relationship at the same choke point, not at the report/takedown
endpoint alone. Report and takedown are `routes/` -> `authz/` ->
`services/` -> `repositories/`, per `architecture.md` section 2, with no SQL
outside `repositories/`.

**QE (draft)**  Tier 1, invariant: a blocked person's content never appears
in the blocking person's wall read, tested the same way as the
channel-isolation probe in E06-F5 since it shares the choke point. Component
test, Tier 5, on the report and block UI behaviour, not markup.

**E10-F4 Review queue with a named owner and an action SLA**
`parent: E10 | band: ORANGE | discipline: Product and Delivery | depends on: E10-F3 | blocked by: Q22, Q31 | status: Blocked | size: not sized | carries forward: RE-12`

Somewhere reported content lands, someone whose job it is to look at it, and
a committed turnaround. Store review for user-generated content expects
prompt action on reported content, and a queue with no named owner fails
that test on paper. Scribl has no named product owner (Q22), so this feature
has no owner either, and that is the blocker rather than the tooling.

**Backend**  The queue table, owner field and response-time field are
already part of the schema per register 7.3, built with deletion and export
rather than as an afterthought. What is undecided is who the owner is (Q22)
and what the committed turnaround is (Q31, since the SLA and the fail policy
are the same conversation about how fast a verdict has to land).

**QE (draft)**  Undecided until Q22 and Q31 close. Once an owner and an SLA
exist, the integration test, Tier 4, asserts a reported item's age against
the SLA is queryable; no test can assert a turnaround that has no committed
number yet.

**E10-F5 Third-party AI consent**
`parent: E10 | band: ORANGE | discipline: iOS and Backend | depends on: E02-F1 | blocked by: none | status: Next | size: 1 backend-day | carries forward: RE-12`

Explicit consent, captured once, before any content is sent to a
third-party model, and content never used for training without an opt-in.
Apple's rules require the disclosure, and the product principle that the
person owns their creations requires the opt-in to be off by default.

**Backend**  Consent is a versioned row per person, per kind, per version,
register 7.2, never a flag on a record. Content only reaches a third-party
model after the consent row exists; the check sits ahead of the moderation
lane's queue producer in E10-F1. Off by default is the same fail-closed
posture `feature-flags.md` section 2 requires for anything touching consent.

**QE (draft)**  Tier 1, invariant: content cannot reach the moderation queue
without a recorded consent row for the account. Test names the behaviour
directly, for example `refuses third-party dispatch before consent recorded`.

## E11 Streaks and progression

`id: E11 | band: ORANGE | board item: "Streaks plus progression" | discipline: Backend and iOS | jira: SCRIBL Epic`

The mechanic that turns one good day into a practice. It is also the cheapest
orange item on the board: the streak rule is a few lines against the submissions
table, and the archive is a query that already has its index from E01-F3. The
part that is not cheap is being correct about what a day is, because a streak
that resets wrongly at midnight is worse for retention than no streak at all.

**E11-F1 Timezone-correct streak engine**
`parent: E11 | band: ORANGE | discipline: Backend | depends on: E01-F3, E04-F4 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-09`

Increment once on a new local day, never twice on the same day, reset on a
miss, computed in the person's timezone rather than the server's. Shares
the day-boundary definition in `lib/prompt-day.ts` with E03-F3 and E09-F3
so the prompt, the nudge, and the streak all agree on when today started.
Whether the streak is computed on read or maintained as a stored counter
is undecided. The packet's authored backend prose for the root screen
says the user's stats are served "for a computed streak," which this
feature takes as the shape, but a computed streak recalculated from the
submissions table on every read and a stored counter incremented on
submit are different builds with different staleness risk, and no source
picks one. The choose-channels submit screen is where a submission is
written, which is the moment any stored counter would need to advance;
if the streak stays computed, that screen writes nothing extra at all.

**Frontend**  No dedicated screen; the wall-unlock submit on
choose-channels is the write that would trigger a stored increment if the
engine is ever built that way.
**Backend**  A pure streak selector over the submissions table, timezone
aware, sharing `lib/prompt-day.ts`'s day boundary with E03-F3 and E09-F3.
Server data only, read into `data/`, never a client store (register 5.1),
correcting the POC's "streak store" framing.
**Reads/writes**  Reads submission history and the user's timezone; writes
nothing if computed on read, or writes one counter row per qualifying
submission if a stored counter is chosen, pending the undecided question
above.
**QE (draft)**  Tier 1 invariant test, launch gate written first per
`engineering-standards.md` section 4: a streak never increments twice for
the same local day and always resets on a missed day, with the clock
injected rather than read from wall-clock time. Tier 3 unit tests on the
pure selector across a DST transition and a cross-midnight submission.
Happy path: a submission on a new local day increments the streak by one.
Edge: two submissions on the same local day leave the streak unchanged; a
missed day resets it to zero on the next read.

Source: [choose-channels screen page](/prototype/screens/choose-channels)

**E11-F2 Streak and stats surface**
`parent: E11 | band: ORANGE | discipline: iOS | depends on: E11-F1, E05-F5 | blocked by: Q12, Q6 | status: Blocked | size: 2 iOS-days | carries forward: RE-09`

The current streak, a week view, and the stats card content. Blocked on
Q12 and Q6. This is the content for the E05-F5 shell, which ships green
and empty rather than waiting, because an empty deliberate card reads
better than a broken half-built one. E11 is ORANGE and outside the eight
weeks on the client side (register section 10's not-in-this-phase table);
this feature does not get promoted to close the root-screen gap below,
the gap gets resolved by changing what the root screen depends on, not by
pulling this feature forward.

Name the sequencing problem plainly: the root screen (E03-F2) is GREEN and
renders a streak tile that is this feature, ORANGE and blocked. A GREEN
front door depending on a blocked ORANGE feature is a real scheduling
defect, worth resolving before sprint 1, most likely by having the root
screen ship with the streak tile behind a release flag defaulting to
hidden until this feature clears its blockers.

**Frontend**  The stats card on /home: streak, best streak, drawing
count, a weekly dot strip, and three milestone badges (E11-F4's numbers),
plus the streak tile on the root screen; a Try again control on /home
retries all four of that screen's loads together, not just the failed
one.
**Backend**  A stats endpoint computing streak, weekly completion,
drawing count, and badge state from real submission history, built on
E11-F1's streak selector.
**Reads/writes**  Server-owned stats read into `data/`, not a "stats
store" or "streak store" per the POC framing; register 5.1 keeps this out
of Zustand. Reloads on every focus to /home so a just-completed submission
is never stale; writes nothing.
**QE (draft)**  Tier 5 component tests on behaviour: the four /home loads
succeed and render real numbers; one of the four fails and the single Try
again control retries all four; returning to /home after a wall action
refreshes rather than showing stale data. Happy path on root: an
unsubmitted day renders the streak tile alongside the prompt and
countdown. Undecided: Q12 and Q6 gate this feature and are not resolved by
this body.

Source: [daily prompt screen page](/prototype/screens/root-today), [home screen page](/prototype/screens/home)

**E11-F3 Personal archive**
`parent: E11 | band: ORANGE | discipline: Backend and iOS | depends on: E01-F3 | blocked by: none | status: Next | size: 2 backend-days | carries forward: RE-09`

Every submission automatically kept in the person's own history, readable
without a wall. This is what makes the app worth keeping after a group
goes quiet, and it is also what a premium tier would eventually gate, so
build it now and leave tiering alone.

**Frontend**  The family screen's archive gallery variant for personal
walls: the response grid, roster strip, locked-day draw prompt versus
unlocked reveal, and the ReflectionInput field for a text-only entry on a
past locked day.
**Backend**  Serves channel roster, days, members, and prompts for the
personal wall, and accepts a text-only reflection through the same
`POST /submit` endpoint the drawing flow uses; that reflection path is
real in the shipped app and has no filed feature until this one names it.
**Reads/writes**  Channel id from route params drives roster, day,
member, and prompt reads, reloaded on every focus so a removal or new
entry is never stale; a text-only reflection writes a submission row, and
selecting drawings for multi-select writes into the compose store for
E12-F2's compose screen.
**QE (draft)**  Tier 4 integration test against a real local Postgres for
the indexed personal-history read, not mocked SQL. Happy path: opening a
personal wall renders the roster and each day's entry, drawn or reflected.
Edge: a past locked day accepts a text-only reflection through
`POST /submit` and it appears in the grid on the next read; a member
removed elsewhere disappears from the roster on next focus.

Source: [family screen page](/prototype/screens/family)

**E11-F4 Milestone badges**
`parent: E11 | band: ORANGE | discipline: iOS | depends on: E11-F1 | blocked by: Q6 | status: Blocked | size: 1 iOS-day | carries forward: RE-09`

Badges at 7, 30 and 100 days. Blocked on Q6. This is the release valve for
E11: the one ORANGE feature whose absence nobody notices in a demo, so if
the iOS lane needs a day back, take it from here before touching E11-F2.
E11 is ORANGE and outside the eight weeks on the client side; this stays
that way regardless of how cheap the badge logic is.

**Frontend**  Three milestone badges on the /home stats card, driven by
E11-F1's streak selector; locked or earned state per badge.
**Backend**  Badge state is a pure threshold check (7, 30, 100 days) over
E11-F1's streak output, folded into the same stats endpoint E11-F2 reads;
no separate storage.
**Reads/writes**  Server-owned, read into `data/` as part of the /home
stats load; writes nothing.
**QE (draft)**  Tier 3 unit test on the threshold check across the three
milestones and the boundary day of each (day 6 versus day 7, and so on).
Happy path: crossing day 7 flips the first badge to earned on the next
stats read. Undecided: Q6 gates this feature and is not resolved by this
body.

Source: [home screen page](/prototype/screens/home)

## E12 Sharing a response, and a wall, as a document

`id: E12 | band: ORANGE | board item: "Sharing personal" | discipline: iOS and Backend | status: New, needs scoping | jira: SCRIBL Epic, not filed`

The orange band carried a sticky reading "Sharing personal" with no epic
behind it. This is that epic, opened new at the 2026-08-25 prioritization
session. Today a drawing goes onto a wall and stays there: the only way to
get it out is a screenshot, which loses the story written underneath it and
loses the prompt that produced it.

This is sharing, not multi-channel posting. `epic-board-mapping.md` draws the
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
wall, so it authorizes on membership through the same choke point every other
wall read uses, and the exported document is only as private as the link it
produces. This epic does not build without E12-F5's permission question
answered first.

**E12-F1 Share one response as a document**
`parent: E12 | band: ORANGE | discipline: Backend | depends on: E04-F4, E01-F6 | blocked by: format decision, E12-F5 | status: New | size: not sized`

One response in, one document out: the artwork at print resolution, the
story text underneath it, the prompt it answered, and the date. Rendered
server-side from the stored submission, so the output is the same on every
phone. This is the decision register 2.6 payoff: the submission holds the
versioned stroke document plus a render, and re-rendering for export reads
those resolution-independent coordinates rather than a bitmap, so the
document is not bound to whatever screen size produced the original render.

**Frontend**  The `/share` card view (drawing, caption or voice marker,
prompt line, date badge), a target-tile row, and the hidden ViewShot capture
tree.

**Backend**  A day-list lookup for the caption's prompt text. The current
POC captures the card as a client-side PNG (`app/share.tsx:406-456`), which
is the opposite of this feature's server-render decision; that capture path
comes out as part of this feature, not a later cleanup.

**Reads/writes**  Response fields arrive as route params; no store or API
write happens in this screen. The document render itself is the async job in
E12-F3.

**QE (draft)**  Contract test (tier 2) on the render job's input shape
against `packages/contracts`. Component test (tier 5) that the Share tile
falls back to a URL when card capture fails, so a broken capture path degrades
rather than blocking the share.

Source: [share screen page](/prototype/screens/share)

**E12-F2 Pick several and group them into one file**
`parent: E12 | band: GRAY | discipline: iOS and Backend | depends on: E12-F1, E05-F4 | blocked by: none | status: Deferred, the extension | size: not sized`

A selection mode on the wall grid and home screen: tap to select, a count, a
clear action, one share action composing the selected responses into one
file in wall order. This is the board's gray sticky, "picking multiple
pictures and grouping them", carried here as E12-F2 rather than as its own
epic, and it stays gray while E12-F1 through E12-F4 sit orange
(`epic-board-mapping.md`). Register section 10 lists "composed keepsakes
from several drawings" as parked by the client's own decision for a later
phase; that is the same deferral seen from the board side and the register
side, and E18-F4's keepsake feature needs the identical selection
interaction, so it is built once here for both.

**Frontend**  `/compose`'s Skia canvas stage (place, move, corner-scale,
rotate, tray, undo/clear/Save/Share) with its fewer-than-two guard, plus
`/family`'s multi-select toggle and compose button feeding it.

**Backend**  A compositions endpoint that derives the destination channel
from the caller's identity server-side and re-checks membership and prior
submission before accepting a save or share, per the channel-isolation choke
point in register 4.2.

**Reads/writes**  Compose reads the picked source drawings on entry only;
Save writes the composition and clears the selection, Share instead routes
to `/share` with the saved response's fields, and a failed save leaves the
tray intact for retry. Family's multi-select writes the picked ids into the
compose store on exit and nothing else.

**QE (draft)**  Integration test (tier 4) that a save with fewer than two
drawings is refused server-side, not only guarded in the UI. Component test
(tier 5) that a failed save leaves the tray populated for retry.

Source: [compose screen page](/prototype/screens/compose), [family screen page](/prototype/screens/family)

**E12-F3 Document rendering service and delivery**
`parent: E12 | band: ORANGE | discipline: AWS | depends on: E01-F6 | blocked by: none | status: New | size: not sized`

Composition runs off the request path. A submit-style asynchronous job
renders the document from the stored stroke document and render (register
2.6), writes it to S3, and hands back a time-limited signed URL, per the
pattern ADR-0010 sets for anything slow. The retention question is a
privacy decision, not a storage one: a generated document is a copy of a
child's drawing behind a URL, and under-13 users are in scope per register
7.1.

**Backend**  The render job in `backend/src/effects/`, an S3 write, and the
signed-URL issuance. Retention period and whether the link is revocable on
demand are undecided; no source sets a value, so this is not sized until
one does.

**QE (draft)**  Integration test (tier 4) against local Postgres and a local
object-storage adapter that the signed URL expires and a re-fetch after
expiry is refused. Invariant test (tier 1) that the render job re-checks wall
membership before rendering, since a queued job outlives the request that
authorized it.

Source: [share screen page](/prototype/screens/share)

**E12-F4 The share destination**
`parent: E12 | band: ORANGE | discipline: iOS | depends on: E12-F1 | blocked by: none | status: New | size: not sized`

The system share sheet is the whole of the app's job past producing the
file: it reaches messages, mail, social, print and the photo library without
Scribl building any of those paths. The POC's `/share` screen admits its
endpoint is not real; this replaces it rather than restyling it. Whether the
sheet receives a signed short-lived URL or a file handed directly to the OS
is undecided; no source in this packet or the register sets it, and it
decides how private the shared artifact actually is (register 4.2), so it
belongs in the same scoping pass as E12-F5's permission answer.

**Frontend**  `/response/[id]`'s header share button (the AI original/enhanced
toggle from the retired E18-F5 comes out here) and `/share`'s card view and
target-tile row. The Instagram and More tiles at `app/share.tsx:503-520`
render as enabled but are inert; they come out rather than get built, per
this feature's own boundary that the app's job stops at the file and the
sheet.

**Backend**  Response detail and reaction-post endpoints for
`/response/[id]`; the day-list lookup for `/share`'s caption prompt text.
Neither backend path records that a share happened.

**Reads/writes**  `/response/[id]` loads on route params (channelId,
promptId, id) and writes a reaction in place on react; sharing pushes
payload to `/share` as route params, not a store write.

**QE (draft)**  Component test (tier 5) that the locked-message state on
`/response/[id]` has no retry or bypass for a viewer who has not submitted
today. Invariant test (tier 1) that a response fetch by id authorizes on
membership before rendering, since a share button on an unauthorized
response is the same access-control shape the register 4.2 rule exists to
close.

Source: [response detail screen page](/prototype/screens/response-id), [share screen page](/prototype/screens/share)

**E12-F5 What may leave a private wall, and who decides**
`parent: E12 | band: ORANGE | discipline: Product | depends on: none | blocked by: client decision, plus the under-13 scope in E00-F8 | status: Blocked, needs a client answer | size: 1 day, a written decision`

Whose work a member may export, and whether the author or the wall creator
can refuse. A family wall holds other people's children's drawings, so
"select and share" is a request to copy content the sharer did not create.
This is a client decision, not an engineering one, and it has to land before
E12-F1 through E12-F4 ship: retrofitting a permission rule onto a shipped
export path means revisiting every read in it, the same class of problem as
channel isolation in E05-F2. Under-13 scope (register 7.1, E00-F8) makes this
a compliance question as much as a product one: exporting a minor's artwork
outside the wall's invitation boundary needs a documented consent basis, not
just a UX flow.

**Backend**  Whatever this decides gets enforced in the same authorization
module as wall membership (register 4.2), not as a client-side check. No
implementation until the decision exists.

**QE (draft)**  Not applicable until the decision lands; the eventual
enforcement gets an invariant test (tier 1) per the register 4.2 pattern.

## E13 Comments, with the wall creator as moderator

`id: E13 | band: ORANGE | board item: "comments? - Add toggles for Wall Creators, possible ai moderation of comments" | discipline: iOS and Backend | status: New, needs scoping | jira: SCRIBL Epic, not filed`

The kickoff settled that reactions ship and open commenting waits, and that if
commenting is built it is a switch the wall's creator holds rather than a
feature that is always on. This epic is that design, written down.

The part that makes it Scribl's rather than generic is who moderates. The
person who made the wall moderates the wall. A parent who creates a family
wall gets the hide, the delete and the remove-member action on their own wall,
and does not wait on Scribl support to use them. That is a smaller and more
defensible surface than central moderation, and it is the reason commenting
can be considered at all on a product holding children's work.

The AI filter in E13-F5 sits in front of publication, not behind it: text is
checked before anyone sees it. Its fail policy is the same open question E10
and E00-F13 already carry, so it gets answered once for both.

The board had this sticky in the gray band, outside the eight weeks. This
session moved it up, so the epic is written to be plannable rather than
parked. Its band is a decision, not an inheritance.

**E13-F1 Comment model and the per-wall switch**
`parent: E13 | band: ORANGE | discipline: Backend | depends on: E01-F3, E05-F1 | blocked by: none | status: New | size: not sized`

Comments against a response, and a per-wall setting, default off, that only
the wall's creator can change. Off means the endpoints refuse rather than the
client hiding a button, on the same submit-to-unlock pattern register 4.1
enforces at the data layer. The switch is an authorization role, not a UI
toggle: register 4.2 puts ownership in the same single authorization module
as membership, and register 4.3 means a client-enforced toggle would not
count as enforced at all.

**Backend**  A `comments` table plus a per-wall setting column, checked in
`backend/src/authz/` before any comment write or read, not in `routes/`.
Every comment-touching route calls that one module, per register 4.2.

**QE (draft)**  Invariant test (tier 1), written before the feature per
`engineering-standards.md` section 4: a comment write against a wall with the
setting off is refused server-side regardless of client state. Structural
test that `backend/src/authz/` does not import the flag client (register
4.3), extended to cover this switch.

**E13-F2 Write and read a comment**
`parent: E13 | band: ORANGE | discipline: iOS | depends on: E13-F1, E05-F4 | blocked by: none | status: New | size: not sized`

A short comment on a response detail, flat rather than threaded, visible
only after the reader has submitted their own drawing, on the same unlock
rule the walls already run. A length cap in the spirit of the 280-character
story cap in E04-F3. Flat, not threaded, because a thread is a moderation
surface, and this epic's whole shape is keeping that surface small enough
for one parent to manage.

**Frontend**  A comment list and input on the response detail screen
(`/response/[id]`, E12-F4's screen), gated on the same locked-state message
that screen already shows a viewer who has not submitted today.

**Backend**  Comment create and list endpoints, validating length server-side
and re-checking submit-to-unlock (register 4.1) before either read or write,
since a comment read is a read of the wall.

**Reads/writes**  Comment list loads with the response detail; a posted
comment appends to that loaded list rather than triggering a reload.

**QE (draft)**  Contract test (tier 2) on the comment create/list shapes
against `packages/contracts`. Unit test (tier 3) on the length-cap check in
`lib/`. Invariant test (tier 1) that a comment read before the reader's own
submission exists is refused.

**E13-F3 Creator moderation actions**
`parent: E13 | band: ORANGE | discipline: Backend and iOS | depends on: E13-F1 | blocked by: none | status: New | size: not sized`

Hide a comment, delete a comment, mute a member on this wall, remove a
member from this wall, authorized against wall creator rather than a global
role. Register 4.2 puts ownership and block relationships in the same single
authorization module as membership, so this is invariant work reaching into
`backend/src/authz/`, not a client-side toggle. Every action is recorded,
because a moderation action nobody can see the history of is one the creator
cannot explain to the person on the other end of it.

**Backend**  Moderation-action endpoints (`hide`, `delete`, `mute`, `remove`)
that check wall-creator ownership through `backend/src/authz/`, plus an
append-only action log table, `moderation_actions`, written on every action.

**QE (draft)**  Invariant test (tier 1), written first: only the wall's
creator can hide, delete, mute or remove on that wall, and the check cannot
be bypassed by any role claim in the request body. Integration test (tier 4)
against local Postgres that every action produces exactly one log row.

**E13-F4 Report, and the path off the wall**
`parent: E13 | band: ORANGE | discipline: Backend | depends on: E13-F1, E10-F1 | blocked by: none | status: New | size: not sized`

A member reports a comment to the wall creator, and anything the creator
cannot or will not resolve escalates into the moderation lane E10 already
builds. App Store review expects a report path for user-generated content
and does not accept the wall creator as the sole recourse. This is a named
cross-epic dependency: E13 adds a second reportable content type into E10's
existing moderation queue rather than building a second queue.

**Backend**  A report-create endpoint writing into E10's queue schema with a
`comment` content type alongside whatever E10 already reports on, plus a
creator-notification path when a report lands on their wall.

**QE (draft)**  Contract test (tier 2) that a comment report enters E10's
queue in the same shape as its existing content types. Component test (tier
5) that the report action is reachable from the comment even when the wall
creator has taken no action.

**E13-F5 Pre-publish safety check on comment text**
`parent: E13 | band: ORANGE | discipline: Backend | depends on: E13-F1, E10-F1 | blocked by: the moderation fail policy, E00-F13 | status: Blocked on the fail policy | size: not sized`

A comment is checked before it is published, not after it is seen: is it
harmful, is it cruel, does it fail the standard Scribl sets. Held rather
than shown when the check cannot reach a verdict, which is what "fail-safe"
means on the board sticky. The standard's language is Scribl's program
team's to write, not engineering's to infer.

This is undecided and stays undecided here. Register section 10 lists
automated content moderation as out of the current band, with the human path
(report, block, take down) built instead. Register 10b names the moderation
fail policy as outstanding: a recommendation sits on the open-questions list
and no decision is made. The board sticky's own words, "possible ai
moderation", are a question, not a requirement, and this fragment does not
resolve it.

**Backend**  Undecided pending the fail policy (E00-F13). What is fixed
regardless of the answer: this touches moderation, so per `feature-flags.md`
section 2 it fails closed and cannot be a release flag: it is a permanent
kill switch, evaluated server-side, with an unreachable-provider default of
"held". Every comment run through the check is a model call, so spend scales
with usage; E08-F4 is where that cost shows up.

**QE (draft)**  Not written until the fail policy lands. Once it does, the
first test is an invariant test (tier 1): a check that cannot reach a verdict
holds the comment rather than publishing it, and that behaviour is not
reachable from configuration (register 4.3's pattern extended to this gate).

## E14 App Store readiness and compliance

`id: E14 | band: GRAY | board item: "App Store readiness plus compliance (release phase)" | later home: the release phase, after sprint 3 | discipline: Platform, QA and Product | jira: SCRIBL Epic, label future | blocked by: Q56`

Public submission, not distribution. Getting a signed build to Scribl's own
testers is E07 and happens inside the eight weeks; getting through App Store
review and onto the public store is this epic and happens in the release
phase after sprint 3, gated on Q56, per the board's later-home assignment. No
one has committed to a store release at the end of this phase, stated on the
2026-08-20 walkthrough. Three of its four features are schema and policy
work, and retrofitting them costs multiples of building them in place, which
is why account deletion (E02-F6) and AI consent (E10-F5) already moved out of
this epic into the green and orange bands: account deletion in-app is an
Apple requirement for any app that creates accounts, and submit-to-unlock
hides the product from a reviewer who has drawn nothing, which is why
register 7.5 pre-seeds a reviewer account rather than leaving that to
submission week.

Authority for this epic is release-readiness.md in full: the store
prerequisites in section 1, the build artifacts already landed or blocked in
section 3, the TestFlight cap and demo-account trap in section 4, the
guideline-by-guideline table in section 5, and the seam-adapter and
permission-declaration rules in engineering-standards.md section 5 and
service-seams.md section 1 that govern what this epic is allowed to add to
the binary.

**E14-F1 Store listing and review package**
`parent: E14 | band: GRAY | discipline: Delivery | depends on: E07-F1 | blocked by: Q56 | status: Blocked | size: not sized | carries forward: RE-14`

Screenshots, description, age rating questionnaire, review notes, and the
seeded reviewer demo account, per release-readiness.md section 5. The age
rating answer runs straight into E16, since register 7.1 puts under-13 users
in scope while ADR-0012 leaves the store-category question open, so this
feature cannot close before that question does.

**Implementation**  Metadata and screenshots are a delivery task, not code.
The demo account is code: `npm run db:seed:reviewer` (toolchain.md),
governed by register 7.5, seeds a submission and visible wall content so a
reviewer does not land on an empty wall behind submit-to-unlock. Assign the
guideline 1.2 named-owner and SLA fields (register 7.3) before submission,
per release-readiness.md section 5's two release-phase assignments.

**Backend**  The seed script writes through the same repositories the app
uses, no direct SQL from the script, so seeded data matches production
shape.

**QE (draft)**  Verify the seed script from a clean database produces a
reviewer account whose first screen shows content, not an empty wall. Verify
the age rating answer and the store listing text agree with whatever E16-F1
settles. Tier: integration test against a local Postgres for the seed path,
plus a manual walkthrough before each submission.

**E14-F2 Privacy manifest and data-use disclosures**
`parent: E14 | band: GRAY | discipline: iOS and Product | depends on: E10-F5 | blocked by: Q56 | status: Blocked | size: not sized | carries forward: RE-12`

The privacy manifest, tracking disclosures, and the third-party AI
disclosure that follows from sending content to a model, describing consent
already captured by E10-F5. Release-readiness.md section 3 records the
manifest itself as already built in `app.config.ts` under
`ios.privacyManifests`; this feature is the accuracy check against what
ships, not the first draft.

**Implementation**  Re-verify the required-reason codes against Apple's
current list before submission, per release-readiness.md section 3, since
the repo's declared codes cannot be trusted as current without a re-check.
Any new third-party SDK added to the binary between now and submission needs
its own signed privacy manifest and a new subprocessor entry
(service-seams.md section 1) before this feature can close. The App Privacy
label in App Store Connect must match the manifest and match what
Crashlytics actually collects (release-readiness.md section 7), or the
mismatch surfaces at review.

**Backend**  None. This is a client-binary and console-metadata surface.

**QE (draft)**  Diff the declared manifest against the dependency list at
submission time, not at feature-complete time, since a dependency added
after this feature closes can silently invalidate it. Tier: manual
verification checklist, no automated test reaches App Store Connect
metadata.

**E14-F3 User-generated content review evidence**
`parent: E14 | band: GRAY | discipline: QA and Product | depends on: E10-F3, E10-F4 | blocked by: Q31, Q56 | status: Blocked | size: not sized | carries forward: RE-12`

Demonstrable report, block and takedown paths, a named moderation owner, and
a committed action turnaround, documented for the reviewer against Apple
guideline 1.2. Register 7.3 builds the underlying schema (reports table,
block relationship enforced in the authz choke point, owner and SLA fields)
with the schema rather than later; this feature packages evidence that path
works, and the queue owner assignment itself (Q22) is still open.

**Implementation**  Automated content filtering is out of this band
(register 10, "automated content moderation" is explicitly not in this
phase); the reviewer evidence is the human path only, so the walkthrough
must show a report, a block, and a moderator action reaching a committed
turnaround, not a claim of automation.

**Backend**  Evidence is read off the existing reports and moderation-queue
repositories (register 7.3); no new backend surface, this feature is
verification and documentation of what E10-F3 and E10-F4 already store.

**QE (draft)**  End to end: submit a report, confirm it lands in the queue
with owner and SLA fields populated, confirm a block enforced through the
authz choke point actually removes visibility. Tier: this exercises the
channel-isolation invariant indirectly, so treat the block-enforcement check
as a launch-gate-adjacent test, written against `backend/src/authz/`, not a
plain integration test.

**E14-F4 Phased rollout and update strategy**
`parent: E14 | band: GRAY | discipline: Platform | depends on: E07-F3 | blocked by: Q56 | status: Blocked | size: not sized | carries forward: RE-14`

Phased release percentages, a rollback position, and how a fix reaches
people without a full review cycle. Decide this before the first public
release, not during the first incident.

**Implementation**  Register 7.4 rules out remotely loaded or interpreted
code and rules out the no-EAS-Update decision elsewhere in this project's
stack notes; a "fix without a review cycle" here means a fast expedited
review plus a phased-percentage rollback of the store listing, not an
over-the-air code push, since Apple guideline 2.5.2 prohibits the latter.
Name that constraint in the rollout plan itself so nobody proposes an
update mechanism this stack has already ruled out.

**Backend**  None directly; the rollback lever is the store console's
phased-release percentage control, not a backend flag.

**QE (draft)**  No automated test reaches a store console. Tier: manual
runbook, exercised once as a dry run before the first real submission, per
release-readiness.md section 8's sequencing.

## E15 re:Invent event wall

`id: E15 | band: GRAY | board item: "re:Invent event wall" | later home: its own scope and funding call, tracked as Q21 | discipline: Backend and AWS | jira: SCRIBL Epic, label future | blocked by: Q21`

A live wall at re:Invent, with everyone in a room drawing at once. re:Invent
is the north star date on both sides, so this is a real commitment with an
unreal number attached: Q21's working capacity figure is roughly 100,000
concurrent users, three orders of magnitude beyond anything else on this
page and the opposite architecture from the private invitation-only walls
the rest of the product is built around. `future-scale-track.md` calls the
same gap "the largest unaddressed architectural gap in the corpus" and
records that a past comparable product degraded around 50-60 participants
per wall, nowhere close to 100k. Its later home is its own scope and funding
call, tracked as Q21, not a sprint inside this phase.

The real source behind this epic is thin: one paragraph in
`future-scale-track.md` naming the demo bar and four undesigned candidate
directions, one register line (section 10) noting timed challenges could
return as a wall type, and the calendar fact that the eight weeks end
2026-10-16 against a re:Invent freeze around 2026-10-23. Nothing decides a
wall definition, a capacity target, a budget, or an architecture. Do not let
this arrive as a two-week request in October: the scope and funding call has
to happen before any engineering does.

**E15-F1 Scope and capacity call**
`parent: E15 | band: GRAY | discipline: Product and AWS | depends on: none | blocked by: Q21 | status: Blocked | size: not sized | carries forward: RE-F7`

What the event wall actually is, how many people are on it at once, and who
pays for the burst, before any architecture spike starts. `future-scale-track.md`
names re:Invent (~2026-12-05) as the aspirational proof point at up to
~100,000 concurrent submitters to a SINGLE wall, and calls this plainly "the
largest unaddressed architectural gap in the corpus," noting a past
comparable product degraded around 50-60 participants per wall. The ADR
review's flagged inconsistency (2,000 concurrent versus larger numbers used
elsewhere) is that same gap surfacing twice in the corpus under different
numbers, not two different problems.

**Implementation**  Undecided. No source names a wall definition, a
capacity target, a budget owner, or a funding mechanism for the burst.
`future-scale-track.md` lists four candidate directions (fan-out/broadcast,
cached wall reads, write buffering, pre-aggregated tiles) explicitly as
"design work to schedule, not decisions." Q21 is the question that decides
scope and capacity; nothing downstream in E15 can start until it does.

**Backend**  None assignable yet; this feature is the scope call, not a
build.

**QE (draft)**  Not applicable until scope exists. The eight-week calendar
in `timeline-and-milestones.md` ends 2026-10-16 and the re:Invent freeze
lands around 2026-10-23 (`backlog-epics.md`'s calendar section), which
leaves roughly one week between the last demo and the freeze if this were
ever squeezed into the current phase. That gap is the argument for treating
E15 as its own scope and funding call rather than a sprint add.

**E15-F2 Realtime broadcast architecture**
`parent: E15 | band: GRAY | discipline: AWS | depends on: E15-F1 | blocked by: Q21 | status: Blocked | size: not sized | carries forward: RE-F7`

A design for pushing a wall's updates to a room in real time. Nothing in the
current serverless request and response design does this, and no ADR
covers it, so this is a genuine architecture spike, not a configuration
change, and it cannot start before E15-F1 gives it a number to design
against.

**Implementation**  Undecided pending E15-F1. `future-scale-track.md`
section "The scale-up service ladder" and its checklist keep a WS event
channel as "a documented seam even though event mode is out of the MVP," so
the seam exists to grow into; what fills it (WebSocket API, AppSync
subscriptions, or one of the other three candidate directions) is not
chosen. Register section 10 notes timed drawing challenges were built in
the prototype, removed from the product surface by the new designs, and
"return as a WALL TYPE if they return," which is the closest existing
concept in the register to an event wall, worth reusing as a starting
shape rather than inventing a new wall concept from nothing.

**Backend**  Undecided. Candidate directions from `future-scale-track.md`:
fan-out/broadcast, CloudFront-cached wall snapshots, SQS/Kinesis write
buffering ahead of the store, or pre-aggregated wall tiles. None is chosen.

**QE (draft)**  Not applicable until an architecture exists. Once one does,
this crosses the app/backend boundary and carries the contract-test
obligation against `packages/contracts` per engineering-standards.md
section 4, plus a load test against the capacity number E15-F1 sets, since
the prior comparable product's 50-60-per-wall degradation point is exactly
the failure mode a load test needs to catch before re:Invent, not after.

**E15-F3 Event wall client surface**
`parent: E15 | band: GRAY | discipline: iOS | depends on: E15-F2 | blocked by: Q21 | status: Blocked | size: not sized | carries forward: RE-F7`

The screen itself, plus a way in that does not require an invitation, which
means it deliberately breaks the invitation-only rule the rest of the
product is built around for one wall type. That exception is the design
question, and register 10 names the same mechanism (timed challenges
returning "as a WALL TYPE") as the nearest existing precedent for a wall
that behaves differently from a private channel.

**Implementation**  Undecided pending E15-F2. No source specifies the
entry screen, the join mechanism, or how it differs from the standard
invite flow beyond "does not require an invitation." E18 is named as the
epic that preserves the challenge-mode mechanism this exception would
reuse; the actual reuse is not designed.

**Backend**  Depends entirely on E15-F2's broadcast architecture; no
independent backend surface for this feature.

**QE (draft)**  Not applicable until E15-F2 closes. When it does, this is
an iOS-surface feature and needs component tests on the join-without-invite
behaviour plus an end-to-end walkthrough of the daily loop analog for this
wall type, per engineering-standards.md section 4 tiers 5 and 6.

## E16 Under-13 and the COPPA Family edition

`id: E16 | band: GRAY | board item: "Under-13 / COPPA Family edition" | later home: post-launch planning, tracked as Q32 | discipline: Product and Backend | jira: SCRIBL Epic, label future | blocked by: Q32`

Children are the obvious audience for a family drawing app and they are
also the one audience that changes the legal shape of the product. COPPA
compliance is not a feature added on top, it changes consent, data
retention, moderation posture and the age rating on the store listing.

**Name the contradiction plainly, because it is the headline finding of
this whole GRAY pass.** This epic sits in the GRAY band with a post-launch
later home, tracked as Q32. But register 7.1, one of the five decisions the
register's own "if you read only one section" names as carrying more weight
than the rest, states flatly that "under-13 users are in scope, so COPPA
compliance is a requirement of this build rather than later preparation."
The board's placement and the register's decision disagree about when this
work is required, not about whether it is required. ADR-0012 resolves the
disagreement in practice, not in principle: production stays on "OPTION A,"
no minor enrollment in `prod`, until the ADR's two open sub-decisions
(store-category targeting, verifiable-consent method) close, so the gate
mechanism is built and tested now while the audience it protects is not yet
live in production. Read register 7.1 with ADR-0012's caveat attached, or it
overstates what is actually shipped.

Read ADR-0012 in full for what is already built (the age gate, the
fail-closed consent-and-diagnostics wiring, the parental-consent UI) versus
what those two open sub-decisions leave undecided. Register 11 names both
sub-decisions as the largest open items in the whole register. This epic's
three features do not re-answer them; E16-F1 to F3 build the legal position
and the two mechanisms (verification method, retention and moderation
defaults) that let production flip `allowsMinorEnrollment` from `false` to
`true` once the two ADR-0012 sub-decisions close. Later home: post-launch
planning, tracked as Q32, per the board's own words that none of the GRAY
epics are dropped.

**E16-F1 Legal position and age gate**
`parent: E16 | band: GRAY | discipline: Product | depends on: none | blocked by: Q32 | status: Blocked | size: not sized | carries forward: RE-12`

A written position on who this app is for, what age gate the store listing
claims, and what COPPA obliges given under-13 users. Register 7.1 already
settles the product question: children are a supported audience and COPPA
compliance is a build requirement, not later preparation, and it is one of
the five decisions the register's "if you read only one section" names as
carrying more weight than the rest. ADR-0012 catches the record up to code
already shipped in `scribl-mobile-app`: `account-class.ts`'s
`COPPA_AGE_THRESHOLD = 13` classes an account `adult`, `minor` or `unknown`
from date of birth, and `unknown` is treated as `minor` everywhere
downstream, a fail-closed default on bad input.

**Implementation**  The age-gate mechanism itself is not this feature's
work, it is already built and ADR-0012 confirms its shape as correct. This
feature is the legal position and the store age-rating answer that sits on
top of it. `packages/contracts/entities` holds `AccountClass`, so any
product-level "who is this app for" answer has to agree with that type
rather than restate it informally.

**Backend**  `canProceedToAccountCreation` returns true only for `adult`; a
`minor` classification branches into a parental-consent flow before any
account is created, covered by an existing e2e test ("the age gate branches
a minor into parental consent, not into an account"). This feature does not
touch that code; it produces the legal position that names which of
ADR-0012's two open sub-decisions (store-category targeting, verifiable
consent method) the business wants to close, and how.

**QE (draft)**  No new test surface; the branching behaviour already has
an e2e test per ADR-0012. This feature's own verification is a legal
sign-off document, not a test.

**E16-F2 Verifiable parental consent**
`parent: E16 | band: GRAY | discipline: Backend and iOS | depends on: E16-F1 | blocked by: Q32 | status: Blocked | size: not sized | carries forward: RE-12`

A consent flow that meets the verifiable standard rather than a checkbox,
plus the parent-side controls that follow from it. Cheap to describe,
expensive to build correctly, and ADR-0012 names this as one of its two
open sub-decisions: which COPPA-approved method (payment instrument, signed
form, video verification, knowledge-based authentication) is actually
implemented. Consent is versioned rows per register 7.2, never a flag on a
record, with who consented, when, and whether it was revoked.

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
checkbox-consent failure the type was built to prevent. This feature is
what earns the right to flip it.

**QE (draft)**  Invariant test, launch gate: a minor's diagnostics and
crash-reporting collection stay off without a `parental` consent row plus
the diagnostics consent row, per `diagnostics-consent.ts`'s fail-closed
order (unknown collects nothing, minor needs both rows, a flag can only
subtract collection). Write this before the verification method itself, per
engineering-standards.md section 4 tier 1. Contract test on the `method`
field against `packages/contracts` once a real method is chosen, asserted
on both app and backend sides.

**E16-F3 Family edition data handling**
`parent: E16 | band: GRAY | discipline: Backend | depends on: E16-F1 | blocked by: Q32 | status: Blocked | size: not sized | carries forward: RE-12`

Retention limits, no third-party model calls on children's content without
consent, and a stricter default moderation posture. This is where the
fail-safe policy from E10-F2 stops being a product tradeoff and becomes a
legal requirement, per register 7.1's trade-off statement.

**Implementation**  `feature-flags.md` section 2: `account_class` is a
targeting dimension now that under-13 is in scope, and shipping targeting
logic about children to a device is a bad idea, which is part of why flags
evaluate server-side and the client receives resolved answers rather than
targeting rules. Anything touching minors, consent, moderation or payment
fails closed by the same section's second rule; this feature's retention
and moderation defaults are exactly the flags that rule governs.

**Backend**  Deletion, export and the moderation substrate are built with
the schema per register 7.3, not deferred to this feature; this feature
sets the minor-specific retention limits and the stricter moderation
default on top of that existing substrate, and confirms deletion actually
deletes, including S3 objects, for a minor's account.

**QE (draft)**  Invariant test, launch gate: a minor's diagnostics stay off
without consent (shared with E16-F2, `diagnostics-consent.ts`). Integration
test against a real local Postgres, not mocked SQL, confirming a minor
account's deletion cascades to S3-stored images within the retention window
this feature sets. Tier per engineering-standards.md section 4: tier 1 for
the consent-gate invariant, tier 4 for the deletion-cascade integration
test.

## E17 Monetization

`id: E17 | band: GRAY | board item: "Monitization" | later home: after this phase. Hooks now, selling later | discipline: Product, iOS and Backend | status: New, scope undefined | jira: SCRIBL Epic, not filed`

Gray on the board, and it had no epic until the 2026-08-25 prioritization
session. The kickoff was clear on the shape of it: not freemium forever,
and the paywall hooks belong in the infrastructure for the store release
even if nothing switches on at launch. Nothing in the backlog built those
hooks before this epic, so the release-day decision had no code behind it.

**What survives, and what does not.** The direction was upgraded expression,
resting on a fuller tool set already built and parked. That tool set was
retired 2026-09-01: the client chose the final eight colors, so there is no
richer set behind a flag for a paid tier to unlock. What survives is the
mechanism, not the merchandise: allowed brushes and colors are per-wall
data rather than compiled in, so a paid tier can read that seam instead of
running a second one beside it.

**What this epic is not.** Decision-register.md section 10b names premium
tier as one of four architect-owned decisions with no register entry at
all, undecided rather than decided, carrying a recommendation on the
open-questions list rather than a build-to answer. Neither
`production-backend-plan.md` nor `future-scale-track.md` names a price, a
tier, a store product id, or a subscription model, and this pass does not
invent one. E17's four features are the hooks, and where a source does not
decide the content of the paid tier, that content stays undecided rather
than guessed at. Later home: after this phase, hooks now, selling later,
per the board's own phrasing.

**E17-F1 Define the paid tier**
`parent: E17 | band: GRAY | discipline: Product | depends on: none | blocked by: client decision | status: Blocked, needs a client answer | size: not sized`

What is free forever and what is paid, written down as a list rather than a
direction. The candidate list is inks, brushes, canvas sizes and wall
count. The constraint to hold while deciding: the daily prompt, drawing,
submitting and seeing the wall stay free, since charging for the loop
breaks the habit the product is built on.

**Implementation**  Undecided, and it stays undecided by design.
Decision-register.md section 10b names premium tier as one of four
architect-owned decisions with no register entry at all, undecided rather
than decided, carrying only a recommendation on the open-questions list.
Neither `production-backend-plan.md` nor `future-scale-track.md` names a
price, a tier, or a subscription model; both are silent on monetization
entirely. The earlier assumption behind this feature, that a paid tier
would unlock a fuller tool set already built and parked, no longer holds:
that tool set was retired 2026-09-01, the client's eight colors are final,
so there is nothing richer sitting behind a flag to sell. This feature has
to invent the paid list from a blank state, not surface an existing one.

**Backend**  None; this is a product decision with a client answer as its
blocker, not an engineering task.

**QE (draft)**  Not applicable. Nothing to test until the list exists.

**E17-F2 Store purchase and entitlement plumbing**
`parent: E17 | band: GRAY | discipline: iOS and Backend | depends on: E17-F1, E02-F1 | blocked by: the Apple Developer account, Q5 | status: Blocked | size: not sized`

In-app purchase on the Apple side, receipt validation on the server, and an
entitlement on the account that survives reinstall and follows the user to
a second device. The entitlement is the server's, not the app's, or it is
trivially defeated. This is the "hooks in the infrastructure now, selling
later" half of the board's own phrasing for this epic, and it needs the
Apple Developer account Q5 has been blocking since 2026-08-19.

**Implementation**  A payment SDK entering the binary means a new privacy
manifest and a new subprocessor entry (service-seams.md section 1,
release-readiness.md section 3), same rule E14-F2 applies to AI
disclosures. `feature-flags.md` section 2's second rule, that anything
touching payment fails closed, governs every flag this feature declares:
an unreachable entitlement provider must resolve to no entitlement, never
to a default grant.

**Backend**  Receipt validation and the entitlement record live behind
`routes/` -> `authz/` -> `services/` -> `repositories/` per
architecture.md's dependency rule, same as any other authorization-bearing
resource; the entitlement check itself belongs in the single authz choke
point, not duplicated per feature. No store product id, price, or
subscription model is specified anywhere in the sources checked
(`production-backend-plan.md`, `future-scale-track.md`); this feature
builds the plumbing only, with no product decided to plumb yet beyond what
E17-F1 eventually names.

**QE (draft)**  Invariant-adjacent test: an unreachable entitlement
provider must fail closed to no entitlement, written before the receipt
validation logic itself per engineering-standards.md section 4 tier 1's
rule for anything the flag system touches. Contract test on the entitlement
shape against `packages/contracts`, asserted on both app and backend, once
E17-F1 names what the entitlement actually grants.

**E17-F3 Entitlement checks on the existing tool seam**
`parent: E17 | band: GRAY | discipline: iOS and Backend | depends on: E17-F2, E17-F1 | blocked by: none | status: New | size: not sized`

The allowed brushes and colors are already data per wall rather than
hardcoded, so a paid tier reads that seam instead of running a second
gating mechanism beside it. Entitlement widens the allowed set; the free
set is what E04-F1 ships. This feature now depends on E17-F1 rather than on
a built-and-parked tool set, because the richer set that was supposed to
sit behind the flag was retired 2026-09-01. There is nothing to widen the
allowed set to until E17-F1 says what the paid tier contains.

**Implementation**  Undecided until E17-F1 closes. Plumbing an entitlement
check that gates access to the same eight colors everyone already has is
work with no product behind it, and the epic body says so directly; this
fragment does not invent a richer set to fill that gap.

**Backend**  The read path is `allowedBrushStyles` and `allowedColors` as
per-wall data (register 10, E18's parked-mechanism note); entitlement
widens which values a given account's request resolves to, through the one
authz choke point, not a second check living in the client.

**QE (draft)**  Not fully specifiable until E17-F1 names the paid content.
Once it does, a contract test against `packages/contracts` asserts the
entitlement-widened set and the free set never disagree between app and
backend, and a unit test on the selector that resolves allowed tools from
entitlement plus wall data lives in `lib/` or `selectors/` per
engineering-standards.md section 4 tier 3.

**E17-F4 Paywall surfaces and the experiment harness**
`parent: E17 | band: GRAY | discipline: iOS | depends on: E17-F2, E08-F2 | blocked by: none | status: New | size: not sized`

Where the offer appears, and the ability to change it without shipping an
app update. The kickoff asked for before-and-after and multi-variant
paywall testing, so the surface is remotely configured and every step is
instrumented against the event taxonomy in E08-F1. A paywall with no funnel
behind it cannot be tuned, only guessed at, which is why this feature
depends on E08-F2.

**Implementation**  This is an experiment-kind flag per feature-flags.md
section 1's four kinds table, and register 10 lists "experiment and A/B
infrastructure" as explicitly not implemented in this phase, only left room
for in the flag interface. This feature is the first thing to actually
implement that kind, not reuse an existing one. No variant, offer copy, or
price point exists anywhere in the sources checked; this feature builds
the harness, not the paywall's content, since E17-F1 has not named what is
being sold.

**Backend**  Flags evaluate server-side per feature-flags.md section 2's
third rule; the client receives a resolved variant, never targeting rules,
same reasoning the register gives for `account_class` in E16. Anything
touching payment fails closed, so an unreachable flag provider must resolve
to the no-paywall variant, not a default-on offer.

**QE (draft)**  Contract test on the variant-resolution shape against
`packages/contracts`. Component tests on paywall-surface behaviour, not a
snapshot of its markup, per engineering-standards.md section 4 tier 5. The
funnel-instrumentation event names must exist in E08-F1's taxonomy before
this feature can claim its own acceptance criteria met, since an
uninstrumented paywall step is invisible by the epic body's own argument.

## E18 Parked capability

`id: E18 | band: GRAY | board item: none | later home: named per feature below | discipline: iOS and Product | jira: SCRIBL Epic, label parked`

The new designs made the app simpler. This epic holds what the POC built and the
product then set aside, so the simplification is recorded as what it actually is,
a reduction in surface rather than a deletion of code.

Two things are parked here now, voice notes and Artifacts. Three others were
retired on 2026-09-01, and the reasons are below. One mechanism from the retired
work is worth keeping, the per-wall restriction seam, `allowedBrushStyles` and
`allowedColors` as data. That seam is how E04-F1's palette is expressed today,
and it is what a future wall type would use to ask for different tools. It earns
its place on its own rather than as the door to a parked tool set.

**Where each re-enters.** Voice notes re-enter the moment the client reconciles
their own frames with their own board decision (Q18). Artifacts re-enter with
Beta, where key decision 6 parked them (Q19).

**What parked costs to keep.** `feature-flags.md` names these as kill
switches, permanent by kind, not release flags with a removal date.
`engineering-standards.md` says to delete as readily as you add; a kill
switch that has sat off for a month
is exactly the tension that principle does not resolve on its own, since deleting
the flagged-off code removes the ability to respond to an incident with it, and
keeping it means carrying dead paths through every dependency upgrade and every
boundary check. This page does not decide that tension for voice notes or
Artifacts. It names it so a later planning pass makes the call on purpose.

**Retired on 2026-09-01.** Three features left this epic on Rob's direction.
They are recorded here rather than deleted quietly, because a feature that
vanishes with no trace reads later as an oversight. The three ids are retired
rather than reused, so a later feature under E18 takes the next free number
instead of stepping into a vacated one.

`E18-F1` Full drawing tool set behind the flag. The feature specified four brush
styles, sixteen colors, six sizes and a fill tool behind
`EXPO_PUBLIC_FULL_TOOLSET`. No such tool set was ever decided. The client chose
the tools and the colors the app ships with and that choice is final, so there is
no richer set parked behind a flag waiting to be turned on. What is real, and what
stays, is the per-wall restriction seam, `allowedColors` and `allowedBrushStyles`
as data. E04-F1 now carries the client's decision outright instead of describing
it as a reduction from a fuller set.

`E18-F2` Challenges. The capability arrived instead as prompt packs plus a wall
creator's own prompt, which is what C15 asked for when it recorded "for the time
being, we'll just trim it down to prompt injection" and said this feature needed
splitting. The prompt-pack half shipped in the POC and is filed as its own
features under E03. Nothing is left parked. The blind draw-off, the
server-enforced blindness and the leaderboard were the parts the product dropped.

`E18-F5` AI enhancement pipeline. Built in the POC, disabled at Scribl's request,
and never turned back on. It is not parked pending a decision, the decision was
taken. One structural property is worth remembering if it ever returns: drawing
bytes never reached an image model, only the Claude-produced caption crossed that
seam.

**E18-F3 Voice note store and replay**
`parent: E18 | band: GRAY | discipline: iOS and Backend | depends on: E04-F3 | blocked by: Q18 | status: Blocked | size: 4 to 5 days across two lanes | carries forward: RE-05`

Record up to 30 seconds, upload the raw file, encode server-side with fixed
arguments, store the compact result, replay it from the wall. Specified end
to end in the POC realignment plan section 4 and shovel-ready on purpose: it
does not enter a sprint until the client resolves the conflict between their
frames, which show Record twice, and their board, which cut voice memos from
the MLP (Q18). This is a stored replayable message, not the POC's
transcription input, so it is greenfield rather than a port.

`feature-flags.md` section 2 names "disable voice upload" as its own
kill-switch example, permanent rather than release-scoped: once this ships,
turning it off in an incident does not remove the capability, it removes the
ability to respond to one, so it should not be deleted after rollout the way
a release flag would be.

The web build is ahead of this feature's own framing. Real capture, real
upload, and server-side byte and duration clamping already exist on web
(`record` screen), while native has nothing; the doc comment in
`src/lib/storyLimits.ts:6-7` still calls voice capture stubbed, which
understates what shipped. E18-F6 is the native gap this feature does not
price separately.

The `response-id` detail screen renders the voice-note player when this
feature ships; it currently also renders an original-and-enhanced toggle
that belongs to E18-F5, retired 2026-09-01, and that toggle should come out
regardless of this feature's own schedule.

**Backend**  `POST /audio` stores the uploaded recording; encoding with fixed
arguments and the compact-result storage happen server-side, in `effects/`,
not the client.
**Reads/writes**  a successful upload writes `audioRef`, `audioMime`, and
`audioDurationMs` to the draft; a failed upload or re-record clears the same
fields and keeps the person on the recording screen.
**QE (draft)**  Contract test, tier 2: the audio upload response shape
matches `packages/contracts`. Component test: an unsupported browser shows
the fallback message and a disabled submit control rather than a silent
failure. Kill-switch test: disabling voice upload removes the record
affordance without touching the write path in E04-F3.

Source: [record screen page](/prototype/screens/record), [story-select
screen page](/prototype/screens/story-select), [onboarding story select
screen page](/prototype/screens/onboarding-story-select), [response detail
screen page](/prototype/screens/response-id)

**E18-F4 Artifacts and keepsake composition**
`parent: E18 | band: GRAY | discipline: iOS and Backend | depends on: E05-F4 | blocked by: Q19, Q20 | status: Blocked | size: not sized | carries forward: RE-F2`

Select tiles on a wall and compose a shareable keepsake from them. It is in
the client's prototype flow, their own key decision 6 parked it for Beta
(Q19), and the ownership boundary against earlier keepsake work is also
unresolved (Q20). Two open questions on one feature is reason enough not to
plan it in yet.

Eric's 2026-08-25 screen feedback adds detail on top of Q19 and Q20. Open:
whether the Artifact is in the MVP at all, and to what extent; discovery was
done with Mission to automate it, but automating it needs more work to get
right. Decided already: a manual option, where a person chooses, arranges,
and manipulates the art, has proven engaging, and that is what the POC's
`compose` screen actually built, ahead of this feature's own gray status.
The feedback names why this matters past the screen itself: it is a
rewarding ending to the experience, it adds content-creation and sharing
options, replay value and retention, possible future monetization, and
event display options (E15 names ReInvent explicitly). See
`knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`.

**Frontend**  Skia stage with move, corner-scale, and rotate handles over
placed drawings, a tray of picked source drawings, undo, clear, Save, and
Share; a guard message replaces the stage when fewer than two drawings are
picked. E12-F2 owns the multi-select interaction that feeds this screen and
is built once for both.
**Backend**  a compositions endpoint that derives the destination channel
from the caller's identity server-side, in `authz/`, and re-checks
membership and prior submission before accepting a save or share, so this
does not open a second path around E04-F5's existence check.
**Reads/writes**  reads the selected source drawings on entry; Save clears
the compose selection and returns to family; Share routes to the share
screen with the saved response's fields; a failed save keeps the tray
intact for retry.
**QE (draft)**  Once Q19 and Q20 resolve: invariant test, tier 1, that the
compositions endpoint's authorization re-check cannot be bypassed by a
caller who supplies someone else's channel id. Component test: fewer than
two picked drawings shows the guard message, not the stage.

Source: [compose screen page](/prototype/screens/compose)

**E18-F6 Capture a voice note on a native build**
`parent: E18 | band: GRAY | discipline: iOS | depends on: E18-F3 | blocked by: Q18 | status: Blocked | size: not sized`

Voice capture works on web and does not exist on native, where support
detection can only ever say not available. E18-F3 prices voice notes as
greenfield without naming that platform split; this feature is that gap,
native recording, encoding trigger, and upload, once Q18 lets voice ship at
all.

The React Native autolinking risk in `toolchain.md` section 1 applies here:
native audio capture pulls in a native module, and pnpm's symlinked store is
the fragile case for autolinking on a native build. `node-linker=hoisted` is
the documented fallback if autolinking breaks, but it forfeits the strictness
pnpm was chosen for, so it is a fallback to reach for, not a default to plan
around.

**Frontend**  native mic capture with the same 30 second cap, countdown, and
re-record affordance the web `record` screen already has, using whichever
native audio module survives the autolinking check above.
**Backend**  none beyond `POST /audio`, already specified in E18-F3.
**Reads/writes**  same draft fields as E18-F3: `audioRef`, `audioMime`,
`audioDurationMs` on success, cleared on failure or re-record.
**QE (draft)**  Component test on native: recording, uploading, and the
30 second cap behave the same as the web `record` screen's happy path.
Build-time check: a prebuild with `node-linker=hoisted` is exercised at
least once in CI if the native audio module's autolinking is unresolved by
launch, so the fallback is proven rather than assumed.

Source: [record screen page](/prototype/screens/record)

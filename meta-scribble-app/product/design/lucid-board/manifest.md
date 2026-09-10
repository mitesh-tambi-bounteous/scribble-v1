---
title: Lucid board manifest
description: Build spec for the Bounteous section of the client-shared Scribl Lucid board.
updated: 2026-08-20
---

# Lucid board manifest

This is the build spec for the section we are adding to the Scribl Lucid board
that the client can see. It is written so someone who has never read this repo
can build it. Every item names its source file, what shape it takes on the
board, and who it is for.

Six frames. That is the recommendation and the cut is deliberate. A board nobody
can read at a glance is worse than four good frames, and the section that
follows the frames lists what was left off and why.

Read the exclusions section before you build anything. Some of the source files
next to the ones named here carry cost and contract material that must not reach
this board.

## The seam with the client's own board

The 2026-08-19 kickoff board already exists and it belongs to the client. It
carries the three prioritization bands, GREEN "FIRST, carries the daily loop",
ORANGE "NEXT, the real conversation, what earns a sprint slot", and GRAY
"OUTSIDE these 8 weeks, each has a later home, none are dropped", with twelve
items across them. The band wording above is quoted from
`tracking/backlog-epics.md`, which read the board verbatim on 2026-08-20.

Do not redraw the bands. Do not restate the twelve items. Do not rebuild their
agreements tracker or their capacity note.

Our section extends theirs in one direction. Their board says what matters. Our
section says what it decomposes into, what it looks like, what it runs on, and
what is blocking it. Frame 3 is the join. It maps their twelve items onto our
fifteen epics and shows the three epics that are ours and not on their board.
Every reference to a band should use their colors and their words so the two
sections read as one board.

One caveat for the builder. This repo records that the client board exists and
what its bands say, sourced through `tracking/backlog-epics.md` and
`knowledge/meetings/2026-08-20-kickoff-walkthrough.md`. It does not hold an
export of the board. Open the live board and check the current state of the
bands, the agreements tracker and the capacity note before placing anything, so
the seam lands against what is actually drawn there today.

## Frame 1. What we are building it on

What it is. The AWS architecture, in two layers on one frame. Layer one is the
eight-week build. Layer two is the scale destination.

Source. `docs/public/assets/context/scribl-aws-architecture-d2c.png` is the
rendered diagram asset, with the original at
`s2d/inputs/reference/poc/architecture/Scribl_AWS_Architecture_D2C.png`. The
narrative and the canonical Mermaid mirror are in
`s2d/context/pages/reference/poc/architecture/README.md`. The eight-week layer
comes from `s2d/production-backend-plan.md`.

Shape. The PNG placed as an image, at the top. Below it, a two-column table
block. Left column "Building now, weeks 1 to 8", right column "Scale
destination". Rows: compute, database, AI, regions, analytics. Left column
values, API Gateway plus Lambda, Aurora Serverless v2, no AI lanes in this
phase, one region us-east-2, PostHog. Right column values, EKS, Aurora at scale,
Bedrock-fronted Claude, Ohio then London then Singapore, warehouse and data lake.

Why it earns space. The client sees one architecture picture in circulation and
assumes it is the plan for the next eight weeks. It is not. Showing both layers
on one frame prevents the most expensive misunderstanding available on this
engagement.

Audience. Client-facing.

Builder note, load-bearing. The README and
`s2d/context/future-architecture-aws.md` both carry a 30-month cost model
alongside this diagram. Take the diagram and the component names only. No dollar
figures reach this board.

## Frame 2. What the screens look like

What it is. The 23 client Figma frames in flow order, with a strip of the seven
live POC screenshots underneath.

Source. `s2d/design/figma-exports/`, 23 PNGs. Live screens at
`s2d/inputs/scribl-live-screens-2026-07-20/`, 7 PNGs. The flow order is section
3 of `s2d/design/poc-realignment-plan.md`, confirmed by stepping the client's
own prototype.

Shape. Four horizontal rows of images, one row per flow, each image labelled
with its filename. Then a separate labelled strip for the live screens.

Row A, invite and install. `Invite.png`, `App Icon.png`.

Row B, first-run onboarding. `Title Animation.png`, `Intro - What is.png`,
`Intro - Prompts.png`, `First Canvas.png`, `First Canvas Finished.png`,
`Story Input Select.png`, `Story Input Blank.png`, `Story Input Complete.png`,
`Wall Explanation.png`, `Wall Example.png`, `Get Started.png`.

Row C, the daily loop. `Title Animation 2.png`, `Daily Prompt.png`,
`Daily Prompt Blank.png`, `Daily Prompt Finished.png`,
`Daily Prompt Story Blank.png`, `Daily Prompt Story Complete.png`,
`Dashboard.png`, `Family Wall.png`.

Row D, artifacts, parked for Beta. `Artifact Select.png`,
`Artifact Created.png`.

Live strip, running POC today. `01-signup.png`, `02-home.png`, `05-canvas.png`,
`06-tutorial.png`, `06-write.png`, `09-wall-family-full.png`,
`10-drawing-detail-full.png`.

Why it earns space. It is the client's own design, played back in the order they
built it, next to what actually runs today. The gap between the two rows is the
work, and it is easier to see than to describe.

Audience. Client-facing.

Builder note. Put a caption on row A through D reading "Your frames, flow order
confirmed against your prototype. Wireframe styling, not the target theme." The
frames are drawn on a dark ground and the target theme is paper-light, per
section 6 of the realignment plan. Row D carries a "parked for Beta, Q19" tag.

## Frame 3. Epics and features, mapped to your bands

What it is. The fifteen epics and their feature counts, grouped under the
client's own three bands, plus the three epics that are ours.

Source. `tracking/backlog-epics.md`. The board mapping table in that file is the
exact join between their twelve items and our epics. The rendered interactive
version is `docs/public/assets/backlog/scribl-backlog-epics.html`.

Shape. Three columns, colored to match their GREEN, ORANGE and GRAY bands, each
epic a card carrying its code, its name, its feature count and the board item it
came from.

GREEN. E01 cloud foundation and app shell, 9 features. E02 auth and onboarding,
6. E03 daily prompt, 5. E04 drawing and submit with submit-to-unlock, 6. E05
walls and channels, 6. E06 QA foundation and standards, 7. E07 build, signing
and tester distribution, 5. E08 analytics instrumentation, 4, moved here from
orange because the kickoff board has it as a green sticky.

ORANGE. E09 push notifications, 4. E10 moderation fail-safe, 5. E11 streaks and
progression, 4. E12 sharing a response, and a wall, as a document, 5, opened
2026-08-25. E13 comments, with the wall creator as moderator, 5, opened
2026-08-25.

GRAY. E14 App Store readiness and compliance, 4, later home the release phase
after sprint 3. E15 re:Invent event wall, 3, later home its own scope and
funding call. E16 under-13 and COPPA family edition, 3, later home post-launch
planning. E17 monetization, 4, opened 2026-08-25, later home hooks now, selling
later.

A fourth narrow column, "Ours, not on your board". E06 and E07, marked as
additions we are arguing for. E18 parked capability, 5 items, marked "already
built, switched off, not deleted", which covers challenges and the full drawing
toolset.

Why it earns space. Their board says what matters and stops there. This is the
first artifact that says how much work each of those twelve items actually is,
and it names the two things we are adding that they did not ask for.

Audience. Client-facing.

Builder note. Add a linked card pointing at the rendered backlog page rather
than pasting 71 features onto the board. Add a one-line note that the future
home is Jira project SCRIBL and that client visibility of that board is still
unresolved, Q52.

## Frame 4. Open questions, with an owner on every one

What it is. The questions Scribl needs to answer, as cards a person can be
assigned to on the board.

Source. `tracking/open-questions.md`. Use the "Client-facing extract" section at the
end of that file, which is 26 numbered items already vetted as client-safe, and
carries the Q-number for each. Do not build this frame from the main tables
higher up the page, because eleven of those rows are marked internal.

Shape. Sticky cards in four swimlanes, matching the extract's own grouping. Each
card is one question, in this layout.

```
Q5
Will Scribl set up an Apple Developer
account, and when?
------------------------------------
Owner:            [ empty, assignable ]
Answer by:        [ empty date field  ]
Blocks: TestFlight, signing, App Store
```

Lane 1, "We need these first, work is running now". Q1 canvas dark or
paper-white, Q2 four brush sizes or one, Q3 splash animates or ships static, Q4
the muted text color, Q5 the Apple Developer account, Q7 confirm sprint 1 starts
2026-09-02.

Lane 2, "Before the next block of work". Q8 fund the invite landing page or
simplify to codes, Q9 deep linking from an invite, Q10 the Get Inspired path,
Q11 is guided onboarding in the first block, Q12 the Your Stats numbers, Q13 the
analytics and success metrics list, Q14 Christina's fall availability, Q15 which
screens Christina fully designs, Q16 direct Figma access, Q17 whose AWS
environments.

Lane 3, "Cannot be planned until answered". Q18 voice memos, the frames show
Record and the board cut it, Q19 are artifacts still parked.

Lane 4, "Added 2026-08-20, the iOS shipping questions". Q44 is iPad in scope,
Q46 how many beta testers inside and outside, Q56 App Store submission or
TestFlight at the end of this phase, Q50 how many users to build and cost the
backend for and in which regions, Q49 who pays for AWS hosting this phase.

Plus two low-urgency cards off to the side. Q22 who is the product owner on
Scribl's side, the board card still has a question mark on it. Q28 is the mascot
part of the brand or was it deck art.

Ownership is the point of this frame. Every card gets an empty owner field that
someone fills in the meeting. Rob named the four he wants visible and they are
all here. Apple App Store account is Q5, owner Eric Rice with Matthew Kaplan if
it needs a signature. Google Play has no separate row, it is folded into Q5, so
build the Q5 card with two owner slots, one Apple and one Google Play, and say
in the meeting that Google Play is out of scope this phase because this phase is
iOS only. The client's AWS "where do we start" question is Q17, paired with Q49
on who pays. Device procurement for testing is ours, it is Q51, and it is marked
internal in the source file, so it goes on the board as one card in our own
column reading "Physical iOS test devices, Bounteous to raise internally, owner
Pramod Kumar", with no further detail.

Why it earns space. Sixty-two questions live in a markdown file with a named
owner each, and none of that ownership is visible to the client. Putting the
client-facing 26 on the board with an empty owner slot turns a list into a
working session.

Audience. Client-facing. The device procurement card is ours, shown to them as a
commitment we are making, with no internal detail attached.

## Frame 5. The eight weeks, on a calendar

What it is. The delivery shape, as dates.

Source. `tracking/backlog-epics.md` header and capacity section. Build starts
2026-08-24, two discovery weeks, then three two-week sprints. Sprint 1 start
2026-09-02 is Q7 and is unconfirmed. Wednesday demo cadence is from
`knowledge/meetings/2026-08-19-kickoff.md`. The re:Invent target of roughly
2026-12-05 is from `knowledge/meetings/2026-07-14-workshop.md`.

Shape. A horizontal timeline, eight weeks left to right, with the two discovery
weeks and three sprint blocks marked, a demo marker on each Wednesday, and the
re:Invent date as a milestone at the far right outside the eight weeks.

Why it earns space. Nothing else on either board turns the eight weeks into
dates. Q7 is a live question about whether sprint 1 slips a week, and the answer
pushes the final demo to 2026-10-21 which is past the end of the engagement.
That consequence is invisible in prose and obvious on a timeline.

Audience. Client-facing.

Builder note. Do not put person names, lanes, or person-week numbers on this
frame. The capacity arithmetic in `tracking/backlog-epics.md` is internal
staffing detail, see the exclusions.

## Frame 6. Decisions that bind, and two that are open

What it is. The short list of architectural decisions that constrain everything
else, and the two that are genuinely unresolved.

Source. `s2d/inputs/reference/decisions/`, ADRs 0001 to 0011.
`s2d/production-backend-plan.md` for what is current and what the open
divergences are.

Shape. Two stacked sticky clusters. Cluster one, "Settled", one sticky each.
React Native and TypeScript, one codebase, ADR 0001. Skia for the drawing
canvas, ADR 0006. Aurora Serverless v2 Postgres as the system of record, ADR
0004 as revised. AWS CDK for all infrastructure, ADR 0005. Submit-to-unlock
enforced server side, ADR 0007.

Cluster two, "Open, and we need a call", each with an empty owner slot. Lambda
or EKS for the application tier, ADR 0002 says one and the target architecture
says the other, and the backend plan says it needs explicit sign-off. Claude
direct API or Bedrock, ADR 0009 defaults to direct and the AWS funding
relationship may push it to Bedrock.

Why it earns space. Submit-to-unlock is the product's core rule and it is
enforced in the database, which is worth the client understanding. The two open
calls have owners nowhere and both get more expensive the longer they sit.

Audience. Client-facing, with one caveat for Rob. The Bedrock question touches
the AWS funding relationship, so confirm the framing before it goes up.

Builder note. Do not put all eleven ADRs on the board. Six of them are either
superseded or describe AI lanes that do not ship in this phase, and they would
read as active commitments.

## What must not go on this board

These are files, not categories. None of the content below reaches a
client-shared surface.

| File | Why it is excluded |
|---|---|
| `s2d/sow-mobile-app-development-extract.md` and `docs/sow-mobile-app-development-extract.md` | The signed fixed fee, the payment schedule, and termination and change-order terms |
| `s2d/inputs/scribl-bounteous-sow-mobile-app-development.pdf` | The signed contract itself |
| `s2d/inputs/reference/poc/architecture/cost-model.md`, and its copies at `s2d/context/pages/reference/poc/architecture/cost-model.md` and `docs/context/pages/reference/poc/architecture/cost-model.md` | 30-month AWS and Bedrock cost model, per-pillar monthly run rates, vendor unit rates |
| `s2d/inputs/scribl-d2c-aws-estimate-v3.xlsx` and `s2d/inputs/reference/poc/architecture/Scribl-D2C-AWS-Estimate-v3.xlsx` | The cost workbooks behind that model. The two files differ from each other, which is its own problem |
| `s2d/context/data/scribl-d2c-aws-estimate-v3.md` and `docs/context/data/scribl-d2c-aws-estimate-v3.md` | The rendered cost estimate, per-feature Claude call volumes and cost share |
| `s2d/context/future-architecture-aws.md` and `knowledge/research/scribl-poc-aws-architecture.md` | Carry the same TCO tables alongside the architecture narrative. The diagram is fine, these two files are not |
| `s2d/inputs/reference/technical-implementation-plan.md` section 9 | Per-model token pricing and monthly cost projections at 1k, 10k and 50k DAU |
| `s2d/inputs/reference/engagement-approach.md` | Our internal rationale for taking the deal and the on-spec economic structure |
| `s2d/inputs/reference/discussion-topics.md` | Internal deal-structuring prep |
| `s2d/inputs/reference/scribl-team-model.md` | Our staffing plan, roughly 6.0 FTE, roles and capacity economics |
| The capacity arithmetic section of `tracking/backlog-epics.md` | Named people against person-weeks per sprint. The epic and feature content of that file is fine, this section is not |
| `docs/meetings/schedule-plan.html`, both the version on `main` and the one on branch `scribl-schedule-rev2` | Our internal ceremony cadence and a capacity read |
| `knowledge/meetings/2026-08-18-alignment.md` and its docs copy | Internal only. Names the QA hiring gap and its owner, and carries internal framing about scope versus what the client gets |
| `knowledge/meetings/2026-08-20-kickoff-walkthrough.md` and its docs copy | Internal only, no client attendees. Candid assessments of the POC and of Mission Cloud's exit, named access and scheduling friction, and our own Claude subscription detail |
| `knowledge/meetings/scribl-approach-discussion.md` | Internal call about the Anthropic funding pitch and a candid read of Claude product usage |
| `knowledge/meetings/raw/**` | Full call transcripts |
| `reviews/**` and `docs/reviews/**`, all eleven files | Internal retrospectives by design. Treat the directory as excluded rather than picking safe paragraphs out of it |
| `CLAUDE.md`, `.claude/**`, `patterns/**`, `scripts/**` | How we run this brain. Internal tooling and workflow, not client subject matter |
| `s2d/inputs/reference/poc/project-dna/CLAUDE.md` and `AGENTS.md` | Our build guardrails for the POC repo |
| `tracking/open-questions.md` rows Q36, Q48, Q51, Q52, Q53, Q54, Q55 | The seven rows whose owner column reads internal. Q36 concerns whether the scope characterization holds against the additional-budget conversation. Q54 is an access problem. Q48 is our own untaken decision on the testing bar. Q51 is device procurement, which reaches the board only in the sanitized form described on frame 4. Build frame 4 from the client-facing extract at the end of the file and from nothing else |
| `s2d/context/documents/scribl-d2c-mlp-prfaq.md` | Marked "Confidential, Internal Working Document". Its launch dates, its placeholder testimonial and its pricing lines are draft and would read as commitments |

Note on wording. Several questions appear twice in the source file, once as a
detailed table row and once in the client-facing extract. The extract wording is
shorter and already written for the client. Use the extract wording, never the
table row.

## Needs Rob's call

- `s2d/inputs/reference/client-summary.md`. A pre-engagement brief about the
  client, written for us and not for them. Reads harmless and is not addressed
  to them.
- A "who decides what" card. The decision owners on both sides are genuinely
  useful on a board and would clear Q22. The blocker is that the same source,
  `knowledge/team/roster.md`, carries our staffing gaps. If Rob wants it, build
  it as decision owners only, no headcount, no gaps, no availability.
- `s2d/context/documents/scribl-d2c-mvp-scope.md`. Scope content that overlaps
  the confidential PRFAQ and carries internal MVP-cut reasoning.
- The Bedrock versus direct API sticky on frame 6, because it touches the AWS
  funding relationship.
- `knowledge/meetings/2026-07-14-workshop.md`, the client's own scale-up hiring
  ask. It is their statement, taken from a private call.

## What I left off, and why

- Cost and budget of any kind. There is a real client question about what
  running this costs, Q50, and it is on frame 4 as a question. The answer does
  not go on a shared board.
- The POC design history, `s2d/context/design-history/`. Three superseded design
  stages. Interesting to us, confusing to them, and it invites a conversation
  about decisions already made.
- The roster as an org chart. See the Rob's-call section.
- The eleven ADRs in full. Six are superseded or describe AI lanes this phase
  does not ship. Frame 6 carries the five that bind.
- `s2d/handbook/**`. Generic agile process with no Scribl content in it.
- The 23 stories in `tracking/stories/`. POC-era work items on a different track
  from the eight-week plan, and S-020 still reads as though challenges are live
  when they are parked.
- `tracking/board.md` and `tracking/roadmap.md`. Accurate for the POC and
  predate the kickoff, so on a board next to the eight-week plan they would read
  as contradiction.
- A glossary. Nothing in this product needs one.

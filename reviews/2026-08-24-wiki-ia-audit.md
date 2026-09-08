---
title: Wiki IA audit
date: 2026-08-24
status: decision-ready
type: review
---

# Wiki IA audit

The wiki as an information architecture, audited page by page, with a
recommended revamp. Nothing is applied in this pass. Every count and citation
is against `7040fd7`, the tip of `main` at the time of writing: 171 markdown
pages under `docs/`, `npm run docs:build` green with `ignoreDeadLinks: false`.

Three facts from the brief have moved since it was written, so the verdicts
below target the measured tree, not the brief's snapshot:

- `docs/lucid-board-manifest.md` no longer exists. Commit `2f40f2b` removed it.
- The `net-new` stub is gone from both `handbook/` and `docs/handbook/`.
- ADR 0004 is now `0004-aurora-serverless-system-of-record.md`, not
  `0004-dynamodb-single-table.md`. The rename is the one properly handled
  supersession in the ADR set.

One warning before anything else. This file lands in `reviews/`, and
`scripts/docs-sync.mjs:62` syncs `reviews/` onto the site. Section 6 below
quotes the exact lines a client should not see. Until step 2 of the execution
plan lands (reviews leave the render), do not run `npm run docs:sync`, or this
audit itself becomes a client-visible page.

## 1. The spine

### What it is today

The sidebar (`docs/.vitepress/config.ts:75-160`) has six groups: Start Here,
Discovery & Design, Research, Workshops, Build & Delivery, Toward Production.
Two whole trees render but appear in no sidebar and no nav:
`sidebar.mts:145-161` exports `buildStoriesSidebar` and `buildReviewsSidebar`,
and `config.ts` never imports either. So 25 story pages and 14 review pages are
reachable only by URL or by inbound link. Meanwhile
`docs/design/poc-realignment-plan.md`, which `docs/onboarding.md:43` calls the
single highest-value read in the repo, has no nav or sidebar entry at all.

The deeper problem is that the sidebar mirrors source directories, not reader
questions. "Discovery & Design" is the `context/` grab-bag: the ADRs sit five
URL segments deep at `/context/pages/reference/decisions/0001-...`, behind two
collapsed disclosure levels labeled "Reference" then "Decisions". "Toward
Production" mixes the current plan of record (`backlog-epics`, epics) with
three generations of superseded planning (`production-backlog`,
`expo-rebuild-epics`, `production-sprint-backlog`) and gives the reader no way
to tell which is live. And nothing separates what a client may read from what
is internal: the top-nav Knowledge link lands on `docs/knowledge/index.md`, an
unfiltered generated listing whose rows include the team roster with personal
emails and two verbatim meeting transcripts.

### What it should be

Two rules drive the shape. First, the site is organized by reader question
(what is this product, what are we building now, why is the architecture this
way, how do we work, what was said in meetings), not by source folder. Second,
internal-only material does not render at all; it stays in the source tree.
De-navving is not enough because VitePress serves every file under `docs/`
whether or not the sidebar links it.

Recommended nav:

```
Home | Onboarding | The Plan | Open Questions | Standups | Workshops | Knowledge
```

Recommended sidebar:

```
Start Here
├── Home                        /
├── Onboarding, the reading path  /onboarding        (rewritten, see S2)
├── Project Overview            /overview            (rewritten)
└── The Story                   /story               (rewritten)

The Product
├── Full-App Spec               /scribl-full-app-spec  (POC-era banner)
├── POC Realignment Plan        /design/poc-realignment-plan  (currently orphaned)
├── PRFAQ                       /context/documents/scribl-d2c-mlp-prfaq
├── MVP Scope                   /context/documents/scribl-d2c-mvp-scope
├── Design History (group)      /context/design-history/*  (absorbs /context/media/*)
└── Input Artifacts             /input-artifacts

The Plan (live build)
├── Status and Roadmap          /roadmap             (absorbs /status)
├── Board                       /board
├── Sprint 0                    /sprint-zero
├── Creating the Backlog        /backlog-epics
├── Epics (banded groups)       /epics/*             (as today, reformatted)
├── Stories                     /stories/*           (wire buildStoriesSidebar in)
├── Timeline and Milestones     /timeline-and-milestones
├── Client Priority to Delivery Week  /client-priority-to-delivery-week
├── Epic to Board Mapping       /epic-board-mapping  (absorbs /jira-board)
└── Open Questions              /open-questions

Architecture & Decisions
├── Decisions (ADRs 0001-0011)  /context/pages/reference/decisions/*  (hoisted; URLs unchanged)
├── Production Backend Plan     /production-backend-plan
├── Target AWS Architecture     /context/pages/reference/poc/architecture/  (the README)
├── Cost Model                  /context/pages/reference/poc/architecture/cost-model
├── Future Architecture (AWS)   /context/future-architecture-aws  (rewritten, thin)
├── Enhancement Pipeline (pair) /context/pages/reference/poc/architecture/{mission-cloud,our}-enhancement-pipeline
├── Future Scale Track          /future-scale-track
├── Technical Implementation Plan  /context/pages/reference/technical-implementation-plan  (banner)
├── Android Distribution        /android-distribution
└── iOS Distribution            /ios-distribution

How We Work
├── Handbook Home               /handbook/
├── (the 11 handbook pages, as today, minus team-process)
└── Story/AC Kit                /handbook/story-ac-kit/  (minus the two machine templates)

Meetings & Workshops
├── Standups                    /knowledge/meetings/standups  (scrubbed)
├── Meeting digests             /knowledge/meetings/*  (client-attended meetings only)
├── Workshop retros             /knowledge/wiki/sources/*  (as today)
└── Knowledge index             /knowledge/  (curated landing, from knowledge/README.md)

Archive (collapsed, every page carries a superseded banner)
├── Production Starter Backlog  /production-backlog
├── Expo Rebuild Epics          /expo-rebuild-epics
├── Production Sprint Backlog   /production-sprint-backlog
├── Client Summary (June)       /context/pages/reference/client-summary
├── Engagement Approach (June)  /context/pages/reference/engagement-approach
├── Discussion Topics (June)    /context/pages/reference/discussion-topics
└── Architecture Plan signpost  /context/pages/reference/architecture-plan
```

Leaves the render entirely (source stays in the repo): all of `reviews/`, both
raw transcripts, `knowledge/team/roster.md`, `knowledge/PROVENANCE.md`,
`knowledge/wiki/log.md`, the six `knowledge/research/` digests, the internal
meeting digests (2026-08-18 alignment, 2026-08-20 walkthrough, the 2026-06-09
approach discussion), both SOW pages, the raw AWS estimate workbook page, the
POC handover, `context/pages/README.md`, `arc-ideation-readme.md`,
`scribl-team-model.md`, the approach digest, both `project-dna` agent files,
`board-selection.md`, and the two story/AC kit machine templates. Section 2
has the page-level rationale; section 7 has the mechanism (docs-sync exclude
list plus `git rm` of the rendered copies, since docs-sync never prunes).

Almost all of this spine is a `config.ts` sidebar restructure. No URL moves,
so no dead links. The ADR hoist is the clearest example: the pages stay at
their deep URLs, and only the sidebar entry moves to top level. Renaming the
`context/pages/reference/` path to something shallower would be nicer but
costs a full link-fix sweep across 40+ inbound links; not worth it this pass.

On the three open decisions the brief names: the `net-new` stub and the
lucid-board manifest are already resolved on `main` (both gone). For
`patterns/`, this morning's structure audit says WIRE it onto the site. I
disagree now that the client boundary exists: `patterns/multi-repo-roled-brain.md`
is methodology-engine content with zero client value, and wiring it in adds
one more internal page to police. Keep `patterns/` repo-only.

## 2. Page-by-page verdict

Verdicts: KEEP (stays as is), CUT (leaves the rendered site; source file stays
unless noted), MERGE INTO target, MOVE TO target, REWRITE (stays at its URL,
content or generator changes). For generated pages the action lands on the
source file or on `scripts/docs-sync.mjs`; the path cited is the site page.

Tally: 52 KEEP, 42 CUT, 10 MERGE, 67 REWRITE (40 of the REWRITEs land in
`scripts/docs-sync.mjs` rather than in page content: the 16 epic pages, the
23 story pages, and the stories index).

### Root pages (25) plus design/ (1)

| Page | Verdict | Why |
|---|---|---|
| `docs/index.md` | REWRITE | Home says "Playbook, knowledge, tracking, and docs in one place" and "toward POC"; internal vocabulary and the wrong era on the first page a client sees. |
| `docs/onboarding.md` | REWRITE | The map of the repo cites `s2d/` paths that no longer exist (lines 21, 36, 43 and throughout) and 2026-08-20 branch states that have merged. The most useful page in the corpus is wrong about every path it names. Move the source out of `docs/` (see S7 step 6). |
| `docs/open-questions.md` | REWRITE | Keep the register; split the client-facing extract onto its own page so the internal groups cannot be shared by accident. 68 inbound links target `/open-questions`, so the URL must not move. |
| `docs/overview.md` | REWRITE | Pre-kickoff POC framing, `updated: 2026-07-27`, and it states the fee ("Fixed fee $100,000", `docs/overview.md:40`) in the Start Here group. Reframe to the SOW-era engagement and drop the fee line. |
| `docs/story.md` | REWRITE | Same era problem: narrates the POC with no mention of the 2026-08-19 kickoff or the eight-week build. |
| `docs/scribl-full-app-spec.md` | REWRITE | Good spec, wrong ledger: its Open Decisions B-F run parallel to `open-questions.md` with no cross-reference. Add a POC-era banner and fold the still-open decisions into the Q register. |
| `docs/input-artifacts.md` | KEEP | Durable link hub, low risk. |
| `docs/sow-mobile-app-development-extract.md` | CUT | Payment terms verbatim plus our own contractual risk analysis ("P2, operationally risky terms"). The risk analysis is Bounteous-internal. Source stays in `product/`. |
| `docs/android-distribution.md` | KEEP | Current, matches the board's Done items. |
| `docs/ios-distribution.md` | KEEP | Current, honest about the open Apple-account question. |
| `docs/status.md` | MERGE INTO `docs/roadmap.md` | Near-identical milestone table, same POC track, one fewer stale page to banner. |
| `docs/board.md` | REWRITE | Needs the "POC track, not the eight-week plan" banner `onboarding.md` already prescribes, and the S-020 row contradicts `backlog-epics.md` E15 (parked vs live). |
| `docs/roadmap.md` | REWRITE | Same banner; absorbs status.md. |
| `docs/sprint-zero.md` | REWRITE | Keep, but its "What discovery produces" table is the third copy of the same table (also in `timeline-and-milestones.md` and `backlog-epics.md`). Link instead of pasting. |
| `docs/timeline-and-milestones.md` | KEEP | Becomes the canonical home of the calendar, holiday-collision, discovery, and overrun tables that `backlog-epics.md` currently duplicates. |
| `docs/board-selection.md` | CUT | Its own text lists what "must not reach a client-visible board" and names individuals as risks. Internal by self-declaration; keep source-only. |
| `docs/client-priority-to-delivery-week.md` | KEEP | Current (2026-08-24), honest about its own gaps. |
| `docs/backlog-epics.md` | REWRITE | The plan of record, but it pastes about 150 lines of tables that `timeline-and-milestones.md` also carries. Keep the epic narrative and capacity framing, link the calendar material. |
| `docs/production-backlog.md` | REWRITE | Three supersession layers deep (superseded by expo-rebuild-epics, itself superseded by backlog-epics) and the only one of the trio with no banner. Add the banner, move to Archive in the sidebar. |
| `docs/production-sprint-backlog.md` | KEEP | Already carries the model supersession banner. Archive group. |
| `docs/production-backend-plan.md` | KEEP | Old date, current content; the one page that names the architecture divergences honestly. |
| `docs/expo-rebuild-epics.md` | REWRITE | Half superseded (sprint mapping), half live (RE-F long-horizon inventory that backlog-epics cites). Needs a banner that says which half is which. Archive group. |
| `docs/future-scale-track.md` | KEEP | Still the only place the 100k-concurrent gap is named. |
| `docs/jira-board.md` | MERGE INTO `docs/epic-board-mapping.md` | The mapping page already does everything this page does plus the actual band and key tables. Zero inbound links to lose. |
| `docs/epic-board-mapping.md` | KEEP | Current (2026-08-24), SCRIBL keys throughout. |
| `docs/design/poc-realignment-plan.md` | KEEP | Highest-value page per onboarding, currently orphaned from all navigation. Gets a sidebar entry in The Product. |

### Context tree (42)

| Page | Verdict | Why |
|---|---|---|
| `docs/context/index.md` | KEEP | Curated generated landing; improves automatically as the tree shrinks. |
| `docs/context/data/scribl-d2c-aws-estimate-v3.md` | CUT | A spreadsheet pasted into markdown: 30-column M1-M30 tables, 15-decimal values, vendor rate card. `cost-model.md` is the readable version. Source workbook stays. |
| `docs/context/design-history/index.md` | KEEP | The model index page: reading order plus one line per page. |
| `docs/context/design-history/latest-designs.md` | KEEP | Thin iframe wrapper, but nothing else can do its job. |
| `docs/context/design-history/original-wireframes.md` | KEEP | Captioned, cross-linked. |
| `docs/context/design-history/post-workshop-app-flow.md` | KEEP | Same. |
| `docs/context/documents/scribl-d2c-mlp-prfaq.md` | KEEP | The client's own product thesis; source of record for client-summary. |
| `docs/context/documents/scribl-d2c-mvp-scope.md` | KEEP | Short, clean BRD. |
| `docs/context/documents/scribl-poc-handover-v2.md` | CUT | A third party's document marked "Proprietary & Confidential", republished on our site. The distilled pair under `poc/architecture/` carries everything a reader needs. Source stays. |
| `docs/context/documents/scribl-bounteous-sow-mobile-app-development.md` | CUT | The signed contract: fee schedule, signatories, DocuSign envelope IDs as running noise. Not a wiki page. Source stays. |
| `docs/context/future-architecture-aws.md` | REWRITE | Composed page that pastes the entire `scribl-poc-aws-architecture` research note verbatim, frontmatter and all (the `---\ntype: research` block renders mid-page), plus a second copy of the cost table. Reduce to diagram, one-paragraph summary, links to the architecture README and cost-model. |
| `docs/context/media/index.md` | CUT | Three bare links, no captions. Design History already does this job with captions. |
| `docs/context/media/scribl-aws-architecture-d2c.md` | MERGE INTO `docs/context/future-architecture-aws.md` | A 12-line stub around the architecture diagram that page already needs. |
| `docs/context/media/scribl-d2c-flow.md` | MERGE INTO `docs/context/design-history/original-wireframes.md` | Same image already embedded there with narrative. |
| `docs/context/media/scribl-live-app-flow-2026-07-20.md` | MERGE INTO `docs/context/design-history/post-workshop-app-flow.md` | Same. |
| `docs/context/pages/README.md` | CUT | An ingest provenance trail (what came from `product/inputs/` and where it landed). Serves agents doing provenance work, not site readers. Source stays. |
| `docs/context/pages/reference/arc-ideation-readme.md` | CUT | A README for a different repo: its file map (`clients/scribl/`), its `/arc-overview` command. Dead wayfinding for a filesystem that is not here. |
| `docs/context/pages/reference/architecture-plan.md` | KEEP | An honest signpost page ("this material is split across the pages below") with 15 inbound links. Archive group. |
| `docs/context/pages/reference/client-summary.md` | REWRITE | June planning frozen as fact: 14 weeks, ~6 FTE, Sept 15 launch, a $70K figure, fundraise framing. The executed SOW says 8 weeks, 4 people, prototype. Add a superseded-by-SOW banner; Archive group. |
| `docs/context/pages/reference/discussion-topics.md` | REWRITE | Seven topics all marked Open as of 2026-06-09; the SOW settled several. Annotate what closed. Archive group. |
| `docs/context/pages/reference/discussions/scribl-approach-digest.md` | CUT | Internal negotiation posture: the Anthropic funding pitch, Bedrock co-funding strategy, candid quotes. Source stays. |
| `docs/context/pages/reference/engagement-approach.md` | REWRITE | The most detailed and most wrong page relative to the SOW (14-week plan to launch), and it tells the client they are "a reusable case study for every future ARC pitch" (line 26). Banner plus cut the case-study lines; Archive group. |
| `docs/context/pages/reference/decisions/0001-react-native-primary.md` | KEEP | Confirmed by the shipped app. |
| `docs/context/pages/reference/decisions/0002-serverless-first-backend.md` | REWRITE | Contradicted by the shipped Lambda path and the backend plan; needs a superseded note so it stops reading as live. |
| `docs/context/pages/reference/decisions/0003-ai-pipeline-separate-service.md` | REWRITE | Same: Fargate decision, Lambda reality. |
| `docs/context/pages/reference/decisions/0004-aurora-serverless-system-of-record.md` | KEEP | The one properly superseded ADR; keep as the pattern. |
| `docs/context/pages/reference/decisions/0005-aws-cdk-iac.md` | KEEP | Holds. |
| `docs/context/pages/reference/decisions/0006-drawing-canvas-skia.md` | KEEP | Holds; the voice half is tracked as Q18. |
| `docs/context/pages/reference/decisions/0007-submit-to-unlock-data-layer.md` | KEEP | The product's core rule. |
| `docs/context/pages/reference/decisions/0008-analytics-separate-pipeline.md` | REWRITE | PostHog is the analytics system of record now; the ADR still says Kinesis and Athena. |
| `docs/context/pages/reference/decisions/0009-claude-provider-abstraction.md` | KEEP | Sound, unexercised. |
| `docs/context/pages/reference/decisions/0010-async-ai-pipeline.md` | REWRITE | The principle holds; the described SQS mechanism is not what shipped. One paragraph fixes it. |
| `docs/context/pages/reference/decisions/0011-model-tiering.md` | KEEP | Sound, unexercised. |
| `docs/context/pages/reference/decisions/README.md` | KEEP | Real landing page: ADR status table plus the nine unpromoted gating decisions. Becomes the group index when ADRs hoist to top level. |
| `docs/context/pages/reference/poc/architecture/README.md` | KEEP | The canonical target-architecture narrative and diagram. |
| `docs/context/pages/reference/poc/architecture/cost-model.md` | KEEP | The canonical, readable cost page. Client visibility of the TCO figures is Rob's call; if it stays, it is the only cost page (see S3 case 2). |
| `docs/context/pages/reference/poc/architecture/mission-cloud-enhancement-pipeline.md` | KEEP | Half of the best-handled pair in the wiki (studied design vs shipped reality, cross-linked both ways). |
| `docs/context/pages/reference/poc/architecture/our-enhancement-pipeline.md` | KEEP | The other half. |
| `docs/context/pages/reference/poc/project-dna/AGENTS.md` | CUT | Operating notes for a coding agent, published as a wiki page. It also states the repo is AI-agent-built, which is not a page for a client to find by browsing. Source stays. |
| `docs/context/pages/reference/poc/project-dna/CLAUDE.md` | CUT | Same species: stack rules and npm commands for an agent. |
| `docs/context/pages/reference/scribl-team-model.md` | CUT | 310 lines restating architecture, ADRs, and risks that live elsewhere, plus staffing and FTE internals. Everything unique in it is superseded by the SOW. Source stays. |
| `docs/context/pages/reference/technical-implementation-plan.md` | REWRITE | The most detailed build plan, worth keeping, but it needs a banner (14-week plan, EAS tooling that `project-dna` explicitly forbids) and its section 9 cost tables should point at cost-model instead of restating it. |

### Epics (17)

| Page | Verdict | Why |
|---|---|---|
| `docs/epics/index.md` | KEEP | Banded tables with Epic, Features, Jira columns; already the format the epic pages themselves lack. |
| `docs/epics/e00.md` ... `docs/epics/e15.md` (16 pages: e00, e01, e02, e03, e04, e05, e06, e07, e08, e09, e10, e11, e12, e13, e14, e15) | REWRITE (group) | One generator fix in `renderEpicPage` and friends; section 5 has the before-and-after. Content is fine; the format is the complaint, and it is real. |

### Stories (25)

| Page | Verdict | Why |
|---|---|---|
| `docs/stories/index.md` | REWRITE | A bare generated link list for 23 stories. Regenerate as a status table (story, status, stage) so it reads like a board. |
| `docs/stories/README.md` | MERGE INTO `docs/stories/index.md` | The README explains the story format; the index lists the stories. One landing page does both. |
| `docs/stories/S-001-prompt-of-the-day.md` ... `docs/stories/S-023-handbook-from-confluence.md` (23 pages: S-001, S-002, S-003, S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-011, S-012, S-013, S-014, S-015, S-016, S-017, S-018, S-019, S-020, S-021, S-022, S-023) | REWRITE (group) | One generator bug: `syncFile` prepends its own frontmatter and then emits the source's frontmatter as body text, so every story page opens with a broken `id: S-001 title: ... status: done` paragraph between two horizontal rules (`docs/stories/S-001-prompt-of-the-day.md:8-17`). Section 5 has the fix. Also wire `buildStoriesSidebar` into `config.ts` so the tree stops being invisible. |

### Handbook (22)

| Page | Verdict | Why |
|---|---|---|
| `docs/handbook/index.md` | KEEP | Real landing page with a scope note. |
| `docs/handbook/backlog-and-workflow.md` | KEEP | Carries the story-sync rule; current. |
| `docs/handbook/ceremonies.md` | KEEP | Client-safe process reference. |
| `docs/handbook/client-facing-ways-of-working.md` | REWRITE | Titled for the client, written as internal coaching about managing the client ("Do not design in front of the client", the Pramod-then-KV escalation path). Either make it genuinely client-facing or move the coaching to source-only. As shipped it reads badly the moment the client finds it. |
| `docs/handbook/definition-of-done.md` | KEEP | Fine. |
| `docs/handbook/definition-of-ready.md` | KEEP | Fine. |
| `docs/handbook/estimation.md` | KEEP | Fine. |
| `docs/handbook/glossary.md` | KEEP | Fine. |
| `docs/handbook/release-management.md` | KEEP | Fine. |
| `docs/handbook/roles-and-raci.md` | KEEP | Fine. |
| `docs/handbook/story-and-ac-templates.md` | KEEP | Human-readable template guidance, distinct from the machine templates below. |
| `docs/handbook/team-chartering.md` | KEEP | Fine. |
| `docs/handbook/team-process.md` | MERGE INTO `docs/handbook/backlog-and-workflow.md` | 22 lines that restate ground the workflow and ceremonies pages own. |
| `docs/handbook/story-ac-kit/index.md` | KEEP | The kit's usage doc; it also carries the client-safety rule the rest of the site should adopt. |
| `docs/handbook/story-ac-kit/backlog-management.md` | KEEP | Team documentation. |
| `docs/handbook/story-ac-kit/enforcement-gates.md` | KEEP | Same. |
| `docs/handbook/story-ac-kit/jira-filing-pipeline.md` | KEEP | Same. |
| `docs/handbook/story-ac-kit/kit-readme.md` | MERGE INTO `docs/handbook/story-ac-kit/index.md` | Two overview pages for one kit. |
| `docs/handbook/story-ac-kit/platform-jira-bitbucket.md` | KEEP | Same. |
| `docs/handbook/story-ac-kit/team-invariants.md` | KEEP | Same. |
| `docs/handbook/story-ac-kit/template-issue-work-item.md` | CUT | A machine-parsed skeleton (`<trigger>`, `<KEY-n>` placeholders, "keep the heading text byte-identical"). Zero reader value as a rendered page. Source stays; the skills read the source. |
| `docs/handbook/story-ac-kit/template-story-v3-jira.md` | CUT | Same. |

### Knowledge (25)

| Page | Verdict | Why |
|---|---|---|
| `docs/knowledge/index.md` | MERGE INTO the knowledge landing | The generated flat list is the top-nav Knowledge target and it hands a reader the roster and both raw transcripts with no framing. Replace with a landing rendered from `knowledge/README.md` (section 4 has the mechanism). |
| `docs/knowledge/README.md` | REWRITE | The better landing page (it explains the tree), but its directory table omits `team/`, and after the rule change it renders at `/knowledge/` instead of alongside a competing index. |
| `docs/knowledge/PROVENANCE.md` | CUT | Ingest audit trail covering only the June ingest. Agents need it; readers do not. Source stays. |
| `docs/knowledge/meetings/index.md` | REWRITE | Good format (one-line TL;DRs), but it must be regenerated once the internal digests leave the render, and some TL;DRs leak internal staffing detail on their own. |
| `docs/knowledge/meetings/2026-07-14-workshop.md` | KEEP | Digest of a meeting the client attended. |
| `docs/knowledge/meetings/2026-08-18-alignment.md` | CUT | Internal call: staffing rationale, "this engagement is where Bounteous wants client demos", QA unfilled. Source stays. |
| `docs/knowledge/meetings/2026-08-19-kickoff.md` | KEEP | Client meeting, factual digest. |
| `docs/knowledge/meetings/2026-08-20-kickoff-walkthrough.md` | CUT | `onboarding.md:151` already labels it "Internal only". Blunt talk about displacing the prior vendor. Source stays. |
| `docs/knowledge/meetings/2026-08-24-standup.md` | REWRITE | Scrub before 2026-08-26: a colleague's personal emergency, "I'm not always available" self-assessment, Excel-dump contingency framing. |
| `docs/knowledge/meetings/scribl-approach-discussion.md` | CUT | Pre-engagement internal strategy call (Anthropic funding, minimal-team proof point). Source stays. |
| `docs/knowledge/meetings/standups.md` | REWRITE | The page the client reads from 2026-08-26. Today it carries PTO and emergency details (lines 48-51), the internal blocker list, and the line telling the client that solutioning happened before they were in the room. |
| `docs/knowledge/meetings/raw/2026-07-14-workshop.md` | CUT | 1,652 lines of verbatim transcript with full names and banter, one click from top nav via the knowledge index. Nobody reads it on the site; the digest and retro carry the content. Source stays. |
| `docs/knowledge/meetings/raw/scribl-prekickoff-20260818.md` | CUT | Same, including candid staffing talk. Source stays. |
| `docs/knowledge/raw/2026-07-14-scribl-kickoff-workshop-review.md` | MERGE INTO `docs/knowledge/wiki/sources/2026-07-14-scribl-kickoff-workshop.md` | Near paragraph-level duplicate of the durable retro. The retro is the survivor; the review's few unique action items fold in. |
| `docs/knowledge/research/scribl-ai-enhance-drawing-plan.md` | CUT | Part 1 restates `mission-cloud-enhancement-pipeline.md` heading for heading. Second site URL for the same pipeline. Source stays for wiki tooling. |
| `docs/knowledge/research/scribl-client-summary.md` | CUT | Condensed second copy of `reference/client-summary.md` at a second URL. This cluster is the "same Scribl thing several times" Rob saw. Source stays. |
| `docs/knowledge/research/scribl-engagement-approach.md` | CUT | Same pattern. |
| `docs/knowledge/research/scribl-poc-aws-architecture.md` | CUT | 90 percent identical to the architecture README, and also pasted bodily into `future-architecture-aws.md`. Third URL for one narrative. |
| `docs/knowledge/research/scribl-team-model.md` | CUT | Second copy, and the reference original is itself leaving the render. |
| `docs/knowledge/research/scribl-technical-implementation-plan.md` | CUT | Second copy of the implementation plan. |
| `docs/knowledge/team/roster.md` | CUT | Personal email addresses for both sides, staffing gaps, "the board card still reads 'Eric Rice?'". The single least client-safe page on the site, one click from top nav. Source stays; fix its omission from `knowledge/README.md`'s table while at it. |
| `docs/knowledge/wiki/index.md` | REWRITE | Five of six sections read "None yet." Trim to what exists (Sources) until the wiki has content. |
| `docs/knowledge/wiki/log.md` | CUT | One-entry append-only ingest log; tooling exhaust. Source stays. |
| `docs/knowledge/wiki/sources/2026-07-14-scribl-kickoff-workshop.md` | KEEP | The durable workshop retro; nav Workshops target. |
| `docs/knowledge/wiki/sources/2026-08-19-scribl-build-kickoff.md` | KEEP | Same for the build kickoff. |

### Reviews (14)

| Page | Verdict | Why |
|---|---|---|
| `docs/reviews/index.md`, `docs/reviews/README.md`, and the 12 review pages (`2026-07-01-increment-1-planning-review`, `2026-07-01-scribl-poc-loom-loop-design`, `2026-07-08-scribl-future-backlog`, `2026-07-08-scribl-poc-gap-report`, `2026-07-22-ios-distribution-and-build`, `2026-07-27-generator-upgrade-note`, `2026-07-27-knowledge-format-assessment`, `2026-07-27-meta-repo-review`, `2026-07-27-production-backlog-planning`, `2026-08-21-story-ac-kit-review-install`, `2026-08-24-meta-repo-structure-audit`, `backflow-multi-repo-model`) | CUT (group) | Reviews are the self-improvement trail: candid process failures, "the board undersells progress", testing-gap admissions, agent-orchestration jargon. Exactly the material the flywheel needs and exactly what a client should never browse. They are already invisible in nav (`buildReviewsSidebar` is never imported), so cutting the render loses nothing a reader has today. `reviews/` stays in the repo untouched; only the docs-sync rule and the rendered copies go. |

One relocation inside the source tree worth doing while there:
`reviews/2026-07-01-scribl-poc-loom-loop-design.md` is a design spec, not a
review; it was parked there in July. It belongs in `product/design/`.

## 3. Duplication register

Generated copies are excluded by construction. The `RULES` array
(`scripts/docs-sync.mjs:35-63`) maps `product/`, `tracking/`, `handbook/`,
`reviews/`, `knowledge/` into `docs/`, and `syncEpicPages` plus the
`narrative` rule split `tracking/backlog-epics.md` into `docs/epics/*` and a
truncated `docs/backlog-epics.md` (verified: the rendered narrative stops at
"The epics themselves" and no epic body repeats). The ADRs exist at three
paths (`product/inputs/reference/decisions/` authored,
`product/context/pages/reference/decisions/` written by context-ingest,
`docs/...` written by docs-sync) but at exactly one site URL each; a diff on
0001 shows only a two-line provenance header between stages. That chain is
correct by design, though committing the `product/context` intermediate to git
is why the same basename shows up three times in searches.

Real duplication, canonical page first:

1. **The engagement reference docs are each published twice.** Four pairs:
   `context/pages/reference/client-summary.md` vs
   `knowledge/research/scribl-client-summary.md`, and the same for
   `engagement-approach`, `scribl-team-model`,
   `technical-implementation-plan`. Both sides of each pair were ingested
   independently from the same `product/inputs/reference/` source, both are
   sidebar-linked (Reference group; Knowledge > Research group). Canonical:
   the `context/pages/reference/` full artifact, because it is the complete
   record and the research file's own frontmatter cites the same upstream.
   Action: the research digests leave the render (S2). This cluster is the
   single biggest duplication in the wiki and the likeliest source of Rob
   seeing "the same Scribl thing several times".
2. **The architecture and cost narrative is reachable at three URLs.**
   `context/future-architecture-aws.md` pastes the entire
   `knowledge/research/scribl-poc-aws-architecture.md` note verbatim
   (frontmatter block visibly rendering mid-page) and re-derives the workbook
   summary table that `poc/architecture/cost-model.md` already distills. The
   research note is itself about 90 percent the same prose as
   `poc/architecture/README.md`. Canonical: the architecture README for the
   narrative, cost-model for the numbers, determined by completeness and by
   `onboarding.md:199-203` naming the mirrors as mirrors. Action: rewrite
   future-architecture-aws down to diagram plus links; cut the research note
   from the render. `technical-implementation-plan.md` section 9 restates the
   same TCO figures a fourth time and should link instead.
3. **The enhancement pipeline is written twice with no cross-link.**
   `knowledge/research/scribl-ai-enhance-drawing-plan.md` Part 1 mirrors
   `poc/architecture/mission-cloud-enhancement-pipeline.md` heading for
   heading; parallel ingests of the same handover PDF, neither citing the
   other. Canonical: the mission-cloud page (fuller, and already half of a
   deliberate pair with `our-enhancement-pipeline.md`). Action: research file
   leaves the render.
4. **`tracking/backlog-epics.md` and `tracking/timeline-and-milestones.md`
   share about 150 lines verbatim.** The calendar, holiday collisions, "What
   discovery produces", and per-lane overrun tables appear in both, and
   `sprint-zero.md` carries a third copy of the discovery table. These are
   hand-maintained sources, so they will drift on the first edit. Canonical:
   timeline-and-milestones (it is the dated-calendar page by charter).
   Action: backlog-epics and sprint-zero link instead of pasting.
5. **The 2026-07-14 workshop resolves to four site URLs.** Transcript ->
   synthesis review -> durable retro -> operational digest. The chain is
   intact provenance, not accidental duplication (each stage cites its
   upstream), but a site reader gets four hits for one event. After S2 the
   render keeps two (digest and retro), which is right: different jobs,
   cross-linked. The synthesis review merges into the retro; the transcript
   goes source-only.
6. **`jira-board.md` duplicates `epic-board-mapping.md`.** The newer mapping
   page (2026-08-24) covers conventions plus the actual band and key tables.
   Canonical: epic-board-mapping, by date and completeness. Action: merge.
7. **`status.md` duplicates `roadmap.md`'s milestone table.** Same POC track,
   near-identical tables, both stale in the same way. Canonical: roadmap.
   Action: merge.
8. **Two open-decision ledgers.** `scribl-full-app-spec.md` Open Decisions B-F
   (POC era) and `open-questions.md` Q1-Q62 (current), no cross-references.
   Canonical: open-questions, actively maintained (`updated: 2026-08-21`).
   Action: fold the spec's still-open items into the register, banner the
   spec.
9. **The three `context/media/` stubs wrap images that design-history already
   embeds with captions.** Canonical: the design-history pages. Action: merge
   the stubs, cut the bare-list media index.
10. **The approach call is written twice.**
    `context/pages/reference/discussions/scribl-approach-digest.md` and
    `knowledge/meetings/scribl-approach-discussion.md` are the same 2026-06-09
    call, digest and wiki-ingest. Both are internal-only, so both leave the
    render; in the source tree the digest is canonical (fuller quotes).

Not duplication, checked and cleared: SOW verbatim vs SOW extract (curated
extract, cites section numbers); PRFAQ vs client-summary (source vs digest);
handover vs enhancement-pipeline pair (labeled source-of-truth relationship);
`production-backlog` -> `expo-rebuild-epics` -> `backlog-epics` (a supersession
chain needing banners, not deduplication); `discussion-topics.md` vs the
approach digest (different documents).

## 4. The index-page problem

Current state: 18 index-flavored pages for 171 pages. Twelve `index.md` files
(home, context, design-history, media, epics, handbook, story-ac-kit,
knowledge, meetings, wiki, reviews, stories) and six `README.md` files
(context/pages, decisions, poc/architecture, knowledge, reviews, stories).
Three directories carry both an `index.md` and a `README.md`:
`docs/knowledge/`, `docs/reviews/`, `docs/stories/`. The brief counted four,
but `docs/context/pages/` on current `main` has only the README.

The mechanism, from `scripts/docs-sync.mjs`: `collectMarkdown` picks up source
`README.md` files and `syncTree` copies them through as ordinary pages
(`docs-sync.mjs:153-166`), while `writeIndex` (`docs-sync.mjs:174-181`)
generates a bare link list as `index.md` whenever the source tree has no
`index.md` of its own. Any source tree with a README and no index therefore
gets both: a hand-written explainer at `/tree/README` and a mechanical list at
`/tree/`. The reader lands on the list; the explanation is one URL over, and
nothing links between them. That is the structural defect: two landing pages
per tree, and the worse one wins the URL.

The rule going forward:

- **A directory gets an index page only if the sidebar presents it as a
  browsable section.** Today that is: home, context, design-history, epics,
  handbook, story-ac-kit, meetings, knowledge, stories. Pass-through
  directories (documents, data, media, research, raw, decisions as a
  sub-group) get sidebar groups, not index pages. Exception: decisions keeps
  its README as the group landing because it carries real content (the status
  table and the unpromoted gating decisions).
- **An index page is a curated landing, not a link dump.** The template is
  `docs/context/design-history/index.md`: two or three sentences of what the
  section is, then links in reading order with one line each. If the page
  would be nothing but links with no framing, delete it and let the sidebar
  do the job.
- **One landing page per directory, at the directory URL.** Mechanically:
  change `syncTree` so that when a source tree has a `README.md` and no
  `index.md`, the README is renamed to `index.md` on the way through and the
  generated link list is not written. Trees with a real source `index.md`
  keep today's behavior. This removes every double without touching source
  files, and GitHub browsing of the source tree keeps its READMEs.

Of the current 18: survive as-is or rewritten: home, context, design-history,
epics, handbook, story-ac-kit, meetings, wiki (trimmed), stories (rebuilt as a
status table), knowledge (the README content at the `/knowledge/` URL), and
decisions/README as the ADR group landing. Removed: media/index (folds into
design-history), reviews index and README (tree leaves the render),
knowledge/index (replaced by the README), stories/README (merges into the
index), context/pages/README (goes source-only),
poc/architecture/README stays but is a content page mis-named README, not an
index; leave its URL alone this pass. Net: 18 -> 11, with no directory
carrying two.

## 5. Readability of the epic pages

Rob is right, and the content underneath is genuinely good. As a reader lands
on `docs/epics/e02.md`:

- The H1 is followed immediately by a bare pipe-joined metadata paragraph:
  `Band **GREEN** | Lane iOS and Backend | Jira SCRIBL-27 | Board card "Auth
  plus onboarding"` (`docs/epics/e02.md:11`). `epicMetaLine`
  (`scripts/docs-sync.mjs:242-250`) joins fields with `|` into plain text.
- A stray leaked parser field renders as its own paragraph right under it:
  `jira: SCRIBL Epic` (`docs/epics/e02.md:13`). That line is machine metadata
  that escaped into the description.
- Every feature is an H3 wall. `e00.md` runs 15 identical-weight H3 blocks
  with no summary; the right-hand outline is useless for scanning.
- Each feature repeats a second unstyled pipe-line (`featureMetaLine`,
  `docs-sync.mjs:252-266`), 91 times across the corpus, burying status, size,
  and blockers as plain text.
- There is no status-at-a-glance: a reader cannot see how many features are
  Next versus Blocked without reading every block.

The epics index (`docs/epics/index.md`) is already the right format: banded
tables. The fix is to apply that pattern one level down, in the generator, not
by hand-editing any page.

Target format for an epic page, mapped to `scripts/docs-sync.mjs` functions.
Before (verbatim, `docs/epics/e02.md:9-33`):

```markdown
# E02 Auth and onboarding

Band **GREEN** | Lane iOS and Backend | Jira SCRIBL-27 | Board card "Auth plus onboarding"

jira: SCRIBL Epic


An account, and the first two minutes that decide whether someone comes back
tomorrow. [...]

## 6 features

### E02-F1 Email and password accounts

Size 3 backend-days | Status Next | Lane Backend | Depends on E01-F3 | Carries forward RE-02

Sign-up, sign-in with real credential validation, [...]
```

After:

```markdown
# E02 Auth and onboarding

An account, and the first two minutes that decide whether someone comes back
tomorrow. [...]

| | |
|---|---|
| Band | GREEN |
| Lane | iOS and Backend |
| Jira | SCRIBL-27 |
| Board card | "Auth plus onboarding" |

## Features

| # | Feature | Size | Status | Depends on |
|---|---|---|---|---|
| F1 | Email and password accounts | 3 backend-days | Next | E01-F3 |
| F2 | Token issuance and native secure storage | 3 iOS-days | Next | F1 |
| F3 | Invite token backend | 3 backend-days | Blocked | E01-F3 |

## F1: Email and password accounts

**3 backend-days | Next | Backend | depends on E01-F3 | carries forward RE-02**

Sign-up, sign-in with real credential validation, [...]
```

Generator changes: `renderEpicPage` (`docs-sync.mjs:268`) emits the
description first, then a two-column table from `epicMetaLine`'s fields, then
a new `renderFeatureSummaryTable(features)` before the per-feature loop, and
promotes feature headings from H3 to H2 so the VitePress outline lists them;
`featureMetaLine` becomes one bold scannable line; and the stray `jira:` field
gets filtered out of descriptions. `renderEpicsIndex` needs no change.

The story pages have a different disease, a bug rather than taste: `syncFile`
(`docs-sync.mjs:133-142`) prepends its own generated frontmatter, then appends
the source body untouched, and every `tracking/stories/S-*.md` opens with its
own frontmatter block. Only the first block parses as frontmatter; the second
renders as body, so every story page opens with two horizontal rules
bracketing a collapsed `id: S-001 title: Prompt-of-the-day status: done ...`
paragraph before the H1 (`docs/stories/S-001-prompt-of-the-day.md:8-17`). Fix
in `syncFile`: strip a leading `--- ... ---` block from the body, parse its
flat fields, and render them as a small metadata table under the H1 (status,
owner, stage/phase, labels). Below the bug, story pages are fine: short lead,
`## AC` checklist, no wall-of-text.

## 6. Client-readable versus internal

The site has no visibility boundary today: every page docs-sync renders is
served, nav-linked or not, and the top-nav Knowledge link lands on the
unfiltered generated index. The client joins standup 2026-08-26 and reads
`/knowledge/meetings/standups`; the prioritization workshop is 2026-08-25.
Ordered by urgency:

Must move before 2026-08-26 (nav-reachable, on the client's reading path):

- `docs/knowledge/meetings/standups.md:48-51`: a named colleague's personal
  emergency and another's PTO dates. Also the internal "Needs Rob or a
  decision" blocker list (lines 85-101) and the note that the client joins
  from 2026-08-26 with "questions and solutioning" happening before then,
  which tells the client exactly what was decided out of their sight.
- `docs/knowledge/meetings/2026-08-24-standup.md`: the full version of the
  same, including "I'm not always available, so I want to make sure I'm not
  always the blocker" and the Excel-dump contingency if the eight weeks end
  without a test rig.
- `docs/knowledge/team/roster.md:37-59`: personal email addresses for both
  sides, and lines 94-107 air staffing gaps including "the board card still
  reads 'Eric Rice?' with a question mark" about the client's own executive.
  One click from top nav via the knowledge index.
- `docs/knowledge/index.md:14-31`: the nav target that links the roster and
  both raw transcripts.
- `docs/overview.md:40`: "Fixed fee $100,000 ... 50/50 payment split" in the
  Start Here group.

High, one level deeper but browsable:

- Both raw transcripts (`docs/knowledge/meetings/raw/2026-07-14-workshop.md`,
  1,652 lines; `raw/scribl-prekickoff-20260818.md`): verbatim internal
  speech, full names, candid asides, and Rob explaining that the POC design
  "is my design, not fully theirs".
- Both SOW pages (`docs/sow-mobile-app-development-extract.md:50-57,362-419`;
  `docs/context/documents/scribl-bounteous-sow-mobile-app-development.md:378-388`):
  payment schedule verbatim, signatories, plus our own risk-item analysis.
- `docs/context/pages/reference/engagement-approach.md:26,191`: the client as
  "a reusable case study for every future ARC pitch".
- `docs/knowledge/meetings/scribl-approach-discussion.md:34-101`: Anthropic
  funding strategy, Bedrock co-funding, a directive to run a minimal team as
  a methodology proof point.
- `docs/knowledge/meetings/2026-08-18-alignment.md:28-74` and
  `2026-08-20-kickoff-walkthrough.md:52-96`: internal staffing rationale and
  blunt talk about taking over from the prior vendor.
- `docs/knowledge/meetings/2026-08-19-kickoff.md:134-135`: the SOW covers
  "roughly 1/3 of the scope". Said in a client meeting, so lower risk, but it
  reads differently in writing.
- Cost pages (`cost-model.md:25-80`, `data/scribl-d2c-aws-estimate-v3.md`):
  TCO and unit economics. The estimate workbook page should go regardless;
  whether cost-model stays client-visible is Rob's call (S8).
- `docs/handbook/client-facing-ways-of-working.md`: internal coaching on
  handling the client, under a title that invites the client to read it.
- `docs/board-selection.md`: names individuals as risks and lists what "must
  not reach a client-visible board".

Medium, jargon rather than leaks: "playbook" and "the brain" on the homepage
tagline and `roadmap.md:27`; S2D, harness, and agent vocabulary across
onboarding, the story/AC kit pages, and `epics/e00.md:27`;
`project-dna/AGENTS.md:12` states the repo is AI-agent-built. All of
`docs/reviews/` is candid self-critique but is not nav-reachable today
(URL-guess only); it still leaves the render in S2.

Checked and clean: no legacy consulting-firm name anywhere under `docs/`
(Mission Cloud is the real prior subcontractor, named factually), and no
absolute machine paths.

## 7. Sequenced execution plan

`npm run docs:build` runs with `ignoreDeadLinks: false` and is green today,
so the invariant is: after every step, sync then build. docs-sync never
prunes (`applyRule` writes and skips), so every CUT needs both a rule change
and a `git rm` of the rendered copy. Inbound-link counts below come from a
link-graph pass over all markdown in `docs/` and the source trees.

**Step 0. Land this audit without publishing it.** Merge this file with no
`docs:sync`. If a sync must run first for any other reason, do step 2 before
it.

**Step 1. Generator fixes, no link impact.** In `scripts/docs-sync.mjs`:
the story frontmatter strip in `syncFile`, the epic page format
(`renderEpicPage`, `epicMetaLine`, `featureMetaLine`, new summary table, H3
to H2, filter the stray `jira:` field), and the `syncTree` README-as-index
rule from S4. Then `docs:sync`, `git rm` the newly orphaned
`docs/knowledge/index.md` replacement leftovers if any, build. Link fixes:
`docs/stories/index.md` regenerates, so its links to `README` go away with
the README; nothing else links any story README
(only `docs/stories/index.md:8` did).

**Step 2. Cut the internal trees from the render.** Remove the `reviews`
rule (`docs-sync.mjs:62`); add an exclude mechanism to the `knowledge` and
`context` tree rules covering `knowledge/meetings/raw/`, `knowledge/raw/`,
`knowledge/team/`, `knowledge/research/`, `knowledge/PROVENANCE.md`,
`knowledge/wiki/log.md`, `context/pages/README.md`,
`context/pages/reference/poc/project-dna/`,
`context/pages/reference/discussions/`,
`context/pages/reference/{arc-ideation-readme,scribl-team-model}.md`,
`context/documents/{scribl-poc-handover-v2,scribl-bounteous-sow-mobile-app-development}.md`,
`context/data/`; drop the root rules for
`sow-mobile-app-development-extract.md` and `board-selection.md` (that one is
`tracking/board-selection.md`; also remove its `config.ts:31,149` guard and
entry). `git rm` all rendered copies. Link fixes required, from the link
graph: `docs/knowledge/meetings/2026-07-14-workshop.md` and the wiki source
pages link the raw transcripts (frontmatter `source:` pointers and body
links); rewrite those to name the source file without linking.
`docs/input-artifacts.md` links the SOW extract and estimate pages; reroute
to the surviving cost-model and drop the SOW row. `docs/onboarding.md` links
board-selection and the SOW extract; fixed in step 6's rewrite, so re-order:
do the onboarding rewrite in the same commit or point those links at
`epic-board-mapping` and `overview` now. `future-architecture-aws.md` links
`scribl-poc-aws-estimate` data page and the research note; fixed by its step
4 rewrite, so stage that rewrite here if the build complains. Internal
digests (2026-08-18, 2026-08-20, approach-discussion) are linked from
`docs/knowledge/meetings/index.md` only; that index regenerates. Sync,
build.

**Step 3. Sidebar restructure to the S1 spine.** Pure `config.ts` and
`sidebar.mts` work: import and wire `buildStoriesSidebar`; add the ADR
top-level group (reuse `buildDecisionsGroup`); add the Archive group; add
`design/poc-realignment-plan` to The Product; retitle groups. No URLs move,
so no link fixes. Build.

**Step 4. Merges.** `tracking/status.md` into `tracking/roadmap.md` (6
inbound references to `/status`: page links at `docs/overview.md:34,52`,
`docs/index.md:33`, `docs/story.md:53`, the home hero tile at
`docs/index.md:10`, and the sidebar entry at `config.ts:118`; update all in
the sources, then drop the rule and `git rm docs/status.md`). `tracking/jira-board.md` into
`tracking/epic-board-mapping.md` (zero inbound page links; remove the
`config.ts:35,154` guard and entry, drop rule, `git rm`). The three
`product/context/media` stubs into the design-history pages and
`future-architecture-aws` (media pages have sidebar entries only via
`buildArchitectureGroup`; remove that group; `docs/context/index.md`
regenerates via context-ingest, and 7 inbound links to
`context/media/scribl-d2c-flow` from design-history pages already point at
pages that survive; re-check the graph after the merge).
`knowledge/raw/2026-07-14-...review.md` into the wiki source retro.
`handbook/team-process.md` into `handbook/backlog-and-workflow.md` (nav entry
`config.ts:124` goes; one inbound link from `handbook/index.md`).
`story-ac-kit/kit-readme.md` into `story-ac-kit/index.md` (links from the
kit pages to kit-readme: update three). Each merge: edit source, drop
rule/exclude, `git rm` rendered page, fix the named inbound links, sync,
build.

**Step 5. Rewrites with banners.** The era banners (overview, story, spec,
board, roadmap, backlog-epics, production-backlog, expo-rebuild-epics,
client-summary, engagement-approach, discussion-topics,
technical-implementation-plan, ADRs 0002/0003/0008/0010), the
future-architecture-aws slim-down, the backlog-epics/timeline/sprint-zero
dedup, the standups and 2026-08-24-standup scrub (do these two first if the
26th is close), `client-facing-ways-of-working`, `knowledge/README.md` (add
`team/` row; becomes the landing via step 1's rule), `wiki/index.md` trim,
and `meetings/index.md` regeneration. All content edits at stable URLs; no
link fixes. Sync, build after each batch.

**Step 6. Rehome the hand-authored pages.** `git mv docs/onboarding.md
product/onboarding.md` and `git mv docs/open-questions.md
product/open-questions.md`, add `file` rules for both (dst unchanged:
`onboarding.md`, `open-questions.md`), rewrite onboarding's dead `s2d/`
paths in the same commit. Site URLs do not change, so the 68 inbound links
to `/open-questions` keep resolving. Sync, build.

**Step 7. Optional, Rob's call pending S8.** Split the client-facing extract
out of open-questions; decide cost-model visibility; decide whether the site
needs real access control rather than curation.

Steps 1-3 are independent of 4-6 except where noted and could land as three
PRs; 2 before 3 keeps the sidebar from ever linking a cut page.

## 8. What I could not determine

- **How the client reaches the site.** Whether they get the root URL, a
  hosted deploy, or curated links changes how hard the S2 cuts must be. If
  the client can browse freely, curation is not enough for the SOW and cost
  pages and real access control is worth pricing. What settles it: Rob
  states the sharing model.
- **Whether the six `knowledge/research/` digests have machine consumers.**
  The wiki-querier agent reads the knowledge tree; cutting the rendered pages
  is safe (sources stay), but if anything reads the rendered URLs it breaks.
  What settles it: grep the agents in `.claude/agents/` for `docs/knowledge`
  reads (I read their descriptions, not their bodies; they appear to read
  source, not `docs/`).
- **Cost-model visibility.** The client co-funds the infrastructure, so the
  TCO figures may be deliberately shared. I kept the page and cut the raw
  workbook; Rob should confirm.
- **Whether the SOW pages were published deliberately.** The client signed
  the SOW, so the terms are not secret from them; publishing signatures and
  envelope IDs on a wiki is still wrong by default. I recommended CUT for
  both; if Rob wants the extract to stay, strip the risk-analysis and
  signature sections instead.
- **The `patterns/` verdict.** This morning's audit says WIRE; I recommend
  repo-only (S1). One of the two recommendations has to lose; Rob picks.
- **Epic page count drift.** The epics are generated from
  `tracking/backlog-sprint0.md` plus `tracking/backlog-epics.md`; e08-e10 and
  e12-e15 have no Jira keys in `EPIC_KEYS` (`docs-sync.mjs:204-208`). Whether
  that is "not yet filed" (as rendered) or stale mapping I could not tell
  from the repo. What settles it: compare against the SCRIBL board, which I
  was constrained not to touch.
- **Whether anything outside the repo deep-links the URLs this plan removes**
  (research digests, raw transcripts, jira-board, status). Meeting notes or
  Slack may carry them. What settles it: a redirect list at deploy, or a
  quick search of the places links get pasted.

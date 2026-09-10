---
type: source
title: "Scribl x Bounteous Build Kickoff -- Retro (2026-08-19)"
description: Durable retro of the 2026-08-19 client build kickoff -- scope cut to ~1/3 of the SOW, iOS confirmed as the sole platform, MVP simplified on client direction. The 2026-08-20 internal walkthrough surfaced the iOS shipping unknowns.
source-type: workshop
date-ingested: 2026-08-24
author: Bounteous (Angie Yap, David Lawton, John Kilgore, Rob Forshier II) + Scribl (Matthew Kaplan, Eric Rice, Martin Young)
date: 2026-08-19
source: meetings/2026-08-19-kickoff.md
transcript: internal raw transcript, not in the rendered site
tags: [scribl, kickoff, retro, build-phase, scope, ios, mvp]
---

# Scribl x Bounteous Build Kickoff -- Retro (2026-08-19)

Durable retro of the 2026-08-19 client build kickoff. The operational digest
lives at
[`knowledge/meetings/2026-08-19-kickoff.md`](../../meetings/2026-08-19-kickoff.md);
the internal delivery-team walkthrough that put this material in front of the
India team the next day is at `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`
(internal, not in the rendered site).

This is a different animal from the 2026-07-14 workshop. July set the North
Star and made eight product decisions on what to build. August kicked off the
actual eight-week build phase: what got confirmed, what got cut, and what the
build team found once it looked at the material.

**Format:** the digest does not record platform, duration is logged as 60
minutes.

Attendance is recorded in the digest frontmatter: Angie Yap, David Lawton,
Eric Rice, John Kilgore, Martin Young, Matthew Kaplan, Rob Forshier II. John
Kilgore appears only in opening remarks. Pramod Kumar was invited tentative
but did not speak and is not counted as an attendee.

## How the kickoff went

Three things came out of this call that change the shape of the engagement
against what July assumed.

Scope shrank. July priced and decided against the full SOW; this kickoff
confirmed the first engagement is roughly one third of that scope, an
eight-week clock that starts the following Monday: a two-week
discovery/prototype-alignment phase, then three two-week build sprints.

Platform narrowed. July's decisions did not name a single platform and
several (voice memo, Android dictation) assumed both iOS and Android existed
side by side. This kickoff closed that: Eric Rice confirmed iOS is "probably
the best way forward," and the digest reads it as settled, not reopened.
Android is now out of the eight-week window entirely.

Direction on the MVP moved to subtraction, not addition. Eric Rice said the
client-side response to the prototype has been "you need less... it's
actually slimming this down." Concretely: daily prompts stay client-curated
by Scribl's own program team (mental-health and education professionals)
rather than Claude-generated, because those prompts go through the client's
own safety review; comments stay out, reactions ship as a baseline and open
commenting is deferred and, if it ever ships, gated behind a per-wall-host
toggle; monetization hooks get built into the infrastructure now, but stay
switched off at launch, because "we do not want this to be a freemium
product forever" (Matthew Kaplan) but pricing itself is not decided.

Working agreements landed cleanly: daily morning stand-ups, a Wednesday
morning demo/handoff cadence (chosen to preserve India-team overlap), demos
over slide decks, Jira as the shared board, code starting in a
Bounteous-owned repo with a later migration to Scribl's repo, and Google
Drive over the Microsoft ecosystem for file sharing.

Re:Invent stays the north star launch date on both sides; Matthew Kaplan
said the client is "all aligned around that date," which matches July's
re-anchoring and was not revisited here.

One thing did not move: the four roster gaps flagged the day before at the
2026-08-18 pre-kickoff alignment call (no PM assigned, QA role unfilled,
Pankaj Aggarwal not full-time, no full-time iOS developer) are not mentioned
anywhere in this transcript. They are still open, not resolved by silence.

## Decisions made

| # | Decision | The call | Owner | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Engagement scope | ~1/3 of the original SOW; eight-week clock starts Monday | David Lawton | Matches the available AWS-funded budget |
| 2 | Engagement structure | Two-week discovery/prototype-alignment phase, then three two-week build sprints | David Lawton | Sequences discovery before commitment |
| 3 | Platform | iOS only for this phase | David Lawton proposed, Eric Rice confirmed | Client has no stated need for Android in this window |
| 4 | Demo/handoff cadence | Wednesday mornings, US time | David Lawton proposed, Eric Rice agreed | Preserves India-team overlap |
| 5 | Readout format | Lightweight demos, not slide decks | Matthew Kaplan | "Move fast, get to the demo" |
| 6 | Board tool | Jira | David Lawton asked, Eric Rice confirmed | Shared backlog visibility |
| 7 | Code home | Starts in a Bounteous-owned repo, migrates to Scribl's repo later | Rob Forshier II proposed, Eric Rice agreed | Lets the team start before Scribl repo access exists |
| 8 | File-sharing channel | Google Drive | Eric Rice | Client preference to stay outside the Microsoft ecosystem |
| 9 | Daily prompts | Stay client-curated by Scribl's own program team; Claude/agent role is drafting suggestions and validating against the client's own corpus, not generating final prompts unsupervised | Eric Rice, Martin Young, Rob Forshier II | Prompts go through the client's own mental-health/safety review |
| 10 | Comments and reactions | Reactions ship as baseline; open commenting deferred past MVP and, if built, gated per-wall-host | Matthew Kaplan, Eric Rice | Keeps the product away from open-comment negativity |
| 11 | Monetization hooks | Infrastructure/paywall hooks built now, not switched on at launch; before/after and multi-variant paywall testing planned | Matthew Kaplan, David Lawton | "We do not want this to be a freemium product forever" |

Eleven rows. July had eight; this is a different set of decisions, not a
continuation of the same table, so it is not padded to match.

## What the delivery walkthrough surfaced

The India delivery team had not sat in on any client call. Putting the
kickoff material in front of them on 2026-08-20 produced the practical
build-and-ship questions nobody had asked yet, most of them unanswered by
Scribl because Scribl does not know either:

- Which iOS versions, which iPhone models, and whether iPad is in scope.
  Scribl expects Bounteous to recommend.
- How a build reaches Scribl's testers. TestFlight is the leaning, but it
  needs an Apple Developer account Scribl does not have, and internal and
  external tester counts are unknown.
- Who provisions the build host and release pipeline, and whether builds
  ship from developer laptops or CI. The only firm answer so far is that the
  team gets Mac laptops.
- What test scope is in play. Rob Forshier II asked for a full test suite
  plus end-to-end automation; Neelesh Aggarwal put an 80 percent unit
  coverage bar on the table; David Lawton pushed back on spending the
  eight weeks on foundation instead of product.

Three things the walkthrough closed rather than opened: Mission Cloud is out
entirely, Bounteous does 100 percent of the work going forward. The backend
is greenfield, not a reuse of Scribl's existing scribl.co product. And an
App Store release at the end of this phase is explicitly not a commitment
("we don't even know right now if we're pushing an App Store release at the
end of this phase," David Lawton).

## Open questions this kickoff left

Cross-referenced against `tracking/open-questions.md`, updated 2026-08-21:

- Apple Developer / Google Play account provisioning, and timing. **Q5**,
  first raised on 2026-08-19, restated in the 08-20 walkthrough with the
  added consequence that no account also means no signing identity and no
  provisioning profiles.
- Whether AWS environments and accounts come from Scribl, from their AWS
  rep via the funding relationship, or from Bounteous in the interim.
  **Q17**, originally raised 2026-08-18, restated here.
- Speed-to-monetization approach and pricing model, deferred to
  post-testing-phase learning. **Q30**, originally raised in the July
  workshop as pricing, restated here as speed-to-monetization.
- Depth of moderation/content-safety tooling beyond a written point of view
  for phase one. **Q31**, raised on this call and marked deferred by
  agreement, not open.
- Whether/when to loop in the AWS account executive for a progress
  check-in. **Q35**, raised on this call by Angie Yap, not scheduled.
- Which iOS versions, iPhone models, and iPad scope. **Q44**.
- How a build reaches Scribl's testers, and whether that is TestFlight.
  **Q45**.
- How many internal and external testers for the beta. **Q46**.
- Who provisions the build host and release pipeline, laptops or CI.
  **Q47**.

The last four surfaced on 2026-08-20, not the client call itself; they carry
Q44 through Q47 in the register and the register's own note says the full
Q44-Q57 run came out of that walkthrough. Everything above has a registered
Q id. Nothing on this page's open-questions list lacks one.

## Risks raised

The 08-19 digest does not carry a risks table; the risk content that exists
lives in the blockers and open-questions sections already covered above
(no Apple/Google accounts, Christina's fall availability unknown, updated
Figma assets late). The 08-20 walkthrough likewise frames its findings as
blockers and open questions rather than a named risk register. There is no
risks table to reproduce here without inventing one.

## Next steps

- Send updated Figma onboarding/invited-user flows (Eric Rice, promised
  end of day 2026-08-19).
- Send the analytics/success-metrics list used for MVP tracking (Matthew
  Kaplan, undated).
- Share the investor pitch deck outlining target audience and expansion
  plan (Matthew Kaplan, promised end of day 2026-08-20).
- Assign Christina her highest-priority screens to fully design, with the
  team building the rest of the theme around them (Eric Rice / Rob
  Forshier II, undated); set up a recurring ~20-30 minute weekly sync
  between Rob and Christina (Rob Forshier II, undated).
- Check with the AWS account rep on available Apple/Google Play/AWS account
  assets (Eric Rice, undated).
- Propose daily stand-up time blocks to the India team (David Lawton, Rob
  Forshier II, undated).
- From the 08-20 walkthrough: recommend target iOS versions, device
  models, and an iPad call (Neelesh Aggarwal with Pankaj Aggarwal);
  recommend a tester-distribution method in writing (David Lawton with Rob
  Forshier II); scope the testing commitment to what fits eight weeks
  before it is promised (Karuna Arshakota with Neelesh Aggarwal); raise the
  request for physical iOS test devices (Pramod Kumar); get Pankaj Aggarwal
  into the Bitbucket workspace (Rob Forshier II with Pramod Kumar).

## Sources

- Operational digest: [`knowledge/meetings/2026-08-19-kickoff.md`](../../meetings/2026-08-19-kickoff.md)
- Internal walkthrough digest: `knowledge/meetings/2026-08-20-kickoff-walkthrough.md` (internal, not in the rendered site)
- Raw transcript: `knowledge/meetings/raw/2026-08-19-kickoff.vtt` (internal, not in the rendered site)
- Open questions register: [Open questions](/open-questions)
- Meetings index: [`knowledge/meetings/index.md`](../../meetings/index.md)
